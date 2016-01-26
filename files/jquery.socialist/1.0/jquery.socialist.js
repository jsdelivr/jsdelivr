/**
 * jQuery.socialist - social media plugin
 * ---
 * @author Carol Skelly (http://iatek.com)
 * @version 1.0
 * @license MIT license (http://opensource.org/licenses/mit-license.php)
 * ---
 */

;(function ( $, window, document, undefined ) {

    $.fn.socialist = function(method) {

        var methods = {

            init : function(options) {
                this.socialist.settings = $.extend({}, this.socialist.defaults, options);
                var networks = this.socialist.settings.networks,
                    settings = this.socialist.settings,
                    queue = [],
                    processList = [];
               
                // each instance of this plugin
                return this.each(function() {
                    var $element = $(this),
                        visible = $element.is(":visible"),
                        element = this;
                    
                    // display loader
                    $element.addClass('socialist-loader');
                    
                    if (settings.feed) {
                        processList.push(helpers.doRequest(settings.feed,"json",function(q){
    						var container=$('<div></div>');
							q.data.forEach(function(item) {
								var $div = $('<div class="socialist"></div>');
								$div.addClass('socialist-'+item.api);
								$div = helpers.buildItem(item,$div,settings.fields);
								$div.appendTo(container);
							});
							queue.push(container);
						},null,settings))
                    }
                    else {
                        // loop each network
                        networks.forEach(function(item) {
                            // get network settings
                            var nw = helpers.networkDefs[item.name];
                            nw.cb=function(newElement){queue.push(newElement)};
                            var reqUrl = nw.url;
                            // replace params in request url
                            reqUrl = reqUrl.replace("|id|",item.id);
                            reqUrl = reqUrl.replace("|areaName|",item.areaName);
                            reqUrl = reqUrl.replace("|apiKey|",item.apiKey);
                            reqUrl = reqUrl.replace("|num|",settings.maxResults);
                            // add to array for processing
                            processList.push(helpers.doRequest(reqUrl,nw.dataType,nw.cb,nw.parser,settings));
                        });
                    }
                    
                    // process the array of requests, then add resulting elements to container element
                    $.when.apply($, processList).then(function(){
       
                        for (var i = 0; i < queue.length; i++) {
                           queue[i].children().appendTo($element);
                        }
                        
                        // load isotope?
                        if (settings.isotope) {
                            $element.imagesLoaded(function(){
                                //console.log("loading iso");
                                $element.isotope ({
                                     animationEngine: 'jquery'
                                });
                                
                                $element.removeClass('socialist-loader');
                                
                                if (settings.random){
                                    $element.isotope( 'shuffle', function(){} );
                                }
                                
                            });
                        }
                        else {
                            $element.removeClass('socialist-loader');
                        }
                        
                    },function(){
                        console.log('some requests failed.');
                    });
                    
                }); // end plugin instance
            }
        }

        var helpers = {
            parseResults: function(apiParser,data,settings) {
                
                var container=$('<div></div>');
                //console.log(JSON.stringify(data));
                                                   
                apiParser.resultsSelector = apiParser.resultsSelector.replace('|num|',settings.maxResults);          
                    
                $.each(eval(apiParser.resultsSelector), function(i,item) {
                    
                    var $elem = $(item),
                        heading,
                        txt,
                        linkHref,
                        imgSrc,
                        imgHref,
                        imgAlt,
                        date;
                    
                    try{
                        
                        // eval is evil, but we use it here as a simple way to evaluate strings in our parser
                        if (eval(apiParser.preCondition)) {
                            var $div = $('<div class="socialist"></div>');
                            $div.addClass('socialist-'+apiParser.name);
                            
                            if (settings.fixed) {
                                 $div.addClass('socialist-fixed');   
                            }
                            
                            if (settings.theme) {
                                 $div.addClass('socialist-'+settings.theme);   
                            }
                            
                            if (settings.size) {
                                 $div.addClass('socialist-'+settings.size);   
                            }
                            
                            if (!settings.isotope) {
                                $div.addClass('socialist-simple'); 
                            }
                            
                            if (settings.width) {
                                $div.css('width',settings.width); 
                            }
                            
                            if (settings.margin) {
                                $div.css('margin',settings.margin); 
                            }
                            
                            if (settings.border) {
                                $div.css('border',settings.border); 
                            }
                            
                            if (settings.padding) {
                                $div.css('padding',settings.padding); 
                            }
                            
                            //console.log(item);
                                            
                            if (apiParser.headingSelector!==null){
                                heading = helpers.shorten(helpers.stripHtml(eval(apiParser.headingSelector)),settings.headingLength);
                            }
                            else {
                                heading = apiParser.heading;
                            }
                            
                            txt=eval(apiParser.txtSelector);
                            if (txt!==null) {
                                txt = helpers.shorten(txt,settings.textLength);
                            }
                            else {
                                txt = "";
                            }

                            // link href
                            linkHref="#";
                            
                            // image src
                            if (apiParser.imgSrcSelector===null){
                                imgSrc=apiParser.imgSrc;
                            }
                            else {
                                imgSrc=eval(apiParser.imgSrcSelector);
                                if (imgSrc!==null && apiParser.imgSrcProcessor!==null){
                                    imgSrc=eval(apiParser.imgSrcProcessor);
                                }
                                else if (imgSrc===null) {
                                    imgSrc="";
                                }
                            }

                            
                            // image link
                            if (apiParser.imgHrefSelector===null){
                                imgHref=apiParser.imgHref;
                            }
                            else {
                                imgHref=eval(apiParser.imgHrefSelector);
                            }
    
                            // image alt
                            if (apiParser.imgAltSelector!==null){
                                imgAlt=eval(apiParser.imgAltSelector);
                            }
                           
                            date=eval(apiParser.dateSelector);
                            if (typeof date==="undefined" || date===null) {
                                date = "";
                            }
                            
                            var itemObj = {
                                api:apiParser.name,
                                heading:heading,
                                txt:txt,
                                img:{"src":imgSrc,"href":imgHref,"alt":imgAlt},
                                link:{"href":linkHref,"title":imgAlt},
                                date:date
                            };
                            
                            $div = helpers.buildItem(itemObj,$div,settings.fields);
                            $div.appendTo(container);
                        }
                             
                    }
                    catch (e) {
                       console.log("parse error:"+apiParser.name+":"+e)
                    }
                }); // end each
                return container;
            },
            doRequest: function(url,dataType,cb,parser,settings){
                console.log("ajax: " + dataType + ":" + url);
                return $.ajax({
                    url: url, //encodeURIComponent(url)?;
                    type: "GET",
                    dataType: dataType,
                    success: function(data) {
                        if (parser)
                            cb($(helpers.parseResults(parser,data,settings)));
                        else
                            cb(data);
                    },
                    error: function(status) {
                        console.log("request error:"+url);   
                    }
                });
                
                //return;
            },
            buildItem: function(itemObj,container,fields) {
  
                var $headDiv = $('<div class="head"/>'),
                    $source = $('<div class="source"></div>'),
                    $sourceLnk = $('<a href="'+itemObj.img.href+'" title="'+itemObj.link.title+'"></a>'),
                    $sourceLnkDiv = $('<div/>'),
                    $apiSpan = $('<div class="api"></div>'),
                    $apiSpanLnk = $('<a href="'+itemObj.img.href+'"></a>'),
                    $contentDiv = $('<div class="content"/>'),
                    $contentDivInner = $('<div>'+itemObj.txt+' </div>'),
                    $imgLnk = $('<a href="'+itemObj.img.href+'" title="'+itemObj.link.title+'"></a>'),
                    $img = $('<image src="'+itemObj.img.src+'" alt="'+helpers.stripHtml(itemObj.img.alt)+'">'),
                    $shareDiv = $('<div class="share"><a href="#" title='+itemObj.api+'>fb</a>|<a href="#" class="x">tw</a></div>'),
                    $dateSpan = $('<div class="date"/>'),
                    $footDiv = $('<div class="foot"/>');
                    
                    //console.log(itemObj.img.src);

                    if (fields.indexOf('image')!=-1 && itemObj.img.src){                                   
                        $img.appendTo($imgLnk);
                        $imgLnk.appendTo($contentDiv);
                    }
                    
                    if (fields.indexOf('text')!=-1 || typeof itemObj.img.src==="undefined" ){
                         $contentDivInner.appendTo($contentDiv);
                    }
                    
                    if (fields.indexOf('text')!=-1 || fields.indexOf('image')!=-1) {
                        $contentDiv.appendTo(container);            
                    }
                
                /* TODO: implement sharing links
                    if (fields.indexOf('share')!=-1){
                        $shareDiv.appendTo(container);
                    }
                    */
                    
                    $source.appendTo($footDiv);
                    $sourceLnk.text(itemObj.heading);
                    if (fields.indexOf('source')!=-1){
                        $sourceLnk.appendTo($sourceLnkDiv);
                        $sourceLnkDiv.appendTo($source);
                        $apiSpanLnk.appendTo($apiSpan);
                        $apiSpan.appendTo($footDiv);
                        $source.appendTo($footDiv);                                                                                        
                    }
                    else {
                        $sourceLnk.appendTo($contentDivInner);
                    }
                    
                    if (fields.indexOf('date')!=-1){
                        $dateSpan.text(itemObj.date);                            
                        $dateSpan.appendTo($sourceLnkDiv);
                    }
                    
                    if (fields.indexOf('source')!=-1 || fields.indexOf('date')!=-1) {
                        $footDiv.appendTo(container);
                    }
                    
                    return container;
            },
            networkDefs: {
                rss:{url:"http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=|num|&callback=?&q=|id|",dataType:"json",parser:{
                    name: "rss",
                    resultsSelector: "data.responseData.feed.entries",
                    heading: "RSS",
                    headingSelector: "data.responseData.feed.title",
                    txtSelector: "item.title",
                    dateSelector: "item.publishedDate.substring(0,17)",
                    imgSrc: null,
                    imgSrcSelector: "$(item.content).find(\"img:lt(1)\").attr('src')",
                    imgSrcProcessor: null,
                    imgHref: "",
                    imgHrefSelector: "$(item.content).find(\"img:lt(1)\").parent().attr('href')||$(item.content).find(\"a:lt(1)\").attr('href')",
                    imgAltSelector: "item.contentSnippet",
                    link: "",
                    linkSelector: null,
                    linkTipSelector: "item.contentSnippet",
                    preProcessor: null,
                    preCondition: "$(item.content).find(\"img[src]:contains('http')\")"
                    }
                },
                facebook:{url:'http://graph.facebook.com/|id|/photos?limit=|num|',img:'',dataType:'json',parser:{
                    name: "facebook",
                    resultsSelector: "data.data",
                    heading: "Facebook",
                    headingSelector: "item.from.name",
                    txtSelector: "item.from.name",
                    dateSelector: "helpers.timeAgo(item.created_time)",
                    imgSrcSelector: "(item.images[2].source)||'/spacer.gif'",
                    imgSrcProcessor: null,
                    imgHrefSelector: "item.link",
                    imgAltSelector: "item.from.name.substring(0,12)",
                    link: "#",
                    preProcessor: null,
                    preCondition: "true"}
                },
                youtube:{url:'https://gdata.youtube.com/feeds/api/users/|id|/uploads?alt=json&max-results=|num|',dataType:"json",img:'',parser:{
                    name: "youtube",
                    resultsSelector: "data.feed.entry",
                    heading: "YouTube",
                    headingSelector: "item.title.$t",
                    txtSelector: "item.content.$t",
                    dateSelector: "helpers.timeAgo(item.updated.$t)",
                    imgSrcSelector: "item.media$group.media$thumbnail[0].url",
                    imgSrcProcessor: null,
                    imgHrefSelector: "item.link[0].href",
                    imgAltSelector: "item.title.$t",
                    preProcessor: null,
                    preCondition: "true"}
                },
                twitter:{url:'https://api.twitter.com/1/statuses/user_timeline.json?include_entities=true&include_rts=false&screen_name=|id|&count=|num|',dataType:"jsonp",img:'',parser:{
                    name: "twitter",
                    resultsSelector: "data",
                    heading: "Twitter",
                    headingSelector: "item.user.screen_name",
                    txtSelector: "item.text",
                    dateSelector: "helpers.timeAgo(helpers.fixTwitterDate(item.created_at))",
                    imgSrcSelector: "(item.user.profile_image_url)||'/assets/spacer.gif'",
                    imgSrcProcessor: null,
                    imgHrefSelector: "(item.entities.urls[0].url)||'http://www.twitter.com/'",
                    imgAltSelector: "item.user.screen_name",
                    link: "#",
                    preProcessor: null,
                    preCondition: "true"}
                },
                linkedin:{url:'http://www.linkedin.com/company/|id|/',img:'',dataType:"text",parser:{
                    name: "linkedin",
                    resultsSelector:"$(data.responseText).find('div.feed-body:lt(|num|)')",
                    heading: "LinkedIn",
                    headingSelector: "$elem.find('a:first').text()",
                    txtSelector: "($elem.find('a:last').text())||$elem.find('p.share-desc').html()",
                    imgSrcSelector: "$elem.find('.feed-photo').attr('src')||$elem.find('.has-photo img').attr('src')",                    
                    imgSrcProcessor: null,
                    imgHrefSelector: "$elem.find('a').attr('href')",
                    imgAltSelector: "$elem.find('a').text()",
                    dateSelector: "$elem.find('span.nus-timestamp').text()",
                    link: "#",
                    preProcessor: null,
                    preCondition: "true"}
                },
                tumblr:{url:'http://iatek.tumblr.com/api/read/json?callback=helpers.cb&num=|num|',dataType:"jsonp",parser:{
                    name: "tumblr",
                    resultsSelector: "data.posts",
                    heading: "tumblr",
                    headingSelector: "(item['photo-caption'])||data.tumblelog.title",
                    txtSelector: "(helpers.stripHtml(item['regular-body']))||(item['regular-title'])||item['photo-caption']",
                    dateSelector: "item.date",
                    imgSrcSelector: "item['photo-url-250']",
                    imgSrcProcessor: null,
                    imgHrefSelector: "item.url",
                    imgAltSelector: "(item['regular-title'])||item.tags.toString()",
                    link: "#",
                    preProcessor: null,
                    preCondition: "true"}
                
                },
                digg:{url:'http://digg.com/'},
                flickr:{url:'http://api.flickr.com/services/rest/?extras=tags%2Cdescription%2Cdate_upload&nojsoncallback=1&api_key=|apiKey|&method=flickr.people.getPublicPhotos&format=json&per_page=|num|&user_id=|id|',dataType:'json',parser:{
                    name: "flickr",
                    resultsSelector: "data.photos.photo",
                    heading: "Flickr",
                    headingSelector: "item.title",
                    dateSelector: "new Date(item.dateupload)",
                    txtSelector: "(item.description._content)||item.tags",
                    imgSrcSelector: "'http://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_n.jpg'",
                    imgHrefSelector: "\"http://flickr.com/photos/\" + item.owner + \"/\" + item.id + \"\"",
                    imgAltSelector: "item.title",
                    imgSrcProcessor: null,
                    preCondition: "true"
                   }
                },
                googleplus:{url:'https://plus.google.com/|id|',dataType:'text',parser:{
                    name: "google",
                    resultsSelector:"$(data.responseText).find('div.zg:lt(|num|)')",
                    heading: "Google+",
                    headingSelector: "$elem.find('a.YF').text()",
                    txtSelector: "$elem.find('div.XF').text()",
                    imgSrcSelector: "$elem.find('a.Mn img').attr('src')",                    
                    imgSrcProcessor: null,
                    imgHrefSelector: "$elem.find('a.YF').attr('href')",
                    imgAltSelector: "($elem.find('a.Mn img').attr('alt'))||'Google'",
                    dateSelector: "$elem.parents('div.qf').find('a.Bf').text()",
                    link: "#",
                    preProcessor: null,
                    preCondition: "true"}
                },
                pinterest:{url:'http://pinterest.com/|id|/',dataType:"text",parser:{
                    name: "pinterest",
                    resultsSelector:"$(data.responseText).find('div.pin:lt(|num|),a.PinImage:lt(|num|)')",
                    heading: "Pinterest",
                    headingSelector: "($elem.find('p.NoImage a').text())||$elem.find('.serif a').text()",
                    txtSelector: "($elem.find('img').attr('alt'))||$elem.find('.serif a').text()",
                    imgSrcSelector: "($elem.find('img.PinImageImg').attr('src'))||$elem.find('span.cover img').attr('src')",
                    imgSrcProcessor: null,
                    imgHrefSelector: "\"http://pinterest.com\"+(($elem.find('a.link').attr('href'))||$elem.find('a.PinImage').attr('href'))",
                    imgAltSelector: "($elem.find('img').attr('alt'))||'Pinterest'",
                    link: "#",
                    preProcessor: null,
                    preCondition: "true"
                    }
               },
               quora:{url:'http://www.quora.com/|id|/feed/',dataType:"text",parser:{
                    name: "quora",
                    resultsSelector:"$(data.responseText).find('div.feed_item:lt(|num|)')",
                    heading: "Quora",
                    headingSelector: "$elem.find('a.question_link').text()",
                    txtSelector: "($elem.find('div.truncated_q_text:first-child').text())",
                    imgSrcSelector: "",                    
                    imgSrcProcessor: null,
                    imgHrefSelector: "$elem.find('a').attr('href')",
                    imgAltSelector: "$elem.find('a').text()",
                    dateSelector: "$elem.find('span.timestamp').text()",
                    link: "#",
                    preProcessor: null,
                    preCondition: "true"}
               },
               craigslist:{url:"http://|areaName|.craigslist.org/|id|",dataType:"text",parser:{
                    name: "craigslist",
                    resultsSelector:"$(data.responseText).find(\"p.row:contains('pic'):lt(|num|)\")",
                    heading: "Craigslist",
                    headingSelector: null,
                    txtSelector: "helpers.fixCase($elem.find('a,font').text())",
                    imgSrcSelector: "\"http://images.craigslist.org/\"+$elem.find(\"span.ih[id]\").attr('id')",
                    imgSrcProcessor: "imgSrc.replace('images:',\"\")",
                    imgHrefSelector: "$elem.find('a').attr('href')",
                    imgAltSelector: "$elem.find('span.itempp').text()",
                    link: "#",
                    preProcessor: null,
                    preCondition: "true"}
                }
            },
            cb:function(jsonStr) {
                return jsonStr;
            },
            fixCase:function(string)
            {
                if (string===null)
                    return;
                
                return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
            },
            shorten:function(string,length)
            {
                if (typeof string==="undefined" || string===null)
                    return;
            
                if (string.length > length)
                    return string.substring(0,length) + "..";
                else
                    return string;
            },
            stripHtml:function(w)
            {
                if (typeof w==="undefined" || w===null)
                    return;
            
                return w.replace(/(<([^>]+)>)|nbsp;|\s{2,}|/ig,"");

            },
            timeAgo:function(date_str){
                date_str = date_str.replace('+0000','Z');
                var time_formats = [
                    [60, 'just now', 1],
                    [120, '1 minute ago', '1 minute from now'],
                    [3600, 'minutes', 60], 
                    [7200, '1 hour ago', '1 hour from now'],
                    [86400, 'hours', 3600], 
                    [172800, 'yesterday', 'tomorrow'], 
                    [604800, 'days', 86400], 
                    [1209600, 'last week', 'next week'], 
                    [2419200, 'weeks', 604800], 
                    [4838400, 'last month', 'next month'], 
                    [29030400, 'months', 2419200], 
                    [58060800, 'last year', 'next year'], 
                    [2903040000, 'years', 29030400], 
                    [5806080000, 'last century', 'next century'], 
                    [58060800000, 'centuries', 2903040000] 
                ];
                var time = ('' + date_str).replace(/-/g,"/").replace(/[TZ]/g," ").replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                if(time.substr(time.length-4,1)==".") time =time.substr(0,time.length-4);
                var seconds = (new Date - new Date(time)) / 1000;
                var token = 'ago', list_choice = 1;
                if (seconds < 0) {
                    seconds = Math.abs(seconds);
                    token = 'from now';
                    list_choice = 2;
                }
                var i = 0, format;
                while (format = time_formats[i++])
                    if (seconds < format[0]) {
                        if (typeof format[2] == 'string')
                            return format[list_choice];
                        else
                            return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
                    }
                return time;
            },                
            fixTwitterDate: function(created_at) {
                var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                var pattern = /\s/;
                var day_of_week,day,month_pos,month,year,time;
                created_at = created_at.split(pattern);
                for (var i = 0; i < created_at.length; i++){
                    day_of_week = created_at[0];
                    day = created_at[2];
                    month_pos = created_at[1];
                    month = 0 + months.indexOf(month_pos) + 1; // add 1 because array starts from zero
                    year = created_at[5];
                    time = created_at[3];
                }
                created_at = year+'-'+month+'-'+day+'T'+time+'Z';
                
                if(created_at !== undefined)
                    return created_at;
            }
        }

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error( 'Method "' +  method + '" does not exist in social plugin');
        }

    }

    $.fn.socialist.defaults = {
        networks: [{name:'linkedin',id:'iatek-llc'},{name:'pinterest',id:'carolskelly/in1-com'},{name:'twitter',id:'in1dotcom'}],
        random: true,
        isotope: true,
        headingLength: 31,
        textLength: 160,
        maxResults: 7,
        autoShow: true,
        fields:['source','heading','text','date','image','followers','likes','share']
    }

    $.fn.socialist.settings = {}

})(jQuery);


