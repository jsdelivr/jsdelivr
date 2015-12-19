(function($, undefined) {
/*
    TrafficCop
    Author: Jim Cowart
    License: Dual licensed MIT (http://www.opensource.org/licenses/mit-license) & GPL (http://www.opensource.org/licenses/gpl-license)
    Version 0.3.0
*/

var inProgress = {};

$.trafficCop = function(url, options) {
    var reqOptions = url, key;
    if(arguments.length === 2) {
        reqOptions = $.extend(true, options, { url: url });
    }
    key = JSON.stringify(reqOptions);
    if (key in inProgress) {
        for (var i in {success: 1, error: 1, complete: 1}) {
            inProgress[key][i](reqOptions[i]);
        }
    } else {
        inProgress[key] = $.ajax(reqOptions).always(function () { delete inProgress[key]; });
    }
    return inProgress[key];
};


if (typeof define === "function" && define.amd) {
	define(function() {
		return $.trafficCop;  //superfluous, since it's already on the jQuery object
	});
}
})(jQuery);
/*
    infuser.js
    Author: Jim Cowart
    License: Dual licensed MIT (http://www.opensource.org/licenses/mit-license) & GPL (http://www.opensource.org/licenses/gpl-license)
    Version 0.2.0
*/
var hashStorage = {
    templates: {},

    storeTemplate: function(templateId, templateContent) {
        this.templates[templateId] = templateContent;
    },

    getTemplate: function(templateId) {
        return this.templates[templateId];
    },

    purge: function() {
        this.templates = {};
    }
};
var scriptStorage = {
    templateIds: [],
    storeTemplate: function(templateId, templateContent) {
        var node = document.getElementById(templateId);
        if(node === null) {
            this.templateIds.push(templateId);
            node = document.createElement("script");
            node.type = "text/html";
            node.id = templateId;
            document.body.appendChild(node);
        }
        node.text = templateContent;
    },

    getTemplate: function(templateId) {
        return document.getElementById(templateId);
    },

    purge: function() {
        for(var i = 0; i < this.templateIds.length; i++) {
            document.body.removeChild(document.getElementById(this.templateIds[i]));
        }
        this.templateIds = [];
    }
};
var errorHtml = "<div class='infuser-error'>The template <a href='{TEMPLATEURL}'>{TEMPLATEID}</a> could not be loaded. {STATUS}</div>",
    returnErrorTemplate = function(status, templateId, templatePath) {
        return errorHtml.replace('{STATUS}', status).replace('{TEMPLATEID}', templateId).replace('{TEMPLATEURL}', templatePath);
    },
    errors = [];
