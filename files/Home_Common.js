function ImageClicked(control, redurecturl)
{
   el = control.getBoundingClientRect();
   pleft = el.left + 35;
   ptop = el.top + 35;   
   d = document.getElementById("imgpreloadgif");
   d.style.position = "absolute";
   d.style.left = pleft+'px';
   d.style.top = ptop+'px';   
   d.style.display = "";
   window.location.replace(redurecturl);
   return true;
}
function FadeInOut() {
	DisablePreLoadImg()
	if(document.getElementById("slideSource").style.display == "block"){
	document.getElementById("slideSource").style.display = "none";
	}
	else{
		document.getElementById("slideSource").style.display = "block";
	}
}
function DisablePreLoadImg(){
//Disable loading image on body load
d = document.getElementById("imgpreloadgif");
	if(document.body.contains(d)){
		d.style.display = "none";
	}
}
function bodyonload(){
	DisablePreLoadImg()
}