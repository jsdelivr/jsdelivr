YUI.add('gallery-handlebars-loader', function(Y) {

var HandlebarsLoader = function(cfg) {
    HandlebarsLoader.superclass.constructor.apply(this, arguments);
};

HandlebarsLoader.NAME = "HandlebarsLoader";

Y.extend(HandlebarsLoader, Y.Base, {
	templates : {},
	/**
	* Retrieves the raw content of the Handlebars template
	*/
	raw: function(id){
		var el = Y.one('#' + id);
		if(el){
			return el.get('innerHTML');
		}
		return null;
	},
	/**
	* Precompiles an array of templates and stores the result in the cache
	*/
	preCompile: function(ids){
		for(var x =0;x < ids.length;x++){
			this.template(ids[x]);
		}
	},
	/**
	* Retrieve a compiled template by node id
	*/
	template: function(id){
		var self = this, raw;
		
		if(!Y.Object.hasKey(this.templates,id)){
		
			raw = this.raw(id);
			
			if(raw === null){
				if(this.get('autoLoad')){
					this.load(
						this.get('comboLoader') + this.get('idConvert')(id),
						{
							process:true,
							sync:true
						}
					);
				}
			}else{
				this.templates[id] = Y.Handlebars.compile(raw);
			}
		}
		
		return this.templates[id];
	},
	/**
	* Load one or more handlebars templates and put the resulting content in the header
	* templates are expected to have a encompassing <script id="some-id" type="text/x-handlebars-template">
	* url: The url that retrieves the templates
	* config.process: Compiles the template after loading
	* config.sync: Executes the load in a synchronous manner. Necessary if you use load as part of a view initialization
	* config.callback: Define a callback function that is called with the resulting compiled template (requires process to be true)
	*/
	load:function(url, config){
		Y.io(url,{
			sync:config.sync || false,
			on:{
				success:function(transactionId, response){
					var hd = Y.one('head');
					hd.append(response.responseText);
					
					if(config.process){
						hd.all('script[type="text/x-handlebars-template"]').each(
							function(node){
								var tmp = this.template(node.get('id'));
							
								if(config.callback){
									config.callback(tmp);									
								}
								
							}, 
						this);
					}
				},
				failure:function(){
					throw "Handlebars: failed to retrieve url: " + url;
				}
			},
			context:this
		});
	},
	/**
	* Clears the cache
	*/
	clear: function(id){
		if(id){
			delete this.templates[id];
		}else{
			this.templates = {};
		}
	},destructor:function(){
		this.templates = null;
	}
},{
	ATTRS: {
		/**
		 * turns on autoLoading through the comboLoader/idConvert
		 */
		autoLoad:{
			value : false
		},
		/**
		 * comboloader url to be used in autoload scenario's
		 */
		comboLoader:{},
		/**
		 * the idConvert function is intended to automatically convert a supplied id into a remote loadable file reference
		 * e.g. inbox-message_en-hbs is converted to en/inbox/message.hbs
		 */
		idConvert:{
			value:function(id){
				return id;
			}
		}
	}
});
Y.namespace('MSA');
Y.MSA.HandlebarsLoader = HandlebarsLoader;


}, 'gallery-2012.08.15-20-00' ,{requires:['node-base','handlebars-base','handlebars-compiler','base-base','io-base'], skinnable:false});
