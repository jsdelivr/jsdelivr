YUI.add('gallery-debounce', function (Y, NAME) {

/**
Debouncing is a similar strategy to throttling (see yui-throttle)

Y.debounce delays the execution of a function by a certain number
of milliseconds, starting over every time the function is called.
That way it allows you to listen only once to events happening
repeated times over a time span.

For example, you can debounce a callback to a keypress event
so that you know when the user stopped typing:
```
Y.one('input').on('click', Y.debounce(500, function () {
    alert('The user stopped typing');
}));
```

@module gallery-debounce
**/

/**
Debounces a function call so that it's only executed once after a certain
time lapse after the last time it was called

@method debounce
@for YUI
@param ms {Number} The number of milliseconds to debounce the function call.
Passing a -1 will disable the debounce
@param fn {Function} The function to delay
@return {Function} Returns a wrapped function that calls fn
**/
Y.debounce = function (ms, debouncedFn) {
    var timeout;

    return function () {
        var self = this,
            args = arguments;

        if (ms === -1) {
            debouncedFn.apply(self, args);
            return;
        }

        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(function () {
            debouncedFn.apply(self, args);
        }, ms);
    };
};


}, 'gallery-2013.05.15-21-12', {"requires": ["yui-base"]});
