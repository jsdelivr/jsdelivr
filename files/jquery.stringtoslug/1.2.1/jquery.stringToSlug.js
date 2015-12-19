/*
 * jQuery stringToSlug plug-in 1.2.1
 *
 * Plugin HomePage http://leocaseiro.com.br/jquery-plugin-string-to-slug/
 *
 * Copyright (c) 2009 Leo Caseiro
 * 
 * Based on Edson Hilios (http://www.edsonhilios.com.br/ Algoritm
 * 
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

jQuery.fn.stringToSlug = function(options) {
	var defaults = {
 		setEvents: 'keyup keydown blur', //set Events that your script will work
		getPut: '#permalink', //set output field
		space: '-', //Sets the space character. If the hyphen,
		prefix: '',
		suffix: '',
		replace: '' //Sample: /\s?\([^\)]*\)/gi
	};
	
	var opts = jQuery.extend(defaults, options);

	jQuery(this).bind(defaults.setEvents, function () {
		var text = jQuery(this).val();
		text = defaults.prefix + text + defaults.suffix; //Concatenate with prefix and suffix		
		text = text.replace(defaults.replace, ""); //replace
		text = jQuery.trim(text.toString()); //Remove side spaces and convert to String Object
		
		var chars = []; //Cria vetor de caracteres
		for (var i = 0; i < 32; i++) {
			chars.push ('');
		}	
		
		/*** Abaixo a lista de caracteres ***/
		chars.push (defaults.space); // Unicode 32
		chars.push ('');   // !
		chars.push ('');   // "
		chars.push ('');   // #
		chars.push ('');   // $
		chars.push ('');   // %
		chars.push ('');   // &
		chars.push ("");   // '
		chars.push (defaults.space);  // (
		chars.push (defaults.space);  // ); 
		chars.push ('');   // *
		chars.push ('');   // +
		chars.push (defaults.space);  // ); 
		chars.push (defaults.space);  // -
		chars.push (defaults.space);  // .
		chars.push (defaults.space);  // /
		chars.push ('0');  // 0
		chars.push ('1');  // 1
		chars.push ('2');  // 2
		chars.push ('3');  // 3
		chars.push ('4');  // 4
		chars.push ('5');  // 5
		chars.push ('6');  // 6
		chars.push ('7');  // 7
		chars.push ('8');  // 8
		chars.push ('9');  // 9
		chars.push ('');   // :
		chars.push ('');   // ;
		chars.push ('');   // <
		chars.push ('');   // =
		chars.push ('');   // >
		chars.push ('');   // ?
		chars.push ('');   // @
		chars.push ('A');  // A
		chars.push ('B');  // B
		chars.push ('C');  // C
		chars.push ('D');  // D
		chars.push ('E');  // E
		chars.push ('F');  // F
		chars.push ('G');  // G
		chars.push ('H');  // H
		chars.push ('I');  // I
		chars.push ('J');  // J
		chars.push ('K');  // K
		chars.push ('L');  // L
		chars.push ('M');  // M
		chars.push ('N');  // N
		chars.push ('O');  // O
		chars.push ('P');  // P
		chars.push ('Q');  // Q
		chars.push ('R');  // R
		chars.push ('S');  // S
		chars.push ('T');  // T
		chars.push ('U');  // U
		chars.push ('V');  // V
		chars.push ('W');  // W
		chars.push ('X');  // X
		chars.push ('Y');  // Y
		chars.push ('Z');  // Z
		chars.push (defaults.space);  // [
		chars.push (defaults.space);  // /
		chars.push (defaults.space);  // ]
		chars.push ('');   // ^
		chars.push (defaults.space);  // _
		chars.push ('');   // `
		chars.push ('a');  // a
		chars.push ('b');  // b
		chars.push ('c');  // c
		chars.push ('d');  // d
		chars.push ('e');  // e
		chars.push ('f');  // f
		chars.push ('g');  // g
		chars.push ('h');  // h
		chars.push ('i');  // i
		chars.push ('j');  // j
		chars.push ('k');  // k
		chars.push ('l');  // l
		chars.push ('m');  // m
		chars.push ('n');  // n
		chars.push ('o');  // o
		chars.push ('p');  // p
		chars.push ('q');  // q
		chars.push ('r');  // r
		chars.push ('s');  // s
		chars.push ('t');  // t
		chars.push ('u');  // u
		chars.push ('v');  // v
		chars.push ('w');  // w
		chars.push ('x');  // x
		chars.push ('y');  // y
		chars.push ('z');  // z
		chars.push (defaults.space);  // {
		chars.push ('');   // |
		chars.push (defaults.space);  // }
		chars.push ('');   // ~
		chars.push ('');   // ?
		chars.push ('C'); 
		chars.push ('A'); 
		chars.push (''); 
		chars.push ('f'); 
		chars.push (''); 
		chars.push (''); 
		chars.push ('T'); 
		chars.push ('t'); 
		chars.push (''); 
		chars.push (''); 
		chars.push ('S'); 
		chars.push (''); 
		chars.push ('CE'); 
		chars.push ('A'); 
		chars.push ('Z'); 
		chars.push ('A'); 
		chars.push ('A'); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (defaults.space); 
		chars.push (defaults.space); 
		chars.push (''); 
		chars.push ('TM'); 
		chars.push ('s'); 
		chars.push (''); 
		chars.push ('ae'); 
		chars.push ('A'); 
		chars.push ('z'); 
		chars.push ('Y'); 
		chars.push (''); 
		chars.push (''); 
		chars.push ('c'); 
		chars.push ('L'); 
		chars.push ('o'); 
		chars.push ('Y'); 
		chars.push (''); 
		chars.push ('S'); 
		chars.push (''); 
		chars.push ('c'); 
		chars.push ('a'); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push ('r'); 
		chars.push (defaults.space); 
		chars.push ('o'); 
		chars.push (''); 
		chars.push ('2'); 
		chars.push ('3'); 
		chars.push (''); 
		chars.push ('u'); 
		chars.push ('p'); 
		chars.push (''); 
		chars.push (''); 
		chars.push ('1'); 
		chars.push ('o'); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push ('A'); 
		chars.push ('A'); 
		chars.push ('A'); 
		chars.push ('A'); 
		chars.push ('A'); 
		chars.push ('A'); 
		chars.push ('AE'); 
		chars.push ('C'); 
		chars.push ('E'); 
		chars.push ('E'); 
		chars.push ('E'); 
		chars.push ('E'); 
		chars.push ('I'); 
		chars.push ('I'); 
		chars.push ('I'); 
		chars.push ('I'); 
		chars.push ('D'); 
		chars.push ('N'); 
		chars.push ('O'); 
		chars.push ('O'); 
		chars.push ('O'); 
		chars.push ('O'); 
		chars.push ('O'); 
		chars.push ('x'); 
		chars.push ('O'); 
		chars.push ('U'); 
		chars.push ('U'); 
		chars.push ('U'); 
		chars.push ('U'); 
		chars.push ('Y'); 
		chars.push ('D'); 
		chars.push ('B'); 
		chars.push ('a'); 
		chars.push ('a'); 
		chars.push ('a'); 
		chars.push ('a'); 
		chars.push ('a'); 
		chars.push ('a'); 
		chars.push ('ae'); 
		chars.push ('c'); 
		chars.push ('e'); 
		chars.push ('e'); 
		chars.push ('e'); 
		chars.push ('e'); 
		chars.push ('i'); 
		chars.push ('i'); 
		chars.push ('i'); 
		chars.push ('i'); 
		chars.push ('o'); 
		chars.push ('n'); 
		chars.push ('o'); 
		chars.push ('o'); 
		chars.push ('o'); 
		chars.push ('o'); 
		chars.push ('o'); 
		chars.push (''); 
		chars.push ('o'); 
		chars.push ('u'); 
		chars.push ('u'); 
		chars.push ('u'); 
		chars.push ('u'); 
		chars.push ('y'); 
		chars.push (''); 
		chars.push ('y');
		chars.push ('z');
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push ('C'); 
		chars.push ('c'); 
		chars.push ('D'); 
		chars.push ('d'); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push ('E'); 
		chars.push ('e'); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push ('N'); 
		chars.push ('n'); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push ('R'); 
		chars.push ('r'); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push ('S'); 
		chars.push ('s'); 
		chars.push (''); 
		chars.push (''); 
		chars.push ('T'); 
		chars.push ('t'); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push ('U'); 
		chars.push ('u'); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push (''); 
		chars.push ('Z'); 
		chars.push ('z'); 
		
		for (var i = 256; i < 100; i++) {
			chars.push ('');
		}
		
		var stringToSlug = new String (); //Create a stringToSlug String Object
		for (var i = 0; i < text.length; i ++) {
			stringToSlug += chars[text.charCodeAt (i)]; //Insert values converts at slugs
		}
		
		stringToSlug = stringToSlug.replace (new RegExp ('\\'+defaults.space+'{2,}', 'gmi'), defaults.space); // Remove any space character followed by Breakfast
		stringToSlug = stringToSlug.replace (new RegExp ('(^'+defaults.space+')|('+defaults.space+'$)', 'gmi'), ''); // Remove the space at the beginning or end of string
		
		stringToSlug = stringToSlug.toLowerCase(); //Convert your slug in lowercase		
		
		
		jQuery(defaults.getPut).val(stringToSlug); //Write in value to input fields (input text, textarea, input hidden, ...)
		jQuery(defaults.getPut).html(stringToSlug); //Write in HTML tags (span, p, strong, h1, ...)
		
		
		return this;
	});
        
  return this;
}