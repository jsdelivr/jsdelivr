<?php
function rpHash($value) { 
    $hash = 5381; 
    $value = strtoupper($value); 
    for($i = 0; $i < strlen($value); $i++) { 
        $hash = (($hash << 5) + $hash) + ord(substr($value, $i)); 
		//$hash = (leftShift32($hash, 5) + $hash) + ord(substr($value, $i)); 
    } 
    return $hash; 
} 
 
// Perform a 32bit left shift 
function leftShift32($number, $steps) { 
    // convert to binary (string) 
    $binary = decbin($number); 
    // left-pad with 0's if necessary 
    $binary = str_pad($binary, 32, "0", STR_PAD_LEFT); 
    // left shift manually 
    $binary = $binary.str_repeat("0", $steps); 
    // get the last 32 bits 
    $binary = substr($binary, strlen($binary) - 32); 
    // if it's a positive number return it 
    // otherwise return the 2's complement 
    return ($binary{0} == "0" ? bindec($binary) : 
        -(pow(2, 31) - bindec(substr($binary, 1)))); 
} 
?>

<?php
if (rpHash($_POST['defaultReal']) == $_POST['defaultRealHash']) {
?>success<?php
} else {
?>
error
<?php
}
?>

