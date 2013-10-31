function timezone_abbreviations_list () {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // +      input by: ChaosNo1
  // +    revised by: Theriault
  // +    improved by: Brett Zamir (http://brett-zamir.me)
  // %        note 1: Based on timezonemap.h from PHP 5.3
  // *     example 1: var list = timezone_abbreviations_list()
  // *     example 1: list['acst'][0].timezone_id
  // *     returns 1: 'America/Porto_Acre'
  var list = {},
    i = 0,
    j = 0,
    len = 0,
    jlen = 0,
    indice = '',
    curr = '',
    currSub = '',
    currSubPrefix = '',
    timezone_id = '',
    tzo = 0,
    dst = false;

  // BEGIN STATIC
  try { // We can't try to access on window, since it might not exist in some environments, and if we use "this.window"
    //    we risk adding another copy if different window objects are associated with the namespaced object
    php_js_shared; // Will be private static variable in namespaced version or global in non-namespaced
    //   version since we wish to share this across all instances
  } catch (e) {
    php_js_shared = {};
  }

  // An array of arrays. The index of each array is the relative
  // abbreviation from the abbreviations array below. Each sub array
  // consists of 2 to 4 values. The first value will be DST. The
  // second value is the index of the value in the offsets array.
  // The third value is the timezone ID if applicable. Null is
  // returned if their is no value. The fourth value is the index
  // of the prefix to use for the timezone ID if applicable.
  if (!php_js_shared.tz_abbrs) { // This should really be static, but we can at least avoid rebuilding the array each time
    php_js_shared.tz_abbrs = [
      [
        [1, 14, "Porto_Acre", 9],
        [1, 14, "Eirunepe", 9],
        [1, 14, "Rio_Branco", 9],
        [1, 14, "Acre", 15]
      ],
      [
        [0, 11, "Porto_Acre", 9],
        [0, 11, "Eirunepe", 9],
        [0, 11, "Rio_Branco", 9],
        [0, 11, "Acre", 15]
      ],
      [
        [1, 25, "Goose_Bay", 9],
        [1, 25, "Pangnirtung", 9]
      ],
      [
        [1, 22, "Halifax", 9],
        [1, 22, "Barbados", 9],
        [1, 22, "Blanc-Sablon", 9],
        [1, 22, "Glace_Bay", 9],
        [1, 22, "Goose_Bay", 9],
        [1, 22, "Martinique", 9],
        [1, 22, "Moncton", 9],
        [1, 22, "Pangnirtung", 9],
        [1, 22, "Thule", 9],
        [1, 22, "Bermuda", 13],
        [1, 22, "Atlantic", 16],
        [1, 51, "Baghdad", 12]
      ],
      [
        [0, 52, "Kabul", 12]
      ],
      [
        [1, 6, "Anchorage", 9],
        [1, 6, "Alaska"]
      ],
      [
        [0, 4, "Anchorage", 9],
        [0, 4, "Adak", 9],
        [0, 4, "Atka", 9],
        [0, 4, "Alaska"],
        [0, 4, "Aleutian"]
      ],
      [
        [1, 7, "Anchorage", 9],
        [1, 7, "Juneau", 9],
        [1, 7, "Nome", 9],
        [1, 7, "Yakutat", 9],
        [1, 7, "Alaska"]
      ],
      [
        [0, 6, "Anchorage", 9],
        [0, 6, "Juneau", 9],
        [0, 6, "Nome", 9],
        [0, 6, "Yakutat", 9],
        [0, 6, "Alaska"]
      ],
      [
        [1, 57, "Aqtobe", 12]
      ],
      [
        [0, 51, "Aqtobe", 12],
        [0, 54, "Aqtobe", 12],
        [0, 57, "Aqtobe", 12]
      ],
      [
        [1, 59, "Almaty", 12]
      ],
      [
        [0, 54, "Almaty", 12],
        [0, 57, "Almaty", 12]
      ],
      [
        [1, 51, "Yerevan", 12],
        [1, 54, "Yerevan", 12],
        [1, 22, "Boa_Vista", 9],
        [1, 22, "Campo_Grande", 9],
        [1, 22, "Cuiaba", 9],
        [1, 22, "Manaus", 9],
        [1, 22, "Porto_Velho", 9],
        [1, 22, "West", 15]
      ],
      [
        [0, 47, "Yerevan", 12],
        [0, 51, "Yerevan", 12],
        [0, 14, "Boa_Vista", 9],
        [0, 14, "Campo_Grande", 9],
        [0, 14, "Cuiaba", 9],
        [0, 14, "Manaus", 9],
        [0, 14, "Porto_Velho", 9],
        [0, 14, "West", 15],
        [0, 32, "Amsterdam", 18]
      ],
      [
        [1, 76, "Anadyr", 12],
        [1, 79, "Anadyr", 12],
        [1, 81, "Anadyr", 12]
      ],
      [
        [0, 74, "Anadyr", 12],
        [0, 76, "Anadyr", 12],
        [0, 79, "Anadyr", 12]
      ],
      [
        [0, 13, "Curacao", 9],
        [0, 13, "Aruba", 9]
      ],
      [
        [1, 22, "Halifax", 9],
        [1, 22, "Blanc-Sablon", 9],
        [1, 22, "Glace_Bay", 9],
        [1, 22, "Moncton", 9],
        [1, 22, "Pangnirtung", 9],
        [1, 22, "Puerto_Rico", 9],
        [1, 22, "Atlantic", 16]
      ],
      [
        [1, 54, "Aqtau", 12],
        [1, 57, "Aqtau", 12],
        [1, 57, "Aqtobe", 12]
      ],
      [
        [0, 51, "Aqtau", 12],
        [0, 54, "Aqtau", 12],
        [0, 54, "Aqtobe", 12]
      ],
      [
        [1, 22, "Buenos_Aires", 9],
        [1, 25, "Buenos_Aires", 9],
        [1, 22, "Buenos_Aires", 2],
        [1, 22, "Catamarca", 2],
        [1, 22, "ComodRivadavia", 2],
        [1, 22, "Cordoba", 2],
        [1, 22, "Jujuy", 2],
        [1, 22, "La_Rioja", 2],
        [1, 22, "Mendoza", 2],
        [1, 22, "Rio_Gallegos", 2],
        [1, 22, "San_Juan", 2],
        [1, 22, "Tucuman", 2],
        [1, 22, "Ushuaia", 2],
        [1, 22, "Catamarca", 9],
        [1, 22, "Cordoba", 9],
        [1, 22, "Jujuy", 9],
        [1, 22, "Mendoza", 9],
        [1, 22, "Rosario", 9],
        [1, 22, "Palmer", 10],
        [1, 25, "Buenos_Aires", 2],
        [1, 25, "Catamarca", 2],
        [1, 25, "ComodRivadavia", 2],
        [1, 25, "Cordoba", 2],
        [1, 25, "Jujuy", 2],
        [1, 25, "La_Rioja", 2],
        [1, 25, "Mendoza", 2],
        [1, 25, "Rio_Gallegos", 2],
        [1, 25, "San_Juan", 2],
        [1, 25, "Tucuman", 2],
        [1, 25, "Ushuaia", 2],
        [1, 25, "Catamarca", 9],
        [1, 25, "Cordoba", 9],
        [1, 25, "Jujuy", 9],
        [1, 25, "Mendoza", 9],
        [1, 25, "Rosario", 9],
        [1, 25, "Palmer", 10]
      ],
      [
        [0, 22, "Buenos_Aires", 9],
        [0, 14, "Buenos_Aires", 9],
        [0, 22, "Buenos_Aires", 2],
        [0, 22, "Catamarca", 2],
        [0, 22, "ComodRivadavia", 2],
        [0, 22, "Cordoba", 2],
        [0, 22, "Jujuy", 2],
        [0, 22, "La_Rioja", 2],
        [0, 22, "Mendoza", 2],
        [0, 22, "Rio_Gallegos", 2],
        [0, 22, "San_Juan", 2],
        [0, 22, "Tucuman", 2],
        [0, 22, "Ushuaia", 2],
        [0, 22, "Catamarca", 9],
        [0, 22, "Cordoba", 9],
        [0, 22, "Jujuy", 9],
        [0, 22, "Mendoza", 9],
        [0, 22, "Rosario", 9],
        [0, 22, "Palmer", 10],
        [0, 14, "Buenos_Aires", 2],
        [0, 14, "Catamarca", 2],
        [0, 14, "ComodRivadavia", 2],
        [0, 14, "Cordoba", 2],
        [0, 14, "Jujuy", 2],
        [0, 14, "La_Rioja", 2],
        [0, 14, "Mendoza", 2],
        [0, 14, "Rio_Gallegos", 2],
        [0, 14, "San_Juan", 2],
        [0, 14, "Tucuman", 2],
        [0, 14, "Ushuaia", 2],
        [0, 14, "Catamarca", 9],
        [0, 14, "Cordoba", 9],
        [0, 14, "Jujuy", 9],
        [0, 14, "Mendoza", 9],
        [0, 14, "Rosario", 9],
        [0, 14, "Palmer", 10]
      ],
      [
        [1, 54, "Ashkhabad", 12],
        [1, 57, "Ashkhabad", 12],
        [1, 54, "Ashgabat", 12],
        [1, 57, "Ashgabat", 12]
      ],
      [
        [0, 51, "Ashkhabad", 12],
        [0, 54, "Ashkhabad", 12],
        [0, 51, "Ashgabat", 12],
        [0, 54, "Ashgabat", 12]
      ],
      [
        [0, 47, "Riyadh", 12],
        [0, 14, "Anguilla", 9],
        [0, 14, "Antigua", 9],
        [0, 14, "Aruba", 9],
        [0, 14, "Barbados", 9],
        [0, 14, "Blanc-Sablon", 9],
        [0, 14, "Curacao", 9],
        [0, 14, "Dominica", 9],
        [0, 14, "Glace_Bay", 9],
        [0, 14, "Goose_Bay", 9],
        [0, 14, "Grenada", 9],
        [0, 14, "Guadeloupe", 9],
        [0, 14, "Halifax", 9],
        [0, 14, "Martinique", 9],
        [0, 14, "Miquelon", 9],
        [0, 14, "Moncton", 9],
        [0, 14, "Montserrat", 9],
        [0, 14, "Pangnirtung", 9],
        [0, 14, "Port_of_Spain", 9],
        [0, 14, "Puerto_Rico", 9],
        [0, 14, "Santo_Domingo", 9],
        [0, 14, "St_Kitts", 9],
        [0, 14, "St_Lucia", 9],
        [0, 14, "St_Thomas", 9],
        [0, 14, "St_Vincent", 9],
        [0, 14, "Thule", 9],
        [0, 14, "Tortola", 9],
        [0, 14, "Virgin", 9],
        [0, 14, "Bermuda", 13],
        [0, 14, "Atlantic", 16],
        [0, 47, "Aden", 12],
        [0, 47, "Baghdad", 12],
        [0, 47, "Bahrain", 12],
        [0, 47, "Kuwait", 12],
        [0, 47, "Qatar", 12]
      ],
      [
        [1, 22, "Halifax", 9],
        [1, 22, "Blanc-Sablon", 9],
        [1, 22, "Glace_Bay", 9],
        [1, 22, "Moncton", 9],
        [1, 22, "Pangnirtung", 9],
        [1, 22, "Puerto_Rico", 9],
        [1, 22, "Atlantic", 16]
      ],
      [
        [1, 31, "Azores", 13]
      ],
      [
        [1, 28, "Azores", 13],
        [1, 31, "Azores", 13]
      ],
      [
        [0, 28, "Azores", 13],
        [0, 25, "Azores", 13]
      ],
      [
        [1, 51, "Baku", 12],
        [1, 54, "Baku", 12]
      ],
      [
        [0, 47, "Baku", 12],
        [0, 51, "Baku", 12]
      ],
      [
        [1, 51, "Baku", 12],
        [1, 54, "Baku", 12]
      ],
      [
        [0, 47, "Baku", 12],
        [0, 51, "Baku", 12]
      ],
      [
        [1, 42, "London", 18],
        [1, 42, "Belfast", 18],
        [1, 42, "Gibraltar", 18],
        [1, 42, "Guernsey", 18],
        [1, 42, "Isle_of_Man", 18],
        [1, 42, "Jersey", 18],
        [1, 42, "GB"],
        [1, 42, "GB-Eire"]
      ],
      [
        [1, 4, "Adak", 9],
        [1, 4, "Atka", 9],
        [1, 4, "Nome", 9],
        [1, 4, "Aleutian"],
        [0, 57, "Dacca", 12],
        [0, 57, "Dhaka", 12]
      ],
      [
        [0, 43, "Mogadishu"],
        [0, 43, "Kampala"],
        [0, 43, "Nairobi"]
      ],
      [
        [0, 46, "Nairobi"],
        [0, 46, "Dar_es_Salaam"],
        [0, 46, "Kampala"]
      ],
      [
        [0, 15, "Barbados", 9],
        [0, 27, "Banjul"],
        [0, 41, "Tiraspol", 18],
        [0, 41, "Chisinau", 18]
      ],
      [
        [0, 63, "Brunei", 12],
        [0, 65, "Brunei", 12]
      ],
      [
        [1, 66, "Kuching", 12]
      ],
      [
        [0, 63, "Kuching", 12],
        [0, 65, "Kuching", 12]
      ],
      [
        [1, 19, "La_Paz", 9]
      ],
      [
        [0, 14, "La_Paz", 9]
      ],
      [
        [1, 25, "Sao_Paulo", 9],
        [1, 25, "Araguaina", 9],
        [1, 25, "Bahia", 9],
        [1, 25, "Belem", 9],
        [1, 25, "Fortaleza", 9],
        [1, 25, "Maceio", 9],
        [1, 25, "Recife", 9],
        [1, 25, "East", 15]
      ],
      [
        [0, 22, "Sao_Paulo", 9],
        [0, 22, "Araguaina", 9],
        [0, 22, "Bahia", 9],
        [0, 22, "Belem", 9],
        [0, 22, "Fortaleza", 9],
        [0, 22, "Maceio", 9],
        [0, 22, "Recife", 9],
        [0, 22, "East", 15]
      ],
      [
        [0, 35, "London", 18],
        [1, 35, "London", 18],
        [0, 2, "Adak", 9],
        [0, 2, "Atka", 9],
        [0, 2, "Nome", 9],
        [0, 2, "Midway", 21],
        [0, 2, "Pago_Pago", 21],
        [0, 2, "Samoa", 21],
        [0, 2, "Aleutian"],
        [0, 2, "Samoa"],
        [0, 35, "Belfast", 18],
        [0, 35, "Guernsey", 18],
        [0, 35, "Isle_of_Man", 18],
        [0, 35, "Jersey", 18],
        [0, 35, "GB"],
        [0, 35, "GB-Eire"],
        [1, 35, "Eire"],
        [1, 35, "Belfast", 18],
        [1, 35, "Dublin", 18],
        [1, 35, "Gibraltar", 18],
        [1, 35, "Guernsey", 18],
        [1, 35, "Isle_of_Man", 18],
        [1, 35, "Jersey", 18],
        [1, 35, "GB"],
        [1, 35, "GB-Eire"]
      ],
      [
        [0, 57, "Thimbu", 12],
        [0, 57, "Thimphu", 12]
      ],
      [
        [0, 58, "Calcutta", 12],
        [0, 58, "Dacca", 12],
        [0, 58, "Dhaka", 12],
        [0, 58, "Rangoon", 12]
      ],
      [
        [0, 28, "Canary", 13]
      ],
      [
        [1, 6, "Anchorage", 9],
        [1, 6, "Alaska"]
      ],
      [
        [0, 70, "Adelaide", 14],
        [1, 47, "Gaborone"],
        [1, 47, "Khartoum"]
      ],
      [
        [0, 4, "Anchorage", 9],
        [0, 4, "Alaska"],
        [0, 42, "Khartoum"],
        [0, 42, "Blantyre"],
        [0, 42, "Gaborone"],
        [0, 42, "Harare"],
        [0, 42, "Kigali"],
        [0, 42, "Lusaka"],
        [0, 42, "Maputo"],
        [0, 42, "Windhoek"]
      ],
      [
        [1, 6, "Anchorage", 9],
        [1, 6, "Alaska"]
      ],
      [
        [1, 14, "Rankin_Inlet", 9]
      ],
      [
        [1, 11, "Chicago", 9],
        [1, 14, "Havana", 9],
        [1, 14, "Cuba"],
        [1, 11, "Atikokan", 9],
        [1, 11, "Belize", 9],
        [1, 11, "Cambridge_Bay", 9],
        [1, 11, "Cancun", 9],
        [1, 11, "Chihuahua", 9],
        [1, 11, "Coral_Harbour", 9],
        [1, 11, "Costa_Rica", 9],
        [1, 11, "El_Salvador", 9],
        [1, 11, "Fort_Wayne", 9],
        [1, 11, "Guatemala", 9],
        [1, 11, "Indianapolis", 4],
        [1, 11, "Knox", 4],
        [1, 11, "Marengo", 4],
        [1, 11, "Petersburg", 4],
        [1, 11, "Vevay", 4],
        [1, 11, "Vincennes", 4],
        [1, 11, "Winamac", 4],
        [1, 11, "Indianapolis", 9],
        [1, 11, "Iqaluit", 9],
        [1, 11, "Louisville", 6],
        [1, 11, "Monticello", 6],
        [1, 11, "Knox_IN", 9],
        [1, 11, "Louisville", 9],
        [1, 11, "Managua", 9],
        [1, 11, "Menominee", 9],
        [1, 11, "Merida", 9],
        [1, 11, "Mexico_City", 9],
        [1, 11, "Monterrey", 9],
        [1, 11, "Center", 8],
        [1, 11, "New_Salem", 8],
        [1, 11, "Pangnirtung", 9],
        [1, 11, "Rainy_River", 9],
        [1, 11, "Rankin_Inlet", 9],
        [1, 11, "Tegucigalpa", 9],
        [1, 11, "Winnipeg", 9],
        [1, 11, "Central", 16],
        [1, 11, "CST6CDT"],
        [1, 11, "General", 20],
        [1, 11, "Central"],
        [1, 11, "East-Indiana"],
        [1, 11, "Indiana-Starke"],
        [1, 69, "Shanghai", 12],
        [1, 69, "Chongqing", 12],
        [1, 69, "Chungking", 12],
        [1, 69, "Harbin", 12],
        [1, 69, "Kashgar", 12],
        [1, 69, "Taipei", 12],
        [1, 69, "Urumqi", 12],
        [1, 69, "PRC"],
        [1, 69, "ROC"]
      ],
      [
        [1, 47, "Berlin", 18],
        [1, 47, "CET"]
      ],
      [
        [1, 42, "Berlin", 18],
        [1, 47, "Kaliningrad", 18],
        [1, 42, "Algiers"],
        [1, 42, "Ceuta"],
        [1, 42, "Tripoli"],
        [1, 42, "Tunis"],
        [1, 42, "Longyearbyen", 11],
        [1, 42, "Jan_Mayen", 13],
        [1, 42, "CET"],
        [1, 42, "Amsterdam", 18],
        [1, 42, "Andorra", 18],
        [1, 42, "Athens", 18],
        [1, 42, "Belgrade", 18],
        [1, 42, "Bratislava", 18],
        [1, 42, "Brussels", 18],
        [1, 42, "Budapest", 18],
        [1, 42, "Chisinau", 18],
        [1, 42, "Copenhagen", 18],
        [1, 42, "Gibraltar", 18],
        [1, 42, "Kaliningrad", 18],
        [1, 42, "Kiev", 18],
        [1, 42, "Lisbon", 18],
        [1, 42, "Ljubljana", 18],
        [1, 42, "Luxembourg", 18],
        [1, 42, "Madrid", 18],
        [1, 42, "Malta", 18],
        [1, 42, "Minsk", 18],
        [1, 42, "Monaco", 18],
        [1, 42, "Oslo", 18],
        [1, 42, "Paris", 18],
        [1, 42, "Podgorica", 18],
        [1, 42, "Prague", 18],
        [1, 42, "Riga", 18],
        [1, 42, "Rome", 18],
        [1, 42, "San_Marino", 18],
        [1, 42, "Sarajevo", 18],
        [1, 42, "Simferopol", 18],
        [1, 42, "Skopje", 18],
        [1, 42, "Sofia", 18],
        [1, 42, "Stockholm", 18],
        [1, 42, "Tallinn", 18],
        [1, 42, "Tirane", 18],
        [1, 42, "Tiraspol", 18],
        [1, 42, "Uzhgorod", 18],
        [1, 42, "Vaduz", 18],
        [1, 42, "Vatican", 18],
        [1, 42, "Vienna", 18],
        [1, 42, "Vilnius", 18],
        [1, 42, "Warsaw", 18],
        [1, 42, "Zagreb", 18],
        [1, 42, "Zaporozhye", 18],
        [1, 42, "Zurich", 18],
        [1, 42, "Libya"],
        [1, 42, "Poland"],
        [1, 42, "Portugal"],
        [1, 42, "WET"]
      ],
      [
        [0, 35, "Berlin", 18],
        [0, 35, "Algiers"],
        [0, 35, "Casablanca"],
        [0, 35, "Ceuta"],
        [0, 35, "Tripoli"],
        [0, 35, "Tunis"],
        [0, 35, "Longyearbyen", 11],
        [0, 35, "Jan_Mayen", 13],
        [0, 35, "CET"],
        [0, 35, "Amsterdam", 18],
        [0, 35, "Andorra", 18],
        [0, 35, "Athens", 18],
        [0, 35, "Belgrade", 18],
        [0, 35, "Bratislava", 18],
        [0, 35, "Brussels", 18],
        [0, 35, "Budapest", 18],
        [0, 35, "Chisinau", 18],
        [0, 35, "Copenhagen", 18],
        [0, 35, "Gibraltar", 18],
        [0, 35, "Kaliningrad", 18],
        [0, 35, "Kiev", 18],
        [0, 35, "Lisbon", 18],
        [0, 35, "Ljubljana", 18],
        [0, 35, "Luxembourg", 18],
        [0, 35, "Madrid", 18],
        [0, 35, "Malta", 18],
        [0, 35, "Minsk", 18],
        [0, 35, "Monaco", 18],
        [0, 35, "Oslo", 18],
        [0, 35, "Paris", 18],
        [0, 35, "Podgorica", 18],
        [0, 35, "Prague", 18],
        [0, 35, "Riga", 18],
        [0, 35, "Rome", 18],
        [0, 35, "San_Marino", 18],
        [0, 35, "Sarajevo", 18],
        [0, 35, "Simferopol", 18],
        [0, 35, "Skopje", 18],
        [0, 35, "Sofia", 18],
        [0, 35, "Stockholm", 18],
        [0, 35, "Tallinn", 18],
        [0, 35, "Tirane", 18],
        [0, 35, "Tiraspol", 18],
        [0, 35, "Uzhgorod", 18],
        [0, 35, "Vaduz", 18],
        [0, 35, "Vatican", 18],
        [0, 35, "Vienna", 18],
        [0, 35, "Vilnius", 18],
        [0, 35, "Warsaw", 18],
        [0, 35, "Zagreb", 18],
        [0, 35, "Zaporozhye", 18],
        [0, 35, "Zurich", 18],
        [0, 35, "Libya"],
        [0, 35, "Poland"],
        [0, 35, "Portugal"],
        [0, 35, "WET"],
        [0, 42, "Kaliningrad", 18]
      ],
      [
        [1, 28, "Scoresbysund", 9]
      ],
      [
        [0, 25, "Scoresbysund", 9]
      ],
      [
        [1, 80, "Chatham", 21],
        [1, 80, "NZ-CHAT"]
      ],
      [
        [0, 78, "Chatham", 21],
        [0, 78, "NZ-CHAT"]
      ],
      [
        [0, 67, "Harbin", 12],
        [0, 69, "Harbin", 12]
      ],
      [
        [1, 10, "Belize", 9]
      ],
      [
        [1, 72, "Choibalsan", 12]
      ],
      [
        [0, 69, "Choibalsan", 12]
      ],
      [
        [0, 65, "Dili", 12],
        [0, 65, "Makassar", 12],
        [0, 65, "Pontianak", 12],
        [0, 65, "Ujung_Pandang", 12]
      ],
      [
        [0, 69, "Sakhalin", 12]
      ],
      [
        [1, 5, "Rarotonga", 21]
      ],
      [
        [0, 4, "Rarotonga", 21]
      ],
      [
        [1, 22, "Santiago", 9],
        [1, 14, "Santiago", 9],
        [1, 22, "Palmer", 10],
        [1, 22, "Continental", 17],
        [1, 14, "Continental", 17]
      ],
      [
        [0, 14, "Santiago", 9],
        [0, 11, "Santiago", 9],
        [0, 14, "Palmer", 10],
        [0, 14, "Continental", 17],
        [0, 11, "Continental", 17]
      ],
      [
        [1, 14, "Bogota", 9]
      ],
      [
        [0, 11, "Bogota", 9]
      ],
      [
        [1, 11, "Chicago", 9],
        [1, 11, "Atikokan", 9],
        [1, 11, "Coral_Harbour", 9],
        [1, 11, "Fort_Wayne", 9],
        [1, 11, "Indianapolis", 4],
        [1, 11, "Knox", 4],
        [1, 11, "Marengo", 4],
        [1, 11, "Petersburg", 4],
        [1, 11, "Vevay", 4],
        [1, 11, "Vincennes", 4],
        [1, 11, "Winamac", 4],
        [1, 11, "Indianapolis", 9],
        [1, 11, "Louisville", 6],
        [1, 11, "Monticello", 6],
        [1, 11, "Knox_IN", 9],
        [1, 11, "Louisville", 9],
        [1, 11, "Menominee", 9],
        [1, 11, "Rainy_River", 9],
        [1, 11, "Rankin_Inlet", 9],
        [1, 11, "Winnipeg", 9],
        [1, 11, "Central", 16],
        [1, 11, "CST6CDT"],
        [1, 11, "Central"],
        [1, 11, "East-Indiana"],
        [1, 11, "Indiana-Starke"]
      ],
      [
        [0, 9, "Chicago", 9],
        [0, 11, "Havana", 9],
        [0, 11, "Cuba"],
        [0, 9, "Atikokan", 9],
        [0, 9, "Belize", 9],
        [0, 9, "Cambridge_Bay", 9],
        [0, 9, "Cancun", 9],
        [0, 9, "Chihuahua", 9],
        [0, 9, "Coral_Harbour", 9],
        [0, 9, "Costa_Rica", 9],
        [0, 9, "Detroit", 9],
        [0, 9, "El_Salvador", 9],
        [0, 9, "Fort_Wayne", 9],
        [0, 9, "Guatemala", 9],
        [0, 9, "Hermosillo", 9],
        [0, 9, "Indianapolis", 4],
        [0, 9, "Knox", 4],
        [0, 9, "Marengo", 4],
        [0, 9, "Petersburg", 4],
        [0, 9, "Vevay", 4],
        [0, 9, "Vincennes", 4],
        [0, 9, "Winamac", 4],
        [0, 9, "Indianapolis", 9],
        [0, 9, "Iqaluit", 9],
        [0, 9, "Louisville", 6],
        [0, 9, "Monticello", 6],
        [0, 9, "Knox_IN", 9],
        [0, 9, "Louisville", 9],
        [0, 9, "Managua", 9],
        [0, 9, "Mazatlan", 9],
        [0, 9, "Menominee", 9],
        [0, 9, "Merida", 9],
        [0, 9, "Mexico_City", 9],
        [0, 9, "Monterrey", 9],
        [0, 9, "Center", 8],
        [0, 9, "New_Salem", 8],
        [0, 9, "Pangnirtung", 9],
        [0, 9, "Rainy_River", 9],
        [0, 9, "Rankin_Inlet", 9],
        [0, 9, "Regina", 9],
        [0, 9, "Swift_Current", 9],
        [0, 9, "Tegucigalpa", 9],
        [0, 9, "Winnipeg", 9],
        [0, 9, "Central", 16],
        [0, 9, "East-Saskatchewan", 16],
        [0, 9, "Saskatchewan", 16],
        [0, 9, "CST6CDT"],
        [0, 9, "BajaSur", 20],
        [0, 9, "General", 20],
        [0, 9, "Central"],
        [0, 9, "East-Indiana"],
        [0, 9, "Indiana-Starke"],
        [0, 9, "Michigan"],
        [0, 65, "Chongqing", 12],
        [0, 65, "Chungking", 12],
        [0, 65, "Harbin", 12],
        [0, 65, "Kashgar", 12],
        [0, 65, "Macao", 12],
        [0, 65, "Macau", 12],
        [0, 65, "Shanghai", 12],
        [0, 65, "Taipei", 12],
        [0, 65, "Urumqi", 12],
        [0, 65, "PRC"],
        [0, 65, "ROC"],
        [0, 70, "Jayapura", 12],
        [0, 70, "Adelaide", 14],
        [0, 70, "Broken_Hill", 14],
        [0, 70, "Darwin", 14],
        [0, 70, "North", 14],
        [0, 70, "South", 14],
        [0, 70, "Yancowinna", 14],
        [1, 73, "Adelaide", 14],
        [1, 73, "Broken_Hill", 14],
        [1, 73, "Darwin", 14],
        [1, 73, "North", 14],
        [1, 73, "South", 14],
        [1, 73, "Yancowinna", 14]
      ],
      [
        [1, 28, "Cape_Verde", 13]
      ],
      [
        [0, 28, "Cape_Verde", 13],
        [0, 25, "Cape_Verde", 13]
      ],
      [
        [0, 68, "Eucla", 14],
        [1, 71, "Eucla", 14]
      ],
      [
        [1, 11, "Chicago", 9],
        [1, 11, "Atikokan", 9],
        [1, 11, "Coral_Harbour", 9],
        [1, 11, "Fort_Wayne", 9],
        [1, 11, "Indianapolis", 4],
        [1, 11, "Knox", 4],
        [1, 11, "Marengo", 4],
        [1, 11, "Petersburg", 4],
        [1, 11, "Vevay", 4],
        [1, 11, "Vincennes", 4],
        [1, 11, "Winamac", 4],
        [1, 11, "Indianapolis", 9],
        [1, 11, "Louisville", 6],
        [1, 11, "Monticello", 6],
        [1, 11, "Knox_IN", 9],
        [1, 11, "Louisville", 9],
        [1, 11, "Menominee", 9],
        [1, 11, "Mexico_City", 9],
        [1, 11, "Rainy_River", 9],
        [1, 11, "Rankin_Inlet", 9],
        [1, 11, "Winnipeg", 9],
        [1, 11, "Central", 16],
        [1, 11, "CST6CDT"],
        [1, 11, "General", 20],
        [1, 11, "Central"],
        [1, 11, "East-Indiana"],
        [1, 11, "Indiana-Starke"]
      ],
      [
        [0, 72, "Guam", 21],
        [0, 72, "Saipan", 21]
      ],
      [
        [0, 57, "Dacca", 12],
        [0, 57, "Dhaka", 12]
      ],
      [
        [0, 59, "Davis", 10]
      ],
      [
        [0, 72, "DumontDUrville", 10]
      ],
      [
        [1, 57, "Dushanbe", 12],
        [1, 59, "Dushanbe", 12]
      ],
      [
        [0, 54, "Dushanbe", 12],
        [0, 57, "Dushanbe", 12]
      ],
      [
        [1, 11, "EasterIsland", 17],
        [1, 9, "EasterIsland", 17],
        [1, 11, "Easter", 21],
        [1, 9, "Easter", 21]
      ],
      [
        [0, 9, "EasterIsland", 17],
        [0, 8, "EasterIsland", 17],
        [0, 9, "Easter", 21],
        [0, 8, "Easter", 21],
        [1, 51, "Antananarivo", 19]
      ],
      [
        [0, 47, "Khartoum"],
        [0, 47, "Addis_Ababa"],
        [0, 47, "Asmara"],
        [0, 47, "Asmera"],
        [0, 47, "Dar_es_Salaam"],
        [0, 47, "Djibouti"],
        [0, 47, "Kampala"],
        [0, 47, "Mogadishu"],
        [0, 47, "Nairobi"],
        [0, 47, "Antananarivo", 19],
        [0, 47, "Comoro", 19],
        [0, 47, "Mayotte", 19]
      ],
      [
        [0, 11, "Guayaquil", 9],
        [0, 11, "Galapagos", 21]
      ],
      [
        [1, 22, "Iqaluit", 9]
      ],
      [
        [1, 14, "New_York", 9],
        [1, 14, "Cancun", 9],
        [1, 14, "Detroit", 9],
        [1, 14, "Fort_Wayne", 9],
        [1, 14, "Grand_Turk", 9],
        [1, 14, "Indianapolis", 4],
        [1, 14, "Marengo", 4],
        [1, 14, "Vevay", 4],
        [1, 14, "Vincennes", 4],
        [1, 14, "Winamac", 4],
        [1, 14, "Indianapolis", 9],
        [1, 14, "Iqaluit", 9],
        [1, 14, "Jamaica", 9],
        [1, 14, "Louisville", 6],
        [1, 14, "Monticello", 6],
        [1, 14, "Louisville", 9],
        [1, 14, "Montreal", 9],
        [1, 14, "Nassau", 9],
        [1, 14, "Nipigon", 9],
        [1, 14, "Pangnirtung", 9],
        [1, 14, "Port-au-Prince", 9],
        [1, 14, "Santo_Domingo", 9],
        [1, 14, "Thunder_Bay", 9],
        [1, 14, "Toronto", 9],
        [1, 14, "Eastern", 16],
        [1, 14, "EST"],
        [1, 14, "EST5EDT"],
        [1, 14, "Jamaica"],
        [1, 14, "East-Indiana"],
        [1, 14, "Eastern"],
        [1, 14, "Michigan"]
      ],
      [
        [1, 47, "Helsinki", 18],
        [1, 47, "Cairo"],
        [1, 47, "Amman", 12],
        [1, 47, "Beirut", 12],
        [1, 47, "Damascus", 12],
        [1, 47, "Gaza", 12],
        [1, 47, "Istanbul", 12],
        [1, 47, "Nicosia", 12],
        [1, 47, "EET"],
        [1, 47, "Egypt"],
        [1, 47, "Athens", 18],
        [1, 47, "Bucharest", 18],
        [1, 47, "Chisinau", 18],
        [1, 47, "Istanbul", 18],
        [1, 47, "Kaliningrad", 18],
        [1, 47, "Kiev", 18],
        [1, 47, "Mariehamn", 18],
        [1, 47, "Minsk", 18],
        [1, 47, "Moscow", 18],
        [1, 47, "Nicosia", 18],
        [1, 47, "Riga", 18],
        [1, 47, "Simferopol", 18],
        [1, 47, "Sofia", 18],
        [1, 47, "Tallinn", 18],
        [1, 47, "Tiraspol", 18],
        [1, 47, "Uzhgorod", 18],
        [1, 47, "Vilnius", 18],
        [1, 47, "Warsaw", 18],
        [1, 47, "Zaporozhye", 18],
        [1, 47, "Poland"],
        [1, 47, "Turkey"],
        [1, 47, "W-SU"]
      ],
      [
        [0, 42, "Helsinki", 18],
        [1, 47, "Gaza", 12],
        [0, 42, "Cairo"],
        [0, 42, "Tripoli"],
        [0, 42, "Amman", 12],
        [0, 42, "Beirut", 12],
        [0, 42, "Damascus", 12],
        [0, 42, "Gaza", 12],
        [0, 42, "Istanbul", 12],
        [0, 42, "Nicosia", 12],
        [0, 42, "EET"],
        [0, 42, "Egypt"],
        [0, 42, "Athens", 18],
        [0, 42, "Bucharest", 18],
        [0, 42, "Chisinau", 18],
        [0, 42, "Istanbul", 18],
        [0, 42, "Kaliningrad", 18],
        [0, 42, "Kiev", 18],
        [0, 42, "Mariehamn", 18],
        [0, 42, "Minsk", 18],
        [0, 42, "Moscow", 18],
        [0, 42, "Nicosia", 18],
        [0, 42, "Riga", 18],
        [0, 42, "Simferopol", 18],
        [0, 42, "Sofia", 18],
        [0, 42, "Tallinn", 18],
        [0, 42, "Tiraspol", 18],
        [0, 42, "Uzhgorod", 18],
        [0, 42, "Vilnius", 18],
        [0, 42, "Warsaw", 18],
        [0, 42, "Zaporozhye", 18],
        [0, 42, "Libya"],
        [0, 42, "Poland"],
        [0, 42, "Turkey"],
        [0, 42, "W-SU"]
      ],
      [
        [1, 31, "Scoresbysund", 9]
      ],
      [
        [0, 28, "Scoresbysund", 9]
      ],
      [
        [1, 13, "Santo_Domingo", 9]
      ],
      [
        [0, 69, "Jayapura", 12]
      ],
      [
        [1, 14, "New_York", 9],
        [1, 14, "Detroit", 9],
        [1, 14, "Iqaluit", 9],
        [1, 14, "Montreal", 9],
        [1, 14, "Nipigon", 9],
        [1, 14, "Thunder_Bay", 9],
        [1, 14, "Toronto", 9],
        [1, 14, "Eastern", 16],
        [1, 14, "EST"],
        [1, 14, "EST5EDT"],
        [1, 14, "Eastern"],
        [1, 14, "Michigan"]
      ],
      [
        [0, 11, "New_York", 9],
        [0, 11, "Antigua", 9],
        [0, 11, "Atikokan", 9],
        [0, 11, "Cambridge_Bay", 9],
        [0, 11, "Cancun", 9],
        [0, 11, "Cayman", 9],
        [0, 11, "Chicago", 9],
        [0, 11, "Coral_Harbour", 9],
        [0, 11, "Detroit", 9],
        [0, 11, "Fort_Wayne", 9],
        [0, 11, "Grand_Turk", 9],
        [0, 11, "Indianapolis", 4],
        [0, 11, "Knox", 4],
        [0, 11, "Marengo", 4],
        [0, 11, "Petersburg", 4],
        [0, 11, "Vevay", 4],
        [0, 11, "Vincennes", 4],
        [0, 11, "Winamac", 4],
        [0, 11, "Indianapolis", 9],
        [0, 11, "Iqaluit", 9],
        [0, 11, "Jamaica", 9],
        [0, 11, "Louisville", 6],
        [0, 11, "Monticello", 6],
        [0, 11, "Knox_IN", 9],
        [0, 11, "Louisville", 9],
        [0, 11, "Managua", 9],
        [0, 11, "Menominee", 9],
        [0, 11, "Merida", 9],
        [0, 11, "Montreal", 9],
        [0, 11, "Nassau", 9],
        [0, 11, "Nipigon", 9],
        [0, 11, "Panama", 9],
        [0, 11, "Pangnirtung", 9],
        [0, 11, "Port-au-Prince", 9],
        [0, 11, "Rankin_Inlet", 9],
        [0, 11, "Santo_Domingo", 9],
        [0, 11, "Thunder_Bay", 9],
        [0, 11, "Toronto", 9],
        [0, 11, "Eastern", 16],
        [0, 11, "EST"],
        [0, 11, "EST5EDT"],
        [0, 11, "Jamaica"],
        [0, 11, "Central"],
        [0, 11, "East-Indiana"],
        [0, 11, "Eastern"],
        [0, 11, "Indiana-Starke"],
        [0, 11, "Michigan"],
        [0, 72, "ACT", 14],
        [0, 72, "Brisbane", 14],
        [0, 72, "Canberra", 14],
        [0, 72, "Currie", 14],
        [0, 72, "Hobart", 14],
        [0, 72, "Lindeman", 14],
        [0, 72, "Melbourne", 14],
        [0, 72, "NSW", 14],
        [0, 72, "Queensland", 14],
        [0, 72, "Sydney", 14],
        [0, 72, "Tasmania", 14],
        [0, 72, "Victoria", 14],
        [1, 74, "Melbourne", 14],
        [1, 74, "ACT", 14],
        [1, 74, "Brisbane", 14],
        [1, 74, "Canberra", 14],
        [1, 74, "Currie", 14],
        [1, 74, "Hobart", 14],
        [1, 74, "Lindeman", 14],
        [1, 74, "NSW", 14],
        [1, 74, "Queensland", 14],
        [1, 74, "Sydney", 14],
        [1, 74, "Tasmania", 14],
        [1, 74, "Victoria", 14]
      ],
      [
        [1, 14, "New_York", 9],
        [1, 14, "Detroit", 9],
        [1, 14, "Iqaluit", 9],
        [1, 14, "Montreal", 9],
        [1, 14, "Nipigon", 9],
        [1, 14, "Thunder_Bay", 9],
        [1, 14, "Toronto", 9],
        [1, 14, "Eastern", 16],
        [1, 14, "EST"],
        [1, 14, "EST5EDT"],
        [1, 14, "Eastern"],
        [1, 14, "Michigan"]
      ],
      [
        [1, 79, "Fiji", 21]
      ],
      [
        [0, 76, "Fiji", 21]
      ],
      [
        [1, 22, "Stanley", 13],
        [1, 25, "Stanley", 13]
      ],
      [
        [0, 22, "Stanley", 13],
        [0, 14, "Stanley", 13]
      ],
      [
        [1, 28, "Noronha", 9],
        [1, 28, "DeNoronha", 15]
      ],
      [
        [0, 25, "Noronha", 9],
        [0, 25, "DeNoronha", 15]
      ],
      [
        [0, 51, "Aqtau", 12],
        [0, 54, "Aqtau", 12]
      ],
      [
        [1, 57, "Bishkek", 12],
        [1, 59, "Bishkek", 12]
      ],
      [
        [0, 54, "Bishkek", 12],
        [0, 57, "Bishkek", 12]
      ],
      [
        [0, 9, "Galapagos", 21]
      ],
      [
        [0, 6, "Gambier", 21]
      ],
      [
        [0, 16, "Guyana", 9]
      ],
      [
        [1, 51, "Tbilisi", 12],
        [1, 54, "Tbilisi", 12]
      ],
      [
        [0, 47, "Tbilisi", 12],
        [0, 51, "Tbilisi", 12]
      ],
      [
        [0, 22, "Cayenne", 9],
        [0, 14, "Cayenne", 9]
      ],
      [
        [1, 33, "Accra"]
      ],
      [
        [0, 31, "Abidjan"],
        [0, 31, "Accra"],
        [0, 31, "Bamako"],
        [0, 31, "Banjul"],
        [0, 31, "Bissau"],
        [0, 31, "Conakry"],
        [0, 31, "Dakar"],
        [0, 31, "Freetown"],
        [0, 31, "Malabo"],
        [0, 31, "Monrovia"],
        [0, 31, "Niamey"],
        [0, 31, "Nouakchott"],
        [0, 31, "Ouagadougou"],
        [0, 31, "Porto-Novo"],
        [0, 31, "Sao_Tome"],
        [0, 31, "Timbuktu"],
        [0, 31, "Danmarkshavn", 9],
        [0, 31, "Reykjavik", 13],
        [0, 31, "St_Helena", 13],
        [0, 31, "Eire"],
        [0, 31, "Belfast", 18],
        [0, 31, "Dublin", 18],
        [0, 31, "Gibraltar", 18],
        [0, 31, "Guernsey", 18],
        [0, 31, "Isle_of_Man", 18],
        [0, 31, "Jersey", 18],
        [0, 31, "London", 18],
        [0, 31, "GB"],
        [0, 31, "GB-Eire"],
        [0, 31, "Iceland"]
      ],
      [
        [0, 51, "Dubai", 12],
        [0, 51, "Bahrain", 12],
        [0, 51, "Muscat", 12],
        [0, 51, "Qatar", 12]
      ],
      [
        [0, 22, "Guyana", 9],
        [0, 16, "Guyana", 9],
        [0, 14, "Guyana", 9]
      ],
      [
        [1, 6, "Adak", 9],
        [1, 6, "Atka", 9],
        [1, 6, "Aleutian"]
      ],
      [
        [0, 4, "Adak", 9],
        [0, 4, "Atka", 9],
        [0, 4, "Aleutian"]
      ],
      [
        [1, 5, "Honolulu", 21],
        [1, 5, "HST"],
        [1, 5, "Hawaii"]
      ],
      [
        [1, 69, "Hong_Kong", 12],
        [1, 69, "Hongkong"]
      ],
      [
        [0, 65, "Hong_Kong", 12],
        [0, 65, "Hongkong"]
      ],
      [
        [1, 65, "Hovd", 12]
      ],
      [
        [0, 57, "Hovd", 12],
        [0, 59, "Hovd", 12]
      ],
      [
        [1, 5, "Honolulu", 21],
        [1, 5, "HST"],
        [1, 5, "Hawaii"]
      ],
      [
        [0, 4, "Honolulu", 21],
        [0, 3, "Honolulu", 21],
        [0, 4, "HST"],
        [0, 4, "Hawaii"],
        [0, 3, "HST"],
        [0, 3, "Hawaii"]
      ],
      [
        [1, 5, "Honolulu", 21],
        [1, 5, "HST"],
        [1, 5, "Hawaii"]
      ],
      [
        [0, 59, "Bangkok", 12],
        [0, 59, "Phnom_Penh", 12],
        [0, 59, "Saigon", 12],
        [0, 59, "Vientiane", 12],
        [0, 65, "Phnom_Penh", 12],
        [0, 65, "Saigon", 12],
        [0, 65, "Vientiane", 12]
      ],
      [
        [1, 51, "Jerusalem", 12],
        [1, 51, "Tel_Aviv", 12],
        [1, 51, "Israel"]
      ],
      [
        [1, 47, "Jerusalem", 12],
        [1, 47, "Gaza", 12],
        [1, 47, "Tel_Aviv", 12],
        [1, 47, "Israel"]
      ],
      [
        [1, 57, "Colombo", 12]
      ],
      [
        [0, 54, "Chagos", 19],
        [0, 57, "Chagos", 19]
      ],
      [
        [1, 52, "Tehran", 12],
        [1, 54, "Tehran", 12],
        [1, 52, "Iran"],
        [1, 54, "Iran"]
      ],
      [
        [1, 65, "Irkutsk", 12],
        [1, 69, "Irkutsk", 12]
      ],
      [
        [0, 59, "Irkutsk", 12],
        [0, 65, "Irkutsk", 12]
      ],
      [
        [0, 49, "Tehran", 12],
        [0, 51, "Tehran", 12],
        [0, 49, "Iran"],
        [0, 51, "Iran"]
      ],
      [
        [1, 31, "Reykjavik", 13],
        [1, 31, "Iceland"]
      ],
      [
        [0, 42, "Jerusalem", 12],
        [0, 28, "Reykjavik", 13],
        [0, 28, "Iceland"],
        [0, 55, "Calcutta", 12],
        [0, 55, "Colombo", 12],
        [0, 55, "Dacca", 12],
        [0, 55, "Dhaka", 12],
        [0, 55, "Karachi", 12],
        [0, 55, "Katmandu", 12],
        [0, 55, "Thimbu", 12],
        [0, 55, "Thimphu", 12],
        [1, 34, "Eire"],
        [1, 34, "Dublin", 18],
        [1, 58, "Calcutta", 12],
        [1, 58, "Colombo", 12],
        [1, 58, "Karachi", 12],
        [0, 35, "Eire"],
        [0, 35, "Dublin", 18],
        [1, 35, "Eire"],
        [1, 35, "Dublin", 18],
        [0, 42, "Gaza", 12],
        [0, 42, "Tel_Aviv", 12],
        [0, 42, "Israel"]
      ],
      [
        [0, 62, "Jakarta", 12]
      ],
      [
        [1, 72, "Tokyo", 12],
        [1, 72, "Japan"]
      ],
      [
        [0, 69, "Tokyo", 12],
        [0, 69, "Dili", 12],
        [0, 69, "Jakarta", 12],
        [0, 69, "Kuala_Lumpur", 12],
        [0, 69, "Kuching", 12],
        [0, 69, "Makassar", 12],
        [0, 69, "Manila", 12],
        [0, 69, "Pontianak", 12],
        [0, 69, "Rangoon", 12],
        [0, 69, "Sakhalin", 12],
        [0, 69, "Singapore", 12],
        [0, 69, "Ujung_Pandang", 12],
        [0, 69, "Japan"],
        [0, 69, "Nauru", 21],
        [0, 69, "Singapore"]
      ],
      [
        [0, 54, "Karachi", 12]
      ],
      [
        [0, 54, "Kashgar", 12],
        [0, 55, "Kashgar", 12]
      ],
      [
        [1, 69, "Seoul", 12],
        [1, 72, "Seoul", 12],
        [1, 69, "ROK"],
        [1, 72, "ROK"]
      ],
      [
        [1, 57, "Bishkek", 12]
      ],
      [
        [0, 54, "Bishkek", 12],
        [0, 57, "Bishkek", 12]
      ],
      [
        [1, 57, "Qyzylorda", 12]
      ],
      [
        [0, 51, "Qyzylorda", 12],
        [0, 54, "Qyzylorda", 12],
        [0, 57, "Qyzylorda", 12]
      ],
      [
        [0, 38, "Vilnius", 18]
      ],
      [
        [0, 74, "Kosrae", 21],
        [0, 76, "Kosrae", 21]
      ],
      [
        [1, 59, "Krasnoyarsk", 12],
        [1, 65, "Krasnoyarsk", 12]
      ],
      [
        [0, 57, "Krasnoyarsk", 12],
        [0, 59, "Krasnoyarsk", 12]
      ],
      [
        [0, 65, "Seoul", 12],
        [0, 67, "Seoul", 12],
        [0, 69, "Seoul", 12],
        [0, 65, "Pyongyang", 12],
        [0, 65, "ROK"],
        [0, 67, "Pyongyang", 12],
        [0, 67, "ROK"],
        [0, 69, "Pyongyang", 12],
        [0, 69, "ROK"]
      ],
      [
        [1, 47, "Samara", 18],
        [1, 51, "Samara", 18],
        [1, 54, "Samara", 18]
      ],
      [
        [0, 47, "Samara", 18],
        [0, 51, "Samara", 18]
      ],
      [
        [0, 0, "Kwajalein", 21],
        [0, 0, "Kwajalein"]
      ],
      [
        [0, 73, "Lord_Howe", 14],
        [1, 74, "Lord_Howe", 14],
        [1, 75, "Lord_Howe", 14],
        [0, 73, "LHI", 14],
        [1, 74, "LHI", 14],
        [1, 75, "LHI", 14]
      ],
      [
        [0, 4, "Kiritimati", 21],
        [0, 81, "Kiritimati", 21]
      ],
      [
        [0, 57, "Colombo", 12],
        [0, 58, "Colombo", 12]
      ],
      [
        [0, 59, "Chongqing", 12],
        [0, 59, "Chungking", 12]
      ],
      [
        [0, 29, "Monrovia"]
      ],
      [
        [1, 45, "Riga", 18]
      ],
      [
        [1, 35, "Madeira", 13]
      ],
      [
        [1, 31, "Madeira", 13]
      ],
      [
        [0, 28, "Madeira", 13]
      ],
      [
        [1, 74, "Magadan", 12],
        [1, 76, "Magadan", 12]
      ],
      [
        [0, 72, "Magadan", 12],
        [0, 74, "Magadan", 12]
      ],
      [
        [1, 62, "Singapore", 12],
        [1, 62, "Kuala_Lumpur", 12],
        [1, 62, "Singapore"]
      ],
      [
        [0, 59, "Singapore", 12],
        [0, 62, "Singapore", 12],
        [0, 63, "Singapore", 12],
        [0, 59, "Kuala_Lumpur", 12],
        [0, 59, "Singapore"],
        [0, 62, "Kuala_Lumpur", 12],
        [0, 62, "Singapore"],
        [0, 63, "Kuala_Lumpur", 12],
        [0, 63, "Singapore"]
      ],
      [
        [0, 5, "Marquesas", 21]
      ],
      [
        [0, 57, "Mawson", 10]
      ],
      [
        [1, 11, "Cambridge_Bay", 9],
        [1, 11, "Yellowknife", 9]
      ],
      [
        [1, 53, "Moscow", 18],
        [1, 53, "W-SU"]
      ],
      [
        [1, 9, "Denver", 9],
        [1, 9, "Boise", 9],
        [1, 9, "Cambridge_Bay", 9],
        [1, 9, "Chihuahua", 9],
        [1, 9, "Edmonton", 9],
        [1, 9, "Hermosillo", 9],
        [1, 9, "Inuvik", 9],
        [1, 9, "Mazatlan", 9],
        [1, 9, "Center", 8],
        [1, 9, "New_Salem", 8],
        [1, 9, "Phoenix", 9],
        [1, 9, "Regina", 9],
        [1, 9, "Shiprock", 9],
        [1, 9, "Swift_Current", 9],
        [1, 9, "Yellowknife", 9],
        [1, 9, "East-Saskatchewan", 16],
        [1, 9, "Mountain", 16],
        [1, 9, "Saskatchewan", 16],
        [1, 9, "BajaSur", 20],
        [1, 9, "MST"],
        [1, 9, "MST7MDT"],
        [1, 9, "Navajo"],
        [1, 9, "Arizona"],
        [1, 9, "Mountain"]
      ],
      [
        [1, 42, "MET"]
      ],
      [
        [0, 35, "MET"]
      ],
      [
        [0, 76, "Kwajalein", 21],
        [0, 76, "Kwajalein"],
        [0, 76, "Majuro", 21]
      ],
      [
        [0, 44, "Moscow", 18],
        [0, 58, "Rangoon", 12],
        [0, 64, "Makassar", 12],
        [0, 64, "Ujung_Pandang", 12],
        [0, 44, "W-SU"]
      ],
      [
        [1, 69, "Macao", 12],
        [1, 69, "Macau", 12]
      ],
      [
        [0, 65, "Macao", 12],
        [0, 65, "Macau", 12]
      ],
      [
        [1, 9, "Denver", 9],
        [1, 9, "Boise", 9],
        [1, 9, "Cambridge_Bay", 9],
        [1, 9, "Edmonton", 9],
        [1, 9, "Center", 8],
        [1, 9, "New_Salem", 8],
        [1, 9, "Regina", 9],
        [1, 9, "Shiprock", 9],
        [1, 9, "Swift_Current", 9],
        [1, 9, "Yellowknife", 9],
        [1, 9, "East-Saskatchewan", 16],
        [1, 9, "Mountain", 16],
        [1, 9, "Saskatchewan", 16],
        [1, 9, "MST"],
        [1, 9, "MST7MDT"],
        [1, 9, "Navajo"],
        [1, 9, "Mountain"],
        [0, 72, "Saipan", 21]
      ],
      [
        [1, 51, "Moscow", 18],
        [1, 54, "Moscow", 18],
        [1, 51, "Chisinau", 18],
        [1, 51, "Kaliningrad", 18],
        [1, 51, "Kiev", 18],
        [1, 51, "Minsk", 18],
        [1, 51, "Riga", 18],
        [1, 51, "Simferopol", 18],
        [1, 51, "Tallinn", 18],
        [1, 51, "Tiraspol", 18],
        [1, 51, "Uzhgorod", 18],
        [1, 51, "Vilnius", 18],
        [1, 51, "Zaporozhye", 18],
        [1, 51, "W-SU"],
        [1, 54, "W-SU"]
      ],
      [
        [0, 47, "Moscow", 18],
        [0, 47, "Chisinau", 18],
        [0, 47, "Kaliningrad", 18],
        [0, 47, "Kiev", 18],
        [0, 47, "Minsk", 18],
        [0, 47, "Riga", 18],
        [0, 47, "Simferopol", 18],
        [0, 47, "Tallinn", 18],
        [0, 47, "Tiraspol", 18],
        [0, 47, "Uzhgorod", 18],
        [0, 47, "Vilnius", 18],
        [0, 47, "Zaporozhye", 18],
        [0, 47, "W-SU"]
      ],
      [
        [0, 8, "Denver", 9],
        [0, 8, "Boise", 9],
        [0, 8, "Cambridge_Bay", 9],
        [0, 8, "Chihuahua", 9],
        [0, 8, "Dawson_Creek", 9],
        [0, 8, "Edmonton", 9],
        [0, 8, "Ensenada", 9],
        [0, 8, "Hermosillo", 9],
        [0, 8, "Inuvik", 9],
        [0, 8, "Mazatlan", 9],
        [0, 8, "Mexico_City", 9],
        [0, 8, "Center", 8],
        [0, 8, "New_Salem", 8],
        [0, 8, "Phoenix", 9],
        [0, 8, "Regina", 9],
        [0, 8, "Shiprock", 9],
        [0, 8, "Swift_Current", 9],
        [0, 8, "Tijuana", 9],
        [0, 8, "Yellowknife", 9],
        [0, 8, "East-Saskatchewan", 16],
        [0, 8, "Mountain", 16],
        [0, 8, "Saskatchewan", 16],
        [0, 8, "BajaNorte", 20],
        [0, 8, "BajaSur", 20],
        [0, 8, "General", 20],
        [0, 8, "MST"],
        [0, 8, "MST7MDT"],
        [0, 8, "Navajo"],
        [0, 8, "Arizona"],
        [0, 8, "Mountain"],
        [1, 50, "Moscow", 18],
        [1, 50, "W-SU"]
      ],
      [
        [0, 51, "Mauritius", 19]
      ],
      [
        [0, 54, "Maldives", 19]
      ],
      [
        [1, 9, "Denver", 9],
        [1, 9, "Boise", 9],
        [1, 9, "Cambridge_Bay", 9],
        [1, 9, "Edmonton", 9],
        [1, 9, "Center", 8],
        [1, 9, "New_Salem", 8],
        [1, 9, "Phoenix", 9],
        [1, 9, "Regina", 9],
        [1, 9, "Shiprock", 9],
        [1, 9, "Swift_Current", 9],
        [1, 9, "Yellowknife", 9],
        [1, 9, "East-Saskatchewan", 16],
        [1, 9, "Mountain", 16],
        [1, 9, "Saskatchewan", 16],
        [1, 9, "MST"],
        [1, 9, "MST7MDT"],
        [1, 9, "Navajo"],
        [1, 9, "Arizona"],
        [1, 9, "Mountain"]
      ],
      [
        [0, 65, "Kuala_Lumpur", 12],
        [0, 65, "Kuching", 12]
      ],
      [
        [1, 76, "Noumea", 21]
      ],
      [
        [0, 74, "Noumea", 21]
      ],
      [
        [1, 26, "St_Johns", 9],
        [1, 26, "Newfoundland", 16]
      ],
      [
        [1, 24, "St_Johns", 9],
        [1, 23, "St_Johns", 9],
        [1, 4, "Midway", 21],
        [1, 24, "Goose_Bay", 9],
        [1, 24, "Newfoundland", 16],
        [1, 23, "Goose_Bay", 9],
        [1, 23, "Newfoundland", 16]
      ],
      [
        [0, 21, "Paramaribo", 9]
      ],
      [
        [1, 37, "Amsterdam", 18]
      ],
      [
        [0, 33, "Amsterdam", 18]
      ],
      [
        [0, 75, "Norfolk", 21]
      ],
      [
        [1, 59, "Novosibirsk", 12],
        [1, 65, "Novosibirsk", 12]
      ],
      [
        [0, 57, "Novosibirsk", 12],
        [0, 59, "Novosibirsk", 12]
      ],
      [
        [1, 24, "St_Johns", 9],
        [1, 4, "Adak", 9],
        [1, 4, "Atka", 9],
        [1, 4, "Nome", 9],
        [1, 4, "Aleutian"],
        [1, 24, "Goose_Bay", 9],
        [1, 24, "Newfoundland", 16],
        [0, 56, "Katmandu", 12]
      ],
      [
        [0, 75, "Nauru", 21],
        [0, 76, "Nauru", 21]
      ],
      [
        [0, 21, "St_Johns", 9],
        [0, 20, "St_Johns", 9],
        [0, 21, "Goose_Bay", 9],
        [0, 21, "Newfoundland", 16],
        [0, 20, "Goose_Bay", 9],
        [0, 20, "Newfoundland", 16],
        [0, 2, "Adak", 9],
        [0, 2, "Atka", 9],
        [0, 2, "Nome", 9],
        [0, 2, "Midway", 21],
        [0, 2, "Pago_Pago", 21],
        [0, 2, "Samoa", 21],
        [0, 2, "Aleutian"],
        [0, 2, "Samoa"],
        [1, 36, "Amsterdam", 18]
      ],
      [
        [0, 2, "Niue", 21],
        [0, 1, "Niue", 21]
      ],
      [
        [1, 24, "St_Johns", 9],
        [1, 4, "Adak", 9],
        [1, 4, "Atka", 9],
        [1, 4, "Nome", 9],
        [1, 4, "Aleutian"],
        [1, 24, "Goose_Bay", 9],
        [1, 24, "Newfoundland", 16]
      ],
      [
        [1, 79, "Auckland", 21],
        [1, 79, "McMurdo", 10],
        [1, 79, "South_Pole", 10],
        [1, 79, "NZ"]
      ],
      [
        [0, 75, "Auckland", 21],
        [0, 75, "NZ"]
      ],
      [
        [0, 76, "Auckland", 21],
        [1, 76, "Auckland", 21],
        [1, 77, "Auckland", 21],
        [0, 76, "McMurdo", 10],
        [0, 76, "South_Pole", 10],
        [0, 76, "NZ"],
        [1, 76, "NZ"],
        [1, 77, "NZ"]
      ],
      [
        [1, 57, "Omsk", 12],
        [1, 59, "Omsk", 12]
      ],
      [
        [0, 54, "Omsk", 12],
        [0, 57, "Omsk", 12]
      ],
      [
        [1, 54, "Oral", 12]
      ],
      [
        [0, 51, "Oral", 12],
        [0, 54, "Oral", 12]
      ],
      [
        [1, 9, "Inuvik", 9]
      ],
      [
        [1, 8, "Los_Angeles", 9],
        [1, 8, "Boise", 9],
        [1, 8, "Dawson", 9],
        [1, 8, "Dawson_Creek", 9],
        [1, 8, "Ensenada", 9],
        [1, 8, "Inuvik", 9],
        [1, 8, "Juneau", 9],
        [1, 8, "Tijuana", 9],
        [1, 8, "Vancouver", 9],
        [1, 8, "Whitehorse", 9],
        [1, 8, "Pacific", 16],
        [1, 8, "Yukon", 16],
        [1, 8, "BajaNorte", 20],
        [1, 8, "PST8PDT"],
        [1, 8, "Pacific"],
        [1, 8, "Pacific-New"]
      ],
      [
        [1, 14, "Lima", 9]
      ],
      [
        [1, 76, "Kamchatka", 12],
        [1, 79, "Kamchatka", 12]
      ],
      [
        [0, 74, "Kamchatka", 12],
        [0, 76, "Kamchatka", 12]
      ],
      [
        [0, 11, "Lima", 9]
      ],
      [
        [0, 2, "Enderbury", 21],
        [0, 79, "Enderbury", 21]
      ],
      [
        [1, 69, "Manila", 12]
      ],
      [
        [0, 65, "Manila", 12]
      ],
      [
        [1, 57, "Karachi", 12]
      ],
      [
        [0, 54, "Karachi", 12]
      ],
      [
        [1, 25, "Miquelon", 9]
      ],
      [
        [0, 22, "Miquelon", 9]
      ],
      [
        [0, 18, "Paramaribo", 9],
        [0, 17, "Paramaribo", 9],
        [0, 61, "Pontianak", 12],
        [0, 72, "DumontDUrville", 10]
      ],
      [
        [1, 8, "Los_Angeles", 9],
        [1, 8, "Dawson_Creek", 9],
        [1, 8, "Ensenada", 9],
        [1, 8, "Inuvik", 9],
        [1, 8, "Juneau", 9],
        [1, 8, "Tijuana", 9],
        [1, 8, "Vancouver", 9],
        [1, 8, "Pacific", 16],
        [1, 8, "BajaNorte", 20],
        [1, 8, "PST8PDT"],
        [1, 8, "Pacific"],
        [1, 8, "Pacific-New"]
      ],
      [
        [0, 7, "Los_Angeles", 9],
        [0, 7, "Boise", 9],
        [0, 7, "Dawson", 9],
        [0, 7, "Dawson_Creek", 9],
        [0, 7, "Ensenada", 9],
        [0, 7, "Hermosillo", 9],
        [0, 7, "Inuvik", 9],
        [0, 7, "Juneau", 9],
        [0, 7, "Mazatlan", 9],
        [0, 7, "Tijuana", 9],
        [0, 7, "Vancouver", 9],
        [0, 7, "Whitehorse", 9],
        [0, 7, "Pacific", 16],
        [0, 7, "Yukon", 16],
        [0, 7, "BajaNorte", 20],
        [0, 7, "BajaSur", 20],
        [0, 7, "Pitcairn", 21],
        [0, 7, "PST8PDT"],
        [0, 7, "Pacific"],
        [0, 7, "Pacific-New"]
      ],
      [
        [1, 8, "Los_Angeles", 9],
        [1, 8, "Dawson_Creek", 9],
        [1, 8, "Ensenada", 9],
        [1, 8, "Inuvik", 9],
        [1, 8, "Juneau", 9],
        [1, 8, "Tijuana", 9],
        [1, 8, "Vancouver", 9],
        [1, 8, "Pacific", 16],
        [1, 8, "BajaNorte", 20],
        [1, 8, "PST8PDT"],
        [1, 8, "Pacific"],
        [1, 8, "Pacific-New"]
      ],
      [
        [1, 22, "Asuncion", 9]
      ],
      [
        [0, 22, "Asuncion", 9],
        [0, 14, "Asuncion", 9]
      ],
      [
        [1, 59, "Qyzylorda", 12]
      ],
      [
        [0, 54, "Qyzylorda", 12],
        [0, 57, "Qyzylorda", 12]
      ],
      [
        [0, 51, "Reunion", 19]
      ],
      [
        [0, 39, "Riga", 18]
      ],
      [
        [0, 22, "Rothera", 10]
      ],
      [
        [1, 74, "Sakhalin", 12],
        [1, 76, "Sakhalin", 12]
      ],
      [
        [0, 72, "Sakhalin", 12],
        [0, 74, "Sakhalin", 12]
      ],
      [
        [1, 57, "Samarkand", 12],
        [1, 54, "Samara", 18]
      ],
      [
        [0, 51, "Samarkand", 12],
        [0, 54, "Samarkand", 12],
        [0, 1, "Apia", 21],
        [0, 1, "Pago_Pago", 21],
        [0, 1, "Samoa", 21],
        [0, 1, "Samoa"],
        [0, 47, "Samara", 18],
        [0, 51, "Samara", 18]
      ],
      [
        [1, 47, "Johannesburg"],
        [0, 42, "Johannesburg"],
        [1, 47, "Maseru"],
        [1, 47, "Windhoek"],
        [0, 42, "Maseru"],
        [0, 42, "Mbabane"],
        [0, 42, "Windhoek"]
      ],
      [
        [0, 74, "Guadalcanal", 21]
      ],
      [
        [0, 51, "Mahe", 19]
      ],
      [
        [0, 63, "Singapore", 12],
        [0, 65, "Singapore", 12],
        [0, 63, "Singapore"],
        [0, 65, "Singapore"]
      ],
      [
        [1, 57, "Aqtau", 12]
      ],
      [
        [0, 54, "Aqtau", 12],
        [0, 57, "Aqtau", 12]
      ],
      [
        [1, 30, "Freetown"],
        [1, 35, "Freetown"]
      ],
      [
        [0, 60, "Saigon", 12],
        [0, 12, "Santiago", 9],
        [0, 12, "Continental", 17],
        [0, 60, "Phnom_Penh", 12],
        [0, 60, "Vientiane", 12]
      ],
      [
        [0, 22, "Paramaribo", 9],
        [0, 21, "Paramaribo", 9]
      ],
      [
        [0, 2, "Samoa", 21],
        [0, 2, "Midway", 21],
        [0, 2, "Pago_Pago", 21],
        [0, 2, "Samoa"]
      ],
      [
        [0, 47, "Volgograd", 18],
        [0, 51, "Volgograd", 18]
      ],
      [
        [1, 54, "Yekaterinburg", 12],
        [1, 57, "Yekaterinburg", 12]
      ],
      [
        [0, 51, "Yekaterinburg", 12],
        [0, 54, "Yekaterinburg", 12]
      ],
      [
        [0, 47, "Syowa", 10]
      ],
      [
        [0, 4, "Tahiti", 21]
      ],
      [
        [1, 59, "Samarkand", 12],
        [1, 57, "Tashkent", 12],
        [1, 59, "Tashkent", 12]
      ],
      [
        [0, 57, "Samarkand", 12],
        [0, 54, "Tashkent", 12],
        [0, 57, "Tashkent", 12]
      ],
      [
        [1, 51, "Tbilisi", 12],
        [1, 54, "Tbilisi", 12]
      ],
      [
        [0, 47, "Tbilisi", 12],
        [0, 51, "Tbilisi", 12]
      ],
      [
        [0, 54, "Kerguelen", 19]
      ],
      [
        [0, 54, "Dushanbe", 12]
      ],
      [
        [0, 65, "Dili", 12],
        [0, 69, "Dili", 12]
      ],
      [
        [0, 48, "Tehran", 12],
        [0, 48, "Iran"],
        [0, 51, "Ashgabat", 12],
        [0, 51, "Ashkhabad", 12],
        [0, 54, "Ashgabat", 12],
        [0, 54, "Ashkhabad", 12],
        [0, 40, "Tallinn", 18]
      ],
      [
        [1, 81, "Tongatapu", 21]
      ],
      [
        [0, 79, "Tongatapu", 21]
      ],
      [
        [1, 51, "Istanbul", 18],
        [1, 51, "Istanbul", 12],
        [1, 51, "Turkey"]
      ],
      [
        [0, 47, "Istanbul", 18],
        [0, 47, "Istanbul", 12],
        [0, 47, "Turkey"]
      ],
      [
        [0, 47, "Volgograd", 18]
      ],
      [
        [1, 69, "Ulaanbaatar", 12],
        [1, 69, "Ulan_Bator", 12]
      ],
      [
        [0, 59, "Ulaanbaatar", 12],
        [0, 65, "Ulaanbaatar", 12],
        [0, 59, "Choibalsan", 12],
        [0, 59, "Ulan_Bator", 12],
        [0, 65, "Choibalsan", 12],
        [0, 65, "Ulan_Bator", 12]
      ],
      [
        [1, 54, "Oral", 12],
        [1, 57, "Oral", 12]
      ],
      [
        [0, 51, "Oral", 12],
        [0, 54, "Oral", 12],
        [0, 57, "Oral", 12]
      ],
      [
        [0, 57, "Urumqi", 12]
      ],
      [
        [1, 22, "Montevideo", 9],
        [1, 24, "Montevideo", 9]
      ],
      [
        [1, 25, "Montevideo", 9]
      ],
      [
        [0, 22, "Montevideo", 9],
        [0, 21, "Montevideo", 9]
      ],
      [
        [1, 57, "Samarkand", 12],
        [1, 57, "Tashkent", 12]
      ],
      [
        [0, 54, "Samarkand", 12],
        [0, 54, "Tashkent", 12]
      ],
      [
        [0, 14, "Caracas", 9],
        [0, 13, "Caracas", 9]
      ],
      [
        [1, 72, "Vladivostok", 12]
      ],
      [
        [0, 69, "Vladivostok", 12],
        [1, 74, "Vladivostok", 12]
      ],
      [
        [0, 69, "Vladivostok", 12],
        [0, 72, "Vladivostok", 12]
      ],
      [
        [1, 51, "Volgograd", 18],
        [1, 54, "Volgograd", 18]
      ],
      [
        [0, 47, "Volgograd", 18],
        [0, 51, "Volgograd", 18]
      ],
      [
        [0, 57, "Vostok", 10]
      ],
      [
        [1, 76, "Efate", 21]
      ],
      [
        [0, 74, "Efate", 21]
      ],
      [
        [1, 22, "Mendoza", 9],
        [1, 22, "Jujuy", 2],
        [1, 22, "Mendoza", 2],
        [1, 22, "Jujuy", 9]
      ],
      [
        [0, 14, "Mendoza", 9],
        [0, 14, "Catamarca", 2],
        [0, 14, "ComodRivadavia", 2],
        [0, 14, "Cordoba", 2],
        [0, 14, "Jujuy", 2],
        [0, 14, "La_Rioja", 2],
        [0, 14, "Mendoza", 2],
        [0, 14, "Rio_Gallegos", 2],
        [0, 14, "San_Juan", 2],
        [0, 14, "Tucuman", 2],
        [0, 14, "Ushuaia", 2],
        [0, 14, "Catamarca", 9],
        [0, 14, "Cordoba", 9],
        [0, 14, "Jujuy", 9],
        [0, 14, "Rosario", 9]
      ],
      [
        [1, 42, "Windhoek"],
        [1, 42, "Ndjamena"]
      ],
      [
        [0, 28, "Dakar"],
        [0, 28, "Bamako"],
        [0, 28, "Banjul"],
        [0, 28, "Bissau"],
        [0, 28, "Conakry"],
        [0, 28, "El_Aaiun"],
        [0, 28, "Freetown"],
        [0, 28, "Niamey"],
        [0, 28, "Nouakchott"],
        [0, 28, "Timbuktu"],
        [0, 31, "Freetown"],
        [0, 35, "Brazzaville"],
        [0, 35, "Bangui"],
        [0, 35, "Douala"],
        [0, 35, "Lagos"],
        [0, 35, "Libreville"],
        [0, 35, "Luanda"],
        [0, 35, "Malabo"],
        [0, 35, "Ndjamena"],
        [0, 35, "Niamey"],
        [0, 35, "Porto-Novo"],
        [0, 35, "Windhoek"]
      ],
      [
        [1, 42, "Lisbon", 18],
        [1, 42, "Madrid", 18],
        [1, 42, "Monaco", 18],
        [1, 42, "Paris", 18],
        [1, 42, "Portugal"],
        [1, 42, "WET"]
      ],
      [
        [1, 35, "Paris", 18],
        [1, 35, "Algiers"],
        [1, 35, "Casablanca"],
        [1, 35, "Ceuta"],
        [1, 35, "Canary", 13],
        [1, 35, "Faeroe", 13],
        [1, 35, "Faroe", 13],
        [1, 35, "Madeira", 13],
        [1, 35, "Brussels", 18],
        [1, 35, "Lisbon", 18],
        [1, 35, "Luxembourg", 18],
        [1, 35, "Madrid", 18],
        [1, 35, "Monaco", 18],
        [1, 35, "Portugal"],
        [1, 35, "WET"],
        [1, 42, "Luxembourg", 18]
      ],
      [
        [0, 31, "Paris", 18],
        [0, 31, "Algiers"],
        [0, 31, "Casablanca"],
        [0, 31, "Ceuta"],
        [0, 31, "El_Aaiun"],
        [0, 31, "Azores", 13],
        [0, 31, "Canary", 13],
        [0, 31, "Faeroe", 13],
        [0, 31, "Faroe", 13],
        [0, 31, "Madeira", 13],
        [0, 31, "Brussels", 18],
        [0, 31, "Lisbon", 18],
        [0, 31, "Luxembourg", 18],
        [0, 31, "Madrid", 18],
        [0, 31, "Monaco", 18],
        [0, 31, "Portugal"],
        [0, 31, "WET"],
        [0, 35, "Luxembourg", 18]
      ],
      [
        [1, 25, "Godthab", 9],
        [1, 25, "Danmarkshavn", 9]
      ],
      [
        [0, 22, "Godthab", 9],
        [0, 22, "Danmarkshavn", 9]
      ],
      [
        [0, 59, "Jakarta", 12],
        [0, 63, "Jakarta", 12],
        [0, 65, "Jakarta", 12],
        [0, 59, "Pontianak", 12],
        [0, 63, "Pontianak", 12],
        [0, 65, "Pontianak", 12]
      ],
      [
        [0, 65, "Perth", 14],
        [1, 69, "Perth", 14],
        [0, 2, "Apia", 21],
        [0, 65, "Casey", 10],
        [0, 65, "West", 14],
        [1, 69, "West", 14]
      ],
      [
        [1, 69, "Yakutsk", 12],
        [1, 72, "Yakutsk", 12]
      ],
      [
        [0, 65, "Yakutsk", 12],
        [0, 69, "Yakutsk", 12]
      ],
      [
        [1, 8, "Dawson", 9],
        [1, 8, "Whitehorse", 9],
        [1, 8, "Yukon", 16]
      ],
      [
        [1, 7, "Dawson", 9],
        [1, 7, "Whitehorse", 9],
        [1, 7, "Yakutat", 9],
        [1, 7, "Yukon", 16]
      ],
      [
        [1, 57, "Yekaterinburg", 12]
      ],
      [
        [0, 54, "Yekaterinburg", 12]
      ],
      [
        [1, 51, "Yerevan", 12],
        [1, 54, "Yerevan", 12]
      ],
      [
        [0, 47, "Yerevan", 12],
        [0, 51, "Yerevan", 12]
      ],
      [
        [1, 7, "Dawson", 9],
        [1, 7, "Whitehorse", 9],
        [1, 7, "Yakutat", 9],
        [1, 7, "Yukon", 16]
      ],
      [
        [0, 6, "Anchorage", 9],
        [0, 6, "Dawson", 9],
        [0, 6, "Juneau", 9],
        [0, 6, "Nome", 9],
        [0, 6, "Whitehorse", 9],
        [0, 6, "Yakutat", 9],
        [0, 6, "Yukon", 16],
        [0, 6, "Alaska"]
      ],
      [
        [1, 7, "Dawson", 9],
        [1, 7, "Whitehorse", 9],
        [1, 7, "Yakutat", 9],
        [1, 7, "Yukon", 16]
      ],
      [
        [0, 35]
      ],
      [
        [0, 42]
      ],
      [
        [0, 47]
      ],
      [
        [0, 51]
      ],
      [
        [0, 54]
      ],
      [
        [0, 57]
      ],
      [
        [0, 59]
      ],
      [
        [0, 65]
      ],
      [
        [0, 69]
      ],
      [
        [0, 72]
      ],
      [
        [0, 74]
      ],
      [
        [0, 76]
      ],
      [
        [0, 28]
      ],
      [
        [0, 25]
      ],
      [
        [0, 22]
      ],
      [
        [0, 14]
      ],
      [
        [0, 11]
      ],
      [
        [0, 9]
      ],
      [
        [0, 8]
      ],
      [
        [0, 31, "UTC"]
      ],
      [
        [0, 7]
      ],
      [
        [0, 6]
      ],
      [
        [0, 4]
      ],
      [
        [0, 2]
      ],
      [
        [0, 0]
      ],
      [
        [0, 31, "Davis", 10],
        [0, 31, "DumontDUrville", 10]
      ],
      [
        [0, 31]
      ]
    ];
  }

  if (!php_js_shared.tz_abbreviations) {
    php_js_shared.tz_abbreviations = ["acst", "act", "addt", "adt", "aft", "ahdt", "ahst", "akdt", "akst", "aktst", "aktt", "almst", "almt", "amst", "amt", "anast", "anat", "ant", "apt", "aqtst", "aqtt", "arst", "art", "ashst", "asht", "ast", "awt", "azomt", "azost", "azot", "azst", "azt", "bakst", "bakt", "bdst", "bdt", "beat", "beaut", "bmt", "bnt", "bortst", "bort", "bost", "bot", "brst", "brt", "bst", "btt", "burt", "cant", "capt", "cast", "cat", "cawt", "cddt", "cdt", "cemt", "cest", "cet", "cgst", "cgt", "chadt", "chast", "chat", "chdt", "chost", "chot", "cit", "cjt", "ckhst", "ckt", "clst", "clt", "cost", "cot", "cpt", "cst", "cvst", "cvt", "cwst", "cwt", "chst", "dact", "davt", "ddut", "dusst", "dust", "easst", "east", "eat", "ect", "eddt", "edt", "eest", "eet", "egst", "egt", "ehdt", "eit", "ept", "est", "ewt", "fjst", "fjt", "fkst", "fkt", "fnst", "fnt", "fort", "frust", "frut", "galt", "gamt", "gbgt", "gest", "get", "gft", "ghst", "gmt", "gst", "gyt", "hadt", "hast", "hdt", "hkst", "hkt", "hovst", "hovt", "hpt", "hst", "hwt", "ict", "iddt", "idt", "ihst", "iot", "irdt", "irkst", "irkt", "irst", "isst", "ist", "javt", "jdt", "jst", "kart", "kast", "kdt", "kgst", "kgt", "kizst", "kizt", "kmt", "kost", "krast", "krat", "kst", "kuyst", "kuyt", "kwat", "lhst", "lint", "lkt", "lont", "lrt", "lst", "madmt", "madst", "madt", "magst", "magt", "malst", "malt", "mart", "mawt", "mddt", "mdst", "mdt", "mest", "met", "mht", "mmt", "most", "mot", "mpt", "msd", "msk", "mst", "mut", "mvt", "mwt", "myt", "ncst", "nct", "nddt", "ndt", "negt", "nest", "net", "nft", "novst", "novt", "npt", "nrt", "nst", "nut", "nwt", "nzdt", "nzmt", "nzst", "omsst", "omst", "orast", "orat", "pddt", "pdt", "pest", "petst", "pett", "pet", "phot", "phst", "pht", "pkst", "pkt", "pmdt", "pmst", "pmt", "ppt", "pst", "pwt", "pyst", "pyt", "qyzst", "qyzt", "ret", "rmt", "rott", "sakst", "sakt", "samst", "samt", "sast", "sbt", "sct", "sgt", "shest", "shet", "slst", "smt", "srt", "sst", "stat", "svest", "svet", "syot", "taht", "tasst", "tast", "tbist", "tbit", "tft", "tjt", "tlt", "tmt", "tost", "tot", "trst", "trt", "tsat", "ulast", "ulat", "urast", "urat", "urut", "uyhst", "uyst", "uyt", "uzst", "uzt", "vet", "vlasst", "vlast", "vlat", "volst", "volt", "vost", "vust", "vut", "warst", "wart", "wast", "wat", "wemt", "west", "wet", "wgst", "wgt", "wit", "wst", "yakst", "yakt", "yddt", "ydt", "yekst", "yekt", "yerst", "yert", "ypt", "yst", "ywt", "a", "b", "c", "d", "e", "f", "g", "h", "i", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "utc", "u", "v", "w", "x", "y", "zzz", "z"];
  }

  if (!php_js_shared.tz_offsets) {
    php_js_shared.tz_offsets = [-43200, -41400, -39600, -37800, -36000, -34200, -32400, -28800, -25200, -21600, -19800, -18000, -16966, -16200, -14400, -14308, -13500, -13252, -13236, -12756, -12652, -12600, -10800, -9052, -9000, -7200, -5400, -3996, -3600, -2670, -1200, 0, 1172, 1200, 2079, 3600, 4772, 4800, 5736, 5784, 5940, 6264, 7200, 9000, 9048, 9384, 9885, 10800, 12344, 12600, 12648, 14400, 16200, 16248, 18000, 19800, 20700, 21600, 23400, 25200, 25580, 26240, 26400, 27000, 28656, 28800, 30000, 30600, 31500, 32400, 34200, 35100, 36000, 37800, 39600, 41400, 43200, 45000, 45900, 46800, 49500, 50400];
  }

  if (!php_js_shared.tz_prefixes) {
    php_js_shared.tz_prefixes = ['Africa', 'America', 'America/Argentina', 'America', 'America/Indiana', 'America', 'America/Kentucky', 'America', 'America/North_Dakota', 'America', 'Antarctica', 'Arctic', 'Asia', 'Atlantic', 'Australia', 'Brazil', 'Canada', 'Chile', 'Europe', 'Indian', 'Mexico', 'Pacific'];
  }
  // END STATIC

  //var dtz = this.date_default_timezone_get();
  for (i = 0, len = php_js_shared.tz_abbrs.length; i < len; i++) {
    indice = php_js_shared.tz_abbreviations[i];
    curr = php_js_shared.tz_abbrs[i];
    list[indice] = [];
    for (j = 0, jlen = curr.length; j < jlen; j++) {
      currSub = curr[j];
      currSubPrefix = (currSub[3] ? php_js_shared.tz_prefixes[currSub[3]] + '/' : '');
      timezone_id = currSub[2] ? (currSubPrefix + currSub[2]) : null;
      tzo = php_js_shared.tz_offsets[currSub[1]];
      dst = !! currSub[0];
      list[indice].push({
        'dst': dst,
        'offset': tzo,
        'timezone_id': timezone_id
      });
      // if (dtz === timezone_id) { // Apply this within date functions
      //     this.php_js.currentTimezoneOffset = tzo;
      //     this.php_js.currentTimezoneDST = dst;
      // }
    }
  }

  return list;
}
