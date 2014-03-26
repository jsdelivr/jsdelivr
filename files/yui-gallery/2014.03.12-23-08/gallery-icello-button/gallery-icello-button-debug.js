YUI.add('gallery-icello-button', function(Y) {

'use strict';

/** 
* @module gallery-icello-button
*/
var BASENAME = 'icello-button',
	getCN = Y.ClassNameManager.getClassName,
	getCss = function (name) {
		return getCN(BASENAME, name);
	},
    getIconCss = function (name) {
        return getCN(BASENAME, 'icon', name);
    },
    css = {
		DISABLED: getCss('disabled')
	},
    ICONS = null,
	templates = {
		ICON_ONLY: [
			'<button class="yui3-widget yui3-icello-button yui3-icello-button-content yui3-icello-button-icononly">',
			'<span class="yui3-icello-button-icon {icon}"></span>',
			'<span class="yui3-icello-button-label">&nbsp;</span>',
			'</button>'
		],
		ICON_WITH_LABEL: [
			'<button class="yui3-widget yui3-icello-button yui3-icello-button-content yui3-icello-button-iconwithlabel">',
			'<span class="yui3-icello-button-icon {icon}"></span>',
			'<span class="yui3-icello-button-label">{label}</span>',
			'</button>'
		],
		LABEL_ONLY: [
			'<button class="yui3-widget yui3-icello-button yui3-icello-button-content yui3-icello-button-labelonly">',
			'<span class="yui3-icello-button-label">{label}</span>',
			'</button>'
		]
	},
    Button = function () {},
    Node = Y.Node,
    Lang = Y.Lang,
	fnDisable = function () {
		this.addClass(css.DISABLED);
		this.set('disabled', true);
	},
	fnEnable = function () {
		this.removeClass(css.DISABLED);
		this.set('disabled', false);
	},
	getNodeButton = function (cfg, template) {
		var html = null,
			node = null,
			iconKey = null;

		if (cfg.icon) {
			iconKey = cfg.icon.toUpperCase();
			if (Y.Object.hasKey(ICONS, iconKey)) {
				cfg.icon = ICONS[iconKey];
			}
		}


		html = Lang.sub(template.join(''), cfg);
		node = Node.create(html);

		node.disable = fnDisable;
		node.enable = fnEnable;

		if (cfg.id) {
			node.set('id', cfg.id);
		}

        if (cfg.title) {
            node.set('title', cfg.title);
        }

		if (cfg.disabled) {
			node.disable();
		}

		return node;
	},
    isVisibleString = function (v) {
        return Lang.isString(v) && v.replace(/ /g, '') !== '';
    };


ICONS = {
    ALERT: getIconCss('alert'),
    ARROWREFRESH_1_E: getIconCss('arrowrefresh-1-e'),
    ARROWREFRESH_1_N: getIconCss('arrowrefresh-1-n'),
    ARROWREFRESH_1_S: getIconCss('arrowrefresh-1-s'),
    ARROWREFRESH_1_W: getIconCss('arrowrefresh-1-w'),
    ARROWRETURNTHICK_1_E: getIconCss('arrowreturnthick-1-e'),
    ARROWRETURNTHICK_1_N: getIconCss('arrowreturnthick-1-n'),
    ARROWRETURNTHICK_1_S: getIconCss('arrowreturnthick-1-s'),
    ARROWRETURNTHICK_1_W: getIconCss('arrowreturnthick-1-w'),
    ARROWRETURN_1_E: getIconCss('arrowreturn-1-e'),
    ARROWRETURN_1_N: getIconCss('arrowreturn-1-n'),
    ARROWRETURN_1_S: getIconCss('arrowreturn-1-s'),
    ARROWRETURN_1_W: getIconCss('arrowreturn-1-w'),
    ARROWSTOP_1_E: getIconCss('arrowstop-1-e'),
    ARROWSTOP_1_N: getIconCss('arrowstop-1-n'),
    ARROWSTOP_1_S: getIconCss('arrowstop-1-s'),
    ARROWSTOP_1_W: getIconCss('arrowstop-1-w'),
    ARROWTHICKSTOP_1_E: getIconCss('arrowthickstop-1-e'),
    ARROWTHICKSTOP_1_N: getIconCss('arrowthickstop-1-n'),
    ARROWTHICKSTOP_1_S: getIconCss('arrowthickstop-1-s'),
    ARROWTHICKSTOP_1_W: getIconCss('arrowthickstop-1-w'),
    ARROWTHICK_1_E: getIconCss('arrowthick-1-e'),
    ARROWTHICK_1_N: getIconCss('arrowthick-1-n'),
    ARROWTHICK_1_NE: getIconCss('arrowthick-1-ne'),
    ARROWTHICK_1_NW: getIconCss('arrowthick-1-nw'),
    ARROWTHICK_1_S: getIconCss('arrowthick-1-s'),
    ARROWTHICK_1_SE: getIconCss('arrowthick-1-se'),
    ARROWTHICK_1_SW: getIconCss('arrowthick-1-sw'),
    ARROWTHICK_1_W: getIconCss('arrowthick-1-w'),
    ARROWTHICK_2_E_W: getIconCss('arrowthick-2-e-w'),
    ARROWTHICK_2_NE_SW: getIconCss('arrowthick-2-ne-sw'),
    ARROWTHICK_2_N_S: getIconCss('arrowthick-2-n-s'),
    ARROWTHICK_2_SE_NW: getIconCss('arrowthick-2-se-nw'),
    ARROW_1_E: getIconCss('arrow-1-e'),
    ARROW_1_N: getIconCss('arrow-1-n'),
    ARROW_1_NE: getIconCss('arrow-1-ne'),
    ARROW_1_NW: getIconCss('arrow-1-nw'),
    ARROW_1_S: getIconCss('arrow-1-s'),
    ARROW_1_SE: getIconCss('arrow-1-se'),
    ARROW_1_SW: getIconCss('arrow-1-sw'),
    ARROW_1_W: getIconCss('arrow-1-w'),
    ARROW_2_E_W: getIconCss('arrow-2-e-w'),
    ARROW_2_NE_SW: getIconCss('arrow-2-ne-sw'),
    ARROW_2_N_S: getIconCss('arrow-2-n-s'),
    ARROW_2_SE_NW: getIconCss('arrow-2-se-nw'),
    ARROW_4: getIconCss('arrow-4'),
    ARROW_4_DIAG: getIconCss('arrow-4-diag'),
    BATTERY_0: getIconCss('battery-0'),
    BATTERY_1: getIconCss('battery-1'),
    BATTERY_2: getIconCss('battery-2'),
    BATTERY_3: getIconCss('battery-3'),
    BOOKMARK: getIconCss('bookmark'),
    BULLET: getIconCss('bullet'),
    CALCULATOR: getIconCss('calculator'),
    CALENDAR: getIconCss('calendar'),
    CANCEL: getIconCss('cancel'),
    CARAT_1_E: getIconCss('carat-1-e'),
    CARAT_1_N: getIconCss('carat-1-n'),
    CARAT_1_NE: getIconCss('carat-1-ne'),
    CARAT_1_NW: getIconCss('carat-1-nw'),
    CARAT_1_S: getIconCss('carat-1-s'),
    CARAT_1_SE: getIconCss('carat-1-se'),
    CARAT_1_SW: getIconCss('carat-1-sw'),
    CARAT_1_W: getIconCss('carat-1-w'),
    CARAT_2_E_W: getIconCss('carat-2-e-w'),
    CARAT_2_N_S: getIconCss('carat-2-n-s'),
    CART: getIconCss('cart'),
    CHECK: getIconCss('check'),
    CIRCLESMALL_CLOSE: getIconCss('circlesmall-close'),
    CIRCLESMALL_MINUS: getIconCss('circlesmall-minus'),
    CIRCLESMALL_PLUS: getIconCss('circlesmall-plus'),
    CIRCLE_ARROW_E: getIconCss('circle-arrow-e'),
    CIRCLE_ARROW_N: getIconCss('circle-arrow-n'),
    CIRCLE_ARROW_S: getIconCss('circle-arrow-s'),
    CIRCLE_ARROW_W: getIconCss('circle-arrow-w'),
    CIRCLE_CHECK: getIconCss('circle-check'),
    CIRCLE_CLOSE: getIconCss('circle-close'),
    CIRCLE_MINUS: getIconCss('circle-minus'),
    CIRCLE_PLUS: getIconCss('circle-plus'),
    CIRCLE_TRIANGLE_E: getIconCss('circle-triangle-e'),
    CIRCLE_TRIANGLE_N: getIconCss('circle-triangle-n'),
    CIRCLE_TRIANGLE_S: getIconCss('circle-triangle-s'),
    CIRCLE_TRIANGLE_W: getIconCss('circle-triangle-w'),
    CIRCLE_ZOOMIN: getIconCss('circle-zoomin'),
    CIRCLE_ZOOMOUT: getIconCss('circle-zoomout'),
    CLIPBOARD: getIconCss('clipboard'),
    CLOCK: getIconCss('clock'),
    CLOSE: getIconCss('close'),
    CLOSETHICK: getIconCss('closethick'),
    COMMENT: getIconCss('comment'),
    CONTACT: getIconCss('contact'),
    COPY: getIconCss('copy'),
    DISK: getIconCss('disk'),
    DOCUMENT: getIconCss('document'),
    DOCUMENT_B: getIconCss('document-b'),
    EJECT: getIconCss('eject'),
    EXTLINK: getIconCss('extlink'),
    FLAG: getIconCss('flag'),
    FOLDER_COLLAPSED: getIconCss('folder-collapsed'),
    FOLDER_OPEN: getIconCss('folder-open'),
    GEAR: getIconCss('gear'),
    GRIPSMALL_DIAGONAL_SE: getIconCss('gripsmall-diagonal-se'),
    GRIP_DIAGONAL_SE: getIconCss('grip-diagonal-se'),
    GRIP_DOTTED_HORIZONTAL: getIconCss('grip-dotted-horizontal'),
    GRIP_DOTTED_VERTICAL: getIconCss('grip-dotted-vertical'),
    GRIP_SOLID_HORIZONTAL: getIconCss('grip-solid-horizontal'),
    GRIP_SOLID_VERTICAL: getIconCss('grip-solid-vertical'),
    HEART: getIconCss('heart'),
    HELP: getIconCss('help'),
    HOME: getIconCss('home'),
    IMAGE: getIconCss('image'),
    INFO: getIconCss('info'),
    KEY: getIconCss('key'),
    LIGHTBULB: getIconCss('lightbulb'),
    LINK: getIconCss('link'),
    LOCKED: getIconCss('locked'),
    MAIL_CLOSED: getIconCss('mail-closed'),
    MAIL_OPEN: getIconCss('mail-open'),
    MINUS: getIconCss('minus'),
    MINUSTHICK: getIconCss('minusthick'),
    NEWWIN: getIconCss('newwin'),
    NOTE: getIconCss('note'),
    NOTICE: getIconCss('notice'),
    PAUSE: getIconCss('pause'),
    PENCIL: getIconCss('pencil'),
    PERSON: getIconCss('person'),
    PIN_S: getIconCss('pin-s'),
    PIN_W: getIconCss('pin-w'),
    PLAY: getIconCss('play'),
    PLUS: getIconCss('plus'),
    PLUSTHICK: getIconCss('plusthick'),
    POWER: getIconCss('power'),
    PRINT: getIconCss('print'),
    RADIO_OFF: getIconCss('radio-off'),
    RADIO_ON: getIconCss('radio-on'),
    REFRESH: getIconCss('refresh'),
    SCISSORS: getIconCss('scissors'),
    SCRIPT: getIconCss('script'),
    SEARCH: getIconCss('search'),
    SEEK_END: getIconCss('seek-end'),
    SEEK_FIRST: getIconCss('seek-first'),
    SEEK_NEXT: getIconCss('seek-next'),
    SEEK_PREV: getIconCss('seek-prev'),
    SEEK_START: getIconCss('seek-start'),
    SHUFFLE: getIconCss('shuffle'),
    SIGNAL: getIconCss('signal'),
    SIGNAL_DIAG: getIconCss('signal-diag'),
    SQUARESMALL_CLOSE: getIconCss('squaresmall-close'),
    SQUARESMALL_MINUS: getIconCss('squaresmall-minus'),
    SQUARESMALL_PLUS: getIconCss('squaresmall-plus'),
    STAR: getIconCss('star'),
    STOP: getIconCss('stop'),
    SUITCASE: getIconCss('suitcase'),
    TAG: getIconCss('tag'),
    TRANSFERTHICK_E_W: getIconCss('transferthick-e-w'),
    TRANSFER_E_W: getIconCss('transfer-e-w'),
    TRASH: getIconCss('trash'),
    TRIANGLE_1_E: getIconCss('triangle-1-e'),
    TRIANGLE_1_N: getIconCss('triangle-1-n'),
    TRIANGLE_1_NE: getIconCss('triangle-1-ne'),
    TRIANGLE_1_NW: getIconCss('triangle-1-nw'),
    TRIANGLE_1_S: getIconCss('triangle-1-s'),
    TRIANGLE_1_SE: getIconCss('triangle-1-se'),
    TRIANGLE_1_SW: getIconCss('triangle-1-sw'),
    TRIANGLE_1_W: getIconCss('triangle-1-w'),
    TRIANGLE_2_E_W: getIconCss('triangle-2-e-w'),
    TRIANGLE_2_N_S: getIconCss('triangle-2-n-s'),
    UNLOCKED: getIconCss('unlocked'),
    VIDEO: getIconCss('video'),
    VOLUME_OFF: getIconCss('volume-off'),
    VOLUME_ON: getIconCss('volume-on'),
    WRENCH: getIconCss('wrench'),
    ZOOMIN: getIconCss('zoomin'),
    ZOOMOUT: getIconCss('zoomout')
};


Y.namespace('Icello');

Button.ICONS = ICONS;

Button.getNode = function (cfg) {
    Y.log('', 'info', 'Button getNode');
    var n = null;

    cfg = Y.merge(cfg);
    
    if (cfg.label && !isVisibleString(cfg.label)) {
        cfg.label = null;
    }

    if (cfg.icon && cfg.label) {
        n = getNodeButton(cfg, templates.ICON_WITH_LABEL);
    } else if (cfg.icon && !cfg.label) {
        n = getNodeButton(cfg, templates.ICON_ONLY);
    } else if (!cfg.icon && cfg.label) {
        n = getNodeButton(cfg, templates.LABEL_ONLY);
    } else {
        throw {
            name: 'IconAndLabelNotDefinedButtonException',
            message: "Icello Button getNode: either 'icon' or button's content/label must be defined"
        };
    }

    return n;
};
Button.renderNode = function (srcNode) {
    Y.log('', 'info', 'Button renderNode');
    var node = srcNode,
        cfg = null,
        content = null,
        newNode = null,
        getConfig = function (node) {
            var cfg = {};

            if (node.hasAttribute('id')) {
                cfg.id = node.get('id');
            }

            if (node.hasAttribute('data-icon')) {
                cfg.icon = node.getAttribute('data-icon');
            }

            cfg.disabled = node.get('disabled');

            if (node.hasAttribute('title')) {
                cfg.title = node.get('title');
            }

            content = node.getContent();

            if (isVisibleString(content)) {
                cfg.label = content;
            }

            return cfg;
        };

    if (Y.Lang.isString(srcNode)) {
        node = Y.one(srcNode);
    }

    cfg = getConfig(node);

    newNode = Button.getNode(cfg);

    node.replace(newNode);
    return newNode;
};

/** 
* a button Node generator with set of icons to choose from
*/
Y.Icello.Button = Button;


}, 'gallery-2012.05.16-20-37' ,{skinnable:true, requires:['classnamemanager', 'node']});
