YUI.add('gallery-yqlmock', function (Y, NAME) {

/*
 * Copyright (c) 2013 Yahoo! Inc. All rights reserved.
 */

/*global YUITest*/

    'use strict';
    function YQLMock() {
        var A = YUITest.Assert,
            mock = {},
            // Object that holds all expectations
            expectationPool = {},
            // Keep a reference to the old YUI.YQL and YUI.YQLRequest function
            oldYQL = Y.YQL,
            oldYQLRequest = Y.YQLRequest;

        /**
        * Returns an error object.
        * @param Integer error number.
        * @param {Object} msgObj to complete error message if needed.
        * return error Object.
        */
        function getErrorObj(errno, msgObj) {
            var obj = {
                errno: errno
            };

            switch (errno) {
            case 0:
                obj.name = "Unexpected numbers of calls";
                obj.message = "YQL Call numbers unexpected.\nExpected calls: " + msgObj.expectedCalls + "\nActual calls: " + msgObj.actuallCalls;
                obj.message +=  "\nDetails:\nsql: " + msgObj.sql + "\nparams: " + msgObj.params + "\nopts: " + msgObj.opts;
                break;
            case 1:
                obj.name = "Invalid expectation object";
                obj.message = 'Expectation Object needs to have at least a "sql" field';
                break;
            case 2:
                obj.name = "Query Type Error";
                obj.message = "Query needs to be a String";
                break;
            case 3:
                obj.name = "Unexpected Query";
                obj.message = "Unexpected YQL call:\nsql: " + msgObj.sql + "\ncallback: " + msgObj.callback + "\nparams: ";
                obj.message +=  msgObj.params + "\nopts: " + msgObj.opts + "\nPlease check your expectation again.";
                break;
            }

            return obj;
        }


        /**
        * Returns object with keys sorted.
        * Pushes all the keys into an array and sort the array.
        * @param {Object} obj To be sorted.
        * return Object with keys sorted.
        */
        function deepSortObjKeys(obj) {
            var sorted = {},
                a = [],
                key,
                i;

            // Iterate through each key in the object
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === "object") {
                        // Calling this function with nested object recursively
                        obj[key] = deepSortObjKeys(obj[key]);
                    }
                    a.push(key);
                }
            }
            // Alphabetically sort keys
            a.sort();
            // Generate new object with keys sorted
            for (i = 0; i < a.length; i += 1) {
                sorted[a[i]] = obj[a[i]];
            }
            return sorted;
        }

        /**
         * Generate hashkey.
         * @param {Object} obj To generate hashkey.
         * return hashkey
         */
        function generateSignature(obj) {
            var signature;

            if (typeof obj.sql !== "string") {
                // Sql needs to be a string
                throw getErrorObj(2);
            }
            // Callback not considered in signature!!
            signature = "sql=" + String(obj.sql) + "&params=" + JSON.stringify(deepSortObjKeys(obj.params));
            signature += "&opts=" + JSON.stringify(deepSortObjKeys(obj.opts));
            return signature;
        }

        /**
         * Mocking YUI.YQL.
         * Find matching configurations in expectations, and record call counts.
         * Raise error if configuration is not found in expectations.
         * @param {Objects} objs Of YUI.YQL arguments.
         * pass result to callback if callback presents
         */
        function mockingYQL(sql, callback, params, opts) {
            var withCallback = (typeof callback === "function"),
                obj = {
                    sql: sql,
                    params: withCallback ? params : callback,
                    opts: withCallback ? opts : params
                },
                signature = generateSignature(obj);

            // Finds out whether the configuration is in expectation
            if (!expectationPool[signature]) {
                // YQL call not registered
                throw getErrorObj(3, {
                    sql: String(obj.sql),
                    callback: withCallback ? String(callback) : 'undefined',
                    params: JSON.stringify(obj.params),
                    opts: JSON.stringify(obj.opts)
                });
            }
            // Increment call count
            expectationPool[signature].actuallCalls += 1;
            if (withCallback) {
                callback(expectationPool[signature].returnItem);
            }
        }

        /**
         * Set up expectation object(s) into expectation pool.
         * @param {Object}|[Array of {Objects}] obj To be expected.
         */
        mock.expect = function (obj) {
            var i,
                saveExpectation = function (object) {
                    var signature;
                    if (!object || !object.sql) {
                        throw getErrorObj(1);
                    }
                    // Store the expectation
                    signature = generateSignature(object);
                    expectationPool[signature] = {
                        "sql": String(object.sql),
                        "params": JSON.stringify(object.params),
                        "opts": JSON.stringify(object.opts),
                        "expectedCalls": parseInt(object.callCount, 10) || 1,
                        "actuallCalls": 0,
                        "returnItem": {
                            "query": {
                                "results": object.resultSet || {}
                            }
                        }
                    };
                };

            if (obj instanceof Array) {
                for (i = 0; i < obj.length; i += 1) {
                    saveExpectation(obj[i]);
                }
            } else {
                saveExpectation(obj);
            }
        };

        /**
         * Verify YQL calls to see whether all expectations are met.
         * Fail on unexpected number of calls.
         */
        mock.verify = function () {
            // Restore YQL function
            Y.YQL = oldYQL;
            Y.YQLRequest = oldYQLRequest;

            // Compare each expectation object to see whether actual call counts achieved
            Y.Object.each(expectationPool, function (exp) {
                if (exp.expectedCalls !== exp.actuallCalls) {
                    throw getErrorObj(0, exp);
                }
            });

            // All YQL calls are expected. Pass the test.
            A.pass();
        };

        // Restore YQL
        mock.restoreYQL = function () {
            Y.YQL = oldYQL;
            Y.YQLRequest = oldYQLRequest;
        };

        // Mock YQL
        mock.mockYQL = function () {
            Y.YQL = mockingYQL;
            Y.YQLRequest = mockingYQL;
        };

        // Overwrite YUI.YQL functions
        Y.YQL = mockingYQL;
        Y.YQLRequest = mockingYQL;

        return mock;
    }

    Y.YQLMock = YQLMock;


}, 'gallery-2013.04.10-22-48', {"requires": ["yui-base"]});
