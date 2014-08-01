/* AXISJ Javascript UI Framework */
/* http://www.axisj.com, license : http://www.axisj.com/license */
 

var AXEditorLang = {
	en:{
		home:"HOME",
		attch:"Attachment",
		table:"Table",
		layout:"Layouts",
		option:"Options",
		external:"External",
		editor:"Editor",
		HTML:"HTML",
		textColor:"TEXT COLOR",
		textBgColor:"TEXT BGCOLOR",
		fontFamily:"Font Family",
		fontSize:"Font Size",
		fontSample:"가나Ab",
		lineHeight:"Line Height(em)",
		url:"Link",
		upload:"Upload",
		insertDoc:"Insert",
		delSelected:"Delete",
		selectAll:"SelectAll",
		invalidUrlMsg:"invalid url make fail",
		volumeOverMsg:"upload Maxium size over",
		noSelectedFileMsg:"No selected target file",
		fileDeleteConfirm:"Do you want to delete it?",
		externalTitle:"Custom AX Pannel",
		imoticon:"Imoticon"
	},
	kr:{
		home:"홈",
		attch:"파일첨부",
		table:"테이블",
		layout:"레이아웃",
		option:"옵션",
		external:"추가기능",
		editor:"Editor",
		HTML:"HTML",
		textColor:"텍스트 컬러",
		textBgColor:"텍스트 배경컬러",
		fontFamily:"글꼴",
		fontSize:"글자크기",
		fontSample:"가나Ab",
		lineHeight:"줄간격(em)",
		url:"링크걸기",
		upload:"업로드",
		insertDoc:"본문삽입",
		delSelected:"선택삭제",
		selectAll:"전체선택",
		invalidUrlMsg:"url 형식이 잘못되어 url연결에 실패 하였습니다.",
		volumeOverMsg:"업로드 용량이 초과 되어 업로드 하실 수 없습니다.",
		noSelectedFileMsg:"선택된 파일이 없습니다.",
		fileDeleteConfirm:"정말 삭제 하시겠습니까?",
		externalTitle:"Custom AX Pannel",
		imoticon:"이모티콘"
	},
	jp:{
		home:"HOME",
		attch:"Attachment",
		table:"Table",
		layout:"Layouts",
		option:"Options",
		external:"External",
		editor:"Editor",
		HTML:"HTML",
		textColor:"TEXT COLOR",
		textBgColor:"TEXT BGCOLOR",
		fontFamily:"Font Family",
		fontSize:"Font Size",
		fontSample:"가나Ab",
		lineHeight:"Line Height(em)",
		url:"Link",
		upload:"Upload",
		insertDoc:"Insert",
		delSelected:"Delete",
		selectAll:"Select",
		invalidUrlMsg:"invalid url make fail",
		volumeOverMsg:"upload Maxium size over",
		noSelectedFileMsg:"No selected target file",
		fileDeleteConfirm:"Do you want to delete it?",
		externalTitle:"Custom AX Pannel",
		imoticon:"Imoticon"
	},
	cn:{
		home:"HOME",
		attch:"Attachment",
		table:"Table",
		layout:"Layouts",
		option:"Options",
		external:"External",
		editor:"Editor",
		HTML:"HTML",
		textColor:"TEXT COLOR",
		textBgColor:"TEXT BGCOLOR",
		fontFamily:"Font Family",
		fontSize:"Font Size",
		fontSample:"가나Ab",
		lineHeight:"Line Height(em)",
		url:"Link",
		upload:"Upload",
		insertDoc:"Insert",
		delSelected:"Delete",
		selectAll:"Select",
		invalidUrlMsg:"invalid url make fail",
		volumeOverMsg:"upload Maxium size over",
		noSelectedFileMsg:"No selected target file",
		fileDeleteConfirm:"Do you want to delete it?",
		externalTitle:"Custom AX Pannel",
		imoticon:"Imoticon"
	}
};

/*
2014-04-17 : tom - insert image & remove image 아이디 문제 해결
*/

/**
 * AXEditor
 * @class AXEditor
 * @extends AXJ
 * @version v1.2
 * @author tom@axisj.com
 * @logs
 * "2014-06-04 tom : method [insertImg] Insert prevent duplicate images
 *
 */

