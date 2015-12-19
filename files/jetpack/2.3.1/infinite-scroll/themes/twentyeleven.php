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
		'container'      => 'content',
		'footer_widgets' => array( 'sidebar-3', 'sidebar-4', 'sidebar-5' ),
		'footer'         => 'page',
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