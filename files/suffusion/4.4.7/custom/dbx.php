<?php
/**
 * Code to include the docking boxes script. This has been moved out to a separate file so as to be included only when required.
 *
 * @since 3.9.3
 * @package Suffusion
 * @subpackage Custom
 */

global $suf_sidebar_1_dnd, $suf_sidebar_2_dnd, $suf_sidebar_1_expcoll, $suf_sidebar_2_expcoll, $suf_sidebar_count, $suf_wa_sb2_style;
if (suffusion_should_include_dbx()) {
	$expcoll_1 = $suf_sidebar_1_expcoll == "enabled" ? "yes" : "no";
	$expcoll_2 = $suf_sidebar_2_expcoll == "enabled" ? "yes" : "no";
?>
<!-- Sidebar docking boxes (dbx) by Brothercake - http://www.brothercake.com/ -->
<script type="text/javascript">
/* <![CDATA[ */
window.onload = function() {
	//initialise the docking boxes manager
	var manager = new dbxManager('main'); 	//session ID [/-_a-zA-Z0-9/]

<?php
	if ($suf_sidebar_1_dnd == "enabled") {?>
	//create new docking boxes group
	var sidebar = new dbxGroup(
		'sidebar', 		// container ID [/-_a-zA-Z0-9/]
		'vertical', 		// orientation ['vertical'|'horizontal']
		'7', 			// drag threshold ['n' pixels]
		'no',			// restrict drag movement to container axis ['yes'|'no']
		'10', 			// animate re-ordering [frames per transition, or '0' for no effect]
		'<?php echo $expcoll_1; ?>', 			// include open/close toggle buttons ['yes'|'no']
		'open', 		// default state ['open'|'closed']
		'open', 		// word for "open", as in "open this box"
		'close', 		// word for "close", as in "close this box"
		'click-down and drag to move this box', // sentence for "move this box" by mouse
		'click to %toggle% this box', // pattern-match sentence for "(open|close) this box" by mouse
		'use the arrow keys to move this box', // sentence for "move this box" by keyboard
		', or press the enter key to %toggle% it',  // pattern-match sentence-fragment for "(open|close) this box" by keyboard
		'%mytitle%  [%dbxtitle%]' // pattern-match syntax for title-attribute conflicts
	);
<?php
	}
	if (($suf_sidebar_count > 1 && $suf_sidebar_2_dnd == "enabled" && $suf_wa_sb2_style == "boxed" && !(is_page_template('1l-sidebar.php') || is_page_template('1r-sidebar.php'))) ||
			($suf_sidebar_2_dnd == "enabled" && $suf_wa_sb2_style == "boxed" && (is_page_template('1l1r-sidebar.php') || is_page_template('2l-sidebars.php') || is_page_template('2r-sidebars.php')))) {
?>
	var sidebar_2 = new dbxGroup(
		'sidebar-2', 		// container ID [/-_a-zA-Z0-9/]
		'vertical', 		// orientation ['vertical'|'horizontal']
		'7', 			// drag threshold ['n' pixels]
		'no',			// restrict drag movement to container axis ['yes'|'no']
		'10', 			// animate re-ordering [frames per transition, or '0' for no effect]
		'<?php echo $expcoll_2; ?>', 			// include open/close toggle buttons ['yes'|'no']
		'open', 		// default state ['open'|'closed']
		'open', 		// word for "open", as in "open this box"
		'close', 		// word for "close", as in "close this box"
		'click-down and drag to move this box', // sentence for "move this box" by mouse
		'click to %toggle% this box', // pattern-match sentence for "(open|close) this box" by mouse
		'use the arrow keys to move this box', // sentence for "move this box" by keyboard
		', or press the enter key to %toggle% it',  // pattern-match sentence-fragment for "(open|close) this box" by keyboard
		'%mytitle%  [%dbxtitle%]' // pattern-match syntax for title-attribute conflicts
	);
<?php
	}
	?>
};
/* ]]> */
</script>

<?php
}
