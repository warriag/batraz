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

/*
 *  OBSOLETE ????????????????????????????
 */
function leader_header_setting(){
    global $post;
    
     // verifica esistenza classe BTZ_Otp_Options
    if( !class_exists( 'BTZ_Otp_Options' ) )
        return false;
    
     // verifica esistenza classe BTZ_Leaders_Helper 
     if(!class_exists('BTZ_Leaders_Helper'))
         return false;
    
    $redirect = get_post_meta( $post->ID, BTZ_Otp_Options::LEADER_META_REDIRECT_KEY, true );
    if($redirect)return;
 
    
    $taxleader = get_post_meta( $post->ID, BTZ_Otp_Options::LEADER_META_FIELD_KEY, true );
    if(!$taxleader)return;
    
    $show_desc = get_post_meta( $post->ID, BTZ_Otp_Options::LEADER_META_SHOW_DESC_KEY, true );
    
    $result = BTZ_Leaders_Helper::otp_get_leaders_svc($taxleader, 0, 20);
    $result['show_desc'] = (bool)$show_desc;
    return $result;
    
}


?>
