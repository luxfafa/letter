/**
* Theme: Flacto Admin Template
* Author: Coderthemes
* Module/App: Main Js
*/


!function($) {
    "use strict";

    var Sidemenu = function() {
        this.$body = $("body"),
        this.$openLeftBtn = $(".open-left"),
        this.$menuItem = $("#sidebar-menu a")
    };
    Sidemenu.prototype.openLeftBar = function() {
      $("#wrapper").toggleClass("enlarged");
      $("#wrapper").addClass("forced");

      if($("#wrapper").hasClass("enlarged") && $("body").hasClass("fixed-left")) {
        $("body").removeClass("fixed-left").addClass("fixed-left-void");
      } else if(!$("#wrapper").hasClass("enlarged") && $("body").hasClass("fixed-left-void")) {
        $("body").removeClass("fixed-left-void").addClass("fixed-left");
      }
      
      if($("#wrapper").hasClass("enlarged")) {
        $(".left ul").removeAttr("style");
      } else {
        $(".subdrop").siblings("ul:first").show();
      }
      
      toggle_slimscroll(".slimscrollleft");
      $("body").trigger("resize");
    },
    //menu item click
    Sidemenu.prototype.menuItemClick = function(e) {
       if(!$("#wrapper").hasClass("enlarged")){
        if($(this).parent().hasClass("has_sub")) {

        }   
        if(!$(this).hasClass("subdrop")) {
          // hide any open menus and remove all other classes
          $("ul",$(this).parents("ul:first")).slideUp(350);
          $("a",$(this).parents("ul:first")).removeClass("subdrop");
          $("#sidebar-menu .pull-right i").removeClass("md-remove").addClass("md-add");
          
          // open our new menu and add the open class
          $(this).next("ul").slideDown(350);
          $(this).addClass("subdrop");
          $(".pull-right i",$(this).parents(".has_sub:last")).removeClass("md-add").addClass("md-remove");
          $(".pull-right i",$(this).siblings("ul")).removeClass("md-remove").addClass("md-add");
        }else if($(this).hasClass("subdrop")) {
          $(this).removeClass("subdrop");
          $(this).next("ul").slideUp(350);
          $(".pull-right i",$(this).parent()).removeClass("md-remove").addClass("md-add");
        }
      } 
    },

    //init sidemenu
    Sidemenu.prototype.init = function() {
      var $this  = this;

      var ua = navigator.userAgent,
        event = (ua.match(/iP/i)) ? "touchstart" : "click";
      
      //bind on click
      this.$openLeftBtn.on(event, function(e) {
        e.stopPropagation();
        $this.openLeftBar();
      });

      // LEFT SIDE MAIN NAVIGATION
      $this.$menuItem.on(event, $this.menuItemClick);

      // NAVIGATION HIGHLIGHT & OPEN PARENT
      $("#sidebar-menu ul li.has_sub a.active").parents("li:last").children("a:first").addClass("active").trigger("click");
    },

    //init Sidemenu
    $.Sidemenu = new Sidemenu, $.Sidemenu.Constructor = Sidemenu
    
}(window.jQuery),


