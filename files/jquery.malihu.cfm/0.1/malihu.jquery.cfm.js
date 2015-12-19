/* 
cursor following menu 
created by malihu [http://manos.malihu.gr | manos@malihu.gr]
*/

//cache vars
$menu=$("#cf_menu");
$menu_title=$("#cf_menu .title");
$menu_container=$("#cf_menu .container");
$menu_ul=$("#cf_menu ul:first");
$menu_li=$("#cf_menu li");
$menu_ul_ul=$("#cf_menu ul ul");
$menu_a=$("#cf_menu a");

$(window).load(function() {
	MoveMenu();
	$menu_ul_ul.hide();
	$menu.addClass("cf_menu_transparency");
	
	function MouseMove(e){
		var posY=e.pageY+$menu_cursor_space;
		var posX=e.pageX+$menu_cursor_space;
		$menu.stop().animate({top:posY ,left:posX}, $menu_following_speed,$menu_following_easing);
		if($menu_ul.is(":visible")){
			$menu_ul.slideUp($menu_hide_speed,$menu_hide_easing,function(){
				$menu_title.show("fast","easeOutCirc");
			});
		}
	}
	
	function MoveMenu(){
		$("body").bind("mousemove", function(event){
			MouseMove(event);
		});
	}
	
	$menu.hover( //menu mouse over
		function(){ 
			var $this=$(this);
			$("body").unbind("mousemove");
			$this.stop().removeClass("cf_menu_transparency");
			$menu_title.html($mouseover_title);
		},
		function(){ //menu mouse out
			var $this=$(this);
			$this.stop().addClass("cf_menu_transparency");
			$menu_title.html($mouseout_title);
			if($menu.data("curr_sub_menu")){
				HideSubMenu($menu.data("curr_sub_menu"));
			}
			MoveMenu();
		}
	);
	
	//menu click
	$menu.bind("click", function(event){
		var $this=$(this);
		$this.stop();
		$menu_title.hide("fast","easeOutCirc",function(){
			$menu_ul.slideDown($menu_show_speed,$menu_show_easing);
		});
	});
	
	//menu option click
	$menu_a.bind("click", function(event){
		var $this=$(this);
		if($this.parent("li").children("ul").length){
			event.preventDefault();
			if($menu.data("curr_sub_menu")){
				HideSubMenu($menu.data("curr_sub_menu"));
			}
			if($this.parent("li").children("ul").is(":visible") == false){
				$this.parent("li").children("ul").fadeIn("fast","easeInExpo");
				$menu.data("curr_sub_menu",$this);
			}
		}
	});
	
	function HideSubMenu(submenu){
		submenu.parent("li").children("ul").fadeOut("fast","easeOutExpo");
	}
});
	
//animate page
function Animate2id(id2Animate){
	var animSpeed=1500; //animation speed
    var easeType="easeInOutExpo"; //easing type
    if($.browser.webkit){ //webkit browsers do not support animate-html
        $("body").stop().animate({scrollTop: $(id2Animate).offset().top}, animSpeed, easeType);
    } else {
        $("html").stop().animate({scrollTop: $(id2Animate).offset().top}, animSpeed, easeType);
    }
}
