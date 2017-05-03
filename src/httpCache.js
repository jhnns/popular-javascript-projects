"use strict";

const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");

const PATH_TO_CACHE = path.resolve(__dirname, "..", ".http-cache");

mkdirp.sync(PATH_TO_CACHE);

function stringifyKey(key) {
    return JSON.stringify(key)
        .replace(/\//g, encodeURIComponent("/"))
        .replace(/\\/g, encodeURIComponent("\\"));
}

function parseKey(key) {
    return JSON.parse(decodeURIComponent(key));
}

function getKey(url, params = {}, headers = {}) {
    return stringifyKey({
        url,
        params,
        headers,
    });
}

function getPath(url, params, headers) {
    return path.resolve(PATH_TO_CACHE, getKey(url, params, headers));
}

function has(url, params, headers) {
    return fs.existsSync(getPath(url, params, headers));
}

function read(url, params, headers) {
    return JSON.parse(fs.readFileSync(getPath(url, params, headers), "utf8"));
}

function write(url, params, headers, response) {
    fs.writeFileSync(
        getPath(url, params, headers),
        JSON.stringify(
            {
                headers: response.headers,
                data: response.data,
            },
            null,
            "  "
        )
    );
}

exports.PATH_TO_CACHE = PATH_TO_CACHE;
exports.stringifyKey = stringifyKey;
exports.parseKey = parseKey;
exports.has = has;
exports.read = read;
exports.write = write;
