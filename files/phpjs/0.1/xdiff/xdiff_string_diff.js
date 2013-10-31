function xdiff_string_diff (old_data, new_data, context_lines, minimal) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // +   based on: Imgen Tata (http://www.myipdf.com/)
  // +   bugfixed by: Imgen Tata (http://www.myipdf.com/)
  // %        note 1: The minimal argument is not currently supported
  // *     example 1: xdiff_string_diff('', 'Hello world!');
  // *     returns 1: '@@ -0,0 +1,1 @@\n+Hello world!'

  // (This code was done by Imgen Tata; I have only reformatted for use in php.js)

  // See http://en.wikipedia.org/wiki/Diff#Unified_format
  var i = 0,
    j = 0,
    k = 0,
    ori_hunk_start, new_hunk_start, ori_hunk_end, new_hunk_end, ori_hunk_line_no, new_hunk_line_no, ori_hunk_size, new_hunk_size,
    // Potential configuration
    MAX_CONTEXT_LINES = Number.POSITIVE_INFINITY,
    MIN_CONTEXT_LINES = 0,
    DEFAULT_CONTEXT_LINES = 3,
    //
    HEADER_PREFIX = '@@ ',
    HEADER_SUFFIX = ' @@',
    ORIGINAL_INDICATOR = '-',
    NEW_INDICATOR = '+',
    RANGE_SEPARATOR = ',',
    CONTEXT_INDICATOR = ' ',
    DELETION_INDICATOR = '-',
    ADDITION_INDICATOR = '+',
    ori_lines, new_lines, NEW_LINE = '\n',
/*
    *Trims string
    */
    trim = function (text) {
      if (typeof text !== 'string') {
        throw Error('String parameter required');
      }

      return text.replace(/(^\s*)|(\s*$)/g, '');
    },
/*
    *Verifies type of arguments
    */
    verify_type = function (type) {
      var args = arguments,
        args_len = arguments.length,
        basic_types = ['number', 'boolean', 'string', 'function', 'object', 'undefined'],
        basic_type, i, j, type_of_type = typeof type;
      if (type_of_type !== 'string' && type_of_type !== 'function') {
        throw new Error('Bad type parameter');
      }

      if (args_len < 2) {
        throw new Error('Too few arguments');
      }

      if (type_of_type === 'string') {
        type = trim(type);

        if (type === '') {
          throw new Error('Bad type parameter');
        }

        for (j = 0; j < basic_types.length; j++) {
          basic_type = basic_types[j];

          if (basic_type == type) {
            for (i = 1; i < args_len; i++) {
              if (typeof args[i] != type) {
                throw new Error('Bad type');
              }
            }

            return;
          }
        }

        throw new Error('Bad type parameter');
      }

      // Not basic type. we need to use instanceof operator
      for (i = 1; i < args_len; i++) {
        if (!(args[i] instanceof type)) {
          throw new Error('Bad type');
        }
      }
    },
/*
    *Checks if the specified array contains an element with specified value
    */
    has_value = function (array, value) {
      var i;
      verify_type(Array, array);

      for (i = 0; i < array.length; i++) {
        if (array[i] === value) {
          return true;
        }
      }

      return false;
    },
/*
    *Checks the type of arguments
    *@param {String | Function} type Specifies the desired type
    *@return {Boolean} Return true if all arguments after the type argument are of specified type. Else false
    */
    are_type_of = function (type) {
      var args = arguments,
        args_len = arguments.length,
        basic_types = ['number', 'boolean', 'string', 'function', 'object', 'undefined'],
        basic_type, i, j, type_of_type = typeof type;
      if (type_of_type !== 'string' && type_of_type !== 'function') {
        throw new Error('Bad type parameter');
      }

      if (args_len < 2) {
        throw new Error('Too few arguments');
      }

      if (type_of_type === 'string') {
        type = trim(type);

        if (type === '') {
          return false;
        }

        for (j = 0; j < basic_types.length; j++) {
          basic_type = basic_types[j];

          if (basic_type == type) {
            for (i = 1; i < args_len; i++) {
              if (typeof args[i] != type) {
                return false;
              }
            }

            return true;
          }
        }

        throw new Error('Bad type parameter');
      }

      // Not basic type. we need to use instanceof operator
      for (i = 1; i < args_len; i++) {
        if (!(args[i] instanceof type)) {
          return false;
        }
      }

      return true;
    },
