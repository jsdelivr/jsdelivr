/**
 * jTweetsAnywhere V1.3.1
 * http://thomasbillenstein.com/jTweetsAnywhere/
 *
 * Copyright 2011, Thomas Billenstein
 * Licensed under the MIT license.
 * http://thomasbillenstein.com/jTweetsAnywhere/license.txt
 */


/**
 * The code below is used as supplied by Twitter (https://dev.twitter.com/docs/intents)
 *
 * Twitter says:

 * "Some sites may prefer to embed the unobtrusive Web Intents pop-up Javascript inline
 * or without a dependency to platform.twitter.com. The snippet below will offer the
 * equivalent functionality without the external dependency."
 */
(function()
{
  if (window.__twitterIntentHandler)
	  return;

  var intentRegex = /twitter\.com(\:\d{2,4})?\/intent\/(\w+)/,
      windowOptions = 'scrollbars=yes,resizable=yes,toolbar=no,location=yes',
      width = 550,
      height = 420,
      winHeight = screen.height,
      winWidth = screen.width;


  function handleIntent(e)
  {
    e = e || window.event;

    var target = e.target || e.srcElement,
        m, left, top;

    while (target && target.nodeName.toLowerCase() !== 'a')
    {
      target = target.parentNode;
    }

    if (target && target.nodeName.toLowerCase() === 'a' && target.href)
    {
      m = target.href.match(intentRegex);
      if (m)
      {
        left = Math.round((winWidth / 2) - (width / 2));
        top = 0;

        if (winHeight > height)
        {
          top = Math.round((winHeight / 2) - (height / 2));
        }

        window.open(target.href, 'intent', windowOptions + ',width=' + width + ',height=' + height + ',left=' + left + ',top=' + top);
        e.returnValue = false;
        e.preventDefault && e.preventDefault();
      }
    }
  }

  if (document.addEventListener)
  {
    document.addEventListener('click', handleIntent, false);
  }
  else if (document.attachEvent)
  {
    document.attachEvent('onclick', handleIntent);
  }

  window.__twitterIntentHandler = true;
}());


/**
 * JTA_I18N is based on SimpleI18N V0.1.0
 *
 * SimpleI18N.js is a tiny library for simple i18n support in Javascript.
 * Currently only translation is supported.
 */
(function()
{
	if (window.__JTA_I18N)
	{
		return;
	}

	JTA_I18N = function()
	{
		var _resources = {};

		function ResourceBundle(locale, resources)
		{
			this.getLocale = function()
			{
				return locale;
			};

			this.get = function(key, params)
			{
				return xlate(key, 1, params);
			};

			this._ = this.get;

			this.nget = function(singular, plural, count, params)
			{
				return count === 1 ? xlate(singular, 1, params) : xlate(plural, count, params);
			};

			this.__ = this.nget;

			function xlate(key, count, params)
			{
				var resource = getValue(key);

				if (count !== 1 && typeof resource === "object")
				{
					resource = evalMulti(key, resource, count);
				}

				if (resource && params)
				{
					for (p in params)
					{
						resource = resource.replace(p, getValue(params[p]));
					}
				}

				return resource;
			};

			function getValue(resource)
			{
				return resources ? (resources[resource] || resource) : resource;
			};

			function evalMulti(key, resource, count)
			{
				for (pat in resource)
				{
					var re = /(\d+)\s*-\s*(\d+)/,
					match = re.exec(pat);

					if (match)
					{
						var from = match[1];
						var to = match[2];
						if (count >= from && count <= to)
						{
							return resource[pat];
						}
					}

					re = /([<>]=?)\s*(\d+)/;
					match = re.exec(pat);

					if (match)
					{
						var op = match[1];
						var num = match[2];
						if (op === '>' && count > num)
						{
							return resource[pat];
						}
						else if (op === '>=' && count >= num)
						{
							return resource[pat];
						}
						else if (op === '<' && count < num)
						{
							return resource[pat];
						}
						else if (op === '<=' && count <= num)
						{
							return resource[pat];
						}
					}

					re = /\s*,\s*/;
					match = pat.split(re);

					if (match)
					{
						for (var i = 0; i < match.length; i++)
						{
							if (count === ~~match[i])
							{
								return resource[pat];
							}
						}
					}
				}

				return key;
			}
		};

		return {

			addResourceBundle: function(project, locale, resources)
			{
				if (!_resources[project])
				{
					_resources[project] = {};
				}

				_resources[project][locale] = resources;
			},

			getResourceBundle: function(project, locale)
			{
				return new ResourceBundle(locale, _resources[project] ? _resources[project][locale] : null);
			}
		};
	}();

	window.__JTA_I18N = true;
}());

