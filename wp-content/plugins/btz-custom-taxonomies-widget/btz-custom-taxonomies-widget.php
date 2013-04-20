<?php
/**
 * Plugin Name: BTZ Custom Taxonomies Widget
 * Description: A widget for custom taxonomies.
 * Version: 0.1
 * Author: Aisartag
 * Author URI: http://aisartag.worpress.com
 */

/**
 * Custom Taxonomies widget class
 *
 * @since 2.8.0
 */
class WP_Widget_Custom_Taxonomies extends WP_Widget {

	function __construct() {
		$widget_ops = array( 'classname' => 'widget_custom_taxonomies', 'description' => __( "A list or dropdown of custom taxonomies" ) );
		parent::__construct('taxonomy_terms', __('Custom Taxonomies'), $widget_ops);
	}

	function widget( $args, $instance ) {
		extract( $args );

                $current_taxonomy = $this->_get_current_taxonomy( $instance );
                $tax_obj = get_taxonomy( $current_taxonomy );
                
		$title = apply_filters('widget_title', empty( $instance['title'] ) ? __( 'Categories' ) : $instance['title'], $instance, $this->id_base);
		$c = ! empty( $instance['count'] ) ? '1' : '0';
		$h = ! empty( $instance['hierarchical'] ) ? '1' : '0';
		$d = ! empty( $instance['dropdown'] ) ? '1' : '0';
                
                $w = $args['widget_id'];
                $w = 'ttw' . str_replace( 'taxonomy_terms-' , '' , $w );

		echo $before_widget;
		if ( $title )
			echo $before_title . $title . $after_title;

                $tax = $instance['taxonomy'];

		$cat_args = array('orderby' => 'name', 'show_count' => $c, 'hierarchical' => $h, 'taxonomy' => $tax);

		if ( $d ) {
			$cat_args['show_option_none'] = __( 'Seleziona ' . $tax_obj->labels->singular_name );
			wp_dropdown_categories(apply_filters('widget_categories_dropdown_args', $cat_args));
?>

<script type='text/javascript'>
/* <![CDATA[ */
	var dropdown<?php echo $w; ?> = document.getElementById("<?php echo $w; ?>");
        function on<?php echo $w; ?>change() {
        	if ( dropdown<?php echo $w; ?>.options[dropdown<?php echo $w; ?>.selectedIndex].value > 0 ) {
                        location.href = dropdown<?php echo $w; ?>.options[dropdown<?php echo $w; ?>.selectedIndex].value;
		}
	}
        dropdown<?php echo $w; ?>.onchange = on<?php echo $w; ?>change;
/* ]]> */
</script>

<?php
		} else {
?>
		<ul>
<?php
		$cat_args['title_li'] = '';
		wp_list_categories(apply_filters('widget_categories_args', $cat_args));
?>
		</ul>
<?php
		}

		echo $after_widget;
	}

	function update( $new_instance, $old_instance ) {
		$instance = $old_instance;
		$instance['title'] = strip_tags($new_instance['title']);
		$instance['count'] = !empty($new_instance['count']) ? 1 : 0;
		$instance['hierarchical'] = !empty($new_instance['hierarchical']) ? 1 : 0;
		$instance['dropdown'] = !empty($new_instance['dropdown']) ? 1 : 0;
                
                $instance['taxonomy'] = strip_tags($new_instance['taxonomy']);

		return $instance;
	}

	function form( $instance ) {
		//Defaults
		$instance = wp_parse_args( (array) $instance, array( 'title' => '', 'taxonomy' => 'category') );
		$title = esc_attr( $instance['title'] );
                
                $tax = esc_attr( $instance['taxonomy']);
                                
                
		$count = isset($instance['count']) ? (bool) $instance['count'] :false;
		$hierarchical = isset( $instance['hierarchical'] ) ? (bool) $instance['hierarchical'] : false;
		$dropdown = isset( $instance['dropdown'] ) ? (bool) $instance['dropdown'] : false;
?>
		<p><label for="<?php echo $this->get_field_id('title'); ?>"><?php _e( 'Title:' ); ?></label>
		<input class="widefat" id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo $title; ?>" /></p>
                
                <p><label for="<?php echo $this->get_field_id('taxonomy'); ?>"><?php _e( 'Tassonomia:' ); ?></label>
		<input class="widefat" id="<?php echo $this->get_field_id('taxonomy'); ?>" name="<?php echo $this->get_field_name('taxonomy'); ?>" type="text" value="<?php echo $tax; ?>" /></p>

		<p><input type="checkbox" class="checkbox" id="<?php echo $this->get_field_id('dropdown'); ?>" name="<?php echo $this->get_field_name('dropdown'); ?>"<?php checked( $dropdown ); ?> />
		<label for="<?php echo $this->get_field_id('dropdown'); ?>"><?php _e( 'Display as dropdown' ); ?></label><br />

		<input type="checkbox" class="checkbox" id="<?php echo $this->get_field_id('count'); ?>" name="<?php echo $this->get_field_name('count'); ?>"<?php checked( $count ); ?> />
		<label for="<?php echo $this->get_field_id('count'); ?>"><?php _e( 'Show post counts' ); ?></label><br />

		<input type="checkbox" class="checkbox" id="<?php echo $this->get_field_id('hierarchical'); ?>" name="<?php echo $this->get_field_name('hierarchical'); ?>"<?php checked( $hierarchical ); ?> />
		<label for="<?php echo $this->get_field_id('hierarchical'); ?>"><?php _e( 'Show hierarchy' ); ?></label></p>
<?php
	}
        
        function _get_current_taxonomy( $instance ) {
            if ( !empty( $instance['taxonomy'] ) && taxonomy_exists( $instance['taxonomy'] ) )
                return $instance['taxonomy'];
        else
            return 'category';
  }

}

add_action('widgets_init', create_function('', 'return register_widget("WP_Widget_Custom_Taxonomies");'));
?>
