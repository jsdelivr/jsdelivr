/*
 * YouTube TV
 *
 * Copyright 2013, Jacob Kelley - http://jakiestfu.com/
 * Released under the MIT Licence
 * http://opensource.org/licenses/MIT
 *
 * Github:  
 * Version: 1.0.0
 */
/*jslint browser: true, undef:true, unused:true*/
/*global define, module, ender */

(function(win, doc) {
    'use strict';
    var YTV = YTV || function(id, opts){

        var noop = function(){},
            settings = {
                element: null,
                user: null,
                fullscreen: false,
                accent: '#fff',
                controls: true,
                annotations: false,
                autoplay: false,
                chainVideos: true,
                browsePlaylists: false,
                events: {
                    videoReady: noop,
                    stateChange: noop
                }
            },
            
            cache = {},
            utils = {
                events: {
                    addEvent: function addEvent(element, eventName, func) {
                        if (element.addEventListener) {
                            return element.addEventListener(eventName, func, false);
                        } else if (element.attachEvent) {
                            return element.attachEvent("on" + eventName, func);
                        }
                    },
                    removeEvent: function addEvent(element, eventName, func) {
                        if (element.addEventListener) {
                            return element.removeEventListener(eventName, func, false);
                        } else if (element.attachEvent) {
                            return element.detachEvent("on" + eventName, func);
                        }
                    },
                    prevent: function(e) {
                        if (e.preventDefault) {
                            e.preventDefault();
                        } else {
                            e.returnValue = false;
                        }
                    }
                },
                addCSS: function(css){
                    var head = doc.getElementsByTagName('head')[0],
                        style = doc.createElement('style');
                        style.type = 'text/css';
                    if (style.styleSheet){
                        style.styleSheet.cssText = css;
                    } else {
                        style.appendChild(doc.createTextNode(css));
                    }
                    head.appendChild(style);
                },
                addCommas: function(str){
                    var x = str.split('.'),
                        x1 = x[0],
                        x2 = x.length > 1 ? '.' + x[1] : '',
                        rgx = /(\d+)(\d{3})/;
                    while (rgx.test(x1)) {
                        x1 = x1.replace(rgx, '$1' + ',' + '$2');
                    }
                    return x1 + x2;
                },
                parentUntil: function(el, attr) {
                    while (el.parentNode) {
                       if (el.getAttribute && el.getAttribute(attr)){
                            return el;
                        }
                        el = el.parentNode;
                    }
                    return null;
                },
                ajax: {
                    get: function(url, fn){
                        var handle;
                        if (win.XMLHttpRequest){ 
                            handle = new XMLHttpRequest(); 
                        } else {
                            handle = new ActiveXObject("Microsoft.XMLHTTP");
                        }
                        handle.onreadystatechange = function(){
                            if (handle.readyState === 4 && handle.status === 200){
                                fn.call(this, JSON.parse(handle.responseText));
                            }
                        };
                        handle.open("GET",url,true);
                        handle.send();
                    }
                },
                endpoints: {
                    base: 'http://gdata.youtube.com/',
                    userInfo: function(){
                        return utils.endpoints.base+'feeds/api/users/'+settings.user+'?v=2&alt=json';
                    },
                    userVids: function(){
                        return utils.endpoints.base+'feeds/api/users/'+settings.user+'/uploads/?v=2&alt=json&format=5&max-results=50';
                    },
                    userPlaylists: function(){
                        return utils.endpoints.base+'feeds/api/users/'+settings.user+'/playlists/?v=2&alt=json&format=5&max-results=50';
                    },
                    playlistVids: function(){
                        return utils.endpoints.base+'feeds/api/playlists/'+(settings.playlist)+'?v=2&alt=json&format=5&max-results=50';
                    }
                },
                deepExtend: function(destination, source) {
                    var property;
                    for (property in source) {
                        if (source[property] && source[property].constructor && source[property].constructor === Object) {
                            destination[property] = destination[property] || {};
                            utils.deepExtend(destination[property], source[property]);
                        } else {
                            destination[property] = source[property];
                        }
                    }
                    return destination;
                }
            },
            prepare = {
                youtube: function(fn){
                    var tag = doc.createElement('script');
                    tag.src = "https://www.youtube.com/iframe_api";
                    var firstScriptTag = doc.getElementsByTagName('script')[0];
                    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                    win.onYouTubeIframeAPIReady = fn;
                },
                build: function(){
                    settings.element.className = "ytv-canvas";
                    if(settings.fullscreen){
                        settings.element.className += " ytv-full";
                    }
                    utils.addCSS( '.ytv-list .ytv-active a{border-left-color: '+(settings.accent)+';}' );
                },
                playlists: function(res){
                    if(res && res.feed){
                        var list = '<div class="ytv-playlists"><ul>',
                            playlists = res.feed.entry,
                            i;
                        for(i=0; i<playlists.length; i++){
                            var data = {
                                title: playlists[i].title.$t,
                                plid: playlists[i].yt$playlistId.$t,
                                thumb: playlists[i].media$group.media$thumbnail[1].url
                            };
                            list += '<a href="#" data-ytv-playlist="'+(data.plid)+'">';
                                list += '<div class="ytv-thumb"><div class="ytv-thumb-stroke"></div><img src="'+(data.thumb)+'"></div>';
                                list += '<span>'+(data.title)+'</span>';
                            list += '</a>';
                        }
                        list += '</ul></div>';
                        
                        var lh = doc.getElementsByClassName('ytv-list-header')[0],
                            headerLink = lh.children[0];
                        headerLink.href="#";
                        headerLink.target="";
                        headerLink.setAttribute('data-ytv-playlist-toggle', 'true');
                        doc.getElementsByClassName('ytv-list-header')[0].innerHTML += list;
                        lh.className += ' ytv-has-playlists';
                    }
                },
                compileList: function(data){
                    if(data && data.feed){
                        utils.ajax.get( utils.endpoints.userInfo(), function(userInfo){
                            var list = '',
                                user = {
                                    title: userInfo.entry.title.$t,
                                    url: 'http://youtube.com/user/'+userInfo.entry.yt$username.display,
                                    thumb: userInfo.entry.media$thumbnail.url,
                                    summary: userInfo.entry.summary.$t,
                                    subscribers: userInfo.entry.yt$statistics.subscriberCount,
                                    views: userInfo.entry.yt$statistics.totalUploadViews
                                },
                                videos = data.feed.entry,
                                first = true,
                                i;
                            if(settings.playlist){
                                user.title += ' &middot; '+(data.feed.media$group.media$title.$t);
                            }
                            list += '<div class="ytv-list-header">';
                                list += '<a href="'+(user.url)+'" target="_blank">';
                                    list += '<img src="'+(user.thumb)+'">';
                                    list += '<span>'+(user.title)+' <i class="ytv-arrow down"></i></span>';
                                list += '</a>';
                            list += '</div>';
                            
                            list += '<div class="ytv-list-inner"><ul>';
                            for(i=0; i<videos.length; i++){
                                if(videos[i].media$group.yt$duration){
                                    var video = {
                                        title: videos[i].title.$t,
                                        slug: videos[i].media$group.yt$videoid.$t,
                                        link: videos[i].link[0].href,
                                        published: videos[i].published.$t,
                                        rating: videos[i].yt$rating,
                                        stats: videos[i].yt$statistics,
                                        duration: (videos[i].media$group.yt$duration.seconds),
                                        thumb: videos[i].media$group.media$thumbnail[1].url
                                    };
                                    
                                    var date = new Date(null);
                                    date.setSeconds(video.duration);
                                    var timeSlots = (date.toTimeString().substr(0, 8)).split(':'),
                                        time = timeSlots[1] + ':' + timeSlots[2];
                                    
                                    var isFirst = '';
                                    if(first===true){
                                        isFirst = ' class="ytv-active"';
                                        first = video.slug;
                                    }
                                    
                                    list += '<li'+isFirst+'><a href="#" data-ytv="'+(video.slug)+'" class="ytv-clear">';
                                    list += '<div class="ytv-thumb"><div class="ytv-thumb-stroke"></div><span>'+(time)+'</span><img src="'+(video.thumb)+'"></div>';
                                    list += '<div class="ytv-content"><b>'+(video.title)+'</b><span class="ytv-views">'+utils.addCommas(video.stats.viewCount)+' Views</span></div>';
                                    list += '</a></li>';
                                }
                            }
                            list += '</ul></div>';
                            settings.element.innerHTML = '<div class="ytv-relative"><div class="ytv-video"><div id="ytv-video-player"></div></div><div class="ytv-list">'+list+'</div></div>';
                            
                            action.logic.loadVideo(first, settings.autoplay);
                            
                            if(settings.browsePlaylists){
                                utils.ajax.get( utils.endpoints.userPlaylists(), prepare.playlists );
                            }
                            
                        });
                    }
                }
            },
            action = {
                
                logic: {
                    
                    playerStateChange: function(d){
                        console.log(d);
                    },
                    
                    loadVideo: function(slug, autoplay){
                        
                        var house = doc.getElementsByClassName('ytv-video')[0];
                        house.innerHTML = '<div id="ytv-video-player"></div>';
                        
                        cache.player = new YT.Player('ytv-video-player', {
                            videoId: slug,
                            events: {
                                onReady: settings.events.videoReady,
                                onStateChange: function(e){
                                    if( (e.target.getPlayerState()===0) && settings.chainVideos ){
                                        var ns = doc.getElementsByClassName('ytv-active')[0].nextSibling,
                                            link = ns.children[0];
                                        link.click();
                                    }
                                    settings.events.stateChange.call(this, e);
                                }
                            },
                            playerVars: {
                                enablejsapi: 1,
                                origin: doc.domain,
                                controls: settings.controls ? 1 : 0,
                                rel: 0,
                                showinfo: 0,
                                iv_load_policy: settings.annotations ? '' : 3, 
                                autoplay: autoplay ? 1 : 0
                            }
                        });
                        
                    }
                    
                },
                
                endpoints: {
                    videoClick: function(e){
                        var target = utils.parentUntil(e.target ? e.target : e.srcElement, 'data-ytv');
                        
                        if(target && target.dataset){
                        
                            if(target.dataset.ytv){
                                
                                // Load Video
                                utils.events.prevent(e);
                                
                                var activeEls = doc.getElementsByClassName('ytv-active'),
                                    i;
                                for(i=0; i<activeEls.length; i++){
                                    activeEls[i].className="";
                                }
                                target.parentNode.className="ytv-active";
                                action.logic.loadVideo(target.dataset.ytv, true);
                                
                            }
                        
                        }
                    },
                    playlistToggle: function(e){
                        var target = utils.parentUntil(e.target ? e.target : e.srcElement, 'data-ytv-playlist-toggle');
                        
                        if(target && target.dataset && target.dataset.ytvPlaylistToggle){
                            
                            // Toggle Playlist
                            utils.events.prevent(e);
                            var lh = doc.getElementsByClassName('ytv-list-header')[0];
                            if(lh.className.indexOf('ytv-playlist-open')===-1){
                                lh.className += ' ytv-playlist-open';
                            } else {
                                lh.className = lh.className.replace(' ytv-playlist-open', '');
                            }
                        }
                    },
                    playlistClick: function(e){
                        var target = utils.parentUntil(e.target ? e.target : e.srcElement, 'data-ytv-playlist');
                        
                        if(target && target.dataset && target.dataset.ytvPlaylist){
                            
                            // Load Playlist
                            utils.events.prevent(e);
                            
                            settings.playlist = target.dataset.ytvPlaylist;
                            target.children[1].innerHTML = 'Loading...';
                            
                            utils.ajax.get( utils.endpoints.playlistVids(), function(res){
                                var lh = doc.getElementsByClassName('ytv-list-header')[0];
                                lh.className = lh.className.replace(' ytv-playlist-open', '');
                                prepare.compileList(res);
                            });
                        }
                    }
                },
                loadAds: function(){
                    utils.ajax.get( utils.endpoints.adPlaylist(), function(data){
                        var videos = data.feed.entry,
                            i;
                        cache.ads = [];
                        for(i=0; i<videos.length; i++){
                            cache.ads.push({
                                title: videos[i].title.$t,
                                slug: videos[i].media$group.yt$videoid.$t,
                                duration: parseInt(videos[i].media$group.yt$duration.seconds, 10),
                            });
                        }
                    });
                },
                bindEvents: function(){
                    
                    utils.events.addEvent( settings.element, 'click', action.endpoints.videoClick );
                    utils.events.addEvent( settings.element, 'click', action.endpoints.playlistToggle );
                    utils.events.addEvent( settings.element, 'click', action.endpoints.playlistClick );
                    
                }
            },
            
            initialize = function(id, opts){
                utils.deepExtend(settings, opts);
                settings.element = (typeof id==='string') ? doc.getElementById(id) : id;
                if(settings.element && settings.user){
                    prepare.youtube(function(){
                        prepare.build();
                        action.bindEvents();
                        utils.ajax.get( settings.playlist ? utils.endpoints.playlistVids() : utils.endpoints.userVids(), prepare.compileList );
                    });
                }
            };
            
            /*
             * Public
             */
            this.destroy = function(){
                utils.events.removeEvent( settings.element, 'click', action.endpoints.videoClick );
                utils.events.removeEvent( settings.element, 'click', action.endpoints.playlistToggle );
                utils.events.removeEvent( settings.element, 'click', action.endpoints.playlistClick );
                settings.element.className = '';
                settings.element.innerHTML = '';
            };
            this.fullscreen = {
                state: function(){
                    return (settings.element.className).indexOf('ytv-full') !== -1;
                },
                enter: function(){
                    if( (settings.element.className).indexOf('ytv-full') === -1 ){
                        settings.element.className += 'ytv-full';
                    }
                },
                exit: function(){
                    if( (settings.element.className).indexOf('ytv-full') !== -1 ){
                        settings.element.className = (settings.element.className).replace('ytv-full', '');
                    }
                }
            };
            
        initialize(id, opts);
    };
    if ((typeof module !== 'undefined') && module.exports) {
        module.exports = YTV;
    }
    if (typeof ender === 'undefined') {
        this.YTV = YTV;
    }
    if ((typeof define === "function") && define.amd) {
        define("YTV", [], function() {
            return YTV;
        });
    }
    if ((typeof jQuery !== 'undefined')) {
        jQuery.fn.extend({
            ytv: function(options) {
                return this.each(function() {
                    new YTV(this, options);
                });
            }
        });
    }
}).call(this, window, document);