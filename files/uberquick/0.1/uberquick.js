// requires jquery

var UberQuick = (function() {
  var $button;
  var self = this;

  createButton = function(obj) {
    var buttonText = obj.button_text;
    var location = obj.store_location;
    var base_url = obj.base_url;
    var price = ""; var quantity = ""; var name = "";
    for (var i = 0; i < obj.items.length; i++) {
      name += "&name=" + obj.items[i].item_name;
      price += "&price=" + obj.items[i].price;
      quantity += "&quantity=" + obj.items[i].quantity;
    }
    var buttonURL = base_url + "/checkout/location=" +location+name+price+quantity;
    var buttonText = "<button action='" + buttonURL + "' class='uberquick-checkout'>" + buttonText + "</button>";
    return buttonText;
  }

  sendRequest = function() {
    var request = $.ajax({url: $('.uberquick-checkout').attr('action'), type: "POST", dataType: "jsonp"});
    request.done(function() {
      console.log("success");
    })
    request.fail(function() {
      console.log("fail");
    })
  }

  return {
    // {base_url: str, button_text: str, store_location: str, items: [{item_name: str, price: int, quantity: int}]}
    loadTransaction: function(obj) {
      $button = $(createButton(obj));
    },
    getButton: function() {
      return $button;
    },
    bindEvent: function() {
      $('body').on("click", '.uberquick-checkout', function(e) {
        e.preventDefault();
        sendRequest();
      })
    }
  }
})();
