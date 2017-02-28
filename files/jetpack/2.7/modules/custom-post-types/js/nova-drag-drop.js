(function($){
	var list;

	function init() {
		list = $("#the-list");
		dragMenus();
		addNonce();
		addSubmitButton();
	}

	function dragMenus() {
		list.sortable({
			cancel: '.no-items',
			stop: function( event, ui ) {
				if ( ui.item.is(':first-child') )
					return list.sortable('cancel');
				//
				reOrder();
			}
		});
	}

	function reOrder() {
		list.find(".menu-label-row").each(function() {
			var term_id = $(this).data('term_id');
			$(this).nextUntil('.menu-label-row').each(function(i) {
				var row = $(this);
				row.find('.menu-order-value').val(i);
				row.find('.nova-menu-term').val(term_id);
			});
		});
	}

	function addSubmitButton() {
		$('.tablenav').prepend('<input type="submit" class="button-primary button-reorder alignright" value="' + _novaDragDrop.reorder + '" name="' + _novaDragDrop.reorderName + '" />');
	}

	function addNonce() {
		$("#posts-filter").append('<input type="hidden" name="' + _novaDragDrop.nonceName + '" value="' + _novaDragDrop.nonce + '" />')
	}

	// do it
	$(document).ready(init);
})(jQuery);

