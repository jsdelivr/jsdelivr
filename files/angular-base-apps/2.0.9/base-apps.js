(function() {
  'use strict';

  // imports all components and dependencies under a single namespace
  angular.module('base', [
    'base.core',
    'base.mediaquery',
    'base.accordion',
    'base.actionsheet',
    'base.common',
    'base.interchange',
    'base.loader',
    'base.modal',
    'base.notification',
    'base.offcanvas',
    'base.panel',
    'base.popup',
    'base.tabs'
  ]);

})();

(function() {
  'use strict';

  angular.module('base.core.animation', [])
    .service('BaseAppsAnimation', BaseAppsAnimation)
  ;

  BaseAppsAnimation.$inject = ['$q'];

  function BaseAppsAnimation($q) {
    var animations = [];
    var service = {};

    var initClasses        = ['ng-enter', 'ng-leave'];
    var activeClasses      = ['ng-enter-active', 'ng-leave-active'];
    var activeGenericClass = 'is-active';
    var events = [
      'webkitAnimationEnd', 'mozAnimationEnd',
      'MSAnimationEnd', 'oanimationend',
      'animationend', 'webkitTransitionEnd',
      'otransitionend', 'transitionend'
    ];

    service.animate = animate;
    service.toggleAnimation = toggleAnimation;

    return service;

    function toggleAnimation(element, futureState) {
      if(futureState) {
        element.addClass(activeGenericClass);
      } else {
        element.removeClass(activeGenericClass);
      }
    }

    function animate(element, futureState, animationIn, animationOut) {
      var animationTimeout;
      var deferred = $q.defer();
      var timedOut = true;
      var self = this;
      self.cancelAnimation = cancelAnimation;

      var animationClass = futureState ? animationIn: animationOut;
      var activation = futureState;
      var initClass = activation ? initClasses[0] : initClasses[1];
      var activeClass = activation ? activeClasses[0] : activeClasses[1];

      run();
      return deferred.promise;

      function run() {
        //stop animation
        registerElement(element);
        reset();
        element.addClass(animationClass);
        element.addClass(initClass);

        element.addClass(activeGenericClass);

        //force a "tick"
        reflow();

        //activate
        element[0].style.transitionDuration = '';
        element.addClass(activeClass);

        element.on(events.join(' '), eventHandler);

        animationTimeout = setTimeout(function() {
          if(timedOut) {
            finishAnimation();
          }
        }, 3000);
      }

      function eventHandler(e) {
        if (element[0] === e.target) {
          clearTimeout(animationTimeout);
          finishAnimation();
        }
      }

      function finishAnimation() {
        deregisterElement(element);
        reset(); //reset all classes
        element[0].style.transitionDuration = '';
        element.removeClass(!activation ? activeGenericClass : ''); //if not active, remove active class
        reflow();
        timedOut = false;
        element.off(events.join(' '), eventHandler);
        deferred.resolve({element: element, active: activation});
      }

      function cancelAnimation(element) {
        deregisterElement(element);
        angular.element(element).off(events.join(' ')); //kill all animation event handlers
        timedOut = false;
        deferred.reject();
      }

      function registerElement(el) {
        var elObj = {
          el: el,
          animation: self
        };

        //kill in progress animations
        var inProgress = animations.filter(function(obj) {
          return obj.el === el;
        });
        if(inProgress.length > 0) {
          var target = inProgress[0].el[0];

          inProgress[0].animation.cancelAnimation(target);
        }

        animations.push(elObj);
      }

      function deregisterElement(el) {
        var index;
        var currentAnimation = animations.filter(function(obj, ind) {
          if(obj.el === el) {
            index = ind;
          }
        });

        if(index >= 0) {
          animations.splice(index, 1);
        }

      }

      function reflow() {
        return element[0].offsetWidth;
      }

      function reset() {
        element[0].style.transitionDuration = 0;
        element.removeClass(initClasses.join(' ') + ' ' + activeClasses.join(' ') + ' ' + animationIn + ' ' + animationOut);
      }
    }
  }

})();

(function() {
  'use strict';

  angular.module('base.core', [
      'base.core.animation'
    ])
    .service('BaseAppsApi', BaseAppsApi)
    .service('BaseAppsAdapter', BaseAppsAdapter)
    .factory('Utils', Utils)
    .run(Setup);
  ;

  BaseAppsApi.$inject = ['BaseAppsAnimation'];

  function BaseAppsApi(BaseAppsAnimation) {
    var listeners  = {};
    var settings   = {};
    var uniqueIds  = [];
    var service    = {};

    service.subscribe           = subscribe;
    service.unsubscribe         = unsubscribe;
    service.publish             = publish;
    service.getSettings         = getSettings;
    service.modifySettings      = modifySettings;
    service.generateUuid        = generateUuid;
    service.toggleAnimate       = toggleAnimate;
    service.closeActiveElements = closeActiveElements;
    service.animate             = animate;
    service.animateAndAdvise    = animateAndAdvise;

    return service;

    function subscribe(name, callback) {
      if (!listeners[name]) {
        listeners[name] = [];
      }

      listeners[name].push(callback);
      return true;
    }

    function unsubscribe(name, callback) {
      var listenerIndex = -1, i, resizeListeners;

      if (listeners[name] !== undefined) {
        if (name == 'resize') {
          resizeListeners = listeners['resize'];
          for (i = 0; i < resizeListeners.length; i++) {
            if (resizeListeners[i] === callback) {
              // listener found
              listenerIndex = i;
              break;
            }
          }

          if (listenerIndex != -1) {
            // remove listener
            resizeListeners.splice(listenerIndex, 1);
          }
        } else {
          // delete all listeners
          delete listeners[name];
        }
      }
      if (typeof callback == 'function') {
          callback.call(this);
      }
    }

    function publish(name, msg) {
      if (!listeners[name]) {
        listeners[name] = [];
      }

      listeners[name].forEach(function(cb) {
        cb(msg);
      });

      return;
    }

    function getSettings() {
      return settings;
    }

    function modifySettings(tree) {
      settings = angular.extend(settings, tree);
      return settings;
    }

    function generateUuid() {
      var uuid = '';

      //little trick to produce semi-random IDs
      do {
        uuid += 'ba-uuid-';
        for (var i=0; i<15; i++) {
          uuid += Math.floor(Math.random()*16).toString(16);
        }
      } while(!uniqueIds.indexOf(uuid));

      uniqueIds.push(uuid);
      return uuid;
    }

    function toggleAnimate(element, futureState) {
      BaseAppsAnimation.toggleAnimate(element, futureState);
    }

    function closeActiveElements(options) {
      var self = this;
      options = options || {};
      var activeElements = document.querySelectorAll('.is-active[ba-closable]');
      // action sheets are nested ba-closable elements, so we have to target the parent
      var nestedActiveElements = document.querySelectorAll('[ba-closable] > .is-active');

      if (activeElements.length) {
        angular.forEach(activeElements, function(el) {
          if (options.exclude !== el.id) {
            self.publish(el.id, 'close');
          }
        });
      }
      if (nestedActiveElements.length) {
        angular.forEach(nestedActiveElements, function(el) {
          var parentId = el.parentNode.id;
          if (options.exclude !== parentId) {
            self.publish(parentId, 'close');
          }
        });
      }
    }

    function animate(element, futureState, animationIn, animationOut) {
      return BaseAppsAnimation.animate(element, futureState, animationIn, animationOut);
    }

    function animateAndAdvise(element, futureState, animationIn, animationOut) {
      var msgPrefix = "animation-" + (futureState ? "open" : "close");
      publish(element[0].id, msgPrefix + "-started");
      var promise = BaseAppsAnimation.animate(element, futureState, animationIn, animationOut);
      promise.then(function() {
        publish(element[0].id, msgPrefix + "-finished");
      }, function() {
        publish(element[0].id, msgPrefix + "-aborted");
      });
      return promise;
    }
  }

  BaseAppsAdapter.$inject = ['BaseAppsApi'];

  function BaseAppsAdapter(BaseAppsApi) {

    var service    = {};

    service.activate = activate;
    service.deactivate = deactivate;

    return service;

    function activate(target) {
      BaseAppsApi.publish(target, 'show');
    }

    function deactivate(target) {
      BaseAppsApi.publish(target, 'hide');
    }
  }


  function Utils() {
    var utils = {};

    utils.throttle = throttleUtil;

    return utils;

    function throttleUtil(func, delay) {
      var timer = null;

      return function () {
        var context = this, args = arguments;

        if (timer === null) {
          timer = setTimeout(function () {
            func.apply(context, args);
            timer = null;
          }, delay);
        }
      };
    }
  }

  function Setup() {
    // Attach FastClick
    if (typeof(FastClick) !== 'undefined') {
      FastClick.attach(document.body);
    }

    // Attach viewport units buggyfill
    if (typeof(viewportUnitsBuggyfill) !== 'undefined') {
      viewportUnitsBuggyfill.init();
    }
  }

})();

