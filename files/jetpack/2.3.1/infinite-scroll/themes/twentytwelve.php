<?php
/**
 * Infinite Scroll Theme Assets
 *
 * Register support for Twenty Twelve and enqueue relevant styles.
 */

/**
 * Add theme support for infinite scroll
 */
function twenty_twelve_infinite_scroll_init() {
	add_theme_support( 'infinite-scroll', array(
		'container'      => 'content',
		'footer'         => 'page'
	) );
}
add_action( 'after_setup_theme', 'twenty_twelve_infinite_scroll_init' );

/**
 * Enqueue CSS stylesheet with theme styles for infinity.
 */
function twenty_twelve_infinite_scroll_enqueue_styles() {
    // Add theme specific styles.
    wp_enqueue_style( 'infinity-twentytwelve', plugins_url( 'twentytwelve.css', __FILE__ ), array( 'the-neverending-homepage' ), '20120817' );
}
add_action( 'wp_enqueue_scripts', 'twenty_twelve_infinite_scroll_enqueue_styles', 25 );

/**
 * Handle `footer_widgets` argument for mobile devices
 *
 * @param bool $has_widgets
 * @uses jetpack_is_mobile, is_front_page, is_active_sidebar
 * @filter infinite_scroll_has_footer_widgets
 * @return bool
 */
function twenty_twelve_has_footer_widgets( $has_widgets ) {
	if ( function_exists( 'jetpack_is_mobile' ) && jetpack_is_mobile() ) {
		if ( is_front_page() && ( is_active_sidebar( 'sidebar-2' ) || is_active_sidebar( 'sidebar-3' ) ) )
			$has_widgets = true;
		elseif ( is_active_sidebar( 'sidebar-1' ) )
			$has_widgets = true;
	}

	return $has_widgets;
}
add_filter( 'infinite_scroll_has_footer_widgets', 'twenty_twelve_has_footer_widgets' );