var AXEditor = Class.create(AXJ, {
	initialize: function(AXJ_super){
		AXJ_super();
		this.moveSens = 0;
		this.contentMode = "editor";
		this.panelNum = 0;
		this.attchFiles = [];
		this.readyFiles = [];
		with(this){
			config.containerCss = "AXEditor";
			config.headCss = "editorHead";
			config.bodyCss = "editorBody";
			config.footCss = "editorFoot";
			config.height = 300;
			config.lang = "en";
			config.moveSens = 5;
			config.ie67adj = -2;
			config.selectMenuIndex = 0;
			config.tabFileUsed = false;
			config.tabTableUsed = false;
			config.tabLayoutUsed = false;
			config.tabOptionUsed = false;
			config.tabExternalUsed = false;
			config.frameSrc = "/_AXJ/lib/AXEditor.html";
			config.editorFontSize = "12px";
			config.editorFontFamily = "Malgun Gothic";
			config.colors = ["ffffff","faedd4","fff3b4","ffffbe","ffeaea","ffeaf8","e6ecfe","d6f3f9","e0f0e9","eaf4cf","e8e8e8","e7c991","f3d756","ffe409","f9b4cb","dfb7ee","b1c4fc","96ddf3","b1dab7","b8d63d","c2c2c2","d18e0a","ec9c2c","ff8b16","f3709b","af65dd","7293fa","49b5d5","6abb9a","5fb636","8e8e8e","9d6c08","c84205","e31600","c8056a","801fbf","3058d2","0686a8","318561","2b8400","474747","654505","8c3c04","840000","8c044b","57048c","193da9","004c5f","105738","174600","000000","463003","612a03","5b0000","610334","320251"];
			config.fonts = ["Malgun Gothic","Gulim","Dotum","궁서"];
			config.fontsizes = [8,9,10,11,12,14,16,18,20];
			config.lineHeights = [1.0, 1.2, 1.5, 1.8, 2.0, 2.5];
			config.swfUploader = "";
			config.uploadUrl = "";
			config.uploadPars = ["p1=1","p2=2"];
			config.deleteUrl = "",
			config.deletePars = [],
			config.uploadVolume = (5 * 1024 * 1024);
			config.uploadFilterName = "All,Image";
    		config.uploadFilterValue = "*.*,*.jpg; *.gif; *.png";
    		config.uploadCallBack = "mmuCall";
    		config.tabExternals = [];
    		config.readyTofocus = true;
			config.msg = {
				alreadyInsertImg:"이미 추가된 이미지 입니다."
			}
		}


        this.config.AXEditorIcons = [
            {
                categoryNM:"Grimi",
                copyRights:"<a href='http://jowrney.com/xe/grimi/' target='_blank'>Copyright © Jowrney.com. All rights reserved.</a>",
                imageFolder:"/ui/icons/grimi/",
                icons:["grimi_big_smile16.png","grimi_cry16.png","grimi_doze16.png","grimi_happy16.png","grimi_love16.png","grimi_smile16.png","grimi_so_what16.png","grimi_vomit16.png"]
            },
            {
                categoryNM:"Fugue Icons",
                copyRights:"<a href='http://p.yusukekamiyamane.com/' target='_blank'>Copyright © Yusuke Kamiyamane. All rights reserved.</a>",
                imageFolder:"/ui/icons/",
                icons:["address-book.png","alarm-clock.png","arrow-000-medium.png","arrow-045-medium.png","arrow-045.png","arrow-090-medium.png","arrow-090.png",
                    "arrow-135-medium.png","arrow-135.png","arrow-180-medium.png","arrow-180.png","arrow-225-medium.png","arrow-225.png","arrow-270-medium.png","arrow-270.png",
                    "arrow-315-medium.png","arrow-315.png","arrow.png","asterisk.png","auction-hammer.png","balance.png","balloon-ellipsis.png","balloon-quotation.png","balloon.png",
                    "bandaid.png","bell.png","bin.png","binocular.png","block.png","bomb.png","bookmark.png","box.png","briefcase.png","broom.png","building.png","burn.png",
                    "calculator.png","camcorder.png","camera.png","car--exclamation.png","car-red.png","clapperboard.png","compass.png","credit-card.png","crown-bronze.png",
                    "crown-silver.png","crown.png","currency-euro.png","currency-pound.png","currency-yen.png","currency.png","cursor-small.png","cursor.png","direction.png",
                    "drill.png","eraser.png","eye.png","hammer.png","hand.png","heart-break.png","heart.png","inbox.png","keyboard.png","leaf.png","lifebuoy.png","light-bulb.png",
                    "mail-open.png","mail.png","marker.png","megaphone.png","microphone.png","mobile-phone.png","money.png","mouse.png","music.png","paint-can.png","pipette-color.png",
                    "plug.png","printer.png","safe.png","smiley-confuse.png","smiley-cool.png","smiley-cry.png","smiley-eek.png","smiley-evil.png","smiley-fat.png","smiley-grin.png",
                    "smiley-lol.png","smiley-mad.png","smiley-mr-green.png","smiley-neutral.png","smiley-paint-brush.png","smiley-razz.png","smiley-red.png","smiley-roll.png","smiley-sad.png",
                    "smiley-slim.png","smiley-surprise.png","smiley-twist.png","smiley-wink.png","smiley-yell.png","smiley.png"]
            }
        ];


	},
	init: function(){
		this._self    = jQuery("#"+this.config.targetID);
	    var config = this.config;
	    // po
	    var po = [];
	    po.push("<div id=\""+config.targetID+"_container\" class=\""+config.containerCss+"\">");
	    po.push("	<div id=\""+config.targetID+"_head\"   class=\""+config.headCss+"\"></div>");
	    po.push("	<div id=\""+config.targetID+"_body\"   class=\""+config.bodyCss+"\"></div>");
	    po.push("	<div id=\""+config.targetID+"_foot\"   class=\""+config.footCss+"\"></div>");
	    po.push("</div>");
	    this._self.append(po.join(''));

	    // define element
	    this.container= jQuery("#"+config.targetID+"_container");
	    this.head     = jQuery("#"+config.targetID+"_head");
	    this.body     = jQuery("#"+config.targetID+"_body");
	    this.foot     = jQuery("#"+config.targetID+"_foot");

	    //init head
    	this.initHead();

    	//init foot
    	this.initFoot();

    	//init body
    	this.initBody();
	},
	initHead: function(){
		var config = this.config;
		var re = config.targetID;
		var lg = AXEditorLang[config.lang];
		var po = [];
		/*메뉴탭과 패널*/
		/*po.push("<div id=\""+re+"_headTab\" class='me___tabContainer'></div>");*/
		po.push("<div id=\""+re+"_headPanel\" class='me___headPanel'></div>");
		this.head.append(po.join(''));
		/*메뉴 내용 구성*/

		this.initPanel();
	},
	initPanel: function(){
		var config = this.config;
		var re = config.targetID;
		var po = [];
			po.push("<div class='me___selectW'>");
			po.push("	<a href='#axExecption' class='me___value selectCommand me_ffs' style='font-family:"+config.editorFontFamily+"' id='"+this._GID([re, "fontname"])+"'>"+config.editorFontFamily+"</a>");
			po.push("</div>");
			po.push("<div class='me___selectS'>");
			po.push("	<a href='#axExecption' class='me___value selectCommand me_fss' id='"+this._GID([re, "fontsize"])+"'>"+config.editorFontSize+"</a>");
			po.push("</div>");
			po.push("<div class='me___vline'></div>");
			po.push("<a href='#axExecption' class='me___btnL'>");
			po.push("	<span class='me_icon me___bold simpleCommand' id='"+this._GID([re, "bold"])+"'>Bold</span>");
			po.push("</a>");
			po.push("<a href='#axExecption' class='me___btnM'>");
			po.push("	<span class='me_icon me___italic simpleCommand' id='"+this._GID([re, "italic"])+"'>Italic</span>");
			po.push("</a>");
			po.push("<a href='#axExecption' class='me___btnM'>");
			po.push("	<span class='me_icon me___underLine simpleCommand' id='"+this._GID([re, "underline"])+"'>UnderLine</span>");
			po.push("</a>");
			po.push("<a href='#axExecption' class='me___btnR'>");
			po.push("	<span class='me_icon me___strike simpleCommand' id='"+this._GID([re, "strikethrough"])+"'>strike</span>");
			po.push("</a>");
			po.push("<div class='me___vline'></div>");
			po.push("<div class='me___selectTL'>");
			po.push("	<div class='me___fontColor_disp' style='background:#444444;' id='"+this._GID([re, "foreColorVal"])+"'></div>");
			po.push("	<a href='#axExecption' class='me___value colorCommand' id='"+this._GID([re, "foreColor"])+"'>foreColor</a>");
			po.push("	<a href='#axExecption' class='me___arrow selectCommand me_picker' id='"+this._GID([re, "foreColorExt"])+"'>+</a>");
			po.push("</div>");
			po.push("<div class='me___selectTR'>");
			po.push("	<div class='me___fontBgColor_disp' style='background:#ffffff;' id='"+this._GID([re, "backColorVal"])+"'></div>");
			po.push("	<a href='#axExecption' class='me___value colorCommand' id='"+this._GID([re, "backColor"])+"'>backColor</a>");
			po.push("	<a href='#axExecption' class='me___arrow selectCommand me_picker' id='"+this._GID([re, "backColorExt"])+"'>+</a>");
			po.push("</div>");
			po.push("<div class='me___vline'></div>");
			po.push("<a href='#axExecption' class='me___btnL'>");
			po.push("	<span class='me_icon me___alignLeft simpleCommand' id='"+this._GID([re, "JustifyLeft"])+"'>alignLeft</span>");
			po.push("</a>");
			po.push("<a href='#axExecption' class='me___btnM'>");
			po.push("	<span class='me_icon me___alignCenter simpleCommand' id='"+this._GID([re, "JustifyCenter"])+"'>alignCenter</span>");
			po.push("</a>");
			po.push("<a href='#axExecption' class='me___btnM'>");
			po.push("	<span class='me_icon me___alignRight simpleCommand' id='"+this._GID([re, "JustifyRight"])+"'>alignRight</span>");
			po.push("</a>");
			po.push("<a href='#axExecption' class='me___btnR'>");
			po.push("	<span class='me_icon me___alignJustify simpleCommand' id='"+this._GID([re, "JustifyFull"])+"'>alignJustify</span>");
			po.push("</a>");
			po.push("<div class='me___vline'></div>");
			po.push("<a href='#axExecption' class='me___btnL'>");
			po.push("	<span class='me_icon me___li simpleCommand' id='"+this._GID([re, "InsertUnorderedList"])+"'>li</span>");
			po.push("</a>");
			
			po.push("<a href='#axExecption' class='me___btnM'>");
			po.push("	<span class='me_icon me___ol simpleCommand' id='"+this._GID([re, "InsertOrderedList"])+"'>ol</span>");
			po.push("</a>");

			po.push("<a href='#axExecption' class='me___btnRa'>");
			po.push("	<span class='me_icon me___lineHeight selectCommand me_lhs' id='"+this._GID([re, "lineHeight"])+"'>lineHeight</span>");
			po.push("</a>");
			po.push("<div class='me___vline'></div>");
			po.push("<a href='#axExecption' class='me___btnLa'>");
			po.push("	<span class='me_icon me___url selectCommand me_url' id='"+this._GID([re, "url"])+"'>url</span>");
			po.push("</a>");
			po.push("<a href='#axExecption' class='me___btnMa'>");
			po.push("	<span class='me_icon me___imoticon selectCommand me_ico' id='"+this._GID([re, "imoticon"])+"'>imoticon</span>");
			po.push("</a>");

			po.push("<a href='#axExecption' class='me___btnR'>");
			po.push("	<span class='me_icon me___pageBreak pbCommand' id='"+this._GID([re, "pageBreak"])+"'>pageBreak</span>");
			po.push("</a>");
		jQuery("#"+re+"_headPanel").append(po.join(''));
		jQuery("#"+re+"_headPanel").find(".simpleCommand").bind("click", this.onSimpleCommandClick.bind(this));
		jQuery("#"+re+"_headPanel").find(".colorCommand").bind("click", this.onColorCommandClick.bind(this));
		jQuery("#"+re+"_headPanel").find(".selectCommand").bind("click", this.onSelectCommandClick.bind(this));
		jQuery("#"+re+"_headPanel").find(".pbCommand").bind("click", this.onInsertCommand.bind(this));
	},
	closePanel: function(){
		var config = this.config;
		var re = config.targetID;
		var items = ["home_btn","attch_btn","table_btn","layout_btn","option_btn","external_btn"];
		jQuery("#"+re+"_"+items[this.panelNum]).parent().removeClass("me___itemOn");
		if(this.panelNum == 0) return;
		if(this.panelNum == 1) this.initFlashButtonMoveTo(jQuery("#"+re+"_"+items[this.panelNum]).parent());
		
		/*this.closeFileStatus();*/
		this.divPanel.remove();
		jQuery("#"+config.targetID+"_head").removeClass("editorHeadExt");	
	},
	openPanel: function(){
		var config = this.config;
		var re = config.targetID;
		var lg = AXEditorLang[config.lang];
		var items = ["home_btn","attch_btn","table_btn","layout_btn","option_btn","external_btn"];
		jQuery("#"+re+"_"+items[this.panelNum]).parent().addClass("me___itemOn");
		
		if(this.panelNum == 0) return;
		if(this.panelNum == 1){
			this.divPanel = jQuery("<div id='"+this._GID([re, "divPanel", "attch"])+"' class='me___headDivPanel_attch'></div>");	
			var po = [];
			po.push("<div class='me___headDivPanel_attch_btns' id='"+re+"_divPanel_attchBtns'>");
			po.push("	<span class='me___span' style='margin-left:33px;'>&nbsp;</span>");
			po.push("	<a href='#axExecption' class='me___btnS1' id='"+this._GID([re, "attbtns", "insertDoc"])+"'>"+lg.insertDoc+"</a>");
			po.push("	<a href='#axExecption' class='me___btnS1' id='"+this._GID([re, "attbtns", "delete"])+"'>"+lg.delSelected+"</a>");
			po.push("	<span class='me___span'>&nbsp;</span>");
			po.push("	<a href='#axExecption' class='me___btnS1' id='"+this._GID([re, "attbtns", "selectAll"])+"'>"+lg.selectAll+"</a>");
			po.push("</div>");
			po.push("<div class='me___headDivPanel_attch_CT' nowrap='nowrap' align='left'>");

		jQuery.each(this.attchFiles, function(si, fo){
			if(fo.checked){
			po.push("<div class='attchItem attchItemON' id='"+re+"_attchItem_"+si+"' title='"+fo.ti.dec()+"'>");
			}else{
			po.push("<div class='attchItem' id='"+re+"_attchItem_"+si+"' title='"+fo.ti.dec()+"'>");
			}
			po.push("<div class='attchItemName'>"+fo.ti.dec()+"</div>");
			po.push("<div class='attchItemPreview'>");
			var ty = fo.ty.dec().toLowerCase();
			if(ty == ".gif" | ty == ".jpg" | ty == ".png" | ty == ".bmp"){
			po.push("<img src='"+fo.path.dec()+fo.nm.dec()+"' width='100%' height='100%' alt='' />")
			}
			po.push("</div>");
			po.push("</div>");
		});
						
			po.push("	<div class='attchItemEnd' id='"+re+"_divPanel_attchItemEnd'>&nbsp;</div>");
			po.push("</div>");
			this.divPanel.html(po.join(''));
			
			this.openFileStatus();
		}
		if(this.panelNum == 5){
			this.divPanel = jQuery("<div id='"+this._GID([re, "divPanel", "external"])+"' class='me___headDivPanel_attch'></div>");
			var po = [];
			po.push("<div class='me___headDivPanel_attch_btns' id='"+re+"_divPanel_attchBtns'>");
			po.push("<div class='headTitle'>"+lg.externalTitle+"</div>");
			po.push("</div>");
			po.push("<div class='me___headDivPanel_attch_CT' nowrap='nowrap' align='left'>");
			
			jQuery.each(config.tabExternals, function(idx, n){
			po.push("<div class='componentItem' id='"+n.component+"' title='"+n.title+"'>");
			po.push("<div class='componentItemName'>"+n.title+"</div>");
			po.push("<div class='componentItemPreview'>");
			if(n.ico != ""){
			po.push("<img src='"+n.ico+"' alt='' />")
			}
			po.push("</div>");
			po.push("</div>");
			});
			
			po.push("	<div class='attchItemEnd' id='"+re+"_divPanel_attchItemEnd'>&nbsp;</div>");
			po.push("</div>");
			this.divPanel.html(po.join(''));
		}
		
		jQuery("#"+re+"_headPanel").append(this.divPanel);
		jQuery("#"+config.targetID+"_head").addClass("editorHeadExt");
		if(this.panelNum == 1){
			this.initFlashButtonMoveTo(jQuery("#"+re+"_divPanel_attchBtns"));
			jQuery("#"+re+"_divPanel_attch").find(".me___btnS1").bind("click", this.onAttbtnsClick.bind(this));
			jQuery("#"+re+"_divPanel_attch").find(".attchItem").bind("click", this.onAttchItemClick.bind(this));
		}
		if(this.panelNum == 5){
			jQuery("#"+re+"_divPanel_external").find(".componentItem").bind("click", this.onClickComponent.bind(this));
		}
	},
	setAttchItem: function(arg){
		var config = this.config;
		var re = config.targetID;
		var lg = AXEditorLang[config.lang];
		if(!arg) return;
		
		/*file size check*/
		var useByte = 0;
		var volumeByte = config.uploadVolume;
		jQuery.each(this.attchFiles, function(){
			useByte += this.size.number();
		});
		jQuery.each(arg, function(index){
			useByte += this.size.number();
		});
		if(useByte > volumeByte){
			/*alert(	lg.volumeOverMsg + "\n\n(" + useByte.byte() + "/" + volumeByte.byte() +")" );*/
			/*AXFlash.requestFn(re+"_attched_swf","uploadCancel");*/
			/*return;*/
		}
		this.readyFiles = arg;
		this.readyUpload();
		/*업로드 시작*/
		/*AXFlash.requestFn(re+"_attched_swf", "uploadStart");*/
	},
	readyUpload: function(){
		if(this.readyFiles.length == 0) return;
		var config = this.config;
		var re = config.targetID;
		/*ready file*/
		var startIndex = this.attchFiles.length;
		var po = [];
			po.push("<div class='attchItem' id='"+re+"_attchItem_"+startIndex+"'>");
			po.push("	<div class='attchItemName'>.....</div>");
			po.push("	<div class='attchItemPreviewLoad'></div>");
			po.push("</div>");
		jQuery("#"+re+"_divPanel_attchItemEnd").before(po.join(''));
	},
	uploadedFile: function(arg){
		var config = this.config;
		var re = config.targetID;
		var startIndex = this.attchFiles.length;
		jQuery("#"+re+"_attchItem_"+startIndex).attr('title', arg.ti.dec());
		jQuery("#"+re+"_attchItem_"+startIndex).find(".attchItemName").html(arg.ti.dec());
		jQuery("#"+re+"_attchItem_"+startIndex).find(".attchItemPreviewLoad").addClass("attchItemPreview");
		jQuery("#"+re+"_attchItem_"+startIndex).bind("click", this.onAttchItemClick.bind(this));
		var ty = arg.ty.dec().toLowerCase();
		if(ty == ".gif" | ty == ".jpg" | ty == ".png" | ty == ".bmp"){
			jQuery("#"+re+"_attchItem_"+startIndex).find(".attchItemPreviewLoad").html("<img src='"+arg.path.dec()+arg.nm.dec()+"' width='100%' height='100%' alt='' />")
			/*본문삽입*/
			var imgObj = new Image();
			imgObj.src = arg.path.dec()+arg.nm.dec();
			imgObj.id = "MF_"+arg.nm.replace(arg.ty, "").dec();
			var pasteHTML = this.__pasteHTML.bind(this);
			var canvasWidth = this.canvas.width() - 40;
			imgObj.onload = function(){
				var ow = imgObj.width;
				var oh = imgObj.height;
				if(imgObj.width > canvasWidth){
					imgObj.width = canvasWidth;
					imgObj.height = oh * (imgObj.width / ow);
				}
				try{
					pasteHTML(imgObj);
				}catch(e){
					alert(e.print());	
				}
			}
		}
		this.attchFiles.push(arg);
		this.readyFiles.pop();
		this.readyUpload();
		this.updateFileStatus();
	},
	insertIMG: function(file){
		
		/*trace(file);*/
		
		/*{id:"", ti:"", nm:"", ty:"", sz:"", path:"", thumb:""}*/
		var config = this.config;
		var re = config.targetID;
		var ty = file.ty.dec().toLowerCase();
		var tyReg = /(bmp|jpg|jpeg|gif|png)$/;
 		if (tyReg.test(ty)) {
		    var imgTagId = "MF_"+file.nm.replace(new RegExp("[\.]"+file.ty, "i"), "").dec();
		    if(axdom(this.myEDT.document).find("#"+imgTagId).get(0)) {
			    alert(config.msg.alreadyInsertImg);
			    return;
		    }
			var imgObj = new Image();
			imgObj.src = file.path.dec()+file.nm.dec();
			imgObj.id = imgTagId;

			var pasteHTML = this.__pasteHTML.bind(this);
			var canvasWidth = this.canvas.width() - 40;
			imgObj.onload = function(){
				var ow = imgObj.width;
				var oh = imgObj.height;
				if(imgObj.width > canvasWidth){
					imgObj.width = canvasWidth;
					imgObj.height = oh * (imgObj.width / ow);
				}
				try{
					pasteHTML(imgObj);
				}catch(e){
					alert(e.print());	
				}
			}
		}
	},
	removeIMG: function(fileID){
		this.onFeilDeleteInFrame("#"+fileID);
	},
	initFoot: function(){
		var config = this.config;
		var po = [];
		po.push("<a class='me___handle'>resizer</a>");
		po.push("<div class='me___container'>");
		po.push("	<a href='#axExecption' id='"+config.targetID+"_contentMode_0' class='me____tab me____tabOn'>Editor</a>");
		po.push("	<a href='#axExecption' id='"+config.targetID+"_contentMode_1' class='me____tab'>HTML</a>");
		po.push("</div>");
		this.foot.append(po.join(''));
		this.foot.find("a.me___handle").bind("mousedown", this.footOnDrag.bind(this));
		this.foot.find("a.me____tab").bind("click", this.onContentMode.bind(this));
	},
	/* initFoot sub functions */
		footOnDrag: function(){
			this.footOnMover = this.footOnMove.bind(this);
			jQuery(document).bind("mousemove", this.footOnMover);
			this.footOnDroper = this.footOnDrop.bind(this);
			jQuery(document).bind("mouseup", this.footOnDroper);
			this.selectstart = this.onselectStart.bind(this);
			jQuery(document).bind("selectstart", this.selectstart);
			this.canvasMask.show();
		},
		footOnMove: function(event){
			if(!event.pageX) return;
		    this.mouse = {x:event.pageX||0, y:event.pageY||0}; 
		    if(this.config.moveSens > this.moveSens) this.moveSens++;
		    if(this.moveSens == this.config.moveSens) this.footMove();
		},
		footMove: function(){
		    if(!this.draged){
		    	this.draged = true;
				this.canvasTop = (this.contentMode == "html") ? this.htmlArea.offset().top : this.canvas.offset().top;
		    }
		    if( (this.mouse.y - this.canvasTop) > 100 ) this.config.height = (this.mouse.y - this.canvasTop - 2);
		    if(this.observer) clearTimeout(this.observer);
      		this.observer = setTimeout(this.footSetCanvasHeight.bind(this), 10);
		},
		footOnDrop: function(){
			this.moveSens = 0;
			jQuery(document).unbind("mousemove", this.footOnMover);
			jQuery(document).unbind("mouseup", this.footOnDroper);
			jQuery(document).unbind("selectstart", this.selectstart);
			clearTimeout(this.observer);
			this.canvasMask.hide();
			this.draged = false;
		},
		footSetCanvasHeight: function(){
			this.canvas.css({height:this.config.height+"px"});
			if(this.contentMode == "html"){
				this.htmlArea.css({height:this.canvas.height()+"px"});
			}
		},
	/* initFoot sub functions */
	initBody: function(){
		var config = this.config;
		this.canvas = jQuery("<iframe src='"+config.frameSrc+"' id='"+config.targetID+"_canvas' name='"+config.targetID+"_canvas' frameBorder='0' allowTransparency='true'></iframe>");
		this.canvasMask = jQuery("<div id='"+config.targetID+"_canvasMask' class='me___AXMask' style='display:none;z-index:10;'></div>");
		this.body.append(this.canvas);
		this.body.append(this.canvasMask);
		this.canvas.css({"width":"100%",height:config.height+"px"});
		this.canvas.bind("load", this.readyFrame.bind(this));
	},
	setHtmlMode: function(power){
		if(power == "on"){
			var config = this.config;
			var canvasHeight = this.canvas.height();
			this.canvas.hide();
			this.htmlArea = jQuery("<textarea id='"+config.targetID+"_html' name='"+config.targetID+"_html' class='me__htmlArea'></textarea>");
			this.body.append(this.htmlArea);
			this.htmlArea.css({"width":"100%",height:canvasHeight+"px"});
			this.htmlArea.val(this.__getContent());
		}else{
			this.setContent(this.htmlArea.val());
			this.canvas.show();
			this.htmlArea.remove();
		}
	},
	readyFrame: function(){
		var config = this.config;
		this.myEDT = window[config.targetID+"_canvas"];

		var editorBody = this.myEDT.document;
		if(AXUtil.browser.name == "ie")	editorBody.body.contentEditable = true;
		else if(AXUtil.browser.name == "webkit"){
			editorBody.body.contentEditable = true;
			editorBody.designMode = "On";
		}else if(AXUtil.browser.name == "mozilla")	editorBody.designMode = "On";
		else	editorBody.designMode = "On";
		try{
			jQuery(editorBody.body).css({"font-size":config.editorFontSize});
			jQuery(editorBody.body).css({"font-family":config.editorFontFamily});
		}catch(e){
		}
	    
	    this.bindFocusFrame();
	    if(this.config.onReady) this.config.onReady();
	},
	focusFrame: function(){
		/* close all menu*/
		this.closeColorPicker();
		this.closeffPicker();
		this.closefsPicker();
		this.closelhPicker();
		
		this.closeicPicker();
	},
	unbindFocusFrame: function(){
		var editorBody = this.myEDT.document;
		if(AXUtil.browser.name == "mozilla") jQuery(editorBody).unbind("focus", this.focusFrame.bind(this));
	    else	jQuery(editorBody.body).unbind("focus", this.focusFrame.bind(this));
	},
	bindFocusFrame: function(){
		var editorBody = this.myEDT.document;
		if(AXUtil.browser.name == "mozilla") jQuery(editorBody).bind("focus", this.focusFrame.bind(this));
	    else	jQuery(editorBody.body).bind("focus", this.focusFrame.bind(this));
	},
	onselectStart: function(event){
    	event.stopPropagation();
    	return false;
	},
	/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
	__command: function(sCommand, bUserInterface, vValue){
		var myEDT = this.myEDT.document;
		myEDT.execCommand(sCommand, bUserInterface, vValue);
	},
	__pasteHTML: function(sHTML){
		var myEDT = this.myEDT.document;
		var oTmpDiv = myEDT.createElement("DIV");
		var oTmpP = myEDT.createElement("P");
		oTmpDiv.appendChild(oTmpP);
		if(typeof(sHTML) == "string") oTmpDiv.innerHTML = sHTML;
		else  oTmpP.appendChild(sHTML);
		
		if(this.contentMode == "editor"){
			var myRange = new SSelection(this.myEDT);
			var rng = myRange.getRangeAt(0);
			rng.insertNode(oTmpDiv.lastChild);
		}else{
			jQuery("#"+this.config.targetID+"_html").val(jQuery("#"+this.config.targetID+"_html").val()+oTmpDiv.innerHTML);
		}
	},
	/* click event */
	onHeadClick: function(event){
		if(typeof(event) == "object"){
			var myID = event.target.id;
			if(!myID) return;
			var ids = myID.split(/_/g);
			var headNM = ids[1];
			var headCMD = ids[2];
		}else{
			var headNM = event;
			var headCMD = "";
		}
		if(headNM == "home"){
			this.closePanel();
			this.panelNum = 0;
			this.openPanel();
		}else if(headNM == "attch"){
			if(this.panelNum == 1) return;
			this.closePanel();
			this.panelNum = 1;
			this.openPanel();
		}else if(headNM == "external"){
			if(this.panelNum == 5) return;
			this.closePanel();
			this.panelNum = 5;
			this.openPanel();
		}
	},
	onAttchPanelOpen: function(arg){
		if(this.panelNum == 1){
			if(arg)	this.setAttchItem(arg);
			return;
		}
		this.closePanel();
		this.panelNum = 1;
		this.openPanel();
		if(arg)	this.setAttchItem(arg);
	},
	onSimpleCommandClick: function(event){
		var myID = event.target.id;
		if(!myID) return;
		var command = this._GPT(myID);
		this.__command(command);
	},
	onColorCommandClick: function(event){
		var config = this.config;
		var re = config.targetID;
		var myEDT = this.myEDT.document;
		var myID = event.target.id;
		if(!myID) return;
		var myCommand = this._GPT(myID);
		var myColor = jQuery("#"+myID+"Val").css("background-color").toColor();
		this.__command(myCommand, false, myColor);

		var myRange = new SSelection(this.myEDT);
		var rng = myRange.getRangeAt(0);
		var nodes = rng.getNodes();
		if(nodes.length){
			for(var a=0;a<nodes.length;a++){
				var myNode = nodes[a];
				var pnode = DOMfix.DF_parentNode(myNode);
				try{
					while(pnode.tagName != "FONT" && pnode.tagName != "SPAN"){
						pnode = DOMfix.DF_parentNode(pnode);
					}
					if(myCommand == "foreColor"){
						pnode.style.color = myColor;
						pnode.removeAttribute("color");
					}else{
						pnode.style.backgroundColor = myColor;
						pnode.removeAttribute("bgcolor");
					}
				}catch(e){}
			}
		}else{
			if(myCommand == "foreColor") myEDT.body.style.color = myColor;
			else myEDT.body.style.backgroundColor = myColor;
		}

	},
	onInsertCommand: function(event){
		var myID = event.target.id;
		if(!myID) return;
		var command = this._GPT(myID);
		if(command == "pageBreak"){
			this.__pasteHTML("<hr style='page-break-before:always;border:1px dashed #444;' />");
		}
	},
	onSelectCommandClick: function(event){
		var myEDT = this.myEDT.document;
		var myID = event.target.id;
		if(!myID) return;
		var command = this._GPT(myID);
		/*alert("select Command : " + command);*/
		if(command == "foreColorExt" || command == "backColorExt") this.openColorPicker(command);
		if(command == "fontname") this.fontFamilyPicker(command);
		if(command == "fontsize") this.fontSizePicker(command);
		if(command == "lineHeight") this.lineHeightPicker(command);
		if(command == "url") this.urlPicker(command);
		if(command == "imoticon") this.icoPicker(command);
	},
	onAttbtnsClick: function(event){
		var config = this.config;
		var re = config.targetID;
		var lg = AXEditorLang[config.lang];
		var myID = event.target.id;
		if(!myID) return;
		var cmd = myID.split(/_/g).last();
		if(cmd == "selectAll"){
			jQuery.each(this.attchFiles, function(idx, f){
				f.checked = true;
				jQuery("#"+re+"_attchItem_"+idx).addClass("attchItemON");
			});
		}
		if(cmd == "delete"){
			var delFiles = [];
			jQuery.each(this.attchFiles, function(idx, f){
				if(f.checked){
					delFiles.push("file="+f.nm+"&path="+f.path)	
				}
			});
			if(delFiles.length == 0){
				alert(lg.noSelectedFileMsg);
				return;
			}
			if(!confirm(lg.fileDeleteConfirm)) return;
			var url = config.deleteUrl;
			var pars = config.deletePars.join("&");
			if(pars != "") pars += "&";
			pars += delFiles.join("&")+"&dummy="+AXUtil.timekey();
			/*new AXreq(url, {pars:pars, onsucc:this.onFileDelete.bind(this)});*/
		}
		if(cmd == "insertDoc"){
			var insertFiles = jQuery.map(this.attchFiles, function(f){
				if(f.checked) return f;
			});
			if(insertFiles.length == 0){
				alert(lg.noSelectedFileMsg);
				return;
			}
			
			try{
			this.myEDT.document.body.focus();
			}catch(e){}
				
			for(var si = 0;si<insertFiles.length;si++){
				var fo = insertFiles[si];
				var ty = fo.ty.dec().toLowerCase();
				if(ty == ".gif" | ty == ".jpg" | ty == ".png" | ty == ".bmp"){
					var imgObj = new Image();
					imgObj.src = fo.path.dec()+fo.nm.dec();
					imgObj.id = "MF_"+fo.nm.replace(fo.ty, "").dec();
					
					var pasteHTML = this.__pasteHTML.bind(this);
					var canvasWidth = this.canvas.width() - 40;
					imgObj.onload = function(){
						var ow = imgObj.width;
						var oh = imgObj.height;
						if(imgObj.width > canvasWidth){
							imgObj.width = canvasWidth;
							imgObj.height = oh * (imgObj.width / ow);
						}
						try{
							pasteHTML(imgObj);
						}catch(e){
							alert(e.print());	
						}
					}
					
				}else{
					this.__pasteHTML("<a href='"+fo.path.dec()+fo.nm.dec()+"' id='MF_"+fo.nm.replace(fo.ty, "").dec()+"' target='_blank'>"+fo.ti.dec()+"</a>");
				}
			}
			/*img resize*/
		}
	},
	onFeilDeleteInFrame: function(rid){
		var editorBody = this.myEDT.document;
		if(AXUtil.browser.name == "mozilla"){
			jQuery(editorBody).find(rid).remove();
		}else{
			jQuery(editorBody.body).find(rid).remove();
		}
	},
	onFileDelete: function(res){
		if(res.result == "ok"){
			var config = this.config;
			var re = config.targetID;
			
			var removeInFrame = this.onFeilDeleteInFrame.bind(this);
			this.attchFiles = jQuery.map(this.attchFiles, function(f, i){
				jQuery("#"+re+"_attchItem_"+i).remove();
				if(f.checked){
					removeInFrame("#MF_"+f.nm.replace(f.ty, "").dec());
				}else{
					return f;
				}
			});
		
			this.updateFileStatus();
						
			if(this.attchFiles.length == 0) return;
			jQuery.each(this.attchFiles, function(si, fo){
				var po = [];
				po.push("<div class='attchItem' id='"+re+"_attchItem_"+si+"' title='"+fo.ti.dec()+"'>");
				po.push("<div class='attchItemName'>"+fo.ti.dec()+"</div>");
				po.push("<div class='attchItemPreview'>");
				var ty = fo.ty.dec().toLowerCase();
				if(ty == ".gif" | ty == ".jpg" | ty == ".png" | ty == ".bmp")
				po.push("<img src='"+fo.path.dec()+fo.nm.dec()+"' width='100%' height='100%' alt='' />")
				po.push("</div>");
				po.push("</div>");
				jQuery("#"+re+"_divPanel_attchItemEnd").before(po.join(''));
			});
			
			jQuery("#"+re+"_divPanel_attch").find(".attchItem").bind("click", this.onAttchItemClick.bind(this));
			
		}else{
			alert(res.msg.dec());	
		}
	},
	onAttchItemClick: function(event){
		var config = this.config;
		var re = config.targetID;
		var myID = event.target.id;
		if(!myID){
			try{
				myID = jQuery(event.target).parents(".attchItem")[0].id;
			}catch(e){
			}
			if(!myID) return;
		};
		var fidx = myID.split(/_/g).last().number();
		this.attchFiles[fidx].checked = (!this.attchFiles[fidx].checked);
		if(this.attchFiles[fidx].checked){
			jQuery("#"+re+"_attchItem_"+fidx).addClass("attchItemON");
		}else{
			jQuery("#"+re+"_attchItem_"+fidx).removeClass("attchItemON");
		}
	},
	onClickComponent: function(event){
		var myID = event.target.id;
		if(!myID){
			try{
				myID = jQuery(event.target).parents(".componentItem")[0].id;
			}catch(e){
			}
			if(!myID) return;
		};
		if(this.config.onTabExternals) this.config.onTabExternals(myID);
	},
	/* ~~ colorPicker ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
	openColorPicker: function(command){
		if(this.colorPicker) this.colorPicker.remove();
		var config = this.config;
		var re = config.targetID;
		var lg = AXEditorLang[config.lang];
		var po = [];
		po.push("<div class='me___selecterBox me_picker' id='"+this._GID([re, command, "picker"])+"'>");
		po.push("	<div class='me___selecterArrow me_picker'></div>");
		if(command == "foreColorExt") po.push("	<div class='me___selecterTitle me_picker'>"+lg.textColor+"</div>");
		if(command == "backColorExt") po.push("	<div class='me___selecterTitle me_picker'>"+lg.textBgColor+"</div>");
		jQuery.each(config.colors, function(index, n){
			po.push("<a href='#AXExex' class='colorItem me_picker' style='background:#"+n+"'>"+n+"</a>");
		});
		po.push("</div>");
		this.colorPicker = jQuery(po.join(''));
		var myHeight = (config.colors.length / 7).ceil() * 21 + 28;
		if(command == "foreColorExt") this.colorPicker.css({width:150, height:myHeight, left:249, top:25});
		if(command == "backColorExt") this.colorPicker.css({width:150, height:myHeight, left:287, top:25});
		jQuery("#"+re+"_headPanel").append(this.colorPicker);

		/*other click observer init*/
		this.clickToClose = this.closeColorPicker.bind(this);
    	jQuery(document).bind("click", this.clickToClose);
    	this.keyDownToClose = this.closeColorPickerKey.bind(this);
    	jQuery(document).bind("keydown", this.keyDownToClose);
    	/*color select*/
    	this.colorPicker.find(".colorItem").bind("click", this.clickColor.bind(this, command));
	},
	closeColorPicker: function(event){
		if(event){
			if(!jQuery(event.target).hasClass("me_picker")){
				if(this.clickToClose) jQuery(document).unbind('click', this.clickToClose);
				if(this.keyDownToClose) jQuery(document).unbind('keydown', this.keyDownToClose);
				if(this.colorPicker) this.colorPicker.remove();
			}
		}else{
			if(this.clickToClose) jQuery(document).unbind('click', this.clickToClose);
			if(this.keyDownToClose) jQuery(document).unbind('keydown', this.keyDownToClose);
			if(this.colorPicker) this.colorPicker.remove();
		}
	},
	closeColorPickerKey: function(){
		if(event.keyCode == AXUtil.Event.KEY_ESC){
			if(this.clickToClose) jQuery(document).unbind('click', this.clickToClose);
			if(this.keyDownToClose) jQuery(document).unbind('keydown', this.keyDownToClose);
			if(this.colorPicker) this.colorPicker.remove();
		}
	},
	clickColor: function(command, event){
		var config = this.config;
		var re = config.targetID;
		var myEDT = this.myEDT.document;

		var myColor = jQuery(event.target).css("background-color").toColor();
		var myCommand = command.replace("Ext", "");
		this.__command(myCommand, false, myColor);

		var myRange = new SSelection(this.myEDT);
		var rng = myRange.getRangeAt(0);
		var nodes = rng.getNodes();
		if(nodes.length){
			for(var a=0;a<nodes.length;a++){
				var myNode = nodes[a];
				var pnode = DOMfix.DF_parentNode(myNode);
				try{
					while(pnode.tagName != "FONT" && pnode.tagName != "SPAN"){
						pnode = DOMfix.DF_parentNode(pnode);
					}
					if(myCommand == "foreColor"){
						pnode.style.color = myColor;
						pnode.removeAttribute("color");
					}else{
						pnode.style.backgroundColor = myColor;
						pnode.removeAttribute("bgcolor");
					}
				}catch(e){}
			}
		}else{
			if(myCommand == "foreColor") myEDT.body.style.color = myColor;
			else myEDT.body.style.backgroundColor = myColor;
		}


		jQuery("#"+this._GID([re, myCommand+"Val"])).css({background:"#"+myColor});
		this.closeColorPicker();
	},
	/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
	/* ~~ font family ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
	fontFamilyPicker: function(command){
		if(this.ffPicker) this.ffPicker.remove();
		var config = this.config;
		var re = config.targetID;
		var lg = AXEditorLang[config.lang];
		var po = [];
		po.push("<div class='me___selecterBox me_ffs' id='"+this._GID([re, command, "picker"])+"'>");
		po.push("	<div class='me___selecterArrow me_ffs'></div>");
		po.push("	<div class='me___selecterTitle me_ffs'>"+lg.fontFamily+"</div>");
		jQuery.each(config.fonts, function(index, n){
			po.push("<a href='#AXExex' class='ffItem me_ffs' style='font-family:"+n+"'>"+lg.fontSample+"("+n+")</a>");
		});
		po.push("</div>");
		this.ffPicker = jQuery(po.join(''));
		var myHeight = config.fonts.length * 25 + 30;
		this.ffPicker.css({width:150, height:myHeight, left:3, top:25});
		jQuery("#"+re+"_headPanel").append(this.ffPicker);

		/*other click observer init*/
		this.clickToCloseFF = this.closeffPicker.bind(this);
    	jQuery(document).bind("click", this.clickToCloseFF);
    	this.keyDownToCloseFF = this.closeffPickerKey.bind(this);
    	jQuery(document).bind("keydown", this.keyDownToCloseFF);
    	/*color select*/
    	this.ffPicker.find(".ffItem").bind("click", this.clickff.bind(this, command));
	},
	closeffPicker: function(event){
		if(event){
			if(!jQuery(event.target).hasClass("me_ffs")){
				if(this.clickToCloseFF) jQuery(document).unbind('click', this.clickToCloseFF);
				if(this.keyDownToCloseFF) jQuery(document).unbind('keydown', this.keyDownToCloseFF);
				if(this.ffPicker) this.ffPicker.remove();
			}
		}else{
			if(this.clickToCloseFF) jQuery(document).unbind('click', this.clickToCloseFF);
			if(this.keyDownToCloseFF) jQuery(document).unbind('keydown', this.keyDownToCloseFF);
			if(this.ffPicker) this.ffPicker.remove();
		}
	},
	closeffPickerKey: function(){
		if(event.keyCode == AXUtil.Event.KEY_ESC){
			if(this.clickToCloseFF) jQuery(document).unbind('click', this.clickToCloseFF);
			if(this.keyDownToCloseFF) jQuery(document).unbind('keydown', this.keyDownToCloseFF);
			if(this.ffPicker) this.ffPicker.remove();
		}
	},
	clickff: function(command, event){
		var config = this.config;
		var re = config.targetID;
		var myEDT = this.myEDT.document;
		var myfont = jQuery(event.target).css("font-family");

		this.__command(command, false, myfont);

		var myRange = new SSelection(this.myEDT);
		var rng = myRange.getRangeAt(0);
		var nodes = rng.getTextNodes();
		if(nodes.length){
			for(var a=0;a<nodes.length;a++){
				var myNode = nodes[a];
				var pnode = DOMfix.DF_parentNode(myNode);
				try{
					while(pnode.tagName != "FONT" && pnode.tagName != "SPAN"){
						pnode = DOMfix.DF_parentNode(pnode);
					}
					pnode.style.fontFamily = myfont;
					pnode.removeAttribute("face");
				}catch(e){}
			}
		}else{
			myEDT.body.style.fontFamily = myfont;
		}
		/*일단 현재 선택된 노드에 대한 합의의 형태로 일단락 추후 추가 개발토록 하자.*/

		jQuery("#"+this._GID([re, "fontname"])).html(myfont);
		jQuery("#"+this._GID([re, "fontname"])).css({"font-family":myfont});

		this.closeffPicker();
	},
	/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
	/* ~~ font size ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
	fontSizePicker: function(command){
		if(this.fsPicker) this.fsPicker.remove();
		var config = this.config;
		var re = config.targetID;
		var lg = AXEditorLang[config.lang];
		var po = [];
		po.push("<div class='me___selecterBox me_fss' id='"+this._GID([re, command, "picker"])+"'>");
		po.push("	<div class='me___selecterArrow me_fss'></div>");
		po.push("	<div class='me___selecterTitle me_fss'>"+lg.fontSize+"</div>");
		jQuery.each(config.fontsizes, function(index, n){
			po.push("<a href='#AXExex' class='ffItem me_fss' style='font-size:"+n+"px'>"+lg.fontSample+"("+n+"px)</a>");
		});
		po.push("</div>");
		this.fsPicker = jQuery(po.join(''));
		var myHeight = config.fontsizes.length * 25 + 30;
		this.fsPicker.css({width:150, height:myHeight, left:95, top:25});
		jQuery("#"+re+"_headPanel").append(this.fsPicker);

		/*other click observer init*/
		this.clickToCloseFS = this.closefsPicker.bind(this);
    	jQuery(document).bind("click", this.clickToCloseFS);
    	this.keyDownToCloseFS = this.closefsPickerKey.bind(this);
    	jQuery(document).bind("keydown", this.keyDownToCloseFS);
    	/*color select*/
    	this.fsPicker.find(".ffItem").bind("click", this.clickfs.bind(this, command));
	},
	closefsPicker: function(event){
		if(event){
			if(!jQuery(event.target).hasClass("me_fss")){
				if(this.clickToCloseFS) jQuery(document).unbind('click', this.clickToCloseFS);
				if(this.keyDownToCloseFS) jQuery(document).unbind('keydown', this.keyDownToCloseFS);
				if(this.fsPicker) this.fsPicker.remove();
			}
		}else{
			if(this.clickToCloseFS) jQuery(document).unbind('click', this.clickToCloseFS);
			if(this.keyDownToCloseFS) jQuery(document).unbind('keydown', this.keyDownToCloseFS);
			if(this.fsPicker) this.fsPicker.remove();
		}
	},
	closefsPickerKey: function(){
		if(event.keyCode == AXUtil.Event.KEY_ESC){
			if(this.clickToCloseFS) jQuery(document).unbind('click', this.clickToCloseFS);
			if(this.keyDownToCloseFS) jQuery(document).unbind('keydown', this.keyDownToCloseFS);
			if(this.fsPicker) this.fsPicker.remove();
		}
	},
	clickfs: function(command, event){
		var config = this.config;
		var re = config.targetID;
		var myEDT = this.myEDT.document;
		var mysize = jQuery(event.target).css("font-size");
		this.__command(command, false, 1);
		var myRange = new SSelection(this.myEDT);
		var rng = myRange.getRangeAt(0);
		var nodes = rng.getTextNodes();
		if(nodes.length){
			for(var a=0;a<nodes.length;a++){
				var myNode = nodes[a];
				var pnode = DOMfix.DF_parentNode(myNode);
				try{
					while(pnode.tagName != "FONT" && pnode.tagName != "SPAN"){
						pnode = DOMfix.DF_parentNode(pnode);
					}
					pnode.style.fontSize = mysize;
					pnode.removeAttribute("size");
				}catch(e){}
			}
		}else{
			myEDT.body.style.fontSize = mysize;
		}
		/*일단 현재 선택된 노드에 대한 합의의 형태로 일단락 추후 추가 개발토록 하자.*/
		jQuery("#"+this._GID([re, "fontsize"])).html(mysize);
		this.closefsPicker();
	},
	/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
	/* ~~ lineheight ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
	lineHeightPicker: function(command){
		if(this.lhPicker) this.lhPicker.remove();
		var config = this.config;
		var re = config.targetID;
		var lg = AXEditorLang[config.lang];
		var po = [];
		po.push("<div class='me___selecterBox me_lhs' id='"+this._GID([re, command, "picker"])+"'>");
		po.push("	<div class='me___selecterArrow me_lhs'></div>");
		po.push("	<div class='me___selecterTitle me_lhs'>"+lg.lineHeight+"</div>");
		jQuery.each(config.lineHeights, function(index, n){
			po.push("<a href='#AXExex' class='ffItem me_lhs' style='text-align:center;'>"+n+"</a>");
		});
		po.push("</div>");
		this.lhPicker = jQuery(po.join(''));
		var myHeight = config.lineHeights.length * 25 + 30;
		this.lhPicker.css({width:100, height:myHeight, left:491, top:25});
		jQuery("#"+re+"_headPanel").append(this.lhPicker);

		/*other click observer init*/
		this.clickToCloseLH = this.closelhPicker.bind(this);
    	jQuery(document).bind("click", this.clickToCloseLH);
    	this.keyDownToCloseLH = this.closelhPickerKey.bind(this);
    	jQuery(document).bind("keydown", this.keyDownToCloseLH);
    	/*color select*/
    	this.lhPicker.find(".ffItem").bind("click", this.clicklh.bind(this, command));
	},
	closelhPicker: function(event){
		if(event){
			if(!jQuery(event.target).hasClass("me_lhs")){
				if(this.clickToCloseLH) jQuery(document).unbind('click', this.clickToCloseLH);
				if(this.keyDownToCloseLH) jQuery(document).unbind('keydown', this.keyDownToCloseLH);
				if(this.lhPicker) this.lhPicker.remove();
			}
		}else{
			if(this.clickToCloseLH) jQuery(document).unbind('click', this.clickToCloseLH);
			if(this.keyDownToCloseLH) jQuery(document).unbind('keydown', this.keyDownToCloseLH);
			if(this.lhPicker) this.lhPicker.remove();
		}
	},
	closelhPickerKey: function(){
		if(event.keyCode == AXUtil.Event.KEY_ESC){
			if(this.clickToCloseLH) jQuery(document).unbind('click', this.clickToCloseLH);
			if(this.keyDownToCloseLH) jQuery(document).unbind('keydown', this.keyDownToCloseLH);
			if(this.lhPicker) this.lhPicker.remove();
		}
	},
	clicklh: function(command, event){
		var config = this.config;
		var re = config.targetID;
		var myEDT = this.myEDT.document;
		var mylh = jQuery(event.target).text();
		var myRange = new SSelection(this.myEDT);
		var rng = myRange.getRangeAt(0);
		var nodes = rng.getTextNodes();
		if(nodes.length){
			for(var a=0;a<nodes.length;a++){
				var myNode = nodes[a];
				var pnode = DOMfix.DF_parentNode(myNode);
				if(pnode.tagName == "BODY"){
					pnode.style.lineHeight = mylh+"em";
				}else{
					while(pnode.tagName != "P" && pnode.tagName != "DIV"){
						pnode = DOMfix.DF_parentNode(pnode);
					}
					pnode.style.lineHeight = mylh+"em";
				}
			}
		}else{
			myEDT.body.style.lineHeight = mylh+"em";
		}
		/*jQuery("#"+this._GID([re, "lineHeight"])).html(mylh);*/
		this.closelhPicker();
	},
	/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
	/* ~~ url ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
	urlPicker: function(command){
		/*this.unbindFocusFrame();*/

		if(this.ulPicker) this.ulPicker.remove();
		var config = this.config;
		var re = config.targetID;
		var lg = AXEditorLang[config.lang];
		var inpID = this._GID([re, command, "input"]);
		var target_blank = this._GID([re, command, "target_blank"]);
		var target_self = this._GID([re, command, "target_self"]);

		var po = [];
		po.push("<div class='me___selecterBox me_url' id='"+this._GID([re, command, "picker"])+"'>");
		po.push("	<div class='me___selecterArrow me_url' style='left:240px;'></div>");
		po.push("	<div class='me___selecterTitle me_url'>"+lg.url+"</div>");
		po.push("	<div class='me___inputUrl me_url'><input type='text' id='"+inpID+"' class='me_url' style='width:280px;'></div>");
		po.push("	<div class='me___inputBtn me_url'>");
		po.push("	<input type='radio' name='"+this._GID([re, command, "target"])+"' id='"+target_blank+"' class='me_url' value='_blank' checked='checked'> _blank");
		po.push("	<input type='radio' name='"+this._GID([re, command, "target"])+"' id='"+target_self+"' class='me_url' value='_self'> _self");
		po.push("	<input type='button' value='OK' class='AXButtonSmall me_url me___inputBtnOK' />");
		po.push("	</div>");
		po.push("</div>");
		this.ulPicker = jQuery(po.join(''));
		var myHeight = 90;
		this.ulPicker.css({width:300, height:myHeight, left:324, top:25});
		jQuery("#"+re+"_headPanel").append(this.ulPicker);

		/* url find */
		this.myRange = new SSelection(this.myEDT);
		this.oSelection = this.myRange.getRangeAt(0);
		var oNode = this.oSelection.commonAncestorContainer;
		while(oNode && oNode.tagName != "A") oNode = DOMfix.DF_parentNode(oNode);
		if(oNode){
			var sTarget = oNode.target;
			if(sTarget && sTarget == "_blank") jQuery("#"+target_blank)[0].checked = true;
			jQuery("#"+inpID).val( oNode.href?oNode.href:"http://" );
		}else{
			jQuery("#"+inpID).val("http://");
		}
		jQuery("#"+inpID).select();

		/*other click observer init*/
		this.clickToCloseUL = this.closeulPicker.bind(this);
    	jQuery(document).bind("click", this.clickToCloseUL);
    	this.keyDownToCloseUL = this.closeulPickerKey.bind(this);
    	jQuery(document).bind("keydown", this.keyDownToCloseUL);
    	/*color select*/
    	this.ulPicker.find(".me___inputBtnOK").bind("click", this.clickul.bind(this, command));
    	/*this.bindFocusFrame();*/
	},
	closeulPicker: function(event){
		if(event){
			if(!jQuery(event.target).hasClass("me_url")){
				if(this.clickToCloseUL) jQuery(document).unbind('click', this.clickToCloseUL);
				if(this.keyDownToCloseUL) jQuery(document).unbind('keydown', this.keyDownToCloseUL);
				if(this.ulPicker) this.ulPicker.remove();
			}
		}else{
			if(this.clickToCloseUL) jQuery(document).unbind('click', this.clickToCloseUL);
			if(this.keyDownToCloseUL) jQuery(document).unbind('keydown', this.keyDownToCloseUL);
			if(this.ulPicker) this.ulPicker.remove();
		}
	},
	closeulPickerKey: function(){
		if(event.keyCode == AXUtil.Event.KEY_ESC){
			if(this.clickToCloseUL) jQuery(document).unbind('click', this.clickToCloseUL);
			if(this.keyDownToCloseUL) jQuery(document).unbind('keydown', this.keyDownToCloseUL);
			if(this.ulPicker) this.ulPicker.remove();
		}
	},
	clickul: function(command, event){
		var config = this.config;
		var re = config.targetID;
		var myEDT = this.myEDT.document;
		var lg = AXEditorLang[config.lang];
		var inpID = this._GID([re, command, "input"]);
		var target_blank = this._GID([re, command, "target_blank"]);
		var target_self = this._GID([re, command, "target_self"]);

		var sURL = jQuery("#"+inpID).val();
		this.myRange.selectRange(this.oSelection);

		if(this._validateURL(sURL)){
			var sTarget = (jQuery("#"+target_blank)[0].checked) ? "_blank" : "_self";
				if(this.oSelection.collapsed){
					this.__pasteHTML("<a href='"+sURL+"' target='"+sTarget+"'>"+sURL+"</a>");
				}else{
					this.__command("CreateLink", false, sURL);
					this.myRange = new SSelection(this.myEDT);
					this.oSelection = this.myRange.getRangeAt(0);
					var oNode = this.oSelection.commonAncestorContainer;
					while(oNode && oNode.tagName != "A") oNode = DOMfix.DF_parentNode(oNode);
					if(oNode) oNode.target = sTarget;
				}
		}else{
			alert(lg.invalidUrlMsg);
		}
		this.closeulPicker();
	},
	_validateURL : function(sURL){
		return /^(http|https|ftp|mailto):(?:\/\/)?((\w|-)+(?:[\.:@](\w|-))+)(?:\/|@)?([^"\?]*?)(?:\?([^\?"]*?))?$/.test(sURL);
	},
	/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
	/* ~~ imoticon ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
	icoPicker: function(command){
		if(this.icPicker) this.icPicker.remove();
		var config = this.config;
		var re = config.targetID;
		var lg = AXEditorLang[config.lang];
		if(this.icoCategoryIndex == undefined) this.icoCategoryIndex = 0;
		var icoCategoryIndex = this.icoCategoryIndex;
		var po = [];
		po.push("<div class='me___selecterBox me_ico' id='"+this._GID([re, command, "picker"])+"'>");
		po.push("	<div class='me___selecterArrow me_ico' style='left:372px;'></div>");
		po.push("	<div class='me___selecterTitleTab me_ico'>");
		po.push("		<div class='me___selecterTitleTabTray me_ico'>");
		jQuery.each(config.AXEditorIcons, function(idx, ca){
			if(icoCategoryIndex == idx)
		po.push("<a href='#AXExec' class='categoryItem me_ico on' id='"+re+"_icoCategory_"+idx+"'>"+ca.categoryNM+"</a>");
			else
		po.push("<a href='#AXExec' class='categoryItem me_ico' id='"+re+"_icoCategory_"+idx+"'>"+ca.categoryNM+"</a>");
		});
		po.push("		</div>");
		po.push("	</div>");
		po.push("	<div class='me___selecterTray me_ico' style='height:120px;' id='"+re+"_icoTray'>");
		var icoFolder = config.AXEditorIcons[icoCategoryIndex].imageFolder;
		jQuery.each(config.AXEditorIcons[icoCategoryIndex].icons, function(index, n){
			po.push("<a href='#AXExex' class='icoItem me_ico'><img src='"+icoFolder+n+"' align='middle' alt='' /></a>");
		});
		po.push("	</div>");
		po.push("	<div class='me___selecterBot me_ico' id='"+re+"_icoBot'>");
		po.push("	"+config.AXEditorIcons[icoCategoryIndex].copyRights);
		po.push("	</div>");
		po.push("</div>");
		this.icPicker = jQuery(po.join(''));

		var myWidth = 396;
		var myHeight = 180;
		this.icPicker.css({width:myWidth, height:myHeight, left:214, top:25});
		jQuery("#"+re+"_headPanel").append(this.icPicker);

		
		/*other click observer init*/
		this.clickToCloseIC = this.closeicPicker.bind(this);
    	jQuery(document).bind("click", this.clickToCloseIC);
    	this.keyDownToCloseIC = this.closeicPickerKey.bind(this);
    	jQuery(document).bind("keydown", this.keyDownToCloseIC);
    	
    	/*select*/
    	this.icPicker.find(".icoItem img").bind("click", this.clickic.bind(this, command));
    	this.icPicker.find(".me___selecterTitleTabTray .categoryItem").bind("click", this.changeCategory.bind(this));
	},
	closeicPicker: function(event){
		if(event){
			if(!jQuery(event.target).hasClass("me_ico")){
				if(this.clickToCloseIC) jQuery(document).unbind('click', this.clickToCloseIC);
				if(this.keyDownToCloseIC) jQuery(document).unbind('keydown', this.keyDownToCloseIC);
				if(this.icPicker) this.icPicker.remove();
			}
		}else{
			if(this.clickToCloseIC) jQuery(document).unbind('click', this.clickToCloseIC);
			if(this.keyDownToCloseIC) jQuery(document).unbind('keydown', this.keyDownToCloseIC);
			if(this.icPicker) this.icPicker.remove();
		}
	},
	closeicPickerKey: function(){
		if(event.keyCode == AXUtil.Event.KEY_ESC){
			if(this.clickToCloseIC) jQuery(document).unbind('click', this.clickToCloseIC);
			if(this.keyDownToCloseIC) jQuery(document).unbind('keydown', this.keyDownToCloseIC);
			if(this.icPicker) this.icPicker.remove();
		}
	},
	clickic: function(command, event){
		var config = this.config;
		var re = config.targetID;
		var myEDT = this.myEDT.document;
		var sHTML = "<img src='"+event.target.src+"' align='middle' alt='' style='vertical-align:middle;' />"
		var oTmpDiv = myEDT.createElement("DIV");
		oTmpDiv.innerHTML = sHTML;
		var myRange = new SSelection(this.myEDT);
		var rng = myRange.getRangeAt(0);
		rng.insertNode(oTmpDiv.lastChild);
		this.closeicPicker();
	},
	changeCategory: function(event){
		var config = this.config;
		var re = config.targetID;
		var idx = event.target.id.split("_").last();
		if(this.icoCategoryIndex != undefined){
			jQuery("#"+re+"_icoCategory_"+this.icoCategoryIndex).removeClass("on");
		}
		this.icoCategoryIndex = idx;
		icoCategoryIndex = idx;
		jQuery("#"+re+"_icoCategory_"+idx).addClass("on");
		
		var po = [];
		var icoFolder = config.AXEditorIcons[icoCategoryIndex].imageFolder;
		jQuery.each(config.AXEditorIcons[icoCategoryIndex].icons, function(index, n){
			po.push("<a href='#AXExex' class='icoItem me_ico'><img src='"+icoFolder+n+"' align='middle' alt='' /></a>");
		});
		jQuery("#"+re+"_icoTray").html(po.join(''));
		this.icPicker.find(".icoItem img").bind("click", this.clickic.bind(this, "imoticon")); 
		jQuery("#"+re+"_icoBot").html(config.AXEditorIcons[icoCategoryIndex].copyRights);
	},
	/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
	onContentMode: function(event){
		var config = this.config;
		if(event.target.id == config.targetID+"_contentMode_0"){
			if(this.contentMode != "editor"){
				this.contentMode = "editor";
				jQuery("#"+config.targetID+"_contentMode_0").addClass("me____tabOn");
				jQuery("#"+config.targetID+"_contentMode_1").removeClass("me____tabOn");
				this.setHtmlMode("off");
			}
		}else{
			if(this.contentMode != "html"){
				this.contentMode = "html";
				jQuery("#"+config.targetID+"_contentMode_0").removeClass("me____tabOn");
				jQuery("#"+config.targetID+"_contentMode_1").addClass("me____tabOn");
				this.setHtmlMode("on");
			}
		}
		/*goto home*/
		/*this.onHeadClick("home");*/
	},
	/* ~~ get&set content ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
	__getContent: function(){
		var myEDT = this.myEDT.document;
		return myEDT.body.innerHTML;
	},
	getContentCheck: function(){
		var myEDT = this.myEDT.document;
		var editorContent = "";
		if(this.contentMode == "editor"){
			editorContent = myEDT.body.innerHTML;
		}else{
			editorContent = this.htmlArea.val();
		}
		
		if (editorContent.trim() != ""){
			return true;
		}else{
			return false;
		}
		
	},
	
	getContent: function(){
		var myEDT = this.myEDT.document;
		var ff = myEDT.body.style.fontFamily;
		var fs = myEDT.body.style.fontSize;
		var cl = myEDT.body.style.color;
		var bc = myEDT.body.style.backgroundColor;
		var lh = myEDT.body.style.lineHeight;

		if(lh == ""){
			lh = "1.5em";	
		}

		var sts = [];
		if(ff) sts.push("font-family:"+ff);
		if(fs) sts.push("font-size:"+fs);
		if(cl) sts.push("color:"+cl);
		if(bc) sts.push("background-color:"+bc);
		if(lh) sts.push("line-height:"+lh);

		if(this.contentMode == "editor"){
			return "<div class='AXEditorContentBody' style='"+sts.join(";")+";'>"+myEDT.body.innerHTML+"</div>";
		}else{
			return "<div class='AXEditorContentBody' style='"+sts.join(";")+";'>"+this.htmlArea.val()+"</div>";
		}
	},
	setContent: function(content){
		var myEDT = this.myEDT.document;
		if(typeof content == "string"){
			if(content == "") content = "<p></p>";
			myEDT.body.innerHTML = content;
		}else{
			var myBody = content.find(".AXEditorContentBody");
			if(myBody.html() == null){
				jQuery(myEDT.body).html(content.html());
			}else{
				content.children().each(function(){
					if(!jQuery(this).hasClass("AXEditorContentBody")){
						myBody.prepend(this);
					}
				});
				jQuery(myEDT.body).html(myBody.html());
				jQuery(myEDT.body).css({"font-family":myBody.css("fontFamily")});
				jQuery(myEDT.body).css({"font-size":myBody.css("fontSize")});
				jQuery(myEDT.body).css({"color":myBody.css("color")});
				jQuery(myEDT.body).css({"background-color":myBody.css("backgroundColor")});
				jQuery(myEDT.body).css({"line-height":myBody.css("lineHeight")});
			}
		}
	},
	getFileList: function(){
		return this.attchFiles;
	},
	setFileList: function(files){
		this.attchFiles = files;
		this.updateFileStatus();
	},
	/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
	nothing: function(){}
});