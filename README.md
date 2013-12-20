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





  [1]: http://www.jsdelivr.com
  [2]: https://github.com/jimaek/jsdelivr/blob/master/files/abaaso/info.ini
  [3]: http://refresh-sf.com/yui/
  [4]: http://blog.maxcdn.com/load-balancing-multiple-cdns-jsdelivr-works/


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/jsdelivr/jsdelivr/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

