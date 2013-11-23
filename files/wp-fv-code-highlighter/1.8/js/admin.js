(function($)
{
    $(document).ready(function()
    {
        $.farbtastic('#fvch-colorpicker', function(color)
        {
            $('#fvch-background-custom').val( color );
            $('.fvch-background-example.fvch-custom').css('background-color', color);
        }).setColor( $('#fvch-background-custom').val() );

        $('.fvch-background-option.custom').click(function(e)
        {
            $('#fvch-colorpicker').show();
        });

        $(document).mousedown(function()
        {
            $('#fvch-colorpicker').hide();
        });
    });
})(jQuery);
