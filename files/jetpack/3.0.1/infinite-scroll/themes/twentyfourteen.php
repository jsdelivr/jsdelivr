<?php
/**
 * Infinite Scroll Theme Assets
 *
 * Register support for Twenty Fourteen.
 */

/**
 * Add theme support for infinite scroll
 */
function twentyfourteen_infinite_scroll_init() {
	add_theme_support( 'infinite-scroll', array(
		'container' => 'content',
		'footer'    => 'page'
	) );
}
add_action( 'after_setup_theme', 'twentyfourteen_infinite_scroll_init' );

/**
 * Switch to the "click to load" type IS with the following cases
 * 1. Viewed from iPad and the primary sidebar is active.
 * 2. Viewed from mobile and either the primary or the content sudebar is active.
 * 3. The footer widget is active.
 *
 * @return bool
 */

if ( function_exists( 'jetpack_is_mobile' ) ) {
	function twentyfourteen_has_footer_widgets( $has_widgets ) {
		if ( ( Jetpack_User_Agent_Info::is_ipad() && is_active_sidebar( 'sidebar-1' ) )
			|| ( jetpack_is_mobile( '', true ) && ( is_active_sidebar( 'sidebar-1' ) || is_active_sidebar( 'sidebar-2' ) ) )
			|| is_active_sidebar( 'sidebar-3' ) )

			return true;

		return $has_widgets;
	}
	add_filter( 'infinite_scroll_has_footer_widgets', 'twentyfourteen_has_footer_widgets' );
}

/**
 * Enqueue CSS stylesheet with theme styles for Infinite Scroll.
 */
function twentyfourteen_infinite_scroll_enqueue_styles() {
	wp_enqueue_style( 'infinity-twentyfourteen', plugins_url( 'twentyfourteen.css', __FILE__ ), array( 'the-neverending-homepage' ), '20131118' );
}
add_action( 'wp_enqueue_scripts', 'twentyfourteen_infinite_scroll_enqueue_styles', 25 );