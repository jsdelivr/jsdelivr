jQuery(document).ready(function($) {
	//color picker
    var f = $.farbtastic('#picker');
    var p = $('#picker').css('opacity', 0.25);
    var selected;
    $('.colorwell').each(function () { f.linkTo(this); $(this).css('opacity', 0.75); }).focus(function() {
        if (selected) { $(selected).css('opacity', 0.75).removeClass('colorwell-selected'); }
        f.linkTo(this);
        p.css('opacity', 1);
        $(selected = this).css('opacity', 1).addClass('colorwell-selected');
    });
    $('.colorwell').click(function() {
		var position = $(selected = this).position();
    	$('#picker').css('left', (position.left + 150) );
    	$('#picker').css('top', position.top); 
    	$('#picker').fadeIn(900,function (){
    		$('#picker').css('display', 'inline');
	    });
	}).blur(function(){
    	  $('#picker').fadeOut('fast');
    	  $('#picker').css('display', 'none');
    });

	//image button upload - thanks Brad Williams, Ozh Richard, and Justin Tadlock!
	var formfield = null;
	
	$('#upload_image_button').click(function() {
		$('html').addClass('Image');
		formfield = $('#category-image').attr('name');
		tb_show('', 'media-upload.php?type=image&TB_iframe=true');
		return false;
	});
	
	// user inserts file into post. only run custom if user started process using the above process
	// window.send_to_editor(html) is how wp would normally handle the received data
	window.original_send_to_editor = window.send_to_editor;
	window.send_to_editor = function(html){
	    var fileurl;

		if (formfield != null) {
			fileurl = $('img',html).attr('src');

			$('#category-image').val(fileurl);

			tb_remove();

			$('html').removeClass('Image');
			formfield = null;
		} else {
			window.original_send_to_editor(html);
		}
	};
});