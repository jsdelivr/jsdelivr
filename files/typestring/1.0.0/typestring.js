/**
 * typestring - In-memory TypeScript compiler
 * https://github.com/gavinhungry/typestring
 */

// http://www.2ality.com/2011/11/module-gap.html
({
  define: typeof define === 'function' ? define :
  function(reqs, fn) { module.exports = fn.apply(null, reqs.map(require)); }
}).

define(['typescript-api'], function (TypeScript) {
  'use strict';

  var filename = '_typestring.ts';

  return {

    /**
     * Compile a string of TypeScript, return as a string of JavaScript
     *
     * @param {String} input - TypeScript to compile
     * @param {Object} [refs] - map of referenced filenames to content
     * @return {String} JavaScript output
     * @throws TypeScript compile error
     */
    compile: function(input, refs) {
      var compiler = new TypeScript.TypeScriptCompiler();
      refs = refs || {};

      // replace references with script strings
      var re = new RegExp(TypeScript.tripleSlashReferenceRegExp.source, 'gm');
      input = input.replace(re, function(match, p1, p2, filename) {
        return refs[filename] || match;
      });

      var snapshot = TypeScript.ScriptSnapshot.fromString(input);
      compiler.addFile(filename, snapshot);

      var iter = compiler.compile();

      var output = '';
      while(iter.moveNext()) {
        var current = iter.current().outputFiles[0];
        output += !!current ? current.text : '';
      }

      var diagnostics = compiler.getSyntacticDiagnostics(filename);
      if (diagnostics.length) {
        throw diagnostics;
      }

      return output;
    }
  };
});
