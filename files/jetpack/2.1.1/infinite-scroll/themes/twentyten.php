<?php
/**
 * Infinite Scroll Theme Assets
 *
 * Register support for @Twenty Ten and enqueue relevant styles.
 */

/**
 * Add theme support for infinity scroll
 */
function twenty_ten_infinite_scroll_init() {
	add_theme_support( 'infinite-scroll', array(
		'container' => 'content',
		'render'    => 'twenty_ten_infinite_scroll_render',
		'footer'    => 'wrapper',
	) );
}
add_action( 'init', 'twenty_ten_infinite_scroll_init' );

/**
 * Set the code to be rendered on for calling posts,
 * hooked to template parts when possible.
 *
 * Note: must define a loop.
 */
function twenty_ten_infinite_scroll_render() {
	get_template_part( 'loop' );
}

/**
 * Enqueue CSS stylesheet with theme styles for infinity.
 */
function twenty_ten_infinite_scroll_enqueue_styles() {
	// Add theme specific styles.
	wp_enqueue_style( 'infinity-twentyten', plugins_url( 'twentyten.css', __FILE__ ), array( 'the-neverending-homepage' ), '20121002' );
}
add_action( 'wp_enqueue_scripts', 'twenty_ten_infinite_scroll_enqueue_styles', 25 );

/**
 * Do we have footer widgets?
 */
function twenty_ten_has_footer_widgets( $has_widgets ) {
	if ( is_active_sidebar( 'first-footer-widget-area' ) || is_active_sidebar( 'second-footer-widget-area' ) || is_active_sidebar( 'third-footer-widget-area'  ) || is_active_sidebar( 'fourth-footer-widget-area' ) )
		$has_widgets = true;

	return $has_widgets;
}
add_filter( 'infinite_scroll_has_footer_widgets', 'twenty_ten_has_footer_widgets' );