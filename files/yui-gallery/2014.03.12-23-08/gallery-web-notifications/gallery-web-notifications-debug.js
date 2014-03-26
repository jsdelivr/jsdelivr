YUI.add('gallery-web-notifications', function (Y, NAME) {

/*jslint browser: true */
/*global Y: true, webkitNotifications: true, Notification: true */

/**
Provides web notifications.

A notification allows alerting the user outside the context of a web page of
an occurrence, such as the delivery of email.

@module gallery-web-notifications
**/

Y.WebNotifications = function (config) {
    'use strict';

    var modcfg = config || {},
        notificationObj;

    modcfg.onclick = modcfg.onclick || function () {};
    modcfg.onshow  = modcfg.onshow  || function () {};
    modcfg.onerror = modcfg.onerror || function () {};
    modcfg.onclose = modcfg.onclose || function () {};

    modcfg.lang = modcfg.lang || '';
    modcfg.dir  = modcfg.dir  || 'auto';
    modcfg.icon = modcfg.icon || '';
    modcfg.tag  = modcfg.tag  || '';

    if (window.hasOwnProperty('Notification')) {
        Notification.lang = modcfg.lang;
        Notification.dir  = modcfg.dir;
        Notification.icon = modcfg.icon;
        Notification.tag  = modcfg.tag;
    } else if (typeof webkitNotifications === 'undefined') {
        throw new Error('Web Notifications are not supported by this browser.');
    }

    function showNotification(cfg) {
        var notification;

        try {
            if (window.Notification) {
                notification = new Notification(cfg.title || '', {
                    dir   : cfg.dir,
                    lang  : cfg.lang,
                    body  : cfg.body,
                    icon  : cfg.icon
                });
            } else if (window.webkitNotifications) {
                notification = webkitNotifications.createNotification(
                    cfg.icon,
                    cfg.title,
                    cfg.body
                );
            }
        } catch (ex) {
            notification = false;
        }

        return notification;
    }

    return {
        /**
        User has granted permission to show notification

        @property NOTIFICATION_ALLOWED
        **/
        NOTIFICATION_ALLOWED: 'granted',

        /**
        User has denied permission to show notification

        @property NOTIFICATION_DENIED
        **/
        NOTIFICATION_DENIED: 'denied',

        /**
        User has not explicitly granted/denied permission to show notification

        @property NOTIFICATION_DEFAULT
        **/
        NOTIFICATION_DEFAULT: 'default',

        /**
        Close the displayed notification.

        @method close
        **/
        close: function () {
            if (notificationObj && notificationObj.close) {
                notificationObj.close();
            }
        },

        /**
        Return the notification permission as chosen by the user.

        @method permission
        @param  {Integer|String} status The current permission
        @return {String} The permission status as described in <http://www.w3.org/TR/notifications/#permission>.
        **/
        permission: function (status) {
            var self = this;

            if (typeof status === 'undefined') {
                status = (window.Notification ? Notification.permission : webkitNotifications.checkPermission());
            }

            switch (status) {
            case 0:
            case 'granted':
                status = self.NOTIFICATION_ALLOWED;
                break;
            case 2:
            case 'denied':
                status = self.NOTIFICATION_DENIED;
                break;
            case 1:
            case 'default':
                status = self.NOTIFICATION_DEFAULT;
                break;
            default:            // Chrome doesn't seem to have Notification.permission property
                status = self.NOTIFICATION_DEFAULT;
                break;
            }

            return status;
        },

        /**
        Request user to grant permission for the app to show notification.

        @method request
        @param  {Function} callback The callback function to invoke after user action
        **/
        request: function (callback) {
            var self = this,
                doRequest,
                permission;

            if ((permission = self.permission()) === self.NOTIFICATION_DENIED || permission === self.NOTIFICATION_ALLOWED) {
                callback(permission);
            } else {
                doRequest = window.Notification ? Notification.requestPermission
                                                : webkitNotifications.requestPermission;
                doRequest(function normalizePermission(status) {
                    if (window.Notification && Notification.permission !== status) {
                        Notification.permission = status;
                    }
                    status = self.permission(status);
                    callback(status);
                });
            }
        },

        /**
        Display the notification.

        If the user has not granted permission to show the notification, then
        this method requests for permission first.

        @method show
        @param  {String} title   The title of the notification
        @param  {String} message The message body
        @param  {Object} options The notification options
        **/
        show: function (title, message, options) {
            var self = this,
                permission;

            options = options || {};

            if ((permission = self.permission()) === self.NOTIFICATION_DENIED) {
                return;
            }

            self.request(function notificationPermissionCallback(status) {
                if (status === self.NOTIFICATION_ALLOWED) {
                    notificationObj = showNotification({
                        title : title        || '',
                        dir   : options.dir  || modcfg.dir,
                        lang  : options.lang || modcfg.lang,
                        body  : message      || '',
                        icon  : options.icon || modcfg.icon
                    });
                }
            });
        }
    };
};


}, 'gallery-2013.11.14-01-08', {"requires": ["yui-base"]});
