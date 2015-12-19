/*	MP3-jPlayer
	1.7.3 */
	
var $tid = "";
var $state = "";
var global_lp = 0;
var pp_playerID;
var pp_startplaying;
var player_height = 100;
var popout_height;
var $link_playID = "";

jQuery(document).ready(function(){
	if ( typeof mp3j_info === "undefined" ) { return; }
	mp3j_setup();
	jQuery("#jquery_jplayer").jPlayer({
			ready: function() {
				mp3j_init();
			},
			oggSupport: false,
			volume: 100,
			swfPath: foxpathtoswf
	})
	.jPlayer("onProgressChange", function(loadPercent, playedPercentRelative, playedPercentAbsolute, playedTime, totalTime) {
		run_progress_update( $tid, loadPercent, playedPercentRelative, playedPercentAbsolute, playedTime, totalTime );
	})
	.jPlayer("onSoundComplete", function() {
		run_sound_complete();
	});	
	if (typeof window.mp3j_footerjs === "function") { mp3j_footerjs(); }
});

// Prep arrays, click functions & initial text
function mp3j_setup() {	
	I_images();
	I_unwrap();
	if ( typeof mp3j_info !== "undefined" ) { I_setup_players(); }
	return;
}

function mp3j_init() {
	var j;
	for ( j=0; j < mp3j_info.length; j++ ) {
		if ( mp3j_info[j].autoplay ) {
			mp3j_info[j].autoplay = false;
			E_playpause_click( j );
			return;
		}
	}
}

function make_slider( id ) { 
	if ( mp3j_info[id].status === "basic" ) { jQuery('#posbar_mp3j_'+id).css( "visibility", "hidden" ); }
	jQuery('#posbar_mp3j_'+id).slider({
		max: 1000,
		range: 'min',
		animate: FoxAnimSlider,
		slide: function(event, ui) { 
			if ( $state === "paused" ) { pause_button( id, mp3j_info[id].play_txt, mp3j_info[id].pause_txt ); }
			jQuery("#jquery_jplayer").jPlayer("playHead", ui.value*(10.0/global_lp) );
			$state = "playing";
		}
	});
}

function change_list_classes( id, track ) {
	jQuery("#mp3j_A_"+id+"_"+mp3j_info[id].tr).removeClass("mp3j_A_current").parent().removeClass("mp3j_A_current");
	jQuery("#mp3j_A_"+id+"_"+track).addClass("mp3j_A_current").parent().addClass("mp3j_A_current");
}

function run_progress_update( id, loadPercent, playedPercentRelative, playedPercentAbsolute, playedTime, totalTime ) {
	if ( id === "" ) { return; }
	//var ppaInt = parseInt(playedPercentAbsolute, 10);
	//var lpInt = parseInt(loadPercent, 10);
	global_lp = loadPercent;
	jQuery("#load_mp3j_"+id).css( "width", loadPercent+"%" );
	jQuery('#posbar_mp3j_'+id).slider('option', 'value', playedPercentAbsolute*10);
	var dl = mp3j_info[id].download;
	
	// BASIC Status update
	if ( mp3j_info[id].status === "basic" ) {	
		jQuery("#indi_mp3j_"+id).empty();
		if (jQuery("#jquery_jplayer").jPlayer("getData", "diag.isPlaying")){ // "PLAYING"
			if (playedTime===0 && loadPercent===0){ // connecting 
				jQuery("#indi_mp3j_"+id).append('<span style="margin-left:6px;"><span class="mp3-finding"></span><span class="mp3-tint" style="background:#999;"></span></span>');
				if ( dl ) { jQuery("#download_mp3j_"+id).removeClass("whilelinks"); jQuery("#download_mp3j_"+id).addClass("betweenlinks"); }
			}
			if (playedTime===0 && loadPercent>0){// buffering
				jQuery("#indi_mp3j_"+id).append('<span style="margin-left:6px;"><span class="mp3-finding"></span><span class="mp3-tint" style="background:#999;"></span></span>');
				if ( dl ) { jQuery("#download_mp3j_"+id).removeClass("betweenlinks"); jQuery("#download_mp3j_"+id).addClass("whilelinks"); }
			} 
			if (playedTime>0){ // playing
				jQuery('#posbar_mp3j_'+id).css( "visibility", "visible" );
				jQuery("#indi_mp3j_"+id).append('<span style="margin-left:6px;"><span class="mp3-tint" style="opacity:.8; filter:alpha(opacity=80);"></span></span>');
				jQuery("#indi_mp3j_"+id).append('<span> '+jQuery.jPlayer.convertTime(playedTime)+'</span>');
				if ( dl ) { jQuery("#download_mp3j_"+id).removeClass("betweenlinks"); jQuery("#download_mp3j_"+id).addClass("whilelinks"); }
			}
		} else { // "STOPPED"
			jQuery("#indi_mp3j_"+id).empty();
			if (playedTime>0){ // paused
				jQuery("#indi_mp3j_"+id).append('<span style="margin-left:6px;"><span class="mp3-tint" style="opacity:.8; filter:alpha(opacity=80);"></span></span>');
				jQuery("#indi_mp3j_"+id).append('<span> '+jQuery.jPlayer.convertTime(playedTime)+'</span>');
				if ( dl ) { jQuery("#download_mp3j_"+id).removeClass("betweenlinks"); jQuery("#download_mp3j_"+id).addClass("whilelinks"); }
			}
			if (playedTime===0){
				if(loadPercent>0){ // stopped
					if ( dl ) { jQuery("#download_mp3j_"+id).removeClass("betweenlinks"); jQuery("#download_mp3j_"+id).addClass("whilelinks"); }
				} 
			}
		}
	}
	//FULL Status update
	if ( mp3j_info[id].status === "full" ) {
		jQuery("#T-Time-MI_"+id).hide();
		jQuery("#T-Time-MI_"+id).text(jQuery.jPlayer.convertTime(totalTime));
		jQuery("#P-Time-MI_"+id).text(jQuery.jPlayer.convertTime(playedTime));
		jQuery("#statusMI_"+id).empty();
		if (jQuery("#jquery_jplayer").jPlayer("getData", "diag.isPlaying")){ // "PLAYING"
			if (playedTime===0 && loadPercent===0){ // connecting 
				jQuery("#statusMI_"+id).append('<span class="mp3-finding"></span><span class="mp3-tint"></span>Connecting');
				if ( dl ) { jQuery("#download_mp3j_"+id).removeClass("whilelinks"); jQuery("#download_mp3j_"+id).addClass("betweenlinks"); }
			}
			if (playedTime===0 && loadPercent>0){// buffering
				jQuery("#statusMI_"+id).append('<span class="mp3-loading"></span><span class="mp3-tint"></span>Buffering');
				jQuery("#T-Time-MI_"+id).show();
				if ( dl ) { jQuery("#download_mp3j_"+id).removeClass("betweenlinks"); jQuery("#download_mp3j_"+id).addClass("whilelinks"); }
			} 
			if (playedTime>0){ // playing
				jQuery("#statusMI_"+id).append('Playing');
				jQuery("#T-Time-MI_"+id).show();
				if ( dl ) { jQuery("#download_mp3j_"+id).removeClass("betweenlinks"); jQuery("#download_mp3j_"+id).addClass("whilelinks"); }
			}
		} else { // "STOPPED"
			if (playedTime>0){ // paused
				jQuery("#statusMI_"+id).append('Paused');
				jQuery("#T-Time-MI_"+id).show();
				if ( dl ) { jQuery("#download_mp3j_"+id).removeClass("betweenlinks"); jQuery("#download_mp3j_"+id).addClass("whilelinks"); }
			} 
			if (playedTime===0){ 
				if(loadPercent>0){ // stopped
					jQuery("#statusMI_"+id).append('Stopped');
					jQuery("#T-Time-MI_"+id).show();
					if ( dl ) { jQuery("#download_mp3j_"+id).removeClass("betweenlinks"); jQuery("#download_mp3j_"+id).addClass("whilelinks"); }
				} else { // ready 
					jQuery("#statusMI_"+id).append('Ready');
				}
			}
		}
	}
}

