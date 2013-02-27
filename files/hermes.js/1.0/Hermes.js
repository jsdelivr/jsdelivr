/**
 * Hermes is the class that allows to log messages to different appender depending of level to show.
 * Highly extensible. You can create your own Appender and add it to Hermes.
 * The idea was to create a handler for error and messages in the same way as Log4JS but being more extensible.
 * @author Tomas Corral
 * @fileOverview
 */
(function (win, doc, ns, und) {
	'use strict';
	var Hermes, oHerm, oHermes, Level, Message, Appender, Layout;
	/**
	 * If ns is undefined we change it to window
	 */
	if(ns === und)
	{
		ns = win;
	}

	/**
	 * getTypeFromMessage returns the type of error extracted from message
	 * @private
	 * @returns {String}
	 */
	function getTypeFromMessage(sMessage) {
		return sMessage.substr(0, sMessage.indexOf(":"));
	}

	/**
	 * removeTypeFromMessage returns the message removing the error type
	 * @private
	 * @returns {String}
	 */
	function removeTypeFromMessage(sMessage) {
		return sMessage.replace(getTypeFromMessage(sMessage) + ":", "");
	}
	var oDateFormatter;
	/**
	 * Message is the class that represents the message
	 * @private
	 * @class Message
	 * @constructor
	 * @param {Level} oLevel
	 * @param {String} sCategory
	 * @param {String} sMessage
	 * @param {String} sFilenameUrl
	 * @param {Number} nLineNumber
	 */
	Message = function (oLevel, sCategory, sMessage, sFilenameUrl, nLineNumber) {
		/**
		 * oLevel is the Message Level to know if it can be logged or not.
		 * @member Message.prototype
		 * @type {Level}
		 */
		this.oLevel = oLevel || Level.ALL;
		/**
		 * sCategory is the message category
		 * @member Message.prototype
		 * @type {String}
		 */
		this.sCategory = sCategory || 'GENERAL';
		/**
		 * sMessage is the message message
		 * @member Message.prototype
		 * @type {String}
		 */
		this.sMessage = sMessage || 'Message Undefined';
		/**
		 * dInitialize sets the instantiation date
		 * @member Message.prototype
		 * @type {Date}
		 */
		this.dInitialize = new Date();
		/**
		 * oDateFormatter is the instance of DateFormatter after set the default format
		 * @member Message.prototype
		 * @type {*}
		 */
		this.oDateFormatter = oDateFormatter || null;
		/**
		 * sFilenameUrl is the url or filename to the file where the message is launched
		 * @member Message.prototype
		 * @type {String}
		 */
		this.sFilenameUrl = sFilenameUrl || null;
		/**
		 * nFileNumber is the number of line where the message is launched
		 */
		this.nLineNumber = nLineNumber || null;
	};
	/**
	 * setDateFormatter sets the formatter of the date
	 * @param oDateFormat
	 * @return {Message}
	 */
	Message.setDateFormatter = function(oDateFormat){
		oDateFormatter = oDateFormat;
		return this;
	};
	/**
	 * setFilenameUrl change the sFilenameUrl
	 * @member Message.prototype
	 * @param sFilenameUrl
	 * @type {String}
	 * @return {Message}
	 */
	Message.prototype.setFilenameUrl = function (sFilenameUrl) {
		this.sFilenameUrl = sFilenameUrl;
		return this;
	};
	/**
	 * setLineNumber change the nLineNumber
	 * @member Message.prototype
	 * @param nLineNumber
	 * @type {Number}
	 * @return {Message}
	 */
	Message.prototype.setLineNumber = function (nLineNumber) {
		this.nLineNumber = nLineNumber;
		return this;
	};
	/**
	 * setCategory change the sCategory
	 * @member Message.prototype
	 * @param sCategory
	 * @type {String}
	 * @return {Message}
	 */
	Message.prototype.setCategory = function (sCategory) {
		this.sCategory = sCategory;
		return this;
	};
	/**
	 * setLevel change the level if oLevel is instance of Level
	 * @member Message.prototype
	 * @param oLevel
	 * @type {Level}
	 * @return {Message}
	 */
	Message.prototype.setLevel = function (oLevel) {
		if (oLevel instanceof Level) {
			this.oLevel = oLevel;
		}
		return this;
	};
	/**
	 * setMessage change the sMessage
	 * @member Message.prototype
	 * @param sMessage
	 * @type {String}
	 * @return {Message}
	 */
	Message.prototype.setMessage = function (sMessage) {
		this.sMessage = sMessage;
		return this;
	};
	/**
	 * setDateFormat change the sDateFormat
	 * @member Message.prototype
	 * @param sDateFormat
	 * @type {String}
	 * @return {Message}
	 */
	Message.prototype.setDateFormat = function (sDateFormat) {
		this.sDateFormat = sDateFormat;
		return this;
	};
	/**
	 * getFormattedDate returns the message Date after format it
	 * @member Message.prototype
	 * @return {String}
	 */
	Message.prototype.getFormattedDate = function () {
		var sDate = '';
		if(this.oDateFormatter !== null)
		{
			sDate =  this.oDateFormatter.formatDate(this.dInitialize);
		}
		return sDate;
	};
	/**
	 * Utils to be used when looking for type in message
	 * @type {Object}
	 */
	Message.utils = {
		getTypeFromMessage: getTypeFromMessage,
		removeTypeFromMessage: removeTypeFromMessage
	};
	/**
	 * Level is the class that sets the Message level
	 * @private
	 * @class Level
	 * @constructor
	 * @param nLevel
	 * @type {Level}
	 * @param sLevel
	 * @type {String}
	 */
	Level = function (nLevel, sLevel) {
		this.nLevel = nLevel;
		this.sLevel = sLevel;
	};
	/**
	 * @static
	 * @type {Number}
	 */
	Level.nOFF = Number.MAX_VALUE;
	/**
	 * @static
	 * @type {Number}
	 */
	Level.nDISRUPTOR = 60000;
	/**
	 * @static
	 * @type {Number}
	 */
	Level.nFATAL = 50000;
	/**
	 * @static
	 * @type {Number}
	 */
	Level.nERROR = 40000;
	/**
	 * @static
	 * @type {Number}
	 */
	Level.nWARNING = 30000;
	/**
	 * @static
	 * @type {Number}
	 */
	Level.nINFO = 20000;
	/**
	 * @static
	 * @type {Number}
	 */
	Level.nDEBUG = 10000;
	/**
	 * @static
	 * @type {Number}
	 */
	Level.nTRACE = 5000;
	/**
	 * @static
	 * @type {Number}
	 */
	Level.nALL = Number.MIN_VALUE;
	/**
	 * @static
	 * @type {Level}
	 */
	Level.OFF = new Level(Level.nOFF, "OFF");
	/**
	 * @static
	 * @type {Level}
	 */
	Level.DISRUPTOR = new Level(Level.nDISRUPTOR, "DISRUPTOR");
	/**
	 * @static
	 * @type {Level}
	 */
	Level.FATAL = new Level(Level.nFATAL, "FATAL");
	/**
	 * @static
	 * @type {Level}
	 */
	Level.ERROR = new Level(Level.nERROR, "ERROR");
	/**
	 * @static
	 * @type {Level}
	 */
	Level.WARNING = new Level(Level.nWARNING, "WARN");
	/**
	 * @static
	 * @type {Level}
	 */
	Level.INFO = new Level(Level.nINFO, "INFO");
	/**
	 * @static
	 * @type {Level}
	 */
	Level.DEBUG = new Level(Level.nDEBUG, "DEBUG");
	/**
	 * @static
	 * @type {Level}
	 */
	Level.TRACE = new Level(Level.nTRACE, "TRACE");
	/**
	 * @static
	 * @type {Level}
	 */
	Level.ALL = new Level(Level.nALL, "ALL");
	/**
	 * getLevel return the Level from the sLevel Name
	 * @param sLevel
	 * @type {String}
	 * @return oNewLevel
	 * @type Level
	 */
	Level.prototype.getLevel = function (sLevel) {
		var oNewLevel = Level[sLevel];
		if (oNewLevel !== undefined) {
			return oNewLevel;
		}
		oNewLevel = null;
		return null;
	};
	/**
	 * toString overwrites the Object.prototype.toString to return the name of the Level
	 * @return sLevel
	 * @type {String}
	 */
	Level.prototype.toString = function () {
		return this.sLevel;
	};
	/**
	 * valueOf returns the number of Level
	 * @return nLevel
	 * @type {Number}
	 */
	Level.prototype.valueOf = function () {
		return this.nLevel;
	};
	/**
	 * Compare two different levels to know if are the same
	 * @param oLevel1
	 * @param oLevel2
	 * @return {Boolean}
	 */
	Level.compare = function(oLevel1, oLevel2){
		var nValueOf = oLevel1.valueOf(),
			bCompare = nValueOf === oLevel2.valueOf();
		if(nValueOf === Level.ALL.valueOf()){
			bCompare = true;
		}else if(nValueOf === Level.OFF.valueOf()){
			bCompare = false;
		}
		return bCompare;
	};
	/**
	 * Appender is the class that will log or clear messages
	 * @abstract
	 * @private
	 * @class Appender
	 * @constructor
	 * @param oLayout
	 * @type {Layout}
	 */
	Appender = function (oLayout) {
		/**
		 * sName is the name of the appender
		 * @member Appender.prototype
		 * @type {String}
		 */
		this.sName = '[object Appender]';
		/**
		 * oLayout is the Layout instance to be used to format the message before append it
		 * @member Appender.prototype
		 * @type {Layout}
		 */
		this.oLayout = oLayout || null;
	};
	/**
	 * setName is the method to set the name of Appender
	 * @member Appender.prototype
	 * @param sName
	 * @type {String}
	 * @return Appender instance
	 */
	Appender.prototype.setName = function (sName) {
		this.sName = sName;
		return this;
	};
	/**
	 * setLayout is the method to set the layout for Appender
	 * @member Appender.prototype
	 * @param oLayout
	 * @type {Layout}
	 * @return Appender instance
	 */
	Appender.prototype.setLayout = function (oLayout) {
		this.oLayout = oLayout;
		return this;
	};
	/**
	 * toString is the method to overwrite the Object.prototype.toString
	 * @member Appender.prototype
	 * @return {String}
	 */
	Appender.prototype.toString = function () {
		return this.sName;
	};
	/**
	 * log is an abstract method that needs to be overwritten on extended classes to make it work.
	 * @member Appender.prototype
	 * @param {Message} oMessage
	 */
	Appender.prototype.log = function (oMessage) {
		throw new Error("This method must be overwritten!");
	};
	/**
	 * clear is an abstract method that needs to be overwritten on extended classes to make it work.
	 * @member Appender.prototype
	 */
	Appender.prototype.clear = function () {
		throw new Error("This method must be overwritten!");
	};
	/**
	 * Layout is the class that will format the messages before send it to the Appender class
	 * @abstract
	 * @private
	 * @class Layout
	 * @constructor
	 */
	Layout = function () {

	};
	/**
	 * format is an abstract method that needs to be overwritten on extended classes to make it work.
	 * @member Layout.prototype
	 * @param oMessage
	 * @type {Message}
	 */
	Layout.prototype.format = function (oMessage) {
		throw new Error("This method must be overwritten!");
	};
	/**
	 * Hermes is the class that manages Appender, Messages, Deferred calls and Levels of Messages to show
	 * We can add Message but if the Message is not of the same level the message will not be showed.
	 * If the Hermes Message Level is ALL all the logs will be added
	 * If the Hermes Message Level is OFF no log will be added
	 * The add of logs can be deferred to avoid multiple calls that block browser
	 * @private
	 * @class Hermes
	 * @constructor
	 * @param {Level} oLevel
	 * @param {Number} nImmediate
	 * @param {Number} nTimeout
	 */
	Hermes = function (oLevel, nImmediate, nTimeout) {
		/**
		 * oAppender is the object that will contain the Appender to append messages
		 * @member Hermes.prototype
		 * @type {Object}
		 */
		this.oAppenders = {};
		/**
		 * aMessages is the array that will contain the Messages
		 * @member Hermes.prototype
		 * @type {Array}
		 */
		this.aMessages = [];
		/**
		 * oLevel is the Level instance to manage the Message Level to show.
		 * @member Hermes.prototype
		 * @type {Level}
		 */
		this.oLevel = oLevel || null;
		/**
		 * nTimeLastSent is the number of milliseconds of the last sent
		 * now date by default
		 * @member Hermes.prototype
		 * @type {Number}
		 */
		this.nTimeLastSent = this.now();
		/**
		 * nImmediate is the config number to defer or not the append of logs
		 * @member Hermes.prototype
		 * @type {Number}
		 */
		this.nImmediate = nImmediate || Hermes.DEFERRED;
		/**
		 * nTimeout is the number of milliseconds to defer the append of logs
		 * @member Hermes.prototype
		 * @type {Number}
		 */
		this.nTimeout = nTimeout || 0;
	};
	/**
	 * @static
	 * @type {Number}
	 */
	Hermes.DEFERRED = 0;
	/**
	 * @static
	 * @type {Number}
	 */
	Hermes.IMMEDIATE = 1;
	Hermes.prototype.setTimeToLog = function(nTimeoutToLogMilliseconds)
	{
		this.nTimeout = nTimeoutToLogMilliseconds;
		return this;
	};
	/**
	 * deferLog change the method to append logs to be deferred
	 * @member Hermes.prototype
	 * @return Hermes instance
	 */
	Hermes.prototype.deferLog = function () {
		this.nImmediate = Hermes.DEFERRED;
		return this;
	};
	/**
	 * immediateLog change the method to append logs to be immediate
	 * @member Hermes.prototype
	 * @return Hermes instance
	 */
	Hermes.prototype.immediateLog = function () {
		this.nImmediate = Hermes.IMMEDIATE;
		return this;
	};
	/**
	 * now returns the number of milliseconds at the moment of the execution of this method
	 * @member Hermes.prototype
	 * @return {Number} Milliseconds
	 */
	Hermes.prototype.now = function () {
		return +new Date();
	};
	/**
	 * setLevel set a new Level for the Hermes
	 * Before change the level it's checked if oLevel is instance of Level to be assigned or not.
	 * @member Hermes.prototype
	 * @param oLevel
	 * @type {Level}
	 * @return Hermes instance
	 */
	Hermes.prototype.setLevel = function (oLevel) {
		if (oLevel instanceof Level) {
			this.oLevel = oLevel;
		}
		return this;
	};
	/**
	 * addAppender add a new Appender to Hermes. When the Appender is added starts to log messages
	 * Before add a new Appender it's checked if oAppender is instance of Appender to be added or not.
	 * @member Hermes.prototype
	 * @param oAppender
	 * @type {Appender}
	 * @return Hermes instance
	 */
	Hermes.prototype.addAppender = function (oAppender) {
		if (oAppender instanceof Appender) {
			this.oAppenders[oAppender.toString()] = oAppender;
		}
		return this;
	};
	/**
	 * removeAppender removes the Appender. When the Appender is removed stops to log messages
	 * @member Hermes.prototype
	 * @param oAppender
	 * @type {Appender}
	 * @return Hermes instance
	 */
	Hermes.prototype.removeAppender = function (oAppender) {
		delete this.oAppenders[oAppender.toString()];
		return this;
	};
	/**
	 * setAppender add an array of Appender to be added in one step.
	 * @member Hermes.prototype
	 * @param aAppenders
	 * @type {Array}
	 * @return Hermes instance
	 */
	Hermes.prototype.setAppenders = function (aAppenders) {
		var nAppender = 0,
			nLenAppender = aAppenders.length,
			oAppender = null;

		for (nAppender = 0; nAppender < nLenAppender; nAppender = nAppender + 1) {
			oAppender = aAppenders[nAppender];
			this.addAppender(oAppender);
		}
		return this;
	};
	/**
	 * isSameLevel checks if the Message Level is the same that in oMessage
	 * The method returns true if Level is ALL to allow log all the logs
	 * The method returns false if Level is OFF to avoid log any log
	 * @member Hermes.prototype
	 * @param oMessage
	 * @type {Message}
	 * @return {Boolean}
	 */
	Hermes.prototype.isSameLevel = function (oMessage) {
		return Level.compare(this.oLevel, oMessage.oLevel);
	};
	/**
	 * sendMessage executes the action in Appender for each Message.
	 * @member Hermes.prototype
	 * @param oAppender
	 * @type {Appender}
	 * @param sAction
	 * @type {String}
	 */
	Hermes.prototype.sendMessage = function (oAppender, sAction) {
		var nMessage = 0,
			nLenMessage = this.aMessages.length,
			oMessage = null;
		if (oAppender[sAction] === und) {
			return;
		}

		for (; nMessage < nLenMessage;nMessage = nMessage + 1) {
			oMessage = this.aMessages[nMessage];
			if (this.isSameLevel(oMessage)) {
				oAppender[sAction](oMessage);
			}
		}
		this.nTimeLastSent = this.now();
	};
	/**
	 * isImmediate checks if nImmediate is equals to Hermes.IMMEDIATE
	 * @member Hermes.prototype
	 * @return {Boolean}
	 */
	Hermes.prototype.isImmediate = function (oMessage) {
		return this.nImmediate === Hermes.IMMEDIATE;
	};
	/**
	 * isTimeToSend checks if now is time to sent new logs to the appender
	 * @member Hermes.prototype
	 * @return {Boolean}
	 */
	Hermes.prototype.isTimeToSend = function () {
		return this.now() >= this.nextTimeToSend();
	};
	/**
	 * notifyAppender send the message log for all the Appender if the execution is Deferred and is time to send new logs or if the execution is Immediate.
	 * after execute notifyAppender the message are reset to allow new messages to log.
	 * @member Hermes.prototype
	 * @param {String} sAction
	 * @param {Message} oMessage
	 * @return Hermes instance
	 */
	Hermes.prototype.notifyAppender = function (sAction, oMessage) {
		var sKey = '',
			oAppender = null;
		sAction = sAction.toLowerCase();

		if (this.isImmediate(oMessage) || this.isTimeToSend()) {
			for (sKey in this.oAppenders) {
				if (this.oAppenders.hasOwnProperty(sKey)) {
					oAppender = this.oAppenders[sKey];
					this.sendMessage(oAppender, sAction);
				}
			}
			this.resetMessages();
		}
		return this;
	};
	/**
	 * addMessage check if oMessage is instance of Message and if it's the error is added and the notifyAppender is called
	 * notifyAppender is executed to defer or log the message.
	 * @member Hermes.prototype
	 * @param oMessage
	 * @type {Message}
	 * @return Hermes instance
	 */
	Hermes.prototype.addMessage = function (oMessage) {
		if (oMessage instanceof Message) {
			this.aMessages.push(oMessage);
			this.log(oMessage);
		}
		return this;
	};
	/**
	 * resetMessages clean all the messages and errors in the aMessages Array
	 * @member Hermes.prototype
	 */
	Hermes.prototype.resetMessages = function () {
		this.aMessages = [];
	};
	/**
	 * nextTimeToSend returns the time to know, if the method of log is Deferred, if it's possible to log messages.
	 * @member Hermes.prototype
	 * @return {Number}
	 */
	Hermes.prototype.nextTimeToSend = function () {
		return this.nTimeLastSent + this.nTimeout;
	};
	/**
	 * forceLog will log messages even if the method of log is Deferred.
	 * @member Hermes.prototype
	 * @return Hermes instance
	 */
	Hermes.prototype.forceLog = function () {
		this.immediateLog();
		this.log();
		this.deferLog();
		return this;
	};
	/**
	 * log is the method that will log messages
	 * @member Hermes.prototype
	 */
	Hermes.prototype.log = function (oMessage) {
		this.notifyAppender("log", oMessage);
	};
	/**
	 * clear is the method that will clear messages
	 * @member Hermes.prototype
	 */
	Hermes.prototype.clear = function () {
		this.notifyAppender("clear");
	};

	oHerm = new Hermes();

	/*
	 * This object expose the private classes as global to use it from outside of the module.
	 */
	/**
	 * Exposing it to the namespace Hermes
	 * It will be used as a property of the namespace.
	 * ns.Hermes
	 * @namespace ns.Hermes
	 * @type {Object}
	 */
	oHermes = {
		/**
		 * Original Hermes class that will be used as logger
		 * It can be used to modify the behaviour of logging if needed.
		 * @type {Hermes}
		 */
		basic: Hermes,
		/**
		 * Instance of Hermes to log messages
		 * @type {Hermes}
		 */
		logger: oHerm,
		/**
		 * Expose the private Level object to extend from.
		 * @type {Level}
		 */
		level: Level,
		/**
		 * Expose the private Layout object to extend from.
		 * @type {Layout}
		 */
		layout: Layout,
		/**
		 * Expose the private Appender object to extend from.
		 * @type {Appender}
		 */
		appender: Appender,
		/**
		 * Expose the private Message object to extend from.
		 * @type {Message}
		 */
		message: Message,
		/**
		 * Method to extend public Hermes object with new features.
		 * @param {String} sProperty
		 * @param {Object} oValue
		 */
		extend: function(sProperty, oValue)
		{
			this[sProperty] = oValue;
		}
	};
	ns.Hermes = oHermes;
}(window, document));
