if (typeof VIE === 'undefined') {
    VIE = {};
}

VIE.CollectionManager = {
    collections: [],

    loadCollections: function() {
        jQuery('[typeof="http://purl.org/dc/dcmitype/Collection"]').each(function() {
            VIE.CollectionManager.getCollectionForContainer(this);
        });
        return VIE.CollectionManager.collections;
    },

    getCollectionForContainer: function(element) {
        element = jQuery(element);

        var firstChild = element.children(':first-child');
        if (firstChild === undefined) {
            return null;
        }

        var preparedNewElement = VIE.ContainerManager.cloneContainer(firstChild);

        var Collection = Backbone.Collection.extend({
            model: VIE.ContainerManager.getModelForContainer(preparedNewElement)
        });

        var collectionInstance = new Collection({});

        collectionInstance.view = VIE.CollectionManager._getViewForCollection(preparedNewElement, element, collectionInstance);

        VIE.CollectionManager.collections.push(collectionInstance);

        return collectionInstance;
    },

    /**
     * @private
     */
    _getViewForCollection: function(element, collectionElement, collectionInstance) {
        var collectionView = Backbone.View.extend({
            collection: collectionInstance,
            el: collectionElement,

            initialize: function() {
                _.bindAll(this, 'addItem', 'removeItem');
                this.collection.bind('add', this.addItem);
                this.collection.bind('remove', this.removeItem);
            },

            addItem: function(itemInstance) {
                itemInstance = VIE.ContainerManager.registerInstance(itemInstance, VIE.ContainerManager.cloneContainer(element));
                var itemViewElement = itemInstance.views[0].render().el;
                this.el.append(itemViewElement);
                itemViewElement.show();
            },

            removeItem: function(itemInstance) {
                if (typeof itemInstance.view === 'undefined') {
                    return;
                }
                itemInstance.view.el.hide();
            }
        });

        return new collectionView({});
    }
};

