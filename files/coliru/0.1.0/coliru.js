/*
    Coliru compiler web service JavaScript library.

    @licstart  The following is the entire license notice for the
    Javascript code in this page.

    Copyright (C) 2014 Alexander Lamaison

    The Javascript code in this page is free software: you can
    redistribute it and/or modify it under the terms of the GNU
    General Public License (GNU GPL) as published by the Free Software
    Foundation, either version 3 of the License, or (at your option)
    any later version.  The code is distributed WITHOUT ANY WARRANTY;
    without even the implied warranty of MERCHANTABILITY or FITNESS
    FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.

    As additional permission under GNU GPL version 3 section 7, you
    may distribute non-source (e.g., minimized or compacted) forms of
    that code without the copy of the GNU GPL normally required by
    section 4, provided you include this license notice and a URL
    through which recipients can access the Corresponding Source.

    @licend  The above is the entire license notice
    for the Javascript code in this page.
*/

'use strict';

var coliru = (function() {

    function displayColiruOutput(codeBlock, compileArea) {

        // Remove button so the compile-display process can
        // only happen once
        compileArea.removeChild(compileArea.firstChild);

        var sourceCode = codeBlock.textContent;

        coliru.compile(coliru.makeSourceRunnable(sourceCode),
                       function(response, state) {

                           if (state == 'running') {
                               compileArea.textContent = 'Running...\n';
                           }
                           else if (state == 'error') {
                               compileArea.textContent = 'Error: ' + reponse;
                           }
                           else {
                               compileArea.textContent = '';

                               if (response != '') {
                                   var outputArea = document.createElement('pre');
                                   compileArea.appendChild(outputArea);

                                   outputArea.className += ' coliru-output';
                                   // Pygments output formatting
                                   outputArea.className += ' go';

                                   outputArea.textContent = response;
                               }

                               var status = document.createElement('div');
                               compileArea.appendChild(status);
                               status.className += ' coliru-status';
                               if (state == 0) {
                                   status.textContent = 'Success';
                               }
                               else {
                                   status.textContent =
                                       'Failed (return code ' + state + ')';
                               }

                               var credit = document.createElement('div');
                               compileArea.appendChild(credit);
                               credit.className += ' coliru-credit';
                               credit.innerHTML += [
                                   'Powered by <a ',
                                   'href="http://coliru.stacked-crooked.com/">',
                                   'Coliru</a>'
                                   ].join('');
                           }

                           // Allow style to change formatting to reflect state
                           compileArea.setAttribute('data-coliru-state', state);
                       });
    }

    function createCompileButton(compileArea, compileAction) {

        var compileButton = document.createElement('span');
        compileButton.textContent = 'Run this code';
        compileButton.className += ' runbutton';
        compileButton.onclick = compileAction;
        compileButton.onkeydown = compileAction;

        compileArea.appendChild(compileButton);
    }

    return {

        compile: function(sourceCode, compileReadyResponse) {

            var linkOptions = '';
            for (var i=0; i < coliru.linkLibraries.length; ++i) {
                linkOptions += '-l' + coliru.linkLibraries[i] + ' ';
            }

            var compileCommand = [
                //'g++-4.8 -std=c++11 ',
                'clang++ -std=c++11 ',
                //'clang++ -std=c++11 -stdlib=libc++ -lsupc++ ',
                '-O2 -Wall -pedantic -pthread ',
                'main.cpp ',
                linkOptions,
                '&& ./a.out; echo COLIRUSTATUS $?'].join('');

            var coliruConnection = new XMLHttpRequest();

            coliruConnection.onreadystatechange = function() {
                if (coliruConnection.readyState == 4) {
                    if (coliruConnection.status != 200) {
                        compileReadyResponse(coliruConnection.response, 'error');
                    }
                    else {
                        // The command above wil *always* output the last return code
                        // at the end of the command.  We extract it and use it as
                        // the status
                        var rawResponse = coliruConnection.response;
                        var pattern = /^([\s\S]*)COLIRUSTATUS (\d+)\n$/m;
                        var splitResponse = rawResponse.match(pattern);

                        compileReadyResponse(splitResponse[1],
                                             parseInt(splitResponse[2]));
                    }
                }
                else {
                    compileReadyResponse(coliruConnection.response, 'running');
                }
            }

            coliruConnection.open("POST",
                                  "http://coliru.stacked-crooked.com/compile",
                                  true);

            coliruConnection.send(
                JSON.stringify({ "cmd": compileCommand, "src": sourceCode }));
        },

        linkLibraries: [],

        magicIncludes: [],

        makeSourceRunnable: function(sourceCode) {
            if (coliru.containsMainMethod(sourceCode)) {
                return sourceCode;
            }
            else {
                var runnableSourceCode = '';
                for (var i=0; i < coliru.magicIncludes.length; ++i) {
                    runnableSourceCode += '#include <'
                        + coliru.magicIncludes[i] + '>\n';
                }
                // No return needed (see C++ spec)
                runnableSourceCode += 'int main() {\n' + sourceCode + '\n}';

                return runnableSourceCode;
            }
        },

        containsMainMethod: function(sourceCode) {
            return sourceCode.match(/int\s+main\([^\)]*\)\s*[\{;]/);
        },

        // Expects codeBlock to be preceded by a <pre>
        createCompileArea: function(codeBlock) {
            var compileArea = document.createElement('div');

            // Allow coliru-specific formatting
            compileArea.className += ' coliru';
            // Formatting for coliru before it has run the code
            compileArea.setAttribute('data-coliru-state', 'not-run');

            createCompileButton(compileArea,
                                function(codeBlock, compileArea) {
                                    return function() {
                                        displayColiruOutput(codeBlock,
                                                            compileArea);
                                    }
                                }(codeBlock, compileArea));

            var preCode = codeBlock.parentNode;
            preCode.parentNode.insertBefore(compileArea, preCode.nextSibling);
        },

        // Onlu update code block inside a <pre> tag and with
        // data-lang=c++ attribute
        updateCodeBlock: function(codeBlock) {

            if (codeBlock.getAttribute('data-lang') == 'c++' &&
                codeBlock.parentNode.tagName == 'PRE') {
                coliru.createCompileArea(codeBlock);
            }
        },

        addRunButtonsToCodeBlocks: function() {

            var els = document.getElementsByTagName('code');

            for (var i = 0; i < els.length; ++i) {
               coliru.updateCodeBlock(els[i]);
            }

        },
    }

})()
