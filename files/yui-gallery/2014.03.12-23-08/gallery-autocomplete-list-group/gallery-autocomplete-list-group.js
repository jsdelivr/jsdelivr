YUI.add('gallery-autocomplete-list-group', function(Y) {

var ACTIVE_ITEM = 'activeItem',
    GROUP_ITEMS = 'groupItems';


function acListGroup() {}

Y.mix(acListGroup.prototype, {

    GROUP_TEMPLATE: '<ul/>',
    DIVIDER_TEMPLATE: '<div/>',

    initializer: function() {

        // If this instance is to be grouped
        if (this.get('group') === true) {
            this._add = this._groupAdd;
            this._activateNextItem = this._activateNextGroupItem;
            this._activatePrevItem = this._activatePrevGroupItem;
        }

    },

    /*
     * Creates the list of items to be added to the dom
     */
    _groupAdd: function (items) {
        var itemNodes = {},
            groups = this.get('groupOrder');

        Y.Array.each(groups, function(group) {
            itemNodes[group] = [];
        });

        var groupItems = [];

        Y.Array.each(Y.Lang.isArray(items) ? items : [items], function (item) {
            var groupItem = this._createItemNode(item).setData('result', item);
            groupItems.push(groupItem);
            itemNodes[item.raw.source].push(groupItem);
        }, this);

        this.set(GROUP_ITEMS, groupItems);

        Y.Array.each(groups, function(group) {
            itemNodes[group] = Y.all(itemNodes[group]);
            var groupNode = Y.Node.create(this.GROUP_TEMPLATE);
            groupNode.insert(itemNodes[group]);
            this._listNode.append(groupNode);
            this._listNode.append(Y.Node.create(this.DIVIDER_TEMPLATE));
        }, this);
    },

    _activateNextGroupItem: function () {
        var item = this.get(ACTIVE_ITEM),
            groupItems = this.get(GROUP_ITEMS),
            nextItem;

        if (item) {
            Y.Array.some(groupItems, function(groupItem, index) {
                if (item === groupItem) {
                    nextItem = groupItems[index + 1];
                    return true;
                }
            });
        } else {
            nextItem = this._getFirstItemNode();
        }
 
        this.set(ACTIVE_ITEM, nextItem);
 
        return this;
    },

    _activatePrevGroupItem: function () {
        var item     = this.get(ACTIVE_ITEM),
            groupItems = this.get(GROUP_ITEMS);         

        Y.Array.some(groupItems, function(groupItem, index) {
            if (item === groupItem) {
                var index = index-1;
                if (index < 0) {
                    index = groupItems.length-1;
                }
                prevItem = groupItems[index];
                return true;
            }
        }); 

        this.set(ACTIVE_ITEM, prevItem || null);
 
        return this;
    },

});

acListGroup.ATTRS = {

    /*
     * Array of the Y.Node result items
     *
     * @attribute groupItems
     * @default []
     * @type array
     */
    groupItems: {
        value: []
    },

    /* 
     * Toggle to display results in groups
     *
     * @attribute group
     * @default false
     * @type bool
     */
    group: {
        value: false
    },

    /*
     * The string to filter the results by
     *
     * @attribute groupFilter
     * @default ""
     * @type string
     */
    groupFilter: {
        value: ''
    },

    /*
     * The order in which you want the groups 
     * displayed in the result list.
     *
     * example:
     * ['code', 'description']
     *
     * @attribute groupOrder
     * @default []
     * @type array
     */
    groupOrder: {
        value: []
    },

}

Y.AutoComplete.ListGroup = acListGroup;

Y.Base.mix(Y.AutoComplete, [acListGroup]);


}, 'gallery-2012.08.01-13-16' ,{requires:['autocomplete-list'], skinnable:false});
