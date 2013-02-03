(function($){
	$.extend({
		kickIE : function(options){
			var _cookie=("cookie" in $);
			if (_cookie && $.cookie("kick_browser_once")=="true") return;

			var opts=$.extend({
				title:''
				,description:''
				,autoOpen:true
				,closeable:true
				,once:false 
				,supported_b:{
					chrome	:{ version:3, page:'http://www.google.com/chrome'}
					,firefox:{ version:3, page:'http://www.mozilla.org/tr/firefox/new/'}
					,opera	:{ version:9.5, page:'http://www.opera.com/download/'}
					,safari	:{ version:3, page:'http://www.apple.com/safari/download/'}
					,ie 	:{ version:8, page:'http://windows.microsoft.com/en-US/internet-explorer/downloads/ie-9/worldwide-languages'}
				}
			},options);

			opts.type='ie';
			var browser_det=opts.supported_b[opts.type]
				,min_version=("olderThan" in opts)?opts.olderThan:browser_det.version
				

			
			if (opts.supported_b.ie.version < min_version) opts.supported_b.ie.version=min_version;

			//Create browser warning box
			var $el=$("<div/>").attr("id","obw").append(
					$("<div/>").addClass("content-con")
						.append($("<div/>",{ 
							"class":"obw-title"
							,"html":opts.title
						}))
						.append($("<div/>",{
							"class":"obw-desc"
							,"html":opts.description
						}))
						.append($("<div/>").addClass("obw-browser-con"))
				).appendTo("body");

			//Add close button
			if (opts.closeable){
				$("<i/>",{
					"class":"close-btn"
				}).appendTo($el.children(".content-con"))
				.click(function(){
					if ( _cookie ) $.cookie("kick_browser_once",opts.once);
					$el.remove();
				});
			}
			
			//Add browser icons
			$.each(opts.supported_b,function(key,item){
				$("<a/>",{
					"href":item.page
					,"class":'obw-brwsr-item brwsr-'+key+'-item'
					,"target":"_blank"
				})
				.append($("<i/>"))
				.append(
					$("<div/>",{
						"class":"brwsr-type-text"
					}).append($("<span/>",{
						text:key.split("")[0].toUpperCase() + key.slice(1)+' '+opts.supported_b[key].version+' +'
					}))
				).appendTo(".obw-browser-con");
			});
				
			//If browser internet explorer, kick it :)
			if ('msie' in $.browser){
				
				if ($.browser.version<min_version){
					$el.children(".content-con").css({
						left:($(window).width() - $el.children(".content-con").outerWidth())/2
						,top:($(window).height() - $el.children(".content-con").outerHeight())/2
					});
					$el.show();
				}
			}
		}
	});
	
})(jQuery);