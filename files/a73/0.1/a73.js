try{
	var _a73 = _a73 || {};
	_a73.adsDiv = "r73";
	_a73.baseAudienceURL = "http://ck.audience73.com/";
	_a73.clientID = -1;
	_a73.constants = {
		'PERM_C': "ckp_fp_a73",
		'PERM_C_Duration': 3650,
		'TEMP_C': "ckt_fp_a73"
	}

	var sessionid;
	var pageParams = new Object();
	var time;
	var timeSite = 0;
	var client_id = 789456123;
	var gid = "";
	var m = Math;
	var pageid = -1;
	function RN(){return m.round(2147483647*m.random())};
	_a73.init = function(){
		_a73.clientID = arguments[0];
		pageid = RN();

		sessionid = _a73.getCookie(_a73.constants.TEMP_C);
		if(sessionid == "")
		{
			sessionid = RN();
			_a73.setCookie(_a73.constants.TEMP_C, sessionid);
		}

		var cData = _a73.getCookie(_a73.constants.PERM_C);

		if(cData == "")
		{
			gid = RN();
			_a73.addGIDInCookie(new Array());
		}
		else
		{
			var arr = JSON.parse(cData);
			var flag = false;
			for(var i = 0; i < arr.length; i++)
			{
				if(arr[i].cid == _a73.clientID)
				{
					gid = arr[i].gid
					flag = true;break;
				}
			}
			if(!flag)
			{
				gid = RN();
				_a73.addGIDInCookie(arr);
			}
		}

		_a73.push();
	}
	_a73.push = function(){
		
		var dataObj = _a73.getQueryVars();
		dataObj['pageid'] = pageid;
		dataObj['timespent'] = timeSite;
		dataObj['referrer'] = document.referrer;
		dataObj['sessionid'] = sessionid;
		var data = JSON.stringify(dataObj);
		var pageURL = window.location.protocol + "//" + window.location.host + window.location.pathname;

		var img = document.createElement("img");
		img.src = _a73.baseAudienceURL + "ck.gif?globalid="+gid+"&sessiondata="+data+"&rn="+RN()+"&url="+pageURL+"&clientid="+_a73.clientID;
		img.width = "1";
		img.height = "1";

		document.body.appendChild(img);
	}

	_a73.getQueryVars = function() {
	  var query = window.location.search.substring(1);
	  var jsonObj = new Object();
	  if(query!=''){
		  var vars = query.split("&");
		  for (var i=0;i<vars.length;i++) {
		    var pair = vars[i].split("=");
		    jsonObj[pair[0]] = pair[1];
		  }
		}
	  jsonObj["useragent"]=encodeURIComponent(navigator.userAgent);
	  return jsonObj;
	}
	_a73.addGIDInCookie = function(arr) {
		arr.push({cid:_a73.clientID, gid:gid});
		_a73.setCookie(_a73.constants.PERM_C, JSON.stringify(arr), _a73.constants.PERM_C_Duration);
	}
	_a73.setCookie = function(name, value, days) {
		var expires = '', date = new Date();
		if (days) {
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = '; expires=' + date.toGMTString();
		}
		document.cookie = name + '=' + value + expires + '; path=/';
	}
	_a73.getCookie = function(name) {
	    var ca = document.cookie.split(';'), c;
	    for(var i = 0; i < ca.length; i++) {
	        c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1);
	        if(c.indexOf(name) == 0)
	        	return c.substring(name.length + 1, c.length);
	    }
	    return "";
	}
	
	window.onload=function(){
		time=new Date();
	}

	window.onbeforeunload = function() {
		timeSite=new Date()-time;
		try{
			_a73.push();
		}catch (err){
		}
	}

}
catch(err){
}
