/**
 * E2D Engine v1.1.6
 * Built 03:07:19 UTC | 2016-2-27
 * @author Jack Dalton <jack@jackdalton.org>
 * Copyright © 2015 Jack Dalton under the MIT license (https://opensource.org/licenses/MIT)
 **/

var E2D = {
    VERSION: "1.1.6"
};
E2D.Scene = ( function () {
    /**
     * @param {Object} options - Scene options
     * @param {boolean} options.logging - Whether or not to log things.
     * @param {int} options.idLength - Default ID length for objects.
     */
    function Scene( options ) {
        options = options || {};
        this._options = {};
        this._options.logging = options.logging || true;
        this._options.idLength = options.idLength || 16;
        if ( this._options.logging ) {
            console.log( "E2D v" + E2D.VERSION );
        }
        this._ids = {};
        this._objects = {};
        this._disabledObjects = {};
        this.custom = options.custom || {};
        this._extensions = {};
    }
    /**
     * Calls the specified renderer of each object.
     */
    Scene.prototype.render = function () {
        var self = this;
        var queue = [];
        for ( var i in self._objects ) {
            if ( self._objects.hasOwnProperty( i ) ) {
                queue.push( self._objects[ i ] );
            }
        }
        queue.sort( function ( a, b ) {
            return a._layer - b._layer;
        } );
        for ( var _i = 0, queue_1 = queue; _i < queue_1.length; _i++ ) {
            var i = queue_1[ _i ];
            i.render();
        }
    };
    /**
     * Updates the scene's extensions
     */
    Scene.prototype._updateExtensions = function () {
        var self = this;
        for ( var i in self._extensions ) {
            self._extensions[ i ].fn();
        }
    };
    return Scene;
} )();
/**
 * @constructor
 * @param {number} x - Vector x coordinate
 * @param {number} y - Vector y coordinate
 * @returns {object} pos - Position ({x: x, y: y})
 */
E2D.Scene.prototype.Vector2 = ( function () {
    function class_1( x, y ) {
        this.x = typeof x == "number" ? x : 0;
        this.y = typeof y == "number" ? y : 0;
        return this;
    }
    class_1.prototype.getPos = function () {
        return this;
    };
    class_1.prototype.getX = function () {
        return this.x;
    };
    class_1.prototype.getY = function () {
        return this.y;
    };
    class_1.prototype.setPos = function ( pos ) {
        this.x = typeof pos.x == "number" ? pos.x : this.x;
        this.y = typeof pos.y == "number" ? pos.y : this.y;
        return this;
    };
    class_1.prototype.setX = function ( x ) {
        this.x = typeof x == "number" ? x : this.x;
        return this;
    };
    class_1.prototype.setY = function ( y ) {
        this.y = typeof y == "number" ? y : this.y;
        return this;
    };
    class_1.prototype.distanceTo = function ( pos ) {
        return Math.sqrt( Math.pow( pos.x - this.x, 2 ) + Math.pow( pos.y - this.y, 2 ) );
    };
    class_1.prototype.midpoint = function ( pos ) {
        return new E2D.Scene.prototype.Vector2( ( this.x + pos.x ) / 2, ( this.y + pos.y ) / 2 );
    };
    class_1.prototype.translate = function ( to ) {
        if ( arguments.length == 2 ) {
            this.x += typeof arguments[ 0 ] == "number" ? arguments[ 0 ] : 0;
            this.y += typeof arguments[ 1 ] == "number" ? arguments[ 1 ] : 0;
        } else if ( to instanceof Vector2 ) {
            this.x += to.x || 0;
            this.y += to.y || 0;
        }
        return this;
    };
    class_1.prototype.clone = function () {
        return new E2D.Scene.prototype.Vector2( this.x, this.y );
    };
    class_1.prototype.equals = function ( v ) {
        return ( this.x == v.x && this.y == v.y );
    };
    return class_1;
}() );
/**
 * @param {int} length - Length of ID to generate; default is 16 characters.
 * @returns {string} id - Random ID to be used with anything.
 */
E2D.Scene.prototype.generateId = function ( length ) {
    var self = this;
    length = length || self._options.idLength;
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ$_",
        id = "";
    for ( var i = 0; i < length; i++ ) {
        id += chars[ Math.floor( Math.random() * chars.length ) ];
    }
    return id;
};
/**
 * @param {Object} options - The object's options.
 * @param {Object} options.pos - The object's position.
 * @param {int} options.pos.x - The object's X coordinate.
 * @param {int} options.pos.y - The object's Y coordinate.
 * @param {function} options.renderer - Function to be called on object.render. The object is passed as a parameter when called.
 * @param {int} options.layer - Rendering priority/layer -- Lower layer is rendered first
 */
