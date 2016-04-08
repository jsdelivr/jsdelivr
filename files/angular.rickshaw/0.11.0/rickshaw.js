/**
 @toc

 @param {Object} scope (attrs that must be defined on the scope (i.e. in the controller) - they can't just be defined in the partial html). REMEMBER: use snake-case when setting these on the partial!
 TODO

 @param {Object} attrs REMEMBER: use snake-case when setting these on the partial! i.e. my-attr='1' NOT myAttr='1'
 TODO

 @dependencies
 TODO

 @usage
 partial / html:
 TODO

 controller / js:
 TODO

 //end: usage
 */

'use strict';

/* global Rickshaw */

angular.module('angular-rickshaw', [])
        .directive('rickshaw', ['$compile', '$window', function($compile, $window) {
            return {
                restrict: 'EA',
                scope: {
                    options: '=rickshawOptions',
                    series: '=rickshawSeries',
                    features: '=rickshawFeatures'
                },
                // replace: true,
                link: function(scope, element, attrs) {
                    var mainEl;
                    var graphEl;
                    var legendEl;
                    var xAxis;
                    var yAxis;
                    var graph;
                    var settings;

                    function redraw() {
                        graph.setSize();
                        graph.render();
                    }

                    function _splice(args) {
                        var data = args.data;
                        var series = args.series;

                        if (!args.series) {
                            return data;
                        }

                        series.forEach(function(s) {
                            var seriesKey = s.key || s.name;
                            if (!seriesKey) {
                                throw "series needs a key or a name";
                            }

                            data.forEach(function(d) {
                                var dataKey = d.key || d.name;
                                if (!dataKey) {
                                    throw "data needs a key or a name";
                                }
                                if (seriesKey == dataKey) {
                                    var properties = ['color', 'name', 'data'];
                                    properties.forEach(function(p) {
                                        if (d[p]) {
                                            s[p] = d[p];
                                        }
                                    });
                                }
                            } );
                        });
                    }

                    function updateData() {
                        if (graph && settings) {
                            _splice({ data: scope.series, series: settings.series });
                            redraw();
                        }
                    }

                    function updateConfiguration() {
                        if (!graph) {
                            mainEl = angular.element(element);
                            mainEl.append(graphEl);
                            mainEl.empty();
                            graphEl = $compile('<div></div>')(scope);
                            mainEl.append(graphEl);

                            settings = angular.copy(scope.options);
                            settings.element = graphEl[0];
                            settings.series = scope.series;

                            graph = new Rickshaw.Graph(settings);
                        }
                        else {
                            if (scope.options) {
                                for (var key in scope.options) {
                                    settings[key] = scope.options[key];
                                    console.log(key + '=' + scope.options[key]);
                                }
                                settings.element = graphEl[0];
                            }

                            graph.configure(settings);
                        }

                        if (scope.features) {
                            if (scope.features.hover) {
                                var hoverConfig = {
                                    graph: graph
                                };
                                hoverConfig.xFormatter = scope.features.hover.xFormatter;
                                hoverConfig.yFormatter = scope.features.hover.yFormatter;
                                hoverConfig.formatter = scope.features.hover.formatter;
                                var hoverDetail = new Rickshaw.Graph.HoverDetail(hoverConfig);
                            }

                            if (scope.features.palette) {
                                var palette = new Rickshaw.Color.Palette({scheme: scope.features.palette});
                                for (var i = 0; i < settings.series.length; i++) {
                                    settings.series[i].color = palette.color();
                                }
                            }
                        }

                        redraw();

                        if (scope.features) {
                            if (scope.features.xAxis) {
                                var xAxisConfig = {
                                    graph: graph
                                };
                                if (scope.features.xAxis.timeUnit) {
                                    var time = new Rickshaw.Fixtures.Time();
                                    xAxisConfig.timeUnit = time.unit(scope.features.xAxis.timeUnit);
                                }
                                if (scope.features.xAxis.tickFormat) {
                                    xAxisConfig.tickFormat = scope.features.xAxis.tickFormat;
                                }
                                if (scope.features.xAxis.ticksTreatment) {
                                    xAxisConfig.ticksTreatment = scope.features.xAxis.ticksTreatment;
                                }
                                if (!xAxis) {
                                    xAxis = new Rickshaw.Graph.Axis.X(xAxisConfig);
                                    xAxis.render();
                                }
                                else {
                                    // Update xAxis if Rickshaw allows it in future.
                                }
                            }
                            else {
                                // Remove xAxis if Rickshaw allows it in future.
                            }

                            if (scope.features.yAxis) {
                                var yAxisConfig = {
                                    graph: graph
                                };
                                if (scope.features.yAxis.tickFormat) {
                                    var tickFormat = scope.features.yAxis.tickFormat;
                                    if (typeof tickFormat === 'string'){
                                        yAxisConfig.tickFormat = Rickshaw.Fixtures.Number[tickFormat];
                                    } else {
                                        yAxisConfig.tickFormat = tickFormat;
                                    }
                                }
                                if (!yAxis) {
                                    yAxis = new Rickshaw.Graph.Axis.Y(yAxisConfig);
                                    yAxis.render();
                                }
                                else {
                                    // Update yAxis if Rickshaw allows it in future.
                                }
                            }
                            else {
                                // Remove yAxis if Rickshaw allows it in future.
                            }

                            if (scope.features.legend) {
                                if (!legendEl) {
                                    legendEl = $compile('<div></div>')(scope);
                                    mainEl.append(legendEl);

                                    var legend = new Rickshaw.Graph.Legend({
                                        graph: graph,
                                        element: legendEl[0]
                                    });
                                    if (scope.features.legend.toggle) {
                                        var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
                                            graph: graph,
                                            legend: legend
                                        });
                                    }
                                    if (scope.features.legend.highlight) {
                                        var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
                                            graph: graph,
                                            legend: legend
                                        });
                                    }
                                }
                            }
                            else {
                                if (legendEl) {
                                    legendEl.remove();
                                    legendEl = null;
                                }
                            }
                        }
                    }

                    var optionsWatch = scope.$watch('options', function(newValue, oldValue) {
                        if (!angular.equals(newValue, oldValue)) {
                            updateConfiguration();
                        }
                    }, true);
                    var seriesWatch = scope.$watchCollection('series', function(newValue, oldValue) {
                        if (!angular.equals(newValue, oldValue)) {
                            updateData();
                        }
                    }, true);
                    var featuresWatch = scope.$watch('features', function(newValue, oldValue) {
                        if (!angular.equals(newValue, oldValue)) {
                            updateConfiguration();
                        }
                    }, true);

                    scope.$on('$destroy', function() {
                        optionsWatch();
                        seriesWatch();
                        featuresWatch();
                    });

                    angular.element($window).on('resize', function() {
                        scope.$broadcast('rickshaw::resize');
                    });
                    
                    scope.$on('rickshaw::resize', function() {
                        redraw();
                    });
                    
                    updateConfiguration();
                },
                controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                }]
            };
        }]);
