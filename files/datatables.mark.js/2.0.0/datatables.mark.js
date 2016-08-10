/*!***************************************************
 * datatables.mark.js v2.0.0
 * https://github.com/julmot/datatables.mark.js
 * Copyright (c) 2016, Julian Motz
 * Released under the MIT license https://git.io/voRZ7
 *****************************************************/

"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (factory, window, document) {
    if (typeof define === "function" && define.amd) {
        define(["jquery", "datatables.net", "markjs"], function (jQuery) {
            return factory(window, document, jQuery);
        });
    } else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object") {
        require("datatables.net");
        require("markjs");
        factory(window, document, require("jquery"));
    } else {
        factory(window, document, jQuery);
    }
})(function (window, document, $) {
    var Mark_DataTables = function () {
        function Mark_DataTables(dtInstance, options) {
            _classCallCheck(this, Mark_DataTables);

            if (typeof $.fn.mark !== "function" || typeof $.fn.unmark !== "function") {
                throw new Error("jquery.mark.js is necessary for datatables.mark.js");
            }
            this.instance = dtInstance;
            this.options = (typeof options === "undefined" ? "undefined" : _typeof(options)) === "object" ? options : {};
            this.intervalThreshold = 49;
            this.intervalMs = 300;
            this.initMarkListener();
        }

        _createClass(Mark_DataTables, [{
            key: "initMarkListener",
            value: function initMarkListener() {
                var _this = this;

                var ev = "draw.dt.dth column-visibility.dt.dth column-reorder.dt.dth";
                var intvl = null;
                this.instance.on(ev, function () {
                    var rows = _this.instance.rows({
                        filter: "applied",
                        page: "current"
                    }).nodes().length;
                    if (rows > _this.intervalThreshold) {
                        clearTimeout(intvl);
                        intvl = setTimeout(function () {
                            _this.mark();
                        }, _this.intervalMs);
                    } else {
                        _this.mark();
                    }
                });
                this.instance.on("destroy", function () {
                    _this.instance.off(ev);
                });
                this.mark();
            }
        }, {
            key: "mark",
            value: function mark() {
                var _this2 = this;

                var globalSearch = this.instance.search();
                $(this.instance.table().body()).unmark(this.options);
                this.instance.columns({
                    search: "applied",
                    page: "current"
                }).nodes().each(function (nodes, colIndex) {
                    var columnSearch = _this2.instance.column(colIndex).search(),
                        searchVal = columnSearch || globalSearch;
                    if (searchVal) {
                        nodes.forEach(function (node) {
                            $(node).mark(searchVal, _this2.options);
                        });
                    }
                });
            }
        }]);

        return Mark_DataTables;
    }();

    $(document).on("init.dt.dth", function (event, settings) {
        if (event.namespace !== "dt") {
            return;
        }

        var dtInstance = $.fn.dataTable.Api(settings);

        var options = null;
        if (dtInstance.init().mark) {
            options = dtInstance.init().mark;
        } else if ($.fn.dataTable.defaults.mark) {
            options = $.fn.dataTable.defaults.mark;
        }
        if (options === null) {
            return;
        }

        new Mark_DataTables(dtInstance, options);
    });
}, window, document);
