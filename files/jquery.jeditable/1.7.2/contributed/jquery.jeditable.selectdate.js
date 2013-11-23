/* v1 - December 4, 2008
 * SELECTDATE (Dropdown date picker for Jeditable)
 * by Ethan Piliavin with code from martinp
 *
 * Idea and original code from:
 * http://groups.google.com/group/jquery-en/browse_thread/thread/f4ac0893083fda8/181bb9a3ba2ff226
 */
 
$.editable.addInputType('selectdate', {

    element : function(settings, original) {
    
        /* Create and pulldowns for hours and minutes. Append them to */
        /* form which is accessible as variable this.                 */  
        
        var yearselect  = $('<select id="year_">');      
        var monthselect = $('<select id="month_">');
        var dayselect  = $('<select id="day_">');
        
      //Setup the Year selection

          //Set default minyear and maxyear
          
              var d = new Date();
              var maxyear = d.getFullYear();
              var minyear = d.getFullYear() - 10;
          
                
          //Do we have settings?
          if (typeof(settings.selectdate) != 'undefined')
          {
              //Check if user passed a minyear or maxyear value in settings, if so, use it.
							if (typeof(settings.selectdate.maxyear) == 'number')
							{
									var maxyear = settings.selectdate.maxyear;
							}

							if (typeof(settings.selectdate.minyear) == 'number')
							{
									var minyear = settings.selectdate.minyear;
							}
					}
					         
    //Generate the Year Selection

          for(var year = maxyear; year >= minyear; year--) 
          { 
                  var option = $('<option>').val(year).append(year); 
                  yearselect.append(option); 
          } 
          
          
     //Generate the Month selection      
          
            for(var month=1; month <= 12; month++) 
          { 
                  var monthname = []; 
                  monthname[1] = "January"; 
                  monthname[2] = "February"; 
                  monthname[3] = "March"; 
                  monthname[4] = "April"; 
                  monthname[5] = "May"; 
                  monthname[6] = "June"; 
                  monthname[7] = "July"; 
                  monthname[8] = "August"; 
                  monthname[9] = "September"; 
                  monthname[10] = "October"; 
                  monthname[11] = "November"; 
                  monthname[12] = "December"; 
                  if(month < 10) { 
                          monthnum = '0' + month; 
                  } else { 
                          monthnum = month; 
                  } 
                  var option = $('<option>').val(monthnum).append(monthname[month]); 
                  monthselect.append(option); 
          } 

    //Generate the Day selection   
 
          for(var day=1; day <=31; day++) 
          { 
                  if(day < 10) { 
                          day = '0' + day; 
                  } 
                  var option = $('<option>').val(day).append(day); 
                  dayselect.append(option); 
          } 
      
          //Do we have settings?
          if (typeof(settings.selectdate) != 'undefined')
          { 
              //Detect the specified order for the output string 
							if ((typeof(settings.selectdate.displayorder) != 'undefined') && (settings.selectdate.displayorder.length == 3))
							{
									switch (settings.selectdate.displayorder[0].toLowerCase())
									{
										case 'y':
											 $(this).append(yearselect);
										break; 

										case 'm':
											 $(this).append(monthselect);    
										break; 
									 
										case 'd':
                       $(this).append(dayselect); 
										break;	 
									}

									switch (settings.selectdate.displayorder[1].toLowerCase())
									{
										case 'y':
											 $(this).append(yearselect);
										break; 

										case 'm':
											 $(this).append(monthselect);    
										break; 
									 
										case 'd':
                       $(this).append(dayselect); 
										break;	 
									}

									switch (settings.selectdate.displayorder[2].toLowerCase())
									{
										case 'y':
											 $(this).append(yearselect);
										break; 

										case 'm':
											 $(this).append(monthselect);    
										break; 
									 
										case 'd':
                       $(this).append(dayselect); 
										break;	 
									}
							}
							else  //There was no setting, so use default dmy
							{ 
								 $(this).append(dayselect); 
								 $(this).append(monthselect);  
								 $(this).append(yearselect);
							}
		
					}
					else  //There are no settings at all, so use default dmy
					{ 
						 $(this).append(dayselect); 
						 $(this).append(monthselect);  
						 $(this).append(yearselect);
					}                
                 
                
        /* Last create an hidden input. This is returned to plugin. It will */
        /* later hold the actual value which will be submitted to server.   */
        var hidden = $('<input type="hidden">');
        $(this).append(hidden);
        return(hidden);
    },
    /* Set content / value of previously created input element. */
    content : function(datestring, settings, original) {
    

        /* Select correct Year, Month and Day in pulldowns.  */  
        var ymd = datestring.split('-'); // YYYY-MM-DD
        year  = parseInt( ymd[0], 10 );
        month = parseInt( ymd[1], 10 );
        day   = parseInt( ymd[2], 10 );        

      $("#day_", this).children().each(function() { 
              if(day == $(this).val()) { 
                      $(this).attr('selected', 'selected'); 
              } 
      }); 

      $("#month_", this).children().each(function() { 
              if(month == $(this).val()) { 
                      $(this).attr('selected', 'selected'); 
              } 
      }); 

      $("#year_", this).children().each(function() { 
              if(year == $(this).val()) { 
                      $(this).attr('selected', 'selected'); 
              } 
      });

    },
    /* Call before submit hook. */
    submit: function (settings, original) {

        //Take values from day month and year pulldowns and create the  string 
        //If we have settings for delimiter and order, then use them, otherwise use the default: Y-M-D
        
          //Set default
          
            var delimeter = '-';
            var firstout = 'year';
            var secondout = 'month';
            var thirdout = 'day';
        
          //Do we have settings?
          if (typeof(settings.selectdate) != 'undefined')
          {
              //Check if user passed a minyear or maxyear value in settings, if so, use it.
							if (typeof(settings.selectdate.delimeter) != 'undefined')
							{
									var delimeter = settings.selectdate.delimeter;
							}

              //Detect the specified order for the output string 
							if ((typeof(settings.selectdate.submitorder) != 'undefined') && (settings.selectdate.submitorder.length == 3))
							{
									switch (settings.selectdate.submitorder[0].toLowerCase())
									{
										case 'y':
											var firstout = 'year';
										break; 

										case 'm':
											var firstout = 'month';
										break; 
									 
										case 'd':
											var firstout = 'day';
										break;
										 
									}

									switch (settings.selectdate.submitorder[1].toLowerCase())
									{
										case 'y':
											var secondout = 'year';
										break; 

										case 'm':
											var secondout = 'month';
										break; 
									 
										case 'd':
											var secondout = 'day';
										break;
										 
									}

									switch (settings.selectdate.submitorder[2].toLowerCase())
									{
										case 'y':
											var thirdout = 'year';
										break; 

										case 'm':
											var thirdout = 'month';
										break; 
									 
										case 'd':
											var thirdout = 'day';
										break;
										 
									}
							}
					}        
        
        //Generate output
        var value= $("#"+firstout+"_").val() + delimeter + $("#"+secondout+"_").val() + delimeter + $("#"+thirdout+"_").val();  
        $('input', this).val(value);
      
    }
});