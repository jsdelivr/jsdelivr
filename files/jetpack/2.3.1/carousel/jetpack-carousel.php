<?php

/*
Plugin Name: Jetpack Carousel
Plugin URL: http://wordpress.com/
Description: Transform your standard image galleries into an immersive full-screen experience.
Version: 0.1
Author: Automattic

Released under the GPL v.2 license.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
*/
class Jetpack_Carousel {

	var $prebuilt_widths = array( 370, 700, 1000, 1200, 1400, 2000 );

	var $first_run = true;

	var $in_jetpack = true;

	function __construct() {
		add_action( 'init', array( $this, 'init' ) );
	}

	function init() {
		if ( $this->maybe_disable_jp_carousel() )
			return;

		$this->in_jetpack = ( class_exists( 'Jetpack' ) && method_exists( 'Jetpack', 'enable_module_configurable' ) ) ? true : false;

		if ( is_admin() ) {
			// Register the Carousel-related related settings
			add_action( 'admin_init', array( $this, 'register_settings' ), 5 );
			if ( ! $this->in_jetpack ) {
				if ( 0 == $this->test_1or0_option( get_option( 'carousel_enable_it' ), true ) )
					return; // Carousel disabled, abort early, but still register setting so user can switch it back on
			}
			// If in admin, register the ajax endpoints.
			add_action( 'wp_ajax_get_attachment_comments', array( $this, 'get_attachment_comments' ) );
			add_action( 'wp_ajax_nopriv_get_attachment_comments', array( $this, 'get_attachment_comments' ) );
			add_action( 'wp_ajax_post_attachment_comment', array( $this, 'post_attachment_comment' ) );
			add_action( 'wp_ajax_nopriv_post_attachment_comment', array( $this, 'post_attachment_comment' ) );
		} else {
			if ( ! $this->in_jetpack ) {
				if ( 0 == $this->test_1or0_option( get_option( 'carousel_enable_it' ), true ) )
					return; // Carousel disabled, abort early
			}
			// If on front-end, do the Carousel thang.
			$this->prebuilt_widths = apply_filters( 'jp_carousel_widths', $this->prebuilt_widths );
			add_filter( 'post_gallery', array( $this, 'enqueue_assets' ), 1000, 2 ); // load later than other callbacks hooked it
			add_filter( 'gallery_style', array( $this, 'add_data_to_container' ) );
			add_filter( 'wp_get_attachment_link', array( $this, 'add_data_to_images' ), 10, 2 );
		}

		if ( $this->in_jetpack && method_exists( 'Jetpack', 'module_configuration_load' ) ) {
			Jetpack::enable_module_configurable( dirname( dirname( __FILE__ ) ) . '/carousel.php' );
			Jetpack::module_configuration_load( dirname( dirname( __FILE__ ) ) . '/carousel.php', array( $this, 'jetpack_configuration_load' ) );
		}
	}

	function maybe_disable_jp_carousel() {
		return apply_filters( 'jp_carousel_maybe_disable', false );
	}

	function jetpack_configuration_load() {
		wp_safe_redirect( admin_url( 'options-media.php#carousel_background_color' ) );
		exit;
	}

	function asset_version( $version ) {
		return apply_filters( 'jp_carousel_asset_version', $version );
	}

