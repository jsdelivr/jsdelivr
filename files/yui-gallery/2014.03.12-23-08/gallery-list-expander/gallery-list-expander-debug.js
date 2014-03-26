YUI.add('gallery-list-expander', function(Y) {

/**
 * Adds the class name "has-list" to all lists containing &lt;ul&gt;s. When
 *   clicking on an &lt;li&gt;, adds the class name "open" to the &lt;li&gt;.
 *   If toggle is set to true, when li.open is clicked, the class name "open"
 *   is removed. If closeSiblings is set to true, sibling &lt;li&gt;s will have
 *   the class name "open" removed.
 * @author Anthony Pipkin
 * @class ListExpander
 * @extends Y.Plugin.Base
 * @version 1.1.0
 */
Y.Plugin.ListExpander = Y.Base.create('list-expander', Y.Plugin.Base, [], {

  /**
   * Attaches a click event to the &lt;LI&gt;s in the list
   * @since 1.0.0
   * @public
   * @method initializer
   * @param config
   */
  initializer : function(config){
    this.get('host').all('li > ul').each(function(ul) {
      ul.ancestor('li').addClass('has-list');
    });

    Y.delegate('click', function(e){

      var li = (e.currentTarget.get('tagName').toUpperCase() === 'LI') ?
                e.currentTarget : e.currentTarget.ancestor('li'),
          ul = li.ancestor('ul'),
          turnOff = (this.get('toggle') && li.hasClass('open'));

      if(this.get('closeSiblings')) {
        ul.all('li.open').removeClass('open');
      }

      if(!turnOff) {
        li.addClass('open');
      }

      e.stopPropagation();

    }, this.get('host'), this.get('selector'), this);

  }

}, {

  NS : 'expand',

  ATTRS : {
    /**
     * Specifies that the siblings, and sibling children should
     *   "close" when opening another &lt;LI&gt;
     * @since 1.0.0
     * @property closeSiblings
     * @default true
     */
    closeSiblings : {
      value : true
    },

    /**
     * Specifies the click target.
     * @since 1.1.0
     * @property selector
     * @default "li"
     */
    selector : {
      value : 'li'
    },

    /**
     * Adds the ability to click to open and close.
     * @since 1.1.0
     * @property toggle
     * @default false
     */
    toggle : {
      value : false
    }
  }

});


}, 'gallery-2010.09.08-19-45' ,{requires:['base','plugin','node','event']});
