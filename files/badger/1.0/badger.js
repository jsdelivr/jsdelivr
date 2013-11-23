// Badger v1.0 by Daniel Raftery
// http://thrivingkings.com/badger
//
// http://twitter.com/ThrivingKings

(function( $ )
	{
	$.fn.badger = function(badge, settings, callback)
		{
		// we dont really need this complexity for a single argument but I have in mind integrating badge sizes also; just thinking ahead.
		var defaults = {
			badge_id: false
		};
		if(settings) jQuery.extend(defaults, settings);
		var badge_id = (defaults.badge_id) 
			// use the badge id specified
			? defaults.badge_id 
			// create a random id; jquery does not like ids with periods in them
			: '#Badger_' + Math.random().toString().replace('.',''); 
		var the_badge = badge_id+'_badge';
		var badgerExists = this.find(badge_id).html();

  		// Clear the badge
  		if(!badge)
  			{
  			if(badgerExists)
  				{ this.find(badge_id).remove(); }
  			}
  		else
  			{
			// Figuring out badge data
			var oldBadge = this.find(the_badge).text();
			if(badge.charAt(0)=='+')
				{
				if(isNaN(badge.substr(1)))
					{ badge = oldBadge + badge.substr(1); }
				else
					{ badge = Math.round(Number(oldBadge) + Number(badge.substr(1))); }
				}
			else if(badge.charAt(0)=='-')
				{
				if(isNaN(badge.substr(1)))
					{ badge = oldBadge - badge.substr(1); }
				else
					{ badge = Math.round(Number(oldBadge) - Number(badge.substr(1))); }
				}


			// Don't add duplicates
			if(badgerExists)
				{ this.find(the_badge).html(badge); }
			else
				{ this.append('<div class="badger-outter" id="'+badge_id+'"><div class="badger-inner"><p class="badger-badge" id="'+the_badge+'">'+badge+'</p></div></div>'); }

			// Badger text or number class
			if(isNaN(badge))
				{ this.find(the_badge).removeClass('badger-number').addClass('badger-text'); }
			else
				{ this.find(the_badge).removeClass('badger-text').addClass('badger-number'); }
			// Send back badge
			if(callback) { callback(badge); }
			}
		return badge_id; // in case you are not giving badger a badge_id
		};
})( jQuery );