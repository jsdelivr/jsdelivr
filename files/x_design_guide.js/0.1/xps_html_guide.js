
function GuidHtml() {};

GuidHtml.prototype.layerMap = [];
GuidHtml.prototype.scaleFactor = 1.0;

GuidHtml.prototype.hideGuideRuler = function() {
	$("p.guide").removeClass("active");
	$("div.mask").css("display", "none");
	$(".ruler").css("display", "none");
};

GuidHtml.prototype.getObjectByName = function(name) {
	var obj = document.getElementsByName(name);
	if(obj != undefined) {
		return $(obj);
	}

	return undefined;
};

GuidHtml.prototype.getLayerByName = function(name) {
	return this.layerMap[name];
};

GuidHtml.prototype.getLayerByElement = function(element) {
	var name = element.attr("name");
	return this.layerMap[name];
};

GuidHtml.prototype.selectLayer = function(layerObj) {
	var name = layerObj.attr("name");

	if(this.layerMap[name] != undefined) {
		this.selectedLayer = layerObj;

		var rulers = this.makeRuler(this.layerMap[name], layerObj);
		var pos = layerObj.offset();

		var centerLeft = pos.left + (layerObj.width() / 2);
		var centerTop = pos.top + (layerObj.height() / 2);

		for (var i = rulers.length - 1; i >= 0; i--) {
			var rulr = rulers[i];
			var obj = $(".ruler." + rulr.type);
				obj.attr("rule_type", rulr.type);

			if(rulr.distance > 0) { // 0 이면 필요 없음

				obj.css("display", "block");

				obj.children().text(this.calc(rulr.distance) + "px");

				var size = rulr.last - rulr.first;

				if(rulr.type == 'left' || rulr.type == 'right') {
					obj.width(size);
					obj.offset({ top: centerTop, left: rulr.first });
				}
				else {
					obj.height(size);
					obj.offset({ top: rulr.first , left: centerLeft });
				}

				obj.attr("screen", this.currentScreenSize);
				obj.attr("size", size);
			}
			else {
				obj.css("display", "none");
			}
		};
		
		$("div.mask").css("display", "block");

		if(this.onSelectLayer != undefined) {
			this.onSelectLayer(layerObj);
		}
	}

	$("p.guide").removeClass("active");
	layerObj.addClass("active");
};

GuidHtml.prototype.findAndSelectLayer = function(name) {
	$('div.layer_box ul li p').removeClass('select');

	var obj = $("div.layer_box ul [name='" + name + "'] p");
	obj.addClass('select');

	(function() {
		var _runction = function(parent) {
			if(parent != undefined && parent.length > 0 && !parent.is("body")) {
				if(parent.is("li")) {
					var v = parent.children("p").children("button");
					if(!v.hasClass("active")) {
						v.addClass("active").parent().toggleClass('active').next('div').stop().slideToggle(200);
						_runction(parent.parent());
					}
				}
				else {
					_runction(parent.parent());
				}
			}
		};

		_runction(obj.parent());
	})();
};

GuidHtml.prototype.guideLayerClick = function(e) {
	e.preventDefault();

	return false;
};

GuidHtml.prototype.resizeScreen = function(w, h) {
	if(this.currentScreenSize != w) {
		this.scaleFactor = w / layers.screen.width;
		var self = this;

		$(".guide").each(function(index){
			var obj = $(this);

			var layer = self.getLayerByElement(obj);

			if(layer != undefined) {
				var width = layer.width * self.scaleFactor;
				var height = layer.height * self.scaleFactor;

				obj.width(width);
				obj.height(height);

				var left = layer.x * self.scaleFactor;
				var top = layer.y * self.scaleFactor;

				obj.css("left", left);
				obj.css("top", top);

				var screenOffSet = $(".screen").offset();

				left += screenOffSet.left;
				top += screenOffSet.top;

				if(self.selectedLayer != undefined) {
					if(self.selectedLayer.attr("id") == obj.attr("id")) {
			
						$(".ruler:visible").each(function(index) {

							var centerLeft = left + (width / 2);
							var centerTop = top + (height / 2);

							var ruleObj = $(this);

							var ruleScale = w / ruleObj.attr("screen");
							var size = ruleObj.attr("size") * ruleScale;
							var rule_type = ruleObj.attr("rule_type");

							var offset = ruleObj.offset();

							if(rule_type == 'left' || rule_type == 'right') {
								ruleObj.width(size);

								if(rule_type == 'left') {
									var right = offset.left + size;
									offset.left -= (right - left);
								}
								else {
									offset.left = left + width;
								}

								ruleObj.offset({ top: centerTop, left: offset.left });
							}
							else {
								ruleObj.height(size);

								if(rule_type == 'top') {
									var bottom = offset.top + size;
									offset.top -= (bottom - top);
								}
								else {
									offset.top = top + height;
								}

								ruleObj.offset({ top: offset.top , left: centerLeft });
							}
						});

					}
				}
			}
		});

		this.currentScreenSize = w;
	}
};

