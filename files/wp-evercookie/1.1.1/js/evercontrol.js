(function($) {
    var ec = new evercookie();
    ec.get("id", function(val) { 
        
        //Cookies anlegen mit den entsprechenden Wert sofern kein evercookie gesetzt ist
        if(val == ""){
            $.ajax({
                url: ajax_object.ajax_url,
                data: { evervalue: val, action: 'evercookie'},
                cache: false,
                success : function(data) {
                    ec.set("id", data);
                }
            });
        }else{
            /*
             * Prüfen ob das Cookie existiert, falls nicht vergebe neues und 
             * bei nicht restloser Löschung wiederherstelle alte Cookies.
             */            
            $.ajax({
                type: "POST",
                action: 'evercookie',
                url: ajax_object.ajax_url,
                data: { evervalue: val, action: 'evercookie'},
                cache: false,
                success : function(data) {
                    /*
                     * Existiert cookie in der Datenbank? 
                     * Wenn ja:
                     * IP-Adresse eintragen zu diesem Cookie
                     * Wenn Nein:
                     * Neues cookie setzen un in der Datenbank eintragen.
                     */
                    if(data === "OK"){
                        $.ajax({
                            type: "POST",
                            action: 'evercookie',
                            url: ajax_object.ajax_url,
                            data: { evervalue: val, action: 'evercookie'},
                            cache: false,
                            success : function(data) { 
                                ec.set("id", val);
                            }
                        });
                    }else{
                        ec.set("id", data);
                    }
                }
            });
        }   
    }); 
})(jQuery);
