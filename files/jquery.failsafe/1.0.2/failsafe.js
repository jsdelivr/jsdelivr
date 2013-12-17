/*
 * @build  : 10 Aug, 2013
 * @author : Ram swaroop
 * @company: Compzets.com
 */
(function($){
    
    // set variables & constants
    var fsWrapper = '<div class="fs-overlay" onclick="$.failsafe.putToTop();"></div><div class="fs-container" onclick="$.failsafe.putToTop();"><div class="fs-fig"></div></div>';
    var netFig = '<div class="bar bar-1"></div><div class="bar bar-2"></div><div class="bar bar-3"></div><div class="bar bar-4"></div><div class="bar bar-5"></div>';
    var batteryFig = '<div class="battery"><div class="battery-charge"></div></div><div class="battery-head"></div>';
    var sepFig = '<div class="fs-sep"></div>';    
    var netFlag = "online";
    var batteryFlag = "charging";
    var battery;
    
    $.extend({
      
        failsafe: function(options){
            
                // fetches options
                var opts = $.extend({},$.failsafe.defaults,options);          
            
                /*
                 * For Internet Connectivity
                 */
                // create custom event for checking internet connectivity
                var fireEvent = function(name, data) {
                    var e = document.createEvent("Event");
                    e.initEvent(name, true, true);
                    e.data = data;
                    window.dispatchEvent(e);
                };

                var check_conn = function(url, callback) {
                    var xhr;  
                    if (window.XMLHttpRequest) {  // code for IE7+, Firefox, Chrome, Opera, Safari
                        xhr=new XMLHttpRequest();
                    }
                    else {  // code for IE6, IE5
                        xhr=new ActiveXObject("Microsoft.XMLHTTP");
                    }

                    xhr.onreadystatechange = function(e) {
                        if (xhr.readyState != 4) {
                        return;
                        }
                        if (xhr.status == 200) {
                            fireEvent("goodconnection", {});
                        } else {
                            fireEvent("connectionerror", {});
                        }
                    };
                    xhr.open("GET", url+"?fs="+Math.random(), true);
                    xhr.send();
                };        

                window.addEventListener("goodconnection", function(e) {
                    $.failsafe.onOnline(opts);
                });
                window.addEventListener("connectionerror", function(e) {
                    $.failsafe.onOffline(opts);
                });
                
                if(opts.checkNet == true) {
                    check_conn(opts.checkUrl);
                    setInterval(function(){check_conn(opts.checkUrl);},opts.checkInterval);
                }
                /*
                 * For Battery Status
                 */
                if(opts.checkBattery == true && (battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery)) {
                    
                    if((battery.level <= (opts.chargeThreshold)/100) && !battery.charging) {
                        $.failsafe.onBatteryLow(opts);
                    }

                    battery.addEventListener("levelchange", function(){
                        if((battery.level <= (opts.chargeThreshold)/100) && !battery.charging)
                            $.failsafe.onBatteryLow(opts);
                    });                
                    battery.addEventListener("chargingchange", function(){
                        if(!battery.charging) {
                            if(battery.level <= (opts.chargeThreshold)/100) {
                                $.failsafe.onBatteryLow(opts);
                            }                           
                        }
                        else {
                            $.failsafe.onCharging(opts);
                        }
                    });
                }
        }
    });

    $.extend ($.failsafe,{
      
        // sets up the base css
        init : function(callback) {
            $('body').prepend(fsWrapper);
            callback();
        },

        // called when network state changes to offline
        onOffline : function(opts) {
            if(netFlag == "online") {
                // change flag
                netFlag = "offline";
                // check battery status
                if(batteryFlag == "batteryLow") {
                    $('.fs-fig').append(sepFig);
                    $('.fs-fig').append(netFig);
                    $('.bar').css('background-color','#F00');
                    $('.fs-msg').text(opts.bothDownMsg);  
                }
                else {                    
                    $.failsafe.init(function(){
                        $('.fs-fig').append(netFig);
                        $('.bar').css('background-color','#F00');
                        $('.fs-container').append("<div class='fs-msg'>"+opts.offlineMsg+"</div>");
                        $.failsafe.disableElements(opts);
                    });                  
                }
            }
        },

        // called when network state changes to online
        onOnline : function(opts) {
            if(netFlag == "offline") {
                // change flag
                netFlag = "online";
                // clears the message on top
                if($('.fs-overlay').length != 0 || $('.fs-container').length !=0)
                    $.failsafe.remove({removeDelay:0});
                $.failsafe.init(function(){
                    $('.fs-fig').append(netFig);
                    $('.fs-container').append("<div class='fs-msg'>"+opts.onlineMsg+"</div>"); 
                    $.failsafe.remove(opts);  
                });                
                // check battery and show proper msg
                if(batteryFlag == "batteryLow") {
                    $.failsafe.init(function(){
                        $('.fs-container').append("<div class='fs-msg'>"+opts.batteryLowMsg+"</div>");
                        $.failsafe.putToTop();
                    });
                    return;
                }
                $.failsafe.enableElements(opts);
            }
        },

        onBatteryLow : function(opts) {
            if(batteryFlag == "charging") {
                // change flag
                batteryFlag = "batteryLow";          
                // check for internet connectivity
                if(netFlag == "offline") {
                    $('.fs-fig').append(sepFig);
                    $('.fs-fig').append(batteryFig);
                    $('.fs-msg').text(opts.bothDownMsg); 
                }
                else {
                    $.failsafe.init(function(){
                        $('.fs-fig').append(batteryFig);
                        $('.fs-container').append("<div class='fs-msg'>"+opts.batteryLowMsg+"</div>");                
                        $.failsafe.disableElements(opts);
                    });
                }
                $('.battery-charge').animate({width:(battery.level*100)+"%"});
                $('.battery').attr('title','Battery Level: '+battery.level*100+'%');
            }
        },

        onCharging : function(opts) {
            if(batteryFlag == "batteryLow") {
                // change flag
                batteryFlag = "charging";
                // clears the message on top
                if($('.fs-overlay').length != 0 || $('.fs-container').length !=0)
                    $.failsafe.remove({removeDelay:0});
                $.failsafe.init(function(){
                    $('.fs-fig').append(batteryFig);
                    $('.fs-container').append("<div class='fs-msg'>"+opts.chargingMsg+"</div>"); 
                    $.failsafe.remove(opts);
                });
                // check internet connectivity and show proper msg
                if(netFlag == "offline") {
                    $.failsafe.init(function(){
                        $('.fs-container').append("<div class='fs-msg'>"+opts.offlineMsg+"</div>");
                        $.failsafe.putToTop();
                    });
                    return;
                }
                $.failsafe.enableElements(opts);
            }
        },

        // enable the disabled elements
        enableElements : function(opts) {
            if(opts.disableElements!="") {
                $(opts.disableElements).removeAttr('disabled');
            }
        },

        // disable one or more elements
        disableElements : function(opts) {
            if(opts.disableElements!="") {
                $(opts.disableElements).attr('disabled','disabled');
            }
        },
        
        // puts the message to top        
        putToTop : function() {
            $('.fs-fig').remove();
            $('.fs-overlay').animate({height:'60px'},300);
            $('.fs-container').animate({marginTop:'0'},500);
        },
                
        // removes all tags added by failsafe
        remove : function(opts) {
            $('.fs-overlay').fadeOut(opts.removeDelay).remove();
            $('.fs-container').fadeOut(opts.removeDelay).remove();            
        },
        
        defaults : {
            checkUrl:"",
            checkInterval:10000,
            onlineMsg:"Great! You are now online",
            offlineMsg:"Oops! you are not connected to the internet",
            chargingMsg:"Your battery is now charging, carry on with your work!",
            batteryLowMsg:"Battery is quite low to continue, please plug in your laptop!",
            bothDownMsg:"Both, your network as well as battery are down!",
            chargeThreshold:15,
            disableElements:"",
            checkNet:true,
            checkBattery:true,
            removeDelay:4000
        }
    });    
}(jQuery));