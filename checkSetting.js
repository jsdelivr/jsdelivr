// Checking WebBrowser and MachineType

function isMobile(){
    var mFilter = "win16|win32|win64|mac";
    var mCheck = false;
    if (navigator.platform) mCheck = (mFilter.indexOf(navigator.platform.toLowerCase()) < 0);
    return mCheck; 
};

function getBrowserName(){
    if (navigator){
        var ua = navigator.userAgent.toLowerCase();
        if(ua.indexOf('naver') != -1){
            return 'Naver';
        }else if(ua.indexOf('kakaotalk') != -1){
            return 'Kakaotalk';			
        }else if(ua.indexOf('opr') != -1 || ua.indexOf('opera') != -1){
            return 'Opera';
        }else if(ua.indexOf('bdbrowser') != -1){
            return 'Baidu';
        }else if(ua.indexOf('ucbrowser') != -1){
            return 'UC';
        }else if(ua.indexOf('chrome') != -1 && window.speechSynthesis){
            return 'Chrome';
        }else if(ua.indexOf('safari') != -1 && ua.indexOf('android') == -1 ){
            return 'Safari';
        }else if(ua.indexOf('firefox') != -1){
            return 'Firefox';
        }else if(ua.indexOf('msie') != -1){
            return 'Internet Explorer';
        }else if(ua.indexOf('trident') != -1){
            return 'Internet Explorer 10+';
        }		
        return 'etc';
    }

}
if (isMobile()) {
    document.write("Your machine is mobile");
    document.write("<br>");
    document.write("Your WebBrowser is : "+ getBrowserName());
} else {
    document.write("Your machine isn't mobile");
    document.write("<br>");
    document.write("Your WebBrowser is : "+ getBrowserName());
}
