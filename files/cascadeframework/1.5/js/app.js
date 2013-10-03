if (!Array.isArray) {
    Array.isArray = function(vArg) {
        return Object.prototype.toString.call(vArg) === "[object Array]";
    };
}

window.App = (function(w, document) {
    var App = {
        jsmodulePath: 'module',
        jsappPath: 'app',
        jssitePath: 'site',
        jsjqueryPath: 'jquery',
        jsshimPath: 'shim',
        trackingcode: 'UA-38735730-1',
        logging: false,
        logload: true,
        docHost: window.location.hostname,
        docPath: window.location.pathname,
        jsroot: function(filename) {
            var scripts = document.getElementsByTagName('script');
            if (scripts && scripts.length > 0) {
                for (var i in scripts) {
                    if (scripts[i].src && scripts[i].src.match(new RegExp(filename + '\\.js$'))) {
                        return scripts[i].src.replace(new RegExp('(.*)' + filename + '\\.js$'), '$1');
                    }
                }
            }
        }('app'),
        exists: function(arg){
            return typeof arg !== "undefined";
        },
        relativePath: function(path) {
            return App.jsroot + path;
        },
        modulePath: function(path) {
            return App.relativePath(App.jsmodulePath + '/' + path);
        },
        appPath: function(path) {
            return App.relativePath(App.jsappPath + '/' + path);
        },
        sitePath: function(path) {
            return App.relativePath(App.jssitePath + '/' + path);
        },
        shimPath: function(path) {
            return App.relativePath(App.jsshimPath + '/' + path);
        },
        jqueryPath: function(path) {
            return App.modulePath(App.jsjqueryPath + '/' + path);
        },
        log: function(value) {
            if (App.logging && App.exists(window.console)) {
                console.log(value);
            }
        },
        asset: {
        },
        define: function(args) {
            if (!Array.isArray(args)) {
                args = [args];
            }
            var length = args.length;
            var arg;
            for (var i = 0; i < length; i++) {
                arg = args[i];
                if (!App.exists(arg.callback)) {
                    arg.callback = function() {
                    };
                }
                if (!App.exists(arg.name)) {
                    arg.name = arg.id;
                }
                if (!App.exists(arg.dependencies)) {
                    arg.dependencies = [];
                } else if (!Array.isArray(arg.dependencies)) {
                    arg.dependencies = [arg.dependencies];
                }
                w.App.asset[arg.id] = {
                    name: arg.name,
                    path: arg.path,
                    dependencies: arg.dependencies,
                    callback: arg.callback,
                    loaded: false,
                    loadcomplete: false
                };
            }
        },
        load: function(loading, toload, callback) {
            if (!App.exists(callback)) {
                callback = function() {
                };
            }
            if (!App.exists(loading)) {
                loading = [];
            }
            if (!App.exists(toload)) {
                loading = {load: {}};
            }
            var asset;
            var dependentAsset;
            var length = loading.length;
            var lengthdependencies;
            for (var i = 0; i < length; i++) {
                asset = App.asset[loading[i]];
                lengthdependencies = asset.dependencies.length;
                if (lengthdependencies > 0) {
                    for (var j = 0; j < lengthdependencies; j++) {
                        dependentAsset = App.asset[asset.dependencies[j]];
                        if (!dependentAsset.loadcomplete) {
                            setTimeout(function() {
                                App.load(loading, toload, callback);
                            }, 50);
                            return true;
                        }
                    }
                }
                if (!asset.loadcomplete) {
                    setTimeout(function() {
                        App.load(loading, toload, callback);
                    }, 50);
                    return true;
                }
            }
            for (var load in toload.load) {
                toload.complete = callback;
                yepnope(toload);
                return true;
            }
            callback();
        },
        use: function(args) {
            if (!Array.isArray(args)) {
                args = [args];
            }
            var arg;
            var callback;
            var length;
            var lengthdependencies;
            var asset;
            var dependency;
            var loading;
            var toload;
            var lengthargs = args.length;
            for (var h = 0; h < lengthargs; h++) {
                arg = args[h];
                callback = arg.callback;
                if (!App.exists(arg.callback)) {
                    arg.callback = function() {
                    };
                }
                if (!Array.isArray(arg.dependencies)) {
                    arg.dependencies = [arg.dependencies];
                }
                length = arg.dependencies.length;
                loading = [];
                toload = {
                    load: {
                    },
                    callback: {
                    }
                };
                for (var i = 0; i < length; i++) {
                    dependency = arg.dependencies[i];
                    asset = App.asset[dependency];
                    if (!asset.loaded) {
                        asset.loaded = true;
                        if (asset.path !== null) {
                            toload.load[dependency] = asset.path;
                            lengthdependencies = asset.dependencies.length;
                            if (lengthdependencies > 0) {
                                App.use({
                                    dependencies: asset.dependencies
                                });
                            }
                            toload.callback[dependency] =
                                    function(asset, logload) {
                                        return function() {
                                            asset.callback();
                                            if (logload) {
                                                App.log(asset.name + ' loaded!');
                                            }
                                            asset.loadcomplete = true;
                                        }
                                        ;
                                    }(asset, App.logload);
                        } else {
                            if (App.logload) {
                                App.log(asset.name + ' skipped!');
                            }
                            asset.loadcomplete = true;
                        }
                    } else if (!asset.loadcomplete) {
                        loading.push(dependency);
                    }
                }
                App.load(loading, toload, arg.callback);
            }
        },
        initialize: function(callback) {
            var l = document.createElement('script');
            l.src = App.appPath('yepnope.js');
            l.type = 'text/javascript';
            l.async = 'true';
            l.onload = l.onreadystatechange = function() {
                var rs = this.readyState;
                if (rs && rs !== 'complete' && rs !== 'loaded')
                    return;
                callback();
            };
            var s = document.scripts[0];
            s.parentNode.insertBefore(l, s);
        }
    };
    App.docPathSplit = App.docPath.split(/[\\/]/);
    App.docPathEnd = App.docPathSplit[App.docPathSplit.length - 1];
    return App;
})(this, this.document);


App.initialize(function() {
    App.define([{
            id: 'detector',
            name: 'Detector',
            path: App.appPath('detector.js')
        }, {
            id: 'ecmascript5',
            name: 'Ecmascript5 shiv',
            path: App.shimPath('ecmascript5.js')
        }, {
            id: 'console',
            name: 'Console shiv',
            dependencies: 'ecmascript5',
            path: (typeof window.console === "undefined") ? App.shimPath('console.js') : null
        }, {
            id: 'definitions',
            name: 'Site definitions',
            path: App.modulePath('definitions.js')
        }, {
            id: 'base',
            name: 'Site wide custom JS',
            path: App.sitePath('base.js')
        }]);

    App.use({
        dependencies: ['console', 'detector', 'definitions', 'base']
    });
});
