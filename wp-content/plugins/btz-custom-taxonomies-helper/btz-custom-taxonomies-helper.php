<?php
/**
 * Plugin Name: BTZ Custom Taxonomies Helper
 * Description: A plugins for custom taxonomies.
 * Version: 0.1
 * Author: Aisartag
 * Author URI: http://aisartag.worpress.com
 */

/**
 * Description of taxonomy-helper
 *
 * @author syrdon
 */
class Custom_Taxonomies_Helper {
   
    public $before_row = '<div class="taxonomy-article">';
    public $after_row = '</div>';
    public $before_title = '<span class="taxonomy-title">';
    public $after_title = ': </span>';
    
    public function __construct() {
        if(is_admin()){
            add_filter('manage_posts_columns', array(&$this, 'add_custom_columns'));
            add_action('manage_posts_custom_column', array(&$this, 'show_custom_columns'), 10, 2);
            add_action( 'restrict_manage_posts', array(&$this, 'restrict_manage_posts') );
        }
    }
    
    function add_custom_columns($columns) {
        global $typenow;
       //  var_dump(get_post_type());
         // var_dump($typenow);
        $taxonomies = get_taxonomies(array('public' => true, '_builtin' => false), 'objects');
        //var_dump($taxonomies);
        $newcolumns = array();
        foreach ($taxonomies as $t){
             // var_dump($t->object_type);
              if( in_array($typenow,  $t->object_type))
             // if(array_key_exists($typenow, $t->supports))
                $newcolumns[$t->rewrite['slug']] =  $t->labels->name;
        }

        return array_merge( $columns, $newcolumns);

    }
    
    function show_custom_columns($column, $post_id) {
 
        $terms = get_the_term_list( $post_id , $column , '' , ',' , '' );
        if ( is_string( $terms ) ) {
                echo $terms;
        } 

    }
    
    function restrict_manage_posts() {
        
        global $typenow;
        
        $filters = get_taxonomies(array('public' => true, '_builtin' => false), 'names');
      
        foreach ($filters as $tax_slug) {
            // retrieve the taxonomy object
            $tax_obj = get_taxonomy($tax_slug);

             if( !in_array($typenow,  $tax_obj->object_type)) continue;


            $tax_name = $tax_obj->labels->name;
            $tax_singular_name = $tax_obj->labels->singular_name;
            // retrieve array of term objects per taxonomy
            $terms = get_terms($tax_slug);
           // var_dump($terms);

            // output html for taxonomy dropdown filter
            echo "<select name='$tax_slug' id='$tax_slug' class='postform'>";
            echo "<option value=''>Ogni $tax_singular_name</option>";
            foreach ($terms as $term) {
                // output each select option line, check against the last $_GET to show the current option selected
                echo '<option value='. $term->slug, (isset($_GET[$tax_slug]) && $_GET[$tax_slug] == $term->slug) ? ' selected="selected"' : '','>' . $term->name .' (' . $term->count .')</option>';
            }
            echo "</select>";
        }
       
    }
    
    
    public function the_taxonomies_list(){
        $taxonomies = $this->get_categories_list() . $this->get_tag_list() . $this->get_custom_taxonomies_list();
        if(!empty($taxonomies)){
            $taxonomies = '<div class="taxonomies-article">' . $taxonomies . '</div>';
        }
        echo $taxonomies;
    }

    public function get_categories_list(){
        
        $categories_list = get_the_category_list( __( ', ', 'twentytwelve' ) );
        if(!empty($categories_list)){
            $categories_list = $this->before_row . $this->before_title . 'Categoria'  . $this->after_title . $categories_list . $this->after_row;
            
        }
        
        return $categories_list;
    }

    public function the_categories_list(){
        
        echo $this->get_categories_list();
        
    }
    
     public function get_tag_list(){
        
       
         
        $tag_list = get_the_tag_list( '', __( ', ', 'twentytwelve' ) );
        if(!empty($tag_list)){
            $tag_list = $this->before_row . $this->before_title . 'Tag'  . $this->after_title . $tag_list . $this->after_row;
            
        }
        
        return $tag_list;
    }

    public function the_tag_list(){
        
        echo $this->get_tag_list();
        
    }
    
    public function get_custom_taxonomies_list(){
        
        
        $taxonomies = get_taxonomies(array('public' => true, '_builtin' => false), 'objects');
       
        $links = '';
        foreach ($taxonomies as $taxonomy){
            $links .= $this->create_custom_taxonomy($taxonomy);
        }
        
//        if(!empty($links)){
//            $links = '<div class="taxonomies-article">' . $links . '</div>';
//        }
   
      //  var_dump($links);
        return $links;
        

    }
    
    public function the_custom_taxonomies_list(){
      
      
        echo $this->get_custom_taxonomies_list();
    }
    
    
    protected function create_custom_taxonomy($taxonomy){
        global $post;
        $before = '';
        $sep = ' '; 
        $after = '';
        
        $link = get_the_term_list( $post->ID, $taxonomy->rewrite['slug'], $before, $sep, $after);
        
        
        if(!empty($link)){
            $link = $this->before_row . $this->before_title . $taxonomy->labels->name  . $this->after_title . $link . $this->after_row;
        }
        
        return $link;
    }
    
    /**
    * Activate the plugin
    */
    public static function activate()
    {
       // Do nothing
    } // END public static function activate

    /**
     * Deactivate the plugin
     */     
    public static function deactivate()
    {
       // Do nothing
    } // END public static 

}


$custom_taxonomies_helper;
if(class_exists('Custom_Taxonomies_Helper'))
{
    global $custom_taxonomies_helper;
    // Installation and uninstallation hooks
    register_activation_hook(__FILE__, array('Custom_Taxonomies_Helper', 'activate'));
    register_deactivation_hook(__FILE__, array('Custom_Taxonomies_Helper', 'deactivate'));

    // instantiate the plugin class
    $custom_taxonomies_helper = new Custom_Taxonomies_Helper();
}

//function the_taxonomies_list(){
//    global $custom_taxonomies_helper;
//    
//    if(is_object($custom_taxonomies_helper)){
//        $custom_taxonomies_helper->the_taxonomies_list();
//    }
//}

if ( ! function_exists( 'twentytwelve_entry_meta' ) ) :
    function twentytwelve_entry_meta() {
        btz_entry_meta();
    }
endif;

if ( ! function_exists( 'twentyten_posted_in' ) ) :
    function twentyten_posted_in() {

        btz_entry_meta();
    }
endif;

function btz_entry_meta(){
    global $custom_taxonomies_helper;
    
    if(is_object($custom_taxonomies_helper)){
        $custom_taxonomies_helper->the_taxonomies_list();
    }

}


?>