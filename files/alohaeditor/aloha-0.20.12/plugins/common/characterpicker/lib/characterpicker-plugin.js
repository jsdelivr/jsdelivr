/*
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/
define(
	['aloha', 
	'aloha/jquery', 
	'aloha/plugin', 
	'aloha/floatingmenu', 
	'i18n!characterpicker/nls/i18n', 
	'i18n!aloha/nls/i18n', 
	'css!characterpicker/css/characterpicker.css'],
function( Aloha, jQuery, Plugin, FloatingMenu, i18n, i18nCore ) {
	

	var
		GENTICS = window.GENTICS;

	function CharacterOverlay(characters, onSelectCallback) {
		var self = this;
		self.$node = jQuery('<table class="aloha-character-picker-overlay" role="dialog"><tbody></tbody></table>');
		// don't let the mousedown bubble up. otherwise there won't be an activeEditable 
		self.$node.mousedown(function(e) {
			return false;
		});
		self.$tbody = self.$node.find('tbody');
		self.$node.appendTo(jQuery('body'));
		self._createCharacterButtons(self.$node, characters, onSelectCallback);
		self._initHideOnDocumentClick();
		self._initHideOnEsc();
		self._initCursorFocus(onSelectCallback);
		self._initEvents();
	}
	CharacterOverlay.prototype = {
		show: function( insertButton ) {
			var self = this;
			// position the overlay relative to the insert-button
			self.$node.css(jQuery(insertButton).offset());
			self.$node.show();
			// focus the first character
			self.$node.find('.focused').removeClass('focused');
			jQuery(self.$node.find('td')[0]).addClass('focused');
		},
		_initHideOnDocumentClick: function() {
			var self = this;
			// if the user clicks somewhere outside of the layer, the layer should be closed
			// stop bubbling the click on the create-dialog up to the body event
			self.$node.click(function(e) {
				e.stopPropagation();
			});
			// hide the layer if user clicks anywhere in the body
			jQuery('body').click(function(e) {
				var overlayVisibleAndNotTarget
					=  (self.$node.css('display') === 'table')
					&& (e.target != self.$node[0])
				    // don't consider clicks to the 'show' button.
					&& !jQuery(e.target).is('button.aloha-button-characterpicker');
				if(overlayVisibleAndNotTarget) {
					self.$node.hide();
				}
			});
		},
		_initHideOnEsc: function() {
			var self = this;
			// escape closes the overlay
			jQuery(document).keyup(function(e) {
				var overlayVisibleAndEscapeKeyPressed = (self.$node.css('display') === 'table') && (e.keyCode === 27);
				if(overlayVisibleAndEscapeKeyPressed) {
					self.$node.hide();
				}
			});
		},
		_initCursorFocus: function( onSelectCallback ) {
			var self = this;
			// you can navigate through the character table with the arrow keys
			// and select one with the enter key
			var $current, $next, $prev, $nextRow, $prevRow;
			var movements = {
				13: function select() {
					$current = self.$node.find('.focused');
					self.$node.hide();
					onSelectCallback($current.text());
				},
				37: function left() {
					$current = self.$node.find('.focused');
					$prev = $current.prev().addClass('focused');
					if($prev.length > 0) {
						$current.removeClass('focused');
					}
				},
				38: function up() {
					$current = self.$node.find('.focused');
					$prevRow = $current.parent().prev();
					if($prevRow.length > 0) {
						$prev = jQuery($prevRow.children()[$current.index()]).addClass('focused');
						if($prev.length > 0) {
							$current.removeClass('focused');
						}
					}
				},
				39: function right() {
					$current = self.$node.find('.focused');
					$next = $current.next().addClass('focused');
					if($next.length > 0) {
						$current.removeClass('focused');
					}
				},
				40: function down() {
					$current = self.$node.find('.focused');
					$nextRow = $current.parent().next();
					if($nextRow.length > 0) {
						$next = jQuery($nextRow.children()[$current.index()]).addClass('focused');
						if($next.length > 0) {
							$current.removeClass('focused');
						}
					}
				}
			};
			jQuery(document).keydown(function(e) {
				e.stopPropagation( );
				var isOverlayVisible = self.$node.css('display') === 'table';
				if(isOverlayVisible) {
					// check if there is a move-command for the pressed key
					var moveCommand = movements[e.keyCode];
					if(moveCommand) {
						moveCommand();
						return false;
					}
				}
			});
		},
		_initEvents: function() {
			var self = this;
			// when the editable is deactivated, hide the layer
			Aloha.bind('aloha-editable-deactivated', function(event, rangeObject) {
				self.$node.hide();
			});
		},
		_createCharacterButtons: function($node, characters, onSelectCallback) {
			var self = this;
			function htmlEntityToSingleCharacter(character) {
				// isn't there any better way?
				var textarea = document.createElement('textarea');
				textarea.innerHTML = character;
				return textarea.value;
			}
			function mkButton(c) {
				var character = htmlEntityToSingleCharacter(c)
				return jQuery('<td>' + character + '</td>')
					.mouseover(function() {
						jQuery(this).addClass('mouseover');
					})
					.mouseout(function() {
						jQuery(this).removeClass('mouseover');
					})
					.click(function(e) {
						self.$node.hide();
						onSelectCallback(character);
						return false;
					});
			}
			function addRow() {
				return jQuery('<tr></tr>').appendTo(self.$tbody);
			}
			var characterList = jQuery.grep(
				characters.split(' '),
				function filterOutEmptyOnces(e) {
					return e != '';
				}
			);
			var i=0, char;
			var $row;
			while(char = characterList[i]) {
				// make a new row every 15 characters
				if(((i%15)===0)) {
					$row = addRow();
				}
				mkButton(char).appendTo($row);
				i++;
			}
		}
	};

	return Plugin.create('characterpicker', {
		_constructor: function(){
			this._super('characterpicker');
		},
		languages: ['en'],
		init: function() {
			var self = this;
			if (!Aloha.settings.plugins.characterpicker) {
				Aloha.settings.plugins.characterpicker = {}
			}
			self.settings = Aloha.settings.plugins.characterpicker || {};
			if(!self.settings.characters) {
				self.settings.characters = '&#38; &#34; &#162; &#8364; &#163; &#165; &#169; &#174; &#8482; &#8240; &#181; &#183; &#8226; &#8230; &#8242; &#8243; &#167; &#182; &#223; &#8249; &#8250; &#171; &#187; &#8216; &#8217; &#8220; &#8221; &#8218; &#8222; &#60; &#62; &#8804; &#8805; &#8211; &#8212; &#175; &#8254; &#164; &#166; &#168; &#161; &#191; &#710; &#732; &#176; &#8722; &#177; &#247; &#8260; &#215; &#185; &#178; &#179; &#188; &#189; &#190; &#402; &#8747; &#8721; &#8734; &#8730; &#8764; &#8773; &#8776; &#8800; &#8801; &#8712; &#8713; &#8715; &#8719; &#8743; &#8744; &#172; &#8745; &#8746; &#8706; &#8704; &#8707; &#8709; &#8711; &#8727; &#8733; &#8736; &#180; &#184; &#170; &#186; &#8224; &#8225; &#192; &#193; &#194; &#195; &#196; &#197; &#198; &#199; &#200; &#201; &#202; &#203; &#204; &#205; &#206; &#207; &#208; &#209; &#210; &#211; &#212; &#213; &#214; &#216; &#338; &#352; &#217; &#218; &#219; &#220; &#221; &#376; &#222; &#224; &#225; &#226; &#227; &#228; &#229; &#230; &#231; &#232; &#233; &#234; &#235; &#236; &#237; &#238; &#239; &#240; &#241; &#242; &#243; &#244; &#245; &#246; &#248; &#339; &#353; &#249; &#250; &#251; &#252; &#253; &#254; &#255; &#913; &#914; &#915; &#916; &#917; &#918; &#919; &#920; &#921; &#922; &#923; &#924; &#925; &#926; &#927; &#928; &#929; &#931; &#932; &#933; &#934; &#935; &#936; &#937; &#945; &#946; &#947; &#948; &#949; &#950; &#951; &#952; &#953; &#954; &#955; &#956; &#957; &#958; &#959; &#960; &#961; &#962; &#963; &#964; &#965; &#966; &#967; &#968; &#969; &#8501; &#982; &#8476; &#977; &#978; &#8472; &#8465; &#8592; &#8593; &#8594; &#8595; &#8596; &#8629; &#8656; &#8657; &#8658; &#8659; &#8660; &#8756; &#8834; &#8835; &#8836; &#8838; &#8839; &#8853; &#8855; &#8869; &#8901; &#8968; &#8969; &#8970; &#8971; &#9001; &#9002; &#9674; &#9824; &#9827; &#9829; &#9830;';
			}
			var insertButton = new Aloha.ui.Button({
				'name': 'characterpicker',
				'iconClass': 'aloha-button-characterpicker',
				'size': 'small',
				'onclick': function(element, event) { self.characterOverlay.show(element.btnEl.dom); },
				'tooltip': i18n.t('button.addcharacter.tooltip'),
				'toggle': false
			});
			FloatingMenu.addButton(
				'Aloha.continuoustext',
				insertButton,
				i18nCore.t('floatingmenu.tab.insert'),
				1
			);
			self.characterOverlay = new CharacterOverlay(self.settings.characters, self.onCharacterSelect);
		},
		/**
		 * insert a character after selecting it from the list
		*/
		onCharacterSelect: function(character) {
			var self = this;
			var range = Aloha.Selection.getRangeObject();
			
			if( Aloha.activeEditable ) {
				var charNode = jQuery(document.createTextNode(character));
				GENTICS.Utils.Dom.insertIntoDOM(
					charNode,
					range,
					jQuery(Aloha.activeEditable.obj),
					true
				);

				range.startContainer = range.endContainer = charNode.get( 0 );
				range.startOffset = range.endOffset = charNode.length;
				range.select();

			}
		}
	});

});
// vim: noexpandtab
