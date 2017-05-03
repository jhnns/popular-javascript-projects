"use strict";

const axios = require("axios");
const parseLinkHeader = require("parse-link-header");
const config = require("../../config.js");
const httpCache = require("../httpCache");

const BASE_URL = "https://api.github.com";

const ACCEPT_STAR = "application/vnd.github.v3.star+json";
const http = axios.create({
    timeout: 20000,
    headers: {
        Accept: "application/vnd.github.v3+json",
    },
    params: {
        access_token: config.github.accessToken, // eslint-disable-line camelcase
    },
});

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
            response = await http.get(url, {
                params,
                headers,
            });
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
    const responses = [await get(path, params, headers)];
    const linkHeader = responses[0].headers.link;

    if (linkHeader !== undefined) {
        const pages = parseLinkHeader(linkHeader);
        const lastPage = Number(pages.last.page);
        const nextPage = Number(pages.next.page);
        const promises = [];

        for (let page = nextPage; page <= lastPage; page++) {
            promises.push(
                get(path, Object.assign({}, params, { page }), headers)
            );
        }

        responses.push(...(await Promise.all(promises)));
    }

    return [].concat(...responses.map(res => res.data));
}

exports.ACCEPT_STAR = ACCEPT_STAR;
exports.get = get;
exports.getAllPages = getAllPages;
