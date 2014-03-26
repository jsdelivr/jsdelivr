YUI.add('gallery-base-revive', function(Y) {

/**
Base extension providing ability to revive destroyed objects

@module BaseRevive
**/
var DESTROY = 'destroy',
    DESTROYED = 'destroyed',
    REVIVE = 'revive';

/**
Base extension providing ability to revive destroyed objects

@class BaseRevive
**/
function BaseRevive() {}


BaseRevive.prototype = {
    /**
    initializer lifecycle method

    @method initializer
    @protected
    **/
    initializer: function() {
        var self = this;

        Y.log('Initializing ' + self.toString(), 'info', 'base-revive');

        self._baseReviveHandles = [
            // AOP method preventing detachAll called by the destroy method
            Y.Do.before(self._reviveDoBeforeDetachAll, self, 'detachAll', self),

            // AOP method preventing default _defDestroyFn.  Use AOP here instead of
            // using an onDestroy handler and preventing default because we actually
            // want the destroy event lifecycle to complete.  We just want to prevent
            // the default destroy behavior of detaching events and unwinding the
            // class hierarchy
            Y.Do.before(self._reviveDoBefore_defDestroyFn, self, '_defDestroyFn', self)
        ];
    },


    /**
    Fully destroys this object.  can no longer be revived.

    @method destroyFinal
    **/
    destroyFinal: function() {
        var self = this;

        // detach the AOP handles that override the default
        // destroy behavior
        Y.each(self._baseReviveHandles, function(h) {
            h.detach();
        });

        if (this.get(DESTROYED)) {
            self._defDestroyFn();
            self.detachAll();
        } else {
            self.destroy();
        }

        return self;
    },


    /**
    Revives this object

    @method revive
    **/
    revive: function() {
        var self = this;

        /**
        Event for the revive method, fired prior to revive.
        Invoking the preventDefault() method on the event object provided
        to subscribers will prevent revive from occuring.

        Subscribers to the "after" moment of this event, will be notified
        after revive of the object is complete (and therefore
        cannot prevent revive).

        @event revive
        @preventable _defReviveFn
        @param {EventFacade} e Event object
        **/
        self.publish(REVIVE, {
            defaultTargetOnly: true,
            defaultFn: self._defReviveFn,
            queuable: false
        });

        // only fire the revive event if this object is currently in a destroyed state
        if (self.get(DESTROYED)) {
            self.fire(REVIVE);
        }

        return self;
    },


    /**
    Default revive event handler
    revives this object if it has previously been destroyed

    @method _defReviveFn
    @private
    **/
    _defReviveFn: function() {
        var self = this;

        Y.log('Reviving ' + this.toString(), 'info', 'base-revive');

        // force reset the destroyed attribute
        // these wont fire events since the object is already
        // destroyed.  neat.
        self._set(DESTROYED, false);

        // the destroy event is published as fireOnce
        // reset the fired property so it can fire again.
        self.getEvent(DESTROY).fired = false;
    },


    /**
    AOP method firing before _defDestroyFn.  Sets the destroyed attribute
    to true, resets destroy event state to unfired and prevents the
    default _defDestroyFn from executing

    @method _reviveDoBefore_defDestroyFn
    @private
    **/
    _reviveDoBefore_defDestroyFn: function() {
        // force reset the destroyed attribute. this is the only
        // behavior of the overridden _defDestroyFn that we want
        this._set(DESTROYED, true);

        // the destroy event is published as fireOnce
        // reset the fired property so it can fire again.
        this.getEvent(DESTROY).fired = false;

        // prevent the default _defDestroyFn from executing
        return new Y.Do.Prevent('BaseRevive prevented _defDestroyFn');
    },


    /**
    AOP method firing before detachAll. Prevent the default detachAll behavior
    which is called by the destroy method.

    @method _reviveDoBeforeDetachAll
    @private
    **/
    _reviveDoBeforeDetachAll: function() {
        return new Y.Do.Prevent('BaseRevive prevented detachAll');
    }
};

Y.BaseRevive = BaseRevive;


}, 'gallery-2011.11.17-14-56' ,{requires:['base']});
