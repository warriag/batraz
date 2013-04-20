<?php
/**
 * Plugin Name: BTZ Custom Mime-Types Helper
 * Description: A plugins for adding mime-types.
 * Version: 0.1
 * Author: Aisartag
 * Author URI: http://aisartag.worpress.com
 */

add_filter('upload_mimes', 'custom_upload_mimes');
function custom_upload_mimes ( $existing_mimes=array() ) {
 
        //var_dump($existing_mimes);
	//add your ext => mime to the array
	$existing_mimes['webm'] = 'video/webm';
 
	// add as many as you like
 
	// and return the new full result
	return $existing_mimes;
 
}

?>