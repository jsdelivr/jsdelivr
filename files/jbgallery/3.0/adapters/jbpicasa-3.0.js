/***
 * 
 * jbgallery picasa adapter
 * 
 * $Date: 2010-12-19 19:03:40 +0100 (dom, 19 dic 2010) $
 * $Revision: 33 $
 * $Author: massimiliano.balestrieri $
 * $HeadURL: https://jbgallery.googlecode.com/svn/trunk/adapters/jbpicasa-3.0.js $
 * $Id: jbpicasa-3.0.js 33 2010-12-19 18:03:40Z massimiliano.balestrieri $
 *
 * @requires jQuery v1.3.2
 * @requires jbgallery 
 * 
 * Copyright (c) 2009 Massimiliano Balestrieri
 * Examples and docs at: http://maxb.net/blog/
 * Licensed GPL licenses:
 * http://www.gnu.org/licenses/gpl.html
 *
 */
 
;(function($){
	
jBGallery.Adapters.Picasa = function(options){
	
	return this.each(function(){
		
		var that = this;
		var _jbg;
		var _n_albums = options.albums;
		var _account =  options.account;
		var _filter_album = options.filter;
		var _url = 'http://picasaweb.google.com/data/feed/base/user/'+ _account +'?kind=album&alt=rss&hl=en_US&access=public&max-results=' + _n_albums;
		$.getJSON(
			"http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D'"+
				encodeURIComponent(_url)+
			"'&format=json&callback=?",
			  function(data){
			  	  var _html = '';
			  	  var _x = 0;
				  var _init = false;
				  var _tot = data.query.results.item.length;	
			      $.each(data.query.results.item, function(i,d){
					var _u = d.content || d.guid.content;
					var _u2 = _u.replace("entry", "feed") + '&kind=photo';
					var _idalbum = d.link;
					var _last = _tot == (i + 1);
					if (_filter_album) {
						if (_idalbum.indexOf(_filter_album) === -1) 
							return;
						else 
							_last = true;
					}
					$.getJSON(
						"http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D'"+
							encodeURIComponent(_u2)+
						"'&format=json&callback=?",
						  function(data){
						  	var _images = [];
						  	$.each(data.query.results.item, function(i,d){
								//appendo la PRIMA IMMAGINE
								if (!_init && i == 0) {
									$(that).append("<ul />");
									_init = true;
									//test : d.enclosure.url | $(d.description).find("img").attr("src") | (_x + 1)
									var _img = '<img src="' + $(d.description).find("img").attr("src") + '" alt="" />';
									_html += '<li><a href="' + d.enclosure.url + '" title="">' + _img + '</a><div class="caption">' + d.description + '</div></li>';//i scorretto
									$('ul', that).append(_html);
	                                _jbg = $(that).jbgallery(options, true);
									_x++;
								}else{
									//PUSH
									_images.push({
		                                href: d.enclosure.url,
		                                caption: d.description,
		                                thumb : $(d.description).find("img").attr("src")
		                            });
									if ((i + 1) == data.query.results.item.length) {
                                        _jbg.push(_images);//_jbg.push(_images);
		                            }
								}
							});
					});
				  });
			  }
		);
		
	});
};

$.fn.jbpicasa = jBGallery.Adapters.Picasa;

})(jQuery);