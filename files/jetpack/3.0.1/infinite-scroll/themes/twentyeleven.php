<?php
/**
 * Infinite Scroll Theme Assets
 *
 * Register support for @Twenty Eleven and enqueue relevant styles.
 */

/**
 * Add theme support for infinity scroll
 */
function twenty_eleven_infinite_scroll_init() {
	add_theme_support( 'infinite-scroll', array(
		'container' => 'content',
		'footer'    => 'page',
	) );
}
add_action( 'init', 'twenty_eleven_infinite_scroll_init' );

/**
 * Enqueue CSS stylesheet with theme styles for infinity.
 */
function twenty_eleven_infinite_scroll_enqueue_styles() {
	// Add theme specific styles.
	wp_enqueue_style( 'infinity-twentyeleven', plugins_url( 'twentyeleven.css', __FILE__ ), array( 'the-neverending-homepage' ), '20121002' );
}
add_action( 'wp_enqueue_scripts', 'twenty_eleven_infinite_scroll_enqueue_styles', 25 );

/**
 * Have we any footer widgets?
 *
 * @param bool $has_widgets
 * @uses is_active_sidebar
 * @uses jetpack_is_mobile
 * @filter infinite_scroll_has_footer_widgets
 * @return bool
 */
function twenty_eleven_has_footer_widgets( $has_widgets ) {
	// Are any of the "Footer Area" sidebars active?
	if ( is_active_sidebar( 'sidebar-3' ) || is_active_sidebar( 'sidebar-4' ) || is_active_sidebar( 'sidebar-5' ) )
		return true;

	// If we're on mobile and the Main Sidebar has widgets, it falls below the content, so we have footer widgets.
	if ( function_exists( 'jetpack_is_mobile' ) && jetpack_is_mobile() && is_active_sidebar( 'sidebar-1' ) )
		return true;

	return $has_widgets;
}
add_filter( 'infinite_scroll_has_footer_widgets', 'twenty_eleven_has_footer_widgets' );
