/*
 * Requires jquery.magnific-popup.js
*/


(function() {
  $(function() {
    $(".modal.image,      .modal[href*='.jpg'],      .modal[href*='.jpeg'],      .modal[href*='.gif'],      .modal[href*='.png']").magnificPopup({
      type: 'image'
    });
    $(".modal.gallery").magnificPopup({
      delegate: 'a',
      type: 'image',
      image: {
        titleSrc: 'title'
      },
      gallery: {
        enabled: true
      }
    });
    $(".modal[href^='#']").magnificPopup({
      type: 'inline',
      mainClass: 'inline-modal'
    });
    $("a.modal[href^='http']").not(".image").not("[href*='.jpg']").not("[href*='.jpeg']").not("[href*='.gif']").not("[href*='.png']").magnificPopup({
      type: 'iframe',
      height: '100%'
    });
    $("a.video.modal[href^='http']").magnificPopup({
      type: 'iframe'
    });
    return $("a.modal[href]").not("[href^='#']").not(".image").not("[href^='http']").not("[href*='.jpg']").not("[href*='.jpeg']").not("[href*='.gif']").not("[href*='.png']").magnificPopup({
      type: 'ajax'
    });
  });

}).call(this);
