YUI.add('gallery-datasource-manage-stale', function(Y) {

var IGNORE_STALE_RESPONSES = 'ignoreStaleResponses',
	CANCEL_STALE_REQUESTS = 'cancelStaleRequests',
	DATA = 'data',
	HOST = 'host',
	DEF_REQUEST_FN = '_defRequestFn';

Y.namespace('Plugin').DataSourceManageStale = Y.Base.create('datasource-manage-stale', Y.Plugin.Base, [], {
	_lastId : null,
	_transactions : null,

	_doBeforeData : function (e) {
		if (!this._transactions[e.tId] || (this.get(IGNORE_STALE_RESPONSES) && e.tId != this._lastId)) {
			e.halt();
		}
	},
	
	_doBeforeDefRequestFn : function (e) {
		if (this.get(CANCEL_STALE_REQUESTS)) {
			Y.Object.each(this._transactions, function (t, id) {
				if (t.abort) {
					t.abort();
					delete this._transactions[id];
					delete Y.DataSource.Local.transactions[id];
				}
			}, this);
		}
	},

	_doAfterDefRequestFn : function (e) {
		if (this.get(IGNORE_STALE_RESPONSES)) {
			this._lastId = e.tId;
		}

		this._transactions[e.tId] = Y.DataSource.Local.transactions[e.tId];
	},

	initializer : function () {
		this._transactions = {};

		this.doBefore(DATA, this._doBeforeData, this);
		this.doBefore(DEF_REQUEST_FN, this._doBeforeDefRequestFn, this);
		this.doAfter(DEF_REQUEST_FN, this._doAfterDefRequestFn, this);
	}
}, {
	NS : 'stale',
	
	ATTRS : {
		cancelStaleRequests : {
			value : false
		},
		ignoreStaleResponses : {
			value : false
		}
	}
});


}, 'gallery-2010.11.03-19-46' ,{requires:['datasource-local']});
