Clazz.declarePackage ("JV");
Clazz.load (["javajs.api.EventManager", "J.i18n.GT", "JU.Rectangle", "JV.MouseState"], ["JV.MotionPoint", "$.ActionManager", "$.Gesture"], ["java.lang.Character", "$.Float", "JU.AU", "$.P3", "$.PT", "J.api.Interface", "J.thread.HoverWatcherThread", "JU.BSUtil", "$.Escape", "$.Logger", "$.Point3fi", "JV.binding.Binding", "$.JmolBinding"], function () {
c$ = Clazz.decorateAsClass (function () {
this.vwr = null;
this.haveMultiTouchInput = false;
this.isMultiTouch = false;
this.b = null;
this.jmolBinding = null;
this.pfaatBinding = null;
this.dragBinding = null;
this.rasmolBinding = null;
this.predragBinding = null;
this.LEFT_CLICKED = 0;
this.LEFT_DRAGGED = 0;
this.hoverWatcherThread = null;
this.dragGesture = null;
this.apm = 1;
this.bondPickingMode = 0;
this.pickingStyle = 0;
this.pickingStyleSelect = 0;
this.pickingStyleMeasure = 5;
this.rootPickingStyle = 0;
this.pickAtomAssignType = "C";
this.pickBondAssignType = 'p';
this.isPickAtomAssignCharge = false;
this.xyRange = 0;
this.gestureSwipeFactor = 1.0;
this.mouseDragFactor = 1.0;
this.mouseWheelFactor = 1.15;
this.current = null;
this.moved = null;
this.clicked = null;
this.pressed = null;
this.dragged = null;
this.pressedCount = 0;
this.clickedCount = 0;
this.drawMode = false;
this.labelMode = false;
this.dragSelectedMode = false;
this.measuresEnabled = true;
this.haveSelection = false;
this.hoverActive = false;
this.mp = null;
this.dragAtomIndex = -1;
this.rubberbandSelectionMode = false;
this.rectRubber = null;
this.isAltKeyReleased = true;
this.keyProcessing = false;
this.isMultiTouchClient = false;
this.isMultiTouchServer = false;
this.pressAction = 0;
this.dragAction = 0;
this.clickAction = 0;
this.measurementQueued = null;
this.selectionWorking = false;
Clazz.instantialize (this, arguments);
}, JV, "ActionManager", null, javajs.api.EventManager);
Clazz.prepareFields (c$, function () {
this.current =  new JV.MouseState ("current");
this.moved =  new JV.MouseState ("moved");
this.clicked =  new JV.MouseState ("clicked");
this.pressed =  new JV.MouseState ("pressed");
this.dragged =  new JV.MouseState ("dragged");
this.rectRubber =  new JU.Rectangle ();
});
Clazz.defineMethod (c$, "setViewer", 
function (vwr, commandOptions) {
this.vwr = vwr;
if (!vwr.isJS) this.createActions ();
this.setBinding (this.jmolBinding =  new JV.binding.JmolBinding ());
this.LEFT_CLICKED = JV.binding.Binding.getMouseAction (1, 16, 2);
this.LEFT_DRAGGED = JV.binding.Binding.getMouseAction (1, 16, 1);
this.dragGesture =  new JV.Gesture (20, vwr);
}, "JV.Viewer,~S");
Clazz.defineMethod (c$, "checkHover", 
function () {
if (!this.vwr.getInMotion (true) && !this.vwr.tm.spinOn && !this.vwr.tm.navOn && !this.vwr.checkObjectHovered (this.current.x, this.current.y)) {
var atomIndex = this.vwr.findNearestAtomIndex (this.current.x, this.current.y);
if (atomIndex < 0) return;
var isLabel = (this.apm == 2 && this.bnd (JV.binding.Binding.getMouseAction (this.clickedCount, this.moved.modifiers, 1), [10]));
this.vwr.hoverOn (atomIndex, isLabel);
}});
Clazz.defineMethod (c$, "processMultitouchEvent", 
function (groupID, eventType, touchID, iData, pt, time) {
}, "~N,~N,~N,~N,JU.P3,~N");
Clazz.defineMethod (c$, "bind", 
function (desc, name) {
var jmolAction = JV.ActionManager.getActionFromName (name);
var mouseAction = JV.binding.Binding.getMouseActionStr (desc);
if (mouseAction == 0) return;
if (jmolAction >= 0) {
this.b.bindAction (mouseAction, jmolAction);
} else {
this.b.bindName (mouseAction, name);
}}, "~S,~S");
Clazz.defineMethod (c$, "clearBindings", 
function () {
this.setBinding (this.jmolBinding =  new JV.binding.JmolBinding ());
this.pfaatBinding = null;
this.dragBinding = null;
this.rasmolBinding = null;
});
Clazz.defineMethod (c$, "unbindAction", 
function (desc, name) {
if (desc == null && name == null) {
this.clearBindings ();
return;
}var jmolAction = JV.ActionManager.getActionFromName (name);
var mouseAction = JV.binding.Binding.getMouseActionStr (desc);
if (jmolAction >= 0) this.b.unbindAction (mouseAction, jmolAction);
 else if (mouseAction != 0) this.b.unbindName (mouseAction, name);
if (name == null) this.b.unbindUserAction (desc);
}, "~S,~S");
c$.newAction = Clazz.defineMethod (c$, "newAction", 
function (i, name, info) {
JV.ActionManager.actionInfo[i] = info;
JV.ActionManager.actionNames[i] = name;
}, "~N,~S,~S");
Clazz.defineMethod (c$, "createActions", 
function () {
if (JV.ActionManager.actionInfo[0] != null) return;
JV.ActionManager.newAction (0, "_assignNew", J.i18n.GT.o (J.i18n.GT._ ("assign/new atom or bond (requires {0})"), "set picking assignAtom_??/assignBond_?"));
JV.ActionManager.newAction (1, "_center", J.i18n.GT._ ("center"));
JV.ActionManager.newAction (2, "_clickFrank", J.i18n.GT._ ("pop up recent context menu (click on Jmol frank)"));
JV.ActionManager.newAction (4, "_deleteAtom", J.i18n.GT.o (J.i18n.GT._ ("delete atom (requires {0})"), "set picking DELETE ATOM"));
JV.ActionManager.newAction (5, "_deleteBond", J.i18n.GT.o (J.i18n.GT._ ("delete bond (requires {0})"), "set picking DELETE BOND"));
JV.ActionManager.newAction (6, "_depth", J.i18n.GT.o (J.i18n.GT._ ("adjust depth (back plane; requires {0})"), "SLAB ON"));
JV.ActionManager.newAction (7, "_dragAtom", J.i18n.GT.o (J.i18n.GT._ ("move atom (requires {0})"), "set picking DRAGATOM"));
JV.ActionManager.newAction (8, "_dragDrawObject", J.i18n.GT.o (J.i18n.GT._ ("move whole DRAW object (requires {0})"), "set picking DRAW"));
JV.ActionManager.newAction (9, "_dragDrawPoint", J.i18n.GT.o (J.i18n.GT._ ("move specific DRAW point (requires {0})"), "set picking DRAW"));
JV.ActionManager.newAction (10, "_dragLabel", J.i18n.GT.o (J.i18n.GT._ ("move label (requires {0})"), "set picking LABEL"));
JV.ActionManager.newAction (11, "_dragMinimize", J.i18n.GT.o (J.i18n.GT._ ("move atom and minimize molecule (requires {0})"), "set picking DRAGMINIMIZE"));
JV.ActionManager.newAction (12, "_dragMinimizeMolecule", J.i18n.GT.o (J.i18n.GT._ ("move and minimize molecule (requires {0})"), "set picking DRAGMINIMIZEMOLECULE"));
JV.ActionManager.newAction (13, "_dragSelected", J.i18n.GT.o (J.i18n.GT._ ("move selected atoms (requires {0})"), "set DRAGSELECTED"));
JV.ActionManager.newAction (14, "_dragZ", J.i18n.GT.o (J.i18n.GT._ ("drag atoms in Z direction (requires {0})"), "set DRAGSELECTED"));
JV.ActionManager.newAction (15, "_multiTouchSimulation", J.i18n.GT._ ("simulate multi-touch using the mouse)"));
JV.ActionManager.newAction (16, "_navTranslate", J.i18n.GT.o (J.i18n.GT._ ("translate navigation point (requires {0} and {1})"),  Clazz.newArray (-1, ["set NAVIGATIONMODE", "set picking NAVIGATE"])));
JV.ActionManager.newAction (17, "_pickAtom", J.i18n.GT._ ("pick an atom"));
JV.ActionManager.newAction (3, "_pickConnect", J.i18n.GT.o (J.i18n.GT._ ("connect atoms (requires {0})"), "set picking CONNECT"));
JV.ActionManager.newAction (18, "_pickIsosurface", J.i18n.GT.o (J.i18n.GT._ ("pick an ISOSURFACE point (requires {0}"), "set DRAWPICKING"));
JV.ActionManager.newAction (19, "_pickLabel", J.i18n.GT.o (J.i18n.GT._ ("pick a label to toggle it hidden/displayed (requires {0})"), "set picking LABEL"));
JV.ActionManager.newAction (20, "_pickMeasure", J.i18n.GT.o (J.i18n.GT._ ("pick an atom to include it in a measurement (after starting a measurement or after {0})"), "set picking DISTANCE/ANGLE/TORSION"));
JV.ActionManager.newAction (21, "_pickNavigate", J.i18n.GT.o (J.i18n.GT._ ("pick a point or atom to navigate to (requires {0})"), "set NAVIGATIONMODE"));
JV.ActionManager.newAction (22, "_pickPoint", J.i18n.GT.o (J.i18n.GT._ ("pick a DRAW point (for measurements) (requires {0}"), "set DRAWPICKING"));
JV.ActionManager.newAction (23, "_popupMenu", J.i18n.GT._ ("pop up the full context menu"));
JV.ActionManager.newAction (24, "_reset", J.i18n.GT._ ("reset (when clicked off the model)"));
JV.ActionManager.newAction (25, "_rotate", J.i18n.GT._ ("rotate"));
JV.ActionManager.newAction (26, "_rotateBranch", J.i18n.GT.o (J.i18n.GT._ ("rotate branch around bond (requires {0})"), "set picking ROTATEBOND"));
JV.ActionManager.newAction (27, "_rotateSelected", J.i18n.GT.o (J.i18n.GT._ ("rotate selected atoms (requires {0})"), "set DRAGSELECTED"));
JV.ActionManager.newAction (28, "_rotateZ", J.i18n.GT._ ("rotate Z"));
JV.ActionManager.newAction (29, "_rotateZorZoom", J.i18n.GT._ ("rotate Z (horizontal motion of mouse) or zoom (vertical motion of mouse)"));
JV.ActionManager.newAction (30, "_select", J.i18n.GT.o (J.i18n.GT._ ("select an atom (requires {0})"), "set pickingStyle EXTENDEDSELECT"));
JV.ActionManager.newAction (31, "_selectAndDrag", J.i18n.GT.o (J.i18n.GT._ ("select and drag atoms (requires {0})"), "set DRAGSELECTED"));
JV.ActionManager.newAction (32, "_selectAndNot", J.i18n.GT.o (J.i18n.GT._ ("unselect this group of atoms (requires {0})"), "set pickingStyle DRAG/EXTENDEDSELECT"));
JV.ActionManager.newAction (33, "_selectNone", J.i18n.GT.o (J.i18n.GT._ ("select NONE (requires {0})"), "set pickingStyle EXTENDEDSELECT"));
JV.ActionManager.newAction (34, "_selectOr", J.i18n.GT.o (J.i18n.GT._ ("add this group of atoms to the set of selected atoms (requires {0})"), "set pickingStyle DRAG/EXTENDEDSELECT"));
JV.ActionManager.newAction (35, "_selectToggle", J.i18n.GT.o (J.i18n.GT._ ("toggle selection (requires {0})"), "set pickingStyle DRAG/EXTENDEDSELECT/RASMOL"));
JV.ActionManager.newAction (36, "_selectToggleOr", J.i18n.GT.o (J.i18n.GT._ ("if all are selected, unselect all, otherwise add this group of atoms to the set of selected atoms (requires {0})"), "set pickingStyle DRAG"));
JV.ActionManager.newAction (37, "_setMeasure", J.i18n.GT._ ("pick an atom to initiate or conclude a measurement"));
JV.ActionManager.newAction (38, "_slab", J.i18n.GT.o (J.i18n.GT._ ("adjust slab (front plane; requires {0})"), "SLAB ON"));
JV.ActionManager.newAction (39, "_slabAndDepth", J.i18n.GT.o (J.i18n.GT._ ("move slab/depth window (both planes; requires {0})"), "SLAB ON"));
JV.ActionManager.newAction (40, "_slideZoom", J.i18n.GT._ ("zoom (along right edge of window)"));
JV.ActionManager.newAction (41, "_spinDrawObjectCCW", J.i18n.GT.o (J.i18n.GT._ ("click on two points to spin around axis counterclockwise (requires {0})"), "set picking SPIN"));
JV.ActionManager.newAction (42, "_spinDrawObjectCW", J.i18n.GT.o (J.i18n.GT._ ("click on two points to spin around axis clockwise (requires {0})"), "set picking SPIN"));
JV.ActionManager.newAction (43, "_stopMotion", J.i18n.GT.o (J.i18n.GT._ ("stop motion (requires {0})"), "set waitForMoveTo FALSE"));
JV.ActionManager.newAction (44, "_swipe", J.i18n.GT._ ("spin model (swipe and release button and stop motion simultaneously)"));
JV.ActionManager.newAction (45, "_translate", J.i18n.GT._ ("translate"));
JV.ActionManager.newAction (46, "_wheelZoom", J.i18n.GT._ ("zoom"));
});
c$.getActionName = Clazz.defineMethod (c$, "getActionName", 
function (i) {
return (i < JV.ActionManager.actionNames.length ? JV.ActionManager.actionNames[i] : null);
}, "~N");
c$.getActionFromName = Clazz.defineMethod (c$, "getActionFromName", 
function (name) {
for (var i = 0; i < JV.ActionManager.actionNames.length; i++) if (JV.ActionManager.actionNames[i].equalsIgnoreCase (name)) return i;

return -1;
}, "~S");
Clazz.defineMethod (c$, "getBindingInfo", 
function (qualifiers) {
return this.b.getBindingInfo (JV.ActionManager.actionInfo, JV.ActionManager.actionNames, qualifiers);
}, "~S");
Clazz.defineMethod (c$, "setBinding", 
function (newBinding) {
this.b = newBinding;
}, "JV.binding.Binding");
Clazz.defineMethod (c$, "bnd", 
function (mouseAction, jmolActions) {
for (var i = jmolActions.length; --i >= 0; ) if (this.b.isBound (mouseAction, jmolActions[i])) return true;

return false;
}, "~N,~A");
Clazz.defineMethod (c$, "isDrawOrLabelAction", 
 function (a) {
return (this.drawMode && this.bnd (a, [8, 9]) || this.labelMode && this.bnd (a, [10]));
}, "~N");
c$.getPickingModeName = Clazz.defineMethod (c$, "getPickingModeName", 
function (pickingMode) {
return (pickingMode < 0 || pickingMode >= JV.ActionManager.pickingModeNames.length ? "off" : JV.ActionManager.pickingModeNames[pickingMode]);
}, "~N");
c$.getPickingMode = Clazz.defineMethod (c$, "getPickingMode", 
function (str) {
for (var i = JV.ActionManager.pickingModeNames.length; --i >= 0; ) if (str.equalsIgnoreCase (JV.ActionManager.pickingModeNames[i])) return i;

return -1;
}, "~S");
c$.getPickingStyleName = Clazz.defineMethod (c$, "getPickingStyleName", 
function (pickingStyle) {
return (pickingStyle < 0 || pickingStyle >= JV.ActionManager.pickingStyleNames.length ? "toggle" : JV.ActionManager.pickingStyleNames[pickingStyle]);
}, "~N");
c$.getPickingStyleIndex = Clazz.defineMethod (c$, "getPickingStyleIndex", 
function (str) {
for (var i = JV.ActionManager.pickingStyleNames.length; --i >= 0; ) if (str.equalsIgnoreCase (JV.ActionManager.pickingStyleNames[i])) return i;

return -1;
}, "~S");
Clazz.defineMethod (c$, "getAtomPickingMode", 
function () {
return this.apm;
});
Clazz.defineMethod (c$, "setPickingMode", 
function (pickingMode) {
var isNew = false;
switch (pickingMode) {
case -1:
isNew = true;
this.bondPickingMode = 35;
pickingMode = 1;
break;
case 35:
case 34:
case 33:
this.vwr.setBooleanProperty ("bondPicking", true);
this.bondPickingMode = pickingMode;
return;
case 8:
this.bondPickingMode = pickingMode;
if (this.vwr.getBondPicking ()) return;
isNew = true;
break;
}
isNew = new Boolean (isNew | (this.apm != pickingMode)).valueOf ();
this.apm = pickingMode;
if (isNew) this.resetMeasurement ();
}, "~N");
Clazz.defineMethod (c$, "setAtomPickingOption", 
function (option) {
switch (this.apm) {
case 32:
this.pickAtomAssignType = option;
this.isPickAtomAssignCharge = (this.pickAtomAssignType.equals ("Pl") || this.pickAtomAssignType.equals ("Mi"));
break;
}
}, "~S");
Clazz.defineMethod (c$, "setBondPickingOption", 
function (option) {
switch (this.bondPickingMode) {
case 33:
this.pickBondAssignType = Character.toLowerCase (option.charAt (0));
break;
}
}, "~S");
Clazz.defineMethod (c$, "getPickingState", 
function () {
var script = ";set modelkitMode " + this.vwr.getBoolean (603979883) + ";set picking " + JV.ActionManager.getPickingModeName (this.apm);
if (this.apm == 32) script += "_" + this.pickAtomAssignType;
script += ";";
if (this.bondPickingMode != 0) script += "set picking " + JV.ActionManager.getPickingModeName (this.bondPickingMode);
if (this.bondPickingMode == 33) script += "_" + this.pickBondAssignType;
script += ";";
return script;
});
Clazz.defineMethod (c$, "getPickingStyle", 
function () {
return this.pickingStyle;
});
Clazz.defineMethod (c$, "setPickingStyle", 
function (pickingStyle) {
this.pickingStyle = pickingStyle;
if (pickingStyle >= 4) {
this.pickingStyleMeasure = pickingStyle;
this.resetMeasurement ();
} else {
if (pickingStyle < 3) this.rootPickingStyle = pickingStyle;
this.pickingStyleSelect = pickingStyle;
}this.rubberbandSelectionMode = false;
switch (this.pickingStyleSelect) {
case 2:
if (!this.b.name.equals ("extendedSelect")) this.setBinding (this.pfaatBinding == null ? this.pfaatBinding = JV.binding.Binding.newBinding (this.vwr, "Pfaat") : this.pfaatBinding);
break;
case 3:
if (!this.b.name.equals ("drag")) this.setBinding (this.dragBinding == null ? this.dragBinding = JV.binding.Binding.newBinding (this.vwr, "Drag") : this.dragBinding);
this.rubberbandSelectionMode = true;
break;
case 1:
if (!this.b.name.equals ("selectOrToggle")) this.setBinding (this.rasmolBinding == null ? this.rasmolBinding = JV.binding.Binding.newBinding (this.vwr, "Rasmol") : this.rasmolBinding);
break;
default:
if (this.b !== this.jmolBinding) this.setBinding (this.jmolBinding);
}
if (!this.b.name.equals ("drag")) this.predragBinding = this.b;
}, "~N");
Clazz.defineMethod (c$, "setGestureSwipeFactor", 
function (factor) {
this.gestureSwipeFactor = factor;
}, "~N");
Clazz.defineMethod (c$, "setMouseDragFactor", 
function (factor) {
this.mouseDragFactor = factor;
}, "~N");
Clazz.defineMethod (c$, "setMouseWheelFactor", 
function (factor) {
this.mouseWheelFactor = factor;
}, "~N");
Clazz.defineMethod (c$, "setCurrent", 
function (time, x, y, mods) {
this.vwr.hoverOff ();
this.current.set (time, x, y, mods);
}, "~N,~N,~N,~N");
Clazz.defineMethod (c$, "getCurrentX", 
function () {
return this.current.x;
});
Clazz.defineMethod (c$, "getCurrentY", 
function () {
return this.current.y;
});
Clazz.defineMethod (c$, "setMouseMode", 
function () {
this.drawMode = this.labelMode = false;
this.dragSelectedMode = this.vwr.getDragSelected ();
this.measuresEnabled = !this.dragSelectedMode;
if (!this.dragSelectedMode) switch (this.apm) {
default:
return;
case 32:
this.measuresEnabled = !this.isPickAtomAssignCharge;
return;
case 4:
this.drawMode = true;
this.measuresEnabled = false;
break;
case 2:
this.labelMode = true;
this.measuresEnabled = false;
break;
case 9:
this.measuresEnabled = false;
break;
case 19:
case 22:
case 20:
case 21:
this.measuresEnabled = false;
return;
}
this.exitMeasurementMode (null);
});
Clazz.defineMethod (c$, "clearMouseInfo", 
function () {
this.pressedCount = this.clickedCount = 0;
this.dragGesture.setAction (0, 0);
this.exitMeasurementMode (null);
});
Clazz.defineMethod (c$, "setDragAtomIndex", 
function (iatom) {
this.dragAtomIndex = iatom;
}, "~N");
Clazz.defineMethod (c$, "isMTClient", 
function () {
return this.isMultiTouchClient;
});
Clazz.defineMethod (c$, "isMTServer", 
function () {
return this.isMultiTouchServer;
});
Clazz.defineMethod (c$, "dispose", 
function () {
this.clear ();
});
Clazz.defineMethod (c$, "clear", 
function () {
this.startHoverWatcher (false);
if (this.predragBinding != null) this.b = this.predragBinding;
this.vwr.setPickingMode (null, 1);
this.vwr.setPickingStyle (null, this.rootPickingStyle);
this.isAltKeyReleased = true;
});
Clazz.defineMethod (c$, "startHoverWatcher", 
function (isStart) {
if (this.vwr.isPreviewOnly) return;
try {
if (isStart) {
if (this.hoverWatcherThread != null) return;
this.current.time = -1;
this.hoverWatcherThread =  new J.thread.HoverWatcherThread (this, this.current, this.moved, this.vwr);
} else {
if (this.hoverWatcherThread == null) return;
this.current.time = -1;
this.hoverWatcherThread.interrupt ();
this.hoverWatcherThread = null;
}} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
}, "~B");
Clazz.defineMethod (c$, "setModeMouse", 
function (modeMouse) {
if (modeMouse == -1) {
this.startHoverWatcher (false);
}}, "~N");
Clazz.overrideMethod (c$, "keyPressed", 
function (key, modifiers) {
if (this.keyProcessing) return false;
this.vwr.hoverOff ();
this.keyProcessing = true;
switch (key) {
case 18:
if (this.dragSelectedMode && this.isAltKeyReleased) this.vwr.moveSelected (-2147483648, 0, -2147483648, -2147483648, -2147483648, null, false, false);
this.isAltKeyReleased = false;
this.moved.modifiers |= 8;
break;
case 16:
this.dragged.modifiers |= 1;
this.moved.modifiers |= 1;
break;
case 17:
this.moved.modifiers |= 2;
break;
case 27:
this.exitMeasurementMode ("escape");
break;
}
var action = 16 | 256 | 8192 | this.moved.modifiers;
if (!this.labelMode && !this.b.isUserAction (action)) this.checkMotionRotateZoom (action, this.current.x, 0, 0, false);
if (this.vwr.getBoolean (603979889)) {
switch (key) {
case 38:
case 40:
case 37:
case 39:
case 32:
case 46:
this.vwr.navigate (key, modifiers);
break;
}
}this.keyProcessing = false;
return true;
}, "~N,~N");
Clazz.overrideMethod (c$, "keyReleased", 
function (key) {
switch (key) {
case 18:
if (this.dragSelectedMode) this.vwr.moveSelected (2147483647, 0, -2147483648, -2147483648, -2147483648, null, false, false);
this.isAltKeyReleased = true;
this.moved.modifiers &= -9;
break;
case 16:
this.moved.modifiers &= -2;
break;
case 17:
this.moved.modifiers &= -3;
}
if (this.moved.modifiers == 0) this.vwr.setCursor (0);
if (!this.vwr.getBoolean (603979889)) return;
switch (key) {
case 38:
case 40:
case 37:
case 39:
this.vwr.navigate (0, 0);
break;
}
}, "~N");
Clazz.overrideMethod (c$, "mouseEnterExit", 
function (time, x, y, isExit) {
if (this.vwr.tm.stereoDoubleDTI) x = x << 1;
this.setCurrent (time, x, y, 0);
if (isExit) this.exitMeasurementMode ("mouseExit");
}, "~N,~N,~N,~B");
Clazz.defineMethod (c$, "setMouseActions", 
 function (count, buttonMods, isRelease) {
this.pressAction = JV.binding.Binding.getMouseAction (count, buttonMods, isRelease ? 5 : 4);
this.dragAction = JV.binding.Binding.getMouseAction (count, buttonMods, 1);
this.clickAction = JV.binding.Binding.getMouseAction (count, buttonMods, 2);
}, "~N,~N,~B");
Clazz.overrideMethod (c$, "mouseAction", 
function (mode, time, x, y, count, buttonMods) {
if (!this.vwr.getMouseEnabled ()) return;
if (JU.Logger.debuggingHigh && mode != 0) this.vwr.showString ("mouse action: " + mode + " " + buttonMods + " " + JV.binding.Binding.getMouseActionName (JV.binding.Binding.getMouseAction (count, buttonMods, mode), false), false);
if (this.vwr.tm.stereoDoubleDTI) x = x << 1;
switch (mode) {
case 0:
this.setCurrent (time, x, y, buttonMods);
this.moved.setCurrent (this.current, 0);
if (this.mp != null || this.hoverActive) {
this.clickAction = JV.binding.Binding.getMouseAction (this.clickedCount, buttonMods, 0);
this.checkClickAction (x, y, time, 0);
return;
}if (this.isZoomArea (x)) {
this.checkMotionRotateZoom (this.LEFT_DRAGGED, 0, 0, 0, false);
return;
}if (this.vwr.currentCursor == 8) this.vwr.setCursor (0);
return;
case 4:
this.setMouseMode ();
this.pressedCount = (this.pressed.check (20, x, y, buttonMods, time, 700) ? this.pressedCount + 1 : 1);
if (this.pressedCount == 1) {
this.vwr.checkInMotion (1);
this.setCurrent (time, x, y, buttonMods);
}this.pressAction = JV.binding.Binding.getMouseAction (this.pressedCount, buttonMods, 4);
this.vwr.setCursor (12);
this.pressed.setCurrent (this.current, 1);
this.dragged.setCurrent (this.current, 1);
this.vwr.setFocus ();
this.dragGesture.setAction (this.dragAction, time);
this.checkPressedAction (x, y, time);
return;
case 1:
this.setMouseMode ();
this.setMouseActions (this.pressedCount, buttonMods, false);
var deltaX = x - this.dragged.x;
var deltaY = y - this.dragged.y;
this.setCurrent (time, x, y, buttonMods);
this.dragged.setCurrent (this.current, -1);
this.dragGesture.add (this.dragAction, x, y, time);
this.checkDragWheelAction (this.dragAction, x, y, deltaX, deltaY, time, 1);
return;
case 5:
this.setMouseActions (this.pressedCount, buttonMods, true);
this.setCurrent (time, x, y, buttonMods);
this.vwr.spinXYBy (0, 0, 0);
var dragRelease = !this.pressed.check (this.xyRange, x, y, buttonMods, time, 9223372036854775807);
this.checkReleaseAction (x, y, time, dragRelease);
return;
case 3:
if (this.vwr.isApplet && !this.vwr.hasFocus ()) return;
this.setCurrent (time, this.current.x, this.current.y, buttonMods);
this.checkDragWheelAction (JV.binding.Binding.getMouseAction (0, buttonMods, 3), this.current.x, this.current.y, 0, y, time, 3);
return;
case 2:
this.setMouseMode ();
this.clickedCount = (count > 1 ? count : this.clicked.check (0, 0, 0, buttonMods, time, 700) ? this.clickedCount + 1 : 1);
if (this.clickedCount == 1) {
this.setCurrent (time, x, y, buttonMods);
}this.setMouseActions (this.clickedCount, buttonMods, false);
this.clicked.setCurrent (this.current, this.clickedCount);
this.vwr.setFocus ();
if (this.apm != 9 && this.bnd (JV.binding.Binding.getMouseAction (1, buttonMods, 4), [31])) return;
this.clickAction = JV.binding.Binding.getMouseAction (this.clickedCount, buttonMods, 2);
this.checkClickAction (x, y, time, this.clickedCount);
return;
}
}, "~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "checkPressedAction", 
 function (x, y, time) {
var buttonMods = JV.binding.Binding.getButtonMods (this.pressAction);
var isDragSelectedAction = this.bnd (JV.binding.Binding.getMouseAction (1, buttonMods, 4), [31]);
if (buttonMods != 0) {
this.pressAction = this.vwr.notifyMouseClicked (x, y, this.pressAction, 4);
if (this.pressAction == 0) return;
buttonMods = JV.binding.Binding.getButtonMods (this.pressAction);
}this.setMouseActions (this.pressedCount, buttonMods, false);
if (JU.Logger.debugging) JU.Logger.debug (JV.binding.Binding.getMouseActionName (this.pressAction, false));
if (this.isDrawOrLabelAction (this.dragAction)) {
this.vwr.checkObjectDragged (-2147483648, 0, x, y, this.dragAction);
return;
}this.checkUserAction (this.pressAction, x, y, 0, 0, time, 4);
var isBound = false;
switch (this.apm) {
case 32:
isBound = this.bnd (this.clickAction, [0]);
break;
case 28:
isBound = this.bnd (this.dragAction, [7, 14]);
break;
case 26:
case 36:
case 27:
isBound = this.bnd (this.dragAction, [7, 14, 27]);
break;
case 29:
isBound = this.bnd (this.dragAction, [11, 14]);
break;
case 30:
isBound = this.bnd (this.dragAction, [11, 14, 27]);
break;
}
if (isBound) {
this.dragAtomIndex = this.vwr.findNearestAtomIndexMovable (x, y, true);
if (this.dragAtomIndex >= 0 && (this.apm == 32 || this.apm == 31) && this.vwr.ms.isAtomAssignable (this.dragAtomIndex)) {
this.enterMeasurementMode (this.dragAtomIndex);
this.mp.addPoint (this.dragAtomIndex, null, false);
}return;
}if (this.bnd (this.pressAction, [23])) {
var type = 'j';
if (this.vwr.getBoolean (603979883)) {
var t = this.vwr.checkObjectClicked (x, y, this.LEFT_CLICKED);
type = (t != null && "bond".equals (t.get ("type")) ? 'b' : this.vwr.findNearestAtomIndex (x, y) >= 0 ? 'a' : 'm');
}this.vwr.popupMenu (x, y, type);
return;
}if (this.dragSelectedMode) {
this.haveSelection = (!isDragSelectedAction || this.vwr.findNearestAtomIndexMovable (x, y, true) >= 0);
if (this.haveSelection && this.bnd (this.dragAction, [13, 14])) this.vwr.moveSelected (-2147483648, 0, -2147483648, -2147483648, -2147483648, null, false, false);
return;
}this.checkMotionRotateZoom (this.dragAction, x, 0, 0, true);
}, "~N,~N,~N");
Clazz.defineMethod (c$, "checkDragWheelAction", 
 function (dragWheelAction, x, y, deltaX, deltaY, time, mode) {
var buttonmods = JV.binding.Binding.getButtonMods (dragWheelAction);
if (buttonmods != 0) {
var newAction = this.vwr.notifyMouseClicked (x, y, JV.binding.Binding.getMouseAction (this.pressedCount, buttonmods, mode), mode);
if (newAction == 0) return;
if (newAction > 0) dragWheelAction = newAction;
}if (this.isRubberBandSelect (dragWheelAction)) {
this.calcRectRubberBand ();
this.vwr.refresh (3, "rubberBand selection");
return;
}if (this.checkUserAction (dragWheelAction, x, y, deltaX, deltaY, time, mode)) return;
if (this.vwr.getRotateBondIndex () >= 0) {
if (this.bnd (dragWheelAction, [26])) {
this.vwr.moveSelected (deltaX, deltaY, -2147483648, x, y, null, false, false);
return;
}if (!this.bnd (dragWheelAction, [25])) this.vwr.setRotateBondIndex (-1);
}var bs = null;
if (this.dragAtomIndex >= 0 && this.apm != 2) {
switch (this.apm) {
case 26:
this.dragSelected (dragWheelAction, deltaX, deltaY, true);
return;
case 36:
case 27:
case 30:
bs = this.vwr.ms.getAtoms (1094713360, JU.BSUtil.newAndSetBit (this.dragAtomIndex));
if (this.apm == 36) bs.and (this.vwr.getAtomBitSet ("ligand"));
case 28:
case 29:
if (this.dragGesture.getPointCount () == 1) this.vwr.undoMoveActionClear (this.dragAtomIndex, 2, true);
this.setMotion (13, true);
if (this.bnd (dragWheelAction, [27])) {
this.vwr.rotateSelected (this.getDegrees (deltaX, true), this.getDegrees (deltaY, false), bs);
} else {
switch (this.apm) {
case 36:
case 27:
case 30:
this.vwr.select (bs, false, 0, true);
break;
}
this.vwr.moveAtomWithHydrogens (this.dragAtomIndex, deltaX, deltaY, (this.bnd (dragWheelAction, [14]) ? -deltaY : -2147483648), bs);
}return;
}
}if (this.dragAtomIndex >= 0 && mode == 1 && this.bnd (this.clickAction, [0]) && this.apm == 32) {
var nearestAtomIndex = this.vwr.findNearestAtomIndexMovable (x, y, false);
if (nearestAtomIndex >= 0) {
if (this.mp != null) {
this.mp.setCount (1);
} else if (this.measuresEnabled) {
this.enterMeasurementMode (nearestAtomIndex);
}this.addToMeasurement (nearestAtomIndex, null, true);
this.mp.colix = 20;
} else if (this.mp != null) {
this.mp.setCount (1);
this.mp.colix = 23;
}if (this.mp == null) return;
this.mp.traceX = x;
this.mp.traceY = y;
this.vwr.refresh (3, "assignNew");
return;
}if (!this.drawMode && !this.labelMode && this.bnd (dragWheelAction, [45])) {
this.vwr.translateXYBy (deltaX, deltaY);
return;
}if (this.dragSelectedMode && this.haveSelection && this.bnd (dragWheelAction, [13, 27])) {
var iatom = this.vwr.bsA ().nextSetBit (0);
if (iatom < 0) return;
if (this.dragGesture.getPointCount () == 1) this.vwr.undoMoveActionClear (iatom, 2, true);
 else this.vwr.moveSelected (2147483647, 0, -2147483648, -2147483648, -2147483648, null, false, false);
this.dragSelected (dragWheelAction, deltaX, deltaY, false);
return;
}if (this.isDrawOrLabelAction (dragWheelAction)) {
this.setMotion (13, true);
this.vwr.checkObjectDragged (this.dragged.x, this.dragged.y, x, y, dragWheelAction);
return;
}if (this.checkMotionRotateZoom (dragWheelAction, x, deltaX, deltaY, true)) {
if (this.vwr.tm.slabEnabled && this.bnd (dragWheelAction, [39])) this.vwr.slabDepthByPixels (deltaY);
 else this.vwr.zoomBy (deltaY);
return;
}if (this.bnd (dragWheelAction, [25])) {
this.vwr.rotateXYBy (this.getDegrees (deltaX, true), this.getDegrees (deltaY, false));
return;
}if (this.bnd (dragWheelAction, [29])) {
if (deltaX == 0 && Math.abs (deltaY) > 1) {
this.setMotion (8, true);
this.vwr.zoomBy (deltaY + (deltaY > 0 ? -1 : 1));
} else if (deltaY == 0 && Math.abs (deltaX) > 1) {
this.setMotion (13, true);
this.vwr.rotateZBy (-deltaX + (deltaX > 0 ? 1 : -1), 2147483647, 2147483647);
}return;
}if (this.vwr.tm.slabEnabled) {
if (this.bnd (dragWheelAction, [6])) {
this.vwr.depthByPixels (deltaY);
return;
}if (this.bnd (dragWheelAction, [38])) {
this.vwr.slabByPixels (deltaY);
return;
}if (this.bnd (dragWheelAction, [39])) {
this.vwr.slabDepthByPixels (deltaY);
return;
}}if (this.bnd (dragWheelAction, [46])) {
this.zoomByFactor (deltaY, 2147483647, 2147483647);
return;
}if (this.bnd (dragWheelAction, [28])) {
this.setMotion (13, true);
this.vwr.rotateZBy (-deltaX, 2147483647, 2147483647);
return;
}}, "~N,~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "dragSelected", 
 function (a, deltaX, deltaY, isPickingDrag) {
this.setMotion (13, true);
if (this.bnd (a, [27]) && this.vwr.getBoolean (603979785)) this.vwr.rotateSelected (this.getDegrees (deltaX, true), this.getDegrees (deltaY, false), null);
 else this.vwr.moveSelected (deltaX, deltaY, (isPickingDrag && this.bnd (a, [14]) ? -deltaY : -2147483648), -2147483648, -2147483648, null, true, false);
}, "~N,~N,~N,~B");
Clazz.defineMethod (c$, "checkReleaseAction", 
 function (x, y, time, dragRelease) {
if (JU.Logger.debugging) JU.Logger.debug (JV.binding.Binding.getMouseActionName (this.pressAction, false));
this.vwr.checkInMotion (0);
this.vwr.setInMotion (false);
this.vwr.setCursor (0);
this.dragGesture.add (this.dragAction, x, y, time);
if (dragRelease) this.vwr.setRotateBondIndex (-2147483648);
if (this.dragAtomIndex >= 0) {
if (this.apm == 29 || this.apm == 30) this.minimize (true);
}if (this.apm == 32 && this.bnd (this.clickAction, [0])) {
if (this.mp == null || this.dragAtomIndex < 0) return;
this.assignNew (x, y);
return;
}this.dragAtomIndex = -1;
var isRbAction = this.isRubberBandSelect (this.dragAction);
if (isRbAction) this.selectRb (this.clickAction);
this.rubberbandSelectionMode = (this.b.name.equals ("drag"));
this.rectRubber.x = 2147483647;
if (dragRelease) {
this.vwr.notifyMouseClicked (x, y, JV.binding.Binding.getMouseAction (this.pressedCount, 0, 5), 5);
}if (this.isDrawOrLabelAction (this.dragAction)) {
this.vwr.checkObjectDragged (2147483647, 0, x, y, this.dragAction);
return;
}if (this.haveSelection && this.dragSelectedMode && this.bnd (this.dragAction, [13])) this.vwr.moveSelected (2147483647, 0, -2147483648, -2147483648, -2147483648, null, false, false);
if (dragRelease && this.checkUserAction (this.pressAction, x, y, 0, 0, time, 5)) return;
if (this.vwr.getBoolean (603979780)) {
if (this.bnd (this.dragAction, [44])) {
var speed = this.getExitRate ();
if (speed > 0) this.vwr.spinXYBy (this.dragGesture.getDX (4, 2), this.dragGesture.getDY (4, 2), speed * 30 * this.gestureSwipeFactor);
if (this.vwr.g.logGestures) this.vwr.log ("$NOW$ swipe " + this.dragGesture + " " + speed);
return;
}}}, "~N,~N,~N,~B");
Clazz.defineMethod (c$, "checkClickAction", 
 function (x, y, time, clickedCount) {
if (clickedCount > 0) {
if (this.checkUserAction (this.clickAction, x, y, 0, 0, time, 32768)) return;
this.clickAction = this.vwr.notifyMouseClicked (x, y, this.clickAction, 32768);
if (this.clickAction == 0) return;
}if (JU.Logger.debugging) JU.Logger.debug (JV.binding.Binding.getMouseActionName (this.clickAction, false));
if (this.bnd (this.clickAction, [2])) {
if (this.vwr.frankClicked (x, y)) {
this.vwr.popupMenu (-x, y, 'j');
return;
}if (this.vwr.frankClickedModelKit (x, y)) {
this.vwr.popupMenu (0, 0, 'm');
return;
}}var nearestPoint = null;
var isBond = false;
var isIsosurface = false;
var t = null;
if (!this.drawMode) {
t = this.vwr.checkObjectClicked (x, y, this.clickAction);
if (t != null) {
isBond = "bond".equals (t.get ("type"));
isIsosurface = "isosurface".equals (t.get ("type"));
nearestPoint = this.getPoint (t);
}}if (isBond) clickedCount = 1;
if (nearestPoint != null && Float.isNaN (nearestPoint.x)) return;
var nearestAtomIndex = this.findNearestAtom (x, y, nearestPoint, clickedCount > 0);
if (clickedCount == 0 && this.apm != 32) {
if (this.mp == null) return;
if (nearestPoint != null || this.mp.getIndexOf (nearestAtomIndex) == 0) this.mp.addPoint (nearestAtomIndex, nearestPoint, false);
if (this.mp.haveModified) this.vwr.setPendingMeasurement (this.mp);
this.vwr.refresh (3, "measurementPending");
return;
}this.setMouseMode ();
if (this.bnd (this.clickAction, [43])) {
this.vwr.tm.stopMotion ();
}if (this.vwr.getBoolean (603979889) && this.apm == 23 && this.bnd (this.clickAction, [21])) {
this.vwr.navTranslatePercent (x * 100 / this.vwr.getScreenWidth () - 50, y * 100 / this.vwr.getScreenHeight () - 50);
return;
}if (isBond) {
if (this.bnd (this.clickAction, [this.bondPickingMode == 34 || this.bondPickingMode == 33 ? 0 : 5])) {
this.bondPicked ((t.get ("index")).intValue ());
return;
}} else if (isIsosurface) {
return;
} else {
if (this.apm != 32 && this.mp != null && this.bnd (this.clickAction, [20])) {
this.atomOrPointPicked (nearestAtomIndex, nearestPoint);
if (this.addToMeasurement (nearestAtomIndex, nearestPoint, false) == 4) this.toggleMeasurement ();
return;
}if (this.bnd (this.clickAction, [37])) {
if (this.mp != null) {
this.addToMeasurement (nearestAtomIndex, nearestPoint, true);
this.toggleMeasurement ();
} else if (!this.drawMode && !this.labelMode && !this.dragSelectedMode && this.measuresEnabled) {
this.enterMeasurementMode (nearestAtomIndex);
this.addToMeasurement (nearestAtomIndex, nearestPoint, true);
}this.atomOrPointPicked (nearestAtomIndex, nearestPoint);
return;
}}if (this.isSelectAction (this.clickAction)) {
if (!isIsosurface) this.atomOrPointPicked (nearestAtomIndex, nearestPoint);
return;
}if (this.bnd (this.clickAction, [24])) {
if (nearestAtomIndex < 0) this.reset ();
return;
}}, "~N,~N,~N,~N");
Clazz.defineMethod (c$, "checkUserAction", 
 function (mouseAction, x, y, deltaX, deltaY, time, mode) {
if (!this.b.isUserAction (mouseAction)) return false;
var passThrough = false;
var obj;
var ht = this.b.getBindings ();
var mkey = mouseAction + "\t";
for (var key, $key = ht.keySet ().iterator (); $key.hasNext () && ((key = $key.next ()) || true);) {
if (key.indexOf (mkey) != 0 || !JU.AU.isAS (obj = ht.get (key))) continue;
var script = (obj)[1];
var nearestPoint = null;
if (script.indexOf ("_ATOM") >= 0) {
var iatom = this.findNearestAtom (x, y, null, true);
script = JU.PT.rep (script, "_ATOM", "({" + (iatom >= 0 ? "" + iatom : "") + "})");
if (iatom >= 0) script = JU.PT.rep (script, "_POINT", JU.Escape.eP (this.vwr.ms.at[iatom]));
}if (!this.drawMode && (script.indexOf ("_POINT") >= 0 || script.indexOf ("_OBJECT") >= 0 || script.indexOf ("_BOND") >= 0)) {
var t = this.vwr.checkObjectClicked (x, y, mouseAction);
if (t != null && (nearestPoint = t.get ("pt")) != null) {
var isBond = t.get ("type").equals ("bond");
if (isBond) script = JU.PT.rep (script, "_BOND", "[{" + t.get ("index") + "}]");
script = JU.PT.rep (script, "_POINT", JU.Escape.eP (nearestPoint));
script = JU.PT.rep (script, "_OBJECT", JU.Escape.escapeMap (t));
}script = JU.PT.rep (script, "_BOND", "[{}]");
script = JU.PT.rep (script, "_OBJECT", "{}");
}script = JU.PT.rep (script, "_POINT", "{}");
script = JU.PT.rep (script, "_ACTION", "" + mouseAction);
script = JU.PT.rep (script, "_X", "" + x);
script = JU.PT.rep (script, "_Y", "" + (this.vwr.getScreenHeight () - y));
script = JU.PT.rep (script, "_DELTAX", "" + deltaX);
script = JU.PT.rep (script, "_DELTAY", "" + deltaY);
script = JU.PT.rep (script, "_TIME", "" + time);
script = JU.PT.rep (script, "_MODE", "" + mode);
if (script.startsWith ("+:")) {
passThrough = true;
script = script.substring (2);
}this.vwr.evalStringQuiet (script);
}
return !passThrough;
}, "~N,~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "checkMotionRotateZoom", 
 function (mouseAction, x, deltaX, deltaY, isDrag) {
var isSlideZoom = this.bnd (mouseAction, [40]) && this.isZoomArea (this.pressed.x);
var isRotateXY = this.bnd (mouseAction, [25]);
var isRotateZorZoom = this.bnd (mouseAction, [29]);
if (!isSlideZoom && !isRotateXY && !isRotateZorZoom) return false;
var isZoom = (isRotateZorZoom && (deltaX == 0 || Math.abs (deltaY) > 5 * Math.abs (deltaX)));
var cursor = (isZoom || this.isZoomArea (this.moved.x) || this.bnd (mouseAction, [46]) ? 8 : isRotateXY || isRotateZorZoom ? 13 : this.bnd (mouseAction, [1]) ? 12 : 0);
this.setMotion (cursor, isDrag);
return (isZoom || isSlideZoom);
}, "~N,~N,~N,~N,~B");
Clazz.defineMethod (c$, "getExitRate", 
 function () {
var dt = this.dragGesture.getTimeDifference (2);
return (this.isMultiTouch ? (dt > (80) ? 0 : this.dragGesture.getSpeedPixelsPerMillisecond (2, 1)) : (dt > 10 ? 0 : this.dragGesture.getSpeedPixelsPerMillisecond (4, 2)));
});
Clazz.defineMethod (c$, "isRubberBandSelect", 
 function (action) {
action = action & -8193 | 32768;
return (this.rubberbandSelectionMode && this.bnd (action, [35, 34, 32]));
}, "~N");
Clazz.defineMethod (c$, "getRubberBand", 
function () {
return (this.rubberbandSelectionMode && this.rectRubber.x != 2147483647 ? this.rectRubber : null);
});
Clazz.defineMethod (c$, "calcRectRubberBand", 
 function () {
var factor = (this.vwr.antialiased ? 2 : 1);
if (this.current.x < this.pressed.x) {
this.rectRubber.x = this.current.x * factor;
this.rectRubber.width = (this.pressed.x - this.current.x) * factor;
} else {
this.rectRubber.x = this.pressed.x * factor;
this.rectRubber.width = (this.current.x - this.pressed.x) * factor;
}if (this.current.y < this.pressed.y) {
this.rectRubber.y = this.current.y * factor;
this.rectRubber.height = (this.pressed.y - this.current.y) * factor;
} else {
this.rectRubber.y = this.pressed.y * factor;
this.rectRubber.height = (this.current.y - this.pressed.y) * factor;
}});
Clazz.defineMethod (c$, "getDegrees", 
function (delta, isX) {
return delta / Math.min (500, isX ? this.vwr.getScreenWidth () : this.vwr.getScreenHeight ()) * 180 * this.mouseDragFactor;
}, "~N,~B");
Clazz.defineMethod (c$, "isZoomArea", 
 function (x) {
return x > this.vwr.getScreenWidth () * (this.vwr.tm.stereoDoubleFull || this.vwr.tm.stereoDoubleDTI ? 2 : 1) * 98 / 100;
}, "~N");
Clazz.defineMethod (c$, "getPoint", 
 function (t) {
var pt =  new JU.Point3fi ();
pt.setT (t.get ("pt"));
pt.mi = (t.get ("modelIndex")).intValue ();
return pt;
}, "java.util.Map");
Clazz.defineMethod (c$, "findNearestAtom", 
 function (x, y, nearestPoint, isClicked) {
var index = (this.drawMode || nearestPoint != null ? -1 : this.vwr.findNearestAtomIndexMovable (x, y, false));
return (index >= 0 && (isClicked || this.mp == null) && !this.vwr.slm.isInSelectionSubset (index) ? -1 : index);
}, "~N,~N,JU.Point3fi,~B");
Clazz.defineMethod (c$, "isSelectAction", 
 function (action) {
return (this.bnd (action, [17]) || !this.drawMode && !this.labelMode && this.apm == 1 && this.bnd (action, [1]) || this.dragSelectedMode && this.bnd (this.dragAction, [27, 13]) || this.bnd (action, [22, 35, 32, 34, 36, 30]));
}, "~N");
Clazz.defineMethod (c$, "enterMeasurementMode", 
 function (iAtom) {
this.vwr.setPicked (-1);
this.vwr.setPicked (iAtom);
this.vwr.setCursor (1);
this.vwr.setPendingMeasurement (this.mp = this.getMP ());
this.measurementQueued = this.mp;
}, "~N");
Clazz.defineMethod (c$, "getMP", 
 function () {
return (J.api.Interface.getInterface ("JM.MeasurementPending", this.vwr, "mouse")).set (this.vwr.ms);
});
Clazz.defineMethod (c$, "addToMeasurement", 
 function (atomIndex, nearestPoint, dblClick) {
if (atomIndex == -1 && nearestPoint == null || this.mp == null) {
this.exitMeasurementMode (null);
return 0;
}var measurementCount = this.mp.count;
if (this.mp.traceX != -2147483648 && measurementCount == 2) this.mp.setCount (measurementCount = 1);
return (measurementCount == 4 && !dblClick ? measurementCount : this.mp.addPoint (atomIndex, nearestPoint, true));
}, "~N,JU.Point3fi,~B");
Clazz.defineMethod (c$, "resetMeasurement", 
 function () {
this.exitMeasurementMode (null);
this.measurementQueued = this.getMP ();
});
Clazz.defineMethod (c$, "exitMeasurementMode", 
function (refreshWhy) {
if (this.mp == null) return;
this.vwr.setPendingMeasurement (this.mp = null);
this.vwr.setCursor (0);
if (refreshWhy != null) this.vwr.refresh (3, refreshWhy);
}, "~S");
Clazz.defineMethod (c$, "getSequence", 
 function () {
var a1 = this.measurementQueued.getAtomIndex (1);
var a2 = this.measurementQueued.getAtomIndex (2);
if (a1 < 0 || a2 < 0) return;
try {
var sequence = this.vwr.getSmilesOpt (null, a1, a2, 1048576, null);
this.vwr.setStatusMeasuring ("measureSequence", -2, sequence, 0);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
JU.Logger.error (e.toString ());
} else {
throw e;
}
}
});
Clazz.defineMethod (c$, "minimize", 
 function (dragDone) {
var iAtom = this.dragAtomIndex;
if (dragDone) this.dragAtomIndex = -1;
this.vwr.dragMinimizeAtom (iAtom);
}, "~B");
Clazz.defineMethod (c$, "queueAtom", 
 function (atomIndex, ptClicked) {
var n = this.measurementQueued.addPoint (atomIndex, ptClicked, true);
if (atomIndex >= 0) this.vwr.setStatusAtomPicked (atomIndex, "Atom #" + n + ":" + this.vwr.getAtomInfo (atomIndex), null);
return n;
}, "~N,JU.Point3fi");
Clazz.defineMethod (c$, "setMotion", 
function (cursor, inMotion) {
switch (this.vwr.currentCursor) {
case 3:
break;
default:
this.vwr.setCursor (cursor);
}
if (inMotion) this.vwr.setInMotion (true);
}, "~N,~B");
Clazz.defineMethod (c$, "zoomByFactor", 
function (dz, x, y) {
if (dz == 0) return;
this.setMotion (8, true);
this.vwr.zoomByFactor (Math.pow (this.mouseWheelFactor, dz), x, y);
this.vwr.setInMotion (false);
}, "~N,~N,~N");
Clazz.defineMethod (c$, "runScript", 
 function (script) {
this.vwr.script (script);
}, "~S");
Clazz.defineMethod (c$, "atomOrPointPicked", 
 function (atomIndex, ptClicked) {
if (atomIndex < 0) {
this.resetMeasurement ();
if (this.bnd (this.clickAction, [33])) {
this.runScript ("select none");
return;
}if (this.apm != 5 && this.apm != 6) return;
}var n = 2;
switch (this.apm) {
case 28:
case 29:
return;
case 0:
return;
case 25:
case 24:
case 8:
var isDelete = (this.apm == 8);
var isStruts = (this.apm == 25);
if (!this.bnd (this.clickAction, [(isDelete ? 5 : 3)])) return;
if (this.measurementQueued == null || this.measurementQueued.count == 0 || this.measurementQueued.count > 2) {
this.resetMeasurement ();
this.enterMeasurementMode (atomIndex);
}this.addToMeasurement (atomIndex, ptClicked, true);
if (this.queueAtom (atomIndex, ptClicked) != 2) return;
var cAction = (isDelete || this.measurementQueued.isConnected (this.vwr.ms.at, 2) ? " DELETE" : isStruts ? "STRUTS" : "");
this.runScript ("connect " + this.measurementQueued.getMeasurementScript (" ", true) + cAction);
this.resetMeasurement ();
return;
case 21:
n++;
case 20:
n++;
case 18:
case 19:
case 22:
if (!this.bnd (this.clickAction, [20])) return;
if (this.measurementQueued == null || this.measurementQueued.count == 0 || this.measurementQueued.count > n) {
this.resetMeasurement ();
this.enterMeasurementMode (atomIndex);
}this.addToMeasurement (atomIndex, ptClicked, true);
this.queueAtom (atomIndex, ptClicked);
var i = this.measurementQueued.count;
if (i == 1) {
this.vwr.setPicked (-1);
this.vwr.setPicked (atomIndex);
}if (i < n) return;
if (this.apm == 22) {
this.getSequence ();
} else {
this.vwr.setStatusMeasuring ("measurePicked", n, this.measurementQueued.getStringDetail (), this.measurementQueued.value);
if (this.apm == 18 || this.pickingStyleMeasure == 4) {
this.runScript ("measure " + this.measurementQueued.getMeasurementScript (" ", true));
}}this.resetMeasurement ();
return;
}
var mode = (this.mp != null && this.apm != 1 ? 1 : this.apm);
switch (mode) {
case 3:
if (!this.bnd (this.clickAction, [17])) return;
if (ptClicked == null) {
this.zoomTo (atomIndex);
} else {
this.runScript ("zoomTo " + JU.Escape.eP (ptClicked));
}return;
case 5:
case 6:
if (this.bnd (this.clickAction, [17])) this.checkTwoAtomAction (ptClicked, atomIndex);
}
if (ptClicked != null) return;
var bs;
switch (mode) {
case 1:
if (!this.drawMode && !this.labelMode && this.bnd (this.clickAction, [1])) this.zoomTo (atomIndex);
 else if (this.bnd (this.clickAction, [17])) this.vwr.setStatusAtomPicked (atomIndex, null, null);
return;
case 2:
if (this.bnd (this.clickAction, [19])) {
this.runScript ("set labeltoggle {atomindex=" + atomIndex + "}");
this.vwr.setStatusAtomPicked (atomIndex, null, null);
}return;
case 31:
if (this.bnd (this.clickAction, [0])) this.vwr.invertRingAt (atomIndex, true);
return;
case 7:
if (this.bnd (this.clickAction, [4])) {
bs = JU.BSUtil.newAndSetBit (atomIndex);
this.vwr.deleteAtoms (bs, false);
this.vwr.setStatusAtomPicked (atomIndex, "deleted: " + JU.Escape.eBS (bs), null);
}return;
}
var spec = "atomindex=" + atomIndex;
switch (this.apm) {
default:
return;
case 9:
this.selectAtoms (spec);
break;
case 10:
this.selectAtoms ("within(group, " + spec + ")");
break;
case 11:
this.selectAtoms ("within(chain, " + spec + ")");
break;
case 13:
this.selectAtoms ("within(polymer, " + spec + ")");
break;
case 14:
this.selectAtoms ("within(structure, " + spec + ")");
break;
case 12:
this.selectAtoms ("within(molecule, " + spec + ")");
break;
case 16:
this.selectAtoms ("within(model, " + spec + ")");
break;
case 17:
this.selectAtoms ("visible and within(element, " + spec + ")");
break;
case 15:
this.selectAtoms ("visible and within(site, " + spec + ")");
break;
}
this.vwr.clearClickCount ();
this.vwr.setStatusAtomPicked (atomIndex, null, null);
}, "~N,JU.Point3fi");
Clazz.defineMethod (c$, "assignNew", 
 function (x, y) {
if (this.mp.count == 2) {
this.vwr.undoMoveActionClear (-1, 4146, true);
this.runScript ("assign connect " + this.mp.getMeasurementScript (" ", false));
} else if (this.pickAtomAssignType.equals ("Xx")) {
this.exitMeasurementMode ("bond dropped");
} else {
if (this.pressed.inRange (this.xyRange, this.dragged.x, this.dragged.y)) {
var s = "assign atom ({" + this.dragAtomIndex + "}) \"" + this.pickAtomAssignType + "\"";
if (this.isPickAtomAssignCharge) {
s += ";{atomindex=" + this.dragAtomIndex + "}.label='%C'; ";
this.vwr.undoMoveActionClear (this.dragAtomIndex, 4, true);
} else {
this.vwr.undoMoveActionClear (-1, 4146, true);
}this.runScript (s);
} else if (!this.isPickAtomAssignCharge) {
this.vwr.undoMoveActionClear (-1, 4146, true);
var a = this.vwr.ms.at[this.dragAtomIndex];
if (a.getElementNumber () == 1) {
this.runScript ("assign atom ({" + this.dragAtomIndex + "}) \"X\"");
} else {
var ptNew = JU.P3.new3 (x, y, a.sZ);
this.vwr.tm.unTransformPoint (ptNew, ptNew);
this.runScript ("assign atom ({" + this.dragAtomIndex + "}) \"" + this.pickAtomAssignType + "\" " + JU.Escape.eP (ptNew));
}}}this.exitMeasurementMode (null);
}, "~N,~N");
Clazz.defineMethod (c$, "bondPicked", 
 function (index) {
if (this.bondPickingMode == 33) this.vwr.undoMoveActionClear (-1, 4146, true);
switch (this.bondPickingMode) {
case 33:
this.runScript ("assign bond [{" + index + "}] \"" + this.pickBondAssignType + "\"");
break;
case 34:
this.vwr.setRotateBondIndex (index);
break;
case 8:
this.vwr.deleteBonds (JU.BSUtil.newAndSetBit (index));
}
}, "~N");
Clazz.defineMethod (c$, "checkTwoAtomAction", 
 function (ptClicked, atomIndex) {
var isSpin = (this.apm == 5);
if (this.vwr.tm.spinOn || this.vwr.tm.navOn || this.vwr.getPendingMeasurement () != null) {
this.resetMeasurement ();
if (this.vwr.tm.spinOn) this.runScript ("spin off");
return;
}if (this.measurementQueued.count >= 2) this.resetMeasurement ();
var queuedAtomCount = this.measurementQueued.count;
if (queuedAtomCount == 1) {
if (ptClicked == null) {
if (this.measurementQueued.getAtomIndex (1) == atomIndex) return;
} else {
if (this.measurementQueued.getAtom (1).distance (ptClicked) == 0) return;
}}if (atomIndex >= 0 || ptClicked != null) queuedAtomCount = this.queueAtom (atomIndex, ptClicked);
if (queuedAtomCount < 2) {
if (isSpin) this.vwr.scriptStatus (queuedAtomCount == 1 ? J.i18n.GT._ ("pick one more atom in order to spin the model around an axis") : J.i18n.GT._ ("pick two atoms in order to spin the model around an axis"));
 else this.vwr.scriptStatus (queuedAtomCount == 1 ? J.i18n.GT._ ("pick one more atom in order to display the symmetry relationship") : J.i18n.GT._ ("pick two atoms in order to display the symmetry relationship between them"));
return;
}var s = this.measurementQueued.getMeasurementScript (" ", false);
if (isSpin) this.runScript ("spin" + s + " " + this.vwr.getInt (553648157));
 else this.runScript ("draw symop " + s + ";show symop " + s);
}, "JU.Point3fi,~N");
Clazz.defineMethod (c$, "reset", 
 function () {
this.runScript ("!reset");
});
Clazz.defineMethod (c$, "selectAtoms", 
 function (item) {
if (this.mp != null || this.selectionWorking) return;
this.selectionWorking = true;
var s = (this.rubberbandSelectionMode || this.bnd (this.clickAction, [35]) ? "selected and not (" + item + ") or (not selected) and " : this.bnd (this.clickAction, [32]) ? "selected and not " : this.bnd (this.clickAction, [34]) ? "selected or " : this.clickAction == 0 || this.bnd (this.clickAction, [36]) ? "selected tog " : this.bnd (this.clickAction, [30]) ? "" : null);
if (s != null) {
s += "(" + item + ")";
try {
var bs = this.vwr.getAtomBitSetEval (null, s);
this.vwr.select (bs, false, 0, false);
this.vwr.refresh (3, "selections set");
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
}this.selectionWorking = false;
}, "~S");
Clazz.defineMethod (c$, "selectRb", 
 function (action) {
var bs = this.vwr.ms.findAtomsInRectangle (this.rectRubber);
if (bs.length () > 0) {
var s = JU.Escape.eBS (bs);
if (this.bnd (action, [34])) this.runScript ("selectionHalos on;select selected or " + s);
 else if (this.bnd (action, [32])) this.runScript ("selectionHalos on;select selected and not " + s);
 else this.runScript ("selectionHalos on;select selected tog " + s);
}this.vwr.refresh (3, "mouseReleased");
}, "~N");
Clazz.defineMethod (c$, "toggleMeasurement", 
 function () {
if (this.mp == null) return;
var measurementCount = this.mp.count;
if (measurementCount >= 2 && measurementCount <= 4) this.runScript ("!measure " + this.mp.getMeasurementScript (" ", true));
this.exitMeasurementMode (null);
});
Clazz.defineMethod (c$, "zoomTo", 
 function (atomIndex) {
this.runScript ("zoomTo (atomindex=" + atomIndex + ")");
this.vwr.setStatusAtomPicked (atomIndex, null, null);
}, "~N");
Clazz.overrideMethod (c$, "keyTyped", 
function (keyChar, modifiers) {
return false;
}, "~N,~N");
Clazz.defineStatics (c$,
"ACTION_assignNew", 0,
"ACTION_center", 1,
"ACTION_clickFrank", 2,
"ACTION_connectAtoms", 3,
"ACTION_deleteAtom", 4,
"ACTION_deleteBond", 5,
"ACTION_depth", 6,
"ACTION_dragAtom", 7,
"ACTION_dragDrawObject", 8,
"ACTION_dragDrawPoint", 9,
"ACTION_dragLabel", 10,
"ACTION_dragMinimize", 11,
"ACTION_dragMinimizeMolecule", 12,
"ACTION_dragSelected", 13,
"ACTION_dragZ", 14,
"ACTION_multiTouchSimulation", 15,
"ACTION_navTranslate", 16,
"ACTION_pickAtom", 17,
"ACTION_pickIsosurface", 18,
"ACTION_pickLabel", 19,
"ACTION_pickMeasure", 20,
"ACTION_pickNavigate", 21,
"ACTION_pickPoint", 22,
"ACTION_popupMenu", 23,
"ACTION_reset", 24,
"ACTION_rotate", 25,
"ACTION_rotateBranch", 26,
"ACTION_rotateSelected", 27,
"ACTION_rotateZ", 28,
"ACTION_rotateZorZoom", 29,
"ACTION_select", 30,
"ACTION_selectAndDrag", 31,
"ACTION_selectAndNot", 32,
"ACTION_selectNone", 33,
"ACTION_selectOr", 34,
"ACTION_selectToggle", 35,
"ACTION_selectToggleExtended", 36,
"ACTION_setMeasure", 37,
"ACTION_slab", 38,
"ACTION_slabAndDepth", 39,
"ACTION_slideZoom", 40,
"ACTION_spinDrawObjectCCW", 41,
"ACTION_spinDrawObjectCW", 42,
"ACTION_stopMotion", 43,
"ACTION_swipe", 44,
"ACTION_translate", 45,
"ACTION_wheelZoom", 46,
"ACTION_count", 47);
c$.actionInfo = c$.prototype.actionInfo =  new Array (47);
c$.actionNames = c$.prototype.actionNames =  new Array (47);
Clazz.defineStatics (c$,
"PICKING_OFF", 0,
"PICKING_IDENTIFY", 1,
"PICKING_LABEL", 2,
"PICKING_CENTER", 3,
"PICKING_DRAW", 4,
"PICKING_SPIN", 5,
"PICKING_SYMMETRY", 6,
"PICKING_DELETE_ATOM", 7,
"PICKING_DELETE_BOND", 8,
"PICKING_SELECT_ATOM", 9,
"PICKING_SELECT_GROUP", 10,
"PICKING_SELECT_CHAIN", 11,
"PICKING_SELECT_MOLECULE", 12,
"PICKING_SELECT_POLYMER", 13,
"PICKING_SELECT_STRUCTURE", 14,
"PICKING_SELECT_SITE", 15,
"PICKING_SELECT_MODEL", 16,
"PICKING_SELECT_ELEMENT", 17,
"PICKING_MEASURE", 18,
"PICKING_MEASURE_DISTANCE", 19,
"PICKING_MEASURE_ANGLE", 20,
"PICKING_MEASURE_TORSION", 21,
"PICKING_MEASURE_SEQUENCE", 22,
"PICKING_NAVIGATE", 23,
"PICKING_CONNECT", 24,
"PICKING_STRUTS", 25,
"PICKING_DRAG_SELECTED", 26,
"PICKING_DRAG_MOLECULE", 27,
"PICKING_DRAG_ATOM", 28,
"PICKING_DRAG_MINIMIZE", 29,
"PICKING_DRAG_MINIMIZE_MOLECULE", 30,
"PICKING_INVERT_STEREO", 31,
"PICKING_ASSIGN_ATOM", 32,
"PICKING_ASSIGN_BOND", 33,
"PICKING_ROTATE_BOND", 34,
"PICKING_IDENTIFY_BOND", 35,
"PICKING_DRAG_LIGAND", 36,
"PICKINGSTYLE_SELECT_JMOL", 0,
"PICKINGSTYLE_SELECT_CHIME", 0,
"PICKINGSTYLE_SELECT_RASMOL", 1,
"PICKINGSTYLE_SELECT_PFAAT", 2,
"PICKINGSTYLE_SELECT_DRAG", 3,
"PICKINGSTYLE_MEASURE_ON", 4,
"PICKINGSTYLE_MEASURE_OFF", 5,
"pickingModeNames", null);
{
JV.ActionManager.pickingModeNames = "off identify label center draw spin symmetry deleteatom deletebond atom group chain molecule polymer structure site model element measure distance angle torsion sequence navigate connect struts dragselected dragmolecule dragatom dragminimize dragminimizemolecule invertstereo assignatom assignbond rotatebond identifybond dragligand".$plit (" ");
}Clazz.defineStatics (c$,
"pickingStyleNames", null);
{
JV.ActionManager.pickingStyleNames = "toggle selectOrToggle extendedSelect drag measure measureoff".$plit (" ");
}Clazz.defineStatics (c$,
"MAX_DOUBLE_CLICK_MILLIS", 700,
"MININUM_GESTURE_DELAY_MILLISECONDS", 10,
"SLIDE_ZOOM_X_PERCENT", 98,
"DEFAULT_MOUSE_DRAG_FACTOR", 1,
"DEFAULT_MOUSE_WHEEL_FACTOR", 1.15,
"DEFAULT_GESTURE_SWIPE_FACTOR", 1);
c$ = Clazz.decorateAsClass (function () {
this.index = 0;
this.x = 0;
this.y = 0;
this.time = 0;
Clazz.instantialize (this, arguments);
}, JV, "MotionPoint");
Clazz.defineMethod (c$, "set", 
function (index, x, y, time) {
this.index = index;
this.x = x;
this.y = y;
this.time = time;
}, "~N,~N,~N,~N");
Clazz.overrideMethod (c$, "toString", 
function () {
return "[x = " + this.x + " y = " + this.y + " time = " + this.time + " ]";
});
c$ = Clazz.decorateAsClass (function () {
this.action = 0;
this.nodes = null;
this.ptNext = 0;
this.time0 = 0;
this.vwr = null;
Clazz.instantialize (this, arguments);
}, JV, "Gesture");
Clazz.makeConstructor (c$, 
function (nPoints, vwr) {
this.vwr = vwr;
this.nodes =  new Array (nPoints);
for (var i = 0; i < nPoints; i++) this.nodes[i] =  new JV.MotionPoint ();

}, "~N,JV.Viewer");
Clazz.defineMethod (c$, "setAction", 
function (action, time) {
this.action = action;
this.ptNext = 0;
this.time0 = time;
for (var i = 0; i < this.nodes.length; i++) this.nodes[i].index = -1;

}, "~N,~N");
Clazz.defineMethod (c$, "add", 
function (action, x, y, time) {
this.action = action;
this.getNode (this.ptNext).set (this.ptNext, x, y, time - this.time0);
this.ptNext++;
return this.ptNext;
}, "~N,~N,~N,~N");
Clazz.defineMethod (c$, "getTimeDifference", 
function (nPoints) {
nPoints = this.getPointCount2 (nPoints, 0);
if (nPoints < 2) return 0;
var mp1 = this.getNode (this.ptNext - 1);
var mp0 = this.getNode (this.ptNext - nPoints);
return mp1.time - mp0.time;
}, "~N");
Clazz.defineMethod (c$, "getSpeedPixelsPerMillisecond", 
function (nPoints, nPointsPrevious) {
nPoints = this.getPointCount2 (nPoints, nPointsPrevious);
if (nPoints < 2) return 0;
var mp1 = this.getNode (this.ptNext - 1 - nPointsPrevious);
var mp0 = this.getNode (this.ptNext - nPoints - nPointsPrevious);
var dx = ((mp1.x - mp0.x)) / this.vwr.getScreenWidth () * 360;
var dy = ((mp1.y - mp0.y)) / this.vwr.getScreenHeight () * 360;
return Math.sqrt (dx * dx + dy * dy) / (mp1.time - mp0.time);
}, "~N,~N");
Clazz.defineMethod (c$, "getDX", 
function (nPoints, nPointsPrevious) {
nPoints = this.getPointCount2 (nPoints, nPointsPrevious);
if (nPoints < 2) return 0;
var mp1 = this.getNode (this.ptNext - 1 - nPointsPrevious);
var mp0 = this.getNode (this.ptNext - nPoints - nPointsPrevious);
return mp1.x - mp0.x;
}, "~N,~N");
Clazz.defineMethod (c$, "getDY", 
function (nPoints, nPointsPrevious) {
nPoints = this.getPointCount2 (nPoints, nPointsPrevious);
if (nPoints < 2) return 0;
var mp1 = this.getNode (this.ptNext - 1 - nPointsPrevious);
var mp0 = this.getNode (this.ptNext - nPoints - nPointsPrevious);
return mp1.y - mp0.y;
}, "~N,~N");
Clazz.defineMethod (c$, "getPointCount", 
function () {
return this.ptNext;
});
Clazz.defineMethod (c$, "getPointCount2", 
 function (nPoints, nPointsPrevious) {
if (nPoints > this.nodes.length - nPointsPrevious) nPoints = this.nodes.length - nPointsPrevious;
var n = nPoints + 1;
for (; --n >= 0; ) if (this.getNode (this.ptNext - n - nPointsPrevious).index >= 0) break;

return n;
}, "~N,~N");
Clazz.defineMethod (c$, "getNode", 
function (i) {
return this.nodes[(i + this.nodes.length + this.nodes.length) % this.nodes.length];
}, "~N");
Clazz.overrideMethod (c$, "toString", 
function () {
if (this.nodes.length == 0) return "" + this;
return JV.binding.Binding.getMouseActionName (this.action, false) + " nPoints = " + this.ptNext + " " + this.nodes[0];
});
});
