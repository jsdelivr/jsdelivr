YUI.add('gallery-lazyloadimages', function(Y) {

var LazyloadImages = {
   /**
    * Fetches the Images for the img tags with attribute data-src immediately,
    * should be used when calling this module on after loading the page.
    *
    * @param {String} selecter is the context selecter for the img tag to be lazy loaded
	* @param {String} attrName is the custom attribute name, if not provided will use data-src
    *
    */
   processnow: function(selecter,attrName) {
	var attr, imgselecter;
	attr = (attrName)?attrName:"data-src";
	imgselecter = "img["+attr+"]";
	imgselecter=(selecter)?selecter+" "+imgselecter:imgselecter;
	
	//Find all the images matching the selector and replace the custom attribute with src
	Y.all(imgselecter).each(function (el, i) {
		var url = el.getAttribute(attr);
		if(url){
			el.setAttribute('src', url);
			el.removeAttribute(attr);
		}
	});	
   },
   
   /**
    * Fetches the Images for the img tags with attribute data-src immediately,
    * should be used when calling this module on after loading the page.
    *
    * @param {String} selecter is the context selecter for the img tag to be lazy loaded
	* @param {String} attrName is the custom attribute name, if not provided will use data-src
    *
    */
   processAfterLoad: function(selecter,attrName){
	Y.on("domready", LazyloadImages.processnow(selecter,attrName));
   }
};

// Alias it on YUI instance.
Y.LazyloadImages = LazyloadImages;


}, 'gallery-2011.05.12-13-26' ,{requires:['node'], skinnable:false});
