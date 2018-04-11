# Popular JavaScript projects

**Scripts that I have used to retrieve and process data about JavaScript projects from Github, npm, StackOverflow etc.** Run these scripts if you want up-to-date data. Otherwise, check out my [gists](#gists) for precompiled data.

## Scripts

All scripts can be executed with node > 6 by running `node scripts/<script-name> ...`. All data is written to `process.stdout`. Some meta information, such as the remaining rate limit, is written to `process.stderr`.

You can pipe that data into a dedicated file by running for example `node scripts/githubStarsHistory.js jhnns/popular-javascript-projects > data/my-file.json`.

**Heads up!** Github limits the pagination offset for performance reasons. This means that it might be impossible to retrieve all the desired data. For instance, `githubStarsHistory` will only return the first 40.000 stars.

Github support answer:

> That's indeed intentional. Some lists of resources have a limit on the pagination for performance reasons -- fetching pages with a large offset is expensive to compute which introduces performance and reliability concerns. [...] There's no workaround for this since we intentionally limit this behavior.

### githubMostPopular

**Arguments:**

1. Star threshold

**Example:**

Get all JavaScript projects with at least 10000 stars:

```bash
node scripts/githubMostPopular.js 10000 > data/at-least-10000-stars.json
```

Requires a Github access token (see [Config](#config)).

### githubStarsHistory

**Arguments:**

1. The full repo name, including the organization

**Example:**

Get an array of star timestamps for a given repo:

```bash
node scripts/githubStarsHistory.js jhnns/popular-javascript-projects > data/star-history.json
```

Requires a Github access token (see [Config](#config)).

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
- [JavaScript library types](https://gist.github.com/jhnns/d233e88b40f5a2993c240847ccef4ee3)
- [GitHub stars history of Redux](https://gist.github.com/jhnns/d0b6e3a97e1aa72fc79d1cb4261c34b4)
- [GitHub stars history of React](https://gist.github.com/jhnns/dd69c660125ce0db45436f7438a7b6a0)
- [GitHub stars history of Vue](https://gist.github.com/jhnns/76d8b441bea23e900b88aa905fc359fe)
- [GitHub stars history of Angular 2+](https://gist.github.com/jhnns/1c95607a6610eeb34d025209bba1092d)
- [GitHub stars history of Angular 1](https://gist.github.com/jhnns/6f2306f523556683c0db9306fc4ddc68)
- [GitHub stars history of Meteor](https://gist.github.com/jhnns/57d0079f9f3efb10e32ddb7fb8044adb)
- [GitHub stars history of Express](https://gist.github.com/jhnns/80154cc45a760c3d8d0b7ded1b7b1728)
- [GitHub stars history of Backbone](https://gist.github.com/jhnns/ba5a68e94e058dc73df1d22df068ff87)
- [GitHub stars history of Ember](https://gist.github.com/jhnns/d7511a5ae7a97ed4913397521594dfb6)
- [GitHub stars history of Knockout](https://gist.github.com/jhnns/40089e06e9dcba8aa3ff3056ec7745a7)
- [GitHub stars history of Dojo 1](https://gist.github.com/jhnns/2619322d91290581ef4ee4922a431cc8)
- [GitHub stars history of Marionette](https://gist.github.com/jhnns/c325f9edf213314808b5887014a2c959)

## Config

If a non-public API or an API with rate limits is used, you need to provide access tokens. Copy the `config.default.js` inside the project folder and rename it to `config.js`. This file is ignored by git because it is for your local setup only.

### Github

Since there is a rate limit on the Github API, you need to create [an access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/).

## HTTP Cache

In order to save some requests, all responses are infinitly cached inside the `.http-cache` folder. Failed requests are not cached.

Just delete this folder if you want to avoid stale data. You can delete all cached responses for a specific URL by using the [`removeFromHttpCache`](#removefromhttpcache) script.

## License

Unlicense
