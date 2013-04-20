
(function($){
    $.fn.loadLeaders = function(options){
        defaults = {
            'slug' : null,
            tpl: {
                    next     : '<a title="Successivo" class="leaders-nav leaders-next" href="javascript:;"><span></span></a>',
                    prev     : '<a title="Precedente" class="leaders-nav leaders-prev" href="javascript:;"><span></span></a>'
            },
            'ppp' : 5,        
            'debug' : false       
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
        ppp,
        lenLinks = 0,
        start = 0;


        ppp = (isNaN(options.ppp) || options.ppp <= 0 || options.ppp > 5) ? 5 : options.ppp;
        
        return this.each(function(){
           
            $(this).prepend(options.tpl.next); 
            $(this).prepend(options.tpl.prev);
            
            $(".leaders-next", this).live('click', function(){
                start += ppp;
                start = (start % lenLinks);

                wrapper.fadeOut(200);
                wrapper.empty();
                fillContainer();
                wrapper.fadeIn();
            });
             
            $(".leaders-prev", this).live('click', function(){
                start -= ppp;
                 while(start < 0){
                    start += lenLinks;
                }
                start = (start % lenLinks);

                wrapper.fadeOut(200);
                wrapper.empty();
                fillContainer();
                wrapper.fadeIn();
            });
           
            var counter = 0;
            function createSetlink(data){
                 
                var block =  $('<p />'),
                link = $('<a />').attr({'href' : data['permalink'], 'title' : data['title']}).appendTo(block);
                link.html(data['thumb']);
                $('<br>').appendTo(block);
                var term = $('<a />').attr({'href' : data['term_link'], 'title' : data['term_name']}).appendTo(block);
                
                // counter++; 
                var termName = (options.debug) ? data['term_name'] + '(' + ++counter + ')' : data['term_name'] ;
               
                //term.text(data['term_name'] + '(' + counter + ')');
                term.text(termName);
                links.push(block);
                
            }
            
            function fillContainer(){
                
                for(var i = start; i < start + ppp ; i++){
                    $(links[i % lenLinks]).appendTo(wrapper);
                }
            }
            
            
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
                        lenLinks = links.length;
                        
//                        if(links.length <= ppp ){
//                            ppp = links.length;
//                        }else{
//                            var remainder = Math.ceil(links.length / ppp ) * ppp - links.length;
//                            for(var i = 0 ; i < remainder ; i++ ){
//                                links.push(links[i]);
//                            }
//                        }
                        fillContainer();
                        
                       
                    }
                 }, 'json')
                 

              });
    };
        
    
})(jQuery);

