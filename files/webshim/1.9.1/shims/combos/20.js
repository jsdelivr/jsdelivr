(function(c,d,g){var q=d.audio&&d.video,t=!1,m=g.cfg.mediaelement,n=g.bugs,A=function(){g.ready("mediaelement-swf",function(){if(!g.mediaelement.createSWF)g.modules["mediaelement-swf"].test=c.noop,g.reTest(["mediaelement-swf"],q)})},o;if(q){var u=document.createElement("video");d.videoBuffered="buffered"in u;t="loop"in u;g.capturingEvents("play,playing,waiting,paused,ended,durationchange,loadedmetadata,canplay,volumechange".split(","));d.videoBuffered||(g.addPolyfill("mediaelement-native-fix",{f:"mediaelement",
test:d.videoBuffered,d:["dom-support"]}),g.reTest("mediaelement-native-fix"))}if(q&&!m.preferFlash){var r=function(w){var d=w.target.parentNode;!m.preferFlash&&(c(w.target).is("audio, video")||d&&c("source:last",d)[0]==w.target)&&g.ready("DOM mediaelement",function(){o&&A();g.ready("WINDOWLOAD mediaelement-swf",function(){setTimeout(function(){o&&!m.preferFlash&&g.mediaelement.createSWF&&!c(w.target).closest("audio, video").is(".nonnative-api-active")?(m.preferFlash=!0,document.removeEventListener("error",
r,!0),c("audio, video").mediaLoad(),g.info("switching mediaelements option to 'preferFlash', due to an error with native player: "+w.target.src)):o||document.removeEventListener("error",r,!0)},20)})})};document.addEventListener("error",r,!0);c("audio, video").each(function(){this.error&&r({target:this})})}n.track=!1;d.track&&function(){if(!n.track)n.track="number"!=typeof c("<track />")[0].readyState;if(!n.track)try{new TextTrackCue(2,3,"")}catch(d){n.track=!0}var i=g.cfg.track,m=function(d){c(d.target).filter("track").each(o)},
o=function(){if(n.track||!i.override&&3==c.prop(this,"readyState"))i.override=!0,g.reTest("track"),document.removeEventListener("error",m,!0),this&&c.nodeName(this,"track")?g.error("track support was overwritten. Please check your vtt including your vtt mime-type"):g.info("track support was overwritten. due to bad browser support")},p=function(){document.addEventListener("error",m,!0);n.track?o():c("track").each(o)};i.override||(g.isReady("track")?p():c(p))}();g.register("mediaelement-core",function(c,
i,g,r,p){o=swfobject.hasFlashPlayerVersion("9.0.115");var h=i.mediaelement,k=function(f,e){var f=c(f),d={src:f.attr("src")||"",elem:f,srcProp:f.prop("src")};if(!d.src)return d;var j=f.attr("type");if(j)d.type=j,d.container=c.trim(j.split(";")[0]);else if(e||(e=f[0].nodeName.toLowerCase(),"source"==e&&(e=(f.closest("video, audio")[0]||{nodeName:"video"}).nodeName.toLowerCase())),j=h.getTypeForSrc(d.src,e))d.type=j,d.container=j;if(j=f.attr("media"))d.media=j;return d},x=!o&&"postMessage"in g&&q,u=
function(){var f;return function(){!f&&x&&(f=!0,i.loader.loadScript("https://www.youtube.com/player_api"),c(function(){i.polyfill("mediaelement-yt")}))}}(),y=function(){o?A():u()};i.addPolyfill("mediaelement-yt",{test:!x,d:["dom-support"]});h.mimeTypes={audio:{"audio/ogg":["ogg","oga","ogm"],'audio/ogg;codecs="opus"':"opus","audio/mpeg":["mp2","mp3","mpga","mpega"],"audio/mp4":"mp4,mpg4,m4r,m4a,m4p,m4b,aac".split(","),"audio/wav":["wav"],"audio/3gpp":["3gp","3gpp"],"audio/webm":["webm"],"audio/fla":["flv",
"f4a","fla"],"application/x-mpegURL":["m3u8","m3u"]},video:{"video/ogg":["ogg","ogv","ogm"],"video/mpeg":["mpg","mpeg","mpe"],"video/mp4":["mp4","mpg4","m4v"],"video/quicktime":["mov","qt"],"video/x-msvideo":["avi"],"video/x-ms-asf":["asf","asx"],"video/flv":["flv","f4v"],"video/3gpp":["3gp","3gpp"],"video/webm":["webm"],"application/x-mpegURL":["m3u8","m3u"],"video/MP2T":["ts"]}};h.mimeTypes.source=c.extend({},h.mimeTypes.audio,h.mimeTypes.video);h.getTypeForSrc=function(f,e){if(-1!=f.indexOf("youtube.com/watch?")||
-1!=f.indexOf("youtube.com/v/"))return"video/youtube";var f=f.split("?")[0].split("."),f=f[f.length-1],d;c.each(h.mimeTypes[e],function(c,e){if(-1!==e.indexOf(f))return d=c,!1});return d};h.srces=function(f,e){f=c(f);if(e)f.removeAttr("src").removeAttr("type").find("source").remove(),c.isArray(e)||(e=[e]),e.forEach(function(c){var e=r.createElement("source");"string"==typeof c&&(c={src:c});e.setAttribute("src",c.src);c.type&&e.setAttribute("type",c.type);c.media&&e.setAttribute("media",c.media);f.append(e)});
else{var e=[],d=f[0].nodeName.toLowerCase(),j=k(f,d);j.src?e.push(j):c("source",f).each(function(){j=k(this,d);j.src&&e.push(j)});return e}};c.fn.loadMediaSrc=function(f,e){return this.each(function(){e!==p&&(c(this).removeAttr("poster"),e&&c.attr(this,"poster",e));h.srces(this,f);c(this).mediaLoad()})};h.swfMimeTypes="video/3gpp,video/x-msvideo,video/quicktime,video/x-m4v,video/mp4,video/m4p,video/x-flv,video/flv,audio/mpeg,audio/aac,audio/mp4,audio/x-m4a,audio/m4a,audio/mp3,audio/x-fla,audio/fla,youtube/flv,jwplayer/jwplayer,video/youtube".split(",");
h.canThirdPlaySrces=function(f,e){var d="";if(o||x)f=c(f),e=e||h.srces(f),c.each(e,function(c,f){if(f.container&&f.src&&(o&&-1!=h.swfMimeTypes.indexOf(f.container)||x&&"video/youtube"==f.container))return d=f,!1});return d};var l={};h.canNativePlaySrces=function(f,e){var d="";if(q){var f=c(f),j=(f[0].nodeName||"").toLowerCase();if(!l[j])return d;e=e||h.srces(f);c.each(e,function(c,e){if(e.type&&l[j].prop._supvalue.call(f[0],e.type))return d=e,!1})}return d};h.setError=function(f,e){e||(e="can't play sources");
c(f).pause().data("mediaerror",e);i.warn("mediaelementError: "+e);setTimeout(function(){c(f).data("mediaerror")&&c(f).trigger("mediaerror")},1)};var D=function(){var c;return function(e,d,j){i.ready(o?"mediaelement-swf":"mediaelement-yt",function(){h.createSWF?h.createSWF(e,d,j):c||(c=!0,y(),D(e,d,j))});!c&&x&&!h.createSWF&&u()}}(),B=function(c,e,d,j,i){d||!1!==d&&e&&"third"==e.isActive?(d=h.canThirdPlaySrces(c,j))?D(c,d,e):i?h.setError(c,!1):B(c,e,!1,j,!0):(d=h.canNativePlaySrces(c,j))?e&&"third"==
e.isActive&&h.setActive(c,"html5",e):i?(h.setError(c,!1),e&&"third"==e.isActive&&h.setActive(c,"html5",e)):B(c,e,!0,j,!0)},E=/^(?:embed|object|datalist)$/i,C=function(f,d){var g=i.data(f,"mediaelementBase")||i.data(f,"mediaelementBase",{}),j=h.srces(f),k=f.parentNode;clearTimeout(g.loadTimer);c.data(f,"mediaerror",!1);if(j.length&&k&&!(1!=k.nodeType||E.test(k.nodeName||"")))d=d||i.data(f,"mediaelement"),B(f,d,m.preferFlash||p,j)};c(r).bind("ended",function(d){var e=i.data(d.target,"mediaelement");
(!t||e&&"html5"!=e.isActive||c.prop(d.target,"loop"))&&setTimeout(function(){!c.prop(d.target,"paused")&&c.prop(d.target,"loop")&&c(d.target).prop("currentTime",0).play()},1)});t||i.defineNodeNamesBooleanProperty(["audio","video"],"loop");["audio","video"].forEach(function(d){var e=i.defineNodeNameProperty(d,"load",{prop:{value:function(){var c=i.data(this,"mediaelement");C(this,c);q&&(!c||"html5"==c.isActive)&&e.prop._supvalue&&e.prop._supvalue.apply(this,arguments)}}});l[d]=i.defineNodeNameProperty(d,
"canPlayType",{prop:{value:function(e){var j="";q&&l[d].prop._supvalue&&(j=l[d].prop._supvalue.call(this,e),"no"==j&&(j=""));!j&&o&&(e=c.trim((e||"").split(";")[0]),-1!=h.swfMimeTypes.indexOf(e)&&(j="maybe"));return j}}})});i.onNodeNamesPropertyModify(["audio","video"],["src","poster"],{set:function(){var c=this,d=i.data(c,"mediaelementBase")||i.data(c,"mediaelementBase",{});clearTimeout(d.loadTimer);d.loadTimer=setTimeout(function(){C(c);c=null},9)}});g=function(){i.addReady(function(d,e){c("video, audio",
d).add(e.filter("video, audio")).each(function(){c.browser.msie&&8<i.browserVersion&&c.prop(this,"paused")&&!c.prop(this,"readyState")&&c(this).is('audio[preload="none"][controls]:not([autoplay])')?c(this).prop("preload","metadata").mediaLoad():C(this);if(q){var d,e,f=this,h=function(){var d=c.prop(f,"buffered");if(d){for(var e="",h=0,j=d.length;h<j;h++)e+=d.end(h);return e}},g=function(){var d=h();d!=e&&(e=d,c(f).triggerHandler("progress"))};c(this).bind("play loadstart progress",function(c){"progress"==
c.type&&(e=h());clearTimeout(d);d=setTimeout(g,999)}).bind("emptied stalled mediaerror abort suspend",function(c){"emptied"==c.type&&(e=!1);clearTimeout(d)})}})})};d.track&&!n.track&&i.defineProperty(TextTrack.prototype,"shimActiveCues",{get:function(){return this._shimActiveCues||this.activeCues}});q?(i.isReady("mediaelement-core",!0),g(),i.ready("WINDOWLOAD mediaelement",y)):i.ready("mediaelement-swf",g);c(function(){i.loader.loadList(["track-ui"])})})})(jQuery,Modernizr,jQuery.webshims);
jQuery.webshims.register("mediaelement-swf",function(c,d,g,q,t,m){var n=d.mediaelement,A=g.swfobject,o=Modernizr.audio&&Modernizr.video,u=A.hasFlashPlayerVersion("9.0.115"),r=0,g={paused:!0,ended:!1,currentSrc:"",duration:g.NaN,readyState:0,networkState:0,videoHeight:0,videoWidth:0,error:null,buffered:{start:function(a){if(a)d.error("buffered index size error");else return 0},end:function(a){if(a)d.error("buffered index size error");else return 0},length:0}},w=Object.keys(g),i={currentTime:0,volume:1,
muted:!1};Object.keys(i);var H=c.extend({isActive:"html5",activating:"html5",wasSwfReady:!1,_bufferedEnd:0,_bufferedStart:0,_metadata:!1,_durationCalcs:-1,_callMeta:!1,currentTime:0,_ppFlag:t},g,i),G=/^jwplayer-/,p=function(a){if(a=q.getElementById(a.replace(G,"")))return a=d.data(a,"mediaelement"),"third"==a.isActive?a:null},h=function(a){return(a=d.data(a,"mediaelement"))&&"third"==a.isActive?a:null},k=function(a,b){b=c.Event(b);b.preventDefault();c.event.trigger(b,t,a)},x=m.playerPath||d.cfg.basePath+
"jwplayer/"+(m.playerName||"player.swf"),I=m.pluginPath||d.cfg.basePath+"swf/jwwebshims.swf";d.extendUNDEFProp(m.jwParams,{allowscriptaccess:"always",allowfullscreen:"true",wmode:"transparent"});d.extendUNDEFProp(m.jwVars,{screencolor:"ffffffff"});d.extendUNDEFProp(m.jwAttrs,{bgcolor:"#000000"});var y=function(a,b){var d=a.duration;if(!(d&&0<a._durationCalcs)){try{if(a.duration=a.jwapi.getPlaylist()[0].duration,!a.duration||0>=a.duration||a.duration===a._lastDuration)a.duration=d}catch(e){}a.duration&&
a.duration!=a._lastDuration?(k(a._elem,"durationchange"),("audio"==a._elemNodeName||a._callMeta)&&n.jwEvents.Model.META(c.extend({duration:a.duration},b),a),a._durationCalcs--):a._durationCalcs++}},l=function(a,b){3>a&&clearTimeout(b._canplaythroughTimer);if(3<=a&&3>b.readyState)b.readyState=a,k(b._elem,"canplay"),clearTimeout(b._canplaythroughTimer),b._canplaythroughTimer=setTimeout(function(){l(4,b)},4E3);if(4<=a&&4>b.readyState)b.readyState=a,k(b._elem,"canplaythrough");b.readyState=a};c.extend(c.event.customEvent,
{updatemediaelementdimensions:!0,flashblocker:!0,swfstageresize:!0,mediaelementapichange:!0});n.jwEvents={View:{PLAY:function(a){var b=p(a.id);if(b&&!b.stopPlayPause&&(b._ppFlag=!0,b.paused==a.state)){b.paused=!a.state;if(b.ended)b.ended=!1;k(b._elem,a.state?"play":"pause")}}},Model:{BUFFER:function(a){var b=p(a.id);if(b&&"percentage"in a&&b._bufferedEnd!=a.percentage){b.networkState=100==a.percentage?1:2;(isNaN(b.duration)||5<a.percentage&&25>a.percentage||100===a.percentage)&&y(b,a);if(b.ended)b.ended=
!1;if(b.duration){2<a.percentage&&20>a.percentage?l(3,b):20<a.percentage&&l(4,b);if(b._bufferedEnd&&b._bufferedEnd>a.percentage)b._bufferedStart=b.currentTime||0;b._bufferedEnd=a.percentage;b.buffered.length=1;if(100==a.percentage)b.networkState=1,l(4,b);c.event.trigger("progress",t,b._elem,!0)}}},META:function(a,b){if(b=b&&b.networkState?b:p(a.id))if("duration"in a){if(!b._metadata||!((!a.height||b.videoHeight==a.height)&&a.duration===b.duration)){b._metadata=!0;var c=b.duration;if(a.duration)b.duration=
a.duration;b._lastDuration=b.duration;if(a.height||a.width)b.videoHeight=a.height||0,b.videoWidth=a.width||0;if(!b.networkState)b.networkState=2;1>b.readyState&&l(1,b);b.duration&&c!==b.duration&&k(b._elem,"durationchange");k(b._elem,"loadedmetadata")}}else b._callMeta=!0},TIME:function(a){var b=p(a.id);if(b&&b.currentTime!==a.position){b.currentTime=a.position;b.duration&&b.duration<b.currentTime&&y(b,a);2>b.readyState&&l(2,b);if(b.ended)b.ended=!1;k(b._elem,"timeupdate")}},STATE:function(a){var b=
p(a.id);if(b)switch(a.newstate){case "BUFFERING":if(b.ended)b.ended=!1;l(1,b);k(b._elem,"waiting");break;case "PLAYING":b.paused=!1;b._ppFlag=!0;b.duration||y(b,a);3>b.readyState&&l(3,b);if(b.ended)b.ended=!1;k(b._elem,"playing");break;case "PAUSED":if(!b.paused&&!b.stopPlayPause)b.paused=!0,b._ppFlag=!0,k(b._elem,"pause");break;case "COMPLETED":4>b.readyState&&l(4,b),b.ended=!0,k(b._elem,"ended")}}},Controller:{ERROR:function(a){var b=p(a.id);b&&n.setError(b._elem,a.message)},SEEK:function(a){var b=
p(a.id);if(b){if(b.ended)b.ended=!1;if(b.paused)try{b.jwapi.sendEvent("play","false")}catch(c){}if(b.currentTime!=a.position)b.currentTime=a.position,k(b._elem,"timeupdate")}},VOLUME:function(a){var b=p(a.id);if(b&&(a=a.percentage/100,b.volume!=a))b.volume=a,k(b._elem,"volumechange")},MUTE:function(a){if(!a.state){var b=p(a.id);if(b&&b.muted!=a.state)b.muted=a.state,k(b._elem,"volumechange")}}}};var D=function(a){var b=!0;c.each(n.jwEvents,function(d,e){c.each(e,function(c){try{a.jwapi["add"+d+"Listener"](c,
"jQuery.webshims.mediaelement.jwEvents."+d+"."+c)}catch(e){return b=!1}})});return b},B=function(a){var b=a.actionQueue.length,c=0,d;if(b&&"third"==a.isActive)for(;a.actionQueue.length&&b>c;)c++,d=a.actionQueue.shift(),a.jwapi[d.fn].apply(a.jwapi,d.args);if(a.actionQueue.length)a.actionQueue=[]},E=function(a){a&&(a._ppFlag===t&&c.prop(a._elem,"autoplay")||!a.paused)&&setTimeout(function(){if("third"==a.isActive&&(a._ppFlag===t||!a.paused))try{c(a._elem).play()}catch(b){}},1)},C=function(a){if(a&&
"video"==a._elemNodeName){var b,d,e,f,v,s,h,j,g=function(g,i){if(i&&g&&!(1>i||1>g||"third"!=a.isActive))if(b&&(b.remove(),b=!1),f=g,v=i,clearTimeout(h),d="auto"==a._elem.style.width,e="auto"==a._elem.style.height,d||e){s=s||c(a._elem).getShadowElement();var k;d&&!e?(k=s.height(),g*=k/i,i=k):!d&&e&&(k=s.width(),i*=k/g,g=k);j=!0;setTimeout(function(){j=!1},9);s.css({width:g,height:i})}},i=function(){if(!("third"!=a.isActive||c.prop(a._elem,"readyState")&&c.prop(this,"videoWidth"))){var f=c.prop(a._elem,
"poster");if(f&&(d="auto"==a._elem.style.width,e="auto"==a._elem.style.height,d||e))b&&(b.remove(),b=!1),b=c('<img style="position: absolute; height: auto; width: auto; top: 0px; left: 0px; visibility: hidden;" />'),b.bind("load error alreadycomplete",function(){clearTimeout(h);var a=this,d=a.naturalWidth||a.width||a.offsetWidth,e=a.naturalHeight||a.height||a.offsetHeight;e&&d?(g(d,e),a=null):setTimeout(function(){d=a.naturalWidth||a.width||a.offsetWidth;e=a.naturalHeight||a.height||a.offsetHeight;
g(d,e);b&&(b.remove(),b=!1);a=null},9);c(this).unbind()}).prop("src",f).appendTo("body").each(function(){this.complete||this.error?c(this).triggerHandler("alreadycomplete"):(clearTimeout(h),h=setTimeout(function(){c(a._elem).triggerHandler("error")},9999))})}};c(a._elem).bind("loadedmetadata",function(){g(c.prop(this,"videoWidth"),c.prop(this,"videoHeight"))}).bind("emptied",i).bind("swfstageresize updatemediaelementdimensions",function(){j||g(f,v)}).bind("emptied",function(){f=void 0;v=void 0}).triggerHandler("swfstageresize");
i();c.prop(a._elem,"readyState")&&g(c.prop(a._elem,"videoWidth"),c.prop(a._elem,"videoHeight"))}};n.playerResize=function(a){a&&(a=q.getElementById(a.replace(G,"")))&&c(a).triggerHandler("swfstageresize")};c(q).bind("emptied",function(a){a=h(a.target);E(a)});var f;n.jwPlayerReady=function(a){var b=p(a.id),e=0,g=function(){if(!(9<e))if(e++,D(b)){if(b.wasSwfReady)c(b._elem).mediaLoad();else{var f=parseFloat(a.version,10);(5.1>f||6<=f)&&d.warn("mediaelement-swf is only testet with jwplayer 5.6+")}b.wasSwfReady=
!0;b.tryedReframeing=0;B(b);E(b)}else clearTimeout(b.reframeTimer),b.reframeTimer=setTimeout(g,9*e),2<e&&9>b.tryedReframeing&&(b.tryedReframeing++,b.shadowElem.css({overflow:"visible"}),setTimeout(function(){b.shadowElem.css({overflow:"hidden"})},16))};if(b&&b.jwapi){if(!b.tryedReframeing)b.tryedReframeing=0;clearTimeout(f);b.jwData=a;b.shadowElem.removeClass("flashblocker-assumed");c.prop(b._elem,"volume",b.volume);c.prop(b._elem,"muted",b.muted);g()}};var e=c.noop;if(o){var K={play:1,playing:1},
j="play,pause,playing,canplay,progress,waiting,ended,loadedmetadata,durationchange,emptied".split(","),J=j.map(function(a){return a+".webshimspolyfill"}).join(" "),L=function(a){var b=d.data(a.target,"mediaelement");b&&(a.originalEvent&&a.originalEvent.type===a.type)==("third"==b.activating)&&(a.stopImmediatePropagation(),K[a.type]&&b.isActive!=b.activating&&c(a.target).pause())},e=function(a){c(a).unbind(J).bind(J,L);j.forEach(function(b){d.moveToFirstEvent(a,b)})};e(q)}n.setActive=function(a,b,
e){e||(e=d.data(a,"mediaelement"));if(e&&e.isActive!=b){"html5"!=b&&"third"!=b&&d.warn("wrong type for mediaelement activating: "+b);var f=d.data(a,"shadowData");e.activating=b;c(a).pause();e.isActive=b;"third"==b?(f.shadowElement=f.shadowFocusElement=e.shadowElem[0],c(a).addClass("swf-api-active nonnative-api-active").hide().getShadowElement().show()):(c(a).removeClass("swf-api-active nonnative-api-active").show().getShadowElement().hide(),f.shadowElement=f.shadowFocusElement=!1);c(a).trigger("mediaelementapichange")}};
var O=function(){var a="_bufferedEnd,_bufferedStart,_metadata,_ppFlag,currentSrc,currentTime,duration,ended,networkState,paused,videoHeight,videoWidth,_callMeta,_durationCalcs".split(","),b=a.length;return function(c){if(c){var d=b,e=c.networkState;for(l(0,c);--d;)delete c[a[d]];c.actionQueue=[];c.buffered.length=0;e&&k(c._elem,"emptied")}}}(),F=function(a,b){var d=a._elem,e=a.shadowElem;c(d)[b?"addClass":"removeClass"]("webshims-controls");"audio"==a._elemNodeName&&!b?e.css({width:0,height:0}):e.css({width:d.style.width||
c(d).width(),height:d.style.height||c(d).height()})};n.createSWF=function(a,b,g){if(u){1>r?r=1:r++;var h=c.extend({},m.jwVars,{image:c.prop(a,"poster")||"",file:b.srcProp}),i=c(a).data("jwvars")||{};g||(g=d.data(a,"mediaelement"));if(g&&g.swfCreated)n.setActive(a,"third",g),O(g),g.currentSrc=b.srcProp,c.extend(h,i),m.changeJW(h,a,b,g,"load"),z(a,"sendEvent",["LOAD",h]);else{var v=c.prop(a,"controls"),s="jwplayer-"+d.getID(a),j=c.extend({},m.jwParams,c(a).data("jwparams")),k=a.nodeName.toLowerCase(),
p=c.extend({},m.jwAttrs,{name:s,id:s},c(a).data("jwattrs")),l=c('<div class="polyfill-'+k+' polyfill-mediaelement" id="wrapper-'+s+'"><div id="'+s+'"></div>').css({position:"relative",overflow:"hidden"}),g=d.data(a,"mediaelement",d.objectCreate(H,{actionQueue:{value:[]},shadowElem:{value:l},_elemNodeName:{value:k},_elem:{value:a},currentSrc:{value:b.srcProp},swfCreated:{value:!0},buffered:{value:{start:function(a){if(a>=g.buffered.length)d.error("buffered index size error");else return 0},end:function(a){if(a>=
g.buffered.length)d.error("buffered index size error");else return(g.duration-g._bufferedStart)*g._bufferedEnd/100+g._bufferedStart},length:0}}}));F(g,v);l.insertBefore(a);o&&c.extend(g,{volume:c.prop(a,"volume"),muted:c.prop(a,"muted")});c.extend(h,{id:s,controlbar:v?m.jwVars.controlbar||("video"==k?"over":"bottom"):"video"==k?"none":"bottom",icons:""+(v&&"video"==k)},i,{playerready:"jQuery.webshims.mediaelement.jwPlayerReady"});h.plugins=h.plugins?h.plugins+(","+I):I;d.addShadowDom(a,l);e(a);n.setActive(a,
"third",g);m.changeJW(h,a,b,g,"embed");c(a).bind("updatemediaelementdimensions updateshadowdom",function(){F(g,c.prop(a,"controls"))});C(g);A.embedSWF(x,s,"100%","100%","9.0.0",!1,h,j,p,function(b){if(b.success)g.jwapi=b.ref,v||c(b.ref).attr("tabindex","-1").css("outline","none"),setTimeout(function(){if(!b.ref.parentNode&&l[0].parentNode||"none"==b.ref.style.display)l.addClass("flashblocker-assumed"),c(a).trigger("flashblocker"),d.warn("flashblocker assumed");c(b.ref).css({minHeight:"2px",minWidth:"2px",
display:"block"})},9),f||(clearTimeout(f),f=setTimeout(function(){var a=c(b.ref);1<a[0].offsetWidth&&1<a[0].offsetHeight&&0===location.protocol.indexOf("file:")?d.error("Add your local development-directory to the local-trusted security sandbox:  http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html"):(2>a[0].offsetWidth||2>a[0].offsetHeight)&&d.info("JS-SWF connection can't be established on hidden or unconnected flash objects")},8E3))})}}else setTimeout(function(){c(a).mediaLoad()},
1)};var z=function(a,b,c,d){return(d=d||h(a))?(d.jwapi&&d.jwapi[b]?d.jwapi[b].apply(d.jwapi,c||[]):(d.actionQueue.push({fn:b,args:c}),10<d.actionQueue.length&&setTimeout(function(){5<d.actionQueue.length&&d.actionQueue.shift()},99)),d):!1};["audio","video"].forEach(function(a){var b={},e,f=function(c){"audio"==a&&("videoHeight"==c||"videoWidth"==c)||(b[c]={get:function(){var a=h(this);return a?a[c]:o&&e[c].prop._supget?e[c].prop._supget.apply(this):H[c]},writeable:!1})},g=function(a,c){f(a);delete b[a].writeable;
b[a].set=c};g("volume",function(a){var b=h(this);if(b){if(a*=100,!isNaN(a)){var c=b.muted;(0>a||100<a)&&d.error("volume greater or less than allowed "+a/100);z(this,"sendEvent",["VOLUME",a],b);if(c)try{b.jwapi.sendEvent("mute","true")}catch(f){}a/=100;if(!(b.volume==a||"third"!=b.isActive))b.volume=a,k(b._elem,"volumechange")}}else if(e.volume.prop._supset)return e.volume.prop._supset.apply(this,arguments)});g("muted",function(a){var b=h(this);if(b){if(a=!!a,z(this,"sendEvent",["mute",""+a],b),!(b.muted==
a||"third"!=b.isActive))b.muted=a,k(b._elem,"volumechange")}else if(e.muted.prop._supset)return e.muted.prop._supset.apply(this,arguments)});g("currentTime",function(a){var b=h(this);if(b){if(a*=1,!isNaN(a)){if(b.paused)clearTimeout(b.stopPlayPause),b.stopPlayPause=setTimeout(function(){b.paused=!0;b.stopPlayPause=!1},50);z(this,"sendEvent",["SEEK",""+a],b);if(b.paused){if(0<b.readyState)b.currentTime=a,k(b._elem,"timeupdate");try{b.jwapi.sendEvent("play","false")}catch(c){}}}}else if(e.currentTime.prop._supset)return e.currentTime.prop._supset.apply(this,
arguments)});["play","pause"].forEach(function(a){b[a]={value:function(){var b=h(this);if(b)b.stopPlayPause&&clearTimeout(b.stopPlayPause),z(this,"sendEvent",["play","play"==a],b),setTimeout(function(){if("third"==b.isActive&&(b._ppFlag=!0,b.paused!=("play"!=a)))b.paused="play"!=a,k(b._elem,a)},1);else if(e[a].prop._supvalue)return e[a].prop._supvalue.apply(this,arguments)}}});w.forEach(f);d.onNodeNamesPropertyModify(a,"controls",function(b,e){var f=h(this);c(this)[e?"addClass":"removeClass"]("webshims-controls");
if(f){try{z(this,e?"showControls":"hideControls",[a],f)}catch(g){d.warn("you need to generate a crossdomain.xml")}"audio"==a&&F(f,e);c(f.jwapi).attr("tabindex",e?"0":"-1")}});e=d.defineNodeNameProperties(a,b,"prop")});if(u){var M=c.cleanData,N=c.browser.msie&&9>d.browserVersion,P={object:1,OBJECT:1};c.cleanData=function(a){var b,c,d;if(a&&(c=a.length)&&r)for(b=0;b<c;b++)if(P[a[b].nodeName]){if("sendEvent"in a[b]){r--;try{a[b].sendEvent("play",!1)}catch(e){}}if(N)try{for(d in a[b])"function"==typeof a[b][d]&&
(a[b][d]=null)}catch(f){}}return M.apply(this,arguments)}}o||(["poster","src"].forEach(function(a){d.defineNodeNamesProperty("src"==a?["audio","video","source"]:["video"],a,{reflect:!0,propType:"src"})}),["autoplay","controls"].forEach(function(a){d.defineNodeNamesBooleanProperty(["audio","video"],a)}),d.defineNodeNamesProperties(["audio","video"],{HAVE_CURRENT_DATA:{value:2},HAVE_ENOUGH_DATA:{value:4},HAVE_FUTURE_DATA:{value:3},HAVE_METADATA:{value:1},HAVE_NOTHING:{value:0},NETWORK_EMPTY:{value:0},
NETWORK_IDLE:{value:1},NETWORK_LOADING:{value:2},NETWORK_NO_SOURCE:{value:3}},"prop"))});
