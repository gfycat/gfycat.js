//http://www.benknowscode.com/2013/07/detect-dom-element-scrolled-with-jquery.html
//http://jsfiddle.net/bseth99/kej64/
(function ($) {

   var $window = $(window),
       _watch = [],
       _buffer;

    //
    // Debounce calls to "callback" routine so that multiple calls
    // made to the event handler before the expiration of "delay" are
    // coalesced into a single call to "callback". Also causes the
    // wait period to be reset upon receipt of a call to the
    // debounced routine.
    // http://blogorama.nerdworks.in/javascriptfunctionthrottlingan/
    /*function debounce(delay, callback) {
        var timeout = null;
        return function () {
            //
            // if a timeout has been registered before then
            // cancel it so that we can setup a fresh timeout
            //
            if (timeout) {
                clearTimeout(timeout);
            }
            var args = arguments;
            timeout = setTimeout(function () {
                callback.apply(null, args);
                timeout = null;
            }, delay);
        };
    }*/
    
    //
    // Throttle calls to "callback" routine and ensure that it
    // is not invoked any more often than "delay" milliseconds.
    // http://blogorama.nerdworks.in/javascriptfunctionthrottlingan/
    /*function throttle(delay, callback) {
        var previousCall = new Date().getTime();
        return function() {
            var time = new Date().getTime();
    
            //
            // if "delay" milliseconds have expired since
            // the previous call then propagate this call to
            // "callback"
            //
            if ((time - previousCall) >= delay) {
                previousCall = time;
                callback.apply(null, arguments);
            }
        };
    }*/

   function test($el) {
      var docViewTop = $window.scrollTop(),
          docViewBottom = docViewTop + $window.height(),
          elemTop = $el.offset().top,
          elemBottom = elemTop + $el.height();

      return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom)
                && (elemBottom <= docViewBottom) &&  (elemTop >= docViewTop) );
   }

   $window.on('scroll', function ( e ) {

         if ( !_buffer ) {

            _buffer = setTimeout(function () {

               checkInView( e );

               _buffer = null;

            }, 300);
         }

      });

   function checkInView( e ) {

      $.each(_watch, function () {

         if ( test( this.element ) ) {

            if ( !this.invp ) {
               this.invp = true;
               if ( this.options.scrolledin ) 
                   this.options.scrolledin.call( this.element, e );
                
               this.element.trigger( 'scrolledin', e );
            }
         } else if ( this.invp ) {
            this.invp = false;
            if ( this.options.scrolledout ) 
                this.options.scrolledout.call( this.element, e );
             
            this.element.trigger( 'scrolledout', e );
         }
      });
   }

   function monitor( element, options ) {
      var item = { element: element, options: options, invp: false };
      _watch.push(item);
      return item;
   }

   function unmonitor( item ) {
      for ( var i=0;i<_watch.length;i++ ) {
         if ( _watch[i] === item ) {
            _watch.splice( i, 1 );
            item.element = null;
            break;
         }
      }
      //console.log( _watch );
   }

   var pluginName = 'scrolledIntoView',
       settings = {
         scrolledin: null,
         scrolledout: null
       }


   $.fn[pluginName] = function( options ) {

         var options = $.extend({}, settings, options);

         this.each( function () {

               var $el = $(this),
                   instance = $.data( this, pluginName );

               if ( instance ) {
                  instance.options = options;
               } else {
                  $.data( this, pluginName, monitor( $el, options ) );
                  $el.on( 'remove', $.proxy( function () {

                        $.removeData(this, pluginName);
                        unmonitor( instance );

                     }, this ) );
               }
            });

        //$window.on('scroll resize', throttle(250, checkInView));

        window.setTimeout(function(){
          $(window).trigger('scroll');
        },1000);

         return this;
      }


})(jQuery);