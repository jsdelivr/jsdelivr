YUI.add('gallery-facebook-like-button', function(Y) {

/**
 * YUI 3 Facebook Like Button Module
 * @module gallery-facebook-like-button
 */
Y.namespace('Facebook.LikeButton');
/**
 * @class Facebook.LikeButton
 */
Y.Facebook.LikeButton = function() {
    var _srcBase = 'http://www.facebook.com/plugins/like.php',
        _frame = '<iframe scrolling="no" frameborder="0" style="border:none;overflow:hidden;height:80px" allowTransparency="true"></iframe>',
        _defaultConfig = {
            href: location.href,
            layout: 'standard',
            showfaces: 'true',
            width: '450',
            action: 'like',
            font: '',
            colorscheme: 'light'
        };
    function _applyConfig(config) {
        var returnConfig = {};
        Y.each(_defaultConfig, function(value, key) {
            if (Y.Object.hasKey(config, key)) {
                returnConfig[key] = config[key];
            } else {
                returnConfig[key] = value;
            }
        });
        return returnConfig;
    }
    function _createFrame(config) {
        var frame = Y.Node.create(_frame);
        frame.set('src', _srcBase + '?' + Y.QueryString.stringify(config))
             .setStyle('width', config.width + 'px');
        return frame;
    }
    return {
        /**
         * @static
         * @for Facebook.LikeButton
         * @method add
         * @param {string | HTMLElement} node a node or Selector
         * @param {object} acceptConfig the attributes of like button:
         *  <ul>
         *   <li>href: the URL to like. defaults to the current page.</li>
         *   <li>layout: there are three options: 'standard', 'button_count', 'box_count'.</li>
         *   <li>show_faces: specifies whether to display profile photos below the button (standard layout only).</li>
         *   <li>width: the width of the Like button.</li>
         *   <li>action: the verb to display on the button. Options: 'like', 'recommend'.</li>
         *   <li>font: the font to display in the button. Options: 'arial', 'lucida grande', 'segoe ui', 'tahoma', 'trebuchet ms', 'verdana'.</li>
         *   <li>colorscheme: the color scheme for the like button. Options: 'light', 'dark'.</li>
         *  </ul>
         * @return {boolean} true if success, false if failed.
         */
        add: function(node, acceptConfig) {
            var node = Y.one(node),
                config = {},
                frame;
            if (!node) {
                return false;
            }
            if (Y.Lang.isObject(acceptConfig) && !Y.Object.isEmpty(acceptConfig)) {
                config = _applyConfig(acceptConfig);
            } else {
                config = _defaultConfig;
            }
            frame = _createFrame(config);
            node.appendChild(frame);
            return true;
        }
    };
}();


}, 'gallery-2011.01.18-21-05' ,{requires:['node','querystring']});
