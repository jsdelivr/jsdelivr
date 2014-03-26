<?php
header("Cache-Control: no-cache, must-revalidate");

/**
 * Imagemagick (image edit) command
 */			
function imageMagickExec($cmd){
	//clean up CMD
	exec($cmd,$output,$return);
	
	if($return == 0){ //0 = good
		return $output;	
	}else{
		return false;
	}
}

//cors for html5
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
	header('Access-Control-Allow-Origin: '.$_SERVER['HTTP_HOST']);
	exit;
}else{
	header('Access-Control-Allow-Origin: '.$_SERVER['HTTP_HOST']);	
}

if($_FILES['Filedata']['name']){	
	//check if image http://www.w3schools.com/media/media_mimeref.asp
	if(preg_match("#(jpg|jpeg|png)$#i",$_FILES['Filedata']['type'])){
		
		$target_path_file = "";//don't allow 3rd party to choose a unsecure name
		
		if(move_uploaded_file($_FILES['Filedata']['tmp_name'], $target_path_file)) {
			
				//
				if($_POST['top'] >= 0){
					$_POST['top'] = "-".$_POST['top'];	
				}else{
					$_POST['top'] = "+". (0 - $_POST['top']);	
				}
				if($_POST['left'] >= 0){
					$_POST['left'] = "-".$_POST['left'];	
				}else{
					$_POST['left'] = "+". (0 -$_POST['left']);	
				}
				
				//valid resize needed
				if(is_numeric($_POST['width']) && is_numeric($_POST['height'])){ 
				
					$cmd = "/usr/bin/convert ".(is_numeric($_POST['resize']) ? "-resize ". (100/(float)$_POST['resize'])."%" : "")." -colorspace RGB -crop ".(int)$_POST['width']."x".(int)$_POST['height'].(int)$_POST['left'].(int)$_POST['top']."\! ".$target_path_file." ".$target_path_file."";//overwrite resized image
				
					$result = imageMagickExec($cmd);
					if($result){
						list($width_image, $height_image, $type, $attr) = @getimagesize($target_path_file);
						$saved_file = str_ireplace(WEBROOT,"/",$target_path_file);//original	
						echo json_encode(array("status"=>1,"file"=>$saved_file_crop,"width"=>$width_image,"height"=>$height_image));
						
					}else{
						
					}
				}else{
					return;//echo unresized image?
				}
		}else{
			echo json_encode(array("status"=>0));
		}
	}else{
		echo json_encode(array("status"=>0));
	}
		
}elseif($_GET['proxy'] && strlen($_GET['proxy']) > 7){
	
	$proxy_url = @parse_url($_GET['proxy']);//must be valid url to work
	if($proxy_url && $proxy_url['scheme'] == "http" || $proxy_url['scheme'] == "https"){

		header("Content-type: binary/octet-stream");//savest since will force download
		echo file_get_contents($proxy_url);//best is to use curl
		flush();
	}else{
		//error image?
	}
}