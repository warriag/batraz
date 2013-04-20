<?php
/**
 * sidebar leader
 *
 *
 * If none of the sidebars have widgets, then let's bail early.
 */

?>
        <?php if ( is_active_sidebar( 'sidebar-l1' ) ) : ?>
		<div id="secondary" class="widget-area" role="complementary">
			<?php dynamic_sidebar( 'sidebar-l1' ); ?>
		</div><!-- #secondary -->
	<?php endif; ?>