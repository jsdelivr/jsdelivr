/*global HashSet:false, Hashtable:false*/
    
if (typeof obviel === "undefined") {
    var obviel = {};
}

obviel.sync = {};

(function($, module) {
    // when a UI event is handled, we automatically commit the current
    // session
    //XXX reverse this and make obviel core do this integration if
    //obviel.sync is available? similar to way it interacts with obviel.template
    if (obviel.eventHook !== undefined) {
        obviel.eventHook(function() {
            var session;
            if (currentConnection === null) {
                return;
                
            }
            session = currentConnection.session();
            if (session === null) {
                return;
            }
            session.commit();
        });
    }
    var currentConnection = null;

    // XXX same story here; should go into obviel itself
    if (obviel.View !== undefined) {
        obviel.View.prototype.mutator = function() {
            if (currentConnection === null) {
                throw new Error("No current connection, use obviel.sync.init()");
            }
            return currentConnection.mutator(this.obj);
        };
    }
    
    module.ConnectionError = function(message) {
        this.name = 'ConnectionError';
        this.message = message;
    };

    module.ConnectionError.prototype = new Error();
    module.ConnectionError.prototype.constructor = module.ConnectionError;
    
    module.IdError = function(message) {
        this.name = 'IdError';
        this.message = message;
    };

    module.IdError.prototype = new Error();
    module.IdError.prototype.constructor = module.IdError();
    
    var mappings = {};
    module.mapping = function(config) {
        // XXX should use cleverer iface storage aware of inheritance?
        initDefaults(config);
        mappings[config.iface] = config;
    };

    module.clear = function() {
        mappings = {};
        objLookup.clear();
    };

    module.getMapping = function(iface) {
        return mappings[iface];
    };

    var initDefaults = function(config) {
        var defaults = getDefaults();
        defaultsUpdater(config, defaults);
        return config;
    };

    // XXX maintain defaults with action?
    var defaultsUpdater = function(config, defaults) {
        var key, subdefaults, subconfig;
        for (key in defaults) {
            subdefaults = defaults[key];
            subconfig = config[key];
             if ($.isPlainObject(subdefaults)) {
                 if (!$.isPlainObject(subconfig)) {
                     subconfig = config[key] = {};
                 }
                 defaultsUpdater(subconfig, subdefaults);
                 // } else if (subconfig === undefined) {
                 //     config[key] = null;
                 // }
             } else {
                 if (subconfig === undefined) {
                     config[key] = subdefaults;
                 }
             }
        }
    };

    
    var ObjectMutator = function(session, obj) {
        this.session = session;
        this.obj = obj;
    };

    ObjectMutator.prototype.get = function(name) {
        return this.session.createMutator(this.obj, name);
    };

    ObjectMutator.prototype.set = function(name, value) {
        this.obj[name] = value;
        this.session.update(this.obj);
    };

    ObjectMutator.prototype.touch = function(name, value) {
        this.obj[name] = value;
        this.session.touch(this.obj);
    };
    
    ObjectMutator.prototype.refresh = function() {
        this.session.refresh(this.obj);
    };

    ObjectMutator.prototype.commit = function() {
        return this.session.commit();
    };
    
    var ArrayMutator = function(session, obj, arrayName) {
        this.session = session;
        this.obj = obj;
        this.arrayName = arrayName;
    };

    ArrayMutator.prototype.get = function(index) {
        return new ObjectMutator(this.session,
                                 this.obj[this.arrayName][index]);
    };
    
    ArrayMutator.prototype.push = function(value) {
        this.obj[this.arrayName].push(value);
        this.session.add(value, this.obj, this.arrayName);
    };

    var removeFromArray = function(array, value) {
        var index = $.inArray(value, array);
        if (index === -1) {
            throw new Error(
                "Cannot remove item from array as it doesn't exist: " + value);
        }
        array.splice(index, 1);
    };
    
    ArrayMutator.prototype.remove = function(value) {
        var array = this.obj[this.arrayName];
        removeFromArray(array, value);
        this.session.remove(value, this.obj, this.arrayName);
    };
    
    ArrayMutator.prototype.commit = function() {
        return this.session.commit();
    };

    var objHashCode = function(obj) {
        if (this.id !== undefined) {
            return this.id;
        }
        return this.toString();
    };
    
    var objHashEquals = function(self, other) {
        return (self === other);
    };
    
    
    var ActionsForObject = function() {
        this.actions = [];
        this.trumpSet = new HashSet();
    };

    ActionsForObject.prototype.add = function(action) {
        this.actions.push(action);
        this.trumpSet.add(action.trumpKey());
    };

    ActionsForObject.prototype.removeTrumped = function() {
        var i, action,
            newActions = [],
            removedActions = new HashSet();
        for (i = 0; i < this.actions.length; i++) {
            action = this.actions[i];
            if (action.isTrumped(this.trumpSet)) {
                removedActions.add(action);
                continue;
            }
            newActions.push(action);
        }
        this.actions = newActions;
        return removedActions;
    };
    
    var Session = function(connection) {
        this.connection = connection;
        this.actions = new HashSet();
        this.actionsByName = {};
        this.knownActions = new HashSet();
        this.actionsByObject = new Hashtable(objHashCode, objHashEquals);
    };

    Session.prototype.getSection = function(iface) {
        throw new Error("Session base class cannot get section");
    };
    
    Session.prototype.addAction = function(action) {
        var removedActions, name;
        if (this.isDuplicateAction(action)) {
            return;
        }
        this.actions.add(action);
        this.addActionByName(action);
        this.knownActions.add(action.duplicateKey());
        removedActions = this.addActionByObject(action);
        substractSet(this.actions, removedActions);
        for (name in this.actionsByName) {
            substractSet(this.actionsByName[name], removedActions);
        }
        
        // XXX should we substract from knownActions too?
    };

    var substractSet = function(self, other) {
        var i, value,
            values = other.values();
        for (i = 0; i < values.length; i++) {
            value = values[i];
            self.remove(value);
        }
    };
    
    Session.prototype.isDuplicateAction = function(action) {
        return this.knownActions.contains(action.duplicateKey());
    };

    Session.prototype.addActionByName = function(action) {
        var actions = this.actionsByName[action.name];
        if (actions === undefined) {
            actions = new HashSet();
            this.actionsByName[action.name] = actions;
        }
        actions.add(action);
    };

    Session.prototype.addActionByObject = function(action) {
        var group = this.actionsByObject.get(action.obj);
        if (group === null) {
            group = new ActionsForObject();
            this.actionsByObject.put(action.obj, group);
        }
        group.add(action);
        return group.removeTrumped();
    };
    
    Session.prototype.update = function(obj) {
        this.addAction(new UpdateAction(this, obj));
    };

    Session.prototype.touch = function(obj) {
        this.addAction(new TouchAction(this, obj));
    };
    
    Session.prototype.refresh = function(obj) {
        this.addAction(new RefreshAction(this, obj));
    };
        
    Session.prototype.add = function(obj, container, propertyName) {
        this.addAction(new AddAction(this, obj, container, propertyName));
    };
    
    Session.prototype.remove = function(obj, container, propertyName) {
        this.addAction(new RemoveAction(this, obj, container, propertyName));
    };
    
    var sortActions = function(actions) {
        var result = actions.values();
        result.sort(function(self, other)
                    { return self.sequence - other.sequence; });
        return result;
    };
    
    Session.prototype.sortedActions = function() {
        return sortActions(this.actions);
    };
    
    Session.prototype.dirty = function(name) {
        var i, action,
            result = [],
            actions = sortActions(this.actionsByName[name]);
        for (i = 0; i < actions.length; i++) {
            action = actions[i];
            result.push(action.touchedInfo());
        }
        return result;
    };
    
    Session.prototype.updated = function() {
        return this.dirty('update');
    };
    
    Session.prototype.added = function() {
        return this.dirty('add');
    };

    Session.prototype.removed = function() {
        return this.dirty('remove');
    };
    
    Session.prototype.refreshed = function() {
        return this.dirty('refresh');
    };

    Session.prototype.touched = function() {
        return this.dirty('touch');
    };
    
    Session.prototype.createMutator = function(obj, propertyName) {
        var value = obj[propertyName];
        // XXX special case for non-obj attributes, and array attributes
        // XXX does $.isPlainObject deal with inheritance?
        if ($.isPlainObject(value)) {
            return new ObjectMutator(this, value);
        } else if ($.isArray(value)) {
            return new ArrayMutator(this, obj, propertyName);
        } else {
            return value;
        }
    };

    Session.prototype.mutator = function(obj) {
        return new ObjectMutator(this, obj);
    };

    Session.prototype.afterCommit = function() {
        var i,
            actions = this.sortedActions();
        for (i = 0; i < actions.length; i++) {
            actions[i].afterCommit();
        }
    };
    
    var TargetSession = function(connection) {
        Session.call(this, connection);
    };

    TargetSession.prototype = new Session();
    TargetSession.prototype.constructor = TargetSession;

    TargetSession.prototype.getSection = function(iface) {
        return mappings[iface].target;
    };

    TargetSession.prototype.combine = function() {
        var i, action, combinedAction, key, obj,
            actionsByContainer = new Hashtable(),
            newActions =  new HashSet(),
            actions = this.sortedActions();
        for (i = 0; i < actions.length; i++) {
            action = actions[i];
            if (!(action instanceof ContainerAction)) {
                newActions.add(action);
                continue;
            }
            if (!action.getConfig().combine) {
                newActions.add(action);
                continue;
            }
            key = action.trumpKey();
            obj = action.obj;
            combinedAction = actionsByContainer.get(key);
            if (combinedAction === null) {
                combinedAction = action;
                combinedAction.obj = [];
                actionsByContainer.put(key, combinedAction);
                newActions.add(combinedAction);
            }
            combinedAction.obj.push(obj);
        }
        this.actions = newActions;
    };

    TargetSession.prototype.transform = function() {
        var i, action,
            actions = this.sortedActions();
        for (i = 0; i < actions.length; i++) {
            action = actions[i];
            action.registerObj();
            action.transform();
        }
    };
    
    TargetSession.prototype.commit = function() {
        var self = this;
        this.combine();
        this.transform();
        try {
            return this.connection.commitSession(this).done(function() {
                self.afterCommit();
                self.connection.currentSession = null;
            });
        } catch(e) {
            self.connection.currentSession = null;
            throw e;
        }
    };
    
    var SourceSession = function(connection) {
        Session.call(this, connection);
    };

    SourceSession.prototype = new Session();
    SourceSession.prototype.constructor = SourceSession;
    
    SourceSession.prototype.getSection = function(iface) {
        return mappings[iface].source;
    };

    SourceSession.prototype.commit = function() {
        var i,
            defer,
            actions = this.sortedActions();
        for (i = 0; i < actions.length; i++) {
            actions[i].apply();
        }
        this.afterCommit();
        defer = $.Deferred();
        defer.resolve();
        return defer.promise();
    };
    
    var actionSequence = 0;
    
    var Action = function(session, name) {
        this.session = session;
        this.name = name;
        this.sequence = actionSequence;
        actionSequence++;
    };

    Action.prototype.hashCode = function() {
        return "Action" + this.sequence;
    };

    Action.prototype.equals = function(other) {
        return this.sequence === other.sequence;
    };
    
    Action.prototype.getObj = function() {
        throw new Error("getObj not implemented");
    };

    Action.prototype.getIface = function() {
        return this.getObj().iface;
    };

    Action.prototype.duplicateKey = function() {
        throw new Error("duplicateKey not implemented");
    };

    Action.prototype.transform = function() {
        throw new Error("transform not implemented");
    };

    
    Action.prototype.registerObj = function() {
    };

    Action.prototype.trumpedBy = function() {
        return [];
    };

    Action.prototype.isTrumped = function(trumpSet) {
        var i, key,
            trumpedBy = this.trumpedBy();
        for (i = 0; i < trumpedBy.length; i++) {
            key = trumpedBy[i];
            if (trumpSet.contains(key)) {
                return true;
            }
        }
        return false;
    };
    
    Action.prototype.afterCommit = function() {
        this.sendEvent();
    };

    var getConfigForIface = function(session, iface, name) {
        var section = session.getSection(iface),
            config = section[name];
        if (config === undefined) {
            throw new module.ConnectionError(
                "No " + name + " config defined");
        }
        return config;
    };
    
    Action.prototype.getConfig = function() {
        return getConfigForIface(this.session, this.getIface(), this.name);
    };
    
    Action.prototype.sendEvent = function() {
        var obj, event,
            config = this.getConfig();
        if (!config) {
            return;
        }
        obj = this.getObj();
        event = config.event;
        if (!event) {
            return;
        }
        $(obj).trigger(event);
    };
    
    Action.prototype.getConnectionConfig = function(config) {
        return this.session.connection.getConfig(config, this);
    };
    
    var ActionDuplicateKey = function(actionName, obj,
                                      container, propertyName) {
        this.actionName = actionName;
        this.obj = obj;
        this.container = container;
        this.propertyName = propertyName;
    };
    
    ActionDuplicateKey.prototype.objHashCode = function(obj) {
        if (obj === undefined) {
            return 'obvielObjectUndefined';
        }
        return objHashCode(obj);
    };
    
    ActionDuplicateKey.prototype.hashCode = function() {
        return (this.actionName + ',' +
                this.objHashCode(this.obj) + ',' +
                this.objHashCode(this.container) + ',' +
                this.propertyName);
    };

    ActionDuplicateKey.prototype.equals = function(other) {
        return (this.actionName === other.actionName &&
                this.obj === other.obj &&
                this.container === other.container &&
                this.propertyName === other.propertyName);
    };


    var ObjectActionTrumpKey = function(actionName) {
        this.actionName = actionName;
    };

    ObjectActionTrumpKey.prototype.hashCode = function() {
        return this.actionName;
    };

    ObjectActionTrumpKey.prototype.equals = function(other) {
        return (this.actionName === other.actionName);
    };
    
    var ContainerActionTrumpKey = function(actionName, container, propertyName) {
        this.actionName = actionName;
        this.container = container;
        this.propertyName = propertyName;
    };
    
    ContainerActionTrumpKey.prototype.hashCode = function() {
        return this.actionName;
    };

    ContainerActionTrumpKey.prototype.equals = function(other) {
        if (this.actionName !== other.actionName) {
            return false;
        }
        if (!(other instanceof ContainerActionTrumpKey)) {
            return true;
        }
        return (this.container === other.container &&
                this.propertyName === other.propertyName);
    };
    
    var ObjectAction = function(session, name, obj) {
        Action.call(this, session, name);
        this.obj = obj;
    };

    ObjectAction.prototype = new Action();
    ObjectAction.prototype.constructor = ObjectAction;

    ObjectAction.prototype.getObj = function() {
        return this.obj;
    };
    
    ObjectAction.prototype.transform = function() {
        var config = this.getConfig();
        if (!config) {
            return;
        }
        if (!config.transformer) {
            return;
        }
        this.obj = config.transformer(this.obj);
    };

    ObjectAction.prototype.registerObj = function() {
        if (this.obj.id === undefined) {
            this.obj.clientId = clientIds;
            clientIds++;
        }
        objLookup.register(this.obj);
    };

    ObjectAction.prototype.duplicateKey = function() {
        return new ActionDuplicateKey(this.name,
                                      this.obj);
    };


    ObjectAction.prototype.trumpKey = function() {
        return new ObjectActionTrumpKey(this.name);
    };

    ObjectAction.prototype.touchedInfo = function() {
        return this.obj;
    };
    
    var ContainerAction = function(session, name, obj,
                                   container, propertyName) {
        ObjectAction.call(this, session, name, obj);
        this.container = container;
        this.propertyName = propertyName;
    };

    ContainerAction.prototype = new ObjectAction();
    ContainerAction.prototype.constructor = ContainerAction;
    
    ContainerAction.prototype.getObj = function() {
        return this.container;
    };
    
    ContainerAction.prototype.duplicateKey = function() {
        return new ActionDuplicateKey(this.name,
                                      this.obj,
                                      this.container,
                                      this.propertyName);
    };

    ContainerAction.prototype.trumpKey = function() {
        return new ContainerActionTrumpKey(this.name,
                                           this.container,
                                           this.propertyName);
    };

    ContainerAction.prototype.touchedInfo = function() {
        return {
            obj: this.obj,
            container: this.container,
            propertyName: this.propertyName
        };
    };
    
    var UpdateAction = function(session, obj) {
        ObjectAction.call(this, session, 'update', obj);
    };
     
    UpdateAction.prototype = new ObjectAction();
    UpdateAction.prototype.constructor = UpdateAction;

    UpdateAction.prototype.trumpedBy = function() {
        return [new ObjectActionTrumpKey('add'),
                new ObjectActionTrumpKey('remove')];
    };

    UpdateAction.prototype.apply = function() {
        var config = this.getConfig(),
            connectionConfig = this.getConnectionConfig(config),
            finder = config.finder,
            transformer = connectionConfig.transformer,
            obj = finder(this),
            transformedObj = transformer(this.obj);
        // XXX this code isn't covered and needs testing
        objectUpdater(obj, transformedObj);
        // XXX this is cheating but is needed to make afterCommit
        // run properly
        this.obj = obj;
    };

    var TouchAction = function(session, obj) {
        ObjectAction.call(this, session, 'touch', obj);
    };

    TouchAction.prototype = new ObjectAction();
    TouchAction.prototype.constructor = TouchAction;
    
    TouchAction.prototype.trumpedBy = function() {
        return [new ObjectActionTrumpKey('update'),
                new ObjectActionTrumpKey('add'),
                new ObjectActionTrumpKey('remove')];
    };

    TouchAction.prototype.apply = function() {
        // nothing to be done for source-level touch action as
        // it makes little sense I think
        // XXX raise exception instead?
    };
    
    var RefreshAction = function(session, obj) {
        ObjectAction.call(this, session, 'refresh', obj);
    };
    
    RefreshAction.prototype = new ObjectAction();
    RefreshAction.prototype.constructor = RefreshAction;
    
    RefreshAction.prototype.trumpedBy = function() {
        return [new ObjectActionTrumpKey('remove')];
    };

    RefreshAction.prototype.apply = function() {
        // nothing to be done for source-level refresh action as
        // it makes little sense I think
        // XXX raise exception instead?
    };
    
    var AddAction = function(session, obj, container, propertyName) {
        ContainerAction.call(this, session, 'add', obj,
                             container, propertyName);
    };

    AddAction.prototype = new ContainerAction();
    AddAction.prototype.constructor = AddAction;

    AddAction.prototype.trumpedBy = function() {
        return [new ContainerActionTrumpKey('remove',
                                            this.container, this.propertyName)
               ];
    };

    var clientIds = 0;
    
    AddAction.prototype.apply = function() {
        var config = this.getConfig(),
            connectionConfig = this.getConnectionConfig(config),
            transformer = connectionConfig.transformer,
            obj = transformer(this.obj);
        this.container[this.propertyName].push(obj);
    };
    
    var RemoveAction = function(session, obj, container, propertyName) {
        ContainerAction.call(this, session, 'remove', obj,
                             container, propertyName);
    };

    RemoveAction.prototype = new ContainerAction();
    RemoveAction.prototype.constructor = RemoveAction;

    RemoveAction.prototype.trumpedBy = function() {
        return [new ContainerActionTrumpKey('add',
                                            this.container, this.propertyName)
               ];
    };

    
    RemoveAction.prototype.registerObj = function() {
        objLookup.unregister(this.obj);
    };

    RemoveAction.prototype.apply = function() {
        var config = this.getConfig(),
            connectionConfig = this.getConnectionConfig(config),
            transformer = connectionConfig.transformer,
            obj = transformer(this.obj);
        removeFromArray(this.container[this.propertyName], obj);
    };

    var findContainerInfo = function(session, iface, name, actionInfo) {
        return getConfigForIface(session, iface, name).finder(actionInfo);
    };
    
    var createAction = function(session, a) {
        var info;
        if (a.name === 'update') {
            return new UpdateAction(session, a.obj);
        } else if (a.name === 'add') {
            info = findContainerInfo(session, a.containerIface, 'add', a);
            return new AddAction(session, a.obj,
                                 info.container, info.propertyName);
        } else if (a.name === 'remove') {
            info = findContainerInfo(session, a.containerIface, 'remove', a);
            return new RemoveAction(session, a.obj,
                                    info.container, info.propertyName);
        } else if (a.name === 'refresh') {
            return new RefreshAction(session, a.obj);
        } else if (a.name === 'touch') {
            return new TouchAction(session, a.obj);
        } else {
            throw new Error("Unknown action name: " + a.name);
        }
    };
    
    module.actionProcessor = function(connection, entries) {
        var i,
            actions = [],
            session = new SourceSession(connection);
        if (!$.isArray(entries)) {
            entries = [entries];
        }
        for (i = 0; i < entries.length; i++) {
            session.addAction(createAction(session, entries[i]));
        }
        return session.commit();
    };
    
    module.multiUpdater = function(connection, entries) {
        var i, finder, entry, defer,
            session = new SourceSession(connection);
        if ($.isEmptyObject(entries)) {
            defer = $.Deferred();
            return defer.promise();
        }
        if (!$.isArray(entries)) {
            entries = [entries];
        }
        for (i = 0; i < entries.length; i++) {
            entry = entries[i];
            session.update(entry);
        }
        return session.commit();
    };
    
    module.Connection = function() {
        this.root = null;
        this.currentSession = null;
    };

    module.Connection.prototype.init = function(root) {
        this.root = root;
        currentConnection = this;
        var session = this.session();
        session.refresh(root);
        return session.commit();
    };
    
    module.Connection.prototype.getTarget = function(iface) {
        var target = mappings[iface].target;
        if (target === undefined) {
            throw new module.ConnectionError("No target defined");
        }
        return target;
    };
    
    module.Connection.prototype.getSource = function(iface) {
        var source = mappings[iface].source;
        if (source === undefined) {
            throw new module.ConnectionError("No source defined");
        }
        return source;
    };

    module.Connection.prototype.getConfig = function(context, action) {
        throw new module.ConnectionError("Not implemented");
    };
    
    module.Connection.prototype.session = function() {
        var session;
        // XXX temporarily disabled until we can adjust tests
        // if (this.root === null) {
        //     throw new module.ConnectionError(
        //         "Cannot make session without doing init first");
        // }
        if (this.currentSession !== null) {
            return this.currentSession;
        }
        session = new TargetSession(this);
        this.currentSession = session;
        return session;
    };
    
    module.Connection.prototype.mutator = function(obj) {
        return this.session().mutator(obj);
    };
    
    module.HttpConnection = function() {
    };
    
    module.HttpConnection.prototype = new module.Connection();

    module.HttpConnection.prototype.getConfig = function(config, action) {
        var http = config.http,
            url;
        
        if ($.isFunction(http.url)) {
            http.calculatedUrl = http.url(action);
        } else {
            http.calculatedUrl = http.url;
        }

        return http;
    };
    
    module.HttpConnection.prototype.commitSession = function(session) {
        // take actions of a kind from session, group 'm by url if we have
        // configured it to do so, and then pass them along to
        // individual process functions. this allows a batch story.
        // XXX but first we do it in a simple way
        var i,
            actions = session.sortedActions(),
            promises = [];
        for (i = 0; i < actions.length; i++) {
            promises.push(this.processTarget(actions[i]));
        }
        return $.when.apply(null, promises);

    };
    
    module.HttpConnection.prototype.processTarget = function(action) {
        var promise,
            self = this,
            config = action.getConfig(),
            http = this.getConfig(config, action);
        if (action.name === 'update') {
            promise = this.processTargetUpdate(
                action.obj,
                config, http);
        } else if (action.name === 'add') {
            promise = this.processTargetAdd(
                action.obj, action.container, action.propertyName,
                config, http);
        } else if (action.name === 'remove') {
            promise = this.processTargetRemove(
                action.obj, action.container, action.propertyName,
                config, http);
        } else if (action.name === 'refresh') {
            promise = this.processTargetRefresh(
                action.obj,
                config, http);
        } else if (action.name === 'touch') {
            promise = this.processTargetTouch(
                action.obj,
                config, http);
        }
        return promise.done(function(responseObj) {
            var response = http.response,
                responseTransformer = http.responseTransformer;
            if (!response) {
                return;
            }
            if (responseTransformer) {
                responseObj = responseTransformer(responseObj);
            }
            response(self, responseObj);
        });
    };
    
    module.HttpConnection.prototype.processTargetUpdate = function(
        obj, config, http) {
        var data = JSON.stringify(obj);
        return $.ajax({
            type: http.method,
            url: http.calculatedUrl,
            processData: false,
            contentType: 'application/json',
            dataType: 'json',
            data: data
        });
    };
    
    module.HttpConnection.prototype.processTargetAdd = function(
        obj, container, propertyName, config, http) {
        var data = JSON.stringify(obj);
        return $.ajax({
            type: http.method,
            url: http.calculatedUrl,
            processData: false,
            contentType: 'application/json',
            dataType: 'json',
            data: data
        });
    };

    // XXX this won't work correctly for a remove that just lists the ids
    // to remove.
    module.HttpConnection.prototype.processTargetRemove = function(
        obj, container, propertyName, config, http) {
        var data = JSON.stringify(obj);
        return $.ajax({
            type: http.method,
            url: http.calculatedUrl,
            processData: false,
            contentType: 'application/json',
            dataType: 'json',
            data: data
        });
    };

    module.HttpConnection.prototype.processTargetRefresh = function(
        obj, config, http) {
        return $.ajax({
            type: http.method,
            url: http.calculatedUrl,
            processData: false,
            contentType: 'application/json',
            dataType: 'json',
            data: null
        });
    };

    module.HttpConnection.prototype.processTargetTouch = function(
        obj, config, http) {
        var defer = $.Deferred();
        defer.resolve();
        return defer.promise();
    };

    module.SocketIoConnection = function(io) {
        this.io = io;
    };

    module.SocketIoConnection.prototype = new module.Connection();

    module.SocketIoConnection.prototype.getConfig = function(config, action) {
        return config.socket;
    };

    module.SocketIoConnection.prototype.commitSession = function(session) {
        var i,
            actions = session.sortedActions(),
            promises = [];
        for (i = 0; i < actions.length; i++) {
            promises.push(this.processTarget(actions[i]));
        }
        return $.when.apply(null, promises);
    };
    
    module.SocketIoConnection.prototype.processTarget = function(action) {
        var config = action.getConfig(),
            socket = this.getConfig(config, action);
        this.io.emit(socket.type, action.obj);
    };

    module.LocalStorageConnection = function(key) {
        this.key = key;
    };

    module.LocalStorageConnection.prototype = new module.Connection();

    module.LocalStorageConnection.prototype.getConfig = function(config, action) {
        return config.local;
    };

    module.LocalStorageConnection.prototype.commitSession = function(session) {
        var i,
            defer = $.Deferred(),
            actions = session.sortedActions(),
            data;
        defer.resolve();
        if (actions.length === 0) {
            return defer.promise();
        }
        
        for (i = 0; i < actions.length; i++) {
            // XXX this isn't correct, as we are not refreshing non-root
            // but always root. but with local storage it won't matter
            // unless it were to wipe out our changes too early, which
            // it probably does, so need test
            if (actions[i].name === 'refresh') {
                data = localStorage[this.key];
                if (data !== undefined) {
                    module.multiUpdater(this, $.parseJSON(data));
                }
                return defer.promise();
            }
        }
        // XXX shouldn't be doing update if there are only touch actions
        // XXX now we can't do target refresh and update at the same time..
        data = JSON.stringify(this.root);
        localStorage[this.key] = data;
        return defer.promise();
    };
    

    var ObjLookup = function() {
        this.serverId2Obj = {};
        this.clientId2Obj = {};
    };

    ObjLookup.prototype.clear = function() {
        this.serverId2Obj = {};
        this.clientId2Obj = {};
    };
    
    ObjLookup.prototype.get = function(serverObj) {
        var clientObj,
            serverId = serverObj.id,
            clientId = serverObj.clientId;
        if (serverId !== undefined) {
            clientObj = this.serverId2Obj[serverId];
            if (clientObj !== undefined) {
                return clientObj;
            }
        }
        if (clientId === undefined) {
            return null;
        }
        clientObj = this.clientId2Obj[clientId];
        if (clientObj === undefined) {
            return null;
        }
        return clientObj;
    };

    ObjLookup.prototype.register = function(clientObj) {
        var serverId = clientObj.id,
            clientId = clientObj.clientId;
        if (serverId !== undefined) {
            this.serverId2Obj[serverId] = clientObj;
        }
        if (clientId !== undefined) {
            this.clientId2Obj[clientId] = clientObj;
        }
    };

    ObjLookup.prototype.unregister = function(clientObj) {
        var serverId = clientObj.id,
            clientId = clientObj.clientId;
        if (serverId !== undefined) {
            delete this.serverId2Obj[serverId];
        }
        if (clientId !== undefined) {
            delete this.clientId2Obj[clientId];
        }
    };

    var objLookup = new ObjLookup;

    module.idFinder = function(action) {
        return objLookup.get(action.obj);
    };
    
    module.registerObjById = function(clientObj) {
        objLookup.register(clientObj);
    };
    
    var nullTransformer = function(obj) {
        return obj;
    };

    module.idsTransformer = function(entries) {
        var i, entry, id,
            result = [];
        for (i = 0; i < entries.length; i++) {
            id = entries[i].id;
            if (id === undefined) {
                throw new module.IdError("No id for obj");
            }
            result.push(id);
        }
        return result;
    };
    
    var getDefaults = function() {
        return {
            source: {
                update: {
                    finder: module.idFinder,
                    http: {
                        transformer: nullTransformer
                    },
                    local: {
                        transformer: nullTransformer
                    }
                },
                add: {
                    http: {
                        transformer: nullTransformer
                    },
                    local: {
                        transformer: nullTransformer
                    }
                },
                remove: {
                    http: {
                        transformer: nullTransformer
                    },
                    local: {
                        transformer: nullTransformer
                    }
                }
            },
            target: {
                update: {
                    http: {
                        method: 'POST',
                        url: function(action) { return action.obj.updateUrl; },
                        transformer: nullTransformer
                    },
                    socket: {
                        type: function(action) { return action.obj.updateType; },
                        transformer: nullTransformer
                    },
                    local: {
                        transformer: nullTransformer
                    }
                },
                refresh: {
                    http: {
                        method: 'GET',
                        url: function(action) { return action.obj['refreshUrl']; },
                        response: obviel.sync.multiUpdater,
                        transformer: nullTransformer
                    },
                    local: {
                        transformer: nullTransformer
                    }
                },
                touch: {
                    http: {
                        transformer: nullTransformer
                    },
                    local: {
                        transformer: nullTransformer
                    }
                },
                add: {
                    http: {
                        method: 'POST',
                        url: function(action) { return action.container.addUrl; },
                        response: module.multiUpdater,
                        transformer: nullTransformer
                    },
                    local: {
                        transformer: nullTransformer
                    }
                },
                remove: {
                    combine: true,
                    transformer: module.idsTransformer,
                    http: {
                        method: 'POST',
                        url: function(action) { return action.container.removeUrl; },
                        response: module.multiUpdater
                    },
                    local: {
                        transformer: nullTransformer
                    }
                }

            }
        };
    };
    
    var objectUpdater = function (target, source) {
        var seen = {};
        for (var key in source) {
            var value = source[key];
            target[key] = value;
            seen[key] = true;
        }
        // XXX not safe in the face of model inheritance
        for (key in target) {
            if (key.substring(0, 6) === 'jQuery') {
                continue;
            }
            var found = seen[key];
            // XXX this is sometimes the right thing to do, but sometimes
            // isn't. model deletions explicitly?
            //if (!found) {
            //    delete target[key];
            //}
        }
    };

    
}(jQuery, obviel.sync));
