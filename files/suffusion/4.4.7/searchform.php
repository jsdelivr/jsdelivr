<?php
/**
 * Search form
 *
 * @package Suffusion
 * @subpackage Templates
 */

global $suffusion_rhw_is_not_dynamic, $suf_color_scheme;
if (isset($suffusion_rhw_is_not_dynamic) && $suffusion_rhw_is_not_dynamic === true && ($suf_color_scheme == 'photonique' || $suf_color_scheme == 'scribbles')) {
	$collapse = 'collapse';
}
else {
	$collapse = '';
}
?>

<form method="get" class="searchform <?php echo $collapse; ?>" action="<?php echo home_url(); ?>/">
	<input type="text" name="s" class="searchfield"
<?php
	if ($collapse == '') {
?>
			value="<?php _e('Search','suffusion');?>"
			onfocus="if (this.value == '<?php _e("Search","suffusion");?>') {this.value = '';}"
			onblur="if (this.value == '') {this.value = '<?php _e("Search","suffusion");?>';}"
<?php
	}
?>
			/>
	<input type="submit" class="searchsubmit" value="" name="searchsubmit" />
<?php
	if (function_exists('icl_object_id')) {
?>
	<input type="hidden" name="lang" value="<?php echo(ICL_LANGUAGE_CODE); ?>"/>
<?php
	}
?>
</form>
