/*
 *  emoticons-js - v1.0.0
 *  A jquery plugin to convert text into emoticons.
 *  
 *
 *  Made by 
 *  Under MIT License
 */
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.

(function ($, window, document, undefined) {

    'use strict';

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    /**
     EXAMPLE USAGE:
     $(function() {
        $(element).emoticons({
          link: true,
          linkTarget: '_blank',
          pdfEmbed:false,
          videoEmbed:true,
          videoWidth   : null,
          videoHeight  : null,
          ytAuthKey    : null,
          highlightCode: true,
          codeLineNumber   : false,
          basicVideoEmbed:true,
          imageEmbed:true

        });
      });

     OPTIONS:
     'link' - true, false  [OPTIONAL] //Instructs the library whether or not to embed urls
     (default value: true)

     'linkTarget' - '_blank' [OPTIONAL] //To make urls open in a new tab
     (default value: '_self')

     'pdfEmbed' - true,false [OPTIONAL] //Instructs the library whether or not to show a preview of pdf links
     (default value : 'false')

     'videoEmbed' - true,false [OPTIONAL] // Instructs the library whether or not to embed youtube/vimeo videos
     (default value : 'true')


     **/

    /* UTILITIES - VARIABLE DECLARATIONS */
    var icons = [{
        'text' : ':)',
        'class': 'smiley',
        'code' : 'e60a'
    }, {
        'text' : ':D',
        'class': 'happy',
        'code' : 'e608'
    }, {
        'text' : ':d',
        'class': 'happy',
        'code' : 'e608'
    }, {
        'text' : ':(',
        'class': 'sad',
        'code' : 'e60e'
    }, {
        'text' : ':/',
        'class': 'wondering',
        'code' : 'e620'

    }, {
        'text' : ':P',
        'class': 'tongue',
        'code' : 'e60c'
    }, {
        'text' : ':p',
        'class': 'tongue',
        'code' : 'e60c'
    }, {
        'text' : ':P',
        'class': 'tongue',
        'code' : 'e60c'
    }, {
        'text' : '3:)',
        'class': 'evil',
        'code' : 'e618'
    }, {
        'text' : '(^)',
        'class': 'thumbsup2',
        'code' : 'e607'
    }, {
        'text' : ';)',
        'class': 'wink',
        'code' : 'e610'
    }, {
        'text' : ':o',
        'class': 'shocked',
        'code' : 'e61a'
    }, {
        'text' : '-_-',
        'class': 'neutral',
        'code' : 'e61e'
    }, {
        'text' : '(y)',
        'class': 'thumbs-up',
        'code' : 'e606'
    }, {
        'text' : ':*',
        'class': 'heart',
        'code' : 'e604'
    }, {
        'text' : '&lt;3',
        'class': 'heart',
        'code' : 'e604'
    }, {
        'text' : '<3',
        'class': 'heart',
        'code' : 'e604'
    }, {
        'text' : '&lt;/3',
        'class': 'heart-broken',
        'code' : 'e605'
    }, {
        'text' : '</3',
        'class': 'heart-broken',
        'code' : 'e605'
    }, {
        'text' : '^_^',
        'class': 'grin',
        'code' : 'e612'
    }, {
        'text' : '8-)',
        'class': 'cool',
        'code' : 'e614'
    }, {
        'text' : '8|',
        'class': 'cool',
        'code' : 'e614'
    }, {
        'text' : ':S',
        'class': 'confused',
        'code' : 'e61c'
    }, {
        'text' : ':s',
        'class': 'confused',
        'code' : 'e61c'
    }];

    var emojiList = [
        'bowtie', 'smile', 'laughing', 'blush', 'smiley', 'relaxed',
        'smirk', 'heart_eyes', 'kissing_heart', 'kissing_closed_eyes', 'flushed',
        'relieved', 'satisfied', 'grin', 'wink', 'stuck_out_tongue_winking_eye',
        'stuck_out_tongue_closed_eyes', 'grinning', 'kissing', 'winky_face',
        'kissing_smiling_eyes', 'stuck_out_tongue', 'sleeping', 'worried',
        'frowning', 'anguished', 'open_mouth', 'grimacing', 'confused', 'hushed',
        'expressionless', 'unamused', 'sweat_smile', 'sweat', 'wow',
        'disappointed_relieved', 'weary', 'pensive', 'disappointed', 'confounded',
        'fearful', 'cold_sweat', 'persevere', 'cry', 'sob', 'joy', 'astonished',
        'scream', 'neckbeard', 'tired_face', 'angry', 'rage', 'triumph', 'sleepy',
        'yum', 'mask', 'sunglasses', 'dizzy_face', 'imp', 'smiling_imp',
        'neutral_face', 'no_mouth', 'innocent', 'alien', 'yellow_heart',
        'blue_heart', 'purple_heart', 'heart', 'green_heart', 'broken_heart',
        'heartbeat', 'heartpulse', 'two_hearts', 'revolving_hearts', 'cupid',
        'sparkling_heart', 'sparkles', 'star', 'star2', 'dizzy', 'boom',
        'collision', 'anger', 'exclamation', 'question', 'grey_exclamation',
        'grey_question', 'zzz', 'dash', 'sweat_drops', 'notes', 'musical_note',
        'fire', 'hankey', 'poop', 'shit', '\\+1', 'thumbsup', '-1', 'thumbsdown',
        'ok_hand', 'punch', 'facepunch', 'fist', 'v', 'wave', 'hand', 'raised_hand',
        'open_hands', 'point_up', 'point_down', 'point_left', 'point_right',
        'raised_hands', 'pray', 'point_up_2', 'clap', 'muscle', 'metal', 'fu',
        'walking', 'runner', 'running', 'couple', 'family', 'two_men_holding_hands',
        'two_women_holding_hands', 'dancer', 'dancers', 'ok_woman', 'no_good',
        'information_desk_person', 'raising_hand', 'bride_with_veil',
        'person_with_pouting_face', 'person_frowning', 'bow', 'couplekiss',
        'couple_with_heart', 'massage', 'haircut', 'nail_care', 'boy', 'girl',
        'woman', 'man', 'baby', 'older_woman', 'older_man',
        'person_with_blond_hair', 'man_with_gua_pi_mao', 'man_with_turban',
        'construction_worker', 'cop', 'angel', 'princess', 'smiley_cat',
        'smile_cat', 'heart_eyes_cat', 'kissing_cat', 'smirk_cat', 'scream_cat',
        'crying_cat_face', 'joy_cat', 'pouting_cat', 'japanese_ogre',
        'japanese_goblin', 'see_no_evil', 'hear_no_evil', 'speak_no_evil',
        'guardsman', 'skull', 'feet', 'lips', 'kiss', 'droplet', 'ear', 'eyes',
        'nose', 'tongue', 'love_letter', 'bust_in_silhouette',
        'busts_in_silhouette', 'speech_balloon', 'thought_balloon', 'feelsgood',
        'finnadie', 'goberserk', 'godmode', 'hurtrealbad', 'rage1', 'rage2',
        'rage3', 'rage4', 'suspect', 'trollface', 'sunny', 'umbrella', 'cloud',
        'snowflake', 'snowman', 'zap', 'cyclone', 'foggy', 'ocean', 'cat', 'dog',
        'mouse', 'hamster', 'rabbit', 'wolf', 'frog', 'tiger', 'koala', 'bear',
        'pig', 'pig_nose', 'cow', 'boar', 'monkey_face', 'monkey', 'horse',
        'racehorse', 'camel', 'sheep', 'elephant', 'panda_face', 'snake', 'bird',
        'baby_chick', 'hatched_chick', 'hatching_chick', 'chicken', 'penguin',
        'turtle', 'bug', 'honeybee', 'ant', 'beetle', 'snail', 'octopus',
        'tropical_fish', 'fish', 'whale', 'whale2', 'dolphin', 'cow2', 'ram', 'rat',
        'water_buffalo', 'tiger2', 'rabbit2', 'dragon', 'goat', 'rooster', 'dog2',
        'pig2', 'mouse2', 'ox', 'dragon_face', 'blowfish', 'crocodile',
        'dromedary_camel', 'leopard', 'cat2', 'poodle', 'paw_prints', 'bouquet',
        'cherry_blossom', 'tulip', 'four_leaf_clover', 'rose', 'sunflower',
        'hibiscus', 'maple_leaf', 'leaves', 'fallen_leaf', 'herb', 'mushroom',
        'cactus', 'palm_tree', 'evergreen_tree', 'deciduous_tree', 'chestnut',
        'seedling', 'blossom', 'ear_of_rice', 'shell', 'globe_with_meridians',
        'sun_with_face', 'full_moon_with_face', 'new_moon_with_face', 'new_moon',
        'waxing_crescent_moon', 'first_quarter_moon', 'waxing_gibbous_moon',
        'full_moon', 'waning_gibbous_moon', 'last_quarter_moon',
        'waning_crescent_moon', 'last_quarter_moon_with_face',
        'first_quarter_moon_with_face', 'moon', 'earth_africa', 'earth_americas',
        'earth_asia', 'volcano', 'milky_way', 'partly_sunny', 'octocat', 'squirrel',
        'bamboo', 'gift_heart', 'dolls', 'school_satchel', 'mortar_board', 'flags',
        'fireworks', 'sparkler', 'wind_chime', 'rice_scene', 'jack_o_lantern',
        'ghost', 'santa', 'christmas_tree', 'gift', 'bell', 'no_bell',
        'tanabata_tree', 'tada', 'confetti_ball', 'balloon', 'crystal_ball', 'cd',
        'dvd', 'floppy_disk', 'camera', 'video_camera', 'movie_camera', 'computer',
        'tv', 'iphone', 'phone', 'telephone', 'telephone_receiver', 'pager', 'fax',
        'minidisc', 'vhs', 'sound', 'speaker', 'mute', 'loudspeaker', 'mega',
        'hourglass', 'hourglass_flowing_sand', 'alarm_clock', 'watch', 'radio',
        'satellite', 'loop', 'mag', 'mag_right', 'unlock', 'lock',
        'lock_with_ink_pen', 'closed_lock_with_key', 'key', 'bulb', 'flashlight',
        'high_brightness', 'low_brightness', 'electric_plug', 'battery', 'calling',
        'email', 'mailbox', 'postbox', 'bath', 'bathtub', 'shower', 'toilet',
        'wrench', 'nut_and_bolt', 'hammer', 'seat', 'moneybag', 'yen', 'dollar',
        'pound', 'euro', 'credit_card', 'money_with_wings', 'e-mail', 'inbox_tray',
        'outbox_tray', 'envelope', 'incoming_envelope', 'postal_horn',
        'mailbox_closed', 'mailbox_with_mail', 'mailbox_with_no_mail', 'door',
        'smoking', 'bomb', 'gun', 'hocho', 'pill', 'syringe', 'page_facing_up',
        'page_with_curl', 'bookmark_tabs', 'bar_chart', 'chart_with_upwards_trend',
        'chart_with_downwards_trend', 'scroll', 'clipboard', 'calendar', 'date',
        'card_index', 'file_folder', 'open_file_folder', 'scissors', 'pushpin',
        'paperclip', 'black_nib', 'pencil2', 'straight_ruler', 'triangular_ruler',
        'closed_book', 'green_book', 'blue_book', 'orange_book', 'notebook',
        'notebook_with_decorative_cover', 'ledger', 'books', 'bookmark',
        'name_badge', 'microscope', 'telescope', 'newspaper', 'football',
        'basketball', 'soccer', 'baseball', 'tennis', '8ball', 'rugby_football',
        'bowling', 'golf', 'mountain_bicyclist', 'bicyclist', 'horse_racing',
        'snowboarder', 'swimmer', 'surfer', 'ski', 'spades', 'hearts', 'clubs',
        'diamonds', 'gem', 'ring', 'trophy', 'musical_score', 'musical_keyboard',
        'violin', 'space_invader', 'video_game', 'black_joker',
        'flower_playing_cards', 'game_die', 'dart', 'mahjong', 'clapper', 'memo',
        'pencil', 'book', 'art', 'microphone', 'headphones', 'trumpet', 'saxophone',
        'guitar', 'shoe', 'sandal', 'high_heel', 'lipstick', 'boot', 'shirt',
        'tshirt', 'necktie', 'womans_clothes', 'dress', 'running_shirt_with_sash',
        'jeans', 'kimono', 'bikini', 'ribbon', 'tophat', 'crown', 'womans_hat',
        'mans_shoe', 'closed_umbrella', 'briefcase', 'handbag', 'pouch', 'purse',
        'eyeglasses', 'fishing_pole_and_fish', 'coffee', 'tea', 'sake',
        'baby_bottle', 'beer', 'beers', 'cocktail', 'tropical_drink', 'wine_glass',
        'fork_and_knife', 'pizza', 'hamburger', 'fries', 'poultry_leg',
        'meat_on_bone', 'spaghetti', 'curry', 'fried_shrimp', 'bento', 'sushi',
        'fish_cake', 'rice_ball', 'rice_cracker', 'rice', 'ramen', 'stew', 'oden',
        'dango', 'egg', 'bread', 'doughnut', 'custard', 'icecream', 'ice_cream',
        'shaved_ice', 'birthday', 'cake', 'cookie', 'chocolate_bar', 'candy',
        'lollipop', 'honey_pot', 'apple', 'green_apple', 'tangerine', 'lemon',
        'cherries', 'grapes', 'watermelon', 'strawberry', 'peach', 'melon',
        'banana', 'pear', 'pineapple', 'sweet_potato', 'eggplant', 'tomato', 'corn',
        'house', 'house_with_garden', 'school', 'office', 'post_office', 'hospital',
        'bank', 'convenience_store', 'love_hotel', 'hotel', 'wedding', 'church',
        'department_store', 'european_post_office', 'city_sunrise', 'city_sunset',
        'japanese_castle', 'european_castle', 'tent', 'factory', 'tokyo_tower',
        'japan', 'mount_fuji', 'sunrise_over_mountains', 'sunrise', 'stars',
        'themoreyouknow', 'tmyk',
        'statue_of_liberty', 'bridge_at_night', 'carousel_horse', 'rainbow',
        'ferris_wheel', 'fountain', 'roller_coaster', 'ship', 'speedboat', 'boat',
        'sailboat', 'rowboat', 'anchor', 'rocket', 'airplane', 'helicopter',
        'steam_locomotive', 'tram', 'mountain_railway', 'bike', 'aerial_tramway',
        'suspension_railway', 'mountain_cableway', 'tractor', 'blue_car',
        'oncoming_automobile', 'car', 'red_car', 'taxi', 'oncoming_taxi',
        'articulated_lorry', 'bus', 'oncoming_bus', 'rotating_light', 'police_car',
        'oncoming_police_car', 'fire_engine', 'ambulance', 'minibus', 'truck',
        'train', 'station', 'train2', 'bullettrain_front', 'bullettrain_side',
        'light_rail', 'monorail', 'railway_car', 'trolleybus', 'ticket', 'fuelpump',
        'vertical_traffic_light', 'traffic_light', 'warning', 'construction',
        'beginner', 'atm', 'slot_machine', 'busstop', 'barber', 'hotsprings',
        'checkered_flag', 'crossed_flags', 'izakaya_lantern', 'moyai',
        'circus_tent', 'performing_arts', 'round_pushpin',
        'triangular_flag_on_post', 'jp', 'kr', 'cn', 'us', 'fr', 'es', 'it', 'ru',
        'gb', 'uk', 'de', 'one', 'two', 'three', 'four', 'five', 'six', 'seven',
        'eight', 'nine', 'keycap_ten', '1234', 'zero', 'hash', 'symbols',
        'arrow_backward', 'arrow_down', 'arrow_forward', 'arrow_left',
        'capital_abcd', 'abcd', 'abc', 'arrow_lower_left', 'arrow_lower_right',
        'arrow_right', 'arrow_up', 'arrow_upper_left', 'arrow_upper_right',
        'arrow_double_down', 'arrow_double_up', 'arrow_down_small',
        'arrow_heading_down', 'arrow_heading_up', 'leftwards_arrow_with_hook',
        'arrow_right_hook', 'left_right_arrow', 'arrow_up_down', 'arrow_up_small',
        'arrows_clockwise', 'arrows_counterclockwise', 'rewind', 'fast_forward',
        'information_source', 'ok', 'twisted_rightwards_arrows', 'repeat',
        'repeat_one', 'new', 'top', 'up', 'cool', 'free', 'ng', 'cinema', 'koko',
        'signal_strength', 'u5272', 'u5408', 'u55b6', 'u6307', 'u6708', 'u6709',
        'u6e80', 'u7121', 'u7533', 'u7a7a', 'u7981', 'sa', 'restroom', 'mens',
        'womens', 'baby_symbol', 'no_smoking', 'parking', 'wheelchair', 'metro',
        'baggage_claim', 'accept', 'wc', 'potable_water', 'put_litter_in_its_place',
        'secret', 'congratulations', 'm', 'passport_control', 'left_luggage',
        'customs', 'ideograph_advantage', 'cl', 'sos', 'id', 'no_entry_sign',
        'underage', 'no_mobile_phones', 'do_not_litter', 'non-potable_water',
        'no_bicycles', 'no_pedestrians', 'children_crossing', 'no_entry',
        'eight_spoked_asterisk', 'eight_pointed_black_star', 'heart_decoration',
        'vs', 'vibration_mode', 'mobile_phone_off', 'chart', 'currency_exchange',
        'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpius',
        'sagittarius', 'capricorn', 'aquarius', 'pisces', 'ophiuchus',
        'six_pointed_star', 'negative_squared_cross_mark', 'a', 'b', 'ab', 'o2',
        'diamond_shape_with_a_dot_inside', 'recycle', 'end', 'on', 'soon', 'clock1',
        'clock130', 'clock10', 'clock1030', 'clock11', 'clock1130', 'clock12',
        'clock1230', 'clock2', 'clock230', 'clock3', 'clock330', 'clock4',
        'clock430', 'clock5', 'clock530', 'clock6', 'clock630', 'clock7',
        'clock730', 'clock8', 'clock830', 'clock9', 'clock930', 'heavy_dollar_sign',
        'copyright', 'registered', 'tm', 'x', 'heavy_exclamation_mark', 'bangbang',
        'interrobang', 'o', 'heavy_multiplication_x', 'heavy_plus_sign',
        'heavy_minus_sign', 'heavy_division_sign', 'white_flower', '100',
        'heavy_check_mark', 'ballot_box_with_check', 'radio_button', 'link',
        'curly_loop', 'wavy_dash', 'part_alternation_mark', 'trident',
        'black_square', 'white_square', 'white_check_mark', 'black_square_button',
        'white_square_button', 'black_circle', 'white_circle', 'red_circle',
        'large_blue_circle', 'large_blue_diamond', 'large_orange_diamond',
        'small_blue_diamond', 'small_orange_diamond', 'small_red_triangle',
        'small_red_triangle_down', 'shipit'
    ];

    /* VARIABLE DECLARATIONS */
    var pluginName = 'emoticons',
        defaultOptions = {
            link           : true,
            linkTarget     : '_self',
            pdfEmbed       : true,
            imageEmbed     :true,
            audioEmbed     : false,
            videoEmbed     : true,
            basicVideoEmbed: true,
            videoWidth     : null,
            videoHeight    : null,
            ytAuthKey      : null,
            highlightCode  : true
        };
    /* ENDS */

    //Global Variables

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;
        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $.extend(defaultOptions, options);
        this._defaults = defaultOptions;
        this._name = pluginName;
        this.init(this.settings, this.element);
    }

    var video = {};

    /* UTILITIES - FUNCTIONS */

    String.prototype.trunc =
        function (n, useWordBoundary) {
            var toLong = this.length > n,
                s_ = toLong ? this.substr(0, n - 1) : this;
            s_ = useWordBoundary && toLong ? s_.substr(0, s_.lastIndexOf(' ')) : s_;
            return toLong ? s_ + '...' : s_;
        };

    /**
     * FUNCTION insertfontSmiley
     * @description
     * Coverts the text into font emoticons
     *
     * @param  {string} str
     *
     * @return {string}
     */

    function insertfontSmiley(str) {
        var a = str.split(' ');
        icons.forEach(function (icon) {
            for (var i = 0; i < a.length; i++) {
                if (a[i] === icon.text) {
                    a[i] = '<span class="icon-emoticon" title="' + icon.text + '">' + '&#x' + icon.code + '</span>';
                }
            }
        });
        return a.join(' ');
    }

    /**
     * FUNCTION UrlEmbed
     * @description
     * Converts normal links written in the text into html anchor tags.
     *
     * @param  {string} text
     *
     * @return {string}
     */
    function urlEmbed(str) {
        var urlRegex = /((href|src)=["']|)(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        var strReplaced = str.replace(urlRegex, function (match) {
                return '<a href="' + match + '" target="' + defaultOptions.linkTarget + '">' + match + '</a>';
            }
        );
        return strReplaced;
    }

    /**
     * FUNCTION insertEmoji
     *
     * @description
     * Converts text into emojis
     *
     * @param  {string} str
     *
     * @return {string}
     */
    function insertEmoji(str) {
        var emojiRegex = new RegExp(':(' + emojiList.join('|') + '):', 'g');
        return str.replace(emojiRegex, function (match, text) {
            return '<span class="emoticon emoticon-' + text + '" title=":' + text + ':"></span>';
        });
    }

    var videoTemplate = '';

    function initVideoTemplate() {
        videoTemplate = '<div class="ejs-video"><div class="ejs-video-preview">' +
        '        <div class="ejs-video-thumb">' +
        '            <img src="' + video.thumbnail + '" alt="' + video.host + '/' + video.id + '"/>' +
        '            <i class="fa fa-play-circle-o"></i>' +
        '        </div>' +
        '        <div class="ejs-video-detail">' +
        '            <div class="ejs-video-title">' +
        '                <a href="' + video.url + '">' + video.title + '</a>' +
        '            </div>' +
        '            <div class="ejs-video-desc">' + video.description +
        '            </div>' +
        '            <div class="ejs-video-stats">' +
        '                <span><i class="fa fa-eye"></i> ' + video.views + '</span>' +
        '                <span><i class="fa fa-heart"></i> ' + video.likes + '</span>' +
        '            </div>' +
        '        </div>' +
        '    </div></div>';
    }

    var videoProcess = {

        dimensions: function (options) {
            var dimensions = {
                'width' : null,
                'height': null
            };
            dimensions.width = options.videoWidth;
            dimensions.height = options.videoHeight;

            if (options.videoHeight && options.videoWidth) {
                return dimensions;
            }
            else if (options.videoHeight) {
                dimensions.width = ((options.videoHeight) / 390) * 640;
                return dimensions;
            }
            else if (options.videoWidth) {
                dimensions.height = ((dimensions.width) / 640) * 390;
                return dimensions;
            }
            else {
                dimensions.width = 640;
                dimensions.height = 390;
                return dimensions;
            }
        },

        play : function (elem) {
            $(elem).undelegate('click').on('click', '.ejs-video-thumb', function (e) {

                console.log(this);
                var videoInfo = {};
                var videoDetails = $(this).find('img')[0].alt.split('/');

                if (videoDetails[0] == 'vimeo') {
                    videoInfo.url = 'https://player.vimeo.com/video/' + videoDetails[1] + '?title=0&byline=0&portrait=0&autoplay=1';
                }
                else if (videoDetails[0] == 'youtube') {
                    videoInfo.url = 'https://www.youtube.com/embed/' + videoDetails[1] + '?autoplay=1&rel=0';
                }

                var videoPlayerTemplate = '<div class="ejs-video-player"><iframe src="' + videoInfo.url + '" frameBorder="0" width="' + video.width + '" height="' + video.height + '" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>';

                $(this).parent().html(videoPlayerTemplate);
                e.stopPropagation();

            });
        },
        embed: function (data, opts) {
            var ytRegex = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/ytscreeningroom\?v=|\/feeds\/api\/videos\/|\/user\S*[^\w\-\s]|\S*[^\w\-\s]))([\w\-]{11})[?=&+%\w-]*/gi;
            var vimeoRegex = /https?:\/\/(?:www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)*/gi;
            var videoDimensions = this.dimensions(opts);
            var deferred = $.Deferred();
            var returnedData;
            if (data.match(ytRegex)) {
                $.getJSON('https://www.googleapis.com/youtube/v3/videos?id=' + RegExp.$1 + '&key=' + opts.ytAuthKey + '&part=snippet,statistics')
                    .success(function (d) {
                        var ytData = d.items[0];
                        video.host = 'youtube';
                        video.title = ytData.snippet.title;
                        video.thumbnail = ytData.snippet.thumbnails.medium.url;
                        video.description = (ytData.snippet.description.trunc(250, true)).replace(/\n/g, ' ').replace(/&#10;/g, ' ');
                        video.rawDescription = ytData.snippet.description;
                        video.views = ytData.statistics.viewCount;
                        video.likes = ytData.statistics.likeCount;
                        video.uploader = ytData.snippet.channelTitle;
                        video.uploaderPage = 'https://www.youtube.com/channel/' + ytData.snippet.channelId;
                        video.uploadDate = ytData.snippet.publishedAt;
                        video.url = 'https://www.youtube.com/watch?v=' + RegExp.$1;
                        video.embedSrc = 'https://www.youtube.com/embed/' + RegExp.$1 + '?autoplay=1';
                        video.width = videoDimensions.width;
                        video.height = videoDimensions.height;
                        video.id = ytData.id;
                        initVideoTemplate();
                        data = data + videoTemplate;
                        returnedData = data;
                        deferred.resolve(returnedData);

                    });
            }
            else if (data.match(vimeoRegex)) {
                $.getJSON('https://vimeo.com/api/v2/video/' + RegExp.$3 + '.json')
                    .success(function (d) {

                        video.host = 'vimeo';
                        video.title = d[0].title;
                        video.rawDescription = (d[0].description).replace(/\n/g, '<br/>').replace(/&#10;/g, '<br/>');
                        video.description = (d[0].description).replace(/((<|&lt;)br\s*\/*(>|&gt;)\r\n)/g, ' ').trunc(250, true);
                        video.thumbnail = d[0].thumbnail_medium;
                        video.views = d[0].stats_number_of_plays;
                        video.likes = d[0].stats_number_of_likes;
                        video.uploader = d[0].user_name;
                        video.uploaderPage = d[0].user_url;
                        video.uploadDate = d[0].uploadDate;
                        video.url = d[0].url;
                        video.embedSrc = '//player.vimeo.com/video/' + RegExp.$3 + '?title=0&byline=0&portrait=0&autoplay=1';
                        video.width = videoDimensions.width;
                        video.height = videoDimensions.height;
                        video.id = d[0].id;
                        initVideoTemplate();
                        returnedData = data + videoTemplate;
                        deferred.resolve(returnedData);

                    });
            }
            else {
                returnedData = data;
                deferred.resolve(returnedData);
            }

            return deferred.promise();

        },

        basicVideoTemplate: function (url) {
            var template = '<div class="ejs-video">' +
                '    <div class="ejs-video-player">' +
                '        <div class="player">' +
                '            <video src="' + url + '" controls></video>' +
                '        </div>' +
                '    </div>' +
                '</div>';

            return template;
        },

        embedBasic: function (str) {
            var basicVideoRegex = /((?:https?):\/\/\S*\.(?:ogv|webm|mp4))/gi;

            if (str.match(basicVideoRegex)) {
                var template = this.basicVideoTemplate(RegExp.$1);
                str = str + template;
            }
            return str;
        }
    };

    var pdfProcess = {
        embed: function (str) {
            var p = /((?:https?):\/\/\S*\.(?:pdf|PDF))/gi;
            if (str.match(p)) {
                var pdfUrl = RegExp.$1;

                var pdfTemplate = '<div class="ejs-pdf">' +
                    ' <div class="ejs-pdf-preview">' +
                    '<div class="ejs-pdf-icon">' +
                    '<i class="fa fa-file-pdf-o"></i>' +
                    '</div>' +
                    '<div class="ejs-pdf-detail" ><div class="ejs-pdf-title"> <a href="">' + pdfUrl + '</a></div> <div class="ejs-pdf-view"> <button><i class="fa fa-download"></i> <a href="' + pdfUrl + '" target="_blank">Download</a></button> <button class="ejs-pdf-view-active"><i class="fa fa-eye"></i> View PDF</button></div> </div> </div></div>';

                str = str + pdfTemplate;

            }
            return str;
        },

        view: function (elem) {
            $(elem).on('click', '.ejs-pdf-view-active', function (e) {
                var pdfParent = $(this).closest('.ejs-pdf');
                var pdfUrl = $(pdfParent).find('a')[1].href;
                var pdfViewTemplate = ' <div class="ejs-pdf-viewer"><iframe src="' + pdfUrl + '" frameBorder="0"></iframe></div>';
                pdfParent.html(pdfViewTemplate);
                e.stopPropagation();
            });
        }
    };

    var codeProcess = {
        encodeCode: function (c) {
            // c = c.replace(/\&/gm, '&amp;');
            c = c.replace(/</gm, '&lt;');
            c = c.replace(/>/gm, '&gt;');
            return c;
        },

        highlight: function (text) {
            if (!window.hljs) {
                throw 'hljs is not defined';
                return;
            }
            var that = this;
            text = text.replace(/(`+)(\s|[a-z]+)\s*([\s\S]*?[^`])\s*\1(?!`)/gm,
                function (wholeMatch, m1, m2, m3) {
                    var c = m3;
                    c = c.replace(/^([ \t]*)/g, ""); // leading whitespace
                    c = c.replace(/[ \t]*$/g, ""); // trailing whitespace
                    c = that.encodeCode(c);
                    c = c.replace(/:\/\//g, "~P"); // to prevent auto-linking. Not necessary in code
                    // *blocks*, but in code spans. Will be converted
                    // back after the auto-linker runs.

                    return '<pre><code class="ejs-code ' + m2 + '">' + c + '</code></pre>';
                }
            );
            return text;
        }

    };

    var audioProcess = {
        embed: function (str) {
            var a = /((?:https?):\/\/\S*\.(?:wav|mp3|ogg))/gi;
            if (str.match(a)) {
                var audioUrl = RegExp.$1;

                var audioTemplate = '<div class="ejs-audio"><audio src="' + audioUrl + '" controls></audio></div>';

                str = str + audioTemplate;
            }
            return str;
        }
    };

    var imageProcess = {
        template: function (url) {
            var t = '<div class="ejs-image">' +
                '    <div class="ne-image-wrapper">' +
                '        <img src="' + url + '"/>' +
                '    </div>' +
                '</div>';

            return t;

        },
        embed   : function (str) {
            var i = /((?:https?):\/\/\S*\.(?:gif|jpg|jpeg|tiff|png|svg|webp))/gi;
            if (str.match(i)) {
                var template = this.template(RegExp.$1);
                str=str+template;
            }
            return str;
        }
    }

    function _driver(elem) {
        elem.each(function () {
            var input = $(this).html();
            if (input === undefined || input === null) {
                return;
            }
            if (typeof input === 'object') {
                return input;
            }

            var that = this;
            input = (defaultOptions.link) ? urlEmbed(input) : input;
            input = insertfontSmiley(input);
            input = insertEmoji(input);
            input = (defaultOptions.pdfEmbed) ? pdfProcess.embed(input) : input;
            input = (defaultOptions.audioEmbed) ? audioProcess.embed(input) : input;
            input = (defaultOptions.highlightCode) ? codeProcess.highlight(input) : input;
            input = (defaultOptions.basicVideoEmbed) ? videoProcess.embedBasic(input) : input;
            input = (defaultOptions.imageEmbed) ? imageProcess.embed(input) : input;
            $(that).html(input);
            if (defaultOptions.highlightCode) {
                if(!window.hljs){
                    throw 'hljs is not defined';
                }
                else {
                    $(that).find('.ejs-code').each(function () {
                        hljs.highlightBlock(this);
                    });
                    input=$(that).html();
                }
            }
            if (defaultOptions.videoEmbed) {
                $.when(videoProcess.embed(input, defaultOptions)).then(
                    function (d) {
                        $(that).html(d);
                    }
                );

            }



        });

        videoProcess.play(elem, defaultOptions);
        pdfProcess.view(elem);

    }

    /* ENDS */

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        init: function (settings, element) {
            _driver($(element).find('div'));
        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);
