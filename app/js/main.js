// 'use strict';

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

      $(".header .hide-palm").toggle();
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

  // release the kraken :
  animateTo(); 
  openAddrress();
  readmore();

});