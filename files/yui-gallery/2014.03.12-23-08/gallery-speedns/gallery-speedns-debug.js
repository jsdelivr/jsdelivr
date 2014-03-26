YUI.add('gallery-speedns', function(Y) {

/**
 * Static class that holds all the utility functions.
 */
var SpeedNS = {
   
    /**
     * Regular expression to match a domain name from uri.
     */
    domainRegex: /((http)|(https)):\/\/[A-Za-z0-9.\-]+\//,
   
   /**
    * Fires DNS lookups for all the links in the current document.
    *
    * @param {object} e is the current html document for which the onload event
    *   has fired.
    */
   prefetch: function() {
       var doc = document,
           links = doc.getElementsByTagName("a");
       var uniqueLinks = {}, i, l;
       for (i = 0, l = links.length; i < l; i++ ) {
           var uri = links[i].href,
               matches = SpeedNS.domainRegex.exec(uri),
               domain = matches[0];
           
           // hash each domain name.
           uniqueLinks[domain] = false;
       }
       
       for (var ud in uniqueLinks) {
           /**
            * We do it only if its a property that is created on object, because
            * some libraries like prototype can screw this up.
            */
           if (uniqueLinks.hasOwnProperty(ud)) {
               SpeedNS.prefetchDNSForDomain(ud,
                   SpeedNS.processHeadResponses);
           }
       }
   },
   
   /**
    * Prefetches DNS for the domain using hidden image technique. Uses the 
    * favicon image as source.
    *
    * @param {String} domain is the domain for which the DNS should be 
    *  prefetched.
    */
   prefetchDNSForDomain: function(domain) {
       // some browsers do not support image object, so check if it does.
       if (document.images) {
           var i = new Image(16, 16);
           i.src = domain + "favicon.ico";
       }
   }
};

// Alias it on YUI instance.
Y.speedns = SpeedNS;


}, 'gallery-2010.04.21-21-51' ,{requires:['get', 'event-custom']});
