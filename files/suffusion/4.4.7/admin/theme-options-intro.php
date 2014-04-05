<?php
/**
 * Lists out all the options from the Introduction Section of the theme options
 * This file is included in functions.php
 *
 * @package Suffusion
 * @subpackage Admin
 */

$suffusion_intro_options = array(
	array("name" => "Introduction",
		"type" => "sub-section-2",
		"category" => "intro-pages",
		"parent" => "root"
	),

	array("name" => "Welcome",
		"type" => "sub-section-3",
		"category" => "welcome",
		"buttons" => 'no-buttons',
		"parent" => "intro-pages"
	),

	array("name" => "Don't Panic!!",
		"desc" => "Welcome to Suffusion! But first...<br />
			<div class='suf-huge centered fix'>DON'T PANIC!!</div>
			<p>At first the number of options in Suffusion might alarm you, but don't panic, everything is organized well enough for you to find your way.
			You begin with the basic aspects of look-and-feel, then make your way into the more complex and innovative aspects of the theme.</p>",
		"parent" => "welcome",
		"type" => "blurb"),

	array("name" => "Are you upgrading?",
		"desc" => "If you are upgrading from an older version of the theme (3.4.3 or lower) you should first look into the \"Upgrades\" section and perform a migration.
			Otherwise your site might not work as you expect it to. But if this is your first installation of the theme, jump right into the customizations.",
		"parent" => "welcome",
		"type" => "blurb"),

	array("name" => "Upgrades",
		"type" => "sub-section-3",
		"category" => "upgrade-patches",
		"buttons" => 'special-buttons',
		"parent" => "intro-pages"
	),

	array("name" => "Migrate settings from version 3.0.2 or lower",
		"desc" => "Heavy code optimization was done on the theme in version 3.0.5.
			This caused a change in the way some of the settings operate and your theme might not work as you expect. E.g. the navigation bars might not be displayed etc.
			Click on the button below if you upgraded from Version 3.0.2 or lower. DON'T CLICK the button if:
			<ul class='margin-100'>
				<li>You are trying out the theme for the first time</li>
				<li>Or you are upgrading from version 3.0.5 or higher</li>
			</ul>",
		"id" => "suf_up_migrate_302",
		"parent" => "upgrade-patches",
		"type" => "button",
		"action" => "",
		"std" => "Migrate from 3.0.2 or lower"),

	array("name" => "Migrate settings from version 3.4.3 or lower",
		"desc" => "In version 3.4.3 and older Suffusion used to store each option separately in the database.
			While this is not much of an issue with PHP and MySQL, both of which are superfast,
			it is still a better practice to move it all to one single option array and then store that single array as an option.
			IF YOU ARE MIGRATING FROM A VERSION LOWER THAN 3.0.5, MAKE SURE YOU RUN THE PREVIOUS STEP FIRST!
			Click on the button below if you upgraded from Version 3.4.3 or lower. DON'T CLICK the button if:
			<ul class='margin-100'>
				<li>You are trying out the theme for the first time</li>
				<li>Or you are upgrading from version 3.4.5 or higher</li>
			</ul>",
		"id" => "suf_up_migrate_343",
		"parent" => "upgrade-patches",
		"type" => "button",
		"action" => "",
		"std" => "Migrate from 3.4.3 or lower"),

	array("name" => "Export / Import",
		"type" => "sub-section-3",
		"category" => "export-import",
		"buttons" => 'special-buttons',
		"parent" => "intro-pages"
	),

	array("name" => "Export core options for use in other installations",
		"desc" => "You can export the options you have set in the theme. The options will be stored in a PHP file that you can save to your local disk. <strong>This does not export id-based options such as featured content setup, menus etc.</strong>.",
		"id" => "suf_export_options",
		"parent" => "export-import",
		"type" => "button",
		"action" => "",
		"std" => "Export core options to a file"),

	array("name" => "Export all options for use in other installations",
		"desc" => "Like the previous export the options here will be stored in a PHP file that you can save to your local disk. <strong>This will export all options including menus etc.</strong>.",
		"id" => "suf_export_all_options",
		"parent" => "export-import",
		"type" => "button",
		"action" => "",
		"std" => "Export all options to a file"),

	array("name" => "Import options from another installation",
		"desc" => "You can import options that you have exported from another installation. This is a two-step process:
		 	<ol class='margin-100'>
				<li>Copy the file 'suffusion-options.php' into the import folder in your Suffusion theme's admin directory on this installation</li>
				<li>Click on the Import button below. <b>This process is not reversible. So use it with care!!</b></li>
			</ol>",
		"id" => "suf_import_options",
		"parent" => "export-import",
		"type" => "button",
		"action" => "",
		"std" => "Import options"),
);
?>