YUI.add('gallery-rocket', function (Y, NAME) {

'use strict';

var getClassName = Y.ClassNameManager.getClassName;

Y.App.CLASS_NAMES = {
  app  : getClassName('rocket'),
  views: getClassName('rocket', 'views')
};

Y.Rocket = Y.App;


}, 'gallery-2013.09.18-18-49', {
    "requires": [
        "app",
        "gallery-rocket-controller",
        "gallery-rocket-model",
        "gallery-rocket-view",
        "gallery-rocket-layout",
        "gallery-rocket-list-view",
        "gallery-rocket-child-view-container",
        "gallery-rocket-region",
        "gallery-rocket-region-manager",
        "gallery-rocket-event-broker",
        "gallery-rocket-util"
    ]
});
