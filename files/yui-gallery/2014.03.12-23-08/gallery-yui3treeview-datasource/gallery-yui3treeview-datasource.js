YUI.add('gallery-yui3treeview-datasource', function(Y) {

            
    /**
     * Treeview data plugin, it allows for dynamic data retreiving and loading
     * @class TreeviewDatasource
     * @constructor
     * @uses Y.DataSource
     * @extends Y.Plugin.base
     */
    
    var TreeviewDatasource = function () {
        TreeviewDatasource.superclass.constructor.apply(this, arguments);
    };
    
    TreeviewDatasource.NAME = 'TreeviewDatasource';
    TreeviewDatasource.NS = 'ds';
    
    TreeviewDatasource.ATTRS = {
        /**
         * The source URL 
         * @attribute source 
         * @type String
         */
        source : {
            value : null
        },
        
        /**
         * The load Message to display while waiting for the new data 
         * @attribute loadingMsg
         * @type String || Y.Node
         */
        loadingMsg: {
            value : null
        },
      
        /**
         * The JSON DataSchema
         * @attribute dataSchemaJSON
         * @type {Object}
         * @properties : resultListLocator, resultFields, metaFields. 
         */
        dataSchemaJSON : {
            value : {
                resultListLocator : null,
                resultFields : null,
                metaFields	: null 
            }
        },
        
        /**
         * The method to use to retrieve the data: IO,GET,Local
         * @attribute sourceMethod
         * @type String
         */
        sourceMethod : {
            value : null
        }
    };
    
    Y.extend(TreeviewDatasource, Y.Plugin.Base, {
        initializer : function () {
            var sourceMethod = this.get("sourceMethod"),
                dataSchemaJSON = this.get("dataSchemaJSON");
            
            this.publish('sendRequest', { 
                defaultFn: this._makeRequest
            });
            
            this.publish('onDataReturnSuccess', { 
                defaultFn: this._defSuccessHandler
            });
            
            this.publish('onDataReturnFailure', { 
                defaultFn: this._defFailureHandler
            });

            switch (sourceMethod) {
                case "io":
                    this.treedatasource = new Y.DataSource.IO({source: this.get("source")});                    
                    break;
                case "get":
                    this.treedatasource = new Y.DataSource.Get({source: this.get("source")});                    
                    break;
                case "local":
                    this.treedatasource =  new Y.DataSource.Local({source: this.get("source")});
                    break;
            }
            
            this.treedatasource.plug(Y.Plugin.DataSourceJSONSchema, {
                schema: {
                    resultListLocator: dataSchemaJSON.resultListLocator,
                    resultFields : dataSchemaJSON.resultFields
                }
            });
            
            this.set("treeDataSource",this.treedatasource);
        },
        
        _tree : null,
        
        
        _defSuccessHandler : function(e) {
            var tree = this._tree;
                
                Y.fire("onDataReturnSuccess",{data:e});
                if (this.get("loadingMsg")) {
                    tree.get("contentBox").set("innerHTML","");
                }
                tree.add(e.response.results);
                this.get("host").get("contentBox").focusManager.refresh();
        },
        
        _defFailureHandler : function(e) {
                Y.fire("onDataSourceFailure",{data:e});
        },
        
        _makeRequest : function (e) {
            var callback = {
                    success : Y.bind(this._defSuccessHandler, this),
                    failure :Y.bind(this._defFailureHandler, this)
                },
                loadingMsg = this.get("loadingMsg"),
                request = e.request,
                loadOnDemand,
                tree = e.node;
                
            loadOnDemand = tree.get("loadOnDemand");
            
            if (loadOnDemand !== false) {
                tree.set("loadOnDemand",false);
                this._tree = tree;
                if (loadingMsg) {
                    tree.get("contentBox").set("innerHTML",loadingMsg);
                }
                this.treedatasource.sendRequest({request:"?"+request,callback:callback});
            }
        }
    });
    
    Y.namespace('Plugin');
    Y.Plugin.TreeviewDatasource = TreeviewDatasource;
    


}, 'gallery-2010.12.01-21-32' ,{requires:['gallery-yui3treeview','plugin','datasource', 'datasource-jsonschema']});
