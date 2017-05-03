"use strict";

const githubApi = require("./api");

async function getStarsHistory(repo) {
    const starGazers = await githubApi.getAllPages(
        `/repos/${ repo }/stargazers`,
        {},
        {
            accept: githubApi.ACCEPT_STAR,
        }
    );

    return starGazers.map(starGazer => starGazer.starred_at);
}

async function getMostPopular({ language, starThreshold = 0 }) {
    const mostPopular = await githubApi.getAllPages(
        "/search/repositories",
        {
            q: `language:${ language } stars:>${ starThreshold }`,
        },
        {}
    );

    return [].concat(...mostPopular.map(data => data.items)).map(repo => ({
        name: repo.full_name,
        description: repo.description,
        stars: repo.stargazers_count,
    }));
}

exports.getStarsHistory = getStarsHistory;
exports.getMostPopular = getMostPopular;
