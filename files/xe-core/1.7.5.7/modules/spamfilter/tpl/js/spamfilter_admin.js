/**
 * @brief 금지 IP 삭제
 **/
function doDeleteDeniedIP(ipaddress) {
	var fo_obj = get_by_id('spamfilterDelete');
    fo_obj.ipaddress.value = ipaddress;
	fo_obj.act.value = "procSpamfilterAdminDeleteDeniedIP";
	fo_obj.submit();
}

/**
 * @brief 금지 단어 삭제
 **/
function doDeleteDeniedWord(word) {
	var fo_obj = get_by_id('spamfilterDelete');
	fo_obj.word.value = word;
	fo_obj.act.value = "procSpamfilterAdminDeleteDeniedWord";
	fo_obj.submit();
}
