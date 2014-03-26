YUI.add('gallery-get-selection', function(Y) {

/**
 * Getting a DOM fragment with the dom structure selected by the user.
 * @module gallery-get-selection
 * @requires node
 */

/**
 * Return a DOM Fragment with the dom structure selected by the user to
 * facilitate the analysis of that fragment.
 * E.g., Y.getSelection().all('p').size() will give you the number of paragraphs
 * selected by the user.
 * @class getSelection
 * @static
 */

/*
 * All the credit for Dav Glass (@davglass), since he has provided
 * the whole chunk of code, I just did the monkey work.
 */
Y.getSelection = function () {
    var sel,
        winsel,
        frag;

    if (Y.config.win.getSelection) {
        winsel = Y.config.win.getSelection();
        if (winsel.rangeCount > 0) {
            sel = winsel.getRangeAt(0);
        }
    } else if (Y.config.doc.selection) {
        sel = Y.config.doc.selection.createRange();
    }

    if (sel && sel.cloneContents) {
        frag = sel.cloneContents();
    } else if (sel && sel.htmlText) {
        frag = Y.Node.create(sel.htmlText);
    }

    return Y.Node.create('<div></div>').append(frag);
};


}, 'gallery-2012.10.17-20-00' ,{requires:['node']});