/*
    *Initialize and return an array with specified size and initial value
    */
    get_initialized_array = function (array_size, init_value) {
      var array = [],
        i;
      verify_type('number', array_size);

      for (i = 0; i < array_size; i++) {
        array.push(init_value);
      }

      return array;
    },
/*
    *Splits text into lines and return as a string array
    */
    split_into_lines = function (text) {
      verify_type('string', text);

      if (text === '') {
        return [];
      }
      return text.split('\n');
    },
    is_empty_array = function (obj) {
      return are_type_of(Array, obj) && obj.length === 0;
    },
/*
    * Finds longest common sequence between two sequences
    *See http://wordaligned.org/articles/longest-common-subsequence
    */
    find_longest_common_sequence = function (seq1, seq2, seq1_is_in_lcs, seq2_is_in_lcs) {
      if (!are_type_of(Array, seq1, seq2)) {
        throw new Error('Array parameters are required');
      }

      // Deal with edge case
      if (is_empty_array(seq1) || is_empty_array(seq2)) {
        return [];
      }

      // Function to calculate lcs lengths
      var lcs_lens = function (xs, ys) {
        var curr = get_initialized_array(ys.length + 1, 0);
        var prev;
        var i, j;

        for (i = 0; i < xs.length; i++) {
          prev = curr.slice(0);
          for (j = 0; j < ys.length; j++) {
            if (xs[i] === ys[j]) {
              curr[j + 1] = prev[j] + 1;
            } else {
              curr[j + 1] = Math.max(curr[j], prev[j + 1]);
            }
          }
        }

        return curr;
      },
        // Function to find lcs and fill in the array to indicate the optimal longest common sequence
        find_lcs = function (xs, xidx, xs_is_in, ys) {
          var nx = xs.length;
          var ny = ys.length;
          var i;
          var xb, xe;
          var ll_b, ll_e;
          var pivot;
          var max;
          var yb, ye;

          if (nx === 0) {
            return [];
          } else if (nx === 1) {
            if (has_value(ys, xs[0])) {
              xs_is_in[xidx] = true;
              return [xs[0]];
            } else {
              return [];
            }
          } else {
            i = Math.floor(nx / 2);
            xb = xs.slice(0, i);
            xe = xs.slice(i);
            ll_b = lcs_lens(xb, ys);
            ll_e = lcs_lens(xe.slice(0).reverse(), ys.slice(0).reverse());

            pivot = 0;
            max = 0;
            for (j = 0; j <= ny; j++) {
              if (ll_b[j] + ll_e[ny - j] > max) {
                pivot = j;
                max = ll_b[j] + ll_e[ny - j];
              }
            }
            yb = ys.slice(0, pivot);
            ye = ys.slice(pivot);
            return find_lcs(xb, xidx, xs_is_in, yb).concat(find_lcs(xe, xidx + i, xs_is_in, ye));
          }
        };

      // Fill in seq1_is_in_lcs to find the optimal longest common subsequence of first sequence
      find_lcs(seq1, 0, seq1_is_in_lcs, seq2);
      // Fill in seq2_is_in_lcs to find the optimal longest common subsequence of second sequence and return the result
      return find_lcs(seq2, 0, seq2_is_in_lcs, seq1);
    };

  // First, check the parameters
  if (are_type_of('string', old_data, new_data) === false) {
    return false;
  }

  if (old_data == new_data) {
    return '';
  }

  if (typeof context_lines !== 'number' || context_lines > MAX_CONTEXT_LINES || context_lines < MIN_CONTEXT_LINES) {
    context_lines = DEFAULT_CONTEXT_LINES;
  }

  ori_lines = split_into_lines(old_data);
  new_lines = split_into_lines(new_data);
  var ori_len = ori_lines.length,
    new_len = new_lines.length,
    ori_is_in_lcs = get_initialized_array(ori_len, false),
    new_is_in_lcs = get_initialized_array(new_len, false),
    lcs_len = find_longest_common_sequence(ori_lines, new_lines, ori_is_in_lcs, new_is_in_lcs).length,
    unidiff = '';

  if (lcs_len === 0) { // No common sequence
    unidiff = HEADER_PREFIX + ORIGINAL_INDICATOR + (ori_len > 0 ? '1' : '0') + RANGE_SEPARATOR + ori_len + ' ' + NEW_INDICATOR + (new_len > 0 ? '1' : '0') + RANGE_SEPARATOR + new_len + HEADER_SUFFIX;

    for (i = 0; i < ori_len; i++) {
      unidiff += NEW_LINE + DELETION_INDICATOR + ori_lines[i];
    }

    for (j = 0; j < new_len; j++) {
      unidiff += NEW_LINE + ADDITION_INDICATOR + new_lines[j];
    }

    return unidiff;
  }

  var leading_context = [],
    trailing_context = [],
    actual_leading_context = [],
    actual_trailing_context = [],

    // Regularize leading context by the context_lines parameter
    regularize_leading_context = function (context) {
      if (context.length === 0 || context_lines === 0) {
        return [];
      }

      var context_start_pos = Math.max(context.length - context_lines, 0);

      return context.slice(context_start_pos);
    },

    // Regularize trailing context by the context_lines parameter
    regularize_trailing_context = function (context) {
      if (context.length === 0 || context_lines === 0) {
        return [];
      }

      return context.slice(0, Math.min(context_lines, context.length));
    };

  // Skip common lines in the beginning
  while (i < ori_len && ori_is_in_lcs[i] === true && new_is_in_lcs[i] === true) {
    leading_context.push(ori_lines[i]);
    i++;
  }

  j = i;
  k = i; // The index in the longest common sequence
  ori_hunk_start = i;
  new_hunk_start = j;
  ori_hunk_end = i;
  new_hunk_end = j;

  while (i < ori_len || j < new_len) {
    while (i < ori_len && ori_is_in_lcs[i] === false) {
      i++;
    }
    ori_hunk_end = i;

    while (j < new_len && new_is_in_lcs[j] === false) {
      j++;
    }
    new_hunk_end = j;

    // Find the trailing context
    trailing_context = [];
    while (i < ori_len && ori_is_in_lcs[i] === true && j < new_len && new_is_in_lcs[j] === true) {
      trailing_context.push(ori_lines[i]);
      k++;
      i++;
      j++;
    }

    if (k >= lcs_len || // No more in longest common lines
    trailing_context.length >= 2 * context_lines) { // Context break found
      if (trailing_context.length < 2 * context_lines) { // It must be last block of common lines but not a context break
        trailing_context = [];

        // Force break out
        i = ori_len;
        j = new_len;

        // Update hunk ends to force output to the end
        ori_hunk_end = ori_len;
        new_hunk_end = new_len;
      }

      // Output the diff hunk

      // Trim the leading and trailing context block
      actual_leading_context = regularize_leading_context(leading_context);
      actual_trailing_context = regularize_trailing_context(trailing_context);

      ori_hunk_start -= actual_leading_context.length;
      new_hunk_start -= actual_leading_context.length;
      ori_hunk_end += actual_trailing_context.length;
      new_hunk_end += actual_trailing_context.length;

      ori_hunk_line_no = ori_hunk_start + 1;
      new_hunk_line_no = new_hunk_start + 1;
      ori_hunk_size = ori_hunk_end - ori_hunk_start;
      new_hunk_size = new_hunk_end - new_hunk_start;

      // Build header
      unidiff += HEADER_PREFIX + ORIGINAL_INDICATOR + ori_hunk_line_no + RANGE_SEPARATOR + ori_hunk_size + ' ' + NEW_INDICATOR + new_hunk_line_no + RANGE_SEPARATOR + new_hunk_size + HEADER_SUFFIX + NEW_LINE;

      // Build the diff hunk content
      while (ori_hunk_start < ori_hunk_end || new_hunk_start < new_hunk_end) {
        if (ori_hunk_start < ori_hunk_end && ori_is_in_lcs[ori_hunk_start] === true && new_is_in_lcs[new_hunk_start] === true) { // The context line
          unidiff += CONTEXT_INDICATOR + ori_lines[ori_hunk_start] + NEW_LINE;
          ori_hunk_start++;
          new_hunk_start++;
        } else if (ori_hunk_start < ori_hunk_end && ori_is_in_lcs[ori_hunk_start] === false) { // The deletion line
          unidiff += DELETION_INDICATOR + ori_lines[ori_hunk_start] + NEW_LINE;
          ori_hunk_start++;
        } else if (new_hunk_start < new_hunk_end && new_is_in_lcs[new_hunk_start] === false) { // The additional line
          unidiff += ADDITION_INDICATOR + new_lines[new_hunk_start] + NEW_LINE;
          new_hunk_start++;
        }
      }

      // Update hunk position and leading context
      ori_hunk_start = i;
      new_hunk_start = j;
      leading_context = trailing_context;
    }
  }

  // Trim the trailing new line if it exists
  if (unidiff.length > 0 && unidiff.charAt(unidiff.length) === NEW_LINE) {
    unidiff = unidiff.slice(0, -1);
  }

  return unidiff;
}
