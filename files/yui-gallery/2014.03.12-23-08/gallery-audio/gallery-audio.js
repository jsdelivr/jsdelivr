YUI.add('gallery-audio', function(Y) {

/**
 * @module gallery-audio
 */
(function (Y) {
    'use strict';

    var _playable,
    
        _Lang = Y.Lang,
    
        _arraySome = Y.Array.some,
        _createNode = Y.Node.create,
        _isArray = _Lang.isArray,
        _isObject = _Lang.isObject,
        _objectSome = Y.Object.some;

    (function (modernizr) {
        var audioElement,
            modernizrAudio = modernizr && modernizr.audio;
        
        if (modernizrAudio) {
            _playable = {
                m4a: modernizrAudio.m4a,
                mp3: modernizrAudio.mp3,
                ogg: modernizrAudio.ogg,
                wav: modernizrAudio.wav
            };
            return;
        }

        audioElement = Y.config.doc.createElement('audio');

        if (!audioElement.canPlayType) {
            return;
        }
        
        _playable = {
            m4a: audioElement.canPlayType('audio/x-m4a;') || audioElement.canPlayType('audio/aac;'),
            mp3: audioElement.canPlayType('audio/mpeg;'),
            ogg: audioElement.canPlayType('audio/ogg; codecs="vorbis"'),
            wav: audioElement.canPlayType('audio/wav; codecs="1"')
        };
    }(Y.Modernizr || Y.config.win.Modernizr));

    /**
     * @class Audio
     * @static
     */
    
    /**
     * This is a utility method to create an HTML 5 Audio element.  Each browser
     * has a different level of support for playing different audio formats.  If
     * an audio file is hosted in multple formats, this will select the one most
     * likely to play in the current browser.  If the browser does not support
     * any of the available audio formats, null is returned.
     * @method create
     * @param {Object} config The config object has the following optional
     * properties:
     * <dl>
     *     <dt>
     *         autoplay
     *     </dt>
     *     <dd>
     *         Boolean.  If the audio should begin playing immediately.
     *     </dd>
     *     <dt>
     *         baseUrl
     *     </dt>
     *     <dd>
     *         String.  URL of the audio file, minus the extension.  Works
     *         together with the format property to pick the best audio file to
     *         play.
     *     </dd>
     *     <dt>
     *         controls
     *     </dt>
     *     <dd>
     *         Boolean.  If the browser should render a user interface.  (The
     *         audio node must be attached to the DOM for the controls to
     *         appear)
     *     </dd>
     *     <dt>
     *         format
     *     </dt>
     *     <dd>
     *         Array or Object.  List of hosted formats.  Defaults to ['ogg',
     *         'mp3', 'm4a', 'wav'].  The best supported format will be
     *         determined and the file extension will be appended to baseUrl.
     *         If all four formats are not being hosted, only list the formats
     *         that are.  For example, ['mp3', 'ogg'] will not try to find an
     *         m4a or wav file.  If the four formats aren't named the same, or
     *         are hosted at different locations, or have unusual file
     *         extensions, set the baseUrl property to any common URL fragment,
     *         or leave the baseUrl property undefined if there isn't one.  Then
     *         set the format property to an object which has the individual
     *         formats as keys and a strings as values that will be appended to
     *         the baseUrl.  For example, baseUrl could be set to
     *         'http://domain.com/' and format could be set to
     *         {m4a: 'music/file.m4a', mp3: 'mp3s/cool/file.mp4',
     *         ogg: 'vorbis/file.ogg'}
     *     </dd>
     *     <dt>
     *         loop
     *     </dt>
     *     <dd>
     *         Boolean.  If the audio should loop forever.
     *     </dd>
     *     <dt>
     *         preload
     *     </dt>
     *     <dd>
     *         String.  This value should be either 'auto', 'metadata', or
     *         'none'.  Defaults to 'auto'.
     * </dl>
     * @return {Node}
     */
    Y.namespace('Audio').create = function (config) {
        config = config || {};

        var format,
            formats = config.format || [
                'ogg',
                'mp3',
                'm4a',
                'wav'
            ],
            playable,
            source = config.baseUrl || '',
            
            chooseFormat = function (testFormat) {
                var playable = _playable[testFormat];
                
                if (!playable) {
                    return;
                }
                
                if (playable === 'probably') {
                    format = testFormat;
                    return true;
                }
                
                if (!format) {
                    format = testFormat;
                }
            };

        if (_isArray(formats)) {
            _arraySome(formats, chooseFormat);

            if (format) {
                source += '.' + format;
            }
        } else if (_isObject(formats)) {
            _objectSome(formats, function (value, testFormat) {
                return chooseFormat(testFormat);
            });

            if (format) {
                source += formats[format];
            }
        }

        return format && _createNode('<audio ' + (config.autoplay ? 'autoplay="true" ' : '') + (config.controls ? 'controls="true"' : '') + (config.loop ? 'loop="true"' : '') + ' preload="' + (config.preload ? config.preload : 'auto') + '" src="' + source + '" />') || null;
    };
}(Y));


}, 'gallery-2012.06.20-20-07' ,{requires:['node'], optional:['gallery-modernizr']});
