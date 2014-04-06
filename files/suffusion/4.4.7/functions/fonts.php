<?php
/**
 * Fonts API - This currently loads fonts from Google Web Fonts. A selection of fonts is made available in the fonts dropdown.
 *
 * @package Suffusion
 * @subpackage Functions
 * @since 3.9.1
 */

class Suffusion_Fonts {
	var $fonts;

	function __construct() {
		$this->init();
	}

	function init() {
		$this->fonts = array(
			'alike' => array(
				'family' => 'Alike',
				'weight' => array(),
				'class' => 'serif',
			),

			'amaranth' => array(
				'family' => 'Amaranth',
				'weight' => array(
					400 => 'Normal',
					'400italic' => 'Normal italic',
					700 => 'Bold',
					'700italic' => 'Bold italic',
				),
				'class' => 'sans-serif',
			),

			'andada' => array(
				'family' => 'Andada',
				'weight' => array(),
				'class' => 'serif',
			),

			'andika' => array(
				'family' => 'Andika',
				'weight' => array(),
				'class' => 'sans-serif',
			),

			'annie-use-your-telescope' => array(
				'family' => 'Annie Use Your Telescope',
				'weight' => array(),
				'class' => 'cursive',
			),

			'buda' => array(
				'family' => 'Buda',
				'weight' => array(
					300 => 'Book',
				),
				'class' => 'sans-serif',
			),

			'cantarell' => array(
				'family' => 'Cantarell',
				'weight' => array(
					400 => 'Normal',
					'400italic' => 'Normal italic',
					700 => 'Bold',
					'700italic' => 'Bold italic',
				),
				'class' => 'sans-serif',
			),

			'cardo' => array(
				'family' => 'Cardo',
				'weight' => array(
					400 => 'Normal',
					'400italic' => 'Normal italic',
					700 => 'Bold',
				),
				'class' => 'serif',
			),

			'coming-soon' => array(
				'family' => 'Coming Soon',
				'weight' => array(),
				'class' => 'cursive',
			),

			'crushed' => array(
				'family' => 'Crushed',
				'weight' => array(),
				'class' => 'cursive',
			),

			'cuprum' => array(
				'family' => 'Cuprum',
				'weight' => array(),
				'class' => 'sans-serif',
			),

			'dancing-script' => array(
				'family' => 'Dancing Script',
				'weight' => array(
					400 => 'Normal',
					700 => 'Bold',
				),
				'class' => 'cursive',
			),

			'droid-sans' => array(
				'family' => 'Droid Sans',
				'weight' => array(
					400 => 'Normal',
					700 => 'Bold',
				),
				'class' => 'sans-serif',
			),

			'droid-serif' => array(
				'family' => 'Droid Serif',
				'weight' => array(
					400 => 'Normal',
					'400italic' => 'Normal italic',
					700 => 'Bold',
					'700italic' => 'Bold italic',
				),
				'class' => 'serif',
			),

			'fanwood-text' => array(
				'family' => 'Fanwood Text',
				'weight' => array(
					400 => 'Normal',
					700 => 'Bold',
				),
				'class' => 'serif',
			),

			'federo' => array(
				'family' => 'Federo',
				'weight' => array(),
				'class' => 'cursive',
			),

			'gentium-basic' => array(
				'family' => 'Gentium Basic',
				'weight' => array(
					400 => 'Normal',
					'400italic' => 'Normal italic',
					700 => 'Bold',
					'700italic' => 'Bold italic',
				),
				'class' => 'serif',
			),

			'gentium-book-basic' => array(
				'family' => 'Gentium Book Basic',
				'weight' => array(
					400 => 'Normal',
					'400italic' => 'Normal italic',
					700 => 'Bold',
					'700italic' => 'Bold italic',
				),
				'class' => 'serif',
			),

			'give-you-glory' => array(
				'family' => 'Give You Glory',
				'weight' => array(),
				'class' => 'cursive',
			),

			'handlee' => array(
				'family' => 'Handlee',
				'weight' => array(),
				'class' => 'cursive',
			),

			'inconsolata' => array(
				'family' => 'Inconsolata',
				'weight' => array(),
				'class' => 'sans-serif',
			),

			'josefin-sans' => array(
				'family' => 'Josefin Sans',
				'weight' => array(
					400 => 'Normal',
					'400italic' => 'Normal italic',
					700 => 'Bold',
					'700italic' => 'Bold italic',
				),
				'class' => 'sans-serif',
			),

			'josefin-slab' => array(
				'family' => 'Josefin Slab',
				'weight' => array(
					400 => 'Normal',
					'400italic' => 'Normal italic',
					700 => 'Bold',
					'700italic' => 'Bold italic',
				),
				'class' => 'serif',
			),

			'just-another-hand' => array(
				'family' => 'Just Another Hand',
				'weight' => array(),
				'class' => 'cursive',
			),

			'just-me-again-down-here' => array(
				'family' => 'Just Me Again Down Here',
				'weight' => array(),
				'class' => 'cursive',
			),

			'kameron' => array(
				'family' => 'Kameron',
				'weight' => array(
					400 => 'Normal',
					700 => 'Bold',
				),
				'class' => 'serif',
			),

			'lato' => array(
				'family' => 'Lato',
				'weight' => array(
					100 => 'Ultra-Light',
					'100italic' => 'Ultra-Light italic',
					300 => 'Book',
					'300italic' => 'Book italic',
					400 => 'Normal',
					'400italic' => 'Normal italic',
					700 => 'Bold',
					'700italic' => 'Bold italic',
					900 => 'Ultra-Bold',
					'900italic' => 'Ultra-Bold italic',
				),
				'class' => 'sans-serif',
			),

			'lobster' => array(
				'family' => 'Lobster',
				'weight' => array(),
				'class' => 'cursive',
			),

			'lobster-two' => array(
				'family' => 'Lobster Two',
				'weight' => array(
					400 => 'Normal',
					'400italic' => 'Normal italic',
					700 => 'Bold',
					'700italic' => 'Bold italic',
				),
				'class' => 'cursive',
			),

			'megrim' => array(
				'family' => 'Megrim',
				'weight' => array(),
				'class' => 'cursive',
			),

			'modern-antiqua' => array(
				'family' => 'Modern Antiqua',
				'weight' => array(),
				'class' => 'cursive',
			),

			'mountains-of-christmas' => array(
				'family' => 'Mountains of Christmas',
				'weight' => array(),
				'class' => 'cursive',
			),

			'neucha' => array(
				'family' => 'Neucha',
				'weight' => array(),
				'class' => 'cursive',
			),

			'news-cycle' => array(
				'family' => 'News Cycle',
				'weight' => array(),
				'class' => 'sans-serif',
			),

			'nixie-one' => array(
				'family' => 'Nixie One',
				'weight' => array(),
				'class' => 'cursive',
			),

			'nova-cut' => array(
				'family' => 'Nova Cut',
				'weight' => array(),
				'class' => 'cursive',
			),

			'nova-round' => array(
				'family' => 'Nova Round',
				'weight' => array(),
				'class' => 'cursive',
			),

			'nova-slim' => array(
				'family' => 'Nova Slim',
				'weight' => array(),
				'class' => 'cursive',
			),

			'nova-square' => array(
				'family' => 'Nova Square',
				'weight' => array(),
				'class' => 'cursive',
			),

			'open-sans' => array(
				'family' => 'Open Sans',
				'weight' => array(
					400 => 'Normal',
					'400italic' => 'Normal italic',
					700 => 'Bold',
					'700italic' => 'Bold italic',
				),
				'class' => 'sans-serif',
			),

			'patrick-hand' => array(
				'family' => 'Patrick Hand',
				'weight' => array(),
				'class' => 'cursive',
			),

			'philosopher' => array(
				'family' => 'Philosopher',
				'weight' => array(
					400 => 'Normal',
					'400italic' => 'Normal italic',
					700 => 'Bold',
					'700italic' => 'Bold italic',
				),
				'class' => 'sans-serif',
			),

			'pinyon-script' => array(
				'family' => 'Pinyon Script',
				'weight' => array(),
				'class' => 'cursive',
			),

			'podkova' => array(
				'family' => 'Podkova',
				'weight' => array(),
				'class' => 'serif',
			),

			'pompiere' => array(
				'family' => 'Pompiere',
				'weight' => array(),
				'class' => 'cursive',
			),

			'pt-sans-narrow' => array(
				'family' => 'PT Sans Narrow',
				'weight' => array(
					400 => 'Normal',
					700 => 'Bold',
				),
				'class' => 'sans-serif',
			),

			'pt-sans' => array(
				'family' => 'PT Sans',
				'weight' => array(
					400 => 'Normal',
					'400italic' => 'Normal italic',
					700 => 'Bold',
					'700italic' => 'Bold italic',
				),
				'class' => 'sans-serif',
			),

			'quattrocento' => array(
				'family' => 'Quattrocento',
				'weight' => array(),
				'class' => 'serif',
			),

			'questrial' => array(
				'family' => 'Questrial',
				'weight' => array(),
				'class' => 'sans-serif',
			),

			'rancho' => array(
				'family' => 'Rancho',
				'weight' => array(),
				'class' => 'cursive',
			),

			'rokkit' => array(
				'family' => 'Rokkit',
				'weight' => array(
					400 => 'Normal',
					700 => 'Bold',
				),
				'class' => 'serif',
			),

			'rosario' => array(
				'family' => 'Rosario',
				'weight' => array(
					400 => 'Normal',
					'400italic' => 'Normal italic',
				),
				'class' => 'sans-serif',
			),

			'satisfy' => array(
				'family' => 'Satisfy',
				'weight' => array(),
				'class' => 'cursive',
			),

			'signika' => array(
				'family' => 'Signika',
				'weight' => array(
					300 => 'Book',
					400 => 'Normal',
					600 => 'Semi-Bold',
					700 => 'Bold',
				),
				'class' => 'sans-serif',
			),

			'signika-negative' => array(
				'family' => 'Signika Negative',
				'weight' => array(
					300 => 'Book',
					400 => 'Normal',
					600 => 'Semi-Bold',
					700 => 'Bold',
				),
				'class' => 'sans-serif',
			),

			'sue-ellen-francisco' => array(
				'family' => 'Sue Ellen Francisco',
				'weight' => array(),
				'class' => 'cursive',
			),

			'tangerine' => array(
				'family' => 'Tangerine',
				'weight' => array(
					400 => 'Normal',
					700 => 'Bold',
				),
				'class' => 'cursive',
			),

			'terminal-dosis' => array(
				'family' => 'Terminal Dosis',
				'weight' => array(
					400 => 'Normal',
					700 => 'Bold',
				),
				'class' => 'sans-serif',
			),

			'ubuntu' => array(
				'family' => 'Ubuntu',
				'weight' => array(
					400 => 'Normal',
					'400italic' => 'Normal italic',
					700 => 'Bold',
					'700italic' => 'Bold italic',
				),
				'class' => 'sans-serif',
			),

			'ubuntu-condensed' => array(
				'family' => 'Ubuntu Condensed',
				'weight' => array(),
				'class' => 'sans-serif',
			),

			'ultra' => array(
				'family' => 'Ultra',
				'weight' => array(),
				'class' => 'serif',
			),

			'vidaloka' => array(
				'family' => 'Vidaloka',
				'weight' => array(),
				'class' => 'serif',
			),

			'waiting-for-the-sunrise' => array(
				'family' => 'Waiting for the Sunrise',
				'weight' => array(),
				'class' => 'cursive',
			),

		);

		add_filter('suffusion_font_list', array(&$this, 'add_fonts'));
		add_action('wp_enqueue_scripts', array(&$this, 'enqueue_scripts'));
	}

