(function($) {
  $.fn.modallery = function( options ) {
    var current = 0;
    var i = 1;


    var modal = '<div class="modal fade" id="mdlyModal" tabindex="-1" role="dialog" aria-labelledby="mdlyLabel">' +
    '<div class="modal-dialog" id="mdlyDialog" role="document">' +
    '<div class="modal-content">' +
    '<div class="modal-header">' +
    '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
    '<span aria-hidden="true">&times;<span>' +
    '</button>' +
    '<h4 class="modal-title" id="mdlyLabel"></h4>' +
    '</div>' +
    '<div class="modal-body"><img id="modallery-img" class="img-responsive center-block" /><p class="text-center" id="modallery-caption"></p></div>' +
    '<div id="mdlyFooter"></div>' +
    '</div>' +
    '</div>' +
    '</div>';

    var params = $.extend({
      title: 'Image Gallery',
      caller: '.modallery',
      size: '',
      navigate: false,
      arrows: false,
      keypress: false,
    }, options);

    $("body").append(modal);

    if (params.size !== '') {
      console.log('modal_' + params.size);
      $("#mdlyDialog").addClass('modal-' + params.size);
    }

    if (params.navigate) {
      $("#mdlyFooter").addClass('panel-footer');
      $(params.caller).each(function(){
        var btn  = '<button class="btn btn-default navigator-btn" data-ref="' + $(this).data('to') +'" data-code='+i+'><img src="'+$(this).attr('src')+'" class="img-responsive" /></button>';
        $("#mdlyFooter").append(btn);
        i++;
      });

      if (params.arrows) {
        var html = $("#mdlyFooter").html();
        $("#mdlyFooter").html('<div class="row"><div class="col-md-2"><button class="btn btn-primary" id="previousMdly">«</button></div><div class="col-md-8">' + html  + '</div><div class="col-md-2"><button class="btn btn-primary" id="nextMdly">»</button></div></div>');
      }
    }


    $(params.caller).click(function(){
      $("#mdlyLabel").html(params.title);
      $("#modallery-img").attr('src',$(this).data('to'));
      if ($(this).data('caption')) {
        $("#modallery-caption").html($(this).data('caption'));
      } else {
        $("#modallery-caption").html("");
      }

      if (params.navigate) {
        $('.navigator-btn').removeClass('highlighted');
        $('.navigator-btn[data-ref="' + $(this).data("to") + '"]').addClass('highlighted');

        current = parseInt($('.navigator-btn[data-ref="' + $(this).data("to") + '"]').data('code'));
      }

      $("#mdlyModal").modal('show');
    });

    $(".navigator-btn").on('click',function(){
      var model = $('img[data-to="'+$(this).data("ref")+'"]');

      current = parseInt($(this).data('code'));

      $("#mdlyLabel").html(params.title);
      $("#modallery-img").attr('src',model.data('to'));
      if (model.data('caption')) {
        $("#modallery-caption").html(model.data('caption'));
      } else {
        $("#modallery-caption").html("");
      }

      $('.navigator-btn').removeClass('highlighted');
      $(this).addClass('highlighted');

    });

    var goBack = function() {
      if (current > 1) {
        current = current - 1;

        var target = $("button[data-code="+ current +"] > img").attr('src');
        var model = $(params.caller + '[src="'+target+'"]');

        $("#mdlyLabel").html(params.title);
        $("#modallery-img").attr('src',model.data('to'));
        if (model.data('caption')) {
          $("#modallery-caption").html(model.data('caption'));
        } else {
          $("#modallery-caption").html("");
        }

        $('.navigator-btn').removeClass('highlighted');
        $("button[data-code="+ current +"]").addClass('highlighted');
      }
    };

    var goNext = function() {
      if (current < i - 1) {
        current = current + 1;

        var target = $("button[data-code="+ current +"] > img").attr('src');
        var model = $(params.caller + '[src="'+target+'"]');

        $("#mdlyLabel").html(params.title);
        $("#modallery-img").attr('src',model.data('to'));
        if (model.data('caption')) {
          $("#modallery-caption").html(model.data('caption'));
        } else {
          $("#modallery-caption").html("");
        }

        $('.navigator-btn').removeClass('highlighted');
        $("button[data-code="+ current +"]").addClass('highlighted');
      }
    };

    $("#nextMdly").on('click', goNext);
    $("#previousMdly").on('click', goBack);

    if (params.keypress) {
      $(document).keydown(function(e) {
        if (e.which == 37) goBack();
        if (e.which == 39) goNext();
      });
    }

  }
}(jQuery));


