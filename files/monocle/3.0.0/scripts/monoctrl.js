Monocle.Controls.Contents = function (reader) {

  var API = { constructor: Monocle.Controls.Contents }
  var k = API.constants = API.constructor;
  var p = API.properties = {
    reader: reader
  }


  function createControlElements() {
    var div = reader.dom.make('div', 'controls_contents_container');
    contentsForBook(div, reader.getBook());
    return div;
  }


  function contentsForBook(div, book) {
    while (div.hasChildNodes()) {
      div.removeChild(div.firstChild);
    }
    var list = div.dom.append('ol', 'controls_contents_list');

    var contents = book.properties.contents;
    for (var i = 0; i < contents.length; ++i) {
      chapterBuilder(list, contents[i], 0);
    }
  }


  function chapterBuilder(list, chp, padLvl) {
    var index = list.childNodes.length;
    var li = list.dom.append('li', 'controls_contents_chapter', index);
    var span = li.dom.append(
      'span',
      'controls_contents_chapterTitle',
      index,
      { html: chp.title }
    );
    span.style.paddingLeft = padLvl + "em";

    var invoked = function () {
      p.reader.skipToChapter(chp.src);
      p.reader.hideControl(API);
    }

    Monocle.Events.listenForTap(li, invoked, 'controls_contents_chapter_active');

    if (chp.children) {
      for (var i = 0; i < chp.children.length; ++i) {
        chapterBuilder(list, chp.children[i], padLvl + 1);
      }
    }
  }


  API.createControlElements = createControlElements;

  return API;
}
;
Monocle.Controls.Magnifier = function (reader) {

  var API = { constructor: Monocle.Controls.Magnifier }
  var k = API.constants = API.constructor;
  var p = API.properties = {
    buttons: [],
    magnified: false
  }


  function initialize() {
    p.reader = reader;
  }


  function createControlElements(holder) {
    var btn = holder.dom.make('div', 'controls_magnifier_button');
    btn.smallA = btn.dom.append('span', 'controls_magnifier_a', { text: 'A' });
    btn.largeA = btn.dom.append('span', 'controls_magnifier_A', { text: 'A' });
    p.buttons.push(btn);
    Monocle.Events.listenForTap(btn, toggleMagnification);
    return btn;
  }


  function toggleMagnification(evt) {
    var opacities;
    p.magnified = !p.magnified;
    if (p.magnified) {
      opacities = [0.3, 1];
      p.reader.formatting.setFontScale(k.MAGNIFICATION, true);
    } else {
      opacities = [1, 0.3];
      p.reader.formatting.setFontScale(null, true);
    }

    for (var i = 0; i < p.buttons.length; i++) {
      p.buttons[i].smallA.style.opacity = opacities[0];
      p.buttons[i].largeA.style.opacity = opacities[1];
    }
  }

  API.createControlElements = createControlElements;

  initialize();

  return API;
}


