/* AXISJ Javascript UI Framework */
/* http://www.axisj.com, license : http://www.axisj.com/license */
 
 
jQuery.fn.loadHtmlElement = function(arg) {
	if(arg == undefined) arg = {}
	var varObj = new AXHtmlElement();
	arg.target = this.get(0).id;
	varObj.setConfig(arg);
    return this;
};

var AXHtmlElement = Class.create(AXJ, {

    version: "AXHtmlElement V1.0",
    author: "tom@axisj.com",
    logs: [
        "2013-04-17 - mods에서 변환했음 - json@axisj.com"
    ],
    initialize: function(AXJ_super) {
        AXJ_super();
        this.config.defaultValue = "";
        this.config.firstEmpty = false;
        this.config.firstChecked = true;
    },
    init: function() {
        var config = this.config;

        if (config.loadUrl) {
            var url = config.loadUrl;
            var qs = config.loadPars;
            var pars =  qs;
            var onLoad = this.onLoad.bind(this);
            new AXReq(url, { pars: pars, onsucc: function(res) {
                if (res.result == "00") {
                    onLoad(res);
                } else {
                    alert(res.msg.dec());
                }
            }
            });
        } else if (config.options) {
            this.onLoad({ ds: config.options });
        }
    },
    onLoad: function(res) {
        var config = this.config;
        if (config.displayType == "select") {
            // firstItemName 추가했음 by raniel, 2013-04-30 
            this.setSelectOption(
    			{ tg: jQuery("#" + config.target)[0], ds: res.ds }, config.defaultValue, config.firstEmpty, config.firstEmptyItemName
    		);
            jQuery("#" + config.target).unbind("change", this.onchange.bind(this));
            jQuery("#" + config.target).bind("change", this.onchange.bind(this));
        }
        if (config.displayType == "radio") {
            this.setInputOption(
    			{ tg: jQuery("#" + config.target), ds: res.ds }, config.defaultValue
    		);
        }
        if (config.displayType == "checkbox") {
            this.setInputOption(
    			{ tg: jQuery("#" + config.target), ds: res.ds }, config.defaultValue
    		);
        }
    },
    setSelectOption: function (obj, selectValue, firstEmpty, firstEmptyItemName) {
        var config = this.config;

        /*
        for (var a = obj.tg.length - 1; a > -1; a--) {
        //obj.tg.options[a] = null;
        alert(a);
        }
        */
		try{
	        obj.tg.innerHTML = "";
		}catch(e){
			return;
		}


        if (firstEmpty) {
            var opts = document.createElement('option');
            opts.value = "";
            if (firstEmptyItemName) {
                opts.text = firstEmptyItemName;
            } else {
                opts.text = "모두";
            }
            obj.tg.appendChild(opts);
        }
        jQuery.each(obj.ds, function(index, n) {
            if (n.optgroup) {

                var oGroup = document.createElement('optgroup');
                oGroup.label = n.optgroup.dec();

                jQuery.each(n.option, function() {
                  if ( this.value != null ) {
                      var opts = document.createElement('option');
                      opts.value = this.value.dec();
                      opts.innerText = this.text.dec();
                      if (selectValue != undefined) if (selectValue == this.value.dec()) opts.selected = true;
                      oGroup.appendChild(opts);
                    }
                });

                obj.tg.appendChild(oGroup);

            } else {

                var opts = document.createElement('option');
                opts.value = n.value.dec();
                opts.innerText = n.text.dec();
                if (selectValue != undefined) if (selectValue == n.value.dec()) opts.selected = true;
                obj.tg.appendChild(opts);

            }
        });

        var robj = (obj.tg.selectedIndex > -1) ? { value: obj.tg.options[obj.tg.selectedIndex].value, text: obj.tg.options[obj.tg.selectedIndex].text} : { value: "", text: "" };
        this.loadSucc(robj);

    },
    setInputOption: function(obj, selectValue) {
        var config = this.config;
        obj.tg.empty(); //타켓 초기화

        var po = [];
        var robj = { value: "", text: "" };
        this.ids = obj.ds;
        jQuery.each(obj.ds, function(index, n) {
            //alert(Object.toJSON(n));

            if (config.title) {
                po.push("<input type=\"" + config.displayType + "\" name=\"" + config.name + "\" value=\"" + n.value.dec() + "\" title=\"" + config.title.dec() + "\" class=\"" + config.className + "\" ");
            } else {
                po.push("<input type=\"" + config.displayType + "\" name=\"" + config.name + "\" value=\"" + n.value.dec() + "\" class=\"" + config.className + "\" ");
            }

            if (selectValue != "" && selectValue == n.value.dec()) {
                po.push(" checked=\"checked\" ");
                robj.value = n.value.dec();
                robj.text = n.text.dec();
            }
            else if (selectValue == "" && config.firstChecked == true && index == 0) {
                po.push(" checked=\"checked\" ");
                robj.value = n.value.dec();
                robj.text = n.text.dec();
            }
            po.push("/>");

            po.push(n.text.dec() + "&nbsp;");
        });
        obj.tg.html(po.join(''));

        this.loadSucc(robj);

        jQuery("#" + config.target).find("input").unbind("click", this.onchange2.bind(this));
        jQuery("#" + config.target).find("input").bind("click", this.onchange2.bind(this));
    },
    loadSucc: function(obj) {
        var config = this.config;
        if (config.onLoad) {
            config.onLoad({
                target: config.target,
                value: obj.value,
                text: obj.text
            });
        }
    },
    onchange: function(event) {
        var tg = event.target;
        var config = this.config;
        if (config.onChange) {
            config.onChange({
                target: config.target,
                value: tg.options[tg.selectedIndex].value,
                text: tg.options[tg.selectedIndex].text
            });
        }
    },
    onchange2: function(event) {
        var tg = event.target;
        var config = this.config;

        var myText = "";
        jQuery.each(this.ids, function(idx, D) {
            if (D.value.dec() == tg.value) {
                myText = D.text.dec();
            }
        });

        if (config.onChange) {
            config.onChange({
                target: config.target,
                value: tg.value,
                text: myText
            });
        }
    }
});