	function add_fonts($fonts) {
		if (!is_array($fonts)) {
			$fonts = array();
		}
		foreach ($this->fonts as $font) {
			$font_key = "'{$font['family']}', {$font['class']}";
			$fonts[$font_key] = "{$font['family']}, <em>{$font['class']}</em> (from Google Fonts)";
		}
		return $fonts;
	}

	function enqueue_scripts() {
		if (is_admin()) {
			return;
		}

		// Font variables
		global $suf_navt_skin_settings_bg_font, $suf_navt_skin_settings_font, $suf_navt_skin_settings_hover_font, $suf_navt_skin_settings_visited_font;
		global $suf_navt_skin_settings_hl_font, $suf_nav_skin_settings_bg_font, $suf_nav_skin_settings_font, $suf_nav_skin_settings_hover_font;
		global $suf_nav_skin_settings_visited_font, $suf_nav_skin_settings_hl_font, $suf_date_box_mfont, $suf_date_box_dfont, $suf_date_box_yfont, $suf_body_font_family;
		global $suf_post_title_font, $suf_post_title_link_font, $suf_post_title_link_hover_font, $suf_post_h1_font, $suf_post_h2_font, $suf_post_h3_font, $suf_post_h4_font;
		global $suf_post_h5_font, $suf_post_h6_font, $suf_comment_header_font, $suf_comment_body_font, $suf_footer_text_font, $suf_footer_link_font, $suf_footer_link_hover_font;
		$font_variables = array(
			$suf_body_font_family,
			$suf_navt_skin_settings_bg_font,
			$suf_navt_skin_settings_font,
			$suf_navt_skin_settings_hover_font,
			$suf_navt_skin_settings_visited_font,
			$suf_navt_skin_settings_hl_font,
			$suf_nav_skin_settings_bg_font,
			$suf_nav_skin_settings_font,
			$suf_nav_skin_settings_hover_font,
			$suf_nav_skin_settings_visited_font,
			$suf_nav_skin_settings_hl_font,
			$suf_date_box_mfont,
			$suf_date_box_dfont,
			$suf_date_box_yfont,
			$suf_post_title_font,
			$suf_post_title_link_font,
			$suf_post_title_link_hover_font,
			$suf_post_h1_font,
			$suf_post_h2_font,
			$suf_post_h3_font,
			$suf_post_h4_font,
			$suf_post_h5_font,
			$suf_post_h6_font,
			$suf_comment_header_font,
			$suf_comment_body_font,
			$suf_footer_text_font,
			$suf_footer_link_font,
			$suf_footer_link_hover_font
		);
		$font_names = array();
		foreach ($this->fonts as $id => $font) {
			$font_key = "'{$font['family']}', {$font['class']}";
			$font_names[$font_key] = $id;
		}
		$font_stack = array();
		foreach ($font_variables as $variable) {
			if (is_array($variable) && isset($variable['font-face']) && array_key_exists($variable['font-face'], $font_names)) {
				$font_stack[] = $font_names[$variable['font-face']];
			}
			else if (isset($variable)) {
				$variable = wp_specialchars_decode($variable, ENT_QUOTES);
				$variable = stripslashes($variable);
				$vals = explode(';', $variable);
				if (is_array($vals) && count($vals) > 1) {
					$val_array = array();
					foreach ($vals as $val) {
						$pair = explode('=', $val);
						if (is_array($pair) && count($pair) > 1) {
							$val_array[$pair[0]] = $pair[1];
						}
					}
					$variable = $val_array;

					foreach ($variable as $name => $value) {
						if ($name == "font-face") {
							if (array_key_exists($value, $font_names)) {
								$font_stack[] = $font_names[$value];
							}
						}
					}
				}
				else {
					if (array_key_exists($variable, $font_names)) {
						$font_stack[] = $font_names[$variable];
					}
				}
			}
		}

		// Can be linked using this syntax:
		// <link href='http://fonts.googleapis.com/css?family=Terminal+Dosis:400,700|Quattrocento|Pompiere|Gentium+Basic:400,400italic,700,700italic|Federo|Open+Sans:400,400italic,700,700italic|Megrim|Droid+Sans:400,700|Amaranth:400,400italic,700,700italic|PT+Sans+Narrow:400,700|Cardo:400,400italic,700|Buda:300|Cuprum|Josefin+Slab:400,400italic,700,700italic|Droid+Serif:400,400italic,700,700italic|PT+Sans:400,400italic,700,700italic|Josefin+Sans:400,400italic,700,700italic|Nova+Square|Coming+Soon|Dancing+Script:400,700|Philosopher:400,400italic,700,700italic|Lobster|Lobster+Two:400,400italic,700,700italic|Tangerine:400,700|Ultra|Nixie+One|Kameron:400,700|Ubuntu:400,400italic,700,700italic|Rosario:400,400italic|Cantarell:400,400italic,700,700italic|Inconsolata|Fanwood+Text:400,400italic' rel='stylesheet' type='text/css'>
		$esc_fonts = array();
		foreach ($font_stack as $id) {
			$font = $this->fonts[$id];
			$font_text = urlencode($font['family']);
			if (is_array($font['weight']) && count($font['weight']) > 0) {
				$font_text .= ':'.implode(',', array_keys($font['weight']));
			}
			$esc_fonts[] = $font_text;
		}

		if (is_array($esc_fonts) && count($esc_fonts) > 0) {
			$query_text = implode('|', $esc_fonts);
			wp_enqueue_style('suffusion-google-fonts', "http://fonts.googleapis.com/css?family=$query_text", array(), null);
		}
	}
}