// begin dependencies

/**
 * jQuery.ajax mid - CROSS DOMAIN AJAX 
 * ---
 * @author James Padolsey (http://james.padolsey.com)
 * @version 0.11
 * @updated 12-JAN-10
 * ---
 * Note: Read the README!
 * ---
 * @info http://james.padolsey.com/javascript/cross-domain-requests-with-jquery/
 */

jQuery.ajax = (function(_ajax){
    
    var protocol = location.protocol,
        hostname = location.hostname,
        exRegex = RegExp(protocol + '//' + hostname),
        YQL = 'http' + (/^https/.test(protocol)?'s':'') + '://query.yahooapis.com/v1/public/yql?callback=?',
        query = 'select * from html where url="{URL}" and xpath="*"';
    
    function isExternal(url) {
        return !exRegex.test(url) && /:\/\//.test(url);
    }
    
    return function(o) {
        
        var url = o.url;
        
        if ( /get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url) ) {
            
            // Manipulate options so that JSONP-x request is made to YQL
            
            o.url = YQL;
            o.dataType = 'json';
            
            o.data = {
                q: query.replace(
                    '{URL}',
                    url + (o.data ?
                        (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data)
                    : '')
                ),
                format: 'xml'
            };
            
            // Since it's a JSONP request
            // complete === success
            if (!o.success && o.complete) {
                o.success = o.complete;
                delete o.complete;
            }
            
            o.success = (function(_success){
                return function(data) {
                    
                    if (_success) {
                        // Fake XHR callback.
                        _success.call(this, {
                            responseText: (data.results[0] || '')
                                // YQL screws with <script>s
                                // Get rid of them
                                .replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
                        }, 'success');
                    }
                    
                };
            })(o.success);
            
        }
        
        return _ajax.apply(this, arguments);
        
    };
    
})(jQuery.ajax);

