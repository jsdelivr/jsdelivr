YUI.add('gallery-yplate', function(Y) {

/**
 * The module "yplate" provides simple and flexible templating using YUI.
 * Based on work by aefxx for jQote2 (http://aefxx.com/) which is "Dual licensed under the WTFPL v2 or MIT (X11) licenses".
 */
Y.yplate = function (return_core) {
/**
 * PlateCore contains the "internal" api which performs compilation,
 * templating, and caching.
 * It is designed to not contain any dependencies on YUI to fascilitate testing of the core without YUI.
 */
function PlateCore() {
  var ARR  = '[object Array]',
      STR  = '[object String]';

  var PLATE_TMPL_UNDEF_ERROR = 'UndefinedTemplateError',
      PLATE_TMPL_COMP_ERROR  = 'TemplateCompilationError',
      PLATE_TMPL_EXEC_ERROR  = 'TemplateExecutionError';

  var n = 1, tag = '%',
      escreg = /(\\|["'])/g,
      type_of = Object.prototype.toString,
      platecache = {};
  /**
   * Exeception function which tries to add some extra information.
   */
  function raise(error, ext) {
    error.message = error.message+ (ext ? "\n TYPE: " + ext: "");throw error.toString();
  }
  /**
   * Escapes \,",' in a string
   */
  function escstr(str) { return str.replace(escreg, '\\$1'); }
  
  var platecompile, plateapply, platecacheview, add, cacheSize, platetag;
  
  /**
   * Converts a string to a function object which is used to generate html.
   * It also caches the result if a cache id is provided.
   */
  platecompile = function(tid, template, tg) {  
    var cache, cacheid, elem, tmpl, t = tg || tag,
        type = type_of.call(template), tid_type = type_of.call(tid);
    
    if ( tid_type === STR ) {
      cache = platecache[tid];
      if(cache) {return cache;}
    }
    if ( type === STR) {
        elem = tmpl = template;
    } else {
      raise(new Error('Empty, undefined, or non-string template passed to platecompile'), PLATE_TMPL_UNDEF_ERROR);
    }
    /** Turn template into a one line string.*/
    var arr = tmpl.replace(/\s*<!-*\[CDATA\[\s*|\s*\]\]-*>\s*|[^:]\/{2,}.*|[\r\n\t]/g, '').replace(/\/\*.*\*\//g,"")
            .split('<'+t).join(t+'>\x1b')
                .split(t+'>');
                

    /** Turn template into a javascript eval()-able code. Using string */
    var m, l, arrm, esc = false, str ='';
    for (m=0,l=arr.length; m < l; m++ ){
        arrm = arr[m];
        if(arrm.charAt(0) !== '\x1b') {
          str += "YP_OUT+='" + escstr(arrm) + "';";
        } else if(arrm.charAt(1) === '='){
          str += "YP_OUT+=(" + arrm.substr(2) + ');';
        } else if(arrm.charAt(1) === '!'){
          esc = true;
          str += 'YP_OUT+=(_YP_ESC_("' + escstr(arr[m].substr(2)) + '"));';
        } else if(arrm.charAt(0) === ' '){
          str += "";
        } else {
          str += ";" + arrm.substr(1);
        }
    }
    str = 'try{' +
        ('var YP_OUT="";'+str+';return YP_OUT;')
            .split("YP_OUT+='';").join('')
                .split('var YP_OUT="";YP_OUT+=').join('var YP_OUT=') +
        '}catch(e){e.type="'+PLATE_TMPL_EXEC_ERROR+'";e.args=arguments;throw e;}';
    if(esc) {
      str = "var _YP_ESC_ = function(str) {return str.toString().replace(/&(?!\\w+;)/g, '&#38;').split('<').join('&#60;').split('>').join('&#62;').split('\"').join('&#34;').split(\"'\").join('&#39;');};" +
      str;
    }
    str = str.split(";;").join(";");
    var fn;
    try {
      fn = new Function('YPI, YPJ, YP_DATA, YP_DATA_SIZE, YPFN', str);
    } catch ( e ) { raise(e, PLATE_TMPL_COMP_ERROR); }

    if(tid_type === STR ) {
      cacheid = tid; n++; platecache[cacheid] = fn;
      return platecache[cacheid];
    }
    return fn;
  };/* end platecompile */
  /**
   * Merge a function template with json data to produce html as a string.
   */
  plateapply = function (platefn, data) {
    var val = [], i, s;
    try {
      if(type_of.call(data) !== ARR) {data = [data];}
      s = data.length;
      for(i=0; i <s; i++) { val.push(platefn.call(data[i], 0, i, data[i], s, platefn)); }
    } catch ( e ) { raise(e, PLATE_TMPL_EXEC_ERROR); }
    return val;
  };
  /**
   * Look at compiled template
   */
  platecacheview = function(tid) {
    var pfn = platecache[tid], fnstr;
    if(pfn) {fnstr=pfn.toString(); fnstr = fnstr.substring(fnstr.indexOf("{")+1, fnstr.lastIndexOf("}"));}
    return fnstr;
  }; 

  /**
   * Add a previously compiled template (the full function) in string form to the cache, by
   * calling the javascript compiler to re-generate the function object.
   */
  add = function(tid, compiled) {
    if(tid && compiled && type_of.call(tid) === STR && type_of.call(compiled) === STR) { 
      var cacheid = tid;
      try {
        eval("platecache[cacheid] = " + compiled + ";");
        n++;
      } catch ( e ) { raise(e, PLATE_TMPL_COMP_ERROR); }
      return true;
    }
    return false;
  };
  /**
   * Get the number of cached templates.
   */
  cacheSize = function () {return n;};
  /**
   * Set the new character which identifies start and end of
   * template statement.
   */
  platetag = function(newtag) {
    if(newtag && type_of.call(newtag) === STR){ tag = newtag;}
  };
  /**
   * For YUI return a subset of the function of the core.
   * (there is a way to get all of the functions (expose internals) by providing the correct constructor parameter)
   */
  var core_api = {"platecompile": platecompile,
                  "plateapply": plateapply,
                  "platecacheview": platecacheview,
                  "plateTag": platetag,
                  "add": add,
                  "cacheSize": cacheSize};
  return core_api;
} /*end core */

/** Start YUI interface to PlateCore */
if(return_core && return_core === true) {return new PlateCore();}
  
var core = new PlateCore();

/**
 * Gets the template as a string.
 * Supports html nodes and regular strings.
 */
function getCoreInput(candidate){
  if(Y.Lang.isString(candidate)) {return candidate;}
  candidate = Y.Node.getDOMNode(candidate);
  if(candidate) { /*"Node" || "HTMLNode"*/
    return candidate.innerHTML;
  }
  return null;
}
/**
 * The internal function for the public cachecompile function.
 */
function ycachecompile(candidate, cid, tag, _internal) {
  var txt = getCoreInput(candidate), pfn, fnstr;
  pfn = core.platecompile(cid, txt, tag);
  if(_internal === true) {return pfn;}
  if(pfn) {
    fnstr = pfn.toString();
    fnstr = fnstr.replace(/[\r\n\t]/g,"");
    fnstr = fnstr.replace(/;\s+/g, ";");
  }
  return fnstr;
}
/**
 * The internal function for the public cacheadd function.
 */
function ycacheadd(cid, compiledcache){
  return core.add(cid, compiledcache);
}
/**
 * look at part of result for what is produced by the cachecompile function.
 */
function ycacheview(cid){
  return core.platecacheview(cid);
}

/**
 * apply template to data, return YUI 3 Node|NodeList 
 */
function yplate(candidate, data, cid, tag){
  var txt = yplateText(candidate, data, cid, tag), nodes = new Y.all(""),
  i, isArr = Y.Lang.isArray(txt) && txt.length > 1, s = txt.length;
  if(isArr) {
    for(i=0; i<s; i++) {
      nodes.push(Y.Node.create(txt[i]));
    }
  } else {
    nodes = Y.Node.create(txt);
  }
  return nodes;
}

/**
 * apply template to data, return YUI 3 Node[NodeList 
 */
function yplatecache(cid, data, tag){
  var txt = yplatecacheText(cid, data, tag), nodes = new Y.all(""),
  i, isArr = Y.Lang.isArray(txt) && txt.length > 1, s = txt.length;
   if(isArr) {
    for(i=0; i<s; i++) {
      nodes.push(Y.Node.create(txt[i]));
    }
  } else {
    nodes = Y.Node.create(txt);
  }
  return nodes;
}

/**
 * apply template to data, return array of html string 
 */
function yplateText(candidate, data, cid, tag) {
  var pfn = ycachecompile(candidate, cid, tag, true);
  return core.plateapply(pfn, data);
}

/**
 * apply cached template to data, return array of html string
 */
function yplatecacheText(cid, data, tag){
  var pfn = core.platecompile(cid, null, tag, true);/* throws exception when problem. */
  return core.plateapply(pfn, data);
}

/**
 * changes the current/default tag used by this instance
 */
function yplateTag(tag){
  core.plateTag(tag);
}
/**
 * Return the public API functions.
 */
return {
"plate": yplate,
"platecache": yplatecache,
"cachecompile": ycachecompile,
"platecacheText": yplatecacheText,
"plateText": yplateText,
"plateTag": yplateTag,
"cacheview": ycacheview,
"cacheadd": ycacheadd
};
};



}, 'gallery-2011.06.08-20-04' ,{requires:['node']});
