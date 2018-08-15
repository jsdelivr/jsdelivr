	function ipgeoByApikeyFieldsAndIp(apikey="", fields="" ,ip="") {
	request("ipgeo", apikey, fields, ip,"");
	};

	function ipgeoByApikeyAndFields(apikey="", fields="") {
	request("ipgeo", apikey, fields, "","");
	};

	function ipgeoByApikeyAndIp(apikey="", ip="") {
	request("ipgeo", apikey, "", ip,"");
	}
	 
        function ipgeoByApikeyAndIps(apikey="", ips="") {
	postRequest("ipgeo-bulk", apikey, ips);
	}

	function ipgeoByApikey(apikey=""){
	request("ipgeo", apikey, "", "","")
	}


	function timezoneByApikeyAndIp(apikey="" ,ip="") {
	request("timezone", apikey, "", ip, "");
	}

	function timezoneByApikeyAndTz(apikey="", tz="") {
	request("timezone", apikey, "", "",tz);
	}
        
        function timezoneByApikey(apikey="") {
	request("timezone", apikey, "", "","");
	}

	function request(subUrl=null, apiKey="",fields="",ip="", tz=""){
	var URL = "";
	if(apiKey){
	URL = subUrl;
	URL = URL + ("?apiKey=" + apiKey);
	if(fields){
	URL = URL + "&fields=";
	URL = URL + fields;
	}
	if(ip){
	URL = URL + "&ip=";
	URL = URL + ip;
	}
        if(tz){
	URL = URL + "&tz=";
	URL = URL + tz;
	}

	}

        $.get( "https://api.ipgeolocation.io/"+URL+"", function( data ) {
            console.log(data);
	})
	.done(function(data) {
	console.log("success");
        console.log(data);
        return data;
	})
	.fail(function(error) {
	console.log("error");
        console.log(error.responseText);
        return error.responseText;
	});

	}

	function postRequest(subUrl=null, apiKey="", ips=""){
	     $.ajax({
		     type: "POST",
		     url: "https://api.ipgeolocation.io/"+subUrl+"?apiKey="+apiKey+"",
		     data: JSON.stringify({"ips": ips}),// now data come in this function
		     contentType: "application/json; charset=utf-8",
		     crossDomain: true,
		     dataType: "json",
		     success: function (data, status, jqXHR) {
		         console.log(data);
                         return data;
		     },
		     error: function (data, jqXHR, status) {
                         console.log(data.responseText);
                         return data.responseText;
		     }
		  });

	}


