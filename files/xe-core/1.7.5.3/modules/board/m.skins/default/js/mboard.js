function completeInsertComment(ret_obj)
{
	var error = ret_obj.error;
	var message = ret_obj.message;
	var mid = ret_obj.mid;
	var document_srl = ret_obj.document_srl;
	var comment_srl = ret_obj.comment_srl;

	var url = current_url.setQuery('mid',mid).setQuery('document_srl',document_srl).setQuery('act','');
	if(comment_srl) url = url.setQuery('rnd',comment_srl)+"#comment_"+comment_srl;

	location.href = url;
}

function completeDocumentInserted(ret_obj)
{
	var error = ret_obj.error;
	var message = ret_obj.message;
	var mid = ret_obj.mid;
	var document_srl = ret_obj.document_srl;
	var category_srl = ret_obj.category_srl;

	var url;
	if(!document_srl)
	{
		url = current_url.setQuery('mid',mid).setQuery('act','');
	}
	else
	{
		url = current_url.setQuery('mid',mid).setQuery('document_srl',document_srl).setQuery('act','');
	}
	if(category_srl) url = url.setQuery('category',category_srl);

	location.href = url;
}

function completeGetPage(ret_val)
{
	jQuery("#cl").remove();
	jQuery("#clpn").remove();
	jQuery("#clb").parent().after(ret_val.html);
}

function loadPage(document_srl, page)
{
	var params = {};
	params.cpage = page;
	params.document_srl = document_srl;
	params.mid = current_mid;
	jQuery.exec_json('board.getBoardCommentPage', params, completeGetPage);
}

function completeDeleteComment(ret_obj)
{
	var error = ret_obj.error;
	var message = ret_obj.message;
	var mid = ret_obj.mid;
	var document_srl = ret_obj.document_srl;
	var page = ret_obj.page;

	var url = current_url.setQuery('mid',mid).setQuery('document_srl',document_srl).setQuery('act','');
	if(page) url = url.setQuery('page',page);

	location.href = url;
}

function completeDeleteDocument(ret_obj)
{
	var error = ret_obj.error;
	var message = ret_obj.message;
	var mid = ret_obj.mid;
	var page = ret_obj.page;

	var url = current_url.setQuery('mid',mid).setQuery('act','').setQuery('document_srl','');
	if(page) url = url.setQuery('page',page);

	location.href = url;
}

