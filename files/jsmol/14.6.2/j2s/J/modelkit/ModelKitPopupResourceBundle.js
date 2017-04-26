Clazz.declarePackage ("J.modelkit");
Clazz.load (["J.popup.PopupResource"], "J.modelkit.ModelKitPopupResourceBundle", ["J.i18n.GT"], function () {
c$ = Clazz.declareType (J.modelkit, "ModelKitPopupResourceBundle", J.popup.PopupResource);
Clazz.overrideMethod (c$, "getMenuName", 
function () {
return "modelkitMenu";
});
Clazz.overrideMethod (c$, "buildStructure", 
function (menuStructure) {
this.addItems (J.modelkit.ModelKitPopupResourceBundle.menuContents);
this.addItems (J.modelkit.ModelKitPopupResourceBundle.structureContents);
if (menuStructure != null) this.setStructure (menuStructure,  new J.i18n.GT ());
}, "~S");
Clazz.overrideMethod (c$, "getWordContents", 
function () {
var wasTranslating = J.i18n.GT.setDoTranslate (true);
var words =  Clazz.newArray (-1, ["atomMenu", "<atoms.png>", "moreAtomMenu", "<dotdotdot.png>", "bondMenu", "<bonds.png>", "optionsMenu", "<dotdotdot.png>", "new", J.i18n.GT._ ("new"), "undo", J.i18n.GT._ ("undo (CTRL-Z)"), "redo", J.i18n.GT._ ("redo (CTRL-Y)"), "center", J.i18n.GT._ ("center"), "addh", J.i18n.GT._ ("add hydrogens"), "minimize", J.i18n.GT._ ("minimize"), "hmin", J.i18n.GT._ ("fix hydrogens and minimize"), "clearQ", J.i18n.GT._ ("clear"), "SIGNEDsaveFile", J.i18n.GT._ ("save file"), "SIGNEDsaveState", J.i18n.GT._ ("save state"), "invertStereoP!CB", J.i18n.GT._ ("invert ring stereochemistry"), "assignAtom_XP!CB", J.i18n.GT._ ("delete atom"), "assignAtom_XxP!CB", J.i18n.GT._ ("drag to bond"), "dragAtomP!CB", J.i18n.GT._ ("drag atom"), "dragMinimizeP!CB", J.i18n.GT._ ("drag atom (and minimize)"), "dragMoleculeP!CB", J.i18n.GT._ ("drag molecule (ALT to rotate)"), "dragMinimizeMoleculeP!CB", J.i18n.GT._ ("drag and minimize molecule (docking)"), "assignAtom_CP!CB", "C", "assignAtom_HP!CB", "H", "assignAtom_NP!CB", "N", "assignAtom_OP!CB", "O", "assignAtom_FP!CB", "F", "assignAtom_ClP!CB", "Cl", "assignAtom_BrP!CB", "Br", "_??P!CB", "??", "assignAtom_PlP!CB", J.i18n.GT._ ("increase charge"), "assignAtom_MiP!CB", J.i18n.GT._ ("decrease charge"), "assignBond_0P!CB", J.i18n.GT._ ("delete bond"), "assignBond_1P!CB", J.i18n.GT._ ("single"), "assignBond_2P!CB", J.i18n.GT._ ("double"), "assignBond_3P!CB", J.i18n.GT._ ("triple"), "assignBond_pP!CB", J.i18n.GT._ ("increase order"), "assignBond_mP!CB", J.i18n.GT._ ("decrease order"), "rotateBondP!CB", J.i18n.GT._ ("rotate bond (SHIFT-DRAG)"), "exit", J.i18n.GT._ ("exit modelkit mode")]);
J.i18n.GT.setDoTranslate (wasTranslating);
return words;
});
Clazz.overrideMethod (c$, "getMenuAsText", 
function (title) {
return this.getStuctureAsText (title, J.modelkit.ModelKitPopupResourceBundle.menuContents, J.modelkit.ModelKitPopupResourceBundle.structureContents);
}, "~S");
Clazz.defineStatics (c$,
"MENU_NAME", "modelkitMenu");
c$.menuContents = c$.prototype.menuContents =  Clazz.newArray (-1, [ Clazz.newArray (-1, ["modelkitMenu", "atomMenu bondMenu optionsMenu"]),  Clazz.newArray (-1, ["optionsMenu", "new center addh minimize hmin  - undo redo - SIGNEDsaveFile SIGNEDsaveState exit"]),  Clazz.newArray (-1, ["atomMenu", "assignAtom_XP!CB assignAtom_XxP!CB dragAtomP!CB dragMinimizeP!CB dragMoleculeP!CB dragMinimizeMoleculeP!CB invertStereoP!CB - assignAtom_CP!CB assignAtom_HP!CB assignAtom_NP!CB assignAtom_OP!CB assignAtom_FP!CB assignAtom_ClP!CB assignAtom_BrP!CB _??P!CB _??P!CB _??P!CB moreAtomMenu - assignAtom_PlP!CB assignAtom_MiP!CB"]),  Clazz.newArray (-1, ["moreAtomMenu", "clearQ - _??P!CB _??P!CB _??P!CB _??P!CB _??P!CB _??P!CB "]),  Clazz.newArray (-1, ["bondMenu", "assignBond_0P!CB assignBond_1P!CB assignBond_2P!CB assignBond_3P!CB - assignBond_pP!CB assignBond_mP!CB - rotateBondP!CB"])]);
Clazz.defineStatics (c$,
"structureContents",  Clazz.newArray (-1, [ Clazz.newArray (-1, ["new", "zap"]),  Clazz.newArray (-1, ["center", "zoomto 0 {visible} 0/1.5"]),  Clazz.newArray (-1, ["addh", "calculate hydrogens {model=_lastframe}"]),  Clazz.newArray (-1, ["minimize", "minimize"]),  Clazz.newArray (-1, ["hmin", "delete hydrogens and model=_lastframe; minimize addhydrogens"]),  Clazz.newArray (-1, ["SIGNEDsaveFile", "select visible;write COORD '?jmol.mol'"]),  Clazz.newArray (-1, ["SIGNEDsaveState", "write '?jmol.jpg'"]),  Clazz.newArray (-1, ["clearQ", "clearQ"]),  Clazz.newArray (-1, ["undo", "!UNDO"]),  Clazz.newArray (-1, ["redo", "!REDO"]),  Clazz.newArray (-1, ["exit", "set modelkitMode false"])]));
});
