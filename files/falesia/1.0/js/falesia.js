$smallw = 650;
$(document).ready(function() {
	$('.nav-tabs li a').click( function(e) {
	history.pushState( null, null, $(this).attr('href') );
	});

	$("[data-toggle=tooltip]").tooltip();
	$('.fal-tooltip').tooltip();
});

function validateInteger(strValue) {
	var objRegExp = /(^-?\d\d*$)/;
	return objRegExp.test(strValue);
}
function toggle(id) {
	divArray = new Array();
	divArray[0] = document.getElementById(id);

	for (i = 0; i < divArray.length; i++) {
		if (divArray[i].style.display != 'none') {
			divArray[i].style.display = 'none';
		} else {
			divArray[i].style.display = '';
		}
	}
}
function trim(str) {
	var str = str.replace(/^\s\s*/, ''), ws = /\s/, i = str.length;
	while (ws.test(str.charAt(--i)))
		;
	return str.slice(0, i + 1);
}
function validateEmail(emailaddress) {
	var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	if (!emailReg.test(emailaddress)) {
		return false;
	} else if (trim(emailaddress).length == 0) {
		return false;
	} else {
		return true;
	}
}
function verificaSub() {
	if (!validateEmail(document.subscribe.mail.value)) {
		alert("INVALID E-MAIL");
		return false;
	} else {
		return true;
	}
}
// AD SERVER
sas_tmstp = Math.round(Math.random() * 10000000000);
sas_masterflag = 1;
function SmartAdServer(sas_pageid, sas_formatid, sas_target) {
	if (sas_masterflag == 1) {
		sas_masterflag = 0;
		sas_master = 'M';
	} else {
		sas_master = 'S';
	}
	;
	document.write('<scr' + 'ipt src="'
			+ (document.location.protocol == 'https:' ? 'https:' : 'http:')
			+ '//www6.smartadserver.com/call/pubj/' + sas_pageid + '/'
			+ sas_formatid + '/' + sas_master + '/' + sas_tmstp + '/'
			+ escape(sas_target) + '?"></scr' + 'ipt>');
	// document.write('<scr'+'ipt src="'+(document.location.protocol == 'https:'
	// ? 'https:' : 'http:')+'//www6.smartadserver.com/call/pubj/' + sas_pageid
	// + '/' + sas_formatid + '/' + sas_master + '/' + sas_tmstp + '/' +
	// escape(sas_target) + '?"></scr'+'ipt>');
}

// REFRESH
function rfrsh(url) {
	setTimeout('location.href="' + url + '"', 1000);
}
// JQUERY
jQuery.validator.addMethod("require_from_group", function(value, element,
		options) {
	var numberRequired = options[0], selector = options[1], $fields = $(
			selector, element.form), validOrNot = $fields.filter(function() {
		return $(this).val();
	}).length >= numberRequired, validator = this;
	if (!$(element).data('being_validated')) {
		$fields.data('being_validated', true).each(function() {
			validator.valid(this);
		}).data('being_validated', false);
	}
	if (validOrNot) {
		$(selector).each(function() {
			$(this).removeClass('error');
			$('label.error[for=' + $(this).attr('id') + ']').remove();
		});
	}
	return validOrNot;
});
// AUTOCOMPLETE RIPETIZIONI
$("#autocompfal0")
		.ready(
				function($) {
					$("#autocompfal0")
							.autocomplete(
									{
										source : "check_route.php",
										appendTo : "#myModalRip",
										minLength : 3,
										select : function(event, ui) {
											var code = ui.item.id;
											if (code != '') {
												location.href = '/amm_wiki.php?op=Falesia_Wiki&f=viaproponi_user&wid=0&wikion=1&vid='
														+ code;
											}
										},
									});
				});
$("#autocompfal")
		.ready(
				function($) {
					$("#autocompfal")
							.autocomplete(
									{
										source : "check_route.php",
										minLength : 3,
										select : function(event, ui) {
											var code = ui.item.id;
											if (code != '') {
												location.href = '/amm_wiki.php?op=Falesia_Wiki&f=viaproponi_user&wid=0&wikion=1&vid='
														+ code;
											}
										},
									});
				});
