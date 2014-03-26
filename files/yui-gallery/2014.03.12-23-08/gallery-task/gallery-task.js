YUI.add('gallery-task', function (Y, NAME) {

/* jshint evil: true */
var supportsES6Syntax = false,
    isPromise = Y.Promise.isPromise;

try {
    // check if a function with an asterisk is valid syntax by evaluating it
    eval("function* f(){}");
    supportsES6Syntax = true;
} catch (e) {
}

/**
Wraps a generator function in a Task. Tasks allow you to yield a promise,
effectively treating your promise based code as synchronous.

@method task
@for YUI
@param {Function} spawn Function that yield generators.
@return {Promise} Promise that gets resolved or rejected based on the result of
                the generator function
@example
<pre><code>
YUI().use('gallery-io-utils', 'gallery-task', function (Y) {
  Y.task(function () {
    var data = yield Y.io.getJSON('/foo.json');
    yield Y.io.postJSON('/bar', {data: data});
  });
});
</pre></code>
**/
Y.task = function (spawn) {
    return new Task(spawn).promise;
};

/**
This class is not intended to be instantiated by the user, but to be used
internally by `Y.task()`.

@class task.Task
@constructor
@param {Function} spawn A generator function
**/
function Task(spawn) {
    var self = this;

    /**
    A promise to be returned by `Y.task()`.

    @property promise
    @type {Promise}
    **/
    this.promise = new Y.Promise(function (fulfill, reject) {
        /**
        Resolves the exposed promise with the provided value

        @method resolve
        @param {Any} value Any value
        **/
        self.resolve = function (value) {
            if (Y.Promise.isPromise(value)) {
                value.then(fulfill, reject);
            } else {
                fulfill(value);
            }
        };
        /**
        Rejects the exposed promise with the provided reason

        @method reject
        @param {Any} reason Any value for the rejection reason. Usually an error.
        **/
        self.reject = reject;
    });
    this.accept = function (value) {
        self.next(null, value);
    };
    this.fail = function (error) {
        self.next(error);
    };
    /**
    The generator instance.

    @property thread
    @type {Object}
    **/
    try {
        this.thread = spawn.call(this);
        this.next();
    } catch (err) {
        this.reject(err);
    }
}
/**
Step function that gets called every time the generator function yields.
When a promise is yielded, it observes the promise's result. If the promise
is successfully resolved, it calls itself with a null error and the value
of the promise. If the promise was rejected, it calls itself with an error.

Internally it passes the value or the error to the generator's `throw()`
or `send()` methods, so that the error or value passed to it are the value
taken by the left side of the yield expression:

<pre><code>
// the value of foo is the value passed as the second parameter
// of task.next()
var foo = yield somePromise;
</code></pre>

This function rewrites itself for all instances of Task the first time it
is called, being replaced by _nextES6 or _nextFF depending on the platform.

@method next
@param {Any} [error] An optional error to pass to the generator function
@param {Any} [value] A value to pass to the generator function
**/
Task.prototype.next = supportsES6Syntax ? function (error, value) {
    var result,
        resultValue;

    try {
        // using arguments.length to allow rejections for falsy reasons
        result = arguments.length === 1 ? this.thread.throw(error) :
                this.thread.send(value);
    } catch (e) {
        // error thrown inside the generator function are turned into
        // rejections for the promise that Y.task() returns
        return this.reject(e);
    }

    resultValue = result.value;
    
    // ES6 generators return an object that in the last iteration have a
    // "done" property. When done, resolve the promise.
    if (result.done) {
        this.resolve(resultValue);
    // Using isPromise and not Y.when() to prevent speedbumps in Node
    // This may be revisited if there is an async behavior we want to keep
    } else if (isPromise(resultValue)) {
        resultValue.then(this.accept, this.fail);
    } else {
        this.accept(resultValue);
    }
} : function (error, value) {
    var result;

    try {
        // using arguments.length to allow rejections for falsy reasons
        result = arguments.length === 1 ? this.thread.throw(error) :
                this.thread.send(value);
    } catch (e) {
        // Old Firefox iterators throw an exception when done
        if (e instanceof StopIteration) {
            this.resolve(this.result);
        } else {
            this.reject(e);
        }
        return;
    }
    this.result = result;

    // Using isPromise and not Y.when() to prevent speedbumps in Node
    // This may be revisited if there is an async behavior we want to keep
    if (isPromise(result)) {
        result.then(this.accept, this.fail);
    } else {
        this.accept(result);
    }
};

Y.task.Task = Task;


}, 'gallery-2013.05.15-21-12', {"requires": ["promise"]});