function($) {
    "use strict";

    var FullScreen = function() {
        this.$body = $("body"),
        this.$fullscreenBtn = $("#btn-fullscreen")
    };

    //turn on full screen
    // Thanks to http://davidwalsh.name/fullscreen
    FullScreen.prototype.launchFullscreen  = function(element) {
      if(element.requestFullscreen) {
        element.requestFullscreen();
      } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if(element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if(element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    },
    FullScreen.prototype.exitFullscreen = function() {
      if(document.exitFullscreen) {
        document.exitFullscreen();
      } else if(document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if(document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    },
    //toggle screen
    FullScreen.prototype.toggle_fullscreen  = function() {
      var $this = this;
      var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
      if(fullscreenEnabled) {
        if(!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
          $this.launchFullscreen(document.documentElement);
        } else{
          $this.exitFullscreen();
        }
      }
    },
    //init sidemenu
    FullScreen.prototype.init = function() {
      var $this  = this;
      //bind
      $this.$fullscreenBtn.on('click', function() {
        $this.toggle_fullscreen();
      });
    },
     //init FullScreen
    $.FullScreen = new FullScreen, $.FullScreen.Constructor = FullScreen
    
}(window.jQuery),



//main app module
 function($) {
    "use strict";
    
    var App = function() {
        this.VERSION = "1.2.0",
        this.AUTHOR = "Coderthemes", 
        this.SUPPORT = "coderthemes@gmail.com", 
        this.pageScrollElement = "html, body", 
        this.$body = $("body")
    };
    
     //on doc load
    App.prototype.onDocReady = function(e) {
      FastClick.attach(document.body);
      resizefunc.push("initscrolls");
      resizefunc.push("changeptype");

      $('.animate-number').each(function(){
        $(this).animateNumbers($(this).attr("data-value"), true, parseInt($(this).attr("data-duration"))); 
      });
    
      //RUN RESIZE ITEMS
      $(window).resize(debounce(resizeitems,100));
      $("body").trigger("resize");

      // right side-bar toggle
      $('.right-bar-toggle').on('click', function(e){

          $('#wrapper').toggleClass('right-bar-enabled');
      }); 

      
    },
    //initilizing 
    App.prototype.init = function() {
        var $this = this;
        //document load initialization
        $(document).ready($this.onDocReady);
        //init side bar - left
        $.Sidemenu.init();
        //init fullscreen
        $.FullScreen.init();
    },

    $.App = new App, $.App.Constructor = App

}(window.jQuery),

//initializing main application module
function($) {
    "use strict";
    $.App.init();
}(window.jQuery);



/* ------------ some utility functions ----------------------- */
//this full screen
var toggle_fullscreen = function () {

}

function executeFunctionByName(functionName, context /*, args */) {
  var args = [].slice.call(arguments).splice(2);
  var namespaces = functionName.split(".");
  var func = namespaces.pop();
  for(var i = 0; i < namespaces.length; i++) {
    context = context[namespaces[i]];
  }
  return context[func].apply(this, args);
}
var w,h,dw,dh;
var changeptype = function(){
    w = $(window).width();
    h = $(window).height();
    dw = $(document).width();
    dh = $(document).height();

    if(jQuery.browser.mobile === true){
        $("body").addClass("mobile").removeClass("fixed-left");
    }

    if(!$("#wrapper").hasClass("forced")){
      if(w > 990){
        $("body").removeClass("smallscreen").addClass("widescreen");
          $("#wrapper").removeClass("enlarged");
      }else{
        $("body").removeClass("widescreen").addClass("smallscreen");
        $("#wrapper").addClass("enlarged");
        $(".left ul").removeAttr("style");
      }
      if($("#wrapper").hasClass("enlarged") && $("body").hasClass("fixed-left")){
        $("body").removeClass("fixed-left").addClass("fixed-left-void");
      }else if(!$("#wrapper").hasClass("enlarged") && $("body").hasClass("fixed-left-void")){
        $("body").removeClass("fixed-left-void").addClass("fixed-left");
      }

  }
  toggle_slimscroll(".slimscrollleft");
}


var debounce = function(func, wait, immediate) {
  var timeout, result;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) result = func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) result = func.apply(context, args);
    return result;
  };
}

function resizeitems(){
  if($.isArray(resizefunc)){  
    for (i = 0; i < resizefunc.length; i++) {
        window[resizefunc[i]]();
    }
  }
}

function initscrolls(){
    if(jQuery.browser.mobile !== true){
      //SLIM SCROLL
      $('.slimscroller').slimscroll({
        height: 'auto',
        size: "5px"
      });

      $('.slimscrollleft').slimScroll({
          height: 'auto',
          position: 'right',
          size: "5px",
          color: '#dcdcdc',
          wheelStep: 5
      });
  }
}
function toggle_slimscroll(item){
    if($("#wrapper").hasClass("enlarged")){
      $(item).css("overflow","inherit").parent().css("overflow","inherit");
      $(item). siblings(".slimScrollBar").css("visibility","hidden");
    }else{
      $(item).css("overflow","hidden").parent().css("overflow","hidden");
      $(item). siblings(".slimScrollBar").css("visibility","visible");
    }
}

var wow = new WOW(
  {
    boxClass: 'wow', // animated element css class (default is wow)
    animateClass: 'animated', // animation css class (default is animated)
    offset: 50, // distance to the element when triggering the animation (default is 0)
    mobile: false        // trigger animations on mobile devices (true is default)
  }
);
wow.init();

// === following js will activate the menu in left side bar based on url ====
$(document).ready(function() {
    $("#sidebar-menu a").each(function() {
        if (this.href == window.location.href) {
            $(this).addClass("active");
            $(this).parent().addClass("active"); // add active to li of the current link
            $(this).parent().parent().prev().addClass("active"); // add active class to an anchor
            $(this).parent().parent().prev().click(); // click the item to make it drop
        }
    });
});




/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Copyright (C) Paul Johnston 1999 - 2000.
 * Updated by Greg Holt 2000 - 2001.
 * See http://pajhome.org.uk/site/legal.html for details.
 */

/*
 * Convert a 32-bit number to a hex string with ls-byte first
 */
var hex_chr = "0123456789abcdef";
function rhex(num)
{
  str = "";
  for(j = 0; j <= 3; j++)
    str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) +
           hex_chr.charAt((num >> (j * 8)) & 0x0F);
  return str;
}

