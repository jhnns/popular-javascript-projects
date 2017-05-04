"use strict";

const axios = require("axios");
const parseLinkHeader = require("parse-link-header");
const pThrottle = require("p-throttle");
const Queue = require("promise-queue");
const config = require("../../config.js");
const httpCache = require("../httpCache");

const BASE_URL = "https://api.github.com";
const MAX_GET_REQUESTS_PER_SECOND = 5;
const MAX_CONCURRENT_GET_REQUESTS = 30;
const ACCEPT_STAR = "application/vnd.github.v3.star+json";
const http = axios.create({
    timeout: 2 * 60 * 1000,
    headers: {
        Accept: "application/vnd.github.v3+json",
    },
    params: {
        access_token: config.github.accessToken, // eslint-disable-line camelcase
    },
});
const httpGetQueue = new Queue(MAX_CONCURRENT_GET_REQUESTS, Infinity);
const httpGet = pThrottle(
    (url, options) => {
        console.error("GET", url, JSON.stringify(options.params));

        return http.get(url, options);
    },
    1,
    1000 / MAX_GET_REQUESTS_PER_SECOND
);

function isRateLimitError(err) {
    return (
        err.response &&
        err.response.data &&
        err.response.data.message &&
        err.response.data.message.includes("rate limit")
    );
}

async function get(path, params, headers) {
    const url = BASE_URL + path;
    const isCached = httpCache.has(url, params, headers);
    let response;

    try {
        if (isCached === true) {
            response = httpCache.read(url, params, headers);
        } else {
            response = await httpGetQueue.add(() =>
                httpGet(url, {
                    params,
                    headers,
                })
            );
            httpCache.write(url, params, headers, response);
        }

        return response;
    } catch (err) {
        if (isRateLimitError(err)) {
            throw new Error("API rate limit exceeded");
        }
        throw err;
    } finally {
        if (response !== undefined && isCached === false) {
            // Write diagnostics to stderr
            console.error(
                "Remaining requests for %s: %s",
                path,
                response.headers["x-ratelimit-remaining"]
            );
        }
    }
}

async function getAllPages(path, params, headers) {
    const baseParams = Object.assign({}, params, { per_page: 100 }); // eslint-disable-line camelcase
    const responses = [await get(path, baseParams, headers)];
    const linkHeader = responses[0].headers.link;

    if (linkHeader !== undefined) {
        const pages = parseLinkHeader(linkHeader);
        const lastPage = Number(pages.last.page);
        const nextPage = Number(pages.next.page);
        const promises = [];

        for (let page = nextPage; page <= lastPage; page++) {
            promises.push(
                get(path, Object.assign({}, baseParams, { page }), headers)
            );
        }

        responses.push(...(await Promise.all(promises)));
    }

    return [].concat(...responses.map(res => res.data));
}

exports.ACCEPT_STAR = ACCEPT_STAR;
exports.get = get;
exports.getAllPages = getAllPages;
