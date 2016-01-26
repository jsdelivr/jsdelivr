var bitmonet = undefined;
var animatingTimerWidth = false;
var timer = null;
var checkModalTimer = null;
var invoiceCheckTimer = null;

// get current URL from where is this script loaded - it's used to append CSS files correctly
(function()
{
    var scripts = document.getElementsByTagName('script'),
        url = scripts[scripts.length - 1].getAttribute('src');

    window.bitmonet_url = url.substr(0, url.lastIndexOf('/') + 1);
})();


(function($)
{
    window.bitmonetDialog = function bitmonetDialog(p) {
        var p = p || new Object();

        // ----- Header ----- //

        this.company = p.company || "The Washington Post";
        this.heading = p.heading || "Continue Reading with a Bitcoin Pass";
        this.logo = p.logo || false;

        this.subtitle = "You've read <span class='bitmonet-limit'>15</span> free articles - grab a Bitcoin pass to keep going!";
        this.useSubtitle = "Activate a pass to keep reading!";

        // ----- Purchase Options ----- //

        this.optionData = [ { name: "Article Pass",
                            description: "Read just this article",
                            price: "10&cent;",
                            value: 10,
                            note: "We hope you enjoy your article. Remember not to clear your cookies!",
                            class: "articlePass" },

                            { name: "Hour Pass",
                            description: "1 hour of unlimited access",
                            price: "$1",
                            value: 100,
                            note: "Please remember not to clear your brower's cookies during this time.",
                            class: "hourPass" },

                            { name: "Day Pass",
                            description: "All-you-can-read news, all day",
                            price: "$3",
                            value: 300,
                            note: "Please remember not to clear your brower's cookies during this time.",
                            class: "dayPass" }
        ];

        // Set customized Purchase Option Data
        if (p.optionData !== undefined) {
            for (var i = 0; i < p.optionData.length; i++) {
                if (p.optionData[i] !== undefined) {
                    for (var attr in p.optionData[i]) {
                        if (p.optionData[i][attr] !== undefined || p.optionData[i][attr] !== "null") {
                            this.optionData[i][attr] = p.optionData[i][attr];
                        }
                    }
                }
            }
        }

        // ----- Footer ----- //

        this.footerText = "Powered by Bitmonet.";
        this.footerLink = "/";
        this.footerLinkText = "Learn More";

        // ----- Routing ----- //

        this.successURL = p.successURL || null;
        this.articleUponClick = p.articleUponClick || null; // Last article clicked

        // ----- BitPay ----- //

        this.bitpayCreatePath = p.bitpayCreatePath || "http://bitmonet-rails.herokuapp.com/create_invoice";
        this.bitpayCheckPath = p.bitpayCheckPath || "http://bitmonet-rails.herokuapp.com/check_invoice";

        this.invoices = p.invoices || [];
        this.currentInvoice = p.currentInvoice || null;

        // ----- Successful Purchases ----- //

        this.showThanks = p.showThanks || false;
        this.articleTypeIndex = p.articleTypeIndex || 0;

        // Require to show the dialog from checking passes?
        this.requireShowFromCheck = null;

        // ----- Article Detection & Modal Settings ----- //

        this.detectByMeta = p.detectByMeta || true;
        this.metaName = p.metaName || "bitmonet-article";
        this.metaContent = p.metaContent || "bitmonet-article";
        this.metaIdAttr = p.metaIdAttr || "bitmonet-articleId";

        this.numberClickedNeedBuy = p.numberClickedNeedBuy || 15;
        this.articleClickRefreshRate = p.articleClickRefreshRate || 7;

        this.detectByClassAndDataAttr = p.detectByClassAndDataAttr || false;
        this.clickClass = p.clickClass || "bitmonet-articleClick";
        this.clickDataAttr = p.clickDataAttr || "bitmonetArticleID";

        this.homeLink = p.homeLink || window.location.host;
        this.redirectPage = p.redirectPage || null;

        this.bitmonetFilesPath = p.bitmonetFilesPath || "/";

        // ----- Parameter Exceptions ----- //

        var cp = JSON.parse(getCookie('bitmonet-parameters'));
        if (cp) {
            if (cp.showThanks) {
                this.showThanks = cp.showThanks;
            }
            if (cp.articleTypeIndex) {
                this.articleTypeIndex = cp.articleTypeIndex;
            }
        }

        if (p.numberClickedNeedBuy == 0) {
            this.numberClickedNeedBuy = 0;
        }

        // ----- DOM ----- //

        this.bitmonetDomString = '\
            <div id="bitmonet-grayOut"></div>\
            <div id="bitmonet-dialog">\
                <div class="bitmonet-relativeWrap">\
                    <div class="close EIEO"></div>\
                    <div class="bitmonet-content">\
                        <div class="bitmonet-header">\
                            <h4>' + this.company + '</h4>\
                            ' + (this.logo?'<img src="' + this.logo + '" />':'<div class="bitmonet-logo"></div>') + '\
                            <p class="bitmonet-heading">' + this.heading + '</p>\
                            <p class="bitmonet-subtitle buyPass">\
                                ' + this.subtitle + '\
                            </p>\
                        </div>\
                        <div class="bitmonet-purchaseOptions">\
                            <div class="bitmonet-purchaseOption articlePass EIEO">\
                                <div class="bitmonet-icon medium book"></div>\
                                <h5>' + this.optionData[0].name + '</h5>\
                                <p class="bitmonet-purchaseDesc">' + this.optionData[0].description + '</p>\
                                    <a class="bitmonet-buyLink" target="_blank">\
                                        <div class="bitmonet-button orange EIEO buyPass">\
                                            BUY FOR ' + this.optionData[0].price + '\
                                        </div>\
                                    </a>\
                            </div>\
                            <div class="bitmonet-purchaseOption hourPass EIEO">\
                                <div class="bitmonet-icon medium clock"></div>\
                                <h5>' + this.optionData[1].name + '</h5>\
                                <p class="bitmonet-purchaseDesc">' + this.optionData[1].description + '</p>\
                                    <a class="bitmonet-buyLink" target="_blank">\
                                        <div class="bitmonet-button orange EIEO buyPass">\
                                            BUY FOR ' + this.optionData[1].price + '\
                                        </div>\
                                    </a>\
                            </div>\
                            <div class="bitmonet-purchaseOption dayPass EIEO">\
                                <div class="bitmonet-icon medium happyFace"></div>\
                                <h5>' +  this.optionData[2].name + '</h5>\
                                <p class="bitmonet-purchaseDesc">' + this.optionData[2].description + '</p>\
                                    <a class="bitmonet-buyLink" target="_blank">\
                                        <div class="bitmonet-button orange EIEO buyPass">\
                                            BUY FOR ' + this.optionData[2].price + '\
                                        </div>\
                                    </a>\
                            </div>\
                            <div style="clear: both;"></div>\
                        </div>\
                    </div>\
                </div>\
                <div class="bitmonet-iframe">\
                    <div class="close EIEO"></div>\
                    <h4 class="bitmonet-passToBuy">\
                        Get Your <span class="bitmonet-passType">Article Pass</span>\
                    </h4>\
                    <iframe id="bitmonet-iframe" frameborder="0" border="0" src=""></iframe>\
                    <div class="bitmonet-expired">\
                        This transaction has expired. Would you like to \
                        <span class="bitmonet-reTryBitPay">try again?</span>\
                        <br /><br />\
                        <div class="bitmonet-cancelIframe EIEO">Go Back</div>\
                    </div>\
                    <div class="bitmonet-otherWindow">\
                        The payment is pending in another window. \
                        <br /><br />Please check back after you are done paying.\
                        <br /><br />\
                        <div class="bitmonet-cancelIframe EIEO">Go Back</div>\
                    </div>\
                    <div class="bitmonet-cancelIframe EIEO">Cancel</div>\
                </div>\
                <div class="bitmonet-thankYou">\
                    <div class="close EIEO"></div>\
                    <h4 class="bitmonet-thanksTitle">\
                        Thank you for purchasing a<span class="bitmonet-passType">n Article Pass</span>!\
                    </h4>\
                    <p>\
                        <span class="bitmonet-passNote">' + this.optionData[2].note + '</span> \
                        <br /> <br />\
                        If you have any questions, please call us at 1-800-477-4679.\
                    </p>\
                    <div class="bitmonet-thanksContinue EIEO">Continue</div>\
                </div>\
                <div class="bitmonet-footer">\
                ' + this.footerText + ' <a href="' + this.footerLink + '">' + this.footerLinkText + '</a>\
                </div>\
            </div>\
            <div id="bitmonet-timer" class="">\
                <div class="bitmonet-timerIcon EIEO"></div>\
                <div class="bitmonet-timerDescription">\
                    <div class="bitmonet-timerTime">\
                        <span class="bitmonet-hours bitmonet-timeNumber">0</span>\
                        <span class="bitmonet-timeSeparator">:</span>\
                        <span class="bitmonet-minutes bitmonet-timeNumber">00</span>\
                        <span class="bitmonet-timeSeparator">:</span>\
                        <span class="bitmonet-seconds bitmonet-timeNumber">00</span>\
                    </div>\
                    <div class="bitmonet-passType"></div>\
                </div>\
                <div class="bitmonet-timerToggle show EIEO">^</div>\
                <div style="clear: both;"></div>\
            </div>';

        // ----- Main Methods ----- //

        this.initialize = function(params) {
            // Add CSS and Bitmonet Dialog DOM
            $('head').append('<link href="' + window.bitmonet_url + 'bitmonet.css" rel="stylesheet" type="text/css">');
            $('head').append('<link rel="stylesheet" media="(max-width: 420px)" href="' + window.bitmonet_url + 'bitmonet_small.css" />');

            $('body').append(this.bitmonetDomString);

            // Set limit number
            $('.bitmonet-limit').text(this.numberClickedNeedBuy);

            var self = this;

            /* ----- Dialog Closing ----- */

            // To close dialog
            $('#bitmonet-dialog .close').on('click', function() {
                self.checkThanksAndReverse();

                if (!self.requireShowFromCheck) {
                    $('body').css('height', '');
                    $('body').css('width', '');
                    $('body').css('overflow', '');

                    $('#bitmonet-grayOut').fadeOut();
                    $('#bitmonet-dialog').fadeOut();
                } else {
                    window.location = self.redirectPage || self.homeLink;
                }
            });

            // Close dialog upon ESC keypress
            $(document).keyup(function (e) {
                if (e.which == '27') {
                    $('#bitmonet-dialog .close').trigger('click');
                }
            });

            // Clicking outside modal
            $(document).click(function (e) {
                var dialogShowing = $('#bitmonet-dialog').is(':visible');
                var notDialog = $(e.target).attr('id') != "bitmonet-dialog";
                var notChildOfDialog = $(e.target).parents('#bitmonet-dialog').length <= 0;
                if (dialogShowing && notDialog && notChildOfDialog) {
                    $('#bitmonet-dialog .close').trigger('click');
                }
            });

            // When not mobile, make sure div always centered
            $(window).resize(function() {
                self.check_body_padding_set_overlay();
                self.set_bmd_position();
            });

            // When timer hovered, move it up
            $('#bitmonet-timer').on('mouseover', function() {
                if (!animatingTimerWidth && !$(this).hasClass('timer-clicked')) {
                    $(this).stop().animate({
                        'bottom': '-1px',
                    }, 'fast');
                }
            }).on('mouseout', function() {
                if (!animatingTimerWidth && !$(this).hasClass('timer-clicked')) {
                    $(this).stop().animate({ 'bottom': '-10px' }, 'fast');
                }
            });

            // Timer Show/Hide
            $('#bitmonet-timer').on('click', function() {
                if ($(this).hasClass('timer-clicked')) {
                    $(this).find('.bitmonet-timerDescription').fadeOut('fast', function() {
                        animatingTimerWidth = true;
                        $('#bitmonet-timer').stop().animate({
                            'width': '60px',
                            'bottom': '-10px'
                        }, 'normal', function() {
                            animatingTimerWidth = false;
                            $(this).find('.bitmonet-timerToggle').text("^");
                        });
                    });

                    $(this).removeClass('timer-clicked');
                } else {
                    animatingTimerWidth = true;
                    $(this).animate({
                        'width': '132px',
                        'bottom': '-1px'
                    }, 'normal', function() {
                        $(this).find('.bitmonet-timerDescription').fadeIn();
                        animatingTimerWidth = false;
                        $(this).find('.bitmonet-timerToggle').text("x");
                    });

                    $(this).addClass('timer-clicked');
                }
            });

            // Removing thanks view DOM until required
            $('.bitmonet-thankYou .bitmonet-thanksContinue').on('click', function() {
                if (!self.requireShowFromCheck) {
                    $('#bitmonet-dialog .close').trigger('click');
                } else {
                    self.checkThanksAndReverse();
                    return false;
                }
            });

            // Interrupt Payment Buy click, don't allow target _blank
            $('.bitmonet-purchaseOption > .bitmonet-buyLink').on('click', function() {
                var passType = $(this).parent().find('h5').first().text();

                $('.bitmonet-iframe').find('.bitmonet-passType').text(passType);
                bitmonet.articleTypeIndex = $(this).parent().index();
                var passClass = bitmonet.optionData[bitmonet.articleTypeIndex].class
                $('.bitmonet-iframe').find('h4').first().addClass(passClass);

                 // Check if mobile
                 self.onm_window_parameters();

                 if (windowWidth > 500) {
                     self.createInvoice(bitmonet.optionData[bitmonet.articleTypeIndex].value / 100);

                     return false;
                 } else {
                     self.createInvoice(bitmonet.optionData[bitmonet.articleTypeIndex].value / 100, true);
                 }
            });

            // Clicking cancel or go back on bitpay iframe
            $('.bitmonet-cancelIframe').on('click', function() {
                $('.bitmonet-iframe:visible, .bitmonet-otherWindow:visible').fadeOut('normal', function() {
                    $('.bitmonet-relativeWrap').show();
                });
            });

            // Clicking retry button
            $('.bitmonet-reTryBitPay').on('click', function() {
                 if ($(window).width() > 500) {
                    self.createInvoice(bitmonet.optionData[bitmonet.articleTypeIndex].value / 100);
                } else {
                    var value = bitmonet.optionData[bitmonet.articleTypeIndex].value / 100;
                    var link = $($('.bitmonet-buyLink')[bitmonet.articleTypeIndex]);

                    self.createInvoice(value, link, true);
                }
            });

            // If page is closing, save parameters
            window.onbeforeunload = function() {
                self.saveParameters();
            };

            // When done initializing, save everything
            self.saveParameters();
        };

        this.show = function() {
            this.check_body_padding_set_overlay();
            this.set_bmd_position();
            $('#bitmonet-grayOut').fadeIn();
            $('#bitmonet-dialog').fadeIn();

            // When modal is active, no need to scroll
            $('body').css('height', '100%');
            $('body').css('width', '100%');
            $('body').css('overflow', 'hidden');
        };

        this.showThankYouDom = function(fade) {
            if (fade && $('.bitmonet-iframe').is(":visible")) {
                $('.bitmonet-iframe').fadeOut('normal', function() {
                    $('.bitmonet-thankYou').show();
                });
            } else if (fade) {
                $('.bitmonet-relativeWrap').fadeOut('normal', function() {
                    $('.bitmonet-thankYou').show();
                });
            } else {
                $('.bitmonet-relativeWrap').hide();
                $('.bitmonet-thankYou').show();
            }

            var articleTypeIndex = bitmonet.articleTypeIndex;
            var passType = bitmonet.optionData[articleTypeIndex].name;

            if (articleTypeIndex == 0 || articleTypeIndex == 1) {
                passType = "n " + passType;
            } else {
                passType = " " + passType;
            }

            $('.bitmonet-thankYou .bitmonet-passType').text(passType);
            $('.bitmonet-thankYou .bitmonet-passNote').text(bitmonet.optionData[bitmonet.articleTypeIndex].note);

            $('.bitmonet-thankYou h4').addClass(bitmonet.optionData[bitmonet.articleTypeIndex].class);

            bitmonet.show();
        }

        this.reverseThankYouDom = function() {
            $('.bitmonet-thankYou').fadeOut('normal', function() {
                $('.bitmonet-relativeWrap').fadeIn();
            });
        };

        this.checkThanksAndReverse = function() {
            if (this.showThanks) {
                this.reverseThankYouDom();
                this.showThanks = false;

                this.saveParameters();
            }
        };

        this.createInvoice = function(price, link, click) {
            var source = "";
            var self = this;

            $.ajax({
                type: "GET",
                url: self.bitpayCreatePath,
                data: {"price": price, "currency": "USD"},
                dataType: "jsonp",
                success: function(result)
                {
                    if (typeof result !== 'object' || !result.hasOwnProperty('id'))
                    {
                        alert('An error occurred, please try again later.');
                        return;
                    }

                    self.invoices.push(result.id);
                    self.currentInvoice = result.id;
                    self.saveParameters();

                    // Use iframe if window is large enough, otherwise, use other window
                    if (link){
                        window.location = result.url;
                    } else {
                        source = result.url + "&view=iframe";

                        $('.bitmonet-iframe').find('iframe').first().attr('src', source);

                        $('.bitmonet-relativeWrap').hide();
                        $('.bitmonet-expired').hide();
                        $('.bitmonet-otherWindow').hide();
                        $('.bitmonet-iframe').show();
                        $('#bitmonet-iframe').show();
                        $('.bitmonet-iframe .bitmonet-cancelIframe').show();
                    }

                    checkInvoiceStatus(result.id);
                },
                error: function()
                {
                    alert('An error occurred, please try again later.');
                }
            });
        };

        // ----- Helper Functions ----- //

        this.onm_window_parameters = function() {
            windowWidth = $(window).width(); //retrieve current window width
            windowHeight = $(window).height(); //retrieve current window height
            documentWidth = $(document).width(); //retrieve current document width
            documentHeight = $(document).height(); //retrieve current document height
            vScrollPosition = $(document).scrollTop(); //retrieve the document scroll ToP position
            hScrollPosition = $(document).scrollLeft(); //retrieve the document scroll Left position
        };

        this.set_bmd_position = function() {
            this.onm_window_parameters();

            var windowMobile = windowWidth <= 420;
            if (windowMobile) {
                $('#bitmonet-dialog').css('top', '0px');
                $('#bitmonet-dialog').css('left', '0px');

                return;
            }

            var bmHeight = 478;
            var bmWidth = 700;

            if ($('#bitmonet-dialog').is(":visible")) {
                bmHeight = $('#bitmonet-dialog').outerHeight();
                bmWidth = $('#bitmonet-dialog').outerWidth();
            }

            var bmTop = windowHeight / 2 - bmHeight / 2;
            bmTop = bmTop < 0 ? 0 : bmTop;
            var bmLeft = windowWidth / 2 - bmWidth / 2;
            bmLeft = bmLeft < 0 ? 0 : bmLeft;

            $('#bitmonet-dialog').css('top', bmTop + 'px');
            $('#bitmonet-dialog').css('left', bmLeft + 'px');
        };

        this.check_body_padding_set_overlay = function() {
            this.onm_window_parameters();

            var windowMobile = windowWidth <= 420;
            if (windowMobile) {
                return;
            }

            var top = this.get_number_from_px($('body').css('margin-top'));
            var bottom = this.get_number_from_px($('body').css('margin-bottom'));
            var left = this.get_number_from_px($('body').css('margin-left'));
            var right = this.get_number_from_px($('body').css('margin-right'));

            $('#bitmonet-grayOut').css('top', '-' + top + 'px');
            $('#bitmonet-grayOut').css('left', '-' + left + 'px');
            $('#bitmonet-grayOut').css('width', $(document).width() + right + 'px');
            $('#bitmonet-grayOut').css('height', $(document).height() + bottom + 'px');
        };

        this.get_number_from_px = function(string) {
            var index = string.indexOf('px');

            return parseInt(string.substring(0, index));
        };

        // ----- Cookies ----- //

        this.setCookie = function(c_name, value, exdays) {
            var exdate=new Date();
            exdate.setDate(exdate.getDate() + exdays);
            var c_value = escape(value) + ((exdays==null) ? "" : "; expires=" + exdate.toUTCString());
            var host = window.location.host;
            if (host.indexOf('www.') != -1) {
                host = host.substring(3);
            } else if (host[0] != ".") {
                host = "." + host;
            }
            var domain = ";domain=" + host + ";path=/";
            document.cookie = c_name + "=" + c_value + domain;
        };

        this.getParamters = function() {
            // TODO FUTURE: REARRANGE
            var parameters = ["company"
                            , "heading"
                            , "logo"
                            , "subtitle"
                            , "useSubtitle"

                            , "optionData"

                            , "footerText"
                            , "footerLink"
                            , "footerLinkText"

                            , "successURL"
                            , "articleUponClick"

                            , "pageCodes"

                            , "bitpayCreatePath"
                            , "bitpayCheckPath"
                            , "currentInvoice"

                            , "showThanks"
                            , "articleTypeIndex"

                            , "requireShowFromCheck"

                            , "detectByMeta"
                            , "metaName"
                            , "metaContent"
                            , "metaIdAttr"

                            , "numberClickedNeedBuy"
                            , "articleClickRefreshRate"

                            , "detectByClassAndDataAttr"
                            , "clickClass"
                            , "clickDataAttr"

                            , "homeLink"
                            , "redirectPage"

                            , "bitmonetFilesPath"
                            ];

            var returnParameter = {};

            for (var param in parameters) {
                var currParam = parameters[param];
                returnParameter[currParam] = this[currParam];
            }

            return returnParameter;
        }

        this.saveParameters = function() {
            var params = JSON.stringify(this.getParamters());
            this.setCookie("bitmonet-parameters", params, 30);
        }
    };

    $(document).ready(function() {
        // Check if bitmonet set, if not set it
        if (bitmonet === undefined) {
            var params = JSON.parse(getCookie("bitmonet-parameters"));
            bitmonet = new bitmonetDialog(params);
            bitmonet.initialize();
        }

        // Check if successs page, create passes
        var path = window.location.pathname;

        var successURL = bitmonet.successURL || bitmonet.homeLink;

        if (path.indexOf(successURL) !== -1) {
            var query = unescape(window.location.search.split("?")[1]);

            var queryValueKey = "&order[total_native][cents]";
            var foundIndex = query.indexOf(queryValueKey);

            // If this is not returning parameters of what is paid
            if (foundIndex == -1) {
                return;
            }

            var valueIndex = foundIndex + queryValueKey.length + 1;
            var endIndex = query.indexOf("&", valueIndex + queryValueKey.length + 1);
            endIndex = endIndex === -1 ? query.length - 1 : endIndex;

            var queryValue = parseFloat(query.substring(valueIndex, endIndex));

            var passLink = bitmonet.articleUponClick;

            setPass(queryValue, passLink);
        }

        // Check to see if any passes have cleared
        for (var i in bitmonet.invoices) {
            checkInvoiceStatus(bitmonet.invoices[i], true);
        }

        // Show the outstanding invoice
        if (bitmonet.currentInvoice != null) {
            bitmonet.onm_window_parameters();

            // Use iframe if window is large enough, otherwise, use other window
            if (windowWidth < 500){
                 // Show other window message
                $('.bitmonet-relativeWrap').hide();
                 $('#bitmonet-iframe').hide();
                 $('.bitmonet-iframe').fadeIn();
                 $('.bitmonet-iframe > .bitmonet-cancelIframe').hide();
                 $('.bitmonet-otherWindow').show();

                checkInvoiceStatus(bitmonet.currentInvoice);
            } else {
                checkInvoiceStatus(bitmonet.currentInvoice, true);
            }

            if (!$('#bitmonet-dialog').is(':visible')) { bitmonet.show(); }
        }
    });

    $(window).load(function() {
        // Check if Page is article
        if (bitmonet.detectByMeta) {

            $('meta').each(function() {
                var correctName = $(this).attr('name') == bitmonet.metaName;
                var correctContent = $(this).attr('content') == bitmonet.metaContent;
                if (correctName && correctContent) {
                    var link = window.location.pathname;
                    var articleId = $(this).attr(bitmonet.metaIdAttr);
                    var articlesTracked = JSON.parse(getCookie('bitmonet-articlesTracked')) || {};

                    if (articlesTracked == "null") {
                        articlesTracked = {};
                    }

                    bitmonet.articleUponClick = link;

                    if (!articlesTracked[link]) {
                        articlesTracked[link] = articleId;

                        bitmonet.setCookie('bitmonet-articlesTracked', JSON.stringify(articlesTracked), 365);
                    }

                    // Check if need pass
                    var numTracked = Object.keys(articlesTracked).length;
                    var freeOver = numTracked > bitmonet.numberClickedNeedBuy || bitmonet.numberClickedNeedBuy < 1;
                    var hasPass = checkPassesAndSetTimer();
                    if (freeOver && !hasPass) {
                        setTimeout(function() {bitmonet.show();}, 100);
                        bitmonet.requireShowFromCheck = true;
                    } else {
                        bitmonet.requireShowFromCheck = false;
                    }

                    bitmonet.saveParameters();
                } else if (correctName && !correctContent) {
                    // If page is not an article, set last page visited
                    bitmonet.redirectPage = window.location.pathname;

                    bitmonet.saveParameters();
                }
            });
        }

        // Check if thankyou page is needed to be shown
        if (bitmonet && bitmonet.showThanks) {
            bitmonet.showThankYouDom();
        }
    });

    function getCookie(c_name) {
        var c_value = document.cookie;
        var c_start = c_value.indexOf(" " + c_name + "=");
        if (c_start == -1) {
            c_start = c_value.indexOf(c_name + "=");
        }
        if (c_start == -1) {
            c_value = null;
        } else {
            c_start = c_value.indexOf("=", c_start) + 1;
            var c_end = c_value.indexOf(";", c_start);
            if (c_end == -1){
                c_end = c_value.length;
            }
            c_value = unescape(c_value.substring(c_start,c_end));
        }
        return c_value;
    };

    function checkPassesAndSetTimer() {
        var href = window.location.href;

        // Check if day pass
        var dayPasses = JSON.parse(getCookie('bitmonet-dayPasses'));
        var foundActiveDayPass = false;
        var firstDayPassLocation = -1;
        var deletedPasses = [];

        for (var dayPass in dayPasses) {
            var pass = dayPasses[dayPass];
            if (pass.activated) {
                var hourDiff = (new Date() - new Date(pass.start)) / 1000 / 60 / 60;
                if (hourDiff >= 24) {
                    // Mark old activated passes for removal
                    deletedPasses.push(dayPass);
                } else if (!foundActiveDayPass) {
                    foundActiveDayPass = true;

                    // Turn on Timer
                    var expiry = new Date(pass.start);
                    expiry.setHours(expiry.getHours() + 24);
                    setTimer(expiry);

                    return true;
                } else if (foundActiveDayPass) {
                    // Turn off multiple activated ones if time is still available
                    dayPasses[dayPass].activated = false;
                }
            } else if (firstDayPassLocation == -1) {
                firstDayPassLocation = dayPass;
            }
        }

        // Remove tagged unused passes
        for (var i = deletedPasses.length - 1; i >= 0; i--) {
            // If unused passes are plucked before the first avilable, update
            if (deletedPasses[i] < firstDayPassLocation) {
                firstDayPassLocation--;
            }
            dayPasses.splice(deletedPasses[i], 1);
        }

        if (dayPasses) {
            bitmonet.setCookie('bitmonet-dayPasses', JSON.stringify(dayPasses), 365);
        }

        // -- If no day pass, check for hour pass -- //

        var hourPasses = JSON.parse(getCookie('bitmonet-hourPasses'));
        var foundActiveHourPass = false;
        var firstHourPassLocation = -1;
        deletedPasses = [];

        for (var hourPass in hourPasses) {
            var pass = hourPasses[hourPass];
            if (pass.activated) {
                var hourDiff = (new Date() - new Date(pass.start)) / 1000 / 60 / 60;
                if (hourDiff >= 1) {
                    // Mark old activated passes for removal
                    deletedPasses.push(hourPass);
                } else if (!foundActiveHourPass && !foundActiveDayPass) {
                    foundActiveHourPass = true;

                    var expiry = new Date(pass.start);
                    expiry.setHours(expiry.getHours() + 1);
                    setTimer(expiry);

                    return true;
                } else if (foundActiveHourPass) {
                    // Turn off multiple activated ones if time is still available
                    hourPasses[hourPass].activated = false;
                }
            } else if (firstHourPassLocation == -1) {
                firstHourPassLocation = hourPass;
            }
        }
        // Remove tagged unused passes
        for (var i = deletedPasses.length - 1; i >= 0; i--) {
            // If unused passes are plucked before the first avilable, update
            if (deletedPasses[i] < firstHourPassLocation) {
                firstHourPassLocation--;
            }
            hourPasses.splice(deletedPasses[i], 1);
        }

        if (hourPasses) {
            bitmonet.setCookie('bitmonet-hourPasses', JSON.stringify(hourPasses), 365);
        }

        // -- Check for article passes -- //

        var articlePasses = JSON.parse(getCookie('bitmonet-articlePasses'));
        var foundActiveArticlePass = false;
        var firstArticlePassLocation = -1;

        for (var articlePass in articlePasses) {
            var pass = articlePasses[articlePass];
            if (href.indexOf(pass.link) != -1) {
                if (!pass.activated) {
                    pass.activated = true;
                }

                // TODO TESTING check if artical passes has updated
                bitmonet.setCookie('bitmonet-articlePasses', JSON.stringify(articlePasses), 365);
                foundActiveArticlePass = true;

                return true;
            } else if ((!pass.activated || !pass.link) && firstArticlePassLocation == -1) {
                firstArticlePassLocation = articlePass;
            }
        }

        // If no active passes are found, find one to use
        if (!foundActiveDayPass && !foundActiveHourPass && !foundActiveArticlePass) {
            // Check to see if any passes are free, use them
            if (firstDayPassLocation != -1) {
                dayPasses[firstDayPassLocation].start = new Date();
                dayPasses[firstDayPassLocation].activated = true;

                foundActiveDayPass = true;

                // Turn on Timer
                var expiry = new Date(dayPasses[firstDayPassLocation].start);
                expiry.setHours(expiry.getHours() + 24);
                setTimer(expiry);

                // Save article pass state to cookie
                bitmonet.setCookie('bitmonet-dayPasses', JSON.stringify(dayPasses), 365);

                return true;
            } else if (firstHourPassLocation != -1) {
                hourPasses[firstHourPassLocation].start = new Date();
                hourPasses[firstHourPassLocation].activated = true;

                foundActiveHourPass = true;

                // Turn on Timer
                var expiry = new Date(hourPasses[firstHourPassLocation].start);
                expiry.setHours(expiry.getHours() + 1);
                setTimer(expiry);

                // Save article pass state to cookie
                bitmonet.setCookie('bitmonet-hourPasses', JSON.stringify(hourPasses), 365);

                return true;
            } else if (firstArticlePassLocation != -1) {
                if (!bitmonet.articleUponClick) {
                    alert('wtf?');
                    debugger;
                }
                articlePasses[firstArticlePassLocation].link = bitmonet.articleUponClick;
                articlePasses[firstArticlePassLocation].activated = true;

                foundActiveArticlePass = true;

                // Save article pass state to cookie
                bitmonet.setCookie('bitmonet-articlePasses', JSON.stringify(articlePasses), 365);

                return true;
            } else {
                return false;
            }
        }

        return (foundActiveDayPass || foundActiveHourPass || foundActiveArticlePass);
    }

    function setPass(passPrice, passLink) {
        // Check which type of pass was bought, set it accordingly
        if (passPrice == bitmonet.optionData[0].value) {
            // -- Article Pass -- //

            // Create and Add new pass
            var articlePasses = JSON.parse(getCookie('bitmonet-articlePasses')) || [];

            var newPass = {
                link: null,
                activated: false
            };

            articlePasses.push(newPass);

            // Save article pass state to cookie
            bitmonet.setCookie('bitmonet-articlePasses', JSON.stringify(articlePasses), 365);

            bitmonet.showThanks = true;
            bitmonet.articleTypeIndex = 0;
            bitmonet.saveParameters();

            // If requires redirect, do it
            if (passLink !== undefined) {
                window.location = passLink || bitmonet.homeLink;
            }

        } else if (passPrice == bitmonet.optionData[1].value) {
            // -- Hour Pass -- //

            // Create and Add new pass
            var hourPasses = JSON.parse(getCookie('bitmonet-hourPasses')) || [];

            var newPass = {
                start: new Date(),
                activated: false
            };

            hourPasses.push(newPass);

            // Save article pass state to cookie
            bitmonet.setCookie('bitmonet-hourPasses', JSON.stringify(hourPasses), 365);

            bitmonet.showThanks = true;
            bitmonet.articleTypeIndex = 1;
            bitmonet.saveParameters();

            // If requires redirect, do it
            if (passLink !== undefined) {
                window.location = passLink || bitmonet.homeLink;
            }
        } else if (passPrice == bitmonet.optionData[2].value) {
            // -- Day Pass -- //

            // Create and Add new pass
            var dayPasses = JSON.parse(getCookie('bitmonet-dayPasses')) || [];

            var newPass = {
                start: new Date(),
                activated: false
            }

            dayPasses.push(newPass);

            // Save article pass state to cookie
            bitmonet.setCookie('bitmonet-dayPasses', JSON.stringify(dayPasses), 365);

            bitmonet.showThanks = true;
            bitmonet.articleTypeIndex = 2;
            bitmonet.saveParameters();

            // If requires redirect, do it
            if (passLink !== undefined) {
                window.location = passLink || bitmonet.homeLink;
            }

        } else {
            alert('something went wrong! This pass doesn\'t exist');
        }
    }

    function setTimer(timeLeft) {
        clearTimeout(timer);
        var diff = timeLeft - (new Date());

        var hours = 0;
        var minutes = 0;
        var seconds = 0;

        if (diff >= 0) {
            var hours = Math.floor(diff / 1000 / 60 / 60);
            diff -= hours * 1000 * 60 * 60;

            var minutes = Math.floor(diff / 1000 / 60);
            diff -= minutes * 1000 * 60;

            var seconds = Math.floor(diff / 1000);
            diff -= seconds * 1000;
        }

        hours = hours < 10 ? '0' + hours : hours;
        $('#bitmonet-timer .bitmonet-hours').text(hours);
        minutes = minutes < 10 ? '0' + minutes : minutes;
        $('#bitmonet-timer .bitmonet-minutes').text(minutes);
        seconds = seconds < 10 ? '0' + seconds : seconds;
        $('#bitmonet-timer .bitmonet-seconds').text(seconds);

        // If timer is visible, show it
        if (!$('#bitmonet-timer').hasClass('timer-visible')) {
            $('#bitmonet-timer').addClass('timer-visible');
            $('#bitmonet-timer').stop().animate({
                'bottom': '-5px'
            });
        }

        if ((timeLeft - (new Date())) / 1000 > 1) {
            timer = setTimeout(function() {
                setTimer(timeLeft);
            }, 1000);
        } else {
            // Out of time, check if need pass

            if ($('#bitmonet-timer').hasClass('timer-visible')) {
                $('#bitmonet-timer').removeClass('timer-visible');
                $('#bitmonet-timer').stop().animate({
                    'bottom': '-62px'
                });
            }

            clearTimeout(timer);
            var articlesTracked = JSON.parse(getCookie('bitmonet-articlesTracked')) || {};

            var numTracked = Object.keys(articlesTracked).length;
            var freeOver = numTracked > bitmonet.numberClickedNeedBuy || bitmonet.numberClickedNeedBuy < 1;
            var hasPass = checkPassesAndSetTimer();
            if (freeOver && !hasPass) {
                bitmonet.show();
                bitmonet.requireShowFromCheck = true;
            } else {
                bitmonet.requireShowFromCheck = false;
            }
        }
    }

    function checkInvoiceStatus(id, nocall) {
        clearTimeout(invoiceCheckTimer);

        $.ajax({
            type: "GET",
            url: bitmonet.bitpayCheckPath,
            data: {"id": id},
            dataType: "jsonp",
            error: function()
            {
                // if error occurred, try to check again
                invoiceCheckTimer = setTimeout(function()
                {
                    checkInvoiceStatus(id);
                }, 1000);
            },
            success: function(result)
            {
                if (typeof result !== 'object' || !result.hasOwnProperty('id'))
                {
                    invoiceCheckTimer = setTimeout(function()
                    {
                        checkInvoiceStatus(id);
                    }, 1000);

                    return;
                }


                // nocall is to do everything in-page, no call is generally used for non-mobile
                // triggering the BitPay Payment page in an iframe

                if (nocall == undefined && result.status == "new") {
                    // If the invoice was just created, keep checking it
                    invoiceCheckTimer = setTimeout(function() {
                        checkInvoiceStatus(result.id);
                    }, 1000);
                } else if (nocall == undefined && result.status == "expired" || result.status == "invalid") {
                    // If for sure the invoice has failed, return them to the regular modal
                    $('#bitmonet-iframe:visible, .bitmonet-cancelIframe:visible, .bitmonet-otherWindow:visible').fadeOut('normal', function() {
                        $('.bitmonet-expired').fadeIn();
                        if (bitmonet.currentInvoice != null) {
                            bitmonet.currentInvoice = null;
                            bitmonet.saveParameters();
                        }
                    });
                } else if (result.status == "paid" || result.status == "confirmed" || result.status == "complete") {
                    // -- Completed Invoice -- //

                    // If this is a cached invoice, remove it
                    if (jQuery.inArray(result.id, bitmonet.invoices) != -1) {
                        bitmonet.invoices.splice(jQuery.inArray(result.id, bitmonet.invoices), 1);
                        bitmonet.saveParameters();
                    }

                    // UN-set checking of invoice, not required anymore.
                    if (bitmonet.currentInvoice != null) {
                        bitmonet.currentInvoice = null;
                        bitmonet.saveParameters();
                    }

                    setPass(result.price * 100);
                    checkPassesAndSetTimer();
                    bitmonet.requireShowFromCheck = false;

                    // Sometimes the modal is not shown already. Show.
                    if (!$('#bitmonet-dialog').is(':visible')) { bitmonet.show(); }
                    bitmonet.showThankYouDom(true);
                } else if (nocall) {
                    // Show the BitPay Payment page in the iFrame
                    source = result.url + "&view=iframe";

                    $('.bitmonet-iframe').find('iframe').first().attr('src', source);

                    $('.bitmonet-relativeWrap').hide();
                    $('.bitmonet-expired').hide();
                    $('.bitmonet-otherWindow').hide();
                    $('.bitmonet-iframe').show();
                    $('#bitmonet-iframe').show();
                    $('.bitmonet-iframe .bitmonet-cancelIframe').show();

                     var passType = bitmonet.optionData[bitmonet.articleTypeIndex].name

                    $('.bitmonet-iframe').find('.bitmonet-passType').text(passType);
                    var passClass = bitmonet.optionData[bitmonet.articleTypeIndex].class

                    $('.bitmonet-iframe').find('h4').first().addClass(passClass);

                    if (!$('#bitmonet-dialog').is(':visible')) { bitmonet.show(); }
                }
            }
        });
    }

})(jQuery);