/**
* jQuery creaseFont plugin
* Version 1.0.4
* Increase or Decrase the Fontsize of a whole Website or only some containers
* Remember: 100% = 1em = 16px
* Remember2: my english could be better
* 
* You can call a function after the font is in or decreased:
* after:function( obj ) { }
* the obj contains the following:
*     obj.currSize    ->  the current fontsize, int or float
*     obj.currUnit    ->  the current unit, string
*     obj.currContent ->  the current content, which is in or decreased, string
*     obj.currTask    ->  the current action which has been called, (increaseFont|defaultFont|decreaseFont), string
*     obj.currLvl     ->  the current lvl, an empty string or (max|default|min),
*                         max = maximun zoomlvl arrived
*                         default = default zoom lvl
*                         min = minimum zoom lvl arrived
* 
* Copyright (c) 2011 Nico Renken (blog.mxtracks.de)
* Licensed under Creativ Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0):
* http://creativecommons.org/licenses/by-sa/3.0/
*
*/
!function($){"use strict";$.creaseFont=function(options){function increaseFont(){currentSize+=opt.stepSize,currentSize>=opt.maxSize?(currentSize=opt.maxSize,currLvl="max"):currLvl="",sizeIT(opt.content,currentSize),mycookie(opt.cookieName,currentSize,{path:opt.cookiePath,expires:opt.cookieLifetime});var objects={currSize:currentSize,currUnit:opt.unit,currContent:opt.content,currTask:"increaseFont",currLvl:currLvl};$.isFunction(opt.after)&&(opt.animate?setTimeout(function(){opt.after(objects)},opt.animateSpeed+100):opt.after(objects))}function defaultFont(){currentSize=opt.defaultSize,currLvl="default",sizeIT(opt.content,currentSize),mycookie(opt.cookieName,currentSize,{path:opt.cookiePath,expires:-100});var objects={currSize:currentSize,currUnit:opt.unit,currContent:opt.content,currTask:"defaultFont",currLvl:currLvl};$.isFunction(opt.after)&&(opt.animate?setTimeout(function(){opt.after(objects)},opt.animateSpeed+100):opt.after(objects))}function decreaseFont(){currentSize-=opt.stepSize,currentSize<=opt.minSize?(currentSize=opt.minSize,currLvl="min"):currLvl="",sizeIT(opt.content,currentSize),mycookie(opt.cookieName,currentSize,{path:opt.cookiePath,expires:opt.cookieLifetime});var objects={currSize:currentSize,currUnit:opt.unit,currContent:opt.content,currTask:"decreaseFont",currLvl:currLvl};$.isFunction(opt.after)&&(opt.animate?setTimeout(function(){opt.after(objects)},opt.animateSpeed+100):opt.after(objects))}function sizeIT(cn,sz){"object"==typeof cn&&cn instanceof Array?$.each(cn,function(index,value){opt.animate?$(value).animate({"font-size":sz+opt.unit},opt.animateSpeed):$(value).css("font-size",sz+opt.unit)}):opt.animate?$(cn).animate({"font-size":sz+opt.unit},opt.animateSpeed):$(cn).css("font-size",sz+opt.unit)}function mycookie(key,value,cookieOptions){if(arguments.length>1&&"[object Object]"!==String(value)){var cOptions=$.extend({},cookieOptions);if((null===value||void 0===value)&&(cOptions.expires=-1e3),"number"==typeof cOptions.expires){var days=cOptions.expires,t=cOptions.expires=new Date;t.setDate(t.getDate()+days)}return value=String(value),document.cookie=[encodeURIComponent(key),"=",cOptions.raw?value:encodeURIComponent(value),cOptions.expires?"; expires="+cOptions.expires.toUTCString():"",cOptions.path?"; path="+cOptions.path:"",cOptions.domain?"; domain="+cOptions.domain:"",cOptions.secure?"; secure":""].join("")}var result,cOptions=value||{},decode=cOptions.raw?function(s){return s}:decodeURIComponent;return(result=new RegExp("(?:^|; )"+encodeURIComponent(key)+"=([^;]*)").exec(document.cookie))?decode(result[1]):null}var newsize,settings={content:"body",defaultSize:100,maxSize:160,minSize:60,stepSize:10,unit:"%",bFontLarge:"#fontLarge",bFontDefault:"#fontDefault",bFontSmall:"#fontSmall",animate:!0,animateSpeed:500,cookieName:"creaseFont",cookiePath:"/",cookieLifetime:60},opt=$.extend(!0,settings,options),currentSize=opt.defaultSize,currLvl="";if($(opt.bFontLarge).click(function(){return increaseFont(),!1}),$(opt.bFontDefault).click(function(){return defaultFont(),!1}),$(opt.bFontSmall).click(function(){return decreaseFont(),!1}),mycookie(opt.cookieName)){newsize=mycookie(opt.cookieName),currentSize=parseInt(newsize,10);var animateState=opt.animate;opt.animate=!1,sizeIT(opt.content,currentSize),opt.animate=animateState}}}(jQuery);