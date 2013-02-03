define([], function(){
	
 
	/**
	 * Fill the given map with the given keys mapped to the given value.
	 *
	 * @param map
	 *        The given map will have one entry added for each given key.
	 * @param keys
	 *        An array of string keys. Javascript maps can only
	 *        contain string keys, so these must be strings or
	 *        or they will be cast to string.
	 * @param value
	 *        A single value that each given key will map to.
	 * @return
	 *        The given map.
	 */
	function fillKeys(map, keys, value) {
		var i = keys.length;
		while (i--) {
			map[keys[i]] = value;
		}
		return map;
	}

	/**
	 * Fill the given map with entries from the given tuples.
	 *
	 * @param map
	 *        The given map will have one entry added for each item in
	 *        the given array.
	 * @param tuples
	 *        An array of [key, value] tuples. Javascript maps can only
	 *        contain string keys, so the keys must be strings or
	 *        or they will be cast to string.
	 * @return
	 *        The given map.
	 */
	function fillTuples(map, tuples) {
		var i = tuples.length,
		    tuple;
		while (i--) {
			tuple = tuples[i];
			map[tuple[0]] = tuple[1];
		}
		return map;
	}

	return {
		fillTuples: fillTuples,
		fillKeys: fillKeys
	};
});
