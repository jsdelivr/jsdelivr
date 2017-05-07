# jsdelivr-backend

http://beta.jsdelivr.net/

## npm proxy

Load any project hosted on npm:

```
/npm/package@version/file
```

Load exact version:

```
/npm/jquery@3.1.0/dist/jquery.min.js
```

Use a version range instead of an exact version:

```
/npm/jquery@3/dist/jquery.min.js
/npm/jquery@3.1/dist/jquery.min.js
```

Not recommended for production usage - load by tag:

```
/npm/jquery@latest/dist/jquery.min.js
```

Not recommended for production usage - omit the version completely or use "latest" to load the latest one:

```
/npm/jquery@latest/dist/jquery.min.js
/npm/jquery/dist/jquery.min.js
```

Add ".min" to any JS/CSS file to get a minified version - if one doesn't exist, we'll generate it for you. All generated files come with source maps and can be easily used during development:

```
/npm/github-markdown-css@2.4.1/github-markdown.min.css
```

Omit the file path to get the browser bundle (if available) or the main module:

```
/npm/jquery@3.1.0
/npm/jquery@3
/npm/jquery
```

## GitHub proxy

Load any release from GitHub:

```
/gh/user/repo@version/file
```

Load exact version:

```
/gh/jquery/jquery@3.1.0/dist/jquery.min.js
```

Use a version range instead of a exact version:

```
/gh/jquery/jquery@3/dist/jquery.min.js
/gh/jquery/jquery@3.1/dist/jquery.min.js
```

Not recommended for production usage - omit the version completely or use "latest" to load the latest one:

```
/gh/jquery/jquery@latest/dist/jquery.min.js
/gh/jquery/jquery/dist/jquery.min.js
```

Add ".min" to any JS/CSS file to get a minified version - if one doesn't exist, we'll generate it for you. All generated files come with source maps and can be easily used during development:

```
/gh/sindresorhus/github-markdown-css@v2.4.1/github-markdown.min.css
```

## Combine

Load multiple files with a single HTTP request:

```
/combine/url1,url2,url3
```

All features that work for individual files (version ranges, minification, main modules) work here as well. All combined files come with source maps and can be easily used during development.

Examples:

```
/g2/npm/jquery@3.1.1/dist/jquery.min.js,npm/bootstrap@3.3.7/dist/js/bootstrap.min.js
/g2/gh/twbs/bootstrap@v3.3.7/dist/css/bootstrap.min.css,gh/twbs/bootstrap@v3.3.7/dist/css/bootstrap-theme.min.css
```
