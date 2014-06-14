/* global ich, jetpackL10n, jQuery */

(function( $, modules, currentVersion, jetpackL10n ) {

	///////////////////////////////////////
	// INIT
	///////////////////////////////////////

	$(document).ready(function () {
		initEvents();
		filterModules('introduced');
		loadModules();
		updateModuleCount();
	});

	///////////////////////////////////////
	// FUNCTIONS
	///////////////////////////////////////

	function closeShadeToggle() {
		// Clicking outside modal, or close X closes modal
		$('.shade, .modal header .close').on('click', function () {
			$('.shade, .modal').hide();
			$('.manage-right').removeClass('show');
			return false;
		});
	}

	function filterModules(prop) {

		// Mapping prior to sorting improves performance by over 50%
		var map = [],
			result = [],
			val = '',
			i,
			length;

		// create the map
		for (i=0, length = modules.length; i < length; i++) {

			// Prep value
			if ('name' === prop) {
				val = modules[i][prop].toLowerCase();
			} else {
				val = parseInt(modules[i][prop].replace('0:', '') * 10, 10);
			}

			map.push({
				index: i,
				value: val
			});
		}

		// sort the map
		map.sort(function(a, b) {
			if ('name' === prop) {
				return a.value > b.value ? 1 : -1;
			} else {
				return b.value > a.value ? 1 : -1;
			}
		});

		// copy values in right order
		for (i=0, length = map.length; i < length; i++) {
			result.push(modules[map[i].index]);
			result[i].index =  i; // make sure we set the index to the right order
		}

		// Replace old object, with newly sorted object
		modules = result;

		// If all modules are already showing, make sure they stay expanded
		if (!$('.load-more').is(':visible')) {
			$('.module').fadeIn();
		}
	}

	function filterModulesByCategory() {
		var categories,
			c, i, catId;

		// First alphabatize the modules
		filterModules('name');

		// Add category containers
		$('.modules').html(ich.category());

		// Loop through adding sections for each category
		for (i=0; i<modules.length; i++) {
			// Get categories
			categories = modules[i].module_tags;

			// Loop through each individual category
			for (c=0; c<categories.length; c++) {
				// Add modules to the correct categories
				catId = 'category-' + categories[c].toLowerCase().replace('.', '').replace(/ /g, '-');
				$('.' + catId + ' .clear').before(ich.mod(modules[i], true));
			}
		}

		recalculateModuleHeights();
		initModalEvents();
	}

	function initEvents () {
		// DOPS toggle
		$('#a8c-service-toggle, .dops-close').click(function() {
			$('.a8c-dops').toggleClass('show');
			$('#a8c-service-toggle .genericon').toggleClass('genericon-downarrow').toggleClass('genericon-uparrow');
			return false;
		});

		// Load more
		$('.load-more').click(function() {
			showAllModules();
			return false;
		});

		// Module filtering
		$('#newest, #category, #alphabetical').on('click', function () {
			var $this = $(this),
				prop = $this.data('filter');

			// Reset selected filter
			$('.jp-filter a').removeClass('selected');
			$this.addClass('selected');

			if ('cat' === prop) {
				filterModulesByCategory();
			} else {
				// Rearrange modules
				filterModules(prop);

				// Reload the DOM based on this new sort order
				loadModules();
			}

			showAllModules();
			return false;
		});

		// Search modules
		$('#jetpack-search').on('keydown', function () {
			var term = $(this).val();
			searchModules(term);
		});

		// Modal events
		$(document).ready(function () {
			initModalEvents();
		});

		// Debounce the resize event
		var pauseResize = false;
		window.onresize = function() {
			if ( !pauseResize ) {
				pauseResize = true;
				recalculateModuleHeights();
				setTimeout(function () {
					pauseResize = false;
				},100);
			}
		};

		// Close shade toggle
		closeShadeToggle();

		// Show specific category of modules
		$('.showFilter a').on('click', function () {
			$('.showFilter a').removeClass('active');
			$(this).addClass('active');

			// TODO Do sorting here

			return false;
		});
	}

	function initModalEvents() {
		var $modal = $('.modal');
		$('.module, .feature a, .configs a').on('click', function (e) {
			e.preventDefault();

			$('.shade').show();

			// Show loading message on init
			$modal.html(ich.modalLoading({}, true)).fadeIn();

			// Load & populate with content
			var $this = $(this),
				index = $this.data('index'),
				name = $this.data('name');

			$modal.html(ich.modalTemplate({}, true));
			$modal.find('header li').first().text(name);
			$modal.find('.content').html('');
			$modal.find('.content').html(modules[index].long_description);

			closeShadeToggle();

			// Modal header links
			$('.modal header li a').on('click', function () {
				$('.modal header li a').removeClass('active');
				$(this).addClass('active');
				return false;
			});
		});
	}

	function loadModules() {
		var html = '',
			featuredModules = [],
			featuredModulesIndex,
			i;

		if ($('.configure').length !== 0) {
			// Config page
			for (i=0; i<modules.length; i++) {
				html += ich.modconfig(modules[i], true);
			}

			$('table tbody').html(html);
		} else {
			// Array of featured modules
			$('.feature a.f-img').each(function() {
				featuredModules.push($( this ).data('name'));
			});
			
			// About page
			for (i=0; i<modules.length; i++) {
				if (currentVersion.indexOf(modules[i].introduced) !== -1) {
					modules[i]['new'] = true;
				}

				// Add data-index to featured modules
				featuredModulesIndex = featuredModules.indexOf(modules[i].name);
				if ( featuredModulesIndex > -1 ) {
					$('.feature').eq(featuredModulesIndex).find('a').data('index', i);
				}
				
				modules[i].index = i;

				html += ich.mod(modules[i], true);
			}

			$('.modules').html(html);

			recalculateModuleHeights();
			initModalEvents();
		}
	}

	function recalculateModuleHeights () {

		// Resize module heights based on screen resolution
		var module = $('.module, .jp-support-column-left .widget-text'),
			tallest = 0,
			thisHeight;

		// Remove heights
		module.css('height', 'auto');

		// Determine new height
		module.each(function() {

			thisHeight = $(this).outerHeight();

			if (thisHeight > tallest) {
				tallest = thisHeight;
			}
		});

		// Apply new height
		module.css('height', tallest + 'px');
	}

	function searchModules (term) {
		var html = '', i, lowercaseDesc, lowercaseName, lowercaseTerm;
		for (i=0; i<modules.length; i++) {
			lowercaseDesc = modules[i].description.toLowerCase();
			lowercaseName = modules[i].name.toLowerCase();
			lowercaseTerm = term.toLowerCase();
			if (lowercaseName.indexOf(lowercaseTerm) !== -1 || lowercaseDesc.indexOf(lowercaseTerm) !== -1) {
				html += ich.mod(modules[i], true);
			}
		}
		if ('' === html) {
			html = jetpackL10n.no_modules_found.replace( '{term}' , term );
		}
		$('.modules').html(html);
		recalculateModuleHeights();
		initModalEvents();
	}

	function showAllModules() {
		$('.module').fadeIn();
		$('.load-more').hide();
	}

	function updateModuleCount () {
		$('.load-more').text( jetpackL10n.view_all_features );
	}

})( jQuery, jetpackL10n.modules, jetpackL10n.currentVersion, jetpackL10n );
