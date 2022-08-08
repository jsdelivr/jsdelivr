<h1 align="center">jsDelivr - Open Source CDN</h1>

<p align="center">
  <img src="https://www.jsdelivr.com/img/icon_256x256.png" alt="jsdelivr-logo" width="128px" height="128px"/>
  <br>
  <i>A global super-fast and production focused CDN, tightly integrated with NPM and GitHub
    <br> with support for on-the-fly optimizations, ES modules, detailed download stats and more</i>
  <br>
</p>

<p align="center">
  <a href="https://www.jsdelivr.com"><strong>www.jsdelivr.com</strong></a>
  <br>
</p>

<p align="center">
  <a href="https://github.com/jsdelivr/www.jsdelivr.com">Website Repo</a>
  ·
  <a href="https://github.com/jsdelivr/data.jsdelivr.com">Official API</a>
  ·
  <a href="https://www.jsdelivr.com/blog/">Blog</a>
  ·
  <a href="https://twitter.com/jsdelivr">@jsDelivr</a>
  ·
  <a href="https://www.jsdelivr.com/discord">Discord</a>
  <br>
  <br>
</p>
<hr>

**We are looking for contributors.** Please check open issues in the above repos if you think you could help, or open a new one if you have an idea you'd like to discuss.

jsDelivr is a free CDN for open source files. We are tightly integrated with Github and npm allowing us to automatically provide a reliable CDN service to almost every open source project out there.

We offer a stable CDN that can be used in production on popular websites with huge amounts of traffic.
There are no bandwidth limits or premium features and its completely free to use by anybody.


### [How does it work - A simple infographic](https://www.jsdelivr.com/network/infographic)


# Why jsDelivr?


Ready for production
--------------------

Our public CDN is built to be used in production by even the largest websites. Everything is optimized and being constantly improved to offer all users maximum speed and uptime. Performance is monitored at all times, and we are always looking into new technologies and providers that may further improve our CDN. Downtime, timeouts or slow responses are simply unacceptable. 

We do everything possible to ensure our CDN will NEVER break any websites regardless of use-case. If a file is available via our CDN we assume its used in production and make sure that file will continue to work no matter what.

This includes dynamic endpoints such as `/npm/`, `/gh/` and `/combine/`. When a file is first accessed it gets permanently stored in a reliable file system. This means that even if a npm package gets deleted, or an existing file gets removed by a developer, jsDelivr will  continue to serve the stored copy for ever, without breaking any websites or causing any issues.

On top of that we also do version-fallback. This means that if a file used in version 1.0.1 is no longer available in 1.0.2 and a user requests the non-existent file we will fallback to the previous 1.0.1 version and serve it instead of failing with 404 error.


Multi-CDN
---------

