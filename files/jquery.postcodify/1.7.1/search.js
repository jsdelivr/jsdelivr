
/**
 *  Postcodify - 도로명주소 우편번호 검색 프로그램 (클라이언트측 API)
 * 
 *  Copyright (c) 2014, Kijin Sung <root@poesis.kr>
 *  
 *  이 프로그램은 자유 소프트웨어입니다. 이 소프트웨어의 피양도자는 자유
 *  소프트웨어 재단이 공표한 GNU 약소 일반 공중 사용 허가서 (GNU LGPL) 제3판
 *  또는 그 이후의 판을 임의로 선택하여, 그 규정에 따라 이 프로그램을
 *  개작하거나 재배포할 수 있습니다.
 * 
 *  이 프로그램은 유용하게 사용될 수 있으리라는 희망에서 배포되고 있지만,
 *  특정한 목적에 맞는 적합성 여부나 판매용으로 사용할 수 있으리라는 묵시적인
 *  보증을 포함한 어떠한 형태의 보증도 제공하지 않습니다. 보다 자세한 사항에
 *  대해서는 GNU 약소 일반 공중 사용 허가서를 참고하시기 바랍니다.
 * 
 *  GNU 약소 일반 공중 사용 허가서는 이 프로그램과 함께 제공됩니다.
 *  만약 허가서가 누락되어 있다면 자유 소프트웨어 재단으로 문의하시기 바랍니다.
 */

