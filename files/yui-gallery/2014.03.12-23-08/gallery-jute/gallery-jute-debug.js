YUI.add('gallery-jute', function(Y) {

/*
 * Copyright (c) 2011, Yahoo! Inc. All rights reserved.
 * Code licensed under the BSD License:
 * http://developer.yahoo.com/yui/license.html
 * version: 1.0
 *
 * JUTE javascript/browser portion
 */
var UT = Y.namespace('UnitTest'), button, load_button, kick_button, clear_button, clear_results;

UT.heartBeat = function() {
    var cfg = {
        method: 'GET',
        on: {
                success: function (transactionid, response) {
                    var obj, current_status, current_results, status_output, result_output, i,
                        test, color, errorCount = 0;
                    try {
                        obj = Y.JSON.parse(response.responseText);
                        if (typeof(obj.redirect_run_tests) === 'string') {
                            // kick the run_tests iframe
                            Y.one('#run_tests').setAttribute('src', obj.redirect_run_tests);
                        } else {
                            current_status = obj.current_status;
                            current_results = obj.current_results;

                            // Make test/browser output pretty
                            status_output = '<h4 style="background-color="yellow" align="center">Status</h4><ul><li>Browsers</li><font size="-1"><ul>';
                            Y.each(current_status.browsers, 
                                function(value, key, object) {
                                    status_output += '<li>' + value.name + '</li>';
                                    status_output += '<ul><li>heart beat&nbsp;' + value.heart_beat + '</li>';
                                    status_output += '<li>get test&nbsp;' + value.get_test + '</li></ul>';
                                }
                            );
                            status_output += '</ul></font>';

                            status_output += '<li>Tests</li><font size="-1"><ul>';
                            for (i = 0; i < current_status.tests_to_run.length; i = i + 1) {
                                test = current_status.tests_to_run[i];
                                color = '';
                                if (test.running > 0) {
                                    color = 'style="background-color:yellow"';
                                }
                                status_output += '<li>Test</li><ul>';
                                status_output += '<li ' + color + '>Test:    ' + test.url + '</li>';
                                status_output += '<li ' + color + '>Browser: ' + test.browser + '</li>';
                                status_output += '<li ' + color + '>Running: ' + test.running + '</li></ul>';
                            }
                            status_output += '</ul>';
                            status_output += '</font></ul>';
                            Y.one('#list').setContent(status_output);

                            // Make result output pretty
                            result_output = '<h4 align="center">Results</h4><div id="count"></div><ul>';
                            if (current_results) {
                                if (current_results['lcov-report']) {
                                    result_output += '<li><a href="/jutebase/output/lcov-report/index.html">Total Coverage</a></li>';
                                }
                                Y.each(current_results, 
                                    function(value, key, object) {
                                        var file, color, found = 0, show;

                                        if (key === 'lcov.info' || key === 'lcov-report') {
                                            return;
                                        }

                                        result_output += '<li>' + key + '</li><ul>';
                                        if (value.test_results) {
                                            for (i = 0; i < value.test_results.length; i = i + 1) {
                                                file = value.test_results[i].name;
                                                color = value.test_results[i].failed ? 'red' : 'green';
                                                show = file;
                                                show = show.replace(/-test.xml$/, '');
                                                result_output += '<li><a target="_blank" title="' + file + '" href="/jutebase/output/' + key + '/' + file + '"><font color="' + color + '">' + show + '</font></a></li>';
                                                if (value.test_results[i].failed && !found) {
                                                    found = 1;
                                                    errorCount +=1;
                                                }
                                            }
                                        }
                                        if (value.coverage == 1) {
                                            result_output += '<li><a target="_blank" href="/jutebase/output/' + key + '/lcov-report/index.html">Coverage Report</a></li>';
                                        }
                                        result_output += '</ul>';
                                    }
                                );
                            }
                            result_output += '</ul>';

                            Y.one('#results').setContent(result_output);
                            UT.current_status = Y.JSON.stringify(current_status);
                            Y.one('#count').setContent('<p>' + errorCount + ' test failure(s) found.</p>');
                        }
                    } catch (e) {
                    console.log(e);
                        Y.one('#list').setContent('<pre>' + response.responseText + '</pre>');
                    }
                },
                end: function(transactionid) {
                    Y.later(5000, {}, UT.heartBeat);
                }
            }
    };

    Y.io('/jute/_heart_beat', cfg);

};

UT.content_set = false;
UT.waitLoop = function() {
    var cfg = {
        method: 'GET',
        data: "d=" + new Date().getTime(),
        on: { 
                success: function (transactionid, response) {
                    var data, qs, connect, i, content_node, content, test;
                    try {
                        data = Y.JSON.parse(response.responseText);
                        if (data.testLocation) {
                            // get the current URL
                            qs = window.location.search.substring(1);
                            //get the parameters & mash them with testLocation
                            connect = '?';
                            if (data.testLocation.match(/\?/)) {
                                connect = '&';
                            }
                            if (qs) {
                                data.testLocation = data.testLocation + connect + qs;
                            }
                            window.location.href = data.testLocation;
                        } else if (!UT.content_set && data.availableTests) {
                            content_node = Y.one('#content');
                            content = '<form method="POST" name="multiple_tests" action="/jute/_run_multiple">';
                            content += '<h2 align="center"><span style="float:right;"><input type="submit" value="Run Tests"/></span>Available Tests</h2>';
                            content += '<table width="100%" border="0" cellpadding="2" cellspacing="1"><tr><th>Test File (located at /jutebase/test/)</th><th><input type="checkbox" id="run_all_no_cov">&nbsp;Run Without Coverage</th><th><input type="checkbox" id="run_all_cov">&nbsp;Run With Coverage</th></tr>';
                            for (i = 0; i < data.availableTests.length; i = i + 1) {
                                test = data.availableTests[i];
                                content += '<tr>';
                                content += '<td>' + test.test_url.replace(/\/jutebase\/test/gi,'') + '</td>';
                                content += '<td align="center"><input name="test" class="no_cov_cbox" type="checkbox" value="' + test.test_url + ';" />&nbsp;<a href="' + test.test_url + '?_one_shot=1">Run</a></td>';
                                content += '<td align="center"><input name="test" class="cov_cbox" type="checkbox" value="' + test.test_url + '?do_coverage=1;" /><a href="' + test.test_url + '?_one_shot=1&do_coverage=1">Run</a></td>';
                                content += '</tr>';
                            }
                            content += '</table>';
                            content += '<input type="submit" value="Run Tests" />';
                            content_node.setContent(content);
                            Y.one('#run_all_no_cov').on('click', function() { 
                                Y.all('.no_cov_cbox').set('checked', Y.one('#run_all_no_cov').get('checked')); 
                            });
                            Y.one('#run_all_cov').on('click', function() { 
                                Y.all('.cov_cbox').set('checked', Y.one('#run_all_cov').get('checked')); 
                            });
                            UT.content_set = true;
                        }
                    }
                    catch(e) {
                        // Nothing to run prolly or server went away
                        console.log(e);
                    }
                },
                end: function(transactionid) {
                    Y.later(5000, {}, UT.waitLoop);
                },
                failure: function() { 
                    // this of course will never happen...
                }
            }
    };

    Y.io('/jute/_get_test', cfg);
};

button = Y.one('#get_coverage_button');
if (button) {
    button.on('click', function() {
        // open iframe in same domain to grab coverage output
        console.log("current status: " + UT.current_status);
        var current_status = Y.JSON.parse(UT.current_status), i, obj;
        for (i = 0; i < current_status.tests_to_run.length; i = i + 1) {
            obj = current_status.tests_to_run[i];
            if (navigator.userAgent === obj.browser && obj.running > 0) {
                Y.one('#grabber').setAttribute('src', obj.remote_grabber);
                Y.later(5000, {}, function() { Y.one('#run_tests').setAttribute('src', '/jute_docs/run_tests.html'); });
            }
        }
    });
}

load_button = Y.one('#load_button');
if (load_button) {
    load_button.on('click', function() {
            var load_me = Y.one('#load_file').get('value');
            Y.io('/jute/_run_test',
                {
                    method: 'POST',
                    data: 'test=' + escape(load_me)
                }
            );
    });
}

kick_button = Y.one('#kick_frame');
if (kick_button) {
    kick_button.on('click', function() {
        Y.one('#run_tests').setAttribute('src', '/jute_docs/run_tests.html');
    });
}

clear_button = Y.one('#clear_tests');
if (clear_button) {
    clear_button.on('click', function() {
        Y.io('/jute/_clear_tests', 
            {
                method: 'GET',
                on: {
                    success: function() { 
                        Y.one('#run_tests').setAttribute('src', '/jute_docs/run_tests.html');
                    },
                    failure: function() { 
                        Y.one('#run_tests').setAttribute('src', '/jute_docs/run_tests.html');
                    }
                }
            }
        );
    });
}

clear_results = Y.one('#clear_results');
if (clear_results) {
    clear_results.on('click', function() {
        Y.io('/jute/_clear_results');
    });
}

Y.Test.Runner.subscribe(Y.Test.Runner.COMPLETE_EVENT,
    function(data) {
        var cover_out = Y.Test.Runner.getCoverage(Y.Coverage.Format.JSON),
            report_data = Y.Test.Format.JUnitXML(data.results);
        if (window.__done) {
            // V8!!
            window.__done(data, report_data, typeof(_yuitest_coverage) == 'object' ? _yuitest_coverage : null, cover_out);
        } else {
            // BROWSER!!
            Y.io('/jute/_test_report', 
                {
                    method: 'POST',
                    data: 'results=' + escape(report_data) + '&name=' + escape(data.results.name) + "&coverage=" + escape(cover_out),
                    on: {
                        success: function(tid, args) {
                            if (!window.location.toString().match("_one_shot")) {
                                window.location.href = '/jute_docs/run_tests.html';
                            }
                        },
                        failure: function(tid, args) {
                            if (!window.location.toString().match("_one_shot")) {
                                window.location.href = '/jute_docs/run_tests.html';
                            }
                        }

                    }
                }
            );
        }
    }
);

// some boilerplate stuff
UT.go = function() {
    //initialize the console
    if (Y.Console) {
        var yconsole = new Y.Console({
            newestOnTop: false
        });
        yconsole.render('#log');
    }

    //run the tests
    try {
        Y.Test.Runner.run();
    }
    catch (e) {
        // skip this test - pop & move on
        Y.io('/jute/_pop', { on: { end: function() { window.location.href = '/jute_docs/run_tests.html'; } } });
    }
};


}, 'gallery-2011.06.22-20-13' ,{requires:['test', 'console', 'json', 'io', 'node'], skinnable:false});