(function() {
  'use strict';

  angular.module('base.mediaquery', ['base.core'])
    .run(mqInitRun)
    .factory('BaseAppsMediaQueryInit', BaseAppsMediaQueryInit)
    .factory('mqHelpers', mqHelpers)
    .service('BaseAppsMediaQuery', BaseAppsMediaQuery)
  ;

  mqInitRun.$inject = ['BaseAppsMediaQueryInit'];

  function mqInitRun(mqInit) {
    mqInit.init();
  }

  BaseAppsMediaQueryInit.$inject = ['mqHelpers', 'BaseAppsApi', 'Utils', 'BaseAppsMediaQuery'];

  function BaseAppsMediaQueryInit(helpers, BaseAppsApi, u, BaseAppsMediaQuery){
    var factory = {};
    var namedQueries = {
      'default' : 'only screen',
      landscape : 'only screen and (orientation: landscape)',
      portrait : 'only screen and (orientation: portrait)',
      retina : 'only screen and (-webkit-min-device-pixel-ratio: 2),' +
        'only screen and (min--moz-device-pixel-ratio: 2),' +
        'only screen and (-o-min-device-pixel-ratio: 2/1),' +
        'only screen and (min-device-pixel-ratio: 2),' +
        'only screen and (min-resolution: 192dpi),' +
        'only screen and (min-resolution: 2dppx)'
    };

    factory.init = init;

    return factory;

    function init() {
      var mediaQueries;
      var extractedMedia;
      var mediaQuerySizes;
      var mediaMap;
      var key;

      helpers.headerHelper(['base-apps-mq']);
      extractedMedia = helpers.getStyle('.base-apps-mq', 'font-family');

      if (!extractedMedia.match(/([\w]+=[\d]+[a-z]*&?)+/)) {
        extractedMedia = 'small=0&medium=40rem&large=75rem&xlarge=90rem&xxlarge=120rem';
      }

      mediaQueries = helpers.parseStyleToObject((extractedMedia));
      mediaQuerySizes = [];

      for(key in mediaQueries) {
        mediaQuerySizes.push({ query: key, size: parseInt(mediaQueries[key].replace('rem', '')) });
        mediaQueries[key] = 'only screen and (min-width: ' + mediaQueries[key].replace('rem', 'em') + ')';
      }

      // sort by increasing size
      mediaQuerySizes.sort(function(a,b) {
        return a.size > b.size ? 1 : (a.size < b.size ? -1 : 0);
      });

      mediaMap = {};
      for (key = 0; key < mediaQuerySizes.length; key++) {
        mediaMap[mediaQuerySizes[key].query] = {
          up: null,
          down: null
        };

        if (key+1 < mediaQuerySizes.length) {
          mediaMap[mediaQuerySizes[key].query].up = mediaQuerySizes[key+1].query;
        }

        if (key !== 0) {
          mediaMap[mediaQuerySizes[key].query].down = mediaQuerySizes[key-1].query;
        }
      }

      BaseAppsApi.modifySettings({
        mediaQueries: angular.extend(mediaQueries, namedQueries),
        mediaMap: mediaMap
      });

      window.addEventListener('resize', u.throttle(function() {
        // any resize event causes a clearing of the media cache
        BaseAppsMediaQuery.clearCache();

        BaseAppsApi.publish('resize', 'window resized');
      }, 50));
    }
  }


  function mqHelpers() {
    var factory = {};

    factory.headerHelper = headerHelper;
    factory.getStyle = getStyle;
    factory.parseStyleToObject = parseStyleToObject;

    return factory;

    function headerHelper(classArray) {
      var i = classArray.length;
      var head = angular.element(document.querySelectorAll('head'));

      while(i--) {
        head.append('<meta class="' + classArray[i] + '" />');
      }

      return;
    }

    function getStyle(selector, styleName) {
      var elem  = document.querySelectorAll(selector)[0];
      var style = window.getComputedStyle(elem, null);

      return style.getPropertyValue('font-family');
    }

      // https://github.com/sindresorhus/query-string
    function parseStyleToObject(str) {
      var styleObject = {};

      if (typeof str !== 'string') {
        return styleObject;
      }

      if ((str[0] === '"' && str[str.length - 1] === '"') || (str[0] === '\'' && str[str.length - 1] === '\'')) {
        str = str.trim().slice(1, -1); // some browsers re-quote string style values
      }

      if (!str) {
        return styleObject;
      }

      styleObject = str.split('&').reduce(function(ret, param) {
        var parts = param.replace(/\+/g, ' ').split('=');
        var key = parts[0];
        var val = parts[1];
        key = decodeURIComponent(key);

        // missing `=` should be `null`:
        // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
        val = val === undefined ? null : decodeURIComponent(val);

        if (!ret.hasOwnProperty(key)) {
          ret[key] = val;
        } else if (Array.isArray(ret[key])) {
          ret[key].push(val);
        } else {
          ret[key] = [ret[key], val];
        }
        return ret;
      }, {});

      return styleObject;
    }
  }

  BaseAppsMediaQuery.$inject = ['BaseAppsApi'];

  function BaseAppsMediaQuery(BaseAppsApi) {
    var service = [],
        mediaQueryResultCache = {},
        queryMinWidthCache = {};

    service.getMediaQueries = getMediaQueries;
    service.match = match;
    service.matchesMedia = matchesMedia;
    service.matchesMediaOrSmaller = matchesMediaOrSmaller;
    service.matchesMediaOnly = matchesMediaOnly;
    service.collectScenariosFromElement = collectScenariosFromElement;
    service.clearCache = clearCache;

    return service;

    // METHOD INTENDED FOR INTERNAL USE ONLY
    function clearCache() {
      mediaQueryResultCache = {};
    }

    function getMediaQueries() {
      return BaseAppsApi.getSettings().mediaQueries;
    }

    function getNextLargestMediaQuery(media) {
      var mediaMapEntry = BaseAppsApi.getSettings().mediaMap[media];
      if (mediaMapEntry) {
        return mediaMapEntry.up;
      } else {
        return null;
      }
    }

    function getNextSmallestMediaQuery(media) {
      var mediaMapEntry = BaseAppsApi.getSettings().mediaMap[media];
      if (mediaMapEntry) {
        return mediaMapEntry.down;
      } else {
        return null;
      }
    }

    function match(scenarios) {
      var count   = scenarios.length;
      var queries = service.getMediaQueries();
      var matches = [];

      if (count > 0) {
        while (count--) {
          var mq;
          var rule = scenarios[count].media;

          if (queries[rule]) {
            mq = matchMedia(queries[rule]);
          } else {
            mq = matchMedia(rule);
          }

          if (mq.matches) {
            matches.push({ ind: count});
          }
        }
      }

      return matches;
    }

    function matchesMedia(query) {
      if (angular.isUndefined(mediaQueryResultCache[query])) {
        // cache miss, run media query
        mediaQueryResultCache[query] = match([{media: query}]).length > 0;
      }
      return mediaQueryResultCache[query];
    }

    function matchesMediaOrSmaller(query) {
      // In order to match the named breakpoint or smaller,
      // the next largest named breakpoint cannot be matched
      var nextLargestMedia = getNextLargestMediaQuery(query);
      if (nextLargestMedia && matchesMedia(nextLargestMedia)) {
        return false;
      }

      // Check to see if any smaller named breakpoint is matched
      return matchesSmallerRecursive(query);

      function matchesSmallerRecursive(query) {
        var nextSmallestMedia;

        if (matchesMedia(query)) {
          // matches breakpoint
          return true;
        } else {
          // check if matches smaller media
          nextSmallestMedia = getNextSmallestMediaQuery(query);
          if (!nextSmallestMedia) {
            // no more smaller breakpoints
            return false;
          } else {
            return matchesSmallerRecursive(nextSmallestMedia);
          }
        }
      }
    }

    function matchesMediaOnly(query) {
      // Check that media ONLY matches named breakpoint and nothing else
      var nextLargestMedia = getNextLargestMediaQuery(query);

      if (!nextLargestMedia) {
        // reached max media size, run query for current media
        return matchesMedia(query);
      } else {
        // must match named breakpoint, but not next largest
        return matchesMedia(query) && !matchesMedia(nextLargestMedia);
      }
    }

    // Collects a scenario object and templates from element
    function collectScenariosFromElement(parentElement) {
      var scenarios = [];
      var templates = [];

      var elements = parentElement.children();
      var i        = 0;

      angular.forEach(elements, function(el) {
        var elem = angular.element(el);

        //if no source or no html, capture element itself
        if (!elem.attr('src') || !elem.attr('src').match(/.html$/)) {
          templates[i] = elem;
          scenarios[i] = { media: elem.attr('media'), templ: i };
        } else {
          scenarios[i] = { media: elem.attr('media'), src: elem.attr('src') };
        }

        i++;
      });

      return {
        scenarios: scenarios,
        templates: templates
      };
    }
  }
})();

(function() {
  'use strict';

  angular.module('base.accordion', [])
    .controller('baAccordionController', baAccordionController)
    .directive('baAccordion', baAccordion)
    .directive('baAccordionItem', baAccordionItem)
  ;

  baAccordionController.$inject = ['$scope'];

  function baAccordionController($scope) {
    var controller = this;
    var sections = controller.sections = $scope.sections = [];
    var multiOpen   = false;
    var collapsible = false;
    var autoOpen    = true;

    controller.select = function(selectSection) {
      sections.forEach(function(section) {
        if(section.scope === selectSection) {
          if (multiOpen || collapsible) {
            section.scope.active = !section.scope.active;
          } else {
            section.scope.active = true;
          }
        } else {
          if (!multiOpen) {
            section.scope.active = false;
          }
        }
      });
    };

    controller.addSection = function addsection(sectionScope) {
      sections.push({ scope: sectionScope });

      if(sections.length === 1 && autoOpen === true) {
        sections[0].active = true;
        sections[0].scope.active = true;
      }
    };

    controller.closeAll = function() {
      sections.forEach(function(section) {
        section.scope.active = false;
      });
    };

    controller.setAutoOpen = function(val) {
      autoOpen = val;
    };

    controller.setCollapsible = function(val) {
      collapsible = val;
    };

    controller.setMultiOpen = function(val) {
      multiOpen = val;
    };
  }

  function baAccordion() {
    var directive = {
      restrict: 'EA',
      transclude: 'true',
      replace: true,
      templateUrl: 'components/accordion/accordion.html',
      controller: 'baAccordionController',
      scope: {
      },
      link: link
    };

    return directive;

    function link(scope, element, attrs, controller) {
      controller.setAutoOpen(attrs.autoOpen !== "false");
      controller.setCollapsible(attrs.collapsible === "true");
      controller.setMultiOpen(attrs.multiOpen === "true");
    }
  }

  //accordion item
  baAccordionItem.$inject = ['BaseAppsApi'];

  function baAccordionItem(BaseAppsApi) {
    var directive = {
        restrict: 'EA',
        templateUrl: 'components/accordion/accordion-item.html',
        transclude: true,
        scope: {
          title: '@'
        },
        require: '^baAccordion',
        replace: true,
        controller: function() {},
        link: link
    };

    return directive;

    function link(scope, element, attrs, controller, transclude) {
      scope.id = attrs.id || BaseAppsApi.generateUuid();
      scope.active = false;
      controller.addSection(scope);

      BaseAppsApi.subscribe(scope.id, function(msg) {
        if(msg === 'show' || msg === 'open' || msg === 'activate') {
          if (!scope.active) {
            controller.select(scope);
          }
        }

        if(msg === 'hide' || msg === 'close' || msg === 'deactivate') {
          if (scope.active) {
            controller.select(scope);
          }
        }

        if(msg === 'toggle') {
          controller.select(scope);
        }

        scope.$digest();
      });

      scope.activate = function() {
        controller.select(scope);
      };

      scope.$on("$destroy", function() {
        BaseAppsApi.unsubscribe(scope.id);
      });
    }
  }

})();

(function() {
  'use strict';

  angular.module('base.actionsheet', ['base.core'])
    .controller('baActionSheetController', baActionSheetController)
    .directive('baActionSheet', baActionSheet)
    .directive('baAsContent', baAsContent)
    .directive('baAsButton', baAsButton)
    .service('BaseAppsActionSheet', BaseAppsActionSheet)
  ;

  BaseAppsActionSheet.$inject = ['BaseAppsApi'];

  function BaseAppsActionSheet(BaseAppsApi) {
    var service    = {};

    service.activate = activate;
    service.deactivate = deactivate;

    return service;

    //target should be element ID
    function activate(target) {
      BaseAppsApi.publish(target, 'show');
    }

    //target should be element ID
    function deactivate(target) {
      BaseAppsApi.publish(target, 'hide');
    }
  }

  baActionSheetController.$inject = ['$scope', 'BaseAppsApi'];

  function baActionSheetController($scope, BaseAppsApi) {
    var controller = this;
    var content = controller.content = $scope.content;
    var container = controller.container = $scope.container;
    var body = angular.element(document.body);

    controller.registerContent = function(scope) {
      content = scope;
      content.active = false;
    };

    controller.registerContainer = function(scope) {
      container = scope;
      container.active = false;
    };

    controller.toggle = toggle;
    controller.hide = hide;
    controller.show = show;

    controller.registerListener = function() {
      document.body.addEventListener('click', listenerLogic);
    };

    controller.deregisterListener = function() {
      document.body.removeEventListener('click', listenerLogic);
    }

    function listenerLogic(e) {
      var el = e.target;
      var insideActionSheet = false;

      do {
        if(el.classList && el.classList.contains('action-sheet-container')) {
          insideActionSheet = true;
          break;
        }

      } while ((el = el.parentNode));

      if(!insideActionSheet) {
        // if the element has a toggle attribute, do nothing
        if (e.target.attributes['ba-toggle'] || e.target.attributes['ba-hard-toggle']) {
          return;
        };
        // if the element is outside the action sheet and is NOT a toggle element, hide
        hide();
      }
    }

    function hide() {
      content.hide();
      container.hide();

      if (!$scope.$$phase) {
        content.$apply();
        container.$apply();
      }
    }

    function toggle() {
      content.toggle();
      container.toggle();

      if (!$scope.$$phase) {
        content.$apply();
        container.$apply();
      }
    }

    function show() {
      content.show();
      container.show();

      if (!$scope.$$phase) {
        content.$apply();
        container.$apply();
      }
    }
  }

  baActionSheet.$inject = ['BaseAppsApi'];

  function baActionSheet(BaseAppsApi) {
    var directive = {
      restrict: 'EA',
      transclude: true,
      replace: true,
      templateUrl: 'components/actionsheet/actionsheet.html',
      controller: 'baActionSheetController',
      compile: compile
    };

    return directive;

    function compile() {

      return {
        pre: preLink,
        post: postLink
      };

      function preLink(scope, iElement, iAttrs) {
        iAttrs.$set('ba-closable', 'actionsheet');
      }

      function postLink(scope, element, attrs, controller) {
        var id = attrs.id || BaseAppsApi.generateUuid();
        attrs.$set('id', id);

        scope.active = false;

        BaseAppsApi.subscribe(id, function(msg) {
          if (msg === 'toggle') {
            controller.toggle();
          }

          if (msg === 'hide' || msg === 'close') {
            controller.hide();
          }

          if (msg === 'show' || msg === 'open') {
            controller.show();
          }
        });

        controller.registerContainer(scope);

        scope.toggle = function() {
          scope.active = !scope.active;
          return;
        };

        scope.hide = function() {
          scope.active = false;
          return;
        };

        scope.show = function() {
          scope.active = true;
          return;
        };

        scope.$on("$destroy", function() {
          BaseAppsApi.unsubscribe(id);
        });
      }
    }
  }

  baAsContent.$inject = ['BaseAppsApi'];

  function baAsContent(BaseAppsApi) {
    var directive = {
      restrict: 'EA',
      transclude: true,
      replace: true,
      templateUrl: 'components/actionsheet/actionsheet-content.html',
      require: '^baActionSheet',
      scope: {
        position: '@?'
      },
      link: link
    };

    return directive;

    function link(scope, element, attrs, controller) {
      scope.active = false;
      scope.position = scope.position || 'bottom';
      controller.registerContent(scope);

      scope.toggle = function() {
        scope.active = !scope.active;
        if(scope.active) {
          controller.registerListener();
        } else {
          controller.deregisterListener();
        }

        return;
      };

      scope.hide = function() {
        scope.active = false;
        controller.deregisterListener();
        return;
      };

      scope.show = function() {
        scope.active = true;
        controller.registerListener();
        return;
      };
    }
  }

  baAsButton.$inject = ['BaseAppsApi'];

  function baAsButton(BaseAppsApi) {
    var directive = {
      restrict: 'EA',
      transclude: true,
      replace: true,
      templateUrl: 'components/actionsheet/actionsheet-button.html',
      require: '^baActionSheet',
      scope: {
        title: '@?'
      },
      link: link
    }

    return directive;

    function link(scope, element, attrs, controller) {

      element.on('click', function(e) {
        controller.toggle();
        e.preventDefault();
      });

    }
  }

})();