var helpers = {
    getTemplatePath: function(templateOptions) {
        var templateFile = templateOptions.templatePrefix + templateOptions.templateId + templateOptions.templateSuffix;
        return templateOptions.templateUrl === undefined || templateOptions.templateUrl === "" ?
                templateFile : templateOptions.templateUrl + "/" + templateFile;
    },
    templateGetSuccess: function(templateId, callback) {
        return function(response) {
	        var _response = infuser.defaults.templatePreProcessor(response);
            infuser.store.storeTemplate(templateId, _response);
            callback(infuser.store.getTemplate(templateId));
        };
    },
    templateGetError: function(templateId, templatePath, callback) {
        return function(exception) {
            if($.inArray(templateId, errors) === -1) {
                errors.push(templateId);
            }
            var templateHtml = returnErrorTemplate("HTTP Status code: " + exception.status, templateId, templatePath);
            infuser.store.storeTemplate(templateId, templateHtml);
            callback(infuser.store.getTemplate(templateId));
        };
    },
    getAjaxOptions: function(templateOptions) {

    }
},
infuserOptions = ['target','loadingTemplate','postRender','preRender','render','bindingInstruction','useLoadingTemplate','model','templateUrl','templateSuffix','templatePrefix',''];
var infuser = {
    storageOptions: {
        hash: hashStorage,
        script: scriptStorage
    },

    store: hashStorage,

    defaults: {
        // Template name conventions
        templateUrl: "",
        templateSuffix: ".html",
        templatePrefix: "",
	    templatePreProcessor: function(x) { return x },
        // AJAX Options
        ajax: {
            "async": true,
            "dataType": "html",
            "type": "GET"
        },
        // infuse() specific options - NOT used for "get" or "getSync"
        target:  function(templateId) { return "#" + templateId }, // DEFAULT MAPPING
        loadingTemplate:    {
                                content:        '<div class="infuser-loading">Loading...</div>',
                                transitionIn:   function(target, content) {
                                                    var tgt = $(target);
                                                    tgt.hide();
                                                    tgt.html(content);
                                                    tgt.fadeIn();
                                                },
                                transitionOut:  function(target) {
                                                    $(target).html("");
                                                }
                            },
        postRender:         function(targetElement) { }, // NO_OP effectively by default
        preRender:          function(targetElement, template) { }, // NO_OP effectively by default
        render:             function(target, template) {
                                var tgt = $(target);
                                if(tgt.children().length === 0) {
                                    tgt.append($(template));
                                }
                                else {
                                    tgt.children().replaceWith($(template));
                                }
                            },
        bindingInstruction:  function(template, model) { return template; }, // NO_OP effectively by default
        useLoadingTemplate: true // true/false
    },

    get: function(options, callback) {
        var templateOptions = $.extend({}, infuser.defaults, (typeof options === "object" ? options : { templateId: options })),
            template;
        templateOptions.ajax.url = helpers.getTemplatePath(templateOptions);
        template = infuser.store.getTemplate(templateOptions.ajax.url);
        if(!template || $.inArray(templateOptions.ajax.url, errors) !== -1) {
            templateOptions.ajax.success = helpers.templateGetSuccess(templateOptions.ajax.url, callback);
            templateOptions.ajax.error = helpers.templateGetError(templateOptions.templateId, templateOptions.ajax.url, callback);
            $.trafficCop(templateOptions.ajax);
        }
        else {
            callback(template);
        }
    },

    getSync: function(options) {
        var templateOptions = $.extend({}, infuser.defaults, (typeof options === "object" ? options : { templateId: options }), { ajax: { async: false } }),
            template,
            templateHtml;
        templateOptions.ajax.url = helpers.getTemplatePath(templateOptions);
        template = infuser.store.getTemplate(templateOptions.ajax.url);
        if(!template || $.inArray(templateOptions.ajax.url, errors) !== -1) {
            templateHtml = null;
            templateOptions.ajax.success = function(response) { templateHtml = response; };
            templateOptions.ajax.error = function(exception) {
                if($.inArray(templateOptions.ajax.url) === -1) {
                    errors.push(templateOptions.ajax.url);
                }
                templateHtml = returnErrorTemplate("HTTP Status code: exception.status", templateOptions.templateId, templateOptions.ajax.url);
            };
            $.ajax(templateOptions.ajax);
            if(templateHtml === null) {
                templateHtml = returnErrorTemplate("An unknown error occurred.", templateOptions.templateId, templateOptions.ajax.url);
            }
            else {
                infuser.store.storeTemplate(templateOptions.ajax.url, templateHtml);
                template = infuser.store.getTemplate(templateOptions.ajax.url);
            }
        }
        return template;
    },

    infuse: function(templateId, renderOptions) {
        var templateOptions = $.extend({}, infuser.defaults, (typeof templateId === "object" ? templateId : renderOptions), (typeof templateId === "string" ? { templateId: templateId } : undefined )),
            targetElement = typeof templateOptions.target === 'function' ? templateOptions.target(templateId) : templateOptions.target;
        if(templateOptions.useLoadingTemplate) {
            templateOptions.loadingTemplate.transitionIn(targetElement, templateOptions.loadingTemplate.content);
        }
        infuser.get(templateOptions, function(template) {
            var _template = template;
            templateOptions.preRender(targetElement, _template);
            _template = templateOptions.bindingInstruction(_template, templateOptions.model);
            if(templateOptions.useLoadingTemplate) {
                templateOptions.loadingTemplate.transitionOut(targetElement);
            }
            templateOptions.render(targetElement, _template);
            templateOptions.postRender(targetElement);
        });
    }
};

if (typeof define === "function" && define.amd) {
	define(["jquery"], function( $ ) {
		return infuser;
	});
}