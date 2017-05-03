# Popular JavaScript projects

**Scripts that I have used to retrieve and process data about JavaScript projects from GitHub, npm, StackOverflow etc.** Run these scripts if you want up-to-date data. Otherwise, check out my [gists](#gists) for precompiled data.

## Scripts

All scripts can be executed with node > 6 by running `node scripts/<script-name> ...`. All data is written to `process.stdout`. Some meta information, such as the remaining rate limit, is written to `process.stderr`.

You can pipe that data into a dedicated file by running for example `node scripts/githubStarsHistory.js jhnns/popular-javascript-projects > data/my-file.json`.

### githubMostPopular

**Arguments:**

1. Star threshold

**Example:**

Get all JavaScript projects with at least 10000 stars:

```bash
node scripts/githubMostPopular.js 10000 > data/at-least-10000-stars.json
```

Requires a GitHub access token (see [Config](#config)).

### githubStarsHistory

**Arguments:**

1. The full repo name, including the organization

**Example:**

Get an array of star timestamps for a given repo:

```bash
node scripts/githubStarsHistory.js jhnns/popular-javascript-projects > data/star-history.json
```

Requires a GitHub access token (see [Config](#config)).

### removeFromHttpCache

**Arguments:**

1. Exact URL

**Example:**

```bash
node scripts/removeFromHttpCache.js https://api.github.com/search/repositories
```

Removes all cached responses from the given URL.

## Gists

I've created some gists with precompiled data. Also check out the revisions for historic data.

- [Most popular JavaScript projects](https://gist.github.com/jhnns/94188ba0904a82bbd0491bb21b041ce8)

## Config

If a non-public API or an API with rate limits is used, you need to provide access tokens. Copy the `config.default.js` inside the project folder and rename it to `config.js`. This file is ignored by git because it is for your local setup only.

### GitHub

Since there is a rate limit on the GitHub API, you need to create [an access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/).

## HTTP Cache

In order to save some requests, all responses are infinitly cached inside the `.http-cache` folder. Failed requests are not cached.

Just delete this folder if you want to avoid stale data. You can delete all cached responses for a specific URL by using the [`removeFromHttpCache`](#removefromhttpcache) script.

## License

Unlicense