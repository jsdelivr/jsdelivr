YUI.add('gallery-plugin-tabview', function(Y) {

var ACTIVE_CLASS = 'active';

Y.Plugin.TabView = Y.Base.create('tabview', Y.Plugin.Base, [], {

  history : null,

  initializer : function(){
    this.history = new Y.HistoryHash();
    this.renderUI();
    this.bindUI();
    this.syncUI();
  },

  renderUI : function(){
    var host = this.get('host'),
        tabS = this.get('tabSelector'),
        panelS = this.get('panelSelector'),
        tabCount = 0;

    host.addClass('tabView');
    
    host.all(tabS).each(function(tab){
      var a = tab.one('a'),
          id = null, tabId = '';
          
      if(!a || a.getAttribute('href').indexOf('#') < 0) {
        tabCount++;
        return;
      }
      
      id = a.getAttribute('name') || a.getAttribute('id');
      if(id === '' || id.indexOf('yui_') === 0) {
        tabId = tab.get('id');
        if(tabId === '' || tabId.indexOf('yui_') === 0) {
          id = tabCount;
        }else{  
          id = tabId;
        }
      }
      
      a.setAttribute('href', a.getAttribute('href').replace(/#(.)*/,'#tab=' + id));
      tabCount++;
      
    });

    host.all(panelS).each(function(panel){
      if(panel.one('*:first-child').hasClass('liner')){
        return;
      }
      var liner = Y.Node.create('<div class="liner" />'),
      c = panel.get('children').remove(),
      i, l;

      for(i=0, l=c.size(); i<l; i++){
        liner.append(c.item(i));
      }
      panel.append(liner);

    });
  },

  bindUI : function(){
    var host = this.get('host');

    host.delegate('click', function(e){
      var tab = e.currentTarget;

      e.preventDefault();
      this.history.addValue('tab', host.all(tab.get('tagName')).indexOf(tab));

    }, this.get('tabSelector') , this);

    this.history.on('change', function(e){
      if(e.changed.tab) {
        this._updateActiveTab(host.all(this.get('tabSelector')).item(parseInt(e.changed.tab.newVal, 10) || 0));
      }
    }, this);

  },

  syncUI : function(){
    var host = this.get('host'),
    tabS = this.get('tabSelector'),
    activeTab = 0,
    hashId = null, tabSearch = null;

    if(window.location.hash) {
      hashId = window.location.hash.replace('#','');

      if(hashId.indexOf('=') > 0) {
        activeTab = hashId.substring(hashId.indexOf('=') + 1);
        tabSearch = host.all(tabS).item(activeTab);
      }else{
        tabSearch = host.one('#' + hashId + ', ' + tabS + '[name=' + hashId +'], ' + tabS + ' *[name=' + hashId + ']');
        if(tabSearch) {
          if(tabSearch.get('tagName') !== tabS.toUpperCase()) {
            tabSearch = tabSearch.ancestor(tabS);
          }
          activeTab = host.all(tabS).indexOf(tabSearch);
        }
      }
    }
    this.history.addValue('tab', activeTab);
    this._updateActiveTab(tabSearch);
  },

  _updateActiveTab : function(tab) {
    var host = this.get('host');

    if(tab.hasClass(ACTIVE_CLASS)){
      return;
    }

    host.all('.' + ACTIVE_CLASS).removeClass(ACTIVE_CLASS);

    tab.addClass(ACTIVE_CLASS);
    tab.next(this.get('panelSelector')).addClass(ACTIVE_CLASS);
  }

}, {
  NS : 'tabview',
  ATTRS : {
    tabSelector : {
      value : 'dt'
    },
    panelSelector : {
      value : 'dd'
    }
  }
});


}, 'gallery-2010.11.17-21-32' ,{requires:['plugin','base-build','node','event','history']});
