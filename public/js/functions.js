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


// THEME

function swapStyleSheet(sheet){
    document.getElementById('pagestyle').setAttribute('href', '/public/css/' + sheet);
}   
function load() {
    var themeSwitcher = document.getElementById("changeThemeSelect");
    let theme = document.cookie.trim();
    console.log(theme)
    if(theme == "dark-green"){
        swapStyleSheet('dark-green.css')
        themeSwitcher.selectedIndex = 1
    } else if(theme == "dark-blue"){
        swapStyleSheet('dark-blue.css')
        themeSwitcher.selectedIndex = 0
    } else if(theme == "light-green"){
        swapStyleSheet('light-green.css')
        themeSwitcher.selectedIndex = 3
    } else if(theme == "light-blue"){
        swapStyleSheet('light-blue.css')
        themeSwitcher.selectedIndex = 2
    }
}
function save() {
    var themeLoaded = document.getElementById("changeThemeSelect").value;
    document.cookie = themeLoaded;
}
function updateTheme() {
    var options = document.getElementById("changeThemeSelect").value;
    if(options == "dark-blue") {
        swapStyleSheet('dark-blue.css') 
        save();
    } else if(options == "dark-green") {
        swapStyleSheet('dark-green.css')
        save();
   } else if(options == "light-green"){
       swapStyleSheet('light-green.css')
       save();
   } else if(options == "light-blue"){
    swapStyleSheet('light-blue.css')
    save();
}
   document.getElementById("preloader-show").style.display = "block"; 
   setTimeout(function(){
    document.getElementById("preloader-show").style.display = "none"; 
   }, 500);
}

