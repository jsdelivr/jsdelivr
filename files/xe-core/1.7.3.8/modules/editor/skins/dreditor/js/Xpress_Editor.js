// extends jQuery object
(function($){

$.extend({
	Class : function(def) {
		function c(){
			if (typeof this.$super != 'undefined') this.$super.$this = this;
			if ($.isFunction(this.$init)) this.$init.apply(this, arguments);
		}
		c.prototype = def;
		c.constructor = c;
		c.extend = Class_extend;

		return c;
	},
	$ : function(id) {
		if(typeof id == 'string') {
			if (id.substring(0,1) == '<') return $(id).get(0);
			return $('#'+id).get(0);
		} else {
			return id;
		}
	},
	fnBind : function(fn, th/* , args... */) {
		var args = $.makeArray(arguments);
		args.shift(); args.shift();

		return function() {
			var a = args.concat($.makeArray(arguments));

			return fn.apply(th, a);
		};
	}
});

$.browser.nVersion = parseFloat($.browser.version);

function Class_extend(superDef) {
	var Super = superDef.prototype;

	this.prototype.$super = {};

	function bind(fn) {
		return function() {
			return fn.apply(this.$this, arguments);
		};
	}

	for(var x in Super) {
		if (!Super.propertyIsEnumerable(x)) continue;

		if (typeof this.prototype[x] == 'undefined') this.prototype[x] = Super[x];
		this.prototype.$super[x] = $.isFunction(Super[x])?bind(Super[x]):Super[x];
	}

	return this;
}

})(jQuery);

if (typeof window.xe == 'undefined') window.xe = {};

//{
 /**
 * @fileOverview This file contains Xpress framework core
 * @name XpressCore.js
 */
xe.XpressCore = jQuery.Class({
	name : "XpressCore",

	$init : function(htOptions){
		htOptions = !htOptions?{}:jQuery.Class({}).extend({
			oDebugger : null
		}).extend(htOptions);
		if(htOptions.oDebugger){
			this.oDebugger = htOptions.oDebugger;
			this.oDebugger.oApp = this;
		}

		// To prevent processing a Xpress command before all the plugins are registered and ready,
		// Queue up all the commands here until the application's status is changed to READY
		this.commandQueue = [];

		this.oCommandMap = {};
		this.oDisabledCommand = {};
		this.aPlugins = [];

		this.appStatus = xe.APP_STATUS["NOT_READY"];

		// Register the core as a plugin so it can receive messages
		this.registerPlugin(this);
	},

	exec : function(msg, args, oEvent){
		// If the application is not yet ready just queue the command
		if(this.appStatus == xe.APP_STATUS["NOT_READY"]){
			this.commandQueue[this.commandQueue.length] = {'msg':msg, 'args':args, 'event':oEvent};
			return true;
		}

		this.exec = this._exec;
		this.exec(msg, args, oEvent);
	},

	delayedExec : function(msg, args, nDelay, oEvent){
		var fExec = jQuery.fnBind(this.exec, this, msg, args, oEvent);
		setTimeout(fExec, nDelay);
	},

	_exec : function(msg, args, oEvent){return (this._exec = this.oDebugger?this._execWithDebugger:this._execWithoutDebugger).call(this, msg, args, oEvent);},
	_execWithDebugger : function(msg, args, oEvent){this.oDebugger.log_MessageStart(msg, args);var bResult = this._doExec(msg, args, oEvent);this.oDebugger.log_MessageEnd(msg, args);return bResult;	},
	_execWithoutDebugger : function(msg, args, oEvent){return this._doExec(msg, args, oEvent);},
	_doExec : function(msg, args, oEvent){
		var bContinue = false;

		if(!this.oDisabledCommand[msg]){
			var allArgs = [];
			if(args && args.length){
				var iLen = args.length;
				for(var i=0; i<iLen; i++) allArgs[i] = args[i];
			}
			if(oEvent) allArgs[allArgs.length] = oEvent;

			var bContinue = true;
			bContinue = this._execMsgStep("BEFORE", msg, allArgs);
			if(bContinue) bContinue = this._execMsgStep("ON", msg, allArgs);
			if(bContinue) bContinue = this._execMsgStep("AFTER", msg, allArgs);
		}

		return bContinue;
	},

	registerPlugin : function(oPlugin){
		if(!oPlugin) throw("An error occured in registerPlugin(): invalid plug-in");

		oPlugin.nIdx = this.aPlugins.length;
		oPlugin.oApp = this;
		this.aPlugins[oPlugin.nIdx] = oPlugin;

		// If the plugin does not specify that it takes time to be ready, change the stauts to READY right away
		if(oPlugin.status != xe.PLUGIN_STATUS["NOT_READY"]) oPlugin.status = xe.PLUGIN_STATUS["READY"];

		this.exec("MSG_PLUGIN_REGISTERED", [oPlugin]);

		return oPlugin.nIdx;
	},

	disableCommand : function(sCommand, bDisable){this.oDisabledCommand[sCommand] = bDisable;},

	registerBrowserEvent : function(obj, sEvent, sCMD, aParams, nDelay){
		if(!obj) return;
		aParams = aParams || [];
		var func = (nDelay)?jQuery.fnBind(this.delayedExec, this, sCMD, aParams, nDelay):jQuery.fnBind(this.exec, this, sCMD, aParams);
		jQuery(obj).bind(sEvent, func);
	},

	run : function(){
		// Change the status from NOT_READY to let exec to process all the way
		this._changeAppStatus(xe.APP_STATUS["WAITING_FOR_PLUGINS_READY"]);

		// Process all the commands in the queue
		var iQueueLength = this.commandQueue.length;
		for(i=0; i<iQueueLength; i++){
			var curMsgAndArgs = this.commandQueue[i];
			this.exec(curMsgAndArgs.msg, curMsgAndArgs.args, curMsgAndArgs.event);
		}

		this._waitForPluginReady();
	},

	// Use this also to update the mapping
	createCommandMap : function(sMsgHandler){
		this.oCommandMap[sMsgHandler] = [];

		var nLen = this.aPlugins.length;
		for(var i=0; i<nLen; i++) this._doAddToCommandMap(sMsgHandler, this.aPlugins[i]);
	},

	addToCommandMap : function(sMsgHandler, oPlugin){
		// cannot "ADD" unless the map is already created.
		// the message will be added automatically to the mapping when it is first passed anyways, so do not add now
		if(!this.oCommandMap[sMsgHandler]) return;

		this._addToCommandMap(sMsgHandler, oPlugin);
	},

	_changeAppStatus : function(appStatus){
		this.appStatus = appStatus;

		// Initiate MSG_APP_READY if the application's status is being switched to READY
		if(this.appStatus == xe.APP_STATUS["READY"]) this.exec("MSG_APP_READY");
	},

	_execMsgStep : function(sMsgStep, sMsg, args){return (this._execMsgStep = this.oDebugger?this._execMsgStepWithDebugger:this._execMsgStepWithoutDebugger).call(this, sMsgStep, sMsg, args);},
	_execMsgStepWithDebugger : function(sMsgStep, sMsg, args){this.oDebugger.log_MessageStepStart(sMsgStep, sMsg, args);var bStatus = this._execMsgHandler ("$"+sMsgStep+"_"+sMsg, args);this.oDebugger.log_MessageStepEnd(sMsgStep, sMsg, args);return bStatus;},
	_execMsgStepWithoutDebugger : function(sMsgStep, sMsg, args){return this._execMsgHandler ("$"+sMsgStep+"_"+sMsg, args);},
	_execMsgHandler : function(sMsgHandler, args){
		if(!this.oCommandMap[sMsgHandler]){
			this.createCommandMap(sMsgHandler);
		}

		var aPlugins = this.oCommandMap[sMsgHandler];
		var iNumOfPlugins = aPlugins.length;

		if(iNumOfPlugins == 0) return true;

		var tmpStatus, bResult = true;
		// two similar codes were written twice due to the performace.
		if(sMsgHandler.match(/^\$(BEFORE|ON|AFTER)_MSG_APP_READY$/)){
			for(var i=0; i<iNumOfPlugins; i++){
				tmpStatus = this._execHandler(aPlugins[i], sMsgHandler, args);
				if(tmpStatus === false){
					bResult = false;
					break;
				}
			}
		}else{
			for(var i=0; i<iNumOfPlugins; i++){
				if(typeof aPlugins[i]["$PRECONDITION"] == "function") if(!this._execHandler(aPlugins[i], "$PRECONDITION", [sMsgHandler, args])) continue;

				tmpStatus = this._execHandler(aPlugins[i], sMsgHandler, args);
				if(tmpStatus === false){
					bResult = false;
					break;
				}
			}
		}

		return bResult;
	},

	_execHandler : function(oPlugin, sHandler, args){return	(this._execHandler = this.oDebugger?this._execHandlerWithDebugger:this._execHandlerWithoutDebugger).call(this, oPlugin, sHandler, args);},
	_execHandlerWithDebugger : function(oPlugin, sHandler, args){this.oDebugger.log_CallHandlerStart(oPlugin, sHandler, args);var bResult = oPlugin[sHandler].apply(oPlugin, args);this.oDebugger.log_CallHandlerEnd(oPlugin, sHandler, args);return bResult;},
	_execHandlerWithoutDebugger : function(oPlugin, sHandler, args){return oPlugin[sHandler].apply(oPlugin, args);},

	_doAddToCommandMap : function(sMsgHandler, oPlugin){
		if(typeof oPlugin[sMsgHandler] != "function") return;
		this.oCommandMap[sMsgHandler][this.oCommandMap[sMsgHandler].length] = oPlugin;
	},

	_waitForPluginReady : function(){
		var bAllReady = true;
		for(var i=0; i<this.aPlugins.length; i++){
			if(this.aPlugins[i].status == xe.PLUGIN_STATUS["NOT_READY"]){
				bAllReady = false;
				break;
			}
		}
		if(bAllReady){
			this._changeAppStatus(xe.APP_STATUS["READY"]);
		}else{
			setTimeout(jQuery.fnBind(this._waitForPluginReady, this), 100);
		}
	}
});
//}

xe.APP_STATUS = {
	'NOT_READY' : 0,
	'WAITING_FOR_PLUGINS_READY' : 1,
	'READY' : 2
};

xe.PLUGIN_STATUS = {
	'NOT_READY' : 0,
	'READY' : 1
};
/**
 * @fileOverview This file contains a cross-browser implementation of W3C's DOM Range
 * @name W3CDOMRange.js
 */
xe.W3CDOMRange = jQuery.Class({
	$init : function(doc){
		this._document = doc || document;

		this.collapsed = true;
		this.commonAncestorContainer = this._document.body;
		this.endContainer = this._document.body;
		this.endOffset = 0;
		this.startContainer = this._document.body;
		this.startOffset = 0;
	},

	cloneContents : function(){
		var oClonedContents = this._document.createDocumentFragment();
		var oTmpContainer = this._document.createDocumentFragment();

		var aNodes = this._getNodesInRange();

		if(aNodes.length < 1) return oClonedContents;

		var oClonedContainers = this._constructClonedTree(aNodes, oTmpContainer);

		// oTopContainer = aNodes[aNodes.length-1].parentNode and this is not part of the initial array and only those child nodes should be cloned
		var oTopContainer = oTmpContainer.firstChild;

		if(oTopContainer){
			var elCurNode = oTopContainer.firstChild;
			var elNextNode;

			while(elCurNode){
				elNextNode = elCurNode.nextSibling;
				oClonedContents.appendChild(elCurNode);
				elCurNode = elNextNode;
			}
		}

		oClonedContainers = this._splitTextEndNodes({oStartContainer: oClonedContainers.oStartContainer, iStartOffset: this.startOffset,
													oEndContainer: oClonedContainers.oEndContainer, iEndOffset: this.endOffset});

		if(oClonedContainers.oStartContainer && oClonedContainers.oStartContainer.previousSibling)
			xe.DOMFix.parentNode(oClonedContainers.oStartContainer).removeChild(oClonedContainers.oStartContainer.previousSibling);

		if(oClonedContainers.oEndContainer && oClonedContainers.oEndContainer.nextSibling)
			xe.DOMFix.parentNode(oClonedContainers.oEndContainer).removeChild(oClonedContainers.oEndContainer.nextSibling);

		return oClonedContents;
	},

	_constructClonedTree : function(aNodes, oClonedParentNode){
		var oClonedStartContainer = null;
		var oClonedEndContainer = null;

		var oStartContainer = this.startContainer;
		var oEndContainer = this.endContainer;

		_recurConstructClonedTree = function(aAllNodes, iCurIdx, oParentNode, oClonedParentNode){

			if(iCurIdx < 0) return iCurIdx;

			var iChildIdx = iCurIdx-1;

			var oCurNodeCloneWithChildren = aAllNodes[iCurIdx].cloneNode(false);

			if(aAllNodes[iCurIdx] == oStartContainer) oClonedStartContainer = oCurNodeCloneWithChildren;
			if(aAllNodes[iCurIdx] == oEndContainer) oClonedEndContainer = oCurNodeCloneWithChildren;

			while(iChildIdx >= 0 && xe.DOMFix.parentNode(aAllNodes[iChildIdx]) == aAllNodes[iCurIdx]){
				iChildIdx = this._recurConstructClonedTree(aAllNodes, iChildIdx, aAllNodes[iCurIdx], oCurNodeCloneWithChildren, oClonedStartContainer, oClonedEndContainer);
			}

			// this may trigger an error message in IE when an erroneous script is inserted
			oClonedParentNode.insertBefore(oCurNodeCloneWithChildren, oClonedParentNode.firstChild);

			return iChildIdx;
		};

		aNodes[aNodes.length] = xe.DOMFix.parentNode(aNodes[aNodes.length-1]);
		_recurConstructClonedTree(aNodes, aNodes.length-1, aNodes[aNodes.length-1], oClonedParentNode);

		return {oStartContainer: oClonedStartContainer, oEndContainer: oClonedEndContainer};
	},

	cloneRange : function(){
		return this._copyRange(new xe.W3CDOMRange(this._document));
	},

	_copyRange : function(oClonedRange){
		oClonedRange.collapsed = this.collapsed;
		oClonedRange.commonAncestorContainer = this.commonAncestorContainer;
		oClonedRange.endContainer = this.endContainer;
		oClonedRange.endOffset = this.endOffset;
		oClonedRange.startContainer = this.startContainer;
		oClonedRange.startOffset = this.startOffset;
		oClonedRange._document = this._document;

		return oClonedRange;
	},

	collapse : function(toStart){
		if(toStart){
			this.endContainer = this.startContainer;
			this.endOffset = this.startOffset;
		}else{
			this.startContainer = this.endContainer;
			this.startOffset = this.endOffset;
		}

		this._updateRangeInfo();
	},

	compareBoundaryPoints : function(how, sourceRange){
		switch(how){
			case xe.W3CDOMRange.START_TO_START:
				return this._compareEndPoint(this.startContainer, this.startOffset, sourceRange.startContainer, sourceRange.startOffset);
			case xe.W3CDOMRange.START_TO_END:
				return this._compareEndPoint(this.endContainer, this.endOffset, sourceRange.startContainer, sourceRange.startOffset);
			case xe.W3CDOMRange.END_TO_END:
				return this._compareEndPoint(this.endContainer, this.endOffset, sourceRange.endContainer, sourceRange.endOffset);
			case xe.W3CDOMRange.END_TO_START:
				return this._compareEndPoint(this.startContainer, this.startOffset, sourceRange.endContainer, sourceRange.endOffset);
		}
	},

	_findBody : function(oNode){
		if(!oNode) return null;
		while(oNode){
			if(oNode.tagName == "BODY") return oNode;
			oNode = xe.DOMFix.parentNode(oNode);
		}
		return null;
	},

	_compareEndPoint : function(oContainerA, iOffsetA, oContainerB, iOffsetB){
		var iIdxA, iIdxB;

		if(!oContainerA || this._findBody(oContainerA) != this._document.body){
			oContainerA = this._document.body;
			iOffsetA = 0;
		}

		if(!oContainerB || this._findBody(oContainerB) != this._document.body){
			oContainerB = this._document.body;
			iOffsetB = 0;
		}

		var compareIdx = function(iIdxA, iIdxB){
			// iIdxX == -1 when the node is the commonAncestorNode
			// if iIdxA == -1
			// -> [[<nodeA>...<nodeB></nodeB>]]...</nodeA>
			// if iIdxB == -1
			// -> <nodeB>...[[<nodeA></nodeA>...</nodeB>]]
			if(iIdxB == -1) iIdxB = iIdxA+1;
			if(iIdxA < iIdxB) return -1;
			if(iIdxA == iIdxB) return 0;
			return 1;
		};

		var oCommonAncestor = this._getCommonAncestorContainer(oContainerA, oContainerB);

		// ================================================================================================================================================
		//  Move up both containers so that both containers are direct child nodes of the common ancestor node. From there, just compare the offset
		// Add 0.5 for each contaienrs that has "moved up" since the actual node is wrapped by 1 or more parent nodes and therefore its position is somewhere between idx & idx+1
		// <COMMON_ANCESTOR>NODE1<P>NODE2</P>NODE3</COMMON_ANCESTOR>
		// The position of NODE2 in COMMON_ANCESTOR is somewhere between after NODE1(idx1) and before NODE3(idx2), so we let that be 1.5

		// container node A in common ancestor container
		var oNodeA = oContainerA;
		if(oNodeA != oCommonAncestor){
			while((oTmpNode = xe.DOMFix.parentNode(oNodeA)) != oCommonAncestor){oNodeA = oTmpNode;}

			iIdxA = this._getPosIdx(oNodeA)+0.5;
		}else iIdxA = iOffsetA;

		// container node B in common ancestor container
		var oNodeB = oContainerB;
		if(oNodeB != oCommonAncestor){
			while((oTmpNode = xe.DOMFix.parentNode(oNodeB)) != oCommonAncestor){oNodeB = oTmpNode;}

			iIdxB = this._getPosIdx(oNodeB)+0.5;
		}else iIdxB = iOffsetB;

		return compareIdx(iIdxA, iIdxB);
	},

	_getCommonAncestorContainer : function(oNode1, oNode2){
		var oComparingNode = oNode2;

		while(oNode1){
			while(oComparingNode){
				if(oNode1 == oComparingNode) return oNode1;
				oComparingNode = xe.DOMFix.parentNode(oComparingNode);
			}
			oComparingNode = oNode2;
			oNode1 = xe.DOMFix.parentNode(oNode1);
		}

		return this._document.body;
	},

	deleteContents : function(){
		if(this.collapsed) return;

		this._splitTextEndNodesOfTheRange();

		var aNodes = this._getNodesInRange();

		if(aNodes.length < 1) return;

		var oPrevNode = aNodes[0].previousSibling;
		while(oPrevNode && this._isBlankTextNode(oPrevNode)) oPrevNode = oPrevNode.previousSibling;

		var oNewStartContainer, iNewOffset;
		if(!oPrevNode){
			oNewStartContainer = xe.DOMFix.parentNode(aNodes[0]);
			iNewOffset = 0;
		}

		for(var i=0; i<aNodes.length; i++){
			var oNode = aNodes[i];
			if(!oNode.firstChild){
				if(oNewStartContainer == oNode){
					iNewOffset = this._getPosIdx(oNewStartContainer);
					oNewStartContainer = xe.DOMFix.parentNode(oNode);
				}
				xe.DOMFix.parentNode(oNode).removeChild(oNode);
			}
		}

		if(!oPrevNode){
			this.setStart(oNewStartContainer, iNewOffset);
		}else{
			if(oPrevNode.tagName == "BODY")
				this.setStartBefore(oPrevNode);
			else
				this.setStartAfter(oPrevNode);
		}

		this.collapse(true);
	},

	extractContents : function(){
		var oClonedContents = this.cloneContents();
		this.deleteContents();
		return oClonedContents;
	},

	insertNode : function(newNode){
		var oFirstNode = null;

		var oParentContainer;

		if(this.startContainer.nodeType == "3"){
			oParentContainer = xe.DOMFix.parentNode(this.startContainer);
			if(this.startContainer.nodeValue.length <= this.startOffset)
				oFirstNode = this.startContainer.nextSibling;
			else
				oFirstNode = this.startContainer.splitText(this.startOffset);
		}else{
			oParentContainer = this.startContainer;
			oFirstNode = xe.DOMFix.childNodes(this.startContainer)[this.startOffset];
		}

		if(!oFirstNode || !xe.DOMFix.parentNode(oFirstNode)) oFirstNode = null;

		oParentContainer.insertBefore(newNode, oFirstNode);

		this.setStartBefore(newNode);
	},

	selectNode : function(refNode){
		this.setStartBefore(refNode);
		this.setEndAfter(refNode);
	},

	selectNodeContents : function(refNode){
		this.setStart(refNode, 0);
		this.setEnd(refNode, xe.DOMFix.childNodes(refNode).length);
	},

	_endsNodeValidation : function(oNode, iOffset){
		if(!oNode || this._findBody(oNode) != this._document.body) throw new Error("INVALID_NODE_TYPE_ERR oNode is not part of current document");

		if(oNode.nodeType == 3){
			if(iOffset > oNode.nodeValue.length) iOffset = oNode.nodeValue.length;
		}else{
			if(iOffset > xe.DOMFix.childNodes(oNode).length) iOffset = xe.DOMFix.childNodes(oNode).length;
		}

		return iOffset;
	},


	setEnd : function(refNode, offset){
		offset = this._endsNodeValidation(refNode, offset);

		this.endContainer = refNode;
		this.endOffset = offset;
		if(!this.startContainer || this._compareEndPoint(this.startContainer, this.startOffset, this.endContainer, this.endOffset) != -1) this.collapse(false);

		this._updateRangeInfo();
	},

	setEndAfter : function(refNode){
		if(!refNode) throw new Error("INVALID_NODE_TYPE_ERR in setEndAfter");

		if(refNode.tagName == "BODY"){
			this.setEnd(refNode, xe.DOMFix.childNodes(refNode).length);
			return;
		}
		this.setEnd(xe.DOMFix.parentNode(refNode), this._getPosIdx(refNode)+1);
	},

	setEndBefore : function(refNode){
		if(!refNode) throw new Error("INVALID_NODE_TYPE_ERR in setEndBefore");

		if(refNode.tagName == "BODY"){
			this.setEnd(refNode, 0);
			return;
		}

		this.setEnd(xe.DOMFix.parentNode(refNode), this._getPosIdx(refNode));
	},

	setStart : function(refNode, offset){
		offset = this._endsNodeValidation(refNode, offset);

		this.startContainer = refNode;
		this.startOffset = offset;

		if(!this.endContainer || this._compareEndPoint(this.startContainer, this.startOffset, this.endContainer, this.endOffset) != -1) this.collapse(true);
		this._updateRangeInfo();
	},

	setStartAfter : function(refNode){
		if(!refNode) throw new Error("INVALID_NODE_TYPE_ERR in setStartAfter");

		if(refNode.tagName == "BODY"){
			this.setStart(refNode, xe.DOMFix.childNodes(refNode).length);
			return;
		}

		this.setStart(xe.DOMFix.parentNode(refNode), this._getPosIdx(refNode)+1);
	},

	setStartBefore : function(refNode){
		if(!refNode) throw new Error("INVALID_NODE_TYPE_ERR in setStartBefore");

		if(refNode.tagName == "BODY"){
			this.setStart(refNode, 0);
			return;
		}
		this.setStart(xe.DOMFix.parentNode(refNode), this._getPosIdx(refNode));
	},

	surroundContents : function(newParent){
		newParent.appendChild(this.extractContents());
		this.insertNode(newParent);
		this.selectNode(newParent);
	},

	toString : function(){
		var oTmpContainer = this._document.createElement("DIV");
		oTmpContainer.appendChild(this.cloneContents());

		return oTmpContainer.textContent || oTmpContainer.innerText || "";
	},

	_isBlankTextNode : function(oNode){
		if(oNode.nodeType == 3 && oNode.nodeValue == "") return true;
		return false;
	},

	_getPosIdx : function(refNode){
		var idx = 0;
		for(var node = refNode.previousSibling; node; node = node.previousSibling) idx++;

		return idx;
	},

	_updateRangeInfo : function(){
		if(!this.startContainer){
			this.init(this._document);
			return;
		}

		this.collapsed = this._isCollapsed(this.startContainer, this.startOffset, this.endContainer, this.endOffset);

		this.commonAncestorContainer = this._getCommonAncestorContainer(this.startContainer, this.endContainer);
	},

	_isCollapsed : function(oStartContainer, iStartOffset, oEndContainer, iEndOffset){
		var bCollapsed = false;

		if(oStartContainer == oEndContainer && iStartOffset == iEndOffset){
			bCollapsed = true;
		}else{
			var oActualStartNode = this._getActualStartNode(oStartContainer, iStartOffset);
			var oActualEndNode = this._getActualEndNode(oEndContainer, iEndOffset);

			// Take the parent nodes on the same level for easier comparison when they're next to each other
			// eg) From
			//	<A>
			//		<B>
			//			<C>
			//			</C>
			//		</B>
			//		<D>
			//			<E>
			//				<F>
			//				</F>
			//			</E>
			//		</D>
			//	</A>
			//	, it's easier to compare the position of B and D rather than C and F because they are siblings
			//
			// If the range were collapsed, oActualEndNode will precede oActualStartNode by doing this
			oActualStartNode = this._getNextNode(this._getPrevNode(oActualStartNode));
			oActualEndNode = this._getPrevNode(this._getNextNode(oActualEndNode));

			if(oActualStartNode && oActualEndNode && oActualEndNode.tagName != "BODY" &&
				(this._getNextNode(oActualEndNode) == oActualStartNode || (oActualEndNode == oActualStartNode && this._isBlankTextNode(oActualEndNode)))
			)
				bCollapsed = true;
		}

		return bCollapsed;
	},

	_splitTextEndNodesOfTheRange : function(){
		var oEndPoints = this._splitTextEndNodes({oStartContainer: this.startContainer, iStartOffset: this.startOffset,
													oEndContainer: this.endContainer, iEndOffset: this.endOffset});

		this.startContainer = oEndPoints.oStartContainer;
		this.startOffset = oEndPoints.iStartOffset;

		this.endContainer = oEndPoints.oEndContainer;
		this.endOffset = oEndPoints.iEndOffset;
	},

	_splitTextEndNodes : function(oEndPoints){
		oEndPoints = this._splitStartTextNode(oEndPoints);
		oEndPoints = this._splitEndTextNode(oEndPoints);

		return oEndPoints;
	},

	_splitStartTextNode : function(oEndPoints){
		var oStartContainer = oEndPoints.oStartContainer;
		var iStartOffset = oEndPoints.iStartOffset;

		var oEndContainer = oEndPoints.oEndContainer;
		var iEndOffset = oEndPoints.iEndOffset;

		if(!oStartContainer) return oEndPoints;
		if(oStartContainer.nodeType != 3) return oEndPoints;
		if(iStartOffset == 0) return oEndPoints;

		if(oStartContainer.nodeValue.length <= iStartOffset) return oEndPoints;

		var oLastPart = oStartContainer.splitText(iStartOffset);

		if(oStartContainer == oEndContainer){
			iEndOffset -= iStartOffset;
			oEndContainer = oLastPart;
		}
		oStartContainer = oLastPart;
		iStartOffset = 0;

		return {oStartContainer: oStartContainer, iStartOffset: iStartOffset, oEndContainer: oEndContainer, iEndOffset: iEndOffset};
	},

	_splitEndTextNode : function(oEndPoints){
		var oStartContainer = oEndPoints.oStartContainer;
		var iStartOffset = oEndPoints.iStartOffset;

		var oEndContainer = oEndPoints.oEndContainer;
		var iEndOffset = oEndPoints.iEndOffset;

		if(!oEndContainer) return oEndPoints;
		if(oEndContainer.nodeType != 3) return oEndPoints;

		if(iEndOffset >= oEndContainer.nodeValue.length) return oEndPoints;
		if(iEndOffset == 0) return oEndPoints;

		oEndContainer.splitText(iEndOffset);

		return {oStartContainer: oStartContainer, iStartOffset: iStartOffset, oEndContainer: oEndContainer, iEndOffset: iEndOffset};
	},

	_getNodesInRange : function(){
		if(this.collapsed) return [];

		var oStartNode = this._getActualStartNode(this.startContainer, this.startOffset);
		var oEndNode = this._getActualEndNode(this.endContainer, this.endOffset);

		return this._getNodesBetween(oStartNode, oEndNode);
	},

	_getActualStartNode : function(oStartContainer, iStartOffset){
		var oStartNode = oStartContainer;;

		if(oStartContainer.nodeType == 3){
			if(iStartOffset >= oStartContainer.nodeValue.length){
				oStartNode = this._getNextNode(oStartContainer);
				if(oStartNode.tagName == "BODY") oStartNode = null;
			}else{
				oStartNode = oStartContainer;
			}
		}else{
			if(iStartOffset < xe.DOMFix.childNodes(oStartContainer).length){
				oStartNode = xe.DOMFix.childNodes(oStartContainer)[iStartOffset];
			}else{
				oStartNode = this._getNextNode(oStartContainer);
				if(oStartNode.tagName == "BODY") oStartNode = null;
			}
		}

		return oStartNode;
	},

	_getActualEndNode : function(oEndContainer, iEndOffset){
		var oEndNode = oEndContainer;

		if(iEndOffset == 0){
			oEndNode = this._getPrevNode(oEndContainer);
			if(oEndNode.tagName == "BODY") oEndNode = null;
		}else if(oEndContainer.nodeType == 3){
			oEndNode = oEndContainer;
		}else{
			oEndNode = xe.DOMFix.childNodes(oEndContainer)[iEndOffset-1];
		}

		return oEndNode;
	},

	_getNextNode : function(oNode){
		if(!oNode || oNode.tagName == "BODY") return this._document.body;

		if(oNode.nextSibling) return oNode.nextSibling;

		return this._getNextNode(xe.DOMFix.parentNode(oNode));
	},

	_getPrevNode : function(oNode){
		if(!oNode || oNode.tagName == "BODY") return this._document.body;

		if(oNode.previousSibling) return oNode.previousSibling;

		return this._getPrevNode(xe.DOMFix.parentNode(oNode));
	},

	// includes partially selected
	// for <div id="a"><div id="b"></div></div><div id="c"></div>, _getNodesBetween(b, c) will yield to b, "a" and c
	_getNodesBetween : function(oStartNode, oEndNode){
		var aNodesBetween = [];

		if(!oStartNode || !oEndNode) return aNodesBetween;

		this._recurGetNextNodesUntil(oStartNode, oEndNode, aNodesBetween);
		return aNodesBetween;
	},

	_recurGetNextNodesUntil : function(oNode, oEndNode, aNodesBetween){
		if(!oNode) return false;

		if(!this._recurGetChildNodesUntil(oNode, oEndNode, aNodesBetween)) return false;

		var oNextToChk = oNode.nextSibling;

		while(!oNextToChk){
			if(!xe.DOMFix.parentNode(oNode)) return false;
			oNode = xe.DOMFix.parentNode(oNode);

			aNodesBetween[aNodesBetween.length] = oNode;

			if(oNode == oEndNode) return false;

			oNextToChk = oNode.nextSibling;
		}

		return this._recurGetNextNodesUntil(oNextToChk, oEndNode, aNodesBetween);
	},

	_recurGetChildNodesUntil : function(oNode, oEndNode, aNodesBetween){
		if(!oNode) return false;

		var bEndFound = false;
		var oCurNode = oNode;
		if(oCurNode.firstChild){
			oCurNode = oCurNode.firstChild;
			while(oCurNode){
				if(!this._recurGetChildNodesUntil(oCurNode, oEndNode, aNodesBetween)){
					bEndFound = true;
					break;
				}
				oCurNode = oCurNode.nextSibling;
			}
		}

		aNodesBetween[aNodesBetween.length] = oNode;

		if(bEndFound) return false;
		if(oNode == oEndNode) return false;

		return true;
	}
});