GuidHtml.prototype.makeLayerLiObject = function(layer, padding) {
	var obj = document.createElement('li');
	var pObj = document.createElement('p');
	$(pObj).css('padding-left', padding);
	var txt = document.createTextNode(layer.label);

	pObj.appendChild(txt);
	pObj.name = layer.name;

	obj.appendChild(pObj);

	return $(obj);
};

GuidHtml.prototype.makeLayerULObject = function() {
	var ul = document.createElement('ul');
	return $(ul);
};

GuidHtml.prototype.makeLayerUI = function(parentDiv, parentUL, layers, parentLayer, zOrder, padding) {
	var ulObj = this.makeLayerULObject();
	
	if(padding == undefined) {
		padding = 23;
	}

	parentUL.prepend(ulObj);

	for (var i = layers.length - 1; i >= 0; i--) {
		var layer = layers[i];

		layer.label = layer.name;
		layer.name = parentLayer.name + "_" + layer.name;

		var liObj = this.makeLayerLiObject(layer, padding);
		ulObj.prepend(liObj);

		liObj.attr("name", layer.name);
		//liObj.css("padding-left", padding);

		var obj = $("#guide").clone();

		obj.click(this.guideLayerClick);

		obj.attr("id", layer.name + "_guide_" + i);
		obj.attr("name", layer.name);

		layer.parent = parentLayer;

		this.layerMap[layer.name] = layer;

		obj.width(layer.width * this.scaleFactor);
		obj.height(layer.height * this.scaleFactor).css({
		    position: "absolute"
		});

		obj.offset({ top: layer.y * this.scaleFactor, left: layer.x * this.scaleFactor });
		obj.css('z-index', zOrder);

		$("#screen").append(obj);

		if(layer.layers != undefined) {
			if(layer.layers.length > 0) {
				var liDivObj = $(document.createElement('div'));
				liObj.append(liDivObj);

				this.makeLayerUI(obj, liDivObj, layer.layers, layer, zOrder, padding + 20);
			}
		}

		zOrder ++;
	}
};

GuidHtml.prototype.makeRuler = function(targetLayer, selObj) {
	var detectRulers = this.detect(targetLayer, targetLayer.parent.layers);

	var isParent = false;

	if(detectRulers[0].obj == undefined) { // left not found
		detectRulers[0].distance = targetLayer.x - targetLayer.parent.x;
		detectRulers[0].obj = targetLayer.parent;

		isParent = true;
	}

	var leftObj = this.getObjectByName(detectRulers[0].obj.name);

	if(isParent)
		detectRulers[0].first = leftObj.offset().left;
	else
		detectRulers[0].first = leftObj.offset().left + leftObj.width();

	detectRulers[0].last = selObj.offset().left;

	isParent = false;
	
	if(detectRulers[1].obj == undefined) { // top not found
		detectRulers[1].distance = targetLayer.y - targetLayer.parent.y;
		detectRulers[1].obj = targetLayer.parent;

		isParent = true;
	}

	var topObj = this.getObjectByName(detectRulers[1].obj.name);

	if(isParent)
		detectRulers[1].first = topObj.offset().top;
	else
		detectRulers[1].first = topObj.offset().top + topObj.height();
	detectRulers[1].last = selObj.offset().top;

	isParent = false;

	if(detectRulers[2].obj == undefined) { // right not found
		var targetRight = (targetLayer.x + targetLayer.width);
		var parentRight = (targetLayer.parent.x + targetLayer.parent.width);

		detectRulers[2].distance =  parentRight - targetRight;
		detectRulers[2].obj = targetLayer.parent;

		isParent = true;
	}			

	var rightObj = this.getObjectByName(detectRulers[2].obj.name);

	detectRulers[2].first = selObj.offset().left + selObj.width();

	if(isParent)
		detectRulers[2].last = rightObj.offset().left + rightObj.width();
	else
		detectRulers[2].last = rightObj.offset().left;

	isParent = false;

	if(detectRulers[3].obj == undefined) { // bottom not found
		var targetBottom = (targetLayer.y + targetLayer.height);
		var parentBottom = (targetLayer.parent.y + targetLayer.parent.height);

		detectRulers[3].distance =  parentBottom - targetBottom;
		detectRulers[3].obj = targetLayer.parent;

		isParent = true;
	}

	var bottomObj = this.getObjectByName(detectRulers[3].obj.name);

	detectRulers[3].first = selObj.offset().top + selObj.height();

	if(isParent)
		detectRulers[3].last = bottomObj.offset().top + bottomObj.height();
	else
		detectRulers[3].last = bottomObj.offset().top;

	return detectRulers;
};

