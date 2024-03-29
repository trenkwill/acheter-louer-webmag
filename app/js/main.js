// 'use strict';




var Page = (function() {

  var $container = $( '#container' ),
    $bookBlock = $( '#bb-bookblock' ),
    $items = $bookBlock.children(),
    itemsCount = $items.length,
    current = 0,
    bb = $( '#bb-bookblock' ).bookblock( {
      speed : 400,
      perspective : 2000,
      shadowSides : 0.8,
      shadowFlip  : 0.4,
      onEndFlip : function(old, page, isLimit) {
        
        current = page;
        
        // updateNavigation
        updateNavigation( isLimit );
        // initialize jScrollPane on the content div for the new item
        setJSP( 'init' );
        // destroy jScrollPane on the content div for the old item
        setJSP( 'destroy', old );

      }
    } ),
    $navNext = $( '#bb-nav-next' ),
    $navPrev = $( '#bb-nav-prev' ).hide(),
    $menuItems = $container.find( 'ul.menu > li' ),
    $goHome = $(".go-home"),
    transEndEventNames = {
      'WebkitTransition': 'webkitTransitionEnd',
      'MozTransition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'msTransition': 'MSTransitionEnd',
      'transition': 'transitionend'
    },
    transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
    supportTransitions = Modernizr.csstransitions;

  function init() {

    // initialize jScrollPane on the content div of the first item
    setJSP( 'init' );
    initEvents();

  }
  
  function initEvents() {

    // add navigation events
    $navNext.on( 'click', function() {
      bb.next();
      $(".dot--selected").removeClass("dot--selected").next().addClass("dot--selected");
      return false;
    } );

    $navPrev.on( 'click', function() {
      bb.prev();
      $(".dot--selected").removeClass("dot--selected").prev().addClass("dot--selected");
      return false;
    } );
    
    // add swipe events
    $items.on( {
      'swipeleft'   : function( event ) {
        if( $container.data( 'opened' ) ) {
          return false;
        }
        bb.next();
        return false;
      },
      'swiperight'  : function( event ) {
        if( $container.data( 'opened' ) ) {
          return false;
        }
        bb.prev();
        return false;
      }
    } );

    // click a menu item
    $menuItems.on( 'click', function() {

      var $el = $( this );
      var idx = $el.index();

      bb.jump( idx + 1 );
      console.log(idx);

      if ($el.hasClass("dot")) {
        $(".dot").removeClass("dot--selected");
        $el.addClass("dot--selected");
      };
    
      return false;
      
    } );

    // click a go-home
    $goHome.on( 'click', function() {

      bb.jump(2);
      console.log("go home");
    
      return false;
      
    } );

    // reinit jScrollPane on window resize
    $( window ).on( 'debouncedresize', function() {
      // reinitialise jScrollPane on the content div
      setJSP( 'reinit' );
    } );

  }

  function setJSP( action, idx ) {
    
    var idx = idx === undefined ? current : idx,
      $content = $items.eq( idx ).children( 'div.content' ),
      apiJSP = $content.data( 'jsp' );
    
    if( action === 'init' && apiJSP === undefined ) {
      $content.jScrollPane({verticalGutter : 0, hideFocus : true });
    }
    else if( action === 'reinit' && apiJSP !== undefined ) {
      apiJSP.reinitialise();
    }
    else if( action === 'destroy' && apiJSP !== undefined ) {
      apiJSP.destroy();
    }

  }

  function updateNavigation( isLastPage ) {
    
    if( current === 0 ) {
      $navNext.show();
      $navPrev.hide();
    }
    else if( isLastPage ) {
      $navNext.hide();
      $navPrev.show();
    }
    else {
      $navNext.show();
      $navPrev.show();
    }



  }

  function toggleTOC() {
    var opened = $container.data( 'opened' );
    opened ? closeTOC() : openTOC();
  }

  function openTOC() {
    $navNext.hide();
    $navPrev.hide();
    $container.addClass( 'slideRight' ).data( 'opened', true );
  }

  function closeTOC( callback ) {

    updateNavigation( current === itemsCount - 1 );
    $container.removeClass( 'slideRight' ).data( 'opened', false );
    if( callback ) {
      if( supportTransitions ) {
        $container.on( transEndEventName, function() {
          $( this ).off( transEndEventName );
          callback.call();
        } );
      }
      else {
        callback.call();
      }
    }

  }

  return { init : init };

})();

$(document).ready(function(){


  function animateTo() {

    $(function() {
      $('a[href*=#]:not([href=#])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
          if (target.length) {
            $('html,body').animate({
              scrollTop: target.offset().top - 20
            }, 1000);
            return false;
          }
        }
      });
    });
  }


  function openAddrress() {
    $(".open-mobile-address").click(function(){

      $(".header .show-mobile").toggle();
      $(".header .adresse-inner-2").show();
    });
  }



  function readmore() {
    $(function() {
      $('.excerpt').readmore({
        speed: 75,
        maxHeight: 83,
        moreLink: '<a href="#">...</a>',
        lessLink: '<a href="#">Fermer</a>'
      });
    });
  }

  function removeTargetBlankMobile() {
    $(function(){
      var windowWidth = $(window).width();
      if (windowWidth < 768) {
        $('a[target="_blank"]').removeAttr('target');
      };
    });
  }


  function containerHeight() {
    $(function(){
      var windowHeight = $(window).height(),
          container = $(".container");

      container.height(windowHeight);
      
      $(window).resize(function(){
          container.height(windowHeight);
      });

    }); 
  }


  function showCurrent() {
    $(function(){
      var dot = $(".dot");
      dot.click(function(){
        $(this).removeClass("dot--selected");
        $(this).toggleClass("dot--selected");
      });
    });
  }

  

  // release the kraken :

  animateTo();
  openAddrress();
  removeTargetBlankMobile();
  containerHeight();
  // showCurrent();
  // readmore();

});