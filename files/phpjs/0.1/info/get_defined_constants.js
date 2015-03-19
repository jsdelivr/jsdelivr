function get_defined_constants (categorize) {
  // +    original by: Brett Zamir (http://brett-zamir.me)
  // %        note 1: Could possibly substitute some others like M_PI with JavaScript's Math.PI, etc., but here
  // %        note 1: sticking to PHP, except for changing: NULL to null, NAN to NaN, and INF to Number.POSITIVE_INFINITY
  // %        note 2: TRUE, FALSE, and NULL capitalized constants (as in PHP) could work ok in some
  // %        note 2: implementations, but not all, so they are commented out
  // %        note 3: We used a PHP script to auto-convert these, so we can simply reuse it to add more below if we
  // %        note 3: implement more extensions needing constants, assuming we have a PHP set-up which
  // %        note 3: uses the extensions!
  // %        note 4: If you do ini_set('phpjs.get_defined_constants.setConstants', 'this') then call this function,
  // %        note 4: it will set the PHP constants as globals for you on the "this" object. In the namespaced version, this
  // %        note 4: means the "constants" will be attached directly to the $P object: e.g., $P.PREG_OFFSET_CAPTURE
  // %        note 4: In the non-namespaced version, this will act like the setting mentioned in note 6
  // %        note 4: If you do ini_set('phpjs.get_defined_constants.setConstants', 'thisExt') then call this function,
  // %        note 4: it will set the PHP constants for you, but will first create a namespace on your object
  // %        note 4: for each extension to which the "constants" will be added. For example, $P.pcre.PREG_OFFSET_CAPTURE
  // %        note 4: For the non-namespaced version, this will be created on window: alert(pcre.PREG_OFFSET_CAPTURE);
  // %        note 4: If you do ini_set('phpjs.get_defined_constants.setConstants', true) then call this function,
  // %        note 4: it will set the PHP constants as window globals for you, even if you are using the php.js namespaced
  // %        note 4: version. For example, you can just do: alert(PREG_OFFSET_CAPTURE); . Only the constants set directly
  // %        note 4: at the level of window globals, will actually be immutable constants.
  // %        note 5: Note that our functions might not have been designed yet to handle PHP-style constants if at all, as
  // %        note 5: some of our extensions rely simply on the constant name being passed in to the function as a
  // %        note 5:  string to work as a flag
  // -    depends on: define
  // *     example 1: var cnsts = get_defined_constants();
  // *     example 1: cnsts.E_NOTICE;
  // *     returns 1: 8
  // *     example 2: var cnsts = get_defined_constants(true); // passing false will produce the same value! (in PHP as well as here)
  // *     example 2: cnsts.internal.E_NOTICE;
  // *     returns 2: 8

  var ext = '',
    cnst = '',
    constObj = {},
    flatConstObj = {},
    win, thisExt = false;

  constObj = {
    'internal': {
      'E_ERROR': 1,
      'E_RECOVERABLE_ERROR': 4096,
      'E_WARNING': 2,
      'E_PARSE': 4,
      'E_NOTICE': 8,
      'E_STRICT': 2048,
      'E_CORE_ERROR': 16,
      'E_CORE_WARNING': 32,
      'E_COMPILE_ERROR': 64,
      'E_COMPILE_WARNING': 128,
      'E_USER_ERROR': 256,
      'E_USER_WARNING': 512,
      'E_USER_NOTICE': 1024,
      'E_ALL': 6143,
/* // Could work ok in some implementations, but not all, so commenting out
    'TRUE' : true,
    'FALSE' : false,
    'NULL' : null,
    */
      'ZEND_THREAD_SAFE': true,
      'PHP_VERSION': '5.2.6',
      'PHP_OS': 'WINNT',
      'PHP_SAPI': 'apache2handler',
      'DEFAULT_INCLUDE_PATH': '.;C:\\php5\\pear',
      'PEAR_INSTALL_DIR': 'C:\\php5\\pear',
      'PEAR_EXTENSION_DIR': 'C:\\php5',
      'PHP_EXTENSION_DIR': 'C:\\php5',
      'PHP_PREFIX': 'C:\\php5',
      'PHP_BINDIR': 'C:\\php5',
      'PHP_LIBDIR': 'C:\\php5',
      'PHP_DATADIR': 'C:\\php5',
      'PHP_SYSCONFDIR': 'C:\\php5',
      'PHP_LOCALSTATEDIR': 'C:\\php5',
      'PHP_CONFIG_FILE_PATH': 'C:\\Windows',
      'PHP_CONFIG_FILE_SCAN_DIR': '',
      'PHP_SHLIB_SUFFIX': 'dll',
      'PHP_EOL': '\n',
      'PHP_INT_MAX': 2147483647,
      'PHP_INT_SIZE': 4,
      'PHP_OUTPUT_HANDLER_START': 1,
      'PHP_OUTPUT_HANDLER_CONT': 2,
      'PHP_OUTPUT_HANDLER_END': 4,
      'UPLOAD_ERR_OK': 0,
      'UPLOAD_ERR_INI_SIZE': 1,
      'UPLOAD_ERR_FORM_SIZE': 2,
      'UPLOAD_ERR_PARTIAL': 3,
      'UPLOAD_ERR_NO_FILE': 4,
      'UPLOAD_ERR_NO_TMP_DIR': 6,
      'UPLOAD_ERR_CANT_WRITE': 7,
      'UPLOAD_ERR_EXTENSION': 8
    },
    'pcre': {
      'PREG_PATTERN_ORDER': 1,
      'PREG_SET_ORDER': 2,
      'PREG_OFFSET_CAPTURE': 256,
      'PREG_SPLIT_NO_EMPTY': 1,
      'PREG_SPLIT_DELIM_CAPTURE': 2,
      'PREG_SPLIT_OFFSET_CAPTURE': 4,
      'PREG_GREP_INVERT': 1,
      'PREG_NO_ERROR': 0,
      'PREG_INTERNAL_ERROR': 1,
      'PREG_BACKTRACK_LIMIT_ERROR': 2,
      'PREG_RECURSION_LIMIT_ERROR': 3,
      'PREG_BAD_UTF8_ERROR': 4,
      'PCRE_VERSION': '7.6 2008-01-28'
    },
    'session': {
      'DATE_ATOM': 'Y-m-d\\TH:i:sP',
      'DATE_COOKIE': 'l, d-M-y H:i:s T',
      'DATE_ISO8601': 'Y-m-d\\TH:i:sO',
      'DATE_RFC822': 'D, d M y H:i:s O',
      'DATE_RFC850': 'l, d-M-y H:i:s T',
      'DATE_RFC1036': 'D, d M y H:i:s O',
      'DATE_RFC1123': 'D, d M Y H:i:s O',
      'DATE_RFC2822': 'D, d M Y H:i:s O',
      'DATE_RFC3339': 'Y-m-d\\TH:i:sP',
      'DATE_RSS': 'D, d M Y H:i:s O',
      'DATE_W3C': 'Y-m-d\\TH:i:sP',
      'SUNFUNCS_RET_TIMESTAMP': 0,
      'SUNFUNCS_RET_STRING': 1,
      'SUNFUNCS_RET_DOUBLE': 2
    },
    'standard': {
      'CONNECTION_ABORTED': 1,
      'CONNECTION_NORMAL': 0,
      'CONNECTION_TIMEOUT': 2,
      'INI_USER': 1,
      'INI_PERDIR': 2,
      'INI_SYSTEM': 4,
      'INI_ALL': 7,
      'PHP_URL_SCHEME': 0,
      'PHP_URL_HOST': 1,
      'PHP_URL_PORT': 2,
      'PHP_URL_USER': 3,
      'PHP_URL_PASS': 4,
      'PHP_URL_PATH': 5,
      'PHP_URL_QUERY': 6,
      'PHP_URL_FRAGMENT': 7,
      'M_E': 2.718281828459,
      'M_LOG2E': 1.442695040889,
      'M_LOG10E': 0.43429448190325,
      'M_LN2': 0.69314718055995,
      'M_LN10': 2.302585092994,
      'M_PI': 3.1415926535898,
      'M_PI_2': 1.5707963267949,
      'M_PI_4': 0.78539816339745,
      'M_1_PI': 0.31830988618379,
      'M_2_PI': 0.63661977236758,
      'M_SQRTPI': 1.7724538509055,
      'M_2_SQRTPI': 1.1283791670955,
      'M_LNPI': 1.1447298858494,
      'M_EULER': 0.57721566490153,
      'M_SQRT2': 1.4142135623731,
      'M_SQRT1_2': 0.70710678118655,
      'M_SQRT3': 1.7320508075689,
      'INF': Number.POSITIVE_INFINITY,
      'NAN': 0,
      'INFO_GENERAL': 1,
      'INFO_CREDITS': 2,
      'INFO_CONFIGURATION': 4,
      'INFO_MODULES': 8,
      'INFO_ENVIRONMENT': 16,
      'INFO_VARIABLES': 32,
      'INFO_LICENSE': 64,
      'INFO_ALL': -1,
      'CREDITS_GROUP': 1,
      'CREDITS_GENERAL': 2,
      'CREDITS_SAPI': 4,
      'CREDITS_MODULES': 8,
      'CREDITS_DOCS': 16,
      'CREDITS_FULLPAGE': 32,
      'CREDITS_QA': 64,
      'CREDITS_ALL': -1,
      'HTML_SPECIALCHARS': 0,
      'HTML_ENTITIES': 1,
      'ENT_COMPAT': 2,
      'ENT_QUOTES': 3,
      'ENT_NOQUOTES': 0,
      'STR_PAD_LEFT': 0,
      'STR_PAD_RIGHT': 1,
      'STR_PAD_BOTH': 2,
      'PATHINFO_DIRNAME': 1,
      'PATHINFO_BASENAME': 2,
      'PATHINFO_EXTENSION': 4,
      'PATHINFO_FILENAME': 8,
      'CHAR_MAX': 127,
      'LC_CTYPE': 2,
      'LC_NUMERIC': 4,
      'LC_TIME': 5,
      'LC_COLLATE': 1,
      'LC_MONETARY': 3,
      'LC_ALL': 0,
      'SEEK_SET': 0,
      'SEEK_CUR': 1,
      'SEEK_END': 2,
      'LOCK_SH': 1,
      'LOCK_EX': 2,
      'LOCK_UN': 3,
      'LOCK_NB': 4,
      'STREAM_NOTIFY_CONNECT': 2,
      'STREAM_NOTIFY_AUTH_REQUIRED': 3,
      'STREAM_NOTIFY_AUTH_RESULT': 10,
      'STREAM_NOTIFY_MIME_TYPE_IS': 4,
      'STREAM_NOTIFY_FILE_SIZE_IS': 5,
      'STREAM_NOTIFY_REDIRECTED': 6,
      'STREAM_NOTIFY_PROGRESS': 7,
      'STREAM_NOTIFY_FAILURE': 9,
      'STREAM_NOTIFY_COMPLETED': 8,
      'STREAM_NOTIFY_RESOLVE': 1,
      'STREAM_NOTIFY_SEVERITY_INFO': 0,
      'STREAM_NOTIFY_SEVERITY_WARN': 1,
      'STREAM_NOTIFY_SEVERITY_ERR': 2,
      'STREAM_FILTER_READ': 1,
      'STREAM_FILTER_WRITE': 2,
      'STREAM_FILTER_ALL': 3,
      'STREAM_CLIENT_PERSISTENT': 1,
      'STREAM_CLIENT_ASYNC_CONNECT': 2,
      'STREAM_CLIENT_CONNECT': 4,
      'STREAM_CRYPTO_METHOD_SSLv2_CLIENT': 0,
      'STREAM_CRYPTO_METHOD_SSLv3_CLIENT': 1,
      'STREAM_CRYPTO_METHOD_SSLv23_CLIENT': 2,
      'STREAM_CRYPTO_METHOD_TLS_CLIENT': 3,
      'STREAM_CRYPTO_METHOD_SSLv2_SERVER': 4,
      'STREAM_CRYPTO_METHOD_SSLv3_SERVER': 5,
      'STREAM_CRYPTO_METHOD_SSLv23_SERVER': 6,
      'STREAM_CRYPTO_METHOD_TLS_SERVER': 7,
      'STREAM_SHUT_RD': 0,
      'STREAM_SHUT_WR': 1,
      'STREAM_SHUT_RDWR': 2,
      'STREAM_PF_INET': 2,
      'STREAM_PF_INET6': 23,
      'STREAM_PF_UNIX': 1,
      'STREAM_IPPROTO_IP': 0,
      'STREAM_IPPROTO_TCP': 6,
      'STREAM_IPPROTO_UDP': 17,
      'STREAM_IPPROTO_ICMP': 1,
      'STREAM_IPPROTO_RAW': 255,
      'STREAM_SOCK_STREAM': 1,
      'STREAM_SOCK_DGRAM': 2,
      'STREAM_SOCK_RAW': 3,
      'STREAM_SOCK_SEQPACKET': 5,
      'STREAM_SOCK_RDM': 4,
      'STREAM_PEEK': 2,
      'STREAM_OOB': 1,
      'STREAM_SERVER_BIND': 4,
      'STREAM_SERVER_LISTEN': 8,
      'FILE_USE_INCLUDE_PATH': 1,
      'FILE_IGNORE_NEW_LINES': 2,
      'FILE_SKIP_EMPTY_LINES': 4,
      'FILE_APPEND': 8,
      'FILE_NO_DEFAULT_CONTEXT': 16,
      'PSFS_PASS_ON': 2,
      'PSFS_FEED_ME': 1,
      'PSFS_ERR_FATAL': 0,
      'PSFS_FLAG_NORMAL': 0,
      'PSFS_FLAG_FLUSH_INC': 1,
      'PSFS_FLAG_FLUSH_CLOSE': 2,
      'CRYPT_SALT_LENGTH': 12,
      'CRYPT_STD_DES': 1,
      'CRYPT_EXT_DES': 0,
      'CRYPT_MD5': 1,
      'CRYPT_BLOWFISH': 0,
      'DIRECTORY_SEPARATOR': '\\',
      'PATH_SEPARATOR': ';',
      'GLOB_BRACE': 128,
      'GLOB_MARK': 8,
      'GLOB_NOSORT': 32,
      'GLOB_NOCHECK': 16,
      'GLOB_NOESCAPE': 4096,
      'GLOB_ERR': 4,
      'GLOB_ONLYDIR': 1073741824,
      'GLOB_AVAILABLE_FLAGS': 1073746108,
      'LOG_EMERG': 1,
      'LOG_ALERT': 1,
      'LOG_CRIT': 1,
      'LOG_ERR': 4,
      'LOG_WARNING': 5,
      'LOG_NOTICE': 6,
      'LOG_INFO': 6,
      'LOG_DEBUG': 6,
      'LOG_KERN': 0,
      'LOG_USER': 8,
      'LOG_MAIL': 16,
      'LOG_DAEMON': 24,
      'LOG_AUTH': 32,
      'LOG_SYSLOG': 40,
      'LOG_LPR': 48,
      'LOG_NEWS': 56,
      'LOG_UUCP': 64,
      'LOG_CRON': 72,
      'LOG_AUTHPRIV': 80,
      'LOG_PID': 1,
      'LOG_CONS': 2,
      'LOG_ODELAY': 4,
      'LOG_NDELAY': 8,
      'LOG_NOWAIT': 16,
      'LOG_PERROR': 32,
      'EXTR_OVERWRITE': 0,
      'EXTR_SKIP': 1,
      'EXTR_PREFIX_SAME': 2,
      'EXTR_PREFIX_ALL': 3,
      'EXTR_PREFIX_INVALID': 4,
      'EXTR_PREFIX_IF_EXISTS': 5,
      'EXTR_IF_EXISTS': 6,
      'EXTR_REFS': 256,
      'SORT_ASC': 4,
      'SORT_DESC': 3,
      'SORT_REGULAR': 0,
      'SORT_NUMERIC': 1,
      'SORT_STRING': 2,
      'SORT_LOCALE_STRING': 5,
      'CASE_LOWER': 0,
      'CASE_UPPER': 1,
      'COUNT_NORMAL': 0,
      'COUNT_RECURSIVE': 1,
      'ASSERT_ACTIVE': 1,
      'ASSERT_CALLBACK': 2,
      'ASSERT_BAIL': 3,
      'ASSERT_WARNING': 4,
      'ASSERT_QUIET_EVAL': 5,
      'STREAM_USE_PATH': 1,
      'STREAM_IGNORE_URL': 2,
      'STREAM_ENFORCE_SAFE_MODE': 4,
      'STREAM_REPORT_ERRORS': 8,
      'STREAM_MUST_SEEK': 16,
      'STREAM_URL_STAT_LINK': 1,
      'STREAM_URL_STAT_QUIET': 2,
      'STREAM_MKDIR_RECURSIVE': 1,
      'STREAM_IS_URL': 1,
      'IMAGETYPE_GIF': 1,
      'IMAGETYPE_JPEG': 2,
      'IMAGETYPE_PNG': 3,
      'IMAGETYPE_SWF': 4,
      'IMAGETYPE_PSD': 5,
      'IMAGETYPE_BMP': 6,
      'IMAGETYPE_TIFF_II': 7,
      'IMAGETYPE_TIFF_MM': 8,
      'IMAGETYPE_JPC': 9,
      'IMAGETYPE_JP2': 10,
      'IMAGETYPE_JPX': 11,
      'IMAGETYPE_JB2': 12,
      'IMAGETYPE_SWC': 13,
      'IMAGETYPE_IFF': 14,
      'IMAGETYPE_WBMP': 15,
      'IMAGETYPE_JPEG2000': 9,
      'IMAGETYPE_XBM': 16
    }
  };

  if (this.php_js && this.php_js.ini && this.php_js.ini['phpjs.get_defined_constants.setConstants'] && this.php_js.ini['phpjs.get_defined_constants.setConstants'].local_value) {
    // Allow us to set a configuration to let this function set global constants
    if (this.php_js.ini['phpjs.get_defined_constants.setConstants'].local_value === 'this') {
      win = this;
    } else if (this.php_js.ini['phpjs.get_defined_constants.setConstants'].local_value === 'thisExt') {
      win = this;
      thisExt = true;
    } else {
      win = this.window;
    }

    for (ext in constObj) {
      if (thisExt) { // Allows namespacing constants (e.g,. this.pcre.PREG_OFFSET_CAPTURE)
        for (cnst in constObj[ext]) {
          if (!win[ext]) {
            win[ext] = {};
          }
          // These will not be real constants!
          win[ext][cnst] = constObj[ext][cnst];
        }
      } else {
        for (cnst in constObj[ext]) {
          if (this === this.window) { // Take advantage of fact, in this case we can make real constants
            this.define(cnst, constObj[ext][cnst]);
          } else {
            // These will not be real constants!
            win[cnst] = constObj[ext][cnst];
          }
        }
      }
    }
  }

  if (typeof categorize !== 'undefined') { // PHP will return if any argument is set, even false
    return constObj;
  }

  for (ext in constObj) {
    for (cnst in constObj[ext]) {
      flatConstObj[cnst] = constObj[ext][cnst];
    }
  }
  return flatConstObj;
}
