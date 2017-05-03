"use strict";

const repos = require("../src/github/repos");
const print = require("../src/print");

// const starThreshold = process.argv[2];
const starThreshold = 5000;

repos
    .getMostPopular({ language: "JavaScript", starThreshold })
    .then(print, console.error);
