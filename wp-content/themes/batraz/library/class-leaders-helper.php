<?php

class BTZ_Leaders_Helper {
    const METHOD_SERVICE_LEADERS = 'ajax_leaders';
    
    function __construct() {

        add_action( 'wp_enqueue_scripts', array(&$this, 'load_scripts'));

        add_action('wp_ajax_' . self::METHOD_SERVICE_LEADERS , array(&$this, self::METHOD_SERVICE_LEADERS));
        add_action('wp_ajax_nopriv_' . self::METHOD_SERVICE_LEADERS , array(&$this, self::METHOD_SERVICE_LEADERS));

    }

    function load_scripts(){
        wp_register_script('btz-leaders', get_stylesheet_directory_uri() . '/js/btz-leaders.js',    array('jquery'));

        wp_localize_script( 'btz-leaders', 'leaders_ajax_object',
                array( 'ajax_url' => admin_url( 'admin-ajax.php' ),
                    'action_leaders' => self::METHOD_SERVICE_LEADERS ) ); 
        wp_enqueue_script( 'btz-leaders' );

     }
     
     function ajax_leaders(){
        
         if( isset($_POST['slug'])){
             $slug = $_POST['slug'];
             $result_query = self::otp_get_leaders_svc($slug, 0, 50);
             
             if($result_query && isset($result_query['data']) && isset($result_query['slug']) ){
                  global $post;
                  $tmp_post = $post;
                  $slug = $result_query['slug'];
                  
                 ;
                  foreach ($result_query['data'] as $post){
                      setup_postdata($post);
                      $result[] = array('permalink' => get_permalink(),
                                        'title' => esc_attr(the_title_attribute( 'echo=0' ) )  ,    
                                        'thumb' => BTZ_Options_Helper::get_thumbnail_indicator(),
                                        'term_link' => get_term_link( $post->slug, $slug ),
                                        'term_name' => $post->term_name,
                                  );
                      
                  }
                 
                  $post = $tmp_post;
                  echo json_encode($result);
             }
             
         }
         die();
     }
     
     
     public static function getInstance(){
         return new BTZ_Leaders_Helper();
     }
     
     /*--------------------------------------------------------------------------------------------------
      *  CUSTOM QUERY LEADERS
      --------------------------------------------------------------------------------------------------*/
     public static function otp_get_leaders_redirect(){
         global $wpdb, $wp_query,  $post;

         $redirect = get_post_meta( $post->ID, BTZ_Otp_Options::LEADER_META_REDIRECT_KEY, true );
         if(!$redirect)return;

         $taxleader = get_post_meta( $post->ID, BTZ_Otp_Options::LEADER_META_FIELD_KEY, true );
         if(!$taxleader)return;


         $total = "
              SELECT COUNT(*)
           FROM
            (
            SELECT MIN(tr.object_id) AS object_id,  leaders.term_taxonomy_id, tr.otp_order
            FROM
            (SELECT tr.term_taxonomy_id, MIN(tr.otp_order) as first
            FROM `wp_term_relationships` tr 
            GROUP BY tr.term_taxonomy_id
            ) as leaders
            INNER JOIN `wp_term_relationships` tr ON leaders.term_taxonomy_id = tr.term_taxonomy_id AND leaders.first = tr.otp_order
            GROUP BY term_taxonomy_id, otp_order
            ) as pivot
            INNER JOIN wp_term_taxonomy AS tt ON pivot.term_taxonomy_id = tt.term_taxonomy_id
            INNER JOIN wp_terms AS t ON t.term_id = tt.term_id
            INNER JOIN wp_posts pp ON pp.ID = pivot.object_id
            WHERE tt.taxonomy = '$taxleader'
             "; 

         $totalposts = $wpdb->get_var($total); 
         $ppp = intval(get_query_var('posts_per_page'));
         $wp_query->found_posts = $totalposts;
         $wp_query->max_num_pages = ceil($wp_query->found_posts / $ppp);
         $on_page = intval(get_query_var('paged'));
         if($on_page == 0){ $on_page = 1; }
         $offset = ($on_page-1) * $ppp;

         return self::otp_get_leaders_svc($taxleader, $offset, $ppp);

    }

    public static function otp_get_leaders_svc($taxleader, $startrow, $numrows){
        global $wp_query, $wpdb;

        $wp_query->request = "
                SELECT pp.*, tt.term_taxonomy_id, tt.taxonomy, t.term_id, t.name as term_name, t.slug
            FROM
            (
            SELECT MIN(tr.object_id) AS object_id,  leaders.term_taxonomy_id, tr.otp_order
            FROM
            (SELECT tr.term_taxonomy_id, MIN(tr.otp_order) as first
            FROM `wp_term_relationships` tr 
            GROUP BY tr.term_taxonomy_id
            ) as leaders
            INNER JOIN `wp_term_relationships` tr ON leaders.term_taxonomy_id = tr.term_taxonomy_id AND leaders.first = tr.otp_order
            GROUP BY term_taxonomy_id, otp_order
            ) as pivot
            INNER JOIN wp_term_taxonomy AS tt ON pivot.term_taxonomy_id = tt.term_taxonomy_id
            INNER JOIN wp_terms AS t ON t.term_id = tt.term_id
            INNER JOIN wp_posts pp ON pp.ID = pivot.object_id
            WHERE tt.taxonomy = '$taxleader'
            ORDER BY pp.post_title
            LIMIT $startrow , $numrows
         ";

        $sql_result = $wpdb->get_results($wp_query->request, OBJECT);
        $result = array('slug' => $taxleader, 'data' => $sql_result);

        wp_reset_query();

        return $result;
    }

}
?>
