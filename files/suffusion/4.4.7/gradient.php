<?php
/**
 * Dynamic gradient generator
 *
 * @package Suffusion
 * @subpackage Templates
 */

$mime_type = "image/png";
$extension = ".png";
$send_buffer_size = 4096;

// check for GD support
if(!function_exists('ImageCreate')) {
    //fatal_error('Error: Server does not support PHP image generation') ;
}
else {
	if (isset($_GET["start"])) {
		$req_start = $_GET["start"];
	}
	else {
		$req_start = "#FFFFFF";
	}

	if (isset($_GET["finish"])) {
		$req_finish = $_GET["finish"];
	}
	else {
		$req_finish = "#FFFFFF";
	}

	if (isset($_GET["width"])) {
		$width = $_GET["width"];
	}
	else {
		$width = "1000";
	}

	if (isset($_GET["height"])) {
		$height = $_GET["height"];
	}
	else {
		$height = "120";
	}

	// Legal directions: top-down, down-top, left-right, right-left, topleft-bottomright, topright-bottomleft
	// bottomleft-topright, bottomright-topleft, middle-outwards, inwards-middle, radial-outwards, inwards-radial
	if (isset($_GET["direction"])) {
		$direction = $_GET["direction"];
	}
	else {
		$direction = "top-down";
	}

	$grad_image = imagecreatetruecolor($width, $height);

	$rgb_start = hex_to_rgb($req_start);
	$rgb_finish = hex_to_rgb($req_finish);

	$startx = 0;
	$endx = $width;
	$starty = 0;
	$endy = $height;

	switch ($direction) {
	case "top-down":
		$start = $rgb_start;
		$finish = $rgb_finish;
		$limit = $height;
		break;
	case "down-top":
		$start = $rgb_finish;
		$finish = $rgb_start;
		$limit = $height;
		break;
	case "left-right":
		$start = $rgb_start;
		$finish = $rgb_finish;
		$limit = $width;
		break;
	case "right-left":
		$start = $rgb_finish;
		$finish = $rgb_start;
		$limit = $width;
		break;
	default:
		$start = $rgb_start;
		$finish = $rgb_finish;
		$limit = $height;
	}

	$step_r = ($finish['red'] - $start['red']) / $limit;
	$step_g = ($finish['green'] - $start['green']) / $limit;
	$step_b = ($finish['blue'] - $start['blue']) / $limit;

	for ($i=0; $i<$limit; $i++) {
		$r = floor(($finish['red'] - $start['red'] != 0) ? $start['red'] + $step_r * $i : $start['red']);
		$g = floor(($finish['green'] - $start['green'] != 0) ? $start['green'] + $step_g * $i : $start['green']);
		$b = floor(($finish['blue'] - $start['blue'] != 0) ? $start['blue'] + $step_b * $i : $start['blue']);
		//echo "$i -> $r $g $b<br/>";
		//echo ($i/$limit)."<br />";
		$color = imagecolorallocate($grad_image, $r, $g, $b);
		switch ($direction) {
		case "top-down":
		case "down-top":
			$x1 = $startx;
			$y1 = $i;
			$x2 = $endx;
			$y2 = $i;
			break;
		case "left-right":
		case "right-left":
			$x1 = $i;
			$y1 = $starty;
			$x2 = $i;
			$y2 = $endy;
			break;
		default:
			$start = $rgb_start;
			$finish = $rgb_finish;
			$limit = $height;
		}

		$success = imageline($grad_image, $x1, $y1, $x2, $y2, $color);
	}

	header("Content-Type: image/jpeg");
	imagejpeg($grad_image, NULL, 70);
}

/* 
    decode an HTML hex-code into an array of R,G, and B values.
    accepts these formats: (case insensitive) #ffffff, ffffff, #fff, fff 
*/    
function hex_to_rgb($hex) {
    // remove '#'
    if(substr($hex,0,1) == '#')
        $hex = substr($hex,1) ;

    // expand short form ('fff') color
    if(strlen($hex) == 3)
    {
        $hex = substr($hex,0,1) . substr($hex,0,1) .
               substr($hex,1,1) . substr($hex,1,1) .
               substr($hex,2,1) . substr($hex,2,1) ;
    }

	if(strlen($hex) != 6) {
		$rgb['red'] = hexdec("ff");
		$rgb['green'] = hexdec("ff");
		$rgb['blue'] = hexdec("ff");
	}
	else {
	    // convert
		$rgb['red'] = hexdec(substr($hex,0,2)) ;
	    $rgb['green'] = hexdec(substr($hex,2,2)) ;
		$rgb['blue'] = hexdec(substr($hex,4,2)) ;
	}

    return $rgb ;
}
?>
