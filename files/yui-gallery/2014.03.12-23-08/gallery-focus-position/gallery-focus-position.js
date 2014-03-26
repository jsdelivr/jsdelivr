YUI.add('gallery-focus-position', function(Y) {

var _focus = Y.Node.prototype.focus;

Y.Node.prototype.focus = function (position) {
  if (position === "end") {
    position = this.get ("value").length;
  } else if (!Y.Lang.isNumber (position)) {
    _focus.apply (this);
    return;
  }

  var _node = this._node, range;
  /* Code Taken From ->
     http://stackoverflow.com/questions/512528/set-cursor-position-in-html-textbox */
  if(_node.setSelectionRange) {
    _node.focus ();
    _node.setSelectionRange (position, position);
  } else if (_node.createTextRange) {
    range = _node.createTextRange();
    range.collapse (true);
    range.moveEnd ('character', position);
    range.moveStart ('character', position);
    range.select ();
  }
};


}, 'gallery-2012.05.16-20-37' ,{requires:['node'], skinnable:false});
