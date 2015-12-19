//** Featured Content Slider script- (c) Dynamic Drive DHTML code library: http://www.dynamicdrive.com.
//** May 2nd, 08'- Script rewritten and updated to 2.0.
//** June 12th, 08'- Script updated to v 2.3, which adds the following features:
			//1) Changed behavior of script to actually collapse the previous content when the active one is shown, instead of just tucking it underneath the later.
			//2) Added setting to reveal a content either via "click" or "mouseover" of pagination links (default is former).
			//3) Added public function for jumping to a particular slide within a Featured Content instance using an arbitrary link, for example.

//** July 11th, 08'- Script updated to v 2.4:
			//1) Added ability to select a particular slide when the page first loads using a URL parameter (ie: mypage.htm?myslider=4 to select 4th slide in "myslider")
			//2) Fixed bug where the first slide disappears when the mouse clicks or mouses over it when page first loads.

//** Dec 20th, 12'- v 2.41: Fixed bug with slider failing to load if the same script is used on different pages with different # of contents

//** Jan 23rd, 13'- v2.5: Modified onChange event handler behaviour for more robustness , plus added section on embedding YouTube videos inside the Slider.
				//Important: onChange(previndex, curindex, contentdivs) now uses a 0 based index system, where 0=1st slide, 1=2nd slide etc. Previously the count started at 1. 

