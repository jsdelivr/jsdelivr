<?php
/**
 * The Suffusion_Device class will handle responsive aspects of Suffusion.
 * There are a bunch of is_* functions that have been taken from the mobble plugin (http://wordpress.org/extend/plugins/mobble/)
 *
 * @package Suffusion
 * @subpackage Library
 * @since 4.2.4
 */
class Suffusion_Device {
	var $user_agent;

	function __construct() {
		$this->user_agent = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : "";
		add_filter('body_class', array(&$this, 'body_class'), 10, 2);
	}

	/**
	 * Detect the iPhone.
	 * Borrowed from the "mobble" plugin
	 *
	 * @return int
	 */
	function is_iphone() {
		return(preg_match('/iphone/i',$this->user_agent));
	}

	/**
	 * Detect the iPad.
	 * Borrowed from the "mobble" plugin
	 *
	 * @return int
	 */
	function is_ipad() {
		return(preg_match('/ipad/i',$this->user_agent));
	}

	/**
	 * Detect the iPod.
	 * Borrowed from the "mobble" plugin
	 *
	 * @return int
	 */
	function is_ipod() {
		return(preg_match('/ipod/i',$this->user_agent));
	}

	/**
	 * Detect an Android device.
	 * Borrowed from the "mobble" plugin
	 *
	 * @return int
	 */
	function is_android() {
		return(preg_match('/android/i',$this->user_agent));
	}

	/**
	 * Detect a Blackberry device.
	 * Borrowed from the "mobble" plugin
	 *
	 * @return int
	 */
	function is_blackberry() {
		return(preg_match('/blackberry/i',$this->user_agent));
	}

	/**
	 * Detect the the Opera Mini and Opera Mobile browsers.
	 * Borrowed from the "mobble" plugin
	 *
	 * @return int
	 */
	function is_opera_mobile() {
		return(preg_match('/opera mini/i',$this->user_agent));
	}

	/**
	 * Detect a Palm
	 * Borrowed from the "mobble" plugin.
	 *
	 * @return int
	 */
	function is_palm() {
		return(preg_match('/webOS/i', $this->user_agent));
	}

	/**
	 * Detect a Symbian device (typically a Nokia)
	 * Borrowed from the "mobble" plugin
	 *
	 * @return bool
	 */
	function is_symbian() {
		return(preg_match('/Series60/i', $this->user_agent) || preg_match('/Symbian/i', $this->user_agent));
	}

	/**
	 * Detect a Windows Mobile phone
	 * Borrowed from the "mobble" plugin
	 *
	 * @return bool
	 */
	function is_windows_mobile() {
		return(preg_match('/WM5/i', $this->user_agent) || preg_match('/WindowsMobile/i', $this->user_agent));
	}

	/**
	 * Detect an LG phone
	 * Borrowed from the "mobble" plugin
	 *
	 * @return int
	 */
	function is_lg() {
		return(preg_match('/LG/i', $this->user_agent));
	}

	/**
	 * Detect a Motorola phone
	 * Borrowed from the "mobble" plugin
	 *
	 * @return bool
	 */
	function is_motorola() {
		return(preg_match('/\ Droid/i', $this->user_agent) || preg_match('/XT720/i', $this->user_agent) || preg_match('/MOT-/i', $this->user_agent) || preg_match('/MIB/i', $this->user_agent));
	}

	/**
	 * Detect a Nokia phone
	 * Borrowed from the "mobble" plugin
	 *
	 * @return bool
	 */
	function is_nokia() {
		return(preg_match('/Series60/i', $this->user_agent) || preg_match('/Symbian/i', $this->user_agent) || preg_match('/Nokia/i', $this->user_agent));
	}

	/**
	 * Detect a Samsung phone
	 * Borrowed from the "mobble" plugin
	 *
	 * @return int
	 */
	function is_samsung() {
		return(preg_match('/Samsung/i', $this->user_agent));
	}

	/**
	 * Detect a Samsung Galaxy tablet
	 * Borrowed from the "mobble" plugin
	 *
	 * @return int
	 */
	function is_samsung_galaxy_tab() {
		return(preg_match('/SPH-P100/i', $this->user_agent));
	}

