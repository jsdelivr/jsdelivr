jQuery(function($){

// constants
var FACEOFF_TYPE   = ['fixed','liquid','hybrid'];
var FACEOFF_COLUMN = ['ece','c','ec','ce','cee','eec'];
var FACEOFF_ALIGN  = ['aCenter','aLeft','aRight'];

var FaceOff = {
    curElement    : null,
    _widgetParent : null,

    preview  : $('#demoXe'),
    propDialog : null,

    init : function() {
        var fo = this;

        // toolbar
        $('#toolbar').toolbar({
            fade  : 300,
            click : function(data) {
                var args = (data.arg || '').split(',');

                switch(args[0]) {
                    case 'a': fo.setLayoutAlign(args[1],false); break;
                    case 'c': fo.setLayoutColumn(args[1],false); break;
                    case 't': fo.setLayoutType(args[1],false); break;
                }
            },
            hover : function(data) {
                var item = data.element;
                if(item.parent().is('.noneToolBar')) return;

                var args = data.arg.split(',');
                var pos_item = item.offset();
                var pos_preview = fo.preview.show().css({left:0,top:0}).offset();
                var type, col, align;
                type  = 'demo'+capitalize(args[0]=='t'?args[1]:fo.getLayoutType());
                col   = 'demo'+(args[0]=='c'?args[1]:fo.getLayoutColumn()).toUpperCase();
                align = 'demo'+capitalize(args[0]=='a'?args[1]:fo.getLayoutAlign());

                fo.preview.dequeue().stop().css({
                    width: '60px',
                    left : pos_item.left - pos_preview.left + item.parent().width() + 2,
                    top  : pos_item.top - pos_preview.top
                }).attr('class', 'layoutDemo demoBox '+type+' '+align);

                $('#demoContainer').attr('class','').addClass(col);

                (function(){
                    if (!fo.preview.is(':visible')) return;

                    fo.preview.animate({width:'150'}, 1000).animate({width:'120'}, 1000, 'linear', arguments.callee);
                })();
            },
            hide : function(menu) {
                fo.preview.dequeue().stop().hide();
            }
        });

        if(typeof(faceOffStyle)!='undefined') {
            for(var i in faceOffStyle) {
                if(i=="body") {
                    $("html>body").attr("style",faceOffStyle[i]);
                } else {
                    try {
                        $(i).attr("style",faceOffStyle[i]);
                    } catch(e) {
                    }
                }
            }
        }

        $('#xe , #body, #header, #footer, #neck, #knee, div.e1, div.e2, div.neck, div.knee').each( function(i) { $(this).find('a').css('color',$(this).css('color')).css('font-family',$(this).css('font-family')); } );

        if($('#header').css('display')!='none') $('#useHeader').attr('checked',true);
        else $('#useHeader').attr('checked',false);
        if($('#footer').css('display')!='none') $('#useFooter').attr('checked',true);
        else $('#useFooter').attr('checked',false);

        $('#useHeader').click(function(event) {
            if($('#useHeader').attr('checked')) {
                $('#header').css('display','block');
                $('#useHeader').attr('checked', true);
            } else {
                $('#header').css('display','none');
                $('#useHeader').attr('checked', false);
            }
        });

        $('#useFooter').click(function(event) {
            if($('#useFooter').attr('checked')) $('#footer').css('display','block');
            else $('#footer').css('display','none');
        });

        // tab to select widget
        $(document).mousedown(function(event){
            var filter = '#xe .widgetOutput, #xe .extension, #body, #header, #footer, #toolbar, #propertyDialog, #faceoffSelector, .overlay';
            var target = $(event.target);
            var selection = target.parents(filter).add(target);
            if (selection.is('#toolbar, #propertyDialog, #faceoffSelector, .overlay')) return;

            if (selection.is(filter)) {
                fo.selectElement(selection.filter(filter).eq(0));

                event.stopPropagation();
                event.preventDefault();
            } else if(fo.curElement) {
                fo.selectElement(null);
            }
        }).hotkey({
            'TAB'   : method(this.selectByTAB, this),
            'Shift+TAB' : method(this.selectByTAB, this),
            'UP'    : method(this.moveWidget, this),
            'DOWN'  : method(this.moveWidget, this),
            'LEFT'  : method(this.moveWidget, this),
            'RIGHT' : method(this.moveWidget, this),
            'ESC'   : method(this.selectByESC, this),
            'ENTER' : method(this.showPreference, this)
        });

        // select default menus
        var type  = this.getLayoutType();
        var col   = this.getLayoutColumn();
        var align = this.getLayoutAlign();

        $('#toolbar .buttons li.menu').each(function(){
            var arg = $(this).attr('tb:arg');
            if (!arg.indexOf('t,'+type) || !arg.indexOf('c,'+col) || !arg.indexOf('a,'+align)) $(this).click();
        });

        this.propDialog = PropertyDialog.init('#propertyDialog');
    },
    getLayoutType : function() {
        var sel = $('#container[style],#header[style]:visible,#footer[style]:visible')
            .add('#neck[style]:visible, #knee[style]:visible, #body[style], #content[style] ')
            .add('div[id^=ex_][style]:visible, div.neck[style]:visible, div.knee[style]:visible, div.e1[style]:visible, div.e2[style]:visible');
        //sel.css('padding','').css('margin','');
        return findEnum($('#xe').attr('class'), FACEOFF_TYPE);
    },
    // LaytoutType : 'fixed','liquid','hybrid' 을 set
    // fixed : Use fixed width for all column
    // liquid : Use flexible width for all column
    // hybrid : Use flexible width for all column but content column
    setLayoutType : function(type) {
        $('#xe').removeClass(FACEOFF_TYPE.join(' ')).addClass(_enum(type, FACEOFF_TYPE));
    },
    getLayoutColumn : function() {
        return findEnum($('#container').attr('class'), FACEOFF_COLUMN);
    },
    //'ece','c','ec','ce','cee','eec' 컬럼타입을 set 한다 크기와 관련된 스타일은 초기화 한다
    setLayoutColumn : function(type,init){
        $('#container').removeClass(FACEOFF_COLUMN.join(' ')).addClass(_enum(type, FACEOFF_COLUMN));
        var sel = $('#container[style],#header[style]:visible,#footer[style]:visible')
            .add('#neck[style]:visible, #knee[style]:visible, #body[style], #content[style] ')
            .add('div[id^=ex_][style]:visible, div.neck[style]:visible, div.knee[style]:visible, div.e1[style]:visible, div.e2[style]:visible');

        if(init) sel.css('padding','').css('margin','');

        // 칼럼의 변경으로, 현재 선택된 위젯이 보이지 않게 된다면, 위젯 선택을 해제한다.
        if (this.curElement && !this.curElement.parents('#xe .extension:visible').length) {
            this.selectElement(null);
        }
    },
    getLayoutAlign  : function() {
        return findEnum($('#xe').attr('class'), FACEOFF_ALIGN);
    },
    setLayoutAlign : function(type) {
        $('#xe').removeClass(FACEOFF_ALIGN.join(' ')).addClass(_enum(type, FACEOFF_ALIGN));
    },
    saveLayoutConfig : function(saveTemp) {
        $.exec_json('layout.procLayoutAdminUserValueInsert', {
            'saveTemp':saveTemp || '',
            mid  : current_mid,
            type : this.getLayoutType(),
            column : this.getLayoutColumn(),
            align  : this.getLayoutAlign(),
            neck : this.getWidgetContent($('#body .neck:visible')),
            knee : this.getWidgetContent($('#body .knee:visible')),
            e1   : this.getWidgetContent($('#body .e1:visible')),
            e2   : this.getWidgetContent($('#body .e2:visible')),
            neck : this.getWidgetContent($('#neck:visible')),
            knee : this.getWidgetContent($('#knee:visible')),
            css  : this.getFaceoffStyle()
        },function(data){
            if(data.saveTemp=='Y'){
                document.location.href = request_uri.setQuery('mid',current_mid).setQuery('act','dispLayoutAdminLayoutModify');
            }else{
                document.location.href = request_uri.setQuery('mid',current_mid);
            }
        });
    },
    getWidgetContent : function(el) {
        if (!el.length) return '';

        var text = [];

        el.find('div[widget]').each(function(){
            var type = $(this).attr('widget');

            switch(type) {
                case 'widgetContent':
                    var div  = $('<div>');
                    var attr = [];

                    $(this.attributes).each(function(){
                        if (!this.nodeName || !this.nodeValue) return;

                        var name = this.nodeName.toLowerCase(), val = this.nodeValue;
                        if ('.contenteditable.src.widget.class.widget_width.widget_width_type.xdpx.xdpy.height.'.indexOf('.'+name+'.') > -1) return;

                        div.text(val);
                        attr.push(name+'="'+div.html()+'"');
                    });

                    var content = $(this).children('div.widgetContent');
                    if (!content.length) return;
                    return text.push('<img src="./common/img/widget_bg.jpg" class="zbxe_widget_output" widget="widgetContent" '+attr.join(' ')+' />');
                default:
                    var div  = $('<div>');
                    var attr = [];

                    $(this.attributes).each(function(){
                        if (!this.nodeName || !this.nodeValue) return;

                        var name = this.nodeName.toLowerCase(), val = this.nodeValue;
                        if ('.style.contenteditable.src.widget.body.class.widget_width.widget_width_type.xdpx.xdpy.height.'.indexOf('.'+name+'.') > -1) return;

                        div.text(val);
                        attr.push(name+'="'+div.html()+'"');
                    });
                    attr.push('style="'+$(this).attr('style')+'"');

//                    return text.push('<img class="zbxe_widget_output" widget="'+type+'" addclass="section" '+attr.join(' ')+' />');
                    return text.push('<img class="zbxe_widget_output" widget="'+type+'" '+attr.join(' ')+' />');
            }
        });

        return text.join('');
    },
    getFaceoffStyle : function() {
        var sty = [];
        var sel = $('html>body,#container[style],#header[style],#footer[style]')
            .add('#neck[style]:visible, #knee[style]:visible, #body[style], #content[style] ')
            .add('div.neck[style]:visible, div.knee[style]:visible, div.e1[style]:visible, div.e2[style]:visible'); //div[id^=ex_][style]:visible,

        sel.each(function(){
            var bgImage = $(this).css("backgroundImage");
            if(bgImage && bgImage!='none') {
                bgImage = bgImage.replace(/(.+)images\/([a-z0-9]+)\.(jpg|jpeg|gif|png|swf|flv)\)/i,'url(./images/$2.$3)');
                $(this).css("background-image",bgImage);
            }
            var style = $(this).attr('style');
            if($(this).is('.neck, .knee, .e1, .e2')) {
                if (!style) return;
                if($(this).is('.e1')) sty.push( 'div.e1 { ' + style + ' } ');
                else if($(this).is('.e2')) sty.push( 'div.e2 { ' + style + ' } ');
                else if($(this).is('.neck')) sty.push( 'div.neck { ' + style + ' } ');
                else if($(this).is('.knee')) sty.push( 'div.knee { ' + style + ' } ');
            }else if($(this).is('html>body')) {
                style = 'background-color:' + $(this).css('backgroundColor')
                + ';background-image:' + $(this).css('backgroundImage')
                + ';background-repeat:' + $(this).css('backgroundRepeat');
                + ';font-family:'+ $(this).css('fontFamily');
                + ';color:'+ $(this).css('color');
                sty.push('body' + ' { ' + style +' }');
                if($(this).css('fontFamily')) sty.push('body a { font-family:'+$(this).css('fontFamily')+'; }');
                if($(this).css('color')) sty.push('body a { color:'+$(this).css('color')+'; }');
            } else {
                if (!style) return;
                sty.push('#' + this.id + ' { ' + style +' }');
                if($(this).css('fontFamily')) sty.push('#'+this.id+' a { font-family:'+$(this).css('fontFamily')+'; }');
                if($(this).css('color')) sty.push('#'+this.id+' a { color:'+$(this).css('color')+'; }');
            }
        });

        return sty.join('\n');
    },
    doAddWidgetCode : function(widget_code) {

        var par = this._widgetParent;
        var obj = $(widget_code);
        var uniqueId = '', style = '';

        if (!par) return;


        if (par.is('.widgetOutput')) {
            uniqueId = par.attr('id');
            obj.attr('id', uniqueId).addClass('section');
            par.replaceWith(obj).attr('style', par.attr('style'));
            if(!obj.css("float")) obj.css("clear","both");
            else(obj.css("clear",""));
        } else {
            uniqueId = 'ex_'+(new Date()).getTime();
            obj.attr('id', uniqueId).addClass('section');
            obj.appendTo(this._widgetParent).attr('style','');
            obj.css("clear","both");
        }

        this.selectElement(this._widgetParent);
        this._widgetParent = null;

        this.saveLayoutConfig('Y');
    },
    selectByTAB : function(event, key) {
        var els   = null;
        var cur   = this.curElement;
        var shift = event.shiftKey, els, len, idx;

        if (!cur || cur.hasClass('widgetOutput')) els = $('#xe .extension:visible > .widgetOutput');
        else if (cur.is('#body, #header, #footer')) els = $('#body, #header, #footer');
        else if (cur.is('.extension')) els = $('#xe .extension:visible');

        if (!els.length) els = $('#xe .extension:visible');

        if (!(len = els.length)) return;
        if (cur && (idx = els.index(cur)) < 0) {
            this.selectElement(null);
            return this.selectByTAB(event, key);
        }

        if (cur) {
            if (shift) this.selectElement( els.eq( idx?idx-1:len-1 ) );
            else this.selectElement( els.eq( idx==len-1?0:idx+1 ) );
        } else {
            this.selectElement( els.eq( shift ? len-1 : 0 ) );
        }
    },
    selectByESC : function(event, key) {
        var cur = this.curElement, par;

        if (!cur) return this.selectByTAB(event, key);

        if (cur.is('#body, #header, #footer')) {
            this.selectElement(null);
        } else if (cur.hasClass('extension')) {
            par = cur.parent('#body, #header, #footer').add(cur.prev('#header')).add(cur.next('#footer'));
            par.length?this.selectElement(par.eq(0)):this.selectElement(null);
        } else if (cur.hasClass('widgetOutput')) {
            this.selectElement( cur.parent('.extension').eq(0) );
        }
    },
    moveWidget : function(event, key) {
        var vert = 0, horz = 0;
        var cur = this.curElement;
        var selection;

        if (!cur || !cur.hasClass('widgetOutput')) return;

        switch(key) {
            case 'UP': vert = -1; break;
            case 'DOWN' : vert = 1; break;
            case 'LEFT' : horz = -1; break;
            case 'RIGHT' : horz = 1; break;
        }

        if (horz && cur.parents('#body').length && this.getLayoutColumn().length > 2) {
            if (horz > 0 && cur.parents('.e1').length && $('#body > .e2:visible').length) {
                $('#body > .e2').append(cur);
            } else if (horz < 0 && cur.parents('.e2').length && $('#body > .e1:visible').length) {
                $('#body > .e1').append(cur);
            }
        } else if (vert < 0) { // up
            if ((selection = cur.prev('.widgetOutput')).length) {
                selection.before(cur);
            } else if (cur.parents('.e1, .e2').length) {
                $('#neck > .extension').append(cur);
            } else if (cur.parents('#knee:visible').length) {
                $('#body > .extension:visible:last').append(cur);
            }
        } else if (vert > 0) { // down
            if ((selection = cur.next('.widgetOutput')).length) {
                selection.after(cur);
            } else if (cur.parents('.e1, .e2').length) {
                $('#knee > .extension').prepend(cur);
            } else if (cur.parents('#neck:visible').length) {
                $('#body > .extension:visible:first').prepend(cur);
            }
        }

        this.selectElement(cur);
    },
    deleteWidget : function(){
        var cur = this.curElement;

        if (!cur.is('.widgetOutput')) return;
        cur.remove();

        this.saveLayoutConfig('Y');
    },
    popupAddWidgetStyle : function(){
        var cur = this.curElement;
        this._widgetParent = this.curElement;

        if (!cur.is('.widgetOutput')) return;

        selectedWidget = cur.get(0);
        popopen(request_uri+"?module=widget&act=dispWidgetStyleGenerateCodeInPage&selected_widget="+cur.attr('widget')+"&widgetstyle="+cur.attr('widgetstyle'),'GenerateCodeInPage');
    },

    popupAddWidget : function() {
        var cur = this.curElement;
        var url = request_uri.replace(/\?.+$/, '')+'?module=widget&type=faceoff';
        var win = 'GenerateWidgetCode';

        if (!cur.is('.widgetOutput, .extension')) return;

        this._widgetParent = this.curElement;

        if (cur.is('.widgetOutput')) {
            selectedWidget = cur.get(0);
            // modify widget
            if (cur.attr('widget') == 'widgetContent') {
                // content widget
                url += '&act=dispWidgetAdminAddContent&module_srl='+$('#layout_srl').val()+'&document_srl='+cur.attr('document_srl');
                popopen(url, 'addContent');
            } else {
                // widget
                url += '&act=dispWidgetGenerateCodeInPage&selected_widget='+cur.attr('widget');
                popopen(url, 'GenerateCodeInPage');
            }
        } else {
            // add new widget
            url += '&act=dispWidgetGenerateCodeInPage';
            popopen(url, 'GenerateCodeInPage');
        }
    },
    popupAddContent : function() {
        var url = request_uri.replace(/\?.+$/,'')+'?module=widget&act=dispWidgetAdminAddContent&type=faceoff&mid=current_mid&module_srl='+$('#layout_srl').val();

        this._widgetParent = this.curElement;

        popopen(url, "addContent");
    },
    selectElement  : function(element) {
        var selector = $('#faceoffSelector'), cur, pos_cur, pos_sel;
        var cur = this.curElement = element || null;

        if (!selector.length) selector = $('<div id="faceoffSelector">');

        // hide selector
        selector.hide();
        var sel = $('#neck[style]:visible .extension, #knee[style]:visible .extension,div.e1[style]:visible, div.e2[style]:visible').height('');

        // 위젯을 할당한다. 선택된 위젯이 jQuery 객체가 아니거나 혹은 해당하는 DOM이 없다면 현재 선택된 위젯은 없다.
        if (cur && ( !cur.jquery || !cur.length )) cur = this.curElement = null;

        $('#smartmenu>li').hide();
        // effect on select
        if (cur) {
            $(cur.get(0).offsetParent).append(selector);

            pos_cur = cur.offset();
            pos_sel = selector.css({position:'absolute',left:0,top:0}).show().offset();

            if(cur.height() == 0) cur.height(20);

            selector.css({
                left : pos_cur.left - pos_sel.left,
                top  : pos_cur.top  - pos_sel.top
            })
            .width(cur.outerWidth())
            .height(cur.outerHeight());

            if (cur.is('#body, #header, #footer')) {
                $('#for-block').show();
                $('>dl>dt:visible','#for-block').html(cur.attr('id')+' &gt; ');
            } else if (cur.is('.extension')) {

                var selected = 'Extension';
                if(cur.parent().is('#neck')){
                    selected = 'Neck';
                }else if(cur.parent().is('#knee')){
                    selected = 'Knee';
                }else if(cur.is('.neck')){
                    selected = 'Extension Neck';
                }else if(cur.is('.knee')){
                    selected = 'Extension Knee';
                }else if(cur.is('.e1')){
                    selected = 'Extension 1';
                }else if(cur.is('.e2')){
                    selected = 'Extension 2';
                }
                $('>dl>dt','#for-extension').html(selected+' &gt; ');

                $('#for-extension').show();
            } else if (cur.is('.widgetOutput')) {
                $('#for-widget').show();

            }
        } else {
            $('#for-all').show();
        }
    },
    showPreference : function(event,target) {
        if(target && target=='html>body' || target=='#container'){
            this.propDialog.open($(target));
        }else{
            var cur = this.curElement;

            if (!cur || !cur.length) return this.closePreference();

            this.propDialog.open(this.curElement);
        }
    },
    paint : function() {
        if (!this.curElement) return;

        // repaint selection size

        if (this.propDialog.visible())

        this.propDialog.paint();
    }
};

var PropertyDialog = {
    element : null,
    overlay : null,
    target  : null,

    init : function(element) {
        this.element = $(element).draggable();

        if (!this.overlay) this.overlay = Overlay.create();

        // more link
        this.element.find('button.morelink').click( method(this.more, this) );

        // form
        this.element.find('form')
            .bind('submit', method(this.save, this))
            .bind('reset', method(this.cancel, this));

        return this;
    },
    open : function(selectedElement) {
        var sel = selectedElement;
        var dlg = $('#propertyDialog');
        var vals = [], i = 0, j = 0;
        var type = ['margin', 'padding'];
        var dirs = ['top','right','bottom','left'];
        var reSame = /^([0-9a-z%\-]+) \1 \1 \1$/;
        var isWidget = false;
        var isBody = false;
        var isLayout = false;
        dlg.css( { position : 'absolute' } );

        function same_all(arr) {
            return (arr[0] == arr[1] && arr[1] == arr[2] && arr[2] == arr[3]);
        }

        // target element
        this.target = sel;

        // is the target a widget?
        isWidget = sel.is('.widgetOutput');
        isBody  = sel.is('html>body');
        isContainer  = sel.is('#container');
        isHeader = sel.is('#header');


        $('fieldset',dlg).show();

        if(!isWidget){
            $('fieldset[name=float],fieldset[name=width],fieldset[name=height],fieldset[name=margin],fieldset[name=padding]',dlg).hide();
        }

        if(isBody){
            $('fieldset[name!=background]',dlg).hide();
            $('fieldset[name=font]',dlg).show();
        }

        if(isHeader){
            $('fieldset[name=margin]',dlg).show();
            $('fieldset[name=padding]',dlg).show();
        }

        // remove visible more
        this.element.find('.visible-more').removeClass('visible-more');

        // get preferences
        if($('fieldset[name=float]:visible',dlg).size() > 0){
            //float
            $('#float').val(sel.css('float'));
            $('#width').val(sel.css('width'));
            //$('#height').val(sel.css('height'));
        }

        if($('fieldset[name=margin]:visible',dlg).size() > 0){
            // margins and paddings
            for(j=0; j < type.length; j++) {
                for(i=0, vals=[]; i < dirs.length; i++) {
                    vals[i] = (j&&sel.is('.widgetOutput')?sel.find('div.widgetBorder > div:first'):sel).css(type[j]+'-'+dirs[i]).toLowerCase();

                    if ($.browser.msie && vals[i] == 'auto') vals[i] = '0px';
                    $('#'+type[j]+'-'+dirs[i]).val(vals[i]);
                }

                $('#'+type[j]).val( reSame.test(vals.join(' '))?vals[0]:vals.join(' ') );
            }
        }


        if($('fieldset[name=border]:visible',dlg).size() > 0){
            // border
            var style = [], width = [], color = [];
            for(i=0; i < dirs.length; i++) {
                style[i] = sel.css('border-'+dirs[i]+'-style').toLowerCase();
                width[i] = sel.css('border-'+dirs[i]+'-width').toLowerCase();
                color[i] = this._formatColor(sel.css('border-'+dirs[i]+'-color'));
            }
            if ( same_all(style) && same_all(width) && same_all(color) ) {
                $('#border-style').val(style[0]);
                $('#border-width').val(width[0]);
                $('#border-color').val(color[0]);
            } else {
                dlg.find('fieldset[name=border]').addClass('visible-more');

                for(i=0; i < dirs.length; i++) {
                    $('#border-'+dirs[i]+'-style').val( style[i] );
                    $('#border-'+dirs[i]+'-width').val( width[i] );
                    $('#border-'+dirs[i]+'-color').val( color[i] );
                }
            }
        }

        if($('fieldset[name=font]:visible',dlg).size() > 0){
            //font
            $('#font-family').val(sel.css('font-family'));
            $('#color').val(sel.css('color'));
        }

        if($('fieldset[name!=background]',dlg).size() > 0){
            // background

            dlg.find('fieldset[name=background]').addClass('visible-more');
            $('#background-color').val(this._formatColor(sel.css('background-color')));
            if(sel.css('background-image')) $('#background-image').val(sel.css('background-image').replace(/url\(([^\)]*)\)/i,'$1'));
            $('#background-repeat').val(sel.css('background-repeat'));
        }

        this.element.show();
        this.overlay.show(selectedElement);

        // disable hotkey
        $(document).hotkey('disable');

        // add esc key event
        $(window).keyup( function(e) { if(e.keyCode == 27) window.FaceOff.propDialog.close(); } );
    },
    save : function(event) {
        var val;

        if (!this.target) return false;

        var dlg = $('#propertyDialog');

        if($('fieldset[name=margin]:visible',dlg).size() > 0){
            // margins
            if ($('#margin').is(':visible')) {
                val = $('#margin').val();
            } else {
                val = this._compactValues(
                    $('#margin-top').val(),
                    $('#margin-right').val(),
                    $('#margin-bottom').val(),
                    $('#margin-left').val()
                );
            }

            if (this.target.is('.widgetOutput')) {
                this.target.css('margin', val);

                val = this._expandValues( $.trim(val).split(' ') );
                this.target
                    .attr('widget_margin_top', val[0])
                    .attr('widget_margin_right', val[1])
                    .attr('widget_margin_bottom', val[2])
                    .attr('widget_margin_left', val[3]);
            } else {
                this.target.css('margin', val);
            }
        }


        if($('fieldset[name=padding]:visible',dlg).size() > 0){
            // paddings
            if ($('#padding').is(':visible')) {
                val = $('#padding').val();
            } else {
                val = this._compactValues(
                    $('#padding-top').val(),
                    $('#padding-right').val(),
                    $('#padding-bottom').val(),
                    $('#padding-left').val()
                );
            }

            if (this.target.is('.widgetOutput')) {
                this.target.find('div.widgetBorder > div:first').attr('style','').css('padding', val);

                val = this._expandValues( $.trim(val).split(' ') );
                this.target
                    .attr('widget_padding_top', val[0])
                    .attr('widget_padding_right', val[1])
                    .attr('widget_padding_bottom', val[2])
                    .attr('widget_padding_left', val[3]);
            } else {
                this.target.css('padding', val);
            }
        }


        if($('fieldset[name=border]:visible',dlg).size() > 0){
            // border
            if (this.element.find('fieldset[name=border] .inputall').is(':visible')) {
                this.target.css( 'border', $('#border-width').val()+' '+$('#border-style').val()+' '+$('#border-color').val() );
            } else {

                this.target.css( 'border-top', $('#border-top-width').val()+' '+$('#border-top-style').val()+' '+$('#border-top-color').val() );
                this.target.css( 'border-right', $('#border-right-width').val()+' '+$('#border-right-style').val()+' '+$('#border-right-color').val() );
                this.target.css( 'border-bottom', $('#border-bottom-width').val()+' '+$('#border-bottom-style').val()+' '+$('#border-bottom-color').val() );
                this.target.css( 'border-left', $('#border-left-width').val()+' '+$('#border-left-style').val()+' '+$('#border-left-color').val() );
            }
        }

        // background
        val = $('#background-image').val().trim();
        if (val == 'none' || val == '') val = '';
        if (val) val = 'url("'+val+'")';

        this.target.css({
            'background-color' : $('#background-color').val(),
            'background-image' : val,
            'background-repeat' : $('#background-repeat').val()
        });


        // font
        this.target.css({
            'font-family' : $('#font-family').val(),
            'color' : $('#color').val()
        });

        this.target.find('a').css({
            'font-family' : $('#font-family').val(),
            'color' : $('#color').val()
        });


        if($('fieldset[name=float]:visible',dlg).size() > 0){
            if(this.target.is('.widgetOutput')){
                this.target.css({
                    'float' : $('#float').val(),
                    'width' : $('#width').val(),
                    'clear' : ''
                    //'height' : $('#height').val()
                });
            }
        }


        // close this dialog
        this.close();

        return false;
    },
    cancel : function() {
        // close this dialog
        this.close();

        return false;
    },
    close : function() {
        this.target = null;

        this.element.hide();
        this.overlay.hide();

        // enable hotkey
        $(document).hotkey('enable');
    },
    more : function(event) {
        var block  = $(event.target).parent();
        var name   = '';
        var val    = '';
        var items = ['top', 'right', 'bottom', 'left'];
        var reUnit = /^(\-?[0-9]+(?:%|px|em|pt)|auto)$/;
        var i;

        name = block.toggleClass('visible-more').attr('name');

        if (block.is('.visible-more')) {
            switch(name) {
                case 'margin':
                case 'padding':
                    val = $('#'+name).val();
                    val = $.trim(val).replace('\s{2,}', ' ').split(' ');
                    val = this._expandValues(val);

                    for(i=0; i < val.length; i++) {
                        if (!val[i] || !reUnit.test(val[i])) val[i] = '0px';
                        $('#'+name+'-'+items[i]).val(val[i]);
                    }

                    $('#'+name+'-top').focus();
                    break;
                case 'border':
                    val = $('#border-width').val();
                    if (!val || !reUnit.test(val)) val = '0px';

                    for(i=0; i < items.length; i++) {
                        $('#border-'+items[i]+'-style').val( $('#border-style').val() );
                        $('#border-'+items[i]+'-width').val( val );
                        $('#border-'+items[i]+'-color').val( this._formatColor($('#border-color').val()) );
                    }
                    break;
            }
        } else {
            switch(name) {
                case 'margin':
                case 'padding':
                    for(i=0; i < val.length; i++) {
                        if (!val[i] || !reUnit.test(val[i])) val[i] = '0px';
                        $('#'+name+'-'+items[i]).val(val[i]);
                    }

                    val = this._compactValues(
                        $('#'+name+'-top').val(),
                        $('#'+name+'-right').val(),
                        $('#'+name+'-bottom').val(),
                        $('#'+name+'-left').val()
                    );

                    $('#'+name).val(val).focus();
                    break;
                case 'border':
                    $('#border-style').val( $('#border-top-style').val() );
                    $('#border-width').val( $('#border-top-width').val() );
                    $('#border-color').val( this._formatColor($('#border-top-color').val()) );
                    break;
            }
        }
    },
    visible : function() {
        return this.element.is(':visible');
    },
    paint : function(selectedElement) {
        this.overlay.paint(selectedElement);
    },
    _compactValues : function(top,right,bottom,left) {
        if (top == right && right == left && left == bottom) {
            return top;
        } else if (top == bottom && right == left) {
            return top+' '+left;
        } else {
            return top+' '+right+' '+bottom+' '+left;
        }
    },
    _expandValues : function(values) {
        var v = values;

        if (v.length == 1) return [ v[0], v[0], v[0], v[0] ];
        if (v.length == 2) return [ v[0], v[1], v[0], v[1] ];
        if (v.length == 3) v.push(v[1]);

        return v;
    },
    _formatColor : function(color) {
        function hex(s) {
            s = parseInt(s,10).toString(16);
            return s.length<2?'0'+s:s;
        }

        if (/rgb\(([0-9, ]+)\)/i.test(color)) {
            var rgb = RegExp.$1.replace(/\s+/g, '').split(',');

            return '#'+hex(rgb[0])+hex(rgb[1])+hex(rgb[2]);
        }

        return color;
    }
};

