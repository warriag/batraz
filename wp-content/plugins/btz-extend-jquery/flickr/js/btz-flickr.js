(function($){
    $.fn.bindSetFlickr = function(options){
        var sizes = new Array( 	'square', 'thumbnail', 	'small', 'medium', 'medium_640', 'large', 'original');
        defaults = {
            'imageClass' : 'imageContainer',
            'photosContainer' : null,
            'galleryRel' :'FlickrGallery',
            'size' : 'small',
            'sizeZoom' : 'original'        
        }
        
        options = $.extend(defaults, options);
        if(!options.photosContainer || options.photosContainer.length == 0){
            console.log("photosContainer in bindSetFlickr undefined or empty.");
            return;
        }
        options.size = ( $.inArray(options.size, sizes) ) ? options.size  : 'small';
        options.sizeZoom = ( $.inArray(options.sizeZoom, sizes) ) ? options.sizeZoom  : 'original';
        
        //var flickrGallery = 'FlickrGallery';
        
        function createSetImages(data, container){
            var li = $('<p />').addClass(options.imageClass).appendTo(container),
            a = $('<a />').attr({'title' : data['title'], 'href' : data['href'], 'rel' : options.galleryRel}).appendTo(li);
            $('<img />').attr({'src' : data['src']}).appendTo(a);
            $('<span />').text(data.title).appendTo(li);
            
        }
        
        return this.live('click', function(event){
            event.preventDefault();
            var $this = $(this),
            currentId = $this.find('a').attr('id'),
            value = $("input[type=hidden]", this).val(),
            photos = !isNaN(value) ? value : 10; 
            
            
            
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
                'action': flickr_ajax_object.action_photoset,
                'id_set': currentId,
                'photos' : photos,
                'size' : options.size,
                'sizeZoom' : options.sizeZoom 
             }

             $.post(
                flickr_ajax_object.ajax_url,
                data,
                function(response) {
                    if(typeof(response) === 'object'){ 
                        var wrapper = options.photosContainer.children('div');
                        wrapper.empty();
                        
                        $(response).each(function(){
                            createSetImages(this, wrapper );
                        });
                        
                        
                        
                        $('a[rel=' + options.galleryRel + ']').fancybox({'autoPlay' : true});
                    }
                }, 'json').done(function(){
                    if(options.photosContainer.hasClass('mCustomScrollbar')) {
                            options.photosContainer.mCustomScrollbar("update");
                        }else{
                             options.photosContainer.mCustomScrollbar({
                                scrollButtons:{
                                    enable:true
                                },
                                theme : options.theme,
                                horizontalScroll:false,
                                advanced:{autoExpandVerticalScroll:true,updateOnContentResize:true}

                            });
                        }
                });
        });

    };
        
    
})(jQuery);


(function($){
    $.fn.allSetsFlickr = function(options){
        defaults = {
            'setsClass' : 'Sets',
            'caseClass' : 'SetCase',
            'imageClass' : 'imageContainer',
            'setsContainer' : null,
            'photosContainer' : null
        }
        options = $.extend(defaults, options);
        
        if(!options.setsContainer || options.setsContainer.length == 0){
            console.log("setsContainer in allSetsFlickr undefined or empty.");
            return;
        }
       
        if(!options.photosContainer || options.photosContainer.length == 0){
            console.log("photosContainer in allSetsFlickr undefined or empty.");
            return;
        }
        
        return this.each(function(){
            function createSetlink(data, container){
                 
                var sets =  $('<div/>').addClass(options.setsClass).appendTo(container),
                setCase =   $('<div/>').addClass(options.caseClass).appendTo(sets),
                link = $('<a />').attr({'href' : '#', 'id' : data.id}).appendTo(setCase);
                $('<img />').attr('src', data.url_thumbnail ).appendTo(link);
                $('<input />').attr({'type' : 'hidden', 'value' : data.photos}).appendTo(link);
                $('<span />').text(data.title).appendTo(sets);
                
            }
            
            var $this = $(this);
            
            var spinner = $('.' +Batraz.container_spinner_loading_class);
            if(spinner.length == 0){
                spinner = $('<div/>').addClass(Batraz.container_spinner_loading_class) .spinning().appendTo('body');
            }
           // var spinner = $('<div/>').spinning().appendTo('body');
      
            $.ajaxSetup({
                  beforeSend: function () {
                       spinner.spinning('show');
                  },
                  complete: function () {
                      spinner.spinning('hide');
                  }
             }); 
             
             var data ={
                'action': flickr_ajax_object.action_photosets,
                'all_sets': ''
             }
      
             $.post(
                 flickr_ajax_object.ajax_url,
                 data,
                 function(response) {
                    if(typeof(response) === 'object'){ 
                        $(response).each(function(){
                            createSetlink(this, $this);
                        });
                        
                        
                        
                        $('.' + options.setsClass).bindSetFlickr(options);
                    }
                 }, 'json').done(function(){
                     if(options.setsContainer.hasClass('mCustomScrollbar')) {
                            options.setsContainer.mCustomScrollbar('update');
                        }else{
                             options.setsContainer.mCustomScrollbar({
                                scrollButtons:{
                                    enable:true
                                },
                                theme : options.theme,
                                horizontalScroll:true,
                                advanced:{autoExpandHorizontalScroll:true,updateOnContentResize:false}
                            });
                        }
                 });

              });
    };
        
    
})(jQuery);

(function($){
    
    $.fn.flickrLoad = function(options){
        
        return this.each(function(){
           var sets = $(this).children('.flickr-sets');
           if(sets.length != 1){
               console.log('Length sets ( not 1 ) = ' + sets.length);
               return;
           }
           
           var wrapperSets = sets.children('div');
           if(wrapperSets.length != 1){
               console.log('Length wrapperSets ( not 1 ) = ' + wrapperSets.length);
               return;
           }
           
           var photos = $(this).children('.flickr-photos');
           if(photos.length != 1){
               console.log('Length photos ( not 1 ) = ' + photos.length);
               return;
           }
           
           var wrapperPhotos = photos.children('div');
           if(wrapperPhotos.length != 1){
               console.log('Length wrapperPhotos ( not 1 ) = ' + wrapperPhotos.length);
               return;
           }
           
           options.setsContainer = sets;
           options.photosContainer = photos;
           wrapperSets.allSetsFlickr(options);

           
        });
    }
    
})(jQuery);