/**
 * Tree walking functions.
 *
 * prewalk(form, fn, leaf)
 *
 *     Descend into the given tree and build a new tree with the result
 *     of applying the given function to each branch and leaf.
 *
 *     An optional leaf function will be applied only to the leaves of
 *     the tree before being applied to the given function.
 *
 *     The given function is applied as the tree is descended into - the
 *     function application (pre)cedes descending into the tree.
 *
 * postwalk(form, fn, leaf)
 *
 *     The same as prewalk, except the given function is applied as
 *     the tree is ascended.
 *
 * preprune(form, pred, leaf)
 *
 *     The same as prewalk, except fn is a predicate function and any
 *     branch or leaf that is encountered and for which pred returns
 *     true is removed from the tree.
 *
 * postprune(form, pred, leaf)
 *
 *     The same as preprune, except the predicate function is applied as
 *     the tree is ascended.
 *
 * leaves(form, leaf)
 *
 *     Invokes the given leaf function for each leaf in the tree.
 *
 * flatten(form)
 *
 *     Makes an array of all leaves in the tree.
 */
define(['jquery', 'util/functions'],function($, Functions){
	

	function walk(form, recurse, leaf) {
		var type = $.type(form),
		    result;
		if ('array' === type) {
			result = [];
			for (var i = 0, len = form.length; i < len; i++) {
				recurse(form[i], result.length, result);
			}
		} else if ('object' === type) {
			result = {};
			for (var key in form) {
				if (form.hasOwnProperty(key)) {
					recurse(form[key], key, result);
				}
			}
		} else {
			result = leaf(form);
		}
		return result;
	}
	
	function prewalk(form, fn, leaf, recurse, key, result) {
		result[key] = walk(
			fn(form),
			recurse,
			leaf
		);
	}

	function postwalk(form, fn, leaf, recurse, key, result) {
		result[key] = fn(walk(
			form,
			recurse,
			leaf
		));
	}

	function preprune(form, fn, leaf, recurse, key, result) {
		if (!fn(form)) {
			result[key] = walk(
				form,
				recurse,
				leaf
			);
		}
	}

	function postprune(form, fn, leaf, recurse, key, result) {
		var subForm = walk(
			form,
			recurse,
			leaf
		);
		if (!fn(subForm)) {
			result[key] = subForm;
		}
	}

	// TODO consider rewriting tree walking to do iteration instead of
	// recursion to avoid the IE maximum recursion depth (which is
	// limited to just a few hundred frames).
	function walkrec(form, fn, leaf, walkFn) {
		var result = [null];
		(function recurse(subForm, key, result) {
			walkFn(subForm, fn, leaf, recurse, key, result);
		}(form, 0, result));
		return result[0];
	}

	return {
		prewalk  : function(form, fn, leaf   ) { return walkrec(form, fn, leaf || Functions.identity, prewalk); },
		postwalk : function(form, fn, leaf   ) { return walkrec(form, fn, leaf || Functions.identity, postwalk); },
		preprune : function(form, pred, leaf ) { return walkrec(form, pred, leaf || Functions.identity, preprune); },
		postprune: function(form, pred, leaf ) { return walkrec(form, pred, leaf || Functions.identity, postprune); },
		leaves   : function(form, leaf       ) { return walkrec(form, Functions.identity, leaf, postwalk); },
		flatten  : function(form) {
			var result = [];
			walkrec(form, Functions.identity, function(leaf){ result.push(leaf); }, postwalk);
			return result;
		}
	};
});
