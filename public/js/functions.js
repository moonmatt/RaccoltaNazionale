$(document).ready(function($) {
    var Body = $('body');
    Body.addClass('preloader-site');
});
$(window).on('load', function() {
    $('.preloader-wrapper').fadeOut();
    $('body').removeClass('preloader-site');
});

function goHome(){
    $('html, body').animate({ scrollTop: 0 }, 'fast');
}
function redirect(url){
    window.location.replace(url);
}
function redirectHome(url){
    window.location = "/#" + url
}

// $(window).load(function() {
//     $('.preloader').fadeOut('slow');
//  });