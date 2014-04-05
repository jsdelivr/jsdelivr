<?php
global $suf_theme_definitions, $suf_element_mapping;
$suf_theme_definitions = array(
	"root" => array(
		"body/color" => "#000000",
		"body/background-color" => "#444444",
		"body/background-image" => '',

		"a/color" => "#528f6c",
		"a:visited/color" => "#528f6c",
		"a/text-decoration" => "none",
		"a:hover/color" => "#528f6c",
		"a:hover/text-decoration" => "underline",

		".blogtitle a/color" => "#000000",
		".blogtitle a:hover/color" => "#528f6c",
		".description/color" => "#000000",

		"#wrapper/border-color" => "#008000",
		"#wrapper/background-color" => "#EDF3E6",

		".post/border-color" => "#c0c0c0",
		".post/background-color" => "#ffffff",
		".post .date/color" => "#ffffff",
		".post .date span/color" => "#ffffff",
		".post .date span.year/color" => "#ffffff",

		"h2.posttitle/color" => "#000000",
		"h2.posttitle/border-bottom-color" => "#CCCCCC",
		"h2.posttitle a/color" => "#000000",
		"h2.posttitle a:visited/color" => "#000000",
		"h2.posttitle a:hover/color" => "#528f6c",

		"#sidebar/color" => "#666666",
		"#sidebar h3/color" => "#444444",
		"#sidebar h3:hover/color" => "#000000",
		"#sidebar h3 a/color" => "#333333",
		"#sidebar h3 a:visited/color" => "#333333",
		"#sidebar a/color" => "#000000",
		"#sidebar a:visited/color" => "#000000",
		"#sidebar a:hover/color" => "#528f6c",
		"#sidebar a:focus/color" => "#528f6c",
		"#sidebar a:active/color" => "#528f6c",
		"#sidebar div.dbx-box/border-color" => "#c0c0c0",

		".widget_calendar a/color" => "#528f6c",
		".wp-caption/background" => "#ffffff",

		".download/color" => "#000000",
		".download/background-color" => "#bbe7f9",
		".download/border-color" => "#0000ff",

		".announcement/color" => "#000000",
		".announcement/background-color" => "#b8f9d5",
		".announcement/border-color" => "#088c43",

		".warning/color" => "#000000",
		".warning/background-color" => "#ffdbea",
		".warning/border-color" => "#ff0000",

		".note/color" => "#000000",
		".note/background-color" => "#f9f6a7",
		".note/border-color" => "#e7d605",

		"#horizontal-outer-widgets-1/color" => "#000000",
		"#horizontal-outer-widgets-1 a/color" => "#000000",
		"#horizontal-outer-widgets-1 a:visited/color" => "#000000",

		"#horizontal-outer-widgets-2/color" => "#000000",
		"#horizontal-outer-widgets-2 a/color" => "#000000",
		"#horizontal-outer-widgets-2 a:visited/color" => "#000000",
	),

	"dark-theme" => array(
		"parent" => "root",
		"body/color" => "#dedede",

		"blockquote/background-color" => "#222222",
		"blockquote/border-color" => "#555555",

		"#wrapper/border-color" => "#555555",
		"#wrapper/background-color" => "#222222",

		"#sidebar div.dbx-box/border-color" => "#555555",
		"#sidebar div.dbx-box/background-color" => "#000000",

		".dbx-handle/border-color" => "#555555",

		".blogtitle a/color" => "#cccccc",
		".description/color" => "#cccccc",

		".post/border-color" => "#555555",
		".post/background-color" => "#000000",

		"h2.posttitle/color" => "#ffffff",
		"h2.posttitle/border-bottom-color" => "#555555",
		"h2.posttitle a/color" => "#ffffff",
		"h2.posttitle a:visited/color" => "#ffffff",

		"#commentform textarea/background" => "#333333",
		"#commentform textarea/border-color" => "#555555",

		"textarea/color" => "#999999",
		"textarea/border-color" => "#555555",

		".submit/border-color" => "#555555",
		".submit/background" => "#444444",

		"#sidebar/color" => "#666666",
		"#sidebar h3/color" => "#999999",
		"#sidebar h3:hover/color" => "#999999",
		"#sidebar h3 a/color" => "#999999",
		"#sidebar h3 a:visited/color" => "#999999",
		"#sidebar a/color" => "#999999",
		"#sidebar a:visited/color" => "#999999",

		"#horizontal-outer-widgets-1/color" => "#666666",
		"#horizontal-outer-widgets-1 a/color" => "#999999",
		"#horizontal-outer-widgets-1 a:visited/color" => "#999999",

		"#horizontal-outer-widgets-2/color" => "#666666",
		"#horizontal-outer-widgets-2 a/color" => "#999999",
		"#horizontal-outer-widgets-2 a:visited/color" => "#999999",
	),

	"light-theme-green" => array(
		"name" => "Green on a light theme",
		"parent" => "root",

		"a/color" => "#528f6c",
		"a:visited/color" => "#528f6c",
		"a:hover/color" => "#528f6c",

		"#wrapper/border-color" => "#008000",
		"#wrapper/background-color" => "#edf3e6",

		".blogtitle a:hover/color" => "#528f6c",

		".post .date/color" => "#ffffff",
		".post .date span/color" => "#ffffff",
		".post .date span.year/color" => "#ffffff",

		"#sidebar h3/color" => "#444444",
		"#sidebar h3:hover/color" => "#444444",
		"#sidebar h3 a/color" => "#444444",
		"#sidebar h3 a:visited/color" => "#444444",
		"#sidebar h3.scheme/color" => "#ffffff",
		"#sidebar h3.scheme:hover/color" => "#ffffff",
		"#sidebar h3.scheme a/color" => "#ffffff",
		"#sidebar h3.scheme a:visited/color" => "#ffffff",
		"#sidebar a:hover/color" => "#528f6c",
		"#sidebar a:focus/color" => "#528f6c",
		"#sidebar a:active/color" => "#528f6c",

		".widget_calendar a/color" => "#528f6c",

		"#horizontal-outer-widgets-1 a:hover/color" => "#528f6c",
		"#horizontal-outer-widgets-1 a:focus/color" => "#528f6c",
		"#horizontal-outer-widgets-1 a:active/color" => "#528f6c",

		"#horizontal-outer-widgets-2 a:hover/color" => "#528f6c",
		"#horizontal-outer-widgets-2 a:focus/color" => "#528f6c",
		"#horizontal-outer-widgets-2 a:active/color" => "#528f6c",
	),

	"dark-theme-green" => array(
		"name" => "Green on a dark theme",
		"parent" => "dark-theme,light-theme-green",

		"a/color" => "#528f6c",
		"a:visited/color" => "#528f6c",
		"a/text-decoration" => "none",
		"a:hover/color" => "#528f6c",
		"a:hover/text-decoration" => "underline",

		".blogtitle a:hover/color" => "#528f6c",

		"#horizontal-outer-widgets-1 a:hover/color" => "#528f6c",
		"#horizontal-outer-widgets-1 a:focus/color" => "#528f6c",
		"#horizontal-outer-widgets-1 a:active/color" => "#528f6c",

		"#horizontal-outer-widgets-2 a:hover/color" => "#528f6c",
		"#horizontal-outer-widgets-2 a:focus/color" => "#528f6c",
		"#horizontal-outer-widgets-2 a:active/color" => "#528f6c",
	),

	"light-theme-pale-blue" => array(
		"name" => "Pale Blue on a light theme",
		"parent" => "root",

		"a/color" => "#227ad1",
		"a:visited/color" => "#227ad1",
		"a:hover/color" => "#227ad1",

		"#wrapper/border-color" => "#c0c0c0",
		"#wrapper/background-color" => "#f8f8ff",


		".blogtitle a:hover/color" => "#227ad1",

		".post .date/color" => "#555555",
		".post .date span/color" => "#555555",
		".post .date span.year/color" => "#555555",

		"#sidebar h3/color" => "#444444",
		"#sidebar h3:hover/color" => "#444444",
		"#sidebar h3 a/color" => "#444444",
		"#sidebar h3 a:visited/color" => "#444444",
		"#sidebar h3.scheme/color" => "#ffffff",
		"#sidebar h3.scheme:hover/color" => "#ffffff",
		"#sidebar h3.scheme a/color" => "#ffffff",
		"#sidebar h3.scheme a:visited/color" => "#ffffff",
		"#sidebar a:hover/color" => "#227ad1",
		"#sidebar a:focus/color" => "#227ad1",
		"#sidebar a:active/color" => "#227ad1",

		".widget_calendar a/color" => "#227ad1",

		"#horizontal-outer-widgets-1 a:hover/color" => "#227ad1",
		"#horizontal-outer-widgets-1 a:focus/color" => "#227ad1",
		"#horizontal-outer-widgets-1 a:active/color" => "#227ad1",

		"#horizontal-outer-widgets-2 a:hover/color" => "#227ad1",
		"#horizontal-outer-widgets-2 a:focus/color" => "#227ad1",
		"#horizontal-outer-widgets-2 a:active/color" => "#227ad1",
	),

	"dark-theme-pale-blue" => array(
		"name" => "Pale Blue on a light theme",
		"parent" => "dark-theme,light-theme-pale-blue",

		"a/color" => "#227ad1",
		"a:visited/color" => "#227ad1",
		"a/text-decoration" => "none",
		"a:hover/color" => "#227ad1",
		"a:hover/text-decoration" => "underline",

		".blogtitle a:hover/color" => "#227ad1",

		"#sidebar a:hover/color" => "#227ad1",
		"#sidebar a:focus/color" => "#227ad1",
		"#sidebar a:active/color" => "#227ad1",

		"#horizontal-outer-widgets-1 a:hover/color" => "#227ad1",
		"#horizontal-outer-widgets-1 a:focus/color" => "#227ad1",
		"#horizontal-outer-widgets-1 a:active/color" => "#227ad1",

		"#horizontal-outer-widgets-2 a:hover/color" => "#227ad1",
		"#horizontal-outer-widgets-2 a:focus/color" => "#227ad1",
		"#horizontal-outer-widgets-2 a:active/color" => "#227ad1",
	),

	"light-theme-royal-blue" => array(
		"name" => "Royal Blue on a light theme",
		"parent" => "root",

		"a/color" => "#227ad1",
		"a:visited/color" => "#227ad1",
		"a:hover/color" => "#227ad1",

		"#wrapper/border-color" => "#B6D1E4",
		"#wrapper/background-color" => "#f8f8ff",

		".blogtitle a:hover/color" => "#227ad1",

		".post .date/color" => "#ffffff",
		".post .date span/color" => "#ffffff",
		".post .date span.year/color" => "#ffffff",

		"#sidebar h3/color" => "#444444",
		"#sidebar h3:hover/color" => "#444444",
		"#sidebar h3 a/color" => "#444444",
		"#sidebar h3 a:visited/color" => "#444444",
		"#sidebar h3.scheme/color" => "#ffffff",
		"#sidebar h3.scheme:hover/color" => "#ffffff",
		"#sidebar h3.scheme a/color" => "#ffffff",
		"#sidebar h3.scheme a:visited/color" => "#ffffff",
		"#sidebar a:hover/color" => "#227ad1",
		"#sidebar a:focus/color" => "#227ad1",
		"#sidebar a:active/color" => "#227ad1",

		".widget_calendar a/color" => "#227ad1",

		"#horizontal-outer-widgets-1 a:hover/color" => "#227ad1",
		"#horizontal-outer-widgets-1 a:focus/color" => "#227ad1",
		"#horizontal-outer-widgets-1 a:active/color" => "#227ad1",

		"#horizontal-outer-widgets-2 a:hover/color" => "#227ad1",
		"#horizontal-outer-widgets-2 a:focus/color" => "#227ad1",
		"#horizontal-outer-widgets-2 a:active/color" => "#227ad1",
	),

	"dark-theme-royal-blue" => array(
		"name" => "Royal Blue on a dark theme",
		"parent" => "dark-theme,light-theme-royal-blue",

		"a/color" => "#227ad1",
		"a:visited/color" => "#227ad1",
		"a:hover/color" => "#227ad1",
		".blogtitle a:hover/color" => "#227ad1",

		"#sidebar a:hover/color" => "#227ad1",
		"#sidebar a:focus/color" => "#227ad1",
		"#sidebar a:active/color" => "#227ad1",

		"#horizontal-outer-widgets-1 a:hover/color" => "#227ad1",
		"#horizontal-outer-widgets-1 a:focus/color" => "#227ad1",
		"#horizontal-outer-widgets-1 a:active/color" => "#227ad1",

		"#horizontal-outer-widgets-2 a:hover/color" => "#227ad1",
		"#horizontal-outer-widgets-2 a:focus/color" => "#227ad1",
		"#horizontal-outer-widgets-2 a:active/color" => "#227ad1",
	),

	"light-theme-gray-1" => array(
		"name" => "Gray Shade 1 on a light theme",
		"parent" => "root",

		"a/color" => "#787878",
		"a:visited/color" => "#787878",
		"a:hover/color" => "#787878",

		"#wrapper/border-color" => "#c0c0c0",
		"#wrapper/background-color" => "#f0f0f0",

		".blogtitle a:hover/color" => "#787878",

		".post .date/color" => "#ffffff",
		".post .date span/color" => "#ffffff",
		".post .date span.year/color" => "#ffffff",

		"#sidebar h3/color" => "#444444",
		"#sidebar h3:hover/color" => "#444444",
		"#sidebar h3 a/color" => "#444444",
		"#sidebar h3 a:visited/color" => "#444444",
		"#sidebar h3.scheme/color" => "#ffffff",
		"#sidebar h3.scheme:hover/color" => "#ffffff",
		"#sidebar h3.scheme a/color" => "#ffffff",
		"#sidebar h3.scheme a:visited/color" => "#ffffff",
		"#sidebar a:hover/color" => "#787878",
		"#sidebar a:focus/color" => "#787878",
		"#sidebar a:active/color" => "#787878",

		".widget_calendar a/color" => "#787878",

		"#horizontal-outer-widgets-1 a:hover/color" => "#787878",
		"#horizontal-outer-widgets-1 a:focus/color" => "#787878",
		"#horizontal-outer-widgets-1 a:active/color" => "#787878",

		"#horizontal-outer-widgets-2 a:hover/color" => "#787878",
		"#horizontal-outer-widgets-2 a:focus/color" => "#787878",
		"#horizontal-outer-widgets-2 a:active/color" => "#787878",
	),

	"dark-theme-gray-1" => array(
		"name" => "Gray Shade 1 on a dark theme",
		"parent" => "dark-theme,light-theme-gray-1",

		"a/color" => "#787878",
		"a:visited/color" => "#787878",
		"a:hover/color" => "#787878",

		".blogtitle a:hover/color" => "#787878",

		"#sidebar a:hover/color" => "#787878",
		"#sidebar a:focus/color" => "#787878",
		"#sidebar a:active/color" => "#787878",

		"#horizontal-outer-widgets-1 a:hover/color" => "#787878",
		"#horizontal-outer-widgets-1 a:focus/color" => "#787878",
		"#horizontal-outer-widgets-1 a:active/color" => "#787878",

		"#horizontal-outer-widgets-2 a:hover/color" => "#787878",
		"#horizontal-outer-widgets-2 a:focus/color" => "#787878",
		"#horizontal-outer-widgets-2 a:active/color" => "#787878",
	),

	"light-theme-gray-2" => array(
		"name" => "Gray Shade 2 on a light theme",
		"parent" => "root",

		"#wrapper/background-color" => "#f0f0f0",

		"a/color" => "#787878",
		"a:visited/color" => "#787878",
		"a:hover/color" => "#787878",

		"#sidebar a:hover/color" => "#787878",
		"#sidebar a:focus/color" => "#787878",
		"#sidebar a:active/color" => "#787878",

		"#horizontal-outer-widgets-1 a:hover/color" => "#787878",
		"#horizontal-outer-widgets-1 a:focus/color" => "#787878",
		"#horizontal-outer-widgets-1 a:active/color" => "#787878",

		"#horizontal-outer-widgets-2 a:hover/color" => "#787878",
		"#horizontal-outer-widgets-2 a:focus/color" => "#787878",
		"#horizontal-outer-widgets-2 a:active/color" => "#787878",
	),

	"dark-theme-gray-2" => array(
		"name" => "Gray Shade 2 on a dark theme",
		"parent" => "dark-theme,light-theme-gray-2",

		"a/color" => "#787878",
		"a:visited/color" => "#787878",
		"a:hover/color" => "#787878",

		".blogtitle a:hover/color" => "#787878",

		"#sidebar a:hover/color" => "#787878",
		"#sidebar a:focus/color" => "#787878",
		"#sidebar a:active/color" => "#787878",

		"#horizontal-outer-widgets-1 a:hover/color" => "#787878",
		"#horizontal-outer-widgets-1 a:focus/color" => "#787878",
		"#horizontal-outer-widgets-1 a:active/color" => "#787878",

		"#horizontal-outer-widgets-2 a:hover/color" => "#787878",
		"#horizontal-outer-widgets-2 a:focus/color" => "#787878",
		"#horizontal-outer-widgets-2 a:active/color" => "#787878",
	),

	"light-theme-red" => array(
		"name" => "Red on a light theme",
		"parent" => "root",

		"a/color" => "#8a1717",
		"a:visited/color" => "#8a1717",
		"a:hover/color" => "#8a1717",

		"#wrapper/background-color" => "#f0f0f0",

		"#sidebar a:hover/color" => "#8a1717",
		"#sidebar a:focus/color" => "#8a1717",
		"#sidebar a:active/color" => "#8a1717",

		"#horizontal-outer-widgets-1 a:hover/color" => "#8a1717",
		"#horizontal-outer-widgets-1 a:focus/color" => "#8a1717",
		"#horizontal-outer-widgets-1 a:active/color" => "#8a1717",

		"#horizontal-outer-widgets-2 a:hover/color" => "#8a1717",
		"#horizontal-outer-widgets-2 a:focus/color" => "#8a1717",
		"#horizontal-outer-widgets-2 a:active/color" => "#8a1717",
	),

	"dark-theme-red" => array(
		"name" => "Red on a dark theme",
		"parent" => "dark-theme,light-theme-red",

		"a/color" => "#8a1717",
		"a:visited/color" => "#8a1717",
		"a:hover/color" => "#8a1717",

		".blogtitle a:hover/color" => "#8a1717",

		"#sidebar a:hover/color" => "#8a1717",
		"#sidebar a:focus/color" => "#8a1717",
		"#sidebar a:active/color" => "#8a1717",

		"#horizontal-outer-widgets-1 a:hover/color" => "#8a1717",
		"#horizontal-outer-widgets-1 a:focus/color" => "#8a1717",
		"#horizontal-outer-widgets-1 a:active/color" => "#8a1717",

		"#horizontal-outer-widgets-2 a:hover/color" => "#8a1717",
		"#horizontal-outer-widgets-2 a:focus/color" => "#8a1717",
		"#horizontal-outer-widgets-2 a:active/color" => "#8a1717",

		"#wrapper/background-color" => "#000000",
	),

	"light-theme-orange" => array(
		"name" => "Orange on a light theme",
		"parent" => "root",

		"a/color" => "#d05e0b",
		"a:visited/color" => "#d05e0b",
		"a:hover/color" => "#d05e0b",

		"#wrapper/background-color" => "#f0f0f0",

		"#sidebar a:hover/color" => "#d05e0b",
		"#sidebar a:focus/color" => "#d05e0b",
		"#sidebar a:active/color" => "#d05e0b",

		"#horizontal-outer-widgets-1 a:hover/color" => "#d05e0b",
		"#horizontal-outer-widgets-1 a:focus/color" => "#d05e0b",
		"#horizontal-outer-widgets-1 a:active/color" => "#d05e0b",

		"#horizontal-outer-widgets-2 a:hover/color" => "#d05e0b",
		"#horizontal-outer-widgets-2 a:focus/color" => "#d05e0b",
		"#horizontal-outer-widgets-2 a:active/color" => "#d05e0b",
	),

	"dark-theme-orange" => array(
		"name" => "Orange on a dark theme",
		"parent" => "dark-theme,light-theme-orange",

		"a/color" => "#d05e0b",
		"a:visited/color" => "#d05e0b",
		"a:hover/color" => "#d05e0b",

		".blogtitle a:hover/color" => "#d05e0b",

		"#sidebar a:hover/color" => "#d05e0b",
		"#sidebar a:focus/color" => "#d05e0b",
		"#sidebar a:active/color" => "#d05e0b",

		"#horizontal-outer-widgets-1 a:hover/color" => "#d05e0b",
		"#horizontal-outer-widgets-1 a:focus/color" => "#d05e0b",
		"#horizontal-outer-widgets-1 a:active/color" => "#d05e0b",

		"#horizontal-outer-widgets-2 a:hover/color" => "#d05e0b",
		"#horizontal-outer-widgets-2 a:focus/color" => "#d05e0b",
		"#horizontal-outer-widgets-2 a:active/color" => "#d05e0b",

		"#wrapper/background-color" => "#000000",
	),

	"light-theme-purple" => array(
		"name" => "Purple on a light theme",
		"parent" => "root",

		"a/color" => "#af0a4f",
		"a:visited/color" => "#af0a4f",
		"a:hover/color" => "#af0a4f",

		"#wrapper/background-color" => "#fafafa",

		"#sidebar a:hover/color" => "#af0a4f",
		"#sidebar a:focus/color" => "#af0a4f",
		"#sidebar a:active/color" => "#af0a4f",

		"#horizontal-outer-widgets-1 a:hover/color" => "#af0a4f",
		"#horizontal-outer-widgets-1 a:focus/color" => "#af0a4f",
		"#horizontal-outer-widgets-1 a:active/color" => "#af0a4f",

		"#horizontal-outer-widgets-2 a:hover/color" => "#af0a4f",
		"#horizontal-outer-widgets-2 a:focus/color" => "#af0a4f",
		"#horizontal-outer-widgets-2 a:active/color" => "#af0a4f",
	),

	"dark-theme-purple" => array(
		"name" => "Orange on a dark theme",
		"parent" => "dark-theme,light-theme-purple",

		"a/color" => "#af0a4f",
		"a:visited/color" => "#af0a4f",
		"a:hover/color" => "#af0a4f",

		".blogtitle a:hover/color" => "#af0a4f",

		"#sidebar a:hover/color" => "#af0a4f",
		"#sidebar a:focus/color" => "#af0a4f",
		"#sidebar a:active/color" => "#af0a4f",

		"#horizontal-outer-widgets-1 a:hover/color" => "#af0a4f",
		"#horizontal-outer-widgets-1 a:focus/color" => "#af0a4f",
		"#horizontal-outer-widgets-1 a:active/color" => "#af0a4f",

		"#horizontal-outer-widgets-2 a:hover/color" => "#af0a4f",
		"#horizontal-outer-widgets-2 a:focus/color" => "#af0a4f",
		"#horizontal-outer-widgets-2 a:active/color" => "#af0a4f",

		"#wrapper/background-color" => "#000000",
	),

	"minima" => array(
		".blogtitle a/color" => "#555555",
		"body/background-color" => "#ffffff",
		"body/background-image" => '',
	),

	"photonique" => array(
		".blogtitle a/color" => "#00aaff",
		"body/background-color" => "#000000",
		"body/background-image" => '',
	),

	"scribbles" => array(
		".blogtitle a/color" => "#664422",
		"body/background-image" => trailingslashit(get_template_directory_uri()).'images/wood.jpg',
	),
);
$suf_element_mapping = array(
	"suf_body_background_color" => "body/background-color",
	"suf_body_background_image" => "body/background-image",
	"suf_font_color" => "body/color",
	"suf_link_color" => "a/color",
	"suf_link_style" => "a/text-decoration",
	"suf_visited_link_color" => "a:visited/color",
	"suf_visited_link_style" => "a:visited/text-decoration",
	"suf_link_hover_color" => "a:hover/color",
	"suf_link_hover_style" => "a:hover/text-decoration",
	"suf_blog_title_color" => ".blogtitle a/color",
	"suf_blog_title_style" => ".blogtitle a/text-decoration",
	"suf_blog_title_hover_color" => ".blogtitle a:hover/color",
	"suf_blog_title_hover_style" => ".blogtitle a:hover/text-decoration",
	"suf_blog_description_color" => ".description/color",
	"suf_sb_font_color" => "#sidebar/color",
	"suf_sb_link_color" => "#sidebar a/color",
	"suf_sb_link_style" => "#sidebar a/text-decoration",
	"suf_sb_visited_link_color" => "#sidebar a:visited/color",
	"suf_sb_visited_link_style" => "#sidebar a:visited/text-decoration",
	"suf_sb_link_hover_color" => "#sidebar a:hover/color",
	"suf_sb_link_hover_style" => "#sidebar a:hover/text-decoration",

	"suf_wabh_font_color" => "#horizontal-outer-widgets-1/color",
	"suf_wabh_link_color" => "#horizontal-outer-widgets-1 a/color",
	"suf_wabh_link_style" => "#horizontal-outer-widgets-1 a/text-decoration",
	"suf_wabh_visited_link_color" => "#horizontal-outer-widgets-1 a:visited/color",
	"suf_wabh_visited_link_style" => "#horizontal-outer-widgets-1 a:visited/text-decoration",
	"suf_wabh_link_hover_color" => "#horizontal-outer-widgets-1 a:hover/color",
	"suf_wabh_link_hover_style" => "#horizontal-outer-widgets-1 a:hover/text-decoration",

	"suf_waaf_font_color" => "#horizontal-outer-widgets-2/color",
	"suf_waaf_link_color" => "#horizontal-outer-widgets-2 a/color",
	"suf_waaf_link_style" => "#horizontal-outer-widgets-2 a/text-decoration",
	"suf_waaf_visited_link_color" => "#horizontal-outer-widgets-2 a:visited/color",
	"suf_waaf_visited_link_style" => "#horizontal-outer-widgets-2 a:visited/text-decoration",
	"suf_waaf_link_hover_color" => "#horizontal-outer-widgets-2 a:hover/color",
	"suf_waaf_link_hover_style" => "#horizontal-outer-widgets-2 a:hover/text-decoration",

	"suf_download_font_color" => ".download/color",
	"suf_download_background_color" => ".download/background-color",
	"suf_download_border_color" => ".download/border-color",
	"suf_announcement_font_color" => ".announcement/color",
	"suf_announcement_background_color" => ".announcement/background-color",
	"suf_announcement_border_color" => ".announcement/border-color",
	"suf_warning_font_color" => ".warning/color",
	"suf_warning_background_color" => ".warning/background-color",
	"suf_warning_border_color" => ".warning/border-color",
	"suf_note_font_color" => ".note/color",
	"suf_note_background_color" => ".note/background-color",
	"suf_note_border_color" => ".note/border-color",
	"suf_wrapper_background_color" => "#wrapper/background-color",
	"suf_post_background_color" => ".post/background-color",
);

function suffusion_evaluate_style($style_name, $suffusion_theme_name = "root", $null_return = 'default') {
	global $suf_theme_definitions, $suf_element_mapping;
	if (isset($suf_element_mapping[$style_name])) {
		$mapped_style = $suf_element_mapping[$style_name];
		if (isset($suf_theme_definitions[$suffusion_theme_name])) {
			$style_settings = $suf_theme_definitions[$suffusion_theme_name];
			if (isset($style_settings[$mapped_style])) {
				return $style_settings[$mapped_style];
			}
			else {
				if (isset($style_settings["parent"])) {
					$parent = $style_settings["parent"];
					$ancestors = explode(",",$parent);
					foreach ($ancestors as $ancestor) {
						$recursive = suffusion_evaluate_style($style_name, $ancestor, $null_return);
						if ($recursive != null) {
							return $recursive;
						}
					}
				}
			}
		}
	}
	if ($null_return == 'empty') {
		return '';
	}
	return '#ffffff';
}
?>