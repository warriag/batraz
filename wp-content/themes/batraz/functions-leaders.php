<?php

/*
 * redirect template
 */
add_action( 'template_redirect', 'leader_template_redirect' );
function leader_template_redirect() {
    
    if(is_page()){
        

        if(isset($GLOBALS['leader_page_parms'])){
            unset($GLOBALS['leader_page_parms']);
        }
        $leaderarr = BTZ_Leaders_Helper::otp_get_leaders_redirect();
        if(!is_array($leaderarr))return;
        $GLOBALS['leader_page_parms'] = $leaderarr;
        add_filter( 'body_class', 'front_page_patch', 99 );
        include (STYLESHEETPATH . '/page-templates/leaders-redirect.php');
        exit;

    }
    
}

function front_page_patch($classes){
    return str_replace("template-front-page", "", $classes);
}


/*
 *  lista leaders nell'header della pagina
 */
function leader_header_ajax_setting(){
    
    // verifica esistenza classe BTZ_Otp_Options
    if( !class_exists( 'BTZ_Otp_Options' ) )
        return false;
    
    global $post;
    
    
    $redirect = get_post_meta( $post->ID, BTZ_Otp_Options::LEADER_META_REDIRECT_KEY, true );
    if($redirect)return false;
 
    
    $taxleader = get_post_meta( $post->ID, BTZ_Otp_Options::LEADER_META_FIELD_KEY, true );
    if(!$taxleader)return false;
    
    $show_desc = get_post_meta( $post->ID, BTZ_Otp_Options::LEADER_META_SHOW_DESC_KEY, true );
    
    $result = array('slug' => $taxleader, 'show_desc' => (bool)$show_desc);
    return $result;
    
}

function get_leaders_ppp_option(){
    $ppp = get_option(OPTION_LEADERS_PPP);
    $result = ($ppp) ? $ppp : 5;
    return $result;
}

function the_leaders_ppp_option(){
    echo get_leaders_ppp_option();
}
function get_leaders_speed_option(){
    $speed = get_option(OPTION_LEADERS_SPEED);
    $result = ($speed) ? $speed : 1;
    return $result;
}

function the_leaders_speed_option(){
    echo get_leaders_speed_option();
}

function get_debug_state(){
    return (WP_DEBUG) ? 1 : 0;
    
}
 
function the_debug_state(){
    echo get_debug_state();
    
}


?>
