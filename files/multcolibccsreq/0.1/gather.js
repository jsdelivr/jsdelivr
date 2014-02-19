(function() {
	var url = document.URL,
		mymclURL = 'http://multcolib.bibliocommons.com',
		opacURL = 'http://catalog.multcolib.org',
		req,
		item = {location: [], callNumber: [], title: ''},
		cleanHTML = function(s) {
			return s.replace(/^\s+|[\s-]+$|<!--[\w\s]+-->|<[^>]+>|&nbsp;\s?/g, '').replace('&amp;', '&').replace(/\s+$/, '');
		},
		isNotRepeated = (function () {
			var accounted = [];
			return function isNotRepeated(s) {
				var i = 0, len = accounted.length;
				for (; i < len; i += 1) {
					if (accounted[i] === s) return false;
				}
				accounted[len] = s;
				return true;
			};
		})(),
		scriptInfo = {version: '0.1'};
	
	// This is for anomalies that I couldn't find in my research.
	// If the JSON string is greater than 2000 characters, the 
	// window.prompt will truncate it and it won't parse correctly 
	// when put into the form. I've alleviated all other factors
	// I can think of, repeated items, non-Central items, so if
	// the string is >2000, this function simply pulls the first
	// Closed Stacks item it finds, or the first item it finds if
	// no Closed Stacks items are present.
	function stopGap(text) {
		var stopgap, 
			locationCall = [],
			callNumber = [],
			obj, i, j;
				
		if (text.length > 2000) {
			obj = {};
			stopgap = JSON.parse(text);
			// look for closed stacks option first
			for (i = 0; i < stopgap.location.length; i += 1) {
				if (stopgap.location[i].search(/Closed|Reference/) > -1) break;				
			}
			// otherwise, just return the first item
			j = i || 0;
			for (i in stopgap) {
				if (Object.prototype.toString.call(stopgap[i]) === '[object Array]') {
					obj[i] = [stopgap[i][j]];
				} else {
					obj[i] = stopgap[i];
				}
			}
			alert('Unfortunately the list of items was too long and the first listed item will be offered in the next window.  ' +
				'Please give more specific instructions in the notes field of the form if this item is not what you need.');
			text = JSON.stringify(obj);
		}
		return text;	
	}
	
	function copyToClipboard (text) {
		text = stopGap(text);
		window.prompt ("Copy to clipboard: Ctrl+C, Enter", text);
	}
	
	function noAvailableItems() {
		alert('There are no available copies of this title.');
	}
	
	function urlRegexp(url) {
		return  new RegExp('^' + url.replace(/\./g, '\\.').replace(/\//g, '\\/'));
	}
		
// MyMCL selection:
// MyMCL always has a link to the complete list of items for a title, so an ajax call must be made.
	function parseMyMCLItemDetails() {
		var table, ths, tds, locationIndex, callIndex, volumeIndex, statusIndex, i, j, className; 
		
		// Make element to put the html content into for content extraction	
		var el = document.createElement('div');
		el.innerHTML = this.responseText;
		// Now find all info needed from ajax request
		var headings = el.getElementsByTagName('h1');
		for (i = 0; i < headings.length; i += 1) {
			if (headings[i].getAttribute('id') === 'aria_bib_title') item.title = cleanHTML(headings[i].innerHTML);
			className = headings[i].getAttribute('class') || headings[i].className; // className attr is for IE
			if (className === 'group_heading' && headings[i].innerHTML.search('Not available at this time') === -1) {
				table = headings[i].nextSibling;
				// This isn't always the table, but it's nearby.  Loop to find it
				while (table.tagName !== 'TABLE') table = table.nextSibling;
				ths = table.getElementsByTagName('th');
				tds = table.getElementsByTagName('td');
				// Loop through table headings to get placements of the ones we care about
				for (j = 0; j < ths.length; j += 1) {
					switch (ths[j].innerHTML) {
						case 'Collection':
							locationIndex = j;
							break;
						case 'Call Number':
							callIndex = j;
							break
						case 'Call No.':
							callIndex = j;
							break
						default: break;
					}
				}
				// go over table rows by headings length, add indexes for heading values
				for (j = 0; j < tds.length; j += ths.length) {
					if (locationIndex !== undefined && tds[j + locationIndex].innerHTML.indexOf('Central') > -1 &&
						isNotRepeated(tds[j + locationIndex].innerHTML + tds[j + callIndex].innerHTML)) {
						item.location.push(cleanHTML(tds[j + locationIndex].innerHTML));
						//if (volumeIndex !== undefined) item.volume.push(cleanHTML(tds[j + volumeIndex].innerHTML));
						if (callIndex !== undefined) item.callNumber.push(cleanHTML(tds[j + callIndex].innerHTML));
					}
				}
			}
		}
		if (item.location.length < 1) {
			noAvailableItems();
			return;
		}
		copyToClipboard(JSON.stringify(item));
	} // END parseMyMCLItemDetails()
				
	function parseOPACItemDetails() {
		var el = document.createElement('div');
		el.innerHTML = this.responseText;
		var table = el.getElementsByTagName('table')[0];
		var tds = table.getElementsByTagName('td');
		var i, j, cleanLoc, cleanCall;
		
		for (i = 0; i < tds.length; i += 3) {
			cleanLoc = cleanHTML(tds[i].innerHTML);
			cleanCall = tds[i + 1].getElementsByTagName('a');
			// Sometimes there is no link in the call number column
			if (cleanCall.length === 0) continue;
			cleanCall = cleanCall[0].innerHTML;
			if (tds[i].innerHTML.indexOf('Central') > -1 && isNotRepeated(cleanLoc + cleanCall)) {
				item.location[item.location.length] = cleanLoc;
				item.callNumber[item.callNumber.length] = cleanCall;
			}
		}
		if (item.location.length < 1) {
			noAvailableItems();
			return;
		}
		copyToClipboard(JSON.stringify(item));
	} // END parseOPACItemDetails()

	if (url.match(urlRegexp(mymclURL))) {
		url = mymclURL + document.getElementById('circ_info_trigger').getAttribute('href');
		req = new XMLHttpRequest();
		req.onload = parseMyMCLItemDetails;
		req.open('get', url, true);
		req.send();
		
// WebPAC selection:
	} else if (url.match(urlRegexp(opacURL))) {
		var tds = document.getElementsByTagName('td'),
			forms = document.getElementsByTagName('form'), 
			found = false,
			links, i, j;
			
		// Get title first
		for (i = 0; i < tds.length; i += 1) {
			if (tds[i].innerHTML === 'Title') {
				item.title = cleanHTML(tds[i + 1].innerHTML);
				break;
			}
		}
		
		// if there's a link for more copies, use that...
		for (i = 0; i < forms.length; i += 1) {
			links = forms[i].getElementsByTagName('input');
			for (j = 0; j < links.length; j += 1) {
				if (links[j].getAttribute('value') && links[j].getAttribute('value').indexOf('View additional copies') > -1) {
					found = true;
					url = forms[i].getAttribute('action');
					req = new XMLHttpRequest();
					req.onload = parseOPACItemDetails;
					req.open('post', url);
					req.send();
					break;
				}
			}
			if (found) break;
		} // END case where external link is present
		
		if (!found) {
			var tables = document.getElementsByTagName('table'),
				trs, cleanLoc, cleanCall;
			
			// If no external link, use info on current page
			for (i = 0; i < tables.length; i += 1) {
				if (tables[i].getAttribute('class') === 'bibItems') {
					trs = tables[i].getElementsByTagName('tr');
					for (j = 0; j < trs.length; j += 1) {
						tds = trs[j].getElementsByTagName('td');
						if (tds.length === 0) continue;
						cleanLoc = cleanHTML(tds[0].innerHTML);
						cleanCall = cleanHTML(tds[1].innerHTML);
						if (tds.length > 0 && tds[0].innerHTML.indexOf('Central') > -1 && tds[2].innerHTML.indexOf('DUE') === -1 &&
							isNotRepeated(cleanLoc + cleanCall)) {
							// get Location
							item.location[item.location.length] = cleanLoc;
							// get Call Number
							item.callNumber[item.callNumber.length] = cleanCall;
						}
					}
				}
			}
			if (item.location.length < 1) {
				noAvailableItems();
				return;
			}
			copyToClipboard(JSON.stringify(item));
		}
	} // END WebPAC selection
	
	// Check version in local storage cache, update if needed.
	// For minimizing: use www.jscompress.com, select this entire function, then cut the following IF block out before minimization.
	// Once minimized, all backslash characters MUST THEN BE ESCAPED (Find '\' replace with '\\')
	// Minimized script is placed between single quotes below for local storage to store as a string
	
	// BEGIN cut for minimization
	if (window.localStorage) {
		if (window.localStorage.retrievalSelectionScript) {
			var cachedVersion = JSON.parse(window.localStorage.retrievalSelectionScript).version;
			if (cachedVersion === scriptInfo.version) return;
		}
		window.localStorage.retrievalSelectionScript = JSON.stringify({
			version: scriptInfo.version,
			script: '(function(){function a(e){var t,n=[],r=[],i,s,o;if(e.length>2e3){i={};t=JSON.parse(e);for(s=0;s<t.location.length;s+=1){if(t.location[s].search(/Closed|Reference/)>-1)break}o=s||0;for(s in t){if(Object.prototype.toString.call(t[s])==="[object Array]"){i[s]=[t[s][o]]}else{i[s]=t[s]}}alert("Unfortunately the list of items was too long and the first listed item will be offered in the next window.  "+"Please give more specific instructions in the notes field of the form if this item is not what you need.");e=JSON.stringify(i)}return e}function f(e){e=a(e);window.prompt("Copy to clipboard: Ctrl+C, Enter",e)}function l(){alert("There are no available copies of this title.")}function c(e){return new RegExp("^"+e.replace(/\\./g,"\\\\.").replace(/\\//g,"\\\\/"))}function h(){var e,t,n,r,u,a,c,h,p,d;var v=document.createElement("div");v.innerHTML=this.responseText;var m=v.getElementsByTagName("h1");for(h=0;h<m.length;h+=1){if(m[h].getAttribute("id")==="aria_bib_title")i.title=s(m[h].innerHTML);d=m[h].getAttribute("class")||m[h].className;if(d==="group_heading"&&m[h].innerHTML.search("Not available at this time")===-1){e=m[h].nextSibling;while(e.tagName!=="TABLE")e=e.nextSibling;t=e.getElementsByTagName("th");n=e.getElementsByTagName("td");for(p=0;p<t.length;p+=1){switch(t[p].innerHTML){case"Collection":r=p;break;case"Call Number":u=p;break;case"Call No.":u=p;break;default:break}}for(p=0;p<n.length;p+=t.length){if(r!==undefined&&n[p+r].innerHTML.indexOf("Central")>-1&&o(n[p+r].innerHTML+n[p+u].innerHTML)){i.location.push(s(n[p+r].innerHTML));if(u!==undefined)i.callNumber.push(s(n[p+u].innerHTML))}}}}if(i.location.length<1){l();return}f(JSON.stringify(i))}function p(){var e=document.createElement("div");e.innerHTML=this.responseText;var t=e.getElementsByTagName("table")[0];var n=t.getElementsByTagName("td");var r,u,a,c;for(r=0;r<n.length;r+=3){a=s(n[r].innerHTML);c=n[r+1].getElementsByTagName("a");if(c.length===0)continue;c=c[0].innerHTML;if(n[r].innerHTML.indexOf("Central")>-1&&o(a+c)){i.location[i.location.length]=a;i.callNumber[i.callNumber.length]=c}}if(i.location.length<1){l();return}f(JSON.stringify(i))}var e=document.URL,t="http://multcolib.bibliocommons.com",n="http://catalog.multcolib.org",r,i={location:[],callNumber:[],title:""},s=function(e){return e.replace(/^\\s+|[\\s-]+$|<!--[\\w\\s]+-->|<[^>]+>|&nbsp;\\s?/g,"").replace("&","&").replace(/\\s+$/,"")},o=function(){var e=[];return function(n){var r=0,i=e.length;for(;r<i;r+=1){if(e[r]===n)return false}e[i]=n;return true}}(),u={version:"0.1"};if(e.match(c(t))){e=t+document.getElementById("circ_info_trigger").getAttribute("href");r=new XMLHttpRequest;r.onload=h;r.open("get",e,true);r.send()}else if(e.match(c(n))){var d=document.getElementsByTagName("td"),v=document.getElementsByTagName("form"),m=false,g,y,b;for(y=0;y<d.length;y+=1){if(d[y].innerHTML==="Title"){i.title=s(d[y+1].innerHTML);break}}for(y=0;y<v.length;y+=1){g=v[y].getElementsByTagName("input");for(b=0;b<g.length;b+=1){if(g[b].getAttribute("value")&&g[b].getAttribute("value").indexOf("View additional copies")>-1){m=true;e=v[y].getAttribute("action");r=new XMLHttpRequest;r.onload=p;r.open("post",e);r.send();break}}if(m)break}if(!m){var w=document.getElementsByTagName("table"),E,S,x;for(y=0;y<w.length;y+=1){if(w[y].getAttribute("class")==="bibItems"){E=w[y].getElementsByTagName("tr");for(b=0;b<E.length;b+=1){d=E[b].getElementsByTagName("td");if(d.length===0)continue;S=s(d[0].innerHTML);x=s(d[1].innerHTML);if(d.length>0&&d[0].innerHTML.indexOf("Central")>-1&&d[2].innerHTML.indexOf("DUE")===-1&&o(S+x)){i.location[i.location.length]=S;i.callNumber[i.callNumber.length]=x}}}}if(i.location.length<1){l();return}f(JSON.stringify(i))}}})()'
		});
	} 
	// END cut for minimization
	
})();