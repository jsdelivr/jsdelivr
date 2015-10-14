;(function($, window) {/*!
 * VERSION: 1.12.1
 * DATE: 2014-06-26
 * UPDATES AND DOCS AT: http://www.greensock.com
 * 
 * Includes all of the following: TweenLite, TweenMax, TimelineLite, TimelineMax, EasePack, CSSPlugin, RoundPropsPlugin, BezierPlugin, AttrPlugin, DirectionalRotationPlugin
 *
 * @license Copyright (c) 2008-2014, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
(window._gsQueue||(window._gsQueue=[])).push(function(){"use strict";window._gsDefine("TweenMax",["core.Animation","core.SimpleTimeline","TweenLite"],function(t,e,i){var s=[].slice,r=function(t,e,s){i.call(this,t,e,s),this._cycle=0,this._yoyo=this.vars.yoyo===!0,this._repeat=this.vars.repeat||0,this._repeatDelay=this.vars.repeatDelay||0,this._dirty=!0,this.render=r.prototype.render},n=1e-10,a=i._internals,o=a.isSelector,h=a.isArray,l=r.prototype=i.to({},.1,{}),_=[];r.version="1.12.1",l.constructor=r,l.kill()._gc=!1,r.killTweensOf=r.killDelayedCallsTo=i.killTweensOf,r.getTweensOf=i.getTweensOf,r.lagSmoothing=i.lagSmoothing,r.ticker=i.ticker,r.render=i.render,l.invalidate=function(){return this._yoyo=this.vars.yoyo===!0,this._repeat=this.vars.repeat||0,this._repeatDelay=this.vars.repeatDelay||0,this._uncache(!0),i.prototype.invalidate.call(this)},l.updateTo=function(t,e){var s,r=this.ratio;e&&this._startTime<this._timeline._time&&(this._startTime=this._timeline._time,this._uncache(!1),this._gc?this._enabled(!0,!1):this._timeline.insert(this,this._startTime-this._delay));for(s in t)this.vars[s]=t[s];if(this._initted)if(e)this._initted=!1;else if(this._gc&&this._enabled(!0,!1),this._notifyPluginsOfEnabled&&this._firstPT&&i._onPluginEvent("_onDisable",this),this._time/this._duration>.998){var n=this._time;this.render(0,!0,!1),this._initted=!1,this.render(n,!0,!1)}else if(this._time>0){this._initted=!1,this._init();for(var a,o=1/(1-r),h=this._firstPT;h;)a=h.s+h.c,h.c*=o,h.s=a-h.c,h=h._next}return this},l.render=function(t,e,i){this._initted||0===this._duration&&this.vars.repeat&&this.invalidate();var s,r,o,h,l,u,p,f,c=this._dirty?this.totalDuration():this._totalDuration,m=this._time,d=this._totalTime,g=this._cycle,v=this._duration,y=this._rawPrevTime;if(t>=c?(this._totalTime=c,this._cycle=this._repeat,this._yoyo&&0!==(1&this._cycle)?(this._time=0,this.ratio=this._ease._calcEnd?this._ease.getRatio(0):0):(this._time=v,this.ratio=this._ease._calcEnd?this._ease.getRatio(1):1),this._reversed||(s=!0,r="onComplete"),0===v&&(this._initted||!this.vars.lazy||i)&&(this._startTime===this._timeline._duration&&(t=0),(0===t||0>y||y===n)&&y!==t&&(i=!0,y>n&&(r="onReverseComplete")),this._rawPrevTime=f=!e||t||y===t?t:n)):1e-7>t?(this._totalTime=this._time=this._cycle=0,this.ratio=this._ease._calcEnd?this._ease.getRatio(0):0,(0!==d||0===v&&y>0&&y!==n)&&(r="onReverseComplete",s=this._reversed),0>t?(this._active=!1,0===v&&(this._initted||!this.vars.lazy||i)&&(y>=0&&(i=!0),this._rawPrevTime=f=!e||t||y===t?t:n)):this._initted||(i=!0)):(this._totalTime=this._time=t,0!==this._repeat&&(h=v+this._repeatDelay,this._cycle=this._totalTime/h>>0,0!==this._cycle&&this._cycle===this._totalTime/h&&this._cycle--,this._time=this._totalTime-this._cycle*h,this._yoyo&&0!==(1&this._cycle)&&(this._time=v-this._time),this._time>v?this._time=v:0>this._time&&(this._time=0)),this._easeType?(l=this._time/v,u=this._easeType,p=this._easePower,(1===u||3===u&&l>=.5)&&(l=1-l),3===u&&(l*=2),1===p?l*=l:2===p?l*=l*l:3===p?l*=l*l*l:4===p&&(l*=l*l*l*l),this.ratio=1===u?1-l:2===u?l:.5>this._time/v?l/2:1-l/2):this.ratio=this._ease.getRatio(this._time/v)),m===this._time&&!i&&g===this._cycle)return d!==this._totalTime&&this._onUpdate&&(e||this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||_)),void 0;if(!this._initted){if(this._init(),!this._initted||this._gc)return;if(!i&&this._firstPT&&(this.vars.lazy!==!1&&this._duration||this.vars.lazy&&!this._duration))return this._time=m,this._totalTime=d,this._rawPrevTime=y,this._cycle=g,a.lazyTweens.push(this),this._lazy=t,void 0;this._time&&!s?this.ratio=this._ease.getRatio(this._time/v):s&&this._ease._calcEnd&&(this.ratio=this._ease.getRatio(0===this._time?0:1))}for(this._lazy!==!1&&(this._lazy=!1),this._active||!this._paused&&this._time!==m&&t>=0&&(this._active=!0),0===d&&(2===this._initted&&t>0&&this._init(),this._startAt&&(t>=0?this._startAt.render(t,e,i):r||(r="_dummyGS")),this.vars.onStart&&(0!==this._totalTime||0===v)&&(e||this.vars.onStart.apply(this.vars.onStartScope||this,this.vars.onStartParams||_))),o=this._firstPT;o;)o.f?o.t[o.p](o.c*this.ratio+o.s):o.t[o.p]=o.c*this.ratio+o.s,o=o._next;this._onUpdate&&(0>t&&this._startAt&&this._startTime&&this._startAt.render(t,e,i),e||(this._totalTime!==d||s)&&this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||_)),this._cycle!==g&&(e||this._gc||this.vars.onRepeat&&this.vars.onRepeat.apply(this.vars.onRepeatScope||this,this.vars.onRepeatParams||_)),r&&(this._gc||(0>t&&this._startAt&&!this._onUpdate&&this._startTime&&this._startAt.render(t,e,i),s&&(this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[r]&&this.vars[r].apply(this.vars[r+"Scope"]||this,this.vars[r+"Params"]||_),0===v&&this._rawPrevTime===n&&f!==n&&(this._rawPrevTime=0)))},r.to=function(t,e,i){return new r(t,e,i)},r.from=function(t,e,i){return i.runBackwards=!0,i.immediateRender=0!=i.immediateRender,new r(t,e,i)},r.fromTo=function(t,e,i,s){return s.startAt=i,s.immediateRender=0!=s.immediateRender&&0!=i.immediateRender,new r(t,e,s)},r.staggerTo=r.allTo=function(t,e,n,a,l,u,p){a=a||0;var f,c,m,d,g=n.delay||0,v=[],y=function(){n.onComplete&&n.onComplete.apply(n.onCompleteScope||this,arguments),l.apply(p||this,u||_)};for(h(t)||("string"==typeof t&&(t=i.selector(t)||t),o(t)&&(t=s.call(t,0))),f=t.length,m=0;f>m;m++){c={};for(d in n)c[d]=n[d];c.delay=g,m===f-1&&l&&(c.onComplete=y),v[m]=new r(t[m],e,c),g+=a}return v},r.staggerFrom=r.allFrom=function(t,e,i,s,n,a,o){return i.runBackwards=!0,i.immediateRender=0!=i.immediateRender,r.staggerTo(t,e,i,s,n,a,o)},r.staggerFromTo=r.allFromTo=function(t,e,i,s,n,a,o,h){return s.startAt=i,s.immediateRender=0!=s.immediateRender&&0!=i.immediateRender,r.staggerTo(t,e,s,n,a,o,h)},r.delayedCall=function(t,e,i,s,n){return new r(e,0,{delay:t,onComplete:e,onCompleteParams:i,onCompleteScope:s,onReverseComplete:e,onReverseCompleteParams:i,onReverseCompleteScope:s,immediateRender:!1,useFrames:n,overwrite:0})},r.set=function(t,e){return new r(t,0,e)},r.isTweening=function(t){return i.getTweensOf(t,!0).length>0};var u=function(t,e){for(var s=[],r=0,n=t._first;n;)n instanceof i?s[r++]=n:(e&&(s[r++]=n),s=s.concat(u(n,e)),r=s.length),n=n._next;return s},p=r.getAllTweens=function(e){return u(t._rootTimeline,e).concat(u(t._rootFramesTimeline,e))};r.killAll=function(t,i,s,r){null==i&&(i=!0),null==s&&(s=!0);var n,a,o,h=p(0!=r),l=h.length,_=i&&s&&r;for(o=0;l>o;o++)a=h[o],(_||a instanceof e||(n=a.target===a.vars.onComplete)&&s||i&&!n)&&(t?a.totalTime(a._reversed?0:a.totalDuration()):a._enabled(!1,!1))},r.killChildTweensOf=function(t,e){if(null!=t){var n,l,_,u,p,f=a.tweenLookup;if("string"==typeof t&&(t=i.selector(t)||t),o(t)&&(t=s.call(t,0)),h(t))for(u=t.length;--u>-1;)r.killChildTweensOf(t[u],e);else{n=[];for(_ in f)for(l=f[_].target.parentNode;l;)l===t&&(n=n.concat(f[_].tweens)),l=l.parentNode;for(p=n.length,u=0;p>u;u++)e&&n[u].totalTime(n[u].totalDuration()),n[u]._enabled(!1,!1)}}};var f=function(t,i,s,r){i=i!==!1,s=s!==!1,r=r!==!1;for(var n,a,o=p(r),h=i&&s&&r,l=o.length;--l>-1;)a=o[l],(h||a instanceof e||(n=a.target===a.vars.onComplete)&&s||i&&!n)&&a.paused(t)};return r.pauseAll=function(t,e,i){f(!0,t,e,i)},r.resumeAll=function(t,e,i){f(!1,t,e,i)},r.globalTimeScale=function(e){var s=t._rootTimeline,r=i.ticker.time;return arguments.length?(e=e||n,s._startTime=r-(r-s._startTime)*s._timeScale/e,s=t._rootFramesTimeline,r=i.ticker.frame,s._startTime=r-(r-s._startTime)*s._timeScale/e,s._timeScale=t._rootTimeline._timeScale=e,e):s._timeScale},l.progress=function(t){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&0!==(1&this._cycle)?1-t:t)+this._cycle*(this._duration+this._repeatDelay),!1):this._time/this.duration()},l.totalProgress=function(t){return arguments.length?this.totalTime(this.totalDuration()*t,!1):this._totalTime/this.totalDuration()},l.time=function(t,e){return arguments.length?(this._dirty&&this.totalDuration(),t>this._duration&&(t=this._duration),this._yoyo&&0!==(1&this._cycle)?t=this._duration-t+this._cycle*(this._duration+this._repeatDelay):0!==this._repeat&&(t+=this._cycle*(this._duration+this._repeatDelay)),this.totalTime(t,e)):this._time},l.duration=function(e){return arguments.length?t.prototype.duration.call(this,e):this._duration},l.totalDuration=function(t){return arguments.length?-1===this._repeat?this:this.duration((t-this._repeat*this._repeatDelay)/(this._repeat+1)):(this._dirty&&(this._totalDuration=-1===this._repeat?999999999999:this._duration*(this._repeat+1)+this._repeatDelay*this._repeat,this._dirty=!1),this._totalDuration)},l.repeat=function(t){return arguments.length?(this._repeat=t,this._uncache(!0)):this._repeat},l.repeatDelay=function(t){return arguments.length?(this._repeatDelay=t,this._uncache(!0)):this._repeatDelay},l.yoyo=function(t){return arguments.length?(this._yoyo=t,this):this._yoyo},r},!0),window._gsDefine("TimelineLite",["core.Animation","core.SimpleTimeline","TweenLite"],function(t,e,i){var s=function(t){e.call(this,t),this._labels={},this.autoRemoveChildren=this.vars.autoRemoveChildren===!0,this.smoothChildTiming=this.vars.smoothChildTiming===!0,this._sortChildren=!0,this._onUpdate=this.vars.onUpdate;var i,s,r=this.vars;for(s in r)i=r[s],a(i)&&-1!==i.join("").indexOf("{self}")&&(r[s]=this._swapSelfInParams(i));a(r.tweens)&&this.add(r.tweens,0,r.align,r.stagger)},r=1e-10,n=i._internals.isSelector,a=i._internals.isArray,o=[],h=window._gsDefine.globals,l=function(t){var e,i={};for(e in t)i[e]=t[e];return i},_=function(t,e,i,s){t._timeline.pause(t._startTime),e&&e.apply(s||t._timeline,i||o)},u=o.slice,p=s.prototype=new e;return s.version="1.12.1",p.constructor=s,p.kill()._gc=!1,p.to=function(t,e,s,r){var n=s.repeat&&h.TweenMax||i;return e?this.add(new n(t,e,s),r):this.set(t,s,r)},p.from=function(t,e,s,r){return this.add((s.repeat&&h.TweenMax||i).from(t,e,s),r)},p.fromTo=function(t,e,s,r,n){var a=r.repeat&&h.TweenMax||i;return e?this.add(a.fromTo(t,e,s,r),n):this.set(t,r,n)},p.staggerTo=function(t,e,r,a,o,h,_,p){var f,c=new s({onComplete:h,onCompleteParams:_,onCompleteScope:p,smoothChildTiming:this.smoothChildTiming});for("string"==typeof t&&(t=i.selector(t)||t),n(t)&&(t=u.call(t,0)),a=a||0,f=0;t.length>f;f++)r.startAt&&(r.startAt=l(r.startAt)),c.to(t[f],e,l(r),f*a);return this.add(c,o)},p.staggerFrom=function(t,e,i,s,r,n,a,o){return i.immediateRender=0!=i.immediateRender,i.runBackwards=!0,this.staggerTo(t,e,i,s,r,n,a,o)},p.staggerFromTo=function(t,e,i,s,r,n,a,o,h){return s.startAt=i,s.immediateRender=0!=s.immediateRender&&0!=i.immediateRender,this.staggerTo(t,e,s,r,n,a,o,h)},p.call=function(t,e,s,r){return this.add(i.delayedCall(0,t,e,s),r)},p.set=function(t,e,s){return s=this._parseTimeOrLabel(s,0,!0),null==e.immediateRender&&(e.immediateRender=s===this._time&&!this._paused),this.add(new i(t,0,e),s)},s.exportRoot=function(t,e){t=t||{},null==t.smoothChildTiming&&(t.smoothChildTiming=!0);var r,n,a=new s(t),o=a._timeline;for(null==e&&(e=!0),o._remove(a,!0),a._startTime=0,a._rawPrevTime=a._time=a._totalTime=o._time,r=o._first;r;)n=r._next,e&&r instanceof i&&r.target===r.vars.onComplete||a.add(r,r._startTime-r._delay),r=n;return o.add(a,0),a},p.add=function(r,n,o,h){var l,_,u,p,f,c;if("number"!=typeof n&&(n=this._parseTimeOrLabel(n,0,!0,r)),!(r instanceof t)){if(r instanceof Array||r&&r.push&&a(r)){for(o=o||"normal",h=h||0,l=n,_=r.length,u=0;_>u;u++)a(p=r[u])&&(p=new s({tweens:p})),this.add(p,l),"string"!=typeof p&&"function"!=typeof p&&("sequence"===o?l=p._startTime+p.totalDuration()/p._timeScale:"start"===o&&(p._startTime-=p.delay())),l+=h;return this._uncache(!0)}if("string"==typeof r)return this.addLabel(r,n);if("function"!=typeof r)throw"Cannot add "+r+" into the timeline; it is not a tween, timeline, function, or string.";r=i.delayedCall(0,r)}if(e.prototype.add.call(this,r,n),(this._gc||this._time===this._duration)&&!this._paused&&this._duration<this.duration())for(f=this,c=f.rawTime()>r._startTime;f._timeline;)c&&f._timeline.smoothChildTiming?f.totalTime(f._totalTime,!0):f._gc&&f._enabled(!0,!1),f=f._timeline;return this},p.remove=function(e){if(e instanceof t)return this._remove(e,!1);if(e instanceof Array||e&&e.push&&a(e)){for(var i=e.length;--i>-1;)this.remove(e[i]);return this}return"string"==typeof e?this.removeLabel(e):this.kill(null,e)},p._remove=function(t,i){e.prototype._remove.call(this,t,i);var s=this._last;return s?this._time>s._startTime+s._totalDuration/s._timeScale&&(this._time=this.duration(),this._totalTime=this._totalDuration):this._time=this._totalTime=this._duration=this._totalDuration=0,this},p.append=function(t,e){return this.add(t,this._parseTimeOrLabel(null,e,!0,t))},p.insert=p.insertMultiple=function(t,e,i,s){return this.add(t,e||0,i,s)},p.appendMultiple=function(t,e,i,s){return this.add(t,this._parseTimeOrLabel(null,e,!0,t),i,s)},p.addLabel=function(t,e){return this._labels[t]=this._parseTimeOrLabel(e),this},p.addPause=function(t,e,i,s){return this.call(_,["{self}",e,i,s],this,t)},p.removeLabel=function(t){return delete this._labels[t],this},p.getLabelTime=function(t){return null!=this._labels[t]?this._labels[t]:-1},p._parseTimeOrLabel=function(e,i,s,r){var n;if(r instanceof t&&r.timeline===this)this.remove(r);else if(r&&(r instanceof Array||r.push&&a(r)))for(n=r.length;--n>-1;)r[n]instanceof t&&r[n].timeline===this&&this.remove(r[n]);if("string"==typeof i)return this._parseTimeOrLabel(i,s&&"number"==typeof e&&null==this._labels[i]?e-this.duration():0,s);if(i=i||0,"string"!=typeof e||!isNaN(e)&&null==this._labels[e])null==e&&(e=this.duration());else{if(n=e.indexOf("="),-1===n)return null==this._labels[e]?s?this._labels[e]=this.duration()+i:i:this._labels[e]+i;i=parseInt(e.charAt(n-1)+"1",10)*Number(e.substr(n+1)),e=n>1?this._parseTimeOrLabel(e.substr(0,n-1),0,s):this.duration()}return Number(e)+i},p.seek=function(t,e){return this.totalTime("number"==typeof t?t:this._parseTimeOrLabel(t),e!==!1)},p.stop=function(){return this.paused(!0)},p.gotoAndPlay=function(t,e){return this.play(t,e)},p.gotoAndStop=function(t,e){return this.pause(t,e)},p.render=function(t,e,i){this._gc&&this._enabled(!0,!1);var s,n,a,h,l,_=this._dirty?this.totalDuration():this._totalDuration,u=this._time,p=this._startTime,f=this._timeScale,c=this._paused;if(t>=_?(this._totalTime=this._time=_,this._reversed||this._hasPausedChild()||(n=!0,h="onComplete",0===this._duration&&(0===t||0>this._rawPrevTime||this._rawPrevTime===r)&&this._rawPrevTime!==t&&this._first&&(l=!0,this._rawPrevTime>r&&(h="onReverseComplete"))),this._rawPrevTime=this._duration||!e||t||this._rawPrevTime===t?t:r,t=_+1e-4):1e-7>t?(this._totalTime=this._time=0,(0!==u||0===this._duration&&this._rawPrevTime!==r&&(this._rawPrevTime>0||0>t&&this._rawPrevTime>=0))&&(h="onReverseComplete",n=this._reversed),0>t?(this._active=!1,0===this._duration&&this._rawPrevTime>=0&&this._first&&(l=!0),this._rawPrevTime=t):(this._rawPrevTime=this._duration||!e||t||this._rawPrevTime===t?t:r,t=0,this._initted||(l=!0))):this._totalTime=this._time=this._rawPrevTime=t,this._time!==u&&this._first||i||l){if(this._initted||(this._initted=!0),this._active||!this._paused&&this._time!==u&&t>0&&(this._active=!0),0===u&&this.vars.onStart&&0!==this._time&&(e||this.vars.onStart.apply(this.vars.onStartScope||this,this.vars.onStartParams||o)),this._time>=u)for(s=this._first;s&&(a=s._next,!this._paused||c);)(s._active||s._startTime<=this._time&&!s._paused&&!s._gc)&&(s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)),s=a;else for(s=this._last;s&&(a=s._prev,!this._paused||c);)(s._active||u>=s._startTime&&!s._paused&&!s._gc)&&(s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)),s=a;this._onUpdate&&(e||this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||o)),h&&(this._gc||(p===this._startTime||f!==this._timeScale)&&(0===this._time||_>=this.totalDuration())&&(n&&(this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[h]&&this.vars[h].apply(this.vars[h+"Scope"]||this,this.vars[h+"Params"]||o)))}},p._hasPausedChild=function(){for(var t=this._first;t;){if(t._paused||t instanceof s&&t._hasPausedChild())return!0;t=t._next}return!1},p.getChildren=function(t,e,s,r){r=r||-9999999999;for(var n=[],a=this._first,o=0;a;)r>a._startTime||(a instanceof i?e!==!1&&(n[o++]=a):(s!==!1&&(n[o++]=a),t!==!1&&(n=n.concat(a.getChildren(!0,e,s)),o=n.length))),a=a._next;return n},p.getTweensOf=function(t,e){var s,r,n=this._gc,a=[],o=0;for(n&&this._enabled(!0,!0),s=i.getTweensOf(t),r=s.length;--r>-1;)(s[r].timeline===this||e&&this._contains(s[r]))&&(a[o++]=s[r]);return n&&this._enabled(!1,!0),a},p._contains=function(t){for(var e=t.timeline;e;){if(e===this)return!0;e=e.timeline}return!1},p.shiftChildren=function(t,e,i){i=i||0;for(var s,r=this._first,n=this._labels;r;)r._startTime>=i&&(r._startTime+=t),r=r._next;if(e)for(s in n)n[s]>=i&&(n[s]+=t);return this._uncache(!0)},p._kill=function(t,e){if(!t&&!e)return this._enabled(!1,!1);for(var i=e?this.getTweensOf(e):this.getChildren(!0,!0,!1),s=i.length,r=!1;--s>-1;)i[s]._kill(t,e)&&(r=!0);return r},p.clear=function(t){var e=this.getChildren(!1,!0,!0),i=e.length;for(this._time=this._totalTime=0;--i>-1;)e[i]._enabled(!1,!1);return t!==!1&&(this._labels={}),this._uncache(!0)},p.invalidate=function(){for(var t=this._first;t;)t.invalidate(),t=t._next;return this},p._enabled=function(t,i){if(t===this._gc)for(var s=this._first;s;)s._enabled(t,!0),s=s._next;return e.prototype._enabled.call(this,t,i)},p.duration=function(t){return arguments.length?(0!==this.duration()&&0!==t&&this.timeScale(this._duration/t),this):(this._dirty&&this.totalDuration(),this._duration)},p.totalDuration=function(t){if(!arguments.length){if(this._dirty){for(var e,i,s=0,r=this._last,n=999999999999;r;)e=r._prev,r._dirty&&r.totalDuration(),r._startTime>n&&this._sortChildren&&!r._paused?this.add(r,r._startTime-r._delay):n=r._startTime,0>r._startTime&&!r._paused&&(s-=r._startTime,this._timeline.smoothChildTiming&&(this._startTime+=r._startTime/this._timeScale),this.shiftChildren(-r._startTime,!1,-9999999999),n=0),i=r._startTime+r._totalDuration/r._timeScale,i>s&&(s=i),r=e;this._duration=this._totalDuration=s,this._dirty=!1}return this._totalDuration}return 0!==this.totalDuration()&&0!==t&&this.timeScale(this._totalDuration/t),this},p.usesFrames=function(){for(var e=this._timeline;e._timeline;)e=e._timeline;return e===t._rootFramesTimeline},p.rawTime=function(){return this._paused?this._totalTime:(this._timeline.rawTime()-this._startTime)*this._timeScale},s},!0),window._gsDefine("TimelineMax",["TimelineLite","TweenLite","easing.Ease"],function(t,e,i){var s=function(e){t.call(this,e),this._repeat=this.vars.repeat||0,this._repeatDelay=this.vars.repeatDelay||0,this._cycle=0,this._yoyo=this.vars.yoyo===!0,this._dirty=!0},r=1e-10,n=[],a=new i(null,null,1,0),o=s.prototype=new t;return o.constructor=s,o.kill()._gc=!1,s.version="1.12.1",o.invalidate=function(){return this._yoyo=this.vars.yoyo===!0,this._repeat=this.vars.repeat||0,this._repeatDelay=this.vars.repeatDelay||0,this._uncache(!0),t.prototype.invalidate.call(this)},o.addCallback=function(t,i,s,r){return this.add(e.delayedCall(0,t,s,r),i)},o.removeCallback=function(t,e){if(t)if(null==e)this._kill(null,t);else for(var i=this.getTweensOf(t,!1),s=i.length,r=this._parseTimeOrLabel(e);--s>-1;)i[s]._startTime===r&&i[s]._enabled(!1,!1);return this},o.tweenTo=function(t,i){i=i||{};var s,r,o,h={ease:a,overwrite:i.delay?2:1,useFrames:this.usesFrames(),immediateRender:!1};for(r in i)h[r]=i[r];return h.time=this._parseTimeOrLabel(t),s=Math.abs(Number(h.time)-this._time)/this._timeScale||.001,o=new e(this,s,h),h.onStart=function(){o.target.paused(!0),o.vars.time!==o.target.time()&&s===o.duration()&&o.duration(Math.abs(o.vars.time-o.target.time())/o.target._timeScale),i.onStart&&i.onStart.apply(i.onStartScope||o,i.onStartParams||n)},o},o.tweenFromTo=function(t,e,i){i=i||{},t=this._parseTimeOrLabel(t),i.startAt={onComplete:this.seek,onCompleteParams:[t],onCompleteScope:this},i.immediateRender=i.immediateRender!==!1;var s=this.tweenTo(e,i);return s.duration(Math.abs(s.vars.time-t)/this._timeScale||.001)},o.render=function(t,e,i){this._gc&&this._enabled(!0,!1);var s,a,o,h,l,_,u=this._dirty?this.totalDuration():this._totalDuration,p=this._duration,f=this._time,c=this._totalTime,m=this._startTime,d=this._timeScale,g=this._rawPrevTime,v=this._paused,y=this._cycle;if(t>=u?(this._locked||(this._totalTime=u,this._cycle=this._repeat),this._reversed||this._hasPausedChild()||(a=!0,h="onComplete",0===this._duration&&(0===t||0>g||g===r)&&g!==t&&this._first&&(l=!0,g>r&&(h="onReverseComplete"))),this._rawPrevTime=this._duration||!e||t||this._rawPrevTime===t?t:r,this._yoyo&&0!==(1&this._cycle)?this._time=t=0:(this._time=p,t=p+1e-4)):1e-7>t?(this._locked||(this._totalTime=this._cycle=0),this._time=0,(0!==f||0===p&&g!==r&&(g>0||0>t&&g>=0)&&!this._locked)&&(h="onReverseComplete",a=this._reversed),0>t?(this._active=!1,0===p&&g>=0&&this._first&&(l=!0),this._rawPrevTime=t):(this._rawPrevTime=p||!e||t||this._rawPrevTime===t?t:r,t=0,this._initted||(l=!0))):(0===p&&0>g&&(l=!0),this._time=this._rawPrevTime=t,this._locked||(this._totalTime=t,0!==this._repeat&&(_=p+this._repeatDelay,this._cycle=this._totalTime/_>>0,0!==this._cycle&&this._cycle===this._totalTime/_&&this._cycle--,this._time=this._totalTime-this._cycle*_,this._yoyo&&0!==(1&this._cycle)&&(this._time=p-this._time),this._time>p?(this._time=p,t=p+1e-4):0>this._time?this._time=t=0:t=this._time))),this._cycle!==y&&!this._locked){var T=this._yoyo&&0!==(1&y),w=T===(this._yoyo&&0!==(1&this._cycle)),x=this._totalTime,b=this._cycle,P=this._rawPrevTime,S=this._time;if(this._totalTime=y*p,y>this._cycle?T=!T:this._totalTime+=p,this._time=f,this._rawPrevTime=0===p?g-1e-4:g,this._cycle=y,this._locked=!0,f=T?0:p,this.render(f,e,0===p),e||this._gc||this.vars.onRepeat&&this.vars.onRepeat.apply(this.vars.onRepeatScope||this,this.vars.onRepeatParams||n),w&&(f=T?p+1e-4:-1e-4,this.render(f,!0,!1)),this._locked=!1,this._paused&&!v)return;this._time=S,this._totalTime=x,this._cycle=b,this._rawPrevTime=P}if(!(this._time!==f&&this._first||i||l))return c!==this._totalTime&&this._onUpdate&&(e||this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||n)),void 0;if(this._initted||(this._initted=!0),this._active||!this._paused&&this._totalTime!==c&&t>0&&(this._active=!0),0===c&&this.vars.onStart&&0!==this._totalTime&&(e||this.vars.onStart.apply(this.vars.onStartScope||this,this.vars.onStartParams||n)),this._time>=f)for(s=this._first;s&&(o=s._next,!this._paused||v);)(s._active||s._startTime<=this._time&&!s._paused&&!s._gc)&&(s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)),s=o;else for(s=this._last;s&&(o=s._prev,!this._paused||v);)(s._active||f>=s._startTime&&!s._paused&&!s._gc)&&(s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)),s=o;this._onUpdate&&(e||this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||n)),h&&(this._locked||this._gc||(m===this._startTime||d!==this._timeScale)&&(0===this._time||u>=this.totalDuration())&&(a&&(this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[h]&&this.vars[h].apply(this.vars[h+"Scope"]||this,this.vars[h+"Params"]||n)))},o.getActive=function(t,e,i){null==t&&(t=!0),null==e&&(e=!0),null==i&&(i=!1);var s,r,n=[],a=this.getChildren(t,e,i),o=0,h=a.length;for(s=0;h>s;s++)r=a[s],r.isActive()&&(n[o++]=r);return n},o.getLabelAfter=function(t){t||0!==t&&(t=this._time);var e,i=this.getLabelsArray(),s=i.length;for(e=0;s>e;e++)if(i[e].time>t)return i[e].name;return null},o.getLabelBefore=function(t){null==t&&(t=this._time);for(var e=this.getLabelsArray(),i=e.length;--i>-1;)if(t>e[i].time)return e[i].name;return null},o.getLabelsArray=function(){var t,e=[],i=0;for(t in this._labels)e[i++]={time:this._labels[t],name:t};return e.sort(function(t,e){return t.time-e.time}),e},o.progress=function(t){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&0!==(1&this._cycle)?1-t:t)+this._cycle*(this._duration+this._repeatDelay),!1):this._time/this.duration()},o.totalProgress=function(t){return arguments.length?this.totalTime(this.totalDuration()*t,!1):this._totalTime/this.totalDuration()},o.totalDuration=function(e){return arguments.length?-1===this._repeat?this:this.duration((e-this._repeat*this._repeatDelay)/(this._repeat+1)):(this._dirty&&(t.prototype.totalDuration.call(this),this._totalDuration=-1===this._repeat?999999999999:this._duration*(this._repeat+1)+this._repeatDelay*this._repeat),this._totalDuration)},o.time=function(t,e){return arguments.length?(this._dirty&&this.totalDuration(),t>this._duration&&(t=this._duration),this._yoyo&&0!==(1&this._cycle)?t=this._duration-t+this._cycle*(this._duration+this._repeatDelay):0!==this._repeat&&(t+=this._cycle*(this._duration+this._repeatDelay)),this.totalTime(t,e)):this._time},o.repeat=function(t){return arguments.length?(this._repeat=t,this._uncache(!0)):this._repeat},o.repeatDelay=function(t){return arguments.length?(this._repeatDelay=t,this._uncache(!0)):this._repeatDelay},o.yoyo=function(t){return arguments.length?(this._yoyo=t,this):this._yoyo},o.currentLabel=function(t){return arguments.length?this.seek(t,!0):this.getLabelBefore(this._time+1e-8)},s},!0),function(){var t=180/Math.PI,e=[],i=[],s=[],r={},n=function(t,e,i,s){this.a=t,this.b=e,this.c=i,this.d=s,this.da=s-t,this.ca=i-t,this.ba=e-t},a=",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,",o=function(t,e,i,s){var r={a:t},n={},a={},o={c:s},h=(t+e)/2,l=(e+i)/2,_=(i+s)/2,u=(h+l)/2,p=(l+_)/2,f=(p-u)/8;return r.b=h+(t-h)/4,n.b=u+f,r.c=n.a=(r.b+n.b)/2,n.c=a.a=(u+p)/2,a.b=p-f,o.b=_+(s-_)/4,a.c=o.a=(a.b+o.b)/2,[r,n,a,o]},h=function(t,r,n,a,h){var l,_,u,p,f,c,m,d,g,v,y,T,w,x=t.length-1,b=0,P=t[0].a;for(l=0;x>l;l++)f=t[b],_=f.a,u=f.d,p=t[b+1].d,h?(y=e[l],T=i[l],w=.25*(T+y)*r/(a?.5:s[l]||.5),c=u-(u-_)*(a?.5*r:0!==y?w/y:0),m=u+(p-u)*(a?.5*r:0!==T?w/T:0),d=u-(c+((m-c)*(3*y/(y+T)+.5)/4||0))):(c=u-.5*(u-_)*r,m=u+.5*(p-u)*r,d=u-(c+m)/2),c+=d,m+=d,f.c=g=c,f.b=0!==l?P:P=f.a+.6*(f.c-f.a),f.da=u-_,f.ca=g-_,f.ba=P-_,n?(v=o(_,P,g,u),t.splice(b,1,v[0],v[1],v[2],v[3]),b+=4):b++,P=m;f=t[b],f.b=P,f.c=P+.4*(f.d-P),f.da=f.d-f.a,f.ca=f.c-f.a,f.ba=P-f.a,n&&(v=o(f.a,P,f.c,f.d),t.splice(b,1,v[0],v[1],v[2],v[3]))},l=function(t,s,r,a){var o,h,l,_,u,p,f=[];if(a)for(t=[a].concat(t),h=t.length;--h>-1;)"string"==typeof(p=t[h][s])&&"="===p.charAt(1)&&(t[h][s]=a[s]+Number(p.charAt(0)+p.substr(2)));if(o=t.length-2,0>o)return f[0]=new n(t[0][s],0,0,t[-1>o?0:1][s]),f;for(h=0;o>h;h++)l=t[h][s],_=t[h+1][s],f[h]=new n(l,0,0,_),r&&(u=t[h+2][s],e[h]=(e[h]||0)+(_-l)*(_-l),i[h]=(i[h]||0)+(u-_)*(u-_));return f[h]=new n(t[h][s],0,0,t[h+1][s]),f},_=function(t,n,o,_,u,p){var f,c,m,d,g,v,y,T,w={},x=[],b=p||t[0];u="string"==typeof u?","+u+",":a,null==n&&(n=1);for(c in t[0])x.push(c);if(t.length>1){for(T=t[t.length-1],y=!0,f=x.length;--f>-1;)if(c=x[f],Math.abs(b[c]-T[c])>.05){y=!1;break}y&&(t=t.concat(),p&&t.unshift(p),t.push(t[1]),p=t[t.length-3])}for(e.length=i.length=s.length=0,f=x.length;--f>-1;)c=x[f],r[c]=-1!==u.indexOf(","+c+","),w[c]=l(t,c,r[c],p);for(f=e.length;--f>-1;)e[f]=Math.sqrt(e[f]),i[f]=Math.sqrt(i[f]);if(!_){for(f=x.length;--f>-1;)if(r[c])for(m=w[x[f]],v=m.length-1,d=0;v>d;d++)g=m[d+1].da/i[d]+m[d].da/e[d],s[d]=(s[d]||0)+g*g;for(f=s.length;--f>-1;)s[f]=Math.sqrt(s[f])}for(f=x.length,d=o?4:1;--f>-1;)c=x[f],m=w[c],h(m,n,o,_,r[c]),y&&(m.splice(0,d),m.splice(m.length-d,d));return w},u=function(t,e,i){e=e||"soft";var s,r,a,o,h,l,_,u,p,f,c,m={},d="cubic"===e?3:2,g="soft"===e,v=[];if(g&&i&&(t=[i].concat(t)),null==t||d+1>t.length)throw"invalid Bezier data";for(p in t[0])v.push(p);for(l=v.length;--l>-1;){for(p=v[l],m[p]=h=[],f=0,u=t.length,_=0;u>_;_++)s=null==i?t[_][p]:"string"==typeof(c=t[_][p])&&"="===c.charAt(1)?i[p]+Number(c.charAt(0)+c.substr(2)):Number(c),g&&_>1&&u-1>_&&(h[f++]=(s+h[f-2])/2),h[f++]=s;for(u=f-d+1,f=0,_=0;u>_;_+=d)s=h[_],r=h[_+1],a=h[_+2],o=2===d?0:h[_+3],h[f++]=c=3===d?new n(s,r,a,o):new n(s,(2*r+s)/3,(2*r+a)/3,a);h.length=f}return m},p=function(t,e,i){for(var s,r,n,a,o,h,l,_,u,p,f,c=1/i,m=t.length;--m>-1;)for(p=t[m],n=p.a,a=p.d-n,o=p.c-n,h=p.b-n,s=r=0,_=1;i>=_;_++)l=c*_,u=1-l,s=r-(r=(l*l*a+3*u*(l*o+u*h))*l),f=m*i+_-1,e[f]=(e[f]||0)+s*s},f=function(t,e){e=e>>0||6;var i,s,r,n,a=[],o=[],h=0,l=0,_=e-1,u=[],f=[];for(i in t)p(t[i],a,e);for(r=a.length,s=0;r>s;s++)h+=Math.sqrt(a[s]),n=s%e,f[n]=h,n===_&&(l+=h,n=s/e>>0,u[n]=f,o[n]=l,h=0,f=[]);return{length:l,lengths:o,segments:u}},c=window._gsDefine.plugin({propName:"bezier",priority:-1,version:"1.3.2",API:2,global:!0,init:function(t,e,i){this._target=t,e instanceof Array&&(e={values:e}),this._func={},this._round={},this._props=[],this._timeRes=null==e.timeResolution?6:parseInt(e.timeResolution,10);var s,r,n,a,o,h=e.values||[],l={},p=h[0],c=e.autoRotate||i.vars.orientToBezier;this._autoRotate=c?c instanceof Array?c:[["x","y","rotation",c===!0?0:Number(c)||0]]:null;for(s in p)this._props.push(s);for(n=this._props.length;--n>-1;)s=this._props[n],this._overwriteProps.push(s),r=this._func[s]="function"==typeof t[s],l[s]=r?t[s.indexOf("set")||"function"!=typeof t["get"+s.substr(3)]?s:"get"+s.substr(3)]():parseFloat(t[s]),o||l[s]!==h[0][s]&&(o=l);if(this._beziers="cubic"!==e.type&&"quadratic"!==e.type&&"soft"!==e.type?_(h,isNaN(e.curviness)?1:e.curviness,!1,"thruBasic"===e.type,e.correlate,o):u(h,e.type,l),this._segCount=this._beziers[s].length,this._timeRes){var m=f(this._beziers,this._timeRes);this._length=m.length,this._lengths=m.lengths,this._segments=m.segments,this._l1=this._li=this._s1=this._si=0,this._l2=this._lengths[0],this._curSeg=this._segments[0],this._s2=this._curSeg[0],this._prec=1/this._curSeg.length}if(c=this._autoRotate)for(this._initialRotations=[],c[0]instanceof Array||(this._autoRotate=c=[c]),n=c.length;--n>-1;){for(a=0;3>a;a++)s=c[n][a],this._func[s]="function"==typeof t[s]?t[s.indexOf("set")||"function"!=typeof t["get"+s.substr(3)]?s:"get"+s.substr(3)]:!1;s=c[n][2],this._initialRotations[n]=this._func[s]?this._func[s].call(this._target):this._target[s]}return this._startRatio=i.vars.runBackwards?1:0,!0},set:function(e){var i,s,r,n,a,o,h,l,_,u,p=this._segCount,f=this._func,c=this._target,m=e!==this._startRatio;if(this._timeRes){if(_=this._lengths,u=this._curSeg,e*=this._length,r=this._li,e>this._l2&&p-1>r){for(l=p-1;l>r&&e>=(this._l2=_[++r]););this._l1=_[r-1],this._li=r,this._curSeg=u=this._segments[r],this._s2=u[this._s1=this._si=0]}else if(this._l1>e&&r>0){for(;r>0&&(this._l1=_[--r])>=e;);0===r&&this._l1>e?this._l1=0:r++,this._l2=_[r],this._li=r,this._curSeg=u=this._segments[r],this._s1=u[(this._si=u.length-1)-1]||0,this._s2=u[this._si]}if(i=r,e-=this._l1,r=this._si,e>this._s2&&u.length-1>r){for(l=u.length-1;l>r&&e>=(this._s2=u[++r]););this._s1=u[r-1],this._si=r}else if(this._s1>e&&r>0){for(;r>0&&(this._s1=u[--r])>=e;);0===r&&this._s1>e?this._s1=0:r++,this._s2=u[r],this._si=r}o=(r+(e-this._s1)/(this._s2-this._s1))*this._prec}else i=0>e?0:e>=1?p-1:p*e>>0,o=(e-i*(1/p))*p;for(s=1-o,r=this._props.length;--r>-1;)n=this._props[r],a=this._beziers[n][i],h=(o*o*a.da+3*s*(o*a.ca+s*a.ba))*o+a.a,this._round[n]&&(h=Math.round(h)),f[n]?c[n](h):c[n]=h;if(this._autoRotate){var d,g,v,y,T,w,x,b=this._autoRotate;for(r=b.length;--r>-1;)n=b[r][2],w=b[r][3]||0,x=b[r][4]===!0?1:t,a=this._beziers[b[r][0]],d=this._beziers[b[r][1]],a&&d&&(a=a[i],d=d[i],g=a.a+(a.b-a.a)*o,y=a.b+(a.c-a.b)*o,g+=(y-g)*o,y+=(a.c+(a.d-a.c)*o-y)*o,v=d.a+(d.b-d.a)*o,T=d.b+(d.c-d.b)*o,v+=(T-v)*o,T+=(d.c+(d.d-d.c)*o-T)*o,h=m?Math.atan2(T-v,y-g)*x+w:this._initialRotations[r],f[n]?c[n](h):c[n]=h)
}}}),m=c.prototype;c.bezierThrough=_,c.cubicToQuadratic=o,c._autoCSS=!0,c.quadraticToCubic=function(t,e,i){return new n(t,(2*e+t)/3,(2*e+i)/3,i)},c._cssRegister=function(){var t=window._gsDefine.globals.CSSPlugin;if(t){var e=t._internals,i=e._parseToProxy,s=e._setPluginRatio,r=e.CSSPropTween;e._registerComplexSpecialProp("bezier",{parser:function(t,e,n,a,o,h){e instanceof Array&&(e={values:e}),h=new c;var l,_,u,p=e.values,f=p.length-1,m=[],d={};if(0>f)return o;for(l=0;f>=l;l++)u=i(t,p[l],a,o,h,f!==l),m[l]=u.end;for(_ in e)d[_]=e[_];return d.values=m,o=new r(t,"bezier",0,0,u.pt,2),o.data=u,o.plugin=h,o.setRatio=s,0===d.autoRotate&&(d.autoRotate=!0),!d.autoRotate||d.autoRotate instanceof Array||(l=d.autoRotate===!0?0:Number(d.autoRotate),d.autoRotate=null!=u.end.left?[["left","top","rotation",l,!1]]:null!=u.end.x?[["x","y","rotation",l,!1]]:!1),d.autoRotate&&(a._transform||a._enableTransforms(!1),u.autoRotate=a._target._gsTransform),h._onInitTween(u.proxy,d,a._tween),o}})}},m._roundProps=function(t,e){for(var i=this._overwriteProps,s=i.length;--s>-1;)(t[i[s]]||t.bezier||t.bezierThrough)&&(this._round[i[s]]=e)},m._kill=function(t){var e,i,s=this._props;for(e in this._beziers)if(e in t)for(delete this._beziers[e],delete this._func[e],i=s.length;--i>-1;)s[i]===e&&s.splice(i,1);return this._super._kill.call(this,t)}}(),window._gsDefine("plugins.CSSPlugin",["plugins.TweenPlugin","TweenLite"],function(t,e){var i,s,r,n,a=function(){t.call(this,"css"),this._overwriteProps.length=0,this.setRatio=a.prototype.setRatio},o={},h=a.prototype=new t("css");h.constructor=a,a.version="1.12.1",a.API=2,a.defaultTransformPerspective=0,a.defaultSkewType="compensated",h="px",a.suffixMap={top:h,right:h,bottom:h,left:h,width:h,height:h,fontSize:h,padding:h,margin:h,perspective:h,lineHeight:""};var l,_,u,p,f,c,m=/(?:\d|\-\d|\.\d|\-\.\d)+/g,d=/(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,g=/(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi,v=/[^\d\-\.]/g,y=/(?:\d|\-|\+|=|#|\.)*/g,T=/opacity *= *([^)]*)/i,w=/opacity:([^;]*)/i,x=/alpha\(opacity *=.+?\)/i,b=/^(rgb|hsl)/,P=/([A-Z])/g,S=/-([a-z])/gi,k=/(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi,R=function(t,e){return e.toUpperCase()},A=/(?:Left|Right|Width)/i,C=/(M11|M12|M21|M22)=[\d\-\.e]+/gi,O=/progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,D=/,(?=[^\)]*(?:\(|$))/gi,M=Math.PI/180,z=180/Math.PI,I={},E=document,L=E.createElement("div"),F=E.createElement("img"),N=a._internals={_specialProps:o},X=navigator.userAgent,U=function(){var t,e=X.indexOf("Android"),i=E.createElement("div");return u=-1!==X.indexOf("Safari")&&-1===X.indexOf("Chrome")&&(-1===e||Number(X.substr(e+8,1))>3),f=u&&6>Number(X.substr(X.indexOf("Version/")+8,1)),p=-1!==X.indexOf("Firefox"),/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(X)&&(c=parseFloat(RegExp.$1)),i.innerHTML="<a style='top:1px;opacity:.55;'>a</a>",t=i.getElementsByTagName("a")[0],t?/^0.55/.test(t.style.opacity):!1}(),Y=function(t){return T.test("string"==typeof t?t:(t.currentStyle?t.currentStyle.filter:t.style.filter)||"")?parseFloat(RegExp.$1)/100:1},j=function(t){window.console&&console.log(t)},B="",q="",V=function(t,e){e=e||L;var i,s,r=e.style;if(void 0!==r[t])return t;for(t=t.charAt(0).toUpperCase()+t.substr(1),i=["O","Moz","ms","Ms","Webkit"],s=5;--s>-1&&void 0===r[i[s]+t];);return s>=0?(q=3===s?"ms":i[s],B="-"+q.toLowerCase()+"-",q+t):null},W=E.defaultView?E.defaultView.getComputedStyle:function(){},G=a.getStyle=function(t,e,i,s,r){var n;return U||"opacity"!==e?(!s&&t.style[e]?n=t.style[e]:(i=i||W(t))?n=i[e]||i.getPropertyValue(e)||i.getPropertyValue(e.replace(P,"-$1").toLowerCase()):t.currentStyle&&(n=t.currentStyle[e]),null==r||n&&"none"!==n&&"auto"!==n&&"auto auto"!==n?n:r):Y(t)},$=N.convertToPixels=function(t,i,s,r,n){if("px"===r||!r)return s;if("auto"===r||!s)return 0;var o,h,l,_=A.test(i),u=t,p=L.style,f=0>s;if(f&&(s=-s),"%"===r&&-1!==i.indexOf("border"))o=s/100*(_?t.clientWidth:t.clientHeight);else{if(p.cssText="border:0 solid red;position:"+G(t,"position")+";line-height:0;","%"!==r&&u.appendChild)p[_?"borderLeftWidth":"borderTopWidth"]=s+r;else{if(u=t.parentNode||E.body,h=u._gsCache,l=e.ticker.frame,h&&_&&h.time===l)return h.width*s/100;p[_?"width":"height"]=s+r}u.appendChild(L),o=parseFloat(L[_?"offsetWidth":"offsetHeight"]),u.removeChild(L),_&&"%"===r&&a.cacheWidths!==!1&&(h=u._gsCache=u._gsCache||{},h.time=l,h.width=100*(o/s)),0!==o||n||(o=$(t,i,s,r,!0))}return f?-o:o},Z=N.calculateOffset=function(t,e,i){if("absolute"!==G(t,"position",i))return 0;var s="left"===e?"Left":"Top",r=G(t,"margin"+s,i);return t["offset"+s]-($(t,e,parseFloat(r),r.replace(y,""))||0)},Q=function(t,e){var i,s,r={};if(e=e||W(t,null))if(i=e.length)for(;--i>-1;)r[e[i].replace(S,R)]=e.getPropertyValue(e[i]);else for(i in e)r[i]=e[i];else if(e=t.currentStyle||t.style)for(i in e)"string"==typeof i&&void 0===r[i]&&(r[i.replace(S,R)]=e[i]);return U||(r.opacity=Y(t)),s=Pe(t,e,!1),r.rotation=s.rotation,r.skewX=s.skewX,r.scaleX=s.scaleX,r.scaleY=s.scaleY,r.x=s.x,r.y=s.y,xe&&(r.z=s.z,r.rotationX=s.rotationX,r.rotationY=s.rotationY,r.scaleZ=s.scaleZ),r.filters&&delete r.filters,r},H=function(t,e,i,s,r){var n,a,o,h={},l=t.style;for(a in i)"cssText"!==a&&"length"!==a&&isNaN(a)&&(e[a]!==(n=i[a])||r&&r[a])&&-1===a.indexOf("Origin")&&("number"==typeof n||"string"==typeof n)&&(h[a]="auto"!==n||"left"!==a&&"top"!==a?""!==n&&"auto"!==n&&"none"!==n||"string"!=typeof e[a]||""===e[a].replace(v,"")?n:0:Z(t,a),void 0!==l[a]&&(o=new ue(l,a,l[a],o)));if(s)for(a in s)"className"!==a&&(h[a]=s[a]);return{difs:h,firstMPT:o}},K={width:["Left","Right"],height:["Top","Bottom"]},J=["marginLeft","marginRight","marginTop","marginBottom"],te=function(t,e,i){var s=parseFloat("width"===e?t.offsetWidth:t.offsetHeight),r=K[e],n=r.length;for(i=i||W(t,null);--n>-1;)s-=parseFloat(G(t,"padding"+r[n],i,!0))||0,s-=parseFloat(G(t,"border"+r[n]+"Width",i,!0))||0;return s},ee=function(t,e){(null==t||""===t||"auto"===t||"auto auto"===t)&&(t="0 0");var i=t.split(" "),s=-1!==t.indexOf("left")?"0%":-1!==t.indexOf("right")?"100%":i[0],r=-1!==t.indexOf("top")?"0%":-1!==t.indexOf("bottom")?"100%":i[1];return null==r?r="0":"center"===r&&(r="50%"),("center"===s||isNaN(parseFloat(s))&&-1===(s+"").indexOf("="))&&(s="50%"),e&&(e.oxp=-1!==s.indexOf("%"),e.oyp=-1!==r.indexOf("%"),e.oxr="="===s.charAt(1),e.oyr="="===r.charAt(1),e.ox=parseFloat(s.replace(v,"")),e.oy=parseFloat(r.replace(v,""))),s+" "+r+(i.length>2?" "+i[2]:"")},ie=function(t,e){return"string"==typeof t&&"="===t.charAt(1)?parseInt(t.charAt(0)+"1",10)*parseFloat(t.substr(2)):parseFloat(t)-parseFloat(e)},se=function(t,e){return null==t?e:"string"==typeof t&&"="===t.charAt(1)?parseInt(t.charAt(0)+"1",10)*Number(t.substr(2))+e:parseFloat(t)},re=function(t,e,i,s){var r,n,a,o,h=1e-6;return null==t?o=e:"number"==typeof t?o=t:(r=360,n=t.split("_"),a=Number(n[0].replace(v,""))*(-1===t.indexOf("rad")?1:z)-("="===t.charAt(1)?0:e),n.length&&(s&&(s[i]=e+a),-1!==t.indexOf("short")&&(a%=r,a!==a%(r/2)&&(a=0>a?a+r:a-r)),-1!==t.indexOf("_cw")&&0>a?a=(a+9999999999*r)%r-(0|a/r)*r:-1!==t.indexOf("ccw")&&a>0&&(a=(a-9999999999*r)%r-(0|a/r)*r)),o=e+a),h>o&&o>-h&&(o=0),o},ne={aqua:[0,255,255],lime:[0,255,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,255],navy:[0,0,128],white:[255,255,255],fuchsia:[255,0,255],olive:[128,128,0],yellow:[255,255,0],orange:[255,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[255,0,0],pink:[255,192,203],cyan:[0,255,255],transparent:[255,255,255,0]},ae=function(t,e,i){return t=0>t?t+1:t>1?t-1:t,0|255*(1>6*t?e+6*(i-e)*t:.5>t?i:2>3*t?e+6*(i-e)*(2/3-t):e)+.5},oe=function(t){var e,i,s,r,n,a;return t&&""!==t?"number"==typeof t?[t>>16,255&t>>8,255&t]:(","===t.charAt(t.length-1)&&(t=t.substr(0,t.length-1)),ne[t]?ne[t]:"#"===t.charAt(0)?(4===t.length&&(e=t.charAt(1),i=t.charAt(2),s=t.charAt(3),t="#"+e+e+i+i+s+s),t=parseInt(t.substr(1),16),[t>>16,255&t>>8,255&t]):"hsl"===t.substr(0,3)?(t=t.match(m),r=Number(t[0])%360/360,n=Number(t[1])/100,a=Number(t[2])/100,i=.5>=a?a*(n+1):a+n-a*n,e=2*a-i,t.length>3&&(t[3]=Number(t[3])),t[0]=ae(r+1/3,e,i),t[1]=ae(r,e,i),t[2]=ae(r-1/3,e,i),t):(t=t.match(m)||ne.transparent,t[0]=Number(t[0]),t[1]=Number(t[1]),t[2]=Number(t[2]),t.length>3&&(t[3]=Number(t[3])),t)):ne.black},he="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#.+?\\b";for(h in ne)he+="|"+h+"\\b";he=RegExp(he+")","gi");var le=function(t,e,i,s){if(null==t)return function(t){return t};var r,n=e?(t.match(he)||[""])[0]:"",a=t.split(n).join("").match(g)||[],o=t.substr(0,t.indexOf(a[0])),h=")"===t.charAt(t.length-1)?")":"",l=-1!==t.indexOf(" ")?" ":",",_=a.length,u=_>0?a[0].replace(m,""):"";return _?r=e?function(t){var e,p,f,c;if("number"==typeof t)t+=u;else if(s&&D.test(t)){for(c=t.replace(D,"|").split("|"),f=0;c.length>f;f++)c[f]=r(c[f]);return c.join(",")}if(e=(t.match(he)||[n])[0],p=t.split(e).join("").match(g)||[],f=p.length,_>f--)for(;_>++f;)p[f]=i?p[0|(f-1)/2]:a[f];return o+p.join(l)+l+e+h+(-1!==t.indexOf("inset")?" inset":"")}:function(t){var e,n,p;if("number"==typeof t)t+=u;else if(s&&D.test(t)){for(n=t.replace(D,"|").split("|"),p=0;n.length>p;p++)n[p]=r(n[p]);return n.join(",")}if(e=t.match(g)||[],p=e.length,_>p--)for(;_>++p;)e[p]=i?e[0|(p-1)/2]:a[p];return o+e.join(l)+h}:function(t){return t}},_e=function(t){return t=t.split(","),function(e,i,s,r,n,a,o){var h,l=(i+"").split(" ");for(o={},h=0;4>h;h++)o[t[h]]=l[h]=l[h]||l[(h-1)/2>>0];return r.parse(e,o,n,a)}},ue=(N._setPluginRatio=function(t){this.plugin.setRatio(t);for(var e,i,s,r,n=this.data,a=n.proxy,o=n.firstMPT,h=1e-6;o;)e=a[o.v],o.r?e=Math.round(e):h>e&&e>-h&&(e=0),o.t[o.p]=e,o=o._next;if(n.autoRotate&&(n.autoRotate.rotation=a.rotation),1===t)for(o=n.firstMPT;o;){if(i=o.t,i.type){if(1===i.type){for(r=i.xs0+i.s+i.xs1,s=1;i.l>s;s++)r+=i["xn"+s]+i["xs"+(s+1)];i.e=r}}else i.e=i.s+i.xs0;o=o._next}},function(t,e,i,s,r){this.t=t,this.p=e,this.v=i,this.r=r,s&&(s._prev=this,this._next=s)}),pe=(N._parseToProxy=function(t,e,i,s,r,n){var a,o,h,l,_,u=s,p={},f={},c=i._transform,m=I;for(i._transform=null,I=e,s=_=i.parse(t,e,s,r),I=m,n&&(i._transform=c,u&&(u._prev=null,u._prev&&(u._prev._next=null)));s&&s!==u;){if(1>=s.type&&(o=s.p,f[o]=s.s+s.c,p[o]=s.s,n||(l=new ue(s,"s",o,l,s.r),s.c=0),1===s.type))for(a=s.l;--a>0;)h="xn"+a,o=s.p+"_"+h,f[o]=s.data[h],p[o]=s[h],n||(l=new ue(s,h,o,l,s.rxp[h]));s=s._next}return{proxy:p,end:f,firstMPT:l,pt:_}},N.CSSPropTween=function(t,e,s,r,a,o,h,l,_,u,p){this.t=t,this.p=e,this.s=s,this.c=r,this.n=h||e,t instanceof pe||n.push(this.n),this.r=l,this.type=o||0,_&&(this.pr=_,i=!0),this.b=void 0===u?s:u,this.e=void 0===p?s+r:p,a&&(this._next=a,a._prev=this)}),fe=a.parseComplex=function(t,e,i,s,r,n,a,o,h,_){i=i||n||"",a=new pe(t,e,0,0,a,_?2:1,null,!1,o,i,s),s+="";var u,p,f,c,g,v,y,T,w,x,P,S,k=i.split(", ").join(",").split(" "),R=s.split(", ").join(",").split(" "),A=k.length,C=l!==!1;for((-1!==s.indexOf(",")||-1!==i.indexOf(","))&&(k=k.join(" ").replace(D,", ").split(" "),R=R.join(" ").replace(D,", ").split(" "),A=k.length),A!==R.length&&(k=(n||"").split(" "),A=k.length),a.plugin=h,a.setRatio=_,u=0;A>u;u++)if(c=k[u],g=R[u],T=parseFloat(c),T||0===T)a.appendXtra("",T,ie(g,T),g.replace(d,""),C&&-1!==g.indexOf("px"),!0);else if(r&&("#"===c.charAt(0)||ne[c]||b.test(c)))S=","===g.charAt(g.length-1)?"),":")",c=oe(c),g=oe(g),w=c.length+g.length>6,w&&!U&&0===g[3]?(a["xs"+a.l]+=a.l?" transparent":"transparent",a.e=a.e.split(R[u]).join("transparent")):(U||(w=!1),a.appendXtra(w?"rgba(":"rgb(",c[0],g[0]-c[0],",",!0,!0).appendXtra("",c[1],g[1]-c[1],",",!0).appendXtra("",c[2],g[2]-c[2],w?",":S,!0),w&&(c=4>c.length?1:c[3],a.appendXtra("",c,(4>g.length?1:g[3])-c,S,!1)));else if(v=c.match(m)){if(y=g.match(d),!y||y.length!==v.length)return a;for(f=0,p=0;v.length>p;p++)P=v[p],x=c.indexOf(P,f),a.appendXtra(c.substr(f,x-f),Number(P),ie(y[p],P),"",C&&"px"===c.substr(x+P.length,2),0===p),f=x+P.length;a["xs"+a.l]+=c.substr(f)}else a["xs"+a.l]+=a.l?" "+c:c;if(-1!==s.indexOf("=")&&a.data){for(S=a.xs0+a.data.s,u=1;a.l>u;u++)S+=a["xs"+u]+a.data["xn"+u];a.e=S+a["xs"+u]}return a.l||(a.type=-1,a.xs0=a.e),a.xfirst||a},ce=9;for(h=pe.prototype,h.l=h.pr=0;--ce>0;)h["xn"+ce]=0,h["xs"+ce]="";h.xs0="",h._next=h._prev=h.xfirst=h.data=h.plugin=h.setRatio=h.rxp=null,h.appendXtra=function(t,e,i,s,r,n){var a=this,o=a.l;return a["xs"+o]+=n&&o?" "+t:t||"",i||0===o||a.plugin?(a.l++,a.type=a.setRatio?2:1,a["xs"+a.l]=s||"",o>0?(a.data["xn"+o]=e+i,a.rxp["xn"+o]=r,a["xn"+o]=e,a.plugin||(a.xfirst=new pe(a,"xn"+o,e,i,a.xfirst||a,0,a.n,r,a.pr),a.xfirst.xs0=0),a):(a.data={s:e+i},a.rxp={},a.s=e,a.c=i,a.r=r,a)):(a["xs"+o]+=e+(s||""),a)};var me=function(t,e){e=e||{},this.p=e.prefix?V(t)||t:t,o[t]=o[this.p]=this,this.format=e.formatter||le(e.defaultValue,e.color,e.collapsible,e.multi),e.parser&&(this.parse=e.parser),this.clrs=e.color,this.multi=e.multi,this.keyword=e.keyword,this.dflt=e.defaultValue,this.pr=e.priority||0},de=N._registerComplexSpecialProp=function(t,e,i){"object"!=typeof e&&(e={parser:i});var s,r,n=t.split(","),a=e.defaultValue;for(i=i||[a],s=0;n.length>s;s++)e.prefix=0===s&&e.prefix,e.defaultValue=i[s]||a,r=new me(n[s],e)},ge=function(t){if(!o[t]){var e=t.charAt(0).toUpperCase()+t.substr(1)+"Plugin";de(t,{parser:function(t,i,s,r,n,a,h){var l=(window.GreenSockGlobals||window).com.greensock.plugins[e];return l?(l._cssRegister(),o[s].parse(t,i,s,r,n,a,h)):(j("Error: "+e+" js file not loaded."),n)}})}};h=me.prototype,h.parseComplex=function(t,e,i,s,r,n){var a,o,h,l,_,u,p=this.keyword;if(this.multi&&(D.test(i)||D.test(e)?(o=e.replace(D,"|").split("|"),h=i.replace(D,"|").split("|")):p&&(o=[e],h=[i])),h){for(l=h.length>o.length?h.length:o.length,a=0;l>a;a++)e=o[a]=o[a]||this.dflt,i=h[a]=h[a]||this.dflt,p&&(_=e.indexOf(p),u=i.indexOf(p),_!==u&&(i=-1===u?h:o,i[a]+=" "+p));e=o.join(", "),i=h.join(", ")}return fe(t,this.p,e,i,this.clrs,this.dflt,s,this.pr,r,n)},h.parse=function(t,e,i,s,n,a){return this.parseComplex(t.style,this.format(G(t,this.p,r,!1,this.dflt)),this.format(e),n,a)},a.registerSpecialProp=function(t,e,i){de(t,{parser:function(t,s,r,n,a,o){var h=new pe(t,r,0,0,a,2,r,!1,i);return h.plugin=o,h.setRatio=e(t,s,n._tween,r),h},priority:i})};var ve="scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective".split(","),ye=V("transform"),Te=B+"transform",we=V("transformOrigin"),xe=null!==V("perspective"),be=N.Transform=function(){this.skewY=0},Pe=N.getTransform=function(t,e,i,s){if(t._gsTransform&&i&&!s)return t._gsTransform;var r,n,o,h,l,_,u,p,f,c,m,d,g,v=i?t._gsTransform||new be:new be,y=0>v.scaleX,T=2e-5,w=1e5,x=179.99,b=x*M,P=xe?parseFloat(G(t,we,e,!1,"0 0 0").split(" ")[2])||v.zOrigin||0:0;for(ye?r=G(t,Te,e,!0):t.currentStyle&&(r=t.currentStyle.filter.match(C),r=r&&4===r.length?[r[0].substr(4),Number(r[2].substr(4)),Number(r[1].substr(4)),r[3].substr(4),v.x||0,v.y||0].join(","):""),n=(r||"").match(/(?:\-|\b)[\d\-\.e]+\b/gi)||[],o=n.length;--o>-1;)h=Number(n[o]),n[o]=(l=h-(h|=0))?(0|l*w+(0>l?-.5:.5))/w+h:h;if(16===n.length){var S=n[8],k=n[9],R=n[10],A=n[12],O=n[13],D=n[14];if(v.zOrigin&&(D=-v.zOrigin,A=S*D-n[12],O=k*D-n[13],D=R*D+v.zOrigin-n[14]),!i||s||null==v.rotationX){var I,E,L,F,N,X,U,Y=n[0],j=n[1],B=n[2],q=n[3],V=n[4],W=n[5],$=n[6],Z=n[7],Q=n[11],H=Math.atan2($,R),K=-b>H||H>b;v.rotationX=H*z,H&&(F=Math.cos(-H),N=Math.sin(-H),I=V*F+S*N,E=W*F+k*N,L=$*F+R*N,S=V*-N+S*F,k=W*-N+k*F,R=$*-N+R*F,Q=Z*-N+Q*F,V=I,W=E,$=L),H=Math.atan2(S,Y),v.rotationY=H*z,H&&(X=-b>H||H>b,F=Math.cos(-H),N=Math.sin(-H),I=Y*F-S*N,E=j*F-k*N,L=B*F-R*N,k=j*N+k*F,R=B*N+R*F,Q=q*N+Q*F,Y=I,j=E,B=L),H=Math.atan2(j,W),v.rotation=H*z,H&&(U=-b>H||H>b,F=Math.cos(-H),N=Math.sin(-H),Y=Y*F+V*N,E=j*F+W*N,W=j*-N+W*F,$=B*-N+$*F,j=E),U&&K?v.rotation=v.rotationX=0:U&&X?v.rotation=v.rotationY=0:X&&K&&(v.rotationY=v.rotationX=0),v.scaleX=(0|Math.sqrt(Y*Y+j*j)*w+.5)/w,v.scaleY=(0|Math.sqrt(W*W+k*k)*w+.5)/w,v.scaleZ=(0|Math.sqrt($*$+R*R)*w+.5)/w,v.skewX=0,v.perspective=Q?1/(0>Q?-Q:Q):0,v.x=A,v.y=O,v.z=D}}else if(!(xe&&!s&&n.length&&v.x===n[4]&&v.y===n[5]&&(v.rotationX||v.rotationY)||void 0!==v.x&&"none"===G(t,"display",e))){var J=n.length>=6,te=J?n[0]:1,ee=n[1]||0,ie=n[2]||0,se=J?n[3]:1;v.x=n[4]||0,v.y=n[5]||0,_=Math.sqrt(te*te+ee*ee),u=Math.sqrt(se*se+ie*ie),p=te||ee?Math.atan2(ee,te)*z:v.rotation||0,f=ie||se?Math.atan2(ie,se)*z+p:v.skewX||0,c=_-Math.abs(v.scaleX||0),m=u-Math.abs(v.scaleY||0),Math.abs(f)>90&&270>Math.abs(f)&&(y?(_*=-1,f+=0>=p?180:-180,p+=0>=p?180:-180):(u*=-1,f+=0>=f?180:-180)),d=(p-v.rotation)%180,g=(f-v.skewX)%180,(void 0===v.skewX||c>T||-T>c||m>T||-T>m||d>-x&&x>d&&false|d*w||g>-x&&x>g&&false|g*w)&&(v.scaleX=_,v.scaleY=u,v.rotation=p,v.skewX=f),xe&&(v.rotationX=v.rotationY=v.z=0,v.perspective=parseFloat(a.defaultTransformPerspective)||0,v.scaleZ=1)}v.zOrigin=P;for(o in v)T>v[o]&&v[o]>-T&&(v[o]=0);return i&&(t._gsTransform=v),v},Se=function(t){var e,i,s=this.data,r=-s.rotation*M,n=r+s.skewX*M,a=1e5,o=(0|Math.cos(r)*s.scaleX*a)/a,h=(0|Math.sin(r)*s.scaleX*a)/a,l=(0|Math.sin(n)*-s.scaleY*a)/a,_=(0|Math.cos(n)*s.scaleY*a)/a,u=this.t.style,p=this.t.currentStyle;if(p){i=h,h=-l,l=-i,e=p.filter,u.filter="";var f,m,d=this.t.offsetWidth,g=this.t.offsetHeight,v="absolute"!==p.position,w="progid:DXImageTransform.Microsoft.Matrix(M11="+o+", M12="+h+", M21="+l+", M22="+_,x=s.x,b=s.y;if(null!=s.ox&&(f=(s.oxp?.01*d*s.ox:s.ox)-d/2,m=(s.oyp?.01*g*s.oy:s.oy)-g/2,x+=f-(f*o+m*h),b+=m-(f*l+m*_)),v?(f=d/2,m=g/2,w+=", Dx="+(f-(f*o+m*h)+x)+", Dy="+(m-(f*l+m*_)+b)+")"):w+=", sizingMethod='auto expand')",u.filter=-1!==e.indexOf("DXImageTransform.Microsoft.Matrix(")?e.replace(O,w):w+" "+e,(0===t||1===t)&&1===o&&0===h&&0===l&&1===_&&(v&&-1===w.indexOf("Dx=0, Dy=0")||T.test(e)&&100!==parseFloat(RegExp.$1)||-1===e.indexOf("gradient("&&e.indexOf("Alpha"))&&u.removeAttribute("filter")),!v){var P,S,k,R=8>c?1:-1;for(f=s.ieOffsetX||0,m=s.ieOffsetY||0,s.ieOffsetX=Math.round((d-((0>o?-o:o)*d+(0>h?-h:h)*g))/2+x),s.ieOffsetY=Math.round((g-((0>_?-_:_)*g+(0>l?-l:l)*d))/2+b),ce=0;4>ce;ce++)S=J[ce],P=p[S],i=-1!==P.indexOf("px")?parseFloat(P):$(this.t,S,parseFloat(P),P.replace(y,""))||0,k=i!==s[S]?2>ce?-s.ieOffsetX:-s.ieOffsetY:2>ce?f-s.ieOffsetX:m-s.ieOffsetY,u[S]=(s[S]=Math.round(i-k*(0===ce||2===ce?1:R)))+"px"}}},ke=N.set3DTransformRatio=function(t){var e,i,s,r,n,a,o,h,l,_,u,f,c,m,d,g,v,y,T,w,x,b,P,S=this.data,k=this.t.style,R=S.rotation*M,A=S.scaleX,C=S.scaleY,O=S.scaleZ,D=S.perspective;if(!(1!==t&&0!==t||"auto"!==S.force3D||S.rotationY||S.rotationX||1!==O||D||S.z))return Re.call(this,t),void 0;if(p){var z=1e-4;z>A&&A>-z&&(A=O=2e-5),z>C&&C>-z&&(C=O=2e-5),!D||S.z||S.rotationX||S.rotationY||(D=0)}if(R||S.skewX)y=Math.cos(R),T=Math.sin(R),e=y,n=T,S.skewX&&(R-=S.skewX*M,y=Math.cos(R),T=Math.sin(R),"simple"===S.skewType&&(w=Math.tan(S.skewX*M),w=Math.sqrt(1+w*w),y*=w,T*=w)),i=-T,a=y;else{if(!(S.rotationY||S.rotationX||1!==O||D))return k[ye]="translate3d("+S.x+"px,"+S.y+"px,"+S.z+"px)"+(1!==A||1!==C?" scale("+A+","+C+")":""),void 0;e=a=1,i=n=0}u=1,s=r=o=h=l=_=f=c=m=0,d=D?-1/D:0,g=S.zOrigin,v=1e5,R=S.rotationY*M,R&&(y=Math.cos(R),T=Math.sin(R),l=u*-T,c=d*-T,s=e*T,o=n*T,u*=y,d*=y,e*=y,n*=y),R=S.rotationX*M,R&&(y=Math.cos(R),T=Math.sin(R),w=i*y+s*T,x=a*y+o*T,b=_*y+u*T,P=m*y+d*T,s=i*-T+s*y,o=a*-T+o*y,u=_*-T+u*y,d=m*-T+d*y,i=w,a=x,_=b,m=P),1!==O&&(s*=O,o*=O,u*=O,d*=O),1!==C&&(i*=C,a*=C,_*=C,m*=C),1!==A&&(e*=A,n*=A,l*=A,c*=A),g&&(f-=g,r=s*f,h=o*f,f=u*f+g),r=(w=(r+=S.x)-(r|=0))?(0|w*v+(0>w?-.5:.5))/v+r:r,h=(w=(h+=S.y)-(h|=0))?(0|w*v+(0>w?-.5:.5))/v+h:h,f=(w=(f+=S.z)-(f|=0))?(0|w*v+(0>w?-.5:.5))/v+f:f,k[ye]="matrix3d("+[(0|e*v)/v,(0|n*v)/v,(0|l*v)/v,(0|c*v)/v,(0|i*v)/v,(0|a*v)/v,(0|_*v)/v,(0|m*v)/v,(0|s*v)/v,(0|o*v)/v,(0|u*v)/v,(0|d*v)/v,r,h,f,D?1+-f/D:1].join(",")+")"},Re=N.set2DTransformRatio=function(t){var e,i,s,r,n,a=this.data,o=this.t,h=o.style;return a.rotationX||a.rotationY||a.z||a.force3D===!0||"auto"===a.force3D&&1!==t&&0!==t?(this.setRatio=ke,ke.call(this,t),void 0):(a.rotation||a.skewX?(e=a.rotation*M,i=e-a.skewX*M,s=1e5,r=a.scaleX*s,n=a.scaleY*s,h[ye]="matrix("+(0|Math.cos(e)*r)/s+","+(0|Math.sin(e)*r)/s+","+(0|Math.sin(i)*-n)/s+","+(0|Math.cos(i)*n)/s+","+a.x+","+a.y+")"):h[ye]="matrix("+a.scaleX+",0,0,"+a.scaleY+","+a.x+","+a.y+")",void 0)};de("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType",{parser:function(t,e,i,s,n,o,h){if(s._transform)return n;var l,_,u,p,f,c,m,d=s._transform=Pe(t,r,!0,h.parseTransform),g=t.style,v=1e-6,y=ve.length,T=h,w={};if("string"==typeof T.transform&&ye)u=L.style,u[ye]=T.transform,u.display="block",u.position="absolute",E.body.appendChild(L),l=Pe(L,null,!1),E.body.removeChild(L);else if("object"==typeof T){if(l={scaleX:se(null!=T.scaleX?T.scaleX:T.scale,d.scaleX),scaleY:se(null!=T.scaleY?T.scaleY:T.scale,d.scaleY),scaleZ:se(T.scaleZ,d.scaleZ),x:se(T.x,d.x),y:se(T.y,d.y),z:se(T.z,d.z),perspective:se(T.transformPerspective,d.perspective)},m=T.directionalRotation,null!=m)if("object"==typeof m)for(u in m)T[u]=m[u];else T.rotation=m;l.rotation=re("rotation"in T?T.rotation:"shortRotation"in T?T.shortRotation+"_short":"rotationZ"in T?T.rotationZ:d.rotation,d.rotation,"rotation",w),xe&&(l.rotationX=re("rotationX"in T?T.rotationX:"shortRotationX"in T?T.shortRotationX+"_short":d.rotationX||0,d.rotationX,"rotationX",w),l.rotationY=re("rotationY"in T?T.rotationY:"shortRotationY"in T?T.shortRotationY+"_short":d.rotationY||0,d.rotationY,"rotationY",w)),l.skewX=null==T.skewX?d.skewX:re(T.skewX,d.skewX),l.skewY=null==T.skewY?d.skewY:re(T.skewY,d.skewY),(_=l.skewY-d.skewY)&&(l.skewX+=_,l.rotation+=_)}for(xe&&null!=T.force3D&&(d.force3D=T.force3D,c=!0),d.skewType=T.skewType||d.skewType||a.defaultSkewType,f=d.force3D||d.z||d.rotationX||d.rotationY||l.z||l.rotationX||l.rotationY||l.perspective,f||null==T.scale||(l.scaleZ=1);--y>-1;)i=ve[y],p=l[i]-d[i],(p>v||-v>p||null!=I[i])&&(c=!0,n=new pe(d,i,d[i],p,n),i in w&&(n.e=w[i]),n.xs0=0,n.plugin=o,s._overwriteProps.push(n.n));return p=T.transformOrigin,(p||xe&&f&&d.zOrigin)&&(ye?(c=!0,i=we,p=(p||G(t,i,r,!1,"50% 50%"))+"",n=new pe(g,i,0,0,n,-1,"transformOrigin"),n.b=g[i],n.plugin=o,xe?(u=d.zOrigin,p=p.split(" "),d.zOrigin=(p.length>2&&(0===u||"0px"!==p[2])?parseFloat(p[2]):u)||0,n.xs0=n.e=p[0]+" "+(p[1]||"50%")+" 0px",n=new pe(d,"zOrigin",0,0,n,-1,n.n),n.b=u,n.xs0=n.e=d.zOrigin):n.xs0=n.e=p):ee(p+"",d)),c&&(s._transformType=f||3===this._transformType?3:2),n},prefix:!0}),de("boxShadow",{defaultValue:"0px 0px 0px 0px #999",prefix:!0,color:!0,multi:!0,keyword:"inset"}),de("borderRadius",{defaultValue:"0px",parser:function(t,e,i,n,a){e=this.format(e);var o,h,l,_,u,p,f,c,m,d,g,v,y,T,w,x,b=["borderTopLeftRadius","borderTopRightRadius","borderBottomRightRadius","borderBottomLeftRadius"],P=t.style;for(m=parseFloat(t.offsetWidth),d=parseFloat(t.offsetHeight),o=e.split(" "),h=0;b.length>h;h++)this.p.indexOf("border")&&(b[h]=V(b[h])),u=_=G(t,b[h],r,!1,"0px"),-1!==u.indexOf(" ")&&(_=u.split(" "),u=_[0],_=_[1]),p=l=o[h],f=parseFloat(u),v=u.substr((f+"").length),y="="===p.charAt(1),y?(c=parseInt(p.charAt(0)+"1",10),p=p.substr(2),c*=parseFloat(p),g=p.substr((c+"").length-(0>c?1:0))||""):(c=parseFloat(p),g=p.substr((c+"").length)),""===g&&(g=s[i]||v),g!==v&&(T=$(t,"borderLeft",f,v),w=$(t,"borderTop",f,v),"%"===g?(u=100*(T/m)+"%",_=100*(w/d)+"%"):"em"===g?(x=$(t,"borderLeft",1,"em"),u=T/x+"em",_=w/x+"em"):(u=T+"px",_=w+"px"),y&&(p=parseFloat(u)+c+g,l=parseFloat(_)+c+g)),a=fe(P,b[h],u+" "+_,p+" "+l,!1,"0px",a);return a},prefix:!0,formatter:le("0px 0px 0px 0px",!1,!0)}),de("backgroundPosition",{defaultValue:"0 0",parser:function(t,e,i,s,n,a){var o,h,l,_,u,p,f="background-position",m=r||W(t,null),d=this.format((m?c?m.getPropertyValue(f+"-x")+" "+m.getPropertyValue(f+"-y"):m.getPropertyValue(f):t.currentStyle.backgroundPositionX+" "+t.currentStyle.backgroundPositionY)||"0 0"),g=this.format(e);if(-1!==d.indexOf("%")!=(-1!==g.indexOf("%"))&&(p=G(t,"backgroundImage").replace(k,""),p&&"none"!==p)){for(o=d.split(" "),h=g.split(" "),F.setAttribute("src",p),l=2;--l>-1;)d=o[l],_=-1!==d.indexOf("%"),_!==(-1!==h[l].indexOf("%"))&&(u=0===l?t.offsetWidth-F.width:t.offsetHeight-F.height,o[l]=_?parseFloat(d)/100*u+"px":100*(parseFloat(d)/u)+"%");d=o.join(" ")}return this.parseComplex(t.style,d,g,n,a)},formatter:ee}),de("backgroundSize",{defaultValue:"0 0",formatter:ee}),de("perspective",{defaultValue:"0px",prefix:!0}),de("perspectiveOrigin",{defaultValue:"50% 50%",prefix:!0}),de("transformStyle",{prefix:!0}),de("backfaceVisibility",{prefix:!0}),de("userSelect",{prefix:!0}),de("margin",{parser:_e("marginTop,marginRight,marginBottom,marginLeft")}),de("padding",{parser:_e("paddingTop,paddingRight,paddingBottom,paddingLeft")}),de("clip",{defaultValue:"rect(0px,0px,0px,0px)",parser:function(t,e,i,s,n,a){var o,h,l;return 9>c?(h=t.currentStyle,l=8>c?" ":",",o="rect("+h.clipTop+l+h.clipRight+l+h.clipBottom+l+h.clipLeft+")",e=this.format(e).split(",").join(l)):(o=this.format(G(t,this.p,r,!1,this.dflt)),e=this.format(e)),this.parseComplex(t.style,o,e,n,a)}}),de("textShadow",{defaultValue:"0px 0px 0px #999",color:!0,multi:!0}),de("autoRound,strictUnits",{parser:function(t,e,i,s,r){return r}}),de("border",{defaultValue:"0px solid #000",parser:function(t,e,i,s,n,a){return this.parseComplex(t.style,this.format(G(t,"borderTopWidth",r,!1,"0px")+" "+G(t,"borderTopStyle",r,!1,"solid")+" "+G(t,"borderTopColor",r,!1,"#000")),this.format(e),n,a)},color:!0,formatter:function(t){var e=t.split(" ");return e[0]+" "+(e[1]||"solid")+" "+(t.match(he)||["#000"])[0]}}),de("borderWidth",{parser:_e("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")}),de("float,cssFloat,styleFloat",{parser:function(t,e,i,s,r){var n=t.style,a="cssFloat"in n?"cssFloat":"styleFloat";return new pe(n,a,0,0,r,-1,i,!1,0,n[a],e)}});var Ae=function(t){var e,i=this.t,s=i.filter||G(this.data,"filter"),r=0|this.s+this.c*t;100===r&&(-1===s.indexOf("atrix(")&&-1===s.indexOf("radient(")&&-1===s.indexOf("oader(")?(i.removeAttribute("filter"),e=!G(this.data,"filter")):(i.filter=s.replace(x,""),e=!0)),e||(this.xn1&&(i.filter=s=s||"alpha(opacity="+r+")"),-1===s.indexOf("pacity")?0===r&&this.xn1||(i.filter=s+" alpha(opacity="+r+")"):i.filter=s.replace(T,"opacity="+r))};de("opacity,alpha,autoAlpha",{defaultValue:"1",parser:function(t,e,i,s,n,a){var o=parseFloat(G(t,"opacity",r,!1,"1")),h=t.style,l="autoAlpha"===i;return"string"==typeof e&&"="===e.charAt(1)&&(e=("-"===e.charAt(0)?-1:1)*parseFloat(e.substr(2))+o),l&&1===o&&"hidden"===G(t,"visibility",r)&&0!==e&&(o=0),U?n=new pe(h,"opacity",o,e-o,n):(n=new pe(h,"opacity",100*o,100*(e-o),n),n.xn1=l?1:0,h.zoom=1,n.type=2,n.b="alpha(opacity="+n.s+")",n.e="alpha(opacity="+(n.s+n.c)+")",n.data=t,n.plugin=a,n.setRatio=Ae),l&&(n=new pe(h,"visibility",0,0,n,-1,null,!1,0,0!==o?"inherit":"hidden",0===e?"hidden":"inherit"),n.xs0="inherit",s._overwriteProps.push(n.n),s._overwriteProps.push(i)),n}});var Ce=function(t,e){e&&(t.removeProperty?("ms"===e.substr(0,2)&&(e="M"+e.substr(1)),t.removeProperty(e.replace(P,"-$1").toLowerCase())):t.removeAttribute(e))},Oe=function(t){if(this.t._gsClassPT=this,1===t||0===t){this.t.setAttribute("class",0===t?this.b:this.e);for(var e=this.data,i=this.t.style;e;)e.v?i[e.p]=e.v:Ce(i,e.p),e=e._next;1===t&&this.t._gsClassPT===this&&(this.t._gsClassPT=null)}else this.t.getAttribute("class")!==this.e&&this.t.setAttribute("class",this.e)};de("className",{parser:function(t,e,s,n,a,o,h){var l,_,u,p,f,c=t.getAttribute("class")||"",m=t.style.cssText;if(a=n._classNamePT=new pe(t,s,0,0,a,2),a.setRatio=Oe,a.pr=-11,i=!0,a.b=c,_=Q(t,r),u=t._gsClassPT){for(p={},f=u.data;f;)p[f.p]=1,f=f._next;u.setRatio(1)}return t._gsClassPT=a,a.e="="!==e.charAt(1)?e:c.replace(RegExp("\\s*\\b"+e.substr(2)+"\\b"),"")+("+"===e.charAt(0)?" "+e.substr(2):""),n._tween._duration&&(t.setAttribute("class",a.e),l=H(t,_,Q(t),h,p),t.setAttribute("class",c),a.data=l.firstMPT,t.style.cssText=m,a=a.xfirst=n.parse(t,l.difs,a,o)),a}});var De=function(t){if((1===t||0===t)&&this.data._totalTime===this.data._totalDuration&&"isFromStart"!==this.data.data){var e,i,s,r,n=this.t.style,a=o.transform.parse;if("all"===this.e)n.cssText="",r=!0;else for(e=this.e.split(","),s=e.length;--s>-1;)i=e[s],o[i]&&(o[i].parse===a?r=!0:i="transformOrigin"===i?we:o[i].p),Ce(n,i);r&&(Ce(n,ye),this.t._gsTransform&&delete this.t._gsTransform)}};for(de("clearProps",{parser:function(t,e,s,r,n){return n=new pe(t,s,0,0,n,2),n.setRatio=De,n.e=e,n.pr=-10,n.data=r._tween,i=!0,n}}),h="bezier,throwProps,physicsProps,physics2D".split(","),ce=h.length;ce--;)ge(h[ce]);h=a.prototype,h._firstPT=null,h._onInitTween=function(t,e,o){if(!t.nodeType)return!1;this._target=t,this._tween=o,this._vars=e,l=e.autoRound,i=!1,s=e.suffixMap||a.suffixMap,r=W(t,""),n=this._overwriteProps;var h,p,c,m,d,g,v,y,T,x=t.style;if(_&&""===x.zIndex&&(h=G(t,"zIndex",r),("auto"===h||""===h)&&this._addLazySet(x,"zIndex",0)),"string"==typeof e&&(m=x.cssText,h=Q(t,r),x.cssText=m+";"+e,h=H(t,h,Q(t)).difs,!U&&w.test(e)&&(h.opacity=parseFloat(RegExp.$1)),e=h,x.cssText=m),this._firstPT=p=this.parse(t,e,null),this._transformType){for(T=3===this._transformType,ye?u&&(_=!0,""===x.zIndex&&(v=G(t,"zIndex",r),("auto"===v||""===v)&&this._addLazySet(x,"zIndex",0)),f&&this._addLazySet(x,"WebkitBackfaceVisibility",this._vars.WebkitBackfaceVisibility||(T?"visible":"hidden"))):x.zoom=1,c=p;c&&c._next;)c=c._next;y=new pe(t,"transform",0,0,null,2),this._linkCSSP(y,null,c),y.setRatio=T&&xe?ke:ye?Re:Se,y.data=this._transform||Pe(t,r,!0),n.pop()}if(i){for(;p;){for(g=p._next,c=m;c&&c.pr>p.pr;)c=c._next;(p._prev=c?c._prev:d)?p._prev._next=p:m=p,(p._next=c)?c._prev=p:d=p,p=g}this._firstPT=m}return!0},h.parse=function(t,e,i,n){var a,h,_,u,p,f,c,m,d,g,v=t.style;for(a in e)f=e[a],h=o[a],h?i=h.parse(t,f,a,this,i,n,e):(p=G(t,a,r)+"",d="string"==typeof f,"color"===a||"fill"===a||"stroke"===a||-1!==a.indexOf("Color")||d&&b.test(f)?(d||(f=oe(f),f=(f.length>3?"rgba(":"rgb(")+f.join(",")+")"),i=fe(v,a,p,f,!0,"transparent",i,0,n)):!d||-1===f.indexOf(" ")&&-1===f.indexOf(",")?(_=parseFloat(p),c=_||0===_?p.substr((_+"").length):"",(""===p||"auto"===p)&&("width"===a||"height"===a?(_=te(t,a,r),c="px"):"left"===a||"top"===a?(_=Z(t,a,r),c="px"):(_="opacity"!==a?0:1,c="")),g=d&&"="===f.charAt(1),g?(u=parseInt(f.charAt(0)+"1",10),f=f.substr(2),u*=parseFloat(f),m=f.replace(y,"")):(u=parseFloat(f),m=d?f.substr((u+"").length)||"":""),""===m&&(m=a in s?s[a]:c),f=u||0===u?(g?u+_:u)+m:e[a],c!==m&&""!==m&&(u||0===u)&&_&&(_=$(t,a,_,c),"%"===m?(_/=$(t,a,100,"%")/100,e.strictUnits!==!0&&(p=_+"%")):"em"===m?_/=$(t,a,1,"em"):"px"!==m&&(u=$(t,a,u,m),m="px"),g&&(u||0===u)&&(f=u+_+m)),g&&(u+=_),!_&&0!==_||!u&&0!==u?void 0!==v[a]&&(f||"NaN"!=f+""&&null!=f)?(i=new pe(v,a,u||_||0,0,i,-1,a,!1,0,p,f),i.xs0="none"!==f||"display"!==a&&-1===a.indexOf("Style")?f:p):j("invalid "+a+" tween value: "+e[a]):(i=new pe(v,a,_,u-_,i,0,a,l!==!1&&("px"===m||"zIndex"===a),0,p,f),i.xs0=m)):i=fe(v,a,p,f,!0,null,i,0,n)),n&&i&&!i.plugin&&(i.plugin=n);return i},h.setRatio=function(t){var e,i,s,r=this._firstPT,n=1e-6;if(1!==t||this._tween._time!==this._tween._duration&&0!==this._tween._time)if(t||this._tween._time!==this._tween._duration&&0!==this._tween._time||this._tween._rawPrevTime===-1e-6)for(;r;){if(e=r.c*t+r.s,r.r?e=Math.round(e):n>e&&e>-n&&(e=0),r.type)if(1===r.type)if(s=r.l,2===s)r.t[r.p]=r.xs0+e+r.xs1+r.xn1+r.xs2;else if(3===s)r.t[r.p]=r.xs0+e+r.xs1+r.xn1+r.xs2+r.xn2+r.xs3;else if(4===s)r.t[r.p]=r.xs0+e+r.xs1+r.xn1+r.xs2+r.xn2+r.xs3+r.xn3+r.xs4;else if(5===s)r.t[r.p]=r.xs0+e+r.xs1+r.xn1+r.xs2+r.xn2+r.xs3+r.xn3+r.xs4+r.xn4+r.xs5;else{for(i=r.xs0+e+r.xs1,s=1;r.l>s;s++)i+=r["xn"+s]+r["xs"+(s+1)];r.t[r.p]=i}else-1===r.type?r.t[r.p]=r.xs0:r.setRatio&&r.setRatio(t);else r.t[r.p]=e+r.xs0;r=r._next}else for(;r;)2!==r.type?r.t[r.p]=r.b:r.setRatio(t),r=r._next;else for(;r;)2!==r.type?r.t[r.p]=r.e:r.setRatio(t),r=r._next},h._enableTransforms=function(t){this._transformType=t||3===this._transformType?3:2,this._transform=this._transform||Pe(this._target,r,!0)};var Me=function(){this.t[this.p]=this.e,this.data._linkCSSP(this,this._next,null,!0)
};h._addLazySet=function(t,e,i){var s=this._firstPT=new pe(t,e,0,0,this._firstPT,2);s.e=i,s.setRatio=Me,s.data=this},h._linkCSSP=function(t,e,i,s){return t&&(e&&(e._prev=t),t._next&&(t._next._prev=t._prev),t._prev?t._prev._next=t._next:this._firstPT===t&&(this._firstPT=t._next,s=!0),i?i._next=t:s||null!==this._firstPT||(this._firstPT=t),t._next=e,t._prev=i),t},h._kill=function(e){var i,s,r,n=e;if(e.autoAlpha||e.alpha){n={};for(s in e)n[s]=e[s];n.opacity=1,n.autoAlpha&&(n.visibility=1)}return e.className&&(i=this._classNamePT)&&(r=i.xfirst,r&&r._prev?this._linkCSSP(r._prev,i._next,r._prev._prev):r===this._firstPT&&(this._firstPT=i._next),i._next&&this._linkCSSP(i._next,i._next._next,r._prev),this._classNamePT=null),t.prototype._kill.call(this,n)};var ze=function(t,e,i){var s,r,n,a;if(t.slice)for(r=t.length;--r>-1;)ze(t[r],e,i);else for(s=t.childNodes,r=s.length;--r>-1;)n=s[r],a=n.type,n.style&&(e.push(Q(n)),i&&i.push(n)),1!==a&&9!==a&&11!==a||!n.childNodes.length||ze(n,e,i)};return a.cascadeTo=function(t,i,s){var r,n,a,o=e.to(t,i,s),h=[o],l=[],_=[],u=[],p=e._internals.reservedProps;for(t=o._targets||o.target,ze(t,l,u),o.render(i,!0),ze(t,_),o.render(0,!0),o._enabled(!0),r=u.length;--r>-1;)if(n=H(u[r],l[r],_[r]),n.firstMPT){n=n.difs;for(a in s)p[a]&&(n[a]=s[a]);h.push(e.to(u[r],i,n))}return h},t.activate([a]),a},!0),function(){var t=window._gsDefine.plugin({propName:"roundProps",priority:-1,API:2,init:function(t,e,i){return this._tween=i,!0}}),e=t.prototype;e._onInitAllProps=function(){for(var t,e,i,s=this._tween,r=s.vars.roundProps instanceof Array?s.vars.roundProps:s.vars.roundProps.split(","),n=r.length,a={},o=s._propLookup.roundProps;--n>-1;)a[r[n]]=1;for(n=r.length;--n>-1;)for(t=r[n],e=s._firstPT;e;)i=e._next,e.pg?e.t._roundProps(a,!0):e.n===t&&(this._add(e.t,t,e.s,e.c),i&&(i._prev=e._prev),e._prev?e._prev._next=i:s._firstPT===e&&(s._firstPT=i),e._next=e._prev=null,s._propLookup[t]=o),e=i;return!1},e._add=function(t,e,i,s){this._addTween(t,e,i,i+s,e,!0),this._overwriteProps.push(e)}}(),window._gsDefine.plugin({propName:"attr",API:2,version:"0.3.2",init:function(t,e){var i,s,r;if("function"!=typeof t.setAttribute)return!1;this._target=t,this._proxy={},this._start={},this._end={};for(i in e)this._start[i]=this._proxy[i]=s=t.getAttribute(i),r=this._addTween(this._proxy,i,parseFloat(s),e[i],i),this._end[i]=r?r.s+r.c:e[i],this._overwriteProps.push(i);return!0},set:function(t){this._super.setRatio.call(this,t);for(var e,i=this._overwriteProps,s=i.length,r=1===t?this._end:t?this._proxy:this._start;--s>-1;)e=i[s],this._target.setAttribute(e,r[e]+"")}}),window._gsDefine.plugin({propName:"directionalRotation",API:2,version:"0.2.0",init:function(t,e){"object"!=typeof e&&(e={rotation:e}),this.finals={};var i,s,r,n,a,o,h=e.useRadians===!0?2*Math.PI:360,l=1e-6;for(i in e)"useRadians"!==i&&(o=(e[i]+"").split("_"),s=o[0],r=parseFloat("function"!=typeof t[i]?t[i]:t[i.indexOf("set")||"function"!=typeof t["get"+i.substr(3)]?i:"get"+i.substr(3)]()),n=this.finals[i]="string"==typeof s&&"="===s.charAt(1)?r+parseInt(s.charAt(0)+"1",10)*Number(s.substr(2)):Number(s)||0,a=n-r,o.length&&(s=o.join("_"),-1!==s.indexOf("short")&&(a%=h,a!==a%(h/2)&&(a=0>a?a+h:a-h)),-1!==s.indexOf("_cw")&&0>a?a=(a+9999999999*h)%h-(0|a/h)*h:-1!==s.indexOf("ccw")&&a>0&&(a=(a-9999999999*h)%h-(0|a/h)*h)),(a>l||-l>a)&&(this._addTween(t,i,r,r+a,i),this._overwriteProps.push(i)));return!0},set:function(t){var e;if(1!==t)this._super.setRatio.call(this,t);else for(e=this._firstPT;e;)e.f?e.t[e.p](this.finals[e.p]):e.t[e.p]=this.finals[e.p],e=e._next}})._autoCSS=!0,window._gsDefine("easing.Back",["easing.Ease"],function(t){var e,i,s,r=window.GreenSockGlobals||window,n=r.com.greensock,a=2*Math.PI,o=Math.PI/2,h=n._class,l=function(e,i){var s=h("easing."+e,function(){},!0),r=s.prototype=new t;return r.constructor=s,r.getRatio=i,s},_=t.register||function(){},u=function(t,e,i,s){var r=h("easing."+t,{easeOut:new e,easeIn:new i,easeInOut:new s},!0);return _(r,t),r},p=function(t,e,i){this.t=t,this.v=e,i&&(this.next=i,i.prev=this,this.c=i.v-e,this.gap=i.t-t)},f=function(e,i){var s=h("easing."+e,function(t){this._p1=t||0===t?t:1.70158,this._p2=1.525*this._p1},!0),r=s.prototype=new t;return r.constructor=s,r.getRatio=i,r.config=function(t){return new s(t)},s},c=u("Back",f("BackOut",function(t){return(t-=1)*t*((this._p1+1)*t+this._p1)+1}),f("BackIn",function(t){return t*t*((this._p1+1)*t-this._p1)}),f("BackInOut",function(t){return 1>(t*=2)?.5*t*t*((this._p2+1)*t-this._p2):.5*((t-=2)*t*((this._p2+1)*t+this._p2)+2)})),m=h("easing.SlowMo",function(t,e,i){e=e||0===e?e:.7,null==t?t=.7:t>1&&(t=1),this._p=1!==t?e:0,this._p1=(1-t)/2,this._p2=t,this._p3=this._p1+this._p2,this._calcEnd=i===!0},!0),d=m.prototype=new t;return d.constructor=m,d.getRatio=function(t){var e=t+(.5-t)*this._p;return this._p1>t?this._calcEnd?1-(t=1-t/this._p1)*t:e-(t=1-t/this._p1)*t*t*t*e:t>this._p3?this._calcEnd?1-(t=(t-this._p3)/this._p1)*t:e+(t-e)*(t=(t-this._p3)/this._p1)*t*t*t:this._calcEnd?1:e},m.ease=new m(.7,.7),d.config=m.config=function(t,e,i){return new m(t,e,i)},e=h("easing.SteppedEase",function(t){t=t||1,this._p1=1/t,this._p2=t+1},!0),d=e.prototype=new t,d.constructor=e,d.getRatio=function(t){return 0>t?t=0:t>=1&&(t=.999999999),(this._p2*t>>0)*this._p1},d.config=e.config=function(t){return new e(t)},i=h("easing.RoughEase",function(e){e=e||{};for(var i,s,r,n,a,o,h=e.taper||"none",l=[],_=0,u=0|(e.points||20),f=u,c=e.randomize!==!1,m=e.clamp===!0,d=e.template instanceof t?e.template:null,g="number"==typeof e.strength?.4*e.strength:.4;--f>-1;)i=c?Math.random():1/u*f,s=d?d.getRatio(i):i,"none"===h?r=g:"out"===h?(n=1-i,r=n*n*g):"in"===h?r=i*i*g:.5>i?(n=2*i,r=.5*n*n*g):(n=2*(1-i),r=.5*n*n*g),c?s+=Math.random()*r-.5*r:f%2?s+=.5*r:s-=.5*r,m&&(s>1?s=1:0>s&&(s=0)),l[_++]={x:i,y:s};for(l.sort(function(t,e){return t.x-e.x}),o=new p(1,1,null),f=u;--f>-1;)a=l[f],o=new p(a.x,a.y,o);this._prev=new p(0,0,0!==o.t?o:o.next)},!0),d=i.prototype=new t,d.constructor=i,d.getRatio=function(t){var e=this._prev;if(t>e.t){for(;e.next&&t>=e.t;)e=e.next;e=e.prev}else for(;e.prev&&e.t>=t;)e=e.prev;return this._prev=e,e.v+(t-e.t)/e.gap*e.c},d.config=function(t){return new i(t)},i.ease=new i,u("Bounce",l("BounceOut",function(t){return 1/2.75>t?7.5625*t*t:2/2.75>t?7.5625*(t-=1.5/2.75)*t+.75:2.5/2.75>t?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375}),l("BounceIn",function(t){return 1/2.75>(t=1-t)?1-7.5625*t*t:2/2.75>t?1-(7.5625*(t-=1.5/2.75)*t+.75):2.5/2.75>t?1-(7.5625*(t-=2.25/2.75)*t+.9375):1-(7.5625*(t-=2.625/2.75)*t+.984375)}),l("BounceInOut",function(t){var e=.5>t;return t=e?1-2*t:2*t-1,t=1/2.75>t?7.5625*t*t:2/2.75>t?7.5625*(t-=1.5/2.75)*t+.75:2.5/2.75>t?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375,e?.5*(1-t):.5*t+.5})),u("Circ",l("CircOut",function(t){return Math.sqrt(1-(t-=1)*t)}),l("CircIn",function(t){return-(Math.sqrt(1-t*t)-1)}),l("CircInOut",function(t){return 1>(t*=2)?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)})),s=function(e,i,s){var r=h("easing."+e,function(t,e){this._p1=t||1,this._p2=e||s,this._p3=this._p2/a*(Math.asin(1/this._p1)||0)},!0),n=r.prototype=new t;return n.constructor=r,n.getRatio=i,n.config=function(t,e){return new r(t,e)},r},u("Elastic",s("ElasticOut",function(t){return this._p1*Math.pow(2,-10*t)*Math.sin((t-this._p3)*a/this._p2)+1},.3),s("ElasticIn",function(t){return-(this._p1*Math.pow(2,10*(t-=1))*Math.sin((t-this._p3)*a/this._p2))},.3),s("ElasticInOut",function(t){return 1>(t*=2)?-.5*this._p1*Math.pow(2,10*(t-=1))*Math.sin((t-this._p3)*a/this._p2):.5*this._p1*Math.pow(2,-10*(t-=1))*Math.sin((t-this._p3)*a/this._p2)+1},.45)),u("Expo",l("ExpoOut",function(t){return 1-Math.pow(2,-10*t)}),l("ExpoIn",function(t){return Math.pow(2,10*(t-1))-.001}),l("ExpoInOut",function(t){return 1>(t*=2)?.5*Math.pow(2,10*(t-1)):.5*(2-Math.pow(2,-10*(t-1)))})),u("Sine",l("SineOut",function(t){return Math.sin(t*o)}),l("SineIn",function(t){return-Math.cos(t*o)+1}),l("SineInOut",function(t){return-.5*(Math.cos(Math.PI*t)-1)})),h("easing.EaseLookup",{find:function(e){return t.map[e]}},!0),_(r.SlowMo,"SlowMo","ease,"),_(i,"RoughEase","ease,"),_(e,"SteppedEase","ease,"),c},!0)}),function(t){"use strict";var e=t.GreenSockGlobals||t;if(!e.TweenLite){var i,s,r,n,a,o=function(t){var i,s=t.split("."),r=e;for(i=0;s.length>i;i++)r[s[i]]=r=r[s[i]]||{};return r},h=o("com.greensock"),l=1e-10,_=[].slice,u=function(){},p=function(){var t=Object.prototype.toString,e=t.call([]);return function(i){return null!=i&&(i instanceof Array||"object"==typeof i&&!!i.push&&t.call(i)===e)}}(),f={},c=function(i,s,r,n){this.sc=f[i]?f[i].sc:[],f[i]=this,this.gsClass=null,this.func=r;var a=[];this.check=function(h){for(var l,_,u,p,m=s.length,d=m;--m>-1;)(l=f[s[m]]||new c(s[m],[])).gsClass?(a[m]=l.gsClass,d--):h&&l.sc.push(this);if(0===d&&r)for(_=("com.greensock."+i).split("."),u=_.pop(),p=o(_.join("."))[u]=this.gsClass=r.apply(r,a),n&&(e[u]=p,"function"==typeof define&&define.amd?define((t.GreenSockAMDPath?t.GreenSockAMDPath+"/":"")+i.split(".").join("/"),[],function(){return p}):"undefined"!=typeof module&&module.exports&&(module.exports=p)),m=0;this.sc.length>m;m++)this.sc[m].check()},this.check(!0)},m=t._gsDefine=function(t,e,i,s){return new c(t,e,i,s)},d=h._class=function(t,e,i){return e=e||function(){},m(t,[],function(){return e},i),e};m.globals=e;var g=[0,0,1,1],v=[],y=d("easing.Ease",function(t,e,i,s){this._func=t,this._type=i||0,this._power=s||0,this._params=e?g.concat(e):g},!0),T=y.map={},w=y.register=function(t,e,i,s){for(var r,n,a,o,l=e.split(","),_=l.length,u=(i||"easeIn,easeOut,easeInOut").split(",");--_>-1;)for(n=l[_],r=s?d("easing."+n,null,!0):h.easing[n]||{},a=u.length;--a>-1;)o=u[a],T[n+"."+o]=T[o+n]=r[o]=t.getRatio?t:t[o]||new t};for(r=y.prototype,r._calcEnd=!1,r.getRatio=function(t){if(this._func)return this._params[0]=t,this._func.apply(null,this._params);var e=this._type,i=this._power,s=1===e?1-t:2===e?t:.5>t?2*t:2*(1-t);return 1===i?s*=s:2===i?s*=s*s:3===i?s*=s*s*s:4===i&&(s*=s*s*s*s),1===e?1-s:2===e?s:.5>t?s/2:1-s/2},i=["Linear","Quad","Cubic","Quart","Quint,Strong"],s=i.length;--s>-1;)r=i[s]+",Power"+s,w(new y(null,null,1,s),r,"easeOut",!0),w(new y(null,null,2,s),r,"easeIn"+(0===s?",easeNone":"")),w(new y(null,null,3,s),r,"easeInOut");T.linear=h.easing.Linear.easeIn,T.swing=h.easing.Quad.easeInOut;var x=d("events.EventDispatcher",function(t){this._listeners={},this._eventTarget=t||this});r=x.prototype,r.addEventListener=function(t,e,i,s,r){r=r||0;var o,h,l=this._listeners[t],_=0;for(null==l&&(this._listeners[t]=l=[]),h=l.length;--h>-1;)o=l[h],o.c===e&&o.s===i?l.splice(h,1):0===_&&r>o.pr&&(_=h+1);l.splice(_,0,{c:e,s:i,up:s,pr:r}),this!==n||a||n.wake()},r.removeEventListener=function(t,e){var i,s=this._listeners[t];if(s)for(i=s.length;--i>-1;)if(s[i].c===e)return s.splice(i,1),void 0},r.dispatchEvent=function(t){var e,i,s,r=this._listeners[t];if(r)for(e=r.length,i=this._eventTarget;--e>-1;)s=r[e],s.up?s.c.call(s.s||i,{type:t,target:i}):s.c.call(s.s||i)};var b=t.requestAnimationFrame,P=t.cancelAnimationFrame,S=Date.now||function(){return(new Date).getTime()},k=S();for(i=["ms","moz","webkit","o"],s=i.length;--s>-1&&!b;)b=t[i[s]+"RequestAnimationFrame"],P=t[i[s]+"CancelAnimationFrame"]||t[i[s]+"CancelRequestAnimationFrame"];d("Ticker",function(t,e){var i,s,r,o,h,_=this,p=S(),f=e!==!1&&b,c=500,m=33,d=function(t){var e,n,a=S()-k;a>c&&(p+=a-m),k+=a,_.time=(k-p)/1e3,e=_.time-h,(!i||e>0||t===!0)&&(_.frame++,h+=e+(e>=o?.004:o-e),n=!0),t!==!0&&(r=s(d)),n&&_.dispatchEvent("tick")};x.call(_),_.time=_.frame=0,_.tick=function(){d(!0)},_.lagSmoothing=function(t,e){c=t||1/l,m=Math.min(e,c,0)},_.sleep=function(){null!=r&&(f&&P?P(r):clearTimeout(r),s=u,r=null,_===n&&(a=!1))},_.wake=function(){null!==r?_.sleep():_.frame>10&&(k=S()-c+5),s=0===i?u:f&&b?b:function(t){return setTimeout(t,0|1e3*(h-_.time)+1)},_===n&&(a=!0),d(2)},_.fps=function(t){return arguments.length?(i=t,o=1/(i||60),h=this.time+o,_.wake(),void 0):i},_.useRAF=function(t){return arguments.length?(_.sleep(),f=t,_.fps(i),void 0):f},_.fps(t),setTimeout(function(){f&&(!r||5>_.frame)&&_.useRAF(!1)},1500)}),r=h.Ticker.prototype=new h.events.EventDispatcher,r.constructor=h.Ticker;var R=d("core.Animation",function(t,e){if(this.vars=e=e||{},this._duration=this._totalDuration=t||0,this._delay=Number(e.delay)||0,this._timeScale=1,this._active=e.immediateRender===!0,this.data=e.data,this._reversed=e.reversed===!0,j){a||n.wake();var i=this.vars.useFrames?Y:j;i.add(this,i._time),this.vars.paused&&this.paused(!0)}});n=R.ticker=new h.Ticker,r=R.prototype,r._dirty=r._gc=r._initted=r._paused=!1,r._totalTime=r._time=0,r._rawPrevTime=-1,r._next=r._last=r._onUpdate=r._timeline=r.timeline=null,r._paused=!1;var A=function(){a&&S()-k>2e3&&n.wake(),setTimeout(A,2e3)};A(),r.play=function(t,e){return null!=t&&this.seek(t,e),this.reversed(!1).paused(!1)},r.pause=function(t,e){return null!=t&&this.seek(t,e),this.paused(!0)},r.resume=function(t,e){return null!=t&&this.seek(t,e),this.paused(!1)},r.seek=function(t,e){return this.totalTime(Number(t),e!==!1)},r.restart=function(t,e){return this.reversed(!1).paused(!1).totalTime(t?-this._delay:0,e!==!1,!0)},r.reverse=function(t,e){return null!=t&&this.seek(t||this.totalDuration(),e),this.reversed(!0).paused(!1)},r.render=function(){},r.invalidate=function(){return this},r.isActive=function(){var t,e=this._timeline,i=this._startTime;return!e||!this._gc&&!this._paused&&e.isActive()&&(t=e.rawTime())>=i&&i+this.totalDuration()/this._timeScale>t},r._enabled=function(t,e){return a||n.wake(),this._gc=!t,this._active=this.isActive(),e!==!0&&(t&&!this.timeline?this._timeline.add(this,this._startTime-this._delay):!t&&this.timeline&&this._timeline._remove(this,!0)),!1},r._kill=function(){return this._enabled(!1,!1)},r.kill=function(t,e){return this._kill(t,e),this},r._uncache=function(t){for(var e=t?this:this.timeline;e;)e._dirty=!0,e=e.timeline;return this},r._swapSelfInParams=function(t){for(var e=t.length,i=t.concat();--e>-1;)"{self}"===t[e]&&(i[e]=this);return i},r.eventCallback=function(t,e,i,s){if("on"===(t||"").substr(0,2)){var r=this.vars;if(1===arguments.length)return r[t];null==e?delete r[t]:(r[t]=e,r[t+"Params"]=p(i)&&-1!==i.join("").indexOf("{self}")?this._swapSelfInParams(i):i,r[t+"Scope"]=s),"onUpdate"===t&&(this._onUpdate=e)}return this},r.delay=function(t){return arguments.length?(this._timeline.smoothChildTiming&&this.startTime(this._startTime+t-this._delay),this._delay=t,this):this._delay},r.duration=function(t){return arguments.length?(this._duration=this._totalDuration=t,this._uncache(!0),this._timeline.smoothChildTiming&&this._time>0&&this._time<this._duration&&0!==t&&this.totalTime(this._totalTime*(t/this._duration),!0),this):(this._dirty=!1,this._duration)},r.totalDuration=function(t){return this._dirty=!1,arguments.length?this.duration(t):this._totalDuration},r.time=function(t,e){return arguments.length?(this._dirty&&this.totalDuration(),this.totalTime(t>this._duration?this._duration:t,e)):this._time},r.totalTime=function(t,e,i){if(a||n.wake(),!arguments.length)return this._totalTime;if(this._timeline){if(0>t&&!i&&(t+=this.totalDuration()),this._timeline.smoothChildTiming){this._dirty&&this.totalDuration();var s=this._totalDuration,r=this._timeline;if(t>s&&!i&&(t=s),this._startTime=(this._paused?this._pauseTime:r._time)-(this._reversed?s-t:t)/this._timeScale,r._dirty||this._uncache(!1),r._timeline)for(;r._timeline;)r._timeline._time!==(r._startTime+r._totalTime)/r._timeScale&&r.totalTime(r._totalTime,!0),r=r._timeline}this._gc&&this._enabled(!0,!1),(this._totalTime!==t||0===this._duration)&&(this.render(t,e,!1),z.length&&B())}return this},r.progress=r.totalProgress=function(t,e){return arguments.length?this.totalTime(this.duration()*t,e):this._time/this.duration()},r.startTime=function(t){return arguments.length?(t!==this._startTime&&(this._startTime=t,this.timeline&&this.timeline._sortChildren&&this.timeline.add(this,t-this._delay)),this):this._startTime},r.timeScale=function(t){if(!arguments.length)return this._timeScale;if(t=t||l,this._timeline&&this._timeline.smoothChildTiming){var e=this._pauseTime,i=e||0===e?e:this._timeline.totalTime();this._startTime=i-(i-this._startTime)*this._timeScale/t}return this._timeScale=t,this._uncache(!1)},r.reversed=function(t){return arguments.length?(t!=this._reversed&&(this._reversed=t,this.totalTime(this._timeline&&!this._timeline.smoothChildTiming?this.totalDuration()-this._totalTime:this._totalTime,!0)),this):this._reversed},r.paused=function(t){if(!arguments.length)return this._paused;if(t!=this._paused&&this._timeline){a||t||n.wake();var e=this._timeline,i=e.rawTime(),s=i-this._pauseTime;!t&&e.smoothChildTiming&&(this._startTime+=s,this._uncache(!1)),this._pauseTime=t?i:null,this._paused=t,this._active=this.isActive(),!t&&0!==s&&this._initted&&this.duration()&&this.render(e.smoothChildTiming?this._totalTime:(i-this._startTime)/this._timeScale,!0,!0)}return this._gc&&!t&&this._enabled(!0,!1),this};var C=d("core.SimpleTimeline",function(t){R.call(this,0,t),this.autoRemoveChildren=this.smoothChildTiming=!0});r=C.prototype=new R,r.constructor=C,r.kill()._gc=!1,r._first=r._last=null,r._sortChildren=!1,r.add=r.insert=function(t,e){var i,s;if(t._startTime=Number(e||0)+t._delay,t._paused&&this!==t._timeline&&(t._pauseTime=t._startTime+(this.rawTime()-t._startTime)/t._timeScale),t.timeline&&t.timeline._remove(t,!0),t.timeline=t._timeline=this,t._gc&&t._enabled(!0,!0),i=this._last,this._sortChildren)for(s=t._startTime;i&&i._startTime>s;)i=i._prev;return i?(t._next=i._next,i._next=t):(t._next=this._first,this._first=t),t._next?t._next._prev=t:this._last=t,t._prev=i,this._timeline&&this._uncache(!0),this},r._remove=function(t,e){return t.timeline===this&&(e||t._enabled(!1,!0),t.timeline=null,t._prev?t._prev._next=t._next:this._first===t&&(this._first=t._next),t._next?t._next._prev=t._prev:this._last===t&&(this._last=t._prev),this._timeline&&this._uncache(!0)),this},r.render=function(t,e,i){var s,r=this._first;for(this._totalTime=this._time=this._rawPrevTime=t;r;)s=r._next,(r._active||t>=r._startTime&&!r._paused)&&(r._reversed?r.render((r._dirty?r.totalDuration():r._totalDuration)-(t-r._startTime)*r._timeScale,e,i):r.render((t-r._startTime)*r._timeScale,e,i)),r=s},r.rawTime=function(){return a||n.wake(),this._totalTime};var O=d("TweenLite",function(e,i,s){if(R.call(this,i,s),this.render=O.prototype.render,null==e)throw"Cannot tween a null target.";this.target=e="string"!=typeof e?e:O.selector(e)||e;var r,n,a,o=e.jquery||e.length&&e!==t&&e[0]&&(e[0]===t||e[0].nodeType&&e[0].style&&!e.nodeType),h=this.vars.overwrite;if(this._overwrite=h=null==h?U[O.defaultOverwrite]:"number"==typeof h?h>>0:U[h],(o||e instanceof Array||e.push&&p(e))&&"number"!=typeof e[0])for(this._targets=a=_.call(e,0),this._propLookup=[],this._siblings=[],r=0;a.length>r;r++)n=a[r],n?"string"!=typeof n?n.length&&n!==t&&n[0]&&(n[0]===t||n[0].nodeType&&n[0].style&&!n.nodeType)?(a.splice(r--,1),this._targets=a=a.concat(_.call(n,0))):(this._siblings[r]=q(n,this,!1),1===h&&this._siblings[r].length>1&&V(n,this,null,1,this._siblings[r])):(n=a[r--]=O.selector(n),"string"==typeof n&&a.splice(r+1,1)):a.splice(r--,1);else this._propLookup={},this._siblings=q(e,this,!1),1===h&&this._siblings.length>1&&V(e,this,null,1,this._siblings);(this.vars.immediateRender||0===i&&0===this._delay&&this.vars.immediateRender!==!1)&&(this._time=-l,this.render(-this._delay))},!0),D=function(e){return e.length&&e!==t&&e[0]&&(e[0]===t||e[0].nodeType&&e[0].style&&!e.nodeType)},M=function(t,e){var i,s={};for(i in t)X[i]||i in e&&"transform"!==i&&"x"!==i&&"y"!==i&&"width"!==i&&"height"!==i&&"className"!==i&&"border"!==i||!(!L[i]||L[i]&&L[i]._autoCSS)||(s[i]=t[i],delete t[i]);t.css=s};r=O.prototype=new R,r.constructor=O,r.kill()._gc=!1,r.ratio=0,r._firstPT=r._targets=r._overwrittenProps=r._startAt=null,r._notifyPluginsOfEnabled=r._lazy=!1,O.version="1.12.1",O.defaultEase=r._ease=new y(null,null,1,1),O.defaultOverwrite="auto",O.ticker=n,O.autoSleep=!0,O.lagSmoothing=function(t,e){n.lagSmoothing(t,e)},O.selector=t.$||t.jQuery||function(e){return t.$?(O.selector=t.$,t.$(e)):t.document?t.document.getElementById("#"===e.charAt(0)?e.substr(1):e):e};var z=[],I={},E=O._internals={isArray:p,isSelector:D,lazyTweens:z},L=O._plugins={},F=E.tweenLookup={},N=0,X=E.reservedProps={ease:1,delay:1,overwrite:1,onComplete:1,onCompleteParams:1,onCompleteScope:1,useFrames:1,runBackwards:1,startAt:1,onUpdate:1,onUpdateParams:1,onUpdateScope:1,onStart:1,onStartParams:1,onStartScope:1,onReverseComplete:1,onReverseCompleteParams:1,onReverseCompleteScope:1,onRepeat:1,onRepeatParams:1,onRepeatScope:1,easeParams:1,yoyo:1,immediateRender:1,repeat:1,repeatDelay:1,data:1,paused:1,reversed:1,autoCSS:1,lazy:1},U={none:0,all:1,auto:2,concurrent:3,allOnStart:4,preexisting:5,"true":1,"false":0},Y=R._rootFramesTimeline=new C,j=R._rootTimeline=new C,B=function(){var t=z.length;for(I={};--t>-1;)i=z[t],i&&i._lazy!==!1&&(i.render(i._lazy,!1,!0),i._lazy=!1);z.length=0};j._startTime=n.time,Y._startTime=n.frame,j._active=Y._active=!0,setTimeout(B,1),R._updateRoot=O.render=function(){var t,e,i;if(z.length&&B(),j.render((n.time-j._startTime)*j._timeScale,!1,!1),Y.render((n.frame-Y._startTime)*Y._timeScale,!1,!1),z.length&&B(),!(n.frame%120)){for(i in F){for(e=F[i].tweens,t=e.length;--t>-1;)e[t]._gc&&e.splice(t,1);0===e.length&&delete F[i]}if(i=j._first,(!i||i._paused)&&O.autoSleep&&!Y._first&&1===n._listeners.tick.length){for(;i&&i._paused;)i=i._next;i||n.sleep()}}},n.addEventListener("tick",R._updateRoot);var q=function(t,e,i){var s,r,n=t._gsTweenID;if(F[n||(t._gsTweenID=n="t"+N++)]||(F[n]={target:t,tweens:[]}),e&&(s=F[n].tweens,s[r=s.length]=e,i))for(;--r>-1;)s[r]===e&&s.splice(r,1);return F[n].tweens},V=function(t,e,i,s,r){var n,a,o,h;if(1===s||s>=4){for(h=r.length,n=0;h>n;n++)if((o=r[n])!==e)o._gc||o._enabled(!1,!1)&&(a=!0);else if(5===s)break;return a}var _,u=e._startTime+l,p=[],f=0,c=0===e._duration;for(n=r.length;--n>-1;)(o=r[n])===e||o._gc||o._paused||(o._timeline!==e._timeline?(_=_||W(e,0,c),0===W(o,_,c)&&(p[f++]=o)):u>=o._startTime&&o._startTime+o.totalDuration()/o._timeScale>u&&((c||!o._initted)&&2e-10>=u-o._startTime||(p[f++]=o)));for(n=f;--n>-1;)o=p[n],2===s&&o._kill(i,t)&&(a=!0),(2!==s||!o._firstPT&&o._initted)&&o._enabled(!1,!1)&&(a=!0);return a},W=function(t,e,i){for(var s=t._timeline,r=s._timeScale,n=t._startTime;s._timeline;){if(n+=s._startTime,r*=s._timeScale,s._paused)return-100;s=s._timeline}return n/=r,n>e?n-e:i&&n===e||!t._initted&&2*l>n-e?l:(n+=t.totalDuration()/t._timeScale/r)>e+l?0:n-e-l};r._init=function(){var t,e,i,s,r,n=this.vars,a=this._overwrittenProps,o=this._duration,h=!!n.immediateRender,l=n.ease;if(n.startAt){this._startAt&&(this._startAt.render(-1,!0),this._startAt.kill()),r={};for(s in n.startAt)r[s]=n.startAt[s];if(r.overwrite=!1,r.immediateRender=!0,r.lazy=h&&n.lazy!==!1,r.startAt=r.delay=null,this._startAt=O.to(this.target,0,r),h)if(this._time>0)this._startAt=null;else if(0!==o)return}else if(n.runBackwards&&0!==o)if(this._startAt)this._startAt.render(-1,!0),this._startAt.kill(),this._startAt=null;else{i={};for(s in n)X[s]&&"autoCSS"!==s||(i[s]=n[s]);if(i.overwrite=0,i.data="isFromStart",i.lazy=h&&n.lazy!==!1,i.immediateRender=h,this._startAt=O.to(this.target,0,i),h){if(0===this._time)return}else this._startAt._init(),this._startAt._enabled(!1)}if(this._ease=l?l instanceof y?n.easeParams instanceof Array?l.config.apply(l,n.easeParams):l:"function"==typeof l?new y(l,n.easeParams):T[l]||O.defaultEase:O.defaultEase,this._easeType=this._ease._type,this._easePower=this._ease._power,this._firstPT=null,this._targets)for(t=this._targets.length;--t>-1;)this._initProps(this._targets[t],this._propLookup[t]={},this._siblings[t],a?a[t]:null)&&(e=!0);else e=this._initProps(this.target,this._propLookup,this._siblings,a);if(e&&O._onPluginEvent("_onInitAllProps",this),a&&(this._firstPT||"function"!=typeof this.target&&this._enabled(!1,!1)),n.runBackwards)for(i=this._firstPT;i;)i.s+=i.c,i.c=-i.c,i=i._next;this._onUpdate=n.onUpdate,this._initted=!0},r._initProps=function(e,i,s,r){var n,a,o,h,l,_;if(null==e)return!1;I[e._gsTweenID]&&B(),this.vars.css||e.style&&e!==t&&e.nodeType&&L.css&&this.vars.autoCSS!==!1&&M(this.vars,e);for(n in this.vars){if(_=this.vars[n],X[n])_&&(_ instanceof Array||_.push&&p(_))&&-1!==_.join("").indexOf("{self}")&&(this.vars[n]=_=this._swapSelfInParams(_,this));else if(L[n]&&(h=new L[n])._onInitTween(e,this.vars[n],this)){for(this._firstPT=l={_next:this._firstPT,t:h,p:"setRatio",s:0,c:1,f:!0,n:n,pg:!0,pr:h._priority},a=h._overwriteProps.length;--a>-1;)i[h._overwriteProps[a]]=this._firstPT;(h._priority||h._onInitAllProps)&&(o=!0),(h._onDisable||h._onEnable)&&(this._notifyPluginsOfEnabled=!0)}else this._firstPT=i[n]=l={_next:this._firstPT,t:e,p:n,f:"function"==typeof e[n],n:n,pg:!1,pr:0},l.s=l.f?e[n.indexOf("set")||"function"!=typeof e["get"+n.substr(3)]?n:"get"+n.substr(3)]():parseFloat(e[n]),l.c="string"==typeof _&&"="===_.charAt(1)?parseInt(_.charAt(0)+"1",10)*Number(_.substr(2)):Number(_)-l.s||0;l&&l._next&&(l._next._prev=l)}return r&&this._kill(r,e)?this._initProps(e,i,s,r):this._overwrite>1&&this._firstPT&&s.length>1&&V(e,this,i,this._overwrite,s)?(this._kill(i,e),this._initProps(e,i,s,r)):(this._firstPT&&(this.vars.lazy!==!1&&this._duration||this.vars.lazy&&!this._duration)&&(I[e._gsTweenID]=!0),o)},r.render=function(t,e,i){var s,r,n,a,o=this._time,h=this._duration,_=this._rawPrevTime;if(t>=h)this._totalTime=this._time=h,this.ratio=this._ease._calcEnd?this._ease.getRatio(1):1,this._reversed||(s=!0,r="onComplete"),0===h&&(this._initted||!this.vars.lazy||i)&&(this._startTime===this._timeline._duration&&(t=0),(0===t||0>_||_===l)&&_!==t&&(i=!0,_>l&&(r="onReverseComplete")),this._rawPrevTime=a=!e||t||_===t?t:l);else if(1e-7>t)this._totalTime=this._time=0,this.ratio=this._ease._calcEnd?this._ease.getRatio(0):0,(0!==o||0===h&&_>0&&_!==l)&&(r="onReverseComplete",s=this._reversed),0>t?(this._active=!1,0===h&&(this._initted||!this.vars.lazy||i)&&(_>=0&&(i=!0),this._rawPrevTime=a=!e||t||_===t?t:l)):this._initted||(i=!0);else if(this._totalTime=this._time=t,this._easeType){var u=t/h,p=this._easeType,f=this._easePower;(1===p||3===p&&u>=.5)&&(u=1-u),3===p&&(u*=2),1===f?u*=u:2===f?u*=u*u:3===f?u*=u*u*u:4===f&&(u*=u*u*u*u),this.ratio=1===p?1-u:2===p?u:.5>t/h?u/2:1-u/2}else this.ratio=this._ease.getRatio(t/h);if(this._time!==o||i){if(!this._initted){if(this._init(),!this._initted||this._gc)return;if(!i&&this._firstPT&&(this.vars.lazy!==!1&&this._duration||this.vars.lazy&&!this._duration))return this._time=this._totalTime=o,this._rawPrevTime=_,z.push(this),this._lazy=t,void 0;this._time&&!s?this.ratio=this._ease.getRatio(this._time/h):s&&this._ease._calcEnd&&(this.ratio=this._ease.getRatio(0===this._time?0:1))}for(this._lazy!==!1&&(this._lazy=!1),this._active||!this._paused&&this._time!==o&&t>=0&&(this._active=!0),0===o&&(this._startAt&&(t>=0?this._startAt.render(t,e,i):r||(r="_dummyGS")),this.vars.onStart&&(0!==this._time||0===h)&&(e||this.vars.onStart.apply(this.vars.onStartScope||this,this.vars.onStartParams||v))),n=this._firstPT;n;)n.f?n.t[n.p](n.c*this.ratio+n.s):n.t[n.p]=n.c*this.ratio+n.s,n=n._next;this._onUpdate&&(0>t&&this._startAt&&this._startTime&&this._startAt.render(t,e,i),e||(this._time!==o||s)&&this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||v)),r&&(this._gc||(0>t&&this._startAt&&!this._onUpdate&&this._startTime&&this._startAt.render(t,e,i),s&&(this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[r]&&this.vars[r].apply(this.vars[r+"Scope"]||this,this.vars[r+"Params"]||v),0===h&&this._rawPrevTime===l&&a!==l&&(this._rawPrevTime=0)))}},r._kill=function(t,e){if("all"===t&&(t=null),null==t&&(null==e||e===this.target))return this._lazy=!1,this._enabled(!1,!1);e="string"!=typeof e?e||this._targets||this.target:O.selector(e)||e;var i,s,r,n,a,o,h,l;if((p(e)||D(e))&&"number"!=typeof e[0])for(i=e.length;--i>-1;)this._kill(t,e[i])&&(o=!0);else{if(this._targets){for(i=this._targets.length;--i>-1;)if(e===this._targets[i]){a=this._propLookup[i]||{},this._overwrittenProps=this._overwrittenProps||[],s=this._overwrittenProps[i]=t?this._overwrittenProps[i]||{}:"all";break}}else{if(e!==this.target)return!1;a=this._propLookup,s=this._overwrittenProps=t?this._overwrittenProps||{}:"all"}if(a){h=t||a,l=t!==s&&"all"!==s&&t!==a&&("object"!=typeof t||!t._tempKill);for(r in h)(n=a[r])&&(n.pg&&n.t._kill(h)&&(o=!0),n.pg&&0!==n.t._overwriteProps.length||(n._prev?n._prev._next=n._next:n===this._firstPT&&(this._firstPT=n._next),n._next&&(n._next._prev=n._prev),n._next=n._prev=null),delete a[r]),l&&(s[r]=1);!this._firstPT&&this._initted&&this._enabled(!1,!1)}}return o},r.invalidate=function(){return this._notifyPluginsOfEnabled&&O._onPluginEvent("_onDisable",this),this._firstPT=null,this._overwrittenProps=null,this._onUpdate=null,this._startAt=null,this._initted=this._active=this._notifyPluginsOfEnabled=this._lazy=!1,this._propLookup=this._targets?{}:[],this},r._enabled=function(t,e){if(a||n.wake(),t&&this._gc){var i,s=this._targets;if(s)for(i=s.length;--i>-1;)this._siblings[i]=q(s[i],this,!0);else this._siblings=q(this.target,this,!0)}return R.prototype._enabled.call(this,t,e),this._notifyPluginsOfEnabled&&this._firstPT?O._onPluginEvent(t?"_onEnable":"_onDisable",this):!1},O.to=function(t,e,i){return new O(t,e,i)},O.from=function(t,e,i){return i.runBackwards=!0,i.immediateRender=0!=i.immediateRender,new O(t,e,i)},O.fromTo=function(t,e,i,s){return s.startAt=i,s.immediateRender=0!=s.immediateRender&&0!=i.immediateRender,new O(t,e,s)},O.delayedCall=function(t,e,i,s,r){return new O(e,0,{delay:t,onComplete:e,onCompleteParams:i,onCompleteScope:s,onReverseComplete:e,onReverseCompleteParams:i,onReverseCompleteScope:s,immediateRender:!1,useFrames:r,overwrite:0})},O.set=function(t,e){return new O(t,0,e)},O.getTweensOf=function(t,e){if(null==t)return[];t="string"!=typeof t?t:O.selector(t)||t;var i,s,r,n;if((p(t)||D(t))&&"number"!=typeof t[0]){for(i=t.length,s=[];--i>-1;)s=s.concat(O.getTweensOf(t[i],e));for(i=s.length;--i>-1;)for(n=s[i],r=i;--r>-1;)n===s[r]&&s.splice(i,1)}else for(s=q(t).concat(),i=s.length;--i>-1;)(s[i]._gc||e&&!s[i].isActive())&&s.splice(i,1);return s},O.killTweensOf=O.killDelayedCallsTo=function(t,e,i){"object"==typeof e&&(i=e,e=!1);for(var s=O.getTweensOf(t,e),r=s.length;--r>-1;)s[r]._kill(i,t)};var G=d("plugins.TweenPlugin",function(t,e){this._overwriteProps=(t||"").split(","),this._propName=this._overwriteProps[0],this._priority=e||0,this._super=G.prototype},!0);if(r=G.prototype,G.version="1.10.1",G.API=2,r._firstPT=null,r._addTween=function(t,e,i,s,r,n){var a,o;return null!=s&&(a="number"==typeof s||"="!==s.charAt(1)?Number(s)-i:parseInt(s.charAt(0)+"1",10)*Number(s.substr(2)))?(this._firstPT=o={_next:this._firstPT,t:t,p:e,s:i,c:a,f:"function"==typeof t[e],n:r||e,r:n},o._next&&(o._next._prev=o),o):void 0},r.setRatio=function(t){for(var e,i=this._firstPT,s=1e-6;i;)e=i.c*t+i.s,i.r?e=Math.round(e):s>e&&e>-s&&(e=0),i.f?i.t[i.p](e):i.t[i.p]=e,i=i._next},r._kill=function(t){var e,i=this._overwriteProps,s=this._firstPT;if(null!=t[this._propName])this._overwriteProps=[];else for(e=i.length;--e>-1;)null!=t[i[e]]&&i.splice(e,1);for(;s;)null!=t[s.n]&&(s._next&&(s._next._prev=s._prev),s._prev?(s._prev._next=s._next,s._prev=null):this._firstPT===s&&(this._firstPT=s._next)),s=s._next;return!1},r._roundProps=function(t,e){for(var i=this._firstPT;i;)(t[this._propName]||null!=i.n&&t[i.n.split(this._propName+"_").join("")])&&(i.r=e),i=i._next},O._onPluginEvent=function(t,e){var i,s,r,n,a,o=e._firstPT;if("_onInitAllProps"===t){for(;o;){for(a=o._next,s=r;s&&s.pr>o.pr;)s=s._next;(o._prev=s?s._prev:n)?o._prev._next=o:r=o,(o._next=s)?s._prev=o:n=o,o=a}o=e._firstPT=r}for(;o;)o.pg&&"function"==typeof o.t[t]&&o.t[t]()&&(i=!0),o=o._next;return i},G.activate=function(t){for(var e=t.length;--e>-1;)t[e].API===G.API&&(L[(new t[e])._propName]=t[e]);return!0},m.plugin=function(t){if(!(t&&t.propName&&t.init&&t.API))throw"illegal plugin definition.";
var e,i=t.propName,s=t.priority||0,r=t.overwriteProps,n={init:"_onInitTween",set:"setRatio",kill:"_kill",round:"_roundProps",initAll:"_onInitAllProps"},a=d("plugins."+i.charAt(0).toUpperCase()+i.substr(1)+"Plugin",function(){G.call(this,i,s),this._overwriteProps=r||[]},t.global===!0),o=a.prototype=new G(i);o.constructor=a,a.API=t.API;for(e in n)"function"==typeof t[e]&&(o[n[e]]=t[e]);return a.version=t.version,G.activate([a]),a},i=t._gsQueue){for(s=0;i.length>s;s++)i[s]();for(r in f)f[r].func||t.console.log("GSAP encountered missing dependency: com.greensock."+r)}a=!1}}(window);


/*! SCROLL TO PLUGIN FOR GS
 * VERSION: beta 1.7.1
 * DATE: 2013-10-23
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2013, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
(window._gsQueue||(window._gsQueue=[])).push(function(){"use strict";var t=document.documentElement,e=window,i=function(i,s){var r="x"===s?"Width":"Height",n="scroll"+r,a="client"+r,o=document.body;return i===e||i===t||i===o?Math.max(t[n],o[n])-(e["inner"+r]||Math.max(t[a],o[a])):i[n]-i["offset"+r]},s=window._gsDefine.plugin({propName:"scrollTo",API:2,init:function(t,s,r){return this._wdw=t===e,this._target=t,this._tween=r,"object"!=typeof s&&(s={y:s}),this._autoKill=s.autoKill!==!1,this.x=this.xPrev=this.getX(),this.y=this.yPrev=this.getY(),null!=s.x?this._addTween(this,"x",this.x,"max"===s.x?i(t,"x"):s.x,"scrollTo_x",!0):this.skipX=!0,null!=s.y?this._addTween(this,"y",this.y,"max"===s.y?i(t,"y"):s.y,"scrollTo_y",!0):this.skipY=!0,!0},set:function(t){this._super.setRatio.call(this,t);var i=this._wdw||!this.skipX?this.getX():this.xPrev,s=this._wdw||!this.skipY?this.getY():this.yPrev,r=s-this.yPrev,n=i-this.xPrev;this._autoKill&&(!this.skipX&&(n>7||-7>n)&&(this.skipX=!0),!this.skipY&&(r>7||-7>r)&&(this.skipY=!0),this.skipX&&this.skipY&&this._tween.kill()),this._wdw?e.scrollTo(this.skipX?i:this.x,this.skipY?s:this.y):(this.skipY||(this._target.scrollTop=this.y),this.skipX||(this._target.scrollLeft=this.x)),this.xPrev=this.x,this.yPrev=this.y}}),r=s.prototype;s.max=i,r.getX=function(){return this._wdw?null!=e.pageXOffset?e.pageXOffset:null!=t.scrollLeft?t.scrollLeft:document.body.scrollLeft:this._target.scrollLeft},r.getY=function(){return this._wdw?null!=e.pageYOffset?e.pageYOffset:null!=t.scrollTop?t.scrollTop:document.body.scrollTop:this._target.scrollTop},r._kill=function(t){return t.scrollTo_x&&(this.skipX=!0),t.scrollTo_y&&(this.skipY=!0),this._super._kill.call(this,t)}}),window._gsDefine&&window._gsQueue.pop()();
;
(function ($) {

  window.choppedjs = {};

  function extend(){
    for(var i=1; i<arguments.length; i++)
    for(var key in arguments[i])
      if(arguments[i].hasOwnProperty(key))
        arguments[0][key] = arguments[i][key];
    return arguments[0];
  }
  
  choppedjs.onEvent = function (eventType, handler, timeout, config) {
    var defaults = {
      name: 'unnamed',
      mute: false,
      immediate: true
    };
    this.options = extend({}, defaults, config);
    this.eventType = eventType;
    this.timeout = timeout;
    this.handler = handler;
    this.isExecuteTime = this.options.immediate;
    this.interval = '';
    var _this = this;
    init();

    function init() {
      //reset the execute determiner
      $(window)[_this.eventType](function () {
        _this.isExecuteTime = true;
      });

      //execute the handler based on the timeout user passed
      _this.interval = setInterval(function () {
        if (_this.isExecuteTime && !_this.options.mute) {
          try {
            handler();
          } catch (err) {
            console.log(err);
          }
          //turn off the exec time until user scroll again
          _this.isExecuteTime = false;
        }
      }, _this.timeout);
    }

  };

  choppedjs.onScroll = function (handler, timeout, options) {
    return new choppedjs.onEvent('scroll', handler, timeout, options);
  };

  choppedjs.onResize = function (handler, timeout, options) {
    return new choppedjs.onEvent('resize', handler, timeout, options);
  };

  choppedjs.onMousemove = function (handler, timeout, options) {
    return new choppedjs.onEvent('mousemove', handler, timeout, options);
  };
  
}(jQuery));
;window.ChopScroll = function (handler, timeout, name) {
  this.timeout = timeout;
  this.handler = handler;
  this.name = name || 'unnamed';
  this.isExecuteTime = true;
  this.interval = '';
  var _this = this;
  init();

  function init() {
    //reset the execute determiner
    jQuery(window).scroll(function () {
      _this.isExecuteTime = true;
    });

    //execute the handler based on the timeout user passed
    _this.interval = setInterval(function () {
      if (_this.isExecuteTime) {
        try {
          handler();
        } catch (err) {
          console.log(err);
        }
        //turn off the exec time until user scroll again
        _this.isExecuteTime = false;
      }
    }, _this.timeout);
  }

}

;
/**
 * fullPage 2.1.2
 * https://github.com/alvarotrigo/fullPage.js
 * MIT licensed
 *
 * Copyright (C) 2013 alvarotrigo.com - A project by Alvaro Trigo
 */
/**
 * fullPage 2.1.4
 * https://github.com/alvarotrigo/fullPage.js
 * MIT licensed
 *
 * Copyright (C) 2013 alvarotrigo.com - A project by Alvaro Trigo
 */

(function($) {
    $.fn.fullpage = function(options) {
        // Create some defaults, extending them with any options that were provided
        options = $.extend({
            "verticalCentered": true,
            'resize': true,
            'sectionsColor' : [],
            'anchors':[],
            'scrollingSpeed': 700,
            'easing': 'easeInQuart',
            'menu': false,
            'navigation': false,
            'navigationPosition': 'right',
            'navigationColor': '#000',
            'navigationTooltips': [],
            'slidesNavigation': false,
            'slidesNavPosition': 'bottom',
            'controlArrowColor': '#fff',
            'loopBottom': false,
            'loopTop': false,
            'loopHorizontal': true,
            'autoScrolling': true,
            'scrollOverflow': false,
            'css3': false,
            'paddingTop': 0,
            'paddingBottom': 0,
            'fixedElements': null,
            'normalScrollElements': null,
            'keyboardScrolling': true,
            'touchSensitivity': 5,
            'continuousVertical': false,
            'animateAnchor': true,
            'normalScrollElementTouchThreshold': 5,

            //events
            'afterLoad': null,
            'onLeave': null,
            'afterRender': null,
            'afterResize': null,
            'afterSlideLoad': null,
            'onSlideLeave': null
        }, options);

        // Disable mutually exclusive settings
        if (options.continuousVertical &&
            (options.loopTop || options.loopBottom)) {
            options.continuousVertical = false;
            console && console.log && console.log("Option loopTop/loopBottom is mutually exclusive with continuousVertical; continuousVertical disabled");
        }

        //Defines the delay to take place before being able to scroll to the next section
        //BE CAREFUL! Not recommened to change it under 400 for a good behavior in laptops and
        //Apple devices (laptops, mouses...)
        var scrollDelay = 600;

        $.fn.fullpage.setAutoScrolling = function(value){
            options.autoScrolling = value;

            var element = $('.section.active');

            if(options.autoScrolling){
                $('html, body').css({
                    'overflow' : 'hidden',
                    'height' : '100%'
                });

                if(element.length){
                    //moving the container up
                    silentScroll(element.position().top);
                }

            }else{
                $('html, body').css({
                    'overflow' : 'auto',
                    'height' : 'auto'
                });

                silentScroll(0);

                //scrolling the page to the section with no animation
                $('html, body').scrollTop(element.position().top);
            }

        };

        /**
        * Defines the scrolling speed
        */
        $.fn.fullpage.setScrollingSpeed = function(value){
           options.scrollingSpeed = value;
        };

        /**
        * Adds or remove the possiblity of scrolling through sections by using the mouse wheel or the trackpad.
        */
        $.fn.fullpage.setMouseWheelScrolling = function (value){
            if(value){
                addMouseWheelHandler();
            }else{
                removeMouseWheelHandler();
            }
        };

        /**
        * Adds or remove the possiblity of scrolling through sections by using the mouse wheel/trackpad or touch gestures.
        */
        $.fn.fullpage.setAllowScrolling = function (value){
            if(value){
                $.fn.fullpage.setMouseWheelScrolling(true);
                addTouchHandler();
            }else{
                $.fn.fullpage.setMouseWheelScrolling(false);
                removeTouchHandler();
            }
        };

        /**
        * Adds or remove the possiblity of scrolling through sections by using the keyboard arrow keys
        */
        $.fn.fullpage.setKeyboardScrolling = function (value){
            options.keyboardScrolling = value;
        };

        //flag to avoid very fast sliding for landscape sliders
        var slideMoving = false;

        var isTouchDevice = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|Windows Phone|Tizen|Bada)/);
        var container = $(this);
        var windowsHeight = $(window).height();
        var isMoving = false;
        var isResizing = false;
        var lastScrolledDestiny;
        var lastScrolledSlide;
        var wrapperSelector = 'fullpage-wrapper';

        $.fn.fullpage.setAllowScrolling(true);

        //if css3 is not supported, it will use jQuery animations
        if(options.css3){
            options.css3 = support3d();
        }

        if($(this).length){
            container.css({
                'height': '100%',
                'position': 'relative',
                '-ms-touch-action': 'none'
            });

            //adding a class to recognize the container internally in the code
            container.addClass(wrapperSelector);
        }

        //trying to use fullpage without a selector?
        else{
            console.error("Error! Fullpage.js needs to be initialized with a selector. For example: $('#myContainer').fullpage();");
        }

        //creating the navigation dots
        if (options.navigation) {
            $('#mk-theme-container').append('<div id="fullPage-nav"><ul></ul></div>');
            var nav = $('#fullPage-nav');

            nav.css('color', options.navigationColor);
            nav.addClass(options.navigationPosition);
        }

        $('.section').each(function(index){
            var that = $(this);
            var slides = $(this).find('.slide');
            var numSlides = slides.length;

            //if no active section is defined, the 1st one will be the default one
            if(!index && $('.section.active').length === 0) {
                $(this).addClass('active');
            }

            $(this).css('height', windowsHeight + 'px');

            if(options.paddingTop || options.paddingBottom){
                $(this).css('padding', options.paddingTop  + ' 0 ' + options.paddingBottom + ' 0');
            }

            if (typeof options.sectionsColor[index] !==  'undefined') {
                $(this).css('background-color', options.sectionsColor[index]);
            }

            if (typeof options.anchors[index] !== 'undefined') {
                $(this).attr('data-anchor', options.anchors[index]);
            }

            if (options.navigation) {
                var link = '';
                if(options.anchors.length){
                    link = options.anchors[index];
                }
                var tooltip = options.navigationTooltips[index];
                if(typeof tooltip === 'undefined'){
                    tooltip = '';
                }

                nav.find('ul').append('<li data-tooltip="' + tooltip + '"><a href="#' + link + '"><span></span></a></li>');
            }


            // if there's any slide
            if (numSlides > 1) {
                var sliderWidth = numSlides * 100;
                var slideWidth = 100 / numSlides;

                slides.wrapAll('<div class="slidesContainer" />');
                slides.parent().wrap('<div class="slides" />');

                $(this).find('.slidesContainer').css('width', sliderWidth + '%');
                $(this).find('.slides').after('<div class="controlArrow prev"></div><div class="controlArrow next"></div>');

                if(options.controlArrowColor!='#fff'){
                    $(this).find('.controlArrow.next').css('border-color', 'transparent transparent transparent '+options.controlArrowColor);
                    $(this).find('.controlArrow.prev').css('border-color', 'transparent '+ options.controlArrowColor + ' transparent transparent');
                }

                if(!options.loopHorizontal){
                    $(this).find('.controlArrow.prev').hide();
                }


                if(options.slidesNavigation){
                    addSlidesNavigation($(this), numSlides);
                }

                slides.each(function(index) {
                    //if the slide won#t be an starting point, the default will be the first one
                    if(!index && that.find('.slide.active').length == 0){
                        $(this).addClass('active');
                    }

                    $(this).css('width', slideWidth + '%');

                    if(options.verticalCentered){
                        addTableClass($(this));
                    }
                });
            }else{
                if(options.verticalCentered){
                    addTableClass($(this));
                }
            }




        }).promise().done(function(){
            $.fn.fullpage.setAutoScrolling(options.autoScrolling);

            //the starting point is a slide?
            var activeSlide = $('.section.active').find('.slide.active');
            if( activeSlide.length &&  ($('.section.active').index('.section') != 0 || ($('.section.active').index('.section') == 0 && activeSlide.index() != 0))){
                var prevScrollingSpeepd = options.scrollingSpeed;
                $.fn.fullpage.setScrollingSpeed (0);
                landscapeScroll($('.section.active').find('.slides'), activeSlide);
                $.fn.fullpage.setScrollingSpeed(prevScrollingSpeepd);
            }

            //fixed elements need to be moved out of the plugin container due to problems with CSS3.
            if(options.fixedElements && options.css3){
                $(options.fixedElements).appendTo('body');
            }

            //vertical centered of the navigation + first bullet active
            if(options.navigation){
                nav.css('margin-top', '-' + (nav.height()/2) + 'px');
                nav.find('li').eq($('.section.active').index('.section')).find('a').addClass('active');
            }

            //moving the menu outside the main container if it is inside (avoid problems with fixed positions when using CSS3 tranforms)
            if(options.menu && options.css3 && $(options.menu).closest('.fullpage-wrapper').length){
                $(options.menu).appendTo('body');
            }

            if(options.scrollOverflow){
                if(container.hasClass('fullpage-used')){
                    createSlimScrollingHandler();
                }
                //after DOM and images are loaded
                $(window).on('load', createSlimScrollingHandler);
            }else{
                $.isFunction( options.afterRender ) && options.afterRender.call( this);
            }


            //getting the anchor link in the URL and deleting the `#`
            var value =  window.location.hash.replace('#', '').split('/');
            var destiny = value[0];

            if(destiny.length){
                var section = $('[data-anchor="'+destiny+'"]');

                if(!options.animateAnchor && section.length){
                    silentScroll(section.position().top);
                    $.isFunction( options.afterLoad ) && options.afterLoad.call( this, destiny, (section.index('.section') + 1));

                    //updating the active class
                    section.addClass('active').siblings().removeClass('active');
                }
            }


            $(window).on('load', function() {
                scrollToAnchor();
            });

        });

        function createSlimScrollingHandler(){
            $('.section').each(function(){
                var slides = $(this).find('.slide');

                if(slides.length){
                    slides.each(function(){
                        createSlimScrolling($(this));
                    });
                }else{
                    createSlimScrolling($(this));
                }

            });
            $.isFunction( options.afterRender ) && options.afterRender.call( this);
        }


        var scrollId;
        var isScrolling = false;

        //when scrolling...
        $(window).on('scroll', scrollHandler);

        function scrollHandler(){
            if(!options.autoScrolling){
                var currentScroll = $(window).scrollTop();

                var scrolledSections = $('.section').map(function(){
                    if ($(this).offset().top < (currentScroll + 100)){
                        return $(this);
                    }
                });

                //geting the last one, the current one on the screen
                var currentSection = scrolledSections[scrolledSections.length-1];

                //executing only once the first time we reach the section
                if(!currentSection.hasClass('active')){
                    var leavingSection = $('.section.active').index('.section') + 1;

                    isScrolling = true;

                    var yMovement = getYmovement(currentSection);

                    currentSection.addClass('active').siblings().removeClass('active');

                    var anchorLink  = currentSection.data('anchor');
                    $.isFunction( options.onLeave ) && options.onLeave.call( this, leavingSection, (currentSection.index('.section') + 1), yMovement);

                    $.isFunction( options.afterLoad ) && options.afterLoad.call( this, anchorLink, (currentSection.index('.section') + 1));

                    activateMenuElement(anchorLink);
                    activateNavDots(anchorLink, 0);


                    if(options.anchors.length && !isMoving){
                        //needed to enter in hashChange event when using the menu with anchor links
                        lastScrolledDestiny = anchorLink;

                        location.hash = anchorLink;
                    }

                    //small timeout in order to avoid entering in hashChange event when scrolling is not finished yet
                    clearTimeout(scrollId);
                    scrollId = setTimeout(function(){
                        isScrolling = false;
                    }, 100);
                }

            }
        }


        var touchStartY = 0;
        var touchStartX = 0;
        var touchEndY = 0;
        var touchEndX = 0;

        /* Detecting touch events

        * As we are changing the top property of the page on scrolling, we can not use the traditional way to detect it.
        * This way, the touchstart and the touch moves shows an small difference between them which is the
        * used one to determine the direction.
        */
        function touchMoveHandler(event){
            var e = event.originalEvent;

            if(options.autoScrolling){
                //preventing the easing on iOS devices
                event.preventDefault();
            }

            // additional: if one of the normalScrollElements isn't within options.normalScrollElementTouchThreshold hops up the DOM chain
            if (!checkParentForNormalScrollElement(event.target)) {

                var touchMoved = false;
                var activeSection = $('.section.active');
                var scrollable;

                if (!isMoving && !slideMoving) { //if theres any #
                    var touchEvents = getEventsPage(e);
                    touchEndY = touchEvents['y'];
                    touchEndX = touchEvents['x'];

                    //if movement in the X axys is greater than in the Y and the currect section has slides...
                    if (activeSection.find('.slides').length && Math.abs(touchStartX - touchEndX) > (Math.abs(touchStartY - touchEndY))) {

                        //is the movement greater than the minimum resistance to scroll?
                        if (Math.abs(touchStartX - touchEndX) > ($(window).width() / 100 * options.touchSensitivity)) {
                            if (touchStartX > touchEndX) {
                                $.fn.fullpage.moveSlideRight(); //next
                            } else {
                                $.fn.fullpage.moveSlideLeft(); //prev
                            }
                        }
                    }

                    //vertical scrolling (only when autoScrolling is enabled)
                    else if(options.autoScrolling){

                        //if there are landscape slides, we check if the scrolling bar is in the current one or not
                        if(activeSection.find('.slides').length){
                            scrollable= activeSection.find('.slide.active').find('.scrollable');
                        }else{
                            scrollable = activeSection.find('.scrollable');
                        }

                        //is the movement greater than the minimum resistance to scroll?
                        if (Math.abs(touchStartY - touchEndY) > ($(window).height() / 100 * options.touchSensitivity)) {
                            if (touchStartY > touchEndY) {
                                if(scrollable.length > 0 ){
                                    //is the scrollbar at the end of the scroll?
                                    if(isScrolled('bottom', scrollable)){
                                        $.fn.fullpage.moveSectionDown();
                                    }else{
                                        return true;
                                    }
                                }else{
                                    // moved down
                                    $.fn.fullpage.moveSectionDown();
                                }
                            } else if (touchEndY > touchStartY) {

                                if(scrollable.length > 0){
                                    //is the scrollbar at the start of the scroll?
                                    if(isScrolled('top', scrollable)){
                                        $.fn.fullpage.moveSectionUp();
                                    }
                                    else{
                                        return true;
                                    }
                                }else{
                                    // moved up
                                    $.fn.fullpage.moveSectionUp();
                                }
                            }
                        }
                    }
                }
            }

        }

        /**
         * recursive function to loop up the parent nodes to check if one of them exists in options.normalScrollElements
         * Currently works well for iOS - Android might need some testing
         * @param  {Element} el  target element / jquery selector (in subsequent nodes)
         * @param  {int}     hop current hop compared to options.normalScrollElementTouchThreshold
         * @return {boolean} true if there is a match to options.normalScrollElements
         */
        function checkParentForNormalScrollElement (el, hop) {
            hop = hop || 0;
            var parent = $(el).parent();

            if (hop < options.normalScrollElementTouchThreshold &&
                parent.is(options.normalScrollElements) ) {
                return true;
            } else if (hop == options.normalScrollElementTouchThreshold) {
                return false;
            } else {
                return checkParentForNormalScrollElement(parent, ++hop);
            }
        }

        function touchStartHandler(event){
            var e = event.originalEvent;
            var touchEvents = getEventsPage(e);
            touchStartY = touchEvents['y'];
            touchStartX = touchEvents['x'];
        }


        /**
         * Detecting mousewheel scrolling
         *
         * http://blogs.sitepointstatic.com/examples/tech/mouse-wheel/index.html
         * http://www.sitepoint.com/html5-javascript-mouse-wheel/
         */
        function MouseWheelHandler(e) {
            if(options.autoScrolling){
                // cross-browser wheel delta
                e = window.event || e;
                var delta = Math.max(-1, Math.min(1,
                        (e.wheelDelta || -e.deltaY || -e.detail)));
                var scrollable;
                var activeSection = $('.section.active');

                if (!isMoving) { //if theres any #

                    //if there are landscape slides, we check if the scrolling bar is in the current one or not
                    if(activeSection.find('.slides').length){
                        scrollable= activeSection.find('.slide.active').find('.scrollable');
                    }else{
                        scrollable = activeSection.find('.scrollable');
                    }

                    //scrolling down?
                    if (delta < 0) {
                        if(scrollable.length > 0 ){
                            //is the scrollbar at the end of the scroll?
                            if(isScrolled('bottom', scrollable)){
                                $.fn.fullpage.moveSectionDown();
                            }else{
                                return true; //normal scroll
                            }
                        }else{
                            $.fn.fullpage.moveSectionDown();
                        }
                    }

                    //scrolling up?
                    else {
                        if(scrollable.length > 0){
                            //is the scrollbar at the start of the scroll?
                            if(isScrolled('top', scrollable)){
                                $.fn.fullpage.moveSectionUp();
                            }else{
                                return true; //normal scroll
                            }
                        }else{
                            $.fn.fullpage.moveSectionUp();
                        }
                    }
                }

                return false;
            }
        }


        $.fn.fullpage.moveSectionUp = function(){
            var prev = $('.section.active').prev('.section');

            //looping to the bottom if there's no more sections above
            if (!prev.length && (options.loopTop || options.continuousVertical)) {
                prev = $('.section').last();
            }

            if (prev.length) {
                scrollPage(prev, null, true);
            }
        };

        $.fn.fullpage.moveSectionDown = function (){
            var next = $('.section.active').next('.section');

            //looping to the top if there's no more sections below
            if(!next.length &&
                (options.loopBottom || options.continuousVertical)){
                next = $('.section').first();
            }

            if(next.length > 0 ||
                (!next.length &&
                (options.loopBottom || options.continuousVertical))){
                scrollPage(next, null, false);
            }
        };

        $.fn.fullpage.moveTo = function (section, slide){
            var destiny = '';

            if(isNaN(section)){
                destiny = $('[data-anchor="'+section+'"]');
            }else{
                destiny = $('.section').eq( (section -1) );
            }

            if (typeof slide !== 'undefined'){
                scrollPageAndSlide(section, slide);
            }else if(destiny.length > 0){
                scrollPage(destiny);
            }
        };

        $.fn.fullpage.moveSlideRight = function(){
            moveSlide('next');
        };

        $.fn.fullpage.moveSlideLeft = function(){
            moveSlide('prev');
        };

        function moveSlide(direction){
            var activeSection = $('.section.active');
            var slides = activeSection.find('.slides');

            // more than one slide needed and nothing should be sliding
            if (!slides.length || slideMoving) {
                return;
            }

            var currentSlide = slides.find('.slide.active');
            var destiny = null;

            if(direction === 'prev'){
                destiny = currentSlide.prev('.slide');
            }else{
                destiny = currentSlide.next('.slide');
            }

            //isn't there a next slide in the secuence?
            if(!destiny.length){
                //respect loopHorizontal settin
                if (!options.loopHorizontal) return;

                if(direction === 'prev'){
                    destiny = currentSlide.siblings(':last');
                }else{
                    destiny = currentSlide.siblings(':first');
                }
            }

            slideMoving = true;

            landscapeScroll(slides, destiny);
        }

        function scrollPage(element, callback, isMovementUp){
            var scrollOptions = {}, scrolledElement;
            var dest = element.position();
            if(typeof dest === "undefined"){ return; } //there's no element to scroll, leaving the function
            var dtop = dest.top;
            var yMovement = getYmovement(element);
            var anchorLink  = element.data('anchor');
            var sectionIndex = element.index('.section');
            var activeSlide = element.find('.slide.active');
            var activeSection = $('.section.active');
            var leavingSection = activeSection.index('.section') + 1;

            //caching the value of isResizing at the momment the function is called
            //because it will be checked later inside a setTimeout and the value might change
            var localIsResizing = isResizing;

            if(activeSlide.length){
                var slideAnchorLink = activeSlide.data('anchor');
                var slideIndex = activeSlide.index();
            }

            // If continuousVertical && we need to wrap around
            if (options.autoScrolling && options.continuousVertical && typeof (isMovementUp) !== "undefined" &&
                ((!isMovementUp && yMovement == 'up') || // Intending to scroll down but about to go up or
                (isMovementUp && yMovement == 'down'))) { // intending to scroll up but about to go down

                // Scrolling down
                if (!isMovementUp) {
                    // Move all previous sections to after the active section
                    $(".section.active").after(activeSection.prevAll(".section").get().reverse());
                }
                else { // Scrolling up
                    // Move all next sections to before the active section
                    $(".section.active").before(activeSection.nextAll(".section"));
                }

                // Maintain the displayed position (now that we changed the element order)
                silentScroll($('.section.active').position().top);

                // save for later the elements that still need to be reordered
                var wrapAroundElements = activeSection;

                // Recalculate animation variables
                dest = element.position();
                dtop = dest.top;
                yMovement = getYmovement(element);
            }


            element.addClass('active').siblings().removeClass('active');

            //preventing from activating the MouseWheelHandler event
            //more than once if the page is scrolling
            isMoving = true;

            if(typeof anchorLink !== 'undefined'){
                setURLHash(slideIndex, slideAnchorLink, anchorLink);
            }

            if(options.autoScrolling){
                scrollOptions['top'] = -dtop;
                scrolledElement = '.'+wrapperSelector;
            }else{
                scrollOptions['scrollTop'] = dtop;
                scrolledElement = 'html, body';
            }

            // Fix section order after continuousVertical changes have been animated
            var continuousVerticalFixSectionOrder = function () {
                // If continuousVertical is in effect (and autoScrolling would also be in effect then),
                // finish moving the elements around so the direct navigation will function more simply
                if (!wrapAroundElements || !wrapAroundElements.length) {
                    return;
                }

                if (isMovementUp) {
                    $('.section:first').before(wrapAroundElements);
                }
                else {
                    $('.section:last').after(wrapAroundElements);
                }

                silentScroll($('.section.active').position().top);
            };


            // Use CSS3 translate functionality or...
            if (options.css3 && options.autoScrolling) {

                //callback (onLeave) if the site is not just resizing and readjusting the slides
                $.isFunction(options.onLeave) && !localIsResizing && options.onLeave.call(this, leavingSection, (sectionIndex + 1), yMovement);


                var translate3d = 'translate3d(0px, -' + dtop + 'px, 0px)';
                transformContainer(translate3d, true);

                setTimeout(function () {
                    //fix section order from continuousVertical
                    continuousVerticalFixSectionOrder();

                    //callback (afterLoad)  if the site is not just resizing and readjusting the slides
                    $.isFunction(options.afterLoad) && !localIsResizing && options.afterLoad.call(this, anchorLink, (sectionIndex + 1));

                    setTimeout(function () {
                        isMoving = false;
                        $.isFunction(callback) && callback.call(this);
                    }, scrollDelay);
                }, options.scrollingSpeed);
            } else { // ... use jQuery animate

                //callback (onLeave) if the site is not just resizing and readjusting the slides
                $.isFunction(options.onLeave) && !localIsResizing && options.onLeave.call(this, leavingSection, (sectionIndex + 1), yMovement);

                $(scrolledElement).animate(
                    scrollOptions
                , options.scrollingSpeed, options.easing, function () {
                    //fix section order from continuousVertical
                    continuousVerticalFixSectionOrder();

                    //callback (afterLoad) if the site is not just resizing and readjusting the slides
                    $.isFunction(options.afterLoad) && !localIsResizing && options.afterLoad.call(this, anchorLink, (sectionIndex + 1));

                    setTimeout(function () {
                        isMoving = false;
                        $.isFunction(callback) && callback.call(this);
                    }, scrollDelay);
                });
            }

            //flag to avoid callingn `scrollPage()` twice in case of using anchor links
            lastScrolledDestiny = anchorLink;

            //avoid firing it twice (as it does also on scroll)
            if(options.autoScrolling){
                activateMenuElement(anchorLink);
                activateNavDots(anchorLink, sectionIndex);
            }
        }

        function scrollToAnchor(){
            //getting the anchor link in the URL and deleting the `#`
            var value =  window.location.hash.replace('#', '').split('/');
            var section = value[0];
            var slide = value[1];

            if(section){  //if theres any #
                scrollPageAndSlide(section, slide);
            }
        }

        //detecting any change on the URL to scroll to the given anchor link
        //(a way to detect back history button as we play with the hashes on the URL)
        $(window).on('hashchange', hashChangeHandler);

        function hashChangeHandler(){
            if(!isScrolling){
                var value =  window.location.hash.replace('#', '').split('/');
                var section = value[0];
                var slide = value[1];

                //when moving to a slide in the first section for the first time (first time to add an anchor to the URL)
                var isFirstSlideMove =  (typeof lastScrolledDestiny === 'undefined');
                var isFirstScrollMove = (typeof lastScrolledDestiny === 'undefined' && typeof slide === 'undefined' && !slideMoving);

                /*in order to call scrollpage() only once for each destination at a time
                It is called twice for each scroll otherwise, as in case of using anchorlinks `hashChange`
                event is fired on every scroll too.*/
                if ((section && section !== lastScrolledDestiny) && !isFirstSlideMove || isFirstScrollMove || (!slideMoving && lastScrolledSlide != slide ))  {
                    scrollPageAndSlide(section, slide);
                }
            }
        }


        /**
         * Sliding with arrow keys, both, vertical and horizontal
         */
        $(document).keydown(function(e) {
            //Moving the main page with the keyboard arrows if keyboard scrolling is enabled
            if (options.keyboardScrolling && !isMoving) {
                switch (e.which) {
                    //up
                    case 38:
                    case 33:
                        $.fn.fullpage.moveSectionUp();
                        break;

                    //down
                    case 40:
                    case 34:
                        $.fn.fullpage.moveSectionDown();
                        break;

                    //Home
                    case 36:
                        $.fn.fullpage.moveTo(1);
                        break;

                    //End
                    case 35:
                        $.fn.fullpage.moveTo( $('.section').length );
                        break;

                    //left
                    case 37:
                        $.fn.fullpage.moveSlideLeft();
                        break;

                    //right
                    case 39:
                        $.fn.fullpage.moveSlideRight();
                        break;

                    default:
                        return; // exit this handler for other keys
                }
            }
        });

        //navigation action
        $(document).on('click', '#fullPage-nav a', function(e){
            e.preventDefault();
            var index = $(this).parent().index();
            scrollPage($('.section').eq(index));
        });

        //navigation tooltips
        $(document).on({
            mouseenter: function(){
                var tooltip = $(this).data('tooltip');
                $('<div class="fullPage-tooltip ' + options.navigationPosition +'">' + tooltip + '</div>').hide().appendTo($(this)).fadeIn(200);
            },
            mouseleave: function(){
                $(this).find('.fullPage-tooltip').fadeOut().remove();
            }
        }, '#fullPage-nav li');


        if(options.normalScrollElements){
            $(document).on('mouseover', options.normalScrollElements, function () {
                $.fn.fullpage.setMouseWheelScrolling(false);
            });

            $(document).on('mouseout', options.normalScrollElements, function(){
                $.fn.fullpage.setMouseWheelScrolling(true);
            });
        }

        /**
         * Scrolling horizontally when clicking on the slider controls.
         */
        $('.section').on('click', '.controlArrow', function() {
            if ($(this).hasClass('prev')) {
                $.fn.fullpage.moveSlideLeft();
            } else {
                $.fn.fullpage.moveSlideRight();
            }
        });


        /**
         * Scrolling horizontally when clicking on the slider controls.
         */
        $('.section').on('click', '.toSlide', function(e) {
            e.preventDefault();

            var slides = $(this).closest('.section').find('.slides');
            var currentSlide = slides.find('.slide.active');
            var destiny = null;

            destiny = slides.find('.slide').eq( ($(this).data('index') -1) );

            if(destiny.length > 0){
                landscapeScroll(slides, destiny);
            }
        });

        /**
        * Scrolls horizontal sliders.
        */
        function landscapeScroll(slides, destiny){
            var destinyPos = destiny.position();
            var slidesContainer = slides.find('.slidesContainer').parent();
            var slideIndex = destiny.index();
            var section = slides.closest('.section');
            var sectionIndex = section.index('.section');
            var anchorLink = section.data('anchor');
            var slidesNav = section.find('.fullPage-slidesNav');
            var slideAnchor = destiny.data('anchor');

            //caching the value of isResizing at the momment the function is called
            //because it will be checked later inside a setTimeout and the value might change
            var localIsResizing = isResizing;

            if(options.onSlideLeave){
                var prevSlideIndex = section.find('.slide.active').index();
                var xMovement = getXmovement(prevSlideIndex, slideIndex);

                //if the site is not just resizing and readjusting the slides
                if(!localIsResizing){
                    $.isFunction( options.onSlideLeave ) && options.onSlideLeave.call( this, anchorLink, (sectionIndex + 1), prevSlideIndex, xMovement);
                }
            }

            destiny.addClass('active').siblings().removeClass('active');


            if(typeof slideAnchor === 'undefined'){
                slideAnchor = slideIndex;
            }

            //only changing the URL if the slides are in the current section (not for resize re-adjusting)
            if(section.hasClass('active')){

                if(!options.loopHorizontal){
                    //hidding it for the fist slide, showing for the rest
                    section.find('.controlArrow.prev').toggle(slideIndex!=0);

                    //hidding it for the last slide, showing for the rest
                    section.find('.controlArrow.next').toggle(!destiny.is(':last-child'));
                }

                setURLHash(slideIndex, slideAnchor, anchorLink);
            }

            if(options.css3){
                var translate3d = 'translate3d(-' + destinyPos.left + 'px, 0px, 0px)';

                slides.find('.slidesContainer').toggleClass('easing', options.scrollingSpeed>0).css(getTransforms(translate3d));

                setTimeout(function(){
                    //if the site is not just resizing and readjusting the slides
                    if(!localIsResizing){
                        $.isFunction( options.afterSlideLoad ) && options.afterSlideLoad.call( this, anchorLink, (sectionIndex + 1), slideAnchor, slideIndex );
                    }

                    slideMoving = false;
                }, options.scrollingSpeed, options.easing);
            }else{
                slidesContainer.animate({
                    scrollLeft : destinyPos.left
                }, options.scrollingSpeed, options.easing, function() {

                    //if the site is not just resizing and readjusting the slides
                    if(!localIsResizing){
                        $.isFunction( options.afterSlideLoad ) && options.afterSlideLoad.call( this, anchorLink, (sectionIndex + 1), slideAnchor, slideIndex);
                    }
                    //letting them slide again
                    slideMoving = false;
                });
            }

            slidesNav.find('.active').removeClass('active');
            slidesNav.find('li').eq(slideIndex).find('a').addClass('active');
        }


        if (!isTouchDevice) {
            var resizeId;

            //when resizing the site, we adjust the heights of the sections
            $(window).resize(function() {
                //in order to call the functions only when the resize is finished
                //http://stackoverflow.com/questions/4298612/jquery-how-to-call-resize-event-only-once-its-finished-resizing
                clearTimeout(resizeId);
                resizeId = setTimeout($.fn.fullpage.reBuild, 500);
            });

        }


        var supportsOrientationChange = "onorientationchange" in window,
        orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

        $(window).bind(orientationEvent , function() {
            if(isTouchDevice){
                $.fn.fullpage.reBuild();
            }
        });


        /**
         * When resizing is finished, we adjust the slides sizes and positions
         */
        $.fn.fullpage.reBuild = function(){
            isResizing = true;

            var windowsWidth = $(window).width();
            windowsHeight = $(window).height();

            //text and images resizing
            if (options.resize) {
                resizeMe(windowsHeight, windowsWidth);
            }

            $('.section').each(function(){
                var scrollHeight = windowsHeight - parseInt($(this).css('padding-bottom')) - parseInt($(this).css('padding-top'));

                //adjusting the height of the table-cell for IE and Firefox
                if(options.verticalCentered){
                    $(this).find('.tableCell').css('height', getTableHeight($(this)) + 'px');
                }

                $(this).css('height', windowsHeight + 'px');

                //resizing the scrolling divs
                if(options.scrollOverflow){
                    var slides = $(this).find('.slide');

                    if(slides.length){
                        slides.each(function(){
                            createSlimScrolling($(this));
                        });
                    }else{
                        createSlimScrolling($(this));
                    }

                }

                //adjusting the position fo the FULL WIDTH slides...
                var slides = $(this).find('.slides');
                if (slides.length) {
                    landscapeScroll(slides, slides.find('.slide.active'));
                }
            });

            //adjusting the position for the current section
            var destinyPos = $('.section.active').position();

            var activeSection = $('.section.active');

            //isn't it the first section?
            if(activeSection.index('.section')){
                scrollPage(activeSection);
            }

            isResizing = false;
            $.isFunction( options.afterResize ) && options.afterResize.call( this);
        }

        /**
         * Resizing of the font size depending on the window size as well as some of the images on the site.
         */
        function resizeMe(displayHeight, displayWidth) {
            //Standard height, for which the body font size is correct
            var preferredHeight = 825;
            var windowSize = displayHeight;

            /* Problem to be solved

            if (displayHeight < 825) {
                var percentage = (windowSize * 100) / preferredHeight;
                var newFontSize = percentage.toFixed(2);

                $("img").each(function() {
                    var newWidth = ((80 * percentage) / 100).toFixed(2);
                    $(this).css("width", newWidth + '%');
                });
            } else {
                $("img").each(function() {
                    $(this).css("width", '');
                });
            }*/

            if (displayHeight < 825 || displayWidth < 900) {
                if (displayWidth < 900) {
                    windowSize = displayWidth;
                    preferredHeight = 900;
                }
                var percentage = (windowSize * 100) / preferredHeight;
                var newFontSize = percentage.toFixed(2);

                $("body").css("font-size", newFontSize + '%');
            } else {
                $("body").css("font-size", '100%');
            }
        }

        /**
         * Activating the website navigation dots according to the given slide name.
         */
        function activateNavDots(name, sectionIndex){
            if(options.navigation){
                $('#fullPage-nav').find('.active').removeClass('active');
                if(name){
                    $('#fullPage-nav').find('a[href="#' + name + '"]').addClass('active');
                }else{
                    $('#fullPage-nav').find('li').eq(sectionIndex).find('a').addClass('active');
                }
            }
        }

        /**
         * Activating the website main menu elements according to the given slide name.
         */
        function activateMenuElement(name){
            if(options.menu){
                $(options.menu).find('.active').removeClass('active');
                $(options.menu).find('[data-menuanchor="'+name+'"]').addClass('active');
            }
        }

        /**
        * Return a boolean depending on whether the scrollable element is at the end or at the start of the scrolling
        * depending on the given type.
        */
        function isScrolled(type, scrollable){
            if(type === 'top'){
                return !scrollable.scrollTop();
            }else if(type === 'bottom'){
                return scrollable.scrollTop() + 1 + scrollable.innerHeight() >= scrollable[0].scrollHeight;
            }
        }

        /**
        * Retuns `up` or `down` depending on the scrolling movement to reach its destination
        * from the current section.
        */
        function getYmovement(destiny){
            var fromIndex = $('.section.active').index('.section');
            var toIndex = destiny.index('.section');

            if(fromIndex > toIndex){
                return 'up';
            }
            return 'down';
        }

        /**
        * Retuns `right` or `left` depending on the scrolling movement to reach its destination
        * from the current slide.
        */
        function getXmovement(fromIndex, toIndex){
            if( fromIndex == toIndex){
                return 'none'
            }
            if(fromIndex > toIndex){
                return 'left';
            }
            return 'right';
        }


        function createSlimScrolling(element){
            //needed to make `scrollHeight` work under Opera 12
            element.css('overflow', 'hidden');

            //in case element is a slide
            var section = element.closest('.section');
            var scrollable = element.find('.scrollable');

            //if there was scroll, the contentHeight will be the one in the scrollable section
            if(scrollable.length){
                var contentHeight = element.find('.scrollable').get(0).scrollHeight;
            }else{
                var contentHeight = element.get(0).scrollHeight;
                if(options.verticalCentered){
                    contentHeight = element.find('.tableCell').get(0).scrollHeight;
                }
            }

            var scrollHeight = windowsHeight - parseInt(section.css('padding-bottom')) - parseInt(section.css('padding-top'));

            //needs scroll?
            if ( contentHeight > scrollHeight) {
                //was there already an scroll ? Updating it
                if(scrollable.length){
                    scrollable.css('height', scrollHeight + 'px').parent().css('height', scrollHeight + 'px');
                }
                //creating the scrolling
                else{
                    if(options.verticalCentered){
                        element.find('.tableCell').wrapInner('<div class="scrollable" />');
                    }else{
                        element.wrapInner('<div class="scrollable" />');
                    }


                    element.find('.scrollable').slimScroll({
                        height: scrollHeight + 'px',
                        size: '10px',
                        alwaysVisible: true
                    });
                }
            }

            //removing the scrolling when it is not necessary anymore
            else{
                removeSlimScroll(element);
            }

            //undo
            element.css('overflow', '');
        }

        function removeSlimScroll(element){
            element.find('.scrollable').children().first().unwrap().unwrap();
            element.find('.slimScrollBar').remove();
            element.find('.slimScrollRail').remove();
        }

        function addTableClass(element){
            element.addClass('table').wrapInner('<div class="tableCell" style="height:' + getTableHeight(element) + 'px;" />');
        }

        function getTableHeight(element){
            var sectionHeight = windowsHeight;

            if(options.paddingTop || options.paddingBottom){
                var section = element;
                if(!section.hasClass('section')){
                    section = element.closest('.section');
                }

                var paddings = parseInt(section.css('padding-top')) + parseInt(section.css('padding-bottom'));
                sectionHeight = (windowsHeight - paddings);
            }

            return sectionHeight;
        }

        /**
        * Adds a css3 transform property to the container class with or without animation depending on the animated param.
        */
        function transformContainer(translate3d, animated){
            container.toggleClass('easing', animated);

            container.css(getTransforms(translate3d));
        }


        /**
        * Scrolls to the given section and slide
        */
        function scrollPageAndSlide(destiny, slide){
            if (typeof slide === 'undefined') {
                slide = 0;
            }

            if(isNaN(destiny)){
                var section = $('[data-anchor="'+destiny+'"]');
            }else{
                var section = $('.section').eq( (destiny -1) );
            }


            //we need to scroll to the section and then to the slide
            if (destiny !== lastScrolledDestiny && !section.hasClass('active')){
                scrollPage(section, function(){
                    scrollSlider(section, slide)
                });
            }
            //if we were already in the section
            else{
                scrollSlider(section, slide);
            }

        }

        /**
        * Scrolls the slider to the given slide destination for the given section
        */
        function scrollSlider(section, slide){
            if(typeof slide != 'undefined'){
                var slides = section.find('.slides');
                var destiny =  slides.find('[data-anchor="'+slide+'"]');

                if(!destiny.length){
                    destiny = slides.find('.slide').eq(slide);
                }

                if(destiny.length){
                    landscapeScroll(slides, destiny);
                }
            }
        }

        /**
        * Creates a landscape navigation bar with dots for horizontal sliders.
        */
        function addSlidesNavigation(section, numSlides){
            section.append('<div class="fullPage-slidesNav"><ul></ul></div>');
            var nav = section.find('.fullPage-slidesNav');

            //top or bottom
            nav.addClass(options.slidesNavPosition);

            for(var i=0; i< numSlides; i++){
                nav.find('ul').append('<li><a href="#"><span></span></a></li>');
            }

            //centering it
            nav.css('margin-left', '-' + (nav.width()/2) + 'px');

            nav.find('li').first().find('a').addClass('active');
        }


        /**
        * Sets the URL hash for a section with slides
        */
        function setURLHash(slideIndex, slideAnchor, anchorLink){
            var sectionHash = '';

            if(options.anchors.length){

                //isn't it the first slide?
                if(slideIndex){
                    if(typeof anchorLink !== 'undefined'){
                        sectionHash = anchorLink;
                    }

                    //slide without anchor link? We take the index instead.
                    if(typeof slideAnchor === 'undefined'){
                        slideAnchor = slideIndex;
                    }

                    lastScrolledSlide = slideAnchor;
                    location.hash = sectionHash + '/' + slideAnchor;

                //first slide won't have slide anchor, just the section one
                }else if(typeof slideIndex !== 'undefined'){
                    lastScrolledSlide = slideAnchor;
                    location.hash = anchorLink;
                }

                //section without slides
                else{
                    location.hash = anchorLink;
                }
            }
        }

        /**
        * Scrolls the slider to the given slide destination for the given section
        */
        $(document).on('click', '.fullPage-slidesNav a', function(e){
            e.preventDefault();
            var slides = $(this).closest('.section').find('.slides');
            var destiny = slides.find('.slide').eq($(this).closest('li').index());

            landscapeScroll(slides, destiny);
        });


        /**
        * Checks for translate3d support
        * @return boolean
        * http://stackoverflow.com/questions/5661671/detecting-transform-translate3d-support
        */
        function support3d() {
            var el = document.createElement('p'),
                has3d,
                transforms = {
                    'webkitTransform':'-webkit-transform',
                    'OTransform':'-o-transform',
                    'msTransform':'-ms-transform',
                    'MozTransform':'-moz-transform',
                    'transform':'transform'
                };

            // Add it to the body to get the computed style.
            document.body.insertBefore(el, null);

            for (var t in transforms) {
                if (el.style[t] !== undefined) {
                    el.style[t] = "translate3d(1px,1px,1px)";
                    has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                }
            }

            document.body.removeChild(el);

            return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
        }



        /**
        * Removes the auto scrolling action fired by the mouse wheel and tackpad.
        * After this function is called, the mousewheel and trackpad movements won't scroll through sections.
        */
        function removeMouseWheelHandler(){
            if (document.addEventListener) {
                document.removeEventListener('mousewheel', MouseWheelHandler, false); //IE9, Chrome, Safari, Oper
                document.removeEventListener('wheel', MouseWheelHandler, false); //Firefox
            } else {
                document.detachEvent("onmousewheel", MouseWheelHandler); //IE 6/7/8
            }
        }


        /**
        * Adds the auto scrolling action for the mouse wheel and tackpad.
        * After this function is called, the mousewheel and trackpad movements will scroll through sections
        */
        function addMouseWheelHandler(){
            if (document.addEventListener) {
                document.addEventListener("mousewheel", MouseWheelHandler, false); //IE9, Chrome, Safari, Oper
                document.addEventListener("wheel", MouseWheelHandler, false); //Firefox
            } else {
                document.attachEvent("onmousewheel", MouseWheelHandler); //IE 6/7/8
            }
        }


        /**
        * Adds the possibility to auto scroll through sections on touch devices.
        */
        function addTouchHandler(){
            if(isTouchDevice){
                //Microsoft pointers
                MSPointer = getMSPointer();

                $(document).off('touchstart ' +  MSPointer.down).on('touchstart ' + MSPointer.down, touchStartHandler);
                $(document).off('touchmove ' + MSPointer.move).on('touchmove ' + MSPointer.move, touchMoveHandler);
            }
        }

        /**
        * Removes the auto scrolling for touch devices.
        */
        function removeTouchHandler(){
            if(isTouchDevice){
                //Microsoft pointers
                MSPointer = getMSPointer();

                $(document).off('touchstart ' + MSPointer.down);
                $(document).off('touchmove ' + MSPointer.move);
            }
        }


        /*
        * Returns and object with Microsoft pointers (for IE<11 and for IE >= 11)
        * http://msdn.microsoft.com/en-us/library/ie/dn304886(v=vs.85).aspx
        */
        function getMSPointer(){
            var pointer;

            //IE >= 11
            if(window.PointerEvent){
                pointer = { down: "pointerdown", move: "pointermove"};
            }

            //IE < 11
            else{
                pointer = { down: "MSPointerDown", move: "MSPointerMove"};
            }

            return pointer;
        }
        /**
        * Gets the pageX and pageY properties depending on the browser.
        * https://github.com/alvarotrigo/fullPage.js/issues/194#issuecomment-34069854
        */
        function getEventsPage(e){
            var events = new Array();
            if (window.navigator.msPointerEnabled){
                events['y'] = e.pageY;
                events['x'] = e.pageX;
            }else{
                events['y'] = e.touches[0].pageY;
                events['x'] =  e.touches[0].pageX;
            }

            return events;
        }

        function silentScroll(top){
            if (options.css3) {
                var translate3d = 'translate3d(0px, -' + top + 'px, 0px)';
                transformContainer(translate3d, false);
            }
            else {
                container.css("top", -top);
            }
        }

        function getTransforms(translate3d){
            return {
                '-webkit-transform': translate3d,
                '-moz-transform': translate3d,
                '-ms-transform':translate3d,
                'transform': translate3d
            };
        }


        /*
        * Destroys fullpage.js plugin events and optinally its html markup and styles
        */

        $('body').on('mk-opened-nav', function() {
            $.fn.fullpage.setAutoScrolling(false);
            $.fn.fullpage.setAllowScrolling(false);
            $.fn.fullpage.setKeyboardScrolling(false);

            $(window)
                .off('scroll', scrollHandler);
        });

        $('body').on('mk-closed-nav', function() {
            $.fn.fullpage.setAutoScrolling(true);
            $.fn.fullpage.setAllowScrolling(true);
            $.fn.fullpage.setKeyboardScrolling(true);

            $(window)
                .on('scroll', scrollHandler);
        });
        
        $.fn.fullpage.destroy = function(all){
            $.fn.fullpage.setAutoScrolling(false);
            $.fn.fullpage.setAllowScrolling(false);
            $.fn.fullpage.setKeyboardScrolling(false);


            $(window)
                .off('scroll', scrollHandler)
                .off('hashchange', hashChangeHandler);

            $(document)
                .off('click', '#fullPage-nav a')
                .off('mouseenter', '#fullPage-nav li')
                .off('mouseleave', '#fullPage-nav li')
                .off('click', '.fullPage-slidesNav a')
                .off('mouseover', options.normalScrollElements)
                .off('mouseout', options.normalScrollElements);

            $('.section')
                .off('click', '.controlArrow')
                .off('click', '.toSlide');

            //lets make a mess!
            if(all){
                destroyStructure();
            }
        };

        /*
        * Removes inline styles added by fullpage.js
        */
        function destroyStructure(){
            //reseting the `top` or `translate` properties to 0
            silentScroll(0);

            $('#fullPage-nav, .fullPage-slidesNav, .controlArrow').remove();

            //removing inline styles
            $('.section').css( {
                'height': '',
                'background-color' : '',
                'padding': ''
            });

            $('.slide').css( {
                'width': ''
            });

            container.css({
                'height': '',
                'position': '',
                '-ms-touch-action': ''
            });

            //removing added classes
            $('.section, .slide').each(function(){
                removeSlimScroll($(this));
                $(this).removeClass('table active');
            })

            container.find('.easing').removeClass('easing');

            //Unwrapping content
            container.find('.tableCell, .slidesContainer, .slides').each(function(){
                //unwrap not being use in case there's no child element inside and its just text
                $(this).replaceWith(this.childNodes);
            });

            //scrolling the page to the top with no animation
            $('html, body').scrollTop(0);

            //to know if the plugin was already used in case it is used in a future again
            container.addClass('fullpage-used');
        }

    };

})(jQuery);
;

/**
 * Ajax Portfolio
 */
(function ($, window, document, undefined) {
        "use strict";
        var pluginName = "ajaxPortfolio",
                defaults = {
                        propertyName: "value",
                        extraOffset: 100
                };

        function Plugin(element, options) {
                this.element = $(element);
                this.settings = $.extend({}, defaults, options);
                this.init();

        }
        Plugin.prototype = {
                init: function () {
                        var obj = this;
                        this.grid = this.element.find('.mk-portfolio-container'), 
                        this.items = this.grid.children();

                        if (this.items.length < 1) return false; //If no items was found then exit
                        this.ajaxDiv = this.element.find('div.ajax-container'), 
                        this.filter = this.element.find('#mk-filter-portfolio'), 
                        this.loader = this.element.find('.portfolio-loader'), 
                        this.triggers = this.items.find('.project-load'), 
                        this.closeBtn = this.ajaxDiv.find('.close-ajax'), 
                        this.nextBtn = this.ajaxDiv.find('.next-ajax'), 
                        this.prevBtn = this.ajaxDiv.find('.prev-ajax'), 
                        this.api = {}, 
                        this.id = null, 
                        this.win = $(window), 
                        this.current = 0, 
                        this.breakpointT = 989, 
                        this.breakpointP = 767, 
                        this.columns = this.grid.data('columns'), 
                        this.real_col = this.columns;
                        this.loader.fadeIn();
                        if (this.items.length == 1) {
                                this.nextBtn.remove();
                                this.prevBtn.remove();
                        }
                        this.grid.waitForImages(function () {
                                obj.loader.fadeOut();
                                obj.bind_handler();
                        });

                },

                bind_handler: function () {
                        var obj = this; // Temp instance of this object
                        // Bind the filters with isotope
                        obj.filter.find('a').click(function () {
                                obj.triggers.removeClass('active');
                                obj.grid.removeClass('grid-open');
                                obj.close_project();
                                obj.filter.find('a').removeClass('active_sort');
                                $(this).addClass('active_sort');
                                var selector = $(this).attr('data-filter');
                                obj.grid.isotope({
                                        filter: selector
                                });
                                return false;
                        });

                        obj.triggers.on('click', function () {

                                var clicked = $(this),
                                        clickedParent = clicked.parents('.mk-portfolio-item');

                                obj.current = clickedParent.index();

                                if (clicked.hasClass('active')) return false;

                                obj.close_project();

                                obj.triggers.removeClass('active');
                                clicked.addClass('active');
                                obj.grid.addClass('grid-open');
                                obj.loader.fadeIn();

                                obj.id = clicked.data('post-id');

                                obj.load_project();

                                return false;

                        });

                        obj.nextBtn.on('click', function () {
                                if (obj.current == obj.triggers.length - 1) {
                                        obj.triggers.eq(0).trigger('click');
                                        return false;
                                } else {
                                        obj.triggers.eq(obj.current + 1).trigger('click');
                                        return false;
                                }

                        });

                        obj.prevBtn.on('click', function () {
                                if (obj.current == 0) {
                                        obj.triggers.eq(obj.triggers.length - 1).trigger('click');
                                        return false;
                                } else {
                                        obj.triggers.eq(obj.current - 1).trigger('click');
                                        return false;
                                }

                        });

                        // Bind close button
                        obj.closeBtn.on('click', function () {
                                obj.close_project();
                                obj.triggers.removeClass('active');
                                obj.grid.removeClass('grid-open');
                                return false;
                        });


                },
                // Function to close the ajax container div
                close_project: function () {
                        var obj = this,
                                // Temp instance of this object
                                project = obj.ajaxDiv.find('.ajax_project'),
                                newH = project.actual('outerHeight');

                        obj.ajaxDiv.find('iframe').attr('src', '');


                        if (obj.ajaxDiv.height() > 0) {
                                obj.ajaxDiv.css('height', newH + 'px').transition({
                                        height: 0,
                                        opacity: 0
                                }, 600);
                        } else {
                                obj.ajaxDiv.transition({
                                        height: 0,
                                        opacity: 0
                                }, 600);
                        }
                },
                load_project: function () {
                        var obj = this;
                        $.post(ajaxurl, {
                                action: 'mk_ajax_portfolio',
                                id: obj.id
                        }, function (response) {
                                obj.ajaxDiv.find('.ajax_project').remove();
                                obj.ajaxDiv.append(response);
                                obj.project_factory();
                                mk_ajax_lightbox_init();
                                mk_click_events();
                                mk_theme_toggle_box();
                                mk_social_share_global();
                                mk_swipe_slider_init();
                                setTimeout(function () {
                                        mk_flexslider_init();
                                        mk_load_isotop_enabled_scripts();
                                }, 1000);
                                mk_gallery();

                        });
                },
                project_factory: function () {
                        var obj = this,
                                project = this.ajaxDiv.find('.ajax_project');



                        project.waitForImages(function () {
                                $('html:not(:animated),body:not(:animated)').animate({
                                        scrollTop: obj.ajaxDiv.offset().top -160 -obj.settings.extraOffset
                                }, 700);
                                mk_flexslider_init();
                                obj.loader.fadeOut(function () {
                                        var newH = project.actual('outerHeight');
                                        obj.ajaxDiv.transition({
                                                opacity: 1,
                                                height: newH
                                        }, 400, function () {
                                                obj.ajaxDiv.css({
                                                        height: 'auto'
                                                });
                                        });
                                });

                        });

                },

        };
        $.fn[pluginName] = function (options) {
                return this.each(function () {
                        //if (!$.data(this, "plugin_" + pluginName)) {
                                $.data(this, "plugin_" + pluginName);
                                        
                                        new Plugin(this, options)
                        //}
                });
        };
})(jQuery, window, document);


; /* 
 * Blur.js
 * Copyright Jacob Kelley
 * MIT License
 */
// Stackblur, courtesy of Mario Klingemann: http://www.quasimondo.com/StackBlurForCanvas/StackBlurDemo.html
(function(l) {
    l.fn.blurjs = function(e) {
        function O() {
            this.a = this.b = this.g = this.r = 0;
            this.next = null
        }
        var y = document.createElement("canvas"), P = !1, H = l(this).selector.replace(/[^a-zA-Z0-9]/g, "");
        if (y.getContext) {
            var e = l.extend({source: "body",radius: 5,overlay: "",offset: {x: 0,y: 0},optClass: "",cache: !1,cacheKeyPrefix: "blurjs-",draggable: !1,debug: !1}, e), R = [512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512, 482, 454, 428, 405, 383, 364, 345, 
                328, 312, 298, 284, 271, 259, 496, 475, 456, 437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512, 497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328, 320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456, 446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335, 329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328, 324, 320, 316, 312, 309, 
                305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456, 451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388, 385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335, 332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292, 289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259], S = [9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 
                20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 
                24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24];
            return this.each(function() {
                var A = l(this), I = l(e.source), B = I.css("backgroundImage").replace(/"/g, "").replace(/url\(|\)$/ig, "");
                ctx = y.getContext("2d");
                tempImg = new Image;
                tempImg.onload = function() {
                    if (P)
                        j = tempImg.src;
                    else {
                        y.style.display = "none";
                        y.width = tempImg.width;
                        y.height = tempImg.height;
                        ctx.drawImage(tempImg, 0, 0);
                        var j = y.width, q = y.height, k = e.radius;
                        if (!(isNaN(k) || 1 > k)) {
                            var k = 
                            k | 0, M = y.getContext("2d"), l;
                            try {
                                try {
                                    l = M.getImageData(0, 0, j, q)
                                } catch (L) {
                                    try {
                                        netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead"), l = M.getImageData(0, 0, j, q)
                                    } catch (T) {
                                        throw alert("Cannot access local image"), Error("unable to access local image data: " + T);
                                    }
                                }
                            } catch (U) {
                                throw alert("Cannot access image"), Error("unable to access image data: " + U);
                            }
                            var c = l.data, u, z, a, d, f, J, g, h, i, v, w, x, m, n, o, r, s, t, C;
                            u = k + k + 1;
                            var K = j - 1, N = q - 1, p = k + 1, D = p * (p + 1) / 2, E = new O, b = E;
                            for (a = 1; a < u; a++)
                                if (b = b.next = new O, a == 
                                p)
                                    var Q = b;
                            b.next = E;
                            b = a = null;
                            J = f = 0;
                            var F = R[k], G = S[k];
                            for (z = 0; z < q; z++) {
                                m = n = o = g = h = i = 0;
                                v = p * (r = c[f]);
                                w = p * (s = c[f + 1]);
                                x = p * (t = c[f + 2]);
                                g += D * r;
                                h += D * s;
                                i += D * t;
                                b = E;
                                for (a = 0; a < p; a++)
                                    b.r = r, b.g = s, b.b = t, b = b.next;
                                for (a = 1; a < p; a++)
                                    d = f + ((K < a ? K : a) << 2), g += (b.r = r = c[d]) * (C = p - a), h += (b.g = s = c[d + 1]) * C, i += (b.b = t = c[d + 2]) * C, m += r, n += s, o += t, b = b.next;
                                a = E;
                                b = Q;
                                for (u = 0; u < j; u++)
                                    c[f] = g * F >> G, c[f + 1] = h * F >> G, c[f + 2] = i * F >> G, g -= v, h -= w, i -= x, v -= a.r, w -= a.g, x -= a.b, d = J + ((d = u + k + 1) < K ? d : K) << 2, m += a.r = c[d], n += a.g = c[d + 1], o += a.b = c[d + 2], g += m, h += n, i += o, a = a.next, 
                                    v += r = b.r, w += s = b.g, x += t = b.b, m -= r, n -= s, o -= t, b = b.next, f += 4;
                                J += j
                            }
                            for (u = 0; u < j; u++) {
                                n = o = m = h = i = g = 0;
                                f = u << 2;
                                v = p * (r = c[f]);
                                w = p * (s = c[f + 1]);
                                x = p * (t = c[f + 2]);
                                g += D * r;
                                h += D * s;
                                i += D * t;
                                b = E;
                                for (a = 0; a < p; a++)
                                    b.r = r, b.g = s, b.b = t, b = b.next;
                                d = j;
                                for (a = 1; a <= k; a++)
                                    f = d + u << 2, g += (b.r = r = c[f]) * (C = p - a), h += (b.g = s = c[f + 1]) * C, i += (b.b = t = c[f + 2]) * C, m += r, n += s, o += t, b = b.next, a < N && (d += j);
                                f = u;
                                a = E;
                                b = Q;
                                for (z = 0; z < q; z++)
                                    d = f << 2, c[d] = g * F >> G, c[d + 1] = h * F >> G, c[d + 2] = i * F >> G, g -= v, h -= w, i -= x, v -= a.r, w -= a.g, x -= a.b, d = u + ((d = z + p) < N ? d : N) * j << 2, g += m += a.r = c[d], h += n += a.g = 
                                    c[d + 1], i += o += a.b = c[d + 2], a = a.next, v += r = b.r, w += s = b.g, x += t = b.b, m -= r, n -= s, o -= t, b = b.next, f += j
                            }
                            M.putImageData(l, 0, 0)
                        }
                        if (!1 != e.overlay)
                            ctx.beginPath(), ctx.rect(0, 0, tempImg.width, tempImg.width), ctx.fillStyle = e.overlay, ctx.fill();
                        var j = y.toDataURL();
                        if (e.cache)
                            try {
                                e.debug && console.log("Cache Set"), localStorage.setItem(e.cacheKeyPrefix + H + "-" + B + "-data-image", j)
                            } catch (V) {
                                console.log(V)
                            }
                    }
                    q = I.css("backgroundAttachment");
                    k = "fixed" == q ? "" : "-" + (A.offset().left - I.offset().left - e.offset.x) + "px -" + (A.offset().top - I.offset().top - 
                    e.offset.y) + "px";
                    A.css({"background-image": 'url("' + j + '")',"background-repeat": I.css("backgroundRepeat"),"background-position": k,"background-attachment": q});
                    !1 != e.optClass && A.addClass(e.optClass);
                    e.draggable && (A.css({"background-attachment": "fixed","background-position": "0 0"}), A.draggable())
                };
                Storage.prototype.cacheChecksum = function(j) {
                    var q = "", k;
                    for (k in j)
                        var l = j[k], q = "[object Object]" == l.toString() ? q + (l.x.toString() + l.y.toString() + ",").replace(/[^a-zA-Z0-9]/g, "") : q + (l + ",").replace(/[^a-zA-Z0-9]/g, 
                        "");
                    this.getItem(e.cacheKeyPrefix + H + "-" + B + "-options-cache") != q && (this.removeItem(e.cacheKeyPrefix + H + "-" + B + "-options-cache"), this.setItem(e.cacheKeyPrefix + H + "-" + B + "-options-cache", q), e.debug && console.log("Settings Changed, Cache Emptied"))
                };
                var L = null;
                e.cache && (localStorage.cacheChecksum(e), L = localStorage.getItem(e.cacheKeyPrefix + H + "-" + B + "-data-image"));
                null != L ? (e.debug && console.log("Cache Used"), P = !0, tempImg.src = L) : (e.debug && console.log("Source Used"), tempImg.src = B)
            })
        }
    }
})(jQuery);
;

/**
 * downCount: Simple Countdown clock with offset
 * Author: Sonny T. <hi@sonnyt.com>, sonnyt.com
 */

(function ($) {

    $.fn.downCount = function (options, callback) {
        var settings = $.extend({
                date: null,
                offset: null
            }, options);

        // Throw error if date is not set
        if (!settings.date) {
            $.error('Date is not defined.');
        }

        // Throw error if date is set incorectly
        if (!Date.parse(settings.date)) {
            $.error('Incorrect date format, it should look like this, 12/24/2012 12:00:00.');
        }

        // Save container
        var container = this;

        /**
         * Change client's local date to match offset timezone
         * @return {Object} Fixed Date object.
         */
        var currentDate = function () {
            // get client's current date
            var date = new Date();

            // turn date to utc
            var utc = date.getTime() + (date.getTimezoneOffset() * 60000);

            // set new Date object
            var new_date = new Date(utc + (3600000*settings.offset))

            return new_date;
        };

        /**
         * Main downCount function that calculates everything
         */
        function countdown () {
            var target_date = new Date(settings.date), // set target date
                current_date = currentDate(); // get fixed current date

            // difference of dates
            var difference = target_date - current_date;

            // if difference is negative than it's pass the target date
            if (difference < 0) {
                // stop timer
                clearInterval(interval);

                if (callback && typeof callback === 'function') callback();

                return;
            }

            // basic math variables
            var _second = 1000,
                _minute = _second * 60,
                _hour = _minute * 60,
                _day = _hour * 24;

            // calculate dates
            var days = Math.floor(difference / _day),
                hours = Math.floor((difference % _day) / _hour),
                minutes = Math.floor((difference % _hour) / _minute),
                seconds = Math.floor((difference % _minute) / _second);

                // fix dates so that it will show two digets
                days = (String(days).length >= 2) ? days : '0' + days;
                hours = (String(hours).length >= 2) ? hours : '0' + hours;
                minutes = (String(minutes).length >= 2) ? minutes : '0' + minutes;
                seconds = (String(seconds).length >= 2) ? seconds : '0' + seconds;

            // based on the date change the refrence wording
            var ref_days = (days === 1) ? 'day' : 'days',
                ref_hours = (hours === 1) ? 'hour' : 'hours',
                ref_minutes = (minutes === 1) ? 'minute' : 'minutes',
                ref_seconds = (seconds === 1) ? 'second' : 'seconds';

            // set to DOM
            container.find('.days').text(days);
            container.find('.hours').text(hours);
            container.find('.minutes').text(minutes);
            container.find('.seconds').text(seconds);

            container.find('.days_ref').text(ref_days);
            container.find('.hours_ref').text(ref_hours);
            container.find('.minutes_ref').text(ref_minutes);
            container.find('.seconds_ref').text(ref_seconds);
        };
        
        // start
        var interval = setInterval(countdown, 1000);
    };

})(jQuery);
;/*
 * debouncedresize: special jQuery event that happens once after a window resize
 *
 * latest version and complete README available on Github:
 * https://github.com/louisremi/jquery-smartresize
 *
 * Copyright 2012 @louis_remi
 * Licensed under the MIT license.
 *
 * This saved you an hour of work?
 * Send me music http://www.amazon.co.uk/wishlist/HNTU0468LQON
 */
(function ($) {

        var $event = $.event,
                $special, resizeTimeout;

        $special = $event.special.debouncedresize = {
                setup: function () {
                        $(this).on("resize", $special.handler);
                },
                teardown: function () {
                        $(this).off("resize", $special.handler);
                },
                handler: function (event, execAsap) {
                        // Save the context
                        var context = this,
                                args = arguments,
                                dispatch = function () {
                                        // set correct event type
                                        event.type = "debouncedresize";
                                        $event.dispatch.apply(context, args);
                                };

                        if (resizeTimeout) {
                                clearTimeout(resizeTimeout);
                        }

                        execAsap ? dispatch() : resizeTimeout = setTimeout(dispatch, $special.threshold);
                },
                threshold: 150
        };

})(jQuery);
;

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 */
jQuery.easing["jswing"] = jQuery.easing["swing"];
jQuery.extend(jQuery.easing, {
        def: "easeOutQuad",
        swing: function (a, b, c, d, e) {
                return jQuery.easing[jQuery.easing.def](a, b, c, d, e)
        },
        easeInQuad: function (a, b, c, d, e) {
                return d * (b /= e) * b + c
        },
        easeOutQuad: function (a, b, c, d, e) {
                return -d * (b /= e) * (b - 2) + c
        },
        easeInOutQuad: function (a, b, c, d, e) {
                if ((b /= e / 2) < 1) return d / 2 * b * b + c;
                return -d / 2 * (--b * (b - 2) - 1) + c
        },
        easeInCubic: function (a, b, c, d, e) {
                return d * (b /= e) * b * b + c
        },
        easeOutCubic: function (a, b, c, d, e) {
                return d * ((b = b / e - 1) * b * b + 1) + c
        },
        easeInOutCubic: function (a, b, c, d, e) {
                if ((b /= e / 2) < 1) return d / 2 * b * b * b + c;
                return d / 2 * ((b -= 2) * b * b + 2) + c
        },
        easeInQuart: function (a, b, c, d, e) {
                return d * (b /= e) * b * b * b + c
        },
        easeOutQuart: function (a, b, c, d, e) {
                return -d * ((b = b / e - 1) * b * b * b - 1) + c
        },
        easeInOutQuart: function (a, b, c, d, e) {
                if ((b /= e / 2) < 1) return d / 2 * b * b * b * b + c;
                return -d / 2 * ((b -= 2) * b * b * b - 2) + c
        },
        easeInQuint: function (a, b, c, d, e) {
                return d * (b /= e) * b * b * b * b + c
        },
        easeOutQuint: function (a, b, c, d, e) {
                return d * ((b = b / e - 1) * b * b * b * b + 1) + c
        },
        easeInOutQuint: function (a, b, c, d, e) {
                if ((b /= e / 2) < 1) return d / 2 * b * b * b * b * b + c;
                return d / 2 * ((b -= 2) * b * b * b * b + 2) + c
        },
        easeInSine: function (a, b, c, d, e) {
                return -d * Math.cos(b / e * (Math.PI / 2)) + d + c
        },
        easeOutSine: function (a, b, c, d, e) {
                return d * Math.sin(b / e * (Math.PI / 2)) + c
        },
        easeInOutSine: function (a, b, c, d, e) {
                return -d / 2 * (Math.cos(Math.PI * b / e) - 1) + c
        },
        easeInExpo: function (a, b, c, d, e) {
                return b == 0 ? c : d * Math.pow(2, 10 * (b / e - 1)) + c
        },
        easeOutExpo: function (a, b, c, d, e) {
                return b == e ? c + d : d * (-Math.pow(2, -10 * b / e) + 1) + c
        },
        easeInOutExpo: function (a, b, c, d, e) {
                if (b == 0) return c;
                if (b == e) return c + d;
                if ((b /= e / 2) < 1) return d / 2 * Math.pow(2, 10 * (b - 1)) + c;
                return d / 2 * (-Math.pow(2, -10 * --b) + 2) + c
        },
        easeInCirc: function (a, b, c, d, e) {
                return -d * (Math.sqrt(1 - (b /= e) * b) - 1) + c
        },
        easeOutCirc: function (a, b, c, d, e) {
                return d * Math.sqrt(1 - (b = b / e - 1) * b) + c
        },
        easeInOutCirc: function (a, b, c, d, e) {
                if ((b /= e / 2) < 1) return -d / 2 * (Math.sqrt(1 - b * b) - 1) + c;
                return d / 2 * (Math.sqrt(1 - (b -= 2) * b) + 1) + c
        },
        easeInElastic: function (a, b, c, d, e) {
                var f = 1.70158;
                var g = 0;
                var h = d;
                if (b == 0) return c;
                if ((b /= e) == 1) return c + d;
                if (!g) g = e * .3;
                if (h < Math.abs(d)) {
                        h = d;
                        var f = g / 4
                } else var f = g / (2 * Math.PI) * Math.asin(d / h);
                return -(h * Math.pow(2, 10 * (b -= 1)) * Math.sin((b * e - f) * 2 * Math.PI / g)) + c
        },
        easeOutElastic: function (a, b, c, d, e) {
                var f = 1.70158;
                var g = 0;
                var h = d;
                if (b == 0) return c;
                if ((b /= e) == 1) return c + d;
                if (!g) g = e * .3;
                if (h < Math.abs(d)) {
                        h = d;
                        var f = g / 4
                } else var f = g / (2 * Math.PI) * Math.asin(d / h);
                return h * Math.pow(2, -10 * b) * Math.sin((b * e - f) * 2 * Math.PI / g) + d + c
        },
        easeInOutElastic: function (a, b, c, d, e) {
                var f = 1.70158;
                var g = 0;
                var h = d;
                if (b == 0) return c;
                if ((b /= e / 2) == 2) return c + d;
                if (!g) g = e * .3 * 1.5;
                if (h < Math.abs(d)) {
                        h = d;
                        var f = g / 4
                } else var f = g / (2 * Math.PI) * Math.asin(d / h);
                if (b < 1) return -.5 * h * Math.pow(2, 10 * (b -= 1)) * Math.sin((b * e - f) * 2 * Math.PI / g) + c;
                return h * Math.pow(2, -10 * (b -= 1)) * Math.sin((b * e - f) * 2 * Math.PI / g) * .5 + d + c
        },
        easeInBack: function (a, b, c, d, e, f) {
                if (f == undefined) f = 1.70158;
                return d * (b /= e) * b * ((f + 1) * b - f) + c
        },
        easeOutBack: function (a, b, c, d, e, f) {
                if (f == undefined) f = 1.70158;
                return d * ((b = b / e - 1) * b * ((f + 1) * b + f) + 1) + c
        },
        easeInOutBack: function (a, b, c, d, e, f) {
                if (f == undefined) f = 1.70158;
                if ((b /= e / 2) < 1) return d / 2 * b * b * (((f *= 1.525) + 1) * b - f) + c;
                return d / 2 * ((b -= 2) * b * (((f *= 1.525) + 1) * b + f) + 2) + c
        },
        easeInBounce: function (a, b, c, d, e) {
                return d - jQuery.easing.easeOutBounce(a, e - b, 0, d, e) + c
        },
        easeOutBounce: function (a, b, c, d, e) {
                if ((b /= e) < 1 / 2.75) {
                        return d * 7.5625 * b * b + c
                } else if (b < 2 / 2.75) {
                        return d * (7.5625 * (b -= 1.5 / 2.75) * b + .75) + c
                } else if (b < 2.5 / 2.75) {
                        return d * (7.5625 * (b -= 2.25 / 2.75) * b + .9375) + c
                } else {
                        return d * (7.5625 * (b -= 2.625 / 2.75) * b + .984375) + c
                }
        },
        easeInOutBounce: function (a, b, c, d, e) {
                if (b < e / 2) return jQuery.easing.easeInBounce(a, b * 2, 0, d, e) * .5 + c;
                return jQuery.easing.easeOutBounce(a, b * 2 - e, 0, d, e) * .5 + d * .5 + c
        }
});

// Generated by CoffeeScript 1.4.0
/*
Easy pie chart is a jquery plugin to display simple animated pie charts for only one value

Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.

Built on top of the jQuery library (http://jquery.com)

@source: http://github.com/rendro/easy-pie-chart/
@autor: Robert Fleischmann
@version: 1.1.0

Inspired by: http://dribbble.com/shots/631074-Simple-Pie-Charts-II?list=popular&offset=210
Thanks to Philip Thrasher for the jquery plugin boilerplate for coffee script
*/

(function ($) {
        $.easyPieChart = function (el, options) {
                var addScaleLine, animateLine, drawLine, easeInOutQuad, rAF, renderBackground, renderScale, renderTrack, _this = this;
                this.el = el;
                this.$el = $(el);
                this.$el.data("easyPieChart", this);
                this.init = function () {
                        var percent, scaleBy;
                        _this.options = $.extend({}, $.easyPieChart.defaultOptions, options);
                        percent = parseInt(_this.$el.data('percent'), 10);
                        _this.percentage = 0;
                        _this.canvas = $("<canvas width='" + _this.options.size + "' height='" + _this.options.size + "'></canvas>").get(0);
                        _this.$el.append(_this.canvas);
                        if (typeof G_vmlCanvasManager !== "undefined" && G_vmlCanvasManager !== null) {
                                G_vmlCanvasManager.initElement(_this.canvas);
                        }
                        _this.ctx = _this.canvas.getContext('2d');
                        if (window.devicePixelRatio > 1) {
                                scaleBy = window.devicePixelRatio;
                                $(_this.canvas).css({
                                        width: _this.options.size,
                                        height: _this.options.size
                                });
                                _this.canvas.width *= scaleBy;
                                _this.canvas.height *= scaleBy;
                                _this.ctx.scale(scaleBy, scaleBy);
                        }
                        _this.ctx.translate(_this.options.size / 2, _this.options.size / 2);
                        _this.$el.addClass('easyPieChart');
                        _this.$el.css({
                                width: _this.options.size,
                                height: _this.options.size,
                                lineHeight: "" + _this.options.size + "px"
                        });
                        _this.update(percent);
                        return _this;
                };
                this.update = function (percent) {
                        percent = parseFloat(percent) || 0;
                        if (_this.options.animate === false) {
                                drawLine(percent);
                        } else {
                                animateLine(_this.percentage, percent);
                        }
                        return _this;
                };
                renderScale = function () {
                        var i, _i, _results;
                        _this.ctx.fillStyle = _this.options.scaleColor;
                        _this.ctx.lineWidth = 1;
                        _results = [];
                        for (i = _i = 0; _i <= 24; i = ++_i) {
                                _results.push(addScaleLine(i));
                        }
                        return _results;
                };
                addScaleLine = function (i) {
                        var offset;
                        offset = i % 6 === 0 ? 0 : _this.options.size * 0.017;
                        _this.ctx.save();
                        _this.ctx.rotate(i * Math.PI / 12);
                        _this.ctx.fillRect(_this.options.size / 2 - offset, 0, -_this.options.size * 0.05 + offset, 1);
                        _this.ctx.restore();
                };
                renderTrack = function () {
                        var offset;
                        offset = _this.options.size / 2 - _this.options.lineWidth / 2;
                        if (_this.options.scaleColor !== false) {
                                offset -= _this.options.size * 0.08;
                        }
                        _this.ctx.beginPath();
                        _this.ctx.arc(0, 0, offset, 0, Math.PI * 2, true);
                        _this.ctx.closePath();
                        _this.ctx.strokeStyle = _this.options.trackColor;
                        _this.ctx.lineWidth = _this.options.lineWidth;
                        _this.ctx.stroke();
                };
                renderBackground = function () {
                        if (_this.options.scaleColor !== false) {
                                renderScale();
                        }
                        if (_this.options.trackColor !== false) {
                                renderTrack();
                        }
                };
                drawLine = function (percent) {
                        var offset;
                        renderBackground();
                        _this.ctx.strokeStyle = $.isFunction(_this.options.barColor) ? _this.options.barColor(percent) : _this.options.barColor;
                        _this.ctx.lineCap = _this.options.lineCap;
                        _this.ctx.lineWidth = _this.options.lineWidth;
                        offset = _this.options.size / 2 - _this.options.lineWidth / 2;
                        if (_this.options.scaleColor !== false) {
                                offset -= _this.options.size * 0.08;
                        }
                        _this.ctx.save();
                        _this.ctx.rotate(-Math.PI / 2);
                        _this.ctx.beginPath();
                        _this.ctx.arc(0, 0, offset, 0, Math.PI * 2 * percent / 100, false);
                        _this.ctx.stroke();
                        _this.ctx.restore();
                };
                rAF = (function () {
                        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
                        function (callback) {
                                return window.setTimeout(callback, 1000 / 60);
                        };
                })();
                animateLine = function (from, to) {
                        var anim, startTime;
                        _this.options.onStart.call(_this);
                        _this.percentage = to;
                        startTime = Date.now();
                        anim = function () {
                                var currentValue, process;
                                process = Date.now() - startTime;
                                if (process < _this.options.animate) {
                                        rAF(anim);
                                }
                                _this.ctx.clearRect(-_this.options.size / 2, -_this.options.size / 2, _this.options.size, _this.options.size);
                                renderBackground.call(_this);
                                currentValue = [easeInOutQuad(process, from, to - from, _this.options.animate)];
                                _this.options.onStep.call(_this, currentValue);
                                drawLine.call(_this, currentValue);
                                if (process >= _this.options.animate) {
                                        return _this.options.onStop.call(_this);
                                }
                        };
                        rAF(anim);
                };
                easeInOutQuad = function (t, b, c, d) {
                        var easeIn, easing;
                        easeIn = function (t) {
                                return Math.pow(t, 2);
                        };
                        easing = function (t) {
                                if (t < 1) {
                                        return easeIn(t);
                                } else {
                                        return 2 - easeIn((t / 2) * -2 + 2);
                                }
                        };
                        t /= d / 2;
                        return c / 2 * easing(t) + b;
                };
                return this.init();
        };
        $.easyPieChart.defaultOptions = {
                barColor: '#ef1e25',
                trackColor: '#f2f2f2',
                scaleColor: '#dfe0e0',
                lineCap: 'round',
                size: 110,
                lineWidth: 3,
                animate: false,
                onStart: $.noop,
                onStop: $.noop,
                onStep: $.noop
        };
        $.fn.easyPieChart = function (options) {
                return $.each(this, function (i, el) {
                        var $el;
                        $el = $(el);
                        if (!$el.data('easyPieChart')) {
                                return $el.data('easyPieChart', new $.easyPieChart(el, options));
                        }
                });
        };
        return void 0;
})(jQuery);


;
/*! fancyBox v2.1.5 fancyapps.com | fancyapps.com/fancybox/#license */
(function(s, H, f, w) {
    var K = f("html"),
        q = f(s),
        p = f(H),
        b = f.fancybox = function() {
            b.open.apply(this, arguments)
        },
        J = navigator.userAgent.match(/msie/i),
        C = null,
        t = H.createTouch !== w,
        u = function(a) {
            return a && a.hasOwnProperty && a instanceof f
        },
        r = function(a) {
            return a && "string" === f.type(a)
        },
        F = function(a) {
            return r(a) && 0 < a.indexOf("%")
        },
        m = function(a, d) {
            var e = parseInt(a, 10) || 0;
            d && F(a) && (e *= b.getViewport()[d] / 100);
            return Math.ceil(e)
        },
        x = function(a, b) {
            return m(a, b) + "px"
        };
    f.extend(b, {
        version: "2.1.5",
        defaults: {
            padding: 15,
            margin: 20,
            width: 800,
            height: 600,
            minWidth: 100,
            minHeight: 100,
            maxWidth: 9999,
            maxHeight: 9999,
            pixelRatio: 1,
            autoSize: !0,
            autoHeight: !1,
            autoWidth: !1,
            autoResize: !0,
            autoCenter: !t,
            fitToView: !0,
            aspectRatio: !1,
            topRatio: 0.5,
            leftRatio: 0.5,
            scrolling: "auto",
            wrapCSS: "",
            arrows: !0,
            closeBtn: !0,
            closeClick: !1,
            nextClick: !1,
            mouseWheel: !0,
            autoPlay: !1,
            playSpeed: 3E3,
            preload: 3,
            modal: !1,
            loop: !0,
            ajax: {
                dataType: "html",
                headers: {
                    "X-fancyBox": !0
                }
            },
            iframe: {
                scrolling: "auto",
                preload: !0
            },
            swf: {
                wmode: "transparent",
                allowfullscreen: "true",
                allowscriptaccess: "always"
            },
            keys: {
                next: {
                    13: "left",
                    34: "up",
                    39: "left",
                    40: "up"
                },
                prev: {
                    8: "right",
                    33: "down",
                    37: "right",
                    38: "down"
                },
                close: [27],
                play: [32],
                toggle: [70]
            },
            direction: {
                next: "left",
                prev: "right"
            },
            scrollOutside: !0,
            index: 0,
            type: null,
            href: null,
            content: null,
            title: null,
            tpl: {
                wrap: '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
                image: '<img class="fancybox-image" src="{href}" alt="" />',
                iframe: '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' +
                    (J ? ' allowtransparency="true"' : "") + "></iframe>",
                error: '<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',
                closeBtn: '<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a>',
                next: '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
                prev: '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'
            },
            openEffect: "fade",
            openSpeed: 250,
            openEasing: "swing",
            openOpacity: !0,
            openMethod: "zoomIn",
            closeEffect: "fade",
            closeSpeed: 250,
            closeEasing: "swing",
            closeOpacity: !0,
            closeMethod: "zoomOut",
            nextEffect: "elastic",
            nextSpeed: 250,
            nextEasing: "swing",
            nextMethod: "changeIn",
            prevEffect: "elastic",
            prevSpeed: 250,
            prevEasing: "swing",
            prevMethod: "changeOut",
            helpers: {
                overlay: !0,
                title: !0
            },
            onCancel: f.noop,
            beforeLoad: f.noop,
            afterLoad: f.noop,
            beforeShow: f.noop,
            afterShow: f.noop,
            beforeChange: f.noop,
            beforeClose: f.noop,
            afterClose: f.noop
        },
        group: {},
        opts: {},
        previous: null,
        coming: null,
        current: null,
        isActive: !1,
        isOpen: !1,
        isOpened: !1,
        wrap: null,
        skin: null,
        outer: null,
        inner: null,
        player: {
            timer: null,
            isActive: !1
        },
        ajaxLoad: null,
        imgPreload: null,
        transitions: {},
        helpers: {},
        open: function(a, d) {
            if (a && (f.isPlainObject(d) || (d = {}), !1 !== b.close(!0))) return f.isArray(a) || (a = u(a) ? f(a).get() : [a]), f.each(a, function(e, c) {
                var l = {},
                    g, h, k, n, m;
                "object" === f.type(c) && (c.nodeType && (c = f(c)), u(c) ? (l = {
                        href: c.data("fancybox-href") || c.attr("href"),
                        title: f("<div/>").text(c.data("fancybox-title") || c.attr("title")).html(),
                        isDom: !0,
                        element: c
                    },
                    f.metadata && f.extend(!0, l, c.metadata())) : l = c);
                g = d.href || l.href || (r(c) ? c : null);
                h = d.title !== w ? d.title : l.title || "";
                n = (k = d.content || l.content) ? "html" : d.type || l.type;
                !n && l.isDom && (n = c.data("fancybox-type"), n || (n = (n = c.prop("class").match(/fancybox\.(\w+)/)) ? n[1] : null));
                r(g) && (n || (b.isImage(g) ? n = "image" : b.isSWF(g) ? n = "swf" : "#" === g.charAt(0) ? n = "inline" : r(c) && (n = "html", k = c)), "ajax" === n && (m = g.split(/\s+/, 2), g = m.shift(), m = m.shift()));
                k || ("inline" === n ? g ? k = f(r(g) ? g.replace(/.*(?=#[^\s]+$)/, "") : g) : l.isDom && (k = c) :
                    "html" === n ? k = g : n || g || !l.isDom || (n = "inline", k = c));
                f.extend(l, {
                    href: g,
                    type: n,
                    content: k,
                    title: h,
                    selector: m
                });
                a[e] = l
            }), b.opts = f.extend(!0, {}, b.defaults, d), d.keys !== w && (b.opts.keys = d.keys ? f.extend({}, b.defaults.keys, d.keys) : !1), b.group = a, b._start(b.opts.index)
        },
        cancel: function() {
            var a = b.coming;
            a && !1 === b.trigger("onCancel") || (b.hideLoading(), a && (b.ajaxLoad && b.ajaxLoad.abort(), b.ajaxLoad = null, b.imgPreload && (b.imgPreload.onload = b.imgPreload.onerror = null), a.wrap && a.wrap.stop(!0, !0).trigger("onReset").remove(),
                b.coming = null, b.current || b._afterZoomOut(a)))
        },
        close: function(a) {
            b.cancel();
            !1 !== b.trigger("beforeClose") && (b.unbindEvents(), b.isActive && (b.isOpen && !0 !== a ? (b.isOpen = b.isOpened = !1, b.isClosing = !0, f(".fancybox-item, .fancybox-nav").remove(), b.wrap.stop(!0, !0).removeClass("fancybox-opened"), b.transitions[b.current.closeMethod]()) : (f(".fancybox-wrap").stop(!0).trigger("onReset").remove(), b._afterZoomOut())))
        },
        play: function(a) {
            var d = function() {
                    clearTimeout(b.player.timer)
                },
                e = function() {
                    d();
                    b.current && b.player.isActive &&
                        (b.player.timer = setTimeout(b.next, b.current.playSpeed))
                },
                c = function() {
                    d();
                    p.unbind(".player");
                    b.player.isActive = !1;
                    b.trigger("onPlayEnd")
                };
            !0 === a || !b.player.isActive && !1 !== a ? b.current && (b.current.loop || b.current.index < b.group.length - 1) && (b.player.isActive = !0, p.bind({
                "onCancel.player beforeClose.player": c,
                "onUpdate.player": e,
                "beforeLoad.player": d
            }), e(), b.trigger("onPlayStart")) : c()
        },
        next: function(a) {
            var d = b.current;
            d && (r(a) || (a = d.direction.next), b.jumpto(d.index + 1, a, "next"))
        },
        prev: function(a) {
            var d =
                b.current;
            d && (r(a) || (a = d.direction.prev), b.jumpto(d.index - 1, a, "prev"))
        },
        jumpto: function(a, d, e) {
            var c = b.current;
            c && (a = m(a), b.direction = d || c.direction[a >= c.index ? "next" : "prev"], b.router = e || "jumpto", c.loop && (0 > a && (a = c.group.length + a % c.group.length), a %= c.group.length), c.group[a] !== w && (b.cancel(), b._start(a)))
        },
        reposition: function(a, d) {
            var e = b.current,
                c = e ? e.wrap : null,
                l;
            c && (l = b._getPosition(d), a && "scroll" === a.type ? (delete l.position, c.stop(!0, !0).animate(l, 200)) : (c.css(l), e.pos = f.extend({}, e.dim, l)))
        },
        update: function(a) {
            var d = a && a.originalEvent && a.originalEvent.type,
                e = !d || "orientationchange" === d;
            e && (clearTimeout(C), C = null);
            b.isOpen && !C && (C = setTimeout(function() {
                var c = b.current;
                c && !b.isClosing && (b.wrap.removeClass("fancybox-tmp"), (e || "load" === d || "resize" === d && c.autoResize) && b._setDimension(), "scroll" === d && c.canShrink || b.reposition(a), b.trigger("onUpdate"), C = null)
            }, e && !t ? 0 : 300))
        },
        toggle: function(a) {
            b.isOpen && (b.current.fitToView = "boolean" === f.type(a) ? a : !b.current.fitToView, t && (b.wrap.removeAttr("style").addClass("fancybox-tmp"),
                b.trigger("onUpdate")), b.update())
        },
        hideLoading: function() {
            p.unbind(".loading");
            f("#fancybox-loading").remove()
        },
        showLoading: function() {
            var a, d;
            b.hideLoading();
            a = f('<div id="fancybox-loading"><div></div></div>').click(b.cancel).appendTo("body");
            p.bind("keydown.loading", function(a) {
                27 === (a.which || a.keyCode) && (a.preventDefault(), b.cancel())
            });
            b.defaults.fixed || (d = b.getViewport(), a.css({
                position: "absolute",
                top: 0.5 * d.h + d.y,
                left: 0.5 * d.w + d.x
            }));
            b.trigger("onLoading")
        },
        getViewport: function() {
            var a = b.current &&
                b.current.locked || !1,
                d = {
                    x: q.scrollLeft(),
                    y: q.scrollTop()
                };
            a && a.length ? (d.w = a[0].clientWidth, d.h = a[0].clientHeight) : (d.w = t && s.innerWidth ? s.innerWidth : q.width(), d.h = t && s.innerHeight ? s.innerHeight : q.height());
            return d
        },
        unbindEvents: function() {
            b.wrap && u(b.wrap) && b.wrap.unbind(".fb");
            p.unbind(".fb");
            q.unbind(".fb")
        },
        bindEvents: function() {
            var a = b.current,
                d;
            a && (q.bind("orientationchange.fb" + (t ? "" : " resize.fb") + (a.autoCenter && !a.locked ? " scroll.fb" : ""), b.update), (d = a.keys) && p.bind("keydown.fb", function(e) {
                var c =
                    e.which || e.keyCode,
                    l = e.target || e.srcElement;
                if (27 === c && b.coming) return !1;
                e.ctrlKey || e.altKey || e.shiftKey || e.metaKey || l && (l.type || f(l).is("[contenteditable]")) || f.each(d, function(d, l) {
                    if (1 < a.group.length && l[c] !== w) return b[d](l[c]), e.preventDefault(), !1;
                    if (-1 < f.inArray(c, l)) return b[d](), e.preventDefault(), !1
                })
            }), f.fn.mousewheel && a.mouseWheel && b.wrap.bind("mousewheel.fb", function(d, c, l, g) {
                for (var h = f(d.target || null), k = !1; h.length && !(k || h.is(".fancybox-skin") || h.is(".fancybox-wrap"));) k = h[0] && !(h[0].style.overflow &&
                    "hidden" === h[0].style.overflow) && (h[0].clientWidth && h[0].scrollWidth > h[0].clientWidth || h[0].clientHeight && h[0].scrollHeight > h[0].clientHeight), h = f(h).parent();
                0 !== c && !k && 1 < b.group.length && !a.canShrink && (0 < g || 0 < l ? b.prev(0 < g ? "down" : "left") : (0 > g || 0 > l) && b.next(0 > g ? "up" : "right"), d.preventDefault())
            }))
        },
        trigger: function(a, d) {
            var e, c = d || b.coming || b.current;
            if (c) {
                f.isFunction(c[a]) && (e = c[a].apply(c, Array.prototype.slice.call(arguments, 1)));
                if (!1 === e) return !1;
                c.helpers && f.each(c.helpers, function(d, e) {
                    if (e &&
                        b.helpers[d] && f.isFunction(b.helpers[d][a])) b.helpers[d][a](f.extend(!0, {}, b.helpers[d].defaults, e), c)
                })
            }
            p.trigger(a)
        },
        isImage: function(a) {
            return r(a) && a.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i)
        },
        isSWF: function(a) {
            return r(a) && a.match(/\.(swf)((\?|#).*)?$/i)
        },
        _start: function(a) {
            var d = {},
                e, c;
            a = m(a);
            e = b.group[a] || null;
            if (!e) return !1;
            d = f.extend(!0, {}, b.opts, e);
            e = d.margin;
            c = d.padding;
            "number" === f.type(e) && (d.margin = [e, e, e, e]);
            "number" === f.type(c) && (d.padding = [c, c,
                c, c
            ]);
            d.modal && f.extend(!0, d, {
                closeBtn: !1,
                closeClick: !1,
                nextClick: !1,
                arrows: !1,
                mouseWheel: !1,
                keys: null,
                helpers: {
                    overlay: {
                        closeClick: !1
                    }
                }
            });
            d.autoSize && (d.autoWidth = d.autoHeight = !0);
            "auto" === d.width && (d.autoWidth = !0);
            "auto" === d.height && (d.autoHeight = !0);
            d.group = b.group;
            d.index = a;
            b.coming = d;
            if (!1 === b.trigger("beforeLoad")) b.coming = null;
            else {
                c = d.type;
                e = d.href;
                if (!c) return b.coming = null, b.current && b.router && "jumpto" !== b.router ? (b.current.index = a, b[b.router](b.direction)) : !1;
                b.isActive = !0;
                if ("image" ===
                    c || "swf" === c) d.autoHeight = d.autoWidth = !1, d.scrolling = "visible";
                "image" === c && (d.aspectRatio = !0);
                "iframe" === c && t && (d.scrolling = "scroll");
                d.wrap = f(d.tpl.wrap).addClass("fancybox-" + (t ? "mobile" : "desktop") + " fancybox-type-" + c + " fancybox-tmp " + d.wrapCSS).appendTo(d.parent || "body");
                f.extend(d, {
                    skin: f(".fancybox-skin", d.wrap),
                    outer: f(".fancybox-outer", d.wrap),
                    inner: f(".fancybox-inner", d.wrap)
                });
                f.each(["Top", "Right", "Bottom", "Left"], function(a, b) {
                    d.skin.css("padding" + b, x(d.padding[a]))
                });
                b.trigger("onReady");
                if ("inline" === c || "html" === c) {
                    if (!d.content || !d.content.length) return b._error("content")
                } else if (!e) return b._error("href");
                "image" === c ? b._loadImage() : "ajax" === c ? b._loadAjax() : "iframe" === c ? b._loadIframe() : b._afterLoad()
            }
        },
        _error: function(a) {
            f.extend(b.coming, {
                type: "html",
                autoWidth: !0,
                autoHeight: !0,
                minWidth: 0,
                minHeight: 0,
                scrolling: "no",
                hasError: a,
                content: b.coming.tpl.error
            });
            b._afterLoad()
        },
        _loadImage: function() {
            var a = b.imgPreload = new Image;
            a.onload = function() {
                this.onload = this.onerror = null;
                b.coming.width =
                    this.width / b.opts.pixelRatio;
                b.coming.height = this.height / b.opts.pixelRatio;
                b._afterLoad()
            };
            a.onerror = function() {
                this.onload = this.onerror = null;
                b._error("image")
            };
            a.src = b.coming.href;
            !0 !== a.complete && b.showLoading()
        },
        _loadAjax: function() {
            var a = b.coming;
            b.showLoading();
            b.ajaxLoad = f.ajax(f.extend({}, a.ajax, {
                url: a.href,
                error: function(a, e) {
                    b.coming && "abort" !== e ? b._error("ajax", a) : b.hideLoading()
                },
                success: function(d, e) {
                    "success" === e && (a.content = d, b._afterLoad())
                }
            }))
        },
        _loadIframe: function() {
            var a = b.coming,
                d = f(a.tpl.iframe.replace(/\{rnd\}/g, (new Date).getTime())).attr("scrolling", t ? "auto" : a.iframe.scrolling).attr("src", a.href);
            f(a.wrap).bind("onReset", function() {
                try {
                    f(this).find("iframe").hide().attr("src", "//about:blank").end().empty()
                } catch (a) {}
            });
            a.iframe.preload && (b.showLoading(), d.one("load", function() {
                f(this).data("ready", 1);
                t || f(this).bind("load.fb", b.update);
                f(this).parents(".fancybox-wrap").width("100%").removeClass("fancybox-tmp").show();
                b._afterLoad()
            }));
            a.content = d.appendTo(a.inner);
            a.iframe.preload ||
                b._afterLoad()
        },
        _preloadImages: function() {
            var a = b.group,
                d = b.current,
                e = a.length,
                c = d.preload ? Math.min(d.preload, e - 1) : 0,
                f, g;
            for (g = 1; g <= c; g += 1) f = a[(d.index + g) % e], "image" === f.type && f.href && ((new Image).src = f.href)
        },
        _afterLoad: function() {
            var a = b.coming,
                d = b.current,
                e, c, l, g, h;
            b.hideLoading();
            if (a && !1 !== b.isActive)
                if (!1 === b.trigger("afterLoad", a, d)) a.wrap.stop(!0).trigger("onReset").remove(), b.coming = null;
                else {
                    d && (b.trigger("beforeChange", d), d.wrap.stop(!0).removeClass("fancybox-opened").find(".fancybox-item, .fancybox-nav").remove());
                    b.unbindEvents();
                    e = a.content;
                    c = a.type;
                    l = a.scrolling;
                    f.extend(b, {
                        wrap: a.wrap,
                        skin: a.skin,
                        outer: a.outer,
                        inner: a.inner,
                        current: a,
                        previous: d
                    });
                    g = a.href;
                    switch (c) {
                        case "inline":
                        case "ajax":
                        case "html":
                            a.selector ? e = f("<div>").html(e).find(a.selector) : u(e) && (e.data("fancybox-placeholder") || e.data("fancybox-placeholder", f('<div class="fancybox-placeholder"></div>').insertAfter(e).hide()), e = e.show().detach(), a.wrap.bind("onReset", function() {
                                f(this).find(e).length && e.hide().replaceAll(e.data("fancybox-placeholder")).data("fancybox-placeholder", !1)
                            }));
                            break;
                        case "image":
                            e = a.tpl.image.replace(/\{href\}/g, g);
                            break;
                        case "swf":
                            e = '<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="' + g + '"></param>', h = "", f.each(a.swf, function(a, b) {
                                e += '<param name="' + a + '" value="' + b + '"></param>';
                                h += " " + a + '="' + b + '"'
                            }), e += '<embed src="' + g + '" type="application/x-shockwave-flash" width="100%" height="100%"' + h + "></embed></object>"
                    }
                    u(e) && e.parent().is(a.inner) || a.inner.append(e);
                    b.trigger("beforeShow");
                    a.inner.css("overflow", "yes" === l ? "scroll" : "no" === l ? "hidden" : l);
                    b._setDimension();
                    b.reposition();
                    b.isOpen = !1;
                    b.coming = null;
                    b.bindEvents();
                    if (!b.isOpened) f(".fancybox-wrap").not(a.wrap).stop(!0).trigger("onReset").remove();
                    else if (d.prevMethod) b.transitions[d.prevMethod]();
                    b.transitions[b.isOpened ? a.nextMethod : a.openMethod]();
                    b._preloadImages()
                }
        },
        _setDimension: function() {
            var a = b.getViewport(),
                d = 0,
                e = !1,
                c = !1,
                e = b.wrap,
                l = b.skin,
                g = b.inner,
                h = b.current,
                c = h.width,
                k = h.height,
                n = h.minWidth,
                v = h.minHeight,
                p = h.maxWidth,
                q = h.maxHeight,
                t = h.scrolling,
                r = h.scrollOutside ? h.scrollbarWidth : 0,
                y = h.margin,
                z = m(y[1] + y[3]),
                s = m(y[0] + y[2]),
                w, A, u, D, B, G, C, E, I;
            e.add(l).add(g).width("auto").height("auto").removeClass("fancybox-tmp");
            y = m(l.outerWidth(!0) - l.width());
            w = m(l.outerHeight(!0) - l.height());
            A = z + y;
            u = s + w;
            D = F(c) ? (a.w - A) * m(c) / 100 : c;
            B = F(k) ? (a.h - u) * m(k) / 100 : k;
            if ("iframe" === h.type) {
                if (I = h.content, h.autoHeight && 1 === I.data("ready")) try {
                    I[0].contentWindow.document.location && (g.width(D).height(9999), G = I.contents().find("body"), r && G.css("overflow-x",
                        "hidden"), B = G.outerHeight(!0))
                } catch (H) {}
            } else if (h.autoWidth || h.autoHeight) g.addClass("fancybox-tmp"), h.autoWidth || g.width(D), h.autoHeight || g.height(B), h.autoWidth && (D = g.width()), h.autoHeight && (B = g.height()), g.removeClass("fancybox-tmp");
            c = m(D);
            k = m(B);
            E = D / B;
            n = m(F(n) ? m(n, "w") - A : n);
            p = m(F(p) ? m(p, "w") - A : p);
            v = m(F(v) ? m(v, "h") - u : v);
            q = m(F(q) ? m(q, "h") - u : q);
            G = p;
            C = q;
            h.fitToView && (p = Math.min(a.w - A, p), q = Math.min(a.h - u, q));
            A = a.w - z;
            s = a.h - s;
            h.aspectRatio ? (c > p && (c = p, k = m(c / E)), k > q && (k = q, c = m(k * E)), c < n && (c = n, k = m(c /
                E)), k < v && (k = v, c = m(k * E))) : (c = Math.max(n, Math.min(c, p)), h.autoHeight && "iframe" !== h.type && (g.width(c), k = g.height()), k = Math.max(v, Math.min(k, q)));
            if (h.fitToView)
                if (g.width(c).height(k), e.width(c + y), a = e.width(), z = e.height(), h.aspectRatio)
                    for (;
                        (a > A || z > s) && c > n && k > v && !(19 < d++);) k = Math.max(v, Math.min(q, k - 10)), c = m(k * E), c < n && (c = n, k = m(c / E)), c > p && (c = p, k = m(c / E)), g.width(c).height(k), e.width(c + y), a = e.width(), z = e.height();
                else c = Math.max(n, Math.min(c, c - (a - A))), k = Math.max(v, Math.min(k, k - (z - s)));
            r && "auto" === t && k < B &&
                c + y + r < A && (c += r);
            g.width(c).height(k);
            e.width(c + y);
            a = e.width();
            z = e.height();
            e = (a > A || z > s) && c > n && k > v;
            c = h.aspectRatio ? c < G && k < C && c < D && k < B : (c < G || k < C) && (c < D || k < B);
            f.extend(h, {
                dim: {
                    width: x(a),
                    height: x(z)
                },
                origWidth: D,
                origHeight: B,
                canShrink: e,
                canExpand: c,
                wPadding: y,
                hPadding: w,
                wrapSpace: z - l.outerHeight(!0),
                skinSpace: l.height() - k
            });
            !I && h.autoHeight && k > v && k < q && !c && g.height("auto")
        },
        _getPosition: function(a) {
            var d = b.current,
                e = b.getViewport(),
                c = d.margin,
                f = b.wrap.width() + c[1] + c[3],
                g = b.wrap.height() + c[0] + c[2],
                c = {
                    position: "absolute",
                    top: c[0],
                    left: c[3]
                };
            d.autoCenter && d.fixed && !a && g <= e.h && f <= e.w ? c.position = "fixed" : d.locked || (c.top += e.y, c.left += e.x);
            c.top = x(Math.max(c.top, c.top + (e.h - g) * d.topRatio));
            c.left = x(Math.max(c.left, c.left + (e.w - f) * d.leftRatio));
            return c
        },
        _afterZoomIn: function() {
            var a = b.current;
            a && ((b.isOpen = b.isOpened = !0, b.wrap.css("overflow", "visible").addClass("fancybox-opened"), b.update(), (a.closeClick || a.nextClick && 1 < b.group.length) && b.inner.css("cursor", "pointer").bind("click.fb", function(d) {
                f(d.target).is("a") || f(d.target).parent().is("a") ||
                    (d.preventDefault(), b[a.closeClick ? "close" : "next"]())
            }), a.closeBtn && f(a.tpl.closeBtn).appendTo(b.skin).bind("click.fb", function(a) {
                a.preventDefault();
                b.close()
            }), a.arrows && 1 < b.group.length && ((a.loop || 0 < a.index) && f(a.tpl.prev).appendTo(b.outer).bind("click.fb", b.prev), (a.loop || a.index < b.group.length - 1) && f(a.tpl.next).appendTo(b.outer).bind("click.fb", b.next)), b.trigger("afterShow"), a.loop || a.index !== a.group.length - 1) ? b.opts.autoPlay && !b.player.isActive && (b.opts.autoPlay = !1, b.play(!0)) : b.play(!1))
        },
        _afterZoomOut: function(a) {
            a = a || b.current;
            f(".fancybox-wrap").trigger("onReset").remove();
            f.extend(b, {
                group: {},
                opts: {},
                router: !1,
                current: null,
                isActive: !1,
                isOpened: !1,
                isOpen: !1,
                isClosing: !1,
                wrap: null,
                skin: null,
                outer: null,
                inner: null
            });
            b.trigger("afterClose", a)
        }
    });
    b.transitions = {
        getOrigPosition: function() {
            var a = b.current,
                d = a.element,
                e = a.orig,
                c = {},
                f = 50,
                g = 50,
                h = a.hPadding,
                k = a.wPadding,
                n = b.getViewport();
            !e && a.isDom && d.is(":visible") && (e = d.find("img:first"), e.length || (e = d));
            u(e) ? (c = e.offset(), e.is("img") &&
                (f = e.outerWidth(), g = e.outerHeight())) : (c.top = n.y + (n.h - g) * a.topRatio, c.left = n.x + (n.w - f) * a.leftRatio);
            if ("fixed" === b.wrap.css("position") || a.locked) c.top -= n.y, c.left -= n.x;
            return c = {
                top: x(c.top - h * a.topRatio),
                left: x(c.left - k * a.leftRatio),
                width: x(f + k),
                height: x(g + h)
            }
        },
        step: function(a, d) {
            var e, c, f = d.prop;
            c = b.current;
            var g = c.wrapSpace,
                h = c.skinSpace;
            if ("width" === f || "height" === f) e = d.end === d.start ? 1 : (a - d.start) / (d.end - d.start), b.isClosing && (e = 1 - e), c = "width" === f ? c.wPadding : c.hPadding, c = a - c, b.skin[f](m("width" ===
                f ? c : c - g * e)), b.inner[f](m("width" === f ? c : c - g * e - h * e))
        },
        zoomIn: function() {
            var a = b.current,
                d = a.pos,
                e = a.openEffect,
                c = "elastic" === e,
                l = f.extend({
                    opacity: 1
                }, d);
            delete l.position;
            c ? (d = this.getOrigPosition(), a.openOpacity && (d.opacity = 0.1)) : "fade" === e && (d.opacity = 0.1);
            b.wrap.css(d).animate(l, {
                duration: "none" === e ? 0 : a.openSpeed,
                easing: a.openEasing,
                step: c ? this.step : null,
                complete: b._afterZoomIn
            })
        },
        zoomOut: function() {
            var a = b.current,
                d = a.closeEffect,
                e = "elastic" === d,
                c = {
                    opacity: 0.1
                };
            e && (c = this.getOrigPosition(), a.closeOpacity &&
                (c.opacity = 0.1));
            b.wrap.animate(c, {
                duration: "none" === d ? 0 : a.closeSpeed,
                easing: a.closeEasing,
                step: e ? this.step : null,
                complete: b._afterZoomOut
            })
        },
        changeIn: function() {
            var a = b.current,
                d = a.nextEffect,
                e = a.pos,
                c = {
                    opacity: 1
                },
                f = b.direction,
                g;
            e.opacity = 0.1;
            "elastic" === d && (g = "down" === f || "up" === f ? "top" : "left", "down" === f || "right" === f ? (e[g] = x(m(e[g]) - 200), c[g] = "+=200px") : (e[g] = x(m(e[g]) + 200), c[g] = "-=200px"));
            "none" === d ? b._afterZoomIn() : b.wrap.css(e).animate(c, {
                duration: a.nextSpeed,
                easing: a.nextEasing,
                complete: b._afterZoomIn
            })
        },
        changeOut: function() {
            var a = b.previous,
                d = a.prevEffect,
                e = {
                    opacity: 0.1
                },
                c = b.direction;
            "elastic" === d && (e["down" === c || "up" === c ? "top" : "left"] = ("up" === c || "left" === c ? "-" : "+") + "=200px");
            a.wrap.animate(e, {
                duration: "none" === d ? 0 : a.prevSpeed,
                easing: a.prevEasing,
                complete: function() {
                    f(this).trigger("onReset").remove()
                }
            })
        }
    };
    b.helpers.overlay = {
        defaults: {
            closeClick: !0,
            speedOut: 200,
            showEarly: !0,
            css: {},
            locked: !t,
            fixed: !0
        },
        overlay: null,
        fixed: !1,
        el: f("html"),
        create: function(a) {
            var d;
            a = f.extend({}, this.defaults, a);
            this.overlay &&
                this.close();
            d = b.coming ? b.coming.parent : a.parent;
            this.overlay = f('<div class="fancybox-overlay"></div>').appendTo(d && d.lenth ? d : "body");
            this.fixed = !1;
            a.fixed && b.defaults.fixed && (this.overlay.addClass("fancybox-overlay-fixed"), this.fixed = !0)
        },
        open: function(a) {
            var d = this;
            a = f.extend({}, this.defaults, a);
            this.overlay ? this.overlay.unbind(".overlay").width("auto").height("auto") : this.create(a);
            this.fixed || (q.bind("resize.overlay", f.proxy(this.update, this)), this.update());
            a.closeClick && this.overlay.bind("click.overlay",
                function(a) {
                    if (f(a.target).hasClass("fancybox-overlay")) return b.isActive ? b.close() : d.close(), !1
                });
            this.overlay.css(a.css).show()
        },
        close: function() {
            q.unbind("resize.overlay");
            this.el.hasClass("fancybox-lock") && (f(".fancybox-margin").removeClass("fancybox-margin"), this.el.removeClass("fancybox-lock"), q.scrollTop(this.scrollV).scrollLeft(this.scrollH));
            f(".fancybox-overlay").remove().hide();
            f.extend(this, {
                overlay: null,
                fixed: !1
            })
        },
        update: function() {
            var a = "100%",
                b;
            this.overlay.width(a).height("100%");
            J ? (b = Math.max(H.documentElement.offsetWidth, H.body.offsetWidth), p.width() > b && (a = p.width())) : p.width() > q.width() && (a = p.width());
            this.overlay.width(a).height(p.height())
        },
        onReady: function(a, b) {
            var e = this.overlay;
            f(".fancybox-overlay").stop(!0, !0);
            e || this.create(a);
            a.locked && this.fixed && b.fixed && (b.locked = this.overlay.append(b.wrap), b.fixed = !1);
            !0 === a.showEarly && this.beforeShow.apply(this, arguments)
        },
        beforeShow: function(a, b) {
            b.locked && !this.el.hasClass("fancybox-lock") && (!1 !== this.fixPosition && f("*").filter(function() {
                return "fixed" ===
                    f(this).css("position") && !f(this).hasClass("fancybox-overlay") && !f(this).hasClass("fancybox-wrap")
            }).addClass("fancybox-margin"), this.el.addClass("fancybox-margin"), this.scrollV = q.scrollTop(), this.scrollH = q.scrollLeft(), this.el.addClass("fancybox-lock"), q.scrollTop(this.scrollV).scrollLeft(this.scrollH));
            this.open(a)
        },
        onUpdate: function() {
            this.fixed || this.update()
        },
        afterClose: function(a) {
            this.overlay && !b.coming && this.overlay.fadeOut(a.speedOut, f.proxy(this.close, this))
        }
    };
    b.helpers.title = {
        defaults: {
            type: "float",
            position: "bottom"
        },
        beforeShow: function(a) {
            var d = b.current,
                e = d.title,
                c = a.type;
            f.isFunction(e) && (e = e.call(d.element, d));
            if (r(e) && "" !== f.trim(e)) {
                d = f('<div class="fancybox-title fancybox-title-' + c + '-wrap">' + e + "</div>");
                switch (c) {
                    case "inside":
                        c = b.skin;
                        break;
                    case "outside":
                        c = b.wrap;
                        break;
                    case "over":
                        c = b.inner;
                        break;
                    default:
                        c = b.skin, d.appendTo("body"), J && d.width(d.width()), d.wrapInner('<span class="child"></span>'), b.current.margin[2] += Math.abs(m(d.css("margin-bottom")))
                }
                d["top" === a.position ? "prependTo" :
                    "appendTo"](c)
            }
        }
    };
    f.fn.fancybox = function(a) {
        var d, e = f(this),
            c = this.selector || "",
            l = function(g) {
                var h = f(this).blur(),
                    k = d,
                    l, m;
                g.ctrlKey || g.altKey || g.shiftKey || g.metaKey || h.is(".fancybox-wrap") || (l = a.groupAttr || "data-fancybox-group", m = h.attr(l), m || (l = "rel", m = h.get(0)[l]), m && "" !== m && "nofollow" !== m && (h = c.length ? f(c) : e, h = h.filter("[" + l + '="' + m + '"]'), k = h.index(this)), a.index = k, !1 !== b.open(h, a) && g.preventDefault())
            };
        a = a || {};
        d = a.index || 0;
        c && !1 !== a.live ? p.undelegate(c, "click.fb-start").delegate(c + ":not('.fancybox-item, .fancybox-nav')",
            "click.fb-start", l) : e.unbind("click.fb-start").bind("click.fb-start", l);
        this.filter("[data-fancybox-start=1]").trigger("click");
        return this
    };
    p.ready(function() {
        var a, d;
        f.scrollbarWidth === w && (f.scrollbarWidth = function() {
            var a = f('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo("body"),
                b = a.children(),
                b = b.innerWidth() - b.height(99).innerWidth();
            a.remove();
            return b
        });
        f.support.fixedPosition === w && (f.support.fixedPosition = function() {
            var a = f('<div style="position:fixed;top:20px;"></div>').appendTo("body"),
                b = 20 === a[0].offsetTop || 15 === a[0].offsetTop;
            a.remove();
            return b
        }());
        f.extend(b.defaults, {
            scrollbarWidth: f.scrollbarWidth(),
            fixed: f.support.fixedPosition,
            parent: f("body")
        });
        a = f(s).width();
        K.addClass("fancybox-lock-test");
        d = f(s).width();
        K.removeClass("fancybox-lock-test");
        f("<style type='text/css'>.fancybox-margin{margin-right:" + (d - a) + "px;}</style>").appendTo("head")
    })
})(window, document, jQuery);






/*!
 * Media helper for fancyBox
 * version: 1.0.6 (Fri, 14 Jun 2013)
 * @requires fancyBox v2.0 or later
 *
 * Usage:
 *     $(".fancybox").fancybox({
 *         helpers : {
 *             media: true
 *         }
 *     });
 *
 * Set custom URL parameters:
 *     $(".fancybox").fancybox({
 *         helpers : {
 *             media: {
 *                 youtube : {
 *                     params : {
 *                         autoplay : 0
 *                     }
 *                 }
 *             }
 *         }
 *     });
 *
 * Or:
 *     $(".fancybox").fancybox({,
 *         helpers : {
 *             media: true
 *         },
 *         youtube : {
 *             autoplay: 0
 *         }
 *     });
 *
 *  Supports:
 *
 *      Youtube
 *          http://www.youtube.com/watch?v=opj24KnzrWo
 *          http://www.youtube.com/embed/opj24KnzrWo
 *          http://youtu.be/opj24KnzrWo
 *          http://www.youtube-nocookie.com/embed/opj24KnzrWo
 *      Vimeo
 *          http://vimeo.com/40648169
 *          http://vimeo.com/channels/staffpicks/38843628
 *          http://vimeo.com/groups/surrealism/videos/36516384
 *          http://player.vimeo.com/video/45074303
 *      Metacafe
 *          http://www.metacafe.com/watch/7635964/dr_seuss_the_lorax_movie_trailer/
 *          http://www.metacafe.com/watch/7635964/
 *      Dailymotion
 *          http://www.dailymotion.com/video/xoytqh_dr-seuss-the-lorax-premiere_people
 *      Twitvid
 *          http://twitvid.com/QY7MD
 *      Twitpic
 *          http://twitpic.com/7p93st
 *      Instagram
 *          http://instagr.am/p/IejkuUGxQn/
 *          http://instagram.com/p/IejkuUGxQn/
 *      Google maps
 *          http://maps.google.com/maps?q=Eiffel+Tower,+Avenue+Gustave+Eiffel,+Paris,+France&t=h&z=17
 *          http://maps.google.com/?ll=48.857995,2.294297&spn=0.007666,0.021136&t=m&z=16
 *          http://maps.google.com/?ll=48.859463,2.292626&spn=0.000965,0.002642&t=m&z=19&layer=c&cbll=48.859524,2.292532&panoid=YJ0lq28OOy3VT2IqIuVY0g&cbp=12,151.58,,0,-15.56
 */
(function ($) {
    "use strict";

    //Shortcut for fancyBox object
    var F = $.fancybox,
        format = function( url, rez, params ) {
            params = params || '';

            if ( $.type( params ) === "object" ) {
                params = $.param(params, true);
            }

            $.each(rez, function(key, value) {
                url = url.replace( '$' + key, value || '' );
            });

            if (params.length) {
                url += ( url.indexOf('?') > 0 ? '&' : '?' ) + params;
            }

            return url;
        };

    //Add helper object
    F.helpers.media = {
        defaults : {
            youtube : {
                matcher : /(youtube\.com|youtu\.be|youtube-nocookie\.com)\/(watch\?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&list=(.*)).*/i,
                params  : {
                    autoplay    : 1,
                    autohide    : 1,
                    fs          : 1,
                    rel         : 0,
                    hd          : 1,
                    wmode       : 'opaque',
                    enablejsapi : 1
                },
                type : 'iframe',
                url  : '//www.youtube.com/embed/$3'
            },
            vimeo : {
                matcher : /(?:vimeo(?:pro)?.com)\/(?:[^\d]+)?(\d+)(?:.*)/,
                params  : {
                    autoplay      : 1,
                    hd            : 1,
                    show_title    : 1,
                    show_byline   : 1,
                    show_portrait : 0,
                    fullscreen    : 1
                },
                type : 'iframe',
                url  : '//player.vimeo.com/video/$1'
            },
            metacafe : {
                matcher : /metacafe.com\/(?:watch|fplayer)\/([\w\-]{1,10})/,
                params  : {
                    autoPlay : 'yes'
                },
                type : 'swf',
                url  : function( rez, params, obj ) {
                    obj.swf.flashVars = 'playerVars=' + $.param( params, true );

                    return '//www.metacafe.com/fplayer/' + rez[1] + '/.swf';
                }
            },
            dailymotion : {
                matcher : /dailymotion.com\/video\/(.*)\/?(.*)/,
                params  : {
                    additionalInfos : 0,
                    autoStart : 1
                },
                type : 'swf',
                url  : '//www.dailymotion.com/swf/video/$1'
            },
            twitvid : {
                matcher : /twitvid\.com\/([a-zA-Z0-9_\-\?\=]+)/i,
                params  : {
                    autoplay : 0
                },
                type : 'iframe',
                url  : '//www.twitvid.com/embed.php?guid=$1'
            },
            twitpic : {
                matcher : /twitpic\.com\/(?!(?:place|photos|events)\/)([a-zA-Z0-9\?\=\-]+)/i,
                type : 'image',
                url  : '//twitpic.com/show/full/$1/'
            },
            instagram : {
                matcher : /(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/i,
                type : 'image',
                url  : '//$1/p/$2/media/?size=l'
            },
            google_maps : {
                matcher : /maps\.google\.([a-z]{2,3}(\.[a-z]{2})?)\/(\?ll=|maps\?)(.*)/i,
                type : 'iframe',
                url  : function( rez ) {
                    return '//maps.google.' + rez[1] + '/' + rez[3] + '' + rez[4] + '&output=' + (rez[4].indexOf('layer=c') > 0 ? 'svembed' : 'embed');
                }
            }
        },

        beforeLoad : function(opts, obj) {
            var url   = obj.href || '',
                type  = false,
                what,
                item,
                rez,
                params;

            for (what in opts) {
                if (opts.hasOwnProperty(what)) {
                    item = opts[ what ];
                    rez  = url.match( item.matcher );

                    if (rez) {
                        type   = item.type;
                        params = $.extend(true, {}, item.params, obj[ what ] || ($.isPlainObject(opts[ what ]) ? opts[ what ].params : null));

                        url = $.type( item.url ) === "function" ? item.url.call( this, rez, params, obj ) : format( item.url, rez, params );

                        break;
                    }
                }
            }

            if (type) {
                obj.href = url;
                obj.type = type;

                obj.autoHeight = false;
            }
        }
    };

}(jQuery));;/*
 * jQuery FlexSlider v2.2.2
 * Copyright 2012 WooThemes
 * Contributing Author: Tyler Smith
 */
;
(function ($) {

  //FlexSlider: Object Instance
  $.flexslider = function(el, options) {
    var slider = $(el);

    // making variables public
    slider.vars = $.extend({}, $.flexslider.defaults, options);

    var namespace = slider.vars.namespace,
        msGesture = window.navigator && window.navigator.msPointerEnabled && window.MSGesture,
        touch = (( "ontouchstart" in window ) || msGesture || window.DocumentTouch && document instanceof DocumentTouch) && slider.vars.touch,
        // depricating this idea, as devices are being released with both of these events
        //eventType = (touch) ? "touchend" : "click",
        eventType = "click touchend MSPointerUp",
        watchedEvent = "",
        watchedEventClearTimer,
        vertical = slider.vars.direction === "vertical",
        reverse = slider.vars.reverse,
        carousel = (slider.vars.itemWidth > 0),
        fade = slider.vars.animation === "fade",
        asNav = slider.vars.asNavFor !== "",
        methods = {},
        focused = true;

    // Store a reference to the slider object
    $.data(el, "flexslider", slider);

    // Private slider methods
    methods = {
      init: function() {
        slider.animating = false;
        // Get current slide and make sure it is a number
        slider.currentSlide = parseInt( ( slider.vars.startAt ? slider.vars.startAt : 0), 10 );
        if ( isNaN( slider.currentSlide ) ) slider.currentSlide = 0;
        slider.animatingTo = slider.currentSlide;
        slider.atEnd = (slider.currentSlide === 0 || slider.currentSlide === slider.last);
        slider.containerSelector = slider.vars.selector.substr(0,slider.vars.selector.search(' '));
        slider.slides = $(slider.vars.selector, slider);
        slider.container = $(slider.containerSelector, slider);
        slider.count = slider.slides.length;
        // SYNC:
        slider.syncExists = $(slider.vars.sync).length > 0;
        // SLIDE:
        if (slider.vars.animation === "slide") slider.vars.animation = "swing";
        slider.prop = (vertical) ? "top" : "marginLeft";
        slider.args = {};
        // SLIDESHOW:
        slider.manualPause = false;
        slider.stopped = false;
        //PAUSE WHEN INVISIBLE
        slider.started = false;
        slider.startTimeout = null;
        // TOUCH/USECSS:
        slider.transitions = !slider.vars.video && !fade && slider.vars.useCSS && (function() {
          var obj = document.createElement('div'),
              props = ['perspectiveProperty', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'];
          for (var i in props) {
            if ( obj.style[ props[i] ] !== undefined ) {
              slider.pfx = props[i].replace('Perspective','').toLowerCase();
              slider.prop = "-" + slider.pfx + "-transform";
              return true;
            }
          }
          return false;
        }());
        // CONTROLSCONTAINER:
        if (slider.vars.controlsContainer !== "") slider.controlsContainer = $(slider.vars.controlsContainer).length > 0 && $(slider.vars.controlsContainer);
        // MANUAL:
        if (slider.vars.manualControls !== "") slider.manualControls = $(slider.vars.manualControls).length > 0 && $(slider.vars.manualControls);

        // RANDOMIZE:
        if (slider.vars.randomize) {
          slider.slides.sort(function() { return (Math.round(Math.random())-0.5); });
          slider.container.empty().append(slider.slides);
        }

        slider.doMath();

        // INIT
        slider.setup("init");

        // CONTROLNAV:
        if (slider.vars.controlNav) methods.controlNav.setup();

        // DIRECTIONNAV:
        if (slider.vars.directionNav) methods.directionNav.setup();

        // KEYBOARD:
        if (slider.vars.keyboard && ($(slider.containerSelector).length === 1 || slider.vars.multipleKeyboard)) {
          $(document).bind('keyup', function(event) {
            var keycode = event.keyCode;
            if (!slider.animating && (keycode === 39 || keycode === 37)) {
              var target = (keycode === 39) ? slider.getTarget('next') :
                           (keycode === 37) ? slider.getTarget('prev') : false;
              slider.flexAnimate(target, slider.vars.pauseOnAction);
            }
          });
        }
        // MOUSEWHEEL:
        if (slider.vars.mousewheel) {
          slider.bind('mousewheel', function(event, delta, deltaX, deltaY) {
            event.preventDefault();
            var target = (delta < 0) ? slider.getTarget('next') : slider.getTarget('prev');
            slider.flexAnimate(target, slider.vars.pauseOnAction);
          });
        }

        // PAUSEPLAY
        if (slider.vars.pausePlay) methods.pausePlay.setup();

        //PAUSE WHEN INVISIBLE
        if (slider.vars.slideshow && slider.vars.pauseInvisible) methods.pauseInvisible.init();

        // SLIDSESHOW
        if (slider.vars.slideshow) {
          if (slider.vars.pauseOnHover) {
            slider.hover(function() {
              if (!slider.manualPlay && !slider.manualPause) slider.pause();
            }, function() {
              if (!slider.manualPause && !slider.manualPlay && !slider.stopped) slider.play();
            });
          }
          // initialize animation
          //If we're visible, or we don't use PageVisibility API
          if(!slider.vars.pauseInvisible || !methods.pauseInvisible.isHidden()) {
            (slider.vars.initDelay > 0) ? slider.startTimeout = setTimeout(slider.play, slider.vars.initDelay) : slider.play();
          }
        }

        // ASNAV:
        if (asNav) methods.asNav.setup();

        // TOUCH
        if (touch && slider.vars.touch) methods.touch();

        // FADE&&SMOOTHHEIGHT || SLIDE:
        if (!fade || (fade && slider.vars.smoothHeight)) $(window).bind("resize orientationchange focus", methods.resize);

        slider.find("img").attr("draggable", "false");

        // API: start() Callback
        setTimeout(function(){
          slider.vars.start(slider);
        }, 200);
      },
      asNav: {
        setup: function() {
          slider.asNav = true;
          slider.animatingTo = Math.floor(slider.currentSlide/slider.move);
          slider.currentItem = slider.currentSlide;
          slider.slides.removeClass(namespace + "active-slide").eq(slider.currentItem).addClass(namespace + "active-slide");
          if(!msGesture){
              slider.slides.on(eventType, function(e){
                e.preventDefault();
                var $slide = $(this),
                    target = $slide.index();
                var posFromLeft = $slide.offset().left - $(slider).scrollLeft(); // Find position of slide relative to left of slider container
                if( posFromLeft <= 0 && $slide.hasClass( namespace + 'active-slide' ) ) {
                  slider.flexAnimate(slider.getTarget("prev"), true);
                } else if (!$(slider.vars.asNavFor).data('flexslider').animating && !$slide.hasClass(namespace + "active-slide")) {
                  slider.direction = (slider.currentItem < target) ? "next" : "prev";
                  slider.flexAnimate(target, slider.vars.pauseOnAction, false, true, true);
                }
              });
          }else{
              el._slider = slider;
              slider.slides.each(function (){
                  var that = this;
                  that._gesture = new MSGesture();
                  that._gesture.target = that;
                  that.addEventListener("MSPointerDown", function (e){
                      e.preventDefault();
                      if(e.currentTarget._gesture)
                          e.currentTarget._gesture.addPointer(e.pointerId);
                  }, false);
                  that.addEventListener("MSGestureTap", function (e){
                      e.preventDefault();
                      var $slide = $(this),
                          target = $slide.index();
                      if (!$(slider.vars.asNavFor).data('flexslider').animating && !$slide.hasClass('active')) {
                          slider.direction = (slider.currentItem < target) ? "next" : "prev";
                          slider.flexAnimate(target, slider.vars.pauseOnAction, false, true, true);
                      }
                  });
              });
          }
        }
      },
      controlNav: {
        setup: function() {
          if (!slider.manualControls) {
            methods.controlNav.setupPaging();
          } else { // MANUALCONTROLS:
            methods.controlNav.setupManual();
          }
        },
        setupPaging: function() {
          var type = (slider.vars.controlNav === "thumbnails") ? 'control-thumbs' : 'control-paging',
              j = 1,
              item,
              slide;

          slider.controlNavScaffold = $('<ol class="'+ namespace + 'control-nav ' + namespace + type + '"></ol>');

          if (slider.pagingCount > 1) {
            for (var i = 0; i < slider.pagingCount; i++) {
              slide = slider.slides.eq(i);
              
              item = (slider.vars.controlNav === "thumbnails") ? '<img src="' + slider.slides.eq(i).attr("data-thumb") + '"/>' : '<a><i class="mk-icon-circle-blank"></i></a>';
              if ( 'thumbnails' === slider.vars.controlNav && true === slider.vars.thumbCaptions ) {
                var captn = slide.attr( 'data-thumbcaption' );
                if ( '' != captn && undefined != captn ) item += '<span class="' + namespace + 'caption">' + captn + '</span>';
              }
              slider.controlNavScaffold.append('<li>' + item + '</li>');
              j++;
            }
          }

          // CONTROLSCONTAINER:
          (slider.controlsContainer) ? $(slider.controlsContainer).append(slider.controlNavScaffold) : slider.append(slider.controlNavScaffold);
          methods.controlNav.set();

          methods.controlNav.active();

          slider.controlNavScaffold.delegate('a, img', eventType, function(event) {
            event.preventDefault();

            if (watchedEvent === "" || watchedEvent === event.type) {
              var $this = $(this),
                  target = slider.controlNav.index($this);

              if (!$this.hasClass(namespace + 'active')) {
                slider.direction = (target > slider.currentSlide) ? "next" : "prev";
                slider.flexAnimate(target, slider.vars.pauseOnAction);
              }
            }

            // setup flags to prevent event duplication
            if (watchedEvent === "") {
              watchedEvent = event.type;
            }
            methods.setToClearWatchedEvent();

          });
        },
        setupManual: function() {
          slider.controlNav = slider.manualControls;
          methods.controlNav.active();

          slider.controlNav.bind(eventType, function(event) {
            event.preventDefault();

            if (watchedEvent === "" || watchedEvent === event.type) {
              var $this = $(this),
                  target = slider.controlNav.index($this);

              if (!$this.hasClass(namespace + 'active')) {
                (target > slider.currentSlide) ? slider.direction = "next" : slider.direction = "prev";
                slider.flexAnimate(target, slider.vars.pauseOnAction);
              }
            }

            // setup flags to prevent event duplication
            if (watchedEvent === "") {
              watchedEvent = event.type;
            }
            methods.setToClearWatchedEvent();
          });
        },
        set: function() {
          var selector = (slider.vars.controlNav === "thumbnails") ? 'img' : 'a';
          slider.controlNav = $('.' + namespace + 'control-nav li ' + selector, (slider.controlsContainer) ? slider.controlsContainer : slider);
        },
        active: function() {
          slider.controlNav.removeClass(namespace + "active").eq(slider.animatingTo).addClass(namespace + "active");
        },
        update: function(action, pos) {
          if (slider.pagingCount > 1 && action === "add") {
            slider.controlNavScaffold.append($('<li><a>' + slider.count + '</a></li>'));
          } else if (slider.pagingCount === 1) {
            slider.controlNavScaffold.find('li').remove();
          } else {
            slider.controlNav.eq(pos).closest('li').remove();
          }
          methods.controlNav.set();
          (slider.pagingCount > 1 && slider.pagingCount !== slider.controlNav.length) ? slider.update(pos, action) : methods.controlNav.active();
        }
      },
      directionNav: {
        setup: function() {
          var directionNavScaffold = $('<ul class="' + namespace + 'direction-nav"><li><a class="' + namespace + 'prev" href="#">' + slider.vars.directionNavArrowsLeft + slider.vars.prevText + '</a></li><li><a class="' + namespace + 'next" href="#">' + slider.vars.directionNavArrowsRight + slider.vars.nextText + '</a></li></ul>');

          // CONTROLSCONTAINER:
          if (slider.controlsContainer) {
            $(slider.controlsContainer).append(directionNavScaffold);
            slider.directionNav = $('.' + namespace + 'direction-nav li a', slider.controlsContainer);
          } else {
            slider.append(directionNavScaffold);
            slider.directionNav = $('.' + namespace + 'direction-nav li a', slider);
          }

          methods.directionNav.update();

          slider.directionNav.bind(eventType, function(event) {
            event.preventDefault();
            var target;

            if (watchedEvent === "" || watchedEvent === event.type) {
              target = ($(this).hasClass(namespace + 'next')) ? slider.getTarget('next') : slider.getTarget('prev');
              slider.flexAnimate(target, slider.vars.pauseOnAction);
            }

            // setup flags to prevent event duplication
            if (watchedEvent === "") {
              watchedEvent = event.type;
            }
            methods.setToClearWatchedEvent();
          });
        },
        update: function() {
          var disabledClass = namespace + 'disabled';
          if (slider.pagingCount === 1) {
            slider.directionNav.addClass(disabledClass).attr('tabindex', '-1');
          } else if (!slider.vars.animationLoop) {
            if (slider.animatingTo === 0) {
              slider.directionNav.removeClass(disabledClass).filter('.' + namespace + "prev").addClass(disabledClass).attr('tabindex', '-1');
            } else if (slider.animatingTo === slider.last) {
              slider.directionNav.removeClass(disabledClass).filter('.' + namespace + "next").addClass(disabledClass).attr('tabindex', '-1');
            } else {
              slider.directionNav.removeClass(disabledClass).removeAttr('tabindex');
            }
          } else {
            slider.directionNav.removeClass(disabledClass).removeAttr('tabindex');
          }
        }
      },
      pausePlay: {
        setup: function() {
          var pausePlayScaffold = $('<div class="' + namespace + 'pauseplay"><a></a></div>');

          // CONTROLSCONTAINER:
          if (slider.controlsContainer) {
            slider.controlsContainer.append(pausePlayScaffold);
            slider.pausePlay = $('.' + namespace + 'pauseplay a', slider.controlsContainer);
          } else {
            slider.append(pausePlayScaffold);
            slider.pausePlay = $('.' + namespace + 'pauseplay a', slider);
          }

          methods.pausePlay.update((slider.vars.slideshow) ? namespace + 'pause' : namespace + 'play');

          slider.pausePlay.bind(eventType, function(event) {
            event.preventDefault();

            if (watchedEvent === "" || watchedEvent === event.type) {
              if ($(this).hasClass(namespace + 'pause')) {
                slider.manualPause = true;
                slider.manualPlay = false;
                slider.pause();
              } else {
                slider.manualPause = false;
                slider.manualPlay = true;
                slider.play();
              }
            }

            // setup flags to prevent event duplication
            if (watchedEvent === "") {
              watchedEvent = event.type;
            }
            methods.setToClearWatchedEvent();
          });
        },
        update: function(state) {
          (state === "play") ? slider.pausePlay.removeClass(namespace + 'pause').addClass(namespace + 'play').html(slider.vars.playText) : slider.pausePlay.removeClass(namespace + 'play').addClass(namespace + 'pause').html(slider.vars.pauseText);
        }
      },
      touch: function() {
        var startX,
          startY,
          offset,
          cwidth,
          dx,
          startT,
          scrolling = false,
          localX = 0,
          localY = 0,
          accDx = 0;

        if(!msGesture){
            el.addEventListener('touchstart', onTouchStart, false);

            function onTouchStart(e) {
              if (slider.animating) {
                e.preventDefault();
              } else if ( ( window.navigator.msPointerEnabled ) || e.touches.length === 1 ) {
                slider.pause();
                // CAROUSEL:
                cwidth = (vertical) ? slider.h : slider. w;
                startT = Number(new Date());
                // CAROUSEL:

                // Local vars for X and Y points.
                localX = e.touches[0].pageX;
                localY = e.touches[0].pageY;

                offset = (carousel && reverse && slider.animatingTo === slider.last) ? 0 :
                         (carousel && reverse) ? slider.limit - (((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo) :
                         (carousel && slider.currentSlide === slider.last) ? slider.limit :
                         (carousel) ? ((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.currentSlide :
                         (reverse) ? (slider.last - slider.currentSlide + slider.cloneOffset) * cwidth : (slider.currentSlide + slider.cloneOffset) * cwidth;
                startX = (vertical) ? localY : localX;
                startY = (vertical) ? localX : localY;

                el.addEventListener('touchmove', onTouchMove, false);
                el.addEventListener('touchend', onTouchEnd, false);
              }
            }

            function onTouchMove(e) {
              // Local vars for X and Y points.

              localX = e.touches[0].pageX;
              localY = e.touches[0].pageY;

              dx = (vertical) ? startX - localY : startX - localX;
              scrolling = (vertical) ? (Math.abs(dx) < Math.abs(localX - startY)) : (Math.abs(dx) < Math.abs(localY - startY));

              var fxms = 500;

              if ( ! scrolling || Number( new Date() ) - startT > fxms ) {
                e.preventDefault();
                if (!fade && slider.transitions) {
                  if (!slider.vars.animationLoop) {
                    dx = dx/((slider.currentSlide === 0 && dx < 0 || slider.currentSlide === slider.last && dx > 0) ? (Math.abs(dx)/cwidth+2) : 1);
                  }
                  slider.setProps(offset + dx, "setTouch");
                }
              }
            }

            function onTouchEnd(e) {
              // finish the touch by undoing the touch session
              el.removeEventListener('touchmove', onTouchMove, false);

              if (slider.animatingTo === slider.currentSlide && !scrolling && !(dx === null)) {
                var updateDx = (reverse) ? -dx : dx,
                    target = (updateDx > 0) ? slider.getTarget('next') : slider.getTarget('prev');

                if (slider.canAdvance(target) && (Number(new Date()) - startT < 550 && Math.abs(updateDx) > 50 || Math.abs(updateDx) > cwidth/2)) {
                  slider.flexAnimate(target, slider.vars.pauseOnAction);
                } else {
                  if (!fade) slider.flexAnimate(slider.currentSlide, slider.vars.pauseOnAction, true);
                }
              }
              el.removeEventListener('touchend', onTouchEnd, false);

              startX = null;
              startY = null;
              dx = null;
              offset = null;
            }
        }else{
            el.style.msTouchAction = "none";
            el._gesture = new MSGesture();
            el._gesture.target = el;
            el.addEventListener("MSPointerDown", onMSPointerDown, false);
            el._slider = slider;
            el.addEventListener("MSGestureChange", onMSGestureChange, false);
            el.addEventListener("MSGestureEnd", onMSGestureEnd, false);

            function onMSPointerDown(e){
                e.stopPropagation();
                if (slider.animating) {
                    e.preventDefault();
                }else{
                    slider.pause();
                    el._gesture.addPointer(e.pointerId);
                    accDx = 0;
                    cwidth = (vertical) ? slider.h : slider. w;
                    startT = Number(new Date());
                    // CAROUSEL:

                    offset = (carousel && reverse && slider.animatingTo === slider.last) ? 0 :
                        (carousel && reverse) ? slider.limit - (((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo) :
                            (carousel && slider.currentSlide === slider.last) ? slider.limit :
                                (carousel) ? ((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.currentSlide :
                                    (reverse) ? (slider.last - slider.currentSlide + slider.cloneOffset) * cwidth : (slider.currentSlide + slider.cloneOffset) * cwidth;
                }
            }

            function onMSGestureChange(e) {
                e.stopPropagation();
                var slider = e.target._slider;
                if(!slider){
                    return;
                }
                var transX = -e.translationX,
                    transY = -e.translationY;

                //Accumulate translations.
                accDx = accDx + ((vertical) ? transY : transX);
                dx = accDx;
                scrolling = (vertical) ? (Math.abs(accDx) < Math.abs(-transX)) : (Math.abs(accDx) < Math.abs(-transY));

                if(e.detail === e.MSGESTURE_FLAG_INERTIA){
                    setImmediate(function (){
                        el._gesture.stop();
                    });

                    return;
                }

                if (!scrolling || Number(new Date()) - startT > 500) {
                    e.preventDefault();
                    if (!fade && slider.transitions) {
                        if (!slider.vars.animationLoop) {
                            dx = accDx / ((slider.currentSlide === 0 && accDx < 0 || slider.currentSlide === slider.last && accDx > 0) ? (Math.abs(accDx) / cwidth + 2) : 1);
                        }
                        slider.setProps(offset + dx, "setTouch");
                    }
                }
            }

            function onMSGestureEnd(e) {
                e.stopPropagation();
                var slider = e.target._slider;
                if(!slider){
                    return;
                }
                if (slider.animatingTo === slider.currentSlide && !scrolling && !(dx === null)) {
                    var updateDx = (reverse) ? -dx : dx,
                        target = (updateDx > 0) ? slider.getTarget('next') : slider.getTarget('prev');

                    if (slider.canAdvance(target) && (Number(new Date()) - startT < 550 && Math.abs(updateDx) > 50 || Math.abs(updateDx) > cwidth/2)) {
                        slider.flexAnimate(target, slider.vars.pauseOnAction);
                    } else {
                        if (!fade) slider.flexAnimate(slider.currentSlide, slider.vars.pauseOnAction, true);
                    }
                }

                startX = null;
                startY = null;
                dx = null;
                offset = null;
                accDx = 0;
            }
        }
      },
      resize: function() {
        if (!slider.animating && slider.is(':visible')) {
          if (!carousel) slider.doMath();

          if (fade) {
            // SMOOTH HEIGHT:
            methods.smoothHeight();
          } else if (carousel) { //CAROUSEL:
            slider.slides.width(slider.computedW);
            slider.update(slider.pagingCount);
            slider.setProps();
          }
          else if (vertical) { //VERTICAL:
            slider.viewport.height(slider.h);
            slider.setProps(slider.h, "setTotal");
          } else {
            // SMOOTH HEIGHT:
            if (slider.vars.smoothHeight) methods.smoothHeight();
            slider.newSlides.width(slider.computedW);
            slider.setProps(slider.computedW, "setTotal");
          }
        }
      },
      smoothHeight: function(dur) {
        if (!vertical || fade) {
          var $obj = (fade) ? slider : slider.viewport;
          (dur) ? $obj.animate({"height": slider.slides.eq(slider.animatingTo).height()}, dur) : $obj.height(slider.slides.eq(slider.animatingTo).height());
        }
      },
      sync: function(action) {
        var $obj = $(slider.vars.sync).data("flexslider"),
            target = slider.animatingTo;

        switch (action) {
          case "animate": $obj.flexAnimate(target, slider.vars.pauseOnAction, false, true); break;
          case "play": if (!$obj.playing && !$obj.asNav) { $obj.play(); } break;
          case "pause": $obj.pause(); break;
        }
      },
      uniqueID: function($clone) {
        $clone.find( '[id]' ).each(function() {
          var $this = $(this);
          $this.attr( 'id', $this.attr( 'id' ) + '_clone' );
        });
        return $clone;
      },
      pauseInvisible: {
        visProp: null,
        init: function() {
          var prefixes = ['webkit','moz','ms','o'];

          if ('hidden' in document) return 'hidden';
          for (var i = 0; i < prefixes.length; i++) {
            if ((prefixes[i] + 'Hidden') in document)
            methods.pauseInvisible.visProp = prefixes[i] + 'Hidden';
          }
          if (methods.pauseInvisible.visProp) {
            var evtname = methods.pauseInvisible.visProp.replace(/[H|h]idden/,'') + 'visibilitychange';
            document.addEventListener(evtname, function() {
              if (methods.pauseInvisible.isHidden()) {
                if(slider.startTimeout) clearTimeout(slider.startTimeout); //If clock is ticking, stop timer and prevent from starting while invisible
                else slider.pause(); //Or just pause
              }
              else {
                if(slider.started) slider.play(); //Initiated before, just play
                else (slider.vars.initDelay > 0) ? setTimeout(slider.play, slider.vars.initDelay) : slider.play(); //Didn't init before: simply init or wait for it
              }
            });
          }
        },
        isHidden: function() {
          return document[methods.pauseInvisible.visProp] || false;
        }
      },
      setToClearWatchedEvent: function() {
        clearTimeout(watchedEventClearTimer);
        watchedEventClearTimer = setTimeout(function() {
          watchedEvent = "";
        }, 3000);
      }
    };

    // public methods
    slider.flexAnimate = function(target, pause, override, withSync, fromNav) {
      if (!slider.vars.animationLoop && target !== slider.currentSlide) {
        slider.direction = (target > slider.currentSlide) ? "next" : "prev";
      }

      if (asNav && slider.pagingCount === 1) slider.direction = (slider.currentItem < target) ? "next" : "prev";

      if (!slider.animating && (slider.canAdvance(target, fromNav) || override) && slider.is(":visible")) {
        if (asNav && withSync) {
          var master = $(slider.vars.asNavFor).data('flexslider');
          slider.atEnd = target === 0 || target === slider.count - 1;
          master.flexAnimate(target, true, false, true, fromNav);
          slider.direction = (slider.currentItem < target) ? "next" : "prev";
          master.direction = slider.direction;

          if (Math.ceil((target + 1)/slider.visible) - 1 !== slider.currentSlide && target !== 0) {
            slider.currentItem = target;
            slider.slides.removeClass(namespace + "active-slide").eq(target).addClass(namespace + "active-slide");
            target = Math.floor(target/slider.visible);
          } else {
            slider.currentItem = target;
            slider.slides.removeClass(namespace + "active-slide").eq(target).addClass(namespace + "active-slide");
            return false;
          }
        }

        slider.animating = true;
        slider.animatingTo = target;

        // SLIDESHOW:
        if (pause) slider.pause();

        // API: before() animation Callback
        slider.vars.before(slider);

        // SYNC:
        if (slider.syncExists && !fromNav) methods.sync("animate");

        // CONTROLNAV
        if (slider.vars.controlNav) methods.controlNav.active();

        // !CAROUSEL:
        // CANDIDATE: slide active class (for add/remove slide)
        if (!carousel) slider.slides.removeClass(namespace + 'active-slide').eq(target).addClass(namespace + 'active-slide');

        // INFINITE LOOP:
        // CANDIDATE: atEnd
        slider.atEnd = target === 0 || target === slider.last;

        // DIRECTIONNAV:
        if (slider.vars.directionNav) methods.directionNav.update();

        if (target === slider.last) {
          // API: end() of cycle Callback
          slider.vars.end(slider);
          // SLIDESHOW && !INFINITE LOOP:
          if (!slider.vars.animationLoop) slider.pause();
        }

        // SLIDE:
        if (!fade) {
          var dimension = (vertical) ? slider.slides.filter(':first').height() : slider.computedW,
              margin, slideString, calcNext;

          // INFINITE LOOP / REVERSE:
          if (carousel) {
            //margin = (slider.vars.itemWidth > slider.w) ? slider.vars.itemMargin * 2 : slider.vars.itemMargin;
            margin = slider.vars.itemMargin;
            calcNext = ((slider.itemW + margin) * slider.move) * slider.animatingTo;
            slideString = (calcNext > slider.limit && slider.visible !== 1) ? slider.limit : calcNext;
          } else if (slider.currentSlide === 0 && target === slider.count - 1 && slider.vars.animationLoop && slider.direction !== "next") {
            slideString = (reverse) ? (slider.count + slider.cloneOffset) * dimension : 0;
          } else if (slider.currentSlide === slider.last && target === 0 && slider.vars.animationLoop && slider.direction !== "prev") {
            slideString = (reverse) ? 0 : (slider.count + 1) * dimension;
          } else {
            slideString = (reverse) ? ((slider.count - 1) - target + slider.cloneOffset) * dimension : (target + slider.cloneOffset) * dimension;
          }
          slider.setProps(slideString, "", slider.vars.animationSpeed);
          if (slider.transitions) {
            if (!slider.vars.animationLoop || !slider.atEnd) {
              slider.animating = false;
              slider.currentSlide = slider.animatingTo;
            }
            slider.container.unbind("webkitTransitionEnd transitionend");
            slider.container.bind("webkitTransitionEnd transitionend", function() {
              slider.wrapup(dimension);
            });
          } else {
            slider.container.animate(slider.args, slider.vars.animationSpeed, slider.vars.easing, function(){
              slider.wrapup(dimension);
            });
          }
        } else { // FADE:
          if (!touch) {
            //slider.slides.eq(slider.currentSlide).fadeOut(slider.vars.animationSpeed, slider.vars.easing);
            //slider.slides.eq(target).fadeIn(slider.vars.animationSpeed, slider.vars.easing, slider.wrapup);

            slider.slides.eq(slider.currentSlide).css({"zIndex": 1}).animate({"opacity": 0}, slider.vars.animationSpeed, slider.vars.easing);
            slider.slides.eq(target).css({"zIndex": 2}).animate({"opacity": 1}, slider.vars.animationSpeed, slider.vars.easing, slider.wrapup);

          } else {
            slider.slides.eq(slider.currentSlide).css({ "opacity": 0, "zIndex": 1 });
            slider.slides.eq(target).css({ "opacity": 1, "zIndex": 2 });
            slider.wrapup(dimension);
          }
        }
        // SMOOTH HEIGHT:
        if (slider.vars.smoothHeight) methods.smoothHeight(slider.vars.animationSpeed);
      }
    };
    slider.wrapup = function(dimension) {
      // SLIDE:
      if (!fade && !carousel) {
        if (slider.currentSlide === 0 && slider.animatingTo === slider.last && slider.vars.animationLoop) {
          slider.setProps(dimension, "jumpEnd");
        } else if (slider.currentSlide === slider.last && slider.animatingTo === 0 && slider.vars.animationLoop) {
          slider.setProps(dimension, "jumpStart");
        }
      }
      slider.animating = false;
      slider.currentSlide = slider.animatingTo;
      // API: after() animation Callback
      slider.vars.after(slider);
    };

    // SLIDESHOW:
    slider.animateSlides = function() {
      if (!slider.animating && focused ) slider.flexAnimate(slider.getTarget("next"));
    };
    // SLIDESHOW:
    slider.pause = function() {
      clearInterval(slider.animatedSlides);
      slider.animatedSlides = null;
      slider.playing = false;
      // PAUSEPLAY:
      if (slider.vars.pausePlay) methods.pausePlay.update("play");
      // SYNC:
      if (slider.syncExists) methods.sync("pause");
    };
    // SLIDESHOW:
    slider.play = function() {
      if (slider.playing) clearInterval(slider.animatedSlides);
      slider.animatedSlides = slider.animatedSlides || setInterval(slider.animateSlides, slider.vars.slideshowSpeed);
      slider.started = slider.playing = true;
      // PAUSEPLAY:
      if (slider.vars.pausePlay) methods.pausePlay.update("pause");
      // SYNC:
      if (slider.syncExists) methods.sync("play");
    };
    // STOP:
    slider.stop = function () {
      slider.pause();
      slider.stopped = true;
    };
    slider.canAdvance = function(target, fromNav) {
      // ASNAV:
      var last = (asNav) ? slider.pagingCount - 1 : slider.last;
      return (fromNav) ? true :
             (asNav && slider.currentItem === slider.count - 1 && target === 0 && slider.direction === "prev") ? true :
             (asNav && slider.currentItem === 0 && target === slider.pagingCount - 1 && slider.direction !== "next") ? false :
             (target === slider.currentSlide && !asNav) ? false :
             (slider.vars.animationLoop) ? true :
             (slider.atEnd && slider.currentSlide === 0 && target === last && slider.direction !== "next") ? false :
             (slider.atEnd && slider.currentSlide === last && target === 0 && slider.direction === "next") ? false :
             true;
    };
    slider.getTarget = function(dir) {
      slider.direction = dir;
      if (dir === "next") {
        return (slider.currentSlide === slider.last) ? 0 : slider.currentSlide + 1;
      } else {
        return (slider.currentSlide === 0) ? slider.last : slider.currentSlide - 1;
      }
    };

    // SLIDE:
    slider.setProps = function(pos, special, dur) {
      var target = (function() {
        var posCheck = (pos) ? pos : ((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo,
            posCalc = (function() {
              if (carousel) {
                return (special === "setTouch") ? pos :
                       (reverse && slider.animatingTo === slider.last) ? 0 :
                       (reverse) ? slider.limit - (((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo) :
                       (slider.animatingTo === slider.last) ? slider.limit : posCheck;
              } else {
                switch (special) {
                  case "setTotal": return (reverse) ? ((slider.count - 1) - slider.currentSlide + slider.cloneOffset) * pos : (slider.currentSlide + slider.cloneOffset) * pos;
                  case "setTouch": return (reverse) ? pos : pos;
                  case "jumpEnd": return (reverse) ? pos : slider.count * pos;
                  case "jumpStart": return (reverse) ? slider.count * pos : pos;
                  default: return pos;
                }
              }
            }());

            return (posCalc * -1) + "px";
          }());

      if (slider.transitions) {
        target = (vertical) ? "translate3d(0," + target + ",0)" : "translate3d(" + target + ",0,0)";
        dur = (dur !== undefined) ? (dur/1000) + "s" : "0s";
        slider.container.css("-" + slider.pfx + "-transition-duration", dur);
         slider.container.css("transition-duration", dur);
      }

      slider.args[slider.prop] = target;
      if (slider.transitions || dur === undefined) slider.container.css(slider.args);

      slider.container.css('transform',target);
    };

    slider.setup = function(type) {
      // SLIDE:
      if (!fade) {
        var sliderOffset, arr;

        if (type === "init") {
          slider.viewport = $('<div class="' + namespace + 'viewport"></div>').css({"overflow": "hidden", "position": "relative"}).appendTo(slider).append(slider.container);
          // INFINITE LOOP:
          slider.cloneCount = 0;
          slider.cloneOffset = 0;
          // REVERSE:
          if (reverse) {
            arr = $.makeArray(slider.slides).reverse();
            slider.slides = $(arr);
            slider.container.empty().append(slider.slides);
          }
        }
        // INFINITE LOOP && !CAROUSEL:
        if (slider.vars.animationLoop && !carousel) {
          slider.cloneCount = 2;
          slider.cloneOffset = 1;
          // clear out old clones
          if (type !== "init") slider.container.find('.clone').remove();
          slider.container.append(slider.slides.first().clone().addClass('clone').attr('aria-hidden', 'true')).prepend(slider.slides.last().clone().addClass('clone').attr('aria-hidden', 'true'));
                      methods.uniqueID( slider.slides.first().clone().addClass('clone') ).appendTo( slider.container );
                      methods.uniqueID( slider.slides.last().clone().addClass('clone') ).prependTo( slider.container );
        }
        slider.newSlides = $(slider.vars.selector, slider);

        sliderOffset = (reverse) ? slider.count - 1 - slider.currentSlide + slider.cloneOffset : slider.currentSlide + slider.cloneOffset;
        // VERTICAL:
        if (vertical && !carousel) {
          slider.container.height((slider.count + slider.cloneCount) * 200 + "%").css("position", "absolute").width("100%");
          setTimeout(function(){
            slider.newSlides.css({"display": "block"});
            slider.doMath();
            slider.viewport.height(slider.h);
            slider.setProps(sliderOffset * slider.h, "init");
          }, (type === "init") ? 100 : 0);
        } else {
          slider.container.width((slider.count + slider.cloneCount) * 200 + "%");
          slider.setProps(sliderOffset * slider.computedW, "init");
          setTimeout(function(){
            slider.doMath();
            slider.newSlides.css({"width": slider.computedW, "float": "left", "display": "block"});
            // SMOOTH HEIGHT:
            if (slider.vars.smoothHeight) methods.smoothHeight();
          }, (type === "init") ? 100 : 0);
        }
      } else { // FADE:
        slider.slides.css({"width": "100%", "float": "left", "marginRight": "-100%", "position": "relative"});
        if (type === "init") {
          if (!touch) {
            //slider.slides.eq(slider.currentSlide).fadeIn(slider.vars.animationSpeed, slider.vars.easing);
            slider.slides.css({ "opacity": 0, "display": "block", "zIndex": 1 }).eq(slider.currentSlide).css({"zIndex": 2}).animate({"opacity": 1},slider.vars.animationSpeed,slider.vars.easing);
          } else {
            slider.slides.css({ "opacity": 0, "display": "block", "webkitTransition": "opacity " + slider.vars.animationSpeed / 1000 + "s ease", "zIndex": 1 }).eq(slider.currentSlide).css({ "opacity": 1, "zIndex": 2});
          }
        }
        // SMOOTH HEIGHT:
        if (slider.vars.smoothHeight) methods.smoothHeight();
      }
      // !CAROUSEL:
      // CANDIDATE: active slide
      if (!carousel) slider.slides.removeClass(namespace + "active-slide").eq(slider.currentSlide).addClass(namespace + "active-slide");

      //FlexSlider: init() Callback
      slider.vars.init(slider);
    };

    slider.doMath = function() {
      var slide = slider.slides.first(),
          slideMargin = slider.vars.itemMargin,
          minItems = slider.vars.minItems,
          maxItems = slider.vars.maxItems;

      slider.w = (slider.viewport===undefined) ? slider.width() : slider.viewport.width();
      slider.h = slide.height();
      slider.boxPadding = slide.outerWidth() - slide.width();

      // CAROUSEL:
      if (carousel) {
        slider.itemT = slider.vars.itemWidth + slideMargin;
        slider.minW = (minItems) ? minItems * slider.itemT : slider.w;
        slider.maxW = (maxItems) ? (maxItems * slider.itemT) - slideMargin : slider.w;
        slider.itemW = (slider.minW > slider.w) ? (slider.w - (slideMargin * (minItems - 1)))/minItems :
                       (slider.maxW < slider.w) ? (slider.w - (slideMargin * (maxItems - 1)))/maxItems :
                       (slider.vars.itemWidth > slider.w) ? slider.w : slider.vars.itemWidth;

        slider.visible = Math.floor(slider.w/(slider.itemW));
        slider.move = (slider.vars.move > 0 && slider.vars.move < slider.visible ) ? slider.vars.move : slider.visible;
        slider.pagingCount = Math.ceil(((slider.count - slider.visible)/slider.move) + 1);
        slider.last =  slider.pagingCount - 1;
        slider.limit = (slider.pagingCount === 1) ? 0 :
                       (slider.vars.itemWidth > slider.w) ? (slider.itemW * (slider.count - 1)) + (slideMargin * (slider.count - 1)) : ((slider.itemW + slideMargin) * slider.count) - slider.w - slideMargin;
      } else {
        slider.itemW = slider.w;
        slider.pagingCount = slider.count;
        slider.last = slider.count - 1;
      }
      slider.computedW = slider.itemW - slider.boxPadding;
    };

    slider.update = function(pos, action) {
      slider.doMath();

      // update currentSlide and slider.animatingTo if necessary
      if (!carousel) {
        if (pos < slider.currentSlide) {
          slider.currentSlide += 1;
        } else if (pos <= slider.currentSlide && pos !== 0) {
          slider.currentSlide -= 1;
        }
        slider.animatingTo = slider.currentSlide;
      }

      // update controlNav
      if (slider.vars.controlNav && !slider.manualControls) {
        if ((action === "add" && !carousel) || slider.pagingCount > slider.controlNav.length) {
          methods.controlNav.update("add");
        } else if ((action === "remove" && !carousel) || slider.pagingCount < slider.controlNav.length) {
          if (carousel && slider.currentSlide > slider.last) {
            slider.currentSlide -= 1;
            slider.animatingTo -= 1;
          }
          methods.controlNav.update("remove", slider.last);
        }
      }
      // update directionNav
      if (slider.vars.directionNav) methods.directionNav.update();

    };

    slider.addSlide = function(obj, pos) {
      var $obj = $(obj);

      slider.count += 1;
      slider.last = slider.count - 1;

      // append new slide
      if (vertical && reverse) {
        (pos !== undefined) ? slider.slides.eq(slider.count - pos).after($obj) : slider.container.prepend($obj);
      } else {
        (pos !== undefined) ? slider.slides.eq(pos).before($obj) : slider.container.append($obj);
      }

      // update currentSlide, animatingTo, controlNav, and directionNav
      slider.update(pos, "add");

      // update slider.slides
      slider.slides = $(slider.vars.selector + ':not(.clone)', slider);
      // re-setup the slider to accomdate new slide
      slider.setup();

      //FlexSlider: added() Callback
      slider.vars.added(slider);
    };
    slider.removeSlide = function(obj) {
      var pos = (isNaN(obj)) ? slider.slides.index($(obj)) : obj;

      // update count
      slider.count -= 1;
      slider.last = slider.count - 1;

      // remove slide
      if (isNaN(obj)) {
        $(obj, slider.slides).remove();
      } else {
        (vertical && reverse) ? slider.slides.eq(slider.last).remove() : slider.slides.eq(obj).remove();
      }

      // update currentSlide, animatingTo, controlNav, and directionNav
      slider.doMath();
      slider.update(pos, "remove");

      // update slider.slides
      slider.slides = $(slider.vars.selector + ':not(.clone)', slider);
      // re-setup the slider to accomdate new slide
      slider.setup();

      // FlexSlider: removed() Callback
      slider.vars.removed(slider);
    };

    //FlexSlider: Initialize
    methods.init();
  };

  // Ensure the slider isn't focussed if the window loses focus.
  $( window ).blur( function ( e ) {
    focused = false;
  }).focus( function ( e ) {
    focused = true;
  });

  //FlexSlider: Default Settings
  $.flexslider.defaults = {
    namespace: "flex-",             //{NEW} String: Prefix string attached to the class of every element generated by the plugin
    selector: ".slides > li",       //{NEW} Selector: Must match a simple pattern. '{container} > {slide}' -- Ignore pattern at your own peril
    animation: "fade",              //String: Select your animation type, "fade" or "slide"
    easing: "swing",                //{NEW} String: Determines the easing method used in jQuery transitions. jQuery easing plugin is supported!
    direction: "horizontal",        //String: Select the sliding direction, "horizontal" or "vertical"
    reverse: false,                 //{NEW} Boolean: Reverse the animation direction
    animationLoop: true,            //Boolean: Should the animation loop? If false, directionNav will received "disable" classes at either end
    smoothHeight: true,            //{NEW} Boolean: Allow height of the slider to animate smoothly in horizontal mode
    startAt: 0,                     //Integer: The slide that the slider should start on. Array notation (0 = first slide)
    slideshow: true,                //Boolean: Animate slider automatically
    slideshowSpeed: 7000,           //Integer: Set the speed of the slideshow cycling, in milliseconds
    animationSpeed: 600,            //Integer: Set the speed of animations, in milliseconds
    initDelay: 0,                   //{NEW} Integer: Set an initialization delay, in milliseconds
    randomize: false,               //Boolean: Randomize slide order
    thumbCaptions: false,           //Boolean: Whether or not to put captions on thumbnails when using the "thumbnails" controlNav.

    // Usability features
    pauseOnAction: true,            //Boolean: Pause the slideshow when interacting with control elements, highly recommended.
    pauseOnHover: false,            //Boolean: Pause the slideshow when hovering over slider, then resume when no longer hovering
    pauseInvisible: true,               //{NEW} Boolean: Pause the slideshow when tab is invisible, resume when visible. Provides better UX, lower CPU usage.
    useCSS: true,                   //{NEW} Boolean: Slider will use CSS3 transitions if available
    touch: true,                    //{NEW} Boolean: Allow touch swipe navigation of the slider on touch-enabled devices
    video: false,                   //{NEW} Boolean: If using video in the slider, will prevent CSS3 3D Transforms to avoid graphical glitches

    // Primary Controls
    controlNav: true,               //Boolean: Create navigation for paging control of each clide? Note: Leave true for manualControls usage
    directionNav: true,             //Boolean: Create navigation for previous/next navigation? (true/false)
    prevText: "Previous",           //String: Set the text for the "previous" directionNav item
    nextText: "Next",               //String: Set the text for the "next" directionNav item
    directionNavArrowsLeft: '<i class="mk-jupiter-icon-arrow-left"></i>',
    directionNavArrowsRight: '<i class="mk-jupiter-icon-arrow-right"></i>',

    // Secondary Navigation
    keyboard: true,                 //Boolean: Allow slider navigating via keyboard left/right keys
    multipleKeyboard: false,        //{NEW} Boolean: Allow keyboard navigation to affect multiple sliders. Default behavior cuts out keyboard navigation with more than one slider present.
    mousewheel: false,              //{UPDATED} Boolean: Requires jquery.mousewheel.js (https://github.com/brandonaaron/jquery-mousewheel) - Allows slider navigating via mousewheel
    pausePlay: false,               //Boolean: Create pause/play dynamic element
    pauseText: "Pause",             //String: Set the text for the "pause" pausePlay item
    playText: "Play",               //String: Set the text for the "play" pausePlay item

    // Special properties
    controlsContainer: "",          //{UPDATED} jQuery Object/Selector: Declare which container the navigation elements should be appended too. Default container is the FlexSlider element. Example use would be $(".flexslider-container"). Property is ignored if given element is not found.
    manualControls: "",             //{UPDATED} jQuery Object/Selector: Declare custom control navigation. Examples would be $(".flex-control-nav li") or "#tabs-nav li img", etc. The number of elements in your controlNav should match the number of slides/tabs.
    sync: "",                       //{NEW} Selector: Mirror the actions performed on this slider with another slider. Use with care.
    asNavFor: "",                   //{NEW} Selector: Internal property exposed for turning the slider into a thumbnail navigation for another slider

    // Carousel Options
    itemWidth: 0,                   //{NEW} Integer: Box-model width of individual carousel items, including horizontal borders and padding.
    itemMargin: 0,                  //{NEW} Integer: Margin between carousel items.
    minItems: 1,                    //{NEW} Integer: Minimum number of carousel items that should be visible. Items will resize fluidly when below this.
    maxItems: 0,                    //{NEW} Integer: Maxmimum number of carousel items that should be visible. Items will resize fluidly when above this limit.
    move: 0,                        //{NEW} Integer: Number of carousel items that should move on animation. If 0, slider will move all visible items.
    allowOneSlide: true,           //{NEW} Boolean: Whether or not to allow a slider comprised of a single slide

    // Callback API
    start: function(){},            //Callback: function(slider) - Fires when the slider loads the first slide
    before: function(){},           //Callback: function(slider) - Fires asynchronously with each slider animation
    after: function(){},            //Callback: function(slider) - Fires after each slider animation completes
    end: function(){},              //Callback: function(slider) - Fires when the slider reaches the last slide (asynchronous)
    added: function(){},            //{NEW} Callback: function(slider) - Fires after a slide is added
    removed: function(){},           //{NEW} Callback: function(slider) - Fires after a slide is removed
    init: function() {}             //{NEW} Callback: function(slider) - Fires after the slider is initially setup
  };

  //FlexSlider: Plugin Function
  $.fn.flexslider = function(options) {
    if (options === undefined) options = {};

    if (typeof options === "object") {
      return this.each(function() {
        var $this = $(this),
            selector = (options.selector) ? options.selector : ".slides > li",
            $slides = $this.find(selector);

      if ( ( $slides.length === 1 && options.allowOneSlide === true ) || $slides.length === 0 ) {
          $slides.fadeIn(400);
          if (options.start) options.start($this);
        } else if ($this.data('flexslider') === undefined) {
          new $.flexslider(this, options);
        }
      });
    } else {
      // Helper strings to quickly perform functions on the slider
      var $slider = $(this).data('flexslider');
      switch (options) {
        case "play": $slider.play(); break;
        case "pause": $slider.pause(); break;
        case "stop": $slider.stop(); break;
        case "next": $slider.flexAnimate($slider.getTarget("next"), true); break;
        case "prev":
        case "previous": $slider.flexAnimate($slider.getTarget("prev"), true); break;
        default: if (typeof options === "number") $slider.flexAnimate(options, true);
      }
    }
  };
})(jQuery);
;;(function ( $, window) {

  // Defaults
  var pluginName = "header",
    defaults = {
      headerNavigationContainer: 'mk-header-nav-container',
      headerPaddingWrapper: 'mk-header-padding-wrapper',
      innerHeaderClass: 'mk-header-inner',
      headerToolbarClass: 'mk-header-toolbar',
      classicStyleNavigationClass: 'mk-header-nav-container',
      fixHeaderClass: 'mk-fixed'
    };

  // The actual plugin constructor
  function Header( element, options ) {
    this.element = element;

    //merge options and defaults
    this.options = $.extend( {}, defaults, options) ;

    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  }

  Header.prototype = {

    init: function() {

        var that = this;

        new ChopScroll(function () {
          if (that.shouldListenToScroll()) {
            return;
          }

          that.makeSuitableHeader();
          that.options.onScrollCallback();

        }, 10);

    },

    /**
    * Check whether should we listen to scroll event or not
    * @returns {Boolean}
    */
    shouldListenToScroll: function() {
        return is_touch_device() || 
            mk_header_sticky === false || 
            $(window).width() < mk_responsive_nav_width;
    },

    /**
    * Check whether header toolbar exists or not
    * @returns {Boolean}
    */
    isHeaderToolbarExists: function() {
        var headerToolbarClass = '.' + this.options.headerToolbarClass;
        return $.exists(headerToolbarClass);
    },
    /**
    * Check whether wp-admin bar exists or not
    * @returns {Boolean}
    */
    isWpAdminbarExists: function() {
        return $.exists('#wpadminbar');
    },

    /**
    * Check whether we should use classic navigation
    * @returns {Boolean}
    */
    isClassicNavigation: function() {
        var element = this.element,
            classicStyleNavigationClass = this.options.classicStyleNavigationClass;

        return $(element).hasClass(classicStyleNavigationClass);
    },
    /**
    * Check whether header navigation is fix or not
    * @returns {Boolean}
    */
    isHeaderNavigationFixed: function() {
        var headerNavigationContainer = '.' + this.options.headerNavigationContainer,
            fixHeaderClass = this.options.fixHeaderClass;
        return $(headerNavigationContainer).hasClass(fixHeaderClass);
    },

    /**
    * Check whether inner header is fix or not
    * @returns {Boolean}
    */
    isInnerHeaderFixed: function() {
        var innerHeaderClass = '.' + this.options.innerHeaderClass,
            fixHeaderClass = this.options.fixHeaderClass;
        return $(innerHeaderClass).hasClass(fixHeaderClass);
    },

    /**
    * Get header toolbar height
    * @returns {Number}
    */
    getHeaderToolbarHeight: function() {
        var headerToolbarClass = '.' + this.options.headerToolbarClass;
        return parseInt($(headerToolbarClass).height());
    },

    /**
    * Get admin bar height
    * @returns {Number}
    */
    getWpAdminbarHeight: function() {
        return parseInt($("#wpadminbar").height());
    },

    /**
    * Get header height from its data-attribute
    * @returns {Number}
    * @see http://api.jquery.com/data/
    */
    getHeaderHeight: function() {
        var element = this.element;
        return parseInt($(element).data('height'));
    },

    /**
    * Get inner header height from its data-attribute
    * @returns {Number}
    */
    getInnerHeaderHeight: function() {
        var innerHeaderClass = '.' + this.options.innerHeaderClass;
        return parseInt($(innerHeaderClass).height());
    },

    /**
    * Get header height from its data-attribute
    * @returns {Number}
    * @see http://api.jquery.com/data/
    */
    getStickyHeaderHeight: function() {
        var element = this.element;
        return parseInt($(element).data('sticky-height'));
        //return parseInt($('.mk-header-inner').height());
    },

    /**
    * Calculate appropriate height of wp-admin bar
    * @returns {Number}
    */
    calculateAdminbarHeight: function() {
        var wp_admin_height = 0;
        if (this.isWpAdminbarExists()) {
            wp_admin_height = this.getWpAdminbarHeight();
            if (!this.isHeaderToolbarExists() && !this.isClassicNavigation()) {
                wp_admin_height = 0;
            }
        }
        if (!this.isWpAdminbarExists() && this.isHeaderToolbarExists() 
            && !this.isClassicNavigation()) {
            wp_admin_height = this.getHeaderToolbarHeight();
        }
        return wp_admin_height;
    },

    /**
    * Calculate limit height
    * @returns {Number}
    */
    getScrollLimit: function() {
        var mk_limit_height = 0;
        if (this.isClassicNavigation()) {
            mk_limit_height = this.calculateAdminbarHeight() + (this.getHeaderHeight() * 2);
        } else {
            mk_limit_height = this.calculateAdminbarHeight();

        }
        return mk_limit_height;
    },

    /**
    * Use $.scrollTop() method to get current scroll position
    * @returns {Number}
    * @see http://api.jquery.com/scrolltop/
    */
    getScrollPosition: function() {
        return $(window).scrollTop();
    },

    /**
    * Check whether current scroll position passed limited height or not
    * @example 
    *   mk_window_y = current scroll position
    *   mk_limit_height = 40px
    *   we should fix header after 40px scroll of window
    *   so mk_window_y should be greather than mk_limit_height
    */
    isFarEnough: function(currentScrollPosition, scrollLimit) {
        return currentScrollPosition > scrollLimit;
    },

    /**
    * Make suitable header based on classic navigation and modern navigation option
    */
    makeSuitableHeader: function() {
        if (this.isClassicNavigation()) {
            this.makeClassicHeader();
        } else {
            this.makeModernHeader();
        }
    },

    /**
    * Make classic header and fix it
    */
    makeClassicHeader: function() {

        var mk_header_height = this.getInnerHeaderHeight(),
            wp_admin_height = this.calculateAdminbarHeight();

        this.stickHeader(mk_header_height, wp_admin_height);
    },

    /**
    * Calculate appropritae top space
    * @returns {Object}
    */
    calculateTopSpace: function() {

        var distance = 0,
            padding = 0;

        if (this.isWpAdminbarExists()) {
            distance = this.getScrollLimit();
            if (!this.isHeaderToolbarExists()) {
                distance = this.getWpAdminbarHeight();
                padding = this.getHeaderHeight();
            } else {
                padding = $('.mk-header-inner').height();
            }

        } else {
            if (!this.isHeaderToolbarExists()) {
                padding = this.getHeaderHeight();
            } else {
                padding = $('.mk-header-inner').height();
            }
        }
        //console.log(padding);
        return {
            distance: distance,
            padding: padding
        }
    },

    /**
    * Update header elements properties
    */
    updateHeaderElements: function() {

        var header_els = $('.menu-hover-style-1 .main-navigation-ul > li > a,' +
            '.menu-hover-style-2 .main-navigation-ul > li > a,' +
            '.menu-hover-style-4 .main-navigation-ul > li > a,' +
            //'#mk-header.header-style-3 .main-navigation-ul > li > a,' +
            '.header-style-1 .menu-hover-style-3 .main-navigation-ul > li,' +
            '.mk-header-inner #mk-header-search,' +
            '#mk-header .mk-header-inner .mk-header-start-tour,' +
            '.header-style-1 .mk-header-inner,' +
            '.header-style-3 .mk-header-inner,' +
            '.header-style-3 .header-logo,' +
            '#mk-header.header-style-1 .mk-search-trigger i,' +
            '#mk-header.header-style-1 .mk-search-trigger,' +
            '.shopping-cart-header');

        var limitHeight = this.getHeaderHeight() - this.getStickyHeaderHeight(),
            mk_window_y = this.getScrollPosition(),
            newHeight = 0;

        if ($(window).width() > mk_responsive_nav_width) {
            if (mk_window_y < limitHeight) {
                newHeight = this.getHeaderHeight() - mk_window_y;
            } else {
                newHeight = this.getStickyHeaderHeight();
            }
            header_els.css({
                height: newHeight + 'px',
                lineHeight: newHeight + 'px'
            });
        }
    },

    /**
    * Stick header to the top
    */
    stickHeader: function(padding, distance) {

        var headerPaddingWrapper = '.' + this.options.headerPaddingWrapper,
            innerHeaderClass = '.' + this.options.innerHeaderClass,
            headerToolbarClass = '.' + this.options.headerToolbarClass;

        var mk_window_y = this.getScrollPosition(),
            mk_limit_height = this.getScrollLimit();

        if (this.isFarEnough(mk_window_y, mk_limit_height)) {
            if (!this.isInnerHeaderFixed()) {
                $(headerPaddingWrapper).css("padding-top", padding + 'px');
                $(innerHeaderClass).addClass(this.options.fixHeaderClass).css({
                     "top": distance
                });
            }
        } else {
            if (this.isInnerHeaderFixed()) {
                $(headerToolbarClass).show();
                $(innerHeaderClass).css({
                    "top": 0
                }).removeClass(this.options.fixHeaderClass);
                $(headerPaddingWrapper).css("padding-top", "");
            }
        }
    },

    /**
    * Make modern header and fix it
    */
    makeModernHeader: function() {
        var topSpace = this.calculateTopSpace();
        this.stickHeader(topSpace.padding, topSpace.distance);
        this.updateHeaderElements();
    }

  };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function ( options ) {
    return this.each(function () {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName,
          new Header( this, options ));
      }
    });
  };

})( jQuery, window );;/*!
 * hoverIntent v1.8.0 // 2014.06.29 // jQuery v1.9.1+
 * http://cherne.net/brian/resources/jquery.hoverIntent.html
 *
 * You may use hoverIntent under the terms of the MIT license. Basically that
 * means you are free to use hoverIntent as long as this header is left intact.
 * Copyright 2007, 2014 Brian Cherne
 */
(function($){$.fn.hoverIntent=function(handlerIn,handlerOut,selector){var cfg={interval:100,sensitivity:6,timeout:0};if(typeof handlerIn==="object"){cfg=$.extend(cfg,handlerIn)}else{if($.isFunction(handlerOut)){cfg=$.extend(cfg,{over:handlerIn,out:handlerOut,selector:selector})}else{cfg=$.extend(cfg,{over:handlerIn,out:handlerIn,selector:handlerOut})}}var cX,cY,pX,pY;var track=function(ev){cX=ev.pageX;cY=ev.pageY};var compare=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);if(Math.sqrt((pX-cX)*(pX-cX)+(pY-cY)*(pY-cY))<cfg.sensitivity){$(ob).off("mousemove.hoverIntent",track);ob.hoverIntent_s=true;return cfg.over.apply(ob,[ev])}else{pX=cX;pY=cY;ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}};var delay=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);ob.hoverIntent_s=false;return cfg.out.apply(ob,[ev])};var handleHover=function(e){var ev=$.extend({},e);var ob=this;if(ob.hoverIntent_t){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t)}if(e.type==="mouseenter"){pX=ev.pageX;pY=ev.pageY;$(ob).on("mousemove.hoverIntent",track);if(!ob.hoverIntent_s){ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}}else{$(ob).off("mousemove.hoverIntent",track);if(ob.hoverIntent_s){ob.hoverIntent_t=setTimeout(function(){delay(ev,ob)},cfg.timeout)}}};return this.on({"mouseenter.hoverIntent":handleHover,"mouseleave.hoverIntent":handleHover},cfg.selector)}})(jQuery);;/*!
 * imagesLoaded PACKAGED v3.1.8
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

(function(){function e(){}function t(e,t){for(var n=e.length;n--;)if(e[n].listener===t)return n;return-1}function n(e){return function(){return this[e].apply(this,arguments)}}var i=e.prototype,r=this,o=r.EventEmitter;i.getListeners=function(e){var t,n,i=this._getEvents();if("object"==typeof e){t={};for(n in i)i.hasOwnProperty(n)&&e.test(n)&&(t[n]=i[n])}else t=i[e]||(i[e]=[]);return t},i.flattenListeners=function(e){var t,n=[];for(t=0;e.length>t;t+=1)n.push(e[t].listener);return n},i.getListenersAsObject=function(e){var t,n=this.getListeners(e);return n instanceof Array&&(t={},t[e]=n),t||n},i.addListener=function(e,n){var i,r=this.getListenersAsObject(e),o="object"==typeof n;for(i in r)r.hasOwnProperty(i)&&-1===t(r[i],n)&&r[i].push(o?n:{listener:n,once:!1});return this},i.on=n("addListener"),i.addOnceListener=function(e,t){return this.addListener(e,{listener:t,once:!0})},i.once=n("addOnceListener"),i.defineEvent=function(e){return this.getListeners(e),this},i.defineEvents=function(e){for(var t=0;e.length>t;t+=1)this.defineEvent(e[t]);return this},i.removeListener=function(e,n){var i,r,o=this.getListenersAsObject(e);for(r in o)o.hasOwnProperty(r)&&(i=t(o[r],n),-1!==i&&o[r].splice(i,1));return this},i.off=n("removeListener"),i.addListeners=function(e,t){return this.manipulateListeners(!1,e,t)},i.removeListeners=function(e,t){return this.manipulateListeners(!0,e,t)},i.manipulateListeners=function(e,t,n){var i,r,o=e?this.removeListener:this.addListener,s=e?this.removeListeners:this.addListeners;if("object"!=typeof t||t instanceof RegExp)for(i=n.length;i--;)o.call(this,t,n[i]);else for(i in t)t.hasOwnProperty(i)&&(r=t[i])&&("function"==typeof r?o.call(this,i,r):s.call(this,i,r));return this},i.removeEvent=function(e){var t,n=typeof e,i=this._getEvents();if("string"===n)delete i[e];else if("object"===n)for(t in i)i.hasOwnProperty(t)&&e.test(t)&&delete i[t];else delete this._events;return this},i.removeAllListeners=n("removeEvent"),i.emitEvent=function(e,t){var n,i,r,o,s=this.getListenersAsObject(e);for(r in s)if(s.hasOwnProperty(r))for(i=s[r].length;i--;)n=s[r][i],n.once===!0&&this.removeListener(e,n.listener),o=n.listener.apply(this,t||[]),o===this._getOnceReturnValue()&&this.removeListener(e,n.listener);return this},i.trigger=n("emitEvent"),i.emit=function(e){var t=Array.prototype.slice.call(arguments,1);return this.emitEvent(e,t)},i.setOnceReturnValue=function(e){return this._onceReturnValue=e,this},i._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},i._getEvents=function(){return this._events||(this._events={})},e.noConflict=function(){return r.EventEmitter=o,e},"function"==typeof define&&define.amd?define("eventEmitter/EventEmitter",[],function(){return e}):"object"==typeof module&&module.exports?module.exports=e:this.EventEmitter=e}).call(this),function(e){function t(t){var n=e.event;return n.target=n.target||n.srcElement||t,n}var n=document.documentElement,i=function(){};n.addEventListener?i=function(e,t,n){e.addEventListener(t,n,!1)}:n.attachEvent&&(i=function(e,n,i){e[n+i]=i.handleEvent?function(){var n=t(e);i.handleEvent.call(i,n)}:function(){var n=t(e);i.call(e,n)},e.attachEvent("on"+n,e[n+i])});var r=function(){};n.removeEventListener?r=function(e,t,n){e.removeEventListener(t,n,!1)}:n.detachEvent&&(r=function(e,t,n){e.detachEvent("on"+t,e[t+n]);try{delete e[t+n]}catch(i){e[t+n]=void 0}});var o={bind:i,unbind:r};"function"==typeof define&&define.amd?define("eventie/eventie",o):e.eventie=o}(this),function(e,t){"function"==typeof define&&define.amd?define(["eventEmitter/EventEmitter","eventie/eventie"],function(n,i){return t(e,n,i)}):"object"==typeof exports?module.exports=t(e,require("wolfy87-eventemitter"),require("eventie")):e.imagesLoaded=t(e,e.EventEmitter,e.eventie)}(window,function(e,t,n){function i(e,t){for(var n in t)e[n]=t[n];return e}function r(e){return"[object Array]"===d.call(e)}function o(e){var t=[];if(r(e))t=e;else if("number"==typeof e.length)for(var n=0,i=e.length;i>n;n++)t.push(e[n]);else t.push(e);return t}function s(e,t,n){if(!(this instanceof s))return new s(e,t);"string"==typeof e&&(e=document.querySelectorAll(e)),this.elements=o(e),this.options=i({},this.options),"function"==typeof t?n=t:i(this.options,t),n&&this.on("always",n),this.getImages(),a&&(this.jqDeferred=new a.Deferred);var r=this;setTimeout(function(){r.check()})}function f(e){this.img=e}function c(e){this.src=e,v[e]=this}var a=e.jQuery,u=e.console,h=u!==void 0,d=Object.prototype.toString;s.prototype=new t,s.prototype.options={},s.prototype.getImages=function(){this.images=[];for(var e=0,t=this.elements.length;t>e;e++){var n=this.elements[e];"IMG"===n.nodeName&&this.addImage(n);var i=n.nodeType;if(i&&(1===i||9===i||11===i))for(var r=n.querySelectorAll("img"),o=0,s=r.length;s>o;o++){var f=r[o];this.addImage(f)}}},s.prototype.addImage=function(e){var t=new f(e);this.images.push(t)},s.prototype.check=function(){function e(e,r){return t.options.debug&&h&&u.log("confirm",e,r),t.progress(e),n++,n===i&&t.complete(),!0}var t=this,n=0,i=this.images.length;if(this.hasAnyBroken=!1,!i)return this.complete(),void 0;for(var r=0;i>r;r++){var o=this.images[r];o.on("confirm",e),o.check()}},s.prototype.progress=function(e){this.hasAnyBroken=this.hasAnyBroken||!e.isLoaded;var t=this;setTimeout(function(){t.emit("progress",t,e),t.jqDeferred&&t.jqDeferred.notify&&t.jqDeferred.notify(t,e)})},s.prototype.complete=function(){var e=this.hasAnyBroken?"fail":"done";this.isComplete=!0;var t=this;setTimeout(function(){if(t.emit(e,t),t.emit("always",t),t.jqDeferred){var n=t.hasAnyBroken?"reject":"resolve";t.jqDeferred[n](t)}})},a&&(a.fn.imagesLoaded=function(e,t){var n=new s(this,e,t);return n.jqDeferred.promise(a(this))}),f.prototype=new t,f.prototype.check=function(){var e=v[this.img.src]||new c(this.img.src);if(e.isConfirmed)return this.confirm(e.isLoaded,"cached was confirmed"),void 0;if(this.img.complete&&void 0!==this.img.naturalWidth)return this.confirm(0!==this.img.naturalWidth,"naturalWidth"),void 0;var t=this;e.on("confirm",function(e,n){return t.confirm(e.isLoaded,n),!0}),e.check()},f.prototype.confirm=function(e,t){this.isLoaded=e,this.emit("confirm",this,t)};var v={};return c.prototype=new t,c.prototype.check=function(){if(!this.isChecked){var e=new Image;n.bind(e,"load",this),n.bind(e,"error",this),e.src=this.src,this.isChecked=!0}},c.prototype.handleEvent=function(e){var t="on"+e.type;this[t]&&this[t](e)},c.prototype.onload=function(e){this.confirm(!0,"onload"),this.unbindProxyEvents(e)},c.prototype.onerror=function(e){this.confirm(!1,"onerror"),this.unbindProxyEvents(e)},c.prototype.confirm=function(e,t){this.isConfirmed=!0,this.isLoaded=e,this.emit("confirm",this,t)},c.prototype.unbindProxyEvents=function(e){n.unbind(e.target,"load",this),n.unbind(e.target,"error",this)},s});;/*global jQuery: true */

/*!
   --------------------------------
   Infinite Scroll
   --------------------------------
   + https://github.com/paulirish/infinite-scroll
   + version 2.1.0
   + Copyright 2011/12 Paul Irish & Luke Shumard
   + Licensed under the MIT license

   + Documentation: http://infinite-scroll.com/
*/

// Uses AMD or browser globals to create a jQuery plugin.
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($, undefined) {
    'use strict';

    $.infinitescroll = function infscr(options, callback, element) {
        this.element = $(element);

        // Flag the object in the event of a failed creation
        if (!this._create(options, callback)) {
            this.failed = true;
        }
    };

    $.infinitescroll.defaults = {
        loading: {
            finished: undefined,
            finishedMsg: "<em>Congratulations, you've reached the end of the internet.</em>",
            img: 'data:image/gif;base64,R0lGODlh3AATAPQeAPDy+MnQ6LW/4N3h8MzT6rjC4sTM5r/I5NHX7N7j8c7U6tvg8OLl8uXo9Ojr9b3G5MfP6Ovu9tPZ7PT1+vX2+tbb7vf4+8/W69jd7rC73vn5/O/x+K243ai02////wAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQECgD/ACwAAAAA3AATAAAF/6AnjmRpnmiqrmzrvnAsz3Rt33iu73zv/8CgcEj0BAScpHLJbDqf0Kh0Sq1ar9isdioItAKGw+MAKYMFhbF63CW438f0mg1R2O8EuXj/aOPtaHx7fn96goR4hmuId4qDdX95c4+RBIGCB4yAjpmQhZN0YGYGXitdZBIVGAsLoq4BBKQDswm1CQRkcG6ytrYKubq8vbfAcMK9v7q7EMO1ycrHvsW6zcTKsczNz8HZw9vG3cjTsMIYqQkCLBwHCgsMDQ4RDAYIqfYSFxDxEfz88/X38Onr16+Bp4ADCco7eC8hQYMAEe57yNCew4IVBU7EGNDiRn8Z831cGLHhSIgdFf9chIeBg7oA7gjaWUWTVQAGE3LqBDCTlc9WOHfm7PkTqNCh54rePDqB6M+lR536hCpUqs2gVZM+xbrTqtGoWqdy1emValeXKzggYBBB5y1acFNZmEvXAoN2cGfJrTv3bl69Ffj2xZt3L1+/fw3XRVw4sGDGcR0fJhxZsF3KtBTThZxZ8mLMgC3fRatCbYMNFCzwLEqLgE4NsDWs/tvqdezZf13Hvk2A9Szdu2X3pg18N+68xXn7rh1c+PLksI/Dhe6cuO3ow3NfV92bdArTqC2Ebd3A8vjf5QWfH6Bg7Nz17c2fj69+fnq+8N2Lty+fuP78/eV2X13neIcCeBRwxorbZrA1ANoCDGrgoG8RTshahQ9iSKEEzUmYIYfNWViUhheCGJyIP5E4oom7WWjgCeBFAJNv1DVV01MAdJhhjdkplWNzO/5oXI846njjVEIqR2OS2B1pE5PVscajkxhMycqLJghQSwT40PgfAl4GqNSXYdZXJn5gSkmmmmJu1aZYb14V51do+pTOCmA40AqVCIhG5IJ9PvYnhIFOxmdqhpaI6GeHCtpooisuutmg+Eg62KOMKuqoTaXgicQWoIYq6qiklmoqFV0UoeqqrLbq6quwxirrrLTWauutJ4QAACH5BAUKABwALAcABADOAAsAAAX/IPd0D2dyRCoUp/k8gpHOKtseR9yiSmGbuBykler9XLAhkbDavXTL5k2oqFqNOxzUZPU5YYZd1XsD72rZpBjbeh52mSNnMSC8lwblKZGwi+0QfIJ8CncnCoCDgoVnBHmKfByGJimPkIwtiAeBkH6ZHJaKmCeVnKKTHIihg5KNq4uoqmEtcRUtEREMBggtEr4QDrjCuRC8h7/BwxENeicSF8DKy82pyNLMOxzWygzFmdvD2L3P0dze4+Xh1Arkyepi7dfFvvTtLQkZBC0T/FX3CRgCMOBHsJ+EHYQY7OinAGECgQsB+Lu3AOK+CewcWjwxQeJBihtNGHSoQOE+iQ3//4XkwBBhRZMcUS6YSXOAwIL8PGqEaSJCiYt9SNoCmnJPAgUVLChdaoFBURN8MAzl2PQphwQLfDFd6lTowglHve6rKpbjhK7/pG5VinZP1qkiz1rl4+tr2LRwWU64cFEihwEtZgbgR1UiHaMVvxpOSwBA37kzGz9e8G+B5MIEKLutOGEsAH2ATQwYfTmuX8aETWdGPZmiZcccNSzeTCA1Sw0bdiitC7LBWgu8jQr8HRzqgpK6gX88QbrB14z/kF+ELpwB8eVQj/JkqdylAudji/+ts3039vEEfK8Vz2dlvxZKG0CmbkKDBvllRd6fCzDvBLKBDSCeffhRJEFebFk1k/Mv9jVIoIJZSeBggwUaNeB+Qk34IE0cXlihcfRxkOAJFFhwGmKlmWDiakZhUJtnLBpnWWcnKaAZcxI0piFGGLBm1mc90kajSCveeBVWKeYEoU2wqeaQi0PetoE+rr14EpVC7oAbAUHqhYExbn2XHHsVqbcVew9tx8+XJKk5AZsqqdlddGpqAKdbAYBn1pcczmSTdWvdmZ17c1b3FZ99vnTdCRFM8OEcAhLwm1NdXnWcBBSMRWmfkWZqVlsmLIiAp/o1gGV2vpS4lalGYsUOqXrddcKCmK61aZ8SjEpUpVFVoCpTj4r661Km7kBHjrDyc1RAIQAAIfkEBQoAGwAsBwAEAM4ACwAABf/gtmUCd4goQQgFKj6PYKi0yrrbc8i4ohQt12EHcal+MNSQiCP8gigdz7iCioaCIvUmZLp8QBzW0EN2vSlCuDtFKaq4RyHzQLEKZNdiQDhRDVooCwkbfm59EAmKi4SGIm+AjIsKjhsqB4mSjT2IOIOUnICeCaB/mZKFNTSRmqVpmJqklSqskq6PfYYCDwYHDC4REQwGCBLGxxIQDsHMwhAIX8bKzcENgSLGF9PU1j3Sy9zX2NrgzQziChLk1BHWxcjf7N046tvN82715czn9Pryz6Ilc4ACj4EBOCZM8KEnAYYADBRKnACAYUMFv1wotIhCEcaJCisqwJFgAUSQGyX/kCSVUUTIdKMwJlyo0oXHlhskwrTJciZHEXsgaqS4s6PJiCAr1uzYU8kBBSgnWFqpoMJMUjGtDmUwkmfVmVypakWhEKvXsS4nhLW5wNjVroJIoc05wSzTr0PtiigpYe4EC2vj4iWrFu5euWIMRBhacaVJhYQBEFjA9jHjyQ0xEABwGceGAZYjY0YBOrRLCxUp29QM+bRkx5s7ZyYgVbTqwwti2ybJ+vLtDYpycyZbYOlptxdx0kV+V7lC5iJAyyRrwYKxAdiz82ng0/jnAdMJFz0cPi104Ec1Vj9/M6F173vKL/feXv156dw11tlqeMMnv4V5Ap53GmjQQH97nFfg+IFiucfgRX5Z8KAgbUlQ4IULIlghhhdOSB6AgX0IVn8eReghen3NRIBsRgnH4l4LuEidZBjwRpt6NM5WGwoW0KSjCwX6yJSMab2GwwAPDXfaBCtWpluRTQqC5JM5oUZAjUNS+VeOLWpJEQ7VYQANW0INJSZVDFSnZphjSikfmzE5N4EEbQI1QJmnWXCmHulRp2edwDXF43txukenJwvI9xyg9Q26Z3MzGUcBYFEChZh6DVTq34AU8Iflh51Sd+CnKFYQ6mmZkhqfBKfSxZWqA9DZanWjxmhrWwi0qtCrt/43K6WqVjjpmhIqgEGvculaGKklKstAACEAACH5BAUKABwALAcABADOAAsAAAX/ICdyQmaMYyAUqPgIBiHPxNpy79kqRXH8wAPsRmDdXpAWgWdEIYm2llCHqjVHU+jjJkwqBTecwItShMXkEfNWSh8e1NGAcLgpDGlRgk7EJ/6Ae3VKfoF/fDuFhohVeDeCfXkcCQqDVQcQhn+VNDOYmpSWaoqBlUSfmowjEA+iEAEGDRGztAwGCDcXEA60tXEiCrq8vREMEBLIyRLCxMWSHMzExnbRvQ2Sy7vN0zvVtNfU2tLY3rPgLdnDvca4VQS/Cpk3ABwSLQkYAQwT/P309vcI7OvXr94jBQMJ/nskkGA/BQBRLNDncAIAiDcG6LsxAWOLiQzmeURBKWSLCQbv/1F0eDGinJUKR47YY1IEgQASKk7Yc7ACRwZm7mHweRJoz59BJUogisKCUaFMR0x4SlJBVBFTk8pZivTR0K73rN5wqlXEAq5Fy3IYgHbEzQ0nLy4QSoCjXLoom96VOJEeCosK5n4kkFfqXjl94wa+l1gvAcGICbewAOAxY8l/Ky/QhAGz4cUkGxu2HNozhwMGBnCUqUdBg9UuW9eUynqSwLHIBujePef1ZGQZXcM+OFuEBeBhi3OYgLyqcuaxbT9vLkf4SeqyWxSQpKGB2gQpm1KdWbu72rPRzR9Ne2Nu9Kzr/1Jqj0yD/fvqP4aXOt5sW/5qsXXVcv1Nsp8IBUAmgswGF3llGgeU1YVXXKTN1FlhWFXW3gIE+DVChApysACHHo7Q4A35lLichh+ROBmLKAzgYmYEYDAhCgxKGOOMn4WR4kkDaoBBOxJtdNKQxFmg5JIWIBnQc07GaORfUY4AEkdV6jHlCEISSZ5yTXpp1pbGZbkWmcuZmQCaE6iJ0FhjMaDjTMsgZaNEHFRAQVp3bqXnZED1qYcECOz5V6BhSWCoVJQIKuKQi2KFKEkEFAqoAo7uYSmO3jk61wUUMKmknJ4SGimBmAa0qVQBhAAAIfkEBQoAGwAsBwAEAM4ACwAABf/gJm5FmRlEqhJC+bywgK5pO4rHI0D3pii22+Mg6/0Ej96weCMAk7cDkXf7lZTTnrMl7eaYoy10JN0ZFdco0XAuvKI6qkgVFJXYNwjkIBcNBgR8TQoGfRsJCRuCYYQQiI+ICosiCoGOkIiKfSl8mJkHZ4U9kZMbKaI3pKGXmJKrngmug4WwkhA0lrCBWgYFCCMQFwoQDRHGxwwGCBLMzRLEx8iGzMMO0cYNeCMKzBDW19lnF9DXDIY/48Xg093f0Q3s1dcR8OLe8+Y91OTv5wrj7o7B+7VNQqABIoRVCMBggsOHE36kSoCBIcSH3EbFangxogJYFi8CkJhqQciLJEf/LDDJEeJIBT0GsOwYUYJGBS0fjpQAMidGmyVP6sx4Y6VQhzs9VUwkwqaCCh0tmKoFtSMDmBOf9phg4SrVrROuasRQAaxXpVUhdsU6IsECZlvX3kwLUWzRt0BHOLTbNlbZG3vZinArge5Dvn7wbqtQkSYAAgtKmnSsYKVKo2AfW048uaPmG386i4Q8EQMBAIAnfB7xBxBqvapJ9zX9WgRS2YMpnvYMGdPK3aMjt/3dUcNI4blpj7iwkMFWDXDvSmgAlijrt9RTR78+PS6z1uAJZIe93Q8g5zcsWCi/4Y+C8bah5zUv3vv89uft30QP23punGCx5954oBBwnwYaNCDY/wYrsYeggnM9B2Fpf8GG2CEUVWhbWAtGouEGDy7Y4IEJVrbSiXghqGKIo7z1IVcXIkKWWR361QOLWWnIhwERpLaaCCee5iMBGJQmJGyPFTnbkfHVZGRtIGrg5HALEJAZbu39BuUEUmq1JJQIPtZilY5hGeSWsSk52G9XqsmgljdIcABytq13HyIM6RcUA+r1qZ4EBF3WHWB29tBgAzRhEGhig8KmqKFv8SeCeo+mgsF7YFXa1qWSbkDpom/mqR1PmHCqJ3fwNRVXjC7S6CZhFVCQ2lWvZiirhQq42SACt25IK2hv8TprriUV1usGgeka7LFcNmCldMLi6qZMgFLgpw16Cipb7bC1knXsBiEAACH5BAUKABsALAcABADOAAsAAAX/4FZsJPkUmUGsLCEUTywXglFuSg7fW1xAvNWLF6sFFcPb42C8EZCj24EJdCp2yoegWsolS0Uu6fmamg8n8YYcLU2bXSiRaXMGvqV6/KAeJAh8VgZqCX+BexCFioWAYgqNi4qAR4ORhRuHY408jAeUhAmYYiuVlpiflqGZa5CWkzc5fKmbbhIpsAoQDRG8vQwQCBLCwxK6vb5qwhfGxxENahvCEA7NzskSy7vNzzzK09W/PNHF1NvX2dXcN8K55cfh69Luveol3vO8zwi4Yhj+AQwmCBw4IYclDAAJDlQggVOChAoLKkgFkSCAHDwWLKhIEOONARsDKryogFPIiAUb/95gJNIiw4wnI778GFPhzBKFOAq8qLJEhQpiNArjMcHCmlTCUDIouTKBhApELSxFWiGiVKY4E2CAekPgUphDu0742nRrVLJZnyrFSqKQ2ohoSYAMW6IoDpNJ4bLdILTnAj8KUF7UeENjAKuDyxIgOuGiOI0EBBMgLNew5AUrDTMGsFixwBIaNCQuAXJB57qNJ2OWm2Aj4skwCQCIyNkhhtMkdsIuodE0AN4LJDRgfLPtn5YDLdBlraAByuUbBgxQwICxMOnYpVOPej074OFdlfc0TqC62OIbcppHjV4o+LrieWhfT8JC/I/T6W8oCl29vQ0XjLdBaA3s1RcPBO7lFvpX8BVoG4O5jTXRQRDuJ6FDTzEWF1/BCZhgbyAKE9qICYLloQYOFtahVRsWYlZ4KQJHlwHS/IYaZ6sZd9tmu5HQm2xi1UaTbzxYwJk/wBF5g5EEYOBZeEfGZmNdFyFZmZIR4jikbLThlh5kUUVJGmRT7sekkziRWUIACABk3T4qCsedgO4xhgGcY7q5pHJ4klBBTQRJ0CeHcoYHHUh6wgfdn9uJdSdMiebGJ0zUPTcoS286FCkrZxnYoYYKWLkBowhQoBeaOlZAgVhLidrXqg2GiqpQpZ4apwSwRtjqrB3muoF9BboaXKmshlqWqsWiGt2wphJkQbAU5hoCACH5BAUKABsALAcABADOAAsAAAX/oGFw2WZuT5oZROsSQnGaKjRvilI893MItlNOJ5v5gDcFrHhKIWcEYu/xFEqNv6B1N62aclysF7fsZYe5aOx2yL5aAUGSaT1oTYMBwQ5VGCAJgYIJCnx1gIOBhXdwiIl7d0p2iYGQUAQBjoOFSQR/lIQHnZ+Ue6OagqYzSqSJi5eTpTxGcjcSChANEbu8DBAIEsHBChe5vL13G7fFuscRDcnKuM3H0La3EA7Oz8kKEsXazr7Cw9/Gztar5uHHvte47MjktznZ2w0G1+D3BgirAqJmJMAQgMGEgwgn5Ei0gKDBhBMALGRYEOJBb5QcWlQo4cbAihZz3GgIMqFEBSM1/4ZEOWPAgpIIJXYU+PIhRG8ja1qU6VHlzZknJNQ6UanCjQkWCIGSUGEjAwVLjc44+DTqUQtPPS5gejUrTa5TJ3g9sWCr1BNUWZI161StiQUDmLYdGfesibQ3XMq1OPYthrwuA2yU2LBs2cBHIypYQPPlYAKFD5cVvNPtW8eVGbdcQADATsiNO4cFAPkvHpedPzc8kUcPgNGgZ5RNDZG05reoE9s2vSEP79MEGiQGy1qP8LA4ZcdtsJE48ONoLTBtTV0B9LsTnPceoIDBDQvS7W7vfjVY3q3eZ4A339J4eaAmKqU/sV58HvJh2RcnIBsDUw0ABqhBA5aV5V9XUFGiHfVeAiWwoFgJJrIXRH1tEMiDFV4oHoAEGlaWhgIGSGBO2nFomYY3mKjVglidaNYJGJDkWW2xxTfbjCbVaOGNqoX2GloR8ZeTaECS9pthRGJH2g0b3Agbk6hNANtteHD2GJUucfajCQBy5OOTQ25ZgUPvaVVQmbKh9510/qQpwXx3SQdfk8tZJOd5b6JJFplT3ZnmmX3qd5l1eg5q00HrtUkUn0AKaiGjClSAgKLYZcgWXwocGRcCFGCKwSB6ceqphwmYRUFYT/1WKlOdUpipmxW0mlCqHjYkAaeoZlqrqZ4qd+upQKaapn/AmgAegZ8KUtYtFAQQAgAh+QQFCgAbACwHAAQAzgALAAAF/+C2PUcmiCiZGUTrEkKBis8jQEquKwU5HyXIbEPgyX7BYa5wTNmEMwWsSXsqFbEh8DYs9mrgGjdK6GkPY5GOeU6ryz7UFopSQEzygOGhJBjoIgMDBAcBM0V/CYqLCQqFOwobiYyKjn2TlI6GKC2YjJZknouaZAcQlJUHl6eooJwKooobqoewrJSEmyKdt59NhRKFMxLEEA4RyMkMEAjDEhfGycqAG8TQx9IRDRDE3d3R2ctD1RLg0ttKEnbY5wZD3+zJ6M7X2RHi9Oby7u/r9g38UFjTh2xZJBEBMDAboogAgwkQI07IMUORwocSJwCgWDFBAIwZOaJIsOBjRogKJP8wTODw5ESVHVtm3AhzpEeQElOuNDlTZ0ycEUWKWFASqEahGwYUPbnxoAgEdlYSqDBkgoUNClAlIHbSAoOsqCRQnQHxq1axVb06FWFxLIqyaze0Tft1JVqyE+pWXMD1pF6bYl3+HTqAWNW8cRUFzmih0ZAAB2oGKukSAAGGRHWJgLiR6AylBLpuHKKUMlMCngMpDSAa9QIUggZVVvDaJobLeC3XZpvgNgCmtPcuwP3WgmXSq4do0DC6o2/guzcseECtUoO0hmcsGKDgOt7ssBd07wqesAIGZC1YIBa7PQHvb1+SFo+++HrJSQfB33xfav3i5eX3Hnb4CTJgegEq8tH/YQEOcIJzbm2G2EoYRLgBXFpVmFYDcREV4HIcnmUhiGBRouEMJGJGzHIspqgdXxK0yCKHRNXoIX4uorCdTyjkyNtdPWrA4Up82EbAbzMRxxZRR54WXVLDIRmRcag5d2R6ugl3ZXzNhTecchpMhIGVAKAYpgJjjsSklBEd99maZoo535ZvdamjBEpusJyctg3h4X8XqodBMx0tiNeg/oGJaKGABpogS40KSqiaEgBqlQWLUtqoVQnytekEjzo0hHqhRorppOZt2p923M2AAV+oBtpAnnPNoB6HaU6mAAIU+IXmi3j2mtFXuUoHKwXpzVrsjcgGOauKEjQrwq157hitGq2NoWmjh7z6Wmxb0m5w66+2VRAuXN/yFUAIACH5BAUKABsALAcABADOAAsAAAX/4CZuRiaM45MZqBgIRbs9AqTcuFLE7VHLOh7KB5ERdjJaEaU4ClO/lgKWjKKcMiJQ8KgumcieVdQMD8cbBeuAkkC6LYLhOxoQ2PF5Ys9PKPBMen17f0CCg4VSh32JV4t8jSNqEIOEgJKPlkYBlJWRInKdiJdkmQlvKAsLBxdABA4RsbIMBggtEhcQsLKxDBC2TAS6vLENdJLDxMZAubu8vjIbzcQRtMzJz79S08oQEt/guNiyy7fcvMbh4OezdAvGrakLAQwyABsELQkY9BP+//ckyPDD4J9BfAMh1GsBoImMeQUN+lMgUJ9CiRMa5msxoB9Gh/o8GmxYMZXIgxtR/yQ46S/gQAURR0pDwYDfywoyLPip5AdnCwsMFPBU4BPFhKBDi444quCmDKZOfwZ9KEGpCKgcN1jdALSpPqIYsabS+nSqvqplvYqQYAeDPgwKwjaMtiDl0oaqUAyo+3TuWwUAMPpVCfee0cEjVBGQq2ABx7oTWmQk4FglZMGN9fGVDMCuiH2AOVOu/PmyxM630gwM0CCn6q8LjVJ8GXvpa5Uwn95OTC/nNxkda1/dLSK475IjCD6dHbK1ZOa4hXP9DXs5chJ00UpVm5xo2qRpoxptwF2E4/IbJpB/SDz9+q9b1aNfQH08+p4a8uvX8B53fLP+ycAfemjsRUBgp1H20K+BghHgVgt1GXZXZpZ5lt4ECjxYR4ScUWiShEtZqBiIInRGWnERNnjiBglw+JyGnxUmGowsyiiZg189lNtPGACjV2+S9UjbU0JWF6SPvEk3QZEqsZYTk3UAaRSUnznJI5LmESCdBVSyaOWUWLK4I5gDUYVeV1T9l+FZClCAUVA09uSmRHBCKAECFEhW51ht6rnmWBXkaR+NjuHpJ40D3DmnQXt2F+ihZxlqVKOfQRACACH5BAUKABwALAcABADOAAsAAAX/ICdyUCkUo/g8mUG8MCGkKgspeC6j6XEIEBpBUeCNfECaglBcOVfJFK7YQwZHQ6JRZBUqTrSuVEuD3nI45pYjFuWKvjjSkCoRaBUMWxkwBGgJCXspQ36Bh4EEB0oKhoiBgyNLjo8Ki4QElIiWfJqHnISNEI+Ql5J9o6SgkqKkgqYihamPkW6oNBgSfiMMDQkGCBLCwxIQDhHIyQwQCGMKxsnKVyPCF9DREQ3MxMPX0cu4wt7J2uHWx9jlKd3o39MiuefYEcvNkuLt5O8c1ePI2tyELXGQwoGDAQf+iEC2xByDCRAjTlAgIUWCBRgCPJQ4AQBFXAs0coT40WLIjRxL/47AcHLkxIomRXL0CHPERZkpa4q4iVKiyp0tR/7kwHMkTUBBJR5dOCEBAVcKKtCAyOHpowXCpk7goABqBZdcvWploACpBKkpIJI1q5OD2rIWE0R1uTZu1LFwbWL9OlKuWb4c6+o9i3dEgw0RCGDUG9KlRw56gDY2qmCByZBaASi+TACA0TucAaTteCcy0ZuOK3N2vJlx58+LRQyY3Xm0ZsgjZg+oPQLi7dUcNXi0LOJw1pgNtB7XG6CBy+U75SYfPTSQAgZTNUDnQHt67wnbZyvwLgKiMN3oCZB3C76tdewpLFgIP2C88rbi4Y+QT3+8S5USMICZXWj1pkEDeUU3lOYGB3alSoEiMIjgX4WlgNF2EibIwQIXauWXSRg2SAOHIU5IIIMoZkhhWiJaiFVbKo6AQEgQXrTAazO1JhkBrBG3Y2Y6EsUhaGn95hprSN0oWpFE7rhkeaQBchGOEWnwEmc0uKWZj0LeuNV3W4Y2lZHFlQCSRjTIl8uZ+kG5HU/3sRlnTG2ytyadytnD3HrmuRcSn+0h1dycexIK1KCjYaCnjCCVqOFFJTZ5GkUUjESWaUIKU2lgCmAKKQIUjHapXRKE+t2og1VgankNYnohqKJ2CmKplso6GKz7WYCgqxeuyoF8u9IQAgA7',
            msg: null,
            msgText: '<em>Loading the next set of posts...</em>',
            selector: null,
            speed: 'fast',
            start: undefined
        },
        state: {
            isDuringAjax: false,
            isInvalidPage: false,
            isDestroyed: false,
            isDone: false, // For when it goes all the way through the archive.
            isPaused: false,
            isBeyondMaxPage: false,
            currPage: 1
        },
        debug: false,
        behavior: undefined,
        binder: $(window), // used to cache the selector
        nextSelector: 'div.navigation a:first',
        navSelector: 'div.navigation',
        contentSelector: null, // rename to pageFragment
        extraScrollPx: 150,
        itemSelector: 'div.post',
        animate: false,
        pathParse: undefined,
        dataType: 'html',
        appendCallback: true,
        bufferPx: 40,
        errorCallback: function () { },
        infid: 0, //Instance ID
        pixelsFromNavToBottom: undefined,
        path: undefined, // Either parts of a URL as an array (e.g. ["/page/", "/"] or a function that takes in the page number and returns a URL
        prefill: false, // When the document is smaller than the window, load data until the document is larger or links are exhausted
        maxPage: undefined // to manually control maximum page (when maxPage is undefined, maximum page limitation is not work)
    };

    $.infinitescroll.prototype = {

        /*
            ----------------------------
            Private methods
            ----------------------------
            */

        // Bind or unbind from scroll
        _binding: function infscr_binding(binding) {

            var instance = this,
            opts = instance.options;

            opts.v = '2.0b2.120520';

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['_binding_'+opts.behavior] !== undefined) {
                this['_binding_'+opts.behavior].call(this);
                return;
            }

            if (binding !== 'bind' && binding !== 'unbind') {
                this._debug('Binding value  ' + binding + ' not valid');
                return false;
            }

            if (binding === 'unbind') {
                (this.options.binder).unbind('smartscroll.infscr.' + instance.options.infid);
            } else {
                (this.options.binder)[binding]('smartscroll.infscr.' + instance.options.infid, function () {
                    instance.scroll();
                });
            }

            this._debug('Binding', binding);
        },

        // Fundamental aspects of the plugin are initialized
        _create: function infscr_create(options, callback) {

            // Add custom options to defaults
            var opts = $.extend(true, {}, $.infinitescroll.defaults, options);
            this.options = opts;
            var $window = $(window);
            var instance = this;

            // Validate selectors
            if (!instance._validate(options)) {
                return false;
            }

            // Validate page fragment path
            var path = $(opts.nextSelector).attr('href');
            if (!path) {
                this._debug('Navigation selector not found');
                return false;
            }

            // Set the path to be a relative URL from root.
            opts.path = opts.path || this._determinepath(path);

            // contentSelector is 'page fragment' option for .load() / .ajax() calls
            opts.contentSelector = opts.contentSelector || this.element;

            // loading.selector - if we want to place the load message in a specific selector, defaulted to the contentSelector
            opts.loading.selector = opts.loading.selector || opts.contentSelector;

            // Define loading.msg
            opts.loading.msg = opts.loading.msg || $('<div id="infscr-loading"><img alt="Loading..." src="' + opts.loading.img + '" /><div>' + opts.loading.msgText + '</div></div>');

            // Preload loading.img
            (new Image()).src = opts.loading.img;

            // distance from nav links to bottom
            // computed as: height of the document + top offset of container - top offset of nav link
            if(opts.pixelsFromNavToBottom === undefined) {
                opts.pixelsFromNavToBottom = $(document).height() - $(opts.navSelector).offset().top;
                this._debug('pixelsFromNavToBottom: ' + opts.pixelsFromNavToBottom);
            }

            var self = this;

            // determine loading.start actions
            opts.loading.start = opts.loading.start || function() {
                $(opts.navSelector).hide();
                opts.loading.msg
                .appendTo(opts.loading.selector)
                .show(opts.loading.speed, $.proxy(function() {
                    this.beginAjax(opts);
                }, self));
            };

            // determine loading.finished actions
            opts.loading.finished = opts.loading.finished || function() {
                if (!opts.state.isBeyondMaxPage)
                    opts.loading.msg.fadeOut(opts.loading.speed);
            };

            // callback loading
            opts.callback = function(instance, data, url) {
                if (!!opts.behavior && instance['_callback_'+opts.behavior] !== undefined) {
                    instance['_callback_'+opts.behavior].call($(opts.contentSelector)[0], data, url);
                }

                if (callback) {
                    callback.call($(opts.contentSelector)[0], data, opts, url);
                }

                if (opts.prefill) {
                    $window.bind('resize.infinite-scroll', instance._prefill);
                }
            };

            if (options.debug) {
                // Tell IE9 to use its built-in console
                if (Function.prototype.bind && (typeof console === 'object' || typeof console === 'function') && typeof console.log === 'object') {
                    ['log','info','warn','error','assert','dir','clear','profile','profileEnd']
                        .forEach(function (method) {
                            console[method] = this.call(console[method], console);
                        }, Function.prototype.bind);
                }
            }

            this._setup();

            // Setups the prefill method for use
            if (opts.prefill) {
                this._prefill();
            }

            // Return true to indicate successful creation
            return true;
        },

        _prefill: function infscr_prefill() {
            var instance = this;
            var $window = $(window);

            function needsPrefill() {
                return ( $(instance.options.contentSelector).height() <= $window.height() );
            }

            this._prefill = function() {
                if (needsPrefill()) {
                    instance.scroll();
                }

                $window.bind('resize.infinite-scroll', function() {
                    if (needsPrefill()) {
                        $window.unbind('resize.infinite-scroll');
                        instance.scroll();
                    }
                });
            };

            // Call self after setting up the new function
            this._prefill();
        },

        // Console log wrapper
        _debug: function infscr_debug() {
            if (true !== this.options.debug) {
                return;
            }

            if (typeof console !== 'undefined' && typeof console.log === 'function') {
                // Modern browsers
                // Single argument, which is a string
                if ((Array.prototype.slice.call(arguments)).length === 1 && typeof Array.prototype.slice.call(arguments)[0] === 'string') {
                    console.log( (Array.prototype.slice.call(arguments)).toString() );
                } else {
                    console.log( Array.prototype.slice.call(arguments) );
                }
            } else if (!Function.prototype.bind && typeof console !== 'undefined' && typeof console.log === 'object') {
                // IE8
                Function.prototype.call.call(console.log, console, Array.prototype.slice.call(arguments));
            }
        },

        // find the number to increment in the path.
        _determinepath: function infscr_determinepath(path) {

            var opts = this.options;

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['_determinepath_'+opts.behavior] !== undefined) {
                return this['_determinepath_'+opts.behavior].call(this,path);
            }

            if (!!opts.pathParse) {

                this._debug('pathParse manual');
                return opts.pathParse(path, this.options.state.currPage+1);

            } else if (path.match(/^(.*?)\b2\b(.*?$)/)) {
                path = path.match(/^(.*?)\b2\b(.*?$)/).slice(1);

                // if there is any 2 in the url at all.
            } else if (path.match(/^(.*?)2(.*?$)/)) {

                // page= is used in django:
                // http://www.infinite-scroll.com/changelog/comment-page-1/#comment-127
                if (path.match(/^(.*?page=)2(\/.*|$)/)) {
                    path = path.match(/^(.*?page=)2(\/.*|$)/).slice(1);
                    return path;
                }

                path = path.match(/^(.*?)2(.*?$)/).slice(1);

            } else {

                // page= is used in drupal too but second page is page=1 not page=2:
                // thx Jerod Fritz, vladikoff
                if (path.match(/^(.*?page=)1(\/.*|$)/)) {
                    path = path.match(/^(.*?page=)1(\/.*|$)/).slice(1);
                    return path;
                } else {
                    this._debug("Sorry, we couldn't parse your Next (Previous Posts) URL. Verify your the css selector points to the correct A tag. If you still get this error: yell, scream, and kindly ask for help at infinite-scroll.com.");
                    // Get rid of isInvalidPage to allow permalink to state
                    opts.state.isInvalidPage = true;  //prevent it from running on this page.
                }
            }
            this._debug('determinePath', path);
            return path;

        },

        // Custom error
        _error: function infscr_error(xhr) {

            var opts = this.options;

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['_error_'+opts.behavior] !== undefined) {
                this['_error_'+opts.behavior].call(this,xhr);
                return;
            }

            if (xhr !== 'destroy' && xhr !== 'end') {
                xhr = 'unknown';
            }

            this._debug('Error', xhr);

            if (xhr === 'end' || opts.state.isBeyondMaxPage) {
                this._showdonemsg();
            }

            opts.state.isDone = true;
            opts.state.currPage = 1; // if you need to go back to this instance
            opts.state.isPaused = false;
            opts.state.isBeyondMaxPage = false;
            this._binding('unbind');

        },

        // Load Callback
        _loadcallback: function infscr_loadcallback(box, data, url) {
            var opts = this.options,
            callback = this.options.callback, // GLOBAL OBJECT FOR CALLBACK
            result = (opts.state.isDone) ? 'done' : (!opts.appendCallback) ? 'no-append' : 'append',
            frag;

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['_loadcallback_'+opts.behavior] !== undefined) {
                this['_loadcallback_'+opts.behavior].call(this,box,data,url);
                return;
            }

            switch (result) {
                case 'done':
                    this._showdonemsg();
                    return false;

                case 'no-append':
                    if (opts.dataType === 'html') {
                        data = '<div>' + data + '</div>';
                        data = $(data).find(opts.itemSelector);
                    }

                    // if it didn't return anything
                    if (data.length === 0) {
                        return this._error('end');
                    }

                    break;

                case 'append':
                    var children = box.children();
                    // if it didn't return anything
                    if (children.length === 0) {
                        return this._error('end');
                    }

                    // use a documentFragment because it works when content is going into a table or UL
                    frag = document.createDocumentFragment();
                    while (box[0].firstChild) {
                        frag.appendChild(box[0].firstChild);
                    }

                    this._debug('contentSelector', $(opts.contentSelector)[0]);
                    $(opts.contentSelector)[0].appendChild(frag);
                    // previously, we would pass in the new DOM element as context for the callback
                    // however we're now using a documentfragment, which doesn't have parents or children,
                    // so the context is the contentContainer guy, and we pass in an array
                    // of the elements collected as the first argument.

                    data = children.get();
                    break;
            }

            // loadingEnd function
            opts.loading.finished.call($(opts.contentSelector)[0],opts);

            // smooth scroll to ease in the new content
            if (opts.animate) {
                var scrollTo = $(window).scrollTop() + $(opts.loading.msg).height() + opts.extraScrollPx + 'px';
                $('html,body').animate({ scrollTop: scrollTo }, 800, function () { opts.state.isDuringAjax = false; });
            }

            if (!opts.animate) {
                // once the call is done, we can allow it again.
                opts.state.isDuringAjax = false;
            }

            callback(this, data, url);

            if (opts.prefill) {
                this._prefill();
            }
        },

        _nearbottom: function infscr_nearbottom() {

            var opts = this.options,
            pixelsFromWindowBottomToBottom = 0 + $(document).height() - (opts.binder.scrollTop()) - $(window).height();

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['_nearbottom_'+opts.behavior] !== undefined) {
                return this['_nearbottom_'+opts.behavior].call(this);
            }

            this._debug('math:', pixelsFromWindowBottomToBottom, opts.pixelsFromNavToBottom);

            // if distance remaining in the scroll (including buffer) is less than the orignal nav to bottom....
            return (pixelsFromWindowBottomToBottom - opts.bufferPx < opts.pixelsFromNavToBottom);

        },

        // Pause / temporarily disable plugin from firing
        _pausing: function infscr_pausing(pause) {

            var opts = this.options;

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['_pausing_'+opts.behavior] !== undefined) {
                this['_pausing_'+opts.behavior].call(this,pause);
                return;
            }

            // If pause is not 'pause' or 'resume', toggle it's value
            if (pause !== 'pause' && pause !== 'resume' && pause !== null) {
                this._debug('Invalid argument. Toggling pause value instead');
            }

            pause = (pause && (pause === 'pause' || pause === 'resume')) ? pause : 'toggle';

            switch (pause) {
                case 'pause':
                    opts.state.isPaused = true;
                break;

                case 'resume':
                    opts.state.isPaused = false;
                break;

                case 'toggle':
                    opts.state.isPaused = !opts.state.isPaused;
                break;
            }

            this._debug('Paused', opts.state.isPaused);
            return false;

        },

        // Behavior is determined
        // If the behavior option is undefined, it will set to default and bind to scroll
        _setup: function infscr_setup() {

            var opts = this.options;

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['_setup_'+opts.behavior] !== undefined) {
                this['_setup_'+opts.behavior].call(this);
                return;
            }

            this._binding('bind');

            return false;

        },

        // Show done message
        _showdonemsg: function infscr_showdonemsg() {

            var opts = this.options;

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['_showdonemsg_'+opts.behavior] !== undefined) {
                this['_showdonemsg_'+opts.behavior].call(this);
                return;
            }

            opts.loading.msg
            .find('img')
            .hide()
            .parent()
            .find('div').html(opts.loading.finishedMsg).animate({ opacity: 1 }, 2000, function () {
                $(this).parent().fadeOut(opts.loading.speed);
            });

            // user provided callback when done
            opts.errorCallback.call($(opts.contentSelector)[0],'done');
        },

        // grab each selector option and see if any fail
        _validate: function infscr_validate(opts) {
            for (var key in opts) {
                if (key.indexOf && key.indexOf('Selector') > -1 && $(opts[key]).length === 0) {
                    this._debug('Your ' + key + ' found no elements.');
                    return false;
                }
            }

            return true;
        },

        /*
            ----------------------------
            Public methods
            ----------------------------
            */

        // Bind to scroll
        bind: function infscr_bind() {
            this._binding('bind');
        },

        // Destroy current instance of plugin
        destroy: function infscr_destroy() {
            this.options.state.isDestroyed = true;
            this.options.loading.finished();
            return this._error('destroy');
        },

        // Set pause value to false
        pause: function infscr_pause() {
            this._pausing('pause');
        },

        // Set pause value to false
        resume: function infscr_resume() {
            this._pausing('resume');
        },

        beginAjax: function infscr_ajax(opts) {
            var instance = this,
                path = opts.path,
                box, desturl, method, condition;

            // increment the URL bit. e.g. /page/3/
            opts.state.currPage++;

            // Manually control maximum page
            if ( opts.maxPage !== undefined && opts.state.currPage > opts.maxPage ){
                opts.state.isBeyondMaxPage = true;
                this.destroy();
                return;
            }

            // if we're dealing with a table we can't use DIVs
            box = $(opts.contentSelector).is('table, tbody') ? $('<tbody/>') : $('<div/>');

            desturl = (typeof path === 'function') ? path(opts.state.currPage) : path.join(opts.state.currPage);
            instance._debug('heading into ajax', desturl);

            method = (opts.dataType === 'html' || opts.dataType === 'json' ) ? opts.dataType : 'html+callback';
            if (opts.appendCallback && opts.dataType === 'html') {
                method += '+callback';
            }

            switch (method) {
                case 'html+callback':
                    instance._debug('Using HTML via .load() method');
                    box.load(desturl + ' ' + opts.itemSelector, undefined, function infscr_ajax_callback(responseText) {
                        instance._loadcallback(box, responseText, desturl);
                    });

                    break;

                case 'html':
                    instance._debug('Using ' + (method.toUpperCase()) + ' via $.ajax() method');
                    $.ajax({
                        // params
                        url: desturl,
                        dataType: opts.dataType,
                        complete: function infscr_ajax_callback(jqXHR, textStatus) {
                            condition = (typeof (jqXHR.isResolved) !== 'undefined') ? (jqXHR.isResolved()) : (textStatus === 'success' || textStatus === 'notmodified');
                            if (condition) {
                                instance._loadcallback(box, jqXHR.responseText, desturl);
                            } else {
                                instance._error('end');
                            }
                        }
                    });

                    break;
                case 'json':
                    instance._debug('Using ' + (method.toUpperCase()) + ' via $.ajax() method');
                    $.ajax({
                        dataType: 'json',
                        type: 'GET',
                        url: desturl,
                        success: function (data, textStatus, jqXHR) {
                            condition = (typeof (jqXHR.isResolved) !== 'undefined') ? (jqXHR.isResolved()) : (textStatus === 'success' || textStatus === 'notmodified');
                            if (opts.appendCallback) {
                                // if appendCallback is true, you must defined template in options.
                                // note that data passed into _loadcallback is already an html (after processed in opts.template(data)).
                                if (opts.template !== undefined) {
                                    var theData = opts.template(data);
                                    box.append(theData);
                                    if (condition) {
                                        instance._loadcallback(box, theData);
                                    } else {
                                        instance._error('end');
                                    }
                                } else {
                                    instance._debug('template must be defined.');
                                    instance._error('end');
                                }
                            } else {
                                // if appendCallback is false, we will pass in the JSON object. you should handle it yourself in your callback.
                                if (condition) {
                                    instance._loadcallback(box, data, desturl);
                                } else {
                                    instance._error('end');
                                }
                            }
                        },
                        error: function() {
                            instance._debug('JSON ajax request failed.');
                            instance._error('end');
                        }
                    });

                    break;
            }
        },

        // Retrieve next set of content items
        retrieve: function infscr_retrieve(pageNum) {
            pageNum = pageNum || null;

            var instance = this,
            opts = instance.options;

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['retrieve_'+opts.behavior] !== undefined) {
                this['retrieve_'+opts.behavior].call(this,pageNum);
                return;
            }

            // for manual triggers, if destroyed, get out of here
            if (opts.state.isDestroyed) {
                this._debug('Instance is destroyed');
                return false;
            }

            // we dont want to fire the ajax multiple times
            opts.state.isDuringAjax = true;

            opts.loading.start.call($(opts.contentSelector)[0],opts);
        },

        // Check to see next page is needed
        scroll: function infscr_scroll() {

            var opts = this.options,
            state = opts.state;

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['scroll_'+opts.behavior] !== undefined) {
                this['scroll_'+opts.behavior].call(this);
                return;
            }

            if (state.isDuringAjax || state.isInvalidPage || state.isDone || state.isDestroyed || state.isPaused) {
                return;
            }

            if (!this._nearbottom()) {
                return;
            }

            this.retrieve();

        },

        // Toggle pause value
        toggle: function infscr_toggle() {
            this._pausing();
        },

        // Unbind from scroll
        unbind: function infscr_unbind() {
            this._binding('unbind');
        },

        // update options
        update: function infscr_options(key) {
            if ($.isPlainObject(key)) {
                this.options = $.extend(true,this.options,key);
            }
        }
    };


    /*
        ----------------------------
        Infinite Scroll function
        ----------------------------

        Borrowed logic from the following...

        jQuery UI
        - https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.widget.js

        jCarousel
        - https://github.com/jsor/jcarousel/blob/master/lib/jquery.jcarousel.js

        Masonry
        - https://github.com/desandro/masonry/blob/master/jquery.masonry.js

*/

    $.fn.infinitescroll = function infscr_init(options, callback) {


        var thisCall = typeof options;

        switch (thisCall) {

            // method
            case 'string':
                var args = Array.prototype.slice.call(arguments, 1);

                this.each(function () {
                    var instance = $.data(this, 'infinitescroll');

                    if (!instance) {
                        // not setup yet
                        // return $.error('Method ' + options + ' cannot be called until Infinite Scroll is setup');
                        return false;
                    }

                    if (!$.isFunction(instance[options]) || options.charAt(0) === '_') {
                        // return $.error('No such method ' + options + ' for Infinite Scroll');
                        return false;
                    }

                    // no errors!
                    instance[options].apply(instance, args);
                });

            break;

            // creation
            case 'object':

                this.each(function () {

                var instance = $.data(this, 'infinitescroll');

                if (instance) {

                    // update options of current instance
                    instance.update(options);

                } else {

                    // initialize new instance
                    instance = new $.infinitescroll(options, callback, this);

                    // don't attach if instantiation failed
                    if (!instance.failed) {
                        $.data(this, 'infinitescroll', instance);
                    }

                }

            });

            break;

        }

        return this;
    };



    /*
     * smartscroll: debounced scroll event for jQuery *
     * https://github.com/lukeshumard/smartscroll
     * Based on smartresize by @louis_remi: https://github.com/lrbabe/jquery.smartresize.js *
     * Copyright 2011 Louis-Remi & Luke Shumard * Licensed under the MIT license. *
     */

    var event = $.event,
    scrollTimeout;

    event.special.smartscroll = {
        setup: function () {
            $(this).bind('scroll', event.special.smartscroll.handler);
        },
        teardown: function () {
            $(this).unbind('scroll', event.special.smartscroll.handler);
        },
        handler: function (event, execAsap) {
            // Save the context
            var context = this,
            args = arguments;

            // set correct event type
            event.type = 'smartscroll';

            if (scrollTimeout) { clearTimeout(scrollTimeout); }
            scrollTimeout = setTimeout(function () {
                $(context).trigger('smartscroll', args);
            }, execAsap === 'execAsap' ? 0 : 100);
        }
    };

    $.fn.smartscroll = function (fn) {
        return fn ? this.bind('smartscroll', fn) : this.trigger('smartscroll', ['execAsap']);
    };

}));;/*!
 * Isotope PACKAGED v2.2.0
 *
 * Licensed GPLv3 for open source use
 * or Isotope Commercial License for commercial use
 *
 * http://isotope.metafizzy.co
 * Copyright 2015 Metafizzy
 */

/**
 * Bridget makes jQuery widgets
 * v1.1.0
 * MIT license
 */

( function( window ) {



// -------------------------- utils -------------------------- //

var slice = Array.prototype.slice;

function noop() {}

// -------------------------- definition -------------------------- //

function defineBridget( $ ) {

// bail if no jQuery
if ( !$ ) {
  return;
}

// -------------------------- addOptionMethod -------------------------- //

/**
 * adds option method -> $().plugin('option', {...})
 * @param {Function} PluginClass - constructor class
 */
function addOptionMethod( PluginClass ) {
  // don't overwrite original option method
  if ( PluginClass.prototype.option ) {
    return;
  }

  // option setter
  PluginClass.prototype.option = function( opts ) {
    // bail out if not an object
    if ( !$.isPlainObject( opts ) ){
      return;
    }
    this.options = $.extend( true, this.options, opts );
  };
}

// -------------------------- plugin bridge -------------------------- //

// helper function for logging errors
// $.error breaks jQuery chaining
var logError = typeof console === 'undefined' ? noop :
  function( message ) {
    console.error( message );
  };

/**
 * jQuery plugin bridge, access methods like $elem.plugin('method')
 * @param {String} namespace - plugin name
 * @param {Function} PluginClass - constructor class
 */
function bridge( namespace, PluginClass ) {
  // add to jQuery fn namespace
  $.fn[ namespace ] = function( options ) {
    if ( typeof options === 'string' ) {
      // call plugin method when first argument is a string
      // get arguments for method
      var args = slice.call( arguments, 1 );

      for ( var i=0, len = this.length; i < len; i++ ) {
        var elem = this[i];
        var instance = $.data( elem, namespace );
        if ( !instance ) {
          logError( "cannot call methods on " + namespace + " prior to initialization; " +
            "attempted to call '" + options + "'" );
          continue;
        }
        if ( !$.isFunction( instance[options] ) || options.charAt(0) === '_' ) {
          logError( "no such method '" + options + "' for " + namespace + " instance" );
          continue;
        }

        // trigger method with arguments
        var returnValue = instance[ options ].apply( instance, args );

        // break look and return first value if provided
        if ( returnValue !== undefined ) {
          return returnValue;
        }
      }
      // return this if no return value
      return this;
    } else {
      return this.each( function() {
        var instance = $.data( this, namespace );
        if ( instance ) {
          // apply options & init
          instance.option( options );
          instance._init();
        } else {
          // initialize new instance
          instance = new PluginClass( this, options );
          $.data( this, namespace, instance );
        }
      });
    }
  };

}

// -------------------------- bridget -------------------------- //

/**
 * converts a Prototypical class into a proper jQuery plugin
 *   the class must have a ._init method
 * @param {String} namespace - plugin name, used in $().pluginName
 * @param {Function} PluginClass - constructor class
 */
$.bridget = function( namespace, PluginClass ) {
  addOptionMethod( PluginClass );
  bridge( namespace, PluginClass );
};

return $.bridget;

}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'jquery-bridget/jquery.bridget',[ 'jquery' ], defineBridget );
} else if ( typeof exports === 'object' ) {
  defineBridget( require('jquery') );
} else {
  // get jquery from browser global
  defineBridget( window.jQuery );
}

})( window );

/*!
 * eventie v1.0.6
 * event binding helper
 *   eventie.bind( elem, 'click', myFn )
 *   eventie.unbind( elem, 'click', myFn )
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true */
/*global define: false, module: false */

( function( window ) {



var docElem = document.documentElement;

var bind = function() {};

function getIEEvent( obj ) {
  var event = window.event;
  // add event.target
  event.target = event.target || event.srcElement || obj;
  return event;
}

if ( docElem.addEventListener ) {
  bind = function( obj, type, fn ) {
    obj.addEventListener( type, fn, false );
  };
} else if ( docElem.attachEvent ) {
  bind = function( obj, type, fn ) {
    obj[ type + fn ] = fn.handleEvent ?
      function() {
        var event = getIEEvent( obj );
        fn.handleEvent.call( fn, event );
      } :
      function() {
        var event = getIEEvent( obj );
        fn.call( obj, event );
      };
    obj.attachEvent( "on" + type, obj[ type + fn ] );
  };
}

var unbind = function() {};

if ( docElem.removeEventListener ) {
  unbind = function( obj, type, fn ) {
    obj.removeEventListener( type, fn, false );
  };
} else if ( docElem.detachEvent ) {
  unbind = function( obj, type, fn ) {
    obj.detachEvent( "on" + type, obj[ type + fn ] );
    try {
      delete obj[ type + fn ];
    } catch ( err ) {
      // can't delete window object properties
      obj[ type + fn ] = undefined;
    }
  };
}

var eventie = {
  bind: bind,
  unbind: unbind
};

// ----- module definition ----- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'eventie/eventie',eventie );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = eventie;
} else {
  // browser global
  window.eventie = eventie;
}

})( window );

/*!
 * EventEmitter v4.2.11 - git.io/ee
 * Unlicense - http://unlicense.org/
 * Oliver Caldwell - http://oli.me.uk/
 * @preserve
 */

;(function () {
    

    /**
     * Class for managing events.
     * Can be extended to provide event functionality in other classes.
     *
     * @class EventEmitter Manages event registering and emitting.
     */
    function EventEmitter() {}

    // Shortcuts to improve speed and size
    var proto = EventEmitter.prototype;
    var exports = this;
    var originalGlobalValue = exports.EventEmitter;

    /**
     * Finds the index of the listener for the event in its storage array.
     *
     * @param {Function[]} listeners Array of listeners to search through.
     * @param {Function} listener Method to look for.
     * @return {Number} Index of the specified listener, -1 if not found
     * @api private
     */
    function indexOfListener(listeners, listener) {
        var i = listeners.length;
        while (i--) {
            if (listeners[i].listener === listener) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Alias a method while keeping the context correct, to allow for overwriting of target method.
     *
     * @param {String} name The name of the target method.
     * @return {Function} The aliased method
     * @api private
     */
    function alias(name) {
        return function aliasClosure() {
            return this[name].apply(this, arguments);
        };
    }

    /**
     * Returns the listener array for the specified event.
     * Will initialise the event object and listener arrays if required.
     * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
     * Each property in the object response is an array of listener functions.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Function[]|Object} All listener functions for the event.
     */
    proto.getListeners = function getListeners(evt) {
        var events = this._getEvents();
        var response;
        var key;

        // Return a concatenated array of all matching events if
        // the selector is a regular expression.
        if (evt instanceof RegExp) {
            response = {};
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    response[key] = events[key];
                }
            }
        }
        else {
            response = events[evt] || (events[evt] = []);
        }

        return response;
    };

    /**
     * Takes a list of listener objects and flattens it into a list of listener functions.
     *
     * @param {Object[]} listeners Raw listener objects.
     * @return {Function[]} Just the listener functions.
     */
    proto.flattenListeners = function flattenListeners(listeners) {
        var flatListeners = [];
        var i;

        for (i = 0; i < listeners.length; i += 1) {
            flatListeners.push(listeners[i].listener);
        }

        return flatListeners;
    };

    /**
     * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Object} All listener functions for an event in an object.
     */
    proto.getListenersAsObject = function getListenersAsObject(evt) {
        var listeners = this.getListeners(evt);
        var response;

        if (listeners instanceof Array) {
            response = {};
            response[evt] = listeners;
        }

        return response || listeners;
    };

    /**
     * Adds a listener function to the specified event.
     * The listener will not be added if it is a duplicate.
     * If the listener returns true then it will be removed after it is called.
     * If you pass a regular expression as the event name then the listener will be added to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListener = function addListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var listenerIsWrapped = typeof listener === 'object';
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
                listeners[key].push(listenerIsWrapped ? listener : {
                    listener: listener,
                    once: false
                });
            }
        }

        return this;
    };

    /**
     * Alias of addListener
     */
    proto.on = alias('addListener');

    /**
     * Semi-alias of addListener. It will add a listener that will be
     * automatically removed after its first execution.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addOnceListener = function addOnceListener(evt, listener) {
        return this.addListener(evt, {
            listener: listener,
            once: true
        });
    };

    /**
     * Alias of addOnceListener.
     */
    proto.once = alias('addOnceListener');

    /**
     * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
     * You need to tell it what event names should be matched by a regex.
     *
     * @param {String} evt Name of the event to create.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvent = function defineEvent(evt) {
        this.getListeners(evt);
        return this;
    };

    /**
     * Uses defineEvent to define multiple events.
     *
     * @param {String[]} evts An array of event names to define.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvents = function defineEvents(evts) {
        for (var i = 0; i < evts.length; i += 1) {
            this.defineEvent(evts[i]);
        }
        return this;
    };

    /**
     * Removes a listener function from the specified event.
     * When passed a regular expression as the event name, it will remove the listener from all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to remove the listener from.
     * @param {Function} listener Method to remove from the event.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListener = function removeListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var index;
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                index = indexOfListener(listeners[key], listener);

                if (index !== -1) {
                    listeners[key].splice(index, 1);
                }
            }
        }

        return this;
    };

    /**
     * Alias of removeListener
     */
    proto.off = alias('removeListener');

    /**
     * Adds listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
     * You can also pass it a regular expression to add the array of listeners to all events that match it.
     * Yeah, this function does quite a bit. That's probably a bad thing.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListeners = function addListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(false, evt, listeners);
    };

    /**
     * Removes listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be removed.
     * You can also pass it a regular expression to remove the listeners from all events that match it.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListeners = function removeListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(true, evt, listeners);
    };

    /**
     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
     * The first argument will determine if the listeners are removed (true) or added (false).
     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be added/removed.
     * You can also pass it a regular expression to manipulate the listeners of all events that match it.
     *
     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
        var i;
        var value;
        var single = remove ? this.removeListener : this.addListener;
        var multiple = remove ? this.removeListeners : this.addListeners;

        // If evt is an object then pass each of its properties to this method
        if (typeof evt === 'object' && !(evt instanceof RegExp)) {
            for (i in evt) {
                if (evt.hasOwnProperty(i) && (value = evt[i])) {
                    // Pass the single listener straight through to the singular method
                    if (typeof value === 'function') {
                        single.call(this, i, value);
                    }
                    else {
                        // Otherwise pass back to the multiple function
                        multiple.call(this, i, value);
                    }
                }
            }
        }
        else {
            // So evt must be a string
            // And listeners must be an array of listeners
            // Loop over it and pass each one to the multiple method
            i = listeners.length;
            while (i--) {
                single.call(this, evt, listeners[i]);
            }
        }

        return this;
    };

    /**
     * Removes all listeners from a specified event.
     * If you do not specify an event then all listeners will be removed.
     * That means every event will be emptied.
     * You can also pass a regex to remove all events that match it.
     *
     * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeEvent = function removeEvent(evt) {
        var type = typeof evt;
        var events = this._getEvents();
        var key;

        // Remove different things depending on the state of evt
        if (type === 'string') {
            // Remove all listeners for the specified event
            delete events[evt];
        }
        else if (evt instanceof RegExp) {
            // Remove all events matching the regex.
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    delete events[key];
                }
            }
        }
        else {
            // Remove all listeners in all events
            delete this._events;
        }

        return this;
    };

    /**
     * Alias of removeEvent.
     *
     * Added to mirror the node API.
     */
    proto.removeAllListeners = alias('removeEvent');

    /**
     * Emits an event of your choice.
     * When emitted, every listener attached to that event will be executed.
     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
     * So they will not arrive within the array on the other side, they will be separate.
     * You can also pass a regular expression to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {Array} [args] Optional array of arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emitEvent = function emitEvent(evt, args) {
        var listeners = this.getListenersAsObject(evt);
        var listener;
        var i;
        var key;
        var response;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                i = listeners[key].length;

                while (i--) {
                    // If the listener returns true then it shall be removed from the event
                    // The function is executed either with a basic call or an apply if there is an args array
                    listener = listeners[key][i];

                    if (listener.once === true) {
                        this.removeListener(evt, listener.listener);
                    }

                    response = listener.listener.apply(this, args || []);

                    if (response === this._getOnceReturnValue()) {
                        this.removeListener(evt, listener.listener);
                    }
                }
            }
        }

        return this;
    };

    /**
     * Alias of emitEvent
     */
    proto.trigger = alias('emitEvent');

    /**
     * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
     * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {...*} Optional additional arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emit = function emit(evt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(evt, args);
    };

    /**
     * Sets the current value to check against when executing listeners. If a
     * listeners return value matches the one set here then it will be removed
     * after execution. This value defaults to true.
     *
     * @param {*} value The new value to check for when executing listeners.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.setOnceReturnValue = function setOnceReturnValue(value) {
        this._onceReturnValue = value;
        return this;
    };

    /**
     * Fetches the current value to check against when executing listeners. If
     * the listeners return value matches this one then it should be removed
     * automatically. It will return true by default.
     *
     * @return {*|Boolean} The current value to check for or the default, true.
     * @api private
     */
    proto._getOnceReturnValue = function _getOnceReturnValue() {
        if (this.hasOwnProperty('_onceReturnValue')) {
            return this._onceReturnValue;
        }
        else {
            return true;
        }
    };

    /**
     * Fetches the events object and creates one if required.
     *
     * @return {Object} The events storage object.
     * @api private
     */
    proto._getEvents = function _getEvents() {
        return this._events || (this._events = {});
    };

    /**
     * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
     *
     * @return {Function} Non conflicting EventEmitter class.
     */
    EventEmitter.noConflict = function noConflict() {
        exports.EventEmitter = originalGlobalValue;
        return EventEmitter;
    };

    // Expose the class either via AMD, CommonJS or the global object
    if (typeof define === 'function' && define.amd) {
        define('eventEmitter/EventEmitter',[],function () {
            return EventEmitter;
        });
    }
    else if (typeof module === 'object' && module.exports){
        module.exports = EventEmitter;
    }
    else {
        exports.EventEmitter = EventEmitter;
    }
}.call(this));

/*!
 * getStyleProperty v1.0.4
 * original by kangax
 * http://perfectionkills.com/feature-testing-css-properties/
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false, exports: false, module: false */

( function( window ) {



var prefixes = 'Webkit Moz ms Ms O'.split(' ');
var docElemStyle = document.documentElement.style;

function getStyleProperty( propName ) {
  if ( !propName ) {
    return;
  }

  // test standard property first
  if ( typeof docElemStyle[ propName ] === 'string' ) {
    return propName;
  }

  // capitalize
  propName = propName.charAt(0).toUpperCase() + propName.slice(1);

  // test vendor specific properties
  var prefixed;
  for ( var i=0, len = prefixes.length; i < len; i++ ) {
    prefixed = prefixes[i] + propName;
    if ( typeof docElemStyle[ prefixed ] === 'string' ) {
      return prefixed;
    }
  }
}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'get-style-property/get-style-property',[],function() {
    return getStyleProperty;
  });
} else if ( typeof exports === 'object' ) {
  // CommonJS for Component
  module.exports = getStyleProperty;
} else {
  // browser global
  window.getStyleProperty = getStyleProperty;
}

})( window );

/*!
 * getSize v1.2.2
 * measure size of elements
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, exports: false, require: false, module: false, console: false */

( function( window, undefined ) {



// -------------------------- helpers -------------------------- //

// get a number from a string, not a percentage
function getStyleSize( value ) {
  var num = parseFloat( value );
  // not a percent like '100%', and a number
  var isValid = value.indexOf('%') === -1 && !isNaN( num );
  return isValid && num;
}

function noop() {}

var logError = typeof console === 'undefined' ? noop :
  function( message ) {
    console.error( message );
  };

// -------------------------- measurements -------------------------- //

var measurements = [
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'marginBottom',
  'borderLeftWidth',
  'borderRightWidth',
  'borderTopWidth',
  'borderBottomWidth'
];

function getZeroSize() {
  var size = {
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0,
    outerWidth: 0,
    outerHeight: 0
  };
  for ( var i=0, len = measurements.length; i < len; i++ ) {
    var measurement = measurements[i];
    size[ measurement ] = 0;
  }
  return size;
}



function defineGetSize( getStyleProperty ) {

// -------------------------- setup -------------------------- //

var isSetup = false;

var getStyle, boxSizingProp, isBoxSizeOuter;

/**
 * setup vars and functions
 * do it on initial getSize(), rather than on script load
 * For Firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=548397
 */
function setup() {
  // setup once
  if ( isSetup ) {
    return;
  }
  isSetup = true;

  var getComputedStyle = window.getComputedStyle;
  getStyle = ( function() {
    var getStyleFn = getComputedStyle ?
      function( elem ) {
        return getComputedStyle( elem, null );
      } :
      function( elem ) {
        return elem.currentStyle;
      };

      return function getStyle( elem ) {
        var style = getStyleFn( elem );
        if ( !style ) {
          logError( 'Style returned ' + style +
            '. Are you running this code in a hidden iframe on Firefox? ' +
            'See http://bit.ly/getsizebug1' );
        }
        return style;
      };
  })();

  // -------------------------- box sizing -------------------------- //

  boxSizingProp = getStyleProperty('boxSizing');

  /**
   * WebKit measures the outer-width on style.width on border-box elems
   * IE & Firefox measures the inner-width
   */
  if ( boxSizingProp ) {
    var div = document.createElement('div');
    div.style.width = '200px';
    div.style.padding = '1px 2px 3px 4px';
    div.style.borderStyle = 'solid';
    div.style.borderWidth = '1px 2px 3px 4px';
    div.style[ boxSizingProp ] = 'border-box';

    var body = document.body || document.documentElement;
    body.appendChild( div );
    var style = getStyle( div );

    isBoxSizeOuter = getStyleSize( style.width ) === 200;
    body.removeChild( div );
  }

}

// -------------------------- getSize -------------------------- //

function getSize( elem ) {
  setup();

  // use querySeletor if elem is string
  if ( typeof elem === 'string' ) {
    elem = document.querySelector( elem );
  }

  // do not proceed on non-objects
  if ( !elem || typeof elem !== 'object' || !elem.nodeType ) {
    return;
  }

  var style = getStyle( elem );

  // if hidden, everything is 0
  if ( style.display === 'none' ) {
    return getZeroSize();
  }

  var size = {};
  size.width = elem.offsetWidth;
  size.height = elem.offsetHeight;

  var isBorderBox = size.isBorderBox = !!( boxSizingProp &&
    style[ boxSizingProp ] && style[ boxSizingProp ] === 'border-box' );

  // get all measurements
  for ( var i=0, len = measurements.length; i < len; i++ ) {
    var measurement = measurements[i];
    var value = style[ measurement ];
    value = mungeNonPixel( elem, value );
    var num = parseFloat( value );
    // any 'auto', 'medium' value will be 0
    size[ measurement ] = !isNaN( num ) ? num : 0;
  }

  var paddingWidth = size.paddingLeft + size.paddingRight;
  var paddingHeight = size.paddingTop + size.paddingBottom;
  var marginWidth = size.marginLeft + size.marginRight;
  var marginHeight = size.marginTop + size.marginBottom;
  var borderWidth = size.borderLeftWidth + size.borderRightWidth;
  var borderHeight = size.borderTopWidth + size.borderBottomWidth;

  var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;

  // overwrite width and height if we can get it from style
  var styleWidth = getStyleSize( style.width );
  if ( styleWidth !== false ) {
    size.width = styleWidth +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth );
  }

  var styleHeight = getStyleSize( style.height );
  if ( styleHeight !== false ) {
    size.height = styleHeight +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight );
  }

  size.innerWidth = size.width - ( paddingWidth + borderWidth );
  size.innerHeight = size.height - ( paddingHeight + borderHeight );

  size.outerWidth = size.width + marginWidth;
  size.outerHeight = size.height + marginHeight;

  return size;
}

// IE8 returns percent values, not pixels
// taken from jQuery's curCSS
function mungeNonPixel( elem, value ) {
  // IE8 and has percent value
  if ( window.getComputedStyle || value.indexOf('%') === -1 ) {
    return value;
  }
  var style = elem.style;
  // Remember the original values
  var left = style.left;
  var rs = elem.runtimeStyle;
  var rsLeft = rs && rs.left;

  // Put in the new values to get a computed value out
  if ( rsLeft ) {
    rs.left = elem.currentStyle.left;
  }
  style.left = value;
  value = style.pixelLeft;

  // Revert the changed values
  style.left = left;
  if ( rsLeft ) {
    rs.left = rsLeft;
  }

  return value;
}

return getSize;

}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD for RequireJS
  define( 'get-size/get-size',[ 'get-style-property/get-style-property' ], defineGetSize );
} else if ( typeof exports === 'object' ) {
  // CommonJS for Component
  module.exports = defineGetSize( require('desandro-get-style-property') );
} else {
  // browser global
  window.getSize = defineGetSize( window.getStyleProperty );
}

})( window );

/*!
 * docReady v1.0.4
 * Cross browser DOMContentLoaded event emitter
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true*/
/*global define: false, require: false, module: false */

( function( window ) {



var document = window.document;
// collection of functions to be triggered on ready
var queue = [];

function docReady( fn ) {
  // throw out non-functions
  if ( typeof fn !== 'function' ) {
    return;
  }

  if ( docReady.isReady ) {
    // ready now, hit it
    fn();
  } else {
    // queue function when ready
    queue.push( fn );
  }
}

docReady.isReady = false;

// triggered on various doc ready events
function onReady( event ) {
  // bail if already triggered or IE8 document is not ready just yet
  var isIE8NotReady = event.type === 'readystatechange' && document.readyState !== 'complete';
  if ( docReady.isReady || isIE8NotReady ) {
    return;
  }

  trigger();
}

function trigger() {
  docReady.isReady = true;
  // process queue
  for ( var i=0, len = queue.length; i < len; i++ ) {
    var fn = queue[i];
    fn();
  }
}

function defineDocReady( eventie ) {
  // trigger ready if page is ready
  if ( document.readyState === 'complete' ) {
    trigger();
  } else {
    // listen for events
    eventie.bind( document, 'DOMContentLoaded', onReady );
    eventie.bind( document, 'readystatechange', onReady );
    eventie.bind( window, 'load', onReady );
  }

  return docReady;
}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'doc-ready/doc-ready',[ 'eventie/eventie' ], defineDocReady );
} else if ( typeof exports === 'object' ) {
  module.exports = defineDocReady( require('eventie') );
} else {
  // browser global
  window.docReady = defineDocReady( window.eventie );
}

})( window );

/**
 * matchesSelector v1.0.3
 * matchesSelector( element, '.selector' )
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, module: false */

( function( ElemProto ) {

  

  var matchesMethod = ( function() {
    // check for the standard method name first
    if ( ElemProto.matches ) {
      return 'matches';
    }
    // check un-prefixed
    if ( ElemProto.matchesSelector ) {
      return 'matchesSelector';
    }
    // check vendor prefixes
    var prefixes = [ 'webkit', 'moz', 'ms', 'o' ];

    for ( var i=0, len = prefixes.length; i < len; i++ ) {
      var prefix = prefixes[i];
      var method = prefix + 'MatchesSelector';
      if ( ElemProto[ method ] ) {
        return method;
      }
    }
  })();

  // ----- match ----- //

  function match( elem, selector ) {
    return elem[ matchesMethod ]( selector );
  }

  // ----- appendToFragment ----- //

  function checkParent( elem ) {
    // not needed if already has parent
    if ( elem.parentNode ) {
      return;
    }
    var fragment = document.createDocumentFragment();
    fragment.appendChild( elem );
  }

  // ----- query ----- //

  // fall back to using QSA
  // thx @jonathantneal https://gist.github.com/3062955
  function query( elem, selector ) {
    // append to fragment if no parent
    checkParent( elem );

    // match elem with all selected elems of parent
    var elems = elem.parentNode.querySelectorAll( selector );
    for ( var i=0, len = elems.length; i < len; i++ ) {
      // return true if match
      if ( elems[i] === elem ) {
        return true;
      }
    }
    // otherwise return false
    return false;
  }

  // ----- matchChild ----- //

  function matchChild( elem, selector ) {
    checkParent( elem );
    return match( elem, selector );
  }

  // ----- matchesSelector ----- //

  var matchesSelector;

  if ( matchesMethod ) {
    // IE9 supports matchesSelector, but doesn't work on orphaned elems
    // check for that
    var div = document.createElement('div');
    var supportsOrphans = match( div, 'div' );
    matchesSelector = supportsOrphans ? match : matchChild;
  } else {
    matchesSelector = query;
  }

  // transport
  if ( typeof define === 'function' && define.amd ) {
    // AMD
    define( 'matches-selector/matches-selector',[],function() {
      return matchesSelector;
    });
  } else if ( typeof exports === 'object' ) {
    module.exports = matchesSelector;
  }
  else {
    // browser global
    window.matchesSelector = matchesSelector;
  }

})( Element.prototype );

/**
 * Fizzy UI utils v1.0.1
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true, strict: true */

( function( window, factory ) {
  /*global define: false, module: false, require: false */
  
  // universal module definition

  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( 'fizzy-ui-utils/utils',[
      'doc-ready/doc-ready',
      'matches-selector/matches-selector'
    ], function( docReady, matchesSelector ) {
      return factory( window, docReady, matchesSelector );
    });
  } else if ( typeof exports == 'object' ) {
    // CommonJS
    module.exports = factory(
      window,
      require('doc-ready'),
      require('desandro-matches-selector')
    );
  } else {
    // browser global
    window.fizzyUIUtils = factory(
      window,
      window.docReady,
      window.matchesSelector
    );
  }

}( window, function factory( window, docReady, matchesSelector ) {



var utils = {};

// ----- extend ----- //

// extends objects
utils.extend = function( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
};

// ----- modulo ----- //

utils.modulo = function( num, div ) {
  return ( ( num % div ) + div ) % div;
};

// ----- isArray ----- //
  
var objToString = Object.prototype.toString;
utils.isArray = function( obj ) {
  return objToString.call( obj ) == '[object Array]';
};

// ----- makeArray ----- //

// turn element or nodeList into an array
utils.makeArray = function( obj ) {
  var ary = [];
  if ( utils.isArray( obj ) ) {
    // use object if already an array
    ary = obj;
  } else if ( obj && typeof obj.length == 'number' ) {
    // convert nodeList to array
    for ( var i=0, len = obj.length; i < len; i++ ) {
      ary.push( obj[i] );
    }
  } else {
    // array of single index
    ary.push( obj );
  }
  return ary;
};

// ----- indexOf ----- //

// index of helper cause IE8
utils.indexOf = Array.prototype.indexOf ? function( ary, obj ) {
    return ary.indexOf( obj );
  } : function( ary, obj ) {
    for ( var i=0, len = ary.length; i < len; i++ ) {
      if ( ary[i] === obj ) {
        return i;
      }
    }
    return -1;
  };

// ----- removeFrom ----- //

utils.removeFrom = function( ary, obj ) {
  var index = utils.indexOf( ary, obj );
  if ( index != -1 ) {
    ary.splice( index, 1 );
  }
};

// ----- isElement ----- //

// http://stackoverflow.com/a/384380/182183
utils.isElement = ( typeof HTMLElement == 'function' || typeof HTMLElement == 'object' ) ?
  function isElementDOM2( obj ) {
    return obj instanceof HTMLElement;
  } :
  function isElementQuirky( obj ) {
    return obj && typeof obj == 'object' &&
      obj.nodeType == 1 && typeof obj.nodeName == 'string';
  };

// ----- setText ----- //

utils.setText = ( function() {
  var setTextProperty;
  function setText( elem, text ) {
    // only check setTextProperty once
    setTextProperty = setTextProperty || ( document.documentElement.textContent !== undefined ? 'textContent' : 'innerText' );
    elem[ setTextProperty ] = text;
  }
  return setText;
})();

// ----- getParent ----- //

utils.getParent = function( elem, selector ) {
  while ( elem != document.body ) {
    elem = elem.parentNode;
    if ( matchesSelector( elem, selector ) ) {
      return elem;
    }
  }
};

// ----- getQueryElement ----- //

// use element as selector string
utils.getQueryElement = function( elem ) {
  if ( typeof elem == 'string' ) {
    return document.querySelector( elem );
  }
  return elem;
};

// ----- handleEvent ----- //

// enable .ontype to trigger from .addEventListener( elem, 'type' )
utils.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

// ----- filterFindElements ----- //

utils.filterFindElements = function( elems, selector ) {
  // make array of elems
  elems = utils.makeArray( elems );
  var ffElems = [];

  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    // check that elem is an actual element
    if ( !utils.isElement( elem ) ) {
      continue;
    }
    // filter & find items if we have a selector
    if ( selector ) {
      // filter siblings
      if ( matchesSelector( elem, selector ) ) {
        ffElems.push( elem );
      }
      // find children
      var childElems = elem.querySelectorAll( selector );
      // concat childElems to filterFound array
      for ( var j=0, jLen = childElems.length; j < jLen; j++ ) {
        ffElems.push( childElems[j] );
      }
    } else {
      ffElems.push( elem );
    }
  }

  return ffElems;
};

// ----- debounceMethod ----- //

utils.debounceMethod = function( _class, methodName, threshold ) {
  // original method
  var method = _class.prototype[ methodName ];
  var timeoutName = methodName + 'Timeout';

  _class.prototype[ methodName ] = function() {
    var timeout = this[ timeoutName ];
    if ( timeout ) {
      clearTimeout( timeout );
    }
    var args = arguments;

    var _this = this;
    this[ timeoutName ] = setTimeout( function() {
      method.apply( _this, args );
      delete _this[ timeoutName ];
    }, threshold || 100 );
  };
};

// ----- htmlInit ----- //

// http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
utils.toDashed = function( str ) {
  return str.replace( /(.)([A-Z])/g, function( match, $1, $2 ) {
    return $1 + '-' + $2;
  }).toLowerCase();
};

var console = window.console;
/**
 * allow user to initialize classes via .js-namespace class
 * htmlInit( Widget, 'widgetName' )
 * options are parsed from data-namespace-option attribute
 */
utils.htmlInit = function( WidgetClass, namespace ) {
  docReady( function() {
    var dashedNamespace = utils.toDashed( namespace );
    var elems = document.querySelectorAll( '.js-' + dashedNamespace );
    var dataAttr = 'data-' + dashedNamespace + '-options';

    for ( var i=0, len = elems.length; i < len; i++ ) {
      var elem = elems[i];
      var attr = elem.getAttribute( dataAttr );
      var options;
      try {
        options = attr && JSON.parse( attr );
      } catch ( error ) {
        // log error, do not initialize
        if ( console ) {
          console.error( 'Error parsing ' + dataAttr + ' on ' +
            elem.nodeName.toLowerCase() + ( elem.id ? '#' + elem.id : '' ) + ': ' +
            error );
        }
        continue;
      }
      // initialize
      var instance = new WidgetClass( elem, options );
      // make available via $().data('layoutname')
      var jQuery = window.jQuery;
      if ( jQuery ) {
        jQuery.data( elem, namespace, instance );
      }
    }
  });
};

// -----  ----- //

return utils;

}));

/**
 * Outlayer Item
 */

( function( window, factory ) {
  
  // universal module definition
  if ( typeof define === 'function' && define.amd ) {
    // AMD
    define( 'outlayer/item',[
        'eventEmitter/EventEmitter',
        'get-size/get-size',
        'get-style-property/get-style-property',
        'fizzy-ui-utils/utils'
      ],
      function( EventEmitter, getSize, getStyleProperty, utils ) {
        return factory( window, EventEmitter, getSize, getStyleProperty, utils );
      }
    );
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory(
      window,
      require('wolfy87-eventemitter'),
      require('get-size'),
      require('desandro-get-style-property'),
      require('fizzy-ui-utils')
    );
  } else {
    // browser global
    window.Outlayer = {};
    window.Outlayer.Item = factory(
      window,
      window.EventEmitter,
      window.getSize,
      window.getStyleProperty,
      window.fizzyUIUtils
    );
  }

}( window, function factory( window, EventEmitter, getSize, getStyleProperty, utils ) {


// ----- helpers ----- //

var getComputedStyle = window.getComputedStyle;
var getStyle = getComputedStyle ?
  function( elem ) {
    return getComputedStyle( elem, null );
  } :
  function( elem ) {
    return elem.currentStyle;
  };


function isEmptyObj( obj ) {
  for ( var prop in obj ) {
    return false;
  }
  prop = null;
  return true;
}

// -------------------------- CSS3 support -------------------------- //

var transitionProperty = getStyleProperty('transition');
var transformProperty = getStyleProperty('transform');
var supportsCSS3 = transitionProperty && transformProperty;
var is3d = !!getStyleProperty('perspective');

var transitionEndEvent = {
  WebkitTransition: 'webkitTransitionEnd',
  MozTransition: 'transitionend',
  OTransition: 'otransitionend',
  transition: 'transitionend'
}[ transitionProperty ];

// properties that could have vendor prefix
var prefixableProperties = [
  'transform',
  'transition',
  'transitionDuration',
  'transitionProperty'
];

// cache all vendor properties
var vendorProperties = ( function() {
  var cache = {};
  for ( var i=0, len = prefixableProperties.length; i < len; i++ ) {
    var prop = prefixableProperties[i];
    var supportedProp = getStyleProperty( prop );
    if ( supportedProp && supportedProp !== prop ) {
      cache[ prop ] = supportedProp;
    }
  }
  return cache;
})();

// -------------------------- Item -------------------------- //

function Item( element, layout ) {
  if ( !element ) {
    return;
  }

  this.element = element;
  // parent layout class, i.e. Masonry, Isotope, or Packery
  this.layout = layout;
  this.position = {
    x: 0,
    y: 0
  };

  this._create();
}

// inherit EventEmitter
utils.extend( Item.prototype, EventEmitter.prototype );

Item.prototype._create = function() {
  // transition objects
  this._transn = {
    ingProperties: {},
    clean: {},
    onEnd: {}
  };

  this.css({
    position: 'absolute'
  });
};

// trigger specified handler for event type
Item.prototype.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

Item.prototype.getSize = function() {
  this.size = getSize( this.element );
};

/**
 * apply CSS styles to element
 * @param {Object} style
 */
Item.prototype.css = function( style ) {
  var elemStyle = this.element.style;

  for ( var prop in style ) {
    // use vendor property if available
    var supportedProp = vendorProperties[ prop ] || prop;
    elemStyle[ supportedProp ] = style[ prop ];
  }
};

 // measure position, and sets it
Item.prototype.getPosition = function() {
  var style = getStyle( this.element );
  var layoutOptions = this.layout.options;
  var isOriginLeft = layoutOptions.isOriginLeft;
  var isOriginTop = layoutOptions.isOriginTop;
  var x = parseInt( style[ isOriginLeft ? 'left' : 'right' ], 10 );
  var y = parseInt( style[ isOriginTop ? 'top' : 'bottom' ], 10 );

  // clean up 'auto' or other non-integer values
  x = isNaN( x ) ? 0 : x;
  y = isNaN( y ) ? 0 : y;
  // remove padding from measurement
  var layoutSize = this.layout.size;
  x -= isOriginLeft ? layoutSize.paddingLeft : layoutSize.paddingRight;
  y -= isOriginTop ? layoutSize.paddingTop : layoutSize.paddingBottom;

  this.position.x = x;
  this.position.y = y;
};

// set settled position, apply padding
Item.prototype.layoutPosition = function() {
  var layoutSize = this.layout.size;
  var layoutOptions = this.layout.options;
  var style = {};

  // x
  var xPadding = layoutOptions.isOriginLeft ? 'paddingLeft' : 'paddingRight';
  var xProperty = layoutOptions.isOriginLeft ? 'left' : 'right';
  var xResetProperty = layoutOptions.isOriginLeft ? 'right' : 'left';

  var x = this.position.x + layoutSize[ xPadding ];
  // set in percentage
  x = layoutOptions.percentPosition && !layoutOptions.isHorizontal ?
    ( ( x / layoutSize.width ) * 100 ) + '%' : x + 'px';
  style[ xProperty ] = x;
  // reset other property
  style[ xResetProperty ] = '';

  // y
  var yPadding = layoutOptions.isOriginTop ? 'paddingTop' : 'paddingBottom';
  var yProperty = layoutOptions.isOriginTop ? 'top' : 'bottom';
  var yResetProperty = layoutOptions.isOriginTop ? 'bottom' : 'top';

  var y = this.position.y + layoutSize[ yPadding ];
  // set in percentage
  y = layoutOptions.percentPosition && layoutOptions.isHorizontal ?
    ( ( y / layoutSize.height ) * 100 ) + '%' : y + 'px';
  style[ yProperty ] = y;
  // reset other property
  style[ yResetProperty ] = '';

  this.css( style );
  this.emitEvent( 'layout', [ this ] );
};


// transform translate function
var translate = is3d ?
  function( x, y ) {
    return 'translate3d(' + x + 'px, ' + y + 'px, 0)';
  } :
  function( x, y ) {
    return 'translate(' + x + 'px, ' + y + 'px)';
  };


Item.prototype._transitionTo = function( x, y ) {
  this.getPosition();
  // get current x & y from top/left
  var curX = this.position.x;
  var curY = this.position.y;

  var compareX = parseInt( x, 10 );
  var compareY = parseInt( y, 10 );
  var didNotMove = compareX === this.position.x && compareY === this.position.y;

  // save end position
  this.setPosition( x, y );

  // if did not move and not transitioning, just go to layout
  if ( didNotMove && !this.isTransitioning ) {
    this.layoutPosition();
    return;
  }

  var transX = x - curX;
  var transY = y - curY;
  var transitionStyle = {};
  // flip cooridinates if origin on right or bottom
  var layoutOptions = this.layout.options;
  transX = layoutOptions.isOriginLeft ? transX : -transX;
  transY = layoutOptions.isOriginTop ? transY : -transY;
  transitionStyle.transform = translate( transX, transY );

  this.transition({
    to: transitionStyle,
    onTransitionEnd: {
      transform: this.layoutPosition
    },
    isCleaning: true
  });
};

// non transition + transform support
Item.prototype.goTo = function( x, y ) {
  this.setPosition( x, y );
  this.layoutPosition();
};

// use transition and transforms if supported
Item.prototype.moveTo = supportsCSS3 ?
  Item.prototype._transitionTo : Item.prototype.goTo;

Item.prototype.setPosition = function( x, y ) {
  this.position.x = parseInt( x, 10 );
  this.position.y = parseInt( y, 10 );
};

// ----- transition ----- //

/**
 * @param {Object} style - CSS
 * @param {Function} onTransitionEnd
 */

// non transition, just trigger callback
Item.prototype._nonTransition = function( args ) {
  this.css( args.to );
  if ( args.isCleaning ) {
    this._removeStyles( args.to );
  }
  for ( var prop in args.onTransitionEnd ) {
    args.onTransitionEnd[ prop ].call( this );
  }
};

/**
 * proper transition
 * @param {Object} args - arguments
 *   @param {Object} to - style to transition to
 *   @param {Object} from - style to start transition from
 *   @param {Boolean} isCleaning - removes transition styles after transition
 *   @param {Function} onTransitionEnd - callback
 */
Item.prototype._transition = function( args ) {
  // redirect to nonTransition if no transition duration
  if ( !parseFloat( this.layout.options.transitionDuration ) ) {
    this._nonTransition( args );
    return;
  }

  var _transition = this._transn;
  // keep track of onTransitionEnd callback by css property
  for ( var prop in args.onTransitionEnd ) {
    _transition.onEnd[ prop ] = args.onTransitionEnd[ prop ];
  }
  // keep track of properties that are transitioning
  for ( prop in args.to ) {
    _transition.ingProperties[ prop ] = true;
    // keep track of properties to clean up when transition is done
    if ( args.isCleaning ) {
      _transition.clean[ prop ] = true;
    }
  }

  // set from styles
  if ( args.from ) {
    this.css( args.from );
    // force redraw. http://blog.alexmaccaw.com/css-transitions
    var h = this.element.offsetHeight;
    // hack for JSHint to hush about unused var
    h = null;
  }
  // enable transition
  this.enableTransition( args.to );
  // set styles that are transitioning
  this.css( args.to );

  this.isTransitioning = true;

};

var itemTransitionProperties = transformProperty && ( utils.toDashed( transformProperty ) +
  ',opacity' );

Item.prototype.enableTransition = function(/* style */) {
  // only enable if not already transitioning
  // bug in IE10 were re-setting transition style will prevent
  // transitionend event from triggering
  if ( this.isTransitioning ) {
    return;
  }

  // make transition: foo, bar, baz from style object
  // TODO uncomment this bit when IE10 bug is resolved
  // var transitionValue = [];
  // for ( var prop in style ) {
  //   // dash-ify camelCased properties like WebkitTransition
  //   transitionValue.push( toDash( prop ) );
  // }
  // enable transition styles
  // HACK always enable transform,opacity for IE10
  this.css({
    transitionProperty: itemTransitionProperties,
    transitionDuration: this.layout.options.transitionDuration
  });
  // listen for transition end event
  this.element.addEventListener( transitionEndEvent, this, false );
};

Item.prototype.transition = Item.prototype[ transitionProperty ? '_transition' : '_nonTransition' ];

// ----- events ----- //

Item.prototype.onwebkitTransitionEnd = function( event ) {
  this.ontransitionend( event );
};

Item.prototype.onotransitionend = function( event ) {
  this.ontransitionend( event );
};

// properties that I munge to make my life easier
var dashedVendorProperties = {
  '-webkit-transform': 'transform',
  '-moz-transform': 'transform',
  '-o-transform': 'transform'
};

Item.prototype.ontransitionend = function( event ) {
  // disregard bubbled events from children
  if ( event.target !== this.element ) {
    return;
  }
  var _transition = this._transn;
  // get property name of transitioned property, convert to prefix-free
  var propertyName = dashedVendorProperties[ event.propertyName ] || event.propertyName;

  // remove property that has completed transitioning
  delete _transition.ingProperties[ propertyName ];
  // check if any properties are still transitioning
  if ( isEmptyObj( _transition.ingProperties ) ) {
    // all properties have completed transitioning
    this.disableTransition();
  }
  // clean style
  if ( propertyName in _transition.clean ) {
    // clean up style
    this.element.style[ event.propertyName ] = '';
    delete _transition.clean[ propertyName ];
  }
  // trigger onTransitionEnd callback
  if ( propertyName in _transition.onEnd ) {
    var onTransitionEnd = _transition.onEnd[ propertyName ];
    onTransitionEnd.call( this );
    delete _transition.onEnd[ propertyName ];
  }

  this.emitEvent( 'transitionEnd', [ this ] );
};

Item.prototype.disableTransition = function() {
  this.removeTransitionStyles();
  this.element.removeEventListener( transitionEndEvent, this, false );
  this.isTransitioning = false;
};

/**
 * removes style property from element
 * @param {Object} style
**/
Item.prototype._removeStyles = function( style ) {
  // clean up transition styles
  var cleanStyle = {};
  for ( var prop in style ) {
    cleanStyle[ prop ] = '';
  }
  this.css( cleanStyle );
};

var cleanTransitionStyle = {
  transitionProperty: '',
  transitionDuration: ''
};

Item.prototype.removeTransitionStyles = function() {
  // remove transition
  this.css( cleanTransitionStyle );
};

// ----- show/hide/remove ----- //

// remove element from DOM
Item.prototype.removeElem = function() {
  this.element.parentNode.removeChild( this.element );
  // remove display: none
  this.css({ display: '' });
  this.emitEvent( 'remove', [ this ] );
};

Item.prototype.remove = function() {
  // just remove element if no transition support or no transition
  if ( !transitionProperty || !parseFloat( this.layout.options.transitionDuration ) ) {
    this.removeElem();
    return;
  }

  // start transition
  var _this = this;
  this.once( 'transitionEnd', function() {
    _this.removeElem();
  });
  this.hide();
};

Item.prototype.reveal = function() {
  delete this.isHidden;
  // remove display: none
  this.css({ display: '' });

  var options = this.layout.options;

  var onTransitionEnd = {};
  var transitionEndProperty = this.getHideRevealTransitionEndProperty('visibleStyle');
  onTransitionEnd[ transitionEndProperty ] = this.onRevealTransitionEnd;

  this.transition({
    from: options.hiddenStyle,
    to: options.visibleStyle,
    isCleaning: true,
    onTransitionEnd: onTransitionEnd
  });
};

Item.prototype.onRevealTransitionEnd = function() {
  // check if still visible
  // during transition, item may have been hidden
  if ( !this.isHidden ) {
    this.emitEvent('reveal');
  }
};

/**
 * get style property use for hide/reveal transition end
 * @param {String} styleProperty - hiddenStyle/visibleStyle
 * @returns {String}
 */
Item.prototype.getHideRevealTransitionEndProperty = function( styleProperty ) {
  var optionStyle = this.layout.options[ styleProperty ];
  // use opacity
  if ( optionStyle.opacity ) {
    return 'opacity';
  }
  // get first property
  for ( var prop in optionStyle ) {
    return prop;
  }
};

Item.prototype.hide = function() {
  // set flag
  this.isHidden = true;
  // remove display: none
  this.css({ display: '' });

  var options = this.layout.options;

  var onTransitionEnd = {};
  var transitionEndProperty = this.getHideRevealTransitionEndProperty('hiddenStyle');
  onTransitionEnd[ transitionEndProperty ] = this.onHideTransitionEnd;

  this.transition({
    from: options.visibleStyle,
    to: options.hiddenStyle,
    // keep hidden stuff hidden
    isCleaning: true,
    onTransitionEnd: onTransitionEnd
  });
};

Item.prototype.onHideTransitionEnd = function() {
  // check if still hidden
  // during transition, item may have been un-hidden
  if ( this.isHidden ) {
    this.css({ display: 'none' });
    this.emitEvent('hide');
  }
};

Item.prototype.destroy = function() {
  this.css({
    position: '',
    left: '',
    right: '',
    top: '',
    bottom: '',
    transition: '',
    transform: ''
  });
};

return Item;

}));

/*!
 * Outlayer v1.4.0
 * the brains and guts of a layout library
 * MIT license
 */

( function( window, factory ) {
  
  // universal module definition

  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( 'outlayer/outlayer',[
        'eventie/eventie',
        'eventEmitter/EventEmitter',
        'get-size/get-size',
        'fizzy-ui-utils/utils',
        './item'
      ],
      function( eventie, EventEmitter, getSize, utils, Item ) {
        return factory( window, eventie, EventEmitter, getSize, utils, Item);
      }
    );
  } else if ( typeof exports == 'object' ) {
    // CommonJS
    module.exports = factory(
      window,
      require('eventie'),
      require('wolfy87-eventemitter'),
      require('get-size'),
      require('fizzy-ui-utils'),
      require('./item')
    );
  } else {
    // browser global
    window.Outlayer = factory(
      window,
      window.eventie,
      window.EventEmitter,
      window.getSize,
      window.fizzyUIUtils,
      window.Outlayer.Item
    );
  }

}( window, function factory( window, eventie, EventEmitter, getSize, utils, Item ) {


// ----- vars ----- //

var console = window.console;
var jQuery = window.jQuery;
var noop = function() {};

// -------------------------- Outlayer -------------------------- //

// globally unique identifiers
var GUID = 0;
// internal store of all Outlayer intances
var instances = {};


/**
 * @param {Element, String} element
 * @param {Object} options
 * @constructor
 */
function Outlayer( element, options ) {
  var queryElement = utils.getQueryElement( element );
  if ( !queryElement ) {
    if ( console ) {
      console.error( 'Bad element for ' + this.constructor.namespace +
        ': ' + ( queryElement || element ) );
    }
    return;
  }
  this.element = queryElement;
  // add jQuery
  if ( jQuery ) {
    this.$element = jQuery( this.element );
  }

  // options
  this.options = utils.extend( {}, this.constructor.defaults );
  this.option( options );

  // add id for Outlayer.getFromElement
  var id = ++GUID;
  this.element.outlayerGUID = id; // expando
  instances[ id ] = this; // associate via id

  // kick it off
  this._create();

  if ( this.options.isInitLayout ) {
    this.layout();
  }
}

// settings are for internal use only
Outlayer.namespace = 'outlayer';
Outlayer.Item = Item;

// default options
Outlayer.defaults = {
  containerStyle: {
    position: 'relative'
  },
  isInitLayout: true,
  isOriginLeft: true,
  isOriginTop: true,
  isResizeBound: true,
  isResizingContainer: true,
  // item options
  transitionDuration: '0.4s',
  hiddenStyle: {
    opacity: 0,
    transform: 'scale(0.001)'
  },
  visibleStyle: {
    opacity: 1,
    transform: 'scale(1)'
  }
};

// inherit EventEmitter
utils.extend( Outlayer.prototype, EventEmitter.prototype );

/**
 * set options
 * @param {Object} opts
 */
Outlayer.prototype.option = function( opts ) {
  utils.extend( this.options, opts );
};

Outlayer.prototype._create = function() {
  // get items from children
  this.reloadItems();
  // elements that affect layout, but are not laid out
  this.stamps = [];
  this.stamp( this.options.stamp );
  // set container style
  utils.extend( this.element.style, this.options.containerStyle );

  // bind resize method
  if ( this.options.isResizeBound ) {
    this.bindResize();
  }
};

// goes through all children again and gets bricks in proper order
Outlayer.prototype.reloadItems = function() {
  // collection of item elements
  this.items = this._itemize( this.element.children );
};


/**
 * turn elements into Outlayer.Items to be used in layout
 * @param {Array or NodeList or HTMLElement} elems
 * @returns {Array} items - collection of new Outlayer Items
 */
Outlayer.prototype._itemize = function( elems ) {

  var itemElems = this._filterFindItemElements( elems );
  var Item = this.constructor.Item;

  // create new Outlayer Items for collection
  var items = [];
  for ( var i=0, len = itemElems.length; i < len; i++ ) {
    var elem = itemElems[i];
    var item = new Item( elem, this );
    items.push( item );
  }

  return items;
};

/**
 * get item elements to be used in layout
 * @param {Array or NodeList or HTMLElement} elems
 * @returns {Array} items - item elements
 */
Outlayer.prototype._filterFindItemElements = function( elems ) {
  return utils.filterFindElements( elems, this.options.itemSelector );
};

/**
 * getter method for getting item elements
 * @returns {Array} elems - collection of item elements
 */
Outlayer.prototype.getItemElements = function() {
  var elems = [];
  for ( var i=0, len = this.items.length; i < len; i++ ) {
    elems.push( this.items[i].element );
  }
  return elems;
};

// ----- init & layout ----- //

/**
 * lays out all items
 */
Outlayer.prototype.layout = function() {
  this._resetLayout();
  this._manageStamps();

  // don't animate first layout
  var isInstant = this.options.isLayoutInstant !== undefined ?
    this.options.isLayoutInstant : !this._isLayoutInited;
  this.layoutItems( this.items, isInstant );

  // flag for initalized
  this._isLayoutInited = true;
};

// _init is alias for layout
Outlayer.prototype._init = Outlayer.prototype.layout;

/**
 * logic before any new layout
 */
Outlayer.prototype._resetLayout = function() {
  this.getSize();
};


Outlayer.prototype.getSize = function() {
  this.size = getSize( this.element );
};

/**
 * get measurement from option, for columnWidth, rowHeight, gutter
 * if option is String -> get element from selector string, & get size of element
 * if option is Element -> get size of element
 * else use option as a number
 *
 * @param {String} measurement
 * @param {String} size - width or height
 * @private
 */
Outlayer.prototype._getMeasurement = function( measurement, size ) {
  var option = this.options[ measurement ];
  var elem;
  if ( !option ) {
    // default to 0
    this[ measurement ] = 0;
  } else {
    // use option as an element
    if ( typeof option === 'string' ) {
      elem = this.element.querySelector( option );
    } else if ( utils.isElement( option ) ) {
      elem = option;
    }
    // use size of element, if element
    this[ measurement ] = elem ? getSize( elem )[ size ] : option;
  }
};

/**
 * layout a collection of item elements
 * @api public
 */
Outlayer.prototype.layoutItems = function( items, isInstant ) {
  items = this._getItemsForLayout( items );

  this._layoutItems( items, isInstant );

  this._postLayout();
};

/**
 * get the items to be laid out
 * you may want to skip over some items
 * @param {Array} items
 * @returns {Array} items
 */
Outlayer.prototype._getItemsForLayout = function( items ) {
  var layoutItems = [];
  for ( var i=0, len = items.length; i < len; i++ ) {
    var item = items[i];
    if ( !item.isIgnored ) {
      layoutItems.push( item );
    }
  }
  return layoutItems;
};

/**
 * layout items
 * @param {Array} items
 * @param {Boolean} isInstant
 */
Outlayer.prototype._layoutItems = function( items, isInstant ) {
  this._emitCompleteOnItems( 'layout', items );

  if ( !items || !items.length ) {
    // no items, emit event with empty array
    return;
  }

  var queue = [];

  for ( var i=0, len = items.length; i < len; i++ ) {
    var item = items[i];
    // get x/y object from method
    var position = this._getItemLayoutPosition( item );
    // enqueue
    position.item = item;
    position.isInstant = isInstant || item.isLayoutInstant;
    queue.push( position );
  }

  this._processLayoutQueue( queue );
};

/**
 * get item layout position
 * @param {Outlayer.Item} item
 * @returns {Object} x and y position
 */
Outlayer.prototype._getItemLayoutPosition = function( /* item */ ) {
  return {
    x: 0,
    y: 0
  };
};

/**
 * iterate over array and position each item
 * Reason being - separating this logic prevents 'layout invalidation'
 * thx @paul_irish
 * @param {Array} queue
 */
Outlayer.prototype._processLayoutQueue = function( queue ) {
  for ( var i=0, len = queue.length; i < len; i++ ) {
    var obj = queue[i];
    this._positionItem( obj.item, obj.x, obj.y, obj.isInstant );
  }
};

/**
 * Sets position of item in DOM
 * @param {Outlayer.Item} item
 * @param {Number} x - horizontal position
 * @param {Number} y - vertical position
 * @param {Boolean} isInstant - disables transitions
 */
Outlayer.prototype._positionItem = function( item, x, y, isInstant ) {
  if ( isInstant ) {
    // if not transition, just set CSS
    item.goTo( x, y );
  } else {
    item.moveTo( x, y );
  }
};

/**
 * Any logic you want to do after each layout,
 * i.e. size the container
 */
Outlayer.prototype._postLayout = function() {
  this.resizeContainer();
};

Outlayer.prototype.resizeContainer = function() {
  if ( !this.options.isResizingContainer ) {
    return;
  }
  var size = this._getContainerSize();
  if ( size ) {
    this._setContainerMeasure( size.width, true );
    this._setContainerMeasure( size.height, false );
  }
};

/**
 * Sets width or height of container if returned
 * @returns {Object} size
 *   @param {Number} width
 *   @param {Number} height
 */
Outlayer.prototype._getContainerSize = noop;

/**
 * @param {Number} measure - size of width or height
 * @param {Boolean} isWidth
 */
Outlayer.prototype._setContainerMeasure = function( measure, isWidth ) {
  if ( measure === undefined ) {
    return;
  }

  var elemSize = this.size;
  // add padding and border width if border box
  if ( elemSize.isBorderBox ) {
    measure += isWidth ? elemSize.paddingLeft + elemSize.paddingRight +
      elemSize.borderLeftWidth + elemSize.borderRightWidth :
      elemSize.paddingBottom + elemSize.paddingTop +
      elemSize.borderTopWidth + elemSize.borderBottomWidth;
  }

  measure = Math.max( measure, 0 );
  this.element.style[ isWidth ? 'width' : 'height' ] = measure + 'px';
};

/**
 * emit eventComplete on a collection of items events
 * @param {String} eventName
 * @param {Array} items - Outlayer.Items
 */
Outlayer.prototype._emitCompleteOnItems = function( eventName, items ) {
  var _this = this;
  function onComplete() {
    _this.emitEvent( eventName + 'Complete', [ items ] );
  }

  var count = items.length;
  if ( !items || !count ) {
    onComplete();
    return;
  }

  var doneCount = 0;
  function tick() {
    doneCount++;
    if ( doneCount === count ) {
      onComplete();
    }
  }

  // bind callback
  for ( var i=0, len = items.length; i < len; i++ ) {
    var item = items[i];
    item.once( eventName, tick );
  }
};

// -------------------------- ignore & stamps -------------------------- //


/**
 * keep item in collection, but do not lay it out
 * ignored items do not get skipped in layout
 * @param {Element} elem
 */
Outlayer.prototype.ignore = function( elem ) {
  var item = this.getItem( elem );
  if ( item ) {
    item.isIgnored = true;
  }
};

/**
 * return item to layout collection
 * @param {Element} elem
 */
Outlayer.prototype.unignore = function( elem ) {
  var item = this.getItem( elem );
  if ( item ) {
    delete item.isIgnored;
  }
};

/**
 * adds elements to stamps
 * @param {NodeList, Array, Element, or String} elems
 */
Outlayer.prototype.stamp = function( elems ) {
  elems = this._find( elems );
  if ( !elems ) {
    return;
  }

  this.stamps = this.stamps.concat( elems );
  // ignore
  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    this.ignore( elem );
  }
};

/**
 * removes elements to stamps
 * @param {NodeList, Array, or Element} elems
 */
Outlayer.prototype.unstamp = function( elems ) {
  elems = this._find( elems );
  if ( !elems ){
    return;
  }

  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    // filter out removed stamp elements
    utils.removeFrom( this.stamps, elem );
    this.unignore( elem );
  }

};

/**
 * finds child elements
 * @param {NodeList, Array, Element, or String} elems
 * @returns {Array} elems
 */
Outlayer.prototype._find = function( elems ) {
  if ( !elems ) {
    return;
  }
  // if string, use argument as selector string
  if ( typeof elems === 'string' ) {
    elems = this.element.querySelectorAll( elems );
  }
  elems = utils.makeArray( elems );
  return elems;
};

Outlayer.prototype._manageStamps = function() {
  if ( !this.stamps || !this.stamps.length ) {
    return;
  }

  this._getBoundingRect();

  for ( var i=0, len = this.stamps.length; i < len; i++ ) {
    var stamp = this.stamps[i];
    this._manageStamp( stamp );
  }
};

// update boundingLeft / Top
Outlayer.prototype._getBoundingRect = function() {
  // get bounding rect for container element
  var boundingRect = this.element.getBoundingClientRect();
  var size = this.size;
  this._boundingRect = {
    left: boundingRect.left + size.paddingLeft + size.borderLeftWidth,
    top: boundingRect.top + size.paddingTop + size.borderTopWidth,
    right: boundingRect.right - ( size.paddingRight + size.borderRightWidth ),
    bottom: boundingRect.bottom - ( size.paddingBottom + size.borderBottomWidth )
  };
};

/**
 * @param {Element} stamp
**/
Outlayer.prototype._manageStamp = noop;

/**
 * get x/y position of element relative to container element
 * @param {Element} elem
 * @returns {Object} offset - has left, top, right, bottom
 */
Outlayer.prototype._getElementOffset = function( elem ) {
  var boundingRect = elem.getBoundingClientRect();
  var thisRect = this._boundingRect;
  var size = getSize( elem );
  var offset = {
    left: boundingRect.left - thisRect.left - size.marginLeft,
    top: boundingRect.top - thisRect.top - size.marginTop,
    right: thisRect.right - boundingRect.right - size.marginRight,
    bottom: thisRect.bottom - boundingRect.bottom - size.marginBottom
  };
  return offset;
};

// -------------------------- resize -------------------------- //

// enable event handlers for listeners
// i.e. resize -> onresize
Outlayer.prototype.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

/**
 * Bind layout to window resizing
 */
Outlayer.prototype.bindResize = function() {
  // bind just one listener
  if ( this.isResizeBound ) {
    return;
  }
  eventie.bind( window, 'resize', this );
  this.isResizeBound = true;
};

/**
 * Unbind layout to window resizing
 */
Outlayer.prototype.unbindResize = function() {
  if ( this.isResizeBound ) {
    eventie.unbind( window, 'resize', this );
  }
  this.isResizeBound = false;
};

// original debounce by John Hann
// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/

// this fires every resize
Outlayer.prototype.onresize = function() {
  if ( this.resizeTimeout ) {
    clearTimeout( this.resizeTimeout );
  }

  var _this = this;
  function delayed() {
    _this.resize();
    delete _this.resizeTimeout;
  }

  this.resizeTimeout = setTimeout( delayed, 100 );
};

// debounced, layout on resize
Outlayer.prototype.resize = function() {
  // don't trigger if size did not change
  // or if resize was unbound. See #9
  if ( !this.isResizeBound || !this.needsResizeLayout() ) {
    return;
  }

  this.layout();
};

/**
 * check if layout is needed post layout
 * @returns Boolean
 */
Outlayer.prototype.needsResizeLayout = function() {
  var size = getSize( this.element );
  // check that this.size and size are there
  // IE8 triggers resize on body size change, so they might not be
  var hasSizes = this.size && size;
  return hasSizes && size.innerWidth !== this.size.innerWidth;
};

// -------------------------- methods -------------------------- //

/**
 * add items to Outlayer instance
 * @param {Array or NodeList or Element} elems
 * @returns {Array} items - Outlayer.Items
**/
Outlayer.prototype.addItems = function( elems ) {
  var items = this._itemize( elems );
  // add items to collection
  if ( items.length ) {
    this.items = this.items.concat( items );
  }
  return items;
};

/**
 * Layout newly-appended item elements
 * @param {Array or NodeList or Element} elems
 */
Outlayer.prototype.appended = function( elems ) {
  var items = this.addItems( elems );
  if ( !items.length ) {
    return;
  }
  // layout and reveal just the new items
  this.layoutItems( items, true );
  this.reveal( items );
};

/**
 * Layout prepended elements
 * @param {Array or NodeList or Element} elems
 */
Outlayer.prototype.prepended = function( elems ) {
  var items = this._itemize( elems );
  if ( !items.length ) {
    return;
  }
  // add items to beginning of collection
  var previousItems = this.items.slice(0);
  this.items = items.concat( previousItems );
  // start new layout
  this._resetLayout();
  this._manageStamps();
  // layout new stuff without transition
  this.layoutItems( items, true );
  this.reveal( items );
  // layout previous items
  this.layoutItems( previousItems );
};

/**
 * reveal a collection of items
 * @param {Array of Outlayer.Items} items
 */
Outlayer.prototype.reveal = function( items ) {
  this._emitCompleteOnItems( 'reveal', items );

  var len = items && items.length;
  for ( var i=0; len && i < len; i++ ) {
    var item = items[i];
    item.reveal();
  }
};

/**
 * hide a collection of items
 * @param {Array of Outlayer.Items} items
 */
Outlayer.prototype.hide = function( items ) {
  this._emitCompleteOnItems( 'hide', items );

  var len = items && items.length;
  for ( var i=0; len && i < len; i++ ) {
    var item = items[i];
    item.hide();
  }
};

/**
 * reveal item elements
 * @param {Array}, {Element}, {NodeList} items
 */
Outlayer.prototype.revealItemElements = function( elems ) {
  var items = this.getItems( elems );
  this.reveal( items );
};

/**
 * hide item elements
 * @param {Array}, {Element}, {NodeList} items
 */
Outlayer.prototype.hideItemElements = function( elems ) {
  var items = this.getItems( elems );
  this.hide( items );
};

/**
 * get Outlayer.Item, given an Element
 * @param {Element} elem
 * @param {Function} callback
 * @returns {Outlayer.Item} item
 */
Outlayer.prototype.getItem = function( elem ) {
  // loop through items to get the one that matches
  for ( var i=0, len = this.items.length; i < len; i++ ) {
    var item = this.items[i];
    if ( item.element === elem ) {
      // return item
      return item;
    }
  }
};

/**
 * get collection of Outlayer.Items, given Elements
 * @param {Array} elems
 * @returns {Array} items - Outlayer.Items
 */
Outlayer.prototype.getItems = function( elems ) {
  elems = utils.makeArray( elems );
  var items = [];
  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    var item = this.getItem( elem );
    if ( item ) {
      items.push( item );
    }
  }

  return items;
};

/**
 * remove element(s) from instance and DOM
 * @param {Array or NodeList or Element} elems
 */
Outlayer.prototype.remove = function( elems ) {
  var removeItems = this.getItems( elems );

  this._emitCompleteOnItems( 'remove', removeItems );

  // bail if no items to remove
  if ( !removeItems || !removeItems.length ) {
    return;
  }

  for ( var i=0, len = removeItems.length; i < len; i++ ) {
    var item = removeItems[i];
    item.remove();
    // remove item from collection
    utils.removeFrom( this.items, item );
  }
};

// ----- destroy ----- //

// remove and disable Outlayer instance
Outlayer.prototype.destroy = function() {
  // clean up dynamic styles
  var style = this.element.style;
  style.height = '';
  style.position = '';
  style.width = '';
  // destroy items
  for ( var i=0, len = this.items.length; i < len; i++ ) {
    var item = this.items[i];
    item.destroy();
  }

  this.unbindResize();

  var id = this.element.outlayerGUID;
  delete instances[ id ]; // remove reference to instance by id
  delete this.element.outlayerGUID;
  // remove data for jQuery
  if ( jQuery ) {
    jQuery.removeData( this.element, this.constructor.namespace );
  }

};

// -------------------------- data -------------------------- //

/**
 * get Outlayer instance from element
 * @param {Element} elem
 * @returns {Outlayer}
 */
Outlayer.data = function( elem ) {
  elem = utils.getQueryElement( elem );
  var id = elem && elem.outlayerGUID;
  return id && instances[ id ];
};


// -------------------------- create Outlayer class -------------------------- //

/**
 * create a layout class
 * @param {String} namespace
 */
Outlayer.create = function( namespace, options ) {
  // sub-class Outlayer
  function Layout() {
    Outlayer.apply( this, arguments );
  }
  // inherit Outlayer prototype, use Object.create if there
  if ( Object.create ) {
    Layout.prototype = Object.create( Outlayer.prototype );
  } else {
    utils.extend( Layout.prototype, Outlayer.prototype );
  }
  // set contructor, used for namespace and Item
  Layout.prototype.constructor = Layout;

  Layout.defaults = utils.extend( {}, Outlayer.defaults );
  // apply new options
  utils.extend( Layout.defaults, options );
  // keep prototype.settings for backwards compatibility (Packery v1.2.0)
  Layout.prototype.settings = {};

  Layout.namespace = namespace;

  Layout.data = Outlayer.data;

  // sub-class Item
  Layout.Item = function LayoutItem() {
    Item.apply( this, arguments );
  };

  Layout.Item.prototype = new Item();

  // -------------------------- declarative -------------------------- //

  utils.htmlInit( Layout, namespace );

  // -------------------------- jQuery bridge -------------------------- //

  // make into jQuery plugin
  if ( jQuery && jQuery.bridget ) {
    jQuery.bridget( namespace, Layout );
  }

  return Layout;
};

// ----- fin ----- //

// back in global
Outlayer.Item = Item;

return Outlayer;

}));


/**
 * Isotope Item
**/

( function( window, factory ) {

  // universal module definition
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( 'isotope/js/item',[
        'outlayer/outlayer'
      ],
      factory );
  } else if ( typeof exports == 'object' ) {
    // CommonJS
    module.exports = factory(
      require('outlayer')
    );
  } else {
    // browser global
    window.Isotope = window.Isotope || {};
    window.Isotope.Item = factory(
      window.Outlayer
    );
  }

}( window, function factory( Outlayer ) {


// -------------------------- Item -------------------------- //

// sub-class Outlayer Item
function Item() {
  Outlayer.Item.apply( this, arguments );
}

Item.prototype = new Outlayer.Item();

Item.prototype._create = function() {
  // assign id, used for original-order sorting
  this.id = this.layout.itemGUID++;
  Outlayer.Item.prototype._create.call( this );
  this.sortData = {};
};

Item.prototype.updateSortData = function() {
  if ( this.isIgnored ) {
    return;
  }
  // default sorters
  this.sortData.id = this.id;
  // for backward compatibility
  this.sortData['original-order'] = this.id;
  this.sortData.random = Math.random();
  // go thru getSortData obj and apply the sorters
  var getSortData = this.layout.options.getSortData;
  var sorters = this.layout._sorters;
  for ( var key in getSortData ) {
    var sorter = sorters[ key ];
    this.sortData[ key ] = sorter( this.element, this );
  }
};

var _destroy = Item.prototype.destroy;
Item.prototype.destroy = function() {
  // call super
  _destroy.apply( this, arguments );
  // reset display, #741
  this.css({
    display: ''
  });
};

return Item;

}));

/**
 * Isotope LayoutMode
 */

( function( window, factory ) {
  
  // universal module definition

  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( 'isotope/js/layout-mode',[
        'get-size/get-size',
        'outlayer/outlayer'
      ],
      factory );
  } else if ( typeof exports == 'object' ) {
    // CommonJS
    module.exports = factory(
      require('get-size'),
      require('outlayer')
    );
  } else {
    // browser global
    window.Isotope = window.Isotope || {};
    window.Isotope.LayoutMode = factory(
      window.getSize,
      window.Outlayer
    );
  }

}( window, function factory( getSize, Outlayer ) {
  

  // layout mode class
  function LayoutMode( isotope ) {
    this.isotope = isotope;
    // link properties
    if ( isotope ) {
      this.options = isotope.options[ this.namespace ];
      this.element = isotope.element;
      this.items = isotope.filteredItems;
      this.size = isotope.size;
    }
  }

  /**
   * some methods should just defer to default Outlayer method
   * and reference the Isotope instance as `this`
  **/
  ( function() {
    var facadeMethods = [
      '_resetLayout',
      '_getItemLayoutPosition',
      '_manageStamp',
      '_getContainerSize',
      '_getElementOffset',
      'needsResizeLayout'
    ];

    for ( var i=0, len = facadeMethods.length; i < len; i++ ) {
      var methodName = facadeMethods[i];
      LayoutMode.prototype[ methodName ] = getOutlayerMethod( methodName );
    }

    function getOutlayerMethod( methodName ) {
      return function() {
        return Outlayer.prototype[ methodName ].apply( this.isotope, arguments );
      };
    }
  })();

  // -----  ----- //

  // for horizontal layout modes, check vertical size
  LayoutMode.prototype.needsVerticalResizeLayout = function() {
    // don't trigger if size did not change
    var size = getSize( this.isotope.element );
    // check that this.size and size are there
    // IE8 triggers resize on body size change, so they might not be
    var hasSizes = this.isotope.size && size;
    return hasSizes && size.innerHeight != this.isotope.size.innerHeight;
  };

  // ----- measurements ----- //

  LayoutMode.prototype._getMeasurement = function() {
    this.isotope._getMeasurement.apply( this, arguments );
  };

  LayoutMode.prototype.getColumnWidth = function() {
    this.getSegmentSize( 'column', 'Width' );
  };

  LayoutMode.prototype.getRowHeight = function() {
    this.getSegmentSize( 'row', 'Height' );
  };

  /**
   * get columnWidth or rowHeight
   * segment: 'column' or 'row'
   * size 'Width' or 'Height'
  **/
  LayoutMode.prototype.getSegmentSize = function( segment, size ) {
    var segmentName = segment + size;
    var outerSize = 'outer' + size;
    // columnWidth / outerWidth // rowHeight / outerHeight
    this._getMeasurement( segmentName, outerSize );
    // got rowHeight or columnWidth, we can chill
    if ( this[ segmentName ] ) {
      return;
    }
    // fall back to item of first element
    var firstItemSize = this.getFirstItemSize();
    this[ segmentName ] = firstItemSize && firstItemSize[ outerSize ] ||
      // or size of container
      this.isotope.size[ 'inner' + size ];
  };

  LayoutMode.prototype.getFirstItemSize = function() {
    var firstItem = this.isotope.filteredItems[0];
    return firstItem && firstItem.element && getSize( firstItem.element );
  };

  // ----- methods that should reference isotope ----- //

  LayoutMode.prototype.layout = function() {
    this.isotope.layout.apply( this.isotope, arguments );
  };

  LayoutMode.prototype.getSize = function() {
    this.isotope.getSize();
    this.size = this.isotope.size;
  };

  // -------------------------- create -------------------------- //

  LayoutMode.modes = {};

  LayoutMode.create = function( namespace, options ) {

    function Mode() {
      LayoutMode.apply( this, arguments );
    }

    Mode.prototype = new LayoutMode();

    // default options
    if ( options ) {
      Mode.options = options;
    }

    Mode.prototype.namespace = namespace;
    // register in Isotope
    LayoutMode.modes[ namespace ] = Mode;

    return Mode;
  };

  return LayoutMode;

}));

/*!
 * Masonry v3.3.0
 * Cascading grid layout library
 * http://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */

( function( window, factory ) {
  
  // universal module definition
  if ( typeof define === 'function' && define.amd ) {
    // AMD
    define( 'masonry/masonry',[
        'outlayer/outlayer',
        'get-size/get-size',
        'fizzy-ui-utils/utils'
      ],
      factory );
  } else if ( typeof exports === 'object' ) {
    // CommonJS
    module.exports = factory(
      require('outlayer'),
      require('get-size'),
      require('fizzy-ui-utils')
    );
  } else {
    // browser global
    window.Masonry = factory(
      window.Outlayer,
      window.getSize,
      window.fizzyUIUtils
    );
  }

}( window, function factory( Outlayer, getSize, utils ) {



// -------------------------- masonryDefinition -------------------------- //

  // create an Outlayer layout class
  var Masonry = Outlayer.create('masonry');

  Masonry.prototype._resetLayout = function() {
    this.getSize();
    this._getMeasurement( 'columnWidth', 'outerWidth' );
    this._getMeasurement( 'gutter', 'outerWidth' );
    this.measureColumns();

    // reset column Y
    var i = this.cols;
    this.colYs = [];
    while (i--) {
      this.colYs.push( 0 );
    }

    this.maxY = 0;
  };

  Masonry.prototype.measureColumns = function() {
    this.getContainerWidth();
    // if columnWidth is 0, default to outerWidth of first item
    if ( !this.columnWidth ) {
      var firstItem = this.items[0];
      var firstItemElem = firstItem && firstItem.element;
      // columnWidth fall back to item of first element
      this.columnWidth = firstItemElem && getSize( firstItemElem ).outerWidth ||
        // if first elem has no width, default to size of container
        this.containerWidth;
    }

    var columnWidth = this.columnWidth += this.gutter;

    // calculate columns
    var containerWidth = this.containerWidth + this.gutter;
    var cols = containerWidth / columnWidth;
    // fix rounding errors, typically with gutters
    var excess = columnWidth - containerWidth % columnWidth;
    // if overshoot is less than a pixel, round up, otherwise floor it
    var mathMethod = excess && excess < 1 ? 'round' : 'floor';
    cols = Math[ mathMethod ]( cols );
    this.cols = Math.max( cols, 1 );
  };

  Masonry.prototype.getContainerWidth = function() {
    // container is parent if fit width
    var container = this.options.isFitWidth ? this.element.parentNode : this.element;
    // check that this.size and size are there
    // IE8 triggers resize on body size change, so they might not be
    var size = getSize( container );
    this.containerWidth = size && size.innerWidth;
  };

  Masonry.prototype._getItemLayoutPosition = function( item ) {
    item.getSize();
    // how many columns does this brick span
    var remainder = item.size.outerWidth % this.columnWidth;
    var mathMethod = remainder && remainder < 1 ? 'round' : 'ceil';
    // round if off by 1 pixel, otherwise use ceil
    var colSpan = Math[ mathMethod ]( item.size.outerWidth / this.columnWidth );
    colSpan = Math.min( colSpan, this.cols );

    var colGroup = this._getColGroup( colSpan );
    // get the minimum Y value from the columns
    var minimumY = Math.min.apply( Math, colGroup );
    var shortColIndex = utils.indexOf( colGroup, minimumY );

    // position the brick
    var position = {
      x: this.columnWidth * shortColIndex,
      y: minimumY
    };

    // apply setHeight to necessary columns
    var setHeight = minimumY + item.size.outerHeight;
    var setSpan = this.cols + 1 - colGroup.length;
    for ( var i = 0; i < setSpan; i++ ) {
      this.colYs[ shortColIndex + i ] = setHeight;
    }

    return position;
  };

  /**
   * @param {Number} colSpan - number of columns the element spans
   * @returns {Array} colGroup
   */
  Masonry.prototype._getColGroup = function( colSpan ) {
    if ( colSpan < 2 ) {
      // if brick spans only one column, use all the column Ys
      return this.colYs;
    }

    var colGroup = [];
    // how many different places could this brick fit horizontally
    var groupCount = this.cols + 1 - colSpan;
    // for each group potential horizontal position
    for ( var i = 0; i < groupCount; i++ ) {
      // make an array of colY values for that one group
      var groupColYs = this.colYs.slice( i, i + colSpan );
      // and get the max value of the array
      colGroup[i] = Math.max.apply( Math, groupColYs );
    }
    return colGroup;
  };

  Masonry.prototype._manageStamp = function( stamp ) {
    var stampSize = getSize( stamp );
    var offset = this._getElementOffset( stamp );
    // get the columns that this stamp affects
    var firstX = this.options.isOriginLeft ? offset.left : offset.right;
    var lastX = firstX + stampSize.outerWidth;
    var firstCol = Math.floor( firstX / this.columnWidth );
    firstCol = Math.max( 0, firstCol );
    var lastCol = Math.floor( lastX / this.columnWidth );
    // lastCol should not go over if multiple of columnWidth #425
    lastCol -= lastX % this.columnWidth ? 0 : 1;
    lastCol = Math.min( this.cols - 1, lastCol );
    // set colYs to bottom of the stamp
    var stampMaxY = ( this.options.isOriginTop ? offset.top : offset.bottom ) +
      stampSize.outerHeight;
    for ( var i = firstCol; i <= lastCol; i++ ) {
      this.colYs[i] = Math.max( stampMaxY, this.colYs[i] );
    }
  };

  Masonry.prototype._getContainerSize = function() {
    this.maxY = Math.max.apply( Math, this.colYs );
    var size = {
      height: this.maxY
    };

    if ( this.options.isFitWidth ) {
      size.width = this._getContainerFitWidth();
    }

    return size;
  };

  Masonry.prototype._getContainerFitWidth = function() {
    var unusedCols = 0;
    // count unused columns
    var i = this.cols;
    while ( --i ) {
      if ( this.colYs[i] !== 0 ) {
        break;
      }
      unusedCols++;
    }
    // fit container to columns that have been used
    return ( this.cols - unusedCols ) * this.columnWidth - this.gutter;
  };

  Masonry.prototype.needsResizeLayout = function() {
    var previousWidth = this.containerWidth;
    this.getContainerWidth();
    return previousWidth !== this.containerWidth;
  };

  return Masonry;

}));

/*!
 * Masonry layout mode
 * sub-classes Masonry
 * http://masonry.desandro.com
 */

( function( window, factory ) {
  
  // universal module definition
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( 'isotope/js/layout-modes/masonry',[
        '../layout-mode',
        'masonry/masonry'
      ],
      factory );
  } else if ( typeof exports == 'object' ) {
    // CommonJS
    module.exports = factory(
      require('../layout-mode'),
      require('masonry-layout')
    );
  } else {
    // browser global
    factory(
      window.Isotope.LayoutMode,
      window.Masonry
    );
  }

}( window, function factory( LayoutMode, Masonry ) {


// -------------------------- helpers -------------------------- //

// extend objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

// -------------------------- masonryDefinition -------------------------- //

  // create an Outlayer layout class
  var MasonryMode = LayoutMode.create('masonry');

  // save on to these methods
  var _getElementOffset = MasonryMode.prototype._getElementOffset;
  var layout = MasonryMode.prototype.layout;
  var _getMeasurement = MasonryMode.prototype._getMeasurement;

  // sub-class Masonry
  extend( MasonryMode.prototype, Masonry.prototype );

  // set back, as it was overwritten by Masonry
  MasonryMode.prototype._getElementOffset = _getElementOffset;
  MasonryMode.prototype.layout = layout;
  MasonryMode.prototype._getMeasurement = _getMeasurement;

  var measureColumns = MasonryMode.prototype.measureColumns;
  MasonryMode.prototype.measureColumns = function() {
    // set items, used if measuring first item
    this.items = this.isotope.filteredItems;
    measureColumns.call( this );
  };

  // HACK copy over isOriginLeft/Top options
  var _manageStamp = MasonryMode.prototype._manageStamp;
  MasonryMode.prototype._manageStamp = function() {
    this.options.isOriginLeft = this.isotope.options.isOriginLeft;
    this.options.isOriginTop = this.isotope.options.isOriginTop;
    _manageStamp.apply( this, arguments );
  };

  return MasonryMode;

}));

/**
 * fitRows layout mode
 */

( function( window, factory ) {
  
  // universal module definition
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( 'isotope/js/layout-modes/fit-rows',[
        '../layout-mode'
      ],
      factory );
  } else if ( typeof exports == 'object' ) {
    // CommonJS
    module.exports = factory(
      require('../layout-mode')
    );
  } else {
    // browser global
    factory(
      window.Isotope.LayoutMode
    );
  }

}( window, function factory( LayoutMode ) {


var FitRows = LayoutMode.create('fitRows');

FitRows.prototype._resetLayout = function() {
  this.x = 0;
  this.y = 0;
  this.maxY = 0;
  this._getMeasurement( 'gutter', 'outerWidth' );
};

FitRows.prototype._getItemLayoutPosition = function( item ) {
  item.getSize();

  var itemWidth = item.size.outerWidth + this.gutter;
  // if this element cannot fit in the current row
  var containerWidth = this.isotope.size.innerWidth + this.gutter;
  if ( this.x !== 0 && itemWidth + this.x > containerWidth ) {
    this.x = 0;
    this.y = this.maxY;
  }

  var position = {
    x: this.x,
    y: this.y
  };

  this.maxY = Math.max( this.maxY, this.y + item.size.outerHeight );
  this.x += itemWidth;

  return position;
};

FitRows.prototype._getContainerSize = function() {
  return { height: this.maxY };
};

return FitRows;

}));

/**
 * vertical layout mode
 */

( function( window, factory ) {
  
  // universal module definition
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( 'isotope/js/layout-modes/vertical',[
        '../layout-mode'
      ],
      factory );
  } else if ( typeof exports == 'object' ) {
    // CommonJS
    module.exports = factory(
      require('../layout-mode')
    );
  } else {
    // browser global
    factory(
      window.Isotope.LayoutMode
    );
  }

}( window, function factory( LayoutMode ) {


var Vertical = LayoutMode.create( 'vertical', {
  horizontalAlignment: 0
});

Vertical.prototype._resetLayout = function() {
  this.y = 0;
};

Vertical.prototype._getItemLayoutPosition = function( item ) {
  item.getSize();
  var x = ( this.isotope.size.innerWidth - item.size.outerWidth ) *
    this.options.horizontalAlignment;
  var y = this.y;
  this.y += item.size.outerHeight;
  return { x: x, y: y };
};

Vertical.prototype._getContainerSize = function() {
  return { height: this.y };
};

return Vertical;

}));

/*!
 * Isotope v2.2.0
 *
 * Licensed GPLv3 for open source use
 * or Isotope Commercial License for commercial use
 *
 * http://isotope.metafizzy.co
 * Copyright 2015 Metafizzy
 */

( function( window, factory ) {
  
  // universal module definition

  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
        'outlayer/outlayer',
        'get-size/get-size',
        'matches-selector/matches-selector',
        'fizzy-ui-utils/utils',
        'isotope/js/item',
        'isotope/js/layout-mode',
        // include default layout modes
        'isotope/js/layout-modes/masonry',
        'isotope/js/layout-modes/fit-rows',
        'isotope/js/layout-modes/vertical'
      ],
      function( Outlayer, getSize, matchesSelector, utils, Item, LayoutMode ) {
        return factory( window, Outlayer, getSize, matchesSelector, utils, Item, LayoutMode );
      });
  } else if ( typeof exports == 'object' ) {
    // CommonJS
    module.exports = factory(
      window,
      require('outlayer'),
      require('get-size'),
      require('desandro-matches-selector'),
      require('fizzy-ui-utils'),
      require('./item'),
      require('./layout-mode'),
      // include default layout modes
      require('./layout-modes/masonry'),
      require('./layout-modes/fit-rows'),
      require('./layout-modes/vertical')
    );
  } else {
    // browser global
    window.Isotope = factory(
      window,
      window.Outlayer,
      window.getSize,
      window.matchesSelector,
      window.fizzyUIUtils,
      window.Isotope.Item,
      window.Isotope.LayoutMode
    );
  }

}( window, function factory( window, Outlayer, getSize, matchesSelector, utils,
  Item, LayoutMode ) {



// -------------------------- vars -------------------------- //

var jQuery = window.jQuery;

// -------------------------- helpers -------------------------- //

var trim = String.prototype.trim ?
  function( str ) {
    return str.trim();
  } :
  function( str ) {
    return str.replace( /^\s+|\s+$/g, '' );
  };

var docElem = document.documentElement;

var getText = docElem.textContent ?
  function( elem ) {
    return elem.textContent;
  } :
  function( elem ) {
    return elem.innerText;
  };

// -------------------------- isotopeDefinition -------------------------- //

  // create an Outlayer layout class
  var Isotope = Outlayer.create( 'isotope', {
    layoutMode: "masonry",
    isJQueryFiltering: true,
    sortAscending: true
  });

  Isotope.Item = Item;
  Isotope.LayoutMode = LayoutMode;

  Isotope.prototype._create = function() {
    this.itemGUID = 0;
    // functions that sort items
    this._sorters = {};
    this._getSorters();
    // call super
    Outlayer.prototype._create.call( this );

    // create layout modes
    this.modes = {};
    // start filteredItems with all items
    this.filteredItems = this.items;
    // keep of track of sortBys
    this.sortHistory = [ 'original-order' ];
    // create from registered layout modes
    for ( var name in LayoutMode.modes ) {
      this._initLayoutMode( name );
    }
  };

  Isotope.prototype.reloadItems = function() {
    // reset item ID counter
    this.itemGUID = 0;
    // call super
    Outlayer.prototype.reloadItems.call( this );
  };

  Isotope.prototype._itemize = function() {
    var items = Outlayer.prototype._itemize.apply( this, arguments );
    // assign ID for original-order
    for ( var i=0, len = items.length; i < len; i++ ) {
      var item = items[i];
      item.id = this.itemGUID++;
    }
    this._updateItemsSortData( items );
    return items;
  };


  // -------------------------- layout -------------------------- //

  Isotope.prototype._initLayoutMode = function( name ) {
    var Mode = LayoutMode.modes[ name ];
    // set mode options
    // HACK extend initial options, back-fill in default options
    var initialOpts = this.options[ name ] || {};
    this.options[ name ] = Mode.options ?
      utils.extend( Mode.options, initialOpts ) : initialOpts;
    // init layout mode instance
    this.modes[ name ] = new Mode( this );
  };


  Isotope.prototype.layout = function() {
    // if first time doing layout, do all magic
    if ( !this._isLayoutInited && this.options.isInitLayout ) {
      this.arrange();
      return;
    }
    this._layout();
  };

  // private method to be used in layout() & magic()
  Isotope.prototype._layout = function() {
    // don't animate first layout
    var isInstant = this._getIsInstant();
    // layout flow
    this._resetLayout();
    this._manageStamps();
    this.layoutItems( this.filteredItems, isInstant );

    // flag for initalized
    this._isLayoutInited = true;
  };

  // filter + sort + layout
  Isotope.prototype.arrange = function( opts ) {
    // set any options pass
    this.option( opts );
    this._getIsInstant();
    // filter, sort, and layout

    // filter
    var filtered = this._filter( this.items );
    this.filteredItems = filtered.matches;

    var _this = this;
    function hideReveal() {
      _this.reveal( filtered.needReveal );
      _this.hide( filtered.needHide );
    }

    this._bindArrangeComplete();

    if ( this._isInstant ) {
      this._noTransition( hideReveal );
    } else {
      hideReveal();
    }

    this._sort();
    this._layout();
  };
  // alias to _init for main plugin method
  Isotope.prototype._init = Isotope.prototype.arrange;

  // HACK
  // Don't animate/transition first layout
  // Or don't animate/transition other layouts
  Isotope.prototype._getIsInstant = function() {
    var isInstant = this.options.isLayoutInstant !== undefined ?
      this.options.isLayoutInstant : !this._isLayoutInited;
    this._isInstant = isInstant;
    return isInstant;
  };

  // listen for layoutComplete, hideComplete and revealComplete
  // to trigger arrangeComplete
  Isotope.prototype._bindArrangeComplete = function() {
    // listen for 3 events to trigger arrangeComplete
    var isLayoutComplete, isHideComplete, isRevealComplete;
    var _this = this;
    function arrangeParallelCallback() {
      if ( isLayoutComplete && isHideComplete && isRevealComplete ) {
        _this.emitEvent( 'arrangeComplete', [ _this.filteredItems ] );
      }
    }
    this.once( 'layoutComplete', function() {
      isLayoutComplete = true;
      arrangeParallelCallback();
    });
    this.once( 'hideComplete', function() {
      isHideComplete = true;
      arrangeParallelCallback();
    });
    this.once( 'revealComplete', function() {
      isRevealComplete = true;
      arrangeParallelCallback();
    });
  };

  // -------------------------- filter -------------------------- //

  Isotope.prototype._filter = function( items ) {
    var filter = this.options.filter;
    filter = filter || '*';
    var matches = [];
    var hiddenMatched = [];
    var visibleUnmatched = [];

    var test = this._getFilterTest( filter );

    // test each item
    for ( var i=0, len = items.length; i < len; i++ ) {
      var item = items[i];
      if ( item.isIgnored ) {
        continue;
      }
      // add item to either matched or unmatched group
      var isMatched = test( item );
      // item.isFilterMatched = isMatched;
      // add to matches if its a match
      if ( isMatched ) {
        matches.push( item );
      }
      // add to additional group if item needs to be hidden or revealed
      if ( isMatched && item.isHidden ) {
        hiddenMatched.push( item );
      } else if ( !isMatched && !item.isHidden ) {
        visibleUnmatched.push( item );
      }
    }

    // return collections of items to be manipulated
    return {
      matches: matches,
      needReveal: hiddenMatched,
      needHide: visibleUnmatched
    };
  };

  // get a jQuery, function, or a matchesSelector test given the filter
  Isotope.prototype._getFilterTest = function( filter ) {
    if ( jQuery && this.options.isJQueryFiltering ) {
      // use jQuery
      return function( item ) {
        return jQuery( item.element ).is( filter );
      };
    }
    if ( typeof filter == 'function' ) {
      // use filter as function
      return function( item ) {
        return filter( item.element );
      };
    }
    // default, use filter as selector string
    return function( item ) {
      return matchesSelector( item.element, filter );
    };
  };

  // -------------------------- sorting -------------------------- //

  /**
   * @params {Array} elems
   * @public
   */
  Isotope.prototype.updateSortData = function( elems ) {
    // get items
    var items;
    if ( elems ) {
      elems = utils.makeArray( elems );
      items = this.getItems( elems );
    } else {
      // update all items if no elems provided
      items = this.items;
    }

    this._getSorters();
    this._updateItemsSortData( items );
  };

  Isotope.prototype._getSorters = function() {
    var getSortData = this.options.getSortData;
    for ( var key in getSortData ) {
      var sorter = getSortData[ key ];
      this._sorters[ key ] = mungeSorter( sorter );
    }
  };

  /**
   * @params {Array} items - of Isotope.Items
   * @private
   */
  Isotope.prototype._updateItemsSortData = function( items ) {
    // do not update if no items
    var len = items && items.length;

    for ( var i=0; len && i < len; i++ ) {
      var item = items[i];
      item.updateSortData();
    }
  };

  // ----- munge sorter ----- //

  // encapsulate this, as we just need mungeSorter
  // other functions in here are just for munging
  var mungeSorter = ( function() {
    // add a magic layer to sorters for convienent shorthands
    // `.foo-bar` will use the text of .foo-bar querySelector
    // `[foo-bar]` will use attribute
    // you can also add parser
    // `.foo-bar parseInt` will parse that as a number
    function mungeSorter( sorter ) {
      // if not a string, return function or whatever it is
      if ( typeof sorter != 'string' ) {
        return sorter;
      }
      // parse the sorter string
      var args = trim( sorter ).split(' ');
      var query = args[0];
      // check if query looks like [an-attribute]
      var attrMatch = query.match( /^\[(.+)\]$/ );
      var attr = attrMatch && attrMatch[1];
      var getValue = getValueGetter( attr, query );
      // use second argument as a parser
      var parser = Isotope.sortDataParsers[ args[1] ];
      // parse the value, if there was a parser
      sorter = parser ? function( elem ) {
        return elem && parser( getValue( elem ) );
      } :
      // otherwise just return value
      function( elem ) {
        return elem && getValue( elem );
      };

      return sorter;
    }

    // get an attribute getter, or get text of the querySelector
    function getValueGetter( attr, query ) {
      var getValue;
      // if query looks like [foo-bar], get attribute
      if ( attr ) {
        getValue = function( elem ) {
          return elem.getAttribute( attr );
        };
      } else {
        // otherwise, assume its a querySelector, and get its text
        getValue = function( elem ) {
          var child = elem.querySelector( query );
          return child && getText( child );
        };
      }
      return getValue;
    }

    return mungeSorter;
  })();

  // parsers used in getSortData shortcut strings
  Isotope.sortDataParsers = {
    'parseInt': function( val ) {
      return parseInt( val, 10 );
    },
    'parseFloat': function( val ) {
      return parseFloat( val );
    }
  };

  // ----- sort method ----- //

  // sort filteredItem order
  Isotope.prototype._sort = function() {
    var sortByOpt = this.options.sortBy;
    if ( !sortByOpt ) {
      return;
    }
    // concat all sortBy and sortHistory
    var sortBys = [].concat.apply( sortByOpt, this.sortHistory );
    // sort magic
    var itemSorter = getItemSorter( sortBys, this.options.sortAscending );
    this.filteredItems.sort( itemSorter );
    // keep track of sortBy History
    if ( sortByOpt != this.sortHistory[0] ) {
      // add to front, oldest goes in last
      this.sortHistory.unshift( sortByOpt );
    }
  };

  // returns a function used for sorting
  function getItemSorter( sortBys, sortAsc ) {
    return function sorter( itemA, itemB ) {
      // cycle through all sortKeys
      for ( var i = 0, len = sortBys.length; i < len; i++ ) {
        var sortBy = sortBys[i];
        var a = itemA.sortData[ sortBy ];
        var b = itemB.sortData[ sortBy ];
        if ( a > b || a < b ) {
          // if sortAsc is an object, use the value given the sortBy key
          var isAscending = sortAsc[ sortBy ] !== undefined ? sortAsc[ sortBy ] : sortAsc;
          var direction = isAscending ? 1 : -1;
          return ( a > b ? 1 : -1 ) * direction;
        }
      }
      return 0;
    };
  }

  // -------------------------- methods -------------------------- //

  // get layout mode
  Isotope.prototype._mode = function() {
    var layoutMode = this.options.layoutMode;
    var mode = this.modes[ layoutMode ];
    if ( !mode ) {
      // TODO console.error
      throw new Error( 'No layout mode: ' + layoutMode );
    }
    // HACK sync mode's options
    // any options set after init for layout mode need to be synced
    mode.options = this.options[ layoutMode ];
    return mode;
  };

  Isotope.prototype._resetLayout = function() {
    // trigger original reset layout
    Outlayer.prototype._resetLayout.call( this );
    this._mode()._resetLayout();
  };

  Isotope.prototype._getItemLayoutPosition = function( item  ) {
    return this._mode()._getItemLayoutPosition( item );
  };

  Isotope.prototype._manageStamp = function( stamp ) {
    this._mode()._manageStamp( stamp );
  };

  Isotope.prototype._getContainerSize = function() {
    return this._mode()._getContainerSize();
  };

  Isotope.prototype.needsResizeLayout = function() {
    return this._mode().needsResizeLayout();
  };

  // -------------------------- adding & removing -------------------------- //

  // HEADS UP overwrites default Outlayer appended
  Isotope.prototype.appended = function( elems ) {
    var items = this.addItems( elems );
    if ( !items.length ) {
      return;
    }
    // filter, layout, reveal new items
    var filteredItems = this._filterRevealAdded( items );
    // add to filteredItems
    this.filteredItems = this.filteredItems.concat( filteredItems );
  };

  // HEADS UP overwrites default Outlayer prepended
  Isotope.prototype.prepended = function( elems ) {
    var items = this._itemize( elems );
    if ( !items.length ) {
      return;
    }
    // start new layout
    this._resetLayout();
    this._manageStamps();
    // filter, layout, reveal new items
    var filteredItems = this._filterRevealAdded( items );
    // layout previous items
    this.layoutItems( this.filteredItems );
    // add to items and filteredItems
    this.filteredItems = filteredItems.concat( this.filteredItems );
    this.items = items.concat( this.items );
  };

  Isotope.prototype._filterRevealAdded = function( items ) {
    var filtered = this._filter( items );
    this.hide( filtered.needHide );
    // reveal all new items
    this.reveal( filtered.matches );
    // layout new items, no transition
    this.layoutItems( filtered.matches, true );
    return filtered.matches;
  };

  /**
   * Filter, sort, and layout newly-appended item elements
   * @param {Array or NodeList or Element} elems
   */
  Isotope.prototype.insert = function( elems ) {
    var items = this.addItems( elems );
    if ( !items.length ) {
      return;
    }
    // append item elements
    var i, item;
    var len = items.length;
    for ( i=0; i < len; i++ ) {
      item = items[i];
      this.element.appendChild( item.element );
    }
    // filter new stuff
    var filteredInsertItems = this._filter( items ).matches;
    // set flag
    for ( i=0; i < len; i++ ) {
      items[i].isLayoutInstant = true;
    }
    this.arrange();
    // reset flag
    for ( i=0; i < len; i++ ) {
      delete items[i].isLayoutInstant;
    }
    this.reveal( filteredInsertItems );
  };

  var _remove = Isotope.prototype.remove;
  Isotope.prototype.remove = function( elems ) {
    elems = utils.makeArray( elems );
    var removeItems = this.getItems( elems );
    // do regular thing
    _remove.call( this, elems );
    // bail if no items to remove
    var len = removeItems && removeItems.length;
    if ( !len ) {
      return;
    }
    // remove elems from filteredItems
    for ( var i=0; i < len; i++ ) {
      var item = removeItems[i];
      // remove item from collection
      utils.removeFrom( this.filteredItems, item );
    }
  };

  Isotope.prototype.shuffle = function() {
    // update random sortData
    for ( var i=0, len = this.items.length; i < len; i++ ) {
      var item = this.items[i];
      item.sortData.random = Math.random();
    }
    this.options.sortBy = 'random';
    this._sort();
    this._layout();
  };

  /**
   * trigger fn without transition
   * kind of hacky to have this in the first place
   * @param {Function} fn
   * @returns ret
   * @private
   */
  Isotope.prototype._noTransition = function( fn ) {
    // save transitionDuration before disabling
    var transitionDuration = this.options.transitionDuration;
    // disable transition
    this.options.transitionDuration = 0;
    // do it
    var returnValue = fn.call( this );
    // re-enable transition for reveal
    this.options.transitionDuration = transitionDuration;
    return returnValue;
  };

  // ----- helper methods ----- //

  /**
   * getter method for getting filtered item elements
   * @returns {Array} elems - collection of item elements
   */
  Isotope.prototype.getFilteredItemElements = function() {
    var elems = [];
    for ( var i=0, len = this.filteredItems.length; i < len; i++ ) {
      elems.push( this.filteredItems[i].element );
    }
    return elems;
  };

  // -----  ----- //

  return Isotope;

}));
;/*
 * jPlayer Plugin for jQuery JavaScript Library
 * http://www.jplayer.org
 *
 * Copyright (c) 2009 - 2013 Happyworm Ltd
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * Author: Mark J Panaghiston
 * Version: 2.3.0
 * Date: 20th April 2013
 */
(function(b,f){"function"===typeof define&&define.amd?define(["jquery"],f):f(b.jQuery)})(this,function(b,f){b.fn.jPlayer=function(a){var c="string"===typeof a,d=Array.prototype.slice.call(arguments,1),e=this;a=!c&&d.length?b.extend.apply(null,[!0,a].concat(d)):a;if(c&&"_"===a.charAt(0))return e;c?this.each(function(){var c=b.data(this,"jPlayer"),h=c&&b.isFunction(c[a])?c[a].apply(c,d):c;if(h!==c&&h!==f)return e=h,!1}):this.each(function(){var c=b.data(this,"jPlayer");c?c.option(a||{}):b.data(this,
"jPlayer",new b.jPlayer(a,this))});return e};b.jPlayer=function(a,c){if(arguments.length){this.element=b(c);this.options=b.extend(!0,{},this.options,a);var d=this;this.element.bind("remove.jPlayer",function(){d.destroy()});this._init()}};b.jPlayer.emulateMethods="load play pause";b.jPlayer.emulateStatus="src readyState networkState currentTime duration paused ended playbackRate";b.jPlayer.emulateOptions="muted volume";b.jPlayer.reservedEvent="ready flashreset resize repeat error warning";b.jPlayer.event=
{};b.each("ready flashreset resize repeat click error warning loadstart progress suspend abort emptied stalled play pause loadedmetadata loadeddata waiting playing canplay canplaythrough seeking seeked timeupdate ended ratechange durationchange volumechange".split(" "),function(){b.jPlayer.event[this]="jPlayer_"+this});b.jPlayer.htmlEvent="loadstart abort emptied stalled loadedmetadata loadeddata canplay canplaythrough ratechange".split(" ");b.jPlayer.pause=function(){b.each(b.jPlayer.prototype.instances,
function(a,c){c.data("jPlayer").status.srcSet&&c.jPlayer("pause")})};b.jPlayer.timeFormat={showHour:!1,showMin:!0,showSec:!0,padHour:!1,padMin:!0,padSec:!0,sepHour:":",sepMin:":",sepSec:""};var l=function(){this.init()};l.prototype={init:function(){this.options={timeFormat:b.jPlayer.timeFormat}},time:function(a){var c=new Date(1E3*(a&&"number"===typeof a?a:0)),b=c.getUTCHours();a=this.options.timeFormat.showHour?c.getUTCMinutes():c.getUTCMinutes()+60*b;c=this.options.timeFormat.showMin?c.getUTCSeconds():
c.getUTCSeconds()+60*a;b=this.options.timeFormat.padHour&&10>b?"0"+b:b;a=this.options.timeFormat.padMin&&10>a?"0"+a:a;c=this.options.timeFormat.padSec&&10>c?"0"+c:c;b=""+(this.options.timeFormat.showHour?b+this.options.timeFormat.sepHour:"");b+=this.options.timeFormat.showMin?a+this.options.timeFormat.sepMin:"";return b+=this.options.timeFormat.showSec?c+this.options.timeFormat.sepSec:""}};var m=new l;b.jPlayer.convertTime=function(a){return m.time(a)};b.jPlayer.uaBrowser=function(a){a=a.toLowerCase();
var b=/(opera)(?:.*version)?[ \/]([\w.]+)/,d=/(msie) ([\w.]+)/,e=/(mozilla)(?:.*? rv:([\w.]+))?/;a=/(webkit)[ \/]([\w.]+)/.exec(a)||b.exec(a)||d.exec(a)||0>a.indexOf("compatible")&&e.exec(a)||[];return{browser:a[1]||"",version:a[2]||"0"}};b.jPlayer.uaPlatform=function(a){var b=a.toLowerCase(),d=/(android)/,e=/(mobile)/;a=/(ipad|iphone|ipod|android|blackberry|playbook|windows ce|webos)/.exec(b)||[];b=/(ipad|playbook)/.exec(b)||!e.exec(b)&&d.exec(b)||[];a[1]&&(a[1]=a[1].replace(/\s/g,"_"));return{platform:a[1]||
"",tablet:b[1]||""}};b.jPlayer.browser={};b.jPlayer.platform={};var j=b.jPlayer.uaBrowser(navigator.userAgent);j.browser&&(b.jPlayer.browser[j.browser]=!0,b.jPlayer.browser.version=j.version);j=b.jPlayer.uaPlatform(navigator.userAgent);j.platform&&(b.jPlayer.platform[j.platform]=!0,b.jPlayer.platform.mobile=!j.tablet,b.jPlayer.platform.tablet=!!j.tablet);b.jPlayer.getDocMode=function(){var a;b.jPlayer.browser.msie&&(document.documentMode?a=document.documentMode:(a=5,document.compatMode&&"CSS1Compat"===
document.compatMode&&(a=7)));return a};b.jPlayer.browser.documentMode=b.jPlayer.getDocMode();b.jPlayer.nativeFeatures={init:function(){var a=document,b=a.createElement("video"),d={w3c:"fullscreenEnabled fullscreenElement requestFullscreen exitFullscreen fullscreenchange fullscreenerror".split(" "),moz:"mozFullScreenEnabled mozFullScreenElement mozRequestFullScreen mozCancelFullScreen mozfullscreenchange mozfullscreenerror".split(" "),webkit:" webkitCurrentFullScreenElement webkitRequestFullScreen webkitCancelFullScreen webkitfullscreenchange ".split(" "),
webkitVideo:"webkitSupportsFullscreen webkitDisplayingFullscreen webkitEnterFullscreen webkitExitFullscreen  ".split(" ")},e=["w3c","moz","webkit","webkitVideo"],g,h;this.fullscreen=b={support:{w3c:!!a[d.w3c[0]],moz:!!a[d.moz[0]],webkit:"function"===typeof a[d.webkit[3]],webkitVideo:"function"===typeof b[d.webkitVideo[2]]},used:{}};g=0;for(h=e.length;g<h;g++){var f=e[g];if(b.support[f]){b.spec=f;b.used[f]=!0;break}}if(b.spec){var k=d[b.spec];b.api={fullscreenEnabled:!0,fullscreenElement:function(b){b=
b?b:a;return b[k[1]]},requestFullscreen:function(a){return a[k[2]]()},exitFullscreen:function(b){b=b?b:a;return b[k[3]]()}};b.event={fullscreenchange:k[4],fullscreenerror:k[5]}}else b.api={fullscreenEnabled:!1,fullscreenElement:function(){return null},requestFullscreen:function(){},exitFullscreen:function(){}},b.event={}}};b.jPlayer.nativeFeatures.init();b.jPlayer.focus=null;b.jPlayer.keyIgnoreElementNames="INPUT TEXTAREA";var n=function(a){var c=b.jPlayer.focus,d;c&&(b.each(b.jPlayer.keyIgnoreElementNames.split(/\s+/g),
function(b,c){if(a.target.nodeName.toUpperCase()===c.toUpperCase())return d=!0,!1}),d||b.each(c.options.keyBindings,function(d,g){if(g&&a.which===g.key&&b.isFunction(g.fn))return a.preventDefault(),g.fn(c),!1}))};b.jPlayer.keys=function(a){b(document.documentElement).unbind("keydown.jPlayer");a&&b(document.documentElement).bind("keydown.jPlayer",n)};b.jPlayer.keys(!0);b.jPlayer.prototype={count:0,version:{script:"2.3.0",needFlash:"2.3.0",flash:"unknown"},options:{swfPath:"js",solution:"html, flash",
supplied:"mp3",preload:"metadata",volume:0.8,muted:!1,wmode:"opaque",backgroundColor:"#000000",cssSelectorAncestor:"#jp_container_1",cssSelector:{videoPlay:".jp-video-play",play:".jp-play",pause:".jp-pause",stop:".jp-stop",seekBar:".jp-seek-bar",playBar:".jp-play-bar",mute:".jp-mute",unmute:".jp-unmute",volumeBar:".jp-volume-bar",volumeBarValue:".jp-volume-bar-value",volumeMax:".jp-volume-max",currentTime:".jp-current-time",duration:".jp-duration",fullScreen:".jp-full-screen",restoreScreen:".jp-restore-screen",
repeat:".jp-repeat",repeatOff:".jp-repeat-off",gui:".jp-gui",noSolution:".jp-no-solution"},smoothPlayBar:!1,fullScreen:!1,fullWindow:!1,autohide:{restored:!1,full:!0,fadeIn:200,fadeOut:600,hold:1E3},loop:!1,repeat:function(a){a.jPlayer.options.loop?b(this).unbind(".jPlayerRepeat").bind(b.jPlayer.event.ended+".jPlayer.jPlayerRepeat",function(){b(this).jPlayer("play")}):b(this).unbind(".jPlayerRepeat")},nativeVideoControls:{},noFullWindow:{msie:/msie [0-6]\./,ipad:/ipad.*?os [0-4]\./,iphone:/iphone/,
ipod:/ipod/,android_pad:/android [0-3]\.(?!.*?mobile)/,android_phone:/android.*?mobile/,blackberry:/blackberry/,windows_ce:/windows ce/,iemobile:/iemobile/,webos:/webos/},noVolume:{ipad:/ipad/,iphone:/iphone/,ipod:/ipod/,android_pad:/android(?!.*?mobile)/,android_phone:/android.*?mobile/,blackberry:/blackberry/,windows_ce:/windows ce/,iemobile:/iemobile/,webos:/webos/,playbook:/playbook/},timeFormat:{},keyEnabled:!1,audioFullScreen:!1,keyBindings:{play:{key:32,fn:function(a){a.status.paused?a.play():
a.pause()}},fullScreen:{key:13,fn:function(a){(a.status.video||a.options.audioFullScreen)&&a._setOption("fullScreen",!a.options.fullScreen)}},muted:{key:8,fn:function(a){a._muted(!a.options.muted)}},volumeUp:{key:38,fn:function(a){a.volume(a.options.volume+0.1)}},volumeDown:{key:40,fn:function(a){a.volume(a.options.volume-0.1)}}},verticalVolume:!1,idPrefix:"jp",noConflict:"jQuery",emulateHtml:!1,errorAlerts:!1,warningAlerts:!1},optionsAudio:{size:{width:"0px",height:"0px",cssClass:""},sizeFull:{width:"0px",
height:"0px",cssClass:""}},optionsVideo:{size:{width:"480px",height:"270px",cssClass:"jp-video-270p"},sizeFull:{width:"100%",height:"100%",cssClass:"jp-video-full"}},instances:{},status:{src:"",media:{},paused:!0,format:{},formatType:"",waitForPlay:!0,waitForLoad:!0,srcSet:!1,video:!1,seekPercent:0,currentPercentRelative:0,currentPercentAbsolute:0,currentTime:0,duration:0,videoWidth:0,videoHeight:0,readyState:0,networkState:0,playbackRate:1,ended:0},internal:{ready:!1},solution:{html:!0,flash:!0},
format:{mp3:{codec:'audio/mpeg; codecs="mp3"',flashCanPlay:!0,media:"audio"},m4a:{codec:'audio/mp4; codecs="mp4a.40.2"',flashCanPlay:!0,media:"audio"},oga:{codec:'audio/ogg; codecs="vorbis"',flashCanPlay:!1,media:"audio"},wav:{codec:'audio/wav; codecs="1"',flashCanPlay:!1,media:"audio"},webma:{codec:'audio/webm; codecs="vorbis"',flashCanPlay:!1,media:"audio"},fla:{codec:"audio/x-flv",flashCanPlay:!0,media:"audio"},rtmpa:{codec:'audio/rtmp; codecs="rtmp"',flashCanPlay:!0,media:"audio"},m4v:{codec:'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
flashCanPlay:!0,media:"video"},ogv:{codec:'video/ogg; codecs="theora, vorbis"',flashCanPlay:!1,media:"video"},webmv:{codec:'video/webm; codecs="vorbis, vp8"',flashCanPlay:!1,media:"video"},flv:{codec:"video/x-flv",flashCanPlay:!0,media:"video"},rtmpv:{codec:'video/rtmp; codecs="rtmp"',flashCanPlay:!0,media:"video"}},_init:function(){var a=this;this.element.empty();this.status=b.extend({},this.status);this.internal=b.extend({},this.internal);this.options.timeFormat=b.extend({},b.jPlayer.timeFormat,
this.options.timeFormat);this.internal.cmdsIgnored=b.jPlayer.platform.ipad||b.jPlayer.platform.iphone||b.jPlayer.platform.ipod;this.internal.domNode=this.element.get(0);this.options.keyEnabled&&!b.jPlayer.focus&&(b.jPlayer.focus=this);this.formats=[];this.solutions=[];this.require={};this.htmlElement={};this.html={};this.html.audio={};this.html.video={};this.flash={};this.css={};this.css.cs={};this.css.jq={};this.ancestorJq=[];this.options.volume=this._limitValue(this.options.volume,0,1);b.each(this.options.supplied.toLowerCase().split(","),
function(c,d){var e=d.replace(/^\s+|\s+$/g,"");if(a.format[e]){var f=!1;b.each(a.formats,function(a,b){if(e===b)return f=!0,!1});f||a.formats.push(e)}});b.each(this.options.solution.toLowerCase().split(","),function(c,d){var e=d.replace(/^\s+|\s+$/g,"");if(a.solution[e]){var f=!1;b.each(a.solutions,function(a,b){if(e===b)return f=!0,!1});f||a.solutions.push(e)}});this.internal.instance="jp_"+this.count;this.instances[this.internal.instance]=this.element;this.element.attr("id")||this.element.attr("id",
this.options.idPrefix+"_jplayer_"+this.count);this.internal.self=b.extend({},{id:this.element.attr("id"),jq:this.element});this.internal.audio=b.extend({},{id:this.options.idPrefix+"_audio_"+this.count,jq:f});this.internal.video=b.extend({},{id:this.options.idPrefix+"_video_"+this.count,jq:f});this.internal.flash=b.extend({},{id:this.options.idPrefix+"_flash_"+this.count,jq:f,swf:this.options.swfPath+(".swf"!==this.options.swfPath.toLowerCase().slice(-4)?(this.options.swfPath&&"/"!==this.options.swfPath.slice(-1)?
"/":"")+"Jplayer.swf":"")});this.internal.poster=b.extend({},{id:this.options.idPrefix+"_poster_"+this.count,jq:f});b.each(b.jPlayer.event,function(b,c){a.options[b]!==f&&(a.element.bind(c+".jPlayer",a.options[b]),a.options[b]=f)});this.require.audio=!1;this.require.video=!1;b.each(this.formats,function(b,c){a.require[a.format[c].media]=!0});this.options=this.require.video?b.extend(!0,{},this.optionsVideo,this.options):b.extend(!0,{},this.optionsAudio,this.options);this._setSize();this.status.nativeVideoControls=
this._uaBlocklist(this.options.nativeVideoControls);this.status.noFullWindow=this._uaBlocklist(this.options.noFullWindow);this.status.noVolume=this._uaBlocklist(this.options.noVolume);b.jPlayer.nativeFeatures.fullscreen.api.fullscreenEnabled&&this._fullscreenAddEventListeners();this._restrictNativeVideoControls();this.htmlElement.poster=document.createElement("img");this.htmlElement.poster.id=this.internal.poster.id;this.htmlElement.poster.onload=function(){(!a.status.video||a.status.waitForPlay)&&
a.internal.poster.jq.show()};this.element.append(this.htmlElement.poster);this.internal.poster.jq=b("#"+this.internal.poster.id);this.internal.poster.jq.css({width:this.status.width,height:this.status.height});this.internal.poster.jq.hide();this.internal.poster.jq.bind("click.jPlayer",function(){a._trigger(b.jPlayer.event.click)});this.html.audio.available=!1;this.require.audio&&(this.htmlElement.audio=document.createElement("audio"),this.htmlElement.audio.id=this.internal.audio.id,this.html.audio.available=
!!this.htmlElement.audio.canPlayType&&this._testCanPlayType(this.htmlElement.audio));this.html.video.available=!1;this.require.video&&(this.htmlElement.video=document.createElement("video"),this.htmlElement.video.id=this.internal.video.id,this.html.video.available=!!this.htmlElement.video.canPlayType&&this._testCanPlayType(this.htmlElement.video));this.flash.available=this._checkForFlash(10.1);this.html.canPlay={};this.flash.canPlay={};b.each(this.formats,function(b,c){a.html.canPlay[c]=a.html[a.format[c].media].available&&
""!==a.htmlElement[a.format[c].media].canPlayType(a.format[c].codec);a.flash.canPlay[c]=a.format[c].flashCanPlay&&a.flash.available});this.html.desired=!1;this.flash.desired=!1;b.each(this.solutions,function(c,d){if(0===c)a[d].desired=!0;else{var e=!1,f=!1;b.each(a.formats,function(b,c){a[a.solutions[0]].canPlay[c]&&("video"===a.format[c].media?f=!0:e=!0)});a[d].desired=a.require.audio&&!e||a.require.video&&!f}});this.html.support={};this.flash.support={};b.each(this.formats,function(b,c){a.html.support[c]=
a.html.canPlay[c]&&a.html.desired;a.flash.support[c]=a.flash.canPlay[c]&&a.flash.desired});this.html.used=!1;this.flash.used=!1;b.each(this.solutions,function(c,d){b.each(a.formats,function(b,c){if(a[d].support[c])return a[d].used=!0,!1})});this._resetActive();this._resetGate();this._cssSelectorAncestor(this.options.cssSelectorAncestor);!this.html.used&&!this.flash.used?(this._error({type:b.jPlayer.error.NO_SOLUTION,context:"{solution:'"+this.options.solution+"', supplied:'"+this.options.supplied+
"'}",message:b.jPlayer.errorMsg.NO_SOLUTION,hint:b.jPlayer.errorHint.NO_SOLUTION}),this.css.jq.noSolution.length&&this.css.jq.noSolution.show()):this.css.jq.noSolution.length&&this.css.jq.noSolution.hide();if(this.flash.used){var c,d="jQuery="+encodeURI(this.options.noConflict)+"&id="+encodeURI(this.internal.self.id)+"&vol="+this.options.volume+"&muted="+this.options.muted;if(b.jPlayer.browser.msie&&(9>Number(b.jPlayer.browser.version)||9>b.jPlayer.browser.documentMode)){d=['<param name="movie" value="'+
this.internal.flash.swf+'" />','<param name="FlashVars" value="'+d+'" />','<param name="allowScriptAccess" value="always" />','<param name="bgcolor" value="'+this.options.backgroundColor+'" />','<param name="wmode" value="'+this.options.wmode+'" />'];c=document.createElement('<object id="'+this.internal.flash.id+'" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="0" height="0" tabindex="-1"></object>');for(var e=0;e<d.length;e++)c.appendChild(document.createElement(d[e]))}else e=function(a,
b,c){var d=document.createElement("param");d.setAttribute("name",b);d.setAttribute("value",c);a.appendChild(d)},c=document.createElement("object"),c.setAttribute("id",this.internal.flash.id),c.setAttribute("data",this.internal.flash.swf),c.setAttribute("type","application/x-shockwave-flash"),c.setAttribute("width","1"),c.setAttribute("height","1"),c.setAttribute("tabindex","-1"),e(c,"flashvars",d),e(c,"allowscriptaccess","always"),e(c,"bgcolor",this.options.backgroundColor),e(c,"wmode",this.options.wmode);
this.element.append(c);this.internal.flash.jq=b(c)}this.html.used&&(this.html.audio.available&&(this._addHtmlEventListeners(this.htmlElement.audio,this.html.audio),this.element.append(this.htmlElement.audio),this.internal.audio.jq=b("#"+this.internal.audio.id)),this.html.video.available&&(this._addHtmlEventListeners(this.htmlElement.video,this.html.video),this.element.append(this.htmlElement.video),this.internal.video.jq=b("#"+this.internal.video.id),this.status.nativeVideoControls?this.internal.video.jq.css({width:this.status.width,
height:this.status.height}):this.internal.video.jq.css({width:"0px",height:"0px"}),this.internal.video.jq.bind("click.jPlayer",function(){a._trigger(b.jPlayer.event.click)})));this.options.emulateHtml&&this._emulateHtmlBridge();this.html.used&&!this.flash.used&&setTimeout(function(){a.internal.ready=!0;a.version.flash="n/a";a._trigger(b.jPlayer.event.repeat);a._trigger(b.jPlayer.event.ready)},100);this._updateNativeVideoControls();this._updateInterface();this._updateButtons(!1);this._updateAutohide();
this._updateVolume(this.options.volume);this._updateMute(this.options.muted);this.css.jq.videoPlay.length&&this.css.jq.videoPlay.hide();b.jPlayer.prototype.count++},destroy:function(){this.clearMedia();this._removeUiClass();this.css.jq.currentTime.length&&this.css.jq.currentTime.text("");this.css.jq.duration.length&&this.css.jq.duration.text("");b.each(this.css.jq,function(a,b){b.length&&b.unbind(".jPlayer")});this.internal.poster.jq.unbind(".jPlayer");this.internal.video.jq&&this.internal.video.jq.unbind(".jPlayer");
this._fullscreenRemoveEventListeners();this===b.jPlayer.focus&&(b.jPlayer.focus=null);this.options.emulateHtml&&this._destroyHtmlBridge();this.element.removeData("jPlayer");this.element.unbind(".jPlayer");this.element.empty();delete this.instances[this.internal.instance]},enable:function(){},disable:function(){},_testCanPlayType:function(a){try{return a.canPlayType(this.format.mp3.codec),!0}catch(b){return!1}},_uaBlocklist:function(a){var c=navigator.userAgent.toLowerCase(),d=!1;b.each(a,function(a,
b){if(b&&b.test(c))return d=!0,!1});return d},_restrictNativeVideoControls:function(){this.require.audio&&this.status.nativeVideoControls&&(this.status.nativeVideoControls=!1,this.status.noFullWindow=!0)},_updateNativeVideoControls:function(){this.html.video.available&&this.html.used&&(this.htmlElement.video.controls=this.status.nativeVideoControls,this._updateAutohide(),this.status.nativeVideoControls&&this.require.video?(this.internal.poster.jq.hide(),this.internal.video.jq.css({width:this.status.width,
height:this.status.height})):this.status.waitForPlay&&this.status.video&&(this.internal.poster.jq.show(),this.internal.video.jq.css({width:"0px",height:"0px"})))},_addHtmlEventListeners:function(a,c){var d=this;a.preload=this.options.preload;a.muted=this.options.muted;a.volume=this.options.volume;a.addEventListener("progress",function(){c.gate&&(d.internal.cmdsIgnored&&0<this.readyState&&(d.internal.cmdsIgnored=!1),d._getHtmlStatus(a),d._updateInterface(),d._trigger(b.jPlayer.event.progress))},!1);
a.addEventListener("timeupdate",function(){c.gate&&(d._getHtmlStatus(a),d._updateInterface(),d._trigger(b.jPlayer.event.timeupdate))},!1);a.addEventListener("durationchange",function(){c.gate&&(d._getHtmlStatus(a),d._updateInterface(),d._trigger(b.jPlayer.event.durationchange))},!1);a.addEventListener("play",function(){c.gate&&(d._updateButtons(!0),d._html_checkWaitForPlay(),d._trigger(b.jPlayer.event.play))},!1);a.addEventListener("playing",function(){c.gate&&(d._updateButtons(!0),d._seeked(),d._trigger(b.jPlayer.event.playing))},
!1);a.addEventListener("pause",function(){c.gate&&(d._updateButtons(!1),d._trigger(b.jPlayer.event.pause))},!1);a.addEventListener("waiting",function(){c.gate&&(d._seeking(),d._trigger(b.jPlayer.event.waiting))},!1);a.addEventListener("seeking",function(){c.gate&&(d._seeking(),d._trigger(b.jPlayer.event.seeking))},!1);a.addEventListener("seeked",function(){c.gate&&(d._seeked(),d._trigger(b.jPlayer.event.seeked))},!1);a.addEventListener("volumechange",function(){c.gate&&(d.options.volume=a.volume,
d.options.muted=a.muted,d._updateMute(),d._updateVolume(),d._trigger(b.jPlayer.event.volumechange))},!1);a.addEventListener("suspend",function(){c.gate&&(d._seeked(),d._trigger(b.jPlayer.event.suspend))},!1);a.addEventListener("ended",function(){c.gate&&(b.jPlayer.browser.webkit||(d.htmlElement.media.currentTime=0),d.htmlElement.media.pause(),d._updateButtons(!1),d._getHtmlStatus(a,!0),d._updateInterface(),d._trigger(b.jPlayer.event.ended))},!1);a.addEventListener("error",function(){c.gate&&(d._updateButtons(!1),
d._seeked(),d.status.srcSet&&(clearTimeout(d.internal.htmlDlyCmdId),d.status.waitForLoad=!0,d.status.waitForPlay=!0,d.status.video&&!d.status.nativeVideoControls&&d.internal.video.jq.css({width:"0px",height:"0px"}),d._validString(d.status.media.poster)&&!d.status.nativeVideoControls&&d.internal.poster.jq.show(),d.css.jq.videoPlay.length&&d.css.jq.videoPlay.show(),d._error({type:b.jPlayer.error.URL,context:d.status.src,message:b.jPlayer.errorMsg.URL,hint:b.jPlayer.errorHint.URL})))},!1);b.each(b.jPlayer.htmlEvent,
function(e,g){a.addEventListener(this,function(){c.gate&&d._trigger(b.jPlayer.event[g])},!1)})},_getHtmlStatus:function(a,b){var d=0,e=0,g=0,f=0;isFinite(a.duration)&&(this.status.duration=a.duration);d=a.currentTime;e=0<this.status.duration?100*d/this.status.duration:0;"object"===typeof a.seekable&&0<a.seekable.length?(g=0<this.status.duration?100*a.seekable.end(a.seekable.length-1)/this.status.duration:100,f=0<this.status.duration?100*a.currentTime/a.seekable.end(a.seekable.length-1):0):(g=100,
f=e);b&&(e=f=d=0);this.status.seekPercent=g;this.status.currentPercentRelative=f;this.status.currentPercentAbsolute=e;this.status.currentTime=d;this.status.videoWidth=a.videoWidth;this.status.videoHeight=a.videoHeight;this.status.readyState=a.readyState;this.status.networkState=a.networkState;this.status.playbackRate=a.playbackRate;this.status.ended=a.ended},_resetStatus:function(){this.status=b.extend({},this.status,b.jPlayer.prototype.status)},_trigger:function(a,c,d){a=b.Event(a);a.jPlayer={};
a.jPlayer.version=b.extend({},this.version);a.jPlayer.options=b.extend(!0,{},this.options);a.jPlayer.status=b.extend(!0,{},this.status);a.jPlayer.html=b.extend(!0,{},this.html);a.jPlayer.flash=b.extend(!0,{},this.flash);c&&(a.jPlayer.error=b.extend({},c));d&&(a.jPlayer.warning=b.extend({},d));this.element.trigger(a)},jPlayerFlashEvent:function(a,c){if(a===b.jPlayer.event.ready)if(this.internal.ready){if(this.flash.gate){if(this.status.srcSet){var d=this.status.currentTime,e=this.status.paused;this.setMedia(this.status.media);
0<d&&(e?this.pause(d):this.play(d))}this._trigger(b.jPlayer.event.flashreset)}}else this.internal.ready=!0,this.internal.flash.jq.css({width:"0px",height:"0px"}),this.version.flash=c.version,this.version.needFlash!==this.version.flash&&this._error({type:b.jPlayer.error.VERSION,context:this.version.flash,message:b.jPlayer.errorMsg.VERSION+this.version.flash,hint:b.jPlayer.errorHint.VERSION}),this._trigger(b.jPlayer.event.repeat),this._trigger(a);if(this.flash.gate)switch(a){case b.jPlayer.event.progress:this._getFlashStatus(c);
this._updateInterface();this._trigger(a);break;case b.jPlayer.event.timeupdate:this._getFlashStatus(c);this._updateInterface();this._trigger(a);break;case b.jPlayer.event.play:this._seeked();this._updateButtons(!0);this._trigger(a);break;case b.jPlayer.event.pause:this._updateButtons(!1);this._trigger(a);break;case b.jPlayer.event.ended:this._updateButtons(!1);this._trigger(a);break;case b.jPlayer.event.click:this._trigger(a);break;case b.jPlayer.event.error:this.status.waitForLoad=!0;this.status.waitForPlay=
!0;this.status.video&&this.internal.flash.jq.css({width:"0px",height:"0px"});this._validString(this.status.media.poster)&&this.internal.poster.jq.show();this.css.jq.videoPlay.length&&this.status.video&&this.css.jq.videoPlay.show();this.status.video?this._flash_setVideo(this.status.media):this._flash_setAudio(this.status.media);this._updateButtons(!1);this._error({type:b.jPlayer.error.URL,context:c.src,message:b.jPlayer.errorMsg.URL,hint:b.jPlayer.errorHint.URL});break;case b.jPlayer.event.seeking:this._seeking();
this._trigger(a);break;case b.jPlayer.event.seeked:this._seeked();this._trigger(a);break;case b.jPlayer.event.ready:break;default:this._trigger(a)}return!1},_getFlashStatus:function(a){this.status.seekPercent=a.seekPercent;this.status.currentPercentRelative=a.currentPercentRelative;this.status.currentPercentAbsolute=a.currentPercentAbsolute;this.status.currentTime=a.currentTime;this.status.duration=a.duration;this.status.videoWidth=a.videoWidth;this.status.videoHeight=a.videoHeight;this.status.readyState=
4;this.status.networkState=0;this.status.playbackRate=1;this.status.ended=!1},_updateButtons:function(a){a!==f&&(this.status.paused=!a,this.css.jq.play.length&&this.css.jq.pause.length&&(a?(this.css.jq.play.hide(),this.css.jq.pause.show()):(this.css.jq.play.show(),this.css.jq.pause.hide())));this.css.jq.restoreScreen.length&&this.css.jq.fullScreen.length&&(this.status.noFullWindow?(this.css.jq.fullScreen.hide(),this.css.jq.restoreScreen.hide()):this.options.fullWindow?(this.css.jq.fullScreen.hide(),
this.css.jq.restoreScreen.show()):(this.css.jq.fullScreen.show(),this.css.jq.restoreScreen.hide()));this.css.jq.repeat.length&&this.css.jq.repeatOff.length&&(this.options.loop?(this.css.jq.repeat.hide(),this.css.jq.repeatOff.show()):(this.css.jq.repeat.show(),this.css.jq.repeatOff.hide()))},_updateInterface:function(){this.css.jq.seekBar.length&&this.css.jq.seekBar.width(this.status.seekPercent+"%");this.css.jq.playBar.length&&(this.options.smoothPlayBar?this.css.jq.playBar.stop().animate({width:this.status.currentPercentAbsolute+
"%"},250,"linear"):this.css.jq.playBar.width(this.status.currentPercentRelative+"%"));this.css.jq.currentTime.length&&this.css.jq.currentTime.text(this._convertTime(this.status.currentTime));this.css.jq.duration.length&&this.css.jq.duration.text(this._convertTime(this.status.duration))},_convertTime:l.prototype.time,_seeking:function(){this.css.jq.seekBar.length&&this.css.jq.seekBar.addClass("jp-seeking-bg")},_seeked:function(){this.css.jq.seekBar.length&&this.css.jq.seekBar.removeClass("jp-seeking-bg")},
_resetGate:function(){this.html.audio.gate=!1;this.html.video.gate=!1;this.flash.gate=!1},_resetActive:function(){this.html.active=!1;this.flash.active=!1},setMedia:function(a){var c=this,d=!1,e=this.status.media.poster!==a.poster;this._resetMedia();this._resetGate();this._resetActive();b.each(this.formats,function(e,f){var j="video"===c.format[f].media;b.each(c.solutions,function(b,e){if(c[e].support[f]&&c._validString(a[f])){var g="html"===e;j?(g?(c.html.video.gate=!0,c._html_setVideo(a),c.html.active=
!0):(c.flash.gate=!0,c._flash_setVideo(a),c.flash.active=!0),c.css.jq.videoPlay.length&&c.css.jq.videoPlay.show(),c.status.video=!0):(g?(c.html.audio.gate=!0,c._html_setAudio(a),c.html.active=!0):(c.flash.gate=!0,c._flash_setAudio(a),c.flash.active=!0),c.css.jq.videoPlay.length&&c.css.jq.videoPlay.hide(),c.status.video=!1);d=!0;return!1}});if(d)return!1});if(d){if((!this.status.nativeVideoControls||!this.html.video.gate)&&this._validString(a.poster))e?this.htmlElement.poster.src=a.poster:this.internal.poster.jq.show();
this.status.srcSet=!0;this.status.media=b.extend({},a);this._updateButtons(!1);this._updateInterface()}else this._error({type:b.jPlayer.error.NO_SUPPORT,context:"{supplied:'"+this.options.supplied+"'}",message:b.jPlayer.errorMsg.NO_SUPPORT,hint:b.jPlayer.errorHint.NO_SUPPORT})},_resetMedia:function(){this._resetStatus();this._updateButtons(!1);this._updateInterface();this._seeked();this.internal.poster.jq.hide();clearTimeout(this.internal.htmlDlyCmdId);this.html.active?this._html_resetMedia():this.flash.active&&
this._flash_resetMedia()},clearMedia:function(){this._resetMedia();this.html.active?this._html_clearMedia():this.flash.active&&this._flash_clearMedia();this._resetGate();this._resetActive()},load:function(){this.status.srcSet?this.html.active?this._html_load():this.flash.active&&this._flash_load():this._urlNotSetError("load")},focus:function(){this.options.keyEnabled&&(b.jPlayer.focus=this)},play:function(a){a="number"===typeof a?a:NaN;this.status.srcSet?(this.focus(),this.html.active?this._html_play(a):
this.flash.active&&this._flash_play(a)):this._urlNotSetError("play")},videoPlay:function(){this.play()},pause:function(a){a="number"===typeof a?a:NaN;this.status.srcSet?this.html.active?this._html_pause(a):this.flash.active&&this._flash_pause(a):this._urlNotSetError("pause")},pauseOthers:function(){var a=this;b.each(this.instances,function(b,d){a.element!==d&&d.data("jPlayer").status.srcSet&&d.jPlayer("pause")})},stop:function(){this.status.srcSet?this.html.active?this._html_pause(0):this.flash.active&&
this._flash_pause(0):this._urlNotSetError("stop")},playHead:function(a){a=this._limitValue(a,0,100);this.status.srcSet?this.html.active?this._html_playHead(a):this.flash.active&&this._flash_playHead(a):this._urlNotSetError("playHead")},_muted:function(a){this.options.muted=a;this.html.used&&this._html_mute(a);this.flash.used&&this._flash_mute(a);!this.html.video.gate&&!this.html.audio.gate&&(this._updateMute(a),this._updateVolume(this.options.volume),this._trigger(b.jPlayer.event.volumechange))},
mute:function(a){a=a===f?!0:!!a;this._muted(a)},unmute:function(a){a=a===f?!0:!!a;this._muted(!a)},_updateMute:function(a){a===f&&(a=this.options.muted);this.css.jq.mute.length&&this.css.jq.unmute.length&&(this.status.noVolume?(this.css.jq.mute.hide(),this.css.jq.unmute.hide()):a?(this.css.jq.mute.hide(),this.css.jq.unmute.show()):(this.css.jq.mute.show(),this.css.jq.unmute.hide()))},volume:function(a){a=this._limitValue(a,0,1);this.options.volume=a;this.html.used&&this._html_volume(a);this.flash.used&&
this._flash_volume(a);!this.html.video.gate&&!this.html.audio.gate&&(this._updateVolume(a),this._trigger(b.jPlayer.event.volumechange))},volumeBar:function(a){if(this.css.jq.volumeBar.length){var b=this.css.jq.volumeBar.offset(),d=a.pageX-b.left,e=this.css.jq.volumeBar.width();a=this.css.jq.volumeBar.height()-a.pageY+b.top;b=this.css.jq.volumeBar.height();this.options.verticalVolume?this.volume(a/b):this.volume(d/e)}this.options.muted&&this._muted(!1)},volumeBarValue:function(a){this.volumeBar(a)},
_updateVolume:function(a){a===f&&(a=this.options.volume);a=this.options.muted?0:a;this.status.noVolume?(this.css.jq.volumeBar.length&&this.css.jq.volumeBar.hide(),this.css.jq.volumeBarValue.length&&this.css.jq.volumeBarValue.hide(),this.css.jq.volumeMax.length&&this.css.jq.volumeMax.hide()):(this.css.jq.volumeBar.length&&this.css.jq.volumeBar.show(),this.css.jq.volumeBarValue.length&&(this.css.jq.volumeBarValue.show(),this.css.jq.volumeBarValue[this.options.verticalVolume?"height":"width"](100*a+
"%")),this.css.jq.volumeMax.length&&this.css.jq.volumeMax.show())},volumeMax:function(){this.volume(1);this.options.muted&&this._muted(!1)},_cssSelectorAncestor:function(a){var c=this;this.options.cssSelectorAncestor=a;this._removeUiClass();this.ancestorJq=a?b(a):[];a&&1!==this.ancestorJq.length&&this._warning({type:b.jPlayer.warning.CSS_SELECTOR_COUNT,context:a,message:b.jPlayer.warningMsg.CSS_SELECTOR_COUNT+this.ancestorJq.length+" found for cssSelectorAncestor.",hint:b.jPlayer.warningHint.CSS_SELECTOR_COUNT});
this._addUiClass();b.each(this.options.cssSelector,function(a,b){c._cssSelector(a,b)})},_cssSelector:function(a,c){var d=this;"string"===typeof c?b.jPlayer.prototype.options.cssSelector[a]?(this.css.jq[a]&&this.css.jq[a].length&&this.css.jq[a].unbind(".jPlayer"),this.options.cssSelector[a]=c,this.css.cs[a]=this.options.cssSelectorAncestor+" "+c,this.css.jq[a]=c?b(this.css.cs[a]):[],this.css.jq[a].length&&this.css.jq[a].bind("click.jPlayer",function(c){c.preventDefault();d[a](c);b(this).blur()}),c&&
1!==this.css.jq[a].length&&this._warning({type:b.jPlayer.warning.CSS_SELECTOR_COUNT,context:this.css.cs[a],message:b.jPlayer.warningMsg.CSS_SELECTOR_COUNT+this.css.jq[a].length+" found for "+a+" method.",hint:b.jPlayer.warningHint.CSS_SELECTOR_COUNT})):this._warning({type:b.jPlayer.warning.CSS_SELECTOR_METHOD,context:a,message:b.jPlayer.warningMsg.CSS_SELECTOR_METHOD,hint:b.jPlayer.warningHint.CSS_SELECTOR_METHOD}):this._warning({type:b.jPlayer.warning.CSS_SELECTOR_STRING,context:c,message:b.jPlayer.warningMsg.CSS_SELECTOR_STRING,
hint:b.jPlayer.warningHint.CSS_SELECTOR_STRING})},seekBar:function(a){if(this.css.jq.seekBar){var b=this.css.jq.seekBar.offset();a=a.pageX-b.left;b=this.css.jq.seekBar.width();this.playHead(100*a/b)}},playBar:function(a){this.seekBar(a)},repeat:function(){this._loop(!0)},repeatOff:function(){this._loop(!1)},_loop:function(a){this.options.loop!==a&&(this.options.loop=a,this._updateButtons(),this._trigger(b.jPlayer.event.repeat))},currentTime:function(){},duration:function(){},gui:function(){},noSolution:function(){},
option:function(a,c){var d=a;if(0===arguments.length)return b.extend(!0,{},this.options);if("string"===typeof a){var e=a.split(".");if(c===f){for(var d=b.extend(!0,{},this.options),g=0;g<e.length;g++)if(d[e[g]]!==f)d=d[e[g]];else return this._warning({type:b.jPlayer.warning.OPTION_KEY,context:a,message:b.jPlayer.warningMsg.OPTION_KEY,hint:b.jPlayer.warningHint.OPTION_KEY}),f;return d}for(var g=d={},h=0;h<e.length;h++)h<e.length-1?(g[e[h]]={},g=g[e[h]]):g[e[h]]=c}this._setOptions(d);return this},_setOptions:function(a){var c=
this;b.each(a,function(a,b){c._setOption(a,b)});return this},_setOption:function(a,c){var d=this;switch(a){case "volume":this.volume(c);break;case "muted":this._muted(c);break;case "cssSelectorAncestor":this._cssSelectorAncestor(c);break;case "cssSelector":b.each(c,function(a,b){d._cssSelector(a,b)});break;case "fullScreen":if(this.options[a]!==c){var e=b.jPlayer.nativeFeatures.fullscreen.used.webkitVideo;if(!e||e&&!this.status.waitForPlay)e||(this.options[a]=c),c?this._requestFullscreen():this._exitFullscreen(),
e||this._setOption("fullWindow",c)}break;case "fullWindow":this.options[a]!==c&&(this._removeUiClass(),this.options[a]=c,this._refreshSize());break;case "size":!this.options.fullWindow&&this.options[a].cssClass!==c.cssClass&&this._removeUiClass();this.options[a]=b.extend({},this.options[a],c);this._refreshSize();break;case "sizeFull":this.options.fullWindow&&this.options[a].cssClass!==c.cssClass&&this._removeUiClass();this.options[a]=b.extend({},this.options[a],c);this._refreshSize();break;case "autohide":this.options[a]=
b.extend({},this.options[a],c);this._updateAutohide();break;case "loop":this._loop(c);break;case "nativeVideoControls":this.options[a]=b.extend({},this.options[a],c);this.status.nativeVideoControls=this._uaBlocklist(this.options.nativeVideoControls);this._restrictNativeVideoControls();this._updateNativeVideoControls();break;case "noFullWindow":this.options[a]=b.extend({},this.options[a],c);this.status.nativeVideoControls=this._uaBlocklist(this.options.nativeVideoControls);this.status.noFullWindow=
this._uaBlocklist(this.options.noFullWindow);this._restrictNativeVideoControls();this._updateButtons();break;case "noVolume":this.options[a]=b.extend({},this.options[a],c);this.status.noVolume=this._uaBlocklist(this.options.noVolume);this._updateVolume();this._updateMute();break;case "emulateHtml":this.options[a]!==c&&((this.options[a]=c)?this._emulateHtmlBridge():this._destroyHtmlBridge());break;case "timeFormat":this.options[a]=b.extend({},this.options[a],c);break;case "keyEnabled":this.options[a]=
c;!c&&this===b.jPlayer.focus&&(b.jPlayer.focus=null);break;case "keyBindings":this.options[a]=b.extend(!0,{},this.options[a],c);break;case "audioFullScreen":this.options[a]=c}return this},_refreshSize:function(){this._setSize();this._addUiClass();this._updateSize();this._updateButtons();this._updateAutohide();this._trigger(b.jPlayer.event.resize)},_setSize:function(){this.options.fullWindow?(this.status.width=this.options.sizeFull.width,this.status.height=this.options.sizeFull.height,this.status.cssClass=
this.options.sizeFull.cssClass):(this.status.width=this.options.size.width,this.status.height=this.options.size.height,this.status.cssClass=this.options.size.cssClass);this.element.css({width:this.status.width,height:this.status.height})},_addUiClass:function(){this.ancestorJq.length&&this.ancestorJq.addClass(this.status.cssClass)},_removeUiClass:function(){this.ancestorJq.length&&this.ancestorJq.removeClass(this.status.cssClass)},_updateSize:function(){this.internal.poster.jq.css({width:this.status.width,
height:this.status.height});!this.status.waitForPlay&&this.html.active&&this.status.video||this.html.video.available&&this.html.used&&this.status.nativeVideoControls?this.internal.video.jq.css({width:this.status.width,height:this.status.height}):!this.status.waitForPlay&&(this.flash.active&&this.status.video)&&this.internal.flash.jq.css({width:this.status.width,height:this.status.height})},_updateAutohide:function(){var a=this,b=function(){a.css.jq.gui.fadeIn(a.options.autohide.fadeIn,function(){clearTimeout(a.internal.autohideId);
a.internal.autohideId=setTimeout(function(){a.css.jq.gui.fadeOut(a.options.autohide.fadeOut)},a.options.autohide.hold)})};this.css.jq.gui.length&&(this.css.jq.gui.stop(!0,!0),clearTimeout(this.internal.autohideId),this.element.unbind(".jPlayerAutohide"),this.css.jq.gui.unbind(".jPlayerAutohide"),this.status.nativeVideoControls?this.css.jq.gui.hide():this.options.fullWindow&&this.options.autohide.full||!this.options.fullWindow&&this.options.autohide.restored?(this.element.bind("mousemove.jPlayer.jPlayerAutohide",
b),this.css.jq.gui.bind("mousemove.jPlayer.jPlayerAutohide",b),this.css.jq.gui.hide()):this.css.jq.gui.show())},fullScreen:function(){this._setOption("fullScreen",!0)},restoreScreen:function(){this._setOption("fullScreen",!1)},_fullscreenAddEventListeners:function(){var a=this,c=b.jPlayer.nativeFeatures.fullscreen;c.api.fullscreenEnabled&&c.event.fullscreenchange&&("function"!==typeof this.internal.fullscreenchangeHandler&&(this.internal.fullscreenchangeHandler=function(){a._fullscreenchange()}),
document.addEventListener(c.event.fullscreenchange,this.internal.fullscreenchangeHandler,!1))},_fullscreenRemoveEventListeners:function(){var a=b.jPlayer.nativeFeatures.fullscreen;this.internal.fullscreenchangeHandler&&document.addEventListener(a.event.fullscreenchange,this.internal.fullscreenchangeHandler,!1)},_fullscreenchange:function(){this.options.fullScreen&&!b.jPlayer.nativeFeatures.fullscreen.api.fullscreenElement()&&this._setOption("fullScreen",!1)},_requestFullscreen:function(){var a=this.ancestorJq.length?
this.ancestorJq[0]:this.element[0],c=b.jPlayer.nativeFeatures.fullscreen;c.used.webkitVideo&&(a=this.htmlElement.video);c.api.fullscreenEnabled&&c.api.requestFullscreen(a)},_exitFullscreen:function(){var a=b.jPlayer.nativeFeatures.fullscreen,c;a.used.webkitVideo&&(c=this.htmlElement.video);a.api.fullscreenEnabled&&a.api.exitFullscreen(c)},_html_initMedia:function(a){var c=b(this.htmlElement.media).empty();b.each(a.track||[],function(a,b){var g=document.createElement("track");g.setAttribute("kind",
b.kind?b.kind:"");g.setAttribute("src",b.src?b.src:"");g.setAttribute("srclang",b.srclang?b.srclang:"");g.setAttribute("label",b.label?b.label:"");b.def&&g.setAttribute("default",b.def);c.append(g)});this.htmlElement.media.src=this.status.src;"none"!==this.options.preload&&this._html_load();this._trigger(b.jPlayer.event.timeupdate)},_html_setFormat:function(a){var c=this;b.each(this.formats,function(b,e){if(c.html.support[e]&&a[e])return c.status.src=a[e],c.status.format[e]=!0,c.status.formatType=
e,!1})},_html_setAudio:function(a){this._html_setFormat(a);this.htmlElement.media=this.htmlElement.audio;this._html_initMedia(a)},_html_setVideo:function(a){this._html_setFormat(a);this.status.nativeVideoControls&&(this.htmlElement.video.poster=this._validString(a.poster)?a.poster:"");this.htmlElement.media=this.htmlElement.video;this._html_initMedia(a)},_html_resetMedia:function(){this.htmlElement.media&&(this.htmlElement.media.id===this.internal.video.id&&!this.status.nativeVideoControls&&this.internal.video.jq.css({width:"0px",
height:"0px"}),this.htmlElement.media.pause())},_html_clearMedia:function(){this.htmlElement.media&&(this.htmlElement.media.src="about:blank",this.htmlElement.media.load())},_html_load:function(){this.status.waitForLoad&&(this.status.waitForLoad=!1,this.htmlElement.media.load());clearTimeout(this.internal.htmlDlyCmdId)},_html_play:function(a){var b=this,d=this.htmlElement.media;this._html_load();if(isNaN(a))d.play();else{this.internal.cmdsIgnored&&d.play();try{if(!d.seekable||"object"===typeof d.seekable&&
0<d.seekable.length)d.currentTime=a,d.play();else throw 1;}catch(e){this.internal.htmlDlyCmdId=setTimeout(function(){b.play(a)},250);return}}this._html_checkWaitForPlay()},_html_pause:function(a){var b=this,d=this.htmlElement.media;0<a?this._html_load():clearTimeout(this.internal.htmlDlyCmdId);d.pause();if(!isNaN(a))try{if(!d.seekable||"object"===typeof d.seekable&&0<d.seekable.length)d.currentTime=a;else throw 1;}catch(e){this.internal.htmlDlyCmdId=setTimeout(function(){b.pause(a)},250);return}0<
a&&this._html_checkWaitForPlay()},_html_playHead:function(a){var b=this,d=this.htmlElement.media;this._html_load();try{if("object"===typeof d.seekable&&0<d.seekable.length)d.currentTime=a*d.seekable.end(d.seekable.length-1)/100;else if(0<d.duration&&!isNaN(d.duration))d.currentTime=a*d.duration/100;else throw"e";}catch(e){this.internal.htmlDlyCmdId=setTimeout(function(){b.playHead(a)},250);return}this.status.waitForLoad||this._html_checkWaitForPlay()},_html_checkWaitForPlay:function(){this.status.waitForPlay&&
(this.status.waitForPlay=!1,this.css.jq.videoPlay.length&&this.css.jq.videoPlay.hide(),this.status.video&&(this.internal.poster.jq.hide(),this.internal.video.jq.css({width:this.status.width,height:this.status.height})))},_html_volume:function(a){this.html.audio.available&&(this.htmlElement.audio.volume=a);this.html.video.available&&(this.htmlElement.video.volume=a)},_html_mute:function(a){this.html.audio.available&&(this.htmlElement.audio.muted=a);this.html.video.available&&(this.htmlElement.video.muted=
a)},_flash_setAudio:function(a){var c=this;try{b.each(this.formats,function(b,d){if(c.flash.support[d]&&a[d]){switch(d){case "m4a":case "fla":c._getMovie().fl_setAudio_m4a(a[d]);break;case "mp3":c._getMovie().fl_setAudio_mp3(a[d]);break;case "rtmpa":c._getMovie().fl_setAudio_rtmp(a[d])}c.status.src=a[d];c.status.format[d]=!0;c.status.formatType=d;return!1}}),"auto"===this.options.preload&&(this._flash_load(),this.status.waitForLoad=!1)}catch(d){this._flashError(d)}},_flash_setVideo:function(a){var c=
this;try{b.each(this.formats,function(b,d){if(c.flash.support[d]&&a[d]){switch(d){case "m4v":case "flv":c._getMovie().fl_setVideo_m4v(a[d]);break;case "rtmpv":c._getMovie().fl_setVideo_rtmp(a[d])}c.status.src=a[d];c.status.format[d]=!0;c.status.formatType=d;return!1}}),"auto"===this.options.preload&&(this._flash_load(),this.status.waitForLoad=!1)}catch(d){this._flashError(d)}},_flash_resetMedia:function(){this.internal.flash.jq.css({width:"0px",height:"0px"});this._flash_pause(NaN)},_flash_clearMedia:function(){try{this._getMovie().fl_clearMedia()}catch(a){this._flashError(a)}},
_flash_load:function(){try{this._getMovie().fl_load()}catch(a){this._flashError(a)}this.status.waitForLoad=!1},_flash_play:function(a){try{this._getMovie().fl_play(a)}catch(b){this._flashError(b)}this.status.waitForLoad=!1;this._flash_checkWaitForPlay()},_flash_pause:function(a){try{this._getMovie().fl_pause(a)}catch(b){this._flashError(b)}0<a&&(this.status.waitForLoad=!1,this._flash_checkWaitForPlay())},_flash_playHead:function(a){try{this._getMovie().fl_play_head(a)}catch(b){this._flashError(b)}this.status.waitForLoad||
this._flash_checkWaitForPlay()},_flash_checkWaitForPlay:function(){this.status.waitForPlay&&(this.status.waitForPlay=!1,this.css.jq.videoPlay.length&&this.css.jq.videoPlay.hide(),this.status.video&&(this.internal.poster.jq.hide(),this.internal.flash.jq.css({width:this.status.width,height:this.status.height})))},_flash_volume:function(a){try{this._getMovie().fl_volume(a)}catch(b){this._flashError(b)}},_flash_mute:function(a){try{this._getMovie().fl_mute(a)}catch(b){this._flashError(b)}},_getMovie:function(){return document[this.internal.flash.id]},
_getFlashPluginVersion:function(){var a=0,b;if(window.ActiveXObject)try{if(b=new ActiveXObject("ShockwaveFlash.ShockwaveFlash")){var d=b.GetVariable("$version");d&&(d=d.split(" ")[1].split(","),a=parseInt(d[0],10)+"."+parseInt(d[1],10))}}catch(e){}else navigator.plugins&&0<navigator.mimeTypes.length&&(b=navigator.plugins["Shockwave Flash"])&&(a=navigator.plugins["Shockwave Flash"].description.replace(/.*\s(\d+\.\d+).*/,"$1"));return 1*a},_checkForFlash:function(a){var b=!1;this._getFlashPluginVersion()>=
a&&(b=!0);return b},_validString:function(a){return a&&"string"===typeof a},_limitValue:function(a,b,d){return a<b?b:a>d?d:a},_urlNotSetError:function(a){this._error({type:b.jPlayer.error.URL_NOT_SET,context:a,message:b.jPlayer.errorMsg.URL_NOT_SET,hint:b.jPlayer.errorHint.URL_NOT_SET})},_flashError:function(a){var c;c=this.internal.ready?"FLASH_DISABLED":"FLASH";this._error({type:b.jPlayer.error[c],context:this.internal.flash.swf,message:b.jPlayer.errorMsg[c]+a.message,hint:b.jPlayer.errorHint[c]});
this.internal.flash.jq.css({width:"1px",height:"1px"})},_error:function(a){this._trigger(b.jPlayer.event.error,a);this.options.errorAlerts&&this._alert("Error!"+(a.message?"\n\n"+a.message:"")+(a.hint?"\n\n"+a.hint:"")+"\n\nContext: "+a.context)},_warning:function(a){this._trigger(b.jPlayer.event.warning,f,a);this.options.warningAlerts&&this._alert("Warning!"+(a.message?"\n\n"+a.message:"")+(a.hint?"\n\n"+a.hint:"")+"\n\nContext: "+a.context)},_alert:function(a){alert("jPlayer "+this.version.script+
" : id='"+this.internal.self.id+"' : "+a)},_emulateHtmlBridge:function(){var a=this;b.each(b.jPlayer.emulateMethods.split(/\s+/g),function(b,d){a.internal.domNode[d]=function(b){a[d](b)}});b.each(b.jPlayer.event,function(c,d){var e=!0;b.each(b.jPlayer.reservedEvent.split(/\s+/g),function(a,b){if(b===c)return e=!1});e&&a.element.bind(d+".jPlayer.jPlayerHtml",function(){a._emulateHtmlUpdate();var b=document.createEvent("Event");b.initEvent(c,!1,!0);a.internal.domNode.dispatchEvent(b)})})},_emulateHtmlUpdate:function(){var a=
this;b.each(b.jPlayer.emulateStatus.split(/\s+/g),function(b,d){a.internal.domNode[d]=a.status[d]});b.each(b.jPlayer.emulateOptions.split(/\s+/g),function(b,d){a.internal.domNode[d]=a.options[d]})},_destroyHtmlBridge:function(){var a=this;this.element.unbind(".jPlayerHtml");b.each((b.jPlayer.emulateMethods+" "+b.jPlayer.emulateStatus+" "+b.jPlayer.emulateOptions).split(/\s+/g),function(b,d){delete a.internal.domNode[d]})}};b.jPlayer.error={FLASH:"e_flash",FLASH_DISABLED:"e_flash_disabled",NO_SOLUTION:"e_no_solution",
NO_SUPPORT:"e_no_support",URL:"e_url",URL_NOT_SET:"e_url_not_set",VERSION:"e_version"};b.jPlayer.errorMsg={FLASH:"jPlayer's Flash fallback is not configured correctly, or a command was issued before the jPlayer Ready event. Details: ",FLASH_DISABLED:"jPlayer's Flash fallback has been disabled by the browser due to the CSS rules you have used. Details: ",NO_SOLUTION:"No solution can be found by jPlayer in this browser. Neither HTML nor Flash can be used.",NO_SUPPORT:"It is not possible to play any media format provided in setMedia() on this browser using your current options.",
URL:"Media URL could not be loaded.",URL_NOT_SET:"Attempt to issue media playback commands, while no media url is set.",VERSION:"jPlayer "+b.jPlayer.prototype.version.script+" needs Jplayer.swf version "+b.jPlayer.prototype.version.needFlash+" but found "};b.jPlayer.errorHint={FLASH:"Check your swfPath option and that Jplayer.swf is there.",FLASH_DISABLED:"Check that you have not display:none; the jPlayer entity or any ancestor.",NO_SOLUTION:"Review the jPlayer options: support and supplied.",NO_SUPPORT:"Video or audio formats defined in the supplied option are missing.",
URL:"Check media URL is valid.",URL_NOT_SET:"Use setMedia() to set the media URL.",VERSION:"Update jPlayer files."};b.jPlayer.warning={CSS_SELECTOR_COUNT:"e_css_selector_count",CSS_SELECTOR_METHOD:"e_css_selector_method",CSS_SELECTOR_STRING:"e_css_selector_string",OPTION_KEY:"e_option_key"};b.jPlayer.warningMsg={CSS_SELECTOR_COUNT:"The number of css selectors found did not equal one: ",CSS_SELECTOR_METHOD:"The methodName given in jPlayer('cssSelector') is not a valid jPlayer method.",CSS_SELECTOR_STRING:"The methodCssSelector given in jPlayer('cssSelector') is not a String or is empty.",
OPTION_KEY:"The option requested in jPlayer('option') is undefined."};b.jPlayer.warningHint={CSS_SELECTOR_COUNT:"Check your css selector and the ancestor.",CSS_SELECTOR_METHOD:"Check your method name.",CSS_SELECTOR_STRING:"Check your css selector is a string.",OPTION_KEY:"Check your option name."}});;;
(function ($, window, document, undefined) {

  var pluginName = "MegaMenu",
    defaults = {
      propertyName: "value"
    };
  var DELAY = 250;

  // the list of menus
  var menus = [];

  function CustomMenu(element, options) {
    this.element = element;

    this.options = $.extend({}, defaults, options);

    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  }

  CustomMenu.prototype = {
    isOpen: false,
    timeout: null,
    init: function () {

      var that = this;

      $(".main-navigation-ul").each(function(index, menu) {

        that.node = menu;
        that.addListeners(menu);

        $(menu).addClass("dropdownJavascript");
        menus.push(menu);

        $(menu).find('ul > li').each(function(index, submenu) {
          if ($(submenu).find('ul').length > 0 ) {
            $(submenu).addClass('with-menu');
          }
        });
      });
    },
    addListeners: function(menu) {
      var that = this;
      $(menu).mouseover(function(e) {
        that.handleMouseOver.call(that, e);
      }).mouseout(function(e) {
          that.handleMouseOut.call(that, e);
        });
    },
    handleMouseOver: function (e) {
      var that = this;
      // clear the timeout
      this.clearTimeout();

      // find the parent list item
      //var item = ('target' in e ? e.target : e.srcElement);
      var item = e.target || e.srcElement;
      while (item.nodeName != 'LI' && item != this.node) {
        item = item.parentNode;
      }

      // if the target is within a list item, set the timeout
      if (item.nodeName == 'LI') {
        this.toOpen = item;
        this.timeout = setTimeout(function() {
          that.open.call(that);
        }, this.options.delay);
      }

    },
    handleMouseOut: function () {
      var that = this;
      // clear the timeout
      this.clearTimeout();

      this.timeout = setTimeout(function() {
        that.close.call(that);
      }, this.options.delay);

    },
    clearTimeout: function () {

      // clear the timeout
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }

    },
    open: function () {

      var that = this;
      // store that the menu is open
      this.isOpen = true;

      // loop over the list items with the same parent
      var items = $(this.toOpen).parent().children('li');
      $(items).each(function(index, item) {
        $(item).find("ul").each(function(index, submenu) {
          if (item != that.toOpen) {
            // close the submenu
            $(item).removeClass("dropdownOpen");
            that.close(item);

          } else if (!$(item).hasClass('dropdownOpen')) {

            // open the submenu
            //if ( !$(item).parents('li').hasClass('has-mega-menu') ) {
              $(item).addClass("dropdownOpen");
            //}


            // determine the location of the edges of the submenu
            var left = 0;
            var node = submenu;
            while (node) {
              //abs is because when you make menus right to left
              //the offsetLeft would be negative
              left += Math.abs(node.offsetLeft);
              node = node.offsetParent;
            }
            var right = left + submenu.offsetWidth;


            //We should refactor this code to execute only when menu is vertical
            var menuHeight = $(submenu).outerHeight();
            var parentTop = $(submenu).offset().top - $(window).scrollTop();
            var totalHeight = menuHeight + parentTop;
            var windowHeight = window.innerHeight;

           /* if (totalHeight > windowHeight) {
              var bestTop = (windowHeight - totalHeight) - 20;
              $(submenu).css('margin-top', bestTop + "px");
            }*/

            //remove any previous classes
            $(item).removeClass('dropdownRightToLeft');

            // move the submenu to the right of the item if appropriate
            if (left < 0) $(item).addClass('dropdownLeftToRight');

            // move the submenu to the left of the item if appropriate
            if (right > document.body.clientWidth) {
              $(item).addClass('dropdownRightToLeft');
            }

          }
        });
      });

    },


    close: function (node) {

      // if no node was specified, close all menus
      if (!node) {
        this.isOpen = false;
        node = this.node;
      }

      // loop over the items, closing their submenus
      $(node).find('li').each(function(index, item) {
        $(item).removeClass('dropdownOpen');
      });

    }
  };

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName,
          new CustomMenu(this, options));
      }
    });
  };

})(jQuery, window, document);
;/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-cssanimations-csstransitions-touch-shiv-cssclasses-prefixed-teststyles-testprop-testallprops-prefixes-domprefixes-load
 */
;
window.Modernizr = function(a, b, c) {
	function z(a) {
		j.cssText = a
	}

	function A(a, b) {
		return z(m.join(a + ";") + (b || ""))
	}

	function B(a, b) {
		return typeof a === b
	}

	function C(a, b) {
		return !!~("" + a).indexOf(b)
	}

	function D(a, b) {
		for (var d in a) {
			var e = a[d];
			if (!C(e, "-") && j[e] !== c) return b == "pfx" ? e : !0
		}
		return !1
	}

	function E(a, b, d) {
		for (var e in a) {
			var f = b[a[e]];
			if (f !== c) return d === !1 ? a[e] : B(f, "function") ? f.bind(d || b) : f
		}
		return !1
	}

	function F(a, b, c) {
		var d = a.charAt(0).toUpperCase() + a.slice(1),
			e = (a + " " + o.join(d + " ") + d).split(" ");
		return B(b, "string") || B(b, "undefined") ? D(e, b) : (e = (a + " " + p.join(d + " ") + d).split(" "), E(e, b, c))
	}
	var d = "2.6.2",
		e = {},
		f = !0,
		g = b.documentElement,
		h = "modernizr",
		i = b.createElement(h),
		j = i.style,
		k, l = {}.toString,
		m = " -webkit- -moz- -o- -ms- ".split(" "),
		n = "Webkit Moz O ms",
		o = n.split(" "),
		p = n.toLowerCase().split(" "),
		q = {},
		r = {},
		s = {},
		t = [],
		u = t.slice,
		v, w = function(a, c, d, e) {
			var f, i, j, k, l = b.createElement("div"),
				m = b.body,
				n = m || b.createElement("body");
			if (parseInt(d, 10))
				while (d--) j = b.createElement("div"), j.id = e ? e[d] : h + (d + 1), l.appendChild(j);
			return f = ["&#173;", '<style id="s', h, '">', a, "</style>"].join(""), l.id = h, (m ? l : n).innerHTML += f, n.appendChild(l), m || (n.style.background = "", n.style.overflow = "hidden", k = g.style.overflow, g.style.overflow = "hidden", g.appendChild(n)), i = c(l, a), m ? l.parentNode.removeChild(l) : (n.parentNode.removeChild(n), g.style.overflow = k), !!i
		},
		x = {}.hasOwnProperty,
		y;
	!B(x, "undefined") && !B(x.call, "undefined") ? y = function(a, b) {
		return x.call(a, b)
	} : y = function(a, b) {
		return b in a && B(a.constructor.prototype[b], "undefined")
	}, Function.prototype.bind || (Function.prototype.bind = function(b) {
		var c = this;
		if (typeof c != "function") throw new TypeError;
		var d = u.call(arguments, 1),
			e = function() {
				if (this instanceof e) {
					var a = function() {};
					a.prototype = c.prototype;
					var f = new a,
						g = c.apply(f, d.concat(u.call(arguments)));
					return Object(g) === g ? g : f
				}
				return c.apply(b, d.concat(u.call(arguments)))
			};
		return e
	}), q.touch = function() {
		var c;
		return "ontouchstart" in a || a.DocumentTouch && b instanceof DocumentTouch ? c = !0 : w(["@media (", m.join("touch-enabled),("), h, ")", "{#modernizr{top:9px;position:absolute}}"].join(""), function(a) {
			c = a.offsetTop === 9
		}), c
	}, q.cssanimations = function() {
		return F("animationName")
	}, q.csstransitions = function() {
		return F("transition")
	};
	for (var G in q) y(q, G) && (v = G.toLowerCase(), e[v] = q[G](), t.push((e[v] ? "" : "no-") + v));
	return e.addTest = function(a, b) {
			if (typeof a == "object")
				for (var d in a) y(a, d) && e.addTest(d, a[d]);
			else {
				a = a.toLowerCase();
				if (e[a] !== c) return e;
				b = typeof b == "function" ? b() : b, typeof f != "undefined" && f && (g.className += " " + (b ? "" : "no-") + a), e[a] = b
			}
			return e
		}, z(""), i = k = null,
		function(a, b) {
			function k(a, b) {
				var c = a.createElement("p"),
					d = a.getElementsByTagName("head")[0] || a.documentElement;
				return c.innerHTML = "x<style>" + b + "</style>", d.insertBefore(c.lastChild, d.firstChild)
			}

			function l() {
				var a = r.elements;
				return typeof a == "string" ? a.split(" ") : a
			}

			function m(a) {
				var b = i[a[g]];
				return b || (b = {}, h++, a[g] = h, i[h] = b), b
			}

			function n(a, c, f) {
				c || (c = b);
				if (j) return c.createElement(a);
				f || (f = m(c));
				var g;
				return f.cache[a] ? g = f.cache[a].cloneNode() : e.test(a) ? g = (f.cache[a] = f.createElem(a)).cloneNode() : g = f.createElem(a), g.canHaveChildren && !d.test(a) ? f.frag.appendChild(g) : g
			}

			function o(a, c) {
				a || (a = b);
				if (j) return a.createDocumentFragment();
				c = c || m(a);
				var d = c.frag.cloneNode(),
					e = 0,
					f = l(),
					g = f.length;
				for (; e < g; e++) d.createElement(f[e]);
				return d
			}

			function p(a, b) {
				b.cache || (b.cache = {}, b.createElem = a.createElement, b.createFrag = a.createDocumentFragment, b.frag = b.createFrag()), a.createElement = function(c) {
					return r.shivMethods ? n(c, a, b) : b.createElem(c)
				}, a.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + l().join().replace(/\w+/g, function(a) {
					return b.createElem(a), b.frag.createElement(a), 'c("' + a + '")'
				}) + ");return n}")(r, b.frag)
			}

			function q(a) {
				a || (a = b);
				var c = m(a);
				return r.shivCSS && !f && !c.hasCSS && (c.hasCSS = !!k(a, "article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")), j || p(a, c), a
			}
			var c = a.html5 || {},
				d = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,
				e = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,
				f, g = "_html5shiv",
				h = 0,
				i = {},
				j;
			(function() {
				try {
					var a = b.createElement("a");
					a.innerHTML = "<xyz></xyz>", f = "hidden" in a, j = a.childNodes.length == 1 || function() {
						b.createElement("a");
						var a = b.createDocumentFragment();
						return typeof a.cloneNode == "undefined" || typeof a.createDocumentFragment == "undefined" || typeof a.createElement == "undefined"
					}()
				} catch (c) {
					f = !0, j = !0
				}
			})();
			var r = {
				elements: c.elements || "abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",
				shivCSS: c.shivCSS !== !1,
				supportsUnknownElements: j,
				shivMethods: c.shivMethods !== !1,
				type: "default",
				shivDocument: q,
				createElement: n,
				createDocumentFragment: o
			};
			a.html5 = r, q(b)
		}(this, b), e._version = d, e._prefixes = m, e._domPrefixes = p, e._cssomPrefixes = o, e.testProp = function(a) {
			return D([a])
		}, e.testAllProps = F, e.testStyles = w, e.prefixed = function(a, b, c) {
			return b ? F(a, b, c) : F(a, "pfx")
		}, g.className = g.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (f ? " js " + t.join(" ") : ""), e
}(this, this.document),
function(a, b, c) {
	function d(a) {
		return "[object Function]" == o.call(a)
	}

	function e(a) {
		return "string" == typeof a
	}

	function f() {}

	function g(a) {
		return !a || "loaded" == a || "complete" == a || "uninitialized" == a
	}

	function h() {
		var a = p.shift();
		q = 1, a ? a.t ? m(function() {
			("c" == a.t ? B.injectCss : B.injectJs)(a.s, 0, a.a, a.x, a.e, 1)
		}, 0) : (a(), h()) : q = 0
	}

	function i(a, c, d, e, f, i, j) {
		function k(b) {
			if (!o && g(l.readyState) && (u.r = o = 1, !q && h(), l.onload = l.onreadystatechange = null, b)) {
				"img" != a && m(function() {
					t.removeChild(l)
				}, 50);
				for (var d in y[c]) y[c].hasOwnProperty(d) && y[c][d].onload()
			}
		}
		var j = j || B.errorTimeout,
			l = b.createElement(a),
			o = 0,
			r = 0,
			u = {
				t: d,
				s: c,
				e: f,
				a: i,
				x: j
			};
		1 === y[c] && (r = 1, y[c] = []), "object" == a ? l.data = c : (l.src = c, l.type = a), l.width = l.height = "0", l.onerror = l.onload = l.onreadystatechange = function() {
			k.call(this, r)
		}, p.splice(e, 0, u), "img" != a && (r || 2 === y[c] ? (t.insertBefore(l, s ? null : n), m(k, j)) : y[c].push(l))
	}

	function j(a, b, c, d, f) {
		return q = 0, b = b || "j", e(a) ? i("c" == b ? v : u, a, b, this.i++, c, d, f) : (p.splice(this.i++, 0, a), 1 == p.length && h()), this
	}

	function k() {
		var a = B;
		return a.loader = {
			load: j,
			i: 0
		}, a
	}
	var l = b.documentElement,
		m = a.setTimeout,
		n = b.getElementsByTagName("script")[0],
		o = {}.toString,
		p = [],
		q = 0,
		r = "MozAppearance" in l.style,
		s = r && !!b.createRange().compareNode,
		t = s ? l : n.parentNode,
		l = a.opera && "[object Opera]" == o.call(a.opera),
		l = !!b.attachEvent && !l,
		u = r ? "object" : l ? "script" : "img",
		v = l ? "script" : u,
		w = Array.isArray || function(a) {
			return "[object Array]" == o.call(a)
		},
		x = [],
		y = {},
		z = {
			timeout: function(a, b) {
				return b.length && (a.timeout = b[0]), a
			}
		},
		A, B;
	B = function(a) {
		function b(a) {
			var a = a.split("!"),
				b = x.length,
				c = a.pop(),
				d = a.length,
				c = {
					url: c,
					origUrl: c,
					prefixes: a
				},
				e, f, g;
			for (f = 0; f < d; f++) g = a[f].split("="), (e = z[g.shift()]) && (c = e(c, g));
			for (f = 0; f < b; f++) c = x[f](c);
			return c
		}

		function g(a, e, f, g, h) {
			var i = b(a),
				j = i.autoCallback;
			i.url.split(".").pop().split("?").shift(), i.bypass || (e && (e = d(e) ? e : e[a] || e[g] || e[a.split("/").pop().split("?")[0]]), i.instead ? i.instead(a, e, f, g, h) : (y[i.url] ? i.noexec = !0 : y[i.url] = 1, f.load(i.url, i.forceCSS || !i.forceJS && "css" == i.url.split(".").pop().split("?").shift() ? "c" : c, i.noexec, i.attrs, i.timeout), (d(e) || d(j)) && f.load(function() {
				k(), e && e(i.origUrl, h, g), j && j(i.origUrl, h, g), y[i.url] = 2
			})))
		}

		function h(a, b) {
			function c(a, c) {
				if (a) {
					if (e(a)) c || (j = function() {
						var a = [].slice.call(arguments);
						k.apply(this, a), l()
					}), g(a, j, b, 0, h);
					else if (Object(a) === a)
						for (n in m = function() {
							var b = 0,
								c;
							for (c in a) a.hasOwnProperty(c) && b++;
							return b
						}(), a) a.hasOwnProperty(n) && (!c && !--m && (d(j) ? j = function() {
							var a = [].slice.call(arguments);
							k.apply(this, a), l()
						} : j[n] = function(a) {
							return function() {
								var b = [].slice.call(arguments);
								a && a.apply(this, b), l()
							}
						}(k[n])), g(a[n], j, b, n, h))
				} else !c && l()
			}
			var h = !!a.test,
				i = a.load || a.both,
				j = a.callback || f,
				k = j,
				l = a.complete || f,
				m, n;
			c(h ? a.yep : a.nope, !!i), i && c(i)
		}
		var i, j, l = this.yepnope.loader;
		if (e(a)) g(a, 0, l, 0);
		else if (w(a))
			for (i = 0; i < a.length; i++) j = a[i], e(j) ? g(j, 0, l, 0) : w(j) ? B(j) : Object(j) === j && h(j, l);
		else Object(a) === a && h(a, l)
	}, B.addPrefix = function(a, b) {
		z[a] = b
	}, B.addFilter = function(a) {
		x.push(a)
	}, B.errorTimeout = 1e4, null == b.readyState && b.addEventListener && (b.readyState = "loading", b.addEventListener("DOMContentLoaded", A = function() {
		b.removeEventListener("DOMContentLoaded", A, 0), b.readyState = "complete"
	}, 0)), a.yepnope = k(), a.yepnope.executeStack = h, a.yepnope.injectJs = function(a, c, d, e, i, j) {
		var k = b.createElement("script"),
			l, o, e = e || B.errorTimeout;
		k.src = a;
		for (o in d) k.setAttribute(o, d[o]);
		c = j ? h : c || f, k.onreadystatechange = k.onload = function() {
			!l && g(k.readyState) && (l = 1, c(), k.onload = k.onreadystatechange = null)
		}, m(function() {
			l || (l = 1, c(1))
		}, e), i ? k.onload() : n.parentNode.insertBefore(k, n)
	}, a.yepnope.injectCss = function(a, c, d, e, g, i) {
		var e = b.createElement("link"),
			j, c = i ? h : c || f;
		e.href = a, e.rel = "stylesheet", e.type = "text/css";
		for (j in d) e.setAttribute(j, d[j]);
		g || (n.parentNode.insertBefore(e, n), m(c, 0))
	}
}(this, document), Modernizr.load = function() {
	yepnope.apply(window, [].slice.call(arguments, 0))
};

;/*
Plugin: jQuery Parallax
Version 1.1.3
Author: Ian Lunn
Twitter: @IanLunn
Author URL: http://www.ianlunn.co.uk/
Plugin URL: http://www.ianlunn.co.uk/plugins/jquery-parallax/

Dual licensed under the MIT and GPL licenses:
http://www.opensource.org/licenses/mit-license.php
http://www.gnu.org/licenses/gpl.html
*/
(function ($) {
        var $window = $(window);
        var windowHeight = $window.height();

        $window.resize(function () {
                windowHeight = $window.height();
        });

        $.fn.parallax = function (xpos, speedFactor) {
                var $this = $(this);
                var getHeight;
                var firstTop;
                var paddingTop = 0;

                //get the starting position of each element to have parallax applied to it      
                $this.each(function () {
                        firstTop = $this.offset().top;
                });

                getHeight = function (jqo) {
                        return jqo.outerHeight(true);
                };

                // setup defaults if arguments aren't specified
                if (arguments.length < 1 || xpos === null) xpos = "50%";
                if (arguments.length < 2 || speedFactor === null) speedFactor = 0.1;
                if (arguments.length < 3 || outerHeight === null) outerHeight = true;

                // function to be called whenever the window is scrolled or resized


                function update() {
                        var pos = $window.scrollTop();

                        $this.each(function () {
                                var $element = $(this);
                                var top = $element.offset().top;
                                var height = getHeight($element);

                                // Check if totally above or totally below viewport
                                if (top + height < pos || top > pos + windowHeight) {
                                        return;
                                }

                                $this.css('backgroundPosition', xpos + " " + Math.round((firstTop - pos) * speedFactor) + "px");
                        });
                }

                $window.bind('scroll', update).resize(update);
                update();
        };
})(jQuery);;

/**
 * @depends jquery
 * @name jquery.scrollto
 * @package jquery-scrollto {@link http://balupton.com/projects/jquery-scrollto}
 */

/**
 * jQuery Aliaser
 */
(function (window, undefined) {
        // Prepare
        var jQuery, $, ScrollTo;
        jQuery = $ = window.jQuery;

        /**
         * jQuery ScrollTo (balupton edition)
         * @version 1.2.0
         * @date July 9, 2012
         * @since 0.1.0, August 27, 2010
         * @package jquery-scrollto {@link http://balupton.com/projects/jquery-scrollto}
         * @author Benjamin "balupton" Lupton {@link http://balupton.com}
         * @copyright (c) 2010 Benjamin Arthur Lupton {@link http://balupton.com}
         * @license MIT License {@link http://creativecommons.org/licenses/MIT/}
         */
        ScrollTo = $.ScrollTo = $.ScrollTo || {
                /**
                 * The Default Configuration
                 */
                config: {
                        duration: 400,
                        easing: 'swing',
                        callback: undefined,
                        durationMode: 'each',
                        offsetTop: 0,
                        offsetLeft: 0
                },

                /**
                 * Configure ScrollTo
                 */
                configure: function (options) {
                        // Apply Options to Config
                        $.extend(ScrollTo.config, options || {});

                        // Chain
                        return this;
                },

                /**
                 * Perform the Scroll Animation for the Collections
                 * We use $inline here, so we can determine the actual offset start for each overflow:scroll item
                 * Each collection is for each overflow:scroll item
                 */
                scroll: function (collections, config) {
                        // Prepare
                        var collection, $container, container, $target, $inline, position, containerScrollTop, containerScrollLeft, containerScrollTopEnd, containerScrollLeftEnd, startOffsetTop, targetOffsetTop, targetOffsetTopAdjusted, startOffsetLeft, targetOffsetLeft, targetOffsetLeftAdjusted, scrollOptions, callback;

                        // Determine the Scroll
                        collection = collections.pop();
                        $container = collection.$container;
                        container = $container.get(0);
                        $target = collection.$target;

                        // Prepare the Inline Element of the Container
                        $inline = $('<span/>').css({
                                'position': 'absolute',
                                'top': '0px',
                                'left': '0px'
                        });
                        position = $container.css('position');

                        // Insert the Inline Element of the Container
                        $container.css('position', 'relative');
                        $inline.appendTo($container);

                        // Determine the top offset
                        startOffsetTop = $inline.offset().top;
                        targetOffsetTop = $target.offset().top;
                        targetOffsetTopAdjusted = targetOffsetTop - startOffsetTop - parseInt(config.offsetTop, 10);

                        // Determine the left offset
                        startOffsetLeft = $inline.offset().left;
                        targetOffsetLeft = $target.offset().left;
                        targetOffsetLeftAdjusted = targetOffsetLeft - startOffsetLeft - parseInt(config.offsetLeft, 10);

                        // Determine current scroll positions
                        containerScrollTop = container.scrollTop;
                        containerScrollLeft = container.scrollLeft;

                        // Reset the Inline Element of the Container
                        $inline.remove();
                        $container.css('position', position);

                        // Prepare the scroll options
                        scrollOptions = {};

                        // Prepare the callback
                        callback = function (event) {
                                // Check
                                if (collections.length === 0) {
                                        // Callback
                                        if (typeof config.callback === 'function') {
                                                config.callback.apply(this, [event]);
                                        }
                                } else {
                                        // Recurse
                                        ScrollTo.scroll(collections, config);
                                }
                                // Return true
                                return true;
                        };

                        // Handle if we only want to scroll if we are outside the viewport
                        if (config.onlyIfOutside) {
                                // Determine current scroll positions
                                containerScrollTopEnd = containerScrollTop + $container.height();
                                containerScrollLeftEnd = containerScrollLeft + $container.width();

                                // Check if we are in the range of the visible area of the container
                                if (containerScrollTop < targetOffsetTopAdjusted && targetOffsetTopAdjusted < containerScrollTopEnd) {
                                        targetOffsetTopAdjusted = containerScrollTop;
                                }
                                if (containerScrollLeft < targetOffsetLeftAdjusted && targetOffsetLeftAdjusted < containerScrollLeftEnd) {
                                        targetOffsetLeftAdjusted = containerScrollLeft;
                                }
                        }

                        // Determine the scroll options
                        if (targetOffsetTopAdjusted !== containerScrollTop) {
                                scrollOptions.scrollTop = targetOffsetTopAdjusted;
                        }
                        if (targetOffsetLeftAdjusted !== containerScrollLeft) {
                                scrollOptions.scrollLeft = targetOffsetLeftAdjusted;
                        }

                        // Perform the scroll
                        if ($.browser.safari && container === document.body) {
                                window.scrollTo(scrollOptions.scrollLeft, scrollOptions.scrollTop);
                                callback();
                        } else if (scrollOptions.scrollTop || scrollOptions.scrollLeft) {
                                $container.animate(scrollOptions, config.duration, config.easing, callback);
                        } else {
                                callback();
                        }

                        // Return true
                        return true;
                },

                /**
                 * ScrollTo the Element using the Options
                 */
                fn: function (options) {
                        // Prepare
                        var collections, config, $container, container;
                        collections = [];

                        // Prepare
                        var $target = $(this);
                        if ($target.length === 0) {
                                // Chain
                                return this;
                        }

                        // Handle Options
                        config = $.extend({}, ScrollTo.config, options);

                        // Fetch
                        $container = $target.parent();
                        container = $container.get(0);

                        // Cycle through the containers
                        while (($container.length === 1) && (container !== document.body) && (container !== document)) {
                                // Check Container for scroll differences
                                var scrollTop, scrollLeft;
                                scrollTop = $container.css('overflow-y') !== 'visible' && container.scrollHeight !== container.clientHeight;
                                scrollLeft = $container.css('overflow-x') !== 'visible' && container.scrollWidth !== container.clientWidth;
                                if (scrollTop || scrollLeft) {
                                        // Push the Collection
                                        collections.push({
                                                '$container': $container,
                                                '$target': $target
                                        });
                                        // Update the Target
                                        $target = $container;
                                }
                                // Update the Container
                                $container = $container.parent();
                                container = $container.get(0);
                        }

                        // Add the final collection
                        collections.push({
                                '$container': $(($.browser.msie || $.browser.mozilla) ? 'html' : 'body'),
                                '$target': $target
                        });

                        // Adjust the Config
                        if (config.durationMode === 'all') {
                                config.duration /= collections.length;
                        }

                        // Handle
                        ScrollTo.scroll(collections, config);

                        // Chain
                        return this;
                }
        };

        // Apply our jQuery Prototype Function
        $.fn.ScrollTo = $.ScrollTo.fn;

})(window);



;;(function ($, window, document, undefined) {

  // Defaults
  var pluginName = "sectiontrans",
    defaults = {
      effect: "fade"
    };

  // The actual plugin constructor
  function Plugin(element, options) {
    this.element = element;

    //merge options and defaults
    this.options = $.extend({}, defaults, options);

    this._defaults = defaults;
    this._name = pluginName;

    this.effectClassName = 'intro-effect-' + this.options.effect;

    this.init();
  }

  Plugin.prototype = {

    init: function () {
      // refreshing the page...
      var pageScroll = this.scrollY();
      this.noscroll = pageScroll === 0;

      this.disable_scroll();

      $(this.element).addClass(this.effectClassName);

      if (pageScroll) {
        this.isRevealed = true;
        $(this.element).addClass('notrans');
        $(this.element).addClass('modify');
      }

      var that = this;

      window.addEventListener('scroll', function(e) {
        that.scrollPage.call(that, e);
      });
    },
    keys: [32, 37, 38, 39, 40],
    docElem: window.document.documentElement,
    scrollVal: 0,
    isRevealed: false,
    noscroll: false,
    isAnimating: false,
    trigger: $('button.trigger'),
    preventDefault: function (e) {
      e = e || window.event;
      if (e.preventDefault)
        e.preventDefault();
      e.returnValue = false;
    },
    ie: (function () {
      var undef, rv = -1; // Return value assumes failure.
      var ua = window.navigator.userAgent;
      var msie = ua.indexOf('MSIE ');
      var trident = ua.indexOf('Trident/');

      if (msie > 0) {
        // IE 10 or older => return version number
        rv = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
      } else if (trident > 0) {
        // IE 11 (or newer) => return version number
        var rvNum = ua.indexOf('rv:');
        rv = parseInt(ua.substring(rvNum + 3, ua.indexOf('.', rvNum)), 10);
      }

      return ((rv > -1) ? rv : undef);
    }()),
    wheel: function (e) {
      // for IE
      //if( ie ) {
      //preventDefault(e);
      //}
    },
    disable_scroll: function () {
      window.onmousewheel = document.onmousewheel = this.wheel;
    },
    enable_scroll: function () {
      window.onmousewheel = document.onmousewheel = document.onkeydown = document.body.ontouchmove = null;
    },
    scrollY: function () {
      return window.pageYOffset || this.docElem.scrollTop;
    },
    scrollPage: function () {
      this.scrollVal = this.scrollY();

      if (this.noscroll && !this.ie) {
        if (this.scrollVal < 0) return false;
        // keep it that way
        window.scrollTo(0, 0);
      }

      if ($(this.element).hasClass('notrans')) {
        $(this.element).removeClass('notrans');
        return false;
      }

      if (this.isAnimating) {
        return false;
      }

      if (this.scrollVal <= 0 && this.isRevealed) {
        this.toggle(0);
      }
      else if (this.scrollVal > 0 && !this.isRevealed) {
        this.toggle(1);
      }
    },
    toggle: function (reveal) {
      this.isAnimating = true;

      if (reveal) {
        $(this.element).addClass('mk-intro-triggered');
        $('.' + this.effectClassName).next().next().addClass('mk-intro-triggered' + ' ' + 'page-effect-'+this.options.effect);
        $('body').addClass('mk-intro-triggered').trigger('page_intro');
      }
      else {
        this.noscroll = true;
        this.disable_scroll();
        $(this.element).removeClass('mk-intro-triggered');
        $('.' + this.effectClassName).next().next().removeClass('mk-intro-triggered' + ' ' + 'page-effect-'+this.options.effect);
        $('body').removeClass('mk-intro-triggered').trigger('page_outro');
      }

      var that = this;
      // simulating the end of the transition:
      setTimeout(function () {
        that.isRevealed = !that.isRevealed;
        that.isAnimating = false;
        if (reveal) {
          that.noscroll = false;
          that.enable_scroll();
        }
      }, 1200);
    }

  };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function (options) {
    return this.each(function () {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName,
          new Plugin(this, options));
      }
    });
  };

})(jQuery, window, document);;;(function ( $, window, document, undefined ) {

  // Defaults
  var pluginName = "stickify",
    defaults = {
      offset: 200
    };

  // The actual plugin constructor
  function Plugin( element, options ) {
    this.element = element;

    //merge options and defaults
    this.options = $.extend( {}, defaults, options) ;

    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  }

  Plugin.prototype = {

    init: function() {
      var _this = this;
      this.options.offset = $(this.element).position().top;

      new ChopScroll(function () {
        if ( $(window).scrollTop() >= _this.options.offset ) {
          if (!_this.isFixed(_this.element)) {
            //raise stickyfied event
            $(window).trigger('stickyfied');
            //trigger fixedCallback
            if (typeof _this.options.fixedCallback === 'function') {
              _this.options.fixedCallback();
            }
          }
          _this.makeFix(_this.element);
        } else {
          if (_this.isFixed(_this.element)) {
            //raise unstickified event
            $(window).trigger('unstickyfied');
            //trigger unfixedCallback
            if (typeof _this.options.unfixedCallback === 'function') {
              _this.options.unfixedCallback();
            }
          }
          _this.unfix(_this.element);
        }
      }, 10, 'sticky');

      /*
      onThrottledScroll('sticky', function () {
        if ( $(window).scrollTop() >= _this.options.offset ) {
          if (!_this.isFixed(_this.element)) {
            //raise stickyfied event
            $(window).trigger('stickyfied');
            //trigger fixedCallback
            if (typeof _this.options.fixedCallback === 'function') {
              _this.options.fixedCallback();
            }
          }
          _this.makeFix(_this.element);
        } else {
          if (_this.isFixed(_this.element)) {
            //raise unstickified event
            $(window).trigger('unstickyfied');
            //trigger unfixedCallback
            if (typeof _this.options.unfixedCallback === 'function') {
              _this.options.unfixedCallback();
            }
          }
          _this.unfix(_this.element);
        }
      });
      */

    },

    makeFix: function(el) {
      $(el).addClass(this.options.fixClass);
    },

    unfix: function (el) {
      $(el).removeClass(this.options.fixClass);
    },

    isFixed: function (el) {
      return $(el).hasClass(this.options.fixClass);
    }



  };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function ( options ) {
    return this.each(function () {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName,
          new Plugin( this, options ));
      }
    });
  };

})( jQuery, window, document );;

/*
 * Swiper 2.4+ - Mobile Touch Slider
 * http://www.idangero.us/sliders/swiper/
 *
 * Copyright 2012-2013, Vladimir Kharlampidi
 * The iDangero.us
 * http://www.idangero.us/
 *
 * Licensed under GPL & MIT
 *
 * Updated on: December 6, 2013
 */
var Swiper = function (selector, params) {
    'use strict';

    /*=========================
      A little bit dirty but required part for IE8 and old FF support
      ===========================*/
    if (document.body.__defineGetter__) {
        if (HTMLElement) {
            var element = HTMLElement.prototype;
            if (element.__defineGetter__) {
                element.__defineGetter__('outerHTML', function () { return new XMLSerializer().serializeToString(this); });
            }
        }
    }

    if (!window.getComputedStyle) {
        window.getComputedStyle = function (el, pseudo) {
            this.el = el;
            this.getPropertyValue = function (prop) {
                var re = /(\-([a-z]){1})/g;
                if (prop === 'float') prop = 'styleFloat';
                if (re.test(prop)) {
                    prop = prop.replace(re, function () {
                        return arguments[2].toUpperCase();
                    });
                }
                return el.currentStyle[prop] ? el.currentStyle[prop] : null;
            };
            return this;
        };
    }
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (obj, start) {
            for (var i = (start || 0), j = this.length; i < j; i++) {
                if (this[i] === obj) { return i; }
            }
            return -1;
        };
    }
    if (!document.querySelectorAll) {
        if (!window.jQuery) return;
    }
    function $$(selector, context) {
        if (document.querySelectorAll)
            return (context || document).querySelectorAll(selector);
        else
            return jQuery(selector, context);
    }

    /*=========================
      Check for correct selector
      ===========================*/
    if (typeof selector === 'undefined') return;

    if (!(selector.nodeType)) {
        if ($$(selector).length === 0) return;
    }

     /*=========================
      _this
      ===========================*/
    var _this = this;

     /*=========================
      Default Flags and vars
      ===========================*/
    _this.touches = {
        start: 0,
        startX: 0,
        startY: 0,
        current: 0,
        currentX: 0,
        currentY: 0,
        diff: 0,
        abs: 0
    };
    _this.positions = {
        start: 0,
        abs: 0,
        diff: 0,
        current: 0
    };
    _this.times = {
        start: 0,
        end: 0
    };

    _this.id = (new Date()).getTime();
    _this.container = (selector.nodeType) ? selector : $$(selector)[0];
    _this.isTouched = false;
    _this.isMoved = false;
    _this.activeIndex = 0;
    _this.centerIndex = 0;
    _this.activeLoaderIndex = 0;
    _this.activeLoopIndex = 0;
    _this.previousIndex = null;
    _this.velocity = 0;
    _this.snapGrid = [];
    _this.slidesGrid = [];
    _this.imagesToLoad = [];
    _this.imagesLoaded = 0;
    _this.wrapperLeft = 0;
    _this.wrapperRight = 0;
    _this.wrapperTop = 0;
    _this.wrapperBottom = 0;
    _this.isAndroid = navigator.userAgent.toLowerCase().indexOf('android') >= 0;
    var wrapper, slideSize, wrapperSize, direction, isScrolling, containerSize;

    /*=========================
      Default Parameters
      ===========================*/
    var defaults = {
        eventTarget: 'wrapper', // or 'container'
        mode : 'horizontal', // or 'vertical'
        touchRatio : 1,
        speed : 300,
        freeMode : false,
        freeModeFluid : false,
        momentumRatio: 1,
        momentumBounce: true,
        momentumBounceRatio: 1,
        slidesPerView : 1,
        slidesPerGroup : 1,
        slidesPerViewFit: true, //Fit to slide when spv "auto" and slides larger than container
        simulateTouch : true,
        followFinger : true,
        shortSwipes : true,
        longSwipesRatio: 0.5,
        moveStartThreshold: false,
        onlyExternal : false,
        createPagination : true,
        pagination : false,
        paginationElement: 'span',
        paginationClickable: false,
        paginationAsRange: true,
        resistance : true, // or false or 100%
        scrollContainer : false,
        preventLinks : true,
        preventLinksPropagation: false,
        noSwiping : false, // or class
        noSwipingClass : 'swiper-no-swiping', //:)
        initialSlide: 0,
        keyboardControl: false,
        mousewheelControl : false,
        mousewheelControlForceToAxis : false,
        useCSS3Transforms : true,
        // Autoplay
        autoplay: false,
        autoplayDisableOnInteraction: true,
        autoplayStopOnLast: false,
        //Loop mode
        loop: false,
        loopAdditionalSlides: 0,
        // Round length values
        roundLengths: false,
        //Auto Height
        calculateHeight: false,
        cssWidthAndHeight: false,
        //Images Preloader
        updateOnImagesReady : true,
        //Form elements
        releaseFormElements : true,
        //Watch for active slide, useful when use effects on different slide states
        watchActiveIndex: false,
        //Slides Visibility Fit
        visibilityFullFit : false,
        //Slides Offset
        offsetPxBefore : 0,
        offsetPxAfter : 0,
        offsetSlidesBefore : 0,
        offsetSlidesAfter : 0,
        centeredSlides: false,
        //Queue callbacks
        queueStartCallbacks : false,
        queueEndCallbacks : false,
        //Auto Resize
        autoResize : true,
        resizeReInit : false,
        //DOMAnimation
        DOMAnimation : true,
        //Slides Loader
        loader: {
            slides: [], //array with slides
            slidesHTMLType: 'inner', // or 'outer'
            surroundGroups: 1, //keep preloaded slides groups around view
            logic: 'reload', //or 'change'
            loadAllSlides: false
        },
        //Namespace
        slideElement: 'div',
        slideClass: 'swiper-slide',
        slideActiveClass: 'swiper-slide-active',
        slideVisibleClass: 'swiper-slide-visible',
        slideDuplicateClass: 'swiper-slide-duplicate',
        wrapperClass: 'mk-swiper-wrapper',
        paginationElementClass: 'swiper-pagination-switch',
        paginationActiveClass: 'swiper-active-switch',
        paginationVisibleClass: 'swiper-visible-switch'
    };
    params = params || {};
    for (var prop in defaults) {
        if (prop in params && typeof params[prop] === 'object') {
            for (var subProp in defaults[prop]) {
                if (! (subProp in params[prop])) {
                    params[prop][subProp] = defaults[prop][subProp];
                }
            }
        }
        else if (! (prop in params)) {
            params[prop] = defaults[prop];
        }
    }
    _this.params = params;
    if (params.scrollContainer) {
        params.freeMode = true;
        params.freeModeFluid = true;
    }
    if (params.loop) {
        params.resistance = '100%';
    }
    var isH = params.mode === 'horizontal';

    /*=========================
      Define Touch Events
      ===========================*/
    var desktopEvents = ['mousedown', 'mousemove', 'mouseup'];
    if (_this.browser.ie10) desktopEvents = ['MSPointerDown', 'MSPointerMove', 'MSPointerUp'];
    if (_this.browser.ie11) desktopEvents = ['pointerdown', 'pointermove', 'pointerup'];

    _this.touchEvents = {
        touchStart : _this.support.touch || !params.simulateTouch  ? 'touchstart' : desktopEvents[0],
        touchMove : _this.support.touch || !params.simulateTouch ? 'touchmove' : desktopEvents[1],
        touchEnd : _this.support.touch || !params.simulateTouch ? 'touchend' : desktopEvents[2]
    };

    /*=========================
      Wrapper
      ===========================*/
    for (var i = _this.container.childNodes.length - 1; i >= 0; i--) {
        if (_this.container.childNodes[i].className) {
            var _wrapperClasses = _this.container.childNodes[i].className.split(/\s+/);
            for (var j = 0; j < _wrapperClasses.length; j++) {
                if (_wrapperClasses[j] === params.wrapperClass) {
                    wrapper = _this.container.childNodes[i];
                }
            }
        }
    }

    _this.wrapper = wrapper;
    /*=========================
      Slide API
      ===========================*/
    _this._extendSwiperSlide = function  (el) {
        el.append = function () {
            if (params.loop) {
                el.insertAfter(_this.slides.length - _this.loopedSlides);
            }
            else {
                _this.wrapper.appendChild(el);
                _this.reInit();
            }

            return el;
        };
        el.prepend = function () {
            if (params.loop) {
                _this.wrapper.insertBefore(el, _this.slides[_this.loopedSlides]);
                _this.removeLoopedSlides();
                _this.calcSlides();
                _this.createLoop();
            }
            else {
                _this.wrapper.insertBefore(el, _this.wrapper.firstChild);
            }
            _this.reInit();
            return el;
        };
        el.insertAfter = function (index) {
            if (typeof index === 'undefined') return false;
            var beforeSlide;

            if (params.loop) {
                beforeSlide = _this.slides[index + 1 + _this.loopedSlides];
                if (beforeSlide) {
                    _this.wrapper.insertBefore(el, beforeSlide);
                }
                else {
                    _this.wrapper.appendChild(el);
                }
                _this.removeLoopedSlides();
                _this.calcSlides();
                _this.createLoop();
            }
            else {
                beforeSlide = _this.slides[index + 1];
                _this.wrapper.insertBefore(el, beforeSlide);
            }
            _this.reInit();
            return el;
        };
        el.clone = function () {
            return _this._extendSwiperSlide(el.cloneNode(true));
        };
        el.remove = function () {
            _this.wrapper.removeChild(el);
            _this.reInit();
        };
        el.html = function (html) {
            if (typeof html === 'undefined') {
                return el.innerHTML;
            }
            else {
                el.innerHTML = html;
                return el;
            }
        };
        el.index = function () {
            var index;
            for (var i = _this.slides.length - 1; i >= 0; i--) {
                if (el === _this.slides[i]) index = i;
            }
            return index;
        };
        el.isActive = function () {
            if (el.index() === _this.activeIndex) return true;
            else return false;
        };
        if (!el.swiperSlideDataStorage) el.swiperSlideDataStorage = {};
        el.getData = function (name) {
            return el.swiperSlideDataStorage[name];
        };
        el.setData = function (name, value) {
            el.swiperSlideDataStorage[name] = value;
            return el;
        };
        el.data = function (name, value) {
            if (typeof value === 'undefined') {
                return el.getAttribute('data-' + name);
            }
            else {
                el.setAttribute('data-' + name, value);
                return el;
            }
        };
        el.getWidth = function (outer, round) {
            return _this.h.getWidth(el, outer, round);
        };
        el.getHeight = function (outer, round) {
            return _this.h.getHeight(el, outer, round);
        };
        el.getOffset = function () {
            return _this.h.getOffset(el);
        };
        return el;
    };

    //Calculate information about number of slides
    _this.calcSlides = function (forceCalcSlides) {
        var oldNumber = _this.slides ? _this.slides.length : false;
        _this.slides = [];
        _this.displaySlides = [];
        for (var i = 0; i < _this.wrapper.childNodes.length; i++) {
            if (_this.wrapper.childNodes[i].className) {
                var _className = _this.wrapper.childNodes[i].className;
                var _slideClasses = _className.split(/\s+/);
                for (var j = 0; j < _slideClasses.length; j++) {
                    if (_slideClasses[j] === params.slideClass) {
                        _this.slides.push(_this.wrapper.childNodes[i]);
                    }
                }
            }
        }
        for (i = _this.slides.length - 1; i >= 0; i--) {
            _this._extendSwiperSlide(_this.slides[i]);
        }
        if (oldNumber === false) return;
        if (oldNumber !== _this.slides.length || forceCalcSlides) {

            // Number of slides has been changed
            removeSlideEvents();
            addSlideEvents();
            _this.updateActiveSlide();
            if (_this.params.pagination) _this.createPagination();
            _this.callPlugins('numberOfSlidesChanged');
        }
    };

    //Create Slide
    _this.createSlide = function (html, slideClassList, el) {
        slideClassList = slideClassList || _this.params.slideClass;
        el = el || params.slideElement;
        var newSlide = document.createElement(el);
        newSlide.innerHTML = html || '';
        newSlide.className = slideClassList;
        return _this._extendSwiperSlide(newSlide);
    };

    //Append Slide
    _this.appendSlide = function (html, slideClassList, el) {
        if (!html) return;
        if (html.nodeType) {
            return _this._extendSwiperSlide(html).append();
        }
        else {
            return _this.createSlide(html, slideClassList, el).append();
        }
    };
    _this.prependSlide = function (html, slideClassList, el) {
        if (!html) return;
        if (html.nodeType) {
            return _this._extendSwiperSlide(html).prepend();
        }
        else {
            return _this.createSlide(html, slideClassList, el).prepend();
        }
    };
    _this.insertSlideAfter = function (index, html, slideClassList, el) {
        if (typeof index === 'undefined') return false;
        if (html.nodeType) {
            return _this._extendSwiperSlide(html).insertAfter(index);
        }
        else {
            return _this.createSlide(html, slideClassList, el).insertAfter(index);
        }
    };
    _this.removeSlide = function (index) {
        if (_this.slides[index]) {
            if (params.loop) {
                if (!_this.slides[index + _this.loopedSlides]) return false;
                _this.slides[index + _this.loopedSlides].remove();
                _this.removeLoopedSlides();
                _this.calcSlides();
                _this.createLoop();
            }
            else _this.slides[index].remove();
            return true;
        }
        else return false;
    };
    _this.removeLastSlide = function () {
        if (_this.slides.length > 0) {
            if (params.loop) {
                _this.slides[_this.slides.length - 1 - _this.loopedSlides].remove();
                _this.removeLoopedSlides();
                _this.calcSlides();
                _this.createLoop();
            }
            else _this.slides[_this.slides.length - 1].remove();
            return true;
        }
        else {
            return false;
        }
    };
    _this.removeAllSlides = function () {
        for (var i = _this.slides.length - 1; i >= 0; i--) {
            _this.slides[i].remove();
        }
    };
    _this.getSlide = function (index) {
        return _this.slides[index];
    };
    _this.getLastSlide = function () {
        return _this.slides[_this.slides.length - 1];
    };
    _this.getFirstSlide = function () {
        return _this.slides[0];
    };

    //Currently Active Slide
    _this.activeSlide = function () {
        return _this.slides[_this.activeIndex];
    };

    /*=========================
     Wrapper for Callbacks : Allows additive callbacks via function arrays
     ===========================*/
    _this.fireCallback = function () {
        var callback = arguments[0];
        if (Object.prototype.toString.call(callback) === '[object Array]') {
            for (var i = 0; i < callback.length; i++) {
                if (typeof callback[i] === 'function') {
                    callback[i](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                }
            }
        } else if (Object.prototype.toString.call(callback) === '[object String]') {
            if (params['on' + callback]) _this.fireCallback(params['on' + callback]);
        } else {
            callback(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
        }
    };
    function isArray(obj) {
        if (Object.prototype.toString.apply(obj) === '[object Array]') return true;
        return false;
    }

    /**
     * Allows user to add callbacks, rather than replace them
     * @param callback
     * @param func
     * @return {*}
     */
    _this.addCallback = function (callback, func) {
        var _this = this, tempFunc;
        if (_this.params['on' + callback]) {
            if (isArray(this.params['on' + callback])) {
                return this.params['on' + callback].push(func);
            } else if (typeof this.params['on' + callback] === 'function') {
                tempFunc = this.params['on' + callback];
                this.params['on' + callback] = [];
                this.params['on' + callback].push(tempFunc);
                return this.params['on' + callback].push(func);
            }
        } else {
            this.params['on' + callback] = [];
            return this.params['on' + callback].push(func);
        }
    };
    _this.removeCallbacks = function (callback) {
        if (_this.params['on' + callback]) {
            _this.params['on' + callback] = null;
        }
    };

    /*=========================
      Plugins API
      ===========================*/
    var _plugins = [];
    for (var plugin in _this.plugins) {
        if (params[plugin]) {
            var p = _this.plugins[plugin](_this, params[plugin]);
            if (p) _plugins.push(p);
        }
    }
    _this.callPlugins = function (method, args) {
        if (!args) args = {};
        for (var i = 0; i < _plugins.length; i++) {
            if (method in _plugins[i]) {
                _plugins[i][method](args);
            }
        }
    };

    /*=========================
      Windows Phone 8 Fix
      ===========================*/
    if ((_this.browser.ie10 || _this.browser.ie11) && !params.onlyExternal) {
        _this.wrapper.classList.add('swiper-wp8-' + (isH ? 'horizontal' : 'vertical'));
    }

    /*=========================
      Free Mode Class
      ===========================*/
    if (params.freeMode) {
        _this.container.className += ' swiper-free-mode';
    }

    /*==================================================
        Init/Re-init/Resize Fix
    ====================================================*/
    _this.initialized = false;
    _this.init = function (force, forceCalcSlides) {
        var _width = _this.h.getWidth(_this.container, false, params.roundLengths);
        var _height = _this.h.getHeight(_this.container, false, params.roundLengths);
        if (_width === _this.width && _height === _this.height && !force) return;
        
        _this.width = _width;
        _this.height = _height;

        var slideWidth, slideHeight, slideMaxHeight, wrapperWidth, wrapperHeight, slideLeft;
        var i; // loop index variable to avoid JSHint W004 / W038
        containerSize = isH ? _width : _height;
        var wrapper = _this.wrapper;

        if (force) {
            _this.calcSlides(forceCalcSlides);
        }

        if (params.slidesPerView === 'auto') {
            //Auto mode
            var slidesWidth = 0;
            var slidesHeight = 0;

            //Unset Styles
            if (params.slidesOffset > 0) {
                wrapper.style.paddingLeft = '';
                wrapper.style.paddingRight = '';
                wrapper.style.paddingTop = '';
                wrapper.style.paddingBottom = '';
            }
            wrapper.style.width = '';
            wrapper.style.height = '';
            if (params.offsetPxBefore > 0) {
                if (isH) _this.wrapperLeft = params.offsetPxBefore;
                else _this.wrapperTop = params.offsetPxBefore;
            }
            if (params.offsetPxAfter > 0) {
                if (isH) _this.wrapperRight = params.offsetPxAfter;
                else _this.wrapperBottom = params.offsetPxAfter;
            }

            if (params.centeredSlides) {
                if (isH) {
                    _this.wrapperLeft = (containerSize - this.slides[0].getWidth(true, params.roundLengths)) / 2;
                    _this.wrapperRight = (containerSize - _this.slides[_this.slides.length - 1].getWidth(true, params.roundLengths)) / 2;
                }
                else {
                    _this.wrapperTop = (containerSize - _this.slides[0].getHeight(true, params.roundLengths)) / 2;
                    _this.wrapperBottom = (containerSize - _this.slides[_this.slides.length - 1].getHeight(true, params.roundLengths)) / 2;
                }
            }

            if (isH) {
                if (_this.wrapperLeft >= 0) wrapper.style.paddingLeft = _this.wrapperLeft + 'px';
                if (_this.wrapperRight >= 0) wrapper.style.paddingRight = _this.wrapperRight + 'px';
            }
            else {
                if (_this.wrapperTop >= 0) wrapper.style.paddingTop = _this.wrapperTop + 'px';
                if (_this.wrapperBottom >= 0) wrapper.style.paddingBottom = _this.wrapperBottom + 'px';
            }
            slideLeft = 0;
            var centeredSlideLeft = 0;
            _this.snapGrid = [];
            _this.slidesGrid = [];

            slideMaxHeight = 0;
            for (i = 0; i < _this.slides.length; i++) {
                slideWidth = _this.slides[i].getWidth(true, params.roundLengths);
                slideHeight = _this.slides[i].getHeight(true, params.roundLengths);
                if (params.calculateHeight) {
                    slideMaxHeight = Math.max(slideMaxHeight, slideHeight);
                }
                var _slideSize = isH ? slideWidth : slideHeight;
                if (params.centeredSlides) {
                    var nextSlideWidth = i === _this.slides.length - 1 ? 0 : _this.slides[i + 1].getWidth(true, params.roundLengths);
                    var nextSlideHeight = i === _this.slides.length - 1 ? 0 : _this.slides[i + 1].getHeight(true, params.roundLengths);
                    var nextSlideSize = isH ? nextSlideWidth : nextSlideHeight;
                    if (_slideSize > containerSize) {
                        if (params.slidesPerViewFit) {
                            _this.snapGrid.push(slideLeft + _this.wrapperLeft);
                            _this.snapGrid.push(slideLeft + _slideSize - containerSize + _this.wrapperLeft);
                        }
                        else {
                            for (var j = 0; j <= Math.floor(_slideSize / (containerSize + _this.wrapperLeft)); j++) {
                                if (j === 0) _this.snapGrid.push(slideLeft + _this.wrapperLeft);
                                else _this.snapGrid.push(slideLeft + _this.wrapperLeft + containerSize * j);
                            }
                        }
                        _this.slidesGrid.push(slideLeft + _this.wrapperLeft);
                    }
                    else {
                        _this.snapGrid.push(centeredSlideLeft);
                        _this.slidesGrid.push(centeredSlideLeft);
                    }
                    centeredSlideLeft += _slideSize / 2 + nextSlideSize / 2;
                }
                else {
                    if (_slideSize > containerSize) {
                        if (params.slidesPerViewFit) {
                            _this.snapGrid.push(slideLeft);
                            _this.snapGrid.push(slideLeft + _slideSize - containerSize);
                        }
                        else {
                            if (containerSize !== 0) {
                                for (var k = 0; k <= Math.floor(_slideSize / containerSize); k++) {
                                    _this.snapGrid.push(slideLeft + containerSize * k);
                                }
                            }
                            else {
                                _this.snapGrid.push(slideLeft);
                            }
                        }
                            
                    }
                    else {
                        _this.snapGrid.push(slideLeft);
                    }
                    _this.slidesGrid.push(slideLeft);
                }

                slideLeft += _slideSize;

                slidesWidth += slideWidth;
                slidesHeight += slideHeight;
            }
            if (params.calculateHeight) _this.height = slideMaxHeight;
            if (isH) {
                wrapperSize = slidesWidth + _this.wrapperRight + _this.wrapperLeft;
                wrapper.style.width = (slidesWidth) + 'px';
                wrapper.style.height = (_this.height) + 'px';
            }
            else {
                wrapperSize = slidesHeight + _this.wrapperTop + _this.wrapperBottom;
                wrapper.style.width = (_this.width) + 'px';
                wrapper.style.height = (slidesHeight) + 'px';
            }

        }
        else if (params.scrollContainer) {
            //Scroll Container
            wrapper.style.width = '';
            wrapper.style.height = '';
            wrapperWidth = _this.slides[0].getWidth(true, params.roundLengths);
            wrapperHeight = _this.slides[0].getHeight(true, params.roundLengths);
            wrapperSize = isH ? wrapperWidth : wrapperHeight;
            wrapper.style.width = wrapperWidth + 'px';
            wrapper.style.height = wrapperHeight + 'px';
            slideSize = isH ? wrapperWidth : wrapperHeight;

        }
        else {
            //For usual slides
            if (params.calculateHeight) {
                slideMaxHeight = 0;
                wrapperHeight = 0;
                //ResetWrapperSize
                if (!isH) _this.container.style.height = '';
                wrapper.style.height = '';

                for (i = 0; i < _this.slides.length; i++) {
                    //ResetSlideSize
                    _this.slides[i].style.height = '';
                    slideMaxHeight = Math.max(_this.slides[i].getHeight(true), slideMaxHeight);
                    if (!isH) wrapperHeight += _this.slides[i].getHeight(true);
                }
                slideHeight = slideMaxHeight;
                _this.height = slideHeight;

                if (isH) wrapperHeight = slideHeight;
                else {
                    containerSize = slideHeight;
                    _this.container.style.height = containerSize + 'px';
                }
            }
            else {
                slideHeight = isH ? _this.height : _this.height / params.slidesPerView;
                if (params.roundLengths) slideHeight = Math.round(slideHeight);
                wrapperHeight = isH ? _this.height : _this.slides.length * slideHeight;
            }
            slideWidth = isH ? _this.width / params.slidesPerView : _this.width;
            if (params.roundLengths) slideWidth = Math.round(slideWidth);
            wrapperWidth = isH ? _this.slides.length * slideWidth : _this.width;
            slideSize = isH ? slideWidth : slideHeight;

            if (params.offsetSlidesBefore > 0) {
                if (isH) _this.wrapperLeft = slideSize * params.offsetSlidesBefore;
                else _this.wrapperTop = slideSize * params.offsetSlidesBefore;
            }
            if (params.offsetSlidesAfter > 0) {
                if (isH) _this.wrapperRight = slideSize * params.offsetSlidesAfter;
                else _this.wrapperBottom = slideSize * params.offsetSlidesAfter;
            }
            if (params.offsetPxBefore > 0) {
                if (isH) _this.wrapperLeft = params.offsetPxBefore;
                else _this.wrapperTop = params.offsetPxBefore;
            }
            if (params.offsetPxAfter > 0) {
                if (isH) _this.wrapperRight = params.offsetPxAfter;
                else _this.wrapperBottom = params.offsetPxAfter;
            }
            if (params.centeredSlides) {
                if (isH) {
                    _this.wrapperLeft = (containerSize - slideSize) / 2;
                    _this.wrapperRight = (containerSize - slideSize) / 2;
                }
                else {
                    _this.wrapperTop = (containerSize - slideSize) / 2;
                    _this.wrapperBottom = (containerSize - slideSize) / 2;
                }
            }
            if (isH) {
                if (_this.wrapperLeft > 0) wrapper.style.paddingLeft = _this.wrapperLeft + 'px';
                if (_this.wrapperRight > 0) wrapper.style.paddingRight = _this.wrapperRight + 'px';
            }
            else {
                if (_this.wrapperTop > 0) wrapper.style.paddingTop = _this.wrapperTop + 'px';
                if (_this.wrapperBottom > 0) wrapper.style.paddingBottom = _this.wrapperBottom + 'px';
            }

            wrapperSize = isH ? wrapperWidth + _this.wrapperRight + _this.wrapperLeft : wrapperHeight + _this.wrapperTop + _this.wrapperBottom;
            if (!params.cssWidthAndHeight) {
                if (parseFloat(wrapperWidth) > 0) {
                    wrapper.style.width = wrapperWidth + 'px';
                }
                if (parseFloat(wrapperHeight) > 0) {
                    wrapper.style.height = wrapperHeight + 'px';
                }
            }
            slideLeft = 0;
            _this.snapGrid = [];
            _this.slidesGrid = [];
            for (i = 0; i < _this.slides.length; i++) {
                _this.snapGrid.push(slideLeft);
                _this.slidesGrid.push(slideLeft);
                slideLeft += slideSize;
                if (!params.cssWidthAndHeight) {
                    if (parseFloat(slideWidth) > 0) {
                        _this.slides[i].style.width = slideWidth + 'px';
                    }
                    if (parseFloat(slideHeight) > 0) {
                        _this.slides[i].style.height = slideHeight + 'px';
                    }
                }
            }

        }

        if (!_this.initialized) {
            _this.callPlugins('onFirstInit');
            if (params.onFirstInit) _this.fireCallback(params.onFirstInit, _this);
        }
        else {
            _this.callPlugins('onInit');
            if (params.onInit) _this.fireCallback(params.onInit, _this);
        }
        _this.initialized = true;
    };

    _this.reInit = function (forceCalcSlides) {
        _this.init(true, forceCalcSlides);
    };

    _this.resizeFix = function (reInit) {
        _this.callPlugins('beforeResizeFix');

        _this.init(params.resizeReInit || reInit);

        // swipe to active slide in fixed mode
        if (!params.freeMode) {
            _this.swipeTo((params.loop ? _this.activeLoopIndex : _this.activeIndex), 0, false);
            // Fix autoplay
            if (params.autoplay) {
                if (_this.support.transitions && typeof autoplayTimeoutId !== 'undefined') {
                    if (typeof autoplayTimeoutId !== 'undefined') {
                        clearTimeout(autoplayTimeoutId);
                        autoplayTimeoutId = undefined;
                        _this.startAutoplay();
                    }
                }
                else {
                    if (typeof autoplayIntervalId !== 'undefined') {
                        clearInterval(autoplayIntervalId);
                        autoplayIntervalId = undefined;
                        _this.startAutoplay();
                    }
                }
            }
        }
        // move wrapper to the beginning in free mode
        else if (_this.getWrapperTranslate() < -maxWrapperPosition()) {
            _this.setWrapperTransition(0);
            _this.setWrapperTranslate(-maxWrapperPosition());
        }

        _this.callPlugins('afterResizeFix');
    };

    /*==========================================
        Max and Min Positions
    ============================================*/
    function maxWrapperPosition() {
        var a = (wrapperSize - containerSize);
        if (params.freeMode) {
            a = wrapperSize - containerSize;
        }
        // if (params.loop) a -= containerSize;
        if (params.slidesPerView > _this.slides.length && !params.centeredSlides) {
            a = 0;
        }
        if (a < 0) a = 0;
        return a;
    }

    /*==========================================
        Event Listeners
    ============================================*/
    function initEvents() {
        var bind = _this.h.addEventListener;
        var eventTarget = params.eventTarget === 'wrapper' ? _this.wrapper : _this.container;
        //Touch Events
        if (! (_this.browser.ie10 || _this.browser.ie11)) {
            if (_this.support.touch) {
                bind(eventTarget, 'touchstart', onTouchStart);
                bind(eventTarget, 'touchmove', onTouchMove);
                bind(eventTarget, 'touchend', onTouchEnd);
            }
            if (params.simulateTouch) {
                bind(eventTarget, 'mousedown', onTouchStart);
                bind(document, 'mousemove', onTouchMove);
                bind(document, 'mouseup', onTouchEnd);
            }
        }
        else {
            bind(eventTarget, _this.touchEvents.touchStart, onTouchStart);
            bind(document, _this.touchEvents.touchMove, onTouchMove);
            bind(document, _this.touchEvents.touchEnd, onTouchEnd);
        }

        //Resize Event
        if (params.autoResize) {
            bind(window, 'resize', _this.resizeFix);
        }
        //Slide Events
        addSlideEvents();
        //Mousewheel
        _this._wheelEvent = false;
        if (params.mousewheelControl) {
            if (document.onmousewheel !== undefined) {
                _this._wheelEvent = 'mousewheel';
            }
            if (!_this._wheelEvent) {
                try {
                    new WheelEvent('wheel');
                    _this._wheelEvent = 'wheel';
                } catch (e) {}
            }
            if (!_this._wheelEvent) {
                _this._wheelEvent = 'DOMMouseScroll';
            }
            if (_this._wheelEvent) {
                bind(_this.container, _this._wheelEvent, handleMousewheel);
            }
        }

        //Keyboard
        function _loadImage(src) {
            var image = new Image();
            image.onload = function () {
                if (_this && _this.imagesLoaded !== undefined) _this.imagesLoaded++;
                if (_this.imagesLoaded === _this.imagesToLoad.length) {
                    _this.reInit();
                    if (params.onImagesReady) _this.fireCallback(params.onImagesReady, _this);
                }
            };
            image.src = src;
        }

        if (params.keyboardControl) {
            bind(document, 'keydown', handleKeyboardKeys);
        }
        if (params.updateOnImagesReady) {
            _this.imagesToLoad = $$('img', _this.container);

            for (var i = 0; i < _this.imagesToLoad.length; i++) {
                _loadImage(_this.imagesToLoad[i].getAttribute('src'));
            }
        }
    }

    //Remove Event Listeners
    _this.destroy = function () {
        var unbind = _this.h.removeEventListener;
        var eventTarget = params.eventTarget === 'wrapper' ? _this.wrapper : _this.container;
        //Touch Events
        if (! (_this.browser.ie10 || _this.browser.ie11)) {
            if (_this.support.touch) {
                unbind(eventTarget, 'touchstart', onTouchStart);
                unbind(eventTarget, 'touchmove', onTouchMove);
                unbind(eventTarget, 'touchend', onTouchEnd);
            }
            if (params.simulateTouch) {
                unbind(eventTarget, 'mousedown', onTouchStart);
                unbind(document, 'mousemove', onTouchMove);
                unbind(document, 'mouseup', onTouchEnd);
            }
        }
        else {
            unbind(eventTarget, _this.touchEvents.touchStart, onTouchStart);
            unbind(document, _this.touchEvents.touchMove, onTouchMove);
            unbind(document, _this.touchEvents.touchEnd, onTouchEnd);
        }

        //Resize Event
        if (params.autoResize) {
            unbind(window, 'resize', _this.resizeFix);
        }

        //Init Slide Events
        removeSlideEvents();

        //Pagination
        if (params.paginationClickable) {
            removePaginationEvents();
        }

        //Mousewheel
        if (params.mousewheelControl && _this._wheelEvent) {
            unbind(_this.container, _this._wheelEvent, handleMousewheel);
        }

        //Keyboard
        if (params.keyboardControl) {
            unbind(document, 'keydown', handleKeyboardKeys);
        }

        //Stop autoplay
        if (params.autoplay) {
            _this.stopAutoplay();
        }
        _this.callPlugins('onDestroy');

        //Destroy variable
        _this = null;
    };

    function addSlideEvents() {
        var bind = _this.h.addEventListener,
            i;

        //Prevent Links Events
        if (params.preventLinks) {
            var links = $$('a', _this.container);
            for (i = 0; i < links.length; i++) {
                bind(links[i], 'click', preventClick);
            }
        }
        //Release Form Elements
        if (params.releaseFormElements) {
            var formElements = $$('input, textarea, select', _this.container);
            for (i = 0; i < formElements.length; i++) {
                bind(formElements[i], _this.touchEvents.touchStart, releaseForms, true);
            }
        }

        //Slide Clicks & Touches
        if (params.onSlideClick) {
            for (i = 0; i < _this.slides.length; i++) {
                bind(_this.slides[i], 'click', slideClick);
            }
        }
        if (params.onSlideTouch) {
            for (i = 0; i < _this.slides.length; i++) {
                bind(_this.slides[i], _this.touchEvents.touchStart, slideTouch);
            }
        }
    }
    function removeSlideEvents() {
        var unbind = _this.h.removeEventListener,
            i;

        //Slide Clicks & Touches
        if (params.onSlideClick) {
            for (i = 0; i < _this.slides.length; i++) {
                unbind(_this.slides[i], 'click', slideClick);
            }
        }
        if (params.onSlideTouch) {
            for (i = 0; i < _this.slides.length; i++) {
                unbind(_this.slides[i], _this.touchEvents.touchStart, slideTouch);
            }
        }
        //Release Form Elements
        if (params.releaseFormElements) {
            var formElements = $$('input, textarea, select', _this.container);
            for (i = 0; i < formElements.length; i++) {
                unbind(formElements[i], _this.touchEvents.touchStart, releaseForms, true);
            }
        }
        //Prevent Links Events
        if (params.preventLinks) {
            var links = $$('a', _this.container);
            for (i = 0; i < links.length; i++) {
                unbind(links[i], 'click', preventClick);
            }
        }
    }
    /*==========================================
        Keyboard Control
    ============================================*/
    function handleKeyboardKeys(e) {
        var kc = e.keyCode || e.charCode;
        if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) return;
        if (kc === 37 || kc === 39 || kc === 38 || kc === 40) {
            var inView = false;
            //Check that swiper should be inside of visible area of window
            var swiperOffset = _this.h.getOffset(_this.container);
            var scrollLeft = _this.h.windowScroll().left;
            var scrollTop = _this.h.windowScroll().top;
            var windowWidth = _this.h.windowWidth();
            var windowHeight = _this.h.windowHeight();
            var swiperCoord = [
                [swiperOffset.left, swiperOffset.top],
                [swiperOffset.left + _this.width, swiperOffset.top],
                [swiperOffset.left, swiperOffset.top + _this.height],
                [swiperOffset.left + _this.width, swiperOffset.top + _this.height]
            ];
            for (var i = 0; i < swiperCoord.length; i++) {
                var point = swiperCoord[i];
                if (
                    point[0] >= scrollLeft && point[0] <= scrollLeft + windowWidth &&
                    point[1] >= scrollTop && point[1] <= scrollTop + windowHeight
                ) {
                    inView = true;
                }

            }
            if (!inView) return;
        }
        if (isH) {
            if (kc === 37 || kc === 39) {
                if (e.preventDefault) e.preventDefault();
                else e.returnValue = false;
            }
            if (kc === 39) _this.swipeNext();
            if (kc === 37) _this.swipePrev();
        }
        else {
            if (kc === 38 || kc === 40) {
                if (e.preventDefault) e.preventDefault();
                else e.returnValue = false;
            }
            if (kc === 40) _this.swipeNext();
            if (kc === 38) _this.swipePrev();
        }
    }

    _this.disableKeyboardControl = function () {
        params.keyboardControl = false;
        _this.h.removeEventListener(document, 'keydown', handleKeyboardKeys);
    };

    _this.enableKeyboardControl = function () {
        params.keyboardControl = true;
        _this.h.addEventListener(document, 'keydown', handleKeyboardKeys);
    };

    /*==========================================
        Mousewheel Control
    ============================================*/
    var lastScrollTime = (new Date()).getTime();
    function handleMousewheel(e) {
        var we = _this._wheelEvent;
        var delta = 0;

        //Opera & IE
        if (e.detail) delta = -e.detail;
        //WebKits
        else if (we === 'mousewheel') {
            if (params.mousewheelControlForceToAxis) {
                if (isH) {
                    if (Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY)) delta = e.wheelDeltaX;
                    else return;
                }
                else {
                    if (Math.abs(e.wheelDeltaY) > Math.abs(e.wheelDeltaX)) delta = e.wheelDeltaY;
                    else return;
                }
            }
            else {
                delta = e.wheelDelta;
            }
        }
        //Old FireFox
        else if (we === 'DOMMouseScroll') delta = -e.detail;
        //New FireFox
        else if (we === 'wheel') {
            if (params.mousewheelControlForceToAxis) {
                if (isH) {
                    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) delta = -e.deltaX;
                    else return;
                }
                else {
                    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) delta = -e.deltaY;
                    else return;
                }
            }
            else {
                delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? - e.deltaX : - e.deltaY;
            }
        }

        if (!params.freeMode) {
            if ((new Date()).getTime() - lastScrollTime > 60) {
                if (delta < 0) _this.swipeNext();
                else _this.swipePrev();
            }
            lastScrollTime = (new Date()).getTime();

        }
        else {
            //Freemode or scrollContainer:
            var position = _this.getWrapperTranslate() + delta;

            if (position > 0) position = 0;
            if (position < -maxWrapperPosition()) position = -maxWrapperPosition();

            _this.setWrapperTransition(0);
            _this.setWrapperTranslate(position);
            _this.updateActiveSlide(position);

            // Return page scroll on edge positions
            if (position === 0 || position === -maxWrapperPosition()) return;
        }
        if (params.autoplay) _this.stopAutoplay(true);

        if (e.preventDefault) e.preventDefault();
        else e.returnValue = false;
        return false;
    }
    _this.disableMousewheelControl = function () {
        if (!_this._wheelEvent) return false;
        params.mousewheelControl = false;
        _this.h.removeEventListener(_this.container, _this._wheelEvent, handleMousewheel);
        return true;
    };

    _this.enableMousewheelControl = function () {
        if (!_this._wheelEvent) return false;
        params.mousewheelControl = true;
        _this.h.addEventListener(_this.container, _this._wheelEvent, handleMousewheel);
        return true;
    };

    /*=========================
      Grab Cursor
      ===========================*/
    if (params.grabCursor) {
        var containerStyle = _this.container.style;
        containerStyle.cursor = 'move';
        containerStyle.cursor = 'grab';
        containerStyle.cursor = '-moz-grab';
        containerStyle.cursor = '-webkit-grab';
    }

    /*=========================
      Slides Events Handlers
      ===========================*/

    _this.allowSlideClick = true;
    function slideClick(event) {
        if (_this.allowSlideClick) {
            setClickedSlide(event);
            _this.fireCallback(params.onSlideClick, _this, event);
        }
    }

    function slideTouch(event) {
        setClickedSlide(event);
        _this.fireCallback(params.onSlideTouch, _this, event);
    }

    function setClickedSlide(event) {

        // IE 6-8 support
        if (!event.currentTarget) {
            var element = event.srcElement;
            do {
                if (element.className.indexOf(params.slideClass) > -1) {
                    break;
                }
                element = element.parentNode;
            } while (element);
            _this.clickedSlide = element;
        }
        else {
            _this.clickedSlide = event.currentTarget;
        }

        _this.clickedSlideIndex     = _this.slides.indexOf(_this.clickedSlide);
        _this.clickedSlideLoopIndex = _this.clickedSlideIndex - (_this.loopedSlides || 0);
    }

    _this.allowLinks = true;
    function preventClick(e) {
        if (!_this.allowLinks) {
            if (e.preventDefault) e.preventDefault();
            else e.returnValue = false;
            if (params.preventLinksPropagation && 'stopPropagation' in e) {
                e.stopPropagation();
            }
            return false;
        }
    }
    function releaseForms(e) {
        if (e.stopPropagation) e.stopPropagation();
        else e.returnValue = false;
        return false;

    }

    /*==================================================
        Event Handlers
    ====================================================*/
    var isTouchEvent = false;
    var allowThresholdMove;
    var allowMomentumBounce = true;
    function onTouchStart(event) {
        if (params.preventLinks) _this.allowLinks = true;
        //Exit if slider is already was touched
        if (_this.isTouched || params.onlyExternal) {
            return false;
        }

        if (params.noSwiping && (event.target || event.srcElement) && noSwipingSlide(event.target || event.srcElement)) return false;
        allowMomentumBounce = false;
        //Check For Nested Swipers
        _this.isTouched = true;
        isTouchEvent = event.type === 'touchstart';

        if (!isTouchEvent || event.targetTouches.length === 1) {
            _this.callPlugins('onTouchStartBegin');

            if (!isTouchEvent && !_this.isAndroid) {
                if (event.preventDefault) event.preventDefault();
                else event.returnValue = false;
            }

            var pageX = isTouchEvent ? event.targetTouches[0].pageX : (event.pageX || event.clientX);
            var pageY = isTouchEvent ? event.targetTouches[0].pageY : (event.pageY || event.clientY);

            //Start Touches to check the scrolling
            _this.touches.startX = _this.touches.currentX = pageX;
            _this.touches.startY = _this.touches.currentY = pageY;

            _this.touches.start = _this.touches.current = isH ? pageX : pageY;

            //Set Transition Time to 0
            _this.setWrapperTransition(0);

            //Get Start Translate Position
            _this.positions.start = _this.positions.current = _this.getWrapperTranslate();

            //Set Transform
            _this.setWrapperTranslate(_this.positions.start);

            //TouchStartTime
            _this.times.start = (new Date()).getTime();

            //Unset Scrolling
            isScrolling = undefined;

            //Set Treshold
            if (params.moveStartThreshold > 0) {
                allowThresholdMove = false;
            }

            //CallBack
            if (params.onTouchStart) _this.fireCallback(params.onTouchStart, _this, event);
            _this.callPlugins('onTouchStartEnd');

        }
    }
    var velocityPrevPosition, velocityPrevTime;
    function onTouchMove(event) {
        // If slider is not touched - exit
        if (!_this.isTouched || params.onlyExternal) return;
        if (isTouchEvent && event.type === 'mousemove') return;

        var pageX = isTouchEvent ? event.targetTouches[0].pageX : (event.pageX || event.clientX);
        var pageY = isTouchEvent ? event.targetTouches[0].pageY : (event.pageY || event.clientY);

        //check for scrolling
        if (typeof isScrolling === 'undefined' && isH) {
            isScrolling = !!(isScrolling || Math.abs(pageY - _this.touches.startY) > Math.abs(pageX - _this.touches.startX));
        }
        if (typeof isScrolling === 'undefined' && !isH) {
            isScrolling = !!(isScrolling || Math.abs(pageY - _this.touches.startY) < Math.abs(pageX - _this.touches.startX));
        }
        if (isScrolling) {
            _this.isTouched = false;
            return;
        }

        //Check For Nested Swipers
        if (event.assignedToSwiper) {
            _this.isTouched = false;
            return;
        }
        event.assignedToSwiper = true;

        //Block inner links
        if (params.preventLinks) {
            _this.allowLinks = false;
        }
        if (params.onSlideClick) {
            _this.allowSlideClick = false;
        }

        //Stop AutoPlay if exist
        if (params.autoplay) {
            _this.stopAutoplay(true);
        }
        if (!isTouchEvent || event.touches.length === 1) {

            //Moved Flag
            if (!_this.isMoved) {
                _this.callPlugins('onTouchMoveStart');

                if (params.loop) {
                    _this.fixLoop();
                    _this.positions.start = _this.getWrapperTranslate();
                }
                if (params.onTouchMoveStart) _this.fireCallback(params.onTouchMoveStart, _this);
            }
            _this.isMoved = true;

            // cancel event
            if (event.preventDefault) event.preventDefault();
            else event.returnValue = false;

            _this.touches.current = isH ? pageX : pageY;

            _this.positions.current = (_this.touches.current - _this.touches.start) * params.touchRatio + _this.positions.start;

            //Resistance Callbacks
            if (_this.positions.current > 0 && params.onResistanceBefore) {
                _this.fireCallback(params.onResistanceBefore, _this, _this.positions.current);
            }
            if (_this.positions.current < -maxWrapperPosition() && params.onResistanceAfter) {
                _this.fireCallback(params.onResistanceAfter, _this, Math.abs(_this.positions.current + maxWrapperPosition()));
            }
            //Resistance
            if (params.resistance && params.resistance !== '100%') {
                var resistance;
                //Resistance for Negative-Back sliding
                if (_this.positions.current > 0) {
                    resistance = 1 - _this.positions.current / containerSize / 2;
                    if (resistance < 0.5)
                        _this.positions.current = (containerSize / 2);
                    else
                        _this.positions.current = _this.positions.current * resistance;
                }
                //Resistance for After-End Sliding
                if (_this.positions.current < -maxWrapperPosition()) {

                    var diff = (_this.touches.current - _this.touches.start) * params.touchRatio + (maxWrapperPosition() + _this.positions.start);
                    resistance = (containerSize + diff) / (containerSize);
                    var newPos = _this.positions.current - diff * (1 - resistance) / 2;
                    var stopPos = -maxWrapperPosition() - containerSize / 2;

                    if (newPos < stopPos || resistance <= 0)
                        _this.positions.current = stopPos;
                    else
                        _this.positions.current = newPos;
                }
            }
            if (params.resistance && params.resistance === '100%') {
                //Resistance for Negative-Back sliding
                if (_this.positions.current > 0 && !(params.freeMode && !params.freeModeFluid)) {
                    _this.positions.current = 0;
                }
                //Resistance for After-End Sliding
                if (_this.positions.current < -maxWrapperPosition() && !(params.freeMode && !params.freeModeFluid)) {
                    _this.positions.current = -maxWrapperPosition();
                }
            }
            //Move Slides
            if (!params.followFinger) return;

            if (!params.moveStartThreshold) {
                _this.setWrapperTranslate(_this.positions.current);
            }
            else {
                if (Math.abs(_this.touches.current - _this.touches.start) > params.moveStartThreshold || allowThresholdMove) {
                    if (!allowThresholdMove) {
                        allowThresholdMove = true;
                        _this.touches.start = _this.touches.current;
                        return;
                    }
                    _this.setWrapperTranslate(_this.positions.current);
                }
                else {
                    _this.positions.current = _this.positions.start;
                }
            }

            if (params.freeMode || params.watchActiveIndex) {
                _this.updateActiveSlide(_this.positions.current);
            }

            //Grab Cursor
            if (params.grabCursor) {
                _this.container.style.cursor = 'move';
                _this.container.style.cursor = 'grabbing';
                _this.container.style.cursor = '-moz-grabbin';
                _this.container.style.cursor = '-webkit-grabbing';
            }
            //Velocity
            if (!velocityPrevPosition) velocityPrevPosition = _this.touches.current;
            if (!velocityPrevTime) velocityPrevTime = (new Date()).getTime();
            _this.velocity = (_this.touches.current - velocityPrevPosition) / ((new Date()).getTime() - velocityPrevTime) / 2;
            if (Math.abs(_this.touches.current - velocityPrevPosition) < 2) _this.velocity = 0;
            velocityPrevPosition = _this.touches.current;
            velocityPrevTime = (new Date()).getTime();
            //Callbacks
            _this.callPlugins('onTouchMoveEnd');
            if (params.onTouchMove) _this.fireCallback(params.onTouchMove, _this, event);

            return false;
        }
    }
    function onTouchEnd(event) {
        //Check For scrolling
        if (isScrolling) {
            _this.swipeReset();
        }
        // If slider is not touched exit
        if (params.onlyExternal || !_this.isTouched) return;
        _this.isTouched = false;

        //Return Grab Cursor
        if (params.grabCursor) {
            _this.container.style.cursor = 'move';
            _this.container.style.cursor = 'grab';
            _this.container.style.cursor = '-moz-grab';
            _this.container.style.cursor = '-webkit-grab';
        }

        //Check for Current Position
        if (!_this.positions.current && _this.positions.current !== 0) {
            _this.positions.current = _this.positions.start;
        }

        //For case if slider touched but not moved
        if (params.followFinger) {
            _this.setWrapperTranslate(_this.positions.current);
        }

        // TouchEndTime
        _this.times.end = (new Date()).getTime();

        //Difference
        _this.touches.diff = _this.touches.current - _this.touches.start;
        _this.touches.abs = Math.abs(_this.touches.diff);

        _this.positions.diff = _this.positions.current - _this.positions.start;
        _this.positions.abs = Math.abs(_this.positions.diff);

        var diff = _this.positions.diff;
        var diffAbs = _this.positions.abs;
        var timeDiff = _this.times.end - _this.times.start;

        if (diffAbs < 5 && (timeDiff) < 300 && _this.allowLinks === false) {
            if (!params.freeMode && diffAbs !== 0) _this.swipeReset();
            //Release inner links
            if (params.preventLinks) {
                _this.allowLinks = true;
            }
            if (params.onSlideClick) {
                _this.allowSlideClick = true;
            }
        }

        setTimeout(function () {
            //Release inner links
            if (params.preventLinks) {
                _this.allowLinks = true;
            }
            if (params.onSlideClick) {
                _this.allowSlideClick = true;
            }
        }, 100);

        var maxPosition = maxWrapperPosition();

        //Not moved or Prevent Negative Back Sliding/After-End Sliding
        if (!_this.isMoved && params.freeMode) {
            _this.isMoved = false;
            if (params.onTouchEnd) _this.fireCallback(params.onTouchEnd, _this, event);
            _this.callPlugins('onTouchEnd');
            return;
        }
        if (!_this.isMoved || _this.positions.current > 0 || _this.positions.current < -maxPosition) {
            _this.swipeReset();
            if (params.onTouchEnd) _this.fireCallback(params.onTouchEnd, _this, event);
            _this.callPlugins('onTouchEnd');
            return;
        }

        _this.isMoved = false;

        //Free Mode
        if (params.freeMode) {
            if (params.freeModeFluid) {
                var momentumDuration = 1000 * params.momentumRatio;
                var momentumDistance = _this.velocity * momentumDuration;
                var newPosition = _this.positions.current + momentumDistance;
                var doBounce = false;
                var afterBouncePosition;
                var bounceAmount = Math.abs(_this.velocity) * 20 * params.momentumBounceRatio;
                if (newPosition < -maxPosition) {
                    if (params.momentumBounce && _this.support.transitions) {
                        if (newPosition + maxPosition < -bounceAmount) newPosition = -maxPosition - bounceAmount;
                        afterBouncePosition = -maxPosition;
                        doBounce = true;
                        allowMomentumBounce = true;
                    }
                    else newPosition = -maxPosition;
                }
                if (newPosition > 0) {
                    if (params.momentumBounce && _this.support.transitions) {
                        if (newPosition > bounceAmount) newPosition = bounceAmount;
                        afterBouncePosition = 0;
                        doBounce = true;
                        allowMomentumBounce = true;
                    }
                    else newPosition = 0;
                }
                //Fix duration
                if (_this.velocity !== 0) momentumDuration = Math.abs((newPosition - _this.positions.current) / _this.velocity);

                _this.setWrapperTranslate(newPosition);

                _this.setWrapperTransition(momentumDuration);

                if (params.momentumBounce && doBounce) {
                    _this.wrapperTransitionEnd(function () {
                        if (!allowMomentumBounce) return;
                        if (params.onMomentumBounce) _this.fireCallback(params.onMomentumBounce, _this);
                        _this.callPlugins('onMomentumBounce');

                        _this.setWrapperTranslate(afterBouncePosition);
                        _this.setWrapperTransition(300);
                    });
                }

                _this.updateActiveSlide(newPosition);
            }
            if (!params.freeModeFluid || timeDiff >= 300) _this.updateActiveSlide(_this.positions.current);

            if (params.onTouchEnd) _this.fireCallback(params.onTouchEnd, _this, event);
            _this.callPlugins('onTouchEnd');
            return;
        }

        //Direction
        direction = diff < 0 ? 'toNext' : 'toPrev';

        //Short Touches
        if (direction === 'toNext' && (timeDiff <= 300)) {
            if (diffAbs < 30 || !params.shortSwipes) _this.swipeReset();
            else _this.swipeNext(true);
        }

        if (direction === 'toPrev' && (timeDiff <= 300)) {
            if (diffAbs < 30 || !params.shortSwipes) _this.swipeReset();
            else _this.swipePrev(true);
        }

        //Long Touches
        var targetSlideSize = 0;
        if (params.slidesPerView === 'auto') {
            //Define current slide's width
            var currentPosition = Math.abs(_this.getWrapperTranslate());
            var slidesOffset = 0;
            var _slideSize;
            for (var i = 0; i < _this.slides.length; i++) {
                _slideSize = isH ? _this.slides[i].getWidth(true, params.roundLengths) : _this.slides[i].getHeight(true, params.roundLengths);
                slidesOffset += _slideSize;
                if (slidesOffset > currentPosition) {
                    targetSlideSize = _slideSize;
                    break;
                }
            }
            if (targetSlideSize > containerSize) targetSlideSize = containerSize;
        }
        else {
            targetSlideSize = slideSize * params.slidesPerView;
        }
        if (direction === 'toNext' && (timeDiff > 300)) {
            if (diffAbs >= targetSlideSize * params.longSwipesRatio) {
                _this.swipeNext(true);
            }
            else {
                _this.swipeReset();
            }
        }
        if (direction === 'toPrev' && (timeDiff > 300)) {
            if (diffAbs >= targetSlideSize * params.longSwipesRatio) {
                _this.swipePrev(true);
            }
            else {
                _this.swipeReset();
            }
        }
        if (params.onTouchEnd) _this.fireCallback(params.onTouchEnd, _this, event);
        _this.callPlugins('onTouchEnd');
    }


    /*==================================================
        noSwiping Bubble Check by Isaac Strack
    ====================================================*/
    function noSwipingSlide(el) {
        /*This function is specifically designed to check the parent elements for the noSwiping class, up to the wrapper.
        We need to check parents because while onTouchStart bubbles, _this.isTouched is checked in onTouchStart, which stops the bubbling.
        So, if a text box, for example, is the initial target, and the parent slide container has the noSwiping class, the _this.isTouched
        check will never find it, and what was supposed to be noSwiping is able to be swiped.
        This function will iterate up and check for the noSwiping class in parents, up through the wrapperClass.*/

        // First we create a truthy variable, which is that swiping is allowd (noSwiping = false)
        var noSwiping = false;

        // Now we iterate up (parentElements) until we reach the node with the wrapperClass.
        do {

            // Each time, we check to see if there's a 'swiper-no-swiping' class (noSwipingClass).
            if (el.className.indexOf(params.noSwipingClass) > -1)
            {
                noSwiping = true; // If there is, we set noSwiping = true;
            }

            el = el.parentElement;  // now we iterate up (parent node)

        } while (!noSwiping && el.parentElement && el.className.indexOf(params.wrapperClass) === -1); // also include el.parentElement truthy, just in case.

        // because we didn't check the wrapper itself, we do so now, if noSwiping is false:
        if (!noSwiping && el.className.indexOf(params.wrapperClass) > -1 && el.className.indexOf(params.noSwipingClass) > -1)
            noSwiping = true; // if the wrapper has the noSwipingClass, we set noSwiping = true;

        return noSwiping;
    }

    function addClassToHtmlString(klass, outerHtml) {
        var par = document.createElement('div');
        var child;

        par.innerHTML = outerHtml;
        child = par.firstChild;
        child.className += ' ' + klass;

        return child.outerHTML;
    }


    /*==================================================
        Swipe Functions
    ====================================================*/
    _this.swipeNext = function (internal) {
        if (!internal && params.loop) _this.fixLoop();
        if (!internal && params.autoplay) _this.stopAutoplay(true);
        _this.callPlugins('onSwipeNext');
        var currentPosition = _this.getWrapperTranslate();
        var newPosition = currentPosition;
        if (params.slidesPerView === 'auto') {
            for (var i = 0; i < _this.snapGrid.length; i++) {
                if (-currentPosition >= _this.snapGrid[i] && -currentPosition < _this.snapGrid[i + 1]) {
                    newPosition = -_this.snapGrid[i + 1];
                    break;
                }
            }
        }
        else {
            var groupSize = slideSize * params.slidesPerGroup;
            newPosition = -(Math.floor(Math.abs(currentPosition) / Math.floor(groupSize)) * groupSize + groupSize);
        }
        if (newPosition < -maxWrapperPosition()) {
            newPosition = -maxWrapperPosition();
        }
        if (newPosition === currentPosition) return false;
        swipeToPosition(newPosition, 'next');
        return true;
    };
    _this.swipePrev = function (internal) {
        if (!internal && params.loop) _this.fixLoop();
        if (!internal && params.autoplay) _this.stopAutoplay(true);
        _this.callPlugins('onSwipePrev');

        var currentPosition = Math.ceil(_this.getWrapperTranslate());
        var newPosition;
        if (params.slidesPerView === 'auto') {
            newPosition = 0;
            for (var i = 1; i < _this.snapGrid.length; i++) {
                if (-currentPosition === _this.snapGrid[i]) {
                    newPosition = -_this.snapGrid[i - 1];
                    break;
                }
                if (-currentPosition > _this.snapGrid[i] && -currentPosition < _this.snapGrid[i + 1]) {
                    newPosition = -_this.snapGrid[i];
                    break;
                }
            }
        }
        else {
            var groupSize = slideSize * params.slidesPerGroup;
            newPosition = -(Math.ceil(-currentPosition / groupSize) - 1) * groupSize;
        }

        if (newPosition > 0) newPosition = 0;

        if (newPosition === currentPosition) return false;
        swipeToPosition(newPosition, 'prev');
        return true;

    };
    _this.swipeReset = function () {
        _this.callPlugins('onSwipeReset');
        var currentPosition = _this.getWrapperTranslate();
        var groupSize = slideSize * params.slidesPerGroup;
        var newPosition;
        var maxPosition = -maxWrapperPosition();
        if (params.slidesPerView === 'auto') {
            newPosition = 0;
            for (var i = 0; i < _this.snapGrid.length; i++) {
                if (-currentPosition === _this.snapGrid[i]) return;
                if (-currentPosition >= _this.snapGrid[i] && -currentPosition < _this.snapGrid[i + 1]) {
                    if (_this.positions.diff > 0) newPosition = -_this.snapGrid[i + 1];
                    else newPosition = -_this.snapGrid[i];
                    break;
                }
            }
            if (-currentPosition >= _this.snapGrid[_this.snapGrid.length - 1]) newPosition = -_this.snapGrid[_this.snapGrid.length - 1];
            if (currentPosition <= -maxWrapperPosition()) newPosition = -maxWrapperPosition();
        }
        else {
            newPosition = currentPosition < 0 ? Math.round(currentPosition / groupSize) * groupSize : 0;
        }
        if (params.scrollContainer)  {
            newPosition = currentPosition < 0 ? currentPosition : 0;
        }
        if (newPosition < -maxWrapperPosition()) {
            newPosition = -maxWrapperPosition();
        }
        if (params.scrollContainer && (containerSize > slideSize)) {
            newPosition = 0;
        }

        if (newPosition === currentPosition) return false;

        swipeToPosition(newPosition, 'reset');
        return true;
    };

    _this.swipeTo = function (index, speed, runCallbacks) {
        index = parseInt(index, 10);
        _this.callPlugins('onSwipeTo', {index: index, speed: speed});
        if (params.loop) index = index + _this.loopedSlides;
        var currentPosition = _this.getWrapperTranslate();
        if (index > (_this.slides.length - 1) || index < 0) return;
        var newPosition;
        if (params.slidesPerView === 'auto') {
            newPosition = -_this.slidesGrid[index];
        }
        else {
            newPosition = -index * slideSize;
        }
        if (newPosition < - maxWrapperPosition()) {
            newPosition = - maxWrapperPosition();
        }

        if (newPosition === currentPosition) return false;

        runCallbacks = runCallbacks === false ? false : true;
        swipeToPosition(newPosition, 'to', {index: index, speed: speed, runCallbacks: runCallbacks});
        return true;
    };

    function swipeToPosition(newPosition, action, toOptions) {
        var speed = (action === 'to' && toOptions.speed >= 0) ? toOptions.speed : params.speed;
        var timeOld = + new Date();

        function anim() {
            var timeNew = + new Date();
            var time = timeNew - timeOld;
            currentPosition += animationStep * time / (1000 / 60);
            condition = direction === 'toNext' ? currentPosition > newPosition : currentPosition < newPosition;
            if (condition) {
                _this.setWrapperTranslate(Math.round(currentPosition));
                _this._DOMAnimating = true;
                window.setTimeout(function () {
                    anim();
                }, 1000 / 60);
            }
            else {
                if (params.onSlideChangeEnd) {
                    if (action === 'to') {
                        if (toOptions.runCallbacks === true) _this.fireCallback(params.onSlideChangeEnd, _this);
                    }
                    else {
                        _this.fireCallback(params.onSlideChangeEnd, _this);
                    }
                    
                }
                _this.setWrapperTranslate(newPosition);
                _this._DOMAnimating = false;
            }
        }

        if (_this.support.transitions || !params.DOMAnimation) {
            _this.setWrapperTranslate(newPosition);
            _this.setWrapperTransition(speed);
        }
        else {
            //Try the DOM animation
            var currentPosition = _this.getWrapperTranslate();
            var animationStep = Math.ceil((newPosition - currentPosition) / speed * (1000 / 60));
            var direction = currentPosition > newPosition ? 'toNext' : 'toPrev';
            var condition = direction === 'toNext' ? currentPosition > newPosition : currentPosition < newPosition;
            if (_this._DOMAnimating) return;

            anim();
        }

        //Update Active Slide Index
        _this.updateActiveSlide(newPosition);

        //Callbacks
        if (params.onSlideNext && action === 'next') {
            _this.fireCallback(params.onSlideNext, _this, newPosition);
        }
        if (params.onSlidePrev && action === 'prev') {
            _this.fireCallback(params.onSlidePrev, _this, newPosition);
        }
        //'Reset' Callback
        if (params.onSlideReset && action === 'reset') {
            _this.fireCallback(params.onSlideReset, _this, newPosition);
        }

        //'Next', 'Prev' and 'To' Callbacks
        if (action === 'next' || action === 'prev' || (action === 'to' && toOptions.runCallbacks === true))
            slideChangeCallbacks(action);
    }
    /*==================================================
        Transition Callbacks
    ====================================================*/
    //Prevent Multiple Callbacks
    _this._queueStartCallbacks = false;
    _this._queueEndCallbacks = false;
    function slideChangeCallbacks(direction) {
        //Transition Start Callback
        _this.callPlugins('onSlideChangeStart');
        if (params.onSlideChangeStart) {
            if (params.queueStartCallbacks && _this.support.transitions) {
                if (_this._queueStartCallbacks) return;
                _this._queueStartCallbacks = true;
                _this.fireCallback(params.onSlideChangeStart, _this, direction);
                _this.wrapperTransitionEnd(function () {
                    _this._queueStartCallbacks = false;
                });
            }
            else _this.fireCallback(params.onSlideChangeStart, _this, direction);
        }
        //Transition End Callback
        if (params.onSlideChangeEnd) {
            if (_this.support.transitions) {
                if (params.queueEndCallbacks) {
                    if (_this._queueEndCallbacks) return;
                    _this._queueEndCallbacks = true;
                    _this.wrapperTransitionEnd(function (swiper) {
                        _this.fireCallback(params.onSlideChangeEnd, swiper, direction);
                    });
                }
                else {
                    _this.wrapperTransitionEnd(function (swiper) {
                        _this.fireCallback(params.onSlideChangeEnd, swiper, direction);
                    });
                }
            }
            else {
                if (!params.DOMAnimation) {
                    setTimeout(function () {
                        _this.fireCallback(params.onSlideChangeEnd, _this, direction);
                    }, 10);
                }
            }
        }
    }

    /*==================================================
        Update Active Slide Index
    ====================================================*/
    _this.updateActiveSlide = function (position) {
        if (!_this.initialized) return;
        if (_this.slides.length === 0) return;
        _this.previousIndex = _this.activeIndex;
        if (typeof position === 'undefined') position = _this.getWrapperTranslate();
        if (position > 0) position = 0;
        var i;
        if (params.slidesPerView === 'auto') {
            var slidesOffset = 0;
            _this.activeIndex = _this.slidesGrid.indexOf(-position);
            if (_this.activeIndex < 0) {
                for (i = 0; i < _this.slidesGrid.length - 1; i++) {
                    if (-position > _this.slidesGrid[i] && -position < _this.slidesGrid[i + 1]) {
                        break;
                    }
                }
                var leftDistance = Math.abs(_this.slidesGrid[i] + position);
                var rightDistance = Math.abs(_this.slidesGrid[i + 1] + position);
                if (leftDistance <= rightDistance) _this.activeIndex = i;
                else _this.activeIndex = i + 1;
            }
        }
        else {
            _this.activeIndex = Math[params.visibilityFullFit ? 'ceil' : 'round'](-position / slideSize);
        }

        if (_this.activeIndex === _this.slides.length) _this.activeIndex = _this.slides.length - 1;
        if (_this.activeIndex < 0) _this.activeIndex = 0;

        // Check for slide
        if (!_this.slides[_this.activeIndex]) return;

        // Calc Visible slides
        _this.calcVisibleSlides(position);

        // Mark visible and active slides with additonal classes
        if (_this.support.classList) {
            var slide;
            for (i = 0; i < _this.slides.length; i++) {
                slide = _this.slides[i];
                slide.classList.remove(params.slideActiveClass);
                if (_this.visibleSlides.indexOf(slide) >= 0) {
                    slide.classList.add(params.slideVisibleClass);
                } else {
                    slide.classList.remove(params.slideVisibleClass);
                }
            }
            _this.slides[_this.activeIndex].classList.add(params.slideActiveClass);
        } else {
            var activeClassRegexp = new RegExp('\\s*' + params.slideActiveClass);
            var inViewClassRegexp = new RegExp('\\s*' + params.slideVisibleClass);

            for (i = 0; i < _this.slides.length; i++) {
                _this.slides[i].className = _this.slides[i].className.replace(activeClassRegexp, '').replace(inViewClassRegexp, '');
                if (_this.visibleSlides.indexOf(_this.slides[i]) >= 0) {
                    _this.slides[i].className += ' ' + params.slideVisibleClass;
                }
            }
            _this.slides[_this.activeIndex].className += ' ' + params.slideActiveClass;
        }

        //Update loop index
        if (params.loop) {
            var ls = _this.loopedSlides;
            _this.activeLoopIndex = _this.activeIndex - ls;
            if (_this.activeLoopIndex >= _this.slides.length - ls * 2) {
                _this.activeLoopIndex = _this.slides.length - ls * 2 - _this.activeLoopIndex;
            }
            if (_this.activeLoopIndex < 0) {
                _this.activeLoopIndex = _this.slides.length - ls * 2 + _this.activeLoopIndex;
            }
            if (_this.activeLoopIndex < 0) _this.activeLoopIndex = 0;
        }
        else {
            _this.activeLoopIndex = _this.activeIndex;
        }
        //Update Pagination
        if (params.pagination) {
            _this.updatePagination(position);
        }
    };
    /*==================================================
        Pagination
    ====================================================*/
    _this.createPagination = function (firstInit) {
        if (params.paginationClickable && _this.paginationButtons) {
            removePaginationEvents();
        }
        _this.paginationContainer = params.pagination.nodeType ? params.pagination : $$(params.pagination)[0];
        if (params.createPagination) {
            var paginationHTML = '';
            var numOfSlides = _this.slides.length;
            var numOfButtons = numOfSlides;
            if (params.loop) numOfButtons -= _this.loopedSlides * 2;
            for (var i = 0; i < numOfButtons; i++) {
                paginationHTML += '<' + params.paginationElement + ' class="' + params.paginationElementClass + '"></' + params.paginationElement + '>';
            }
            _this.paginationContainer.innerHTML = paginationHTML;
        }
        _this.paginationButtons = $$('.' + params.paginationElementClass, _this.paginationContainer);
        if (!firstInit) _this.updatePagination();
        _this.callPlugins('onCreatePagination');
        if (params.paginationClickable) {
            addPaginationEvents();
        }
    };
    function removePaginationEvents() {
        var pagers = _this.paginationButtons;
        if (pagers) {
            for (var i = 0; i < pagers.length; i++) {
                _this.h.removeEventListener(pagers[i], 'click', paginationClick);
            }
        }
    }
    function addPaginationEvents() {
        var pagers = _this.paginationButtons;
        if (pagers) {
            for (var i = 0; i < pagers.length; i++) {
                _this.h.addEventListener(pagers[i], 'click', paginationClick);
            }
        }
    }
    function paginationClick(e) {
        var index;
        var target = e.target || e.srcElement;
        var pagers = _this.paginationButtons;
        for (var i = 0; i < pagers.length; i++) {
            if (target === pagers[i]) index = i;
        }
        _this.swipeTo(index);
    }
    _this.updatePagination = function (position) {
        if (!params.pagination) return;
        if (_this.slides.length < 1) return;
        var activePagers = $$('.' + params.paginationActiveClass, _this.paginationContainer);
        if (!activePagers) return;

        //Reset all Buttons' class to not active
        var pagers = _this.paginationButtons;
        if (pagers.length === 0) return;
        for (var i = 0; i < pagers.length; i++) {
            pagers[i].className = params.paginationElementClass;
        }

        var indexOffset = params.loop ? _this.loopedSlides : 0;
        if (params.paginationAsRange) {
            if (!_this.visibleSlides) _this.calcVisibleSlides(position);
            //Get Visible Indexes
            var visibleIndexes = [];
            var j; // lopp index - avoid JSHint W004 / W038
            for (j = 0; j < _this.visibleSlides.length; j++) {
                var visIndex = _this.slides.indexOf(_this.visibleSlides[j]) - indexOffset;

                if (params.loop && visIndex < 0) {
                    visIndex = _this.slides.length - _this.loopedSlides * 2 + visIndex;
                }
                if (params.loop && visIndex >= _this.slides.length - _this.loopedSlides * 2) {
                    visIndex = _this.slides.length - _this.loopedSlides * 2 - visIndex;
                    visIndex = Math.abs(visIndex);
                }
                visibleIndexes.push(visIndex);
            }

            for (j = 0; j < visibleIndexes.length; j++) {
                if (pagers[visibleIndexes[j]]) pagers[visibleIndexes[j]].className += ' ' + params.paginationVisibleClass;
            }

            if (params.loop) {
                if (pagers[_this.activeLoopIndex] !== undefined) {
                    pagers[_this.activeLoopIndex].className += ' ' + params.paginationActiveClass;
                }
            }
            else {
                pagers[_this.activeIndex].className += ' ' + params.paginationActiveClass;
            }
        }
        else {
            if (params.loop) {
                if (pagers[_this.activeLoopIndex]) pagers[_this.activeLoopIndex].className += ' ' + params.paginationActiveClass + ' ' + params.paginationVisibleClass;
            }
            else {
                pagers[_this.activeIndex].className += ' ' + params.paginationActiveClass + ' ' + params.paginationVisibleClass;
            }
        }
    };
    _this.calcVisibleSlides = function (position) {
        var visibleSlides = [];
        var _slideLeft = 0, _slideSize = 0, _slideRight = 0;
        if (isH && _this.wrapperLeft > 0) position = position + _this.wrapperLeft;
        if (!isH && _this.wrapperTop > 0) position = position + _this.wrapperTop;

        for (var i = 0; i < _this.slides.length; i++) {
            _slideLeft += _slideSize;
            if (params.slidesPerView === 'auto')
                _slideSize  = isH ? _this.h.getWidth(_this.slides[i], true, params.roundLengths) : _this.h.getHeight(_this.slides[i], true, params.roundLengths);
            else _slideSize = slideSize;

            _slideRight = _slideLeft + _slideSize;
            var isVisibile = false;
            if (params.visibilityFullFit) {
                if (_slideLeft >= -position && _slideRight <= -position + containerSize) isVisibile = true;
                if (_slideLeft <= -position && _slideRight >= -position + containerSize) isVisibile = true;
            }
            else {
                if (_slideRight > -position && _slideRight <= ((-position + containerSize))) isVisibile = true;
                if (_slideLeft >= -position && _slideLeft < ((-position + containerSize))) isVisibile = true;
                if (_slideLeft < -position && _slideRight > ((-position + containerSize))) isVisibile = true;
            }

            if (isVisibile) visibleSlides.push(_this.slides[i]);

        }
        if (visibleSlides.length === 0) visibleSlides = [_this.slides[_this.activeIndex]];

        _this.visibleSlides = visibleSlides;
    };

    /*==========================================
        Autoplay
    ============================================*/
    var autoplayTimeoutId, autoplayIntervalId;
    _this.startAutoplay = function () {
        if (_this.support.transitions) {
            if (typeof autoplayTimeoutId !== 'undefined') return false;
            if (!params.autoplay) return;
            _this.callPlugins('onAutoplayStart');
            if (params.onAutoplayStart) _this.fireCallback(params.onAutoplayStart, _this);
            autoplay();
        }
        else {
            if (typeof autoplayIntervalId !== 'undefined') return false;
            if (!params.autoplay) return;
            _this.callPlugins('onAutoplayStart');
            if (params.onAutoplayStart) _this.fireCallback(params.onAutoplayStart, _this);
            autoplayIntervalId = setInterval(function () {
                if (params.loop) {
                    _this.fixLoop();
                    _this.swipeNext(true);
                }
                else if (!_this.swipeNext(true)) {
                    if (!params.autoplayStopOnLast) _this.swipeTo(0);
                    else {
                        clearInterval(autoplayIntervalId);
                        autoplayIntervalId = undefined;
                    }
                }
            }, params.autoplay);
        }
    };
    _this.stopAutoplay = function (internal) {
        if (_this.support.transitions) {
            if (!autoplayTimeoutId) return;
            if (autoplayTimeoutId) clearTimeout(autoplayTimeoutId);
            autoplayTimeoutId = undefined;
            if (internal && !params.autoplayDisableOnInteraction) {
                _this.wrapperTransitionEnd(function () {
                    autoplay();
                });
            }
            _this.callPlugins('onAutoplayStop');
            if (params.onAutoplayStop) _this.fireCallback(params.onAutoplayStop, _this);
        }
        else {
            if (autoplayIntervalId) clearInterval(autoplayIntervalId);
            autoplayIntervalId = undefined;
            _this.callPlugins('onAutoplayStop');
            if (params.onAutoplayStop) _this.fireCallback(params.onAutoplayStop, _this);
        }
    };
    function autoplay() {
        autoplayTimeoutId = setTimeout(function () {
            if (params.loop) {
                _this.fixLoop();
                _this.swipeNext(true);
            }
            else if (!_this.swipeNext(true)) {
                if (!params.autoplayStopOnLast) _this.swipeTo(0);
                else {
                    clearTimeout(autoplayTimeoutId);
                    autoplayTimeoutId = undefined;
                }
            }
            _this.wrapperTransitionEnd(function () {
                if (typeof autoplayTimeoutId !== 'undefined') autoplay();
            });
        }, params.autoplay);
    }
    /*==================================================
        Loop
    ====================================================*/
    _this.loopCreated = false;
    _this.removeLoopedSlides = function () {
        if (_this.loopCreated) {
            for (var i = 0; i < _this.slides.length; i++) {
                if (_this.slides[i].getData('looped') === true) _this.wrapper.removeChild(_this.slides[i]);
            }
        }
    };

    _this.createLoop = function () {
        if (_this.slides.length === 0) return;
        if (params.slidesPerView === 'auto') {
            _this.loopedSlides = params.loopedSlides || 1;
        }
        else {
            _this.loopedSlides = params.slidesPerView + params.loopAdditionalSlides;
        }

        if (_this.loopedSlides > _this.slides.length) {
            _this.loopedSlides = _this.slides.length;
        }

        var slideFirstHTML = '',
            slideLastHTML = '',
            i;
        var slidesSetFullHTML = '';
        /**
                loopedSlides is too large if loopAdditionalSlides are set.
                Need to divide the slides by maximum number of slides existing.

                @author        Tomaz Lovrec <tomaz.lovrec@blanc-noir.at>
        */
        var numSlides = _this.slides.length;
        var fullSlideSets = Math.floor(_this.loopedSlides / numSlides);
        var remainderSlides = _this.loopedSlides % numSlides;
        // assemble full sets of slides
        for (i = 0; i < (fullSlideSets * numSlides); i++) {
            var j = i;
            if (i >= numSlides) {
                var over = Math.floor(i / numSlides);
                j = i - (numSlides * over);
            }
            slidesSetFullHTML += _this.slides[j].outerHTML;
        }
        // assemble remainder slides
        // assemble remainder appended to existing slides
        for (i = 0; i < remainderSlides;i++) {
            slideLastHTML += addClassToHtmlString(params.slideDuplicateClass, _this.slides[i].outerHTML);
        }
        // assemble slides that get preppended to existing slides
        for (i = numSlides - remainderSlides; i < numSlides;i++) {
            slideFirstHTML += addClassToHtmlString(params.slideDuplicateClass, _this.slides[i].outerHTML);
        }
        // assemble all slides
        var slides = slideFirstHTML + slidesSetFullHTML + wrapper.innerHTML + slidesSetFullHTML + slideLastHTML;
        // set the slides
        wrapper.innerHTML = slides;

        _this.loopCreated = true;
        _this.calcSlides();

        //Update Looped Slides with special class
        for (i = 0; i < _this.slides.length; i++) {
            if (i < _this.loopedSlides || i >= _this.slides.length - _this.loopedSlides) _this.slides[i].setData('looped', true);
        }
        _this.callPlugins('onCreateLoop');

    };

    _this.fixLoop = function () {
        var newIndex;
        //Fix For Negative Oversliding
        if (_this.activeIndex < _this.loopedSlides) {
            newIndex = _this.slides.length - _this.loopedSlides * 3 + _this.activeIndex;
            _this.swipeTo(newIndex, 0, false);
        }
        //Fix For Positive Oversliding
        else if ((params.slidesPerView === 'auto' && _this.activeIndex >= _this.loopedSlides * 2) || (_this.activeIndex > _this.slides.length - params.slidesPerView * 2)) {
            newIndex = -_this.slides.length + _this.activeIndex + _this.loopedSlides;
            _this.swipeTo(newIndex, 0, false);
        }
    };

    /*==================================================
        Slides Loader
    ====================================================*/
    _this.loadSlides = function () {
        var slidesHTML = '';
        _this.activeLoaderIndex = 0;
        var slides = params.loader.slides;
        var slidesToLoad = params.loader.loadAllSlides ? slides.length : params.slidesPerView * (1 + params.loader.surroundGroups);
        for (var i = 0; i < slidesToLoad; i++) {
            if (params.loader.slidesHTMLType === 'outer') slidesHTML += slides[i];
            else {
                slidesHTML += '<' + params.slideElement + ' class="' + params.slideClass + '" data-swiperindex="' + i + '">' + slides[i] + '</' + params.slideElement + '>';
            }
        }
        _this.wrapper.innerHTML = slidesHTML;
        _this.calcSlides(true);
        //Add permanent transitionEnd callback
        if (!params.loader.loadAllSlides) {
            _this.wrapperTransitionEnd(_this.reloadSlides, true);
        }
    };

    _this.reloadSlides = function () {
        var slides = params.loader.slides;
        var newActiveIndex = parseInt(_this.activeSlide().data('swiperindex'), 10);
        if (newActiveIndex < 0 || newActiveIndex > slides.length - 1) return; //<-- Exit
        _this.activeLoaderIndex = newActiveIndex;
        var firstIndex = Math.max(0, newActiveIndex - params.slidesPerView * params.loader.surroundGroups);
        var lastIndex = Math.min(newActiveIndex + params.slidesPerView * (1 + params.loader.surroundGroups) - 1, slides.length - 1);
        //Update Transforms
        if (newActiveIndex > 0) {
            var newTransform = -slideSize * (newActiveIndex - firstIndex);
            _this.setWrapperTranslate(newTransform);
            _this.setWrapperTransition(0);
        }
        var i; // loop index
        //New Slides
        if (params.loader.logic === 'reload') {
            _this.wrapper.innerHTML = '';
            var slidesHTML = '';
            for (i = firstIndex; i <= lastIndex; i++) {
                slidesHTML += params.loader.slidesHTMLType === 'outer' ? slides[i] : '<' + params.slideElement + ' class="' + params.slideClass + '" data-swiperindex="' + i + '">' + slides[i] + '</' + params.slideElement + '>';
            }
            _this.wrapper.innerHTML = slidesHTML;
        }
        else {
            var minExistIndex = 1000;
            var maxExistIndex = 0;

            for (i = 0; i < _this.slides.length; i++) {
                var index = _this.slides[i].data('swiperindex');
                if (index < firstIndex || index > lastIndex) {
                    _this.wrapper.removeChild(_this.slides[i]);
                }
                else {
                    minExistIndex = Math.min(index, minExistIndex);
                    maxExistIndex = Math.max(index, maxExistIndex);
                }
            }
            for (i = firstIndex; i <= lastIndex; i++) {
                var newSlide;
                if (i < minExistIndex) {
                    newSlide = document.createElement(params.slideElement);
                    newSlide.className = params.slideClass;
                    newSlide.setAttribute('data-swiperindex', i);
                    newSlide.innerHTML = slides[i];
                    _this.wrapper.insertBefore(newSlide, _this.wrapper.firstChild);
                }
                if (i > maxExistIndex) {
                    newSlide = document.createElement(params.slideElement);
                    newSlide.className = params.slideClass;
                    newSlide.setAttribute('data-swiperindex', i);
                    newSlide.innerHTML = slides[i];
                    _this.wrapper.appendChild(newSlide);
                }
            }
        }
        //reInit
        _this.reInit(true);
    };

    /*==================================================
        Make Swiper
    ====================================================*/
    function makeSwiper() {
        _this.calcSlides();
        if (params.loader.slides.length > 0 && _this.slides.length === 0) {
            _this.loadSlides();
        }
        if (params.loop) {
            _this.createLoop();
        }
        _this.init();
        initEvents();
        if (params.pagination) {
            _this.createPagination(true);
        }

        if (params.loop || params.initialSlide > 0) {
            _this.swipeTo(params.initialSlide, 0, false);
        }
        else {
            _this.updateActiveSlide(0);
        }
        if (params.autoplay) {
            _this.startAutoplay();
        }
        /**
         * Set center slide index.
         *
         * @author        Tomaz Lovrec <tomaz.lovrec@gmail.com>
         */
        _this.centerIndex = _this.activeIndex;

        // Callbacks
        if (params.onSwiperCreated) _this.fireCallback(params.onSwiperCreated, _this);
        _this.callPlugins('onSwiperCreated');
    }

    makeSwiper();
};

Swiper.prototype = {
    plugins : {},

    /*==================================================
        Wrapper Operations
    ====================================================*/
    wrapperTransitionEnd : function (callback, permanent) {
        'use strict';
        var a = this,
            el = a.wrapper,
            events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
            i;

        function fireCallBack() {
            callback(a);
            if (a.params.queueEndCallbacks) a._queueEndCallbacks = false;
            if (!permanent) {
                for (i = 0; i < events.length; i++) {
                    a.h.removeEventListener(el, events[i], fireCallBack);
                }
            }
        }

        if (callback) {
            for (i = 0; i < events.length; i++) {
                a.h.addEventListener(el, events[i], fireCallBack);
            }
        }
    },

    getWrapperTranslate : function (axis) {
        'use strict';
        var el = this.wrapper,
            matrix, curTransform, curStyle, transformMatrix;

        // automatic axis detection
        if (typeof axis === 'undefined') {
            axis = this.params.mode === 'horizontal' ? 'x' : 'y';
        }

        if (this.support.transforms && this.params.useCSS3Transforms) {
            curStyle = window.getComputedStyle(el, null);
            if (window.WebKitCSSMatrix) {
                // Some old versions of Webkit choke when 'none' is passed; pass
                // empty string instead in this case
                transformMatrix = new WebKitCSSMatrix(curStyle.webkitTransform === 'none' ? '' : curStyle.webkitTransform);
            }
            else {
                transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform  || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
                matrix = transformMatrix.toString().split(',');
            }

            if (axis === 'x') {
                //Latest Chrome and webkits Fix
                if (window.WebKitCSSMatrix)
                    curTransform = transformMatrix.m41;
                //Crazy IE10 Matrix
                else if (matrix.length === 16)
                    curTransform = parseFloat(matrix[12]);
                //Normal Browsers
                else
                    curTransform = parseFloat(matrix[4]);
            }
            if (axis === 'y') {
                //Latest Chrome and webkits Fix
                if (window.WebKitCSSMatrix)
                    curTransform = transformMatrix.m42;
                //Crazy IE10 Matrix
                else if (matrix.length === 16)
                    curTransform = parseFloat(matrix[13]);
                //Normal Browsers
                else
                    curTransform = parseFloat(matrix[5]);
            }
        }
        else {
            if (axis === 'x') curTransform = parseFloat(el.style.left, 10) || 0;
            if (axis === 'y') curTransform = parseFloat(el.style.top, 10) || 0;
        }
        return curTransform || 0;
    },

    setWrapperTranslate : function (x, y, z) {
        'use strict';
        var es = this.wrapper.style,
            coords = {x: 0, y: 0, z: 0},
            translate;

        // passed all coordinates
        if (arguments.length === 3) {
            coords.x = x;
            coords.y = y;
            coords.z = z;
        }

        // passed one coordinate and optional axis
        else {
            if (typeof y === 'undefined') {
                y = this.params.mode === 'horizontal' ? 'x' : 'y';
            }
            coords[y] = x;
        }

        if (this.support.transforms && this.params.useCSS3Transforms) {
            translate = this.support.transforms3d ? 'translate3d(' + coords.x + 'px, ' + coords.y + 'px, ' + coords.z + 'px)' : 'translate(' + coords.x + 'px, ' + coords.y + 'px)';
            es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = translate;
        }
        else {
            es.left = coords.x + 'px';
            es.top  = coords.y + 'px';
        }
        this.callPlugins('onSetWrapperTransform', coords);
        if (this.params.onSetWrapperTransform) this.fireCallback(this.params.onSetWrapperTransform, this, coords);
    },

    setWrapperTransition : function (duration) {
        'use strict';
        var es = this.wrapper.style;
        es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = (duration / 1000) + 's';
        this.callPlugins('onSetWrapperTransition', {duration: duration});
        if (this.params.onSetWrapperTransition) this.fireCallback(this.params.onSetWrapperTransition, this, duration);

    },

    /*==================================================
        Helpers
    ====================================================*/
    h : {
        getWidth: function (el, outer, round) {
            'use strict';
            var width = window.getComputedStyle(el, null).getPropertyValue('width');
            var returnWidth = parseFloat(width);
            //IE Fixes
            if (isNaN(returnWidth) || width.indexOf('%') > 0) {
                returnWidth = el.offsetWidth - parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-left')) - parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-right'));
            }
            if (outer) returnWidth += parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-left')) + parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-right'));
            if (round) return Math.round(returnWidth);
            else return returnWidth;
        },
        getHeight: function (el, outer, round) {
            'use strict';
            if (outer) return el.offsetHeight;

            var height = window.getComputedStyle(el, null).getPropertyValue('height');
            var returnHeight = parseFloat(height);
            //IE Fixes
            if (isNaN(returnHeight) || height.indexOf('%') > 0) {
                returnHeight = el.offsetHeight - parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-top')) - parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-bottom'));
            }
            if (outer) returnHeight += parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-top')) + parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-bottom'));
            if (round) return Math.round(returnHeight);
            else return returnHeight;
        },
        getOffset: function (el) {
            'use strict';
            var box = el.getBoundingClientRect();
            var body = document.body;
            var clientTop  = el.clientTop  || body.clientTop  || 0;
            var clientLeft = el.clientLeft || body.clientLeft || 0;
            var scrollTop  = window.pageYOffset || el.scrollTop;
            var scrollLeft = window.pageXOffset || el.scrollLeft;
            if (document.documentElement && !window.pageYOffset) {
                //IE7-8
                scrollTop  = document.documentElement.scrollTop;
                scrollLeft = document.documentElement.scrollLeft;
            }
            return {
                top: box.top  + scrollTop  - clientTop,
                left: box.left + scrollLeft - clientLeft
            };
        },
        windowWidth : function () {
            'use strict';
            if (window.innerWidth) return window.innerWidth;
            else if (document.documentElement && document.documentElement.clientWidth) return document.documentElement.clientWidth;
        },
        windowHeight : function () {
            'use strict';
            if (window.innerHeight) return window.innerHeight;
            else if (document.documentElement && document.documentElement.clientHeight) return document.documentElement.clientHeight;
        },
        windowScroll : function () {
            'use strict';
            if (typeof pageYOffset !== 'undefined') {
                return {
                    left: window.pageXOffset,
                    top: window.pageYOffset
                };
            }
            else if (document.documentElement) {
                return {
                    left: document.documentElement.scrollLeft,
                    top: document.documentElement.scrollTop
                };
            }
        },

        addEventListener : function (el, event, listener, useCapture) {
            'use strict';
            if (typeof useCapture === 'undefined') {
                useCapture = false;
            }

            if (el.addEventListener) {
                el.addEventListener(event, listener, useCapture);
            }
            else if (el.attachEvent) {
                el.attachEvent('on' + event, listener);
            }
        },

        removeEventListener : function (el, event, listener, useCapture) {
            'use strict';
            if (typeof useCapture === 'undefined') {
                useCapture = false;
            }

            if (el.removeEventListener) {
                el.removeEventListener(event, listener, useCapture);
            }
            else if (el.detachEvent) {
                el.detachEvent('on' + event, listener);
            }
        }
    },
    setTransform : function (el, transform) {
        'use strict';
        var es = el.style;
        es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = transform;
    },
    setTranslate : function (el, translate) {
        'use strict';
        var es = el.style;
        var pos = {
            x : translate.x || 0,
            y : translate.y || 0,
            z : translate.z || 0
        };
        var transformString = this.support.transforms3d ? 'translate3d(' + (pos.x) + 'px,' + (pos.y) + 'px,' + (pos.z) + 'px)' : 'translate(' + (pos.x) + 'px,' + (pos.y) + 'px)';
        es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = transformString;
        if (!this.support.transforms) {
            es.left = pos.x + 'px';
            es.top = pos.y + 'px';
        }
    },
    setTransition : function (el, duration) {
        'use strict';
        var es = el.style;
        es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = duration + 'ms';
    },
    /*==================================================
        Feature Detection
    ====================================================*/
    support: {

        touch : (window.Modernizr && Modernizr.touch === true) || (function () {
            'use strict';
            return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
        })(),

        transforms3d : (window.Modernizr && Modernizr.csstransforms3d === true) || (function () {
            'use strict';
            var div = document.createElement('div').style;
            return ('webkitPerspective' in div || 'MozPerspective' in div || 'OPerspective' in div || 'MsPerspective' in div || 'perspective' in div);
        })(),

        transforms : (window.Modernizr && Modernizr.csstransforms === true) || (function () {
            'use strict';
            var div = document.createElement('div').style;
            return ('transform' in div || 'WebkitTransform' in div || 'MozTransform' in div || 'msTransform' in div || 'MsTransform' in div || 'OTransform' in div);
        })(),

        transitions : (window.Modernizr && Modernizr.csstransitions === true) || (function () {
            'use strict';
            var div = document.createElement('div').style;
            return ('transition' in div || 'WebkitTransition' in div || 'MozTransition' in div || 'msTransition' in div || 'MsTransition' in div || 'OTransition' in div);
        })(),

        classList : (function () {
            'use strict';
            var div = document.createElement('div').style;
            return 'classList' in div;
        })()
    },

    browser : {

        ie8 : (function () {
            'use strict';
            var rv = -1; // Return value assumes failure.
            if (navigator.appName === 'Microsoft Internet Explorer') {
                var ua = navigator.userAgent;
                var re = new RegExp(/MSIE ([0-9]{1,}[\.0-9]{0,})/);
                if (re.exec(ua) !== null)
                    rv = parseFloat(RegExp.$1);
            }
            return rv !== -1 && rv < 9;
        })(),

        ie10 : window.navigator.msPointerEnabled,
        ie11 : window.navigator.pointerEnabled
    }
};

/*=========================
  jQuery & Zepto Plugins
  ===========================*/
if (window.jQuery || window.Zepto) {
    (function ($) {
        'use strict';
        $.fn.swiper = function (params) {
            var s = new Swiper($(this)[0], params);
            $(this).data('swiper', s);
            return s;
        };
    })(window.jQuery || window.Zepto);
}

// component
if (typeof(module) !== 'undefined')
{
    module.exports = Swiper;
}

// requirejs support
if (typeof define === 'function' && define.amd) {
    define([], function () {
        'use strict';
        return Swiper;
    });
}



/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 * 
 * Requires: 1.2.2+
 */

(function ($) {

        var types = ['DOMMouseScroll', 'mousewheel'];

        if ($.event.fixHooks) {
                for (var i = types.length; i;) {
                        $.event.fixHooks[types[--i]] = $.event.mouseHooks;
                }
        }

        $.event.special.mousewheel = {
                setup: function () {
                        if (this.addEventListener) {
                                for (var i = types.length; i;) {
                                        this.addEventListener(types[--i], handler, false);
                                }
                        } else {
                                this.onmousewheel = handler;
                        }
                },

                teardown: function () {
                        if (this.removeEventListener) {
                                for (var i = types.length; i;) {
                                        this.removeEventListener(types[--i], handler, false);
                                }
                        } else {
                                this.onmousewheel = null;
                        }
                }
        };

        $.fn.extend({
                mousewheel: function (fn) {
                        return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
                },

                unmousewheel: function (fn) {
                        return this.unbind("mousewheel", fn);
                }
        });


        function handler(event) {
                var orgEvent = event || window.event,
                        args = [].slice.call(arguments, 1),
                        delta = 0,
                        returnValue = true,
                        deltaX = 0,
                        deltaY = 0;
                event = $.event.fix(orgEvent);
                event.type = "mousewheel";

                // Old school scrollwheel delta
                if (orgEvent.wheelDelta) {
                        delta = orgEvent.wheelDelta / 120;
                }
                if (orgEvent.detail) {
                        delta = -orgEvent.detail / 3;
                }

                // New school multidimensional scroll (touchpads) deltas
                deltaY = delta;

                // Gecko
                if (orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
                        deltaY = 0;
                        deltaX = -1 * delta;
                }

                // Webkit
                if (orgEvent.wheelDeltaY !== undefined) {
                        deltaY = orgEvent.wheelDeltaY / 120;
                }
                if (orgEvent.wheelDeltaX !== undefined) {
                        deltaX = -1 * orgEvent.wheelDeltaX / 120;
                }

                // Add event and delta to the front of the arguments
                args.unshift(event, delta, deltaX, deltaY);

                return ($.event.dispatch || $.event.handle).apply(this, args);
        }

})(jQuery);



(function ($, window, undefined) {
        // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
        // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
        // requestAnimationFrame polyfill by Erik Möller
        // fixes from Paul Irish and Tino Zijdel
        var lastTime = 0,
                running, animate = function (elem) {
                        if (running) {
                                window.requestAnimationFrame(animate, elem);
                                jQuery.fx.tick();
                        }
                },
                vendors = ['ms', 'moz', 'webkit', 'o'];

        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame) window.requestAnimationFrame = function (fn, element) {
                var currTime = new Date().getTime(),
                        delta = currTime - lastTime,
                        timeToCall = Math.max(0, 16 - delta);

                var id = window.setTimeout(function () {
                        fn(currTime + timeToCall);
                }, timeToCall);

                lastTime = currTime + timeToCall;

                return id;
        };

        if (!window.cancelAnimationFrame) {
                window.cancelAnimationFrame = function (id) {
                        clearTimeout(id);
                };
        }

        jQuery.fx.timer = function (timer) {
                if (timer() && jQuery.timers.push(timer) && !running) {
                        running = true;
                        animate(timer.elem);
                }
        };

        jQuery.fx.stop = function () {
                running = false;
        };

}(jQuery, this));





/* Copyright 2012, Ben Lin (http://dreamerslab.com/)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 1.0.15
 *
 * Requires: jQuery >= 1.2.3
 */
(function (a) {
        a.fn.addBack = a.fn.addBack || a.fn.andSelf;
        a.fn.extend({
                actual: function (b, l) {
                        if (!this[b]) {
                                throw '$.actual => The jQuery method "' + b + '" you called does not exist';
                        }
                        var f = {
                                absolute: false,
                                clone: false,
                                includeMargin: false
                        };
                        var i = a.extend(f, l);
                        var e = this.eq(0);
                        var h, j;
                        if (i.clone === true) {
                                h = function () {
                                        var m = "position: absolute !important; top: -1000 !important; ";
                                        e = e.clone().attr("style", m).appendTo("body")
                                };
                                j = function () {
                                        e.remove()
                                }
                        } else {
                                var g = [];
                                var d = "";
                                var c;
                                h = function () {
                                        c = e.parents().addBack().filter(":hidden");
                                        d += "visibility: hidden !important; display: block !important; ";
                                        if (i.absolute === true) {
                                                d += "position: absolute !important; "
                                        }
                                        c.each(function () {
                                                var m = a(this);
                                                g.push(m.attr("style"));
                                                m.attr("style", d)
                                        })
                                };
                                j = function () {
                                        c.each(function (m) {
                                                var o = a(this);
                                                var n = g[m];
                                                if (n === undefined) {
                                                        o.removeAttr("style")
                                                } else {
                                                        o.attr("style", n)
                                                }
                                        })
                                }
                        }
                        h();
                        var k = /(outer)/.test(b) ? e[b](i.includeMargin) : e[b]();
                        j();
                        return k
                }
        })
})(jQuery);



Swiper.prototype.plugins.progress = function (swiper, params) {
    'use strict';

    var isH = swiper.params.mode === 'horizontal';
    var wrapperMaxPosition;
    function initSlides() {
        for (var i = 0; i < swiper.slides.length; i++) {
            var slide = swiper.slides[i];
            slide.progressSlideSize = isH ? swiper.h.getWidth(slide) : swiper.h.getHeight(slide);
            if ('offsetLeft' in slide) {
                slide.progressSlideOffset = isH ? slide.offsetLeft : slide.offsetTop;
            }
            else {
                slide.progressSlideOffset = isH ? slide.getOffset().left - swiper.h.getOffset(swiper.container).left : slide.getOffset().top - swiper.h.getOffset(swiper.container).top;
            }
        }
        if (isH) {
            wrapperMaxPosition = swiper.h.getWidth(swiper.wrapper) + swiper.wrapperLeft + swiper.wrapperRight - swiper.width;
        }
        else {
            wrapperMaxPosition = swiper.h.getHeight(swiper.wrapper) + swiper.wrapperTop + swiper.wrapperBottom - swiper.height;
        }
    }
    function calcProgress(transform) {
        transform = transform || {x: 0, y: 0, z: 0};
        var offsetCenter;
        if (swiper.params.centeredSlides === true) offsetCenter = isH ? -transform.x + swiper.width / 2 : -transform.y + swiper.height / 2;
        else offsetCenter = isH ? -transform.x : -transform.y;
        //Each slide offset from offset center
        for (var i = 0; i < swiper.slides.length; i++) {
            var slide = swiper.slides[i];
            var slideCenterOffset = (swiper.params.centeredSlides === true) ? slide.progressSlideSize / 2 : 0;

            var offsetMultiplier = (offsetCenter - slide.progressSlideOffset - slideCenterOffset) / slide.progressSlideSize;
            slide.progress = offsetMultiplier;

        }
        // Global Swiper Progress
        swiper.progress = isH ? -transform.x / wrapperMaxPosition : -transform.y / wrapperMaxPosition;
        // Callback
        if (swiper.params.onProgressChange) swiper.fireCallback(swiper.params.onProgressChange, swiper);
    }

    //Plugin Hooks
    return {
        onFirstInit: function (args) {
            initSlides();
            calcProgress({
                x: swiper.getWrapperTranslate('x'),
                y: swiper.getWrapperTranslate('y')
            });
        },
        onInit: function (args) {
            initSlides();
        },
        onSetWrapperTransform: function (transform) {
            calcProgress(transform);
        }
    };
};
;

/*
 
 jQuery Tools 1.2.5 Tabs- The basics of UI design.

 NO COPYRIGHTS OR LICENSES. DO WHAT YOU LIKE.

 http://flowplayer.org/tools/tabs/

 Since: November 2008
 Date:    Wed Sep 22 06:02:10 2010 +0000 
*/
(function (c) {
        function p(d, b, a) {
                var e = this,
                        l = d.add(this),
                        h = d.find(a.toolsTabs),
                        i = b.jquery ? b : d.children(b),
                        j;
                h.length || (h = d.children());
                i.length || (i = d.parent().find(b));
                i.length || (i = c(b));
                c.extend(this, {
                        click: function (f, g) {
                                var k = h.eq(f);
                                if (typeof f == "string" && f.replace("#", "")) {
                                        k = h.filter("[href*=" + f.replace("#", "") + "]");
                                        f = Math.max(h.index(k), 0)
                                }
                                if (a.rotate) {
                                        var n = h.length - 1;
                                        if (f < 0) return e.click(n, g);
                                        if (f > n) return e.click(0, g)
                                }
                                if (!k.length) {
                                        if (j >= 0) return e;
                                        f = a.initialIndex;
                                        k = h.eq(f)
                                }
                                if (f === j) return e;
                                g = g || c.Event();
                                g.type = "onBeforeClick";
                                l.trigger(g, [f]);
                                if (!g.isDefaultPrevented()) {
                                        o[a.effect].call(e, f, function () {
                                                g.type = "onClick";
                                                l.trigger(g, [f])
                                        });
                                        j = f;
                                        h.removeClass(a.current);
                                        k.addClass(a.current);
                                        return e
                                }
                        },
                        getConf: function () {
                                return a
                        },
                        getTabs: function () {
                                return h
                        },
                        getPanes: function () {
                                return i
                        },
                        getCurrentPane: function () {
                                return i.eq(j)
                        },
                        getCurrentTab: function () {
                                return h.eq(j)
                        },
                        getIndex: function () {
                                return j
                        },
                        next: function () {
                                return e.click(j + 1)
                        },
                        prev: function () {
                                return e.click(j - 1)
                        },
                        destroy: function () {
                                h.unbind(a.event).removeClass(a.current);
                                i.find("a[href^=#]").unbind("click.T");
                                return e
                        }
                });
                c.each("onBeforeClick,onClick".split(","), function (f, g) {
                        c.isFunction(a[g]) && c(e).bind(g, a[g]);
                        e[g] = function (k) {
                                k && c(e).bind(g, k);
                                return e
                        }
                });
                if (a.history && c.fn.history) {
                        c.tools.history.init(h);
                        a.event = "history"
                }
                h.each(function (f) {
                        c(this).bind(a.event, function (g) {
                                e.click(f, g);
                                //return g.preventDefault()
                        })
                });
                i.find("a[href^=#]").bind("click.T", function (f) {
                        e.click(c(this).attr("href"), f)
                });
                if (location.hash && a.toolsTabs == "a" && d.find("[href=" + location.hash + "]").length) e.click(location.hash);
                else if (a.initialIndex === 0 || a.initialIndex > 0) e.click(a.initialIndex)
        }
        c.tools = c.tools || {
                version: "1.2.5"
        };
        c.tools.toolsTabs = {
                conf: {
                        toolsTabs: "a",
                        current: "current",
                        onBeforeClick: null,
                        onClick: null,
                        effect: "default",
                        initialIndex: 0,
                        event: "click",
                        rotate: false,
                        history: false
                },
                addEffect: function (d, b) {
                        o[d] = b
                }
        };
        var o = {
                "default": function (d, b) {
                        this.getPanes().addClass('visuallyhidden').eq(d).removeClass('visuallyhidden');
                        b.call()
                },
                fade: function (d, b) {
                        var a = this.getConf(),
                                e = a.fadeOutSpeed,
                                l = this.getPanes();
                        e ? l.fadeOut(e) : l.hide();
                        l.eq(d).fadeIn(a.fadeInSpeed, b)
                },
                slide: function (d, b) {
                        this.getPanes().slideUp(100);
                        this.getPanes().eq(d).slideDown(100, b)
                },
                ajax: function (d, b) {
                        this.getPanes().eq(0).load(this.getTabs().eq(d).attr("href"), b)
                }
        },
                m;
        c.tools.toolsTabs.addEffect("horizontal", function (d, b) {
                m || (m = this.getPanes().eq(0).width());
                this.getCurrentPane().animate({
                        width: 0
                }, function () {
                        c(this).hide()
                });
                this.getPanes().eq(d).animate({
                        width: m
                }, function () {
                        c(this).show();
                        b.call()
                })
        });
        c.fn.toolsTabs = function (d, b) {
                var a = this.data("toolsTabs");
                if (a) {
                        a.destroy();
                        this.removeData("toolsTabs")
                }
                if (c.isFunction(b)) b = {
                        onBeforeClick: b
                };
                b = c.extend({}, c.tools.toolsTabs.conf, b);
                this.each(function () {
                        a = new p(c(this), d, b);
                        c(this).data("toolsTabs", a)
                });
                return b.api ? a : this
        }
})(jQuery);

;

/*
 
 jQuery Tools Validator 1.2.5 - HTML5 is here. Now use it.

 NO COPYRIGHTS OR LICENSES. DO WHAT YOU LIKE.

 http://flowplayer.org/tools/form/validator/

 Since: Mar 2010
 Date:    Wed Sep 22 06:02:10 2010 +0000 
*/
(function (e) {
        function t(a, b, c) {
                var k = a.offset().top,
                        f = a.offset().left,
                        l = c.position.split(/,?\s+/),
                        p = l[0];
                l = l[1];
                k -= b.outerHeight() - c.offset[0];
                f += a.outerWidth() + c.offset[1];
                if (/iPad/i.test(navigator.userAgent)) k -= e(window).scrollTop();
                c = b.outerHeight() + a.outerHeight();
                if (p == "center") k += c / 2;
                if (p == "bottom") k += c;
                a = a.outerWidth();
                if (l == "center") f -= (a + b.outerWidth()) / 2;
                if (l == "left") f -= a;
                return {
                        top: k,
                        left: f
                }
        }
        function y(a) {
                function b() {
                        return this.getAttribute("type") == a
                }
                b.key = "[type=" + a + "]";
                return b
        }
        function u(a, b, c) {
                function k(g, d, i) {
                        if (!(!c.grouped && g.length)) {
                                var j;
                                if (i === false || e.isArray(i)) {
                                        j = h.messages[d.key || d] || h.messages["*"];
                                        j = j[c.lang] || h.messages["*"].en;
                                        (d = j.match(/\$\d/g)) && e.isArray(i) && e.each(d, function (m) {
                                                j = j.replace(this, i[m])
                                        })
                                } else j = i[c.lang] || i;
                                g.push(j)
                        }
                }
                var f = this,
                        l = b.add(f);
                a = a.not(":button, :image, :reset, :submit");
                e.extend(f, {
                        getConf: function () {
                                return c
                        },
                        getForm: function () {
                                return b
                        },
                        getInputs: function () {
                                return a
                        },
                        reflow: function () {
                                a.each(function () {
                                        var g = e(this),
                                                d = g.data("msg.el");
                                        if (d) {
                                                g = t(g, d, c);
                                                d.css({
                                                        top: g.top,
                                                        left: g.left
                                                })
                                        }
                                });
                                return f
                        },
                        invalidate: function (g, d) {
                                if (!d) {
                                        var i = [];
                                        e.each(g, function (j, m) {
                                                j = a.filter("[name='" + j + "']");
                                                if (j.length) {
                                                        j.trigger("OI", [m]);
                                                        i.push({
                                                                input: j,
                                                                messages: [m]
                                                        })
                                                }
                                        });
                                        g = i;
                                        d = e.Event()
                                }
                                d.type = "onFail";
                                l.trigger(d, [g]);
                                d.isDefaultPrevented() || q[c.effect][0].call(f, g, d);
                                return f
                        },
                        reset: function (g) {
                                g = g || a;
                                g.removeClass(c.errorClass).each(function () {
                                        var d = e(this).data("msg.el");
                                        if (d) {
                                                d.remove();
                                                e(this).data("msg.el", null)
                                        }
                                }).unbind(c.errorInputEvent || "");
                                return f
                        },
                        destroy: function () {
                                b.unbind(c.formEvent + ".V").unbind("reset.V");
                                a.unbind(c.inputEvent + ".V").unbind("change.V");
                                return f.reset()
                        },
                        checkValidity: function (g, d) {
                                g = g || a;
                                g = g.not(":disabled");
                                if (!g.length) return true;
                                d = d || e.Event();
                                d.type = "onBeforeValidate";
                                l.trigger(d, [g]);
                                if (d.isDefaultPrevented()) return d.result;
                                var i = [];
                                g.not(":radio:not(:checked)").each(function () {
                                        var m = [],
                                                n = e(this).data("messages", m),
                                                v = r && n.is(":date") ? "onHide.v" : c.errorInputEvent + ".v";
                                        n.unbind(v);
                                        e.each(w, function () {
                                                var o = this,
                                                        s = o[0];
                                                if (n.filter(s).length) {
                                                        o = o[1].call(f, n, n.val());
                                                        if (o !== true) {
                                                                d.type = "onBeforeFail";
                                                                l.trigger(d, [n, s]);
                                                                if (d.isDefaultPrevented()) return false;
                                                                var x = n.attr(c.messageAttr);
                                                                if (x) {
                                                                        m = [x];
                                                                        return false
                                                                } else k(m, s, o)
                                                        }
                                                }
                                        });
                                        if (m.length) {
                                                i.push({
                                                        input: n,
                                                        messages: m
                                                });
                                                n.trigger("OI", [m]);
                                                c.errorInputEvent && n.bind(v, function (o) {
                                                        f.checkValidity(n, o)
                                                })
                                        }
                                        if (c.singleError && i.length) return false
                                });
                                var j = q[c.effect];
                                if (!j) throw 'Validator: cannot find effect "' + c.effect + '"';
                                if (i.length) {
                                        f.invalidate(i, d);
                                        return false
                                } else {
                                        j[1].call(f, g, d);
                                        d.type = "onSuccess";
                                        l.trigger(d, [g]);
                                        g.unbind(c.errorInputEvent + ".v")
                                }
                                return true
                        }
                });
                e.each("onBeforeValidate,onBeforeFail,onFail,onSuccess".split(","), function (g, d) {
                        e.isFunction(c[d]) && e(f).bind(d, c[d]);
                        f[d] = function (i) {
                                i && e(f).bind(d, i);
                                return f
                        }
                });
                c.formEvent && b.bind(c.formEvent + ".V", function (g) {
                        if (!f.checkValidity(null, g)) return g.preventDefault()
                });
                b.bind("reset.V", function () {
                        f.reset()
                });
                a[0] && a[0].validity && a.each(function () {
                        this.oninvalid = function () {
                                return false
                        }
                });
                if (b[0]) b[0].checkValidity = f.checkValidity;
                c.inputEvent && a.bind(c.inputEvent + ".V", function (g) {
                        f.checkValidity(e(this), g)
                });
                a.filter(":checkbox, select").filter("[required]").bind("change.V", function (g) {
                        var d = e(this);
                        if (this.checked || d.is("select") && e(this).val()) q[c.effect][1].call(f, d, g)
                });
                var p = a.filter(":radio").change(function (g) {
                        f.checkValidity(p, g)
                });
                e(window).resize(function () {
                        f.reflow()
                })
        }
        e.tools = e.tools || {
                version: "1.2.5"
        };
        var z = /\[type=([a-z]+)\]/,
                A = /^-?[0-9]*(\.[0-9]+)?$/,
                r = e.tools.dateinput,
                B = /^([a-z0-9_\.\-\+]+)@([\da-z\.\-]+)\.([a-z\.]{2,6})$/i,
                C = /^(https?:\/\/)?[\da-z\.\-]+\.[a-z\.]{2,6}[#&+_\?\/\w \.\-=]*$/i,
                h;
        h = e.tools.validator = {
                conf: {
                        grouped: false,
                        effect: "default",
                        errorClass: "invalid",
                        inputEvent: null,
                        errorInputEvent: "keyup",
                        formEvent: "submit",
                        lang: "en",
                        message: "<div/>",
                        messageAttr: "data-message",
                        messageClass: "error",
                        offset: [0, 0],
                        position: "center right",
                        singleError: false,
                        speed: "normal"
                },
                messages: {
                        "*": {
                                en: "Please correct this value"
                        }
                },
                localize: function (a, b) {
                        e.each(b, function (c, k) {
                                h.messages[c] = h.messages[c] || {};
                                h.messages[c][a] = k
                        })
                },
                localizeFn: function (a, b) {
                        h.messages[a] = h.messages[a] || {};
                        e.extend(h.messages[a], b)
                },
                fn: function (a, b, c) {
                        if (e.isFunction(b)) c = b;
                        else {
                                if (typeof b == "string") b = {
                                        en: b
                                };
                                this.messages[a.key || a] = b
                        }
                        if (b = z.exec(a)) a = y(b[1]);
                        w.push([a, c])
                },
                addEffect: function (a, b, c) {
                        q[a] = [b, c]
                }
        };
        var w = [],
                q = {
                        "default": [function (a) {
                                var b = this.getConf();
                                e.each(a, function (c, k) {
                                        c = k.input;
                                        c.addClass(b.errorClass);
                                        var f = c.data("msg.el");
                                        if (!f) {
                                                f = e(b.message).addClass(b.messageClass).appendTo(document.body);
                                                c.data("msg.el", f)
                                        }
                                        f.css({
                                                visibility: "hidden"
                                        }).find("p").remove();
                                        e.each(k.messages, function (l, p) {
                                                e("<p/>").html(p).appendTo(f)
                                        });
                                        f.outerWidth() == f.parent().width() && f.add(f.find("p")).css({
                                                display: "inline"
                                        });
                                        k = t(c, f, b);
                                        f.css({
                                                visibility: "visible",
                                                position: "absolute",
                                                top: k.top,
                                                left: k.left
                                        }).fadeIn(b.speed)
                                })
                        }, function (a) {
                                var b = this.getConf();
                                a.removeClass(b.errorClass).each(function () {
                                        var c = e(this).data("msg.el");
                                        c && c.css({
                                                visibility: "hidden"
                                        })
                                })
                        }]
                };
        e.each("email,url,number".split(","), function (a, b) {
                e.expr[":"][b] = function (c) {
                        return c.getAttribute("type") === b
                }
        });
        e.fn.oninvalid = function (a) {
                return this[a ? "bind" : "trigger"]("OI", a)
        };
        h.fn(":email", "Please enter a valid email address", function (a, b) {
                return !b || B.test(b)
        });
        h.fn(":url", "Please enter a valid URL", function (a, b) {
                return !b || C.test(b)
        });
        h.fn(":number", "Please enter a numeric value.", function (a, b) {
                return A.test(b)
        });
        h.fn("[max]", "Please enter a value smaller than $1", function (a, b) {
                if (b === "" || r && a.is(":date")) return true;
                a = a.attr("max");
                return parseFloat(b) <= parseFloat(a) ? true : [a]
        });
        h.fn("[min]", "Please enter a value larger than $1", function (a, b) {
                if (b === "" || r && a.is(":date")) return true;
                a = a.attr("min");
                return parseFloat(b) >= parseFloat(a) ? true : [a]
        });
        h.fn("[required]", "Please complete this mandatory field.", function (a, b) {
                if (a.is(":checkbox")) return a.is(":checked");
                return !!b
        });
        h.fn("[pattern]", function (a) {
                var b = new RegExp("^" + a.attr("pattern") + "$");
                return b.test(a.val())
        });
        e.fn.validator = function (a) {
                var b = this.data("validator");
                if (b) {
                        b.destroy();
                        this.removeData("validator")
                }
                a = e.extend(true, {}, h.conf, a);
                if (this.is("form")) return this.each(function () {
                        var c = e(this);
                        b = new u(c.find(":input"), c, a);
                        c.data("validator", b)
                });
                else {
                        b = new u(this, this.eq(0).closest("form"), a);
                        return this.data("validator", b)
                }
        }
})(jQuery);

;/*
 * transform: A jQuery cssHooks adding cross-browser 2d transform capabilities to $.fn.css() and $.fn.animate()
 *
 * limitations:
 * - requires jQuery 1.4.3+
 * - Should you use the *translate* property, then your elements need to be absolutely positionned in a relatively positionned wrapper **or it will fail in IE678**.
 * - transformOrigin is not accessible
 *
 * latest version and complete README available on Github:
 * https://github.com/louisremi/jquery.transform.js
 *
 * Copyright 2011 @louis_remi
 * Licensed under the MIT license.
 *
 * This saved you an hour of work?
 * Send me music http://www.amazon.co.uk/wishlist/HNTU0468LQON
 *
 */
(function( $, window, document, Math, undefined ) {

/*
 * Feature tests and global variables
 */
var div = document.createElement("div"),
	divStyle = div.style,
	suffix = "Transform",
	testProperties = [
		"O" + suffix,
		"ms" + suffix,
		"Webkit" + suffix,
		"Moz" + suffix
	],
	i = testProperties.length,
	supportProperty,
	supportMatrixFilter,
	supportFloat32Array = "Float32Array" in window,
	propertyHook,
	propertyGet,
	rMatrix = /Matrix([^)]*)/,
	rAffine = /^\s*matrix\(\s*1\s*,\s*0\s*,\s*0\s*,\s*1\s*(?:,\s*0(?:px)?\s*){2}\)\s*$/,
	_transform = "transform",
	_transformOrigin = "transformOrigin",
	_translate = "translate",
	_rotate = "rotate",
	_scale = "scale",
	_skew = "skew",
	_matrix = "matrix";

// test different vendor prefixes of these properties
while ( i-- ) {
	if ( testProperties[i] in divStyle ) {
		$.support[_transform] = supportProperty = testProperties[i];
		$.support[_transformOrigin] = supportProperty + "Origin";
		continue;
	}
}
// IE678 alternative
if ( !supportProperty ) {
	$.support.matrixFilter = supportMatrixFilter = divStyle.filter === "";
}

// px isn't the default unit of these properties
$.cssNumber[_transform] = $.cssNumber[_transformOrigin] = true;

/*
 * fn.css() hooks
 */
if ( supportProperty && supportProperty != _transform ) {
	// Modern browsers can use jQuery.cssProps as a basic hook
	$.cssProps[_transform] = supportProperty;
	$.cssProps[_transformOrigin] = supportProperty + "Origin";

	// Firefox needs a complete hook because it stuffs matrix with "px"
	if ( supportProperty == "Moz" + suffix ) {
		propertyHook = {
			get: function( elem, computed ) {
				return (computed ?
					// remove "px" from the computed matrix
					$.css( elem, supportProperty ).split("px").join(""):
					elem.style[supportProperty]
				);
			},
			set: function( elem, value ) {
				// add "px" to matrices
				elem.style[supportProperty] = /matrix\([^)p]*\)/.test(value) ?
					value.replace(/matrix((?:[^,]*,){4})([^,]*),([^)]*)/, _matrix+"$1$2px,$3px"):
					value;
			}
		};
	/* Fix two jQuery bugs still present in 1.5.1
	 * - rupper is incompatible with IE9, see http://jqbug.com/8346
	 * - jQuery.css is not really jQuery.cssProps aware, see http://jqbug.com/8402
	 */
	} else if ( /^1\.[0-5](?:\.|$)/.test($.fn.jquery) ) {
		propertyHook = {
			get: function( elem, computed ) {
				return (computed ?
					$.css( elem, supportProperty.replace(/^ms/, "Ms") ):
					elem.style[supportProperty]
				);
			}
		};
	}
	/* TODO: leverage hardware acceleration of 3d transform in Webkit only
	else if ( supportProperty == "Webkit" + suffix && support3dTransform ) {
		propertyHook = {
			set: function( elem, value ) {
				elem.style[supportProperty] = 
					value.replace();
			}
		}
	}*/

} else if ( supportMatrixFilter ) {
	propertyHook = {
		get: function( elem, computed, asArray ) {
			var elemStyle = ( computed && elem.currentStyle ? elem.currentStyle : elem.style ),
				matrix, data;

			if ( elemStyle && rMatrix.test( elemStyle.filter ) ) {
				matrix = RegExp.$1.split(",");
				matrix = [
					matrix[0].split("=")[1],
					matrix[2].split("=")[1],
					matrix[1].split("=")[1],
					matrix[3].split("=")[1]
				];
			} else {
				matrix = [1,0,0,1];
			}

			if ( ! $.cssHooks[_transformOrigin] ) {
				matrix[4] = elemStyle ? parseInt(elemStyle.left, 10) || 0 : 0;
				matrix[5] = elemStyle ? parseInt(elemStyle.top, 10) || 0 : 0;

			} else {
				data = $._data( elem, "transformTranslate", undefined );
				matrix[4] = data ? data[0] : 0;
				matrix[5] = data ? data[1] : 0;
			}

			return asArray ? matrix : _matrix+"(" + matrix + ")";
		},
		set: function( elem, value, animate ) {
			var elemStyle = elem.style,
				currentStyle,
				Matrix,
				filter,
				centerOrigin;

			if ( !animate ) {
				elemStyle.zoom = 1;
			}

			value = matrix(value);

			// rotate, scale and skew
			Matrix = [
				"Matrix("+
					"M11="+value[0],
					"M12="+value[2],
					"M21="+value[1],
					"M22="+value[3],
					"SizingMethod='auto expand'"
			].join();
			filter = ( currentStyle = elem.currentStyle ) && currentStyle.filter || elemStyle.filter || "";

			elemStyle.filter = rMatrix.test(filter) ?
				filter.replace(rMatrix, Matrix) :
				filter + " progid:DXImageTransform.Microsoft." + Matrix + ")";

			if ( ! $.cssHooks[_transformOrigin] ) {

				// center the transform origin, from pbakaus's Transformie http://github.com/pbakaus/transformie
				if ( (centerOrigin = $.transform.centerOrigin) ) {
					elemStyle[centerOrigin == "margin" ? "marginLeft" : "left"] = -(elem.offsetWidth/2) + (elem.clientWidth/2) + "px";
					elemStyle[centerOrigin == "margin" ? "marginTop" : "top"] = -(elem.offsetHeight/2) + (elem.clientHeight/2) + "px";
				}

				// translate
				// We assume that the elements are absolute positionned inside a relative positionned wrapper
				elemStyle.left = value[4] + "px";
				elemStyle.top = value[5] + "px";

			} else {
				$.cssHooks[_transformOrigin].set( elem, value );
			}
		}
	};
}
// populate jQuery.cssHooks with the appropriate hook if necessary
if ( propertyHook ) {
	$.cssHooks[_transform] = propertyHook;
}
// we need a unique setter for the animation logic
propertyGet = propertyHook && propertyHook.get || $.css;

/*
 * fn.animate() hooks
 */
$.fx.step.transform = function( fx ) {
	var elem = fx.elem,
		start = fx.start,
		end = fx.end,
		pos = fx.pos,
		transform = "",
		precision = 1E5,
		i, startVal, endVal, unit;

	// fx.end and fx.start need to be converted to interpolation lists
	if ( !start || typeof start === "string" ) {

		// the following block can be commented out with jQuery 1.5.1+, see #7912
		if ( !start ) {
			start = propertyGet( elem, supportProperty );
		}

		// force layout only once per animation
		if ( supportMatrixFilter ) {
			elem.style.zoom = 1;
		}

		// replace "+=" in relative animations (-= is meaningless with transforms)
		end = end.split("+=").join(start);

		// parse both transform to generate interpolation list of same length
		$.extend( fx, interpolationList( start, end ) );
		start = fx.start;
		end = fx.end;
	}

	i = start.length;

	// interpolate functions of the list one by one
	while ( i-- ) {
		startVal = start[i];
		endVal = end[i];
		unit = +false;

		switch ( startVal[0] ) {

			case _translate:
				unit = "px";
			case _scale:
				unit || ( unit = "");

				transform = startVal[0] + "(" +
					Math.round( (startVal[1][0] + (endVal[1][0] - startVal[1][0]) * pos) * precision ) / precision + unit +","+
					Math.round( (startVal[1][1] + (endVal[1][1] - startVal[1][1]) * pos) * precision ) / precision + unit + ")"+
					transform;
				break;

			case _skew + "X":
			case _skew + "Y":
			case _rotate:
				transform = startVal[0] + "(" +
					Math.round( (startVal[1] + (endVal[1] - startVal[1]) * pos) * precision ) / precision +"rad)"+
					transform;
				break;
		}
	}

	fx.origin && ( transform = fx.origin + transform );

	propertyHook && propertyHook.set ?
		propertyHook.set( elem, transform, +true ):
		elem.style[supportProperty] = transform;
};

/*
 * Utility functions
 */

// turns a transform string into its "matrix(A,B,C,D,X,Y)" form (as an array, though)
function matrix( transform ) {
	transform = transform.split(")");
	var
			trim = $.trim
		, i = -1
		// last element of the array is an empty string, get rid of it
		, l = transform.length -1
		, split, prop, val
		, prev = supportFloat32Array ? new Float32Array(6) : []
		, curr = supportFloat32Array ? new Float32Array(6) : []
		, rslt = supportFloat32Array ? new Float32Array(6) : [1,0,0,1,0,0]
		;

	prev[0] = prev[3] = rslt[0] = rslt[3] = 1;
	prev[1] = prev[2] = prev[4] = prev[5] = 0;

	// Loop through the transform properties, parse and multiply them
	while ( ++i < l ) {
		split = transform[i].split("(");
		prop = trim(split[0]);
		val = split[1];
		curr[0] = curr[3] = 1;
		curr[1] = curr[2] = curr[4] = curr[5] = 0;

		switch (prop) {
			case _translate+"X":
				curr[4] = parseInt(val, 10);
				break;

			case _translate+"Y":
				curr[5] = parseInt(val, 10);
				break;

			case _translate:
				val = val.split(",");
				curr[4] = parseInt(val[0], 10);
				curr[5] = parseInt(val[1] || 0, 10);
				break;

			case _rotate:
				val = toRadian(val);
				curr[0] = Math.cos(val);
				curr[1] = Math.sin(val);
				curr[2] = -Math.sin(val);
				curr[3] = Math.cos(val);
				break;

			case _scale+"X":
				curr[0] = +val;
				break;

			case _scale+"Y":
				curr[3] = val;
				break;

			case _scale:
				val = val.split(",");
				curr[0] = val[0];
				curr[3] = val.length>1 ? val[1] : val[0];
				break;

			case _skew+"X":
				curr[2] = Math.tan(toRadian(val));
				break;

			case _skew+"Y":
				curr[1] = Math.tan(toRadian(val));
				break;

			case _matrix:
				val = val.split(",");
				curr[0] = val[0];
				curr[1] = val[1];
				curr[2] = val[2];
				curr[3] = val[3];
				curr[4] = parseInt(val[4], 10);
				curr[5] = parseInt(val[5], 10);
				break;
		}

		// Matrix product (array in column-major order)
		rslt[0] = prev[0] * curr[0] + prev[2] * curr[1];
		rslt[1] = prev[1] * curr[0] + prev[3] * curr[1];
		rslt[2] = prev[0] * curr[2] + prev[2] * curr[3];
		rslt[3] = prev[1] * curr[2] + prev[3] * curr[3];
		rslt[4] = prev[0] * curr[4] + prev[2] * curr[5] + prev[4];
		rslt[5] = prev[1] * curr[4] + prev[3] * curr[5] + prev[5];

		prev = [rslt[0],rslt[1],rslt[2],rslt[3],rslt[4],rslt[5]];
	}
	return rslt;
}

// turns a matrix into its rotate, scale and skew components
// algorithm from http://hg.mozilla.org/mozilla-central/file/7cb3e9795d04/layout/style/nsStyleAnimation.cpp
function unmatrix(matrix) {
	var
			scaleX
		, scaleY
		, skew
		, A = matrix[0]
		, B = matrix[1]
		, C = matrix[2]
		, D = matrix[3]
		;

	// Make sure matrix is not singular
	if ( A * D - B * C ) {
		// step (3)
		scaleX = Math.sqrt( A * A + B * B );
		A /= scaleX;
		B /= scaleX;
		// step (4)
		skew = A * C + B * D;
		C -= A * skew;
		D -= B * skew;
		// step (5)
		scaleY = Math.sqrt( C * C + D * D );
		C /= scaleY;
		D /= scaleY;
		skew /= scaleY;
		// step (6)
		if ( A * D < B * C ) {
			A = -A;
			B = -B;
			skew = -skew;
			scaleX = -scaleX;
		}

	// matrix is singular and cannot be interpolated
	} else {
		// In this case the elem shouldn't be rendered, hence scale == 0
		scaleX = scaleY = skew = 0;
	}

	// The recomposition order is very important
	// see http://hg.mozilla.org/mozilla-central/file/7cb3e9795d04/layout/style/nsStyleAnimation.cpp#l971
	return [
		[_translate, [+matrix[4], +matrix[5]]],
		[_rotate, Math.atan2(B, A)],
		[_skew + "X", Math.atan(skew)],
		[_scale, [scaleX, scaleY]]
	];
}

// build the list of transform functions to interpolate
// use the algorithm described at http://dev.w3.org/csswg/css3-2d-transforms/#animation
function interpolationList( start, end ) {
	var list = {
			start: [],
			end: []
		},
		i = -1, l,
		currStart, currEnd, currType;

	// get rid of affine transform matrix
	( start == "none" || isAffine( start ) ) && ( start = "" );
	( end == "none" || isAffine( end ) ) && ( end = "" );

	// if end starts with the current computed style, this is a relative animation
	// store computed style as the origin, remove it from start and end
	if ( start && end && !end.indexOf("matrix") && toArray( start ).join() == toArray( end.split(")")[0] ).join() ) {
		list.origin = start;
		start = "";
		end = end.slice( end.indexOf(")") +1 );
	}

	if ( !start && !end ) { return; }

	// start or end are affine, or list of transform functions are identical
	// => functions will be interpolated individually
	if ( !start || !end || functionList(start) == functionList(end) ) {

		start && ( start = start.split(")") ) && ( l = start.length );
		end && ( end = end.split(")") ) && ( l = end.length );

		while ( ++i < l-1 ) {
			start[i] && ( currStart = start[i].split("(") );
			end[i] && ( currEnd = end[i].split("(") );
			currType = $.trim( ( currStart || currEnd )[0] );

			append( list.start, parseFunction( currType, currStart ? currStart[1] : 0 ) );
			append( list.end, parseFunction( currType, currEnd ? currEnd[1] : 0 ) );
		}

	// otherwise, functions will be composed to a single matrix
	} else {
		list.start = unmatrix(matrix(start));
		list.end = unmatrix(matrix(end))
	}

	return list;
}

function parseFunction( type, value ) {
	var
		// default value is 1 for scale, 0 otherwise
		defaultValue = +(!type.indexOf(_scale)),
		scaleX,
		// remove X/Y from scaleX/Y & translateX/Y, not from skew
		cat = type.replace( /e[XY]/, "e" );

	switch ( type ) {
		case _translate+"Y":
		case _scale+"Y":

			value = [
				defaultValue,
				value ?
					parseFloat( value ):
					defaultValue
			];
			break;

		case _translate+"X":
		case _translate:
		case _scale+"X":
			scaleX = 1;
		case _scale:

			value = value ?
				( value = value.split(",") ) &&	[
					parseFloat( value[0] ),
					parseFloat( value.length>1 ? value[1] : type == _scale ? scaleX || value[0] : defaultValue+"" )
				]:
				[defaultValue, defaultValue];
			break;

		case _skew+"X":
		case _skew+"Y":
		case _rotate:
			value = value ? toRadian( value ) : 0;
			break;

		case _matrix:
			return unmatrix( value ? toArray(value) : [1,0,0,1,0,0] );
			break;
	}

	return [[ cat, value ]];
}

function isAffine( matrix ) {
	return rAffine.test(matrix);
}

function functionList( transform ) {
	return transform.replace(/(?:\([^)]*\))|\s/g, "");
}

function append( arr1, arr2, value ) {
	while ( value = arr2.shift() ) {
		arr1.push( value );
	}
}

// converts an angle string in any unit to a radian Float
function toRadian(value) {
	return ~value.indexOf("deg") ?
		parseInt(value,10) * (Math.PI * 2 / 360):
		~value.indexOf("grad") ?
			parseInt(value,10) * (Math.PI/200):
			parseFloat(value);
}

// Converts "matrix(A,B,C,D,X,Y)" to [A,B,C,D,X,Y]
function toArray(matrix) {
	// remove the unit of X and Y for Firefox
	matrix = /([^,]*),([^,]*),([^,]*),([^,]*),([^,p]*)(?:px)?,([^)p]*)(?:px)?/.exec(matrix);
	return [matrix[1], matrix[2], matrix[3], matrix[4], matrix[5], matrix[6]];
}

$.transform = {
	centerOrigin: "margin"
};

})( jQuery, window, document, Math );
;// The MIT License (MIT)

// Typed.js | Copyright (c) 2014 Matt Boldt | www.mattboldt.com

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.




!function($){

    "use strict";

    var Typed = function(el, options){

        // chosen element to manipulate text
        this.el = $(el);
        // options
        this.options = $.extend({}, $.fn.typed.defaults, options);

        // text content of element
        this.text = this.el.text();

        // typing speed
        this.typeSpeed = this.options.typeSpeed;

        // add a delay before typing starts
        this.startDelay = this.options.startDelay;

        // backspacing speed
        this.backSpeed = this.options.backSpeed;

        // amount of time to wait before backspacing
        this.backDelay = this.options.backDelay;

        // input strings of text
        this.strings = this.options.strings;

        // character number position of current string
        this.strPos = 0;

        // current array position
        this.arrayPos = 0;

        // current string based on current values[] array position
        this.string = this.strings[this.arrayPos];

        // number to stop backspacing on.
        // default 0, can change depending on how many chars
        // you want to remove at the time
        this.stopNum = 0;

        // Looping logic
        this.loop = this.options.loop;
        this.loopCount = this.options.loopCount;
        this.curLoop = 1;
        if (this.loop === false){
            // number in which to stop going through array
            // set to strings[] array (length - 1) to stop deleting after last string is typed
            this.stopArray = this.strings.length-1;
        }
        else{
            this.stopArray = this.strings.length;
        }

        // All systems go!
        this.build();
    }

        Typed.prototype =  {

            constructor: Typed

            , init: function(){
                // begin the loop w/ first current string (global self.string)
                // current string will be passed as an argument each time after this
                var self  = this;
                setTimeout(function() {
                    // Start typing
                    self.typewrite(self.string, self.strPos)
                }, self.startDelay);
            }

            , build: function(){
                // Insert cursor
                this.el.after("<span id=\"typed-cursor\">|</span>");
                this.init();
            }

            // pass current string state to each function
            , typewrite: function(curString, curStrPos){

                // varying values for setTimeout during typing
                // can't be global since number changes each time loop is executed
                var humanize = Math.round(Math.random() * (100 - 30)) + this.typeSpeed;
                var self = this;

                // ------------- optional ------------- //
                // backpaces a certain string faster
                // ------------------------------------ //
                // if (self.arrayPos == 1){
                //  self.backDelay = 50;
                // }
                // else{ self.backDelay = 500; }

                // contain typing function in a timeout
                setTimeout(function() {

                    // make sure array position is less than array length
                    if (self.arrayPos < self.strings.length){

                        // check for an escape character before a pause value
                        if (curString.substr(curStrPos, 1) === "^") {
                            var charPauseEnd = curString.substr(curStrPos + 1).indexOf(" ");
                            var charPause = curString.substr(curStrPos + 1, charPauseEnd);
                            // strip out the escape character and pause value so they're not printed
                            curString = curString.replace("^" + charPause, "");
                        }
                        else {
                            var charPause = 0;
                        }

                        // timeout for any pause after a character
                        setTimeout(function() {

                            // start typing each new char into existing string
                            // curString is function arg
                            self.el.text(self.text + curString.substr(0, curStrPos));

                            // check if current character number is the string's length
                            // and if the current array position is less than the stopping point
                            // if so, backspace after backDelay setting
                            if (curStrPos > curString.length && self.arrayPos < self.stopArray){
                                clearTimeout(clear);
                                self.options.onStringTyped();
                                var clear = setTimeout(function(){
                                    self.backspace(curString, curStrPos);
                                }, self.backDelay);
                            }

                            // else, keep typing
                            else{
                                // add characters one by one
                                curStrPos++;
                                // loop the function
                                self.typewrite(curString, curStrPos);
                                // if the array position is at the stopping position
                                // finish code, on to next task
                                if (self.loop === false){
                                    if (self.arrayPos === self.stopArray && curStrPos === curString.length){
                                        // animation that occurs on the last typed string
                                        // fires callback function
                                        var clear = self.options.callback();
                                        clearTimeout(clear);
                                    }
                                }
                            }

                        // end of character pause
                        }, charPause);
                    }
                    // if the array position is greater than array length
                    // and looping is active, reset array pos and start over.
                    else if (self.loop === true && self.loopCount === false){
                        self.arrayPos = 0;
                        self.init();
                    }
                        else if(self.loopCount !== false && self.curLoop < self.loopCount){
                            self.arrayPos = 0;
                            self.curLoop = self.curLoop+1;
                            self.init();
                        }

                // humanized value for typing
                }, humanize);

            }

            , backspace: function(curString, curStrPos){

                // varying values for setTimeout during typing
                // can't be global since number changes each time loop is executed
                var humanize = Math.round(Math.random() * (100 - 30)) + this.backSpeed;
                var self = this;

                setTimeout(function() {

                    // ----- this part is optional ----- //
                    // check string array position
                    // on the first string, only delete one word
                    // the stopNum actually represents the amount of chars to
                    // keep in the current string. In my case it's 14.
                    // if (self.arrayPos == 1){
                    //  self.stopNum = 14;
                    // }
                    //every other time, delete the whole typed string
                    // else{
                    //  self.stopNum = 0;
                    // }

                    // ----- continue important stuff ----- //
                    // replace text with current text + typed characters
                    self.el.text(self.text + curString.substr(0, curStrPos));

                    // if the number (id of character in current string) is
                    // less than the stop number, keep going
                    if (curStrPos > self.stopNum){
                        // subtract characters one by one
                        curStrPos--;
                        // loop the function
                        self.backspace(curString, curStrPos);
                    }
                    // if the stop number has been reached, increase
                    // array position to next string
                    else if (curStrPos <= self.stopNum){
                        clearTimeout(clear);
                        var clear = self.arrayPos = self.arrayPos+1;
                        // must pass new array position in this instance
                        // instead of using global arrayPos
                        self.typewrite(self.strings[self.arrayPos], curStrPos);
                    }

                // humanized value for typing
                }, humanize);

            }

        }

    $.fn.typed = function (option) {
        return this.each(function () {
          var $this = $(this)
            , data = $this.data('typed')
            , options = typeof option == 'object' && option
          if (!data) $this.data('typed', (data = new Typed(this, options)))
          if (typeof option == 'string') data[option]()
        });
    }

    $.fn.typed.defaults = {
        strings: ["These are the default values...", "You know what you should do?", "Use your own!", "Have a great day!"],
        // typing speed
        typeSpeed: 0,
        // time before typing starts
        startDelay: 0,
        // backspacing speed
        backSpeed: 0,
        // time before backspacing
        backDelay: 500,
        // loop
        loop: false,
        // false = infinite
        loopCount: false,
        // ending callback function
        callback: function(){ null },
        //callback for every typed string
        onStringTyped: function(){ null }
    }


}(window.jQuery);;;
(function($, window, undefined) {

	'use strict';

	// global
	var Modernizr = window.Modernizr,
		$body = $('body');

	$.DLMenu = function(options, element) {
		this.$el = $(element);
		this._init(options);
	};

	$.DLMenu.defaults = {
		animationClasses: {
			classin: 'mk-vm-animate-in-' + $('body').attr('data-vm-anim'),
			classout: 'mk-vm-animate-out-' + $('body').attr('data-vm-anim')
		},
		onLevelClick: function(el, name) {
			return false;
		},
		onLinkClick: function(el, ev) {
			return false;
		}
	};

	$.DLMenu.prototype = {
		_init: function(options) {

			this.options = $.extend(true, {}, $.DLMenu.defaults, options);
			this._config();

			var animEndEventNames = {
					'WebkitAnimation': 'webkitAnimationEnd',
					'OAnimation': 'oAnimationEnd',
					'msAnimation': 'MSAnimationEnd',
					'animation': 'animationend'
				},
				transEndEventNames = {
					'WebkitTransition': 'webkitTransitionEnd',
					'MozTransition': 'transitionend',
					'OTransition': 'oTransitionEnd',
					'msTransition': 'MSTransitionEnd',
					'transition': 'transitionend'
				};
			this.animEndEventName = animEndEventNames[Modernizr.prefixed('animation')] + '.dlmenu';
			this.transEndEventName = transEndEventNames[Modernizr.prefixed('transition')] + '.dlmenu',
			this.supportAnimations = Modernizr.cssanimations,
			this.supportTransitions = Modernizr.csstransitions;

			this._initEvents();

		},
		_config: function() {
			this.open = false;
			var $backText = $('body').attr('data-backText');
			this.$trigger = this.$el.children('.mk-vm-trigger');
			this.$menu = this.$el.children('ul.mk-vm-menu');
			this.$menuitems = this.$menu.find('li:not(.mk-vm-back)');
			this.$el.find('ul.sub-menu').prepend('<li class="mk-vm-back"><a href="#">' + $backText + '</a></li>');
			this.$back = this.$menu.find('li.mk-vm-back');
		},
		_initEvents: function() {

			var self = this;

			this.$trigger.on('click.dlmenu', function() {

				if (self.open) {
					self._closeMenu();
				} else {
					self._openMenu();
				}
				return false;

			});

			this.$menuitems.on('click.dlmenu', function(event) {

				event.stopPropagation();

				var $item = $(this),
					$submenu = $item.children('ul.sub-menu');

				if ($submenu.length > 0) {

					var $flyin = $submenu.clone().css('opacity', 0).insertAfter(self.$menu),
						onAnimationEndFn = function() {
							self.$menu.off(self.animEndEventName).removeClass(self.options.animationClasses.classout).addClass('mk-vm-subview');
							$item.addClass('mk-vm-subviewopen').parents('.mk-vm-subviewopen:first').removeClass('mk-vm-subviewopen').addClass('mk-vm-subview');
							$flyin.remove();
						};

					setTimeout(function() {
						$flyin.addClass(self.options.animationClasses.classin);
						self.$menu.addClass(self.options.animationClasses.classout);
						if (self.supportAnimations) {
							self.$menu.on(self.animEndEventName, onAnimationEndFn);
						} else {
							onAnimationEndFn.call();
						}

						self.options.onLevelClick($item, $item.children('a:first').text());
					});

					return false;

				} else {
					self.options.onLinkClick($item, event);
				}

			});

			this.$back.on('click.dlmenu', function(event) {

				var $this = $(this),
					$submenu = $this.parents('ul.sub-menu:first'),
					$item = $submenu.parent(),

					$flyin = $submenu.clone().insertAfter(self.$menu);

				var onAnimationEndFn = function() {
					self.$menu.off(self.animEndEventName).removeClass(self.options.animationClasses.classin);
					$flyin.remove();
				};

				setTimeout(function() {
					$flyin.addClass(self.options.animationClasses.classout);
					self.$menu.addClass(self.options.animationClasses.classin);
					if (self.supportAnimations) {
						self.$menu.on(self.animEndEventName, onAnimationEndFn);
					} else {
						onAnimationEndFn.call();
					}

					$item.removeClass('mk-vm-subviewopen');

					var $subview = $this.parents('.mk-vm-subview:first');
					if ($subview.is('li')) {
						$subview.addClass('mk-vm-subviewopen');
					}
					$subview.removeClass('mk-vm-subview');
				});

				return false;

			});

		},
		closeMenu: function() {
			if (this.open) {
				this._closeMenu();
			}
		},
		_closeMenu: function() {
			var self = this,
				onTransitionEndFn = function() {
					self.$menu.off(self.transEndEventName);
					self._resetMenu();
				};

			this.$menu.removeClass('mk-vm-menuopen');
			this.$menu.addClass('mk-vm-menu-toggle');
			this.$trigger.removeClass('mk-vm-active');

			if (this.supportTransitions) {
				this.$menu.on(this.transEndEventName, onTransitionEndFn);
			} else {
				onTransitionEndFn.call();
			}

			this.open = false;
		},
		openMenu: function() {
			if (!this.open) {
				this._openMenu();
			}
		},
		_openMenu: function() {
			var self = this;
			$body.off('click').on('click.dlmenu', function() {
				self._closeMenu();
			});
			this.$menu.addClass('mk-vm-menuopen mk-vm-menu-toggle').on(this.transEndEventName, function() {
				$(this).removeClass('mk-vm-menu-toggle');
			});
			this.$trigger.addClass('mk-vm-active');
			this.open = true;
		},
		_resetMenu: function() {
			this.$menu.removeClass('mk-vm-subview');
			this.$menuitems.removeClass('mk-vm-subview mk-vm-subviewopen');
		}
	};

	var logError = function(message) {
		if (window.console) {
			window.console.error(message);
		}
	};

	$.fn.dlmenu = function(options) {
		if (typeof options === 'string') {
			var args = Array.prototype.slice.call(arguments, 1);
			this.each(function() {
				var instance = $.data(this, 'dlmenu');
				if (!instance) {
					logError("cannot call methods on dlmenu prior to initialization; " +
						"attempted to call method '" + options + "'");
					return;
				}
				if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
					logError("no such method '" + options + "' for dlmenu instance");
					return;
				}
				instance[options].apply(instance, args);
			});
		} else {
			this.each(function() {
				var instance = $.data(this, 'dlmenu');
				if (instance) {
					instance._init();
				} else {
					instance = $.data(this, 'dlmenu', new $.DLMenu(options, this));
				}
			});
		}
		return this;
	};

})(jQuery, window);;

/*
 * Viewport - jQuery selectors for finding elements in viewport
 *
 * Copyright (c) 2008-2009 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *  http://www.appelsiini.net/projects/viewport
 *
 */
(function ($) {

        "use strict";

        $.belowthefold = function (element, settings) {
                var fold = $(window).height() + $(window).scrollTop();
                return fold <= $(element).offset().top - settings.threshold;
        };

        $.abovethetop = function (element, settings) {
                var top = $(window).scrollTop();
                return top >= $(element).offset().top + $(element).height() - settings.threshold;
        };

        $.rightofscreen = function (element, settings) {
                var fold = $(window).width() + $(window).scrollLeft();
                return fold <= $(element).offset().left - settings.threshold;
        };

        $.leftofscreen = function (element, settings) {
                var left = $(window).scrollLeft();
                return left >= $(element).offset().left + $(element).width() - settings.threshold;
        };

        $.inviewport = function (element, settings) {
                return !$.rightofscreen(element, settings) && !$.leftofscreen(element, settings) && !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
        };

        $.extend($.expr[':'], {
                "below-the-fold": function (a) {
                        return $.belowthefold(a, {
                                threshold: 0
                        });
                },
                "above-the-top": function (a) {
                        return $.abovethetop(a, {
                                threshold: 0
                        });
                },
                "left-of-screen": function (a) {
                        return $.leftofscreen(a, {
                                threshold: 0
                        });
                },
                "right-of-screen": function (a) {
                        return $.rightofscreen(a, {
                                threshold: 0
                        });
                },
                "in-viewport": function (a) {
                        return $.inviewport(a, {
                                threshold: -40
                        });
                }
        });


})(jQuery);



;
/*! waitForImages jQuery Plugin - v1.5.0 - 2013-07-20
 * https://github.com/alexanderdickson/waitForImages
 * Copyright (c) 2013 Alex Dickson; Licensed MIT */
(function ($) {
        var o = 'waitForImages';
        $.waitForImages = {
                hasImageProperties: ['backgroundImage', 'listStyleImage', 'borderImage', 'borderCornerImage', 'cursor']
        };
        $.expr[':'].uncached = function (a) {
                if (!$(a).is('img[src!=""]')) {
                        return false
                }
                var b = new Image();
                b.src = a.src;
                return !b.complete
        };
        $.fn.waitForImages = function (j, k, l) {
                var m = 0;
                var n = 0;
                if ($.isPlainObject(arguments[0])) {
                        l = arguments[0].waitForAll;
                        k = arguments[0].each;
                        j = arguments[0].finished
                }
                j = j || $.noop;
                k = k || $.noop;
                l = !! l;
                if (!$.isFunction(j) || !$.isFunction(k)) {
                        throw new TypeError('An invalid callback was supplied.');
                }
                return this.each(function () {
                        var e = $(this);
                        var f = [];
                        var g = $.waitForImages.hasImageProperties || [];
                        var h = /url\(\s*(['"]?)(.*?)\1\s*\)/g;
                        if (l) {
                                e.find('*').addBack().each(function () {
                                        var d = $(this);
                                        if (d.is('img:uncached')) {
                                                f.push({
                                                        src: d.attr('src'),
                                                        element: d[0]
                                                })
                                        }
                                        $.each(g, function (i, a) {
                                                var b = d.css(a);
                                                var c;
                                                if (!b) {
                                                        return true
                                                }
                                                while (c = h.exec(b)) {
                                                        f.push({
                                                                src: c[2],
                                                                element: d[0]
                                                        })
                                                }
                                        })
                                })
                        } else {
                                e.find('img:uncached').each(function () {
                                        f.push({
                                                src: this.src,
                                                element: this
                                        })
                                })
                        }
                        m = f.length;
                        n = 0;
                        if (m === 0) {
                                j.call(e[0])
                        }
                        $.each(f, function (i, b) {
                                var c = new Image();
                                $(c).on('load.' + o + ' error.' + o, function (a) {
                                        n++;
                                        k.call(b.element, n, m, a.type == 'load');
                                        if (n == m) {
                                                j.call(e[0]);
                                                return false
                                        }
                                });
                                c.src = b.src
                        })
                })
        }
}(jQuery));
;// Generated by CoffeeScript 1.6.2
/*!
jQuery Waypoints - v2.0.5
Copyright (c) 2011-2014 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/jquery-waypoints/blob/master/licenses.txt
*/
(function(){var t=[].indexOf||function(t){for(var e=0,n=this.length;e<n;e++){if(e in this&&this[e]===t)return e}return-1},e=[].slice;(function(t,e){if(typeof define==="function"&&define.amd){return define("waypoints",["jquery"],function(n){return e(n,t)})}else{return e(t.jQuery,t)}})(window,function(n,r){var i,o,l,s,f,u,c,a,h,d,p,y,v,w,g,m;i=n(r);a=t.call(r,"ontouchstart")>=0;s={horizontal:{},vertical:{}};f=1;c={};u="waypoints-context-id";p="resize.waypoints";y="scroll.waypoints";v=1;w="waypoints-waypoint-ids";g="waypoint";m="waypoints";o=function(){function t(t){var e=this;this.$element=t;this.element=t[0];this.didResize=false;this.didScroll=false;this.id="context"+f++;this.oldScroll={x:t.scrollLeft(),y:t.scrollTop()};this.waypoints={horizontal:{},vertical:{}};this.element[u]=this.id;c[this.id]=this;t.bind(y,function(){var t;if(!(e.didScroll||a)){e.didScroll=true;t=function(){e.doScroll();return e.didScroll=false};return r.setTimeout(t,n[m].settings.scrollThrottle)}});t.bind(p,function(){var t;if(!e.didResize){e.didResize=true;t=function(){n[m]("refresh");return e.didResize=false};return r.setTimeout(t,n[m].settings.resizeThrottle)}})}t.prototype.doScroll=function(){var t,e=this;t={horizontal:{newScroll:this.$element.scrollLeft(),oldScroll:this.oldScroll.x,forward:"right",backward:"left"},vertical:{newScroll:this.$element.scrollTop(),oldScroll:this.oldScroll.y,forward:"down",backward:"up"}};if(a&&(!t.vertical.oldScroll||!t.vertical.newScroll)){n[m]("refresh")}n.each(t,function(t,r){var i,o,l;l=[];o=r.newScroll>r.oldScroll;i=o?r.forward:r.backward;n.each(e.waypoints[t],function(t,e){var n,i;if(r.oldScroll<(n=e.offset)&&n<=r.newScroll){return l.push(e)}else if(r.newScroll<(i=e.offset)&&i<=r.oldScroll){return l.push(e)}});l.sort(function(t,e){return t.offset-e.offset});if(!o){l.reverse()}return n.each(l,function(t,e){if(e.options.continuous||t===l.length-1){return e.trigger([i])}})});return this.oldScroll={x:t.horizontal.newScroll,y:t.vertical.newScroll}};t.prototype.refresh=function(){var t,e,r,i=this;r=n.isWindow(this.element);e=this.$element.offset();this.doScroll();t={horizontal:{contextOffset:r?0:e.left,contextScroll:r?0:this.oldScroll.x,contextDimension:this.$element.width(),oldScroll:this.oldScroll.x,forward:"right",backward:"left",offsetProp:"left"},vertical:{contextOffset:r?0:e.top,contextScroll:r?0:this.oldScroll.y,contextDimension:r?n[m]("viewportHeight"):this.$element.height(),oldScroll:this.oldScroll.y,forward:"down",backward:"up",offsetProp:"top"}};return n.each(t,function(t,e){return n.each(i.waypoints[t],function(t,r){var i,o,l,s,f;i=r.options.offset;l=r.offset;o=n.isWindow(r.element)?0:r.$element.offset()[e.offsetProp];if(n.isFunction(i)){i=i.apply(r.element)}else if(typeof i==="string"){i=parseFloat(i);if(r.options.offset.indexOf("%")>-1){i=Math.ceil(e.contextDimension*i/100)}}r.offset=o-e.contextOffset+e.contextScroll-i;if(r.options.onlyOnScroll&&l!=null||!r.enabled){return}if(l!==null&&l<(s=e.oldScroll)&&s<=r.offset){return r.trigger([e.backward])}else if(l!==null&&l>(f=e.oldScroll)&&f>=r.offset){return r.trigger([e.forward])}else if(l===null&&e.oldScroll>=r.offset){return r.trigger([e.forward])}})})};t.prototype.checkEmpty=function(){if(n.isEmptyObject(this.waypoints.horizontal)&&n.isEmptyObject(this.waypoints.vertical)){this.$element.unbind([p,y].join(" "));return delete c[this.id]}};return t}();l=function(){function t(t,e,r){var i,o;if(r.offset==="bottom-in-view"){r.offset=function(){var t;t=n[m]("viewportHeight");if(!n.isWindow(e.element)){t=e.$element.height()}return t-n(this).outerHeight()}}this.$element=t;this.element=t[0];this.axis=r.horizontal?"horizontal":"vertical";this.callback=r.handler;this.context=e;this.enabled=r.enabled;this.id="waypoints"+v++;this.offset=null;this.options=r;e.waypoints[this.axis][this.id]=this;s[this.axis][this.id]=this;i=(o=this.element[w])!=null?o:[];i.push(this.id);this.element[w]=i}t.prototype.trigger=function(t){if(!this.enabled){return}if(this.callback!=null){this.callback.apply(this.element,t)}if(this.options.triggerOnce){return this.destroy()}};t.prototype.disable=function(){return this.enabled=false};t.prototype.enable=function(){this.context.refresh();return this.enabled=true};t.prototype.destroy=function(){delete s[this.axis][this.id];delete this.context.waypoints[this.axis][this.id];return this.context.checkEmpty()};t.getWaypointsByElement=function(t){var e,r;r=t[w];if(!r){return[]}e=n.extend({},s.horizontal,s.vertical);return n.map(r,function(t){return e[t]})};return t}();d={init:function(t,e){var r;e=n.extend({},n.fn[g].defaults,e);if((r=e.handler)==null){e.handler=t}this.each(function(){var t,r,i,s;t=n(this);i=(s=e.context)!=null?s:n.fn[g].defaults.context;if(!n.isWindow(i)){i=t.closest(i)}i=n(i);r=c[i[0][u]];if(!r){r=new o(i)}return new l(t,r,e)});n[m]("refresh");return this},disable:function(){return d._invoke.call(this,"disable")},enable:function(){return d._invoke.call(this,"enable")},destroy:function(){return d._invoke.call(this,"destroy")},prev:function(t,e){return d._traverse.call(this,t,e,function(t,e,n){if(e>0){return t.push(n[e-1])}})},next:function(t,e){return d._traverse.call(this,t,e,function(t,e,n){if(e<n.length-1){return t.push(n[e+1])}})},_traverse:function(t,e,i){var o,l;if(t==null){t="vertical"}if(e==null){e=r}l=h.aggregate(e);o=[];this.each(function(){var e;e=n.inArray(this,l[t]);return i(o,e,l[t])});return this.pushStack(o)},_invoke:function(t){this.each(function(){var e;e=l.getWaypointsByElement(this);return n.each(e,function(e,n){n[t]();return true})});return this}};n.fn[g]=function(){var t,r;r=arguments[0],t=2<=arguments.length?e.call(arguments,1):[];if(d[r]){return d[r].apply(this,t)}else if(n.isFunction(r)){return d.init.apply(this,arguments)}else if(n.isPlainObject(r)){return d.init.apply(this,[null,r])}else if(!r){return n.error("jQuery Waypoints needs a callback function or handler option.")}else{return n.error("The "+r+" method does not exist in jQuery Waypoints.")}};n.fn[g].defaults={context:r,continuous:true,enabled:true,horizontal:false,offset:0,triggerOnce:false};h={refresh:function(){return n.each(c,function(t,e){return e.refresh()})},viewportHeight:function(){var t;return(t=r.innerHeight)!=null?t:i.height()},aggregate:function(t){var e,r,i;e=s;if(t){e=(i=c[n(t)[0][u]])!=null?i.waypoints:void 0}if(!e){return[]}r={horizontal:[],vertical:[]};n.each(r,function(t,i){n.each(e[t],function(t,e){return i.push(e)});i.sort(function(t,e){return t.offset-e.offset});r[t]=n.map(i,function(t){return t.element});return r[t]=n.unique(r[t])});return r},above:function(t){if(t==null){t=r}return h._filter(t,"vertical",function(t,e){return e.offset<=t.oldScroll.y})},below:function(t){if(t==null){t=r}return h._filter(t,"vertical",function(t,e){return e.offset>t.oldScroll.y})},left:function(t){if(t==null){t=r}return h._filter(t,"horizontal",function(t,e){return e.offset<=t.oldScroll.x})},right:function(t){if(t==null){t=r}return h._filter(t,"horizontal",function(t,e){return e.offset>t.oldScroll.x})},enable:function(){return h._invoke("enable")},disable:function(){return h._invoke("disable")},destroy:function(){return h._invoke("destroy")},extendFn:function(t,e){return d[t]=e},_invoke:function(t){var e;e=n.extend({},s.vertical,s.horizontal);return n.each(e,function(e,n){n[t]();return true})},_filter:function(t,e,r){var i,o;i=c[n(t)[0][u]];if(!i){return[]}o=[];n.each(i.waypoints[e],function(t,e){if(r(i,e)){return o.push(e)}});o.sort(function(t,e){return t.offset-e.offset});return n.map(o,function(t){return t.element})}};n[m]=function(){var t,n;n=arguments[0],t=2<=arguments.length?e.call(arguments,1):[];if(h[n]){return h[n].apply(null,t)}else{return h.aggregate.call(null,n)}};n[m].settings={resizeThrottle:100,scrollThrottle:30};return i.on("load.waypoints",function(){return n[m]("refresh")})})}).call(this);




// Generated by CoffeeScript 1.6.2
/*
Sticky Elements Shortcut for jQuery Waypoints - v2.0.5
Copyright (c) 2011-2014 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/jquery-waypoints/blob/master/licenses.txt
*/
(function(){(function(t,n){if(typeof define==="function"&&define.amd){return define(["jquery","waypoints"],n)}else{return n(t.jQuery)}})(window,function(t){var n,i;n={wrapper:'<div class="sticky-wrapper" />',stuckClass:"stuck",direction:"down right"};i=function(t,n){var i;t.wrap(n.wrapper);i=t.parent();return i.data("isWaypointStickyWrapper",true)};t.waypoints("extendFn","sticky",function(r){var e,a,s;a=t.extend({},t.fn.waypoint.defaults,n,r);e=i(this,a);s=a.handler;a.handler=function(n){var i,r;i=t(this).children(":first");r=a.direction.indexOf(n)!==-1;i.toggleClass(a.stuckClass,r);e.height(r?i.outerHeight():"");if(s!=null){return s.call(this,n)}};e.waypoint(a);return this.data("stuckClass",a.stuckClass)});return t.waypoints("extendFn","unsticky",function(){var t;t=this.parent();if(!t.data("isWaypointStickyWrapper")){return this}t.waypoint("destroy");this.unwrap();return this.removeClass(this.data("stuckClass"))})})}).call(this);;/**
*
*   Art Bees Boilerplate
*
*/

(function () {
	'use strict'; 

	// Root namespace: abb
	// Init in header.php

	// Main application parts
	abb.utils = {};
	abb.modules = {};
	abb.methods = {};


	// Debugging settings. 
	abb.debug = {};
	abb.debug.fastdom = false;

})();;/**
 * FastDom
 *
 * Eliminates layout thrashing
 * by batching DOM read/write
 * interactions.
 *
 * @author Wilson Page <wilsonpage@me.com>
 */

;(function(fastdom){

  'use strict';

  // Normalize rAF
  var raf = window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function(cb) { return window.setTimeout(cb, 1000 / 60); };

  /**
   * Creates a fresh
   * FastDom instance.
   *
   * @constructor
   */
  function FastDom() {
    this.frames = [];
    this.lastId = 0;

    // Placing the rAF method
    // on the instance allows
    // us to replace it with
    // a stub for testing.
    this.raf = raf;

    this.batch = {
      hash: {},
      read: [],
      write: [],
      mode: null
    };
  }

  /**
   * Adds a job to the
   * read batch and schedules
   * a new frame if need be.
   *
   * @param  {Function} fn
   * @public
   */
  FastDom.prototype.read = function(fn, ctx) {
    var job = this.add('read', fn, ctx);
    var id = job.id;

    // Add this job to the read queue
    this.batch.read.push(job.id);

    // We should *not* schedule a new frame if:
    // 1. We're 'reading'
    // 2. A frame is already scheduled
    var doesntNeedFrame = this.batch.mode === 'reading'
      || this.batch.scheduled;

    // If a frame isn't needed, return
    if (doesntNeedFrame) return id;

    // Schedule a new
    // frame, then return
    this.scheduleBatch();
    return id;
  };

  /**
   * Adds a job to the
   * write batch and schedules
   * a new frame if need be.
   *
   * @param  {Function} fn
   * @public
   */
  FastDom.prototype.write = function(fn, ctx) {
    var job = this.add('write', fn, ctx);
    var mode = this.batch.mode;
    var id = job.id;

    // Push the job id into the queue
    this.batch.write.push(job.id);

    // We should *not* schedule a new frame if:
    // 1. We are 'writing'
    // 2. We are 'reading'
    // 3. A frame is already scheduled.
    var doesntNeedFrame = mode === 'writing'
      || mode === 'reading'
      || this.batch.scheduled;

    // If a frame isn't needed, return
    if (doesntNeedFrame) return id;

    // Schedule a new
    // frame, then return
    this.scheduleBatch();
    return id;
  };

  /**
   * Defers the given job
   * by the number of frames
   * specified.
   *
   * If no frames are given
   * then the job is run in
   * the next free frame.
   *
   * @param  {Number}   frame
   * @param  {Function} fn
   * @public
   */
  FastDom.prototype.defer = function(frame, fn, ctx) {

    // Accepts two arguments
    if (typeof frame === 'function') {
      ctx = fn;
      fn = frame;
      frame = 1;
    }

    var self = this;
    var index = frame - 1;

    return this.schedule(index, function() {
      self.run({
        fn: fn,
        ctx: ctx
      });
    });
  };

  /**
   * Clears a scheduled 'read',
   * 'write' or 'defer' job.
   *
   * @param  {Number} id
   * @public
   */
  FastDom.prototype.clear = function(id) {

    // Defer jobs are cleared differently
    if (typeof id === 'function') {
      return this.clearFrame(id);
    }

    var job = this.batch.hash[id];
    if (!job) return;

    var list = this.batch[job.type];
    var index = list.indexOf(id);

    // Clear references
    delete this.batch.hash[id];
    if (~index) list.splice(index, 1);
  };

  /**
   * Clears a scheduled frame.
   *
   * @param  {Function} frame
   * @private
   */
  FastDom.prototype.clearFrame = function(frame) {
    var index = this.frames.indexOf(frame);
    if (~index) this.frames.splice(index, 1);
  };

  /**
   * Schedules a new read/write
   * batch if one isn't pending.
   *
   * @private
   */
  FastDom.prototype.scheduleBatch = function() {
    var self = this;

    // Schedule batch for next frame
    this.schedule(0, function() {
      self.batch.scheduled = false;
      self.runBatch();
    });

    // Set flag to indicate
    // a frame has been scheduled
    this.batch.scheduled = true;
  };

  /**
   * Generates a unique
   * id for a job.
   *
   * @return {Number}
   * @private
   */
  FastDom.prototype.uniqueId = function() {
    return ++this.lastId;
  };

  /**
   * Calls each job in
   * the list passed.
   *
   * If a context has been
   * stored on the function
   * then it is used, else the
   * current `this` is used.
   *
   * @param  {Array} list
   * @private
   */
  FastDom.prototype.flush = function(list) {
    var id;

    while (id = list.shift()) {
      this.run(this.batch.hash[id]);
    }
  };

  /**
   * Runs any 'read' jobs followed
   * by any 'write' jobs.
   *
   * We run this inside a try catch
   * so that if any jobs error, we
   * are able to recover and continue
   * to flush the batch until it's empty.
   *
   * @private
   */
  FastDom.prototype.runBatch = function() {
    try {

      // Set the mode to 'reading',
      // then empty all read jobs
      this.batch.mode = 'reading';
      this.flush(this.batch.read);

      // Set the mode to 'writing'
      // then empty all write jobs
      this.batch.mode = 'writing';
      this.flush(this.batch.write);

      this.batch.mode = null;

    } catch (e) {
      this.runBatch();
      throw e;
    }
  };

  /**
   * Adds a new job to
   * the given batch.
   *
   * @param {Array}   list
   * @param {Function} fn
   * @param {Object}   ctx
   * @returns {Number} id
   * @private
   */
  FastDom.prototype.add = function(type, fn, ctx) {
    var id = this.uniqueId();
    return this.batch.hash[id] = {
      id: id,
      fn: fn,
      ctx: ctx,
      type: type
    };
  };

  /**
   * Runs a given job.
   *
   * Applications using FastDom
   * have the options of setting
   * `fastdom.onError`.
   *
   * This will catch any
   * errors that may throw
   * inside callbacks, which
   * is useful as often DOM
   * nodes have been removed
   * since a job was scheduled.
   *
   * Example:
   *
   *   fastdom.onError = function(e) {
   *     // Runs when jobs error
   *   };
   *
   * @param  {Object} job
   * @private
   */
  FastDom.prototype.run = function(job){
    var ctx = job.ctx || this;
    var fn = job.fn;

    // Clear reference to the job
    delete this.batch.hash[job.id];

    // If no `onError` handler
    // has been registered, just
    // run the job normally.
    if (!this.onError) {
      return fn.call(ctx);
    }

    // If an `onError` handler
    // has been registered, catch
    // errors that throw inside
    // callbacks, and run the
    // handler instead.
    try { fn.call(ctx); } catch (e) {
      this.onError(e);
    }
  };

  /**
   * Starts a rAF loop
   * to empty the frame queue.
   *
   * @private
   */
  FastDom.prototype.loop = function() {
    var self = this;
    var raf = this.raf;

    // Don't start more than one loop
    if (this.looping) return;

    raf(function frame() {
      var fn = self.frames.shift();

      // If no more frames,
      // stop looping
      if (!self.frames.length) {
        self.looping = false;

      // Otherwise, schedule the
      // next frame
      } else {
        raf(frame);
      }

      // Run the frame.  Note that
      // this may throw an error
      // in user code, but all
      // fastdom tasks are dealt
      // with already so the code
      // will continue to iterate
      if (fn) fn();
    });

    this.looping = true;
  };

  /**
   * Adds a function to
   * a specified index
   * of the frame queue.
   *
   * @param  {Number}   index
   * @param  {Function} fn
   * @return {Function}
   * @private
   */
  FastDom.prototype.schedule = function(index, fn) {

    // Make sure this slot
    // hasn't already been
    // taken. If it has, try
    // re-scheduling for the next slot
    if (this.frames[index]) {
      return this.schedule(index + 1, fn);
    }

    // Start the rAF
    // loop to empty
    // the frame queue
    this.loop();

    // Insert this function into
    // the frames queue and return
    return this.frames[index] = fn;
  };

  // We only ever want there to be
  // one instance of FastDom in an app
  fastdom = fastdom || new FastDom();

  /**
   * Expose 'fastdom'
   */

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = fastdom;
  } else if (typeof define === 'function' && define.amd) {
    define(function(){ return fastdom; });
  } else {
    window['fastdom'] = fastdom;
  }

})(window.fastdom);
;function Events() {

    (function (fastdom) {
		abb.events = (function() {
			'use strict';

			var Public = {

			};

			

			return Public;

		})();
	})(fastdom);
}	;function Polyfills() {

	(function () {
		'use strict';

		abb.utils.polyfills = (function () {

			var Public = {
				initAll: function() {
					bindPolyfill();
					rAFPolyfill();
				}
			}

			function bindPolyfill() {
				if (!Function.prototype.bind) {
				  Function.prototype.bind = function(oThis) {
				    if (typeof this !== 'function') {
				      // closest thing possible to the ECMAScript 5
				      // internal IsCallable function
				      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
				    }

				    var aArgs   = Array.prototype.slice.call(arguments, 1),
				        fToBind = this,
				        fNOP    = function() {},
				        fBound  = function() {
				          return fToBind.apply(this instanceof fNOP && oThis
				                 ? this
				                 : oThis,
				                 aArgs.concat(Array.prototype.slice.call(arguments)));
				        };

				    fNOP.prototype = this.prototype;
				    fBound.prototype = new fNOP();

				    return fBound;
				  };
				}
			}

			function rAFPolyfill() {
			    var lastTime, vendors, x;
			    lastTime = 0;
			    vendors = ["webkit", "moz"];
			    x = 0;
			    while (x < vendors.length && !window.requestAnimationFrame) {
			      window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
			      window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"];
			      ++x;
			    }
			    if (!window.requestAnimationFrame) {
			      window.requestAnimationFrame = function(callback, element) {
			        var currTime, id, timeToCall;
			        currTime = new Date().getTime();
			        timeToCall = Math.max(0, 16 - (currTime - lastTime));
			        id = window.setTimeout(function() {
			          callback(currTime + timeToCall);
			        }, timeToCall);
			        lastTime = currTime + timeToCall;
			        return id;
			      };
			    }
			    if (!window.cancelAnimationFrame) {
			      window.cancelAnimationFrame = function(id) {
			        clearTimeout(id);
			      };
			    }
			};

			return Public.initAll();

		})();
	})();

};function Scroll() {

    (function (fastdom) {
		abb.scroll = (function() {
			'use strict';

			var Public = {
				containerOffset: containerOffset, // provide: element selector
				parallax: parallax, // provide: element selector
				Y: Y
			};

			// Private 
			var $window = $(window);

			function Y() { 
				var scroll = (window.pageYOffset !== undefined) ? window.pageYOffset : 
							 (document.documentElement || document.body.parentNode || document.body).scrollTop;
				return scroll;
			}

			//
			// containerOffset() method
			// check where container starts and ends
			// returns an object 
			//

			function containerOffset(el) {
				var $el = $(el),
					height = $el.outerHeight(),
					start = $el.offset().top,
					end = start + height;

				return {
					start: start,
					end: end
				};
			};

			//
			// parallax() method
			// produces parallax effect for given element with given factor value
			//
			
			function parallax(el, factor) {
				var $el = $(el),
					sY, currentPoint,
					parallaxFactor = factor,
					height = $el.outerHeight(),
					winH = abb.utils.viewport.y,
					start = $el.offset().top,
					end = start + height;

				var layerPosition = function() {
					fastdom.read(function() { 
						sY = Y(); 
						// console.log(sY);
						currentPoint = (start - sY) * parallaxFactor;
						if(abb.debug.fastdom) { console.log('read-parallax-1'); }
						
						// if (start >= currentPoint && end >= currentPoint) {
							fastdom.write(function() {
								$el.css({
									'-webkit-transform': 'translateY(' + -currentPoint + 'px)',
									'-moz-transform': 'translateY(' + -currentPoint + 'px)',
									'-ms-transform': 'translateY(' + -currentPoint + 'px)',
									'-o-transform': 'translateY(' + -currentPoint + 'px)',
									'transform': 'translateY(' + -currentPoint + 'px)'
								});

								if(abb.debug.fastdom) { console.log('write-parallax-1'); }
							});
						// }
					});
				};

				$window.load(layerPosition());
				$window.on('scroll resize', layerPosition);
			}

			return Public;

		})();
	})(fastdom);
}	;function Utils() {
    // Dependency ABB modules:

    // Dependency PHP modules:
    // php.json

    // Dependency JSON->DOM modules
    // Try not to keep them here.

    (function (window, navigator) {
        abb.utils = (function () {
            'use strict';

            var Public = {
                JSONLookup: JSONLookup,
                browser: browser(),
                viewport: viewport(),
                fullHeight: fullHeight
            };

            //
            // JSONLookup() method
            // Searches through our global JSON collection by element name
            // returns array of objects matched by name
            //

            function JSONLookup(name) {
                var params = [];
                for(var i = 0, jsonLength = php.json.length; i < jsonLength; i++) {
                  if(php.json[i].name == name) {
                    params.push(php.json[i]);
                  } 
                }
                return params;
            }

            function browser() {
                if(!!window.chrome && !(!!window.opera)) { return 'chrome'; } // Chrome 1+
                if(typeof InstallTrigger !== 'undefined') { return 'firefox'; } // Firefox 1.0+
                if(!!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) { return 'opera'; } // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
                if(/*@cc_on!@*/false || !!document.documentMode) { return 'ie'; } // At least IE6
                if(Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0) { return 'safari'; } // At least Safari 3+: "[object HTMLElementConstructor]"
            }

            function viewport() {
                var w = window,
                    d = document,
                    e = d.documentElement,
                    g = d.getElementsByTagName('body')[0],
                    x = w.innerWidth || e.clientWidth || g.clientWidth,
                    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

                return {
                    x: x,
                    y: y
                }
            }

            function fullHeight() {
                var height = viewport().x;

                // console.log(height);
                return height;
            }

            return Public;

        })();
    })(window, navigator);
};abb.modules.theme_header = (function() {
	'strict';

    var $window = $(window),
        $module,
        _config;

    function init(config) {
        _config = config;
        $module = $('#' + _config.id); 
    }

    function adminbarHeight() {
        if(php.hasAdminbar) {
          return ($window.width() > 782) ? 32 : 46;
        } else {
          return 0;
        }
    }

    function toolbarHeight() {
        if(_config.hasToolbar === 'true') {
            return $('.mk-header-toolbar').height();
        }
        else {
            return 0;
        }
    }

    function headerHeight() {
        if($module != undefined) {
            if($module.hasClass('sticky-style-')) return 0;
        	// if($module.hasClass('header-sticky-ready')) return parseInt(_config.stickyHeight);
        	// return parseInt(_config.height);
            return parseInt(_config.stickyHeight);
        }
        else {
        	return 0;
        }
    }

    function totalHeight() {
        return adminbarHeight() + headerHeight();
    }

    return {
        init: init,
    	totalHeight: totalHeight,
        adminHeight: adminbarHeight
    };
})();;function ModulePageSection() {
	// Dependency ABB modules:
	// abb.utils

	// Dependency JSON->DOM modules
	// 'page_section'

	// Dependency libraries
	// jQuery

	(function ($) {
		'use strict';

		abb.modules.page_section = (function() {

			var Public = {};

	        var pageSection = abb.utils.JSONLookup('page_section');

	        function manipulateDOM() {
			    setTimeout(function() {
		        	if (pageSection.length) {
			        	for (var i = 0, x = pageSection.length; i < x; i++) {
			        		var params = pageSection[i].params,
			        			id = params.id;

			        		//
				        	// Checks for params and trigger methods 
				        	//

			        		if (params.hasBgLayer && params.bgAttachment === 'fixed' && abb.utils.browser === 'chrome') {
				        		var height = abb.utils.viewport.y;

				        		var setStyles = function() {
					        		$('#' + id + ' .background-layer').css({ 
					        			'background-attachment': 'scroll',
					        			'height': height + 'px'
					        		});
					        	}

					        	// setStyles();
				        		// abb.scroll.parallax('#' + id + ' .background-layer', 1);
				        		
				        	}
			        	}
			        }
		        }, 100);
	        }        

	        return manipulateDOM();

		})();
	})(jQuery); 
}
;/**
*
*   Art Bees Boilerplate
*
*/

(function ($) {
	'use strict'; 

	abb.smoothScrollTo = function(offsetTop, duration) {
		$('html, body').stop().animate({
	      scrollTop: offsetTop
	    }, {
	      duration: duration,
	      easing: "easeInOutExpo"
	    });
	};



	abb.skipToNext = function() {
		var Public = {
			init: init
		}

		function init() {
			$('.abb-skip-to-next').each(function() {
				$(this).on('click', function() {
					var $this = $(this),
						$parent = $this.parent(),
						headerHeight = (($(window).width() > mk_responsive_nav_width) && $('#mk-header').attr('data-sticky-style') !== 'lazy') ? abb.modules.theme_header.totalHeight() : abb.modules.theme_header.adminHeight(),
						offsetTop = ($parent.offset().top + $parent.outerHeight() - headerHeight);

					abb.smoothScrollTo(offsetTop, 1200);
				});
			});
		}

		return Public;
	};



	abb.init = function() {
		$(window).load(function() {
			Utils();
			Events();
			Polyfills();
			Scroll();
			
			ModulePageSection();

			// Trigger refactored functions on load and in quee. Handle that later with RequireJS dependencies and provide mechanism to call all function within single load event 
			abb.skipToNext().init();
		});
	}

})(jQuery);;// //////////////////////////////////////////////////////
// 
//  Helpers
// 
// ///////////////////////////////////////////////////

function is_touch_device() {
    return ('ontouchstart' in document.documentElement);
}
jQuery.exists = function(selector) {
    return ($(selector).length > 0);
};

var isMobile = {
    Android: function() {
        var check;
        if (navigator.userAgent.match(/Android/i)) check = true;
        return check;
    },
    BlackBerry: function() {
        var check;
        if (navigator.userAgent.match(/BlackBerry/i)) check = true;
        return check;
    },
    iOS: function() {
        var check;
        if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) check = true;
        return check;
    },
    Opera: function() {
        var check;
        if (navigator.userAgent.match(/Opera Mini/i)) check = true;
        return check;
    },
    Windows: function() {
        var check;
        if (navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i)) check = true;
        return check;
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};


var BrowserDetect = {
        init: function () {
            this.browser = this.searchString(this.dataBrowser) || "Other";
            this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "Unknown";
        },
        searchString: function (data) {
            for (var i = 0; i < data.length; i++) {
                var dataString = data[i].string;
                this.versionSearchString = data[i].subString;

                if (dataString.indexOf(data[i].subString) !== -1) {
                    return data[i].identity;
                }
            }
        },
        searchVersion: function (dataString) {
            var index = dataString.indexOf(this.versionSearchString);
            if (index === -1) {
                return;
            }

            var rv = dataString.indexOf("rv:");
            if (this.versionSearchString === "Trident" && rv !== -1) {
                return parseFloat(dataString.substring(rv + 3));
            } else {
                return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
            }
        },

        dataBrowser: [
            {string: navigator.userAgent, subString: "Chrome", identity: "Chrome"},
            {string: navigator.userAgent, subString: "MSIE", identity: "IE"},
            {string: navigator.userAgent, subString: "Trident", identity: "IE"},
            {string: navigator.userAgent, subString: "Firefox", identity: "Firefox"},
            {string: navigator.userAgent, subString: "Safari", identity: "Safari"},
            {string: navigator.userAgent, subString: "Opera", identity: "Opera"}
        ]
};

BrowserDetect.init();
$('html').addClass(BrowserDetect.browser).addClass(BrowserDetect.browser + BrowserDetect.version);


//////////////////////////////////////////////////////////////////////////
//
//   Defining global variables for cross app use
//
//////////////////////////////////////////////////////////////////////////

var scrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop, // Updated in global event handler
    global_window_width = $(window).width(),
    global_window_height = $(window).height(),
    global_admin_bar,
    global_admin_bar_height = 0;


$(window).load(function() {
    if ($.exists("#wpadminbar")) {
        global_admin_bar = $("#wpadminbar");
        global_admin_bar_height = global_admin_bar.height();
    }
});

function mk_update_globals() {
    global_window_width = $(window).width();
    global_window_height = $(window).height();
}

window.scroll = function() {
    scrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
}

//////////////////////////////////////////////////////////////////////////
//
//   Global scroll handler
//
//////////////////////////////////////////////////////////////////////////


var animationThrottle = function(toThrottle, wait) {
    var lastTick = Date.now(),
        endTimeout = null;

    return function run() {
        if (Date.now() - lastTick > wait) {
            lastTick = Date.now();
            clearTimeout(endTimeout);
            window.requestAnimationFrame(toThrottle);
        } else {
            clearTimeout(endTimeout);
            endTimeout = setTimeout(run, wait);
        }
    };
};

// rAF 
var scrollAnimations = {
    sets: [],

    init: function() {
        this.update();
        this.attachEvents();
        // console.table(this.sets);
    },

    attachEvents: function() {
        window.addEventListener('scroll', animationThrottle(
            this.play.bind(this), 0
        ));
    },

    add: function(handler) {
        this.sets.push(handler);
    },

    play: function() {
        this.update();
        this.sets.forEach(function(animationSet) {
            animationSet(scrollY);
        }.bind(this));
    },

    update: function() {
        scrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    },

};
scrollAnimations.init();

// Throttled 200 ms
var debouncedScrollAnimations = {
    sets: [],

    init: function() {
        this.attachEvents();
    },

    attachEvents: function() {
        window.addEventListener('scroll', animationThrottle(
            this.play.bind(this), 200
        ));
    },

    add: function(handler) {
        this.sets.push(handler);
    },

    play: function() {
        this.sets.forEach(function(animationSet) {
            animationSet(scrollY);
        }.bind(this));
    },
};
debouncedScrollAnimations.init();


//////////////////////////////////////////////////////////////////////////
//
//   Init all scripts
//
//////////////////////////////////////////////////////////////////////////

$(document).ready(function() {
    mk_animated_contents();
    mk_lightbox_init();
    mk_login_form();
    mk_backgrounds_parallax();
    mk_flexslider_init();
    mk_event_countdown();
    mk_skill_meter();
    mk_charts();
    mk_milestone();
    mk_ajax_search();
    mk_hover_events();
    mk_portfolio_ajax();
    mk_love_post();
    product_loop_add_cart();
    mk_social_share();
    mk_section_intro_effects();
    mk_newspaper_comments_share();
    mk_responsive_fix();
    mk_portfolio_widget();
    mk_contact_form();
    mk_blog_carousel();
    mk_responsive_nav();
    mk_header_searchform();
    mk_click_events();
    mk_theme_toggle_box();
    mk_text_typer();
    mk_tab_slider();
    mk_one_page_scroller();
    mk_one_pager_resposnive();
    mk_sidebar_navigation();
    mk_clients_mobile();

    $(window).load(function() {
        mk_smooth_scroll_events();
        mk_swipe_slider();
        mk_load_isotop_enabled_scripts();
        mk_unfold_footer();
        mk_blur_boxes();
        shop_isotop_init();
        mk_tabs();
        mk_accordion_toggles_tooltip();
        section_to_full_height();
        mk_page_title_parallax();
        mk_header_scripts();
        mk_parallax();
        mk_gallery();
        mk_edge_fullpage_pagination();
        mk_theatre_responsive_calculator();
        mk_mobile_tablet_responsive_calculator();
        mk_tabs_responsive();
        mk_start_tour_resize();
        mk_header_social_resize();
        mk_page_section_social_video_bg();
        loop_audio_init();
        mk_animated_cols();
        mk_edge_slider();
        mk_edge_parallax();
        mk_google_maps();
        mk_main_nav_scroll();
        mk_flipbox();
    });


    $(window).on("debouncedresize", function() {
        mk_responsive_fix();
        mk_page_title_parallax();
        mk_section_intro_effects();
        mk_theatre_responsive_calculator();
        mk_mobile_tablet_responsive_calculator();
        mk_tabs_responsive();
        mk_accordion_toggles_tooltip();
        mk_start_tour_resize();
        mk_header_social_resize();
        section_to_full_height();
        hide_res_menu();

        setTimeout(function() {
            mk_one_pager_resposnive();
            mk_header_scripts();
            mk_unfold_footer();
            mk_main_nav_scroll();
        }, 300);

    });

    new ChopScroll(function() {
        mk_skill_meter();
        mk_charts();
        mk_milestone();
    }, 200);

    //  if (is_touch_device() || $(window).width() < 780) {
    if (is_touch_device()) {
        $('body').addClass('no-transform');
        $('.mk-animate-element').removeClass('mk-animate-element');
    } else {
        choppedjs.onResize(mk_animated_contents, 2000);
        choppedjs.onScroll(mk_animated_contents, 700);
    }

});

/* Typer */
/* -------------------------------------------------------------------- */
function mk_text_typer() {

    "use strict";

    $('[data-typer-targets]').each(function() {
        var $this = $(this),
            $first_string = [$this.text()],
            $rest_strings = $this.attr('data-typer-targets').split(','),
            $strings = $first_string.concat($rest_strings);

        $this.text('');

        $this.typed({
            strings: $strings,
            typeSpeed: 30, // typing speed
            backDelay: 1200, // pause before backspacing
            loop: true, // loop on or off (true or false)
            loopCount: false, // number of loops, false = infinite
        });
    });
}



/* Tab Slider */
/* -------------------------------------------------------------------- */

function mk_tab_slider() {

    "use strict";

    $('.mk-tab-slider').each(function() {

        var $this = $(this),
            id = $this.data('id'),
            $autoplayTime = $this.data('autoplay');

        var mk_tab_slider = $(this).swiper({
            wrapperClass: 'mk-tab-slider-wrapper',
            slideClass: 'mk-tab-slider-item',
            calculateHeight: true,
            speed: 500,
            autoplay: $autoplayTime,
            onSlideChangeStart: function() {
                $('.mk-tab-slider-nav[data-id="' + id + '"]').find(".active").removeClass('active')
                $('.mk-tab-slider-nav[data-id="' + id + '"]').find("a").eq(mk_tab_slider.activeIndex).addClass('active')
            }
        });

        $('.mk-tab-slider-nav[data-id="' + id + '"]').find("a").first().addClass('active');

        $('.mk-tab-slider-nav[data-id="' + id + '"]').find("a").on('touchstart mousedown', function(e) {
            e.preventDefault()
            $('.mk-tab-slider-nav[data-id="' + id + '"]').find(".active").removeClass('active')
            $(this).addClass('active')
            mk_tab_slider.swipeTo($(this).index())
        });

        $('.mk-tab-slider-nav[data-id="' + id + '"]').find("a").click(function(e) {
            e.preventDefault()
        });

    });

}



/* Edge One Pager */
/* -------------------------------------------------------------------- */
function mk_one_page_scroller() {

    "use strict";

    $('.mk-edge-one-pager').each(function() {

        var $this = $(this),
            $tooltip_txt = [];

        $this.find('.section').each(function() {
            $tooltip_txt.push($(this).attr('data-title'));
        });

        var scrollable = true;
        $this.find('.section').each(function() {
            var $section = $(this),
                $content = $section.find('.edge-slide-content'),
                sectionHeight = $section.height(),
                contentHeight = $content.innerHeight();

            if((contentHeight + 30) > global_window_height) {
                scrollable = false;
            }
        });

        if(!scrollable){
            $this.find('.section').each(function() {
                var $section = $(this);
                $section.addClass('active').css({
                    'padding-bottom': '50px'
                });
            });
        }

        if(scrollable) {
            $this.fullpage({
                verticalCentered: false,
                resize: true,
                slidesColor: ['#ccc', '#fff'],
                anchors: $tooltip_txt,
                scrollingSpeed: 600,
                easing: 'easeInQuart',
                menu: false,
                navigation: true,
                navigationPosition: 'right',
                navigationTooltips: false,
                slidesNavigation: true,
                slidesNavPosition: 'bottom',
                loopBottom: false,
                loopTop: false,
                loopHorizontal: true,
                autoScrolling: true,
                scrollOverflow: false,
                css3: true,
                paddingTop: 0,
                paddingBottom: 0,
                normalScrollElements: '#mk-header, #mk-responsive-wrap',
                normalScrollElementTouchThreshold: 5,
                keyboardScrolling: true,
                touchSensitivity: 15,
                continuousVertical: false,
                animateAnchor: true,

                onLeave: function(index, nextIndex, direction) {

                    $('#mk-header.transparent-header').removeClass('light-header-skin dark-header-skin').addClass($this.find('.one-pager-slide').eq(nextIndex - 1).attr('data-header-skin') + '-header-skin');
                    $('#fullPage-nav').removeClass('light-skin dark-skin').addClass($this.find('.one-pager-slide').eq(nextIndex - 1).attr('data-header-skin') + '-skin');

                },
                afterRender: function() {
                    // $(body).addClass('')
                    setTimeout(function() {
                        $('#mk-header.transparent-header').removeClass('light-header-skin dark-header-skin').addClass($this.find('.one-pager-slide').eq(0).attr('data-header-skin') + '-header-skin');
                        $('#fullPage-nav').removeClass('light-skin dark-skin').addClass($this.find('.one-pager-slide').eq(0).attr('data-header-skin') + '-skin');
                    }, 300);

                },
            });
        }
        // var eventtype = mobilecheck() ? 'touchstart' : 'click';
        // $('.mk-nav-responsive-link').on(eventtype, function() {
        //     if ($('body').hasClass('mk-opened-nav')) {
        //         $.fn.fullpage.setAutoScrolling(false);
        //         $('body, html').css({
        //             'overflow': 'hidden'
        //         });
        //     } else {
        //         $.fn.fullpage.setAutoScrolling(true);
        //     }
        // });
    });

}


function mk_one_pager_resposnive() {

    "use strict";

    $('.mk-edge-one-pager').each(function() {
        var $this = $(this),
            $header_height = 0;

        var $window_height = $(window).outerHeight();

        if ($(window).width() <= mk_responsive_nav_width) {
            $header_height = $('#mk-header').data('height');
        }

        $this.find('.one-pager-slide').each(function() {


            var $this = $(this),
                $content = $this.find('.edge-slide-content');

            if ($this.hasClass('left_center') || $this.hasClass('center_center') || $this.hasClass('right_center')) {

                var $this_height_half = $content.outerHeight() / 2,
                    $window_half = $window_height / 2;
                    $distance_from_top =  ($window_half - $this_height_half),
                    $distance_from_top = ($distance_from_top < 50) ? 50 + ($header_height / 2) : $distance_from_top + ($header_height / 2);

                $content.css('marginTop', $distance_from_top);
                $content.css('marginBottom', $distance_from_top);
            }

            if ($this.hasClass('left_bottom') || $this.hasClass('center_bottom') || $this.hasClass('right_bottom')) {

                var $distance_from_top = $window_height - $content.outerHeight() - 90;

                $content.css('marginTop', ($distance_from_top));
            }

        });
    });

}

/* Gets IE version */
/* -------------------------------------------------------------------- */

function mk_detect_ie() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    var trident = ua.indexOf('Trident/');
    if (msie > 0) {
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }
    if (trident > 0) {
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }
    return false;
}



/* Greensock wrapper for animation scroll */
/* -------------------------------------------------------------------- */

function tweenScroll(startPoint, endPoint, tweenName, endFix) {
    progressVal = (1 / (endPoint - startPoint) * (scrollY - startPoint));

    if (progressVal >= 0 && progressVal <= 1) {
        tweenName.progress(progressVal * endFix);
        // TweenLite.to(tweenName, 0, {progress:progressVal * endFix, ease:Linear.easeNone}); // also cool with ease:Strong.easeOut
        TweenLite.set(tweenName, {
            progress: progressVal * endFix
        });
        // console.log(progressVal);
    }

}

/* Image Gallery */
/* -------------------------------------------------------------------- */

function mk_gallery() {

    "use strict";

    $('.mk-gallery-shortcode .mk-gallery-item.hover-overlay_layer .item-holder').each(function() {
        var itemHolder = $(this),
            galleryDesc = itemHolder.find('.gallery-desc');

        function updatePosition() {
            var parentHeight = itemHolder.outerHeight(),
                contentHeight = galleryDesc.innerHeight();

            var paddingVal = (parentHeight - contentHeight) / 2;
            galleryDesc.css({
                'top': paddingVal,
                // 'padding-bottom': paddingVal
            });

            // console.log(parentHeight);
            // console.log(contentHeight);


        }
        updatePosition();

        $(window).on('debouncedresize', function() {
            setTimeout(function() {
                updatePosition();
            }, 1000);
        });
    });
}


/* Page Title Box */
/* -------------------------------------------------------------------- */


function mk_page_title_parallax() {

    "use strict";

    if (!is_touch_device()) {
        $('.mk-effect-wrapper').each(function() {

            var progressVal,
                currentPoint,
                ticking = false,
                scrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop,
                $this = $(this),
                $window = $(window),
                windowHeight = $(window).height(),
                parentHeight = $this.outerHeight(),
                startPoint = 0,
                endPoint = $this.offset().top + parentHeight,
                effectLayer = $this.find('.mk-effect-bg-layer'),
                gradientLayer = effectLayer.find('.mk-effect-gradient-layer'),
                cntLayer = $this.find('.mk-page-title-box-content'),
                animation = effectLayer.attr('data-effect'),
                top = $this.offset().top,
                height = $this.outerHeight();

            var parallaxSpeed = .7,
                zoomFactor = 1.3;

            var parallaxTopGap = function() {
                var gap = top * parallaxSpeed;

                effectLayer.css({
                    height : height + gap + 'px',
                    top : (-gap) + 'px'
                });
            }


            if (animation == ("parallax" || "parallaxZoomOut") ) {
                parallaxTopGap();
            };



            var animationSet = function() {
                scrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

                if (animation == "parallax") {
                    currentPoint = (startPoint + scrollY) * parallaxSpeed;
                    effectLayer.css({
                        'transform': 'translateY(' + currentPoint + 'px)'
                    });
                }

                if (animation == "parallaxZoomOut") {
                    currentPoint = (startPoint + scrollY) * parallaxSpeed;
                    progressVal = (1 / (endPoint - startPoint) * (scrollY - startPoint));
                    var zoomCalc = zoomFactor - ((zoomFactor - 1) * progressVal);

                    effectLayer.css({
                        'transform': 'translateY(' + currentPoint + 'px), scale(' + zoomCalc + ')'
                    });
                }

                if (animation == "gradient") {
                    progressVal = (1 / (endPoint - startPoint) * (scrollY - startPoint));
                    gradientLayer.css({
                        opacity: progressVal * 2
                    });
                }

                if (animation != "gradient") {
                    progressVal = (1 / (endPoint - startPoint) * (scrollY - startPoint));
                    cntLayer.css({
                        opacity: 1 - (progressVal * 4)
                    });
                }

                // Stop ticking
                ticking = false;
            }
            animationSet();

            // This will limit the calculation of the background position to
            // 60fps as well as blocking it from running multiple times at once
            var requestTick = function() {
                if (!ticking) {
                    requestAnimationFrame(animationSet);
                    ticking = true;
                }
            };


            // RequestAnimationFrame polyfill for older browsers
            var rafPolyfill = function() {
                var lastTime = 0;
                var vendors = ['ms', 'moz', 'webkit', 'o'];
                for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
                }
                if (!window.requestAnimationFrame)
                    window.requestAnimationFrame = function(callback, element) {
                        var currTime = new Date().getTime();
                        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                        var id = window.setTimeout(function() {
                                callback(currTime + timeToCall);
                            },
                            timeToCall);
                        lastTime = currTime + timeToCall;
                        return id;
                    };
                if (!window.cancelAnimationFrame)
                    window.cancelAnimationFrame = function(id) {
                        clearTimeout(id);
                    };
            };
            rafPolyfill();

            $window.on('scroll', requestTick);

        });
    }
}



/* Adds pagination style in fullpage Edge Slider */
/* -------------------------------------------------------------------- */
function mk_edge_fullpage_pagination() {

    "use strict";

    var style = $('#fullpage').attr('data-pagination');
    // console.log(style);
    $('#fullPage-nav').addClass('pagination-' + style);
}



/* Clients Shortcode mobile fix */
/* -------------------------------------------------------------------- */
function mk_clients_mobile() {

    "use strict";

    $('.mk-clients-shortcode.column-style').each(function() {
        var group = $(this),
            list = group.find('li'),
            listStyle = group.find('ul').attr('style'),
            fullRowColumns = group.find('ul:first-of-type li').length,

            viewport = $(window),
            viewportWidth = viewport.innerWidth(),
            breakPoint1 = 960 - 25,
            breakPoint2 = 767 - 25,
            breakPoint3 = 550 - 25;

        function recreateGrid() {
            if (viewportWidth > breakPoint1) {
                list.unwrap();
                for (var i = 0; i < list.length; i += fullRowColumns) {
                    list.slice(i, i + fullRowColumns)
                        .wrapAll('<ul style="' + listStyle + '"></ul>');
                }
            } else if (viewportWidth < breakPoint3) {
                list.unwrap();
                for (var i = 0; i < list.length; i += 1) {
                    list.slice(i, i + 1).wrapAll('<ul class="mk-clients-fixed-list" style="' + listStyle + '"></ul>');
                }
            } else if (viewportWidth < breakPoint2) {
                list.unwrap();
                for (var i = 0; i < list.length; i += 2) {
                    list.slice(i, i + 2).wrapAll('<ul class="mk-clients-fixed-list" style="' + listStyle + '"></ul>');
                }
            } else if (viewportWidth < breakPoint1) {
                list.unwrap();
                for (var i = 0; i < list.length; i += 3) {
                    list.slice(i, i + 3).wrapAll('<ul class="mk-clients-fixed-list" style="' + listStyle + '"></ul>');
                }
            }
        }
        recreateGrid();

        $(window).on('debouncedresize', function() {
            viewportWidth = viewport.innerWidth();
            recreateGrid();
        });

    });
}



/* Theatre Slider Responsive Calculator */
/* -------------------------------------------------------------------- */

function mk_theatre_responsive_calculator() {
    var $laptopContainer = $(".laptop-theatre-slider");
    var $computerContainer = $(".computer-theatre-slider");
    $laptopContainer.each(function() {
        var $this = $(this),
            $window = $(window),
            $windowWidth = $window.outerWidth(),
            $windowHeight = $window.outerHeight(),
            $width = $this.outerWidth(),
            $height = $this.outerHeight(),
            $paddingTop = 38,
            $paddingRight = 143,
            $paddingBottom = 78,
            $paddingLeft = 143;

        var $player = $this.find('.player-container');

        if ($windowWidth > $width) {
            $player.css({
                'padding-left': parseInt(($width * $paddingLeft) / 1200),
                'padding-right': parseInt(($width * $paddingRight) / 1200),
                'padding-top': parseInt(($height * $paddingTop) / 690),
                'padding-bottom': parseInt(($height * $paddingBottom) / 690),
            });
        }

    });

    $computerContainer.each(function() {
        var $this = $(this),
            $window = $(window),
            $windowWidth = $window.outerWidth(),
            $windowHeight = $window.outerHeight(),
            $width = $this.outerWidth(),
            $height = $this.outerHeight(),
            $paddingTop = 60,
            $paddingRight = 52,
            $paddingBottom = 290,
            $paddingLeft = 49;

        var $player = $this.find('.player-container');

        if ($windowWidth > $width) {
            $player.css({
                'padding-left': parseInt(($width * $paddingLeft) / 1200),
                'padding-right': parseInt(($width * $paddingRight) / 1200),
                'padding-top': parseInt(($height * $paddingTop) / 969),
                'padding-bottom': parseInt(($height * $paddingBottom) / 969),
            });
        }

    });

}

/* Mobile and Tablet Slideshow Responsive Calculator */
/* -------------------------------------------------------------------- */
function mk_mobile_tablet_responsive_calculator() {
    var $laptopSlideshow = $(".mk-laptop-slideshow-shortcode");
    var $lcdSlideshow = $(".mk-lcd-slideshow");

    if ($.exists(".mk-laptop-slideshow-shortcode")) {
        $laptopSlideshow.each(function() {
            var $this = $(this),
                $window = $(window),
                $windowWidth = $window.outerWidth(),
                $windowHeight = $window.outerHeight(),
                $width = $this.outerWidth(),
                $height = $this.outerHeight(),
                $paddingTop = 28,
                $paddingRight = 102,
                $paddingBottom = 52,
                $paddingLeft = 102;

            var $player = $this.find(".slideshow-container");

            $player.css({
                "padding-left": parseInt(($width * $paddingLeft) / 836),
                "padding-right": parseInt(($width * $paddingRight) / 836),
                "padding-top": parseInt(($height * $paddingTop) / 481),
                "padding-bottom": parseInt(($height * $paddingBottom) / 481),
            });

        });
    }

    if ($.exists(".mk-lcd-slideshow")) {
        $lcdSlideshow.each(function() {
            var $this = $(this),
                $window = $(window),
                $windowWidth = $window.outerWidth(),
                $windowHeight = $window.outerHeight(),
                $width = $this.outerWidth(),
                $height = $this.outerHeight(),
                $paddingTop = 35,
                $paddingRight = 39,
                $paddingBottom = 213,
                $paddingLeft = 36;

            var $player = $this.find(".slideshow-container");
            $player.css({
                "padding-left": parseInt(($width * $paddingLeft) / 886),
                "padding-right": parseInt(($width * $paddingRight) / 886),
                "padding-top": parseInt(($height * $paddingTop) / 713),
                "padding-bottom": parseInt(($height * $paddingBottom) / 713),
            });
        });
    }
}


/* Start a tour resize function */
/* -------------------------------------------------------------------- */
function mk_start_tour_resize() {

    $('.mk-header-start-tour').each(function() {

        var $windowWidth = $(document).width(),
            $this = $(this),
            $linkWidth = $this.width() + 15,
            $padding = ($windowWidth - mk_responsive_nav_width) / 2;



        function updateStartTour(){
            if($windowWidth < mk_responsive_nav_width){
                $this.removeClass('hidden');
                $this.addClass('show');
            }else{
                if($padding < $linkWidth){
                    $this.removeClass('show');
                    $this.addClass('hidden'); 
                }else{
                    $this.removeClass('hidden');
                    $this.addClass('show');  
                }
            }
        }

        setTimeout(function() {
            updateStartTour();
        }, 300);
    });
}

/* Header social resize function */
/* -------------------------------------------------------------------- */
function mk_header_social_resize() {

    $('#mk-header-social.header-section').each(function() {

        var $windowWidth = $(document).width(),
            $this = $(this),
            $linkWidth = $this.width() + 15,
            $padding = ($windowWidth - mk_responsive_nav_width) / 2;



        function updateStartTour(){
            if($windowWidth < mk_responsive_nav_width){
                $this.removeClass('hidden');
                $this.addClass('show');
            }else{
                if($padding < $linkWidth){
                    $this.removeClass('show');
                    $this.addClass('hidden'); 
                }else{
                    $this.removeClass('hidden');
                    $this.addClass('show');  
                }
            }
        }

        setTimeout(function() {
            updateStartTour();
        }, 300);
    });
}

/* Page Section Socail Video Player Controls */
/* -------------------------------------------------------------------- */

function mk_page_section_social_video_bg() {
    $(".mk-page-section.social-hosted").each(function() {
        var $container = $(this),
            $source = $container.data('source'),
            player;
 
        if ($source == 'youtube') {
            var youtube = $container.find('iframe')[0];
            player = new YT.Player(youtube);
            setTimeout(function() { 
                player.playVideo();
                player.mute();
            }, 1000); 
        }
        if ($source == 'vimeo') {
            var vimeo = $container.find('iframe')[0];
            player = $f(vimeo);
            setTimeout(function() { 
                player.api('play');
                player.api('setVolume', 0);
            }, 1000);
        }

    });
}

// Pre RequireJS hot bug fixing

function videoLoadState() {
    $('.mk-section-video video').each(function() {
        var mkVideo = this;

        this.onload = fire();

        function fire() {
            setTimeout(function() {
                $(mkVideo).animate({
                    'opacity': 1
                }, 300);
            }, 1000);
        }
    });
}
videoLoadState();

function mk_animated_cols() {
    function equalheight (container){
        var currentTallest = 0,
             currentRowStart = 0,
             rowDivs = new Array(),
             $el,
             topPosition = 0;
         $(container).each(function() {

           $el = $(this);
           $($el).height('auto')
           topPosition = $el.position().top;

           if (currentRowStart != topPosition) {
             for (var currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
               rowDivs[currentDiv].height(currentTallest);
             }
             rowDivs.length = 0; // empty the array
             currentRowStart = topPosition;
             currentTallest = $el.height();
             rowDivs.push($el);
           } else {
             rowDivs.push($el);
             currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
          }
           for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
             rowDivs[currentDiv].height(currentTallest);
           }

         });
        
        // console.log('recalc' + container + ' ' + currentTallest);

        return currentTallest;
    }


    function prepareCols(el) {
        var $this = el.parent().parent().find('.mk-animated-columns');

        var iconHeight  = equalheight('.vc_row .animated-column-icon'),
            titleHeight = equalheight('.vc_row .animated-column-title'),
            descHeight  = equalheight('.vc_row .animated-column-desc'),
            btnHeight   = $this.find('.animated-column-btn').innerHeight();

        // console.log('iconHeight: ' + iconHeight + ' / ' + $this.find('.animated-column-icon').innerHeight());
        // console.log('titleHeight: ' + titleHeight + ' / ' + $this.find('.animated-column-title').innerHeight());
        // console.log('descHeight: ' + descHeight + ' / ' + $this.find('.animated-column-desc').innerHeight());
        // console.log('btnHeight: ' + btnHeight);

        if ($this.hasClass('full-style')) {
            $this.find('.animated-column-item').each(function() {
                var $this = $(this),
                    contentHeight = (iconHeight + 30) + (titleHeight + 10) + (descHeight + 70) + 34;

                $this.height(contentHeight * 1.5 + 50);

                var $box_height = $this.outerHeight(true),
                    $icon_height = $this.find('.animated-column-icon').height();

                $this.find('.animated-column-holder').css({
                    'paddingTop': $box_height / 2 - $icon_height
                });


                $this.animate({opacity:1}, 300);
            });
        } else {
            $this.find('.animated-column-item').each(function() {
                var $this = $(this),
                    $half_box_height = $this.outerHeight(true) / 2,
                    $icon_height = $this.find('.animated-column-icon').outerHeight(true)/2,
                    $title_height = $this.find('.animated-column-simple-title').outerHeight(true)/2;

                $this.find('.animated-column-holder').css({
                    'paddingTop': $half_box_height - $icon_height
                });
                $this.find('.animated-column-title').css({
                    'paddingTop': $half_box_height - $title_height + ($icon_height * 2)
                });

                $this.animate({opacity:1}, 300);

            });
        }
    }

    $('.mk-animated-columns').each(function() {
        var $this = $(this),
            $parent = $this.parent().parent(),
            $columns = $parent.find('.column_container'),
            index = $columns.index($this.parent());
            // really bad that we cannot read it before bootstrap - needs full shortcode refactor

        if($this.hasClass('full-style')) {
            $this.find('.animated-column-item').hover(
            function() {
                TweenLite.to($(this).find(".animated-column-holder"), 0.5, {
                    top: '-15%',
                    ease: Back.easeOut
                });
                TweenLite.to($(this).find(".animated-column-desc"), 0.5, {
                    top: '50%',
                    ease: Expo.easeOut
                }, 0.4);
                TweenLite.to($(this).find(".animated-column-btn"), 0.3, {
                    top: '50%',
                    ease: Expo.easeOut
                }, 0.6);
            },
            function() {

                TweenLite.to($(this).find(".animated-column-holder"), 0.5, {
                    top: '0%',
                    ease: Back.easeOut, easeParams:[3]
                });
                TweenLite.to($(this).find(".animated-column-desc"), 0.5, {
                    top: '100%',
                    ease: Back.easeOut
                }, 0.4);
                TweenLite.to($(this).find(".animated-column-btn"), 0.5, {
                    top: '100%',
                    ease: Back.easeOut
                }, 0.2);
            });
        }

        if($this.hasClass('simple-style')) {
            $this.find('.animated-column-item').hover(
            function() {
                TweenLite.to($(this).find(".animated-column-holder"), 0.7, {
                    top: '100%',
                    ease: Expo.easeOut
                });
                TweenLite.to($(this).find(".animated-column-title"), 0.7, {
                    top: '0%',
                    ease: Back.easeOut
                }, 0.2);
            },
            function() {
                TweenLite.to($(this).find(".animated-column-holder"), 0.7, {
                    top: '0%',
                    ease: Expo.easeOut
                });
                TweenLite.to($(this).find(".animated-column-title"), 0.7, {
                    top: '-100%',
                    ease: Back.easeOut
                }, 0.2);
            });
        };

        if($columns.length === index + 1) {
            prepareCols($this);
            $(window).on("resize", function() {
                    setTimeout(prepareCols($this), 1000);
            });
        }

    });
}

function mk_google_maps() {

    $('.mk-advanced-gmaps').each(function() {
            var $this = $(this),
              $id = $this.attr('id'),
              $zoom = parseInt($this.attr('data-zoom')),
              $latitude = $this.attr('data-latitude'),
              $longitude = $this.attr('data-longitude'),
              $address = $this.attr('data-address'),
              $latitude_2 = $this.attr('data-latitude2'),
              $longitude_2 = $this.attr('data-longitude2'),
              $address_2 = $this.attr('data-address2'),
              $latitude_3 = $this.attr('data-latitude3'),
              $longitude_3 = $this.attr('data-longitude3'),
              $address_3 = $this.attr('data-address3'),
              $map_type = $this.attr('data-map-type'),
              $pin_icon = $this.attr('data-pin-icon'),
              $pan_control = $this.attr('data-pan-control') === "true" ? true : false,
              $map_type_control = $this.attr('data-map-type-control') === "true" ? true : false,
              $scale_control = $this.attr('data-scale-control') === "true" ? true : false,
              $draggable = $this.attr('data-draggable') === "true" ? true : false,
              $zoom_control = $this.attr('data-zoom-control') === "true" ? true : false,
              $modify_coloring = $this.attr('data-modify-coloring') === "true" ? true : false,
              $saturation = $this.attr('data-saturation'),
              $hue = $this.attr('data-hue'),
              $lightness = $this.attr('data-lightness'),
              $styles;


            if ($modify_coloring == true) {
              var $styles = [{
                stylers: [{
                  hue: $hue
                }, {
                  saturation: $saturation
                }, {
                  lightness: $lightness
                }, {
                  featureType: "landscape.man_made",
                  stylers: [{
                    visibility: "on"
                  }]
                }]
              }];
            }

            

            var map;

            function initialize() {


              var bounds = new google.maps.LatLngBounds();



              var mapOptions = {
                zoom: $zoom,
                panControl: $pan_control,
                zoomControl: $zoom_control,
                mapTypeControl: $map_type_control,
                scaleControl: $scale_control,
                draggable: $draggable,
                scrollwheel: false,
                mapTypeId: google.maps.MapTypeId[$map_type],
                styles: $styles
              };

              map = new google.maps.Map(document.getElementById($id), mapOptions);
              map.setTilt(45);

              // Multiple Markers

              var markers = [];
              var infoWindowContent = [];

              if ($latitude != '' && $longitude != '') {
                markers[0] = [$address, $latitude, $longitude];
                infoWindowContent[0] = [$address];
              }

              if ($latitude_2 != '' && $longitude_2 != '') {
                markers[1] = [$address_2, $latitude_2, $longitude_2];
                infoWindowContent[1] = [$address_2];
              }

              if ($latitude_3 != '' && $longitude_3 != '') {
                markers[2] = [$address_3, $latitude_3, $longitude_3];
                infoWindowContent[2] = [$address_3];
              }


              var infoWindow = new google.maps.InfoWindow(),
                marker, i;


           
              for (i = 0; i < markers.length; i++) {
                var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
                bounds.extend(position);
                marker = new google.maps.Marker({
                  position: position,
                  map: map,
                  title: markers[i][0],
                  icon: $pin_icon
                });

                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                  return function() {
                    if(infoWindowContent[i][0].length > 1) {
                      infoWindow.setContent('<div class="info_content"><p>'+infoWindowContent[i][0]+'</p></div>');  
                    }
                    
                    infoWindow.open(map, marker);
                  }
                })(marker, i));

                map.fitBounds(bounds);

              }



              var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
                this.setZoom($zoom);
                google.maps.event.removeListener(boundsListener);
              });

              // console.log('google map should be initialised');
            }
            initialize();

            // google.maps.event.addDomListener(window, "load", initialize);
            // $(window).load(initialize)


         
            function googleMapsResize() {
              //google.maps.event.trigger(map, 'resize');
              initialize();
            } 

            var temporaryTabsContainer = $('.mk-tabs');
            if (temporaryTabsContainer.length) {
              temporaryTabsContainer.each(function() {
                google.maps.event.addDomListener($(this)[0], "click", googleMapsResize);
              });

            }

            var fullHeight = $this.hasClass('full-height-map');

            function fullHeightMap() {
                if (fullHeight) {

                  var $window_height = $(window).outerHeight(),
                       wp_admin_height = 0,
                       header_height = 0;

                    if($.exists('#mk-header .mk-header-holder')) {
                      header_height = parseInt($('#mk-header').attr('data-sticky-height'));  
                    }   
                       
                    if ($.exists("#wpadminbar")) {
                      var wp_admin_height = $("#wpadminbar").outerHeight();
                    }
              
                  $window_height = $window_height - wp_admin_height - header_height;

                  $this.css('height', $window_height);
                }
            }
            fullHeightMap();

            $(window).on('debouncedresize', fullHeightMap);
    });
}

function bgPositionFixedIE() {
    var clipper = $('.clipper-true');
    if(BrowserDetect.browser === 'IE' && clipper.length) {
        clipper.each(function() {
            var $this = $(this);
            // $this.wrap('<div class="background-clipper"></div>');
            $this.unwrap();
            $this.css({
                'background-attachment': 'fixed',
                'position': 'absolute'
            });
        });
    }
}
bgPositionFixedIE();

function mk_flipbox() {
    var z = 0;
    $(".mk-flipbox-container").each(function() {
        var $this = $(this),
            $content = $this.find('.mk-flipbox-content');

        $content.width($this.width()-2);

        $(window).on('resize', function() {
            $content.width($this.width()-2);
        });

        $this.hover(
            function() {
                z++;
                var adjust = $this.prev().css('z-index') || 0;
                $this.css({'z-index': z - adjust});
            },
            function() {
                setTimeout(function(){
                    $this.css({'z-index': 0});
                }, 500)
            }
        );
    })
};;/* Blog, Portfolio Audio */
/* -------------------------------------------------------------------- */

function loop_audio_init() {
  if ($.exists('.jp-jplayer')) {
    $('.jp-jplayer.mk-blog-audio').each(function () {
      var css_selector_ancestor = "#" + $(this).siblings('.jp-audio').attr('id');
      var ogg_file, mp3_file, mk_theme_js_path;
      ogg_file = $(this).attr('data-ogg');
      mp3_file = $(this).attr('data-mp3');
      $(this).jPlayer({
        ready: function () {
          $(this).jPlayer("setMedia", {
            mp3: mp3_file,
            ogg: ogg_file
          });
        },
        play: function () { // To avoid both jPlayers playing together.
          $(this).jPlayer("pauseOthers");
        }, 
        swfPath: mk_theme_js_path,
        supplied: "mp3, ogg",
        cssSelectorAncestor: css_selector_ancestor,
        wmode: "window"
      });
    });
  }
}

;/* jQuery prettyPhoto lightbox */
/* -------------------------------------------------------------------- */

function mk_lightbox_init() {
  $(".mk-lightbox").fancybox({
            padding: 15,
            margin: 15,

            width: 800,
            height: 600,
            minWidth: 100,
            minHeight: 100,
            maxWidth: 9999,
            maxHeight: 9999,
            pixelRatio: 1, // Set to 2 for retina display support

            autoSize: true,
            autoHeight: false,
            autoWidth: false,

            autoResize: true,
            fitToView: true,
            aspectRatio: false,
            topRatio: 0.5,
            leftRatio: 0.5,

            scrolling: 'auto', // 'auto', 'yes' or 'no'
            wrapCSS: '',

            arrows: true,
            closeBtn: true,
            closeClick: false,
            nextClick: false,
            mouseWheel: true,
            autoPlay: false,
            playSpeed: 3000,
            preload: 3,
            modal: false,
            loop: true,
            // Properties for each animation type
            // Opening fancyBox
            openEffect: 'fade', // 'elastic', 'fade' or 'none'
            openSpeed: 200,
            openEasing: 'swing',
            openOpacity: true,
            openMethod: 'zoomIn',

            // Closing fancyBox
            closeEffect: 'fade', // 'elastic', 'fade' or 'none'
            closeSpeed: 200,
            closeEasing: 'swing',
            closeOpacity: true,
            closeMethod: 'zoomOut',

            // Changing next gallery item
            nextEffect: 'none', // 'elastic', 'fade' or 'none'
            nextSpeed: 350,
            nextEasing: 'swing',
            nextMethod: 'changeIn',

            // Changing previous gallery item
            prevEffect: 'none', // 'elastic', 'fade' or 'none'
            prevSpeed: 350,
            prevEasing: 'swing',
            prevMethod: 'changeOut',
            helpers : {
                 media : {}
            },

            tpl: {
                wrap: '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
                image: '<img class="fancybox-image" src="{href}" alt="" />',
                error: '<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',
                closeBtn: '<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"><i class="mk-moon-close-2"></i></a>',
                next: '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span><i class="mk-jupiter-icon-arrow-right"></i></span></a>',
                prev: '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span><i class="mk-jupiter-icon-arrow-left"></i></span></a>',
                loading: '<div id="fancybox-loading"><div></div></div>'
            },

        });
}

;/* Event Count Down */
/* -------------------------------------------------------------------- */

function mk_event_countdown() {
  if ($.exists('.mk-event-countdown')) {
    $('.mk-event-countdown').each(function () {
      var $this = $(this),
        $date = $this.attr('data-date'),
        $offset = $this.attr('data-offset');

      $this.downCount({
        date: $date,
        offset: $offset
      });
    });
  }
};/* Flexslider init */
/* -------------------------------------------------------------------- */

function mk_flexslider_init() {

  $('.mk-flexslider.mk-script-call').each(function () {

    if ($(this).parents('.mk-tabs').length || $(this).parents('.mk-accordion').length) {
      $(this).removeData("flexslider");
    }

    var $this = $(this),
      $selector = $this.attr('data-selector'),
      $animation = $this.attr('data-animation'),
      $easing = $this.attr('data-easing'),
      $direction = $this.attr('data-direction'),
      $smoothHeight = $this.attr('data-smoothHeight') == "true" ? true : false,
      $slideshowSpeed = $this.attr('data-slideshowSpeed'),
      $animationSpeed = $this.attr('data-animationSpeed'),
      $controlNav = $this.attr('data-controlNav') == "true" ? true : false,
      $directionNav = $this.attr('data-directionNav') == "true" ? true : false,
      $pauseOnHover = $this.attr('data-pauseOnHover') == "true" ? true : false,
      $isCarousel = $this.attr('data-isCarousel') == "true" ? true : false,
      $arrowLeft = $this.attr('data-arrow-left'),
      $arrowRight = $this.attr('data-arrow-right');

      if($arrowLeft == undefined) {
        $arrowLeft = '<i class="mk-jupiter-icon-arrow-left"></i>';
      } else {
        $arrowLeft = '<i class="'+$arrowLeft+'"></i>';
      }

      if($arrowRight == undefined) {
        $arrowRight = '<i class="mk-jupiter-icon-arrow-right"></i>';
      } else {
        $arrowRight = '<i class="'+$arrowRight+'"></i>';
      }


    if ($selector != undefined) {
      var $selector_class = $selector;
    } else {
      var $selector_class = ".mk-flex-slides > li";
    }

    if ($isCarousel == true) {
      var $itemWidth = parseInt($this.attr('data-itemWidth')),
        $itemMargin = parseInt($this.attr('data-itemMargin')),
        $minItems = parseInt($this.attr('data-minItems')),
        $maxItems = parseInt($this.attr('data-maxItems')),
        $move = parseInt($this.attr('data-move'));
    } else {
      var $itemWidth = $itemMargin = $minItems = $maxItems = $move = 0;
    }

    $this.flexslider({
      selector: $selector_class,
      animation: $animation,
      easing: $easing,
      direction: $direction,
      smoothHeight: $smoothHeight,
      slideshow: true,
      slideshowSpeed: $slideshowSpeed,
      animationSpeed: $animationSpeed,
      controlNav: $controlNav,
      directionNav: $directionNav,
      pauseOnHover: $pauseOnHover,
      prevText: "",
      nextText: "",
      directionNavArrowsLeft: $arrowLeft,
      directionNavArrowsRight:$arrowRight,
      itemWidth: $itemWidth,
      itemMargin: $itemMargin,
      minItems: $minItems,
      maxItems: $maxItems,
      move: $move,
    });

  });

}


//
;/* Background Parallax Effects */
/* -------------------------------------------------------------------- */

function mk_backgrounds_parallax() {

  "use strict";

  if (mk_header_parallax == true) {
    $('.mk-header-bg').addClass('mk-parallax-enabled');
  }
  if (mk_body_parallax == true) {
    $('body').addClass('mk-parallax-enabled');
  }
  if (mk_banner_parallax == true) {
    $('#mk-header').addClass('mk-parallax-enabled');
  }
  if (mk_page_parallax == true) {
    $('#theme-page').addClass('mk-parallax-enabled');
  }
  if (mk_footer_parallax == true) {
    $('#mk-footer').addClass('mk-parallax-enabled');
  }

  $('.mk-parallax-enabled').each(function () {
    if (!is_touch_device()) {
      $(this).parallax("49%", 0.3);
    }
  });

  $('.mk-fullwidth-slideshow.parallax-slideshow').each(function () {
    if (!is_touch_device()) {
      var speed_factor = $(this).attr('data-speedFactor');
      $(this).parallax("49%", speed_factor);
    }
  });

};/* Animated Contents */
/* -------------------------------------------------------------------- */

function mk_animated_contents() {

  "use strict";

  $(".mk-animate-element").filter(":in-viewport").each(function (i) {
    var $this = $(this);
    if (!$this.hasClass('mk-in-viewport')) {
      setTimeout(function () {
        $this.addClass('mk-in-viewport');
      }, 100 * i);
    }
  });

}
;/* Box Blur effect */
/* -------------------------------------------------------------------- */

function mk_blur_boxes() {

  "use strict";

  var viewportWidth = $(window).width(),
  	  overlayColor = "rgba(255,255,255,0.6)";



  if ($.exists('.icon-box-boxed.blured-box, .mk-employee-item.employee-item-blur') && !is_touch_device() && viewportWidth > 1024 ) {

  		var bg = $('.mk-blur-parent').find('.background-layer'),
  			i = 0;


  		var setLoop = setInterval( function(){ 
			var	mk_blur_parent = bg.eq(i),
		  		mk_blur_elements = $('.mk-blur-parent').find('.icon-box-boxed.blured-box, .mk-employee-item.employee-item-blur');

				mk_blur_elements.blurjs({
				  source: mk_blur_parent,
				  radius: 18,
				  overlay: overlayColor,
				});
				i++;
				if(i === bg.length) {
					clearInterval(setLoop);
					// console.log('blur-stop-propagation');
				}
  		}, 1000);
	
  }  else if ($.exists('.icon-box-boxed.blured-box, .mk-employee-item.employee-item-blur')) {
		if ( viewportWidth <= 935 ) {
		  	$('.mk-blur-parent .icon-box-boxed').css({ 'background-color' : overlayColor });
		  	$('.mk-blur-parent .mk-employee-item').css({ 'background-color' : overlayColor });
		} 
  }
}
;/* Tabs */
/* -------------------------------------------------------------------- */

function mk_tabs() {

  "use strict";

  if ($.exists('.mk-tabs, .mk-news-tab, .mk-woo-tabs')) {
    $(".mk-tabs, .mk-news-tab, .mk-woo-tabs").tabs();

     $('.mk-tabs').on('click', function () {
       $('.mk-theme-loop').isotope('layout');
     });

    $('.mk-tabs.vertical-style').each(function () {
      $(this).find('.mk-tabs-pane').css('minHeight', $(this).find('.mk-tabs-tabs').height() - 1);
    });

  }
}

function mk_tabs_responsive(){
  $('.mk-tabs, .mk-news-tab').each(function () {
    $this = $(this);
    if ($this.hasClass('mobile-true')) {
      if (window.matchMedia('(max-width: 767px)').matches)
      {
          $this.tabs("destroy");
      } else {
        $this.tabs();
      }
    }
  });
  
}

;/* Parallax for page sections 
 * Thx to Olafur Nielsen (http://form5.is)
/* -------------------------------------------------------------------- */

function mk_parallax_improved() {


  // var parallax_parent = $('.parallax-true'),
  //     $bgElm = [],
  //     $offset = [],
  //     $height = [];

  // parallax_parent.each(function() {
      
  //     var scrollTop = 0,
  //         ticking = false,
  //         windowHeight = $(window).height(),
  //         $speedFactor = $(this).attr('data-speedFactor'),
  //         speedDivider = 1 + (.2 * $speedFactor);

  //     $bgElm.push($(this).find('.swiper-slide-bg, .mk-section-video'));
  //     $offset.push($(this).offset().top);
  //     $height.push($(this).outerHeight());

      
  //     // Update background position
  //     var updatePosition = function() {
  //       $($bgElm).each(function(i) {
  //         var offset = $offset[i],
  //             height = $height[i],
  //             translateValue =  (offset - scrollTop) / speedDivider;

  //         $(this).height(height * speedDivider);

  //             console.log(translateValue)

  //         // Check if above or below viewport
  //         if (offset + height <= scrollTop || offset >= scrollTop + windowHeight) {
  //           return;
  //         }

  //         // We don't want parallax to happen if scrollpos is below 0
  //         // if (translateValue < 0)
  //         //   translateValue = 0;

  //         this.each(function() {
  //           translateY(this, translateValue);
  //         })
  //       })

  //       // Stop ticking
  //       ticking = false;
  //     };

  //     // Translates an element on the Y axis using translate3d to ensure
  //     // that the rendering is done by the GPU
  //     var translateY = function(elm, value) {
  //       var translate = 'translate3d(0px,' + value + 'px, 0px)';
  //       elm.style['-webkit-transform'] = translate;
  //       elm.style['-moz-transform'] = translate;
  //       elm.style['-ms-transform'] = translate;
  //       elm.style['-o-transform'] = translate;
  //       elm.style.transform = translate;
  //     };

  //     // This will limit the calculation of the background position to
  //     // 60fps as well as blocking it from running multiple times at once
  //     var requestTick = function() {
  //       if (!ticking) {
  //         window.requestAnimationFrame(updatePosition);
  //         ticking = true;
  //       }
  //     };

  //     // Update scroll value and request tick
  //     var doScroll = function() {
  //       scrollTop = $(window).scrollTop();
  //       requestTick();
  //     };

  //     // Initialize on domready
  //     (function() {
  //       var loaded = 0;
  //       var bootstrap = function() {
  //         if (loaded) return;
  //         loaded = 1;

  //         rafPolyfill();
  //         window.onscroll = doScroll;
  //       };

  //       if ( document.readyState === 'complete' ) {
  //         setTimeout( bootstrap );
  //       } else {
  //         document.addEventListener( 'DOMContentLoaded', bootstrap, false );
  //         window.addEventListener( 'load', bootstrap, false );
  //       }
  //     })();

  //     // RequestAnimationFrame polyfill for older browsers
  //     var rafPolyfill = function() {
  //       var lastTime, vendors, x;
  //       lastTime = 0;
  //       vendors = ["webkit", "moz"];
  //       x = 0;
  //       while (x < vendors.length && !window.requestAnimationFrame) {
  //         window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
  //         window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"];
  //         ++x;
  //       }
  //       if (!window.requestAnimationFrame) {
  //         window.requestAnimationFrame = function(callback, element) {
  //           var currTime, id, timeToCall;
  //           currTime = new Date().getTime();
  //           timeToCall = Math.max(0, 16 - (currTime - lastTime));
  //           id = window.setTimeout(function() {
  //             callback(currTime + timeToCall);
  //           }, timeToCall);
  //           lastTime = currTime + timeToCall;
  //           return id;
  //         };
  //       }
  //       if (!window.cancelAnimationFrame) {
  //         window.cancelAnimationFrame = function(id) {
  //           clearTimeout(id);
  //         };
  //       }
  //     };
  // })
};/* Parallx for page sections */
/* -------------------------------------------------------------------- */

function mk_parallax() {

  "use strict";


  if (!is_touch_device() && $(window).width() > 1050) {
    $('.mk-page-section .parallax-true').each(function () {
      var $this = $(this),
        $speedFactor = $this.attr('data-speedFactor');

      $($this).parallax("49%", $speedFactor);
    });
  }

  // if (!is_touch_device()) {

  // 	var $parallaxLayer = [];

  //   $('.mk-page-section.parallax-true').each(function () {

  //     var lastScrollY = 0,
  //         ticking = false,
  //         $this = $(this),
  //         windowHeight = $(window).height(),
  //         parentHeight = $this.outerHeight(),
  //         $speedFactor = $this.attr('data-speedFactor'),
  //         parallaxSpeed = 0.1*$speedFactor/2;

  //     $parallaxLayer.push($this.find('.parallax-layer'));

  //     // Update background position
  //     var updatePosition = function() {
  //       var translateValue = lastScrollY / $speedFactor;

  //       // We don't want parallax to happen if scrollpos is below 0
  //       if (translateValue < 0)
  //           translateValue = 0;

	 //    $($parallaxLayer).each(function() {
	 //    	var $this = $(this);

	 //    	// $this.height(parentHeight + Math.abs(parentHeight*parallaxSpeed*2));

	 //    	if($speedFactor > 0) {
	 //    		$this.css('top', -(parentHeight * parallaxSpeed));
	 //    		$this.height(parentHeight * (1 + Math.abs(parallaxSpeed)*4));
	 //    	} else {
	 //    		$this.height(parentHeight + parentHeight / (1 + Math.abs(parallaxSpeed)*4));
	 //    	}

	 //    	var scrollTop = $(window).scrollTop();
  //           var offset = $this.offset().top;
  //           var height = $this.outerHeight();

  //           if (offset + height <= scrollTop || offset >= scrollTop + windowHeight) {
		// 		return;
		// 	}

	 //      	translateY(this[0], (offset - scrollTop) * parallaxSpeed);
		// });

  //       // Stop ticking
  //       ticking = false;
  //     };

  //     // Translates an element on the Y axis using translate3d to ensure
  //     // that the rendering is done by the GPU
  //     var translateY = function(elm, value) {
  //       var translate = 'translate3d(0px,' + value + 'px, 0px)';
  //       elm.style['-webkit-transform'] = translate;
  //       elm.style['-moz-transform'] = translate;
  //       elm.style['-ms-transform'] = translate;
  //       elm.style['-o-transform'] = translate;
  //       elm.style.transform = translate;
  //     };

  //     // This will limit the calculation of the background position to
  //     // 60fps as well as blocking it from running multiple times at once
  //     var requestTick = function() {
  //       if (!ticking) {
  //         window.requestAnimationFrame(updatePosition);
  //         ticking = true;
  //       }
  //     };

  //     // Update scroll value and request tick
  //     var doScroll = function() {
  //       lastScrollY = window.scrollY;
  //       requestTick();
  //     };

  //     // Initialize on domready
  //     (function() {
  //       var loaded = 0;
  //       var bootstrap = function() {
  //         if (loaded) return;
  //         loaded = 1;

  //         rafPolyfill();
  //         window.onscroll = doScroll;

  //         // Repair position on refresh
  //         doScroll();
  //       };

  //       if ( document.readyState === 'complete' ) {
  //         setTimeout( bootstrap );
  //       } else {
  //         document.addEventListener( 'DOMContentLoaded', bootstrap, false );
  //         window.addEventListener( 'load', bootstrap, false );
  //       }
  //     })();

  //     // RequestAnimationFrame polyfill for older browsers
  //     var rafPolyfill = function() {
  //       var lastTime, vendors, x;
  //       lastTime = 0;
  //       vendors = ["webkit", "moz"];
  //       x = 0;
  //       while (x < vendors.length && !window.requestAnimationFrame) {
  //         window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
  //         window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"];
  //         ++x;
  //       }
  //       if (!window.requestAnimationFrame) {
  //         window.requestAnimationFrame = function(callback, element) {
  //           var currTime, id, timeToCall;
  //           currTime = new Date().getTime();
  //           timeToCall = Math.max(0, 16 - (currTime - lastTime));
  //           id = window.setTimeout(function() {
  //             callback(currTime + timeToCall);
  //           }, timeToCall);
  //           lastTime = currTime + timeToCall;
  //           return id;
  //         };
  //       }
  //       if (!window.cancelAnimationFrame) {
  //         window.cancelAnimationFrame = function(id) {
  //           clearTimeout(id);
  //         };
  //       }
  //     };

  //   });
  // }
}


;/* Ajax Search */
/* -------------------------------------------------------------------- */

function mk_ajax_search() {

  "use strict";

  if ($.exists('.main-nav-side-search') && mk_ajax_search_option == "beside_nav") {
    $("#mk-ajax-search-input").autocomplete({
      delay: 40,
      minLength: 2,
      appendTo: $("#mk-nav-search-wrapper"),
      search: function (event, ui) {
        $(this).parent('form').addClass('ajax-searching');
      },
      source: function (req, response) {
        $.getJSON(ajaxurl + '?callback=?&action=mk_ajax_search', req, response);
      },
      select: function (event, ui) {
        window.location.href = ui.item.link;
      },
      response: function (event, ui) {
        $(this).parent('form').removeClass('ajax-searching').addClass('ajax-search-complete');
      }

    }).data("ui-autocomplete")._renderItem = function (ul, item) {


      return $("<li>").append("<a>" + item.image + "<span class='search-title'>" + item.label + "</span><span class='search-date'>" + item.date + "</span></a>").appendTo(ul);

    };
  }
}


;/* Hover Events */
/* -------------------------------------------------------------------- */

function mk_hover_events() {

  "use strict";

  $('.shopping-cart-header').hoverIntent({
    over: function() {
      $('.mk-shopping-cart-box').show();
    },
    out: function() {
      $('.mk-shopping-cart-box').hide();
    },
    timeout: 500
  });


  $('.widget-sub-navigation > ul > li, .widget_nav_menu ul.menu > li, .widget_product_categories ul > .cat-item').each(function() {

    var $this = $(this),
      $subLevel = $this.find('ul');

    if ($this.hasClass('page_item_has_children') || $this.hasClass('menu-item-has-children') || $this.hasClass('cat-parent')) {
      $this.hoverIntent({
        over : function() {
          $subLevel.slideDown(500);
        }, 
        out : function() {
          $subLevel.slideUp(500);
        },
        timeout: 1000
        });
    }

  });  

  var eventtype = mobilecheck() ? 'touchstart' : 'click';

  $('.mk-fullscreen-trigger').on(eventtype, function(e) {
    $('.mk-fullscreen-search-overlay').addClass('mk-fullscreen-search-overlay-show');
    setTimeout(function(){
      $("#mk-fullscreen-search-input").focus();
    }, 300);
    e.preventDefault();
  });

  $('.mk-fullscreen-close').on(eventtype, function(e) {
    $('.mk-fullscreen-search-overlay').removeClass('mk-fullscreen-search-overlay-show');
    e.preventDefault();
  });

}

function mk_unfold_footer() {
  var $this = $('#mk-footer'),
    $themePage = $('#theme-page'),
    $footerHeight = $this.outerHeight()
  $winWidth = $(window).outerWidth();
  if ($winWidth > 767) {
    if ($this.hasClass('mk-footer-unfold')) {
      $themePage.css('margin-bottom', $footerHeight);
    }
  } else {
    $themePage.css('margin-bottom', 0);
  }
};/* Ajax portfolio */
/* -------------------------------------------------------------------- */

function mk_portfolio_ajax() {

  "use strict";

  var headerHeight = 0;
  if ($.exists("#wpadminbar")) {
    headerHeight += $("#wpadminbar").height();
  }
  if (!$.exists('.mk-vm-menuwrapper')) {
    headerHeight += parseInt($('#mk-header').attr('data-sticky-height'));
  }

  $('.portfolio-grid.portfolio-ajax-enabled').ajaxPortfolio({
  	extraOffset: headerHeight
  });
}

;/* Love This */
/* -------------------------------------------------------------------- */

function mk_love_post() {

  "use strict";

  $('body').on('click', '.mk-love-this', function () {
    var $this = $(this),
      $id = $this.attr('id');

    if ($this.hasClass('item-loved')) return false;

    if ($this.hasClass('item-inactive')) return false;

    var $sentdata = {
      action: 'mk_love_post',
      post_id: $id
    }

    $.post(ajaxurl, $sentdata, function (data) {
      $this.find('.mk-love-count').html(data);
      $this.addClass('item-loved');
    });

    $this.addClass('item-inactive');
    return false;
  });

}



;/* Woocommerce Add to card */
/* -------------------------------------------------------------------- */

function product_loop_add_cart() {

  "use strict";

  var $body = $('body');
  $body.on('click', '.add_to_cart_button', function () {
    var product = $(this).parents('.product:eq(0)').addClass('adding-to-cart').removeClass('added-to-cart');
  })

  $body.bind('added_to_cart', function () {
    $('.adding-to-cart').removeClass('adding-to-cart').addClass('added-to-cart');
  });
}



;/* Woocommerce Loop Scripts */
/* -------------------------------------------------------------------- */

function shop_isotop_init() {

  "use strict";

  if ($.exists('.products') && !$('.products').hasClass('related')) {
    $('.products').each(function () {

      if (!$(this).parents('.mk-woocommerce-carousel').length) {
        var $woo_container = $(this),
          $container_item = '.products .product';

        $woo_container.isotope({
          itemSelector: $container_item,
          masonry: {
            columnWidth: 1
          }

        });


      }
    });
  }
}



;/* Social Share */
/* -------------------------------------------------------------------- */

function mk_social_share() {

  "use strict";

  $('.twitter-share').on('click', function () {
    var $url = $(this).attr('data-url'),
      $title = $(this).attr('data-title');

    window.open('http://twitter.com/intent/tweet?text=' + $title + ' ' + $url, "twitterWindow", "height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
    return false;
  });

  $('.pinterest-share').on('click', function () {
    var $url = $(this).attr('data-url'),
      $title = $(this).attr('data-title'),
      $image = $(this).attr('data-image');
    window.open('http://pinterest.com/pin/create/button/?url=' + $url + '&media=' + $image + '&description=' + $title, "twitterWindow", "height=320,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
    return false;
  });

  $('.facebook-share').on('click', function () {
    var $url = $(this).attr('data-url');
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + $url, "facebookWindow", "height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
    return false;
  });

  $('.googleplus-share').on('click', function () {
    var $url = $(this).attr('data-url');
    window.open('https://plus.google.com/share?url=' + $url, "googlePlusWindow", "height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
    return false;
  });

  $('.linkedin-share').on('click', function () {
    var $url = $(this).attr('data-url'),
      $title = $(this).attr('data-title'),
      $desc = $(this).attr('data-desc');
    window.open('http://www.linkedin.com/shareArticle?mini=true&url=' + $url + '&title=' + $title + '&summary=' + $desc, "linkedInWindow", "height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
    return false;
  });
}



;/* Floating Go to top Link */
/* -------------------------------------------------------------------- */

function mk_smooth_scroll_events() {

  "use strict";

  var eventtype = mobilecheck() ? 'touchstart' : 'click';

  $('.mk-go-top, .mk-back-top-link, .single-back-top a, .divider-go-top, .comments-back-top').on(eventtype, function (e) {
    //TweenLite.to(window, 1, {scrollTo:{y:0}, ease:Expo.easeInOut});
    e.preventDefault();
    $("html, body").animate({
      scrollTop: 0
      }, 1500);
  });

  $('.mk-classic-comments').on(eventtype, function (e) {
    e.preventDefault();

    $("html, body").animate({
      scrollTop: $('#comments').offset().top
    }, 800);
    //TweenLite.to(window, 1, {scrollTo:{y:$('#comments').offset().top}, ease:Expo.easeInOut});

  });

  
  $(document).on(eventtype, '.mk-smooth', function (e) {
    e.preventDefault();

    var header_height = 0,
         wp_admin_height = 0;

    if ($.exists("#wpadminbar")) {
      wp_admin_height = $("#wpadminbar").height();
    }
    if($.exists('#mk-header .mk-header-holder') && !$('#mk-header').hasClass('header-style-4')) {
      header_height = parseInt($('#mk-header').attr('data-sticky-height'));  
    }
    if ( $(window).width() <= mk_responsive_nav_width ) {
      header_height = 0;
    }
    // For lazy header we stick to 0 height value as it gets hidden on scroll down
    if($('#mk-header').attr('data-sticky-style') === 'lazy') {
      header_height = 0;
    }


    var offsetTop = $($(this).attr("href")).offset().top - (header_height + wp_admin_height);
    
    $('html, body').stop().animate({
      scrollTop: offsetTop
    }, {
      duration: 1200,
      easing: "easeInOutExpo"
    });
  });

}


new ChopScroll(function () {
  if ($(window).scrollTop() > 400) {
    $('.mk-go-top, .mk-quick-contact-wrapper').removeClass('off').addClass('on');
  } else {
    $('.mk-go-top, .mk-quick-contact-wrapper').removeClass('on').addClass('off');
  }
}, 800);
;/* Page Section full height feature */
/* -------------------------------------------------------------------- */


function section_to_full_height() {


  "use strict";

  $('.full-height-true.mk-page-section').each(function () {
    var $this = $(this),
      $content_height = $this.find('.page-section-content').outerHeight(true),
      $slideshowbox_content_height = $this.find('.mk-slideshow-box-content').outerHeight(true),
      $window_height = $(window).outerHeight(),
      header = $('#mk-header').attr('data-height'),
      headerHeight = 0,
      skipArrow = 0;

    var PSpaddingTop = parseInt($this.css('padding-top'));
    var PSpaddingBottom = parseInt($this.css('padding-bottom'));

 
   /* if ($('.mk-header-toolbar').length > 0) {
      var mk_header_toolbar = $(".mk-header-toolbar").outerHeight();
    } else {
      var mk_header_toolbar = 0;
    }*/

  
    if(window.matchMedia("(max-width: 1140px)").matches) {
        headerHeight = header;
    }

    // Arrow does not affect layout!
    // if($this.find('.abb-skip-to-next').length) {
    //     skipArrow = 80;
    // }

    $window_height = $window_height - abb.modules.theme_header.adminHeight() - headerHeight - PSpaddingTop - PSpaddingBottom;


    if(($content_height > $window_height) ||
       ($this.find('.mk-slideshow-box-content').length && $slideshowbox_content_height > $window_height)) {

        $this.css('height', 'auto');

        $this.find('.page-section-content, .mk-slideshow-box-content').css({
        'padding-top': 30,
        'padding-bottom': 30
        });
    } 
    else { 
        $this.css('height', $window_height);
        var $this_height_half = $this.find('.page-section-content').outerHeight() / 2,
            $window_half = $window_height / 2;

        $this.find('.page-section-content').css('marginTop', ($window_half - $this_height_half));
    }

    $this.find('.mk-page-section-loader').fadeOut();

  });

}



/* Page Section Intro Effects */
/* -------------------------------------------------------------------- */

function mk_section_intro_effects() {
  if ( !is_touch_device() ) {
    if($.exists('.mk-page-section.intro-true')) {

      $('.mk-page-section.intro-true').each(function() {
          var $this = $(this),
              $pageCnt = $this.nextAll('div'),
              windowHeight = $(window).height(),
              effectName = $this.attr('data-intro-effect'),
              $header = $('#mk-header');

              var effect = {
                    fade :    new TimelineLite({paused: true})
                              .set($pageCnt, { opacity: 0, y: windowHeight * 0.3 })
                              .to($this, 1, { opacity: 0, ease:Power2.easeInOut })
                              .to($pageCnt, 1, { opacity: 1, y: 0, ease:Power2.easeInOut}, "-=.7")
                              .set($this, { zIndex: '-1'}),

                    zoom_out : new TimelineLite({paused: true})
                              .set($pageCnt, { opacity: 0, y: windowHeight * 0.3})
                              .to($this, 1.5, { opacity: .8, scale: 0.8, y: -windowHeight - 100, ease:Strong.easeInOut })
                              .to($pageCnt, 1.5, { opacity: 1, y:  0, ease:Strong.easeInOut}, "-=1.3"),

                    shuffle : new TimelineLite({paused: true})
                              .to($this, 1.5, { y: -windowHeight/2, ease:Strong.easeInOut })
                              .to($this.nextAll('div').first(), 1.5, { paddingTop: windowHeight/2, ease:Strong.easeInOut }, "-=1.3")
              }
      

          $this.sectiontrans({
            effect : effectName,
          });

          if($this.hasClass('shuffled')) {
            TweenLite.set($this, { y: -windowHeight/2 });
            TweenLite.set($this.nextAll('div').first(), { paddingTop: windowHeight/2 });
          }

          $('body').on('page_intro', function() {
            $(this).data('intro', true);
            effect[effectName].play();
            setTimeout(function() {
              $header.addClass('header-sticky-prepare');
              $header.addClass('header-sticky-ready');
              $('.mk-header-padding-wrapper').addClass('enable-padding');
              $('body').data('intro', false);
              if(effectName === 'shuffle') $this.addClass('shuffled');
            }, 1000);
          });

          $('body').on('page_outro', function() {
            $(this).data('intro', true);
            effect[effectName].reverse();
            setTimeout(function() {
              $header.removeClass('header-sticky-prepare');
              $header.removeClass('header-sticky-ready');
              $('.mk-header-padding-wrapper').removeClass('enable-padding');
              $('body').data('intro', false);
              if($this.hasClass('shuffled')) $this.removeClass('shuffled');
            }, 1000);
          });

      });
    }
  } else {
    $('.mk-page-section.intro-true').each(function() {
      $(this).attr('data-intro-effect', '');
    });
  }
};/* Accordions & Toggles */
/* -------------------------------------------------------------------- */


/* Accordions */

function mk_accordion_toggles_tooltip() {

  "use strict";

  var accordion = $(".mk-accordion"),
    accordionPaneClass = "mk-accordion-pane",
    actionClass = "accordion-action",
    accordionTabClass = "mk-accordion-tab",
    togglePaneClass = "mk-toggle-pane",
    activeToggleClass = "active-toggle";

  if ($.exists(accordion)) {

    $.tools.toolsTabs.addEffect("slide", function(i, done) {
      this.getPanes().slideUp(250);
      this.getPanes().eq(i).slideDown(250, function() {
        done.call();
      });
    });

    accordion.each(function() {
      var $this = $(this);
      if ($this.hasClass(actionClass)) {

        var $initialIndex = parseInt($(this).attr('data-initialindex'));
        if ($initialIndex == undefined) {
          $initialIndex = 0;
        }
        if (window.matchMedia('(max-width: 767px)').matches && $this.hasClass('mobile-true')){
          
        }else{
          $this.toolsTabs("div.mk-accordion-pane", {
            toolsTabs: accordionTabClass,
            effect: 'slide',
            initialIndex: $initialIndex,
            slideInSpeed: 400,
            slideOutSpeed: 400
          });
        }
      } else {
         if (window.matchMedia('(max-width: 767px)').matches && $this.hasClass('mobile-true')){
          
        }else{
        $(".toggle-action .mk-accordion-tab").toggle(
          function() {
            $(this).parent('.mk-accordion-single').addClass('current');
            $(this).siblings('.' + accordionPaneClass).slideDown(150);
          }, function() {
            $(this).parent('.mk-accordion-single').removeClass('current');
            $(this).siblings('.' + accordionPaneClass).slideUp(150);
          });
      }
      }
    });

  }


  /* Toggles */

  if ($.exists('.mk-toggle-title')) {
      $(".mk-toggle-title").toggle(
        function() {
          $(this).addClass(activeToggleClass);
          $(this).siblings('.' + togglePaneClass).slideDown(200);
        }, function() {
          $(this).removeClass(activeToggleClass);
          $(this).siblings('.' + togglePaneClass).slideUp(200);
        }
      );
  } 


  /* Message Boxes */
  /* -------------------------------------------------------------------- */

  $('.box-close-btn').on('click', function() {
    $(this).parent().fadeOut(300);
    return false;

  });


  $('.mk-tooltip').each(function() {
    $(this).find('.tooltip-init').hover(function() {
      $(this).siblings('.tooltip-text').animate({
        'opacity': 1
      }, 400);

    }, function() {
      $(this).siblings('.tooltip-text').animate({
        'opacity': 0
      }, 400);
    });
  });

}
;/* Newspaper Comments & Share section */
/* -------------------------------------------------------------------- */

function mk_newspaper_comments_share() {

  "use strict";

  $('.newspaper-item-footer').each(function () {

    $(this).find('.newspaper-item-comment').click(function () {

      $(this).parents('.newspaper-item-footer').find('.newspaper-social-share').slideUp(200).end().find('.newspaper-comments-list').slideDown(200);
      // setTimeout(function () {
      //   $('.mk-theme-loop').isotope('reLayout');
      // }, 300);
    });

    $(this).find('.newspaper-item-share').click(function () {

      $(this).parents('.newspaper-item-footer').find('.newspaper-comments-list').slideUp(200).end().find('.newspaper-social-share').slideDown(200);
      // setTimeout(function () {
      //   $('.mk-theme-loop').isotope('reLayout');
      // }, 300);

    });

  });

}


;/* Main Navigation */
/* -------------------------------------------------------------------- */

function mk_main_navigation_init() {

  "use strict";

  var $body = $('body');

  if (!$body.hasClass('navigation-initialised')) {

    $(".main-navigation-ul").MegaMenu({
      type: "vertical",
      delay: 200
    });

    $('#mk-vm-menu').dlmenu();

    $body.addClass('navigation-initialised');

  }

  if(mobilecheck()) {
    $('.main-navigation-ul .menu-item-has-children > a').on('click', function() {
      var $this = $(this);

      if($this.data('touched')) {
        $this.data('touched', false);
        return true;
      }
      else {
        $this.data('touched', true);
        return false;
      }
    });
  }

}



function mk_responsive_nav() {
  // Bug notice - we have a problem with mobile menu performance but it comes from general 
  // performance issues - this function overloads the browser thread with "height" manipulation
  

  "use strict";

  var eventtype = mobilecheck() ? 'touchstart MSPointerDown pointerdown' : 'click';

  $('.mk-nav-responsive-link').on(eventtype, function(e) {
    e.preventDefault();
    var $body = $('body'),
        $res_nav = $('#mk-responsive-nav'),
        $post_nav = $('.mk-post-nav');

    if ($body.hasClass('mk-opened-nav')) {
      $body.removeClass('mk-opened-nav').addClass('mk-closed-nav').trigger('mk-closed-nav');
      $res_nav.slideUp(300);
      $post_nav.removeClass('post-nav-backward');
    } else {
      $body.removeClass('mk-closed-nav').addClass('mk-opened-nav').trigger('mk-opened-nav');
      $res_nav.slideDown(300);
      $post_nav.addClass('post-nav-backward');
    }
  });

  $('.mk-toolbar-resposnive-icon').on(eventtype,function(e) {
    e.preventDefault();
    var $body = $('body'),
      $toolbar = $('.mk-header-toolbar');


    if ($body.hasClass('toolbar-oppend')) {
      $body.removeClass('toolbar-oppend').addClass('toolbar-closed');
      $toolbar.slideUp();
    } else {
      $body.removeClass('toolbar-closed').addClass('toolbar-oppend');
      $toolbar.slideDown();
    }
  });

}


/* Responsive Fixes */
/* -------------------------------------------------------------------- */


function mk_responsive_fix() {
  "use strict";

  var eventtype = 'click';


  if ($(window).width() > mk_responsive_nav_width) {

    $('#mk-responsive-nav').hide(); 
    mk_main_navigation_init();

  } else {

    if (!$.exists('#mk-responsive-nav')) {
      $('.main-navigation-ul, .mk-vm-menu').clone().attr({
        id: "mk-responsive-nav",
        "class": ""
      }).insertAfter('.mk-header-inner');

      $('#mk-responsive-nav > li').each(function() {
        var $this = $(this);

        $this.removeClass('has-mega-menu').addClass('no-mega-menu');

        $this.children('ul').siblings('a').append('<span class="mk-moon-arrow-down mk-nav-arrow mk-nav-sub-closed"></span>').end().attr("style", '');

        var link = $this.find('a').attr('href'); // returns undefined when no links and later cannot read length property
        if(typeof link == 'string') {
          if(link.length < 5) {
            $this.find('a').addClass('mk-nav-open');
          }
        }

      });


      $('.mk-header-inner').attr('style', '');

      $('#mk-responsive-nav').append($('.responsive-searchform'));


      $('#mk-responsive-nav > li > a').stop(true).on(eventtype, function(e) {
      // $('.mk-nav-arrow, .mk-nav-open a').stop(true).on(eventtype, function(e) {
        var $this = $(this),
            $arrow = $this.find('.mk-nav-arrow');

          // console.log($(e.target).attr('class'));
        if($(e.target).hasClass('mk-nav-arrow') || $(e.target).hasClass('mk-nav-open')) {
          if ($arrow.hasClass('mk-nav-sub-closed')) {
            $arrow.parent().siblings('ul').slideDown(450).end().end().removeClass('mk-nav-sub-closed').addClass('mk-nav-sub-opened');
          } else {
            $arrow.parent().siblings('ul').slideUp(450).end().end().removeClass('mk-nav-sub-opened').addClass('mk-nav-sub-closed');
          }
          e.preventDefault();
        }
      });


      var $header_height = 0;
      var $window_height = $(window).outerHeight();

      if ($.exists('#wpadminbar')) {
        $header_height += $('#wpadminbar').outerHeight();
      }

      if(!$.exists('#mk-responsive-wrap')) {
        $header_height += $('.mk-header-inner').height();

        var nav_height = $window_height - $header_height;

        $('#mk-responsive-nav').wrap('<div id="mk-responsive-wrap" style="max-height:'+nav_height+'px"></div>');
        
        setTimeout(function() {
          document.getElementById("mk-responsive-wrap").addEventListener('touchstart', function(event){});
        }, 300);
        
        $(window).on('resize', function() {

          $('#mk-responsive-wrap').css({
            'max-height' : ($(window).height() - $header_height) + 'px'
          });
        });
      }
    }
  }

}

function hide_res_menu() {
    if ($(window).width() > mk_responsive_nav_width) {
      // hide toggled menu and its states
      if ($('body').hasClass('mk-opened-nav')) {
        $('.mk-nav-responsive-link').trigger('click'); 
      }
      // hide menu wrapper
      $('#mk-responsive-nav').hide(); 
    }
}



function mk_sidebar_navigation() {

  "use strict";

  var $header = $('#mk-header'),
    $sticky_style = $header.attr('data-header-style');

  if ($sticky_style == 3) {

    $('.sidedash-navigation-ul > li').each(function() {
      var $this = $(this);

      $this.children('ul').siblings('a').after('<span class="mk-moon-arrow-down mk-nav-arrow mk-nav-sub-closed"></span>');
    });


     $('.mk-nav-arrow').stop(true).on('click', function(e) {
        var $this = $(this);
        if ($this.hasClass('mk-nav-sub-closed')) {
          $this.siblings('ul').slideDown(450).end().removeClass('mk-nav-sub-closed').addClass('mk-nav-sub-opened');
        } else {
          $this.siblings('ul').slideUp(450).end().removeClass('mk-nav-sub-opened').addClass('mk-nav-sub-closed');
        }
        e.preventDefault();
      });
  }
};function loops_iosotop_init() {

  "use strict";

  $('.loop-main-wrapper').each(function() {
      var $this = $(this),
      $mk_container = $this.find('.mk-theme-loop'),
      $mk_container_item = '.' + $mk_container.attr('data-style') + '-' + $mk_container.attr('data-uniqid'),
      $load_button = $this.find('.mk-loadmore-button'),
      $pagination_items = $this.find('.mk-pagination');
    $mk_container.imagesLoaded(function() {  
      if($mk_container.hasClass('mk-blog-container')) {
        $mk_container.isotope({
          itemSelector: $mk_container_item,
          animationEngine: "best-available",
         /* getSortData : {
            title : 'h3',
            date : '[data-published]'
          },
          sortBy : 'date',
          sortAscending : false,*/
          isOriginLeft: mk_check_rtl,
          masonry: {
            columnWidth: 1
          } 
        });
      } 
      else {
        $mk_container.isotope({
          itemSelector: $mk_container_item,
          animationEngine: "best-available",
          isOriginLeft: mk_check_rtl,
          masonry: {
            columnWidth: 1
          } 
        });
      }
  });
    // $mk_container.isotope('reLayout');

    $(this).parent().find('#mk-filter-portfolio ul li a').click(function() {
      var $this = $(this);
      // console.log('clicked');



      /* Removes ajax container when filter items get triggered */
      $this.parents('.portfolio-grid').find('.ajax-container').animate({
        'height': 0,
        opacity: 0
      }, 500);

      if ($this.hasClass('.current')) {
        return false;
      }
      var $optionSet = $this.parents('#mk-filter-portfolio ul');
      $optionSet.find('.current').removeClass('current');
      $this.addClass('current');

      var selector = $(this).attr('data-filter');

      $mk_container.isotope({
        filter: ''
      });
      $mk_container.isotope({
        filter: selector
      });

      setTimeout(function() {
        $mk_container.isotope('layout');
       }, 400);

      return false;
    });


    $load_button.hide();

    if ($this.find('.mk-theme-loop').hasClass('scroll-load-style') || $this.find('.mk-theme-loop').hasClass('load-button-style')) {
      if ($pagination_items.length > 0) {
        $load_button.css('display', 'block');
      }
      $pagination_items.hide();


      $load_button.on('click', function() {
        if (!$(this).hasClass('pagination-loading')) {
          $(this).addClass('pagination-loading');
        }

      });

      $mk_container.infinitescroll({
          navSelector: $pagination_items,
          nextSelector: $this.find('.mk-pagination a:first'),
          itemSelector: $mk_container_item,
          bufferPx: 70,
          loading: {
            finishedMsg: "",
            img: mk_images_dir + "/load-more-loading.gif",
            msg: null,
            msgText: "",
            selector: $load_button,
            speed: 300,
            start: undefined
          },
          errorCallback: function() {

            $load_button.html(mk_no_more_posts).addClass('disable-pagination');

          },

        },

        function(newElements) {

          var $newElems = $(newElements);
          $newElems.hide();
          $newElems.imagesLoaded(function() {
            $load_button.removeClass('pagination-loading');


            var selected_item = $('#mk-filter-portfolio ul').find('.current').attr('data-filter');
            
            $mk_container.isotope('appended', $newElems);
            $mk_container.isotope({
              filter: ''
            });
            $mk_container.isotope({
              filter: selected_item
            });


            setTimeout(function() {
              $newElems.show();

              loop_audio_init();
              mk_portfolio_ajax();
              mk_newspaper_comments_share();
              mk_ajax_lightbox_init();
              mk_social_share();
              mk_theme_toggle_box();
              mk_swipe_slider();
              ajaxStylesInjector();

              $mk_container.isotope('layout');
            }, 450);
          });
        }

      );

      /* Loading elements based on scroll window */
      if ($this.find('.mk-theme-loop').hasClass('load-button-style')) {
        $(window).unbind('.infscr');
        $load_button.click(function() {

          $mk_container.infinitescroll('retrieve');

          return false;

        });
      }

    } else {
      $load_button.hide();
    }
  });
}


$('.filter-faq li a').click(function() {

  $(this).parent().siblings().children().removeClass('current');
  $(this).addClass('current');

  var filterVal = $(this).attr('data-filter');
  var $filterContent = $(this).parent().parent().parent().next().next().find(".mk-faq-toggle");


  if (filterVal === '') {
    $filterContent.slideDown(200).removeClass('hidden');
  } else {
    $filterContent.each(function() {
      if (!$(this).hasClass(filterVal)) {
        $(this).slideUp(200).addClass('hidden');
      } else {
        $(this).slideDown(200).removeClass('hidden');
      }
    });
  }
  return false;
});;/* reload elements on reload */
/* -------------------------------------------------------------------- */

function mk_load_isotop_enabled_scripts() {
	if ($.exists('.mk-blog-container') || $.exists('.mk-portfolio-container') || $.exists('.mk-news-container') || $.exists('.mk-gallery-shortcode')) {
	    $(window).unbind('keydown');
	    loops_iosotop_init();
	    isotop_load_fix();
	}
}
;/* Fix isotop layout */
/* -------------------------------------------------------------------- */

function isotop_load_fix() {

  "use strict";



  if ($.exists('.mk-blog-container') || $.exists('.mk-portfolio-container') || $.exists('.mk-news-container') || $.exists('.mk-gallery-shortcode')) {
    $('.mk-blog-container, .mk-portfolio-container, .mk-news-container, .mk-gallery-shortcode').each(function () {
    	var $this = $(this);
      $this.animate({
        'opacity': 1
      }, 300).siblings('.mk-preloader').fadeOut(300);

      setTimeout(function(){
      	$this.siblings('.mk-pagination-holder').fadeIn(300)
      }, 1000);

    });
    
  }

}



;/* Recent Works Widget */
/* -------------------------------------------------------------------- */

function mk_portfolio_widget() {

  "use strict";

  $('.widget_recent_portfolio li').each(function () {

    $(this).find('.portfolio-widget-thumb').hover(function () {

      $(this).siblings('.portfolio-widget-info').animate({
        'opacity': 1
      }, 200);
    }, function () {

      $(this).siblings('.portfolio-widget-info').animate({
        'opacity': 0
      }, 200);
    });

  });
}


;/* Contact Form */
/* -------------------------------------------------------------------- */

function mk_contact_form() {

  "use strict";

  if ($.tools.validator != undefined) {
    $.tools.validator.addEffect("contact_form", function(errors) {
      $.each(errors, function(index, error) {
        var input = error.input;

        input.addClass('mk-invalid');
      });
    }, function(inputs) {
      inputs.removeClass('mk-invalid');
    });

    $(".captcha-change-image").on("click", function(e) {
        e.preventDefault();
        changeCaptcha();
    });

    $(".captcha-form").each(function() {
      $(this).on("focus", function() {
        $(this).attr("placeholder", mk_captcha_placeholder).removeClass('contact-captcha-invalid contact-captcha-valid');
      });
    })

    var changeCaptcha = function() {
        $(".captcha-image").attr("src", mk_theme_dir + "/captcha/captcha.php?"+Math.random()); 
    }

    var sendForm;
    var checkCaptcha = function(form, enteredCaptcha) {
        $.get( mk_theme_dir + "/captcha/captcha-check.php", { captcha: enteredCaptcha }).done(function( data ) {
          if(data != "ok") {
            changeCaptcha();
            form.find(".captcha-form").val("").addClass('contact-captcha-invalid').attr("placeholder", mk_captcha_invalid_txt);
          } else {
            sendForm();
            changeCaptcha();
            form.find(".captcha-form").val("").addClass('contact-captcha-valid').attr("placeholder", mk_captcha_correct_txt);
          }
        });
    }

    $('.mk-contact-form').validator({
      effect: 'contact_form'
    }).submit(function(e) {
      var form = $(this);
      if (!e.isDefaultPrevented()) {

        var data = {
          action: 'mk_contact_form',
          to: form.find('input[name="contact_to"]').val().replace("*", "@"),
          name: form.find('input[name="contact_name"]').val(),
          last_name: form.find('input[name="contact_last_name"]').val(),
          phone: form.find('input[name="contact_phone"]').val(),
          email: form.find('input[name="contact_email"]').val(),
          website: form.find('input[name="contact_website"]').val(),
          content: form.find('textarea[name="contact_content"]').val()
        };

        sendForm = function() {
          progressButton.loader(form);
          $.post(ajaxurl, data, function(response) {
            form.find('.mk-contact-loading').fadeOut('slow');
            form.find('input').val('');
            form.find('textarea').val('');
            progressButton.success(form);
          });
        }; 

        var enteredCaptcha = form.find('input[name="captcha"]').val();

        if(form.find('.captcha-form').length){
          checkCaptcha(form, enteredCaptcha);
        } else {
          sendForm();
        }

        e.preventDefault();
      }
    });

  }
}

/* Ajax Login Form */
/* -------------------------------------------------------------------- */

function mk_login_form() {

  $('form.mk-login-form').each(function() {
    var $this = $(this);
    $this.on('submit', function(e) {
      $('p.mk-login-status', $this).show().text(ajax_login_object.loadingmessage);
      $.ajax({
        type: 'POST',
        dataType: 'json',
        url: ajax_login_object.ajaxurl,
        data: {
          'action': 'ajaxlogin',
          'username': $('#username', $this).val(),
          'password': $('#password', $this).val(),
          'security': $('#security', $this).val()
        },
        success: function(data) {
          $('p.mk-login-status', $this).text(data.message);
          if (data.loggedin === true) {
            document.location.href = ajax_login_object.redirecturl;
          }
        }
      });
      e.preventDefault();
    });
  });
}


/* Progress Button */
/* -------------------------------------------------------------------- */

var progressButton = {
    loader: function(form) {
        var $form = form,
            progressBar = $form.find(".mk-progress-button .mk-progress-inner"),
            buttonText = $form.find(".mk-progress-button .mk-progress-button-content"),
            progressButton = new TimelineLite();

        progressButton
            .to(progressBar, 0, {
                width: "100%",
                scaleX: 0,
                scaleY: 1
            })
            .to(buttonText, .3, {
                y: -5
            })
            .to(progressBar, 1.5, {
                scaleX: 1,
                ease: Power2.easeInOut
            }, "-=.1")
            .to(buttonText, .3, {
                y: 0
            })
            .to(progressBar, .3, {
                scaleY: 0
            });
    },

    success: function(form) {
        var $form = form,
            buttonText = $form.find(".mk-button .mk-progress-button-content, .mk-contact-button .mk-progress-button-content"),
            successIcon = $form.find(".mk-progress-button .state-success"),
            progressButtonSuccess = new TimelineLite({
                onComplete: hideSuccessMessage
            });

        progressButtonSuccess
            .to(buttonText, .3, {
                paddingRight: 20,
                ease: Power2.easeInOut
            }, "+=1")
            .to(successIcon, .3, {
                opacity: 1
            })
            .to(successIcon, 2, {
                opacity: 1
            });

        function hideSuccessMessage() {
            progressButtonSuccess.reverse()
        }
    },

    error: function(form) {
        var $form = form,
            buttonText = $form.find(".mk-button .mk-progress-button-content, .mk-contact-button .mk-progress-button-content"),
            errorIcon = $form.find(".mk-progress-button .state-error"),
            progressButtonError = new TimelineLite({
                onComplete: hideErrorMessage
            });

        progressButtonError
            .to(buttonText, .3, {
                paddingRight: 20
            }, "+=1")
            .to(errorIcon, .3, {
                opacity: 1
            })
            .to(errorIcon, 2, {
                opacity: 1
            });

        function hideErrorMessage() {
            progressButtonError.reverse()
        }
    }
};/* Blog Loop Carousel Shortcode */
/* -------------------------------------------------------------------- */


function mk_blog_carousel() {

  "use strict";

  if (!$.exists('.mk-blog-showcase')) {
    return;
  }
  $('.mk-blog-showcase ul li').each(function () {

    $(this).on('hover', function () {

      $(this).siblings('li').removeClass('mk-blog-first-el').end().addClass('mk-blog-first-el');

    });

  });


}



;/* Header Fixed */
function mk_header_scripts() {


  if($(window).width() < mk_responsive_nav_width || !($.exists('#mk-header .mk-header-holder'))) return false;



  var $header = $('#mk-header'),
    $sticky_style = $header.attr('data-sticky-style'),
    $sticky_offset = $header.attr('data-sticky-offset'),
    $header_style = $header.attr('data-header-style'),
    $ChopScroll_speed = 100;   

  if ($sticky_style === 'lazy') {
    var elSelector    = '.mk-header-holder',
      elClassHidden = 'header--hidden',
      throttleTimeout = 500,
      $element    = $( elSelector );

    if( !$element.length ) return true;

    var $window     = $( window ),
      wHeight     = 0,
      wScrollCurrent  = 0,
      wScrollBefore = 0,
      wScrollDiff   = 0,
      $document   = $( document ),
      dHeight     = 0,

      throttle = function( delay, fn )
      {
        var last, deferTimer;
        return function()
        {
          var context = this, args = arguments, now = +new Date;
          if( last && now < last + delay )
          {
            clearTimeout( deferTimer );
            deferTimer = setTimeout( function(){ last = now; fn.apply( context, args ); }, delay );
          }
          else
          {
            last = now;
            fn.apply( context, args );
          }
        };
      };

    $window.on( 'scroll', throttle( throttleTimeout, function()
    {
      dHeight     = $document.height();
      wHeight     = $window.height();
      wScrollCurrent  = $window.scrollTop();
      wScrollDiff   = wScrollBefore - wScrollCurrent;

      if( wScrollCurrent <= 0 ) // scrolled to the very top; element sticks to the top
        $element.removeClass( elClassHidden );

      else if( wScrollDiff > 0 && $element.hasClass( elClassHidden ) ) // scrolled up; element slides in
        $element.removeClass( elClassHidden );

      else if( wScrollDiff < 0 ) // scrolled down
      {
        if( wScrollCurrent + wHeight >= dHeight && $element.hasClass( elClassHidden ) ) // scrolled to the very bottom; element slides in
          $element.removeClass( elClassHidden );

        else // scrolled down; element slides out
          $element.addClass( elClassHidden );
      }

      wScrollBefore = wScrollCurrent;
    }));

  }
    

  if($header_style != 2) {
    if ($sticky_offset == 'header') {
      $sticky_offset = parseInt($header.attr('data-height'));
    } else {
      $sticky_offset = String($sticky_offset);
      $sticky_offset = $sticky_offset;
      
    }
  } else {

    var wp_admin_height = $header_toolbar_h = 0;

    if ($.exists('.mk-header-toolbar')) {
        $header_toolbar_h = $('.mk-header-toolbar').outerHeight();
    }

    $ChopScroll_speed = 10;
    $sticky_offset = parseInt($header.attr('data-height')) + $header_toolbar_h;
    $sticky_offset = $sticky_offset;

  }

  var scrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop,
      viewportPercent = $(window).height()/100,
      $sticky_offset = Math.abs(parseInt($sticky_offset));
      
      if($header.data('sticky-offset') == 'header') {    
          var offsetCalc = $sticky_offset;
      } else {
          var offsetCalc = (viewportPercent * $sticky_offset);
      }
   

  var pageIntro;
  var stick_it = function() {
      scrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
      pageIntro = $('body').data('intro');

      if (!pageIntro) {
        if (scrollY > offsetCalc && scrollY > 0) {
            if ($sticky_style == 'fixed') {
              $header.addClass('header-sticky-ready');
            } 
            else if ($header_style == 2) {
              if(!$header.hasClass('sticky-style-')) {
                $header.addClass('header-sticky-ready');
              }
            }
            else {
              if(!$header.hasClass('header-sticky-ready')) {
                $header.addClass('header-sticky-prepare');
                $('.mk-header-padding-wrapper').addClass('enable-padding');
                setTimeout(function() {
                  $header.addClass('header-sticky-ready');
                }, 300);  
              }
            }
        } 
        else {
              
              $header.removeClass('header-sticky-ready');
              $header.removeClass('header-sticky-prepare');
              $('.mk-header-padding-wrapper').removeClass('enable-padding');
        }
      }
    }

    new ChopScroll(stick_it, $ChopScroll_speed);
}
;/* Header Search Form */
/* -------------------------------------------------------------------- */

function mk_header_searchform() {


  "use strict";

  $('.mk-header-toolbar #mk-header-searchform .text-input').on('focus', function () {

    if ($('.mk-header-toolbar #mk-header-searchform .text-input').hasClass('on-close-state')) {
      $('.mk-header-toolbar #mk-header-searchform .text-input').removeClass('on-close-state').animate({
        'width': '200px'
      }, 200);
      return false;
    }
  });

  $(".mk-header-toolbar .mk-header-searchform").click(function (event) {
    if (event.stopPropagation) {
      event.stopPropagation();
    } else if (window.event) {
      window.event.cancelBubble = true;
    }
  });


  $("html").click(function () {
    $(this).find(".mk-header-toolbar #mk-header-searchform .text-input").addClass('on-close-state').animate({
      'width': 90
    }, 300);
  });

}



;/* Milestone Number Shortcode */
/* -------------------------------------------------------------------- */

function mk_milestone() {

  "use strict";

  if ($.exists('.mk-milestone')) {

    var play;
    if ( !is_touch_device() ) {
      play = ':in-viewport';
    }  else {
      play = '';
    }

    $('.mk-milestone'+play).each(function () {
      var el_this = $(this),
        stop_number = el_this.find('.milestone-number').attr('data-stop'),
        animation_speed = parseInt(el_this.find('.milestone-number').attr('data-speed'));

      if (!$(this).hasClass('scroll-animated')) {
        $(this).addClass('scroll-animated');

        $({
          countNum: el_this.find('.milestone-number').text()
        }).animate({
          countNum: stop_number
        }, {
          duration: animation_speed,
          easing: 'linear',
          step: function () {
            el_this.find('.milestone-number').text(Math.floor(this.countNum));
          },
          complete: function () {
            el_this.find('.milestone-number').text(this.countNum);
          }
        });
      }
    });

  }
}



;/* Skill Meter and Charts */
/* -------------------------------------------------------------------- */
function mk_skill_meter() {
    "use strict";
    if ($.exists('.mk-skill-meter')) {
        if (!is_touch_device()) {
            $(".mk-skill-meter .progress-outer:in-viewport").each(function() {
                var $this = $(this);
                if (!$this.hasClass('scroll-animated')) {
                    $this.addClass('scroll-animated');
                    $this.animate({
                        width: $(this).attr("data-width") + '%'
                    }, 2000);
                }
            });
        } else {
            $(".mk-skill-meter .progress-outer").each(function() {
                var $this = $(this);
                if (!$this.hasClass('scroll-animated')) {
                    $this.addClass('scroll-animated');
                    $this.css({
                        width: $(this).attr("data-width") + '%'
                    });
                }
            });
        }
    }
}

function mk_charts() {
    "use strict";
    if ($.exists('.mk-chart')) {
        if (!is_touch_device()) {
            // $(window).on("load", function () {
            $('.mk-chart:in-viewport').each(function() {
                var $this, $parent_width, $chart_size;
                $this = $(this);
                $parent_width = $(this).parent().width();
                $chart_size = parseInt($this.attr('data-barSize'));
                if ($parent_width < $chart_size) {
                    $chart_size = $parent_width;
                    $this.css('line-height', $chart_size);
                    $this.find('i').css({
                        'line-height': $chart_size + 'px'
                    });
                    $this.css({
                        'line-height': $chart_size + 'px'
                    });
                }
                // if (!$this.hasClass('chart-animated')) {
                $this.easyPieChart({
                    animate: 1300,
                    lineCap: 'butt',
                    lineWidth: $this.attr('data-lineWidth'),
                    size: $chart_size,
                    barColor: $this.attr('data-barColor'),
                    trackColor: $this.attr('data-trackColor'),
                    scaleColor: 'transparent',
                    onStep: function(value) {
                        this.$el.find('.chart-percent span').text(Math.ceil(value));
                    }
                });
                // }
            });
            // });
        } else {
            $('.mk-chart').each(function() {
                var $this, $parent_width, $chart_size;
                $this = $(this);
                $parent_width = $(this).parent().width();
                $chart_size = parseInt($this.attr('data-barSize'));
                if ($parent_width < $chart_size) {
                    $chart_size = $parent_width;
                    $this.css('line-height', $chart_size);
                    $this.find('i').css({
                        'line-height': $chart_size + 'px'
                    });
                    $this.css({
                        'line-height': $chart_size + 'px'
                    });
                }
                $this.easyPieChart({
                    animate: 1300,
                    lineCap: 'butt',
                    lineWidth: $this.attr('data-lineWidth'),
                    size: $chart_size,
                    barColor: $this.attr('data-barColor'),
                    trackColor: $this.attr('data-trackColor'),
                    scaleColor: 'transparent',
                    onStep: function(value) {
                        this.$el.find('.chart-percent span').text(Math.ceil(value));
                    }
                });
            });
        }
    }
};/* Scroll function for main navigation on one page concept */
/* -------------------------------------------------------------------- */

var mk_hash_loaded = false;

function mk_main_nav_scroll() {

  	"use strict";

  	var lastId, 
	  	topMenu = $("#mk-main-navigation, .mk-vm-menu, #menu-hegemone, #mk-responsive-nav"),
		menuItems = topMenu.find(".menu-item a");


  	menuItems.each(function() {
		var $this = $(this),
			href_attr = $this.attr('href'),
			href;

		if (typeof href_attr !== 'undefined' && href_attr !== false) {
			href = $this.attr("href").split('#')[0];
		} else {
			href = "";
		}

		// Check if the link has # and if it's fallowed by a string (ID name)
		if(typeof $this.attr("href").split('#')[1] !== 'undefined' && 
		  $this.attr("href").split('#')[1].length) {
		 	$this.addClass("one-page-nav-item");
		}

		if(href == window.location.href.split('#')[0] && 
		  (typeof $this.attr("href").split('#')[1] != 'undefined')) {
		  	$this.attr("href", "#" + $this.attr("href").split('#')[1])
				 .parent().removeClass("current-menu-item");
		}
	});

  var onePageMenuItems = $('.one-page-nav-item'),
	wp_admin_height = 0,
	header_height = 0;

  var scrollItems = onePageMenuItems.map(function() {
	var item = $(this).attr("href");
	if (/^#\w/.test(item) && $(item).length) {
	  return $(item);
	}
  });


  if ($.exists("#wpadminbar")) {
	wp_admin_height = $("#wpadminbar").height();
  }

  if (!$.exists('.mk-vm-menuwrapper')) {
	header_height = parseInt($('#mk-header').attr('data-sticky-height'));
  }


  var offsetTop = 0;

  // Maki: switched from delegation to direct binding, as it wasn't working 
  // with menu style 4 for unknown reason. Invoking of that function is moved to the end of quee 
  // so responsive menu should be there already (both for load and resize).
  // Previous solution looked like line below: (keep it if we need to get back to that version)
  // topMenu.on('click', '.one-page-nav-item', function(e) {
  $('.one-page-nav-item').on('click', function(e) {
	var href = $(this).attr("href");
	if (typeof $(href).offset() != 'undefined') {
	  var href_top = $(href).offset().top;
	} else {
	  var href_top = 0;
	}

	if($.exists('.mk-fullscreen-nav-close')) {
	  $('.mk-fullscreen-nav-close').trigger('click');
	}

	if (!$(this).hasClass('mk-nav-open')) {
	  $('#mk-responsive-nav').slideUp(300);
	  $('body').removeClass('mk-opened-nav');
	}

	if ($.exists("#wpadminbar")) {
	  var wp_admin_height = $("#wpadminbar").height();
	  // console.log(wp_admin_height);
	} else {
	  wp_admin_height = 0;
	}

	if ($(window).width() <= mk_responsive_nav_width) {
	  header_height = 0;
	}


	// For lazy header we stick to 0 height value as it gets hidden on scroll down
	if($('#mk-header').attr('data-sticky-style') === 'lazy') {
		header_height = 0;
	}

	offsetTop = href === "#" ? 0 : href_top - (wp_admin_height + header_height - 1);

	$('html, body').stop().animate({
	  scrollTop: offsetTop
	}, {
	  duration: 1200,
	  easing: "easeInOutExpo"
	});
	//TweenLite.to(window, 1.2, {scrollTo:{y: offsetTop}, ease:Expo.easeInOut});

	e.preventDefault();
  });


  function hashLink() {
	var hash = window.location.hash,
		hashLink;

	// check if link has # and string / ID after it
	if(hash.length && hash.substring(1).length && !mk_hash_loaded) {

  		hashLink = hash.substring(1);

		setTimeout(function() {
		  window.scrollTo(0, 0);
		}, 1);

		// Assign hashLink to corresponding DOM element and execute smooth scroll when page loads
		var scrollToHash = function() {
			var $target = $('#' + hashLink),
				offsetHash = $target.offset().top,
			 	offset;


			offset = offsetHash - (abb.modules.theme_header.adminHeight() + header_height - 1);

			setTimeout(function() {
				$('html, body').stop().animate({
					scrollTop: offset
					}, {
			  		duration: 1200,
			  		easing: "easeInOutExpo"
				});
		  	}, 500);
		}

		$(window).load(scrollToHash());
		mk_hash_loaded = true;
	}
  }
  hashLink();

  new ChopScroll(function() {
	if (!scrollItems.length) return false;
	var fromTop = $(window).scrollTop() + (wp_admin_height + header_height);
	var cur = scrollItems.map(function() {
	  if ($(this).offset().top - 200 < fromTop) return this; // This is purely empirical - we don't look at the top of screen but a little bit lower, so lets switch section at this point.
	});
	cur = cur[cur.length - 1];
	var id = cur && cur.length ? cur[0].id : "";

	if (lastId !== id) {
	  lastId = id;

	  onePageMenuItems.parent().removeClass("current-menu-item current-menu-ancestor current-menu-parent");
	  if (id.length) {
		onePageMenuItems.filter("[href=#" + id + "]").parent().addClass("current-menu-item");
	  }
	}
  }, 200);
}



// Move to head tag
function beforeHashlinkAnim() {
	var hash = window.location.hash;

	if(hash.length && hash.substring(1).length) {
		setTimeout(function() {
		  window.scrollTo(0, 0);
		}, 1);
	}
}
beforeHashlinkAnim();
;/* Swipe Slideshow */
/* -------------------------------------------------------------------- */


function mk_swipe_slider() {


  "use strict";

  $('.mk-swiper-slider').each(function() {

      if ($(this).data('state') != 'init') {

        $(this).data('state', 'init');

        var $this = $(this),
          $thumbs = $this.parent().siblings('.gallery-thumbs-small'),
          $next_arrow = $this.find('.mk-swiper-next'),
          $prev_arrow = $this.find('.mk-swiper-prev'),
          $direction = $this.attr('data-direction'),
          $pagination = $this.attr('data-pagination') == "true" ? true : false,
          $slideshowSpeed = $this.attr('data-slideshowSpeed'),
          $animationSpeed = $this.attr('data-animationSpeed'),
          $controlNav = $this.attr('data-controlNav') == "true" ? true : false,
          $directionNav = $this.attr('data-directionNav') == "true" ? true : false,
          $freeModeFluid = $this.attr('data-freeModeFluid') == "true" ? true : false,
          $freeMode = $this.attr('data-freeMode') == "true" ? true : false,
          $mousewheelControl = $this.attr('data-mousewheelControl') == "true" ? true : false,
          $loop = $this.attr('data-loop') == "true" ? true : false,
          $slidesPerView = $this.attr('data-slidesPerView'),
          vieportWidth = $(window).width();

        if ($pagination === true) {
          var $pagination_class = '#' + $this.attr('id') + ' .swiper-pagination';
        } else {
          var $pagination_class = false;
        }

        if ($slidesPerView != 'auto' && $slidesPerView > 2) {
          if (vieportWidth > 768) {
            var slidesOnInit = $slidesPerView;
          }
          if (vieportWidth <= 768) {
            var slidesOnInit = 2;
          }
          if (vieportWidth <= 568) {
            var slidesOnInit = 1;
          }
        } else {
          slidesOnInit = $slidesPerView;
        }

        var mk_swiper = $(this).swiper({
          mode: $direction,
          loop: $loop,
          freeMode: $freeMode,
          pagination: $pagination_class,
          freeModeFluid: $freeModeFluid,
          autoplay: $slideshowSpeed,
          speed: $animationSpeed,
          calculateHeight: true,
          grabCursor: true,
          useCSS3Transforms: false,
          mousewheelControl: $mousewheelControl,
          paginationClickable: true,
          slidesPerView: slidesOnInit,
          resizeReInit: true,
          onSwiperCreated: function(swiper) {

          },
          onSlideChangeStart: function() {
            $thumbs.find('.active-item').removeClass('active-item');
            $thumbs.find('a').eq(mk_swiper.activeIndex).addClass('active-item');
          }
        });


        $prev_arrow.click(function(e) {
          mk_swiper.swipePrev();
        });

        $next_arrow.click(function(e) {
          mk_swiper.swipeNext();
        });


        $thumbs.find('a').on('touchstart mousedown', function(e) {
          e.preventDefault();
          $thumbs.find('.active-item').removeClass('active-item');
          $(this).addClass('active-item');
          mk_swiper.swipeTo($(this).index());
        });

        $thumbs.find('a').click(function(e) {
          e.preventDefault();
        });


        // change per view size for smaller screens to fixed value on resize
        if ($slidesPerView != 'auto' && $slidesPerView > 2) {
          $(window).on("resize", function() {
            vieportWidth = $(window).width();

            if (vieportWidth > 768) {
              mk_swiper.params.slidesPerView = $slidesPerView;
              setTimeout(function() {
                mk_swiper.reInit();
                setTimeout(mk_swiper.swipePrev(), 200);
              }, 200);
              // console.log('full'); 
            }
            if (vieportWidth <= 768) {
              mk_swiper.params.slidesPerView = 2;
              setTimeout(function() {
                mk_swiper.reInit();
                setTimeout(mk_swiper.swipePrev(), 200);
              }, 200);
              // console.log('medium');
            }
            if (vieportWidth <= 568) {
              mk_swiper.params.slidesPerView = 1;
              setTimeout(function() {
                mk_swiper.reInit();
                setTimeout(mk_swiper.swipePrev(), 200);
              }, 200);
              // console.log('small');
            }

          });
      }


        }

      });




};/* Edge Slideshow */
/* -------------------------------------------------------------------- */

  function mk_edge_slider() {
    $('.mk-edge-slider').each(function() {
      var $slider_wrapper = $(this),
        $theme_container = $('#mk-theme-container'),
        $next_arrow = $slider_wrapper.find('.mk-edge-next'),
        $prev_arrow = $slider_wrapper.find('.mk-edge-prev'),
        $pause = $slider_wrapper.attr('data-pause'),
        $first_el = $slider_wrapper.attr('data-first'),
        $speed = $slider_wrapper.attr('data-speed'),
        $animation = $slider_wrapper.attr('data-animation'),
        $height = $slider_wrapper.attr('data-height'),
        $fullHeight = $slider_wrapper.attr('data-fullHeight'),
        $header_height = 0,
        edge_height = 0,
        adminbar = 0,
        loop = true,
        $pagination = $slider_wrapper.attr('data-pagination') == "true" ? true : false;

      if ($pagination === true) {
        var $pagination_class = '#' + $slider_wrapper.attr('id') + ' .swiper-pagination';

        $($pagination_class).on('click', 'span', function(e) {
          e.preventDefault();
          mk_swiper.swipeTo($(this).index(), 500);
        });

        $slider_wrapper.find('.edge-skip-slider').css('bottom', '14%');
      } else {
        var $pagination_class = false;
      }

      if($animation == "kenburned") {
        if(BrowserDetect.browser === 'IE' && BrowserDetect.version  < 10) {
          $animation = 'slide';
          $slider_wrapper.attr('data-animation', 'slide')
        }
        loop = false;
      }


      var animationDimensions = function() {
        mk_edge_slider_resposnive($slider_wrapper);

          if ($.exists('#mk-header.sticky-header') && !$('#mk-header').hasClass('transparent-header')) {
              $header_height = parseInt($('#mk-header.sticky-header').attr('data-sticky-height'));
          }
          if ($.exists('#wpadminbar')) {
              adminbar = $('#wpadminbar').height();
          }
          if ($fullHeight === 'true') {
              if($('#mk-header').hasClass('header-style-4')) { // vertical header does not count into full height
                $header_height = 0;
              }
              edge_height = $(window).height() - $header_height - adminbar;
          } else {
              edge_height = $height;
          }
          // console.log('edge_height: ' + edge_height);
      }


      $slider_wrapper.find('.mk-animate-element').removeClass('mk-animate-element fade-in scale-up right-to-left left-to-right bottom-to-top top-to-bottom flip-x flip-y');

      var mk_swiper = $slider_wrapper.swiper({
        mode: 'horizontal',
        loop: loop,
        grabCursor: true,
        useCSS3Transforms: true,
        mousewheelControl: false,
        pagination: $pagination_class,
        paginationClickable: true,
        freeModeFluid: true,
        speed: $speed,
        autoplay: $pause,
        progress: true,
        autoplayDisableOnInteraction: false,
        onSwiperCreated: function(swiper) {

          var current_eq, prev_eq, next_eq;
          if(loop == false) {
            current_eq = 0;
            prev_eq = swiper.slides.length - 1;
            next_eq = 1;
          } else {
            current_eq = 1;
            prev_eq = 0;
            next_eq = 2;           
          }

          if ($theme_container.hasClass('mk-transparent-header')) {
            if ($first_el == 'true') {
              $('#mk-header.transparent-header').removeClass('light-header-skin dark-header-skin').addClass($slider_wrapper.find('.swiper-slide').eq(current_eq).attr('data-header-skin') + '-header-skin');
            }
          }

          var currentSlide = $slider_wrapper.find('.swiper-slide').eq(current_eq),
            currentSkin = $slider_wrapper.find('.swiper-slide').eq(current_eq).attr("data-header-skin");

          //if ($first_el == 'true') {    
          $('.mk-edge-nav a').attr('data-skin', currentSkin);
          $('.swiper-pagination').attr('data-skin', currentSkin);
          $('.edge-skip-slider').attr('data-skin', currentSkin);
          //}

          // if (mk_detect_ie() == false) {

            var prev_active_slide = $slider_wrapper.find('.swiper-slide').eq(prev_eq).find('.edge-slide-content .edge-title').first().text(),
              next_active_slide = $slider_wrapper.find('.swiper-slide').eq(next_eq).find('.edge-slide-content .edge-title').first().text();
            //console.log(prev_active_slide + "---" + next_active_slide);
            var prev_active_slide_bg = $slider_wrapper.find('.swiper-slide').eq(prev_eq).find('.mk-section-image').css('background-image'),
              next_active_slide_bg = $slider_wrapper.find('.swiper-slide').eq(next_eq).find('.mk-section-image').css('background-image');
            // console.log(prev_active_slide_bg + "---" + next_active_slide_bg);
            var prev_active_slide_bg_video = $slider_wrapper.find('.swiper-slide').eq(prev_eq).find('.mk-video-section-touch').css('background-image'),
              next_active_slide_bg_video = $slider_wrapper.find('.swiper-slide').eq(next_eq).find('.mk-video-section-touch').css('background-image');

            //console.log(prev_active_slide_bg_video);
            //console.log(next_active_slide_bg_video);

            var prev_active_slide_bg_color = $slider_wrapper.find('.swiper-slide').eq(prev_eq).find('.mk-section-image').css('background-color'),
              next_active_slide_bg_color = $slider_wrapper.find('.swiper-slide').eq(next_eq).find('.mk-section-image').css('background-color');

            if (prev_active_slide.length > 1) {
              $prev_arrow.find('.prev-item-caption').show().text(prev_active_slide);
              // console.log(prev_active_slide);
            }

            if (typeof prev_active_slide_bg !== 'undefined' && prev_active_slide_bg != "none") {
              $prev_arrow.find('.edge-nav-bg').show().css({
                'background-image': prev_active_slide_bg
              });
              // console.log(prev_active_slide_bg);
            } else if (typeof prev_active_slide_bg_video !== 'undefined' && prev_active_slide_bg_video != "none") {
              $prev_arrow.find('.edge-nav-bg').show().css({
                'background-image': prev_active_slide_bg_video
              });
              // console.log(prev_active_slide_bg_video);
            } else if (prev_active_slide_bg_color !== 'undefined') {
              $prev_arrow.find('.edge-nav-bg').show().css({
                'background-color': prev_active_slide_bg_color
              });
              // console.log(prev_active_slide_bg_color);
            }

            if (typeof next_active_slide !== 'undefined') {
              $next_arrow.find('.next-item-caption').show().text(next_active_slide);
            }

            if (typeof next_active_slide_bg !== 'undefined' && next_active_slide_bg != "none") {
              $next_arrow.find('.edge-nav-bg').show().css({
                'background-image': next_active_slide_bg
              });
            } else if (typeof next_active_slide_bg_video !== 'undefined' && next_active_slide_bg_video != "none") {
              $next_arrow.find('.edge-nav-bg').show().css({
                'background-image': next_active_slide_bg_video
              });
            } else if (typeof next_active_slide_bg_color !== 'undefined') {
              $next_arrow.find('.edge-nav-bg').show().css({
                'background-color': next_active_slide_bg_color
              });
            }

            if (!$('#mk-header').hasClass('transparent-header-sticky')) {
              if ($first_el == 'true') {
                $('#mk-header.transparent-header').removeClass('light-header-skin dark-header-skin').addClass($slider_wrapper.find('.swiper-slide').eq(current_eq).attr('data-header-skin') + '-header-skin');
              }
            }



          // } else {
          //   $next_arrow.find('.next-item-caption, .edge-nav-bg').css('display', 'none');
          //   $prev_arrow.find('.prev-item-caption, .edge-nav-bg').css('display', 'none');
          // }

          if ($pagination === true) {
            $('#' + $slider_wrapper.attr('id') + ' .swiper-pagination span').append('<a href="#"></a>');
          }


        },
        onSlideChangeEnd: function() {


          var current_eq, prev_eq, next_eq;
          if(loop == false) {
            current_eq = mk_swiper.activeIndex;
            prev_eq = mk_swiper.activeIndex -1 ;
            next_eq = mk_swiper.activeIndex + 1;

            if(prev_eq < 0) {
              prev_eq = mk_swiper.slides.length - 1;
            }
            if(next_eq > mk_swiper.slides.length - 1) {
              next_eq = 0;
            }
          } else {
            current_eq = mk_swiper.activeLoopIndex + 1;
            prev_eq = mk_swiper.activeLoopIndex;
            next_eq = mk_swiper.activeLoopIndex + 2;           
          }

          if ($theme_container.hasClass('mk-transparent-header')) {
            if ($first_el == 'true') {
              $('#mk-header.transparent-header').removeClass('light-header-skin dark-header-skin').addClass($(mk_swiper.getSlide(current_eq)).attr('data-header-skin') + '-header-skin');
            }
          }

          // if (mk_detect_ie() == false) {

            var currentSlide = $(mk_swiper.activeSlide()),
              currentSkin = currentSlide.attr("data-header-skin");

            //if ($first_el == 'true') {    
            $('.mk-edge-nav a').attr('data-skin', currentSkin);
            $('.swiper-pagination').attr('data-skin', currentSkin);
            $('.edge-skip-slider').attr('data-skin', currentSkin);
            //  }

            var prev_active_slide = $(mk_swiper.getSlide(prev_eq)).find('.edge-slide-content .edge-title').text(),
              next_active_slide = $(mk_swiper.getSlide(next_eq)).find('.edge-slide-content .edge-title').text();

            var prev_active_slide_bg = $(mk_swiper.getSlide(prev_eq)).find('.mk-section-image').css('background-image'),
              next_active_slide_bg = $(mk_swiper.getSlide(next_eq)).find('.mk-section-image').css('background-image');

            var prev_active_slide_bg_video = $(mk_swiper.getSlide(prev_eq)).find('.mk-video-section-touch').css('background-image'),
              next_active_slide_bg_video = $(mk_swiper.getSlide(next_eq)).find('.mk-video-section-touch').css('background-image');

            var prev_active_slide_bg_color = $(mk_swiper.getSlide(prev_eq)).find('.mk-section-image').css('background-color'),
              next_active_slide_bg_color = $(mk_swiper.getSlide(next_eq)).find('.mk-section-image').css('background-color');

            if (typeof prev_active_slide !== 'undefined') {
              $prev_arrow.find('.prev-item-caption').show().text(prev_active_slide);
              // console.log(prev_active_slide);
            }

            if (typeof prev_active_slide_bg !== 'undefined' && prev_active_slide_bg != "none") {
              $prev_arrow.find('.edge-nav-bg').show().css({
                'background-image': prev_active_slide_bg
              });
              // console.log(prev_active_slide_bg);
            } else if (typeof prev_active_slide_bg_video !== 'undefined' && prev_active_slide_bg_video != "none") {
              $prev_arrow.find('.edge-nav-bg').show().css({
                'background-image': prev_active_slide_bg_video
              });
              // console.log(prev_active_slide_bg_video);
            } else if (typeof prev_active_slide_bg_color !== 'undefined') {
              $prev_arrow.find('.edge-nav-bg').show().css({
                'background-color': prev_active_slide_bg_color
              });
              // console.log(prev_active_slide_bg_color);
            }

            if (typeof next_active_slide !== 'undefined') {
              $next_arrow.find('.next-item-caption').show().text(next_active_slide);
            }

            if (typeof next_active_slide_bg !== 'undefined' && next_active_slide_bg != "none") {
              $next_arrow.find('.edge-nav-bg').show().css({
                'background-image': next_active_slide_bg
              });
            } else if (typeof next_active_slide_bg_video !== 'undefined' && next_active_slide_bg_video != "none") {
              $next_arrow.find('.edge-nav-bg').show().css({
                'background-image': next_active_slide_bg_video
              });
            } else if (typeof next_active_slide_bg_color !== 'undefined') {
              $next_arrow.find('.edge-nav-bg').show().css({
                'background-color': next_active_slide_bg_color
              });
            }

            if (!$('#mk-header').hasClass('transparent-header-sticky')) {
              if ($first_el == 'true') {
                $('#mk-header.transparent-header').removeClass('light-header-skin dark-header-skin').addClass($(mk_swiper.getSlide(current_eq)).attr('data-header-skin') + '-header-skin');
              }
            }


          // } else {
          //   $next_arrow.find('.next-item-caption, .edge-nav-bg').css('display', 'none');
          //   $prev_arrow.find('.prev-item-caption, .edge-nav-bg').css('display', 'none');
          // }

        },    
        onProgressChange: function(swiper){
                  for (var i = 0; i < swiper.slides.length; i++){

                      var slide = swiper.slides[i];
                      var progress = slide.progress;

                      // SLIDER ANIMATION EFFECTS

                      if($animation == "horizontal_curtain") {
                          var translateX, zIndex, transitionTiming;
                              translateX = progress*swiper.width;

                          if (progress<=0) {
                              zIndex = 1;
                              translateX = 0;
                              transitionTiming = 'ease';
                          }
                          else if (progress>0){
                              zIndex = 0;
                              translateX = (progress*swiper.width)/2;
                              transitionTiming = 'ease';
                          }

                          swiper.setTransform(slide,'translate3d('+(translateX/2)+'px,0,0)');
                          slide.style.webkitTransitionTimingFunction = transitionTiming;
                          slide.style.zIndex = zIndex;
                      }

                      if($animation == "perspective_flip") {
                          var translateX, translateY, rotateX;

                              translateX = progress*swiper.width;
                              translateY = progress*edge_height;

                          if (progress>=0) {
                              rotateX = 0;
                          }
                          else if (progress<0){
                              rotateX = 70;
                          }

                          swiper.setTransform(slide,'translate3d('+translateX+'px,'+ (-translateY) +'px,0) rotateX('+rotateX+'deg)');
                      }

                      if($animation == "vertical_slide") {
                          var translateX, translateY;

                              translateX = progress*swiper.width;
                              translateY = progress*edge_height;

                          swiper.setTransform(slide,'translate3d('+translateX+'px,'+ (-translateY) +'px,0)');
                      }

                      if($animation == "fade") {
                          var translate, opacity, zIndex;

                          if (progress == 0) {
                              zIndex = 1;
                          }
                          else {
                              zIndex = 0;
                          }
                              opacity = 1 - Math.min(Math.abs(progress),1);
                              translate = progress*swiper.width;

                          swiper.setTransform(slide,'translate3d('+translate+'px,0,0)');
                          slide.style.opacity = opacity;
                          slide.style.zIndex = zIndex;
                      }

                      if($animation == "kenburned") {
                          var translateX, opacity, zIndex;

                          if (progress == 0) {
                              zIndex = 1;
                          }
                          else {
                              zIndex = 0;
                          }

                              translateX = progress*swiper.width;
                              opacity = 1 - Math.min(Math.abs(progress),1);

                          swiper.setTransform(slide,'translate3d('+translateX+'px,0,0)');
                          slide.style.opacity = opacity;
                          slide.style.zIndex = zIndex;

                      }

                      if($animation == "zoom_out") {
                          var scale, translateX, translateY, opacity, zIndex;

                              translateX = progress*swiper.width;

                          if (progress<=0) {
                              opacity = 1;
                              scale = 1;
                              zIndex = 1;
                              translateY = progress*edge_height;
                          }
                          else if (progress>0){
                              opacity = (1 - Math.min(Math.abs(progress),1))/2;
                              scale = 1 - Math.min(Math.abs(progress/2),1);
                              zIndex = 0;
                              translateY = 0;
                          }

                          swiper.setTransform(slide,'translate3d('+translateX+'px,'+ -translateY +'px,0)  scale('+scale+')');
                          slide.style.opacity = opacity;
                          slide.style.zIndex = zIndex;
                      }

                      if($animation == "zoom") {
                          var scale, scaleContent, translate, opacity, zIndex;

                          if (progress == 0) {
                              zIndex = 1;
                          }
                          else {
                              zIndex = 0;
                          }

                          if (progress<=0) {
                              opacity = 1 - Math.min(Math.abs(progress),1);
                              scale = 1 - Math.min(Math.abs(progress/12),1);
                              scaleContent = 1;
                              translate = progress*swiper.width;
                          }
                          else {
                              opacity = 0;
                              scale = 1 + Math.min(Math.abs(progress/6),1);
                              translate = progress*swiper.width;
                          }

                          // console.log(progress)

                          slide.style.opacity = opacity;
                          slide.style.zIndex = zIndex;
                          swiper.setTransform(slide,'translate3d('+translate+'px,0,0) scale('+scale+')');
                      }

                  }
                },
                onTouchStart:function(swiper){
                  for (var i = 0; i < swiper.slides.length; i++){
                    swiper.setTransition(swiper.slides[i], 0);
                  }
                },
                onSetWrapperTransition: function(swiper, speed) {
                  for (var i = 0; i < swiper.slides.length; i++){
                    swiper.setTransition(swiper.slides[i], speed);
                  }
                }
      });

      if(loop == true) {
        $prev_arrow.click(function(e) {
          mk_swiper.swipePrev();
          e.preventDefault();
        });

        $next_arrow.click(function(e) {
          mk_swiper.swipeNext();
          e.preventDefault();
        });
      } else {
        var first_eq = 0,
            last_eq = mk_swiper.slides.length - 1;

        $prev_arrow.click(function(e) {
          var current_eq = mk_swiper.activeIndex;
          if(current_eq == first_eq) {
            mk_swiper.swipeTo(last_eq);
          } else {
            mk_swiper.swipePrev();
          }
          e.preventDefault();
        });

        $next_arrow.click(function(e) {
          var current_eq = mk_swiper.activeIndex;
          if(current_eq == last_eq) {
            mk_swiper.swipeTo(first_eq);
          } else {
            mk_swiper.swipeNext();
          }
          e.preventDefault();
        });
      }


      $(window).load(animationDimensions());

      $(window).on("debouncedresize", function(event) {
          setTimeout(function() {
              animationDimensions();
          }, 50);
      });

  });
}


  function mk_edge_slider_resposnive(el) {
    "use strict";

      var $this = el,
        $items = $this.find('.edge-slider-holder, .swiper-slide'),
        $height = $this.attr('data-height'),
        $fullHeight = $this.attr('data-fullHeight'),
        $skip_header_fix = 0,
        $header_height = 0;

      var $window_height = $(window).outerHeight();


      if ($.exists('#wpadminbar')) {
        $header_height += $('#wpadminbar').outerHeight();
      }


      /* if ($.exists('.mk-header-toolbar')) {
        $header_height += $('.mk-header-toolbar').outerHeight();
      }*/


      if (!$('#mk-theme-container').hasClass('mk-transparent-header') && $.exists('.mk-header-holder') && !$('#mk-header').hasClass('header-style-4')) {
        $skip_header_fix += parseInt($('#mk-header').attr('data-height'));
        $header_height += $skip_header_fix;
      }


      if ($(window).width() < 780) {

        $window_height = 600;

      } else if ($fullHeight == 'true') {

        $window_height = $window_height - $header_height;

      } else {

        $window_height = $height;
      }

      $items.css('height', $window_height);

      $this.find('.swiper-slide').each(function() {


        var $this = $(this),
          $content = $this.find('.edge-slide-content');

        if ($this.hasClass('left_center') || $this.hasClass('center_center') || $this.hasClass('right_center')) {

          var $this_height_half = $content.outerHeight() / 2;
          if ($content.outerHeight() < $window_height) {
            var $window_half = $window_height / 2;
            $content.css('marginTop', ($window_half - $this_height_half));
          }

        }

        if ($this.hasClass('left_bottom') || $this.hasClass('center_bottom') || $this.hasClass('right_bottom')) {

          if ($content.outerHeight() < $window_height) {
            var $distance_from_top = $window_height - $content.outerHeight() - 90;
            $content.css('marginTop', ($distance_from_top));
          }
        }


      });

      var header_padding_fix = 0;
      header_padding_fix = parseInt($('#mk-header').attr('data-sticky-height'));

      // For lazy header we stick to 0 height value as it gets hidden on scroll down
      if($('#mk-header').attr('data-sticky-style') === 'lazy') {
        header_padding_fix = 0;
      }

      if ($('.mk-nav-responsive-link').css('display') != 'none') {
        $skip_header_fix += parseInt($('#mk-header').attr('data-height'));
        header_padding_fix = 0;
      }

      // console.log($header_height);
      var skip = $window_height - header_padding_fix + $skip_header_fix;


      $this.find('.edge-skip-slider').bind("click", function(e) {
        $("html, body").stop().animate({ scrollTop: skip }, 1000, "easeInOutExpo");
        e.preventDefault();
      });

      $this.find('.edge-slider-loading').fadeOut();

  }



function mk_flexslider_init() {

  "use strict";

  jQuery('.mk-flexslider.mk-script-call').each(function() {
    var $this = jQuery(this),
      $selector = $this.attr('data-selector'),
      $animation = $this.attr('data-animation'),
      $easing = $this.attr('data-easing'),
      $direction = $this.attr('data-direction'),
      $smoothHeight = $this.attr('data-smoothHeight') == "true" ? true : false,
      $slideshowSpeed = $this.attr('data-slideshowSpeed'),
      $animationSpeed = $this.attr('data-animationSpeed'),
      $controlNav = $this.attr('data-controlNav') == "true" ? true : false,
      $directionNav = $this.attr('data-directionNav') == "true" ? true : false,
      $pauseOnHover = $this.attr('data-pauseOnHover') == "true" ? true : false,
      $isCarousel = $this.attr('data-isCarousel') == "true" ? true : false;

    if ($selector != undefined) {
      var $selector_class = $selector;
    } else {
      var $selector_class = ".mk-flex-slides > li";
    }

    if ($isCarousel == true) {
      var $itemWidth = parseInt($this.attr('data-itemWidth')),
        $itemMargin = parseInt($this.attr('data-itemMargin')),
        $minItems = parseInt($this.attr('data-minItems')),
        $maxItems = parseInt($this.attr('data-maxItems')),
        $move = parseInt($this.attr('data-move'));
    } else {
      var $itemWidth = $itemMargin = $minItems = $maxItems = $move = 0;
    }

    $this.flexslider({
      selector: $selector_class,
      animation: $animation,
      easing: $easing,
      direction: $direction,
      smoothHeight: $smoothHeight,
      slideshow: true,
      slideshowSpeed: $slideshowSpeed,
      animationSpeed: $animationSpeed,
      controlNav: $controlNav,
      directionNav: $directionNav,
      pauseOnHover: $pauseOnHover,
      prevText: "",
      nextText: "",
      itemWidth: $itemWidth,
      itemMargin: $itemMargin,
      minItems: $minItems,
      maxItems: $maxItems,
      move: $move,
    });

  });

}


function mk_ajax_lightbox_init() {

  "use strict";

  jQuery(".mk-lightbox").fancybox({
    padding: 15,
    margin: 15,

    width: 800,
    height: 600,
    minWidth: 100,
    minHeight: 100,
    maxWidth: 9999,
    maxHeight: 9999,
    pixelRatio: 1, // Set to 2 for retina display support

    autoSize: true,
    autoHeight: false,
    autoWidth: false,

    autoResize: true,
    fitToView: true,
    aspectRatio: false,
    topRatio: 0.5,
    leftRatio: 0.5,

    scrolling: 'auto', // 'auto', 'yes' or 'no'
    wrapCSS: '',

    arrows: true,
    closeBtn: true,
    closeClick: false,
    nextClick: false,
    mouseWheel: true,
    autoPlay: false,
    playSpeed: 3000,
    preload: 3,
    modal: false,
    loop: true,
    // Properties for each animation type
    // Opening fancyBox
    openEffect: 'fade', // 'elastic', 'fade' or 'none'
    openSpeed: 200,
    openEasing: 'swing',
    openOpacity: true,
    openMethod: 'zoomIn',

    // Closing fancyBox
    closeEffect: 'fade', // 'elastic', 'fade' or 'none'
    closeSpeed: 200,
    closeEasing: 'swing',
    closeOpacity: true,
    closeMethod: 'zoomOut',

    // Changing next gallery item
    nextEffect: 'none', // 'elastic', 'fade' or 'none'
    nextSpeed: 350,
    nextEasing: 'swing',
    nextMethod: 'changeIn',

    // Changing previous gallery item
    prevEffect: 'none', // 'elastic', 'fade' or 'none'
    prevSpeed: 350,
    prevEasing: 'swing',
    prevMethod: 'changeOut',

    tpl: {
      wrap: '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
      image: '<img class="fancybox-image" src="{href}" alt="" />',
      error: '<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',
      closeBtn: '<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"><i class="mk-moon-close-2"></i></a>',
      next: '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span><i class="mk-jupiter-icon-arrow-right"></i></span></a>',
      prev: '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span><i class="mk-jupiter-icon-arrow-left"></i></span></a>',
      loading: '<div id="fancybox-loading"><div></div></div>'
    },

  });
}



function mk_swipe_slider_init() {


  "use strict";

  jQuery('.mk-swiper-slider').each(function() {

    if ($(this).data('state') != 'init') {

      $(this).data('state', 'init');

      var $this = jQuery(this),
        $thumbs = $this.parent().siblings('.gallery-thumbs-small'),
        $next_arrow = $this.find('.mk-swiper-next'),
        $prev_arrow = $this.find('.mk-swiper-prev'),
        $direction = $this.attr('data-direction'),
        $pagination = $this.attr('data-pagination') == "true" ? true : false,
        $slideshowSpeed = $this.attr('data-slideshowSpeed'),
        $animationSpeed = $this.attr('data-animationSpeed'),
        $controlNav = $this.attr('data-controlNav') == "true" ? true : false,
        $directionNav = $this.attr('data-directionNav') == "true" ? true : false,
        $freeModeFluid = $this.attr('data-freeModeFluid') == "true" ? true : false,
        $freeMode = $this.attr('data-freeMode') == "true" ? true : false,
        $mousewheelControl = $this.attr('data-mousewheelControl') == "true" ? true : false,
        $loop = $this.attr('data-loop') == "true" ? true : false,
        $slidesPerView = $this.attr('data-slidesPerView');

      if ($pagination === true) {
        var $pagination_class = '#' + $this.attr('id') + ' .swiper-pagination';
      } else {
        var $pagination_class = false;
      }


      var mk_swiper = jQuery(this).swiper({
        mode: $direction,
        loop: $loop,
        freeMode: $freeMode,
        pagination: $pagination_class,
        freeModeFluid: $freeModeFluid,
        autoplay: $slideshowSpeed,
        speed: $animationSpeed,
        calculateHeight: true,
        grabCursor: true,
        useCSS3Transforms: false,
        mousewheelControl: $mousewheelControl,
        paginationClickable: true,
        slidesPerView: $slidesPerView,
        onSwiperCreated: function(swiper) {

        },
        onSlideChangeStart: function() {
          $thumbs.find('.active-item').removeClass('active-item');
          $thumbs.find('a').eq(mk_swiper.activeIndex).addClass('active-item');
        }
      });


      $prev_arrow.click(function(e) {
        mk_swiper.swipePrev();
      });

      $next_arrow.click(function(e) {
        mk_swiper.swipeNext();
      });


      $thumbs.find('a').on('touchstart mousedown', function(e) {
        e.preventDefault();
        $thumbs.find('.active-item').removeClass('active-item');
        jQuery(this).addClass('active-item');
        mk_swiper.swipeTo($(this).index());
      });

      $thumbs.find('a').click(function(e) {
        e.preventDefault();
      });

    }
  });

}



/* Parallax for edge slider */
/* -------------------------------------------------------------------- */

function mk_edge_parallax() {

  // css and js parallax ver, do not delate 

  // var wrapper = $('.mk-edge-wrapper')[0];

  // $(window).on('scroll', function(){
  //   wrapper.style.msPerspectiveOrigin = wrapper.style.mozPerspectiveOrigin = wrapper.style.webkitPerspectiveOrigin = window.scrollX + 'px ' + window.scrollY + 'px';
  // })

  "use strict";

  if (!isMobile.any()) {


    var $parallaxLayer = [];


    $('.mk-edge-wrapper .mk-edge-slider').each(function() {
      var progressVal,
        currentPoint,
        ticking = false,
        scrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop,
        $this = $(this),
        $window = $(window),
        windowHeight = $(window).height(),
        parentHeight = $this.outerHeight(),
        startPoint = 0,
        endPoint = $this.offset().top + parentHeight,
        effectLayer = $this,
        cntLayer = $this.find('.mk-grid'),
        height = $this.outerHeight();

      var parallaxSpeed = .7;

      var animationSet = function() {
        // fastdom.read(function() { 
          scrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
          currentPoint = (startPoint + scrollY) * parallaxSpeed;
          progressVal = (1 / (endPoint - startPoint) * (scrollY - startPoint));

          // fastdom.write(function() {
            if(progressVal <= 1) {
                effectLayer.css({
                  '-webkit-transform': 'translateY(' + currentPoint + 'px)',
                  '-moz-transform': 'translateY(' + currentPoint + 'px)',
                  '-ms-transform': 'translateY(' + currentPoint + 'px)',
                  '-o-transform': 'translateY(' + currentPoint + 'px)',
                  'transform': 'translateY(' + currentPoint + 'px)'
                });
            }
            cntLayer.stop().css({
              opacity: (1 - (progressVal * 2))
            });
          // });

          ticking = false;
        // });
      }
      animationSet();

      var requestTick = function() {
        if (!ticking) {
          window.requestAnimationFrame(animationSet);
          ticking = true;
        }
      };

      $window.on('scroll', requestTick);
    });
  }
};/* Element Click Events */
/* -------------------------------------------------------------------- */
  function mobilecheck() {
    var check = false;
    (function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  }

function mk_click_events() {


  "use strict";

  var eventtype = mobilecheck() ? 'touchstart' : 'click';





  jQuery(".mk-header-login, .mk-header-signup, .mk-side-dashboard, .mk-quick-contact-wrapper, .mk-dashboard-trigger, .blog-share-container, .news-share-buttons, .main-nav-side-search, #mk-fullscreen-search-wrapper, #fullscreen-navigation").on(eventtype, function(event) {
    if (event.stopPropagation) {
      event.stopPropagation();
    } else if (window.event) {
      window.event.cancelBubble = true;
    }
  });
  jQuery("html").on(eventtype, function() {
    jQuery(this).find(".mk-login-register, #mk-header-subscribe, #mk-quick-contact, .single-share-buttons, .single-share-box, .blog-social-share, .news-share-buttons, #mk-nav-search-wrapper").fadeOut(100);
    jQuery('.mk-quick-contact-link').removeClass('quick-contact-active');
    jQuery('.mk-toggle-trigger').removeClass('mk-toggle-active');
    jQuery('body').removeClass('dashboard-opened');
    jQuery('.mk-dashboard-trigger').removeClass('dashboard-active');
    jQuery('body').css('overflow', 'visible');
  });

  jQuery('.mk-fullscreen-search-overlay').on(eventtype,function(){
    $(this).removeClass('mk-fullscreen-search-overlay-show');
  });
  jQuery('.mk-fullscreen-nav-wrapper').on(eventtype,function(){
    $(this).parent().removeClass('opened');
    $('.mk-dashboard-trigger').removeClass('fullscreen-active');
    jQuery('body').removeClass('fullscreen-nav-opened');
  });

  jQuery('.mk-forget-password').on(eventtype, function() {
    jQuery('#mk-forget-panel').siblings().hide().end().show();
  });

  jQuery('.mk-create-account').on(eventtype, function() {
    jQuery('#mk-register-panel').siblings().hide().end().show();
  });

  jQuery('.mk-return-login').on(eventtype, function() {
    jQuery('#mk-login-panel').siblings().hide().end().show();
  });


  jQuery('.mk-quick-contact-link').on(eventtype, function() {
    var $this = jQuery(this),
        $quickContact = jQuery('#mk-quick-contact');
    if (!$this.hasClass('quick-contact-active')) {
      $quickContact.addClass('quick-contact-anim').fadeIn(250);
      $this.addClass('quick-contact-active');
    } else {
      $quickContact.removeClass('quick-contact-anim').fadeOut(100);
      $this.removeClass('quick-contact-active');
    }
    return false;
  });

 
  jQuery('.mk-dashboard-trigger').on(eventtype, function(e) {

    var $this = jQuery(this),
        $body = jQuery('body'),
        $fullscreen_box = jQuery('.mk-fullscreen-nav');

    if ($this.hasClass('header_dashboard_style')){
      if (!$this.hasClass('dashboard-active')) {
        $this.addClass('dashboard-active');
        $body.addClass('dashboard-opened');
      } else {
        $this.removeClass('dashboard-active'); 
        $body.removeClass('dashboard-opened');
      }
    }else if($this.hasClass('header_fullscreen_style')){
      if (!$this.hasClass('fullscreen-active')) {
        $this.addClass('fullscreen-active');
        $body.addClass('fullscreen-nav-opened');
        setTimeout(function() {
            $body.css('overflow', 'hidden');
        }, 400)
        $fullscreen_box.addClass('opened');
      } else {
        $this.removeClass('fullscreen-active');
        $body.removeClass('fullscreen-nav-opened');
        $fullscreen_box.removeClass('opened');
      }
    }

    e.preventDefault();

  });
  $('.mk-fullscreen-nav-close').on(eventtype, function(e) {
    $(this).parent().removeClass('opened');
    $('.mk-dashboard-trigger').removeClass('fullscreen-active');
    jQuery('body').removeClass('fullscreen-nav-opened'); 
    jQuery('body').css('overflow', 'visible');
    e.preventDefault();
  });

}


function mk_theme_toggle_box() {

  "use strict";

  var eventtype = mobilecheck() ? 'touchstart' : 'click';

  jQuery('.mk-toggle-trigger').on(eventtype, function() {
      var $this = jQuery(this);

    if (!$this.hasClass('mk-toggle-active')) {

      jQuery('.mk-box-to-trigger').fadeOut(100);
      $this.parent().find('.mk-box-to-trigger').fadeIn(150);
      jQuery('.mk-toggle-trigger').removeClass('mk-toggle-active');
      $this.addClass('mk-toggle-active');

    } else {

      jQuery('.mk-box-to-trigger').fadeOut(100);
      $this.removeClass('mk-toggle-active');

    }
    return false;
  });
}

function mk_social_share_global() {

  "use strict";

  var eventtype = mobilecheck() ? 'touchstart' : 'click';


  jQuery('.twitter-share').on(eventtype, function() {
    var $this = jQuery(this),
        $url = $this.attr('data-url'),
        $title = $this.attr('data-title');

    window.open('http://twitter.com/intent/tweet?text=' + $title + ' ' + $url, "twitterWindow", "height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
    return false;
  });

  jQuery('.pinterest-share').on(eventtype, function() {
    var $this = jQuery(this),
        $url = $this.attr('data-url'),
        $title = $this.attr('data-title'),
        $image = $this.attr('data-image');
    window.open('http://pinterest.com/pin/create/button/?url=' + $url + '&media=' + $image + '&description=' + $title, "twitterWindow", "height=320,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
    return false;
  });

  jQuery('.facebook-share').on(eventtype, function() {
    var $url = jQuery(this).attr('data-url');
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + $url, "facebookWindow", "height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
    return false;
  });

  jQuery('.googleplus-share').on(eventtype, function() {
    var $url = jQuery(this).attr('data-url');
    window.open('https://plus.google.com/share?url=' + $url, "googlePlusWindow", "height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
    return false;
  });

  jQuery('.linkedin-share').on(eventtype, function() {
    var $this = jQuery(this),
        $url = $this.attr('data-url'),
        $title = $this.attr('data-title'),
        $desc = $this.attr('data-desc');
    window.open('http://www.linkedin.com/shareArticle?mini=true&url=' + $url + '&title=' + $title + '&summary=' + $desc, "linkedInWindow", "height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
    return false;
  });
}

})(jQuery, window);