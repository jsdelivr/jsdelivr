YUI.add('gallery-carousel-circular', function(Y) {

	var getClassName = Y.ClassNameManager.getClassName,
	    CHILDREN = 'children',
	    CIRCULAR_CAROUSEL = 'circular-carousel',
	    FIRST_CHILD = 'first-child',
	    LAST_CHILD = 'last-child',
	    MIN_SWIPE = 10,
	    _classNames = {
		circularCarousel: getClassName(CIRCULAR_CAROUSEL),
		circularCarouselItem : getClassName(CIRCULAR_CAROUSEL, 'item'),
		end: getClassName(CIRCULAR_CAROUSEL, 'end'),
		left: getClassName(CIRCULAR_CAROUSEL, 'left'),
		right: getClassName(CIRCULAR_CAROUSEL, 'right'),
		selectedCarouselItem: getClassName(CIRCULAR_CAROUSEL, 'selected'),
		start: getClassName(CIRCULAR_CAROUSEL, 'start')
	    };
	
	Y.CircularCarousel = Y.Base.create("circularcarousel", Y.Widget, [Y.WidgetParent], {
 
		initializer : function(){
		    this.list = this.get('srcNode');
		    this.listNodes = this.list.all('li');
		    this.totalNodes = this.get('totalNodes');
		    this.numNodesToDisplay = this.get('numNodesToDisplay');
		    this.publish("goPrev", {defaultFn: this._goPrev}, this);
		    this.publish("goNext", {defaultFn: this._goNext}, this);
		},

		_initScroll : function(){
		    var currentNode,list, i, arr=[];

		    list = this.list;
		    this.currentNode = list.one('.' + _classNames.selectedCarouselItem);
		    this.firstNode = list.one('.' + _classNames.start);
		    this.lastNode = list.one('.' + _classNames.end);

		    i=0;
		    if(typeof this.prevCount === 'undefined'){
			this.prevCount = this.totalNodes - this.numNodesToDisplay + 1;
                    }

		    if(!this.nextCount){
			this.nextCount = this.numNodesToDisplay - 1;
		    }
		    currentNode = this.currentNode;
		    this.rightNode = currentNode.next();
		    this.leftNode = currentNode.previous();
		    if(!this.rightNode){
			this.rightNode = this.firstNode;
		    }

		    if(!this.leftNode){
			this.leftNode = this.lastNode;
		    }

		    this.rightNode.addClass(_classNames.right);
		    this.leftNode.addClass(_classNames.left);

		    Y.each(this.listNodes, function(node){
			    arr[i] = node;
			    if(!node.hasClass('yui3-circular-carousel-selected') && 
			       !node.hasClass('yui3-circular-carousel-right') &&
			       !node.hasClass('yui3-circular-carousel-left') &&
			       !node.hasClass('yui3-circular-carousel-start') &&
			       !node.hasClass('yui3-circular-carousel-end')
			       ){
				node.remove();
			    }
			    i++;
			});
		    this.arr = arr;
		},

		renderUI: function () {
		    var srcNode = this.list;
                    srcNode.addClass( _classNames.circularCarousel);
                    srcNode.one(':'+ FIRST_CHILD).addClass(_classNames.start);
                    srcNode.one(':'+ FIRST_CHILD).addClass(_classNames.selectedCarouselItem);
                    srcNode.one(':'+ LAST_CHILD).addClass(_classNames.end);
                    srcNode.get(CHILDREN).addClass(_classNames.circularCarouselItem);
		    if(srcNode){
		    this._initScroll();
		    }
		},

		bindUI : function(){
		    //		    Y.on('carousel:goPrev', this._goPrev, this);
		    //		    Y.on('carousel:goNext', this._goNext, this);

		    

		    this.list.on('gesturemovestart', Y.bind(this._detectSwipe, this));
		    Y.on('swipedLeft', this._goPrev, this);
		    Y.on('swipedRight', this._goNext, this);
		},
		
		syncUI : function(){

		},
		
		_detectSwipe : function(e){
		    Y.log('detectSwipe');
		    var item = e.currentTarget,
		    swipeStart,
		    swipeEnd,
		    isSwipeLeft, 
		    isSwipeRight;

		    item.setData("swipeStart", e.pageX);
		    item.once("gesturemoveend", function(e) {
			    swipeStart = item.getData("swipeStart");
			    swipeEnd = e.pageX;
			    isSwipeLeft = (swipeStart - swipeEnd) > MIN_SWIPE;
			    isSwipeRight = (swipeEnd - swipeStart) > MIN_SWIPE;

			    if (isSwipeLeft) {
				Y.log('swiped Right');
				Y.fire('swipedRight');
			    }else if(isSwipeRight){
				Y.log('swiped left');
				Y.fire('swipedLeft');
			    }

			});
		},
		_goPrev: function(){
		    Y.log('calling goPrev');
		    var leftNode, futureLeft;
		    if (this.prevCount < 0){
			this.prevCount = this.totalNodes - 1;
		    }else if(this.prevCount > (this.totalNodes-1)){
		        this.prevCount = 0;
		    }
		    Y.log('this.prevCount:'+this.prevCount);
		    Y.log('this.nextCount:'+this.nextCount);
		    leftNode = this.leftNode;

		    futureLeft = this.arr[this.prevCount];

		    this.list.prepend(futureLeft);
		    
		    this.currentNode.replaceClass(_classNames.selectedCarouselItem,_classNames.right);
		    this.rightNode.removeClass(_classNames.right);

		    this.prevCount--;
		    this.nextCount--;
		    if(this.nextCount < 0){
			this.nextCount = this.totalNodes - 1;
		    }
		    
		    this.rightNode.remove();

		    this.rightNode = this.currentNode;
		    leftNode.replaceClass(_classNames.left, _classNames.selectedCarouselItem);
		    this.currentNode = leftNode;
		    if(!futureLeft){
			futureLeft = this.lastNode;
		    }

		    futureLeft.addClass(_classNames.left);
		    this.leftNode = futureLeft;
		},

		_goNext : function(){
		    Y.log('calling goNext');
		    var rightNode, futureRight;
		    Y.log('this.prevCount:'+this.prevCount);
		    Y.log('this.nextCount:'+this.nextCount);
		    if(this.nextCount == this.totalNodes){
			this.nextCount = 0;
		    }else if( this.nextCount < 0){
			this.nextCount = this.totalNodes - 1;
		    }
		    rightNode = this.rightNode;
		    futureRight = this.arr[this.nextCount];
		    this.list.append(futureRight);

		    this.currentNode.replaceClass(_classNames.selectedCarouselItem,_classNames.left);
		    this.leftNode.removeClass(_classNames.left);
		    
		    this.nextCount++;
		    this.prevCount++;
		    if(this.prevCount > this.totalNodes - 1){
			this.prevCount = 0;
		    }
		    this.leftNode.remove(); //added
		    this.leftNode = this.currentNode;
		    rightNode.replaceClass(_classNames.right,_classNames.selectedCarouselItem);
		    this.currentNode = rightNode;

		    if(!futureRight){
			futureRight = this.firstNode;
		    }

		    futureRight.addClass(_classNames.right);
		    this.rightNode = futureRight;


		}
 
	    }, {
		NAME: "circularcarousel",
		ATTRS : {
		    label : {
			validator: Y.Lang.isString
		    },
		    tabIndex: {
			value: -1
		    },
		    totalNodes : {
			value: 20
		    },
		    numNodesToDisplay : {
			value : 13
		    }
		}
 
	    });

 


}, 'gallery-2012.03.23-18-00' ,{requires:['node', 'event']});
