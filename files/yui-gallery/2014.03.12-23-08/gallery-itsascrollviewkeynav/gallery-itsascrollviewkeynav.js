YUI.add('gallery-itsascrollviewkeynav', function (Y, NAME) {

'use strict';

/**
 * ITSAScrollViewKeyNav Plugin
 *
 *
 * Plugin that enables scrollview-navigation with keys.
 *
 * In order to response to key-events, the scrollview-instance needs to have focus. This can be set either by myScrollView.focus() -or blur()-
 * or by setting the attribute 'initialFocus' to true. The plugin also works when Plugin.ScrollViewPaginator is plugged-in. The behaviour will be
 * different, because the scrolling is paginated in that case.
 *
 *
 * If this plugin is plugged into a Y.ITSAScrollViewModellist-instance, then the keynavigation will scroll through the items in case
 * the attribute 'modelsSelectable' is set to true.
 *
 *
 * @module gallery-itsascrollviewkeynav
 * @class ITSAScrollViewKeyNav
 * @extends Plugin.Base
 * @constructor
 * @since 0.1
 *
 * <i>Copyright (c) 2013 Marco Asbreuk - http://itsasbreuk.nl</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/

// -- Public Static Properties -------------------------------------------------

/**
 * Internal list that holds event-references
 * @property _eventhandlers
 * @private
 * @type Array
 */

/**
 * The plugin's host, which should be a ScrollView-instance
 * @property host
 * @type ScrollView-instance
 */


var Lang = Y.Lang,
    YArray = Y.Array,
    MODEL_CLASS = 'itsa-model',
    FOCUS_CLASS = MODEL_CLASS + '-focus',
    GETSTYLE = function(node, style) {
        return parseInt(node.getStyle(style), 10);
    };


Y.namespace('Plugin').ITSAScrollViewKeyNav = Y.Base.create('itsascrollviewkeynav', Y.Plugin.Base, [], {

        _eventhandlers : [],
        host : null,

        /**
         * Sets up the toolbar during initialisation. Calls render() as soon as the hosts-editorframe is ready
         *
         * @method initializer
         * @protected
         * @since 0.1
         */
        initializer : function() {
            var instance = this,
                host;
            instance.host = host = instance.get('host');
            if (host instanceof Y.ScrollView) {
                instance._bindUI();
            }
            else {
            }
        },

        /**
         * Cleans up bindings and removes plugin
         * @method destructor
         * @protected
         * @since 0.1
        */
        destructor : function() {
            this._clearEventhandlers();
        },

        //===============================================================================================
        // private methods
        //===============================================================================================

        /**
         * Binding events
         *
         * @method _bindUI
         * @private
         * @since 0.1
        */
        _bindUI : function() {
            var instance = this;

            instance._eventhandlers.push(
                Y.on(
                    'keydown',
                    Y.rbind(instance._handleKeyDown, instance)
                )
            );
        },

        /**
         * Handles the keydown-events. Can perform several things: scolling and (multi)-selecting.
         *
         * @method _handleKeyDown
         * @param {EventTarget} e
         * @private
         * @since 0.1
         *
        */
        _handleKeyDown : function(e) {
            var instance = this,
                host = instance.host,
                keyCode = e.keyCode,
                infiniteScroll = host.itsainfiniteview,
                scrollTo = Y.rbind(host.scrollTo, host),
                boundingBox = host.get('boundingBox'),
                boundingBoxX = boundingBox.getX(),
                boundingBoxY = boundingBox.getY(),
                boundingBoxHeight = boundingBox.get('offsetHeight') + GETSTYLE(boundingBox, 'borderTopWidth')
                        + GETSTYLE(boundingBox, 'borderBottomWidth') + GETSTYLE(boundingBox, 'paddingTop') + GETSTYLE(boundingBox,'paddingBottom'),
                boundingBoxWidth = boundingBox.get('offsetWidth')+GETSTYLE(boundingBox,'borderLeftWidth')+GETSTYLE(boundingBox,'borderRightWidth')
                        + GETSTYLE(boundingBox, 'paddingLeft') + GETSTYLE(boundingBox, 'paddingRight'),
                rightborder = parseInt(boundingBox.getStyle('borderRightWidth'), 10),
                bottomborder = parseInt(boundingBox.getStyle('borderBottomWidth'), 10),
                axis, xAxis, yAxis, itemLeft, itemRight, itemUp, itemDown, currentVisible, i, viewNode, inRegion,
                pageLeft, pageRight, pageUp, pageDown, selectKey, modelsSelectable, pagination, currentIndex, totalCount, modelNode, liElements,
                itemHome, itemEnd, lastListItemIsInView, paginatorScrollToIndex, currentScroll, remaining,
                step, scrollToSave, down, lastFocusedModelNode, modelList, scrollHome, scrollEnd, nextModelNodeIsFullVisible,
                prevModelNodeIsFullVisible, itemFullVisible, getFirstFullVisibleModelNode, getLastFullVisibleModelNode, nextModelNode,
                scrollToModelNode, getDistanceToLowerEdge, getDistanceToUpperEdge, nextModelNodeVisible, newIndex, clientId, model;

            // tells if node1 is in region of node2
            // for some reason Y.DOM.inRegion() did not work ???
            inRegion = function(node1, node2, shiftLeftnode2, shiftTopnode2, shiftRight2node2, shiftBottom2node2) {
                var node1XY = node1.getXY(),
                    node2XY = node2.getXY(),
                    left1 = node1XY[0],
                    top1 = node1XY[1],
                    right1 = left1 + node1.get('offsetWidth'),
                    bottom1 = top1 + node1.get('offsetHeight'),
                    left2 = node2XY[0] + (shiftLeftnode2 || 0),
                    top2 = node2XY[1] + (shiftTopnode2 || 0),
                    right2 = node2XY[0] + (shiftRight2node2 || 0) + node2.get('offsetWidth'),
                    bottom2 = node2XY[1] + (shiftBottom2node2 || 0) + node2.get('offsetHeight');
                return (
                    left1   >= left2   &&
                    right1  <= right2  &&
                    top1    >= top2    &&
                    bottom1 <= bottom2
                );
            };
            getDistanceToLowerEdge = function(modelNode, yAxis) {
                var nodeEdge, boundingSize;
                if (yAxis) {
                    nodeEdge = modelNode.getY() + modelNode.get('offsetHeight') + GETSTYLE(modelNode, 'marginBottom');
                    boundingSize = boundingBoxY + boundingBoxHeight;
                }
                else {
                    nodeEdge = modelNode.getX() + modelNode.get('offsetWidth') + GETSTYLE(modelNode, 'marginRight');
                    boundingSize = boundingBoxX + boundingBoxWidth;
                }
                return boundingSize - nodeEdge;
            };
            getDistanceToUpperEdge = function(modelNode, yAxis) {
                var nodeEdge;
                if (yAxis) {
                    nodeEdge = modelNode.getY() - GETSTYLE(modelNode, 'marginTop');
                }
                else {
                    nodeEdge = modelNode.getX() - GETSTYLE(modelNode, 'marginLeft');
                }
                return nodeEdge - (yAxis ? boundingBoxY : boundingBoxX);
            };
            itemFullVisible = function(modelNode) {
                return modelNode && inRegion(modelNode, boundingBox);
            };
            nextModelNodeIsFullVisible = function(modelNode) {
                var nextNode = modelNode.next('.'+MODEL_CLASS) || false;
                return nextNode && inRegion(nextNode, boundingBox);
            };
            prevModelNodeIsFullVisible = function(modelNode) {
                var nextNode = modelNode.previous('.'+MODEL_CLASS) || false;
                return nextNode && inRegion(nextNode, boundingBox);
            };
            lastListItemIsInView = function(liElem) {
                return !host._itmsAvail && inRegion(liElem.item(liElem.size()-1), boundingBox, 0, 0, rightborder, bottomborder);
            };
            getFirstFullVisibleModelNode = function(liElem) {
                var visibleNode;
                liElem.some(
                    function(node) {
                        visibleNode = itemFullVisible(node) && node.hasClass(MODEL_CLASS) && node;
                        return visibleNode;
                    }
                );
                return visibleNode;
            };
            getLastFullVisibleModelNode = function(liElem) {
                var visibleFound = false,
                    visibleNode;
                liElem.some(
                    function(node) {
                        var visible = itemFullVisible(node);
                        if (visible) {
                            visibleFound = true;
                            if (node.hasClass(MODEL_CLASS)) {
                                visibleNode = node;
                            }
                        }
                        return visibleFound && !visible;
                    }
                );
                return visibleNode;
            };
            scrollHome = function() {
                host.scrollIntoView(0);
                if (yAxis) {
                    scrollTo(null, 0);
                }
                else {
                    scrollTo(0, null);
                }
            };
            scrollEnd = function() {
                host.scrollIntoView(modelList.size()-1);
            };
            scrollToModelNode = function(modelNode) {
                var model = modelList && modelNode && modelList.getByClientId(modelNode.getData('modelClientId'));
                if (model) {
                    host.scrollIntoView(model);
                }
            };
            if (host.get('focused')) {
                modelsSelectable = host.get('modelsSelectable');
                viewNode = host._viewNode || host.get('srcNode').one('*');
                pagination = host.pages;
                if (pagination) {
                    paginatorScrollToIndex = Y.rbind(pagination.scrollToIndex, pagination);
                }
                axis = host.get('axis');
                xAxis = axis.x;
                yAxis = axis.y;
                itemHome = (keyCode===36);
                itemEnd = (keyCode===35);
                itemLeft = (keyCode===37) && xAxis;
                itemRight = (keyCode===39) && xAxis;
                itemUp = (keyCode===38) && yAxis;
                itemDown = (keyCode===40) && yAxis;
                pageLeft = (keyCode===33) && xAxis && !yAxis;
                pageRight = (keyCode===34) && xAxis && !yAxis;
                pageUp = (keyCode===33) && yAxis;
                pageDown = (keyCode===34) && yAxis;
                selectKey = ((keyCode===13) || (keyCode===32));
                if (selectKey || itemLeft || itemRight || itemUp || itemDown || pageLeft || pageRight || pageUp || pageDown || itemHome || itemEnd) {
                    e.preventDefault();
                }
                //===================================================================================================================================
                //
                // Elements might be selectable when ITSAScrollViewModellist is available
                // We need other behaviour in that case: scrolling through the items instead of scrolling through the scrollview
                //
                //===================================================================================================================================
                if (modelsSelectable) { // only when ITSAScrollViewModellist is active and host.get('modelsSelectable')===true
                    // models are selectable --> no scrolling but shifting through items
                    // UNLESS the selected items come out of view --> in that case we need to scroll again to get it into position.
                    modelList = host.getModelListInUse();
                    if (itemHome) {
                        scrollHome();
                    }
                    else if (itemEnd) {
                        scrollEnd();
                    }
                    else if (selectKey || itemLeft || itemRight || itemUp || itemDown || pageLeft || pageRight || pageUp || pageDown) {
                        lastFocusedModelNode = viewNode.one('.'+FOCUS_CLASS);
                        if (lastFocusedModelNode) {
                            if (itemLeft || itemRight || itemUp || itemDown) {
                                lastFocusedModelNode = (itemDown || itemRight) ? lastFocusedModelNode.next('.'+MODEL_CLASS)
                                                   : lastFocusedModelNode.previous('.'+MODEL_CLASS);
                                if (lastFocusedModelNode) {
                                    scrollToModelNode(lastFocusedModelNode);
                                }
                                if ((itemUp || itemLeft) && !lastFocusedModelNode) {
                                    scrollHome();
                                }
                            }
                            else if (pageRight || pageDown) {
                                nextModelNodeVisible = nextModelNodeIsFullVisible(lastFocusedModelNode);
                                if (!itemFullVisible(lastFocusedModelNode) && !nextModelNodeVisible) {
                                    nextModelNode = lastFocusedModelNode.next('.'+MODEL_CLASS);
                                    scrollToModelNode(nextModelNode || lastFocusedModelNode);
                                }
                                else {
                                    if (nextModelNodeVisible) {
                                        liElements = viewNode.get('children');
                                        scrollToModelNode(getLastFullVisibleModelNode(liElements));
                                    }
                                    else {
                                        // scroll to modelNode that is outside the area. Scroll 1 page.
                                        nextModelNode = lastFocusedModelNode.next('.'+MODEL_CLASS);
                                        remaining = getDistanceToLowerEdge(lastFocusedModelNode, pageDown);
                                        while (nextModelNode && inRegion(nextModelNode, boundingBox, 0,
                                                                        (pageDown ? boundingBoxHeight : boundingBoxWidth)-remaining, 0,
                                                                        (pageDown ? boundingBoxHeight : boundingBoxWidth)-remaining)) {
                                            lastFocusedModelNode = nextModelNode;
                                            nextModelNode = lastFocusedModelNode.next('.'+MODEL_CLASS);
                                        }
                                        scrollToModelNode(lastFocusedModelNode);
                                    }
                                }
                            }
                            else if (pageLeft || pageUp) {
                                nextModelNodeVisible = prevModelNodeIsFullVisible(lastFocusedModelNode);
                                if (!itemFullVisible(lastFocusedModelNode) && !nextModelNodeVisible) {
                                    nextModelNode = lastFocusedModelNode.previous('.'+MODEL_CLASS);
                                    scrollToModelNode(nextModelNode || lastFocusedModelNode);
                                }
                                else {
                                    if (nextModelNodeVisible) {
                                        liElements = viewNode.get('children');
                                        scrollToModelNode(getFirstFullVisibleModelNode(liElements));
                                    }
                                    else {
                                        // scroll to modelNode that is outside the area. Scroll 1 page.
                                        nextModelNode = lastFocusedModelNode.previous('.'+MODEL_CLASS);
                                        if (!nextModelNode) {
                                            scrollHome();
                                        }
                                        else {
                                            remaining = getDistanceToUpperEdge(lastFocusedModelNode, pageUp);
                                            while (nextModelNode && inRegion(nextModelNode, boundingBox, 0,
                                                                            -(pageUp ? boundingBoxHeight : boundingBoxWidth)+remaining, 0,
                                                                            -(pageUp ? boundingBoxHeight : boundingBoxWidth)+remaining)) {
                                                lastFocusedModelNode = nextModelNode;
                                                nextModelNode = lastFocusedModelNode.previous('.'+MODEL_CLASS);
                                            }
                                            scrollToModelNode(lastFocusedModelNode);
                                        }
                                    }
                                }
                            }
                            else if (selectKey) {
                                clientId = lastFocusedModelNode.getData('modelClientId');
                                model = modelList.getByClientId(clientId);
                                if (host.modelIsSelected(model)) {
                                    host.unselectModels(model);
                                }
                                else {
                                    host.selectModels(model);
                                }
                            }
                        }
                        else if (itemDown || itemRight || pageDown || pageRight) {
                            // no model has active focus yet, only take action if shiftdown
                            liElements = viewNode.get('children');
                            if (itemDown || itemRight) {
                                // select first visible element on page
                                scrollToModelNode(getFirstFullVisibleModelNode(liElements));
                            }
                            else {
                                // select last visible element on page
                                scrollToModelNode(getLastFullVisibleModelNode(liElements));
                            }
                        }
                    }
                }
                //===================================================================================================================================
                //
                // When elements are not selectable, do a 'normal' scrolling (dependent whether the Paginator is plugged in)
                //
                //===================================================================================================================================
                else {
                    // models are unselectable --> scroll the view
                    // How to scroll depends on whether Paginator is active. If active, than we can scroll a complete item at a time
                    // If not, then we scroll 1 pixel at a time
                    if (pagination) {
                        // no ModelsSelectable, with Pagination
                        // we need the currentindex to calculate how many items to shift.
                        currentIndex = pagination.get('index');
                        totalCount = pagination.get('total');
                        liElements = viewNode.get('children');
                        if (itemLeft || itemUp) {
                            pagination.prev();
                        }
                        if (pageUp && (currentIndex>0)) {
                            // now we need to find out what element is the last one that is full-visible in the area ABOVE the viewport.
                            // because we always need to shift 1 item, we can set currentVisible = true
                            currentVisible = true;
                            for (i=currentIndex-1; currentVisible && (i>=0); i--) {
                                modelNode = liElements.item(i);
                                currentVisible = ((i===currentIndex-1) ||
                                                  inRegion(modelNode, boundingBox, 0, -boundingBoxHeight));
                            }
                            newIndex = i + 2;
                            if (currentIndex === newIndex) {
                                paginatorScrollToIndex(0);
                            }
                            else {
                                paginatorScrollToIndex(newIndex);
                            }
                        }
                        if (pageLeft && (currentIndex>0)) {
                            // now we need to find out what element is the last one that is full-visible in the area ABOVE the viewport.
                            // because we always need to shift 1 item, we can set currentVisible = true
                            currentVisible = true;
                            for (i=currentIndex-1; currentVisible && (i>=0); i--) {
                                modelNode = liElements.item(i);
                                currentVisible = ((i===currentIndex-1) ||
                                                  inRegion(modelNode, boundingBox, -boundingBoxWidth, 0));
                            }
                            newIndex = i + 2;
                            if (currentIndex === newIndex) {
                                paginatorScrollToIndex(0);
                            }
                            else {
                                paginatorScrollToIndex(newIndex);
                            }
                        }
                        if (itemHome) {
                            paginatorScrollToIndex(0);
                        }
                        // next we handle shifting to the end
                        if ((itemRight || itemDown) && !lastListItemIsInView(liElements)) {
                            newIndex = currentIndex+1;
                            newIndex = Math.min(newIndex, instance._getMaxPaginatorGotoIndex(newIndex, 0));
                            paginatorScrollToIndex(newIndex);
                        }
                        if ((pageDown || pageRight) && !lastListItemIsInView(liElements)) {
                            // now we need to find out what element is the last one that is not full-visible in the viewport.
                            // because we always need to shift 1 item, we can set currentVisible = true
                            currentVisible = true;
                            for (i=currentIndex+1; currentVisible && (i<totalCount); i++) {
                                modelNode = liElements.item(i);
                                currentVisible = inRegion(modelNode, boundingBox);
                            }
                            newIndex = i-1;
                            newIndex = Math.min(newIndex, instance._getMaxPaginatorGotoIndex(newIndex, 0));
                            paginatorScrollToIndex(newIndex);
                        }
                        if (itemEnd && !lastListItemIsInView(liElements)) {
                            // Be aware that if ITSAInifiniteView is plugged in, we need to be sure the items are available.
                            if (infiniteScroll && host._itmsAvail) {
                                host.itsainfiniteview.loadAllItems();
                                totalCount = pagination.get('total');
                            }
                            newIndex = totalCount-1;
                            newIndex = Math.min(newIndex, instance._getMaxPaginatorGotoIndex(newIndex));
                            paginatorScrollToIndex(newIndex);
                        }
                    }
                    else {
                        // no ModelsSelectable, no Pagination
                        currentScroll = host.get(yAxis ? 'scrollY' : 'scrollX');
                        scrollToSave = Y.rbind(instance._saveScrollTo, instance);
                        if (itemLeft || itemUp || itemRight || itemDown || pageLeft || pageUp || pageRight || pageDown) {
                            if (itemLeft || itemUp || itemRight || itemDown) {
                                step = instance.get('step');
                            }
                            else {
                                step = yAxis ? boundingBoxHeight : boundingBoxWidth;
                            }
                            down = (pageRight || pageDown || itemRight || itemDown);
                            if (yAxis) {
                                scrollToSave(null, currentScroll + (down ? step : -step));
                            }
                            else {
                                scrollToSave(currentScroll + (down ? step : -step), null);
                            }
                            if (infiniteScroll && down) {
                                infiniteScroll.checkExpansion();
                            }
                        }
                        else if (itemHome) {
                            if (yAxis) {
                                scrollTo(null, 0);
                            }
                            else {
                                scrollTo(0, null);
                            }
                        }
                        else if (itemEnd) {
                            if (infiniteScroll) {
                                infiniteScroll.loadAllItems();
                            }
                            if (yAxis) {
                                scrollToSave(null, host._maxScrollY);
                            }
                            else {
                                scrollToSave(host._maxScrollX, null);
                            }
                        }
                    }
                }
                //===================================================================================================================================
                //
                // End of scrollnehaviour
                //
                //===================================================================================================================================
            }
            else {
            }
        },

        /**
         * Equals pages.scrollToIndex, but makes sure the maximum PaginatorIndex is used that can be called. This is <b>lower</b> than the list-size,
         * because it is the uppermost item on the last page. This is handy, because scrollview.pages.scrollToIndex(lastitem) bumbs too much.
         *
         * @method _paginatorScrollToIndex
         * @private
         * @since 0.1
         *
        */
        _paginatorScrollToIndex : function(index) {
//=============================================================================================================================
//
// NEED SOME WORK HERE: MIGHT BE ASYNCHROUS --> WE NEED TO RETURN A PROMISE
//
//=============================================================================================================================
            var host = this.host,
                pagination = host && host.pages,
                itsainfiniteview = host && host.itsainfiniteview;

            if (pagination) {
                if (itsainfiniteview) {
//=============================================================================================================================
//
// NEED SOME WORK HERE: MIGHT BE ASYNCHROUS --> WE NEED TO RETURN A PROMISE
//
//=============================================================================================================================
                    pagination.scrollToIndex(Math.min(index, host._getMaxPaginatorGotoIndex(0)));
                }
                else {
                    pagination.scrollToIndex(index);
                }
            }
        },

        /**
         * Equals scrollview.scrollTo, but makes sure we keep between the correct boundaries.
         *
         * @method _saveScrollTo
         * @param {Int} x The x-position to scroll to. (null for no movement)
         * @param {Int} y The y-position to scroll to. (null for no movement)
         * @private
         * @since 0.1
         *
        */
        _saveScrollTo : function(x, y) {
            var host = this.host;

            if (x) {
                x = Math.max(0, x);
                x = Math.min(x, host._maxScrollX);
            }
            if (y) {
                y = Math.max(0, y);
                y = Math.min(y,  host._maxScrollY);
            }
            host.scrollTo(x, y);
        },

        /**
         * Focuses the ScrollView-instance (host)
         *
         * @method _focusHost
         * @private
         * @since 0.1
         *
        */
        _focusHost : function() {
            var instance = this,
                host = this.host;

            if (host && host.get('rendered')) {
                instance._focusHostSave();
            }
            else {
                instance.afterHostEvent('render', instance._focusHostSave, instance);
            }
        },

        /**
         * Returns the maximum PaginatorIndex that should be called. This is <b>lower</b> than the list-size, because
         * it is the uppermost item on the last page. This is handy, because scrollview.pages.scrollToIndex(lastitem)
         * bumbs too much.
         * <u>Be careful if you use the plugin ITSAInifiniteView:</u> to get the last Node, there might be a lot of
         * list-expansions triggered. Be sure that expansions from external data does end, otherwise it will overload the browser.
         * That's why the param is needed.
         *
         * @method _getMaxPaginatorGotoIndex
         * @param {Int} searchedIndex index that needs to besearched for. This will prevent a complete rendering of all items when not needed.
         * This only applies when the ITSAInifiniteView is plugged in.
         * @param {Int} [maxExpansions] Only needed when you use the plugin <b>ITSAInifiniteView</b>. Use this value to limit
         * expansion data-calls. It will prevent you from falling into endless expansion when the list is infinite. If not set this method will expand
         * at the <b>max of ITSAInifiniteView.get('maxExpansions') times by default</b>. If you are responsible for the external data and
         * that data is limited, you might choose to set this value that high to make sure all data is rendered in the scrollview.
         * @return {Int} maximum PaginatorIndex that should be called.
         * @private
         * @since 0.1
         *
        */
        _getMaxPaginatorGotoIndex : function(searchedIndex, maxExpansions) {
//=============================================================================================================================
//
// NEED SOME WORK HERE: MIGHT BE ASYNCHROUS --> WE NEED TO RETURN A PROMISE
//
//=============================================================================================================================
            var host = this.host,
                paginator = host.hasPlugin('pages'),
                itsainfiniteview = host.hasPlugin('itsainfiniteview'),
                axis = host.get('axis'),
                yAxis = axis.y,
                boundingSize = host.get('boundingBox').get(yAxis ? 'offsetHeight' : 'offsetWidth'),
                i = 0,
                hostModelList = host.getModelListInUse(), // only when ITSAScrollViewModellist is active
                viewNode = host._viewNode || host.get('srcNode').one('*'),
                liElements = viewNode.get('children'),
                listSize = (hostModelList && hostModelList.size()) || liElements.size(),
                lastNode, size;

            if (paginator && (listSize>0)) {
                lastNode = hostModelList ? host.getNodeFromIndex(Math.min(searchedIndex,listSize-1),maxExpansions) : liElements.item(listSize-1);
                if (yAxis) {
                    size = lastNode.get('offsetHeight') + GETSTYLE(lastNode, 'marginTop') + GETSTYLE(lastNode, 'marginBottom');
                }
                else {
                    size = lastNode.get('offsetWidth') + GETSTYLE(lastNode, 'marginLeft') + GETSTYLE(lastNode, 'marginRight');
                }
                if (hostModelList && itsainfiniteview) {
                    // list might have been expanded --> we need to recalculate liElements
                    liElements = viewNode.get('children');
                }
                i = liElements.size();
                while (lastNode && (--i>=0) && (size<boundingSize)) {
                    lastNode = liElements.item(i);
                    if (yAxis) {
                        size += lastNode.get('offsetHeight') + GETSTYLE(lastNode, 'marginTop') + GETSTYLE(lastNode, 'marginBottom');
                    }
                    else {
                        size += lastNode.get('offsetWidth') + GETSTYLE(lastNode, 'marginLeft') + GETSTYLE(lastNode, 'marginRight');
                    }
                }
                if (size>=boundingSize) {i++;}
            }
            return i;
        },

        /**
         * Focuses the ScrollView-instance (host), but is safe: the scrollview-instance is rendered here.
         *
         * @method _focusHostSave
         * @private
         * @since 0.1
         *
        */
        _focusHostSave : function() {
            var host = this.host;

            if (host && host.focus) {
                host.focus();
            }
            else {
            }
        },

        /**
         * Cleaning up all eventlisteners
         *
         * @method _clearEventhandlers
         * @private
         * @since 0.1
         *
        */
        _clearEventhandlers : function() {
            YArray.each(
                this._eventhandlers,
                function(item){
                    item.detach();
                }
            );
        }

    }, {
        NS : 'itsasvkeynav',
        ATTRS : {

            /**
             * @description Whether the ScrollView-instance has initial focus when plugged in.
             * Key-Navigation only works when the scrollview has focus. This attribute may focus, but only during pluging.
             * If you want to change the focus afterward, you must do this with <b>yourScrollView.focus()</b> or <b>yourScrollView.blur()</b>.
             *
             * @default true
             * @attribute initialFocus
             * @type Boolean
             * @since 0.1
            */
            initialFocus: {
                value: true,
                lazyAdd: false,
                validator:  function(v) {
                    return Lang.isBoolean(v);
                },
                setter: '_focusHost'
            },

            /**
             * @description The ammount of <b>pixels</b> that the scrollview should be scrolled when an arrow-key is pressed.
             * <i>Is only relevant when ScrollViewPaginator is not plugged in --> if it is plugged in, the scolling will be item-based)</i>
             *
             * @default 10
             * @attribute step
             * @type Int
             * @since 0.1
            */
            step: {
                value: 10,
                validator:  function(v) {
                    return Lang.isNumber(v);
                }
            }

        }
    }
);

}, 'gallery-2013.04.10-22-48', {"requires": ["base-build", "plugin", "pluginhost-base", "node", "scrollview", "dom-screen"]});
