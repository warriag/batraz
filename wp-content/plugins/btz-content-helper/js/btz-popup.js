jQuery(document).ready(function($){
    jQuery('a.'+ ajax_object.class_link).click(function(event){
         event.preventDefault();
         
         var resultDiv = jQuery('<div></div>');
         resultDiv.attr('id', 'btz-dialog-overlaid')
                  .css({padding : '28px' ,padding : '2rem', 'line-height' : '28px' , 'line-height' : '2rem' })
                  .appendTo('body');
         
         var progressBar = jQuery('<div></div>');
         progressBar.appendTo(resultDiv);
         
         
         var url = jQuery(this).attr('href');
        
         
         var post_data = url.split('#'),
         post_type = '',
         id = 0;
         
         
         if(post_data.length == 0){
             return;
         }else if(post_data.length == 1){
             post_type = 'post';
             id = post_data[0];
         }else{
             post_type = post_data[0];;
             id = post_data[1];
         }
         
         if(!jQuery.isNumeric(id))return;
         

         jQuery.ajaxSetup({
              beforeSend: function () {
                  progressBar.progressbar({value: false});
                  resultDiv.dialog({modal: true, width : 624, title : 'Attendere prego...'});
               
              },
              complete: function () {
                //xhr.setRequestHeader('X-CSRFToken', $.cookie('csrftoken'));
               // spinner.hide();

              }

         });


         var data = {
            'action':ajax_object.action,
            'post_type': post_type,
            'id' : id
         }

         jQuery.post(
               ajax_object.ajax_url,
               data,
               function(response) {

                   var obj = jQuery.parseJSON(response);
                   
                   if(obj != null){
                        if(obj.hasOwnProperty('title') && obj.hasOwnProperty('content')){    
                           // alert(obj.title);
                             resultDiv.dialog( "option", "title", obj.title );                           
                             resultDiv.attr('title', obj.title);
                             resultDiv.html(obj.content);

                        }
                   }
               });
            
    });

});


