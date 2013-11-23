/**
 * jQuery imageMask
 * @author Almog Baku - almog.baku@gmail.com
 * @see https://github.com/AlmogBaku/imageMask
 *
 * @version 0.1.6
 * @license MIT License
 */
(function(d){var n=0;d.fn.imageMask=function(e,j){if(void 0==e)return console.error("imageMask: undefined mask"),!1;if(!this.is("img"))return console.error("imageMask: jQuery object MUST be an img element"),!1;if(void 0!=j&&!d.isFunction(j))return console.error("imageMask: callback MUST be function"),!1;var c=null;e.src?c=e:(c=new Image,c.src=e);var k=this;k.css("visibility","hidden");d(c).load(function(){var e=null;k.each(function(){var k=d(this),f=null,a,l=c;a=d(this);var m;m=a.attr("id")?a.attr("id"): n++;m="imageMask_"+m+"_canvas";var f=d("<canvas>").attr({id:m,"class":a.attr("class"),style:a.attr("style"),width:l.width,height:l.height}).css("visibility","").insertAfter(a)[0],g=f.getContext("2d");null==e&&(a=f,g.drawImage(c,0,0),l=g.getImageData(0,0,a.width,a.height),g.clearRect(0,0,a.width,a.height),e=l);var b=new Image;b.src=d(this).attr("src");d(b).load(function(){var a=1,a=b.width>b.height?f.height/b.height:f.width/b.width;g.drawImage(b,0,0,b.width,b.height,0,0,b.width*a,b.height*a);for(var a= e,c=g.getImageData(0,0,f.width,f.height),h=0;h<c.data.length;h+=4)c.data[h+3]=a.data[h+3];g.putImageData(c,0,0);k.remove();d.isFunction(j)&&j(f)})})});return this}})(jQuery);