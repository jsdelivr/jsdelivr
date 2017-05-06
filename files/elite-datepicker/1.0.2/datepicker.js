/*!
 * Broomberg date picker v1.0.1
 *
 * Copyright Broomberg Cleaning Services Pvt Ltd
 *
 * Author: Mridul Ahuja
 */


(function($) {
	$.fn.extend({
		datepicker: function (params) {
			var dateInput = $(this);
			var selector = $(this).selector;

			if(params !== 'destroy') { /* initialize */
				var defaults = {
					format: 'Y-m-d',
					time: false
				};

				params = $.extend(defaults, params);

				generate_datepicker(dateInput, selector, params);
			}
			else { /* destroy */
				destroy_datepicker(dateInput);
			}
		}
	});


	var generate_datepicker = (dateInput, inputSelector, params) => {

		var monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
			'October', 'November', 'December'];
		var dayList = ['S', 'M', 'T', 'W', 'Th', 'F', 'Sa'];
		var dayMap = {'Sun': 1, 'Mon': 2, 'Tue': 3, 'Wed': 4, 'Thu': 5, 'Fri': 6, 'Sat': 7};
		var datepicker = $(`<div class="broomberg-d-p date-picker" tabindex="0" style="display: none;">
			<span class="up-tip"></span></div>`);
		var datepickerHeader = $(`<div class="header"></div>`);
		var mainContent = $(`<div class="main-content"><div class="m-c-items date-selector"><div class="days"></div>
			<div class="dates"></div><div class="ok-button"><span>OK</span></div></div>
			<div class="m-c-items month-selector"></div><div class="m-c-items year-selector"></div></div>`);
		var monthSelectorButton;
		var selectMonthContainer;
		var selectMonth;
		var yearSelectorButton;
		var selectYearContainer;
		var selectYear;
		var monthFirstDate = new Date();
		var inputboxDate = dateInput.val() ? dateInput.val() : new Date().toJSON().slice(0,10);
		var inputboxDateFormatted;
		var inpytboxDateSplit;
		var prevButton;
		var nextButton;
		var currentYearSelected;
		var currentMonthSelected;
		var currentDateSelected;
		var scrollToPos;
		var okButton;


		/*
			function declarations start here
		*/

		var pad_date = (nr, n, str) => {
			return Array(n-String(nr).length+1).join(str||'0')+nr;
		};


		var format_date_Y_m_d = (date, format) => {
			var formattedDate;
			date[0] = parseInt(date[0]);
			date[1] = parseInt(date[1]);
			date[2] = parseInt(date[2]);
			switch(format) {
				case 'd-m-Y':
				case 'd/m/Y':
					formattedDate = date[2] 
						+ '-' + date[1] 
						+ '-' + date[0];
					currentDateSelected = date[0];
					currentMonthSelected = date[1];
					currentYearSelected = date[2];
					break;

				case 'm-d-Y':
				case 'm/d/Y':
					formattedDate = date[2] 
						+ '-' + date[0] 
						+ '-' + date[1];
					currentDateSelected = date[1];
					currentMonthSelected = date[0];
					currentYearSelected = date[2];
					break;

				case 'Y-m-d':
				case 'Y/m/d':
					formattedDate = date[0] 
						+ '-' + date[1] 
						+ '-' + date[2];
					currentDateSelected = date[2];
					currentMonthSelected = date[1];
					currentYearSelected = date[0];
					break;

				case 'Y-d-m':
				case 'Y/d/m':
					formattedDate = date[0] 
						+ '-' + date[2] 
						+ '-' + date[1];
					currentDateSelected = date[1];
					currentMonthSelected = date[2];
					currentYearSelected = date[0];
					break;
			}
			return formattedDate;
		};


		var days_in_month = (month, year) => {
			return new Date(year, month, 0).getDate();
		}


		var to_JSON_local = (date) => {
			var local = new Date(date);
			local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
			return local.toJSON().slice(0, 10);
		}


		var get_new_date = () => {
			var newDate = params.format;
			newDate = newDate.replace('d', pad_date(currentDateSelected, 2));
			newDate = newDate.replace('m', pad_date(currentMonthSelected, 2));
			newDate = newDate.replace('Y', currentYearSelected);
			return newDate;
		};


		var create_dates = (month = undefined, year = undefined) => {
			monthFirstDate = new Date(currentMonthSelected + '-01-' + currentYearSelected);
			var datesContainer = mainContent.find(`.date-selector .dates`);
			var i;
			var firstDay = monthFirstDate.toString().substr(0,3);
			var d;

			/* converting day to number */
			firstDay = dayMap[firstDay];
			datesContainer.html('');

			for(i = 1; i< firstDay; i++) {
				datesContainer.append(`<div class="date" style="padding: 0;"></div>`);
			}

			if(month && year) {
				var days = days_in_month(month, year);
				for(i = 1; i<= days; i++) {
					d = to_JSON_local(new Date(year + '-' + month + '-' + i));
					datesContainer.append(`<div class="date" dpd="` + d + `">` + i + `</div>`);
				}

			}
		};


		var select_selected_date = () => {
			var selectedDate = mainContent.find(`.dates .date`);

			selectedDate = selectedDate.filter(function(){
				return $(this).text() == datepickerHeader.find(`.date`).text();
			});

			if(selectedDate.length) {
				selectedDate.addClass('selected');
				currentDateSelected = selectedDate.text();
				datepickerHeader.find(`.day`).text( new Date(
					currentYearSelected + '-' + currentMonthSelected + '-' + currentDateSelected)
					.toString().substr(0,3) );
			}
			else {
				var toSel = mainContent.find(`.dates .date:last-child`);
				datepickerHeader.find(`.date`).text(toSel.text());
				currentDateSelected = toSel.text();
				toSel.addClass('selected');
				datepickerHeader.find(`.day`).text( new Date(
					currentYearSelected + '-' + currentMonthSelected + '-' + currentDateSelected)
					.toString().substr(0,3) );
			}
		};


		var date_handler = (separator) => {
			inputboxDateSplit = inputboxDate.split(separator);
				if(!inputboxDateSplit>2){
					console.error('Invalid date encountered on `' + inputSelector + '`');
					return;
				}

				inputboxDateFormatted = format_date_Y_m_d(inputboxDateSplit, params.format);

				inputboxDateFormatted = new Date(inputboxDateFormatted)
				if(inputboxDateFormatted == 'Invalid Date') {
					console.error('Invalid date encountered on `' + inputSelector + '`');
					return;
				}

				datepickerHeader.find(`.date`).text(currentDateSelected);
				monthSelectorButton.text(monthList[parseInt(currentMonthSelected) - 1].substr(0, 3));
				monthSelectorButton.attr('dm', parseInt(currentMonthSelected));
				yearSelectorButton.text(currentYearSelected);
				yearSelectorButton.attr('dy', parseInt(currentYearSelected));

				/* removing previously selected month and year */
				selectMonthContainer.find(`.month`).removeClass(`selected`);
				selectYearContainer.find(`.year`).removeClass(`selected`);

				/* selecting month and year */
				selectMonthContainer.find('[dm="' + parseInt(currentMonthSelected) + '"]').addClass(`selected`);
				selectYearContainer.find('[dy="' + parseInt(currentYearSelected) + '"]').addClass(`selected`);

				scrollToPos = selectYearContainer.find('.year[dy="2018"]').get(0).offsetTop;

				selectYearContainer.get(0).scrollTop = scrollToPos-10;

				create_dates(parseInt(currentMonthSelected), currentYearSelected);
				mainContent.find(`[dpd="` + to_JSON_local(inputboxDateFormatted) + `"]`).addClass(`selected`);

		};


		/*
			function declarations end here
		*/


		datepickerHeader.append(`<div class="prev"><</div><div class="selected-date"></div><div class="next">></div>`);

		datepicker.append(datepickerHeader);
		datepicker.append(mainContent)

		datepickerHeader.find('.selected-date').append(`<span class="day">Mon</span><span class="comma">,</span>
			<span class="date">8</span> <span class="month">Sep</span> <span class="year">2017</span>`);

		datepicker.insertAfter(dateInput);


		/*
			filling info in datepicker
		*/

		/* adding months in mainContent */
		$.each(monthList, ( index, value ) => {
			mainContent.find(`.month-selector`).append(
				`<div class="month" dm="` + (index+1) + `">` + value + `</div>`
			);
		});

		/* adding years in mainContent */
		for(var i=2050; i>1950; i--) {
			mainContent.find(`.year-selector`).append(
				`<div class="year" dy="` + i + `">` + i + `</div>`
			);
		}

		/* adding days in mainContent */
		$.each(dayList, ( index, value ) => {
			mainContent.find(`.date-selector .days`).append(
				`<div class="day" dd="` + (index+1) + `">` + value + `</div>`
			);
		});


		/*
			creating references
		*/

		prevButton = datepickerHeader.find(`.prev`);
		nextButton = datepickerHeader.find(`.next`);

		monthSelectorButton = datepickerHeader.find('.month');
		selectMonth = mainContent.find(`.month`);
		selectMonthContainer = selectMonth.parent();

		yearSelectorButton = datepickerHeader.find('.year');
		selectYear = mainContent.find(`.year`);
		selectYearContainer = selectYear.parent();

		okButton = mainContent.find(`.ok-button span`);


		if(!params.time) { /* if time mode is disabled */

			if(inputboxDate.includes('-')) {
				date_handler('-');
			}
			else if(inputboxDate.includes('/')) {
				date_handler('/');
			}

		} /* if block ends here */



		/*
			event handlers start here
		*/


		/* month handlers  */

		monthSelectorButton.click(() => {
			mainContent.find(`.m-c-items`).hide();
			mainContent.find(`.month-selector`).css('left', '200px').show();
			mainContent.find(`.month-selector`).animate({left:0}, 200);
		});


		selectMonth.click((e) => {
			var selected = $(e.currentTarget);
			var selectedMonth = selected.text();
			var monthHeader = datepickerHeader.find(`.month`);
			var monthSelector = mainContent.find(`.month-selector`);
			currentMonthSelected = selected.attr('dm');
			monthHeader.text(selectedMonth.substr(0, 3));
			monthHeader.attr('dm', selected.attr('dm'));
			monthSelector.find(`.month`).removeClass(`selected`);
			selected.addClass('selected');
			mainContent.find(`.month-selector`).hide();
			mainContent.find(`.date-selector`).css('left', '200px').show();
			mainContent.find(`.date-selector`).animate({left:0}, 200);

			monthFirstDate = new Date(selected.attr('dm') + '-01-' + currentYearSelected);
			create_dates(currentMonthSelected, currentYearSelected);

			/* selecting date */
			select_selected_date();
		});


		selectMonthContainer.on( 'mousewheel DOMMouseScroll', function (e) { 
			var e0 = e.originalEvent;
			var delta = e0.wheelDelta || -e0.detail;

			this.scrollTop += ( delta < 0 ? 1 : -1 ) * 8;
			e.preventDefault();
		});


		/* year handlers  */

		yearSelectorButton.click(() => {
			mainContent.find(`.m-c-items`).hide();
			mainContent.find(`.year-selector`).css('left', '200px').show();
			mainContent.find(`.year-selector`).animate({left:0}, 200);
		});


		selectYear.click((e) => {
			var selected = $(e.currentTarget);
			var selectedYear = selected.text();
			var yearHeader = datepickerHeader.find(`.year`);
			var yearSelector = mainContent.find(`.year-selector`);
			currentYearSelected = selected.attr('dy');
			yearHeader.text(selectedYear);
			yearHeader.attr('dy', selected.attr('dy'));
			yearSelector.find(`.year`).removeClass(`selected`);
			selected.addClass('selected');
			mainContent.find(`.year-selector`).hide();
			mainContent.find(`.date-selector`).css('left', '200px').show();
			mainContent.find(`.date-selector`).animate({left:0}, 200);
			monthFirstDate = new Date(currentMonthSelected + '-01-' + selected.attr('dy'));
			create_dates(currentMonthSelected, currentYearSelected);

			/* selecting date */
			select_selected_date();
		});


		selectYearContainer.on( 'mousewheel DOMMouseScroll', function(e) { 
			var e0 = e.originalEvent;
			var delta = e0.wheelDelta || -e0.detail;

			this.scrollTop += ( delta < 0 ? 1 : -1 ) * 8;
			e.preventDefault();
		});


		dateInput.focus((e) => {
			var datepicker = $(e.currentTarget).next();
			datepicker.css('left', dateInput.get(0).offsetLeft);

			inputboxDate = dateInput.val() ? dateInput.val() : new Date().toJSON().slice(0,10);

			/* initializing datepicker with value from input */

			if(!params.time) {
				if(inputboxDate.includes('-')) {
					date_handler('-');
				}
				else if(inputboxDate.includes('/')) {
					date_handler('/');
				}
			}

			/* selecting date */
			select_selected_date();

			/* bringing up calendar */
			mainContent.find('.m-c-items').hide();
			mainContent.find('.date-selector').show();

			/* display datepicker */
			datepicker.fadeIn();
		});


		dateInput.keydown(function(e) {
			var code = e.keyCode || e.which;
			if (code == '9') { /* tab pressed */
				$('.broomberg-d-p').fadeOut();
			}
		});


		datepicker.bind('keydown', function(e) {
			var code = e.keyCode || e.which;
			if (code == '9') { /* tab pressed */
				$('.broomberg-d-p').fadeOut();
			}
		});


		prevButton.click(() => {
			if(currentMonthSelected != 1) {
				currentMonthSelected--;
			}
			else {
				currentMonthSelected = 12;
				currentYearSelected --;
			}
			monthFirstDate = new Date(currentMonthSelected + '-01-' + currentYearSelected);

			monthSelectorButton.text(monthList[currentMonthSelected - 1].substr(0, 3));
			monthSelectorButton.attr('dm', currentMonthSelected);
			yearSelectorButton.text(currentYearSelected);
			yearSelectorButton.attr('dy', currentYearSelected);

			mainContent.find(`.date-selector`).css('left', '-200px').show();
			mainContent.find(`.date-selector`).animate({left:0}, 200);

			create_dates(currentMonthSelected, currentYearSelected);

			/* selecting date */
			select_selected_date();
		});


		nextButton.click(() => {
			if(currentMonthSelected != 12) {
				currentMonthSelected++;
			}
			else {
				currentMonthSelected = 1;
				currentYearSelected++;
			}
			monthFirstDate = new Date(currentMonthSelected + '-01-' + currentYearSelected);

			monthSelectorButton.text(monthList[currentMonthSelected - 1].substr(0, 3));
			monthSelectorButton.attr('dm', currentMonthSelected);
			yearSelectorButton.text(currentYearSelected);
			yearSelectorButton.attr('dy', currentYearSelected);

			mainContent.find(`.date-selector`).css('left', '200px').show();
			mainContent.find(`.date-selector`).animate({left:0}, 200);

			create_dates(currentMonthSelected, currentYearSelected);

			/* selecting date */
			select_selected_date();
		});


		datepicker.on('click', '.main-content .date-selector .date', (e) => {
			e = $(e.currentTarget);
			
			$('.main-content .date-selector .date').removeClass('selected');
			e.addClass('selected');

			currentDateSelected = e.text();
			datepickerHeader.find(`.day`).text( new Date(
					currentYearSelected + '-' + currentMonthSelected + '-' + currentDateSelected)
					.toString().substr(0,3) );

			datepickerHeader.find(`.date`).text(currentDateSelected);
		})


		okButton.click(() => {
			dateInput.val(get_new_date());
			$('.broomberg-d-p').fadeOut();
		});


		$(document).click(function (e) {
			if((!datepicker.is(e.target) && datepicker.has(e.target).length === 0) && !dateInput.is(e.target))
			{
				datepicker.fadeOut();
			}
		});


		if (/*@cc_on!@*/false) { /* check for Internet Explorer */
			document.onfocusout = function(){
				$('.broomberg-d-p').fadeOut();
			}
		}
		else {
			window.onblur = function(){
				$('.broomberg-d-p').fadeOut();
			}
		}

	};


	var destroy_datepicker = (dateInput) => {
		dateInput.off();
		if(dateInput.next().hasClass('broomberg-d-p')) {
			dateInput.next().remove();
		}
	};


})(jQuery);