	function enqueue_assets( $output ) {
		if ( ! empty( $output ) && ! apply_filters( 'jp_carousel_force_enable', false ) ) {
			// Bail because someone is overriding the [gallery] shortcode.
			remove_filter( 'gallery_style', array( $this, 'add_data_to_container' ) );
			remove_filter( 'wp_get_attachment_link', array( $this, 'add_data_to_images' ) );
			return $output;
		}

		do_action( 'jp_carousel_thumbnails_shown' );

		if ( $this->first_run ) {
			wp_enqueue_script( 'jetpack-carousel', plugins_url( 'jetpack-carousel.js', __FILE__ ), array( 'jquery.spin' ), $this->asset_version( '20130109' ), true );

			// Note: using  home_url() instead of admin_url() for ajaxurl to be sure  to get same domain on wpcom when using mapped domains (also works on self-hosted)
			// Also: not hardcoding path since there is no guarantee site is running on site root in self-hosted context.
			$is_logged_in = is_user_logged_in();
			$current_user = wp_get_current_user();
			$comment_registration = intval( get_option( 'comment_registration' ) );
			$require_name_email   = intval( get_option( 'require_name_email' ) );
			$localize_strings = array(
				'widths'               => $this->prebuilt_widths,
				'is_logged_in'         => $is_logged_in,
				'lang'                 => strtolower( substr( get_locale(), 0, 2 ) ),
				'ajaxurl'              => admin_url( 'admin-ajax.php', is_ssl() ? 'https' : 'http' ),
				'nonce'                => wp_create_nonce( 'carousel_nonce' ),
				'display_exif'         => $this->test_1or0_option( get_option( 'carousel_display_exif' ), true ),
				'display_geo'          => $this->test_1or0_option( get_option( 'carousel_display_geo' ), true ),
				'background_color'     => $this->carousel_background_color_sanitize( get_option( 'carousel_background_color' ) ),
				'comment'              => __( 'Comment', 'jetpack' ),
				'post_comment'         => __( 'Post Comment', 'jetpack' ),
				'loading_comments'     => __( 'Loading Comments...', 'jetpack' ),
				'download_original'    => sprintf( __( 'View full size <span class="photo-size">%1$s<span class="photo-size-times">&times;</span>%2$s</span>', 'jetpack' ), '{0}', '{1}' ),
				'no_comment_text'      => __( 'Please be sure to submit some text with your comment.', 'jetpack' ),
				'no_comment_email'     => __( 'Please provide an email address to comment.', 'jetpack' ),
				'no_comment_author'    => __( 'Please provide your name to comment.', 'jetpack' ),
				'comment_post_error'   => __( 'Sorry, but there was an error posting your comment. Please try again later.', 'jetpack' ),
				'comment_approved'     => __( 'Your comment was approved.', 'jetpack' ),
				'comment_unapproved'   => __( 'Your comment is in moderation.', 'jetpack' ),
				'camera'               => __( 'Camera', 'jetpack' ),
				'aperture'             => __( 'Aperture', 'jetpack' ),
				'shutter_speed'        => __( 'Shutter Speed', 'jetpack' ),
				'focal_length'         => __( 'Focal Length', 'jetpack' ),
				'comment_registration' => $comment_registration,
				'require_name_email'   => $require_name_email,
				'login_url'            => wp_login_url( apply_filters( 'the_permalink', get_permalink() ) ),
			);

			if ( ! isset( $localize_strings['jetpack_comments_iframe_src'] ) || empty( $localize_strings['jetpack_comments_iframe_src'] ) ) {
				// We're not using Jetpack comments after all, so fallback to standard local comments.

				if ( $is_logged_in ) {
					$localize_strings['local_comments_commenting_as'] = '<p id="jp-carousel-commenting-as">' . sprintf( __( 'Commenting as %s', 'jetpack' ), $current_user->data->display_name ) . '</p>';
				} else {
					if ( $comment_registration ) {
						$localize_strings['local_comments_commenting_as'] = '<p id="jp-carousel-commenting-as">' . __( 'You must be <a href="#" class="jp-carousel-comment-login">logged in</a> to post a comment.' , 'jetpack') . '</p>';
					} else {
						$required = ( $require_name_email ) ? __( '%s (Required)', 'jetpack' ) : '%s';
						$localize_strings['local_comments_commenting_as'] = ''
							. '<fieldset><label for="email">' . sprintf( $required, __( 'Email', 'jetpack' ) ) . '</label> '
							. '<input type="text" name="email" class="jp-carousel-comment-form-field jp-carousel-comment-form-text-field" id="jp-carousel-comment-form-email-field" /></fieldset>'
							. '<fieldset><label for="author">' . sprintf( $required, __( 'Name', 'jetpack' ) ) . '</label> '
							. '<input type="text" name="author" class="jp-carousel-comment-form-field jp-carousel-comment-form-text-field" id="jp-carousel-comment-form-author-field" /></fieldset>'
							. '<fieldset><label for="url">' . __( 'Website', 'jetpack' ) . '</label> '
							. '<input type="text" name="url" class="jp-carousel-comment-form-field jp-carousel-comment-form-text-field" id="jp-carousel-comment-form-url-field" /></fieldset>';
						}
				}
			}

			$localize_strings = apply_filters( 'jp_carousel_localize_strings', $localize_strings );
			wp_localize_script( 'jetpack-carousel', 'jetpackCarouselStrings', $localize_strings );
			wp_enqueue_style( 'jetpack-carousel', plugins_url( 'jetpack-carousel.css', __FILE__ ), array(), $this->asset_version( '20120629' ) );
			global $is_IE;
			if( $is_IE )
			{
				$msie = strpos( $_SERVER['HTTP_USER_AGENT'], 'MSIE' ) + 4;
				$version = (float) substr( $_SERVER['HTTP_USER_AGENT'], $msie, strpos( $_SERVER['HTTP_USER_AGENT'], ';', $msie ) - $msie );
				if( $version < 9 )
					wp_enqueue_style( 'jetpack-carousel-ie8fix', plugins_url( 'jetpack-carousel-ie8fix.css', __FILE__ ), array(), $this->asset_version( '20121024' ) );
			}
			do_action( 'jp_carousel_enqueue_assets', $this->first_run, $localize_strings );

			$this->first_run = false;
		}

		return $output;
	}