Monocle.Controls.Magnifier.MAGNIFICATION = 1.2;
// A panel is an invisible column of interactivity. When contact occurs
// (mousedown, touchstart), the panel expands to the full width of its
// container, to catch all interaction events and prevent them from hitting
// other things.
//
// Panels are used primarily to provide hit zones for page flipping
// interactions, but you can do whatever you like with them.
//
// After instantiating a panel and adding it to the reader as a control,
// you can call listenTo() with a hash of methods for any of 'start', 'move'
// 'end' and 'cancel'.
//
Monocle.Controls.Panel = function () {

  var API = { constructor: Monocle.Controls.Panel }
  var k = API.constants = API.constructor;
  var p = API.properties = {
    evtCallbacks: {}
  }

  function createControlElements(cntr) {
    p.div = cntr.dom.make('div', k.CLS.panel);
    p.div.dom.setStyles(k.DEFAULT_STYLES);
    Monocle.Events.listenForContact(
      p.div,
      {
        'start': start,
        'move': move,
        'end': end,
        'cancel': cancel
      },
      { useCapture: false }
    );
    return p.div;
  }


  function setDirection(dir) {
    p.direction = dir;
  }


  function listenTo(evtCallbacks) {
    p.evtCallbacks = evtCallbacks;
  }


  function deafen() {
    p.evtCallbacks = {}
  }


  function start(evt) {
    p.contact = true;
    evt.m.offsetX += p.div.offsetLeft;
    evt.m.offsetY += p.div.offsetTop;
    expand();
    invoke('start', evt);
  }


  function move(evt) {
    if (!p.contact) {
      return;
    }
    invoke('move', evt);
  }


  function end(evt) {
    if (!p.contact) {
      return;
    }
    Monocle.Events.deafenForContact(p.div, p.listeners);
    contract();
    p.contact = false;
    invoke('end', evt);
  }


  function cancel(evt) {
    if (!p.contact) {
      return;
    }
    Monocle.Events.deafenForContact(p.div, p.listeners);
    contract();
    p.contact = false;
    invoke('cancel', evt);
  }


  function invoke(evtType, evt) {
    if (p.evtCallbacks[evtType]) {
      p.evtCallbacks[evtType](p.direction, evt.m.offsetX, evt.m.offsetY, API);
    }
    evt.preventDefault();
  }


  function expand() {
    if (p.expanded) {
      return;
    }
    p.div.dom.addClass(k.CLS.expanded);
    p.expanded = true;
  }


  function contract(evt) {
    if (!p.expanded) {
      return;
    }
    p.div.dom.removeClass(k.CLS.expanded);
    p.expanded = false;
  }


  API.createControlElements = createControlElements;
  API.listenTo = listenTo;
  API.deafen = deafen;
  API.expand = expand;
  API.contract = contract;
  API.setDirection = setDirection;

  return API;
}


Monocle.Controls.Panel.CLS = {
  panel: 'panel',
  expanded: 'controls_panel_expanded'
}
Monocle.Controls.Panel.DEFAULT_STYLES = {
  position: 'absolute',
  height: '100%'
}
;
Monocle.Controls.PlaceSaver = function (bookId) {

  var API = { constructor: Monocle.Controls.PlaceSaver }
  var k = API.constants = API.constructor;
  var p = API.properties = {}


  function initialize() {
    applyToBook(bookId);
  }


  function assignToReader(reader) {
    p.reader = reader;
    p.reader.listen('monocle:turn', savePlaceToCookie);
  }


  function applyToBook(bookId) {
    p.bkTitle = bookId.toLowerCase().replace(/[^a-z0-9]/g, '');
    p.prefix = k.COOKIE_NAMESPACE + p.bkTitle + ".";
  }


  function setCookie(key, value, days) {
    var expires = "";
    if (days) {
      var d = new Date();
      d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires="+d.toGMTString();
    }
    var path = "; path=/";
    document.cookie = p.prefix + key + "=" + value + expires + path;
    return value;
  }


  function getCookie(key) {
    if (!document.cookie) {
      return null;
    }
    var regex = new RegExp(p.prefix + key + "=(.+?)(;|$)");
    var matches = document.cookie.match(regex);
    if (matches) {
      return matches[1];
    } else {
      return null;
    }
  }


  function savePlaceToCookie() {
    var place = p.reader.getPlace();
    setCookie(
      "component",
      encodeURIComponent(place.componentId()),
      k.COOKIE_EXPIRES_IN_DAYS
    );
    setCookie(
      "percent",
      place.percentageThrough(),
      k.COOKIE_EXPIRES_IN_DAYS
    );
  }


  function savedPlace() {
    var locus = {
      componentId: getCookie('component'),
      percent: getCookie('percent')
    }
    if (locus.componentId && locus.percent) {
      locus.componentId = decodeURIComponent(locus.componentId);
      locus.percent = parseFloat(locus.percent);
      return locus;
    } else {
      return null;
    }
  }


  function restorePlace() {
    var locus = savedPlace();
    if (locus) {
      p.reader.moveTo(locus);
    }
  }


  API.assignToReader = assignToReader;
  API.savedPlace = savedPlace;
  API.restorePlace = restorePlace;

  initialize();

  return API;
}

