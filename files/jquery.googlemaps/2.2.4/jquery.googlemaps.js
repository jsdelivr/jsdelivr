/*
 * jQuery Plugin: jQuery GoogleMaps
 * https://github.com/dejanstojanovic/JQuery-GoogleMaps
 * Version 2.2.4
 *
 * Copyright (c) 2014 Dejan Stojanovic (http://dejanstojanovic.net)
 *
 * Released under the MIT license
 */

$.fn.GoogleMapEditor = function (options) {
    var defaults = {
        editMode: true,                     /* Allow editiong on the map */
        editTemplatesPath: "../html/",      /* Editor layouts html files location */
        markerPinsPath: "../img/pin/",      /* Custom marker icons path */
        markerPinFiles: ["flag-azure.png",  /* List of files to be available from custom marker icons path */
                        "flag-green.png",
                        "needle-pink.png",
                        "niddle-green.png",
                        "pin-azure.png",
                        "pin-green.png",
                        "pin-pink.png"],
        drawingBorderColor: "#ff0000",      /* Default border drawing color when drawing is initiated */
        drawingBorderWidth: 2,              /* Default border drawing width when drawing is initiated */
        drawingFillColor: "#ffff00",        /* Default fill drawing color when drawing is initiated */
        zoom: 13,                           /* Default map zoom if not defined when initiating */
        center: {                           /* Default map center */
            latitude: 25.0417,
            longitude: 55.2194
        },
        width: 800,                         /* Map width. If not set then container width will be used*/
        height: 400,                        /* Map height. If not set then container height will be used*/
        language: "en",                     /* List of supported languages https://spreadsheets.google.com/spreadsheet/pub?key=0Ah0xU81penP1cDlwZHdzYWkyaERNc0xrWHNvTTA1S1E&gid=1 */
        singleLocation: false,              /* Allow only one location present on the map */
        searchBox: true,                    /* Add search box to the map */
        richtextEditor: true,               /* Use TinyMce editor for location messages */
        drawingTools: ["marker",            /* Tools to be availale for editing */
                    "polyline",
                    "polygon",
                    "circle",
                    "rectangle"],
        zoomControl: true,                  /* Show zoom control */
        panControl: true,                   /* Show pan control */
        scaleControl: true,                 /* Show scale on the map */
        streetViewControl: true,            /* Show street view control */
        scrollWheel: false,                 /* Use mouse wheel to zoom in and zoom out*/
        style: null,                        /* Build custom syles at http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html */
        stylesPath: "../styles.json",       /* Url of JSON file with map styles definitions. Enpowered by snazzymaps.com */
        locations: [],                      /* Locations to be loaded with the map */
        dataChange: null,                   /* Event raised when anything on the map changed */
        locationClick: null,                /* Event raised when a location on the map is clicked */
        locationNew: null,                  /* Event raised when new location is added on the map */
        locationDelete: null,               /* Event raised when location is deleted from the map */
        locationMove: null                  /* Event reaised when location is moved on the map to a different position */
    }
    var settings = $.extend({}, defaults, options);
    var tinyMceUrl = "//tinymce.cachefly.net/4.0/tinymce.min.js";
    var mapApiUrl = "//maps.googleapis.com/maps/api/js?sensor=false&callback=mapApiLoaded&libraries=drawing,places";

    if (settings.language != "") {
        mapApiUrl += "&language=" + settings.language;
    }

    var popupTemplateCircle = null;
    var popupTemplateRectangle = null;
    var popupTemplateMarker = null;
    var popupTemplatePolyline = null;
    var popupTemplatePolygon = null;
    var selector = $(this);

    if ((typeof google !== "undefined" && google !== null ? google.maps : void 0) == null) {
        $.getScript(mapApiUrl);
        window.mapApiLoaded = function () {
            selector.each(function (index) {
                var container = selector.get(index);

                if (settings.width == defaults.width) {
                    if ($(container).width() <= 0) {
                        $(container).width(defaults.width);
                    }
                }
                else {
                    $(container).width(settings.width);
                }

                if (settings.height == defaults.height) {
                    if ($(container).height() <= 0) {
                        $(container).height(defaults.height);
                    }
                }
                else {
                    $(container).height(settings.height);
                }

                initializeGoogleMapEditor(container);
            });
        };
    }
    else {
        selector.each(function (index) {
            var container = selector.get(index);
            initializeGoogleMapEditor(container);
        });
    }

    function addSearchBox(map) {
        var inputId = "q" + map.id;
        $(map.container).parent().prepend("<input id=\"" + inputId + "\" style=\"margin-top:4px\" type=\"text\" placeholder=\"Search Box\" />");
        var input = document.getElementById(inputId);
        if (input != null) {
            map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);
            var searchBox = new google.maps.places.SearchBox(input);
            google.maps.event.addListener(searchBox, 'places_changed', function () {
                var places = searchBox.getPlaces();
                var bounds = new google.maps.LatLngBounds();
                for (var i = 0, place; place = places[i]; i++) {
                    bounds.extend(place.geometry.location);
                }
                map.fitBounds(bounds);
                map.setZoom(15);
            });
            google.maps.event.addListener(map, 'bounds_changed', function () {
                var bounds = map.getBounds();
                searchBox.setBounds(bounds);
            });
        }
    }

    function addStylesList(map) {
        if (settings.editMode) {
            var selectId = "s" + map.id;
            $(map.container).parent().prepend("<select id=\"" + selectId + "\" class=\"map-style\" />");
            var select = document.getElementById(selectId);
            $(select).append($('<option>', {
                value: JSON.stringify([]),
                text: "GoogleMaps Default"
            }));
            $.getJSON(settings.stylesPath, function (data) {
                $(data).each(function (index, item) {
                    $(select).append($('<option>', {
                        value: item.json,
                        text: item.name
                    }));
                });
            });
            if (select != null) {
                map.controls[google.maps.ControlPosition.TOP_LEFT].push(select);
                $(select).change(function () {
                    map.setOptions({ mapTypeId: "Styled" });
                    var styledMapType = new google.maps.StyledMapType(
                        eval($(this).val())
                        , { name: 'Styled' });
                    map.mapTypes.set('Styled', styledMapType);
                    settings.style = eval($(this).val());
                    saveToJson(map);
                });
            }
        }
    }


    function addFitBoundsButton(map) {
        var inputId = "c" + map.id;
        $(map.container).parent().prepend("<input id=\"" + inputId + "\" class=\"fit-bound\" type=\"button\" title=\"Fit bounds\" />");
        var input = document.getElementById(inputId);
        if (input != null) {
            map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
            $(input).click(function () {
                var bounds = getMapLocationsBounds(map);
                if (bounds != null) {
                    map.fitBounds(bounds);
                    saveToJson(map);
                }
            });
        }
    }

    function addCurrentLocationButton(map) {
        var inputId = "l" + map.id;
        $(map.container).parent().prepend("<input id=\"" + inputId + "\" class=\"current-location\" type=\"button\" title=\"My Location\" />");
        var input = document.getElementById(inputId);
        if (input != null) {
            map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
            $(input).click(function () {
                if (navigator.geolocation) {
                    var mapOverlay = $(map.container).next();
                    mapOverlay.width($(map.container).width());
                    mapOverlay.height($(map.container).height());
                    mapOverlay.offset({ top: $(map.container).offset().top, left: $(map.container).offset().left })
                    mapOverlay.fadeIn("slow");
                    navigator.geolocation.getCurrentPosition(function (position) {
                        mapOverlay.fadeOut("fast");

                        if (settings.editMode) {
                            var myLocation = new Location([new Coordinate(position.coords.latitude, position.coords.longitude)], google.maps.drawing.OverlayType.MARKER, "", "", "", "", "", "");
                            initMapObject(map, myLocation);
                            map.locations.push(myLocation);
                            var locationBounds = new google.maps.LatLngBounds(
                              new google.maps.LatLng(myLocation.Coordinates[0].Latitude, myLocation.Coordinates[0].Longitude));
                            map.fitBounds(locationBounds);
                            map.setZoom(15);
                            new google.maps.event.trigger(myLocation.Overlay, 'click');
                            saveToJson(map);
                        }
                        else {
                            var locationBounds = new google.maps.LatLngBounds(
                              new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
                            map.fitBounds(locationBounds);
                            map.setZoom(15);
                        }

                    }, function (errmsg) {
                        alert("Unable to fetch your current location!\n" + errmsg);
                        mapOverlay.fadeOut("fast");
                    });
                }
            });
        }
    }


    function arePopupTemplatesLoaded() {
        if (
        popupTemplateCircle != null &&
        popupTemplateRectangle != null &&
        popupTemplateMarker != null &&
        popupTemplatePolyline != null &&
        popupTemplatePolygon != null) {
            return true;
        }
        else {
            return false;
        }
    }

    function loadPopupTemplates() {

        $.ajax({
            url: settings.editTemplatesPath + "popup-template-circle.html",
            method: "GET",
            dataType: "text html",
            success: function (data) {
                popupTemplateCircle = data;
            }
        });


        $.ajax({
            url: settings.editTemplatesPath + "popup-template-rectangle.html",
            method: "GET",
            dataType: "text html",
            success: function (data) {
                popupTemplateRectangle = data;
            }
        });

        $.ajax({
            url: settings.editTemplatesPath + "popup-template-marker.html",
            method: "GET",
            dataType: "text html",
            success: function (data) {
                popupTemplateMarker = data;
            }
        });

        $.ajax({
            url: settings.editTemplatesPath + "popup-template-polyline.html",
            method: "GET",
            dataType: "text html",
            success: function (data) {
                popupTemplatePolyline = data;
            }
        });

        $.ajax({
            url: settings.editTemplatesPath + "popup-template-polygon.html",
            method: "GET",
            dataType: "text html",
            success: function (data) {
                popupTemplatePolygon = data;
            }
        });

    }

    function initializeGoogleMapEditor(container) {
        var map = null;
        if (settings.editMode) {
            loadPopupTemplates();
        }
        map = new google.maps.Map(container, {
            center: new google.maps.LatLng(settings.center.latitude, settings.center.longitude),
            zoom: settings.zoom,
            zoomControl: settings.zoomControl,
            panControl: settings.panControl,
            scaleControl: settings.scaleControl,
            streetViewControl: settings.streetViewControl,
            infoWindow: null,
            styles: settings.style
        });

        map.setOptions({ scrollwheel: settings.scrollWheel });
        map.container = container;
        map.locations = settings.locations.slice(0);
        map.id = createUUID();

        $("<div/>", { class: "map-overlay" }).append($("<input/>", { type: "button", value: "Close", class: "btn-close" })).insertAfter($(map.container));
        $(".map-overlay input.btn-close").click(function () {
            $(this).parent().fadeOut("slow");
        });

        google.maps.event.addListenerOnce(map, 'idle', function () {
            addStylesList(map);
            addFitBoundsButton(map);
            addCurrentLocationButton(map);
            if (settings.searchBox) {
                addSearchBox(map);
            }

            if (map.locations != null && map.locations.length > 0) {
                for (i = 0; i < map.locations.length; i++) {
                    initMapObject(map, map.locations[i]);
                }
            }

            saveToJson(map);
        });

        google.maps.event.addListenerOnce(map, 'center_changed', function () {
            saveToJson(map);
        });

        google.maps.event.addListenerOnce(map, 'zoom_changed', function () {
            saveToJson(map);
        });

        google.maps.event.addListenerOnce(map, 'maptypeid_changed', function () {
            saveToJson(map);
        });

        google.maps.event.addListenerOnce(map, 'dragend', function () {
            saveToJson(map);
        });

        google.maps.event.addListener(map, 'click', function () {
            if (map.infoWindow != null) {
                map.infoWindow.close();
                map.activeLocation = null;
            }
            for (i = 0; i < map.locations.length; i++) {
                map.locations[i].Overlay.set("editable", false);
            }
        });

        if (settings.editMode) {

            var drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.MARKER,
                drawingControl: true,
                polygonOptions: {
                    draggable: settings.editMode,
                    strokeWeight: settings.drawingBorderWidth,
                    strokeColor: settings.drawingBorderColor,
                    fillColor: settings.drawingFillColor
                },
                markerOptions: {
                    draggable: settings.editMode
                },
                polylineOptions: {
                    draggable: settings.editMode,
                    strokeWeight: settings.drawingBorderWidth,
                    strokeColor: settings.drawingBorderColor,
                    fillColor: settings.drawingFillColor
                },
                circleOptions: {
                    draggable: settings.editMode,
                    strokeWeight: settings.drawingBorderWidth,
                    strokeColor: settings.drawingBorderColor,
                    fillColor: settings.drawingFillColor
                },
                rectangleOptions: {
                    draggable: settings.editMode,
                    strokeWeight: settings.drawingBorderWidth,
                    strokeColor: settings.drawingBorderColor,
                    fillColor: settings.drawingFillColor
                },
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: settings.drawingTools
                }
            });

            google.maps.event.addListener(drawingManager, 'overlaycomplete', function (e) {
                var location = null;
                if (settings.singleLocation) {
                    clearLocations(map);
                }
                e.overlay.set("draggable", settings.editMode);
                location = initLocationObject(map, e.overlay, e.type);
                attachLocationHandlers(map, location, e.type);
                e.overlay.setOptions({ suppressUndo: true });
                attachTransformHandlers(map, e.overlay, e.type);

                if (settings.locationNew != null && typeof (settings.locationNew) == "function") {
                    settings.locationNew(map, location);
                }
            });
            drawingManager.setMap(map);
        }
    }

    function attachTransformHandlers(map, overlay, type) {

        switch (type) {
            case google.maps.drawing.OverlayType.POLYLINE:
            case google.maps.drawing.OverlayType.POLYGON:
                google.maps.event.addListener(overlay.getPath(), 'set_at', function (index, obj) {
                    updateLocationObject(map, overlay.Location, type, true);
                });
                google.maps.event.addListener(overlay.getPath(), 'insert_at', function (index, obj) {
                    updateLocationObject(map, overlay.Location, type, true);
                });
                google.maps.event.addListener(overlay.getPath(), 'remove_at', function (index, obj) {
                    updateLocationObject(map, overlay.Location, type, true);
                });
                break;
            case google.maps.drawing.OverlayType.CIRCLE:
                google.maps.event.addListener(overlay, 'radius_changed', function (index, obj) {
                    updateLocationObject(map, overlay.Location, type, true);
                });
                google.maps.event.addListener(overlay, 'center_changed', function (index, obj) {
                    updateLocationObject(map, overlay.Location, type, true);
                });
                break;
            case google.maps.drawing.OverlayType.RECTANGLE:
                google.maps.event.addListener(overlay, 'bounds_changed', function (index, obj) {
                    updateLocationObject(map, overlay.Location, type, true);
                });
                break;
        }
    }

    function clearLocations(map) {
        if (map.locations != null && map.locations.length > 0) {
            for (i = 0; i < map.locations.length; i++) {
                map.locations[i].Overlay.setMap(null);
            }
            map.locations.length = 0;
            map.locations = [];
        }
    }

    function initLocationObject(map, overlay, type) {
        var maplocation;
        var coordinates = [];

        switch (type) {
            case google.maps.drawing.OverlayType.MARKER:
                maplocation = new Location([new Coordinate(overlay.getPosition().lat(), overlay.getPosition().lng())], google.maps.drawing.OverlayType.MARKER, "", "", "", "", "", "");
                break;
            case google.maps.drawing.OverlayType.CIRCLE:
                maplocation = new Location([new Coordinate(overlay.getCenter().lat(), overlay.getCenter().lng())], google.maps.drawing.OverlayType.CIRCLE, "");
                maplocation.Radius = overlay.getRadius();
                break;
            case google.maps.drawing.OverlayType.POLYLINE:
                for (i = 0; i < overlay.getPath().length; i++) {
                    coordinates.push(new Coordinate(overlay.getPath().getAt(i).lat(), overlay.getPath().getAt(i).lng()))
                }
                maplocation = new Location(coordinates, google.maps.drawing.OverlayType.POLYLINE, "");
                break;
            case google.maps.drawing.OverlayType.POLYGON:
                for (i = 0; i < overlay.getPath().length; i++) {
                    coordinates.push(new Coordinate(overlay.getPath().getAt(i).lat(), overlay.getPath().getAt(i).lng()))
                }
                maplocation = new Location(coordinates, google.maps.drawing.OverlayType.POLYGON, "");
                break;
            case google.maps.drawing.OverlayType.RECTANGLE:
                coordinates.push(new Coordinate(overlay.getBounds().getNorthEast().lat(), overlay.getBounds().getNorthEast().lng()));
                coordinates.push(new Coordinate(overlay.getBounds().getSouthWest().lat(), overlay.getBounds().getSouthWest().lng()));
                maplocation = new Location(coordinates, google.maps.drawing.OverlayType.RECTANGLE, "");
                break;
        }

        maplocation.Overlay = overlay;
        overlay.Location = maplocation;
        if (map.locations == null) {
            map.locations = [];
        }
        map.locations.push(maplocation);
        saveToJson(map);
        return maplocation;
    }

    function initMapObject(map, location) {

        switch (location.LocationType) {
            case google.maps.drawing.OverlayType.MARKER:

                var marker = new google.maps.Marker({
                    draggable: settings.editMode,
                    map: map,
                    position: new google.maps.LatLng(location.Coordinates[0].Latitude, location.Coordinates[0].Longitude),
                    Location: location
                });
                if (location.Icon != null && location.Icon != "") {
                    marker.setIcon(new google.maps.MarkerImage(settings.markerPinsPath + location.Icon));
                }

                location.Overlay = marker;
                attachLocationHandlers(map, location, google.maps.drawing.OverlayType.MARKER);
                break;
            case google.maps.drawing.OverlayType.CIRCLE:
                var circle = new google.maps.Circle({
                    draggable: settings.editMode,
                    map: map,
                    strokeWeight: location.BorderWeight,
                    strokeColor: location.BorderColor,
                    fillColor: location.FillColor,
                    map: map,
                    radius: location.Radius,
                    center: new google.maps.LatLng(location.Coordinates[0].Latitude, location.Coordinates[0].Longitude),
                    Location: location
                });
                location.Overlay = circle;
                attachLocationHandlers(map, location, google.maps.drawing.OverlayType.CIRCLE);
                break;
            case google.maps.drawing.OverlayType.POLYLINE:
                var polylineCorners = [];
                for (c = 0; c < location.Coordinates.length; c++) {
                    var polylineCorner = new google.maps.LatLng(location.Coordinates[c].Latitude, location.Coordinates[c].Longitude)
                    polylineCorners.push(polylineCorner);
                }

                polyline = new google.maps.Polyline({
                    path: polylineCorners,
                    strokeWeight: location.BorderWeight,
                    strokeColor: location.BorderColor,
                    draggable: settings.editMode,
                    Location: location
                });
                polyline.setMap(map);
                location.Overlay = polyline;
                attachLocationHandlers(map, location, google.maps.drawing.OverlayType.POLYLINE);
                break;
            case google.maps.drawing.OverlayType.POLYGON:
                var poligonCorners = [];
                for (c = 0; c < location.Coordinates.length; c++) {
                    var polygonCorner = new google.maps.LatLng(location.Coordinates[c].Latitude, location.Coordinates[c].Longitude)
                    poligonCorners.push(polygonCorner);
                }
                polygon = new google.maps.Polygon({
                    path: poligonCorners,
                    strokeWeight: location.BorderWeight,
                    strokeColor: location.BorderColor,
                    fillColor: location.FillColor,
                    draggable: settings.editMode,
                    Location: location
                });
                polygon.setMap(map);
                location.Overlay = polygon;
                attachLocationHandlers(map, location, google.maps.drawing.OverlayType.POLYGON);
                break;
            case google.maps.drawing.OverlayType.RECTANGLE:
                var rectangle = new google.maps.Rectangle({
                    draggable: settings.editMode,
                    map: map,
                    strokeWeight: location.BorderWeight,
                    strokeColor: location.BorderColor,
                    fillColor: location.FillColor,
                    map: map,
                    bounds: new google.maps.LatLngBounds(
                          new google.maps.LatLng(location.Coordinates[1].Latitude, location.Coordinates[1].Longitude),
                          new google.maps.LatLng(location.Coordinates[0].Latitude, location.Coordinates[0].Longitude)),
                    Location: location
                });
                location.Overlay = rectangle;
                attachLocationHandlers(map, location, google.maps.drawing.OverlayType.RECTANGLE);
                break;
        }
        attachTransformHandlers(map, location.Overlay, location.LocationType);
    }

    function saveToJson(map) {
        var result = null;
        if (settings.editMode) {
            var mapBounds = getMapLocationsBounds(map);
            if (mapBounds != null) {
                var mapCenter = getMapLocationsBounds(map).getCenter();
                settings.center = new Coordinate(mapCenter.lat(), mapCenter.lng());
            }
            var properties = ["editMode", "editTemplatesPath", "markerPinsPath", "markerPinFiles", "drawingBorderColor", "drawingBorderWidth", "drawingFillColor", "zoom", "width", "height", "singleLocation", "center", "language", "searchBox", "richtextEditor", "drawingTools", "zoomControl", "panControl", "scaleControl", "streetViewControl", "scrollWheel", "stylesPath", "style", "locations"];
            properties = properties.concat(["latitude", "longitude", "Coordinates", "Latitude", "Longitude", "Radius", "LocationType", "Icon", "HoverIcon", "Message", "BorderColor", "BorderWeight", "FillColor", "Tag"]);
            properties = properties.concat(["featureType", "elementType", "stylers", "color", "hue", "weight", "visibility", "lightness", "saturation"]);

            result = JSON.stringify($.extend({}, settings, { locations: map.locations }), properties);
            if (settings.dataChange != null && typeof (settings.dataChange) == "function") {
                settings.dataChange(map, result);
            }
        }
        return result;
    }


    function handleMapCloseClick(map, type) {
        if (typeof map.activeLocation != 'undefined' && map.activeLocation != null) {
            $(".color-picker").remove();
        }
        updateLocationObject(map, map.activeLocation, type, false);
    }

    function attachLocationHandlers(map, location, type) {
        google.maps.event.addListener(location.Overlay, 'dragend', function (event) {
            updateLocationObject(map, this.Location, type, true);
            if (settings.locationMove != null && typeof (settings.locationMove) == "function") {
                settings.locationMove(map, location);
            }
        });

        google.maps.event.addListener(location.Overlay, 'mouseover', function () {
            if (type == google.maps.drawing.OverlayType.MARKER) {
                if (location.HoverIcon && location.HoverIcon != 'none' && location.HoverIcon != null && location.HoverIcon != "") {
                    location.Overlay.setIcon(settings.markerPinsPath + location.HoverIcon);
                }
            }
        });

        google.maps.event.addListener(location.Overlay, 'mouseout', function () {
            if (type == google.maps.drawing.OverlayType.MARKER) {
                if (location.Icon != "default" && location.Icon != null && location.Icon != "") {
                    location.Overlay.setIcon(settings.markerPinsPath + location.Icon);
                }
                else {
                    location.Overlay.setIcon(null);
                }
            }
        });

        google.maps.event.addListener(location.Overlay, 'click', function () {
            if (!arePopupTemplatesLoaded() && settings.editMode) {
                return;
            }
            if (map.infoWindow != null) {
                map.infoWindow.close();
                map.activeLocation = null;
            }
            for (i = 0; i < map.locations.length; i++) {
                map.locations[i].Overlay.set("editable", false);
            }
            location.Overlay.set("editable", settings.editMode);
            map.infoWindow = new google.maps.InfoWindow();
            map.activeLocation = location;
            google.maps.event.addListener(map.infoWindow, 'closeclick', function () {
                handleMapCloseClick(map, type);
            });

            var position = null;
            var contentObj = null;
            switch (type) {
                case google.maps.drawing.OverlayType.MARKER:
                    position = location.Overlay.position;
                    contentObj = $('<div>').append(popupTemplateMarker);
                    if (!settings.richtextEditor) {
                        contentObj.find("textarea").removeClass("richtext-fix");
                    }
                    break;
                case google.maps.drawing.OverlayType.CIRCLE:
                    position = location.Overlay.getCenter();
                    contentObj = $('<div>').append(popupTemplateCircle);
                    if (!settings.richtextEditor) {
                        contentObj.find("textarea").removeClass("richtext-fix");
                    }
                    break;
                case google.maps.drawing.OverlayType.POLYLINE:
                    position = getPolyLineCenter(location.Overlay);
                    contentObj = $('<div>').append(popupTemplatePolyline);
                    if (!settings.richtextEditor) {
                        contentObj.find("textarea").removeClass("richtext-fix");
                    }

                    break;
                case google.maps.drawing.OverlayType.POLYGON:
                    position = getPolygonCenter(location.Overlay);
                    contentObj = $('<div>').append(popupTemplatePolygon);
                    if (!settings.richtextEditor) {
                        contentObj.find("textarea").removeClass("richtext-fix");
                    }

                    break;
                case google.maps.drawing.OverlayType.RECTANGLE:
                    position = location.Overlay.getBounds().getCenter();
                    contentObj = $('<div>').append(popupTemplateRectangle);
                    if (!settings.richtextEditor) {
                        contentObj.find("textarea").removeClass("richtext-fix");
                    }
                    break;
            }
            if (contentObj != null && settings.editMode) {
                map.infoWindow.setContent(contentObj.html());
            }
            else {
                map.infoWindow.setContent($("<div/>").append($("<div/>", { class: "popup-message" }).html(location.Message)).html());
            }

            google.maps.event.addListener(map.infoWindow, 'domready', function () {
                $(map.container).find('.popup-content textarea').val(map.activeLocation.Message);
                $(map.container).find('.popup-content input[name="locationLat"]').val(position.lat());
                $(map.container).find('.popup-content input[name="locationLng"]').val(position.lng());
                $(map.container).find('.popup-content input[name="centerLat"]').val(position.lat());
                $(map.container).find('.popup-content input[name="centerLng"]').val(position.lng());
                $(map.container).find('.popup-content input[name="borderWidth"]').val(location.BorderWeight);
                $(map.container).find('.popup-content input[name="radius"]').val(location.Radius);
                var markerIconsList = $(map.container).find('.popup-content select[name="icon"]');
                if (markerIconsList.length > 0 && settings.markerPinFiles.length > 0) {
                    for (i = 0; i < settings.markerPinFiles.length; i++) {
                        markerIconsList.append($('<option>', {
                            value: settings.markerPinsPath + settings.markerPinFiles[i],
                            text: settings.markerPinFiles[i]
                        }));
                    }
                    markerIconsList.find('option').each(function () {
                        if ($(this).text() == location.Icon) {
                            $(this).prop('selected', true);
                        }
                    });
                }
                else {
                    markerIconsList.parent().parent().remove();
                }

                var markerHoverIconsList = $(map.container).find('.popup-content select[name="hover-icon"]');
                if (markerHoverIconsList.length > 0 && settings.markerPinFiles.length > 0) {
                    for (i = 0; i < settings.markerPinFiles.length; i++) {
                        markerHoverIconsList.append($('<option>', {
                            value: settings.markerPinsPath + settings.markerPinFiles[i],
                            text: settings.markerPinFiles[i]
                        }));
                    }
                    markerHoverIconsList.find('option').each(function () {
                        if ($(this).text() == location.HoverIcon) {
                            $(this).prop('selected', true);
                        }
                    });
                }
                else {
                    markerHoverIconsList.parent().parent().remove();
                }

                var borderColorInput = $(map.container).find('.popup-content input[name="strokeColor"]');
                var fillColorInput = $(map.container).find('.popup-content input[name="fillColor"]');
                var borderColorInputPicker = $(map.container).find('.popup-content input[name="strokeColorPicker"]');
                var fillColorInputPicker = $(map.container).find('.popup-content input[name="fillColorPicker"]');

                borderColorInput.val(map.activeLocation.BorderColor);
                borderColorInputPicker.val(map.activeLocation.BorderColor);
                borderColorInputPicker.height(borderColorInput.outerHeight());
                borderColorInputPicker.width(borderColorInput.outerHeight());

                fillColorInput.val(map.activeLocation.FillColor);
                fillColorInputPicker.val(map.activeLocation.FillColor);
                fillColorInputPicker.height(fillColorInput.outerHeight());
                fillColorInputPicker.width(fillColorInput.outerHeight());

                if (isIE()) {
                    borderColorInput.simpleColorPicker();
                    fillColorInput.simpleColorPicker();
                }
                else {
                    fillColorInputPicker.change(function () {
                        fillColorInput.val($(this).val());
                    });
                    fillColorInput.change(function () {
                        fillColorInputPicker.val($(this).val());
                    });

                    borderColorInputPicker.change(function () {
                        borderColorInput.val($(this).val());
                    });
                    borderColorInput.change(function () {
                        borderColorInputPicker.val($(this).val());
                    });
                }
                if (settings.richtextEditor) {
                    intTinyMce();
                }
                initPopupButtons(map);
            });
            if (position != null && type != google.maps.drawing.OverlayType.MARKER) {
                map.infoWindow.setPosition(position);
                map.infoWindow.open(map);
            }
            else {
                map.infoWindow.open(map, location.Overlay);
            }

            if (settings.locationClick != null && typeof (settings.locationClick) == "function") {
                settings.locationClick(map, location);
            }

        });
    }

    function updateLocationObject(map, location, type, showBallonInfo) {
        var coordinates = [];
        if ($('.popup-content').length > 0) {
            if (typeof tinymce != 'undefined') {
                tinyMCE.triggerSave();
            }
            location.Message = $(map.container).find('.popup-content textarea').val();
            location.BorderColor = $('.popup-content input[name="strokeColor"]').val();
            location.FillColor = $('.popup-content input[name="fillColor"]').val();
            location.BorderWeight = $('.popup-content input[name="borderWidth"]').val();
            if (type != google.maps.drawing.OverlayType.MARKER) {
                location.Overlay.setOptions({
                    strokeColor: location.BorderColor,
                    strokeWeight: location.BorderWeight
                });
                if (type != google.maps.drawing.OverlayType.POLYLINE) {
                    location.Overlay.setOptions({
                        fillColor: location.FillColor
                    });
                }
            }
        }
        switch (type) {
            case google.maps.drawing.OverlayType.MARKER:
                location.Coordinates.length = 0;
                location.Coordinates.push(new Coordinate(location.Overlay.getPosition().lat(), location.Overlay.getPosition().lng()));
                if ($('select[name="icon"]').length > 0) {
                    var iconFile = $('select[name="icon"] :selected').text();
                    if (iconFile == "default") {
                        location.Icon = null;
                        location.Overlay.setIcon(null);
                    }
                    else {
                        location.Icon = iconFile;
                        location.Overlay.setIcon(settings.markerPinsPath + location.Icon);
                    }

                    var hoverIconFile = $('select[name="hover-icon"] :selected').text();
                    if (iconFile == "none") {
                        location.HoverIcon = null;
                    }
                    else {
                        location.HoverIcon = hoverIconFile;
                    }

                    location.Coordinates[0].Latitude = parseFloat($('.popup-content input[name="locationLat"]').val());
                    location.Coordinates[0].Longitude = parseFloat($('.popup-content input[name="locationLng"]').val());

                    location.Overlay.setPosition(new google.maps.LatLng(location.Coordinates[0].Latitude, location.Coordinates[0].Longitude));

                }

                break;
            case google.maps.drawing.OverlayType.CIRCLE:

                if ($('.popup-content input[name="radius"]').length > 0) {


                    location.Radius = parseFloat($('.popup-content input[name="radius"]').val());

                    google.maps.event.clearListeners(location.Overlay, 'radius_changed');
                    location.Overlay.setRadius(location.Radius);

                    google.maps.event.addListener(location.Overlay, 'radius_changed', function (index, obj) {
                        updateLocationObject(map, location, type, true);
                    });

                }
                else {
                    location.Radius = location.Overlay.getRadius();
                }

                if ($('.popup-content input[name="centerLat"]').length > 0 && $('.popup-content input[name="centerLng"]').length > 0) {

                    google.maps.event.clearListeners(location.Overlay, 'center_changed');
                    location.Overlay.setCenter(new google.maps.LatLng(parseFloat($('.popup-content input[name="centerLat"]').val()), parseFloat($('.popup-content input[name="centerLng"]').val())));
                    google.maps.event.addListener(location.Overlay, 'center_changed', function (index, obj) {
                        updateLocationObject(map, location, type, true);
                    });
                    location.Coordinates.length = 0;
                    location.Coordinates.push(new Coordinate(location.Overlay.getCenter().lat(), location.Overlay.getCenter().lng()));

                }
                else {
                    location.Coordinates.length = 0;
                    location.Coordinates.push(new Coordinate(location.Overlay.getCenter().lat(), location.Overlay.getCenter().lng()));
                }
                break;
            case google.maps.drawing.OverlayType.POLYLINE:
                for (i = 0; i < location.Overlay.getPath().length; i++) {
                    coordinates.push(new Coordinate(location.Overlay.getPath().getAt(i).lat(), location.Overlay.getPath().getAt(i).lng()))
                }
                location.Coordinates = coordinates;
                break;
            case google.maps.drawing.OverlayType.POLYGON:
                for (i = 0; i < location.Overlay.getPath().length; i++) {
                    coordinates.push(new Coordinate(location.Overlay.getPath().getAt(i).lat(), location.Overlay.getPath().getAt(i).lng()))
                }
                location.Coordinates = coordinates;
                break;
            case google.maps.drawing.OverlayType.RECTANGLE:
                coordinates.push(new Coordinate(location.Overlay.getBounds().getNorthEast().lat(), location.Overlay.getBounds().getNorthEast().lng()));
                coordinates.push(new Coordinate(location.Overlay.getBounds().getSouthWest().lat(), location.Overlay.getBounds().getSouthWest().lng()));
                location.Coordinates = coordinates;
                break;
        }
        if (map.activeLocation != null && showBallonInfo) {

            if (map.infoWindow != null) {
                map.infoWindow.close();
            }
        }
        saveToJson(map);
    }

    function initPopupButtons(map) {
        var deleteButton = $(map.container).find(".btn-popup-delete");
        deleteButton.off("click");
        deleteButton.click(function () {
            if (confirm("Delete this location?")) {
                map.activeLocation.Overlay.setMap(null);
                map.locations.splice(map.locations.indexOf(map.activeLocation), 1);
                map.activeLocation = null;
                saveToJson(map);
                map.infoWindow.close();
                if (settings.locationDelete != null && typeof (settings.locationDelete) == "function") {
                    settings.locationDelete(map, location);
                }
            }
        });

        var cancelButton = $(map.container).find(".btn-popup-cancel");
        cancelButton.off("click");
        cancelButton.click(function () {
            if ($('.popup-content [name="changed"]').val() === 'true') {
                if (confirm("Cancel changes?")) {
                    map.infoWindow.close();
                }
            }
            else {
                map.infoWindow.close();
            }
        });

        var saveButton = $(map.container).find(".btn-popup-save");
        saveButton.off("click");
        saveButton.click(function () {
            handleMapCloseClick(map, map.activeLocation.LocationType);
            map.infoWindow.close();
        });

        $('.popup-content input[type="text"],.popup-content input[type="number"],.popup-content input[type="color"],.popup-content select,.popup-content textarea').change(function () {
            $('.popup-content input[name="changed"]').val(true);
        });

    }

    function isIE() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");

        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
            return true;
        }
        else {
            return false;
        }
    }

    function intTinyMce() {
        if (typeof tinymce == 'undefined') {
            $.getScript(tinyMceUrl, function () {
                tinymce.init({
                    selector: ".popup-content textarea",
                    plugins: ["code image link media table textcolor"],
                    resize: false,
                    toolbar: "bold italic | forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link | code",
                    menubar: false,
                    statusbar: false
                });
            });
        }
        else {
            tinymce.init({
                selector: ".popup-content textarea",
                plugins: ["code image link media table textcolor"],
                resize: false,
                toolbar: "bold italic | forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link | code",
                menubar: false,
                statusbar: false
            });
        }
    }


    function getMapLocationsBounds(map) {
        if (map.locations != null && map.locations.length > 0) {
            var mapLocationBounds = new google.maps.LatLngBounds();
            for (i = 0; i < map.locations.length; i++) {
                for (j = 0; j < map.locations[i].Coordinates.length; j++) {
                    mapLocationBounds.extend(new google.maps.LatLng(map.locations[i].Coordinates[j].Latitude, map.locations[i].Coordinates[j].Longitude));
                }
            }
            return mapLocationBounds;
        }
        return null;
    }

    function getPolyLineCenter(polyline) {
        var i = parseInt(polyline.getPath().getLength() / 2);
        return new google.maps.LatLng(polyline.getPath().getAt(i).lat(), polyline.getPath().getAt(i).lng());
    }

    function getPolygonCenter(polygon) {
        var bounds = new google.maps.LatLngBounds();

        for (i = 0; i < polygon.getPath().getLength() ; i++) {
            bounds.extend(new google.maps.LatLng(polygon.getPath().getAt(i).lat(),
                                                 polygon.getPath().getAt(i).lng()));
        }
        return bounds.getCenter();
    }

    function createUUID() {
        /* http://www.ietf.org/rfc/rfc4122.txt */
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  /* bits 12-15 of the time_hi_and_version field to 0010 */
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  /* bits 6-7 of the clock_seq_hi_and_reserved to 01 */
        s[8] = s[13] = s[18] = s[23] = "";

        var uuid = s.join("");
        return uuid;
    }

    function htmlEncode(value) {
        return $('<div/>').text(value).html();
    }

    function htmlDecode(value) {
        return $('<div/>').html(value).text();
    }

    /* OBJECT DEFINITIONS START*/

    function Location(coordinates, locationtype, message) {
        this.Coordinates = coordinates;
        this.LocationType = locationtype;
        this.Icon = null;
        this.Message = message;
        this.Overlay = null;
        this.Radius = 0;
        this.BorderColor = settings.drawingBorderColor;
        this.BorderWeight = settings.drawingBorderWidth;
        this.FillColor = settings.drawingFillColor;
        this.Tag = null;
    }

    function Coordinate(latitude, longitude) {
        this.Latitude = latitude;
        this.Longitude = longitude;
    }
}