var featuredcontentslider={

//3 variables below you can customize if desired:
ajaxloadingmsg: '<div style="margin: 20px 0 0 20px"><img src="loading.gif" /> Fetching slider Contents. Please wait...</div>',
bustajaxcache: true, //bust caching of external ajax page after 1st request?
enablepersist: true, //persist to last content viewed when returning to page?

settingcaches: {}, //object to cache "setting" object of each script instance

jumpTo:function(fcsid, pagenumber){ //public function to go to a slide manually.
	this.turnpage(this.settingcaches[fcsid], pagenumber)
},

ajaxconnect:function(setting){
	var page_request = false
	if (window.ActiveXObject){ //Test for support for ActiveXObject in IE first (as XMLHttpRequest in IE7 is broken)
		try {
		page_request = new ActiveXObject("Msxml2.XMLHTTP")
		} 
		catch (e){
			try{
			page_request = new ActiveXObject("Microsoft.XMLHTTP")
			}
			catch (e){}
		}
	}
	else if (window.XMLHttpRequest) // if Mozilla, Safari etc
		page_request = new XMLHttpRequest()
	else
		return false
	var pageurl=setting.contentsource[1]
	page_request.onreadystatechange=function(){
		featuredcontentslider.ajaxpopulate(page_request, setting)
	}
	document.getElementById(setting.id).innerHTML=this.ajaxloadingmsg
	var bustcache=(!this.bustajaxcache)? "" : (pageurl.indexOf("?")!=-1)? "&"+new Date().getTime() : "?"+new Date().getTime()
	page_request.open('GET', pageurl+bustcache, true)
	page_request.send(null)
},

ajaxpopulate:function(page_request, setting){
	if (page_request.readyState == 4 && (page_request.status==200 || window.location.href.indexOf("http")==-1)){
		document.getElementById(setting.id).innerHTML=page_request.responseText
		this.buildpaginate(setting)
	}
},

buildcontentdivs:function(setting){
	var alldivs=document.getElementById(setting.id).getElementsByTagName("div")
	for (var i=0; i<alldivs.length; i++){
		if (this.css(alldivs[i], "contentdiv", "check")){ //check for DIVs with class "contentdiv"
			setting.contentdivs.push(alldivs[i])
				alldivs[i].style.display="none" //collapse all content DIVs to begin with
		}
	}
	if (setting.currentpage > setting.contentdivs.length){
		setting.currentpage=1
		setting.prevpage=1
	}
},

buildpaginate:function(setting){
	this.buildcontentdivs(setting)
	var sliderdiv=document.getElementById(setting.id)
	var pdiv=document.getElementById("paginate-"+setting.id)
	var phtml=""
	var toc=setting.toc
	var nextprev=setting.nextprev
	if (typeof toc=="string" && toc!="markup" || typeof toc=="object"){
		for (var i=1; i<=setting.contentdivs.length; i++){
			phtml+='<a href="#'+i+'" class="toc">'+(typeof toc=="string"? toc.replace(/#increment/, i) : toc[i-1])+'</a> '
		}
		phtml=(nextprev[0]!=''? '<a href="#prev" class="prev">'+nextprev[0]+'</a> ' : '') + phtml + (nextprev[1]!=''? '<a href="#next" class="next">'+nextprev[1]+'</a>' : '')
		pdiv.innerHTML=phtml
	}
	var pdivlinks=pdiv.getElementsByTagName("a")
	var toclinkscount=0 //var to keep track of actual # of toc links
	for (var i=0; i<pdivlinks.length; i++){
		if (this.css(pdivlinks[i], "toc", "check")){
			if (toclinkscount>setting.contentdivs.length-1){ //if this toc link is out of range (user defined more toc links then there are contents)
				pdivlinks[i].style.display="none" //hide this toc link
				continue
			}
			pdivlinks[i].setAttribute("rel", ++toclinkscount) //store page number inside toc link
			pdivlinks[i][setting.revealtype]=function(){
				featuredcontentslider.turnpage(setting, this.getAttribute("rel"))
				return false
			}
			setting.toclinks.push(pdivlinks[i])
		}
		else if (this.css(pdivlinks[i], "prev", "check") || this.css(pdivlinks[i], "next", "check")){ //check for links with class "prev" or "next"
			pdivlinks[i].onclick=function(){
				featuredcontentslider.turnpage(setting, this.className)
				return false
			}
		}
	}
	this.turnpage(setting, setting.currentpage, true)
	if (setting.autorotate[0]){ //if auto rotate enabled
		pdiv[setting.revealtype]=function(){
			featuredcontentslider.cleartimer(setting, window["fcsautorun"+setting.id])
		}
		sliderdiv["onclick"]=function(){ //stop content slider when slides themselves are clicked on
			featuredcontentslider.cleartimer(setting, window["fcsautorun"+setting.id])
		}
		setting.autorotate[1]=setting.autorotate[1]+(1/setting.enablefade[1]*50) //add time to run fade animation (roughly) to delay between rotation
	 this.autorotate(setting)
	}
},

urlparamselect:function(fcsid){
	var result=window.location.search.match(new RegExp(fcsid+"=(\\d+)", "i")) //check for "?featuredcontentsliderid=2" in URL
	return (result==null)? null : parseInt(RegExp.$1) //returns null or index, where index (int) is the selected tab's index
},

turnpage:function(setting, thepage, autocall){
	var currentpage=setting.currentpage //current page # before change
	var totalpages=setting.contentdivs.length
	var turntopage=(/prev/i.test(thepage))? currentpage-1 : (/next/i.test(thepage))? currentpage+1 : parseInt(thepage)
	turntopage=(turntopage<1)? totalpages : (turntopage>totalpages)? 1 : turntopage //test for out of bound and adjust
	if (turntopage==setting.currentpage && typeof autocall=="undefined") //if a pagination link is clicked on repeatedly
		return
	setting.currentpage=turntopage
	setting.contentdivs[turntopage-1].style.zIndex=++setting.topzindex
	this.cleartimer(setting, window["fcsfade"+setting.id])
	setting.cacheprevpage=setting.prevpage
	if (setting.enablefade[0]==true){
		setting.curopacity=0
		this.fadeup(setting)
	}
	if (setting.enablefade[0]==false){ //if fade is disabled, fire onChange event immediately (verus after fade is complete)
		setting.contentdivs[setting.prevpage-1].style.display="none" //collapse last content div shown (it was set to "block")
		try{
		setting.onChange(setting.prevpage-1, setting.currentpage-1, setting.contentdivs)
		} catch(e){console.log(e.message)}
	}
	setting.contentdivs[turntopage-1].style.visibility="visible"
	setting.contentdivs[turntopage-1].style.display="block"
	if (setting.prevpage<=setting.toclinks.length) //make sure pagination link exists (may not if manually defined via "markup", and user omitted)
		this.css(setting.toclinks[setting.prevpage-1], "selected", "remove")
	if (turntopage<=setting.toclinks.length) //make sure pagination link exists (may not if manually defined via "markup", and user omitted)
		this.css(setting.toclinks[turntopage-1], "selected", "add")
	setting.prevpage=turntopage
	if (this.enablepersist)
		this.setCookie("fcspersist"+setting.id, turntopage)
},

setopacity:function(setting, value){ //Sets the opacity of targetobject based on the passed in value setting (0 to 1 and in between)
	var targetobject=setting.contentdivs[setting.currentpage-1]
	if (targetobject.filters && targetobject.filters[0]){ //IE syntax
		if (typeof targetobject.filters[0].opacity=="number") //IE6
			targetobject.filters[0].opacity=value*100
		else //IE 5.5
			targetobject.style.filter="alpha(opacity="+value*100+")"
	}
	else if (typeof targetobject.style.MozOpacity!="undefined") //Old Mozilla syntax
		targetobject.style.MozOpacity=value
	else if (typeof targetobject.style.opacity!="undefined") //Standard opacity syntax
		targetobject.style.opacity=value
	setting.curopacity=value
},

fadeup:function(setting){
	if (setting.curopacity<1){
		this.setopacity(setting, setting.curopacity+setting.enablefade[1])
		window["fcsfade"+setting.id]=setTimeout(function(){featuredcontentslider.fadeup(setting)}, 50)
	}
	else{ //when fade is complete
		if (setting.cacheprevpage!=setting.currentpage) //if previous content isn't the same as the current shown div (happens the first time the page loads/ script is run)
			setting.contentdivs[setting.cacheprevpage-1].style.display="none" //collapse last content div shown (it was set to "block")
		try{
			setting.onChange(setting.cacheprevpage-1, setting.currentpage-1, setting.contentdivs)
		} catch(e){console.log(e.message)}
	}
},

cleartimer:function(setting, timervar){
	if (typeof timervar!="undefined"){
		clearTimeout(timervar)
		clearInterval(timervar)
		if (setting.cacheprevpage!=setting.currentpage){ //if previous content isn't the same as the current shown div
			setting.contentdivs[setting.cacheprevpage-1].style.display="none"
		}
	}
},

css:function(el, targetclass, action){
	var needle=new RegExp("(^|\\s+)"+targetclass+"($|\\s+)", "ig")
	if (action=="check")
		return needle.test(el.className)
	else if (action=="remove")
		el.className=el.className.replace(needle, "")
	else if (action=="add")
		el.className+=" "+targetclass
},

autorotate:function(setting){
 window["fcsautorun"+setting.id]=setInterval(function(){featuredcontentslider.turnpage(setting, "next")}, setting.autorotate[1])
},

getCookie:function(Name){ 
	var re=new RegExp(Name+"=[^;]+", "i"); //construct RE to search for target name/value pair
	if (document.cookie.match(re)) //if cookie found
		return document.cookie.match(re)[0].split("=")[1] //return its value
	return null
},

setCookie:function(name, value){
	document.cookie = name+"="+value

},


init:function(setting){
	var persistedpage=this.getCookie("fcspersist"+setting.id) || 1
	var urlselectedpage=this.urlparamselect(setting.id) //returns null or index from: mypage.htm?featuredcontentsliderid=index
	this.settingcaches[setting.id]=setting //cache "setting" object
	setting.contentdivs=[]
	setting.toclinks=[]
	setting.topzindex=0
	setting.currentpage=urlselectedpage || ((this.enablepersist)? persistedpage : 1)
	setting.prevpage=setting.currentpage
	setting.revealtype="on"+(setting.revealtype || "click")
	setting.curopacity=0
	setting.onChange=setting.onChange || function(){}
	if (setting.contentsource[0]=="inline")
		this.buildpaginate(setting)
	if (setting.contentsource[0]=="ajax")
		this.ajaxconnect(setting)
}

}