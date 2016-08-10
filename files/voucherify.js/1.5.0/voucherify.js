window.Voucherify = (function (window, document, $) {
  "use strict";

  var OPTIONS = {
    url: "https://api.voucherify.io/client/v1/validate"
  };

  var xhrImplementation = null;

  if (!!$ && typeof($.ajax) === "function" && !!$.Deferred) {
    xhrImplementation = function (queryString, callback) {
      var deferred = null;

      if (typeof(callback) !== "function") {
        deferred = $.Deferred();
      }

      $.ajax({
        type: "GET",

        url: OPTIONS.url + queryString,

        xhrFields: {
          withCredentials: true
        },

        dataType: "json",
        headers: {
          "X-Client-Application-Id": OPTIONS.applicationId,
          "X-Client-Token": OPTIONS.token,
          "X-Voucherify-Channel": "Voucherify.js"
        },
        timeout: OPTIONS.timeout,

        success: function (data) {
          var result = null;

          if (data && typeof(data.valid) === "boolean") {
            if (typeof(callback) === "function") {
              callback(data);
            } else {
              deferred.resolve(data);
            }
          } else {
            result = {
              type: "error",
              message: "Unexpected response structure.",
              context: data
            };

            if (typeof(callback) === "function") {
              callback(result);
            } else {
              deferred.reject(result);
            }
          }
        },

        error: function (error) {
          var result = {
            type: "error",
            message: "XHR error happened.",
            context: error
          };

          if (typeof(callback) === "function") {
            callback(result);
          } else {
            deferred.reject(result);
          }
        }
      });

      if (typeof(callback) !== "function") {
        return deferred.promise();
      } else {
        return undefined;
      }
    };
  } else {
    xhrImplementation = function (queryString, callback) {
      var request = new window.XMLHttpRequest();

      request.timeout = OPTIONS.timeout;
      request.withCredentials = true;
      request.open("GET", OPTIONS.url + queryString, true);

      request.setRequestHeader("X-Client-Application-Id", OPTIONS.applicationId);
      request.setRequestHeader("X-Client-Token", OPTIONS.token);
      request.setRequestHeader("X-Voucherify-Channel", "Voucherify.js");

      request.onload = function() {
        var result = null;

        if (request.status >= 200 && request.status < 400) {
          var data = JSON.parse(request.responseText);

          if (data && typeof(data.valid) === "boolean") {
            if (typeof(callback) === "function") {
              callback(data);
            }
          } else {
            result = {
              type: "error",
              message: "Unexpected response structure.",
              context: data
            };

            if (typeof(callback) === "function") {
              callback(result);
            }
          }
        } else {
          result = {
            type: "error",
            message: "Unexpected status code.",
            context: request.status
          };

          if (typeof(callback) === "function") {
            callback(result);
          }
        }
      };

      request.onerror = function (error) {
        var result = {
          type: "error",
          message: "XHR error happened.",
          context: error
        };

        if (typeof(callback) === "function") {
          callback(result);
        }
      };

      request.send();
    };
  }

  function roundMoney(value) {
    return Math.round(value * (100 + 0.001)) / 100;
  }

  function validatePercentDiscount(discount) {
    if (!discount || discount < 0 || discount > 100) {
      throw new Error('Invalid voucher, percent discount should be between 0-100.');
    }
  }

  function validateAmountDiscount(discount) {
    if (!discount || discount < 0) {
      throw new Error("Invalid voucher, amount discount must be higher than zero.");
    }
  }

  function validateUnitDiscount(discount) {
    if (!discount || discount < 0) {
      throw new Error("Invalid voucher, unit discount must be higher than zero.");
    }
  }

  var voucherify = {
    initialize: function (clientAppId, token, timeout) {
      OPTIONS.applicationId = clientAppId;
      OPTIONS.token = token;
      OPTIONS.timeout = timeout || 5000;
    },

    setIdentity: function (trackingId) {
      OPTIONS.trackingId = trackingId;
    },

    validate: function (code, callback) {
      if (!OPTIONS.applicationId && !OPTIONS.token) {
        console.error("Voucherify client could not verify coupon - Lack of configuration - Missing Client Application ID or Token.");
        return null;
      }

      var amount;

      if (typeof(code) === "object") {
        amount = code.amount;
        code = code.code;
      }

      if (!!code) {
        code = code.replace(/[\s\r\n]/g, "");
      }

      if (!code) {
        console.error("Voucherify client could not verify code, because it is missing - please provide Voucher Code.");
        return null;
      }

      var queryString = "?code=" + encodeURIComponent(code);

      if (amount) {
        queryString += "&amount=" + parseInt(amount); // in cents, amount=1000 means $10
      }

      if (OPTIONS.trackingId) {
        queryString += "&tracking_id=" + encodeURIComponent(OPTIONS.trackingId);
      }

      return xhrImplementation(queryString, callback);
    },

    utils: {
      calculatePrice: function (basePrice, voucher, unitPrice) {
        var e = 100; // Number of digits after the decimal separator.
        var discount;

        if (!voucher.discount) {
          throw new Error("Unsupported voucher type.");
        }

        if (voucher.discount.type === 'PERCENT') {
          discount = voucher.discount.percent_off;
          validatePercentDiscount(discount);
          var priceDiscount = basePrice * (discount / 100);
          return roundMoney(basePrice - priceDiscount);

        } else if (voucher.discount.type === 'AMOUNT') {
          discount = voucher.discount.amount_off / e;
          validateAmountDiscount(discount);
          var newPrice = basePrice - discount;
          return roundMoney(newPrice > 0 ? newPrice : 0);

        } else if (voucher.discount.type === 'UNIT') {
          discount = voucher.discount.unit_off;
          validateUnitDiscount(discount);
          var newPrice = basePrice - unitPrice * discount;
          return roundMoney(newPrice > 0 ? newPrice : 0);

        } else {
          throw new Error("Unsupported discount type.");
        }
      },

      calculateDiscount: function(basePrice, voucher, unitPrice) {
        var e = 100; // Number of digits after the decimal separator.
        var discount;

        if (!voucher.discount) {
          throw new Error("Unsupported voucher type.");
        }

        if (voucher.discount.type === 'PERCENT') {
          discount = voucher.discount.percent_off;
          validatePercentDiscount(discount);
          return roundMoney(basePrice * (discount / 100));

        } else if (voucher.discount.type === 'AMOUNT') {
          discount = voucher.discount.amount_off / e;
          validateAmountDiscount(discount);
          var newPrice = basePrice - discount;
          return roundMoney(newPrice > 0 ? discount : basePrice);

        } else if (voucher.discount.type === 'UNIT') {
          discount = voucher.discount.unit_off;
          validateUnitDiscount(discount);
          var priceDiscount = unitPrice * discount;
          return roundMoney(priceDiscount > basePrice ? basePrice : priceDiscount);

        } else {
          throw new Error("Unsupported discount type.");
        }
      }
    },
    render: function(selector, options) {
      var $element = $(selector);
      if (!$element || !$element.length) {
        throw new Error("Element '" + selector + "' cannot be found");
      }
      options = options || {};

      function getCapitalizedName(name) {
        return name.charAt(0).toUpperCase() + name.slice(1);
      }
      
      function getPropertyName(prefix, name) {
        return prefix + getCapitalizedName(name);
      }
      
      function getConfigProperty(prefix, name) {
        return options[getPropertyName(prefix, name)];
      }

      function create$control(type, name, $container, config) {
        config = config || {};
        var $control = null;
        var configured$control = getConfigProperty("selector", name);
        
        if (config.configurable && configured$control) {
          $control = $(configured$control);
        }
        
        if (!$control || !$control.length) {
          $control = $(document.createElement(type));
          $container.append($control);
          
          for (var attribute in config) {
            if (attribute !== "configurable" && config.hasOwnProperty(attribute)) {
              $control.attr(attribute, config[attribute]);
            }
          }
          
          if (type === "input") {
            $control.attr("name", getPropertyName("voucherify", name));
          }
          
          if (type === "span" && config.text) {
            $control.text(config.text);
          }
        }
        
        $control.addClass(typeof getConfigProperty("class", name) === "string" ? getConfigProperty("class", name) : getPropertyName("voucherify", name));
        return $control;
      }
      
      var $container     = create$control("div", "container", $element);
      var $logoContainer = create$control("figure", "logo", $container);
      var $logo          = create$control("img", "logo", $logoContainer, { src: typeof options.logoSrc === "string" ? options.logoSrc : "https://app.voucherify.io/images/favicon.png" });
      var $code          = create$control("input", "code", $container, { type: "text", placeholder: typeof options.textPlaceholder === "string" ? options.textPlaceholder : "e.g. abc-123" });
      var $discountType  = create$control("input", "discountType", $container, { type: "hidden", configurable: true });
      var $percentOff    = create$control("input", "percentOff", $container, { type: "hidden", configurable: true });
      var $amountOff     = create$control("input", "amountOff", $container, { type: "hidden", configurable: true });
      var $unitOff       = create$control("input", "unitOff", $container, { type: "hidden", configurable: true });
      var $tracking      = create$control("input", "tracking", $container, { type: "hidden", configurable: true });
      var $validate      = create$control("button", "validate", $container, {});
      var $validateText  = create$control("span", "validateText", $validate, { text: typeof options.textValidate === "string" ? options.textValidate : "Validate" });

      var self = this;
      var classInvalid = options.classInvalid === "string" ? options.classInvalid : "voucherifyInvalid";
      var classValid = typeof options.classValid === "string" ? options.classValid : "voucherifyValid";
      var classInvalidAnimation = options.classInvalidAnimation === "string" ? options.classInvalidAnimation : "voucherifyAnimationShake";
      var classValidAnimation = options.classValidAnimation === "string" ? options.classValidAnimation : "voucherifyAnimationTada";

      $code.on("keyup", function(event) {
        $code.toggleClass(classInvalidAnimation, false);
      });

      $validate.on("click", function(event) {
        $discountType.val("");
        $amountOff.val("");
        $unitOff.val("");
        $percentOff.val("");
        $tracking.val("");

        $validate.toggleClass(classInvalid, false);
        $validate.toggleClass(classValid, false);
        
        if (!$code.val()) {
          $code.toggleClass(classInvalidAnimation, true)
            .delay(1000)
            .queue(function(){
                $code.toggleClass(classInvalidAnimation, false);
                $code.dequeue();
            });
          return;
        }

        self.validate($code.val(), function(response) {   
          if (!response || !response.valid) {
            $validate.toggleClass(classInvalid, true);
            $validate.toggleClass(classValid, false);
            $code.toggleClass(classInvalid, true);
            $code.toggleClass(classValid, false);
            $code.toggleClass(classInvalidAnimation, true)
              .delay(1000)
              .queue(function(){
                $code.toggleClass(classInvalidAnimation, false);
                $code.dequeue();
              });
            return;
          }

        $code.toggleClass(classInvalid, false);
          $discountType.val(response.discount && response.discount.type || "");
          $amountOff.val(response.discount && response.discount.amount_off || 0);
          $unitOff.val(response.discount && response.discount.unit_off || 0);
          $percentOff.val(response.discount && response.discount.percent_off || 0);
          $tracking.val(response.tracking_id || "");
        
          $code.prop("disabled", true);
          $validate.prop("disabled", true);

          $code.toggleClass(classValid, true);
          $validate.toggleClass(classValid, true);
          $validate.toggleClass(classInvalid, false);
          $code.toggleClass(classInvalid, false);
            
          $code.toggleClass(classValidAnimation, true)

          if (options && options.onValidated && typeof options.onValidated === "function") {
            options.onValidated(response);
          }
        });
      });
    }
  };

  return voucherify;
} (window, window.document, window.jQuery));