JTA_I18N.addResourceBundle('jTweetsAnywhere', 'en',
{
	'$$monthNames': [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
});

(function($)
{
	$.fn.jTweetsAnywhere = function(config)
	{
		// setup the default options
		var options = $.extend(
		{
			/**
			 * The user's name who's tweet feed or list feed is displayed. This
			 * param is also used when a Twitter "Follow Button" is displayed. Usually
			 * this param is a string, but can also be an array of strings. If an array
			 * is supplied (and the params 'list' and 'searchParams' are null), a
			 * combined feed of all users is displayed.
			 *
			 * Sample: 'tbillenstein' or ['twitterapi', '...', '...']
			 */
			username: 'tbillenstein',

			/**
			 * The name of a user's list where the tweet feed is generated from. The special
			 * list name 'favorites' can be used to display a user's favorited tweets.
			 */
			list: null,

			/**
			 * A single search param string or an array of search params, to be used in
			 * a Twitter search call. All Twitter Search Params are supported
			 * See here for the details:
			 * http://apiwiki.twitter.com/Twitter-Search-API-Method%3A-search
			 *
			 * Sample: 'q=twitter' or ['q=twitter', 'geocode=48.856667,2.350833,30km']
			 */
			searchParams: null,

			/**
			 * The number of tweets shown in the tweet feed. If this param is 0, no feed
			 * is displayed. For user or list feeds the maximum count is 20, for search
			 * results the maximum count is 100.
			 *
			 * Unlike in previous releases, since 1.2.0 jTweetsAnywhere is based on a
			 * tweets caching algorithm that will always deliver the requested count of
			 * tweets accepting that this request can only be fullfilled by calling Twitter
			 * more than once.
			 *
			 * IMPORTANT: Please always keep in mind, that the use of the Twitter API is
			 * rate limited. Non-authenticated users are rated IP-based and you have only
			 * 150 calls per hour available. Every retrieval of tweets counts and so does
			 * for example hovering over a profile image to show the hovercard.
			 * jTweetsAnywhere will always check the remaining count of free API calls before
			 * actually calling Twitter to avoid black listing your visitor's IP.
			 */
			count: 0,

			/**
			 * A flag (true/false) that specifies whether to display a profile image in
			 * tweets. If the param is set to null (the default value), a profile image
			 * is displayed only if the feed represents a user's list or the result of a
			 * Twitter search.
			 *
			 * THIS OPTION IS DEPRECATED. You should use showTweetFeed.showProfileImages
			 * instead.
			 */
			tweetProfileImagePresent: null,

			/**
			 * Each tweet that is loaded from Twitter will pass the tweetFilter. if
			 * the filter returns true, the tweet will be added to the tweets cache
			 * otherwise it is ignored. The defaultTweetFilter alsways retruns true
			 * but you can supply your own tweet filter to customize the tweet feed.
			 */
			tweetFilter: defaultTweetFilter,

			/**
			 * A flag (true/false) that specifies whether to display a Tweet Feed
			 * or an object literal representing the configuration options for the
			 * Tweet Feed. This flag works in conjunction with the count parameter:
			 * - if count equals 0, no feed is displayed, ignoring showTweetFeed
			 * - if count not equals 0 and showTweetFeed equals false, no feed
			 *   is displayed
			 * {
			 *     autoConformToTwitterStyleguide: false,
			 *     								// Boolean - as the name implies, sets all options to confirm to Twitter's
			 *     								// styleguide regulations. Implies:
			 *     								// showTweetFeed: {
			 *     								//     showUserFullNames: null,	// null means: if usernames are shown, show
			 *     								//								// fullnames too
			 *     								//     showTwitterBird: true,
			 *									//     showActionReply: true,
			 *									//     showActionRetweet: true,
			 *									//     showActionFavorite: true
			 *     								// }
			 *
			 *     showTwitterBird: true,		// Boolean - show Twitter bird icon beneath the timestamp of a tweet, linking to
			 *     								// the tweeter's MiniProfile Web Intent
			 *
			 *     showTimestamp: true, 		// A flag (true/false) that specifies whether to display a tweet's timestamp
			 * 									// or an object literal representing the configuration options for the
			 * 									// timestamp.
			 * 									// {
			 * 									//     refreshInterval: 0,	// Time in seconds to be waited until the
			 * 									//							// timestamps of the displayed tweets get refreshed
		     *									// 							// 0 means no refreshing.
			 * 									// }
			 *
			 *     showSource: false,			// Boolean - Show info about the source of the tweet.
			 *
			 *     showGeoLocation: true,		// Boolean - Show geolocation info and link to Google maps.
			 *
			 *     showInReplyTo: true,			// Boolean - Show link to the "replied to" tweet (if available).
			 *
			 *     showActionReply: false,		// Boolean - Show tweet's 'Reply' action (supplies a link to popup the tweet's
			 *     								// Reply Web Intent)
			 *
			 *     showActionRetweet: false,	// Boolean - Show tweet's 'Retweet' action (supplies a link to popup the tweet's
			 *     								// Retweet Web Intent)
			 *
			 *     showActionFavorite: false,	// Boolean - Show tweet's 'Favorite' action (supplies a link to popup the tweet's
			 *     								// Favorite Web Intent)
			 *
			 *     showProfileImages: null,		// A flag (true/false) that specifies whether to display a profile image in
			 * 									// tweets. If the param is set to null (the default value), a profile image
			 * 									// is displayed only if the feed represents a user's list or the result of a
			 * 									// Twitter search.
			 *
			 *     showUserScreenNames: null,	// A flag (true/false/null) that specifies whether to display a username in
			 * 									// tweets. If the param is set to null (the default value), a username
			 * 									// is displayed only if the feed represents a user's list or the result of a
			 * 									// Twitter search.
			 *
			 *     showUserFullNames: false,	// A flag (true/false/null) that specifies whether to display a user's full name
			 * 									// in tweets. If the param is set to null, a user's full name
			 * 									// is displayed only if the feed represents a user's list or the result of a
			 * 									// Twitter search.
			 *
			 *     expandHovercards: false,		// Boolean - Show Hovercards in expanded mode.
			 *
			 *	   includeRetweets: true,		// Boolean - Include native retweets in a user's tweet feed
			 *
			 *     paging:						// An object literal representing the configuration options for the
			 *     {							// paging support, that specifies how more/earlier tweets can be loaded
			 *         mode: "none"		   		// by using the supplied UI controls (more/next buttons, scrollbar).
			 *     },                           // Accepted values for mode are: "none" | "more" | "prev-next" | "endless-scroll"
			 *									// if mode equals "endless-scroll" you have to set the height of the tweet feed
			 *									// element (.jta-tweet-list) in your CSS to get a scrollbar! You should also set
			 *									// the "overflow" attribute to "auto".
			 *
		     *     autorefresh:					// An object literal representing the configuration options for the
		     *	   {							// autorefresh behaviour.
		     *
		     *									// IMPORTANT: Please always keep in mind, that using the Twitter API is rate
		     *									// limited. Non-authenticated users are rated IP-based and you have only 150
		     *									// calls per hour available. Every retrieval of tweets counts and so does for
		     *									// example hovering over a profile image to show the hovercard. jTweetsAnywhere will
			 *									// always check the remaining count of free API calls before actually calling
			 *									// Twitter to avoid black listing your visitor's IP.
			 *
			 * 									// However - choose your settings wisely to keep your visitors happy. An update
			 *									// interval of 30 seconds on a feed that is updated averaged once per hour
			 *									// does not make sense and is a total waste of remaining API calls!
			 *
		     *	       mode: "none",            // Accepted values for mode are: "none" | "auto-insert" | "trigger-insert"
		     *									// "none" (the default value) - disables the autorefresh feature
		     *									// "auto-insert" - automatically insert the new tweets on top of the tweet feed
		     *									// "trigger-insert" - if new tweets arrived, show or update a button that displays
		     *									// the number of new tweets. These new tweets are inserted on top of the tweet
		     *									// feed, if the user clicks on the button.
		     *
		     *	       interval: 60,			// Time in seconds to be waited until the next request for new tweets. Minimum
		     *									// value is 30.
		     *
		     *         duration: 3600			// Time in seconds for how long the autorefresh will be active. After
		     *									// this period of time, autorefreshing will stop. A value of -1 means
		     *									// autorefresh for ever.
		     *    }
			 * }
			 */
			showTweetFeed: true,

			/**
			 * A flag (true/false) that specifies whether to display a Twitter "Follow
			 * Button".
			 */
			showFollowButton: false,

			/**
			 * A flag (true/false) that specifies whether to display a Twitter "Connect
			 * Button" or an object literal representing the configuration options for
			 * the "Tweet Box".
			 * {
			 *     size: 'medium'				// String - The size of the Connect Button. Valid values are: small, medium, large, xlarge
			 * }
			 */
			showConnectButton: false,

			/**
			 * A flag (true/false) that specifies whether to display Login Infos.
			 */
			showLoginInfo: false,

			/**
			 * A flag (true/false) that specifies whether to display a Twitter "Tweet
			 * Box" or an object literal representing the configuration options for
			 * the "Tweet Box".
			 * {
			 *     counter: true,				// Boolean - Display a counter in the Tweet Box for counting characters
			 *     width: 515,					// Number - The width of the Tweet Box in pixels
			 *     height: 65,					// Number - The height of the Tweet Box in pixels
			 *     label: "What's happening?",	// String - The text above the Tweet Box, a call to action
			 *     defaultContent: <none>,		// String - Pre-populated text in the Tweet Box. Useful for an @mention, a #hashtag, a link, etc.
			 *     onTweet: <none>				// Function - Specify a listener for when a tweet is sent from the Tweet Box. The listener receives two arguments: a plaintext tweet and an HTML tweet
			 * }
			 */
			showTweetBox: false,

			/**
			 * Identifies the locale for I18N support. The default locale is 'en'. To use this option you have to inlude the
			 * adequate locale script, jtweetsanywhere-{language}-{version}.js, e.g. jtweetsanywhere-de-1.3.0.js
			 */
			locale: 'en',

			/**
			 * A dataProvider is a function that delivers the "raw" Twitter data in
			 * JSON format. ATM internal use only!
			 */
			tweetDataProvider:
				defaultTweetDataProvider,
				//mockedTweetDataProvider,
			rateLimitDataProvider:
				defaultRateLimitDataProvider,
				//mockedRateLimitDataProvider,

			/**
			 * A decorator is a function that is responsible for constructing a certain
			 * element of the widget. Most of the decorators return a HTML string.
			 * Exceptions are the mainDecorator, which defines the basic sequence of
			 * the widget's components, plus the linkDecorator, the usernameDecorator
			 * and the hashtagDecorator which return the string that is supplied as a
			 * function param, enriched with the HTML tags.
			 *
			 * For details, see the implementations of the default decorators. Each
			 * default decorator can be overwritten by your own implementation.
			 */
			mainDecorator: defaultMainDecorator,

			tweetFeedDecorator: defaultTweetFeedDecorator,

			tweetDecorator: defaultTweetDecorator,
			tweetProfileImageDecorator: defaultTweetProfileImageDecorator,
			tweetBodyDecorator: defaultTweetBodyDecorator,
			tweetUsernameDecorator: defaultTweetUsernameDecorator,
			tweetTextDecorator: defaultTweetTextDecorator,

			tweetAttributesDecorator: defaultTweetAttributesDecorator,
			tweetTwitterBirdDecorator: defaultTweetTwitterBirdDecorator,
			tweetTimestampDecorator: defaultTweetTimestampDecorator,
			tweetSourceDecorator: defaultTweetSourceDecorator,
			tweetGeoLocationDecorator: defaultTweetGeoLocationDecorator,
			tweetInReplyToDecorator: defaultTweetInReplyToDecorator,
			tweetRetweeterDecorator: defaultTweetRetweeterDecorator,

			tweetActionsDecorator: defaultTweetActionsDecorator,
			tweetActionReplyDecorator: defaultTweetActionReplyDecorator,
			tweetActionRetweetDecorator: defaultTweetActionRetweetDecorator,
			tweetActionFavoriteDecorator: defaultTweetActionFavoriteDecorator,

			tweetFeedControlsDecorator: defaultTweetFeedControlsDecorator,
			tweetFeedControlsMoreBtnDecorator: defaultTweetFeedControlsMoreBtnDecorator,
			tweetFeedControlsPrevBtnDecorator: defaultTweetFeedControlsPrevBtnDecorator,
			tweetFeedControlsNextBtnDecorator: defaultTweetFeedControlsNextBtnDecorator,

			tweetFeedAutorefreshTriggerDecorator: defaultTweetFeedAutorefreshTriggerDecorator,
			tweetFeedAutorefreshTriggerContentDecorator: defaultTweetFeedAutorefreshTriggerContentDecorator,

			connectButtonDecorator: defaultConnectButtonDecorator,

			loginInfoDecorator: defaultLoginInfoDecorator,
			loginInfoContentDecorator: defaultLoginInfoContentDecorator,

			followButtonDecorator: defaultFollowButtonDecorator,

			tweetBoxDecorator: defaultTweetBoxDecorator,

			linkDecorator: defaultLinkDecorator,
			usernameDecorator: defaultUsernameDecorator,
			hashtagDecorator: defaultHashtagDecorator,

			loadingDecorator: defaultLoadingDecorator,
			errorDecorator: defaultErrorDecorator,
			noDataDecorator: defaultNoDataDecorator,

			/**
			 * Formatters are currently used for date format processing only.
			 *
			 * The tweetTimestampFormatter formats the tweet's timestamp to be shown
			 * in the tweet attributes section
			 *
			 * For details, see the implementation of the defaultTweetTimestampFormatter.
			 */
			tweetTimestampFormatter : defaultTweetTimestampFormatter,

			/**
			 * The tweetTimestampTooltipFormatter formats the tweet's timestamp to be shown
			 * in the tooltip when hovering over the timestamp link.
			 */
			tweetTimestampTooltipFormatter : defaultTweetTimestampTooltipFormatter,

			/**
			 * A visualizer is a function that is responsible for adding one or more
			 * elements to the DOM and thereby making them visible to the user.
			 * A visualizer might also be responsible to do the opposite effect:
			 * To remove one or more elements from the DOM.
			 *
			 * The tweetVisualizer gets called each time a tweet element should be
			 * appended or prepended to the tweet feed element.
			 *
			 * For details, see the implementation of the defaultTweetVisualizer.
			 *
			 * Each default visualizer can be overwritten by your own implementation.
			 */
			tweetVisualizer: defaultTweetVisualizer,

			/**
			 * The loadingIndicatorVisualizer gets called each time data is retrieved
			 * from Twitter to visualize the loading indicator. This visualizer is also
			 * used to hide the loading indicator.
			 *
			 * For details, see the implementation of the defaultLoadingIndicatorVisualizer.
			 */
			loadingIndicatorVisualizer: defaultLoadingIndicatorVisualizer,

			/**
			 * The autorefreshTriggerVisualizer will be called if the autorefresh
			 * trigger should be visualized or hidden.
			 *
			 * For details, see the implementation of the autorefreshTriggerVisualizer.
			 */
			autorefreshTriggerVisualizer: defaultAutorefreshTriggerVisualizer,

			/**
			 * An event handler is a function that gets called whenever the event you
			 * are interested in, occurs.
			 *
			 * The onDataRequest event handler will be called immediatly before calling
			 * Twitter to retrieve new data and gives you the opportunity to deny
			 * the call by returning false from the function.
			 *
			 * This feature might be used in conjunction with the paging feature,
			 * especially when using the "endless-scroll" paging mode, to avoid the
			 * exhaustion of remaining Twitter API calls, before the rate limit is
			 * reached. The stats parameter contains statistical infos and counters
			 * that you can examine to base your decision whether to return true or
			 * false.
			 */
			onDataRequestHandler: defaultOnDataRequestHandler,

			/**
			 * The onRateLimitData event handler is called each time
			 * jTweetsAnywhere retrieved the rate limit data from Twitter. The actual
			 * rate limit data is contained in the stats object.
			 */
			onRateLimitDataHandler: defaultOnRateLimitDataHandler,

			/**
			 * The OnOptionsInitializingHandler event handler is called before initializing
			 * the user options
			 */
			onOptionsInitializingHandler: defaultOnOptionsInitializingHandler,

			_tweetFeedConfig:
			{
				autoConformToTwitterStyleguide: false,
				showTwitterBird: true,
				showTimestamp:
				{
					refreshInterval: 0
				},
				showSource: false,
				showGeoLocation: true,
				showInReplyTo: true,
				showActionReply: false,
				showActionRetweet: false,
				showActionFavorite: false,
				showProfileImages: null,
				showUserScreenNames: null,
				showUserFullNames: false,
				expandHovercards: false,
				includeRetweets: true,
				paging:
				{
					mode: "none",
					_limit: 0,
					_offset: 0
				},
				autorefresh:
				{
					mode: "none",
					interval: 60,
					duration: 3600,
					max: -1,
					_startTime: null,
					_triggerElement: null
				},
				_pageParam: 0,
				_maxId: null,
				_recLevel: 0,
				_noData: false,
				_clearBeforePopulate: false
			},
			_tweetBoxConfig:
			{
				counter: true,
				width: 515,
				height: 65,
				label: null,
				defaultContent: '',
				onTweet: function(textTweet, htmlTweet) {}
			},
			_connectButtonConfig:
			{
				size: "medium"
			},
			_baseSelector: null,
			_baseElement: null,
			_tweetFeedElement: null,
			_tweetFeedControlsElement: null,
			_followButtonElement: null,
			_loginInfoElement: null,
			_connectButtonElement: null,
			_tweetBoxElement: null,
			_loadingIndicatorElement: null,
			_noDataElement: null,
			_tweetsCache: [],
			_autorefreshTweetsCache: [],
			_stats:
			{
				dataRequestCount: 0,
				rateLimitPreventionCount: 0,
				rateLimit:
				{
					remaining_hits: 150,
					hourly_limit: 150
				}
			},
			_resourceBundle: null
		}, config);

		// save the plugin's base selector
		options._baseSelector = this.selector;

		options.onOptionsInitializingHandler(options);
		setupOptions(options);

		// no main decorator? nothing to do!
		if (!options.mainDecorator)
		{
			return;
		}

		$.ajaxSetup({ cache: true });

		return this.each(function()
		{
			// the DOM element, where to display the widget
			options._baseElement = $(this);

			// create the widget's necessary sub DOM elements
			options._tweetFeedElement = options.tweetFeedDecorator ? $(options.tweetFeedDecorator(options)) : null;
			options._tweetFeedControlsElement = options.tweetFeedControlsDecorator ? $(options.tweetFeedControlsDecorator(options)) : null;
			options._followButtonElement = options.followButtonDecorator ? $(options.followButtonDecorator(options)) : null;
			options._tweetBoxElement = options.tweetBoxDecorator ? $(options.tweetBoxDecorator(options)) : null;
			options._connectButtonElement = options.connectButtonDecorator ? $(options.connectButtonDecorator(options)): null;
			options._loginInfoElement = options.loginInfoDecorator ? $(options.loginInfoDecorator(options)) : null;

			// add the widget to the DOM
			options.mainDecorator(options);

			populateTweetFeed(options);
			populateAnywhereControls(options);

			bindEventHandlers(options);

			setupAutorefresh(options);
		});
	};
	defaultMainDecorator = function(options)
	{
		// defines the default sequence of the widget's elements
		if (options._tweetFeedElement)
		{
			options._baseElement.append(options._tweetFeedElement);
		}

		if (options._tweetFeedControlsElement)
		{
			options._baseElement.append(options._tweetFeedControlsElement);
		}

		if (options._connectButtonElement)
		{
			options._baseElement.append(options._connectButtonElement);
		}

		if (options._loginInfoElement)
		{
			options._baseElement.append(options._loginInfoElement);
		}

		if (options._followButtonElement)
		{
			options._baseElement.append(options._followButtonElement);
		}

		if (options._tweetBoxElement)
		{
			options._baseElement.append(options._tweetBoxElement);
		}
	};
	defaultTweetFeedControlsDecorator = function(options)
	{
		// the default tweet feed's paging controls
		var html = '';

		if (options._tweetFeedConfig.paging.mode == 'prev-next')
		{
			if (options.tweetFeedControlsPrevBtnDecorator)
			{
				html += options.tweetFeedControlsPrevBtnDecorator(options);
			}

			if (options.tweetFeedControlsNextBtnDecorator)
			{
				html += options.tweetFeedControlsNextBtnDecorator(options);
			}
		}
		else if (options._tweetFeedConfig.paging.mode == 'endless-scroll')
		{
			// nothing to do here
		}
		else
		{
			if (options.tweetFeedControlsMoreBtnDecorator)
			{
				html += options.tweetFeedControlsMoreBtnDecorator(options);
			}
		}

		return '<div class="jta-tweet-list-controls">' + html + '</div>';
	};
	defaultTweetFeedControlsMoreBtnDecorator = function(options)
	{
		return '<span class="jta-tweet-list-controls-button jta-tweet-list-controls-button-more">' + options._resourceBundle._('More') + '</span>';
	};
	defaultTweetFeedControlsPrevBtnDecorator = function(options)
	{
		return '<span class="jta-tweet-list-controls-button jta-tweet-list-controls-button-prev">' + options._resourceBundle._('Prev') + '</span>';
	};
	defaultTweetFeedControlsNextBtnDecorator = function(options)
	{
		return '<span class="jta-tweet-list-controls-button jta-tweet-list-controls-button-next">' + options._resourceBundle._('Next') + '</span>';
	};
	defaultTweetFeedAutorefreshTriggerDecorator = function(count, options)
	{
		var html = '';

		if (options.tweetFeedAutorefreshTriggerContentDecorator)
		{
			html = options.tweetFeedAutorefreshTriggerContentDecorator(count, options);
		}

		return '<li class="jta-tweet-list-autorefresh-trigger">' + html + '</li>';
	};
	defaultTweetFeedAutorefreshTriggerContentDecorator = function(count, options)
	{
		var content = options._resourceBundle.__('%count% new tweet', '%count% new tweets', count, { '%count%' : count });

		return '<span class="jta-tweet-list-autorefresh-trigger-content">' + content + '</span>';
	};
	defaultTweetFeedDecorator = function(options)
	{
		// the default placeholder for the tweet feed is an unordered list
		return '<ul class="jta-tweet-list"></ul>';
	};
	defaultTweetDecorator = function(tweet, options)
	{
		// the default tweet is made of the optional user's profile image and the
		// tweet body inside a list item element
		var html = '';

		if (options._tweetFeedConfig.showProfileImages)
		{
			html += options.tweetProfileImageDecorator(tweet, options);
		}

		if (options.tweetBodyDecorator)
		{
			html += options.tweetBodyDecorator(tweet, options);
		}

		html += '<div class="jta-clear">&nbsp;</div>';

		return '<li class="jta-tweet-list-item">' + html + '</li>';
	};
	defaultTweetProfileImageDecorator = function(tweet, options)
	{
		// if tweet is a native retweet, use the retweet's profile
		var t = tweet.retweeted_status || tweet;

		// the default profile image decorator simply adds a link to the user's Twitter profile
		var screenName = getScreenName(tweet);
		var imageUrl = t.user ? t.user.profile_image_url : false || t.profile_image_url;

		var html =
			'<a class="jta-tweet-profile-image-link" href="http://twitter.com/' + screenName + '" target="_blank">' +
			'<img src="' + imageUrl + '" alt="' + screenName + '"' +
			(isAnywherePresent() ? '' : (' title="' + screenName + '"')) +
			'/>' +
			'</a>';

		return '<div class="jta-tweet-profile-image">' + html + '</div>';
	};
	defaultTweetBodyDecorator = function(tweet, options)
	{
		// the default tweet body contains the tweet text and the tweet's creation date
		var html = '';

		if (options.tweetTextDecorator)
		{
			html += options.tweetTextDecorator(tweet, options);
		}

		if (options.tweetAttributesDecorator)
		{
			html += options.tweetAttributesDecorator(tweet, options);
		}

		if (options.tweetActionsDecorator)
		{
			html += options.tweetActionsDecorator(tweet, options);
		}

		return '<div class="jta-tweet-body ' +
			(options._tweetFeedConfig.showProfileImages ? 'jta-tweet-body-list-profile-image-present' : '') + '">' +
			html +
			'</div>';
	};
	defaultTweetTextDecorator = function(tweet, options)
	{
		var tweetText = tweet.text;

		// if usernames should be visible and tweet is a native retweet, use
		// the original tweet text
		if (tweet.retweeted_status &&
			(
				options._tweetFeedConfig.showUserScreenNames ||
				options._tweetFeedConfig.showUserScreenNames == null ||
				options._tweetFeedConfig.showUserFullNames ||
				options._tweetFeedConfig.showUserFullNames == null
			)
		)
		{
			tweetText = tweet.retweeted_status.text;
		}

		// the default tweet text decorator optionally marks links, @usernames,
		// and #hashtags
		if (options.linkDecorator)
		{
			tweetText = options.linkDecorator(tweetText, options);
		}

		if (options.usernameDecorator)
		{
			tweetText = options.usernameDecorator(tweetText, options);
		}

		if (options.hashtagDecorator)
		{
			tweetText = options.hashtagDecorator(tweetText, options);
		}

		if (options._tweetFeedConfig.showUserScreenNames ||
			options._tweetFeedConfig.showUserFullNames ||
			tweet.retweeted_status &&
			(
				options._tweetFeedConfig.showUserScreenNames == null ||
				options._tweetFeedConfig.showUserFullNames == null
			)
		)
		{
			tweetText = options.tweetUsernameDecorator(tweet, options) + ' ' + tweetText;
		}

		return '<span class="jta-tweet-text">' + tweetText + '</span>';
	};
	defaultTweetUsernameDecorator = function(tweet, options)
	{
		// if tweet is a native retweet, use the retweet's profile
		var screenName = getScreenName(tweet);
		var fullName = getFullName(tweet);

		var htmlScreenName = null;
		if (screenName && (options._tweetFeedConfig.showUserScreenNames || (options._tweetFeedConfig.showUserScreenNames == null && tweet.retweeted_status)))
		{
			htmlScreenName =
				'<span class="jta-tweet-user-screen-name">' +
				'<a class="jta-tweet-user-screen-name-link" href="http://twitter.com/' + screenName + '" target="_blank">' +
				screenName +
				'</a>' +
				'</span>';
		}

		var htmlFullName = null;
		if (fullName && (options._tweetFeedConfig.showUserFullNames || (options._tweetFeedConfig.showUserFullNames == null && tweet.retweeted_status)))
		{
			htmlFullName =
				'<span class="jta-tweet-user-full-name">' +
				(htmlScreenName ? ' ' : '') +
				'<a class="jta-tweet-user-full-name-link" href="http://twitter.com/' + screenName + '" name="' + screenName + '" target="_blank">' +
				fullName +
				'</a>' +
				'</span>';
		}

		var html = '';

		if (htmlScreenName)
		{
			html += htmlScreenName;
		}

		if (htmlFullName)
		{
			if (htmlScreenName)
			{
				html += ' ';
			}

			html += htmlFullName;
		}

		if (htmlScreenName || htmlFullName)
		{
			html =
				'<span class="jta-tweet-user-name">' +
				(tweet.retweeted_status ? 'RT ' : '') +
				html +
				'</span>';
		}

		return html;
	};
	defaultTweetAttributesDecorator = function(tweet, options)
	{
		var html = '';

		if (options.tweetTwitterBirdDecorator ||
			options.tweetTimestampDecorator ||
			options.tweetSourceDecorator ||
			options.tweetGeoLocationDecorator ||
			options.tweetInReplyToDecorator ||
			(tweet.retweeted_status && options.tweetRetweeterDecorator)
		)
		{
			html += '<span class="jta-tweet-attributes">';

			if (options.tweetTwitterBirdDecorator)
			{
				html += options.tweetTwitterBirdDecorator(tweet, options);
			}

			if (options.tweetTimestampDecorator)
			{
				html += options.tweetTimestampDecorator(tweet, options);
			}

			if (options.tweetSourceDecorator)
			{
				html += options.tweetSourceDecorator(tweet, options);
			}

			if (options.tweetGeoLocationDecorator)
			{
				html += options.tweetGeoLocationDecorator(tweet, options);
			}

			if (options.tweetInReplyToDecorator)
			{
				html += options.tweetInReplyToDecorator(tweet, options);
			}

			if (tweet.retweeted_status && options.tweetRetweeterDecorator)
			{
				html += options.tweetRetweeterDecorator(tweet, options);
			}

			html += '</span>';
		}

		return html;
	};
	defaultTweetTimestampDecorator = function(tweet, options)
	{
		// the default tweet timestamp decorator does a little bit of Twitter like formatting.

		// if tweet is a native retweet, use the retweet's timestamp
		var tw = tweet.retweeted_status || tweet;

		// reformat timestamp from Twitter, so IE is happy
		var createdAt = formatDate(tw.created_at);

		// format the timestamp by the tweetTimestampFormatter
		var tweetTimestamp = options.tweetTimestampFormatter(createdAt, options);
		var tweetTimestampTooltip = options.tweetTimestampTooltipFormatter(createdAt);

		var html =
			'<span class="jta-tweet-timestamp">' +
			'<a class="jta-tweet-timestamp-link" data-timestamp="' + createdAt +
			'" href="http://twitter.com/' + getScreenName(tweet) + '/status/' + tw.id + '" target="_blank" title="' +
			tweetTimestampTooltip + '">' +
			tweetTimestamp +
			'</a>' +
			'</span>';

		return html;
	};
	defaultTweetTwitterBirdDecorator = function(tweet, options)
	{
		var screenName = getScreenName(tweet);
		var intentUrl = 'https://twitter.com/intent/user?screen_name=' + screenName;
		var linkTitle = screenName + ' ' + options._resourceBundle._('on Twitter');

		var html =
			'<span class="jta-tweet-twitter-bird">' +
			'<a href="' + intentUrl + '" target="_blank" title="' + linkTitle + '">' +
			'<span class="jta-tweet-twitter-bird-icon">&nbsp;</span>' +
			'</a>' +
			'</span>';

		return html;
	};
	defaultTweetTimestampTooltipFormatter = function(timeStamp)
	{
		var d = new Date(timeStamp);

		return d.toLocaleString();
	};
	defaultTweetTimestampFormatter = function(timeStamp, options)
	{
		var now = new Date();

		var diff = parseInt((now.getTime() - Date.parse(timeStamp)) / 1000);

		var tweetTimestamp = '';
		if (diff < 60)
		{
			tweetTimestamp += options._resourceBundle.__('%secs% second ago', '%secs% seconds ago', diff, { '%secs%': diff });
		}
		else if (diff < 3600)
		{
			var t = parseInt((diff + 30) / 60);
			tweetTimestamp += options._resourceBundle.__('%mins% minute ago', '%mins% minutes ago', t, { '%mins%': t });
		}
		else if (diff < 86400)
		{
			var t = parseInt((diff + 1800) / 3600);
			tweetTimestamp += options._resourceBundle.__('%hours% hour ago', '%hours% hours ago', t, { '%hours%': t });
		}
		else
		{
			var d = new Date(timeStamp);

			var monthName = options._resourceBundle._('$$monthNames');
			tweetTimestamp += monthName[d.getMonth()] + ' ' + d.getDate();

			if (d.getFullYear() < now.getFullYear())
			{
				tweetTimestamp += ', ' + d.getFullYear();
			}

			var t = parseInt((diff + 43200) / 86400);
			tweetTimestamp += ' (' + options._resourceBundle.__('%days% day ago', '%days% days ago', t, { '%days%': t }) + ')';
		}

		return tweetTimestamp;
	};
	defaultTweetSourceDecorator = function(tweet, options)
	{
		// if tweet is a native retweet, use the retweet's source
		var tw = tweet.retweeted_status || tweet;

		var source = tw.source.replace(/\&lt\;/gi,'<').replace(/\&gt\;/gi,'>').replace(/\&quot\;/gi,'"');
		var html =
			'<span class="jta-tweet-source">' +
			' ' + options._resourceBundle._('via') + ' ' +
			'<span class="jta-tweet-source-link">' +
			source +
			'</span>' +
			'</span>';

		return html;
	};
	defaultTweetGeoLocationDecorator = function(tweet, options)
	{
		var html = '';

		// if tweet is a native retweet, use the retweet's source
		var tw = tweet.retweeted_status || tweet;

		var q = null;
		if (tw.geo && tw.geo.coordinates)
		{
			q = tw.geo.coordinates.join();
		}
		else if (tw.place && tw.place.full_name)
		{
			q = tw.place.full_name;
		}

		if (q)
		{
			var location = options._resourceBundle._('here');
			if (tw.place && tw.place.full_name)
			{
				location = tw.place.full_name;
			}

			var link = 'http://maps.google.com/maps?q=' + q;

			html =
				'<span class="jta-tweet-location">' +
				' ' + options._resourceBundle._('from') + ' ' +
				'<a class="jta-tweet-location-link" href="' + link + '" target="_blank">' +
				location +
				'</a>' +
				'</span>';
		}

		return html;
	};
	defaultTweetInReplyToDecorator = function(tweet, options)
	{
		// if tweet is a native retweet, use the retweet's source
		var tw = tweet.retweeted_status || tweet;

		var html = '';

		if (tw.in_reply_to_status_id && tw.in_reply_to_screen_name)
		{
			var linkHref = 'http://twitter.com/' + tw.in_reply_to_screen_name + '/status/' + tw.in_reply_to_status_id;
			var linkText = options._resourceBundle._('in reply to') + ' ' + tw.in_reply_to_screen_name;

			html =
				'<span class="jta-tweet-inreplyto">' +
				' ' +
				'<a class="jta-tweet-inreplyto-link" href="' + linkHref + '" target="_blank">' +
				linkText +
				'</a>' +
				'</span>';
		}

		return html;
	};
	defaultTweetRetweeterDecorator = function(tweet, options)
	{
		var html = '';

		if (tweet.retweeted_status)
		{
			var screenName = getUserScreenName(tweet);

			var rtc = (tweet.retweeted_status.retweet_count || 0) - 1;

			var link =
				'<a class="jta-tweet-retweeter-link" href="http://twitter.com/' + screenName + '" target="_blank">' +
				screenName +
				'</a>';

			var rtcount = options._resourceBundle.__(' and %rtc% other', ' and %rtc% others', rtc, { '%rtc%': rtc });

			html =
				'<br/>' +
				'<span class="jta-tweet-retweeter">' +
				options._resourceBundle._('Retweeted by') + ' ' + link +
				(rtc > 0 ? rtcount : '') +
				'</span>';
		}

		return html;
	};
	defaultTweetActionsDecorator = function(tweet, options)
	{
		var html = '';

		if (options.tweetActionReplyDecorator ||
			options.tweetActionRetweetDecorator ||
			options.tweetActionFavoriteDecorator
		)
		{
			html += '<span class="jta-tweet-actions">';

			if (options.tweetActionReplyDecorator)
			{
				html += options.tweetActionReplyDecorator(tweet, options);
			}

			if (options.tweetActionRetweetDecorator)
			{
				html += options.tweetActionRetweetDecorator(tweet, options);
			}

			if (options.tweetActionFavoriteDecorator)
			{
				html += options.tweetActionFavoriteDecorator(tweet, options);
			}

			html += '</span>';
		}

		return html;
	};
	defaultTweetActionReplyDecorator = function(tweet, options)
	{
		var intentUrl = 'https://twitter.com/intent/tweet?in_reply_to=' + tweet.id;
		var actionLabel = options._resourceBundle._('Reply');

		var html =
			'<span class="jta-tweet-action-reply">' +
			'<a href="' + intentUrl + '">' + actionLabel + '</a>' +
			'</span>';

		return html;
	};
	defaultTweetActionRetweetDecorator = function(tweet, options)
	{
		var intentUrl = 'https://twitter.com/intent/retweet?tweet_id=' + tweet.id;
		var actionLabel = options._resourceBundle._('Retweet');

		var html =
			'<span class="jta-tweet-action-retweet">' +
			'<a href="' + intentUrl + '">' + actionLabel + '</a>' +
			'</span>';

		return html;
	};
	defaultTweetActionFavoriteDecorator = function(tweet, options)
	{
		var intentUrl = 'https://twitter.com/intent/favorite?tweet_id=' + tweet.id;
		var actionLabel = options._resourceBundle._('Favorite');

		var html =
			'<span class="jta-tweet-action-favorite">' +
			'<a href="' + intentUrl + '">' + actionLabel + '</a>' +
			'</span>';

		return html;
	};
	defaultConnectButtonDecorator = function(options)
	{
		// the default placeholder for the @Anywhere ConnectButton
		return '<div class="jta-connect-button"></div>';
	};
	defaultLoginInfoDecorator = function(options)
	{
		// the default placeholder for the LoginInfo
		return '<div class="jta-login-info"></div>';
	};
	defaultLoginInfoContentDecorator = function(options, T)
	{
		// the default markup of the LoginInfo content: the user's profile image, the
		// user's screen_name and a "button" to sign out
		var html = '';

		if (T.isConnected())
		{
			var screenName = T.currentUser.data('screen_name');
			var imageUrl = T.currentUser.data('profile_image_url');

			html =
				'<div class="jta-login-info-profile-image">' +
				'<a href="http://twitter.com/' + screenName + '" target="_blank">' +
				'<img src="' + imageUrl + '" alt="' + screenName + '" title="' + screenName + '"/>' +
				'</a>' +
				'</div>' +
				'<div class="jta-login-info-block">' +
				'<div class="jta-login-info-screen-name">' +
				'<a href="http://twitter.com/' + screenName + '" target="_blank">' + screenName + '</a>' +
				'</div>' +
				'<div class="jta-login-info-sign-out">' +
				options._resourceBundle._('Sign out') +
				'</div>' +
				'</div>' +
				'<div class="jta-clear">&nbsp;</div>'
				;
		}

		return html;
	};
	defaultFollowButtonDecorator = function(options)
	{
		// the default placeholder for the @Anywhere FollowButton
		return '<div class="jta-follow-button"></div>';
	};
	defaultTweetBoxDecorator = function(options)
	{
		// the default placeholder for the @Anywhere TweetBox
		return '<div class="jta-tweet-box"></div>';
	};
	defaultLinkDecorator = function(text, options)
	{
		// the regex to markup links
		return text.replace(/((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi,'<a href="$1" class="jta-tweet-a jta-tweet-link" target="_blank" rel="nofollow">$1<\/a>');
	};
	defaultUsernameDecorator = function(text, options)
	{
		// the regex to markup @usernames. if @Anywhere is present the task is left to
		// them
		return isAnywherePresent() ? text : text.replace(/\B@(\w+)/gi,'@<a href="http://twitter.com/$1" class="jta-tweet-a twitter-anywhere-user" target="_blank" rel="nofollow">$1<\/a>');
	};
	defaultHashtagDecorator = function(text, options)
	{
		// the regex to markup #hashtags
		return text.replace(/#([a-zA-Z0-9_]+)/gi,'<a href="http://search.twitter.com/search?q=%23$1" class="jta-tweet-a jta-tweet-hashtag" title="#$1" target="_blank" rel="nofollow">#$1<\/a>');
	};
	defaultLoadingDecorator = function(options)
	{
		// the default loading decorator simply says: loading ...
		return '<li class="jta-loading">' + options._resourceBundle._('loading') + ' ...</li>';
	};
	defaultErrorDecorator = function(errorText, options)
	{
		// the default error decorator shows the error message
		return '<li class="jta-error">' + options._resourceBundle._('ERROR') + ': ' + errorText + '</li>';
	};
	defaultNoDataDecorator = function(options)
	{
		// the default no-data decorator simply says: No more data
		return '<li class="jta-nodata">' + options._resourceBundle._('No more data') + '</li>';
	};

	defaultTweetFilter = function(tweet, options)
	{
		return true;
	};

	defaultTweetVisualizer = function(tweetFeedElement, tweetElement, inserter, options)
	{
		// insert (append/prepend) the tweetElement to the tweetFeedElement
		tweetFeedElement[inserter](tweetElement);
	};
	defaultLoadingIndicatorVisualizer = function(tweetFeedElement, loadingIndicatorElement, options, callback)
	{
		defaultVisualizer(tweetFeedElement, loadingIndicatorElement, 'append', 'fadeIn', 600, 'fadeOut', 200, callback);
	};
	defaultAutorefreshTriggerVisualizer = function(tweetFeedElement, triggerElement, options, callback)
	{
		defaultVisualizer(tweetFeedElement, triggerElement, 'prepend', 'slideDown', 600, 'fadeOut', 200, callback);
	};
	defaultVisualizer = function(container, element, inserter, effectIn, durationIn, effectOut, durationOut, callback)
	{
		// if param container is null element has to be removed from
		// the DOM, else element has to be inserted in container

		// if param callback is not null, the callback function must be called
		// in any case, if the visualizer is done

		var cb = function()
		{
			if (callback)
			{
				callback();
			}
		};

		if (container)
		{
			element.hide();
			container[inserter](element);
			element[effectIn](durationIn, cb);
		}
		else
		{
			element[effectOut](durationOut, function()
			{
				element.remove();
				cb();
			});
		}
	};
	defaultOnDataRequestHandler = function(stats, options)
	{
		return true;
	};
	defaultOnRateLimitDataHandler = function(stats, options)
	{
	};
	defaultOnOptionsInitializingHandler = function(options)
	{
	};
	updateLoginInfoElement = function(options, T)
	{
		// update the content of the LoginInfo element
		if (options._loginInfoElement && options.loginInfoContentDecorator)
		{
			options._loginInfoElement.children().remove();
			options._loginInfoElement.append(options.loginInfoContentDecorator(options, T));
			$(options._baseSelector + ' .jta-login-info-sign-out').bind('click', function()
			{
				twttr.anywhere.signOut();
			});
		}
	};
	getFeedUrl = function(options, flPaging)
	{
		// create the Twitter API URL based on the configuration options
		var url = ('https:' == document.location.protocol ? 'https:' : 'http:');

		if (options.searchParams)
		{
			url += '//search.twitter.com/search.json?' +
				((options.searchParams instanceof Array) ? options.searchParams.join('&') : options.searchParams) +
				'&rpp=100';
		}
		else if (options.list)
		{
			if ('favorites' == options.list)
			{
				url += '//api.twitter.com/1/favorites/' + options.username + '.json?count=20';
			}
			else
			{
				url += '//api.twitter.com/1/' + options.username + '/lists/' + options.list + '/statuses.json?per_page=20';
			}
		}
		else
		{
			url += '//api.twitter.com/1/statuses/user_timeline.json?screen_name=' + options.username + '&count=20';
			if (options._tweetFeedConfig.includeRetweets)
				url += '&include_rts=true';
		}

		if (flPaging)
		{
			url +=
				(options._tweetFeedConfig._maxId ? '&max_id=' + options._tweetFeedConfig._maxId : '') +
				'&page=' + options._tweetFeedConfig._pageParam;
		}

		url += '&callback=?';

		return url;
	};
	isAnywherePresent = function()
	{
		// check, if @Anywhere is present
		return (typeof(twttr) != 'undefined' && typeof(twttr.anywhere) != 'undefined');
	};
	clearTweetFeed = function(options)
	{
		if (options._tweetFeedElement)
		{
			options._tweetFeedElement.empty();
		}
	};
	setupOptions = function(options)
	{
		options._resourceBundle = JTA_I18N.getResourceBundle('jTweetsAnywhere', options.locale);

		options._tweetBoxConfig.label = options._resourceBundle._("What's happening?");

		// if username is an array, create the search query and flatten username
		if (typeof(options.username) != 'string')
		{
			if (!options.searchParams)
			{
				options.searchParams = ['q=from:' + options.username.join(" OR from:")];
			}

			options.username = options.username[0];
		}

		// if showTweetFeed is not set to a boolean value, we expect the configuration of
		// the tweet feed
		if (typeof(options.showTweetFeed) == 'object')
		{
			$.extend(true, options._tweetFeedConfig, options.showTweetFeed);
		}

		// if showTweetBox is not set to a boolean value, we expect the configuration of
		// the TweetBox
		if (typeof(options.showTweetBox) == 'object')
		{
			$.extend(true, options._tweetBoxConfig, options.showTweetBox);
			options.showTweetBox = true;
		}

		// if showConnectButton is not set to a boolean value, we expect the
		// configuration of the Connect Button
		if (typeof(options.showConnectButton) == 'object')
		{
			options._connectButtonConfig = options.showConnectButton;
			options.showConnectButton = true;
		}

		// to be compatible, check the deprecated option 'tweetProfileImagePresent'
		if (options._tweetFeedConfig.showProfileImages == null)
		{
			options._tweetFeedConfig.showProfileImages = options.tweetProfileImagePresent;
		}

		// if _tweetFeedConfig.showProfileImages is not set to a boolean value,
		// we decide to show a profile image if the feed represents a user's
		// list or the results of a Twitter search
		if (options._tweetFeedConfig.showProfileImages == null)
		{
			options._tweetFeedConfig.showProfileImages = (options.list || options.searchParams) && options.tweetProfileImageDecorator;
		}

		// handle the autoConformToTwitterStyleguide
		if (options._tweetFeedConfig.autoConformToTwitterStyleguide)
		{
			options._tweetFeedConfig.showUserFullNames = null;
			options._tweetFeedConfig.showTwitterBird = true;
			options._tweetFeedConfig.showActionReply = true;
			options._tweetFeedConfig.showActionRetweet = true;
			options._tweetFeedConfig.showActionFavorite = true;
		}

		// if _tweetFeedConfig.showUserScreenNames is not set to a boolean value,
		// we decide to show a username if the feed represents a user's
		// list or the results of a Twitter search or a tweet is a native retweet
		if (options._tweetFeedConfig.showUserScreenNames == null)
		{
			if (options.list || options.searchParams)
			{
				options._tweetFeedConfig.showUserScreenNames = true;
			}

			if (!options.tweetUsernameDecorator)
			{
				options._tweetFeedConfig.showUserScreenNames = false;
			}
		}

		// if _tweetFeedConfig.showUserFullNames is not set to a boolean value,
		// we decide to show a user's full name if the feed represents a user's
		// list or the results of a Twitter search or a tweet is a native retweet
		if (options._tweetFeedConfig.showUserFullNames == null)
		{
			if (options.list || options.searchParams)
			{
				options._tweetFeedConfig.showUserFullNames = true;
			}

			if (!options.tweetUsernameDecorator)
			{
				options._tweetFeedConfig.showUserFullNames = false;
			}
		}


		options.count = validateRange(options.count, 0, options.searchParams ? 100 : 20);

		options._tweetFeedConfig.autorefresh.interval = Math.max(30, options._tweetFeedConfig.autorefresh.interval);
		if (options._tweetFeedConfig.autorefresh.max <= 0)
		{
			options._tweetFeedConfig.autorefresh.max = -1;
		}
		options._tweetFeedConfig.paging._offset = 0;
		options._tweetFeedConfig.paging._limit = options.count;

		// internally, the decision of what parts of a widget are to be
		// displayed is based on the existence of the decorators
		if (options.count == 0 || !options.showTweetFeed)
		{
			options.tweetFeedDecorator = null;
			options.tweetFeedControlsDecorator = null;
		}

		if (options._tweetFeedConfig.paging.mode == 'none')
		{
			options.tweetFeedControlsDecorator = null;
		}

		if (!options.showFollowButton)
		{
			options.followButtonDecorator = null;
		}

		if (!options.showTweetBox)
		{
			options.tweetBoxDecorator = null;
		}

		if (!options.showConnectButton)
		{
			options.connectButtonDecorator = null;
		}

		if (!options.showLoginInfo)
		{
			options.loginInfoDecorator = null;
		}

		if (!options._tweetFeedConfig.showTwitterBird)
		{
			options.tweetTwitterBirdDecorator = null;
		}

		if (!options._tweetFeedConfig.showTimestamp)
		{
			options.tweetTimestampDecorator = null;
		}

		if (!options._tweetFeedConfig.showSource)
		{
			options.tweetSourceDecorator = null;
		}

		if (!options._tweetFeedConfig.showGeoLocation)
		{
			options.tweetGeoLocationDecorator = null;
		}

		if (!options._tweetFeedConfig.showInReplyTo)
		{
			options.tweetInReplyToDecorator = null;
		}

		if (!options._tweetFeedConfig.showActionReply)
		{
			options.tweetActionReplyDecorator = null;
		}

		if (!options._tweetFeedConfig.showActionRetweet)
		{
			options.tweetActionRetweetDecorator = null;
		}

		if (!options._tweetFeedConfig.showActionFavorite)
		{
			options.tweetActionFavoriteDecorator = null;
		}
	};
	setupAutorefresh = function(options)
	{
		options._tweetFeedConfig.autorefresh._startTime = new Date().getTime();

		startAutorefresh(options);
		startTimestampRefresh(options);
	};
	populateTweetFeed = function(options)
	{
		// if a tweet feed is to be displayed, get the tweets and show them
		if (options.tweetDecorator && options._tweetFeedElement)
		{
			getPagedTweets(options, function(tweets, options)
			{
				if (options._tweetFeedConfig._clearBeforePopulate)
				{
					clearTweetFeed(options);
				}

				hideLoadingIndicator(options, function()
				{
					// process the tweets
					$.each(tweets, function(idx, tweet)
					{
						// decorate the tweet and give it to the tweet visualizer
						options.tweetVisualizer(
							options._tweetFeedElement,
							$(options.tweetDecorator(tweet, options)),
							'append',
							options
						);
					});

					if (options._tweetFeedConfig._noData && options.noDataDecorator && !options._tweetFeedConfig._noDataElement)
					{
						options._tweetFeedConfig._noDataElement = $(options.noDataDecorator(options));
						options._tweetFeedElement.append(options._tweetFeedConfig._noDataElement);
					}

					if (options._tweetFeedConfig._clearBeforePopulate)
					{
						options._tweetFeedElement.scrollTop(0);
					}

					addHovercards(options);
				});
			});
		}
	};
	populateTweetFeed2 = function(options)
	{
		if (options._tweetFeedElement && options._autorefreshTweetsCache.length > 0)
		{
			if (options._tweetFeedConfig.autorefresh.mode == 'trigger-insert')
			{
				if (options._tweetFeedConfig.autorefresh._triggerElement)
				{
					if (options.tweetFeedAutorefreshTriggerContentDecorator)
					{
						options._tweetFeedConfig.autorefresh._triggerElement.html(
							options.tweetFeedAutorefreshTriggerContentDecorator(options._autorefreshTweetsCache.length, options)
						);
					}
				}
				else
				{
					if (options.tweetFeedAutorefreshTriggerDecorator)
					{
						options._tweetFeedConfig.autorefresh._triggerElement =
							$(options.tweetFeedAutorefreshTriggerDecorator(options._autorefreshTweetsCache.length, options));
						options._tweetFeedConfig.autorefresh._triggerElement.bind('click', function()
						{
							options.autorefreshTriggerVisualizer(
								null,
								options._tweetFeedConfig.autorefresh._triggerElement,
								options,
								function()
								{
									insertTriggerTweets(options);
								}
							);
							options._tweetFeedConfig.autorefresh._triggerElement = null;
						});

						options.autorefreshTriggerVisualizer(options._tweetFeedElement, options._tweetFeedConfig.autorefresh._triggerElement, options);
					}
				}
			}
			else
			{
				insertTriggerTweets(options);
			}
		}
	};
	insertTriggerTweets = function(options)
	{
		// populate the tweet feed with tweets from the autorefresh cache
		if (options.tweetDecorator && options._autorefreshTweetsCache.length > 0)
		{
			// process the autorefresh cache
			while (options._autorefreshTweetsCache.length > 0)
			{
				// get the last tweet and remove it from the autorefresh cache
				var tweet = options._autorefreshTweetsCache.pop();

				// put that tweet on top of the tweets cache
				options._tweetsCache.unshift(tweet);

				// adjust paging offset
				options._tweetFeedConfig.paging._offset++;

				// decorate the tweet and give it to the tweet visualizer
				options.tweetVisualizer(
					options._tweetFeedElement,
					$(options.tweetDecorator(tweet, options)),
					'prepend',
					options
				);
			}

			addHovercards(options);
		}
	};
	addHovercards = function(options)
	{
		if (isAnywherePresent())
		{
			// if @Anywhere is present, append Hovercards to @username and
			// profile images
			twttr.anywhere(function(T)
			{
				T(options._baseSelector + ' .jta-tweet-list').hovercards({expanded: options._tweetFeedConfig.expandHovercards});
				T(options._baseSelector + ' .jta-tweet-profile-image img').hovercards(
				{
					expanded: options._tweetFeedConfig.expandHovercards,
					username: function(node) { return node.alt; }
				});
				T(options._baseSelector + ' .jta-tweet-retweeter-link').hovercards(
				{
					expanded: options._tweetFeedConfig.expandHovercards,
					username: function(node) { return node.text; }
				});
				T(options._baseSelector + ' .jta-tweet-user-screen-name-link').hovercards(
				{
					expanded: options._tweetFeedConfig.expandHovercards,
					username: function(node) { return node.text; }
				});
				T(options._baseSelector + ' .jta-tweet-user-full-name-link').hovercards(
				{
					expanded: options._tweetFeedConfig.expandHovercards,
					username: function(node) { return node.name; }
				});
			});
		}
	};
	populateAnywhereControls = function(options)
	{
		if (isAnywherePresent())
		{
			twttr.anywhere(function(T)
			{
				// optionally add an @Anywhere TweetBox
				if (options.tweetBoxDecorator)
				{
					T(options._baseSelector + ' .jta-tweet-box').tweetBox(options._tweetBoxConfig);
				}

				// optionally add an @Anywhere FollowButton
				if (options.followButtonDecorator)
				{
					T(options._baseSelector + ' .jta-follow-button').followButton(options.username);
				}

				// optionally add an @Anywhere ConnectButton
				if (options.connectButtonDecorator)
				{
					var o = $.extend(
					{
						authComplete: function(user)
						{
							// display/update login infos on connect/signin event
							updateLoginInfoElement(options, T);
						},
						signOut: function()
						{
							// display/update login infos on signout event
							updateLoginInfoElement(options, T);
						}
					}, options._connectButtonConfig);

					T(options._baseSelector + ' .jta-connect-button').connectButton(o);

					// display/update login infos
					updateLoginInfoElement(options, T);
				}
			});
		}
	};
	bindEventHandlers = function(options)
	{
		if (options.tweetFeedControlsDecorator)
		{
			if (options._tweetFeedConfig.paging.mode == 'prev-next')
			{
				$(options._baseSelector + ' .jta-tweet-list-controls-button-prev').bind('click', function()
				{
					if (!isLoading(options) && options._tweetFeedConfig.paging._offset > 0)
					{
						prevPage(options, true);
					}
				});
				$(options._baseSelector + ' .jta-tweet-list-controls-button-next').bind('click', function()
				{
					if (!isLoading(options))
					{
						nextPage(options, true);
					}
				});
			}
			else if (options._tweetFeedConfig.paging.mode == 'endless-scroll')
			{
				options._tweetFeedElement.bind("scroll", function()
				{
				    if (!isLoading(options) && ($(this)[0].scrollHeight - $(this).scrollTop() == $(this).outerHeight()))
				    {
				    	nextPage(options, false);
				    }
				});
			}
			else
			{
				$(options._baseSelector + ' .jta-tweet-list-controls-button-more').bind('click', function()
				{
					if (!isLoading(options))
					{
						nextPage(options, false);
					}
				});
			}
		}
	};
	nextPage = function(options, flClear)
	{
		doPage(options, flClear, Math.min(options._tweetFeedConfig.paging._offset + options._tweetFeedConfig.paging._limit, options._tweetsCache.length));
	};
	prevPage = function(options, flClear)
	{
		doPage(options, flClear, Math.max(0, options._tweetFeedConfig.paging._offset - options._tweetFeedConfig.paging._limit));
	};
	doPage = function(options, flClear, newOffset)
	{
		options._tweetFeedConfig.paging._offset = newOffset;
		options._tweetFeedConfig._clearBeforePopulate = flClear;

		populateTweetFeed(options);
	};
	startAutorefresh = function(options)
	{
		if (options._tweetFeedConfig.autorefresh.mode != 'none' &&
			options._tweetFeedConfig.paging.mode != 'prev-next' &&
			options._tweetFeedConfig.autorefresh.duration != 0 &&
			(
				options._tweetFeedConfig.autorefresh.duration < 0 ||
				(new Date().getTime() - options._tweetFeedConfig.autorefresh._startTime) <= options._tweetFeedConfig.autorefresh.duration * 1000
			)
		)
		{
			window.setTimeout(function() { processAutorefresh(options); }, options._tweetFeedConfig.autorefresh.interval * 1000);
		}
	};
	stopAutorefresh = function(options)
	{
		options._tweetFeedConfig.autorefresh.duration = 0;
	};
	processAutorefresh = function(options)
	{
		if (options._tweetFeedConfig.autorefresh.duration != 0)
		{
			// load the data ...
			getRateLimitedData(options, true, getFeedUrl(options, false), function(data, options)
			{
				// reverse the sequence of the autorefresh tweets ...
				var tweets = (data.results || data).slice(0);
				tweets.reverse();

				// ...then process them
				$.each(tweets, function(idx, tweet)
				{
					// Snowflake support: just update ids that are currently used
					if (tweet.id_str)
					{
						tweet.id = tweet.id_str;
					}

					if (tweet.in_reply_to_status_id_str)
					{
						tweet.in_reply_to_status_id = tweet.in_reply_to_status_id_str;
					}

					// if this tweet is already in one of the tweet caches, ignore it
					if (!isTweetInAutorefreshCache(tweet, options) && !isTweetInCache(tweet, options))
					{
						// optionally filter tweet ...
						if (options.tweetFilter(tweet, options))
						{
							// ... then put it to the top of the autorefresh cache
							options._autorefreshTweetsCache.unshift(tweet);

							// if a maximum autorefresh cache size is configured, remove elder tweets
							if (options._tweetFeedConfig.autorefresh.max > 0)
							{
								while (options._autorefreshTweetsCache.length > options._tweetFeedConfig.autorefresh.max)
								{
									options._autorefreshTweetsCache.pop();
								}
							}
						}
					}
				});

				populateTweetFeed2(options);
			});

			// restart autorefresh
			startAutorefresh(options);
		}
	};
	startTimestampRefresh = function(options)
	{
		if (
			options.tweetTimestampDecorator &&
			typeof(options._tweetFeedConfig.showTimestamp) == 'object' &&
			options._tweetFeedConfig.showTimestamp.refreshInterval > 0
		)
		{
			window.setTimeout(function() { processTimestampRefresh(options); }, options._tweetFeedConfig.showTimestamp.refreshInterval * 1000);
		}
	};
	processTimestampRefresh = function(options)
	{
		$.each(options._tweetFeedElement.find('.jta-tweet-timestamp-link'), function(idx, element)
		{
			var dataTimestamp = $(element).attr('data-timestamp');

			$(element).html(options.tweetTimestampFormatter(dataTimestamp, options));
		});

		startTimestampRefresh(options);
	};
	isTweetInCache = function(tweet, options)
	{
		var l = options._tweetsCache.length;

		for (var i = 0; i < l; i++)
		{
			if (tweet.id == options._tweetsCache[i].id)
			{
				return true;
			}
		}

		return false;
	};
	isTweetInAutorefreshCache = function(tweet, options)
	{
		var l = options._autorefreshTweetsCache.length;

		for (var i = 0; i < l; i++)
		{
			if (tweet.id == options._autorefreshTweetsCache[i].id)
			{
				return true;
			}
		}

		return false;
	};
	showLoadingIndicator = function(options)
	{
		if (options._tweetFeedElement && options.loadingDecorator && !options._loadingIndicatorElement)
		{
			options._loadingIndicatorElement = $(options.loadingDecorator(options));
			options.loadingIndicatorVisualizer(options._tweetFeedElement, options._loadingIndicatorElement, options, null);
			options._tweetFeedElement.scrollTop(1000000);
		}
	};
	hideLoadingIndicator = function(options, callback)
	{
		if (options._loadingIndicatorElement)
		{
			options.loadingIndicatorVisualizer(null, options._loadingIndicatorElement, options, callback);
			options._loadingIndicatorElement = null;
		}
		else
		{
			if (callback)
			{
				callback();
			}
		}
	};
	isLoading = function(options)
	{
		return options._loadingIndicatorElement != null;
	};
    formatDate = function(dateStr)
	{
    	return dateStr.replace(/^([a-z]{3})( [a-z]{3} \d\d?)(.*)( \d{4})$/i, '$1,$2$4$3');
    };
    getUserScreenName = function(tweet)
    {
		var screenName = tweet.user ? tweet.user.screen_name : false || tweet.from_user;

		return screenName;
    };
    getScreenName = function(tweet)
    {
		var t = tweet.retweeted_status || tweet;
		var screenName = t.user ? t.user.screen_name : false || t.from_user;

		return screenName;
    };
    getFullName = function(tweet)
    {
		var t = tweet.retweeted_status || tweet;
		var fullName = t.user ? t.user.name : undefined;

		return fullName;
    };
	validateRange = function(num, lo, hi)
	{
		if (num < lo)
			num = lo;

		if (num > hi)
			num = hi;

		return num;
	};
    showError = function(options, errorText)
	{
    	if (options.errorDecorator && options._tweetFeedElement)
    	{
    		options._tweetFeedElement.append(options.errorDecorator(errorText, options));
    	}
    };
    getPagedTweets = function(options, callback)
    {
    	options._tweetFeedConfig._recLevel = 0;

    	getRecPagedTweets(options, options._tweetFeedConfig.paging._offset, options._tweetFeedConfig.paging._limit, callback);
    };
    getRecPagedTweets = function(options, offset, limit, callback)
	{
    	++options._tweetFeedConfig._recLevel;

    	if (offset + limit <= options._tweetsCache.length ||
    		options._tweetFeedConfig._recLevel > 3 ||
    		options._tweetFeedConfig._noData
    	)
		{
    		// if the requested data is already cached or the max. no. of
    		// consecutive API calls is reached, use the records

    		if (offset + limit > options._tweetsCache.length)
    		{
    			limit = Math.max(0, options._tweetsCache.length - offset);
    		}

			var tweets = [];

			for (var i = 0; i < limit; i++)
			{
				tweets[i] = options._tweetsCache[offset + i];
			}

			callback(tweets, options);
		}
    	else
		{
    		// ... if not, load the data, fill the cache and try again
    		++options._tweetFeedConfig._pageParam;

    		getRateLimitedData(options, false, getFeedUrl(options, true), function(data, options)
    		{
    			var tweets = data.results || data;

    			if (tweets.length == 0)
    			{
    				options._tweetFeedConfig._noData = true;
   				}
    			else
				{
    				$.each(tweets, function(idx, tweet)
    				{
    					// Snowflake support: just update ids that are currently used
    					if (tweet.id_str)
    					{
    						tweet.id = tweet.id_str;
    					}

    					if (tweet.in_reply_to_status_id_str)
    					{
    						tweet.in_reply_to_status_id = tweet.in_reply_to_status_id_str;
    					}

    					// save the first tweet id for subsequent paging requests
    					if (!options._tweetFeedConfig._maxId)
    					{
    						options._tweetFeedConfig._maxId = tweet.id;
    					}

    					// optionally filter tweet ...
    					if (options.tweetFilter(tweet, options))
    					{
    						// then put it into the cache
    						options._tweetsCache.push(tweet);
    					}
    				});
				}

    			getRecPagedTweets(options, offset, limit, callback);
    		});
		}
	};
	getRateLimitedData = function(options, flAutorefresh, url, callback)
	{
		getRateLimit(options, function(rateLimit)
		{
			if (rateLimit && rateLimit.remaining_hits <= 0)
			{
				options._stats.rateLimitPreventionCount++;
				hideLoadingIndicator(options, null);
				return;
			}

			getData(options, flAutorefresh, url, callback);
		});
	};
	getData = function(options, flAutorefresh, url, callback)
	{
		options._stats.dataRequestCount++;

		if (!options.onDataRequestHandler(options._stats, options))
		{
			hideLoadingIndicator(options, null);
			return;
		}

		if (!flAutorefresh)
		{
			showLoadingIndicator(options);
		}

		options.tweetDataProvider(url, function(data)
		{
			if (data.error)
			{
				// in case of an error, display the error message
				showError(options, data.error);
			}
			else
			{
				callback(data, options);
			}
		});
	};
	getRateLimit = function(options, callback)
	{
		options.rateLimitDataProvider(function(rateLimit)
		{
			options._stats.rateLimit = rateLimit;

			options.onRateLimitDataHandler(options._stats, options);

			callback(rateLimit);
		});
	};
	defaultTweetDataProvider = function(url, callback)
	{
		$.getJSON(url, callback);
	};
	defaultRateLimitDataProvider = function(callback)
	{
		$.getJSON('http://api.twitter.com/1/account/rate_limit_status.json?callback=?', callback);
	};
})(jQuery);