xe.W3CDOMRange.START_TO_START = 0;
xe.W3CDOMRange.START_TO_END = 1;
xe.W3CDOMRange.END_TO_END = 2;
xe.W3CDOMRange.END_TO_START = 3;


/**
 * @fileOverview This file contains a cross-browser function that implements all of the W3C's DOM Range specification and some more
 * @name XpressRange.js
 */
xe.XpressRange = jQuery.Class({
	setWindow : function(win){
		this._window = win;
		this._document = win.document;
	},

	$init : function(win){
		this.HUSKY_BOOMARK_START_ID_PREFIX = "xpress_bookmark_start_";
		this.HUSKY_BOOMARK_END_ID_PREFIX = "xpress_bookmark_end_";

		this.sBlockElement = "P|DIV|LI|H[1-6]|PRE";
		this.sBlockContainer = "BODY|TABLE|TH|TR|TD|UL|OL|BLOCKQUOTE|FORM";

		this.rxBlockElement = new RegExp("^("+this.sBlockElement+")$");
		this.rxBlockContainer = new RegExp("^("+this.sBlockContainer+")$")
		this.rxLineBreaker = new RegExp("^("+this.sBlockElement+"|"+this.sBlockContainer+")$")

		this.setWindow(win);

		this.oSimpleSelection = new xe.SimpleSelection(this._window);
		this.selectionLoaded = this.oSimpleSelection.selectionLoaded;

		this.$super.$init(this._document);
	},

	select : function(){
		this.oSimpleSelection.selectRange(this);
	},

	setFromSelection : function(iNum){
		this.setRange(this.oSimpleSelection.getRangeAt(iNum));
	},

	setRange : function(oW3CRange){
		this.setStart(oW3CRange.startContainer, oW3CRange.startOffset);
		this.setEnd(oW3CRange.endContainer, oW3CRange.endOffset);
	},

	setEndNodes : function(oSNode, oENode){
		this.setEndAfter(oENode);
		this.setStartBefore(oSNode);
	},

	splitTextAtBothEnds : function(){
		this._splitTextEndNodesOfTheRange();
	},

	getStartNode : function(){
		if(this.collapsed){
			if(this.startContainer.nodeType == 3){
				if(this.startOffset == 0) return null;
				if(this.startContainer.nodeValue.length <= this.startOffset) return null;
				return this.startContainer;
			}
			return null;
		}

		if(this.startContainer.nodeType == 3){
			if(this.startOffset >= this.startContainer.nodeValue.length) return this._getNextNode(this.startContainer);
			return this.startContainer;
		}else{
			if(this.startOffset >= xe.DOMFix.childNodes(this.startContainer).length) return this._getNextNode(this.startContainer);
			return xe.DOMFix.childNodes(this.startContainer)[this.startOffset];
		}
	},

	getEndNode : function(){
		if(this.collapsed) return this.getStartNode();

		if(this.endContainer.nodeType == 3){
			if(this.endOffset == 0) return this._getPrevNode(this.endContainer);
			return this.endContainer;
		}else{
			if(this.endOffset == 0) return this._getPrevNode(this.endContainer);
			return xe.DOMFix.childNodes(this.endContainer)[this.endOffset-1];
		}
	},

	getNodeAroundRange : function(bBefore, bStrict){
		if(this.collapsed && this.startContainer && this.startContainer.nodeType == 3) return this.startContainer;
		if(!this.collapsed || (this.startContainer && this.startContainer.nodeType == 3)) return this.getStartNode();

		var oBeforeRange, oAfterRange, oResult;

		if(this.startOffset >= xe.DOMFix.childNodes(this.startContainer).length)
			oAfterRange = this._getNextNode(this.startContainer);
		else
			oAfterRange = xe.DOMFix.childNodes(this.startContainer)[this.startOffset];

		if(this.endOffset == 0)
			oBeforeRange = this._getPrevNode(this.endContainer);
		else
			oBeforeRange = xe.DOMFix.childNodes(this.endContainer)[this.endOffset-1];

		if(bBefore){
			oResult = oBeforeRange;
			if(!oResult && !bStrict) oResult = oAfterRange;
		}else{
			oResult = oAfterRange;
			if(!oResult && !bStrict) oResult = oBeforeRange;
		}

		return oResult;
	},

	_getXPath : function(elNode){
		var sXPath = "";

		while(elNode && elNode.nodeType == 1){
			sXPath = "/" + elNode.tagName+"["+this._getPosIdx4XPath(elNode)+"]" + sXPath;
			elNode = xe.DOMFix.parentNode(elNode);
		}

		return sXPath;
	},

	_getPosIdx4XPath : function(refNode){
		var idx = 0;
		for(var node = refNode.previousSibling; node; node = node.previousSibling)
			if(node.tagName == refNode.tagName) idx++;

		return idx;
	},

	// this was written specifically for XPath Bookmark and it may not perform correctly for general purposes
	_evaluateXPath : function(sXPath, oDoc){
		sXPath = sXPath.substring(1, sXPath.length-1);
		var aXPath = sXPath.split(/\//);
		var elNode = oDoc.body;

		for(var i=2; i<aXPath.length && elNode; i++){
			aXPath[i].match(/([^\[]+)\[(\d+)/i);
			var sTagName = RegExp.$1;
			var nIdx = RegExp.$2;

			var aAllNodes = xe.DOMFix.childNodes(elNode);
			var aNodes = [];
			var nLength = aAllNodes.length;
			var nCount = 0;
			for(var ii=0; ii<nLength; ii++){
				if(aAllNodes[ii].tagName == sTagName) aNodes[nCount++] = aAllNodes[ii];
			}

			if(aNodes.length < nIdx)
				elNode = null;
			else
				elNode = aNodes[nIdx];
		}

		return elNode;
	},

	_evaluateXPathBookmark : function(oBookmark){
		var sXPath = oBookmark["sXPath"];
		var nTextNodeIdx = oBookmark["nTextNodeIdx"];
		var nOffset = oBookmark["nOffset"];

		var elContainer = this._evaluateXPath(sXPath, this._document);

		if(nTextNodeIdx > -1 && elContainer){
			var aChildNodes = xe.DOMFix.childNodes(elContainer);
			var elNode = null;

			var nIdx = nTextNodeIdx;
			var nOffsetLeft = nOffset;

			while((elNode = aChildNodes[nIdx]) && elNode.nodeType == 3 && elNode.nodeValue.length < nOffsetLeft){
				nOffsetLeft -= elNode.nodeValue.length;
				nIdx++;
			}

			elContainer = xe.DOMFix.childNodes(elContainer)[nIdx];
			nOffset = nOffsetLeft;
		}

		if(!elContainer){
			elContainer = this._document.body;
			nOffset = 0;
		}
		return {elContainer: elContainer, nOffset: nOffset};
	},

	// this was written specifically for XPath Bookmark and it may not perform correctly for general purposes
	getXPathBookmark : function(){
		var nTextNodeIdx1 = -1;
		var htEndPt1 = {elContainer: this.startContainer, nOffset: this.startOffset};
		var elNode1 = this.startContainer;
		if(elNode1.nodeType == 3){
			htEndPt1 = this._getFixedStartTextNode();
			nTextNodeIdx1 = this._getPosIdx(htEndPt1.elContainer);
			elNode1 = xe.DOMFix.parentNode(elNode1);
		}
		var sXPathNode1 = this._getXPath(elNode1);
		var oBookmark1 = {sXPath:sXPathNode1, nTextNodeIdx:nTextNodeIdx1, nOffset: htEndPt1.nOffset};

		var nTextNodeIdx2 = -1;
		var htEndPt2 = {elContainer: this.endContainer, nOffset: this.endOffset};
		var elNode2 = this.endContainer;
		if(elNode2.nodeType == 3){
			htEndPt2 = this._getFixedEndTextNode();
			nTextNodeIdx2 = this._getPosIdx(htEndPt2.elContainer);
			elNode2 = xe.DOMFix.parentNode(elNode2);
		}
		var sXPathNode2 = this._getXPath(elNode2);
		var oBookmark2 = {sXPath:sXPathNode2, nTextNodeIdx:nTextNodeIdx2, nOffset: htEndPt2.nOffset};

		return [oBookmark1, oBookmark2];
	},

	moveToXPathBookmark : function(aBookmark){
		if(!aBookmark) return;

		var oBookmarkInfo1 = this._evaluateXPathBookmark(aBookmark[0]);
		var oBookmarkInfo2 = this._evaluateXPathBookmark(aBookmark[1]);

		if(!oBookmarkInfo1["elContainer"] || !oBookmarkInfo2["elContainer"]) return;

		this.startContainer = oBookmarkInfo1["elContainer"];
		this.startOffset = oBookmarkInfo1["nOffset"];

		this.endContainer = oBookmarkInfo2["elContainer"];
		this.endOffset = oBookmarkInfo2["nOffset"];
	},

	_getFixedTextContainer : function(elNode, nOffset){
		while(elNode && elNode.nodeType == 3 && elNode.previousSibling && elNode.previousSibling.nodeType == 3){
			nOffset += elNode.previousSibling.nodeValue.length;
			elNode = elNode.previousSibling;
		}

		return {elContainer:elNode, nOffset:nOffset};
	},

	_getFixedStartTextNode : function(){
		return this._getFixedTextContainer(this.startContainer, this.startOffset);
	},

	_getFixedEndTextNode : function(){
		return this._getFixedTextContainer(this.endContainer, this.endOffset);
	},

	placeStringBookmark : function(){
		var sTmpId = (new Date()).getTime();

		var oInsertionPoint = this.cloneRange();
		oInsertionPoint.collapseToEnd();
		var oEndMarker = this._document.createElement("A");
		oEndMarker.id = this.HUSKY_BOOMARK_END_ID_PREFIX+sTmpId;
		oInsertionPoint.insertNode(oEndMarker);

		var oInsertionPoint = this.cloneRange();
		oInsertionPoint.collapseToStart();
		var oStartMarker = this._document.createElement("A");
		oStartMarker.id = this.HUSKY_BOOMARK_START_ID_PREFIX+sTmpId;
		oInsertionPoint.insertNode(oStartMarker);

		this.moveToBookmark(sTmpId);

		return sTmpId;
	},

	cloneRange : function(){
		return this._copyRange(new xe.XpressRange(this._window));
	},

	moveToBookmark : function(vBookmark){
		if(typeof(vBookmark) != "object")
			this.moveToStringBookmark(vBookmark);
		else
			this.moveToXPathBookmark(vBookmark);
	},

	moveToStringBookmark : function(sBookmarkID){
		var oStartMarker = this._document.getElementById(this.HUSKY_BOOMARK_START_ID_PREFIX+sBookmarkID);
		var oEndMarker = this._document.getElementById(this.HUSKY_BOOMARK_END_ID_PREFIX+sBookmarkID);

		if(!oStartMarker || !oEndMarker) return;

		this.setEndBefore(oEndMarker);
		this.setStartAfter(oStartMarker);
	},

	removeStringBookmark : function(sBookmarkID){
		var oStartMarker = this._document.getElementById(this.HUSKY_BOOMARK_START_ID_PREFIX+sBookmarkID);
		var oEndMarker = this._document.getElementById(this.HUSKY_BOOMARK_END_ID_PREFIX+sBookmarkID);

		if(oStartMarker) xe.DOMFix.parentNode(oStartMarker).removeChild(oStartMarker);
		if(oEndMarker) xe.DOMFix.parentNode(oEndMarker).removeChild(oEndMarker);
	},

	collapseToStart : function(){
		this.collapse(true);
	},

	collapseToEnd : function(){
		this.collapse(false);
	},

	createAndInsertNode : function(sTagName){
		tmpNode = this._document.createElement(tagName);
		this.insertNode(tmpNode)
		return tmpNode
	},

	getNodes : function(bSplitTextEndNodes, fnFilter){
		if(bSplitTextEndNodes) this._splitTextEndNodesOfTheRange();

		var aAllNodes = this._getNodesInRange();
		var aFilteredNodes = [];

		if(!fnFilter) return aAllNodes;

		for(var i=0; i<aAllNodes.length; i++)
			if(fnFilter(aAllNodes[i])) aFilteredNodes[aFilteredNodes.length] = aAllNodes[i];

		return aFilteredNodes;
	},

	getTextNodes : function(bSplitTextEndNodes){
		var txtFilter = function(oNode){
			if (oNode.nodeType == 3 && oNode.nodeValue != "\n" && oNode.nodeValue != "")
				return true;
			else
				return false;
		}

		return this.getNodes(bSplitTextEndNodes, txtFilter);
	},

	surroundContentsWithNewNode : function(sTagName){
		var oNewParent = this._document.createElement(sTagName);
		this.surroundContents(oNewParent);
		return oNewParent;
	},

	isRangeinRange : function(oAnoterRange, bIncludePartlySelected){
		var startToStart = this.compareBoundaryPoints(this.START_TO_START, oAnoterRange);
		var startToEnd = this.compareBoundaryPoints(this.START_TO_END, oAnoterRange);
		var endToStart = this.compareBoundaryPoints(this.END_TO_START, oAnoterRange);
		var endToEnd = this.compareBoundaryPoints(this.END_TO_END, oAnoterRange);

		if(startToStart <= 0 && endToEnd >= 0) return true;

		if(bIncludePartlyIncluded){
			if(startToEnd == 1) return false;
			if(endToStart == -1) return false;
			return true;
		}

		return false;
	},

	isNodeInRange : function(oNode, bIncludePartlySelected, bContentOnly){
		var oTmpRange = new xe.XpressRange(this._window);

		if(bContentOnly && oNode.firstChild){
			oTmpRange.setStartBefore(oNode.firstChild);
			oTmpRange.setEndAfter(oNode.lastChild);
		}else{
			oTmpRange.selectNode(oNode);
		}

		return isRangeInRange(oTmpRange, bIncludePartlySelected);
	},

	pasteHTML : function(sHTML){
		if(sHTML == ""){
			this.deleteContents();
			return;
		}

		var oTmpDiv = this._document.createElement("DIV");
		oTmpDiv.innerHTML = sHTML;

		var oFirstNode = oTmpDiv.firstChild;
		var oLastNode = oTmpDiv.lastChild;

		var clone = this.cloneRange();
		var sBM = clone.placeStringBookmark();

		while(oTmpDiv.lastChild) this.insertNode(oTmpDiv.lastChild);

		this.setEndNodes(oFirstNode, oLastNode);

		// delete the content later as deleting it first may mass up the insertion point
		// eg) <p>[A]BCD</p> ---paste O---> O<p>BCD</p>
		clone.moveToBookmark(sBM);
		clone.deleteContents();
		clone.removeStringBookmark(sBM);
	},

	toString : function(){
		this.toString = xe.W3CDOMRange.prototype.toString;
		return this.toString();
	},

	toHTMLString : function(){
		var oTmpContainer = this._document.createElement("DIV");
		oTmpContainer.appendChild(this.cloneContents());

		return oTmpContainer.innerHTML;
	},

	findAncestorByTagName : function(sTagName){
		var oNode = this.commonAncestorContainer;
		while(oNode && oNode.tagName != sTagName) oNode = xe.DOMFix.parentNode(oNode);

		return oNode;
	},

	selectNodeContents : function(oNode){
		if(!oNode) return;

		var oFirstNode = oNode.firstChild?oNode.firstChild:oNode;
		var oLastNode = oNode.lastChild?oNode.lastChild:oNode;

		if(oFirstNode.nodeType == 3)
			this.setStart(oFirstNode, 0);
		else
			this.setStartBefore(oFirstNode);

		if(oLastNode.nodeType == 3)
			this.setEnd(oLastNode, oLastNode.nodeValue.length);
		else
			this.setEndAfter(oLastNode);
	},

	styleRange : function(oStyle, oAttribute, sNewSpanMarker){
		var aStyleParents = this._getStyleParentNodes(sNewSpanMarker);
		if(aStyleParents.length < 1) return;

		var sName, sValue;

		for(var i=0; i<aStyleParents.length; i++){
			for(var x in oStyle){
				sName = x;
				sValue = oStyle[sName];

				if(typeof sValue != "string") continue;

				aStyleParents[i].style[sName] = sValue;
			}

			if(!oAttribute) continue;

			for(var x in oAttribute){
				sName = x;
				sValue = oAttribute[sName];

				if(typeof sValue != "string") continue;

				if(sName == "class"){
					jQuery(aStyleParents[i]).addClass(sValue);
				}else{
					aStyleParents[i].setAttribute(sName, sValue);
				}
			}
		}

		this.setStartBefore(aStyleParents[0]);
		this.setEndAfter(aStyleParents[aStyleParents.length-1]);
	},

	_getStyleParentNodes : function(sNewSpanMarker){
		this._splitTextEndNodesOfTheRange();

		var oSNode = this.getStartNode();
		var oENode = this.getEndNode();

		var aAllNodes = this._getNodesInRange();
		var aResult = [];

		var oNode, iStartRelPos, iEndRelPos, oSpan, iSIdx, iEIdx;
		var nInitialLength = aAllNodes.length;
		for(var i=0; i<nInitialLength; i++){
			oNode = aAllNodes[i];

			if(!oNode) continue;
			if(oNode.nodeType != 3) continue;
			if(oNode.nodeValue == "") continue;

			if(xe.DOMFix.parentNode(oNode).tagName == "SPAN"){
				// check if the SPAN element is fully contained
				iSIdx = jQuery.inArray(this._getVeryFirstRealChild(xe.DOMFix.parentNode(oNode.parentNode)), aAllNodes);
				iEIdx = jQuery.inArray(this._getVeryLastRealChild(xe.DOMFix.parentNode(oNode)), aAllNodes);

				if(iSIdx != -1 && iEIdx != -1){
					aResult[aResult.length] = xe.DOMFix.parentNode(oNode);
					continue;
				}
			}

			oSpan = this._document.createElement("SPAN");
			xe.DOMFix.parentNode(oNode).insertBefore(oSpan, oNode);
			oSpan.appendChild(oNode);
			aResult[aResult.length] = oSpan;
			aAllNodes[aAllNodes.length] = oSpan;

			if(sNewSpanMarker) oSpan.setAttribute(sNewSpanMarker, "true");
		}

		this.setStartBefore(oSNode);
		this.setEndAfter(oENode);

		return aResult;
	},

	_getVeryFirstChild : function(oNode){
		if(oNode.firstChild) return this._getVeryFirstChild(oNode.firstChild);
		return oNode;
	},

	_getVeryLastChild : function(oNode){
		if(oNode.lastChild) return this._getVeryLastChild(oNode.lastChild);
		return oNode;
	},

	_getFirstRealChild : function(oNode){
		var oFirstNode = oNode.firstChild;
		while(oFirstNode && oFirstNode.nodeType == 3 && oFirstNode.nodeValue == "") oFirstNode = oFirstNode.nextSibling;

		return oFirstNode;
	},

	_getLastRealChild : function(oNode){
		var oLastNode = oNode.lastChild;
		while(oLastNode && oLastNode.nodeType == 3 && oLastNode.nodeValue == "") oLastNode = oLastNode.previousSibling;

		return oLastNode;
	},

	_getVeryFirstRealChild : function(oNode){
		var oFirstNode = this._getFirstRealChild(oNode);
		if(oFirstNode) return this._getVeryFirstRealChild(oFirstNode);
		return oNode;
	},
	_getVeryLastRealChild : function(oNode){
		var oLastNode = this._getLastRealChild(oNode);
		if(oLastNode) return this._getVeryLastChild(oLastNode);
		return oNode;
	},

	_getLineStartInfo : function(node){
		var frontEndFinal = null;
		var frontEnd = node;
		var lineBreaker = node;
		var bParentBreak = true;

		var rxLineBreaker = this.rxLineBreaker;

		// vertical(parent) search
		function getLineStart(node){
			if(!node) return;
			if(frontEndFinal) return;

			if(rxLineBreaker.test(node.tagName)){
				lineBreaker = node;
				frontEndFinal = frontEnd;

				bParentBreak = true;

				return;
			}else{
				frontEnd = node;
			}

			getFrontEnd(node.previousSibling);

			if(frontEndFinal) return;
			getLineStart(xe.DOMFix.parentNode(node));
		}

		// horizontal(sibling) search
		function getFrontEnd(node){
			if(!node) return;
			if(frontEndFinal) return;

			if(rxLineBreaker.test(node.tagName)){
				lineBreaker = node;
				frontEndFinal = frontEnd;

				bParentBreak = false;
				return;
			}

			if(node.firstChild && node.tagName != "TABLE"){
				var curNode = node.lastChild;
				while(curNode && !frontEndFinal){
					getFrontEnd(curNode);

					curNode = curNode.previousSibling;
				}
			}else{
				frontEnd = node;
			}

			if(!frontEndFinal){
				getFrontEnd(node.previousSibling);
			}
		}

		getLineStart(node);

		return {oNode: frontEndFinal, oLineBreaker: lineBreaker, bParentBreak: bParentBreak};
	},

	_getLineEndInfo : function(node){
		var backEndFinal = null;
		var backEnd = node;
		var lineBreaker = node;
		var bParentBreak = true;

		var rxLineBreaker = this.rxLineBreaker;

		// vertical(parent) search
		function getLineEnd(node){
			if(!node) return;
			if(backEndFinal) return;

			if(rxLineBreaker.test(node.tagName)){
				lineBreaker = node;
				backEndFinal = backEnd;

				bParentBreak = true;

				return;
			}else{
				backEnd = node;
			}

			getBackEnd(node.nextSibling);
			if(backEndFinal) return;

			getLineEnd(xe.DOMFix.parentNode(node));
		}

		// horizontal(sibling) search
		function getBackEnd(node){
			if(!node) return;
			if(backEndFinal) return;

			if(rxLineBreaker.test(node.tagName)){
				lineBreaker = node;
				backEndFinal = backEnd;

				bParentBreak = false;

				return;
			}

			if(node.firstChild && node.tagName != "TABLE"){
				var curNode = node.firstChild;
				while(curNode && !backEndFinal){
					getBackEnd(curNode);

					curNode = curNode.nextSibling;
				}
			}else{
				backEnd = node;
			}

			if(!backEndFinal){
				getBackEnd(node.nextSibling);
			}
		}

		getLineEnd(node);

		return {oNode: backEndFinal, oLineBreaker: lineBreaker, bParentBreak: bParentBreak};
	},

	getLineInfo : function(){
		var oSNode = this.getStartNode();
		var oENode = this.getEndNode();

		// the range is currently collapsed
		if(!oSNode) oSNode = this.getNodeAroundRange(true, true);
		if(!oENode) oENode = this.getNodeAroundRange(true, true);

		var oStart = this._getLineStartInfo(oSNode);
		var oStartNode = oStart.oNode;
		var oEnd = this._getLineEndInfo(oENode);
		var oEndNode = oEnd.oNode;

		var iRelativeStartPos = this._compareEndPoint(xe.DOMFix.parentNode(oStartNode), this._getPosIdx(oStartNode), this.endContainer, this.endOffset);
		var iRelativeEndPos = this._compareEndPoint(xe.DOMFix.parentNode(oEndNode), this._getPosIdx(oEndNode)+1, this.startContainer, this.startOffset);

		if(!(iRelativeStartPos <= 0 && iRelativeEndPos >= 0)){
			oSNode = this.getNodeAroundRange(false, true);
			oENode = this.getNodeAroundRange(false, true);
			oStart = this._getLineStartInfo(oSNode);
			oEnd = this._getLineEndInfo(oENode);
		}

		return {oStart: oStart, oEnd: oEnd};
	}
}).extend(xe.W3CDOMRange);

/**
 * @fileOverview This file contains cross-browser selection function
 * @name SimpleSelection.js
 */
xe.SimpleSelection = function(win){
	this.init = function(win){
		this._window = win || window;
		this._document = this._window.document;
	};

	this.init(win);

	if(jQuery.browser.msie)
		xe.SimpleSelectionImpl_IE.apply(this);
	else
		xe.SimpleSelectionImpl_FF.apply(this);

	this.selectRange = function(oRng){
		this.selectNone();
		this.addRange(oRng);
	};

	this.selectionLoaded = true;
	if(!this._oSelection) this.selectionLoaded = false;
};

xe.SimpleSelectionImpl_FF = function(){
	this._oSelection = this._window.getSelection();

	this.getRangeAt = function(iNum){
		iNum = iNum || 0;

		try{
			var oFFRange = this._oSelection.getRangeAt(iNum);
		}catch(e){return new xe.W3CDOMRange(this._document);}

		return this._FFRange2W3CRange(oFFRange);
	};

	this.addRange = function(oW3CRange){
		var oFFRange = this._W3CRange2FFRange(oW3CRange);
		this._oSelection.addRange(oFFRange);
	};

	this.selectNone = function(){
		this._oSelection.removeAllRanges();
	};

	this._FFRange2W3CRange = function(oFFRange){
		var oW3CRange = new xe.W3CDOMRange(this._document);
		oW3CRange.setStart(oFFRange.startContainer, oFFRange.startOffset);
		oW3CRange.setEnd(oFFRange.endContainer, oFFRange.endOffset);
		return oW3CRange;
	};

	this._W3CRange2FFRange = function(oW3CRange){
		var oFFRange = this._document.createRange();
		oFFRange.setStart(oW3CRange.startContainer, oW3CRange.startOffset);
		oFFRange.setEnd(oW3CRange.endContainer, oW3CRange.endOffset);

		return oFFRange;
	};
};

xe.SimpleSelectionImpl_IE = function(){
	this._oSelection = this._document.selection;

	this.getRangeAt = function(iNum){
		iNum = iNum || 0;

		if(this._oSelection.type == "Control"){
			var oW3CRange = new xe.W3CDOMRange(this._document);

			var oSelectedNode = this._oSelection.createRange().item(iNum);

			// if the selction occurs in a different document, ignore
			if(!oSelectedNode || oSelectedNode.ownerDocument != this._document) return oW3CRange;

			oW3CRange.selectNode(oSelectedNode);

			return oW3CRange;
		}else{
			var oSelectedNode = this._oSelection.createRangeCollection().item(iNum).parentElement();

			// if the selction occurs in a different document, ignore
			if(!oSelectedNode || oSelectedNode.ownerDocument != this._document){
				var oW3CRange = new xe.W3CDOMRange(this._document);
				return oW3CRange;
			}
			return this._IERange2W3CRange(this._oSelection.createRangeCollection().item(iNum));
		}
	};

	this.addRange = function(oW3CRange){
		var oIERange = this._W3CRange2IERange(oW3CRange);
		oIERange.select();
	};

	this.selectNone = function(){
		this._oSelection.empty();
	};

	this._W3CRange2IERange = function(oW3CRange){
		var oStartIERange = this._getIERangeAt(oW3CRange.startContainer, oW3CRange.startOffset);
		var oEndIERange = this._getIERangeAt(oW3CRange.endContainer, oW3CRange.endOffset);
		oStartIERange.setEndPoint("EndToEnd", oEndIERange);

		return oStartIERange;
	};

	this._getIERangeAt = function(oW3CContainer, iW3COffset){
		var oIERange = this._document.body.createTextRange();

		var oEndPointInfoForIERange = this._getSelectableNodeAndOffsetForIE(oW3CContainer, iW3COffset);

		var oSelectableNode = oEndPointInfoForIERange.oSelectableNodeForIE;
		var iIEOffset = oEndPointInfoForIERange.iOffsetForIE;

		oIERange.moveToElementText(oSelectableNode);
		oIERange.collapse(oEndPointInfoForIERange.bCollapseToStart);
		oIERange.moveStart("character", iIEOffset);

		return oIERange;
	};

	this._getSelectableNodeAndOffsetForIE = function(oW3CContainer, iW3COffset){
		var oIERange = this._document.body.createTextRange();

		var oNonTextNode = null;
		var aChildNodes =  null;
		var iNumOfLeftNodesToCount = 0;

		if(oW3CContainer.nodeType == 3){
			oNonTextNode = xe.DOMFix.parentNode(oW3CContainer);
			aChildNodes = xe.DOMFix.childNodes(oNonTextNode);
			iNumOfLeftNodesToCount = aChildNodes.length;
		}else{
			oNonTextNode = oW3CContainer;
			aChildNodes = xe.DOMFix.childNodes(oNonTextNode);
			iNumOfLeftNodesToCount = iW3COffset;
		}

		var oNodeTester = null;

		var iResultOffset = 0;

		var bCollapseToStart = true;

		for(var i=0; i<iNumOfLeftNodesToCount; i++){
			oNodeTester = aChildNodes[i];

			if(oNodeTester.nodeType == 3){
				if(oNodeTester == oW3CContainer) break;

				iResultOffset += oNodeTester.nodeValue.length;
			}else{
				oIERange.moveToElementText(oNodeTester);
				oNonTextNode = oNodeTester;
				iResultOffset = 0;

				bCollapseToStart = false;
			}
		}

		if(oW3CContainer.nodeType == 3) iResultOffset += iW3COffset;

		return {oSelectableNodeForIE:oNonTextNode, iOffsetForIE: iResultOffset, bCollapseToStart: bCollapseToStart};
	};

	this._IERange2W3CRange = function(oIERange){
		var oW3CRange = new xe.W3CDOMRange(this._document);

		var oIEPointRange = null;
		var oPosition = null;

		oIEPointRange = oIERange.duplicate();
		oIEPointRange.collapse(true);

		oPosition = this._getW3CContainerAndOffset(oIEPointRange, true);

		oW3CRange.setStart(oPosition.oContainer, oPosition.iOffset);

		var oCollapsedChecker = oIERange.duplicate();
		oCollapsedChecker.collapse(true);
		if(oCollapsedChecker.isEqual(oIERange)){
			oW3CRange.collapse(true);
		}else{
			oIEPointRange = oIERange.duplicate();
			oIEPointRange.collapse(false);
			oPosition = this._getW3CContainerAndOffset(oIEPointRange);
			oW3CRange.setEnd(oPosition.oContainer, oPosition.iOffset);
		}

		return oW3CRange;
	};

	this._getW3CContainerAndOffset = function(oIEPointRange, bStartPt){
		var oRgOrigPoint = oIEPointRange;

		var oContainer = oRgOrigPoint.parentElement();
		var offset = -1;

		var oRgTester = this._document.body.createTextRange();
		var aChildNodes = xe.DOMFix.childNodes(oContainer);
		var oPrevNonTextNode = null;
		var pointRangeIdx = 0;

		for(var i=0;i<aChildNodes.length;i++){
			if(aChildNodes[i].nodeType == 3) continue;

			oRgTester.moveToElementText(aChildNodes[i]);

			if(oRgTester.compareEndPoints("StartToStart", oIEPointRange)>=0) break;

			oPrevNonTextNode = aChildNodes[i];
		}

		var pointRangeIdx = i;

		if(pointRangeIdx != 0 && aChildNodes[pointRangeIdx-1].nodeType == 3){
			var oRgTextStart = this._document.body.createTextRange();
			var oCurTextNode = null;
			if(oPrevNonTextNode){
				oRgTextStart.moveToElementText(oPrevNonTextNode);
				oRgTextStart.collapse(false);
				oCurTextNode = oPrevNonTextNode.nextSibling;
			}else{
				oRgTextStart.moveToElementText(oContainer);
				oRgTextStart.collapse(true);
				oCurTextNode = oContainer.firstChild;
			}

			var oRgTextsUpToThePoint = oRgOrigPoint.duplicate();
			oRgTextsUpToThePoint.setEndPoint("StartToStart", oRgTextStart);

			var textCount = oRgTextsUpToThePoint.text.length

			while(textCount > oCurTextNode.nodeValue.length && oCurTextNode.nextSibling){
				textCount -= oCurTextNode.nodeValue.length;
				oCurTextNode = oCurTextNode.nextSibling;
			}

			// this will enforce IE to re-reference oCurTextNode
			var oTmp = oCurTextNode.nodeValue;

			if(bStartPt && oCurTextNode.nextSibling && oCurTextNode.nextSibling.nodeType == 3 && textCount == oCurTextNode.nodeValue.length){
				textCount -= oCurTextNode.nodeValue.length;
				oCurTextNode = oCurTextNode.nextSibling;
			}

			oContainer = oCurTextNode;
			offset = textCount;
		}else{
			oContainer = oRgOrigPoint.parentElement();
			offset = pointRangeIdx;
		}

		return {"oContainer" : oContainer, "iOffset" : offset};
	};
}

xe.DOMFix = new (jQuery.Class({
	$init : function(){
		if(jQuery.browser.msie || jQuery.browser.opera){
			this.childNodes = this._childNodes_Fix;
			this.parentNode = this._parentNode_Fix;
		}else{
			this.childNodes = this._childNodes_Native;
			this.parentNode = this._parentNode_Native;
		}
	},

	_parentNode_Native : function(elNode){
		return elNode.parentNode;
	},

	_parentNode_Fix : function(elNode){
		if(!elNode) return elNode;

		while(elNode.previousSibling){elNode = elNode.previousSibling;}

		return elNode.parentNode;
	},

	_childNodes_Native : function(elNode){
		return elNode.childNodes;
	},

	_childNodes_Fix : function(elNode){
		var aResult = null;
		var nCount = 0;

		if(elNode){
			var aResult = [];
			elNode = elNode.firstChild;
			while(elNode){
				aResult[nCount++] = elNode;
				elNode=elNode.nextSibling;
			}
		}

		return aResult;
	}
}))();
/**
 * @fileOverview This file contains a function that takes care of various operations related to find and replace
 * @name N_FindReplace.js
 */
xe.FindReplace = jQuery.Class({
	sKeyword : "",
	window : null,
	document : null,
	bBrowserSupported : false,

	// true if End Of Contents is reached during last execution of find
	bEOC : false,

	$init : function(win){
		this.window = win;
		this.document = this.window.document;

		if(this.document.domain != this.document.location.hostname){
			if(jQuery.browser.mozilla && jQuery.browser.nVersion < 3){
				this.bBrowserSupported = false;
				this.find = function(){return 3};
				return;
			}
		}

		this.bBrowserSupported = true;
	},

	// 0: found
	// 1: not found
	// 2: keyword required
	// 3: browser not supported
	find : function(sKeyword, bCaseMatch, bBackwards, bWholeWord){
		var bSearchResult, bFreshSearch;

		this.window.focus();

		if(!sKeyword) return 2;

		// try find starting from current cursor position
		this.bEOC = false;
		bSearchResult = this.findNext(sKeyword, bCaseMatch, bBackwards, bWholeWord);
		if(bSearchResult) return 0;

		// end of the contents could have been reached so search again from the beginning
		this.bEOC = true;
		bSearchResult = this.findNew(sKeyword, bCaseMatch, bBackwards, bWholeWord);

		if(bSearchResult) return 0;

		return 1;
	},

	findNew : function (sKeyword, bCaseMatch, bBackwards, bWholeWord){
		this.findReset();
		return this.findNext(sKeyword, bCaseMatch, bBackwards, bWholeWord);
	},

	findNext : function(sKeyword, bCaseMatch, bBackwards, bWholeWord){
		var bSearchResult;
		bCaseMatch = bCaseMatch || false;
		bWholeWord = bWholeWord || false;
		bBackwards = bBackwards || false;

		if(this.window.find){
			var bWrapAround = false;
			return this.window.find(sKeyword, bCaseMatch, bBackwards, bWrapAround, bWholeWord);
		}

		// IE solution
		if(this.document.body.createTextRange){
			var iOption = 0;
			if(bBackwards) iOption += 1;
			if(bWholeWord) iOption += 2;
			if(bCaseMatch) iOption += 4;

			this.window.focus();
			this._range = this.document.selection.createRangeCollection().item(0);
			this._range.collapse(false);
			bSearchResult = this._range.findText(sKeyword, 1, iOption);

			this._range.select();
			return bSearchResult;
		}

		return false;
	},

	findReset : function() {
		if (this.window.find){
			this.window.getSelection().removeAllRanges();
			return;
		}

		// IE solution
		if(this.document.body.createTextRange){
			this._range = this.document.body.createTextRange();
			this._range.collapse(true);
			this._range.select();
		}
	},

	// 0: replaced & next word found
	// 1: replaced & next word not found
	// 2: not replaced & next word found
	// 3: not replaced & next word not found
	// 4: sOriginalWord required
	replace : function(sOriginalWord, Replacement, bCaseMatch, bBackwards, bWholeWord){
		if(!sOriginalWord) return 4;

		var oSelection = new xe.XpressRange(this.window);
		oSelection.setFromSelection();

		bCaseMatch = bCaseMatch || false;
		var bMatch, selectedText = oSelection.toString();
		if(bCaseMatch)
			bMatch = (selectedText == sOriginalWord);
		else
			bMatch = (selectedText.toLowerCase() == sOriginalWord.toLowerCase());

		if(!bMatch)
			return this.find(sOriginalWord, bCaseMatch, bBackwards, bWholeWord)+2;

		if(typeof Replacement == "function"){
			// the returned oSelection must contain the replacement
			oSelection = Replacement(oSelection);
		}else{
			oSelection.pasteHTML(Replacement);
		}

		// force it to find the NEXT occurance of sOriginalWord
		oSelection.select();

		return this.find(sOriginalWord, bCaseMatch, bBackwards, bWholeWord);
	},

	// returns number of replaced words
	// -1 : if original word is not given
	replaceAll : function(sOriginalWord, Replacement, bCaseMatch, bWholeWord){
		if(!sOriginalWord) return -1;

		var bBackwards = false;

		var iReplaceResult;
		var iResult = 0;
		var win = this.window;
		var oSelection = new xe.XpressRange(this.window);
		oSelection.setFromSelection();
		var sBookmark = oSelection.placeStringBookmark();

		this.bEOC = false;
		while(!this.bEOC){
			iReplaceResult = this.replace(sOriginalWord, Replacement, bCaseMatch, bBackwards, bWholeWord);
			if(iReplaceResult == 0 || iReplaceResult == 1) iResult++;
		}

		var startingPointReached = function(){
			var oCurSelection = new xe.XpressRange(win);
			oCurSelection.setFromSelection();

			oSelection.moveToBookmark(sBookmark);
			var pos = oSelection.compareBoundaryPoints(xe.W3CDOMRange.START_TO_END, oCurSelection);

			if(pos == 1) return false;
			return true;
		}

		iReplaceResult = 0;
		this.bEOC = false;
		while(!startingPointReached() && iReplaceResult == 0 && !this.bEOC){
			iReplaceResult = this.replace(sOriginalWord, Replacement, bCaseMatch, bBackwards, bWholeWord);
			if(iReplaceResult == 0 || iReplaceResult == 1) iResult++;
		}

		oSelection.moveToBookmark(sBookmark);
		oSelection.select();
		oSelection.removeStringBookmark(sBookmark);

		return iResult;
	}
});

/**
 * @fileOverview This file contains a function that takes care of the draggable layers
 * @name N_DraggableLayer.js
 */
xe.DraggableLayer = jQuery.Class({
	$init : function(oLayer, oOptions){
		this.oOptions = jQuery.extend({
			bModal : "false",
			oHandle : oLayer,
			iMinX : -999999,
			iMinY : -999999,
			iMaxX : 999999,
			iMaxY : 999999
		}, oOptions);

		this.oHandle = this.oOptions.oHandle;

		oLayer.style.display = "block";
		oLayer.style.position = "absolute";
		oLayer.style.zIndex = "9999";

		this.aBasePosition = this.getBaseOffset(oLayer);

		// "number-ize" the position and set it as inline style. (the position could've been set as "auto" or set  by css, not inline style)
		oLayer.style.top = (this.toInt(jQuery(oLayer).offset().top) - this.aBasePosition.top)+"px";
		oLayer.style.left = (this.toInt(jQuery(oLayer).offset().left) - this.aBasePosition.left)+"px";

		this.$FnMouseDown = jQuery.fnBind(this._mousedown, this, oLayer);
		this.$FnMouseMove = jQuery.fnBind(this._mousemove, this, oLayer);
		this.$FnMouseUp = jQuery.fnBind(this._mouseup, this, oLayer);

		jQuery(this.oHandle).bind("mousedown", this.$FnMouseDown);
	},

	_mousedown : function(oLayer, oEvent){
		if(oEvent.target.tagName == "INPUT") return;

		this.MouseOffsetY = (oEvent.pageY-this.toInt(oLayer.style.top)-this.aBasePosition['top']);
		this.MouseOffsetX = (oEvent.pageX-this.toInt(oLayer.style.left)-this.aBasePosition['left']);

		jQuery(oLayer).bind("mousemove", this.$FnMouseMove);
		jQuery(oLayer).bind("mouseup", this.$FnMouseUp);
	},

	_mousemove : function(oLayer, oEvent){
		var iTop = (oEvent.pageY-this.MouseOffsetY-this.aBasePosition['top']);
		var iLeft = (oEvent.pageX-this.MouseOffsetX-this.aBasePosition['left']);

		if(iTop<this.oOptions.iMinY) iTop = this.oOptions.iMinY;
		if(iTop>this.oOptions.iMaxY) iTop = this.oOptions.iMaxY;

		if(iLeft<this.oOptions.iMinX) iLeft = this.oOptions.iMinX;
		if(iLeft>this.oOptions.iMaxX) iLeft = this.oOptions.iMaxX;

		oLayer.style.top = iTop + "px";
		oLayer.style.left = iLeft + "px";
	},

	_mouseup : function(oLayer, oEvent){
		jQuery(oLayer).unbind("mousemove", this.$FnMouseMove);
		jQuery(oLayer).unbind("mouseup", this.$FnMouseUp);
	},

	toInt : function(num){
		var result = parseInt(num);
		return result || 0;
	},

	findNonStatic : function(oEl){
		if(!oEl) return null;
		if(oEl.tagName == "BODY") return oEl;

		if(jQuery(oEl).css("position").match(/absolute|relative/i)) return oEl;

		return this.findNonStatic(oEl.offsetParent);
	},

	getBaseOffset : function(oEl){
		var oBase = this.findNonStatic(oEl.offsetParent);
		var tmp = jQuery(oBase).offset();

		return {top: tmp.top, left: tmp.left};
	}
});
//{
/**
 * @fileOverview This file contains Xpress plugin that takes care of the messages related to core operations
 * @name hp_CorePlugin.js
 */
xe.CorePlugin = jQuery.Class({
	name : "CorePlugin",

	$init : function(funcOnReady){
		this.funcOnReady = funcOnReady;
	},

	$AFTER_MSG_APP_READY : function(){
		this.oApp.exec("EXEC_ON_READY_FUNCTION", []);
	},

	$ON_ADD_APP_PROPERTY : function(sPropertyName, oProperty){
		this.oApp[sPropertyName] = oProperty;
	},

	$ON_REGISTER_BROWSER_EVENT : function(obj, sEvent, sCMD, aParams, nDelay){
		this.oApp.registerBrowserEvent(obj, sEvent, sCMD, aParams, nDelay);
	},

	$ON_DISABLE_COMMAND : function(sCommand){
		this.oApp.disableCommand(sCommand, true);
	},

	$ON_ENABLE_COMMAND : function(sCommand){
		this.oApp.disableCommand(sCommand, false);
	},

	$ON_EXEC_ON_READY_FUNCTION : function(){
		if(typeof this.funcOnReady == "function") this.funcOnReady();
	}
});
//}
//{
/**
 * @fileOverview This file contains Xpress plugin that helps various operations.
 * @name hp_Utils.js
 */
 xe.Utils = jQuery.Class({
	name : "Utils",

	$init : function(){
		if(jQuery.browser.msie && jQuery.browser.nVersion == 6){
			try{
				document.execCommand('BackgroundImageCache', false, true);
			}catch(e){}
		}
	},

	$ON_ATTACH_HOVER_EVENTS : function(aElms, sHoverClass){
		sHoverClass = sHoverClass || "hover";

		if(!aElms) return;

		jQuery(aElms).hover(
			function(){jQuery(this).addClass(sHoverClass)},
			function(){jQuery(this).removeClass(sHoverClass)}
		);
	}
});
//}

//{
/**
 * @fileOverview This file contains Xpress plugin that bridges the XpressRange function
 * @name hp_XpressRangeManager.js
 */
xe.XpressRangeManager = jQuery.Class({
	name : "XpressRangeManager",

	oWindow : null,

	$init : function(win){
		this.oWindow = win || window;
	},

	$BEFORE_MSG_APP_READY : function(){
		if(this.oWindow && this.oWindow.tagName == "IFRAME")
			this.oWindow = this.oWindow.contentWindow;

		this.oApp.exec("ADD_APP_PROPERTY", ["getSelection", jQuery.fnBind(this.getSelection, this)]);
		this.oApp.exec("ADD_APP_PROPERTY", ["getEmptySelection", jQuery.fnBind(this.getEmptySelection, this)]);
	},

	$ON_SET_EDITING_WINDOW : function(oWindow){
		this.oWindow = oWindow;
	},

	getEmptySelection : function(){
		var oXpressRange = new xe.XpressRange(this.oWindow);
		return oXpressRange;
	},

	getSelection : function(){
		this.oApp.exec("RESTORE_IE_SELECTION", []);

		var oXpressRange = this.getEmptySelection();

		// this may throw an exception if the selected is area is not yet shown
		try{
			oXpressRange.setFromSelection();
		}catch(e){}

		return oXpressRange;
	}
});
//}
xe.Hotkey = jQuery.Class({
	name : "Hotkey",

	target  : null,
	handler : null,
	storage : {},
	keyhash : {},

	$init : function(){
		this.storage = {};

		this.keyhash = {
			backspace : 8,
			tab		  : 9,
			enter	  : 13,
			shift     : 16,
			ctrl      : 17,
			alt       : 18,
			meta      : 224,
			esc		  : 27,
			space	  : 32,
			pageup	  : 33,
			pagedown  : 34,
			end		  : 35,
			home	  : 36,
			left	  : 37,
			up		  : 38,
			right	  : 39,
			down	  : 40,
			del	  	  : 46,
			comma	  : 188,//(,)
			period	  : 190,//(.)
			slash	  : 191,//(/)
			hyphen    : 109,
			equal     : 61
		};

		if (jQuery.browser.msie || jQuery.browser.safari) {
			this.keyhash.hyphen = 189; // (-)
			this.keyhash.equal = 187;  // (=)
			this.keyhash.meta  = 91;   // meta
		}
	},

	$ON_MSG_APP_READY : function(){
		this.target  = this.oApp.getWYSIWYGDocument() || document;
		this.handler = jQuery.fnBind(this.keydown, this);

		jQuery(this.target).keydown(this.handler);
	},

	$ON_MSG_APP_DESTORY : function(){
		jQuery(this.target).unbind('keydown', this.handler);
	},

	$ON_REGISTER_HOTKEY : function(sHotkey, sCMD, sArgs){
		if(!sArgs) sArgs = [];
		var func = jQuery.fnBind(this.oApp.exec, this.oApp, sCMD, sArgs);

		sHotkey = this.normalize(sHotkey);
		if (!sHotkey) return false;

		this.add(sHotkey, func);
	},

	add : function(sHotkey, func) {
		if (typeof this.storage[sHotkey] == 'undefined') {
			this.storage[sHotkey] = [func];
		} else {
			this.storage[sHotkey].push(func);
		}
	},

	keydown : function(event) {
		var key  = [], kh = this.keyhash;
		var code = event.keyCode;

		if (jQuery.inArray(event.keyCode, [kh.shift, kh.ctrl, kh.alt, kh.meta]) >= 0) return;

		if (event.shiftKey) key.push('shift');
		if (event.altKey)   key.push('alt');
		if (event.ctrlKey)  key.push('ctrl');
		if (event.metaKey)  key.push('meta');
		if (!key.length && code != kh.enter && code != kh.esc) return;
		if (key.length == 1 && event.metaKey) key = ['ctrl', 'meta'];

		key.push(code);
		key = key.join('+');

		if (!this.storage[key]) return;

		jQuery.each(this.storage[key], function(){ this(); });

		event.preventDefault();
		event.stopPropagation();
		event.keyCode = 0;

		return false;
	},

	normalize : function(sHotkey) {
		var shift, ctrl, alt, meta, key, keys = (sHotkey||"").toLowerCase().split('+');

		shift = ctrl = alt = meta = key = false;

		jQuery.each(keys, function(){
			var s = ""+this;
			switch(s) {
				case 'shift': shift = true;
				case 'alt'  : alt   = true;
				case 'ctrl' : ctrl  = true;
				case 'meta' : meta  = true;
				default:
					key = s;
			}
		});

		if (!key) return '';

		keys = [];
		if (shift) keys.push('shift');
		if (alt) keys.push('alt');
		if (ctrl) keys.push('ctrl');
		if (meta || (ctrl && !shift && !alt)) keys.push('meta');

		keys.push(this.keyhash[key] || key.toUpperCase().charCodeAt(0));

		return keys.join('+');
	}
});

//{
/**
 * @fileOverview This file contains Xpress plugin that takes care of the draggable layers
 * @name hp_DialogLayerManager.js
 */
xe.DialogLayerManager = jQuery.Class({
	name : "DialogLayerManager",
	aMadeDraggable : null,
	aOpenedLayers : null,

	$init : function(){
		this.aMadeDraggable = [];
		this.aOpenedLayers = [];
	},

	$ON_SHOW_DIALOG_LAYER : function(oLayer, bModal){
		oLayer = jQuery.$(oLayer);
		bModal = jQuery.$(bModal) || false;
		if(!oLayer) return;

		if(jQuery.inArray(oLayer, this.aOpenedLayers)) return;

		this.oApp.exec("POSITION_DIALOG_LAYER", [oLayer]);

		this.aOpenedLayers[this.aOpenedLayers.length] = oLayer;

		if(!jQuery.inArray(oLayer, this.aMadeDraggable)){
			new xe.DraggableLayer(oLayer, {bModal: bModal, iMinY: 0});
			this.aMadeDraggable[this.aMadeDraggable.length] = oLayer;
		}else{
			oLayer.style.display = "block";
		}
	},

	$ON_HIDE_LAST_DIALOG_LAYER : function(){
		this.oApp.exec("HIDE_DIALOG_LAYER", [this.aOpenedLayers[this.aOpenedLayers.length-1]]);
	},

	$ON_HIDE_ALL_DIALOG_LAYER : function(){
		for(var i=this.aOpenedLayers.length-1; i>=0; i--)
			this.oApp.exec("HIDE_DIALOG_LAYER", [this.aOpenedLayers[i]]);
	},

	$ON_HIDE_DIALOG_LAYER : function(oLayer){
		oLayer = jQuery.$(oLayer);

		if(oLayer) oLayer.style.display = "none";
		this.aOpenedLayers = jQuery.grep(this.aOpenedLayers, function(a){return a!=oLayer});
	},

	$ON_SET_DIALOG_LAYER_POSITION : function(oLayer, iTop, iLeft){
		oLayer.style.top = iTop;
		oLayer.style.left = iLeft;
	}
});
//}
//{
/**
 * @fileOverview This file contains Xpress plugin that takes care of the layers that should disappear when the focus is lost
 * @name hp_ActiveLayerManager.js
 */
xe.ActiveLayerManager = jQuery.Class({
	name : "ActiveLayerManager",
	oCurrentLayer : null,

	$ON_TOGGLE_ACTIVE_LAYER : function(oLayer, sOnOpenCmd, aOnOpenParam, sOnCloseCmd, aOnCloseParam){
		if(oLayer == this.oCurrentLayer){
			this.oApp.exec("HIDE_ACTIVE_LAYER", []);
		}else{
			this.oApp.exec("SHOW_ACTIVE_LAYER", [oLayer, sOnCloseCmd, aOnCloseParam]);
			if(sOnOpenCmd) this.oApp.exec(sOnOpenCmd, aOnOpenParam);
		}
	},

	$ON_SHOW_ACTIVE_LAYER : function(oLayer, sOnCloseCmd, aOnCloseParam){
		oLayer = jQuery.$(oLayer);
		this.sOnCloseCmd = sOnCloseCmd;
		this.aOnCloseParam = aOnCloseParam;

		var oPrevLayer = this.oCurrentLayer;

		if(oLayer == oPrevLayer) return;

		this.oApp.exec("HIDE_ACTIVE_LAYER", []);

		oLayer.style.display = "block";
		this.oCurrentLayer = oLayer;
	},

	$ON_HIDE_ACTIVE_LAYER : function(){
		var oLayer = this.oCurrentLayer;
		if(!oLayer) return;
		oLayer.style.display = "none";
		this.oCurrentLayer = null;

		if(this.sOnCloseCmd)
			this.oApp.exec(this.sOnCloseCmd, this.aOnCloseParam);
	},

	// for backward compatibility only.
	// use HIDE_ACTIVE_LAYER instead!
	$ON_HIDE_CURRENT_ACTIVE_LAYER : function(){
		this.oApp.exec("HIDE_ACTIVE_LAYER", []);
	},

	$ON_EVENT_EDITING_AREA_KEYDOWN : function(){
		this.oApp.exec("HIDE_ACTIVE_LAYER", []);
	},

	$ON_EVENT_EDITING_AREA_MOUSEDOWN : function(){
		this.oApp.exec("HIDE_ACTIVE_LAYER", []);
	}
});
//}
//{
/**
 * @fileOverview This file contains Xpress plugin that takes care of the operations related to string conversion. Ususally used to convert the IR value.
 * @name hp_StringConverterManager.js
 */
xe.StringConverterManager = jQuery.Class({
	name : "StringConverterManager",

	oConverters : null,

	$init : function(){
		this.oConverters = {};
	},

	$BEFORE_MSG_APP_READY : function(){
		this.oApp.exec("ADD_APP_PROPERTY", ["applyConverter", jQuery.fnBind(this.applyConverter, this)]);
		this.oApp.exec("ADD_APP_PROPERTY", ["addConverter", jQuery.fnBind(this.addConverter, this)]);
	},

	applyConverter : function(sRuleName, sContent){
		var aConverters = this.oConverters[sRuleName];
		if(!aConverters) return sContent;

		for(var i=0; i<aConverters.length; i++) sContent = aConverters[i](sContent);

		return sContent;
	},

	addConverter : function(sRuleName, funcConverter){
		var aConverters = this.oConverters[sRuleName];
		if(!aConverters) this.oConverters[sRuleName] = [];

		this.oConverters[sRuleName][this.oConverters[sRuleName].length] = funcConverter;
	}
});
//}
//{
/**
 * @fileOverview This file contains Xpress plugin that maps a message code to the actual message
 * @name hp_MessageManager.js
 */
xe.MessageManager = jQuery.Class({
	name : "MessageManager",

	oMessageMap : null,

	$init : function(oMessageMap){
		this.oMessageMap = oMessageMap;
	},

	$BEFORE_MSG_APP_READY : function(){
		this.oApp.exec("ADD_APP_PROPERTY", ["$MSG", jQuery.fnBind(this.getMessage, this)]);
	},

	getMessage : function(sMsg){
		if(this.oMessageMap[sMsg]) return unescape(this.oMessageMap[sMsg]);

		return sMsg;
	}
});
//}
//{
/**
 * @fileOverview This file contains Xpress plugin that takes care of the operations related to the tool bar UI
 * @name hp_XE_Toolbar.js
 */
xe.XE_Toolbar = jQuery.Class({
	name : "XE_Toolbar",
	toolbarArea : null,
	toolbarButton : null,
	uiNameTag : "uiName",

	sUIClassPrefix : "xpress_xeditor_ui_",

	aUICmdMap : null,

	$init : function(oAppContainer){
		this.htUIList = {};

		this.aUICmdMap = {};
		this._assignHTMLObjects(oAppContainer);
	},

	_assignHTMLObjects : function(oAppContainer){
		oAppContainer = jQuery.$(oAppContainer) || document;
		this.toolbarArea = jQuery(".tool", oAppContainer).get(0);
		this.welToolbarArea = jQuery(this.toolbarArea);

		this.aAllButtons = jQuery("BUTTON", this.toolbarArea).get();

		var aAllLi = this.toolbarArea.getElementsByTagName("LI");
		var nCount = aAllLi.length;
		var rxUI = new RegExp(this.sUIClassPrefix+"([^ ]+)");
		for(var i=0; i<nCount; i++){
			if(rxUI.test(aAllLi[i].className)){
				var sUIName = RegExp.$1;
				if(this.htUIList[sUIName] != null) continue;

				this.htUIList[sUIName] = jQuery(">*:first-child", aAllLi[i]).get(0);
			}
		}
	},

	$ON_MSG_APP_READY : function(){
		this.oApp.registerBrowserEvent(this.toolbarArea, "mouseover", "EVENT_TOOLBAR_MOUSEOVER", []);
		this.oApp.registerBrowserEvent(this.toolbarArea, "mouseout", "EVENT_TOOLBAR_MOUSEOUT", []);

		this.oApp.exec("ADD_APP_PROPERTY", ["getToolbarButtonByUIName", jQuery.fnBind(this.getToolbarButtonByUIName, this)]);
	},

	$ON_EVENT_TOOLBAR_MOUSEOVER : function(weEvent){
		if(weEvent.target.tagName == "BUTTON") jQuery(weEvent.target).addClass("hover").parent("span").addClass("hover");
	},

	$ON_EVENT_TOOLBAR_MOUSEOUT : function(weEvent){
		if(weEvent.target.tagName == "BUTTON") jQuery(weEvent.target).removeClass("hover").parent("span").removeClass("hover");
	},

	$ON_TOGGLE_TOOLBAR_ACTIVE_LAYER : function(oLayer, oBtn, sOpenCmd, aOpenArgs, sCloseCmd, aCloseArgs){
		this.oApp.exec("TOGGLE_ACTIVE_LAYER", [oLayer, "MSG_TOOLBAR_LAYER_SHOWN", [oLayer, oBtn, sOpenCmd, aOpenArgs], sCloseCmd, aCloseArgs]);
	},

	$ON_MSG_TOOLBAR_LAYER_SHOWN : function(oLayer, oBtn, aOpenCmd, aOpenArgs){
		this.oApp.exec("POSITION_TOOLBAR_LAYER", [oLayer, oBtn]);
		if(aOpenCmd) this.oApp.exec(aOpenCmd, aOpenArgs);
	},

	$ON_SHOW_TOOLBAR_ACTIVE_LAYER : function(oLayer, sCmd, aArgs, oBtn){
		this.oApp.exec("SHOW_ACTIVE_LAYER", [oLayer, sCmd, aArgs]);
		this.oApp.exec("POSITION_TOOLBAR_LAYER", [oLayer, oBtn]);
	},

	$ON_ENABLE_UI : function(sUIName){
		var elUI = this.htUIList[sUIName];
		if(!elUI) return;
		jQuery(elUI).removeClass("off");
		elUI.disabled = false;

		// enable related commands
		var sCmd = "";
		if(this.aUICmdMap[sUIName]){
			for(var i=0; i<this.aUICmdMap[sUIName].length;i++){
				sCmd = this.aUICmdMap[sUIName][i];
				this.oApp.exec("ENABLE_COMMAND", [sCmd]);
			}
		}
	},

	$ON_DISABLE_UI : function(sUIName){
		var elUI = this.htUIList[sUIName];
		if(!elUI) return;
		jQuery(elUI).addClass("off");
		jQuery(elUI).removeClass("hover").parent("span").removeClass("hover");
		elUI.disabled = true;

		// disable related commands
		var sCmd = "";
		if(this.aUICmdMap[sUIName]){
			for(var i=0; i<this.aUICmdMap[sUIName].length;i++){
				sCmd = this.aUICmdMap[sUIName][i];
				this.oApp.exec("DISABLE_COMMAND", [sCmd]);
			}
		}
	},

	$ON_SELECT_UI : function(sUIName){
		var elUI = this.htUIList[sUIName];
		if(!elUI) return;
		jQuery(elUI).addClass("active");
	},

	$ON_DESELECT_UI : function(sUIName){
		var elUI = this.htUIList[sUIName];
		if(!elUI) return;
		jQuery(elUI).removeClass("active");
	},

	$ON_ENABLE_ALL_UI : function(){
		var sUIName, className;

		for(var sUIName in this.htUIList){
			if(sUIName) this.oApp.exec("ENABLE_UI", [sUIName]);
		}
		jQuery(this.toolbarArea).removeClass("off");
	},

	$ON_DISABLE_ALL_UI : function(){
		var sUIName;

		for(var sUIName in this.htUIList){
			if(sUIName) this.oApp.exec("DISABLE_UI", [sUIName]);
		}
		jQuery(this.toolbarArea).addClass("off");
		this.oApp.exec("HIDE_ACTIVE_LAYER",[]);
	},

	$ON_MSG_STYLE_CHANGED : function(sAttributeName, attributeValue){
		if(attributeValue == 1)
			this.oApp.exec("SELECT_UI", [sAttributeName]);
		else
			this.oApp.exec("DESELECT_UI", [sAttributeName]);
	},

	$ON_REGISTER_UI_EVENT : function(sUIName, sEvent, sCmd, aParams){
		// map cmd & ui
		if(!this.aUICmdMap[sUIName]){this.aUICmdMap[sUIName] = [];}
		this.aUICmdMap[sUIName][this.aUICmdMap[sUIName].length] = sCmd;
		var elUI = this.htUIList[sUIName];
		if(!elUI) return;
		this.oApp.registerBrowserEvent(elUI, sEvent, sCmd, aParams);
	},

	$ON_POSITION_TOOLBAR_LAYER : function(oLayer, oBtn){
		oLayer = jQuery.$(oLayer);
		oBtn = jQuery.$(oBtn);

		if(!oLayer) return;
		if(oBtn && oBtn.tagName && oBtn.tagName == "BUTTON") oBtn.parentNode.appendChild(oLayer);

		oLayer.style.left = "0";

		var welLayer = jQuery(oLayer);
		var nLayerLeft = welLayer.offset().left;
		nLayerLeft += oLayer.offsetWidth;

		var nToolbarLeft = this.welToolbarArea.offset().left;
		nToolbarLeft += this.toolbarArea.offsetWidth;

		if(nLayerLeft > nToolbarLeft) oLayer.style.left = (nToolbarLeft-nLayerLeft-5)+"px";
	},

	getToolbarButtonByUIName : function(sUIName){
		return this.htUIList[sUIName];
	}
});
//}
//{
/**
 * @fileOverview This file contains Xpress plugin that manages multiple number editing area plugins and the IR value
 * @name hp_XE_EditingAreaManager.js
 */
xe.XE_EditingAreaManager = jQuery.Class({
	name : "XE_EditingAreaManager",

	// Currently active plugin instance(XE_EditingArea_???)
	oActivePlugin : null,

	// Intermediate Representation of the content being edited.
	// This should be a textarea element.
	oIRField : null,

	bIsDirty : false,

	$init : function(sInitialMode, oIRField, oDimension, fOnBeforeUnload, oAppContainer){
		this.sInitialMode = sInitialMode;
		this.oIRField = jQuery.$(oIRField);
		this._assignHTMLObjects(oAppContainer);
		this.fOnBeforeUnload = fOnBeforeUnload;

		this.oEditingMode = {};

		this.elEditingAreaContainer.style.height = parseInt(oDimension.nHeight || this.elEditingAreaContainer.offsetHeight)+"px";

		this.nMinHeight = oDimension.nMinHeight || 10;
		this.niMinWidth = oDimension.nMinWidth || 10;
	},

	_assignHTMLObjects : function(oAppContainer){
		oAppContainer = jQuery.$(oAppContainer) || document;
		this.elEditingAreaContainer = jQuery("DIV.xpress_xeditor_editing_area_container", oAppContainer).get(0);
		this.elEditingAreaSkipUI = jQuery("A.skip", oAppContainer).get(0);
	},

	$BEFORE_MSG_APP_READY : function(msg){
		this.oApp.exec("ADD_APP_PROPERTY", ["elEditingAreaContainer", this.elEditingAreaContainer]);
		this.oApp.exec("ADD_APP_PROPERTY", ["getIR", jQuery.fnBind(this.getIR, this)]);
		this.oApp.exec("ADD_APP_PROPERTY", ["setIR", this.setIR]);
		this.oApp.exec("ADD_APP_PROPERTY", ["getEditingMode", jQuery.fnBind(this.getEditingMode, this)]);
	},

	$ON_MSG_APP_READY : function(){
		this.oApp.exec("CHANGE_EDITING_MODE", [this.sInitialMode, true]);
		this.oApp.exec("LOAD_IR_FIELD", [false]);

		this.oApp.registerBrowserEvent(this.elEditingAreaSkipUI, "focus", "MSG_EDITING_AREA_SIZE_CHANGED", [], 50);
		this.oApp.registerBrowserEvent(this.elEditingAreaSkipUI, "blur", "MSG_EDITING_AREA_SIZE_CHANGED", [], 50);

		//var fOnBeforeUnload = this.fOnBeforeUnload||function(){if(this.getIR() != this.oIRField.value || this.bIsDirty) return this.oApp.$MSG("XE_EditingAreaManager.onExit")};
		//jQuery(window).bind("beforeunload", jQuery.fnBind(fOnBeforeUnload, this));
	},

	$AFTER_MSG_APP_READY : function(){
		this.oApp.exec("UPDATE_IR_FIELD", []);
	},

	$ON_LOAD_IR_FIELD : function(bDontAddUndo){
		this.oApp.setIR(this.oIRField.value, bDontAddUndo);
	},

	$ON_UPDATE_IR_FIELD : function(){
		this.oIRField.value = this.oApp.getIR();
	},

	$BEFORE_CHANGE_EDITING_MODE : function(sMode){
		this._oPrevActivePlugin = this.oActivePlugin;
		this.oActivePlugin = this.oEditingMode[sMode];
	},

	$AFTER_CHANGE_EDITING_MODE : function(sMode, bNoFocus){
		if(this._oPrevActivePlugin){
			var sIR = this._oPrevActivePlugin.getIR();
			this.oApp.exec("SET_IR", [sIR]);

			this.oApp.exec("ENABLE_UI", [this._oPrevActivePlugin.sMode]);

			this._setEditingAreaDimension();
		}
		this.oApp.exec("DISABLE_UI", [this.oActivePlugin.sMode]);

		if(!bNoFocus){
			this.oApp.exec("FOCUS", []);
		}
	},

	$ON_SET_IS_DIRTY : function(bIsDirty){
		this.bIsDirty = bIsDirty;
	},

	$ON_FOCUS : function(){
		if(!this.oActivePlugin || typeof this.oActivePlugin.setIR != "function") return

		this.oActivePlugin.focus();
	},

	$BEFORE_SET_IR : function(sIR, bDontAddUndoHistory){
		bDontAddUndoHistory = bDontAddUndoHistory || false;
		if(!bDontAddUndoHistory) this.oApp.exec("RECORD_UNDO_ACTION", ["SET CONTENTS"]);
	},

	$ON_SET_IR : function(sIR){
		if(!this.oActivePlugin || typeof this.oActivePlugin.setIR != "function") return

		this.oActivePlugin.setIR(sIR);
	},

	$AFTER_SET_IR : function(sIR, bDontAddUndoHistory){
		bDontAddUndoHistory = bDontAddUndoHistory || false;
		if(!bDontAddUndoHistory) this.oApp.exec("RECORD_UNDO_ACTION", ["SET CONTENTS"]);
	},

	$ON_REGISTER_EDITING_AREA : function(oEditingAreaPlugin){
		this.oEditingMode[oEditingAreaPlugin.sMode] = oEditingAreaPlugin;
		this.attachDocumentEvents(oEditingAreaPlugin.oEditingArea);
	},

	$ON_MSG_EDITING_AREA_RESIZE_STARTED : function(){
		this.oActivePlugin.elEditingArea.style.display = "none";

		this.iStartingHeight = parseInt(this.elEditingAreaContainer.style.height);
	},

	$ON_RESIZE_EDITING_AREA: function(ipNewWidth, ipNewHeight){
		var iNewWidth = parseInt(ipNewWidth);
		var iNewHeight = parseInt(ipNewHeight);

		if(iNewWidth < this.niMinWidth) iNewWidth = this.niMinWidth;
		if(iNewHeight < this.nMinHeight) iNewHeight = this.nMinHeight;

		if(ipNewWidth) this.elEditingAreaContainer.style.width = iNewWidth + "px";
		if(ipNewHeight) this.elEditingAreaContainer.style.height = iNewHeight + "px";
	},

	$ON_RESIZE_EDITING_AREA_BY : function(ipWidthChange, ipHeightChange){
		var iWidthChange = parseInt(ipWidthChange);
		var iHeightChange = parseInt(ipHeightChange);

		var iWidth = this.elEditingAreaContainer.style.width?parseInt(this.elEditingAreaContainer.style.width)+iWidthChange:null;
		var iHeight = this.elEditingAreaContainer.style.height?this.iStartingHeight+iHeightChange:null;

		this.oApp.exec("RESIZE_EDITING_AREA", [iWidth, iHeight]);
	},

	$ON_MSG_EDITING_AREA_RESIZE_ENDED : function(FnMouseDown, FnMouseMove, FnMouseUp){
		this.oActivePlugin.elEditingArea.style.display = "block";
		this._setEditingAreaDimension();
	},

	_setEditingAreaDimension : function(){
		this.oActivePlugin.elEditingArea.style.height = this.elEditingAreaContainer.style.height;
		this.oActivePlugin.elEditingArea.style.width = this.elEditingAreaContainer.style.width;
	},

	attachDocumentEvents : function(doc){
		this.oApp.registerBrowserEvent(doc, "click", "EVENT_EDITING_AREA_CLICK");
		this.oApp.registerBrowserEvent(doc, "mousedown", "EVENT_EDITING_AREA_MOUSEDOWN");
		this.oApp.registerBrowserEvent(doc, "mousemove", "EVENT_EDITING_AREA_MOUSEMOVE");
		this.oApp.registerBrowserEvent(doc, "mouseup", "EVENT_EDITING_AREA_MOUSEUP");
		this.oApp.registerBrowserEvent(doc, "keydown", "EVENT_EDITING_AREA_KEYDOWN");
		this.oApp.registerBrowserEvent(doc, "keypress", "EVENT_EDITING_AREA_KEYPRESS");
		this.oApp.registerBrowserEvent(doc, "keyup", "EVENT_EDITING_AREA_KEYUP");
	},

	getIR : function(){
		return this.oActivePlugin.getIR();
	},

	setIR : function(sIR, bDontAddUndo){
		this.oApp.exec("SET_IR", [sIR, bDontAddUndo]);
	},

	getEditingMode : function(){
		return this.oActivePlugin.sMode;
	}
});
//}

//{
/**
  * @fileOverview This file contains Xpress plugin that takes care of the operations directly related to editing the HTML source code using Textarea element
 * @name hp_XE_EditingArea_HTMLSrc.js
 * @required XE_EditingAreaManager
 */
xe.XE_EditingArea_HTMLSrc = jQuery.Class({
	name : "XE_EditingArea_HTMLSrc",

	sMode : "HTMLSrc",
	textarea : null,

	$init : function(textarea){
		this.textarea = jQuery.$(textarea);
		this.elEditingArea = this.textarea;
	},

	$BEFORE_MSG_APP_READY : function(){
		this.oEditingArea = this.textarea;
		this.oApp.exec("REGISTER_EDITING_AREA", [this]);
	},

	$ON_CHANGE_EDITING_MODE : function(sMode, bNoFocus){
		if(sMode == this.sMode){
			this.textarea.style.display = "block";
		}else{
			this.textarea.style.display = "none";
		}
	},

	$ON_PASTE_HTML : function(sHTML, oPSelection){
		if(this.oApp.getEditingMode() != this.sMode) return;

		var o = new TextRange(this.textarea);
		o.paste(sHTML);
		this.textarea.focus();
	},

	getIR : function(){
		var sIR;
		var sContent = this.textarea.value;

		if(this.oApp.applyConverter)
			sIR = this.oApp.applyConverter(this.sMode+"_TO_IR", sContent);
		else
			sIR = sContent;

		return sIR;
	},

	setIR : function(sIR){
		var sContent;

		if(this.oApp.applyConverter)
			sContent = this.oApp.applyConverter("IR_TO_"+this.sMode, sIR);
		else
			sContent = sIR;

		this.textarea.value = sContent;
	},

	focus : function(){
		this.textarea.focus();
	}
});

var TextRange = function(oEl) {
	this._o = oEl;
};

/**
 * Selection for textfield
 *
 * @author hooriza
 */
TextRange.prototype.getSelection = function() {
	var obj = this._o;
	var ret = [ -1, -1 ];

	if (isNaN(this._o.selectionStart)) {
		obj.focus();

		// textarea support added by nagoon97
		var range = document.body.createTextRange();
		var rangeField = null;

		rangeField = document.selection.createRange().duplicate();
		range.moveToElementText(obj);
		rangeField.collapse(true);
		range.setEndPoint("EndToEnd", rangeField);
		ret[0] = range.text.length;

		rangeField = document.selection.createRange().duplicate();
		range.moveToElementText(obj);
		rangeField.collapse(false);
		range.setEndPoint("EndToEnd", rangeField);
		ret[1] = range.text.length;

		obj.blur();
	} else {
		ret[0] = obj.selectionStart;
		ret[1] = obj.selectionEnd;
	}

	return ret;
};

TextRange.prototype.setSelection = function(start, end) {

	var obj = this._o;
	if (typeof end == 'undefined') end = start;

	if (obj.setSelectionRange) {

		obj.setSelectionRange(start, end);

	} else if (obj.createTextRange) {

		var range = obj.createTextRange();

		range.collapse(true);
		range.moveStart("character", start);
		range.moveEnd("character", end - start);
		range.select();

		obj.blur();
	}

};

TextRange.prototype.copy = function() {

	var r = this.getSelection();
	return this._o.value.substring(r[0], r[1]);

};

TextRange.prototype.paste = function(sStr) {

	var obj = this._o;
	var sel = this.getSelection();

	var value = obj.value;

	var pre = value.substr(0, sel[0]);
	var post = value.substr(sel[1]);

	value = pre + sStr + post;
	obj.value = value;

	var n = 0;
	if ( typeof document.body.style.maxHeight == "undefined" ) {
		var a = pre.match( /\n/gi );
		n = ( a != null ? a.length : 0 );
	}
	this.setSelection(sel[0] + sStr.length - n );

};

TextRange.prototype.cut = function() {
	var r = this.copy();
	this.paste('');

	return r;
};
//}
//{
/**
 * @fileOverview This file contains Xpress plugin that takes care of the operations directly related to WYSIWYG iframe
 * @name hp_XE_EditingArea_WYSIWYG.js
 */
xe.XE_EditingArea_WYSIWYG = jQuery.Class({
	name : "XE_EditingArea_WYSIWYG",
	status : xe.PLUGIN_STATUS["NOT_READY"],

	sMode : "WYSIWYG",
	iframe : null,
	doc : null,

	iLastUndoRecorded : 0,
	iMinUndoInterval : 3000,

	_nIFrameReadyCount : 50,

	$init : function(iframe){
		this.iframe = jQuery.$(iframe);

		this.initIframe();

		this.elEditingArea = iframe;
	},

	$BEFORE_MSG_APP_READY : function(){
		this.oEditingArea = this.doc;
		this.oApp.exec("REGISTER_EDITING_AREA", [this]);
		this.oApp.exec("ADD_APP_PROPERTY", ["getWYSIWYGWindow", jQuery.fnBind(this.getWindow, this)]);
		this.oApp.exec("ADD_APP_PROPERTY", ["getWYSIWYGDocument", jQuery.fnBind(this.getDocument, this)]);
	},

	$ON_MSG_APP_READY : function(){
		// uncomment this line if you wish to use the IE-style cursor in FF
		this.getDocument().body.style.cursor = "text";

		if(jQuery.browser.msie){
			jQuery(this.doc)
				.unbind('keydown.ea')
				.bind('keydown.ea', jQuery.fnBind(
					function(weEvent){
						if(this.doc.selection.type.toLowerCase() == 'control' && weEvent.keyCode == 8)  {
							this.oApp.exec("EXECCOMMAND", ['delete', false, false]);
							weEvent.preventDefault(); weEvent.stopPropagation();
						}
					}
				, this));
			jQuery(this.doc.body)
				.unbind('mousedown.ea')
				.bind('mousedown.ea', jQuery.fnBind(
					function(weEvent){
						this._oIERange = null;
						this._bIERangeReset = true;
					}
				, this))
				.unbind('beforedeactivate.ea')
				.bind('beforedeactivate.ea', jQuery.fnBind(
					function(weEvent){
						// without this, cursor won't make it inside a table.
						// mousedown(_oIERange gets reset) -> beforedeactivate(gets fired for table) -> RESTORE_IE_SELECTION
						if(this._bIERangeReset) return;

						var tmpRange = this.getDocument().selection.createRange(0);
						// Control range does not have parentElement
						if(tmpRange.parentElement && tmpRange.parentElement() && tmpRange.parentElement().tagName == "INPUT"){
							this._oIERange = this._oPrevIERange;
						}else{
							this._oIERange = tmpRange;
						}
					}
				, this))
				.unbind('mouseup.ea')
				.bind('mouseup.ea', jQuery.fnBind(
					function(weEvent){
						this._bIERangeReset = false;
					}
				, this));
		}
	},

	$ON_CHANGE_EDITING_MODE : function(sMode, bNoFocus){
		if(sMode == this.sMode){
			this.iframe.style.display = "block";

			this.oApp.exec("REFRESH_WYSIWYG", []);
			this.oApp.exec("SET_EDITING_WINDOW", [this.getWindow()]);
		}else{
			this.iframe.style.display = "none";
		}
	},

	$AFTER_CHANGE_EDITING_MODE : function(sMode, bNoFocus){
		this._oIERange = null;
	},

	$ON_REFRESH_WYSIWYG : function(){
		if(!jQuery.browser.mozilla) return;

		this._disableWYSIWYG();
		this._enableWYSIWYG();
	},

	$ON_ENABLE_WYSIWYG : function(){
		this._enableWYSIWYG();
	},

	$ON_DISABLE_WYSIWYG : function(){
		this._disableWYSIWYG();
	},

	$ON_EVENT_EDITING_AREA_KEYUP : function(oEvent){
		// 33, 34: page up/down, 35,36: end/home, 37,38,39,40: left, up, right, down
		if(oEvent.keyCode == 229 || oEvent.keyCode == 13 || oEvent.altKey || oEvent.ctrlKey || (oEvent.keyCode >= 33 && oEvent.keyCode <= 40) || oEvent.keyCode == 16) return;
		this._recordUndo(oEvent);
	},

	$ON_PASTE_HTML : function(sHTML, oPSelection){
		if(this.oApp.getEditingMode() != this.sMode) return;

		var oSelection = oPSelection || this.oApp.getSelection();
		oSelection.pasteHTML(sHTML);

		// every browser except for IE may modify the innerHTML when it is inserted
		if(!jQuery.browser.msie){
			var sTmpBookmark = oSelection.placeStringBookmark();
			this.oApp.getWYSIWYGDocument().body.innerHTML = this.oApp.getWYSIWYGDocument().body.innerHTML;
			oSelection.moveToBookmark(sTmpBookmark);
			oSelection.collapseToEnd();
			oSelection.select();
			oSelection.removeStringBookmark(sTmpBookmark);
		}

		this.oApp.exec("RECORD_UNDO_ACTION", ["INSERT HTML"]);
	},

	$AFTER_MSG_EDITING_AREA_RESIZE_ENDED : function(FnMouseDown, FnMouseMove, FnMouseUp){
		this.oApp.exec("REFRESH_WYSIWYG", []);
	},

	$ON_RESTORE_IE_SELECTION : function(){
		if(this._oIERange){
			this._oIERange.select();
			this._oPrevIERange = this._oIERange;
			this._oIERange = null;
		}
	},

	initIframe : function(){
		try {
			this.doc = this.iframe.contentWindow.document;
			if (this.doc == null || this.doc.location.href == 'about:blank') {
				throw new Error('Access denied');
			}

			this._enableWYSIWYG();

			this.status = xe.PLUGIN_STATUS["READY"];
		} catch(e) {
			if(this._nIFrameReadyCount-- > 0){
				setTimeout(jQuery.fnBind(this.initIframe, this), 100);
			}else{
				throw("iframe for WYSIWYG editing mode can't be initialized. Please check if the iframe document exists and is also accessable(cross-domain issues). ");
			}
		}
	},

	getIR : function(){
		var sContent = this.doc.body.innerHTML;
		var sIR;

		if(this.oApp.applyConverter)
			sIR = this.oApp.applyConverter(this.sMode+"_TO_IR", sContent);
		else
			sIR = sContent;

		return sIR;
	},

	setIR : function(sIR){
		var sContent;
		if(this.oApp.applyConverter)
			sContent = this.oApp.applyConverter("IR_TO_"+this.sMode, sIR);
		else
			sContent = sIR;

		this.doc.body.innerHTML = sContent;

		if(jQuery.browser.mozilla){
			if(this.doc.body.innerHTML == "") this.doc.body.innerHTML = "<br>";
		}
	},

	getWindow : function(){
		return this.iframe.contentWindow;
	},

	getDocument : function(){
		return this.iframe.contentWindow.document;
	},

	focus : function(){
		this.getWindow().focus();
		this.oApp.exec("RESTORE_IE_SELECTION", []);
	},

	_recordUndo : function(oKeyInfo){
		var curTime = new Date();
		if(curTime-this.iLastUndoRecorded < this.iMinUndoInterval) return;
		this.oApp.exec("RECORD_UNDO_ACTION", ["KEYPRESS"]);

		this.iLastUndoRecorded = new Date();

		this.prevKeyCode = oKeyInfo.keyCode;
	},

	_enableWYSIWYG : function(){
		if (jQuery.browser.msie){
			var fake = jQuery('<input type="text" style="position:absolute;width:1px;height:1px;left:-9px">');
			jQuery(document.body).prepend(fake);
			fake.focus();

			this.getDocument().body.contentEditable = true;

			setTimeout(function(){fake.remove()}, 100);
		} else {
			this.getDocument().designMode = "on";
		}
	},

	_disableWYSIWYG : function(){
		if (jQuery.browser.msie){
			this.getDocument().body.contentEditable = false;
		} else {
			this.getDocument().designMode = "off";
		}
	}
});
//}
//{
/**
 * @fileOverview This file contains Xpress plugin that takes care of the operations related to resizing the editing area vertically
 * @name hp_XE_EditingAreaVerticalResizer.js
 */
xe.XE_EditingAreaVerticalResizer = jQuery.Class({
	name : "XE_EditingAreaVerticalResizer",
	oResizeGrip : null,

	$init : function(oAppContainer){
		this._assignHTMLObjects(oAppContainer);

		this.$FnMouseDown = jQuery.fnBind(this._mousedown, this);
		this.$FnMouseMove = jQuery.fnBind(this._mousemove, this);
		this.$FnMouseUp = jQuery.fnBind(this._mouseup, this);

		jQuery(this.oResizeGrip).bind("mousedown", this.$FnMouseDown);
	},

	_assignHTMLObjects : function(oAppContainer){
		oAppContainer = jQuery.$(oAppContainer) || document;

		this.oResizeGrip = jQuery(".xpress_xeditor_editingArea_verticalResizer", oAppContainer).get(0);
	},

	_mousedown : function(oEvent){
		this.iStartHeight = oEvent.clientY;

		jQuery(document).bind("mousemove", this.$FnMouseMove);
		jQuery(document).bind("mouseup", this.$FnMouseUp);

		this.oApp.exec("MSG_EDITING_AREA_RESIZE_STARTED", [this.$FnMouseDown, this.$FnMouseMove, this.$FnMouseUp]);
	},

	_mousemove : function(oEvent){
		var iHeightChange = oEvent.clientY - this.iStartHeight;

		this.oApp.exec("RESIZE_EDITING_AREA_BY", [0, iHeightChange]);
	},

	_mouseup : function(oEvent){
		jQuery(document).unbind("mousemove", this.$FnMouseMove);
		jQuery(document).unbind("mouseup", this.$FnMouseUp);

		this.oApp.exec("MSG_EDITING_AREA_RESIZE_ENDED", [this.$FnMouseDown, this.$FnMouseMove, this.$FnMouseUp]);
	}
});
//}
//{
/**
 * @fileOverview This file contains Xpress plugin that takes care of the basic editor commands
 * @name hp_XE_ExecCommand.js
 */
xe.XE_ExecCommand = jQuery.Class({
	name : "XE_ExecCommand",
	oEditingArea : null,

	$init : function(oEditingArea){
		this.oEditingArea = oEditingArea;
	},

	$BEFORE_MSG_APP_READY : function(){
		// the right document will be available only when the src is completely loaded
		if(this.oEditingArea && this.oEditingArea.tagName == "IFRAME")
			this.oEditingArea = this.oEditingArea.contentWindow.document;
	},

	$ON_MSG_APP_READY : function(){
		this.oApp.exec("REGISTER_HOTKEY", ["ctrl+b", "EXECCOMMAND", ["bold", false, false]]);
		this.oApp.exec("REGISTER_HOTKEY", ["ctrl+u", "EXECCOMMAND", ["underline", false, false]]);
		this.oApp.exec("REGISTER_HOTKEY", ["ctrl+i", "EXECCOMMAND", ["italic", false, false]]);
		this.oApp.exec("REGISTER_HOTKEY", ["ctrl+d", "EXECCOMMAND", ["strikethrough", false, false]]);

		this.oApp.exec("REGISTER_UI_EVENT", ["bold", "click", "EXECCOMMAND", ["bold", false, false]]);
		this.oApp.exec("REGISTER_UI_EVENT", ["underline", "click", "EXECCOMMAND", ["underline", false, false]]);
		this.oApp.exec("REGISTER_UI_EVENT", ["italic", "click", "EXECCOMMAND", ["italic", false, false]]);
		this.oApp.exec("REGISTER_UI_EVENT", ["lineThrough", "click", "EXECCOMMAND", ["strikethrough", false, false]]);
		this.oApp.exec("REGISTER_UI_EVENT", ["superscript", "click", "EXECCOMMAND", ["superscript", false, false]]);
		this.oApp.exec("REGISTER_UI_EVENT", ["subscript", "click", "EXECCOMMAND", ["subscript", false, false]]);
		this.oApp.exec("REGISTER_UI_EVENT", ["justifyleft", "click", "EXECCOMMAND", ["justifyleft", false, false]]);
		this.oApp.exec("REGISTER_UI_EVENT", ["justifycenter", "click", "EXECCOMMAND", ["justifycenter", false, false]]);
		this.oApp.exec("REGISTER_UI_EVENT", ["justifyright", "click", "EXECCOMMAND", ["justifyright", false, false]]);
		this.oApp.exec("REGISTER_UI_EVENT", ["justifyfull", "click", "EXECCOMMAND", ["justifyfull", false, false]]);
		this.oApp.exec("REGISTER_UI_EVENT", ["orderedlist", "click", "EXECCOMMAND", ["insertorderedlist", false, false]]);
		this.oApp.exec("REGISTER_UI_EVENT", ["unorderedlist", "click", "EXECCOMMAND", ["insertunorderedlist", false, false]]);
		this.oApp.exec("REGISTER_UI_EVENT", ["outdent", "click", "EXECCOMMAND", ["outdent", false, false]]);
		this.oApp.exec("REGISTER_UI_EVENT", ["indent", "click", "EXECCOMMAND", ["indent", false, false]]);
	},

	$BEFORE_EXECCOMMAND : function(sCommand, bUserInterface, vValue){
		this._bOnlyCursorChanged = false;

		this.oApp.exec("FOCUS", []);

		if(sCommand.match(/^bold|underline|italic|strikethrough|superscript|subscript$/i)){
			var oSelection = this.oApp.getSelection();
			if(oSelection.collapsed) this._bOnlyCursorChanged = true;
		}

		if(!this._bOnlyCursorChanged){
			this.oApp.exec("RECORD_UNDO_BEFORE_ACTION", [sCommand]);
		}
	},

	$ON_EXECCOMMAND : function(sCommand, bUserInterface, vValue){
		bUserInterface = (bUserInterface == "" || bUserInterface)?bUserInterface:false;
		vValue = (vValue == "" || vValue)?vValue:false;

		this.oEditingArea.execCommand(sCommand, bUserInterface, vValue);
	},

	$AFTER_EXECCOMMAND : function(sCommand, bUserInterface, vValue){
		if(!this._bOnlyCursorChanged){
			this.oApp.exec("RECORD_UNDO_AFTER_ACTION", [sCommand]);
		}

		this.oApp.exec("CHECK_STYLE_CHANGE", []);
	}
});
//}

//{
/**
 * @fileOverview This file contains Xpress plugin that takes care of the operations related to styling the font
 * @name hp_XE_WYSIWYGStyler.js
 * @required XE_EditingArea_WYSIWYG, XpressRangeManager
 */
xe.XE_WYSIWYGStyler = jQuery.Class({
	name : "XE_WYSIWYGStyler",

	$PRECONDITION : function(sFullCommand, aArgs){
		return (this.oApp.getEditingMode() == "WYSIWYG");
	},

	$ON_SET_WYSIWYG_STYLE : function(oStyles){
		var oSelection = this.oApp.getSelection();

		// style cursor
		if(oSelection.collapsed){
			var oSpan = this.oApp.getWYSIWYGDocument().createElement("SPAN");
			oSelection.insertNode(oSpan);
			oSpan.innerHTML = unescape("%uFEFF");

			var sValue;
			for(var sName in oStyles){
				sValue = oStyles[sName];

				if(typeof sValue != "string") continue;

				oSpan.style[sName] = sValue;
			}

			oSelection.selectNodeContents(oSpan);
			oSelection.collapseToEnd();
			oSelection._window.focus();
			oSelection._window.document.body.focus();
			oSelection.select();

			// FF3 will actually display %uFEFF when it is followed by a number AND certain font-family is used(like Gulim), so remove the chcaracter for FF3
			if(jQuery.browser.mozilla && jQuery.browser.nVersion == 3)
				oSpan.innerHTML = "";

			return;
		}

		this.oApp.exec("RECORD_UNDO_BEFORE_ACTION", ["FONT STYLE"]);

		oSelection.styleRange(oStyles);
		oSelection._window.focus();
		oSelection.select();

		this.oApp.exec("RECORD_UNDO_AFTER_ACTION", ["FONT STYLE"]);
	}
});
//}

//{
/**
 * @fileOverview This file contains Xpress plugin that takes care of the operations related to detecting the style change
 * @name hp_XE_WYSIWYGStyleGetter.js
 */
xe.XE_WYSIWYGStyleGetter = jQuery.Class({
	name : "XE_WYSIWYGStyleGetter",

	hKeyUp : null,

	getStyleInterval : 200,

	oStyleMap : {
		fontFamily : {
			type : "Value",
			css : "fontFamily"
		},
		fontSize : {
			type : "Value",
			css : "fontSize"
		},
		lineHeight : {
			type : "Value",
			css : "lineHeight",
			converter : function(sValue, oStyle){
				if(!sValue.match(/px$/)) return sValue;

				return Math.ceil((parseInt(sValue)/parseInt(oStyle.fontSize))*10)/10;
			}
		},
		bold : {
			command : "bold"
		},
		underline : {
			command : "underline"
		},
		italic : {
			command : "italic"
		},
		lineThrough : {
			command : "strikethrough"
		},
		superscript : {
			command : "superscript"
		},
		subscript : {
			command : "subscript"
		},
		justifyleft : {
			command : "justifyleft"
		},
		justifycenter : {
			command : "justifycenter"
		},
		justifyright : {
			command : "justifyright"
		},
		justifyfull : {
			command : "justifyfull"
		},
		orderedlist : {
			command : "insertorderedlist"
		},
		unorderedlist : {
			command : "insertunorderedlist"
		}
	},

	$init : function(){
		this.oStyle = this._getBlankStyle();
	},

	$PRECONDITION : function(){
		if(this.oApp.getEditingMode() != "WYSIWYG") return false;

		return true;
	},

	$ON_MSG_APP_READY : function(){
		this.oDocument = this.oApp.getWYSIWYGDocument();
		this.oApp.exec("ADD_APP_PROPERTY", ["getCurrentStyle", jQuery.fnBind(this.getCurrentStyle, this)]);
	},

	$ON_EVENT_EDITING_AREA_MOUSEUP : function(oEvnet){
		if(this.hKeyUp) clearTimeout(this.hKeyUp);
		this.oApp.exec("CHECK_STYLE_CHANGE", []);
	},

	$ON_EVENT_EDITING_AREA_KEYUP : function(oEvent){
		/*
		backspace 8
		page up 33
		page down 34
		end 35
		home 36
		left arrow 37
		up arrow 38
		right arrow 39
		down arrow 40
		insert 45
		delete 46
		*/
		if(!(oEvent.keyCode == 8 || (oEvent.keyCode >= 33 && oEvent.keyCode <= 40) || oEvent.keyCode == 45 || oEvent.keyCode == 46)) return;

		if(this.hKeyUp) clearTimeout(this.hKeyUp);

		this.hKeyUp = setTimeout(jQuery.fnBind(this.oApp.exec, this.oApp, "CHECK_STYLE_CHANGE", []), this.getStyleInterval);
	},

	$ON_CHECK_STYLE_CHANGE : function(){
		this._getStyle();
	},

	$ON_RESET_STYLE_STATUS : function(){
		var oBlankStyle = this._getBlankStyle();
		for(var sAttributeName in oBlankStyle)
			this.oApp.exec("SET_STYLE_STATUS", [sAttributeName, oBlankStyle[sAttributeName]]);
	},

	getCurrentStyle : function(){
		return this.oStyle;
	},

	_check_style_change : function(){
		this.oApp.exec("CHECK_STYLE_CHANGE", []);
	},

	_getBlankStyle : function(){
		var oBlankStyle = {};
		for(var attributeName in this.oStyleMap){
			if(this.oStyleMap[attributeName].type == "Value")
				oBlankStyle[attributeName] = "";
			else
				oBlankStyle[attributeName] = 0;
		}

		return oBlankStyle;
	},

	_getStyle : function(){
		var oSelection = this.oApp.getSelection();

		var funcFilter = function(oNode){
			if (!oNode.childNodes || oNode.childNodes.length == 0)
				return true;
			else
				return false;
		}

		var aBottomNodes = oSelection.getNodes(false, funcFilter);

		var oStyle, oBaseStyle, oTmpStyle, attributeName;
		if(aBottomNodes.length == 0){
			oStyle = this._getStyleOf(oSelection.commonAncestorContainer);
		}else{
			oStyle = this._getStyleOf(aBottomNodes[0]);
		}

		for(attributeName in oStyle){
			if(this.oStyleMap[attributeName].converter){
				oStyle[attributeName] = this.oStyleMap[attributeName].converter(oStyle[attributeName], oStyle);
			}

			if(this.oStyle[attributeName] != oStyle[attributeName])
				this.oApp.exec("MSG_STYLE_CHANGED", [attributeName, oStyle[attributeName]]);
		}

		this.oStyle = oStyle;
	},

	_getStyleOf : function(oNode){
		var oStyle = this._getBlankStyle();

		// this must not happen
		if(!oNode) return oStyle;

		if(oNode.nodeType == 3) oNode = oNode.parentNode;

		var welNode = jQuery(oNode);
		var attribute, cssName;
		for(var styleName in this.oStyle){
			attribute = this.oStyleMap[styleName];

			if(attribute.type && attribute.type == "Value"){
				if(attribute.css){
					var sValue = welNode.css(attribute.css);

					if(styleName == "fontFamily"){
						sValue = sValue.split(/,/)[0];
					}

					oStyle[styleName] = sValue;
				}else{
					if(attribute.command){
						try{
							oStyle[styleName] = this.oDocument.queryCommandState(attribute.command);
						}catch(e){}
					}else{
						// todo
					}
				}
			}else{
				if(attribute.command){
					try{
						if(this.oDocument.queryCommandState(attribute.command)){
							oStyle[styleName] = 1;
						}else{
							oStyle[styleName] = 0;
						}
					}catch(e){}
				}else{
					// todo
				}
			}
		}
		return oStyle;
	}
});
//}
//{
/**
 * @fileOverview This file contains Xpress plugin that takes care of the operations related to changing the font size using Select element
 * @name hp_XE_FontSizeWithSelectUI.js
 */
xe.XE_FontSizeWithSelectUI = jQuery.Class({
	name : "XE_FontSizeWithSelectUI",

	$init : function(elAppContainer){
		this._assignHTMLObjects(elAppContainer);
	},

	_assignHTMLObjects : function(elAppContainer){
		this.elFontSizeSelect = jQuery("SELECT.xpress_xeditor_ui_fontSize_select", elAppContainer).get(0);
	},

	$ON_MSG_APP_READY : function(){
		this.oApp.registerBrowserEvent(this.elFontSizeSelect, "change", "SET_FONTSIZE_FROM_SELECT_UI");
		this.elFontSizeSelect.selectedIndex = 0;
	},

	$ON_MSG_STYLE_CHANGED : function(sAttributeName, sAttributeValue){
		if(sAttributeName == "fontSize"){
			this.elFontSizeSelect.value = sAttributeValue;
			if(this.elFontSizeSelect.selectedIndex < 0) this.elFontSizeSelect.selectedIndex = 0;
		}
	},

	$ON_SET_FONTSIZE_FROM_SELECT_UI : function(){
		var sFontSize = this.elFontSizeSelect.value;
		if(!sFontSize) return;

		this.oApp.exec("SET_WYSIWYG_STYLE", [{"fontSize":sFontSize}]);
		this.oApp.exec("CHECK_STYLE_CHANGE", []);
	}
});
//}
//{
/**
 * @fileOverview This file contains Xpress plugin that takes care of the operations related to changing the font name using Select element
 * @name hp_XE_FontNameWithSelectUI.js
 */
xe.XE_FontNameWithSelectUI = jQuery.Class({
	name : "XE_FontNameWithSelectUI",

	$init : function(elAppContainer){
		this._assignHTMLObjects(elAppContainer);
	},

	_assignHTMLObjects : function(elAppContainer){
		this.elFontNameSelect = jQuery("SELECT.xpress_xeditor_ui_fontName_select", elAppContainer).get(0);
	},

	$ON_MSG_APP_READY : function(){
		this.oApp.registerBrowserEvent(this.elFontNameSelect, "change", "SET_FONTNAME_FROM_SELECT_UI");
		this.elFontNameSelect.selectedIndex = 0;
	},

	$ON_MSG_STYLE_CHANGED : function(sAttributeName, sAttributeValue){
		if(sAttributeName == "fontFamily"){
			this.elFontNameSelect.value = sAttributeValue.toLowerCase();
			if(this.elFontNameSelect.selectedIndex < 0) this.elFontNameSelect.selectedIndex = 0;
		}
	},

	$ON_SET_FONTNAME_FROM_SELECT_UI : function(){
		var sFontName = this.elFontNameSelect.value;
		if(!sFontName) return;

		this.oApp.exec("SET_WYSIWYG_STYLE", [{"fontFamily":sFontName}]);
		this.oApp.exec("CHECK_STYLE_CHANGE", []);
	}
});
//}
//{
/**
 * @fileOverview This file contains Xpress plugin that takes care of the operations related to setting/changing the lineheight
 * @name hp_XE_LineHeight.js
 */
xe.XE_LineHeight = jQuery.Class({
	name : "XE_LineHeight",

	$init : function(oAppContainer){
		this._assignHTMLObjects(oAppContainer);
	},

	_assignHTMLObjects : function(oAppContainer){
	},

	$ON_SET_LINEHEIGHT : function(nLineHeight){
		this.setLineHeight(nLineHeight);
	},

	getLineHeight : function(){
		var nodes = this._getSelectedNodes(false);

		var curWrapper, prevWrapper;
		var iCurHeight, iHeight;

		if(nodes.length == 0) return -1;

		var iLength = nodes.length;

		if(iLength == 0){
			iHeight = -1;
		}else{
			prevWrapper = this._getLineWrapper(nodes[0]);
			iHeight = this._getWrapperLineheight(prevWrapper);
		}

		var firstNode = this.oSelection.getStartNode();

		if(iHeight > 0){
			for(var i=1; i<iLength; i++){
				if(this._isChildOf(nodes[i], curWrapper)) continue;
				if(!nodes[i]) continue;

				curWrapper = this._getLineWrapper(nodes[i]);
				if(curWrapper == prevWrapper) continue;

				curHeight = this._getWrapperLineheight(curWrapper);

				if(curHeight != iHeight){
					iHeight = -1;
					break;
				}

				prevWrapper = curWrapper;
			}
		}

		curWrapper = this._getLineWrapper(nodes[iLength-1]);

		var lastNode = this.oSelection.getEndNode();

		selectText = jQuery.fnBind(function(firstNode, lastNode){
			this.oSelection.setEndNodes(firstNode, lastNode);
			this.oSelection.select();
		}, this, firstNode, lastNode);

		setTimeout(selectText, 100);

		return iHeight;
	},

	// height in percentage. For example pass 1 to set the line height to 100% and 1.5 to set it to 150%
	setLineHeight : function(height) {
		thisRef = this;

		function _setLineheight(div, height){
			if(!div){
				// try to wrap with P first
				try{
					div = thisRef.oSelection.surroundContentsWithNewNode("P");
				// if the range contains a block-level tag, wrap it with a DIV
				}catch(e){
					div = thisRef.oSelection.surroundContentsWithNewNode("DIV");
				}
			}

			div.style.lineHeight = height;

			return div;
		}

		function isInBody(node){
			while(node && node.tagName != "BODY"){
				node = xe.DOMFix.parentNode(node);
			}
			if(!node) return false;

			return true;
		}

		var nodes = this._getSelectedNodes(false);
		if(nodes.length == 0){
			return;
		}

		var curWrapper, prevWrapper;
		var iLength = nodes.length;

		this.oApp.exec("RECORD_UNDO_BEFORE_ACTION", ["LINEHEIGHT"]);

		prevWrapper = this._getLineWrapper(nodes[0]);
		prevWrapper = _setLineheight(prevWrapper, height);

		var startNode = prevWrapper;
		var endNode = prevWrapper;

		for(var i=1; i<iLength; i++){
			// Skip the node if a copy of the node were wrapped and the actual node no longer exists within the document.
			try{
				if(!isInBody(xe.DOMFix.parentNode(nodes[i]))) continue;
			}catch(e){continue;}

			if(this._isChildOf(nodes[i], curWrapper)) continue;

			curWrapper = this._getLineWrapper(nodes[i]);

			if(curWrapper == prevWrapper) continue;

			curWrapper = _setLineheight(curWrapper, height);

			prevWrapper = curWrapper;
		}

		endNode = curWrapper || startNode;

		setTimeout(jQuery.fnBind(function(startNode, endNode){
			this.oSelection.setEndNodes(startNode, endNode);
			this.oSelection.select();
			this.oApp.exec("RECORD_UNDO_AFTER_ACTION", ["LINEHEIGHT"]);
		}, this, startNode, endNode), 100);
	},
	_getSelectedNodes : function(bDontUpdate){
		if(!bDontUpdate)
			this.oSelection = this.oApp.getSelection();

		if(this.oSelection.collapsed) this.oSelection.selectNode(this.oSelection.commonAncestorContainer);

		var nodes = this.oSelection.getTextNodes();

		if(nodes.length == 0){
			var tmp = this.oSelection.getStartNode();
			if(tmp){
				nodes[0] = tmp;
			}else{
				nodes = [];
			}
		}

		return nodes;
	},
	_getWrapperLineheight : function(div){
		var iLineHeight = '';
		if(div && div.style.lineHeight){
			iLineHeight = div.style.lineHeight;
		}else{
			div = this.oSelection.commonAncesterContainer;
			while(div && !this.oSelection.rxLineBreaker.test(div.tagName)){
				if(div && div.style.lineHeight){
					iLineHeight = div.style.lineHeight;
					break;
				}
				div = xe.DOMFix.parentNode(div);
			}
		}

		return iLineHeight;
	},

	_isChildOf : function(node, container){
		while(node && node.tagName != "BODY"){
			if(node == container) return true;
			node = xe.DOMFix.parentNode(node);
		}

		return false;
	},
 	_getLineWrapper : function(node){
		var oTmpSelection = this.oApp.getEmptySelection();
		oTmpSelection.selectNode(node);
		var oLineInfo = oTmpSelection.getLineInfo();
		var oStart = oLineInfo.oStart;
		var oEnd = oLineInfo.oEnd;

		var a, b;
		var breakerA, breakerB;
		var div = null;

		a = oStart.oNode;
		breakerA = oStart.oLineBreaker;
		b = oEnd.oNode;
		breakerB = oEnd.oLineBreaker;

		this.oSelection.setEndNodes(a, b);

		if(breakerA == breakerB){
			if(breakerA.tagName == "P" || breakerA.tagName == "DIV"){
				div = breakerA;
			}else{
				this.oSelection.setEndNodes(breakerA.firstChild, breakerA.lastChild);
			}
		}

		return div;
 	}
 });
//}
//{
/**
 * @fileOverview This file contains Xpress plugin that takes care of the operations related to changing the lineheight using Select element
 * @name hp_XE_LineHeightWithSelectUI.js
 */
xe.XE_LineHeightWithSelectUI = jQuery.Class({
	name : "XE_LineHeightWithSelectUI",

	_assignHTMLObjects : function(elAppContainer){
		this.elLineHeightSelect = jQuery("SELECT.xpress_xeditor_ui_lineHeight_select", elAppContainer).get(0);
	},

	$ON_MSG_APP_READY : function(){
		this.oApp.registerBrowserEvent(this.elLineHeightSelect, "change", "SET_LINEHEIGHT_FROM_SELECT_UI");
		this.elLineHeightSelect.selectedIndex = 0;
	},

	$ON_MSG_STYLE_CHANGED : function(sAttributeName, sAttributeValue){
		if(sAttributeName == "lineHeight"){
			this.elLineHeightSelect.value = sAttributeValue;
			if(this.elLineHeightSelect.selectedIndex < 0) this.elLineHeightSelect.selectedIndex = 0;
		}
	},

	$ON_SET_LINEHEIGHT_FROM_SELECT_UI : function(){
		var nLineHeight = this.elLineHeightSelect.value;
		if(!nLineHeight) return;

		this.elLineHeightSelect.selectedIndex = 0;
		this.oApp.exec("SET_LINEHEIGHT", [nLineHeight]);
		this.oApp.exec("CHECK_STYLE_CHANGE", []);
	}
}).extend(xe.XE_LineHeight);
//}
//{
/**
 * @fileOverview This file contains Xpress plugin that takes care of the operations directly related to the color palette
 * @name hp_XE_ColorPalette.js
 */
 xe.XE_ColorPalette = jQuery.Class({
	name : "XE_ColorPalette",
	rxRGBColorPattern : /rgb\((\d+), ?(\d+), ?(\d+)\)/i,

	$init : function(oAppContainer){
		this._assignHTMLObjects(oAppContainer);
	},

	_assignHTMLObjects : function(oAppContainer){
		this.elColorPaletteLayer = jQuery("UL.xpress_xeditor_color_palette", oAppContainer).get(0);
	},

	$ON_MSG_APP_READY : function(){
		this.oApp.registerBrowserEvent(this.elColorPaletteLayer, "click", "EVENT_MOUSEUP_COLOR_PALETTE");
	},

	$ON_SHOW_COLOR_PALETTE : function(sCallbackCmd, oLayerContainer){
		this.sCallbackCmd = sCallbackCmd;
		this.oLayerContainer = oLayerContainer;

		this.oLayerContainer.insertBefore(this.elColorPaletteLayer, null);

		this.elColorPaletteLayer.style.display = "block";
	},

	$ON_HIDE_COLOR_PALETTE : function(){
		this.elColorPaletteLayer.style.display = "none";
	},

	$ON_COLOR_PALETTE_APPLY_COLOR : function(sColorCode){
		if(this.rxRGBColorPattern.test(sColorCode)){

			function dec2Hex(sDec){
				var sTmp = parseInt(sDec).toString(16);
				if(sTmp.length<2) sTmp = "0"+sTmp;
				return sTmp.toUpperCase();
			}

			var sR = dec2Hex(RegExp.$1);
			var sG = dec2Hex(RegExp.$2);
			var sB = dec2Hex(RegExp.$3);
			sColorCode = "#"+sR+sG+sB;
		}
		this.oApp.exec(this.sCallbackCmd, [sColorCode]);
	},

	$ON_EVENT_MOUSEUP_COLOR_PALETTE : function(oEvent){
		var elButton = oEvent.target;
		if(! elButton.style.backgroundColor) return;

		this.oApp.exec("COLOR_PALETTE_APPLY_COLOR", [elButton.style.backgroundColor]);
	}
});
//}
//{
/**
 * @fileOverview This file contains Xpress plugin that takes care of the operations related to changing the font color
 * @name hp_XE_FontColor.js
 */
xe.XE_FontColor = jQuery.Class({
	name : "XE_FontColor",
	rxColorPattern : /^#?[0-9a-fA-F]{6}$|^rgb\(\d+, ?\d+, ?\d+\)$/i,

	$init : function(elAppContainer){
		this._assignHTMLObjects(elAppContainer);
	},

	_assignHTMLObjects : function(elAppContainer){
		this.elDropdownLayer = jQuery("DIV.xpress_xeditor_fontcolor_layer", elAppContainer).get(0);
	},

	$ON_MSG_APP_READY : function(){
		this.oApp.exec("REGISTER_UI_EVENT", ["fontColor", "click", "TOGGLE_FONTCOLOR_LAYER"]);
	},

	$ON_TOGGLE_FONTCOLOR_LAYER : function(){
		this.oApp.exec("TOGGLE_TOOLBAR_ACTIVE_LAYER", [this.elDropdownLayer, null, "SHOW_COLOR_PALETTE", ["APPLY_FONTCOLOR", this.elDropdownLayer]]);
	},

	$ON_APPLY_FONTCOLOR : function(sFontColor){
		if(!this.rxColorPattern.test(sFontColor)){
			alert(this.oApp.$MSG("XE_FontColor.invalidColorCode"));
			return;
		}

		this.oApp.exec("SET_WYSIWYG_STYLE", [{"color":sFontColor}]);

		this.oApp.exec("HIDE_ACTIVE_LAYER");
	}
});
//}
//{
/**
 * @fileOverview This file contains Xpress plugin that takes care of changing the background color
 * @name hp_XE_BGColor.js
 */
xe.XE_BGColor = jQuery.Class({
	name : "XE_BGColor",
	rxColorPattern : /^#?[0-9a-fA-F]{6}$|^rgb\(\d+, ?\d+, ?\d+\)$/i,

	$init : function(elAppContainer){
		this._assignHTMLObjects(elAppContainer);
	},

	_assignHTMLObjects : function(elAppContainer){
		this.elDropdownLayer = jQuery("DIV.xpress_xeditor_bgcolor_layer", elAppContainer).get(0);
	},

	$ON_MSG_APP_READY : function(){
		this.oApp.exec("REGISTER_UI_EVENT", ["bgColor", "click", "TOGGLE_BGCOLOR_LAYER"]);

		this.oApp.registerBrowserEvent(this.elDropdownLayer, "click", "EVENT_APPLY_BGCOLOR", []);
	},

	$ON_TOGGLE_BGCOLOR_LAYER : function(){
		this.oApp.exec("TOGGLE_TOOLBAR_ACTIVE_LAYER", [this.elDropdownLayer, null, "SHOW_COLOR_PALETTE", ["APPLY_BGCOLOR", this.elDropdownLayer]]);
	},

	$ON_EVENT_APPLY_BGCOLOR : function(weEvent){
		var elButton = weEvent.target;

		// Safari/Chrome/Opera may capture the event on Span
		if(elButton.tagName == "SPAN") elButton = elButton.parentNode;
		if(elButton.tagName != "BUTTON") return;

		var sBGColor, sFontColor;

		sBGColor = elButton.style.backgroundColor;
		sFontColor = elButton.style.color;

		this.oApp.exec("APPLY_BGCOLOR", [sBGColor, sFontColor]);
	},

	$ON_APPLY_BGCOLOR : function(sBGColor, sFontColor){
		if(!this.rxColorPattern.test(sBGColor)){
			alert(this.oApp.$MSG("XE_BGColor.invalidColorCode"));
			return;
		}

		var oStyle = {"backgroundColor": sBGColor}
		if(sFontColor) oStyle.color = sFontColor;

		this.oApp.exec("SET_WYSIWYG_STYLE", [oStyle]);

		this.oApp.exec("HIDE_ACTIVE_LAYER");
	}
});
//}
//{
/**
 * @fileOverview This file contains Xpress plugin that takes care of the operations related to quote
 * @name hp_XE_Quote.js
 * @required XE_EditingArea_WYSIWYG
 */
xe.XE_Quote = jQuery.Class({
	name : "XE_Quote",

	$init : function(elAppContainer){
		this._assignHTMLObjects(elAppContainer);
	},

	_assignHTMLObjects : function(elAppContainer){
		this.elDropdownLayer = jQuery("DIV.xpress_xeditor_blockquote_layer", elAppContainer).get(0);
	},

	$ON_MSG_APP_READY: function(){
		this.oApp.exec("REGISTER_UI_EVENT", ["quote", "click", "TOGGLE_BLOCKQUOTE_LAYER"]);

		this.oApp.registerBrowserEvent(this.elDropdownLayer, "click", "EVENT_APPLY_SEDITOR_BLOCKQUOTE", []);
	},

	$ON_TOGGLE_BLOCKQUOTE_LAYER : function(){
		this.oApp.exec("TOGGLE_TOOLBAR_ACTIVE_LAYER", [this.elDropdownLayer]);
	},

	$ON_EVENT_APPLY_SEDITOR_BLOCKQUOTE : function(weEvent){
		var elButton = weEvent.target;
		if(elButton.tagName != "BUTTON") return;

		var sClass = elButton.parentNode.className;

		if(sClass != "q8")
			this._wrapBlock("BLOCKQUOTE", sClass);
		else
			this._unwrapBlock("BLOCKQUOTE");

		this.oApp.exec("HIDE_ACTIVE_LAYER", []);
	},

	_unwrapBlock : function(tag){
		var oSelection = this.oApp.getSelection();
		var oC = oSelection.commonAncestorContainer;

		while(oC && oC.tagName != tag) oC = oC.parentNode;
		if(!oC) return;

		while(oC.firstChild) oC.parentNode.insertBefore(oC.firstChild, oC);

		oC.parentNode.removeChild(oC);
	},

	_wrapBlock : function(tag, className){
		var oSelection = this.oApp.getSelection();
		var oLineInfo = oSelection.getLineInfo();
		var oStart = oLineInfo.oStart;
		var oEnd = oLineInfo.oEnd;

		var rxDontUseAsWhole = /BODY|TD|LI/i;

		var oStartNode, oEndNode;

		if(oStart.bParentBreak && !rxDontUseAsWhole.test(oStart.oLineBreaker.tagName)) oStartNode = oStart.oNode.parentNode;
		else oStartNode = oStart.oNode;

		if(oEnd.bParentBreak && !rxDontUseAsWhole.test(oEnd.oLineBreaker.tagName)) oEndNode = oEnd.oNode.parentNode;
		else oEndNode = oEnd.oNode;

		oSelection.setStartBefore(oStartNode);
		oSelection.setEndAfter(oEndNode);

		var oNode = this._expandToTableStart(oSelection, oEndNode);
		if(oNode){
			oEndNode = oNode;
			oSelection.setEndAfter(oNode);
		}

		oNode = this._expandToTableStart(oSelection, oStartNode);
		if(oNode){
			oStartNode = oNode;
			oSelection.setStartBefore(oNode);
		}

		oNode = oStartNode;
		var oC = oSelection.commonAncestorContainer;

		// find the insertion position for the formatting tag right beneath the common ancestor container
		while(oNode && oNode != oC && oNode.parentNode != oC) oNode = oNode.parentNode;

		oFormattingNode = oSelection._document.createElement(tag);
		if(className) oFormattingNode.className = className;

		if(oNode == oC){
			oC.insertBefore(oFormattingNode, oC.firstChild);
		}else{
			oC.insertBefore(oFormattingNode, oNode);
		}

		oSelection.setStartAfter(oFormattingNode);

		oSelection.setEndAfter(oEndNode);
		oSelection.surroundContents(oFormattingNode);

		var aNodes = oFormattingNode.childNodes;
		var oInsertionPoint;
		for(var i=aNodes.length-1; i>=0; i--){
			if(aNodes[i].nodeType == 3 || aNodes[i].tagName == "BR"){
				var oP = oSelection._document.createElement("P");
				oInsertionPoint = aNodes[i].nextSibling;
				while(i>=0 && aNodes[i] && (aNodes[i].nodeType == 3 || aNodes[i].tagName == "BR")){
					oP.insertBefore(aNodes[i--], oP.firstChild);
				}
				oFormattingNode.insertBefore(oP, oInsertionPoint);
				i++;
			}
		}

		if(oFormattingNode && oFormattingNode.parentNode){
			var oP = oSelection._document.createElement("P");
			oP.innerHTML = unescape("<br/>");
			oFormattingNode.parentNode.insertBefore(oP, oFormattingNode.nextSibling);
		}

		this.oApp.exec("RECORD_UNDO_ACTION", ["Block Quote"]);

		return oFormattingNode;
	},

	_expandToTableStart : function(oSelection, oNode){
		var oC = oSelection.commonAncestorContainer;
		var oResultNode = null;

		var bLastIteration = false;
		while(oNode && !bLastIteration){
			if(oNode == oC) bLastIteration = true;

			if(/TBODY|TFOOT|THEAD|TR/i.test(oNode.tagName)){
				oResultNode = this._getTableRoot(oNode);
				break;
			}
			oNode = oNode.parentNode;
		}

		return oResultNode;
	},

	_getTableRoot : function(oNode){
		while(oNode && oNode.tagName != "TABLE") oNode = oNode.parentNode;

		return oNode;
	}
});
//}
//{
/**
 * @fileOverview This file contains Xpress plugin that takes care of the operations related to inserting special characters
 * @name hp_XE_SCharacter.js
 * @required XpressRangeManager
 */
xe.XE_SCharacter = jQuery.Class({
	name : "XE_SCharacter",

	$init : function(oAppContainer){
		this.bIE = jQuery.browser.msie;

		this._assignHTMLObjects(oAppContainer);

		this.charSet = [];
		this.charSet[0] = unescape('FF5B FF5D 3014 3015 3008 3009 300A 300B 300C 300D 300E 300F 3010 3011 2018 2019 201C 201D 3001 3002 %B7 2025 2026 %A7 203B 2606 2605 25CB 25CF 25CE 25C7 25C6 25A1 25A0 25B3 25B2 25BD 25BC 25C1 25C0 25B7 25B6 2664 2660 2661 2665 2667 2663 2299 25C8 25A3 25D0 25D1 2592 25A4 25A5 25A8 25A7 25A6 25A9 %B1 %D7 %F7 2260 2264 2265 221E 2234 %B0 2032 2033 2220 22A5 2312 2202 2261 2252 226A 226B 221A 223D 221D 2235 222B 222C 2208 220B 2286 2287 2282 2283 222A 2229 2227 2228 FFE2 21D2 21D4 2200 2203 %B4 FF5E 02C7 02D8 02DD 02DA 02D9 %B8 02DB %A1 %BF 02D0 222E 2211 220F 266D 2669 266A 266C 327F 2192 2190 2191 2193 2194 2195 2197 2199 2196 2198 321C 2116 33C7 2122 33C2 33D8 2121 2668 260F 260E 261C 261E %B6 2020 2021 %AE %AA %BA 2642 2640').replace(/(\S{4})/g, function(a){return "%u"+a}).split(' ');
		this.charSet[1] = unescape('%BD 2153 2154 %BC %BE 215B 215C 215D 215E %B9 %B2 %B3 2074 207F 2081 2082 2083 2084 2160 2161 2162 2163 2164 2165 2166 2167 2168 2169 2170 2171 2172 2173 2174 2175 2176 2177 2178 2179 FFE6 %24 FFE5 FFE1 20AC 2103 212B 2109 FFE0 %A4 2030 3395 3396 3397 2113 3398 33C4 33A3 33A4 33A5 33A6 3399 339A 339B 339C 339D 339E 339F 33A0 33A1 33A2 33CA 338D 338E 338F 33CF 3388 3389 33C8 33A7 33A8 33B0 33B1 33B2 33B3 33B4 33B5 33B6 33B7 33B8 33B9 3380 3381 3382 3383 3384 33BA 33BB 33BC 33BD 33BE 33BF 3390 3391 3392 3393 3394 2126 33C0 33C1 338A 338B 338C 33D6 33C5 33AD 33AE 33AF 33DB 33A9 33AA 33AB 33AC 33DD 33D0 33D3 33C3 33C9 33DC 33C6').replace(/(\S{4})/g, function(a){return "%u"+a}).split(' ');
		this.charSet[2] = unescape('3260 3261 3262 3263 3264 3265 3266 3267 3268 3269 326A 326B 326C 326D 326E 326F 3270 3271 3272 3273 3274 3275 3276 3277 3278 3279 327A 327B 24D0 24D1 24D2 24D3 24D4 24D5 24D6 24D7 24D8 24D9 24DA 24DB 24DC 24DD 24DE 24DF 24E0 24E1 24E2 24E3 24E4 24E5 24E6 24E7 24E8 24E9 2460 2461 2462 2463 2464 2465 2466 2467 2468 2469 246A 246B 246C 246D 246E 3200 3201 3202 3203 3204 3205 3206 3207 3208 3209 320A 320B 320C 320D 320E 320F 3210 3211 3212 3213 3214 3215 3216 3217 3218 3219 321A 321B 249C 249D 249E 249F 24A0 24A1 24A2 24A3 24A4 24A5 24A6 24A7 24A8 24A9 24AA 24AB 24AC 24AD 24AE 24AF 24B0 24B1 24B2 24B3 24B4 24B5 2474 2475 2476 2477 2478 2479 247A 247B 247C 247D 247E 247F 2480 2481 2482').replace(/(\S{4})/g, function(a){return "%u"+a}).split(' ');
		this.charSet[3] = unescape('3131 3132 3133 3134 3135 3136 3137 3138 3139 313A 313B 313C 313D 313E 313F 3140 3141 3142 3143 3144 3145 3146 3147 3148 3149 314A 314B 314C 314D 314E 314F 3150 3151 3152 3153 3154 3155 3156 3157 3158 3159 315A 315B 315C 315D 315E 315F 3160 3161 3162 3163 3165 3166 3167 3168 3169 316A 316B 316C 316D 316E 316F 3170 3171 3172 3173 3174 3175 3176 3177 3178 3179 317A 317B 317C 317D 317E 317F 3180 3181 3182 3183 3184 3185 3186 3187 3188 3189 318A 318B 318C 318D 318E').replace(/(\S{4})/g, function(a){return "%u"+a}).split(' ');
		this.charSet[4] = unescape('0391 0392 0393 0394 0395 0396 0397 0398 0399 039A 039B 039C 039D 039E 039F 03A0 03A1 03A3 03A4 03A5 03A6 03A7 03A8 03A9 03B1 03B2 03B3 03B4 03B5 03B6 03B7 03B8 03B9 03BA 03BB 03BC 03BD 03BE 03BF 03C0 03C1 03C3 03C4 03C5 03C6 03C7 03C8 03C9 %C6 %D0 0126 0132 013F 0141 %D8 0152 %DE 0166 014A %E6 0111 %F0 0127 I 0133 0138 0140 0142 0142 0153 %DF %FE 0167 014B 0149 0411 0413 0414 0401 0416 0417 0418 0419 041B 041F 0426 0427 0428 0429 042A 042B 042C 042D 042E 042F 0431 0432 0433 0434 0451 0436 0437 0438 0439 043B 043F 0444 0446 0447 0448 0449 044A 044B 044C 044D 044E 044F').replace(/(\S{4})/g, function(a){return "%u"+a}).split(' ');
		this.charSet[5] = unescape('3041 3042 3043 3044 3045 3046 3047 3048 3049 304A 304B 304C 304D 304E 304F 3050 3051 3052 3053 3054 3055 3056 3057 3058 3059 305A 305B 305C 305D 305E 305F 3060 3061 3062 3063 3064 3065 3066 3067 3068 3069 306A 306B 306C 306D 306E 306F 3070 3071 3072 3073 3074 3075 3076 3077 3078 3079 307A 307B 307C 307D 307E 307F 3080 3081 3082 3083 3084 3085 3086 3087 3088 3089 308A 308B 308C 308D 308E 308F 3090 3091 3092 3093 30A1 30A2 30A3 30A4 30A5 30A6 30A7 30A8 30A9 30AA 30AB 30AC 30AD 30AE 30AF 30B0 30B1 30B2 30B3 30B4 30B5 30B6 30B7 30B8 30B9 30BA 30BB 30BC 30BD 30BE 30BF 30C0 30C1 30C2 30C3 30C4 30C5 30C6 30C7 30C8 30C9 30CA 30CB 30CC 30CD 30CE 30CF 30D0 30D1 30D2 30D3 30D4 30D5 30D6 30D7 30D8 30D9 30DA 30DB 30DC 30DD 30DE 30DF 30E0 30E1 30E2 30E3 30E4 30E5 30E6 30E7 30E8 30E9 30EA 30EB 30EC 30ED 30EE 30EF 30F0 30F1 30F2 30F3 30F4 30F5 30F6').replace(/(\S{4})/g, function(a){return "%u"+a}).split(' ');
	},

	_assignHTMLObjects : function(oAppContainer){
		oAppContainer = jQuery.$(oAppContainer) || document;

		this.elDropdownLayer = jQuery("DIV.xpress_xeditor_sCharacter_layer", oAppContainer).get(0);

		this.oTextField = jQuery("INPUT", this.elDropdownLayer).get(0);
		this.oInsertButton = jQuery("+ BUTTON", this.oTextField).get(0);
		this.aCloseButton = jQuery("BUTTON.close", this.elDropdownLayer).get();
		this.aSCharList = jQuery(".list", this.elDropdownLayer).get();
		var oLabelUL = jQuery(">UL", this.elDropdownLayer).get(0);
		this.aLabelA = jQuery("A", oLabelUL).get();
	},

	$ON_MSG_APP_READY : function(){
		var funcInsert = jQuery.fnBind(this.oApp.exec, this.oApp, "INSERT_SCHARACTERS", [this.oTextField.value]);
		jQuery(this.oInsertButton).click(funcInsert, this);

		this.oApp.exec("SET_SCHARACTER_LIST", [this.charSet]);

		for(var i=0; i<this.aLabelA.length; i++){
			var func = jQuery.fnBind(this.oApp.exec, this.oApp, "CHANGE_SCHARACTER_SET", [i]);
			jQuery(this.aLabelA[i]).mousedown(func);

			this._stopBrowserEvent(this.aLabelA[i], "click");
		}

		for(var i=0; i<this.aCloseButton.length; i++){
			this.oApp.registerBrowserEvent(this.aCloseButton[i], "click", "HIDE_ACTIVE_LAYER", []);
		}

		this.oApp.registerBrowserEvent(this.elDropdownLayer, "click", "EVENT_SCHARACTER_CLICKED", []);

		this.oApp.exec("REGISTER_UI_EVENT", ["sCharacter", "click", "TOGGLE_SCHARACTER_LAYER"]);
	},

	$ON_TOGGLE_SCHARACTER_LAYER : function(){
		this.oTextField.value = "";
		this.oSelection = this.oApp.getSelection();

		this.oApp.exec("TOGGLE_TOOLBAR_ACTIVE_LAYER", [this.elDropdownLayer]);
	},

	$ON_EVENT_SCHARACTER_CLICKED : function(weEvent){
		var elButton = weEvent.target;
		if(elButton.tagName != "BUTTON") return;
		if(elButton.parentNode.tagName != "LI") return;

		var sChar = elButton.firstChild.innerHTML;

		this.oApp.exec("SELECT_SCHARACTER", [sChar]);
	},

	$ON_SELECT_SCHARACTER : function(schar){
		this.oTextField.value += schar;

		if(this.oTextField.createTextRange){
			var oTextRange = this.oTextField.createTextRange();
			oTextRange.collapse(false);
			oTextRange.select();
		}else{
			if(this.oTextField.selectionEnd){
				this.oTextField.selectionEnd = this.oTextField.value.length;
				this.oTextField.focus();
			}
		}
	},

	$ON_INSERT_SCHARACTERS : function(){
		this.oSelection.pasteHTML(this.oTextField.value);
		this.oApp.exec("HIDE_ACTIVE_LAYER", []);
	},

	$ON_CHANGE_SCHARACTER_SET : function(nSCharSet){
		for(var i=0; i<this.aSCharList.length; i++){
			if(this.aSCharList[i].style.display == "block"){
				if(i == nSCharSet) return;

				jQuery(this.aLabelA[i]).removeClass("on");
				this.aSCharList[i].style.display = "none";
			}
		}

		this._drawSCharList(nSCharSet);
		jQuery(this.aLabelA[nSCharSet]).addClass("on");
		this.aSCharList[nSCharSet].style.display = "block";
	},

	$ON_SET_SCHARACTER_LIST : function(charSet){
		this.charSet = charSet;
		this.bSCharSetDrawn = new Array(this.charSet.length);
		this._drawSCharList(0);
	},

	_drawSCharList : function(i){
		if(this.bSCharSetDrawn[i]) return;
		this.bSCharSetDrawn[i] = true;

		var charList = jQuery(this.aSCharList[i]).empty();
		var button, span;

		jQuery(this.charSet[i]).each(function(idx,ch){
			var li  = jQuery('<li>');
			var btn = jQuery('<button type="button"><span>'+unescape(ch)+'</span></button>');

			li.append(btn);
			charList.append(li);
		});

		// enable this after Jindo framework is updated
//		this.oApp.exec("ATTACH_HOVER_EVENTS", [jQuery(">LI>BUTTON", this.aSCharList[i])]).get();
	},

	_stopBrowserEvent : function(obj, sEvent){
		jQuery(obj).bind(sEvent, function(e){e.stopPropagation();e.preventDefault();} )
	}
});
//}
//{
/**
 * @fileOverview This file contains Xpress plugin that takes care of the operations related to Undo/Redo
 * @name hp_XE_UndoRedo.js
 * @required XE_EditingAreaManager, XpressRangeManager
 */
xe.XE_UndoRedo = jQuery.Class({
	name : "XE_UndoRedo",
	actionHistory : null,
	// this may also be called, lastAdded/lastRestored
	oCurStateIdx : null,
	iMinimumSizeChange : 10,
	sBlankContentsForFF : "<br>",

	$init : function(){
		this.aUndoHistory = [];
		this.oCurStateIdx = {nIdx: 0, nStep: 0};
	},

	$PRECONDITION : function(sCmd){
		if(sCmd.match(/_DO_RECORD_UNDO_HISTORY_AT$/)) return true;

		try{
			if(this.oApp.getEditingMode() != "WYSIWYG") return false;
		}catch(e){
			return false;
		}

		return true;
	},

	$BEFORE_MSG_APP_READY : function(){
		this.oApp.exec("DO_RECORD_UNDO_HISTORY_AT", [this.oCurStateIdx, "", "", null]);
	},

	$ON_MSG_APP_READY : function(){
		this.bFF = jQuery.browser.mozilla;

		this.oApp.exec("ADD_APP_PROPERTY", ["getUndoHistory", jQuery.fnBind(this.getUndoHistory, this)]);
		this.oApp.exec("ADD_APP_PROPERTY", ["getUndoStateIdx", jQuery.fnBind(this.getUndoStateIdx, this)]);

		this.oApp.exec("REGISTER_UI_EVENT", ["undo", "click", "UNDO"]);
		this.oApp.exec("REGISTER_UI_EVENT", ["redo", "click", "REDO"]);

		this.oApp.exec("REGISTER_HOTKEY", ["ctrl+z", "UNDO"]);
		this.oApp.exec("REGISTER_HOTKEY", ["ctrl+y", "REDO"]);
	},

	$ON_UNDO : function(){
		var oTmpStateIdx = {};
		this.oApp.exec("DO_RECORD_UNDO_HISTORY", ["KEYPRESS", false, false, 1]);
		if(this.oCurStateIdx.nIdx == 0) return;

		if(this.oCurStateIdx.nStep > 0){
			this.oCurStateIdx.nStep--;
		}else{
			var oTmpHistory = this.aUndoHistory[this.oCurStateIdx.nIdx];

			this.oCurStateIdx.nIdx--;

			if(oTmpHistory.nTotalSteps>1){
				this.oCurStateIdx.nStep = 0;
			}else{
				oTmpHistory = this.aUndoHistory[this.oCurStateIdx.nIdx];
				this.oCurStateIdx.nStep = oTmpHistory.nTotalSteps-1;
			}
		}

		this.oApp.exec("RESTORE_UNDO_HISTORY", [this.oCurStateIdx.nIdx, this.oCurStateIdx.nStep]);

		this.oApp.exec("CHECK_STYLE_CHANGE", []);
	},


	$ON_REDO : function(){
		if(this.oCurStateIdx.nIdx >= this.aUndoHistory.length) return;

		var oCurHistory = this.aUndoHistory[this.oCurStateIdx.nIdx];
		if(this.oCurStateIdx.nIdx == this.aUndoHistory.length-1 && this.oCurStateIdx.nStep >= oCurHistory.nTotalSteps-1) return;

		if(this.oCurStateIdx.nStep < oCurHistory.nTotalSteps-1){
			this.oCurStateIdx.nStep++;
		}else{
			this.oCurStateIdx.nIdx++;
			oCurHistory = this.aUndoHistory[this.oCurStateIdx.nIdx];
			this.oCurStateIdx.nStep = oCurHistory.nTotalSteps-1;
		}

		this.oApp.exec("RESTORE_UNDO_HISTORY", [this.oCurStateIdx.nIdx, this.oCurStateIdx.nStep]);

		this.oApp.exec("CHECK_STYLE_CHANGE", []);
	},

	$ON_RECORD_UNDO_ACTION : function(sAction){
		this.oApp.exec("DO_RECORD_UNDO_HISTORY", [sAction]);
	},

	$ON_RECORD_UNDO_BEFORE_ACTION : function(sAction){
		this.oApp.exec("DO_RECORD_UNDO_HISTORY", [sAction, true, true]);
	},

	$ON_RECORD_UNDO_AFTER_ACTION : function(sAction){
		this.oApp.exec("DO_RECORD_UNDO_HISTORY", [sAction, true, false]);
	},

	$ON_RESTORE_UNDO_HISTORY : function(nUndoIdx, nUndoStateStep){
		this.oCurStateIdx.nIdx = nUndoIdx;
		this.oCurStateIdx.nStep = nUndoStateStep;

		var oCurHistory = this.aUndoHistory[this.oCurStateIdx.nIdx];
		var sContent = oCurHistory.sContent[this.oCurStateIdx.nStep];
		var oBookmark = oCurHistory.oBookmark[this.oCurStateIdx.nStep];

		this.oApp.setIR(sContent, true);

		// setting the innerHTML may change the internal DOM structure, so save the value again.
		var sCurContent = this.oApp.getIR();
		if(this.bFF && sCurContent == this.sBlankContentsForFF){
			sCurContent = "";
		}
		oCurHistory.sContent[this.oCurStateIdx.nStep] = sCurContent;

		var oSelection = this.oApp.getEmptySelection();
		if(oSelection.selectionLoaded){
			if(oBookmark){
				oSelection.moveToXPathBookmark(oBookmark);
			}else{
				oSelection = this.oApp.getEmptySelection();
			}

			oSelection.select();
		}
	},

	$ON_DO_RECORD_UNDO_HISTORY : function(sAction, bTwoStepAction, bBeforeAction, nForceAddUnlessEqual){
		bTwoStepAction = bTwoStepAction || false;
		bBeforeAction = bBeforeAction || false;
		nForceAddUnlessEqual = nForceAddUnlessEqual || 0;

		// if we're in the middle of some action history, remove everything after current idx if any "little" change is made
		if(!(this.oCurStateIdx.nIdx == this.aUndoHistory.length-1)) nForceAddUnlessEqual = 1;

		var oCurHistory = this.aUndoHistory[this.oCurStateIdx.nIdx];

		var sCurContent = this.oApp.getIR();
		var sHistoryContent = oCurHistory.sContent[this.oCurStateIdx.nStep];

		if(this.bFF && sCurContent == this.sBlankContentsForFF){
			sCurContent = "";
		}

		// every TwoStepAction needs to be recorded
		if(!bTwoStepAction){
			switch(nForceAddUnlessEqual){
				case 0:
					if(Math.abs(sHistoryContent.length - sCurContent.length)<this.iMinimumSizeChange) return;
					break;

				case 1:
					if(sHistoryContent == sCurContent) return;
					break;

				// write at all times
				case 2:
					break;
			}
		}

		var oSelection = this.oApp.getSelection();

		var oBookmark=null;
		if(oSelection.selectionLoaded){
			oBookmark = oSelection.getXPathBookmark();
		}

		var oInsertionIdx = {nIdx:this.oCurStateIdx.nIdx, nStep:this.oCurStateIdx.nStep};
		if(bTwoStepAction){
			if(bBeforeAction){
				oInsertionIdx.nStep = 0;
			}else{
				oInsertionIdx.nStep = 1;
			}
		}else{
			oInsertionIdx.nStep = 0;
		}

		if(oInsertionIdx.nStep == 0 && this.oCurStateIdx.nStep == oCurHistory.nTotalSteps-1){
			oInsertionIdx.nIdx = this.oCurStateIdx.nIdx+1;
		}

		this.oApp.exec("DO_RECORD_UNDO_HISTORY_AT", [oInsertionIdx, sAction, sCurContent, oBookmark]);
	},

	$ON_DO_RECORD_UNDO_HISTORY_AT : function(oInsertionIdx, sAction, sContent, oBookmark){
		if(oInsertionIdx.nStep != 0){
			this.aUndoHistory[oInsertionIdx.nIdx].nTotalSteps = oInsertionIdx.nStep+1;
			this.aUndoHistory[oInsertionIdx.nIdx].sContent[oInsertionIdx.nStep] = sContent;
			this.aUndoHistory[oInsertionIdx.nIdx].oBookmark[oInsertionIdx.nStep] = oBookmark;
		}else{
			var oNewHistory = {sAction:sAction, nTotalSteps: 1};
			oNewHistory.sContent = [];
			oNewHistory.sContent[0] = sContent;

			oNewHistory.oBookmark = [];
			oNewHistory.oBookmark[0] = oBookmark;
			this.aUndoHistory.splice(oInsertionIdx.nIdx, this.aUndoHistory.length - oInsertionIdx.nIdx, oNewHistory);
		}

		this.oCurStateIdx.nIdx = oInsertionIdx.nIdx;
		this.oCurStateIdx.nStep = oInsertionIdx.nStep;
	},

	_getUndoHistory : function(){
		return this.aUndoHistory;
	},

	_getUndoStateIdx : function(){
		return this.oCurStateIdx;
	}
});
//}
//{
/**
 * @fileOverview This file contains Xpress plugin that takes care of the operations related to Find/Replace
 * @name hp_XE_FindReplacePlugin.js
 */
xe.XE_FindReplacePlugin = jQuery.Class({
	name : "XE_FindReplacePlugin",
	oEditingWindow : null,
	oFindReplace :  null,
	oUILayer : null,
	bFindMode : true,

	$init : function(oAppContainer){
		this._assignHTMLObjects(oAppContainer);
	},

	_assignHTMLObjects : function(oAppContainer){
		oAppContainer = jQuery.$(oAppContainer) || document;

		this.oEditingWindow = jQuery("IFRAME", oAppContainer).get(0);
		this.oUILayer = jQuery("DIV.xpress_xeditor_findAndReplace_layer", oAppContainer).get(0);

		var oTmp = jQuery("LI", this.oUILayer).get();

		this.oFindTab = oTmp[0];
		this.oReplaceTab = oTmp[1];

		oTmp = jQuery(".container > .bx", this.oUILayer).get();

		this.oFindInputSet = oTmp[0];
		this.oReplaceInputSet = oTmp[1];

		this.oFindInput_Keyword = jQuery("INPUT", this.oFindInputSet).get(0);

		oTmp = jQuery("INPUT", this.oReplaceInputSet).get();
		this.oReplaceInput_Original = oTmp[0];
		this.oReplaceInput_Replacement = oTmp[1];

		this.oFindNextButton = jQuery("BUTTON.find_next", this.oUILayer).get(0);
		this.oCancelButton = jQuery("BUTTON.cancel", this.oUILayer).get(0);

		this.oReplaceButton = jQuery("BUTTON.replace", this.oUILayer).get(0);
		this.oReplaceAllButton = jQuery("BUTTON.replace_all", this.oUILayer).get(0);

		this.aCloseButtons = jQuery("BUTTON.close", this.oUILayer).get();
		this.aCloseButtons[this.aCloseButtons.length] = this.oCancelButton;
	},

	$ON_MSG_APP_READY : function(){
		// the right document will be available only when the src is completely loaded
		if(this.oEditingWindow && this.oEditingWindow.tagName == "IFRAME")
			this.oEditingWindow = this.oEditingWindow.contentWindow;

		this.oFindReplace = new xe.FindReplace(this.oEditingWindow);
		if(!this.oFindReplace.bBrowserSupported){
			this.oApp.exec("DISABLE_UI", ["find_replace"]);
			return;
		}

		for(var i=0; i<this.aCloseButtons.length; i++){
			var func = jQuery.fnBind(this.oApp.exec, this.oApp, "HIDE_DIALOG_LAYER", [this.oUILayer]);
			jQuery(this.aCloseButtons[i]).bind("click", func);
		}

		jQuery(this.oFindTab).bind("mousedown", jQuery.fnBind(this.oApp.exec, this.oApp, "SHOW_FIND", []));
		jQuery(this.oReplaceTab).bind("mousedown", jQuery.fnBind(this.oApp.exec, this.oApp, "SHOW_REPLACE", []));

		jQuery(this.oFindNextButton).bind("click", jQuery.fnBind(this.oApp.exec, this.oApp, "FIND", []));
		jQuery(this.oReplaceButton).bind("click", jQuery.fnBind(this.oApp.exec, this.oApp, "REPLACE", []));
		jQuery(this.oReplaceAllButton).bind("click", jQuery.fnBind(this.oApp.exec, this.oApp, "REPLACE_ALL", []));

		this.oApp.exec("REGISTER_UI_EVENT", ["findAndReplace", "click", "SHOW_FIND_REPLACE_LAYER"]);
	},

	$ON_SHOW_ACTIVE_LAYER : function(){
		this.oApp.exec( "HIDE_DIALOG_LAYER", [this.oUILayer]);
	},

	$ON_SHOW_FIND_REPLACE_LAYER : function(){
		this.oApp.exec("SHOW_DIALOG_LAYER", [this.oUILayer]);
		this.oApp.exec("POSITION_TOOLBAR_LAYER", [this.oUILayer]);
		this.oApp.exec("HIDE_CURRENT_ACTIVE_LAYER", []);
	},

	$ON_SHOW_FIND : function(){
		this.bFindMode = true;

		jQuery(this.oFindTab).addClass("on");
		jQuery(this.oReplaceTab).removeClass("on");

		jQuery(this.oFindNextButton).removeClass("normal");
		jQuery(this.oFindNextButton).addClass("strong");

		this.oFindInputSet.style.display = "block";
		this.oReplaceInputSet.style.display = "none";

		this.oReplaceButton.style.display = "none";
		this.oReplaceAllButton.style.display = "none";

		jQuery(this.oUILayer).removeClass("replace");
		jQuery(this.oUILayer).addClass("find");

		this.oFindInput_Keyword.value = this.oReplaceInput_Original.value;
	},

	$ON_SHOW_REPLACE : function(){
		this.bFindMode = false;

		jQuery(this.oFindTab).removeClass("on");
		jQuery(this.oReplaceTab).addClass("on");

		jQuery(this.oFindNextButton).removeClass("strong");
		jQuery(this.oFindNextButton).addClass("normal");

		this.oFindInputSet.style.display = "none";
		this.oReplaceInputSet.style.display = "block";

		this.oReplaceButton.style.display = "inline";
		this.oReplaceAllButton.style.display = "inline";

		jQuery(this.oUILayer).removeClass("find");
		jQuery(this.oUILayer).addClass("replace");

		this.oReplaceInput_Original.value = this.oFindInput_Keyword.value;
	},

	$ON_FIND : function(){
		var sKeyword;
		if(this.bFindMode)
			sKeyword = this.oFindInput_Keyword.value;
		else
			sKeyword = this.oReplaceInput_Original.value;

		switch(this.oFindReplace.find(sKeyword, false)){
			case 1:
				alert(this.oApp.$MSG("XE_FindReplace.keywordNotFound"));
				break;
			case 2:
				alert(this.oApp.$MSG("XE_FindReplace.keywordMissing"));
				break;
		}
	},

	$ON_REPLACE : function(){
		var sOriginal = this.oReplaceInput_Original.value;
		var sReplacement = this.oReplaceInput_Replacement.value;

		this.oApp.exec("RECORD_UNDO_BEFORE_ACTION", ["REPLACE"]);
		var iReplaceResult = this.oFindReplace.replace(sOriginal, sReplacement, false);
		this.oApp.exec("RECORD_UNDO_AFTER_ACTION", ["REPLACE"]);

		switch(iReplaceResult){
			case 1:
			case 3:
				alert(this.oApp.$MSG("XE_FindReplace.keywordNotFound"));
				break;
			case 4:
				alert(this.oApp.$MSG("XE_FindReplace.keywordMissing"));
				break;
		}
	},

	$ON_REPLACE_ALL : function(){
		var sOriginal = this.oReplaceInput_Original.value;
		var sReplacement = this.oReplaceInput_Replacement.value;

		this.oApp.exec("RECORD_UNDO_BEFORE_ACTION", ["REPLACE ALL"]);
		var iReplaceAllResult = this.oFindReplace.replaceAll(sOriginal, sReplacement, false);
		this.oApp.exec("RECORD_UNDO_AFTER_ACTION", ["REPLACE ALL"]);

		if(iReplaceAllResult<0){
			alert(this.oApp.$MSG("XE_FindReplace.keywordMissing"));
		}else{
			alert(this.oApp.$MSG("XE_FindReplace.replaceAllResultP1")+iReplaceAllResult+this.oApp.$MSG("XE_FindReplace.replaceAllResultP2"));
		}
	}
});
//}
//{
/**
 * @fileOverview This file contains Xpress plugin that takes care of the operations related to hyperlink
 * @name hp_XE_Hyperlink.js
 */
xe.XE_Hyperlink = jQuery.Class({
	name : "XE_Hyperlink",
	sATagMarker : "HTTP://HUSKY_TMP.MARKER/",

	$init : function(elAppContainer){
		this._assignHTMLObjects(elAppContainer);
		this.sRXATagMarker = this.sATagMarker.replace(/\//g, "\\/").replace(/\./g, "\\.");
	},

	_assignHTMLObjects : function(elAppContainer){
		this.oHyperlinkLayer = jQuery("DIV.xpress_xeditor_hyperlink_layer", elAppContainer).get(0);
		this.oLinkInput = jQuery("INPUT[type=text]", this.oHyperlinkLayer).get(0);

		this.oBtnConfirm = jQuery("BUTTON.confirm", this.oHyperlinkLayer).get(0);
		this.oBtnCancel = jQuery("BUTTON.cancel", this.oHyperlinkLayer).get(0);

		this.oCbNewWin = jQuery("INPUT[type=checkbox]", this.oHyperlinkLayer).get(0);
	},

	$ON_MSG_APP_READY : function(){
		this.oApp.exec("REGISTER_HOTKEY", ["ctrl+k", "XE_TOGGLE_HYPERLINK_LAYER", []]);

		this.oApp.registerBrowserEvent(this.oBtnConfirm, "mousedown", "XE_APPLY_HYPERLINK");
		this.oApp.registerBrowserEvent(this.oBtnCancel, "mousedown", "HIDE_ACTIVE_LAYER");

		this.oApp.registerBrowserEvent(this.oLinkInput, "keydown", "EVENT_XE_HYPERLINK_KEYDOWN");

		this.oApp.exec("REGISTER_UI_EVENT", ["hyperlink", "click", "XE_TOGGLE_HYPERLINK_LAYER"]);
	},

	$ON_XE_TOGGLE_HYPERLINK_LAYER : function(){
		// hotkey may close the layer right away so delay here
		this.oApp.delayedExec("TOGGLE_TOOLBAR_ACTIVE_LAYER", [this.oHyperlinkLayer, null, "XE_RESET_HYPERLINK_LAYER", []], 0);
	},

	$ON_XE_RESET_HYPERLINK_LAYER : function(){
		this.oApp.exec("FOCUS", []);
		this.oSelection = this.oApp.getSelection();
		var oAnchor = this.oSelection.findAncestorByTagName("A");
		this.oCbNewWin.checked = false;
		if(oAnchor){
			this.oSelection.selectNode(oAnchor);
			this.oSelection.select();

			var sTarget = oAnchor.target;
			if(sTarget && sTarget == "_blank") this.oCbNewWin.checked = true;

			this.oLinkInput.value = oAnchor.href?oAnchor.href:"http://";
		}else{
			this.oLinkInput.value = "http://";
		}

		this.oLinkInput.focus();
		this.oLinkInput.value = this.oLinkInput.value;
	},

	$ON_XE_APPLY_HYPERLINK : function(){
		var sURL = this.oLinkInput.value;

		this.oApp.exec("FOCUS", []);
		this.oSelection = this.oApp.getSelection();

		//if(this._validateURL(sURL)){
        var sTarget = "";
        if(this.oCbNewWin.checked)
            sTarget = "_blank";
        else
            sTarget = "_self";

        if(this.oSelection.collapsed){
            var str = "<a href='" + sURL + "' target="+sTarget+">" + sURL + "</a>";
            this.oSelection.pasteHTML(str);
        }else{
            var nSession = Math.ceil(Math.random()*10000);
            var arg = ( sURL == "" ? ["unlink"] : ["createLink", false, this.sATagMarker+nSession+sURL] );
            this.oApp.exec("EXECCOMMAND", arg);

            this.oSelection.setFromSelection();

            var oDoc = this.oApp.getWYSIWYGDocument();
            var aATags = oDoc.body.getElementsByTagName("A");
            var nLen = aATags.length;
            var rxMarker = new RegExp(this.sRXATagMarker+nSession, "i");
            var elATag;
            for(var i=0; i<nLen; i++){
                elATag = aATags[i];
                if(elATag.href && elATag.href.match(rxMarker)){
                    elATag.href = elATag.href.replace(rxMarker, "");
                    elATag.target = sTarget;
                }
            }
        }
        this.oApp.exec("HIDE_ACTIVE_LAYER");

        setTimeout(jQuery.fnBind(function(){this.oSelection.select()}, this), 0);
		//}else{
			//alert(this.oApp.$MSG("XE_Hyperlink.invalidURL"));
			//this.oLinkInput.focus();
		//}
	},

	_validateURL : function(sURL){
		return /^(http|https|ftp|mailto):(?:\/\/)?((\w|-)+(?:[\.:@](\w|-))+)(?:\/|@)?([^"\?]*?)(?:\?([^\?"]*?))?$/.test(sURL);
	},

	$ON_EVENT_XE_HYPERLINK_KEYDOWN : function(oEvent){
		if (oEvent.keyCode == 13){
			this.oApp.exec("XE_APPLY_HYPERLINK");
			oEvent.preventDefault(); oEvent.stopPropagation();
		}
	}
});
//}
//{
/**
 * @fileOverview This file contains Xpress plugin that takes care of the operations related to table creation
 * @name hp_XE_Table.js
 */
xe.XE_Table = jQuery.Class({
	name : "XE_Table",
	iMinRows : 1,
	iMaxRows : 20,

	iMinColumns : 1,
	iMaxColumns : 10,

	iMinBorderWidth : 1,
	iMaxBorderWidth : 10,

	oSelection : null,

	$init : function(oAppContainer){
		this._assignHTMLObjects(oAppContainer);
	},

	_assignHTMLObjects : function(oAppContainer){
		var tmp = null;

		this.elDropdownLayer = jQuery("DIV.xpress_xeditor_table_layer", oAppContainer).get(0);
		this.welDropdownLayer = jQuery(this.elDropdownLayer);

		tmp = jQuery("INPUT", this.elDropdownLayer).get();
		this.oRowInput = tmp[0];
		this.oColumnInput = tmp[1];
		this.oBorderWidthInput = tmp[2];
		this.oBorderColorInput = tmp[3];
		this.oBGColorInput = tmp[4];

		tmp = jQuery("BUTTON", this.elDropdownLayer).get();
		this.oButton_AddRow = tmp[0];
		this.oButton_RemoveRow = tmp[1];
		this.oButton_AddColumn = tmp[2];
		this.oButton_RemoveColumn = tmp[3];
		this.oButton_IncBorderWidth = tmp[4];
		this.oButton_DecBorderWidth = tmp[5];
		this.oButton_BorderColorPreview = tmp[6];
		this.oButton_BorderColor = tmp[7];
		this.oButton_BGColorPreview = tmp[8];
		this.oButton_BGColor = tmp[9];
		this.oButton_Insert = tmp[10];
		this.oButton_Cancel = tmp[11];

		this.oSampleTable = jQuery("TABLE", this.elDropdownLayer).get(0);
	},

	$ON_MSG_APP_READY : function(){
		this.oApp.exec("REGISTER_UI_EVENT", ["table", "click", "ST_TOGGLE_TOOLBAR_LAYER"]);

		this.oApp.registerBrowserEvent(this.oRowInput, "change", "ST_SET_ROW_NUM", [null, 0]);
		this.oApp.registerBrowserEvent(this.oColumnInput, "change", "ST_SET_COLUMN_NUM", [null, 0]);
		this.oApp.registerBrowserEvent(this.oBorderWidthInput, "change", "ST_SET_BORDER_WIDTH", [null, 0]);

		this.oApp.registerBrowserEvent(this.oButton_AddRow, "click", "ST_ADD_ROW");
		this.oApp.registerBrowserEvent(this.oButton_RemoveRow, "click", "ST_REMOVE_ROW");
		this.oApp.registerBrowserEvent(this.oButton_AddColumn, "click", "ST_ADD_COLUMN");
		this.oApp.registerBrowserEvent(this.oButton_RemoveColumn, "click", "ST_REMOVE_COLUMN");

		this.oApp.registerBrowserEvent(this.oButton_IncBorderWidth, "click", "ST_INC_BORDER_WIDTH");
		this.oApp.registerBrowserEvent(this.oButton_DecBorderWidth, "click", "ST_DEC_BORDER_WIDTH");

		this.oApp.registerBrowserEvent(this.oButton_BorderColorPreview, "click", "ST_TOGGLE_BORDER_COLOR_LAYER");
		this.oApp.registerBrowserEvent(this.oButton_BGColorPreview, "click", "ST_TOGGLE_BGCOLOR_LAYER");

		this.oApp.registerBrowserEvent(this.oButton_BorderColor, "click", "ST_TOGGLE_BORDER_COLOR_LAYER");
		this.oApp.registerBrowserEvent(this.oButton_BGColor, "click", "ST_TOGGLE_BGCOLOR_LAYER");

		this.oApp.registerBrowserEvent(this.oButton_Insert, "click", "ST_INSERT_TABLE");
		this.oApp.registerBrowserEvent(this.oButton_Cancel, "click", "ST_CLOSE");

		this.oApp.exec("ST_SET_BORDER_COLOR", ["#CCCCCC"]);
		this.oApp.exec("ST_SET_BGCOLOR", ["#FFFFFF"]);
	},

	$ON_ST_TOGGLE_TOOLBAR_LAYER : function(){
		this.oApp.exec("RECORD_UNDO_ACTION_FORCED", ["KEYPRESS"]);

		this._showNewTable();
		this.oApp.exec("TOGGLE_TOOLBAR_ACTIVE_LAYER", [this.elDropdownLayer]);
	},

	$ON_ST_ADD_ROW : function(){
		this.oApp.exec("ST_SET_ROW_NUM", [null, 1]);
	},

	$ON_ST_REMOVE_ROW : function(){
		this.oApp.exec("ST_SET_ROW_NUM", [null, -1]);
	},

	$ON_ST_ADD_COLUMN : function(){
		this.oApp.exec("ST_SET_COLUMN_NUM", [null, 1]);
	},

	$ON_ST_REMOVE_COLUMN : function(){
		this.oApp.exec("ST_SET_COLUMN_NUM", [null, -1]);
	},

	$ON_ST_SET_ROW_NUM : function(iRows, iRowDiff){
		iRows = iRows || parseInt(this.oRowInput.value);
		iRowDiff = iRowDiff || 0;

		iRows += iRowDiff;

		if(iRows < this.iMinRows) iRows = this.iMinRows;
		if(iRows > this.iMaxRows) iRows = this.iMaxRows;

		this.oRowInput.value = iRows;
		this._showNewTable();
	},

	$ON_ST_SET_COLUMN_NUM : function(iColumns, iColumnDiff){
		iColumns = iColumns || parseInt(this.oColumnInput.value);
		iColumnDiff = iColumnDiff || 0;

		iColumns += iColumnDiff;

		if(iColumns < this.iMinColumns) iColumns = this.iMinColumns;
		if(iColumns > this.iMaxColumns) iColumns = this.iMaxColumns;

		this.oColumnInput.value = iColumns;
		this._showNewTable();
	},

	$ON_ST_INSERT_TABLE : function(){
		var sTable = this._getTableString();

		this.oApp.exec("PASTE_HTML", [sTable]);

		this.oApp.exec("ST_CLOSE", []);
	},

	$ON_ST_CLOSE : function(){
		this.oApp.exec("HIDE_ACTIVE_LAYER", []);
	},

	$ON_ST_SET_BORDER_WIDTH : function(iBorderWidth, iBorderWidthDiff){
		iBorderWidth = iBorderWidth || parseInt(this.oBorderWidthInput.value);
		iBorderWidthDiff = iBorderWidthDiff || 0;

		iBorderWidth += iBorderWidthDiff;

		if(iBorderWidth < this.iMinBorderWidth) iBorderWidth = this.iMinBorderWidth;
		if(iBorderWidth > this.iMaxBorderWidth) iBorderWidth = this.iMaxBorderWidth;

		this.oBorderWidthInput.value = iBorderWidth;
		this._showNewTable();
	},

	$ON_ST_INC_BORDER_WIDTH : function(){
		this.oApp.exec("ST_SET_BORDER_WIDTH", [null, 1]);
	},

	$ON_ST_DEC_BORDER_WIDTH : function(){
		this.oApp.exec("ST_SET_BORDER_WIDTH", [null, -1]);
	},

	$ON_ST_TOGGLE_BORDER_COLOR_LAYER : function(){
		if(this.welDropdownLayer.hasClass("p1"))
			this.oApp.exec("ST_HIDE_BORDER_COLOR_LAYER", []);
		else
			this.oApp.exec("ST_SHOW_BORDER_COLOR_LAYER", []);
	},

	$ON_ST_SHOW_BORDER_COLOR_LAYER : function(){
		this.welDropdownLayer.addClass("p1");
		this.welDropdownLayer.removeClass("p2");

		this.oApp.exec("SHOW_COLOR_PALETTE", ["ST_SET_BORDER_COLOR_FROM_PALETTE", this.elDropdownLayer]);
	},

	$ON_ST_HIDE_BORDER_COLOR_LAYER : function(){
		this.welDropdownLayer.removeClass("p1");

		this.oApp.exec("HIDE_COLOR_PALETTE", []);
	},

	$ON_ST_TOGGLE_BGCOLOR_LAYER : function(){
		if(this.welDropdownLayer.hasClass("p2"))
			this.oApp.exec("ST_HIDE_BGCOLOR_LAYER", []);
		else
			this.oApp.exec("ST_SHOW_BGCOLOR_LAYER", []);
	},

	$ON_ST_SHOW_BGCOLOR_LAYER : function(){
		this.welDropdownLayer.removeClass("p1");
		this.welDropdownLayer.addClass("p2");

		this.oApp.exec("SHOW_COLOR_PALETTE", ["ST_SET_BGCOLOR_FROM_PALETTE", this.elDropdownLayer]);
	},

	$ON_ST_HIDE_BGCOLOR_LAYER : function(){
		this.welDropdownLayer.removeClass("p2");

		this.oApp.exec("HIDE_COLOR_PALETTE", []);
	},

	$ON_ST_SET_BORDER_COLOR_FROM_PALETTE : function(sColorCode){
		this.oApp.exec("ST_SET_BORDER_COLOR", [sColorCode]);
		this.oApp.exec("ST_HIDE_BORDER_COLOR_LAYER", []);
	},

	$ON_ST_SET_BORDER_COLOR : function(sColorCode){
		this.oBorderColorInput.value = sColorCode;
		this.oButton_BorderColorPreview.style.backgroundColor = sColorCode;

		this._showNewTable();
	},

	$ON_ST_SET_BGCOLOR_FROM_PALETTE : function(sColorCode){
		this.oApp.exec("ST_SET_BGCOLOR", [sColorCode]);
		this.oApp.exec("ST_HIDE_BGCOLOR_LAYER", []);
	},

	$ON_ST_SET_BGCOLOR : function(sColorCode){
		this.oBGColorInput.value = sColorCode;
		this.oButton_BGColorPreview.style.backgroundColor = sColorCode;

		this._showNewTable();
	},

	_showNewTable : function(){
		var oTmp = document.createElement("DIV");
		oTmp.innerHTML = this._getTableString();
		var oNewTable = oTmp.firstChild;
		this.oSampleTable.parentNode.insertBefore(oNewTable, this.oSampleTable);
		this.oSampleTable.parentNode.removeChild(this.oSampleTable);
		this.oSampleTable = oNewTable;
	},

	// need to do something about the table width as the same HTML code is being used to the actual table and the preview table
	_getTableString : function(){
		var sBorderColorCode = this.oBorderColorInput.value;
		var sBGColorCode = this.oBGColorInput.value;
		var iBorderWidth = this.oBorderWidthInput.value;
		var sTD = "";
		if(jQuery.browser.msie){
			sTD = "<td><p></p></td>";
		}else{
			if(jQuery.browser.firefox){
				sTD = "<td><p><br/></p></td>";
			}else{
				sTD = "<td><p>&nbsp;</p></td>";
			}
		}

		var sTable = '<table style="background:'+sBorderColorCode+'" cellspacing="'+iBorderWidth+'">';
		var sRow = '<tr style="background:'+sBGColorCode+'">';
		var iColumns = this.oColumnInput.value;
		for(var i=0; i<iColumns; i++){
			sRow += sTD;
		}
		sRow += "</tr>\n";

		var iRows = this.oRowInput.value;

		sTable += "<tbody>";
		for(var i=0; i<iRows; i++){
			sTable += sRow;
		}
		sTable += "</tbody>";

		sTable += "</table>";

		return sTable;
	}
});
//}
//{
/**
 * @fileOverview This file contains Xpress plugin that takes care of the operations related to changing the editing mode using a Button element
 * @name hp_XE_EditingModeToggler.js
 */
xe.XE_EditingModeToggler = jQuery.Class({
	name : "XE_EditingModeToggler",

	$init : function(elAppContainer){
		this._assignHTMLObjects(elAppContainer);
	},

	_assignHTMLObjects : function(elAppContainer){
		elAppContainer = jQuery.$(elAppContainer) || document;

		this.elModeToggleButton = jQuery("BUTTON.xpress_xeditor_mode_toggle_button", elAppContainer).get(0);
		this.welModeToggleButton = jQuery(this.elModeToggleButton);
	},

	$ON_MSG_APP_READY : function(){
		this.oApp.registerBrowserEvent(this.elModeToggleButton, "click", "EVENT_TOGGLE_EDITING_MODE", []);
	},

	$ON_EVENT_TOGGLE_EDITING_MODE : function(){
		if(this.oApp.getEditingMode() == "WYSIWYG")
			this.oApp.exec("CHANGE_EDITING_MODE", ["HTMLSrc"]);
		else
			this.oApp.exec("CHANGE_EDITING_MODE", ["WYSIWYG"]);
	},

	$ON_CHANGE_EDITING_MODE : function(sMode){
		if(sMode == "HTMLSrc"){
			this.welModeToggleButton.addClass("active").parent("span").addClass("active");
			this.oApp.exec("DISABLE_ALL_UI", []);
		}else{
			this.welModeToggleButton.removeClass("active").parent("span").removeClass("active");
			this.oApp.exec("ENABLE_ALL_UI", []);
		}
	}
});
//}
/**
 * @fileOverview This file contains a message mapping(Korean), which is used to map the message code to the actual message
 * @name xpress_XE_Lang_KR.js
 */
var oMessageMap = {
	'XE_EditingAreaManager.onExit' : '%uB0B4%uC6A9%uC774%20%uBCC0%uACBD%uB418%uC5C8%uC2B5%uB2C8%uB2E4.',
	'XE_FontColor.invalidColorCode' : '%uC0C9%uC0C1%20%uCF54%uB4DC%uB97C%20%uC62C%uBC14%uB974%uAC8C%20%uC785%uB825%uD558%uC5EC%20%uC8FC%uC2DC%uAE30%20%uBC14%uB78D%uB2C8%uB2E4.\n\n%uC608%29%20%23000000%2C%20%23FF0000%2C%20%23FFFFFF%2C%20%23ffffff%2C%20ffffff',
	'XE_BGColor.invalidColorCode' : '%uC0C9%uC0C1%20%uCF54%uB4DC%uB97C%20%uC62C%uBC14%uB974%uAC8C%20%uC785%uB825%uD558%uC5EC%20%uC8FC%uC2DC%uAE30%20%uBC14%uB78D%uB2C8%uB2E4.\n\n%uC608%29%20%23000000%2C%20%23FF0000%2C%20%23FFFFFF%2C%20%23ffffff%2C%20ffffff',
	'XE_Hyperlink.invalidURL' : '%uC785%uB825%uD558%uC2E0%20URL%uC774%20%uC62C%uBC14%uB974%uC9C0%20%uC54A%uC2B5%uB2C8%uB2E4.',
	'XE_FindReplace.keywordMissing' : '%uCC3E%uC73C%uC2E4%20%uB2E8%uC5B4%uB97C%20%uC785%uB825%uD574%20%uC8FC%uC138%uC694.',
	'XE_FindReplace.keywordNotFound' : '%uCC3E%uC73C%uC2E4%20%uB2E8%uC5B4%uAC00%20%uC5C6%uC2B5%uB2C8%uB2E4.',
	'XE_FindReplace.replaceAllResultP1' : '%uC77C%uCE58%uD558%uB294%20%uB0B4%uC6A9%uC774%20%uCD1D%20',
	'XE_FindReplace.replaceAllResultP2' : '%uAC74%20%uBC14%uB00C%uC5C8%uC2B5%uB2C8%uB2E4.',
	'XE_FindReplace.notSupportedBrowser' : '%uD604%uC7AC%20%uC0AC%uC6A9%uD558%uACE0%20%uACC4%uC2E0%20%uBE0C%uB77C%uC6B0%uC800%uC5D0%uC11C%uB294%20%uC0AC%uC6A9%uD558%uC2E4%uC218%20%uC5C6%uB294%20%uAE30%uB2A5%uC785%uB2C8%uB2E4.%5Cn%uC774%uC6A9%uC5D0%20%uBD88%uD3B8%uC744%20%uB4DC%uB824%20%uC8C4%uC1A1%uD569%uB2C8%uB2E4.'
};
/**
 * XHTML Formatter
 * @author gony
 */
(function($){

var
	regex_meanless_css1 = /<(.*?)\s+style\s*=\s*"(.*?(?:margin|padding)\s*:\s*0(?:px)?.*?|.*?\-(?:moz|ms|webkit|opera).*?)"(.*?)>/ig,
	regex_meanless_css2 = /(?:(?:margin|padding)\s*:\s*0(?:px)?|\-(?:moz|ms|webkit|opera)\-[\w-]+\s*:\s*.*?|[\w-]+\s*:\s*\-(?:moz|ms|webkit|opera)\-[\w-]+|(?:line-height|font-variant|font-stretch|font-size-adjust|font-size)\s*:\s*[a-z_-]+)\s*;?\s*|font-(?:weight|style)\s*:\s*normal;?/ig,
	regex_class  = /<(.*?)\s+class\s*=(?:\s*"(.*?)"|\s*'(.*?)'|([^\s>]+))(.*?)>/ig,
	regex_class2 = /xe_selected_cell/g;
	regex_handler = /<(.*?)\s+on[a-z]+\s*=(?:\s*".*?"|\s*'.*?'|[^\s>]+)(.*?)>/ig,
	//regex_id = /<(.*?)\s+id\s*=(?:[^\s>]+|\s*".*?"|\s*'.*?')(.*?)>/ig,
	regex_script = /<script[\s\S]+?<\/script>/ig,
	regex_font_color = /color\s*=(?:\s*"(.*?)"|\s*'(.*?)'|([^\s>]+))/i,
	regex_font_face  = /face\s*=(?:\s*"(.*?)"|\s*'(.*?)'|([^\s>]+))/i,
	regex_font_size  = /size\s*=(?:\s*"(\d+)"|\s*'(\d+)'|(\d+))/i,
	regex_style = /style\s*=\s*(?:\s*"(.*?)"|\s*'(.*?)'|([^\s>]+))/i,
	regex_font_weight = /font-weight\s*:\s*([a-z]+);?/i,
	regex_font_style = /font-style\s*:\s*italic;?/i,
	regex_font_decoration = /text-decoration\s*:\s*([a-z -]+);?/i,
	regex_jquery = /jQuery\d+\s*=(\s*"\d+"|\d+)/ig,
	regex_quote_attr = /([\w-]+\s*=(?:\s*"[^"]+"|\s*'[^']+'))|([\w-]+)=([^\s]+)/g; //"

var
	allow_tags  = 'a,abbr,acronym,address,area,blockquote,br,caption,center,cite,code,col,colgroup,dd,del,dfn,div,dl,dt,em,embed,h1,h2,h3,h4,h5,h6,hr,img,ins,kbd,li,map,object,ol,p,param,pre,q,samp,span,strong,sub,sup,table,tbody,td,tfoot,th,thead,tr,tt,u,ul,var,iframe,object,param'.split(','),
	lonely_tags = 'area,br,col,embed,hr,img,input,param'.split(',');

var
	replace_tags = {
		'b' : 'strong',
		'i' : 'em',
		's' : 'del',
		'strike' : 'del'
	};

xe.XE_XHTMLFormatter = $.Class({
	name : "XE_XHTMLFormatter",

	$ON_MSG_APP_READY : function() {
		this.oApp.addConverter("WYSIWYG_TO_IR", this.TO_IR);
		this.oApp.addConverter("HTMLSrc_TO_IR", this.TO_IR);
		this.oApp.addConverter("IR_TO_HTMLSrc", this.IR_TO);
		this.oApp.addConverter("IR_TO_WYSIWYG", this.IR_TO);
	},

	TO_IR : function(sContent) {
		var stack = [];

        // remove xeHandled attrs
        sContent = sContent.replace(/xeHandled="YES"/ig,'');


		// remove all useless styles
		sContent = sContent.replace(regex_meanless_css1, function(m0,m1,m2,m3){
			m2 = m2.replace(regex_meanless_css2, '');

			return '<'+m1+(m2?' style="'+m2+'"':'')+m3+'>';
		});

		// remove all useless classes
		sContent = sContent.replace(regex_class, function(m0,m1,m2,m3,m4,m5){
			var cls = jQuery.trim((m2 || m3 || m4 || "").replace(regex_class2, ''));

			return '<'+(m1||"")+(cls?' class="'+cls+'"':'')+(m5||"")+'>';
		});

		// remove all event handler
		sContent = sContent.replace(regex_handler, '<$1$2>');

		// remove all id
		//sContent = sContent.replace(regex_id, '<$1$2>');

		// remove all scripts
		sContent = sContent.replace(regex_script, '');

		if (jQuery.browser.msie) {
			// remove jQuery attributes
			sContent = sContent.replace(regex_jquery, '');

			// quote all attrs
			sContent = sContent.replace(/<(\w+) ([^>]+)>/g, function(m0,m1,m2){
				return '<'+m1+' '+
					m2.replace(regex_quote_attr, function(s0,s1,s2,s3){
						if (s1) return s1;
                        if(/^"/.test(s3)||/"$/.test(s3)) return s2+'='+s3;
						return s2+'="'+s3+'"';
					}) + '>';
			});
		}

		// remove all useless tag and enclose tags
		regex = /<(\/)?([:\w\/-]+)(.*?)>/ig;
		sContent = sContent.replace(regex, function(m0,m1,m2,m3){
			var m3s = [];
			var state = '';

			m1 = m1 || '';
			m2 = m2.toLowerCase();
			m3 = $.trim(m3 || '');

			if (!m1) {
				if ($.inArray(m2,lonely_tags) >= 0) {
					var len = m3.length;
					if (m2 == 'br') m3 = '';
					if (!m3 || m3.substring(len-1,len) != '/') m3 += ' /';

					return '<'+m2+' '+m3+'>';
				}

				if (replace_tags[m2]) {
					stack.push({tag:m2, state:'deleted'});

					m2 = replace_tags[m2];
					state = 'inserted';
				} else if (m2 == 'font') {
					stack.push({tag:m2, state:'deleted'});

					m2 = 'span';
					m3s = [];
					if (regex_font_color.test(m3)) m3s.push('color:'+(RegExp.$1||RegExp.$2||RegExp.$3)+';');
					if (regex_font_face.test(m3)) m3s.push('font-family:'+(RegExp.$1||RegExp.$2||RegExp.$3)+';');

					m3 = m3s.length?'style="'+m3s.join('')+'"':'';
					state = 'inserted';
				} else if (m2 == 'center') {
					stack.push({tag:m2, state:'deleted'});

					m2 = 'div'
					m3 = 'style="text-align:center"';

					state = 'inserted';
				} else if (m2 == 'span') {
					var style = '';

					if (!m3) {
						stack.push({tag:m3, state:'deleted'});
						return '';
					}

					if (regex_style.test(m3)) {
						var tmpstack = [];
						var tmptag   = '';

						style = RegExp.$1||RegExp.$2||RegExp.$3;
						m3 = m3.replace(regex_style, '');

						if (regex_font_weight.test(style)) {
							if (RegExp.$1 == 'bold' || RegExp.$1 == 'bolder') {
								style = style.replace(regex_font_weight, '');
								tmpstack.push({tag:'strong', state:'inserted'});
								tmptag += '<strong>';
							}
						}

						if (regex_font_style.test(style)) {
							style = style.replace(regex_font_style, '');
							tmpstack.push({tag:'em', state:'inserted'});
							tmptag += '<em>';
						}

						if (regex_font_decoration.test(style)) {
							var deco_css = ' '+RegExp.$1.toLowerCase()+' ';

							if (deco_css.indexOf('underline ') > 0) {
								deco_css = deco_css.replace('underline ', '');
								tmpstack.push({tag:'u', state:'inserted'});
								tmptag += '<u>';
							}

							if (deco_css.indexOf('line-through ') > 0) {
								deco_css = deco_css.replace('line-through ', '');
								tmpstack.push({tag:'del', state:'inserted'});
								tmptag += '<del>';
							}

							deco_css = $.trim(deco_css);
							style = style.replace(regex_font_decoration, (deco_css?'text-decoration:'+deco_css+';':''));
						}

						style = $.trim(style);

						stack.push({tag:m2, state:(!m3&&!style?'deleted':'')});
						stack = stack.concat(tmpstack);

						return (!m3&&!style?'':'<span '+m3+' style="'+style+'">')+tmptag;
					}
				} else {
					state = (jQuery.inArray(m2,allow_tags) < 0)?'deleted':'';
					if (state == 'deleted') return '';
				}

				stack.push({tag:m2, state:state});
			} else {
				var tags = [], t = '';

				if (!stack.length) return '';

				do {
					t = stack.pop();
					if (t.state != 'inserted' && t.tag != m2) {
						stack.push(t);
						return tags.join('');
					}
					if (t.state != 'deleted') tags.push('</'+t.tag+'>');
				} while(stack.length && t.tag != m2);

				return tags.join('');
			}

			return '<'+m1+m2+(m3?' '+m3:'')+'>';
		});
		if (stack.length) {
			var t = '';

			do {
				t = stack.pop();
				if (t.state != 'deleted') sContent += '</'+t.tag+'>';
			} while(stack.length);
		}

		return sContent;
	},

	IR_TO : function(sContent) {
		return sContent;
	}
});

// center, font, b, i, s, strike

})(jQuery);
/**
 * Format Block plugin
 * @author gony
 */
xe.XE_FormatWithSelectUI = jQuery.Class({
	name : "XE_FormatWithSelectUI",

	$init : function(elAppContainer){
		this._assignHTMLObjects(elAppContainer);
	},

	_assignHTMLObjects : function(elAppContainer){
		this.elFormatSelect = jQuery("SELECT.xpress_xeditor_ui_format_select", elAppContainer).get(0);
	},

	$ON_MSG_APP_READY : function(){
		this.oApp.registerBrowserEvent(this.elFormatSelect, "change", "SET_FORMAT_FROM_SELECT_UI");
		this.elFormatSelect.selectedIndex = 0;
	},

	$ON_MSG_STYLE_CHANGED : function(sAttributeName, sAttributeValue){
		var blockName = this.oApp.getWYSIWYGDocument().queryCommandValue("FormatBlock");

		if (!blockName) return (this.elFormatSelect.selectedIndex = 0);
		if (jQuery.browser.msie && /([0-9])/.test(blockName)) blockName = 'h'+(RegExp.$1);

		this.elFormatSelect.value = blockName.toLowerCase();
		if(this.elFormatSelect.selectedIndex < 0) this.elFormatSelect.selectedIndex = 0;
	},

	$ON_SET_FORMAT_FROM_SELECT_UI : function(){
		var sFormat = this.elFormatSelect.value;
		if(!sFormat) return;
		if(jQuery.browser.msie) sFormat = '<'+sFormat+'>';

		this.oApp.exec("EXECCOMMAND", ["FormatBlock", false, sFormat]);
		this.oApp.exec("CHECK_STYLE_CHANGE", []);
	}
});

(function($){
/**
 * Enhanced Table Fetures
 * @author NHN (developers@xpressengine.com)
 */

// 표 편집 확장 기능
xe.XE_Table = jQuery.Class({
	_startSel : null,
	_endSel   : null,

	$ON_MSG_APP_READY : function() {
		this._doc = $(this.oApp.getWYSIWYGDocument());

		this.$FnMouseDown = $.fnBind(this._mousedown, this);
		this.$FnMouseUp   = $.fnBind(this._mouseup, this);
		this.$FnMouseMove = $.fnBind(this._mousemove, this);

		this._doc.mousedown(this.$FnMouseDown);

		// initialize
		this._startSel = null;
		this._endSel   = null;

		// register buttons
		this.oApp.exec('REGISTER_UI_EVENT', ['merge_cells', 'click', 'MERGE_CELLS']);
		this.oApp.exec('REGISTER_UI_EVENT', ['split_col', 'click', 'CELL_SPLIT_BY_COL']);
		this.oApp.exec('REGISTER_UI_EVENT', ['split_row', 'click', 'CELL_SPLIT_BY_ROW']);

		// register hotkeys
		this.oApp.exec('REGISTER_HOTKEY', ['ctrl+alt+m', 'MERGE_CELLS']);

		// perform default ready action
		this.$super.$ON_MSG_APP_READY();
	},

	$ON_MERGE_CELLS : function() {
		var html = "";
		var cell = jQuery('.xe_selected_cell', this.oApp.getWYSIWYGDocument()).filter('td,th');
		var self = this;

		// 선택된 셀이 없으면 종료
		if (!cell.length) return;

		// UNDO 지점 기록
		this.oApp.exec("RECORD_UNDO_ACTION", ["Cell:Merge"]);

		// 선택한 모든 셀의 데이터를 첫번째 셀로 복사
		cell.each(function(){ html += jQuery(this).html() }).eq(0).html(html);

		// 첫번째 셀 가로 확장
		var colspan = 0;
		cell.eq(0).nextAll('td,th').andSelf().filter('.xe_selected_cell').each(function(idx){
			colspan += self._getSpan(this, 'col');
		});

		// 마지막 셀까지 줄의 갯수 계산
		var rect = this._getRect(cell.eq(0));
		var start_tr = cell.eq(0).parent('tr');
		var end_tr   = cell.eq(cell.length-1).parent('tr');
		var all_rows = cell.parents('table').eq(0).find('tr');
		var rowspan  = all_rows.index(end_tr.get(0)) - all_rows.index(start_tr.get(0)) + this._getSpan(cell.eq(cell.length-1), 'row');

		// 첫번째 셀 colspan, rowspan 속성 지정
		cell.eq(0).attr('colSpan', colspan).attr('rowSpan', rowspan);

		// 첫번째 셀을 제외한 다른 모든 셀 제거
		cell.slice(1).remove();
	},

	$ON_CELL_SPLIT_BY_ROW : function(many) {
		var cell  = $('.xe_selected_cell', this.oApp.getWYSIWYGDocument()).filter('td,th');
		var table = cell.parents('table').eq(0);
		var self  = this;

		// 선택된 셀이 없으면 종료
		if (!cell.length) return;

		// UNDO 지점 기록
		this.oApp.exec("RECORD_UNDO_ACTION", ["Cell:Split By Row"]);

		// 선택 영역의 상하 좌표 구함
		var _top    = this._getRect(cell.eq(0)).top;
		var _bottom = this._getRect(cell.eq(cell.length-1)).bottom;

		// 테이블의 모든 셀에서 선택영역에 해당하는 셀을 구한다(상하 기준).
		(cell = table.find('td,th').filter(function(){
			var rect = self._getRect(jQuery(this));

			return !(rect.bottom <= _top || rect.top >= _bottom);
		})).filter('.xe_selected_cell').each(function(){
			var t       = $(this);
			var row     = t.parent('tr');
			var rowspan = self._getSpan(t, 'row');
			var rect    = self._getRect(t);
			var queue   = [];
			var clone   = t.clone().html('<br />');
			var topspan = 1, botspan = 1;

			// rowspan > 1이면 현재 셀의 rowspan을 절반으로 분할한다.
			if (rowspan > 1) {

				topspan = Math.ceil(rowspan/2);
				botspan = rowspan - topspan;

				queue.push(function(){
					t.attr('rowSpan', topspan);
				});

				clone.attr('rowSpan', botspan);
			} else {
				// rowspan이 없으면 현재 셀과 영역이 겹치는 모든 셀에 rowspan을 추가
				cell.filter(function(){
					if (t.get(0) == this) return false;

					var tt = jQuery(this);
					var rc = self._getRect(tt);

					// 범위를 넘은 부분은 제외
					if (rc.bottom <= rect.top || rc.top >= rect.bottom) return false;

					return true;
				}).each(function(){
					var tt = jQuery(this);
					var sp = self._getSpan(tt, 'row')+1;

					// rowspan 1 추가
					queue.push(function(){
						tt.attr('rowSpan', sp);
					});
				});

				// 새 줄을 추가한다.
				if (jQuery.browser.msie) {
					// Fix bug for IE
					row.after(row.clone().empty().get(0).outerHTML);
				} else {
					row.after(row.clone().empty());
				}
			}

			var rows  = row.nextAll('tr');

			// 현재 셀이 마지막 줄에 있다면 한 줄 추가 후 새로운 셀 추가
			if (!rows.length) {
				row.after(row.clone().empty().append(clone));
			} else {
				var next_sib  = rows.eq(topspan - 1).children('td,th').filter(function(){
					return ( self._getRect(jQuery(this)).left > rect.left );
				});

				if (jQuery.browser.msie) {
					next_sib.length?
						next_sib.eq(0).before(clone.get(0).outerHTML):
						rows.eq(topspan-1).append(clone.get(0).outerHTML);
				} else {
					next_sib.length?
						next_sib.slice(0,1).before(clone):
						rows.slice(topspan-1,1).append(clone);
				}
			}

			// 함수를 바로 실행하면 좌표가 틀어지므로, 큐에 넣은 후 실행
			jQuery.each(queue, function(){ this(); });

		});
	},

	$ON_CELL_SPLIT_BY_COL : function(many) {
		var cell   = $('.xe_selected_cell', this.oApp.getWYSIWYGDocument()).filter('td,th');
		var table  = cell.parents('table').slice(0,1);
		var self   = this;
		var ie_bug = [], tmpId = (new Date).getTime(), tmpStr = '';

		// 선택된 셀이 없으면 종료
		if (!cell.length) return;

		// UNDO 지점 기록
		this.oApp.exec("RECORD_UNDO_ACTION", ["Cell:Split By Column"]);

		// 선택 영역의 좌우 좌표 구함
		var first_row = cell.eq(0).parent('tr');
		var _left = this._getRect(first_row.find('.xe_selected_cell:first')).left;
		var _right = this._getRect(first_row.find('.xe_selected_cell:last')).right;

		// 테이블의 모든 셀에서 선택영역에 해당하는 셀을 구한다(좌우 기준).
		(cell = table.find('td,th').filter(function(){
			var rect = self._getRect(jQuery(this));

			return !(rect.right <= _left || rect.left >= _right);
		})).filter('.xe_selected_cell').each(function(idx){
			var t       = jQuery(this);
			var colspan = self._getSpan(t, 'col');
			var clone   = t.clone().html('<br />');

			// colspan > 1 이면 colspan을 절반으로 분할한다.
			if (colspan > 1) {
				var leftspan  = Math.ceil(colspan/2);
				var rightspan = colspan - leftspan;

				t.attr('colSpan', leftspan);
				clone.attr('colSpan', rightspan);
			} else {
				// colspan이 없으면 현재 셀과 영역이 겹치는 모든 셀에 colspan을 추가
				var rect = self._getRect(t);

				cell.filter(function(){
					if (t.get(0) == this) return false;

					var tt = jQuery(this);
					var rc = self._getRect(tt);

					// 범위를 넘은 부분은 제외
					if (rc.right <= rect.left || rc.left >= rect.right) return false;

					return true;
				}).each(function(){
					var tt = jQuery(this);

					// colspan 1 추가
					tt.attr('colSpan', self._getSpan(tt, 'col')+1);
				});

				clone.attr('colSpan', 1);
			}

			if (jQuery.browser.msie) {
				// Fix for IE bug
				t.after(clone.get(0).outerHTML);
			} else {
				t.after(clone);
			}
		});
	},

	$ON_CHECK_STYLE_CHANGE : function(){
		var ui  = ['merge_cells', 'split_col', 'split_row'];
		var app = this.oApp;
		var command = (this._startSel && this._startSel.is('.xe_selected_cell'))?'ENABLE_UI':'DISABLE_UI';

		jQuery.each(ui, function(){ app.exec(command, [this]); });
	},

	_mousedown : function(event) {
		var cur = $(event.target);
		var sel = cur.parents().andSelf().filter('td,th,table');
		var app = this.oApp;
		var self = this;

		// 모든 선택영역 해제
		$('td.xe_selected_cell', this.oApp.getWYSIWYGDocument()).removeClass('xe_selected_cell');

		this._startSel = null;
		this._endSel   = null;

		if (!sel.length || !this._isLeftClicked(event.button)) return;

		function delayed(){
			sel = app.getSelection().cloneRange();
			sel.collapseToStart();
			sel = jQuery(sel.startContainer).parents().andSelf().filter('td,th').eq(0);

			if (!sel.length) return self._removeAllListener()||true;

			// 좌표를 구한다
			self._getRect(self._startSel = sel);

			// 이벤트 바인딩
			self._doc.bind('mousemove', self.$FnMouseMove);
			self._doc.bind('mouseup', self.$FnMouseUp);
		}

		// mousedown이 일어난 후에 선택 영역이 설정되므로 실행을 지연시킨다.
		setTimeout(delayed, 0);
	},

	_mouseup : function(event) {
		// 선택된 셀 확인
		this._removeAllListener();

		// 시작셀과 종료셀 제거
		this._startSel = this._endSel = null;
	},

	_mousemove : function(event) {
		var cur  = $(event.target);
		var cell = cur.parents().andSelf().filter('td,th').eq(0);
		var self = this;

		// 마우스 왼쪽 버튼이 눌리지 않았으면 종료
		if (!cell.length || !this._isLeftClicked(event.button)) return;
		if (!this._endSel && cell.get(0) == this._startSel.get(0)) return;
		if (this._endSel && cell.get(0) == this._endSel.get(0)) return;

		// 종료셀 && 종료셀의 좌표
		this._getRect(this._endSel = cell);

		// 선택 범위를 구한다
		var _top    = Math.min(this._startSel.rect.top,  this._endSel.rect.top);
		var _left   = Math.min(this._startSel.rect.left, this._endSel.rect.left);
		var _bottom = Math.max(this._startSel.rect.bottom, this._endSel.rect.bottom);
		var _right  = Math.max(this._startSel.rect.right,  this._endSel.rect.right);

		var table = cell.parents('table');
		var cells = table.find('td,th').removeClass('xe_selected_cell');
		var i = 0;

		// 복잡한 모양의 테이블을 위한 반복 처리
		var selected = $();
		do {
			// 선택한 셀로 최대 영역 재계산
			selected.each(function(){
				var rect = self._getRect(jQuery(this));

				// 영역 재계산
				if (rect.right  > _right)  _right  = rect.right;
				if (rect.left   < _left)   _left   = rect.left;
				if (rect.top    < _top)    _top    = rect.top;
				if (rect.bottom > _bottom) _bottom = rect.bottom;
			});

			// 좌표 범위 안에 있는 선택할 셀을 추린다.
			cells = cells.filter(':not(.xe_selected_cell)');
			selected = cells.filter(function(){
				var rect = self._getRect(jQuery(this));

				if (rect.right <= _left || rect.left >= _right || rect.bottom <= _top || rect.top >= _bottom) return false;

				return true;
			}).addClass('xe_selected_cell');
		} while(selected.length);

		// 브라우저의 기본 선택영역 해제 : FF 제외 - 기본 기능이 충분히 좋아서 + 이 부분을 실행하면 오류가 발생해서
		if (!$.browser.mozilla) {
			function delayed() {
				var sel = self.oApp.getSelection();

				if (!self._startSel) return;
				if (!self._startSel.get(0).firstChild) self._startSel.text(" ");

				sel.selectNode(self._startSel.get(0).firstChild);
				sel.collapseToStart();
				sel.select();
			}

			setTimeout(delayed, 0);
		}

		return false;
	},

	_removeAllListener : function() {
		// 이벤트 해제
		this._doc.unbind("mousemove", this.$FnMouseMove);
		this._doc.unbind("mouseup", this.$FnMouseUp);
	},

	_isLeftClicked : function(value) {
		return jQuery.browser.msie?!!(value & 1):(value == 0);
	},

	_getRect : function(obj) {
		var el = obj.get(0);

		obj.rect = {};
		obj.rect.top    = el.offsetTop;
		obj.rect.left   = el.offsetLeft;
		obj.rect.bottom = obj.rect.top  + el.offsetHeight;
		obj.rect.right  = obj.rect.left + el.offsetWidth;

		return obj.rect;
	},

	_getSpan : function(obj, type) {
		var span = parseInt($(obj).attr(type+'span'));

		return isNaN(span)?1:span;
	}
}).extend(xe.XE_Table);

xe.XE_FontSetter = $.Class({
	name : "XE_FontSetter",
	fontFamily : '',
	fontSize : '',
	$init : function(fontFamily, fontSize) {
		this.fontFamily = fontFamily || '';
		this.fontSize = fontSize || '';
	},
	$ON_MSG_APP_READY : function() {
		var doc = this.oApp.getWYSIWYGDocument();
		if (this.fontFamily) doc.body.style.fontFamily = this.fontFamily;
		if (this.fontSize) doc.body.style.fontSize = this.fontSize;
	}
});

xe.XE_WYSIWYGEnterKey = $.Class({
	name : "XE_WYSIWYGEnterKey",
	sLineBreaker : "P",
	$init : function(sLineBreaker){
		if(sLineBreaker == "BR"){
			this.sLineBreaker = "BR";
		}else{
			this.sLineBreaker = "P";
		}

		if(($.browser.msie || $.browser.opera) && this.sLineBreaker == "P"){
			this.$ON_MSG_APP_READY = function(){};
		}
	},
	$ON_MSG_APP_READY : function(){
		var doc = this.oApp.getWYSIWYGDocument();

		if (typeof doc._enterkey_binded == "undefined") {		
			$(doc).keydown($.fnBind(this._onKeyDown, this));
			doc._enterkey_binded = true;
		}
	},
	_onKeyDown : function(event){	
		if(event.shiftKey) return;
		
		if(event.keyCode == 13){ // enter
			if(this.sLineBreaker == "BR"){
				this._insertBR(event);
			}else{
				this._wrapBlock(event);
			}
			return false;
		}
	},
	_wrapBlock : function(event, sWrapperTagName){
		var oSelection = this.oApp.getSelection();
		var sBM = oSelection.placeStringBookmark();
		var oLineInfo = oSelection.getLineInfo();
		var oStart = oLineInfo.oStart;
		var oEnd = oLineInfo.oEnd;

		// line broke by sibling
		// or
		// the parent line breaker is just a block container
		if(!oStart.bParentBreak || oSelection.rxBlockContainer.test(oStart.oLineBreaker.tagName)){
			event.stopPropagation();
			event.preventDefault();

			var oSWrapper = this.oApp.getWYSIWYGDocument().createElement(this.sLineBreaker);
			oSelection.moveToBookmark(sBM);
			oSelection.setStartBefore(oStart.oNode);
			oSelection.surroundContents(oSWrapper);

			oSelection.collapseToEnd();

			var oEWrapper = this.oApp.getWYSIWYGDocument().createElement(this.sLineBreaker);
			oSelection.setEndAfter(oEnd.oNode);
			oSelection.surroundContents(oEWrapper);

			oSelection.removeStringBookmark(sBM);

			if(oSWrapper.innerHTML == "") oSWrapper.innerHTML = "<br>";
			if(oEWrapper.innerHTML == "") oEWrapper.innerHTML = "<br>";
			
			if(oEWrapper.nextSibling && oEWrapper.nextSibling.tagName == "BR") oEWrapper.parentNode.removeChild(oEWrapper.nextSibling);

			oSelection.selectNodeContents(oEWrapper);
			oSelection.collapseToStart();
			oSelection.select();
			this.oApp.exec("CHECK_STYLE_CHANGE", []);
		}else{
			oSelection.removeStringBookmark(sBM);
		}
	},
	
	_insertBR : function(event){
		event.stopPropagation();
		event.preventDefault();

		var oSelection = this.oApp.getSelection();

		var elBR = this.oApp.getWYSIWYGDocument().createElement("BR");
		oSelection.insertNode(elBR);
		oSelection.selectNode(elBR);
		oSelection.collapseToEnd();
		
		if(!$.browser.msie){
			var oLineInfo = oSelection.getLineInfo();
			var oStart = oLineInfo.oStart;
			var oEnd = oLineInfo.oEnd;

			if(oEnd.bParentBreak){
				while(oEnd.oNode && oEnd.oNode.nodeType == 3 && oEnd.oNode.nodeValue == ""){
					oEnd.oNode = oEnd.oNode.previousSibling;
				}

				var nTmp = 1;
				if(oEnd.oNode == elBR || oEnd.oNode.nextSibling == elBR){
					nTmp = 0;
				}

				if(nTmp == 0){
					oSelection.pasteHTML("<br type='_moz'/>");
					oSelection.collapseToEnd();
				}
			}
		}

		// the text cursor won't move to the next line without this
		oSelection.insertNode(this.oApp.getWYSIWYGDocument().createTextNode(""));
		oSelection.select();
	}
});

})(jQuery);
