YUI.add('gallery-user-patch-2529808', function(Y) {

/**
* Patch for YUI 3.3.0 DataTableScroll plugin bug #2529808
* Enables support for using DataTableScroll plugin when data is lazy loaded (e.g. when using a datasource).
* Ticket URL - http://yuilibrary.com/projects/yui3/ticket/2529808
* 
* Thanks to eamonb a.k.a mosen for his peer review and help testing
* @requires datatable-scroll
*/


// added automatically by build system
//YUI.add('gallery-user-patch-2529808', function(Y) {

var DTScroll = Y.Plugin.DataTableScroll;

if (!DTScroll.prototype.orig_syncWidths) {

    // wrap initializer and _syncWidths with custom functions
    // can't use bindUI because it is never called for this plugin
    
    DTScroll.prototype.orig_initializer = DTScroll.prototype.initializer;
    DTScroll.prototype.initializer = function () {
        this.orig_initializer();
        // trigger UI refresh when data changes so _syncWidths will be called
        this.afterHostEvent('recordsetChange', this.syncUI);
    };

    DTScroll.prototype.orig_syncWidths = DTScroll.prototype._syncWidths;
    DTScroll.prototype._syncWidths = function () {
        var dt = this.get('host'),
            set = dt.get('recordset');

        // original _syncWidths assumes non-empty recordset and will throw error if empty
        if (set.getLength() === 0) {
            return;
        }

        this.orig_syncWidths();
    };
}

// added automatically by build system
//}, '1.0.0', {requires:['datatable-scroll']});


}, 'gallery-2011.05.18-19-11' ,{requires:['datatable-scroll']});
