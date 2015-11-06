$(document).ready(function(){
	alert('Code ran.');
    var scratch_player = $(".stage");
    var url = window.location.href;
    url = url.substr(33,40);
    $(scratch_player).empty();
    $(scratch_player).append("<script src=https://phosphorus.github.io/embed.js?id=", url, "&auto-start=false&light-content=false></script>");
});



