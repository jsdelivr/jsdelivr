YUI.add('gallery-twitter-widget', function(Y) {

/*
 * Twitter: written by Marc Schipperheyn @orangebits.nl
 * Based on the Twitter-Status by Luke Smith
 */

var RE_USERNAME = /@(\w+)/g,
	RE_LINK = /((?:https?|s?ftp|ssh)\:\/\/[^"\s<>]*[^.,;'">\:\s<>\)\]\!])/g,
	RE_HASH = /#(\w+)/g,
	Twitter;

Twitter = Y.Base.create("Twitter", Y.Widget, [], {
	
	PHOTO_TEMPLATE: '<div class="twitter-photo"><a href="{url}"><img src="{profile_image_url}"></a></div>',
	
	ENTRY_TEMPLATE:
	'<div class="twitter-update">{img}'+
		'<div class="twitter-entry"><div class="writer">{userTplt}</div>{text} {time}</div>'+
	'</div>',
	
	TIME_TEMPLATE: '<span class="twitter-timestamp">{relativeTime}</span>',

	USER_TEMPLATE: '<a href="{url}" class="twitter-username">{username}</a>',
	
	TITLE_TEMPLATE:
	'<h3 class="twitter-title">{title} {user}</h3>',
	
	interval: null,

	initializer: function (config) {
		this.publish({
			data:  { defaultFn: this._defDataFn },
			error: { defaultFn: this._defErrorFn }
		});
		
		this._initJSONPRequest();

		this.after( {
			usernameChange: this._refreshJSONPRequest,
			countChange   : this._refreshJSONPRequest
		} );
	},

	_initJSONPRequest: function () {
		var un = this.get('key'),
		obj = {
			count: this.get('count'),
			d:(new Date()).getTime(), 
			key:this.get('isQuery')? un : "from:" + un
		},

		url = Y.Lang.sub(Twitter.SEARCH_API_URI,obj).replace('#','%23');
		
		this._jsonpHandle = new Y.JSONPRequest(url, {
			on: {
				success: this._handleJSONPResponse,
				failure: this._defErrorFn
			},
			context: this
		});
	},

	_refreshJSONPRequest: function () {
		this._initJSONPRequest();
		this.syncUI();
	},

	renderUI: function () {
		this.get('contentBox').append('<div class="yui3-twitter-hdr"></div><div class="yui3-twitter-bdy"><ul class="twitter-updates' + (this.get('showPhoto')? " photo" : "") + '"></ul></div><div class="yui3-twitter-ftr"><div class="img">&nbsp;</div></div>');
		if(this.get('hideSkin')){
			this.get('boundingBox').addClass('noskin');
		}
	},

	bindUI: function () {
		this.after('usernameChange'      , this.syncUI);
		this.after('countChange'         , this.syncUI);
		this.after('stringsChange'       , this.syncUI);
		this.after('refreshSecondsChange', this._updateInterval);
	},

	syncUI: function () {
		this._uiUpdateTitle();
		this.update();

		this._updateInterval();
	},

	_uiUpdateTitle: function () {
		var cb    = this.get('contentBox').one('.yui3-twitter-hdr'),
			title = cb.one('.twitter-status-title'),
			content, un, qry;

		if (this.get('includeTitle')) {
			un = this.get('key');
			qry=this.get('isQuery');
			

			content = Y.Lang.sub(this.TITLE_TEMPLATE, {
				title   : this.get('strings.title'),
				user	: Y.Lang.sub(this.USER_TEMPLATE, {
					username: qry? un : '@' + un,
					url     : qry? Twitter.TREND_URL + un.replace('#','%23') : Twitter.PROFILE_URL + un
				})
			});


			if (title) {
				title.replace(content);
			} else {
				cb.prepend(content);
			}
		} else if (title) {
			title.remove();
		}
	},

	update: function () {
		this._jsonpHandle.send();
	},

	_handleJSONPResponse: function (data) {
		if (Y.Lang.isObject(data)) {
			this.fire('data', { data: data });
		} else {
			this.fire('error');
		}
	},

	_defDataFn: function (e) {
		this.get('contentBox').removeClass('twitter-error');

		this._printEntries(e.data);
	},

	_printEntries: function (data) {
		var cb      = this.get('contentBox'),
			entries = this._createEntries(data);

		cb.one('.twitter-updates').
			setContent('<li>' + entries.join('</li><li>') + '</li>');
	},

	_createEntries: function (resp) {
		var entries = [], data = resp.results || resp, i;

		for (i = data.length - 1; i >= 0; --i) {
			data[i].relativeTime = Y.toRelativeTime(
				// IE's Date.parse can't handle dates formatted as
				// "Tue Feb 03 23:02:18 +0000 2009"
				// but it works without the TZ offset
				new Date(Date.parse(data[i].created_at.replace(/\+\d+/,''))));
			
				var screenName = resp.results? data[i].from_user : data[i].user.screen_name;
				//data[i].photo = Twitter.API_URI + screenName;
				data[i].url = Twitter.PROFILE_URL + screenName;
				data[i].username = screenName;

			entries[i] = this._createEntry(data[i]);
		}

		return entries;
	},

	_createEntry: function (entry) {
		var tmp = this.get('showTime');
		var res = Y.Lang.sub(this.ENTRY_TEMPLATE, entry)
					.replace(RE_LINK,'<a href="$1">$1</a>')
					.replace(RE_USERNAME,
						'<a class="twitter-acct" href="' +
							Twitter.PROFILE_URL +
						'$1">@$1</a>')
					.replace(RE_HASH, 
						'<a class="twitter-hash" href="' +
							Twitter.TREND_URL	+ 
						'%23$1"/>#$1</a>'),
		time = this.get('showTime')? Y.Lang.sub(this.TIME_TEMPLATE, entry) : "",
		user = this.get('showHandle')? Y.Lang.sub(this.USER_TEMPLATE,entry) : "",
		img = this.get('showPhoto')? Y.Lang.sub(this.PHOTO_TEMPLATE,entry) : "";
		return Y.Lang.sub(res,{
			img:img,
			userTplt:user,
			time:time
		});
	},

	_defErrorFn: function () {
		this.get('contentBox').one('ul.twitter-updates').
			addClass('twitter-error').
			setContent('<li><em>' + this.get('strings.error') +'</em></li>');
	},

	_updateInterval: function () {
		if (this.interval) {
			this.interval.cancel();
		}

		this.interval = Y.later(
			this.get('refreshSeconds') * 1000,
			this, this.update, null, true);
	}

}, {
	PROFILE_URL: 'https://twitter.com/#!/',
	
	TREND_URL : 'https://twitter.com/#!/search/',

	SEARCH_API_URI: 'http://search.twitter.com/search.json?q={key}&count={count}&d={d}&callback={callback}',
	
	ATTRS: {
		/*
		 * Use the key to determin what you are searching for. This can be a twitter username, e.g. freelas_net or a query, e.g. #yui
		 */
		key: {},

		/*
		 * If the key is a query and not a twitter username, set this to true
		 */
		isQuery: {
			value: false,
			validator: Y.Lang.isBoolean
		},
		
		/*
		 * The number of tweets you want to see
		 */
		count: {
			value: 10,
			validator: Y.Lang.isNumber
		},

		/*
		 * Refresh frequency in seconds
		 */
		refreshSeconds: {
			value: 300, // 5mins
			validator: Y.Lang.isNumber
		},

		strings: {
			value: {
				title:  'Latest Updates',
				error:  'Oops!  We had some trouble connecting to Twitter :('
			}
		},
		
		/*
		 * Should we display the tweeter photo?
		 */
		showPhoto:{
			value:true,
			validator: Y.Lang.isBoolean
		},
		
		/*
		 * Should we display the tweeter username with every tweet?
		 */
		showHandle:{
			value:true,
			validator: Y.Lang.isBoolean
		},

		/*
		 * Should we display the title? This will include the title string plus the supplied Key
		 */
		includeTitle: {
			value: true,
			validator: Y.Lang.isBoolean
		},
		
		/*
		 * Should we hide the skin?
		 */
		 hideSkin:{
			value: false,
			validator: Y.Lang.isBoolean
		 },
		 
		 /*
		 * Should we show the relative time?
		 */
		 showTime:{
			value: true,
			validator: Y.Lang.isBoolean
		 }
	}
});

Y.namespace('Twitter').Status = Twitter;


}, 'gallery-2012.11.07-21-32' ,{requires:['widget-base','substitute', 'gallery-torelativetime', 'jsonp', 'base-build'], skinnable:true});