function launch_mp3j_popout( url, id ) {
	var li_height = 28; 
	player_height = 100 + mp3j_info[id].height;
	popout_height = ( mp3j_info[id].list.length > 1 ) ? player_height + ( mp3j_info[id].list.length * li_height) : player_height;
	if ( popout_height > popup_maxheight ) { popout_height = popup_maxheight; }
	var open_at_height = ( mp3j_info[id].lstate ) ? popout_height : player_height;
	
	pp_startplaying = ( jQuery("#jquery_jplayer").jPlayer("getData", "diag.isPlaying") ) ? true : false;
	pp_playerID = id;
	play_button( $tid );
	clear_bars( $tid );
	clear_status( $tid );
	$tid = "";
	$state = "";
	$link_playID = "";
	// g chrome workaround, stops the hang
	jQuery("#jquery_jplayer").jPlayer("setFile", silence_mp3 );
	jQuery("#jquery_jplayer").jPlayer("play");
	
	jQuery("#jquery_jplayer").jPlayer("clearFile");
	// open popup window
	newwindow = window.open(url,'mp3jpopout','height=100,width=100,location=1,status=1,scrollbars=1,resizable=1,left=25,top=25');
	newwindow.resizeTo( popup_width, open_at_height );
	if (window.focus) { newwindow.focus(); }
	return false;
}

function MI_toggleplaylist(text, id){
	if ( mp3j_info[id].lstate ) {
		if ( text==="" ) { text="SHOW"; }
		jQuery("#L_mp3j_"+id).fadeOut(300);
		jQuery("#playlist-toggle_"+id).empty();
		jQuery("#playlist-toggle_"+id).append(text);
		mp3j_info[id].lstate = false;
		return;
	}
	if ( !mp3j_info[id].lstate ) {
		if ( text==="" ) { text="HIDE"; }
		jQuery("#L_mp3j_"+id).fadeIn("slow");
		jQuery("#playlist-toggle_"+id).empty();
		jQuery("#playlist-toggle_"+id).append(text);
		mp3j_info[id].lstate = true;
		return;
	}			
}

function link_plays_track( player, track ) {
	if ( typeof mp3j_info === "undefined" ) { return; }
	player--;
	track--;
	if ( player === $link_playID && track === mp3j_info[player].tr && $state !== "" ) {
		return;	
	}
	if ( typeof mp3j_info[player].has_ul !== "undefined" && mp3j_info[player].has_ul === 1 ) {
		if ( track >= 0 && track < mp3j_info[player].list.length ) {
			E_change_track( player, track );
			$link_playID = player;
		}
	}
}