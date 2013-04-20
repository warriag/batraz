/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

jQuery(document).ready(function($){
     var btz_media_frame;   
     
     $("a.btz-media-load").click(function(e){
         
        // Prevent the default action from occuring.
        e.preventDefault();
       
        name_target = this.id;
        
        // If the frame already exists, re-open it.
        if ( btz_media_frame ) {
            btz_media_frame.open();
            return;
        }
        
        btz_media_frame = wp.media.frames.btz_media_frame = wp.media({
            className: 'media-frame btz-media-frame',
            frame: 'select',
            multiple: false,
            title: btz_nmp_media.title,
            library: {
                type: 'image'
            },
            button: {
                text:  btz_nmp_media.button
            }
        });
        
        btz_media_frame.on('select', function(){
            // Grab our attachment selection and construct a JSON representation of the model.
            var media_attachment = btz_media_frame.state().get('selection').first().toJSON();

            // Send the attachment URL to our custom input field via jQuery.
            $("input[name=" + name_target + "]").val(media_attachment.url);
        });
        
        // Now that everything has been set, let's open up the frame.
        btz_media_frame.open();
     });
     
      
});
    



