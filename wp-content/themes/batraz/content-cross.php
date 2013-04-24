
<?php if(function_exists("cross_content_setting")) : $query = cross_content_setting(); ?>
    <?php if($query ) : ?>
      
               
        <?php $current_post = $post; while ( $query->have_posts() ) :  $query->the_post(); ?>
        <article>
             <header class="entry-header item-right">
             <a href="<?php the_permalink(); ?>"><?php echo get_batraz_item_thumbnail('floatleft'); ?></a>
                 <h1 class="entry-title">
                       <a href="<?php the_permalink(); ?>" title="<?php echo esc_attr( sprintf( __( 'Permalink to %s', 'twentytwelve' ), the_title_attribute( 'echo=0' ) ) ); ?>" rel="bookmark"><?php the_title(); ?></a>
                 </h1>
             </header><!-- .entry-header -->
             
             <div class="entry-content item-right">
                        
                        <?php the_excerpt(); ?>
			
	      </div><!-- .entry-content -->
        </article>    

        <?php endwhile; $post = $current_post; ?>
       
	
    <?php endif; ?>
<?php endif; ?>
        
	
       
         
