/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function() {

  // Establish scope.
  window.WebComponents = window.WebComponents || {flags:{}};

  // loading script
  var file = 'webcomponents-lite.js';
  var script = document.querySelector('script[src*="' + file + '"]');

  // Flags. Convert url arguments to flags
  var flags = {};
  if (!flags.noOpts) {
    // from url
    location.search.slice(1).split('&').forEach(function(o) {
      o = o.split('=');
      o[0] && (flags[o[0]] = o[1] || true);
    });
    // from script
    if (script) {
      for (var i=0, a; (a=script.attributes[i]); i++) {
        if (a.name !== 'src') {
          flags[a.name] = a.value || true;
        }
      }
    }
    // log flags
    if (flags.log) {
      var parts = flags.log.split(',');
      flags.log = {};
      parts.forEach(function(f) {
        flags.log[f] = true;
      });
    } else {
      flags.log = {};
    }
  }

  // Determine default settings.
  // If any of these flags match 'native', then force native ShadowDOM; any
  // other truthy value, or failure to detect native
  // ShadowDOM, results in polyfill
  flags.shadow = (flags.shadow || flags.shadowdom || flags.polyfill);
  if (flags.shadow === 'native') {
    flags.shadow = false;
  } else {
    flags.shadow = flags.shadow || !HTMLElement.prototype.createShadowRoot;
  }

  // construct full dependency list
  var modules = [
    'HTMLImports/HTMLImports.js',
    'CustomElements/CustomElements.js',
    'Template/Template.js',
    // these scripts are loaded here due to polyfill timing issues
    'WebComponents/unresolved.js'
  ];

  var src = script.getAttribute('src');
  var path = src.slice(0, src.lastIndexOf(file));

  modules.forEach(function(f) {
    document.write('<script src="' + path + 'src/' + f + '"></script>');
  });

  // exports
  WebComponents.flags = flags;

})();
