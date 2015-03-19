var searchName;
try { searchName = searchElement; } catch(e) {}

function ensureReady(callback) {
    if (ready) {
        ready = false;
        callback();
        setTimeout(function(){ ready=true; },100);
    }
}

function goY(val) {
    ensureReady(function() {
        $("html, body").animate({ scrollTop: val}, 200);
    });
}

function goX(val) {
    ensureReady(function() {
        $("html, body").animate({ scrollLeft: val}, 200);
    });
}

function search() {
    if (typeof searchName!=='undefined') {
        ensureReady(function() {
            setTimeout(function() { $(searchName).focus(); }, 250);
        });
    }
}

function somethingFocused() {
    if ($(document.activeElement).is(':input[type=text],:input[type=password],option,textarea')) {
        return true;
    }
    return false;
}

var ready=true,
    g=0,
    vim = {
        106: function(){ goY($(window).scrollTop()+100); },
        107: function(){ goY($(window).scrollTop()-100); },
        104: function(){ goX($(window).scrollLeft()-100); },
        108: function(){ goX($(window).scrollLeft()+100); },
         71: function(){ goY($('html').height()); },
         70: function(){ goY($(window).scrollTop()+$(window).height());},
         66: function(){ goY($(window).scrollTop()-$(window).height());},
         85: function(){ goY($(window).scrollTop()-($(window).height()/2));},
         68: function(){ goY($(window).scrollTop()+($(window).height()/2));},
         47: function(){ search(); },
        103: function(){ if (g===1) {
            g=0;
            goY(0);
        } else { g=1;
            setTimeout(function(){g=0;},1000);
        }
    }};

$(window).load(function(){
    $(window).keypress(function(event){
        if (vim[event.keyCode] && !somethingFocused()){ vim[event.keyCode](); }
    });
});

