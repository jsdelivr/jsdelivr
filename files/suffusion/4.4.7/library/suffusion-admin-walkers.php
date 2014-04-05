<?php
/**
 * Contains the walkers used in Suffusion in the back-end. This is a core file, not extensible by child themes.
 * This file is mostly a copy of Walker_Nav_Menu_Edit, because the native WP class doesn't offer hooks to extend it.
 *
 * @package Suffusion
 * @subpackage Library
 * @since 4.0.0
 */

/**
 * Navigation Menu Walker for the Edit Screen. This adds a drop-down of Widget Areas that can be used as Mega-Menus.
 * Only a top-level menu item can be used for a Mega-Menu. Note that the ideal way to implement this would have been using hooks.
 * However there is no hook available to extend what is printed for the navigation menu in the back-end.
 * The key method here, <code>start_el</code> is a copy of the <code>start_el</code> method in Walker_Nav_Menu_Edit. The only change
 * there is to add the code to display the drop-down.
 *
 * @TODO: For some reason WP doesn't let you extend Walker_Nav_Menu_Edit. Investigate usage of that in a later release.
 * @since: 4.0.0
 */
class Suffusion_MM_Walker_Edit extends Walker_Nav_Menu {
	/**
	 * @see Walker_Nav_Menu::start_lvl()
	 * @since 3.0.0
	 *
	 * @param string $output Passed by reference.
	 */
	function start_lvl(&$output) {}

	/**
	 * @see Walker_Nav_Menu::end_lvl()
	 * @since 3.0.0
	 *
	 * @param string $output Passed by reference.
	 */
	function end_lvl(&$output) {
	}

