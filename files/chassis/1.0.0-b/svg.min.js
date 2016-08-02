/**
 * This file should be loaded in the <head>, not at the end of the <body>.
 * By loading this script before the rest of the DOM, it will insert the
 * FOUC (Flash of Unstyled Content) CSS into the page BEFORE unstyled SVG images
 * are loaded. If this script is included in the <body>, the CSS will be loaded
 * AFTER the sVG images are loaded, meaning they may display briefly before
 * proper styling can be applied to the DOM.
 */

// Prevent FOUC
(function(){
  var ss = document.createElement('style');
  var str = document.createTextNode('img[src$=".svg"]{display:none;}svg.loading{height:0px !important;width:0px !important;}');
  ss.appendChild(str);
  document.head.appendChild(ss);
})();

// SVG Controller
var SVG = {};

Object.defineProperties(SVG,{
  /**
   * @property {Object} cache
   * A cache of SVG images.
   */
  cache: {
    enumerable: false,
    configurable: false,
    writable: true,
    value: {}
  },

  /**
   * @method swapImagesForSvg
   * Replace image tags with the SVG equivalent.
   * @param {HTMLElement|NodeList} imgs
   * The HTML element or node list containing the images that should be swapped out for SVG files.
   * @param {function} [callback]
   * Executed when the image swap is complete. There are no arguments passed to the callback.
   * @private
   */
  swapImagesForSvg: {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function(imgs,callback){
      for (var x = 0; x < imgs.length; x++) {
        var img = imgs[x];
        if (SVG.cache[img.src] !== null && img !== null && img.parentNode !== null){
          var svg = SVG.cache[img.src].cloneNode(true);
          var attr = img.attributes;
          for (var y=0;y<attr.length;y++){
            if (img.hasAttribute(attr[y].name) && attr[y].name.toLowerCase() !== 'src' ){
              svg.setAttribute(attr[y].name,attr[y].value);
            }
          }
          if(svg.classList){
            for (var i=0; i< img.classList.length; i++){
              svg.classList.add(img.classList[i]);
            }
          } else {
            svg.setAttribute('class',img.getAttribute('class'));
          }
          img.parentNode.replaceChild(svg, img);
        }
      }
      callback && callback();
    }
  },

  /**
   * @method update
   * Replace any <img src="*.svg"> with the SVG equivalent.
   * @param {HTMLElement|NodeList} section
   * The HTML DOM element to update. All children of this element will also be updated.
   * @param {function} callback
   * Execute this function after the update is complete.
   */
  update: {
    enumerable: true,
    configurable: false,
    writable: false,
    value: function (section, callback) {
      if (typeof section === 'function'){
        callback = section;
        section = document.body;
      } else {
        section = section || document.body;
      }

      if (section.nodeName === '#text'){
        return;
      }

      section = section.hasOwnProperty('length') === true
        ? Array.prototype.splice.call(section)
        : [section];

      section.forEach(function(sec){
        var imgs = sec.querySelectorAll('img[src$=".svg"]');

        // Loop through images, prime the cache.
        for (var i = 0; i < imgs.length; i++) {
          SVG.cache[imgs[i].src] = SVG.cache[imgs[i].src] || null;
        }

        // Get all of the unrecognized svg files
        var processed = 0;
        Object.keys(SVG.cache).forEach(function(url){

          var _module = false;
          try {
            _module = require !== undefined;
          } catch(e){}

          if (_module){
            // Add support for node-ish environment (nwjs/electron)
            try {
              var tag = document.createElement('div');
              tag.innerHTML = require('fs').readFileSync(url.replace('file://','')).toString();
              SVG.cache[url] = tag.querySelector('svg');
              SVG.cache[url].removeAttribute('id');
              SVG.cache[url].removeAttribute('xmlns:a');
              processed++;
            } catch (e) {
              processed++;
              console.log(e.stack)
            }
          } else {
            // Original Browser-Based Vanilla JS using the AJAx lib.
            HTTP.get(url,function(res){
              if (res.status !== 200){
                processed++;
              } else {
                var tag = document.createElement('div');
                tag.innerHTML = res.responseText;
                SVG.cache[url] = tag.querySelector('svg');
                SVG.cache[url].removeAttribute('id');
                SVG.cache[url].removeAttribute('xmlns:a');
                processed++;
              }
            });
          }
        });

        // Monitor for download completion
        var monitor = setInterval(function(){
          if (processed === Object.keys(SVG.cache).length){
            clearInterval(monitor);
            SVG.swapImagesForSvg(imgs,callback);
          }
        },5);
      });

    }
  }
});