Monocle.Controls.PlaceSaver.COOKIE_NAMESPACE = "monocle.controls.placesaver.";
Monocle.Controls.PlaceSaver.COOKIE_EXPIRES_IN_DAYS = 7; // Set to 0 for session-based expiry.
;
Monocle.Controls.Scrubber = function (reader) {

  var API = { constructor: Monocle.Controls.Scrubber }
  var k = API.constants = API.constructor;
  var p = API.properties = {}


  function initialize() {
    p.reader = reader;
    p.reader.listen('monocle:turn', updateNeedles);
    updateNeedles();
  }


  function pixelToPlace(x, cntr) {
    if (!p.componentIds) {
      p.componentIds = p.reader.getBook().properties.componentIds;
      p.componentWidth = 100 / p.componentIds.length;
    }
    var pc = (x / cntr.offsetWidth) * 100;
    var cmpt = p.componentIds[Math.floor(pc / p.componentWidth)];
    var cmptPc = ((pc % p.componentWidth) / p.componentWidth);
    return { componentId: cmpt, percentageThrough: cmptPc };
  }


  function placeToPixel(place, cntr) {
    if (!p.componentIds) {
      p.componentIds = p.reader.getBook().properties.componentIds;
      p.componentWidth = 100 / p.componentIds.length;
    }
    var componentIndex = p.componentIds.indexOf(place.componentId());
    var pc = p.componentWidth * componentIndex;
    pc += place.percentageThrough() * p.componentWidth;
    return Math.round((pc / 100) * cntr.offsetWidth);
  }


  function updateNeedles() {
    if (p.hidden || !p.reader.dom.find(k.CLS.container)) {
      return;
    }
    var place = p.reader.getPlace();
    var x = placeToPixel(place, p.reader.dom.find(k.CLS.container));
    var needle, i = 0;
    for (var i = 0, needle; needle = p.reader.dom.find(k.CLS.needle, i); ++i) {
      setX(needle, x - needle.offsetWidth / 2);
      p.reader.dom.find(k.CLS.trail, i).style.width = x + "px";
    }
  }


  function setX(node, x) {
    var cntr = p.reader.dom.find(k.CLS.container);
    x = Math.min(cntr.offsetWidth - node.offsetWidth, x);
    x = Math.max(x, 0);
    Monocle.Styles.setX(node, x);
  }


  function createControlElements(holder) {
    var cntr = holder.dom.make('div', k.CLS.container);
    var track = cntr.dom.append('div', k.CLS.track);
    var needleTrail = cntr.dom.append('div', k.CLS.trail);
    var needle = cntr.dom.append('div', k.CLS.needle);
    var bubble = cntr.dom.append('div', k.CLS.bubble);

    var cntrListeners, bodyListeners;

    var moveEvt = function (evt, x) {
      evt.preventDefault();
      x = (typeof x == "number") ? x : evt.m.registrantX;
      var place = pixelToPlace(x, cntr);
      setX(needle, x - needle.offsetWidth / 2);
      var book = p.reader.getBook();
      var chps = book.chaptersForComponent(place.componentId);
      var cmptIndex = p.componentIds.indexOf(place.componentId);
      var chp = chps[Math.floor(chps.length * place.percentageThrough)];
      if (cmptIndex > -1 && book.properties.components[cmptIndex]) {
        var actualPlace = Monocle.Place.FromPercentageThrough(
          book.properties.components[cmptIndex],
          place.percentageThrough
        );
        chp = actualPlace.chapterInfo() || chp;
      }

      if (chp) {
        bubble.innerHTML = chp.title;
      }
      setX(bubble, x - bubble.offsetWidth / 2);

      p.lastX = x;
      return place;
    }

    var endEvt = function (evt) {
      var place = moveEvt(evt, p.lastX);
      p.reader.moveTo({
        percent: place.percentageThrough,
        componentId: place.componentId
      });
      Monocle.Events.deafenForContact(cntr, cntrListeners);
      Monocle.Events.deafenForContact(document.body, bodyListeners);
      bubble.style.display = "none";
    }

    var startFn = function (evt) {
      bubble.style.display = "block";
      moveEvt(evt);
      cntrListeners = Monocle.Events.listenForContact(
        cntr,
        { move: moveEvt }
      );
      bodyListeners = Monocle.Events.listenForContact(
        document.body,
        { end: endEvt }
      );
    }

    Monocle.Events.listenForContact(cntr, { start: startFn });

    return cntr;
  }


  API.createControlElements = createControlElements;
  API.updateNeedles = updateNeedles;

  initialize();

  return API;
}