E2D.Scene.prototype.addObject = function ( options ) {
    var self = this;
    options.pos = options.pos || {};
    if ( typeof options == "undefined" ) {
        options = {
            pos: new self.Vector2( 0, 0 )
        };
    } else {
        if ( typeof options.pos.x != "number" || typeof options.pos.y != "number" ) {
            if ( self._options.logging )
                console.warn( "Invalid position supplied. Using (0, 0) (@addObject)" );
        }
    }
    var obj = {};
    obj.id = options.id || self.generateId();
    obj.body = {
        pos: options.pos
    };
    if ( typeof options.custom != "undefined" ) {
        obj.custom = options.custom;
    }
    self._objects[ obj.id ] = obj;
    obj._renderer = typeof options.renderer == "function" ? options.renderer : function () {};
    self._objects[ obj.id ].render = function () {
        self._objects[ obj.id ]._renderer( self._objects[ obj.id ], arguments );
    };
    obj._layer = options.layer || 0;
    self._updateExtensions();
    return obj;
};
/**
 * @param {string} id - ID of object to destroy.
 * @returns {boolean} status - Whether the object was deleted.
 */
E2D.Scene.prototype.destroyObject = function ( id ) {
    var self = this;
    if ( typeof self._objects[ id ] == "undefined" ) {
        if ( self._options.logging )
            console.warn( id + " either doesn't exist, or hasn't been added to the scene. Object was not destroyed (@destroyObject)" );
        return false;
    }
    delete self._objects[ id ];
    self._updateExtensions();
    return true;
};
/**
 * @param {string} id - ID of object to enable
 * @returns {boolean} success - Whether or not the object was enabled.
 */
E2D.Scene.prototype.enableObject = function ( id ) {
    var self = this;
    if ( typeof self._disabledObjects[ id ] == "undefined" ) {
        if ( self._options.logging )
            console.warn( id + " either doesn't exist, hasn't been disabled, or hasn't been added to the scene. Object was not enabled (@enableObject)" );
        return false;
    }
    self._objects[ id ] = self._disabledObjects[ id ];
    delete self._disabledObjects[ id ];
    self._updateExtensions();
    return true;
};
/**
 * @param {string} id - ID of object to disable
 * @returns {boolean} success - Whether or not the object was disabled.
 */
E2D.Scene.prototype.disableObject = function ( id ) {
    var self = this;
    if ( typeof self._objects[ id ] == "undefined" ) {
        if ( self._options.logging )
            console.warn( id + " either doesn't exist, or hasn't been added to the scene. Object was not disabled (@disableObject)" );
        return false;
    }
    self._disabledObjects[ id ] = self._objects[ id ];
    self.destroyObject( id );
    self._updateExtensions();
    return true;
};
/**
 * Returns the specified object.
 *
 * @param {string} id - ID of desired object
 * @returns {Object} obj - Desired object
 */
E2D.Scene.prototype.getObjectById = function ( id ) {
    id = id || "";
    if ( typeof this._objects[ id ] == "undefined" && typeof this._disabledObjects[ id ] == "undefined" ) {
        console.warn( "Object \"" + id + "\" does not exist. (@getObjectById)" );
        return false;
    }
    return this._objects[ id ] || this._disabledObjects[ id ];
};
/**
 * Register an E2D extension.
 *
 * @param {Object} options - An object containing options for the new extension.
 * @param {string} options.title - Title of the new extension.
 * @param {string} options.id - ID of the new extension. Randomly generated if not included.
 * @param {function} options.fn - Function to be executed on scene runtime. The scene is passed as a parameter.
 * @returns {string} ext.id - ID of the registered extension.
 */
E2D.Scene.prototype.registerExtension = function ( options ) {
    var self = this;
    var Extension = ( function () {
        function Extension( options ) {
            options = options || {};
            this.title = options.title || "Untitled Extension " + self.generateId();
            this.id = options.id || "ext" + self.generateId();
            this._enabled = true;
            this.fn = function () {
                options.fn( self );
            };
            this._bak_fn = function () {
                options.fn( self );
            };
            if ( typeof options.fn == "undefined" ) {
                if ( self._options.logging )
                    console.warn( "No function provided with " + this.title + ", using an empty function (@registerExtension)." );
                this.fn = function () {};
            }
        }
        Extension.prototype.disable = function () {
            this.fn = function () {};
            this._enabled = false;
        };
        Extension.prototype.enable = function () {
            this.fn = this._bak_fn;
            this._enabled = true;
        };
        return Extension;
    }() );
    var ext = new Extension( options );
    self._extensions[ ext.id ] = ext;
    self._updateExtensions();
    return ext.id;
};
/**
 * Returns the specified extension.
 *
 * @param {string} id - ID of desired extension
 * @returns {Object} ext - Desired extension
 */
E2D.Scene.prototype.getExtensionById = function ( id ) {
    id = id || "";
    if ( typeof this._extensions[ id ] == "undefined" ) {
        console.warn( "Extension \"" + id + "\" does not exist. (@getExtensionById)" );
        return false;
    }
    return this._extensions[ id ];
};

typeof module !== "undefined" ? module.exports = E2D : window.E2D = E2D;
