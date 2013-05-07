<?php if(is_page()) : ?>
     <?php if(function_exists("leader_header_ajax_setting")) : $leadarr = leader_header_ajax_setting(); ?>
        <?php if(is_array($leadarr) && array_key_exists('slug', $leadarr)) : ?>
             <div class="leaders-list ui-widget" title="<?php echo get_taxonomy($leadarr['slug'])->labels->name;  ?>">
             <?php if(get_leaders_slide_description()) : ?>
                        <div class="header-leaders">
                              <span><marquee scrollamount="5"><?php echo get_taxonomy($leadarr['slug'])->description; ?></marquee></span>
                        </div> 
                   <?php endif; ?>
                   <div id="slide-leaders" class="content-leaders  ui-widget-content">
                        <div class="content-leaders-wrapper btz-floatfix"></div>
                   </div>
             </div>
              <script>
                 
                jQuery(document).ready(function(){
                     jQuery("#slide-leaders").loadLeaders({ slug : '<?php echo $leadarr['slug']; ?>',
                                                            ppp : <?php the_leaders_ppp_option(); ?>,
                                                            speed : <?php the_leaders_speed_option(); ?>,
                                                            bouncing : <?php the_leaders_bounce(); ?>,
                                                            debug : <?php the_debug_state(); ?>
                                            });
                });
             </script>
                
        <?php endif; ?>
    <?php endif; ?>
 <?php endif; ?>

