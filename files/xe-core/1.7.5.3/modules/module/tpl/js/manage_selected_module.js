// manage selected module
jQuery(function($){

$('#manageSelectedModule .cnb a.tgAnchor')
	.bind('before-open.tc', function(){
		var self = this;
		$('#manageSelectedModule a.tgAnchor')
			.filter(function(){
				if (this == self) return false;
				return true;
			})
			.trigger('close.tc');
	});

$('a.modalAnchor[href=#manageSelectedModule]')
	.bind('before-open.mw', function(){
		var $selectedModule = $('input[type=checkbox].selectedModule:checked');
		var $selectedBody = $('#manageSelectedModuleBody');

		if (!$selectedModule.length) return false;

		$selectedBody.empty();

		var module_srls = new Array();
		$selectedModule.each(function(){
			var $this = $(this);
			var $row = $('<tr></tr>');
			var $mid = $('<td></td>').text($this.data('mid'));
			var $browser_title = $('<td></td>').text($this.data('browser_title'));
			$row.append($mid).append($browser_title);
			$selectedBody.append($row);
			module_srls.push($this.val());
		});

		$('#manageSelectedModuleSetup input[name=module_srls]').val(module_srls);
		$('#manageSelectedModuleAddition input[name=target_module_srl]').val(module_srls);
		$('#manageSelectedModuleGrant input[name=module_srls]').val(module_srls);
	});

});
