/**
 * Engine2D game engine v1.1.1
 * License: http://git.io/vlp11
 * @author jackdalton
 */

/**
 * Engine2D namespace
 *
 * @namespace
 */
var Engine2D = {
    VERSION: "1.1.1",
    TYPE: {
        RECT: 1,
        CIRCLE: 2
    },
    EXTENSIONS: {},
    /**
     * 2D vector constructor.
     *
     * @constructor
     * @param {Number} x - X position
     * @param {Number} y - Y position
     * @this {Vector2}
     */
    Vector2: function(x, y) {
        var self = this;
        x = x || 0;
        y = y || 0;
        /**
         * Sets the vector position.
         *
         * @memberof Engine2D.Vector2
         * @param {Vector2} position - Desired vector position
         */
        self.setPos = function(position) {
            x = position.getX();
            y = position.getY();
        };
        /**
         * Sets the vector's X position.
         * 
         * @memberof Engine2D.Vector2
         * @param {integer} value - Value of vector's X position.
         */
        self.setX = function(value) {
            x = value;
        };
        /**
         * Sets the vector's Y position.
         * 
         * @memberof Engine2D.Vector2
         * @param {integer} value - Value of vector's Y position.
         */
        self.setY = function(value) {
            y = value;
        };
        /**
         * Gets the vector x position.
         *
         * @memberof Engine2D.Vector2
         * @returns {Number} x - Vector x position.
         */
        self.getX = function() {
            return x;
        };
        /**
         * Gets the vector y position.
         *
         * @memberof Engine2D.Vector2
         * @returns {Number} y - Vector y position.
         */
        self.getY = function() {
            return y;
        };
        /**
         * Gets the full vector position.
         *
         * @memberof Engine2D.Vector2
         * @returns {Object} position - An object containing properties `x` and `y`, representing vector positions.
         */
        self.getPos = function() {
            return {
                x: x,
                y: y
            };
        };
        /**
         * Calculates the distance to another vector position.
         *
         * @memberof Engine2D.Vector2
         * @param {Vector2} pos - Position to calculate distance to.
         * @returns {Number} distance - Distance to other vector.
         */
        self.distanceTo = function(pos) {
            return (Math.sqrt(Math.pow(pos.getX() - x, 2) + Math.pow(pos.getY() - y, 2)));
        };
        /**
         * Finds the midpoint between this and another vector position.
         *
         * @memberof Engine2D.Vector2
         * @param {Vector2} pos - Position to calculate midpoint for.
         * @returns {Vector2} midpoint - Midpoint between this and another vector position.
         */
        self.midpoint = function(pos) {
            return new Engine2D.Vector2((x + pos.getX()) / 2, (y + pos.getY()) / 2);
        };
        /**
         * Performs a vector movement.
         *
         * @memberof Engine2D.Vector2
         * @param {Number} plusX - X value to add to vector x position.
         * @param {Number} plusY - Y value to add to vector y position.
         */
        self.vectorMovement = function(plusX, plusY) {
            x += plusX;
            y += plusY;
        };
    },
    /**
     * Engine2D game scene constructor.
     *
     * @constructor
     */
    GameScene: function() {
        console.log("Engine2D v" + Engine2D.VERSION + ".");
        var self = this;
        self.objects = {};
        for (var i in Engine2D.EXTENSIONS) {
            Engine2D.EXTENSIONS[i].exec();
            console.log("Engine2D loaded " + Engine2D.EXTENSIONS[i].extensionName + " v" + Engine2D.EXTENSIONS[i].version + ", by " + Engine2D.EXTENSIONS[i].author + ".");
        }
        /**
         * Checks whether a game object ID is valid or not.
         *
         * @private
         * @param {string} objectId - ID to validate.
         * @returns {boolean} - Whether the generated object ID is valid or not.
         */
        var isValidID = function(objectId) {
            var pass;
            for (var i in self.objects) {
                if (self.objects[i].id == objectId) pass = true;
            }
            if (!!pass)
                return true;
            else
                return false;
        };
        /**
         * Adds game object to scene.
         *
         * @param {Object} gameObject - Valid Engine2D game object to add to scene.
         * @memberof Engine2D.GameScene
         * @returns {string} id - ID of game object added to scene.
         */
        self.addObject = function(gameObject) {
            var pass;
            for (var i in Engine2D.TYPE) {
                if (gameObject.type == Engine2D.TYPE[i]) pass = true;
            }
            if (!!pass) {
                self.objects[gameObject.id] = gameObject;
                return gameObject.id;
            } else
                throw new TypeError("\"" + gameObject.type + "\" is not a valid Engine2D game object type.");
        };
        /**
         * Disables a game object.
         *
         * @param {string} objectId - ID of desired object in the scene to disable.
         * @memberof Engine2D.GameScene
         */
        self.disableObject = function(objectId) {
            if (isValidID(objectId))
                self.objects[objectId].alive = false;
            else
                throw new ReferenceError("Object \"" + objectId + "\" either doesn't exist, or hasn't been added to the scene.");
        };
        /**
         * Enables a game object.
         *
         * @param {string} objectId - ID of desired object in the scene to enable.
         * @memberof Engine2D.GameScene
         */
        self.enableObject = function(objectId) {
            if (isValidID(objectId))
                self.objects[objectId].alive = true;
            else
                throw new ReferenceError("Object \"" + objectId + "\" either doesn't exist, or hasn't been added to the scene.");
        };
        /**
         * Permanently destroys a game object.
         *
         * @param {string} objectId - ID of desired object in the scene to destroy.
         * @memberof Engine2D.GameScene
         */
        self.destroyObject = function(objectId) {
            if (isValidID(objectId))
                delete self.objects[objectId];
            else
                throw new ReferenceError("Object \"" + objectId + "\" either doesn't exist, or hasn't been added to the scene.");
        };
    },
    /**
     * Engine2D rectangle constructor.
     *
     * @constructor
     * @this {Rect}
     * @param {Object} options - An object specifying various aspects of a rectangle.
     * @param {string} options.id - Scene object ID.
     * @param {boolean} options.alive - Whether the object should be active by default.
     * @param {Number} options.width - Desired width of the object.
     * @param {Number} options.height - Desired height of the object.
     * @param {Vector2} options.position - Desired position of the object.
     */
    Rect: function(options) {
        var self = this;
        options = options || {};
        self.id = options.id || Engine2D.randomID();
        self.type = Engine2D.TYPE.RECT;
        self.alive = options.alive || true;
        self.size = {}, self.position = {};
        self.size.width = options.width || 0;
        self.size.height = options.height || 0;
        self.position = options.position || new Engine2D.Vector2(0, 0);
    },
    /**
     * Engine2D circle constructor.
     *
     * @constructor
     * @this {Circle}
     * @param {Object} options - An object specifying various aspects of a circle.
     * @param {string} options.id - Scene object ID.
     * @param {boolean} options.alive - Whether the object should be active by default.
     * @param {Number} options.radius - Desired radius of the object.
     * @param {Vector2} options.position - Desired position of the object.
     */
    Circle: function(options) {
        var self = this;
        options = options || {};
        self.id = options.id || Engine2D.randomID();
        self.type = Engine2D.TYPE.CIRCLE;
        self.alive = options.alive || true;
        self.size = {}, self.position = {};
        self.size.radius = options.radius || 0;
        self.position = options.position || new Engine2D.Vector2(0, 0);
    },
    /**
     * Used to generate random object IDs for Engine2D game objects.
     *
     * @returns {string} - Randomly generated object ID.
     */
    randomID: function() {
        var opts = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", out = "";
        var i = 0;
        while (i < 5) {
            i++;
            out += opts[Math.floor(Math.random() * opts.length)];
        }
        return out;
    },
    /**
     * Returns the next available type address (Engine2D.TYPE[x]).
     * 
     * @returns {integer} - Next available type address.
     */
    nextAvailableTypeAddress: function() {
        var addr = 0;
        for (var i in Engine2D.TYPE) {
            addr = Engine2D.TYPE[i];
        }
        addr++;
        return addr;
    },
    /**
     * Engine2D extension registrar. Used to register a new Engine2D extension.
     * 
     * @param {Object} options - Extension properities.
     * @param {string} options.extensionName - Name of the new extension.
     * @param {string} options.author - Extension author.
     * @param {string} options.version - Current version of the extension.
     * @param {function} options.exec - Function to be executed on extension load. Typically this will define some prototypes to Engine2D.GameScene, or other constructors.
     */
    registerExtension: function(options) {
        var ext = {};
        options = options || {};
        ext.id = "ext" + Engine2D.randomID();
        ext.extensionName = options.extensionName || ext.id;
        ext.author = options.author || "an anonymous contributor";
        ext.version = options.version || "0.0.0";
        ext.exec = options.exec || null;
        Engine2D.EXTENSIONS[ext.id] = ext;
    }
};

typeof module !==  "undefined" ? module.exports = Engine2D : window.Engine2D = Engine2D;