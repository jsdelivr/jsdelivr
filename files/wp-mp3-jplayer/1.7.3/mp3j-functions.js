/*	MP3-jPlayer common functions js 
	1.7.3	*/

/* Setup ======================= */
function I_unwrap() {	
	if (fox_playf === "true") { 
		var i;
		var j;
		if ( typeof foxInline !== "undefined" ) {
			for (i=0; i < foxInline.length; i++) { foxInline[i].mp3 = f_arr.f_con(foxInline[i].mp3); }
		}		
		if ( typeof mp3j_info !== "undefined" ) {
			for (i=0; i < mp3j_info.length; i++) { 
				if ( mp3j_info[i].has_ul === 1 ) {
					var arr = mp3j_info[i].list; 
					for (j=0; j < arr.length; j++) { arr[j].mp3 = f_arr.f_con(arr[j].mp3); }
				}
			}
		}
		if ( typeof mp3j_fields !== "undefined" ) {
			for (i=0; i < mp3j_fields.length; i++) { 
				var arr = mp3j_fields[i].list; 
				for (j=0; j < arr.length; j++) { arr[j].mp3 = f_arr.f_con(arr[j].mp3); }
			}
		}
	}
}

function I_setup_players() {	
	var j;
	for ( j=0; j < mp3j_info.length; j++) 
	{	
		i_make_volume( j );
		i_write_download( j );
		i_write_stop_buttons( j );
		
		/* Single-file inlines */
		if ( mp3j_info[j].has_ul === 0 ) {
			// click PlayPause wrap
			jQuery("#playpause_wrap_mp3j_"+j).data( "player", { id:j } ).click( function() {
				E_playpause_click( jQuery(this).data("player").id );
				jQuery(this).blur();
				return false;
			});
			// doubleclick PlayPause wrap
			jQuery("#playpause_wrap_mp3j_"+j).data( "player", { id:j } ).dblclick( function() {
				if ( $state !== "playing" ) { E_playpause_click( jQuery(this).data("player").id ); }
				jQuery(this).blur();
				return false;
			});
		}
		/* Playlists */
		if ( mp3j_info[j].has_ul === 1 ) {
			i_write_lists_controls(j);
			// click PlayPause button
			jQuery("#playpause_mp3j_"+j).data( "player", { id:j } ).click( function() { 
				E_playpause_click( jQuery(this).data("player").id );
				jQuery(this).blur();
				return false;
			});
			// doubleclick PlayPause button
			jQuery("#playpause_mp3j_"+j).data( "player", { id:j } ).dblclick( function() { 
				if ( $state !== "playing" ) { E_playpause_click( jQuery(this).data("player").id ); }
				jQuery(this).blur();
				return false;
			});
		}
		/* Status displays */
		if ( mp3j_info[j].status === "full" ) {
			jQuery("#P-Time-MI_"+j).text("00:00");
			jQuery("#statusMI_"+j).append('Ready');
		}
	}
}

function I_images() {
	if (document.images) {	
		pic1= new Image(4,4); pic1.src=foxpathtoimages+"t30w.png"; //default hover on playlist li
	}
}

function i_make_volume ( id ) {
	jQuery('#vol_mp3j_'+id).slider({
		value : mp3j_info[id].vol,
		max: 100,
		range: 'min',
		animate: FoxAnimSlider,
		slide: function(event, ui) { 
			mp3j_info[id].vol = ui.value;
			if ( id === $tid ) { jQuery("#jquery_jplayer").jPlayer("volume", ui.value); }
		}
	});	
}

function i_write_download(id) {
	if ( mp3j_info[id].download === true ) {
		var list = mp3j_info[id].list;
		var track = mp3j_info[id].tr;
		jQuery("#download_mp3j_"+id).empty();
		jQuery("#download_mp3j_"+id).append("<a href=\"" + list[track].mp3 + "\">DOWNLOAD MP3</a>");
	}
}

