/*
 * jsy JavaScript Library v0.0.1
 * https://github.com/labidiaymen/jsy
 * Author Labidi Aymen
 * Released under the MIT license
 * Copyright 2015
 *
 */

// return true if the length of the string between the range
String.prototype.lengthBetween = function (min, max) {
    return this.length >= min && this.length <= max;
}

// return true if the string between the range
String.prototype.between = function (min, max) {
    return this >= min && this <= max;
}

// test if the string is a valid email
String.prototype.isEmail = function () {
    var rex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return rex.test(this);
}

Array.prototype.isArray = function (myArray) {
    return myArray.constructor.toString().indexOf("Array") > -1;
}

// search if the element exist in Array 
Array.prototype.inArray = function (value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === value) return true;
    }
    return false;
};

// test if the string is an Integer
String.prototype.isInt = function () {
    return this % 1 === 0  && !this.isEmpty();
}

// test if the string is Float
String.prototype.isFloat = function () {
    return this === Number(this) && this % 1 !== 0  && !this.isEmpty();
}

// test if the string is empty
 String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};