Monocle.Controls.Scrubber.CLS = {
  container: 'controls_scrubber_container',
  track: 'controls_scrubber_track',
  needle: 'controls_scrubber_needle',
  trail: 'controls_scrubber_trail',
  bubble: 'controls_scrubber_bubble'
}
;
Monocle.Controls.Spinner = function (reader) {

  var API = { constructor: Monocle.Controls.Spinner }
  var k = API.constants = API.constructor;
  var p = API.properties = {
    reader: reader,
    divs: [],
    spinCount: 0,
    repeaters: {},
    showForPages: []
  }


  function createControlElements(cntr) {
    var anim = cntr.dom.make('div', 'controls_spinner_anim');
    p.divs.push(anim);
    return anim;
  }


  function registerSpinEvt(startEvtType, stopEvtType) {
    var label = startEvtType;
    p.reader.listen(startEvtType, function (evt) { spin(label, evt) });
    p.reader.listen(stopEvtType, function (evt) { spun(label, evt) });
  }


  // Registers spin/spun event handlers for certain time-consuming events.
  //
  function listenForUsualDelays() {
    registerSpinEvt('monocle:componentloading', 'monocle:componentloaded');
    registerSpinEvt('monocle:componentchanging', 'monocle:componentchange');
    registerSpinEvt('monocle:resizing', 'monocle:resize');
    registerSpinEvt('monocle:jumping', 'monocle:jump');
    registerSpinEvt('monocle:recalculating', 'monocle:recalculated');
  }


  // Displays the spinner. Both arguments are optional.
  //
  function spin(label, evt) {
    label = label || k.GENERIC_LABEL;
    //console.log('Spinning on ' + (evt ? evt.type : label));
    p.repeaters[label] = true;
    p.reader.showControl(API);

    // If the delay is on a page other than the page we've been assigned to,
    // don't show the animation. p.global ensures that if an event affects
    // all pages, the animation is always shown, even if other events in this
    // spin cycle are page-specific.
    var page = evt && evt.m && evt.m.page ? evt.m.page : null;
    if (!page) { p.global = true; }
    for (var i = 0; i < p.divs.length; ++i) {
      var owner = p.divs[i].parentNode.parentNode;
      if (page == owner) { p.showForPages.push(page); }
      var show = p.global || p.showForPages.indexOf(page) >= 0;
      p.divs[i].style.display = show ? 'block' : 'none';
    }
  }


  // Stops displaying the spinner. Both arguments are optional.
  //
  function spun(label, evt) {
    label = label || k.GENERIC_LABEL;
    //console.log('Spun on ' + (evt ? evt.type : label));
    p.repeaters[label] = false;
    for (var l in p.repeaters) {
      if (p.repeaters[l]) { return; }
    }
    p.global = false;
    p.showForPages = [];
    p.reader.hideControl(API);
  }


  API.createControlElements = createControlElements;
  API.listenForUsualDelays = listenForUsualDelays;
  API.spin = spin;
  API.spun = spun;

  return API;
}