function i_write_stop_buttons(id) {
	// click Stop
	jQuery("#stop_mp3j_"+id).data( "player", { pid:id } ).click( function() {
		E_stop_click( jQuery(this).data("player").pid );
		jQuery(this).blur();
		return false;
	});
	// double click Stop
	jQuery("#stop_mp3j_"+id).data( "player", { pid:id } ).dblclick( function() {
		E_stop_doubleclick( jQuery(this).data("player").pid );
		jQuery(this).blur();
		return false;
	});	
}

function i_write_lists_controls(id) {
	var newPlayerList =  mp3j_info[id].list;
	var i;
	if ( newPlayerList.length > 1 ) // Write UL's & prev/next clicks
	{
		jQuery("#UL_mp3j_"+id).empty();
		for (i=0; i < newPlayerList.length; i++) { // Write playlist
			var listItem = (i === newPlayerList.length-1) ? "<li class='mp3j_LI_last'>" : "<li>";
			listItem += "<a href='#' id='mp3j_A_"+id+"_"+i+"' tabindex='1'>"+ newPlayerList[i].name +"</a></li>";
			jQuery("#UL_mp3j_"+id).append(listItem);
			if ( i === 0 ) { 
				jQuery("#mp3j_A_"+id+"_"+i).addClass("mp3j_A_current").parent().addClass("mp3j_A_current"); 
			}
			// click Playlist
			jQuery("#mp3j_A_"+id+"_"+i).data( "player", {index:i, pid:id} ).click( function() {
				if ( $tid !== id || ($tid === id && jQuery(this).data("player").index !== mp3j_info[id].tr) ) {
					E_change_track( jQuery(this).data("player").pid, jQuery(this).data("player").index );
				}
				jQuery(this).blur();
				return false;
			});
		}
		// click Next
		jQuery("#Next_mp3j_"+id).data( "player", {pid:id} ).click( function() {
			E_change_track( jQuery(this).data("player").pid, "next" );
			jQuery(this).blur();
			return false;
		});
		// click Prev
		jQuery("#Prev_mp3j_"+id).data( "player", {pid:id} ).click( function() {
			E_change_track( jQuery(this).data("player").pid, "prev" );
			jQuery(this).blur();
			return false;
		});
		
		if ( !mp3j_info[id].lstate ) { // TODO swap things round
			mp3j_info[id].lstate = true;
			MI_toggleplaylist( "SHOW PLAYLIST", id );
		}
	} else { // Only 1 track, hide list and toggle 
		jQuery("#UL_mp3j_"+id).hide();
		jQuery("#playlist-toggle_"+id).hide(); 
	}
	
	// Write 1st titles & captions
	jQuery('#T_mp3j_'+id).append(newPlayerList[mp3j_info[id].tr].name);
	if ( newPlayerList[mp3j_info[id].tr].artist !== "" ) { 
		if ( mp3j_info[id].type === "MI" ) {
			jQuery('#C_mp3j_'+id).append(newPlayerList[mp3j_info[id].tr].artist); 
		} else { 
			jQuery('#T_mp3j_'+id).append(" - " + newPlayerList[mp3j_info[id].tr].artist); 
		}
	}
}

/* Events =============================================================== */
function E_playpause_click( id ) {
	if ( $tid === id && $state === "playing" ) {
		jQuery("#jquery_jplayer").jPlayer("pause");
		play_button( id );
		$state = "paused";
		$link_playID = "";
		return;
	}
	if ( $tid !== id ) {
		var lastid = $tid;
		$tid = ""; 
		var playlist = mp3j_info[id].list;
		var track = mp3j_info[id].tr;
		jQuery("#jquery_jplayer").jPlayer("volume", 100); //vol scaling workaround
		jQuery("#jquery_jplayer").jPlayer("setFile", playlist[track].mp3);
		play_button( lastid );
		clear_bars( lastid );
		clear_status( lastid );
		make_slider( id );
	}
	pause_button( id );
	jQuery("#jquery_jplayer").jPlayer("play");
	jQuery("#jquery_jplayer").jPlayer("volume", mp3j_info[id].vol); // reset to correct vol
	$state = "playing";
	$link_playID = "";
	$tid = id;
}

