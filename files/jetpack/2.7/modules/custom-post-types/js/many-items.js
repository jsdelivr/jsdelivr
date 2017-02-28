(function( $ ){
	var menuSelector, nonceInput, methods;

	methods = {
		init : function( options ) { 
			var $this = this, tbody, row;

			this
				.on( 'keypress.manyItemsTable', function( event ) {
					if ( 13 !== event.which ) {
						return;
					}

					event.preventDefault();
					if ( 'function' === typeof FormData ) {
						methods.submitRow.apply( $this );
					}
					methods.addRow.apply( $this );
				} )
				.on( 'focus.manyItemsTable', ':input', function( event ) {
					$this.data( 'currentRow', $( this ).parents( 'tr:first' ) );
				} );

			tbody = this.find( 'tbody:first' );
			row = tbody.find( 'tr:first' ).clone();

			this.data( 'form', this.parents( 'form:first' ) );
			this.data( 'tbody', tbody );
			this.data( 'row', row );
			this.data( 'currentRow', row );

			menuSelector = $( '#nova-menu-tax' );
			nonceInput = $( '#_wpnonce' );

			return this;
		},

		destroy : function() {
			this.off( '.manyItemsTable' );

			return this;
		},

		submitRow : function() {
			var submittedRow, currentInputs, allInputs, partialFormData;

			submittedRow = this.data( 'currentRow' );
			currentInputs = submittedRow.find( ':input' );
			allInputs = this.data( 'form' ).find( ':input' ).not( currentInputs ).attr( 'disabled', true ).end();

			partialFormData = new FormData( this.data( 'form' ).get( 0 ) );
			partialFormData.append( 'ajax', '1' );
			partialFormData.append( 'nova_menu_tax', menuSelector.val() );
			partialFormData.append( '_wpnonce', nonceInput.val() );

			allInputs.attr( 'disabled', false );

			$.ajax( {
				url: '',
				type: 'POST',
				data: partialFormData,
				processData: false,
				contentType: false,
			} ).complete( function( xhr ) {
				submittedRow.html( xhr.responseText );
			} );

			currentInputs.attr( 'disabled', true );

			return this;
		},

		addRow : function() {
			var row = this.data( 'row' ).clone();
			row.appendTo( this.data( 'tbody' ) );
			row.find( ':input:first' ).focus();

			return this;
		},
	};
		
	$.fn.manyItemsTable = function( method ) {
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.manyItemsTable' );
			return this;
		}
	};

})( jQuery );
		
jQuery( '.many-items-table' ).one( 'focus', ':input', function( event ) {
	jQuery( event.delegateTarget ).manyItemsTable();
} );
