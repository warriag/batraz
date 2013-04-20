
(function($){
    $.fn.loadLeaders = function(options){
        defaults = {
            'slug' : null,
            // HTML templates
            tpl: {
                    next     : '<a title="Successivo" class="leaders-nav leaders-next" href="javascript:;"><span></span></a>',
                    prev     : '<a title="Precedente" class="leaders-nav leaders-prev" href="javascript:;"><span></span></a>'
            },                    
        }
        options = $.extend(defaults, options);
        
        if(!options.slug || options.slug === ''){
            console.log("slug in loadLeaders undefined or empty.");
            return;
        }
        
        var wrapper = $(this).children('div');
        if(wrapper.length != 1 ){
            console.log("wrapper length = " + wrapper.length + "(not 1) ");
            return;
        }
        
        var links = new Array(),
        ppp = 3,
        start = 0;
        
        return this.each(function(){
           
            $(this).prepend(options.tpl.next); 
            $(this).prepend(options.tpl.prev);
            
            $(".leaders-next", this).live('click', function(){
                start += ppp;
                while(start >= links.length){
                    start -= links.length;
                }
                wrapper.fadeOut(200);
                wrapper.empty();
                fillContainer();
                wrapper.fadeIn();
            });
             
            $(".leaders-prev", this).live('click', function(){
                start -= ppp;
                while(start < 0){
                    start += links.length;
                }
                wrapper.fadeOut(200);
                wrapper.empty();
                fillContainer();
                wrapper.fadeIn();
            });
           
            
            function createSetlink(data){
                 
                var block =  $('<p />'),
                link = $('<a />').attr({'href' : data['permalink'], 'title' : data['title']}).appendTo(block);
                link.html(data['thumb']);
                $('<br>').appendTo(block);
                var term = $('<a />').attr({'href' : data['term_link'], 'title' : data['term_name']}).appendTo(block);
                term.text(data['term_name']);
                links.push(block);
                
            }
            
            function fillContainer(){
                
                for(var i = start; i < start + ppp ; i++){
                    $(links[i]).appendTo(wrapper);
                }
//                $.each(links , function(index, data ){
//                    if(index < start)return true;
//                    if(index >= start + ppp)return false;
//                    $(links[index]).appendTo(wrapper);
////                    console.log(index);
////                    console.log(data);
//                });
            }
            
//            var $this = $(this);
            
            var spinner = $('.' +Batraz.container_spinner_loading_class);
            if(spinner.length == 0){
                spinner = $('<div/>').addClass(Batraz.container_spinner_loading_class) .spinning().appendTo('body');
            }

      
            $.ajaxSetup({
                  beforeSend: function () {
                       spinner.spinning('show');
                  },
                  complete: function () {
                      spinner.spinning('hide');
                  }
             }); 
             
             var data ={
                'action': leaders_ajax_object.action_leaders,
                'slug' : options.slug
             }
      
             $.post(
                 leaders_ajax_object.ajax_url,
                 data,
                 function(response) {
                    if(typeof(response) === 'object'){ 
                        console.log(response);
                        wrapper.empty();
                        $(response).each(function(){
                            createSetlink(this);
                        });
                        
                        if(links.length <= ppp ){
                            ppp = links.length;
                        }else{
                            var remainder = Math.ceil(links.length / ppp ) * ppp - links.length;
                            for(var i = 0 ; i < remainder ; i++ ){
                                links.push(links[i]);
                            }
                        }
                        fillContainer();
                        
                       
                    }
                 }, 'json')
                 

              });
    };
        
    
})(jQuery);