function E_stop_click( id ) {
	if ( $tid === id ) {
		play_button( id );
		clear_bars( id );
		clear_status( id );
		$tid = "";
		jQuery("#jquery_jplayer").jPlayer("clearFile");
		if ( mp3j_info[id].status === "full" ) { jQuery("#statusMI_" + id).text('Stopped'); }
		$state = "";
		$link_playID = "";
	}
}

function E_stop_doubleclick( id ) {
	change_list_classes( id, 0 );
	change_titles( id, 0 );
	change_dload_link( id, 0 );
	clear_status( id );
	mp3j_info[id].tr = 0;
	if ( $tid === id ) {
		play_button( id );
		clear_bars( id );
		$tid = "";
		jQuery("#jquery_jplayer").jPlayer("clearFile");
		$state = "";
		$link_playID = "";
	}
}

function E_change_track( id, change ) {
	var playlist = mp3j_info[id].list;
	var track;
	var lastid = $tid;
	if ( change === "next" ) { 
		track = ( mp3j_info[id].tr+1 < playlist.length ) ? mp3j_info[id].tr+1 : 0; 
	} else if ( change === "prev" ) { 
		track = ( mp3j_info[id].tr-1 < 0 ) ? playlist.length-1 : mp3j_info[id].tr-1; 
	} else { 
		track = change; 
	}
	change_list_classes( id, track );
	change_titles( id, track );
	change_dload_link( id, track );
	play_button( lastid );
	if ( $tid !== id ) { jQuery("#jquery_jplayer").jPlayer("volume", 100); } //vol scaling workaround
	$tid = id; //
	jQuery("#jquery_jplayer").jPlayer("setFile", playlist[track].mp3);
	pause_button( id );
	jQuery("#jquery_jplayer").jPlayer("play");
	jQuery("#jquery_jplayer").jPlayer("volume", mp3j_info[id].vol); //reset to correct vol
	mp3j_info[id].tr = track;
	clear_bars( lastid );
	clear_status( lastid );
	make_slider( id );
	$state = "playing";
	$link_playID = "";
}


function run_sound_complete() {
	if ( mp3j_info[$tid].has_ul === 1 ) {
		var playlist = mp3j_info[$tid].list;
		//if ( mp3j_info[$tid].loop || mp3j_info[$tid].tr+1 !== playlist.length ) {
		if ( (mp3j_info[$tid].loop || mp3j_info[$tid].tr+1 !== playlist.length) && $link_playID === "" ) {
			E_change_track( $tid, "next" );
		} else {
			change_list_classes( $tid, 0 );
			change_titles( $tid, 0 );
			change_dload_link( $tid, 0 );
			mp3j_info[$tid].tr = 0;
			play_button( $tid );
			clear_bars( $tid );
			clear_status( $tid );
			$tid = "";
			$link_playID = "";
			jQuery("#jquery_jplayer").jPlayer("setFile", silence_mp3 );
			jQuery("#jquery_jplayer").jPlayer("play");
			jQuery("#jquery_jplayer").jPlayer("clearFile");
			$state = "";
			mp3j_init();
		}
	} else {
		play_button( $tid );
		clear_bars( $tid );
		clear_status( $tid );
		var id = $tid;
		$tid = "";
		jQuery("#jquery_jplayer").jPlayer("setFile", silence_mp3 );
		jQuery("#jquery_jplayer").jPlayer("play");
		jQuery("#jquery_jplayer").jPlayer("clearFile");
		$state = "";
		if ( mp3j_info[id].loop ) {
			E_playpause_click( id );
		} else {
			mp3j_init();
		}
	}
}

/* Do stuff =============================================================== */
function change_titles( id, track ) {
	var playlist = mp3j_info[id].list;
	
	//jQuery('#T_mp3j_'+id).text( playlist[track].name );
	jQuery('#T_mp3j_'+id).empty();
	jQuery('#T_mp3j_'+id).append( playlist[track].name );
	
	//if ( playlist[track].artist !== "" ) { jQuery('#C_mp3j_'+id).text( playlist[track].artist ); } 
	//else { jQuery('#C_mp3j_'+id).empty(); }
	jQuery('#C_mp3j_'+id).empty();
	if ( playlist[track].artist !== "" ) { 
		jQuery('#C_mp3j_'+id).append( playlist[track].artist ); 
	} 
	
}

