/**
* @name $array
* @description $arrayJS: a simple JavaScript utility library for working with arrays of objects.
* @author [obedm503](https://github.com/obedm503/) <obedm503@gmail.com>
* @see [git repo](https://github.com/obedm503/obedm503-array.git)
* @version 1.1.0
* @license MIT
*/
(function(window){
  'use strict';
  function define$array(){
    var error = '$arrayJS: ',
        $array = {
          keyExists:keyExists,
          filterByKey:filterByKey,
          reverse:reverse,
          sortRandom:sortRandom,
          sortAscend:sortAscend,
          sortDescend:sortDescend,
          convertToObject:convertToObject,
          groupObjects:groupObjects
        };

    /**
    * @function keyExists
    * @memberof $array
    * @description Curried function with checks if a certain key exists within ANY object in the array.
    * @param {object[]} arr An array of objects.
    * @param {string} key The key to check within the objects.
    * @returns {boolean} Whether the key exists within any object.
    * @example
    * var exampleArray = [
    *   { name: "Juan", lastname: "Perez", user_id:"1234", age:42 },
    *   { name: "John", lastname: "Doe", user_id:"6789", age:40 },
    *   { name: "Pedro", lastname: "Algo", age:30  }
    * ];
    * $array.keyExists(exampleArray)('user_id'); //true
    */
    function keyExists(arr){
      if(arr && Array.isArray(arr)){
        return function(key){
          if(key && typeof key === 'string'){
            var is = false;
            arr.forEach(function(o){
              if(o[key]){ is = true ;}
            });
            return is;
          } else { console.error(error + 'no correct key given'); return undefined; }
        };
      } else { console.error(error + 'no correct array given'); return undefined; }
    }

    /**
    * @function filterByKey
    * @memberof $array
    * @description Curried function which takes an array of objects, a key. Useful with dynamic ionic actionsheet buttons.
    * @param {object[]} arr An array of objects.
    * @param {string} key The key to look for in each object.
    * @param {string} [newKey] Optional. The key to substitute the old key with... if that makes sense.
    * @returns {object[]} An array of objects, each with a single key-value pair.
    * @example
    * var exampleArray = [
    *   { name: "Juan", lastname: "Perez", user_id:"1234", age:42 },
    *   { name: "John", lastname: "Doe", user_id:"6789", age:40 },
    *   { name: "Pedro", lastname: "Algo", age:30  }
    * ];
    * $array.filterByKey(exampleArray)('user_id'); //[{user_id:"1234"}, {user_id:"6789"}]
    * $array.filterByKey(exampleArray)('user_id','id'); //[{id:"1234"}, {id:"6789"}]
    */
    function filterByKey(arr){
      if(arr && Array.isArray(arr)){
        return function(key, newKey){
          if(key && keyExists(arr)(key)){
            var obj = {}, mid = [];
            return arr.map(function(o){
              obj = {};
              if(mid.indexOf(o[key]) < 0){
                mid.push(o[key]);
                if(newKey){ obj[newKey] = o[key]; }
                else { obj[key] = o[key]; }
                return obj;
              } else { return;}
            }).filter(function(o){ return (o && JSON.stringify(o) !== '{}'); });

          } else { console.error(error + '"' + key  + '" is not a key in array'); return undefined; }
        };
      } else { console.error(error + 'param is not array'); return undefined; }
    }

    /**
    * @function reverse
    * @memberof $array
    * @description Reverses the order of items in an array. It's supposed to be faster than the Array.prototype.reverse() method.
    * @param {array} arr An array.
    * @returns {array} The reversed array.
    * @example
    * var exampleArray = [
    *   { name: "Juan", lastname: "Perez", user_id:"1234", age:42 },
    *   { name: "John", lastname: "Doe", user_id:"6789", age:40 },
    *   { name: "Pedro", lastname: "Algo", age:30  }
    * ];
    * $array.reverse(exampleArray);
    * //[
    * // { name: "Pedro", lastname: "Algo", age:30  }
    * // { name: "John", lastname: "Doe", user_id:"6789", age:40 },
    * // { name: "Juan", lastname: "Perez", user_id:"1234", age:42 }
    * //]
    */
    function reverse(arr){
      if(arr && Array.isArray(arr)){
        for (var left = 0; left < arr.length / 2; left += 1){
          var right = arr.length - 1 - left;
          var temporary = arr[left];
          arr[left] = arr[right];
          arr[right] = temporary;
        }
        return arr;
      } else { console.error(error + 'no correct array given'); return undefined; }
    }

    /**
    * @function sortRandom
    * @memberof $array
    * @description Randomizes the order of item in the array. Uses the knuth-shuffle.
    * @param {array} arr An array.
    * @returns {array} An array with randomized order.
    * @example
    * var exampleArray = [
    *   { name: "Juan", lastname: "Perez", user_id:"1234", age:42 },
    *   { name: "John", lastname: "Doe", user_id:"6789", age:40 },
    *   { name: "Pedro", lastname: "Algo", age:30  }
    * ];
    * $array.sortRandom(exampleArray); //randomized array...
    */
    function sortRandom(arr){
      if(arr && Array.isArray(arr)) {
        var currentIndex = arr.length, temporaryValue, randomIndex;
        while(0 !== currentIndex) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          temporaryValue = arr[currentIndex];
          arr[currentIndex] = arr[randomIndex];
          arr[randomIndex] = temporaryValue;
        }
        return arr;
      } else { console.error(error + 'no correct array given'); return undefined; }
    }

    /**
    * @function sortAscend
    * @memberof $array
    * @description
    Curried function which sorts the objects in an array in alphabetical order according to the passed key's value.
    Also works if the key's value is a number.
    * @param {object[]} arr An array of objects.
    * @param {string} key The key with which to sort the array
    * @returns {object[]} Array with objects sorted
    * @example
    * var exampleArray = [
    *   { name: "Juan", lastname: "Perez", user_id:"1234", age:42 },
    *   { name: "John", lastname: "Doe", user_id:"6789", age:40 },
    *   { name: "Pedro", lastname: "Algo", age:30  }
    * ];
    * $array.sortAscend(exampleArray)('lastname');
    * //[
    * //  { name: "Pedro", lastname: "Algo", age:30  },
    * //  { name: "John", lastname: "Doe", user_id:"6789", age:40 },
    * //  { name: "Juan", lastname: "Perez", user_id:"1234", age:42 }
    * //]
    * $array.sortAscend(exampleArray)('age');
    * //[
    * //  { name: "Pedro", lastname: "Algo", age:30  },
    * //  { name: "John", lastname: "Doe", user_id:"6789", age:40 },
    * //  { name: "Juan", lastname: "Perez", user_id:"1234", age:42 }
    * //]
    */
    function sortAscend(arr){
      if(arr && Array.isArray(arr)){
        return function(key){
          if(key && keyExists(arr)(key)){
            return arr.sort(_sort(key));
          } else { console.error(error + 'no correct key given'); return undefined; }
        };
      } else { console.error(error + 'no correct array given'); return undefined;}
    }

    /**
    * @function sortDescend
    * @memberof $array
    * @description
    Curried function which sorts the objects in an array in reverse alphabetical order according to the passed key's value.
    Also works if the key's value is a number.
    * @param {object[]} arr An array of objects.
    * @param {string} key The key with which to sort the array.
    * @returns {object[]} Array with objects sorted.
    * @example
    * var exampleArray = [
    *   { name: "Juan", lastname: "Perez", user_id:"1234", age:42 },
    *   { name: "John", lastname: "Doe", user_id:"6789", age:40 },
    *   { name: "Pedro", lastname: "Algo", age:30  }
    * ];
    * $array.sortDescend(exampleArray)('lastname');
    * //[
    * //  { name: "Juan", lastname: "Perez", user_id:"1234", age:42 },
    * //  { name: "John", lastname: "Doe", user_id:"6789", age:40 },
    * //  { name: "Pedro", lastname: "Algo", age:30  }
    * //]
    * $array.sortDescend(exampleArray)('age');
    * //[
    * //  { name: "Juan", lastname: "Perez", user_id:"1234", age:42 },
    * //  { name: "John", lastname: "Doe", user_id:"6789", age:40 },
    * //  { name: "Pedro", lastname: "Algo", age:30  }
    * //]
    */
    function sortDescend(arr){
      if(arr && Array.isArray(arr)){
        return function(key){
          if(key && keyExists(arr)(key)){
            return arr.sort(_sort('-' + key));
          } else { console.error(error + 'no correct key given'); return undefined; }
        };
      } else { console.error(error + 'no correct array given'); return undefined; }
    }

    /**
    * @function convertToObject
    * @memberof $array
    * @description
    A functions which converts an array of objects to an object.
    Designed with the idea of eliminating the need to loop through an array in order to get a specific object.
    * @param {object[]} arr An array of objects.
    * @param {string} key Takes the key that exisist in all objects in the array. The value of this key will become the key to each object.
    * @returns {object} Returns the array of objects converted into an object.
    * @example
    * var exampleArray = [
    *   { name: "Juan", lastname: "Perez", user_id:"1234", age:42 },
    *   { name: "John", lastname: "Doe", user_id:"6789", age:40 },
    *   { name: "Pedro", lastname: "Algo", age:30  }
    * ];
    * $array.convertToObject(exampleArray)('lastname');
    * //{
    * //  Perez: { name: "Juan", lastname: "Perez", user_id:"1234", age:42 },
    * //  Doe: { name: "John", lastname: "Doe", user_id:"6789", age:40 },
    * //  Algo: { name: "Pedro", lastname: "Algo", age:30  }
    * //}
    */
  	function convertToObject(arr){
      if(arr && Array.isArray(arr)){
        return function(key){
          if(key && keyExists(arr)(key)){
            var obj = {},
                keyFound = true;
            for(var i = 0, arrLen = arr.length; i < arrLen; i++){
              if(arr[i][key]){ obj[arr[i][key]] = arr[i]; }
              else { keyFound = false; }
            }
            if(keyFound){ return obj; }
            else { console.error(error + 'key not found'); return undefined; }

          } else { console.error(error + 'bad params'); return undefined; }
        };
      } else { console.error(error + 'no correct array given'); return undefined; }
    }

    /**
    * @function groupObjects
    * @memberof $array
    * @description
    A curried function which takes an array of objects to be filtered into groups, an array of function that each return conditionals.
    This funtion is inspired after the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
    Array.prototype.filter} method.
    Check the SO {@link http://stackoverflow.com/questions/38559281/array-filter-with-more-than-one-conditional question}.
    * @param {object[]} arr Array of objects to be grouped.
    A function which takes an array of objects and returns an array of arrays with objects grouped according to the conditionals.
    * @param {callback[]} conds An array of callback functions which each take an object and return a conditional value.
    * @returns {array[]}
    An array of arrays with the objects grouped in the same order according to the array of callbacks passed.
    All objects which match no conditional, are grouped on the last array.
    * @example
    * var exampleArray = [
    *   { name: "Juan", lastname: "Perez", user_id:"1234", age:42},
    *   { name: "John", lastname: "Doe", user_id:"6789", age:40},
    *   { name: "Pedro", lastname: "Algo", age:30}
    * ];
    * $array.groupObjects(exampleArray)([function(o){ return o.lastname === 'Doe'; }, function(o){ return o.age > 35; }])
    * //[
    * //  [
    * //    { name: "John", lastname: "Doe", user_id:"6789", age:40 }
    * //  ],
    * //  [
    * //    { name: "Juan", lastname: "Perez", user_id:"1234", age:42 },
    * //    { name: "John", lastname: "Doe", user_id:"6789", age:40 }
    * //  ],
    * //  [
    * //    { name: "Pedro", lastname: "Algo", age:30 }
    * //  ]
    * //]
    */
    function groupObjects(arr) {
      return function(conds){
        return arr.reduce(function(groups, entry){
          var indices = [];
          conds.forEach(function(cond, i){ if(cond(entry)){ indices.push(i); } });
          if(indices.length === 0){ groups[groups.length - 1].push(entry); }
          else {  indices.forEach(function(i){return groups[i].push(entry);}); }
          return groups;
        }, Array.apply(null, { length: conds.length + 1 }).map(function(e){ return []; }));
      };
    }

    function _sort(key) {
      var sortOrder = 1;
      if(key[0] === "-") {
        sortOrder = -1;
        key = key.substr(1);
      }
      return function(a,b) {
        var result = (a[key] < b[key]) ? -1 : (a[key] > b[key]) ? 1 : 0;
        return result * sortOrder;
      };
    }

    return $array;
  }

  if(typeof $array === 'undefined'){ window.$array = define$array(); }
}(window));
