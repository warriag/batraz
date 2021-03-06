<?php
/**
 * The default template for displaying content. Used for both single and index/archive/search.
 *
 * @package WordPress
 * @subpackage Twenty_Twelve
 * @since Twenty Twelve 1.0
 */
?>
        
	<article id="post-<?php the_ID(); ?>" <?php post_class("item-right") ?>>
		<?php if ( is_sticky() && is_home() && ! is_paged() ) : ?>
		<div class="featured-post">
			<?php _e( 'Featured post', 'twentytwelve' ); ?>
		</div>
		<?php endif; ?>
                <a href="<?php the_permalink(); ?>"><?php echo get_batraz_item_thumbnail(get_the_ID(), 'floatleft'); ?></a>
                <div>
                    <header class="entry-header">
                       
                            <h1 class="entry-title">
                                  <a href="<?php the_permalink(); ?>" title="<?php echo esc_attr( sprintf( __( 'Permalink to %s', 'twentytwelve' ), the_title_attribute( 'echo=0' ) ) ); ?>" rel="bookmark"><?php the_title(); ?></a>
                            </h1>
                    </header><!-- .entry-header -->


                    <div class="entry-content">

                            <?php the_excerpt(); ?>

                    </div><!-- .entry-content -->
                </div>	
               
	</article><!-- #post -->
       
         