	function add_data_to_images( $html, $attachment_id ) {
		if ( $this->first_run ) // not in a gallery
			return $html;

		$attachment_id   = intval( $attachment_id );
		$orig_file       = wp_get_attachment_image_src( $attachment_id, 'full' );
		$orig_file       = isset( $orig_file[0] ) ? $orig_file[0] : wp_get_attachment_url( $attachment_id );
		$meta            = wp_get_attachment_metadata( $attachment_id );
		$size            = isset( $meta['width'] ) ? intval( $meta['width'] ) . ',' . intval( $meta['height'] ) : '';
		$img_meta        = ( ! empty( $meta['image_meta'] ) ) ? (array) $meta['image_meta'] : array();
		$comments_opened = intval( comments_open( $attachment_id ) );

		/*
		 * Note: Cannot generate a filename from the width and height wp_get_attachment_image_src() returns because
		 * it takes the $content_width global variable themes can set in consideration, therefore returning sizes
		 * which when used to generate a filename will likely result in a 404 on the image.
		 * $content_width has no filter we could temporarily de-register, run wp_get_attachment_image_src(), then
		 * re-register. So using returned file URL instead, which we can define the sizes from through filename
		 * parsing in the JS, as this is a failsafe file reference.
		 *
		 * EG with Twenty Eleven activated:
		 * array(4) { [0]=> string(82) "http://vanillawpinstall.blah/wp-content/uploads/2012/06/IMG_3534-1024x764.jpg" [1]=> int(584) [2]=> int(435) [3]=> bool(true) }
		 *
		 * EG with Twenty Ten activated:
		 * array(4) { [0]=> string(82) "http://vanillawpinstall.blah/wp-content/uploads/2012/06/IMG_3534-1024x764.jpg" [1]=> int(640) [2]=> int(477) [3]=> bool(true) }
		 */

		$medium_file_info = wp_get_attachment_image_src( $attachment_id, 'medium' );
		$medium_file      = isset( $medium_file_info[0] ) ? $medium_file_info[0] : '';

		$large_file_info  = wp_get_attachment_image_src( $attachment_id, 'large' );
		$large_file       = isset( $large_file_info[0] ) ? $large_file_info[0] : '';

		$attachment       = get_post( $attachment_id );
		$attachment_title = wptexturize( $attachment->post_title );
		$attachment_desc  = wpautop( wptexturize( $attachment->post_content ) );

		// Not yet providing geo-data, need to "fuzzify" for privacy
		if ( ! empty( $img_meta ) ) {
			foreach ( $img_meta as $k => $v ) {
				if ( 'latitude' == $k || 'longitude' == $k )
					unset( $img_meta[$k] );
			}
		}

		$img_meta = json_encode( array_map( 'strval', $img_meta ) );

		$html = str_replace(
			'<img ',
			sprintf(
				'<img data-attachment-id="%1$d" data-orig-file="%2$s" data-orig-size="%3$s" data-comments-opened="%4$s" data-image-meta="%5$s" data-image-title="%6$s" data-image-description="%7$s" data-medium-file="%8$s" data-large-file="%9$s" ',
				$attachment_id,
				esc_attr( $orig_file ),
				$size,
				$comments_opened,
				esc_attr( $img_meta ),
				esc_attr( $attachment_title ),
				esc_attr( $attachment_desc ),
				esc_attr( $medium_file ),
				esc_attr( $large_file )
			),
			$html
		);

		$html = apply_filters( 'jp_carousel_add_data_to_images', $html, $attachment_id );

		return $html;
	}