Unlike the competition, jsDelivr uses multiple CDN providers, resulting in the best possible uptime and performance. We currently use [CloudFlare][8], and [Fastly][14]. In mainland China we use [Quantil](https://www.quantil.com/).

If a CDN goes down, websites that use jsDelivr won't have any issues because all traffic will be instantly redirected to remaining operational providers.


Smart Load Balancing
--------------------

jsDelivr uses real user performance data (also known as RUM) to make its routing decisions. These metrics are gathered from hundreds of websites and are used in our load balancing algorithm to make accurate decisions for serving content. 

All providers (CDNs and custom servers) are tested millions times per day by real users from all over the world. Based on this information, jsDelivr knows what provider is the fastest for each user. Each user gets a unique response based on his or her location, ISP, and the providers' uptime in real time.

This system also responds immediately to performance degradation and downtime of providers. If a CDN is under a DDoS attack, and their performance drops in some locations, in matter of seconds the algorithm will pick up the change and start serving a different provider to all affected users.


Failover
--------

We have multiple layers of failover to protect our users from any downtime.

We use 2 DNS providers at the same time. For jsDelivr to go down both of these companies would have to go down at the same time.

Both of our DNS providers monitor our load-balanced endpoint and if they detect problems they will automatically switch all traffic to a single CDN provider.

Our load-balancer monitors the uptime of all CDN providers using both RUM and synthetic data. If any of those detect downtime or performance degradation that CDN provider will be removed immediately without any impact to our users.

Our origin consits of multiple servers in different data-centers. If a server goes down the CDNs will automatically switch to using the remaining healthy servers.

In total we have one of the most resilient systems out there, ready to be used in production by even the biggest companies.


China
----------------

jsDelivr has partnered up with multiple Chinese companies to provide fast and reliable file delivery in China mainland and the whole Asian continent. We have servers inside China that improve the delivery speeds and latency significantly. We also have a valid ICP license issued by the Chinese government that protects us from bans and slow downloads.

jsDelivr works perfectly inside China!


# Usage Documentation

jsDelivr provides mirrors for npm, GitHub, WordPress plugins, and custom endpoints for several other projects with special requirements. If our regular endpoints don't work for your use case, [let us know](mailto:dak@prospectone.io) and we'll figure something out!

If you are a package author, check our [tips for package authors](#Publishing-packages) to make using your package as easy as possible.

#### Root endpoint is always `https://cdn.jsdelivr.net`

npm
------

jsDelivr can instantly serve any file from any npm package in the public registry.
New versions pushed to npm are instantly available via our CDN as well. No maintenance is required.

If a package, version or file gets removed from npm then jsDelivr will continue to serve that file from our permanent storage without breaking any websites using it. 

We use a permanent S3 storage to ensure all files remain available even if npm goes down, or a package is deleted by its author. Files are fetched directly from npm only the first time, or when S3 goes down.


##### Load any project hosted on npm:

```
/npm/package@version/file
```

##### Load exact version:

```
/npm/jquery@3.1.0/dist/jquery.min.js
```

##### Use a version range instead of an exact version:

```
/npm/jquery@3/dist/jquery.min.js
/npm/jquery@3.1/dist/jquery.min.js
```
---
**NOTE**

If you use this feature and a file you requested is not available in the newest version of the package, the link will keep working thanks to our version-fallback feature. We'll continue to serve the file from older version of the package instead of failing with a 404 error.

---


##### Load by tag (Not recommended for production usage):

```
/npm/jquery@beta/dist/jquery.min.js
```

##### Omit the version completely or use "latest" to load the latest one (not recommended for production usage):

```
/npm/jquery@latest/dist/jquery.min.js
/npm/jquery/dist/jquery.min.js
```
---
**NOTE**
Requesting the latest version (as opposed to "latest major" or "latest minor") is dangerous because major versions usually come with breaking changes. Only do this if you really know what you are doing.

---

##### Add ".min" to any JS/CSS/SVG file to get a minified version - if one doesn't exist, we'll generate it for you. All generated files come with source maps and can be easily used during development:

```
/npm/github-markdown-css@2.4.1/github-markdown.min.css
```
---
**NOTE**
Minifying a large file can take several seconds. However, we store all generated files in our permanent storage, so this delay only applies to the first few requests.

---

##### Omit the file path to get the [default file](#configuring-a-default-file-in-packagejson). This file is always minified:

```
/npm/jquery@3.1.0
/npm/jquery@3
/npm/jquery
```

##### Get a directory listing:

```
/npm/jquery@3.1.0/
/npm/jquery@3.1.0/dist/
```

GitHub
------
We recommend using npm for projects that support it for better UX - npm packages are searchable on our website, and package pages show additional useful information, such as description and link to homepage.

We use a permanent S3 storage to ensure all files remain available even if GitHub goes down, or a repository or a release is deleted by its author. Files are fetched directly from GitHub only the first time, or when S3 goes down.

##### Load any GitHub release, commit, or branch:

```
/gh/user/repo@version/file
```

##### Load exact version:

```
/gh/jquery/jquery@3.1.0/dist/jquery.min.js
/gh/jquery/jquery@32b00373b3f42e5cdcb709df53f3b08b7184a944/dist/jquery.min.js
```

##### Use a version range instead of an exact version (only works with valid semver versions):

```
/gh/jquery/jquery@3/dist/jquery.min.js
/gh/jquery/jquery@3.1/dist/jquery.min.js
```
---
**NOTE**
If you use this feature and a file you requested is not available in the newest release, the link will keep working thanks to our version-fallback feature. We'll continue to serve the file from older release instead of failing with a 404 error.

---

##### Omit the version completely or use "latest" to load the latest one (only works with valid semver versions): (Dev environment only)

```
/gh/jquery/jquery@latest/dist/jquery.min.js
/gh/jquery/jquery/dist/jquery.min.js
```
---
**NOTE**
Requesting the latest version (as opposed to "latest major" or "latest minor") is dangerous because major versions usually come with breaking changes. Only do this if you really know what you are doing.

---


##### Add ".min" to any JS/CSS/SVG file to get a minified version - if one doesn't exist, we'll generate it for you. All generated files come with source maps and can be easily used during development:

```
/gh/jquery/jquery@3.2.1/src/core.min.js
```
---
**NOTE**
Minifying a large file can take several seconds. However, we store all generated files in our permanent storage, so this delay only applies to the first few requests.

---

##### Get a directory listing:

```
/gh/jquery/jquery@3.1.0/
/gh/jquery/jquery@3.1.0/dist/
```

Combine multiple files
----------------------

Our combine endpoint allows you to load several files from npm and GitHub endpoints in one request:

```
/combine/url1,url2,url3
```

All features that work for individual files (version ranges, minification, main modules) work here as well. All combined files come with source maps and can be easily used during development.

Examples:

```
/combine/gh/jquery/jquery@3.1/dist/jquery.min.js,gh/twbs/bootstrap@3.3/dist/js/bootstrap.min.js
/combine/npm/bootstrap@3.3/dist/css/bootstrap.min.css,npm/bootstrap@3.3/dist/css/bootstrap-theme.min.css
```
---
**NOTE**
Combining large/many files can take several seconds. However, we store all generated files in our permanent storage, so this delay only applies to the first few requests.

---

Publishing packages
-------------------

All packages hosted on npm and tagged releases on GitHub are automatically available on jsDelivr. If you are a package author, here are a few tips to make using your package as easy as possible:

 - Use semver for versioning (this is enforced by npm but not by GitHub)
 - If a file listed as `main` in `package.json` isn't meant to be used in a browser, set a [`browser` or `jsdelivr` field](#configuring-a-default-file-in-packagejson)
 - If you distribute minified JS/CSS files, also include source maps for those files
 - If you don't want to provide minified files, it's fine - we'll handle that for you
 
 ### Configuring a default file in package.json
 
 For packages hosted on npm, we support serving "default" files with shorter URLs. The default file can be configured by setting one of the following fields in `package.json`, with `jsdelivr` having the highest priority:
 
  1. `jsdelivr`
  2. `browser`
  3. `main`
  
We will first attempt to locate a minified version of the file provided here (by removing the extension, and looking for the same file `.min.js`). If we can't find one we will minify ourselves.

Be advised that you must include file extension in the values, for example:
```
"main": "./index" // this will NOT work
"main": "./index.js" // this is the correct way
```
  
Restrictions
-------------------
 - Packages larger than 50 MB or single files larger than 20 MB (in case of GitHub) are not supported by default. We recommend removing files that are not needed from your package when possible. If you need to set a higher limit for your package, open an issue in this repo.
 - HTML files are served with `Content-Type: text/plain` for security reasons.

WordPress
---------

Our WordPress endpoint works for plugins and themes hosted in the [WordPress.org plugin directory](https://WordPress.org/plugins) and [Wordpress.org theme directory](https://wordpress.org/themes/), and mirrors [the WordPress.org plugins SVN repo](https://plugins.svn.wordpress.org/).

##### Load any plugin from the WordPress.org plugins SVN repo:
```
/wp/project/tags/version/file
```

##### Load exact version:

```
/wp/wp-slimstat/tags/4.6.5/wp-slimstat.js
```

##### Load latest version (not recommended for production usage):

```
/wp/wp-slimstat/trunk/wp-slimstat.js
```

#####  Load any theme from the WordPress.org themes SVN repo:
```
https://cdn.jsdelivr.net/wp/themes/project/version/file
```

##### Load an exact version of a file:

```
https://cdn.jsdelivr.net/wp/themes/twenty-eightteen/1.7/assets/js/html5.js
```

##### Add ".min" to any JS/CSS file to get a minified version - if one doesn't exist, we'll generate it for you. All generated files come with source maps and can be easily used during development:

```
https://cdn.jsdelivr.net/wp/themes/twenty-eightteen/1.7/assets/js/html5.min.js
```

Caching
---
Our caching logic and headers are optimized for production use and applies to all non-custom endpoints.

* **Static Versions and commit hashes** - Effectively forever. The caching headers are set for 1 year but we also permanently cache the files in our S3 storage. So all future requests that bypass the CDN will hit our S3 storage with no option or way to update the contents of that file.
* **Version aliasing** - 7 days. This also includes `latest` versions. They are cached on our CDN for 7 days with the option to purge the cache using our API to speed up the release of your project to your users.
* **Branches** - 12 hours. 

In certain cases purgeable files can get updated faster due to low-cache hit ratio or forced CDN purge from our side for maintenance reasons.

We use permanent S3 caching even with dynamic URLs such as version aliasing, meaning once we download your tagged files there is no way for you to update them. If there is a critical issue in your latest release the best course of action is to tag a new semver valid release with the fix and purge the CDN URLs using our purge API.


Purge cache
---

jsDelivr has an easy to use API to purge files from the cache and force the files to update. This is useful when you release a new version and want to force the update of all version aliased users.

Please note:
* It will not work for static files as explained above. 
* Valid semver releases must be used for purge to work
* Rate-limiting applies to all users

To avoid abuse, access to purge is given after an email request (for now - dak@prospectone.io).

Custom CDN Hosting
---

We can work together and setup a custom configuration for your project. This way, you can have full control over your files and the ability to utilize the full power of jsDelivr.

This kind of custom hosting can be suitable for:

* Binary hosting. Windows executable files and zips.
* Frequently updated files.
* Projects that can't follow jsDelivr file structure.
* Some other use that will blow all of our minds.

Simply send an email to dak@prospectone.io with a request for more information.

Current OSS projects using custom configs:

* [webjars](http://www.webjars.org/)
* webpack [webpackbin](https://www.webpackbin.com/) and [codesandbox](https://codesandbox.io/)
* [emojione.com](https://www.emojione.com/)
* [hex.pm](https://hex.pm/)


Privacy Policy
---

#### cdn.jsdelivr.net

jsDelivr might use information about downloaded files to build download stats per project and per file.

jsDelivr does not store any user data and does not track any users in any way.

Here are the relevant policies of our CDN providers:
* [Cloudflare](https://www.cloudflare.com/security-policy/)
* [Fastly](https://www.fastly.com/privacy/)
* Only in China [Quantil](https://www.quantil.com/privacy-and-security-policy/)


## [The bus factor](https://github.com/jsdelivr/jsdelivr/wiki/What-to-do-if-I-die-aka-The-bus-factor)

  [1]: http://www.jsdelivr.com
  [2]: https://github.com/jimaek/jsdelivr/blob/master/files/abaaso/info.ini
  [3]: http://refresh-sf.com/yui/
  [4]: http://blog.maxcdn.com/load-balancing-multiple-cdns-jsdelivr-works/
  [5]: http://www.cdnperf.com/
  [6]: http://en.wikipedia.org/wiki/Content_delivery_network
  [7]: https://www.stackpath.com/
  [8]: http://www.cloudflare.com/
  [9]: https://github.com/jsdelivr/jsdelivr/fork
  [11]: https://hacks.mozilla.org/2014/03/jsdelivr-the-advanced-open-source-public-cdn/
  [12]: https://gitter.im/jsdelivr/jsdelivr
  [14]: https://www.fastly.com/