Monocle.Controls.Spinner.GENERIC_LABEL = "generic";
Monocle.Controls.Stencil = function (reader, behaviorClasses) {

  var API = { constructor: Monocle.Controls.Stencil }
  var k = API.constants = API.constructor;
  var p = API.properties = {
    reader: reader,
    behaviors: [],
    components: {},
    masks: []
  }


  // Create the stencil container and listen for draw/update events.
  //
  function createControlElements(holder) {
    behaviorClasses = behaviorClasses || k.DEFAULT_BEHAVIORS;
    for (var i = 0, ii = behaviorClasses.length; i < ii; ++i) {
      addBehavior(behaviorClasses[i]);
    }
    p.container = holder.dom.make('div', k.CLS.container);
    p.reader.listen('monocle:turning', hide);
    p.reader.listen('monocle:turn:cancel', show);
    p.reader.listen('monocle:turn', update);
    p.reader.listen('monocle:stylesheetchange', update);
    p.reader.listen('monocle:resize', update);
    update();
    return p.container;
  }


  // Pass this method an object that responds to 'findElements(doc)' with
  // an array of DOM elements for that document, and to 'fitMask(elem, mask)'.
  //
  // After you have added all your behaviors this way, you would typically
  // call update() to make them take effect immediately.
  //
  function addBehavior(bhvrClass) {
    var bhvr = new bhvrClass(API);
    if (typeof bhvr.findElements != 'function') {
      console.warn('Missing "findElements" method for behavior: %o', bhvr);
    }
    if (typeof bhvr.fitMask != 'function') {
      console.warn('Missing "fitMask" method for behavior: %o', bhvr);
    }
    p.behaviors.push(bhvr);
  }


  // Resets any pre-calculated rectangles for the active component,
  // recalculates them, and forces masks to be "drawn" (moved into the new
  // rectangular locations).
  //
  function update() {
    var visPages = p.reader.visiblePages();
    if (!visPages || !visPages.length) { return; }
    var pageDiv = visPages[0];
    var cmptId = pageComponentId(pageDiv);
    if (!cmptId) { return; }
    p.components[cmptId] = null;
    calculateRectangles(pageDiv);
    draw();
  }


  function hide() {
    p.container.style.display = 'none';
  }


  function show() {
    p.container.style.display = 'block';
  }


  // Removes any existing masks.
  function clear() {
    while (p.container.childNodes.length) {
      p.container.removeChild(p.container.lastChild);
    }
  }


  // Aligns the stencil container to the shape of the page, then moves the
  // masks to sit above any currently visible rectangles.
  //
  function draw() {
    var pageDiv = p.reader.visiblePages()[0];
    var cmptId = pageComponentId(pageDiv);
    if (!p.components[cmptId]) {
      return;
    }

    // Position the container.
    alignToComponent(pageDiv);

    // Clear old masks.
    clear();

    // Layout the masks.
    if (!p.disabled) {
      show();
      var rects = p.components[cmptId];
      if (rects && rects.length) {
        layoutRectangles(pageDiv, rects);
      }
    }
  }


  // Iterate over all the <a> elements in the active component, and
  // create an array of rectangular points corresponding to their positions.
  //
  function calculateRectangles(pageDiv) {
    var cmptId = pageComponentId(pageDiv);
    if (!p.components[cmptId]) {
      p.components[cmptId] = [];
    } else {
      return;
    }

    var doc = pageDiv.m.activeFrame.contentDocument;
    var offset = getOffset(pageDiv);

    for (var b = 0, bb = p.behaviors.length; b < bb; ++b) {
      var bhvr = p.behaviors[b];
      var elems = bhvr.findElements(doc);
      for (var i = 0; i < elems.length; ++i) {
        var elem = elems[i];
        if (elem.getClientRects) {
          var r = elem.getClientRects();
          for (var j = 0; j < r.length; j++) {
            p.components[cmptId].push({
              element: elem,
              behavior: bhvr,
              left: Math.ceil(r[j].left + offset.l),
              top: Math.ceil(r[j].top),
              width: Math.floor(r[j].width),
              height: Math.floor(r[j].height)
            });
          }
        }
      }
    }

    return p.components[cmptId];
  }


  // Update location of visible rectangles - creating as required.
  //
  function layoutRectangles(pageDiv, rects) {
    var offset = getOffset(pageDiv);
    var visRects = [];
    for (var i = 0; i < rects.length; ++i) {
      if (rectVisible(rects[i], offset.l, offset.l + offset.w)) {
        visRects.push(rects[i]);
      }
    }

    for (i = 0; i < visRects.length; ++i) {
      var r = visRects[i];
      var cr = {
        left: r.left - offset.l,
        top: r.top,
        width: r.width,
        height: r.height
      };
      var mask = createMask(r.element, r.behavior);
      mask.dom.setStyles({
        display: 'block',
        left: cr.left+"px",
        top: cr.top+"px",
        width: cr.width+"px",
        height: cr.height+"px",
        position: 'absolute'
      });
      mask.stencilRect = cr;
    }
  }


  // Find the offset position in pixels from the left of the current page.
  //
  function getOffset(pageDiv) {
    return {
      l: pageDiv.m.offset || 0,
      w: pageDiv.m.dimensions.properties.width
    };
  }


  // Is this area presently on the screen?
  //
  function rectVisible(rect, l, r) {
    return rect.left >= l && rect.left < r;
  }


  // Returns the active component id for the given page, or the current
  // page if no argument passed in.
  //
  function pageComponentId(pageDiv) {
    pageDiv = pageDiv || p.reader.visiblePages()[0];
    if (!pageDiv.m.activeFrame.m.component) { return; }
    return pageDiv.m.activeFrame.m.component.properties.id;
  }


  // Positions the stencil container over the active frame.
  //
  function alignToComponent(pageDiv) {
    cmpt = pageDiv.m.activeFrame.parentNode;
    p.container.dom.setStyles({
      left: cmpt.offsetLeft+"px",
      top: cmpt.offsetTop+"px"
    });
  }


  function createMask(element, bhvr) {
    var mask = p.container.dom.append(bhvr.maskTagName || 'div', k.CLS.mask);
    Monocle.Events.listenForContact(mask, {
      start: function () { p.reader.dispatchEvent('monocle:magic:halt'); },
      move: function (evt) { evt.preventDefault(); },
      end: function () { p.reader.dispatchEvent('monocle:magic:init'); }
    });
    bhvr.fitMask(element, mask);
    return mask;
  }


  // Make the active masks visible (by giving them a class -- override style
  // in monoctrl.css).
  //
  function toggleHighlights() {
    var cls = k.CLS.highlights;
    if (p.container.dom.hasClass(cls)) {
      p.container.dom.removeClass(cls);
    } else {
      p.container.dom.addClass(cls);
    }
  }


  function disable() {
    p.disabled = true;
    draw();
  }


  function enable() {
    p.disabled = false;
    draw();
  }


  function filterElement(elem, behavior) {
    if (typeof behavior.filterElement == 'function') {
      return behavior.filterElement(elem);
    }
    return elem;
  }


  function maskAssigned(elem, mask, behavior) {
    if (typeof behavior.maskAssigned == 'function') {
      return behavior.maskAssigned(elem, mask);
    }
    return false;
  }


  API.createControlElements = createControlElements;
  API.addBehavior = addBehavior;
  API.draw = draw;
  API.update = update;
  API.toggleHighlights = toggleHighlights;

  return API;
}


