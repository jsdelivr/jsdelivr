(function() {
  var Walrus, locale, separate;

  Walrus = (typeof exports !== "undefined" && exports !== null ? require('./walrus') : this).Walrus;

  separate = function(value, thousands, decimal) {
    var fraction, whole, _ref;
    _ref = value.split(decimal), whole = _ref[0], fraction = _ref[1];
    whole = whole.replace(/(\d)(?=(\d{3})+$)/g, "$1" + thousands);
    if (fraction) {
      return [whole, fraction].join(decimal);
    } else {
      return whole;
    }
  };

  /**
   * *:currency*
   * Returns a string formatted in the current locale's format.
   * Delegates to [accounting.js](http://josscrowcroft.github.com/accounting.js/) if present.
   *
   * Parameters:
   *  precision - the decimal place level to show cents, if applicable
   *
   * Usage:
   *
   *  {{ 36000 | :currency( '$', 2 ) }} // => $36,000.00
   *  {{ 36000 | :currency }} // => $36,000
  */

  locale = Walrus.i18n.t('currencies');

  if (typeof accounting !== "undefined" && accounting !== null) {
    accounting.settings.currency.symbol = locale.symbol;
    accounting.settings.currency.decimal = locale.decimal;
    accounting.settings.currency.precision = locale.precision;
    accounting.settings.currency.thousand = locale.thousand;
    Walrus.addFilter('currency', function() {
      return accounting.formatMoney.apply(accounting, arguments);
    });
    Walrus.addFilter('formatMoney', function() {
      return accounting.formatMoney.apply(accounting, arguments);
    });
  } else {
    Walrus.addFilter('currency', function(value, symbol, precision, decimal, thousand) {
      var amount, moneys;
      if (symbol == null) symbol = locale.symbol;
      if (precision == null) precision = locale.precision;
      if (decimal == null) decimal = locale.decimal;
      if (thousand == null) thousand = locale.thousand;
      moneys = value.toFixed(precision);
      amount = separate(moneys, thousand, decimal);
      return "" + symbol + amount;
    });
  }

}).call(this);
