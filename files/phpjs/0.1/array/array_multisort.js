function array_multisort (arr) {
  // +   original by: Theriault
  // *     example 1: array_multisort([1, 2, 1, 2, 1, 2], [1, 2, 3, 4, 5, 6]);
  // *     returns 1: true
  // *     example 2: characters = {A: 'Edward', B: 'Locke', C: 'Sabin', D: 'Terra', E: 'Edward'};
  // *     example 2: jobs = {A: 'Warrior', B: 'Thief', C: 'Monk', D: 'Mage', E: 'Knight'};
  // *     example 2: array_multisort(characters, 'SORT_DESC', 'SORT_STRING', jobs, 'SORT_ASC', 'SORT_STRING');
  // *     returns 2: true
  // *     results 2: characters == {D: 'Terra', C: 'Sabin', B: 'Locke', E: 'Edward', A: 'Edward'};
  // *     results 2: jobs == {D: 'Mage', C: 'Monk', B: 'Thief', E: 'Knight', A: 'Warrior'};
  // *     example 3: lastnames = [ 'Carter','Adams','Monroe','Tyler','Madison','Kennedy','Adams'];
  // *     example 3: firstnames = ['James', 'John' ,'James', 'John', 'James',  'John',   'John'];
  // *     example 3: president = [ 39,      6,      5,       10,     4,       35,        2    ];
  // *     example 3: array_multisort(firstnames, 'SORT_DESC', 'SORT_STRING', lastnames, 'SORT_ASC', 'SORT_STRING', president, 'SORT_NUMERIC');
  // *     returns 3: true
  // *     results 3: firstnames == ['John', 'John', 'John',   'John', 'James', 'James',  'James'];
  // *     results 3: lastnames ==  ['Adams','Adams','Kennedy','Tyler','Carter','Madison','Monroe'];
  // *     results 3: president ==  [2,      6,      35,       10,     39,       4,       5];
  // Fix: this function must be fixed like asort(), etc., to return a (shallow) copy by default, since IE does not support!
  // VARIABLE DESCRIPTIONS
  //
  // flags: Translation table for sort arguments. Each argument turns on certain bits in the flag byte through addition.
  //        bits:    HGFE DCBA
  //        bit A: Only turned on if SORT_NUMERIC was an argument.
  //        bit B: Only turned on if SORT_STRING was an argument.
  //        bit C: Reserved bit for SORT_ASC; not turned on.
  //        bit D: Only turned on if SORT_DESC was an argument.
  //        bit E: Turned on if either SORT_REGULAR, SORT_NUMERIC, or SORT_STRING was an argument. If already turned on, function would return FALSE like in PHP.
  //        bit F: Turned on if either SORT_ASC or SORT_DESC was an argument. If already turned on, function would return FALSE like in PHP.
  //        bit G and H: (Unused)
  //
  // sortFlag: Holds sort flag byte of every array argument.
  //
  // sortArrs: Holds the values of array arguments.
  //
  // sortKeys: Holds the keys of object arguments.
  //
  // nLastSort: Holds a copy of the current lastSort so that the lastSort is not destroyed
  //
  // nLastSort: Holds a copy of the current lastSort so that the lastSort is not destroyed
  //
  // args: Holds pointer to arguments for reassignment
  //
  // lastSort: Holds the last Javascript sort pattern to duplicate the sort for the last sortComponent.
  //
  // lastSorts: Holds the lastSort for each sortComponent to duplicate the sort of each component on each array.
  //
  // tmpArray: Holds a copy of the last sortComponent's array elements to reiterate over the array
  //
  // elIndex: Holds the index of the last sortComponent's array elements to reiterate over the array
  //
  // sortDuplicator: Function for duplicating previous sort.
  //
  // sortRegularASC: Function for sorting regular, ascending.
  //
  // sortRegularDESC: Function for sorting regular, descending.
  //
  // thingsToSort: Holds a bit that indicates which indexes in the arrays can be sorted. Updated after every array is sorted.
  var argl = arguments.length,
    sal = 0,
    flags = {
      'SORT_REGULAR': 16,
      'SORT_NUMERIC': 17,
      'SORT_STRING': 18,
      'SORT_ASC': 32,
      'SORT_DESC': 40
    },
    sortArrs = [
      []
    ],
    sortFlag = [0],
    sortKeys = [
      []
    ],
    g = 0,
    i = 0,
    j = 0,
    k = '',
    l = 0,
    thingsToSort = [],
    vkey = 0,
    zlast = null,
    args = arguments,
    nLastSort = [],
    lastSort = [],
    lastSorts = [],
    tmpArray = [],
    elIndex = 0,
    sortDuplicator = function (a, b) {
      return nLastSort.shift();
    },
    sortFunctions = [
      [function (a, b) {
        lastSort.push(a > b ? 1 : (a < b ? -1 : 0));
        return a > b ? 1 : (a < b ? -1 : 0);
      }, function (a, b) {
        lastSort.push(b > a ? 1 : (b < a ? -1 : 0));
        return b > a ? 1 : (b < a ? -1 : 0);
      }],
      [function (a, b) {
        lastSort.push(a - b);
        return a - b;
      }, function (a, b) {
        lastSort.push(b - a);
        return b - a;
      }],
      [function (a, b) {
        lastSort.push((a + '') > (b + '') ? 1 : ((a + '') < (b + '') ? -1 : 0));
        return (a + '') > (b + '') ? 1 : ((a + '') < (b + '') ? -1 : 0);
      }, function (a, b) {
        lastSort.push((b + '') > (a + '') ? 1 : ((b + '') < (a + '') ? -1 : 0));
        return (b + '') > (a + '') ? 1 : ((b + '') < (a + '') ? -1 : 0);
      }]
    ];

  // Store first argument into sortArrs and sortKeys if an Object.
  // First Argument should be either a Javascript Array or an Object, otherwise function would return FALSE like in PHP
  if (Object.prototype.toString.call(arr) === '[object Array]') {
    sortArrs[0] = arr;
  }
  else if (arr && typeof arr === 'object') {
    for (i in arr) {
      if (arr.hasOwnProperty(i)) {
        sortKeys[0].push(i);
        sortArrs[0].push(arr[i]);
      }
    }
  }
  else {
    return false;
  }


  // arrMainLength: Holds the length of the first array. All other arrays must be of equal length, otherwise function would return FALSE like in PHP
  //
  // sortComponents: Holds 2 indexes per every section of the array that can be sorted. As this is the start, the whole array can be sorted.
  var arrMainLength = sortArrs[0].length,
    sortComponents = [0, arrMainLength];

  // Loop through all other arguments, checking lengths and sort flags of arrays and adding them to the above variables.
  for (j = 1; j < argl; j++) {
    if (Object.prototype.toString.call(arguments[j]) === '[object Array]') {
      sortArrs[j] = arguments[j];
      sortFlag[j] = 0;
      if (arguments[j].length !== arrMainLength) {
        return false;
      }
    } else if (arguments[j] && typeof arguments[j] === 'object') {
      sortKeys[j] = [];
      sortArrs[j] = [];
      sortFlag[j] = 0;
      for (i in arguments[j]) {
        if (arguments[j].hasOwnProperty(i)) {
          sortKeys[j].push(i);
          sortArrs[j].push(arguments[j][i]);
        }
      }
      if (sortArrs[j].length !== arrMainLength) {
        return false;
      }
    } else if (typeof arguments[j] === 'string') {
      var lFlag = sortFlag.pop();
      if (typeof flags[arguments[j]] === 'undefined' || ((((flags[arguments[j]]) >>> 4) & (lFlag >>> 4)) > 0)) { // Keep extra parentheses around latter flags check to avoid minimization leading to CDATA closer
        return false;
      }
      sortFlag.push(lFlag + flags[arguments[j]]);
    } else {
      return false;
    }
  }


  for (i = 0; i !== arrMainLength; i++) {
    thingsToSort.push(true);
  }

  // Sort all the arrays....
  for (i in sortArrs) {
    if (sortArrs.hasOwnProperty(i)) {
      lastSorts = [];
      tmpArray = [];
      elIndex = 0;
      nLastSort = [];
      lastSort = [];

      // If ther are no sortComponents, then no more sorting is neeeded. Copy the array back to the argument.
      if (sortComponents.length === 0) {
        if (Object.prototype.toString.call(arguments[i]) === '[object Array]') {
          args[i] = sortArrs[i];
        } else {
          for (k in arguments[i]) {
            if (arguments[i].hasOwnProperty(k)) {
              delete arguments[i][k];
            }
          }
          sal = sortArrs[i].length;
          for (j = 0, vkey = 0; j < sal; j++) {
            vkey = sortKeys[i][j];
            args[i][vkey] = sortArrs[i][j];
          }
        }
        delete sortArrs[i];
        delete sortKeys[i];
        continue;
      }

      // Sort function for sorting. Either sorts asc or desc, regular/string or numeric.
      var sFunction = sortFunctions[(sortFlag[i] & 3)][((sortFlag[i] & 8) > 0) ? 1 : 0];

      // Sort current array.
      for (l = 0; l !== sortComponents.length; l += 2) {
        tmpArray = sortArrs[i].slice(sortComponents[l], sortComponents[l + 1] + 1);
        tmpArray.sort(sFunction);
        lastSorts[l] = [].concat(lastSort); // Is there a better way to copy an array in Javascript?
        elIndex = sortComponents[l];
        for (g in tmpArray) {
          if (tmpArray.hasOwnProperty(g)) {
            sortArrs[i][elIndex] = tmpArray[g];
            elIndex++;
          }
        }
      }

      // Duplicate the sorting of the current array on future arrays.
      sFunction = sortDuplicator;
      for (j in sortArrs) {
        if (sortArrs.hasOwnProperty(j)) {
          if (sortArrs[j] === sortArrs[i]) {
            continue;
          }
          for (l = 0; l !== sortComponents.length; l += 2) {
            tmpArray = sortArrs[j].slice(sortComponents[l], sortComponents[l + 1] + 1);
            nLastSort = [].concat(lastSorts[l]); // alert(l + ':' + nLastSort);
            tmpArray.sort(sFunction);
            elIndex = sortComponents[l];
            for (g in tmpArray) {
              if (tmpArray.hasOwnProperty(g)) {
                sortArrs[j][elIndex] = tmpArray[g];
                elIndex++;
              }
            }
          }
        }
      }

      // Duplicate the sorting of the current array on array keys
      for (j in sortKeys) {
        if (sortKeys.hasOwnProperty(j)) {
          for (l = 0; l !== sortComponents.length; l += 2) {
            tmpArray = sortKeys[j].slice(sortComponents[l], sortComponents[l + 1] + 1);
            nLastSort = [].concat(lastSorts[l]);
            tmpArray.sort(sFunction);
            elIndex = sortComponents[l];
            for (g in tmpArray) {
              if (tmpArray.hasOwnProperty(g)) {
                sortKeys[j][elIndex] = tmpArray[g];
                elIndex++;
              }
            }
          }
        }
      }

      // Generate the next sortComponents
      zlast = null;
      sortComponents = [];
      for (j in sortArrs[i]) {
        if (sortArrs[i].hasOwnProperty(j)) {
          if (!thingsToSort[j]) {
            if ((sortComponents.length & 1)) {
              sortComponents.push(j - 1);
            }
            zlast = null;
            continue;
          }
          if (!(sortComponents.length & 1)) {
            if (zlast !== null) {
              if (sortArrs[i][j] === zlast) {
                sortComponents.push(j - 1);
              } else {
                thingsToSort[j] = false;
              }
            }
            zlast = sortArrs[i][j];
          } else {
            if (sortArrs[i][j] !== zlast) {
              sortComponents.push(j - 1);
              zlast = sortArrs[i][j];
            }
          }
        }
      }

      if (sortComponents.length & 1) {
        sortComponents.push(j);
      }
      if (Object.prototype.toString.call(arguments[i]) === '[object Array]') {
        args[i] = sortArrs[i];
      }
      else {
        for (j in arguments[i]) {
          if (arguments[i].hasOwnProperty(j)) {
            delete arguments[i][j];
          }
        }

        sal = sortArrs[i].length;
        for (j = 0, vkey = 0; j < sal; j++) {
          vkey = sortKeys[i][j];
          args[i][vkey] = sortArrs[i][j];
        }

      }
      delete sortArrs[i];
      delete sortKeys[i];
    }
  }
  return true;
}
