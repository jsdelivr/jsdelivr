(function($){
	var Jetpack_CSS = {
		modes: {
			'default': 'text/css',
			'less': 'text/x-less',
			'sass': 'text/x-scss'
		},
		init: function() {
			this.$textarea = $( '#safecss' );
			this.editor = window.CodeMirror.fromTextArea( this.$textarea.get(0),{
				mode: this.getMode(),
				lineNumbers: true,
				tabSize: 2,
				indentWithTabs: true,
				lineWrapping: true
			});
			this.setEditorHeight();
		},
		addListeners: function() {
			// nice sizing
			$( window ).on( 'resize', _.bind( _.debounce( this.setEditorHeight, 100 ), this ) );
			// keep textarea synced up
			this.editor.on( 'change', _.bind( function( editor ){
				this.$textarea.val( editor.getValue() );
			}, this ) );
			// change mode
			$( '#preprocessor_choices' ).change( _.bind( function(){
				this.editor.setOption( 'mode', this.getMode() );
			}, this ) );
		},
		setEditorHeight: function() {
			var height = $('html').height() - $( this.editor.getWrapperElement() ).offset().top;
			this.editor.setSize( null, height );
		},
		getMode: function() {
			var mode = $( '#preprocessor_choices' ).val();
			if ( '' === mode || ! this.modes[ mode ] )
				mode = 'default';
			return this.modes[ mode ];
		}
	}

	$( document ).ready( _.bind( Jetpack_CSS.init, Jetpack_CSS ) );
})(jQuery);