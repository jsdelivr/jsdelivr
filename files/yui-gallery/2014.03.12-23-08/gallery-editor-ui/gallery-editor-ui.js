YUI.add('gallery-editor-ui', function (Y, NAME) {


	/**
	* The Editor UI builds on top of YUI's Rich Text Editor base to create a user interface for editting and formatting HTML content.
	* Besides basic formatting support (text style, outlining, lists) it has an easy to use image upload manager and link manager.
	* @module gallery-editor-ui
	* @author Yvo Schaap
	*/

	/**
	 * @class EditorUI
	 * @description EditorUI class
	 * @constructor
	 * @extends Base
	 * @param config {Object} configuration object
	 */		
	function EditorUI(config) {
		EditorUI.superclass.constructor.apply(this, arguments);
	}
	
	EditorUI.NAME = 'editor-ui';
	EditorUI.ATTRS = {
		/**
		 * The DOM element ID to render our editor in.
		 * @attribute textareaEl
		 * @type String
		 */
		textareaEl: {
			value: null,
			validator: Y.Lang.isString,
			writeOnce:true
		},
		/**
		 * The DOM element ID of the FORM to write the WYSIWYG content to the textarea.
		 * @attribute formEl
		 * @type String
		 */
		formEl: {
			value: null,
			validator: Y.Lang.isString,
			writeOnce:true
		},
		/**
		 * Parent class name to refer from in CSS.
		 * @attribute editorClass
		 * @default post
		 * @type String
		 */
		editorClass: {
			value: 'post',
			writeOnce:true
		},
		/**
		 * Content tags formatting.
		 * @attribute editorClass
		 * @default contentStylesheetUrl
		 * @type String
		 */
		contentStylesheetUrl: {
			value: '/build/gallery-editor-ui/assets/gallery-editor-ui-content.css',
			writeOnce:true
		},
		/**
		 * The URL to upload the image to, resize image and return JSON. In the assets folder look at upload.phps for an example. Used by image-manager, only passed along.
		 * @attribute uploadToUrl
		 * @type String
		 */
		uploadToUrl: {
			value: '/build/gallery-editor-ui/assets/fake-upload.html',
			validator: Y.Lang.isString,
			writeOnce:true
		},		
		visualEditMode: {
			value: true	
		},
		editor: null,
		textArea: null,
		baseEditor: null,
		frameInstance: null,

		linkWindow: null,
		mediaWindow: null,
		sizeWindow: null,

		flagPaste: null
	};

	
	Y.extend(EditorUI, Y.Base, {		

		/**
		* @property regexps
		* @type object
		* @protected
		*/		
		regexps: {
			divToPElementsRe:       /<(a|blockquote|dl|div|ol|p|pre|table|ul|img)/i,
			replaceBrsRe:           /(<br[^>]*>[ \n\r\t]*){2,}/gi,
			replaceFontsRe:         /<(\/?)font[^>]*>/gi,
			trimRe:                 /^\s+|\s+$/g,
			normalizeRe:            /\s{2,}/g,
			killBreaksRe:           /(<br\s*\/?>(\s|&nbsp;?)*){1,}/g
		},
		tag2cmd: {
			'b': 'bold',
			'strong': 'bold',
			'i': 'italic',
			'em': 'italic',
			'u': 'underline',
			'blockquote' : 'blockquote',
			'img': 'media',
			'a' : 'link',
			'ul' : 'insertunorderedlist',
			'ol' : 'insertorderedlist',
			'h2' : 'size',
			'h3' : 'size'
		},
		styles: {
			'textDecoration': true,
			'fontWeight': true,
			'fontStyle': true,
			'textAlign': true,
			'color': false,
			'fontSize' : false,
			'fontFamily' : false,
			'backgroundColor': false
		},
		style2tag: {
			'strong': 'strong',
			'italic': 'em',
			'underline': 'em'
		},
		textAreaTextDefault: '<p><br><p>',

		renderUI : function() {},/* is only for Widget? */
		destructor : function() {},
		
		/**
		 * @method initializer
		 * @description main render method
		 */
		initializer: function() {
			var textArea,editor,textFrame,htmlFrame;
			
			if(this.get("textareaEl")){
				textArea = Y.one(this.get("textareaEl"));
				if(textArea){					
					//build html for editor UI
					textArea.addClass("Ak");//styling class
					editor = Y.Node.create('<div style="width: '+textArea.getComputedStyle("width")+'""></div>');//inherit width
					textFrame = Y.Node.create('<div class="f9 Ar" style="display: none"></div>');//todo: allow config option to set initial state
					htmlFrame = Y.Node.create('<div class="f8 Ar"></div>');//height from css
					
					textArea.wrap(textFrame);//textarea gets parent frame
					textFrame.wrap(editor);//frame gets another parent
					editor.appendChild(htmlFrame);//parent gets child
					
					//reference
					this.set("textArea",textArea);
					this.set("editor",editor);
				}else{
					return false;	
				}

												
				//for styling of panel (make configurable)
				if(!Y.one("body").hasClass("yui3-skin-sam")){
					Y.one("body").addClass("yui3-skin-sam");
				}
								
				//build toolbar html			
				//this._buildToolbar();
				
				//if we don't get a form ID, find the ancestor and set that one.
				if(this.get("formEl") === null){
					/*
					var form = editor.ancestor("form");
					if(form){
						this.set("formEl",form);
					}
					*/					
				}
				
				var baseEditor = new Y.EditorBase({
					defaultblock : 'p',
					extracss: 'body {margin: 0; padding: 0; overflow-y: scroll; overflow-x: hidden;} img, iframe, object, embed { -webkit-user-select: none; user-select: none; user-select: none;}',
					linkedcss: this.get('contentStylesheetUrl'),/* external file to load formatting */
					plugins : [
						Y.Plugin.EditorBr,
						Y.Plugin.EditorTab,
						Y.Plugin.EditorLists
					]
				});
				this.set("baseEditor",baseEditor);//set in class	
				
				/* hacky but need object reference from execCommand to close panels and stuff */
				Y.mix(baseEditor, {
					editorUI: this
				});
				
				baseEditor.on('frame:ready', function(){					
					this.set("frameInstance",baseEditor.getInstance());
					
					this.get("frameInstance").one("body").addClass(this.get("editorClass")).addClass('editing');/* our css style holder */
					this.get("frameInstance").on("resizestart",Y.bind(function(){ return false; },this)); //some browsers allow image resizing, we dont. Another option unselectable=on on ellements.
					this._buildToolbar();
					this._registerCommands();
					this._initToolbar();
					this._toggleComposer(true);//init contents		
				},this);
				
				this.set("linkWindow", new Y.Panel({
							modal: true,
							visible: false,
							centered: true,
							zIndex: 150,
							shim: true,
							headerContent: "Add Link",
							bodyContent: '<table class="space"><tr><td>Text to display:</td><td><input id="linkdialog-text" style="width: 300px"></td></tr><tr><td>To what URL should this link go?</td><td><input id="linkdialog-input" type="url" style="width: 300px; margin-right: 5px;"><small><a href="#" id="testLink" target="_blank">test link</a></small></td></tr><tr><td colspan="2"><div class="Kj-JD-Jl"><button name="ok" id="linkSubmitButton">Insert Link</button><button name="cancel" class="linkHideWindow">Cancel</button></div></td></tr></table>',
							render: true
				}));
				this.set("mediaWindow", new Y.Panel({
							modal: true,
							visible: false,
							centered: true,
							zIndex: 150,
							shim: true,
							headerContent: "Add Media",
							bodyContent: '<table class="space"><tr><td colspan="2"><div class="image-upload-frame"></div></td></tr><tr><td>URL:</td><td><input id="mediadialog-source" style="width: 300px" placeholder="http://"></td></tr><tr><td>Title:</td><td><input id="mediadialog-text" style="width: 300px" placeholder=""></td></tr><tr><td colspan="2"><div class="Kj-JD-Jl"><button name="ok" id="mediaSubmitButton">Add Media</button><button name="cancel" class="mediaHideWindow">Cancel</button></div></td></tr></table>',
							render: true
				}));
				this.set("sizeWindow", new Y.Overlay({
							visible: false,
							zIndex: 150,
							shim: true,
							bodyContent: '<div class="J-M"><div class="J-N" role="menuitem" style="font-size: normal;" command="p">Paragraph</div><div class="J-N" role="menuitem" style="font-size: x-large;" command="h2">Header One</div><div class="J-N" role="menuitem" style="font-size: large;" command="h3">Header Two</div><div class="J-N" role="menuitem" style="font-size: 1.2em" command="h3">Header Three</div></div>',
							align: {
    							node:".eY",
								points:[Y.WidgetPositionAlign.TL, Y.WidgetPositionAlign.BL]
							},
							render: true						
				}));
				
				Y.one(".mediaHideWindow").on("click",Y.bind(function(){ this.get("mediaWindow").hide(); },this));
				Y.one(".linkHideWindow").on("click",Y.bind(function(){ this.get("linkWindow").hide(); },this));				
				
				baseEditor.render(htmlFrame);
				
			}else{
			}
			
		},

		/**
		*
		* @method _registerCommands
		* @protected
		*/		
		_registerCommands: function(){
			/* this mixes YUI commands with our commands into one; doesn't link with browsers execCommand */
			/* http://yuilibrary.com/forum/viewtopic.php?p=35065 */
			/* we already try to use html5 tags instead of the browsers */
			Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
				
				bold: function(cmd) {
					var inst = this.get('host').getInstance(), selection = new inst.Selection(), node, text = '', editor = inst.host.editorUI;
					//remove end and start space of selection
					if(selection && selection.anchorNode.get("tagName") === "STRONG"){
						if (!selection.isCollapsed) {
							this._command('bold');
						}else{
							//remove node's tag
							this._command('bold');
						}
					}else if(selection && selection.anchorNode.get("tagName") === "BODY"){
						//the top
						return;
					}else if(selection){
						if (!selection.isCollapsed) {
							node = selection.wrapContent('strong');
							selection.focusCursor(true, true);
						} else {
							text = editor._getInnerText(selection.anchorNode);
							if(text.length > 0){
								node = selection.insertContent('<strong>&nbsp;</strong>');
							}else{
								node = selection.insertContent('<strong>&nbsp;</strong><br>');
							}
							selection.focusCursor(true, true);
						}
					}else{
						//this._command('bold');
					}
					
					return node;
				},
				italic: function(cmd) {
					////scope.baseEditor.execCommand('wrap','em');
					var inst = this.get('host').getInstance(), selection = new inst.Selection(), node, text = '', editor = inst.host.editorUI;
					//remove end and start space of selection
					if(selection && selection.anchorNode.get("tagName") === "EM"){
						if (!selection.isCollapsed){
							this._command('italic');
						}else{
							//remove node's tag
							this._command('italic');
						}
					}else if(selection && selection.anchorNode.get("tagName") === "BODY"){
						//the top
						return;
					}else if(selection){
						if (!selection.isCollapsed) {
							node = selection.wrapContent('em');
							selection.focusCursor(true, true);
						} else {
							text = editor._getInnerText(selection.anchorNode);
							if(text.length > 0){
								node = selection.insertContent('<em>&nbsp;</em>');	
							}else{
								node = selection.insertContent('<em>&nbsp;</em><br>');	
							}
							selection.focusCursor(true, true);
						}
					}else{
						//this._command('italic');
					}
					
					return node;
				},

				size: function(cmd,node) {
					var inst = this.get('host').getInstance(), selection = new inst.Selection(), node, text = '', editor = inst.host.editorUI;
					//remove end and start space of selection
					if(selection && selection.isCollapsed){
						//insert new header
					}else if(node && node.get("tagName")){
						//if a click happened on a h3, h2, or ..
					}else if(selection && selection.anchorNode.get("tagName") === "P"){
						//update paragraph to header
					}
					selection.focusCursor(true, true);

					if(editor.get("sizeWindow").get('visible') === true){
						editor.get("sizeWindow").setAttrs({visible: false});
					}else{
						editor.get("sizeWindow").setAttrs({visible: true});
					}
				},
				media: function(cmd,node) {

					var inst = this.get('host').getInstance(), selection = new inst.Selection(), node, grid, text = '', src = 'http://', editor = inst.host.editorUI;

					if(node && node.changedType === "mouseup") {
						if (!selection.isCollapsed) {
							return false;
						}
					}
					
					if(selection && selection.anchorNode && selection.anchorNode.get("tagName") === "IMG"){
						node = selection.anchorNode;
						text = node.get("title");
						src = node.get("src");
					}else if(node && node.get("tagName") === "IMG"){
						text = node.get("title");
						src = node.get("src");
					}else if(selection){		
						if (!selection.isCollapsed) {
							text = selection.text;
						}
					}else{
						inst.focus();	
					}
					
					var frame = editor.get("mediaWindow").get("contentBox").one(".image-upload-frame");//where to insert the image manager
					var parent_width = editor.get("editor").get("offsetWidth");/* get textarea width = width image upload max */
					var cfg = {cellImageSizes: {height: '300px', width: parent_width}, frameEl: frame, resizeHeight: true, uploadToUrl: this.get('uploadToUrl')};
					
					//before rendering overlay, set .image-upload-frame with the correct height and width for centerized to work correctly
					//frame.setStyle("width",cfg.cellImageSizes.width).setStyle("height",cfg.cellImageSizes.height);
					
					if(node){
						cfg = Y.mix(cfg,{file: src, cellImageSizes: {width: node.getStyle("width"), height: node.getStyle("height")}},true);//overwrite
					}
					
					var g = new Y.EditorImageManage(cfg);/* mix image data with other cfg */
					//g.support() === true){
						//g.render();
					//}else{
					//}
					g.on("upload:start",Y.bind(function(event){
						//disable save button
					},this));
					g.on("upload:error",Y.bind(function(event){
						//notify user of upload error
					},this));
					g.on("upload:complete",Y.bind(function(event){
						//enable save button
						
						var data = Y.JSON.parse(event.data);//return span with title of image, keep
						if(data && data.status === 1){
							Y.one("#mediadialog-source").set("value",data.file);
						}else{
							//notify user
						}

					},this));
					
					//Y.one("#mediadialog-data").set("value","");//existing gallery?
					Y.one("#mediadialog-source").set("value",src);
					Y.one("#mediadialog-text").set("value",text);
					
					Y.one("#mediaSubmitButton").destroy();//destroy
					Y.one("#mediaSubmitButton").on("click",Y.bind(function(e){
						e.preventDefault();
						
						if(node){
							//update node src
							node.set("src",Y.one("#mediadialog-source").get("value"));
							node.set("title",Y.one("#mediadialog-text").get("value"));
						}else{
							//else image node
							this.command("insertandfocus",'<img src="'+Y.one("#mediadialog-source").get("value")+'" title="'+Y.one("#mediadialog-text").get("value")+'">'+editor.textAreaTextDefault);
						}
						editor.get("mediaWindow").hide();
					},this));

					editor.get("mediaWindow").setAttrs({visible: true})

				},
				link: function(cmd,node) {
					//http://yuiblog.com/sandbox/yui/3.2.0pr1/api/createlink-base.js.html
					
					var inst = this.get('host').getInstance(), selection = new inst.Selection(), node, text = '',href = 'http://',editor = inst.host.editorUI;

					if(node && node.changedType === "mouseup") {
						if (!selection.isCollapsed) {
							return false;
						}
					}
					
					if(selection && selection.anchorNode && selection.anchorNode.get("tagName") === "A"){
						//within link
						node = selection.anchorNode;//selection has link?
						text = node.get("text");
						href = node.get("href");
					}else if(node && node.get("tagName") === "A"){
						//on a link
						text = node.get("text");
						href = node.get("href");						
					}else if(selection){				
						//create link
						if (!selection.isCollapsed) {
							text = selection.text;//text to link (no url available)
						}

					}else{
						inst.focus();		
					}
										
					Y.one("#linkdialog-text").set("value",text);
					Y.one("#linkdialog-input").set("value",href);
					
					//testLink
					Y.one("#testLink").destroy();//destroy
					Y.one("#testLink").on("mousedown",Y.bind(function(e){
						e.preventDefault()
						e.currentTarget.set("href",Y.one("#linkdialog-input").get("value"));
					},this));
											
					Y.one("#linkSubmitButton").destroy();//destroy
					Y.one("#linkSubmitButton").on("click",Y.bind(function(e){
						e.preventDefault();
						var href, text;
						text = Y.one("#linkdialog-text").get("value");
						href = Y.one("#linkdialog-input").get("value");
						if(text.length > 0 && href !== "http://"){
							if(node){
								node.set("href",href);
								node.set("text",text);
							}else{
								this.command("insertandfocus","<a href=\""+href+"\">"+text+"</a>");
							}
						}else{
							//message error no link
							this.command("unlink");
						}
						editor.get("linkWindow").hide();
					},this));
					
					editor.get("linkWindow").setAttrs({visible: true})

				},
				blockquote: function(cmd) {
					////scope.baseEditor.execCommand('wrap','em');
				    var inst = this.get('host').getInstance(), selection = new inst.Selection(), node, text = '',editor = inst.host.editorUI;
					//remove end and start space of selection
					if(selection && selection.anchorNode.get("tagName") === "BLOCKQUOTE"){
						if (!selection.isCollapsed){
							this._command('outdent');
						}else{
							//remove node's tag
							this._command('outdent');
						}
						//_getInnerText
					}else if(selection && selection.anchorNode.get("tagName") === "BODY"){
						return
					}else if(selection){
						if (!selection.isCollapsed) {
							node = selection.wrapContent('blockquote');
							selection.focusCursor(true, true);
						} else {
							//text = editor._getInnerText(selection.anchorNode);
							node = selection.insertContent('<blockquote>&nbsp;</blockquote>');	
							selection.focusCursor(true, true);//selection.selectNode(node., true);
						}
					}else{
						this._command('blockquote');
					}
				},
				clear: function(cmd) {
					var inst = this.get('host').getInstance(), selection = new inst.Selection(), node;
												
					var answer = confirm('You will lose the html formatting. Are you sure?');	
					if(answer && selection.anchorNode){
						if(selection.anchorNode.get("parentNode").get("tagName") === "BODY"){
							selection.anchorNode.set("outerHTML",'<p>'+selection.anchorNode.get("text")+'<br></p>');//must have paragraphs
						}else{
							selection.anchorNode.set("outerHTML",selection.anchorNode.get("text"));/* selection.getText(selection.anchorNode) */
							selection.focusCursor(true, true);
						}
					}
				}				
			});			
		},
		/**
		*
		* @method _buildToolbar
		* @protected
		*/
		_buildToolbar: function(){
			var editor = this.get("editor"), toolbars = Y.Node.create('<div class="toolbars"></div>'), html_toolbar = Y.Node.create('<div class="html_toolbar"></div>'), plain_toolbar = Y.Node.create('<div class="plain_toolbar" style="display: none"></div>');/* todo: no inline styles */
			
			var toolbar_buttons = [
				{fn: 'bold', cls:'eN'},
				{fn: 'italic', cls:'e3'},
				{fn: 'underline', cls:'fu'},
				{fn: 'size', cls:'eY',desc: 'Format size',arrow: true},
				{fn: 'media', cls:'QT',desc: 'Insert image'},
				{fn: 'link', cls:'e5',desc: 'Insert link'},
				{fn: 'insertorderedlist', cls:'e6',desc: 'Ordered list'},
				{fn: 'insertunorderedlist', cls:'eO',desc: 'Unordered list'},
				{fn: 'outdent', cls:'e8',desc: 'Outdent'},
				{fn: 'indent', cls:'e2',desc: 'Indent'},
				{fn: 'blockquote', cls:'fa',desc: 'Insert blockquote'},
				{fn: 'justifyleft', cls:'e4',desc: 'Align text left'},
				{fn: 'justifycenter', cls:'eP',desc: 'Center text'},
				{fn: 'justifyright', cls:'fc',desc: 'Align text right'},
				{fn: 'justifyfull', cls:'fd',desc: 'Text justified'},
				{fn: 'clear', cls:'fb',desc: 'Clear formatting selection'}	
			];
			
			Y.Object.each(toolbar_buttons, function(button){
				html_toolbar.appendChild(this._createToolbarButton(button));
			},this);
			
			html_toolbar.appendChild(Y.Node.create('<div class="button switch e9">Edit HTML</div>'));

			toolbars.appendChild(html_toolbar);

			plain_toolbar.appendChild(Y.Node.create('<div class="button switch k9">Rich formatting</div>'));
			plain_toolbar.appendChild(this._createToolbarButton({fn: 'format', cls:'u9','desc': 'Format HTML'}));
			
			toolbars.appendChild(plain_toolbar);
			
			editor.insert(toolbars,editor.one("*"));
		},
		/**
		*
		* @method _createToolbarButton
		* @param cfg {Object} Config for button.
		* @protected
		* @return {Object} YUI Node object.
		*/
		_createToolbarButton: function(cfg){
			//todo: support arrow
			return Y.Node.create('<div class="button" role="button" title="'+(cfg.desc ? cfg.desc : cfg.fn)+'" command="'+cfg.fn+'"><div class="'+cfg.cls+' icon"></div></div>');
		},
		/**
		 * 
		 * @method _initToolbar
		 * @protected
		 */			
		_initToolbar: function(){
			var editor = this.get("editor"), sizeWindow = this.get("sizeWindow");
			
			//we use mousedown, so we can keep focus in editor
			editor.all('.html_toolbar div[role=button]').each(function(node) {
				node.on('mousedown', function(e){
					e.preventDefault();
					
					var command = e.currentTarget.getAttribute("command"); 
					if(command){
						var node = this.get("baseEditor").execCommand(command);
					}
					return false;
				},this);
			}, this);	
			
			
			sizeWindow.get("contentBox").all("div[role=menuitem]").each(function(node) {
				node.on("mousedown",Y.bind(function(e){
					e.preventDefault();
					var inst = this.get("baseEditor").getInstance(), selection = new inst.Selection(), target = e.currentTarget;

					if(selection && !selection.isCollapsed){
						if((style = target.getAttribute("data-style"))){
							var style = style.split(": ");
							selection.anchorNode.setStyle(style[0],style[1]);//attach style
						}else if(command = target.getAttribute("command")){
							this.get("baseEditor").execCommand("formatblock",target.getAttribute("command"));
						}
						selection.focusCursor(true, true);
					}else{
						//nothing selected, insert node with new line
						if(command = target.getAttribute("command")){
							this.get("baseEditor").execCommand("insertandfocus","<"+target.getAttribute("command")+">&nbsp;<br></"+target.getAttribute("command")+">");
						}
					}
					
					this.get("sizeWindow").hide();
					return false;//so we keep focus				 
				},this));				
			},this);

			//
			this.get("baseEditor").before('nodeChange', function(e) {
				switch (e.changedType) {
					case 'backspace-up':
					if (Y.UA.webkit){
						e.preventDefault();
						e.stopPropagation();
						return false;
					}	
					break;				
				}
			},this);	
			
			this.get("baseEditor").after('nodeChange', function(e) {
				switch (e.changedType) {
					/*case 'execcommand': endless loop*/
					case 'enter':
						if (e.changedNode.get("tagName") === 'BLOCKQUOTE' && !e.changedEvent.shiftKey) {
							/* we don't want enters in blockquote creating a new blockquote (use shift enter)*/
							e.preventDefault();
							//this.get('baseEditor').execCommand('outdent', '');
							this.get("baseEditor").execCommand("insertandfocus","</blockquote><p><br></p>");
						}
						/* on enter with parent body, force p instead of copy element we came from */
						
						break;
					case 'keyup':
					case 'mousedown':
						this._updateButtons(e);
						break;
				}
				/* we don't like this */
				e.classNames = "";
				e.fontFamily = "";
				e.fontSize = "";
				e.fontColor = "";
				e.backgroundColor = "";	
			},this);

			//strip any styles added (except, execcommand, which allows styles (incl. "question") doesn't pick up on browser exceccommand CTRL+B capture ourselves and bubble to this)
			//
			this.get("baseEditor").before('nodeChange', function(e) {

				switch (e.changedType) {
					case 'paste':
						this.flagPaste = true;
						break;
					case 'keyup':
						if(this.flagPaste === true){
							e.changedNode.set('innerHTML', e.changedNode.get('text'));//allow a, strong, li, ul, ol, p, br?
						}
					default:
						this.flagPaste = false
				}

			},this);
			
			//only on clicks of element
			this.get("baseEditor").after('nodeChange', function(e) {
				if(e.changedType === "mouseup") {
					e.preventDefault();
					
					var node = e.changedNode;
					node.changedType = e.changedType; /* we use this to check what the action was */
					
					if(node.get("tagName") === "A"){
						this.get("baseEditor").execCommand("link",node);
					}else if(node.get("tagName") === "IMG"){
						this.get("baseEditor").execCommand("media",node);
					}
				}
			},this);
			
			//toggle
			editor.one(".e9").on('click', Y.bind(this._toggleComposer, this, false));
			editor.one(".k9").on('click', Y.bind(this._toggleComposer, this, true));
				
			editor.one(".u9").on('click', Y.bind(this._formatHtml, this, true));//format html button
			
			//on form submit
			if(this.get("formEl") && Y.all(this.get("formEl")).size() === 1){
				Y.one(this.get("formEl")).before("submit", Y.bind(this.submitForm, this));//should be referenced in config
			}
		},
		/**
		 *
		 * @method _formatHtml
		 * @protected
		 */	
		_formatHtml : function() {
			if(!(typeof EditorHTMLFormatter === 'undefined')){
				//bit crazy way around but it works
				var html = this.get("textArea").get("value");
				this.get("baseEditor").set('content',html);//don't do anything with the formatting
				
				var formatted_html = EditorHTMLFormatter.init(this.get("frameInstance").one('body'));
				this.get("textArea").set("value",formatted_html);
				//after switch we clean it up
			}
		},	
		/**
		 *
		 * @method _updateButtons
		 * @param e {Event} events
		 * @protected
		 */	
		_updateButtons : function(e) {
			//e.preventDefault();
			var editor = this.get("editor"), node = e.changedNode, cmds = e.commands;
			
			if(node) {			
				//tag2cmd links tag to command hence button
				var parents = this.get("baseEditor").getDomPath(node, false);//get parent DOM nodes
				editor.all(".html_toolbar div[role=button]").removeClass("active");//reset buttons
				
				Y.each(parents, function(node){
					var cmd = this.tag2cmd[node.tagName.toLowerCase()];
					/* also support our outline styles */
					if(cmd){
						editor.all(".html_toolbar div[role=button]").each(function(node){
							if(node.getAttribute("command") === cmd){
								node.addClass("active");//active
							}
						});
					}
				},this);
			}
		},		
		/**
		 *
		 * @method _toggleComposer
		 * @param toggle {Boolean} Toggle between WYSIWYG editor or HTML.
		 * @protected
		 */
		_toggleComposer: function(toggle){
			var editor = this.get("editor");
			try{
				this.set("visualEditMode",toggle);
				if(toggle === true){
					//wysiwyg editor
					this.get("baseEditor").set('content',this._formatDom() + this.textAreaTextDefault);//is removed anyways by regex
					
					//make object not peak through
					//var param = Y.Node.create('<param name="wmode" value="opaque">');
					//this.get("frameInstance").all('object').appendChild(param);
					
					editor.one(".html_toolbar").setStyle('display','block');
					editor.one(".plain_toolbar").setStyle('display','none');
					
					editor.one(".f9").setStyle('display','none');
					editor.one(".f8").setStyle('display','block');
				}else{
					//html format editor				
					this.get("textArea").set("value",this._cleanDom());

					//this._formatHtml();//format html
													
					editor.one(".html_toolbar").setStyle('display','none');
					editor.one(".plain_toolbar").setStyle('display','block');
					
					editor.one(".f9").setStyle('display','block');
					editor.one(".f8").setStyle('display','none');
				}
			}catch(err){
				
				
			}
		},
		/**
		*
		* @method _formatDom
		* @protected
		* @return {String} textArea value.
		*/
		_formatDom : function(){
			var content = this.get("textArea").get("value");;
			//content = content.replace(this.regexps.normalizeRe, " ");/* clean up whitespace */
			if(content.length < 1){
				return "";/* toggle will add a p again */
			}
			
			return content;
		},
		/**
		*
		* @method _cleanNodes
		* @protected
		*/
		_cleanNodes : function(){
			/* http://yuilibrary.com/yui/docs/node/ */
			
			var tags = this.get("frameInstance").one('body').all("*");
			tags.each(function(node){
				
				if(node.ancestor(".gridbuilder",true)){
					return;
				}

				if(node.get("tagName") === "B") {
					var newNode = Y.Node.create('<strong></strong>');
					newNode.set("innerHTML",node.get("innerHTML"));				
					node.replace(newNode);
				}

				if(node.get("tagName") === "I") {
					var newNode = Y.Node.create('<em></em>');
					newNode.set("innerHTML",node.get("innerHTML"));				
					node.replace(newNode);
				}

				//remove spans without a whitelisted meaning
				//remove justify on span or normal?
				if(node.get("tagName") === "SPAN") { //&& no whitelisted style (weight, underline, color, italics, align)
					var flag = false;
					Y.each(this.styles, function(value, key) {
						style = node.getStyle(key);//return textDecoration = none, equals; drop line-height and stuff
						if(value === true && style && (style !== "normal" && style !== "justify" && style !== "none"  && style !== "start" )){
							//keep
							flag = true;
						}else{
							//remove style
							node.setStyle(key,'');
						}
					});
					/* safari adds spans with Apple-style-span stuff */
					if(flag === false || node.hasClass("Apple-style-span")){
						node.get("parentNode").insertBefore(node.get("childNodes"),node);
						node.remove();
					}
				}
												
				if(node.get("tagName") === "DIV" && this._getInnerText(node,true).length > 0) {
					if (node.get("innerHTML").search(this.regexps.divToPElementsRe) === -1)	{
						var newNode = Y.Node.create('<p></p>');//kills all div information
						newNode.set("innerHTML",node.get("innerHTML"));				
						node.replace(newNode);
					}else{
					}
				}
				
				//if has no child node text, what are you doing here (p with an image?)
				if(node.get("tagName").match(/^(ul|ol|blockquote|p|li|em|strong|h3|h2)$/i)){
					if(this._getInnerText(node,true).length === 0 && node.all("img, iframe, object, br").size() === 0){
						node.remove();
					}else{
					}
				}

				//if youtube object/iframe, strip parent <p>
				if(node.get("tagName") === "P" && this._getInnerText(node,true).length === 0 && (node.one('*') && (node.one('*').get("tagName") === "IFRAME" || node.one('*').get("tagName") === "IMG"))) {
					var newNode = Y.Node.create('<div></div>');
					newNode.addClass("media");
					newNode.set("innerHTML",node.get("innerHTML"));					
					node.replace(newNode);
				}
				
				//some editor-base node for IE and cursors
				if(node.get("tagName") === "VAR") {
					node.get("parentNode").insertBefore(node.get("childNodes"),node);
					node.remove();
				}

				
			},this);
		},
		/**
		* Cleans up the DOM the editor created.
		* @method _cleanNodes
		* @protected
		* @return {String} WYSIWYG to clean HTML string.
		*/
		_cleanDom : function(){
			
			//clean up dom
			this._cleanNodes();
						
			var textContent = this.get("baseEditor").getContent();//get content
			
			//br br to p
			textContent = textContent.replace(this.regexps.replaceBrsRe, '</p><p>');
			
			//remove &nbsp;
			textContent = textContent.replace(/&nbsp;/gi, ' ');
			
			//replace <br><p>
			textContent = textContent.replace(/<br>([\S+])?<p>/gi, '<p>');

			//replace </p></br>
			textContent = textContent.replace(/<\/p>([\S+])?<br>/gi, '</p>');

			//replace <p>[spaces|single br]</p> or those as divs
			textContent = textContent.replace(/<(div|p|span)>([\S+])?(<br>)?<\/(div|p|span)>/gi, '');
			
			//replace style="" due to clearing unwanted styles, but keeping this attribute
			textContent = textContent.replace(/ style=""/gi, '');
			
			return textContent;
		},
		/**
		 * 
		 * @method _getInnerText
		 * @param e {HTMLElement}
		 * @param normalizeSpaces {Boolean}
		 * @protected
		 * @return {String} Node text contents as string.
		 */			
		_getInnerText: function (e, normalizeSpaces) {
			var textContent = "";
			normalizeSpaces = (typeof normalizeSpaces === 'undefined') ? true : normalizeSpaces;

			textContent = e.get("text").replace(this.regexps.trimRe, "");
			
			if(normalizeSpaces && !e.hasChildNodes()){
				e.set("text",textContent.replace(this.regexps.normalizeRe, " "));
			}
			
			return textContent;
		},
		/**
		 * @method submitForm
		 * @param e {Event}
		 * @description Called before form is submitted
		 */		
		submitForm: function(e){
			
			//if in 'wysiwyg' mode
			if(this.get("visualEditMode") === true){
				this.get("textArea").set("value",this._cleanDom());/* take content from wysig editor and push to textarea */
			}
			
			this.get("textArea").set("value",this._formatDom());
			
			//Y.one(this.get("formEl")).submit();	//remove submitForm from event listener?		
		},
		/**
		 * @method getContent
		 * @description Return the html content from the active view
		 * @return {String} Editor content as html string.
		 */	
		getContent: function(){
			
			//if in 'wysiwyg' mode
			if(this.get("visualEditMode") === true){
				this.get("textArea").set("value",this._cleanDom());/* take content from wysig editor and push to textarea */
			}
			
			return this._formatDom();			
		},
		/**
		 * 
		 **/		
		test : function(){
			
		}
	});
	
	Y.EditorUI = EditorUI;	/**
	 * @module gallery-editor-ui
	 */
 
	/**
	 * @class EditorImageManage
	 * @description EditorImageManage class
	 * @constructor
	 * @extends Base
	 * @param config {Object} configuration object
	 */	
	function EditorImageManage(config) {
		EditorImageManage.superclass.constructor.apply(this, arguments);
	}
	
	EditorImageManage.NAME = 'EditorImageManage';
	EditorImageManage.ATTRS = {
		/**
		 * The DOM element to render our image in. Can be YUI3 node or selector.
		 * @attribute frameEl
		 * @type Object
		 */
		frameEl: {
			value: null,
			writeOnce:true
		},
		/**
		 * The URL to upload the image to, resize image and return JSON. In the assets folder look at upload.phps for an example.
		 * @attribute uploadToUrl
		 * @type String
		 */
		uploadToUrl: {
			value: '/build/gallery-editor-ui/assets/fake-upload.html',
			validator: Y.Lang.isString,
			writeOnce:true
		},
		/**
		 * Can we adjust the height of the image.
		 * @attribute resizeHeight
		 * @type Boolean
		 */
		resizeHeight: {
			value: true,
			validator: Y.Lang.isBoolean,
			writeOnce:true
		},
		/**
		 * Draw UI buttons in manager
		 * @attribute drawUI
		 * @type Boolean
		 */
		drawUI: {
			value: true	
		},
		/**
		 * Image URL which pre-loads into our manager
		 * @attribute file
		 * @type String
		 */
		file: null,
		/**
		 * The frame's initial size dimentsions (height and width) to hold image in
		 * @attribute cellImageSizes
		 * @type Object
		 */
		cellImageSizes: {
			value: {width: 0, height: 0 },
			setter: function (cellImageSizes) {
				cellImageSizes.height = parseInt(cellImageSizes.height,10);
				cellImageSizes.width = parseInt(cellImageSizes.width,10);
				
				return cellImageSizes;
			}
		},
		/**
		 * The image size dimentsions (height and width)
		 * @attribute canvasImageSizes
		 * @type Object
		 */
		canvasImageSizes: {
			value: {width: 0, height: 0 },
			setter: function (canvasImageSizes) {
				canvasImageSizes.height = parseInt(canvasImageSizes.height,10);
				canvasImageSizes.width = parseInt(canvasImageSizes.width,10);
				
				return canvasImageSizes;
			}
		},
		cell: null,
		top:{
			value: 0
		},
		left:{
			value: 0	
		},
		img: null,
		img_src: null,
		zoom: {
			value: 1
		},
		resize: {
			value: 1
		}
	};
	
	Y.extend(EditorImageManage, Y.Base, {
		
		renderUI : function() {},/* is only for Widget? */
		destructor : function() {},
		
		/**
		 * @method initializer
		 * @description main render method
		 */
		initializer: function() {
			var cellImageSizes = this.get('cellImageSizes'), canvasImageSizes = this.get('canvasImageSizes'), frameEl = this.get("frameEl"), cell;
			
			
			//init vars
			if(frameEl && frameEl._node){
				//ok
			}else if(frameEl && Y.one(frameEl)){//is string
				frameEl = Y.one(this.get("frameEl"));//set frameEl as node
				this.set("frameEl",frameEl);
			}else{
				return;
			}

			//events
			this.publish("upload:start");
			this.publish("upload:error");
			this.publish("upload:complete");

			cell = Y.Node.create('<div class="visual"></div>');
			this.set("cell",cell);			
			//cellImageSizes is obligated
			
			
			frameEl.empty().appendChild(cell);//clear and add manage cell
			
			//do all this in a cell
			if(canvasImageSizes.width === 0 && canvasImageSizes.height === 0){
				canvasImageSizes = { width: cellImageSizes.width, height: cellImageSizes.height };
			}
			this.set('canvasImageSizes',canvasImageSizes);
			
			//this.set('cellImageSizes',cellImageSizes);
			cell.setStyle("width",cellImageSizes.width+"px").setStyle("height",cellImageSizes.height+"px");	

			//init upload-to canvas:
			this.uploadCanvas = Y.Node.create('<canvas class="canvas"></canvas>');
			
			//init canvas draw
			this.uploadTo = this.uploadCanvas.invoke('getContext', '2d');//node: _node.getContext("2d");			
			
			//canvas copy (due to crazy sizing issues)
			this.uploadCanvasCopy = Y.Node.create('<canvas class="canvas"></canvas>');
			this.uploadToCopy = this.uploadCanvasCopy.invoke('getContext', '2d');//node: _node.getContext("2d");
					
			//init upload button
			this.uploadButton = Y.Node.create('<input type="file" class="upload" accept="image/*">');//multiple="multiple", size="0"
			cell.appendChild(this.uploadButton);
			cell.appendChild(this.uploadCanvas);
			
			if(this.get("drawUI")){
				//create zoom buttons
				this.zoomBtns = Y.Node.create('<div class="zoom button in" title="Zoom In">+</div> <div class=" zoom button out" title="Zoom Out">-</div>');
				
				this.zoomBtns.one(".in").on("click",Y.bind(function(e){		
					var zoom = parseFloat(this.get("zoom") * 1.05);
					this.set("zoom",zoom);
					this.drawCanvas();
					
				},this));
				this.zoomBtns.one(".out").on("click",Y.bind(function(e){		

					var zoom = parseFloat(this.get("zoom") * .95);
					if(zoom > 1){
						this.set("zoom", zoom);
					}else{
						this.set("zoom",1);//reset						
					}
					this.drawCanvas();
					
				},this));
				cell.appendChild(this.zoomBtns);

				//save image button
				this.saveBtn = Y.Node.create('<a class="save button" title="Save image">Save</a>');
				this.saveBtn.on("click",Y.bind(function(e){	
					this.saveImage();
				},this));
				cell.appendChild(this.saveBtn);
								
				//remove image button
				this.clearBtn = Y.Node.create('<a class="delete button" title="Remove image">x</a>');
				this.clearBtn.on("click",Y.bind(function(e){				
					this.get("cell").removeClass("active");
					this.clearCanvas();
				},this));
				cell.appendChild(this.clearBtn);
				
				if(this.get("resizeHeight") === true){
					var heightInpt = Y.Node.create('<input class="heightRow" value="'+cellImageSizes.height+'px">');
					heightInpt.on(["blur","submit"],Y.bind(function(evt){
						var row = evt.currentTarget.get("parentNode");
						var height = parseInt(evt.currentTarget.get("value"),10);
						if(height > 10){/* minimum height */
							this.setHeight(height+6);/* this shouldn't be here +6 */
						}
					},this));
					cell.appendChild(heightInpt);	
				}
			}

			//add resizer of cell
			if(this.get("resizeHeight") === true){

				var resize = new Y.Resize({
					node: frameEl,
					handles: 'b',
					minHeight: 55,
					maxHeight: 600,
					preserveRatio: false
				});

				resize.on('resize:resize', Y.bind(function(event) {
					var cell = event.currentTarget.get("node");				
					var height = parseInt(event.currentTarget.info.offsetHeight,10);
					this.setHeight(height);
					
					cell.all(".heightRow").set("value",(height-6)+"px");/* 6 = handlebar adjust upload.js */
				},this));
			}

			//have a image to fill cell? Load into canvas!
			if(this.get("file")){
				this.set("img",Y.Node.create('<img>'));	
				this.get("img").on("load",Y.bind(this.prepareImg,this));
				this.get("img").on("error",Y.bind(this.errorImg,this));
				
				//only local files can load to crossdomain, else use our proxy to load
				if(this.get("file").indexOf(document.location.hostname) > 0 || this.get("file").substr(0,1) === "/") {
					this.get("img").set('src',this.get("file"));
				}else{
					this.get("img").set('src',this.get('uploadToUrl')+'?proxy='+encodeURIComponent(this.get("file")));
				}

				//initial offset
				this.uploadCanvas.setStyle('position','relative');
				this.uploadCanvas.setStyle('top',this.get("top")+'px');
				this.uploadCanvas.setStyle('left',this.get("left")+'px');		
			}
			
			//events
			this.uploadButton.on("change",Y.bind(this.loadLocalImage,this));
			
			//events resize
			Y.on('windowresize', Y.bind(this.contrainMove,this));
		},
		
		/**
		 * Only works for html5 browsers, else fallback to browser upload only?
		 * @method support
		 * @return {Boolean}
		**/			
		support: function(){
			if ( !( window.File && window.FileReader && window.FileList && window.Blob ) ) {	
				return false;	
			}
			return true;
		},
		/**
		 * @method loadLocalImage
		 * @param evt {Event} events
		 * @protected
		**/				
		loadLocalImage: function(evt){	
						
			//clear canvas
			this.clearCanvas();
			
			//create image holder and attach event listener
			this.set("img",Y.Node.create('<img>'));
			this.get("img").detach('load');
			this.get("img").on("load",Y.bind(this.prepareImg,this));

			var files = evt.target.get('files');/* ie10 :( */				
			if (files && files.size() > 0) {
				var file = files._nodes[0];
				//file.name , file.size, file.lastModifiedDate
				if (typeof FileReader !== "undefined" && file.type.indexOf("image") !== -1) {
					var reader = new FileReader();
					//addEventListener doesn't work in Google Chrome for this event
					reader.onload = Y.bind(function (evt) {
						this.get("img").set('src',evt.target.result);//this will call load on prepareImg			
					},this);	
					reader.readAsDataURL(file);//readAsText				
				}
			}
			
			evt.stopPropagation();
			evt.preventDefault();	
		},
		/**
		 * @method prepareImg
		 * @param evt {Event} events
		 * @protected
		**/				
		prepareImg: function(evt){		
			//save local source file
			this.set("img_src",evt.target._node);

			this.uploadCanvasCopy.set("width",evt.target._node.width);
			this.uploadCanvasCopy.set("height",evt.target._node.height);		
			this.uploadToCopy.drawImage(evt.target._node, 0, 0, evt.target._node.width, evt.target._node.height);
			
			this.drawCanvas();
		},
		/**
		 * @method errorImg
		 * @param evt {Event} events
		 * @protected
		**/				
		errorImg: function(evt){		
		},
		/**
		 * @method drawCanvas
		 * @protected
		**/				
		drawCanvas: function(){
			var img = this.get("img"),
				img_src = this.get("img_src"),
				canvasImageSizes = this.get("canvasImageSizes"),
				cell = this.get("cell");
			
			//set cell active
			cell.addClass("active");
			
			//to allow moving
			
			//get dimentsions, and set them
			var newDimensions = this.resizeDimensions(img_src,canvasImageSizes);			
			
			img_src.width = newDimensions.width;
			img_src.height = newDimensions.height;
			
			//zoom
			img_src.height = img_src.height * this.get("zoom");
			img_src.width = img_src.width * this.get("zoom");
			
			//do we allow canvas to be < max-width|max-height? -> result is too small image send back 
			this.uploadCanvas.set("width",img_src.width);
			this.uploadCanvas.set("height",img_src.height);

			//calc ratio between our source canvas and and target (preview) canvas
			this.set("resize",(this.uploadCanvasCopy.get("height") / this.uploadCanvas.get("height")));
			
			//support zoom
			this.uploadTo.drawImage(img_src, 0, 0, img_src.width,img_src.height);
			
			//draggable reset
			this.contrainMove();
		},
		/**
		 * @method resizeDimensions
		 * @protected
		 * @return {Object} Dimensions
		**/			
		resizeDimensions: function(node,minDimensions){
			//get image dimensions
			var ratio = node.height / node.width;
			var newDimensions = {height: node.height, width: node.width, resize: 100};
						
			if(node.width >= minDimensions.width || node.height >= minDimensions.height){
				//start with the shortest target lenght
				if(minDimensions.width <= minDimensions.height && node.height <= node.width && node.height >= minDimensions.height){
					//match up height with max height
					//newDimensions.resize = (Math.round((newDimensions.width / node.width)*100));				
				}else{
					//match up width with height
					if(node.width >= minDimensions.width){
						newDimensions.width = minDimensions.width;
						newDimensions.height = Math.round(minDimensions.width * ratio);	
						//newDimensions.resize = (Math.round((newDimensions.width / node.width)*100));				
					}else{
						//fits within max (too small)
					}
				}
			}else{
				//no resize
			}	
			return newDimensions;	
		},
		/**
		 * @method contrainMove
		 * @protected
		**/					
		contrainMove: function(){
			var img = this.get("img"),
				cell = this.get("cell");
			
			/* is the canvas already offset */
			var offsetTop = parseInt(this.uploadCanvas.getStyle("top"),10);
			var offsetLeft = parseInt(this.uploadCanvas.getStyle("left"),10);
			
			/* for if image is smaller then canvas */
			if(this.uploadCanvas.get("width") < parseInt(cell.getStyle("width"),10)){
				var fillWidth = parseInt(cell.getStyle("width"),10) - this.uploadCanvas.get("width");
			}else{			
				var fillWidth = 0;
			}

			/* for if image is smaller then canvas */
			if(this.uploadCanvas.get("height") < parseInt(cell.getStyle("height"),10)){
				var fillHeight = parseInt(cell.getStyle("height"),10) - this.uploadCanvas.get("height");
			}else{			
				var fillHeight = 0;
			}
						
			//make draggable in div (set when new image is loaded, unset previous node)
			var location = this.uploadCanvas.getXY();
			
			if(this.drag){ this.drag.destroy(); }//cleanup reset
			
			this.drag = new Y.DD.Drag({
				node: this.uploadCanvas,
			}).plug(Y.Plugin.DDConstrained,{
					constrain: { 
					top: (location[1] - offsetTop - (this.uploadCanvas.get("height") - (this.uploadCanvas.get("height") > parseInt(cell.getStyle("height"),10) ?  parseInt(cell.getStyle("height"),10) : this.uploadCanvas.get("height")))),
					left: (location[0] - offsetLeft - (this.uploadCanvas.get("width") - (this.uploadCanvas.get("width") >  parseInt(cell.getStyle("width"),10) ?  parseInt(cell.getStyle("width"),10) : this.uploadCanvas.get("width")))), 
					right: location[0] + this.uploadCanvas.get("width") + fillWidth - offsetLeft,
					bottom: location[1] + this.uploadCanvas.get("height") + fillHeight - offsetTop }
			});

			this.drag.on("drag:end",Y.bind(function(e){
				this.set("top",parseInt(this.uploadCanvas.getStyle("top"),10));
				this.set("left",parseInt(this.uploadCanvas.getStyle("left"),10));
				
				//and calc new drag area
				this.contrainMove();
			},this));		
		},
		/**
		 * @method clearCanvas
		 * @protected
		**/				
		clearCanvas: function(){
			//reset offset
			this.uploadCanvas.setStyle('top','0px');
			this.uploadCanvas.setStyle('left','0px');
			
			//zoom
			this.set("zoom",1);
			
			//cleanup canvas pixels
			this.uploadTo.clearRect(0, 0, this.uploadCanvas.get("width"), this.uploadCanvas.get("height"));	
		},
		/**
		 * @method convertToBlob
		 * @return {Blob} Blob image data.
		**/		
		convertToBlob: function(dataURI){
			
			//http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
			//https://github.com/josefrichter/resize/blob/master/public/preprocess.js
			var binary = atob(dataURI.split(',')[1]);
			var array = [];
			for(var i = 0; i < binary.length; i++) {
				array.push(binary.charCodeAt(i));
			}
			return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});		
		},
		/**
		 * @method getFile
		 * @return {FileHTML5} Y.FileHTML5 object.
		**/					
		getFile: function(){	
			//var blob = this.uploadCanvas._node.mozGetAsFile("file.jpg");			
			if(this.get("cell").hasClass("active")){
				var blob = this.convertToBlob(this.getImage());
				Y.FileHTML5.prototype._isValidFile = function(){ return true; };//overwrite
				
				return new Y.FileHTML5({file: blob});
			}else{
				return false;	
			}
		},
		/**
		 * Height and width of output cell not actual image!
		 * @method getFileDetails
		 * @return {Object} File dimensions (top, left, zoom, width, height, resize)
		**/		
		getFileDetails: function(){	
			var cellImageSizes = this.get("cellImageSizes");			
			//todo: if cellImageSizes < canvas size, push that out
			return {top: this.get("top"), left: this.get("left"), zoom: this.get("zoom"), width: cellImageSizes.width, height: cellImageSizes.height, resize: this.get("resize") };
		},	
		/**
		 * @method getImage	
		 * @return {String} Base64 binary image data.
		**/				
		getImage: function(){		
			//this string is a file
			return this.uploadCanvasCopy._node.toDataURL("image/jpeg","0.8");//png,jpeg,.8
		},
		/**
		 * @method setHeight		
		**/				
		setHeight: function(pixels){
			
			var cellImageSizes = this.get('cellImageSizes');
			cellImageSizes.height = pixels - 6; /*6 is so we have an resize handle bar */
			this.set('cellImageSizes',cellImageSizes);
			this.get("cell").setStyle("height",cellImageSizes.height+"px").setStyle("width",cellImageSizes.width+"px");	
			
			this.contrainMove();/* redrawn image */	
		},
		/**
		 * @method saveImage		
		**/			
		saveImage: function(){
			var file = this.getFile();
			if(file){
				var uploader = new Y.UploaderHTML5;
				
				uploader.on("uploadstart",Y.bind(function(event) {
					this.fire("upload:start",event);
				},this));
				uploader.on("uploaderror",Y.bind(function(event) {
					this.fire("upload:error",event);
				},this));
				uploader.on("uploadcomplete",Y.bind(function(event) {
					this.fire("upload:complete",event);
				},this));

				uploader.upload(file, this.get('uploadToUrl'), this.getFileDetails());
			}
			
		},
	});
	
	Y.EditorImageManage = EditorImageManage;	/**
	 * @module gallery-editor-ui
	 */

	/**
	 * @class EditorHTMLFormatter
	 * @description Formats a DOM to correctly outlined easy to read HTML.
	 */	
	var EditorHTMLFormatter = {
		html: [],
		indent: '  ',
		trimRe: /^\s+|\s+$/gi,
		inlineNodeRe: /^(img|br|sup|sub)$/i,
		newLineNodeRe: /^(div|p|img|blockquote|q|iframe|pre|code|table|tbody|th|td|tr|ul|ol|li|h1|h2|h3|h4|h5|h6|dl|dt|dd|form|fieldset|legend|iframe)$/i,
		notCloseNodesRe: /^(img|br)$/i,
		firstNodeRe: /^(<[^>]+>)/i,
		replaceNodesRe: /^(script|style|meta|body|head|title|link)/i,
		keepAttributesRe: /^(src|style|width|height|class|title|alt|data-)/i,//no id
		/* span, ul, b, strong, em, i, ul are all online */

		/**
		 * @method init
		 * @description main render method
		 * @param dom {Object} native DOM element or YUI Node
		 * @return {String} HTML
		 */		
		init: function(dom){
			this.html = [];
			if(dom === null){
				return '';//overwrites so maybe return dom
			}else if(dom && dom._node){
				this._dive(dom.getDOMNode(),0);//for YUI
			}else{
				this._dive(dom,0);//native DOM assumed
			}
			return this.html.join('');
		},
		/**
		*
		* @method _dive
		* @protected
		*/			
		_dive: function (e,level) {
			var node = e.firstChild;
	
			if(!e) {
				return;
			}
	
			//go until no more child nodes
			while(node !== null) {
				//https://developer.mozilla.org/en-US/docs/DOM/Node.nodeType
				var hasTextChild = node.hasChildNodes() > 0 && node.firstChild.nodeType === 3 && node.firstChild.nodeValue.replace(this.trimRe,'').length > 0;
				if (node.nodeType === 1) {
					var nodeName = node.nodeName.toLowerCase();
					//add all atributes
	
					//var node_str = node.outerHTML.replace(node.innerHTML,'').replace(this.trimRe, '');//works with new lines and stuff?
					//rebuild node
					var collection = node.attributes;
					var node_str = "<"+nodeName;
					for(var i=0; i<collection.length; i++){
						 node_str += " "+collection[i].name + "=\"" + collection[i].value+"\"";
					}	
					node_str += ">";		
					/*
					node_match = node_str.match(this.firstNodeRe);//extract only first node
					if(node_match){
						node_str = node_match[0];
					}
					*/	
					
					//only certain nodes get indent
					var new_line = '', indent_str = '';
					if (nodeName.search(this.newLineNodeRe) === -1) {
						indent_str = '';
					}else if(hasTextChild || !nodeName.search(this.inlineNodeRe)  === -1){
						//text node
						indent_str = ''+this._indenter(level);
					}else{//inline block
						new_line = '\n';
						indent_str = ''+this._indenter(level);
					}
					
					this.html.push(indent_str+node_str);
					
					//if first child is not empty textnode, add new line
					if (!hasTextChild){
						this.html.push(new_line);
					}
					
					this._dive(node,(level + 1));
				}else if(node.nodeType === 3){
					//text nodes (only non empty)
					if(node.nodeValue.replace(this.trimRe, '').length > 0)
						this.html.push(node.nodeValue);			
				}else if(node.nodeType === 8){
					this.html.push("<!-- "+node.nodeValue.replace(this.trimRe, '')+" -->\n");//comment node
				}
	
				
				if (node.nodeType === 1) {
					var nodeName = node.nodeName.toLowerCase();
					
					//if to another level, close tag
					if (nodeName.search(this.notCloseNodesRe) === -1) {		
						if (nodeName.search(this.newLineNodeRe) === -1) {
							this.html.push('</'+nodeName+'>');	//just close tag
						}else if(hasTextChild){
							/* if has no childeren of main node, don't indent */
							this.html.push('</'+nodeName+'>\n');
						}else{
							var indent_str = this._indenter(level);
							this.html.push(indent_str+'</'+nodeName+'>\n'); //new line node (block) end tag
						}
					}
				}
				
				//move to next
				node = node.nextSibling;
			}           
		},
		/**
		*
		* @method _indenter
		* @protected
		*/			
		_indenter: function(level){
			var indent_str = '';
			for(var i=0; i < level; i++){
				indent_str = indent_str + this.indent; 
			}	
			return indent_str;
		}
	}

}, 'gallery-2013.02.13-21-08', {
    "skinnable": true,
    "requires": [
        "base",
        "editor",
        "event",
        "node",
        "panel",
        "overlay",
        "dd-drag",
        "dd-constrain",
        "uploader",
        "resize",
        "json"
    ]
});
