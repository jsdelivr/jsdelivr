/**
 * @brief 화면내에서 상위 영역보다 이미지가 크면 리사이즈를 하고 클릭시 원본을 보여줄수 있도록 변경
 **/
(function($){

var xScreen = null;

// 슬라이드를 위한 블랙 스크린을 만들거나 반환하는 함수
function getScreen() {
	var body    = $(document.body);
	var controls, imgframe, closebtn, prevbtn, nextbtn;
	// 스크린이 없으면 스크린을 만든다.
	if (!xScreen) {
		// 검은 스크린
		xScreen = $("<div>")
			.attr("id","xe_gallery_screen")
			.css({
				position:"fixed",
				display:"none",
				backgroundColor:"black",
				zIndex:500,
				opacity:0.7
			});

		// 이미지를 보여주고 컨트롤 버튼을 다룰 레이어
		controls = $("<div>")
			.attr("id","xe_gallery_controls")
			.css({
				position:"fixed",
				display:"none",
				overflow:"hidden",
				zIndex:510
			});

		// 이전 버튼
		prevbtn = $('<button type="button" id="xe_gallery_prevbtn" />')
			.css({
				left: "10px",
				backgroundPosition: "0 -64px"
			})
			.click(function(){xScreen.xePrev()})
			.appendTo(controls);

		// 닫기 버튼
		closebtn = $('<button type="button" id="xe_gallery_closebtn" />')
			.css({
				top: "10px",
				backgroundPosition: "0 0"
			})
			.click(function(){xScreen.xeHide()})
			.appendTo(controls);

		// 다음 버튼
		nextbtn = $('<button type="button" id="xe_gallery_nextbtn" />')
			.attr("id", "xe_gallery_nextbtn")
			.css({
				right: "10px",
				backgroundPosition: "0 -128px"
			})
			.click(function(){xScreen.xeNext()})
			.appendTo(controls);

		// 버튼 공통 속성
		controls.find(">button")
			.css({
				position : "absolute",
				width : "64px",
				height : "64px",
				zIndex : 530,
				cursor : "pointer",
				border : 0,
				margin : 0,
				padding : 0,
				backgroundColor: "transparent",
				backgroundImage: "url(" + request_uri + "addons/resize_image/btn.png)",
				backgroundRepeat: "no-repeat",
				opacity: ".5",
				filter: "alpha(opacity=50)"
			})
			.mouseover(function(){
				$(this).css({
					opacity: "1",
					filter: "alpha(opacity=100)"
				});
			})
			.mouseout(function(){
				$(this).css({
					opacity: ".5",
					filter: "alpha(opacity=50)"
				});
			})
			.focus(function(){
				$(this).trigger('mouseover');
			})
			.blur(function(){
				$(this).trigger('mouseout');
			})
			;

		// 이미지 홀더
		imgframe = $("<img>")
			.attr("id", "xe_gallery_holder")
			.css({
				border: '5px solid white',
				zindex: 520,
				maxWidth: 'none',
				borderRadius: '5px',
				boxShadow: '0 0 10px #000'
			})
			.appendTo(controls).draggable();

		body.append(xScreen).append(controls);

		// xScreen 객체를 확장한다.
		xScreen.xeShow = function() {
			var clientWidth  = $(window).width();
			var clientHeight = $(window).height();
			$("#xe_gallery_controls,#xe_gallery_screen").show().css({
				top		: 0,
				right   : 0,
				bottom	: 0,
				left	: 0
			});
			$("#xe_gallery_prevbtn,#xe_gallery_nextbtn").css("top", Math.round(clientHeight/2 - 32) + "px");
			this.xeMove(0);
		};
		xScreen.xeHide = function(event) {
			xScreen.hide();
			controls.hide();
		};
		xScreen.xePrev = function() {
			this.xeMove(-1);
		};
		xScreen.xeNext = function() {
			this.xeMove(1);
		};
		xScreen.xeMove = function(val) {
			var clientWidth  = $(window).width();
			var clientHeight = $(window).height();
			this.index += val;
			prevbtn.css("visibility", (this.index>0)?"visible":"hidden");
			nextbtn.css("visibility", (this.index<this.list.size()-1)?"visible":"hidden");
            //textyle 이미지 리사이즈 처리
            var src = this.list.eq(this.index).attr("rawsrc");
            if(!src) src = this.list.eq(this.index).attr("src");
			imgframe.attr("src", src).css({
				left : clientWidth/2 - imgframe.width()/2 + "px",
				top  : clientHeight/2 - imgframe.height()/2 + "px"
			});
			closebtn.css({
				left : clientWidth/2 - 32 + "px",
				top  : "10px"
			}).focus();
		};

		// 스크린을 닫는 상황
		$(document).keydown(function(e){
			if(e.which == 27){
				xScreen.xeHide();
				return false;
			} else {
				return true;
			}
		});
	} else {
		controls = $("#xe_gallery_controls");
		imgframe = $("#xe_gallery_holder");
		closebtn = $("#xe_gallery_closebtn");
		prevbtn  = $("#xe_gallery_prevbtn");
		nextbtn  = $("#xe_gallery_nextbtn");
	}
	return xScreen;
}

// 이미지 슬라이드를 보는 함수
function slideshow(event) {
	var container  = $(this).closest('.xe_content');
	var imglist    = container.find("img[rel=xe_gallery]");
	var currentIdx = $.inArray($(this).get(0), imglist.get());
	var xScreen    = getScreen();

	// 스크린을 보여주고
	xScreen.list  = imglist;
	xScreen.index = currentIdx;
	xScreen.xeShow();
}

/* Window Load */
$(window).load(function(){
	var regx_skip = /(?:(modules|addons|classes|common|layouts|libs|widgets|widgetstyles)\/)/i;
	var regx_allow_i6pngfix = /(?:common\/tpl\/images\/blank\.gif$)/i;
	/**
	 * 본문 폭 구하기 위한 개체
	 * IE6에서 본문폭을 넘는 이미지가 있으면 그 크기로 구해지는 문제 우회용
	 **/
	var dummy = $('<div style="height:1px;overflow:hidden;opacity:0;display:block;clear:both"></div>');

	/**
	 * 리사이즈 실행 함수
	 **/
	function doResize(contentWidth, count) {
		// 재시도 회수 제한
		if(!count) count = 0;
		if(count >= 10) return;

		var $img = this;
		var beforSize = {'width':$img.width(), 'height':$img.height()};

		// 이미지 사이즈를 구하지 못했을 때 재시도
		if(!beforSize.width || !beforSize.height) {
			setTimeout(function() {
				doResize.call($img, contentWidth, ++count)
			}, 200);
			return;
		}

		// 리사이즈 필요 없으면 리턴
		if(beforSize.width <= contentWidth) return;

		var resize_ratio = contentWidth / beforSize.width;

		$img
			.removeAttr('width').removeAttr('height')
			.css({
				'width':contentWidth,
				'height':parseInt(beforSize.height * resize_ratio, 10)
			});
	}

	$('.xe_content').each(function() {
		var contentWidth = dummy.appendTo(this).width();
		dummy.remove();
		if(!contentWidth) return;

		$('img', this).each(function() {
			var $img = $(this);
			var imgSrc = $img.attr('src');
			if(regx_skip.test(imgSrc) && !regx_allow_i6pngfix.test(imgSrc)) return;
			$img.attr('rel', 'xe_gallery');
			doResize.call($img, contentWidth);
		});

		/* live 이벤트로 적용 (image_gallery 컴포넌트와의 호환 위함) */
		$('img[rel=xe_gallery]', this).live('mouseover', function() {
			var $img = $(this);
			if(!$img.parent('a').length && !$img.attr('onclick')) {
				$img.css('cursor', 'pointer').click(slideshow);
			}
		});
	});
});

})(jQuery);