	/**
	 * @see Walker::start_el()
	 * @since 3.0.0
	 *
	 * @param string $output Passed by reference. Used to append additional content.
	 * @param object $item Menu item data object.
	 * @param int $depth Depth of menu item. Used for padding.
	 * @param object $args
	 * @return void
	 */
	function start_el(&$output, $item, $depth, $args) {
		global $_wp_nav_menu_max_depth;
		$_wp_nav_menu_max_depth = $depth > $_wp_nav_menu_max_depth ? $depth : $_wp_nav_menu_max_depth;

		$indent = ( $depth ) ? str_repeat( "\t", $depth ) : '';

		ob_start();
		$item_id = esc_attr( $item->ID );
		$removed_args = array(
			'action',
			'customlink-tab',
			'edit-menu-item',
			'menu-item',
			'page-tab',
			'_wpnonce',
		);

		$original_title = '';
		if ( 'taxonomy' == $item->type ) {
			$original_title = get_term_field( 'name', $item->object_id, $item->object, 'raw' );
			if ( is_wp_error( $original_title ) )
				$original_title = false;
		} elseif ( 'post_type' == $item->type ) {
			$original_object = get_post( $item->object_id );
			$original_title = $original_object->post_title;
		}

		$classes = array(
			'menu-item menu-item-depth-' . $depth,
			'menu-item-' . esc_attr( $item->object ),
			'menu-item-edit-' . ( ( isset( $_GET['edit-menu-item'] ) && $item_id == $_GET['edit-menu-item'] ) ? 'active' : 'inactive'),
		);

		$title = $item->title;

		if ( ! empty( $item->_invalid ) ) {
			$classes[] = 'menu-item-invalid';
			/* translators: %s: title of menu item which is invalid */
			$title = sprintf( __( '%s (Invalid)', 'suffusion' ), $item->title );
		} elseif ( isset( $item->post_status ) && 'draft' == $item->post_status ) {
			$classes[] = 'pending';
			/* translators: %s: title of menu item in draft status */
			$title = sprintf( __('%s (Pending)', 'suffusion'), $item->title );
		}

		$title = empty( $item->label ) ? $title : $item->label;

		?>
		<li id="menu-item-<?php echo $item_id; ?>" class="<?php echo implode(' ', $classes ); ?>">
			<dl class="menu-item-bar">
				<dt class="menu-item-handle">
					<span class="item-title"><?php echo esc_html( $title ); ?></span>
					<span class="item-controls">
						<span class="item-type"><?php echo esc_html( $item->type_label ); ?></span>
						<span class="item-order hide-if-js">
							<a href="<?php
								echo wp_nonce_url(
									add_query_arg(
										array(
											'action' => 'move-up-menu-item',
											'menu-item' => $item_id,
										),
										remove_query_arg($removed_args, admin_url( 'nav-menus.php' ) )
									),
									'move-menu_item'
								);
							?>" class="item-move-up"><abbr title="<?php esc_attr_e('Move up', 'suffusion'); ?>">&#8593;</abbr></a>
							|
							<a href="<?php
								echo wp_nonce_url(
									add_query_arg(
										array(
											'action' => 'move-down-menu-item',
											'menu-item' => $item_id,
										),
										remove_query_arg($removed_args, admin_url( 'nav-menus.php' ) )
									),
									'move-menu_item'
								);
							?>" class="item-move-down"><abbr title="<?php esc_attr_e('Move down', 'suffusion'); ?>">&#8595;</abbr></a>
						</span>
						<a class="item-edit" id="edit-<?php echo $item_id; ?>" title="<?php esc_attr_e('Edit Menu Item', 'suffusion'); ?>" href="<?php
							echo ( isset( $_GET['edit-menu-item'] ) && $item_id == $_GET['edit-menu-item'] ) ? admin_url( 'nav-menus.php' ) : add_query_arg( 'edit-menu-item', $item_id, remove_query_arg( $removed_args, admin_url( 'nav-menus.php#menu-item-settings-' . $item_id ) ) );
						?>"><?php _e( 'Edit Menu Item', 'suffusion' ); ?></a>
					</span>
				</dt>
			</dl>

			<div class="menu-item-settings" id="menu-item-settings-<?php echo $item_id; ?>">
				<?php if( 'custom' == $item->type ) : ?>
					<p class="field-url description description-wide">
						<label for="edit-menu-item-url-<?php echo $item_id; ?>">
							<?php _e( 'URL', 'suffusion' ); ?><br />
							<input type="text" id="edit-menu-item-url-<?php echo $item_id; ?>" class="widefat code edit-menu-item-url" name="menu-item-url[<?php echo $item_id; ?>]" value="<?php echo esc_attr( $item->url ); ?>" />
						</label>
					</p>
				<?php endif; ?>
				<p class="description description-thin">
					<label for="edit-menu-item-title-<?php echo $item_id; ?>">
						<?php _e( 'Navigation Label', 'suffusion' ); ?><br />
						<input type="text" id="edit-menu-item-title-<?php echo $item_id; ?>" class="widefat edit-menu-item-title" name="menu-item-title[<?php echo $item_id; ?>]" value="<?php echo esc_attr( $item->title ); ?>" />
					</label>
				</p>
				<p class="description description-thin">
					<label for="edit-menu-item-attr-title-<?php echo $item_id; ?>">
						<?php _e( 'Title Attribute', 'suffusion' ); ?><br />
						<input type="text" id="edit-menu-item-attr-title-<?php echo $item_id; ?>" class="widefat edit-menu-item-attr-title" name="menu-item-attr-title[<?php echo $item_id; ?>]" value="<?php echo esc_attr( $item->post_excerpt ); ?>" />
					</label>
				</p>
				<p class="field-link-target description">
					<label for="edit-menu-item-target-<?php echo $item_id; ?>">
						<input type="checkbox" id="edit-menu-item-target-<?php echo $item_id; ?>" value="_blank" name="menu-item-target[<?php echo $item_id; ?>]"<?php checked( $item->target, '_blank' ); ?> />
						<?php _e( 'Open link in a new window/tab', 'suffusion' ); ?>
					</label>
				</p>
				<p class="field-css-classes description description-thin">
					<label for="edit-menu-item-classes-<?php echo $item_id; ?>">
						<?php _e( 'CSS Classes (optional)', 'suffusion' ); ?><br />
						<input type="text" id="edit-menu-item-classes-<?php echo $item_id; ?>" class="widefat code edit-menu-item-classes" name="menu-item-classes[<?php echo $item_id; ?>]" value="<?php echo esc_attr( implode(' ', $item->classes ) ); ?>" />
					</label>
				</p>
				<p class="field-xfn description description-thin">
					<label for="edit-menu-item-xfn-<?php echo $item_id; ?>">
						<?php _e( 'Link Relationship (XFN)', 'suffusion' ); ?><br />
						<input type="text" id="edit-menu-item-xfn-<?php echo $item_id; ?>" class="widefat code edit-menu-item-xfn" name="menu-item-xfn[<?php echo $item_id; ?>]" value="<?php echo esc_attr( $item->xfn ); ?>" />
					</label>
				</p>
				<p class="field-description description description-wide">
					<label for="edit-menu-item-description-<?php echo $item_id; ?>">
						<?php _e( 'Description', 'suffusion' ); ?><br />
						<textarea id="edit-menu-item-description-<?php echo $item_id; ?>" class="widefat edit-menu-item-description" rows="3" cols="20" name="menu-item-description[<?php echo $item_id; ?>]"><?php echo esc_html( $item->description ); // textarea_escaped ?></textarea>
						<span class="description"><?php _e('The description will be displayed in the menu if the current theme supports it.', 'suffusion'); ?></span>
					</label>
				</p>
		<?php
				// The following code is an insertion for Suffusion. It displays the widget areas that can be applied to Mega-Menus.
				global $suffusion_mm_sidebar_count;
				if ($suffusion_mm_sidebar_count > 0 && $depth == 0) {
				?>
					<p class="suffusion-mm-custom suffusion-mm suffusion-mm-sidebars">
						<label for="edit-menu-item-sidebars-<?php echo $item->ID; ?>">
							<span class="description"><?php _e("Pick a widget area for a Mega Menu:", 'suffusion'); ?></span><br />
							<?php echo $this->suffusion_sidebar_select($item->ID); ?>
							<span class="description"><?php _e('If you select a widget area the rest of the menu under this tab is ignored', 'suffusion'); ?></span>
						</label>
					</p>

					<p class="suffusion-mm-custom description">
						<label for="suffusion-mm-cols-<?php echo $item_id; ?>">
							<?php _e('Number of columns in Mega Menu', 'suffusion'); ?><br />
							<select id="suffusion-mm-cols-<?php echo $item_id; ?>" class="suffusion-mm-cols" name="suffusion-mm-cols[<?php echo $item_id; ?>]">
							<?php for ($i = 1; $i <= 8; $i++) { ?>
								<option value="<?php echo $i; ?>" <?php selected(get_post_meta($item_id, 'suf_mm_cols', true), $i); ?> ><?php echo $i; ?></option>
							<?php } ?>
							</select>
						</label>
					</p>

					<p class="suffusion-mm-custom description">
						<label for="suffusion-mm-widget-height-<?php echo $item_id; ?>">
							<?php _e('Height of widgets in Mega Menu', 'suffusion'); ?><br />
							<?php $widget_height = get_post_meta($item_id, 'suf_mm_widget_height', true); ?>
							<select id="suffusion-mm-widget-height-<?php echo $item_id; ?>" name="suffusion-mm-widget-height[<?php echo $item_id; ?>]" class="edit-menu-item-widget-height">
								<option value="row-equal" <?php selected($widget_height, 'row-equal'); ?>><?php _e('Equal height for a row', 'suffusion'); ?></option>
								<option value="original" <?php selected($widget_height, 'original'); ?>><?php _e('Original height', 'suffusion'); ?></option>
								<option value="mason" <?php selected($widget_height, 'mason'); ?>><?php _e('Auto-arrange', 'suffusion'); ?></option>
							</select>
						</label>
					</p>
				<?php
					}
				// ... End of Suffusion-specific insertions.
				?>
				<div class="menu-item-actions description-wide submitbox">
					<?php if( 'custom' != $item->type && $original_title !== false ) : ?>
						<p class="link-to-original">
							<?php printf( __('Original: %s', 'suffusion'), '<a href="' . esc_attr( $item->url ) . '">' . esc_html( $original_title ) . '</a>' ); ?>
						</p>
					<?php endif; ?>
					<a class="item-delete submitdelete deletion" id="delete-<?php echo $item_id; ?>" href="<?php
					echo wp_nonce_url(
						add_query_arg(
							array(
								'action' => 'delete-menu-item',
								'menu-item' => $item_id,
							),
							remove_query_arg($removed_args, admin_url( 'nav-menus.php' ) )
						),
						'delete-menu_item_' . $item_id
					); ?>"><?php _e('Remove', 'suffusion'); ?></a> <span class="meta-sep"> | </span> <a class="item-cancel submitcancel" id="cancel-<?php echo $item_id; ?>" href="<?php	echo esc_url( add_query_arg( array('edit-menu-item' => $item_id, 'cancel' => time()), remove_query_arg( $removed_args, admin_url( 'nav-menus.php' ) ) ) );
						?>#menu-item-settings-<?php echo $item_id; ?>"><?php _e('Cancel', 'suffusion'); ?></a>
				</div>

				<input class="menu-item-data-db-id" type="hidden" name="menu-item-db-id[<?php echo $item_id; ?>]" value="<?php echo $item_id; ?>" />
				<input class="menu-item-data-object-id" type="hidden" name="menu-item-object-id[<?php echo $item_id; ?>]" value="<?php echo esc_attr( $item->object_id ); ?>" />
				<input class="menu-item-data-object" type="hidden" name="menu-item-object[<?php echo $item_id; ?>]" value="<?php echo esc_attr( $item->object ); ?>" />
				<input class="menu-item-data-parent-id" type="hidden" name="menu-item-parent-id[<?php echo $item_id; ?>]" value="<?php echo esc_attr( $item->menu_item_parent ); ?>" />
				<input class="menu-item-data-position" type="hidden" name="menu-item-position[<?php echo $item_id; ?>]" value="<?php echo esc_attr( $item->menu_order ); ?>" />
				<input class="menu-item-data-type" type="hidden" name="menu-item-type[<?php echo $item_id; ?>]" value="<?php echo esc_attr( $item->type ); ?>" />
			</div><!-- .menu-item-settings-->
			<ul class="menu-item-transport"></ul>
		<?php
 		$output .= ob_get_clean();
	}

	/**
	 * Prints the widget area drop-down to pick the widget area that will be used for a Mega Menu, if applicable.
	 *
	 * @param $id
	 * @return string
	 * @since 4.0.0
	 */
	function suffusion_sidebar_select($id) {
		global $suffusion_mm_sidebar_count;
		$field_id = 'edit-menu-item-warea-' . $id;
		$name = 'menu-item-warea[' . $id . ']';
		$selection = get_post_meta($id, 'suf_mm_warea', true);

		if ($suffusion_mm_sidebar_count == 0) {
			return '';
		}

		$html = '<select id="' . $field_id . '" name="' . $name . '" class="edit-menu-item-wareas">';
		$html .= '<option value=""></option>';

		for ($i = 1; $i <= $suffusion_mm_sidebar_count; $i++) {
			$value = "Mega Menu Widget Area $i";
			$html .= '<option value="mm-' . $i . '" ' . selected($selection, "mm-$i", false) . ' >' . $value . '</option>';
		}
		$html .= '</select>';

		return $html;
	}
}
