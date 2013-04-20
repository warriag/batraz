<?php
/**
 * The class setup for post-content-shortcodes plugin
 * @version 0.3.2
 */
if( !class_exists( 'Btz_Popup' ) ) {
	/**
	 * Classe e metodi per implementazione del cloning content
	 */
	class Btz_Popup {
            
            protected $classLink = 'btz-popup-link';
            
            function __construct() {
                
           
                add_action( 'wp_enqueue_scripts', array(&$this, 'load_scripts'));

                add_action('wp_ajax_query_post', array(&$this, 'json_query_post'));
                add_action('wp_ajax_nopriv_query_post',array(&$this,'json_query_post'));
                
                add_shortcode("popup", array(&$this,"popup_function"));
                
                
            }
            
            function load_scripts(){
                wp_register_script('btzsc-script', plugins_url('/js/btz-popup.js', __FILE__), array('jquery'));
                wp_localize_script( 'btzsc-script', 'ajax_object',
                        array( 'ajax_url' => admin_url( 'admin-ajax.php' ), 'action' => 'query_post', 'class_link' => $this->classLink) ); 
                wp_enqueue_script( 'btzsc-script' );

            }

            
            function json_query_post() {
                global $wpdb;

                if(isset($_POST['id'])){
                    
                    $id = $_POST['id'];
                    $statement = '
                                SELECT p.post_title, p.post_content
                                FROM wp_posts p 
                                WHERE p.ID = %s AND p.post_status = \'publish\'
                                ';

                    $row = $wpdb->get_row($wpdb->prepare($statement, $id ));
                    if(!empty($row)){
                        $result['title'] = $row->post_title;
                        $result['content'] = $row->post_content;
                        
                    }else{
                        $result['title'] = 'Avvertenza';
                        $result['content'] = 'Nessun risultato relativo ai criteri specificati';
                    }

                    echo json_encode($result);
                }
                die();
            }
            
            function popup_function($atts, $content = null) {
                    global $post;
                    extract(shortcode_atts(array(
                            "post_type" => "post",
                            "id" => 0
                    ), $atts));
                    
                    if(empty($content)){
                        return;
                    }
                    
                    if(!is_numeric($id) || $id <= 0){
                        return;
                    }
                    
                    if($id == $post->ID){
                        return $content;
                    }
                    
                    
                    return '<a href="' . $post_type . '#' . $id . '" class="' . $this->classLink  . '" >' . $content . '</a>';
            }

            
            
        }
}
?>