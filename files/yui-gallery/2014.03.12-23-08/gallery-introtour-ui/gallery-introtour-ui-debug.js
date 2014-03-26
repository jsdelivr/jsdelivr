YUI.add('gallery-introtour-ui', function (Y, NAME) {

/*******************************************/
/*
YUI Gallery Intro Tour module
Set up step by step intro tours on your page.
Usage:
	YUI().use("gallery-introtour-ui",function(Y){
		var tour_cards = [{'title':'Welcome','position':'pagecenter','content':},
							{'title':'Click here to start','target':'#clickhere','position':'right','width':'30'},
							{'title':'Next click here to cont..','target':'#continue','position':'top',height:'20'},
							{'title':'That's it!','position':'pagecenter'}];
		Y.Introtour.init(tour_cards);
	});

IMPORTANT:
1. The div ID you pass cannot be hidden at the time of calling the init function.
2. The div ID you pass needs to have an ancestor which has position:relative.
*/
/*******************************************/
YUI.add('gallery-introtour-ui', function(Y) {
	Y.namespace('Introtour');
	var privateVars={},
	findpos = function (obj){
		var curleft =0,
		curtop = 0;
			if (obj.offsetParent) {
				do {
					curleft += obj.offsetLeft;
					curtop += obj.offsetTop;
				} while (obj == obj.offsetParent);
			}
		return [curleft,curtop];
	},
	ATTRS = {
		'cardstyle':{'button':'#61399d','buttontext':'#000','title':'#fff','content':'#fff','cardborder':'#61399d'},
		'carddimension':{'height':'300px','width':'300px'},
		'initcardpos':{'marginleft':'-150px'},
		'buttonwelcome':{'content':'Start Tour','buttonid':'yui-galleryintrotourui-buttonwelcome-id'},
		'buttontourend':{'content':'Close','buttonid':'yui-galleryintrotourui-buttontourend-id'},
		'buttonnav':{'content':'Next','buttonid':'yui-galleryintrotourui-buttonnav-'}
		
	},
	setcardstyle = function(cardstyle){
		if(!cardstyle){
			cardstyle = ATTRS.cardstyle;
		}else{
			var defAttrs = ATTRS.cardstyle;
			if(!cardstyle.button){cardstyle.button = defAttrs.button;}
			if(!cardstyle.buttontext){cardstyle.buttontext = defAttrs.buttontext;}
			if(!cardstyle.title){cardstyle.title = defAttrs.title;}
			if(!cardstyle.content){cardstyle.content = defAttrs.content;}
			if(!cardstyle.cardborder){cardstyle.border = defAttrs.border;}
		}
		return cardstyle;
	},
	slideTemplate = function(ci,button,seqid,index){
		var buttonid = button.buttonid,
		html = "",
		arrowclass = "";
		if(!ci.title){ci.title="";}
		if(!ci.content){ci.content="";}
		if(index > 0){buttonid = buttonid+index;}
		if(ci.position === "right"){arrowclass="right";}
		else if(ci.position === "left"){arrowclass="left";}
		else if(ci.position === "top"){arrowclass="top";}
		else if(ci.position === "bottom"){arrowclass="bottom";}
		if(arrowclass){html = "<div class='yui-galleryintrotourui-card-arrow "+arrowclass+"'></div>";}
		html += "<div class='yui-galleryintrotourui-card-container'>"+
						"<div class='yui-galleryintrotourui-card-closebutton'>x</div><div class='yui-galleryintrotourui-clearfix'></div>"+
						"<div class='yui-galleryintrotourui-card-text'>"+
							"<div class='yui-galleyintroui-card-title'>"+ci.title+"</div>"+
							"<div class='yui-galleryintrotourui-card-content'>"+ci.content+"</div>"+
						"</div>"+
						"<div class='yui-galleryintrotourui-card-nav'>"+
							"<button data-seqid='"+seqid+"' id='"+buttonid+"' class='yui-galleryintrotourui-card-next yui3-button notice'>"+button.content+"</button>"+
						"</div>"+
					"</div>";
		return html;
	},
	generateSlideDom = function(toppos,leftpos,ci,id,type,seqid,index){
		var button = {},
		html;
		if(!type){button = ATTRS.buttonnav;}
		else if(type === "welcome"){button=ATTRS.buttonwelcome;seqid="welcome";}
		else if(type === "end"){button=ATTRS.buttontourend;seqid="end";}
		html = slideTemplate(ci,button,seqid,index),
		node = new Y.Node(document.createElement('div'));
		node.addClass('yui-galleryintrotourui-card');
		node.setAttribute('id',id);
		node.setStyle('width',ATTRS.carddimension.width);
		node.setStyle('top',toppos);
		node.setStyle('left',leftpos);
		node.set('innerHTML',html);
		if(type === "welcome" || type === "end"){
			node.setStyle("marginLeft",ATTRS.initcardpos.marginleft);
		}
		Y.one('body').appendChild(node);
	},
	getCardPos = function(ci,pos){
		var toppos = 0,
		leftpos = 0;
		if((ci.position === 'left' || ci.position === 'right') && ci.width === 'undefined'){
			ci.width = 0;
		}
		if((ci.position === 'top' || ci.position === 'bottom') && ci.height === 'undefined'){
			ci.width = 0;
		}
		pos[0] = parseInt(pos[0],10);
		pos[1] = parseInt(pos[1],10);
		ci.width = parseInt(ci.width,10);
		ci.height = parseInt(ci.height,10);
		switch(ci.position){
			case "right":
				toppos = pos[1];
				leftpos = pos[0]+ci.width;
			break;
			case "left":
				toppos = pos[1];
				leftpos = pos[0]-ci.width-300;
			break;
			case "top":
				toppos = pos[1]-ci.height;
				leftpos = pos[0];
			break;
			case "bottom":
				toppos = pos[1]+ci.height;
				leftpos = pos[0];
			break;
			default:
				toppos = pos[1];
				leftpos = pos[0]+50;
			break;
		}
		pos[1] = toppos;
		pos[0] = leftpos;
		return pos;
	},
	closeIntro = function(){
		document.activeElement.blur();
		window.scrollTo(privateVars.hscroll,privateVars.vscroll);
		Y.all(".yui-galleryintrotourui-card").setStyle("display","none");
		privateVars.prevActiveElement.focus();
	};
	Y.Introtour.init = function(cardinfo,cardstyle){
		privateVars.hscroll = (document.all ? document.scrollLeft : window.pageXOffset),
		privateVars.vscroll = (document.all ? document.scrollTop : window.pageYOffset);
		privateVars.prevActiveElement = document.activeElement;

		cardstyle = setcardstyle(cardstyle);
		generateSlideDom("60px","50%",cardinfo[0],'galleryintrotourui-card-welcome','welcome',0);
		for(var i=1;i<cardinfo.length;i++){
			var ci = cardinfo[i],
			elem = document.getElementById(ci.target),
			pos,
			index=i;
			if(elem){
				pos = findpos(elem),
				id='galleryintrotourui-card-'+i;
				pos = getCardPos(ci,pos);
				pos[1] = pos[1]+"px";
				pos[0] = pos[0]+"px";
				if(i===cardinfo.length-2){i="end";}
				generateSlideDom(pos[1],pos[0],ci,id,'',i,index);
			}
		}
		generateSlideDom("60px","50%",cardinfo[cardinfo.length-1],'galleryintrotourui-card-endtour','end',0);
		window.scrollTo(0,0);
		Y.one('#galleryintrotourui-card-welcome').setStyle('display','block');
		Y.one("#yui-galleryintrotourui-buttonwelcome-id").focus();
		Y.on("click",function(){
			var seqid = this.getAttribute("data-seqid"),
			carddivid = "",
			buttondivid = "";//"#yui-galleryintrotourui-buttonnav-"+seqid;
			this.blur();
			Y.all(".yui-galleryintrotourui-card").setStyle("display","none");
			if(seqid === "welcome"){
				carddivid = "#galleryintrotourui-card-1";
				buttondivid = "#yui-galleryintrotourui-buttonnav-1";
			}else if(seqid === "end"){
				carddivid = "#galleryintrotourui-card-endtour";
				buttondivid = "#yui-galleryintrotourui-buttontourend-id";
			}else{
				seqid++;
				carddivid = '#galleryintrotourui-card-'+seqid;
				buttondivid = '#yui-galleryintrotourui-buttonnav-'+seqid;
			}
			if(this.getAttribute("id") === "yui-galleryintrotourui-buttontourend-id"){
				Y.all(".yui-galleryintrotourui-card").setStyle("display","none");
			}else{
				Y.one(carddivid).setStyle('display','block');
				Y.one(buttondivid).focus();
				if(seqid !== "end"){
					var toppos = Y.one(carddivid).getStyle('top'),
					leftpos = Y.one(carddivid).getStyle('left');
					toppos = toppos.split("px");
					leftpos = leftpos.split("px");
					window.scrollTo(leftpos[0],toppos[0]);
				}else{
					window.scrollTo(0,0);
				}
			}
		},".yui-galleryintrotourui-card-next");
		Y.on("click",closeIntro,".yui-galleryintrotourui-card-closebutton");
		Y.one('body').on('key',closeIntro,'esc');
	};
}, '0.1.1',{requires: ['node','event']});


}, 'gallery-2013.10.14-07-00', {"use": ["yui-base", "yui3", "node", "event"], "requires": ["yui-base"]});
