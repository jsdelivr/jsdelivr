var ripple =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/ 	
/******/ 	// The require function
/******/ 	function require(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/ 		
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/ 		
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, require);
/******/ 		
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 		
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// The bundle contains no chunks. A empty chunk loading function.
/******/ 	require.e = function requireEnsure(_, callback) {
/******/ 		callback.call(null, this);
/******/ 	};
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	require.modules = modules;
/******/ 	
/******/ 	// expose the module cache
/******/ 	require.cache = installedModules;
/******/ 	
/******/ 	
/******/ 	// Load entry module and return exports
/******/ 	return require(0);
/******/ })
/************************************************************************/
/******/ ({
/******/ // __webpack_public_path__
/******/ c: "",

/***/ 0:
/***/ function(module, exports, require) {

	exports.Remote           = require(1).Remote;
	exports.Request          = require(2).Request;
	exports.Amount           = require(3).Amount;
	exports.Currency         = require(4).Currency;
	exports.Base             = require(5).Base;
	exports.UInt160          = require(3).UInt160;
	exports.Seed             = require(3).Seed;
	exports.Transaction      = require(6).Transaction;
	exports.Meta             = require(7).Meta;
	exports.SerializedObject = require(8).SerializedObject;
	exports.RippleError      = require(9).RippleError;

	exports.binformat        = require(10);
	exports.utils            = require(11);
	exports.Server           = require(12).Server;

	// Important: We do not guarantee any specific version of SJCL or for any
	// specific features to be included. The version and configuration may change at
	// any time without warning.
	//
	// However, for programs that are tied to a specific version of ripple.js like
	// the official client, it makes sense to expose the SJCL instance so we don't
	// have to include it twice.
	exports.sjcl      = require(11).sjcl;

	exports.config    = require(13);

	// vim:sw=2:sts=2:ts=8:et


/***/ },

/***/ 1:
/***/ function(module, exports, require) {

	// Remote access to a server.
	// - We never send binary data.
	// - We use the W3C interface for node and browser compatibility:
	//   http://www.w3.org/TR/websockets/#the-websocket-interface
	//
	// This class is intended for both browser and node.js use.
	//
	// This class is designed to work via peer protocol via either the public or
	// private websocket interfaces.  The JavaScript class for the peer protocol
	// has not yet been implemented. However, this class has been designed for it
	// to be a very simple drop option.
	//
	// YYY Will later provide js/network.js which will transparently use multiple
	// instances of this class for network access.

	// npm
	var EventEmitter = require(25).EventEmitter;
	var util         = require(26);

	var Request      = require(2).Request;
	var Server       = require(12).Server;
	var Amount       = require(3).Amount;
	var Currency     = require(4).Currency;
	var UInt160      = require(15).UInt160;
	var Transaction  = require(6).Transaction;
	var Account      = require(16).Account;
	var Meta         = require(7).Meta;
	var OrderBook    = require(17).OrderBook;
	var PathFind     = require(18).PathFind;
	var RippleError  = require(9).RippleError;

	var utils        = require(11);
	var config       = require(13);
	var sjcl         = require(11).sjcl;

	/**
	    Interface to manage the connection to a Ripple server.

	    This implementation uses WebSockets.

	    Keys for opts:

	      trace
	      max_listeners      : Set maxListeners for remote; prevents EventEmitter warnings
	      connection_offset  : Connect to remote servers on supplied interval (in seconds)
	      trusted            : truthy, if remote is trusted
	      max_fee            : Maximum acceptable transaction fee
	      fee_cushion        : Extra fee multiplier to account for async fee changes.
	      servers            : Array of server objects with the following form

	         {
	              host:    <string>
	            , port:    <number>
	            , secure:  <boolean>
	         }

	    Events:
	      'connect'
	      'connected' (DEPRECATED)
	      'disconnect'
	      'disconnected' (DEPRECATED)
	      'state':
	      - 'online'        : Connected and subscribed.
	      - 'offline'       : Not subscribed or not connected.
	      'subscribed'      : This indicates stand-alone is available.

	    Server events:
	      'ledger_closed'   : A good indicate of ready to serve.
	      'transaction'     : Transactions we receive based on current subscriptions.
	      'transaction_all' : Listening triggers a subscribe to all transactions
	                          globally in the network.

	    @param opts      Connection options.
	    @param trace
	*/

	function Remote(opts, trace) {
	  EventEmitter.call(this);

	  var self  = this;

	  this.trusted               = Boolean(opts.trusted);
	  this.local_sequence        = Boolean(opts.local_sequence); // Locally track sequence numbers
	  this.local_fee             = (typeof opts.local_fee === 'undefined') ? true : Boolean(opts.local_fee); // Locally set fees
	  this.local_signing         = (typeof opts.local_signing === 'undefined') ? true : Boolean(opts.local_signing);
	  this.fee_cushion           = (typeof opts.fee_cushion === 'undefined') ? 1.2 : Number(opts.fee_cushion);
	  this.max_fee               = (typeof opts.max_fee === 'undefined') ? Infinity : Number(opts.max_fee);
	  this.id                    = 0;
	  this.trace                 = Boolean(opts.trace);
	  this._server_fatal         = false; // True, if we know server exited.
	  this._ledger_current_index = void(0);
	  this._ledger_hash          = void(0);
	  this._ledger_time          = void(0);
	  this._stand_alone          = void(0);
	  this._testnet              = void(0);
	  this._transaction_subs     = 0;
	  this.online_target         = false;
	  this._online_state         = 'closed'; // 'open', 'closed', 'connecting', 'closing'
	  this.state                 = 'offline'; // 'online', 'offline'
	  this.retry_timer           = void(0);
	  this.retry                 = void(0);

	  this._load_base            = 256;
	  this._load_factor          = 256;
	  this._fee_ref              = 10;
	  this._fee_base             = 10;
	  this._reserve_base         = void(0);
	  this._reserve_inc          = void(0);
	  this._connection_count     = 0;
	  this._connected            = false;
	  this._connection_offset    = 1000 * (typeof opts.connection_offset === 'number' ? opts.connection_offset : 5)
	  this._submission_timeout   = 1000 * (typeof opts.submission_timeout === 'number' ? opts.submission_timeout : 10)

	  this._received_tx          = { };
	  this._cur_path_find        = null;

	  // Local signing implies local fees and sequences
	  if (this.local_signing) {
	    this.local_sequence = true;
	    this.local_fee      = true;
	  }

	  this._servers        = [ ];
	  this._primary_server = void(0);

	  // Cache information for accounts.
	  // DEPRECATED, will be removed
	  this.accounts = {
	    // Consider sequence numbers stable if you know you're not generating bad transactions.
	    // Otherwise, clear it to have it automatically refreshed from the network.

	    // account : { seq : __ }
	  };

	  // Account objects by AccountId.
	  this._accounts = { };

	  // OrderBook objects
	  this._books = { };

	  // Secrets that we know about.
	  this.secrets = {
	    // Secrets can be set by calling set_secret(account, secret).

	    // account : secret
	  };

	  // Cache for various ledgers.
	  // XXX Clear when ledger advances.
	  this.ledgers = {
	    current : {
	      account_root : {}
	    }
	  };

	  // Fallback for previous API
	  if (!opts.hasOwnProperty('servers')) {
	    opts.servers = [
	      {
	        host:     opts.websocket_ip,
	        port:     opts.websocket_port,
	        secure:   opts.websocket_ssl,
	        trusted:  opts.trusted
	      }
	    ];
	  }

	  opts.servers.forEach(function(server) {
	    var pool = Number(server.pool) || 1;
	    while (pool--) { self.add_server(server); };
	  });

	  // This is used to remove Node EventEmitter warnings
	  var maxListeners = opts.maxListeners || opts.max_listeners || 0;
	  this._servers.concat(this).forEach(function(emitter) {
	    emitter.setMaxListeners(maxListeners);
	  });

	  function listener_added(type, listener) {
	    if (type === 'transaction_all') {
	      if (!self._transaction_subs && self._connected) {
	        self.request_subscribe('transactions').request();
	      }
	      self._transaction_subs += 1;
	    }
	  };

	  function listener_removed(type, listener) {
	    if (type === 'transaction_all') {
	      self._transaction_subs -= 1;
	      if (!self._transaction_subs && self._connected) {
	        self.request_unsubscribe('transactions').request();
	      }
	    }
	  };

	  this.on('newListener', listener_added);
	  this.on('removeListener', listener_removed);
	}

	util.inherits(Remote, EventEmitter);

	// Flags for ledger entries. In support of account_root().
	Remote.flags = {
	  // Account Root
	  account_root : {
	    PasswordSpent:      0x00010000, // True, if password set fee is spent.
	    RequireDestTag:     0x00020000, // True, to require a DestinationTag for payments.
	    RequireAuth:        0x00040000, // True, to require a authorization to hold IOUs.
	    DisallowXRP:        0x00080000, // True, to disallow sending XRP.
	    DisableMaster:      0x00100000  // True, force regular key.
	  },

	  // Offer
	  offer: {
	    Passive:            0x00010000,
	    Sell:               0x00020000  // True, offer was placed as a sell.
	  },

	  // Ripple State
	  state: {
	    LowReserve:         0x00010000, // True, if entry counts toward reserve.
	    HighReserve:        0x00020000,
	    LowAuth:            0x00040000,
	    HighAuth:           0x00080000,
	    LowNoRipple:        0x00100000,
	    HighNoRipple:       0x00200000
	  }
	};

	function isTemMalformed(engine_result_code) {
	  return (engine_result_code >= -299 && engine_result_code <  199);
	};

	function isTefFailure(engine_result_code) {
	  return (engine_result_code >= -299 && engine_result_code <  199);
	};

	Remote.from_config = function (obj, trace) {
	  var serverConfig = typeof obj === 'string' ? config.servers[obj] : obj;

	  var remote = new Remote(serverConfig, trace);

	  function initialize_account(account) {
	    var accountInfo = config.accounts[account];
	    if (typeof accountInfo === 'object') {
	      if (accountInfo.secret) {
	        // Index by nickname
	        remote.set_secret(account, accountInfo.secret);
	        // Index by account ID
	        remote.set_secret(accountInfo.account, accountInfo.secret);
	      }
	    }
	  };

	  if (typeof config.accounts === 'object') {
	    for (var account in config.accounts) {
	      initialize_account(account);
	    }
	  }

	  return remote;
	};

	Remote.create_remote = function(options, callback) {
	  var remote = Remote.from_config(options);
	  remote.connect(callback);
	  return remote;
	};

	Remote.prototype.addServer = function (opts) {
	  var self = this;

	  var server = new Server(this, {
	    host   : opts.host || opts.websocket_ip,
	    port   : opts.port || opts.websocket_port,
	    secure : opts.secure || opts.websocket_ssl
	  });

	  function server_message(data) {
	    self._handle_message(data, server);
	  };

	  function server_connect() {
	    self._connection_count++;
	    self._set_state('online');
	    if (opts.primary || !self._primary_server) {
	      self._set_primary_server(server);
	    }
	    if (self._connection_count === self._servers.length) {
	      self.emit('ready');
	    }
	  };

	  function server_disconnect() {
	    self._connection_count--;
	    if (!self._connection_count) {
	      self._set_state('offline');
	    }
	  };

	  server.on('message', server_message);
	  server.on('connect', server_connect);
	  server.on('disconnect', server_disconnect);

	  this._servers.push(server);

	  return this;
	};

	// Inform remote that the remote server is not comming back.
	Remote.prototype.serverFatal = function () {
	  this._server_fatal = true;
	};

	// Set the emitted state: 'online' or 'offline'
	Remote.prototype._setState = function (state) {
	  this._trace('remote: set_state: %s', state);

	  if (this.state !== state) {
	    this.state = state;

	    this.emit('state', state);

	    switch (state) {
	      case 'online':
	        this._online_state = 'open';
	        this._connected    = true;
	        this.emit('connect');
	        this.emit('connected');
	        break;

	      case 'offline':
	        this._online_state = 'closed';
	        this._connected    = false;
	        this.emit('disconnect');
	        this.emit('disconnected');
	        break;
	    }
	  }
	};

	Remote.prototype.setTrace = function (trace) {
	  this.trace = trace === void(0) || trace;
	  return this;
	};

	Remote.prototype._trace = function() {
	  if (this.trace) {
	    utils.logObject.apply(utils, arguments);
	  }
	};

	/**
	 * Connect to the Ripple network.
	 */

	Remote.prototype.connect = function (online) {
	  if (!this._servers.length) {
	    throw new Error('No servers available.');
	  }

	  switch (typeof online) {
	    case 'undefined':
	      break;
	    case 'function':
	      this.once('connect', online);
	      break;
	    default:
	      // Downwards compatibility
	      if (!Boolean(online)) {
	        return this.disconnect();
	      }
	  }

	  var self = this;

	  ;(function next_server(i) {
	    var server = self._servers[i];
	    server.connect();
	    server._sid = ++i;

	    if (i < self._servers.length) {
	      setTimeout(function() {
	        next_server(i);
	      }, self._connection_offset);
	    }
	  })(0);

	  return this;
	};

	/**
	 * Disconnect from the Ripple network.
	 */
	Remote.prototype.disconnect = function (online) {
	  if (!this._servers.length) {
	    throw new Error('No servers available, not disconnecting');
	  }

	  this._servers.forEach(function(server) {
	    server.disconnect();
	  });

	  this._set_state('offline');

	  return this;
	};

	// It is possible for messages to be dispatched after the connection is closed.
	Remote.prototype._handleMessage = function (message, server) {
	  var self = this;

	  try { message = JSON.parse(message); } catch(e) { }

	  var unexpected = typeof message !== 'object' || typeof message.type !== 'string';

	  if (unexpected) {
	    // Unexpected response from remote.
	    this.emit('error', new RippleError('remoteUnexpected', 'Unexpected response from remote'));
	    return;
	  }

	  switch (message.type) {
	    case 'response':
	      // Handled by the server that sent the request
	      break;

	    case 'ledgerClosed':
	      // XXX If not trusted, need to verify we consider ledger closed.
	      // XXX Also need to consider a slow server or out of order response.
	      // XXX Be more defensive fields could be missing or of wrong type.
	      // YYY Might want to do some cache management.

	      this._ledger_time           = message.ledger_time;
	      this._ledger_hash           = message.ledger_hash;
	      this._ledger_current_index  = message.ledger_index + 1;

	      this.emit('ledger_closed', message, server);
	      break;

	    case 'transaction':
	      // To get these events, just subscribe to them. A subscribes and
	      // unsubscribes will be added as needed.
	      // XXX If not trusted, need proof.

	      // De-duplicate transactions that are immediately following each other
	      var hash = message.transaction.hash;

	      if (this._received_tx.hasOwnProperty(hash)) break;

	      this._received_tx[hash] = true;

	      this._trace('remote: tx: %s', message);

	      // Process metadata
	      message.mmeta = new Meta(message.meta);

	      // Pass the event on to any related Account objects
	      message.mmeta.getAffectedAccounts().forEach(function(account) {
	        account = self._accounts[account];
	        if (account) account.notify(message);
	      });

	      // Pass the event on to any related OrderBooks
	      message.mmeta.getAffectedBooks().forEach(function(book) {
	        book = self._books[book];
	        if (book) book.notify(message);
	      });

	      this.emit('transaction', message);
	      this.emit('transaction_all', message);
	      break;

	    case 'path_find':
	      // Pass the event to the currently open PathFind object
	      if (this._cur_path_find) {
	        this._cur_path_find.notify_update(message);
	      }

	      this.emit('path_find_all', message);
	      break;
	    case 'serverStatus':
	      self.emit('server_status', message);

	      var load_changed = message.hasOwnProperty('load_base')
	      && message.hasOwnProperty('load_factor')
	      && (message.load_base !== self._load_base || message.load_factor !== self._load_factor)
	      ;

	      if (load_changed) {
	        self._load_base   = message.load_base;
	        self._load_factor = message.load_factor;
	        var obj = {
	          load_base:    self._load_base,
	          load_factor:  self._load_factor,
	          fee_units:    self.fee_tx_unit()
	        }
	        self.emit('load', obj);
	        self.emit('load_changed', obj);
	      }
	      break;

	    // All other messages
	    default:
	      this._trace('remote: ' + message.type + ': %s', message);
	      this.emit('net_' + message.type, message);
	      break;
	  }
	};

	Remote.prototype.ledgerHash = function () {
	  return this._ledger_hash;
	};

	Remote.prototype._setPrimaryServer = function (server) {
	  if (this._primary_server) {
	    this._primary_server._primary = false;
	  }
	  this._primary_server            = server;
	  this._primary_server._primary   = true;
	};

	Remote.prototype._serverIsAvailable = function (server) {
	  return server && server._connected;
	};

	Remote.prototype._nextServer = function () {
	  var result = null;

	  for (var i=0, l=this._servers.length; i<l; i++) {
	    var server = this._servers[i];
	    if (this._server_is_available(server)) {
	      result = server;
	      break;
	    }
	  }

	  return result;
	};

	Remote.prototype._getServer = function () {
	  var server;

	  if (this._server_is_available(this._primary_server)) {
	    server = this._primary_server;
	  } else {
	    server = this._next_server();
	    if (server) {
	      this._set_primary_server(server);
	    }
	  }

	  return server;
	};

	// Send a request.
	// <-> request: what to send, consumed.
	Remote.prototype.request = function(request) {
	  if (typeof request === 'string') {
	    if (!/^request_/.test(request)) request = 'request_' + request;
	    if (this[request]) {
	      var args = Array.prototype.slice.call(arguments, 1);
	      return this[request].apply(this, args);
	    } else {
	      throw new Error('Command does not exist: ' + request);
	    }
	  } else if (!request instanceof Request) {
	    throw new Error('Argument is not a Request');
	  }
	  if (!this._servers.length) {
	    request.emit('error', new Error('No servers available'));
	  } else if (!this._connected) {
	    this.once('connect', this.request.bind(this, request));
	  } else if (request.server === null) {
	    request.emit('error', new Error('Server does not exist'));
	  } else {
	    var server = request.server || this._get_server();
	    if (server) {
	      server.request(request);
	    } else {
	      request.emit('error', new Error('No servers available'));
	    }
	  }
	};

	Remote.prototype.requestServerInfo = function(callback) {
	  return new Request(this, 'server_info').callback(callback);
	};

	// XXX This is a bad command. Some varients don't scale.
	// XXX Require the server to be trusted.
	Remote.prototype.requestLedger = function (ledger, opts, callback) {
	  //utils.assert(this.trusted);

	  var request = new Request(this, 'ledger');

	  if (ledger) {
	    // DEPRECATED: use .ledger_hash() or .ledger_index()
	    //console.log('request_ledger: ledger parameter is deprecated');
	    request.message.ledger  = ledger;
	  }

	  var request_fields = [
	    'full',
	    'expand',
	    'transactions',
	    'accounts'
	  ];

	  switch (typeof opts) {
	    case 'object':
	      for (var key in opts) {
	        if (~request_fields.indexOf(key)) {
	          request.message[key] = true;
	        }
	      }
	      break;

	    case 'function':
	      callback = opts;
	      opts = void(0);
	      break;

	    default:
	      //DEPRECATED
	      this._trace('request_ledger: full parameter is deprecated');
	      request.message.full = true;
	      break;
	  }

	  request.callback(callback);

	  return request;
	};

	// Only for unit testing.
	Remote.prototype.requestLedgerHash = function (callback) {
	  //utils.assert(this.trusted);   // If not trusted, need to check proof.
	  return new Request(this, 'ledger_closed').callback(callback);
	};

	// .ledger()
	// .ledger_index()
	Remote.prototype.requestLedgerHeader = function (callback) {
	  return new Request(this, 'ledger_header').callback(callback);
	};

	// Get the current proposed ledger entry.  May be closed (and revised) at any time (even before returning).
	// Only for unit testing.
	Remote.prototype.requestLedgerCurrent = function (callback) {
	  return new Request(this, 'ledger_current').callback(callback);
	};

	// --> type : the type of ledger entry.
	// .ledger()
	// .ledger_index()
	// .offer_id()
	Remote.prototype.requestLedgerEntry = function (type, callback) {
	  //utils.assert(this.trusted);   // If not trusted, need to check proof, maybe talk packet protocol.

	  var self = this;
	  var request = new Request(this, 'ledger_entry');

	  // Transparent caching. When .request() is invoked, look in the Remote object for the result.
	  // If not found, listen, cache result, and emit it.
	  //
	  // Transparent caching:
	  if (type === 'account_root') {
	    request.request_default = request.request;

	    request.request = function () {                        // Intercept default request.
	      var bDefault  = true;
	      // .self = Remote
	      // this = Request

	      // console.log('request_ledger_entry: caught');

	      //if (self._ledger_hash) {
	        // A specific ledger is requested.
	        // XXX Add caching.
	        // else if (req.ledger_index)
	        // else if ('ripple_state' === request.type)         // YYY Could be cached per ledger.
	      //}

	      if (!self._ledger_hash && type === 'account_root') {
	        var cache = self.ledgers.current.account_root;

	        if (!cache) {
	          cache = self.ledgers.current.account_root = {};
	        }

	        var node = self.ledgers.current.account_root[request.message.account_root];

	        if (node) {
	          // Emulate fetch of ledger entry.
	          // console.log('request_ledger_entry: emulating');
	          // YYY Missing lots of fields.
	          request.emit('success', { node: node });
	          bDefault  = false;
	        } else { // Was not cached.
	          // XXX Only allow with trusted mode.  Must sync response with advance.
	          switch (type) {
	            case 'account_root':
	              request.once('success', function (message) {
	                // Cache node.
	                // console.log('request_ledger_entry: caching');
	                self.ledgers.current.account_root[message.node.Account] = message.node;
	              });
	              break;

	            default:
	              // This type not cached.
	              // console.log('request_ledger_entry: non-cached type');
	          }
	        }
	      }

	      if (bDefault) {
	        // console.log('request_ledger_entry: invoking');
	        request.request_default();
	      }
	    };
	  }

	  request.callback(callback);

	  return request;
	};

	// .accounts(accounts, realtime)
	Remote.prototype.requestSubscribe = function (streams, callback) {
	  var request = new Request(this, 'subscribe');

	  if (streams) {
	    request.message.streams = Array.isArray(streams) ? streams : [ streams ];
	  }

	  request.callback(callback);

	  return request;
	};

	// .accounts(accounts, realtime)
	Remote.prototype.requestUnsubscribe = function (streams, callback) {
	  var request = new Request(this, 'unsubscribe');

	  if (streams) {
	    request.message.streams = Array.isArray(streams) ? streams : [ streams ];
	  }

	  request.callback(callback);

	  return request;
	};

	// .ledger_choose()
	// .ledger_hash()
	// .ledger_index()
	Remote.prototype.requestTransaction =
	Remote.prototype.requestTransactionEntry = function (hash, ledger_hash, callback) {
	  //utils.assert(this.trusted);   // If not trusted, need to check proof, maybe talk packet protocol.
	  var request = new Request(this, 'transaction_entry');

	  request.tx_hash(hash);

	  switch (typeof ledger_hash) {
	    case 'string':
	      request.ledger_hash(ledger_hash);
	      break;
	    default:
	      request.ledger_index('validated');
	      callback = ledger_hash;
	  }

	  request.callback(callback);

	  return request;
	};

	// DEPRECATED: use request_transaction_entry
	Remote.prototype.requestTx = function (hash, callback) {
	  var request = new Request(this, 'tx');

	  request.message.transaction  = hash;
	  request.callback(callback);

	  return request;
	};

	Remote.prototype.requestAccountInfo = function (accountID, callback) {
	  var request = new Request(this, 'account_info');
	  var account = UInt160.json_rewrite(accountID);

	  request.message.ident   = account; //DEPRECATED;
	  request.message.account = account;
	  request.callback(callback);

	  return request;
	};

	Remote.prototype.requestAccountCurrencies = function (accountID, callback) {
	  var request = new Request(this, 'account_currencies');
	  var account = UInt160.json_rewrite(accountID);

	  request.message.ident   = account; //DEPRECATED;
	  request.message.account = account;
	  request.callback(callback);

	  return request;
	};

	Remote.account_request = function(type, accountID, account_index, ledger, callback) {
	  if (typeof accountID === 'object') {
	    var options = accountID;
	    callback      = account_index;
	    ledger        = options.ledger;
	    account_index = options.account_index;
	    accoutID      = options.accountID || options.account;
	  }

	  var request = new Request(this, type);
	  var account = UInt160.json_rewrite(accountID);

	  request.message.ident   = account; //DEPRECATED;
	  request.message.account = account;

	  if (account_index) {
	    request.message.index = account_index;
	  }

	  request.ledger_choose(ledger);
	  request.callback(callback);

	  return request;
	};

	// --> account_index: sub_account index (optional)
	// --> current: true, for the current ledger.
	Remote.prototype.requestAccountLines = function (accountID, account_index, ledger, callback) {
	  // XXX Does this require the server to be trusted?
	  //utils.assert(this.trusted);
	  var args = Array.prototype.slice.call(arguments);
	  args.unshift('account_lines');
	  return Remote.account_request.apply(this, args);
	};

	// --> account_index: sub_account index (optional)
	// --> current: true, for the current ledger.
	Remote.prototype.requestAccountOffers = function (accountID, account_index, ledger, callback) {
	  var args = Array.prototype.slice.call(arguments);
	  args.unshift('account_offers');
	  return Remote.account_request.apply(this, args);
	};

	/*
	  account: account,
	  ledger_index_min: ledger_index, // optional, defaults to -1 if ledger_index_max is specified.
	  ledger_index_max: ledger_index, // optional, defaults to -1 if ledger_index_min is specified.
	  binary: boolean,                // optional, defaults to false
	  count: boolean,                 // optional, defaults to false
	  descending: boolean,            // optional, defaults to false
	  offset: integer,                // optional, defaults to 0
	  limit: integer                  // optional
	*/

	Remote.prototype.requestAccountTx = function (options, callback) {
	  // XXX Does this require the server to be trusted?
	  //utils.assert(this.trusted);

	  var request = new Request(this, 'account_tx');

	  var request_fields = [
	    'account',
	    'ledger_index_min',  //earliest
	    'ledger_index_max',  //latest
	    'binary',            //false
	    'count',             //false
	    'descending',        //false
	    'offset',            //0
	    'limit',

	    //extended account_tx
	    'forward',           //false
	    'marker'
	  ];

	  for (var key in options) {
	    if (~request_fields.indexOf(key)) {
	      request.message[key] = options[key];
	    }
	  }

	  request.callback(callback);

	  return request;
	};

	/**
	 * Request the overall transaction history.
	 *
	 * Returns a list of transactions that happened recently on the network. The
	 * default number of transactions to be returned is 20.
	 */

	Remote.prototype.requestTxHistory = function (start, callback) {
	  // XXX Does this require the server to be trusted?
	  //utils.assert(this.trusted);

	  var request = new Request(this, 'tx_history');

	  request.message.start = start;
	  request.callback(callback);

	  return request;
	};

	Remote.prototype.requestBookOffers = function (gets, pays, taker, callback) {
	  var request = new Request(this, 'book_offers');

	  request.message.taker_gets = {
	    currency: Currency.json_rewrite(gets.currency)
	  };

	  if (request.message.taker_gets.currency !== 'XRP') {
	    request.message.taker_gets.issuer = UInt160.json_rewrite(gets.issuer);
	  }

	  request.message.taker_pays = {
	    currency: Currency.json_rewrite(pays.currency)
	  }

	  if (request.message.taker_pays.currency !== 'XRP') {
	    request.message.taker_pays.issuer = UInt160.json_rewrite(pays.issuer);
	  }

	  request.message.taker = taker ? taker : UInt160.ACCOUNT_ONE;

	  request.callback(callback);

	  return request;
	};

	Remote.prototype.requestWalletAccounts = function (seed, callback) {
	  utils.assert(this.trusted); // Don't send secrets.

	  var request = new Request(this, 'wallet_accounts');
	  request.message.seed = seed;

	  return request.callback(callback);
	};

	Remote.prototype.requestSign = function (secret, tx_json, callback) {
	  utils.assert(this.trusted); // Don't send secrets.

	  var request = new Request(this, 'sign');
	  request.message.secret  = secret;
	  request.message.tx_json = tx_json;
	  request.callback(callback);

	  return request;
	};

	// Submit a transaction.
	Remote.prototype.requestSubmit = function (callback) {
	  return new Request(this, 'submit').callback(callback);
	};

	//
	// Higher level functions.
	//

	/**
	 * Create a subscribe request with current subscriptions.
	 *
	 * Other classes can add their own subscriptions to this request by listening to
	 * the server_subscribe event.
	 *
	 * This function will create and return the request, but not submit it.
	 */

	Remote.prototype._serverPrepareSubscribe = function (callback) {
	  var self  = this;

	  var feeds = [ 'ledger', 'server' ];

	  if (this._transaction_subs) {
	    feeds.push('transactions');
	  }

	  var request = this.request_subscribe(feeds);

	  request.once('success', function (message) {
	    self._stand_alone = !!message.stand_alone;
	    self._testnet     = !!message.testnet;

	    if (typeof message.random === 'string') {
	      var rand = message.random.match(/[0-9A-F]{8}/ig);
	      while (rand && rand.length) {
	        sjcl.random.addEntropy(parseInt(rand.pop(), 16));
	      }
	      self.emit('random', utils.hexToArray(message.random));
	    }

	    if (message.ledger_hash && message.ledger_index) {
	      self._ledger_time           = message.ledger_time;
	      self._ledger_hash           = message.ledger_hash;
	      self._ledger_current_index  = message.ledger_index+1;
	      self.emit('ledger_closed', message);
	    }

	    // FIXME Use this to estimate fee.
	    // XXX When we have multiple server support, most of this should be tracked
	    //     by the Server objects and then aggregated/interpreted by Remote.
	    self._load_base     = message.load_base || 256;
	    self._load_factor   = message.load_factor || 256;
	    self._fee_ref       = message.fee_ref;
	    self._fee_base      = message.fee_base;
	    self._reserve_base  = message.reserve_base;
	    self._reserve_inc   = message.reserve_inc;

	    self.emit('subscribed');
	  });

	  self.emit('prepare_subscribe', request);

	  request.callback(callback);

	  // XXX Could give error events, maybe even time out.

	  return request;
	};

	// For unit testing: ask the remote to accept the current ledger.
	// - To be notified when the ledger is accepted, server_subscribe() then listen to 'ledger_hash' events.
	// A good way to be notified of the result of this is:
	//    remote.once('ledger_closed', function (ledger_closed, ledger_index) { ... } );
	Remote.prototype.ledgerAccept = function (callback) {
	  if (this._stand_alone) {
	    var request = new Request(this, 'ledger_accept');
	    request.request();
	    request.callback(callback);
	  } else {
	    this.emit('error', new RippleError('notStandAlone'));
	  }

	  return this;
	};

	// Return a request to refresh the account balance.
	Remote.prototype.requestAccountBalance = function (account, ledger, callback) {
	  if (typeof account === 'object') {
	    callback = ledger;
	    ledger   = account.ledger;
	    account  = account.account;
	  }

	  var request = this.request_ledger_entry('account_root');
	  request.account_root(account);
	  request.ledger_choose(ledger);

	  request.once('success', function (message) {
	    request.emit('account_balance', Amount.from_json(message.node.Balance));
	  });

	  request.callback(callback, 'account_balance');

	  return request;
	};

	// Return a request to return the account flags.
	Remote.prototype.requestAccountFlags = function (account, ledger, callback) {
	  if (typeof account === 'object') {
	    callback = ledger;
	    ledger   = account.ledger;
	    account  = account.account;
	  }

	  var request = this.request_ledger_entry('account_root');
	  request.account_root(account);
	  request.ledger_choose(ledger);

	  request.once('success', function (message) {
	    request.emit('account_flags', message.node.Flags);
	  });

	  request.callback(callback, 'account_flags');

	  return request;
	};

	// Return a request to emit the owner count.
	Remote.prototype.requestOwnerCount = function (account, ledger, callback) {
	  if (typeof account === 'object') {
	    callback = ledger;
	    ledger   = account.ledger;
	    account  = account.account;
	  }

	  var request = this.request_ledger_entry('account_root');
	  request.account_root(account);
	  request.ledger_choose(ledger);

	  request.once('success', function (message) {
	    request.emit('owner_count', message.node.OwnerCount);
	  });

	  request.callback(callback, 'owner_count');

	  return request;
	};

	Remote.prototype.getAccount = function(accountID) {
	  return this._accounts[UInt160.json_rewrite(accountID)];
	};

	Remote.prototype.addAccount = function(accountID) {
	  var account = new Account(this, accountID);

	  if (account.is_valid()) {
	    this._accounts[accountID] = account;
	  }

	  return account;
	};

	Remote.prototype.account = function (accountID) {
	  var account = this.get_account(accountID);
	  return account ? account : this.add_account(accountID);
	};

	Remote.prototype.pathFind = function (src_account, dst_account, dst_amount, src_currencies) {
	  if (typeof src_account === 'object') {
	    var options = src_account;
	    src_currencies = options.src_currencies;
	    dst_amount     = options.dst_amount;
	    dst_account    = options.dst_account;
	    src_account    = options.src_account;
	  }

	  var path_find = new PathFind(this, src_account, dst_account, dst_amount, src_currencies);

	  if (this._cur_path_find) {
	    this._cur_path_find.notify_superceded();
	  }

	  path_find.create();

	  this._cur_path_find = path_find;

	  return path_find;
	};

	Remote.prepare_trade = function(currency, issuer) {
	  return currency + (currency === 'XRP' ? '' : ('/' + issuer));
	};

	Remote.prototype.book = function (currency_gets, issuer_gets, currency_pays, issuer_pays) {
	  if (typeof currency_gets === 'object') {
	    var options = currency_gets;
	    issuer_pays   = options.issuer_pays;
	    currency_pays = options.currency_pays;
	    issuer_gets   = options.issuer_gets;
	    currency_gets = options.currency_gets;
	  }

	  var gets = Remote.prepare_trade(currency_gets, issuer_gets);
	  var pays = Remote.prepare_trade(currency_pays, issuer_pays);
	  var key = gets + ':' + pays;
	  var book;

	  if (!this._books.hasOwnProperty(key)) {
	    book = new OrderBook(this, currency_gets, issuer_gets, currency_pays, issuer_pays);
	    if (book.is_valid()) {
	      this._books[key] = book;
	    }
	  }

	  return this._books[key];
	};

	// Return the next account sequence if possible.
	// <-- undefined or Sequence
	Remote.prototype.accountSeq = function (account, advance) {
	  var account      = UInt160.json_rewrite(account);
	  var account_info = this.accounts[account];
	  var seq;

	  if (account_info && account_info.seq) {
	    seq = account_info.seq;
	    var change = { ADVANCE: 1, REWIND: -1 }[advance.toUpperCase()] || 0;
	    account_info.seq += change;
	  }

	  return seq;
	};

	Remote.prototype.setAccountSeq = function (account, seq) {
	  var account = UInt160.json_rewrite(account);

	  if (!this.accounts.hasOwnProperty(account)) {
	    this.accounts[account] = { };
	  }

	  this.accounts[account].seq = seq;
	}

	// Return a request to refresh accounts[account].seq.
	Remote.prototype.accountSeqCache = function (account, ledger, callback) {
	  if (typeof account === 'object') {
	    var options = account;
	    callback = ledger;
	    ledger   = options.ledger;
	    account  = options.account;
	  }

	  var self = this;

	  if (!this.accounts.hasOwnProperty(account)) {
	    this.accounts[account] = { };
	  }

	  var account_info = this.accounts[account];
	  var request      = account_info.caching_seq_request;

	  if (!request) {
	    // console.log('starting: %s', account);
	    request = this.request_ledger_entry('account_root');
	    request.account_root(account);
	    request.ledger_choose(ledger);

	    function account_root_success(message) {
	      delete account_info.caching_seq_request;

	      var seq = message.node.Sequence;
	      account_info.seq  = seq;

	      // console.log('caching: %s %d', account, seq);
	      // If the caller also waits for 'success', they might run before this.
	      request.emit('success_account_seq_cache', message);
	    }

	    function account_root_error(message) {
	      // console.log('error: %s', account);
	      delete account_info.caching_seq_request;

	      request.emit('error_account_seq_cache', message);
	    }

	    request.once('success', account_root_success);
	    request.once('error', account_root_error);

	    account_info.caching_seq_request = request;
	  }

	  request.callback(callback, 'success_account_seq_cache', 'error_account_seq_cache');

	  return request;
	};

	// Mark an account's root node as dirty.
	Remote.prototype.dirtyAccountRoot = function (account) {
	  var account = UInt160.json_rewrite(account);
	  delete this.ledgers.current.account_root[account];
	};

	// Store a secret - allows the Remote to automatically fill out auth information.
	Remote.prototype.setSecret = function (account, secret) {
	  this.secrets[account] = secret;
	};

	// Return a request to get a ripple balance.
	//
	// --> account: String
	// --> issuer: String
	// --> currency: String
	// --> current: bool : true = current ledger
	//
	// If does not exist: emit('error', 'error' : 'remoteError', 'remote' : { 'error' : 'entryNotFound' })
	Remote.prototype.requestRippleBalance = function (account, issuer, currency, ledger, callback) {
	  if (typeof account === 'object') {
	    var options = account;
	    callback = issuer;
	    ledger   = options.ledger;
	    currency = options.currency;
	    issuer   = options.issuer;
	    account  = options.account;
	  }

	  var request = this.request_ledger_entry('ripple_state'); // YYY Could be cached per ledger.

	  request.ripple_state(account, issuer, currency);
	  request.ledger_choose(ledger);
	  request.once('success', function(message) {
	    var node            = message.node;
	    var lowLimit        = Amount.from_json(node.LowLimit);
	    var highLimit       = Amount.from_json(node.HighLimit);
	    // The amount the low account holds of issuer.
	    var balance         = Amount.from_json(node.Balance);
	    // accountHigh implies: for account: balance is negated, highLimit is the limit set by account.
	    var accountHigh     = UInt160.from_json(account).equals(highLimit.issuer());

	    request.emit('ripple_state', {
	      account_balance     : ( accountHigh ? balance.negate() : balance.clone()).parse_issuer(account),
	      peer_balance        : (!accountHigh ? balance.negate() : balance.clone()).parse_issuer(issuer),

	      account_limit       : ( accountHigh ? highLimit : lowLimit).clone().parse_issuer(issuer),
	      peer_limit          : (!accountHigh ? highLimit : lowLimit).clone().parse_issuer(account),

	      account_quality_in  : ( accountHigh ? node.HighQualityIn : node.LowQualityIn),
	      peer_quality_in     : (!accountHigh ? node.HighQualityIn : node.LowQualityIn),

	      account_quality_out : ( accountHigh ? node.HighQualityOut : node.LowQualityOut),
	      peer_quality_out    : (!accountHigh ? node.HighQualityOut : node.LowQualityOut),
	    });
	  });

	  request.callback(callback, 'ripple_state');

	  return request;
	};

	Remote.prepare_currencies = function(ci) {
	  var ci_new  = { };

	  if (ci.hasOwnProperty('issuer')) {
	    ci_new.issuer = UInt160.json_rewrite(ci.issuer);
	  }

	  if (ci.hasOwnProperty('currency')) {
	    ci_new.currency = Currency.json_rewrite(ci.currency);
	  }

	  return ci_new;
	};

	Remote.prototype.requestRipplePathFind = function (src_account, dst_account, dst_amount, src_currencies, callback) {
	  if (typeof src_account === 'object') {
	    var options = src_account;
	    callback       = dst_account;
	    src_currencies = options.src_currencies;
	    dst_amount     = options.dst_amount;
	    dst_account    = options.dst_account;
	    src_account    = options.src_account;
	  }

	  var request = new Request(this, 'ripple_path_find');

	  request.message.source_account      = UInt160.json_rewrite(src_account);
	  request.message.destination_account = UInt160.json_rewrite(dst_account);
	  request.message.destination_amount  = Amount.json_rewrite(dst_amount);

	  if (src_currencies) {
	    request.message.source_currencies = src_currencies.map(Remote.prepare_currencies);
	  }

	  request.callback(callback);

	  return request;
	};

	Remote.prototype.requestPathFindCreate = function (src_account, dst_account, dst_amount, src_currencies, callback) {
	  if (typeof src_account === 'object') {
	    var options = src_account;
	    callback       = dst_account;
	    src_currencies = options.src_currencies;
	    dst_amount     = options.dst_amount;
	    dst_account    = options.dst_account;
	    src_account    = options.src_account;
	  }

	  var request = new Request(this, 'path_find');

	  request.message.subcommand          = 'create';
	  request.message.source_account      = UInt160.json_rewrite(src_account);
	  request.message.destination_account = UInt160.json_rewrite(dst_account);
	  request.message.destination_amount  = Amount.json_rewrite(dst_amount);

	  if (src_currencies) {
	    request.message.source_currencies = src_currencies.map(Remote.prepare_currencies);
	  }

	  request.callback(callback);

	  return request;
	};

	Remote.prototype.requestPathFindClose = function () {
	  var request = new Request(this, 'path_find');

	  request.message.subcommand = 'close';

	  return request;
	};

	Remote.prototype.requestUnlList = function (callback) {
	  return new Request(this, 'unl_list').callback(callback);
	};

	Remote.prototype.requestUnlAdd = function (addr, comment, callback) {
	  var request = new Request(this, 'unl_add');

	  request.message.node = addr;

	  if (comment) {
	    // note is not specified anywhere, should remove?
	    var note = undefined; 
	    request.message.comment = note;
	  }

	  request.callback(callback);

	  return request;
	};

	// --> node: <domain> | <public_key>
	Remote.prototype.requestUnlDelete = function (node, callback) {
	  var request = new Request(this, 'unl_delete');

	  request.message.node = node;
	  request.callback(callback);

	  return request;
	};

	Remote.prototype.requestPeers = function (callback) {
	  return new Request(this, 'peers').callback(callback);
	};

	Remote.prototype.requestConnect = function (ip, port, callback) {
	  var request = new Request(this, 'connect');

	  request.message.ip = ip;

	  if (port) {
	    request.message.port = port;
	  }

	  request.callback(callback);

	  return request;
	};

	Remote.prototype.transaction = function (source, destination, amount, callback) {
	  var tx = new Transaction(this);

	  if (arguments.length >= 3) {
	    tx = tx.payment(source, destination, amount);
	    if (typeof callback === 'function') {
	      tx.submit(callback);
	    }
	  }

	  return tx;
	};

	/**
	 * Calculate a transaction fee for a number of tx fee units.
	 *
	 * This takes into account the last known network and local load fees.
	 *
	 * @return {Amount} Final fee in XRP for specified number of fee units.
	 */
	Remote.prototype.feeTx = function (units) {
	  var fee_unit = this.fee_tx_unit();
	  return Amount.from_json(String(Math.ceil(units * fee_unit)));
	};

	/**
	 * Get the current recommended transaction fee unit.
	 *
	 * Multiply this value with the number of fee units in order to calculate the
	 * recommended fee for the transaction you are trying to submit.
	 *
	 * @return {Number} Recommended amount for one fee unit as float.
	 */
	Remote.prototype.feeTxUnit = function () {
	  var fee_unit = this._fee_base / this._fee_ref;

	  // Apply load fees
	  fee_unit *= this._load_factor / this._load_base;

	  // Apply fee cushion (a safety margin in case fees rise since we were last updated
	  fee_unit *= this.fee_cushion;

	  return fee_unit;
	};

	/**
	 * Get the current recommended reserve base.
	 *
	 * Returns the base reserve with load fees and safety margin applied.
	 */
	Remote.prototype.reserve = function (owner_count) {
	  var reserve_base = Amount.from_json(String(this._reserve_base));
	  var reserve_inc  = Amount.from_json(String(this._reserve_inc));
	  var owner_count  = owner_count || 0;

	  if (owner_count < 0) {
	    throw new Error('Owner count must not be negative.');
	  }

	  return reserve_base.add(reserve_inc.product_human(owner_count));
	};

	Remote.prototype.ping = function(host, callback) {
	  var request = new Request(this, 'ping');

	  switch (typeof host) {
	    case 'function':
	      callback = host;
	      break;
	    case 'string':
	      request.set_server(host);
	      break;
	  }

	  var then = Date.now();

	  request.once('success', function() {
	    request.emit('pong', Date.now() - then);
	  });

	  request.callback(callback, 'pong');

	  return request;
	};

	Object.keys(Remote.prototype).forEach(function(key) {
	  var UPPERCASE = /[A-Z]/;

	  if (!UPPERCASE.test(key)) return;

	  var underscored = '';

	  for (var i=0; i<key.length; i++) {
	    if (UPPERCASE.test(key[i])) {
	      underscored += '_';
	    }
	    underscored += key[i].toLowerCase();
	  }

	  Remote.prototype[underscored] = Remote.prototype[key];
	});

	exports.Remote = Remote;

	// vim:sw=2:sts=2:ts=8:et


/***/ },

/***/ 2:
/***/ function(module, exports, require) {

	var EventEmitter = require(25).EventEmitter;
	var util         = require(26);
	var UInt160      = require(15).UInt160;
	var Currency     = require(4).Currency;
	var Transaction  = require(6).Transaction;
	var Account      = require(16).Account;
	var Meta         = require(7).Meta;
	var OrderBook    = require(17).OrderBook;
	var RippleError  = require(9).RippleError;

	// Request events emitted:
	//  'success' : Request successful.
	//  'error'   : Request failed.
	//  'remoteError'
	//  'remoteUnexpected'
	//  'remoteDisconnected'
	function Request(remote, command) {
	  EventEmitter.call(this);

	  this.remote     = remote;
	  this.requested  = false;
	  this.message    = {
	    command : command,
	    id      : void(0)
	  };
	};

	util.inherits(Request, EventEmitter);

	Request.prototype.broadcast = function() {
	  this._broadcast = true;
	  return this.request();
	};

	// Send the request to a remote.
	Request.prototype.request = function (remote) {
	  if (this.requested) return;

	  this.requested = true;
	  this.on('error', new Function);
	  this.emit('request', remote);

	  if (this._broadcast) {
	    this.remote._servers.forEach(function(server) {
	      this.set_server(server);
	      this.remote.request(this);
	    }, this );
	  } else {
	    this.remote.request(this);
	  }

	  return this;
	};

	Request.prototype.callback = function(callback, successEvent, errorEvent) {
	  if (callback && typeof callback === 'function') {
	    var self = this;

	    function request_success(message) {
	      callback.call(self, null, message);
	    }

	    function request_error(error) {
	      if (!(error instanceof RippleError)) {
	        error = new RippleError(error);
	      }
	      callback.call(self, error);
	    }

	    this.once(successEvent || 'success', request_success);
	    this.once(errorEvent   || 'error'  , request_error);
	    this.request();
	  }

	  return this;
	};

	Request.prototype.timeout = function(duration, callback) {
	  var self = this;

	  if (!this.requested) {
	    function requested() {
	      self.timeout(duration, callback);
	    }
	    this.once('request', requested);
	    return;
	  }

	  var emit      = this.emit;
	  var timed_out = false;

	  var timeout = setTimeout(function() {
	    timed_out = true;
	    if (typeof callback === 'function') callback();
	    emit.call(self, 'timeout');
	  }, duration);

	  this.emit = function() {
	    if (!timed_out) {
	      clearTimeout(timeout);
	      emit.apply(self, arguments);
	    }
	  };

	  return this;
	};

	Request.prototype.set_server = function(server) {
	  var selected = null;

	  switch (typeof server) {
	    case 'object':
	      selected = server;
	      break;
	    case 'string':
	      for (var i=0, s; s=this.remote._servers[i]; i++) {
	        if (s._host === server) {
	          selected = s;
	          break;
	        }
	      }
	      break;
	  };

	  this.server = selected;
	};

	Request.prototype.build_path = function (build) {
	  if (build) {
	    this.message.build_path = true;
	  }
	  return this;
	};

	Request.prototype.ledger_choose = function (current) {
	  if (current) {
	    this.message.ledger_index = this.remote._ledger_current_index;
	  } else {
	    this.message.ledger_hash  = this.remote._ledger_hash;
	  }
	  return this;
	};

	// Set the ledger for a request.
	// - ledger_entry
	// - transaction_entry
	Request.prototype.ledger_hash = function (hash) {
	  this.message.ledger_hash  = hash;
	  return this;
	};

	// Set the ledger_index for a request.
	// - ledger_entry
	Request.prototype.ledger_index = function (ledger_index) {
	  this.message.ledger_index  = ledger_index;
	  return this;
	};

	Request.prototype.ledger_select = function (ledger_spec) {
	  switch (ledger_spec) {
	    case 'current':
	    case 'closed':
	    case 'verified':
	      this.message.ledger_index = ledger_spec;
	      break;

	    default:
	      // XXX Better test needed
	      if (Number(ledger_spec)) {
	        this.message.ledger_index = ledger_spec;
	      } else {
	        this.message.ledger_hash  = ledger_spec;
	      }
	      break;
	  }

	  return this;
	};

	Request.prototype.account_root = function (account) {
	  this.message.account_root  = UInt160.json_rewrite(account);
	  return this;
	};

	Request.prototype.index = function (hash) {
	  this.message.index  = hash;
	  return this;
	};

	// Provide the information id an offer.
	// --> account
	// --> seq : sequence number of transaction creating offer (integer)
	Request.prototype.offer_id = function (account, seq) {
	  this.message.offer = {
	    account:  UInt160.json_rewrite(account),
	    seq:      seq
	  };
	  return this;
	};

	// --> index : ledger entry index.
	Request.prototype.offer_index = function (index) {
	  this.message.offer  = index;
	  return this;
	};

	Request.prototype.secret = function (secret) {
	  if (secret) {
	    this.message.secret  = secret;
	  }
	  return this;
	};

	Request.prototype.tx_hash = function (hash) {
	  this.message.tx_hash  = hash;
	  return this;
	};

	Request.prototype.tx_json = function (json) {
	  this.message.tx_json  = json;
	  return this;
	};

	Request.prototype.tx_blob = function (json) {
	  this.message.tx_blob  = json;
	  return this;
	};

	Request.prototype.ripple_state = function (account, issuer, currency) {
	  this.message.ripple_state  = {
	    currency : currency,
	    accounts : [
	      UInt160.json_rewrite(account),
	      UInt160.json_rewrite(issuer)
	    ]
	  };
	  return this;
	};

	Request.prototype.accounts = function (accounts, realtime) {
	  if (!Array.isArray(accounts)) {
	    accounts = [ accounts ];
	  }

	  // Process accounts parameters
	  var processedAccounts = accounts.map(function(account) {
	    return UInt160.json_rewrite(account);
	  });

	  if (realtime) {
	    this.message.rt_accounts = processedAccounts;
	  } else {
	    this.message.accounts = processedAccounts;
	  }

	  return this;
	};

	Request.prototype.add_account  = function(account, realtime) {
	  var processedAccount = UInt160.json_rewrite(account);

	  if (realtime) {
	    this.message.rt_accounts = (this.message.rt_accounts || []).concat(processedAccount);
	  } else {
	    this.message.accounts = (this.message.accounts || []).concat(processedAccount);
	  }

	  return this;
	};

	Request.prototype.rt_accounts = function (accounts) {
	  return this.accounts(accounts, true);
	};

	Request.prototype.books = function (books, snapshot) {
	  var processedBooks = [ ];

	  for (var i = 0, l = books.length; i < l; i++) {
	    var book = books[i];
	    var json = { };

	    function processSide(side) {
	      if (!book[side]) {
	        throw new Error('Missing ' + side);
	      }

	      var obj = json[side] = {
	        currency: Currency.json_rewrite(book[side].currency)
	      };
	      if (obj.currency !== 'XRP') {
	        obj.issuer = UInt160.json_rewrite(book[side].issuer);
	      }
	    }

	    processSide('taker_gets');
	    processSide('taker_pays');

	    if (snapshot) {
	      json.snapshot = true;
	    }

	    if (book.both) {
	      json.both = true;
	    }

	    processedBooks.push(json);
	  }

	  this.message.books = processedBooks;

	  return this;
	};

	exports.Request = Request;


/***/ },

/***/ 3:
/***/ function(module, exports, require) {

	// Represent Ripple amounts and currencies.
	// - Numbers in hex are big-endian.

	var utils = require(11);
	var sjcl  = utils.sjcl;
	var bn    = sjcl.bn;

	var BigInteger = utils.jsbn.BigInteger;

	var UInt160  = require(15).UInt160;
	var Seed     = require(19).Seed;
	var Currency = require(4).Currency;

	var consts = exports.consts = {
	  currency_xns:      0,
	  currency_one:      1,
	  xns_precision:     6,

	  // BigInteger values prefixed with bi_.
	  bi_5:              new BigInteger('5'),
	  bi_7:              new BigInteger('7'),
	  bi_10:             new BigInteger('10'),
	  bi_1e14:           new BigInteger(String(1e14)),
	  bi_1e16:           new BigInteger(String(1e16)),
	  bi_1e17:           new BigInteger(String(1e17)),
	  bi_1e32:           new BigInteger('100000000000000000000000000000000'),
	  bi_man_max_value:  new BigInteger('9999999999999999'),
	  bi_man_min_value:  new BigInteger('1000000000000000'),
	  bi_xns_max:        new BigInteger('9000000000000000000'), // Json wire limit.
	  bi_xns_min:        new BigInteger('-9000000000000000000'),// Json wire limit.
	  bi_xns_unit:       new BigInteger('1000000'),

	  cMinOffset:        -96,
	  cMaxOffset:        80,
	};


	//
	// Amount class in the style of Java's BigInteger class
	// http://docs.oracle.com/javase/1.3/docs/api/java/math/BigInteger.html
	//

	function Amount() {
	  // Json format:
	  //  integer : XRP
	  //  { 'value' : ..., 'currency' : ..., 'issuer' : ...}

	  this._value       = new BigInteger(); // NaN for bad value. Always positive.
	  this._offset      = 0; // Always 0 for XRP.
	  this._is_native   = true; // Default to XRP. Only valid if value is not NaN.
	  this._is_negative = false;
	  this._currency    = new Currency();
	  this._issuer      = new UInt160();
	};

	// Given '100/USD/mtgox' return the a string with mtgox remapped.
	Amount.text_full_rewrite = function (j) {
	  return Amount.from_json(j).to_text_full();
	};

	// Given '100/USD/mtgox' return the json.
	Amount.json_rewrite = function (j) {
	  return Amount.from_json(j).to_json();
	};

	Amount.from_number = function (n) {
	  return (new Amount()).parse_number(n);
	};

	Amount.from_json = function (j) {
	  return (new Amount()).parse_json(j);
	};

	Amount.from_quality = function (q, c, i) {
	  return (new Amount()).parse_quality(q, c, i);
	};

	Amount.from_human = function (j) {
	  return (new Amount()).parse_human(j);
	};

	Amount.is_valid = function (j) {
	  return Amount.from_json(j).is_valid();
	};

	Amount.is_valid_full = function (j) {
	  return Amount.from_json(j).is_valid_full();
	};

	Amount.NaN = function () {
	  var result = new Amount();
	  result._value = NaN;
	  return result;
	};

	// Returns a new value which is the absolute value of this.
	Amount.prototype.abs = function () {
	  return this.clone(this.is_negative());
	};

	// Result in terms of this' currency and issuer.
	Amount.prototype.add = function (v) {
	  var result;

	  v = Amount.from_json(v);

	  if (!this.is_comparable(v)) {
	    result              = Amount.NaN();
	  } else if (v.is_zero()) {
	    result              = this;
	  } else if (this.is_zero()) {
	    result              = v.clone();
	    result._is_native   = this._is_native;
	    result._currency    = this._currency;
	    result._issuer      = this._issuer;
	  } else if (this._is_native) {
	    result              = new Amount();

	    var v1  = this._is_negative ? this._value.negate() : this._value;
	    var v2  = v._is_negative ? v._value.negate() : v._value;
	    var s   = v1.add(v2);

	    result._is_negative = s.compareTo(BigInteger.ZERO) < 0;
	    result._value       = result._is_negative ? s.negate() : s;
	    result._currency    = this._currency;
	    result._issuer      = this._issuer;
	  } else {
	    var v1  = this._is_negative ? this._value.negate() : this._value;
	    var o1  = this._offset;
	    var v2  = v._is_negative ? v._value.negate() : v._value;
	    var o2  = v._offset;

	    while (o1 < o2) {
	      v1  = v1.divide(consts.bi_10);
	      o1  += 1;
	    }

	    while (o2 < o1) {
	      v2  = v2.divide(consts.bi_10);
	      o2  += 1;
	    }

	    result              = new Amount();
	    result._is_native   = false;
	    result._offset      = o1;
	    result._value       = v1.add(v2);
	    result._is_negative = result._value.compareTo(BigInteger.ZERO) < 0;

	    if (result._is_negative) {
	      result._value       = result._value.negate();
	    }

	    result._currency    = this._currency;
	    result._issuer      = this._issuer;

	    result.canonicalize();
	  }

	  return result;
	};

	Amount.prototype.canonicalize = function () {
	  if (!(this._value instanceof BigInteger)) {
	    // NaN.
	    // nothing
	  } else if (this._is_native) {
	    // Native.
	    if (this._value.equals(BigInteger.ZERO)) {
	      this._offset      = 0;
	      this._is_negative = false;
	    } else {
	      // Normalize _offset to 0.

	      while (this._offset < 0) {
	        this._value  = this._value.divide(consts.bi_10);
	        this._offset += 1;
	      }

	      while (this._offset > 0) {
	        this._value  = this._value.multiply(consts.bi_10);
	        this._offset -= 1;
	      }
	    }

	    // XXX Make sure not bigger than supported. Throw if so.
	  } else if (this.is_zero()) {
	    this._offset      = -100;
	    this._is_negative = false;
	  } else {
	    // Normalize mantissa to valid range.

	    while (this._value.compareTo(consts.bi_man_min_value) < 0) {
	      this._value  = this._value.multiply(consts.bi_10);
	      this._offset -= 1;
	    }

	    while (this._value.compareTo(consts.bi_man_max_value) > 0) {
	      this._value  = this._value.divide(consts.bi_10);
	      this._offset += 1;
	    }
	  }

	  return this;
	};

	Amount.prototype.clone = function (negate) {
	  return this.copyTo(new Amount(), negate);
	};

	Amount.prototype.compareTo = function (v) {
	  var result;

	  if (!this.is_comparable(v)) {
	    result  = Amount.NaN();
	  } else if (this._is_negative !== v._is_negative) {
	    // Different sign.
	    result  = this._is_negative ? -1 : 1;
	  } else if (this._value.equals(BigInteger.ZERO)) {
	    // Same sign: positive.
	    result  = v._value.equals(BigInteger.ZERO) ? 0 : -1;
	  } else if (v._value.equals(BigInteger.ZERO)) {
	    // Same sign: positive.
	    result  = 1;
	  } else if (!this._is_native && this._offset > v._offset) {
	    result  = this._is_negative ? -1 : 1;
	  } else if (!this._is_native && this._offset < v._offset) {
	    result  = this._is_negative ? 1 : -1;
	  } else {
	    result  = this._value.compareTo(v._value);
	    if (result > 0) {
	      result  = this._is_negative ? -1 : 1;
	    } else if (result < 0) {
	      result  = this._is_negative ? 1 : -1;
	    }
	  }

	  return result;
	};

	// Make d a copy of this. Returns d.
	// Modification of objects internally refered to is not allowed.
	Amount.prototype.copyTo = function (d, negate) {
	  if (typeof this._value === 'object') {
	    this._value.copyTo(d._value);
	  } else {
	    d._value   = this._value;
	  }

	  d._offset = this._offset;
	  d._is_native = this._is_native;
	  d._is_negative  = negate
	    ? !this._is_negative    // Negating.
	    : this._is_negative;    // Just copying.

	  d._currency     = this._currency;
	  d._issuer       = this._issuer;

	  // Prevent negative zero
	  if (d.is_zero()) {
	    d._is_negative = false;
	  }

	  return d;
	};

	Amount.prototype.currency = function () {
	  return this._currency;
	};

	Amount.prototype.equals = function (d, ignore_issuer) {
	  if (typeof d === 'string') {
	    return this.equals(Amount.from_json(d));
	  }

	  var result = true;

	  result = !((!this.is_valid() || !d.is_valid())
	             || (this._is_native !== d._is_native)
	             || (!this._value.equals(d._value) || this._offset !== d._offset)
	             || (this._is_negative !== d._is_negative)
	             || (!this._is_native && (!this._currency.equals(d._currency) || !ignore_issuer && !this._issuer.equals(d._issuer))))

	  return result;
	};

	// Result in terms of this' currency and issuer.
	Amount.prototype.divide = function (d) {
	  var result;

	  if (d.is_zero()) {
	    throw 'divide by zero';
	  }

	  if (this.is_zero()) {
	    result = this;
	  } else if (!this.is_valid()) {
	    throw new Error('Invalid dividend');
	  } else if (!d.is_valid()) {
	    throw new Error('Invalid divisor');
	  } else {
	    var _n = this;

	    if (_n.is_native()) {
	      _n  = _n.clone();

	      while (_n._value.compareTo(consts.bi_man_min_value) < 0) {
	        _n._value  = _n._value.multiply(consts.bi_10);
	        _n._offset -= 1;
	      }
	    }

	    var _d = d;

	    if (_d.is_native()) {
	      _d = _d.clone();

	      while (_d._value.compareTo(consts.bi_man_min_value) < 0) {
	        _d._value  = _d._value.multiply(consts.bi_10);
	        _d._offset -= 1;
	      }
	    }

	    result              = new Amount();
	    result._offset      = _n._offset - _d._offset - 17;
	    result._value       = _n._value.multiply(consts.bi_1e17).divide(_d._value).add(consts.bi_5);
	    result._is_native   = _n._is_native;
	    result._is_negative = _n._is_negative !== _d._is_negative;
	    result._currency    = _n._currency;
	    result._issuer      = _n._issuer;

	    result.canonicalize();
	  }

	  return result;
	};

	/**
	 * Calculate a ratio between two amounts.
	 *
	 * This function calculates a ratio - such as a price - between two Amount
	 * objects.
	 *
	 * The return value will have the same type (currency) as the numerator. This is
	 * a simplification, which should be sane in most cases. For example, a USD/XRP
	 * price would be rendered as USD.
	 *
	 * @example
	 *   var price = buy_amount.ratio_human(sell_amount);
	 *
	 * @this {Amount} The numerator (top half) of the fraction.
	 * @param {Amount} denominator The denominator (bottom half) of the fraction.
	 * @return {Amount} The resulting ratio. Unit will be the same as numerator.
	 */
	Amount.prototype.ratio_human = function (denominator) {
	  if (typeof denominator === 'number' && parseInt(denominator, 10) === denominator) {
	    // Special handling of integer arguments
	    denominator = Amount.from_json('' + denominator + '.0');
	  } else {
	    denominator = Amount.from_json(denominator);
	  }

	  var numerator = this;
	  denominator = Amount.from_json(denominator);

	  // If either operand is NaN, the result is NaN.
	  if (!numerator.is_valid() || !denominator.is_valid()) {
	    return Amount.NaN();
	  }

	  // Special case: The denominator is a native (XRP) amount.
	  //
	  // In that case, it's going to be expressed as base units (1 XRP =
	  // 10^xns_precision base units).
	  //
	  // However, the unit of the denominator is lost, so when the resulting ratio
	  // is printed, the ratio is going to be too small by a factor of
	  // 10^xns_precision.
	  //
	  // To compensate, we multiply the numerator by 10^xns_precision.
	  if (denominator._is_native) {
	    numerator = numerator.clone();
	    numerator._value = numerator._value.multiply(consts.bi_xns_unit);
	    numerator.canonicalize();
	  }

	  return numerator.divide(denominator);
	};

	/**
	 * Calculate a product of two amounts.
	 *
	 * This function allows you to calculate a product between two amounts which
	 * retains XRPs human/external interpretation (i.e. 1 XRP = 1,000,000 base
	 * units).
	 *
	 * Intended use is to calculate something like: 10 USD * 10 XRP/USD = 100 XRP
	 *
	 * @example
	 *   var sell_amount = buy_amount.product_human(price);
	 *
	 * @see Amount#ratio_human
	 *
	 * @this {Amount} The first factor of the product.
	 * @param {Amount} factor The second factor of the product.
	 * @return {Amount} The product. Unit will be the same as the first factor.
	 */
	Amount.prototype.product_human = function (factor) {
	  if (typeof factor === 'number' && parseInt(factor, 10) === factor) {
	    // Special handling of integer arguments
	    factor = Amount.from_json(String(factor) + '.0');
	  } else {
	    factor = Amount.from_json(factor);
	  }

	  // If either operand is NaN, the result is NaN.
	  if (!this.is_valid() || !factor.is_valid()) {
	    return Amount.NaN();
	  }

	  var product = this.multiply(factor);

	  // Special case: The second factor is a native (XRP) amount expressed as base
	  // units (1 XRP = 10^xns_precision base units).
	  //
	  // See also Amount#ratio_human.
	  if (factor._is_native) {
	    product._value = product._value.divide(consts.bi_xns_unit);
	    product.canonicalize();
	  }

	  return product;
	}

	// True if Amounts are valid and both native or non-native.
	Amount.prototype.is_comparable = function (v) {
	  return this._value instanceof BigInteger
	    && v._value instanceof BigInteger
	    && this._is_native === v._is_native;
	};

	Amount.prototype.is_native = function () {
	  return this._is_native;
	};

	Amount.prototype.is_negative = function () {
	  return this._value instanceof BigInteger
	          ? this._is_negative
	          : false;                          // NaN is not negative
	};

	Amount.prototype.is_positive = function () {
	  return !this.is_zero() && !this.is_negative();
	};

	// Only checks the value. Not the currency and issuer.
	Amount.prototype.is_valid = function () {
	  return this._value instanceof BigInteger;
	};

	Amount.prototype.is_valid_full = function () {
	  return this.is_valid() && this._currency.is_valid() && this._issuer.is_valid();
	};

	Amount.prototype.is_zero = function () {
	  return this._value instanceof BigInteger ? this._value.equals(BigInteger.ZERO) : false;
	};

	Amount.prototype.issuer = function () {
	  return this._issuer;
	};

	// Result in terms of this' currency and issuer.
	// XXX Diverges from cpp.
	Amount.prototype.multiply = function (v) {
	  var result;

	  if (this.is_zero()) {
	    result = this;
	  } else if (v.is_zero()) {
	    result = this.clone();
	    result._value = BigInteger.ZERO;
	  } else {
	    var v1 = this._value;
	    var o1 = this._offset;
	    var v2 = v._value;
	    var o2 = v._offset;

	    if (this.is_native()) {
	      while (v1.compareTo(consts.bi_man_min_value) < 0) {
	        v1 = v1.multiply(consts.bi_10);
	        o1 -= 1;
	      }
	    }

	    if (v.is_native()) {
	      while (v2.compareTo(consts.bi_man_min_value) < 0) {
	        v2 = v2.multiply(consts.bi_10);
	        o2 -= 1;
	      }
	    }

	    result              = new Amount();
	    result._offset      = o1 + o2 + 14;
	    result._value       = v1.multiply(v2).divide(consts.bi_1e14).add(consts.bi_7);
	    result._is_native   = this._is_native;
	    result._is_negative = this._is_negative !== v._is_negative;
	    result._currency    = this._currency;
	    result._issuer      = this._issuer;

	    result.canonicalize();
	  }

	  return result;
	};

	// Return a new value.
	Amount.prototype.negate = function () {
	  return this.clone('NEGATE');
	};

	/**
	 * Invert this amount and return the new value.
	 *
	 * Creates a new Amount object as a copy of the current one (including the same
	 * unit (currency & issuer), inverts it (1/x) and returns the result.
	 */
	Amount.prototype.invert = function () {
	  var one          = this.clone();
	  one._value       = BigInteger.ONE;
	  one._offset      = 0;
	  one._is_negative = false;

	  one.canonicalize();

	  return one.ratio_human(this);
	};

	/**
	 * Tries to correctly interpret an amount as entered by a user.
	 *
	 * Examples:
	 *
	 *   XRP 250     => 250000000/XRP
	 *   25.2 XRP    => 25200000/XRP
	 *   USD 100.40  => 100.4/USD/?
	 *   100         => 100000000/XRP
	 */
	Amount.human_RE = /^\s*([a-z]{3})?\s*(-)?(\d+)(?:\.(\d*))?\s*([a-z]{3})?\s*$/i;

	Amount.prototype.parse_human = function (j) {
	  var m = String(j).match(Amount.human_RE);

	  if (m) {
	    var currency   = m[1] || m[5] || 'XRP';
	    var integer    = m[3] || '0';
	    var fraction   = m[4] || '';
	    var precision  = null;

	    currency = currency.toUpperCase();

	    this._value = new BigInteger(integer);
	    this.set_currency(currency);

	    // XRP have exactly six digits of precision
	    if (currency === 'XRP') {
	      fraction = fraction.slice(0, 6);
	      while (fraction.length < 6) {
	        fraction += '0';
	      }
	      this._is_native = true;
	      this._value     = this._value.multiply(consts.bi_xns_unit).add(new BigInteger(fraction));
	    } else {
	      // Other currencies have arbitrary precision
	      fraction  = fraction.replace(/0+$/, '');
	      precision = fraction.length;

	      this._is_native = false;
	      var multiplier  = consts.bi_10.clone().pow(precision);
	      this._value     = this._value.multiply(multiplier).add(new BigInteger(fraction));
	      this._offset    = -precision;

	      this.canonicalize();
	    }

	    this._is_negative = !!m[2];
	  } else {
	    this._value = NaN;
	  }

	  return this;
	};

	Amount.prototype.parse_issuer = function (issuer) {
	  this._issuer  = UInt160.from_json(issuer);

	  return this;
	};

	// --> h: 8 hex bytes quality or 32 hex bytes directory index.
	Amount.prototype.parse_quality = function (q, c, i) {
	  this._is_negative = false;
	  this._value       = new BigInteger(q.substring(q.length-14), 16);
	  this._offset      = parseInt(q.substring(q.length-16, q.length-14), 16)-100;
	  this._currency    = Currency.from_json(c);
	  this._issuer      = UInt160.from_json(i);
	  this._is_native   = this._currency.is_native();

	  this.canonicalize();

	  return this;
	}

	Amount.prototype.parse_number = function (n) {
	  this._is_native   = false;
	  this._currency    = Currency.from_json(1);
	  this._issuer      = UInt160.from_json(1);
	  this._is_negative = n < 0 ? 1 : 0;
	  this._value       = new BigInteger(String(this._is_negative ? -n : n));
	  this._offset      = 0;

	  this.canonicalize();

	  return this;
	};

	// <-> j
	Amount.prototype.parse_json = function (j) {
	  switch (typeof j) {
	    case 'string':
	      // .../.../... notation is not a wire format.  But allowed for easier testing.
	      var m = j.match(/^([^/]+)\/(...)(?:\/(.+))?$/);

	      if (m) {
	        this._currency  = Currency.from_json(m[2]);
	        if (m[3]) {
	          this._issuer  = UInt160.from_json(m[3]);
	        } else {
	          this._issuer  = UInt160.from_json('1');
	        }
	        this.parse_value(m[1]);
	      } else {
	        this.parse_native(j);
	        this._currency  = Currency.from_json('0');
	        this._issuer    = UInt160.from_json('0');
	      }
	      break;

	    case 'number':
	      this.parse_json(String(j));
	      break;

	    case 'object':
	      if (j === null) break;
	      if (j instanceof Amount) {
	        j.copyTo(this);
	      } else if (j.hasOwnProperty('value')) {
	        // Parse the passed value to sanitize and copy it.
	        this._currency.parse_json(j.currency); // Never XRP.

	        if (typeof j.issuer === 'string') {
	          this._issuer.parse_json(j.issuer);
	        }

	        this.parse_value(j.value);
	      }
	      break;

	    default:
	      this._value = NaN;
	  }

	  return this;
	};

	// Parse a XRP value from untrusted input.
	// - integer = raw units
	// - float = with precision 6
	// XXX Improvements: disallow leading zeros.
	Amount.prototype.parse_native = function (j) {
	  var m;

	  if (typeof j === 'string') {
	    m = j.match(/^(-?)(\d*)(\.\d{0,6})?$/);
	  }

	  if (m) {
	    if (m[3] === void(0)) {
	      // Integer notation
	      this._value = new BigInteger(m[2]);
	    } else {
	      // Float notation : values multiplied by 1,000,000.
	      var int_part      = (new BigInteger(m[2])).multiply(consts.bi_xns_unit);
	      var fraction_part = (new BigInteger(m[3])).multiply(new BigInteger(String(Math.pow(10, 1+consts.xns_precision-m[3].length))));

	      this._value = int_part.add(fraction_part);
	    }

	    this._is_native   = true;
	    this._offset      = 0;
	    this._is_negative = !!m[1] && this._value.compareTo(BigInteger.ZERO) !== 0;

	    if (this._value.compareTo(consts.bi_xns_max) > 0) {
	      this._value = NaN;
	    }
	  } else {
	    this._value = NaN;
	  }

	  return this;
	};

	// Parse a non-native value for the json wire format.
	// Requires _currency to be set!
	Amount.prototype.parse_value = function (j) {
	  this._is_native    = false;

	  switch (typeof j) {
	    case 'number':
	      this._is_negative = j < 0;
	      this._value       = new BigInteger(Math.abs(j));
	      this._offset      = 0;

	      this.canonicalize();
	      break;

	    case 'string':
	      var i = j.match(/^(-?)(\d+)$/);
	      var d = !i && j.match(/^(-?)(\d*)\.(\d*)$/);
	      var e = !e && j.match(/^(-?)(\d*)e(-?\d+)$/);

	      if (e) {
	        // e notation
	        this._value       = new BigInteger(e[2]);
	        this._offset      = parseInt(e[3]);
	        this._is_negative = !!e[1];

	        this.canonicalize();
	      } else if (d) {
	        // float notation
	        var integer   = new BigInteger(d[2]);
	        var fraction  = new BigInteger(d[3]);
	        var precision = d[3].length;

	        this._value       = integer.multiply(consts.bi_10.clone().pow(precision)).add(fraction);
	        this._offset      = -precision;
	        this._is_negative = !!d[1];

	        this.canonicalize();
	      } else if (i) {
	        // integer notation
	        this._value       = new BigInteger(i[2]);
	        this._offset      = 0;
	        this._is_negative = !!i[1];

	        this.canonicalize();
	      } else {
	        this._value = NaN;
	      }
	      break;

	    default:
	      this._value = j instanceof BigInteger ? j : NaN;
	  }

	  return this;
	};

	Amount.prototype.set_currency = function (c) {
	  this._currency  = Currency.from_json(c);
	  this._is_native = this._currency.is_native();

	  return this;
	};

	Amount.prototype.set_issuer = function (issuer) {
	  if (issuer instanceof UInt160) {
	    this._issuer  = issuer;
	  } else {
	    this._issuer  = UInt160.from_json(issuer);
	  }

	  return this;
	};

	// Result in terms of this' currency and issuer.
	Amount.prototype.subtract = function (v) {
	  // Correctness over speed, less code has less bugs, reuse add code.
	  return this.add(Amount.from_json(v).negate());
	};

	Amount.prototype.to_number = function (allow_nan) {
	  var s = this.to_text(allow_nan);
	  return typeof s === 'string' ? Number(s) : s;
	};

	// Convert only value to JSON wire format.
	Amount.prototype.to_text = function (allow_nan) {
	  var result = NaN;

	  if (this._is_native) {
	    if (this.is_valid() && this._value.compareTo(consts.bi_xns_max) <= 0){
	      result = this._value.toString();
	    }
	  } else if (this.is_zero()) {
	    result = '0';
	  } else if (this._offset && (this._offset < -25 || this._offset > -4)) {
	    // Use e notation.
	    // XXX Clamp output.
	    result = this._value.toString() + 'e' + this._offset;
	  } else {
	    var val    = '000000000000000000000000000' + this._value.toString() + '00000000000000000000000';
	    var pre    = val.substring(0, this._offset + 43);
	    var post   = val.substring(this._offset + 43);
	    var s_pre  = pre.match(/[1-9].*$/);  // Everything but leading zeros.
	    var s_post = post.match(/[1-9]0*$/); // Last non-zero plus trailing zeros.

	    result = ''
	      + (s_pre ? s_pre[0] : '0')
	      + (s_post ? '.' + post.substring(0, 1 + post.length - s_post[0].length) : '');
	  }

	  if (!allow_nan && typeof result === 'number' && isNaN(result)) {
	    result = '0';
	  } else if (this._is_negative) {
	    result = '-' + result;
	  }

	  return result;
	};

	/**
	 * Format only value in a human-readable format.
	 *
	 * @example
	 *   var pretty = amount.to_human({precision: 2});
	 *
	 * @param opts Options for formatter.
	 * @param opts.precision {Number} Max. number of digits after decimal point.
	 * @param opts.min_precision {Number} Min. number of digits after dec. point.
	 * @param opts.skip_empty_fraction {Boolean} Don't show fraction if it is zero,
	 *   even if min_precision is set.
	 * @param opts.max_sig_digits {Number} Maximum number of significant digits.
	 *   Will cut fractional part, but never integer part.
	 * @param opts.group_sep {Boolean|String} Whether to show a separator every n
	 *   digits, if a string, that value will be used as the separator. Default: ','
	 * @param opts.group_width {Number} How many numbers will be grouped together,
	 *   default: 3.
	 * @param opts.signed {Boolean|String} Whether negative numbers will have a
	 *   prefix. If String, that string will be used as the prefix. Default: '-'
	 */
	Amount.prototype.to_human = function (opts) {
	  var opts = opts || {};

	  if (!this.is_valid()) return '';

	  // Default options
	  if (typeof opts.signed === 'undefined') opts.signed = true;
	  if (typeof opts.group_sep === 'undefined') opts.group_sep = true;

	  opts.group_width = opts.group_width || 3;

	  var order         = this._is_native ? consts.xns_precision : -this._offset;
	  var denominator   = consts.bi_10.clone().pow(order);
	  var int_part      = this._value.divide(denominator).toString();
	  var fraction_part = this._value.mod(denominator).toString();

	  // Add leading zeros to fraction
	  while (fraction_part.length < order) {
	    fraction_part = '0' + fraction_part;
	  }

	  int_part      = int_part.replace(/^0*/, '');
	  fraction_part = fraction_part.replace(/0*$/, '');

	  if (fraction_part.length || !opts.skip_empty_fraction) {
	    // Enforce the maximum number of decimal digits (precision)
	    if (typeof opts.precision === 'number') {
	      if (opts.precision === 0 && fraction_part.charCodeAt(0) >= 53) {
	        int_part = (Number(int_part) + 1).toString();
	      }
	      fraction_part = fraction_part.slice(0, opts.precision);
	    }

	    // Limit the number of significant digits (max_sig_digits)
	    if (typeof opts.max_sig_digits === 'number') {
	      // First, we count the significant digits we have.
	      // A zero in the integer part does not count.
	      var int_is_zero = +int_part === 0;
	      var digits = int_is_zero ? 0 : int_part.length;

	      // Don't count leading zeros in the fractional part if the integer part is
	      // zero.
	      var sig_frac = int_is_zero ? fraction_part.replace(/^0*/, '') : fraction_part;
	      digits += sig_frac.length;

	      // Now we calculate where we are compared to the maximum
	      var rounding = digits - opts.max_sig_digits;

	      // If we're under the maximum we want to cut no (=0) digits
	      rounding = Math.max(rounding, 0);

	      // If we're over the maximum we still only want to cut digits from the
	      // fractional part, not from the integer part.
	      rounding = Math.min(rounding, fraction_part.length);

	      // Now we cut `rounding` digits off the right.
	      if (rounding > 0) fraction_part = fraction_part.slice(0, -rounding);
	    }

	    // Enforce the minimum number of decimal digits (min_precision)
	    if (typeof opts.min_precision === 'number') {
	      while (fraction_part.length < opts.min_precision) {
	        fraction_part += '0';
	      }
	    }
	  }

	  if (opts.group_sep) {
	    if (typeof opts.group_sep !== 'string') {
	      opts.group_sep = ',';
	    }
	    int_part = utils.chunkString(int_part, opts.group_width, true).join(opts.group_sep);
	  }

	  var formatted = '';
	  if (opts.signed && this._is_negative) {
	    if (typeof opts.signed !== 'string') {
	      opts.signed = '-';
	    }
	    formatted += opts.signed;
	  }

	  formatted += int_part.length ? int_part : '0';
	  formatted += fraction_part.length ? '.' + fraction_part : '';

	  return formatted;
	};

	Amount.prototype.to_human_full = function (opts) {
	  var opts = opts || {};
	  var a = this.to_human(opts);
	  var c = this._currency.to_human();
	  var i = this._issuer.to_json(opts);
	  var o = this.is_native ?  (o = a + '/' + c) : (o  = a + '/' + c + '/' + i);
	  return o;
	};

	Amount.prototype.to_json = function () {
	  var result;

	  if (this._is_native) {
	    result = this.to_text();
	  } else {
	    var amount_json = {
	      value : this.to_text(),
	      currency : this._currency.to_json()
	    };
	    if (this._issuer.is_valid()) {
	      amount_json.issuer = this._issuer.to_json();
	    }
	    result = amount_json;
	  }

	  return result;
	};

	Amount.prototype.to_text_full = function (opts) {
	  return this._value instanceof BigInteger
	    ? this._is_native
	      ? this.to_human() + '/XRP'
	      : this.to_text() + '/' + this._currency.to_json() + '/' + this._issuer.to_json(opts)
	    : NaN;
	};

	// For debugging.
	Amount.prototype.not_equals_why = function (d, ignore_issuer) {
	  var result = false;

	  if (typeof d === 'string') {
	    result = this.not_equals_why(Amount.from_json(d));
	  } else if (d instanceof Amount) {
	    if (!this.is_valid() || !d.is_valid()) {
	      result = 'Invalid amount.';
	    } else if (this._is_native !== d._is_native) {
	      result = 'Native mismatch.';
	    } else {
	      var type = this._is_native ? 'XRP' : 'Non-XRP';

	      if (!this._value.equals(d._value) || this._offset !== d._offset) {
	        result = type + ' value differs.';
	      } else if (this._is_negative !== d._is_negative) {
	        result = type + ' sign differs.';
	      } else if (!this._is_native) {
	        if (!this._currency.equals(d._currency)) {
	          result = 'Non-XRP currency differs.';
	        } else if (!ignore_issuer && !this._issuer.equals(d._issuer)) {
	          result = 'Non-XRP issuer differs: ' + d._issuer.to_json() + '/' + this._issuer.to_json();
	        }
	      }
	    }
	  } else {
	    result = 'Wrong constructor.';
	  }

	  return result;
	};

	exports.Amount   = Amount;

	// DEPRECATED: Include the corresponding files instead.
	exports.Currency = Currency;
	exports.Seed     = Seed;
	exports.UInt160  = UInt160;

	// vim:sw=2:sts=2:ts=8:et


/***/ },

/***/ 4:
/***/ function(module, exports, require) {

	
	//
	// Currency support
	//

	// XXX Internal form should be UInt160.
	function Currency() {
	  // Internal form: 0 = XRP. 3 letter-code.
	  // XXX Internal should be 0 or hex with three letter annotation when valid.

	  // Json form:
	  //  '', 'XRP', '0': 0
	  //  3-letter code: ...
	  // XXX Should support hex, C++ doesn't currently allow it.

	  this._value  = NaN;
	};

	// Given "USD" return the json.
	Currency.json_rewrite = function (j) {
	  return Currency.from_json(j).to_json();
	};

	Currency.from_json = function (j) {
	  return j instanceof Currency ? j.clone() : new Currency().parse_json(j);
	};

	Currency.from_bytes = function (j) {
	  return j instanceof Currency ? j.clone() : new Currency().parse_bytes(j);
	};

	Currency.is_valid = function (j) {
	  return Currency.from_json(j).is_valid();
	};

	Currency.prototype.clone = function() {
	  return this.copyTo(new Currency());
	};

	// Returns copy.
	Currency.prototype.copyTo = function (d) {
	  d._value = this._value;
	  return d;
	};

	Currency.prototype.equals = function (d) {
	  var equals = (typeof this._value !== 'string' && isNaN(this._value))
	    || (typeof d._value !== 'string' && isNaN(d._value));
	  return equals ? false: this._value === d._value;
	};

	// this._value = NaN on error.
	Currency.prototype.parse_json = function (j) {
	  var result = NaN;

	  switch (typeof j) {
	    case 'string':
	      if (!j || /^(0|XRP)$/.test(j)) {
	        result = 0;
	      } else if (/^[a-zA-Z0-9]{3}$/.test(j)) {
	        result = j;
	      }
	      break;

	    case 'number':
	      if (!isNaN(j)) {
	        result = j;
	      }
	      break;

	    case 'object':
	      if (j instanceof Currency) {
	        result = j.copyTo({})._value;
	      }
	      break;
	  }

	  this._value = result;

	  return this;
	};

	Currency.prototype.parse_bytes = function (byte_array) {
	  if (Array.isArray(byte_array) && byte_array.length === 20) {
	    var result;
	    // is it 0 everywhere except 12, 13, 14?
	    var isZeroExceptInStandardPositions = true;

	    for (var i=0; i<20; i++) {
	      isZeroExceptInStandardPositions = isZeroExceptInStandardPositions && (i===12 || i===13 || i===14 || byte_array[0]===0)
	    }

	    if (isZeroExceptInStandardPositions) {
	      var currencyCode = String.fromCharCode(byte_array[12])
	      + String.fromCharCode(byte_array[13])
	      + String.fromCharCode(byte_array[14]);
	      if (/^[A-Z0-9]{3}$/.test(currencyCode) && currencyCode !== "XRP" ) {
	        this._value = currencyCode;
	      } else if (currencyCode === "\0\0\0") {
	        this._value = 0;
	      } else {
	        this._value = NaN;
	      }
	    } else {
	      // XXX Should support non-standard currency codes
	      this._value = NaN;
	    }
	  } else {
	    this._value = NaN;
	  }
	  return this;
	};

	Currency.prototype.is_native = function () {
	  return !isNaN(this._value) && !this._value;
	};

	Currency.prototype.is_valid = function () {
	  return typeof this._value === 'string' || !isNaN(this._value);
	};

	Currency.prototype.to_json = function () {
	  return this._value ? this._value : "XRP";
	};

	Currency.prototype.to_human = function () {
	  return this._value ? this._value : "XRP";
	};

	exports.Currency = Currency;

	// vim:sw=2:sts=2:ts=8:et


/***/ },

/***/ 5:
/***/ function(module, exports, require) {

	var sjcl    = require(11).sjcl;
	var utils   = require(11);
	var extend  = require(30);

	var BigInteger = utils.jsbn.BigInteger;

	var Base = {};

	var alphabets = Base.alphabets = {
	  ripple  :  "rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz",
	  tipple  :  "RPShNAF39wBUDnEGHJKLM4pQrsT7VWXYZ2bcdeCg65jkm8ofqi1tuvaxyz",
	  bitcoin :  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
	};

	extend(Base, {
	  VER_NONE              : 1,
	  VER_NODE_PUBLIC       : 28,
	  VER_NODE_PRIVATE      : 32,
	  VER_ACCOUNT_ID        : 0,
	  VER_ACCOUNT_PUBLIC    : 35,
	  VER_ACCOUNT_PRIVATE   : 34,
	  VER_FAMILY_GENERATOR  : 41,
	  VER_FAMILY_SEED       : 33
	});

	function sha256(bytes) {
	  return sjcl.codec.bytes.fromBits(sjcl.hash.sha256.hash(sjcl.codec.bytes.toBits(bytes)));
	};

	function sha256hash(bytes) {
	  return sha256(sha256(bytes));
	};

	// --> input: big-endian array of bytes.
	// <-- string at least as long as input.
	Base.encode = function (input, alpha) {
	  var alphabet = alphabets[alpha || 'ripple'];
	  var bi_base  = new BigInteger(String(alphabet.length));
	  var bi_q     = new BigInteger();
	  var bi_r     = new BigInteger();
	  var bi_value = new BigInteger(input);
	  var buffer   = [];

	  while (bi_value.compareTo(BigInteger.ZERO) > 0) {
	    bi_value.divRemTo(bi_base, bi_q, bi_r);
	    bi_q.copyTo(bi_value);
	    buffer.push(alphabet[bi_r.intValue()]);
	  }

	  for (var i=0; i !== input.length && !input[i]; i += 1) {
	    buffer.push(alphabet[0]);
	  }

	  return buffer.reverse().join('');
	};

	// --> input: String
	// <-- array of bytes or undefined.
	Base.decode = function (input, alpha) {
	  if (typeof input !== 'string') {
	    return void(0);
	  }

	  var alphabet = alphabets[alpha || 'ripple'];
	  var bi_base  = new BigInteger(String(alphabet.length));
	  var bi_value = new BigInteger();
	  var i;

	  for (i = 0; i != input.length && input[i] === alphabet[0]; i += 1)
	  ;

	  for (; i !== input.length; i += 1) {
	    var v = alphabet.indexOf(input[i]);

	    if (v < 0) {
	      return void(0);
	    }

	    var r = new BigInteger();
	    r.fromInt(v);
	    bi_value  = bi_value.multiply(bi_base).add(r);
	  }

	  // toByteArray:
	  // - Returns leading zeros!
	  // - Returns signed bytes!
	  var bytes =  bi_value.toByteArray().map(function (b) { return b ? b < 0 ? 256+b : b : 0; });
	  var extra = 0;

	  while (extra != bytes.length && !bytes[extra]) {
	    extra += 1;
	  }

	  if (extra) {
	    bytes = bytes.slice(extra);
	  }

	  var zeros = 0;

	  while (zeros !== input.length && input[zeros] === alphabet[0]) {
	    zeros += 1;
	  }

	  return [].concat(utils.arraySet(zeros, 0), bytes);
	};

	Base.verify_checksum = function (bytes) {
	  var computed = sha256hash(bytes.slice(0, -4)).slice(0, 4);
	  var checksum = bytes.slice(-4);
	  var result = true;

	  for (var i=0; i<4; i++) {
	    if (computed[i] !== checksum[i]) {
	      result = false;
	      break;
	    }
	  }

	  return result;
	};

	// --> input: Array
	// <-- String
	Base.encode_check = function (version, input, alphabet) {
	  var buffer = [].concat(version, input);
	  var check  = sha256(sha256(buffer)).slice(0, 4);

	  return Base.encode([].concat(buffer, check), alphabet);
	};

	// --> input : String
	// <-- NaN || BigInteger
	Base.decode_check = function (version, input, alphabet) {
	  var buffer = Base.decode(input, alphabet);

	  if (!buffer || buffer.length < 5) {
	    return NaN;
	  }

	  // Single valid version
	  if (typeof version === 'number' && buffer[0] !== version) {
	    return NaN;
	  }

	  // Multiple allowed versions
	  if (Array.isArray(version)) {
	    var match = false;

	    for (var i=0, l=version.length; i<l; i++) {
	      match |= version[i] === buffer[0];
	    }

	    if (!match) {
	      return NaN;
	    }
	  }

	  if (!Base.verify_checksum(buffer)) {
	    return NaN;
	  }

	  // We'll use the version byte to add a leading zero, this ensures JSBN doesn't
	  // intrepret the value as a negative number
	  buffer[0] = 0;

	  return new BigInteger(buffer.slice(0, -4), 256);
	};

	exports.Base = Base;


/***/ },

/***/ 6:
/***/ function(module, exports, require) {

	// Transactions
	//
	//  Construction:
	//    remote.transaction()  // Build a transaction object.
	//     .offer_create(...)   // Set major parameters.
	//     .set_flags()         // Set optional parameters.
	//     .on()                // Register for events.
	//     .submit();           // Send to network.
	//
	//  Events:
	// 'success' : Transaction submitted without error.
	// 'error' : Error submitting transaction.
	// 'proposed' : Advisory proposed status transaction.
	// - A client should expect 0 to multiple results.
	// - Might not get back. The remote might just forward the transaction.
	// - A success could be reverted in final.
	// - local error: other remotes might like it.
	// - malformed error: local server thought it was malformed.
	// - The client should only trust this when talking to a trusted server.
	// 'final' : Final status of transaction.
	// - Only expect a final from dishonest servers after a tesSUCCESS or ter*.
	// 'lost' : Gave up looking for on ledger_closed.
	// 'pending' : Transaction was not found on ledger_closed.
	// 'state' : Follow the state of a transaction.
	//    'client_submitted'     - Sent to remote
	//     |- 'remoteError'      - Remote rejected transaction.
	//      \- 'client_proposed' - Remote provisionally accepted transaction.
	//       |- 'client_missing' - Transaction has not appeared in ledger as expected.
	//       | |\- 'client_lost' - No longer monitoring missing transaction.
	//       |/
	//       |- 'tesSUCCESS'     - Transaction in ledger as expected.
	//       |- 'ter...'         - Transaction failed.
	//       \- 'tec...'         - Transaction claimed fee only.
	//
	// Notes:
	// - All transactions including those with local and malformed errors may be
	//   forwarded anyway.
	// - A malicous server can:
	//   - give any proposed result.
	//     - it may declare something correct as incorrect or something correct as incorrect.
	//     - it may not communicate with the rest of the network.
	//   - may or may not forward.
	//

	var EventEmitter     = require(25).EventEmitter;
	var util             = require(26);

	var sjcl             = require(11).sjcl;

	var Amount           = require(3).Amount;
	var Currency         = require(3).Currency;
	var UInt160          = require(3).UInt160;
	var Seed             = require(19).Seed;
	var SerializedObject = require(8).SerializedObject;
	var RippleError      = require(9).RippleError;

	var hashprefixes     = require(20);

	var config           = require(13);

	// A class to implement transactions.
	// - Collects parameters
	// - Allow event listeners to be attached to determine the outcome.
	function Transaction(remote) {
	  EventEmitter.call(this);

	  var self  = this;

	  this.remote                 = remote;
	  this._secret                = void(0);
	  this._build_path            = false;

	  // Transaction data.
	  this.tx_json                = { Flags: 0 };

	  // ledger_current_index was this when transaction was submited.
	  this.submit_index           = void(0);

	  // Under construction.
	  this.state                  = void(0);

	  this.finalized              = false;
	  this._previous_signing_hash = void(0);
	};

	util.inherits(Transaction, EventEmitter);

	// XXX This needs to be determined from the network.
	Transaction.fee_units = {
	  default: 10,
	};

	Transaction.flags = {
	  AccountSet: {
	    RequireDestTag:     0x00010000,
	    OptionalDestTag:    0x00020000,
	    RequireAuth:        0x00040000,
	    OptionalAuth:       0x00080000,
	    DisallowXRP:        0x00100000,
	    AllowXRP:           0x00200000
	  },

	  TrustSet: {
	    SetAuth:            0x00010000,
	    NoRipple:           0x00020000,
	    ClearNoRipple:      0x00040000
	  },

	  OfferCreate: {
	    Passive:            0x00010000,
	    ImmediateOrCancel:  0x00020000,
	    FillOrKill:         0x00040000,
	    Sell:               0x00080000
	  },

	  Payment: {
	    NoRippleDirect:     0x00010000,
	    PartialPayment:     0x00020000,
	    LimitQuality:       0x00040000
	  }
	};

	Transaction.formats = require(10).tx;

	Transaction.prototype.consts = {
	  telLOCAL_ERROR  : -399,
	  temMALFORMED    : -299,
	  tefFAILURE      : -199,
	  terRETRY        : -99,
	  tesSUCCESS      : 0,
	  tecCLAIMED      : 100,
	};

	Transaction.from_json = function (j) {
	  return (new Transaction()).parse_json(j);
	};

	Transaction.prototype.isTelLocal = function (ter) {
	  return ter >= this.consts.telLOCAL_ERROR && ter < this.consts.temMALFORMED;
	};

	Transaction.prototype.isTemMalformed = function (ter) {
	  return ter >= this.consts.temMALFORMED && ter < this.consts.tefFAILURE;
	};

	Transaction.prototype.isTefFailure = function (ter) {
	  return ter >= this.consts.tefFAILURE && ter < this.consts.terRETRY;
	};

	Transaction.prototype.isTerRetry = function (ter) {
	  return ter >= this.consts.terRETRY && ter < this.consts.tesSUCCESS;
	};

	Transaction.prototype.isTepSuccess = function (ter) {
	  return ter >= this.consts.tesSUCCESS;
	};

	Transaction.prototype.isTecClaimed = function (ter) {
	  return ter >= this.consts.tecCLAIMED;
	};

	Transaction.prototype.isRejected = function (ter) {
	  return this.isTelLocal(ter) || this.isTemMalformed(ter) || this.isTefFailure(ter);
	};

	Transaction.prototype.set_state = function (state) {
	  if (this.state !== state) {
	    this.state  = state;
	    this.emit('state', state);
	  }
	};

	/**
	 * TODO
	 * Actually do this right
	 */

	Transaction.prototype.get_fee = function() {
	  return Transaction.fees['default'].to_json();
	};

	/**
	 * Attempts to complete the transaction for submission.
	 *
	 * This function seeks to fill out certain fields, such as Fee and
	 * SigningPubKey, which can be determined by the library based on network
	 * information and other fields.
	 */
	Transaction.prototype.complete = function () {
	  if (this.remote && typeof this.tx_json.Fee === 'undefined') {
	    if (this.remote.local_fee || !this.remote.trusted) {
	      this.tx_json.Fee = this.remote.fee_tx(this.fee_units()).to_json();
	    }
	  }

	  if (typeof this.tx_json.SigningPubKey === 'undefined') {
	    var seed = Seed.from_json(this._secret);
	    var key  = seed.get_key(this.tx_json.Account);
	    this.tx_json.SigningPubKey = key.to_hex_pub();
	  }

	  return this.tx_json;
	};

	Transaction.prototype.serialize = function () {
	  return SerializedObject.from_json(this.tx_json);
	};

	Transaction.prototype.signing_hash = function () {
	  return this.hash(config.testnet ? 'HASH_TX_SIGN_TESTNET' : 'HASH_TX_SIGN');
	};

	Transaction.prototype.hash = function (prefix, as_uint256) {
	  if ("string" === typeof prefix) {
	    if ("undefined" === typeof hashprefixes[prefix]) {
	      throw new Error("Unknown hashing prefix requested.");
	    }
	    prefix = hashprefixes[prefix];
	  } else if (!prefix) {
	    prefix = hashprefixes['HASH_TX_ID'];
	  }
	  var hash = SerializedObject.from_json(this.tx_json).hash(prefix);

	  return as_uint256 ? hash : hash.to_hex();
	};

	Transaction.prototype.sign = function () {
	  var seed = Seed.from_json(this._secret);

	  var prev_sig = this.tx_json.TxnSignature;
	  delete this.tx_json.TxnSignature;

	  var hash = this.signing_hash();

	  // If the hash is the same, we can re-use the previous signature
	  if (prev_sig && hash === this._previous_signing_hash) {
	    this.tx_json.TxnSignature = prev_sig;
	    return;
	  }

	  var key  = seed.get_key(this.tx_json.Account);
	  var sig  = key.sign(hash, 0);
	  var hex  = sjcl.codec.hex.fromBits(sig).toUpperCase();

	  this.tx_json.TxnSignature = hex;
	  this._previous_signing_hash = hash;
	};

	//
	// Set options for Transactions
	//

	// --> build: true, to have server blindly construct a path.
	//
	// "blindly" because the sender has no idea of the actual cost except that is must be less than send max.
	Transaction.prototype.build_path = function (build) {
	  this._build_path = build;
	  return this;
	};

	// tag should be undefined or a 32 bit integer.
	// YYY Add range checking for tag.
	Transaction.prototype.destination_tag = function (tag) {
	  if (tag !== void(0)) {
	    this.tx_json.DestinationTag = tag;
	  }
	  return this;
	};

	Transaction._path_rewrite = function (path) {
	  var path_new = path.map(function(node) {
	    var node_new = { };

	    if (node.hasOwnProperty('account')) {
	      node_new.account  = UInt160.json_rewrite(node.account);
	    }

	    if (node.hasOwnProperty('issuer')) {
	      node_new.issuer   = UInt160.json_rewrite(node.issuer);
	    }

	    if (node.hasOwnProperty('currency')) {
	      node_new.currency = Currency.json_rewrite(node.currency);
	    }

	    return node_new;
	  });

	  return path_new;
	};

	Transaction.prototype.path_add = function (path) {
	  this.tx_json.Paths  = this.tx_json.Paths || [];
	  this.tx_json.Paths.push(Transaction._path_rewrite(path));
	  return this;
	};

	// --> paths: undefined or array of path
	// A path is an array of objects containing some combination of: account, currency, issuer
	Transaction.prototype.paths = function (paths) {
	  for (var i=0, l=paths.length; i<l; i++) {
	    this.path_add(paths[i]);
	  }
	  return this;
	};

	// If the secret is in the config object, it does not need to be provided.
	Transaction.prototype.secret = function (secret) {
	  this._secret = secret;
	};

	Transaction.prototype.send_max = function (send_max) {
	  if (send_max) {
	    this.tx_json.SendMax = Amount.json_rewrite(send_max);
	  }
	  return this;
	};

	// tag should be undefined or a 32 bit integer.
	// YYY Add range checking for tag.
	Transaction.prototype.source_tag = function (tag) {
	  if (tag) {
	    this.tx_json.SourceTag = tag;
	  }
	  return this;
	};

	// --> rate: In billionths.
	Transaction.prototype.transfer_rate = function (rate) {
	  this.tx_json.TransferRate = Number(rate);

	  if (this.tx_json.TransferRate < 1e9) {
	    throw new Error('invalidTransferRate');
	  }

	  return this;
	};

	// Add flags to a transaction.
	// --> flags: undefined, _flag_, or [ _flags_ ]
	Transaction.prototype.set_flags = function (flags) {
	  if (!flags) return this;

	  var transaction_flags = Transaction.flags[this.tx_json.TransactionType];
	  var flag_set = Array.isArray(flags) ? flags : Array.prototype.slice.call(arguments);

	  // We plan to not define this field on new Transaction.
	  if (this.tx_json.Flags === void(0)) {
	    this.tx_json.Flags = 0;
	  }

	  for (var i=0, l=flag_set.length; i<l; i++) {
	    var flag = flag_set[i];
	    if (transaction_flags.hasOwnProperty(flag)) {
	      this.tx_json.Flags += transaction_flags[flag];
	    } else {
	      // XXX Immediately report an error or mark it.
	    }
	  }

	  return this;
	};

	//
	// Transactions
	//

	Transaction.prototype._account_secret = function (account) {
	  // Fill in secret from remote, if available.
	  return this.remote.secrets[account];
	};

	// Options:
	//  .domain()           NYI
	//  .flags()
	//  .message_key()      NYI
	//  .transfer_rate()
	//  .wallet_locator()   NYI
	//  .wallet_size()      NYI
	Transaction.prototype.account_set = function (src) {
	  if (typeof src === 'object') {
	    var options = src;
	    src = options.source || options.from;
	  }

	  if (!UInt160.is_valid(src)) {
	    throw new Error('Source address invalid');
	  }

	  this._secret                  = this._account_secret(src);
	  this.tx_json.TransactionType  = 'AccountSet';
	  this.tx_json.Account          = UInt160.json_rewrite(src);
	  return this;
	};

	Transaction.prototype.claim = function (src, generator, public_key, signature) {
	  if (typeof src === 'object') {
	    var options = src;
	    signature  = options.signature;
	    public_key = options.public_key;
	    generator  = options.generator;
	    src        = options.source || options.from;
	  }

	  this._secret                 = this._account_secret(src);
	  this.tx_json.TransactionType = 'Claim';
	  this.tx_json.Generator       = generator;
	  this.tx_json.PublicKey       = public_key;
	  this.tx_json.Signature       = signature;
	  return this;
	};

	Transaction.prototype.offer_cancel = function (src, sequence) {
	  if (typeof src === 'object') {
	    var options = src;
	    sequence = options.sequence;
	    src      = options.source || options.from;
	  }

	  if (!UInt160.is_valid(src)) {
	    throw new Error('Source address invalid');
	  }

	  this._secret                 = this._account_secret(src);
	  this.tx_json.TransactionType = 'OfferCancel';
	  this.tx_json.Account         = UInt160.json_rewrite(src);
	  this.tx_json.OfferSequence   = Number(sequence);
	  return this;
	};

	// Options:
	//  .set_flags()
	// --> expiration : if not undefined, Date or Number
	// --> cancel_sequence : if not undefined, Sequence
	Transaction.prototype.offer_create = function (src, taker_pays, taker_gets, expiration, cancel_sequence) {
	  if (typeof src === 'object') {
	    var options = src;
	    cancel_sequence = options.cancel_sequence;
	    expiration      = options.expiration;
	    taker_gets      = options.taker_gets || options.sell;
	    taker_pays      = options.taker_pays || options.buy;
	    src             = options.source || options.from;
	  }

	  if (!UInt160.is_valid(src)) {
	    throw new Error('Source address invalid');
	  }

	  this._secret                 = this._account_secret(src);
	  this.tx_json.TransactionType = 'OfferCreate';
	  this.tx_json.Account         = UInt160.json_rewrite(src);
	  this.tx_json.TakerPays       = Amount.json_rewrite(taker_pays);
	  this.tx_json.TakerGets       = Amount.json_rewrite(taker_gets);

	  if (this.remote.local_fee) {
	    //this.tx_json.Fee = Transaction.fees.offer.to_json();
	  }

	  if (expiration) {
	    this.tx_json.Expiration = expiration instanceof Date
	    ? expiration.getTime() //XX
	    : Number(expiration);
	  }

	  if (cancel_sequence) {
	    this.tx_json.OfferSequence = Number(cancel_sequence);
	  }

	  return this;
	};

	Transaction.prototype.password_fund = function (src, dst) {
	  if (typeof src === 'object') {
	    var options = src;
	    dst = options.destination || options.to;
	    src = options.source || options.from;
	  }

	  if (!UInt160.is_valid(dst)) {
	    throw new Error('Destination address invalid');
	  }

	  this._secret                 = this._account_secret(src);
	  this.tx_json.TransactionType = 'PasswordFund';
	  this.tx_json.Destination     = UInt160.json_rewrite(dst);
	  return this;
	};

	Transaction.prototype.password_set = function (src, authorized_key, generator, public_key, signature) {
	  if (typeof src === 'object') {
	    var options = src;
	    signature      = options.signature;
	    public_key     = options.public_key;
	    generator      = options.generator;
	    authorized_key = options.authorized_key;
	    src            = options.source || options.from;
	  }

	  if (!UInt160.is_valid(src)) {
	    throw new Error('Source address invalid');
	  }

	  this._secret                 = this._account_secret(src);
	  this.tx_json.TransactionType = 'PasswordSet';
	  this.tx_json.RegularKey      = authorized_key;
	  this.tx_json.Generator       = generator;
	  this.tx_json.PublicKey       = public_key;
	  this.tx_json.Signature       = signature;
	  return this;
	};

	// Construct a 'payment' transaction.
	//
	// When a transaction is submitted:
	// - If the connection is reliable and the server is not merely forwarding and is not malicious,
	// --> src : UInt160 or String
	// --> dst : UInt160 or String
	// --> deliver_amount : Amount or String.
	//
	// Options:
	//  .paths()
	//  .build_path()
	//  .destination_tag()
	//  .path_add()
	//  .secret()
	//  .send_max()
	//  .set_flags()
	//  .source_tag()
	Transaction.prototype.payment = function (src, dst, amount) {
	  if (typeof src === 'object') {
	    var options = src;
	    amount = options.amount;
	    dst    = options.destination || options.to;
	    src    = options.source || options.from;
	  }

	  if (!UInt160.is_valid(src)) {
	    throw new Error('Payment source address invalid');
	  }

	  if (!UInt160.is_valid(dst)) {
	    throw new Error('Payment destination address invalid');
	  }

	  if (/^[\d]+[A-Z]{3}$/.test(amount)) {
	    amount = Amount.from_human(amount);
	  }

	  this._secret                 = this._account_secret(src);
	  this.tx_json.TransactionType = 'Payment';
	  this.tx_json.Account         = UInt160.json_rewrite(src);
	  this.tx_json.Amount          = Amount.json_rewrite(amount);
	  this.tx_json.Destination     = UInt160.json_rewrite(dst);

	  return this;
	}

	Transaction.prototype.ripple_line_set = function (src, limit, quality_in, quality_out) {
	  if (typeof src === 'object') {
	    var options = src;
	    quality_out = options.quality_out;
	    quality_in  = options.quality_in;
	    limit       = options.limit;
	    src         = options.source || options.from;
	  }

	  if (!UInt160.is_valid(src)) {
	    throw new Error('Source address invalid');
	  }

	  this._secret                 = this._account_secret(src);
	  this.tx_json.TransactionType = 'TrustSet';
	  this.tx_json.Account         = UInt160.json_rewrite(src);

	  // Allow limit of 0 through.
	  if (limit !== void(0)) {
	    this.tx_json.LimitAmount = Amount.json_rewrite(limit);
	  }
	 
	  if (quality_in) {
	    this.tx_json.QualityIn = quality_in;
	  }

	  if (quality_out) {
	    this.tx_json.QualityOut = quality_out;
	  }

	  // XXX Throw an error if nothing is set.

	  return this;
	};

	Transaction.prototype.wallet_add = function (src, amount, authorized_key, public_key, signature) {
	  if (typeof src === 'object') {
	    var options = src;
	    signature      = options.signature;
	    public_key     = options.public_key;
	    authorized_key = options.authorized_key;
	    amount         = options.amount;
	    src            = options.source || options.from;
	  }

	  if (!UInt160.is_valid(src)) {
	    throw new Error('Source address invalid');
	  }

	  this._secret                  = this._account_secret(src);
	  this.tx_json.TransactionType  = 'WalletAdd';
	  this.tx_json.Amount           = Amount.json_rewrite(amount);
	  this.tx_json.RegularKey       = authorized_key;
	  this.tx_json.PublicKey        = public_key;
	  this.tx_json.Signature        = signature;
	  return this;
	};

	/**
	 * Returns the number of fee units this transaction will cost.
	 *
	 * Each Ripple transaction based on its type and makeup costs a certain number
	 * of fee units. The fee units are calculated on a per-server basis based on the
	 * current load on both the network and the server.
	 *
	 * @see https://ripple.com/wiki/Transaction_Fee
	 *
	 * @return {Number} Number of fee units for this transaction.
	 */
	Transaction.prototype.fee_units = function () {
	  return Transaction.fee_units['default'];
	};

	// Submit a transaction to the network.
	Transaction.prototype.submit = function (callback) {
	  var self = this;

	  this.callback = typeof callback === 'function' ? callback : function(){};

	  function submission_error(error, message) {
	    if (!(error instanceof RippleError)) {
	      error = new RippleError(error, message);
	    }
	    self.callback(error);
	  }

	  function submission_success(message) {
	    self.callback(null, message);
	  }

	  this.on('error', function(){});
	  this.once('error', submission_error);
	  this.once('success', submission_success);

	  var account = this.tx_json.Account;

	  if (typeof account !== 'string') {
	    this.emit('error', new RippleError('tejInvalidAccount', 'Account is unspecified'));
	  } else {
	    // YYY Might check paths for invalid accounts.
	    this.remote.account(account).submit(this);
	  }

	  return this;
	};

	Transaction.prototype.abort = function(callback) {
	  if (!this.finalized) {
	    var callback = typeof callback === 'function' ? callback : function(){};
	    this.once('final', callback);
	    this.emit('abort');
	  }
	};

	Transaction.prototype.parse_json = function (v) {
	  this.tx_json = v;

	  return this;
	};

	exports.Transaction = Transaction;

	// vim:sw=2:sts=2:ts=8:et


/***/ },

/***/ 7:
/***/ function(module, exports, require) {

	var extend  = require(30);
	var utils   = require(11);
	var UInt160 = require(15).UInt160;
	var Amount  = require(3).Amount;

	/**
	 * Meta data processing facility.
	 */
	function Meta(raw_data) {
	  var self = this;

	  this.nodes = [ ];

	  this.node_types = [
	      'CreatedNode'
	    , 'ModifiedNode'
	    , 'DeletedNode'
	  ];

	  for (var i=0, l=raw_data.AffectedNodes.length; i<l; i++) {
	    var an = raw_data.AffectedNodes[i];
	    var result = { };

	    self.node_types.forEach(function (x) {
	      if (an.hasOwnProperty(x)) {
	        result.diffType = x;
	      }
	    });

	    if (!result.diffType) {
	      return null;
	    }

	    an = an[result.diffType];

	    result.entryType = an.LedgerEntryType;
	    result.ledgerIndex = an.LedgerIndex;
	    result.fields = extend({}, an.PreviousFields, an.NewFields, an.FinalFields);
	    result.fieldsPrev = an.PreviousFields || {};
	    result.fieldsNew = an.NewFields || {};
	    result.fieldsFinal = an.FinalFields || {};

	    this.nodes.push(result);
	  }
	};

	/**
	 * Execute a function on each affected node.
	 *
	 * The callback is passed two parameters. The first is a node object which looks
	 * like this:
	 *
	 *   {
	 *     // Type of diff, e.g. CreatedNode, ModifiedNode
	 *     diffType: 'CreatedNode'
	 *
	 *     // Type of node affected, e.g. RippleState, AccountRoot
	 *     entryType: 'RippleState',
	 *
	 *     // Index of the ledger this change occurred in
	 *     ledgerIndex: '01AB01AB...',
	 *
	 *     // Contains all fields with later versions taking precedence
	 *     //
	 *     // This is a shorthand for doing things like checking which account
	 *     // this affected without having to check the diffType.
	 *     fields: {...},
	 *
	 *     // Old fields (before the change)
	 *     fieldsPrev: {...},
	 *
	 *     // New fields (that have been added)
	 *     fieldsNew: {...},
	 *
	 *     // Changed fields
	 *     fieldsFinal: {...}
	 *   }
	 *
	 * The second parameter to the callback is the index of the node in the metadata
	 * (first entry is index 0).
	 */
	Meta.prototype.each = function (fn) {
	  for (var i = 0, l = this.nodes.length; i < l; i++) {
	    fn(this.nodes[i], i);
	  }
	};

	([ 'forEach'
	  , 'map'
	  , 'filter'
	  , 'every'
	  , 'reduce'
	]).forEach(function(fn) {
	  Meta.prototype[fn] = function() {
	    return Array.prototype[fn].apply(this.nodes, arguments);
	  }
	});

	var amountFieldsAffectingIssuer = [
	    "LowLimit"
	  , "HighLimit"
	  , "TakerPays"
	  , "TakerGets"
	];

	Meta.prototype.getAffectedAccounts = function () {
	  var accounts = [ ];

	  // This code should match the behavior of the C++ method:
	  // TransactionMetaSet::getAffectedAccounts
	  this.nodes.forEach(function (an) {
	    var fields = (an.diffType === "CreatedNode") ? an.fieldsNew : an.fieldsFinal;
	    for (var i in fields) {
	      var field = fields[i];
	      if (typeof field === 'string' && UInt160.is_valid(field)) {
	        accounts.push(field);
	      } else if (amountFieldsAffectingIssuer.indexOf(i) !== -1) {
	        var amount = Amount.from_json(field);
	        var issuer = amount.issuer();
	        if (issuer.is_valid() && !issuer.is_zero()) {
	          accounts.push(issuer.to_json());
	        }
	      }
	    }
	  });

	  return utils.arrayUnique(accounts);
	};

	Meta.prototype.getAffectedBooks = function () {
	  var books = [ ];

	  this.nodes.forEach(function (an) {
	    if (an.entryType !== 'Offer') return;

	    var gets = Amount.from_json(an.fields.TakerGets);
	    var pays = Amount.from_json(an.fields.TakerPays);

	    var getsKey = gets.currency().to_json();
	    if (getsKey !== 'XRP') getsKey += '/' + gets.issuer().to_json();

	    var paysKey = pays.currency().to_json();
	    if (paysKey !== 'XRP') paysKey += '/' + pays.issuer().to_json();

	    var key = getsKey + ":" + paysKey;

	    books.push(key);
	  });

	  return utils.arrayUnique(books);
	};

	exports.Meta = Meta;


/***/ },

/***/ 8:
/***/ function(module, exports, require) {

	/* WEBPACK VAR INJECTION */(function(require, Buffer) {var binformat  = require(10);
	var extend     = require(30);
	var stypes     = require(21);
	var UInt256    = require(22).UInt256;
	var assert     = require(27);

	var utils      = require(11);
	var sjcl       = utils.sjcl;
	var BigInteger = utils.jsbn.BigInteger;

	var TRANSACTION_TYPES = { };

	Object.keys(binformat.tx).forEach(function(key) {
	  TRANSACTION_TYPES[binformat.tx[key][0]] = key;
	});

	var LEDGER_ENTRY_TYPES = {};

	Object.keys(binformat.ledger).forEach(function(key) {
	  LEDGER_ENTRY_TYPES[binformat.ledger[key][0]] = key;
	});

	var TRANSACTION_RESULTS = {};

	Object.keys(binformat.ter).forEach(function(key) {
	  TRANSACTION_RESULTS[binformat.ter[key]] = key;
	});

	function SerializedObject(buf) {
	  if (Array.isArray(buf) || (Buffer && Buffer.isBuffer(buf)) ) {
	    this.buffer = buf;
	  } else if (typeof buf === 'string') {
	    this.buffer = sjcl.codec.bytes.fromBits(sjcl.codec.hex.toBits(buf));
	  } else if (!buf) {
	    this.buffer = [];
	  } else {
	    throw new Error('Invalid buffer passed.');
	  }
	  this.pointer = 0;
	};

	SerializedObject.from_json = function (obj) {
	  // Create a copy of the object so we don't modify it
	  var obj = extend({}, obj);
	  var so  = new SerializedObject;
	  var typedef;

	  if ("number" === typeof obj.TransactionType) {
	    obj.TransactionType = SerializedObject.lookup_type_tx(obj.TransactionType);

	    if (!obj.TransactionType) {
	      throw new Error('Transaction type ID is invalid.');
	    }
	  }

	  if ("string" === typeof obj.TransactionType) {
	    typedef = binformat.tx[obj.TransactionType];

	    if (!Array.isArray(typedef)) {
	      throw new Error('Transaction type is invalid');
	    }

	    typedef = typedef.slice();
	    obj.TransactionType = typedef.shift();
	  } else if ("undefined" !== typeof obj.LedgerEntryType) {
	    // XXX: TODO
	    throw new Error('Ledger entry binary format not yet implemented.');
	  } else if ("object" === typeof obj.AffectedNodes) {
	    typedef = binformat.metadata;
	  } else {
	    throw new Error('Object to be serialized must contain either' +
	                    ' TransactionType, LedgerEntryType or AffectedNodes.');
	  }

	  so.serialize(typedef, obj);

	  return so;
	};

	SerializedObject.prototype.append = function (bytes) {
	  if (bytes instanceof SerializedObject) {
	    bytes = bytes.buffer;
	  }
	  this.buffer = this.buffer.concat(bytes);
	  this.pointer += bytes.length;
	};

	SerializedObject.prototype.resetPointer = function () {
	  this.pointer = 0;
	};

	function readOrPeek(advance) {
	  return function(bytes) {
	    var start = this.pointer;
	    var end   = start + bytes;

	    if (end > this.buffer.length) {
	      throw new Error('Buffer length exceeded');
	    }

	    var result = this.buffer.slice(start, end);

	    if (advance) {
	      this.pointer = end;
	    }

	    return result;
	  }
	};

	SerializedObject.prototype.read = readOrPeek(true);

	SerializedObject.prototype.peek = readOrPeek(false);

	SerializedObject.prototype.to_bits = function () {
	  return sjcl.codec.bytes.toBits(this.buffer);
	};

	SerializedObject.prototype.to_hex = function () {
	  return sjcl.codec.hex.fromBits(this.to_bits()).toUpperCase();
	};

	SerializedObject.prototype.to_json = function() {
	  var old_pointer = this.pointer;
	  this.resetPointer();
	  var output = { };

	  while (this.pointer < this.buffer.length) {
	    var key_and_value = stypes.parse(this);
	    var key = key_and_value[0];
	    var value = key_and_value[1];
	    output[key] = SerializedObject.jsonify_structure(value, key);
	  }

	  this.pointer = old_pointer;

	  return output;
	}

	SerializedObject.jsonify_structure = function(structure, field_name) {
	  var output;

	  switch (typeof structure) {
	    case 'number':
	      switch (field_name) {
	        case 'LedgerEntryType':
	          output = LEDGER_ENTRY_TYPES[structure];
	          break;
	        case 'TransactionResult':
	          output = TRANSACTION_RESULTS[structure];
	          break;
	        case 'TransactionType':
	          output = TRANSACTION_TYPES[structure];
	          break;
	        default:
	          output = structure;
	      }
	      break;
	    case 'object':
	      if (!structure) break; //null
	      if (typeof structure.to_json === 'function') {
	        output = structure.to_json();
	      } else if (structure instanceof BigInteger) {
	        output = structure.toString(16).toUpperCase();
	      } else {
	        output = new structure.constructor; //new Array or Object
	        var keys = Object.keys(structure);
	        for (var i=0, l=keys.length; i<l; i++) {
	          var key = keys[i];
	          output[key] = SerializedObject.jsonify_structure(structure[key], key);
	        }
	      }
	      break;
	    default:
	      output = structure;
	  }

	  return output;
	};

	SerializedObject.prototype.serialize = function (typedef, obj) {
	  // Serialize object without end marker
	  stypes.Object.serialize(this, obj, true);

	  // ST: Old serialization
	  /*
	  // Ensure canonical order
	  typedef = SerializedObject.sort_typedef(typedef);

	  // Serialize fields
	  for (var i=0, l=typedef.length; i<l; i++) {
	    this.serialize_field(typedef[i], obj);
	  }
	  */
	};

	SerializedObject.prototype.hash = function (prefix) {
	  var sign_buffer = new SerializedObject();
	  stypes.Int32.serialize(sign_buffer, prefix);
	  sign_buffer.append(this.buffer);
	  return sign_buffer.hash_sha512_half();
	};

	// DEPRECATED
	SerializedObject.prototype.signing_hash = SerializedObject.prototype.hash;

	SerializedObject.prototype.hash_sha512_half = function () {
	  var bits = sjcl.codec.bytes.toBits(this.buffer);
	  var hash = sjcl.bitArray.bitSlice(sjcl.hash.sha512.hash(bits), 0, 256);
	  return UInt256.from_hex(sjcl.codec.hex.fromBits(hash));
	};

	SerializedObject.prototype.serialize_field = function (spec, obj) {
	  var name     = spec[0];
	  var presence = spec[1];
	  var field_id = spec[2];
	  var Type     = stypes[spec[3]];

	  if (typeof obj[name] !== 'undefined') {
	    // ST: Old serialization code
	    //this.append(SerializedObject.get_field_header(Type.id, field_id));
	    try {
	      // ST: Old serialization code
	      //Type.serialize(this, obj[name]);
	      stypes.serialize(this, name, obj[name]);
	    } catch (e) {
	      // Add field name to message and rethrow
	      e.message = 'Error serializing "' + name + '": ' + e.message;
	      throw e;
	    }
	  } else if (presence === binformat.REQUIRED) {
	    throw new Error('Missing required field ' + name);
	  }
	};

	SerializedObject.get_field_header = function (type_id, field_id) {
	  var buffer = [ 0 ];

	  if (type_id > 0xF) {
	    buffer.push(type_id & 0xFF);
	  } else {
	    buffer[0] += (type_id & 0xF) << 4;
	  }

	  if (field_id > 0xF) {
	    buffer.push(field_id & 0xFF);
	  } else {
	    buffer[0] += field_id & 0xF;
	  }

	  return buffer;
	};

	SerializedObject.sort_typedef = function (typedef) {
	  assert(Array.isArray(typedef));

	  function sort_field_compare(a, b) {
	    // Sort by type id first, then by field id
	    return a[3] !== b[3] ? stypes[a[3]].id - stypes[b[3]].id : a[2] - b[2];
	  };

	  return typedef.sort(sort_field_compare);
	};

	SerializedObject.lookup_type_tx = function (id) {
	  assert(typeof id === 'number');
	  return TRANSACTION_TYPES[id];
	};

	exports.SerializedObject = SerializedObject;
	
	/* WEBPACK VAR INJECTION */}.call(exports, require, require(23).Buffer))

/***/ },

/***/ 9:
/***/ function(module, exports, require) {

	var util   = require(26);
	var extend = require(30);

	function RippleError(code, message) {
	  switch (typeof code) {
	    case 'object':
	      extend(this, code);
	      break;
	    case 'string':
	      this.result         = code;
	      this.result_message = message;
	      break;
	  }

	  this.engine_result = this.result = (this.result || this.engine_result || this.error || 'Error');
	  this.engine_result_message = this.result_message = (this.result_message || this.engine_result_message || this.error_message || 'Error');
	  this.result_message = this.message = (this.result_message);

	  var stack;
	  if (!!Error.captureStackTrace)
	    Error.captureStackTrace(this, code || this);
	  else if (stack = new Error().stack)
	    this.stack = stack;
	}

	util.inherits(RippleError, Error);

	RippleError.prototype.name = 'RippleError';

	exports.RippleError = RippleError;


/***/ },

/***/ 10:
/***/ function(module, exports, require) {

	var REQUIRED = exports.REQUIRED = 0,
	    OPTIONAL = exports.OPTIONAL = 1,
	    DEFAULT  = exports.DEFAULT  = 2;

	var base = [
	  [ 'TransactionType'    , REQUIRED,  2, "Int16" ],
	  [ 'Flags'              , OPTIONAL,  2, "Int32" ],
	  [ 'SourceTag'          , OPTIONAL,  3, "Int32" ],
	  [ 'Account'            , REQUIRED,  1, "Account" ],
	  [ 'Sequence'           , REQUIRED,  4, "Int32" ],
	  [ 'Fee'                , REQUIRED,  8, "Amount" ],
	  [ 'OperationLimit'     , OPTIONAL, 29, "Int32" ],
	  [ 'SigningPubKey'      , REQUIRED,  3, "VariableLength" ],
	  [ 'TxnSignature'       , OPTIONAL,  4, "VariableLength" ]
	];

	exports.tx = {
	  AccountSet: [3].concat(base, [
	    [ 'EmailHash'          , OPTIONAL,  1, "Hash128" ],
	    [ 'WalletLocator'      , OPTIONAL,  7, "Hash256" ],
	    [ 'WalletSize'         , OPTIONAL, 12, "Int32" ],
	    [ 'MessageKey'         , OPTIONAL,  2, "VariableLength" ],
	    [ 'Domain'             , OPTIONAL,  7, "VariableLength" ],
	    [ 'TransferRate'       , OPTIONAL, 11, "Int32" ]
	  ]),
	  TrustSet: [20].concat(base, [
	    [ 'LimitAmount'        , OPTIONAL,  3, "Amount" ],
	    [ 'QualityIn'          , OPTIONAL, 20, "Int32" ],
	    [ 'QualityOut'         , OPTIONAL, 21, "Int32" ]
	  ]),
	  OfferCreate: [7].concat(base, [
	    [ 'TakerPays'          , REQUIRED,  4, "Amount" ],
	    [ 'TakerGets'          , REQUIRED,  5, "Amount" ],
	    [ 'Expiration'         , OPTIONAL, 10, "Int32" ]
	  ]),
	  OfferCancel: [8].concat(base, [
	    [ 'OfferSequence'      , REQUIRED, 25, "Int32" ]
	  ]),
	  SetRegularKey: [5].concat(base, [
	    [ 'RegularKey'         , REQUIRED,  8, "Account" ]
	  ]),
	  Payment: [0].concat(base, [
	    [ 'Destination'        , REQUIRED,  3, "Account" ],
	    [ 'Amount'             , REQUIRED,  1, "Amount" ],
	    [ 'SendMax'            , OPTIONAL,  9, "Amount" ],
	    [ 'Paths'              , DEFAULT ,  1, "PathSet" ],
	    [ 'InvoiceID'          , OPTIONAL, 17, "Hash256" ],
	    [ 'DestinationTag'     , OPTIONAL, 14, "Int32" ]
	  ]),
	  Contract: [9].concat(base, [
	    [ 'Expiration'         , REQUIRED, 10, "Int32" ],
	    [ 'BondAmount'         , REQUIRED, 23, "Int32" ],
	    [ 'StampEscrow'        , REQUIRED, 22, "Int32" ],
	    [ 'RippleEscrow'       , REQUIRED, 17, "Amount" ],
	    [ 'CreateCode'         , OPTIONAL, 11, "VariableLength" ],
	    [ 'FundCode'           , OPTIONAL,  8, "VariableLength" ],
	    [ 'RemoveCode'         , OPTIONAL,  9, "VariableLength" ],
	    [ 'ExpireCode'         , OPTIONAL, 10, "VariableLength" ]
	  ]),
	  RemoveContract: [10].concat(base, [
	    [ 'Target'             , REQUIRED,  7, "Account" ]
	  ]),
	  EnableFeature: [100].concat(base, [
	    [ 'Feature'            , REQUIRED, 19, "Hash256" ]
	  ]),
	  SetFee: [101].concat(base, [
	    [ 'Features'           , REQUIRED,  9, "Array" ],
	    [ 'BaseFee'            , REQUIRED,  5, "Int64" ],
	    [ 'ReferenceFeeUnits'  , REQUIRED, 30, "Int32" ],
	    [ 'ReserveBase'        , REQUIRED, 31, "Int32" ],
	    [ 'ReserveIncrement'   , REQUIRED, 32, "Int32" ]
	  ])
	};

	exports.ledger = {
	  AccountRoot: [97],
	  Contract: [99],
	  DirectoryNode: [100],
	  Features: [102],
	  GeneratorMap: [103],
	  LedgerHashes: [104],
	  Nickname: [110],
	  Offer: [111],
	  RippleState: [114],
	  FeeSettings: [115]
	};

	exports.metadata = [
	  [ 'TransactionIndex'     , REQUIRED, 28, "Int32" ],
	  [ 'TransactionResult'    , REQUIRED,  3, "Int8" ],
	  [ 'AffectedNodes'        , REQUIRED,  8, "Array" ]
	];

	exports.ter = {
	  tesSUCCESS: 0,
	  tecCLAIM: 100,
	  tecPATH_PARTIAL: 101,
	  tecUNFUNDED_ADD: 102,
	  tecUNFUNDED_OFFER: 103,
	  tecUNFUNDED_PAYMENT: 104,
	  tecFAILED_PROCESSING: 105,
	  tecDIR_FULL: 121,
	  tecINSUF_RESERVE_LINE: 122,
	  tecINSUF_RESERVE_OFFER: 123,
	  tecNO_DST: 124,
	  tecNO_DST_INSUF_XRP: 125,
	  tecNO_LINE_INSUF_RESERVE: 126,
	  tecNO_LINE_REDUNDANT: 127,
	  tecPATH_DRY: 128,
	  tecUNFUNDED: 129,
	  tecMASTER_DISABLED: 130,
	  tecNO_REGULAR_KEY: 131,
	  tecOWNERS: 132
	};


/***/ },

/***/ 11:
/***/ function(module, exports, require) {

	var exports = module.exports = require(14);

	// We override this function for browsers, because they print objects nicer
	// natively than JSON.stringify can.
	exports.logObject = function (msg, obj) {
	  if (/MSIE/.test(navigator.userAgent)) {
	    console.log(msg, JSON.stringify(obj));
	  } else {
	    console.log(msg, "", obj);
	  }
	};


/***/ },

/***/ 12:
/***/ function(module, exports, require) {

	var EventEmitter = require(25).EventEmitter;
	var util         = require(26);
	var utils        = require(11);

	/**
	 *  @constructor Server
	 *  @param  remote    The Remote object
	 *  @param  opts       Configuration parameters.
	 *
	 *  Keys for cfg:
	 *  url
	 */ 

	function Server(remote, opts) {
	  EventEmitter.call(this);

	  if (typeof opts !== 'object') {
	    throw new Error('Invalid server configuration.');
	  }

	  var self = this;

	  this._remote         = remote;
	  this._opts           = opts;
	  this._host           = opts.host;
	  this._port           = opts.port;
	  this._secure         = typeof opts.secure === 'boolean' ? opts.secure : true;
	  this._ws             = void(0);
	  this._connected      = false;
	  this._should_connect = false;
	  this._state          = void(0);
	  this._id             = 0;
	  this._retry          = 0;
	  this._requests       = { };

	  this._opts.url = (opts.secure ? 'wss://' : 'ws://') + opts.host + ':' + opts.port;

	  this.on('message', function(message) {
	    self._handle_message(message);
	  });

	  this.on('response_subscribe', function(message) {
	    self._handle_response_subscribe(message);
	  });
	}

	util.inherits(Server, EventEmitter);

	/**
	 * Server states that we will treat as the server being online.
	 *
	 * Our requirements are that the server can process transactions and notify
	 * us of changes.
	 */
	Server.online_states = [
	    'syncing'
	  , 'tracking'
	  , 'proposing'
	  , 'validating'
	  , 'full'
	];

	Server.prototype._is_online = function (status) {
	  return Server.online_states.indexOf(status) !== -1;
	};

	Server.prototype._set_state = function (state) {
	  if (state !== this._state) {
	    this._state = state;

	    this.emit('state', state);

	    switch (state) {
	      case 'online':
	        this._connected = true;
	        this.emit('connect');
	        break;
	      case 'offline':
	        this._connected = false;
	        this.emit('disconnect');
	        break;
	    }
	  }
	};

	Server.prototype._trace = function() {
	  if (this._remote.trace) {
	    utils.logObject.apply(utils, arguments);
	  }
	};

	Server.prototype._remote_address = function() {
	  try { var address = this._ws._socket.remoteAddress; } catch (e) { }
	  return address;
	};

	// This is the final interface between client code and a socket connection to a
	// `rippled` server. As such, this is a decent hook point to allow a WebSocket
	// interface conforming object to be used as a basis to mock rippled. This
	// avoids the need to bind a websocket server to a port and allows a more
	// synchronous style of code to represent a client <-> server message sequence.
	// We can also use this to log a message sequence to a buffer.
	Server.prototype.websocket_constructor = function () {
	  return require(24);
	};

	Server.prototype.connect = function () {
	  var self = this;

	  // We don't connect if we believe we're already connected. This means we have
	  // recently received a message from the server and the WebSocket has not
	  // reported any issues either. If we do fail to ping or the connection drops,
	  // we will automatically reconnect.
	  if (this._connected) {
	    return;
	  }

	  this._trace('server: connect: %s', this._opts.url);

	  // Ensure any existing socket is given the command to close first.
	  if (this._ws) {
	    this._ws.close();
	  }

	  // We require this late, because websocket shims may be loaded after
	  // ripple-lib.
	  var WebSocket = this.websocket_constructor();
	  var ws = this._ws = new WebSocket(this._opts.url);

	  this._should_connect = true;

	  self.emit('connecting');

	  ws.onopen = function () {
	    // If we are no longer the active socket, simply ignore any event
	    if (ws === self._ws) {
	      self.emit('socket_open');
	      // Subscribe to events
	      var request = self._remote._server_prepare_subscribe();
	      self.request(request);
	    }
	  };

	  ws.onerror = function (e) {
	    // If we are no longer the active socket, simply ignore any event
	    if (ws === self._ws) {
	      self._trace('server: onerror: %s', e.data || e);

	      // Most connection errors for WebSockets are conveyed as 'close' events with
	      // code 1006. This is done for security purposes and therefore unlikely to
	      // ever change.

	      // This means that this handler is hardly ever called in practice. If it is,
	      // it probably means the server's WebSocket implementation is corrupt, or
	      // the connection is somehow producing corrupt data.

	      // Most WebSocket applications simply log and ignore this error. Once we
	      // support for multiple servers, we may consider doing something like
	      // lowering this server's quality score.

	      // However, in Node.js this event may be triggered instead of the close
	      // event, so we need to handle it.
	      handleConnectionClose();
	    }
	  };

	  // Failure to open.
	  ws.onclose = function () {
	    // If we are no longer the active socket, simply ignore any event
	    if (ws === self._ws) {
	      self._trace('server: onclose: %s', ws.readyState);
	      handleConnectionClose();
	    }
	  };

	  function handleConnectionClose() {
	    self.emit('socket_close');
	    self._set_state('offline');

	    // Prevent additional events from this socket
	    ws.onopen = ws.onerror = ws.onclose = ws.onmessage = function () {};

	    // Should we be connected?
	    if (!self._should_connect) {
	      return;
	    }

	    // Delay and retry.
	    self._retry      += 1;
	    self._retry_timer = setTimeout(function () {
	      self._trace('server: retry');
	      if (!self._should_connect) {
	        return;
	      }
	      self.connect();
	    }, self._retry < 40
	        ? 1000/20           // First, for 2 seconds: 20 times per second
	        : self._retry < 40+60
	          ? 1000            // Then, for 1 minute: once per second
	          : self._retry < 40+60+60
	            ? 10*1000       // Then, for 10 minutes: once every 10 seconds
	            : 30*1000);     // Then: once every 30 seconds
	  }

	  ws.onmessage = function (msg) {
	    self.emit('before_message_for_non_mutators', msg.data);
	    self.emit('message', msg.data);
	  };
	};

	Server.prototype.disconnect = function () {
	  this._should_connect = false;
	  this._set_state('offline');
	  if (this._ws) {
	    this._ws.close();
	  }
	};

	Server.prototype.send_message = function (message) {
	  if (this._ws) {
	    this.emit('before_send_message_for_non_mutators', message)
	    this._ws.send(JSON.stringify(message));
	  }
	};

	/**
	 * Submit a Request object to this server.
	 */
	Server.prototype.request = function (request) {
	  var self  = this;

	  // Only bother if we are still connected.
	  if (this._ws) {
	    request.server     = this;
	    request.message.id = this._id;

	    this._requests[request.message.id] = request;

	    // Advance message ID
	    this._id++;

	    var is_connected = this._connected || (request.message.command === 'subscribe' && this._ws.readyState === 1);
	    
	    if (is_connected) {
	      this._trace('server: request: %s', request.message);
	      this.send_message(request.message);
	    } else {
	      // XXX There are many ways to make this smarter.
	      function server_reconnected() {
	        self._trace('server: request: %s', request.message);
	        self.send_message(request.message);
	      }
	      this.once('connect', server_reconnected);
	    }
	  } else {
	    this._trace('server: request: DROPPING: %s', request.message);
	  }
	};

	Server.prototype._handle_message = function (message) {
	  var self = this;

	  try { message = JSON.parse(message); } catch(e) { }

	  var unexpected = typeof message !== 'object' || typeof message.type !== 'string';

	  if (unexpected) {
	    return; 
	  }

	  switch (message.type) {
	    case 'response':
	      // A response to a request.
	      var request = self._requests[message.id];
	      delete self._requests[message.id];

	      if (!request) {
	        this._trace('server: UNEXPECTED: %s', message);
	      } else if ('success' === message.status) {
	        this._trace('server: response: %s', message);

	        request.emit('success', message.result);

	        [ self, self._remote ].forEach(function(emitter) {
	          emitter.emit('response_' + request.message.command, message.result, request, message);
	        });
	      } else if (message.error) {
	        this._trace('server: error: %s', message);

	        request.emit('error', {
	          error         : 'remoteError',
	          error_message : 'Remote reported an error.',
	          remote        : message
	        });
	      }
	      break;

	    case 'path_find':
	      if (self._remote.trace) utils.logObject('server: path_find: %s', message);
	      break;

	    case 'serverStatus':
	      // This message is only received when online. As we are connected, it is the definative final state.
	      this._set_state(this._is_online(message.server_status) ? 'online' : 'offline');
	      break;
	  }
	}

	Server.prototype._handle_response_subscribe = function (message) {
	  this._server_status = message.server_status;
	  if (this._is_online(message.server_status)) {
	    this._set_state('online');
	  }
	}

	exports.Server = Server;

	// vim:sw=2:sts=2:ts=8:et


/***/ },

/***/ 13:
/***/ function(module, exports, require) {

	// This object serves as a singleton to store config options

	var extend = require(30);

	var config = module.exports = {
	  load: function (newOpts) {
	    extend(config, newOpts);
	    return config;
	  }
	};


/***/ },

/***/ 14:
/***/ function(module, exports, require) {

	Function.prototype.method = function(name, func) {
	  this.prototype[name] = func;
	  return this;
	};

	function filterErr(code, done) {
	  return function(e) {
	    done(e.code !== code ? e : void(0));
	  };
	};

	function throwErr(done) {
	  return function(e) {
	    if (e) {
	      throw e;
	    }
	    done();
	  };
	};

	function trace(comment, func) {
	  return function() {
	    console.log("%s: %s", trace, arguments.toString);
	    func(arguments);
	  };
	};

	function arraySet(count, value) {
	  var a = new Array(count);

	  for (var i=0; i<count; i++) {
	    a[i] = value;
	  }

	  return a;
	};

	function hexToString(h) {
	  var a = [];
	  var i = 0;

	  if (h.length % 2) {
	    a.push(String.fromCharCode(parseInt(h.substring(0, 1), 16)));
	    i = 1;
	  }

	  for (; i<h.length; i+=2) {
	    a.push(String.fromCharCode(parseInt(h.substring(i, i+2), 16)));
	  }

	  return a.join('');
	};

	function stringToHex(s) {
	  var result = '';
	  for (var i=0; i<s.length; i++) {
	    var b = s.charCodeAt(i);
	    result += b < 16 ? '0' + b.toString(16) : b.toString(16);
	  }
	  return result;
	};

	function stringToArray(s) {
	  var a = new Array(s.length);

	  for (var i=0; i<a.length; i+=1) {
	    a[i] = s.charCodeAt(i);
	  }

	  return a;
	};

	function hexToArray(h) {
	  return stringToArray(hexToString(h));
	};

	function chunkString(str, n, leftAlign) {
	  var ret = [];
	  var i=0, len=str.length;

	  if (leftAlign) {
	    i = str.length % n;
	    if (i) {
	      ret.push(str.slice(0, i));
	    }
	  }

	  for(; i<len; i+=n) {
	    ret.push(str.slice(i, n + i));
	  }

	  return ret;
	};

	function logObject(msg, obj) {
	  console.log(msg, JSON.stringify(obj, null, 2));
	};

	function assert(assertion, msg) {
	  if (!assertion) {
	    throw new Error("Assertion failed" + (msg ? ": "+msg : "."));
	  }
	};

	/**
	 * Return unique values in array.
	 */
	function arrayUnique(arr) {
	  var u = {}, a = [];

	  for (var i=0, l=arr.length; i<l; i++){
	    var k = arr[i];
	    if (u[k]) {
	      continue;
	    }
	    a.push(k);
	    u[k] = true;
	  }

	  return a;
	};

	/**
	 * Convert a ripple epoch to a JavaScript timestamp.
	 *
	 * JavaScript timestamps are unix epoch in milliseconds.
	 */
	function toTimestamp(rpepoch) {
	  return (rpepoch + 0x386D4380) * 1000;
	};

	exports.trace         = trace;
	exports.arraySet      = arraySet;
	exports.hexToString   = hexToString;
	exports.hexToArray    = hexToArray;
	exports.stringToArray = stringToArray;
	exports.stringToHex   = stringToHex;
	exports.chunkString   = chunkString;
	exports.logObject     = logObject;
	exports.assert        = assert;
	exports.arrayUnique   = arrayUnique;
	exports.toTimestamp   = toTimestamp;

	// Going up three levels is needed to escape the src-cov folder used for the
	// test coverage stuff.
	exports.sjcl = require(28);
	exports.jsbn = require(29);

	// vim:sw=2:sts=2:ts=8:et


/***/ },

/***/ 15:
/***/ function(module, exports, require) {

	var sjcl    = require(11).sjcl;
	var utils   = require(11);
	var config  = require(13);
	var extend  = require(30);

	var BigInteger = utils.jsbn.BigInteger;

	var UInt = require(31).UInt;
	var Base = require(5).Base;

	//
	// UInt160 support
	//

	var UInt160 = extend(function () {
	  // Internal form: NaN or BigInteger
	  this._value  = NaN;
	  this._version_byte = void(0);
	}, UInt);

	UInt160.width = 20;
	UInt160.prototype = extend({}, UInt.prototype);
	UInt160.prototype.constructor = UInt160;

	var ACCOUNT_ZERO = UInt160.ACCOUNT_ZERO = 'rrrrrrrrrrrrrrrrrrrrrhoLvTp';
	var ACCOUNT_ONE  = UInt160.ACCOUNT_ONE  = 'rrrrrrrrrrrrrrrrrrrrBZbvji';
	var HEX_ZERO     = UInt160.HEX_ZERO     = '0000000000000000000000000000000000000000';
	var HEX_ONE      = UInt160.HEX_ONE      = '0000000000000000000000000000000000000001';
	var STR_ZERO     = UInt160.STR_ZERO     = utils.hexToString(HEX_ZERO);
	var STR_ONE      = UInt160.STR_ONE      = utils.hexToString(HEX_ONE);

	UInt160.prototype.set_version = function (j) {
	  this._version_byte = j;

	  return this;
	};

	UInt160.prototype.get_version = function () {
	  return this._version_byte;
	};

	// value = NaN on error.
	UInt160.prototype.parse_json = function (j) {
	  // Canonicalize and validate
	  if (config.accounts && j in config.accounts) {
	    j = config.accounts[j].account;
	  }

	  if (typeof j === 'number' && !isNaN(j)) {
	    // Allow raw numbers - DEPRECATED
	    // This is used mostly by the test suite and is supported
	    // as a legacy feature only. DO NOT RELY ON THIS BEHAVIOR.
	    this._value = new BigInteger(String(j));
	    this._version_byte = Base.VER_ACCOUNT_ID;
	  } else if (typeof j !== 'string') {
	    this._value = NaN;
	  } else if (j[0] === 'r') {
	    this._value = Base.decode_check(Base.VER_ACCOUNT_ID, j);
	    this._version_byte = Base.VER_ACCOUNT_ID;
	  } else {
	    this.parse_hex(j);
	  }

	  return this;
	};

	UInt160.prototype.parse_generic = function (j) {
	  UInt.prototype.parse_generic.call(this, j);

	  if (isNaN(this._value)) {
	    if ("string" === typeof j && j[0] === 'r') {
	      this._value = Base.decode_check(Base.VER_ACCOUNT_ID, j);
	    }
	  }

	  return this;
	};

	// XXX Json form should allow 0 and 1, C++ doesn't currently allow it.
	UInt160.prototype.to_json = function (opts) {
	  opts  = opts || {};

	  if (this._value instanceof BigInteger) {
	    // If this value has a type, return a Base58 encoded string.
	    if ("number" === typeof this._version_byte) {
	      var output = Base.encode_check(this._version_byte, this.to_bytes());
	      if (opts.gateways && output in opts.gateways) {
	        output = opts.gateways[output];
	      }

	      return output;
	    } else {
	      return this.to_hex();
	    }
	  }
	  return NaN;
	};

	exports.UInt160 = UInt160;

	// vim:sw=2:sts=2:ts=8:et


/***/ },

/***/ 16:
/***/ function(module, exports, require) {

	// Routines for working with an account.
	//
	// You should not instantiate this class yourself, instead use Remote#account.
	//
	// Events:
	//   wallet_clean :  True, iff the wallet has been updated.
	//   wallet_dirty :  True, iff the wallet needs to be updated.
	//   balance:        The current stamp balance.
	//   balance_proposed
	//

	// var network = require("./network.js");

	var EventEmitter       = require(25).EventEmitter;
	var util               = require(26);
	var extend             = require(30);

	var Amount             = require(3).Amount;
	var UInt160            = require(15).UInt160;
	var TransactionManager = require(32).TransactionManager;

	function Account(remote, account) {
	  EventEmitter.call(this);

	  var self = this;

	  this._remote     = remote;
	  this._account    = UInt160.from_json(account);
	  this._account_id = this._account.to_json();
	  this._subs       = 0;

	  // Ledger entry object
	  // Important: This must never be overwritten, only extend()-ed
	  this._entry = { };

	  function listener_added(type, listener) {
	    if (~Account.subscribe_events.indexOf(type)) {
	      if (!self._subs && self._remote._connected) {
	        self._remote.request_subscribe()
	        .add_account(self._account_id)
	        .broadcast();
	      }
	      self._subs += 1;
	    }
	  };

	  function listener_removed(type, listener) {
	    if (~Account.subscribe_events.indexOf(type)) {
	      self._subs -= 1;
	      if (!self._subs && self._remote._connected) {
	        self._remote.request_unsubscribe()
	        .add_account(self._account_id)
	        .broadcast();
	      }
	    }
	  };

	  this.on('newListener', listener_added);
	  this.on('removeListener', listener_removed);

	  function prepare_subscribe(request) {
	    if (self._account.is_valid() && self._subs) {
	      request.add_account(self._account_id);
	    }
	  };

	  this._remote.on('prepare_subscribe', prepare_subscribe);

	  function handle_transaction(transaction) {
	    var changed = false;

	    transaction.mmeta.each(function(an) {
	      var isAccountRoot = an.entryType === 'AccountRoot'
	      && an.fields.Account === self._account_id;
	      if (isAccountRoot) {
	        extend(self._entry, an.fieldsNew, an.fieldsFinal);
	        changed = true;
	      }
	    });

	    if (changed) {
	      self.emit('entry', self._entry);
	    }
	  };

	  this.on('transaction', handle_transaction);

	  this._tx_manager = new TransactionManager(this);

	  return this;
	};

	util.inherits(Account, EventEmitter);

	/**
	 * List of events that require a remote subscription to the account.
	 */
	Account.subscribe_events = [ 'transaction', 'entry' ];

	Account.prototype.to_json = function () {
	  return this._account.to_json();
	};

	/**
	 * Whether the AccountId is valid.
	 *
	 * Note: This does not tell you whether the account exists in the ledger.
	 */
	Account.prototype.is_valid = function () {
	  return this._account.is_valid();
	};

	Account.prototype.get_info = function(callback) {
	  var callback = typeof callback === 'function' ? callback : function(){};
	  var request = this._remote.request_account_info(this._account_id, callback);
	  return request;
	};

	/**
	 * Retrieve the current AccountRoot entry.
	 *
	 * To keep up-to-date with changes to the AccountRoot entry, subscribe to the
	 * "entry" event.
	 *
	 * @param {function (err, entry)} callback Called with the result
	 */
	Account.prototype.entry = function (callback) {
	  var self = this;
	  var callback = typeof callback === 'function' ? callback : function(){};

	  this.get_info(function account_info(err, info) {
	    if (err) {
	      callback(err);
	    } else {
	      extend(self._entry, info.account_data);
	      self.emit('entry', self._entry);
	      callback(null, info);
	    }
	  });

	  return this;
	};

	Account.prototype.get_next_sequence = function(callback) {
	  var callback = typeof callback === 'function' ? callback : function(){};

	  this.get_info(function account_info(err, info) {
	    if (err) {
	      callback(err);
	    } else {
	      callback(null, info.account_data.Sequence); 
	    }
	  });

	  return this;
	};

	/**
	 * Retrieve this account's Ripple trust lines.
	 *
	 * To keep up-to-date with changes to the AccountRoot entry, subscribe to the
	 * "lines" event. (Not yet implemented.)
	 *
	 * @param {function (err, lines)} callback Called with the result
	 */
	Account.prototype.lines = function (callback) {
	  var self = this;
	  var callback = typeof callback === 'function' ? callback : function(){};

	  function account_lines(err, res) {
	    if (err) {
	      callback(err);
	    } else {
	      self._lines = res.lines;
	      self.emit('lines', self._lines);
	      callback(null, res);
	    }
	  }

	  this._remote.request_account_lines(this._account_id, account_lines);

	  return this;
	};

	/**
	 * Notify object of a relevant transaction.
	 *
	 * This is only meant to be called by the Remote class. You should never have to
	 * call this yourself.
	 */
	Account.prototype.notify = 
	  Account.prototype.notifyTx = function (message) {
	  // Only trigger the event if the account object is actually
	  // subscribed - this prevents some weird phantom events from
	  // occurring.
	  if (this._subs) {
	    this.emit('transaction', message);
	    var account = message.transaction.Account;
	    if (!account) return;
	    if (account === this._account_id) {
	      this.emit('transaction-outbound', message);
	    } else {
	      this.emit('transaction-inbound', message);
	    }
	  }
	};

	Account.prototype.submit = function(tx) {
	  this._tx_manager.submit(tx);
	};

	exports.Account = Account;

	// vim:sw=2:sts=2:ts=8:et


/***/ },

/***/ 17:
/***/ function(module, exports, require) {

	// Routines for working with an orderbook.
	//
	// One OrderBook object represents one half of an order book. (i.e. bids OR
	// asks) Which one depends on the ordering of the parameters.
	//
	// Events:
	//  - transaction   A transaction that affects the order book.

	// var network = require("./network.js");

	var EventEmitter = require(25).EventEmitter;
	var util         = require(26);
	var extend       = require(30);
	var Amount       = require(3).Amount;
	var UInt160      = require(15).UInt160;
	var Currency     = require(4).Currency;

	function OrderBook(remote, currency_gets, issuer_gets, currency_pays, issuer_pays) {
	  EventEmitter.call(this);

	  var self            = this;

	  this._remote        = remote;
	  this._currency_gets = currency_gets;
	  this._issuer_gets   = issuer_gets;
	  this._currency_pays = currency_pays;
	  this._issuer_pays   = issuer_pays;
	  this._subs          = 0;

	  // We consider ourselves synchronized if we have a current copy of the offers,
	  // we are online and subscribed to updates.
	  this._sync         = false;

	  // Offers
	  this._offers       = [ ];

	  this.on('newListener', function (type, listener) {
	    if (~OrderBook.subscribe_events.indexOf(type)) {
	      if (!self._subs && self._remote._connected) {
	        self._subscribe();
	      }
	      self._subs += 1;
	    }
	  });

	  this.on('removeListener', function (type, listener) {
	    if (~OrderBook.subscribe_events.indexOf(type)) {
	      self._subs  -= 1;
	      if (!self._subs && self._remote._connected) {
	        self._sync = false;
	        self._remote.request_unsubscribe()
	        .books([self.to_json()])
	        .request();
	      }
	    }
	  });

	  this._remote.on('connect', function () {
	    if (self._subs) {
	      self._subscribe();
	    }
	  });

	  this._remote.on('disconnect', function () {
	    self._sync = false;
	  });

	  return this;
	};

	util.inherits(OrderBook, EventEmitter);

	/**
	 * List of events that require a remote subscription to the orderbook.
	 */
	OrderBook.subscribe_events = ['transaction', 'model', 'trade'];

	/**
	 * Subscribes to orderbook.
	 *
	 * @private
	 */
	OrderBook.prototype._subscribe = function () {
	  var self = this;
	  var request = self._remote.request_subscribe();
	  request.books([ self.to_json() ], true);
	  request.callback(function(err, res) {
	    if (err) {
	      // XXX What now?
	    } else {
	      self._sync   = true;
	      self._offers = res.offers;
	      self.emit('model', self._offers);
	    }
	  });
	};

	OrderBook.prototype.to_json = function () {
	  var json = {
	    taker_gets: {
	      currency: this._currency_gets
	    },
	    taker_pays: {
	      currency: this._currency_pays
	    }
	  };

	  if (this._currency_gets !== 'XRP') {
	    json['taker_gets']['issuer'] = this._issuer_gets;
	  }

	  if (this._currency_pays !== 'XRP') {
	    json['taker_pays']['issuer'] = this._issuer_pays;
	  }

	  return json;
	};

	/**
	 * Whether the OrderBook is valid.
	 *
	 * Note: This only checks whether the parameters (currencies and issuer) are
	 *       syntactically valid. It does not check anything against the ledger.
	 */
	OrderBook.prototype.is_valid = function () {
	  // XXX Should check for same currency (non-native) && same issuer
	  return (
	    Currency.is_valid(this._currency_pays) &&
	    (this._currency_pays === 'XRP' || UInt160.is_valid(this._issuer_pays)) &&
	    Currency.is_valid(this._currency_gets) &&
	    (this._currency_gets === 'XRP' || UInt160.is_valid(this._issuer_gets)) &&
	    !(this._currency_pays === 'XRP' && this._currency_gets === 'XRP')
	  );
	};

	OrderBook.prototype.trade = function(type) {
	  var tradeStr = '0'
	  + ((this['_currency_' + type] === 'XRP') ? '' : '/'
	     + this['_currency_' + type ] + '/'
	     + this['_issuer_' + type]);
	     return Amount.from_json(tradeStr);
	};

	/**
	 * Notify object of a relevant transaction.
	 *
	 * This is only meant to be called by the Remote class. You should never have to
	 * call this yourself.
	 */
	OrderBook.prototype.notify =
	  OrderBook.prototype.notifyTx = function (message) {
	  var self       = this;
	  var changed    = false;
	  var trade_gets = this.trade('gets');
	  var trade_pays = this.trade('pays');

	  message.mmeta.each(function (an) {
	    if (an.entryType !== 'Offer') return;

	    var i, l, offer;

	    switch(an.diffType) {
	      case 'DeletedNode':
	      case 'ModifiedNode':
	        var deletedNode = an.diffType === 'DeletedNode';

	        for (i = 0, l = self._offers.length; i < l; i++) {
	          offer = self._offers[i];
	          if (offer.index === an.ledgerIndex) {
	            if (deletedNode) {
	              self._offers.splice(i, 1);
	            } else {
	              extend(offer, an.fieldsFinal);
	            }
	            changed = true;
	            break;
	          }
	        }

	        // We don't want to count a OfferCancel as a trade
	        if (message.transaction.TransactionType === 'OfferCancel') return;

	        trade_gets = trade_gets.add(an.fieldsPrev.TakerGets);
	        trade_pays = trade_pays.add(an.fieldsPrev.TakerPays);

	        if (!deletedNode) {
	          trade_gets = trade_gets.subtract(an.fieldsFinal.TakerGets);
	          trade_pays = trade_pays.subtract(an.fieldsFinal.TakerPays);
	        }
	        break;

	      case 'CreatedNode':
	        var price = Amount.from_json(an.fields.TakerPays).ratio_human(an.fields.TakerGets);

	        for (i = 0, l = self._offers.length; i < l; i++) {
	          offer = self._offers[i];
	          var priceItem = Amount.from_json(offer.TakerPays).ratio_human(offer.TakerGets);

	          if (price.compareTo(priceItem) <= 0) {
	            var obj   = an.fields;
	            obj.index = an.ledgerIndex;
	            self._offers.splice(i, 0, an.fields);
	            changed = true;
	            break;
	          }
	        }
	        break;
	    }
	  });

	  // Only trigger the event if the account object is actually
	  // subscribed - this prevents some weird phantom events from
	  // occurring.
	  if (this._subs) {
	    this.emit('transaction', message);
	    if (changed) this.emit('model', this._offers);
	    if (!trade_gets.is_zero()) this.emit('trade', trade_pays, trade_gets);
	  }
	};

	/**
	 * Get offers model asynchronously.
	 *
	 * This function takes a callback and calls it with an array containing the
	 * current set of offers in this order book.
	 *
	 * If the data is available immediately, the callback may be called synchronously.
	 */
	OrderBook.prototype.offers = function (callback) {
	  var self = this;
	  if (typeof callback === 'function') {
	    if (this._sync) {
	      callback(this._offers);
	    } else {
	      this.once('model', callback);
	    }
	  }
	  return this;
	};

	/**
	 * Return latest known offers.
	 *
	 * Usually, this will just be an empty array if the order book hasn't been
	 * loaded yet. But this accessor may be convenient in some circumstances.
	 */
	OrderBook.prototype.offersSync = function () {
	  return this._offers;
	};

	exports.OrderBook = OrderBook;

	// vim:sw=2:sts=2:ts=8:et


/***/ },

/***/ 18:
/***/ function(module, exports, require) {

	var EventEmitter = require(25).EventEmitter;
	var util         = require(26);
	var Amount       = require(3).Amount;
	var extend       = require(30);

	/**
	 * Represents a persistent path finding request.
	 *
	 * Only one path find request is allowed per connection, so when another path
	 * find request is triggered it will supercede the existing one, making it emit
	 * the 'end' and 'superceded' events.
	 */
	function PathFind(remote, src_account, dst_account, dst_amount, src_currencies) {
	  EventEmitter.call(this);

	  this.remote = remote;

	  this.src_account    = src_account;
	  this.dst_account    = dst_account;
	  this.dst_amount     = dst_amount;
	  this.src_currencies = src_currencies;
	};

	util.inherits(PathFind, EventEmitter);

	/**
	 * Submits a path_find_create request to the network.
	 *
	 * This starts a path find request, superceding all previous path finds.
	 *
	 * This will be called automatically by Remote when this object is instantiated,
	 * so you should only have to call it if the path find was closed or superceded
	 * and you wish to restart it.
	 */
	PathFind.prototype.create = function () {
	  var self = this;

	  var req = this.remote.request_path_find_create(this.src_account,
	                                                 this.dst_account,
	                                                 this.dst_amount,
	                                                 this.src_currencies,
	                                                 handleInitialPath);

	  function handleInitialPath(err, msg) {
	    if (err) {
	      self.emit('error', err);
	    } else {
	      self.notify_update(msg);
	    }
	  }

	  // XXX We should add ourselves to prepare_subscribe or a similar mechanism so
	  // that we can resubscribe after a reconnection.

	  req.request();
	};

	PathFind.prototype.close = function () {
	  this.remote.request_path_find_close().request();
	  this.emit('end');
	  this.emit('close');
	};

	PathFind.prototype.notify_update = function (message) {
	  var src_account = message.source_account;
	  var dst_account = message.destination_account;
	  var dst_amount  = Amount.from_json(message.destination_amount);

	  // Only pass the event along if this path find response matches what we were
	  // looking for.
	  if (this.src_account === src_account &&
	      this.dst_account === dst_account &&
	      this.dst_amount.equals(dst_amount)) {
	    this.emit('update', message);
	  }
	};

	PathFind.prototype.notify_superceded = function () {
	  // XXX If we're set to re-subscribe whenever we connect to a new server, then
	  // we should cancel that behavior here. See PathFind#create.

	  this.emit('end');
	  this.emit('superceded');
	};

	exports.PathFind = PathFind;


/***/ },

/***/ 19:
/***/ function(module, exports, require) {

	//
	// Seed support
	//

	var utils   = require(11);
	var sjcl    = utils.sjcl;
	var extend  = require(30);

	var BigInteger = utils.jsbn.BigInteger;

	var Base    = require(5).Base;
	var UInt    = require(31).UInt;
	var UInt256 = require(22).UInt256;
	var KeyPair = require(33).KeyPair;

	var Seed = extend(function () {
	  // Internal form: NaN or BigInteger
	  this._curve = sjcl.ecc.curves['c256'];
	  this._value = NaN;
	}, UInt);

	Seed.width = 16;
	Seed.prototype = extend({}, UInt.prototype);
	Seed.prototype.constructor = Seed;

	// value = NaN on error.
	// One day this will support rfc1751 too.
	Seed.prototype.parse_json = function (j) {
	  if (typeof j === 'string') {
	    if (!j.length) {
	      this._value = NaN;
	    // XXX Should actually always try and continue if it failed.
	    } else if (j[0] === "s") {
	      this._value = Base.decode_check(Base.VER_FAMILY_SEED, j);
	    } else if (j.length === 32) {
	      this._value = this.parse_hex(j);
	    // XXX Should also try 1751
	    } else {
	      this.parse_passphrase(j);
	    }
	  } else {
	    this._value = NaN;
	  }

	  return this;
	};

	Seed.prototype.parse_passphrase = function (j) {
	  if (typeof j !== 'string') {
	    throw new Error("Passphrase must be a string");
	  }

	  var hash = sjcl.hash.sha512.hash(sjcl.codec.utf8String.toBits(j));
	  var bits = sjcl.bitArray.bitSlice(hash, 0, 128);

	  this.parse_bits(bits);

	  return this;
	};

	Seed.prototype.to_json = function () {
	  if (!(this._value instanceof BigInteger)) {
	    return NaN;
	  }

	  var output = Base.encode_check(Base.VER_FAMILY_SEED, this.to_bytes());

	  return output;
	};

	function append_int(a, i) {
	  return [].concat(a, i >> 24, (i >> 16) & 0xff, (i >> 8) & 0xff, i & 0xff);
	};

	function firstHalfOfSHA512(bytes) {
	  return sjcl.bitArray.bitSlice(
	    sjcl.hash.sha512.hash(sjcl.codec.bytes.toBits(bytes)),
	    0, 256
	  );
	};

	function SHA256_RIPEMD160(bits) {
	  return sjcl.hash.ripemd160.hash(sjcl.hash.sha256.hash(bits));
	};

	Seed.prototype.get_key = function (account_id) {
	  if (!this.is_valid()) {
	    throw new Error("Cannot generate keys from invalid seed!");
	  }
	  // XXX Should loop over keys until we find the right one

	  var private_gen, public_gen;
	  var curve = this._curve;
	  var seq = 0, i = 0;

	  do {
	    private_gen = sjcl.bn.fromBits(firstHalfOfSHA512(append_int(this.to_bytes(), i)));
	    i++;
	  } while (!curve.r.greaterEquals(private_gen));

	  public_gen = curve.G.mult(private_gen);

	  var sec;
	  i = 0;

	  do {
	    sec = sjcl.bn.fromBits(firstHalfOfSHA512(append_int(append_int(public_gen.toBytesCompressed(), seq), i)));
	    i++;
	  } while (!curve.r.greaterEquals(sec));

	  sec = sec.add(private_gen).mod(curve.r);

	  return KeyPair.from_bn_secret(sec);
	};

	exports.Seed = Seed;


/***/ },

/***/ 20:
/***/ function(module, exports, require) {

	/**
	 * Prefix for hashing functions.
	 *
	 * These prefixes are inserted before the source material used to
	 * generate various hashes. This is done to put each hash in its own
	 * "space." This way, two different types of objects with the
	 * same binary data will produce different hashes.
	 *
	 * Each prefix is a 4-byte value with the last byte set to zero
	 * and the first three bytes formed from the ASCII equivalent of
	 * some arbitrary string. For example "TXN".
	 */

	// transaction plus signature to give transaction ID
	exports.HASH_TX_ID           = 0x54584E00; // 'TXN'
	// transaction plus metadata
	exports.HASH_TX_NODE         = 0x534E4400; // 'TND'
	// inner node in tree
	exports.HASH_INNER_NODE      = 0x4D494E00; // 'MIN'
	// inner transaction to sign
	exports.HASH_TX_SIGN         = 0x53545800; // 'STX'
	// inner transaction to sign (TESTNET)
	exports.HASH_TX_SIGN_TESTNET = 0x73747800; // 'stx'


/***/ },

/***/ 21:
/***/ function(module, exports, require) {

	/**
	 * Type definitions for binary format.
	 *
	 * This file should not be included directly. Instead, find the format you're
	 * trying to parse or serialize in binformat.js and pass that to
	 * SerializedObject.parse() or SerializedObject.serialize().
	 */

	var assert    = require(27);
	var extend    = require(30);
	var binformat = require(10);
	var utils     = require(11);
	var sjcl      = utils.sjcl;

	var UInt128   = require(34).UInt128;
	var UInt160   = require(15).UInt160;
	var UInt256   = require(22).UInt256;
	var Base      = require(5).Base;

	var amount    = require(3);
	var Amount    = amount.Amount;
	var Currency  = amount.Currency;

	// Shortcuts
	var hex       = sjcl.codec.hex;
	var bytes     = sjcl.codec.bytes;

	var BigInteger = utils.jsbn.BigInteger;


	var SerializedType = function (methods) {
	  extend(this, methods);
	};

	function isNumber(val) {
	  return typeof val === 'number' && isFinite(val);
	};

	function isString(val) {
	  return typeof val === 'string';
	};

	function isHexInt64String(val) {
	  return isString(val) && /^[0-9A-F]{0,16}$/i.test(val);
	};

	function isCurrencyString(val) {
	  return isString(val) && /^[A-Z0-9]{3}$/.test(val);
	};

	function isBigInteger(val) {
	  return val instanceof BigInteger;
	};

	function serialize_hex(so, hexData, noLength) {
	  var byteData = bytes.fromBits(hex.toBits(hexData));
	  if (!noLength) {
	    SerializedType.serialize_varint(so, byteData.length);
	  }
	  so.append(byteData);
	};

	/**
	 * parses bytes as hex
	 */
	function convert_bytes_to_hex (byte_array) {
	  return sjcl.codec.hex.fromBits(sjcl.codec.bytes.toBits(byte_array)).toUpperCase();
	};

	SerializedType.serialize_varint = function (so, val) {
	  if (val < 0) {
	    throw new Error('Variable integers are unsigned.');
	  }

	  if (val <= 192) {
	    so.append([val]);
	  } else if (val <= 12480) {
	    val -= 193;
	    so.append([193 + (val >>> 8), val & 0xff]);
	  } else if (val <= 918744) {
	    val -= 12481;
	    so.append([
	              241 + (val >>> 16),
	              val >>> 8 & 0xff,
	              val & 0xff
	    ]);
	  } else {
	    throw new Error('Variable integer overflow.');
	  }
	};

	SerializedType.prototype.parse_varint = function (so) {
	  var b1 = so.read(1)[0], b2, b3;
	  var result;

	  if (b1 > 254) {
	    throw new Error('Invalid varint length indicator');
	  }

	  if (b1 <= 192) {
	    result = b1;
	  } else if (b1 <= 240) {
	    b2 = so.read(1)[0];
	    result = 193 + (b1 - 193) * 256 + b2;
	  } else if (b1 <= 254) {
	    b2 = so.read(1)[0];
	    b3 = so.read(1)[0];
	    result = 12481 + (b1 - 241) * 65536 + b2 * 256 + b3
	  }

	  return result;
	};

	// In the following, we assume that the inputs are in the proper range. Is this correct?
	// Helper functions for 1-, 2-, and 4-byte integers.

	/**
	 * Convert an integer value into an array of bytes.
	 *
	 * The result is appended to the serialized object ('so').
	 */
	function append_byte_array(so, val, bytes) {
	  if (!isNumber(val)) {
	    throw new Error('Value is not a number');
	  }

	  if (val < 0 || val >= Math.pow(256, bytes)) {
	    throw new Error('Value out of bounds');
	  }

	  var newBytes = [ ];

	  for (var i=0; i<bytes; i++) {
	    newBytes.unshift(val >>> (i * 8) & 0xff);
	  }

	  so.append(newBytes);
	};

	// Convert a certain number of bytes from the serialized object ('so') into an integer.
	function readAndSum(so, bytes) {
	  var sum = 0;

	  if (bytes > 4) {
	    throw new Error("This function only supports up to four bytes.");
	  }

	  for (var i=0; i<bytes; i++) {
	    var byte = so.read(1)[0];
	    sum += (byte << (8 * (bytes - i - 1)));
	  }

	  // Convert to unsigned integer
	  return sum >>> 0;
	};

	var STInt8 = exports.Int8 = new SerializedType({
	  serialize: function (so, val) {
	    append_byte_array(so, val, 1);
	  },
	  parse: function (so) {
	    return readAndSum(so, 1);
	  }
	});

	STInt8.id = 16;

	var STInt16 = exports.Int16 = new SerializedType({
	  serialize: function (so, val) {
	    append_byte_array(so, val, 2);
	  },
	  parse: function (so) {
	    return readAndSum(so, 2);
	  }
	});

	STInt16.id = 1;

	var STInt32 = exports.Int32 = new SerializedType({
	  serialize: function (so, val) {
	    append_byte_array(so, val, 4);
	  },
	  parse: function (so) {
	    return readAndSum(so, 4);
	  }
	});

	STInt32.id = 2;

	var STInt64 = exports.Int64 = new SerializedType({
	  serialize: function (so, val) {
	    var bigNumObject;

	    if (isNumber(val)) {
	      val = Math.floor(val);
	      if (val < 0) {
	        throw new Error('Negative value for unsigned Int64 is invalid.');
	      }
	      bigNumObject = new BigInteger(String(val), 10);
	    } else if (isString(val)) {
	      if (!isHexInt64String(val)) {
	        throw new Error('Not a valid hex Int64.');
	      }
	      bigNumObject = new BigInteger(val, 16);
	    } else if (isBigInteger(val)) {
	      if (val.compareTo(BigInteger.ZERO) < 0) {
	        throw new Error('Negative value for unsigned Int64 is invalid.');
	      }
	      bigNumObject = val;
	    } else {
	      throw new Error('Invalid type for Int64');
	    }

	    var hex = bigNumObject.toString(16);

	    if (hex.length > 16) {
	      throw new Error('Int64 is too large');
	    }

	    while (hex.length < 16) {
	      hex = '0' + hex;
	    }

	    serialize_hex(so, hex, true); //noLength = true
	  },
	  parse: function (so) {
	    var result = new BigInteger(so.read(8), 256);
	    assert(result instanceof BigInteger);
	    return result;
	  }
	});

	STInt64.id = 3;

	var STHash128 = exports.Hash128 = new SerializedType({
	  serialize: function (so, val) {
	    var hash = UInt128.from_json(val);
	    if (!hash.is_valid()) {
	      throw new Error('Invalid Hash128');
	    }
	    serialize_hex(so, hash.to_hex(), true); //noLength = true
	  },
	  parse: function (so) {
	    return UInt128.from_bytes(so.read(16));
	  }
	});

	STHash128.id = 4;

	var STHash256 = exports.Hash256 = new SerializedType({
	  serialize: function (so, val) {
	    var hash = UInt256.from_json(val);
	    if (!hash.is_valid()) {
	      throw new Error('Invalid Hash256');
	    }
	    serialize_hex(so, hash.to_hex(), true); //noLength = true
	  },
	  parse: function (so) {
	    return UInt256.from_bytes(so.read(32));
	  }
	});

	STHash256.id = 5;

	var STHash160 = exports.Hash160 = new SerializedType({
	  serialize: function (so, val) {
	    var hash = UInt160.from_json(val);
	    if (!hash.is_valid()) {
	      throw new Error('Invalid Hash160');
	    }
	    serialize_hex(so, hash.to_hex(), true); //noLength = true
	  },
	  parse: function (so) {
	    return UInt160.from_bytes(so.read(20));
	  }
	});

	STHash160.id = 17;

	// Internal
	var STCurrency = new SerializedType({
	  serialize: function (so, val, xrp_as_ascii) {
	    var currency = val.to_json().toUpperCase();

	    if (!isCurrencyString(currency)) {
	      throw new Error('Tried to serialize invalid/unimplemented currency type.');
	    }

	    if (currency === 'XRP' && !xrp_as_ascii) {
	      serialize_hex(so, UInt160.HEX_ZERO, true);
	    } else {
	      var currencyCode = currency.toUpperCase();
	      var currencyData = utils.arraySet(20, 0);
	      currencyData[12] = currencyCode.charCodeAt(0) & 0xff;
	      currencyData[13] = currencyCode.charCodeAt(1) & 0xff;
	      currencyData[14] = currencyCode.charCodeAt(2) & 0xff;
	      so.append(currencyData);
	    }
	  },
	  parse: function (so) {
	    var bytes = so.read(20);
	    var currency = Currency.from_bytes(bytes);
	    // XXX Disabled check. Theoretically, the Currency class should support any
	    //     UInt160 value and consider it valid. But it doesn't, so for the
	    //     deserialization to be usable, we need to allow invalid results for now.
	    //if (!currency.is_valid()) {
	    //  throw new Error('Invalid currency: '+convert_bytes_to_hex(bytes));
	    //}
	    return currency;
	  }
	});

	var STAmount = exports.Amount = new SerializedType({
	  serialize: function (so, val) {
	    var amount = Amount.from_json(val);
	    if (!amount.is_valid()) {
	      throw new Error('Not a valid Amount object.');
	    }

	    // Amount (64-bit integer)
	    var valueBytes = utils.arraySet(8, 0);

	    if (amount.is_native()) {
	      var valueHex = amount._value.toString(16);

	      // Enforce correct length (64 bits)
	      if (valueHex.length > 16) {
	        throw new Error('Value out of bounds');
	      }

	      while (valueHex.length < 16) {
	        valueHex = '0' + valueHex;
	      }

	      valueBytes = bytes.fromBits(hex.toBits(valueHex));
	      // Clear most significant two bits - these bits should already be 0 if
	      // Amount enforces the range correctly, but we'll clear them anyway just
	      // so this code can make certain guarantees about the encoded value.
	      valueBytes[0] &= 0x3f;
	      if (!amount.is_negative()) valueBytes[0] |= 0x40;
	    } else {
	      var hi = 0, lo = 0;

	      // First bit: non-native
	      hi |= 1 << 31;

	      if (!amount.is_zero()) {
	        // Second bit: non-negative?
	        if (!amount.is_negative()) hi |= 1 << 30;
	        // Next eight bits: offset/exponent
	        hi |= ((97 + amount._offset) & 0xff) << 22;
	        // Remaining 52 bits: mantissa
	        hi |= amount._value.shiftRight(32).intValue() & 0x3fffff;
	        lo = amount._value.intValue() & 0xffffffff;
	      }

	      valueBytes = sjcl.codec.bytes.fromBits([hi, lo]);
	    }

	    so.append(valueBytes);

	    if (!amount.is_native()) {
	      // Currency (160-bit hash)
	      var currency = amount.currency();
	      STCurrency.serialize(so, currency, true);

	      // Issuer (160-bit hash)
	      so.append(amount.issuer().to_bytes());
	    }
	  },
	  parse: function (so) {
	    var amount = new Amount();
	    var value_bytes = so.read(8);
	    var is_zero = !(value_bytes[0] & 0x7f);

	    for (var i=1; i<8; i++) {
	      is_zero = is_zero && !value_bytes[i];
	    }

	    if (value_bytes[0] & 0x80) {
	      //non-native
	      var currency = STCurrency.parse(so);
	      var issuer_bytes = so.read(20);
	      var issuer = UInt160.from_bytes(issuer_bytes);
	      issuer.set_version(Base.VER_ACCOUNT_ID);
	      var offset = ((value_bytes[0] & 0x3f) << 2) + (value_bytes[1] >>> 6) - 97;
	      var mantissa_bytes = value_bytes.slice(1);
	      mantissa_bytes[0] &= 0x3f;
	      var value = new BigInteger(mantissa_bytes, 256);

	      if (value.equals(BigInteger.ZERO) && !is_zero ) {
	        throw new Error('Invalid zero representation');
	      }

	      amount._value = value;
	      amount._offset = offset;
	      amount._currency    = currency;
	      amount._issuer      = issuer;
	      amount._is_native   = false;
	    } else {
	      //native
	      var integer_bytes = value_bytes.slice();
	      integer_bytes[0] &= 0x3f;
	      amount._value = new BigInteger(integer_bytes, 256);
	      amount._is_native   = true;
	    }
	    amount._is_negative = !is_zero && !(value_bytes[0] & 0x40);
	    return amount;
	  }
	});

	STAmount.id = 6;

	var STVL = exports.VariableLength = new SerializedType({
	  serialize: function (so, val) {
	    if (typeof val === 'string') {
	      serialize_hex(so, val);
	    } else {
	      throw new Error('Unknown datatype.');
	    }
	  },
	  parse: function (so) {
	    var len = this.parse_varint(so);
	    return convert_bytes_to_hex(so.read(len));
	  }
	});

	STVL.id = 7;

	var STAccount = exports.Account = new SerializedType({
	  serialize: function (so, val) {
	    var account = UInt160.from_json(val);
	    if (!account.is_valid()) {
	      throw new Error('Invalid account!');
	    }
	    serialize_hex(so, account.to_hex());
	  },
	  parse: function (so) {
	    var len = this.parse_varint(so);

	    if (len !== 20) {
	      throw new Error('Non-standard-length account ID');
	    }

	    var result = UInt160.from_bytes(so.read(len));
	    result.set_version(Base.VER_ACCOUNT_ID);

	    //console.log('PARSED 160:', result.to_json());
	    if (false) {
	      throw new Error('Invalid Account');
	    }

	    return result;
	  }
	});

	STAccount.id = 8;

	var STPathSet = exports.PathSet = new SerializedType({
	  typeBoundary:  0xff,
	  typeEnd:       0x00,
	  typeAccount:   0x01,
	  typeCurrency:  0x10,
	  typeIssuer:    0x20,
	  serialize: function (so, val) {
	    for (var i=0, l=val.length; i<l; i++) {
	      // Boundary
	      if (i) {
	        STInt8.serialize(so, this.typeBoundary);
	      }

	      for (var j=0, l2=val[i].length; j<l2; j++) {
	        var entry = val[i][j];
	        //if (entry.hasOwnProperty('_value')) {entry = entry._value;}
	        var type = 0;

	        if (entry.account)  type |= this.typeAccount;
	        if (entry.currency) type |= this.typeCurrency;
	        if (entry.issuer)   type |= this.typeIssuer;

	        STInt8.serialize(so, type);
	        if (entry.account) {
	          so.append(UInt160.from_json(entry.account).to_bytes());
	        }

	        if (entry.currency) {
	          var currency = Currency.from_json(entry.currency);
	          STCurrency.serialize(so, currency, entry.non_native);
	        }

	        if (entry.issuer) {
	          so.append(UInt160.from_json(entry.issuer).to_bytes());
	        }
	      }
	    }
	    STInt8.serialize(so, this.typeEnd);
	  },
	  parse: function (so) {
	    // should return a list of lists:
	    /*
	       [
	       [entry, entry],
	       [entry, entry, entry],
	       [entry],
	       []
	       ]

	       each entry has one or more of the following attributes: amount, currency, issuer.
	       */

	    var path_list    = [];
	    var current_path = [];
	    var tag_byte;

	    while ((tag_byte = so.read(1)[0]) !== this.typeEnd) {
	      //TODO: try/catch this loop, and catch when we run out of data without reaching the end of the data structure.
	      //Now determine: is this an end, boundary, or entry-begin-tag?
	      //console.log('Tag byte:', tag_byte);
	      if (tag_byte === this.typeBoundary) {
	        //console.log('Boundary');
	        if (current_path) { //close the current path, if there is one,
	          path_list.push(current_path);
	        }
	        current_path = []; //and start a new one.
	      } else {
	        //It's an entry-begin tag.
	        //console.log('It's an entry-begin tag.');
	        var entry = {};

	        if (tag_byte & this.typeAccount) {
	          //console.log('entry.account');
	          /*var bta = so.read(20);
	            console.log('BTA:', bta);*/
	          entry.account = STHash160.parse(so);
	          entry.account.set_version(Base.VER_ACCOUNT_ID);
	        }
	        if (tag_byte & this.typeCurrency) {
	          //console.log('entry.currency');
	          entry.currency = STCurrency.parse(so);
	          if (entry.currency.to_json() === "XRP" &&
	              !entry.currency.is_native()) {
	            entry.non_native = true;
	          }
	        }
	        if (tag_byte & this.typeIssuer) {
	          //console.log('entry.issuer');
	          entry.issuer = STHash160.parse(so); //should know to use Base58?
	          entry.issuer.set_version(Base.VER_ACCOUNT_ID);
	          //console.log('DONE WITH ISSUER!');
	        }

	        if (entry.account || entry.currency || entry.issuer) {
	          current_path.push(entry);
	        } else {
	          throw new Error('Invalid path entry'); //It must have at least something in it.
	        }
	      }
	    }

	    if (current_path) {
	      //close the current path, if there is one,
	      path_list.push(current_path);
	    }

	    return path_list;
	  }
	});

	STPathSet.id = 18;

	var STVector256 = exports.Vector256 = new SerializedType({
	  serialize: function (so, val) { //Assume val is an array of STHash256 objects.
	    var length_as_varint = SerializedType.serialize_varint(so, val.length);
	    for (var i=0, l=val.length; i<l; i++) {
	      STHash256.serialize(so, val[i]);
	    }
	  },
	  parse: function (so) {
	    var length = this.parse_varint(so);
	    var output = [];
	    for (var i=0; i<length; i++) {
	      output.push(STHash256.parse(so));
	    }
	    return output;
	  }
	});

	STVector256.id = 19;

	exports.serialize = exports.serialize_whatever = serialize;

	function serialize(so, field_name, value) {
	  //so: a byte-stream to serialize into.
	  //field_name: a string for the field name ('LedgerEntryType' etc.)
	  //value: the value of that field.
	  var field_coordinates = INVERSE_FIELDS_MAP[field_name];
	  var type_bits         = field_coordinates[0];
	  var field_bits        = field_coordinates[1];
	  var tag_byte          = (type_bits < 16 ? type_bits << 4 : 0) | (field_bits < 16 ? field_bits : 0);

	  if (field_name === "LedgerEntryType" && "string" === typeof value) {
	    value = binformat.ledger[value][0];
	  }

	  if (field_name === "TransactionResult" && "string" === typeof value) {
	    value = binformat.ter[value];
	  }

	  STInt8.serialize(so, tag_byte);

	  if (type_bits >= 16) {
	    STInt8.serialize(so, type_bits);
	  }

	  if (field_bits >= 16) {
	    STInt8.serialize(so, field_bits);
	  }

	  var serialized_object_type = TYPES_MAP[type_bits];
	  //do something with val[keys] and val[keys[i]];
	  serialized_object_type.serialize(so, value);
	}

	//Take the serialized object, figure out what type/field it is, and return the parsing of that.
	exports.parse = exports.parse_whatever = parse;

	function parse(so) {
	  var tag_byte   = so.read(1)[0];
	  var type_bits  = tag_byte >> 4;

	  if (type_bits === 0) {
	    type_bits = so.read(1)[0];
	  }

	  var type = TYPES_MAP[type_bits];

	  assert(type, 'Unknown type - header byte is 0x' + tag_byte.toString(16));

	  var field_bits = tag_byte & 0x0f;
	  var field_name = (field_bits === 0)
	  ? field_name = FIELDS_MAP[type_bits][so.read(1)[0]]
	  : field_name = FIELDS_MAP[type_bits][field_bits];

	  assert(field_name, 'Unknown field - header byte is 0x' + tag_byte.toString(16));

	  return [ field_name, type.parse(so) ]; //key, value
	};

	function sort_fields(keys) {
	  function sort_field_compare(a, b) {
	    var a_field_coordinates = INVERSE_FIELDS_MAP[a];
	    var a_type_bits         = a_field_coordinates[0];
	    var a_field_bits        = a_field_coordinates[1];
	    var b_field_coordinates = INVERSE_FIELDS_MAP[b];
	    var b_type_bits         = b_field_coordinates[0];
	    var b_field_bits        = b_field_coordinates[1];

	    // Sort by type id first, then by field id
	    return a_type_bits !== b_type_bits ? a_type_bits - b_type_bits : a_field_bits - b_field_bits;
	  };

	  return keys.sort(sort_field_compare);
	}

	var STObject = exports.Object = new SerializedType({
	  serialize: function (so, val, no_marker) {
	    var keys = Object.keys(val);

	    // Ignore lowercase field names - they're non-serializable fields by
	    // convention.
	    keys = keys.filter(function (key) {
	      return key[0] !== key[0].toLowerCase();
	    });

	    // Sort fields
	    keys = sort_fields(keys);

	    for (var i=0; i<keys.length; i++) {
	      serialize(so, keys[i], val[keys[i]]);
	    }
	    if (!no_marker) STInt8.serialize(so, 0xe1); //Object ending marker
	  },

	  parse: function (so) {
	    var output = {};
	    while (so.peek(1)[0] !== 0xe1) {
	      var keyval = parse(so);
	      output[keyval[0]] = keyval[1];
	    }
	    so.read(1);
	    return output;
	  }
	});

	STObject.id = 14;

	var STArray = exports.Array = new SerializedType({
	  serialize: function (so, val) {
	    for (var i=0, l=val.length; i<l; i++) {
	      var keys = Object.keys(val[i]);

	      if (keys.length !== 1) {
	        throw Error('Cannot serialize an array containing non-single-key objects');
	      }

	      var field_name = keys[0];
	      var value = val[i][field_name];
	      serialize(so, field_name, value);
	    }
	    STInt8.serialize(so, 0xf1); //Array ending marker
	  },

	  parse: function (so) {
	    var output = [ ];

	    while (so.peek(1)[0] !== 0xf1) {
	      var keyval = parse(so);
	      var obj = { };
	      obj[keyval[0]] = keyval[1];
	      output.push(obj);
	    }

	    so.read(1);

	    return output;
	  }
	});

	STArray.id = 15;

	var TYPES_MAP = [
	  void(0),

	  //Common:
	  STInt16,    //1
	  STInt32,    //2
	  STInt64,    //3
	  STHash128,  //4
	  STHash256,  //5
	  STAmount,   //6
	  STVL,       //7
	  STAccount,  //8

	  // 9-13 reserved
	  void(0),    //9
	  void(0),    //10
	  void(0),    //11
	  void(0),    //12
	  void(0),    //13

	  STObject,   //14
	  STArray,    //15

	  //Uncommon:
	  STInt8,     //16
	  STHash160,  //17
	  STPathSet,  //18
	  STVector256 //19
	];

	var FIELDS_MAP = {
	  //Common types
	  1: { //Int16
	    1: 'LedgerEntryType',
	    2: 'TransactionType'
	  },
	  2: { //Int32
	    2:'Flags', 3:'SourceTag',4:'Sequence',5:'PreviousTxnLgrSeq',6:'LedgerSequence',
	    7:'CloseTime', 8:'ParentCloseTime',9:'SigningTime',10:'Expiration',11:'TransferRate',
	    12:'WalletSize', 13:'OwnerCount',14:'DestinationTag',
	    //Skip 15
	    16:'HighQualityIn', 17:'HighQualityOut',18:'LowQualityIn',19:'LowQualityOut',
	    20:'QualityIn', 21:'QualityOut',22:'StampEscrow',23:'BondAmount',24:'LoadFee',
	    25:'OfferSequence', 26:'FirstLedgerSequence',27:'LastLedgerSequence',28:'TransactionIndex',
	    29:'OperationLimit', 30:'ReferenceFeeUnits',31:'ReserveBase',32:'ReserveIncrement',
	    33:'SetFlag', 34:'ClearFlag',
	  },
	  3: { // Int64
	    1:'IndexNext', 2:'IndexPrevious',3:'BookNode',4:'OwnerNode',
	    5:'BaseFee', 6:'ExchangeRate',7:'LowNode',8:'HighNode'
	  },
	  4: { //Hash128
	    1:'EmailHash'
	  },
	  5: { //Hash256
	    1:'LedgerHash', 2:'ParentHash',3:'TransactionHash',4:'AccountHash',5:'PreviousTxnID',
	    6:'LedgerIndex', 7:'WalletLocator',8:'RootIndex',16:'BookDirectory',17:'InvoiceID',
	    18:'Nickname', 19:'Feature'
	  },
	  6: { //Amount
	    1:'Amount', 2:'Balance',3:'LimitAmount',4:'TakerPays',5:'TakerGets',6:'LowLimit',
	    7:'HighLimit', 8:'Fee',9:'SendMax',16:'MinimumOffer',17:'RippleEscrow'
	  },
	  7: { //VL
	    1:'PublicKey', 2:'MessageKey',3:'SigningPubKey',4:'TxnSignature',5:'Generator',
	    6:'Signature', 7:'Domain',8:'FundCode',9:'RemoveCode',10:'ExpireCode',11:'CreateCode'
	  },
	  8: { //Account
	    1:'Account', 2:'Owner',3:'Destination',4:'Issuer',7:'Target',8:'RegularKey'
	  },
	  14: { //Object
	    1:void(0),  //end of Object
	    2:'TransactionMetaData', 3:'CreatedNode',4:'DeletedNode',5:'ModifiedNode',
	    6:'PreviousFields', 7:'FinalFields',8:'NewFields',9:'TemplateEntry',
	  },
	  15: { //Array
	    1:void(0),  //end of Array
	    2:'SigningAccounts', 3:'TxnSignatures',4:'Signatures',5:'Template',
	    6:'Necessary', 7:'Sufficient',8:'AffectedNodes',
	  },

	  //Uncommon types
	  16: { //Int8
	    1:'CloseResolution', 2:'TemplateEntryType',3:'TransactionResult'
	  },
	  17: { //Hash160
	    1:'TakerPaysCurrency', 2:'TakerPaysIssuer',3:'TakerGetsCurrency',4:'TakerGetsIssuer'
	  },
	  18: { //PathSet
	    1:'Paths'
	  },
	  19: { //Vector256
	    1:'Indexes', 2:'Hashes', 3:'Features'
	  }
	};

	var INVERSE_FIELDS_MAP = { };

	Object.keys(FIELDS_MAP).forEach(function(k1) {
	  Object.keys(FIELDS_MAP[k1]).forEach(function(k2) {
	    INVERSE_FIELDS_MAP[FIELDS_MAP[k1][k2]] = [ Number(k1), Number(k2) ];
	  });
	});


/***/ },

/***/ 22:
/***/ function(module, exports, require) {

	var sjcl    = require(11).sjcl;
	var utils   = require(11);
	var config  = require(13);
	var extend  = require(30);

	var BigInteger = utils.jsbn.BigInteger;

	var UInt = require(31).UInt,
	    Base = require(5).Base;

	//
	// UInt256 support
	//

	var UInt256 = extend(function () {
	  // Internal form: NaN or BigInteger
	  this._value  = NaN;
	}, UInt);

	UInt256.width = 32;
	UInt256.prototype = extend({}, UInt.prototype);
	UInt256.prototype.constructor = UInt256;

	var HEX_ZERO     = UInt256.HEX_ZERO = "00000000000000000000000000000000" +
	                                      "00000000000000000000000000000000";
	var HEX_ONE      = UInt256.HEX_ONE  = "00000000000000000000000000000000" +
	                                      "00000000000000000000000000000001";
	var STR_ZERO     = UInt256.STR_ZERO = utils.hexToString(HEX_ZERO);
	var STR_ONE      = UInt256.STR_ONE = utils.hexToString(HEX_ONE);

	exports.UInt256 = UInt256;


/***/ },

/***/ 23:
/***/ function(module, exports, require) {

	/* WEBPACK VAR INJECTION */(function(require, Buffer) {function SlowBuffer (size) {
	    this.length = size;
	};

	var assert = require(27);

	exports.INSPECT_MAX_BYTES = 50;


	function toHex(n) {
	  if (n < 16) return '0' + n.toString(16);
	  return n.toString(16);
	}

	function utf8ToBytes(str) {
	  var byteArray = [];
	  for (var i = 0; i < str.length; i++)
	    if (str.charCodeAt(i) <= 0x7F)
	      byteArray.push(str.charCodeAt(i));
	    else {
	      var h = encodeURIComponent(str.charAt(i)).substr(1).split('%');
	      for (var j = 0; j < h.length; j++)
	        byteArray.push(parseInt(h[j], 16));
	    }

	  return byteArray;
	}

	function asciiToBytes(str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; i++ )
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push( str.charCodeAt(i) & 0xFF );

	  return byteArray;
	}

	function base64ToBytes(str) {
	  return require(43).toByteArray(str);
	}

	SlowBuffer.byteLength = function (str, encoding) {
	  switch (encoding || "utf8") {
	    case 'hex':
	      return str.length / 2;

	    case 'utf8':
	    case 'utf-8':
	      return utf8ToBytes(str).length;

	    case 'ascii':
	      return str.length;

	    case 'base64':
	      return base64ToBytes(str).length;

	    default:
	      throw new Error('Unknown encoding');
	  }
	};

	function blitBuffer(src, dst, offset, length) {
	  var pos, i = 0;
	  while (i < length) {
	    if ((i+offset >= dst.length) || (i >= src.length))
	      break;

	    dst[i + offset] = src[i];
	    i++;
	  }
	  return i;
	}

	SlowBuffer.prototype.utf8Write = function (string, offset, length) {
	  var bytes, pos;
	  return SlowBuffer._charsWritten =  blitBuffer(utf8ToBytes(string), this, offset, length);
	};

	SlowBuffer.prototype.asciiWrite = function (string, offset, length) {
	  var bytes, pos;
	  return SlowBuffer._charsWritten =  blitBuffer(asciiToBytes(string), this, offset, length);
	};

	SlowBuffer.prototype.base64Write = function (string, offset, length) {
	  var bytes, pos;
	  return SlowBuffer._charsWritten = blitBuffer(base64ToBytes(string), this, offset, length);
	};

	SlowBuffer.prototype.base64Slice = function (start, end) {
	  var bytes = Array.prototype.slice.apply(this, arguments)
	  return require(43).fromByteArray(bytes);
	}

	function decodeUtf8Char(str) {
	  try {
	    return decodeURIComponent(str);
	  } catch (err) {
	    return String.fromCharCode(0xFFFD); // UTF 8 invalid char
	  }
	}

	SlowBuffer.prototype.utf8Slice = function () {
	  var bytes = Array.prototype.slice.apply(this, arguments);
	  var res = "";
	  var tmp = "";
	  var i = 0;
	  while (i < bytes.length) {
	    if (bytes[i] <= 0x7F) {
	      res += decodeUtf8Char(tmp) + String.fromCharCode(bytes[i]);
	      tmp = "";
	    } else
	      tmp += "%" + bytes[i].toString(16);

	    i++;
	  }

	  return res + decodeUtf8Char(tmp);
	}

	SlowBuffer.prototype.asciiSlice = function () {
	  var bytes = Array.prototype.slice.apply(this, arguments);
	  var ret = "";
	  for (var i = 0; i < bytes.length; i++)
	    ret += String.fromCharCode(bytes[i]);
	  return ret;
	}

	SlowBuffer.prototype.inspect = function() {
	  var out = [],
	      len = this.length;
	  for (var i = 0; i < len; i++) {
	    out[i] = toHex(this[i]);
	    if (i == exports.INSPECT_MAX_BYTES) {
	      out[i + 1] = '...';
	      break;
	    }
	  }
	  return '<SlowBuffer ' + out.join(' ') + '>';
	};


	SlowBuffer.prototype.hexSlice = function(start, end) {
	  var len = this.length;

	  if (!start || start < 0) start = 0;
	  if (!end || end < 0 || end > len) end = len;

	  var out = '';
	  for (var i = start; i < end; i++) {
	    out += toHex(this[i]);
	  }
	  return out;
	};


	SlowBuffer.prototype.toString = function(encoding, start, end) {
	  encoding = String(encoding || 'utf8').toLowerCase();
	  start = +start || 0;
	  if (typeof end == 'undefined') end = this.length;

	  // Fastpath empty strings
	  if (+end == start) {
	    return '';
	  }

	  switch (encoding) {
	    case 'hex':
	      return this.hexSlice(start, end);

	    case 'utf8':
	    case 'utf-8':
	      return this.utf8Slice(start, end);

	    case 'ascii':
	      return this.asciiSlice(start, end);

	    case 'binary':
	      return this.binarySlice(start, end);

	    case 'base64':
	      return this.base64Slice(start, end);

	    case 'ucs2':
	    case 'ucs-2':
	      return this.ucs2Slice(start, end);

	    default:
	      throw new Error('Unknown encoding');
	  }
	};


	SlowBuffer.prototype.hexWrite = function(string, offset, length) {
	  offset = +offset || 0;
	  var remaining = this.length - offset;
	  if (!length) {
	    length = remaining;
	  } else {
	    length = +length;
	    if (length > remaining) {
	      length = remaining;
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length;
	  if (strLen % 2) {
	    throw new Error('Invalid hex string');
	  }
	  if (length > strLen / 2) {
	    length = strLen / 2;
	  }
	  for (var i = 0; i < length; i++) {
	    var byte = parseInt(string.substr(i * 2, 2), 16);
	    if (isNaN(byte)) throw new Error('Invalid hex string');
	    this[offset + i] = byte;
	  }
	  SlowBuffer._charsWritten = i * 2;
	  return i;
	};


	SlowBuffer.prototype.write = function(string, offset, length, encoding) {
	  // Support both (string, offset, length, encoding)
	  // and the legacy (string, encoding, offset, length)
	  if (isFinite(offset)) {
	    if (!isFinite(length)) {
	      encoding = length;
	      length = undefined;
	    }
	  } else {  // legacy
	    var swap = encoding;
	    encoding = offset;
	    offset = length;
	    length = swap;
	  }

	  offset = +offset || 0;
	  var remaining = this.length - offset;
	  if (!length) {
	    length = remaining;
	  } else {
	    length = +length;
	    if (length > remaining) {
	      length = remaining;
	    }
	  }
	  encoding = String(encoding || 'utf8').toLowerCase();

	  switch (encoding) {
	    case 'hex':
	      return this.hexWrite(string, offset, length);

	    case 'utf8':
	    case 'utf-8':
	      return this.utf8Write(string, offset, length);

	    case 'ascii':
	      return this.asciiWrite(string, offset, length);

	    case 'binary':
	      return this.binaryWrite(string, offset, length);

	    case 'base64':
	      return this.base64Write(string, offset, length);

	    case 'ucs2':
	    case 'ucs-2':
	      return this.ucs2Write(string, offset, length);

	    default:
	      throw new Error('Unknown encoding');
	  }
	};


	// slice(start, end)
	SlowBuffer.prototype.slice = function(start, end) {
	  if (end === undefined) end = this.length;

	  if (end > this.length) {
	    throw new Error('oob');
	  }
	  if (start > end) {
	    throw new Error('oob');
	  }

	  return new Buffer(this, end - start, +start);
	};

	SlowBuffer.prototype.copy = function(target, targetstart, sourcestart, sourceend) {
	  var temp = [];
	  for (var i=sourcestart; i<sourceend; i++) {
	    assert.ok(typeof this[i] !== 'undefined', "copying undefined buffer bytes!");
	    temp.push(this[i]);
	  }

	  for (var i=targetstart; i<targetstart+temp.length; i++) {
	    target[i] = temp[i-targetstart];
	  }
	};

	function coerce(length) {
	  // Coerce length to a number (possibly NaN), round up
	  // in case it's fractional (e.g. 123.456) then do a
	  // double negate to coerce a NaN to 0. Easy, right?
	  length = ~~Math.ceil(+length);
	  return length < 0 ? 0 : length;
	}


	// Buffer

	function Buffer(subject, encoding, offset) {
	  if (!(this instanceof Buffer)) {
	    return new Buffer(subject, encoding, offset);
	  }

	  var type;

	  // Are we slicing?
	  if (typeof offset === 'number') {
	    this.length = coerce(encoding);
	    this.parent = subject;
	    this.offset = offset;
	  } else {
	    // Find the length
	    switch (type = typeof subject) {
	      case 'number':
	        this.length = coerce(subject);
	        break;

	      case 'string':
	        this.length = Buffer.byteLength(subject, encoding);
	        break;

	      case 'object': // Assume object is an array
	        this.length = coerce(subject.length);
	        break;

	      default:
	        throw new Error('First argument needs to be a number, ' +
	                        'array or string.');
	    }

	    if (this.length > Buffer.poolSize) {
	      // Big buffer, just alloc one.
	      this.parent = new SlowBuffer(this.length);
	      this.offset = 0;

	    } else {
	      // Small buffer.
	      if (!pool || pool.length - pool.used < this.length) allocPool();
	      this.parent = pool;
	      this.offset = pool.used;
	      pool.used += this.length;
	    }

	    // Treat array-ish objects as a byte array.
	    if (isArrayIsh(subject)) {
	      for (var i = 0; i < this.length; i++) {
	        this.parent[i + this.offset] = subject[i];
	      }
	    } else if (type == 'string') {
	      // We are a string
	      this.length = this.write(subject, 0, encoding);
	    }
	  }

	}

	function isArrayIsh(subject) {
	  return Array.isArray(subject) || Buffer.isBuffer(subject) ||
	         subject && typeof subject === 'object' &&
	         typeof subject.length === 'number';
	}

	exports.SlowBuffer = SlowBuffer;
	exports.Buffer = Buffer;

	Buffer.poolSize = 8 * 1024;
	var pool;

	function allocPool() {
	  pool = new SlowBuffer(Buffer.poolSize);
	  pool.used = 0;
	}


	// Static methods
	Buffer.isBuffer = function isBuffer(b) {
	  return b instanceof Buffer || b instanceof SlowBuffer;
	};

	Buffer.concat = function (list, totalLength) {
	  if (!Array.isArray(list)) {
	    throw new Error("Usage: Buffer.concat(list, [totalLength])\n \
	      list should be an Array.");
	  }

	  if (list.length === 0) {
	    return new Buffer(0);
	  } else if (list.length === 1) {
	    return list[0];
	  }

	  if (typeof totalLength !== 'number') {
	    totalLength = 0;
	    for (var i = 0; i < list.length; i++) {
	      var buf = list[i];
	      totalLength += buf.length;
	    }
	  }

	  var buffer = new Buffer(totalLength);
	  var pos = 0;
	  for (var i = 0; i < list.length; i++) {
	    var buf = list[i];
	    buf.copy(buffer, pos);
	    pos += buf.length;
	  }
	  return buffer;
	};

	// Inspect
	Buffer.prototype.inspect = function inspect() {
	  var out = [],
	      len = this.length;

	  for (var i = 0; i < len; i++) {
	    out[i] = toHex(this.parent[i + this.offset]);
	    if (i == exports.INSPECT_MAX_BYTES) {
	      out[i + 1] = '...';
	      break;
	    }
	  }

	  return '<Buffer ' + out.join(' ') + '>';
	};


	Buffer.prototype.get = function get(i) {
	  if (i < 0 || i >= this.length) throw new Error('oob');
	  return this.parent[this.offset + i];
	};


	Buffer.prototype.set = function set(i, v) {
	  if (i < 0 || i >= this.length) throw new Error('oob');
	  return this.parent[this.offset + i] = v;
	};


	// write(string, offset = 0, length = buffer.length-offset, encoding = 'utf8')
	Buffer.prototype.write = function(string, offset, length, encoding) {
	  // Support both (string, offset, length, encoding)
	  // and the legacy (string, encoding, offset, length)
	  if (isFinite(offset)) {
	    if (!isFinite(length)) {
	      encoding = length;
	      length = undefined;
	    }
	  } else {  // legacy
	    var swap = encoding;
	    encoding = offset;
	    offset = length;
	    length = swap;
	  }

	  offset = +offset || 0;
	  var remaining = this.length - offset;
	  if (!length) {
	    length = remaining;
	  } else {
	    length = +length;
	    if (length > remaining) {
	      length = remaining;
	    }
	  }
	  encoding = String(encoding || 'utf8').toLowerCase();

	  var ret;
	  switch (encoding) {
	    case 'hex':
	      ret = this.parent.hexWrite(string, this.offset + offset, length);
	      break;

	    case 'utf8':
	    case 'utf-8':
	      ret = this.parent.utf8Write(string, this.offset + offset, length);
	      break;

	    case 'ascii':
	      ret = this.parent.asciiWrite(string, this.offset + offset, length);
	      break;

	    case 'binary':
	      ret = this.parent.binaryWrite(string, this.offset + offset, length);
	      break;

	    case 'base64':
	      // Warning: maxLength not taken into account in base64Write
	      ret = this.parent.base64Write(string, this.offset + offset, length);
	      break;

	    case 'ucs2':
	    case 'ucs-2':
	      ret = this.parent.ucs2Write(string, this.offset + offset, length);
	      break;

	    default:
	      throw new Error('Unknown encoding');
	  }

	  Buffer._charsWritten = SlowBuffer._charsWritten;

	  return ret;
	};


	// toString(encoding, start=0, end=buffer.length)
	Buffer.prototype.toString = function(encoding, start, end) {
	  encoding = String(encoding || 'utf8').toLowerCase();

	  if (typeof start == 'undefined' || start < 0) {
	    start = 0;
	  } else if (start > this.length) {
	    start = this.length;
	  }

	  if (typeof end == 'undefined' || end > this.length) {
	    end = this.length;
	  } else if (end < 0) {
	    end = 0;
	  }

	  start = start + this.offset;
	  end = end + this.offset;

	  switch (encoding) {
	    case 'hex':
	      return this.parent.hexSlice(start, end);

	    case 'utf8':
	    case 'utf-8':
	      return this.parent.utf8Slice(start, end);

	    case 'ascii':
	      return this.parent.asciiSlice(start, end);

	    case 'binary':
	      return this.parent.binarySlice(start, end);

	    case 'base64':
	      return this.parent.base64Slice(start, end);

	    case 'ucs2':
	    case 'ucs-2':
	      return this.parent.ucs2Slice(start, end);

	    default:
	      throw new Error('Unknown encoding');
	  }
	};


	// byteLength
	Buffer.byteLength = SlowBuffer.byteLength;


	// fill(value, start=0, end=buffer.length)
	Buffer.prototype.fill = function fill(value, start, end) {
	  value || (value = 0);
	  start || (start = 0);
	  end || (end = this.length);

	  if (typeof value === 'string') {
	    value = value.charCodeAt(0);
	  }
	  if (!(typeof value === 'number') || isNaN(value)) {
	    throw new Error('value is not a number');
	  }

	  if (end < start) throw new Error('end < start');

	  // Fill 0 bytes; we're done
	  if (end === start) return 0;
	  if (this.length == 0) return 0;

	  if (start < 0 || start >= this.length) {
	    throw new Error('start out of bounds');
	  }

	  if (end < 0 || end > this.length) {
	    throw new Error('end out of bounds');
	  }

	  return this.parent.fill(value,
	                          start + this.offset,
	                          end + this.offset);
	};


	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function(target, target_start, start, end) {
	  var source = this;
	  start || (start = 0);
	  end || (end = this.length);
	  target_start || (target_start = 0);

	  if (end < start) throw new Error('sourceEnd < sourceStart');

	  // Copy 0 bytes; we're done
	  if (end === start) return 0;
	  if (target.length == 0 || source.length == 0) return 0;

	  if (target_start < 0 || target_start >= target.length) {
	    throw new Error('targetStart out of bounds');
	  }

	  if (start < 0 || start >= source.length) {
	    throw new Error('sourceStart out of bounds');
	  }

	  if (end < 0 || end > source.length) {
	    throw new Error('sourceEnd out of bounds');
	  }

	  // Are we oob?
	  if (end > this.length) {
	    end = this.length;
	  }

	  if (target.length - target_start < end - start) {
	    end = target.length - target_start + start;
	  }

	  return this.parent.copy(target.parent,
	                          target_start + target.offset,
	                          start + this.offset,
	                          end + this.offset);
	};


	// slice(start, end)
	Buffer.prototype.slice = function(start, end) {
	  if (end === undefined) end = this.length;
	  if (end > this.length) throw new Error('oob');
	  if (start > end) throw new Error('oob');

	  return new Buffer(this.parent, end - start, +start + this.offset);
	};


	// Legacy methods for backwards compatibility.

	Buffer.prototype.utf8Slice = function(start, end) {
	  return this.toString('utf8', start, end);
	};

	Buffer.prototype.binarySlice = function(start, end) {
	  return this.toString('binary', start, end);
	};

	Buffer.prototype.asciiSlice = function(start, end) {
	  return this.toString('ascii', start, end);
	};

	Buffer.prototype.utf8Write = function(string, offset) {
	  return this.write(string, offset, 'utf8');
	};

	Buffer.prototype.binaryWrite = function(string, offset) {
	  return this.write(string, offset, 'binary');
	};

	Buffer.prototype.asciiWrite = function(string, offset) {
	  return this.write(string, offset, 'ascii');
	};

	Buffer.prototype.readUInt8 = function(offset, noAssert) {
	  var buffer = this;

	  if (!noAssert) {
	    assert.ok(offset !== undefined && offset !== null,
	        'missing offset');

	    assert.ok(offset < buffer.length,
	        'Trying to read beyond buffer length');
	  }

	  return buffer.parent[buffer.offset + offset];
	};

	function readUInt16(buffer, offset, isBigEndian, noAssert) {
	  var val = 0;


	  if (!noAssert) {
	    assert.ok(typeof (isBigEndian) === 'boolean',
	        'missing or invalid endian');

	    assert.ok(offset !== undefined && offset !== null,
	        'missing offset');

	    assert.ok(offset + 1 < buffer.length,
	        'Trying to read beyond buffer length');
	  }

	  if (isBigEndian) {
	    val = buffer.parent[buffer.offset + offset] << 8;
	    val |= buffer.parent[buffer.offset + offset + 1];
	  } else {
	    val = buffer.parent[buffer.offset + offset];
	    val |= buffer.parent[buffer.offset + offset + 1] << 8;
	  }

	  return val;
	}

	Buffer.prototype.readUInt16LE = function(offset, noAssert) {
	  return readUInt16(this, offset, false, noAssert);
	};

	Buffer.prototype.readUInt16BE = function(offset, noAssert) {
	  return readUInt16(this, offset, true, noAssert);
	};

	function readUInt32(buffer, offset, isBigEndian, noAssert) {
	  var val = 0;

	  if (!noAssert) {
	    assert.ok(typeof (isBigEndian) === 'boolean',
	        'missing or invalid endian');

	    assert.ok(offset !== undefined && offset !== null,
	        'missing offset');

	    assert.ok(offset + 3 < buffer.length,
	        'Trying to read beyond buffer length');
	  }

	  if (isBigEndian) {
	    val = buffer.parent[buffer.offset + offset + 1] << 16;
	    val |= buffer.parent[buffer.offset + offset + 2] << 8;
	    val |= buffer.parent[buffer.offset + offset + 3];
	    val = val + (buffer.parent[buffer.offset + offset] << 24 >>> 0);
	  } else {
	    val = buffer.parent[buffer.offset + offset + 2] << 16;
	    val |= buffer.parent[buffer.offset + offset + 1] << 8;
	    val |= buffer.parent[buffer.offset + offset];
	    val = val + (buffer.parent[buffer.offset + offset + 3] << 24 >>> 0);
	  }

	  return val;
	}

	Buffer.prototype.readUInt32LE = function(offset, noAssert) {
	  return readUInt32(this, offset, false, noAssert);
	};

	Buffer.prototype.readUInt32BE = function(offset, noAssert) {
	  return readUInt32(this, offset, true, noAssert);
	};


	/*
	 * Signed integer types, yay team! A reminder on how two's complement actually
	 * works. The first bit is the signed bit, i.e. tells us whether or not the
	 * number should be positive or negative. If the two's complement value is
	 * positive, then we're done, as it's equivalent to the unsigned representation.
	 *
	 * Now if the number is positive, you're pretty much done, you can just leverage
	 * the unsigned translations and return those. Unfortunately, negative numbers
	 * aren't quite that straightforward.
	 *
	 * At first glance, one might be inclined to use the traditional formula to
	 * translate binary numbers between the positive and negative values in two's
	 * complement. (Though it doesn't quite work for the most negative value)
	 * Mainly:
	 *  - invert all the bits
	 *  - add one to the result
	 *
	 * Of course, this doesn't quite work in Javascript. Take for example the value
	 * of -128. This could be represented in 16 bits (big-endian) as 0xff80. But of
	 * course, Javascript will do the following:
	 *
	 * > ~0xff80
	 * -65409
	 *
	 * Whoh there, Javascript, that's not quite right. But wait, according to
	 * Javascript that's perfectly correct. When Javascript ends up seeing the
	 * constant 0xff80, it has no notion that it is actually a signed number. It
	 * assumes that we've input the unsigned value 0xff80. Thus, when it does the
	 * binary negation, it casts it into a signed value, (positive 0xff80). Then
	 * when you perform binary negation on that, it turns it into a negative number.
	 *
	 * Instead, we're going to have to use the following general formula, that works
	 * in a rather Javascript friendly way. I'm glad we don't support this kind of
	 * weird numbering scheme in the kernel.
	 *
	 * (BIT-MAX - (unsigned)val + 1) * -1
	 *
	 * The astute observer, may think that this doesn't make sense for 8-bit numbers
	 * (really it isn't necessary for them). However, when you get 16-bit numbers,
	 * you do. Let's go back to our prior example and see how this will look:
	 *
	 * (0xffff - 0xff80 + 1) * -1
	 * (0x007f + 1) * -1
	 * (0x0080) * -1
	 */
	Buffer.prototype.readInt8 = function(offset, noAssert) {
	  var buffer = this;
	  var neg;

	  if (!noAssert) {
	    assert.ok(offset !== undefined && offset !== null,
	        'missing offset');

	    assert.ok(offset < buffer.length,
	        'Trying to read beyond buffer length');
	  }

	  neg = buffer.parent[buffer.offset + offset] & 0x80;
	  if (!neg) {
	    return (buffer.parent[buffer.offset + offset]);
	  }

	  return ((0xff - buffer.parent[buffer.offset + offset] + 1) * -1);
	};

	function readInt16(buffer, offset, isBigEndian, noAssert) {
	  var neg, val;

	  if (!noAssert) {
	    assert.ok(typeof (isBigEndian) === 'boolean',
	        'missing or invalid endian');

	    assert.ok(offset !== undefined && offset !== null,
	        'missing offset');

	    assert.ok(offset + 1 < buffer.length,
	        'Trying to read beyond buffer length');
	  }

	  val = readUInt16(buffer, offset, isBigEndian, noAssert);
	  neg = val & 0x8000;
	  if (!neg) {
	    return val;
	  }

	  return (0xffff - val + 1) * -1;
	}

	Buffer.prototype.readInt16LE = function(offset, noAssert) {
	  return readInt16(this, offset, false, noAssert);
	};

	Buffer.prototype.readInt16BE = function(offset, noAssert) {
	  return readInt16(this, offset, true, noAssert);
	};

	function readInt32(buffer, offset, isBigEndian, noAssert) {
	  var neg, val;

	  if (!noAssert) {
	    assert.ok(typeof (isBigEndian) === 'boolean',
	        'missing or invalid endian');

	    assert.ok(offset !== undefined && offset !== null,
	        'missing offset');

	    assert.ok(offset + 3 < buffer.length,
	        'Trying to read beyond buffer length');
	  }

	  val = readUInt32(buffer, offset, isBigEndian, noAssert);
	  neg = val & 0x80000000;
	  if (!neg) {
	    return (val);
	  }

	  return (0xffffffff - val + 1) * -1;
	}

	Buffer.prototype.readInt32LE = function(offset, noAssert) {
	  return readInt32(this, offset, false, noAssert);
	};

	Buffer.prototype.readInt32BE = function(offset, noAssert) {
	  return readInt32(this, offset, true, noAssert);
	};

	function readFloat(buffer, offset, isBigEndian, noAssert) {
	  if (!noAssert) {
	    assert.ok(typeof (isBigEndian) === 'boolean',
	        'missing or invalid endian');

	    assert.ok(offset + 3 < buffer.length,
	        'Trying to read beyond buffer length');
	  }

	  return require(35).readIEEE754(buffer, offset, isBigEndian,
	      23, 4);
	}

	Buffer.prototype.readFloatLE = function(offset, noAssert) {
	  return readFloat(this, offset, false, noAssert);
	};

	Buffer.prototype.readFloatBE = function(offset, noAssert) {
	  return readFloat(this, offset, true, noAssert);
	};

	function readDouble(buffer, offset, isBigEndian, noAssert) {
	  if (!noAssert) {
	    assert.ok(typeof (isBigEndian) === 'boolean',
	        'missing or invalid endian');

	    assert.ok(offset + 7 < buffer.length,
	        'Trying to read beyond buffer length');
	  }

	  return require(35).readIEEE754(buffer, offset, isBigEndian,
	      52, 8);
	}

	Buffer.prototype.readDoubleLE = function(offset, noAssert) {
	  return readDouble(this, offset, false, noAssert);
	};

	Buffer.prototype.readDoubleBE = function(offset, noAssert) {
	  return readDouble(this, offset, true, noAssert);
	};


	/*
	 * We have to make sure that the value is a valid integer. This means that it is
	 * non-negative. It has no fractional component and that it does not exceed the
	 * maximum allowed value.
	 *
	 *      value           The number to check for validity
	 *
	 *      max             The maximum value
	 */
	function verifuint(value, max) {
	  assert.ok(typeof (value) == 'number',
	      'cannot write a non-number as a number');

	  assert.ok(value >= 0,
	      'specified a negative value for writing an unsigned value');

	  assert.ok(value <= max, 'value is larger than maximum value for type');

	  assert.ok(Math.floor(value) === value, 'value has a fractional component');
	}

	Buffer.prototype.writeUInt8 = function(value, offset, noAssert) {
	  var buffer = this;

	  if (!noAssert) {
	    assert.ok(value !== undefined && value !== null,
	        'missing value');

	    assert.ok(offset !== undefined && offset !== null,
	        'missing offset');

	    assert.ok(offset < buffer.length,
	        'trying to write beyond buffer length');

	    verifuint(value, 0xff);
	  }

	  buffer.parent[buffer.offset + offset] = value;
	};

	function writeUInt16(buffer, value, offset, isBigEndian, noAssert) {
	  if (!noAssert) {
	    assert.ok(value !== undefined && value !== null,
	        'missing value');

	    assert.ok(typeof (isBigEndian) === 'boolean',
	        'missing or invalid endian');

	    assert.ok(offset !== undefined && offset !== null,
	        'missing offset');

	    assert.ok(offset + 1 < buffer.length,
	        'trying to write beyond buffer length');

	    verifuint(value, 0xffff);
	  }

	  if (isBigEndian) {
	    buffer.parent[buffer.offset + offset] = (value & 0xff00) >>> 8;
	    buffer.parent[buffer.offset + offset + 1] = value & 0x00ff;
	  } else {
	    buffer.parent[buffer.offset + offset + 1] = (value & 0xff00) >>> 8;
	    buffer.parent[buffer.offset + offset] = value & 0x00ff;
	  }
	}

	Buffer.prototype.writeUInt16LE = function(value, offset, noAssert) {
	  writeUInt16(this, value, offset, false, noAssert);
	};

	Buffer.prototype.writeUInt16BE = function(value, offset, noAssert) {
	  writeUInt16(this, value, offset, true, noAssert);
	};

	function writeUInt32(buffer, value, offset, isBigEndian, noAssert) {
	  if (!noAssert) {
	    assert.ok(value !== undefined && value !== null,
	        'missing value');

	    assert.ok(typeof (isBigEndian) === 'boolean',
	        'missing or invalid endian');

	    assert.ok(offset !== undefined && offset !== null,
	        'missing offset');

	    assert.ok(offset + 3 < buffer.length,
	        'trying to write beyond buffer length');

	    verifuint(value, 0xffffffff);
	  }

	  if (isBigEndian) {
	    buffer.parent[buffer.offset + offset] = (value >>> 24) & 0xff;
	    buffer.parent[buffer.offset + offset + 1] = (value >>> 16) & 0xff;
	    buffer.parent[buffer.offset + offset + 2] = (value >>> 8) & 0xff;
	    buffer.parent[buffer.offset + offset + 3] = value & 0xff;
	  } else {
	    buffer.parent[buffer.offset + offset + 3] = (value >>> 24) & 0xff;
	    buffer.parent[buffer.offset + offset + 2] = (value >>> 16) & 0xff;
	    buffer.parent[buffer.offset + offset + 1] = (value >>> 8) & 0xff;
	    buffer.parent[buffer.offset + offset] = value & 0xff;
	  }
	}

	Buffer.prototype.writeUInt32LE = function(value, offset, noAssert) {
	  writeUInt32(this, value, offset, false, noAssert);
	};

	Buffer.prototype.writeUInt32BE = function(value, offset, noAssert) {
	  writeUInt32(this, value, offset, true, noAssert);
	};


	/*
	 * We now move onto our friends in the signed number category. Unlike unsigned
	 * numbers, we're going to have to worry a bit more about how we put values into
	 * arrays. Since we are only worrying about signed 32-bit values, we're in
	 * slightly better shape. Unfortunately, we really can't do our favorite binary
	 * & in this system. It really seems to do the wrong thing. For example:
	 *
	 * > -32 & 0xff
	 * 224
	 *
	 * What's happening above is really: 0xe0 & 0xff = 0xe0. However, the results of
	 * this aren't treated as a signed number. Ultimately a bad thing.
	 *
	 * What we're going to want to do is basically create the unsigned equivalent of
	 * our representation and pass that off to the wuint* functions. To do that
	 * we're going to do the following:
	 *
	 *  - if the value is positive
	 *      we can pass it directly off to the equivalent wuint
	 *  - if the value is negative
	 *      we do the following computation:
	 *         mb + val + 1, where
	 *         mb   is the maximum unsigned value in that byte size
	 *         val  is the Javascript negative integer
	 *
	 *
	 * As a concrete value, take -128. In signed 16 bits this would be 0xff80. If
	 * you do out the computations:
	 *
	 * 0xffff - 128 + 1
	 * 0xffff - 127
	 * 0xff80
	 *
	 * You can then encode this value as the signed version. This is really rather
	 * hacky, but it should work and get the job done which is our goal here.
	 */

	/*
	 * A series of checks to make sure we actually have a signed 32-bit number
	 */
	function verifsint(value, max, min) {
	  assert.ok(typeof (value) == 'number',
	      'cannot write a non-number as a number');

	  assert.ok(value <= max, 'value larger than maximum allowed value');

	  assert.ok(value >= min, 'value smaller than minimum allowed value');

	  assert.ok(Math.floor(value) === value, 'value has a fractional component');
	}

	function verifIEEE754(value, max, min) {
	  assert.ok(typeof (value) == 'number',
	      'cannot write a non-number as a number');

	  assert.ok(value <= max, 'value larger than maximum allowed value');

	  assert.ok(value >= min, 'value smaller than minimum allowed value');
	}

	Buffer.prototype.writeInt8 = function(value, offset, noAssert) {
	  var buffer = this;

	  if (!noAssert) {
	    assert.ok(value !== undefined && value !== null,
	        'missing value');

	    assert.ok(offset !== undefined && offset !== null,
	        'missing offset');

	    assert.ok(offset < buffer.length,
	        'Trying to write beyond buffer length');

	    verifsint(value, 0x7f, -0x80);
	  }

	  if (value >= 0) {
	    buffer.writeUInt8(value, offset, noAssert);
	  } else {
	    buffer.writeUInt8(0xff + value + 1, offset, noAssert);
	  }
	};

	function writeInt16(buffer, value, offset, isBigEndian, noAssert) {
	  if (!noAssert) {
	    assert.ok(value !== undefined && value !== null,
	        'missing value');

	    assert.ok(typeof (isBigEndian) === 'boolean',
	        'missing or invalid endian');

	    assert.ok(offset !== undefined && offset !== null,
	        'missing offset');

	    assert.ok(offset + 1 < buffer.length,
	        'Trying to write beyond buffer length');

	    verifsint(value, 0x7fff, -0x8000);
	  }

	  if (value >= 0) {
	    writeUInt16(buffer, value, offset, isBigEndian, noAssert);
	  } else {
	    writeUInt16(buffer, 0xffff + value + 1, offset, isBigEndian, noAssert);
	  }
	}

	Buffer.prototype.writeInt16LE = function(value, offset, noAssert) {
	  writeInt16(this, value, offset, false, noAssert);
	};

	Buffer.prototype.writeInt16BE = function(value, offset, noAssert) {
	  writeInt16(this, value, offset, true, noAssert);
	};

	function writeInt32(buffer, value, offset, isBigEndian, noAssert) {
	  if (!noAssert) {
	    assert.ok(value !== undefined && value !== null,
	        'missing value');

	    assert.ok(typeof (isBigEndian) === 'boolean',
	        'missing or invalid endian');

	    assert.ok(offset !== undefined && offset !== null,
	        'missing offset');

	    assert.ok(offset + 3 < buffer.length,
	        'Trying to write beyond buffer length');

	    verifsint(value, 0x7fffffff, -0x80000000);
	  }

	  if (value >= 0) {
	    writeUInt32(buffer, value, offset, isBigEndian, noAssert);
	  } else {
	    writeUInt32(buffer, 0xffffffff + value + 1, offset, isBigEndian, noAssert);
	  }
	}

	Buffer.prototype.writeInt32LE = function(value, offset, noAssert) {
	  writeInt32(this, value, offset, false, noAssert);
	};

	Buffer.prototype.writeInt32BE = function(value, offset, noAssert) {
	  writeInt32(this, value, offset, true, noAssert);
	};

	function writeFloat(buffer, value, offset, isBigEndian, noAssert) {
	  if (!noAssert) {
	    assert.ok(value !== undefined && value !== null,
	        'missing value');

	    assert.ok(typeof (isBigEndian) === 'boolean',
	        'missing or invalid endian');

	    assert.ok(offset !== undefined && offset !== null,
	        'missing offset');

	    assert.ok(offset + 3 < buffer.length,
	        'Trying to write beyond buffer length');

	    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38);
	  }

	  require(35).writeIEEE754(buffer, value, offset, isBigEndian,
	      23, 4);
	}

	Buffer.prototype.writeFloatLE = function(value, offset, noAssert) {
	  writeFloat(this, value, offset, false, noAssert);
	};

	Buffer.prototype.writeFloatBE = function(value, offset, noAssert) {
	  writeFloat(this, value, offset, true, noAssert);
	};

	function writeDouble(buffer, value, offset, isBigEndian, noAssert) {
	  if (!noAssert) {
	    assert.ok(value !== undefined && value !== null,
	        'missing value');

	    assert.ok(typeof (isBigEndian) === 'boolean',
	        'missing or invalid endian');

	    assert.ok(offset !== undefined && offset !== null,
	        'missing offset');

	    assert.ok(offset + 7 < buffer.length,
	        'Trying to write beyond buffer length');

	    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308);
	  }

	  require(35).writeIEEE754(buffer, value, offset, isBigEndian,
	      52, 8);
	}

	Buffer.prototype.writeDoubleLE = function(value, offset, noAssert) {
	  writeDouble(this, value, offset, false, noAssert);
	};

	Buffer.prototype.writeDoubleBE = function(value, offset, noAssert) {
	  writeDouble(this, value, offset, true, noAssert);
	};

	SlowBuffer.prototype.readUInt8 = Buffer.prototype.readUInt8;
	SlowBuffer.prototype.readUInt16LE = Buffer.prototype.readUInt16LE;
	SlowBuffer.prototype.readUInt16BE = Buffer.prototype.readUInt16BE;
	SlowBuffer.prototype.readUInt32LE = Buffer.prototype.readUInt32LE;
	SlowBuffer.prototype.readUInt32BE = Buffer.prototype.readUInt32BE;
	SlowBuffer.prototype.readInt8 = Buffer.prototype.readInt8;
	SlowBuffer.prototype.readInt16LE = Buffer.prototype.readInt16LE;
	SlowBuffer.prototype.readInt16BE = Buffer.prototype.readInt16BE;
	SlowBuffer.prototype.readInt32LE = Buffer.prototype.readInt32LE;
	SlowBuffer.prototype.readInt32BE = Buffer.prototype.readInt32BE;
	SlowBuffer.prototype.readFloatLE = Buffer.prototype.readFloatLE;
	SlowBuffer.prototype.readFloatBE = Buffer.prototype.readFloatBE;
	SlowBuffer.prototype.readDoubleLE = Buffer.prototype.readDoubleLE;
	SlowBuffer.prototype.readDoubleBE = Buffer.prototype.readDoubleBE;
	SlowBuffer.prototype.writeUInt8 = Buffer.prototype.writeUInt8;
	SlowBuffer.prototype.writeUInt16LE = Buffer.prototype.writeUInt16LE;
	SlowBuffer.prototype.writeUInt16BE = Buffer.prototype.writeUInt16BE;
	SlowBuffer.prototype.writeUInt32LE = Buffer.prototype.writeUInt32LE;
	SlowBuffer.prototype.writeUInt32BE = Buffer.prototype.writeUInt32BE;
	SlowBuffer.prototype.writeInt8 = Buffer.prototype.writeInt8;
	SlowBuffer.prototype.writeInt16LE = Buffer.prototype.writeInt16LE;
	SlowBuffer.prototype.writeInt16BE = Buffer.prototype.writeInt16BE;
	SlowBuffer.prototype.writeInt32LE = Buffer.prototype.writeInt32LE;
	SlowBuffer.prototype.writeInt32BE = Buffer.prototype.writeInt32BE;
	SlowBuffer.prototype.writeFloatLE = Buffer.prototype.writeFloatLE;
	SlowBuffer.prototype.writeFloatBE = Buffer.prototype.writeFloatBE;
	SlowBuffer.prototype.writeDoubleLE = Buffer.prototype.writeDoubleLE;
	SlowBuffer.prototype.writeDoubleBE = Buffer.prototype.writeDoubleBE;
	
	/* WEBPACK VAR INJECTION */}.call(exports, require, require(23).Buffer))

/***/ },

/***/ 24:
/***/ function(module, exports, require) {

	// If there is no WebSocket, try MozWebSocket (support for some old browsers)
	try {
	  module.exports = WebSocket
	} catch(err) {
	  module.exports = MozWebSocket
	}

/***/ },

/***/ 25:
/***/ function(module, exports, require) {

	var EventEmitter = exports.EventEmitter = function EventEmitter() {};
	var isArray = require(36);
	var indexOf = require(37);



	// By default EventEmitters will print a warning if more than
	// 10 listeners are added to it. This is a useful default which
	// helps finding memory leaks.
	//
	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	var defaultMaxListeners = 10;
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!this._events) this._events = {};
	  this._maxListeners = n;
	};


	EventEmitter.prototype.emit = function(type) {
	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events || !this._events.error ||
	        (isArray(this._events.error) && !this._events.error.length))
	    {
	      if (arguments[1] instanceof Error) {
	        throw arguments[1]; // Unhandled 'error' event
	      } else {
	        throw new Error("Uncaught, unspecified 'error' event.");
	      }
	      return false;
	    }
	  }

	  if (!this._events) return false;
	  var handler = this._events[type];
	  if (!handler) return false;

	  if (typeof handler == 'function') {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        var args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	    return true;

	  } else if (isArray(handler)) {
	    var args = Array.prototype.slice.call(arguments, 1);

	    var listeners = handler.slice();
	    for (var i = 0, l = listeners.length; i < l; i++) {
	      listeners[i].apply(this, args);
	    }
	    return true;

	  } else {
	    return false;
	  }
	};

	// EventEmitter is defined in src/node_events.cc
	// EventEmitter.prototype.emit() is also defined there.
	EventEmitter.prototype.addListener = function(type, listener) {
	  if ('function' !== typeof listener) {
	    throw new Error('addListener only takes instances of Function');
	  }

	  if (!this._events) this._events = {};

	  // To avoid recursion in the case that type == "newListeners"! Before
	  // adding it to the listeners, first emit "newListeners".
	  this.emit('newListener', type, listener);
	  if (!this._events[type]) {
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  } else if (isArray(this._events[type])) {

	    // If we've already got an array, just append.
	    this._events[type].push(listener);

	  } else {
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];
	  }

	  // Check for listener leak
	  if (isArray(this._events[type]) && !this._events[type].warned) {
	    var m;
	    if (this._maxListeners !== undefined) {
	      m = this._maxListeners;
	    } else {
	      m = defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(events) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      console.trace();
	    }
	  }
	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if ('function' !== typeof listener) {
	    throw new Error('.once only takes instances of Function');
	  }

	  var self = this;
	  function g() {
	    self.removeListener(type, g);
	    listener.apply(this, arguments);
	  }

	  g.listener = listener;
	  self.on(type, g);

	  return this;
	};

	EventEmitter.prototype.removeListener = function(type, listener) {
	  if ('function' !== typeof listener) {
	    throw new Error('removeListener only takes instances of Function');
	  }

	  // does not use listeners(), so no side effect of creating _events[type]
	  if (!this._events || !this._events[type]) return this;

	  var list = this._events[type];

	  if (isArray(list)) {
	    var position = -1;
	    for (var i = 0, length = list.length; i < length; i++) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener))
	      {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0) return this;
	    list.splice(position, 1);
	    if (list.length == 0)
	      delete this._events[type];
	  } else if (list === listener ||
	             (list.listener && list.listener === listener)) {
	    delete this._events[type];
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  if (arguments.length === 0) {
	    this._events = {};
	    return this;
	  }

	  // does not use listeners(), so no side effect of creating _events[type]
	  if (type && this._events && this._events[type]) this._events[type] = null;
	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  if (!this._events) this._events = {};
	  if (!this._events[type]) this._events[type] = [];
	  if (!isArray(this._events[type])) {
	    this._events[type] = [this._events[type]];
	  }
	  return this._events[type];
	};


/***/ },

/***/ 26:
/***/ function(module, exports, require) {

	var events = require(25);

	var isArray = require(36);
	var Object_keys = require(38);
	var Object_getOwnPropertyNames = require(39);
	var Object_create = require(40);
	var isRegExp = require(41);

	exports.isArray = isArray;
	exports.isDate = isDate;
	exports.isRegExp = isRegExp;


	exports.print = function () {};
	exports.puts = function () {};
	exports.debug = function() {};

	exports.inspect = function(obj, showHidden, depth, colors) {
	  var seen = [];

	  var stylize = function(str, styleType) {
	    // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	    var styles =
	        { 'bold' : [1, 22],
	          'italic' : [3, 23],
	          'underline' : [4, 24],
	          'inverse' : [7, 27],
	          'white' : [37, 39],
	          'grey' : [90, 39],
	          'black' : [30, 39],
	          'blue' : [34, 39],
	          'cyan' : [36, 39],
	          'green' : [32, 39],
	          'magenta' : [35, 39],
	          'red' : [31, 39],
	          'yellow' : [33, 39] };

	    var style =
	        { 'special': 'cyan',
	          'number': 'blue',
	          'boolean': 'yellow',
	          'undefined': 'grey',
	          'null': 'bold',
	          'string': 'green',
	          'date': 'magenta',
	          // "name": intentionally not styling
	          'regexp': 'red' }[styleType];

	    if (style) {
	      return '\033[' + styles[style][0] + 'm' + str +
	             '\033[' + styles[style][1] + 'm';
	    } else {
	      return str;
	    }
	  };
	  if (! colors) {
	    stylize = function(str, styleType) { return str; };
	  }

	  function format(value, recurseTimes) {
	    // Provide a hook for user-specified inspect functions.
	    // Check that value is an object with an inspect function on it
	    if (value && typeof value.inspect === 'function' &&
	        // Filter out the util module, it's inspect function is special
	        value !== exports &&
	        // Also filter out any prototype objects using the circular check.
	        !(value.constructor && value.constructor.prototype === value)) {
	      return value.inspect(recurseTimes);
	    }

	    // Primitive types cannot have properties
	    switch (typeof value) {
	      case 'undefined':
	        return stylize('undefined', 'undefined');

	      case 'string':
	        var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                                 .replace(/'/g, "\\'")
	                                                 .replace(/\\"/g, '"') + '\'';
	        return stylize(simple, 'string');

	      case 'number':
	        return stylize('' + value, 'number');

	      case 'boolean':
	        return stylize('' + value, 'boolean');
	    }
	    // For some reason typeof null is "object", so special case here.
	    if (value === null) {
	      return stylize('null', 'null');
	    }

	    // Look up the keys of the object.
	    var visible_keys = Object_keys(value);
	    var keys = showHidden ? Object_getOwnPropertyNames(value) : visible_keys;

	    // Functions without properties can be shortcutted.
	    if (typeof value === 'function' && keys.length === 0) {
	      if (isRegExp(value)) {
	        return stylize('' + value, 'regexp');
	      } else {
	        var name = value.name ? ': ' + value.name : '';
	        return stylize('[Function' + name + ']', 'special');
	      }
	    }

	    // Dates without properties can be shortcutted
	    if (isDate(value) && keys.length === 0) {
	      return stylize(value.toUTCString(), 'date');
	    }

	    var base, type, braces;
	    // Determine the object type
	    if (isArray(value)) {
	      type = 'Array';
	      braces = ['[', ']'];
	    } else {
	      type = 'Object';
	      braces = ['{', '}'];
	    }

	    // Make functions say that they are functions
	    if (typeof value === 'function') {
	      var n = value.name ? ': ' + value.name : '';
	      base = (isRegExp(value)) ? ' ' + value : ' [Function' + n + ']';
	    } else {
	      base = '';
	    }

	    // Make dates with properties first say the date
	    if (isDate(value)) {
	      base = ' ' + value.toUTCString();
	    }

	    if (keys.length === 0) {
	      return braces[0] + base + braces[1];
	    }

	    if (recurseTimes < 0) {
	      if (isRegExp(value)) {
	        return stylize('' + value, 'regexp');
	      } else {
	        return stylize('[Object]', 'special');
	      }
	    }

	    seen.push(value);

	    var output = keys.map(function(key) {
	      var name, str;
	      if (value.__lookupGetter__) {
	        if (value.__lookupGetter__(key)) {
	          if (value.__lookupSetter__(key)) {
	            str = stylize('[Getter/Setter]', 'special');
	          } else {
	            str = stylize('[Getter]', 'special');
	          }
	        } else {
	          if (value.__lookupSetter__(key)) {
	            str = stylize('[Setter]', 'special');
	          }
	        }
	      }
	      if (visible_keys.indexOf(key) < 0) {
	        name = '[' + key + ']';
	      }
	      if (!str) {
	        if (seen.indexOf(value[key]) < 0) {
	          if (recurseTimes === null) {
	            str = format(value[key]);
	          } else {
	            str = format(value[key], recurseTimes - 1);
	          }
	          if (str.indexOf('\n') > -1) {
	            if (isArray(value)) {
	              str = str.split('\n').map(function(line) {
	                return '  ' + line;
	              }).join('\n').substr(2);
	            } else {
	              str = '\n' + str.split('\n').map(function(line) {
	                return '   ' + line;
	              }).join('\n');
	            }
	          }
	        } else {
	          str = stylize('[Circular]', 'special');
	        }
	      }
	      if (typeof name === 'undefined') {
	        if (type === 'Array' && key.match(/^\d+$/)) {
	          return str;
	        }
	        name = JSON.stringify('' + key);
	        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	          name = name.substr(1, name.length - 2);
	          name = stylize(name, 'name');
	        } else {
	          name = name.replace(/'/g, "\\'")
	                     .replace(/\\"/g, '"')
	                     .replace(/(^"|"$)/g, "'");
	          name = stylize(name, 'string');
	        }
	      }

	      return name + ': ' + str;
	    });

	    seen.pop();

	    var numLinesEst = 0;
	    var length = output.reduce(function(prev, cur) {
	      numLinesEst++;
	      if (cur.indexOf('\n') >= 0) numLinesEst++;
	      return prev + cur.length + 1;
	    }, 0);

	    if (length > 50) {
	      output = braces[0] +
	               (base === '' ? '' : base + '\n ') +
	               ' ' +
	               output.join(',\n  ') +
	               ' ' +
	               braces[1];

	    } else {
	      output = braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	    }

	    return output;
	  }
	  return format(obj, (typeof depth === 'undefined' ? 2 : depth));
	};


	function isDate(d) {
	  if (d instanceof Date) return true;
	  if (typeof d !== 'object') return false;
	  var properties = Date.prototype && Object_getOwnPropertyNames(Date.prototype);
	  var proto = d.__proto__ && Object_getOwnPropertyNames(d.__proto__);
	  return JSON.stringify(proto) === JSON.stringify(properties);
	}

	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}

	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];

	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}

	exports.log = function (msg) {};

	exports.pump = null;

	exports.inherits = function(ctor, superCtor) {
	  ctor.super_ = superCtor;
	  ctor.prototype = Object_create(superCtor.prototype, {
	    constructor: {
	      value: ctor,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	};

	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (typeof f !== 'string') {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(exports.inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }

	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j': return JSON.stringify(args[i++]);
	      default:
	        return x;
	    }
	  });
	  for(var x = args[i]; i < len; x = args[++i]){
	    if (x === null || typeof x !== 'object') {
	      str += ' ' + x;
	    } else {
	      str += ' ' + exports.inspect(x);
	    }
	  }
	  return str;
	};


/***/ },

/***/ 27:
/***/ function(module, exports, require) {

	// UTILITY
	var util = require(26);
	var pSlice = Array.prototype.slice;

	var objectKeys = require(38);
	var isRegExp = require(41);

	// 1. The assert module provides functions that throw
	// AssertionError's when particular conditions are not met. The
	// assert module must conform to the following interface.

	var assert = module.exports = ok;

	// 2. The AssertionError is defined in assert.
	// new assert.AssertionError({ message: message,
	//                             actual: actual,
	//                             expected: expected })

	assert.AssertionError = function AssertionError(options) {
	  this.name = 'AssertionError';
	  this.message = options.message;
	  this.actual = options.actual;
	  this.expected = options.expected;
	  this.operator = options.operator;
	  var stackStartFunction = options.stackStartFunction || fail;

	  if (Error.captureStackTrace) {
	    Error.captureStackTrace(this, stackStartFunction);
	  }
	};
	util.inherits(assert.AssertionError, Error);

	function replacer(key, value) {
	  if (value === undefined) {
	    return '' + value;
	  }
	  if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) {
	    return value.toString();
	  }
	  if (typeof value === 'function' || value instanceof RegExp) {
	    return value.toString();
	  }
	  return value;
	}

	function truncate(s, n) {
	  if (typeof s == 'string') {
	    return s.length < n ? s : s.slice(0, n);
	  } else {
	    return s;
	  }
	}

	assert.AssertionError.prototype.toString = function() {
	  if (this.message) {
	    return [this.name + ':', this.message].join(' ');
	  } else {
	    return [
	      this.name + ':',
	      truncate(JSON.stringify(this.actual, replacer), 128),
	      this.operator,
	      truncate(JSON.stringify(this.expected, replacer), 128)
	    ].join(' ');
	  }
	};

	// assert.AssertionError instanceof Error

	assert.AssertionError.__proto__ = Error.prototype;

	// At present only the three keys mentioned above are used and
	// understood by the spec. Implementations or sub modules can pass
	// other keys to the AssertionError's constructor - they will be
	// ignored.

	// 3. All of the following functions must throw an AssertionError
	// when a corresponding condition is not met, with a message that
	// may be undefined if not provided.  All assertion methods provide
	// both the actual and expected values to the assertion error for
	// display purposes.

	function fail(actual, expected, message, operator, stackStartFunction) {
	  throw new assert.AssertionError({
	    message: message,
	    actual: actual,
	    expected: expected,
	    operator: operator,
	    stackStartFunction: stackStartFunction
	  });
	}

	// EXTENSION! allows for well behaved errors defined elsewhere.
	assert.fail = fail;

	// 4. Pure assertion tests whether a value is truthy, as determined
	// by !!guard.
	// assert.ok(guard, message_opt);
	// This statement is equivalent to assert.equal(true, !!guard,
	// message_opt);. To test strictly for the value true, use
	// assert.strictEqual(true, guard, message_opt);.

	function ok(value, message) {
	  if (!!!value) fail(value, true, message, '==', assert.ok);
	}
	assert.ok = ok;

	// 5. The equality assertion tests shallow, coercive equality with
	// ==.
	// assert.equal(actual, expected, message_opt);

	assert.equal = function equal(actual, expected, message) {
	  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
	};

	// 6. The non-equality assertion tests for whether two objects are not equal
	// with != assert.notEqual(actual, expected, message_opt);

	assert.notEqual = function notEqual(actual, expected, message) {
	  if (actual == expected) {
	    fail(actual, expected, message, '!=', assert.notEqual);
	  }
	};

	// 7. The equivalence assertion tests a deep equality relation.
	// assert.deepEqual(actual, expected, message_opt);

	assert.deepEqual = function deepEqual(actual, expected, message) {
	  if (!_deepEqual(actual, expected)) {
	    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
	  }
	};

	function _deepEqual(actual, expected) {
	  // 7.1. All identical values are equivalent, as determined by ===.
	  if (actual === expected) {
	    return true;

	  } else if (require(23).Buffer.isBuffer(actual) && require(23).Buffer.isBuffer(expected)) {
	    if (actual.length != expected.length) return false;

	    for (var i = 0; i < actual.length; i++) {
	      if (actual[i] !== expected[i]) return false;
	    }

	    return true;

	  // 7.2. If the expected value is a Date object, the actual value is
	  // equivalent if it is also a Date object that refers to the same time.
	  } else if (actual instanceof Date && expected instanceof Date) {
	    return actual.getTime() === expected.getTime();

	  // 7.3 If the expected value is a RegExp object, the actual value is
	  // equivalent if it is also a RegExp object with the same source and
	  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
	  } else if (isRegExp(actual) && isRegExp(expected)) {
	    return actual.source === expected.source &&
	           actual.global === expected.global &&
	           actual.multiline === expected.multiline &&
	           actual.lastIndex === expected.lastIndex &&
	           actual.ignoreCase === expected.ignoreCase;

	  // 7.4. Other pairs that do not both pass typeof value == 'object',
	  // equivalence is determined by ==.
	  } else if (typeof actual != 'object' && typeof expected != 'object') {
	    return actual == expected;

	  // 7.5 For all other Object pairs, including Array objects, equivalence is
	  // determined by having the same number of owned properties (as verified
	  // with Object.prototype.hasOwnProperty.call), the same set of keys
	  // (although not necessarily the same order), equivalent values for every
	  // corresponding key, and an identical 'prototype' property. Note: this
	  // accounts for both named and indexed properties on Arrays.
	  } else {
	    return objEquiv(actual, expected);
	  }
	}

	function isUndefinedOrNull(value) {
	  return value === null || value === undefined;
	}

	function isArguments(object) {
	  return Object.prototype.toString.call(object) == '[object Arguments]';
	}

	function objEquiv(a, b) {
	  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
	    return false;
	  // an identical 'prototype' property.
	  if (a.prototype !== b.prototype) return false;
	  //~~~I've managed to break Object.keys through screwy arguments passing.
	  //   Converting to array solves the problem.
	  if (isArguments(a)) {
	    if (!isArguments(b)) {
	      return false;
	    }
	    a = pSlice.call(a);
	    b = pSlice.call(b);
	    return _deepEqual(a, b);
	  }
	  try {
	    var ka = objectKeys(a),
	        kb = objectKeys(b),
	        key, i;
	  } catch (e) {//happens when one is a string literal and the other isn't
	    return false;
	  }
	  // having the same number of owned properties (keys incorporates
	  // hasOwnProperty)
	  if (ka.length != kb.length)
	    return false;
	  //the same set of keys (although not necessarily the same order),
	  ka.sort();
	  kb.sort();
	  //~~~cheap key test
	  for (i = ka.length - 1; i >= 0; i--) {
	    if (ka[i] != kb[i])
	      return false;
	  }
	  //equivalent values for every corresponding key, and
	  //~~~possibly expensive deep test
	  for (i = ka.length - 1; i >= 0; i--) {
	    key = ka[i];
	    if (!_deepEqual(a[key], b[key])) return false;
	  }
	  return true;
	}

	// 8. The non-equivalence assertion tests for any deep inequality.
	// assert.notDeepEqual(actual, expected, message_opt);

	assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
	  if (_deepEqual(actual, expected)) {
	    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
	  }
	};

	// 9. The strict equality assertion tests strict equality, as determined by ===.
	// assert.strictEqual(actual, expected, message_opt);

	assert.strictEqual = function strictEqual(actual, expected, message) {
	  if (actual !== expected) {
	    fail(actual, expected, message, '===', assert.strictEqual);
	  }
	};

	// 10. The strict non-equality assertion tests for strict inequality, as
	// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

	assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
	  if (actual === expected) {
	    fail(actual, expected, message, '!==', assert.notStrictEqual);
	  }
	};

	function expectedException(actual, expected) {
	  if (!actual || !expected) {
	    return false;
	  }

	  if (isRegExp(expected)) {
	    return expected.test(actual);
	  } else if (actual instanceof expected) {
	    return true;
	  } else if (expected.call({}, actual) === true) {
	    return true;
	  }

	  return false;
	}

	function _throws(shouldThrow, block, expected, message) {
	  var actual;

	  if (typeof expected === 'string') {
	    message = expected;
	    expected = null;
	  }

	  try {
	    block();
	  } catch (e) {
	    actual = e;
	  }

	  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
	            (message ? ' ' + message : '.');

	  if (shouldThrow && !actual) {
	    fail(actual, expected, 'Missing expected exception' + message);
	  }

	  if (!shouldThrow && expectedException(actual, expected)) {
	    fail(actual, expected, 'Got unwanted exception' + message);
	  }

	  if ((shouldThrow && actual && expected &&
	      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
	    throw actual;
	  }
	}

	// 11. Expected to throw an error:
	// assert.throws(block, Error_opt, message_opt);

	assert.throws = function(block, /*optional*/error, /*optional*/message) {
	  _throws.apply(this, [true].concat(pSlice.call(arguments)));
	};

	// EXTENSION! This is annoying to write outside this module.
	assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
	  _throws.apply(this, [false].concat(pSlice.call(arguments)));
	};

	assert.ifError = function(err) { if (err) {throw err;}};


/***/ },

/***/ 28:
/***/ function(module, exports, require) {

	/** @fileOverview Javascript cryptography implementation.
	 *
	 * Crush to remove comments, shorten variable names and
	 * generally reduce transmission size.
	 *
	 * @author Emily Stark
	 * @author Mike Hamburg
	 * @author Dan Boneh
	 */

	"use strict";
	/*jslint indent: 2, bitwise: false, nomen: false, plusplus: false, white: false, regexp: false */
	/*global document, window, escape, unescape */

	/** @namespace The Stanford Javascript Crypto Library, top-level namespace. */
	var sjcl = {
	  /** @namespace Symmetric ciphers. */
	  cipher: {},

	  /** @namespace Hash functions.  Right now only SHA256 is implemented. */
	  hash: {},

	  /** @namespace Key exchange functions.  Right now only SRP is implemented. */
	  keyexchange: {},
	  
	  /** @namespace Block cipher modes of operation. */
	  mode: {},

	  /** @namespace Miscellaneous.  HMAC and PBKDF2. */
	  misc: {},
	  
	  /**
	   * @namespace Bit array encoders and decoders.
	   *
	   * @description
	   * The members of this namespace are functions which translate between
	   * SJCL's bitArrays and other objects (usually strings).  Because it
	   * isn't always clear which direction is encoding and which is decoding,
	   * the method names are "fromBits" and "toBits".
	   */
	  codec: {},
	  
	  /** @namespace Exceptions. */
	  exception: {
	    /** @constructor Ciphertext is corrupt. */
	    corrupt: function(message) {
	      this.toString = function() { return "CORRUPT: "+this.message; };
	      this.message = message;
	    },
	    
	    /** @constructor Invalid parameter. */
	    invalid: function(message) {
	      this.toString = function() { return "INVALID: "+this.message; };
	      this.message = message;
	    },
	    
	    /** @constructor Bug or missing feature in SJCL. @constructor */
	    bug: function(message) {
	      this.toString = function() { return "BUG: "+this.message; };
	      this.message = message;
	    },

	    /** @constructor Something isn't ready. */
	    notReady: function(message) {
	      this.toString = function() { return "NOT READY: "+this.message; };
	      this.message = message;
	    }
	  }
	};

	if(typeof module != 'undefined' && module.exports){
	  module.exports = sjcl;
	}

	/** @fileOverview Low-level AES implementation.
	 *
	 * This file contains a low-level implementation of AES, optimized for
	 * size and for efficiency on several browsers.  It is based on
	 * OpenSSL's aes_core.c, a public-domain implementation by Vincent
	 * Rijmen, Antoon Bosselaers and Paulo Barreto.
	 *
	 * An older version of this implementation is available in the public
	 * domain, but this one is (c) Emily Stark, Mike Hamburg, Dan Boneh,
	 * Stanford University 2008-2010 and BSD-licensed for liability
	 * reasons.
	 *
	 * @author Emily Stark
	 * @author Mike Hamburg
	 * @author Dan Boneh
	 */

	/**
	 * Schedule out an AES key for both encryption and decryption.  This
	 * is a low-level class.  Use a cipher mode to do bulk encryption.
	 *
	 * @constructor
	 * @param {Array} key The key as an array of 4, 6 or 8 words.
	 *
	 * @class Advanced Encryption Standard (low-level interface)
	 */
	sjcl.cipher.aes = function (key) {
	  if (!this._tables[0][0][0]) {
	    this._precompute();
	  }
	  
	  var i, j, tmp,
	    encKey, decKey,
	    sbox = this._tables[0][4], decTable = this._tables[1],
	    keyLen = key.length, rcon = 1;
	  
	  if (keyLen !== 4 && keyLen !== 6 && keyLen !== 8) {
	    throw new sjcl.exception.invalid("invalid aes key size");
	  }
	  
	  this._key = [encKey = key.slice(0), decKey = []];
	  
	  // schedule encryption keys
	  for (i = keyLen; i < 4 * keyLen + 28; i++) {
	    tmp = encKey[i-1];
	    
	    // apply sbox
	    if (i%keyLen === 0 || (keyLen === 8 && i%keyLen === 4)) {
	      tmp = sbox[tmp>>>24]<<24 ^ sbox[tmp>>16&255]<<16 ^ sbox[tmp>>8&255]<<8 ^ sbox[tmp&255];
	      
	      // shift rows and add rcon
	      if (i%keyLen === 0) {
	        tmp = tmp<<8 ^ tmp>>>24 ^ rcon<<24;
	        rcon = rcon<<1 ^ (rcon>>7)*283;
	      }
	    }
	    
	    encKey[i] = encKey[i-keyLen] ^ tmp;
	  }
	  
	  // schedule decryption keys
	  for (j = 0; i; j++, i--) {
	    tmp = encKey[j&3 ? i : i - 4];
	    if (i<=4 || j<4) {
	      decKey[j] = tmp;
	    } else {
	      decKey[j] = decTable[0][sbox[tmp>>>24      ]] ^
	                  decTable[1][sbox[tmp>>16  & 255]] ^
	                  decTable[2][sbox[tmp>>8   & 255]] ^
	                  decTable[3][sbox[tmp      & 255]];
	    }
	  }
	};

	sjcl.cipher.aes.prototype = {
	  // public
	  /* Something like this might appear here eventually
	  name: "AES",
	  blockSize: 4,
	  keySizes: [4,6,8],
	  */
	  
	  /**
	   * Encrypt an array of 4 big-endian words.
	   * @param {Array} data The plaintext.
	   * @return {Array} The ciphertext.
	   */
	  encrypt:function (data) { return this._crypt(data,0); },
	  
	  /**
	   * Decrypt an array of 4 big-endian words.
	   * @param {Array} data The ciphertext.
	   * @return {Array} The plaintext.
	   */
	  decrypt:function (data) { return this._crypt(data,1); },
	  
	  /**
	   * The expanded S-box and inverse S-box tables.  These will be computed
	   * on the client so that we don't have to send them down the wire.
	   *
	   * There are two tables, _tables[0] is for encryption and
	   * _tables[1] is for decryption.
	   *
	   * The first 4 sub-tables are the expanded S-box with MixColumns.  The
	   * last (_tables[01][4]) is the S-box itself.
	   *
	   * @private
	   */
	  _tables: [[[],[],[],[],[]],[[],[],[],[],[]]],

	  /**
	   * Expand the S-box tables.
	   *
	   * @private
	   */
	  _precompute: function () {
	   var encTable = this._tables[0], decTable = this._tables[1],
	       sbox = encTable[4], sboxInv = decTable[4],
	       i, x, xInv, d=[], th=[], x2, x4, x8, s, tEnc, tDec;

	    // Compute double and third tables
	   for (i = 0; i < 256; i++) {
	     th[( d[i] = i<<1 ^ (i>>7)*283 )^i]=i;
	   }
	   
	   for (x = xInv = 0; !sbox[x]; x ^= x2 || 1, xInv = th[xInv] || 1) {
	     // Compute sbox
	     s = xInv ^ xInv<<1 ^ xInv<<2 ^ xInv<<3 ^ xInv<<4;
	     s = s>>8 ^ s&255 ^ 99;
	     sbox[x] = s;
	     sboxInv[s] = x;
	     
	     // Compute MixColumns
	     x8 = d[x4 = d[x2 = d[x]]];
	     tDec = x8*0x1010101 ^ x4*0x10001 ^ x2*0x101 ^ x*0x1010100;
	     tEnc = d[s]*0x101 ^ s*0x1010100;
	     
	     for (i = 0; i < 4; i++) {
	       encTable[i][x] = tEnc = tEnc<<24 ^ tEnc>>>8;
	       decTable[i][s] = tDec = tDec<<24 ^ tDec>>>8;
	     }
	   }
	   
	   // Compactify.  Considerable speedup on Firefox.
	   for (i = 0; i < 5; i++) {
	     encTable[i] = encTable[i].slice(0);
	     decTable[i] = decTable[i].slice(0);
	   }
	  },
	  
	  /**
	   * Encryption and decryption core.
	   * @param {Array} input Four words to be encrypted or decrypted.
	   * @param dir The direction, 0 for encrypt and 1 for decrypt.
	   * @return {Array} The four encrypted or decrypted words.
	   * @private
	   */
	  _crypt:function (input, dir) {
	    if (input.length !== 4) {
	      throw new sjcl.exception.invalid("invalid aes block size");
	    }
	    
	    var key = this._key[dir],
	        // state variables a,b,c,d are loaded with pre-whitened data
	        a = input[0]           ^ key[0],
	        b = input[dir ? 3 : 1] ^ key[1],
	        c = input[2]           ^ key[2],
	        d = input[dir ? 1 : 3] ^ key[3],
	        a2, b2, c2,
	        
	        nInnerRounds = key.length/4 - 2,
	        i,
	        kIndex = 4,
	        out = [0,0,0,0],
	        table = this._tables[dir],
	        
	        // load up the tables
	        t0    = table[0],
	        t1    = table[1],
	        t2    = table[2],
	        t3    = table[3],
	        sbox  = table[4];
	 
	    // Inner rounds.  Cribbed from OpenSSL.
	    for (i = 0; i < nInnerRounds; i++) {
	      a2 = t0[a>>>24] ^ t1[b>>16 & 255] ^ t2[c>>8 & 255] ^ t3[d & 255] ^ key[kIndex];
	      b2 = t0[b>>>24] ^ t1[c>>16 & 255] ^ t2[d>>8 & 255] ^ t3[a & 255] ^ key[kIndex + 1];
	      c2 = t0[c>>>24] ^ t1[d>>16 & 255] ^ t2[a>>8 & 255] ^ t3[b & 255] ^ key[kIndex + 2];
	      d  = t0[d>>>24] ^ t1[a>>16 & 255] ^ t2[b>>8 & 255] ^ t3[c & 255] ^ key[kIndex + 3];
	      kIndex += 4;
	      a=a2; b=b2; c=c2;
	    }
	        
	    // Last round.
	    for (i = 0; i < 4; i++) {
	      out[dir ? 3&-i : i] =
	        sbox[a>>>24      ]<<24 ^ 
	        sbox[b>>16  & 255]<<16 ^
	        sbox[c>>8   & 255]<<8  ^
	        sbox[d      & 255]     ^
	        key[kIndex++];
	      a2=a; a=b; b=c; c=d; d=a2;
	    }
	    
	    return out;
	  }
	};


	/** @fileOverview Arrays of bits, encoded as arrays of Numbers.
	 *
	 * @author Emily Stark
	 * @author Mike Hamburg
	 * @author Dan Boneh
	 */

	/** @namespace Arrays of bits, encoded as arrays of Numbers.
	 *
	 * @description
	 * <p>
	 * These objects are the currency accepted by SJCL's crypto functions.
	 * </p>
	 *
	 * <p>
	 * Most of our crypto primitives operate on arrays of 4-byte words internally,
	 * but many of them can take arguments that are not a multiple of 4 bytes.
	 * This library encodes arrays of bits (whose size need not be a multiple of 8
	 * bits) as arrays of 32-bit words.  The bits are packed, big-endian, into an
	 * array of words, 32 bits at a time.  Since the words are double-precision
	 * floating point numbers, they fit some extra data.  We use this (in a private,
	 * possibly-changing manner) to encode the number of bits actually  present
	 * in the last word of the array.
	 * </p>
	 *
	 * <p>
	 * Because bitwise ops clear this out-of-band data, these arrays can be passed
	 * to ciphers like AES which want arrays of words.
	 * </p>
	 */
	sjcl.bitArray = {
	  /**
	   * Array slices in units of bits.
	   * @param {bitArray} a The array to slice.
	   * @param {Number} bstart The offset to the start of the slice, in bits.
	   * @param {Number} bend The offset to the end of the slice, in bits.  If this is undefined,
	   * slice until the end of the array.
	   * @return {bitArray} The requested slice.
	   */
	  bitSlice: function (a, bstart, bend) {
	    a = sjcl.bitArray._shiftRight(a.slice(bstart/32), 32 - (bstart & 31)).slice(1);
	    return (bend === undefined) ? a : sjcl.bitArray.clamp(a, bend-bstart);
	  },

	  /**
	   * Extract a number packed into a bit array.
	   * @param {bitArray} a The array to slice.
	   * @param {Number} bstart The offset to the start of the slice, in bits.
	   * @param {Number} length The length of the number to extract.
	   * @return {Number} The requested slice.
	   */
	  extract: function(a, bstart, blength) {
	    // FIXME: this Math.floor is not necessary at all, but for some reason
	    // seems to suppress a bug in the Chromium JIT.
	    var x, sh = Math.floor((-bstart-blength) & 31);
	    if ((bstart + blength - 1 ^ bstart) & -32) {
	      // it crosses a boundary
	      x = (a[bstart/32|0] << (32 - sh)) ^ (a[bstart/32+1|0] >>> sh);
	    } else {
	      // within a single word
	      x = a[bstart/32|0] >>> sh;
	    }
	    return x & ((1<<blength) - 1);
	  },

	  /**
	   * Concatenate two bit arrays.
	   * @param {bitArray} a1 The first array.
	   * @param {bitArray} a2 The second array.
	   * @return {bitArray} The concatenation of a1 and a2.
	   */
	  concat: function (a1, a2) {
	    if (a1.length === 0 || a2.length === 0) {
	      return a1.concat(a2);
	    }
	    
	    var out, i, last = a1[a1.length-1], shift = sjcl.bitArray.getPartial(last);
	    if (shift === 32) {
	      return a1.concat(a2);
	    } else {
	      return sjcl.bitArray._shiftRight(a2, shift, last|0, a1.slice(0,a1.length-1));
	    }
	  },

	  /**
	   * Find the length of an array of bits.
	   * @param {bitArray} a The array.
	   * @return {Number} The length of a, in bits.
	   */
	  bitLength: function (a) {
	    var l = a.length, x;
	    if (l === 0) { return 0; }
	    x = a[l - 1];
	    return (l-1) * 32 + sjcl.bitArray.getPartial(x);
	  },

	  /**
	   * Truncate an array.
	   * @param {bitArray} a The array.
	   * @param {Number} len The length to truncate to, in bits.
	   * @return {bitArray} A new array, truncated to len bits.
	   */
	  clamp: function (a, len) {
	    if (a.length * 32 < len) { return a; }
	    a = a.slice(0, Math.ceil(len / 32));
	    var l = a.length;
	    len = len & 31;
	    if (l > 0 && len) {
	      a[l-1] = sjcl.bitArray.partial(len, a[l-1] & 0x80000000 >> (len-1), 1);
	    }
	    return a;
	  },

	  /**
	   * Make a partial word for a bit array.
	   * @param {Number} len The number of bits in the word.
	   * @param {Number} x The bits.
	   * @param {Number} [0] _end Pass 1 if x has already been shifted to the high side.
	   * @return {Number} The partial word.
	   */
	  partial: function (len, x, _end) {
	    if (len === 32) { return x; }
	    return (_end ? x|0 : x << (32-len)) + len * 0x10000000000;
	  },

	  /**
	   * Get the number of bits used by a partial word.
	   * @param {Number} x The partial word.
	   * @return {Number} The number of bits used by the partial word.
	   */
	  getPartial: function (x) {
	    return Math.round(x/0x10000000000) || 32;
	  },

	  /**
	   * Compare two arrays for equality in a predictable amount of time.
	   * @param {bitArray} a The first array.
	   * @param {bitArray} b The second array.
	   * @return {boolean} true if a == b; false otherwise.
	   */
	  equal: function (a, b) {
	    if (sjcl.bitArray.bitLength(a) !== sjcl.bitArray.bitLength(b)) {
	      return false;
	    }
	    var x = 0, i;
	    for (i=0; i<a.length; i++) {
	      x |= a[i]^b[i];
	    }
	    return (x === 0);
	  },

	  /** Shift an array right.
	   * @param {bitArray} a The array to shift.
	   * @param {Number} shift The number of bits to shift.
	   * @param {Number} [carry=0] A byte to carry in
	   * @param {bitArray} [out=[]] An array to prepend to the output.
	   * @private
	   */
	  _shiftRight: function (a, shift, carry, out) {
	    var i, last2=0, shift2;
	    if (out === undefined) { out = []; }
	    
	    for (; shift >= 32; shift -= 32) {
	      out.push(carry);
	      carry = 0;
	    }
	    if (shift === 0) {
	      return out.concat(a);
	    }
	    
	    for (i=0; i<a.length; i++) {
	      out.push(carry | a[i]>>>shift);
	      carry = a[i] << (32-shift);
	    }
	    last2 = a.length ? a[a.length-1] : 0;
	    shift2 = sjcl.bitArray.getPartial(last2);
	    out.push(sjcl.bitArray.partial(shift+shift2 & 31, (shift + shift2 > 32) ? carry : out.pop(),1));
	    return out;
	  },
	  
	  /** xor a block of 4 words together.
	   * @private
	   */
	  _xor4: function(x,y) {
	    return [x[0]^y[0],x[1]^y[1],x[2]^y[2],x[3]^y[3]];
	  }
	};

	/** @fileOverview Bit array codec implementations.
	 *
	 * @author Emily Stark
	 * @author Mike Hamburg
	 * @author Dan Boneh
	 */
	 
	/** @namespace UTF-8 strings */
	sjcl.codec.utf8String = {
	  /** Convert from a bitArray to a UTF-8 string. */
	  fromBits: function (arr) {
	    var out = "", bl = sjcl.bitArray.bitLength(arr), i, tmp;
	    for (i=0; i<bl/8; i++) {
	      if ((i&3) === 0) {
	        tmp = arr[i/4];
	      }
	      out += String.fromCharCode(tmp >>> 24);
	      tmp <<= 8;
	    }
	    return decodeURIComponent(escape(out));
	  },
	  
	  /** Convert from a UTF-8 string to a bitArray. */
	  toBits: function (str) {
	    str = unescape(encodeURIComponent(str));
	    var out = [], i, tmp=0;
	    for (i=0; i<str.length; i++) {
	      tmp = tmp << 8 | str.charCodeAt(i);
	      if ((i&3) === 3) {
	        out.push(tmp);
	        tmp = 0;
	      }
	    }
	    if (i&3) {
	      out.push(sjcl.bitArray.partial(8*(i&3), tmp));
	    }
	    return out;
	  }
	};

	/** @fileOverview Bit array codec implementations.
	 *
	 * @author Emily Stark
	 * @author Mike Hamburg
	 * @author Dan Boneh
	 */

	/** @namespace Hexadecimal */
	sjcl.codec.hex = {
	  /** Convert from a bitArray to a hex string. */
	  fromBits: function (arr) {
	    var out = "", i, x;
	    for (i=0; i<arr.length; i++) {
	      out += ((arr[i]|0)+0xF00000000000).toString(16).substr(4);
	    }
	    return out.substr(0, sjcl.bitArray.bitLength(arr)/4);//.replace(/(.{8})/g, "$1 ");
	  },
	  /** Convert from a hex string to a bitArray. */
	  toBits: function (str) {
	    var i, out=[], len;
	    str = str.replace(/\s|0x/g, "");
	    len = str.length;
	    str = str + "00000000";
	    for (i=0; i<str.length; i+=8) {
	      out.push(parseInt(str.substr(i,8),16)^0);
	    }
	    return sjcl.bitArray.clamp(out, len*4);
	  }
	};


	/** @fileOverview Bit array codec implementations.
	 *
	 * @author Emily Stark
	 * @author Mike Hamburg
	 * @author Dan Boneh
	 */

	/** @namespace Base64 encoding/decoding */
	sjcl.codec.base64 = {
	  /** The base64 alphabet.
	   * @private
	   */
	  _chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
	  
	  /** Convert from a bitArray to a base64 string. */
	  fromBits: function (arr, _noEquals, _url) {
	    var out = "", i, bits=0, c = sjcl.codec.base64._chars, ta=0, bl = sjcl.bitArray.bitLength(arr);
	    if (_url) c = c.substr(0,62) + '-_';
	    for (i=0; out.length * 6 < bl; ) {
	      out += c.charAt((ta ^ arr[i]>>>bits) >>> 26);
	      if (bits < 6) {
	        ta = arr[i] << (6-bits);
	        bits += 26;
	        i++;
	      } else {
	        ta <<= 6;
	        bits -= 6;
	      }
	    }
	    while ((out.length & 3) && !_noEquals) { out += "="; }
	    return out;
	  },
	  
	  /** Convert from a base64 string to a bitArray */
	  toBits: function(str, _url) {
	    str = str.replace(/\s|=/g,'');
	    var out = [], i, bits=0, c = sjcl.codec.base64._chars, ta=0, x;
	    if (_url) c = c.substr(0,62) + '-_';
	    for (i=0; i<str.length; i++) {
	      x = c.indexOf(str.charAt(i));
	      if (x < 0) {
	        throw new sjcl.exception.invalid("this isn't base64!");
	      }
	      if (bits > 26) {
	        bits -= 26;
	        out.push(ta ^ x>>>bits);
	        ta  = x << (32-bits);
	      } else {
	        bits += 6;
	        ta ^= x << (32-bits);
	      }
	    }
	    if (bits&56) {
	      out.push(sjcl.bitArray.partial(bits&56, ta, 1));
	    }
	    return out;
	  }
	};

	sjcl.codec.base64url = {
	  fromBits: function (arr) { return sjcl.codec.base64.fromBits(arr,1,1); },
	  toBits: function (str) { return sjcl.codec.base64.toBits(str,1); }
	};

	/** @fileOverview Bit array codec implementations.
	 *
	 * @author Emily Stark
	 * @author Mike Hamburg
	 * @author Dan Boneh
	 */

	/** @namespace Arrays of bytes */
	sjcl.codec.bytes = {
	  /** Convert from a bitArray to an array of bytes. */
	  fromBits: function (arr) {
	    var out = [], bl = sjcl.bitArray.bitLength(arr), i, tmp;
	    for (i=0; i<bl/8; i++) {
	      if ((i&3) === 0) {
	        tmp = arr[i/4];
	      }
	      out.push(tmp >>> 24);
	      tmp <<= 8;
	    }
	    return out;
	  },
	  /** Convert from an array of bytes to a bitArray. */
	  toBits: function (bytes) {
	    var out = [], i, tmp=0;
	    for (i=0; i<bytes.length; i++) {
	      tmp = tmp << 8 | bytes[i];
	      if ((i&3) === 3) {
	        out.push(tmp);
	        tmp = 0;
	      }
	    }
	    if (i&3) {
	      out.push(sjcl.bitArray.partial(8*(i&3), tmp));
	    }
	    return out;
	  }
	};

	/** @fileOverview Javascript SHA-256 implementation.
	 *
	 * An older version of this implementation is available in the public
	 * domain, but this one is (c) Emily Stark, Mike Hamburg, Dan Boneh,
	 * Stanford University 2008-2010 and BSD-licensed for liability
	 * reasons.
	 *
	 * Special thanks to Aldo Cortesi for pointing out several bugs in
	 * this code.
	 *
	 * @author Emily Stark
	 * @author Mike Hamburg
	 * @author Dan Boneh
	 */

	/**
	 * Context for a SHA-256 operation in progress.
	 * @constructor
	 * @class Secure Hash Algorithm, 256 bits.
	 */
	sjcl.hash.sha256 = function (hash) {
	  if (!this._key[0]) { this._precompute(); }
	  if (hash) {
	    this._h = hash._h.slice(0);
	    this._buffer = hash._buffer.slice(0);
	    this._length = hash._length;
	  } else {
	    this.reset();
	  }
	};

	/**
	 * Hash a string or an array of words.
	 * @static
	 * @param {bitArray|String} data the data to hash.
	 * @return {bitArray} The hash value, an array of 16 big-endian words.
	 */
	sjcl.hash.sha256.hash = function (data) {
	  return (new sjcl.hash.sha256()).update(data).finalize();
	};

	sjcl.hash.sha256.prototype = {
	  /**
	   * The hash's block size, in bits.
	   * @constant
	   */
	  blockSize: 512,
	   
	  /**
	   * Reset the hash state.
	   * @return this
	   */
	  reset:function () {
	    this._h = this._init.slice(0);
	    this._buffer = [];
	    this._length = 0;
	    return this;
	  },
	  
	  /**
	   * Input several words to the hash.
	   * @param {bitArray|String} data the data to hash.
	   * @return this
	   */
	  update: function (data) {
	    if (typeof data === "string") {
	      data = sjcl.codec.utf8String.toBits(data);
	    }
	    var i, b = this._buffer = sjcl.bitArray.concat(this._buffer, data),
	        ol = this._length,
	        nl = this._length = ol + sjcl.bitArray.bitLength(data);
	    for (i = 512+ol & -512; i <= nl; i+= 512) {
	      this._block(b.splice(0,16));
	    }
	    return this;
	  },
	  
	  /**
	   * Complete hashing and output the hash value.
	   * @return {bitArray} The hash value, an array of 8 big-endian words.
	   */
	  finalize:function () {
	    var i, b = this._buffer, h = this._h;

	    // Round out and push the buffer
	    b = sjcl.bitArray.concat(b, [sjcl.bitArray.partial(1,1)]);
	    
	    // Round out the buffer to a multiple of 16 words, less the 2 length words.
	    for (i = b.length + 2; i & 15; i++) {
	      b.push(0);
	    }
	    
	    // append the length
	    b.push(Math.floor(this._length / 0x100000000));
	    b.push(this._length | 0);

	    while (b.length) {
	      this._block(b.splice(0,16));
	    }

	    this.reset();
	    return h;
	  },

	  /**
	   * The SHA-256 initialization vector, to be precomputed.
	   * @private
	   */
	  _init:[],
	  /*
	  _init:[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],
	  */
	  
	  /**
	   * The SHA-256 hash key, to be precomputed.
	   * @private
	   */
	  _key:[],
	  /*
	  _key:
	    [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
	     0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
	     0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
	     0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
	     0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
	     0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
	     0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
	     0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2],
	  */


	  /**
	   * Function to precompute _init and _key.
	   * @private
	   */
	  _precompute: function () {
	    var i = 0, prime = 2, factor;

	    function frac(x) { return (x-Math.floor(x)) * 0x100000000 | 0; }

	    outer: for (; i<64; prime++) {
	      for (factor=2; factor*factor <= prime; factor++) {
	        if (prime % factor === 0) {
	          // not a prime
	          continue outer;
	        }
	      }
	      
	      if (i<8) {
	        this._init[i] = frac(Math.pow(prime, 1/2));
	      }
	      this._key[i] = frac(Math.pow(prime, 1/3));
	      i++;
	    }
	  },
	  
	  /**
	   * Perform one cycle of SHA-256.
	   * @param {bitArray} words one block of words.
	   * @private
	   */
	  _block:function (words) {  
	    var i, tmp, a, b,
	      w = words.slice(0),
	      h = this._h,
	      k = this._key,
	      h0 = h[0], h1 = h[1], h2 = h[2], h3 = h[3],
	      h4 = h[4], h5 = h[5], h6 = h[6], h7 = h[7];

	    /* Rationale for placement of |0 :
	     * If a value can overflow is original 32 bits by a factor of more than a few
	     * million (2^23 ish), there is a possibility that it might overflow the
	     * 53-bit mantissa and lose precision.
	     *
	     * To avoid this, we clamp back to 32 bits by |'ing with 0 on any value that
	     * propagates around the loop, and on the hash state h[].  I don't believe
	     * that the clamps on h4 and on h0 are strictly necessary, but it's close
	     * (for h4 anyway), and better safe than sorry.
	     *
	     * The clamps on h[] are necessary for the output to be correct even in the
	     * common case and for short inputs.
	     */
	    for (i=0; i<64; i++) {
	      // load up the input word for this round
	      if (i<16) {
	        tmp = w[i];
	      } else {
	        a   = w[(i+1 ) & 15];
	        b   = w[(i+14) & 15];
	        tmp = w[i&15] = ((a>>>7  ^ a>>>18 ^ a>>>3  ^ a<<25 ^ a<<14) + 
	                         (b>>>17 ^ b>>>19 ^ b>>>10 ^ b<<15 ^ b<<13) +
	                         w[i&15] + w[(i+9) & 15]) | 0;
	      }
	      
	      tmp = (tmp + h7 + (h4>>>6 ^ h4>>>11 ^ h4>>>25 ^ h4<<26 ^ h4<<21 ^ h4<<7) +  (h6 ^ h4&(h5^h6)) + k[i]); // | 0;
	      
	      // shift register
	      h7 = h6; h6 = h5; h5 = h4;
	      h4 = h3 + tmp | 0;
	      h3 = h2; h2 = h1; h1 = h0;

	      h0 = (tmp +  ((h1&h2) ^ (h3&(h1^h2))) + (h1>>>2 ^ h1>>>13 ^ h1>>>22 ^ h1<<30 ^ h1<<19 ^ h1<<10)) | 0;
	    }

	    h[0] = h[0]+h0 | 0;
	    h[1] = h[1]+h1 | 0;
	    h[2] = h[2]+h2 | 0;
	    h[3] = h[3]+h3 | 0;
	    h[4] = h[4]+h4 | 0;
	    h[5] = h[5]+h5 | 0;
	    h[6] = h[6]+h6 | 0;
	    h[7] = h[7]+h7 | 0;
	  }
	};



	/** @fileOverview Javascript SHA-512 implementation.
	 *
	 * This implementation was written for CryptoJS by Jeff Mott and adapted for
	 * SJCL by Stefan Thomas.
	 *
	 * CryptoJS (c) 2009–2012 by Jeff Mott. All rights reserved.
	 * Released with New BSD License
	 *
	 * @author Emily Stark
	 * @author Mike Hamburg
	 * @author Dan Boneh
	 * @author Jeff Mott
	 * @author Stefan Thomas
	 */

	/**
	 * Context for a SHA-512 operation in progress.
	 * @constructor
	 * @class Secure Hash Algorithm, 512 bits.
	 */
	sjcl.hash.sha512 = function (hash) {
	  if (!this._key[0]) { this._precompute(); }
	  if (hash) {
	    this._h = hash._h.slice(0);
	    this._buffer = hash._buffer.slice(0);
	    this._length = hash._length;
	  } else {
	    this.reset();
	  }
	};

	/**
	 * Hash a string or an array of words.
	 * @static
	 * @param {bitArray|String} data the data to hash.
	 * @return {bitArray} The hash value, an array of 16 big-endian words.
	 */
	sjcl.hash.sha512.hash = function (data) {
	  return (new sjcl.hash.sha512()).update(data).finalize();
	};

	sjcl.hash.sha512.prototype = {
	  /**
	   * The hash's block size, in bits.
	   * @constant
	   */
	  blockSize: 1024,
	   
	  /**
	   * Reset the hash state.
	   * @return this
	   */
	  reset:function () {
	    this._h = this._init.slice(0);
	    this._buffer = [];
	    this._length = 0;
	    return this;
	  },
	  
	  /**
	   * Input several words to the hash.
	   * @param {bitArray|String} data the data to hash.
	   * @return this
	   */
	  update: function (data) {
	    if (typeof data === "string") {
	      data = sjcl.codec.utf8String.toBits(data);
	    }
	    var i, b = this._buffer = sjcl.bitArray.concat(this._buffer, data),
	        ol = this._length,
	        nl = this._length = ol + sjcl.bitArray.bitLength(data);
	    for (i = 1024+ol & -1024; i <= nl; i+= 1024) {
	      this._block(b.splice(0,32));
	    }
	    return this;
	  },
	  
	  /**
	   * Complete hashing and output the hash value.
	   * @return {bitArray} The hash value, an array of 16 big-endian words.
	   */
	  finalize:function () {
	    var i, b = this._buffer, h = this._h;

	    // Round out and push the buffer
	    b = sjcl.bitArray.concat(b, [sjcl.bitArray.partial(1,1)]);

	    // Round out the buffer to a multiple of 32 words, less the 4 length words.
	    for (i = b.length + 4; i & 31; i++) {
	      b.push(0);
	    }

	    // append the length
	    b.push(0);
	    b.push(0);
	    b.push(Math.floor(this._length / 0x100000000));
	    b.push(this._length | 0);

	    while (b.length) {
	      this._block(b.splice(0,32));
	    }

	    this.reset();
	    return h;
	  },

	  /**
	   * The SHA-512 initialization vector, to be precomputed.
	   * @private
	   */
	  _init:[],

	  /**
	   * Least significant 24 bits of SHA512 initialization values.
	   *
	   * Javascript only has 53 bits of precision, so we compute the 40 most
	   * significant bits and add the remaining 24 bits as constants.
	   *
	   * @private
	   */
	  _initr: [ 0xbcc908, 0xcaa73b, 0x94f82b, 0x1d36f1, 0xe682d1, 0x3e6c1f, 0x41bd6b, 0x7e2179 ],

	  /*
	  _init:
	  [0x6a09e667, 0xf3bcc908, 0xbb67ae85, 0x84caa73b, 0x3c6ef372, 0xfe94f82b, 0xa54ff53a, 0x5f1d36f1,
	   0x510e527f, 0xade682d1, 0x9b05688c, 0x2b3e6c1f, 0x1f83d9ab, 0xfb41bd6b, 0x5be0cd19, 0x137e2179],
	  */

	  /**
	   * The SHA-512 hash key, to be precomputed.
	   * @private
	   */
	  _key:[],

	  /**
	   * Least significant 24 bits of SHA512 key values.
	   * @private
	   */
	  _keyr:
	  [0x28ae22, 0xef65cd, 0x4d3b2f, 0x89dbbc, 0x48b538, 0x05d019, 0x194f9b, 0x6d8118,
	   0x030242, 0x706fbe, 0xe4b28c, 0xffb4e2, 0x7b896f, 0x1696b1, 0xc71235, 0x692694,
	   0xf14ad2, 0x4f25e3, 0x8cd5b5, 0xac9c65, 0x2b0275, 0xa6e483, 0x41fbd4, 0x1153b5,
	   0x66dfab, 0xb43210, 0xfb213f, 0xef0ee4, 0xa88fc2, 0x0aa725, 0x03826f, 0x0e6e70,
	   0xd22ffc, 0x26c926, 0xc42aed, 0x95b3df, 0xaf63de, 0x77b2a8, 0xedaee6, 0x82353b,
	   0xf10364, 0x423001, 0xf89791, 0x54be30, 0xef5218, 0x65a910, 0x71202a, 0xbbd1b8,
	   0xd2d0c8, 0x41ab53, 0x8eeb99, 0x9b48a8, 0xc95a63, 0x418acb, 0x63e373, 0xb2b8a3,
	   0xefb2fc, 0x172f60, 0xf0ab72, 0x6439ec, 0x631e28, 0x82bde9, 0xc67915, 0x72532b,
	   0x26619c, 0xc0c207, 0xe0eb1e, 0x6ed178, 0x176fba, 0xc898a6, 0xf90dae, 0x1c471b,
	   0x047d84, 0xc72493, 0xc9bebc, 0x100d4c, 0x3e42b6, 0x657e2a, 0xd6faec, 0x475817],

	  /*
	  _key:
	  [0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd, 0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
	   0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019, 0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
	   0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe, 0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
	   0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1, 0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
	   0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3, 0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
	   0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483, 0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
	   0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210, 0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
	   0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725, 0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
	   0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926, 0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
	   0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8, 0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
	   0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001, 0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
	   0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910, 0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
	   0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53, 0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
	   0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb, 0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
	   0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60, 0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
	   0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9, 0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
	   0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207, 0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
	   0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6, 0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
	   0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493, 0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
	   0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a, 0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817],
	  */

	  /**
	   * Function to precompute _init and _key.
	   * @private
	   */
	  _precompute: function () {
	    // XXX: This code is for precomputing the SHA256 constants, change for
	    //      SHA512 and re-enable.
	    var i = 0, prime = 2, factor;

	    function frac(x)  { return (x-Math.floor(x)) * 0x100000000 | 0; }
	    function frac2(x) { return (x-Math.floor(x)) * 0x10000000000 & 0xff; }

	    outer: for (; i<80; prime++) {
	      for (factor=2; factor*factor <= prime; factor++) {
	        if (prime % factor === 0) {
	          // not a prime
	          continue outer;
	        }
	      }

	      if (i<8) {
	        this._init[i*2] = frac(Math.pow(prime, 1/2));
	        this._init[i*2+1] = (frac2(Math.pow(prime, 1/2)) << 24) | this._initr[i];
	      }
	      this._key[i*2] = frac(Math.pow(prime, 1/3));
	      this._key[i*2+1] = (frac2(Math.pow(prime, 1/3)) << 24) | this._keyr[i];
	      i++;
	    }
	  },

	  /**
	   * Perform one cycle of SHA-512.
	   * @param {bitArray} words one block of words.
	   * @private
	   */
	  _block:function (words) {
	    var i, wrh, wrl,
	        w = words.slice(0),
	        h = this._h,
	        k = this._key,
	        h0h = h[ 0], h0l = h[ 1], h1h = h[ 2], h1l = h[ 3],
	        h2h = h[ 4], h2l = h[ 5], h3h = h[ 6], h3l = h[ 7],
	        h4h = h[ 8], h4l = h[ 9], h5h = h[10], h5l = h[11],
	        h6h = h[12], h6l = h[13], h7h = h[14], h7l = h[15];

	    // Working variables
	    var ah = h0h, al = h0l, bh = h1h, bl = h1l,
	        ch = h2h, cl = h2l, dh = h3h, dl = h3l,
	        eh = h4h, el = h4l, fh = h5h, fl = h5l,
	        gh = h6h, gl = h6l, hh = h7h, hl = h7l;

	    for (i=0; i<80; i++) {
	      // load up the input word for this round
	      if (i<16) {
	        wrh = w[i * 2];
	        wrl = w[i * 2 + 1];
	      } else {
	        // Gamma0
	        var gamma0xh = w[(i-15) * 2];
	        var gamma0xl = w[(i-15) * 2 + 1];
	        var gamma0h =
	          ((gamma0xl << 31) | (gamma0xh >>> 1)) ^
	          ((gamma0xl << 24) | (gamma0xh >>> 8)) ^
	           (gamma0xh >>> 7);
	        var gamma0l =
	          ((gamma0xh << 31) | (gamma0xl >>> 1)) ^
	          ((gamma0xh << 24) | (gamma0xl >>> 8)) ^
	          ((gamma0xh << 25) | (gamma0xl >>> 7));

	        // Gamma1
	        var gamma1xh = w[(i-2) * 2];
	        var gamma1xl = w[(i-2) * 2 + 1];
	        var gamma1h =
	          ((gamma1xl << 13) | (gamma1xh >>> 19)) ^
	          ((gamma1xh << 3)  | (gamma1xl >>> 29)) ^
	           (gamma1xh >>> 6);
	        var gamma1l =
	          ((gamma1xh << 13) | (gamma1xl >>> 19)) ^
	          ((gamma1xl << 3)  | (gamma1xh >>> 29)) ^
	          ((gamma1xh << 26) | (gamma1xl >>> 6));

	        // Shortcuts
	        var wr7h = w[(i-7) * 2];
	        var wr7l = w[(i-7) * 2 + 1];

	        var wr16h = w[(i-16) * 2];
	        var wr16l = w[(i-16) * 2 + 1];

	        // W(round) = gamma0 + W(round - 7) + gamma1 + W(round - 16)
	        wrl = gamma0l + wr7l;
	        wrh = gamma0h + wr7h + ((wrl >>> 0) < (gamma0l >>> 0) ? 1 : 0);
	        wrl += gamma1l;
	        wrh += gamma1h + ((wrl >>> 0) < (gamma1l >>> 0) ? 1 : 0);
	        wrl += wr16l;
	        wrh += wr16h + ((wrl >>> 0) < (wr16l >>> 0) ? 1 : 0);
	      }

	      w[i*2]     = wrh |= 0;
	      w[i*2 + 1] = wrl |= 0;

	      // Ch
	      var chh = (eh & fh) ^ (~eh & gh);
	      var chl = (el & fl) ^ (~el & gl);

	      // Maj
	      var majh = (ah & bh) ^ (ah & ch) ^ (bh & ch);
	      var majl = (al & bl) ^ (al & cl) ^ (bl & cl);

	      // Sigma0
	      var sigma0h = ((al << 4) | (ah >>> 28)) ^ ((ah << 30) | (al >>> 2)) ^ ((ah << 25) | (al >>> 7));
	      var sigma0l = ((ah << 4) | (al >>> 28)) ^ ((al << 30) | (ah >>> 2)) ^ ((al << 25) | (ah >>> 7));

	      // Sigma1
	      var sigma1h = ((el << 18) | (eh >>> 14)) ^ ((el << 14) | (eh >>> 18)) ^ ((eh << 23) | (el >>> 9));
	      var sigma1l = ((eh << 18) | (el >>> 14)) ^ ((eh << 14) | (el >>> 18)) ^ ((el << 23) | (eh >>> 9));

	      // K(round)
	      var krh = k[i*2];
	      var krl = k[i*2+1];

	      // t1 = h + sigma1 + ch + K(round) + W(round)
	      var t1l = hl + sigma1l;
	      var t1h = hh + sigma1h + ((t1l >>> 0) < (hl >>> 0) ? 1 : 0);
	      t1l += chl;
	      t1h += chh + ((t1l >>> 0) < (chl >>> 0) ? 1 : 0);
	      t1l += krl;
	      t1h += krh + ((t1l >>> 0) < (krl >>> 0) ? 1 : 0);
	      t1l += wrl;
	      t1h += wrh + ((t1l >>> 0) < (wrl >>> 0) ? 1 : 0);

	      // t2 = sigma0 + maj
	      var t2l = sigma0l + majl;
	      var t2h = sigma0h + majh + ((t2l >>> 0) < (sigma0l >>> 0) ? 1 : 0);

	      // Update working variables
	      hh = gh;
	      hl = gl;
	      gh = fh;
	      gl = fl;
	      fh = eh;
	      fl = el;
	      el = (dl + t1l) | 0;
	      eh = (dh + t1h + ((el >>> 0) < (dl >>> 0) ? 1 : 0)) | 0;
	      dh = ch;
	      dl = cl;
	      ch = bh;
	      cl = bl;
	      bh = ah;
	      bl = al;
	      al = (t1l + t2l) | 0;
	      ah = (t1h + t2h + ((al >>> 0) < (t1l >>> 0) ? 1 : 0)) | 0;
	    }

	    // Intermediate hash
	    h0l = h[1] = (h0l + al) | 0;
	    h[0] = (h0h + ah + ((h0l >>> 0) < (al >>> 0) ? 1 : 0)) | 0;
	    h1l = h[3] = (h1l + bl) | 0;
	    h[2] = (h1h + bh + ((h1l >>> 0) < (bl >>> 0) ? 1 : 0)) | 0;
	    h2l = h[5] = (h2l + cl) | 0;
	    h[4] = (h2h + ch + ((h2l >>> 0) < (cl >>> 0) ? 1 : 0)) | 0;
	    h3l = h[7] = (h3l + dl) | 0;
	    h[6] = (h3h + dh + ((h3l >>> 0) < (dl >>> 0) ? 1 : 0)) | 0;
	    h4l = h[9] = (h4l + el) | 0;
	    h[8] = (h4h + eh + ((h4l >>> 0) < (el >>> 0) ? 1 : 0)) | 0;
	    h5l = h[11] = (h5l + fl) | 0;
	    h[10] = (h5h + fh + ((h5l >>> 0) < (fl >>> 0) ? 1 : 0)) | 0;
	    h6l = h[13] = (h6l + gl) | 0;
	    h[12] = (h6h + gh + ((h6l >>> 0) < (gl >>> 0) ? 1 : 0)) | 0;
	    h7l = h[15] = (h7l + hl) | 0;
	    h[14] = (h7h + hh + ((h7l >>> 0) < (hl >>> 0) ? 1 : 0)) | 0;
	  }
	};



	/** @fileOverview Javascript SHA-1 implementation.
	 *
	 * Based on the implementation in RFC 3174, method 1, and on the SJCL
	 * SHA-256 implementation.
	 *
	 * @author Quinn Slack
	 */

	/**
	 * Context for a SHA-1 operation in progress.
	 * @constructor
	 * @class Secure Hash Algorithm, 160 bits.
	 */
	sjcl.hash.sha1 = function (hash) {
	  if (hash) {
	    this._h = hash._h.slice(0);
	    this._buffer = hash._buffer.slice(0);
	    this._length = hash._length;
	  } else {
	    this.reset();
	  }
	};

	/**
	 * Hash a string or an array of words.
	 * @static
	 * @param {bitArray|String} data the data to hash.
	 * @return {bitArray} The hash value, an array of 5 big-endian words.
	 */
	sjcl.hash.sha1.hash = function (data) {
	  return (new sjcl.hash.sha1()).update(data).finalize();
	};

	sjcl.hash.sha1.prototype = {
	  /**
	   * The hash's block size, in bits.
	   * @constant
	   */
	  blockSize: 512,
	   
	  /**
	   * Reset the hash state.
	   * @return this
	   */
	  reset:function () {
	    this._h = this._init.slice(0);
	    this._buffer = [];
	    this._length = 0;
	    return this;
	  },
	  
	  /**
	   * Input several words to the hash.
	   * @param {bitArray|String} data the data to hash.
	   * @return this
	   */
	  update: function (data) {
	    if (typeof data === "string") {
	      data = sjcl.codec.utf8String.toBits(data);
	    }
	    var i, b = this._buffer = sjcl.bitArray.concat(this._buffer, data),
	        ol = this._length,
	        nl = this._length = ol + sjcl.bitArray.bitLength(data);
	    for (i = this.blockSize+ol & -this.blockSize; i <= nl;
	         i+= this.blockSize) {
	      this._block(b.splice(0,16));
	    }
	    return this;
	  },
	  
	  /**
	   * Complete hashing and output the hash value.
	   * @return {bitArray} The hash value, an array of 5 big-endian words. TODO
	   */
	  finalize:function () {
	    var i, b = this._buffer, h = this._h;

	    // Round out and push the buffer
	    b = sjcl.bitArray.concat(b, [sjcl.bitArray.partial(1,1)]);
	    // Round out the buffer to a multiple of 16 words, less the 2 length words.
	    for (i = b.length + 2; i & 15; i++) {
	      b.push(0);
	    }

	    // append the length
	    b.push(Math.floor(this._length / 0x100000000));
	    b.push(this._length | 0);

	    while (b.length) {
	      this._block(b.splice(0,16));
	    }

	    this.reset();
	    return h;
	  },

	  /**
	   * The SHA-1 initialization vector.
	   * @private
	   */
	  _init:[0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0],

	  /**
	   * The SHA-1 hash key.
	   * @private
	   */
	  _key:[0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xCA62C1D6],

	  /**
	   * The SHA-1 logical functions f(0), f(1), ..., f(79).
	   * @private
	   */
	  _f:function(t, b, c, d) {
	    if (t <= 19) {
	      return (b & c) | (~b & d);
	    } else if (t <= 39) {
	      return b ^ c ^ d;
	    } else if (t <= 59) {
	      return (b & c) | (b & d) | (c & d);
	    } else if (t <= 79) {
	      return b ^ c ^ d;
	    }
	  },

	  /**
	   * Circular left-shift operator.
	   * @private
	   */
	  _S:function(n, x) {
	    return (x << n) | (x >>> 32-n);
	  },
	  
	  /**
	   * Perform one cycle of SHA-1.
	   * @param {bitArray} words one block of words.
	   * @private
	   */
	  _block:function (words) {  
	    var t, tmp, a, b, c, d, e,
	    w = words.slice(0),
	    h = this._h,
	    k = this._key;
	   
	    a = h[0]; b = h[1]; c = h[2]; d = h[3]; e = h[4]; 

	    for (t=0; t<=79; t++) {
	      if (t >= 16) {
	        w[t] = this._S(1, w[t-3] ^ w[t-8] ^ w[t-14] ^ w[t-16]);
	      }
	      tmp = (this._S(5, a) + this._f(t, b, c, d) + e + w[t] +
	             this._key[Math.floor(t/20)]) | 0;
	      e = d;
	      d = c;
	      c = this._S(30, b);
	      b = a;
	      a = tmp;
	   }

	   h[0] = (h[0]+a) |0;
	   h[1] = (h[1]+b) |0;
	   h[2] = (h[2]+c) |0;
	   h[3] = (h[3]+d) |0;
	   h[4] = (h[4]+e) |0;
	  }
	};

	/** @fileOverview CCM mode implementation.
	 *
	 * Special thanks to Roy Nicholson for pointing out a bug in our
	 * implementation.
	 *
	 * @author Emily Stark
	 * @author Mike Hamburg
	 * @author Dan Boneh
	 */

	/** @namespace CTR mode with CBC MAC. */
	sjcl.mode.ccm = {
	  /** The name of the mode.
	   * @constant
	   */
	  name: "ccm",
	  
	  /** Encrypt in CCM mode.
	   * @static
	   * @param {Object} prf The pseudorandom function.  It must have a block size of 16 bytes.
	   * @param {bitArray} plaintext The plaintext data.
	   * @param {bitArray} iv The initialization value.
	   * @param {bitArray} [adata=[]] The authenticated data.
	   * @param {Number} [tlen=64] the desired tag length, in bits.
	   * @return {bitArray} The encrypted data, an array of bytes.
	   */
	  encrypt: function(prf, plaintext, iv, adata, tlen) {
	    var L, i, out = plaintext.slice(0), tag, w=sjcl.bitArray, ivl = w.bitLength(iv) / 8, ol = w.bitLength(out) / 8;
	    tlen = tlen || 64;
	    adata = adata || [];
	    
	    if (ivl < 7) {
	      throw new sjcl.exception.invalid("ccm: iv must be at least 7 bytes");
	    }
	    
	    // compute the length of the length
	    for (L=2; L<4 && ol >>> 8*L; L++) {}
	    if (L < 15 - ivl) { L = 15-ivl; }
	    iv = w.clamp(iv,8*(15-L));
	    
	    // compute the tag
	    tag = sjcl.mode.ccm._computeTag(prf, plaintext, iv, adata, tlen, L);
	    
	    // encrypt
	    out = sjcl.mode.ccm._ctrMode(prf, out, iv, tag, tlen, L);
	    
	    return w.concat(out.data, out.tag);
	  },
	  
	  /** Decrypt in CCM mode.
	   * @static
	   * @param {Object} prf The pseudorandom function.  It must have a block size of 16 bytes.
	   * @param {bitArray} ciphertext The ciphertext data.
	   * @param {bitArray} iv The initialization value.
	   * @param {bitArray} [[]] adata The authenticated data.
	   * @param {Number} [64] tlen the desired tag length, in bits.
	   * @return {bitArray} The decrypted data.
	   */
	  decrypt: function(prf, ciphertext, iv, adata, tlen) {
	    tlen = tlen || 64;
	    adata = adata || [];
	    var L, i, 
	        w=sjcl.bitArray,
	        ivl = w.bitLength(iv) / 8,
	        ol = w.bitLength(ciphertext), 
	        out = w.clamp(ciphertext, ol - tlen),
	        tag = w.bitSlice(ciphertext, ol - tlen), tag2;
	    

	    ol = (ol - tlen) / 8;
	        
	    if (ivl < 7) {
	      throw new sjcl.exception.invalid("ccm: iv must be at least 7 bytes");
	    }
	    
	    // compute the length of the length
	    for (L=2; L<4 && ol >>> 8*L; L++) {}
	    if (L < 15 - ivl) { L = 15-ivl; }
	    iv = w.clamp(iv,8*(15-L));
	    
	    // decrypt
	    out = sjcl.mode.ccm._ctrMode(prf, out, iv, tag, tlen, L);
	    
	    // check the tag
	    tag2 = sjcl.mode.ccm._computeTag(prf, out.data, iv, adata, tlen, L);
	    if (!w.equal(out.tag, tag2)) {
	      throw new sjcl.exception.corrupt("ccm: tag doesn't match");
	    }
	    
	    return out.data;
	  },

	  /* Compute the (unencrypted) authentication tag, according to the CCM specification
	   * @param {Object} prf The pseudorandom function.
	   * @param {bitArray} plaintext The plaintext data.
	   * @param {bitArray} iv The initialization value.
	   * @param {bitArray} adata The authenticated data.
	   * @param {Number} tlen the desired tag length, in bits.
	   * @return {bitArray} The tag, but not yet encrypted.
	   * @private
	   */
	  _computeTag: function(prf, plaintext, iv, adata, tlen, L) {
	    // compute B[0]
	    var q, mac, field = 0, offset = 24, tmp, i, macData = [], w=sjcl.bitArray, xor = w._xor4;

	    tlen /= 8;
	  
	    // check tag length and message length
	    if (tlen % 2 || tlen < 4 || tlen > 16) {
	      throw new sjcl.exception.invalid("ccm: invalid tag length");
	    }
	  
	    if (adata.length > 0xFFFFFFFF || plaintext.length > 0xFFFFFFFF) {
	      // I don't want to deal with extracting high words from doubles.
	      throw new sjcl.exception.bug("ccm: can't deal with 4GiB or more data");
	    }

	    // mac the flags
	    mac = [w.partial(8, (adata.length ? 1<<6 : 0) | (tlen-2) << 2 | L-1)];

	    // mac the iv and length
	    mac = w.concat(mac, iv);
	    mac[3] |= w.bitLength(plaintext)/8;
	    mac = prf.encrypt(mac);
	    
	  
	    if (adata.length) {
	      // mac the associated data.  start with its length...
	      tmp = w.bitLength(adata)/8;
	      if (tmp <= 0xFEFF) {
	        macData = [w.partial(16, tmp)];
	      } else if (tmp <= 0xFFFFFFFF) {
	        macData = w.concat([w.partial(16,0xFFFE)], [tmp]);
	      } // else ...
	    
	      // mac the data itself
	      macData = w.concat(macData, adata);
	      for (i=0; i<macData.length; i += 4) {
	        mac = prf.encrypt(xor(mac, macData.slice(i,i+4).concat([0,0,0])));
	      }
	    }
	  
	    // mac the plaintext
	    for (i=0; i<plaintext.length; i+=4) {
	      mac = prf.encrypt(xor(mac, plaintext.slice(i,i+4).concat([0,0,0])));
	    }

	    return w.clamp(mac, tlen * 8);
	  },

	  /** CCM CTR mode.
	   * Encrypt or decrypt data and tag with the prf in CCM-style CTR mode.
	   * May mutate its arguments.
	   * @param {Object} prf The PRF.
	   * @param {bitArray} data The data to be encrypted or decrypted.
	   * @param {bitArray} iv The initialization vector.
	   * @param {bitArray} tag The authentication tag.
	   * @param {Number} tlen The length of th etag, in bits.
	   * @param {Number} L The CCM L value.
	   * @return {Object} An object with data and tag, the en/decryption of data and tag values.
	   * @private
	   */
	  _ctrMode: function(prf, data, iv, tag, tlen, L) {
	    var enc, i, w=sjcl.bitArray, xor = w._xor4, ctr, b, l = data.length, bl=w.bitLength(data);

	    // start the ctr
	    ctr = w.concat([w.partial(8,L-1)],iv).concat([0,0,0]).slice(0,4);
	    
	    // en/decrypt the tag
	    tag = w.bitSlice(xor(tag,prf.encrypt(ctr)), 0, tlen);
	  
	    // en/decrypt the data
	    if (!l) { return {tag:tag, data:[]}; }
	    
	    for (i=0; i<l; i+=4) {
	      ctr[3]++;
	      enc = prf.encrypt(ctr);
	      data[i]   ^= enc[0];
	      data[i+1] ^= enc[1];
	      data[i+2] ^= enc[2];
	      data[i+3] ^= enc[3];
	    }
	    return { tag:tag, data:w.clamp(data,bl) };
	  }
	};

	/** @fileOverview HMAC implementation.
	 *
	 * @author Emily Stark
	 * @author Mike Hamburg
	 * @author Dan Boneh
	 */

	/** HMAC with the specified hash function.
	 * @constructor
	 * @param {bitArray} key the key for HMAC.
	 * @param {Object} [hash=sjcl.hash.sha256] The hash function to use.
	 */
	sjcl.misc.hmac = function (key, Hash) {
	  this._hash = Hash = Hash || sjcl.hash.sha256;
	  var exKey = [[],[]], i,
	      bs = Hash.prototype.blockSize / 32;
	  this._baseHash = [new Hash(), new Hash()];

	  if (key.length > bs) {
	    key = Hash.hash(key);
	  }
	  
	  for (i=0; i<bs; i++) {
	    exKey[0][i] = key[i]^0x36363636;
	    exKey[1][i] = key[i]^0x5C5C5C5C;
	  }
	  
	  this._baseHash[0].update(exKey[0]);
	  this._baseHash[1].update(exKey[1]);
	};

	/** HMAC with the specified hash function.  Also called encrypt since it's a prf.
	 * @param {bitArray|String} data The data to mac.
	 */
	sjcl.misc.hmac.prototype.encrypt = sjcl.misc.hmac.prototype.mac = function (data) {
	  var w = new (this._hash)(this._baseHash[0]).update(data).finalize();
	  return new (this._hash)(this._baseHash[1]).update(w).finalize();
	};


	/** @fileOverview Password-based key-derivation function, version 2.0.
	 *
	 * @author Emily Stark
	 * @author Mike Hamburg
	 * @author Dan Boneh
	 */

	/** Password-Based Key-Derivation Function, version 2.0.
	 *
	 * Generate keys from passwords using PBKDF2-HMAC-SHA256.
	 *
	 * This is the method specified by RSA's PKCS #5 standard.
	 *
	 * @param {bitArray|String} password  The password.
	 * @param {bitArray} salt The salt.  Should have lots of entropy.
	 * @param {Number} [count=1000] The number of iterations.  Higher numbers make the function slower but more secure.
	 * @param {Number} [length] The length of the derived key.  Defaults to the
	                            output size of the hash function.
	 * @param {Object} [Prff=sjcl.misc.hmac] The pseudorandom function family.
	 * @return {bitArray} the derived key.
	 */
	sjcl.misc.pbkdf2 = function (password, salt, count, length, Prff) {
	  count = count || 1000;
	  
	  if (length < 0 || count < 0) {
	    throw sjcl.exception.invalid("invalid params to pbkdf2");
	  }
	  
	  if (typeof password === "string") {
	    password = sjcl.codec.utf8String.toBits(password);
	  }
	  
	  Prff = Prff || sjcl.misc.hmac;
	  
	  var prf = new Prff(password),
	      u, ui, i, j, k, out = [], b = sjcl.bitArray;

	  for (k = 1; 32 * out.length < (length || 1); k++) {
	    u = ui = prf.encrypt(b.concat(salt,[k]));
	    
	    for (i=1; i<count; i++) {
	      ui = prf.encrypt(ui);
	      for (j=0; j<ui.length; j++) {
	        u[j] ^= ui[j];
	      }
	    }
	    
	    out = out.concat(u);
	  }

	  if (length) { out = b.clamp(out, length); }

	  return out;
	};

	/** @fileOverview Random number generator.
	 *
	 * @author Emily Stark
	 * @author Mike Hamburg
	 * @author Dan Boneh
	 */

	/** @constructor
	 * @class Random number generator
	 *
	 * @description
	 * <p>
	 * This random number generator is a derivative of Ferguson and Schneier's
	 * generator Fortuna.  It collects entropy from various events into several
	 * pools, implemented by streaming SHA-256 instances.  It differs from
	 * ordinary Fortuna in a few ways, though.
	 * </p>
	 *
	 * <p>
	 * Most importantly, it has an entropy estimator.  This is present because
	 * there is a strong conflict here between making the generator available
	 * as soon as possible, and making sure that it doesn't "run on empty".
	 * In Fortuna, there is a saved state file, and the system is likely to have
	 * time to warm up.
	 * </p>
	 *
	 * <p>
	 * Second, because users are unlikely to stay on the page for very long,
	 * and to speed startup time, the number of pools increases logarithmically:
	 * a new pool is created when the previous one is actually used for a reseed.
	 * This gives the same asymptotic guarantees as Fortuna, but gives more
	 * entropy to early reseeds.
	 * </p>
	 *
	 * <p>
	 * The entire mechanism here feels pretty klunky.  Furthermore, there are
	 * several improvements that should be made, including support for
	 * dedicated cryptographic functions that may be present in some browsers;
	 * state files in local storage; cookies containing randomness; etc.  So
	 * look for improvements in future versions.
	 * </p>
	 */
	sjcl.prng = function(defaultParanoia) {
	  
	  /* private */
	  this._pools                   = [new sjcl.hash.sha256()];
	  this._poolEntropy             = [0];
	  this._reseedCount             = 0;
	  this._robins                  = {};
	  this._eventId                 = 0;
	  
	  this._collectorIds            = {};
	  this._collectorIdNext         = 0;
	  
	  this._strength                = 0;
	  this._poolStrength            = 0;
	  this._nextReseed              = 0;
	  this._key                     = [0,0,0,0,0,0,0,0];
	  this._counter                 = [0,0,0,0];
	  this._cipher                  = undefined;
	  this._defaultParanoia         = defaultParanoia;
	  
	  /* event listener stuff */
	  this._collectorsStarted       = false;
	  this._callbacks               = {progress: {}, seeded: {}};
	  this._callbackI               = 0;
	  
	  /* constants */
	  this._NOT_READY               = 0;
	  this._READY                   = 1;
	  this._REQUIRES_RESEED         = 2;

	  this._MAX_WORDS_PER_BURST     = 65536;
	  this._PARANOIA_LEVELS         = [0,48,64,96,128,192,256,384,512,768,1024];
	  this._MILLISECONDS_PER_RESEED = 30000;
	  this._BITS_PER_RESEED         = 80;
	}
	 
	sjcl.prng.prototype = {
	  /** Generate several random words, and return them in an array
	   * @param {Number} nwords The number of words to generate.
	   */
	  randomWords: function (nwords, paranoia) {
	    var out = [], i, readiness = this.isReady(paranoia), g;
	  
	    if (readiness === this._NOT_READY) {
	      throw new sjcl.exception.notReady("generator isn't seeded");
	    } else if (readiness & this._REQUIRES_RESEED) {
	      this._reseedFromPools(!(readiness & this._READY));
	    }
	  
	    for (i=0; i<nwords; i+= 4) {
	      if ((i+1) % this._MAX_WORDS_PER_BURST === 0) {
	        this._gate();
	      }
	   
	      g = this._gen4words();
	      out.push(g[0],g[1],g[2],g[3]);
	    }
	    this._gate();
	  
	    return out.slice(0,nwords);
	  },
	  
	  setDefaultParanoia: function (paranoia) {
	    this._defaultParanoia = paranoia;
	  },
	  
	  /**
	   * Add entropy to the pools.
	   * @param data The entropic value.  Should be a 32-bit integer, array of 32-bit integers, or string
	   * @param {Number} estimatedEntropy The estimated entropy of data, in bits
	   * @param {String} source The source of the entropy, eg "mouse"
	   */
	  addEntropy: function (data, estimatedEntropy, source) {
	    source = source || "user";
	  
	    var id,
	      i, tmp,
	      t = (new Date()).valueOf(),
	      robin = this._robins[source],
	      oldReady = this.isReady(), err = 0;
	      
	    id = this._collectorIds[source];
	    if (id === undefined) { id = this._collectorIds[source] = this._collectorIdNext ++; }
	      
	    if (robin === undefined) { robin = this._robins[source] = 0; }
	    this._robins[source] = ( this._robins[source] + 1 ) % this._pools.length;
	  
	    switch(typeof(data)) {
	      
	    case "number":
	      if (estimatedEntropy === undefined) {
	        estimatedEntropy = 1;
	      }
	      this._pools[robin].update([id,this._eventId++,1,estimatedEntropy,t,1,data|0]);
	      break;
	      
	    case "object":
	      var objName = Object.prototype.toString.call(data);
	      if (objName === "[object Uint32Array]") {
	        tmp = [];
	        for (i = 0; i < data.length; i++) {
	          tmp.push(data[i]);
	        }
	        data = tmp;
	      } else {
	        if (objName !== "[object Array]") {
	          err = 1;
	        }
	        for (i=0; i<data.length && !err; i++) {
	          if (typeof(data[i]) != "number") {
	            err = 1;
	          }
	        }
	      }
	      if (!err) {
	        if (estimatedEntropy === undefined) {
	          /* horrible entropy estimator */
	          estimatedEntropy = 0;
	          for (i=0; i<data.length; i++) {
	            tmp= data[i];
	            while (tmp>0) {
	              estimatedEntropy++;
	              tmp = tmp >>> 1;
	            }
	          }
	        }
	        this._pools[robin].update([id,this._eventId++,2,estimatedEntropy,t,data.length].concat(data));
	      }
	      break;
	      
	    case "string":
	      if (estimatedEntropy === undefined) {
	       /* English text has just over 1 bit per character of entropy.
	        * But this might be HTML or something, and have far less
	        * entropy than English...  Oh well, let's just say one bit.
	        */
	       estimatedEntropy = data.length;
	      }
	      this._pools[robin].update([id,this._eventId++,3,estimatedEntropy,t,data.length]);
	      this._pools[robin].update(data);
	      break;
	      
	    default:
	      err=1;
	    }
	    if (err) {
	      throw new sjcl.exception.bug("random: addEntropy only supports number, array of numbers or string");
	    }
	  
	    /* record the new strength */
	    this._poolEntropy[robin] += estimatedEntropy;
	    this._poolStrength += estimatedEntropy;
	  
	    /* fire off events */
	    if (oldReady === this._NOT_READY) {
	      if (this.isReady() !== this._NOT_READY) {
	        this._fireEvent("seeded", Math.max(this._strength, this._poolStrength));
	      }
	      this._fireEvent("progress", this.getProgress());
	    }
	  },
	  
	  /** Is the generator ready? */
	  isReady: function (paranoia) {
	    var entropyRequired = this._PARANOIA_LEVELS[ (paranoia !== undefined) ? paranoia : this._defaultParanoia ];
	  
	    if (this._strength && this._strength >= entropyRequired) {
	      return (this._poolEntropy[0] > this._BITS_PER_RESEED && (new Date()).valueOf() > this._nextReseed) ?
	        this._REQUIRES_RESEED | this._READY :
	        this._READY;
	    } else {
	      return (this._poolStrength >= entropyRequired) ?
	        this._REQUIRES_RESEED | this._NOT_READY :
	        this._NOT_READY;
	    }
	  },
	  
	  /** Get the generator's progress toward readiness, as a fraction */
	  getProgress: function (paranoia) {
	    var entropyRequired = this._PARANOIA_LEVELS[ paranoia ? paranoia : this._defaultParanoia ];
	  
	    if (this._strength >= entropyRequired) {
	      return 1.0;
	    } else {
	      return (this._poolStrength > entropyRequired) ?
	        1.0 :
	        this._poolStrength / entropyRequired;
	    }
	  },
	  
	  /** start the built-in entropy collectors */
	  startCollectors: function () {
	    if (this._collectorsStarted) { return; }
	  
	    if (window.addEventListener) {
	      window.addEventListener("load", this._loadTimeCollector, false);
	      window.addEventListener("mousemove", this._mouseCollector, false);
	    } else if (document.attachEvent) {
	      document.attachEvent("onload", this._loadTimeCollector);
	      document.attachEvent("onmousemove", this._mouseCollector);
	    }
	    else {
	      throw new sjcl.exception.bug("can't attach event");
	    }
	  
	    this._collectorsStarted = true;
	  },
	  
	  /** stop the built-in entropy collectors */
	  stopCollectors: function () {
	    if (!this._collectorsStarted) { return; }
	  
	    if (window.removeEventListener) {
	      window.removeEventListener("load", this._loadTimeCollector, false);
	      window.removeEventListener("mousemove", this._mouseCollector, false);
	    } else if (window.detachEvent) {
	      window.detachEvent("onload", this._loadTimeCollector);
	      window.detachEvent("onmousemove", this._mouseCollector);
	    }
	    this._collectorsStarted = false;
	  },
	  
	  /* use a cookie to store entropy.
	  useCookie: function (all_cookies) {
	      throw new sjcl.exception.bug("random: useCookie is unimplemented");
	  },*/
	  
	  /** add an event listener for progress or seeded-ness. */
	  addEventListener: function (name, callback) {
	    this._callbacks[name][this._callbackI++] = callback;
	  },
	  
	  /** remove an event listener for progress or seeded-ness */
	  removeEventListener: function (name, cb) {
	    var i, j, cbs=this._callbacks[name], jsTemp=[];
	  
	    /* I'm not sure if this is necessary; in C++, iterating over a
	     * collection and modifying it at the same time is a no-no.
	     */
	  
	    for (j in cbs) {
		if (cbs.hasOwnProperty(j) && cbs[j] === cb) {
	        jsTemp.push(j);
	      }
	    }
	  
	    for (i=0; i<jsTemp.length; i++) {
	      j = jsTemp[i];
	      delete cbs[j];
	    }
	  },
	  
	  /** Generate 4 random words, no reseed, no gate.
	   * @private
	   */
	  _gen4words: function () {
	    for (var i=0; i<4; i++) {
	      this._counter[i] = this._counter[i]+1 | 0;
	      if (this._counter[i]) { break; }
	    }
	    return this._cipher.encrypt(this._counter);
	  },
	  
	  /* Rekey the AES instance with itself after a request, or every _MAX_WORDS_PER_BURST words.
	   * @private
	   */
	  _gate: function () {
	    this._key = this._gen4words().concat(this._gen4words());
	    this._cipher = new sjcl.cipher.aes(this._key);
	  },
	  
	  /** Reseed the generator with the given words
	   * @private
	   */
	  _reseed: function (seedWords) {
	    this._key = sjcl.hash.sha256.hash(this._key.concat(seedWords));
	    this._cipher = new sjcl.cipher.aes(this._key);
	    for (var i=0; i<4; i++) {
	      this._counter[i] = this._counter[i]+1 | 0;
	      if (this._counter[i]) { break; }
	    }
	  },
	  
	  /** reseed the data from the entropy pools
	   * @param full If set, use all the entropy pools in the reseed.
	   */
	  _reseedFromPools: function (full) {
	    var reseedData = [], strength = 0, i;
	  
	    this._nextReseed = reseedData[0] =
	      (new Date()).valueOf() + this._MILLISECONDS_PER_RESEED;
	    
	    for (i=0; i<16; i++) {
	      /* On some browsers, this is cryptographically random.  So we might
	       * as well toss it in the pot and stir...
	       */
	      reseedData.push(Math.random()*0x100000000|0);
	    }
	    
	    for (i=0; i<this._pools.length; i++) {
	     reseedData = reseedData.concat(this._pools[i].finalize());
	     strength += this._poolEntropy[i];
	     this._poolEntropy[i] = 0;
	   
	     if (!full && (this._reseedCount & (1<<i))) { break; }
	    }
	  
	    /* if we used the last pool, push a new one onto the stack */
	    if (this._reseedCount >= 1 << this._pools.length) {
	     this._pools.push(new sjcl.hash.sha256());
	     this._poolEntropy.push(0);
	    }
	  
	    /* how strong was this reseed? */
	    this._poolStrength -= strength;
	    if (strength > this._strength) {
	      this._strength = strength;
	    }
	  
	    this._reseedCount ++;
	    this._reseed(reseedData);
	  },
	  
	  _mouseCollector: function (ev) {
	    var x = ev.x || ev.clientX || ev.offsetX || 0, y = ev.y || ev.clientY || ev.offsetY || 0;
	    sjcl.random.addEntropy([x,y], 2, "mouse");
	  },
	  
	  _loadTimeCollector: function (ev) {
	    sjcl.random.addEntropy((new Date()).valueOf(), 2, "loadtime");
	  },
	  
	  _fireEvent: function (name, arg) {
	    var j, cbs=sjcl.random._callbacks[name], cbsTemp=[];
	    /* TODO: there is a race condition between removing collectors and firing them */ 

	    /* I'm not sure if this is necessary; in C++, iterating over a
	     * collection and modifying it at the same time is a no-no.
	     */
	  
	    for (j in cbs) {
	     if (cbs.hasOwnProperty(j)) {
	        cbsTemp.push(cbs[j]);
	     }
	    }
	  
	    for (j=0; j<cbsTemp.length; j++) {
	     cbsTemp[j](arg);
	    }
	  }
	};

	sjcl.random = new sjcl.prng(6);

	(function(){
	  try {
	    // get cryptographically strong entropy in Webkit
	    var ab = new Uint32Array(32);
	    crypto.getRandomValues(ab);
	    sjcl.random.addEntropy(ab, 1024, "crypto.getRandomValues");
	  } catch (e) {
	    // no getRandomValues :-(
	  }
	})();

	/** @fileOverview Convenince functions centered around JSON encapsulation.
	 *
	 * @author Emily Stark
	 * @author Mike Hamburg
	 * @author Dan Boneh
	 */
	 
	 /** @namespace JSON encapsulation */
	 sjcl.json = {
	  /** Default values for encryption */
	  defaults: { v:1, iter:1000, ks:128, ts:64, mode:"ccm", adata:"", cipher:"aes" },

	  /** Simple encryption function.
	   * @param {String|bitArray} password The password or key.
	   * @param {String} plaintext The data to encrypt.
	   * @param {Object} [params] The parameters including tag, iv and salt.
	   * @param {Object} [rp] A returned version with filled-in parameters.
	   * @return {String} The ciphertext.
	   * @throws {sjcl.exception.invalid} if a parameter is invalid.
	   */
	  encrypt: function (password, plaintext, params, rp) {
	    params = params || {};
	    rp = rp || {};
	    
	    var j = sjcl.json, p = j._add({ iv: sjcl.random.randomWords(4,0) },
	                                  j.defaults), tmp, prp, adata;
	    j._add(p, params);
	    adata = p.adata;
	    if (typeof p.salt === "string") {
	      p.salt = sjcl.codec.base64.toBits(p.salt);
	    }
	    if (typeof p.iv === "string") {
	      p.iv = sjcl.codec.base64.toBits(p.iv);
	    }
	    
	    if (!sjcl.mode[p.mode] ||
	        !sjcl.cipher[p.cipher] ||
	        (typeof password === "string" && p.iter <= 100) ||
	        (p.ts !== 64 && p.ts !== 96 && p.ts !== 128) ||
	        (p.ks !== 128 && p.ks !== 192 && p.ks !== 256) ||
	        (p.iv.length < 2 || p.iv.length > 4)) {
	      throw new sjcl.exception.invalid("json encrypt: invalid parameters");
	    }
	    
	    if (typeof password === "string") {
	      tmp = sjcl.misc.cachedPbkdf2(password, p);
	      password = tmp.key.slice(0,p.ks/32);
	      p.salt = tmp.salt;
	    } else if (sjcl.ecc && password instanceof sjcl.ecc.elGamal.publicKey) {
	      tmp = password.kem();
	      p.kemtag = tmp.tag;
	      password = tmp.key.slice(0,p.ks/32);
	    }
	    if (typeof plaintext === "string") {
	      plaintext = sjcl.codec.utf8String.toBits(plaintext);
	    }
	    if (typeof adata === "string") {
	      adata = sjcl.codec.utf8String.toBits(adata);
	    }
	    prp = new sjcl.cipher[p.cipher](password);
	    
	    /* return the json data */
	    j._add(rp, p);
	    rp.key = password;
	    
	    /* do the encryption */
	    p.ct = sjcl.mode[p.mode].encrypt(prp, plaintext, p.iv, adata, p.ts);
	    
	    //return j.encode(j._subtract(p, j.defaults));
	    return j.encode(p);
	  },
	  
	  /** Simple decryption function.
	   * @param {String|bitArray} password The password or key.
	   * @param {String} ciphertext The ciphertext to decrypt.
	   * @param {Object} [params] Additional non-default parameters.
	   * @param {Object} [rp] A returned object with filled parameters.
	   * @return {String} The plaintext.
	   * @throws {sjcl.exception.invalid} if a parameter is invalid.
	   * @throws {sjcl.exception.corrupt} if the ciphertext is corrupt.
	   */
	  decrypt: function (password, ciphertext, params, rp) {
	    params = params || {};
	    rp = rp || {};
	    
	    var j = sjcl.json, p = j._add(j._add(j._add({},j.defaults),j.decode(ciphertext)), params, true), ct, tmp, prp, adata=p.adata;
	    if (typeof p.salt === "string") {
	      p.salt = sjcl.codec.base64.toBits(p.salt);
	    }
	    if (typeof p.iv === "string") {
	      p.iv = sjcl.codec.base64.toBits(p.iv);
	    }
	    
	    if (!sjcl.mode[p.mode] ||
	        !sjcl.cipher[p.cipher] ||
	        (typeof password === "string" && p.iter <= 100) ||
	        (p.ts !== 64 && p.ts !== 96 && p.ts !== 128) ||
	        (p.ks !== 128 && p.ks !== 192 && p.ks !== 256) ||
	        (!p.iv) ||
	        (p.iv.length < 2 || p.iv.length > 4)) {
	      throw new sjcl.exception.invalid("json decrypt: invalid parameters");
	    }
	    
	    if (typeof password === "string") {
	      tmp = sjcl.misc.cachedPbkdf2(password, p);
	      password = tmp.key.slice(0,p.ks/32);
	      p.salt  = tmp.salt;
	    } else if (sjcl.ecc && password instanceof sjcl.ecc.elGamal.secretKey) {
	      password = password.unkem(sjcl.codec.base64.toBits(p.kemtag)).slice(0,p.ks/32);
	    }
	    if (typeof adata === "string") {
	      adata = sjcl.codec.utf8String.toBits(adata);
	    }
	    prp = new sjcl.cipher[p.cipher](password);
	    
	    /* do the decryption */
	    ct = sjcl.mode[p.mode].decrypt(prp, p.ct, p.iv, adata, p.ts);
	    
	    /* return the json data */
	    j._add(rp, p);
	    rp.key = password;
	    
	    return sjcl.codec.utf8String.fromBits(ct);
	  },
	  
	  /** Encode a flat structure into a JSON string.
	   * @param {Object} obj The structure to encode.
	   * @return {String} A JSON string.
	   * @throws {sjcl.exception.invalid} if obj has a non-alphanumeric property.
	   * @throws {sjcl.exception.bug} if a parameter has an unsupported type.
	   */
	  encode: function (obj) {
	    var i, out='{', comma='';
	    for (i in obj) {
	      if (obj.hasOwnProperty(i)) {
	        if (!i.match(/^[a-z0-9]+$/i)) {
	          throw new sjcl.exception.invalid("json encode: invalid property name");
	        }
	        out += comma + '"' + i + '":';
	        comma = ',';
	        
	        switch (typeof obj[i]) {
	        case 'number':
	        case 'boolean':
	          out += obj[i];
	          break;
	          
	        case 'string':
	          out += '"' + escape(obj[i]) + '"';
	          break;
	        
	        case 'object':
	          out += '"' + sjcl.codec.base64.fromBits(obj[i],0) + '"';
	          break;
	        
	        default:
	          throw new sjcl.exception.bug("json encode: unsupported type");
	        }
	      }
	    }
	    return out+'}';
	  },
	  
	  /** Decode a simple (flat) JSON string into a structure.  The ciphertext,
	   * adata, salt and iv will be base64-decoded.
	   * @param {String} str The string.
	   * @return {Object} The decoded structure.
	   * @throws {sjcl.exception.invalid} if str isn't (simple) JSON.
	   */
	  decode: function (str) {
	    str = str.replace(/\s/g,'');
	    if (!str.match(/^\{.*\}$/)) { 
	      throw new sjcl.exception.invalid("json decode: this isn't json!");
	    }
	    var a = str.replace(/^\{|\}$/g, '').split(/,/), out={}, i, m;
	    for (i=0; i<a.length; i++) {
	      if (!(m=a[i].match(/^(?:(["']?)([a-z][a-z0-9]*)\1):(?:(\d+)|"([a-z0-9+\/%*_.@=\-]*)")$/i))) {
	        throw new sjcl.exception.invalid("json decode: this isn't json!");
	      }
	      if (m[3]) {
	        out[m[2]] = parseInt(m[3],10);
	      } else {
	        out[m[2]] = m[2].match(/^(ct|salt|iv)$/) ? sjcl.codec.base64.toBits(m[4]) : unescape(m[4]);
	      }
	    }
	    return out;
	  },
	  
	  /** Insert all elements of src into target, modifying and returning target.
	   * @param {Object} target The object to be modified.
	   * @param {Object} src The object to pull data from.
	   * @param {boolean} [requireSame=false] If true, throw an exception if any field of target differs from corresponding field of src.
	   * @return {Object} target.
	   * @private
	   */
	  _add: function (target, src, requireSame) {
	    if (target === undefined) { target = {}; }
	    if (src === undefined) { return target; }
	    var i;
	    for (i in src) {
	      if (src.hasOwnProperty(i)) {
	        if (requireSame && target[i] !== undefined && target[i] !== src[i]) {
	          throw new sjcl.exception.invalid("required parameter overridden");
	        }
	        target[i] = src[i];
	      }
	    }
	    return target;
	  },
	  
	  /** Remove all elements of minus from plus.  Does not modify plus.
	   * @private
	   */
	  _subtract: function (plus, minus) {
	    var out = {}, i;
	    
	    for (i in plus) {
	      if (plus.hasOwnProperty(i) && plus[i] !== minus[i]) {
	        out[i] = plus[i];
	      }
	    }
	    
	    return out;
	  },
	  
	  /** Return only the specified elements of src.
	   * @private
	   */
	  _filter: function (src, filter) {
	    var out = {}, i;
	    for (i=0; i<filter.length; i++) {
	      if (src[filter[i]] !== undefined) {
	        out[filter[i]] = src[filter[i]];
	      }
	    }
	    return out;
	  }
	};

	/** Simple encryption function; convenient shorthand for sjcl.json.encrypt.
	 * @param {String|bitArray} password The password or key.
	 * @param {String} plaintext The data to encrypt.
	 * @param {Object} [params] The parameters including tag, iv and salt.
	 * @param {Object} [rp] A returned version with filled-in parameters.
	 * @return {String} The ciphertext.
	 */
	sjcl.encrypt = sjcl.json.encrypt;

	/** Simple decryption function; convenient shorthand for sjcl.json.decrypt.
	 * @param {String|bitArray} password The password or key.
	 * @param {String} ciphertext The ciphertext to decrypt.
	 * @param {Object} [params] Additional non-default parameters.
	 * @param {Object} [rp] A returned object with filled parameters.
	 * @return {String} The plaintext.
	 */
	sjcl.decrypt = sjcl.json.decrypt;

	/** The cache for cachedPbkdf2.
	 * @private
	 */
	sjcl.misc._pbkdf2Cache = {};

	/** Cached PBKDF2 key derivation.
	 * @param {String} password The password.
	 * @param {Object} [params] The derivation params (iteration count and optional salt).
	 * @return {Object} The derived data in key, the salt in salt.
	 */
	sjcl.misc.cachedPbkdf2 = function (password, obj) {
	  var cache = sjcl.misc._pbkdf2Cache, c, cp, str, salt, iter;
	  
	  obj = obj || {};
	  iter = obj.iter || 1000;
	  
	  /* open the cache for this password and iteration count */
	  cp = cache[password] = cache[password] || {};
	  c = cp[iter] = cp[iter] || { firstSalt: (obj.salt && obj.salt.length) ?
	                     obj.salt.slice(0) : sjcl.random.randomWords(2,0) };
	          
	  salt = (obj.salt === undefined) ? c.firstSalt : obj.salt;
	  
	  c[salt] = c[salt] || sjcl.misc.pbkdf2(password, salt, obj.iter);
	  return { key: c[salt].slice(0), salt:salt.slice(0) };
	};



	/**
	 * @constructor
	 * Constructs a new bignum from another bignum, a number or a hex string.
	 */
	sjcl.bn = function(it) {
	  this.initWith(it);
	};

	sjcl.bn.prototype = {
	  radix: 24,
	  maxMul: 8,
	  _class: sjcl.bn,
	  
	  copy: function() {
	    return new this._class(this);
	  },

	  /**
	   * Initializes this with it, either as a bn, a number, or a hex string.
	   */
	  initWith: function(it) {
	    var i=0, k, n, l;
	    switch(typeof it) {
	    case "object":
	      this.limbs = it.limbs.slice(0);
	      break;
	      
	    case "number":
	      this.limbs = [it];
	      this.normalize();
	      break;
	      
	    case "string":
	      it = it.replace(/^0x/, '');
	      this.limbs = [];
	      // hack
	      k = this.radix / 4;
	      for (i=0; i < it.length; i+=k) {
	        this.limbs.push(parseInt(it.substring(Math.max(it.length - i - k, 0), it.length - i),16));
	      }
	      break;

	    default:
	      this.limbs = [0];
	    }
	    return this;
	  },

	  /**
	   * Returns true if "this" and "that" are equal.  Calls fullReduce().
	   * Equality test is in constant time.
	   */
	  equals: function(that) {
	    if (typeof that === "number") { that = new this._class(that); }
	    var difference = 0, i;
	    this.fullReduce();
	    that.fullReduce();
	    for (i = 0; i < this.limbs.length || i < that.limbs.length; i++) {
	      difference |= this.getLimb(i) ^ that.getLimb(i);
	    }
	    return (difference === 0);
	  },
	  
	  /**
	   * Get the i'th limb of this, zero if i is too large.
	   */
	  getLimb: function(i) {
	    return (i >= this.limbs.length) ? 0 : this.limbs[i];
	  },
	  
	  /**
	   * Constant time comparison function.
	   * Returns 1 if this >= that, or zero otherwise.
	   */
	  greaterEquals: function(that) {
	    if (typeof that === "number") { that = new this._class(that); }
	    var less = 0, greater = 0, i, a, b;
	    i = Math.max(this.limbs.length, that.limbs.length) - 1;
	    for (; i>= 0; i--) {
	      a = this.getLimb(i);
	      b = that.getLimb(i);
	      greater |= (b - a) & ~less;
	      less |= (a - b) & ~greater;
	    }
	    return (greater | ~less) >>> 31;
	  },
	  
	  /**
	   * Convert to a hex string.
	   */
	  toString: function() {
	    this.fullReduce();
	    var out="", i, s, l = this.limbs;
	    for (i=0; i < this.limbs.length; i++) {
	      s = l[i].toString(16);
	      while (i < this.limbs.length - 1 && s.length < 6) {
	        s = "0" + s;
	      }
	      out = s + out;
	    }
	    return "0x"+out;
	  },
	  
	  /** this += that.  Does not normalize. */
	  addM: function(that) {
	    if (typeof(that) !== "object") { that = new this._class(that); }
	    var i, l=this.limbs, ll=that.limbs;
	    for (i=l.length; i<ll.length; i++) {
	      l[i] = 0;
	    }
	    for (i=0; i<ll.length; i++) {
	      l[i] += ll[i];
	    }
	    return this;
	  },
	  
	  /** this *= 2.  Requires normalized; ends up normalized. */
	  doubleM: function() {
	    var i, carry=0, tmp, r=this.radix, m=this.radixMask, l=this.limbs;
	    for (i=0; i<l.length; i++) {
	      tmp = l[i];
	      tmp = tmp+tmp+carry;
	      l[i] = tmp & m;
	      carry = tmp >> r;
	    }
	    if (carry) {
	      l.push(carry);
	    }
	    return this;
	  },
	  
	  /** this /= 2, rounded down.  Requires normalized; ends up normalized. */
	  halveM: function() {
	    var i, carry=0, tmp, r=this.radix, l=this.limbs;
	    for (i=l.length-1; i>=0; i--) {
	      tmp = l[i];
	      l[i] = (tmp+carry)>>1;
	      carry = (tmp&1) << r;
	    }
	    if (!l[l.length-1]) {
	      l.pop();
	    }
	    return this;
	  },

	  /** this -= that.  Does not normalize. */
	  subM: function(that) {
	    if (typeof(that) !== "object") { that = new this._class(that); }
	    var i, l=this.limbs, ll=that.limbs;
	    for (i=l.length; i<ll.length; i++) {
	      l[i] = 0;
	    }
	    for (i=0; i<ll.length; i++) {
	      l[i] -= ll[i];
	    }
	    return this;
	  },
	  
	  mod: function(that) {
	    var neg = !this.greaterEquals(new sjcl.bn(0));
	    
	    that = new sjcl.bn(that).normalize(); // copy before we begin
	    var out = new sjcl.bn(this).normalize(), ci=0;
	    
	    if (neg) out = (new sjcl.bn(0)).subM(out).normalize();
	    
	    for (; out.greaterEquals(that); ci++) {
	      that.doubleM();
	    }
	    
	    if (neg) out = that.sub(out).normalize();
	    
	    for (; ci > 0; ci--) {
	      that.halveM();
	      if (out.greaterEquals(that)) {
	        out.subM(that).normalize();
	      }
	    }
	    return out.trim();
	  },
	  
	  /** return inverse mod prime p.  p must be odd. Binary extended Euclidean algorithm mod p. */
	  inverseMod: function(p) {
	    var a = new sjcl.bn(1), b = new sjcl.bn(0), x = new sjcl.bn(this), y = new sjcl.bn(p), tmp, i, nz=1;
	    
	    if (!(p.limbs[0] & 1)) {
	      throw (new sjcl.exception.invalid("inverseMod: p must be odd"));
	    }
	    
	    // invariant: y is odd
	    do {
	      if (x.limbs[0] & 1) {
	        if (!x.greaterEquals(y)) {
	          // x < y; swap everything
	          tmp = x; x = y; y = tmp;
	          tmp = a; a = b; b = tmp;
	        }
	        x.subM(y);
	        x.normalize();
	        
	        if (!a.greaterEquals(b)) {
	          a.addM(p);
	        }
	        a.subM(b);
	      }
	      
	      // cut everything in half
	      x.halveM();
	      if (a.limbs[0] & 1) {
	        a.addM(p);
	      }
	      a.normalize();
	      a.halveM();
	      
	      // check for termination: x ?= 0
	      for (i=nz=0; i<x.limbs.length; i++) {
	        nz |= x.limbs[i];
	      }
	    } while(nz);
	    
	    if (!y.equals(1)) {
	      throw (new sjcl.exception.invalid("inverseMod: p and x must be relatively prime"));
	    }
	    
	    return b;
	  },
	  
	  /** this + that.  Does not normalize. */
	  add: function(that) {
	    return this.copy().addM(that);
	  },

	  /** this - that.  Does not normalize. */
	  sub: function(that) {
	    return this.copy().subM(that);
	  },
	  
	  /** this * that.  Normalizes and reduces. */
	  mul: function(that) {
	    if (typeof(that) === "number") { that = new this._class(that); }
	    var i, j, a = this.limbs, b = that.limbs, al = a.length, bl = b.length, out = new this._class(), c = out.limbs, ai, ii=this.maxMul;

	    for (i=0; i < this.limbs.length + that.limbs.length + 1; i++) {
	      c[i] = 0;
	    }
	    for (i=0; i<al; i++) {
	      ai = a[i];
	      for (j=0; j<bl; j++) {
	        c[i+j] += ai * b[j];
	      }
	     
	      if (!--ii) {
	        ii = this.maxMul;
	        out.cnormalize();
	      }
	    }
	    return out.cnormalize().reduce();
	  },

	  /** this ^ 2.  Normalizes and reduces. */
	  square: function() {
	    return this.mul(this);
	  },

	  /** this ^ n.  Uses square-and-multiply.  Normalizes and reduces. */
	  power: function(l) {
	    if (typeof(l) === "number") {
	      l = [l];
	    } else if (l.limbs !== undefined) {
	      l = l.normalize().limbs;
	    }
	    var i, j, out = new this._class(1), pow = this;

	    for (i=0; i<l.length; i++) {
	      for (j=0; j<this.radix; j++) {
	        if (l[i] & (1<<j)) {
	          out = out.mul(pow);
	        }
	        pow = pow.square();
	      }
	    }
	    
	    return out;
	  },

	  /** this * that mod N */
	  mulmod: function(that, N) {
	    return this.mod(N).mul(that.mod(N)).mod(N);
	  },

	  /** this ^ x mod N */
	  powermod: function(x, N) {
	    var result = new sjcl.bn(1), a = new sjcl.bn(this), k = new sjcl.bn(x);
	    while (true) {
	      if (k.limbs[0] & 1) { result = result.mulmod(a, N); }
	      k.halveM();
	      if (k.equals(0)) { break; }
	      a = a.mulmod(a, N);
	    }
	    return result.normalize().reduce();
	  },

	  trim: function() {
	    var l = this.limbs, p;
	    do {
	      p = l.pop();
	    } while (l.length && p === 0);
	    l.push(p);
	    return this;
	  },
	  
	  /** Reduce mod a modulus.  Stubbed for subclassing. */
	  reduce: function() {
	    return this;
	  },

	  /** Reduce and normalize. */
	  fullReduce: function() {
	    return this.normalize();
	  },
	  
	  /** Propagate carries. */
	  normalize: function() {
	    var carry=0, i, pv = this.placeVal, ipv = this.ipv, l, m, limbs = this.limbs, ll = limbs.length, mask = this.radixMask;
	    for (i=0; i < ll || (carry !== 0 && carry !== -1); i++) {
	      l = (limbs[i]||0) + carry;
	      m = limbs[i] = l & mask;
	      carry = (l-m)*ipv;
	    }
	    if (carry === -1) {
	      limbs[i-1] -= this.placeVal;
	    }
	    return this;
	  },

	  /** Constant-time normalize. Does not allocate additional space. */
	  cnormalize: function() {
	    var carry=0, i, ipv = this.ipv, l, m, limbs = this.limbs, ll = limbs.length, mask = this.radixMask;
	    for (i=0; i < ll-1; i++) {
	      l = limbs[i] + carry;
	      m = limbs[i] = l & mask;
	      carry = (l-m)*ipv;
	    }
	    limbs[i] += carry;
	    return this;
	  },
	  
	  /** Serialize to a bit array */
	  toBits: function(len) {
	    this.fullReduce();
	    len = len || this.exponent || this.bitLength();
	    var i = Math.floor((len-1)/24), w=sjcl.bitArray, e = (len + 7 & -8) % this.radix || this.radix,
	        out = [w.partial(e, this.getLimb(i))];
	    for (i--; i >= 0; i--) {
	      out = w.concat(out, [w.partial(Math.min(this.radix,len), this.getLimb(i))]);
	      len -= this.radix;
	    }
	    return out;
	  },
	  
	  /** Return the length in bits, rounded up to the nearest byte. */
	  bitLength: function() {
	    this.fullReduce();
	    var out = this.radix * (this.limbs.length - 1),
	        b = this.limbs[this.limbs.length - 1];
	    for (; b; b >>>= 1) {
	      out ++;
	    }
	    return out+7 & -8;
	  }
	};

	/** @this { sjcl.bn } */
	sjcl.bn.fromBits = function(bits) {
	  var Class = this, out = new Class(), words=[], w=sjcl.bitArray, t = this.prototype,
	      l = Math.min(this.bitLength || 0x100000000, w.bitLength(bits)), e = l % t.radix || t.radix;
	  
	  words[0] = w.extract(bits, 0, e);
	  for (; e < l; e += t.radix) {
	    words.unshift(w.extract(bits, e, t.radix));
	  }

	  out.limbs = words;
	  return out;
	};



	sjcl.bn.prototype.ipv = 1 / (sjcl.bn.prototype.placeVal = Math.pow(2,sjcl.bn.prototype.radix));
	sjcl.bn.prototype.radixMask = (1 << sjcl.bn.prototype.radix) - 1;

	/**
	 * Creates a new subclass of bn, based on reduction modulo a pseudo-Mersenne prime,
	 * i.e. a prime of the form 2^e + sum(a * 2^b),where the sum is negative and sparse.
	 */
	sjcl.bn.pseudoMersennePrime = function(exponent, coeff) {
	  /** @constructor */
	  function p(it) {
	    this.initWith(it);
	    /*if (this.limbs[this.modOffset]) {
	      this.reduce();
	    }*/
	  }

	  var ppr = p.prototype = new sjcl.bn(), i, tmp, mo;
	  mo = ppr.modOffset = Math.ceil(tmp = exponent / ppr.radix);
	  ppr.exponent = exponent;
	  ppr.offset = [];
	  ppr.factor = [];
	  ppr.minOffset = mo;
	  ppr.fullMask = 0;
	  ppr.fullOffset = [];
	  ppr.fullFactor = [];
	  ppr.modulus = p.modulus = new sjcl.bn(Math.pow(2,exponent));
	  
	  ppr.fullMask = 0|-Math.pow(2, exponent % ppr.radix);

	  for (i=0; i<coeff.length; i++) {
	    ppr.offset[i] = Math.floor(coeff[i][0] / ppr.radix - tmp);
	    ppr.fullOffset[i] = Math.ceil(coeff[i][0] / ppr.radix - tmp);
	    ppr.factor[i] = coeff[i][1] * Math.pow(1/2, exponent - coeff[i][0] + ppr.offset[i] * ppr.radix);
	    ppr.fullFactor[i] = coeff[i][1] * Math.pow(1/2, exponent - coeff[i][0] + ppr.fullOffset[i] * ppr.radix);
	    ppr.modulus.addM(new sjcl.bn(Math.pow(2,coeff[i][0])*coeff[i][1]));
	    ppr.minOffset = Math.min(ppr.minOffset, -ppr.offset[i]); // conservative
	  }
	  ppr._class = p;
	  ppr.modulus.cnormalize();

	  /** Approximate reduction mod p.  May leave a number which is negative or slightly larger than p.
	   * @this {sjcl.bn}
	   */
	  ppr.reduce = function() {
	    var i, k, l, mo = this.modOffset, limbs = this.limbs, aff, off = this.offset, ol = this.offset.length, fac = this.factor, ll;

	    i = this.minOffset;
	    while (limbs.length > mo) {
	      l = limbs.pop();
	      ll = limbs.length;
	      for (k=0; k<ol; k++) {
	        limbs[ll+off[k]] -= fac[k] * l;
	      }
	      
	      i--;
	      if (!i) {
	        limbs.push(0);
	        this.cnormalize();
	        i = this.minOffset;
	      }
	    }
	    this.cnormalize();

	    return this;
	  };
	  
	  /** @this {sjcl.bn} */
	  ppr._strongReduce = (ppr.fullMask === -1) ? ppr.reduce : function() {
	    var limbs = this.limbs, i = limbs.length - 1, k, l;
	    this.reduce();
	    if (i === this.modOffset - 1) {
	      l = limbs[i] & this.fullMask;
	      limbs[i] -= l;
	      for (k=0; k<this.fullOffset.length; k++) {
	        limbs[i+this.fullOffset[k]] -= this.fullFactor[k] * l;
	      }
	      this.normalize();
	    }
	  };

	  /** mostly constant-time, very expensive full reduction.
	   * @this {sjcl.bn}
	   */
	  ppr.fullReduce = function() {
	    var greater, i;
	    // massively above the modulus, may be negative
	    
	    this._strongReduce();
	    // less than twice the modulus, may be negative

	    this.addM(this.modulus);
	    this.addM(this.modulus);
	    this.normalize();
	    // probably 2-3x the modulus
	    
	    this._strongReduce();
	    // less than the power of 2.  still may be more than
	    // the modulus

	    // HACK: pad out to this length
	    for (i=this.limbs.length; i<this.modOffset; i++) {
	      this.limbs[i] = 0;
	    }
	    
	    // constant-time subtract modulus
	    greater = this.greaterEquals(this.modulus);
	    for (i=0; i<this.limbs.length; i++) {
	      this.limbs[i] -= this.modulus.limbs[i] * greater;
	    }
	    this.cnormalize();

	    return this;
	  };


	  /** @this {sjcl.bn} */
	  ppr.inverse = function() {
	    return (this.power(this.modulus.sub(2)));
	  };

	  p.fromBits = sjcl.bn.fromBits;

	  return p;
	};

	// a small Mersenne prime
	sjcl.bn.prime = {
	  p127: sjcl.bn.pseudoMersennePrime(127, [[0,-1]]),

	  // Bernstein's prime for Curve25519
	  p25519: sjcl.bn.pseudoMersennePrime(255, [[0,-19]]),

	  // NIST primes
	  p192: sjcl.bn.pseudoMersennePrime(192, [[0,-1],[64,-1]]),
	  p224: sjcl.bn.pseudoMersennePrime(224, [[0,1],[96,-1]]),
	  p256: sjcl.bn.pseudoMersennePrime(256, [[0,-1],[96,1],[192,1],[224,-1]]),
	  p384: sjcl.bn.pseudoMersennePrime(384, [[0,-1],[32,1],[96,-1],[128,-1]]),
	  p521: sjcl.bn.pseudoMersennePrime(521, [[0,-1]])
	};

	sjcl.bn.random = function(modulus, paranoia) {
	  if (typeof modulus !== "object") { modulus = new sjcl.bn(modulus); }
	  var words, i, l = modulus.limbs.length, m = modulus.limbs[l-1]+1, out = new sjcl.bn();
	  while (true) {
	    // get a sequence whose first digits make sense
	    do {
	      words = sjcl.random.randomWords(l, paranoia);
	      if (words[l-1] < 0) { words[l-1] += 0x100000000; }
	    } while (Math.floor(words[l-1] / m) === Math.floor(0x100000000 / m));
	    words[l-1] %= m;

	    // mask off all the limbs
	    for (i=0; i<l-1; i++) {
	      words[i] &= modulus.radixMask;
	    }

	    // check the rest of the digitssj
	    out.limbs = words;
	    if (!out.greaterEquals(modulus)) {
	      return out;
	    }
	  }
	};


	sjcl.ecc = {};

	/**
	 * Represents a point on a curve in affine coordinates.
	 * @constructor
	 * @param {sjcl.ecc.curve} curve The curve that this point lies on.
	 * @param {bigInt} x The x coordinate.
	 * @param {bigInt} y The y coordinate.
	 */
	sjcl.ecc.point = function(curve,x,y) {
	  if (x === undefined) {
	    this.isIdentity = true;
	  } else {
	    this.x = x;
	    this.y = y;
	    this.isIdentity = false;
	  }
	  this.curve = curve;
	};



	sjcl.ecc.point.prototype = {
	  toJac: function() {
	    return new sjcl.ecc.pointJac(this.curve, this.x, this.y, new this.curve.field(1));
	  },

	  mult: function(k) {
	    return this.toJac().mult(k, this).toAffine();
	  },
	  
	  /**
	   * Multiply this point by k, added to affine2*k2, and return the answer in Jacobian coordinates.
	   * @param {bigInt} k The coefficient to multiply this by.
	   * @param {bigInt} k2 The coefficient to multiply affine2 this by.
	   * @param {sjcl.ecc.point} affine The other point in affine coordinates.
	   * @return {sjcl.ecc.pointJac} The result of the multiplication and addition, in Jacobian coordinates.
	   */
	  mult2: function(k, k2, affine2) {
	    return this.toJac().mult2(k, this, k2, affine2).toAffine();
	  },
	  
	  multiples: function() {
	    var m, i, j;
	    if (this._multiples === undefined) {
	      j = this.toJac().doubl();
	      m = this._multiples = [new sjcl.ecc.point(this.curve), this, j.toAffine()];
	      for (i=3; i<16; i++) {
	        j = j.add(this);
	        m.push(j.toAffine());
	      }
	    }
	    return this._multiples;
	  },

	  isValid: function() {
	    return this.y.square().equals(this.curve.b.add(this.x.mul(this.curve.a.add(this.x.square()))));
	  },

	  toBits: function() {
	    return sjcl.bitArray.concat(this.x.toBits(), this.y.toBits());
	  }
	};

	/**
	 * Represents a point on a curve in Jacobian coordinates. Coordinates can be specified as bigInts or strings (which
	 * will be converted to bigInts).
	 *
	 * @constructor
	 * @param {bigInt/string} x The x coordinate.
	 * @param {bigInt/string} y The y coordinate.
	 * @param {bigInt/string} z The z coordinate.
	 * @param {sjcl.ecc.curve} curve The curve that this point lies on.
	 */
	sjcl.ecc.pointJac = function(curve, x, y, z) {
	  if (x === undefined) {
	    this.isIdentity = true;
	  } else {
	    this.x = x;
	    this.y = y;
	    this.z = z;
	    this.isIdentity = false;
	  }
	  this.curve = curve;
	};

	sjcl.ecc.pointJac.prototype = {
	  /**
	   * Adds S and T and returns the result in Jacobian coordinates. Note that S must be in Jacobian coordinates and T must be in affine coordinates.
	   * @param {sjcl.ecc.pointJac} S One of the points to add, in Jacobian coordinates.
	   * @param {sjcl.ecc.point} T The other point to add, in affine coordinates.
	   * @return {sjcl.ecc.pointJac} The sum of the two points, in Jacobian coordinates. 
	   */
	  add: function(T) {
	    var S = this, sz2, c, d, c2, x1, x2, x, y1, y2, y, z;
	    if (S.curve !== T.curve) {
	      throw("sjcl.ecc.add(): Points must be on the same curve to add them!");
	    }

	    if (S.isIdentity) {
	      return T.toJac();
	    } else if (T.isIdentity) {
	      return S;
	    }

	    sz2 = S.z.square();
	    c = T.x.mul(sz2).subM(S.x);

	    if (c.equals(0)) {
	      if (S.y.equals(T.y.mul(sz2.mul(S.z)))) {
	        // same point
	        return S.doubl();
	      } else {
	        // inverses
	        return new sjcl.ecc.pointJac(S.curve);
	      }
	    }
	    
	    d = T.y.mul(sz2.mul(S.z)).subM(S.y);
	    c2 = c.square();

	    x1 = d.square();
	    x2 = c.square().mul(c).addM( S.x.add(S.x).mul(c2) );
	    x  = x1.subM(x2);

	    y1 = S.x.mul(c2).subM(x).mul(d);
	    y2 = S.y.mul(c.square().mul(c));
	    y  = y1.subM(y2);

	    z  = S.z.mul(c);

	    return new sjcl.ecc.pointJac(this.curve,x,y,z);
	  },
	  
	  /**
	   * doubles this point.
	   * @return {sjcl.ecc.pointJac} The doubled point.
	   */
	  doubl: function() {
	    if (this.isIdentity) { return this; }

	    var
	      y2 = this.y.square(),
	      a  = y2.mul(this.x.mul(4)),
	      b  = y2.square().mul(8),
	      z2 = this.z.square(),
	      c  = this.x.sub(z2).mul(3).mul(this.x.add(z2)),
	      x  = c.square().subM(a).subM(a),
	      y  = a.sub(x).mul(c).subM(b),
	      z  = this.y.add(this.y).mul(this.z);
	    return new sjcl.ecc.pointJac(this.curve, x, y, z);
	  },

	  /**
	   * Returns a copy of this point converted to affine coordinates.
	   * @return {sjcl.ecc.point} The converted point.
	   */  
	  toAffine: function() {
	    if (this.isIdentity || this.z.equals(0)) {
	      return new sjcl.ecc.point(this.curve);
	    }
	    var zi = this.z.inverse(), zi2 = zi.square();
	    return new sjcl.ecc.point(this.curve, this.x.mul(zi2).fullReduce(), this.y.mul(zi2.mul(zi)).fullReduce());
	  },
	  
	  /**
	   * Multiply this point by k and return the answer in Jacobian coordinates.
	   * @param {bigInt} k The coefficient to multiply by.
	   * @param {sjcl.ecc.point} affine This point in affine coordinates.
	   * @return {sjcl.ecc.pointJac} The result of the multiplication, in Jacobian coordinates.
	   */
	  mult: function(k, affine) {
	    if (typeof(k) === "number") {
	      k = [k];
	    } else if (k.limbs !== undefined) {
	      k = k.normalize().limbs;
	    }
	    
	    var i, j, out = new sjcl.ecc.point(this.curve).toJac(), multiples = affine.multiples();

	    for (i=k.length-1; i>=0; i--) {
	      for (j=sjcl.bn.prototype.radix-4; j>=0; j-=4) {
	        out = out.doubl().doubl().doubl().doubl().add(multiples[k[i]>>j & 0xF]);
	      }
	    }
	    
	    return out;
	  },
	  
	  /**
	   * Multiply this point by k, added to affine2*k2, and return the answer in Jacobian coordinates.
	   * @param {bigInt} k The coefficient to multiply this by.
	   * @param {sjcl.ecc.point} affine This point in affine coordinates.
	   * @param {bigInt} k2 The coefficient to multiply affine2 this by.
	   * @param {sjcl.ecc.point} affine The other point in affine coordinates.
	   * @return {sjcl.ecc.pointJac} The result of the multiplication and addition, in Jacobian coordinates.
	   */
	  mult2: function(k1, affine, k2, affine2) {
	    if (typeof(k1) === "number") {
	      k1 = [k1];
	    } else if (k1.limbs !== undefined) {
	      k1 = k1.normalize().limbs;
	    }
	    
	    if (typeof(k2) === "number") {
	      k2 = [k2];
	    } else if (k2.limbs !== undefined) {
	      k2 = k2.normalize().limbs;
	    }
	    
	    var i, j, out = new sjcl.ecc.point(this.curve).toJac(), m1 = affine.multiples(),
	        m2 = affine2.multiples(), l1, l2;

	    for (i=Math.max(k1.length,k2.length)-1; i>=0; i--) {
	      l1 = k1[i] | 0;
	      l2 = k2[i] | 0;
	      for (j=sjcl.bn.prototype.radix-4; j>=0; j-=4) {
	        out = out.doubl().doubl().doubl().doubl().add(m1[l1>>j & 0xF]).add(m2[l2>>j & 0xF]);
	      }
	    }
	    
	    return out;
	  },

	  isValid: function() {
	    var z2 = this.z.square(), z4 = z2.square(), z6 = z4.mul(z2);
	    return this.y.square().equals(
	             this.curve.b.mul(z6).add(this.x.mul(
	               this.curve.a.mul(z4).add(this.x.square()))));
	  }
	};

	/**
	 * Construct an elliptic curve. Most users will not use this and instead start with one of the NIST curves defined below.
	 *
	 * @constructor
	 * @param {bigInt} p The prime modulus.
	 * @param {bigInt} r The prime order of the curve.
	 * @param {bigInt} a The constant a in the equation of the curve y^2 = x^3 + ax + b (for NIST curves, a is always -3).
	 * @param {bigInt} x The x coordinate of a base point of the curve.
	 * @param {bigInt} y The y coordinate of a base point of the curve.
	 */
	sjcl.ecc.curve = function(Field, r, a, b, x, y) {
	  this.field = Field;
	  this.r = Field.prototype.modulus.sub(r);
	  this.a = new Field(a);
	  this.b = new Field(b);
	  this.G = new sjcl.ecc.point(this, new Field(x), new Field(y));
	};

	sjcl.ecc.curve.prototype.fromBits = function (bits) {
	  var w = sjcl.bitArray, l = this.field.prototype.exponent + 7 & -8,
	      p = new sjcl.ecc.point(this, this.field.fromBits(w.bitSlice(bits, 0, l)),
	                             this.field.fromBits(w.bitSlice(bits, l, 2*l)));
	  if (!p.isValid()) {
	    throw new sjcl.exception.corrupt("not on the curve!");
	  }
	  return p;
	};

	sjcl.ecc.curves = {
	  c192: new sjcl.ecc.curve(
	    sjcl.bn.prime.p192,
	    "0x662107c8eb94364e4b2dd7ce",
	    -3,
	    "0x64210519e59c80e70fa7e9ab72243049feb8deecc146b9b1",
	    "0x188da80eb03090f67cbf20eb43a18800f4ff0afd82ff1012",
	    "0x07192b95ffc8da78631011ed6b24cdd573f977a11e794811"),

	  c224: new sjcl.ecc.curve(
	    sjcl.bn.prime.p224,
	    "0xe95c1f470fc1ec22d6baa3a3d5c4",
	    -3,
	    "0xb4050a850c04b3abf54132565044b0b7d7bfd8ba270b39432355ffb4",
	    "0xb70e0cbd6bb4bf7f321390b94a03c1d356c21122343280d6115c1d21",
	    "0xbd376388b5f723fb4c22dfe6cd4375a05a07476444d5819985007e34"),

	  c256: new sjcl.ecc.curve(
	    sjcl.bn.prime.p256,
	    "0x4319055358e8617b0c46353d039cdaae",
	    -3,
	    "0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b",
	    "0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296",
	    "0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5"),

	  c384: new sjcl.ecc.curve(
	    sjcl.bn.prime.p384,
	    "0x389cb27e0bc8d21fa7e5f24cb74f58851313e696333ad68c",
	    -3,
	    "0xb3312fa7e23ee7e4988e056be3f82d19181d9c6efe8141120314088f5013875ac656398d8a2ed19d2a85c8edd3ec2aef",
	    "0xaa87ca22be8b05378eb1c71ef320ad746e1d3b628ba79b9859f741e082542a385502f25dbf55296c3a545e3872760ab7",
	    "0x3617de4a96262c6f5d9e98bf9292dc29f8f41dbd289a147ce9da3113b5f0b8c00a60b1ce1d7e819d7a431d7c90ea0e5f")
	};


	/* Diffie-Hellman-like public-key system */
	sjcl.ecc._dh = function(cn) {
	  sjcl.ecc[cn] = {
	    /** @constructor */
	    publicKey: function(curve, point) {
	      this._curve = curve;
	      this._curveBitLength = curve.r.bitLength();
	      if (point instanceof Array) {
	        this._point = curve.fromBits(point);
	      } else {
	        this._point = point;
	      }

	      this.get = function() {
	        var pointbits = this._point.toBits();
	        var len = sjcl.bitArray.bitLength(pointbits);
	        var x = sjcl.bitArray.bitSlice(pointbits, 0, len/2);
	        var y = sjcl.bitArray.bitSlice(pointbits, len/2);
	        return { x: x, y: y };
	      }
	    },

	    /** @constructor */
	    secretKey: function(curve, exponent) {
	      this._curve = curve;
	      this._curveBitLength = curve.r.bitLength();
	      this._exponent = exponent;

	      this.get = function() {
	        return this._exponent.toBits();
	      }
	    },

	    /** @constructor */
	    generateKeys: function(curve, paranoia, sec) {
	      if (curve === undefined) {
	        curve = 256;
	      }
	      if (typeof curve === "number") {
	        curve = sjcl.ecc.curves['c'+curve];
	        if (curve === undefined) {
	          throw new sjcl.exception.invalid("no such curve");
	        }
	      }
	      if (sec === undefined) {
	        var sec = sjcl.bn.random(curve.r, paranoia);
	      }
	      var pub = curve.G.mult(sec);
	      return { pub: new sjcl.ecc[cn].publicKey(curve, pub),
	               sec: new sjcl.ecc[cn].secretKey(curve, sec) };
	    }
	  }; 
	};

	sjcl.ecc._dh("elGamal");

	sjcl.ecc.elGamal.publicKey.prototype = {
	  kem: function(paranoia) {
	    var sec = sjcl.bn.random(this._curve.r, paranoia),
	        tag = this._curve.G.mult(sec).toBits(),
	        key = sjcl.hash.sha256.hash(this._point.mult(sec).toBits());
	    return { key: key, tag: tag };
	  }
	};

	sjcl.ecc.elGamal.secretKey.prototype = {
	  unkem: function(tag) {
	    return sjcl.hash.sha256.hash(this._curve.fromBits(tag).mult(this._exponent).toBits());
	  },

	  dh: function(pk) {
	    return sjcl.hash.sha256.hash(pk._point.mult(this._exponent).toBits());
	  }
	};

	sjcl.ecc._dh("ecdsa");

	sjcl.ecc.ecdsa.secretKey.prototype = {
	  sign: function(hash, paranoia, fakeLegacyVersion, fixedKForTesting) {
	    if (sjcl.bitArray.bitLength(hash) > this._curveBitLength) {
	      hash = sjcl.bitArray.clamp(hash, this._curveBitLength);
	    }
	    var R  = this._curve.r,
	        l  = R.bitLength(),
	        k  = fixedKForTesting || sjcl.bn.random(R.sub(1), paranoia).add(1),
	        r  = this._curve.G.mult(k).x.mod(R),
	        ss = sjcl.bn.fromBits(hash).add(r.mul(this._exponent)),
	        s  = fakeLegacyVersion ? ss.inverseMod(R).mul(k).mod(R)
	             : ss.mul(k.inverseMod(R)).mod(R);
	    return sjcl.bitArray.concat(r.toBits(l), s.toBits(l));
	  }
	};

	sjcl.ecc.ecdsa.publicKey.prototype = {
	  verify: function(hash, rs, fakeLegacyVersion) {
	    if (sjcl.bitArray.bitLength(hash) > this._curveBitLength) {
	      hash = sjcl.bitArray.clamp(hash, this._curveBitLength);
	    }
	    var w = sjcl.bitArray,
	        R = this._curve.r,
	        l = this._curveBitLength,
	        r = sjcl.bn.fromBits(w.bitSlice(rs,0,l)),
	        ss = sjcl.bn.fromBits(w.bitSlice(rs,l,2*l)),
	        s = fakeLegacyVersion ? ss : ss.inverseMod(R),
	        hG = sjcl.bn.fromBits(hash).mul(s).mod(R),
	        hA = r.mul(s).mod(R),
	        r2 = this._curve.G.mult2(hG, hA, this._point).x;
	    if (r.equals(0) || ss.equals(0) || r.greaterEquals(R) || ss.greaterEquals(R) || !r2.equals(r)) {
	      if (fakeLegacyVersion === undefined) {
	        return this.verify(hash, rs, true);
	      } else {
	        throw (new sjcl.exception.corrupt("signature didn't check out"));
	      }
	    }
	    return true;
	  }
	};

	/** @fileOverview Javascript SRP implementation.
	 *
	 * This file contains a partial implementation of the SRP (Secure Remote
	 * Password) password-authenticated key exchange protocol. Given a user
	 * identity, salt, and SRP group, it generates the SRP verifier that may
	 * be sent to a remote server to establish and SRP account.
	 *
	 * For more information, see http://srp.stanford.edu/.
	 *
	 * @author Quinn Slack
	 */

	/**
	 * Compute the SRP verifier from the username, password, salt, and group.
	 * @class SRP
	 */
	sjcl.keyexchange.srp = {
	  /**
	   * Calculates SRP v, the verifier. 
	   *   v = g^x mod N [RFC 5054]
	   * @param {String} I The username.
	   * @param {String} P The password.
	   * @param {Object} s A bitArray of the salt.
	   * @param {Object} group The SRP group. Use sjcl.keyexchange.srp.knownGroup
	                           to obtain this object.
	   * @return {Object} A bitArray of SRP v.
	   */
	  makeVerifier: function(I, P, s, group) {
	    var x;
	    x = sjcl.keyexchange.srp.makeX(I, P, s);
	    x = sjcl.bn.fromBits(x);
	    return group.g.powermod(x, group.N);
	  },

	  /**
	   * Calculates SRP x.
	   *   x = SHA1(<salt> | SHA(<username> | ":" | <raw password>)) [RFC 2945]
	   * @param {String} I The username.
	   * @param {String} P The password.
	   * @param {Object} s A bitArray of the salt.
	   * @return {Object} A bitArray of SRP x.
	   */
	  makeX: function(I, P, s) {
	    var inner = sjcl.hash.sha1.hash(I + ':' + P);
	    return sjcl.hash.sha1.hash(sjcl.bitArray.concat(s, inner));
	  },

	  /**
	   * Returns the known SRP group with the given size (in bits).
	   * @param {String} i The size of the known SRP group.
	   * @return {Object} An object with "N" and "g" properties.
	   */
	  knownGroup:function(i) {
	    if (typeof i !== "string") { i = i.toString(); }
	    if (!sjcl.keyexchange.srp._didInitKnownGroups) { sjcl.keyexchange.srp._initKnownGroups(); }
	    return sjcl.keyexchange.srp._knownGroups[i];
	  },

	  /**
	   * Initializes bignum objects for known group parameters.
	   * @private
	   */
	  _didInitKnownGroups: false,
	  _initKnownGroups:function() {
	    var i, size, group;
	    for (i=0; i < sjcl.keyexchange.srp._knownGroupSizes.length; i++) {
	      size = sjcl.keyexchange.srp._knownGroupSizes[i].toString();
	      group = sjcl.keyexchange.srp._knownGroups[size];
	      group.N = new sjcl.bn(group.N);
	      group.g = new sjcl.bn(group.g);
	    }
	    sjcl.keyexchange.srp._didInitKnownGroups = true;
	  },

	  _knownGroupSizes: [1024, 1536, 2048],
	  _knownGroups: {
	    1024: {
	      N: "EEAF0AB9ADB38DD69C33F80AFA8FC5E86072618775FF3C0B9EA2314C" +
	         "9C256576D674DF7496EA81D3383B4813D692C6E0E0D5D8E250B98BE4" +
	         "8E495C1D6089DAD15DC7D7B46154D6B6CE8EF4AD69B15D4982559B29" +
	         "7BCF1885C529F566660E57EC68EDBC3C05726CC02FD4CBF4976EAA9A" +
	         "FD5138FE8376435B9FC61D2FC0EB06E3",
	      g:2
	    },

	    1536: {
	      N: "9DEF3CAFB939277AB1F12A8617A47BBBDBA51DF499AC4C80BEEEA961" +
	         "4B19CC4D5F4F5F556E27CBDE51C6A94BE4607A291558903BA0D0F843" +
	         "80B655BB9A22E8DCDF028A7CEC67F0D08134B1C8B97989149B609E0B" +
	         "E3BAB63D47548381DBC5B1FC764E3F4B53DD9DA1158BFD3E2B9C8CF5" +
	         "6EDF019539349627DB2FD53D24B7C48665772E437D6C7F8CE442734A" +
	         "F7CCB7AE837C264AE3A9BEB87F8A2FE9B8B5292E5A021FFF5E91479E" +
	         "8CE7A28C2442C6F315180F93499A234DCF76E3FED135F9BB",
	      g: 2
	    },

	    2048: {
	      N: "AC6BDB41324A9A9BF166DE5E1389582FAF72B6651987EE07FC319294" +
	         "3DB56050A37329CBB4A099ED8193E0757767A13DD52312AB4B03310D" +
	         "CD7F48A9DA04FD50E8083969EDB767B0CF6095179A163AB3661A05FB" +
	         "D5FAAAE82918A9962F0B93B855F97993EC975EEAA80D740ADBF4FF74" +
	         "7359D041D5C33EA71D281E446B14773BCA97B43A23FB801676BD207A" +
	         "436C6481F1D2B9078717461A5B9D32E688F87748544523B524B0D57D" +
	         "5EA77A2775D2ECFA032CFBDBF52FB3786160279004E57AE6AF874E73" +
	         "03CE53299CCC041C7BC308D82A5698F3A8D0C38271AE35F8E9DBFBB6" +
	         "94B5C803D89F7AE435DE236D525F54759B65E372FCD68EF20FA7111F" +
	         "9E4AFF73",
	      g: 2
	    }
	  }

	};


	// ----- for secp256k1 ------

	// Overwrite NIST-P256 with secp256k1 so we're on even footing
	sjcl.ecc.curves.c256 = new sjcl.ecc.curve(
	    sjcl.bn.pseudoMersennePrime(256, [[0,-1],[4,-1],[6,-1],[7,-1],[8,-1],[9,-1],[32,-1]]),
	    "0x14551231950b75fc4402da1722fc9baee",
	    0,
	    7,
	    "0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
	    "0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8"
	);

	// Replace point addition and doubling algorithms
	// NIST-P256 is a=-3, we need algorithms for a=0
	sjcl.ecc.pointJac.prototype.add = function(T) {
	  var S = this;
	  if (S.curve !== T.curve) {
	    throw("sjcl.ecc.add(): Points must be on the same curve to add them!");
	  }

	  if (S.isIdentity) {
	    return T.toJac();
	  } else if (T.isIdentity) {
	    return S;
	  }

	  var z1z1 = S.z.square();
	  var h = T.x.mul(z1z1).subM(S.x);
	  var s2 = T.y.mul(S.z).mul(z1z1);

	  if (h.equals(0)) {
	    if (S.y.equals(T.y.mul(z1z1.mul(S.z)))) {
	      // same point
	      return S.doubl();
	    } else {
	      // inverses
	      return new sjcl.ecc.pointJac(S.curve);
	    }
	  }

	  var hh = h.square();
	  var i = hh.copy().doubleM().doubleM();
	  var j = h.mul(i);
	  var r = s2.sub(S.y).doubleM();
	  var v = S.x.mul(i);
	  
	  var x = r.square().subM(j).subM(v.copy().doubleM());
	  var y = r.mul(v.sub(x)).subM(S.y.mul(j).doubleM());
	  var z = S.z.add(h).square().subM(z1z1).subM(hh);

	  return new sjcl.ecc.pointJac(this.curve,x,y,z);
	};

	sjcl.ecc.pointJac.prototype.doubl = function () {
	  if (this.isIdentity) { return this; }

	  var a = this.x.square();
	  var b = this.y.square();
	  var c = b.square();
	  var d = this.x.add(b).square().subM(a).subM(c).doubleM();
	  var e = a.mul(3);
	  var f = e.square();
	  var x = f.sub(d.copy().doubleM());
	  var y = e.mul(d.sub(x)).subM(c.doubleM().doubleM().doubleM());
	  var z = this.y.mul(this.z).doubleM();
	  return new sjcl.ecc.pointJac(this.curve, x, y, z);
	};

	sjcl.ecc.point.prototype.toBytesCompressed = function () {
	  var header = this.y.mod(2).toString() == "0x0" ? 0x02 : 0x03;
	  return [header].concat(sjcl.codec.bytes.fromBits(this.x.toBits()))
	};

	/** @fileOverview Javascript RIPEMD-160 implementation.
	 *
	 * @author Artem S Vybornov <vybornov@gmail.com>
	 */
	(function() {

	/**
	 * Context for a RIPEMD-160 operation in progress.
	 * @constructor
	 * @class RIPEMD, 160 bits.
	 */
	sjcl.hash.ripemd160 = function (hash) {
	    if (hash) {
	        this._h = hash._h.slice(0);
	        this._buffer = hash._buffer.slice(0);
	        this._length = hash._length;
	    } else {
	        this.reset();
	    }
	};

	/**
	 * Hash a string or an array of words.
	 * @static
	 * @param {bitArray|String} data the data to hash.
	 * @return {bitArray} The hash value, an array of 5 big-endian words.
	 */
	sjcl.hash.ripemd160.hash = function (data) {
	  return (new sjcl.hash.ripemd160()).update(data).finalize();
	};

	sjcl.hash.ripemd160.prototype = {
	    /**
	     * Reset the hash state.
	     * @return this
	     */
	    reset: function () {
	        this._h = _h0.slice(0);
	        this._buffer = [];
	        this._length = 0;
	        return this;
	    },

	    /**
	     * Reset the hash state.
	     * @param {bitArray|String} data the data to hash.
	     * @return this
	     */
	    update: function (data) {
	        if ( typeof data === "string" )
	            data = sjcl.codec.utf8String.toBits(data);

	        var i, b = this._buffer = sjcl.bitArray.concat(this._buffer, data),
	            ol = this._length,
	            nl = this._length = ol + sjcl.bitArray.bitLength(data);
	        for (i = 512+ol & -512; i <= nl; i+= 512) {
	            var words = b.splice(0,16);
	            for ( var w = 0; w < 16; ++w )
	                words[w] = _cvt(words[w]);

	            _block.call( this, words );
	        }

	        return this;
	    },

	    /**
	     * Complete hashing and output the hash value.
	     * @return {bitArray} The hash value, an array of 5 big-endian words.
	     */
	    finalize: function () {
	        var b = sjcl.bitArray.concat( this._buffer, [ sjcl.bitArray.partial(1,1) ] ),
	            l = ( this._length + 1 ) % 512,
	            z = ( l > 448 ? 512 : 448 ) - l % 448,
	            zp = z % 32;

	        if ( zp > 0 )
	            b = sjcl.bitArray.concat( b, [ sjcl.bitArray.partial(zp,0) ] )
	        for ( ; z >= 32; z -= 32 )
	            b.push(0);

	        b.push( _cvt( this._length | 0 ) );
	        b.push( _cvt( Math.floor(this._length / 0x100000000) ) );

	        while ( b.length ) {
	            var words = b.splice(0,16);
	            for ( var w = 0; w < 16; ++w )
	                words[w] = _cvt(words[w]);

	            _block.call( this, words );
	        }

	        var h = this._h;
	        this.reset();

	        for ( var w = 0; w < 5; ++w )
	            h[w] = _cvt(h[w]);

	        return h;
	    }
	};

	var _h0 = [ 0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0 ];

	var _k1 = [ 0x00000000, 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xa953fd4e ];
	var _k2 = [ 0x50a28be6, 0x5c4dd124, 0x6d703ef3, 0x7a6d76e9, 0x00000000 ];
	for ( var i = 4; i >= 0; --i ) {
	    for ( var j = 1; j < 16; ++j ) {
	        _k1.splice(i,0,_k1[i]);
	        _k2.splice(i,0,_k2[i]);
	    }
	}

	var _r1 = [  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15,
	             7,  4, 13,  1, 10,  6, 15,  3, 12,  0,  9,  5,  2, 14, 11,  8,
	             3, 10, 14,  4,  9, 15,  8,  1,  2,  7,  0,  6, 13, 11,  5, 12,
	             1,  9, 11, 10,  0,  8, 12,  4, 13,  3,  7, 15, 14,  5,  6,  2,
	             4,  0,  5,  9,  7, 12,  2, 10, 14,  1,  3,  8, 11,  6, 15, 13 ];
	var _r2 = [  5, 14,  7,  0,  9,  2, 11,  4, 13,  6, 15,  8,  1, 10,  3, 12,
	             6, 11,  3,  7,  0, 13,  5, 10, 14, 15,  8, 12,  4,  9,  1,  2,
	            15,  5,  1,  3,  7, 14,  6,  9, 11,  8, 12,  2, 10,  0,  4, 13,
	             8,  6,  4,  1,  3, 11, 15,  0,  5, 12,  2, 13,  9,  7, 10, 14,
	            12, 15, 10,  4,  1,  5,  8,  7,  6,  2, 13, 14,  0,  3,  9, 11 ];

	var _s1 = [ 11, 14, 15, 12,  5,  8,  7,  9, 11, 13, 14, 15,  6,  7,  9,  8,
	             7,  6,  8, 13, 11,  9,  7, 15,  7, 12, 15,  9, 11,  7, 13, 12,
	            11, 13,  6,  7, 14,  9, 13, 15, 14,  8, 13,  6,  5, 12,  7,  5,
	            11, 12, 14, 15, 14, 15,  9,  8,  9, 14,  5,  6,  8,  6,  5, 12,
	             9, 15,  5, 11,  6,  8, 13, 12,  5, 12, 13, 14, 11,  8,  5,  6 ];
	var _s2 = [  8,  9,  9, 11, 13, 15, 15,  5,  7,  7,  8, 11, 14, 14, 12,  6,
	             9, 13, 15,  7, 12,  8,  9, 11,  7,  7, 12,  7,  6, 15, 13, 11,
	             9,  7, 15, 11,  8,  6,  6, 14, 12, 13,  5, 14, 13, 13,  7,  5,
	            15,  5,  8, 11, 14, 14,  6, 14,  6,  9, 12,  9, 12,  5, 15,  8,
	             8,  5, 12,  9, 12,  5, 14,  6,  8, 13,  6,  5, 15, 13, 11, 11 ];

	function _f0(x,y,z) {
	    return x ^ y ^ z;
	};

	function _f1(x,y,z) {
	    return (x & y) | (~x & z);
	};

	function _f2(x,y,z) {
	    return (x | ~y) ^ z;
	};

	function _f3(x,y,z) {
	    return (x & z) | (y & ~z);
	};

	function _f4(x,y,z) {
	    return x ^ (y | ~z);
	};

	function _rol(n,l) {
	    return (n << l) | (n >>> (32-l));
	}

	function _cvt(n) {
	    return ( (n & 0xff <<  0) <<  24 )
	         | ( (n & 0xff <<  8) <<   8 )
	         | ( (n & 0xff << 16) >>>  8 )
	         | ( (n & 0xff << 24) >>> 24 );
	}

	function _block(X) {
	    var A1 = this._h[0], B1 = this._h[1], C1 = this._h[2], D1 = this._h[3], E1 = this._h[4],
	        A2 = this._h[0], B2 = this._h[1], C2 = this._h[2], D2 = this._h[3], E2 = this._h[4];

	    var j = 0, T;

	    for ( ; j < 16; ++j ) {
	        T = _rol( A1 + _f0(B1,C1,D1) + X[_r1[j]] + _k1[j], _s1[j] ) + E1;
	        A1 = E1; E1 = D1; D1 = _rol(C1,10); C1 = B1; B1 = T;
	        T = _rol( A2 + _f4(B2,C2,D2) + X[_r2[j]] + _k2[j], _s2[j] ) + E2;
	        A2 = E2; E2 = D2; D2 = _rol(C2,10); C2 = B2; B2 = T; }
	    for ( ; j < 32; ++j ) {
	        T = _rol( A1 + _f1(B1,C1,D1) + X[_r1[j]] + _k1[j], _s1[j] ) + E1;
	        A1 = E1; E1 = D1; D1 = _rol(C1,10); C1 = B1; B1 = T;
	        T = _rol( A2 + _f3(B2,C2,D2) + X[_r2[j]] + _k2[j], _s2[j] ) + E2;
	        A2 = E2; E2 = D2; D2 = _rol(C2,10); C2 = B2; B2 = T; }
	    for ( ; j < 48; ++j ) {
	        T = _rol( A1 + _f2(B1,C1,D1) + X[_r1[j]] + _k1[j], _s1[j] ) + E1;
	        A1 = E1; E1 = D1; D1 = _rol(C1,10); C1 = B1; B1 = T;
	        T = _rol( A2 + _f2(B2,C2,D2) + X[_r2[j]] + _k2[j], _s2[j] ) + E2;
	        A2 = E2; E2 = D2; D2 = _rol(C2,10); C2 = B2; B2 = T; }
	    for ( ; j < 64; ++j ) {
	        T = _rol( A1 + _f3(B1,C1,D1) + X[_r1[j]] + _k1[j], _s1[j] ) + E1;
	        A1 = E1; E1 = D1; D1 = _rol(C1,10); C1 = B1; B1 = T;
	        T = _rol( A2 + _f1(B2,C2,D2) + X[_r2[j]] + _k2[j], _s2[j] ) + E2;
	        A2 = E2; E2 = D2; D2 = _rol(C2,10); C2 = B2; B2 = T; }
	    for ( ; j < 80; ++j ) {
	        T = _rol( A1 + _f4(B1,C1,D1) + X[_r1[j]] + _k1[j], _s1[j] ) + E1;
	        A1 = E1; E1 = D1; D1 = _rol(C1,10); C1 = B1; B1 = T;
	        T = _rol( A2 + _f0(B2,C2,D2) + X[_r2[j]] + _k2[j], _s2[j] ) + E2;
	        A2 = E2; E2 = D2; D2 = _rol(C2,10); C2 = B2; B2 = T; }

	    T = this._h[1] + C1 + D2;
	    this._h[1] = this._h[2] + D1 + E2;
	    this._h[2] = this._h[3] + E1 + A2;
	    this._h[3] = this._h[4] + A1 + B2;
	    this._h[4] = this._h[0] + B1 + C2;
	    this._h[0] = T;
	}

	})();

	sjcl.bn.ZERO = new sjcl.bn(0);

	/** [ this / that , this % that ] */
	sjcl.bn.prototype.divRem = function (that) {
	  if (typeof(that) !== "object") { that = new this._class(that); }
	  var thisa = this.abs(), thata = that.abs(), quot = new this._class(0),
	      ci = 0;
	  if (!thisa.greaterEquals(thata)) {
	    return [new sjcl.bn(0), this.copy()];
	  } else if (thisa.equals(thata)) {
	    return [new sjcl.bn(1), new sjcl.bn(0)];
	  }

	  for (; thisa.greaterEquals(thata); ci++) {
	    thata.doubleM();
	  }
	  for (; ci > 0; ci--) {
	    quot.doubleM();
	    thata.halveM();
	    if (thisa.greaterEquals(thata)) {
	      quot.addM(1);
	      thisa.subM(that).normalize();
	    }
	  }
	  return [quot, thisa];
	};

	/** this /= that (rounded to nearest int) */
	sjcl.bn.prototype.divRound = function (that) {
	  var dr = this.divRem(that), quot = dr[0], rem = dr[1];

	  if (rem.doubleM().greaterEquals(that)) {
	    quot.addM(1);
	  }

	  return quot;
	};

	/** this /= that (rounded down) */
	sjcl.bn.prototype.div = function (that) {
	  var dr = this.divRem(that);
	  return dr[0];
	};

	sjcl.bn.prototype.sign = function () {
	  return this.greaterEquals(sjcl.bn.ZERO) ? 1 : -1;
	};

	/** -this */
	sjcl.bn.prototype.neg = function () {
	  return sjcl.bn.ZERO.sub(this);
	};

	/** |this| */
	sjcl.bn.prototype.abs = function () {
	  if (this.sign() === -1) {
	    return this.neg();
	  } else return this;
	};

	/** this >> that */
	sjcl.bn.prototype.shiftRight = function (that) {
	  if ("number" !== typeof that) {
	    throw new Error("shiftRight expects a number");
	  }

	  that = +that;

	  if (that < 0) {
	    return this.shiftLeft(that);
	  }

	  var a = new sjcl.bn(this);

	  while (that >= this.radix) {
	    a.limbs.shift();
	    that -= this.radix;
	  }

	  while (that--) {
	    a.halveM();
	  }

	  return a;
	};

	/** this >> that */
	sjcl.bn.prototype.shiftLeft = function (that) {
	  if ("number" !== typeof that) {
	    throw new Error("shiftLeft expects a number");
	  }

	  that = +that;

	  if (that < 0) {
	    return this.shiftRight(that);
	  }

	  var a = new sjcl.bn(this);

	  while (that >= this.radix) {
	    a.limbs.unshift(0);
	    that -= this.radix;
	  }

	  while (that--) {
	    a.doubleM();
	  }

	  return a;
	};

	/** (int)this */
	// NOTE Truncates to 32-bit integer
	sjcl.bn.prototype.toNumber = function () {
	  return this.limbs[0] | 0;
	};

	/** find n-th bit, 0 = LSB */
	sjcl.bn.prototype.testBit = function (bitIndex) {
	  var limbIndex = Math.floor(bitIndex / this.radix);
	  var bitIndexInLimb = bitIndex % this.radix;

	  if (limbIndex >= this.limbs.length) return 0;

	  return (this.limbs[limbIndex] >>> bitIndexInLimb) & 1;
	};

	/** set n-th bit, 0 = LSB */
	sjcl.bn.prototype.setBitM = function (bitIndex) {
	  var limbIndex = Math.floor(bitIndex / this.radix);
	  var bitIndexInLimb = bitIndex % this.radix;

	  while (limbIndex >= this.limbs.length) this.limbs.push(0);

	  this.limbs[limbIndex] |= 1 << bitIndexInLimb;

	  this.cnormalize();

	  return this;
	};

	sjcl.bn.prototype.modInt = function (n) {
	  return this.toNumber() % n;
	};

	sjcl.bn.prototype.invDigit = function ()
	{
	  var radixMod = 1 + this.radixMask;

	  if (this.limbs.length < 1) return 0;
	  var x = this.limbs[0];
	  if ((x&1) == 0) return 0;
	  var y = x&3;		// y == 1/x mod 2^2
	  y = (y*(2-(x&0xf)*y))&0xf;	// y == 1/x mod 2^4
	  y = (y*(2-(x&0xff)*y))&0xff;	// y == 1/x mod 2^8
	  y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;	// y == 1/x mod 2^16
	  // last step - calculate inverse mod DV directly;
	  // assumes 16 < radixMod <= 32 and assumes ability to handle 48-bit ints
	  y = (y*(2-x*y%radixMod))%radixMod;		// y == 1/x mod 2^dbits
	  // we really want the negative inverse, and -DV < y < DV
	  return (y>0)?radixMod-y:-y;
	};

	// returns bit length of the integer x
	function nbits(x) {
	  var r = 1, t;
	  if((t=x>>>16) != 0) { x = t; r += 16; }
	  if((t=x>>8) != 0) { x = t; r += 8; }
	  if((t=x>>4) != 0) { x = t; r += 4; }
	  if((t=x>>2) != 0) { x = t; r += 2; }
	  if((t=x>>1) != 0) { x = t; r += 1; }
	  return r;
	}

	// JSBN-style add and multiply for SJCL w/ 24 bit radix
	sjcl.bn.prototype.am = function (i,x,w,j,c,n) {
	  var xl = x&0xfff, xh = x>>12;
	  while (--n >= 0) {
	    var l = this.limbs[i]&0xfff;
	    var h = this.limbs[i++]>>12;
	    var m = xh*l+h*xl;
	    l = xl*l+((m&0xfff)<<12)+w.limbs[j]+c;
	    c = (l>>24)+(m>>12)+xh*h;
	    w.limbs[j++] = l&0xffffff;
	  }
	  return c;
	}

	var Montgomery = function (m)
	{
	  this.m = m;
	  this.mt = m.limbs.length;
	  this.mt2 = this.mt * 2;
	  this.mp = m.invDigit();
	  this.mpl = this.mp&0x7fff;
	  this.mph = this.mp>>15;
	  this.um = (1<<(m.radix-15))-1;
	};

	Montgomery.prototype.reduce = function (x)
	{
	  var radixMod = x.radixMask + 1;
	  while (x.limbs.length <= this.mt2)	// pad x so am has enough room later
	    x.limbs[x.limbs.length] = 0;
	  for (var i = 0; i < this.mt; ++i) {
	    // faster way of calculating u0 = x[i]*mp mod 2^radix
	    var j = x.limbs[i]&0x7fff;
	    var u0 = (j*this.mpl+(((j*this.mph+(x.limbs[i]>>15)*this.mpl)&this.um)<<15))&x.radixMask;
	    // use am to combine the multiply-shift-add into one call
	    j = i+this.mt;
	    x.limbs[j] += this.m.am(0,u0,x,i,0,this.mt);
	    // propagate carry
	    while (x.limbs[j] >= radixMod) { x.limbs[j] -= radixMod; x.limbs[++j]++; }
	  }
	  x.trim();
	  x = x.shiftRight(this.mt * this.m.radix);
	  if (x.greaterEquals(this.m)) x = x.sub(this.m);
	  return x.trim().normalize().reduce();
	};

	Montgomery.prototype.square = function (x)
	{
	  return this.reduce(x.square());
	};

	Montgomery.prototype.multiply = function (x, y)
	{
	  return this.reduce(x.mul(y));
	};

	Montgomery.prototype.convert = function (x)
	{
	  return x.abs().shiftLeft(this.mt * this.m.radix).mod(this.m);
	};

	Montgomery.prototype.revert = function (x)
	{
	  return this.reduce(x.copy());
	};

	sjcl.bn.prototype.powermodMontgomery = function (e, m)
	{
	  var i = e.bitLength(), k, r = new this._class(1);

	  if (i <= 0) return r;
	  else if (i < 18) k = 1;
	  else if (i < 48) k = 3;
	  else if (i < 144) k = 4;
	  else if (i < 768) k = 5;
	  else k = 6;

	  if (i < 8 || !m.testBit(0)) {
	    // For small exponents and even moduli, use a simple square-and-multiply
	    // algorithm.
	    return this.powermod(e, m);
	  }

	  var z = new Montgomery(m);

	  e.trim().normalize();

	  // precomputation
	  var g = new Array(), n = 3, k1 = k-1, km = (1<<k)-1;
	  g[1] = z.convert(this);
	  if (k > 1) {
	    var g2 = z.square(g[1]);

	    while (n <= km) {
	      g[n] = z.multiply(g2, g[n-2]);
	      n += 2;
	    }
	  }

	  var j = e.limbs.length-1, w, is1 = true, r2 = new this._class(), t;
	  i = nbits(e.limbs[j])-1;
	  while (j >= 0) {
	    if (i >= k1) w = (e.limbs[j]>>(i-k1))&km;
	    else {
	      w = (e.limbs[j]&((1<<(i+1))-1))<<(k1-i);
	      if (j > 0) w |= e.limbs[j-1]>>(this.radix+i-k1);
	    }

	    n = k;
	    while ((w&1) == 0) { w >>= 1; --n; }
	    if ((i -= n) < 0) { i += this.radix; --j; }
	    if (is1) {	// ret == 1, don't bother squaring or multiplying it
	      r = g[w].copy();
	      is1 = false;
	    } else {
	      while (n > 1) { r2 = z.square(r); r = z.square(r2); n -= 2; }
	      if (n > 0) r2 = z.square(r); else { t = r; r = r2; r2 = t; }
	      r = z.multiply(r2,g[w]);
	    }

	    while (j >= 0 && (e.limbs[j]&(1<<i)) == 0) {
	      r2 = z.square(r); t = r; r = r2; r2 = t;
	      if (--i < 0) { i = this.radix-1; --j; }
	    }
	  }
	  return z.revert(r);
	}

	sjcl.ecc.ecdsa.secretKey.prototype = {
	  sign: function(hash, paranoia) {
	    var R = this._curve.r,
	        l = R.bitLength(),
	        k = sjcl.bn.random(R.sub(1), paranoia).add(1),
	        r = this._curve.G.mult(k).x.mod(R),
	        s = sjcl.bn.fromBits(hash).add(r.mul(this._exponent)).mul(k.inverseMod(R)).mod(R);

	    return sjcl.bitArray.concat(r.toBits(l), s.toBits(l));
	  }
	};

	sjcl.ecc.ecdsa.publicKey.prototype = {
	  verify: function(hash, rs) {
	    var w = sjcl.bitArray,
	        R = this._curve.r,
	        l = R.bitLength(),
	        r = sjcl.bn.fromBits(w.bitSlice(rs,0,l)),
	        s = sjcl.bn.fromBits(w.bitSlice(rs,l,2*l)),
	        sInv = s.modInverse(R),
	        hG = sjcl.bn.fromBits(hash).mul(sInv).mod(R),
	        hA = r.mul(sInv).mod(R),
	        r2 = this._curve.G.mult2(hG, hA, this._point).x;

	    if (r.equals(0) || s.equals(0) || r.greaterEquals(R) || s.greaterEquals(R) || !r2.equals(r)) {
	      throw (new sjcl.exception.corrupt("signature didn't check out"));
	    }
	    return true;
	  }
	};

	sjcl.ecc.ecdsa.secretKey.prototype.signDER = function(hash, paranoia) {
	  return this.encodeDER(this.sign(hash, paranoia));
	};

	sjcl.ecc.ecdsa.secretKey.prototype.encodeDER = function(rs) {
	  var w = sjcl.bitArray,
	      R = this._curve.r,
	      l = R.bitLength();

	  var rb = sjcl.codec.bytes.fromBits(w.bitSlice(rs,0,l)),
	      sb = sjcl.codec.bytes.fromBits(w.bitSlice(rs,l,2*l));

	  // Drop empty leading bytes
	  while (!rb[0] && rb.length) rb.shift();
	  while (!sb[0] && sb.length) sb.shift();

	  // If high bit is set, prepend an extra zero byte (DER signed integer)
	  if (rb[0] & 0x80) rb.unshift(0);
	  if (sb[0] & 0x80) sb.unshift(0);

	  var buffer = [].concat(
	    0x30,
	    4 + rb.length + sb.length,
	    0x02,
	    rb.length,
	    rb,
	    0x02,
	    sb.length,
	    sb
	  );

	  return sjcl.codec.bytes.toBits(buffer);
	};


	sjcl.bn.prototype.jacobi = function (that) {
	  var a = this;
	  that = new sjcl.bn(that);

	  if (that.sign() === -1) return;

	  // 1. If a = 0 then return(0).
	  if (a.equals(0)) { return 0; }

	  // 2. If a = 1 then return(1).
	  if (a.equals(1)) { return 1; }

	  var s = 0;

	  // 3. Write a = 2^e * a1, where a1 is odd.
	  var e = 0;
	  while (!a.testBit(e)) e++;
	  var a1 = a.shiftRight(e);

	  // 4. If e is even then set s ← 1.
	  if ((e & 1) === 0) {
	    s = 1;
	  } else {
	    var residue = that.modInt(8);

	    if (residue === 1 || residue === 7) {
	      // Otherwise set s ← 1 if n ≡ 1 or 7 (mod 8)
	      s = 1;
	    } else if (residue === 3 || residue === 5) {
	      // Or set s ← −1 if n ≡ 3 or 5 (mod 8).
	      s = -1;
	    }
	  }

	  // 5. If n ≡ 3 (mod 4) and a1 ≡ 3 (mod 4) then set s ← −s.
	  if (that.modInt(4) === 3 && a1.modInt(4) === 3) {
	    s = -s;
	  }

	  if (a1.equals(1)) {
	    return s;
	  } else {
	    return s * that.mod(a1).jacobi(a1);
	  }
	};


/***/ },

/***/ 29:
/***/ function(module, exports, require) {

	// Copyright (c) 2005  Tom Wu
	// All Rights Reserved.
	// See "LICENSE" for details.

	// Basic JavaScript BN library - subset useful for RSA encryption.

	// Bits per digit
	var dbits;

	// JavaScript engine analysis
	var canary = 0xdeadbeefcafe;
	var j_lm = ((canary&0xffffff)==0xefcafe);

	// (public) Constructor
	function BigInteger(a,b,c) {
	  if(a != null)
	    if("number" == typeof a) this.fromNumber(a,b,c);
	    else if(b == null && "string" != typeof a) this.fromString(a,256);
	    else this.fromString(a,b);
	}

	// return new, unset BigInteger
	function nbi() { return new BigInteger(null); }

	// am: Compute w_j += (x*this_i), propagate carries,
	// c is initial carry, returns final carry.
	// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
	// We need to select the fastest one that works in this environment.

	// am1: use a single mult and divide to get the high bits,
	// max digit bits should be 26 because
	// max internal value = 2*dvalue^2-2*dvalue (< 2^53)
	function am1(i,x,w,j,c,n) {
	  while(--n >= 0) {
	    var v = x*this[i++]+w[j]+c;
	    c = Math.floor(v/0x4000000);
	    w[j++] = v&0x3ffffff;
	  }
	  return c;
	}
	// am2 avoids a big mult-and-extract completely.
	// Max digit bits should be <= 30 because we do bitwise ops
	// on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
	function am2(i,x,w,j,c,n) {
	  var xl = x&0x7fff, xh = x>>15;
	  while(--n >= 0) {
	    var l = this[i]&0x7fff;
	    var h = this[i++]>>15;
	    var m = xh*l+h*xl;
	    l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
	    c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
	    w[j++] = l&0x3fffffff;
	  }
	  return c;
	}
	// Alternately, set max digit bits to 28 since some
	// browsers slow down when dealing with 32-bit numbers.
	function am3(i,x,w,j,c,n) {
	  var xl = x&0x3fff, xh = x>>14;
	  while(--n >= 0) {
	    var l = this[i]&0x3fff;
	    var h = this[i++]>>14;
	    var m = xh*l+h*xl;
	    l = xl*l+((m&0x3fff)<<14)+w[j]+c;
	    c = (l>>28)+(m>>14)+xh*h;
	    w[j++] = l&0xfffffff;
	  }
	  return c;
	}
	if(j_lm && 'undefined' !== typeof navigator && (navigator.appName == "Microsoft Internet Explorer")) {
	  BigInteger.prototype.am = am2;
	  dbits = 30;
	}
	else if(j_lm && 'undefined' !== typeof navigator && (navigator.appName != "Netscape")) {
	  BigInteger.prototype.am = am1;
	  dbits = 26;
	}
	else { // Mozilla/Netscape seems to prefer am3
	  BigInteger.prototype.am = am3;
	  dbits = 28;
	}

	BigInteger.prototype.DB = dbits;
	BigInteger.prototype.DM = ((1<<dbits)-1);
	BigInteger.prototype.DV = (1<<dbits);

	var BI_FP = 52;
	BigInteger.prototype.FV = Math.pow(2,BI_FP);
	BigInteger.prototype.F1 = BI_FP-dbits;
	BigInteger.prototype.F2 = 2*dbits-BI_FP;

	// Digit conversions
	var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
	var BI_RC = new Array();
	var rr,vv;
	rr = "0".charCodeAt(0);
	for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
	rr = "a".charCodeAt(0);
	for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
	rr = "A".charCodeAt(0);
	for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

	function int2char(n) { return BI_RM.charAt(n); }
	function intAt(s,i) {
	  var c = BI_RC[s.charCodeAt(i)];
	  return (c==null)?-1:c;
	}

	// (protected) copy this to r
	function bnpCopyTo(r) {
	  for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
	  r.t = this.t;
	  r.s = this.s;
	}

	// (protected) set from integer value x, -DV <= x < DV
	function bnpFromInt(x) {
	  this.t = 1;
	  this.s = (x<0)?-1:0;
	  if(x > 0) this[0] = x;
	  else if(x < -1) this[0] = x+this.DV;
	  else this.t = 0;
	}

	// return bigint initialized to value
	function nbv(i) { var r = nbi(); r.fromInt(i); return r; }

	// (protected) set from string and radix
	function bnpFromString(s,b) {
	  var k;
	  if(b == 16) k = 4;
	  else if(b == 8) k = 3;
	  else if(b == 256) k = 8; // byte array
	  else if(b == 2) k = 1;
	  else if(b == 32) k = 5;
	  else if(b == 4) k = 2;
	  else { this.fromRadix(s,b); return; }
	  this.t = 0;
	  this.s = 0;
	  var i = s.length, mi = false, sh = 0;
	  while(--i >= 0) {
	    var x = (k==8)?s[i]&0xff:intAt(s,i);
	    if(x < 0) {
	      if(s.charAt(i) == "-") mi = true;
	      continue;
	    }
	    mi = false;
	    if(sh == 0)
	      this[this.t++] = x;
	    else if(sh+k > this.DB) {
	      this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
	      this[this.t++] = (x>>(this.DB-sh));
	    }
	    else
	      this[this.t-1] |= x<<sh;
	    sh += k;
	    if(sh >= this.DB) sh -= this.DB;
	  }
	  if(k == 8 && (s[0]&0x80) != 0) {
	    this.s = -1;
	    if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
	  }
	  this.clamp();
	  if(mi) BigInteger.ZERO.subTo(this,this);
	}

	// (protected) clamp off excess high words
	function bnpClamp() {
	  var c = this.s&this.DM;
	  while(this.t > 0 && this[this.t-1] == c) --this.t;
	}

	// (public) return string representation in given radix
	function bnToString(b) {
	  if(this.s < 0) return "-"+this.negate().toString(b);
	  var k;
	  if(b == 16) k = 4;
	  else if(b == 8) k = 3;
	  else if(b == 2) k = 1;
	  else if(b == 32) k = 5;
	  else if(b == 4) k = 2;
	  else return this.toRadix(b);
	  var km = (1<<k)-1, d, m = false, r = "", i = this.t;
	  var p = this.DB-(i*this.DB)%k;
	  if(i-- > 0) {
	    if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }
	    while(i >= 0) {
	      if(p < k) {
	        d = (this[i]&((1<<p)-1))<<(k-p);
	        d |= this[--i]>>(p+=this.DB-k);
	      }
	      else {
	        d = (this[i]>>(p-=k))&km;
	        if(p <= 0) { p += this.DB; --i; }
	      }
	      if(d > 0) m = true;
	      if(m) r += int2char(d);
	    }
	  }
	  return m?r:"0";
	}

	// (public) -this
	function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }

	// (public) |this|
	function bnAbs() { return (this.s<0)?this.negate():this; }

	// (public) return + if this > a, - if this < a, 0 if equal
	function bnCompareTo(a) {
	  var r = this.s-a.s;
	  if(r != 0) return r;
	  var i = this.t;
	  r = i-a.t;
	  if(r != 0) return (this.s<0)?-r:r;
	  while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
	  return 0;
	}

	// returns bit length of the integer x
	function nbits(x) {
	  var r = 1, t;
	  if((t=x>>>16) != 0) { x = t; r += 16; }
	  if((t=x>>8) != 0) { x = t; r += 8; }
	  if((t=x>>4) != 0) { x = t; r += 4; }
	  if((t=x>>2) != 0) { x = t; r += 2; }
	  if((t=x>>1) != 0) { x = t; r += 1; }
	  return r;
	}

	// (public) return the number of bits in "this"
	function bnBitLength() {
	  if(this.t <= 0) return 0;
	  return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
	}

	// (protected) r = this << n*DB
	function bnpDLShiftTo(n,r) {
	  var i;
	  for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
	  for(i = n-1; i >= 0; --i) r[i] = 0;
	  r.t = this.t+n;
	  r.s = this.s;
	}

	// (protected) r = this >> n*DB
	function bnpDRShiftTo(n,r) {
	  for(var i = n; i < this.t; ++i) r[i-n] = this[i];
	  r.t = Math.max(this.t-n,0);
	  r.s = this.s;
	}

	// (protected) r = this << n
	function bnpLShiftTo(n,r) {
	  var bs = n%this.DB;
	  var cbs = this.DB-bs;
	  var bm = (1<<cbs)-1;
	  var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
	  for(i = this.t-1; i >= 0; --i) {
	    r[i+ds+1] = (this[i]>>cbs)|c;
	    c = (this[i]&bm)<<bs;
	  }
	  for(i = ds-1; i >= 0; --i) r[i] = 0;
	  r[ds] = c;
	  r.t = this.t+ds+1;
	  r.s = this.s;
	  r.clamp();
	}

	// (protected) r = this >> n
	function bnpRShiftTo(n,r) {
	  r.s = this.s;
	  var ds = Math.floor(n/this.DB);
	  if(ds >= this.t) { r.t = 0; return; }
	  var bs = n%this.DB;
	  var cbs = this.DB-bs;
	  var bm = (1<<bs)-1;
	  r[0] = this[ds]>>bs;
	  for(var i = ds+1; i < this.t; ++i) {
	    r[i-ds-1] |= (this[i]&bm)<<cbs;
	    r[i-ds] = this[i]>>bs;
	  }
	  if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
	  r.t = this.t-ds;
	  r.clamp();
	}

	// (protected) r = this - a
	function bnpSubTo(a,r) {
	  var i = 0, c = 0, m = Math.min(a.t,this.t);
	  while(i < m) {
	    c += this[i]-a[i];
	    r[i++] = c&this.DM;
	    c >>= this.DB;
	  }
	  if(a.t < this.t) {
	    c -= a.s;
	    while(i < this.t) {
	      c += this[i];
	      r[i++] = c&this.DM;
	      c >>= this.DB;
	    }
	    c += this.s;
	  }
	  else {
	    c += this.s;
	    while(i < a.t) {
	      c -= a[i];
	      r[i++] = c&this.DM;
	      c >>= this.DB;
	    }
	    c -= a.s;
	  }
	  r.s = (c<0)?-1:0;
	  if(c < -1) r[i++] = this.DV+c;
	  else if(c > 0) r[i++] = c;
	  r.t = i;
	  r.clamp();
	}

	// (protected) r = this * a, r != this,a (HAC 14.12)
	// "this" should be the larger one if appropriate.
	function bnpMultiplyTo(a,r) {
	  var x = this.abs(), y = a.abs();
	  var i = x.t;
	  r.t = i+y.t;
	  while(--i >= 0) r[i] = 0;
	  for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
	  r.s = 0;
	  r.clamp();
	  if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
	}

	// (protected) r = this^2, r != this (HAC 14.16)
	function bnpSquareTo(r) {
	  var x = this.abs();
	  var i = r.t = 2*x.t;
	  while(--i >= 0) r[i] = 0;
	  for(i = 0; i < x.t-1; ++i) {
	    var c = x.am(i,x[i],r,2*i,0,1);
	    if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
	      r[i+x.t] -= x.DV;
	      r[i+x.t+1] = 1;
	    }
	  }
	  if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
	  r.s = 0;
	  r.clamp();
	}

	// (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
	// r != q, this != m.  q or r may be null.
	function bnpDivRemTo(m,q,r) {
	  var pm = m.abs();
	  if(pm.t <= 0) return;
	  var pt = this.abs();
	  if(pt.t < pm.t) {
	    if(q != null) q.fromInt(0);
	    if(r != null) this.copyTo(r);
	    return;
	  }
	  if(r == null) r = nbi();
	  var y = nbi(), ts = this.s, ms = m.s;
	  var nsh = this.DB-nbits(pm[pm.t-1]);	// normalize modulus
	  if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
	  else { pm.copyTo(y); pt.copyTo(r); }
	  var ys = y.t;
	  var y0 = y[ys-1];
	  if(y0 == 0) return;
	  var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
	  var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
	  var i = r.t, j = i-ys, t = (q==null)?nbi():q;
	  y.dlShiftTo(j,t);
	  if(r.compareTo(t) >= 0) {
	    r[r.t++] = 1;
	    r.subTo(t,r);
	  }
	  BigInteger.ONE.dlShiftTo(ys,t);
	  t.subTo(y,y);	// "negative" y so we can replace sub with am later
	  while(y.t < ys) y[y.t++] = 0;
	  while(--j >= 0) {
	    // Estimate quotient digit
	    var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
	    if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {	// Try it out
	      y.dlShiftTo(j,t);
	      r.subTo(t,r);
	      while(r[i] < --qd) r.subTo(t,r);
	    }
	  }
	  if(q != null) {
	    r.drShiftTo(ys,q);
	    if(ts != ms) BigInteger.ZERO.subTo(q,q);
	  }
	  r.t = ys;
	  r.clamp();
	  if(nsh > 0) r.rShiftTo(nsh,r);	// Denormalize remainder
	  if(ts < 0) BigInteger.ZERO.subTo(r,r);
	}

	// (public) this mod a
	function bnMod(a) {
	  var r = nbi();
	  this.abs().divRemTo(a,null,r);
	  if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
	  return r;
	}

	// Modular reduction using "classic" algorithm
	function Classic(m) { this.m = m; }
	function cConvert(x) {
	  if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
	  else return x;
	}
	function cRevert(x) { return x; }
	function cReduce(x) { x.divRemTo(this.m,null,x); }
	function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
	function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

	Classic.prototype.convert = cConvert;
	Classic.prototype.revert = cRevert;
	Classic.prototype.reduce = cReduce;
	Classic.prototype.mulTo = cMulTo;
	Classic.prototype.sqrTo = cSqrTo;

	// (protected) return "-1/this % 2^DB"; useful for Mont. reduction
	// justification:
	//         xy == 1 (mod m)
	//         xy =  1+km
	//   xy(2-xy) = (1+km)(1-km)
	// x[y(2-xy)] = 1-k^2m^2
	// x[y(2-xy)] == 1 (mod m^2)
	// if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
	// should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
	// JS multiply "overflows" differently from C/C++, so care is needed here.
	function bnpInvDigit() {
	  if(this.t < 1) return 0;
	  var x = this[0];
	  if((x&1) == 0) return 0;
	  var y = x&3;		// y == 1/x mod 2^2
	  y = (y*(2-(x&0xf)*y))&0xf;	// y == 1/x mod 2^4
	  y = (y*(2-(x&0xff)*y))&0xff;	// y == 1/x mod 2^8
	  y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;	// y == 1/x mod 2^16
	  // last step - calculate inverse mod DV directly;
	  // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
	  y = (y*(2-x*y%this.DV))%this.DV;		// y == 1/x mod 2^dbits
	  // we really want the negative inverse, and -DV < y < DV
	  return (y>0)?this.DV-y:-y;
	}

	// Montgomery reduction
	function Montgomery(m) {
	  this.m = m;
	  this.mp = m.invDigit();
	  this.mpl = this.mp&0x7fff;
	  this.mph = this.mp>>15;
	  this.um = (1<<(m.DB-15))-1;
	  this.mt2 = 2*m.t;
	}

	// xR mod m
	function montConvert(x) {
	  var r = nbi();
	  x.abs().dlShiftTo(this.m.t,r);
	  r.divRemTo(this.m,null,r);
	  if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
	  return r;
	}

	// x/R mod m
	function montRevert(x) {
	  var r = nbi();
	  x.copyTo(r);
	  this.reduce(r);
	  return r;
	}

	// x = x/R mod m (HAC 14.32)
	function montReduce(x) {
	  while(x.t <= this.mt2)	// pad x so am has enough room later
	    x[x.t++] = 0;
	  for(var i = 0; i < this.m.t; ++i) {
	    // faster way of calculating u0 = x[i]*mp mod DV
	    var j = x[i]&0x7fff;
	    var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
	    // use am to combine the multiply-shift-add into one call
	    j = i+this.m.t;
	    x[j] += this.m.am(0,u0,x,i,0,this.m.t);
	    // propagate carry
	    while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
	  }
	  x.clamp();
	  x.drShiftTo(this.m.t,x);
	  if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
	}

	// r = "x^2/R mod m"; x != r
	function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

	// r = "xy/R mod m"; x,y != r
	function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

	Montgomery.prototype.convert = montConvert;
	Montgomery.prototype.revert = montRevert;
	Montgomery.prototype.reduce = montReduce;
	Montgomery.prototype.mulTo = montMulTo;
	Montgomery.prototype.sqrTo = montSqrTo;

	// (protected) true iff this is even
	function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }

	// (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
	function bnpExp(e,z) {
	  if(e > 0xffffffff || e < 1) return BigInteger.ONE;
	  var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
	  g.copyTo(r);
	  while(--i >= 0) {
	    z.sqrTo(r,r2);
	    if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
	    else { var t = r; r = r2; r2 = t; }
	  }
	  return z.revert(r);
	}

	// (public) this^e % m, 0 <= e < 2^32
	function bnModPowInt(e,m) {
	  var z;
	  if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
	  return this.exp(e,z);
	}

	// (public)
	function bnClone() { var r = nbi(); this.copyTo(r); return r; }

	// (public) return value as integer
	function bnIntValue() {
	  if(this.s < 0) {
	    if(this.t == 1) return this[0]-this.DV;
	    else if(this.t == 0) return -1;
	  }
	  else if(this.t == 1) return this[0];
	  else if(this.t == 0) return 0;
	  // assumes 16 < DB < 32
	  return ((this[1]&((1<<(32-this.DB))-1))<<this.DB)|this[0];
	}

	// (public) return value as byte
	function bnByteValue() { return (this.t==0)?this.s:(this[0]<<24)>>24; }

	// (public) return value as short (assumes DB>=16)
	function bnShortValue() { return (this.t==0)?this.s:(this[0]<<16)>>16; }

	// (protected) return x s.t. r^x < DV
	function bnpChunkSize(r) { return Math.floor(Math.LN2*this.DB/Math.log(r)); }

	// (public) 0 if this == 0, 1 if this > 0
	function bnSigNum() {
	  if(this.s < 0) return -1;
	  else if(this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
	  else return 1;
	}

	// (protected) convert to radix string
	function bnpToRadix(b) {
	  if(b == null) b = 10;
	  if(this.signum() == 0 || b < 2 || b > 36) return "0";
	  var cs = this.chunkSize(b);
	  var a = Math.pow(b,cs);
	  var d = nbv(a), y = nbi(), z = nbi(), r = "";
	  this.divRemTo(d,y,z);
	  while(y.signum() > 0) {
	    r = (a+z.intValue()).toString(b).substr(1) + r;
	    y.divRemTo(d,y,z);
	  }
	  return z.intValue().toString(b) + r;
	}

	// (protected) convert from radix string
	function bnpFromRadix(s,b) {
	  this.fromInt(0);
	  if(b == null) b = 10;
	  var cs = this.chunkSize(b);
	  var d = Math.pow(b,cs), mi = false, j = 0, w = 0;
	  for(var i = 0; i < s.length; ++i) {
	    var x = intAt(s,i);
	    if(x < 0) {
	      if(s.charAt(i) == "-" && this.signum() == 0) mi = true;
	      continue;
	    }
	    w = b*w+x;
	    if(++j >= cs) {
	      this.dMultiply(d);
	      this.dAddOffset(w,0);
	      j = 0;
	      w = 0;
	    }
	  }
	  if(j > 0) {
	    this.dMultiply(Math.pow(b,j));
	    this.dAddOffset(w,0);
	  }
	  if(mi) BigInteger.ZERO.subTo(this,this);
	}

	// (protected) alternate constructor
	function bnpFromNumber(a,b,c) {
	  if("number" == typeof b) {
	    // new BigInteger(int,int,RNG)
	    if(a < 2) this.fromInt(1);
	    else {
	      this.fromNumber(a,c);
	      if(!this.testBit(a-1))	// force MSB set
	        this.bitwiseTo(BigInteger.ONE.shiftLeft(a-1),op_or,this);
	      if(this.isEven()) this.dAddOffset(1,0); // force odd
	      while(!this.isProbablePrime(b)) {
	        this.dAddOffset(2,0);
	        if(this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a-1),this);
	      }
	    }
	  }
	  else {
	    // new BigInteger(int,RNG)
	    var x = new Array(), t = a&7;
	    x.length = (a>>3)+1;
	    b.nextBytes(x);
	    if(t > 0) x[0] &= ((1<<t)-1); else x[0] = 0;
	    this.fromString(x,256);
	  }
	}

	// (public) convert to bigendian byte array
	function bnToByteArray() {
	  var i = this.t, r = new Array();
	  r[0] = this.s;
	  var p = this.DB-(i*this.DB)%8, d, k = 0;
	  if(i-- > 0) {
	    if(p < this.DB && (d = this[i]>>p) != (this.s&this.DM)>>p)
	      r[k++] = d|(this.s<<(this.DB-p));
	    while(i >= 0) {
	      if(p < 8) {
	        d = (this[i]&((1<<p)-1))<<(8-p);
	        d |= this[--i]>>(p+=this.DB-8);
	      }
	      else {
	        d = (this[i]>>(p-=8))&0xff;
	        if(p <= 0) { p += this.DB; --i; }
	      }
	      if((d&0x80) != 0) d |= -256;
	      if(k == 0 && (this.s&0x80) != (d&0x80)) ++k;
	      if(k > 0 || d != this.s) r[k++] = d;
	    }
	  }
	  return r;
	}

	function bnEquals(a) { return(this.compareTo(a)==0); }
	function bnMin(a) { return(this.compareTo(a)<0)?this:a; }
	function bnMax(a) { return(this.compareTo(a)>0)?this:a; }

	// (protected) r = this op a (bitwise)
	function bnpBitwiseTo(a,op,r) {
	  var i, f, m = Math.min(a.t,this.t);
	  for(i = 0; i < m; ++i) r[i] = op(this[i],a[i]);
	  if(a.t < this.t) {
	    f = a.s&this.DM;
	    for(i = m; i < this.t; ++i) r[i] = op(this[i],f);
	    r.t = this.t;
	  }
	  else {
	    f = this.s&this.DM;
	    for(i = m; i < a.t; ++i) r[i] = op(f,a[i]);
	    r.t = a.t;
	  }
	  r.s = op(this.s,a.s);
	  r.clamp();
	}

	// (public) this & a
	function op_and(x,y) { return x&y; }
	function bnAnd(a) { var r = nbi(); this.bitwiseTo(a,op_and,r); return r; }

	// (public) this | a
	function op_or(x,y) { return x|y; }
	function bnOr(a) { var r = nbi(); this.bitwiseTo(a,op_or,r); return r; }

	// (public) this ^ a
	function op_xor(x,y) { return x^y; }
	function bnXor(a) { var r = nbi(); this.bitwiseTo(a,op_xor,r); return r; }

	// (public) this & ~a
	function op_andnot(x,y) { return x&~y; }
	function bnAndNot(a) { var r = nbi(); this.bitwiseTo(a,op_andnot,r); return r; }

	// (public) ~this
	function bnNot() {
	  var r = nbi();
	  for(var i = 0; i < this.t; ++i) r[i] = this.DM&~this[i];
	  r.t = this.t;
	  r.s = ~this.s;
	  return r;
	}

	// (public) this << n
	function bnShiftLeft(n) {
	  var r = nbi();
	  if(n < 0) this.rShiftTo(-n,r); else this.lShiftTo(n,r);
	  return r;
	}

	// (public) this >> n
	function bnShiftRight(n) {
	  var r = nbi();
	  if(n < 0) this.lShiftTo(-n,r); else this.rShiftTo(n,r);
	  return r;
	}

	// return index of lowest 1-bit in x, x < 2^31
	function lbit(x) {
	  if(x == 0) return -1;
	  var r = 0;
	  if((x&0xffff) == 0) { x >>= 16; r += 16; }
	  if((x&0xff) == 0) { x >>= 8; r += 8; }
	  if((x&0xf) == 0) { x >>= 4; r += 4; }
	  if((x&3) == 0) { x >>= 2; r += 2; }
	  if((x&1) == 0) ++r;
	  return r;
	}

	// (public) returns index of lowest 1-bit (or -1 if none)
	function bnGetLowestSetBit() {
	  for(var i = 0; i < this.t; ++i)
	    if(this[i] != 0) return i*this.DB+lbit(this[i]);
	  if(this.s < 0) return this.t*this.DB;
	  return -1;
	}

	// return number of 1 bits in x
	function cbit(x) {
	  var r = 0;
	  while(x != 0) { x &= x-1; ++r; }
	  return r;
	}

	// (public) return number of set bits
	function bnBitCount() {
	  var r = 0, x = this.s&this.DM;
	  for(var i = 0; i < this.t; ++i) r += cbit(this[i]^x);
	  return r;
	}

	// (public) true iff nth bit is set
	function bnTestBit(n) {
	  var j = Math.floor(n/this.DB);
	  if(j >= this.t) return(this.s!=0);
	  return((this[j]&(1<<(n%this.DB)))!=0);
	}

	// (protected) this op (1<<n)
	function bnpChangeBit(n,op) {
	  var r = BigInteger.ONE.shiftLeft(n);
	  this.bitwiseTo(r,op,r);
	  return r;
	}

	// (public) this | (1<<n)
	function bnSetBit(n) { return this.changeBit(n,op_or); }

	// (public) this & ~(1<<n)
	function bnClearBit(n) { return this.changeBit(n,op_andnot); }

	// (public) this ^ (1<<n)
	function bnFlipBit(n) { return this.changeBit(n,op_xor); }

	// (protected) r = this + a
	function bnpAddTo(a,r) {
	  var i = 0, c = 0, m = Math.min(a.t,this.t);
	  while(i < m) {
	    c += this[i]+a[i];
	    r[i++] = c&this.DM;
	    c >>= this.DB;
	  }
	  if(a.t < this.t) {
	    c += a.s;
	    while(i < this.t) {
	      c += this[i];
	      r[i++] = c&this.DM;
	      c >>= this.DB;
	    }
	    c += this.s;
	  }
	  else {
	    c += this.s;
	    while(i < a.t) {
	      c += a[i];
	      r[i++] = c&this.DM;
	      c >>= this.DB;
	    }
	    c += a.s;
	  }
	  r.s = (c<0)?-1:0;
	  if(c > 0) r[i++] = c;
	  else if(c < -1) r[i++] = this.DV+c;
	  r.t = i;
	  r.clamp();
	}

	// (public) this + a
	function bnAdd(a) { var r = nbi(); this.addTo(a,r); return r; }

	// (public) this - a
	function bnSubtract(a) { var r = nbi(); this.subTo(a,r); return r; }

	// (public) this * a
	function bnMultiply(a) { var r = nbi(); this.multiplyTo(a,r); return r; }

	// (public) this^2
	function bnSquare() { var r = nbi(); this.squareTo(r); return r; }

	// (public) this / a
	function bnDivide(a) { var r = nbi(); this.divRemTo(a,r,null); return r; }

	// (public) this % a
	function bnRemainder(a) { var r = nbi(); this.divRemTo(a,null,r); return r; }

	// (public) [this/a,this%a]
	function bnDivideAndRemainder(a) {
	  var q = nbi(), r = nbi();
	  this.divRemTo(a,q,r);
	  return new Array(q,r);
	}

	// (protected) this *= n, this >= 0, 1 < n < DV
	function bnpDMultiply(n) {
	  this[this.t] = this.am(0,n-1,this,0,0,this.t);
	  ++this.t;
	  this.clamp();
	}

	// (protected) this += n << w words, this >= 0
	function bnpDAddOffset(n,w) {
	  if(n == 0) return;
	  while(this.t <= w) this[this.t++] = 0;
	  this[w] += n;
	  while(this[w] >= this.DV) {
	    this[w] -= this.DV;
	    if(++w >= this.t) this[this.t++] = 0;
	    ++this[w];
	  }
	}

	// A "null" reducer
	function NullExp() {}
	function nNop(x) { return x; }
	function nMulTo(x,y,r) { x.multiplyTo(y,r); }
	function nSqrTo(x,r) { x.squareTo(r); }

	NullExp.prototype.convert = nNop;
	NullExp.prototype.revert = nNop;
	NullExp.prototype.mulTo = nMulTo;
	NullExp.prototype.sqrTo = nSqrTo;

	// (public) this^e
	function bnPow(e) { return this.exp(e,new NullExp()); }

	// (protected) r = lower n words of "this * a", a.t <= n
	// "this" should be the larger one if appropriate.
	function bnpMultiplyLowerTo(a,n,r) {
	  var i = Math.min(this.t+a.t,n);
	  r.s = 0; // assumes a,this >= 0
	  r.t = i;
	  while(i > 0) r[--i] = 0;
	  var j;
	  for(j = r.t-this.t; i < j; ++i) r[i+this.t] = this.am(0,a[i],r,i,0,this.t);
	  for(j = Math.min(a.t,n); i < j; ++i) this.am(0,a[i],r,i,0,n-i);
	  r.clamp();
	}

	// (protected) r = "this * a" without lower n words, n > 0
	// "this" should be the larger one if appropriate.
	function bnpMultiplyUpperTo(a,n,r) {
	  --n;
	  var i = r.t = this.t+a.t-n;
	  r.s = 0; // assumes a,this >= 0
	  while(--i >= 0) r[i] = 0;
	  for(i = Math.max(n-this.t,0); i < a.t; ++i)
	    r[this.t+i-n] = this.am(n-i,a[i],r,0,0,this.t+i-n);
	  r.clamp();
	  r.drShiftTo(1,r);
	}

	// Barrett modular reduction
	function Barrett(m) {
	  // setup Barrett
	  this.r2 = nbi();
	  this.q3 = nbi();
	  BigInteger.ONE.dlShiftTo(2*m.t,this.r2);
	  this.mu = this.r2.divide(m);
	  this.m = m;
	}

	function barrettConvert(x) {
	  if(x.s < 0 || x.t > 2*this.m.t) return x.mod(this.m);
	  else if(x.compareTo(this.m) < 0) return x;
	  else { var r = nbi(); x.copyTo(r); this.reduce(r); return r; }
	}

	function barrettRevert(x) { return x; }

	// x = x mod m (HAC 14.42)
	function barrettReduce(x) {
	  x.drShiftTo(this.m.t-1,this.r2);
	  if(x.t > this.m.t+1) { x.t = this.m.t+1; x.clamp(); }
	  this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);
	  this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);
	  while(x.compareTo(this.r2) < 0) x.dAddOffset(1,this.m.t+1);
	  x.subTo(this.r2,x);
	  while(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
	}

	// r = x^2 mod m; x != r
	function barrettSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

	// r = x*y mod m; x,y != r
	function barrettMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

	Barrett.prototype.convert = barrettConvert;
	Barrett.prototype.revert = barrettRevert;
	Barrett.prototype.reduce = barrettReduce;
	Barrett.prototype.mulTo = barrettMulTo;
	Barrett.prototype.sqrTo = barrettSqrTo;

	// (public) this^e % m (HAC 14.85)
	function bnModPow(e,m) {
	  var i = e.bitLength(), k, r = nbv(1), z;
	  if(i <= 0) return r;
	  else if(i < 18) k = 1;
	  else if(i < 48) k = 3;
	  else if(i < 144) k = 4;
	  else if(i < 768) k = 5;
	  else k = 6;
	  if(i < 8)
	    z = new Classic(m);
	  else if(m.isEven())
	    z = new Barrett(m);
	  else
	    z = new Montgomery(m);

	  // precomputation
	  var g = new Array(), n = 3, k1 = k-1, km = (1<<k)-1;
	  g[1] = z.convert(this);
	  if(k > 1) {
	    var g2 = nbi();
	    z.sqrTo(g[1],g2);
	    while(n <= km) {
	      g[n] = nbi();
	      z.mulTo(g2,g[n-2],g[n]);
	      n += 2;
	    }
	  }

	  var j = e.t-1, w, is1 = true, r2 = nbi(), t;
	  i = nbits(e[j])-1;
	  while(j >= 0) {
	    if(i >= k1) w = (e[j]>>(i-k1))&km;
	    else {
	      w = (e[j]&((1<<(i+1))-1))<<(k1-i);
	      if(j > 0) w |= e[j-1]>>(this.DB+i-k1);
	    }

	    n = k;
	    while((w&1) == 0) { w >>= 1; --n; }
	    if((i -= n) < 0) { i += this.DB; --j; }
	    if(is1) {	// ret == 1, don't bother squaring or multiplying it
	      g[w].copyTo(r);
	      is1 = false;
	    }
	    else {
	      while(n > 1) { z.sqrTo(r,r2); z.sqrTo(r2,r); n -= 2; }
	      if(n > 0) z.sqrTo(r,r2); else { t = r; r = r2; r2 = t; }
	      z.mulTo(r2,g[w],r);
	    }

	    while(j >= 0 && (e[j]&(1<<i)) == 0) {
	      z.sqrTo(r,r2); t = r; r = r2; r2 = t;
	      if(--i < 0) { i = this.DB-1; --j; }
	    }
	  }
	  return z.revert(r);
	}

	// (public) gcd(this,a) (HAC 14.54)
	function bnGCD(a) {
	  var x = (this.s<0)?this.negate():this.clone();
	  var y = (a.s<0)?a.negate():a.clone();
	  if(x.compareTo(y) < 0) { var t = x; x = y; y = t; }
	  var i = x.getLowestSetBit(), g = y.getLowestSetBit();
	  if(g < 0) return x;
	  if(i < g) g = i;
	  if(g > 0) {
	    x.rShiftTo(g,x);
	    y.rShiftTo(g,y);
	  }
	  while(x.signum() > 0) {
	    if((i = x.getLowestSetBit()) > 0) x.rShiftTo(i,x);
	    if((i = y.getLowestSetBit()) > 0) y.rShiftTo(i,y);
	    if(x.compareTo(y) >= 0) {
	      x.subTo(y,x);
	      x.rShiftTo(1,x);
	    }
	    else {
	      y.subTo(x,y);
	      y.rShiftTo(1,y);
	    }
	  }
	  if(g > 0) y.lShiftTo(g,y);
	  return y;
	}

	// (protected) this % n, n < 2^26
	function bnpModInt(n) {
	  if(n <= 0) return 0;
	  var d = this.DV%n, r = (this.s<0)?n-1:0;
	  if(this.t > 0)
	    if(d == 0) r = this[0]%n;
	    else for(var i = this.t-1; i >= 0; --i) r = (d*r+this[i])%n;
	  return r;
	}

	// (public) 1/this % m (HAC 14.61)
	function bnModInverse(m) {
	  var ac = m.isEven();
	  if((this.isEven() && ac) || m.signum() == 0) return BigInteger.ZERO;
	  var u = m.clone(), v = this.clone();
	  var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);
	  while(u.signum() != 0) {
	    while(u.isEven()) {
	      u.rShiftTo(1,u);
	      if(ac) {
	        if(!a.isEven() || !b.isEven()) { a.addTo(this,a); b.subTo(m,b); }
	        a.rShiftTo(1,a);
	      }
	      else if(!b.isEven()) b.subTo(m,b);
	      b.rShiftTo(1,b);
	    }
	    while(v.isEven()) {
	      v.rShiftTo(1,v);
	      if(ac) {
	        if(!c.isEven() || !d.isEven()) { c.addTo(this,c); d.subTo(m,d); }
	        c.rShiftTo(1,c);
	      }
	      else if(!d.isEven()) d.subTo(m,d);
	      d.rShiftTo(1,d);
	    }
	    if(u.compareTo(v) >= 0) {
	      u.subTo(v,u);
	      if(ac) a.subTo(c,a);
	      b.subTo(d,b);
	    }
	    else {
	      v.subTo(u,v);
	      if(ac) c.subTo(a,c);
	      d.subTo(b,d);
	    }
	  }
	  if(v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
	  if(d.compareTo(m) >= 0) return d.subtract(m);
	  if(d.signum() < 0) d.addTo(m,d); else return d;
	  if(d.signum() < 0) return d.add(m); else return d;
	}

	var lowprimes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997];
	var lplim = (1<<26)/lowprimes[lowprimes.length-1];

	// (public) test primality with certainty >= 1-.5^t
	function bnIsProbablePrime(t) {
	  var i, x = this.abs();
	  if(x.t == 1 && x[0] <= lowprimes[lowprimes.length-1]) {
	    for(i = 0; i < lowprimes.length; ++i)
	      if(x[0] == lowprimes[i]) return true;
	    return false;
	  }
	  if(x.isEven()) return false;
	  i = 1;
	  while(i < lowprimes.length) {
	    var m = lowprimes[i], j = i+1;
	    while(j < lowprimes.length && m < lplim) m *= lowprimes[j++];
	    m = x.modInt(m);
	    while(i < j) if(m%lowprimes[i++] == 0) return false;
	  }
	  return x.millerRabin(t);
	}

	// (protected) true if probably prime (HAC 4.24, Miller-Rabin)
	function bnpMillerRabin(t) {
	  var n1 = this.subtract(BigInteger.ONE);
	  var k = n1.getLowestSetBit();
	  if(k <= 0) return false;
	  var r = n1.shiftRight(k);
	  t = (t+1)>>1;
	  if(t > lowprimes.length) t = lowprimes.length;
	  var a = nbi();
	  for(var i = 0; i < t; ++i) {
	    //Pick bases at random, instead of starting at 2
	    a.fromInt(lowprimes[Math.floor(Math.random()*lowprimes.length)]);
	    var y = a.modPow(r,this);
	    if(y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
	      var j = 1;
	      while(j++ < k && y.compareTo(n1) != 0) {
	        y = y.modPowInt(2,this);
	        if(y.compareTo(BigInteger.ONE) == 0) return false;
	      }
	      if(y.compareTo(n1) != 0) return false;
	    }
	  }
	  return true;
	}


	// protected
	BigInteger.prototype.chunkSize = bnpChunkSize;
	BigInteger.prototype.toRadix = bnpToRadix;
	BigInteger.prototype.fromRadix = bnpFromRadix;
	BigInteger.prototype.fromNumber = bnpFromNumber;
	BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
	BigInteger.prototype.changeBit = bnpChangeBit;
	BigInteger.prototype.addTo = bnpAddTo;
	BigInteger.prototype.dMultiply = bnpDMultiply;
	BigInteger.prototype.dAddOffset = bnpDAddOffset;
	BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
	BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
	BigInteger.prototype.modInt = bnpModInt;
	BigInteger.prototype.millerRabin = bnpMillerRabin;

	BigInteger.prototype.copyTo = bnpCopyTo;
	BigInteger.prototype.fromInt = bnpFromInt;
	BigInteger.prototype.fromString = bnpFromString;
	BigInteger.prototype.clamp = bnpClamp;
	BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
	BigInteger.prototype.drShiftTo = bnpDRShiftTo;
	BigInteger.prototype.lShiftTo = bnpLShiftTo;
	BigInteger.prototype.rShiftTo = bnpRShiftTo;
	BigInteger.prototype.subTo = bnpSubTo;
	BigInteger.prototype.multiplyTo = bnpMultiplyTo;
	BigInteger.prototype.squareTo = bnpSquareTo;
	BigInteger.prototype.divRemTo = bnpDivRemTo;
	BigInteger.prototype.invDigit = bnpInvDigit;
	BigInteger.prototype.isEven = bnpIsEven;
	BigInteger.prototype.exp = bnpExp;

	// public
	BigInteger.prototype.toString = bnToString;
	BigInteger.prototype.negate = bnNegate;
	BigInteger.prototype.abs = bnAbs;
	BigInteger.prototype.compareTo = bnCompareTo;
	BigInteger.prototype.bitLength = bnBitLength;
	BigInteger.prototype.mod = bnMod;
	BigInteger.prototype.modPowInt = bnModPowInt;

	BigInteger.prototype.clone = bnClone;
	BigInteger.prototype.intValue = bnIntValue;
	BigInteger.prototype.byteValue = bnByteValue;
	BigInteger.prototype.shortValue = bnShortValue;
	BigInteger.prototype.signum = bnSigNum;
	BigInteger.prototype.toByteArray = bnToByteArray;
	BigInteger.prototype.equals = bnEquals;
	BigInteger.prototype.min = bnMin;
	BigInteger.prototype.max = bnMax;
	BigInteger.prototype.and = bnAnd;
	BigInteger.prototype.or = bnOr;
	BigInteger.prototype.xor = bnXor;
	BigInteger.prototype.andNot = bnAndNot;
	BigInteger.prototype.not = bnNot;
	BigInteger.prototype.shiftLeft = bnShiftLeft;
	BigInteger.prototype.shiftRight = bnShiftRight;
	BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
	BigInteger.prototype.bitCount = bnBitCount;
	BigInteger.prototype.testBit = bnTestBit;
	BigInteger.prototype.setBit = bnSetBit;
	BigInteger.prototype.clearBit = bnClearBit;
	BigInteger.prototype.flipBit = bnFlipBit;
	BigInteger.prototype.add = bnAdd;
	BigInteger.prototype.subtract = bnSubtract;
	BigInteger.prototype.multiply = bnMultiply;
	BigInteger.prototype.divide = bnDivide;
	BigInteger.prototype.remainder = bnRemainder;
	BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
	BigInteger.prototype.modPow = bnModPow;
	BigInteger.prototype.modInverse = bnModInverse;
	BigInteger.prototype.pow = bnPow;
	BigInteger.prototype.gcd = bnGCD;
	BigInteger.prototype.isProbablePrime = bnIsProbablePrime;

	// JSBN-specific extension
	BigInteger.prototype.square = bnSquare;

	// "constants"
	BigInteger.ZERO = nbv(0);
	BigInteger.ONE = nbv(1);

	// BigInteger interfaces not implemented in jsbn:

	// BigInteger(int signum, byte[] magnitude)
	// double doubleValue()
	// float floatValue()
	// int hashCode()
	// long longValue()
	// static BigInteger valueOf(long val)

	BigInteger.valueOf = nbi;

	exports.BigInteger = BigInteger;


/***/ },

/***/ 30:
/***/ function(module, exports, require) {

	var hasOwn = Object.prototype.hasOwnProperty;
	var toString = Object.prototype.toString;

	function isPlainObject(obj) {
		if (!obj || toString.call(obj) !== '[object Object]' || obj.nodeType || obj.setInterval)
			return false;

		var has_own_constructor = hasOwn.call(obj, 'constructor');
		var has_is_property_of_method = hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
		// Not own constructor property must be Object
		if (obj.constructor && !has_own_constructor && !has_is_property_of_method)
			return false;

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	};

	module.exports = function extend() {
		var options, name, src, copy, copyIsArray, clone,
		    target = arguments[0] || {},
		    i = 1,
		    length = arguments.length,
		    deep = false;

		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && typeof target !== "function") {
			target = {};
		}

		for ( ; i < length; i++ ) {
			// Only deal with non-null/undefined values
			if ( (options = arguments[ i ]) != null ) {
				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];

					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( isPlainObject(copy) || (copyIsArray = Array.isArray(copy)) ) ) {
						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && Array.isArray(src) ? src : [];

						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[ name ] = extend( deep, clone, copy );

					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};


/***/ },

/***/ 31:
/***/ function(module, exports, require) {

	var utils   = require(11);
	var sjcl    = utils.sjcl;
	var config  = require(13);

	var BigInteger = utils.jsbn.BigInteger;

	var Base = require(5).Base;

	//
	// Abstract UInt class
	//
	// Base class for UInt??? classes
	//

	var UInt = function () {
	  // Internal form: NaN or BigInteger
	  this._value  = NaN;
	};

	UInt.json_rewrite = function (j, opts) {
	  return this.from_json(j).to_json(opts);
	};

	// Return a new UInt from j.
	UInt.from_generic = function (j) {
	  if (j instanceof this) {
	    return j.clone();
	  } else {
	    return (new this()).parse_generic(j);
	  }
	};

	// Return a new UInt from j.
	UInt.from_hex = function (j) {
	  if (j instanceof this) {
	    return j.clone();
	  } else {
	    return (new this()).parse_hex(j);
	  }
	};

	// Return a new UInt from j.
	UInt.from_json = function (j) {
	  if (j instanceof this) {
	    return j.clone();
	  } else {
	    return (new this()).parse_json(j);
	  }
	};

	// Return a new UInt from j.
	UInt.from_bits = function (j) {
	  if (j instanceof this) {
	    return j.clone();
	  } else {
	    return (new this()).parse_bits(j);
	  }
	};

	// Return a new UInt from j.
	UInt.from_bytes = function (j) {
	  if (j instanceof this) {
	    return j.clone();
	  } else {
	    return (new this()).parse_bytes(j);
	  }
	};

	// Return a new UInt from j.
	UInt.from_bn = function (j) {
	  if (j instanceof this) {
	    return j.clone();
	  } else {
	    return (new this()).parse_bn(j);
	  }
	};

	UInt.is_valid = function (j) {
	  return this.from_json(j).is_valid();
	};

	UInt.prototype.clone = function () {
	  return this.copyTo(new this.constructor());
	};

	// Returns copy.
	UInt.prototype.copyTo = function (d) {
	  d._value = this._value;

	  return d;
	};

	UInt.prototype.equals = function (d) {
	  return this._value instanceof BigInteger && d._value instanceof BigInteger && this._value.equals(d._value);
	};

	UInt.prototype.is_valid = function () {
	  return this._value instanceof BigInteger;
	};

	UInt.prototype.is_zero = function () {
	  return this._value.equals(BigInteger.ZERO);
	};

	// value = NaN on error.
	UInt.prototype.parse_generic = function (j) {
	  // Canonicalize and validate
	  if (config.accounts && j in config.accounts)
	    j = config.accounts[j].account;

	  switch (j) {
	  case undefined:
	  case "0":
	  case this.constructor.STR_ZERO:
	  case this.constructor.ACCOUNT_ZERO:
	  case this.constructor.HEX_ZERO:
	    this._value  = BigInteger.valueOf();
	    break;

	  case "1":
	  case this.constructor.STR_ONE:
	  case this.constructor.ACCOUNT_ONE:
	  case this.constructor.HEX_ONE:
	    this._value  = new BigInteger([1]);

	    break;

	  default:
	    if ('string' !== typeof j) {
		    this._value  = NaN;
	    }
	    else if (this.constructor.width === j.length) {
		    this._value  = new BigInteger(utils.stringToArray(j), 256);
	    }
	    else if ((this.constructor.width*2) === j.length) {
		    // XXX Check char set!
		    this._value  = new BigInteger(j, 16);
	    }
	    else {
		    this._value  = NaN;
	    }
	  }

	  return this;
	};

	UInt.prototype.parse_hex = function (j) {
	  if ('string' === typeof j &&
	      j.length === (this.constructor.width * 2)) {
	    this._value  = new BigInteger(j, 16);
	  } else {
	    this._value  = NaN;
	  }

	  return this;
	};

	UInt.prototype.parse_bits = function (j) {
	  if (sjcl.bitArray.bitLength(j) !== this.constructor.width * 8) {
	    this._value = NaN;
	  } else {
	    var bytes = sjcl.codec.bytes.fromBits(j);
	    this.parse_bytes(bytes);
	  }

	  return this;
	};


	UInt.prototype.parse_bytes = function (j) {
	  if (!Array.isArray(j) || j.length !== this.constructor.width) {
		this._value = NaN;
	  } else {
		  this._value  = new BigInteger([0].concat(j), 256);
	  }

	  return this;
	};


	UInt.prototype.parse_json = UInt.prototype.parse_hex;

	UInt.prototype.parse_bn = function (j) {
	  if (j instanceof sjcl.bn &&
	      j.bitLength() <= this.constructor.width * 8) {
	    var bytes = sjcl.codec.bytes.fromBits(j.toBits());
		  this._value  = new BigInteger(bytes, 256);
	  } else {
	    this._value = NaN;
	  }

	  return this;
	};

	// Convert from internal form.
	UInt.prototype.to_bytes = function () {
	  if (!(this._value instanceof BigInteger))
	    return null;

	  var bytes  = this._value.toByteArray();
	  bytes = bytes.map(function (b) { return (b+256) % 256; });
	  var target = this.constructor.width;

	  // XXX Make sure only trim off leading zeros.
	  bytes = bytes.slice(-target);
	  while (bytes.length < target) bytes.unshift(0);

	  return bytes;
	};

	UInt.prototype.to_hex = function () {
	  if (!(this._value instanceof BigInteger))
	    return null;

	  var bytes = this.to_bytes();
	  return sjcl.codec.hex.fromBits(sjcl.codec.bytes.toBits(bytes)).toUpperCase();
	};

	UInt.prototype.to_json = UInt.prototype.to_hex;

	UInt.prototype.to_bits = function () {
	  if (!(this._value instanceof BigInteger))
	    return null;

	  var bytes = this.to_bytes();

	  return sjcl.codec.bytes.toBits(bytes);
	};

	UInt.prototype.to_bn = function () {
	  if (!(this._value instanceof BigInteger))
	    return null;

	  var bits = this.to_bits();

	  return sjcl.bn.fromBits(bits);
	};

	exports.UInt = UInt;

	// vim:sw=2:sts=2:ts=8:et


/***/ },

/***/ 32:
/***/ function(module, exports, require) {

	var util         = require(26);
	var EventEmitter = require(25).EventEmitter;
	var RippleError  = require(9).RippleError;
	var Queue        = require(42).TransactionQueue;
	var Amount       = require(3);

	/**
	 * @constructor TransactionManager
	 * @param {Object} account
	 */

	function TransactionManager(account) {
	  EventEmitter.call(this);

	  var self = this;

	  this.account             = account;
	  this.remote              = account._remote;
	  this._timeout            = void(0);
	  this._pending            = new Queue;
	  this._next_sequence      = void(0);
	  this._cache              = { };
	  this._sequence_cache     = { };
	  this._max_fee            = this.remote.max_fee;
	  this._submission_timeout = this.remote._submission_timeout;

	  // Query remote server for next account
	  // transaction sequence number
	  this._load_sequence();

	  function cache_transaction(res) {
	    var transaction = TransactionManager.normalize_transaction(res);
	    var sequence = transaction.tx_json.Sequence;
	    var hash = transaction.hash;

	    self._sequence_cache[sequence] = transaction;

	    var pending = self._pending.get('_hash', hash);

	    self.remote._trace('transactionmanager: transaction_received: %s', transaction.tx_json);

	    if (pending) {
	      pending.emit('success', res);
	    } else {
	      self._cache[hash] = res;
	    }
	  };

	  this.account.on('transaction-outbound', cache_transaction);

	  function adjust_fees() {
	    self._pending.forEach(function(pending) {
	      if (self.remote.local_fee && pending.tx_json.Fee) {
	        var old_fee = pending.tx_json.Fee;
	        var new_fee = self.remote.fee_tx(pending.fee_units()).to_json();
	        pending.tx_json.Fee = new_fee;
	        pending.emit('fee_adjusted', old_fee, new_fee);
	        self.remote._trace('transactionmanager: adjusting_fees: %s', pending, old_fee, new_fee);
	      }
	    });
	  };

	  this.remote.on('load_changed', adjust_fees);

	  function update_pending_status(ledger) {
	    self._pending.forEach(function(pending) {
	      pending.last_ledger = ledger;
	      switch (ledger.ledger_index - pending.submit_index) {
	        case 8:
	          pending.emit('lost', ledger);
	          pending.emit('error', new RippleError('tejLost', 'Transaction lost'));
	          self.remote._trace('transactionmanager: update_pending: %s', pending.tx_json);
	          break;
	        case 4:
	          pending.set_state('client_missing');
	          pending.emit('missing', ledger);
	          break;
	      }
	    });
	  };

	  this.remote.on('ledger_closed', update_pending_status);

	  function remote_reconnected() {
	    //Load account transaction history
	    var options = {
	      account: self.account._account_id,
	      ledger_index_min: -1,
	      ledger_index_max: -1,
	      limit: 10
	    }

	    self.remote.request_account_tx(options, function(err, transactions) {
	      if (!err && transactions.transactions) {
	        transactions.transactions.forEach(cache_transaction);
	      }
	      self.remote.on('ledger_closed', update_pending_status);
	    });

	    //Load next transaction sequence
	    self._load_sequence(function() {
	      self._resubmit(3);
	    });
	  };

	  function remote_disconnected() {
	    self.remote.once('connect', remote_reconnected);
	    self.remote.removeListener('ledger_closed', update_pending_status);
	  };

	  this.remote.on('disconnect', remote_disconnected);
	};

	util.inherits(TransactionManager, EventEmitter);

	//Normalize transactions received from account
	//transaction stream and account_tx
	TransactionManager.normalize_transaction = function(tx) {
	  if (tx.tx) {
	    tx.transaction = tx.tx;
	  }

	  var hash     = tx.transaction.hash;
	  var sequence = tx.transaction.Sequence;

	  var transaction = {
	    ledger_hash:   tx.ledger_hash || tx.transaction.ledger_hash,
	    ledger_index:  tx.ledger_index || tx.transaction.ledger_index,
	    metadata:      tx.meta,
	    tx_json:       tx.transaction
	  }

	  transaction.hash = hash;
	  transaction._hash = hash;
	  transaction.tx_json.ledger_index = transaction.ledger_index;
	  transaction.tx_json.inLedger = transaction.ledger_index;

	  return transaction;
	};

	//Fill an account transaction sequence
	TransactionManager.prototype._fill_sequence = function(tx, callback) {
	  var fill = this.remote.transaction();
	  fill.account_set(this.account._account_id);
	  fill.tx_json.Sequence = tx.tx_json.Sequence - 1;
	  fill.submit(callback);
	};

	TransactionManager.prototype._load_sequence = function(callback) {
	  var self = this;

	  function sequence_loaded(err, sequence) {
	    if (typeof sequence === 'number') {
	      self._next_sequence = sequence;
	      self.emit('sequence_loaded', sequence);
	    } else {
	      return setTimeout(function() {
	        self._load_sequence(callback);
	      }, 1000 * 3);
	    }
	    if (typeof callback === 'function') {
	      callback(err, sequence);
	    }
	  };

	  this.account.get_next_sequence(sequence_loaded);
	};

	TransactionManager.prototype._resubmit = function(wait_ledgers, pending) {
	  var self = this;
	  var pending = pending ? [ pending ] : this._pending;

	  if (wait_ledgers) {
	    var ledgers = Number(wait_ledgers) || 3;
	    this._wait_ledgers(ledgers, function() {
	      pending.forEach(resubmit_transaction);
	    });
	  } else {
	    pending.forEach(resubmit_transaction);
	  }

	  function resubmit_transaction(pending) {
	    if (!pending || pending.finalized) {
	      // Transaction has been finalized, nothing to do
	      return;
	    }

	    var hash_cached = self._cache[pending._hash];

	    self.remote._trace('transactionmanager: resubmit: %s', pending.tx_json);

	    if (hash_cached) {
	      pending.emit('success', hash_cached);
	    } else {

	      while (self._sequence_cache[pending.tx_json.Sequence]) {
	        //Sequence number has been consumed by another transaction
	        self.remote._trace('transactionmanager: incrementing sequence: %s', pending);
	        pending.tx_json.Sequence += 1;
	      }

	      pending.once('submitted', function() {
	        pending.emit('resubmitted');
	        self._load_sequence();
	      });

	      self._request(pending);
	    }
	  }
	};

	TransactionManager.prototype._wait_ledgers = function(ledgers, callback) {
	  var self = this;
	  var closes = 0;

	  function ledger_closed() {
	    if (++closes === ledgers) {
	      callback();
	      self.remote.removeListener('ledger_closed', ledger_closed);
	    }
	  };

	  this.remote.on('ledger_closed', ledger_closed);
	};

	TransactionManager.prototype._request = function(tx) {
	  var self   = this;
	  var remote = this.remote;

	  if (tx.attempts > 10) {
	    tx.emit('error', new RippleError('tejAttemptsExceeded'));
	    return;
	  }

	  var submit_request = remote.request_submit();

	  submit_request.build_path(tx._build_path);

	  if (remote.local_signing) {
	    tx.sign();
	    submit_request.tx_blob(tx.serialize().to_hex());
	  } else {
	    submit_request.secret(tx._secret);
	    submit_request.tx_json(tx.tx_json);
	  }

	  tx._hash = tx.hash();

	  self.remote._trace('transactionmanager: submit: %s', tx.tx_json);

	  function transaction_proposed(message) {
	    tx.set_state('client_proposed');
	    // If server is honest, don't expect a final if rejected.
	    message.rejected = tx.isRejected(message.engine_result_code)
	    tx.emit('proposed', message);
	  };

	  function transaction_failed(message) {
	    switch (message.engine_result) {
	      case 'tefPAST_SEQ':
	        self._resubmit(3, tx);
	      break;
	      default:
	        submission_error(message);
	    }
	  };

	  function transaction_retry(message) {
	    switch (message.engine_result) {
	      case 'terPRE_SEQ':
	        self._fill_sequence(tx, function() {
	          self._resubmit(2, tx);
	        });
	        break;
	      default:
	        self._resubmit(1, tx);
	    }
	  };

	  function submission_error(error) {
	    if (self._is_too_busy(error)) {
	      self._resubmit(1, tx);
	    } else {
	      self._next_sequence--;
	      tx.set_state('remoteError');
	      tx.emit('submitted', error);
	      tx.emit('error', error);
	    }
	  };

	  function submission_success(message) {
	    if (message.tx_json.hash) {
	      tx._hash = message.tx_json.hash;
	    }

	    self.remote._trace('transactionmanager: submit_response: %s', message);

	    message.result = message.engine_result || '';

	    tx.emit('submitted', message);

	    switch (message.result.slice(0, 3)) {
	      case 'tec':
	        tx.emit('error', message);
	        break;
	      case 'tes':
	        transaction_proposed(message);
	        break;
	      case 'tef':
	        transaction_failed(message);
	        break;
	      case 'ter':
	        transaction_retry(message);
	        break;
	      default:
	        submission_error(message);
	    }
	  };

	  submit_request.once('success', submission_success);
	  submit_request.once('error', submission_error);

	  submit_request.timeout(this._submission_timeout, function() {
	    tx.emit('timeout');
	    if (self.remote._connected) {
	      self.remote._trace('transactionmanager: timeout: %s', tx.tx_json);
	      self._resubmit(3, tx);
	    }
	  });

	  submit_request.broadcast();

	  tx.set_state('client_submitted');
	  tx.attempts++;

	  return submit_request;
	};

	TransactionManager.prototype._is_remote_error = function(error) {
	  return error && typeof error === 'object'
	      && error.error === 'remoteError'
	      && typeof error.remote === 'object'
	};

	TransactionManager.prototype._is_not_found = function(error) {
	  return this._is_remote_error(error) && /^(txnNotFound|transactionNotFound)$/.test(error.remote.error);
	};

	TransactionManager.prototype._is_too_busy = function(error) {
	  return this._is_remote_error(error) && error.remote.error === 'tooBusy';
	};

	/**
	 * Entry point for TransactionManager submission
	 *
	 * @param {Object} tx
	 */

	TransactionManager.prototype.submit = function(tx) {
	  var self = this;

	  // If sequence number is not yet known, defer until it is.
	  if (typeof this._next_sequence === 'undefined') {
	    this.once('sequence_loaded', function() {
	      self.submit(tx);
	    });
	    return;
	  }

	  if (typeof tx.tx_json.Sequence !== 'number') {
	    tx.tx_json.Sequence = this._next_sequence++;
	  }

	  tx.submit_index = this.remote._ledger_current_index;
	  tx.last_ledger  = void(0);
	  tx.attempts     = 0;
	  tx.complete();

	  function finalize(message) {
	    if (!tx.finalized) {
	      self._pending.removeHash(tx._hash);
	      self.remote._trace('transactionmanager: finalize_transaction: %s', message.tx_json);
	      tx.finalized = true;
	      tx.emit('final', message);
	    }
	  };

	  tx.on('error', finalize);
	  tx.once('success', finalize);

	  tx.once('abort', function() {
	    tx.emit('error', new RippleError('tejAbort', 'Transaction aborted'));
	  });

	  var fee = Number(tx.tx_json.Fee);
	  var remote = this.remote;

	  if (!tx._secret && !tx.tx_json.TxnSignature) {
	    tx.emit('error', new RippleError('tejSecretUnknown', 'Missing secret'));
	  } else if (!remote.trusted && !remote.local_signing) {
	    tx.emit('error', new RippleError('tejServerUntrusted', 'Attempt to give secret to untrusted server'));
	  } else if (fee && fee > this._max_fee) {
	    tx.emit('error', new RippleError('tejMaxFeeExceeded', 'Max fee exceeded'));
	  } else {
	    this._pending.push(tx);
	    this._request(tx);
	  }
	};

	exports.TransactionManager = TransactionManager;


/***/ },

/***/ 33:
/***/ function(module, exports, require) {

	var sjcl    = require(11).sjcl;

	var UInt160 = require(15).UInt160;
	var UInt256 = require(22).UInt256;

	function KeyPair() {
	  this._curve  = sjcl.ecc.curves['c256'];
	  this._secret = null;
	  this._pubkey = null;
	};

	KeyPair.from_bn_secret = function (j) {
	  return j instanceof this ? j.clone() : (new this()).parse_bn_secret(j);
	};

	KeyPair.prototype.parse_bn_secret = function (j) {
	  this._secret = new sjcl.ecc.ecdsa.secretKey(sjcl.ecc.curves['c256'], j);
	  return this;
	};

	/**
	 * Returns public key as sjcl public key.
	 *
	 * @private
	 */
	KeyPair.prototype._pub = function () {
	  var curve = this._curve;

	  if (!this._pubkey && this._secret) {
	    var exponent = this._secret._exponent;
	    this._pubkey = new sjcl.ecc.ecdsa.publicKey(curve, curve.G.mult(exponent));
	  }

	  return this._pubkey;
	};

	/**
	 * Returns public key in compressed format as bit array.
	 *
	 * @private
	 */
	KeyPair.prototype._pub_bits = function () {
	  var pub = this._pub();

	  if (!pub) {
	    return null;
	  }

	  var point = pub._point, y_even = point.y.mod(2).equals(0);

	  return sjcl.bitArray.concat(
	    [sjcl.bitArray.partial(8, y_even ? 0x02 : 0x03)],
	    point.x.toBits(this._curve.r.bitLength())
	  );
	};

	/**
	 * Returns public key as hex.
	 *
	 * Key will be returned as a compressed pubkey - 33 bytes converted to hex.
	 */
	KeyPair.prototype.to_hex_pub = function () {
	  var bits = this._pub_bits();

	  if (!bits) {
	    return null;
	  }

	  return sjcl.codec.hex.fromBits(bits).toUpperCase();
	};

	function SHA256_RIPEMD160(bits) {
	  return sjcl.hash.ripemd160.hash(sjcl.hash.sha256.hash(bits));
	}

	KeyPair.prototype.get_address = function () {
	  var bits = this._pub_bits();

	  if (!bits) {
	    return null;
	  }

	  var hash = SHA256_RIPEMD160(bits);

	  return UInt160.from_bits(hash);
	};

	KeyPair.prototype.sign = function (hash) {
	  var hash = UInt256.from_json(hash);
	  return this._secret.signDER(hash.to_bits(), 0);
	};

	exports.KeyPair = KeyPair;


/***/ },

/***/ 34:
/***/ function(module, exports, require) {

	var sjcl    = require(11).sjcl;
	var utils   = require(11);
	var config  = require(13);
	var extend  = require(30);

	var BigInteger = utils.jsbn.BigInteger;

	var UInt = require(31).UInt,
	    Base = require(5).Base;

	//
	// UInt128 support
	//

	var UInt128 = extend(function () {
	  // Internal form: NaN or BigInteger
	  this._value  = NaN;
	}, UInt);

	UInt128.width = 16;
	UInt128.prototype = extend({}, UInt.prototype);
	UInt128.prototype.constructor = UInt128;

	var HEX_ZERO     = UInt128.HEX_ZERO = "00000000000000000000000000000000";
	var HEX_ONE      = UInt128.HEX_ONE  = "00000000000000000000000000000000";
	var STR_ZERO     = UInt128.STR_ZERO = utils.hexToString(HEX_ZERO);
	var STR_ONE      = UInt128.STR_ONE = utils.hexToString(HEX_ONE);

	exports.UInt128 = UInt128;


/***/ },

/***/ 35:
/***/ function(module, exports, require) {

	exports.readIEEE754 = function(buffer, offset, isBE, mLen, nBytes) {
	  var e, m,
	      eLen = nBytes * 8 - mLen - 1,
	      eMax = (1 << eLen) - 1,
	      eBias = eMax >> 1,
	      nBits = -7,
	      i = isBE ? 0 : (nBytes - 1),
	      d = isBE ? 1 : -1,
	      s = buffer[offset + i];

	  i += d;

	  e = s & ((1 << (-nBits)) - 1);
	  s >>= (-nBits);
	  nBits += eLen;
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

	  m = e & ((1 << (-nBits)) - 1);
	  e >>= (-nBits);
	  nBits += mLen;
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity);
	  } else {
	    m = m + Math.pow(2, mLen);
	    e = e - eBias;
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
	};

	exports.writeIEEE754 = function(buffer, value, offset, isBE, mLen, nBytes) {
	  var e, m, c,
	      eLen = nBytes * 8 - mLen - 1,
	      eMax = (1 << eLen) - 1,
	      eBias = eMax >> 1,
	      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
	      i = isBE ? (nBytes - 1) : 0,
	      d = isBE ? -1 : 1,
	      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

	  value = Math.abs(value);

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0;
	    e = eMax;
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2);
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }
	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * Math.pow(2, 1 - eBias);
	    }
	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }

	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
	      e = 0;
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

	  e = (e << mLen) | m;
	  eLen += mLen;
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

	  buffer[offset + i - d] |= s * 128;
	};


/***/ },

/***/ 36:
/***/ function(module, exports, require) {

	module.exports = typeof Array.isArray === 'function'
	    ? Array.isArray
	    : function (xs) {
	        return Object.prototype.toString.call(xs) === '[object Array]'
	    }
	;

	/*

	alternative

	function isArray(ar) {
	  return ar instanceof Array ||
	         Array.isArray(ar) ||
	         (ar && ar !== Object.prototype && isArray(ar.__proto__));
	}

	*/

/***/ },

/***/ 37:
/***/ function(module, exports, require) {

	module.exports = function indexOf (xs, x) {
	    if (xs.indexOf) return xs.indexOf(x);
	    for (var i = 0; i < xs.length; i++) {
	        if (x === xs[i]) return i;
	    }
	    return -1;
	}


/***/ },

/***/ 38:
/***/ function(module, exports, require) {

	module.exports = Object.keys || function objectKeys(object) {
		if (object !== Object(object)) throw new TypeError('Invalid object');
		var result = [];
		for (var name in object) {
			if (Object.prototype.hasOwnProperty.call(object, name)) {
				result.push(name);
			}
		}
		return result;
	};


/***/ },

/***/ 39:
/***/ function(module, exports, require) {

	module.exports = Object.getOwnPropertyNames || function (obj) {
	    var res = [];
	    for (var key in obj) {
	        if (Object.hasOwnProperty.call(obj, key)) res.push(key);
	    }
	    return res;
	};

/***/ },

/***/ 40:
/***/ function(module, exports, require) {

	module.exports = Object.create || function (prototype, properties) {
	    // from es5-shim
	    var object;
	    if (prototype === null) {
	        object = { '__proto__' : null };
	    }
	    else {
	        if (typeof prototype !== 'object') {
	            throw new TypeError(
	                'typeof prototype[' + (typeof prototype) + '] != \'object\''
	            );
	        }
	        var Type = function () {};
	        Type.prototype = prototype;
	        object = new Type();
	        object.__proto__ = prototype;
	    }
	    if (typeof properties !== 'undefined' && Object.defineProperties) {
	        Object.defineProperties(object, properties);
	    }
	    return object;
	};

/***/ },

/***/ 41:
/***/ function(module, exports, require) {

	module.exports = function isRegExp(re) {
	  return re instanceof RegExp ||
	    (typeof re === 'object' && Object.prototype.toString.call(re) === '[object RegExp]');
	}

/***/ },

/***/ 42:
/***/ function(module, exports, require) {

	
	function TransactionQueue() {
	  var self = this;

	  this._queue  = [ ];

	  Object.defineProperty(this, '_length', {
	    get: function() { return self._queue.length }
	  });
	}

	TransactionQueue.prototype.length = function() {
	  return this._queue.length;
	};

	TransactionQueue.prototype.indexOf = function(prop, val) {
	  var index = -1;
	  for (var i=0, tx; tx=this._queue[i]; i++) {
	    if (tx[prop] === val) {
	      index = i;
	      break;
	    }
	  }
	  return index;
	};

	TransactionQueue.prototype.hasHash = function(hash) {
	  return this.indexOf('hash', hash) !== -1;
	};

	TransactionQueue.prototype.get = function(prop, val) {
	  var index = this.indexOf(prop, val);
	  return index > -1 ? this._queue[index] : false;
	};

	TransactionQueue.prototype.removeSequence = function(sequence) {
	  var result = [ ];
	  for (var i=0, tx; tx=this._queue[i]; i++) {
	    if (!tx.tx_json) continue;
	    if (tx.tx_json.Sequence !== sequence) result.push(tx);
	  }
	  this._queue = result;
	};

	TransactionQueue.prototype.removeHash = function(hash) {
	  var result = [ ];
	  for (var i=0, tx; tx=this._queue[i]; i++) {
	    if (!tx.tx_json) continue;
	    if (tx._hash !== hash) result.push(tx);
	  }
	  this._queue = result;
	};

	TransactionQueue.prototype.forEach = function() {
	  Array.prototype.forEach.apply(this._queue, arguments);
	};

	TransactionQueue.prototype.push = function() {
	  Array.prototype.push.apply(this._queue, arguments);
	};

	exports.TransactionQueue = TransactionQueue;


/***/ },

/***/ 43:
/***/ function(module, exports, require) {

	(function (exports) {
		'use strict';

		var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

		function b64ToByteArray(b64) {
			var i, j, l, tmp, placeHolders, arr;
		
			if (b64.length % 4 > 0) {
				throw 'Invalid string. Length must be a multiple of 4';
			}

			// the number of equal signs (place holders)
			// if there are two placeholders, than the two characters before it
			// represent one byte
			// if there is only one, then the three characters before it represent 2 bytes
			// this is just a cheap hack to not do indexOf twice
			placeHolders = b64.indexOf('=');
			placeHolders = placeHolders > 0 ? b64.length - placeHolders : 0;

			// base64 is 4/3 + up to two characters of the original data
			arr = [];//new Uint8Array(b64.length * 3 / 4 - placeHolders);

			// if there are placeholders, only get up to the last complete 4 chars
			l = placeHolders > 0 ? b64.length - 4 : b64.length;

			for (i = 0, j = 0; i < l; i += 4, j += 3) {
				tmp = (lookup.indexOf(b64[i]) << 18) | (lookup.indexOf(b64[i + 1]) << 12) | (lookup.indexOf(b64[i + 2]) << 6) | lookup.indexOf(b64[i + 3]);
				arr.push((tmp & 0xFF0000) >> 16);
				arr.push((tmp & 0xFF00) >> 8);
				arr.push(tmp & 0xFF);
			}

			if (placeHolders === 2) {
				tmp = (lookup.indexOf(b64[i]) << 2) | (lookup.indexOf(b64[i + 1]) >> 4);
				arr.push(tmp & 0xFF);
			} else if (placeHolders === 1) {
				tmp = (lookup.indexOf(b64[i]) << 10) | (lookup.indexOf(b64[i + 1]) << 4) | (lookup.indexOf(b64[i + 2]) >> 2);
				arr.push((tmp >> 8) & 0xFF);
				arr.push(tmp & 0xFF);
			}

			return arr;
		}

		function uint8ToBase64(uint8) {
			var i,
				extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
				output = "",
				temp, length;

			function tripletToBase64 (num) {
				return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
			};

			// go through the array every three bytes, we'll deal with trailing stuff later
			for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
				temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
				output += tripletToBase64(temp);
			}

			// pad the end with zeros, but make sure to not forget the extra bytes
			switch (extraBytes) {
				case 1:
					temp = uint8[uint8.length - 1];
					output += lookup[temp >> 2];
					output += lookup[(temp << 4) & 0x3F];
					output += '==';
					break;
				case 2:
					temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1]);
					output += lookup[temp >> 10];
					output += lookup[(temp >> 4) & 0x3F];
					output += lookup[(temp << 2) & 0x3F];
					output += '=';
					break;
			}

			return output;
		}

		module.exports.toByteArray = b64ToByteArray;
		module.exports.fromByteArray = uint8ToBase64;
	}());


/***/ }
/******/ })