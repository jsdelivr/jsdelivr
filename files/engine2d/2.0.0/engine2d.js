/**
 * Engine2D game engine v2.0.0
 * License: http://git.io/vlp11
 * @author jackdalton
 */

/**
 * Engine2D namespace
 *
 * @namespace
 */
var Engine2D = {
    VERSION: "2.0.0",
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
        x = (typeof(x) == "number") ? x : 0;
        y = (typeof(y) == "number") ? y : 0;
        /**
         * Sets the vector position.
         *
         * @memberof Engine2D.Vector2
         * @param {Vector2} position - Desired vector position
         */
        self.setPosition = function(position) {
            if (typeof(position) == "object") {
                x = position.x || x;
                y = position.y || y;
                return {
                    x: x,
                    y: y
                };
            } else {
                if (typeof(arguments[0]) == "number" && typeof(arguments[1]) == "number") {
                    x = arguments[0] || x;
                    y = arguments[1] || y;
                } else {
                    throw new TypeError("Vector2 position can only be an object or two numbers.");
                }
            }
            return {
                x: x,
                y: y
            };
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
         * Performs a translation to another position.
         * 
         * @memberof Engine2D.Vector2
         * @param {Object} to - Position to translate the vector to.
         * @returns {Object} pos - Position the vector was translated to.
         */
        self.translate = function(to) {
            if (typeof(to) == "object") {
                x += (to.x || 0);
                y += (to.y || 0);
            } else if (typeof(arguments[0]) == "number" && typeof(arguments[1]) == "number") {
                x += (arguments[0] || 0);
                y += (arguments[1] || 0);
            } else {
                throw new TypeError("Vector2 must be translated using an object or two numbers");
            }
        };
        /**
         * Rotates a vector by the given theta.
         * 
         * @param {number} theta - Theta to rotate the vector by.
         * @returns {Object} coordinates - Rotated coordinates
         */
        self.rotate = function(theta) {
            if (typeof(theta) == "number") {
                return {
                    x: +(x * Math.cos(theta) - y * Math.sin(theta)).toPrecision(4),
                    y: +(x * Math.sin(theta) + y * Math.cos(theta)).toPrecision(4)
                };
            } else {
                throw new TypeError("Vector2 must be rotated using a number");
            }
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
     * @returns {string} id - Extension ID.
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
        return ext.id;
    }
};

typeof module !==  "undefined" ? module.exports = Engine2D : window.Engine2D = Engine2D;