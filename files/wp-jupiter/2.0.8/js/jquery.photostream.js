(function($){
    $.fn.extend({
        photostream_widget: function(options) {
 
            var defaults = {
                user: 'artbees',
                limit: 10,
				social_network: 'instagram'
				
            };
            
			
					function create_html(data, container, columns, shape) {
				var feeds = data.feed;
				if (!feeds) {
					return false;
				}
				var html = '';
				
					html += '<ul>'
					
				for (var i = 0; i < feeds.entries.length; i++) {
					var entry = feeds.entries[i];
					var content = entry.content;
					html += '<li>'+ content +'<div class="clearboth"></div></li>'
							 
				}
					
				html += '</ul>';
				container.removeClass("photostream");	
				container.html(html);
				container.find("li").each(function(){
					pin_img_src = $(this).find("img").attr("src");
					pin_img_src = pin_img_src.replace("_b.jpg", "_c.jpg")
					pin_url = "http://www.pinterest.com" + $(this).find("a").attr("href");
					pin_desc = $(this).find("p:nth-child(2)").html();
														
					pin_desc = pin_desc.replace("'", "`");
					$(this).empty();
					$(this).append('<div class="pinterest-widget-img"><img src="' + pin_img_src + '" alt="'+ pin_desc +'"><div class="pinterest-item-overlay"><a target="_blank" href="' + pin_url + '" class="pinterest-widget-permalink"></a><a href="' + pin_img_src + '" class="mk-pinterest-lightbox pinterest-widget-zoom" rel="'+container.attr("id")+'"></a></div></div>');
					$(this).append("<a class='pinterest-widget-title' target='_blank' href='" + pin_url + "' title='" + pin_desc + "'>"+ pin_desc + "</a>");
	

				});



			};

            var options = $.extend(defaults, options);
         
            return this.each(function() {
                  var o = options;
                  var obj = $(this); 
				  
				  if (o.social_network == "instagram") { 
						obj.append("<ul></ul>")
						var token = "15317038.22c41e6.6c58236d21254b12a6de0a9c4ebd6787";					
						url =  "https://api.instagram.com/v1/users/search?q=" + o.user + "&access_token=" + token + "&count=10&callback=?";
						$.getJSON(url, function(data){
							$.each(data.data, function(i,shot){
								  var instagram_username = shot.username;

								  if (instagram_username == o.user){

									  var user_id = shot.id;

									if (user_id != ""){	
										url =  "https://api.instagram.com/v1/users/" + user_id + "/media/recent/?access_token=" + token + "&count=" + o.limit + "&callback=?";
										$.getJSON(url, function(data){

											$.each(data.data, function(i,shot){
																   
											  var img_src = shot.images.thumbnail.url;
											  
											  var img_url = shot.link;
											  var img_title = "";
											  if (shot.caption != null){
											  img_title = shot.caption.text;
											  }
											  var image = $('<img/>').attr({src: img_src, alt: img_title});
											  var url = $('<a/>').attr({href: img_url, target: '_blank', title: img_title});
											  var url2 = $(url).append(image);
											  var li = $('<li/>').append(url2);
											  $("ul", obj).append(li);
						
											});
										});
									}   
								  }
							});
						});					

				  }
				  
				  
            });
        }
    });
})(jQuery);
