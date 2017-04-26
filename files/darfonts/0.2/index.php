<?php header("Content-type: text/css; charset: UTF-8");
$fonts = explode('|', $_GET['font']);
foreach($fonts as $font)
{
    if(file_exists($font . '.php'))
    {
        include ($font . '.php');
    }
}
