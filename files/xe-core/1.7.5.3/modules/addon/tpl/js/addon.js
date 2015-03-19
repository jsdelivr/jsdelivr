/**
 * @brief 애드온의 활성/비활성 토글용 함수
 * fo_addon이라는 id를 가지는 form에 인자로 주어진 addon값을 세팅후 실행
 **/
function doToggleAddon(addon, type) {
	if(typeof(type) == "undefined") type = "pc";
    var fo_obj = jQuery('#fo_addon').get(0);
    fo_obj.addon.value = addon;
    fo_obj.type.value = type;
    procFilter(fo_obj, toggle_activate_addon);
}
