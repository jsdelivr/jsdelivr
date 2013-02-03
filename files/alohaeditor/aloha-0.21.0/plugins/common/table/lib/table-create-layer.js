define(
['jquery'],
function (jQuery) {
	/**
	 * Initialize of the CreateLayer object
	 */
	CreateLayer = function(TablePlugin){
		this.TablePlugin = TablePlugin;
	};

	/**
	 * Internal configuration of the create-table panel
	 */
	CreateLayer.prototype.parameters = {
		elemId: 'aloha-table-createLayer', // id of the create-table panel
		className: 'aloha-table-createdialog',   // class-name of the create-table panel
		numX: 10,	         // Number of cols in the create-layer
		numY: 10,            // Number of rows in the create-layer vertically
		layer: undefined,    // Attribute holding the create-layer
		target: undefined    // the clicktarget which was clicked on (mostly the button of the floatingmenu)
	};

	/**
	 * The configuration-object for the implementer of the plugin. All keys of
	 * the "parameters" object could be overwritten within this object and will
	 * simply be used instead.
	 */
	CreateLayer.prototype.config = new Object();

	/**
	 * Flag wether the CreateLayer is currently visble or not
	 */
	CreateLayer.prototype.visible = false;

	/**
	 * This function checks if there is an create-table-layer. If no layer exists, it creates one and puts it into the configuration.
	 * If the layer was already created it sets the position of the panel and shows it.
	 *
	 * @return void
	 */
	CreateLayer.prototype.show = function(){
		var layer = this.get('layer');

		// create the panel if the layer doesn't exist
		if (layer == null) {
			this.create();
		}else {
			// or reposition, cleanup and show the layer
			this.setPosition(layer);
			layer.find('td').removeClass('hover');
			layer.show();
		}
		this.visible = true;
	};

	/**
	 * Creates the div-layer which holds a table with the given number of rows and cols.
	 * It sets click and mouseover-events to the table data fields
	 *
	 * @return void
	 */
	CreateLayer.prototype.create = function () {
		var that = this;
		var layer = jQuery('<div></div>');
		layer.id = this.get('elemId');
		layer.addClass(this.get('className'));

		var table = jQuery('<table></table>');
		table.css('width', (this.get('numX') + 6) * 15);
		var tr;
		var td;

		for (var i = 0; i < this.get('numY'); i++) {
			tr = jQuery('<tr></tr>');

			for (var j = 0; j < this.get('numX'); j++) {
				td = jQuery('<td>\u00a0</td>');

				if (i == 0 && j == 0) {
					td.addClass('hover');
				}

				td.bind('mouseover', {rowId: i, colId: j}, function(e) {
					that.handleMouseOver(e, table);
				});

				td.bind('click', {rowId: i, colId: j}, function(e){
					var rows = e.data.rowId + 1;
					var cols = e.data.colId + 1;

					that.TablePlugin.createTable(cols, rows);
					that.hide();
				});

				tr.append(td);
			}
			table.append(tr);
		}
		layer.append(table);

		// set attributes
		this.set('layer', layer);
		this.setPosition();

		// stop bubbling the click on the create-dialog up to the body event
		layer.bind('click', function(e) {
			e.stopPropagation();
		}).mousedown(function(e) {
			e.stopPropagation();
		});

		// append layer to body and
		// hide the create layer if user clicks anywhere in the body
		jQuery('body').append(layer).bind('click', function(e) {
			// If the layer is visible and the event target is not the
			// button itself or a descendant of the button, hide the
			// layer.
			if (that.visible && !(e.target === that.get('target')[0] || jQuery.contains(that.get('target')[0], e.target))) {
				that.hide();
			}
		});
	};

	/**
	 * handles the mose over state for a cell
	 * @param e event object
	 * @param table the aeffected table
	 * @return void
	 */
	CreateLayer.prototype.handleMouseOver = function(e, table) {
		var rowId = e.data.rowId;
		var colId = e.data.colId;
		var innerRows = table.find('tr');

		for (var n = 0; n <= innerRows.length; n++) {
			var innerCells = jQuery(innerRows[n]).find('td');

			for (var k = 0; k <= innerCells.length; k++) {
				if (n <= rowId && k <= colId) {
					jQuery(innerCells[k]).addClass('hover');
				} else {
					jQuery(innerCells[k]).removeClass('hover');
				}
			}
		}
	};

	/**
	 * Sets the "left" and "top" style-attributes according to the clicked target-button
	 *
	 *  @return void
	 */
	CreateLayer.prototype.setPosition = function() {
		var targetObj = jQuery(this.get('target'));
		var pos = targetObj.offset();
		this.get('layer').css('left', pos.left + 'px');
		this.get('layer').css('top', (pos.top + targetObj.height()) + 'px');
	};

	/**
	 * Hides the create-table panel width the jQuery-method hide()
	 *
	 * @see jQuery().hide()
	 * @return void
	 */
	CreateLayer.prototype.hide = function() {
		this.get('layer').hide();
		this.visible = false;
	};

	/**
	 * The "get"-method returns the value of the given key. First it searches in the
	 * config for the property. If there is no property with the given name in the
	 * "config"-object it returns the entry associated with in the parameters-object
	 *
	 * @param property
	 * @return void
	 */
	CreateLayer.prototype.get = function(property) {
		// return param from the config
		if (this.config[property]) {
			return this.config[property];
		}
		// if config-param was not found return param from the parameters-object
		if (this.parameters[property]) {
			return this.parameters[property];
		}
		return undefined;
	};

	/**
	 * The "set"-method takes a key and a value. It checks if there is a key-value
	 * pair in the config-object. If so it saves the data in the config-object. If
	 * not it saves the data in the parameters-object.
	 *
	 * @param key
	 *            the key which should be set
	 * @param value
	 *            the value which should be set for the associated key
	 */
	CreateLayer.prototype.set = function (key, value) {
		// if the key already exists in the config-object, set it to the config-object
		if (this.config[key]) {
			this.config[key] = value;

			// otherwise "add" it to the parameters-object
		}else{
			this.parameters[key] = value;
		}
	};

	return CreateLayer;
});