/* Simple color picker https://github.com/rachel-carvalho/simple-color-picker */
$.fn.simpleColorPicker = function (options) {
    var defaults = {
        colorsPerLine: 8,
        colors: ['#000000', '#444444', '#666666', '#999999', '#cccccc', '#eeeeee', '#f3f3f3', '#ffffff'
        , '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#9900ff', '#ff00ff'
        , '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#cfe2f3', '#d9d2e9', '#ead1dc'
        , '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#9fc5e8', '#b4a7d6', '#d5a6bd'
        , '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6fa8dc', '#8e7cc3', '#c27ba0'
        , '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3d85c6', '#674ea7', '#a64d79'
        , '#990000', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#0b5394', '#351c75', '#741b47'
        , '#660000', '#783f04', '#7f6000', '#274e13', '#0c343d', '#073763', '#20124d', '#4C1130'],
        showEffect: '',
        hideEffect: '',
        onChangeColor: false
    };
    var opts = $.extend(defaults, options);
    return this.each(function () {
        var txt = $(this);
        var colorsMarkup = '';
        var prefix = txt.attr('id').replace(/-/g, '') + '_';
        for (var i = 0; i < opts.colors.length; i++) {
            var item = opts.colors[i];
            var breakLine = '';
            if (i % opts.colorsPerLine == 0)
                breakLine = 'clear: both; ';
            if (i > 0 && breakLine && $.browser && $.browser.msie && $.browser.version <= 7) {
                breakLine = '';
                colorsMarkup += '<li style="float: none; clear: both; overflow: hidden; background-color: #fff; display: block; height: 1px; line-height: 1px; font-size: 1px; margin-bottom: -2px;"></li>';
            }
            colorsMarkup += '<li id="' + prefix + 'color-' + i + '" class="color-box" style="' + breakLine + 'background-color: ' + item + '" title="' + item + '"></li>';
        }
        var box = $('<div id="' + prefix + 'color-picker" class="color-picker" style="position: absolute; left: 0px; top: 0px;"><ul>' + colorsMarkup + '</ul><div style="clear: both;"></div></div>');
        $('body').append(box);
        box.hide();
        box.find('li.color-box').click(function () {
            if (txt.is('input')) {
                txt.val(opts.colors[this.id.substr(this.id.indexOf('-') + 1)]);
                txt.blur();
            }
            if ($.isFunction(defaults.onChangeColor)) {
                defaults.onChangeColor.call(txt, opts.colors[this.id.substr(this.id.indexOf('-') + 1)]);
            }
            hideBox(box);
        });
        $(document).on('click', 'body', function () {
            hideBox(box);
        });

        box.click(function (event) {
            event.stopPropagation();
        });

        var positionAndShowBox = function (box) {
            var pos = txt.offset();
            var left = pos.left + txt.outerWidth() - box.outerWidth();
            if (left < pos.left) left = pos.left;
            box.css({
                left: left,
                top: (pos.top + txt.outerHeight())
            });
            showBox(box);
        }

        txt.click(function (event) {
            event.stopPropagation();
            if (!txt.is('input')) {
                /* element is not an input so probably a link or div which requires the color box to be shown */
                positionAndShowBox(box);
            }
        });

        txt.focus(function () {
            /* Hide all pickers before showing */
            $(".color-picker").each(function (index) {
                hideBox($(this));
            });
            positionAndShowBox(box);
        });

        function hideBox(box) {
            if (opts.hideEffect == 'fade')
                box.fadeOut();
            else if (opts.hideEffect == 'slide')
                box.slideUp();
            else
                box.hide();
        }

        function showBox(box) {
            if (opts.showEffect == 'fade')
                box.fadeIn();
            else if (opts.showEffect == 'slide')
                box.slideDown();
            else
                box.show();
        }
    });
};
