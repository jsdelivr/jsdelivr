<?php
global $suffusion_help_texts;
$suffusion_help_texts = array(
	"skinning" => array("name" => "Skinning",
		"category" => "skinning",
		"help" => "This is where you start your customization. The first step is easy &ndash; select a skin from \"Theme Selection\".
			You can visit each of the individual sections and pick and choose the colors you want for each.
			<br /><b>Version Info: </b> In version 3.7.3 and earlier, \"Theme Skinning\" was a sub-section under \"Visual Effects\".",
	),

	"layouts" => array("name" => "Layouts",
		"category" => "layouts",
		"help" => "Set the widths for different layouts here. Also change settings for full posts, excerpts, tiles and mosaic layouts.
			The following layouts are available:
			<ul>
				<li><em>Default Sidebar Layout</em> &ndash; Configure the default layout for your site. Position the sidebars and set the widths. Unless a post / page
				 is assigned a different layout, the settings here apply</li>
				<li><em>No Sidebars</em> &ndash; Set up the look and feel for a page with no sidebars. </li>
				<li><em>1 Left Sidebar</em> &ndash; Define the widths for a page / post with 1 left sidebar. Apply this explicitly if you want a setting different from the default.</li>
				<li><em>1 Right Sidebar</em> &ndash; Define the widths for a page / post with 1 right sidebar. Apply this explicitly if you want a setting different from the default.</li>
				<li><em>1 Left, 1 Right Sidebar</em> &ndash; Define the widths for a page / post with 1 left and 1 right sidebar. Apply this explicitly if you want a setting different from the default.</li>
				<li><em>2 Left Sidebars</em> &ndash; Define the widths for a page / post with 2 left sidebars. Apply this explicitly if you want a setting different from the default.</li>
				<li><em>2 Right Sidebars</em> &ndash; Define the widths for a page / post with 2 right sidebars. Apply this explicitly if you want a setting different from the default.</li>
			</ul>",
	),

	"typography" => array("name" => "Typography",
		"category" => "typography",
		"help" => "Make changes to font settings for different parts of your content.",
	),

	"sidebar-setup" => array("name" => "Sidebars",
		"category" => "sidebar-setup",
		"help" => "In this section you can configure each of the sidebars available with the theme. There are 14 dynamic sidebars with pre-defined positions, 5 \"ad hoc\"
			sidebars that you can position inside your posts and one static tabbed sidebar that you can put on the left or right of your content.
			<br /><b>Version Info: </b> In version 3.7.3 and earlier, this section used to be called \"Sidebars and Widgets\".",
	),

	"visual-effects" => array("name" => "Other Graphical Elements",
		"category" => "visual-effects",
		"help" => "This section helps you pick and mix various graphical elements, like menus, featured content sliders etc.
			You can also pick different layouts, and set widths for different pages. <br /><b>Version Info: </b> In version 3.7.3 and earlier, options here were largely grouped under \"Visual Effects\". The following options from 3.7.3 have been moved to other sections:
			<table>
				<tr>
					<th>Option</th>
					<th>Now in Section</th>
				</tr>
				<tr>
					<td>Theme Selection</td>
					<td>Theme Skinning</td>
				</tr>
				<tr>
					<td>Theme Skinning</td>
					<td>Theme Skinning</td>
				</tr>
				<tr>
					<td>Custom Emphasis Elements</td>
					<td>Theme Skinning</td>
				</tr>
				<tr>
					<td>Header Customization</td>
					<td>Theme Skinning</td>
				</tr>
			</table>",
	),

	"templates" => array("name" => "Templates",
		"category" => "templates",
		"help" => "Configure how you want to use the templates bundled with Suffusion. Suffusion is packaged with the following templates:
			<ul>
				<li>
					Automatic Templates<br/>
					These get attached to content automatically and cannot be assigned manually.
					<ul>
						<li><em>Single Category</em> &ndash; Assigned whenever you are viewing a category</li>
						<li><em>Single Tag</em> &ndash; Assigned whenever you are viewing a tag</li>
						<li><em>Single Author</em> &ndash; Assigned whenever you are viewing an author</li>
						<li><em>Search</em> &ndash; Assigned whenever you are viewing a search page</li>
						<li><em>Attachments</em> &ndash; Assigned whenever you are viewing an attachment</li>
						<li><em>404</em> &ndash; Assigned whenever you are viewing a 404 (not found) page</li>
						<li><em>Now Reading</em> &ndash; Assigned if you have the \"Now Reading\" or \"Now Reading Reloaded\" plugin</li>
					</ul>
				</li>
				<li>
					Manual Templates<br/>
					These can be assigned to a page from the \"Templates\" section of the \"Edit Page\" screen. You cannot use these templates
					for dynamic pages like the posts page assigned through <i>Settings &rarr; Reading</i>.
					<ul>
						<li><em>Magazine</em> &ndash; Builds a magazine-styled page</li>
						<li><em>Page of Posts</em> &ndash; Shows a list of all your posts</li>
						<li><em>All Categories</em> &ndash; Shows all your categories</li>
						<li><em>Sitemap</em> &ndash; Creates an HTML sitemap for your site</li>
						<li><em>Custom Layout</em> &ndash; Provides 5 additional widget areas for you to add widgets.
						 You can configure how many columns you wish in each widget area and customize this for every individual page.</li>
					</ul>
				</li>
			</ul>
			",
	),

	"blog-features" => array("name" => "Back-End",
		"category" => "blog-features",
		"help" => "This section has options to help fine-tune your site's back-end. Think of it as a GUI alternative to PHP.
			<br /><b>Version Info: </b> In version 3.7.3 and older this section was broadly called \"Blog Features\". The following options from 3.7.3 have been moved to other sections:
			<table>
				<tr>
					<th>Option</th>
					<th>Now in Section</th>
				</tr>
				<tr>
					<td>Main Navigation Bar Setup</td>
					<td>Other Graphical Elements</td>
				</tr>
				<tr>
					<td>Top Navigation Bar Setup</td>
					<td>Other Graphical Elements</td>
				</tr>
				<tr>
					<td>Post and Page Bylines</td>
					<td>Other Graphical Elements</td>
				</tr>
				<tr>
					<td>Layout: Excerpt / List / Tile / Full</td>
					<td>Other Graphical Elements</td>
				</tr>
				<tr>
					<td>Featured Content</td>
					<td>Other Graphical Elements</td>
				</tr>
				<tr>
					<td>Tabbed Sidebar</td>
					<td>Sidebar Configuration</td>
				</tr>
			</table>",
	),
);
