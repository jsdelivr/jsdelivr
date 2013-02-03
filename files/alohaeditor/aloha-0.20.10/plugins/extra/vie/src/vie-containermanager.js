if (typeof VIE === 'undefined') {
    VIE = {};
}

VIE.ContainerManager = {
    models: {},
    views: {},
    instances: [],
    instanceSingletons: {},

    findContainerProperties: function(element, allowPropertiesInProperties) {
        if (!element.attr('typeof')) {
            element = element.children('[typeof][about]');
        }
        return jQuery(element).find('[property]').add(jQuery(element).filter('[property]')).filter(function() {
            var closestRDFaEntity = jQuery(this).closest('[typeof][about]');
            if (   closestRDFaEntity.index(element) !== 0
                && closestRDFaEntity.length !== 0) {
                // The property is under another entity, skip
                console.log("Wrong entity", element, closestRDFaEntity, this);
                return false;
            }

            if (!allowPropertiesInProperties) {
                if (!jQuery(this).parents('[property]').length) {
                    return true;
                }
                // This property is under another property, skip
                return false;
            }

            return true;
        });
    },

    /**
     * @private
     */
    _getContainerProperties: function(element, emptyValues) {
        var containerProperties = {};

        VIE.ContainerManager.findContainerProperties(element, true).each(function() {
        	var propertyName;
            var objectProperty = jQuery(this);
            propertyName = objectProperty.attr('property');

            if (typeof containerProperties[propertyName] !== 'undefined') {
                if (containerProperties[propertyName] instanceof Array) {
                    if (emptyValues) {
                        return;
                    }
                    containerProperties[propertyName].push(objectProperty.html());
                    return;
                }
                // Multivalued property, convert to Array
                var previousValue = containerProperties[propertyName];
                containerProperties[propertyName] = [];

                if (emptyValues) {
                    return;
                }

                containerProperties[propertyName].push(previousValue);
                containerProperties[propertyName].push(objectProperty.html());
                return;
            }

            if (emptyValues) {
                containerProperties[propertyName] = '';
                return;
            }

            containerProperties[propertyName] = objectProperty.html();
        });

        return containerProperties;
    },

    /**
     * @private
     */
    _getContainerValue: function(element, propertyName) {
        element = jQuery(element);

        if (typeof element.attr(propertyName) !== 'undefined')
        {
            // Direct match with container
            return element.attr(propertyName);
        }
        return element.find('[' + propertyName + ']').attr(propertyName);
    },

    getContainerIdentifier: function(element) {
        return VIE.ContainerManager._getContainerValue(element, 'about');
    },

    cloneContainer: function(element) {
        element = jQuery(element).clone(false);

        if (typeof element.attr('about') !== 'undefined')
        {
            // Direct match with container
            element.attr('about', '');
        }
        element.find('[about]').attr('about', '');
        VIE.ContainerManager.findContainerProperties(element, false).html('');

        return element;
    },

    getViewForContainer: function(element) {
        element = jQuery(element);
        var type = VIE.ContainerManager._getContainerValue(element, 'typeof');

        if (typeof VIE.ContainerManager.views[type] !== 'undefined') {
            // We already have a view for this type
            return VIE.ContainerManager.views[type];
        }

        var viewProperties = {};
        viewProperties.initialize = function() {
            _.bindAll(this, 'render');
            this.model.bind('change', this.render);
        };
        viewProperties.tagName = element.get(0).nodeName;
        viewProperties.make = function(tagName, attributes, content) { 
            return VIE.ContainerManager.cloneContainer(element);
        };
        viewProperties.render = function() {
            var model = this.model;
            VIE.ContainerManager.findContainerProperties(this.el, true).each(function() {
                var propertyElement = jQuery(this);
                var propertyName = propertyElement.attr('property');

                if (model.get(propertyName) instanceof Array) {
                    // For now we don't deal with multivalued properties in Views
                    return true;
                }

                if (propertyElement.html() !== model.get(propertyName)) {
                    propertyElement.html(model.get(propertyName));
                }
            });
            return this;
        };

        VIE.ContainerManager.findAdditionalViewProperties(element, viewProperties);

        VIE.ContainerManager.views[type] = Backbone.View.extend(viewProperties);

        return VIE.ContainerManager.views[type];
    },

    getModelForContainer: function(element) {
        var type = VIE.ContainerManager._getContainerValue(element, 'typeof');
        

        if (typeof VIE.ContainerManager.models[type] !== 'undefined') {
            // We already have a model for this type
            return VIE.ContainerManager.models[type];
        }

        // Parse the relevant properties from DOM
        var modelPropertiesFromRdf = VIE.ContainerManager._getContainerProperties(element, true);
        var modelProperties = jQuery.extend({}, modelPropertiesFromRdf);

        modelProperties.getType = function() {
            return type;
        }

        modelProperties.toJSONLD = function() {
            var instance = this;
            var instanceLD = {"@":"<" + instance.id + ">"};

            // This can have only one type here, in rdf more types can be allowed
            instanceLD.a = instance.getType();
            for (var property in instance.attributes) if(instance.attributes.hasOwnProperty(property)) { //  && typeof instance.attributes[property] != "function"
                if (["id"].indexOf(property) == -1)
                    instanceLD[property] = instance.attributes[property];
            }
            return instanceLD;
        }

        modelProperties.getInstanceForJSONLD = function(){}

        VIE.ContainerManager.findAdditionalModelProperties(element, modelProperties);

        VIE.ContainerManager.models[type] = Backbone.Model.extend(modelProperties);

        return VIE.ContainerManager.models[type];
    },

    /**
     * Override this to seek additional information from the element to include to the view
     */
    findAdditionalViewProperties: function(element, properties) {
    },

    /**
     * Override this to seek additional properties from the element to include to the model
     */
    findAdditionalModelProperties: function(element, properties) {
    },

    /**
     * Override this to seek additional properties from the element to include to the instance
     */
    findAdditionalInstanceProperties: function(element, modelInstance) {
    },

    registerInstance: function(modelInstance, element) {
        if (modelInstance.views === undefined) {
            modelInstance.views = [];
        }

        var viewExists = false;
        jQuery.each(modelInstance.views, function() {
            // Check whether we already have this view instantiated for the element
            if (this.el.get(0) == element.get(0)) {
                viewExists = true;
                return false;
            }
        });
        if (!viewExists) {
            var view = VIE.ContainerManager.getViewForContainer(element);
            modelInstance.views.push(new view({model: modelInstance, el: element}));
        }

        VIE.ContainerManager.findAdditionalInstanceProperties(element, modelInstance);

        if (modelInstance.id) {
            VIE.ContainerManager.instanceSingletons[modelInstance.id] = modelInstance;
        }

        if (jQuery.inArray(modelInstance, VIE.ContainerManager.instances) === -1) {
            VIE.ContainerManager.instances.push(modelInstance);
        }

        return modelInstance;
    },

    getInstanceForContainer: function(element) {
        var model = VIE.ContainerManager.getModelForContainer(element);
        var properties = VIE.ContainerManager._getContainerProperties(element, false);
        properties.id = VIE.ContainerManager._getContainerValue(element, 'about');

        if (   !properties.id
            || VIE.ContainerManager.instanceSingletons[properties.id] === undefined) {
            var modelInstance = new model(properties);
        }
        else 
        {
            var modelInstance = VIE.ContainerManager.instanceSingletons[properties.id];
            modelInstance.set(properties);
        }

        return VIE.ContainerManager.registerInstance(modelInstance, element);
    },

    cleanup: function() {
        VIE.ContainerManager.instances = [];
    }
};
