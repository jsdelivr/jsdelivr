YUI.add('gallery-aui-swf', function(A) {

var Lang = A.Lang,
	UA = A.UA,
	getClassName = A.ClassNameManager.getClassName,

	NAME = 'swf',

	ATTR_VERSION = '10.22',
	ATTR_EXPRESS_INSTALL_URL = 'http://fpdownload.macromedia.com/pub/flashplayer/update/current/swf/autoUpdater.swf?' + (+ new Date),
	ATTR_TYPE = 'application/x-shockwave-flash',
	ATTR_CLSID = 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000',
	ATTR_EVENT_HANDLER = 'YUI.AUI._SWF.eventHandler',

	SF = 'ShockwaveFlash',
	VERSION = 0,

	SWF_INSTANCES = YUI.AUI.namespace('_SWF.instances'),

	CSS_SWF = getClassName(NAME);

YUI.AUI._SWF.eventHandler = function(id, event) {
	SWF_INSTANCES[id]._eventHandler(event);
};

if (UA.gecko || UA.webkit || UA.opera) {
	var flashMimeType = navigator.mimeTypes[ATTR_TYPE];

	if (flashMimeType) {
		var enabledPlugin = flashMimeType.enabledPlugin;

		var versions = [];
		versions = enabledPlugin.description.replace(/\s[rd]/g, '.');
		versions = versions.replace(/[A-Za-z\s]+/g, '');
		versions = versions.split('.');

		VERSION = versions[0] + '.';

		switch ((versions[2].toString()).length) {
			case 1:
				VERSION += '00';
			break;

			case 2:
				VERSION += '0';
			break;
		}

		VERSION += versions[2];
		VERSION = parseFloat(VERSION);
	}
}
else if (UA.ie) {
	try {
		var activeX6 = new ActiveXObject(SF + '.' + '6');
		activeX6.AllowScriptAccess = 'always';
	}
	catch (e) {
		if (activeX6 != null) {
			VERSION = 6.0;
		}
	}

	if (VERSION == 0) {
		try {
			var activeX = new ActiveXObject(SF + '.' + SF);
			var versions = [];

			versions = activeX.GetVariable('$version');
			versions = versions.replace(/[A-Za-z\s]+/g, '');
			versions = versions.split(',');

			VERSION = versions[0] + '.';

			switch ((versions[2].toString()).length) {
				case 1:
					VERSION += '00';
				break;

				case 2:
					VERSION += '0';
				break;
			}
		}
		catch (e) {
		}
	}
}

UA.flash = VERSION;

var SWF = A.Component.create(
	{
		NAME: NAME,

		ATTRS: {
			url: {
				value: ''
			},
			version: {
				value: VERSION
			},
			useExpressInstall: {
				value: false
			},
			fixedAttributes: {
				value: {}
			},
			flashVars: {
				value: {}
			},
			render: {
				value: true
			}
		},

		constructor: function(config) {
			var instance = this;

			if (arguments.length > 1) {
				var boundingBox = arguments[0];
				var url = arguments[1];
				var params = arguments[2] || {};

				config = {
					boundingBox: boundingBox,
					url: url,
					fixedAttributes: params.fixedAttributes,
					flashVars: params.flashVars
				};
			}

			SWF.superclass.constructor.call(this, config);
		},

		getFlashVersion: function() {
			return VERSION;
		},

		isFlashVersionAtLeast: function(ver) {
			return VERSION >= ver;
		},

		prototype: {
			CONTENT_TEMPLATE: null,

			renderUI: function() {
				var instance = this;

				var properFlashVersion = SWF.isFlashVersionAtLeast(instance.get('version'));
				var canExpressInstall = (UA.flash >= 8.0);

				var shouldExpressInstall = canExpressInstall && !properFlashVersion && instance.get('useExpressInstall');

				var flashURL = instance.get('url');

				if (shouldExpressInstall) {
					flashURL = ATTR_EXPRESS_INSTALL_URL;
				}

				var swfId = A.guid();

				SWF_INSTANCES[swfId] = this;

				instance._swfId = swfId;

				var contentBox = instance.get('contentBox');
				var flashVars = instance.get('flashVars');

				A.mix(
					flashVars,
					{
						YUISwfId: swfId,
						YUIBridgeCallback: ATTR_EVENT_HANDLER
					}
				);

				var flashVarString = A.QueryString.stringify(flashVars);

				var tplObj = '<object ';

				if ((properFlashVersion || shouldExpressInstall) && flashURL) {
					tplObj += 'id="' + swfId + '" ';

					if (UA.ie) {
						tplObj += 'classid="' + ATTR_CLSID + '" ';
					}
					else {
						tplObj += 'type="' + ATTR_TYPE + '" data="' + flashURL + '" ';
					}

					tplObj += 'height="100%" width="100%">';

					if (UA.ie) {
						tplObj += '<param name="movie" value="' + flashURL + '"/>';
					}

					var fixedAttributes = instance.get('fixedAttributes');

					for (var i in fixedAttributes) {
						tplObj += '<param name="' + i + '" value="' + fixedAttributes[i] + '" />';
					}

					if (flashVarString) {
						tplObj += '<param name="flashVars" value="' + flashVarString + '" />';
					}

					tplObj += '</object>';

					contentBox.set('innerHTML', tplObj);
				}

				instance._swf = A.one('#' + swfId);
			},

			bindUI: function() {
				var instance = this;

				instance.publish(
					'swfReady',
					{
						fireOnce: true
					}
				);
			},

			callSWF: function(fn, args) {
				var instance = this;

				args = args || [];

				var swf = instance._swf.getDOM();

				if (swf[fn]) {
					return swf[fn].apply(swf, args);
				}

				return null;
			},

			toString: function() {
				var instance = this;

				return 'SWF' + instance._swfId;
			},

			_eventHandler: function(event) {
				var instance = this;

				var eventType = event.type.replace(/Event$/, '');

				if (eventType != 'log') {
					instance.fire(eventType, event);
				}
			}
		}
	}
);

A.SWF = SWF;


}, 'gallery-2011.02.09-21-32' ,{requires:['gallery-aui-base','querystring-stringify-simple'], skinnable:false});
