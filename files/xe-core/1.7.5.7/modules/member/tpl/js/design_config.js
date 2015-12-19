/* 멤버 스킨 컬러셋 구해옴 */
function doGetSkinColorset(skin) {
    var params = {skin:skin};
    var response_tags = ['error','message','tpl'];

	function on_complete(ret) {
		jQuery('#colorset').show();
		var $colorset = jQuery('#member_colorset'), old_h, new_h;

		old_h = $colorset.height();
		$colorset.html(ret.tpl);
		new_h = $colorset.height();

		try{ fixAdminLayoutFooter(new_h - old_h) }catch(e){ };
	}

    exec_xml(
		'member',
		'getMemberAdminColorset',
		{skin:skin},
		on_complete,
		['error','message','tpl']
	);
}
