jQuery REST Client
=====
v1.0.1

<a href="https://twitter.com/intent/tweet?hashtags=jquery%2Crest&original_referer=http%3A%2F%2Fgithub.com%2F&text=A+jQuery+plugin+for+easy+consumption+of+RESTful+APIs&tw_p=tweetbutton&url=https%3A%2F%2Fgithub.com%2Fjpillora%2Fjquery.rest" target="_blank">
  <img src="http://jpillora.com/github-twitter-button/img/tweet.png"></img>
</a>

Summary
---
A jQuery plugin for easy consumption of RESTful APIs

Downloads
---

* [Development Version](http://jpillora.com/jquery.rest/dist/1/jquery.rest.js)
* [Production Version](http://jpillora.com/jquery.rest/dist/1/jquery.rest.min.js)

*File Size Report*
```
Original: 10314 bytes.
Minified: 5920 bytes.
Gzipped:  1376 bytes.
```

Features
---
* Simple
* Uses jQuery Deferred for Asynchonous chaining
* Basic Auth Support
* Helpful Error Messages
* Memory Cache
* Cross-domain Requests with [XDomain](https://github.com/jpillora/xdomain)

Basic Usage
---

1. Create a client.
2. Construct your API.
3. Make requests.

First setup your page:

``` html
<!-- jQuery -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>

<!-- jQuery rest -->
<script src="http://jpillora.com/jquery.rest/dist/1/jquery.rest.min.js"></script>
<!-- WARNING: I advise not using this link, instead download and host this library on your own server as GitHub has download limits -->

<script>
  // Examples go here...
</script>
```

Hello jquery.rest
``` javascript
var client = new $.RestClient('/rest/api/');

client.add('foo');

client.foo.read();
// GET /rest/api/foo/
client.foo.read(42);
// GET /rest/api/foo/42/
client.foo.read('forty-two');
// GET /rest/api/foo/forty-two/
```

Retrieving Results (Uses [jQuery's $.Deferred](http://api.jquery.com/category/deferred-object/))
``` javascript
var client = new $.RestClient('/rest/api/');

client.add('foo');

var request = client.foo.read();
// GET /rest/api/foo/
request.done(function (data){
  alert('I have data: ' + data);
});

// OR simply:
client.foo.read().done(function (data){
  alert('I have data: ' + data);
});
```


More Examples
---

##### Nested Resources
``` javascript

var client = new $.RestClient('/rest/api/');

client.add('foo');
client.foo.add('baz');

client.foo.read();
// GET /rest/api/foo/
client.foo.read(42);
// GET /rest/api/foo/42/

client.foo.baz.read();
// GET /rest/api/foo/???/baz/???/
// ERROR: jquery.rest: Invalid number of ID arguments, required 1 or 2, provided 0
client.foo.baz.read(42);
// GET /rest/api/foo/42/baz/
client.foo.baz.read('forty-two',21);
// GET /rest/api/foo/forty-two/baz/21/

```


##### Basic CRUD Verbs
``` javascript

var client = new $.RestClient('/rest/api/');

client.add('foo');

// C
client.foo.create({a:21,b:42});
// POST /rest/api/foo/ (with data a=21 and b=42)
// Note: data can also be stringified to: {"a":21,"b":42} in this case, see options below

// R
client.foo.read();
// GET /rest/api/foo/
client.foo.read(42);
// GET /rest/api/foo/42/

// U
client.foo.update(42, {my:"updates"});
// PUT /rest/api/42/   my=updates

// D
client.foo.destroy(42);
client.foo.del(42);
// DELETE /rest/api/foo/42/
// Note: client.foo.delete() has been disabled due to IE compatibility
```

##### Adding Custom Verbs
``` javascript

var client = new $.RestClient('/rest/api/');

client.add('foo');
client.foo.addVerb('bang', 'PATCH');

client.foo.bang({my:"data"});
//PATCH /foo/bang/   my=data
client.foo.bang(42,{my:"data"});
//PATCH /foo/42/bang/   my=data
```

##### Basic Authentication
``` javascript
var client = new $.RestClient('/rest/api/', {
  username: 'admin',
  password: 'secr3t'
});

client.add('foo');

client.foo.read();
// GET /rest/api/foo/
// With header "Authorization: Basic YWRtaW46c2VjcjN0"
```

*Note: A [window.btoa](https://developer.mozilla.org/en-US/docs/DOM/window.btoa) polyfill such as [Base64.js](https://github.com/davidchambers/Base64.js) will be required for this feature to work in IE6,7,8,9*

##### Caching
``` javascript
var client = new $.RestClient('/rest/api/', {
  cache: 5, //This will cache requests for 5 seconds
  cachableMethods: ["GET"] //This defines what method types can be cached (this is already set by default)
});

client.add('foo');

client.foo.read().done(function(data) {
  //'client.foo.read' is now cached for 5 seconds
});

// wait 3 seconds...

client.foo.read().done(function(data) {
  //data returns instantly from cache
});

// wait another 3 seconds (total 6 seconds)...

client.foo.read().done(function(data) {
  //'client.foo.read' cached result has expired
  //data is once again retrieved from the server
});

// Note: the cache can be cleared with:
client.cache.clear();

```

##### Override Options
``` javascript

var client = new $.RestClient('/rest/api/');

client.add('foo', {
  stripTrailingSlash: true,
  cache: 5
});

client.foo.add('bar', {
  cache: 10,
});

client.foo.read(21);
// GET /rest/api/foo (strip trailing slash and uses a cache timeout of 5)

client.foo.bar.read(7, 42);
// GET /rest/api/foo/7/bar/42 (still strip trailing slash though now uses a cache timeout of 10)

```

##### Fancy URLs
``` javascript
var client = new $.RestClient('/rest/api/');
```
Say we want to create an endpoint `/rest/api/foo-fancy-1337-url/`, instead of doing:
``` javascript
client.add('foo-fancy-1337-url');

client['foo-fancy-1337-url'].read(42);
// GET /rest/api/foo-fancy-1337-url/42
```
Which is bad and ugly, we do:
``` javascript
client.add('foo', { url: 'foo-fancy-1337-url' });

client.foo.read(42);
// GET /rest/api/foo-fancy-1337-url/42
```

##### Query Parameters
``` javascript
var client = new $.RestClient('/rest/api/');

client.add('foo');

client.foo.read({bar:42});
// GET /rest/api/foo/?bar=42

client.foo.create({ data:7 }, { bar:42 });
// POST /rest/api/foo/?bar=42 with body 'data=7'

client.foo.read({ data:7 }, { bar:42 });
// GET has no body!
// GET /rest/api/foo/?bar=42&data=7
```


##### Show API Example
``` javascript
var client = new $.RestClient('/rest/api/');

client.add('foo');
client.add('bar');
client.foo.add('baz');

client.show();

```
Console should say:
```
ROOT: /rest/api/
  foo: /rest/api/foo/:ID_1/
    create: POST
    read: GET
    update: PUT
    delete: DELETE
    baz: /rest/api/foo/:ID_1/baz/:ID_2/
      create: POST
      read: GET
      update: PUT
      delete: DELETE
  bar: /rest/api/bar/:ID_1/
    create: POST
    read: GET
    update: PUT
    delete: DELETE
```

##### Simplify `client`
``` javascript

var client = new $.RestClient('/rest/api/');

client.add('forum');
client.forum.add('post');
client.forum.post.add('comment');
```

Instead of:
``` javascript
client.forum.post.comment.read(42,21,7);
client.forum.post.comment.update(42,21,7, {...});
```

You can do:
``` javascript
var comment = client.forum.post.comment;
comment.read(42,21,7);
comment.update(42,21,7, {...});
```

##### Global Client Example
``` javascript
$.client = new $.RestClient('/rest/api/');

// in another file...

$.client.add('foo');
```
*Note: This is not best practise, use RequireJS, CommonJS or similar !*

##### Method Override Header

``` javascript
var client = new $.RestClient('/rest/api/');

client.add('foo');
client.foo.update(42);
// PUT /rest/api/foo/42/

client.add('bar', { methodOverride: true });
client.bar.update(42);
// POST /rest/api/bar/42/
// with header 'X-HTTP-Method-Override: PUT'
```

##### Singleton Resource Example

``` javascript

var client = new $.RestClient('/rest/api/');

client.add('foo');
client.foo.add('bar', { isSingle: true });
client.foo.bar.add('bazz');

client.foo.bar.bazz.read(42, 21);
// GET /rest/api/foo/42/bar/bazz/21/
//        'bar' has no id  ^

```

API
---

#### new $.RestClient( [ `url` ], [ `options` ] )

Instantiates and returns the root resource. Below denoted as `client`.

#### `client`.add( `name`, [ `options` ] )

Instaniates a nested resource on `client`. Internally this does another `new $.RestClient` though instead of setting it as root, it will add it as a nested (or child) resource as a property on the current `client`.

Newly created nested resources iterate through their `options.verbs` and addVerb on each.

Note: The url of each of these verbs is set to `""`.

See default `options.verbs` [here](https://github.com/jpillora/jquery.rest/blob/gh-pages/src/jquery.rest.coffee#L39).

#### `client`.addVerb( `name`, `method`, [ `options` ] )

Instaniates a new Verb function property on the `client`.

Note: `name` is used as the `url` if `options.url` is not set.

#### `client`.`verb`( [`id1`], ..., [`idN`], [`data`], [`params`])

All verbs use this signature. Internally, they are all *essentially* calls to `$.ajax` with custom options depending on the parent `client` and `options`.

`id`s must be a string or number.

`data` is a [jQuery Ajax](http://api.jquery.com/jQuery.ajax/) Options Object's data property. If `ajax.data` is set on the `client` this `data` will extend it.

`params` query parameters to be appended to the url

Note: A helpful error will be thrown if invalid arguments are used.

Options
---

The `options` object is a plain JavaScript option that may only contain the properties listed below.

See defaults [here](https://github.com/jpillora/jquery.rest/blob/gh-pages/src/jquery.rest.coffee#L32)

*Important*: Both resources and verbs inherit their parent's options !

#### cache

A number reprenting the number of seconds to used previously cached requests. When set to `0`, no requests are stored.

### cachableTypes

An array of strings reprenting the HTTP method types that can be cached. Is `["GET"]` by default.

#### verbs

A plain object used as a `name` to `method` mapping.

The default `verbs` object is set to:
``` javascript
{
  'create': 'POST',
  'read'  : 'GET',
  'update': 'PUT',
  'delete': 'DELETE'
}
```

For example, to change the default behaviour of update from using PUT to instead use POST, set the `verbs` property to `{ update: 'POST' }`

### url

A string representing the URL for the given resource or verb.

Note: url is not inherited, if it is not set explicitly, the name is used as the URL.

### stringifyData

When `true`, will pass all POST data through `JSON.stringify` (polyfill required for IE<=8).

### stripTrailingSlash

When `true`, the trailing slash will be stripped off the URL.

### username and password

When both username and password are set, all ajax requests will add an 'Authorization' header. Encoded using `btoa` (polyfill required not non-webkit).

### ajax

The [jQuery Ajax](http://api.jquery.com/jQuery.ajax/) Options Object

### methodOverride

When `true`, requests (excluding HEAD and GET) become POST requests and the method chosen will be set as the header: `X-HTTP-Method-Override`. Useful for clients and/or servers that don't support certain HTTP methods.

### request

The function used to perform the request (must return a jQuery Deferred). By default, it is:

``` js
request: function(resource, options) {
  return $.ajax(options);
}
```

### isSingle

When `true`, resource is perceived as singleton:

See [Singleton Resource Example](https://github.com/jpillora/jquery.rest/#singleton-resource-example)

### autoClearCache

When `false`, non-cachable requests (`PUT`, `POST` or `DELETE` - those not in `cachableTypes`) **won't** automatically clear the request's entry in the cache.

> *Note: Want more options ? Open up a New Feature Issue above.*

---

Conceptual Overview
---

This plugin is made up nested 'Resource' classes. Resources contain options, child Resources and child Verbs. Verbs are functions that execute various HTTP requests.
Both `new $.RestClient` and `client.add` construct new instances of Resource, however the former will create a root Resource with no Verbs attached, whereas the latter will create child Resources with all of it's `options.verbs` attached.

Since each Resource can have it's own set of options, at instantiation time, options are inherited from parent Resources, allowing one default set of options with custom options on child Resources.

Todo
---
* CSRF
* Add Tests

Contributing
---

See CONTRIBUTING.md

Change Log
---

* v1.0.0 - Stable v1. Added `isSingle` and `autoClearCache` by @stalniy
* v0.0.6 - Added `methodOverride` option
* v0.0.5 - Minor bug fixes
* v0.0.4 - Simplified API
* v0.0.3 - Added into the jQuery Plugin Repo
* v0.0.2 - Bug fixes
* v0.0.1 - Beta Version

[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/fb83bb834123c2ede226e1931ea6956a "githalytics.com")](http://githalytics.com/jpillora/jquery.rest)
