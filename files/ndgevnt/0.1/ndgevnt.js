"use strict";


var globService;


(function ($) {
    var profileUrl = "http://192.168.1.88:1234/profile",
        eventUrl = "http://192.168.1.88:1234/event",
        userIdName = 'profile_id',
        sessionIdName = "session_id",
        _navigationState = null, 
        storeId = null,
        service = {};


    // PRIVATE FUNCTIONS
    // Create new state by id
    function _generateNavigationState(newStateId, properties) {
        var realTimeData = {}; // TODO get this info
        if (!properties) {
            return {
                id: newStateId,
                realTimeData: realTimeData
            }
        }
        var newState = {
            id: newStateId,
            realTimeData: properties.realTimeData,
            params: properties.params,
            lang: properties.lang
        };
        var setOptionalAttribute = function (attribute) {
            if (properties.hasOwnProperty(attribute))
                newState[attribute] = properties[attribute];
        };
        switch (newStateId) {
            case "home":
                break;
            case "category_listing":
                setOptionalAttribute('category_id');
                setOptionalAttribute('page_size');
                setOptionalAttribute('page_number');
                setOptionalAttribute('sort_by');
                break;
            case "category_landing":
                setOptionalAttribute('category_id');
                break;
            case "search_listing":
                setOptionalAttribute('category_ids');
                setOptionalAttribute('refinements');
                setOptionalAttribute('search_query');
                setOptionalAttribute('page_size');
                setOptionalAttribute('page_number');
                setOptionalAttribute('sort_by');
                break;
            case "product_detail":
                setOptionalAttribute('product_id');
                setOptionalAttribute('sku_id');
                break;
            case "shopping_cart":
                break;
            case "checkout_page":
                setOptionalAttribute('step_id');
                break;
            case "static":
                break;
            case "offline":
                break;
        }
        return newState;
    }
    
    function _sendEvent(eventName, properties, targetEntityId, targetEntityType) {
        if (eventName === undefined || properties === undefined) {
            console.log("_sendEvent: Wrong parameters (event or properties is undefined)");
            return;
        }


        var entityId = localStorage.getItem(userIdName);
        if (entityId === null)
            return;
        var event = {
            entityId: entityId,
            sessionId: _getCookie(sessionIdName),
            // entityType: "user",
            event: eventName,
            properties: properties
        };


        if (targetEntityId !== undefined)
            event['targetEntityId'] = targetEntityId;
        if (targetEntityType !== undefined)
            event['targetEntityType'] = targetEntityType;


        $.ajax({
            url: eventUrl,
            data: JSON.stringify(event),
            dataType: "json",
            contentType: "application/json",
            success: function (result) {
                console.log(result);
                if (eventName == "add_to_cart") {
                    service.store.orderComplete();
                }
            },
            type: 'POST'
        }, eventName);
    }


    function _getNullableTargetId(itemId, statePropertyName) {
        return itemId || _getStateProperty(statePropertyName) || null;
    }


    function _getStateProperty(itemName) {
        return service.navigationState.get()[itemName] || null;
    }


    function _guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }


    function _setSession(id, referrer) {
        console.log(id);
        if (_getCookie(sessionIdName) == "") {
            _setCookie(sessionIdName, id, 30);
            service.store.visit(referrer);
        }
        setTimeout(_setSession, 5 * 60 * 1000, id);
    }


    function _setCookie(cname, cvalue, expirationMinutes) {
        var d = new Date();
        d.setTime(d.getTime() + (expirationMinutes * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }


    function _getCookie(cname) {
        var name = cname + "=";
        var parameters = document.cookie.split(';');
        parameters.forEach(function (parameter) {
            while (parameter.charAt(0) == ' ') {
                parameter = parameter.substring(1);
            }
            if (parameter.indexOf(name) == 0) {
                return parameter.substring(name.length, parameter.length);
            }
        });
        return "";
    }


    service.init = function(navigationStateId, properties, pStoreId, userId) {
        storeId = pStoreId || window.location.hostname;
        service.navigationState.switch(navigationStateId, properties);
        service.profile.init(userId);
        var id = _guid();
        var referrer = (properties && properties.referrer) || null;
        _setSession(id, referrer);
    };
    
    service.navigationState = {
        switch: function(newStateId, properties) {
            _navigationState = _generateNavigationState(newStateId, properties);
            service.store.visitPage();
        }, 
        update: function(properties) {
            var id = navigationState.id;
            _navigationState = _generateNavigationState(id, properties);
            service.store.updateState();
        },
        get: function() {
            return _navigationState;
        }
    };
    
    service.profile = {
        // Check local storage for profileId and create profile if needed
        init: function (userId) {
            var storedUserId = localStorage.getItem(userIdName);
            if (storedUserId === null)
                service.profile.create(userId);
            else if (storedUserId != userId) {
                if (userId != null) {
                    service.profile.create(userId);
                }
            }
        },


        create: function (id, properties) {
            var profile = {};
            profile['properties'] = properties || {
                    name: "JAN",
                    birthdate: "..."
                };
            if (id != undefined && id != null) {
                profile['id'] = id;
            }


            $.ajax({
                url: profileUrl,
                data: JSON.stringify(profile),
                dataType: "json",
                contentType: "application/json",
                success: function (createdProfile) {
                    localStorage.setItem(userIdName, createdProfile['id']);
                },
                error: function (error) {
                    console.log("Could not create profile with id " + id + ", error:" + error);
                },
                type: 'POST'
            });
        },


        update: function (properties) {
            var id = localStorage.getItem(userIdName);
            var profile = {
                properties: properties,
                id: id
            };
            $.ajax({
                url: profileUrl,
                data: JSON.stringify(profile),
                dataType: "json",
                contentType: "application/json",
                success: function (result) {
                    console.log(result);
                },
                type: 'PUT'
            });
        }
    };
    
    service.offer = {
        idPropertyName: 'offer_id',
        targetType: 'offer',


        show: function (offerId) {
            _sendEvent("show", {storeId: storeId}, _getNullableTargetId(offerId, service.offer.idPropertyName), service.offer.targetType);
        },
        click: function (offerId) {
            _sendEvent("click", {storeId: storeId}, _getNullableTargetId(offerId, service.offer.idPropertyName), service.offer.targetType);
        },
        view: function (offerId) {
            _sendEvent("view", {storeId: storeId}, _getNullableTargetId(offerId, service.offer.idPropertyName), service.offer.targetType);
        },
        like: function (offerId) {
            _sendEvent("like", {storeId: storeId}, _getNullableTargetId(offerId, service.offer.idPropertyName), service.offer.targetType);
        },
        rate: function (offerId, rating) {
            _sendEvent("rate", {storeId: storeId, rating: rating}, _getNullableTargetId(offerId, service.offer.idPropertyName), service.offer.targetType);
        },
        share: function (offerId) {
            _sendEvent("share", {storeId: storeId}, _getNullableTargetId(offerId, service.offer.idPropertyName), service.offer.targetType);
        },
        dislike: function (offerId) {
            _sendEvent("dislike", {storeId: storeId}, _getNullableTargetId(offerId, service.offer.idPropertyName), service.offer.targetType);
        },
        comment: function (offerId, comment) {
            _sendEvent("comment", {storeId: storeId, comment: comment}, _getNullableTargetId(offerId, service.offer.idPropertyName), service.offer.targetType);
        }
    };
    
    service.product = {
        idPropertyName: 'product_id',
        targetType: 'product',
        
        show: function (productId) {
            _sendEvent("show", {storeId: storeId}, _getNullableTargetId(productId, service.product.idPropertyName), service.product.targetType);
        },
        click: function (productId) {
            _sendEvent("click", {storeId: storeId}, _getNullableTargetId(productId, service.product.idPropertyName), service.product.targetType);
        },
        view: function (productId) {
            _sendEvent("view", {storeId: storeId}, _getNullableTargetId(productId, service.product.idPropertyName), service.product.targetType);
        },


        like: function (productId) {
            _sendEvent("like", {storeId: storeId}, _getNullableTargetId(productId, service.product.idPropertyName), service.product.targetType);
        },
        rate: function (productId, rating) {
            _sendEvent("rate", {storeId: storeId, rating: rating}, _getNullableTargetId(productId, service.product.idPropertyName), service.product.targetType);
        },
        addToCart: function (productId, quantity) {
            var skuId = _getStateProperty('skuId') || "";
            _sendEvent("add_to_cart", {storeId: storeId, quantity: quantity, skuId: skuId},
                _getNullableTargetId(productId, service.product.idPropertyName), service.product.targetType);
        },
        removeFromCart: function (productId, quantity) {
            var skuId = _getStateProperty('skuId') || "";
            _sendEvent("remove_from_cart", {storeId: storeId, quantity: quantity, skuId: skuId},
                _getNullableTargetId(productId, service.product.idPropertyName), service.product.targetType);
        },
        addToWishlist: function (productId) {
            var skuId = _getStateProperty('skuId') || "";
            _sendEvent("add_to_wishlist", {storeId: storeId, skuId: skuId},
                _getNullableTargetId(productId, service.product.idPropertyName), service.product.targetType);
        },
        removeFromWishlist: function (productId) {
            var skuId = _getStateProperty('skuId') || "";
            _sendEvent("remove_from_wishlist", {storeId: storeId, skuId: skuId},
                _getNullableTargetId(productId, service.product.idPropertyName), service.product.targetType);
        },
        share: function (productId) {
            _sendEvent("share", {storeId: storeId}, _getNullableTargetId(productId, service.product.idPropertyName), service.product.targetType);
        },
        dislike: function (productId) {
            _sendEvent("dislike", {storeId: storeId}, _getNullableTargetId(productId, service.product.idPropertyName), service.product.targetType);
        },
        comment: function (productId, comment) {
            _sendEvent("comment", {
                storeId: storeId,
                comment: comment
            }, _getNullableTargetId(productId, service.product.idPropertyName), service.product.targetType);
        },
        returnProduct: function (productId, reason) {
            _sendEvent("return", {
                storeId: storeId,
                reason: reason
            }, _getNullableTargetId(productId, service.product.idPropertyName), service.product.targetType);
        },
        refund: function (productId, reason) {
            _sendEvent("refund", {
                storeId: storeId,
                reason: reason
            }, _getNullableTargetId(productId, service.product.idPropertyName), service.product.targetType);
        }
    };
    
    service.category = {
        idPropertyName: 'category_id',
        targetType: 'category',
        
        show: function (categoryId) {
            _sendEvent("show", {storeId: storeId}, _getNullableTargetId(categoryId, service.offer.idPropertyName), service.category.targetType);
        },
        click: function (categoryId) {
            _sendEvent("click", {storeId: storeId}, _getNullableTargetId(categoryId, service.offer.idPropertyName), service.category.targetType);
        },
        view: function (categoryId) {
            _sendEvent("view", {storeId: storeId}, _getNullableTargetId(categoryId, service.offer.idPropertyName), service.category.targetType);
        },
        like: function (categoryId) {
            _sendEvent("like", {storeId: storeId}, _getNullableTargetId(categoryId, service.offer.idPropertyName), service.category.targetType);
        },
        rate: function (categoryId, rating) {
            _sendEvent("rate", {
                storeId: storeId,
                rating: rating
            }, _getNullableTargetId(categoryId, service.offer.idPropertyName), service.category.targetType);
        },
        share: function (categoryId) {
            _sendEvent("share", {storeId: storeId}, _getNullableTargetId(categoryId, service.offer.idPropertyName), service.category.targetType);
        },
        dislike: function (categoryId) {
            _sendEvent("dislike", {storeId: storeId}, _getNullableTargetId(categoryId, service.offer.idPropertyName), service.category.targetType);
        },
        comment: function (categoryId, comment) {
            _sendEvent("comment", {
                storeId: storeId,
                comment: comment
            }, _getNullableTargetId(categoryId, service.offer.idPropertyName), service.category.targetType);
        }
    };
    
    service.store = {


        visit: function (referrer) {
            _sendEvent("visit", {referrer: referrer || null, storeId: storeId});
        },
        leaveStore: function () {
            _sendEvent("visit", {storeId: storeId});
        },
        loginSuccess: function () {
            _sendEvent("login_success", {storeId: storeId});
        },
        logout: function () {
            _sendEvent("logout", {storeId: storeId});
        },
        changeLocation: function (location) {
            _sendEvent("change_location", {storeId: storeId, location: location});
        },
        likeStore: function () {
            _sendEvent("like", {storeId: storeId});
        },
        dislikeStore: function () {
            _sendEvent("dislike", {storeId: storeId});
        },
        orderComplete: function () {
            _sendEvent("order_complete", {storeId: storeId});
        },
        registerUser: function (profile) {
            _sendEvent("register_user", {storeId: storeId, profile: profile});
        },
        updateUser: function (profile) {
            _sendEvent("update_user", {storeId: storeId, profile: profile});
        },
        loginFail: function () {
            _sendEvent("login_fail", {storeId: storeId});
        },
        openMessage: function (message_id) {
            _sendEvent("open_message", {storeId: storeId, messageId: message_id});
        },
        unsubscribeStore: function (message_type) {
            _sendEvent("unsubscribe", {storeId: storeId, messageType: message_type});
        },
        rateStore: function (rating) {
            _sendEvent("rate", {storeId: storeId, rating: rating});
        },
        visitPage: function () {
            _sendEvent("visit_page", {storeId: storeId}, _getStateProperty("id"), "page");
        },
        updateState: function () {
            _sendEvent("update_nav_state", {storeId: storeId}, _getStateProperty("id"), "page");
        }
    };


    service.test = function () {
        setTimeout(sendEven, 1000, 'blabla', {
            name: "JAN",
            birthdate: "..."
        });
    };


    globService = service;
    return service;
    // return service.init("home", {type: "pdp", product_id: "prod8v1"}, "store.com", null);
})(jQuery);
