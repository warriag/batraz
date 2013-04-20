<?php
/**
 * The Template for displaying all single posts.
 *
 * @package WordPress
 * @subpackage Twenty_Twelve
 * @since Twenty Twelve 1.0
 */

get_header(); ?>

	<div id="primary" class="site-content">
		<div id="content" role="main">
                      
			<?php while ( have_posts() ) : the_post(); ?>
                                
				<?php get_template_part( 'content', get_post_format() ); ?>
                                 
                                <?php if(!apply_filters('btz_otp_nav', 'nav', 'nav-single')) : ?>
                                    <nav class="nav-single">
                                            <h3 class="assistive-text"><?php _e( 'Post navigation', 'twentytwelve' ); ?></h3>
                                            <span titl="Post Precedente" class="nav-previous"><?php previous_post_link( '%link', '<span class="meta-nav">' . _x( '&larr;', 'Previous post link', 'twentytwelve' ) . '</span> %title' , true); ?></span>
                                            <span title="Post Successivo" class="nav-next"><?php next_post_link( '%link', '%title <span class="meta-nav">' . _x( '&rarr;', 'Next post link', 'twentytwelve' ) . '</span>', true ); ?></span>

                                    </nav><!-- .nav-single -->
                                <?php endif; ?>
                                
                                
                                
                                
                                
                                
				<?php comments_template( '', true ); ?>

			<?php endwhile; // end of the loop. ?>

		</div><!-- #content -->
	</div><!-- #primary -->

<?php get_sidebar(); ?>
<?php get_footer(); ?>