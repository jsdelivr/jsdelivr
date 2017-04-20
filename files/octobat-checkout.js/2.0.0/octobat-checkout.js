(function() {
    var e, t, n, a, r, isIE, currentScriptEl, c, octobatCheckoutApp, host_url;
    n = void 0,
    r = void 0,
    t = void 0,
    a = void 0,
    octobatCheckoutApp = void 0,
    host_url = "https://checkout-form.herokuapp.com",
    
    currentScriptEl = function() {
      var checkout_script = document.currentScript || function() {
          var e = document.getElementsByTagName("script");
          return e[e.length - 1]
      }();
      
      if (checkout_script.id === '')
        checkout_script.id += "o_ch_" + (new Date).getTime();
      return checkout_script;
    },
    isIE = function() {
        var ua = window.navigator.userAgent;
        var isIE = ua.indexOf("MSIE ");
        return isIE > 0 || navigator.userAgent.match(/Trident.*rv\:11\./) ? !0 : !1
    },
    c = function(e, t) {
        var n, a;
        return a = document.querySelector(".octobat-checkout-frame"), void 0 !== window.jQuery ? (n = jQuery.Event(e), n.detail = t, $(a).trigger(n)) : (isIE() ? (n = document.createEvent("CustomEvent"), n.initCustomEvent(e, !0, !0, t)) : n = new CustomEvent(e, {
            detail: t,
            bubbles: !0,
            cancelable: !0
        }), a.dispatchEvent(n))
    },
    OctobatCheckoutAppJS = function() {
        this.iframeLoaded = !1
    },
    OctobatCheckoutAppJS.prototype = {
      bind: function(e, t, n) {
        return e.addEventListener ? e.addEventListener(t, n, !1) : e.attachEvent("on" + t, n)
      },
      unbind: function(e, t, n) {
        return e.removeEventListener ? e.removeEventListener(t, n, !1) : e.detachEvent("on" + t, n)
      },
      toURIparams: function(e) {
        return "?" + Object.keys(e).reduce(function(t, n) {
          return t.push(n + "=" + encodeURIComponent(e[n])), t
        }, []).join("&")
      },
      scriptAttributes: function(e) {
        var attributes = {
          octobat_pkey: octobatCheckoutApp.scriptData("octobat-pkey", e),
          plan: octobatCheckoutApp.scriptData("plan", e),
          charge: octobatCheckoutApp.scriptData("charge", e),
          taxes_included: octobatCheckoutApp.scriptData("taxes", e),
          transaction_type: octobatCheckoutApp.scriptData("transaction-type", e) || "eservice",
          gateway: octobatCheckoutApp.scriptData("gateway", e),
          moss_compliance: octobatCheckoutApp.scriptData("moss-compliance", e) || true,
          validate_tax_number: octobatCheckoutApp.scriptData("validate-tax-number", e) || true,
          display_billing_address: octobatCheckoutApp.scriptData("billing-address", e) || false,
          coupon: octobatCheckoutApp.scriptData("coupon", e) || false,
          name: octobatCheckoutApp.scriptData("name", e),
          email: octobatCheckoutApp.scriptData("email", e),
          country: octobatCheckoutApp.scriptData("country", e),
          street_line_1: octobatCheckoutApp.scriptData("street-line-1", e),
          zip_code: octobatCheckoutApp.scriptData("zip-code", e),
          city: octobatCheckoutApp.scriptData("city", e),
          description: octobatCheckoutApp.scriptData("description", e),
          supplier_name: octobatCheckoutApp.scriptData("supplier-name", e),
          image: octobatCheckoutApp.scriptData("image", e),
          script_id: e.id,
          octobat_checkout_id: octobatCheckoutApp.scriptData("octobat-checkout-id", e),
          detailed_panel: octobatCheckoutApp.scriptData("detailed-panel", e) || false,
          quantity: parseInt(octobatCheckoutApp.scriptData("quantity", e)) || 1
        };
        return attributes;
      },
      scriptData: function(e, t) {
        return t || (t = OctobatCheckout.currentScript()), t.getAttribute("data-" + e)
      },
      iframeHasLoaded: function(e) {
        return void 0 !== e && (this.iframeLoaded = e), this.iframeLoaded
      }
    },
    
    OctobatCheckoutButtonJS = function(e) {
        this._iframe = OctobatCheckout.iframe(),
        this._label = e || "Pay with card"
    },
    OctobatCheckoutButtonJS.prototype = {
      render: function() {
        var e, t, n, a;
        0 === document.querySelectorAll(".octobat-checkout-button-style").length && (t = document.head, a = document.createElement("link"), a.type = "text/css", a.rel = "stylesheet", a.href = "https://s3-eu-west-1.amazonaws.com/js.octobat.com/css/octobat-checkout-button.css", a.className = "octobat-checkout-button-style", t.appendChild(a)), e = void 0, n = void 0, e = document.createElement("button"), e.className = "octobat-checkout-button-el", n = document.createTextNode(this._label), e.appendChild(n), window.OctobatCheckout.currentForm().appendChild(e), window.OctobatCheckout.currentForm().addEventListener("submit", function(e) {
          var t, n;
          return e.preventDefault(), n = this.getElementsByClassName("octobat-checkout-button")[0], t = octobatCheckoutApp.scriptAttributes(n), octobatCheckoutApp.iframeHasLoaded() ? OctobatCheckout.iframe().toggle(t) : (document.querySelector(".octobat-checkout-loader").style.display = "block", document.querySelector(".octobat-checkout-frame").addEventListener("octobat.iframe.loaded", function() {
            return OctobatCheckout.iframe().toggle(t, true)
          })), !1
        })
      }
    },
    
    
    OctobatCheckoutIFrameJS = function(e) {
      var t;
      this.url = window.location.protocol + "//" + window.location.host + "/";
      for (t in e) this[t] = e[t]
    },
    
    
    OctobatCheckoutIFrameJS.prototype = {
      _host: function() {
        return host_url + "/v2"
      },
      _attributes: function() {
        var e, t;
        t = {};
        for (e in this) this.hasOwnProperty(e) && null !== this[e] && (t[e] = this[e]);
        return t
      },
      appendIframe: function() {
        var e, t;
        return 0 === document.querySelectorAll(".octobat-checkout-frame").length ? (e = void 0, t = void 0, t = document.createElement("iframe"), t.setAttribute("frameBorder", "0"), t.setAttribute("allowtransparency", "true"), e = "z-index: 9999;\nbackground: transparent;\nbackground: rgba(0,0,0,0.005);\nvisibility: hidden;\nborder: 0px none transparent;\noverflow-x: hidden;\noverflow-y: auto;\nmargin: 0;\npadding: 0;\n-webkit-tap-highlight-color: transparent;\n-webkit-touch-callout: none;", e += "position: fixed;\nleft: 0;\ntop: 0;\nwidth: 0%;\nheight: 0%;", t.style.cssText = e, t.src = this._host() + octobatCheckoutApp.toURIparams(this._attributes()), t.className = t.name = "octobat-checkout-frame", document.body.appendChild(t), octobatCheckoutApp.bind(t, "load", function() {
          var e, t;
          octobatCheckoutApp.iframeHasLoaded(!0);
          t = "octobat.iframe.loaded";
          e = document.createEvent("Event");
          e.initEvent(t, !0, !0);
          return OctobatCheckout.iframe()._el.dispatchEvent(e);
        })) : t = document.querySelector(".octobat-checkout-frame"), this._el = t, t
      },
      toggle: function(e, t) {
        var n, a, r, i;
        if (t == null) {
          t = false;
        }
        n = document.querySelector("body");
        
        if (t || this._el.style.height === "0%" && octobatCheckoutApp.iframeHasLoaded()) {
          n.style.overflow = "hidden";
          
          this._el.style.width = "100%";
          this._el.style.height = "100%";
          this._el.style.visibility = "";

          r = document.querySelector(".octobat-checkout-loader");
          r.style.display = "none";
          
          this._el.contentWindow.postMessage(e, host_url);
          
          i = document.createElement("meta");
          i.name = "viewport";
          i.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0";
          document.getElementsByTagName("head")[0].appendChild(i);
        }
        else {          
          n.style.overflow = "";
          this._el.style.width = "0%";
          this._el.style.height = "0%";
          this._el.style.visibility = "hidden";
          a = document.getElementsByTagName("head")[0];
          i = a.lastChild;
          if (i.name === "viewport" && i.content === "width=device-width, initial-scale=1.0, maximum-scale=1.0") {
            a.removeChild(i);
          }
        }
        
      }
    },
    
    
    OctobatCheckoutJS = function(t) {
      this.app = new OctobatCheckoutAppJS,
      this.currentScriptEl = t || currentScriptEl(),
      this.currentFormEl = this.currentScriptEl.parentNode,
      this.octobat_pkey = "",
      this.callback = {},
      this._iframe = null,
      this._button = null,
      this._loader = null
    },
    
    OctobatCheckoutJS.prototype = {
      app: function() {
        return this.app
      },
      configure: function(e) {
        var t, b;
        this.octobat_pkey = e.octobat_pkey;
        this.callback = e.callback;
        
        if (0 === document.querySelectorAll(".octobat-checkout-loader").length) {
          this._loader = document.createElement("div");
          this._loader.className = "octobat-checkout-loader";
          this._loader.style.cssText = "position:fixed;left:0;top:0;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;z-index:9999;background:rgba(0,0,0,0.6);";
          this._loader.style.display = "none";
          document.body.appendChild(this._loader);
          
          b = document.createElement("div");
          b.style.cssText = "margin:auto;position:absolute;top:0;left:0;bottom:0;right:0; width: 60px; height: 60px; background-color:#FFFFFF;border-radius: 60px;";
          this._loader.appendChild(b);
          
          t = document.createElement("img");
          t.src = "https://s3-eu-west-1.amazonaws.com/js.octobat.com/img/spiffygif_80x80.gif"
          //t.className = "fa fa-spin fa-spinner";
          t.style.cssText = "margin:auto;position:absolute;top:0;left:0;bottom:0;right:0;height:54px;width:54px;";
          b.appendChild(t);
        }
        return this;
      },
      
      currentScript: function(e) {
        if (e !== void 0) {
          this.currentScriptEl = e;
          this.currentFormEl = e.parentNode;
        }
        return this.currentScriptEl;
      },
      currentForm: function() {
        return this.currentFormEl;
      },
      iframe: function() {
        return this._iframe
      },
      pkey: function() {
        return this.octobat_pkey
      },
      open: function(e) {
        e.key = this.octobat_pkey;
        
        if (this._iframe === null) {
          this._iframe = new OctobatCheckoutIFrameJS({key: this.octobat_pkey});
          this._iframe.appendIframe();
        }
        
        octobatCheckoutApp.iframeHasLoaded() ? this._iframe.toggle(e) : (document.querySelector(".octobat-checkout-loader").style.display = "block", this._iframe._el.addEventListener("octobat.iframe.loaded", function() {
          return OctobatCheckout._iframe.toggle(e);
        }));
      },
      close: function() {
        this._iframe instanceof r && (this._iframe._el.remove(), this._iframe = null, octobatCheckoutApp.iframeHasLoaded(!1))
      },
      initCheckout: function() {
        this._iframe = new OctobatCheckoutIFrameJS({key: this.octobat_pkey});
        this._iframe.appendIframe();
        this._button = new OctobatCheckoutButtonJS(octobatCheckoutApp.scriptData("label"));
        return this._button.render();
      }
    }
    
    if (void 0 === this.OctobatCheckout) {
      this.OctobatCheckout = new OctobatCheckoutJS;
      
      window.addEventListener("message", function(e) {
        if (e.origin === host_url) switch (e.data.type) {
          case "closed":
            "hidden" !== document.querySelector("iframe.octobat-checkout-frame").style.visibility && OctobatCheckout.iframe().toggle();
            break;
          case "error":
            c("octobat.checkout.error", e.data);
            break;
          default:
            "hidden" !== document.querySelector("iframe.octobat-checkout-frame").style.visibility && (OctobatCheckout.callback(e.data), OctobatCheckout.iframe().toggle())
        }
      });
    }
    
    this.OctobatCheckout.currentScript(currentScriptEl());
    octobatCheckoutApp = this.OctobatCheckout.app;
        
    if (document.querySelectorAll(".octobat-checkout-button").length > 0) {
      OctobatCheckout.configure({
        octobat_pkey: octobatCheckoutApp.scriptData("octobat-pkey"),
        callback: function(e) {
          var t, n, a, r;
          a = document.getElementById(e.id).parentNode;
          n = document.createElement("input");
          n.type = "hidden";
          n.name = "transactionDetails";
          n.value = e.transaction;
          a.appendChild(n);
          t = a.querySelector(".octobat-checkout-button-el");
          t.setAttribute('disabled', 'disabled');
          t.innerHTML = "Please wait ...";
          return a.submit();
        }
      });
      
      OctobatCheckout.initCheckout();
    }
}).call(this);