(function($) {
    
    // 같은 플러그인을 2번 인클루드한 경우 무시하도록 한다.
    
    if (typeof $.fn.postcodify !== "undefined") return;
    
    // 버전을 선언한다.
    
    var version = "1.7.1";
    
    // 플러그인을 선언한다.
    
    $.fn.postcodify = function(options) {
        
        // jQuery 플러그인 관례대로 each()의 결과를 반환하도록 한다.
        
        return this.each(function() {
            
            // 기본 설정을 정의한다.
            
            var freeapi = {
                defaultUrl : "//api.poesis.kr/post/search.php",
                backupUrl : "//backup.api.poesis.kr/post/search.php",
            };
            
            var settings = $.extend({
                api : freeapi.defaultUrl,
                apiBackup : null,
                callBackupFirst : false,
                controls : this,
                results : this,
                searchButtonContent : "검색",
                hideOldAddresses : true,
                mapLinkProvider : false,
                mapLinkContent : "지도",
                insertDbid : null,
                insertPostcode5 : null,
                insertPostcode6 : null,
                insertAddress : null,
                insertDetails : null,
                insertExtraInfo : null,
                insertEnglishAddress : null,
                insertJibeonAddress : null,
                timeout : 3000,
                timeoutBackup : 6000,
                ready : function() { },
                beforeSearch : function(keywords) { },
                afterSearch : function(keywords, results) { },
                beforeSelect : function(selectedEntry) { },
                afterSelect : function(selectedEntry) { },
                onSuccess : function() { },
                onBackup : function() { },
                onError : function() { },
                onComplete : function() { },
                focusKeyword : true,
                focusDetails : true,
                useFullJibeon : false
            }, options);
            
            if (settings.api === freeapi.defaultUrl && settings.apiBackup === null) {
                settings.apiBackup = freeapi.backupUrl;
            }
            
            // 검색 컨트롤을 생성한다.
            
            var controls = $('<div class="postcode_search_controls"></div>');
            var keyword_input = $('<input type="text" class="keyword" value="" />').appendTo(controls);
            var search_button = $('<button type="button" class="search_button"></button>').html(settings.searchButtonContent).appendTo(controls);
            controls.prependTo(settings.controls);
            
            // 검색 결과창을 생성한다.
            
            var results = $(settings.results);
            $('<div class="postcode_search_status empty">검색 결과가 없습니다.</div>').appendTo(results).show();
            $('<div class="postcode_search_status error">검색 서버에 연결 중 오류가 발생하였습니다.<br />잠시 후 다시 시도해 주시기 바랍니다.</div>').appendTo(results).hide();
            $('<div class="postcode_search_status quota">일일 허용 쿼리수를 초과하였습니다.</div>').appendTo(results).hide();
            $('<div class="postcode_search_status too_short">검색어는 3글자 이상 입력해 주시기 바랍니다.</div>').appendTo(results).hide();
            $('<div class="postcode_search_status too_many">검색 결과가 너무 많아 100건까지만 표시합니다.<br />' +
                '행정구역명, 번지수 등을 사용하여 좀더 자세히 검색해 주시기 바랍니다.</div>').appendTo(results).hide();
            
            var summary = $('<div class="postcode_search_status summary"></div>');
            summary.append('<div class="result_count">검색 결과: <span>0</span>건</div>');
            summary.append('<div class="search_time">검색 소요 시간: <span>0</span>초</div>');
            summary.appendTo(results).hide();
            
            // 키워드 입력란이 포커스를 잃거나 엔터키를 누르면 즉시 검색을 수행한다.
            // 검색 단추를 누를 때까지 기다리는 것보다 검색 속도가 훨씬 빠르게 느껴진다.
            
            keyword_input.blur(function(event) {
                search_button.click();
            });
            
            keyword_input.keypress(function(event) {
                if (event.which == 13) {
                    event.preventDefault();
                    search_button.click();
                }
            });
            
            // 실제 검색을 수행하는 이벤트를 등록한다.
            
            search_button.click(function(event) {
                
                event.preventDefault();
                
                // 검색어가 직전과 동일한 경우 중복 검색을 방지한다.
                
                var keywords = $.trim(keyword_input.val());
                if (keywords === $.fn.postcodify.previous) return;
                $.fn.postcodify.previous = keywords;
                
                // 검색 결과창의 내용을 비운다.
                
                results.find("div.postcode_search_result").remove();
                results.find("div.postcode_search_status").hide();
                
                // 검색어가 없거나 너무 짧은 경우 네트워크 연결을 하지 않도록 한다.
                
                if (keywords === "") {
                    results.find("div.postcode_search_status.empty").show();
                    return;
                }
                if (keywords.length < 3) {
                    results.find("div.postcode_search_status.too_short").show();
                    return;
                }
                
                // 검색전 콜백 함수를 실행한다.
                
                if (settings.beforeSearch(keywords) === false) return;
                
                // 이미 검색이 진행 중일 때는 검색 단추를 다시 클릭하지 못하도록 하고,
                // "검색" 라벨을 간단한 GIF 이미지로 대체한다.
                
                search_button.attr("disabled", "disabled");
                if (navigator.userAgent && navigator.userAgent.match(/MSIE [5-8]\./)) {
                    search_button.text('...');
                } else {
                    search_button.html('<img class="searching" alt="검색" src="' + $.fn.postcodify.gif + '" />');
                }
                
                // 스크롤 위치를 기억한다.
                
                var scroll_top = $(window).scrollTop();
                
                // AJAX 요청 후에는 스크롤 위치를 복구하고 검색 단추를 원래대로 되돌리도록 예약한다.
                
                var ajax_complete = function() {
                    $(window).scrollTop(scroll_top);
                    search_button.removeAttr("disabled").html(settings.searchButtonContent);
                };
                
                // AJAX 요청 성공시 실행할 함수를 정의한다.
                
                var ajax_success = function(data, textStatus, jqXHR) {
                    
                    // 백업 API로 검색에 성공했다면 이후에도 백업 API만 사용하도록 설정한다.
                    
                    if (settings.currentRequestUrl === settings.apiBackup) {
                        settings.api = settings.apiBackup;
                    }
                    
                    // 검색후 콜백 함수를 실행한다.
                    
                    if (settings.afterSearch(keywords, data.results) === false) return;
                    
                    // 서버가 오류를 반환한 경우...
                    
                    if (data.error && data.error.toLowerCase().indexOf("quota") > -1) {
                        results.find("div.postcode_search_status.quota").show();
                        $.fn.postcodify.previous = "";
                    }
                    else if (data.error) {
                        results.find("div.postcode_search_status.error").show();
                        $.fn.postcodify.previous = "";
                    }
                    
                    // 검색 결과가 없는 경우...
                    
                    else if (data.count === 0) {
                        results.find("div.postcode_search_status.empty").show();
                    }
                    
                    // 검색 결과가 있는 경우 DOM에 추가한다.
                    
                    else {
                        
                        for (var i = 0; i < data.count; i++) {
                            
                            // 검색 결과 항목을 작성한다.
                            
                            var result = data.results[i];
                            var option = $('<div class="postcode_search_result"></div>');
                            option.data("dbid", result.dbid);
                            option.data("code6", result.code6);
                            option.data("code5", result.code5);
                            option.data("address", result.address);
                            option.data("english_address", result.english_address !== undefined ? result.english_address : "");  // v1.4.2+
                            option.data("jibeon_address", result.jibeon_address);  // v1.2+
                            option.data("extra_info_long", result.extra_info_long);
                            option.data("extra_info_short", result.extra_info_short);
                            
                            // 클릭할 링크를 생성한다.
                            
                            var selector = $('<a class="selector" href="#"></a>');
                            selector.append($('<span class="address_info"></span>').text(result.address));
                            if (result.extra_info_long) {
                                selector.append($('<span class="extra_info"></span>').append("(" + result.extra_info_long + ")"));
                            }
                            
                            // 우편번호, 기초구역번호, 주소 등을 항목에 추가한다.
                            
                            $('<div class="code6"></div>').text(result.code6).appendTo(option);
                            $('<div class="code5"></div>').text(result.code5).appendTo(option);
                            $('<div class="address"></div>').append(selector).appendTo(option);
                            
                            // 예전 주소 및 검색어 목록을 추가한다.
                            
                            if (result.other) {
                                var old_addresses_show = $('<a href="#" class="show_old_addresses" title="관련지번 보기">▼</a>');
                                old_addresses_show.appendTo(option.find("div.address"));
                                var old_addresses_div = $('<div class="old_addresses"></div>').text(result.other);
                                if (settings.hideOldAddresses) old_addresses_div.css("display", "none");
                                old_addresses_div.appendTo(option);
                            }
                            
                            // 지도 링크를 추가한다.
                            
                            if (settings.mapLinkProvider && typeof $.fn.postcodify.mapurl[settings.mapLinkProvider] !== "undefined") {
                                var mapurl = $.fn.postcodify.mapurl[settings.mapLinkProvider];
                                mapurl = mapurl.replace(/%s$/, encodeURIComponent(result.address).replace(/%20/g, '+'));
                                var maplink = $('<a target="_blank"></a>').attr("href", mapurl).html(settings.mapLinkContent);
                                $('<div class="map_link"></div>').append(maplink).appendTo(option);
                            }
                            
                            option.appendTo(results);
                        }
                        
                        // 검색 결과 요약을 작성한다.
                        
                        results.find("div.postcode_search_status.summary").detach().appendTo(results).show();
                        results.find("div.postcode_search_status.summary div.result_count span").text(data.count);
                        results.find("div.postcode_search_status.summary div.search_time span").text(data.time);
                        
                        if (data.count >= 100) {
                            results.find("div.postcode_search_status.too_many").show();
                        }
                    }
                    
                    // 검색 성공 콜백 함수를 실행한다.
                    
                    ajax_complete();
                    settings.onSuccess();
                    settings.onComplete();
                };
                
                // AJAX 요청 2차 실패시 실행할 함수를 정의한다.
                
                var ajax_error_second = function(jqXHR, textStatus, errorThrown) {
                    
                    // 오류 메시지를 보여준다.
                    
                    results.find("div.postcode_search_status.error").show();
                    $.fn.postcodify.previous = "";
                    
                    // 검색 실패 콜백 함수를 실행한다.
                    
                    ajax_complete();
                    settings.onError();
                    settings.onComplete();
                };
                
                // AJAX 요청 1차 실패시 실행할 함수를 정의한다.
                
                var ajax_error_first = function(jqXHR, textStatus, errorThrown) {
                    
                    // 백업 API가 있는 경우...
                    
                    if (settings.apiBackup) {
                    
                        // 백업 API 시도전 콜백 함수를 실행한다.
                        
                        settings.onBackup();
                        
                        // 타임아웃을 2배로 주고 다시 한 번 AJAX 요청을 전송한다.
                        
                        settings.currentRequestUrl = settings.apiBackup;
                        
                        $.ajax({
                            url : settings.currentRequestUrl,
                            data : { "v": version, "q": keywords, "ref": window.location.hostname },
                            dataType : "jsonp",
                            timeout : settings.timeoutBackup,
                            success : ajax_success,
                            error : ajax_error_second,
                            processData : true,
                            cache : false
                        });
                    }
                    
                    // 그 밖의 경우...
                    
                    else {
                        ajax_error_second(jqXHR, textStatus, errorThrown);
                    }
                };
                
                // 검색 서버로 AJAX (JSONP) 요청을 전송한다.
                
                if (settings.callBackupFirst) {
                    settings.currentRequestUrl = settings.apiBackup;
                } else {
                    settings.currentRequestUrl = settings.api;
                }
                
                $.ajax({
                    url : settings.currentRequestUrl,
                    data : { "v": version, "q": keywords, "ref": window.location.hostname },
                    dataType : "jsonp",
                    timeout : settings.timeout,
                    success : ajax_success,
                    error : ajax_error_first,
                    processData : true,
                    cache : false
                });
            });
            
            // 검색 결과를 클릭할 경우 사용자가 지정한 입력란에 해당 정보가 입력되도록 한다.
            
            results.on("click", "div.code6,div.code5,div.old_addresses", function(event) {
                event.preventDefault();
                event.stopPropagation();
                $(this).parent().find("a.selector").click();
            });
            
            results.on("click", "a.selector", function(event) {
                event.preventDefault();
                
                // 클릭한 주소를 구한다.
                
                var entry = $(this).parents("div.postcode_search_result");
                
                // 선택전 콜백을 실행한다.
                
                if (settings.beforeSelect(entry) === false) return;
                
                // 사용자가 지정한 입력칸에 데이터를 입력한다.
                
                if (settings.insertDbid) $(settings.insertDbid).val(entry.data("dbid"));
                if (settings.insertPostcode6) $(settings.insertPostcode6).val(entry.data("code6"));
                if (settings.insertPostcode5) $(settings.insertPostcode5).val(entry.data("code5"));
                if (settings.insertAddress) $(settings.insertAddress).val(entry.data("address"));
                if (settings.insertEnglishAddress) $(settings.insertEnglishAddress).val(entry.data("english_address"));  // v1.4.2+
                if (settings.insertJibeonAddress) $(settings.insertJibeonAddress).val(entry.data("jibeon_address"));  // v1.2+
                if (settings.insertExtraInfo) {
                    var extra_info = settings.useFullJibeon ? entry.data("extra_info_long") : entry.data("extra_info_short");
                    if (extra_info.length) extra_info = "(" + extra_info + ")";
                    if (settings.insertExtraInfo === settings.insertAddress) {
                        $(settings.insertExtraInfo).val($(settings.insertExtraInfo).val() + "\n" + extra_info);
                    } else {
                        $(settings.insertExtraInfo).val(extra_info);
                    }
                }
                
                // 선택후 콜백을 실행한다.
                
                if (settings.afterSelect(entry) === false) return;
                
                // 상세주소를 입력하는 칸으로 포커스를 이동한다.
                
                if (settings.insertDetails && settings.focusDetails) {
                    $(settings.insertDetails).focus();
                }
            });
            
            // 예전 주소 및 검색어 목록을 보였다가 숨기는 기능을 만든다.
            
            results.on("click", "a.show_old_addresses", function(event) {
                event.preventDefault();
                var old_addresses = $(this).parent().siblings(".old_addresses");
                if (old_addresses.is(":visible")) {
                    $(this).html("&#9660;");
                    old_addresses.hide();
                } else {
                    $(this).html("&#9650;");
                    old_addresses.show();
                }
            });
            
            // 키워드 입력란에 포커스를 준다.
            
            if (settings.focusKeyword) keyword_input.focus();
            
            // 셋팅 완료 콜백을 호출한다.
            
            settings.ready();
            
            // jQuery 관례에 따라 this를 반환한다.
            
            return this;
        });
    };
    
    // 단시간내 중복 검색을 방지하기 위해 직전 검색어를 기억하는 변수.
    
    $.fn.postcodify.previous = "";
    
    // 지도 링크 설정.
    
    $.fn.postcodify.mapurl = {
        daum : "http://map.daum.net/?map_type=TYPE_MAP&urlLevel=3&q=%s",
        naver : "http://map.naver.com/?mapMode=0&dlevel=12&query=%s",
        google : "http://www.google.com/maps/place/대한민국+%s"
    };
    
    // 로딩중임을 표시하는 GIF 애니메이션 파일.
    // 불필요한 요청을 줄이기 위해 base64 인코딩하여 여기에 직접 저장한다.
    
    $.fn.postcodify.gif = "data:image/gif;base64,R0lGODlhEAALAPQAAP///yIiIt7" +
        "e3tbW1uzs7CcnJyIiIklJSZKSknV1dcPDwz8/P2JiYpmZmXh4eMbGxkJCQiUlJWVlZe" +
        "np6d3d3fX19VJSUuDg4PPz87+/v6ysrNDQ0PDw8AAAAAAAAAAAACH/C05FVFNDQVBFM" +
        "i4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCwAAACwAAAAA" +
        "EAALAAAFLSAgjmRpnqSgCuLKAq5AEIM4zDVw03ve27ifDgfkEYe04kDIDC5zrtYKRa2" +
        "WQgAh+QQJCwAAACwAAAAAEAALAAAFJGBhGAVgnqhpHIeRvsDawqns0qeN5+y967tYLy" +
        "icBYE7EYkYAgAh+QQJCwAAACwAAAAAEAALAAAFNiAgjothLOOIJAkiGgxjpGKiKMkbz" +
        "7SN6zIawJcDwIK9W/HISxGBzdHTuBNOmcJVCyoUlk7CEAAh+QQJCwAAACwAAAAAEAAL" +
        "AAAFNSAgjqQIRRFUAo3jNGIkSdHqPI8Tz3V55zuaDacDyIQ+YrBH+hWPzJFzOQQaeav" +
        "Wi7oqnVIhACH5BAkLAAAALAAAAAAQAAsAAAUyICCOZGme1rJY5kRRk7hI0mJSVUXJtF" +
        "3iOl7tltsBZsNfUegjAY3I5sgFY55KqdX1GgIAIfkECQsAAAAsAAAAABAACwAABTcgI" +
        "I5kaZ4kcV2EqLJipmnZhWGXaOOitm2aXQ4g7P2Ct2ER4AMul00kj5g0Al8tADY2y6C+" +
        "4FIIACH5BAkLAAAALAAAAAAQAAsAAAUvICCOZGme5ERRk6iy7qpyHCVStA3gNa/7txx" +
        "wlwv2isSacYUc+l4tADQGQ1mvpBAAIfkECQsAAAAsAAAAABAACwAABS8gII5kaZ7kRF" +
        "GTqLLuqnIcJVK0DeA1r/u3HHCXC/aKxJpxhRz6Xi0ANAZDWa+kEAA7AAAAAAAAAAAA";
        
} (jQuery));
