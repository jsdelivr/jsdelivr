YUI.add('gallery-paginator-dev-preview', function(Y) {

YUI.add('gallery-paginator-dev-preview-core', function (Y) {
/**
Core model for pagination.  Include in
`Y.Base.create(NAME, SuperClass, [ Y.Paginator.Core, ... ])` when creating a
class needing pagination controls.

@module paginator
@submodule paginator-core
@since 3.6.0
**/
var INVALID  = Y.Attribute.INVALID_VALUE,
    isNumber = Y.Lang.isNumber;

/**
Core model class extension for Pagination state attributes. Manages `page`,
`itemsPerPage`, `totalItems`.  Also includes a read-only `pages` attribute.

@class Paginator.Core
@constructor
@since 3.6.0
**/
function PaginatorCore() {}

PaginatorCore.ATTRS = {
    /**
    The total number of items being paged over.  Must be 0 or a positive number.

    @attribute totalItems
    @type {Number}
    @value 0
    **/
    totalItems: {
        value: 0,
        validator: '_validateTotalItems'
    },

    /**
    Number of items to make up what is considered "a page".

    @attribute itemsPerPage
    @type {Number}
    @default 1
    **/
    itemsPerPage: {
        value: 1,
        // TODO: change to setter that forces int
        validator: '_validateItemsPerPage'
    },

    /**
    The current page.  If set to a number greater than the total pages being
    managed, it will be adjusted to the last page.

    If `totalRecords` is 0, this will also be 0.

    @attribute page
    @type {Number}
    @default 1
    **/
    page: {
        valueFn: '_initPage',
        setter: '_setPage'
    },

    /**
    Read only attribute to get the number of pages being managed given the
    current `totalItems` and `itemsPerPage`.

    @attribute pages
    @type {Number}
    @readOnly
    **/
    pages: {
        readOnly: true,
        getter: '_getPages'
    }
};

Y.mix(PaginatorCore.prototype, {
    next: function () {
        this.set('page', this.get('page') + 1);
    },

    previous: function () {
        this.set('page', this.get('page') - 1);
    },

    //--------------------------------------------------------------------------
    // Protected properties and methods
    //--------------------------------------------------------------------------
    _afterItemsPerPageChange: function (e) {
        var currentPage = this.get('page'),
            currentIndex = currentPage ? (currentPage - 1) * e.prevVal : 0;

        this.set('page', Math.floor(currentIndex / e.newVal) + 1, {
            originEvent: e
        });
    },

    _afterTotalItemsChange: function (e) {
        var totalItems   = e.newVal,
            itemsPerPage = this.get('itemsPerPage'),
            offset       = (this.get('page') - 1) * itemsPerPage;

        if (totalItems < e.prevVal && totalItems <= offset) {
            this.set('page', Math.ceil(totalItems / itemsPerPage), {
                originEvent: e
            });
        }
    },

    _getPages: function () {
        return Math.ceil(this.get('totalItems') / this.get('itemsPerPage'));
    },

    initializer: function () {
        this.after({
            totalItemsChange  : Y.bind('_afterTotalItemsChange', this),
            itemsPerPageChange: Y.bind('_afterItemsPerPageChange', this)
        });
    },

    _initPage: function () {
        return this.get('totalItems') > 0 ? 1 : 0;
    },

    _setPage: function (val) {
        var itemsPerPage = this.get('itemsPerPage'),
            totalItems   = this.get('totalItems'),
            offset;

        val = +val;

        if (val > 0) {
            offset = (val - 1) * 'itemsPerPage';

            if (offset >= totalItems) {
                val = Math.ceil(totalItems / itemsPerPage);
            }
        } else {
            val = INVALID;
        }

        return val;
    },

    _validateTotalItems: function (val) {
        return isNumber(val) && val > 0;
    },

    _validateItemsPerPage: function (val) {
        return isNumber(val) && val > 0;
    }
}, true);

Y.namespace('Paginator').Core = PaginatorCore;
}, 'gallery-2012.04.26-15-49');
YUI.add('lang/gallery-paginator-dev-preview-simple-view', function (Y) {
Y.Intl.add('paginator-simple-view', '', 
{
    first   : 'first',
    last    : 'last',
    next    : 'next',
    previous: 'previous'
}
);}, 'gallery-2012.04.26-15-49');

YUI.add('lang/gallery-paginator-dev-preview-simple-view_en', function (Y) {
Y.Intl.add('paginator-simple-view', 'en', 
{
    first   : 'first',
    last    : 'last',
    next    : 'next',
    previous: 'previous'
}
);}, 'gallery-2012.04.26-15-49');

YUI.add('gallery-paginator-dev-preview-simple-view', function (Y) {
var getClass = Y.ClassNameManager.getClassName,
    PAGINATOR = 'paginator',
    PAGE      = 'page',
    DOT       = '.',
    FIRST_CLASS    = getClass(PAGINATOR, 'first', PAGE),
    LAST_CLASS     = getClass(PAGINATOR, 'last', PAGE),
    NEXT_CLASS     = getClass(PAGINATOR, 'next', PAGE),
    PREVIOUS_CLASS = getClass(PAGINATOR, 'previous', PAGE),
    PAGE_CLASS     = getClass(PAGINATOR, PAGE),
    PAGES_CLASS    = getClass(PAGINATOR, 'pages'),
    PAGE_ITEM_CLASS= getClass(PAGINATOR, 'page', 'item'),
    CURRENT_CLASS  = getClass(PAGINATOR, 'current', PAGE),
    PAGE_ATTR      = 'yui3-page',
    events = {};

events[DOT + FIRST_CLASS]    =
events[DOT + LAST_CLASS]     =
events[DOT + NEXT_CLASS]     =
events[DOT + PREVIOUS_CLASS] =
events[DOT + PAGE_CLASS]     = { click: '_onPageLinkClick' };

Y.Paginator.SimpleView = Y.Base.create(PAGINATOR, Y.View, [], {
    render: function () {
        this.get('container').setContent(this._createHTML());

        this._bindUI();
    },

    _bindUI: function () {
        if (!this._changeHandles) {
            this._changeHandles = this.get('host').after(
                ['pageChange', 'totalItemsChange', 'itemsPerPageChange'],
                this.render, this);
        }
    },

    _createHTML: function () {
        var data = Y.merge(
            this.get('strings'), {
                firstClass   : FIRST_CLASS,
                lastClass    : LAST_CLASS,
                nextClass    : NEXT_CLASS,
                previousClass: PREVIOUS_CLASS,
                pageClass    : PAGE_CLASS,
                pagesClass   : PAGES_CLASS,
                itemClass    : PAGE_ITEM_CLASS,
                currentClass : CURRENT_CLASS
            }),
            tokenRE = /\{(\w+)(?:\s+(\w+))?\}/g,
            formatters = Y.Paginator.SimpleView.Formatter,
            paginator = this;

        function process(match, token, page) {
            var renderer = formatters[token],
                value    = data[token];

            if (renderer) {
                // recursive for output from formatters
                value = renderer.apply(paginator, arguments)
                            .replace(tokenRE, process);
            }

            return value;
        }

        return this.get('template').replace(tokenRE, process);
    },

    events: events,

    destructor: function () {
        if (this._changeHandles) {
            this._changeHandles.detach();
            delete this._changeHandles;
        }
    },

    _onPageLinkClick: function (e) {
        var page = +e.currentTarget.getData(PAGE_ATTR);

        e.preventDefault();

        this.get('host').set('page', page, { originEvent: e });
    }
}, {
    Formatter: {
        pageLinks: function (_, val, meta) {
            var host     = this.get('host'),
                pages    = host.get('pages'),
                links    = Math.min(this.get('pageLinks'), pages),
                page     = host.get('page'),
                start    = Math.max(1, Math.ceil(page - (links / 2))),
                end      = Math.min(pages, start + links - 1),
                delta    = links - (end - start + 1),
                template, i, len;

            // Shift the start when approaching the last page
            start = Math.max(1, start - delta);

            template = '<ol start="' + start + '" class="{pagesClass}">';

            for (i = start, len = start + links; i < len; ++i) {
                template += '<li class="{itemClass}">{pageLink ' + i + '}</li>';
            }

            template += '</ol>';

            return template;
        },

        pageLink: function (_, val, page) {
            var host         = this.get('host'),
                currentPage  = host.get('page'),
                pages        = host.get('pages'),
                label        = this.get('strings.' + page) || page,
                urlGenerator = this.get('urlFormatter'),
                linkClass    = isFinite(+page) ?
                                    '{pageClass}' :
                                    '{' + page + 'Class}';

            page = (page === 'first')    ? 1 :
                   (page === 'last')     ? pages :
                   (page === 'next')     ? Math.min(pages, currentPage + 1):
                   (page === 'previous') ? Math.max(1, currentPage - 1) :
                   page;

            if (currentPage == page) {
                linkClass += ' {currentClass}';
            }

            return Y.Lang.sub(this.get('pageLinkTemplate'), {
                page     : page,
                label    : label,
                linkClass: linkClass,
                url      : urlGenerator ? urlGenerator.call(this, +page) : '#'
            });
        }
    },

    ATTRS: {
        host: {},

        pageLinks: {
            value: 7
        },

        template: {
            value: '{pageLink first}{pageLink previous}{pageLinks}{pageLink next}{pageLink last}'
        },

        pageLinkTemplate: {
            value: '<a href="{url}" class="{linkClass}" data-' + PAGE_ATTR + '="{page}">{label}</a>'
        },

        strings: {
            valueFn: function () {
                return Y.Intl.get('paginator-simple-view');
            }
        }
    }
});
}, 'gallery-2012.04.26-15-49', { requires: ['view', 'intl', 'gallery-paginator-dev-preview-core'] });

YUI.add('gallery-paginator-dev-preview-base', function (Y) {
/**
Standalone Paginator Widget implementation.

@module paginator
@submodule paginator-base
@since 3.6.0
**/

// Paginator API docs included before Paginator.Base to make yuidoc work
/**
A Widget for displaying pagination controls.  Before feature modules are
`use()`d, this class is functionally equivalent to Paginator.Base.  However,
feature modules can modify this class in non-destructive ways, expanding the
API and functionality.

This is the primary standalone Paginator class.

@class Paginator
@extends Paginator.Base
@since 3.6.0
**/

/**
Base class for the Paginator Widget.  Adds attributes `view` and `viewConfig`
to specify the class responsible for generating the Widget UI and allow its
configuration.

@class Base
@extends Widget
@uses Paginator.Core
@namespace Paginator
@constructor
@since 3.6.0
**/
Y.Paginator.Base = Y.Base.create('paginator', Y.Widget, [ Y.Paginator.Core ], {
        initializer: function () {
            this.publish('renderView', {
                defaultFn: Y.bind('_defRenderViewFn', this)
            });
        },

        renderUI: function () {
            var View = this.get('view'),
                config = Y.merge(
                    this.getAttrs(),
                    (this.get('viewConfig') || {}), {
                        host: this,
                        container: this.get('contentBox')
                    });

            if (View) {
                this.view = new View(config);
            }
        },

        syncUI: function () {
            if (this.view) {
                this.fire('renderView', {
                    view: this.view
                });
            }
        },

        _defRenderViewFn: function (e) {
            if (e.view && e.view.render) {
                e.view.render();
            }
        },

        _validateView: function (val) {
            return val === null ||
                (Y.Lang.isFunction(val) && val.prototype.render);
        }
    }, {
        ATTRS: {
            /**
            The View class responsible for rendering the controls.  When
            `render()`ed, the Paginator will create an instance of the View
            class with the configuration object in the `viewConfig` attribute,
            decorated with the current state, plus a _host_ property pointing
            back to the Pagintor instance.

            The View instance is stored in the `view` property of the instance.

            @attribute view
            @type {Function}
            **/
            view: {
                value: Y.Paginator.SimpleView,
                validator: '_validateView'
            },

            /**
            The configuration object to pass to the View instance responsible
            for rendering the controls.

            @attribute viewConfig
            @type {Object}
            **/
            viewConfig: {}
        }
    });

// The Paginator API docs are above Paginator.Base docs.
Y.Paginator = Y.mix(
    Y.Base.create('paginator', Y.Paginator.Base, []), // Create the class
    Y.Paginator); // Migrate static and namespaced classes
}, 'gallery-2012.04.26-15-49', { requires: ['base-build', 'gallery-paginator-dev-preview-core', 'gallery-paginator-dev-preview-simple-view'] });

Y.use('gallery-paginator-dev-preview-core', 
      'lang/gallery-paginator-dev-preview-simple-view',
      'lang/gallery-paginator-dev-preview-simple-view_en', 
      'gallery-paginator-dev-preview-simple-view', 
      'gallery-paginator-dev-preview-base');


}, 'gallery-2012.04.26-15-49' ,{requires:['base-build', 'widget', 'view', 'intl']});