// PER CARICARE TAB BOOSTRAP DIRETTAMENTE
$(function() {
	var url = document.location.toString();
	var scrollHeight = $(document).scrollTop();
	if (url.match('#') && !url.match(/#\./)) {
		$('.nav-tabs a[href=#' + url.split('#')[1] + ']').tab('show');
	    setTimeout(function() {
	        $(window).scrollTop(scrollHeight );
	    }, 5);
	}
	$('a[data-toggle="tab"]').on('show.bs.tab', function(e) {
		window.location.hash = e.target.hash;
//		alert(e.target.hash);
//		if(e.target.hash=="#tb_gra_bou"){
//			alert(2);
//			chart1.draw(data1, opt1);
//		}
	});
	$("a[href^='\#']").each(function(){ 
		  this.href=location.href.split("#")[0]+'#'+this.href.substr(this.href.indexOf('#')+1);
	});	
});

/* global $ */
$(function() {
	$('[id^=file_upload]')
			.fileUploadUI(
					{
						namespace : this.id,
						imageTypes : '/^image\/(gif|jpeg|png|jpg)$/',
						uploadTable : $('#files'),
						downloadTable : $('#files'),
						buildUploadRow : function(files, index) {
							return $('<tr><td>'
									+ files[index].name
									+ '<\/td>'
									+ '<td class="file_upload_progress"><img src="/themes/falesia/images/pbar-ani3.gif"/><div><\/div><\/td>'
									+ '<td class="file_upload_cancel">'
									+ '<button class="ui-state-default ui-corner-all" title="Cancel">'
									+ '<span class="ui-icon ui-icon-cancel">Cancel<\/span>'
									+ '<\/button><\/td><\/tr>');
						},

						buildDownloadRow : function(file) {
							return $('<tr><td>' + file.name
									+ '<\/td><td>|Size: ' + file.size
									+ '<\/td><\/tr>');
						},
						beforeSend : function(event, files, index, xhr,
								handler, callBack) {
							var regexp = /\.(png)|(jpg)|(gif)|(jpeg)$/i;
							// Using the filename extension for our test,
							// as legacy browsers don't report the mime type
							if (!regexp.test(files[index].name)) {
								handler.uploadRow
										.find('.file_upload_progress')
										.html(
												'<font color="red"><b>{S_ONLY_IMG}</b></font>');
								setTimeout(function() {
									handler.removeNode(handler.uploadRow);
								}, 10000);
								return;
							}
							if (files[index].size > 2048000) {

								handler.uploadRow
										.find('.file_upload_progress')
										.html(
												'<font color="red"><b>{S_IMG_BIG}</b></font>');
								setTimeout(function() {
									handler.removeNode(handler.uploadRow);
								}, 10000);
								return;
							}

							callBack();

						},
						onComplete : function(event, files, index, xhr, handler) {
							handler.onCompleteAll(files);
						},
						onCompleteAll : function(files) {
							// The files array is a shared object between the
							// instances of an upload selection.
							// We extend it with a uploadCounter to calculate
							// when all uploads have completed:
							if (!files.uploadCounter) {
								files.uploadCounter = 1;
							} else {
								files.uploadCounter = files.uploadCounter + 1;
							}
							if (files.uploadCounter === files.length) {
								/* your code after all uplods have completed */
								window.location.reload();
							}
						}

					});
});
// CSS MAP

$(function($) {

	$size = $(window).width();
	if ($size < $smallw) {
		$ss1 = 0;
		$ss2 = 0;
	} else {
		$ss1 = 430;
		$ss2 = 290;
	}
	$('#map-continents').cssMap({
		'size' : $ss1, // set map size to 435px wide;
		loadingText : '',// Sting: text of the preloader; HTML tags allowed;
	});
	$('#map-italy').cssMap({
		'size' : $ss2, // set map size to 435px wide;
	});
});

var dynWid=0;
function calcolaWid(diff){
	var wid0 = $('#panel_gra').width();
	dynWid=parseInt(wid0-40-diff);
//	alert('p='+wid0+'|f='+dynWid);	
}
