/* 
Justified Gallery
Version: 1.0.3
Author: Miro Mannino
Author URI: http://miromannino.it

Copyright 2012 Miro Mannino (miro.mannino@gmail.com)

This file is part of Justified Gallery.

This work is licensed under the Creative Commons Attribution 3.0 Unported License. 

To view a copy of this license, visit http://creativecommons.org/licenses/by/3.0/ 
or send a letter to Creative Commons, 444 Castro Street, Suite 900, Mountain View, California, 94041, USA.
*/

__justifiedGallery_galleryID = 0;

(function($){
 
   $.fn.justifiedGallery = function(options){

		var settings = $.extend( {
			'sizeSuffixes' : {'lt100':'_t', 'lt240':'_m', 'lt320':'_n', 'lt500':'', 'lt640':'_z', 'lt1024':'_b'},
			'usedSuffix' : 'lt240',
			'justifyLastRow' : true,
			'rowHeight' : 120,
			'fixedHeight' : false,
			'lightbox' : false,
			'captions' : true,
			'margins' : 1,
			'extension' : '.jpg',
			'refreshTime' : 500
		}, options);

		function getErrorHtml(message, classOfError){
			return "<div class=\"" + classOfError + "\"style=\"font-size: 12px; border: 1px solid red; background-color: #faa; margin: 10px 0px 10px 0px; padding: 5px 0px 5px 5px;\">" + message + "</div>";
		}

		return this.each(function(index, cont){
			$(cont).addClass("justifiedGallery");

			var loaded = 0;
			var images = new Array($(cont).find("img").length);

			__justifiedGallery_galleryID++;

			if(images.length == 0) return;
			
			$(cont).append("<div class=\"jg-loading\"><div class=\"jg-loading-img\"></div></div>");

			$(cont).find("a").each(function(index, entry){
				var img = $(entry).find("img");

				images[index] = new Array(5);
				images[index]["src"] = $(img).attr("src");
				images[index]["alt"] = $(img).attr("alt");
				images[index]["href"] = $(entry).attr("href");
				images[index]["title"] = $(entry).attr("title");
				images[index]["rel"] = "lightbox[gallery-" + __justifiedGallery_galleryID + "]";
				
				$(entry).remove(); //remove de image, we have its data
				
				var img = new Image();
  
				$(img).load(function() {
					if(images[index]["height"] != settings.rowHeight)
						images[index]["width"] = Math.ceil(this.width / (this.height / settings.rowHeight));
					else
						images[index]["width"] = this.width;
					images[index]["height"] = settings.rowHeight;
					images[index]["src"] = images[index]["src"].slice(0, images[index]["src"].length 
										 - (settings.sizeSuffixes[settings.usedSuffix] + settings.extension).length);
		    		if(++loaded == images.length) startProcess(cont, images, settings);
				});
				
				$(img).error(function() {
					$(cont).prepend(getErrorHtml("The image can't be loaded: \"" + images[index]["src"] +"\"", "jg-usedPrefixImageNotFound"));
					images[index] = null;
					if(++loaded == images.length) startProcess(cont, images, settings);
				});
				
				$(img).attr('src', images[index]["src"]);
				
			});
		});
		
		function startProcess(cont, images, settings){
			//FadeOut the loading image and FadeIn the images after their loading
			$(cont).find(".jg-loading").fadeOut(500, function(){
				$(this).remove(); //remove the loading image
				processesImages($, cont, images, 0, settings);
			});
		}

		function buildImage(image, suffix, nw, nh, l, minRowHeight, settings){
			var ris;
			ris =  "<div class=\"jg-image\" style=\"left:" + l + "px\">";
			ris += " <a href=\"" + image["href"] + "\" ";

			if(settings.lightbox == true)
				ris += "rel=\"" + image["rel"] + "\"";
			else
				ris +=     "target=\"_blank\"";

			ris +=     "title=\"" + image["title"] + "\">";
			ris += "  <img alt=\"" + image["alt"] + "\" src=\"" + image["src"] + suffix + settings.extension + "\"";
			ris +=        "style=\"width: " + nw + "px; height: " + nh + "px;\">";
			
			if(settings.captions)
				ris += "  <div style=\"bottom:" + (nh - minRowHeight) + "px;\" class=\"jg-image-label\">" + image["alt"] + "</div>";

			ris += " </a></div>";
			return ris;
		}

		function buildContRow(row, images, extraW, settings){
			var j, l = 0;
			var minRowHeight;
			for(var j = 0; j < row.length; j++){
				row[j]["nh"] = Math.ceil(images[row[j]["indx"]]["height"] * 
					            ((images[row[j]["indx"]]["width"] + extraW) / 
							 	images[row[j]["indx"]]["width"]));
				
				row[j]["nw"] = images[row[j]["indx"]]["width"] + extraW;

				row[j]["suffix"] = getSuffix(row[j]["nw"], row[j]["nh"], settings);

				row[j]["l"] = l;

				if(!settings.fixedHeight){
					if(j == 0) 
						minRowHeight = row[j]["nh"];
					else
						if(minRowHeight > row[j]["nh"]) minRowHeight = row[j]["nh"];
				}
				 
				l += row[j]["nw"] + settings.margins;
			}

			if(settings.fixedHeight) minRowHeight = settings.rowHeight;
			
			var rowCont = "";
			for(var j = 0; j < row.length; j++){
				rowCont += buildImage(images[row[j]["indx"]], row[j]["suffix"], 
					                  row[j]["nw"], row[j]["nh"], row[j]["l"], minRowHeight, settings);
			}
			
			return "<div class=\"jg-row\" style=\"height: " + minRowHeight + "px; margin-bottom:" + settings.margins + "px;\">" + rowCont + "</div>";
		}

		function getSuffix(nw, nh, settings){
			var n;
			if(nw > nh) n = nw; else n = nh;
			if(n <= 100){
				return settings.sizeSuffixes.lt100; //thumbnail (longest side:100)
			}else if(n <= 240){
				return settings.sizeSuffixes.lt240; //small (longest side:240)
			}else if(n <= 320){
				return settings.sizeSuffixes.lt320; //small (longest side:320)
			}else if(n <= 500){
				return settings.sizeSuffixes.lt500; //small (longest side:320)
			}else if(n <= 640){
				return settings.sizeSuffixes.lt640; //medium (longest side:640)
			}else{
				return settings.sizeSuffixes.lt1024; //large (longest side:1024)
			}
		}

		function processesImages($, cont, images, lastRowWidth, settings){	
			var row = new Array();
			var row_i, i;
			var partialRowWidth = 0;
			var extraW;
			var rowWidth = $(cont).width();

			for(i = 0, row_i = 0; i < images.length; i++){
				if(images[i] == null) continue;
				if(partialRowWidth + images[i]["width"] + settings.margins <= rowWidth){
					//we can add the image
					partialRowWidth += images[i]["width"] + settings.margins;
					row[row_i] = new Array(5);
					row[row_i]["indx"] = i;
					row_i++;
				}else{
					//the row is full
					extraW = Math.ceil((rowWidth - partialRowWidth + 1) / row.length); 
					$(cont).append(buildContRow(row, images, extraW, settings));

					row = new Array();
					row[0] = new Array(5);
					row[0]["indx"] = i;
					row_i = 1;
					partialRowWidth = images[i]["width"] + settings.margins;
				}
			}

			//last row----------------------
			//now we have all the images index loaded in the row arra
			if(settings.justifyLastRow){
				extraW = Math.ceil((rowWidth - partialRowWidth + 1) / row.length);	
			}else{
				extraW = 0;
			}
			$(cont).append(buildContRow(row, images, extraW, settings));
			//---------------------------

			//lightbox-------------------
			if(settings.lightbox){
				try{
					$(cont).find(".jg-image a").colorbox({maxWidth:"80%",maxHeight:"80%",opacity:0.8,transition:"elastic", current:""});
				}catch(e){
					$(cont).html(getErrorHtml("No Colorbox founded!", "jg-noColorbox"));
				}
			}

			//Captions---------------------
			if(settings.captions){
				$(cont).find(".jg-image").mouseenter(function(sender){
					$(sender.currentTarget).find(".jg-image-label").stop();
					$(sender.currentTarget).find(".jg-image-label").fadeTo(500, 0.7);
				});
				$(cont).find(".jg-image").mouseleave(function(sender){
					$(sender.currentTarget).find(".jg-image-label").stop();
					$(sender.currentTarget).find(".jg-image-label").fadeTo(500, 0);
				});
			}
			
			$(cont).find(".jg-resizedImageNotFound").remove();
			
			//fade in the images that we have changed and need to be reloaded
			$(cont).find(".jg-image img").load(function(){
					$(this).fadeTo(500, 1);
			}).error(function(){
				$(cont).prepend(getErrorHtml("The image can't be loaded: \"" +  $(this).attr("src") +"\"", "jg-resizedImageNotFound"));
			}).each(function(){
					if(this.complete) $(this).load();
			});

			checkWidth($, cont, images, rowWidth, settings);	
			
		}

		function checkWidth($, cont, images, lastRowWidth, settings){
			var id = setInterval(function(){

				if(lastRowWidth != $(cont).width()){
					$(cont).find(".jg-row").remove();
					clearInterval(id);
					processesImages($, cont, images, lastRowWidth, settings);
					return;
				}
			}, settings.refreshTime);
		}

   }
 
})(jQuery);