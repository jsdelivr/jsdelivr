kWidget.addReadyCallback(function(playerId){
	var kdp = document.getElementById(playerId);
	kdp.kBind('doPlay', function(data){
		console.log(  "doPlay called on  " + playerId );
		alert('doplay');
	});
	kdp.kBind('doPause', function(data){
		console.log(  "doPause called on  " + playerId );
		alert('doPause');
	});
});
