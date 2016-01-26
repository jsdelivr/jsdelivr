/*
 * Timepicker for Jeditable
 *
 * Copyright (c) 2007-2009 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Depends on Timepicker jQuery plugin by Jason Huck:
 *   http://jquery.com/plugins/project/timepicker
 *
 * Project home:
 *   http://www.appelsiini.net/projects/jeditable
 *
 * Revision: $Id$
 *
 */
var timepickerFormId = 0
$.editable.addInputType('timepicker', {
    /* This uses default hidden input field. No need for element() function. */

    /* Call before submit hook. */
    submit: function (settings, original) {
        /* Collect hour, minute and am/pm from pulldowns. Create a string from */
        /* them. Set value of hidden input field to this string.               */
        var value = $('#h_').val() + ':' + $('#m_').val() + "" + $('#p_').val();
        $('input', this).val(value);
    },
    /* Attach Timepicker plugin to the default hidden input element. */
    plugin:  function(settings, original) {
        $('input', this).filter(':hidden')
          .attr("id", "jquery_timepicker_"+(++timepickerFormId))
          .filter(':hidden').timepicker();
    }
});