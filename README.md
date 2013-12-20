Open Source CDN jsDelivr
========

[www.jsdelivr.com][1]

Similar to Google Hosted Libraries jsDelivr is an Open Source CDN that allows developers to host their own projects 
and anyone to link to our hosted files in their websites. 

We offer a stable CDN that can be used in production even on popular websites with huge amounts of traffic.
There are no bandwidth limits or premium features and its completely free to use by anybody.

All kinds of files are allowed, including javascript libraries, jQuery plugins, CSS frameworks, fonts and more.

You can use this repo to make your own modifications and improve the contents of jsDelivr's CDN.
Feel free to open issues and pull requests if you think something should be added/removed/modified.

All changes made to this repo are synced to the CDN.
It can take a few minutes for the changes to appear on the website.

[How jsDelivr works - What makes it special][4]


How to submit or update projects:
---------------------------------

 1. Fork the jsDelivr repository.
 2. Locally make the changes you want to be synced with the CDN
 3. Send the Pull request with a description of the changes you made following the same structure as the rest of the projects in the repo.
 4. Wait for the approval.
 5. Thats it

   
    
File Structure
--------------
Under `files/` a directory for each project is created. Please follow the instructions bellow.

1. Lowercase
2. No special characters or spaces. Allowed: . - _
3. Only the name of the project
4. If the project is a plugin of a library append the name of the library. ex: `jquery.blurjs`, `bootstrap.select`

In some cases a few exceptions can be made.


A project's directory should contain the following:

1. `info.ini` containing all needed information. [Example][2]
2. Directories named after the version of each project. 
* The version directories can contain in their names numbers, letters and -,_ symbols.
3. Do not create `latest` version directories. They are automatically created on our side.

A version directory should contain the following:

1. Static files needed for the project to work. 
2. If there is no minified version of the main js/css file please create your own. [Tool][3] (Minify only, no symbol obfuscation. )
3. Do not upload useless files like demos, examples, licenses, readmes and any other files not being used in the production.


URL Structure
-------------

`//cdn.jsdelivr.net/{projectName}/{version}/{file}`

`//cdn.jsdelivr.net/{projectName}/{version}/{projectName}.zip`

For latest version use:

`//cdn.jsdelivr.net/{projectName}/latest/{file}`


API 
---


(Legacy)

JSON of hosted files and projects - `http://api.jsdelivr.com/packages.php`

XML of all hosted files including md5 hashes - `http://www.jsdelivr.com/hash.xml`


Performance data contribution
---

**jsDelivr** uses real user performance data also known as RUM to make its routing desicions. This data is gathered from hundreds of websites and is used in our load balancing algorithm to make accurate decisions based on real time performance metrics.

This is why we offer the ability to all users to help us out. This data is very important and we encourage all users to participate.

All you have to do is include the following javascript code in your website before `</body>`.
This code is then executed each time a user visits your website. It uses his browser to test the latency to our CDN providers and gather performance and availability metrics on each one of them.

These benchmarks are completely transparent to the user and do not impact on his browsing in any way. The information we store is the following:

* Performance metrics to each of our providers.
* Availability metrics to each of our providers.
* Browser’s User-Agent
* First three octets of the user’s IP address 

Our js code is executed with a 2 seconds delay and tests all of our providers unless interrupted. This testing does not impact on your website performance or user browsing experience.
[Privacy Policy for Data Contribution](http://www.cedexis.com/legal/privacy.html)

```html
<script type="text/javascript">
(function(w, d) { var a = function() { var a = d.createElement('script'); a.type = 'text/javascript';
a.async = 'async'; a.src = '//' + ((w.location.protocol === 'https:') ? 's3.amazonaws.com/cdx-radar/' :
'radar.cedexis.com/') + '01-11475-radar10.min.js'; d.body.appendChild(a); };
if (w.addEventListener) { w.addEventListener('load', a, false); }
else if (w.attachEvent) { w.attachEvent('onload', a); }
}(window, document));
</script>
```



  [1]: http://www.jsdelivr.com
  [2]: https://github.com/jimaek/jsdelivr/blob/master/files/abaaso/info.ini
  [3]: http://refresh-sf.com/yui/
  [4]: http://blog.maxcdn.com/load-balancing-multiple-cdns-jsdelivr-works/


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/jsdelivr/jsdelivr/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

