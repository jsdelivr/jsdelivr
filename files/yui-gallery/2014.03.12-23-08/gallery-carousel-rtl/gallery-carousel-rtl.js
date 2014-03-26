YUI.add('gallery-carousel-rtl', function(Y) {

//constructor
function CarouselRTLPlugin () {
  CarouselRTLPlugin.superclass.constructor.apply(this, arguments);
}
var JS = Y.Lang;


//Module stuff
CarouselRTLPlugin.NAME = "carouselRTLPlugin";
CarouselRTLPlugin.NS = "rtl";

CarouselRTLPlugin.ATTRS = {
  animation: {
    validator: "_validateAnimation",
    value: { speed: 0, effect: Y.Easing.easeOut }
  }
};


//helper functions
function fixDir (elem) {
  var left = elem.getStyle("left");
  elem
    .setStyle("left", null)
    .setStyle("right", left);
}
//Class
Y.CarouselRTLPlugin = Y.extend(CarouselRTLPlugin, Y.Plugin.Base, {
  initializer: function (config) {
    //After the plugin is fully loaded and rendered fix its direction
    this.afterHostMethod("render", this.renderFix);
    this.beforeHostMethod("scrollTo", this.storePos);
    this.afterHostMethod("scrollTo", this.fixScroll);
  },
  
  renderFix: function () {
    var carousel = this.get("host"),
        boundingBox = carousel.get("boundingBox"),
        items = carousel.get("contentBox").get("children");
    
    //Change the css direction of the container
    boundingBox.setStyle("direction", "rtl");
    
    //Replace list items css left property with "right"
    items.each(fixDir);
    
  },
  
  fixScroll: function (index) {
    var animation = this.get("animation");
    if (animation.speed){
      this.animateAndScrollTo(index);
    } else {
      fixDir(this.get("host").get("contentBox"));
    }
  },
  
  storePos: function () {
    var right = parseInt(this.get("host").get("contentBox").getStyle("right"), 10);
    right = JS.isValue(right) ? right : 0;
    this.set("right", right);
  },
  
  animateAndScrollTo: function (index) {
    var self = this, carousel = self.get("host"),
        anim, animation, cb, first, from, isVertical, to;

    if (carousel.get("rendered")) {
      animation = self.get("animation");
      index = carousel._getCorrectedIndex(index);
      cb = carousel.get("contentBox");
      isVertical = carousel.get("isVertical");
      if (isVertical) {
        from = { top: carousel.get("top") };
        to = { top: carousel._getOffsetForIndex(index) };
      } else {
        cb.setStyle("right", this.get("right"));
        cb.setStyle("left", null);
        from = { right: carousel.get("right") };
        to = { right: carousel._getOffsetForIndex(index) };
      }
      first = carousel.getFirstVisible();
      anim = new Y.Anim({
      node: cb,
      from: from,
      to: to,
      duration: animation.speed,
      easing: animation.effect
      });
      anim.on("end", Y.bind(self._afterAnimEnd, self, index));
      anim.run();
      return new Y.Do.Prevent();
    }
    return false;
  },

  _afterAnimEnd: function (pos) {
    var self = this, carousel = self.get("host");
    carousel.set("selectedItem", pos);
  },
  
  _validateAnimation: function (config) {
    var rv = false;
    if (JS.isObject(config)) {
      if (JS.isNumber(config.speed)) {
        rv = true;
      }
      if (!JS.isUndefined(config.effect) &&
        !JS.isFunction(config.effect)) {
        rv = false;
      }
    }
    return rv;
  }
});


}, 'gallery-2011.06.01-20-18' ,{skinnable:true, requires:['substitute','gallery-carousel','anim','plugin','pluginhost']});
