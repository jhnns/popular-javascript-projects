"use strict";

const repos = require("../src/github/repos");
const print = require("../src/print");

const repo = process.argv[2];

repos.getStarsHistory(repo).then(print, console.error);
