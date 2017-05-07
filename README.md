[jsDelivr][1] - Open Source CDN
========

jsDelivr is a free CDN for open source files. We are tightly integrated with Github and npm allowing us to automatically provide a reliable CDN service to almost every open source project out there.

We offer a stable CDN that can be used in production on popular websites with huge amounts of traffic.
There are no bandwidth limits or premium features and its completely free to use by anybody.

[jsDelivr – The advanced open source public CDN][11]

[How jsDelivr works (outdated)][4]

[jsDelivr community chat][12]

# Why jsDelivr?


Performance and Uptime Oriented
--------------------

Our public CDN is built with performance and reliability in mind. Everything is optimized and being constantly improved to offer all users maximum speed and uptime. Performance is monitored at all times, and we are always looking into new technologies and providers that may further improve our CDN.

Downtime, timeouts or slow responses are simply unacceptable. The idea is not to simply offer a public CDN, but to offer the best possible experience and a rock-solid product.



Multi-CDN
---------

Unlike the competition, jsDelivr uses multiple CDN providers, resulting in the best possible uptime and performance. We currently use [MaxCDN][7], [CloudFlare][8], and [Fastly][14]. In mainland China we use [Quantil](https://www.quantil.com/).

If a CDN goes down, websites that use jsDelivr won't have any issues because all traffic will be instantly redirected to remaining operational providers.


Smart Load Balancing
--------------------

jsDelivr uses [Cedexis][10] with real user performance data (also known as RUM) to make its routing decisions. These metrics are gathered from hundreds of websites and are used in our load balancing algorithm to make accurate decisions for serving content.

All providers (CDNs and custom servers) are tested millions times per day by real users from all over the world. Based on this information, jsDelivr knows what provider is the fastest for each user. Each user gets a unique response based on his or her location, ISP, and the providers' uptime in real time.

This system also responds immediately to performance degradation and downtime of providers. If a CDN is under a DDoS attack, and their performance drops in some locations, in matter of seconds the algorithm will pick up the change and start serving a different provider to all affected users.

Our [load-balancing code is open source](https://github.com/jsdelivr/dns-openmix) as well.


Failover
--------

We have multiple layers of failover to protect our users from any downtime.

We use 2 DNS providers at the same time. NS1 and Route53. For jsDelivr to go down both of these companies would have to go down at the same time.

Both of our DNS providers monitor our load-balanced endpoint and if they detect problems they will automatically switch all traffic to a single CDN provider.

Our load-balancer monitors the uptime of all CDN providers using both RUM and synthetic data. If any of those detect downtime or performance degradation that CDN provider will be removed immediatly without any impact to our users.

Our origin consits of multiple servers in different data-centers. If a server goes down the CDNs will automatically switch to using the remaining healthy servers.

In total we have one of the most resilient systems out there, ready to be used in production by even the biggest companies.


HTTP2
-----------------

All of our POPs support HTTP2, allowing performant transfers when possible.


China
----------------

jsDelivr has partnered up with multiple Chinese companies to provide fast and reliable file delivery in China mainland and the whole Asian continent. We have servers inside China that improve the delivery speeds and latency significantly. We also have a valid ICP license issued by the Chinese government that protects us from bans and slow downloads.

jsDelivr works perfectly inside China!


# Usage





Custom CDN Hosting
---

We can work together and setup a custom configuration for your project. This way, you can have full control over your files and the ability to utilize the full power of jsDelivr.

This kind of custom hosting can be suitable for:

* Binary hosting. Windows executable files and zips.
* Frequently updated files.
* Projects that can't follow jsDelivr file structure.
* Some other use that will blow all of our minds.

Simply send an email to contact@jsdelivr.com with a request for more information.

Current OSS projects using custom configs:

* [webjars](http://www.webjars.org/)
* webpack [webpackbin](https://www.webpackbin.com/) and [codesandbox](https://codesandbox.io/)

Contribute Performance Data
---

**jsDelivr** uses real user performance data (also known as RUM) to make its routing decisions. This data is gathered from hundreds of websites and is used in our load balancing algorithm to make accurate decisions based on real time performance metrics.

This is why we offer the ability to all users to help us out. This data is very important and we encourage all users to participate.

All you have to do is include the following JavaScript code in your website before `</body>`.
This code is then executed each time a user visits your website. It uses their browser to test the latency to our CDN providers and gather performance and availability metrics.

These benchmarks are completely transparent to the user and do not impact on browsing in any way. We store the following information:

* Performance metrics to each of our providers.
* Availability metrics to each of our providers.
* Browser’s User-Agent
* First three octets of the user’s IP address

Our JS code is executed with a 2 second delay and tests all of our providers unless interrupted. This testing does not impact on your website performance or user browsing experience.

```html
<script async src="//radar.cedexis.com/1/11475/radar.js"></script>
```

[Privacy Policy for Data Contribution](http://www.cedexis.com/legal/privacy.html)


  [1]: http://www.jsdelivr.com
  [2]: https://github.com/jimaek/jsdelivr/blob/master/files/abaaso/info.ini
  [3]: http://refresh-sf.com/yui/
  [4]: http://blog.maxcdn.com/load-balancing-multiple-cdns-jsdelivr-works/
  [5]: http://www.cdnperf.com/
  [6]: http://en.wikipedia.org/wiki/Content_delivery_network
  [7]: http://tracking.maxcdn.com/c/47243/36539/378
  [8]: http://www.cloudflare.com/
  [9]: https://github.com/jsdelivr/jsdelivr/fork
  [10]: http://www.cedexis.com/
  [11]: https://hacks.mozilla.org/2014/03/jsdelivr-the-advanced-open-source-public-cdn/
  [12]: https://gitter.im/jsdelivr/jsdelivr
  [13]: https://github.com/jsdelivr/libgrabber#add-updatejson-schema
  [14]: https://www.fastly.com/
