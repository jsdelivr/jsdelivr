/*
    MOLECULE 0.9.3

    HTML5 game development library by Francisco Santos Belmonte and Christian Alfoni Jørgensen

 */

(function (window) {

    var definedModules = [];
    var moleculeModules = [];
    var initializedModules = [];
    var onceCallbacks = [];
    var logArgs = {};
    var isTest = false;
    var timeoutLimit = 1000;
    var game = null;

    var p = {
        Module: function Module(name, func) {
            this.name = name;
            this.func = func;
        },
        isModule: function (module) {
            return module instanceof p.Module;
        },
        'throw': function (message) {
            throw Error('Molecule Error: ' + message);
        },
        getSinon: function () {
            return window.sinon;
        },
        getModule: function (name, modules) {
            var module;
            for (var x = 0; x < modules.length; x++) {
                if (modules[x].name === name) {
                    module = modules[x];
                    break;
                }
            }
            if (!module) p.throw('Could not require module: "' + name + '". The name does not exist or loading it causes a loop.');
            return module;
        },
        addModule: function (array, name, func) {
            array.push(new p.Module(name, func));
        },
        registerModules: function (defined, initialized) {
            var module,
                context,
                initializeModule = true,
                startTime = new Date().getTime(),
                depExceptions = [];
            while (defined.length && !p.timeout(startTime)) {
                initializeModule = true;
                module = p.getLast(defined);
                context = p.createContext(initialized);
                try {
                    context.exports = module.func.apply(context, p.contextToArray(context));
                } catch (e) {
                    // Dependency not ready
                    if (e.message.match(/Molecule Error/)) {
                        p.addDepException(depExceptions, e.message);
                        p.moveLastToFirst(defined);
                        initializeModule = false;
                    } else {
                        throw e;
                    }
                }
                if (initializeModule && typeof context.exports === 'undefined') {
                    p.throw('Module ' + module.name + ' is returning undefined, it has to return something');
                }
                if (initializeModule) {
                    module.exports = context.exports;
                    p.moveLastToTarget(defined, initialized);
                }
            }

            if (p.timeout(startTime)) {
                p.throw('Timeout, could not load modules. The following dependencies gave errors: ' +
                    (depExceptions.length ? depExceptions.join(', ') : '') +
                    '. They do not exist or has caused a loop.');
            }
        },
        contextToArray: function (context) {
            if (game) {
                return [game, context.require, context.privates];
            } else {
                return [context.require, context.privates];
            }

        },
        registerTestModule: function (name, defined) {
            var module,
                context,
                testModule,
                startTime = new Date().getTime(),
                depExceptions = [];
            while (!testModule && !p.timeout(startTime)) {
                module = p.getLast(defined);
                context = p.createTestContext(defined);
                if (module.name === name) {
                    try {
                        context.exports = module.func.apply(context, p.contextToArray(context));
                    } catch (e) {
                        if (e.message.match(/Molecule Error/)) {
                            p.addDepException(depExceptions, e.message);
                            p.moveLastToFirst(defined);
                        } else {
                            throw e;
                        }
                    }
                    testModule = module;
                } else {
                    p.moveLastToFirst(defined);
                }
            }
            if (p.timeout(startTime)) {
                p.throw('Timeout, could not load modules. The following dependencies gave errors: ' +
                    (depExceptions.length ? depExceptions.join(', ') : name) +
                    '. They do not exist or has caused a loop.');
            }

            if (!context.exports && !depExceptions.length) {
                p.throw('Module ' + testModule.name + ' is returning undefined, it has to return something');
            } else if (depExceptions.length) {
                p.throw('The following dependencies gave errors: ' + depExceptions.join(', ') +
                    '. They do not exist or has caused a loop.');
            }

            return context;

        },
        timeout: function (startTime) {
            return new Date().getTime() - startTime >= timeoutLimit;
        },
        addDepException: function (array, message) {
            message = message.match(/"(.*)"/)[1];
            if (array.indexOf(message) === -1) {
                array.push(message);
            }
        },
        createGame: function (options) {
            var Game = p.getModule('Molecule.Game', initializedModules).exports;
            game = new Game(options);
            game.once = Molecule.once;
            game.log = Molecule.log;
        },
        createContext: function (modules) {
            var context = {
                privates: {},
                require: function (name) {
                    var module = p.getModule(name, modules);
                    return p.isModule(module) ? module.exports : module; // Return exports only if it is a module-loader module
                },
                game: game
            };
            return context;
        },
        createTestContext: function (modules) {
            var context = {
                privates: {},
                deps: {}
            };
            context.require = p.createTestRequireMethod(context, modules);

            return context;
        },
        createTestRequireMethod: function (context, modules) {
            return function (name) {
                var depExceptions = [];
                var depModule = p.getModule(name, modules),
                    depContext = {
                        privates: {},
                        require: function (name) { // TODO: Make this more general with registerModule

                            var module = p.getModule(name, modules);

                            try {
                                module = module.func.apply(context, p.contextToArray(context));
                            } catch (e) {
                                if (e.message.match(/Molecule Error/)) {
                                    p.addDepException(depExceptions, e.message);
                                } else {
                                    throw e;
                                }
                            }

                            return p.isModule(module) ? module.exports : module; // Return exports only if it is a module-loader module

                        }
                    };

                depContext.exports = p.isModule(depModule) ? depModule.func.apply(depContext, p.contextToArray(depContext)) : depModule;

                // Adds the dependency exports to the main context
                // which lets you edit the stubs in the test
                depModule.exports = p.stubDepExports(depContext.exports);
                context.deps[name] = depModule.exports;

                return depModule.exports;
            };
        },
        stubDepExports: function (exports) {
            var sinon = p.getSinon();
            if (sinon) {
                var stubbedMethods = {};

                if (typeof exports === 'function') {
                    return sinon.spy();
                } else {
                    for (var depMethod in exports) {
                        if (!exports.hasOwnProperty(depMethod)) {
                            continue;
                        }
                        if (typeof exports[depMethod] === 'function') {
                            stubbedMethods[depMethod] = exports[depMethod];
                            sinon.stub(stubbedMethods, depMethod);
                        }
                    }
                }

                return stubbedMethods;
            }
            return exports;
        },
        getLast: function (modules) {
            return modules[modules.length - 1];
        },
        moveLastToFirst: function (modules) {
            modules.unshift(modules.pop());
        },
        moveLastToTarget: function (sourceArray, targetArray) {
            targetArray.push(sourceArray.pop());
        },
        extractBrowserArgs: function (args) {
            return {
                name: args[0],
                func: args[1]
            };
        }
    };


    var Molecule = function (options) {
        p.registerModules(moleculeModules, initializedModules);
        p.createGame(options);
        return Molecule;
    };

    Molecule.module = function () {
        var args = p.extractBrowserArgs(arguments);
        if (!args.name || typeof args.name !== 'string' || !args.func || typeof args.func !== 'function') {
            p.throw('Invalid arguments for module creation, you have to pass a string and a function');
        }
        if (args.name.match(/Molecule/)) {
            p.addModule(moleculeModules, args.name, args.func);
        } else {
            p.addModule(definedModules, args.name, args.func);
        }

        return this;

    };

    Molecule.init = function (callback) {
        var initializeModules = function () {
            p.registerModules(definedModules, initializedModules);
        };
        game.init(initializeModules, callback);
        game.start();
        return this;

    };

    Molecule.update = function (callback) {
        game.update(callback);
        return this;
    };

    Molecule.ready = function (callback) {
        var initializeModules = function () {
            p.registerModules(definedModules, initializedModules);
        };
        game.init(initializeModules, callback);
        game.start();
        return game;
    };

    Molecule.sprite = function (id, spriteSrc, frameWidth, frameHeight) {
        game.imageFile.load(id, spriteSrc, frameWidth, frameHeight);
        return this;
    };

    Molecule.audio = function (id, soundSrc) {
        game.audioFile.load(id, soundSrc);
        return this;
    };

    Molecule.tilemap = function (id, mapSrc) {
        game.mapFile.load(id, mapSrc);
        return this;
    };
    
    Molecule.spritesheet = function (id, sprites) {
        game.spriteSheetFile.load(id, sprites);
        return this;
    };

    Molecule.test = function (name, callback) {
        isTest = true;
        var context = p.registerTestModule(name, definedModules);
        callback.apply(context, [context.exports, context.privates, context.deps]);
    };

    Molecule.once = function (func, context) {
        var funcString = func.toString();
        if (onceCallbacks.indexOf(funcString) === -1) {
            func.call(context);
            onceCallbacks.push(funcString);
        }
    };

    Molecule.log = function (id) {
        var args = Array.prototype.slice.call(arguments, 0),
            argsString;

        if (typeof id !== 'string' || arguments.length < 2) {
            throw new Error('You have to pass a string identifier and your arguments to log');
        }

        args.splice(0, 1);
        argsString = JSON.stringify(args);

        if (!logArgs[id] || logArgs[id] !== argsString) {
            args.unshift(id.toUpperCase() + ': ');
            args.forEach(function (arg, index) {
                if (arg instanceof Array || (typeof arg === 'object' && arg !== null)) {
                    args[index] = JSON.stringify(arg, null, 4);
                }
            });
            console.log.apply(console, args);
            logArgs[id] = argsString;
        }

    };


    window.Molecule = Molecule;

}(window));
Molecule.module('Molecule.Animation', function (require, p) {

    function Animation() {
        this.frame = [];
        this.id = [];
        this.current = {animation: 0, frame: 0};
        this.timer = 0;
        this.loop = true;
        this.reverse = false;
        this.halt = false;
    }

    Animation.prototype.sliceFrames = function(_imageWidth, _imageHeight, _frameWidth, _frameHeight) {
        this.frame = [];
        this.id = [];

        var i, j;
        for(i = 0; i < _imageHeight - 1; i += _frameHeight) {
            for(j = 0; j < _imageWidth - 1; j += _frameWidth) {
                this.frame.push({x:j, y:i});
            }
        }
        if(_imageWidth === _frameWidth && _imageHeight === _frameHeight) {
            this.add('');
        }
    };

    Animation.prototype.add = function(_name, options) {
        options = options || {};

        if (!options.frames) {
            options.frames = [0];
        }

        if (!options.speed) {
            options.speed = 60;
        }

        var _speedFps = options.speed * 60 / options.frames.length;
        this.id.push({name: _name, frame: options.frames, speed: _speedFps});
    };

    Animation.prototype.run = function(_name, options) {
        options = options || {};

        this.loop = typeof options.loop === 'undefined' ? true : options.loop;
        this.reverse = typeof options.reverse === 'undefined' ? false : options.reverse;
        this.halt = false;
        if(this.current.animation === -1 || this.id[this.current.animation].name !== _name) {
            this.current.frame = -1;
            for(var i = 0; i < this.id.length; i++) {
                if(this.id[i].name === _name) {
                    this.current.animation = i;
                    this.current.frame = 0;
                    this.timer = 0;
                }
            }
        }
    };
    
    Animation.prototype.stop = function() {
        this.halt = true;
    };

    Animation.prototype.nextFrame = function() {
        if(!this.halt) {
            this.timer++;
            if(this.timer > this.id[this.current.animation].speed) {
                this.timer = 0;
                if(!this.reverse) {
                    this.current.frame++;
                    if(this.current.frame >= this.id[this.current.animation].frame.length) {
                        if(this.loop) {
                            this.current.frame = 0;
                        } else {
                            this.current.frame = this.id[this.current.animation].frame.length - 1;
                        }
                    }
                } else {
                    this.current.frame--;
                    if(this.current.frame < 0) {
                        if(this.loop) {
                            this.current.frame = this.id[this.current.animation].frame.length - 1;
                        } else {
                            this.current.frame = 0;
                        }
                    }
                }
            }
        }
    };

    return Animation;

});
Molecule.module('Molecule.AudioFile', function (require, p) {

    var MAudio = require('Molecule.MAudio');

	function AudioFile(_game) {
		this.game = _game;
		this.name = [];
		this.data = [];
		this.counter = 0;
	}

	AudioFile.prototype.load = function(_id, _audioSrc) {
		if(!this.getAudioDataByName(_audioSrc)) {
			var self = this;
			var _audio = new Audio();
			var _audioSrcFile;
            var t = _audioSrc.split('.');
            if(_audio.canPlayType('audio/' + t[t.length - 1]) != '') {
                _audioSrcFile = _audioSrc;
            }
			_audio.addEventListener('canplay', function(){self.counter++});
			_audio.src = _audioSrcFile;
			this.name.push(_audioSrc);
			this.data.push(_audio);
		}

		var s = new MAudio();
        s.id = _id;
		s.sound = this.getAudioDataByName(_audioSrc);
		this.game.sounds[_id] = s;

		return s;
	};

	AudioFile.prototype.isLoaded = function() {
		return (this.counter === this.data.length);
	};

	AudioFile.prototype.getAudioDataByName = function(_audioName) {
		return this.data[this.name.indexOf(_audioName)];
	};

	return AudioFile;

});
Molecule.module('Molecule.Camera', function (require, p) {

    function Camera(_game) {
        this.game = _game;
        this.layer = null;
        this.sprite = null;
        this.scroll = {x: false, y: false};
        this.type = 0;
        this.offset = {x: 0, y: 0};
        this.isSet = false; // Wait until sprite is in scene
    }

    Camera.prototype.follow = function (_sprite) {
        this.sprite = _sprite;
        this.type = 1;
        if (this.game.scene.sprites.indexOf(this.sprite) === -1) {
            this.isSet = false;
            return;
        }
        this.set();
    };

    Camera.prototype.unfollow = function () {
        this.sprite = null;
        this.type = 0;
    };

    Camera.prototype.set = function () {
        if (this.type === 1) {

            this.isSet = true;
            this.layer = this.game.map.getMainLayer();
            
            var _x,
                _y,
                i;
            
            for(i = 0; i < this.game.scene.sprites.length; i++) {
                if(this.game.scene.sprites[i].scrollable) {
                    this.game.scene.sprites[i].position.x += -this.game.map.json.layers[this.layer].x;
                    this.game.scene.sprites[i].position.y += -this.game.map.json.layers[this.layer].y;
                }
            }
            
            this.game.map.resetPosition();
            
            _x = this.sprite.position.x;
            _y = this.sprite.position.y;

            this.sprite.position.x = 0;
            this.sprite.position.y = 0;

            for (i = 0; i < _x; i++) {
                this.sprite.move.x = 1;
                this.update(this.game.scene.sprites);
                this.game.cameraUpdate();
                this.game.resetMove();
            }

            for (i = 0; i < _y; i++) {
                this.sprite.move.y = 1;
                this.update(this.game.scene.sprites);
                this.game.cameraUpdate();
                this.game.resetMove();
            }

        }
    };

    Camera.prototype.update = function (_sprites) {
        if (!this.isSet && _sprites.indexOf(this.sprite) >= 0) {
            this.set();
        }

        if (this.game.map !== null && this.layer !== -1) {
            this.makeScroll();
            this.makeMapScroll();
        }

        this.makeSpriteScroll(_sprites, this.sprite.move.x, this.sprite.move.y);
    };

    Camera.prototype.makeScroll = function () {
        this.scroll.x = false;
        this.scroll.y = false;
        var wx = this.game.map.canvas[this.layer].width;
        var wy = this.game.map.canvas[this.layer].height;
        if (this.game.map.json.layers[this.layer].properties.scroll.infinite.x) {
            wx = -this.game.map.json.layers[this.layer].x + this.game.width + 1;
        }
        if (this.game.map.json.layers[this.layer].properties.scroll.infinite.y) {
            wy = -this.game.map.json.layers[this.layer].y + this.game.height + 1;
        }
        if (this.game.map.json.layers[this.layer].properties.scrollable) {
            if ((-this.game.map.json.layers[this.layer].x + this.game.width < wx && this.sprite.move.x > 0 && this.sprite.position.x - this.sprite.anchor.x + this.offset.x + this.sprite.frame.width / 2 >= this.game.width / 2) || (-this.game.map.json.layers[this.layer].x > 0 && this.sprite.move.x < 0 && this.sprite.position.x - this.sprite.anchor.x + this.offset.x + this.sprite.frame.width / 2 <= this.game.width / 2)) {
                this.scroll.x = true;
            }
            if ((-this.game.map.json.layers[this.layer].y + this.game.height < wy && this.sprite.move.y > 0 && this.sprite.position.y - this.sprite.anchor.y + this.offset.y + this.sprite.frame.height / 2 >= this.game.height / 2) || (-this.game.map.json.layers[this.layer].y > 0 && this.sprite.move.y < 0 && this.sprite.position.y - this.sprite.anchor.y + this.offset.y + this.sprite.frame.height / 2 <= this.game.height / 2)) {
                this.scroll.y = true;
            }
        }
    };

    Camera.prototype.makeMapScroll = function () {
        for (var i = 0; i < this.game.map.json.layers.length; i++) {
            if (this.game.map.json.layers[i].type === 'tilelayer' && this.game.map.json.layers[i].properties.scrollable) {
                var wx = this.game.map.canvas[i].width;
                var wy = this.game.map.canvas[i].height;
                if (this.game.map.json.layers[i].properties.scroll.infinite.x) {
                    wx = -this.game.map.json.layers[i].x + this.game.width + 1;
                }
                if (this.game.map.json.layers[i].properties.scroll.infinite.y) {
                    wy = -this.game.map.json.layers[i].y + this.game.height + 1;
                }
                if ((-this.game.map.json.layers[i].x + this.game.width < wx && this.sprite.move.x > 0 && this.sprite.position.x - this.sprite.anchor.x + this.offset.x + this.sprite.frame.width / 2 >= this.game.width / 2) || (-this.game.map.json.layers[i].x > 0 && this.sprite.move.x < 0 && this.sprite.position.x - this.sprite.anchor.x + this.offset.x + this.sprite.frame.width / 2 <= this.game.width / 2)) {
                    if (this.scroll.x) {
                        if (i !== this.layer) {
                            this.game.map.json.layers[i].properties.scroll.x = this.sprite.move.x * -this.game.map.json.layers[i].properties.scroll.speed;
                        } else {
                            this.game.map.json.layers[i].properties.scroll.x = -this.sprite.move.x;
                        }

                    }
                }
                if ((-this.game.map.json.layers[i].y + this.game.height < wy && this.sprite.move.y > 0 && this.sprite.position.y - this.sprite.anchor.y + this.offset.y + this.sprite.frame.height / 2 >= this.game.height / 2) || (-this.game.map.json.layers[i].y > 0 && this.sprite.move.y < 0 && this.sprite.position.y - this.sprite.anchor.y + this.offset.y + this.sprite.frame.height / 2 <= this.game.height / 2)) {
                    if (this.scroll.y) {
                        if (i !== this.layer) {
                            this.game.map.json.layers[i].properties.scroll.y = this.sprite.move.y * -this.game.map.json.layers[i].properties.scroll.speed;
                        } else {
                            this.game.map.json.layers[i].properties.scroll.y = -this.sprite.move.y;
                        }
                    }
                }
            }
        }
    };

    Camera.prototype.makeSpriteScroll = function (_sprite, _x, _y) {
        for (var i = 0; i < _sprite.length; i++) {
            if (_sprite[i].scrollable) {
                if (this.scroll.x) {
                    _sprite[i].move.x = _sprite[i].move.x - _x;
                }
                if (this.scroll.y) {
                    _sprite[i].move.y = _sprite[i].move.y - _y;
                }
            }
        }
    };

    return Camera;

});
Molecule.module('Molecule.Game', function (require, p) {

    var MapFile = require('Molecule.MapFile'),
        Camera = require('Molecule.Camera'),
        Scene = require('Molecule.Scene'),
        Map = require('Molecule.Map'),
        ImageFile = require('Molecule.ImageFile'),
        AudioFile = require('Molecule.AudioFile'),
        Input = require('Molecule.Input'),
        Text = require('Molecule.Text'),
        physics = require('Molecule.Physics'),
        move = require('Molecule.Move'),
        calculateSpriteCollisions = require('Molecule.SpriteCollisions'),
        calculateMapCollisions = require('Molecule.MapCollisions'),
        Sprite = require('Molecule.Sprite'),
        SpriteSheetFile = require('Molecule.SpriteSheetFile'),
        Molecule = require('Molecule.Molecule'),
        utils = require('Molecule.utils');

    p.init = null;

    // Objects defined inline
    // game.object.define('Something', {});
    p.inlineMolecules = {

    };

    p.updateGame = function () {
    };

    p.update = function (_exit, game) {
        var sprite;

        for (var i = 0; i < game.scene.sprites.length; i++) {
            sprite = game.scene.sprites[i];
            sprite.update();
            sprite.flipUpdate();
            if (sprite.animation !== null && _exit)
                sprite.animation.nextFrame();
        }

        if (game.map) {
            game.map.update();
        }


    };

    p.loadResources = function (_interval, game) {
        var total = game.imageFile.data.length + game.mapFile.maps.length + game.audioFile.data.length + game.spriteSheetFile.data.length;
        var total_loaded = game.imageFile.counter + game.mapFile.getCounter() + game.audioFile.counter + game.spriteSheetFile.getCounter();
        if (game.imageFile.isLoaded() && game.mapFile.isLoaded() && game.audioFile.isLoaded() && game.spriteSheetFile.isLoaded()) {
            clearInterval(_interval);
            for (var i = 0; i < game.scene.sprites.length; i++) {
                game.scene.sprites[i].getAnimation();
            }
            p.init();
            p.loop(game);
        }
        game.context.save();
        game.context.fillStyle = '#f8f8f8';
        game.context.fillRect(30, Math.round(game.height / 1.25), (game.width - (30 * 2)), 16);
        game.context.fillStyle = '#ea863a';
        game.context.fillRect(30, Math.round(game.height / 1.25), (game.width - (30 * 2)) * (total_loaded / total), 16);
        game.context.restore();
    };

    p.removeSprites = function (sprites) {
        for (var i = sprites.length - 1; i >= 0; i--) {
            if (sprites[i].kill) {
                sprites.splice(i, 1);
            }
        }
    };

    p.resetCollisionState = function (sprites) {
        var sprite;
        for (var i = 0; i < sprites.length; i++) {
            sprite = sprites[i];
            sprite.collision.sprite.id = null;
            sprite.collision.sprite.left = false;
            sprite.collision.sprite.right = false;
            sprite.collision.sprite.up = false;
            sprite.collision.sprite.down = false;

            sprite.collision.map.tile = null;
            sprite.collision.map.left = false;
            sprite.collision.map.right = false;
            sprite.collision.map.up = false;
            sprite.collision.map.down = false;

            sprite.collision.boundaries.id = null;
            sprite.collision.boundaries.left = false;
            sprite.collision.boundaries.right = false;
            sprite.collision.boundaries.up = false;
            sprite.collision.boundaries.down = false;
        }
    };

    p.updateMolecules = function (game) {
        var molecule;
        for (var i = 0; i < game.scene.molecules.length; i++) {
            molecule = game.scene.molecules[i];
            if (molecule.update) molecule.update();
        }
    };

    p.loop = function (game) {
        game.input.checkGamepad();
        p.removeSprites(game.scene.sprites);
        p.update(null, game);
        if (game.status == 1) {
            var exit = false;
            physics(game);
            p.resetCollisionState(game.scene.sprites);
            while (!exit) {
                exit = move(game.scene.sprites);
                p.checkBoundaries(game);
                calculateMapCollisions(game);
                calculateSpriteCollisions(game);
                p.updateSpriteCollisionCheck(game.scene.sprites);
                if (game.camera.type === 1) {
                    game.camera.update(game.scene.sprites);
                }
                p.update(exit, game);
                game.resetMove();
            }
        }
        p.draw(game);
        p.updateMolecules(game);
        p.updateGame();

        p.requestAnimFrame(function () {
            p.loop(game);
        });
    };

    p.updateSpriteCollisionCheck = function (sprites) {
        var sprite;
        for (var i = 0; i < sprites.length; i++) {
            sprite = sprites[i];
            if (sprite.speed.check.x && sprite.speed.check.y) {
                sprite.resetMove();
            }
        }
    };

    p.checkBoundaries = function (game) {
        var sprite;
        for (var i = 0; i < game.scene.sprites.length; i++) {
            sprite = game.scene.sprites[i];
            if (game.boundaries.x !== null && sprite.collides.boundaries) {
                if (sprite.position.x - sprite.anchor.x + sprite.frame.offset.x + sprite.move.x < game.boundaries.x) {
                    sprite.position.x = game.boundaries.x + sprite.anchor.x - sprite.frame.offset.x;
                    sprite.collision.boundaries.left = true;
                    sprite.collision.boundaries.id = 0;
                    sprite.move.x = 0;
                    sprite.speed.x = 0;
                    sprite.speed.t.x = 0;
                    if (game.physics.gravity.x < 0) {
                        sprite.speed.gravity.x = 0;
                    }
                }
                if (sprite.position.x + sprite.frame.width - sprite.anchor.x - sprite.frame.offset.x + sprite.move.x > game.boundaries.x + game.boundaries.width) {
                    sprite.position.x = game.boundaries.x + game.boundaries.width - sprite.frame.width + sprite.anchor.x + sprite.frame.offset.x;
                    sprite.collision.boundaries.right = true;
                    sprite.collision.boundaries.id = 1;
                    sprite.move.x = 0;
                    sprite.speed.x = 0;
                    sprite.speed.t.x = 0;
                    if (game.physics.gravity.x > 0) {
                        sprite.speed.gravity.x = 0;
                    }
                }
            }
            if (game.boundaries.y !== null && sprite.collides.boundaries) {
                if (sprite.position.y - sprite.anchor.y + sprite.frame.offset.y + sprite.move.y < game.boundaries.y) {
                    sprite.position.y = game.boundaries.y + sprite.anchor.y - sprite.frame.offset.y;
                    sprite.collision.boundaries.up = true;
                    sprite.collision.boundaries.id = 2;
                    sprite.move.y = 0;
                    sprite.speed.y = 0;
                    sprite.speed.t.y = 0;
                    if (game.physics.gravity.y < 0) {
                        sprite.speed.gravity.y = 0;
                    }
                }
                if (sprite.position.y + sprite.frame.height - sprite.anchor.y - sprite.frame.offset.y + sprite.move.y > game.boundaries.y + game.boundaries.height) {
                    sprite.position.y = game.boundaries.y + game.boundaries.height - sprite.frame.height + sprite.anchor.y + sprite.frame.offset.y;
                    sprite.collision.boundaries.down = true;
                    sprite.collision.boundaries.id = 3;
                    sprite.move.y = 0;
                    sprite.speed.y = 0;
                    sprite.speed.t.y = 0;
                    if (game.physics.gravity.y > 0) {
                        sprite.speed.gravity.y = 0;
                    }
                }
            }
        }
    };

    p.draw = function (game) {
        var i;

        game.context.clearRect(0, 0, game.width, game.height);
        if (game.map && game.map.visible) {
            game.map.draw(false);
        }
        for (i = 0; i < game.scene.sprites.length; i++) {
            if (game.scene.sprites[i].visible) {
                game.scene.sprites[i].draw(false);
            }
        }
        for (i = 0; i < game.scene.sprites.length; i++) {
            if (game.scene.sprites[i].visible) {
                game.scene.sprites[i].draw(true);
            }
        }
        if (game.map && game.map.visible) {
            game.map.draw(true);
        }
        for (i = 0; i < game.scene.text.length; i++) {
            if (game.scene.text[i].visible) {
                game.scene.text[i].draw();
            }
        }
    };

    p.requestAnimFrame = (function () {
        var requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
            window.setTimeout(callback, 1000 / 60)
        };
        return requestAnimFrame.bind(window);
    })();

    p.start = function (game) {
        var interval = setInterval(function () {
            p.loadResources(interval, game);
        }, 100);
    };

    p.propertiesMatch = function (obj, props) {

        var matches = true;

        if (!props) {
            return true;
        }


        for (var prop in props) {
            if (props.hasOwnProperty(prop) && obj[prop] !== props[prop]) {
                matches = false;
            }
        }

        return matches;
    };

    p.timeouts = [];

    var Game = function (options) {

        // PROPERTIES
        this.canvas = null;
        this.context = null;
        this.next = {scene: null, fade: null};
        this.status = 1;
        this.timer = {loop: 60 / 1000, previus: null, now: null, fps: 60, frame: 0};
        this.sounds = {};
        this.sprites = {};
        this.tilemaps = {};
        this.globals = options.globals || {};
        this.node = options.node;

        // OPTIONS
        this.smooth = options.smooth || false;
        this.scale = options.scale || 1;
        this.width = options.width;
        this.height = options.height;

        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('id', 'canvas');
        this.context = this.canvas.getContext('2d');

        var devicePixelRatio = window.devicePixelRatio || 1;
        var backingStoreRatio = this.context.webkitBackingStorePixelRatio ||
                            this.context.mozBackingStorePixelRatio ||
                            this.context.msBackingStorePixelRatio ||
                            this.context.oBackingStorePixelRatio ||
                            this.context.backingStorePixelRatio || 1;
        var ratio = devicePixelRatio / backingStoreRatio;

        // CANVAS

        this.canvas.width = options.width * ratio;
        this.canvas.height = options.height * ratio;
        
        this.canvas.style.width = options.width + "px";
        this.canvas.style.height = options.height + "px";
        
        this.context.scale(ratio * this.scale, ratio * this.scale);
        
        this.context.imageSmoothingEnabled = this.smooth;
        this.context.mozImageSmoothingEnabled = this.smooth;
        this.context.oImageSmoothingEnabled = this.smooth;
        this.context.webkitImageSmoothingEnabled = this.smooth;
        this.context.msImageSmoothingEnabled = this.smooth;

        // GAME COMPONENTS
        this.camera = new Camera(this);
        this.scene = new Scene(this);
        this.map = new Map(this);
        this.input = new Input(this);

        // ASSET LOADING
        this.imageFile = new ImageFile(this);
        this.audioFile = new AudioFile(this);
        this.mapFile = new MapFile(this);
        this.spriteSheetFile = new SpriteSheetFile(this);

        // GAME SETTINGS
        this.physics = {gravity: {x: 0, y: 0}, friction: {x: 0, y: 0}};
        this.boundaries = {x: null, y: null, width: null, height: null};


        // BINDERS
        utils.bindMethods(this.molecule, this);
        utils.bindMethods(this.sprite, this);
        utils.bindMethods(this.text, this);
        utils.bindMethods(this.tilemap, this);
        utils.bindMethods(this.audio, this);

        this.node ? document.getElementById(this.node).appendChild(this.canvas) : document.body.appendChild(this.canvas);

    };

    Game.prototype.audio = {
        create: function (_id) {
            if (utils.isString(_id) && this.sounds[_id]) {
                return this.sounds[_id].clone();
            } else {
                throw new Error('No audio loaded with the name ' + _id);
            }
        }
    };

    // TODO: Should not be able to add objects more than once
    Game.prototype.add = function (obj) {

        if (arguments.length === 0 || arguments.length > 1 || typeof arguments[0] === 'string') {
            throw new Error('You can only add a single sprite, Molecule Object or text, use respective game.sprite.add, game.object.add and game.text.add');
        }

        if (obj instanceof Molecule) {
            return this.molecule.add(obj);
        }

        if (obj instanceof Sprite) {
            return this.sprite.add(obj)
        }

        if (obj instanceof Text) {
            return this.text.add(obj);
        }

        if (typeof obj === 'function') { // Constructor

            return this.molecule.add(obj);
        }

        throw new Error('You did not pass sprite, Molecule Object or text');

    };

    Game.prototype.get = function () {

        return {
            sprites: this.scene.sprites,
            molecules: this.scene.molecules,
            text: this.scene.text
        };

    };

    Game.prototype.remove = function (obj) {

        if (arguments.length === 0 || arguments.length > 1) {
            throw new Error('You can only remove a single sprite, Molecule Object or text');
        }

        if (obj instanceof Molecule) {
            return this.molecule.remove(obj);
        }

        if (obj instanceof Sprite) {
            return this.sprite.remove(obj)
        }

        if (obj instanceof Text) {
            return this.text.remove(obj);
        }

        throw new Error('You did not pass sprite, Molecule Object or text');

    };

    Game.prototype.is = function (obj, type) {
        return obj._MoleculeType === type;
    };

    // Not in use, remove?
    Game.prototype.updateTimer = function () {
        this.timer.frame++;
        this.timer.now = new Date().getTime();
        if (this.timer.previus !== null)
            this.timer.loop = (this.timer.now - this.timer.previus) / 1000;
        if (this.timer.now - this.timer.previus >= 1000) {
            this.timer.previus = this.timer.now;
            this.timer.fps = this.timer.frame;
            this.timer.frame = 0;
        }
    };

    Game.prototype.play = function () {
        this.status = 1;
    };

    Game.prototype.stop = function () {
        this.status = 0;
    };

    Game.prototype.resetMove = function () {

        for (var i = 0; i < this.scene.sprites.length; i++) {
            this.scene.sprites[i].resetMove();
        }
        if (this.map) {
            this.map.resetScroll();
        }

        p.update(null, this);

    };

    Game.prototype.cameraUpdate = function (_exit) {
        for (var i = 0; i < this.scene.sprites.length; i++) {
            this.scene.sprites[i].update();
            this.scene.sprites[i].flipUpdate();
            if (this.scene.sprites[i].animation !== null && _exit)
                this.scene.sprites[i].animation.nextFrame();
        }
        if (this.map !== null)
            this.map.update();
    };

    Game.prototype.start = function () {
        p.start(this);
    };

    Game.prototype.init = function (initializeModules, callback) {
        var self = this,
            object;
        p.init = function () {
            initializeModules();

            // If callback is a string, require a module
            if (utils.isString(callback)) {
                object = require(callback);
            } else {

                // Callback might return an object (using ready method)
                object = callback.call(self.globals, self, require);
            }

            // If we have a Molecule Object constructor, add it to the game
            if (typeof object === 'function') {
                self.add(object);
            }
        }
    };

    Game.prototype.update = function (callback) {
        p.updateGame = callback.bind(this.globals, this, require);
    };

    // All methods are bound to game object
    Game.prototype.molecule = {
        define: function () {
            var name = arguments.length > 1 ? arguments[0] : null,
                options = arguments.length === 1 ? arguments[0] : arguments[1],
                Obj = Molecule.extend.call(Molecule, options);


            // No name means it is coming from a module
            if (!name) {
                return Obj;
            }

            if (!p.inlineMolecules[name]) {
                p.inlineMolecules[name] = Obj;
            } else {
                throw new Error(name + ' already exists as an object');
            }

            return Obj;

        },
        create: function () {
            var name = arguments[0],
                options = arguments[1],
                Obj,
                obj;


            // If passing a constructor
            if (typeof arguments[0] === 'function') {
                return new arguments[0](arguments[1]);
            }

            if (p.inlineMolecules[name]) {
                Obj = p.inlineMolecules[name];
            } else {
                Obj = require(name);
            }

            obj = new Obj(options);
            obj._MoleculeType = name;
            return obj;
        },
        add: function () {

            var obj;

            if (typeof arguments[0] === 'string') {
                obj = this.molecule.create(arguments[0], arguments[1]);
            } else if (utils.isMolecule(arguments[0])) {
                obj = arguments[0];
            } else if (typeof arguments[0] === 'function') { // constructor

                obj = this.molecule.create(arguments[0], arguments[1]);
            } else {
                throw new Error('Wrong parameters, need a string or Molecule Object');
            }

            this.scene.molecules.push(obj);

            if (obj.text) {
                for (var text in obj.text) {
                    if (obj.text.hasOwnProperty(text)) {
                        this.scene.text.push(obj.text[text]);
                    }
                }
            }

            if (obj.sprite) {
                this.scene.sprites.push(obj.sprite);
            } else if (obj.sprites) {
                for (var sprite in obj.sprites) {
                    if (obj.sprites.hasOwnProperty(sprite) && obj.sprites[sprite]) {
                        this.scene.sprites.push(obj.sprites[sprite]);
                    }
                }
            }

            return obj;
        },
        get: function () {

            var options;

            if (!arguments.length) {
                return this.scene.molecules;
            }

            if (typeof arguments[0] === 'string') {

                options = arguments[1] || {};
                options._MoleculeType = arguments[0];

                return utils.find(this.scene.molecules, options);

            } else {
                return utils.find(this.scene.molecules, arguments[0]);
            }

        },
        remove: function () {
            var moleculesToRemove = arguments[0] instanceof Molecule ? [arguments[0]] : this.molecule.get.apply(this, arguments),
                game = this;
            moleculesToRemove.forEach(function (obj) {
                obj.removeListeners();
                game.scene.molecules.splice(game.scene.molecules.indexOf(obj), 1);
                if (obj.sprite) {
                    game.scene.sprites.splice(game.scene.sprites.indexOf(obj.sprite), 1);
                } else if (obj.sprites) {
                    for (var sprite in obj.sprites) {
                        if (obj.sprites.hasOwnProperty(sprite) && obj.sprites[sprite]) {
                            game.scene.sprites.splice(game.scene.sprites.indexOf(obj.sprites[sprite]), 1);
                        }
                    }
                }
                if (obj.text) {
                    for (var text in obj.text) {
                        if (obj.text.hasOwnProperty(text)) {
                            game.scene.text.splice(game.scene.text.indexOf(obj.text[text]), 1);
                        }
                    }
                }
                if (obj.audio) {
                    for (var audio in obj.audio) {
                        if (obj.audio.hasOwnProperty(audio)) {
                            obj.audio[audio].stop();
                        }
                    }
                }
            });
        }
    };

    // All methods are bound to game object
    Game.prototype.sprite = {

        create: function (_id) {
            var loadedSprite,
                sprite;

            if (this.sprites[_id]) {
                loadedSprite = this.sprites[_id];
                sprite = loadedSprite.clone();
            } else {
                throw new Error('Sprite ' + _id + ' does not exist. Has it been loaded?');
            }

            return sprite;
        },
        add: function () {

            var sprite;

            if (typeof arguments[0] === 'string') {
                sprite = this.sprite.create(arguments[0]);
            } else if (utils.isSprite(arguments[0])) {
                sprite = arguments[0];
            } else {
                throw new Error('Wrong parameters, need a string or sprite');
            }

            this.scene.sprites.push(sprite);

            return sprite;
        },
        get: function () {

            var options;

            if (!arguments.length) {
                return this.scene.sprites;
            }

            if (typeof arguments[0] === 'string') {

                options = {
                    name: arguments[0]
                };

                return utils.find(this.scene.sprites, options);

            } else {
                return utils.find(this.scene.sprites, arguments[0]);
            }

        },
        remove: function () {
            var spritesToRemove = arguments[0] instanceof Sprite ? [arguments[0]] : this.sprite.get.apply(this, arguments),
                game = this;
            spritesToRemove.forEach(function (sprite) {
                game.scene.sprites.splice(game.scene.sprites.indexOf(sprite), 1);
            });
        }
    };

    // All methods are bound to game object
    Game.prototype.text = {

        create: function (options) {
            var t = new Text(options, this);
            return t;
        },
        add: function () {

            var text;

            if (utils.isText(arguments[0])) {
                text = arguments[0];
            } else if (utils.isObject(arguments[0])) {
                text = this.text.create(arguments[0]);
            } else {
                throw new Error('Wrong parameters, need a new object or existing Text object');
            }

            this.scene.text.push(text);

            return text;
        },
        get: function () {

            if (!arguments.length) {
                return this.scene.text;
            }

            return utils.find(this.scene.text, arguments[0]);

        },
        remove: function () {
            var textToRemove = arguments[0] instanceof Text ? [arguments[0]] : this.text.get.apply(this, arguments),
                game = this;
            textToRemove.forEach(function (text) {
                game.scene.text.splice(game.scene.text.indexOf(text), 1);
            });
        }

    };

    // All methods are bound to game object
    Game.prototype.tilemap = {

        set: function () {
            var tilemap = this.tilemaps[arguments[0]] || arguments[0],
                self = this;
            if (tilemap && utils.isTilemap(tilemap)) {
                if (this.map && this.map.molecules.length) {
                    this.map.molecules.forEach(function (object) {
                        self.remove(object)
                    });
                }
                this.mapFile.set(tilemap);
            } else {
                throw new Error('There is no tilemap with the name ' + arguments[0] + ' loaded');
            }
        },
        get: function () {
            return this.map;
        },
        remove: function () {
            var self = this;
            if (this.map && this.map.molecules.length) {
                this.map.molecules.forEach(function (object) {
                    self.remove(object)
                });
            }
            this.map = null;
        }

    };

    Game.prototype.trigger = function () {

        var type = arguments[0],
            args = Array.prototype.slice.call(arguments, 0),
            event;

        args.splice(0, 1);

        if (!document.createEvent) {
            event = new CustomEvent(type, { detail: args });
        } else {
            event = document.createEvent('CustomEvent');
            event.initCustomEvent(type, true, true, args);
        }

        window.dispatchEvent(event);


    };

    Game.prototype.timeout = function (func, ms, context) {

        var funcString = func.toString();
        if (p.timeouts.indexOf(funcString) === -1) {
            setTimeout(function () {
                p.timeouts.splice(p.timeouts.indexOf(funcString), 1);
                func.call(context);
            }, ms);
            p.timeouts.push(funcString);
        }

    };


//    Game.prototype.cancelRequestAnimFrame = (function () {
//        return window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || clearTimeout
//    })();

    return Game;

});
Molecule.module('Molecule.ImageFile', function (require, p) {

    var Sprite = require('Molecule.Sprite');

	function ImageFile(_game) {
		this.game = _game;
		this.name = [];
		this.data = [];
		this.counter = 0;
	}

	ImageFile.prototype.preload = function(_imageSrc) {
		var _name = _imageSrc.substring(0, _imageSrc.length - 4);
		if(!this.getImageDataByName(_name)) {
			var self = this;
			var _image = new Image();
			_image.addEventListener('load', function(){self.counter++});
			_image.src = _imageSrc;
			this.name.push(_name);
			this.data.push(_image);
		}

		return this.getImageDataByName(_name);
	};

    // Load up a new sprite
    // TODO: Make it just load up the new image, the sprites are created later
	ImageFile.prototype.load = function(_id, _imageSrc, _width, _height) {
		var s = new Sprite(_id, _imageSrc, _width, _height);
		s.game = this.game;
        s._MoleculeType = _id;
		s.image = this.preload(_imageSrc);
		if(this.isLoaded())
			s.getAnimation();
        this.game.sprites[_id] = s;
		return s;
	};
	
	ImageFile.prototype.loadSpriteSheet = function(_id, _imageSrc, _width, _height) {
		this.name.push(_id);
		this.data.push(_imageSrc);
		var s = new Sprite(_id, '', _width, _height);
		s.game = this.game;
        s._MoleculeType = _id;
		s.image = _imageSrc;
		s.getAnimation();
        this.game.sprites[_id] = s;
        this.counter++;
		return s;
	};

	ImageFile.prototype.reset = function() {
		this.game.scene.sprites = [];
	};
	
	ImageFile.prototype.isLoaded = function() {
		return (this.counter === this.data.length);
	};

	ImageFile.prototype.getImageDataByName = function(_imageName) {
		return this.data[this.name.indexOf(_imageName)];
	};

    ImageFile.prototype.getImageDataBySrc = function(_imageSrc) {
        _imageSrc = _imageSrc.substring(0, _imageSrc.length - 4);
        return this.data[this.name.indexOf(_imageSrc)];
    };

	return ImageFile;

});
Molecule.module('Molecule.Input', function (require, p) {

    function Input(_game) {
        var self = this;

        this.game = _game;
        this.key = {SPACE: 0, LEFT_ARROW: 0, UP_ARROW: 0, RIGHT_ARROW: 0, DOWN_ARROW: 0, A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0, I: 0, J: 0, K: 0, L: 0, M: 0, N: 0, O: 0, P: 0, Q: 0, R: 0, S: 0, T: 0, U: 0, V: 0, W: 0, X: 0, Y: 0, Z: 0};
        this.mouse = {x: 0, y: 0, BUTTON_LEFT: 0, BUTTON_MIDDLE: 0, BUTTON_RIGHT: 0};
        this.touch = [];
        this.gamepad = [];
        
        this.gamepadEnabled = false;
        
        this.keydown = function(_e){self.onkeydown(_e)};
        this.keyup = function(_e){self.onkeyup(_e)};
        
        this.mousedown = function(_e){self.onmousedown(_e)};
        this.mousemove = function(_e){self.onmousemove(_e)};
        this.mouseup = function(_e){self.onmouseup(_e)};
        
        this.touchstart = function(_e){self.ontouchstart(_e)};
        this.touchmove = function(_e){self.ontouchmove(_e)};
        this.touchend = function(_e){self.ontouchend(_e)};
        this.touchcancel = function(_e){self.ontouchcancel(_e)};
    }

    // Method to init 'keyboard', 'mouse' or 'touch' depending of type
    Input.prototype.enable = function(_type) {

        if(_type === 'keyboard') {
            document.addEventListener('keydown', this.keydown, true);
            document.addEventListener('keyup', this.keyup, true);
        }
        if(_type === 'mouse') {
            this.game.canvas.addEventListener('mousedown', this.mousedown, true);
            this.game.canvas.addEventListener('mousemove', this.mousemove, true);
            this.game.canvas.addEventListener('mouseup', this.mouseup, true);
        }
        if(_type === 'touch') {
            this.game.canvas.addEventListener('MSPointerDown', this.touchstart, true);
            this.game.canvas.addEventListener('MSPointerMove', this.touchmove, true);
            this.game.canvas.addEventListener('MSPointerUp', this.touchend, true);
            this.game.canvas.addEventListener('MSPointerCancel', this.touchcancel, true);
            
            this.game.canvas.addEventListener('touchstart', this.touchstart, true);
            this.game.canvas.addEventListener('touchmove', this.touchmove, true);
            this.game.canvas.addEventListener('touchend', this.touchend, true);
            this.game.canvas.addEventListener('touchcancel', this.touchcancel, true);
        }
        if(_type === 'gamepad') {
            this.gamepadEnabled = true;
        }
    };

    // Method to remove 'keyboard', 'mouse' or 'touch' depending of type
    Input.prototype.disable = function(_type) {

        if(_type === 'keyboard') {
            document.removeEventListener('keydown', this.keydown, true);
            document.removeEventListener('keyup', this.keyup, true);
        }
        if(_type === 'mouse') {
            this.game.canvas.removeEventListener('mousedown', this.mousedown, true);
            this.game.canvas.removeEventListener('mousemove', this.mousemove, true);
            this.game.canvas.removeEventListener('mouseup', this.mouseup, true);
        }
        if(_type === 'touch') {
            this.game.canvas.removeEventListener('MSPointerDown', this.touchstart, true);
            this.game.canvas.removeEventListener('MSPointerMove', this.touchmove, true);
            this.game.canvas.removeEventListener('MSPointerUp', this.touchend, true);
            this.game.canvas.removeEventListener('MSPointerCancel', this.touchcancel, true);
            
            this.game.canvas.removeEventListener('touchstart', this.touchstart, true);
            this.game.canvas.removeEventListener('touchmove', this.touchmove, true);
            this.game.canvas.removeEventListener('touchend', this.touchend, true);
            this.game.canvas.removeEventListener('touchcancel', this.touchcancel, true);
        }
        if(_type === 'gamepad') {
            this.gamepadEnabled = false;
        }
    };

    Input.prototype.checkGamepad = function() {
        var i;
        this.gamepad = [];
        if(this.gamepadEnabled && navigator.webkitGetGamepads) {
            for(i = 0; i < navigator.webkitGetGamepads().length; i++) {
                if(navigator.webkitGetGamepads()[i] !== undefined) {
                    this.gamepad.push(navigator.webkitGetGamepads()[i]);
                }
            }
        }
    };

    // Method 'onkeydown' for 'keyboard' type
    Input.prototype.onkeydown = function(_e) {
        _e.preventDefault();
        switch(_e.keyCode) {
            case 32:
                this.key.SPACE = 1;
            break;
            case 37:
                this.key.LEFT_ARROW = 1;
            break;
            case 38:
                this.key.UP_ARROW = 1;
            break;
            case 39:
                this.key.RIGHT_ARROW = 1;
            break;
            case 40:
                this.key.DOWN_ARROW = 1;
            break;
            case 65:
                this.key.A = 1;
            break;
            case 66:
                this.key.B = 1;
            break;
            case 67:
                this.key.C = 1;
            break;
            case 68:
                this.key.D = 1;
            break;
            case 69:
                this.key.E = 1;
            break;
            case 70:
                this.key.F = 1;
            break;
            case 71:
                this.key.G = 1;
            break;
            case 72:
                this.key.H = 1;
            break;
            case 73:
                this.key.I = 1;
            break;
            case 74:
                this.key.J = 1;
            break;
            case 75:
                this.key.K = 1;
            break;
            case 76:
                this.key.L = 1;
            break;
            case 77:
                this.key.M = 1;
            break;
            case 78:
                this.key.N = 1;
            break;
            case 79:
                this.key.O = 1;
            break;
            case 80:
                this.key.P = 1;
            break;
            case 81:
                this.key.Q = 1;
            break;
            case 82:
                this.key.R = 1;
            break;
            case 83:
                this.key.S = 1;
            break;
            case 84:
                this.key.T = 1;
            break;
            case 85:
                this.key.U = 1;
            break;
            case 86:
                this.key.V = 1;
            break;
            case 87:
                this.key.W = 1;
            break;
            case 88:
                this.key.X = 1;
            break;
            case 89:
                this.key.Y = 1;
            break;
            case 90:
                this.key.Z = 1;
            break;
        }
    };

    // Method 'onkeyup' for 'keyboard' type
    Input.prototype.onkeyup = function(_e) {
        _e.preventDefault();
            switch(_e.keyCode) {
            case 32:
                this.key.SPACE = 0;
            break;
            case 37:
                this.key.LEFT_ARROW = 0;
            break;
            case 38:
                this.key.UP_ARROW = 0;
            break;
            case 39:
                this.key.RIGHT_ARROW = 0;
            break;
            case 40:
                this.key.DOWN_ARROW = 0;
            break;
            case 65:
                this.key.A = 0;
            break;
            case 66:
                this.key.B = 0;
            break;
            case 67:
                this.key.C = 0;
            break;
            case 68:
                this.key.D = 0;
            break;
            case 69:
                this.key.E = 0;
            break;
            case 70:
                this.key.F = 0;
            break;
            case 71:
                this.key.G = 0;
            break;
            case 72:
                this.key.H = 0;
            break;
            case 73:
                this.key.I = 0;
            break;
            case 74:
                this.key.J = 0;
            break;
            case 75:
                this.key.K = 0;
            break;
            case 76:
                this.key.L = 0;
            break;
            case 77:
                this.key.M = 0;
            break;
            case 78:
                this.key.N = 0;
            break;
            case 79:
                this.key.O = 0;
            break;
            case 80:
                this.key.P = 0;
            break;
            case 81:
                this.key.Q = 0;
            break;
            case 82:
                this.key.R = 0;
            break;
            case 83:
                this.key.S = 0;
            break;
            case 84:
                this.key.T = 0;
            break;
            case 85:
                this.key.U = 0;
            break;
            case 86:
                this.key.V = 0;
            break;
            case 87:
                this.key.W = 0;
            break;
            case 88:
                this.key.X = 0;
            break;
            case 89:
                this.key.Y = 0;
            break;
            case 90:
                this.key.Z = 0;
            break;
        }
    };

    // Method 'onmousedown' for 'mouse' type
    Input.prototype.onmousedown = function(_e) {
        switch(_e.button) {
            case 0:
                this.mouse.BUTTON_LEFT = 1;
            break;
            case 1:
                this.mouse.BUTTON_MIDDLE = 1;
            break;
            case 2:
                this.mouse.BUTTON_RIGHT = 1;
            break;
        }
        this.mousePosition(_e);
    };

    // Method 'onmousemove' for 'mouse' type
    Input.prototype.onmousemove = function(_e) {
        this.mousePosition(_e);
    };

    // Method 'onmouseup' for 'mouse' type
    Input.prototype.onmouseup = function(_e) {
        switch(_e.button) {
            case 0:
                this.mouse.BUTTON_LEFT = 0;
            break;
            case 1:
                this.mouse.BUTTON_MIDDLE = 0;
            break;
            case 2:
                this.mouse.BUTTON_RIGHT = 0;
            break;
        }
        this.mousePosition(_e);
    };

    Input.prototype.mousePosition = function(_e) {
        this.mouse.x = (_e.pageX  - this.game.canvas.offsetLeft);
        this.mouse.y = (_e.pageY - this.game.canvas.offsetTop);
    };

    // Method 'ontouchstart' for 'touch' type
    Input.prototype.ontouchstart = function(_e) {
        _e.preventDefault();
        this.normalizeTouches(_e);
    };

    // Method 'ontouchmove' for 'touch' type
    Input.prototype.ontouchmove = function(_e) {
        _e.preventDefault();
        this.normalizeTouches(_e);
    };

    // Method 'ontouchend' for 'touch' type
    Input.prototype.ontouchend = function(_e) {
        _e.preventDefault();
        this.normalizeTouches(_e);
    };

    // Method 'ontouchcancel' for 'touch' type
    Input.prototype.ontouchcancel = function(_e) {
        _e.preventDefault();
        this.touch = [];
    };

    // Method to normalize touches depending of canvas size and position
    Input.prototype.normalizeTouches = function(_e) {
        this.touch = [];
        if(_e.touches) {
            for(var i = 0; i < _e.touches.length; i++) {
                this.touch.push({x: (_e.touches[i].pageX - this.game.canvas.offsetLeft), y: (_e.touches[i].pageY - this.game.canvas.offsetTop)});
            }
        } else {
            if(_e !== undefined) {
                this.touch.push({x: (_e.pageX - this.game.canvas.offsetLeft), y: (_e.pageY - this.game.canvas.offsetTop)});
            }
        }
    };

    return Input;

});
Molecule.module('Molecule.Map', function (require, p) {

    var Sprite = require('Molecule.Sprite');

    function Map(_game) {
        this.game = _game;
        this.canvas = [];
        this.context = [];
        this.name = null;
        this.visible = true;
        this.sprites = [];
        this.molecules = [];
        this.image = [];
        this.path = '';
        this.response = null;
        this.json = null;
        this.loaded = false;
    }

    Map.prototype.load = function (_id, _name) {
        this.id = _id;
        this.name = _name;
        var t = _name.split('/');
        for (var i = 0; i < t.length - 1; i++) {
            this.path += t[i] + '/';
        }
        this.ajaxJsonReq(this.name);
        this.game.tilemaps[_id] = this;
    };

    Map.prototype.ajaxJsonReq = function (_name) {
        var self = this;
        var ajaxReq = new XMLHttpRequest();
        ajaxReq.open("GET", _name, true);
        ajaxReq.setRequestHeader("Content-type", "application/json");
        ajaxReq.addEventListener('readystatechange', function () {
            self.jsonLoaded(ajaxReq)
        });
        ajaxReq.send();
    };

    Map.prototype.jsonLoaded = function (_ajaxReq) {
        if (_ajaxReq.readyState == 4 && _ajaxReq.status == 200) {
            this.response = _ajaxReq.responseText;
            this.json = JSON.parse(this.response);
            this.addProperties();
            this.loadImages();

        }
    };

    Map.prototype.reset = function () {
        this.json = null;
        this.json = JSON.parse(this.response);
        this.addProperties();
        this.canvas = [];
        this.context = [];
        this.createContext();
    };

    Map.prototype.loadImages = function () {
        var self = this;
        for (var i = 0; i < this.json.tilesets.length; i++) {
            // Can also load as referenceable sprites
//            Molecule.sprite(this.json.tilesets[i].name, this.json.tilesets[i].image);
//			var image = this.game.imageFile.preload(this.path + this.json.tilesets[i].image);
//            var image = this.game.sprite(this.json.tilesets[i].name).image;
            var image = this.game.imageFile.preload(this.path + this.json.tilesets[i].image);
            this.image.push(image);
        }
        var interval = setInterval(function () {
            self.loadResources(interval)
        }, 100);
    };

    Map.prototype.loadResources = function (_interval) {
        if (this.game.imageFile.isLoaded()) {
            clearInterval(_interval);

            this.loaded = true;
        }
    };

    Map.prototype.addProperties = function () {
        var scrollable,
            collidable,
            infiniteX,
            infiniteY,
            overlap,
            speed,
            main,
            i;

        for (i = 0; i < this.json.layers.length; i++) {
            if (this.json.layers[i].type === 'tilelayer') {
                if (this.json.layers[i].properties !== undefined) {
                    main = (this.json.layers[i].properties['main'] === 'true') || false;
                    scrollable = !(this.json.layers[i].properties['scrollable'] === 'false') || true;
                    collidable = (this.json.layers[i].properties['collidable'] === 'true') || false;
                    overlap = (this.json.layers[i].properties['overlap'] === 'true') || false;
                    speed = this.json.layers[i].properties['scroll.speed'] || 1;
                    speed = parseFloat(speed).toFixed(3);
                    infiniteX = (this.json.layers[i].properties['scroll.infinite.x'] === 'true') || false;
                    infiniteY = (this.json.layers[i].properties['scroll.infinite.y'] === 'true') || false;
                    this.json.layers[i].properties = {scroll: {x: 0, y: 0, speed: speed, infinite: {x: infiniteX, y: infiniteY}}, main: main, scrollable: scrollable, collidable: collidable, overlap: overlap, infinite: {x: infiniteX, y: infiniteY}};
                } else {
                    this.json.layers[i].properties = {scroll: {x: 0, y: 0, speed: 1, infinite: {x: false, y: false}}, main: false, scrollable: true, collidable: false, overlap: false, infinite: {x: false, y: false}};
                }
            }
        }
    };

    Map.prototype.createContext = function () {
        var frameWidth,
            frameHeight,
            tileset,
            sprite,
            data,
            i,
            j;

        for (i = 0; i < this.json.layers.length; i++) {
            if (this.json.layers[i].type === 'tilelayer') {
                this.canvas.push(document.createElement('canvas'));
                this.context.push(this.canvas[i].getContext('2d'));
                this.canvas[i].width = (this.json.layers[i].width * this.json.tilewidth);
                this.canvas[i].height = (this.json.layers[i].height * this.json.tileheight);
                for (j = 0; j < this.json.layers[i].data.length; j++) {
                    data = this.json.layers[i].data[j];
                    if (data > 0) {
                        tileset = this.getTileset(data);
                        this.context[i].save();
                        this.context[i].globalAlpha = this.json.layers[i].opacity;
                        this.context[i].drawImage(
                            this.image[tileset],
                            Math.floor((data - this.json.tilesets[tileset].firstgid) % (this.json.tilesets[tileset].imagewidth / this.json.tilesets[tileset].tilewidth)) * this.json.tilesets[tileset].tilewidth,
                            Math.floor((data - this.json.tilesets[tileset].firstgid) / (this.json.tilesets[tileset].imagewidth / this.json.tilesets[tileset].tilewidth)) * this.json.tilesets[tileset].tileheight,
                            this.json.tilesets[tileset].tilewidth,
                            this.json.tilesets[tileset].tileheight,
                            (Math.floor(j % this.json.layers[i].width) * this.json.tilesets[tileset].tilewidth),
                            (Math.floor(j / this.json.layers[i].width) * this.json.tilesets[tileset].tileheight),
                            this.json.tilesets[tileset].tilewidth,
                            this.json.tilesets[tileset].tileheight);
                        this.context[i].restore();
                    }
                }
            } else if (this.json.layers[i].type === 'objectgroup') {

                for (j = 0; j < this.json.layers[i].objects.length; j++) {
                    data = this.json.layers[i].objects[j].gid;
                    tileset = this.getTileset(data);
                    frameWidth = this.json.tilesets[tileset].tilewidth;
                    frameHeight = this.json.tilesets[tileset].tileheight;
                    sprite = new Sprite(this.json.layers[i].objects[j].name || this.json.tilesets[tileset].name, this.json.tilesets[tileset].image, frameWidth, frameHeight);
                    sprite.game = this.game;
                    sprite.image = this.game.imageFile.getImageDataBySrc(this.path + this.json.tilesets[tileset].image);
                    this.game.mapFile.copyMapProperties(i, j, sprite, this.path);
                    sprite.getAnimation();
                    var object = this.game.molecule.add(this.json.layers[i].name, {
                        sprite: sprite
                    });
                    this.molecules.push(object);
                }

            }
        }
    };

    Map.prototype.getTileset = function (_data) {
        for (var i = 0; i < this.json.tilesets.length; i++) {
            if (this.json.tilesets[i].firstgid > _data) {
                return i - 1;
            } else if (this.json.tilesets.length === 1 || this.json.tilesets.length - 1 === i || this.json.tilesets[i].firstgid === _data) {
                return i;
            }
        }
    };

    Map.prototype.getMainLayer = function () {
        if (this.json !== null) {
            for (var i = 0; i < this.json.layers.length; i++) {
                if (this.game.map.json.layers[i].type === 'tilelayer' && this.json.layers[i].properties.main) {
                    return i;
                }
            }
        }
        return -1;
    };

    Map.prototype.getLayerIdByName = function (_name) {
        for (var i = 0; i < this.json.layers.length; i++) {
            if (this.json.layers[i].name === _name) {
                return i;
            }
        }
        return -1;
    };

    Map.prototype.getTilesetIdByName = function (_name) {
        for (var i = 0; i < this.json.tilesets.length; i++) {
            if (this.json.tilesets[i].name === _name) {
                return i;
            }
        }
        return -1;
    };

    Map.prototype.getTile = function (_name, _x, _y, _width, _height) {
        _width = _width || 0;
        _height = _height || 0;
        var layer = this.getLayerIdByName(_name);
        if (this.json.layers[layer].type === 'tilelayer') {
            if (this.json.layers[layer].properties.scroll.infinite.x && _x >= this.canvas[layer].width / 2) {
                _x = Math.floor(_x % this.canvas[layer].width);
            }
            if (this.json.layers[layer].properties.scroll.infinite.y && _y >= this.canvas[layer].height / 2) {
                _y = Math.floor(_y % this.canvas[layer].height);
            }
            var tile = (Math.floor(_y / this.json.tileheight) * this.json.layers[layer].width) + Math.floor(_x / this.json.tilewidth);
            if ((tile >= this.json.layers[layer].data.length || tile < 0) || (_x > this.json.layers[layer].width * this.json.tilewidth || _x + _width < 0) || (_y > this.json.layers[layer].height * this.json.tileheight || _y + _height < 0)) {
                return null;
            } else {
                return tile;
            }
        } else {
            return null;
        }
    };

    Map.prototype.getTileData = function (_name, _x, _y) {
        var layer = this.getLayerIdByName(_name);
        var tile = this.getTile(_name, _x, _y);
        if (tile === null) {
            return null;
        } else {
            return this.json.layers[layer].data[tile];
        }
    };

    Map.prototype.clearTile = function (_name, _x, _y) {
        var id = this.getLayerIdByName(_name);
        var layer = this.json.layers[id];
        var tile = this.getTile(_name, _x, _y);
        if (tile !== null) {
            layer.data[tile] = 0;
            this.context[id].save();
            this.context[id].globalAlpha = layer.opacity;
            this.context[id].clearRect(Math.floor(tile % this.json.layers[id].width) * this.json.tilewidth, Math.floor(tile / this.json.layers[id].width) * this.json.tilewidth, this.json.tilewidth, this.json.tileheight);
            this.context[id].restore();
        }
    };

    Map.prototype.setTile = function (_name, _x, _y, _tileset, _tile) {
        var id = this.getLayerIdByName(_name);
        var layer = this.json.layers[id];
        var tile = this.getTile(_name, _x, _y);
        var tileset = this.getTilesetIdByName(_tileset);
        var data = _tile + this.json.tilesets[tileset].firstgid;
        if (tile !== null) {
            layer.data[tile] = data;
            this.context[id].save();
            this.context[id].globalAlpha = this.json.layers[id].opacity;
            this.context[id].drawImage(this.image[tileset], Math.floor((data - this.json.tilesets[tileset].firstgid) % this.json.layers[id].width) * this.json.tilesets[tileset].tilewidth, Math.floor((data - this.json.tilesets[tileset].firstgid) / this.json.layers[id].width) * this.json.tilesets[tileset].tilewidth, this.json.tilesets[tileset].tilewidth, this.json.tilesets[tileset].tileheight, Math.floor(tile % this.json.layers[id].width) * this.json.tilewidth, Math.floor(tile / this.json.layers[id].width) * this.json.tilewidth, this.json.tilewidth, this.json.tileheight);
            this.context[id].restore();
        }
    };

    Map.prototype.update = function () {
        if (this.json !== null) {
            for (var i = 0; i < this.json.layers.length; i++) {
                if (this.json.layers[i].type === 'tilelayer') {
                    this.json.layers[i].x += this.json.layers[i].properties.scroll.x;
                    this.json.layers[i].y += this.json.layers[i].properties.scroll.y;
                    this.json.layers[i].x = parseFloat(this.json.layers[i].x.toFixed(3));
                    this.json.layers[i].y = parseFloat(this.json.layers[i].y.toFixed(3));

                    if (this.json.layers[i].properties.scroll.infinite.x && Math.round(this.json.layers[i].x) <= -this.canvas[i].width && this.json.layers[i].properties.scroll.x < 0) {
                        this.json.layers[i].x = 0;
                    } else if (this.json.layers[i].properties.scroll.infinite.x && Math.round(this.json.layers[i].x) >= 0 && this.json.layers[i].properties.scroll.x > 0) {
                        this.json.layers[i].x = -this.canvas[i].width + 1;
                    }
                    if (this.json.layers[i].properties.scroll.infinite.y && Math.round(this.json.layers[i].y) <= -this.canvas[i].height && this.json.layers[i].properties.scroll.y < 0) {
                        this.json.layers[i].y = 0;
                    } else if (this.json.layers[i].properties.scroll.infinite.y && Math.round(this.json.layers[i].y) >= 0 && this.json.layers[i].properties.scroll.y > 0) {
                        this.json.layers[i].y = -this.canvas[i].height + 1;
                    }

                }
            }
        }
    };

    Map.prototype.resetScroll = function () {
        if (this.json !== null) {
            for (var i = 0; i < this.json.layers.length; i++) {
                if (this.json.layers[i].type === 'tilelayer') {
                    this.json.layers[i].properties.scroll.x = 0;
                    this.json.layers[i].properties.scroll.y = 0;
                }
            }
        }
    };

    Map.prototype.resetPosition = function () {
        for (var i = 0; i < this.json.layers.length; i++) {
            if (this.json.layers[i].type === 'tilelayer') {
                this.json.layers[i].x = 0;
                this.json.layers[i].y = 0;
            }
        }
    };

    Map.prototype.draw = function (_overlap) {
        for (var i = 0; i < this.canvas.length; i++) {
            if (this.json.layers[i].type === 'tilelayer' && this.json.layers[i].visible && this.json.layers[i].properties.overlap === _overlap) {
                var w = this.game.width > this.canvas[i].width ? this.canvas[i].width : this.game.width;
                var h = this.game.height > this.canvas[i].height ? this.canvas[i].height : this.game.height;
                var w1x = 0;
                var w1y = 0;
                if (this.json.layers[i].properties.scroll.infinite.x && Math.floor(-this.json.layers[i].x) + w > this.canvas[i].width) {
                    w1x = Math.floor(-this.json.layers[i].x) + w - this.canvas[i].width;
                }
                if (this.json.layers[i].properties.scroll.infinite.y && Math.floor(-this.json.layers[i].y) + h > this.canvas[i].height) {
                    w1y = Math.floor(-this.json.layers[i].y) + h - this.canvas[i].height;
                }
                this.game.context.save();
                this.game.context.drawImage(this.canvas[i], Math.floor(-this.json.layers[i].x), Math.floor(-this.json.layers[i].y), w - w1x, h - w1y, 0, 0, w - w1x, h - w1y);
                this.game.context.restore();
                if (this.json.layers[i].properties.scroll.infinite.x) {
                    if (w1x > 0) {
                        this.game.context.save();
                        this.game.context.drawImage(this.canvas[i], 0, 0, w1x, h, w - w1x, 0, w1x, h);
                        this.game.context.restore();
                    }
                }
                if (this.json.layers[i].properties.scroll.infinite.x && this.json.layers[i].properties.scroll.infinite.y) {
                    if (w1x > 0 && w1y > 0) {
                        this.game.context.save();
                        this.game.context.drawImage(this.canvas[i], 0, Math.floor(-this.json.layers[i].y), w1x, h - w1y, w - w1x, 0, w1x, h - w1y);
                        this.game.context.restore();
                    }
                }
                if (this.json.layers[i].properties.scroll.infinite.y) {
                    if (w1y > 0) {
                        this.game.context.save();
                        this.game.context.drawImage(this.canvas[i], 0, 0, w, w1y, 0, h - w1y, w, w1y);
                        this.game.context.restore();
                    }
                }
                if (this.json.layers[i].properties.scroll.infinite.y && this.json.layers[i].properties.scroll.infinite.x) {
                    if (w1y > 0 && w1x > 0) {
                        this.game.context.save();
                        this.game.context.drawImage(this.canvas[i], Math.floor(-this.json.layers[i].x), 0, w - w1x, w1y, 0, h - w1y, w - w1x, w1y);
                        this.game.context.restore();
                    }
                }
                if (this.json.layers[i].properties.scroll.infinite.x && this.json.layers[i].properties.scroll.infinite.y) {
                    if (w1x > 0 && w1y > 0) {
                        this.game.context.save();
                        this.game.context.drawImage(this.canvas[i], 0, 0, w1x, w1y, w - w1x, h - w1y, w1x, w1y);
                        this.game.context.restore();
                    }
                }
            }
        }
    };

    return Map;

});
Molecule.module('Molecule.MapCollisions', function (require, p) {

    p.spriteCollidesWithLayer = function (layer, sprite) {
        return layer.type === 'tilelayer' && layer.properties.collidable && sprite.collides.map;
    };

    p.getHeight = function (tileHeight, sprite) {
        return Math.ceil((sprite.frame.height - sprite.frame.offset.y - sprite.frame.offset.y) / tileHeight);
    };

    p.getWidth = function (tileWidth, sprite) {
        return Math.ceil((sprite.frame.width - sprite.frame.offset.x - sprite.frame.offset.x) / tileWidth);
    };

    p.getPosX = function (layer, sprite, tileWidth) {
        return sprite.position.x - sprite.anchor.x + sprite.move.x + Math.abs(layer.x) + tileWidth;
    };

    p.getPosY = function (layer, sprite, tileHeight) {
        return sprite.position.y - sprite.anchor.y + sprite.move.y + Math.abs(layer.y) + tileHeight;
    };

    p.updateCollisionX = function (layer, sprite, tile, j, physics) {
        if (sprite.collidesWithTile(layer, tile, j)) {
            if (sprite.move.y > 0) {
                sprite.collision.map.down = true;
                sprite.collision.map.tile = tile;
            }
            if (sprite.move.y < 0) {
                sprite.collision.map.up = true;
                sprite.collision.map.tile = tile;
            }
            if (sprite.collision.map.down && physics.gravity.y > 0) {
                sprite.speed.gravity.y = 0;
            }
            if (sprite.collision.map.up && physics.gravity.y < 0) {
                sprite.speed.gravity.y = 0;
            }
            if ((sprite.collision.check.map.up && sprite.collision.map.up) || (sprite.collision.check.map.down && sprite.collision.map.down)) {
                sprite.move.y = 0;
                sprite.speed.y = 0;
                sprite.speed.t.y = 0;
            }
        }
    };

    p.updateCollisionY = function (layer, sprite, tile, j, physics) {

        if (sprite.collidesWithTile(layer, tile, j)) {
            if (sprite.move.x > 0) {
                sprite.collision.map.right = true;
                sprite.collision.map.tile = tile;
            }
            if (sprite.move.x < 0) {
                sprite.collision.map.left = true;
                sprite.collision.map.tile = tile;
            }
            if (sprite.collision.map.left && physics.gravity.x < 0) {
                sprite.speed.gravity.x = 0;
            }
            if (sprite.collision.map.right && physics.gravity.x > 0) {
                sprite.speed.gravity.x = 0;
            }
            if ((!sprite.collision.check.map.up && sprite.collision.map.up) || (!sprite.collision.check.map.down && sprite.collision.map.down)) {
            } else {
                if ((sprite.collision.check.map.left && sprite.collision.map.left) || (sprite.collision.check.map.right && sprite.collision.map.right)) {
                    sprite.move.x = 0;
                    sprite.speed.x = 0;
                    sprite.speed.t.x = 0;
                }
            }
        }
    };

    return function (game) {
        var map = game.map,
            sprites = game.scene.sprites,
            i,
            j,
            k,
            l,
            sprite,
            layer,
            mc,
            tile,
            tx,
            ty;

        if (!map || !map.json) {
            return;
        }

        for (i = 0; i < sprites.length; i++) {
            sprite = sprites[i];
            for (j = 0; j < map.json.layers.length; j++) {
                layer = map.json.layers[j];
                if (p.spriteCollidesWithLayer(layer, sprite)) {
                    mc = 0;
                    while (mc <= 2) {
                        if (sprite.move.x !== 0 || sprite.move.y !== 0) {
                            for (k = 0; k <= p.getHeight(map.json.tileheight, sprite); k++) {
                                for (l = 0; l <= p.getWidth(map.json.tilewidth, sprite); l++) {
                                    tile = map.getTile(layer.name, p.getPosX(layer, sprite, l * map.json.tilewidth), p.getPosY(layer, sprite, k * map.json.tileheight), sprite.frame.width, sprite.frame.height);
                                    if (tile !== null && layer.data[tile % layer.data.length] > 0 && sprite.collidesWithTile(layer, tile, j)) {
                                        if (mc === 0 || mc === 2) {
                                            tx = sprite.move.x;
                                            sprite.move.x = 0;
                                            p.updateCollisionX(layer, sprite, tile, j, game.physics);
                                            sprite.move.x = tx;
                                        }
                                        if (mc === 1 || mc === 2) {
                                            ty = sprite.move.y;
                                            if (mc !== 2)
                                                sprite.move.y = 0;
                                            p.updateCollisionY(layer, sprite, tile, j, game.physics);
                                            sprite.move.y = ty;
                                        }
                                    }
                                }
                            }
                        }
                        mc++;
                    }
                }
            }
        }
    }
});
Molecule.module('Molecule.MapFile', function (require, p) {

    var Tile = require('Molecule.Tile'),
        Map = require('Molecule.Map');

    p.Boolean = function (bool) {
        return (bool === 'true');
    };

    p.getProperty = function (property, Type, objectProperties, layerProperties, fallbackProperty) {

        if (typeof objectProperties[property] !== 'undefined') {
            return Type(objectProperties[property]);
        }

        if (typeof layerProperties[property] !== 'undefined') {
            return Type(layerProperties[property]);
        }

        return fallbackProperty;

    };

    p.getMoleculeType = function (object, tilesets) {
        var gid = object.gid;
        for (var x = 0; x < tilesets.length; x++) {
            if (tilesets[x].firstgid === gid) {
                return tilesets[x].name;
            }
        }
    };

	function MapFile(_game) {
		this.game = _game;
		this.tile = new Tile(_game);
		this.maps = [];
	}

	MapFile.prototype.load = function(_id, _name) {
		var m = new Map(this.game);
		m.load(_id, _name);
        m._MoleculeType = _id;
		this.maps.push(m);
		return m;
	};

	MapFile.prototype.isLoaded = function() {
		var loaded = true;
		for(var i = 0; i < this.maps.length; i++) {
			if(!this.maps[i].loaded) {
				loaded = false;
			}
		}
		return loaded;
	};

    MapFile.prototype.getCounter = function() {
        var c = 0;
    	for(var i = 0; i < this.maps.length; i++) {
    		if(this.maps[i].loaded) {
    			c++;
    		}
		}
		return c;
    };

	MapFile.prototype.set = function(_map, _reset) {
		_reset = _reset || false;
		this.game.camera.unfollow();
		if(_reset)
			_map.reset();
		this.game.map = _map;
        this.game.map.createContext();
	};

    MapFile.prototype.copyMapProperties = function(i, j, _sprite, _path) {

        var objectProperties =this.game.map.json.layers[i].objects[j].properties || {},
            layerProperties = this.game.map.json.layers[i].properties || {};

        _sprite._MoleculeType = p.getMoleculeType(this.game.map.json.layers[i].objects[j], this.game.map.json.tilesets);
        _sprite.position.x = parseInt(this.game.map.json.layers[i].objects[j].x);
        _sprite.position.y = parseInt(this.game.map.json.layers[i].objects[j].y) - _sprite.frame.height;
        _sprite.visible = this.game.map.json.layers[i].objects[j].visible;
        _sprite.anchor.x = p.getProperty('anchor.x', Number, objectProperties, layerProperties, _sprite.anchor.x);
        _sprite.anchor.y = p.getProperty('anchor.y', Number, objectProperties, layerProperties, _sprite.anchor.y);
        _sprite.flip.x = p.getProperty('flip.x', Number, objectProperties, layerProperties, _sprite.flip.x);
        _sprite.flip.y = p.getProperty('flip.y', Number, objectProperties, layerProperties, _sprite.flip.y);
        _sprite.collides.sprite =  p.getProperty('collides.sprite', p.Boolean, objectProperties, layerProperties, _sprite.collides.sprite);
        _sprite.collides.map = p.getProperty('collides.map', p.Boolean, objectProperties, layerProperties, _sprite.collides.map);
        _sprite.scrollable = p.getProperty('scrollable', p.Boolean, objectProperties, layerProperties, _sprite.scrollable);
        _sprite.collidable = p.getProperty('collidable', p.Boolean, objectProperties, layerProperties, _sprite.collidable);
        _sprite.speed.min.x = p.getProperty('speed.min.x', Number, objectProperties, layerProperties, _sprite.speed.min.x);
        _sprite.speed.min.y = p.getProperty('speed.min.y', Number, objectProperties, layerProperties, _sprite.speed.min.y);
        _sprite.speed.max.x = p.getProperty('speed.max.x', Number, objectProperties, layerProperties, _sprite.speed.max.x);
        _sprite.speed.max.y = p.getProperty('speed.max.y', Number, objectProperties, layerProperties, _sprite.speed.max.y);
        _sprite.affects.physics.gravity = p.getProperty('affects.physics.gravity', p.Boolean, objectProperties, layerProperties, _sprite.affects.physics.gravity);
        _sprite.affects.physics.friction = p.getProperty('affects.physics.friction', p.Boolean, objectProperties, layerProperties, _sprite.affects.physics.friction);
        _sprite.overlap = p.getProperty('overlap', p.Boolean, objectProperties, layerProperties, _sprite.overlap);

    };

    return MapFile;

});
Molecule.module('Molecule.Molecule', function (require, p) {

    var Text = require('Molecule.Text');

    p.mergeObjects = function () {
        var object = arguments[0],
            args = Array.prototype.slice.call(arguments, 0),
            x = 0,
            passedObject,
            prop;

        args.splice(0, 1);

        for (x; x < args.length; x++) {
            passedObject = args[x];
            for (prop in passedObject) {
                if (passedObject.hasOwnProperty(prop)) {
                    object[prop] = passedObject[prop]

                }

            }
        }

        return object;
    };

    p.extend = function (options) {

        var parent = this;
        var MoleculeObject;


        MoleculeObject = function () {
            return parent.apply(this, arguments);
        };

        p.mergeObjects(MoleculeObject, parent, options);

        var Surrogate = function () {
            this.constructor = MoleculeObject;
        };
        Surrogate.prototype = parent.prototype;
        MoleculeObject.prototype = new Surrogate;

        if (options) p.mergeObjects(MoleculeObject.prototype, options);

        MoleculeObject.__super__ = parent.prototype;

        return MoleculeObject;

    };

    p.registeredEvents = [];
    p.createEventClosure = function (type, callback, context) {

        var event = {
            type: type,
            context: context,
            callback: function (event) {
                callback.apply(context, event.detail);
            }
        };
        p.registeredEvents.push(event);

        return event.callback;

    };

    function Molecule(options) {

        options = options || {};

        for (var prop in options) {
            if (options.hasOwnProperty(prop)) {
                this[prop] = options[prop];
            }
        }

        // Clone sprites
        if (this.sprite) {
            this.sprite = this.sprite.clone();
        }

        var sprites = this.sprites;
        this.sprites = {};
        for (var sprite in sprites) {
            if (sprites.hasOwnProperty(sprite) && sprites[sprite]) {
                this.sprites[sprite] = sprites[sprite].clone();
            }
        }

        var text = this.text;
        this.text = {};
        for (var textProp in text) {
            if (text.hasOwnProperty(textProp)) {
                this.text[textProp] = text[textProp].clone();
            }
        }

        var audio = this.audio;
        this.audio = {};
        for (var sound in audio) {
            if (audio.hasOwnProperty(sound)) {
                this.audio[sound] = audio[sound].clone();
            }
        }

        this.init()
    }

    Molecule.prototype.sprite = null;
    Molecule.prototype.sprites = {};

    Molecule.prototype.init = function () {

    };

    Molecule.prototype.update = function () {

    };

    Molecule.prototype.listenTo = function (type, callback) {

        window.addEventListener(type, p.createEventClosure(type, callback, this));

    };

    Molecule.prototype.removeListeners = function () {
        var event;
        for (var x = 0; x < p.registeredEvents.length; x++) {
            event = p.registeredEvents[x];
            if (event.context === this) {
                window.removeEventListener(event.type, event.callback);
                p.registeredEvents.splice(x, 1);
                x--;
            }
        }
    };

    Molecule.extend = p.extend;


    return Molecule;

});
Molecule.module('Molecule.Move', function (require, p) {

   return function (sprites) {
       var r = true,
           t,
           sprite;

       for (var i = 0; i < sprites.length; i++) {
           sprite = sprites[i];
           t = true;
           sprite.speed.check.x = true;
           sprite.speed.check.y = true;
           if (sprite.speed.t.x >= 1) {
               sprite.speed.t.x -= 1;
               sprite.move.x = 1;
               t = false;
               r = false;
               sprite.speed.check.x = false;
           } else if (sprite.speed.t.x <= -1) {
               sprite.speed.t.x += 1;
               sprite.move.x = -1;
               t = false;
               r = false;
               sprite.speed.check.x = false;
           }
           if (sprite.speed.t.y >= 1) {
               sprite.speed.t.y -= 1;
               sprite.move.y = 1;
               t = false;
               r = false;
               sprite.speed.check.y = false;
           } else if (sprite.speed.t.y <= -1) {
               sprite.speed.t.y += 1;
               sprite.move.y = -1;
               t = false;
               r = false;
               sprite.speed.check.y = false;
           }
           if (t) {
               if (sprite.speed.t.x !== 0)
                   sprite.speed.t.x > 0 ? sprite.move.x = 1 : sprite.move.x = -1;
               if (sprite.speed.t.y !== 0)
                   sprite.speed.t.y > 0 ? sprite.move.y = 1 : sprite.move.y = -1;
           }
       }
       return r;

   }

});
Molecule.module('Molecule.Physics', function (require, p) {

    p.addFriction = function (sprite, game) {
        if (sprite.speed.x > 0) {
            sprite.speed.x = sprite.speed.x * (1 - game.physics.friction.x);
            if (sprite.speed.x < 0.05) {
                sprite.speed.x = 0;
            }
        } else if (sprite.speed.x < 0) {
            sprite.speed.x = sprite.speed.x * (1 - game.physics.friction.x);
            if (sprite.speed.x > 0.05) {
                sprite.speed.x = 0;
            }
        }
        if (sprite.speed.y > 0) {
            sprite.speed.y = sprite.speed.y * (1 - game.physics.friction.y);
            if (sprite.speed.y < 0.05) {
                sprite.speed.y = 0;
            }
        } else if (sprite.speed.y < 0) {
            sprite.speed.y = sprite.speed.y * (1 - game.physics.friction.y);
            if (sprite.speed.y > 0.05) {
                sprite.speed.y = 0;
            }
        }
    };

    p.spriteHitsPlatformBelow = function (sprite, game) {
    	return sprite.affects.physics.gravity && game.physics.gravity.y > 0 && sprite.collision.sprite.down && game.scene.sprites[sprite.collision.sprite.id].platform;
    };

    p.spriteHitsPlatformAbove = function (sprite, game) {
      	return sprite.affects.physics.gravity && game.physics.gravity.y < 0 && sprite.collision.sprite.up && game.scene.sprites[sprite.collision.sprite.id].platform;
    };

    p.spriteHitsPlatformRight = function (sprite, game) {
      	return sprite.affects.physics.gravity && game.physics.gravity.x > 0 && sprite.collision.sprite.right && game.scene.sprites[sprite.collision.sprite.id].platform;
    };

    p.spriteHitsPlatformLeft = function (sprite, game) {
		return sprite.affects.physics.gravity && game.physics.gravity.x < 0 && sprite.collision.sprite.left && game.scene.sprites[sprite.collision.sprite.id].platform;
    };

    p.spriteSlowerThanCollisionSprite = function (axis, sprite, game) {
        return sprite.speed[axis] >= 0 && sprite.speed[axis] < game.scene.sprites[sprite.collision.sprite.id].speed[axis];
    };

    p.spriteFasterThanCollisionSprite = function (axis, sprite, game) {
        return sprite.speed[axis] <= 0 && sprite.speed[axis] > game.scene.sprites[sprite.collision.sprite.id].speed[axis];
    };

    p.increaseAcceleration = function (sprite) {
        sprite.speed.x += sprite.acceleration.x;
        sprite.speed.y += sprite.acceleration.y;
    };

    p.setSpeed = function (sprite) {
        var sx = sprite.speed.x >= 0 ? 1 : -1;
        var sy = sprite.speed.y >= 0 ? 1 : -1;
        if (Math.abs(sprite.speed.x) > sprite.speed.max.x) {
            sprite.speed.x = sprite.speed.max.x * sx;
        }
        if (Math.abs(sprite.speed.y) > sprite.speed.max.y) {
            sprite.speed.y = sprite.speed.max.y * sy;
        }
    };

    p.addGravity = function (sprite, game) {
        sprite.speed.x -= sprite.speed.gravity.x;
        sprite.speed.y -= sprite.speed.gravity.y;
        if (sprite.affects.physics.gravity) {
            sprite.speed.gravity.x += game.physics.gravity.x;
            sprite.speed.gravity.y += game.physics.gravity.y;
        }
        sprite.speed.x += sprite.speed.gravity.x;
        sprite.speed.y += sprite.speed.gravity.y;
    };

    p.cleanUpSpeed = function (sprite) {
        sprite.speed.x = parseFloat(sprite.speed.x.toFixed(3));
        sprite.speed.y = parseFloat(sprite.speed.y.toFixed(3));
        sprite.speed.t.x += sprite.speed.x;
        sprite.speed.t.y += sprite.speed.y;
        sprite.speed.t.x = parseFloat(sprite.speed.t.x.toFixed(3));
        sprite.speed.t.y = parseFloat(sprite.speed.t.y.toFixed(3));
        sprite.resetAcceleration();
        if (sprite.speed.x === 0) {
            sprite.speed.t.x = 0;
        }
        if (sprite.speed.y === 0) {
            sprite.speed.t.y = 0;
        }
    };

    return function (game) {
        var sprite;
        for (var i = 0; i < game.scene.sprites.length; i++) {
            sprite = game.scene.sprites[i];

            if (sprite.affects.physics.friction) {
                p.addFriction(sprite, game);
            }
            
            if (p.spriteHitsPlatformBelow(sprite, game) || p.spriteHitsPlatformAbove(sprite, game)) {

                if (p.spriteSlowerThanCollisionSprite('x', sprite, game)) {
                    sprite.speed.x = game.scene.sprites[sprite.collision.sprite.id].speed.x;
                } else if (p.spriteFasterThanCollisionSprite('x', sprite, game)) {
                    sprite.speed.x = game.scene.sprites[sprite.collision.sprite.id].speed.x;
                }

            } else if (p.spriteHitsPlatformRight(sprite, game) || p.spriteHitsPlatformLeft(sprite, game)) {

                if (p.spriteSlowerThanCollisionSprite('y', sprite, game)) {
                    sprite.speed.y = game.scene.sprites[sprite.collision.sprite.id].speed.y;
                } else if (p.spriteFasterThanCollisionSprite('y', sprite, game)) {
                    sprite.speed.y = game.scene.sprites[sprite.collision.sprite.id].speed.y;
                }

            }

            p.increaseAcceleration(sprite);
            p.setSpeed(sprite);
            p.addGravity(sprite, game);
            p.cleanUpSpeed(sprite);

        }

    }

});
Molecule.module('Molecule.Scene', function (require, p) {

	function Scene(_game) {
        this.molecules = [];
        this.sprites = [];
		this.text = [];
        this.tilemaps = [];
	}

    return Scene;

});
Molecule.module('Molecule.SpriteSheet', function (require, p) {

    var sprite = require('Molecule.Sprite');

    function SpriteSheet(_game) {
        this.game = _game;
        this.sprites = null;
        this.image = null;
        this.response = null;
        this.json = null;
        this.path = '';
        this.loaded = false;
    }
    
    SpriteSheet.prototype.load = function(_file, _sprites) {
        var self = this;
        var ajaxReq = new XMLHttpRequest();
        var t = _file.split('/');
        var i;
        
        this.sprites = _sprites;
                
        for (i = 0; i < t.length - 1; i++) {
            this.path += t[i] + '/';
        }
        ajaxReq.open("GET", _file, true);
        ajaxReq.setRequestHeader("Content-type", "application/json");
        ajaxReq.addEventListener('readystatechange', function () {
            self.jsonLoaded(ajaxReq);
        });
        ajaxReq.send();
    };
    
    SpriteSheet.prototype.jsonLoaded = function (_ajaxReq) {
        if (_ajaxReq.readyState == 4 && _ajaxReq.status == 200) {
            this.response = _ajaxReq.responseText;
            this.json = JSON.parse(this.response);
            this.loadImage();
        }
    };
    
    SpriteSheet.prototype.loadImage = function() {
        var self = this;
        this.image = this.game.imageFile.preload(this.path + this.json.meta.image);
        var interval = setInterval(function () {
            self.loadSprites(interval)
        }, 100);
    };
    
    SpriteSheet.prototype.loadSprites = function(_interval) {
        var i;
        var j;
        var f;
        if (this.game.imageFile.isLoaded()) {
            clearInterval(_interval);
            for (p in this.sprites) {
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');
                var image = new Image();
                var sizeW = 0;
                var sizeH = 0;
                f = false;
                for(i = 0; i < this.sprites[p].length; i++) {
                    for(j = 0; j < this.json.frames.length; j++) {
                        if(this.sprites[p][i] === this.json.frames[j].name) {
                            if(!f) {
                                sizeW = this.json.frames[j].size.w;
                                sizeH = this.json.frames[j].size.h;
                                canvas.width = this.json.frames[j].size.w * this.sprites[p].length;
                                canvas.height = this.json.frames[j].size.h;
                                f = true;
                            }
                            context.drawImage(this.image, this.json.frames[j].position.x, this.json.frames[j].position.y, this.json.frames[j].size.w, this.json.frames[j].size.h, this.json.frames[j].size.w * i, 0, this.json.frames[j].size.w, this.json.frames[j].size.h);
                        }
                    }
                }
                image.src = canvas.toDataURL("image/png");
                var s = this.game.imageFile.loadSpriteSheet(p, image, sizeW, sizeH);
            }
        }
        this.loaded = true;
    };
    
    return SpriteSheet;
});
Molecule.module('Molecule.SpriteSheetFile', function (require, p) {

    var SpriteSheet = require('Molecule.SpriteSheet');
    
    function SpriteSheetFile(_game) {
        this.game = _game;
        this.data = [];
    }
    
    SpriteSheetFile.prototype.load = function(_file, _sprites) {
        var s = new SpriteSheet(this.game);
        s.load(_file, _sprites);
        this.data.push(s);
    };
    
    SpriteSheetFile.prototype.isLoaded = function() {
        var loaded = true;
        var i;
        for(i = 0; i < this.data.length; i++) {
            if(!this.data[i].loaded) {
                loaded = false;
            }
        }
        return loaded;
    };
    
    SpriteSheetFile.prototype.getCounter = function() {
        var c = 0;
        var i;
        for(i = 0; i < this.data.length; i++) {
            if(this.data[i].loaded) {
                c++;
            }
        }
        return c;
    };

    return SpriteSheetFile;
});
Molecule.module('Molecule.MAudio', function (require, p) {

	function MAudio() {
		this.sound = null;
	}

    MAudio.prototype.play = function(_loop) {
		_loop = typeof _loop === 'undefined' ? false : _loop;
		if(this.sound.currentTime === this.sound.duration) {
			this.stop();
		}
		this.sound.loop = _loop;
        if (!this.sound.paused) {
            this.stop();
        }
        this.sound.play();
	};

    MAudio.prototype.pause = function() {
		this.sound.pause();
	};

    MAudio.prototype.stop = function() {
		this.sound.pause();
		this.sound.currentTime = 0;
	};

    MAudio.prototype.clone = function () {

        var mAudio = new MAudio();
        mAudio.sound = new Audio();
        mAudio.sound.src = this.sound.src;
        return mAudio;

    };

	return MAudio;

});
Molecule.module('Molecule.Sprite', function (require, p) {

    var Animation = require('Molecule.Animation'),
        utils = require('Molecule.utils');

	// Sprite var.
    function Sprite(_name, _src, _width, _height) {

        this.name = _name;
        this.src = _src;
        this.image = null;
        this.position = {x: 0, y: 0, absolute: {x: 0, y: 0}};
        this.rotation = 0;
        this.move = {x: 0, y: 0};
        this.flip = {x: false, y: false, offset: {x: 0, y: 0}, f: {x: 0, y: 0}};
        this.anchor = {x: 0, y: 0};
        this.visible = true;
        this.alpha = 1;
        this.frame = {width: _width, height: _height, offset: {x: 0, y: 0, width: 0, height: 0}};
        this.animation = new Animation(this.frame.width, this.frame.height);
        this.size = {width: 0, height: 0};
        this.collides = {sprite: true, map: true, boundaries: true, group: null};
        this.scrollable = true;
        this.collidable = true;
        this.platform = false;
        this.acceleration = {x: 0, y: 0};
        this.speed = {x: 0, y: 0, t: {x: 0, y: 0}, max: {x: 100, y: 100}, min: {x: 0, y: 0}, check: {x: false, y: false}, gravity: {x: 0, y: 0}};
        this.affects = {physics: {gravity: true, friction: true}};
        this.collision = {map: {up: false, down: false, left: false, right: false, tile: null}, sprite: {up: false, down: false, left: false, right: false, id: null}, boundaries: {up: false, down: false, left: false, right: false, id: null}, check: {map: {up: true, down: true, left: true, right: true}}};
        this.overlap = false;
        this.kill = false;
        this.game = null;
        this.width = 0;
        this.height = 0;

        return this;
    }

    Sprite.prototype.getAnimation = function () {
        this.size = {width: this.image.width, height: this.image.height};
        this.frame.width = this.frame.width || this.size.width;
        this.frame.height = this.frame.height || this.size.height;
        this.width = this.frame.width;
        this.height = this.frame.height;
        this.animation.sliceFrames(this.image.width, this.image.height, this.frame.width, this.frame.height);
    };

	// Sprite prototype Method flipUpdate
    Sprite.prototype.flipUpdate = function () {
        this.flip.offset.x = this.flip.x ? -this.frame.width : 0;
        this.flip.offset.y = this.flip.y ? -this.frame.height : 0;
        this.flip.f.x = this.flip.x ? -1 : 1;
        this.flip.f.y = this.flip.y ? -1 : 1;
    };

	// Sprite prototype Method update
    Sprite.prototype.update = function () {
        this.position.x += this.move.x;
        this.position.y += this.move.y;
        this.position.x = parseFloat(this.position.x.toFixed(3));
        this.position.y = parseFloat(this.position.y.toFixed(3));
        this.position.absolute.x = this.position.x;
        this.position.absolute.y = this.position.y;
        if (this.game.map.getMainLayer() !== -1) {
            this.position.absolute.x += Math.abs(this.game.map.json.layers[this.game.map.getMainLayer()].x);
            this.position.absolute.y += Math.abs(this.game.map.json.layers[this.game.map.getMainLayer()].y);
        }
    };

	// Sprite prototype Method resetMove
    Sprite.prototype.resetMove = function () {
        this.move = {x: 0, y: 0};
    };

	// Sprite prototype Method reset acceleration
    Sprite.prototype.resetAcceleration = function () {
        this.acceleration = {x: 0, y: 0};
    };

	// Sprite prototype Method draw
    Sprite.prototype.draw = function (_overlap) {
        if (this.overlap === _overlap && this.position.x - this.anchor.x + this.frame.width >= 0 && this.position.y - this.anchor.y + this.frame.height >= 0 && this.position.x - this.anchor.x <= this.game.width && this.position.y - this.anchor.y <= this.game.height) {
            this.game.context.save();
            this.game.context.globalAlpha = this.alpha;
            this.game.context.scale(1 * this.flip.f.x, 1 * this.flip.f.y);
            this.game.context.translate(Math.round((this.position.x * this.flip.f.x) + this.flip.offset.x), Math.round((this.position.y * this.flip.f.y) + this.flip.offset.y));
            this.game.context.rotate(this.rotation * (Math.PI / 180));
            this.game.context.translate(Math.round(-this.anchor.x * this.flip.f.x), Math.round(-this.anchor.y * this.flip.f.y));
            this.game.context.drawImage(this.image, this.animation.frame[this.animation.id[this.animation.current.animation].frame[this.animation.current.frame]].x, this.animation.frame[this.animation.id[this.animation.current.animation].frame[this.animation.current.frame]].y, this.frame.width, this.frame.height, 0, 0, this.frame.width, this.frame.height);
            this.game.context.restore();
        }
    };

	// Sprite prototype Method is_touched
    Sprite.prototype.touch = function () {
        var _touch = this.game.input.touch;
        for (var i = 0; i < _touch.length; i++) {
            if (this.position.x - this.anchor.x + this.frame.offset.x <= _touch[i].x && this.position.x - this.anchor.x + this.frame.width - this.frame.offset.x > _touch[i].x && this.position.y - this.anchor.y + this.frame.offset.y <= _touch[i].y && this.position.y - this.anchor.y + this.frame.height - this.frame.offset.y > _touch[i].y) {
                return true;
            }
        }
        return false;
    };

	// Sprite prototype Method is_clicked
    Sprite.prototype.click = function (_button) {
        var _mouse = this.game.input.mouse;
        return (this.position.x - this.anchor.x + this.frame.offset.x <= _mouse.x && this.position.x - this.anchor.x + this.frame.width - this.frame.offset.x > _mouse.x && this.position.y - this.anchor.y + this.frame.offset.y <= _mouse.y && this.position.y - this.anchor.y + this.frame.height - this.frame.offset.y > _mouse.y && _button);
    };

	// Sprite prototype Method collidesWithSprite
    Sprite.prototype.collidesWithSprite = function (_object) {
        var sp1 = {left: this.position.x - this.anchor.x + this.move.x + this.frame.offset.x, right: this.position.x - this.anchor.x + this.frame.width - this.frame.offset.x + this.move.x, top: this.position.y - this.anchor.y + this.move.y + this.frame.offset.y, bottom: this.position.y - this.anchor.y + this.frame.height - this.frame.offset.y + this.move.y};
        var sp2 = {left: _object.position.x - _object.anchor.x + _object.move.x + _object.frame.offset.x, right: _object.position.x - _object.anchor.x + _object.frame.width - _object.frame.offset.x + _object.move.x, top: _object.position.y - _object.anchor.y + _object.move.y + _object.frame.offset.y, bottom: _object.position.y - _object.anchor.y + _object.frame.height - _object.frame.offset.y + _object.move.y}; 
        return !(sp2.left >= sp1.right || sp2.right <= sp1.left || sp2.top >= sp1.bottom || sp2.bottom <= sp1.top);
        
        /*
        if (((this.position.x - this.anchor.x + this.move.x + this.frame.offset.x <= _object.position.x - _object.anchor.x + _object.move.x + _object.frame.offset.x && this.position.x - this.anchor.x + this.frame.width - this.frame.offset.x + this.move.x > _object.position.x - _object.anchor.x + _object.move.x + _object.frame.offset.x) || (_object.position.x - _object.anchor.x + _object.move.x + _object.frame.offset.x <= this.position.x - this.anchor.x + this.move.x + this.frame.offset.x && _object.position.x - _object.anchor.x + _object.move.x + _object.frame.width - _object.frame.offset.x > this.position.x - this.anchor.x + this.move.x + this.frame.offset.x)) && ((this.position.y - this.anchor.y + this.move.y + this.frame.offset.y <= _object.position.y - _object.anchor.y + _object.move.y + _object.frame.offset.y && this.position.y - this.anchor.y + this.frame.height - this.frame.offset.y + this.move.y > _object.position.y - _object.anchor.y + _object.move.y + _object.frame.offset.y) || (_object.position.y - _object.anchor.y + _object.move.y + _object.frame.offset.y <= this.position.y - this.anchor.y + this.move.y + this.frame.offset.y && _object.position.y - _object.anchor.y + _object.move.y + _object.frame.height - _object.frame.offset.y > this.position.y - this.anchor.y + this.move.y + this.frame.offset.y)))
            return true;
        return false;
        */
    };

	// Sprite prototype Method collidesWithTile
    Sprite.prototype.collidesWithTile = function (_layer, _tile, _j) {

        var _lpx = Math.abs(_layer.x);
        var _lpy = Math.abs(_layer.y);

        var _object = {position: {
            x: Math.floor(_tile % _layer.width) * this.game.map.json.tilewidth,
            y: Math.floor(_tile / _layer.width) * this.game.map.json.tileheight},
            width: this.game.map.json.tilesets[this.game.map.getTileset(_layer.data[_tile])].tilewidth,
            height: this.game.map.json.tilesets[this.game.map.getTileset(_layer.data[_tile])].tileheight};

        var px1 = this.position.x - this.anchor.x + this.move.x + this.frame.offset.x + _lpx;
        var px2 = this.position.x - this.anchor.x + this.frame.width - this.frame.offset.x + this.move.x + _lpx;
        var px3 = this.position.x - this.anchor.x + this.move.x + this.frame.offset.x + _lpx;
        var px4 = this.position.x - this.anchor.x + this.move.x + this.frame.offset.x + _lpx;
        if (_layer.properties.scroll.infinite.x) {
            if (px1 >= this.game.map.canvas[_j].width) {
                px1 = Math.floor(px1 % this.game.map.canvas[_j].width);
            }
            if (px2 >= this.game.map.canvas[_j].width) {
                px2 = Math.floor(px2 % this.game.map.canvas[_j].width);
            }
            if (px3 >= this.game.map.canvas[_j].width) {
                px3 = Math.floor(px3 % this.game.map.canvas[_j].width);
            }
            if (px4 >= this.game.map.canvas[_j].width) {
                px4 = Math.floor(px4 % this.game.map.canvas[_j].width);
            }
        }

        var py1 = this.position.y - this.anchor.y + this.move.y + this.frame.offset.y + _lpy;
        var py2 = this.position.y - this.anchor.y + this.frame.height - this.frame.offset.y + this.move.y + _lpy;
        var py3 = this.position.y - this.anchor.y + this.move.y + this.frame.offset.y + _lpy;
        var py4 = this.position.y - this.anchor.y + this.move.y + this.frame.offset.y + _lpy;
        if (_layer.properties.scroll.infinite.y) {
            if (py1 >= this.game.map.canvas[_j].height) {
                py1 = Math.floor(py1 % this.game.map.canvas[_j].height);
            }
            if (py2 >= this.game.map.canvas[_j].height) {
                py2 = Math.floor(py2 % this.game.map.canvas[_j].height);
            }
            if (py3 >= this.game.map.canvas[_j].height) {
                py3 = Math.floor(py3 % this.game.map.canvas[_j].height);
            }
            if (py4 >= this.game.map.canvas[_j].height) {
                py4 = Math.floor(py4 % this.game.map.canvas[_j].height);
            }
        }

        return (((px1 <= _object.position.x && px2 > _object.position.x) || (_object.position.x <= px3 && _object.position.x + _object.width > px4)) && ((py1 <= _object.position.y && py2 > _object.position.y) || (_object.position.y <= py3 && _object.position.y + _object.height > py4)));
    };

    Sprite.prototype.clone = function () {
        var sprite = new Sprite(this.name, this.src, this.frame.width, this.frame.height);
        sprite.image = this.image;
        sprite.game = this.game;

        utils.deepClone(this, sprite, [
            'name',
            'src',
            '_MoleculeType',
            'position',
            'rotation',
            'move',
            'flip',
            'anchor',
            'visible',
            'alpha',
            'frame',
            'size',
            'collides',
            'scrollable',
            'collidable',
            'platform',
            'acceleration',
            'speed',
            'affects',
            'collision',
            'overlap',
            'kill'
        ]);

        sprite.getAnimation();

        return sprite;
    };

    return Sprite;

});
Molecule.module('Molecule.SpriteCollisions', function (require, p) {

    p.spritesCollide = function (spriteI, spriteJ) {
        return (spriteI.collides.sprite && spriteJ.collidable && spriteI.collidable) && (spriteI.collidesWithSprite(spriteJ)) && (spriteI.collides.group === null || spriteI.collides.group !== spriteJ.collides.group)
    };

    p.updateCollisionY = function (spriteI, spriteJ, i, j, physics) {
        if (spriteI.collidesWithSprite(spriteJ)) {
            if (spriteI.move.y > 0) {
                spriteI.collision.sprite.down = true;
                spriteJ.collision.sprite.up = true;
            }
            if (spriteI.move.y < 0) {
                spriteI.collision.sprite.up = true;
                spriteJ.collision.sprite.down = true;
            }
            if (spriteI.collision.sprite.down && physics.gravity.y > 0) {
                spriteI.speed.gravity.y = 0;
            }
            if (spriteI.collision.sprite.up && physics.gravity.y < 0) {
                spriteI.speed.gravity.y = 0;
            }
            spriteI.collision.sprite.id = j;
            spriteJ.collision.sprite.id = i;
            spriteI.move.y = 0;
            spriteI.speed.y = 0;
            spriteI.speed.t.y = 0;
        }
    };

    p.updateCollisionX = function (spriteI, spriteJ, i, j, physics) {
        if (spriteI.collidesWithSprite(spriteJ)) {
            if (spriteI.move.x > 0) {
                spriteI.collision.sprite.right = true;
                spriteJ.collision.sprite.left = true;
            }
            if (spriteI.move.x < 0) {
                spriteI.collision.sprite.left = true;
                spriteJ.collision.sprite.right = true;
            }
            if (spriteI.collision.sprite.left && physics.gravity.x < 0) {
                spriteI.speed.gravity.x = 0;
            }
            if (spriteI.collision.sprite.right && physics.gravity.x > 0) {
                spriteI.speed.gravity.x = 0;
            }
            spriteI.collision.sprite.id = j;
            spriteJ.collision.sprite.id = i;
            spriteI.move.x = 0;
            spriteI.speed.x = 0;
            spriteI.speed.t.x = 0;
        }
    };

    return function (game) {
        var sprites = game.scene.sprites,
            physics = game.physics,
            i,
            j,
            k,
            mc,
            tx,
            ty,
            tjx,
            tjy,
            spriteI,
            spriteJ;
        for(k = 0; k < sprites.length; k++) {
            for (i = k; i < sprites.length; i++) {
                spriteI = sprites[i];
                for (j = k; j < sprites.length; j++) {
                    spriteJ = sprites[j];
    
                    if (i !== j) {
    
                        tjx = spriteJ.move.x;
                        tjy = spriteJ.move.y;
    
                        if (p.spritesCollide(spriteI, spriteJ)) {
    
                            if (j > i) {
                                spriteJ.move.x = 0;
                                spriteJ.move.y = 0;
                            }
    
                            if (p.spritesCollide(spriteI, spriteJ)) {
                                mc = 0;
                                while (mc <= 2) {
                                    if (spriteI.move.x !== 0 || spriteI.move.y !== 0) {
                                        if (mc === 0 || mc === 2) {
                                            tx = spriteI.move.x;
                                            if (mc !== 2)
                                                spriteI.move.x = 0;
                                            p.updateCollisionY(spriteI, spriteJ, i, j, physics);
                                            spriteI.move.x = tx;
                                        }
                                        if (mc === 1 || mc === 2) {
                                            ty = spriteI.move.y;
                                            if (mc !== 2)
                                                spriteI.move.y = 0;
                                            p.updateCollisionX(spriteI, spriteJ, i, j, physics);
                                            spriteI.move.y = ty;
                                        }
                                    }
                                    mc++;
                                }
                            }
                        }
                        spriteJ.move.x = tjx;
                        spriteJ.move.y = tjy;
                    }
                }
            }
        }
    };
});
Molecule.module('Molecule.Text', function (require, p) {

    var utils = require('Molecule.utils');

	function Text (options, _game) {
		this.game = _game;
		this.title = '';
        this.position = options.position || {x:0,y:0};
		this.align = 'left';
		this.font = 'Arial 16px';
		this.color = '#FFFFFF';
		this.baseline = 'top';
		this.alpha = 1;
		this.visible = true;
		this.stroke = null;
		this.lineWidth = 1;
        utils.mergeSafely(options, this, ['game']);
	}

	Text.prototype.draw = function() {
		this.game.context.save();
		if(this.font !== null) {
			this.game.context.font = this.font;
		}
		this.game.context.globalAlpha = this.alpha;
		this.game.context.textAlign = this.align;
		this.game.context.textBaseline = this.baseline;
		this.game.context.fillStyle = this.color;
		this.game.context.fillText(this.title, this.position.x, this.position.y);
		if(this.stroke) {
		    this.game.context.lineWidth = this.lineWidth;
			this.game.context.strokeStyle = this.stroke;
			this.game.context.strokeText(this.title, this.position.x, this.position.y);
		}
		this.game.context.restore();
	};

	Text.prototype.measure = function() {
		return this.game.context.measureText(this.title).width;
	};

    Text.prototype.clone = function () {
        var options = utils.deepClone(this, {}, [
            'title',
            'position',
            'align',
            'font',
            'color',
            'baseline',
            'alpha',
            'visible',
            'stroke',
            'lineWidth'
        ]);
        var text = new Text(options, this.game);
        return text;
    };

	return Text;

});

