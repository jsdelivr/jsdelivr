YUI.add('gallery-xarno-calendar-controls', function(Y) {

var LANG = Y.Lang,
    BOUNDING_BOX = 'boundingBox';

Y.namespace('Plugin.Xarno').CalendarControls = Y.Base.create('controls', Y.Plugin.Base, [], {

    initializer : function() {
        this._host = this.get('host');
        this.afterHostEvent('render', Y.bind(this._render, this));
    }, 
    
    destructor : function() {
        if ( this._delegate ) {
            this._delegate.destroy();
        }
        if ( this._controls ) {
            this._controls.remove(true);
        }
        
        this._delegate = null;
        this._controls = null;
    },
    
    syncUI : function() {
        this._syncUI();
    },
    
    _render : function() {
        this._renderUI();
        this._bindUI();
        this._syncUI();
    },
    
    _renderUI : function() {
        var position = Y.WidgetStdMod.HEADER;
        
        this._buildControls();
        
        if (this.get('position') === 'footer') {
            position = Y.WidgetStdMod.FOOTER;
        }
        
        this.get('host').setStdModContent(position, this._controls, Y.WidgetStdMod.AFTER);
    },
    
    _bindUI : function() {
        this._host.after('dateChange', Y.bind(this._syncUI, this));
    },
    
    _syncUI : function(e) {
        var d = (e) ? e.newVal : this._host.get('date'),
            month = this.get('months')[d.getMonth()],
            day = d.getDate(),
            year = d.getFullYear();
        
        this._display.setContent(LANG.sub(this.get('display'), {
            month : month,
            day : day,
            year : year
        }));
    },
    
    _controls : null,
    _display : null,
    _delegate : null,
    
    _buildControls : function() {
        var c, py, pm, ny, nm;
        c = new Y.Node.create('<div class="' + this._host.getClassName('controls') + '" />');
        this._display = new Y.Node.create('<span class="display" />');
        c.append(this._display);

        if (this.get('yearButtons')) {
            py = new Y.Button(this.get('prevYearConfig'));
            py.get(BOUNDING_BOX).addClass('prev-year');
            py.on('press', Y.bind(this._prevYear, this));
            py.render(c);
            
            ny = new Y.Button(this.get('nextYearConfig'));
            ny.get(BOUNDING_BOX).addClass('next-year');
            ny.on('press', Y.bind(this._nextYear, this));
            ny.render(c);
        }
        
        if (this.get('yearButtons')) {
            pm = new Y.Button(this.get('prevMonthConfig'));
            pm.get(BOUNDING_BOX).addClass('prev-month');
            pm.on('press', Y.bind(this._prevMonth, this));
            pm.render(c);
            
            nm = new Y.Button(this.get('nextMonthConfig'));
            nm.get(BOUNDING_BOX).addClass('next-month');
            nm.on('press', Y.bind(this._nextMonth, this));
            nm.render(c);
        }
        
        this._controls = c;
    },
    
    _controlClick : function(e) {
    },
    
    _prevYear : function() {
        this._host.prevYear();
    },
    _prevMonth : function() {
        this._host.prevMonth();
    },
    _updateMonthYear : function() {
    },
    _nextMonth : function() {
        this._host.nextMonth();
    },
    _nextYear : function() {
        this._host.nextYear();
    },

    _setPosition : function (val) {
        if (val === 'header' || val === 'footer') {
            return val;
        }
        return null;
    }
    
}, {
    NS : 'controls',
    ATTRS : {
        position : {
            value : 'header',
            validator : '_setPosition'
        },
        
        yearButtons : {
            value : true,
            validator : LANG.isBoolean
        },
        
        monthButtons : {
            value : true,
            validator : LANG.isBoolean
        },
        
        months : {
            value : ['January', 'February','March','April','May','June','July','August','September','October','November','December']
        },
        
        display : {
            value : '{month} {year}'
        },
        
        prevYearConfig : {
            value : { icon: 'control-dbl-w' }
        },
        
        prevMonthConfig : {
            value : { icon: 'control-w' }
        },
        
        nextMonthConfig: {
            value : { icon: 'control-e' }
        },
        
        nextYearConfig : {
            value : { icon: 'control-dbl-e' }
        }
    }
});


}, 'gallery-2011.02.02-21-07' ,{requires:['plugin','base-build','gallery-button']});
