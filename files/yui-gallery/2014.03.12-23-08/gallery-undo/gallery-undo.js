YUI.add('gallery-undo', function(Y) {

/**
 * Provides UndoManager class
 *
 * @module gallery-undo
 */

(function(){

    /**
     * Create a UndoManager to manage list of undoable actions.
     *
     * @class UndoManager
     * @extends Base
     * @param config {Object} Configuration object
     * @constructor
     */
    function UndoManager( config ){
        UndoManager.superclass.constructor.apply( this, arguments );
    }

    var Lang = Y.Lang,
    UMName = "UndoManager",
    ACTIONADDED = "actionAdded",
    ACTIONMERGED = "actionMerged",
    BEFORECANCELING = "beforeCanceling",
    ACTIONCANCELED = "actionCanceled",
    CANCELINGFINISHED = "cancelingFinished",
    BEFOREUNDO = "beforeUndo",
    ACTIONUNDONE = "actionUndone",
    UNDOFINISHED = "undoFinished",
    BEFOREPURGE = "beforePurge",
    PURGEFINISHED = "purgeFinished",
    BEFOREREDO = "beforeRedo",
    REDOFINISHED = "redoFinished",
    ACTIONREDONE = "actionRedone",
    ASYNCPROCESSING = "asyncProcessing",
    UNLIMITED = 0;

    Y.mix( UndoManager, {
        /**
         * The identity of UndoManager.
         *
         * @property UndoManager.NAME
         * @type String
         * @static
         */
        NAME : UMName,

        /**
         * Static property used to define the default attribute configuration of UndoManager.
         *
         * @property UndoManager.ATTRS
         * @type Object
         * @protected
         * @static
         */
        ATTRS : {

            /**
             * Holds the maximum number of actions in UndoManager. By default the number of actions is not limited.
             *
             * @attribute limit
             * @type Number
             * @default 0 (unlimited)
             */
            limit: {
                value: UNLIMITED,
                validator: function( value ){
                    return Lang.isNumber( value ) && value >= 0;
                }
            },

            /**
             * The index of command, that will be executed on the next call to redo().
             * If undo() has been not invoked, the value is the size of the current list of actions.
             * Otherwise, it is the index of the last action that was undone.
             *
             * @attribute undoIndex
             * @type Number
             * @readOnly
             */
            undoIndex : {
                readOnly: true,
                getter: function(){
                    return this._undoIndex;
                }
            }
        }
    });


    Y.extend( UndoManager, Y.Base, {

        /**
         * Collection of actions.
         * @property _actions
         * @protected
         * @type Array
         */
        _actions : [],

        /**
         * If undo() has been not invoked, _undoIndex is the size of the current list of actions.
         * Otherwise, it is the index of the last action that was undone.
         *
         * @property _undoIndex
         * @protected
         * @type Number
         */
        _undoIndex : 0,


        /**
         * The handle of the currently executed asynchronous action
         *
         * @property _actionHandle
         * @protected
         * @type Object
         */
        _actionHandle : null,

        /**
         * Boolean, indicates if UndoManager is currently processing an action
         *
         * @property _processing
         * @protected
         * @type Boolean
         */
        _processing : false,


        /**
         * Publishes events and subscribes to after event for limit.
         *
         * @method initializer
         * @protected
         */
        initializer : function( cfg ) {
            this._initEvents();
        
            this.after( "limitChange", Y.bind( this._afterLimit, this ) );
        },

        /**
         * Destructor lifecycle implementation for UndoManager class.
         * Removes and cancels the added actions.
         *
         * @method destructor
         * @protected
         */
        destructor : function() {
            this.purgeAll();
        },


        /**
         * Publishes UndoManager's events
         *
         * @method _initEvents
         * @protected
         */
        _initEvents : function(){
            /**
             * Signals an <code>Y.UndoableAction</code> has been added to list
             * 
             * @event actionAdded
             * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
             *  <dl>
             *      <dt>action</dt>
             *          <dd>An <code>Y.UndoableAction</code> added to the list</dd>
             *  </dl>
             */
            this.publish( ACTIONADDED );

            /**
             * Signals an <code>Y.UndoableAction</code> has been merged with another one
             *
             * @event actionMerged
             * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
             *  <dl>
             *      <dt><code>Y.UndoableAction</code> action</dt>
             *          <dd>The action, accepted merge</dd>
             *      <dt><code>Y.UndoableAction</code> mergedAction</dt>
             *          <dd>The merged action</dd>
             *  </dl>
             */
            this.publish( ACTIONMERGED );
            
            /**
             * Signals the beginning of a process in which one or more actions will be canceled.
             * 
             * @event beforeCanceling
             * @param event {Event.Facade} An Event Facade object
             */
             this.publish( BEFORECANCELING );
            
            /**
             * Signals an action has been canceled.
             * 
             * @event actionCanceled
             * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
             *  <dl>
             *      <dt>action</dt>
             *          <dd>An <code>Y.UndoableAction</code> canceled</dd>
             *      <dt>index</dt>
             *          <dd>The index of the action in the list</dd>
             *  </dl>
             */
            this.publish( ACTIONCANCELED );
            
            
            /**
             * Signals a canceling actions process has been finished.
             * 
             * @event cancelingFinished
             * @param event {Event.Facade} An Event Facade object
             */
            this.publish( CANCELINGFINISHED );
            
            /**
             * Signals the beginning of a process in which one or more actions will be purged from the list.
             *
             * @event beforePurge
             * @param event {Event.Facade} An Event Facade object
             */
            this.publish( BEFOREPURGE );


            /**
             * Signals the end of purge process. <code>UndoManager</code> cancels each action before its removing.
             *
             * @event purgeFinished
             * @param event {Event.Facade} An Event Facade object
             */
            this.publish( PURGEFINISHED );

            /**
             * Signals the beginning of a process in which one or more actions will be undone.
             * 
             * @event beforeUndo
             * @param event {Event.Facade} An Event Facade object
             */
            this.publish( BEFOREUNDO );
            
            
            /**
             * Signals an action has been undone.
             * 
             * @event actionUndone
             * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
             *  <dl>
             *      <dt>action</dt>
             *          <dd>An <code>Y.UndoableAction</code> undone</dd>
             *      <dt>index</dt>
             *          <dd>The index of the action in the list</dd>
             *  </dl>
             */
            this.publish( ACTIONUNDONE );
            

            /**
             * Signals the end of undo process.
             * 
             * @event undoFinished
             * @param event {Event.Facade} An Event Facade object
             */
            this.publish( UNDOFINISHED );

            
            /**
             * Signals the beginning of a process in which one or more actions will be redone.
             * 
             * @event beforeRedo
             * @param event {Event.Facade} An Event Facade object
             */
            this.publish( BEFOREREDO );
            
            
            /**
             * Signals an action has been redone.
             * 
             * @event actionRedone
             * @param event {Event.Facade} An Event Facade object with the following attribute specific properties added:
             *  <dl>
             *      <dt>action</dt>
             *          <dd>An <code>Y.UndoableAction</code> redone</dd>
             *      <dt>index</dt>
             *          <dd>The index of the action in the list</dd>
             *  </dl>
             */
            this.publish( ACTIONREDONE );
            
            
            /**
             * Signals the end of redo process.
             * 
             * @event redoFinished
             * @param event {Event.Facade} An Event Facade object
             */
            this.publish( REDOFINISHED );
        },
    

        /**
         * Adds an UndoableAction to UndoManager.<br>
         * Removes and cancels all actions from the current action index till the end of the list.
         * Tries to merge the current action with the <code>newAction</code>, passed as parameter. If <code>currentAction.merge(newAction)</code> returns false, UndoManager places the <code>newAction</code> at the end of the list.<br>
         * Fires <code>actionAdded</code> event if action has been added to the list, or <code>actionMerged</code> if <code>newAction</code> has been merged.
         * @method add
         * @param {Y.UndoableAction} newAction The action to be added
         * @return {Boolean} True if action was added to the list. The result might be False if UndoManager was processing another (asynchronous) action.
         */
        add : function( newAction ){
            var curAction = null, actions, undoIndex, tmp, merged  = false;
        
            if( this._processing ){
                return false;
            }

            actions = this._actions;
            undoIndex = this._undoIndex;

            if( undoIndex > 0 ){
                curAction = actions[ undoIndex - 1 ];
            }

            if( undoIndex < actions.length ){
                this.fire( BEFORECANCELING );

                while( undoIndex < actions.length ){
                    tmp = actions.splice( -1, 1 )[0];

                    tmp.cancel();
                    this.fire( ACTIONCANCELED, {
                        action: tmp,
                        index : actions.length
                    });
                }

                this.fire( CANCELINGFINISHED );
            }
        
            if( curAction ){
                merged = curAction.merge( newAction );

                if( !merged ){
                    actions.push( newAction );
                }
            } else {
                actions.push( newAction );
            }
        
            if( !merged ){
                this._undoIndex++;
                this._limitActions();
                this.fire( ACTIONADDED, {
                    action : newAction
                });
            } else {
                this.fire( ACTIONMERGED, {
                    'action' : curAction,
                    'mergedAction' : newAction
                });
            }
            
            return true;
        },
    

        /**
         * Removes actions from the list if their number exceedes the <code>limit</code>
         * 
         * @method _limitActions
         * @param {Number} limit The max number of actions in the list
         * @protected
         */
        _limitActions : function( limit ){
            var actions, action,
            halfLimit, actionsLeft, actionsRight, deleteLeft, deleteRight,
            index, i, j;

            if( !limit ){
                limit = this.get( "limit" );
            }

            if( limit === UNLIMITED ){
                return;
            }
        
            actions = this._actions;

            if( actions.length <= limit ){
                return;
            }
        
            index = this._undoIndex;

            halfLimit = parseInt( limit / 2, 10 );

            actionsLeft = limit - halfLimit;
            actionsRight = limit - actionsLeft;

            deleteLeft = index - actionsLeft;
            deleteRight = actions.length - index - actionsRight;

            if( deleteLeft < 0 ){
                deleteRight += deleteLeft;
            } else if( deleteRight < 0 ){
                deleteLeft += deleteRight;
            }

            if( deleteLeft > 0 || deleteRight > 0 ){
                this.fire( BEFORECANCELING );

                for( i = 0; i < deleteLeft; i++ ){
                    this._undoIndex--;

                    action = actions.splice( 0, 1 )[0];
                    action.cancel();
                    this.fire( ACTIONCANCELED, {
                        'action': action,
                        index : 0
                    });
                }

                for( i = actions.length - 1, j = 0; j < deleteRight; i--, j++ ){
                    action = actions.splice( i, 1 )[0];
                    action.cancel();
                    this.fire( ACTIONCANCELED, {
                        'action': action,
                        index : i
                    });
                }

                this.fire( CANCELINGFINISHED );
            }
        },
    
        /**
         * Invokes <code>_limitActions</code> in order to keep the number of actions in the list according to the <code>limit</code>.
         * 
         * @method _afterLimit
         * @param params {Event} limitChange custom event
         * @protected
         */
        _afterLimit : function( params ){
            this._limitActions( params.newVal );
        },
    
        
        /**
         * Undoes the action before current index by calling its <code>undo</code> method.
         * If <code>asyncProcessing</code> property of the action is true, UndoManager waits until action fires <code>undoFinished</code> event.
         * During this time undoing/redoing and adding new actions will be suspended.
         * 
         * @method undo
         */
        undo : function(){
            if( this.canUndo() ){
                this._undoTo( this._undoIndex - 1 );
            }
        },
    
        /**
         * Redoes the action at current index by calling its <code>redo</code> method.
         * If <code>asyncProcessing</code> property of the action is true, UndoManager waits until action fires <code>redoFinished</code> event.
         * During this time undoing/redoing and adding new actions will be suspended.
         * 
         * @method redo
         */
        redo : function(){
            if( this.canRedo() ){
                this._redoTo( this._undoIndex + 1 );
            }
        },
    
        
        /**
         * Checks if undo can be done. The function will return false if there are no actions in the list,
         * the current index is 0 or UndoManager is waiting for another asynchronous action to complete.
         * 
         * @method canUndo
         * @return {Boolean} true if undo is possible, false otherwise
         */
        canUndo : function(){
            return !this._processing && this._undoIndex > 0;
        },
    
        
        /**
         * Checks if redo can be done. The function will return false if there are no actions in the list,
         * current index is equal to the length of the list or UndoManager is waiting for another asynchronous action to complete.
         * 
         * @method canRedo
         * @return {Boolean} true if redo is possible, false otherwise
         */
        canRedo : function(){
            return !this._processing && this._undoIndex < this._actions.length;
        },
    
        
        /**
         * If undo is posible, returns the value of <code>label</code> property of the action to be undone.
         * 
         * @method getUndoLabel
         * @return {String} The value of label property
         */
        getUndoLabel : function(){
            var action;

            if( this.canUndo() ){
                action = this._actions[ this._undoIndex - 1 ];
                return action.get( "label" );
            }
        
            return null;
        },
    
        
        /**
         * If redo is posible, returns the value of <code>label</code> property of the action to be redone.
         * 
         * @method getRedoLabel
         * @return {String} The value of label property
         */
        getRedoLabel : function(){
            var action;

            if( this.canRedo() ){
                action = this._actions[ this._undoIndex ];
                return action.get( "label" );
            }
        
            return null;
        },
    
    
        /**
         * Cancels and removes all actions from the list
         * 
         * @method purgeAll
         */
        purgeAll : function(){
            this.purgeTo( 0 );
        },


        /**
         * Cancels and removes actions from the end of the list (the most recent actions) to the index, passed as parameter.
         * 
         * @method purgeTo
         * @param {Number} index The index in the list to which actions should be be removed
         */
        purgeTo : function( index ){
            var action, i = this._actions.length - 1;

            if( i >= index ){
                this.fire( BEFOREPURGE );

                for( ; i >= index; i-- ) {
                    action = this._actions.splice( i, 1 )[0];

                    action.cancel();
                    this.fire( ACTIONCANCELED, {
                        'action': action,
                        index : i
                    });
                }

                if( this._undoIndex > index ){
                    this._undoIndex = index;
                }

                this._processing = false;

                this.fire( PURGEFINISHED );
            }
        },

        
        /**
         * Calls undo or redo methods of the actions registered while current index is less or greater than the <code>newIndex</code> passed.
         * 
         * @method processTo
         * @param newIndex The new value of <code>undoIndex</code>
         */
        processTo : function( newIndex ){
            if( Lang.isNumber(newIndex) && !this._processing &&
                newIndex >= 0 && newIndex <= this._actions.length ){
                if( this._undoIndex < newIndex ){
                    this._redoTo( newIndex );
                } else if( this._undoIndex > newIndex ){
                    this._undoTo( newIndex );
                }
            }
        },
        
        
        /**
         * Redoes all actions from current index to <code>newIndex</code>. In case of asynchronous action, waits until action fires <code>redoFinished</code> event.
         *
         * @method _redoTo
         * @protected
         * @param newIndex The new value of <code>undoIndex</code>
         */
        _redoTo : function( newIndex ){
            var action = this._actions[ this._undoIndex++ ];

            if( !this._processing ){
                this.fire( BEFOREREDO );
                this._processing = true;
            }

            if( !action.get( ASYNCPROCESSING ) ){
                action.redo();
                this.fire( ACTIONREDONE, {
                    'action' : action,
                    index : this._undoIndex - 1
                } );

                if( this._undoIndex < newIndex ){
                    this._redoTo( newIndex );
                } else {
                    this._processing = false;
                    this.fire( REDOFINISHED );
                }
            } else {
                this._actionHandle = action.on( REDOFINISHED,
                      Y.bind( this._onAsyncRedoFinished, this, action, newIndex ) );

                action.redo();
            }
        },
        
        
        /**
         * Undoes all actions from current index to <code>newIndex</code>. In case of asynchronous action, waits until action fires <code>undoFinished</code> event.
         *
         * @method _undoTo
         * @protected
         * @param newIndex The new value of <code>undoIndex</code>
         */
        _undoTo : function( newIndex ){
            var action = this._actions[ --this._undoIndex ];

            if( !this._processing ){
                this.fire( BEFOREUNDO );
                this._processing = true;
            }

            if( !action.get( ASYNCPROCESSING ) ){
                action.undo();
                this.fire( ACTIONUNDONE, {
                    'action': action,
                    index : this._undoIndex
                });

                if( this._undoIndex > newIndex ){
                    this._undoTo( newIndex );
                } else {
                    this._processing = false;
                    this.fire( UNDOFINISHED );
                }
            } else {
                this._actionHandle = action.on( UNDOFINISHED,
                    Y.bind( this._onAsyncUndoFinished, this, action, newIndex ) );

                action.undo();
            }
        },
        
        
        /**
         * Handles the completion of undo method of asynchronous action.
         * Fires <code>actionUndone</code> event. Checks if <code>newIndex</code> is less than current index. If true, invokes _undoTo again, or fires <code>undoFinished</code> event otherwise.
         * 
         * @method _onAsyncUndoFinished
         * @protected
         * @param {Y.UndoableAction} action The asynchronous action which undo method has been completed.
         * @param {Number} newIndex The new value of <code>undoIndex</code>
         */
        _onAsyncUndoFinished : function( action, newIndex ){
            this._actionHandle.detach();
            this._actionHandle = null;

            this.fire( ACTIONUNDONE, {
                'action': action,
                index : this._undoIndex
            });
            
            if( this._undoIndex > newIndex ){
                this._undoTo( newIndex );
            } else {
                this._processing = false;
                this.fire( UNDOFINISHED, {
                    'action': action
                });
            }
        },


        /**
         * Handles the completion of redo method of asynchronous action. 
         * Fires <code>actionRedone</code> event. Checks if <code>newIndex</code> is bigger than current index. If true, invokes _redoTo again, or fires <code>redoFinished</code> event otherwise.
         * 
         * @method _onAsyncRedoFinished
         * @protected
         * @param {Y.UndoableAction} action The asynchronous action which redo method has been completed.
         * @param {Number} newIndex The new value of <code>undoIndex</code>
         */
        _onAsyncRedoFinished : function( action, newIndex ){
            this._actionHandle.detach();
            this._actionHandle = null;
            
            this.fire( ACTIONREDONE, {
                'action': action,
                index : this._undoIndex - 1
            });

            if( this._undoIndex < newIndex ){
                this._redoTo( newIndex );
            } else {
                this._processing = false;
                this.fire( REDOFINISHED, {
                    'action': action
                });
            }
        }
    });

    Y.UndoManager = UndoManager;

}());
/**
 * Provides UndoableAction class
 *
 * @module gallery-undo
 */

(function(){


/**
 * Create a UndoableAction
 *
 * @class UndoableAction
 * @extends Base
 * @param config {Object} Configuration object
 * @constructor
 */
function UndoableAction( config ){
    UndoableAction.superclass.constructor.apply( this, arguments );
}

var Lang = Y.Lang,
    UAName = "UndoableAction",
    LABEL = "label",
    BEFOREUNDO = "beforeUndo",
    UNDOFINISHED = "undoFinished",
    BEFOREREDO = "beforeRedo",
    REDOFINISHED = "redoFinished";

Y.mix( UndoableAction, {
    /**
     * The identity of UndoableAction.
     *
     * @property UndoableAction.NAME
     * @type String
     * @static
     */
    NAME : UAName,

    /**
     * Static property used to define the default attribute configuration of UndoableAction.
     *
     * @property UndoableAction.ATTRS
     * @type Object
     * @protected
     * @static
     */
    ATTRS : {
        /**
         * The label of action
         *
         * @attribute label
         * @type String
         * @default ""
         */
        label: {
            value: "",
            validator: Lang.isString
        },

        
        /**
         * Boolean, indicates if action must be processed asynchronously.
         * If true, <code>undo</code> method must fire <code>undoFinished</code> event.
         * Respectively, <code>redo</code> method must fire <code>redoFinished</code> event
         *
         * @attribute asyncProcessing
         * @type Boolean
         * @default false
         */
        asyncProcessing : {
            value: false,
            validator: Lang.isBoolean
        }
    }
});


Y.extend( UndoableAction, Y.Base, {
    
    /**
     * Container for child actions of this action
     *
     * @property _childActions
     * @protected
     * @type Array
     */
    _childActions : [],

    /**
     * Publishes events
     *
     * @method initializer
     * @protected
     */
    initializer : function( cfg ) {
        this._initEvents();
    },

    /**
     * Destructor lifecycle implementation for UndoableAction class.
     *
     * @method destructor
     * @protected
     */
    destructor : function() {
    },

    
    /**
     * Publishes UndoableAction's events
     *
     * @method _initEvents
     * @protected
     */
    _initEvents : function(){
        
        /**
         * Signals the beginning of action undo.
         * 
         * @event beforeUndo
         * @param event {Event.Facade} An Event Facade object
         */
        this.publish( BEFOREUNDO );
        
        /**
         * Signals the end of action undo.
         * 
         * @event undoFinished
         * @param event {Event.Facade} An Event Facade object
         */
        this.publish( UNDOFINISHED );
        
        /**
         * Signals the beginning of action redo.
         * 
         * @event beforeRedo
         * @param event {Event.Facade} An Event Facade object
         */
        this.publish( BEFOREREDO );
        
        /**
         * Signals the end of action redo.
         * 
         * @event redoFinished
         * @param event {Event.Facade} An Event Facade object
         */
        this.publish( REDOFINISHED );
    },

    
    /**
     * The default implemetation undoes all child actions in reverse order.
     *
     * @method undo
     */
    undo : function(){
        var childActions, action, i;

        this.fire( BEFOREUNDO );
        
        childActions = this._childActions;

        for( i = childActions.length - 1; i > 0; i-- ){
            action = childActions[i];
            action.undo();
        }

        this.fire( UNDOFINISHED );
    },
    
    
    /**
     * The default implemetation redoes all child actions.
     *
     * @method redo
     */
    redo : function(){
        var childActions, action, i, length;

        this.fire( BEFOREREDO );

        childActions = this._childActions;
        length = childActions.length;
        
        for( i = 0; i < length; i++ ){
            action = childActions[i];
            action.redo();
        }

        this.fire( REDOFINISHED );
    },
        
    
    /**
     * Depending on the application, an UndoableAction may merge with another action. If merge was successfull, merge must return true; otherwise returns false.
     * The default implemetation returns false.
     *
     * @method merge
     * @param {Y.UndoableAction} newAction The action to merge with
     * @return {Boolean} false
     */
    merge : function( newAction ){
        return false;
    },

    
    /**
     * UndoManager invokes <code>cancel</code> method of action before removing it from the list.<br>
     * The default implemetation does nothing.
     *
     * @method cancel
     */
    cancel : function(){
    },
    
    
    /**
     * Overrides <code>toString()</code> method.<br>
     * The default implementation returns the value of <code>label</code> property.
     * 
     */
    toString : function(){
        return this.get( LABEL );
    }
});

Y.UndoableAction = UndoableAction;

}());


}, 'gallery-2010.04.08-12-35' ,{requires:['base','event']});
