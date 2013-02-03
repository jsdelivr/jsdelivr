<?php
/**
 * Easy example script to store uploaded files
 * in the filesystem, make shure that the folder is writeable
 */

class upload {

	public function writeFile($rawContent) {
		$headers = getallheaders();
		$filename = $headers['X-File-Name'];
		$filecontent = $rawContent;

		$fp = fopen($filename, 'w');
		fwrite($fp, $filecontent);
		fclose($fp);

		return $filename;
	}

}

$file = new upload();
echo $file->writeFile($HTTP_RAW_POST_DATA);

?>