	/**
	 * Detect a Sony Ericsson phone
	 * Borrowed from the "mobble" plugin
	 *
	 * @return int
	 */
	function is_sony_ericsson() {
		return(preg_match('/SonyEricsson/i', $this->user_agent));
	}

	/**
	 * Detect a Nintendo DS or DSi
	 * Borrowed from the "mobble" plugin
	 *
	 * @return bool
	 */
	function is_nintendo() {
		return(preg_match('/Nintendo DSi/i', $this->user_agent) || preg_match('/Nintendo DS/i', $this->user_agent));
	}

	/**
	 * Detect any handheld device
	 * Borrowed from the "mobble" plugin
	 *
	 * @return bool
	 */
	function is_handheld() {
		return($this->is_iphone() || $this->is_ipad() || $this->is_ipod() || $this->is_android() || $this->is_blackberry() ||
				$this->is_opera_mobile() || $this->is_palm() || $this->is_symbian() || $this->is_windows_mobile() || $this->is_lg() ||
				$this->is_motorola() || $this->is_nokia() || $this->is_samsung() || $this->is_samsung_galaxy_tab() || $this->is_sony_ericsson() || $this->is_nintendo());
	}

	/**
	 * Detect any mobile phone
	 * Borrowed from the "mobble" plugin
	 *
	 * @return bool
	 */
	function is_mobile() {
		if ($this->is_tablet()) {
			return false;  // this catches the problem where an Android device may also be a tablet device
		}
		return($this->is_iphone() || $this->is_ipod() || $this->is_android() || $this->is_blackberry() || $this->is_opera_mobile() ||
				$this->is_palm() || $this->is_symbian() || $this->is_windows_mobile() || $this->is_lg() || $this->is_motorola() ||
				$this->is_nokia() || $this->is_samsung() || $this->is_sony_ericsson() || $this->is_nintendo());
	}

	/**
	 * Detect an iOS device
	 * Borrowed from the "mobble" plugin
	 *
	 * @return bool
	 */
	function is_ios() {
		return($this->is_iphone() || $this->is_ipad() || $this->is_ipod());
	}

	/**
	 * Detect a tablet
	 * Borrowed from the "mobble" plugin
	 *
	 * @return bool
	 */
	function is_tablet() {
		return($this->is_ipad() || $this->is_samsung_galaxy_tab());
	}

	/**
	 * Adds device-specific classes to the "body" element
	 * @param array $classes
	 * @param string $class
	 * @return array
	 */
	function body_class($classes = array(), $class = '') {
		// top level
		if ($this->is_handheld()) { $classes[] = "device-handheld"; };
		if (!$this->is_handheld()) { $classes[] = "device-desktop"; }
		if ($this->is_mobile()) { $classes[] = "device-mobile"; };
		if ($this->is_ios()) { $classes[] = "device-ios"; };
		if ($this->is_tablet()) { $classes[] = "device-tablet"; };

		// specific
		if ($this->is_iphone()) { $classes[] = "device-iphone"; };
		if ($this->is_ipad()) { $classes[] = "device-ipad"; };
		if ($this->is_ipod()) { $classes[] = "device-ipod"; };
		if ($this->is_android()) { $classes[] = "device-android"; };
		if ($this->is_blackberry()) { $classes[] = "device-blackberry"; };
		if ($this->is_opera_mobile()) { $classes[] = "device-opera-mobile";}
		if ($this->is_palm()) { $classes[] = "device-palm";}
		if ($this->is_symbian()) { $classes[] = "device-symbian";}
		if ($this->is_windows_mobile()) { $classes[] = "device-windows-mobile"; }
		if ($this->is_lg()) { $classes[] = "device-lg"; }
		if ($this->is_motorola()) { $classes[] = "device-motorola"; }
		if ($this->is_nokia()) { $classes[] = "device-nokia"; }
		if ($this->is_samsung()) { $classes[] = "device-samsung"; }
		if ($this->is_samsung_galaxy_tab()) { $classes[] = "device-samsung-galaxy-tab"; }
		if ($this->is_sony_ericsson()) { $classes[] = "device-sony-ericsson"; }
		if ($this->is_nintendo()) { $classes[] = "device-nintendo"; }

		return array_unique($classes);
	}
}

function suffusion_device_init() {
	global $suffusion_device;
	$suffusion_device = new Suffusion_Device();
}

add_action('init', 'suffusion_device_init');