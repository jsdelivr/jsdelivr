
this.jetpackModules = this.jetpackModules || {};

window.jetpackModules.views = (function( window, $, _, Backbone, wp ) {
		'use strict';

		var views = {};

		views.List_Table = Backbone.View.extend({

			template : wp.template( 'Jetpack_Modules_List_Table_Template' ),

			/**
			 * If we can, use replaceState to change the URL and indicate the new filtering.
			 * This will be handy with redirecting back to the same state after activating/deactivating.
			 */
			updateUrl : function() {
				if ( ! window.history.replaceState ) {
					return;
				}

				var url      = window.location.href.split('?')[0] + '?page=jetpack_modules',
					m_tag    = $('.subsubsub .current'),
					m_filter = $('.button-group.filter-active .active'),
					m_sort   = $('.button-group.sort .active'),
					m_search = $('#srch-term-search-input').val();

				if ( m_search.length ) {
					url += '&s=' + encodeURIComponent( m_search );
				}

				if ( ! m_tag.hasClass('all') ) {
					url += '&module_tag=' + encodeURIComponent( m_tag.data('title') );
				}

				if ( m_filter.data('filter-by') ) {
					url += '&' + encodeURIComponent( m_filter.data('filter-by') ) + '=' + encodeURIComponent( m_filter.data('filter-value') );
				}

				if ( 'name' !== m_sort.data('sort-by') ) {
					url += '&sort_by=' + encodeURIComponent( m_sort.data('sort-by') );
				}

				window.history.replaceState( {}, '', url );
			},

			render : function() {
				this.model.filter_and_sort();
				this.$el.html( this.template( this.model.attributes ) );
				this.updateUrl();
				return this;
			},

			initialize : function() {
				this.listenTo( this.model, 'change', this.render );
			}

		});

		return views;

})( this, jQuery, _, Backbone, wp );