function change_dload_link( id, track ) {
	if ( !mp3j_info[id].download ) { return; }
	var playlist = mp3j_info[id].list;
	jQuery("#download_mp3j_"+id).empty();
	jQuery("#download_mp3j_"+id).removeClass("whilelinks");
	jQuery("#download_mp3j_"+id).append("<a href=\"" + playlist[track].mp3 + "\">DOWNLOAD MP3</a>");
}

function clear_bars( id ) {
	if ( id === "" ) { return; }
	jQuery("#load_mp3j_"+id).css( "width", "0" );
	jQuery('#posbar_mp3j_'+id).slider('destroy');	
}

function clear_status( id ) {
	if ( id === "" ) { return; }
	if ( mp3j_info[id].status === "basic" ) { jQuery("#indi_mp3j_" + id + " span").replaceWith(""); }
	if ( mp3j_info[id].status === "full" ) { 
		jQuery("#T-Time-MI_" + id).empty();
		jQuery("#statusMI_" + id).text('Ready');
		jQuery("#P-Time-MI_" + id).text("00:00");
	}
}

function pause_button( id ) {
	if ( mp3j_info[id].play_txt === "#USE_G#" ) { 
		jQuery("#playpause_mp3j_"+id).removeClass("buttons_mp3j"); 
		jQuery("#playpause_mp3j_"+id).addClass("buttons_mp3jpause"); 
	} else { 
		jQuery("#playpause_mp3j_"+id).empty(); 
		jQuery("#playpause_mp3j_"+id).append( mp3j_info[id].pause_txt ); 
	}
	return;
}

function play_button( id ) {
	if ( id === "" ) { return; }
	if ( mp3j_info[id].play_txt === "#USE_G#" ) {
		jQuery("#playpause_mp3j_"+id).removeClass("buttons_mp3jpause");
		jQuery("#playpause_mp3j_"+id).addClass("buttons_mp3j");
	} else {
		jQuery("#playpause_mp3j_"+id).empty();
		jQuery("#playpause_mp3j_"+id).append(mp3j_info[id].play_txt);
	}
	return;
}

function stop_popout() {
	if( typeof newwindow !== "undefined" && !newwindow.closed && newwindow.jQuery("#jquery_jplayer").jPlayer("getData", "diag.isPlaying") ){
		newwindow.jQuery("#jquery_jplayer").jPlayer("clearFile");
	}	
}

var f_arr = {
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	f_con : function (input) {
		var output = ""; var chr1, chr2, chr3; var enc1, enc2, enc3, enc4; var i = 0;
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while (i < input.length) {
			enc1 = this._keyStr.indexOf(input.charAt(i++)); enc2 = this._keyStr.indexOf(input.charAt(i++)); enc3 = this._keyStr.indexOf(input.charAt(i++)); enc4 = this._keyStr.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4); chr2 = ((enc2 & 15) << 4) | (enc3 >> 2); chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);
			if (enc3 !== 64) { output = output + String.fromCharCode(chr2); }
			if (enc4 !== 64) { output = output + String.fromCharCode(chr3); }
		}
		output = f_arr._utf8_f_con(output);
		return output;
	},
	_utf8_f_con : function (utftext) {
		var string = ""; 
		var i = 0; 
		var c1 = 0; 
		var c2 = 0;
		var c = 0;
		while ( i < utftext.length ) {
			c = utftext.charCodeAt(i);
			if (c < 128) { string += String.fromCharCode(c); i++; } 
			else if((c > 191) && (c < 224)) { c2 = utftext.charCodeAt(i+1); string += String.fromCharCode(((c & 31) << 6) | (c2 & 63)); i += 2; }
			else { c2 = utftext.charCodeAt(i+1); c3 = utftext.charCodeAt(i+2); string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)); i += 3; }
		}
		return string;
	}
};