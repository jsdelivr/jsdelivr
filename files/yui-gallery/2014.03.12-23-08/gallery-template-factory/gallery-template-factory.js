YUI.add('gallery-template-factory', function (Y, NAME) {

/**
 * Utility to retrieve html templates based on a template id
 *
 * @class TemplateRequestor
 * @extends Base
 * @module gallery-template-factory
 * @constructor
 * @param configuration {Object} Is the configuration object
 */
Y.TemplateRequestor = Y.Base.create('template-requestor', Y.Base, [], {

    initializer: function () {},

    /**
     * Retrieves the template by id
     *
     * @method getTemplate
     * @param String template id is the template filename without the file extension,
     *             e.g : file -> profile-info.html, id -> profile-info
     * @return String
     */
    getTemplate: function (templateId) {
        if (Y.TemplateFactory.TEMPLATES[templateId]) {
            return Y.TemplateFactory.TEMPLATES[templateId];
        }
        return this.requestTemplate(templateId);
    },

    /**
     * Requests the template directly via io like a normal ajax request without verifying if it was already used and stored
     *
     * @method requestTemplate
     * @param String template id is the template filename without the file extension,
     *             e.g : file -> profile-info.html, id -> profile-info
     * @return String
     */
    requestTemplate: function (templateId) {
        var response = Y.io(this._getTemplatePath(templateId), {
            sync: true
        });
        Y.TemplateFactory.TEMPLATES[templateId] = response.responseText;
        return Y.TemplateFactory.TEMPLATES[templateId];
    },

    _getTemplatePath: function (templateId) {
        return this.get('path') + templateId + this.get('suffix');
    },

    destructor: function () {

    }
}, {
    ATTRS: {
        /**
         * Indicates where the templates are stored
         *
         * @attribute path
         * @type String
         */
        path: {
            value: ''
        },

        /**
         * Templates file suffix or extension
         *
         * @attribute suffix
         * @default '.html'
         * @type String
         */
        suffix: {
            value: '.html'
        }
    }
});

/**
 * Factory util to retrieve the template requestor object
 *
 * @class TemplateFactory
 * @static
 * @module gallery-template-factory
 */
Y.TemplateFactory = {

    /**
     * Instantiates template requestor
     *
     * @method getRequestor
     * @param {Object} Configuration
     * @return {TemplateRequestor} Template requestor
     */
    getRequestor: function (configuration) {
        return new Y.TemplateRequestor(configuration);
    }
};

/**
 * Namespace to store in an associative array the templates already loaded to avoid
 * multiple http calls to the same template
 *
 * @type Object
 */
Y.namespace('TemplateFactory.TEMPLATES');

}, 'gallery-2013.06.20-02-07', {"requires": ["yui-base", "base-build", "io-base"]});
