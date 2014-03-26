YUI.add('gallery-sortable-array', function(Y) {

function SortableArray () {
	SortableArray.superclass.constructor.apply(this, arguments);
}

var $A = Y.Array;
// constants
	var DATA_KEY = 'sortable-array-data',
		  EVT_ARRAY_CHANGE = 'arraychange',
		  DATA_ARRAY = 'dataArray';
		
SortableArray.NAME = "SortableArray";
SortableArray.NS = "sortableArray";


SortableArray.ATTRS = {
	dataArray: {
	  validator: "_arrayValidator",
		value: []
	},
	// If array elements are object, this defines which element is shown in the list
	observable: {
		value: null
	}
};

Y.SortableArray = Y.extend(SortableArray, Y.Plugin.Base, {
  
	initializer: function (config) {
		this.host = this.get('host');
		this.nodes = this.host.get('nodes');
		this.link();
		this.afterHostMethod('sync', this.sync);
			var arr = [],
			    dataArray = this.get(DATA_ARRAY),
			    _slice = arr.slice,
			  that = this,
			  methods = ['pop', 'push', 'splice'];

		$A.each(methods, function (fn) {
		  dataArray[fn] = function () {
		    var ret = arr[fn].apply(this, _slice.call(arguments));
		    that.link();
		    that.host.fire("arraychange", {dataArray: dataArray});
		    return ret;
		  };
		});

		// restore shadowed methods
		dataArray.restore = function () {
		  $A.each(methods, function (fn) {
		    delete dataArray[fn];
		  });
		  delete dataArray['restore'];
		}
	},
	
	link: function () {
		var dataArray = this.get(DATA_ARRAY),
			  container = Y.one(this.host.get('container')),
			  nodes = this.nodes,
			  observable = this.get('observable');
		
		// empty out the list from all nodes
		container.all(nodes).remove();
		// run through that array data-source and populate UI
		$A.each(dataArray, function (elem, i) {
			var value = observable ? elem[observable] : elem,
				  li = Y.Node.create('<' + nodes + '>' + value + '</' + nodes + '>');
			// list items will hold a reference to the data it corresponds to.
			li.setData(DATA_KEY, elem);
			container.append(li);
		});
		this.host.sync();
	},
	
	sync: function () {
		var groups = this.host.delegate.dd.get('groups');
		// loop on all sortables on the page and check for a connection
		// if one is available trigger data syncing
		$A.each(Y.Sortable._sortables, function (sel) {
			if ( $A.indexOf(groups, sel.get('id')) > - 1 ) {
			  sel.sortableArray.syncData();
		  }
		});
	},
	
	syncData: function () {
		var dataArray = this.get(DATA_ARRAY),
			  changed = false, newItem = null,
			  arr = this.host.getOrdering(function (node) {
			    // extract the new order of data
			    // capture new item
			    var dataItem = node.getData(DATA_KEY);
			    if ($A.indexOf(dataArray, dataItem) === -1) {
  					newItem = dataItem;
  				}
  				return dataItem;
				});
		
		// change the data-source to match the new order
		$A.each(arr, function(elem, i) {
			if (dataArray[i] != elem) changed = true;
			dataArray[i] = elem;
		});

		// to check to see only elements has been removed
		if (dataArray.length != arr.length) changed = true;
		dataArray.length = arr.length;
		if (changed) this.host.fire("arraychange", {dataArray: dataArray, newItem: newItem});
	},
	
	_arrayValidator: function (arr) {
	  return Y.Lang.isArray(arr);
	}
});



}, 'gallery-2011.06.08-20-04' ,{requires:['sortable','plugin','pluginhost'], skinnable:false });
