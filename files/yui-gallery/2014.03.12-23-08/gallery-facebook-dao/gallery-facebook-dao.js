YUI.add('gallery-facebook-dao', function (Y, NAME) {

/**
 * Facebook dao is an utility to add progressive functionality to retrieve and update data from facebook using graph api
 *
 * @class FacebookDAO
 * @module gallery-facebook-dao
 * @constructor
 * @param configuration {Object} Is the configuration object
 */
function FacebookDAO(configuration) {
    this.configuration = configuration;
    this._initDataAccess();
    this._loadFBComponents();
}

FacebookDAO.prototype = {

    /**
     * Configuration object
     *
     * @property configuration
     * @type {Object}
     */
    configuration: {

        fbAppId: null
    },

    /**
     * Retrieves the list of posts of sites or pages from facebook
     *
     * @method listSitePosts
     * @param {String} siteId Is the site id of the site or page where are going to be retrieved the posts
     * @param {Function} callback A callback function executed when the results are ready
     */
    listSitePosts: function (siteId, callback) {
        FB.api(siteId + '/feed', function (response) {
            var posts = response;
            var postsCount = posts.data.length;
            for (var i = 0; i < posts.data.length; i++) {
                var messageFrom = posts.data[i].from.id;
                (function (messageFrom, index) {
                    FB.api(messageFrom + '/picture', function (image) {
                        var post = posts.data[index];
                        postsCount = postsCount - 1;
                        var message = (post.message) ? post.message : ((post.story) ? post.story : null);
                        var fb_data = {
                            message: message,
                            portrait_image: image.data.url
                        };
                        posts.data[index].fb_data = fb_data;
                        if (postsCount == 0) {
                            callback(posts);
                        }
                    });
                })(messageFrom, i);
            }
        });
    },

    _loadFBComponents: function () {
        (function (d) {
            var js, id = 'facebook-jssdk',
                ref = d.getElementsByTagName('script')[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement('script');
            js.id = id;
            js.async = true;
            js.src = "http://connect.facebook.net/en_US/all.js";
            ref.parentNode.insertBefore(js, ref);
        }(document, false));
    },

    _initDataAccess: function () {
        var me = this;
        window.fbAsyncInit = function () {
            me._initFBApi();
            me._checkLogin();
        };
    },

    _initFBApi: function () {
        FB.init({
            appId: this.configuration.fbAppId,
            channelUrl: this.configuration.fbChannelFile,
            status: true,
            cookie: true,
            xfbml: true
        });
    },

    _checkLogin: function () {
        var me = this;
        FB.getLoginStatus(function (response) {
            if (response.status === 'not_authorized' || response.status === 'not_logged_in') {
                me._login();
                return;
            }
            me.configuration.onInit(response);
        });
    },

    _login: function () {
        var me = this;
        FB.login(function (response) {
            me.configuration.onInit(response);
        });
    }


};

Y.FacebookDAO = FacebookDAO;

}, 'gallery-2013.04.03-19-53', {"requires": ["base-build", "base"]});
