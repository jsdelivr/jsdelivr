YUI.add('gallery-spotlight', function(Y) {

function Spotlight(conf) {
	Spotlight.superclass.constructor.apply(this, arguments);
}
Spotlight.NAME = "Spotlight";
Spotlight.ATTRS = {
	data : {}, // Mandatory - Should be JSON.
	liTplId: {},//Optional, if not provided will use the default template at liTpl
	contentTplId: {}, // Optional, if not provided will use the default template at conTpl
	containerId: {}, // Mandatory 
	numVisible:3,// Optional
	height: 200,// Optional
	width: 300
};
Y.extend(Spotlight, Y.Base, {
	/**
    * Returns the innerHtml of the given htmlid
    *
    * @param {String} htmlid of the element whose innerHtml need to be fetched.
	*
    */
	getHtml : function (htmlid) {
		var html, htmlNode;
		if(htmlid){
			htmlNode = Y.one("#"+htmlid);
			if(htmlNode){
				html = htmlNode.get("innerHTML");
			}
		}
		return html;
	},
	/**
    * Function which build the html from data and template and appends it to the container
    *
    * @param {String} tpl html template String
	* @param {String} conId ContainerId to which the built html should be appended.
	* @param {String} data JSON data
	*
    */
	templatize : function (tpl, conId, data) {
		var self = this, content = '', conNode;
		conNode =  Y.one("#" + conId);

		if(data && data instanceof Array){
			Y.each(data, function (i) {
				content += Y.substitute(tpl, i);
			}, this);
		}
		else{
			content += Y.substitute(tpl, data);
		}
		if(conNode){
			conNode.set('innerHTML', content);
			Y.LazyloadImages.processnow("#"+conId);		
		}	
	},
	/**
	*
    * Registers the Carousel used in the spotlight and sets up the Event handling
    *
    */
	register : function () {
		var self = this, contId, carcontId, spotNode, carousel, data, olheight, conHtml;
		contId = self.get('containerId');
		carcontId = contId + "-carousel";
		spotNode = Y.one("#" + contId + "-content");
		data = self.get('data');
		
		conHtml = self.getHtml(self.get('contentTplId'));
		conHtml = (conHtml)?conHtml:self.conTpl;
		
		carousel = new Y.Carousel({ 
			boundingBox: "#" + carcontId,
			contentBox: "#" + carcontId + " > ol",
			animation: {speed: 0.5},
			numVisible: self.get('numVisible'),
			isVertical: false,
			height: self.get('height'),
			width: self.get('width')
		});
		carousel.on("itemSelected", function (index) {
			var itemdata;
			itemdata = data[index.pos];
			if(itemdata && conHtml){
				self.templatize(conHtml, contId + "-content", itemdata);
			}
		});
		olheight = self.get('height')-40+"px";
		carousel.render();
		Y.one("#" + contId + "-ol").setStyle("height",olheight);
		carousel.scrollTo(1);
		carousel.scrollTo(0);
	},
	/**
    * Builds the neccessary empty DOM's for Spotlight
    *
    * @param {String} Container Id of the Spotlight
	*
    */
	buildSkeleton : function(contId){
		var self = this, data = {}, skeleton, conNode;
		conNode = Y.one("#"+contId);
		data.containerId = contId;
		skeleton = Y.substitute(self.tpl,data);
		if(conNode){
			conNode.set("innerHTML",skeleton);
		}	
	},
	/**
    * Builds the Thumbnails (list of small version of the images) for the Carousel
    *
    * @param {String} Container Id of the Spotlight
	*
    */
	buildThumbnails : function (contId){
		var self = this, liHtml;
		liHtml = self.getHtml(self.get('liTplId'));
		liHtml = (liHtml)?liHtml:self.liTpl;
		liHtml = "<li>" + liHtml + "</li>";
		self.templatize(liHtml, contId+"-ol",self.get('data'));
	},
	/**
	* The Main Function to be executed on the Spotlight instance, will do everything needed.
	*/
	process : function () {
		var self = this, contId, data;
		contId = self.get('containerId');
		data = self.get('data');
		if(!contId || !data){ 
			// These two are mandatory inputs if not provided dont do anything return back.
			return;
		}
		self.buildSkeleton(contId);
		self.buildThumbnails(contId);
		self.register();
	},
	/**
	* The Template for basic skeleton of the carousel.
	*/
	tpl : "<div class=\"spotlight\"><div id=\"{containerId}-carousel\" class=\"yui3-carousel yui3-carousel-horizontal\">" + 
		"<ol id=\"{containerId}-ol\"></ol></div>" + "<div id=\"{containerId}-content\"></div>" + 
		"<div id=\"{containerId}-hiddencontent\" style=\"dislay:none\"></div></div>",
	
	/**
	* The default template for the thumbnail. it can be overwritten using the input attribute
	*/
	liTpl: "<div class=\"arrow\"><img data-src=\"{photo}\" class=\"thumbnail\" title=\"{title}\" alt=\"{title}\"><p class=\"title\">{title}</p></div>",
	
	/**
	* The default template for the spotlight content. it can be overwritten using the input attribute
	*/
	conTpl:"<div class=\"spot-content\"><img data-src=\"{photo}\"/></div>"
});

Y.Spotlight = Spotlight;


}, 'gallery-2011.05.12-13-26' ,{requires:['gallery-carousel', 'gallery-carousel-anim', 'substitute', 'gallery-lazyloadimages'], skinnable:true});