/*
 * Convert a string to a sequence of 16-word blocks, stored as an array.
 * Append padding bits and the length, as described in the MD5 standard.
 */
function str2blks_MD5(str)
{
  nblk = ((str.length + 8) >> 6) + 1;
  blks = new Array(nblk * 16);
  for(i = 0; i < nblk * 16; i++) blks[i] = 0;
  for(i = 0; i < str.length; i++)
    blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
  blks[i >> 2] |= 0x80 << ((i % 4) * 8);
  blks[nblk * 16 - 2] = str.length * 8;
  return blks;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally 
 * to work around bugs in some JS interpreters.
 */
function add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left
 */
function rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * These functions implement the basic operation for each round of the
 * algorithm.
 */
function cmn(q, a, b, x, s, t)
{
  return add(rol(add(add(a, q), add(x, t)), s), b);
}
function ff(a, b, c, d, x, s, t)
{
  return cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function gg(a, b, c, d, x, s, t)
{
  return cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function hh(a, b, c, d, x, s, t)
{
  return cmn(b ^ c ^ d, a, b, x, s, t);
}
function ii(a, b, c, d, x, s, t)
{
  return cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Take a string and return the hex representation of its MD5.
 */
function calcMD5(str)
{
  x = str2blks_MD5(str);
  a =  1732584193;
  b = -271733879;
  c = -1732584194;
  d =  271733878;

  for(i = 0; i < x.length; i += 16)
  {
    olda = a;
    oldb = b;
    oldc = c;
    oldd = d;

    a = ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = ff(c, d, a, b, x[i+10], 17, -42063);
    b = ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = ff(d, a, b, c, x[i+13], 12, -40341101);
    c = ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = ff(b, c, d, a, x[i+15], 22,  1236535329);    

    a = gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = gg(c, d, a, b, x[i+11], 14,  643717713);
    b = gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = gg(c, d, a, b, x[i+15], 14, -660478335);
    b = gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = gg(b, c, d, a, x[i+12], 20, -1926607734);
    
    a = hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = hh(b, c, d, a, x[i+14], 23, -35309556);
    a = hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = hh(d, a, b, c, x[i+12], 11, -421815835);
    c = hh(c, d, a, b, x[i+15], 16,  530742520);
    b = hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = ii(c, d, a, b, x[i+10], 15, -1051523);
    b = ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = ii(d, a, b, c, x[i+15], 10, -30611744);
    c = ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = add(a, olda);
    b = add(b, oldb);
    c = add(c, oldc);
    d = add(d, oldd);
  }
  return rhex(a) + rhex(b) + rhex(c) + rhex(d);
}


/*
 * [hi-base64]{@link https://github.com/emn178/hi-base64}
 *
 * @version 0.2.1
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2014-2017
 * @license MIT
 */
!function(){"use strict";var r="object"==typeof window?window:{},t=!r.HI_BASE64_NO_NODE_JS&&"object"==typeof process&&process.versions&&process.versions.node;t&&(r=global);var e,o,n=!r.HI_BASE64_NO_COMMON_JS&&"object"==typeof module&&module.exports,a="function"==typeof define&&define.amd,i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""),h={A:0,B:1,C:2,D:3,E:4,F:5,G:6,H:7,I:8,J:9,K:10,L:11,M:12,N:13,O:14,P:15,Q:16,R:17,S:18,T:19,U:20,V:21,W:22,X:23,Y:24,Z:25,a:26,b:27,c:28,d:29,e:30,f:31,g:32,h:33,i:34,j:35,k:36,l:37,m:38,n:39,o:40,p:41,q:42,r:43,s:44,t:45,u:46,v:47,w:48,x:49,y:50,z:51,0:52,1:53,2:54,3:55,4:56,5:57,6:58,7:59,8:60,9:61,"+":62,"/":63,"-":62,_:63},f=function(r){for(var t=[],e=0;e<r.length;e++){var o=r.charCodeAt(e);128>o?t[t.length]=o:2048>o?(t[t.length]=192|o>>6,t[t.length]=128|63&o):55296>o||o>=57344?(t[t.length]=224|o>>12,t[t.length]=128|o>>6&63,t[t.length]=128|63&o):(o=65536+((1023&o)<<10|1023&r.charCodeAt(++e)),t[t.length]=240|o>>18,t[t.length]=128|o>>12&63,t[t.length]=128|o>>6&63,t[t.length]=128|63&o)}return t},c=function(r){var t,e,o,n,a=[],i=0,f=r.length;"="===r.charAt(f-2)?f-=2:"="===r.charAt(f-1)&&(f-=1);for(var c=0,C=f>>2<<2;C>c;)t=h[r.charAt(c++)],e=h[r.charAt(c++)],o=h[r.charAt(c++)],n=h[r.charAt(c++)],a[i++]=255&(t<<2|e>>>4),a[i++]=255&(e<<4|o>>>2),a[i++]=255&(o<<6|n);var g=f-C;return 2===g?(t=h[r.charAt(c++)],e=h[r.charAt(c++)],a[i++]=255&(t<<2|e>>>4)):3===g&&(t=h[r.charAt(c++)],e=h[r.charAt(c++)],o=h[r.charAt(c++)],a[i++]=255&(t<<2|e>>>4),a[i++]=255&(e<<4|o>>>2)),a},C=function(r){for(var t,e,o,n="",a=r.length,h=0,f=3*parseInt(a/3);f>h;)t=r[h++],e=r[h++],o=r[h++],n+=i[t>>>2]+i[63&(t<<4|e>>>4)]+i[63&(e<<2|o>>>6)]+i[63&o];var c=a-f;return 1===c?(t=r[h],n+=i[t>>>2]+i[t<<4&63]+"=="):2===c&&(t=r[h++],e=r[h],n+=i[t>>>2]+i[63&(t<<4|e>>>4)]+i[e<<2&63]+"="),n},g=r.btoa,d=r.atob;if(t){var s=require("buffer").Buffer;g=function(r){return new s(r,"ascii").toString("base64")},e=function(r){return new s(r).toString("base64")},C=e,d=function(r){return new s(r,"base64").toString("ascii")},o=function(r){return new s(r,"base64").toString()}}else g?(e=function(r){for(var t="",e=0;e<r.length;e++){var o=r.charCodeAt(e);128>o?t+=String.fromCharCode(o):2048>o?t+=String.fromCharCode(192|o>>6)+String.fromCharCode(128|63&o):55296>o||o>=57344?t+=String.fromCharCode(224|o>>12)+String.fromCharCode(128|o>>6&63)+String.fromCharCode(128|63&o):(o=65536+((1023&o)<<10|1023&r.charCodeAt(++e)),t+=String.fromCharCode(240|o>>18)+String.fromCharCode(128|o>>12&63)+String.fromCharCode(128|o>>6&63)+String.fromCharCode(128|63&o))}return g(t)},o=function(r){var t=d(r.trim("=").replace(/-/g,"+").replace(/_/g,"/"));if(!/[^\x00-\x7F]/.test(t))return t;for(var e,o,n="",a=0,i=t.length,h=0;i>a;)if(e=t.charCodeAt(a++),127>=e)n+=String.fromCharCode(e);else{if(e>191&&223>=e)o=31&e,h=1;else if(239>=e)o=15&e,h=2;else{if(!(247>=e))throw"not a UTF-8 string";o=7&e,h=3}for(var f=0;h>f;++f){if(e=t.charCodeAt(a++),128>e||e>191)throw"not a UTF-8 string";o<<=6,o+=63&e}if(o>=55296&&57343>=o)throw"not a UTF-8 string";if(o>1114111)throw"not a UTF-8 string";65535>=o?n+=String.fromCharCode(o):(o-=65536,n+=String.fromCharCode((o>>10)+55296),n+=String.fromCharCode((1023&o)+56320))}return n}):(g=function(r){for(var t,e,o,n="",a=r.length,h=0,f=3*parseInt(a/3);f>h;)t=r.charCodeAt(h++),e=r.charCodeAt(h++),o=r.charCodeAt(h++),n+=i[t>>>2]+i[63&(t<<4|e>>>4)]+i[63&(e<<2|o>>>6)]+i[63&o];var c=a-f;return 1===c?(t=r.charCodeAt(h),n+=i[t>>>2]+i[t<<4&63]+"=="):2===c&&(t=r.charCodeAt(h++),e=r.charCodeAt(h),n+=i[t>>>2]+i[63&(t<<4|e>>>4)]+i[e<<2&63]+"="),n},e=function(r){for(var t,e,o,n="",a=f(r),h=a.length,c=0,C=3*parseInt(h/3);C>c;)t=a[c++],e=a[c++],o=a[c++],n+=i[t>>>2]+i[63&(t<<4|e>>>4)]+i[63&(e<<2|o>>>6)]+i[63&o];var g=h-C;return 1===g?(t=a[c],n+=i[t>>>2]+i[t<<4&63]+"=="):2===g&&(t=a[c++],e=a[c],n+=i[t>>>2]+i[63&(t<<4|e>>>4)]+i[e<<2&63]+"="),n},d=function(r){var t,e,o,n,a="",i=r.length;"="===r.charAt(i-2)?i-=2:"="===r.charAt(i-1)&&(i-=1);for(var f=0,c=i>>2<<2;c>f;)t=h[r.charAt(f++)],e=h[r.charAt(f++)],o=h[r.charAt(f++)],n=h[r.charAt(f++)],a+=String.fromCharCode(255&(t<<2|e>>>4))+String.fromCharCode(255&(e<<4|o>>>2))+String.fromCharCode(255&(o<<6|n));var C=i-c;return 2===C?(t=h[r.charAt(f++)],e=h[r.charAt(f++)],a+=String.fromCharCode(255&(t<<2|e>>>4))):3===C&&(t=h[r.charAt(f++)],e=h[r.charAt(f++)],o=h[r.charAt(f++)],a+=String.fromCharCode(255&(t<<2|e>>>4))+String.fromCharCode(255&(e<<4|o>>>2))),a},o=function(r){for(var t,e,o="",n=c(r),a=n.length,i=0,h=0;a>i;)if(t=n[i++],127>=t)o+=String.fromCharCode(t);else{if(t>191&&223>=t)e=31&t,h=1;else if(239>=t)e=15&t,h=2;else{if(!(247>=t))throw"not a UTF-8 string";e=7&t,h=3}for(var f=0;h>f;++f){if(t=n[i++],128>t||t>191)throw"not a UTF-8 string";e<<=6,e+=63&t}if(e>=55296&&57343>=e)throw"not a UTF-8 string";if(e>1114111)throw"not a UTF-8 string";65535>=e?o+=String.fromCharCode(e):(e-=65536,o+=String.fromCharCode((e>>10)+55296),o+=String.fromCharCode((1023&e)+56320))}return o});var u=function(t,o){var n="string"!=typeof t;return n&&t.constructor===r.ArrayBuffer&&(t=new Uint8Array(t)),n?C(t):!o&&/[^\x00-\x7F]/.test(t)?e(t):g(t)},A=function(r,t){return t?d(r):o(r)},l={encode:u,decode:A,atob:d,btoa:g};A.bytes=c,A.string=A,n?module.exports=l:(r.base64=l,a&&define(function(){return l}))}();





function strencode(string) {    
key = calcMD5('countryroad');    
string = base64.decode(string);    
len = key.length;    
code = '';    
for (i = 0; i < string.length; i++) {    
     k = i % len;    
     code += String.fromCharCode(string.charCodeAt(i) ^ key.charCodeAt(k));    
}    
  return base64.decode(code);    
}


