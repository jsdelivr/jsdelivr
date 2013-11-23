(function($) {
	$(function() {
		$('.social-collapsible').each(function() {
			var $t = $(this);
			$t.find('.social-title a').click(function(e) {
				$t.toggleClass('social-open');
				e.preventDefault();
			});
		});

		/**
		 * Import from URL
		 */
		var running_import = false;
		$('#import_from_url').click(function(e) {
			e.preventDefault();

			if (!running_import) {
				running_import = true;

				var $this = $(this);
				$this.attr('disabled', 'disabled');
				$('input[name=source_url]').attr('disabled', 'disabled');
				$('#import_from_url_loader').show();
				$('#social-import-error').hide();

				$.get($this.attr('href'), {
					url: $('input[name=source_url]').val()
				}, function(response) {
					running_import = false;
					$('#import_from_url_loader').hide();
					$('input[name=source_url]').removeAttr('disabled').val('');
					$this.removeAttr('disabled');
					if (response == 'protected') {
						$('#social-import-error').html(socialAdminL10n.protectedTweet).fadeIn();
					} else if (response == 'invalid') {
						$('#social-import-error').html(socialAdminL10n.invalidUrl).fadeIn();
					} else {
						$('#aggregation_log').hide().html(response).find('.parent:not(:first)').hide().end().fadeIn();
					}
				});
			}
		});

		$('#social-source-url').keydown(function(e) {
			if (e.keyCode == 13) {
				e.preventDefault();
				$('#import_from_url').trigger('click');
			}
		});

		/**
		 * Manual Aggregation
		 */
		var running_aggregation = false;
		$('#run_aggregation').click(function(e) {
			e.preventDefault();

			if (!running_aggregation) {
				running_aggregation = true;

				var $this = $(this);
				$this.attr('disabled', 'disabled');
				$('#run_aggregation_loader').show();

				$.get($this.attr('href'), {}, function(response) {
					running_aggregation = false;
					$('#run_aggregation_loader').hide();
					$this.removeAttr('disabled');

					if (response.next_run != '0') {
						$('#social-next-run span').html(response.next_run);
					}
					$('#aggregation_log').hide().html(response.html).find('.parent:not(:first)').hide().end().fadeIn();
				}, 'json');
			}
		});
		$('#aggregation_log .parent:not(:first)').hide();
		$('#aggregation_log h5').live('click', function() {
			$('#' + $(this).attr('id') + '-output').toggle();
		});

		var running_row_aggregation = [];
		$('.row-actions .social_aggregation a').click(function(e) {
			e.preventDefault();
			var rel = $(this).attr('rel');
			if (!in_running_row_aggregation(rel)) {
				var $this = $(this);
				var $loader = $this.parent().find('.social_run_aggregation_loader');
				$this.hide().closest('.row-actions').addClass('social_run_aggregation');
				$loader.show();
				$.get(
					$this.attr('href'),
					{
						render: 'false',
						hide_li: 'true'
					},
					function(response) {
						remove_running_row_aggregation(rel);
						$loader.hide();
						$this.parent().find('.social-aggregation-results').remove();
						$this.parent().append(' ' + response.html).find('a').fadeIn();
					},
					'json'
				);
			}
		});

		var in_running_row_aggregation = function(rel) {
			for (var i = 0; i < running_row_aggregation.length; ++i) {
				if (running_row_aggregation[i] == rel) {
					return true;
				}
			}
			return false;
		};
		var remove_running_row_aggregation = function(rel) {
			var _running_row_aggregation = [];
			for (var i = 0; i < running_row_aggregation.length; ++i) {
				if (running_row_aggregation[i] != rel) {
					_running_row_aggregation.push(running_row_aggregation[i]);
				}
			}
			running_row_aggregation = _running_row_aggregation;
		};

		/**
		 * Regenerate API Key
		 */
		$('#social_regenerate_api_key').click(function(e) {
			e.preventDefault();
			$.get($(this).attr('href'), {}, function(response) {
				$('.social_api_key').html(response);
			});
		});

		/**
		 * Dismissal of notices.
		 */
		$('.social_dismiss').click(function(e) {
			e.preventDefault();
			var $this = $(this);
			$.get($this.attr('href'), {}, function() {
				$this.parent().parent().fadeOut();
			});
		});
		
		/**
		 * Facebook Pages support
		 */
		$('#social-facebook-pages').click(function() {
			var href = $(this).data('href');
			if (typeof href == 'undefined') {
				href = $('#facebook_signin').attr('href');
				$(this).data('href', href);
			}
			if ($(this).is(':checked')) {
				href += '&use_pages=true';
			}
			$('#facebook_signin').attr('href', href);
		});

		$('.broadcast-interstitial .broadcast-edit a.edit').click(function(e) {
			$(this).closest('.broadcast-edit').addClass('edit')
				.find('input[type="checkbox"]').prop('checked', true).change().end()
				.find('textarea').focus().select();
			e.preventDefault();
		});
		
		$('.broadcast-interstitial li.account input[type="checkbox"]').change(function() {
			var $parent = $(this).closest('.broadcast-edit');
			if ($(this).is(':checked')) {
				$parent.addClass('checked').find('textarea:visible').focus().select();
			}
			else {
				$parent.removeClass('checked');
			}
		});

		$('.broadcast-interstitial .broadcast-edit textarea').on('keyup change click focus', function() {
			$counter = $(this).closest('.broadcast-edit').find('.counter');
			var diff = parseInt($(this).attr('maxlength')) - parseInt($(this).val().length),
				diffClass = '';
			if (diff < 10) {
				diffClass = 'maxlength-remaining-short';
			}
			$counter.removeClass('maxlength-remaining-short').addClass(diffClass).html(diff);
		}).change();
		
		$('.broadcast-interstitial .broadcast-edit a.tweet-reply-link').click(function(e) {
			$(this).hide().closest('.broadcast-edit')
				.find('input[type="checkbox"]').prop('checked', true).change().end()
				.find('.tweet-reply-fields').show().find(':input').focus();
			e.preventDefault();
		});

		$('body.clean ul.accounts li.proto .broadcast-edit textarea').on('keyup change click focus', function() {
			var val = $(this).val();
			$(this).closest('ul.accounts').find('.broadcast-edit').not('.edit').each(function() {
				$(this).find('.readonly').text(val).end()
					.find('textarea').val(val);
			});
		});

	});
})(jQuery);
