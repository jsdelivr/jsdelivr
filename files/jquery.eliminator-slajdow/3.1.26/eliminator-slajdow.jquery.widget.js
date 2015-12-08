/*
 *   Eliminator Slajdów - jQuery widget dla przeglądarek Chrome i Firefox
 *
 *   Autor: Paweł Raszewski
 *   Licencja: GPLv3
 *   Strona Domowa: http://eliminator-slajdow.herokuapp.com
 *
 *   CDN: http://cdn.jsdelivr.net/jquery.eliminator-slajdow/@@version/eliminator-slajdow.jquery.widget.js
 *
 *   Wersja: @@version
 * */

(function ($) {
    $.widget("info_raszewski.eliminatorSlajdow", {
        options: {
            imageBaseUrl: "",
            scrollableImageContainer: false,
            esLogoUrl: "es_logo.svg",
            cssPath: "",
            facebookUrl: "https://www.facebook.com/eliminator-slajdow?ref=chrome.extension",
            bugReportUrl: "http://eliminator-slajdow.herokuapp.com/?ref=chrome.extension",
            debug: false,
            version: "@@version-standalone",
            customPages: {},
            trackingCallback: function (category, action) {
            }
        },
        pageOptions: {
            sectionToBeEmptySelector: ".navigation div, .navigation span.page, #gal_navi_wrp, #gazeta_article_image_overlay",
            sectionToBeRemovedSelector: "#gazeta_article_image div.overlayBright",
            navigationNextULRSelector: ".navigation .next:first",
            navigationPageNumberSelector: ".navigation .page:first",
            articleBodySelector: "#gazeta_article_body",
            sectionToBeAttached: "#gazeta_article_image img,#gazeta_article_body",
            headerSectionSelector: ".navigation:first h1 span",
            sectionToBeRemovedFromAttachedSlidesSelector: "",
            hasSlideNumbers: true,
            visitedSlideURLs: [],
            classesToBeRemoved: [],
            pageType: "Default",
            customStyle: {},
            trigger: "",
            triggerStopper: "",
            esTheme: "default",
            preIncludeCallback: function () {
            },
            beforeAllCallback: function () {
            },
            afterAllCallback: function () {
            }
        },
        pages: [
            {   trigger: "body#oficjalna_strona_eliminatora_slajdow",
                name: "OFICJALNA STRONA ELIMINATORA SLAJDÓW",
                regressionUrls: ["http://eliminator-slajdow.herokuapp.com/"],
                pageType: "0",
                navigationNextULRSelector: "",
                hasSlideNumbers: false,
                beforeAllCallback: function () {
                    $("body").attr("es-version-data", this.options.version);
                    this._tracking("ES_HOMEPAGE", this.options.version);
                }
            },
            {   trigger: "body#pagetype_photo",
                triggerStopper: "body#pagetype_photo.simpleGallery #gazeta_gallery_popup .gs_navigation .gs_next",
                name: "galeria #pagetype_photo (1)",
                regressionUrls: ["http://deser.pl/deser/51,111858,15435006.html?i=1",
                    "http://wyborcza.pl/51,75248,12537285.html?i%3a0&piano_t=1",
                    "http://www.sport.pl/pilka/56,136438,16075836,MS_2014__Thomas_Donohoe_dostal_pomnik__Czy_to_on_przywiozl.html",
                    "http://wiadomosci.gazeta.pl/wiadomosci/51,114871,16254019.html"],
                sectionToBeEmptySelector: "#gazeta_article_miniatures",
                sectionToBeRemovedSelector: "#gazeta_article_top .navigation, #gazeta_article .navigation, #gazeta_article_image .overlayBright",
                pageType: "1",
                customStyle: {"#col_left": "width:auto", "#columns_wrap": "background:none",
                    ".path_duzy_kadr .imageContainerEliminatorSlajdow p.headerLogo, .path_duzy_kadr .slideTitle": "color: white"},
                preIncludeCallback: function () {
                    $("#col_left").width($("#gazeta_article_image").find("div a img").width());
                }
            },
            {   trigger: "body#pagetype_art_blog",
                name: "galeria #pagetype_art_blog (2)",
                regressionUrls: ["http://www.plotek.pl/plotek/56,78649,13096942,Kaja_Paschalska,,1.html",
                    "http://www.plotek.pl/plotek/56,79592,12829011,Jako_dzieci_byli_gwiazdami_seriali__Co_dzis_robia.html",
                    "http://wiadomosci.gazeta.pl/wiadomosci/5,114944,14025881,Turcja__Tysiace_ludzi_na_ulicach__starcia_z_policja.html?i=17",
                    "http://lublin.gazeta.pl/lublin/56,35640,13282657,I_plug_nie_dawal_rady,,2.html",
                    "http://wyborcza.pl/duzy_kadr/56,97904,12530404,Najlepsze_zdjecia_tygodnia.html"],
                sectionToBeAttached: "#gazeta_article_image img,#gazeta_article_body, div[id*='gazeta_article_image_']:not('#gazeta_article_image_overlay')",
                pageType: "2",
                customStyle: {".path_duzy_kadr #col_left": "width:auto",
                    ".path_duzy_kadr .imageContainerEliminatorSlajdow p.headerLogo, .path_duzy_kadr .slideTitle": "color: white"},
                classesToBeRemoved: ["gazetaVideoPlayer"],
                preIncludeCallback: function () {
                    this._updateGalleryLink();
                }
            },
            {   trigger: "body#pagetype_art #gazeta_article_tools",
                name: "galeria body#pagetype_art #gazeta_article_image (3)",
                regressionUrls: ["http://gazetapraca.pl/gazetapraca/56,90443,12057502,10_najdziwniejszych_powodow__dla_ktorych_rzucamy_prace.html"],
                sectionToBeAttached: "#gazeta_article_image,#gazeta_article_body, div[id*='gazeta_article_image_']:not('#gazeta_article_image_overlay')",
                sectionToBeRemovedSelector: "#gazeta_article_image div.overlayBright",
                pageType: "3",
                preIncludeCallback: function () {
                    this._updateGalleryLink();
                }
            },
            {   trigger: "div#art div#container_gal",
                name: "gazetapraca.pl ",
                regressionUrls: [],
                articleBodySelector: "#art",
                navigationPageNumberSelector: ".paging:first",
                sectionToBeEmptySelector: "div#gal_navi_wrp, #gal_navi_wrp",
                navigationNextULRSelector: "#gal_btn_next a:first",
                sectionToBeAttached: "div#container_gal",
                pageType: "4"
            },
            {   trigger: "div#article div#article_body",
                name: "galeria div#article div#article_body (5)",
                regressionUrls: [""],
                articleBodySelector: "#article_body",
                navigationNextULRSelector: "#gal_btn_next a:first",
                sectionToBeEmptySelector: "#gal_navi_wrp", // div#article ul,
                sectionToBeAttached: "div#container_gal",
                navigationPageNumberSelector: "#gal_navi .paging",
                pageType: "5",
                esTheme: "white"
            },
            {   trigger: "div#k1 div#k1p div#gal_outer",
                name: "galeria bez typu ('div#k1 div#k1p div#gal_outer') (6)",
                regressionUrls: ["http://wyborcza.pl/51,75248,12537285.html?i:0"],
                articleBodySelector: "div#gal_outer .description",
                navigationNextULRSelector: "li.btn_next a:first",
                sectionToBeEmptySelector: "div#article ul, #gal_navi_wrp, div#gal_miniatures",
                sectionToBeAttached: "div#gal_picture, div.description, p.description",
                navigationPageNumberSelector: "#gal_navi .paging",
                hasSlideNumbers: false,
                pageType: "6"

            },
            {   trigger: "div.PopupWielkosc div.ZdjecieGaleriaMaxWielkosc",
                name: "autotrader.pl - galeria zdjec samochodu - 2013",
                regressionUrls: [],
                articleBodySelector: "div#Zawartosc div.Detale",
                navigationNextULRSelector: "div:not(.ZjecieZaznaczone).ZdjecieGaleriaMini a",
                sectionToBeEmptySelector: "div.DetaleZdjeciaMiniOdstep, div.GaleriaPopupNastepne, div.FloatRight.PopupReklamaPoPrawej, div.TextAlignCenter.PopupReklamaNaDole",
                sectionToBeAttached: "div.ZdjecieGaleriaMaxWielkosc",
                navigationPageNumberSelector: "div.PasekZjecieOdstep",
                hasSlideNumbers: false,
                classesToBeRemoved: ["ZdjecieGaleriaMaxWielkosc"],
                pageType: "7"
            },
            {   trigger: " #multiGallery #multiGalleryContent #gallery",
                name: "MultiGallery na ONET.PL",
                regressionUrls: ["http://wiadomosci.onet.pl/swiat/nieznane-zdjecia-z-okresu-i-wojny-swiatowej-ujrzaly-swiatlo-dzienne/5kmg0",
                    "http://wiadomosci.onet.pl/swiat/berlin-podzielony-murem-tak-wygladal-w-okresie-zimnej-wojny/64dph"],
                articleBodySelector: "#multiGallery #multiGalleryContent #galleryText",
                sectionToBeEmptySelector: "*[id='mediaList'], script, .onet-ad, .navBox .navBoxContainer, .imageContainerEliminatorSlajdow .navBoxClose, .ad_adInfo, .ad_adInfoEnd",
                sectionToBeRemovedSelector: ".imageContainerEliminatorSlajdow .navBoxClose, .ad_adInfo, .ad_adInfoEnd, #multiGalleryContent .navBox",
                navigationNextULRSelector: ".navBox .navBoxContainer a.nextFixed",
                navigationPageNumberSelector: "",
                sectionToBeAttached: "#multiGalleryContent #galleryText", // sekcja komentarza i obrazek
                headerSectionSelector: "",
                hasSlideNumbers: false,
                customStyle: {"body": "height:auto"},
                pageType: "8",
                triggerStopper: "#multiGallery #multiGalleryContent #gallery .mainMediaImg img.after"
            },
            {   trigger: "div#page div#pageWrapper div#photo div#photoContainer div.nav a",
                name: "Galeria MediaRegionalne ",
                regressionUrls: ["http://www.wspolczesna.pl/apps/pbcs.dll/gallery?Site=GW&Date=20140209&Category=GALERIA01&ArtNo=209009997&Ref=PH&Params=Itemnr=1"],
                pageType: "9",
                articleBodySelector: "div#photo",
                sectionToBeEmptySelector: "script",
                sectionToBeRemovedSelector: "div#tngallery, p#photoNavigation, .imageContainerEliminatorSlajdow div#photoRelatedArticles, .imageContainerEliminatorSlajdow div#photo p.photoMeta",
                navigationNextULRSelector: "p#photoNavigation a#photoNavigationNext",
                navigationPageNumberSelector: "span#photoNavigationPages",
                sectionToBeAttached: "div#photo",
                headerSectionSelector: "",
                hasSlideNumbers: true
            },
            {   trigger: "div#page div#pageWrapper div#article.photostory p.photoNavigation a.photoNavigationNext",
                name: "Galeria MediaRegionalne - artykul",
                regressionUrls: [],
                pageType: "10",
                articleBodySelector: "div#article",
                sectionToBeEmptySelector: "script",
                sectionToBeRemovedSelector: "p.photoNavigation, div#photoContainer div.nav, div#photoElement div.nav, h2",
                navigationNextULRSelector: "p.photoNavigation a.photoNavigationNext",
                navigationPageNumberSelector: "span.photoNavigationPages:first",
                sectionToBeAttached: "div#article div.intextAd",
                headerSectionSelector: "",
                hasSlideNumbers: true
            },
            {   trigger: "div#main-column div#photo.common-box div.inner div.photo-item div.photoElem a.next",
                name: "Galeria MojeMiasto",
                regressionUrls: ["http://www.mmbydgoszcz.pl/photo/1886182/Photo+Walk+Koronowo+2013"],
                pageType: "11",
                articleBodySelector: "div#photo div.photo-item",
                sectionToBeEmptySelector: "script",
                sectionToBeRemovedSelector: "div.photoElem a, .top-slider",
                navigationNextULRSelector: "div#main-column div#photo.common-box div.inner div.photo-item div.photoElem a.next",
                navigationPageNumberSelector: "div#photo.common-box div.top-slider div.slider",
                sectionToBeAttached: "div.photo-item",
                headerSectionSelector: "",
                hasSlideNumbers: true

            },
            {   trigger: "body#pagetype_art #content_wrap .photostoryNextPage",
                name: "galeria #pagetype_art .photostoryNextPage NOWA GALERIA GAZETY (12)",
                regressionUrls: ["http://technologie.gazeta.pl/internet/56,104530,14940595,Panel_sterowania__gdzie_ja_do_diaska_jestem,,1.html"],
                sectionToBeAttached: "#content_wrap",
                articleBodySelector: "#columns_wrap",
                sectionToBeEmptySelector: "script:not([src])",
                sectionToBeRemovedSelector: "#gazeta_article_miniatures, #banP1, #banP2, #banP3, #banP4,#banP62,  .photostoryNextPage, .photostoryPrevPage, #gazeta_article_image div.overlayBright, #gazeta_article .nextSlideWrapper",
                sectionToBeRemovedFromAttachedSlidesSelector: "#photo_comments, #article_comments",
                navigationNextULRSelector: "div#content .nextSlideButton",
                navigationPageNumberSelector: "#gazeta_article_top .countPage",
                headerSectionSelector: "",
                hasSlideNumbers: true,
                pageType: "12",
                preIncludeCallback: function () {
                    this._updateGalleryLink();
                },
                beforeAllCallback: function () {
                    $("#columns_wrap").after($("#article_comments"));
                }
            },
            {   trigger: "div#page div#pageWrapper div#photo p#photoNavigation a#photoNavigationNext",
                name: "MediaRegionalne 1",
                regressionUrls: ["http://www.wspolczesna.pl/apps/pbcs.dll/gallery?Site=GW&Date=20140131&Category=GALERIA01&ArtNo=131009996&Ref=PH",
                    "http://www.gazetalubuska.pl/apps/pbcs.dll/gallery?Site=GL&Date=20140201&Category=galeria&ArtNo=201009994&Ref=PH&Params=Itemnr=1"],
                pageType: "13",
                articleBodySelector: "div#photo",
                sectionToBeEmptySelector: "script",
                sectionToBeRemovedSelector: "#tngallery, #photoRelatedArticles, #photoNavigation, #photoElement div.nav",
                navigationNextULRSelector: "p#photoNavigation a#photoNavigationNext",
                navigationPageNumberSelector: "span#photoNavigationPages",
                sectionToBeAttached: "div#photo img, div#photo p:nth-child(7)", // sekcja komentarza i obrazek
                headerSectionSelector: "",
                hasSlideNumbers: true

            },
            {   trigger: "div#wrapper > div > div#photo p#galleryNav a#galleryNavNext",
                name: "MediaRegionalne 2",
                regressionUrls: ["http://www.nowiny24.pl/apps/pbcs.dll/gallery?Site=NW&Date=20140126&Category=IMPREZY07&ArtNo=126009999&Ref=PH&Params=Itemnr=1"],
                pageType: "14",
                articleBodySelector: "div#photo",
                sectionToBeEmptySelector: "script",
                sectionToBeRemovedSelector: "#galleryNav, #tngalleryScroll",
                navigationNextULRSelector: "p#galleryNav a#galleryNavNext",
                navigationPageNumberSelector: "p#galleryNav",
                sectionToBeAttached: "div#photo img, #photo p:first", // sekcja komentarza i obrazek
                headerSectionSelector: "",
                hasSlideNumbers: true

            },
            {   trigger: "div#LeftContent div#MainGallery img#PhotoInMainGallery",
                name: "Autotrader Legacy",
                regressionUrls: [],
                articleBodySelector: "div#MainGallery",
                navigationNextULRSelector: "div:not(.ZjecieZaznaczone).ZdjecieGaleriaMini a",
                sectionToBeEmptySelector: "div.DetaleZdjeciaMiniOdstep, div.GaleriaPopupNastepne, div.FloatRight.PopupReklamaPoPrawej, div.TextAlignCenter.PopupReklamaNaDole",
                sectionToBeAttached: "div.ZdjecieGaleriaMaxWielkosc",
                navigationPageNumberSelector: "div.PasekZjecieOdstep",
                hasSlideNumbers: false,
                classesToBeRemoved: ["ZdjecieGaleriaMaxWielkosc"],
                pageType: "15"
            },
            {   trigger: "div#bxGaleria div.podpisDuzaFotka div.przewijakZdjec div.slider",
                name: "Wiadomosci Wp.pl",
                regressionUrls: ["http://wiadomosci.wp.pl/gid,16390562,gpage,4,img,16391154,kat,1356,title,Igrzyska-w-Soczi-i-nie-tylko,galeria.html"],
                articleBodySelector: "div#bxGaleria",
                navigationNextULRSelector: "div#bxGaleriaOpis a.stgGaleriaNext",
                sectionToBeEmptySelector: "div.podpisDuzaFotka",
                sectionToBeAttached: "div.bxGaleria div.kol2",
                sectionToBeRemovedSelector: "#bxGaleriaOpis .stro, .przewijakGalerii, div.duzaFotka > a",
                navigationPageNumberSelector: "div#bxGaleriaOpis span.status",
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                hasSlideNumbers: true,
                customStyle: {"*[id='bxGaleriaOpis']": "margin-top:0 !important"},
                pageType: "16"

            },
            {   trigger: "div#stgGaleria div.stgGaleriaCnt .stgGaleriaNext",
                name: "Facet wp.pl",
                articleBodySelector: "div.bxArt",
                navigationNextULRSelector: "div#stgGaleria a.stgGaleriaNext",
                sectionToBeEmptySelector: "",
                sectionToBeAttached: "#stgGaleria",
                sectionToBeRemovedSelector: ".stgGaleriaCnt > a",
                navigationPageNumberSelector: ".bxArt .strGallery.pageInfo > span",
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                hasSlideNumbers: true,
                regressionUrls: ["http://facet.wp.pl/gid,16327903,kat,1007873,page,7,galeriazdjecie.html"],
                pageType: "17"

            },
            {   trigger: "div#stgMain article.stampGaleria div.stampBxNaglowek div.stampStronicowanie div.pIndex a.pNext",
                name: "Finanse wp.pl",
                articleBodySelector: "#stgMain article.stampGaleria",
                navigationNextULRSelector: "div.stampStronicowanie div.pIndex a.pNext",
                sectionToBeEmptySelector: "",
                sectionToBeAttached: "article.stampGaleria div.articleRow",
                sectionToBeRemovedSelector: ".stampGlowneFoto .stampGlowneFotoMain > a, div.stampStronicowanie div.pIndex",
                navigationPageNumberSelector: ".stampStronicowanie:first .pIndex span",
                sectionToBeRemovedFromAttachedSlidesSelector: "script, .stampBxStopka",
                customStyle: {".stampGlowneFoto": "overflow: visible"},
                hasSlideNumbers: true,
                pageType: "18",
                regressionUrls: ["http://finanse.wp.pl/gid,16374104,title,Oto-najwieksze-stolice-hazardu,galeria.html",
                    "http://finanse.wp.pl/gid,16350579,kat,1033695,title,Polska-wsrod-najatrakcyjniejszych-rynkow-Europy,galeria.html",
                    "http://kobieta.wp.pl/gid,16425464,img,16425465,kat,26405,title,Obledna-kreacja-Jennifer-Lopez,galeriazdjecie.html?ticaid=1124c8"],
                preIncludeCallback: function () {
                }
            },
            {   trigger: "div#content div#largepic_wrapper div#largepic",
                name: "kwejk.pl",
                articleBodySelector: "div#content div.content",
                navigationNextULRSelector: "div#largepic_wrapper a.next_image",
                sectionToBeEmptySelector: "",
                sectionToBeAttached: "div#content div.content",
                sectionToBeRemovedSelector: ".image_carousel, div#largepic_wrapper > a, div.media",
                navigationPageNumberSelector: "",
                sectionToBeRemovedFromAttachedSlidesSelector: ".image_carousel, script, style, div.share",
                customStyle: {},
                hasSlideNumbers: false,
                pageType: "19",
                regressionUrls: ["http://kwejk.pl/article/2054448/20/caa",
                    "http://kwejk.pl/article/2054452/0/co-mozna-zmiescic-w-c-5-galaxy.html#gallerypic",
                    "http://kwejk.pl/article/2077996/0/najbardziej-denerwujace-teksty-rodzicow.html#gallerypic"],
                preIncludeCallback: function () {
                }
            },
            {   trigger: "body#strona-artykulu div#glowna-kolumna div#galeria-material-zdjecie",
                name: "gazetawroclawska.pl",
                articleBodySelector: "#galeria-material",
                navigationNextULRSelector: "#galeria-nastepne-2",
                sectionToBeEmptySelector: "#miniatury-kontener, #galeria-poprzednie-2, #galeria-nastepne-2, .iloscZdjec",
                sectionToBeAttached: "#galeria-material",
                sectionToBeRemovedSelector: "#miniatury-kontener",
                navigationPageNumberSelector: ".iloscZdjec",
                sectionToBeRemovedFromAttachedSlidesSelector: "script, #miniatury-kontener, #galeria-poprzednie-2, #galeria-nastepne-2, .iloscZdjec",
                customStyle: {},
                hasSlideNumbers: true,
                pageType: "20",
                regressionUrls: ["http://www.gazetawroclawska.pl/artykul/3424383,ruszyl-remont-minskiej-od-rana-utrudnienia-i-gigantyczne-korki-na-muchoborze-zdjecia,1,4,id,t,sm,sg.html#galeria-material",
                    "http://www.gloswielkopolski.pl/artykul/3431295,oceniamy-pilkarzy-po-meczu-lech-poznan-gornik-zabrze-sprawdz,id,t.html"],
                preIncludeCallback: function () {
                    $(".lazy.powiekszenie").attr("src", $(".lazy.powiekszenie").attr("data-original")).removeClass("lazy");
                }
            },
            {   trigger: "div#main_container div.demotivator.pic #royalSliderExtraNavigation a.navigate_right",
                name: "demotywatory.pl",
                articleBodySelector: "#main_container .demotivator .demot_pic",
                navigationNextULRSelector: "#royalSliderExtraNavigation a.navigate_right",
                sectionToBeEmptySelector: "",
                sectionToBeAttached: ".demotivator .demot_pic .rsSlideContent",
                sectionToBeRemovedSelector: "#pics_gallery_slider, #royalSliderExtraNavigation, .share-widgets, .demot_info_stats",
                navigationPageNumberSelector: "#royalSliderExtraNavigation .paginator_data",
                sectionToBeRemovedFromAttachedSlidesSelector: "script, .share-widgets, .rsTmb",
                headerSectionSelector: ".demotivator .demot_pic .rsSlideContent:first h3",
                customStyle: {'rsSlideContent h3': 'display:none', '#main_container article, #main_container .demotivator': 'float:left',
                    '.rsSlideContent .relative': 'text-align: center'},
                hasSlideNumbers: false,
                pageType: "21",
                regressionUrls: ["http://demotywatory.pl/4339879/Najciekawsze-fakty-o-ktorych-prawdopodobnie-nie-miales-pojecia#obrazek-1",
                    "http://demotywatory.pl/4344639/14-najglupszych-sposobow-na-zerwanie-z-kims"],
                preIncludeCallback: function () {
                    this.nextPageURL = document.location.protocol + "//" + document.location.host + document.location.pathname;
                    $(".imageContainerEliminatorSlajdow .rsSlideContent").appendTo($(".imageContainerEliminatorSlajdow"));
                    $(".imageContainerEliminatorSlajdow .el_slide, .imageContainerEliminatorSlajdow .slideHeader").remove();
                    var self = this;
                    $(".imageContainerEliminatorSlajdow .rsSlideContent:first").remove();
                    $(".imageContainerEliminatorSlajdow .rsSlideContent").each(function (index) {
                        $(this).wrap("<div class='slide_" + index + " es_slide'></div>").parent().before(self._buildHeader('Slajd ' + (index + 2) + ' z ' + $(".imageContainerEliminatorSlajdow .rsSlideContent").length, index + 2, document.location.href));
                    });
                }
            },
            {   trigger: "body#Fakt .pageContent .leftColumn .paginaHolder .paginator.panigaGalery",
                name: "fakt.pl",
                articleBodySelector: "body#Fakt .pageContent .leftColumn .Scroll-View-Gallery",
                navigationNextULRSelector: ".pageContent .leftColumn .paginaHolder .paginator.panigaGalery a.next",
                sectionToBeEmptySelector: "",
                sectionToBeAttached: "#bigPicture",
                sectionToBeRemovedSelector: ".pageBigGallery .zoomer, .paginaHolder",
                navigationPageNumberSelector: ".pageBigGallery .zoomer, .paginaHolder:first span",
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                customStyle: {},
                hasSlideNumbers: true,
                pageType: "22",
                regressionUrls: ["http://www.fakt.pl/aktorki-usmiercone-przez-scenarzystow,galeria,464577,1.html"],
                preIncludeCallback: function () {

                }
            },
            {   trigger: "body#loneGallery #bigPicture",
                name: "fakt.pl nowa",
                articleBodySelector: "#bigPicture",
                navigationNextULRSelector: "#imgHolder .paginator .next",
                sectionToBeEmptySelector: "",
                sectionToBeAttached: "#bigPicture, .rightColumn",
                sectionToBeRemovedSelector: "#galleryslider, .paginator, .zoomer",
                navigationPageNumberSelector: ".rightColumn .nrFoto",
                sectionToBeRemovedFromAttachedSlidesSelector: "script, .nrFoto, .socialButtons, .Region",
                customStyle: {'.imageContainerEliminatorSlajdow .rightColumn': 'float:left;width:100%'},
                hasSlideNumbers: true,
                pageType: "23",
                regressionUrls: ["http://www.fakt.pl/dlaczego-maz-zostawil-glinke-,artykuly,464472,1,1,1.html"],
                preIncludeCallback: function () {

                }
            },
            {   trigger: ".glownyKontener #material-artykul .galeriaArtykulowa #material-galeria-nastepne",
                name: "naszemiasto.pl",
                articleBodySelector: ".galeriaArtykulowa",
                navigationNextULRSelector: "#material-galeria-nastepne",
                sectionToBeEmptySelector: "",
                sectionToBeAttached: ".galeriaArtykul",
                sectionToBeRemovedSelector: "#galeria, .paginacja, .lupa, .strzalka, #powrot-miniaturki",
                navigationPageNumberSelector: ".iloscZdjec",
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                customStyle: {'*[id="galeria-z-opisem"]': 'float:left'},
                hasSlideNumbers: true,
                pageType: "24",
                regressionUrls: [""],
                preIncludeCallback: function () {

                }
            },
            {   trigger: ".glownyKontener .trescOpisu .paginacja #material-galeria-nastepne",
                name: "naszemiasto.pl szeroka",
                articleBodySelector: "#galeria-z-opisem",
                navigationNextULRSelector: "#material-galeria-nastepne",
                sectionToBeEmptySelector: "",
                sectionToBeAttached: "#galeria-z-opisem",
                sectionToBeRemovedSelector: "#galeria, .paginacja, .lupa, .strzalka, #powrot-miniaturki, #material-galeria-nastepne-czytaj",
                navigationPageNumberSelector: ".iloscZdjec",
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                customStyle: {},
                hasSlideNumbers: true,
                pageType: "25",
                regressionUrls: [""],
                preIncludeCallback: function () {

                }
            },
            {   trigger: "div#page article.single-article .gallery .paging .next",
                name: "wawalove.pl",
                articleBodySelector: ".see-big",
                navigationNextULRSelector: "article.single-article .gallery .paging .next",
                sectionToBeEmptySelector: "",
                sectionToBeAttached: ".see-big",
                sectionToBeRemovedSelector: ".paging, .thumbs",
                navigationPageNumberSelector: ".paging-info:first",
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                customStyle: {},
                hasSlideNumbers: true,
                pageType: "26",
                regressionUrls: ["http://wawalove.pl/Ogolnopolskie-Zawody-Jezdzieckie-w-skokach-przez-przeszkody-g14407/foto_70848#foto",
                    "http://wawalove.pl/Policja-rozbila-tzw-Grupe-Mokotowska-MOCNE-WIDEO-g14398/foto_70824"],
                preIncludeCallback: function () {

                }
            },
            {   trigger: "section.article_site div.gallery_art div.new_article_gallery .next",
                name: "se.pl",
                articleBodySelector: ".new_article_gallery",
                navigationNextULRSelector: "div.new_article_gallery .next:first",
                sectionToBeEmptySelector: "",
                sectionToBeAttached: ".new_article_gallery",
                sectionToBeRemovedSelector: ".new_article_pager, .prev, .next",
                navigationPageNumberSelector: "",
                sectionToBeRemovedFromAttachedSlidesSelector: "script, .howmany",
                customStyle: {'.imageContainerEliminatorSlajdow': 'margin-top:20px'},
                hasSlideNumbers: false,
                pageType: "27",
                regressionUrls: ["http://www.se.pl/intymnie/super-eros/dzisiaj-dzien-bez-stanika_404053.html"],
                preIncludeCallback: function () {

                }
            },
            {   trigger: "div#page div#main div.article-slideshow .article-matter .slideshow-wrapper",
                name: "sfora.pl",
                articleBodySelector: ".slideshow-wrapper",
                navigationNextULRSelector: ".article-matter .slideshow-next:first",
                sectionToBeEmptySelector: "",
                sectionToBeAttached: ".slideshow-wrapper",
                sectionToBeRemovedSelector: ".slideshow-paging",
                navigationPageNumberSelector: ".slideshow-current:first",
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                customStyle: {'.imageContainerEliminatorSlajdow': 'margin-top:20px'},
                hasSlideNumbers: true,
                pageType: "28",
                regressionUrls: ["http://www.sfora.pl/swiat/Zamordowal-rodzicow-lomem-Bo-zabrali-mu-iPoda-s68307"],
                preIncludeCallback: function () {

                }
            },
            {   trigger: "div#page div#main div.article-gallery .article-matter .gallery-content .gallery-img-big",
                name: "sfora.pl nowa",
                articleBodySelector: ".article-matter",
                navigationNextULRSelector: ".gallery-img-big .next:first",
                sectionToBeEmptySelector: "",
                sectionToBeAttached: ".article-matter",
                sectionToBeRemovedSelector: ".prev, .next, .gallery-top",
                navigationPageNumberSelector: "",
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                customStyle: {'.imageContainerEliminatorSlajdow': 'margin-top:20px'},
                hasSlideNumbers: false,
                pageType: "29",
                regressionUrls: ["http://www.sfora.pl/polska/KorwinMikke-triumfuje-internet-oszalal-Wysyp-memow-g68152-185752",
                    "http://www.sfora.pl/swiat/Historia-bomby-atomowej-Wyciekly-tajne-fotografie-g67943"],
                preIncludeCallback: function () {

                }
            },
            {   trigger: ".page .main-content .article--gallery .gallery .gallery__content .gallery__image-wrapper .next-btn",
                name: "biztok.pl",
                articleBodySelector: ".gallery__content",
                navigationNextULRSelector: ".gallery__image-wrapper .next-btn",
                sectionToBeEmptySelector: "",
                sectionToBeAttached: ".gallery__content",
                sectionToBeRemovedSelector: ".next-btn, .prev-btn, .gallery__header",
                navigationPageNumberSelector: ".gallery__header .gallery-nr",
                sectionToBeRemovedFromAttachedSlidesSelector: "script, .social-box",
                customStyle: {'.imageContainerEliminatorSlajdow': 'margin-top:20px'},
                hasSlideNumbers: true,
                pageType: "30",
                regressionUrls: ["http://www.biztok.pl/tech/cocacola-zainwestowala-pod-warszawa-zobacz_g16382"],
                preIncludeCallback: function () {

                }
            },
            {   trigger: "#ks_doc #ks_bd_left_col #ks_simple_pagging",
                name: "komputerswiat.pl",
                articleBodySelector: "#ks_bd_cols",
                navigationNextULRSelector: "#gallery_image a.next",
                sectionToBeAttached: "#ks_bd_cols",
                sectionToBeRemovedSelector: "#ks_simple_pagging, #ks_bd_right_col div.next, #gallery_image .next",
                navigationPageNumberSelector: "#ks_simple_pagging .numbers",
                sectionToBeRemovedFromAttachedSlidesSelector: "#comments, script, .Nextclick_Widget_Container, #comment_form, #ks_bd_right_col div.next, #gallery_image .next, #gallery_image .prev",
                customStyle: {'#gallery #ks_bd': 'float:left', '.imageContainerEliminatorSlajdow': 'margin-top:20px', ".comments": "width:720px"},
                hasSlideNumbers: true,
                pageType: "31",
                regressionUrls: ["http://www.komputerswiat.pl/artykuly/redakcyjne/2014/05/komputery-apple-jakich-nie-widzieliscie-niezwykle-prototypy-z-lat-80.aspx"],
                preIncludeCallback: function () {
                    $("#ks_bd_left_col .Nextclick_Widget_Container, #ks_bd_left_col #comment_form, #ks_bd_left_col #comments").insertAfter(".imageContainerEliminatorSlajdow");
                }
            },
            {   trigger: "body#screening #mainContainer #gallery .gallery_body .gallery_photo_desc_right",
                name: "dziennik.pl",
                articleBodySelector: ".gallery_body",
                navigationNextULRSelector: ".gallery_photo_desc_right .nastepne:first",
                sectionToBeEmptySelector: "",
                sectionToBeAttached: ".gallery_body",
                sectionToBeRemovedSelector: ".belka-spol, .cl_right, .gallery_list_photos_header, .gallery_photo_desc_right, .gallery_list_photos, .art_data_tags, .belka-spol-bottom",
                navigationPageNumberSelector: ".gallery_photo_desc_right p:first",
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                customStyle: {},
                hasSlideNumbers: true,
                pageType: "32",
                regressionUrls: ["http://auto.dziennik.pl/aktualnosci/galeria/460807,1,samochod-obamy-limuzyna-prezydenta-usa-zdjecia-galeria-zdjec.html"],
                preIncludeCallback: function () {

                }
            },
            {   trigger: "#miejsce2 .galeriaBig.forsalOnly .photoBg .next",
                name: "forsal.pl",
                articleBodySelector: ".tpl_sgp_galeria_artykulowa",
                navigationNextULRSelector: ".galeriaBig.forsalOnly .photoBg .next",
                sectionToBeAttached: ".tpl_sgp_galeria_artykulowa",
                sectionToBeRemovedSelector: ".photoBg .hoverPhoto, .photoBg .next, .photoBg .prev, .nextPrev ul",
                navigationPageNumberSelector: ".nextPrev",
                sectionToBeRemovedFromAttachedSlidesSelector: "script, .dateArt, .leadArt, .lead, .galeriaBig.forsalOnly > h2",
                customStyle: {'.imageContainerEliminatorSlajdow': 'margin-top:20px'},
                hasSlideNumbers: true,
                pageType: "33",
                regressionUrls: [],
                preIncludeCallback: function () {

                }
            },
            {   /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#pagewrap #ARTICLE_GALLERY_TOP_1",
                /* index */
                pageType: "34",
                /* nazwa galerii */
                name: "przegladsportowy.pl",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#pagewrap .rightColumn",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: ".leftColumn, .rightColumn",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: ".paginator a.next:first",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: false,
                navigationPageNumberSelector: "",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".paginator",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script, #ARTICLE_GALLERY_RIGHT_COLUMN_1, #ARTICLE_GALLERY_BOTTOM_1, .socialButtons",
                /* dowolne style css w postaci mapy */
                customStyle: {".sharebx, .Comments": "float:left"},
                /* naglowek slajdu */
                headerSectionSelector: "",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* callback uruchamiany przed dolaczeniem kazdgo slajdu do strony */
                preIncludeCallback: function () {
                    $(".leftColumn #ARTICLE_GALLERY_BOTTOM_1").insertAfter(".imageContainerEliminatorSlajdow");
                },
                classesToBeRemoved: [],
                regressionUrls: ["http://junior.przegladsportowy.pl/akademia-pilkarska-zaglebia-lubin-tak-trenuja-mlode-talenty,galeria,1,472568,12565.html"]
            },
            {   /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: ".site .columns.columns-outer-double .box-gallery .gallery-image .gallery-controlls .gallery-image-zoom",
                /* index */
                pageType: "35",
                /* nazwa galerii */
                name: "sportowefakty.pl",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#photo-start",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "#photo-start",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: ".gallery-image-next:first",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".gallery-navigation:first",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".gallery-navigation, .gallery-controlls",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                /* naglowek slajdu */
                headerSectionSelector: "",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* callback uruchamiany przed dolaczeniem kazdgo slajdu do strony */
                preIncludeCallback: function () {
                },
                classesToBeRemoved: [],
                regressionUrls: ["http://www.sportowefakty.pl/pilka-reczna/zdjecia/galeria/5411/polska-niemcy-2524/3-232928#photo-start"]
            },
            {   /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#page_wrap #page #content #content-inner .box-inner .img-cnt-wrap .news-content",
                /* index */
                pageType: "36",
                /* nazwa galerii */
                name: "bebzol.com",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: ".img-cnt-wrap",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: ".img-cnt-wrap",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "#handle-next:not(.next-gal):first",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: false,
                navigationPageNumberSelector: "",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".handle:not(.next-gal), .categ-list-cnt, .img-cnt div:first, .pluginConnectButton",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script, .like-bar, .bbz-cm-box",
                /* dowolne style css w postaci mapy */
                customStyle: {'.imageContainerEliminatorSlajdow': 'margin-top:20px', '.like-bar': 'float:left;width:100%'},
                /* naglowek slajdu */
                headerSectionSelector: "",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* callback uruchamiany przed dolaczeniem kazdgo slajdu do strony */
                preIncludeCallback: function () {
                    $("html").addClass("eliminatorSlajdow");
                },
                classesToBeRemoved: [],
                regressionUrls: ["http://bebzol.com/pl/koty-szykuja-sie-na-wojne.150870.html" ,
                    "http://bebzol.com/pl/20-trudnosci-z-ktorymi-musza-zmagac-sie-wlasciciele-kotow.151053.html"]
            },
            {   /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#left_column.gallery .comments h2.section-title ",
                /* index */
                pageType: "37",
                /* nazwa galerii */
                name: "lovekrakow.pl",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#content .container .clear:last",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "#left_column, #right_column",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: ".photo-pagination a.next:first",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".photo-pagination:first",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".thumbnails, .photo-pagination",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script, .comments, h1.title",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                /* naglowek slajdu */
                headerSectionSelector: "",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* callback uruchamiany przed dolaczeniem kazdgo slajdu do strony */
                preIncludeCallback: function () {
                    $("#left_column .comments").insertAfter(".imageContainerEliminatorSlajdow");
                },
                classesToBeRemoved: [],
                regressionUrls: ["http://lovekrakow.pl/galerie/zdjecie/id/27808"]
            },
            {   /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "div#doc #body #trunk #main .k_galleryLarge .k_pagination",
                /* index */
                pageType: "38",
                /* nazwa galerii */
                name: "biznes.pl",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#main .k_gallery",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: ".k_gallery",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: ".k_pagination .k_next a:first",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".k_pagination .thisFoto:first",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".k_pagination",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                /* naglowek slajdu */
                headerSectionSelector: "",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* callback uruchamiany przed dolaczeniem kazdgo slajdu do strony */
                preIncludeCallback: function () {
                },
                classesToBeRemoved: [],
                regressionUrls: ["http://biznes.pl/wiadomosci/raporty/wzrost-pkb-w-latach-2008-2013,5610529,1,5610147,535,foto-detal.html",
                    "http://biznes.pl/wiadomosci/kraj/jan-vincent-rostowski-gosciem-specjalnym-biznespl,5610578,0,foto-detal.html#photo16264113"]
            },
            {   /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "div.wrapper div.site div.left_column div.article div.gallery_buttons div.next_btt a.next",
                /* index */
                pageType: "39",
                /* nazwa galerii */
                name: "urzadzamy.pl",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: ".article .image_file",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: ".article .image_file",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "div.gallery_buttons div.next_btt a.next",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: false,
                navigationPageNumberSelector: "",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".gallery_buttons, .box.gallery_img, .article .content",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://www.urzadzamy.pl/galeria/uzytkownik/2560/komiksowy-pokoj/",
                    "http://www.urzadzamy.pl/galeria/uzytkownik/3328/podswietlane-panele-crystal-led-w-azience/",
                    "http://www.urzadzamy.pl/galeria/uzytkownik/2378/azienka-modern/"]
            },
            {   /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "div.all div#page #item > div.item-content > a.arrow-next-big",
                /* index */
                pageType: "40",
                /* nazwa galerii */
                name: "pudelekx.pl",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#item .item-content",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "#item",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "div.item-content > a.arrow-next-big",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: false,
                navigationPageNumberSelector: "",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".thumbs, .item-header .btn2, .arrow-next-big, .arrow-prev-big, .item-header, div.sidebar",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script, .tags, .item-options, .left",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://pudelekx.pl/ten-pies-wygladal-jak-wor-na-smieci-27389-g2"]
            },
            {   /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#wrap #article article.single-entry #photo-gallery .inner a.next",
                /* index */
                pageType: "41",
                /* nazwa galerii */
                name: "snobka.pl",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#photo-gallery",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "#photo-gallery",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: ".inner a:first.next",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: false,
                navigationPageNumberSelector: "",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: "div.thumbs, .inner .next, .inner .prev",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* dowolne style css w postaci mapy */
                customStyle: {"section.comments": "float:left"},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://www.snobka.pl/artykul/krok-po-kroku-polyskujacy-makijaz-w-stylu-magdaleny-mielcarz-19554",
                    "http://www.snobka.pl/artykul/emily-ratajkowski-znowu-sie-rozbiera-19646/1/4#photo-gallery"]
            },
            {   /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "body#pagetype_photo.simpleGallery #gazeta_gallery_popup .gs_navigation .gs_next",
                /* index */
                pageType: "42",
                /* nazwa galerii */
                name: "gazeta pl nowa galeria czarna",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#gazeta_gallery_popup .gs_image_cointainer",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: ".gs_image_cointainer",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: ".gs_navigation .gs_next:first",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".gs_stats .gs_count",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".gs_navigation",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* dowolne style css w postaci mapy */
                customStyle: {"body": "overflow: auto", ".gs_image_cointainer img": "position:relative;max-height:inherit;min-height:inherit",
                    "#gazeta_gallery_popup": "position:absolute", "#page22": "height:0",
                    ".headerLogo, .icon-facebook-squared": "color:white",
                    "#gazeta_gallery_popup .gs_image_cointainer": "height:auto"},
                preIncludeCallback: function () {
                },
                beforeAllCallback: function () {
                    $('<style type="text/css">.simpleGallery #gazeta_gallery_popup.first_slide {display: none;} \n' +
                        '.simpleGallery #gazeta_gallery_popup.show_slider_image {display: block;}\n' +
                        'body {overflow: visible !important}</style>').appendTo($('head'));
                },
                regressionUrls: ["http://wiadomosci.gazeta.pl/wiadomosci/5,139575,16388712.html?i=0"]
            },
            {   /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "div.wrap div.main div.article__content div.gallery div.gallery__image-big a.next",
                /* index */
                pageType: "43",
                /* nazwa galerii */
                name: "http://www.fly4free.pl/",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "div.gallery",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "div.gallery",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "div.gallery__image-big a.next",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".gallery__nav:first",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".gallery__nav, .gallery__image-big .next, .gallery__image-big .prev",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://www.fly4free.pl/top10-co-warto-zobaczyc-w-chinach/?pid=3404#galeria",
                    "http://www.fly4free.pl/w-kraju-inkow-czyli-co-warto-zobaczyc-w-peru/"]
            },
            {   /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#stgMain .stampFototematRow .stampStronicowanieFototematu .stampStronicowanieFototematuContent .stampStronicowanieFototematuIndex",
                /* index */
                pageType: "44",
                /* nazwa galerii */
                name: "wp.pl galeria pozioma 1",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#stgMain .stampFototemat",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: ".stampFototemat",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: ".stampStronicowanieFototematuContent a.stampStronicowanieFototematuNxt:first",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".stampStronicowanieFototematuIndex:first",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".pPaginSmall, .stampStronicowanieFototematu, .stampFototematBigFotoNxt, .stampFototematBigFotoPrv",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://pogoda.wp.pl/gid,16782131,kat,1035571,title,Prognoza-dlugoterminowa-kulminacja-upalnego-lata,galeria.html"]
            },
            {   /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#page_wrapper #container #main .article-wraper .article-body .post-pages a.next-page.button",
                /* index */
                pageType: "45",
                /* nazwa galerii */
                name: "gadzetomania",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: ".article-body",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: ".article-body",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: ".article-body .post-pages a.next-page.button:first",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".pages-text:first",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".post-pages",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://gadzetomania.pl/1547,tragedie-w-przestworzach-ataki-na-samoloty-cywilne-znacznie-wiecej-wiecej-niz-podaja-media"]
            },
            {   /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#main-wrap div#body .section-subcontent .photo-wrap a#next_link",
                /* index */
                pageType: "46",
                /* nazwa galerii */
                name: "trojmiasto.pl",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#foto",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "#foto",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: ".photo-wrap a#next_link",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".page_count:first",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: "#fotoshift, .simple-nav, #hover_nav",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://galeria.trojmiasto.pl/-452980.html?id_container=82203&pozycja=4#foto"]
            },
            {   /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "body ul.k_controls .k_next, #photoZoom #imgNav",
                /* index */
                pageType: "47",
                /* nazwa galerii */
                name: "onet pozioma galeria",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#main .kopyto:first, #sTop .kopyto:first, #cLeft .kopyto:first",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "#main .kopyto:first, #sTop .kopyto:first, #cLeft .kopyto:first",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "li.k_next a:first",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".k_index:first",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".k_preview, .k_index, .k_controls, .k_insets",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://ciekawe.onet.pl/fototematy/venus-kot-dwie-twarze,5649860,17024821,galeria-duzy.html"]
            },
            {   /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "div#page div#main-content #content-region .node-article-image .navigation-links a.next",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "48",
                /* nazwa galerii */
                name: "regiomoto",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#content-region .node-article-image",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "#content-region .node-article-image",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: ".navigation-links a.next",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".image-counter",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: "",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* dowolne style css w postaci mapy */
                customStyle: {"#comments": "float:left"},
                preIncludeCallback: function () {
                    $("img.imagecache").each(function () {
                        $(this).attr("src", $(this).attr("data-original"));
                    });

                    if ($(this.articleSection).find(".navigation-links a.next").length === 0 && $(this.articleSection).find(".navigation-links a.last").length === 1) {
                        this.nextPageURL = $(this.articleSection).find(".navigation-links a.last").attr("href");
                    }

                    $("div.images, .navigation-links").remove();
                },
                regressionUrls: ["http://regiomoto.pl/portal/porady/tuning/zdjecie-dopieszczone-wartburgi-chlopakow-z-wartburgradikalzcom"]
            },
            {   trigger: "div#page div#main div.slideshow-header .slideshow-paging .slideshow-next",
                name: "sportfan.pl",
                articleBodySelector: ".slideshow",
                navigationNextULRSelector: ".slideshow-paging .slideshow-next:first",
                sectionToBeEmptySelector: "",
                sectionToBeAttached: ".slideshow:first",
                sectionToBeRemovedSelector: ".slideshow-paging",
                navigationPageNumberSelector: ".slideshow-current:first",
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                customStyle: {'.imageContainerEliminatorSlajdow': 'margin-top:20px'},
                hasSlideNumbers: true,
                pageType: "49",
                regressionUrls: ["http://www.sportfan.pl/galeria/neymar-juz-nie-pamieta-o-bolu-zajela-sie-nim-sexy-kobieta-53539"],
                preIncludeCallback: function () {

                }
            },
            {   /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#main > div.article > div.gallery-booth > div.gallery-big > a.gallery-next",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "50",
                /* nazwa galerii */
                name: "sportfan plaska",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#main > div.article > div.gallery-booth",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "div.gallery-booth",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "div.gallery-big > a.ir.gallery-next",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: false,
                navigationPageNumberSelector: "",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: "div.gallery-preview, .gallery-big .ir",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* dowolne style css w postaci mapy */
                customStyle: {".article .gallery-big": "width:auto"},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://www.sportfan.pl/artykul/erotyczne-euro-nagie-pilkarki-na-boisku-zdjecia-43386"]
            },
            {   /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "body#Forbes #Page-Wrap .Block-Node a.Next",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "51",
                /* nazwa galerii */
                name: "forbes.pl",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#Column-Wrap",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "#Column-Wrap",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "#Page-Wrap .Block-Node a.Next",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: false,
                navigationPageNumberSelector: "",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".navigation, .Next, .Previous, .showMini",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script, .backlink, #ARTICLE_RELATED_GALLERY_BOTTOM, .socialLine",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* dowolne style css w postaci mapy */
                customStyle: {".headerLogo, .icon-facebook-squared": "color:white",
                    ".imageContainerEliminatorSlajdow": "margin-top:15px"},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://kariera.forbes.pl/8-prostych-sposobow-na-poprawe-jakosci-pracy,artykuly,179168,1,1,4.html",
                    "http://kariera.forbes.pl/najbardziej-absurdalne-pytania-na-rozmowie-o-prace,artykuly,174074,1,1,2.html"]
            },
            {   /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "div#root div#content section#articles #zdjecie.right .navigation a.next",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "52",
                /* nazwa galerii */
                name: "geekweek.pl",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#zdjecie div:last",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "figure.image, #ads-incontext-content",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: ".navigation a.next:first",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".navigation .num",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".navigation",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://www.geekweek.pl/galerie/4031/zwierzeta-w-promieniach-zachodzacego-slonca?zdjecie=1#zdjecie",
                    "http://www.geekweek.pl/galerie/4082/jak-sobie-radzic-w-upaly",
                    "http://www.geekweek.pl/galerie/4080/tego-nie-wiedzieliscie-o-mcdonalds"]
            },
            {   /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#galeria-warstwa > div.boxPozycja.galeriaNaw > div #material-galeria-nastepne.btnNastepny",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "53",
                /* nazwa galerii */
                name: "naszemiasto.pl w overlay",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#galeria-warstwa",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "#galeria-warstwa",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "#material-galeria-nastepne",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".galPrawaKol .tytulMaly span:first",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".galeriaNaw",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* Theme */
                esTheme: "white",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://warszawa.naszemiasto.pl/artykul/zdjecia/muzeum-techniki-warszawa-wystawa-zabytkowych-kamer-i,2380679,artgal,10156975,t,id,tm,zid.html",
                    "http://warszawa.naszemiasto.pl/artykul/zdjecia/pogrzeb-jaruzelskiego-na-powazkach-wideo-zdjecia,2290964,artgal,9379796,t,id,tm,zid.html"]
            },
            {   /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "body > section#content article .inner-article #next_gallery_resource",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "54",
                /* nazwa galerii */
                name: "nowy kwejk sierpien 2014",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: ".inner-article-img > :last",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: ".inner-article-img",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "#next_gallery_resource",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: false,
                navigationPageNumberSelector: "",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: "#gallery_thumbs, #next_gallery_resource, #under_gallery_thumbs, #prev_gallery_resource, .share-options.clearfix, #gallery_controls",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {"#go_back_to_main_page": "float:left; width:100%",
                    ".imageContainerEliminatorSlajdow": "margin-top: 15px;"},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://kwejk.pl/obrazek/2106118/0/9-typow-inteligencji-wedlug-howarda-gardnera.html",
                    "http://kwejk.pl/obrazek/2106116/0/inne-zastosowania-przedmiotow-gospodarstwa-domowego.html"]
            },
            {   /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#stgMain #bxGaleria > div.content > div.picCol > div.bigPic > a",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "55",
                /* nazwa galerii */
                name: "WP tech sierpien 2014",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#bxGaleria .content",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "#bxGaleria .content",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: ".navPic .stgGaleriaNext:first",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".navPic span",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".navPic, .bigPic a",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://tech.wp.pl/gid,16799172,title,Czy-to-jeszcze-ludzie-Tak-czlowiek-zmienia-sie-w-cyborga,galeria.html?ticaid=113454&_ticrsn=3"]
            },
            {   /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#wpMain div.bxCenterMain div.bxCont div.fotkaBx h1.galeria",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "56",
                /* nazwa galerii */
                name: "nocoty.pl",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: ".bxCenterMain .bxCont",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: ".bxCenterMain",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "a.stgGaleriaNext:first",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".galeriaPrawyBx .body strong",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".fotoPrev_v2, .fotoNext_v2, .body .rt",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script, #stgOpinie, div.bxCenterMain div.galeriaZdjecieBx:eq(1)",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                    var body = $(this.articleSection).find(".galeriaZdjecieBx");
                    if (body.length == 2) {
                        body[1].remove();
                    }
                },
                regressionUrls: ["http://nocoty.pl/gid,16823077,kat,1013703,title,Maria-Elena-Boschi-na-plazy-Seksowna-pani-minister,galeria.html?ticaid=6134e6"]
            },
            {   /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "body.galleryblack #galleryImg > div.paginfixed > div > span.nextbox > a",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "57",
                /* nazwa galerii */
                name: "newsweek.pl",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: ".imgGalleryArt #galleryImg",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: ".imgGalleryArt",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "div.paginfixed > div > span.nextbox > a:first",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: false,
                navigationPageNumberSelector: "",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".paginfixed, .stripeList",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script, .moregallery",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* Theme */
                esTheme: "white",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://www.newsweek.pl/22-lipca-w-czasach-polski-ludowej-na-fotografiach-na-newsweek-p,galeria,106661,1,1,1.html"]
            },
            {   /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#wpMain  #wpCenter #galleryB div.pages span a",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "58",
                /* nazwa galerii */
                name: "film.wp.pl",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#galleryB",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "#galleryB",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "#galleryB div.pages span:last a",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: false,
                navigationPageNumberSelector: ".stro .pages",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".ST-BX-Zobacz-takze-gal, .pages",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                    $(".galPN").parent().remove();
                },
                regressionUrls: ["http://film.wp.pl/idGallery,14811,idPhoto,398806,galeria.html?ticaid=113528&_ticrsn=3"]
            },
            {   /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "body div.columns.columns-outer-double article.paggedArticle figure.article-image div.gallery-controlls a.gallery-image-next",
                /* index */
                pageType: "59",
                /* nazwa galerii */
                name: "sportowefakty.pl artykul",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "article.paggedArticle",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "article.paggedArticle",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "article > figure > div > a.gallery-image-next",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".fullsizedPaggedNavigation:first span",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".fullsizedPaggedNavigation, .gallery-image-previous, .gallery-image-next",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script, .article-header, .article-footer, .contentpoll",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                /* naglowek slajdu */
                headerSectionSelector: "",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* callback uruchamiany przed dolaczeniem kazdgo slajdu do strony */
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://www.sportowefakty.pl/pilka-nozna/462036/az-dwunastu-polakow-na-starcie-bundesligi-kto-bedzie-gral-a-kto-siedzial-na-lawc/3"]
            },
            {   /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#wrapper #article.photostory a.photoNavigationNext, #photoContainer div.nav a.next",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "60",
                /* nazwa galerii */
                name: "nowiny24 nowa galeria",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#article.photostory",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "#article.photostory",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: ".photoNavigation a.photoNavigationNext:first",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".photoNavigationPages:first",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: "#photoContainer div.nav, #photostoryConnections, .photoNavigation",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://www.nowiny24.pl/apps/pbcs.dll/article?AID=/20140611/BIESZCZADY00/140619917&sectioncat=photostory2",
                    "http://www.nowiny24.pl/apps/pbcs.dll/article?AID=/20140611/BIESZCZADY00/140619917"]
            },
            {   /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "div.main-content div.article--slideshow div.slideshow div.slideshow__header div.slidshow__nav a.button-next",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "61",
                /* nazwa galerii */
                name: "biztok",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "div.slideshow",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "div.slideshow",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "div.slideshow__header div.slidshow__nav a.button-next:first",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".slide-nr:first",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".slidshow__nav",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://www.biztok.pl/biznes/reklamy-ktore-zmienily-swiat_s17408/slide_3",
                    "http://www.biztok.pl/biznes/reklamy-ktore-zmienily-swiat_s17408/slide_3"]
            },
            {   /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#stgMain .bxGaleriaPoj .stronicowanie .stgGaleriaNext img.fr",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "62",
                /* nazwa galerii */
                name: "sport wp pl galeria pozioma 2",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: ".bxGaleriaPoj",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: ".bxGaleriaPoj",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: ".stronicowanie .stgGaleriaNext:first",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".stronicowanie:first",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".stronicowanie",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://sport.wp.pl/gid,16900393,kat,39,title,Polacy-odebrali-zlote-medale-MS,galeria.html",
                    "http://sport.wp.pl/gid,16900642,kat,1912,page,2,title,Polscy-siatkarze-mistrzami-swiata,galeria.html?ticaid=113800&_ticrsn=3"]
            },
            {   /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "48",
                /* nazwa galerii */
                name: "",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: "",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: "",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: [""]
            }
        ],
        spinner: $("<div>", {"class": "eliminatorSlajdowSpinner"}).append($("<i>", {class: 'icon-spin3 animate-spin'})),
        imageContainer: null,
        _theme: function (theme) {
            var style = "";
            if (theme === "white") {
                style = '.headerLogo, .eliminatorSlajdow div.imageContainerEliminatorSlajdow div.slideHeader p.headerLogo i {color:white}';
            }
            $('<style>', {"type": "text/css", "text": style}).appendTo($('head'));
        },
        _start: function () {
            if (this.options.debug) {
                this._debug();
            }
            this.pageOptions.beforeAllCallback.call(this);
            $("head").append($("<link>", {href: this.options.cssPath, type: "text/css", rel: "stylesheet"}));
            $("body").addClass("eliminatorSlajdow");
            this._theme(this.pageOptions.esTheme);
            this.nextPageURL = $(this.pageOptions.navigationNextULRSelector).attr("href");
            this._logger("link do nastepnej storny", this.nextPageURL, this.pageOptions.navigationNextULRSelector);
            this.pageOptions.preIncludeCallback.call(this);
            if (this.nextPageURL) {
                this._tracking("ES_start", this.pageOptions.pageType);
                $(this.pageOptions.sectionToBeEmptySelector).empty();
                $(this.pageOptions.sectionToBeRemovedSelector).remove();
                this._createImageContainer();
                this._bind();
                this._showSpinnier();
                this.pageOptions.visitedSlideURLs.push(document.location.pathname + document.location.search);
                this._requestNextSlide(this.nextPageURL);
            } else {
                this._logger("Brak slajdow. Galeria typu " + this.pageOptions.pageType);
            }
        },
        _buildHeader: function (pageNumberLabel, pageNumber, url) {
            return $("<div>", {
                "class": "slideHeader slideHeader_" + pageNumber
            }).append($("<p>", {
                "class": "headerBar shadow_es"
            }).append($("<span>", {
                "class": "pageNumber",
                text: pageNumberLabel
            })).append($("<span>", {
                "class": "esLogo",
                style: "background:url('" + this.options.imageBaseUrl + this.options.esLogoUrl + "') no-repeat 0 0 /16px"
            })).append($("<i>", {
                "class": "scrollSwitch icon-resize-vertical " + (this.options.scrollableImageContainer ? "esIconEnabled" : "esIconDisabled"),
                title: "Pasek przewijania"
            })).append(
                $("<i>", {
                    "class": "icon-bug",
                    title: "Zgłoś problem"
                })).append(
                $("<span>", {
                    "class": "directLink"
                }).append($("<a>", {
                        target: "_blank",
                        href: this._appendDisableEsFlag(url),
                        title: "Bezpośredni link"
                    }).append($("<i>", {"class": 'icon-link-ext'}))
                )).append(
                $("<i>", {
                    "class": "icon-right-circle",
                    title: "Następny Slajd"
                })).append(
                $("<i>", {
                    "class": "icon-left-circle",
                    title: "Poprzedni Slajd"
                })).append(
                $("<i>", {
                    "class": "icon-up-circle",
                    title: "Pierwszy Slajd"
                })).append(
                $("<i>", {
                    "class": "icon-down-circle",
                    title: "Ostatni Slajd"
                }))).append($("<p>", {
                "class": "headerLogo",
                text: 'Eliminator Slajdów'
            }).append($("<i>", {"class": 'icon-facebook-squared'})));
        },
        _appendNextSlide: function (galleryPage, url) {
            var that = this;
            this._hideSpinner();
            this.articleSection = $(galleryPage).find(this.pageOptions.sectionToBeAttached);
            if ($(this.articleSection).length > 0) {

                this.nextPageURL = $(galleryPage).find(this.pageOptions.navigationNextULRSelector).attr("href");
                if (typeof url === "undefined" || url === this.nextPageURL || $.inArray(url, this.pageOptions.visitedSlideURLs) > -1) {
                    this._logger("Chyba cos jest zle. URL do nastepnego slajdu zostal juz dodany do listy lub jest UNDEFINED:/", url, this.nextPageURL);
                    return;
                }
                var pageNumber = $(galleryPage).find(this.pageOptions.navigationPageNumberSelector).text().match(/(\d+)/g);
                if (this.pageOptions.hasSlideNumbers) {
                    this._logger("numer strony", pageNumber);
                }
                var pageNumberLabel = "Ostatni slajd";
                if (pageNumber && pageNumber.length === 2) {
                    pageNumberLabel = "Slajd " + pageNumber[0] + " z " + pageNumber[1];
                } else if (!this.pageOptions.hasSlideNumbers) {
                    pageNumberLabel = "Slajd";
                }

                var slideHeader = this._buildHeader(pageNumberLabel, pageNumber, url);

                $(this.imageContainer).append(slideHeader);

                $(this.articleSection).find(this.pageOptions.sectionToBeEmptySelector).empty();
                $(this.articleSection).find(this.pageOptions.sectionToBeRemovedSelector).remove();
                $(this.articleSection).find(this.pageOptions.sectionToBeRemovedFromAttachedSlidesSelector).remove();

                var slideWrapper = $(this.imageContainer).append($("<div>", {
                    "class": "slide_" + pageNumber + " es_slide"
                })).children().last();

                if ($(galleryPage).find(this.pageOptions.headerSectionSelector).length === 1) {
                    var desc = $(galleryPage).find(this.pageOptions.headerSectionSelector).html();
                    $(slideWrapper).append($("<p>", {
                        "class": "slideTitle",
                        text: desc
                    }));
                }

                $(slideWrapper).append(this.articleSection);

                var appendNewStyle = function (elements, newStyle) {
                    elements.each(function () {
                        var current = $(this).attr("style") ? $(this).attr("style") + ";" : "";
                        if (current.indexOf(newStyle) === -1) {
                            $(this).attr("style", current + newStyle);
                        }
                    });
                };

                for (var selector in this.pageOptions.customStyle) {
                    var elements = $(that.articleSection).find(selector);
                    if (elements.length === 0) { // try to find the elements in the whole page
                        elements = $(selector);
                    }
                    appendNewStyle(elements, this.pageOptions.customStyle[selector]);
                }

                for (var i in this.pageOptions.classesToBeRemoved) {
                    $("." + this.pageOptions.classesToBeRemoved[i]).removeClass(this.pageOptions.classesToBeRemoved[i]);
                }

                this.pageOptions.visitedSlideURLs.push(url);

                this.pageOptions.preIncludeCallback.call(this);

                if (typeof this.nextPageURL !== 'undefined' && (
                    (pageNumber && pageNumber.length === 2 && pageNumber[0] !== pageNumber[1]) ||
                    (!this.pageOptions.hasSlideNumbers && document.location.href.indexOf(this.nextPageURL) === -1))) {
                    this._logger("link do nastepnej storny", this.nextPageURL);
                    this._showSpinnier();
                    this._requestNextSlide(this.nextPageURL);
                } else {
                    this._logger("Ostatni Slajd");
                    this._hideSpinner();
                    this.pageOptions.afterAllCallback.call(this);
                }

            } else {
                this._logger("Article section not found");
            }
        },
        _getPaywallRedirectUrl: function (nextPage) {
            if (nextPage.length > 1000 && nextPage.length < 1500 && $(nextPage).length == 11 &&
                $($(nextPage)[3]).is("meta") && $($(nextPage)[3]).attr("http-equiv") == "refresh" &&
                $($(nextPage)[3]).attr("content") &&
                $($(nextPage)[3]).attr("content").indexOf("5;URL=") === 0) {
                var c = $($(nextPage)[3]).attr("content");
                return c.substring(7, c.length - 1);
            }
            return "";
        },
        _requestNextSlide: function (nextPageURL) {
            var that = this;
            if (typeof nextPageURL === 'undefined') {
                that._hideSpinner();
                return;
            }
            $.get(nextPageURL, function (nextPage) {
                var redirectUrl = that._getPaywallRedirectUrl(nextPage);
                if (redirectUrl) {
                    that._requestNextSlide(redirectUrl);
                    that._tracking("paywall_redirect", redirectUrl);
                } else {
                    that._appendNextSlide(nextPage, nextPageURL);
                }
            }, "html").fail(function () {
                that._tracking("ES_error", that.pageOptions.pageType, nextPageURL);
                console.log("ES - Blad pobierania nastepnego slajdu: " + nextPageURL);
                that._hideSpinner();
            });
        },
        _bind: function () {
            var that = this;
            var imageContainer = $("div.imageContainerEliminatorSlajdow");
            imageContainer.on("click", "i.icon-resize-vertical", function () {
                var currentOffset = $(this)[0].getBoundingClientRect().bottom - $(this)[0].getBoundingClientRect().height;
                imageContainer.toggleClass("noScroll").toggleClass("scroll");
                if (that.options.scrollableImageContainer) {
                    that._logger("scroll switch OFF");
                    $('html, body').animate({
                        scrollTop: $(this).offset().top - currentOffset
                    }, 500);
                    that.options.scrollableImageContainer = false;
                } else {
                    that._logger("scroll switch ON");
                    $('html, body').animate({
                        scrollTop: $(".imageContainerEliminatorSlajdow").offset().top - 25
                    }, 500);
                    imageContainer.animate({
                        scrollTop: 0
                    }, 0);
                    imageContainer.animate({
                        scrollTop: $(this).offset().top - imageContainer.offset().top - currentOffset + 25
                    }, 500);
                    that.options.scrollableImageContainer = true;
                }
                imageContainer.find("i.icon-resize-vertical").toggleClass("esIconEnabled").toggleClass("esIconDisabled");
                that._tracking("scroll_ui", that.options.scrollableImageContainer ? "ON" : "OFF");
            });

            imageContainer.on("click", "i.icon-bug", function () {
                window.open(that.options.bugReportUrl);
                that._tracking("bug_report_ui", "click");
            });

            imageContainer.on("click", "p.headerLogo", function () {
                window.open(that.options.facebookUrl);
                that._tracking("facebook_ui", "click");
            });

            imageContainer.on("click", "span.directLink a", function () {
                that._tracking("direct_link_ui", "click");
            });

            imageContainer.on("click", "i.icon-up-circle", function () {
                $("body,html").animate({
                    scrollTop: 0
                }, 500);
                that._tracking("go_top_link", "click");
            });

            imageContainer.on("click", "i.icon-down-circle", function () {
                $("body,html").animate({
                    scrollTop: imageContainer.offset().top + imageContainer.height() - 50
                }, 500);
                that._tracking("go_end_link", "click");
            });

            imageContainer.on("click", "i.icon-right-circle", function () {
                if (that.options.scrollableImageContainer) {
                    // maybe will implement it one day
                } else {
                    var offset = imageContainer.offset().top + imageContainer.height() - 50;
                    var thisSlide = $(this).parent().parent();
                    if (thisSlide.next().length > 0 && thisSlide.next().next().length > 0) {
                        offset = thisSlide.next().next().offset().top - thisSlide[0].getBoundingClientRect().bottom - thisSlide[0].getBoundingClientRect().height + 62;
                    }
                    $("body,html").animate({
                        scrollTop: offset
                    }, 0);
                }
                that._tracking("go_next_link", "click");
            });

            imageContainer.on("click", "i.icon-left-circle", function () {
                if (that.options.scrollableImageContainer) {
                    // maybe will implement it one day
                } else {
                    var offset = 0;
                    var thisSlide = $(this).parent().parent();
                    if (thisSlide.prev().length > 0) {
                        offset = thisSlide.prev().prev().offset().top - thisSlide[0].getBoundingClientRect().bottom - thisSlide[0].getBoundingClientRect().height + 62;
                    }
                    $("body,html").animate({
                        scrollTop: offset
                    }, 0);

                }
                that._tracking("go_prev_link", "click");
            });
            // TODO: dodac obsluge spacji
        },
        _create: function (customOptions) {
            var self = this;
            window.onerror = function (err) {
                self._tracking("ES_JS_ERROR", err, window.location.href);
            };
            $.extend(true, this, this, customOptions);
            this.pages.push(this.options.customPages);
            for (var i in this.pages) {
                var trigger = this.pages[i].trigger;
                var noOfSelectors = trigger && trigger.match(/,/g) ? trigger.match(/,/g).length : 1;
                if ($(trigger).length >= noOfSelectors && $(this.pages[i].triggerStopper).length === 0) {
                    $.extend(true, this.pageOptions, this.pageOptions, this.pages[i]);
                    this._logger("ES START konfiguracja " + this.pageOptions.pageType + " dla " + this.pageOptions.name);
                    this._start();
                    break;
                }
            }
        },
        _createImageContainer: function () {
            var icClass = this.options.scrollableImageContainer ? 'scroll' : 'noScroll';
            this.imageContainer = $("<div>", {"class": icClass + ' imageContainerEliminatorSlajdow'});
            $(this.pageOptions.articleBodySelector).after(this.imageContainer);
        },
        _showSpinnier: function () {
            $("div.imageContainerEliminatorSlajdow").append(this.spinner);
        },
        _hideSpinner: function () {
            $("div.imageContainerEliminatorSlajdow div.eliminatorSlajdowSpinner").remove();
        },
        _appendDisableEsFlag: function (url) {
            if (url.indexOf("?") > -1) {
                return url.replace("?", "?es=off&");
            } else if (url.indexOf("#") > -1) {
                return url.replace("#", "?es=off#");
            } else {
                return url + "?es=off";
            }
        },
        _updateGalleryLink: function () {
            var galleryLink = $("#gazeta_article_miniatures .moreImg a, #gazeta_article_image a.next ");
            if (galleryLink.length > 0) {
                var href = galleryLink.attr("href");
                var suffix = "?i=1";
                if (href && (href.indexOf(suffix, href.length - suffix.length) !== -1)) {
                    galleryLink.attr("href", href.substring(0, href.length - suffix.length));
                }
            }
        },
        regression: function () {
            this._debug();
            var setTimeoutFunction = function (urlToOpen, pi) {
                console.log("url", urlToOpen);
                var delay = 5 * 1000 * pi;
                console.log("delay", delay);
                setTimeout(function () {
                    window.open(urlToOpen, '_blank');
                }, delay);
            };

            var self = this;
            var allRegressionUrls = [];
            for (var pi in  self.pages) {
                var pageConfig = this.pages[self.pages.length - pi - 1];
                for (var i in pageConfig.regressionUrls) {
                    var regressionUrl = pageConfig.regressionUrls[i];
                    if (regressionUrl.length > 0)
                        allRegressionUrls.push(regressionUrl + "###es_debug=1###-PAGETYPE=" + pageConfig.pageType);
                }
            }

            var step = 5;
            var lowerBound = 0;
            var topBound = lowerBound + step;

            $("#start").click(function () {
                console.log("Start button");
                do {
                    $("body").append($("<a>", { "href": allRegressionUrls[lowerBound], "text": allRegressionUrls[lowerBound]})).append($("<br>"));
                    var urlToOpen = allRegressionUrls[lowerBound];
                    setTimeoutFunction(urlToOpen, 0);
                    lowerBound++;
                } while (lowerBound < topBound && lowerBound < allRegressionUrls.length);
                topBound = topBound + step;
            });

            this.pageOptions.sectionToBeAttached = "#toBeAttached";
            this.pageOptions.articleBodySelector = "#articleBodySelector";
            this._createImageContainer();
            this._appendNextSlide("body", "regression");
            this._create();
            this._showSpinnier();
        },
        _debug: function () {
            var content = "Eliminator Slajdów - Debug Console v" + this.options.version + "\n\n";
            for (var property in this.pageOptions) {
                content += property + "=" + JSON.stringify(this.pageOptions[property]) + "\n";
            }
            $("<textarea>", {id: "es_debug", val: content}).appendTo($("body"));
        },
        _tracking: function (category, action, comment) {
            if ($.isFunction(this.options.trackingCallback)) {
                comment = comment || window.location.host;
                this.options.trackingCallback.call(this, category, action, comment);
            }
        },
        _logger: function () {
            console.log.apply(console, arguments);
            if (this.options.debug) {
                $("#es_debug").val($("#es_debug").val() + "\n" + JSON.stringify(arguments)).animate({
                    scrollTop: 10000000
                });
            }
        }
    });
})(jQuery);

/* TODO:
 http://www.urzadzamy.pl/galeria/uzytkownik/2560/komiksowy-pokoj/###es_debug=1###-PAGETYPE=39
 http://www.urzadzamy.pl/galeria/uzytkownik/3328/podswietlane-panele-crystal-led-w-azience/###es_debug=1###-PAGETYPE=39
 http://www.se.pl/multimedia/galeria/138752/307631/dzien-bez-stanika/
 http://www.urzadzamy.pl/galeria/uzytkownik/2378/azienka-modern/###es_debug=1###-PAGETYPE=39
 http://demotywatory.pl/4339879/Najciekawsze-fakty-o-ktorych-prawdopodobnie-nie-miales-pojecia#obrazek-1
 http://wiadomosci.onet.pl/swiat/berlin-podzielony-murem-tak-wygladal-w-okresie-zimnej-wojny/8wrdl

  */