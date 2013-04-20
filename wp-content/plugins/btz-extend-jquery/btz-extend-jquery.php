<?php
/**
 * Plugin Name: BTZ shared script
 * Description: caricamento script e style condivisi
 * Version: 0.1
 * Author: Aisartag
 * Author URI: http://aisartag.worpress.com
 */

// --------------------
// --  PLUGIN ADMIN HOOKS  --
// --------------------

add_action( 'admin_enqueue_scripts', 'batraz_script_load' );
function batraz_script_load($hook) {
   if($hook != 'plugins_page_otp-setting'){
       return;
   } 
    wp_enqueue_script('jquery');
    wp_enqueue_script('jquery-ui-core');
    wp_enqueue_script('jquery-ui-widget');
    wp_enqueue_script('jquery-ui-tabs');
     
}

// --------------------
// --  PLUGIN HOOKS  --
// --------------------

add_action( 'wp_enqueue_scripts', 'btz_shared_scripts' );
function btz_shared_scripts(){
    
     wp_register_script('btz-common', plugins_url('/js/common/btz-common.js', __FILE__),
                    array('jquery', 'jquery-ui-progressbar'));
     wp_enqueue_script( 'btz-common' );
    
    wp_register_script('mCustomScrollbar', plugins_url('/js/mCustomScrollbar/jquery.mCustomScrollbar.concat.min.js', __FILE__), array('jquery'));
    wp_enqueue_script( 'mCustomScrollbar' );
    
    wp_register_style('mCustomScrollbar-style', plugins_url('/js/mCustomScrollbar/jquery.mCustomScrollbar.css', __FILE__));
    wp_enqueue_style('mCustomScrollbar-style');
    
    
    wp_register_script('fancybox', plugins_url('/js/fancybox/jquery.fancybox.pack.js', __FILE__), array('jquery'));
    wp_enqueue_script( 'fancybox' );
    
    wp_register_style('fancybox-style', plugins_url('/js/fancybox/jquery.fancybox.css', __FILE__));
    wp_enqueue_style('fancybox-style');
    
    
    
}

require_once('flickr/class-btz-flickr.php');
new Btz_Flickr();


?>
