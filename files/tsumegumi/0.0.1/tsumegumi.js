/*!
  * tsumegumi.js - Derivative and modified work from Takayuki Fukatsu
  * CC BY 4.0 - https://creativecommons.org/licenses/by/4.0/
  */
(function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else context[name] = definition()
})('tsumegumi', this, function () {


    function Kernify( options ) {

        options = options || {};

        var models      = {}
          , views       = {}
          , controllers = {};

        models.kerningInfo = options.kerningInfo || {
            //前後の文字をワイルドカード指定した汎用のカーニングペア
            '*う': -0.03
          , 'う*': -0.02
          , '*く': -0.075
          , 'く*': -0.075
          , '*し': -0.075
          , 'し*"': -0.075
          , '*ぁ': -0.05
          , 'ぁ*': -0.075
          , '*ぃ': -0.05
          , 'ぃ*': -0.075
          , '*ィ': -0.25
          , 'ィ*': -0.2
          , '*ぅ': -0.05
          , 'ぅ*': -0.075
          , '*ぇ': -0.05
          , 'ぇ*': -0.075
          , '*ぉ': -0.05
          , 'ぉ*': -0.075
          , '*っ': -0.075
          , 'っ*': -0.075
          , '*ゃ': -0.05
          , 'ゃ*': -0.075
          , '*ゅ': -0.05
          , 'ゅ*': -0.075
          , '*ょ': -0.075
          , 'ょ*': -0.075
          , '*ト': -0.075
          , 'ト*': -0.075
          , '*ド': -0.075
          , 'ド*': -0.075
          , '*リ': -0.075
          , 'リ*': -0.075
          , '*ッ': -0.05
          , 'ッ*': -0.075
          , 'ャ*': -0.05
          , '*ャ': -0.05
          , 'ュ*': -0.05
          , '*ュ': -0.05
          , 'ョ*': -0.08
          , '*ョ': -0.08
          , '*「': -0.25
          , '」*': -0.25
          , '*（': -0.25
          , '）*': -0.25
          , '、*': -0.25
          , '。*': -0.25
          , '・*': -0.25
          , '*・': -0.25
          , '*：': -0.25
          , '：*': -0.25
          // 直接指定のカーニングペア
          , 'して': -0.12
          , 'す。': -0.15
          , 'タク': -0.12
          , 'タグ': -0.12
          , 'ット': -0.2
          , 'ラム': -0.1
          , 'プル': -0.1
          , 'ンプ': -0.15
          , 'ング': -0.05
          , 'ード': -0.15
          , '」「"': -0.75
          , '」。"': -0.25
          , '」、"': -0.25
          , '、「"': -0.75
          , '。「"': -0.75
          , '、『"': -0.75
          , '。『"': -0.75
          , '、（"': -0.75
          , '。（"': -0.75
          // 1文字は行頭専用のカーニングペア
          , '「': -0.5
          , '『': -0.5
          , '（': -0.5
          , '【': -0.5
          , '“': -0.5
        };

        models.latinReplace = function( str ) {
            var html = [];
            if ( ! str || ! str.length ) {
                return '';
            }
            for ( var i=0, n = str.length; i < n; i++ ) {
                if ( str[ i ] === ' ' ) {
                    html.push( '<span class="blank"></span> ' ); // Dummy Blank to Preserve Copy-Paste
                }
                else {
                    html.push([
                        '<span class="chracter r'
                      , Math.floor(Math.random() * (options.max - options.min)) + options.min
                      , '">'
                      , str[ i ]
                      , '</span>'
                    ].join(''));
                }
            }
            return html.join( '' );
        };


        models.glyphReplace = function( str ) {
            if ( ! str || ! str.length ) {
              return '';
            }
            var html = [];
            // Inspired by Takayuki Fukatsu Autokerning Experiment
            // http://fladdict.net/blog/2011/02/auto-kerning.html
            // Working demo http://fladdict.net/exp/autokerning/
            for ( var i = 0, n = str.length, kerningInfo = models.kerningInfo; i < n; i++ ) {
            		var char1 = str.substr( i, 1 );
            		if ( char1 === ' ' ) {
              		  html.push( '<span class="blank"></span> ' );
              		  continue;
            		}
            		var char2 = '<span class="character r' + ( Math.floor(Math.random() * (options.max - options.min)) + options.min ) + '">' + char1 + '</span>'
            		  , nextChar = str.substr( i+1, 1 )
            		  , space = 0;
                if ( nextChar !== '' && kerningInfo[ char1 + nextChar ] ) {
            				//明示的なカーニングペアの処理
            				space = kerningInfo[ char1 + nextChar ];
            		}
            		else {
            				//汎用カーニングペアの処理
            				if ( kerningInfo[ char1 + "*" ] ) {
            						space += kerningInfo[ char1 + "*" ];
                    }
            				if ( kerningInfo[ "*" + nextChar] ) {
            						space += kerningInfo[ "*" + nextChar ];
                    }
            		}
                if ( space != 0 )  {
            					char2 = '<span class="group" style="letter-spacing:' + space + 'em">' + char1 + '</span>';
                }			
                //行頭約物の処理
            		if ( i == 0 && kerningInfo[ char1 ] ) {
            				char2 = '<span class="character" style="margin-left:' + kerningInfo[ char1 ] + 'em"></span>' + char2;
                }
            		html.push( char2 );
            }
            return html.join( '' );
        };


        views.traverseNode = function( isLatin ) {
            return function( node ) {
                // Inspired by James Padolsey text dom replace solution (old one)
                // http://james.padolsey.com/javascript/replacing-text-in-the-dom-its-not-that-simple/
                var next;
                if ( node.nodeType === 1 ) {
                    if ( node = node.firstChild ) {
                        do {
                            next = node.nextSibling;
                            if ( ! /input|select|textarea|code|pre/.test( ( node.tagName || '' ).toLowerCase() ) ) {
                                views.traverseNode( node );
                            }
                        } while ( node = next );
                    }
                } else if ( node.nodeType === 3 ) {
                    var str = node.data || '';
                    str = str.replace( /^\s+$/g, '' );
                    str = str.replace( /\r\n|\r|\n/g, '' );
                    str = str.replace( /\s+/g, ' ' );
                    if ( ! isLatin ) {
                        str = models.glyphReplace( str );
                    }
                    else {
                        str = models.latinReplace( str );
                    }
                    if ( ! str.length ) {
                        node.parentNode.removeChild( node );
                        return;
                    }
                    var buffer = document.createElement( 'div' );
                    buffer.innerHTML = str;
                    while ( buffer.firstChild ) {
                        node.parentNode.insertBefore( buffer.firstChild, node );
                    }
                    node.parentNode.removeChild( node );
                }
            };
        }( ! /ja|zh|ko/.test( [ document.documentElement.lang || '', document.documentElement.className || '' ].join( ' ' ) ) );


        controllers.init = function( el ) {
            if ( ! el ) {
                return false;
            }
            if ( el.length ) {
                for ( var i = 0; i < el.length; i++ ) {
                    views.traverseNode( el[ i ] );
                }
            }
            else {
                views.traverseNode( el );
            }
        };

        options.min = options.min && isNaN( options.min ) ? -5 : options.min;
        options.max = options.max && isNaN( options.max ) ? 5 : options.max;
        controllers.init( options ? options.node ? options.node : options : 0 );

        return {
            update: function( el ) {
              controllers.init( el || 0 );
            }
        };

    }


    return function( kernOptions ) {
        return new Kernify( kernOptions );
    };

});