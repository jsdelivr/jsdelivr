//console.log('strx-floating-sidebar/js/main.js loaded ok');
strx = {};
if (typeof console === 'undefined') {
  console = {
    log: function () {},
    dir: function () {}
  };
}

(function () {
  strx.start = function (opts) {
    jQuery(function () {
      opts = jQuery.extend({}, {
        content: '#content',
        sidebar: '#sidebar',
        wait: 3000,
        debounce: 500,
        animate: 3000,
        offsetTop: 0,
        offsetBottom: 0,
        debug: 0,
        outline: 0,
        findids: 0,
        minHDiff:0
      }, opts);

      setTimeout(function(){

	      var $w = jQuery(window),
	        $c = jQuery(opts.content),
	        $ss = jQuery(opts.sidebar),
	        $b = jQuery('body');

	      if (opts.outline) {
	        $ss.add($c).css('outline', '3px dashed  red');
	      }

	      if (opts.findids) {
	        strx.findids();
	      }

	      console.dir(opts);

	      if ($c.length && $ss.length) {
	        $ss.each(function () {
	          (function ($s) {
	          	// console.log($c.height() - $s.height());
	            if ( $c.height() - $s.height() > opts.minHDiff || opts.dynamicTop) {
                $s.parent().css('position', 'relative');
                var initialSPos=$s.position(),
                		initialSOff=$s.offset();

                //Recupero Top e Left iniziali di tutte le sidebar prima di iniziare il posizionamento
                setTimeout(function(){
	                $s.css({
	                  position: 'absolute',
	                  left: initialSPos.left + 'px',
	                  top:  initialSPos.top  + 'px'
	                }).find('.widget').css('position', 'relative');

	                var lastScrollY = -1,
	                  sidebarTop = initialSPos.top,
	                  offsetTop = initialSOff.top - sidebarTop,
	                  maxTop = sidebarTop + $c.height() - $s.outerHeight(),
	                  onScroll = function (e) {
	                    var scrollY = $w.scrollTop(),
	                      t, scrollingDown = scrollY > lastScrollY;

	                    if ((scrollingDown && scrollY > sidebarTop + offsetTop && scrollY + $w.height() > $s.position().top + $s.height() + offsetTop - sidebarTop) || (!scrollingDown && scrollY < $s.position().top + offsetTop)) {
	                      if (e.type === 'scroll' && ($w.height() > $s.height() || !scrollingDown)) {
	                        //Scorrimento verso l'alto
	                        t = Math.max(sidebarTop, scrollY - (offsetTop) + (~~opts.offsetTop));
	                      } else {
	                        //Scorrimento verso il basso o resize
	                        t = Math.max(sidebarTop, scrollY + $w.height() - $s.outerHeight() - offsetTop - (~~opts.offsetBottom));
	                      }

	                      t = Math.min(t, opts.dynamicTop ? (sidebarTop + $c.height() - $s.outerHeight()) : maxTop);
	                      $s.stop().animate({
	                        top: t + 'px'
	                      }, ~~opts.animate);

	                      if (opts.debug) {
	                        window.scrollY = scrollY;
	                        console.log('top=' + t + ', scrollY=' + scrollY);
	                      }
	                    }
	                    lastScrollY = scrollY;
	                  };
	                if (opts.debug) {
	                  window.$w = $w;
	                  window.$c = $c;
	                  window.$s = $s;
	                  window.$b = $b;
	                  window.offsetTop = offsetTop;
	                  window.sidebarTop = sidebarTop;
	                  window.maxTop = maxTop;
	                  console.log('windowHeight=' + $w.height() + ', sidebarOuterHeight=' + $s.outerHeight() + ', sidebarTop=' + sidebarTop + ', offsetTop=' + offsetTop + ', maxTop=' + maxTop);
	                }

	                if (opts.debounce && Function.prototype.debounce) {
	                  onScroll = onScroll.debounce(opts.debounce);
	                }

	                $w.scroll(onScroll).resize(onScroll);
	                onScroll({
	                  type: 'scroll'
	                });

	                $w.scroll(function(){
	                	$s.stop();
	                });
                },0);

	            }
	          })(jQuery(this));
	        });

	      } else {
	        if ($c.length === 0) {
	          console.log(opts.content + ' not found');
	        }
	        if ($ss.length === 0) {
	          console.log(opts.sidebar + ' not found');
	        }
	      }

    	}, opts.wait);

    });
  };
  //Help user find the correct content and sidebar divs
  strx.findids = function () {
    var divs = jQuery('div[id]').get();
    divs = jQuery.map(divs, function (d) {
      return '<span class="strx-mfsm-findids" style="cursor:pointer; font-weight:bold;">' + d.id + '</span>';
    });
    var $divs = jQuery('<span>' + divs.join('&nbsp;&nbsp;') + '</span>').appendTo('body').click(function (e) {
      var $t = jQuery('#' + jQuery(e.target).html());
      //console.log($t.html());
      var origbg = $t.css('background-color');
      $t.css({
        backgroundColor: 'red'
      });
      setTimeout(function () {
        $t.css({
          backgroundColor: 'green'
        });
      }, 3000);
      setTimeout(function () {
        $t.css({
          backgroundColor: 'blue'
        });
      }, 6000);
      setTimeout(function () {
        $t.css({
          backgroundColor: origbg
        });
      }, 9000);

      alert('If the main content background color change, write \n#' + jQuery(e.target).html() + '\n in the Content Selector field' + '\n\n' + 'If the sidebar background color change, write \n#' + jQuery(e.target).html() + '\n in the Sidebar Selector field');

    });
  };
})();