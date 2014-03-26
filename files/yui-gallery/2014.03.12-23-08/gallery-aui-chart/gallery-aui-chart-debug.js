YUI.add('gallery-aui-chart', function(A) {

var Lang = A.Lang,

	getClassName = A.ClassNameManager.getClassName,

	NAME = 'chart',

	CSS_CHART = getClassName(NAME),

	DEFAULT_SWF_PATH = A.config.base + 'gallery-aui-chart/assets/chart.swf';

YUI.AUI.namespace('_CHART');
YUI.AUI.namespace('defaults.chart');

var Chart = A.Component.create(
	{
		NAME: NAME,

		ATTRS: {
			type: {
				value: 'pie'
			},
			dataSource: {
				value: null
			},
			altText: {
				getter: '_getAltText',
				setter: '_setAltText'
			},
			swfURL: {
				valueFn: function() {
					return YUI.AUI.defaults.chart.swfURL || DEFAULT_SWF_PATH;
				}
			},
			swfCfg: {
				value: {}
			},
			request: {
				value: '*'
			},
			series: {
				value: null
			},
			categoryNames: {
				getter: '_getCategoryNames',
				setter: '_setCategoryNames'
			},
			dataTipFunction: {
				setter: '_setDataTipFunction'
			},
			legendLabelFunction: {
				setter: '_setLegendLabelFunction'
			},
			style: {
				value: null
			},
			pollingInterval: {
				value: 0
			}
		},

		// Statics
		proxyFunctionCount: 0,

		createProxyFunction: function(fn, context) {
			var index = Chart.proxyFunctionCount;

			var proxyName = 'proxyFunction' + index;

			YUI.AUI._CHART[proxyName] = A.bind(fn, context);

			Chart.proxyFunctionCount++;

			return 'YUI.AUI._CHART.' + proxyName;
		},

		getFunctionReference: function(value) {
			var instance = this;

			if (Lang.isFunction(value)) {
				value = Chart.createProxyFunction(value);
			}
			else if (value.fn && Lang.isFunction(value.fn)) {
				var args = [value.fn];

				if (value.context && Lang.isObject(context)) {
					args.push(value.context);
				}

				value = Chart.createProxyFunction(instance, args);
			}

			return value;
		},

		removeProxyFunction: function(fnName) {
			if (fnName && fnName.indexOf('YUI.AUI._CHART.proxyFunction') > -1) {
				fnName = fnName.substr(12);
				YUI.AUI._CHART[fnName] = null;
			}
		},

		prototype: {
			renderUI: function() {
				var instance = this;

				var possibleParams = {
					align: '',
					allowNetworking: '',
					allowScriptAccess: '',
					base: '',
					bgcolor: '',
					menu: '',
					name: '',
					quality: '',
					salign: '',
					scale: '',
					tabindex: '',
					wmode: ''
				};

				var contentBox = instance.get('contentBox');

				var params = {
					boundingBox: contentBox,
					fixedAttributes: {
						allowScriptAccess: 'always'
					},
					flashVars: {
						allowedDomain: document.location.hostname
					},
					backgroundColor: contentBox.getStyle('backgroundColor'),
					url: instance.get('swfURL'),
					height: instance.get('height'),
					width: instance.get('width'),
					version: 9.045
				};

				var swfCfg = instance.get('swfCfg');

				for (var i in swfCfg) {
					if (possibleParams.hasOwnProperty(i)) {
						params.fixedAttributes[i] = swfCfg[i];
					}
					else {
						params[i] = swfCfg[i];
					}
				}

				var version = params.version;

				if (version && Lang.isValue(version) && version != 'undefined') {
					var verString = (/\w*.\w*/.exec(((version).toString()).replace(/.0./g, '.'))).toString();
					var verSplit = verString.split('.');

					version = verSplit[0] + '.';

					switch ((verSplit[1].toString()).length) {
						case 1:
							version += '00';
						break;
						case 2:
							version += '0';
						break;
					}

					version += verSplit[1];

					params.version = parseFloat(version);
				}

				instance._swfWidget = new A.SWF(params);
				instance._swfNode = instance._swfWidget._swf;

				if (instance._swfNode) {
					instance._swf = instance._swfNode.getDOM();

					instance._swfWidget.on('swfReady', instance._eventHandler, instance);

					instance.set('swfCfg', params);
				}
			},

			bindUI: function() {
				var instance = this;

				instance.publish('itemMouseOver');
				instance.publish('itemMouseOut');
				instance.publish('itemClick');
				instance.publish('itemDblClick');
				instance.publish('itemDragStart');
				instance.publish('itemDragEnd');
				instance.publish('itemDrag');

				instance.after('seriesChange', instance.refreshData);
				instance.after('dataSourceChange', instance.refreshData);
				instance.after('pollingIntervalChange', instance.refreshData);

				var dataSource = instance.get('dataSource');

				dataSource.after('response', instance._loadDataHandler, instance);
			},

			setStyle: function(name, value) {
				var instance = this;

				value = A.JSON.stringify(value);

				instance._swf.setStyle(name, value);
			},

			setStyles: function(styles) {
				var instance = this;

				styles = A.JSON.stringify(styles);

				instance._swf.setStyles(styles);
			},

			setSeriesStyles: function(styles) {
				var instance = this;

				for (var i = 0; i < styles.length; i++) {
					styles[i] = A.JSON.stringify(styles[i]);
				}

				instance._swf.setSeriesStyles(styles);
			},

			_eventHandler: function(event) {
				var instance = this;

				if (event.type == 'swfReady') {
					instance._swfNode = instance._swfWidget._swf;
					instance._swf = instance._swfNode.getDOM();

					instance._loadHandler();
					instance.fire('contentReady');
				}
			},

			_loadHandler: function() {
				var instance = this;

				if (instance._swf && instance._swf.setType) {
					instance._swf.setType(instance.get('type'));

					var style = instance.get('style');

					if (style) {
						instance.setStyles(style);
					}

					instance._syncChartAttrs();

					instance._initialized = true;

					instance.refreshData();
				}
			},

			_syncChartAttrs: function() {
				var instance = this;

				var config = instance._originalConfig;

				if (config.categoryNames) {
					instance.set('categoryNames', config.categoryNames);
				}

				if (config.dataTipFunction) {
					instance.set('dataTipFunction', config.dataTipFunction);
				}

				if (config.legendLabelFunction) {
					instance.set('legendLabelFunction', config.legendLabelFunction);
				}

				if (config.series) {
					instance.set('series', config.series);
				}
			},

			refreshData: function() {
				var instance = this;

				if (instance._initialized) {
					var dataSource = instance.get('dataSource');

					if (dataSource) {
						var pollingID = instance._pollingID;

						if (pollingID !== null) {
							dataSource.clearInterval(pollingID);
							instance._pollingID = null;
						}

						var pollingInterval = instance.get('pollingInterval');
						var request = instance.get('request');

						if (pollingInterval > 0) {
							instance._pollingID = dataSource.setInterval(pollingInterval, request);
						}

						dataSource.sendRequest(request);
					}
				}
			},

			_loadDataHandler: function(event) {
				var instance = this;

				if (instance._swf && !event.error) {
					var seriesFunctions = instance._seriesFunctions;

					if (seriesFunctions) {
						for (var i = 0; i < seriesFunctions.length; i++) {
							Chart.removeProxyFunction(seriesFunctions[i]);
						}

						instance._seriesFunctions = null;
					}

					instance._seriesFunctions = [];

					var dataProvider = [];
					var seriesCount = 0;
					var currentSeries = null;
					var seriesDefs = instance.get('series');

					if (seriesDefs !== null) {
						seriesCount = seriesDefs.length;

						for (var i = 0; i < seriesCount; i++) {
							currentSeries = seriesDefs[i];

							var clonedSeries = {};

							for (var property in currentSeries) {
								if (property == 'style') {
									if (currentSeries.style !== null) {
										clonedSeries.style = A.JSON.stringify(currentSeries.style);
									}
								}
								else if (property == 'labelFunction') {
									if (currentSeries.labelFunction !== null) {
										clonedSeries.labelFunction = Chart.getFunctionReference(currentSeries.labelFunction);

										instance._seriesFunctions.push(clonedSeries.labelFunction);
									}
								}
								else if (property == 'dataTipFunction') {
									if (currentSeries.dataTipFunction !== null) {
										clonedSeries.dataTipFunction = Chart.getFunctionReference(currentSeries.dataTipFunction);

										instance._seriesFunctions.push(clonedSeries.dataTipFunction);
									}
								}
								else if (property == 'legendLabelFunction') {
									if (currentSeries.legendLabelFunction !== null) {
										clonedSeries.legendLabelFunction = Chart.getFunctionReference(currentSeries.legendLabelFunction);

										instance._seriesFunctions.push(clonedSeries.legendLabelFunction);
									}
								}
								else {
									clonedSeries[property] = currentSeries[property];
								}
							}

							dataProvider.push(clonedSeries);
						}
					}

					var type = instance.get('type');
					var results = event.response.results;

					if (seriesCount > 0) {
						for (var i = 0; i < seriesCount; i++) {
							currentSeries = dataProvider[i];

							if (!currentSeries.type) {
								currentSeries.type = type;
							}

							currentSeries.dataProvider = results;
						}
					}
					else {
						var series = {
							type: type,
							dataProvider: results
						};

						dataProvider.push(series);
					}

					try {
						if (instance._swf.setDataProvider) {
							instance._swf.setDataProvider(dataProvider);
						}
					}
					catch (e) {
						instance._swf.setDataProvider(dataProvider);
					}
				}
			},

			_getCategoryNames: function() {
				var instance = this;

				return instance._swf.getCategoryNames();
			},

			_setCategoryNames: function(value) {
				var instance = this;

				instance._swf.setCategoryNames(value);

				return value;
			},

			_setDataTipFunction: function(value) {
				var instance = this;

				if (instance._dataTipFunction) {
					Chart.removeProxyFunction(instance._dataTipFunction);
				}

				if (value) {
					instance._dataTipFunction = value = Chart.getFunctionReference(value);
				}

				instance._swf.setDataTipFunction(value);

				return value;
			},

			_setLegendLabelFunction: function(value) {
				var instance = this;

				if (instance._legendLabelFunction) {
					Chart.removeProxyFunction(instance._legendLabelFunction);
				}

				if (value) {
					instance._legendLabelFunction = value = Chart.getFunctionReference(value);
				}

				instance._swf.setLegendLabelFunction(value);

				return value;
			},

			_getAltText: function() {
				var instance = this;

				return instance._swf.getAltText();
			},

			_setAltText: function() {
				var instance = this;

				instance._swf.setAltText(value);

				return value;
			},

			_pollingID: null
		}
	}
);

A.Chart = Chart;

/*
	Pie Chart
*/

var Lang = A.Lang,

	getClassName = A.ClassNameManager.getClassName,

	NAME = 'piechart';

var PieChart = A.Component.create(
	{
		NAME: NAME,

		ATTRS: {
			dataField: {
				getter: '_getDataField',
				setter: '_setDataField',
				validator: Lang.isString
			},
			categoryField: {
				getter: '_getCategoryField',
				setter: '_setCategoryField',
				validator: Lang.isString
			}
		},

		EXTENDS: A.Chart,

		prototype: {
			_syncChartAttrs: function() {
				var instance = this;

				PieChart.superclass._syncChartAttrs.apply(instance, arguments);

				var config = instance._originalConfig;

				if (config.dataField) {
					instance.set('dataField', config.dataField);
				}

				if (config.categoryField) {
					instance.set('categoryField', config.categoryField);
				}
			},

			_getDataField: function() {
				var instance = this;

				return instance._swf.getDataField();
			},

			_setDataField: function(value) {
				var instance = this;

				instance._swf.setDataField(value);

				return value;
			},

			_getCategoryField: function() {
				var instance = this;

				return instance._swf.getCategoryField();
			},

			_setCategoryField: function(value) {
				var instance = this;

				instance._swf.setCategoryField(value);

				return value;
			}
		}
	}
);

A.PieChart = PieChart;

/*
	Cartesian Chart
*/

var Lang = A.Lang,

	getClassName = A.ClassNameManager.getClassName,

	NAME = 'cartesianchart',

	CSS_CARTESIANCHART = getClassName(NAME);

var CartesianChart = A.Component.create(
	{
		NAME: NAME,

		ATTRS: {
			xField: {
				getter: '_getXField',
				setter: '_setXField',
				validator: Lang.isString
			},
			yField: {
				getter: '_getYField',
				setter: '_setYField',
				validator: Lang.isString
			},
			xAxis: {
				setter: '_setXAxis'
			},
			xAxes: {
				setter: '_setXAxes'
			},
			yAxis: {
				setter: '_setYAxis'
			},
			yAxes: {
				setter: '_setYAxes'
			},
			constrain2view: {
				setter: '_setConstrain2view'
			}
		},

		EXTENDS: A.Chart,

		prototype: {
			initializer: function() {
				var instance = this;

				instance._xAxisLabelFunctions = [];
				instance._yAxisLabelFunctions = [];
			},

			destructor: function() {
				var instance = this;

				instance._removeAxisFunctions(instance._xAxisLabelFunctions);
				instance._removeAxisFunctions(instance._yAxisLabelFunctions);
			},

			_syncChartAttrs: function() {
				var instance = this;

				CartesianChart.superclass._syncChartAttrs.apply(instance, arguments);

				var config = instance._originalConfig;

				if (config.xField) {
					instance.set('xField', config.xField);
				}

				if (config.yField) {
					instance.set('yField', config.yField);
				}

				if (config.xAxis) {
					instance.set('xAxis', config.xAxis);
				}

				if (config.yAxis) {
					instance.set('yAxis', config.yAxis);
				}

				if (config.xAxes) {
					instance.set('xAxes', config.xAxes);
				}

				if (config.yAxes) {
					instance.set('yAxes', config.yAxes);
				}

				if (config.constrain2view) {
					instance.set('constrain2view', config.constrain2view);
				}
			},

			_getXField: function() {
				var instance = this;

				return instance._swf.getHorizontalField();
			},

			_setXField: function(value) {
				var instance = this;

				instance._swf.setHorizontalField(value);

				return value;
			},

			_getYField: function() {
				var instance = this;

				return instance._swf.getVerticalField();
			},

			_setYField: function(value) {
				var instance = this;

				instance._swf.setVerticalField(value);

				return value;
			},

			_getClonedAxis: function(value) {
				var instance = this;

				var clonedAxis = {};

				for (var i in value) {
					if (i == 'labelFunction') {
						if (value.labelFunction && value.labelFunction !== null) {
							clonedAxis.labelFunction = Chart.getFunctionReference(value.labelFunction);
						}
					}
					else {
						clonedAxis[i] = value[i];
					}
				}

				return clonedAxis;
			},

			_setXAxis: function(value) {
				var instance = this;

				if (value.position != 'bottom' && value.position != 'top') {
					value.position = 'bottom';
				}

				instance._removeAxisFunctions(instance._xAxisLabelFunctions);

				value = instance._getClonedAxis(value);

				instance._xAxisLabelFunctions.push(value.labelFunction);

				instance._swf.setHorizontalAxis(value);

				return value;
			},

			_setXAxes: function(value) {
				var instance = this;

				instance._removeAxisFunctions(instance._xAxisLabelFunctions);

				for (var i = 0; i < value.length; i++) {
					var val = value[i];

					if (val.position == 'left') {
						val.position = 'bottom';
					}

					value[i] = instance._getClonedAxis(val);

					val = value[i];

					if (val.labelFunction) {
						instance._xAxisLabelFunctions.push(val.labelFunction);
					}

					instance._swf.setHorizontalAxis(val);
				}
			},

			_setYAxis: function(value) {
				var instance = this;

				instance._removeAxisFunctions(instance._yAxisLabelFunctions);

				value = instance._getClonedAxis(value);

				instance._yAxisLabelFunctions.push(value.labelFunction);

				instance._swf.setVerticalAxis(value);
			},

			_setYAxes: function(value) {
				var instance = this;

				instance._removeAxisFunctions(instance._yAxisLabelFunctions);

				for (var i = 0; i < value.length; i++) {
					value[i] = instance._getClonedAxis(value[i]);

					var val = value[i];

					if (val.labelFunction) {
						instance._yAxisLabelFunctions.push(val.labelFunction);
					}

					instance._swf.setVerticalAxis(val);
				}
			},

			_setConstrain2view: function(value) {
				var instance = this;

				instance._swf.setConstrainViewport(value);
			},

			setSeriesStylesByIndex: function(index, style) {
				var instance = this;

				if (instance._swf && instance._swf.setSeriesStylesByIndex) {
					style = A.JSON.stringify(style);

					instance._swf.setSeriesStylesByIndex(index, style);
				}
			},

			_removeAxisFunctions: function(axisFunctions) {
				var instance = this;

				if (axisFunctions && axisFunctions.length) {
					for (var i = 0; i < axisFunctions.length; i++) {
						var axisFn = axisFunctions[i];

						if (axisFn) {
							A.Chart.removeProxyFunction(axisFn);
						}
					}

					axisFunctions = [];
				}
			}
		}
	}
);

A.CartesianChart = CartesianChart;

var Lang = A.Lang,

	getClassName = A.ClassNameManager.getClassName,

	NAME = 'linechart',

	CSS_LINECHART = getClassName(NAME);

var LineChart = A.Component.create(
	{
		NAME: NAME,

		ATTRS: {
			type: {
				value: 'line'
			}
		},

		EXTENDS: A.CartesianChart
	}
);

A.LineChart = LineChart;

var Lang = A.Lang,

	getClassName = A.ClassNameManager.getClassName,

	NAME = 'columnchart',

	CSS_COLUMNCHART = getClassName(NAME);

var ColumnChart = A.Component.create(
	{
		NAME: NAME,

		ATTRS: {
			type: {
				value: 'column'
			}
		},

		EXTENDS: A.CartesianChart
	}
);

A.ColumnChart = ColumnChart;

var Lang = A.Lang,

	getClassName = A.ClassNameManager.getClassName,

	NAME = 'barchart',

	CSS_BARCHART = getClassName(NAME);

var BarChart = A.Component.create(
	{
		NAME: NAME,

		ATTRS: {
			type: {
				value: 'bar'
			}
		},

		EXTENDS: A.CartesianChart
	}
);

A.BarChart = BarChart;

var Lang = A.Lang,

	getClassName = A.ClassNameManager.getClassName,

	NAME = 'stackedcolumnchart',

	CSS_STACKEDCOLUMNCHART = getClassName(NAME);

var StackedColumnChart = A.Component.create(
	{
		NAME: NAME,

		ATTRS: {
			type: {
				value: 'stackcolumn'
			}
		},

		EXTENDS: A.CartesianChart
	}
);

A.StackedColumnChart = StackedColumnChart;

var Lang = A.Lang,

	getClassName = A.ClassNameManager.getClassName,

	NAME = 'stackedbarchart',

	CSS_STACKEDBARCHART = getClassName(NAME);

var StackedBarChart = A.Component.create(
	{
		NAME: NAME,

		ATTRS: {
			type: {
				value: 'stackbar'
			}
		},

		EXTENDS: A.CartesianChart
	}
);

A.StackedBarChart = StackedBarChart;

var Axis = function() {
};

Axis.prototype = {
	type: null,
	reverse: false,
	labelFunction: null,
	labelSpacing: 2,
	title: null
};

A.Chart.Axis = Axis;

var NumericAxis = function() {
	NumericAxis.superclass.constructor.apply(this, arguments);
};

A.extend(
	NumericAxis,
	Axis,
	{
		type: 'numeric',
		minimum: NaN,
		maximum: NaN,
		majorUnit: NaN,
		minorUnit: NaN,
		snapToUnits: true,
		stackingEnabled: false,
		alwaysShowZero: true,
		scale: 'linear',
		roundMajorUnit: true,
		calculateByLabelSize: true,
		position: 'left',
		adjustMaximumByMajorUnit: true,
		adjustMinimumByMajorUnit: true
	}
);

A.Chart.NumericAxis = NumericAxis;

var TimeAxis = function() {
	TimeAxis.superclass.constructor.apply(this, arguments);
};

A.extend(
	TimeAxis,
	Axis,
	{
		type: 'time',
		minimum: null,
		maximum: null,
		majorUnit: NaN,
		majorTimeUnit: null,
		minorUnit: NaN,
		minorTimeUnit: null,
		snapToUnits: true,
		stackingEnabled: false,
		calculateByLabelSize: true
	}
);

A.Chart.TimeAxis = TimeAxis;

var CategoryAxis = function() {
	CategoryAxis.superclass.constructor.apply(this, arguments);
};

A.extend(
	CategoryAxis,
	Axis,
	{
		type: 'category',
		categoryNames: null,
		calculateCategoryCount: false
	}
);

A.Chart.CategoryAxis = CategoryAxis;

var Series = function() {
};

Series.prototype = {
	type: null,
	displayName: null
};

A.Chart.Series = Series;

var CartesianSeries = function() {
	CartesianSeries.superclass.constructor.apply(this, arguments);
};

A.extend(
	CartesianSeries,
	Series,
	{
		xField: null,
		yField: null,
		axis: 'primary',
		showInLegend: true
	}
);

A.Chart.CartesianSeries = CartesianSeries;

var ColumnSeries = function() {
	ColumnSeries.superclass.constructor.apply(this, arguments);
};

A.extend(
	ColumnSeries,
	CartesianSeries,
	{
		type: 'column'
	}
);

A.Chart.ColumnSeries = ColumnSeries;

var LineSeries = function() {
	LineSeries.superclass.constructor.apply(this, arguments);
};

A.extend(
	LineSeries,
	CartesianSeries,
	{
		type: 'line'
	}
);

A.Chart.LineSeries = LineSeries;

var BarSeries = function() {
	BarSeries.superclass.constructor.apply(this, arguments);
};

A.extend(
	BarSeries,
	CartesianSeries,
	{
		type: 'bar'
	}
);

A.Chart.BarSeries = BarSeries;

var PieSeries = function() {
	PieSeries.superclass.constructor.apply(this, arguments);
};

A.extend(
	PieSeries,
	Series,
	{
		type: 'pie',
		dataField: null,
		categoryField: null,
		labelFunction: null
	}
);

A.Chart.PieSeries = PieSeries;

var StackedBarSeries = function() {
	StackedBarSeries.superclass.constructor.apply(this, arguments);
};

A.extend(
	StackedBarSeries,
	CartesianSeries,
	{
		type: 'stackbar'
	}
);

A.Chart.StackedBarSeries = StackedBarSeries;

var StackedColumnSeries = function() {
	StackedColumnSeries.superclass.constructor.apply(this, arguments);
};

A.extend(
	StackedColumnSeries,
	CartesianSeries,
	{
		type: 'stackcolumn'
	}
);

A.Chart.StackedColumnSeries = StackedColumnSeries;


}, 'gallery-2011.02.09-21-32' ,{requires:['datasource','gallery-aui-swf','json'], skinnable:false});
