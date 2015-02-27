/*-----------------------------------------------------------------------------+
| Product:  index.js - Ajile's default auto-loader for shared dependencies.
|+-----------------------------------------------------------------------------+
| Author:   Michael Lee [ http://ajile.net/ ]
|
| Created:  Friday,    November   2, 2006    [2006.06.02 - 19:44:40 EDT]
| Modified: Saturday   December  16, 2006    [2006.12.16 - 13:00:00 EST]
|+-----------------------------------------------------------------------------+
|
| README:
|
| If you need a way to import/load a common set of scripts for every page on
| your site or in your web application, this is the file you should use.
|
| This index.js file can be used to define scripting dependencies for a page,
| site, or application in a single place for use in many places.
|
| As of Ajile 0.6.5, Ajile automatically loads the index.js file found in its
| directory. To disable this behavior, use the "mvcshareoff" load-time option
| in the src parameter of the script tag used to load Ajile.
|
| Placing your top-level Namespace, Import, and Load directives in this file
| allows Ajile to automatically load, import, and initialize all required
| modules at startup for every page that uses Ajile.
|
| By using this file as described, all scripting logic can be controlled from
| a single point separate from the page, site or application's display logic.
|
| When used within web pages (e.g. HTML, XHTML, HTA, JSP, ASP, PHP, CGI, etc.)
| only 1 SCRIPT tag is required. That SCRIPT tag must identify the location of
| the Ajile module. For example:
| 
| <script type="text/javascript" src="__Ajile's_Path__"></script>
|
| Visit http://ajile.net/ to start creating "Smart scripts that play nice!"
|+----------------------------------------------------------------------------*/

// You may copy this file into your own projects and use it to define your
// shared dependencies. This file must reside in the same location as the Ajile
// module. The logic below demonstrates how this file can be used to define an
// auto-loader. You'll most-likely use index.js to auto-load common or shared
// functionality.

/*

   // Example options setting...
   Ajile.EnableCloak(false);
   Ajile.EnableDebug();
   Ajile.EnableOverride(false);
   
   // Define your namespace.
   Namespace ("your.namespace");
   
   // Import a versioned namespace.
   Import ("some.namespace.*.0.6", "some/path/");
   
   // Import a module's public members.
   Import ("some.other.Module.*");
   
   // Define a new module.
   your.namespace.NewModule = new function()
   {
      // Your implementation here...
   };

//*/