(function() {
  'use strict';

  angular.module('base.common', ['base.core'])
    .directive('baClose', baClose)
    .directive('baOpen', baOpen)
    .directive('baToggle', baToggle)
    .directive('baEscClose', baEscClose)
    .directive('baSwipeClose', baSwipeClose)
    .directive('baHardToggle', baHardToggle)
    .directive('baCloseAll', baCloseAll)
    .directive('baNoSupport', baNoSupport)
  ;

  baClose.$inject = ['BaseAppsApi'];

  function baClose(BaseAppsApi) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      var targetId = '';
      if (attrs.baClose) {
        targetId = attrs.baClose;
      } else {
        var parentElement= false;
        var tempElement = element.parent();
        // find parent component
        while(parentElement === false) {
          if(tempElement[0].nodeName == 'BODY') {
            parentElement = '';
          }

          if(typeof tempElement.attr('ba-closable') !== 'undefined' && tempElement.attr('ba-closable') !== false) {
            parentElement = tempElement;
          }

          tempElement = tempElement.parent();
        }
        targetId = parentElement.attr('id');
      }
      element.on('click', function(e) {
        BaseAppsApi.publish(targetId, 'close');

        if (!_hasParentHref(e.target, targetId)) {
          // prevent default if target not inside link
          e.preventDefault();
        }
      });
    }
  }

  baOpen.$inject = ['BaseAppsApi'];

  function baOpen(BaseAppsApi) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      element.on('click', function(e) {
        BaseAppsApi.publish(attrs.baOpen, 'open');

        if (!_hasParentHref(e.target, attrs.baOpen)) {
          // prevent default if target not inside link
          e.preventDefault();
        }
      });
    }
  }

  baToggle.$inject = ['BaseAppsApi'];

  function baToggle(BaseAppsApi) {
    var directive = {
      restrict: 'A',
      link: link
    }

    return directive;

    function link(scope, element, attrs) {
      element.on('click', function(e) {
        BaseAppsApi.publish(attrs.baToggle, 'toggle');

        if (!_hasParentHref(e.target, attrs.baToggle)) {
          // prevent default if target not inside link
          e.preventDefault();
        }
      });
    }
  }

  baEscClose.$inject = ['BaseAppsApi'];

  function baEscClose(BaseAppsApi) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      element.on('keyup', function(e) {
        if (e.keyCode === 27) {
          BaseAppsApi.closeActiveElements();
        }
        e.preventDefault();
      });
    }
  }

  baSwipeClose.$inject = ['BaseAppsApi'];

  function baSwipeClose(BaseAppsApi) {
    var directive = {
      restrict: 'A',
      link: link
    };
    return directive;

    function link($scope, element, attrs) {
      var swipeDirection;
      var hammerElem, hammerDirection;

      // detect what direction the directive is pointing
      switch (attrs.baSwipeClose) {
        case 'right':
          swipeDirection = 'swiperight';
          hammerDirection = Hammer.DIRECTION_RIGHT;
          break;
        case 'left':
          swipeDirection = 'swipeleft';
          hammerDirection = Hammer.DIRECTION_LEFT;
          break;
        case 'up':
          swipeDirection = 'swipeup';
          hammerDirection = Hammer.DIRECTION_UP;
          break;
        case 'down':
          swipeDirection = 'swipedown';
          hammerDirection = Hammer.DIRECTION_DOWN;
          break;
        default:
          swipeDirection = 'swipe';
          hammerDirection = Hammer.DIRECTION_ALL;
      }

      if (typeof(Hammer)!=='undefined') {
        hammerElem = new Hammer(element[0]);
        // set the options for swipe (to make them a bit more forgiving in detection)
        hammerElem.get('swipe').set({
          direction: hammerDirection,
          threshold: 5, // this is how far the swipe has to travel
          velocity: 0.5 // and this is how fast the swipe must travel
        });
        hammerElem.on(swipeDirection, function() {
          BaseAppsApi.publish(attrs.id, 'close');
        });
      }
    }
  }

  baHardToggle.$inject = ['BaseAppsApi'];

  function baHardToggle(BaseAppsApi) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      element.on('click', function(e) {
        BaseAppsApi.closeActiveElements({exclude: attrs.baHardToggle});
        BaseAppsApi.publish(attrs.baHardToggle, 'toggle');

        if (!_hasParentHref(e.target, attrs.baToggle)) {
          // prevent default if target not inside link
          e.preventDefault();
        }
      });
    }
  }

  baCloseAll.$inject = ['BaseAppsApi'];

  function baCloseAll(BaseAppsApi) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      element.on('click', function(e) {
        var tar = e.target, avoid, activeElements, closedElements, i;

        // check if clicked target or any of its ancestors is designated to open/close
        // another component
        avoid = ['ba-toggle', 'ba-hard-toggle', 'ba-open', 'ba-close'].filter(function(e){
          var parentElement = tar, hasAttr = false;

          while (parentElement && typeof(parentElement.getAttribute) === 'function') {
            var attrVal = parentElement.getAttribute(e);
            if (typeof(attrVal) !== 'undefined' && attrVal !== null) {
              hasAttr = true;
              break;
            }
            parentElement = parentElement.parentNode;
          }

          return hasAttr;
        });
        if(avoid.length > 0) {
          // do nothing
          return;
        }

        // check if clicked element is inside active closable parent
        if (getParentsUntil(tar, 'ba-closable') !== false) {
          // do nothing
          return;
        }

        // close all active elements
        activeElements = document.querySelectorAll('.is-active[ba-closable]');
        closedElements = 0;
        if(activeElements.length > 0) {
          for(i = 0; i < activeElements.length; i++) {
            if (!activeElements[i].hasAttribute('ba-ignore-all-close')) {
              BaseAppsApi.publish(activeElements[i].id, 'close');
              closedElements++;
            }
          }

          // if one or more elements were closed and the target is not an href,
          // prevent the default action
          if (closedElements > 0 && !tar.href) {
            e.preventDefault();
          }
        }
      });
    }
    /** special thanks to Chris Ferdinandi for this solution.
     * http://gomakethings.com/climbing-up-and-down-the-dom-tree-with-vanilla-javascript/
     */
    function getParentsUntil(elem, parent) {
      for ( ; elem && elem !== document.body; elem = elem.parentNode ) {
        if(elem.hasAttribute(parent)){
          if(elem.classList.contains('is-active')){ return elem; }
          break;
        }
      }
      return false;
    }
  }

  baNoSupport.$inject = ['$window'];

  function baNoSupport($window) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      if (!$window.Modernizr || $window.Modernizr.flexbox) {
        element.remove();
      }
    }
  }

  function _hasParentHref(target, rootId) {
    var parentElement = target, hasHref = false;

    while (parentElement && parentElement.id != rootId) {
      if (parentElement.href) {
        hasHref = true;
        break;
      }
      parentElement = parentElement.parentNode;
    }

    return hasHref;
  }
})();