Monocle.Controls.Stencil.CLS = {
  container: 'controls_stencil_container',
  mask: 'controls_stencil_mask',
  highlights: 'controls_stencil_highlighted'
}



Monocle.Controls.Stencil.Links = function (stencil) {
  var API = { constructor: Monocle.Controls.Stencil.Links }

  // Optionally specify the HTML tagname of the mask.
  API.maskTagName = 'a';

  // Returns an array of all the elements in the given doc that should
  // be covered with a stencil mask for interactivity.
  //
  // (Hint: doc.querySelectorAll() is your friend.)
  //
  API.findElements = function (doc) {
    return doc.querySelectorAll('a[href]');
  }


  // Return an element. It should usually be a child of the container element,
  // with a className of the given maskClass. You set up the interactivity of
  // the mask element here.
  //
  API.fitMask = function (link, mask) {
    var hrefObject = deconstructHref(link);
    if (hrefObject.internal) {
      mask.setAttribute('href', 'javascript:"Skip to chapter"');
      Monocle.Events.listen(mask, 'click', function (evt) {
        stencil.properties.reader.skipToChapter(hrefObject.internal);
        evt.preventDefault();
      });
    } else {
      mask.setAttribute('href', hrefObject.external);
      mask.setAttribute('target', '_blank');
      link.setAttribute('target', '_blank'); // For good measure.
    }
  }


  // Returns an object with either:
  //
  // - an 'external' property -- an absolute URL with a protocol,
  // host & etc, which should be treated as an external resource (eg,
  // open in new window)
  //
  //   OR
  //
  // - an 'internal' property -- a relative URL (with optional hash anchor),
  //  that is treated as a link to component in the book
  //
  // A weird but useful property of <a> tags is that while
  // link.getAttribute('href') will return the actual string value of the
  // attribute (eg, 'foo.html'), link.href will return the absolute URL (eg,
  // 'http://example.com/monocles/foo.html').
  //
  function deconstructHref(elem) {
    var url = elem.href;
    if (!elem.getAttribute('target')) {
      var m = url.match(/([^#]*)(#.*)?$/);
      var path = m[1];
      var anchor = m[2] || '';
      var cmpts = stencil.properties.reader.getBook().properties.componentIds;
      for (var i = 0, ii = cmpts.length; i < ii; ++i) {
        if (path.substr(0 - cmpts[i].length) == cmpts[i]) {
          return { internal: cmpts[i] + anchor };
        }
      }
    }
    return { external: url };
  }

  return API;
}


Monocle.Controls.Stencil.DEFAULT_BEHAVIORS = [Monocle.Controls.Stencil.Links];