Molecule.module('Molecule.Tile', function (require, p) {

	function Tile(_game) {
		this.game = _game;
	}

	Tile.prototype.get = function(_name, _x, _y) {
		var t = this.game.map.getTileData(_name, _x, _y);
		return t;
	};

	Tile.prototype.set = function(_name, _x, _y, _tileset, _tile) {
		this.game.map.setTile(_name, _x, _y, _tileset, _tile);
	};

	Tile.prototype.clear = function(_name, _x, _y) {
		var t = this.game.map.clearTile(_name, _x, _y);
		return t;
	};

	return Tile;

});

Molecule.module('Molecule.utils', function (require, p) {

    p.createMethodClosure = function (object, prop, context) {
        return object[prop].bind(context);
    };

    p.matchByObject = function (returnArray, objToMatch, containsProps) {

        return function (obj) {

            if (containsProps(obj, objToMatch)) {
                returnArray.push(obj);
            }

        }

    };

    p.matchByFunction = function (returnArray, matchFunc) {

        return function (obj) {

            if ((typeof matchFunc._MoleculeType === 'undefined' || matchFunc._MoleculeType === obj._MoleculeType) && matchFunc(obj)) {
                returnArray.push(obj);
            }

        }

    };

    return {

        deepClone: function (source, target, props) {

            for (var prop in source) {
                if (source.hasOwnProperty(prop) && (!props || (props && props.indexOf(prop) >= 0))) {

                    if (source[prop] instanceof Array) {
                        target[prop] = source[prop].slice(0);
                    } else if (typeof source[prop] === 'object' && source[prop] !== null) {
                        target[prop] = this.deepClone(source[prop], {});
                    } else {
                        target[prop] = source[prop];
                    }

                }
            }

            return target;

        },
        mergeSafely: function (source, target, invalidProps) {
            invalidProps = invalidProps || [];
            for (var prop in source) {
                if (source.hasOwnProperty(prop) && invalidProps.indexOf(prop) === -1) {
                    target[prop] = source[prop];
                } else if (invalidProps.indexOf(prop) >= 0) {
                    throw new Error('You can not set or change the property ' + prop);
                }
            }
        },
        bindMethods: function (object, context) {

            for (var prop in object) {

                if (object.hasOwnProperty(prop) && typeof object[prop] === 'function') {
                    object[prop] = p.createMethodClosure(object, prop, context)
                }
            }

        },
        isMolecule: function (obj) {

            if (!obj) {
                return false;
            }

            // Can not use instanceof here
            return this.isObject(obj) && 'init' in obj && 'update' in obj;

        },
        isSprite: function (sprite) {
            var Sprite = require('Molecule.Sprite');
            return sprite instanceof Sprite;

        },
        isText: function (text) {
            var Text = require('Molecule.Text');
            return text instanceof Text;

        },
        isTilemap: function (tilemap) {
            var Map = require('Molecule.Map');
            return tilemap instanceof Map;
        },
        isObject: function (obj) {
            if (!obj) {
                return false;
            }
            return typeof obj === 'object' && !(obj instanceof Array) && obj !== null;
        },
        isString: function (string) {
            return typeof string === 'string';
        },
        find: function (array) {
            var returnArray = [];

            if (typeof arguments[1] === 'function') {
                array.forEach(p.matchByFunction(returnArray, arguments[1]));
            } else {
                array.forEach(p.matchByObject(returnArray, arguments[1], this.containsProps));
            }

            return returnArray;
        },
        containsProps: function (obj, objToMatch) {
            var match = true,
                prop;

            for (prop in objToMatch) {

                if (objToMatch.hasOwnProperty(prop) && obj[prop] !== objToMatch[prop]) {
                    match = false;
                }
            }

            return match;

        }

    };

});