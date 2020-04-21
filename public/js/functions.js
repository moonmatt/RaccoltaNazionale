function goHome(){
    $('html, body').animate({ scrollTop: 0 }, 'fast');
}
function redirect(url){
    window.location.replace(url);
}
function redirectHome(url){
    window.location = "/#" + url
}