"use strict";

const fs = require("fs");
const path = require("path");
const httpCache = require("../src/httpCache");

const url = process.argv[2];

fs
    .readdirSync(httpCache.PATH_TO_CACHE)
    .map(httpCache.parseKey)
    .filter(key => key.url === url)
    .forEach(key => {
        fs.unlink(
            path.join(httpCache.PATH_TO_CACHE, httpCache.stringifyKey(key)),
            err => {
                if (err) {
                    throw err;
                }
            }
        );
    });
