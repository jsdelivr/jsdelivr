//  Underscore.inflection.js
//  (c) 2011 Jeremy Ruppel
//  Underscore.inflection is freely distributable under the MIT license.
//  Portions of Underscore.inflection are inspired or borrowed from ActiveSupport
//  Version 1.0.0

( function( _, undefined )
{
  var
    plurals = [ ],

    singulars = [ ],

    uncountables = [ ];

  /**
   * Inflector
   */
  var inflector = {

    gsub : function( word, rule, replacement )
    {
      var pattern = new RegExp( rule.source || rule, 'gi' );

      return pattern.test( word ) ? word.replace( pattern, replacement ) : null;
    },

    plural : function( rule, replacement )
    {
      plurals.unshift( [ rule, replacement ] );
    },

    pluralize : function( word, count, includeNumber )
    {
      var result;

      if( count !== undefined )
      {
        count = Math.round(count);
        result = ( count === 1 ) ? this.singularize( word ) : this.pluralize( word );
        result = ( includeNumber ) ? [ count, result ].join( ' ' ) : result;
      }
      else
      {
        if( _( uncountables ).include( word ) )
        {
          return word;
        }

        result = word;

        _( plurals ).detect( function( rule )
        {
          var gsub = this.gsub( word, rule[ 0 ], rule[ 1 ] );

          return gsub ? ( result = gsub ) : false;
        },
        this );
      }

      return result;
    },

    singular : function( rule, replacement )
    {
      singulars.unshift( [ rule, replacement ] );
    },

    singularize : function( word )
    {
      if( _( uncountables ).include( word ) )
      {
        return word;
      }

      var result = word;

      _( singulars ).detect( function( rule )
      {
        var gsub = this.gsub( word, rule[ 0 ], rule[ 1 ] );

        return gsub ? ( result = gsub ) : false;
      },
      this );

      return result;
    },

    irregular : function( singular, plural )
    {
      this.plural( '\\b' + singular + '\\b', plural );
      this.singular( '\\b' + plural + '\\b', singular );
    },

    uncountable : function( word )
    {
      uncountables.unshift( word );
    },

    ordinalize : function( number )
    {
      if ( isNaN( number ) )
        return number;

      number = number.toString();
      var lastDigit = number.slice(-1);
      var lastTwoDigits = number.slice(-2);

      if ( lastTwoDigits === "11" || lastTwoDigits === "12" || lastTwoDigits === "13" )
        return number + "th";

      switch ( lastDigit ) {
        case "1":
          return number + "st";
        case "2":
          return number + "nd";
        case "3":
          return number + "rd";
        default:
          return number + "th";
      }
    },

    titleize : function( words )
    {
      if ( typeof words !== "string")
        return words;

      return words.replace( /\S+/g, function( word ) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      } );
    },

    resetInflections : function( )
    {
      plurals      = [ ];
      singulars    = [ ];
      uncountables = [ ];

      this.plural( /$/,                         's'       );
      this.plural( /s$/,                        's'       );
      this.plural( /(ax|test)is$/,              '$1es'    );
      this.plural( /(octop|vir)us$/,            '$1i'     );
      this.plural( /(octop|vir)i$/,             '$1i'     );
      this.plural( /(alias|status)$/,           '$1es'    );
      this.plural( /(bu)s$/,                    '$1ses'   );
      this.plural( /(buffal|tomat)o$/,          '$1oes'   );
      this.plural( /([ti])um$/,                 '$1a'     );
      this.plural( /([ti])a$/,                  '$1a'     );
      this.plural( /sis$/,                      'ses'     );
      this.plural( /(?:([^f])fe|([lr])f)$/,     '$1$2ves' );
      this.plural( /(hive)$/,                   '$1s'     );
      this.plural( /([^aeiouy]|qu)y$/,          '$1ies'   );
      this.plural( /(x|ch|ss|sh)$/,             '$1es'    );
      this.plural( /(matr|vert|ind)(?:ix|ex)$/, '$1ices'  );
      this.plural( /([m|l])ouse$/,              '$1ice'   );
      this.plural( /([m|l])ice$/,               '$1ice'   );
      this.plural( /^(ox)$/,                    '$1en'    );
      this.plural( /^(oxen)$/,                  '$1'      );
      this.plural( /(quiz)$/,                   '$1zes'   );

      this.singular( /s$/,                                                            ''        );
      this.singular( /(n)ews$/,                                                       '$1ews'   );
      this.singular( /([ti])a$/,                                                      '$1um'    );
      this.singular( /((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/, '$1$2sis' );
      this.singular( /(^analy)ses$/,                                                  '$1sis'   );
      this.singular( /([^f])ves$/,                                                    '$1fe'    );
      this.singular( /(hive)s$/,                                                      '$1'      );
      this.singular( /(tive)s$/,                                                      '$1'      );
      this.singular( /([lr])ves$/,                                                    '$1f'     );
      this.singular( /([^aeiouy]|qu)ies$/,                                            '$1y'     );
      this.singular( /(s)eries$/,                                                     '$1eries' );
      this.singular( /(m)ovies$/,                                                     '$1ovie'  );
      this.singular( /(x|ch|ss|sh)es$/,                                               '$1'      );
      this.singular( /([m|l])ice$/,                                                   '$1ouse'  );
      this.singular( /(bus)es$/,                                                      '$1'      );
      this.singular( /(o)es$/,                                                        '$1'      );
      this.singular( /(shoe)s$/,                                                      '$1'      );
      this.singular( /(cris|ax|test)es$/,                                             '$1is'    );
      this.singular( /(octop|vir)i$/,                                                 '$1us'    );
      this.singular( /(alias|status)es$/,                                             '$1'      );
      this.singular( /^(ox)en/,                                                       '$1'      );
      this.singular( /(vert|ind)ices$/,                                               '$1ex'    );
      this.singular( /(matr)ices$/,                                                   '$1ix'    );
      this.singular( /(quiz)zes$/,                                                    '$1'      );
      this.singular( /(database)s$/,                                                  '$1'      );

      this.irregular( 'person', 'people'   );
      this.irregular( 'man',    'men'      );
      this.irregular( 'child',  'children' );
      this.irregular( 'sex',    'sexes'    );
      this.irregular( 'move',   'moves'    );
      this.irregular( 'cow',    'kine'     );

      _( 'equipment information rice money species series fish sheep jeans'.split( /\s+/ ) ).each( function( word )
      {
        this.uncountable( word );
      },
      this );

      return this;
    }

  };

  /**
   * Underscore integration
   */
  _.mixin( inflector.resetInflections( ) );

} )( _ );