	function add_data_to_container( $html ) {
		global $post;

		if ( isset( $post ) ) {
			$blog_id = (int) get_current_blog_id();

			if ( defined( 'IS_WPCOM' ) && IS_WPCOM ) {
				$likes_blog_id = $blog_id;
			} else {
				$jetpack = Jetpack::init();
				$likes_blog_id = $jetpack->get_option( 'id' );
			}

			$extra_data = array(
				'data-carousel-extra' => array(
					'blog_id' => $blog_id,
					'permalink' => get_permalink( $post->ID ),
					'likes_blog_id' => $likes_blog_id
					)
				);

			$extra_data = apply_filters( 'jp_carousel_add_data_to_container', $extra_data );
			foreach ( (array) $extra_data as $data_key => $data_values ) {
				$html = str_replace( '<div ', '<div ' . esc_attr( $data_key ) . "='" . json_encode( $data_values ) . "' ", $html );
			}
		}

		return $html;
	}

	function get_attachment_comments() {
		if ( ! headers_sent() )
			header('Content-type: text/javascript');

		do_action('jp_carousel_check_blog_user_privileges');

		$attachment_id = ( isset( $_REQUEST['id'] ) ) ? (int) $_REQUEST['id'] : 0;
		$offset        = ( isset( $_REQUEST['offset'] ) ) ? (int) $_REQUEST['offset'] : 0;

		if ( ! $attachment_id ) {
			echo json_encode( __( 'Missing attachment ID.', 'jetpack' ) );
			die();
		}

		if ( $offset < 1 )
			$offset = 0;

		$comments = get_comments( array(
			'status'  => 'approve',
			'order'   => ( 'asc' == get_option('comment_order') ) ? 'ASC' : 'DESC',
			'number'  => 10,
			'offset'  => $offset,
			'post_id' => $attachment_id,
		) );

		$out      = array();

		// Can't just send the results, they contain the commenter's email address.
		foreach ( $comments as $comment ) {
			$out[] = array(
				'id'              => $comment->comment_ID,
				'parent_id'       => $comment->comment_parent,
				'author_markup'   => get_comment_author_link( $comment->comment_ID ),
				'gravatar_markup' => get_avatar( $comment->comment_author_email, 64 ),
				'date_gmt'        => $comment->comment_date_gmt,
				'content'         => wpautop($comment->comment_content),
			);
		}

		die( json_encode( $out ) );
	}

