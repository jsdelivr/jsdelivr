jQuery(document).ready(function ($) {
	$('*[data-social-share-privacy=true]:not([data-init=true])').
	socialSharePrivacy().attr('data-init','true');
});
