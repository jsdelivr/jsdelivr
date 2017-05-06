//----------------------------------------------------
// App - Concatenating
//----------------------------------------------------

//@prepros-append _toggle.js
//@prepros-append _smooth-scroll.js
//@prepros-append _highlight.js

//----------------------------------------------------
// App - Not use
//----------------------------------------------------

//----------------------------------------------------
// Toggle
//----------------------------------------------------

$(function(){
  if ($('.btn.is-demo-code').length) {
    $('.btn.is-demo-code').on('click', function(){
      $(this).toggleClass('is-active');
    });
  }
});

$(function(){
  if ($('.tabs').length) {
    $('.tabs.is-main .tab').on('click', function(){
      if ($(this).not('is-active')) {
        $(this).addClass('is-active').siblings('.tab').removeClass('is-active');
        const index = $('.tabs.is-main .tab').index(this);
        $('.main .section.is-main').eq(index).addClass('is-active').siblings('.section.is-main').removeClass('is-active');
      }
      if($('.tab.is-home').not('is-active')){
        $('.section.is-topcover').removeClass('is-active');
      }
      if($('.tab.is-home').hasClass('is-active')){
        $('.section.is-topcover').addClass('is-active');
      }
    });
  }
});

$(function(){
  if ($('.group.is-documentation-nav').length) {
    $('.group.is-documentation-nav .text.is-link-reverse').on('click', function(){
      if ($(this).not('is-active')) {
        $('.group.is-documentation-nav .text.is-link-reverse').removeClass('is-active');
        $(this).addClass('is-active');
        const index = $('.group.is-documentation-nav .text.is-link-reverse').index(this);
        $('.groups.is-documentation-contents .content').eq(index).addClass('is-active').siblings('.content').removeClass('is-active');
      }
    });
  }
});
//----------------------------------------------------
// Smooth scroll
//----------------------------------------------------

$(function(){
  $('a[href^="#"]').on('click', function(){
    const speed = 400;
    const href= $(this).attr('href');
    const target = $(href == '#' || href == '' ? 'html' : href);
    const position = target.offset().top;
    $('body,html').animate({scrollTop:position}, speed, 'swing');
    return false;
  });
});
//----------------------------------------------------
// Highlight
//----------------------------------------------------

hljs.initHighlightingOnLoad();