	function post_attachment_comment() {
		if ( ! headers_sent() )
			header('Content-type: text/javascript');

		if ( empty( $_POST['nonce'] ) || ! wp_verify_nonce($_POST['nonce'], 'carousel_nonce') )
			die( json_encode( array( 'error' => __( 'Nonce verification failed.', 'jetpack' ) ) ) );

		$_blog_id = (int) $_POST['blog_id'];
		$_post_id = (int) $_POST['id'];
		$comment = $_POST['comment'];

		if ( empty( $_blog_id ) )
			die( json_encode( array( 'error' => __( 'Missing target blog ID.', 'jetpack' ) ) ) );

		if ( empty( $_post_id ) )
			die( json_encode( array( 'error' => __( 'Missing target post ID.', 'jetpack' ) ) ) );

		if ( empty( $comment ) )
			die( json_encode( array( 'error' => __( 'No comment text was submitted.', 'jetpack' ) ) ) );

		// Used in context like NewDash
		$switched = false;
		if ( is_multisite() && $_blog_id != get_current_blog_id() ) {
			switch_to_blog( $_blog_id );
			$switched = true;
		}

		do_action('jp_carousel_check_blog_user_privileges');

		if ( ! comments_open( $_post_id ) )
			die( json_encode( array( 'error' => __( 'Comments on this post are closed.', 'jetpack' ) ) ) );

		if ( is_user_logged_in() ) {
			$user         = wp_get_current_user();
			$user_id      = $user->ID;
			$display_name = $user->display_name;
			$email        = $user->user_email;
			$url          = $user->user_url;

			if ( empty( $user_id ) )
				die( json_encode( array( 'error' => __( 'Sorry, but we could not authenticate your request.', 'jetpack' ) ) ) );
		} else {
			$user_id      = 0;
			$display_name = $_POST['author'];
			$email        = $_POST['email'];
			$url          = $_POST['url'];

			if ( get_option( 'require_name_email' ) ) {
				if ( empty( $display_name ) )
					die( json_encode( array( 'error' => __( 'Please provide your name.', 'jetpack' ) ) ) );

				if ( empty( $email ) )
					die( json_encode( array( 'error' => __( 'Please provide an email address.', 'jetpack' ) ) ) );

				if ( ! is_email( $email ) )
					die( json_encode( array( 'error' => __( 'Please provide a valid email address.', 'jetpack' ) ) ) );
			}
		}

		$comment_data =  array(
			'comment_content'      => $comment,
			'comment_post_ID'      => $_post_id,
			'comment_author'       => $display_name,
			'comment_author_email' => $email,
			'comment_author_url'   => $url,
			'comment_approved'     => 0,
			'comment_type'         => '',
		);

		if ( ! empty( $user_id ) )
			$comment_data['user_id'] = $user_id;

		// Note: wp_new_comment() sanitizes and validates the values (too).
		$comment_id = wp_new_comment( $comment_data );
		do_action( 'jp_carousel_post_attachment_comment' );
		$comment_status = wp_get_comment_status( $comment_id );

		if ( true == $switched )
			restore_current_blog();

		die( json_encode( array( 'comment_id' => $comment_id, 'comment_status' => $comment_status ) ) );
	}

	function register_settings() {
		add_settings_section('carousel_section', __( 'Image Gallery Carousel', 'jetpack' ), array( $this, 'carousel_section_callback' ), 'media');

		if ( ! $this->in_jetpack ) {
			add_settings_field('carousel_enable_it', __( 'Enable carousel', 'jetpack' ), array( $this, 'carousel_enable_it_callback' ), 'media', 'carousel_section' );
			register_setting( 'media', 'carousel_enable_it', array( $this, 'carousel_enable_it_sanitize' ) );
		}

		add_settings_field('carousel_background_color', __( 'Background color', 'jetpack' ), array( $this, 'carousel_background_color_callback' ), 'media', 'carousel_section' );
		register_setting( 'media', 'carousel_background_color', array( $this, 'carousel_background_color_sanitize' ) );

		add_settings_field('carousel_display_exif', __( 'Metadata', 'jetpack'), array( $this, 'carousel_display_exif_callback' ), 'media', 'carousel_section' );
		register_setting( 'media', 'carousel_display_exif', array( $this, 'carousel_display_exif_sanitize' ) );

		// No geo setting yet, need to "fuzzify" data first, for privacy
		// add_settings_field('carousel_display_geo', __( 'Geolocation', 'jetpack' ), array( $this, 'carousel_display_geo_callback' ), 'media', 'carousel_section' );
		// register_setting( 'media', 'carousel_display_geo', array( $this, 'carousel_display_geo_sanitize' ) );
	}