var Overlay = {
    element : null,

    create : function() {
        // create overlay
        this.element = $('<div /><div /><div /><div />').appendTo(document.body).attr('class', 'overlay').css('opacity', 0.75);

        return this;
    },
    toggle : function(selectedElement) {
        if (this.element.is(':visible')) {
            this.show(selecetedElement);
        } else {
            this.hide();
        }
    },
    show : function(selectedElement) {
        this.paint(selectedElement);
        this.element.show();
    },
    hide : function() {
        this.element.hide();
    },
    paint : function(selectedElement) {
        var sel = selectedElement;
        var doc = $(document);
        var pos = sel.offset();
        var ovr = this.element;

        // top
        ovr.eq(0).css({
            left : 0,
            top  : 0,
            width  : '100%',
            height : pos.top+'px'
        });

        // left
        ovr.eq(1).css({
            left : 0,
            top  : pos.top+'px',
            width  : pos.left+'px',
            height : sel.get(0).offsetHeight+'px'
        });

        // right
        ovr.eq(2).css({
            right : 0,
            top   : pos.top+'px',
            width  : doc.width()-pos.left-sel.get(0).offsetWidth+'px',
            height : sel.get(0).offsetHeight+'px'
        });

        // bottom
        ovr.eq(3).css({
            left   : 0,
            bottom : 0,
            width  : '100%',
            height : doc.height()-pos.top-sel.get(0).offsetHeight+'px'
        });
    }
}

// bind a function as a method
function method(func, thisObj) {
    return function() {
        return func.apply(thisObj,arguments);
    }
}

//  특정한 값이 주어진 타입에 해당하는지 확인하고 그렇지 않다면 기본값으로 대체한다.
function _enum(value, enums, defaultIndex) {
    if (!$.isArray(enums) || enums.length < 1) return value;
    if (typeof defaultIndex == "undefined") defaultIndex = 0;

    return $.inArray(value, enums)?value:enums[defaultIndex];
}

// 클래스 문자열에서 주어진 타입에 해당하는 클래스를 추출
function findEnum(strClass, enums) {
    var regex = new RegExp(' (' + enums.join('|') + ') ');

    return regex.test(' ' + strClass + ' ')?RegExp.$1:'';
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
}

// register objects as global
window.FaceOff = FaceOff;
window.doAddWidgetCode = function(widget_code){ FaceOff.doAddWidgetCode(widget_code) };
FaceOff.init();

});

// overriding displayMultiMedia()
window.displayMultimedia = function(src, width, height, options) {
    var html = _displayMultimedia(src, width, height, options);

    if (jQuery.isReady) {

    } else {
        document.write(html);
    }
}

var selectedWidget =null;
