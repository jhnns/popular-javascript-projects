"use strict";

function print(thing) {
    console.log(JSON.stringify(thing, null, "  "));
}

module.exports = print;