	// Fulfill the settings section callback requirement by returning nothing
	function carousel_section_callback() {
		return;
	}

	function test_1or0_option( $value, $default_to_1 = true ) {
		if ( true == $default_to_1 ) {
			// Binary false (===) of $value means it has not yet been set, in which case we do want to default sites to 1
			if ( false === $value )
				$value = 1;
		}
		return ( 1 == $value ) ? 1 : 0;
	}

	function sanitize_1or0_option( $value ) {
		return ( 1 == $value ) ? 1 : 0;
	}

	function settings_checkbox($name, $label_text, $extra_text = '', $default_to_checked = true) {
		if ( empty( $name ) )
			return;
		$option = $this->test_1or0_option( get_option( $name ), $default_to_checked );
		echo '<fieldset>';
		echo '<input type="checkbox" name="'.esc_attr($name).'" id="'.esc_attr($name).'" value="1" ';
		checked( '1', $option );
		echo '/> <label for="'.esc_attr($name).'">'.$label_text.'</label>';
		if ( ! empty( $extra_text ) )
			echo '<p class="description">'.$extra_text.'</p>';
		echo '</fieldset>';
	}

	function settings_select($name, $values, $extra_text = '') {
		if ( empty( $name ) || ! is_array( $values ) || empty( $values ) )
			return;
		$option = get_option( $name );
		echo '<fieldset>';
		echo '<select name="'.esc_attr($name).'" id="'.esc_attr($name).'">';
		foreach( $values as $key => $value ) {
			echo '<option value="'.esc_attr($key).'" ';
			selected( $key, $option );
			echo '>'.esc_html($value).'</option>';
		}
		echo '</select>';
		if ( ! empty( $extra_text ) )
			echo '<p class="description">'.$extra_text.'</p>';
		echo '</fieldset>';
	}

	function carousel_display_exif_callback() {
		$this->settings_checkbox( 'carousel_display_exif', __( 'Show photo metadata (<a href="http://en.wikipedia.org/wiki/Exchangeable_image_file_format" target="_blank">Exif</a>) in carousel, when available.', 'jetpack' ) );
	}

	function carousel_display_exif_sanitize( $value ) {
		return $this->sanitize_1or0_option( $value );
	}

	function carousel_display_geo_callback() {
		$this->settings_checkbox( 'carousel_display_geo', __( 'Show map of photo location in carousel, when available.', 'jetpack' ) );
	}

	function carousel_display_geo_sanitize( $value ) {
		return $this->sanitize_1or0_option( $value );
	}

	function carousel_background_color_callback() {
		$this->settings_select( 'carousel_background_color', array( 'black' => __( 'Black', 'jetpack' ), 'white' => __( 'White', 'jetpack', 'jetpack' ) ) );
	}

	function carousel_background_color_sanitize( $value ) {
		return ( 'white' == $value ) ? 'white' : 'black';
	}

	function carousel_enable_it_callback() {
		$this->settings_checkbox( 'carousel_enable_it', __( 'Display images in full-size carousel slideshow.', 'jetpack' ) );
	}

	function carousel_enable_it_sanitize( $value ) {
		return $this->sanitize_1or0_option( $value );
	}
}

new Jetpack_Carousel;
