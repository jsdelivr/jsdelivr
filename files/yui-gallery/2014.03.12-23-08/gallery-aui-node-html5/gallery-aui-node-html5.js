YUI.add('gallery-aui-node-html5', function(A) {

/**
 * aui-node-html5 provides support for HTML shiv natively on the Alloy dom
 * methods. The HTML5 shiv just affects IE.
 *
 * @module aui-node
 * @submodule aui-node-html5
 */

if (A.UA.ie) {
	/**
	 * <p>An object that encapsulates util methods for HTML5 shiving.</p>
	 * <h2>What is a "shiv"?</h1>
	 * <p>To the world, a shiv is a slang term for a sharp object used as a
     * knife-like weapon. To Internet Explorer, a shiv is a script that, when
     * executed, forces the browser to recognize HTML5 elements.</p>
	 *
	 * @class A.HTML5
	 */
	var HTML5 = A.namespace('HTML5'),
		DOM_create = A.DOM._create;

	if (!HTML5._fragHTML5Shived) {
		/**
		 * A global DocumentFragment already HTML5 shived, for performance
         * reasons. (i.e., all nodes and its HTML5 children appended to this
         * fragment iherits the styles on IE).
		 *
		 * @property A.HTML._fragHTML5Shived
		 * @type DocumentFragment (shived)
		 * @protected
		 */
		HTML5._fragHTML5Shived = YUI.AUI.html5shiv(
			document.createDocumentFragment()
		);
	}

	A.mix(
		HTML5,
		{
			/**
			 * Receives a <code>frag</code> and a HTML content. This method
             * shivs the HTML5 nodes appended to a Node or fragment which is not
             * on the document yet.
			 *
			 * @method IECreateFix
			 * @param {Node | DocumentFragment} frag Fragment to be fixed.
			 * @param {String} content HTML to be set (using innerHTML) on the <code>frag</code>.
			 * @return {Node | DocumentFragment}
			 */
			IECreateFix: function(frag, content) {
				var shivedFrag = HTML5._fragHTML5Shived;

				shivedFrag.appendChild(frag);

				frag.innerHTML = content;

				shivedFrag.removeChild(frag);

				return frag;
			},

			/**
			 * AOP listener to the A.DOM._create method. This method
             * intercepts all the calls to the A.DOM._create and append the
             * generated fragment to <a
             * href="A.HTML5.html#property_A.HTML._fragHTML5Shived">A.HTML._fragHTML5Shived</a>,
             * this fixes the IE bug for painting the HTML5 nodes on the HTML
             * fragment.
			 *
			 * @method _doBeforeCreate
			 * @param {String} html HTML content
			 * @param {String} doc
			 * @param {String} tag
			 * @protected
			 * @return {DocumentFragment}
			 */
			_doBeforeCreate: function(html, doc, tag) {
				var createdFrag = DOM_create.apply(this, arguments);

				var shivedFrag = HTML5.IECreateFix(createdFrag, html);

				return new A.Do.Halt(null, shivedFrag);
			}
		}
	);

	A.Do.before(HTML5._doBeforeCreate, A.DOM, '_create', A.DOM);
}


}, 'gallery-2011.02.09-21-32' ,{requires:['collection','gallery-aui-base']});
