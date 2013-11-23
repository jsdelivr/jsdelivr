
Loader([{
    load: 'assets/js/lib/jquery/flot/jquery.flot.js',
    callback: function () {
        App.log("Flot loaded!");
    }
}, {
    load: 'assets/js/lib/jquery/flot/jquery.flot.categories.js',
    callback: function () {
        App.log("Flot categories loaded!");
    }
}, {
    load: 'assets/js/flot-demo.js',
    callback: function () {
        App.log("Flot demo loaded!");
    }
}]);