GuidHtml.prototype.rulerObj = function(type) {
	return {
		type : type,
		distance : 9999999,
		obj : undefined
	};
};

GuidHtml.prototype.detect = function(target, layers) {
	var left = this.rulerObj('left');
	var top = this.rulerObj('top');
	var right = this.rulerObj('right');
	var bottom = this.rulerObj('bottom');

	for (var i = layers.length - 1; i >= 0; i--) {

		if(target != layers[i]) {

			var bt = (layers[i].y + layers[i].height);

			if(target.y > bt) {
				var d = (target.y - bt);
				if(top.distance > d) {
					top.distance = d;	
					top.obj = layers[i];
				}
			}

			var rt = (layers[i].x + layers[i].width);

			if(target.x > rt) {
				var d = (target.x - rt);
				if(left.distance > d) {
					left.distance = d;	
					left.obj = layers[i];
				}
			}

			var targetBottom = (target.y + target.height);

			if(layers[i].y > targetBottom) {
				var d = (layers[i].y - targetBottom);
				if(bottom.distance > d) {
					bottom.distance = d;	
					bottom.obj = layers[i];
				}
			}

			var targetRight = (target.x + target.width);

			if(layers[i].x > targetRight) {
				var d = (layers[i].x - targetRight);
				if(right.distance > d) {
					right.distance = d;	
					right.obj = layers[i];
				}
			}
		}
	}

	return [left, top, right, bottom];
};

GuidHtml.prototype.init = function(w, h) {
	if(layers != undefined) {
		// Screen 
		$("#screen").attr("name", "screen");

		layers.x = layers.screen.x;
		layers.y = layers.screen.y;
		layers.width = layers.screen.width;
		layers.height = layers.screen.height;
		layers.name = "screen";

		this.scaleFactor = w / layers.screen.width;
		this.makeLayerUI($("#screen"), $(".layer_box"), layers.layers, layers, 10);

		$("#guide").hide();

		this.currentScreenSize = w;
	}
};

GuidHtml.prototype.calc = function(pixel) {
	if(layers != undefined) {
		var calcPixel = 0;
		
		var platform = layers.document.platform;
		var scale = layers.document.scale;
		
		if(platform == 'ios')
		{
			calcPixel = pixel / scale;
			if(calcPixel.toString().indexOf('.') != -1)
		    {
			    alert('IOS 디바이스는 소수점이 되면 안됩니다.');
			    return 0;
		    }
		}
		else if(platform == 'android')
		{
			var screenSize = layers.document.screen_size;
			if(screenSize.toUpperCase() == 'HDPI')
			{
				calcPixel = Math.floor( (pixel * (160 / 240) * 100) ) / 100;
			}
			else if(screenSize.toUpperCase() == 'XHDPI')
			{
				calcPixel = Math.floor( (pixel * (160 / 320) * 100) ) / 100;
			}
			else if(screenSize.toUpperCase() == 'XXHDPI')
			{
				calcPixel = Math.floor( (pixel * (160 / 480) * 100) ) / 100;
			}
			else if(screenSize.toUpperCase() == 'XXXHDPI')
			{
				calcPixel = Math.floor( (pixel * (160 / 640) * 100) ) / 100;
			}
		}
		else //freeform
		{
			calcPixel = pixel / scale;
		}
		
		return calcPixel;
	}
};