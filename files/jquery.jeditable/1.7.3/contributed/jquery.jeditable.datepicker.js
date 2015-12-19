/*
    DatePicker plugin for Jeditable(http://www.appelsiini.net/projects/jeditable), 
    using datepicker plugin for jquery (http://www.eyecon.ro/datepicker/)
    Copyright (C) 2009 Enjalbert Vincent (WinWinWeb)

    Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	# The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
    
    vincent.enjalbert at gmail dot com (French, English)

 */


$.editable.addInputType('datepicker', {
    /* create input element */
    element : function(settings, original) {
        var input = $('<input style="display:none">');
        var picker = $('<div id="datepicker_">');
        
        $(this).append(input);
        $(this).append(picker);
        return(input);
    },
    
    
    submit: function (settings, original) {
    	 $("input", this).val( $("#datepicker_", this).DatePickerGetDate('d/m/Y') );
    },
    
    
    content : function(string, settings, original) {
        $('input', this).val('');
    },
    
    
    /* attach 3rd party plugin to input element */
    plugin : function(settings, original) {
        var form = this;
        settings.onblur = null;
        if(settings.datepicker == null)
        	$("#datepicker_", this).DatePicker({
					flat: true,
					date: '29/10/1985',
					format: 'd/m/Y',
					view: 'years',
					current: '29/10/1985',
					calendars: 1,
					starts: 1
				});
        else
        	$("#datepicker_", this).DatePicker(settings.datepicker);
    }
});