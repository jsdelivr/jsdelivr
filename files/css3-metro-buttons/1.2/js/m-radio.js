$(".toggle-buttons > .m-btn").click(function() {
    $(this).siblings(".m-btn").removeClass("active");
    $(this).addClass("active");
});
