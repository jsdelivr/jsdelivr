function Tree(url){
    // clear tree;
    jQuery('#menu > ul > li > ul').remove();

    if(jQuery("ul.simpleTree > li > a").size() ==0)jQuery('<a href="#" class="add"><img src="./common/js/plugins/ui.tree/images/iconAdd.gif" alt="'+lang_cmd_insert+'" title="'+lang_cmd_insert+'" /></a>').bind("click",function(e){addNode(0,e);}).appendTo("ul.simpleTree > li");

    //ajax get data and transeform ul il
    jQuery.get(url,function(data){
        jQuery(data).find("node").each(function(i){
            var text = jQuery(this).attr("text");
            var node_srl = jQuery(this).attr("node_srl");
            var parent_srl = jQuery(this).attr("parent_srl");
            var url = jQuery(this).attr("url");

            // node
            var node = jQuery('<li id="tree_'+node_srl+'"><span>'+text+'</span></li>');

            // button
            jQuery('<a href="#" class="add"><img src="./common/js/plugins/ui.tree/images/iconAdd.gif" alt="'+lang_cmd_insert+'" title="'+lang_cmd_insert+'" /></a>').bind("click",function(e){
                addNode(node_srl,e);
                return false;
            }).appendTo(node);

            jQuery('<a href="#" class="modify"><img src="./common/js/plugins/ui.tree/images/iconModify.gif" alt="'+lang_cmd_modify+'" title="'+lang_cmd_modify+'" /></a>').bind("click",function(e){
                modifyNode(node_srl,e);
                return false;
            }).appendTo(node);

            jQuery('<a href="#" class="delete"><img src="./common/js/plugins/ui.tree/images/iconDel.gif" alt="'+lang_cmd_delete+'" title="'+lang_cmd_delete+'" /></a>').bind("click",function(e){
                deleteNode(node_srl);
                return false;
            }).appendTo(node);

            // insert parent child
            if(parent_srl>0){
                if(jQuery('#tree_'+parent_srl+'>ul').length==0) jQuery('#tree_'+parent_srl).append(jQuery('<ul>'));
                jQuery('#tree_'+parent_srl+'> ul').append(node);
            }else{
                if(jQuery('#menu ul.simpleTree > li > ul').length==0) jQuery("<ul>").appendTo('#menu ul.simpleTree > li');
                jQuery('#menu ul.simpleTree > li > ul').append(node);
            }

        });

        //button show hide
        jQuery("#menu li").each(function(){
            if(jQuery(this).parents('ul').size() > max_menu_depth) jQuery("a.add",this).hide();
            if(jQuery(">ul",this).size()>0) jQuery(">a.delete",this).hide();
        });


        // draw tree
        simpleTreeCollection = jQuery('.simpleTree').simpleTree({
            autoclose: false,
            afterClick:function(node){
                //alert("text-"+jQuery('span:first',node).text());
            },
            afterDblClick:function(node){
                //alert("text-"+jQuery('span:first',node).text());
            },
            afterMove:function(destination, source, pos){

                jQuery("#menu_zone_info").html("");

                if(destination.size() == 0){
                    Tree(xml_url);
                    return;
                }
                var menu_srl = jQuery("#fo_menu input[name=menu_srl]").val();
                var parent_srl = destination.attr('id').replace(/.*_/g,'');
                var target_srl = source.attr('id').replace(/.*_/g,'');
                var brothers = jQuery('#'+destination.attr('id')+' > ul > li:not([class^=line])').length;
                var mode = brothers >1 ? 'move':'insert';
                var source_srl = pos == 0 ? 0: source.prevAll("li:not(.line)").get(0).id.replace(/.*_/g,'');

                jQuery.exec_json("menu.procMenuAdminMoveItem",{"menu_srl":menu_srl,"parent_srl":parent_srl,"target_srl":target_srl,"source_srl":source_srl,"mode":mode},
                function(data){
                    if(data.error>0) Tree(xml_url);
                });

            },

            // i want you !! made by sol
            beforeMovedToLine : function(destination, source, pos){
//                if(typeof(destination.id) == 'undefined') return false;
                return (jQuery(destination).parents('ul').size() + jQuery('ul',source).size() <= max_menu_depth);
            },

            // i want you !! made by sol
            beforeMovedToFolder : function(destination, source, pos){
//                if(typeof(destination.id) == 'undefined') return false;
                return (jQuery(destination).parents('ul').size() + jQuery('ul',source).size() <= max_menu_depth-1);
            },
            afterAjax:function()
            {
                //alert('Loaded');
            },
            animate:true
            ,docToFolderConvert:true
        });


        // image url replace
//        jQuery("#menu ul.simpleTree img").attr("src",function(){ return jQuery(this).attr("src").replace("images/","./common/js/plugins/ui.tree/images/");});




        // open all node
        nodeToggleAll();
    },"xml");
}

function nodeToggleAll(){
    jQuery("[class*=close]", simpleTreeCollection[0]).each(function(){
        simpleTreeCollection[0].nodeToggle(this);
    });
}



function modifyNode(node_srl,e){
    jQuery('#menu_zone_info').html('');
    jQuery("#tree_"+node_srl+" > span").click();
    var params ={
            "parent_srl":0
            ,"menu_item_srl":node_srl
            };

    jQuery.exec_json('menu.getMenuAdminTplInfo', params, function(data){
        jQuery('#menu_zone_info').html(data.tpl).css('position','absolute').css("left",e.pageX).css("top",e.pageY).css('display','block');
    });
}

function addNode(node_srl,e){

    jQuery('#menu_zone_info').html('');
    jQuery("#tree_"+node_srl+" > span").click();

    var params ={
            "menu_item_srl":0
            ,"parent_srl":node_srl
            };

    jQuery.exec_json('menu.getMenuAdminTplInfo', params, function(data){
        jQuery('#menu_zone_info').html(data.tpl).css('position','absolute').css("left",e.pageX).css("top",e.pageY).css('display','block');
    });
}


function deleteNode(node_srl){

    if(confirm(lang_confirm_delete)){
        jQuery('#menu_zone_info').html('');
        var params ={
                "menu_item_srl":node_srl
                ,"menu_srl":jQuery("form input[name=menu_srl]").val()
                };
        jQuery.exec_json('menu.procMenuAdminDeleteItem', params, function(data){
            Tree(xml_url);
        });
    }
}


function completeInsertMenuItem(ret_obj) {
    jQuery('#menu_zone_info').html('');
    Tree(xml_url);
}

function doMoveMenuInfo() {
	var $ = jQuery;
	$(function(){ $('#fo_menu').appendTo(document.body); $('#menu_zone_info').css('width', '550px'); });
}
