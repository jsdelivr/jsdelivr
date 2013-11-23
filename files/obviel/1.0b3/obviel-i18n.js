/*global Gettext:false, console:false */

// Obviel i18n support.
// uses jsgettext. some of the logic is more hairy than it should
// be as jsgettext for some reason decided to globally share all state
// between Gettext objects...

if (typeof obviel === "undefined") {
    var obviel = {};
}

obviel.i18n = {};

(function($, module) {
    module.I18nError = function(message) {
        this.name = 'I18nError';
        this.message = message;
    };

    module.I18nError.prototype = new Error();
    module.I18nError.prototype.constructor = module.I18nError;
    
    module.I18nError.prototype.toString = function() {
        return 'I18nError: ' + this.message;
    };
    
    var domains = {};
    
    module.translationSource = function(data) {
        return function() {
            var defer = $.Deferred(),
                massagedData = {},
                msgid;
            
            for (msgid in data) {
                var value = data[msgid];
                if ($.type(value) === 'string') {
                    massagedData[msgid] = [null, data[msgid]];
                } else {
                    massagedData[msgid] = value;
                }
            }
            defer.resolve(massagedData);
            return defer.promise();
        };
    };
    
    module.translationSourceFromJsonUrl = function(url) {
        return function() {
            return $.ajax({
                type: 'GET',
                url: url,
                dataType: 'json'
            });
        };
    };
    
    var makeEmptyTranslation = function() {
        return {'': {}};
    };

    // a translation source that doesn't translate
    // this is needed because just passing in {} as the translations
    // will trip of jsgettext in thinking the domain cannot be found
    module.emptyTranslationSource = function() {
        return function() {
            var defer = $.Deferred();
            // make up a message id that will never occur in real life
            defer.resolve(makeEmptyTranslation());
            return defer.promise();
        };
    };

    // XXX can this be called to override translations for a particular domain?
    module.registerTranslation = function(locale, translationSource, domain) {
        if (domain === undefined) {
            domain = 'default';
        }
        var translations = domains[domain];
        if (translations === undefined) {
            translations = {};
            domains[domain] = translations;
        }
        translations[locale] = translationSource;
    };

    
    module.clearTranslations = function() {
        domains = {};
    };

    var currentGt = new Gettext();
    var currentLocale = null;
    var templateDomain = 'default';
    
    module.clearLocale = function() {
        // XXX goes into the insides of jsgettext...
        Gettext._locale_data = undefined;
        currentLocale = null;
        templateDomain = 'default';
    };

    // needs to be separate function to make closure over domain work
    var loadDomain = function(source, localeData, domain) {
        return source().done(function(translationData) {
            localeData[domain] = translationData;
        });
    };
    
    module.setLocale = function(locale) {
        var defer;
        // bail out early if we have to do nothing
        if (locale === currentLocale) {
            defer = $.Deferred();
            defer.resolve();
            return defer.promise();
        }
        currentLocale = locale;
        
        var localeData = {},
            promises = [],
            d;
        
        for (d in domains) {
            var translations = domains[d];
            var translationSource = translations[locale];
            if (translationSource === undefined) {
                throw new module.I18nError("Unknown locale: " + locale);
            }
            promises.push(loadDomain(translationSource, localeData, d));
        }
        // set up default domain if it's not set up otherwise
        // this is to avoid the situation where Gettext cannot find
        // the domain and therefore will look in all domains
        if (domains['default'] === undefined) {
            localeData['default'] = makeEmptyTranslation();
        }
        return $.when.apply(null, promises).done(function() {
            // XXX really convince Gettext to forget about previous data
            Gettext._locale_data = undefined;
            currentGt = new Gettext({domain: 'default',
                                     locale_data: localeData});
        });
    };

    module.getLocale = function() {
        return currentLocale;
    };
    
    module.getTranslation = function(msgid, domain) {
        return currentGt.dgettext(domain, msgid);
    };

    module.getTemplateDomain = function() {
        return templateDomain;
    };

    module.getTranslationFunc = function(domain) {
        if (domain === undefined) {
            domain = 'default';
        }
        return function(msgid) {
            return module.getTranslation(msgid, domain);
        };
    };
    
    module.translate = function(domain) {
        if (domain === undefined) {
           domain = 'default';
        }
        templateDomain = domain;
        return module.getTranslationFunc(domain);
    };
    
    module.getPluralTranslationFunc = function(domain) {
        if (domain === undefined) {
            domain = 'default';
        }
        return function(msgid, msgidPlural, count) {
            return currentGt.dngettext(domain, msgid, msgidPlural, count);
        };
    };
    
    module.pluralize = function(domain) {
        if (domain === undefined) {
            domain = 'default';
        }
        return module.getPluralTranslationFunc(domain);
    };
    
    // this won't work for urls ending in /, but luckily we
    // shouldn't get those because we refer to a .i18n file with baseUrl
    var joinRelativeUrl = function(baseUrl, relUrl) {
        var i  = baseUrl.lastIndexOf('/');
        if (i === -1) {
            // this url is relative itself without any slashes
            return relUrl;
        }
        baseUrl = baseUrl.slice(0, i);
        return baseUrl + '/' + relUrl;
    };
    
    module.loadI18nFromUrl = function(url) {
        return $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json'
        }).done(function(domains) {
            var sourceUrl, source;
            for (var domain in domains) {
                var entries = domains[domain];
                for (var i in entries) {
                    var entry = entries[i];
                    if (entry.url === null || entry.url === undefined) {
                        source = module.emptyTranslationSource();
                    } else {
                        sourceUrl = joinRelativeUrl(url, entry.url);
                        source = module.translationSourceFromJsonUrl(
                            sourceUrl);
                    }
                    module.registerTranslation(entry.locale, source, domain);
                }
            }
        }).fail(function(jqXHR, textStatus) {
            console.log("Request failed: " + textStatus);
        });
    };
    
    module.load = function() {
        var promises = [];
        $('head link[rel="i18n"]').each(function() {
            var url = $(this).attr('href');
            promises.push(module.loadI18nFromUrl(url));
        });
        return $.when.apply(null, promises);
    };
    
    // alias
    if (typeof obviel.template !== 'undefined') {
        module.variables = obviel.template.variables;
    }

}(jQuery, obviel.i18n));
