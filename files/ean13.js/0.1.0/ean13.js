"use strict";
var EAN13;

EAN13 = (function() {
  EAN13.prototype.defaults = {
    number: true,
    prefix: true,
    color: "#000",
    offsetX: 0,
    offsetY: 0,
    onValid: function() {},
    onInvalid: function() {},
    onSuccess: function() {},
    onError: function() {}
  };

  EAN13.prototype.options = {};

  function EAN13() {}

  EAN13.prototype.draw = function(element, number, _options) {
    var code;
    this.parseOptions(_options);
    code = this.getCode(number);
    return this.print(element, code, number);
  };

  EAN13.prototype.print = function(element, code, number) {
    var border_height, char, chars, context, height, i, item_width, layout, left, lines, offset, offsetX, offsetY, prefix, width, _i, _j, _len, _len1;
    layout = {
      prefix_offset: 0.06,
      font_stretch: 0.073,
      border_line_height_number: 0.9,
      border_line_height: 1,
      line_height: 0.9,
      font_size: 0.15,
      font_y: 1.03,
      text_offset: 4.5
    };
    offsetX = this.options.offsetX;
    offsetY = this.options.offsetY;
    width = this.options.width || element.width;
    width = (this.options.prefix ? width * 0.8 : width);
    height = this.options.height || element.height;
    if (this.options.number) {
      border_height = layout.border_line_height_number * height;
    } else {
      border_height = layout.border_line_height * height;
    }
    height = layout.line_height * border_height;
    item_width = width / 95;
    if (element.getContext) {
      context = element.getContext("2d");
      this.clear(element, context);
      context.fillStyle = this.options.color;
      left = (this.options.prefix ? element.width * layout.prefix_offset : 0);
      lines = code.split("");
      context.fillRect(offsetX + left, offsetY, item_width, border_height);
      left = left + item_width * 2;
      context.fillRect(offsetX + left, offsetY, item_width, border_height);
      left = left + item_width;
      i = 0;
      while (i < 42) {
        if (lines[i] === "1") {
          context.fillRect(offsetX + left, offsetY, item_width, height);
        }
        left = left + item_width;
        i++;
      }
      left = left + item_width;
      context.fillRect(offsetX + left, offsetY, item_width, border_height);
      left = left + item_width * 2;
      context.fillRect(offsetX + left, offsetY, item_width, border_height);
      left = left + item_width * 2;
      i = 42;
      while (i < 84) {
        if (lines[i] === "1") {
          context.fillRect(offsetX + left, offsetY, item_width, height);
        }
        left = left + item_width;
        i++;
      }
      context.fillRect(offsetX + left, offsetY, item_width, border_height);
      left = left + item_width * 2;
      context.fillRect(offsetX + left, offsetY, item_width, border_height);
      if (this.options.number) {
        context.font = layout.font_size * height + "px monospace";
        prefix = number.substr(0, 1);
        if (this.options.prefix) {
          context.fillText(prefix, offsetX + 0, offsetY + (border_height * layout.font_y));
        }
        offset = item_width * layout.text_offset + (this.options.prefix ? layout.prefix_offset * element.width : 0);
        chars = number.substr(1, 6).split("");
        for (_i = 0, _len = chars.length; _i < _len; _i++) {
          char = chars[_i];
          context.fillText(char, offsetX + offset, offsetY + (border_height * layout.font_y));
          offset += layout.font_stretch * width;
        }
        offset = 49 * item_width + (this.options.prefix ? layout.prefix_offset * element.width : 0) + layout.text_offset;
        chars = number.substr(7).split("");
        for (_j = 0, _len1 = chars.length; _j < _len1; _j++) {
          char = chars[_j];
          context.fillText(char, offsetX + offset, offsetY + (border_height * layout.font_y));
          offset += layout.font_stretch * width;
        }
      }
      if (this.options.onSuccess) {
        return this.options.onSuccess.call();
      }
    } else {
      if (this.options.onError) {
        return this.options.onError.call();
      }
    }
  };

  EAN13.prototype.clear = function(element, context) {
    return context.clearRect(this.options.offsetX, this.options.offsetY, this.options.width || element.width, this.options.height || element.height);
  };

  EAN13.prototype.parseOptions = function(_options) {
    
    this.options=_options;
    for(var option in this.defaults)
      this.options[option] = _options[option] || this.defaults[option];
    ;
    return null;
  };

  EAN13.prototype.getCode = function(number) {
    var c_encoding, code, countries, i, parts, raw_number, x, y, z;
    if (this.validate(number)) {
      if (this.options.onValid) {
        this.options.onValid.call();
      }
    } else {
      if (this.options.onInvalid) {
        this.options.onInvalid.call();
      }
    }
    x = ["0001101", "0011001", "0010011", "0111101", "0100011", "0110001", "0101111", "0111011", "0110111", "0001011"];
    y = ["0100111", "0110011", "0011011", "0100001", "0011101", "0111001", "0000101", "0010001", "0001001", "0010111"];
    z = ["1110010", "1100110", "1101100", "1000010", "1011100", "1001110", "1010000", "1000100", "1001000", "1110100"];
    countries = ["xxxxxx", "xxyxyy", "xxyyxy", "xxyyyx", "xyxxyy", "xyyxxy", "xyyyxx", "xyxyxy", "xyxyyx", "xyyxyx"];
    code = "";
    c_encoding = countries[parseInt(number.substr(0, 1), 10)].split("");
    raw_number = number.substr(1);
    parts = raw_number.split("");
    i = 0;
    while (i < 6) {
      if (c_encoding[i] === "x") {
        code += x[parts[i]];
      } else {
        code += y[parts[i]];
      }
      i++;
    }
    i = 6;
    while (i < 12) {
      code += z[parts[i]];
      i++;
    }
    return code;
  };

  EAN13.prototype.validate = function(number) {
    var chars, counter, result, value, _i, _len;
    result = null;
    chars = number.split("");
    counter = 0;
    for (_i = 0, _len = chars.length; _i < _len; _i++) {
      value = chars[_i];
      if (_i % 2 === 0) {
        counter += parseInt(value, 10);
      } else {
        counter += 3 * parseInt(value, 10);
      }
    }
    if ((counter % 10) === 0) {
      result = true;
    } else {
      result = false;
    }
    return result;
  };

  return EAN13;

})();

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = EAN13;
}
