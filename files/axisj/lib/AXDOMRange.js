/* AXISJ Javascript UI Framework */
/* http://www.axisj.com, license : http://www.axisj.com/license */
 
 /*
 아래 코드는 husky_framework 의 HuskyRange.js 코드를 참조하여 개발 되었습니다.
 */
 
var DOMfix = {
	DF_parentNode: function(node){
		if(AXUtil.browser.name == "ie" || AXUtil.browser.name == "op"){
			if(!node) return node;
			while(node.previousSibling){node = node.previousSibling;}
			return node.parentNode;			
		}else{
			return node.parentNode;
		}
	},
	DF_childNode: function(node){
		if(AXUtil.browser.name == "ie" || AXUtil.browser.name == "op"){
			var result = null;
			var ni = 0;	
			if(node){
				var result = [];
				node = node.firstChild;
				while(node){
					result[ni++] = node;
					node = node.nextSibling;
				}
			}			
			return result;		
		}else{
			return node.childNodes;
		}
	}
}

var AXDOMRange = Class.create({
	START_TO_START	:0,
	START_TO_END	:1,
	END_TO_END		:2,
	END_TO_START	:3,	
	initialize		: function(_document){
		this._doc = _document || document;
		this.collapsed = true;
		this.commonAncestorContainer = this._doc.body;
		this.endContainer = this._doc.body;
		this.endOffset = 0;
		this.startContainer = this._doc.body;
		this.startOffset = 0;
	},
	cloneContents : function(){
		var oClonedContents = this._doc.createDocumentFragment();
		var oTmpContainer 	= this._doc.createDocumentFragment();
		var aNodes 			= this._getNodesInRange();
		if(aNodes.length < 1) return oClonedContents;
		var oClonedContainers = this.DF_constructClonedTree(aNodes, oTmpContainer);
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
			DOMfix.DF_parentNode(oClonedContainers.oStartContainer).removeChild(oClonedContainers.oStartContainer.previousSibling);

		if(oClonedContainers.oEndContainer && oClonedContainers.oEndContainer.nextSibling)
			DOMfix.DF_parentNode(oClonedContainers.oEndContainer).removeChild(oClonedContainers.oEndContainer.nextSibling);

		return oClonedContents;
	},
	DF_constructClonedTree : function(aNodes, oClonedParentNode){
		var oClonedStartContainer = null;
		var oClonedEndContainer = null;

		var oStartContainer = this.startContainer;
		var oEndContainer = this.endContainer;

		recurConstructClonedTree = function(aAllNodes, iCurIdx, oParentNode, oClonedParentNode){
			if(iCurIdx < 0) return iCurIdx;
			var iChildIdx = iCurIdx-1;
			var oCurNodeCloneWithChildren = aAllNodes[iCurIdx].cloneNode(false);
			if(aAllNodes[iCurIdx] == oStartContainer) oClonedStartContainer = oCurNodeCloneWithChildren;
			if(aAllNodes[iCurIdx] == oEndContainer) oClonedEndContainer = oCurNodeCloneWithChildren;
			while(iChildIdx >= 0 && DOMfix.DF_parentNode(aAllNodes[iChildIdx]) == aAllNodes[iCurIdx]){
				iChildIdx = this.recurConstructClonedTree(aAllNodes, iChildIdx, aAllNodes[iCurIdx], oCurNodeCloneWithChildren, oClonedStartContainer, oClonedEndContainer);
			}
			oClonedParentNode.insertBefore(oCurNodeCloneWithChildren, oClonedParentNode.firstChild);
			return iChildIdx;
		};

		aNodes[aNodes.length] = DOMfix.DF_parentNode(aNodes[aNodes.length-1]);
		recurConstructClonedTree(aNodes, aNodes.length-1, aNodes[aNodes.length-1], oClonedParentNode);

		return {oStartContainer: oClonedStartContainer, oEndContainer: oClonedEndContainer};
	},
	cloneRange : function(){
		return this.DF_copyRange(new AXDOMRange(this._doc));
	},
	DF_copyRange : function(oClonedRange){
		oClonedRange.collapsed = this.collapsed;
		oClonedRange.commonAncestorContainer = this.commonAncestorContainer;
		oClonedRange.endContainer = this.endContainer;
		oClonedRange.endOffset = this.endOffset;
		oClonedRange.startContainer = this.startContainer;
		oClonedRange.startOffset = this.startOffset;
		oClonedRange._document = this._doc;
		
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
			case this.START_TO_START:
				return this._compareEndPoint(this.startContainer, this.startOffset, sourceRange.startContainer, sourceRange.startOffset);
			case this.START_TO_END:
				return this._compareEndPoint(this.endContainer, this.endOffset, sourceRange.startContainer, sourceRange.startOffset);
			case this.END_TO_END:
				return this._compareEndPoint(this.endContainer, this.endOffset, sourceRange.endContainer, sourceRange.endOffset);
			case this.END_TO_START:
				return this._compareEndPoint(this.startContainer, this.startOffset, sourceRange.endContainer, sourceRange.endOffset);
		}
	},
	DF_getBody : function(node){
		if(!node) return null;
		while(node){
			if(node.tagName == "BODY") return node;
			node = DOMfix.DF_parentNode(node);
		}
		return null;
	},
	_compareEndPoint : function(oContainerA, iOffsetA, oContainerB, iOffsetB){
		var iIdxA, iIdxB;

		if(!oContainerA || this.DF_getBody(oContainerA) != this._doc.body){
			oContainerA = this._doc.body;
			iOffsetA = 0;
		}

		if(!oContainerB || this.DF_getBody(oContainerB) != this._doc.body){
			oContainerB = this._doc.body;
			iOffsetB = 0;
		}

		var compareIdx = function(iIdxA, iIdxB){
			if(iIdxB == -1) iIdxB = iIdxA+1;
			if(iIdxA < iIdxB) return -1;
			if(iIdxA == iIdxB) return 0;
			return 1;
		};

		var oCommonAncestor = this._getCommonAncestorContainer(oContainerA, oContainerB);

		var nodeA = oContainerA;
		if(nodeA != oCommonAncestor){
			while((oTmpNode = DOMfix.DF_parentNode(nodeA)) != oCommonAncestor){nodeA = oTmpNode;}
			iIdxA = this._getPosIdx(nodeA)+0.5;
		}else iIdxA = iOffsetA;
		
		var nodeB = oContainerB;
		if(nodeB != oCommonAncestor){
			while((oTmpNode = DOMfix.DF_parentNode(nodeB)) != oCommonAncestor){nodeB = oTmpNode;}
			iIdxB = this._getPosIdx(nodeB)+0.5;
		}else iIdxB = iOffsetB;

		return compareIdx(iIdxA, iIdxB);
	},
	_getCommonAncestorContainer : function(node1, node2){
		var oComparingNode = node2;

		while(node1){
			while(oComparingNode){
				if(node1 == oComparingNode) return node1;
				oComparingNode = DOMfix.DF_parentNode(oComparingNode);
			}
			oComparingNode = node2;
			node1 = DOMfix.DF_parentNode(node1);
		}

		return this._doc.body;
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
			oNewStartContainer = DOMfix.DF_parentNode(aNodes[0]);
			iNewOffset = 0;
		}

		for(var i=0; i<aNodes.length; i++){
			var node = aNodes[i];
			if(!node.firstChild){
				if(oNewStartContainer == node){
					iNewOffset = this._getPosIdx(oNewStartContainer);
					oNewStartContainer = DOMfix.DF_parentNode(node);
				}
				DOMfix.DF_parentNode(node).removeChild(node);
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
			oParentContainer = DOMfix.DF_parentNode(this.startContainer);
			if(this.startContainer.nodeValue.length <= this.startOffset)
				oFirstNode = this.startContainer.nextSibling;
			else
				oFirstNode = this.startContainer.splitText(this.startOffset);
		}else{
			oParentContainer = this.startContainer;
			oFirstNode = DOMfix.DF_childNode(this.startContainer)[this.startOffset];
		}
		if(!oFirstNode || !DOMfix.DF_parentNode(oFirstNode)) oFirstNode = null;
		oParentContainer.insertBefore(newNode, oFirstNode);
		this.setStartBefore(newNode);
	},
	selectNode : function(refNode){
		this.setStartBefore(refNode);
		this.setEndAfter(refNode);
	},
	selectNodeContents : function(refNode){
		this.setStart(refNode, 0);
		this.setEnd(refNode, DOMfix.DF_childNode(refNode).length);
	},
	_endsNodeValidation : function(node, iOffset){
		if(!node || this.DF_getBody(node) != this._doc.body) throw new Error("node error");
		if(node.nodeType == 3){
			if(iOffset > node.nodeValue.length) iOffset = node.nodeValue.length;
		}else{
			if(iOffset > DOMfix.DF_childNode(node).length) iOffset = DOMfix.DF_childNode(node).length;
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
		if(!refNode) throw new Error("setEndAfter");
		if(refNode.tagName == "BODY"){
			this.setEnd(refNode, DOMfix.DF_childNode(refNode).length);
			return;
		}
		this.setEnd(DOMfix.DF_parentNode(refNode), this._getPosIdx(refNode)+1);
	},
	setEndBefore : function(refNode){
		if(!refNode) throw new Error("setEndBefore");
		if(refNode.tagName == "BODY"){
			this.setEnd(refNode, 0);
			return;
		}
		this.setEnd(DOMfix.DF_parentNode(refNode), this._getPosIdx(refNode));
	},
	setStart : function(refNode, offset){
		offset = this._endsNodeValidation(refNode, offset);
		this.startContainer = refNode;
		this.startOffset = offset;
		if(!this.endContainer || this._compareEndPoint(this.startContainer, this.startOffset, this.endContainer, this.endOffset) != -1) this.collapse(true);
		this._updateRangeInfo();
	},
	setStartAfter : function(refNode){
		if(!refNode) throw new Error("setStartAfter");
		if(refNode.tagName == "BODY"){
			this.setStart(refNode, DOMfix.DF_childNode(refNode).length);
			return;
		}
		this.setStart(DOMfix.DF_parentNode(refNode), this._getPosIdx(refNode)+1);
	},

	setStartBefore : function(refNode){
		if(!refNode) throw new Error("setStartBefore");
		if(refNode.tagName == "BODY"){
			this.setStart(refNode, 0);
			return;
		}
		this.setStart(DOMfix.DF_parentNode(refNode), this._getPosIdx(refNode));
	},
	surroundContents : function(newParent){
		newParent.appendChild(this.extractContents());
		this.insertNode(newParent);
		this.selectNode(newParent);
	},
	toString : function(){
		var oTmpContainer = this._doc.createElement("DIV");
		oTmpContainer.appendChild(this.cloneContents());
		return oTmpContainer.textContent || oTmpContainer.innerText || "";
	},
	_isBlankTextNode : function(node){
		if(node.nodeType == 3 && node.nodeValue == "") return true;
		return false;
	},
	_getPosIdx : function(refNode){
		var idx = 0;
		for(var node = refNode.previousSibling; node; node = node.previousSibling) idx++;

		return idx;
	},
	_updateRangeInfo : function(){
		if(!this.startContainer){
			this.init(this._doc);
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
			if(iStartOffset < DOMfix.DF_childNode(oStartContainer).length){
				oStartNode = DOMfix.DF_childNode(oStartContainer)[iStartOffset];
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
			oEndNode = DOMfix.DF_childNode(oEndContainer)[iEndOffset-1];
		}

		return oEndNode;
	},

	_getNextNode : function(node){
		if(!node || node.tagName == "BODY") return this._doc.body;

		if(node.nextSibling) return node.nextSibling;
		
		return this._getNextNode(DOMfix.DF_parentNode(node));
	},

	_getPrevNode : function(node){
		if(!node || node.tagName == "BODY") return this._doc.body;

		if(node.previousSibling) return node.previousSibling;
		
		return this._getPrevNode(DOMfix.DF_parentNode(node));
	},

	// includes partially selected
	// for <div id="a"><div id="b"></div></div><div id="c"></div>, _getNodesBetween(b, c) will yield to b, "a" and c
	_getNodesBetween : function(oStartNode, oEndNode){
		var aNodesBetween = [];

		if(!oStartNode || !oEndNode) return aNodesBetween;

		this._recurGetNextNodesUntil(oStartNode, oEndNode, aNodesBetween);
		return aNodesBetween;
	},

	_recurGetNextNodesUntil : function(node, oEndNode, aNodesBetween){
		if(!node) return false;

		if(!this._recurGetChildNodesUntil(node, oEndNode, aNodesBetween)) return false;

		var oNextToChk = node.nextSibling;
		
		while(!oNextToChk){
			if(!DOMfix.DF_parentNode(node)) return false;
			node = DOMfix.DF_parentNode(node);

			aNodesBetween[aNodesBetween.length] = node;

			if(node == oEndNode) return false;

			oNextToChk = node.nextSibling;
		}

		return this._recurGetNextNodesUntil(oNextToChk, oEndNode, aNodesBetween);
	},

	_recurGetChildNodesUntil : function(node, oEndNode, aNodesBetween){
		if(!node) return false;

		var bEndFound = false;
		var oCurNode = node;
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

		aNodesBetween[aNodesBetween.length] = node;

		if(bEndFound) return false;
		if(node == oEndNode) return false;

		return true;
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
		var oNewParent = this._doc.createElement(sTagName);
		this.surroundContents(oNewParent);
		return oNewParent;
	},
	pasteHTML : function(sHTML){
		var oTmpDiv = this._doc.createElement("DIV");
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
	}
});

SSelection = function(win){
	this.init = function(win){
		this._window = win || window;
		this._document = this._window.document;
	};
	this.init(win);
	
	if(AXUtil.browser.name == "ie")
		SSelectionImpl_IE.apply(this);
	else
		SSelectionImpl_FF.apply(this);

	this.selectRange = function(oRng){
		this.selectNone();
		this.addRange(oRng);
	};

	this.selectionLoaded = true;
	if(!this._oSelection) this.selectionLoaded = false;
};

SSelectionImpl_FF = function(){
	this._oSelection = this._window.getSelection();

	this.getRangeAt = function(iNum){
		iNum = iNum || 0;

		try{
			var oFFRange = this._oSelection.getRangeAt(iNum);
		}catch(e){return new AXDOMRange(this._document);}
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
		var oW3CRange = new AXDOMRange(this._document);
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

SSelectionImpl_IE = function(){
	this._oSelection = this._document.selection;

	this.getRangeAt = function(iNum){
		iNum = iNum || 0;

		if(this._oSelection.type == "Control"){
			var oW3CRange = new AXDOMRange(this._document);

			var oSelectedNode = this._oSelection.createRange().item(iNum);

			// if the selction occurs in a different document, ignore
			if(!oSelectedNode || oSelectedNode.ownerDocument != this._document) return oW3CRange;

			oW3CRange.selectNode(oSelectedNode);

			return oW3CRange;
		}else{
			this._document.body.focus();

			var oSelectedNode = this._oSelection.createRangeCollection().item(iNum).parentElement();

			// if the selction occurs in a different document, ignore
			if(!oSelectedNode || oSelectedNode.ownerDocument != this._document){
				var oW3CRange = new AXDOMRange(this._document);
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
			oNonTextNode = DOMfix.DF_parentNode(oW3CContainer);
			aChildNodes = DOMfix.DF_childNode(oNonTextNode);
			iNumOfLeftNodesToCount = aChildNodes.length;
		}else{
			oNonTextNode = oW3CContainer;
			aChildNodes = DOMfix.DF_childNode(oNonTextNode);
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
		var oW3CRange = new AXDOMRange(this._document);

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
		var aChildNodes = DOMfix.DF_childNode(oContainer);
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