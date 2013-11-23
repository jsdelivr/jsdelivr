(function() {
  var Walrus;

  Walrus = (typeof exports !== "undefined" && exports !== null ? require('./walrus') : this).Walrus;

  /**
   * *:plus*
   * Returns the sum of two numbers
   *
   * Parameters:
   *  number - the number to add to the expression
   *
   * Usage:
   *
   *  {{ 15 | :plus( 6 ) }} // => 21
  */

  Walrus.addFilter('plus', function(value, number) {
    return value + number;
  });

  /**
   * *:minus*
   * Returns the difference of two numbers
   *
   * Parameters:
   *  number - the number to subtract from the expression
   *
   * Usage:
   *
   *  {{ 15 | :minus( 6 ) }} // => 9
  */

  Walrus.addFilter('minus', function(value, number) {
    return value - number;
  });

  /**
   * *:gt*
   * Returns whether `value` is greater than the given number
   *
   * Parameters:
   *  number - the number to compare against
   *
   * Usage:
   *
   *  {{ 15 | :gt( 5 ) }} // => true
  */

  Walrus.addFilter('gt', function(value, number) {
    return value > number;
  });

  /**
   * *:gte*
   * Returns whether `value` is greater than or equal to the given number
   *
   * Parameters:
   *  number - the number to compare against
   *
   * Usage:
   *
   *  {{ 15 | :gte( 5 ) }} // => true
  */

  Walrus.addFilter('gte', function(value, number) {
    return value >= number;
  });

  /**
   * *:lt*
   * Returns whether `value` is less than the given number
   *
   * Parameters:
   *  number - the number to compare against
   *
   * Usage:
   *
   *  {{ 15 | :lt( 5 ) }} // => false
  */

  Walrus.addFilter('lt', function(value, number) {
    return value < number;
  });

  /**
   * *:lte*
   * Returns whether `value` is less than or equal to the given number
   *
   * Parameters:
   *  number - the number to compare against
   *
   * Usage:
   *
   *  {{ 15 | :lte( 5 ) }} // => false
  */

  Walrus.addFilter('lte', function(value, number) {
    return value <= number;
  });

  /**
   * *:floor*
   * Returns the given number rounded down to the nearest integer.
   *
   * Parameters: none
   *
   * Usage:
   *  {{ 5.6 | :floor }} // => 5
  */

  Walrus.addFilter('floor', function(value) {
    return Math.floor(value);
  });

  /**
   * *:ceil*
   * Returns the given number rounded up to the nearest integer.
   *
   * Parameters: none
   *
   * Usage:
   *  {{ 5.6 | :ceil }} // => 6
  */

  Walrus.addFilter('ceil', function(value) {
    return Math.ceil(value);
  });

  /**
   * *:round*
   * Returns the given number rounded to the nearest integer.
   *
   * Parameters: none
   *
   * Usage:
   *  {{ 5.6 | :round }} // => 6
  */

  Walrus.addFilter('round', function(value) {
    return Math.round(value);
  });

}).call(this);