(function() {
  'use strict';

  angular.module('base.interchange', ['base.core', 'base.mediaquery'])
    .directive('baInterchange', baInterchange)
    /*
     * Final directive to perform media queries, other directives set up this one
     * (See: http://stackoverflow.com/questions/19224028/add-directives-from-directive-in-angularjs)
     */
    .directive('baQuery', baQuery)
    /*
     * ba-if / ba-show / ba-hide
     */
    .directive('baIf', baQueryDirective('ng-if', 'ba-if'))
    .directive('baShow', baQueryDirective('ng-show', 'ba-show'))
    .directive('baHide', baQueryDirective('ng-hide', 'ba-hide'))
  ;

  baInterchange.$inject = [ '$compile', '$http', '$templateCache', 'BaseAppsApi', 'BaseAppsMediaQuery'];

  function baInterchange($compile, $http, $templateCache, BaseAppsApi, BaseAppsMediaQuery) {

    var directive = {
      restrict: 'EA',
      transclude: 'element',
      scope: {
        position: '@'
      },
      replace: true,
      template: '<div></div>',
      link: link
    };

    return directive;

    function link(scope, element, attrs, ctrl, transclude) {
      var childScope, current, scenarios, innerTemplates;

      var globalQueries = BaseAppsMediaQuery.getMediaQueries();

      // subscribe for resize events
      BaseAppsApi.subscribe('resize', resize);

      scope.$on("$destroy", function() {
        BaseAppsApi.unsubscribe('resize', resize);
      });

      //init
      BaseAppsApi.publish('resize', 'initial resize');

      function templateLoader(templateUrl) {
        return $http.get(templateUrl, {cache: $templateCache});
      }

      function collectInformation(el) {
        var data = BaseAppsMediaQuery.collectScenariosFromElement(el);

        scenarios = data.scenarios;
        innerTemplates = data.templates;
      }

      function checkScenario(scenario) {
        return !current || current !== scenario;
      }

      function resize(msg) {
        transclude(function(clone, newScope) {
          if(!scenarios || !innerTemplates) {
            collectInformation(clone);
          }

          var ruleMatches = BaseAppsMediaQuery.match(scenarios);
          var scenario = ruleMatches.length === 0 ? null : scenarios[ruleMatches[0].ind];

          //this could use some love
          if(scenario && checkScenario(scenario)) {
            var compiled;

            if(childScope) {
              childScope.$destroy();
              childScope = null;
            }

            if(typeof scenario.templ !== 'undefined') {
              childScope = newScope;

              //temp container
              var tmp = document.createElement('div');
              tmp.appendChild(innerTemplates[scenario.templ][0]);

              element.html(tmp.innerHTML);
              $compile(element.contents())(childScope);
              current = scenario;
            } else {
              var loader = templateLoader(scenario.src);
              loader.success(function(html) {
                childScope = newScope;
                element.html(html);
              }).then(function(){
                $compile(element.contents())(childScope);
                current = scenario;
              });
            }
          }
        });
      }
    }
  }

  /*
   * This directive will configure ng-if/ng-show/ng-hide and ba-query directives and then recompile the element
   */
  function baQueryDirective(angularDirective, directiveName) {
    return ['$compile', 'BaseAppsApi', function ($compile, BaseAppsApi) {
      // create unique scope property for media query result, must be unique to avoid collision with other ba-query directives
      // property set upon element compilation or else all similar directives (i.e. ba-if-*/ba-show-*/ba-hide-*) will get the same value
      var queryResult;

      return {
        priority: 1000, // must compile directive before any others
        terminal: true, // don't compile any other directive after this
                        // we'll fix this with a recompile
        restrict: 'A',
        compile: compile
      };

      // From here onward, scope[queryResult] refers to the result of running the provided query
      function compile(element, attrs) {
        var previousParam;

        // set unique property
        queryResult = (directiveName + BaseAppsApi.generateUuid()).replace(/-/g,'');

        // set default configuration
        element.attr('ba-query-not', false);
        element.attr('ba-query-only', false);
        element.attr('ba-query-or-smaller', false);
        element.attr('ba-query-scope-prop', queryResult);

        // parse directive attribute for query parameters
        element.attr(directiveName).split(' ').forEach(function(param) {
          if (param) {
            // add ba-query directive and configuration attributes
            switch (param) {
              case "not":
                element.attr('ba-query-not', true);
                element.attr('ba-query-only', true);
                break;
              case "only":
                element.attr('ba-query-only', true);
                break;
              case "or":
                break;
              case "smaller":
                // allow usage of smaller keyword if preceeded by 'or' keyword
                if (previousParam === "or") {
                  element.attr('ba-query-or-smaller', true);
                }
                break;
              default:
                element.attr('ba-query', param);
                break;
            }

            previousParam = param;
          }
        });

        // add/update angular directive
        if (!element.attr(angularDirective)) {
          element.attr(angularDirective, queryResult);
        } else {
          element.attr(angularDirective, queryResult + ' && (' + element.attr(angularDirective) + ')');
        }

        // remove directive from current element to avoid infinite recompile
        element.removeAttr(directiveName);
        element.removeAttr('data-' + directiveName);

        return {
          pre: function (scope, element, attrs) {
          },
          post: function (scope, element, attrs) {
            // recompile
            $compile(element)(scope);
          }
        };
      }
    }];
  }

  baQuery.$inject = ['BaseAppsApi', 'BaseAppsMediaQuery'];
  function baQuery(BaseAppsApi, BaseAppsMediaQuery) {
    return {
      priority: 601, // must compile before ng-if (600)
      restrict: 'A',
      compile: function compile(element, attrs) {
        return compileWrapper(attrs['baQueryScopeProp'],
                              attrs['baQuery'],
                              attrs['baQueryOnly'] === "true",
                              attrs['baQueryNot'] === "true",
                              attrs['baQueryOrSmaller'] === "true");
      }
    };

    // parameters will be populated with values provided from ba-query-* attributes
    function compileWrapper(queryResult, namedQuery, queryOnly, queryNot, queryOrSmaller) {
      // set defaults
      queryOnly = queryOnly || false;
      queryNot = queryNot || false;

      return {
        pre: preLink,
        post: postLink
      };

      // From here onward, scope[queryResult] refers to the result of running the provided query
      function preLink(scope, element, attrs) {
        // initially set media query result to false
        scope[queryResult] = false;
      }

      function postLink(scope, element, attrs) {
        // subscribe for resize events
        BaseAppsApi.subscribe('resize', resize);

        scope.$on("$destroy", function() {
          BaseAppsApi.unsubscribe('resize', resize);
        });

        // run first media query check
        runQuery();

        function runQuery() {
          if (!queryOnly) {
            if (!queryOrSmaller) {
              // Check if matches media or LARGER
              scope[queryResult] = BaseAppsMediaQuery.matchesMedia(namedQuery);
            } else {
              // Check if matches media or SMALLER
              scope[queryResult] = BaseAppsMediaQuery.matchesMediaOrSmaller(namedQuery);
            }
          } else {
            if (!queryNot) {
              // Check that media ONLY matches named query and nothing else
              scope[queryResult] = BaseAppsMediaQuery.matchesMediaOnly(namedQuery);
            } else {
              // Check that media does NOT match named query
              scope[queryResult] = !BaseAppsMediaQuery.matchesMediaOnly(namedQuery);
            }
          }
        }

        function resize() {
          var orignalVisibilty = scope[queryResult];
          runQuery();
          if (orignalVisibilty != scope[queryResult]) {
            // digest if visibility changed
            scope.$digest();
          }
        }
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('base.loader', [])
    .directive('baSpinKit', baSpinKit)
  ;

  function baSpinKit() {
    var directive = {
      restrict: 'EA',
      replace: true,
      templateUrl: function(element, attrs) {
        return "components/loader/spinkit-" + (attrs.loader || "rotating-plane") + ".html";
      }
    };

    return directive;
  }
})();

(function() {
  'use strict';

  angular.module('base.modal', ['base.core'])
    .directive('baModal', modalDirective)
    .factory('ModalFactory', ModalFactory)
    .factory('ConfirmModal', ConfirmModal)
    .factory('PromptModal', PromptModal)
    .service('BaseAppsModal', BaseAppsModal)
  ;

  BaseAppsModal.$inject = ['BaseAppsApi', 'ModalFactory'];

  function BaseAppsModal(BaseAppsApi, ModalFactory) {
    var service    = {};

    service.activate = activate;
    service.deactivate = deactivate;
    service.newModal = newModal;

    return service;

    //target should be element ID
    function activate(target) {
      BaseAppsApi.publish(target, 'show');
    }

    //target should be element ID
    function deactivate(target) {
      BaseAppsApi.publish(target, 'hide');
    }

    //new modal has to be controlled via the new instance
    function newModal(config) {
      return new ModalFactory(config);
    }
  }

  modalDirective.$inject = ['$timeout', 'BaseAppsApi'];

  function modalDirective($timeout, BaseAppsApi) {

    var directive = {
      restrict: 'EA',
      templateUrl: 'components/modal/modal.html',
      transclude: true,
      scope: true,
      replace: true,
      compile: compile
    };

    return directive;

    function compile(tElement, tAttrs, transclude) {
      var type = 'modal';

      return {
        pre: preLink,
        post: postLink
      };

      function preLink(scope, iElement, iAttrs, controller) {
          iAttrs.$set('ba-closable', type);
      }

      function postLink(scope, element, attrs) {
        var dialog = angular.element(element.children()[0]);
        var animateFn = attrs.hasOwnProperty('baAdvise') ? BaseAppsApi.animateAndAdvise : BaseAppsApi.animate;

        scope.active = false;
        scope.overlay = attrs.overlay === 'false' ? false : true;
        scope.destroyOnClose = attrs.destroyOnClose === 'true' ? true : false;
        scope.overlayClose = attrs.overlayClose === 'false' ? false : true;

        var animationIn = attrs.animationIn || 'fadeIn';
        var animationOut = attrs.animationOut || 'fadeOut';

        var overlayIn = 'fadeIn';
        var overlayOut = 'fadeOut';

        scope.hideOverlay = function($event) {
          if($event.target.id == attrs.id && scope.overlayClose) {
            BaseAppsApi.publish(attrs.id, 'close');
          }
        };

        scope.hide = function() {
          if (scope.active) {
            scope.active = false;
            adviseActiveChanged();

            if (scope.destroyOnClose) {
              animate().then(function() {
                element.remove();
                scope.$destroy();
              });
            } else {
              animate();
            }
          } else {
            if (scope.destroyOnClose) {
              $timeout(function() {
                element.remove();
                scope.$destroy();
              }, 0, false);
            }
          }
          return;
        };

        scope.show = function() {
          if (!scope.active) {
            scope.active = true;
            adviseActiveChanged();
            animate();
            dialog.tabIndex = -1;
            dialog[0].focus();
          }
          return;
        };

        scope.toggle = function() {
          scope.active = !scope.active;
          adviseActiveChanged();
          animate();
          return;
        };

        scope.$on("$destroy", function() {
          BaseAppsApi.unsubscribe(attrs.id);
        });

        //setup
        BaseAppsApi.subscribe(attrs.id, function(msg) {
          if(msg === 'show' || msg === 'open') {
            scope.show();
          } else if (msg === 'close' || msg === 'hide') {
            scope.hide();
          } else if (msg === 'toggle') {
            scope.toggle();
          }

          if (scope.$root && !scope.$root.$$phase) {
            scope.$apply();
          }

          return;
        });

        function adviseActiveChanged() {
          if (!angular.isUndefined(attrs.baAdvise)) {
            BaseAppsApi.publish(attrs.id, scope.active ? 'activated' : 'deactivated');
          }
        }

        function animate() {
          //animate both overlay and dialog
          if(!scope.overlay) {
            element.css('background', 'transparent');
          }

          // work around for modal animations
          // due to a bug where the overlay fadeIn is essentially covering up
          // the dialog's animation
          if (!scope.active) {
            BaseAppsApi.animate(element, scope.active, overlayIn, overlayOut);
          }
          else {
            element.addClass('is-active');
          }

          return animateFn(dialog, scope.active, animationIn, animationOut);
        }
      }
    }
  }

  ModalFactory.$inject = ['$http', '$templateCache', '$rootScope', '$compile', '$timeout', '$q', 'BaseAppsApi'];

  function ModalFactory($http, $templateCache, $rootScope, $compile, $timeout, $q, BaseAppsApi) {
    return modalFactory;

    function modalFactory(config) {
      var self = this, //for prototype functions
          container = angular.element(config.container || document.body),
          id = config.id || BaseAppsApi.generateUuid(),
          attached = false,
          destroyed = false,
          activated = false,
          html,
          element,
          fetched,
          scope,
          contentScope
      ;

      var props = [
        'animationIn',
        'animationOut',
        'overlay',
        'overlayClose',
        'destroyOnClose',
        'ignoreAllClose',
        'advise',
        'class'
      ];

      if(config.templateUrl) {
        //get template
        fetched = $http.get(config.templateUrl, {
          cache: $templateCache
        }).then(function (response) {
          html = response.data;
          assembleDirective();
        });

      } else if(config.template) {
        //use provided template
        fetched = true;
        html = config.template;
        assembleDirective();
      }

      self.isActive = isActive;
      self.activate = activate;
      self.deactivate = deactivate;
      self.toggle = toggle;
      self.destroy = destroy;

      return {
        isActive: isActive,
        activate: activate,
        deactivate: deactivate,
        toggle: toggle,
        destroy: destroy
      };

      function checkStatus() {
        if(destroyed) {
          throw "Error: Modal was destroyed. Delete the object and create a new ModalFactory instance."
        }
      }

      function isActive() {
        return !destroyed && scope && activated;
      }

      function activate() {
        checkStatus();
        $timeout(function() {
          activated = true;
          init('show');
        }, 0, false);
      }

      function deactivate() {
        checkStatus();
        $timeout(function() {
          activated = false;
          init('hide');
        }, 0, false);
      }

      function toggle() {
        checkStatus();
        $timeout(function() {
          activated = !activated;
          init('toggle');
        }, 0, false);
      }

      function init(msg) {
        $q.when(fetched).then(function() {
          var delayMsg = false;

          if(!attached && html.length > 0) {
            container.append(element);
            $compile(element)(scope);
            attached = true;

            // delay message so directive can be compiled and respond to messages
            delayMsg = true;
          }

          if (delayMsg) {
            $timeout(function() {
              BaseAppsApi.publish(id, msg);
            }, 0, false);
          } else {
            BaseAppsApi.publish(id, msg);
          }
        });
      }

      function assembleDirective() {
        // check for duplicate elements to prevent factory from cloning modals
        if (document.getElementById(id)) {
          return;
        }

        html = '<ba-modal id="' + id + '">' + html + '</ba-modal>';

        element = angular.element(html);

        scope = $rootScope.$new();

        // account for directive attributes and modal classes
        for(var i = 0; i < props.length; i++) {
          var prop = props[i];

          if(angular.isDefined(config[prop])) {
            switch (prop) {
              case 'animationIn':
                element.attr('animation-in', config[prop]);
                break;
              case 'animationOut':
                element.attr('animation-out', config[prop]);
                break;
              case 'overlayClose':
                // must be string, see postLink() above
                element.attr('overlay-close', (config[prop] === 'false' || config[prop] === false) ? 'false' : 'true');
                break;
              case 'destroyOnClose':
                // must be string, see postLink() above
                element.attr('destroy-on-close', (config[prop] === 'true' || config[prop] === true) ? 'true' : 'false');
                break;
              case 'ignoreAllClose':
                element.attr('ba-ignore-all-close', 'ba-ignore-all-close');
                break;
              case 'advise':
                element.attr('ba-advise', 'ba-advise');
                break;
              case 'class':
                if (angular.isString(config[prop])) {
                  config[prop].split(' ').forEach(function(klass) {
                    element.addClass(klass);
                  });
                } else if (angular.isArray(config[prop])) {
                  config[prop].forEach(function(klass) {
                    element.addClass(klass);
                  });
                }
                break;
              default:
                element.attr(prop, config[prop]);
                break;
            }
          }
        }
        // access view scope variables
        if (config.contentScope) {
          contentScope = config.contentScope;
          for (var prop in config.contentScope) {
            if (config.contentScope.hasOwnProperty(prop)) {
              scope[prop] = config.contentScope[prop];
            }
          }
        }
      }

      function destroy() {
        self.deactivate();
        $timeout(function() {
          scope.$destroy();
          element.remove();
          destroyed = true;
        }, 0, false);
        BaseAppsApi.unsubscribe(id);
      }

    }

  }

  ConfirmModal.$inject = ['$timeout', 'ModalFactory'];

  function ConfirmModal($timeout, ModalFactory) {
    var ConfirmModal = function(config) {
      var modal = this;

      ModalFactory.call(this, {
        'class': 'tiny dialog confirm-modal',
        'overlay': true,
        'overlayClose': false,
        'destroyOnClose': true,
        'templateUrl': 'components/modal/modal-confirm.html',
        'contentScope': {
          title: config.title,
          content: config.content,
          enterText: config.enterText || "Enter",
          cancelText: config.cancelText || "Cancel",
          enterFirst: angular.isDefined(config.enterFirst) ? config.enterFirst : true,
          enter: function() {
            if (config.enterCallback) {
              config.enterCallback();
            }
            modal.deactivate();
          },
          cancel: function() {
            if (config.cancelCallback) {
              config.cancelCallback();
            }
            modal.deactivate();
          }
        }
      });

      modal.activate();
    }

    ConfirmModal.prototype = Object.create(ModalFactory.prototype);

    return ConfirmModal;
  }

  PromptModal.$inject = ['$timeout', 'ModalFactory'];

  function PromptModal($timeout, ModalFactory) {
    var PromptModal = function(config) {
      var modal = this;
      var data = {};

      ModalFactory.call(this, {
        'class': 'tiny dialog prompt-modal',
        'overlay': true,
        'overlayClose': false,
        'destroyOnClose': true,
        'templateUrl': 'components/modal/modal-prompt.html',
        'contentScope': {
          title: config.title,
          content: config.content,
          data: data,
          inputType: config.inputType || "text",
          enterText: config.enterText || "Enter",
          cancelText: config.cancelText || "Cancel",
          enterFirst: angular.isDefined(config.enterFirst) ? config.enterFirst : true,
          enter: function() {
            if (!config.requireInput || (angular.isDefined(data.value) && data.value !== "")) {
              if (config.enterCallback) {
                config.enterCallback(data.value);
              }
              modal.deactivate();
            }
          },
          cancel: function() {
            if (config.cancelCallback) {
              config.cancelCallback();
            }
            modal.deactivate();
          }
        }
      });

      modal.activate();
    }

    PromptModal.prototype = Object.create(ModalFactory.prototype);

    return PromptModal;
  }

})();

(function() {
  'use strict';

  angular.module('base.notification', ['base.core'])
    .controller('baNotificationController', baNotificationController)
    .directive('baNotificationSet', baNotificationSet)
    .directive('baNotification', baNotification)
    .directive('baNotificationStatic', baNotificationStatic)
    .directive('baNotify', baNotify)
    .factory('NotificationFactory', NotificationFactory)
    .service('BaseAppsNotification', BaseAppsNotification)
  ;

  BaseAppsNotification.$inject = ['BaseAppsApi', 'NotificationFactory'];

  function BaseAppsNotification(BaseAppsApi, NotificationFactory) {
    var service    = {};

    service.activate = activate;
    service.deactivate = deactivate;

    return service;

    //target should be element ID
    function activate(target) {
      BaseAppsApi.publish(target, 'show');
    }

    //target should be element ID
    function deactivate(target) {
      BaseAppsApi.publish(target, 'hide');
    }

    function toggle(target) {
      BaseAppsApi.publish(target, 'toggle');
    }

    function createNotificationSet(config) {
      return new NotificationFactory(config);
    }
  }


  baNotificationController.$inject = ['$scope', 'BaseAppsApi'];

  function baNotificationController($scope, BaseAppsApi) {
    var controller    = this;
    controller.notifications = $scope.notifications = $scope.notifications || [];

    controller.addNotification = function(info) {
      var id  = BaseAppsApi.generateUuid();
      info.id = id;
      $scope.notifications.push(info);
    };

    controller.removeNotification = function(id) {
      $scope.notifications.forEach(function(notification) {
        if(notification.id === id) {
          var ind = $scope.notifications.indexOf(notification);
          $scope.notifications.splice(ind, 1);
        }
      });
    };

    controller.clearAll = function() {
      while($scope.notifications.length > 0) {
        $scope.notifications.pop();
      }
    };
  }

  baNotificationSet.$inject = ['BaseAppsApi'];

  function baNotificationSet(BaseAppsApi) {
    var directive = {
      restrict: 'EA',
      templateUrl: 'components/notification/notification-set.html',
      controller: 'baNotificationController',
      replace: true,
      scope: {
        position: '@'
      },
      link: link
    };

    return directive;

    function link(scope, element, attrs, controller) {
      scope.position = scope.position ? scope.position.split(' ').join('-') : 'default-position';

      scope.$on("$destroy", function() {
        BaseAppsApi.unsubscribe(attrs.id);
      });

      BaseAppsApi.subscribe(attrs.id, function(msg) {
        if(msg === 'clearall') {
          controller.clearAll();
        }
        else {
          controller.addNotification(msg);
          if (!scope.$root.$$phase) {
            scope.$apply();
          }
        }
      });
    }
  }

  baNotification.$inject = ['BaseAppsApi', '$sce'];

  function baNotification(BaseAppsApi, $sce) {
    var directive = {
      restrict: 'EA',
      templateUrl: 'components/notification/notification.html',
      replace: true,
      transclude: true,
      require: '^baNotificationSet',
      controller: function() { },
      scope: {
        title: '=?',
        content: '=?',
        image: '=?',
        notifId: '=',
        color: '=?',
        autoclose: '=?'
      },
      compile: compile
    };

    return directive;

    function compile() {

      return {
        pre: preLink,
        post: postLink
      };

      function preLink(scope, iElement, iAttrs) {
        iAttrs.$set('ba-closable', 'notification');
        if (iAttrs['title']) {
          scope.$watch('title', function(value) {
            if (value) {
              scope.trustedTitle = $sce.trustAsHtml(value);
            }
          });
        }
      }

      function postLink(scope, element, attrs, controller) {
        scope.active = false;
        var animationIn  = attrs.animationIn || 'fadeIn';
        var animationOut = attrs.animationOut || 'fadeOut';
        var animate = attrs.hasOwnProperty('baAdvise') ? BaseAppsApi.animateAndAdvise : BaseAppsApi.animate;
        var hammerElem;

        //due to dynamic insertion of DOM, we need to wait for it to show up and get working!
        setTimeout(function() {
          scope.active = true;
          adviseActiveChanged();
          animate(element, scope.active, animationIn, animationOut);
        }, 50);

        scope.hide = function() {
          scope.active = false;
          adviseActiveChanged();
          animate(element, scope.active, animationIn, animationOut);
          setTimeout(function() {
            controller.removeNotification(scope.notifId);
          }, 50);
        };

        // close if autoclose
        if (scope.autoclose) {
          setTimeout(function() {
            if (scope.active) {
              scope.hide();
            }
          }, parseInt(scope.autoclose));
        };

        // close on swipe
        if (typeof(Hammer) !== 'undefined') {
          hammerElem = new Hammer(element[0]);
          // set the options for swipe (to make them a bit more forgiving in detection)
          hammerElem.get('swipe').set({
            direction: Hammer.DIRECTION_ALL,
            threshold: 5, // this is how far the swipe has to travel
            velocity: 0.5 // and this is how fast the swipe must travel
          });
        }
        if(typeof(hammerElem) !== 'undefined') {
          hammerElem.on('swipe', function() {
            if (scope.active) {
              scope.hide();
            }
          });
        }

        function adviseActiveChanged() {
          if (!angular.isUndefined(attrs.baAdvise)) {
            BaseAppsApi.publish(attrs.id, scope.active ? 'activated' : 'deactivated');
          }
        }
      }
    }
  }

  baNotificationStatic.$inject = ['BaseAppsApi', '$sce'];

  function baNotificationStatic(BaseAppsApi, $sce) {
    var directive = {
      restrict: 'EA',
      templateUrl: 'components/notification/notification-static.html',
      replace: true,
      transclude: true,
      scope: {
        title: '@?',
        content: '@?',
        image: '@?',
        color: '@?',
        autoclose: '@?'
      },
      compile: compile
    };

    return directive;

    function compile() {
      var type = 'notification';

      return {
        pre: preLink,
        post: postLink
      };

      function preLink(scope, iElement, iAttrs, controller) {
        iAttrs.$set('ba-closable', type);
        if (iAttrs['title']) {
          scope.trustedTitle = $sce.trustAsHtml(iAttrs['title']);
        }
      }

      function postLink(scope, element, attrs, controller) {
        scope.position = attrs.position ? attrs.position.split(' ').join('-') : 'default-position';

        var animationIn = attrs.animationIn || 'fadeIn';
        var animationOut = attrs.animationOut || 'fadeOut';
        var animateFn = attrs.hasOwnProperty('baAdvise') ? BaseAppsApi.animateAndAdvise : BaseAppsApi.animate;

        scope.$on("$destroy", function() {
          BaseAppsApi.unsubscribe(attrs.id);
        });

        //setup
        BaseAppsApi.subscribe(attrs.id, function(msg) {
          if(msg == 'show' || msg == 'open') {
            scope.show();
            // close if autoclose
            if (scope.autoclose) {
              setTimeout(function() {
                if (scope.active) {
                  scope.hide();
                }
              }, parseInt(scope.autoclose));
            };
          } else if (msg == 'close' || msg == 'hide') {
            scope.hide();
          } else if (msg == 'toggle') {
            scope.toggle();
            // close if autoclose
            if (scope.autoclose) {
              setTimeout(function() {
                if (scope.active) {
                  scope.toggle();
                }
              }, parseInt(scope.autoclose));
            }
          }
          return;
        });

        scope.hide = function() {
          if (scope.active) {
            scope.active = false;
            adviseActiveChanged();
            animateFn(element, scope.active, animationIn, animationOut);
          }
          return;
        };

        scope.show = function() {
          if (!scope.active) {
            scope.active = true;
            adviseActiveChanged();
            animateFn(element, scope.active, animationIn, animationOut);
          }
          return;
        };

        scope.toggle = function() {
          scope.active = !scope.active;
          adviseActiveChanged();
          animateFn(element, scope.active, animationIn, animationOut);
          return;
        };

        function adviseActiveChanged() {
          if (!angular.isUndefined(attrs.baAdvise)) {
            BaseAppsApi.publish(attrs.id, scope.active ? 'activated' : 'deactivated');
          }
        }
      }
    }
  }

  baNotify.$inject = ['BaseAppsApi'];

  function baNotify(BaseAppsApi) {
    var directive = {
      restrict: 'A',
      scope: {
        title: '@?',
        content: '@?',
        color: '@?',
        image: '@?',
        autoclose: '@?'
      },
      link: link
    };

    return directive;

    function link(scope, element, attrs, controller) {
      element.on('click', function(e) {
        BaseAppsApi.publish(attrs.baNotify, {
          title: scope.title,
          content: scope.content,
          color: scope.color,
          image: scope.image,
          autoclose: scope.autoclose
        });
        e.preventDefault();
      });
    }
  }

  NotificationFactory.$inject = ['$http', '$templateCache', '$rootScope', '$compile', '$timeout', 'BaseAppsApi', '$sce'];

  function NotificationFactory($http, $templateCache, $rootScope, $compile, $timeout, BaseAppsApi, $sce) {
    return notificationFactory;

    function notificationFactory(config) {
      var self = this, //for prototype functions
          container = angular.element(config.container || document.body),
          id = config.id || BaseAppsApi.generateUuid(),
          attached = false,
          destroyed = false,
          html,
          element,
          scope,
          contentScope
      ;

      var props = [
        'position'
      ];

      assembleDirective();

      self.addNotification = addNotification;
      self.clearAll = clearAll;
      self.destroy = destroy;

      return {
        addNotification: addNotification,
        clearAll: clearAll,
        destroy: destroy
      };

      function checkStatus() {
        if(destroyed) {
          throw "Error: Notification Set was destroyed. Delete the object and create a new NotificationFactory instance."
        }
      }

      function addNotification(notification) {
        checkStatus();
        $timeout(function() {
          BaseAppsApi.publish(id, notification);
        }, 0, false);
      }

      function clearAll() {
        checkStatus();
        $timeout(function() {
          BaseAppsApi.publish(id, 'clearall');
        }, 0, false);
      }

      function init(state) {
        if(!attached && html.length > 0) {
          var modalEl = container.append(element);

          scope.active = state;
          $compile(element)(scope);

          attached = true;
        }
      }

      function assembleDirective() {
        // check for duplicate element to prevent factory from cloning notification sets
        if (document.getElementById(id)) {
          return;
        }
        html = '<ba-notification-set id="' + id + '"></ba-notification-set>';

        element = angular.element(html);

        scope = $rootScope.$new();

        for(var i = 0; i < props.length; i++) {
          if(config[props[i]]) {
            element.attr(props[i], config[props[i]]);
          }
        }

        // access view scope variables
        if (config.contentScope) {
          contentScope = config.contentScope;
          for (var prop in contentScope) {
            if (contentScope.hasOwnProperty(prop)) {
              scope[prop] = contentScope[prop];
            }
          }
        }
        init(true);
      }

      function destroy() {
        self.clearAll();
        setTimeout(function() {
          scope.$destroy();
          element.remove();
          destroyed = true;
        }, 3000);
        BaseAppsApi.unsubscribe(id);
      }

    }

  }
})();

(function() {
  'use strict';

  angular.module('base.offcanvas', ['base.core'])
    .directive('baOffcanvas', baOffcanvas)
    .service('BaseAppsOffcanvas', BaseAppsOffcanvas)
  ;

  BaseAppsOffcanvas.$inject = ['BaseAppsApi'];

  function BaseAppsOffcanvas(BaseAppsApi) {
    var service    = {};

    service.activate = activate;
    service.deactivate = deactivate;

    return service;

    //target should be element ID
    function activate(target) {
      BaseAppsApi.publish(target, 'show');
    }

    //target should be element ID
    function deactivate(target) {
      BaseAppsApi.publish(target, 'hide');
    }

    function toggle(target) {
      BaseAppsApi.publish(target, 'toggle');
    }
  }

  baOffcanvas.$inject = ['BaseAppsApi'];

  function baOffcanvas(BaseAppsApi) {
    var directive = {
      restrict: 'EA',
      templateUrl: 'components/offcanvas/offcanvas.html',
      transclude: true,
      scope: {
        position: '@'
      },
      replace: true,
      compile: compile
    };

    return directive;

    function compile(tElement, tAttrs, transclude) {
      var type = 'offcanvas';

      return {
        pre: preLink,
        post: postLink
      };

      function preLink(scope, iElement, iAttrs, controller) {
        iAttrs.$set('ba-closable', type);
        document.body.classList.add('has-off-canvas');
      }

      function postLink(scope, element, attrs) {
        scope.position = scope.position || 'left';
        scope.active = false;

        scope.$on("$destroy", function() {
          BaseAppsApi.unsubscribe(attrs.id);
        });

        //setup
        BaseAppsApi.subscribe(attrs.id, function(msg) {
          if(msg === 'show' || msg === 'open') {
            scope.show();
          } else if (msg === 'close' || msg === 'hide') {
            scope.hide();
          } else if (msg === 'toggle') {
            scope.toggle();
          }

          if (!scope.$root.$$phase) {
            scope.$apply();
          }

          return;
        });

        scope.hide = function() {
          scope.active = false;
          adviseActiveChanged();
          return;
        };

        scope.show = function() {
          scope.active = true;
          adviseActiveChanged();
          return;
        };

        scope.toggle = function() {
          scope.active = !scope.active;
          adviseActiveChanged();
          return;
        };

        function adviseActiveChanged() {
          if (!angular.isUndefined(attrs.baAdvise)) {
            BaseAppsApi.publish(attrs.id, scope.active ? 'activated' : 'deactivated');
          }
        }
      }
    }
  }

})();

(function() {
  'use strict';

  angular.module('base.panel', ['base.core'])
    .directive('baPanel', baPanel)
    .service('BaseAppsPanel', BaseAppsPanel)
  ;

  BaseAppsPanel.$inject = ['BaseAppsApi'];

  function BaseAppsPanel(BaseAppsApi) {
    var service    = {};

    service.activate = activate;
    service.deactivate = deactivate;

    return service;

    //target should be element ID
    function activate(target) {
      BaseAppsApi.publish(target, 'show');
    }

    //target should be element ID
    function deactivate(target) {
      BaseAppsApi.publish(target, 'hide');
    }
  }

  baPanel.$inject = ['BaseAppsApi', '$window'];

  function baPanel(BaseAppsApi, $window) {
    var directive = {
      restrict: 'EA',
      templateUrl: 'components/panel/panel.html',
      transclude: true,
      scope: {
        position: '@?'
      },
      replace: true,
      compile: compile
    };

    return directive;

    function compile(tElement, tAttrs, transclude) {
      var type = 'panel';
      var animate = tAttrs.hasOwnProperty('baAdvise') ? BaseAppsApi.animateAndAdvise : BaseAppsApi.animate;
      var forceAnimation = tAttrs.hasOwnProperty('forceAnimation');

      return {
        pre: preLink,
        post: postLink
      };

      function preLink(scope, iElement, iAttrs, controller) {
        iAttrs.$set('ba-closable', type);
        scope.position = scope.position || 'left';
        scope.positionClass = 'panel-' + scope.position;
      }

      function postLink(scope, element, attrs) {
        scope.active = false;
        var animationIn, animationOut;
        var globalQueries = BaseAppsApi.getSettings().mediaQueries;
        var setAnim = {
          left: function(){
            animationIn  = attrs.animationIn || 'slideInRight';
            animationOut = attrs.animationOut || 'slideOutLeft';
          },
          right: function(){
            animationIn  = attrs.animationIn || 'slideInLeft';
            animationOut = attrs.animationOut || 'slideOutRight';
          },
          top: function(){
            animationIn  = attrs.animationIn || 'slideInDown';
            animationOut = attrs.animationOut || 'slideOutUp';
          },
          bottom: function(){
            animationIn  = attrs.animationIn || 'slideInUp';
            animationOut = attrs.animationOut || 'slideOutDown';
          }
        };
        setAnim[scope.position]();
        //urgh, there must be a better way, ***there totally is btw***
        // if(scope.position === 'left') {
        //   animationIn  = attrs.animationIn || 'slideInRight';
        //   animationOut = attrs.animationOut || 'slideOutLeft';
        // } else if (scope.position === 'right') {
        //   animationIn  = attrs.animationIn || 'slideInLeft';
        //   animationOut = attrs.animationOut || 'slideOutRight';
        // } else if (scope.position === 'top') {
        //   animationIn  = attrs.animationIn || 'slideInDown';
        //   animationOut = attrs.animationOut || 'slideOutUp';
        // } else if (scope.position === 'bottom') {
        //   animationIn  = attrs.animationIn || 'slideInUp';
        //   animationOut = attrs.animationOut || 'slideOutDown';
        // }

        scope.$on("$destroy", function() {
          BaseAppsApi.unsubscribe(attrs.id);
        });

        //setup
        BaseAppsApi.subscribe(attrs.id, function(msg) {
          var panelPosition = $window.getComputedStyle(element[0]).getPropertyValue("position");

          if (!forceAnimation) {
            // patch to prevent panel animation on larger screen devices
            // don't run animation on grid elements, only panel
            if (panelPosition == 'static' || panelPosition == 'relative') {
              return;
            }
          }

          if(msg == 'show' || msg == 'open') {
            scope.show();
          } else if (msg == 'close' || msg == 'hide') {
            scope.hide();
          } else if (msg == 'toggle') {
            scope.toggle();
          }

          if (!scope.$root.$$phase) {
            scope.$apply();
          }

          return;
        });

        scope.hide = function() {
          if(scope.active){
            scope.active = false;
            adviseActiveChanged();
            animate(element, scope.active, animationIn, animationOut);
          }

          return;
        };

        scope.show = function() {
          if(!scope.active){
            scope.active = true;
            adviseActiveChanged();
            animate(element, scope.active, animationIn, animationOut);
          }

          return;
        };

        scope.toggle = function() {
          scope.active = !scope.active;
          adviseActiveChanged();
          animate(element, scope.active, animationIn, animationOut);
          return;
        };

        element.on('click', function(e) {
          // Check sizing
          var srcEl = e.target;

          if (!matchMedia(globalQueries.medium).matches && srcEl.href && srcEl.href.length > 0) {
            // Hide element if it can't match at least medium
            scope.hide();
          }
        });

        function adviseActiveChanged() {
          if (!angular.isUndefined(attrs.baAdvise)) {
            BaseAppsApi.publish(attrs.id, scope.active ? 'activated' : 'deactivated');
          }
        }
      }
    }
  }

})();

(function() {
  'use strict';

  angular.module('base.popup', ['base.core'])
    .directive('baPopup', baPopup)
    .directive('baPopupToggle', baPopupToggle)
    .service('BaseAppsPopup', BaseAppsPopup)
  ;

  BaseAppsPopup.$inject = ['BaseAppsApi'];

  function BaseAppsPopup(BaseAppsApi) {
    var service    = {};

    service.activate = activate;
    service.deactivate = deactivate;

    return service;

    //target should be element ID
    function activate(target) {
      BaseAppsApi.publish(target, ['show']);
    }

    //target should be element ID
    function deactivate(target) {
      BaseAppsApi.publish(target, ['hide']);
    }

    function toggle(target, popupTarget) {
      BaseAppsApi.publish(target, ['toggle', popupTarget]);
    }
  }

  baPopup.$inject = ['BaseAppsApi'];

  function baPopup(BaseAppsApi) {
    var directive = {
      restrict: 'EA',
      transclude: true,
      replace: true,
      templateUrl: 'components/popup/popup.html',
      scope: {
        pinTo: '@?',
        pinAt: '@?',
        target: '@?'
      },
      compile: compile
    };

    return directive;

    function compile() {
      return {
        pre: preLink,
        post: postLink
      };

      function preLink(scope, iElement, iAttrs) {
        iAttrs.$set('ba-closable', 'popup');
      }

      function postLink(scope, element, attrs) {
        scope.active = false;
        scope.target = scope.target || false;

        var attachment = scope.pinTo || 'top center';
        var targetAttachment = scope.pinAt || 'bottom center';
        var tetherInit = false;
        var tether     = {};

        //setup
        BaseAppsApi.subscribe(attrs.id, function(msg) {
          if(msg[0] === 'show' || msg[0] === 'open') {
            scope.show(msg[1]);
          } else if (msg[0] === 'close' || msg[0] === 'hide') {
            scope.hide();
          } else if (msg[0] === 'toggle') {
            scope.toggle(msg[1]);
          }

          scope.$apply();

          return;
        });


        scope.hide = function() {
          if (scope.active) {
            scope.active = false;
            adviseActiveChanged();
            tetherElement();
            tether.disable();
          }

          return;
        };

        scope.show = function(newTarget) {
          if (!scope.active) {
            scope.active = true;
            adviseActiveChanged();
            tetherElement(newTarget);
            tether.enable();
          }

          return;
        };

        scope.toggle = function(newTarget) {
          scope.active = !scope.active;
          adviseActiveChanged();
          tetherElement(newTarget);

          if(scope.active) {
            tether.enable();
          } else  {
            tether.disable();
          }

          return;
        };

        scope.$on('$destroy', function() {
          BaseAppsApi.unsubscribe(attrs.id);

          scope.active = false;
          if(tetherInit) {
            tether.destroy();
            element.remove();
            tetherInit = false;
          }
        });

        function tetherElement(target) {
          if(tetherInit) {
            return;
          }

          scope.target = scope.target ? document.getElementById(scope.target) : document.getElementById(target);

          tether = new Tether({
            element: element[0],
            target: scope.target,
            attachment: attachment,
            targetAttachment: targetAttachment,
            enable: false
          });

          tetherInit = true;
        }

        function adviseActiveChanged() {
          if (!angular.isUndefined(attrs.baAdvise)) {
            BaseAppsApi.publish(attrs.id, scope.active ? 'activated' : 'deactivated');
          }
        }
      }
    }
  }

  baPopupToggle.$inject = ['BaseAppsApi'];

  function baPopupToggle(BaseAppsApi) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      var target = attrs.baPopupToggle;
      var id = attrs.id || BaseAppsApi.generateUuid();
      attrs.$set('id', id);

      element.on('click', function(e) {
        BaseAppsApi.publish(target, ['toggle', id]);
        e.preventDefault();
      });
    }
  }

})();

(function() {
  'use strict';

  angular.module('base.tabs', ['base.core'])
    .controller('baTabsController', baTabsController)
    .directive('baTabs', baTabs)
    .directive('baTabContent', baTabContent)
    .directive('baTab', baTab)
    .directive('baTabIndividual', baTabIndividual)
    .directive('baTabHref', baTabHref)
    .directive('baTabCustom', baTabCustom)
    .directive('baTabContentCustom', baTabContentCustom)
    .service('BaseAppsTabs', BaseAppsTabs)
  ;

  BaseAppsTabs.$inject = ['BaseAppsApi'];

  function BaseAppsTabs(BaseAppsApi) {
    var service    = {};

    service.activate = activate;

    return service;

    //target should be element ID
    function activate(target) {
      BaseAppsApi.publish(target, 'show');
    }

  }

  baTabsController.$inject = ['$scope', 'BaseAppsApi'];

  function baTabsController($scope, BaseAppsApi) {
    var controller  = this;
    var tabs        = controller.tabs = $scope.tabs = [];
    var id          = '';
    var autoOpen    = true;
    var collapsible = false;

    controller.select = function(selectTab) {
      tabs.forEach(function(tab) {
        if(tab.scope === selectTab) {
          if (collapsible) {
            tab.active = !tab.active;
            tab.scope.active = !tab.scope.active;
          } else {
            tab.active = true;
            tab.scope.active = true;
          }

          if (tab.active) {
            BaseAppsApi.publish(id, ['activate', tab.scope.id]);
          } else {
            BaseAppsApi.publish(id, ['deactivate', tab.scope.id]);
          }
        } else {
          tab.active = false;
          tab.scope.active = false;
        }
      });
    };

    controller.addTab = function addTab(tabScope) {
      tabs.push({ scope: tabScope, active: false, parentContent: controller.id });

      if(tabs.length === 1 && autoOpen) {
        tabs[0].active = true;
        tabScope.active = true;
      }
    };

    controller.getId = function() {
      return id;
    };

    controller.setId = function(newId) {
      id = newId;
    };

    controller.setAutoOpen = function(val) {
      autoOpen = val;
    };

    controller.setCollapsible = function(val) {
      collapsible = val;
    };
  }

  baTabs.$inject = ['BaseAppsApi'];

  function baTabs(BaseAppsApi) {
    var directive = {
      restrict: 'EA',
      transclude: 'true',
      replace: true,
      templateUrl: 'components/tabs/tabs.html',
      controller: 'baTabsController',
      scope: {
        displaced: '@?'
      },
      link: link
    };

    return directive;

    function link(scope, element, attrs, controller) {
      scope.id = attrs.id || BaseAppsApi.generateUuid();
      scope.showTabContent = scope.displaced !== 'true';
      attrs.$set('id', scope.id);
      controller.setId(scope.id);
      controller.setAutoOpen(attrs.autoOpen !== "false");
      controller.setCollapsible(attrs.collapsible === "true");

      //update tabs in case tab-content doesn't have them
      var updateTabs = function() {
        BaseAppsApi.publish(scope.id + '-tabs', scope.tabs);
      };

      BaseAppsApi.subscribe(scope.id + '-get-tabs', function() {
        updateTabs();
      });

      scope.$on("$destroy", function() {
        BaseAppsApi.unsubscribe(scope.id + '-get-tabs');
      });
    }
  }

  baTabContent.$inject = ['BaseAppsApi'];

  function baTabContent(BaseAppsApi) {
    var directive = {
      restrict: 'A',
      transclude: 'true',
      replace: true,
      scope: {
        tabs: '=?',
        target: '@'
      },
      templateUrl: 'components/tabs/tab-content.html',
      link: link
    };

    return directive;

    function link(scope, element, attrs, controller) {
      scope.tabs = scope.tabs || [];
      var id = scope.target;

      BaseAppsApi.subscribe(id, function(msg) {
        if(msg[0] === 'activate') {
          scope.tabs.forEach(function (tab) {
            tab.scope.active = false;
            tab.active = false;

            if(tab.scope.id == msg[1]) {
              tab.scope.active = true;
              tab.active = true;
            }
          });
        } else if (msg[0] === 'deactivate') {
          scope.tabs.forEach(function (tab) {
            tab.scope.active = false;
            tab.active = false;
          });
        }
      });

      //if tabs empty, request tabs
      if(scope.tabs.length === 0) {
        BaseAppsApi.subscribe(id + '-tabs', function(tabs) {
          scope.tabs = tabs;
        });

        BaseAppsApi.publish(id + '-get-tabs', '');
      }

      scope.$on("$destroy", function() {
        BaseAppsApi.unsubscribe(id);
        BaseAppsApi.unsubscribe(id + '-tabs');
      });
    }
  }

  baTab.$inject = ['BaseAppsApi'];

  function baTab(BaseAppsApi) {
    var directive = {
      restrict: 'EA',
      templateUrl: 'components/tabs/tab.html',
      transclude: true,
      scope: {
        title: '@'
      },
      require: '^baTabs',
      replace: true,
      link: link
    };

    return directive;

    function link(scope, element, attrs, controller, transclude) {
      scope.id = attrs.id || BaseAppsApi.generateUuid();
      scope.active = false;
      scope.transcludeFn = transclude;
      controller.addTab(scope);

      BaseAppsApi.subscribe(scope.id, function(msg) {
        if(msg === 'show' || msg === 'open' || msg === 'activate') {
          if (!scope.active) {
            controller.select(scope);
          }
        }

        if(msg === 'hide' || msg === 'close' || msg === 'deactivate') {
          if (scope.active) {
            controller.select(scope);
          }
        }

        if(msg === 'toggle') {
          controller.select(scope);
        }
      });

      scope.makeActive = function() {
        controller.select(scope);
      };

      scope.$on("$destroy", function() {
        BaseAppsApi.unsubscribe(scope.id);
      });
    }
  }

  baTabIndividual.$inject = ['BaseAppsApi'];

  function baTabIndividual(BaseAppsApi) {
    var directive = {
      restrict: 'EA',
      transclude: 'true',
      link: link
    };

    return directive;

    function link(scope, element, attrs, controller, transclude) {
      var tab = scope.$eval(attrs.tab);
      var id = tab.scope.id;

      tab.scope.transcludeFn(tab.scope, function(tabContent) {
        element.append(tabContent);
      });

      BaseAppsApi.subscribe(tab.scope.id, function(msg) {
        BaseAppsApi.publish(tab.parentContent, ['activate', tab.scope.id]);
        scope.$apply();
      });

      scope.$on("$destroy", function() {
        BaseAppsApi.unsubscribe(tab.scope.id);
      });
    }
  }

  //custom tabs

  baTabHref.$inject = ['BaseAppsApi'];

  function baTabHref(BaseAppsApi) {
    var directive = {
      restrict: 'A',
      replace: false,
      link: link
    }

    return directive;

    function link(scope, element, attrs, controller) {
      var target = attrs.baTabHref;

      BaseAppsApi.subscribe(target, function(msg) {
        if(msg === 'activate' || msg === 'show' || msg === 'open') {
          makeActive();
        }
      });


      element.on('click', function(e) {
        BaseAppsApi.publish(target, 'activate');
        makeActive();
        e.preventDefault();
      });

      function makeActive() {
        element.parent().children().removeClass('is-active');
        element.addClass('is-active');
      }
    }
  }

  baTabCustom.$inject = ['BaseAppsApi'];

  function baTabCustom(BaseAppsApi) {
    var directive = {
      restrict: 'A',
      replace: false,
      link: link
    };

    return directive;

    function link(scope, element, attrs, controller, transclude) {
      var children = element.children();
      angular.element(children[0]).addClass('is-active');
    }
  }

  baTabContentCustom.$inject = ['BaseAppsApi'];

  function baTabContentCustom(BaseAppsApi) {
    return {
      restrict: 'A',
      link: link
    };

    function link(scope, element, attrs) {
      var tabs = [];
      var children = element.children();

      angular.forEach(children, function(node) {
        if(node.id) {
          var tabId = node.id;
          tabs.push(tabId);
          BaseAppsApi.subscribe(tabId, function(msg) {
            if(msg === 'activate' || msg === 'show' || msg === 'open') {
              activateTabs(tabId);
            }
          });

          if(tabs.length === 1) {
            var el = angular.element(node);
            el.addClass('is-active');
          }
        }
      });

      function activateTabs(tabId) {
        var tabNodes = element.children();
        angular.forEach(tabNodes, function(node) {
          var el = angular.element(node);
          el.removeClass('is-active');
          if(el.attr('id') === tabId) {
            el.addClass('is-active');
          }
        });
      }
    }
  }

})();

angular.module('base').run(['$templateCache', function($templateCache) {
  $templateCache.put('components/accordion/accordion-item.html',
    '<div class="accordion-item" ng-class="{\'is-active\': active}">\n' +
    '  <div class="accordion-title" ng-click="activate()">{{ title }}</div>\n' +
    '  <div class="accordion-content" ng-transclude></div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('base').run(['$templateCache', function($templateCache) {
  $templateCache.put('components/accordion/accordion.html',
    '<div class="accordion" ng-transclude>\n' +
    '</div>\n' +
    '');
}]);

angular.module('base').run(['$templateCache', function($templateCache) {
  $templateCache.put('components/actionsheet/actionsheet-button.html',
    '<div>\n' +
    '  <a href=""\n' +
    '    class="button"\n' +
    '    ng-if="title.length > 0">{{ title }}</a>\n' +
    '  <div ng-transclude></div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('base').run(['$templateCache', function($templateCache) {
  $templateCache.put('components/actionsheet/actionsheet-content.html',
    '<div\n' +
    '  class="action-sheet {{ position }}"\n' +
    '  ng-class="{\'is-active\': active}"\n' +
    '  >\n' +
    '    <div\n' +
    '    ng-transclude>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('base').run(['$templateCache', function($templateCache) {
  $templateCache.put('components/actionsheet/actionsheet.html',
    '<div class="action-sheet-container"\n' +
    '  ng-transclude>\n' +
    '</div>\n' +
    '');
}]);

angular.module('base').run(['$templateCache', function($templateCache) {
  $templateCache.put('components/loader/spinkit-chasing-dots.html',
    '<div class="sk-loader sk-chasing-dots">\n' +
    '  <div class="sk-child"></div>\n' +
    '  <div class="sk-child"></div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('base').run(['$templateCache', function($templateCache) {
  $templateCache.put('components/loader/spinkit-circle.html',
    '<div class="sk-loader sk-circle">\n' +
    '  <div class="sk-circle1 sk-child"></div>\n' +
    '  <div class="sk-circle2 sk-child"></div>\n' +
    '  <div class="sk-circle3 sk-child"></div>\n' +
    '  <div class="sk-circle4 sk-child"></div>\n' +
    '  <div class="sk-circle5 sk-child"></div>\n' +
    '  <div class="sk-circle6 sk-child"></div>\n' +
    '  <div class="sk-circle7 sk-child"></div>\n' +
    '  <div class="sk-circle8 sk-child"></div>\n' +
    '  <div class="sk-circle9 sk-child"></div>\n' +
    '  <div class="sk-circle10 sk-child"></div>\n' +
    '  <div class="sk-circle11 sk-child"></div>\n' +
    '  <div class="sk-circle12 sk-child"></div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('base').run(['$templateCache', function($templateCache) {
  $templateCache.put('components/loader/spinkit-cube-grid.html',
    '<div class="sk-loader sk-cube-grid">\n' +
    '  <div class="sk-cube sk-cube1"></div>\n' +
    '  <div class="sk-cube sk-cube2"></div>\n' +
    '  <div class="sk-cube sk-cube3"></div>\n' +
    '  <div class="sk-cube sk-cube4"></div>\n' +
    '  <div class="sk-cube sk-cube5"></div>\n' +
    '  <div class="sk-cube sk-cube6"></div>\n' +
    '  <div class="sk-cube sk-cube7"></div>\n' +
    '  <div class="sk-cube sk-cube8"></div>\n' +
    '  <div class="sk-cube sk-cube9"></div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('base').run(['$templateCache', function($templateCache) {
  $templateCache.put('components/loader/spinkit-double-bounce.html',
    '<div class="sk-loader sk-double-bounce">\n' +
    '  <div class="sk-child"></div>\n' +
    '  <div class="sk-child"></div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('base').run(['$templateCache', function($templateCache) {
  $templateCache.put('components/loader/spinkit-fading-circle.html',
    '<div class="sk-loader sk-fading-circle">\n' +
    '  <div class="sk-circle1 sk-circle"></div>\n' +
    '  <div class="sk-circle2 sk-circle"></div>\n' +
    '  <div class="sk-circle3 sk-circle"></div>\n' +
    '  <div class="sk-circle4 sk-circle"></div>\n' +
    '  <div class="sk-circle5 sk-circle"></div>\n' +
    '  <div class="sk-circle6 sk-circle"></div>\n' +
    '  <div class="sk-circle7 sk-circle"></div>\n' +
    '  <div class="sk-circle8 sk-circle"></div>\n' +
    '  <div class="sk-circle9 sk-circle"></div>\n' +
    '  <div class="sk-circle10 sk-circle"></div>\n' +
    '  <div class="sk-circle11 sk-circle"></div>\n' +
    '  <div class="sk-circle12 sk-circle"></div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('base').run(['$templateCache', function($templateCache) {
  $templateCache.put('components/loader/spinkit-folding-cube.html',
    '<div class="sk-loader sk-folding-cube">\n' +
    '  <div class="sk-cube1 sk-cube"></div>\n' +
    '  <div class="sk-cube2 sk-cube"></div>\n' +
    '  <div class="sk-cube4 sk-cube"></div>\n' +
    '  <div class="sk-cube3 sk-cube"></div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('base').run(['$templateCache', function($templateCache) {
  $templateCache.put('components/loader/spinkit-pulse.html',
    '<div class="sk-loader sk-pulse"></div>\n' +
    '');
}]);

angular.module('base').run(['$templateCache', function($templateCache) {
  $templateCache.put('components/loader/spinkit-rotating-plane.html',
    '<div class="sk-loader sk-rotating-plane"></div>\n' +
    '');
}]);

angular.module('base').run(['$templateCache', function($templateCache) {
  $templateCache.put('components/loader/spinkit-solid-circle.html',
    '<div class="sk-loader sk-solid-circle">\n' +
    '  <div class="sk-child"></div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('base').run(['$templateCache', function($templateCache) {
  $templateCache.put('components/loader/spinkit-three-bounce.html',
    '<div class="sk-loader sk-three-bounce">\n' +
    '  <div class="sk-child sk-bounce1"></div>\n' +
    '  <div class="sk-child sk-bounce2"></div>\n' +
    '  <div class="sk-child sk-bounce3"></div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('base').run(['$templateCache', function($templateCache) {
  $templateCache.put('components/loader/spinkit-wandering-cubes.html',
    '<div class="sk-loader sk-wandering-cubes">\n' +
    '  <div class="sk-cube"></div>\n' +
    '  <div class="sk-cube"></div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('base').run(['$templateCache', function($templateCache) {
  $templateCache.put('components/loader/spinkit-wave.html',
    '<div class="sk-loader sk-wave">\n' +
    '  <div class="sk-rect sk-rect1"></div>\n' +
    '  <div class="sk-rect sk-rect2"></div>\n' +
    '  <div class="sk-rect sk-rect3"></div>\n' +
    '  <div class="sk-rect sk-rect4"></div>\n' +
    '  <div class="sk-rect sk-rect5"></div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('base').run(['$templateCache', function($templateCache) {
  $templateCache.put('components/modal/modal-confirm.html',
    '<h1 ng-show="title">{{ title }}</h1>\n' +
    '<p ng-show="content">{{ content }}</p>\n' +
    '<div class="grid-block align-center button-row">\n' +
    '  <div class="grid-content shrink" ng-class="{\'order-2\': !enterFirst}">\n' +
    '    <a class="button enter-button" ng-click="enter()">{{ enterText }}</a>\n' +
    '  </div>\n' +
    '  <div class="grid-content shrink">\n' +
    '    <a class="button cancel-button" ng-click="cancel()">{{ cancelText }}</a>\n' +
    '  </div>\n' +
    '<div>\n' +
    '');
}]);

angular.module('base').run(['$templateCache', function($templateCache) {
  $templateCache.put('components/modal/modal-prompt.html',
    '<h1 ng-show="title">{{ title }}</h1>\n' +
    '<p ng-show="content">{{ content }}</p>\n' +
    '<input type="{{ inputType }}" ng-model="data.value"></input>\n' +
    '<div class="grid-block align-center button-row">\n' +
    '  <div class="grid-content shrink" ng-class="{\'order-2\': !enterFirst}">\n' +
    '    <a class="button enter-button" ng-click="enter()">{{ enterText }}</a>\n' +
    '  </div>\n' +
    '  <div class="grid-content shrink">\n' +
    '    <a class="button cancel-button" ng-click="cancel()">{{ cancelText }}</a>\n' +
    '  </div>\n' +
    '<div>\n' +
    '');
}]);

angular.module('base').run(['$templateCache', function($templateCache) {
  $templateCache.put('components/modal/modal.html',
    '<div\n' +
    '  class="modal-overlay"\n' +
    '  ng-click="hideOverlay($event)">\n' +
    '  <aside\n' +
    '    class="modal"\n' +
    '    ng-transclude>\n' +
    '  </aside>\n' +
    '</div>\n' +
    '');
}]);

angular.module('base').run(['$templateCache', function($templateCache) {
  $templateCache.put('components/notification/notification-set.html',
    '<div class="notification-container {{position}}">\n' +
    '  <ba-notification ng-repeat="notification in notifications"\n' +
    '    title="notification.title"\n' +
    '    image="notification.image"\n' +
    '    notif-id = "notification.id"\n' +
    '    color="notification.color"\n' +
    '    autoclose="notification.autoclose"\n' +
    '    >{{ notification.content }}</ba-notification>\n' +
    '</div>');
}]);

angular.module('base').run(['$templateCache', function($templateCache) {
  $templateCache.put('components/notification/notification-static.html',
    '<div ba-swipe-close="swipe" class="static-notification {{ color }} {{ position }}">\n' +
    '  <a href=""\n' +
    '    class="close-button"\n' +
    '    ng-click="hide(); $event.preventDefault(); $event.stopPropagation()">&times;</a>\n' +
    '  <div class="notification-icon" ng-if="image">\n' +
    '    <img ng-src="{{ image }}"/>\n' +
    '  </div>\n' +
    '  <div class="notification-content">\n' +
    '    <h1 ng-bind-html="trustedTitle"></h1>\n' +
    '    <p ng-transclude></p>\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('base').run(['$templateCache', function($templateCache) {
  $templateCache.put('components/notification/notification.html',
    '<div ba-swipe-close="swipe" class="notification {{ color }}">\n' +
    '  <a href=""\n' +
    '    class="close-button"\n' +
    '    ng-click="hide(); $event.preventDefault(); $event.stopPropagation()">&times;</a>\n' +
    '  <div class="notification-icon" ng-if="image">\n' +
    '    <img ng-src="{{ image }}"/>\n' +
    '  </div>\n' +
    '  <div class="notification-content">\n' +
    '    <h1 ng-bind-html="trustedTitle"></h1>\n' +
    '    <p ng-transclude></p>\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('base').run(['$templateCache', function($templateCache) {
  $templateCache.put('components/offcanvas/offcanvas.html',
    '<div\n' +
    '  class="off-canvas {{ position }}"\n' +
    '  ng-class="{\'is-active\': active}"\n' +
    '  ng-transclude>\n' +
    '</div>\n' +
    '');
}]);

angular.module('base').run(['$templateCache', function($templateCache) {
  $templateCache.put('components/panel/panel.html',
    '<div\n' +
    '  class="panel"\n' +
    '  ng-class="positionClass"\n' +
    '  ng-transclude\n' +
    '  >\n' +
    '</div>\n' +
    '');
}]);

angular.module('base').run(['$templateCache', function($templateCache) {
  $templateCache.put('components/popup/popup.html',
    '<div class="popup" ng-class="{\'is-active\': active }" ng-transclude>\n' +
    '</div>\n' +
    '');
}]);

angular.module('base').run(['$templateCache', function($templateCache) {
  $templateCache.put('components/tabs/tab-content.html',
    '<div class="tab-contents">\n' +
    '  <div ba-tab-individual\n' +
    '    class="tab-content"\n' +
    '    ng-class="{\'is-active\': tab.active}"\n' +
    '    ng-repeat="tab in tabs"\n' +
    '    tab="tab">\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('base').run(['$templateCache', function($templateCache) {
  $templateCache.put('components/tabs/tab.html',
    '<div class="tab-item"\n' +
    '  ng-class="{\'is-active\': active}"\n' +
    '  ng-click="makeActive()">{{ title }}</div>\n' +
    '');
}]);

angular.module('base').run(['$templateCache', function($templateCache) {
  $templateCache.put('components/tabs/tabs.html',
    '<div>\n' +
    '  <div class="tabs" ng-transclude>\n' +
    '  </div>\n' +
    '  <div ba-tab-content\n' +
    '    target="{{ id }}"\n' +
    '    ng-if="showTabContent">\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);
