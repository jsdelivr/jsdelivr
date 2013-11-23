(function() {
  var limitPaginationItems;

  $(function() {
    var $body;
    limitPaginationItems();
    $body = $('body');
    $body.on('click', '.pagination ul > li:not(.next, .prev) a', function(e) {
      var $next, $prev, $this;
      $this = $(this);
      $('.pagination ul > li:not(.next, .prev)').removeClass('active');
      $this.parent('li').addClass('active');
      $prev = $('.pagination ul > li.prev');
      if ($this.parent('li').hasClass('first')) {
        $prev.addClass('disabled');
      } else {
        $prev.removeClass('disabled');
      }
      $next = $('.pagination ul > li.next');
      if ($this.parent('li').hasClass('last')) {
        $next.addClass('disabled');
      } else {
        $next.removeClass('disabled');
      }
      limitPaginationItems();
      e.preventDefault();
      return false;
    });
    $body.on('click', '.pagination ul > li.prev:not(.disabled)', function(e) {
      var el;
      $('.pagination ul > li.next').removeClass('disabled');
      el = $('.pagination ul > li.active');
      if (!el.hasClass('first')) {
        el.removeClass('active');
        el.prev().addClass('active');
        limitPaginationItems();
      }
      if ($('.pagination ul > li.active').hasClass('first')) {
        $(this).addClass('disabled');
      }
      e.preventDefault();
      return false;
    });
    $body.on('click', '.pagination ul > li.next:not(.disabled)', function(e) {
      var el;
      $('.pagination ul > li.prev').removeClass('disabled');
      el = $('.pagination ul > li.active');
      if (!el.hasClass('last')) {
        el.removeClass('active');
        el.next().addClass('active');
        limitPaginationItems();
      }
      if ($('.pagination ul > li.active').hasClass('last')) {
        $(this).addClass('disabled');
      }
      e.preventDefault();
      return false;
    });
    $body.on('click', '.pagination ul > li.disabled a', function(e) {
      e.preventDefault();
      return false;
    });
  });

  $(window).resize(function() {
    return limitPaginationItems();
  });

  limitPaginationItems = function() {
    $('.pagination ul').each(function() {
      var pagination, totalItemsWidth, visibleItemsWidth, visibleSpace, _results;
      pagination = $(this);
      visibleSpace = pagination.outerWidth() - pagination.children('li.prev').outerWidth() - pagination.children('li.next').outerWidth();
      totalItemsWidth = 0;
      pagination.children('li').each(function() {
        totalItemsWidth += $(this).outerWidth();
      });
      pagination.children('li').not('.prev, .next, .active').hide();
      visibleItemsWidth = 0;
      pagination.children('li:visible').each(function() {
        visibleItemsWidth += $(this).outerWidth();
      });
      _results = [];
      while ((visibleItemsWidth + 29) < visibleSpace && (visibleItemsWidth + 29) < totalItemsWidth) {
        pagination.children('li:visible').not('.next').last().next().show();
        visibleItemsWidth = 0;
        pagination.children('li:visible').each(function() {
          visibleItemsWidth += $(this).outerWidth();
        });
        if ((visibleItemsWidth + 29) <= visibleSpace) {
          pagination.children('li:visible').not('.prev').first().prev().show();
          visibleItemsWidth = 0;
          pagination.children('li:visible').each(function() {
            visibleItemsWidth += $(this).outerWidth();
          });
        }
        visibleItemsWidth = 0;
        _results.push(pagination.children('li:visible').each(function() {
          visibleItemsWidth += $(this).outerWidth();
        }));
      }
      return _results;
    });
  };

}).call(this);