/**
 * Isotope v1.5.19
 * An exquisite jQuery plugin for magical layouts
 * http://isotope.metafizzy.co
 *
 * Commercial use requires one-time license fee
 * http://metafizzy.co/#licenses
 *
 * Copyright 2012 David DeSandro / Metafizzy
 */
(function(a,b,c){"use strict";var d=a.document,e=a.Modernizr,f=function(a){return a.charAt(0).toUpperCase()+a.slice(1)},g="Moz Webkit O Ms".split(" "),h=function(a){var b=d.documentElement.style,c;if(typeof b[a]=="string")return a;a=f(a);for(var e=0,h=g.length;e<h;e++){c=g[e]+a;if(typeof b[c]=="string")return c}},i=h("transform"),j=h("transitionProperty"),k={csstransforms:function(){return!!i},csstransforms3d:function(){var a=!!h("perspective");if(a){var c=" -o- -moz- -ms- -webkit- -khtml- ".split(" "),d="@media ("+c.join("transform-3d),(")+"modernizr)",e=b("<style>"+d+"{#modernizr{height:3px}}"+"</style>").appendTo("head"),f=b('<div id="modernizr" />').appendTo("html");a=f.height()===3,f.remove(),e.remove()}return a},csstransitions:function(){return!!j}},l;if(e)for(l in k)e.hasOwnProperty(l)||e.addTest(l,k[l]);else{e=a.Modernizr={_version:"1.6ish: miniModernizr for Isotope"};var m=" ",n;for(l in k)n=k[l](),e[l]=n,m+=" "+(n?"":"no-")+l;b("html").addClass(m)}if(e.csstransforms){var o=e.csstransforms3d?{translate:function(a){return"translate3d("+a[0]+"px, "+a[1]+"px, 0) "},scale:function(a){return"scale3d("+a+", "+a+", 1) "}}:{translate:function(a){return"translate("+a[0]+"px, "+a[1]+"px) "},scale:function(a){return"scale("+a+") "}},p=function(a,c,d){var e=b.data(a,"isoTransform")||{},f={},g,h={},j;f[c]=d,b.extend(e,f);for(g in e)j=e[g],h[g]=o[g](j);var k=h.translate||"",l=h.scale||"",m=k+l;b.data(a,"isoTransform",e),a.style[i]=m};b.cssNumber.scale=!0,b.cssHooks.scale={set:function(a,b){p(a,"scale",b)},get:function(a,c){var d=b.data(a,"isoTransform");return d&&d.scale?d.scale:1}},b.fx.step.scale=function(a){b.cssHooks.scale.set(a.elem,a.now+a.unit)},b.cssNumber.translate=!0,b.cssHooks.translate={set:function(a,b){p(a,"translate",b)},get:function(a,c){var d=b.data(a,"isoTransform");return d&&d.translate?d.translate:[0,0]}}}var q,r;e.csstransitions&&(q={WebkitTransitionProperty:"webkitTransitionEnd",MozTransitionProperty:"transitionend",OTransitionProperty:"oTransitionEnd",transitionProperty:"transitionEnd"}[j],r=h("transitionDuration"));var s=b.event,t;s.special.smartresize={setup:function(){b(this).bind("resize",s.special.smartresize.handler)},teardown:function(){b(this).unbind("resize",s.special.smartresize.handler)},handler:function(a,b){var c=this,d=arguments;a.type="smartresize",t&&clearTimeout(t),t=setTimeout(function(){jQuery.event.handle.apply(c,d)},b==="execAsap"?0:100)}},b.fn.smartresize=function(a){return a?this.bind("smartresize",a):this.trigger("smartresize",["execAsap"])},b.Isotope=function(a,c,d){this.element=b(c),this._create(a),this._init(d)};var u=["width","height"],v=b(a);b.Isotope.settings={resizable:!0,layoutMode:"masonry",containerClass:"isotope",itemClass:"isotope-item",hiddenClass:"isotope-hidden",hiddenStyle:{opacity:0,scale:.001},visibleStyle:{opacity:1,scale:1},containerStyle:{position:"relative",overflow:"hidden"},animationEngine:"best-available",animationOptions:{queue:!1,duration:800},sortBy:"original-order",sortAscending:!0,resizesContainer:!0,transformsEnabled:!b.browser.opera,itemPositionDataEnabled:!1},b.Isotope.prototype={_create:function(a){this.options=b.extend({},b.Isotope.settings,a),this.styleQueue=[],this.elemCount=0;var c=this.element[0].style;this.originalStyle={};var d=u.slice(0);for(var e in this.options.containerStyle)d.push(e);for(var f=0,g=d.length;f<g;f++)e=d[f],this.originalStyle[e]=c[e]||"";this.element.css(this.options.containerStyle),this._updateAnimationEngine(),this._updateUsingTransforms();var h={"original-order":function(a,b){return b.elemCount++,b.elemCount},random:function(){return Math.random()}};this.options.getSortData=b.extend(this.options.getSortData,h),this.reloadItems(),this.offset={left:parseInt(this.element.css("padding-left")||0,10),top:parseInt(this.element.css("padding-top")||0,10)};var i=this;setTimeout(function(){i.element.addClass(i.options.containerClass)},0),this.options.resizable&&v.bind("smartresize.isotope",function(){i.resize()}),this.element.delegate("."+this.options.hiddenClass,"click",function(){return!1})},_getAtoms:function(a){var b=this.options.itemSelector,c=b?a.filter(b).add(a.find(b)):a,d={position:"absolute"};return this.usingTransforms&&(d.left=0,d.top=0),c.css(d).addClass(this.options.itemClass),this.updateSortData(c,!0),c},_init:function(a){this.$filteredAtoms=this._filter(this.$allAtoms),this._sort(),this.reLayout(a)},option:function(a){if(b.isPlainObject(a)){this.options=b.extend(!0,this.options,a);var c;for(var d in a)c="_update"+f(d),this[c]&&this[c]()}},_updateAnimationEngine:function(){var a=this.options.animationEngine.toLowerCase().replace(/[ _\-]/g,""),b;switch(a){case"css":case"none":b=!1;break;case"jquery":b=!0;break;default:b=!e.csstransitions}this.isUsingJQueryAnimation=b,this._updateUsingTransforms()},_updateTransformsEnabled:function(){this._updateUsingTransforms()},_updateUsingTransforms:function(){var a=this.usingTransforms=this.options.transformsEnabled&&e.csstransforms&&e.csstransitions&&!this.isUsingJQueryAnimation;a||(delete this.options.hiddenStyle.scale,delete this.options.visibleStyle.scale),this.getPositionStyles=a?this._translate:this._positionAbs},_filter:function(a){var b=this.options.filter===""?"*":this.options.filter;if(!b)return a;var c=this.options.hiddenClass,d="."+c,e=a.filter(d),f=e;if(b!=="*"){f=e.filter(b);var g=a.not(d).not(b).addClass(c);this.styleQueue.push({$el:g,style:this.options.hiddenStyle})}return this.styleQueue.push({$el:f,style:this.options.visibleStyle}),f.removeClass(c),a.filter(b)},updateSortData:function(a,c){var d=this,e=this.options.getSortData,f,g;a.each(function(){f=b(this),g={};for(var a in e)!c&&a==="original-order"?g[a]=b.data(this,"isotope-sort-data")[a]:g[a]=e[a](f,d);b.data(this,"isotope-sort-data",g)})},_sort:function(){var a=this.options.sortBy,b=this._getSorter,c=this.options.sortAscending?1:-1,d=function(d,e){var f=b(d,a),g=b(e,a);return f===g&&a!=="original-order"&&(f=b(d,"original-order"),g=b(e,"original-order")),(f>g?1:f<g?-1:0)*c};this.$filteredAtoms.sort(d)},_getSorter:function(a,c){return b.data(a,"isotope-sort-data")[c]},_translate:function(a,b){return{translate:[a,b]}},_positionAbs:function(a,b){return{left:a,top:b}},_pushPosition:function(a,b,c){b=Math.round(b+this.offset.left),c=Math.round(c+this.offset.top);var d=this.getPositionStyles(b,c);this.styleQueue.push({$el:a,style:d}),this.options.itemPositionDataEnabled&&a.data("isotope-item-position",{x:b,y:c})},layout:function(a,b){var c=this.options.layoutMode;this["_"+c+"Layout"](a);if(this.options.resizesContainer){var d=this["_"+c+"GetContainerSize"]();this.styleQueue.push({$el:this.element,style:d})}this._processStyleQueue(a,b),this.isLaidOut=!0},_processStyleQueue:function(a,c){var d=this.isLaidOut?this.isUsingJQueryAnimation?"animate":"css":"css",f=this.options.animationOptions,g=this.options.onLayout,h,i,j,k;i=function(a,b){b.$el[d](b.style,f)};if(this._isInserting&&this.isUsingJQueryAnimation)i=function(a,b){h=b.$el.hasClass("no-transition")?"css":d,b.$el[h](b.style,f)};else if(c||g||f.complete){var l=!1,m=[c,g,f.complete],n=this;j=!0,k=function(){if(l)return;var b;for(var c=0,d=m.length;c<d;c++)b=m[c],typeof b=="function"&&b.call(n.element,a,n);l=!0};if(this.isUsingJQueryAnimation&&d==="animate")f.complete=k,j=!1;else if(e.csstransitions){var o=0,p=this.styleQueue[0],s=p&&p.$el,t;while(!s||!s.length){t=this.styleQueue[o++];if(!t)return;s=t.$el}var u=parseFloat(getComputedStyle(s[0])[r]);u>0&&(i=function(a,b){b.$el[d](b.style,f).one(q,k)},j=!1)}}b.each(this.styleQueue,i),j&&k(),this.styleQueue=[]},resize:function(){this["_"+this.options.layoutMode+"ResizeChanged"]()&&this.reLayout()},reLayout:function(a){this["_"+this.options.layoutMode+"Reset"](),this.layout(this.$filteredAtoms,a)},addItems:function(a,b){var c=this._getAtoms(a);this.$allAtoms=this.$allAtoms.add(c),b&&b(c)},insert:function(a,b){this.element.append(a);var c=this;this.addItems(a,function(a){var d=c._filter(a);c._addHideAppended(d),c._sort(),c.reLayout(),c._revealAppended(d,b)})},appended:function(a,b){var c=this;this.addItems(a,function(a){c._addHideAppended(a),c.layout(a),c._revealAppended(a,b)})},_addHideAppended:function(a){this.$filteredAtoms=this.$filteredAtoms.add(a),a.addClass("no-transition"),this._isInserting=!0,this.styleQueue.push({$el:a,style:this.options.hiddenStyle})},_revealAppended:function(a,b){var c=this;setTimeout(function(){a.removeClass("no-transition"),c.styleQueue.push({$el:a,style:c.options.visibleStyle}),c._isInserting=!1,c._processStyleQueue(a,b)},10)},reloadItems:function(){this.$allAtoms=this._getAtoms(this.element.children())},remove:function(a,b){var c=this,d=function(){c.$allAtoms=c.$allAtoms.not(a),a.remove(),b&&b.call(c.element)};a.filter(":not(."+this.options.hiddenClass+")").length?(this.styleQueue.push({$el:a,style:this.options.hiddenStyle}),this.$filteredAtoms=this.$filteredAtoms.not(a),this._sort(),this.reLayout(d)):d()},shuffle:function(a){this.updateSortData(this.$allAtoms),this.options.sortBy="random",this._sort(),this.reLayout(a)},destroy:function(){var a=this.usingTransforms,b=this.options;this.$allAtoms.removeClass(b.hiddenClass+" "+b.itemClass).each(function(){var b=this.style;b.position="",b.top="",b.left="",b.opacity="",a&&(b[i]="")});var c=this.element[0].style;for(var d in this.originalStyle)c[d]=this.originalStyle[d];this.element.unbind(".isotope").undelegate("."+b.hiddenClass,"click").removeClass(b.containerClass).removeData("isotope"),v.unbind(".isotope")},_getSegments:function(a){var b=this.options.layoutMode,c=a?"rowHeight":"columnWidth",d=a?"height":"width",e=a?"rows":"cols",g=this.element[d](),h,i=this.options[b]&&this.options[b][c]||this.$filteredAtoms["outer"+f(d)](!0)||g;h=Math.floor(g/i),h=Math.max(h,1),this[b][e]=h,this[b][c]=i},_checkIfSegmentsChanged:function(a){var b=this.options.layoutMode,c=a?"rows":"cols",d=this[b][c];return this._getSegments(a),this[b][c]!==d},_masonryReset:function(){this.masonry={},this._getSegments();var a=this.masonry.cols;this.masonry.colYs=[];while(a--)this.masonry.colYs.push(0)},_masonryLayout:function(a){var c=this,d=c.masonry;a.each(function(){var a=b(this),e=Math.ceil(a.outerWidth(!0)/d.columnWidth);e=Math.min(e,d.cols);if(e===1)c._masonryPlaceBrick(a,d.colYs);else{var f=d.cols+1-e,g=[],h,i;for(i=0;i<f;i++)h=d.colYs.slice(i,i+e),g[i]=Math.max.apply(Math,h);c._masonryPlaceBrick(a,g)}})},_masonryPlaceBrick:function(a,b){var c=Math.min.apply(Math,b),d=0;for(var e=0,f=b.length;e<f;e++)if(b[e]===c){d=e;break}var g=this.masonry.columnWidth*d,h=c;this._pushPosition(a,g,h);var i=c+a.outerHeight(!0),j=this.masonry.cols+1-f;for(e=0;e<j;e++)this.masonry.colYs[d+e]=i},_masonryGetContainerSize:function(){var a=Math.max.apply(Math,this.masonry.colYs);return{height:a}},_masonryResizeChanged:function(){return this._checkIfSegmentsChanged()},_fitRowsReset:function(){this.fitRows={x:0,y:0,height:0}},_fitRowsLayout:function(a){var c=this,d=this.element.width(),e=this.fitRows;a.each(function(){var a=b(this),f=a.outerWidth(!0),g=a.outerHeight(!0);e.x!==0&&f+e.x>d&&(e.x=0,e.y=e.height),c._pushPosition(a,e.x,e.y),e.height=Math.max(e.y+g,e.height),e.x+=f})},_fitRowsGetContainerSize:function(){return{height:this.fitRows.height}},_fitRowsResizeChanged:function(){return!0},_cellsByRowReset:function(){this.cellsByRow={index:0},this._getSegments(),this._getSegments(!0)},_cellsByRowLayout:function(a){var c=this,d=this.cellsByRow;a.each(function(){var a=b(this),e=d.index%d.cols,f=Math.floor(d.index/d.cols),g=(e+.5)*d.columnWidth-a.outerWidth(!0)/2,h=(f+.5)*d.rowHeight-a.outerHeight(!0)/2;c._pushPosition(a,g,h),d.index++})},_cellsByRowGetContainerSize:function(){return{height:Math.ceil(this.$filteredAtoms.length/this.cellsByRow.cols)*this.cellsByRow.rowHeight+this.offset.top}},_cellsByRowResizeChanged:function(){return this._checkIfSegmentsChanged()},_straightDownReset:function(){this.straightDown={y:0}},_straightDownLayout:function(a){var c=this;a.each(function(a){var d=b(this);c._pushPosition(d,0,c.straightDown.y),c.straightDown.y+=d.outerHeight(!0)})},_straightDownGetContainerSize:function(){return{height:this.straightDown.y}},_straightDownResizeChanged:function(){return!0},_masonryHorizontalReset:function(){this.masonryHorizontal={},this._getSegments(!0);var a=this.masonryHorizontal.rows;this.masonryHorizontal.rowXs=[];while(a--)this.masonryHorizontal.rowXs.push(0)},_masonryHorizontalLayout:function(a){var c=this,d=c.masonryHorizontal;a.each(function(){var a=b(this),e=Math.ceil(a.outerHeight(!0)/d.rowHeight);e=Math.min(e,d.rows);if(e===1)c._masonryHorizontalPlaceBrick(a,d.rowXs);else{var f=d.rows+1-e,g=[],h,i;for(i=0;i<f;i++)h=d.rowXs.slice(i,i+e),g[i]=Math.max.apply(Math,h);c._masonryHorizontalPlaceBrick(a,g)}})},_masonryHorizontalPlaceBrick:function(a,b){var c=Math.min.apply(Math,b),d=0;for(var e=0,f=b.length;e<f;e++)if(b[e]===c){d=e;break}var g=c,h=this.masonryHorizontal.rowHeight*d;this._pushPosition(a,g,h);var i=c+a.outerWidth(!0),j=this.masonryHorizontal.rows+1-f;for(e=0;e<j;e++)this.masonryHorizontal.rowXs[d+e]=i},_masonryHorizontalGetContainerSize:function(){var a=Math.max.apply(Math,this.masonryHorizontal.rowXs);return{width:a}},_masonryHorizontalResizeChanged:function(){return this._checkIfSegmentsChanged(!0)},_fitColumnsReset:function(){this.fitColumns={x:0,y:0,width:0}},_fitColumnsLayout:function(a){var c=this,d=this.element.height(),e=this.fitColumns;a.each(function(){var a=b(this),f=a.outerWidth(!0),g=a.outerHeight(!0);e.y!==0&&g+e.y>d&&(e.x=e.width,e.y=0),c._pushPosition(a,e.x,e.y),e.width=Math.max(e.x+f,e.width),e.y+=g})},_fitColumnsGetContainerSize:function(){return{width:this.fitColumns.width}},_fitColumnsResizeChanged:function(){return!0},_cellsByColumnReset:function(){this.cellsByColumn={index:0},this._getSegments(),this._getSegments(!0)},_cellsByColumnLayout:function(a){var c=this,d=this.cellsByColumn;a.each(function(){var a=b(this),e=Math.floor(d.index/d.rows),f=d.index%d.rows,g=(e+.5)*d.columnWidth-a.outerWidth(!0)/2,h=(f+.5)*d.rowHeight-a.outerHeight(!0)/2;c._pushPosition(a,g,h),d.index++})},_cellsByColumnGetContainerSize:function(){return{width:Math.ceil(this.$filteredAtoms.length/this.cellsByColumn.rows)*this.cellsByColumn.columnWidth}},_cellsByColumnResizeChanged:function(){return this._checkIfSegmentsChanged(!0)},_straightAcrossReset:function(){this.straightAcross={x:0}},_straightAcrossLayout:function(a){var c=this;a.each(function(a){var d=b(this);c._pushPosition(d,c.straightAcross.x,0),c.straightAcross.x+=d.outerWidth(!0)})},_straightAcrossGetContainerSize:function(){return{width:this.straightAcross.x}},_straightAcrossResizeChanged:function(){return!0}},b.fn.imagesLoaded=function(a){function h(){a.call(c,d)}function i(a){var c=a.target;c.src!==f&&b.inArray(c,g)===-1&&(g.push(c),--e<=0&&(setTimeout(h),d.unbind(".imagesLoaded",i)))}var c=this,d=c.find("img").add(c.filter("img")),e=d.length,f="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",g=[];return e||h(),d.bind("load.imagesLoaded error.imagesLoaded",i).each(function(){var a=this.src;this.src=f,this.src=a}),c};var w=function(b){a.console&&a.console.error(b)};b.fn.isotope=function(a,c){if(typeof a=="string"){var d=Array.prototype.slice.call(arguments,1);this.each(function(){var c=b.data(this,"isotope");if(!c){w("cannot call methods on isotope prior to initialization; attempted to call method '"+a+"'");return}if(!b.isFunction(c[a])||a.charAt(0)==="_"){w("no such method '"+a+"' for isotope instance");return}c[a].apply(c,d)})}else this.each(function(){var d=b.data(this,"isotope");d?(d.option(a),d._init(c)):b.data(this,"isotope",new b.Isotope(a,this,c))});return this}})(window,jQuery);

// end dependencies