YUI.add('gallery-dropdown', function(Y) {

/**
 * DropDown plugin to convert html select into div based structure.
 * @module gallery-dropdown
 */

Y.namespace("HTML");
Y.HTML.DropDown = function(conf) {
    this.init(conf);
}
Y.HTML.DropDown.prototype = {
    init: function(conf) {
        this.setDefaults(conf);
        this.transform();
    },
    
    setDefaults: function(conf){
      if(!conf)
          conf = {};
      conf.src = (conf.src) ? conf.src : 'select';
      conf.resize = (conf.resize != undefined) ? conf.resize : true;
      this.conf = conf;
      this.srcNode = Y.all(this.conf.src);
    },
    
    transform: function() {
        this.srcNode.each( function(select, i) {
            if(select.get('tagName') == 'SELECT' || select.get('tagName') == 'select') {
                var selectName = select.get("name"),
                    selectWidth = select.getStyle('width');
                var markupStart = '<div class="yui-gallery-select">',
                defaultSelect = {
                    markup: '',
                    value: ''
                },
                selectId = select.getAttribute('id'),
                selectClass = select.getAttribute('class'),
                markup = ['<div class="container"><ul>'];
                if(select.all("optgroup").size() > 0) {
                    select.all("optgroup").each( function(optGrpNode, j) {
                        var label = optGrpNode.get("label");
                        markup.push('<li>' + label + '<ul>');
                        optGrpNode.get("options").each( function(node, i) {
                            this.buildMarkup(node, markup, defaultSelect, i + j);
                        },this);
                        markup.push('</ul></li>');
                    },this);
                } else {
                    select.get("options").each( function(node, i) {
                        this.buildMarkup(node, markup, defaultSelect, i);
                    }, this);
                }

                markup.push('</ul></div><input type="hidden" name="' + selectName + '" value="' + defaultSelect.value + '"/></div>');
                markup =  markupStart + defaultSelect.markup + markup.join('');
                var newSelect = Y.Node.create(markup);
                select.insert(newSelect, select);
                select.remove(true);
                newSelect.set('id', selectId);
                newSelect.set('className', selectClass+' '+newSelect.get('className'));
                if(this.conf.resize){
                  this.resizeWidth(newSelect, selectWidth);
                }
                newSelect.one('.anchor').plug(Y.Plugin.SimpleMenu);
                this.registerEvents(newSelect);
            }
        },this);
    },
    
    resizeWidth: function(select, width){
      width = parseInt(width,10) + 20;
      select.one('.anchor').setStyle('width',width + 'px');
      select.one('.container').setStyle('width',(width + 20) + 'px');
    },
    
    buildMarkup: function(node, markup, defaultSelect, i) {
        var selected = node.get('selected'),
            title = node.get('title'),
            value = node.get('value'),
            text = node.get('text'),
            title_text = '';
        if(title) {
            title_text = ' title="' + title + '"';
        }
        if(i==0 || selected) {
            defaultSelect.markup = '<a class="anchor" href="#"><label>' + text + '</label><span class="arrow"><label></label></span></a>';
            defaultSelect.value = value;
        }
        if(selected) {
            markup.push('<li><strong' + title_text + ' value="' + value + '">' + text + '</strong></li>');
        } else {
            markup.push('<li><a' + title_text + '  value="' + value + '">' + text + '</a></li>');
        }
    },
    
    registerEvents: function(select) {
        select.delegate("click", function(e, self) {
            var elem = e.currentTarget;
            var text = elem.get('text'),
                value = elem.getAttribute('value'),
                title = elem.getAttribute('title'),
                title_text = '',
                oldValue = self.one('input').get('value'),
                oldText = self.one(".anchor label").get('text');
            if(title) {
                title_text = ' title="' + title + '"';
            }
            self.one(".anchor label").set('text', text);
            self.one('input').set('value', value);

            var oldNode = select.one("strong");
            var oldTitle = oldNode.getAttribute('title'),
                old_title_text = '';
            if(oldTitle) {
                old_title_text = ' title="' + oldTitle + '"';
            }
            var newUnselectedMarkup = '<a' + old_title_text + '  value="' + oldValue + '">' + oldText + '</a>';
            oldNode.insert(newUnselectedMarkup, oldNode);
            oldNode.remove(true);

            var newSelectedMarkup = '<strong' + title_text + ' value="' + value + '">' + text + '</strong>';
            elem.insert(newSelectedMarkup, elem);
            elem.remove(true);
            select.one(".container").removeClass("menu-visible");
        },".container a", this, select);
    }
};


}, 'gallery-2011.06.01-20-18' ,{requires:['node', 'event', 'gallery-simple-menu']});
