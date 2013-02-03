/**
 * twig.js
 * https://github.com/schmittjoh/twig.js
 *
 * (C) 2011 Johannes M. Schmitt <schmittjoh@gmail.com>
 * Licensed under the Apache 2.0 License.
 *
 * Portions of this code are from the Google Closure Library received
 * from the Closure Authors under the Apache 2.0 License.
 */
(function() {var $JSCompiler_alias_TRUE$$ = !0, $JSCompiler_alias_NULL$$ = null, $JSCompiler_alias_FALSE$$ = !1, $JSCompiler_prototypeAlias$$, $goog$global$$ = this;
function $goog$exportPath_$$($name$$55_parts$$, $opt_object$$, $cur_opt_objectToExportTo$$) {
  $name$$55_parts$$ = $name$$55_parts$$.split(".");
  $cur_opt_objectToExportTo$$ = $cur_opt_objectToExportTo$$ || $goog$global$$;
  !($name$$55_parts$$[0] in $cur_opt_objectToExportTo$$) && $cur_opt_objectToExportTo$$.execScript && $cur_opt_objectToExportTo$$.execScript("var " + $name$$55_parts$$[0]);
  for(var $part$$;$name$$55_parts$$.length && ($part$$ = $name$$55_parts$$.shift());) {
    !$name$$55_parts$$.length && void 0 !== $opt_object$$ ? $cur_opt_objectToExportTo$$[$part$$] = $opt_object$$ : $cur_opt_objectToExportTo$$ = $cur_opt_objectToExportTo$$[$part$$] ? $cur_opt_objectToExportTo$$[$part$$] : $cur_opt_objectToExportTo$$[$part$$] = {}
  }
}
function $goog$typeOf$$($value$$41$$) {
  var $s$$2$$ = typeof $value$$41$$;
  if("object" == $s$$2$$) {
    if($value$$41$$) {
      if($value$$41$$ instanceof Array) {
        return"array"
      }
      if($value$$41$$ instanceof Object) {
        return $s$$2$$
      }
      var $className$$1$$ = Object.prototype.toString.call($value$$41$$);
      if("[object Window]" == $className$$1$$) {
        return"object"
      }
      if("[object Array]" == $className$$1$$ || "number" == typeof $value$$41$$.length && "undefined" != typeof $value$$41$$.splice && "undefined" != typeof $value$$41$$.propertyIsEnumerable && !$value$$41$$.propertyIsEnumerable("splice")) {
        return"array"
      }
      if("[object Function]" == $className$$1$$ || "undefined" != typeof $value$$41$$.call && "undefined" != typeof $value$$41$$.propertyIsEnumerable && !$value$$41$$.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if("function" == $s$$2$$ && "undefined" == typeof $value$$41$$.call) {
      return"object"
    }
  }
  return $s$$2$$
}
function $goog$isArray$$($val$$3$$) {
  return"array" == $goog$typeOf$$($val$$3$$)
}
function $goog$isString$$($val$$6$$) {
  return"string" == typeof $val$$6$$
}
function $goog$isObject$$($val$$10$$) {
  var $type$$48$$ = typeof $val$$10$$;
  return"object" == $type$$48$$ && $val$$10$$ != $JSCompiler_alias_NULL$$ || "function" == $type$$48$$
}
var $goog$UID_PROPERTY_$$ = "closure_uid_" + Math.floor(2147483648 * Math.random()).toString(36), $goog$uidCounter_$$ = 0;
function $goog$bindNative_$$($fn$$, $selfObj$$1$$, $var_args$$24$$) {
  return $fn$$.call.apply($fn$$.bind, arguments)
}
function $goog$bindJs_$$($fn$$1$$, $selfObj$$2$$, $var_args$$25$$) {
  if(!$fn$$1$$) {
    throw Error();
  }
  if(2 < arguments.length) {
    var $boundArgs$$ = Array.prototype.slice.call(arguments, 2);
    return function() {
      var $newArgs$$ = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply($newArgs$$, $boundArgs$$);
      return $fn$$1$$.apply($selfObj$$2$$, $newArgs$$)
    }
  }
  return function() {
    return $fn$$1$$.apply($selfObj$$2$$, arguments)
  }
}
function $goog$bind$$($fn$$2$$, $selfObj$$3$$, $var_args$$26$$) {
  $goog$bind$$ = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? $goog$bindNative_$$ : $goog$bindJs_$$;
  return $goog$bind$$.apply($JSCompiler_alias_NULL$$, arguments)
}
function $goog$exportSymbol$$($publicPath$$, $object$$) {
  $goog$exportPath_$$($publicPath$$, $object$$, void 0)
}
function $goog$inherits$$($childCtor$$, $parentCtor$$) {
  function $tempCtor$$() {
  }
  $tempCtor$$.prototype = $parentCtor$$.prototype;
  $childCtor$$.$superClass_$ = $parentCtor$$.prototype;
  $childCtor$$.prototype = new $tempCtor$$
}
;function $goog$string$subs$$($str$$12$$, $var_args$$29$$) {
  for(var $i$$5$$ = 1;$i$$5$$ < arguments.length;$i$$5$$++) {
    var $replacement$$ = ("" + arguments[$i$$5$$]).replace(/\$/g, "$$$$"), $str$$12$$ = $str$$12$$.replace(/\%s/, $replacement$$)
  }
  return $str$$12$$
}
var $goog$string$amperRe_$$ = /&/g, $goog$string$ltRe_$$ = /</g, $goog$string$gtRe_$$ = />/g, $goog$string$quotRe_$$ = /\"/g, $goog$string$allRe_$$ = /[&<>\"]/, $goog$string$specialEscapeChars_$$ = {"\x00":"\\0", "\u0008":"\\b", "\u000c":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\"}, $goog$string$jsEscapeCache_$$ = {"'":"\\'"};
var $goog$userAgent$jscript$DETECTED_HAS_JSCRIPT_$$;
($goog$userAgent$jscript$DETECTED_HAS_JSCRIPT_$$ = "ScriptEngine" in $goog$global$$ && "JScript" == $goog$global$$.ScriptEngine()) && ($goog$global$$.ScriptEngineMajorVersion(), $goog$global$$.ScriptEngineMinorVersion(), $goog$global$$.ScriptEngineBuildVersion());
function $goog$string$StringBuffer$$($opt_a1$$, $var_args$$31$$) {
  this.$buffer_$ = $goog$userAgent$jscript$DETECTED_HAS_JSCRIPT_$$ ? [] : "";
  $opt_a1$$ != $JSCompiler_alias_NULL$$ && this.append.apply(this, arguments)
}
$goog$userAgent$jscript$DETECTED_HAS_JSCRIPT_$$ ? ($goog$string$StringBuffer$$.prototype.$bufferLength_$ = 0, $goog$string$StringBuffer$$.prototype.append = function $$goog$string$StringBuffer$$$$append$($a1$$, $opt_a2$$, $var_args$$32$$) {
  $opt_a2$$ == $JSCompiler_alias_NULL$$ ? this.$buffer_$[this.$bufferLength_$++] = $a1$$ : (this.$buffer_$.push.apply(this.$buffer_$, arguments), this.$bufferLength_$ = this.$buffer_$.length);
  return this
}) : $goog$string$StringBuffer$$.prototype.append = function $$goog$string$StringBuffer$$$$append$($a1$$1$$, $opt_a2$$1$$, $var_args$$33$$) {
  this.$buffer_$ += $a1$$1$$;
  if($opt_a2$$1$$ != $JSCompiler_alias_NULL$$) {
    for(var $i$$12$$ = 1;$i$$12$$ < arguments.length;$i$$12$$++) {
      this.$buffer_$ += arguments[$i$$12$$]
    }
  }
  return this
};
$goog$string$StringBuffer$$.prototype.clear = function $$goog$string$StringBuffer$$$$clear$() {
  $goog$userAgent$jscript$DETECTED_HAS_JSCRIPT_$$ ? this.$bufferLength_$ = this.$buffer_$.length = 0 : this.$buffer_$ = ""
};
$goog$string$StringBuffer$$.prototype.toString = function $$goog$string$StringBuffer$$$$toString$() {
  if($goog$userAgent$jscript$DETECTED_HAS_JSCRIPT_$$) {
    var $str$$44$$ = this.$buffer_$.join("");
    this.clear();
    $str$$44$$ && this.append($str$$44$$);
    return $str$$44$$
  }
  return this.$buffer_$
};
function $goog$object$forEach$$($obj$$21$$, $f$$, $opt_obj$$1$$) {
  for(var $key$$15$$ in $obj$$21$$) {
    $f$$.call($opt_obj$$1$$, $obj$$21$$[$key$$15$$], $key$$15$$, $obj$$21$$)
  }
}
function $goog$object$findKey$$($obj$$35$$, $f$$5$$) {
  for(var $key$$27$$ in $obj$$35$$) {
    if($f$$5$$.call(void 0, $obj$$35$$[$key$$27$$], $key$$27$$, $obj$$35$$)) {
      return $key$$27$$
    }
  }
}
var $goog$object$PROTOTYPE_FIELDS_$$ = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
function $goog$object$extend$$($target$$37$$, $var_args$$35$$) {
  for(var $key$$38$$, $source$$2$$, $i$$17$$ = 1;$i$$17$$ < arguments.length;$i$$17$$++) {
    $source$$2$$ = arguments[$i$$17$$];
    for($key$$38$$ in $source$$2$$) {
      $target$$37$$[$key$$38$$] = $source$$2$$[$key$$38$$]
    }
    for(var $j$$1$$ = 0;$j$$1$$ < $goog$object$PROTOTYPE_FIELDS_$$.length;$j$$1$$++) {
      $key$$38$$ = $goog$object$PROTOTYPE_FIELDS_$$[$j$$1$$], Object.prototype.hasOwnProperty.call($source$$2$$, $key$$38$$) && ($target$$37$$[$key$$38$$] = $source$$2$$[$key$$38$$])
    }
  }
}
;function $goog$debug$Error$$($opt_msg$$) {
  this.stack = Error().stack || "";
  $opt_msg$$ && (this.message = "" + $opt_msg$$)
}
$goog$inherits$$($goog$debug$Error$$, Error);
function $goog$asserts$AssertionError$$($messagePattern$$, $messageArgs$$) {
  $messageArgs$$.unshift($messagePattern$$);
  $goog$debug$Error$$.call(this, $goog$string$subs$$.apply($JSCompiler_alias_NULL$$, $messageArgs$$));
  $messageArgs$$.shift()
}
$goog$inherits$$($goog$asserts$AssertionError$$, $goog$debug$Error$$);
function $goog$asserts$assert$$($condition$$1$$, $opt_message$$8$$, $var_args$$38$$) {
  if(!$condition$$1$$) {
    var $givenArgs$$inline_3$$ = Array.prototype.slice.call(arguments, 2), $message$$inline_4$$ = "Assertion failed";
    if($opt_message$$8$$) {
      var $message$$inline_4$$ = $message$$inline_4$$ + (": " + $opt_message$$8$$), $args$$inline_5$$ = $givenArgs$$inline_3$$
    }
    throw new $goog$asserts$AssertionError$$("" + $message$$inline_4$$, $args$$inline_5$$ || []);
  }
}
;var $goog$array$ARRAY_PROTOTYPE_$$ = Array.prototype, $goog$array$indexOf$$ = $goog$array$ARRAY_PROTOTYPE_$$.indexOf ? function($arr$$10$$, $obj$$47$$, $opt_fromIndex$$6$$) {
  $goog$asserts$assert$$($arr$$10$$.length != $JSCompiler_alias_NULL$$);
  return $goog$array$ARRAY_PROTOTYPE_$$.indexOf.call($arr$$10$$, $obj$$47$$, $opt_fromIndex$$6$$)
} : function($arr$$11$$, $obj$$48$$, $fromIndex_i$$20_opt_fromIndex$$7$$) {
  $fromIndex_i$$20_opt_fromIndex$$7$$ = $fromIndex_i$$20_opt_fromIndex$$7$$ == $JSCompiler_alias_NULL$$ ? 0 : 0 > $fromIndex_i$$20_opt_fromIndex$$7$$ ? Math.max(0, $arr$$11$$.length + $fromIndex_i$$20_opt_fromIndex$$7$$) : $fromIndex_i$$20_opt_fromIndex$$7$$;
  if($goog$isString$$($arr$$11$$)) {
    return!$goog$isString$$($obj$$48$$) || 1 != $obj$$48$$.length ? -1 : $arr$$11$$.indexOf($obj$$48$$, $fromIndex_i$$20_opt_fromIndex$$7$$)
  }
  for(;$fromIndex_i$$20_opt_fromIndex$$7$$ < $arr$$11$$.length;$fromIndex_i$$20_opt_fromIndex$$7$$++) {
    if($fromIndex_i$$20_opt_fromIndex$$7$$ in $arr$$11$$ && $arr$$11$$[$fromIndex_i$$20_opt_fromIndex$$7$$] === $obj$$48$$) {
      return $fromIndex_i$$20_opt_fromIndex$$7$$
    }
  }
  return-1
}, $goog$array$forEach$$ = $goog$array$ARRAY_PROTOTYPE_$$.forEach ? function($arr$$14$$, $f$$7$$, $opt_obj$$6$$) {
  $goog$asserts$assert$$($arr$$14$$.length != $JSCompiler_alias_NULL$$);
  $goog$array$ARRAY_PROTOTYPE_$$.forEach.call($arr$$14$$, $f$$7$$, $opt_obj$$6$$)
} : function($arr$$15$$, $f$$8$$, $opt_obj$$7$$) {
  for(var $l$$2$$ = $arr$$15$$.length, $arr2$$ = $goog$isString$$($arr$$15$$) ? $arr$$15$$.split("") : $arr$$15$$, $i$$22$$ = 0;$i$$22$$ < $l$$2$$;$i$$22$$++) {
    $i$$22$$ in $arr2$$ && $f$$8$$.call($opt_obj$$7$$, $arr2$$[$i$$22$$], $i$$22$$, $arr$$15$$)
  }
};
var $twig$bind$$ = $goog$bind$$, $goog$UID_PROPERTY_$$ = "twig_ui_" + Math.floor(2147483648 * Math.random()).toString(36);
function $twig$empty$$($value$$58$$) {
  return $JSCompiler_alias_NULL$$ === $value$$58$$ || $JSCompiler_alias_FALSE$$ === $value$$58$$ || void 0 === $value$$58$$ || 0 === $value$$58$$ ? $JSCompiler_alias_TRUE$$ : $twig$countable$$($value$$58$$) ? 0 === $twig$count$$($value$$58$$) : $JSCompiler_alias_FALSE$$
}
function $twig$extend$$($target$$39$$, $var_args$$52$$) {
  $goog$object$extend$$.apply($JSCompiler_alias_NULL$$, Array.prototype.slice.call(arguments, 0));
  return $target$$39$$
}
function $twig$countable$$($v$$1$$) {
  return $goog$isArray$$($v$$1$$) || $goog$isString$$($v$$1$$) || $goog$isObject$$($v$$1$$)
}
function $twig$count$$($v$$2$$) {
  if($goog$isArray$$($v$$2$$)) {
    return $v$$2$$.length
  }
  if($goog$isString$$($v$$2$$)) {
    return $v$$2$$.length
  }
  if($goog$isObject$$($v$$2$$)) {
    var $rv$$inline_9$$ = 0, $key$$inline_10$$;
    for($key$$inline_10$$ in $v$$2$$) {
      $rv$$inline_9$$++
    }
    return $rv$$inline_9$$
  }
  throw Error(typeof $v$$2$$ + " is not countable.");
}
function $twig$forEach$$($v$$3$$, $func$$3$$, $opt_this$$2$$) {
  $goog$isArray$$($v$$3$$) ? $goog$array$forEach$$($v$$3$$, $func$$3$$, $opt_this$$2$$) : $goog$object$forEach$$($v$$3$$, $func$$3$$, $opt_this$$2$$)
}
;function $twig$Template$$($env$$) {
  this.env_ = $env$$;
  this.$blocks_$ = [];
  this.$traits_$ = {}
}
$JSCompiler_prototypeAlias$$ = $twig$Template$$.prototype;
$JSCompiler_prototypeAlias$$.$getBlocks$ = function $$JSCompiler_prototypeAlias$$$$getBlocks$$() {
  return this.$blocks_$
};
$JSCompiler_prototypeAlias$$.$setBlocks$ = function $$JSCompiler_prototypeAlias$$$$setBlocks$$($blocks$$) {
  this.$blocks_$ = $blocks$$
};
$JSCompiler_prototypeAlias$$.$setTraits$ = function $$JSCompiler_prototypeAlias$$$$setTraits$$($traits$$) {
  this.$traits_$ = $traits$$
};
$JSCompiler_prototypeAlias$$.getParent = function $$JSCompiler_prototypeAlias$$$getParent$($context_parent$$2$$) {
  $context_parent$$2$$ = this.getParent_($context_parent$$2$$);
  return $JSCompiler_alias_FALSE$$ === $context_parent$$2$$ ? $JSCompiler_alias_FALSE$$ : this.env_.$createTemplate$($context_parent$$2$$)
};
$JSCompiler_prototypeAlias$$.$renderParentBlock$ = function $$JSCompiler_prototypeAlias$$$$renderParentBlock$$($name$$58$$, $context$$1$$, $opt_blocks$$) {
  if($name$$58$$ in this.$traits_$) {
    var $parent$$3_sb$$2$$ = new $goog$string$StringBuffer$$;
    this.$traits_$[$name$$58$$]($parent$$3_sb$$2$$, $context$$1$$, $opt_blocks$$ || {});
    return $parent$$3_sb$$2$$.toString()
  }
  $parent$$3_sb$$2$$ = this.getParent($context$$1$$);
  if($JSCompiler_alias_FALSE$$ !== $parent$$3_sb$$2$$) {
    return $parent$$3_sb$$2$$.$renderBlock$($name$$58$$, $context$$1$$, $opt_blocks$$)
  }
  throw Error("The template '" + this.$getTemplateName$() + "' has no parent, and no trait defining the block '" + $name$$58$$ + "'.");
};
$JSCompiler_prototypeAlias$$.$renderBlock$ = function $$JSCompiler_prototypeAlias$$$$renderBlock$$($name$$59$$, $context$$2$$, $opt_blocks$$1$$) {
  if($opt_blocks$$1$$ && $name$$59$$ in $opt_blocks$$1$$) {
    var $parent$$4_sb$$3$$ = new $goog$string$StringBuffer$$, $block$$ = $opt_blocks$$1$$[$name$$59$$];
    delete $opt_blocks$$1$$[$name$$59$$];
    $block$$($parent$$4_sb$$3$$, $context$$2$$, $opt_blocks$$1$$);
    return $parent$$4_sb$$3$$.toString()
  }
  if($name$$59$$ in this.$blocks_$) {
    return $parent$$4_sb$$3$$ = new $goog$string$StringBuffer$$, this.$blocks_$[$name$$59$$]($parent$$4_sb$$3$$, $context$$2$$, $opt_blocks$$1$$), $parent$$4_sb$$3$$.toString()
  }
  $parent$$4_sb$$3$$ = this.getParent($context$$2$$);
  return $JSCompiler_alias_FALSE$$ !== $parent$$4_sb$$3$$ ? $parent$$4_sb$$3$$.$renderBlock$($name$$59$$, $context$$2$$, $opt_blocks$$1$$) : ""
};
$JSCompiler_prototypeAlias$$.$render$ = function $$JSCompiler_prototypeAlias$$$$render$$($opt_context$$5$$, $opt_blocks$$2$$) {
  var $sb$$4$$ = new $goog$string$StringBuffer$$;
  this.render_($sb$$4$$, $opt_context$$5$$ || {}, $opt_blocks$$2$$ || {});
  return $sb$$4$$.toString()
};
function $twig$Environment$$() {
  this.$extensions_$ = {};
  this.$filters_$ = {};
  this.$functions_$ = {};
  this.$tests_$ = {};
  this.$createdTemplates_$ = {};
  this.$globals_$ = {};
  this.$runtimeInitialized$ = $JSCompiler_alias_FALSE$$
}
$JSCompiler_prototypeAlias$$ = $twig$Environment$$.prototype;
$JSCompiler_prototypeAlias$$.$render$ = function $$JSCompiler_prototypeAlias$$$$render$$($ctor$$2$$, $opt_context$$6$$) {
  var $template$$ = this.$createTemplate$($ctor$$2$$);
  return $template$$.$render$.call($template$$, $twig$extend$$({}, this.$globals_$, $opt_context$$6$$ || {}))
};
$JSCompiler_prototypeAlias$$.filter = function $$JSCompiler_prototypeAlias$$$filter$($name$$60$$, $arg1$$, $var_args$$54$$) {
  if(!($name$$60$$ in this.$filters_$)) {
    throw Error("The filter '" + $name$$60$$ + "' does not exist.");
  }
  return this.$filters_$[$name$$60$$].apply($JSCompiler_alias_NULL$$, Array.prototype.slice.call(arguments, 1))
};
$JSCompiler_prototypeAlias$$.$invoke$ = function $$JSCompiler_prototypeAlias$$$$invoke$$($name$$61$$, $arg1$$1$$, $var_args$$55$$) {
  if(!($name$$61$$ in this.$functions_$)) {
    throw Error("The function '" + $name$$61$$ + "' does not exist.");
  }
  return this.$functions_$[$name$$61$$].apply($JSCompiler_alias_NULL$$, Array.prototype.slice.call(arguments, 1))
};
$JSCompiler_prototypeAlias$$.test = function $$JSCompiler_prototypeAlias$$$test$($name$$62$$, $arg1$$2$$, $var_args$$56$$) {
  if(!($name$$62$$ in this.$tests_$)) {
    throw Error("The test '" + $name$$62$$ + "' does not exist.");
  }
  return this.$tests_$[$name$$62$$].apply($JSCompiler_alias_NULL$$, Array.prototype.slice.call(arguments, 1))
};
$JSCompiler_prototypeAlias$$.$macro$ = function $$JSCompiler_prototypeAlias$$$$macro$$($templateCtor$$, $macroName$$, $var_args$$57$$) {
  var $template$$1$$ = this.$createTemplate$($templateCtor$$), $macro$$ = $template$$1$$["get" + $macroName$$];
  if(!$macro$$) {
    throw Error("The macro '" + $macroName$$ + "' does not exist on template '" + $template$$1$$.$getTemplateName$() + "'.");
  }
  return $macro$$.apply($template$$1$$, Array.prototype.slice.call(arguments, 2)).toString()
};
$JSCompiler_prototypeAlias$$.$setFilter$ = function $$JSCompiler_prototypeAlias$$$$setFilter$$($name$$63$$, $filter$$) {
  this.$filters_$[$name$$63$$] = $filter$$
};
$JSCompiler_prototypeAlias$$.$setFunction$ = function $$JSCompiler_prototypeAlias$$$$setFunction$$($name$$64$$, $func$$4$$) {
  this.$functions_$[$name$$64$$] = $func$$4$$
};
$JSCompiler_prototypeAlias$$.$setTest$ = function $$JSCompiler_prototypeAlias$$$$setTest$$($name$$65$$, $func$$5$$) {
  this.$tests_$[$name$$65$$] = $func$$5$$
};
$JSCompiler_prototypeAlias$$.$getGlobals$ = function $$JSCompiler_prototypeAlias$$$$getGlobals$$() {
  return this.$globals_$
};
$JSCompiler_prototypeAlias$$.$initRuntime$ = function $$JSCompiler_prototypeAlias$$$$initRuntime$$() {
  this.$runtimeInitialized$ = $JSCompiler_alias_TRUE$$;
  $goog$object$forEach$$(this.$extensions_$, function($extension$$) {
    $extension$$.$initRuntime$()
  }, this)
};
$JSCompiler_prototypeAlias$$.$hasExtension$ = function $$JSCompiler_prototypeAlias$$$$hasExtension$$($name$$66$$) {
  return $name$$66$$ in this.$extensions_$
};
$JSCompiler_prototypeAlias$$.getExtension = function $$JSCompiler_prototypeAlias$$$getExtension$($name$$67$$) {
  if(!($name$$67$$ in this.$extensions_$)) {
    throw Error('The "' + $name$$67$$ + '" extension is not enabled.');
  }
  return this.$extensions_$[$name$$67$$]
};
$JSCompiler_prototypeAlias$$.$addExtension$ = function $$JSCompiler_prototypeAlias$$$$addExtension$$($extension$$1$$) {
  this.$extensions_$[$extension$$1$$.getName()] = $extension$$1$$
};
$JSCompiler_prototypeAlias$$.$removeExtension$ = function $$JSCompiler_prototypeAlias$$$$removeExtension$$($name$$68$$) {
  delete this.$extensions_$[$name$$68$$]
};
$JSCompiler_prototypeAlias$$.$setExtensions$ = function $$JSCompiler_prototypeAlias$$$$setExtensions$$($extensions$$) {
  $goog$object$forEach$$($extensions$$, function($extension$$2$$) {
    this.$addExtension$($extension$$2$$)
  })
};
$JSCompiler_prototypeAlias$$.$getExtensions$ = function $$JSCompiler_prototypeAlias$$$$getExtensions$$() {
  return this.$extensions_$
};
$JSCompiler_prototypeAlias$$.$createTemplate$ = function $$JSCompiler_prototypeAlias$$$$createTemplate$$($ctor$$3_template$$2$$) {
  var $uid$$ = $ctor$$3_template$$2$$[$goog$UID_PROPERTY_$$] || ($ctor$$3_template$$2$$[$goog$UID_PROPERTY_$$] = ++$goog$uidCounter_$$);
  if($uid$$ in this.$createdTemplates_$) {
    return this.$createdTemplates_$[$uid$$]
  }
  $JSCompiler_alias_FALSE$$ === this.$runtimeInitialized$ && this.$initRuntime$();
  $ctor$$3_template$$2$$ = new $ctor$$3_template$$2$$(this);
  return this.$createdTemplates_$[$uid$$] = $ctor$$3_template$$2$$
};
function $twig$Markup$$($content$$) {
  this.$content_$ = $content$$
}
$twig$Markup$$.prototype.toString = function $$twig$Markup$$$$toString$() {
  return this.$content_$
};
window.Twig = new $twig$Environment$$;
$goog$exportSymbol$$("goog.provide", function($name$$53$$) {
  $goog$exportPath_$$($name$$53$$)
});
$goog$exportSymbol$$("twig.attr", function($obj$$56$$, $attr_functionName$$, $opt_args$$1$$, $accessType_opt_accessType$$, $isTest_opt_isTest$$) {
  $accessType_opt_accessType$$ = $accessType_opt_accessType$$ || "any";
  $isTest_opt_isTest$$ = void 0 !== $isTest_opt_isTest$$ ? $isTest_opt_isTest$$ : $JSCompiler_alias_FALSE$$;
  if(!$goog$isObject$$($obj$$56$$) && !$goog$isArray$$($obj$$56$$)) {
    return $isTest_opt_isTest$$ ? $JSCompiler_alias_FALSE$$ : $JSCompiler_alias_NULL$$
  }
  if($attr_functionName$$ in $obj$$56$$) {
    if("array" !== $accessType_opt_accessType$$ && "function" == $goog$typeOf$$($obj$$56$$[$attr_functionName$$])) {
      return $isTest_opt_isTest$$ ? $JSCompiler_alias_TRUE$$ : $obj$$56$$[$attr_functionName$$].apply($obj$$56$$, $opt_args$$1$$ || [])
    }
    if("method" !== $accessType_opt_accessType$$) {
      return $isTest_opt_isTest$$ ? $JSCompiler_alias_TRUE$$ : $obj$$56$$[$attr_functionName$$]
    }
  }
  if("array" === $accessType_opt_accessType$$ || $goog$isArray$$($obj$$56$$)) {
    return $isTest_opt_isTest$$ ? $JSCompiler_alias_FALSE$$ : $JSCompiler_alias_NULL$$
  }
  var $attr_functionName$$ = $attr_functionName$$.toLowerCase(), $getter$$ = "get" + $attr_functionName$$, $isser$$ = "is" + $attr_functionName$$;
  return($attr_functionName$$ = $goog$object$findKey$$($obj$$56$$, function($v$$, $k$$) {
    $k$$ = $k$$.toLowerCase();
    return $k$$ === $getter$$ || $k$$ === $isser$$
  })) && "function" == $goog$typeOf$$($obj$$56$$[$attr_functionName$$]) ? $isTest_opt_isTest$$ ? $JSCompiler_alias_TRUE$$ : $obj$$56$$[$attr_functionName$$].apply($obj$$56$$, $opt_args$$1$$ || []) : $isTest_opt_isTest$$ ? $JSCompiler_alias_FALSE$$ : $JSCompiler_alias_NULL$$
});
$goog$exportSymbol$$("twig.bind", $twig$bind$$);
$goog$exportSymbol$$("twig.inherits", $goog$inherits$$);
$goog$exportSymbol$$("twig.extend", $twig$extend$$);
$goog$exportSymbol$$("twig.spaceless", function($s$$15$$) {
  return $s$$15$$.replace(/>[\s\xa0]+</g, "><").replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
});
$goog$exportSymbol$$("twig.range", function($start$$6$$, $end$$2$$) {
  for(var $rs$$ = [];$start$$6$$ <= $end$$2$$;$start$$6$$ += 1) {
    $rs$$.push($start$$6$$)
  }
  return $rs$$
});
$goog$exportSymbol$$("twig.contains", function($haystack$$, $needle$$) {
  var $JSCompiler_temp$$121_JSCompiler_temp$$122_key$$inline_125$$;
  if($goog$isArray$$($haystack$$)) {
    $JSCompiler_temp$$121_JSCompiler_temp$$122_key$$inline_125$$ = 0 <= $goog$array$indexOf$$($haystack$$, $needle$$)
  }else {
    if($goog$isString$$($haystack$$)) {
      $JSCompiler_temp$$121_JSCompiler_temp$$122_key$$inline_125$$ = -1 != $haystack$$.indexOf($needle$$)
    }else {
      a: {
        for($JSCompiler_temp$$121_JSCompiler_temp$$122_key$$inline_125$$ in $haystack$$) {
          if($haystack$$[$JSCompiler_temp$$121_JSCompiler_temp$$122_key$$inline_125$$] == $needle$$) {
            $JSCompiler_temp$$121_JSCompiler_temp$$122_key$$inline_125$$ = $JSCompiler_alias_TRUE$$;
            break a
          }
        }
        $JSCompiler_temp$$121_JSCompiler_temp$$122_key$$inline_125$$ = $JSCompiler_alias_FALSE$$
      }
    }
  }
  return $JSCompiler_temp$$121_JSCompiler_temp$$122_key$$inline_125$$
});
$goog$exportSymbol$$("twig.countable", $twig$countable$$);
$goog$exportSymbol$$("twig.count", $twig$count$$);
$goog$exportSymbol$$("twig.forEach", $twig$forEach$$);
$goog$exportSymbol$$("twig.empty", $twig$empty$$);
$goog$exportSymbol$$("twig.createObj", function($var_args$$53$$) {
  for(var $rs$$1$$ = {}, $i$$48$$ = 0;$i$$48$$ < arguments.length;$i$$48$$ += 2) {
    $rs$$1$$[arguments[$i$$48$$]] = arguments[$i$$48$$ + 1]
  }
  return $rs$$1$$
});
$goog$exportSymbol$$("twig.filter.capitalize", function($env$$1$$, $str$$46$$) {
  return $str$$46$$.charAt(0).toUpperCase() + $str$$46$$.substring(1)
});
$goog$exportSymbol$$("twig.filter.escape", function($env$$2_s$$inline_15_str$$inline_132$$, $sb$$inline_16_value$$61$$, $i$$inline_17_opt_type$$5$$, $JSCompiler_temp_const$$118_opt_charset$$, $JSCompiler_temp_const$$117_opt_autoescape$$) {
  if($JSCompiler_temp_const$$117_opt_autoescape$$ && $sb$$inline_16_value$$61$$ instanceof $twig$Markup$$) {
    return $sb$$inline_16_value$$61$$.toString()
  }
  $sb$$inline_16_value$$61$$ = $sb$$inline_16_value$$61$$ == $JSCompiler_alias_NULL$$ ? "" : "" + $sb$$inline_16_value$$61$$;
  if("js" === $i$$inline_17_opt_type$$5$$) {
    $env$$2_s$$inline_15_str$$inline_132$$ = "" + $sb$$inline_16_value$$61$$;
    if($env$$2_s$$inline_15_str$$inline_132$$.quote) {
      $sb$$inline_16_value$$61$$ = $env$$2_s$$inline_15_str$$inline_132$$.quote()
    }else {
      $sb$$inline_16_value$$61$$ = ['"'];
      for($i$$inline_17_opt_type$$5$$ = 0;$i$$inline_17_opt_type$$5$$ < $env$$2_s$$inline_15_str$$inline_132$$.length;$i$$inline_17_opt_type$$5$$++) {
        var $JSCompiler_temp$$120_c$$inline_127_ch$$inline_18$$ = $env$$2_s$$inline_15_str$$inline_132$$.charAt($i$$inline_17_opt_type$$5$$), $cc$$inline_19_rv$$inline_128$$ = $JSCompiler_temp$$120_c$$inline_127_ch$$inline_18$$.charCodeAt(0), $JSCompiler_temp_const$$118_opt_charset$$ = $sb$$inline_16_value$$61$$, $JSCompiler_temp_const$$117_opt_autoescape$$ = $i$$inline_17_opt_type$$5$$ + 1, $JSCompiler_temp$$119_cc$$inline_129$$;
        if(!($JSCompiler_temp$$119_cc$$inline_129$$ = $goog$string$specialEscapeChars_$$[$JSCompiler_temp$$120_c$$inline_127_ch$$inline_18$$])) {
          if(!(31 < $cc$$inline_19_rv$$inline_128$$ && 127 > $cc$$inline_19_rv$$inline_128$$)) {
            if($JSCompiler_temp$$120_c$$inline_127_ch$$inline_18$$ in $goog$string$jsEscapeCache_$$) {
              $JSCompiler_temp$$120_c$$inline_127_ch$$inline_18$$ = $goog$string$jsEscapeCache_$$[$JSCompiler_temp$$120_c$$inline_127_ch$$inline_18$$]
            }else {
              if($JSCompiler_temp$$120_c$$inline_127_ch$$inline_18$$ in $goog$string$specialEscapeChars_$$) {
                $JSCompiler_temp$$120_c$$inline_127_ch$$inline_18$$ = $goog$string$jsEscapeCache_$$[$JSCompiler_temp$$120_c$$inline_127_ch$$inline_18$$] = $goog$string$specialEscapeChars_$$[$JSCompiler_temp$$120_c$$inline_127_ch$$inline_18$$]
              }else {
                $cc$$inline_19_rv$$inline_128$$ = $JSCompiler_temp$$120_c$$inline_127_ch$$inline_18$$;
                $JSCompiler_temp$$119_cc$$inline_129$$ = $JSCompiler_temp$$120_c$$inline_127_ch$$inline_18$$.charCodeAt(0);
                if(31 < $JSCompiler_temp$$119_cc$$inline_129$$ && 127 > $JSCompiler_temp$$119_cc$$inline_129$$) {
                  $cc$$inline_19_rv$$inline_128$$ = $JSCompiler_temp$$120_c$$inline_127_ch$$inline_18$$
                }else {
                  if(256 > $JSCompiler_temp$$119_cc$$inline_129$$) {
                    if($cc$$inline_19_rv$$inline_128$$ = "\\x", 16 > $JSCompiler_temp$$119_cc$$inline_129$$ || 256 < $JSCompiler_temp$$119_cc$$inline_129$$) {
                      $cc$$inline_19_rv$$inline_128$$ += "0"
                    }
                  }else {
                    $cc$$inline_19_rv$$inline_128$$ = "\\u", 4096 > $JSCompiler_temp$$119_cc$$inline_129$$ && ($cc$$inline_19_rv$$inline_128$$ += "0")
                  }
                  $cc$$inline_19_rv$$inline_128$$ += $JSCompiler_temp$$119_cc$$inline_129$$.toString(16).toUpperCase()
                }
                $JSCompiler_temp$$120_c$$inline_127_ch$$inline_18$$ = $goog$string$jsEscapeCache_$$[$JSCompiler_temp$$120_c$$inline_127_ch$$inline_18$$] = $cc$$inline_19_rv$$inline_128$$
              }
            }
          }
          $JSCompiler_temp$$119_cc$$inline_129$$ = $JSCompiler_temp$$120_c$$inline_127_ch$$inline_18$$
        }
        $JSCompiler_temp_const$$118_opt_charset$$[$JSCompiler_temp_const$$117_opt_autoescape$$] = $JSCompiler_temp$$119_cc$$inline_129$$
      }
      $sb$$inline_16_value$$61$$.push('"');
      $sb$$inline_16_value$$61$$ = $sb$$inline_16_value$$61$$.join("")
    }
    return $sb$$inline_16_value$$61$$.substring(1, $sb$$inline_16_value$$61$$.length - 1)
  }
  if(!$i$$inline_17_opt_type$$5$$ || "html" === $i$$inline_17_opt_type$$5$$) {
    return $env$$2_s$$inline_15_str$$inline_132$$ = $sb$$inline_16_value$$61$$, $goog$string$allRe_$$.test($env$$2_s$$inline_15_str$$inline_132$$) && (-1 != $env$$2_s$$inline_15_str$$inline_132$$.indexOf("&") && ($env$$2_s$$inline_15_str$$inline_132$$ = $env$$2_s$$inline_15_str$$inline_132$$.replace($goog$string$amperRe_$$, "&amp;")), -1 != $env$$2_s$$inline_15_str$$inline_132$$.indexOf("<") && ($env$$2_s$$inline_15_str$$inline_132$$ = $env$$2_s$$inline_15_str$$inline_132$$.replace($goog$string$ltRe_$$, 
    "&lt;")), -1 != $env$$2_s$$inline_15_str$$inline_132$$.indexOf(">") && ($env$$2_s$$inline_15_str$$inline_132$$ = $env$$2_s$$inline_15_str$$inline_132$$.replace($goog$string$gtRe_$$, "&gt;")), -1 != $env$$2_s$$inline_15_str$$inline_132$$.indexOf('"') && ($env$$2_s$$inline_15_str$$inline_132$$ = $env$$2_s$$inline_15_str$$inline_132$$.replace($goog$string$quotRe_$$, "&quot;"))), $env$$2_s$$inline_15_str$$inline_132$$
  }
  throw Error("The type '" + $i$$inline_17_opt_type$$5$$ + "' is not supported.");
});
$goog$exportSymbol$$("twig.filter.length", function($env$$3$$, $value$$62$$) {
  return $twig$count$$($value$$62$$)
});
$goog$exportSymbol$$("twig.filter.def", function($value$$60$$, $opt_default$$) {
  return $twig$empty$$($value$$60$$) ? $opt_default$$ || "" : $value$$60$$
});
$goog$exportSymbol$$("twig.filter.replace", function($str$$45$$, $map$$) {
  for(var $key$$43$$ in $map$$) {
    $str$$45$$ = $str$$45$$.replace(RegExp($key$$43$$, "g"), $map$$[$key$$43$$])
  }
  return $str$$45$$
});
$goog$exportSymbol$$("twig.filter.join", function($value$$63$$, $opt_glue$$) {
  var $glue$$ = $opt_glue$$ || "", $buffer$$11$$ = new $goog$string$StringBuffer$$, $first$$1$$ = $JSCompiler_alias_TRUE$$;
  $twig$forEach$$($value$$63$$, function($v$$4$$) {
    $first$$1$$ || $buffer$$11$$.append($glue$$);
    $first$$1$$ = $JSCompiler_alias_FALSE$$;
    $buffer$$11$$.append($v$$4$$)
  });
  return $buffer$$11$$.toString()
});
$goog$exportSymbol$$("twig.filter.keys", function($obj$$31$$) {
  var $res$$3$$ = [], $i$$14$$ = 0, $key$$24$$;
  for($key$$24$$ in $obj$$31$$) {
    $res$$3$$[$i$$14$$++] = $key$$24$$
  }
  return $res$$3$$
});
$goog$exportSymbol$$("twig.filter.upper", function($env$$4$$, $value$$64$$) {
  return $value$$64$$.toUpperCase()
});
$goog$exportSymbol$$("twig.filter.lower", function($env$$5$$, $value$$65$$) {
  return $value$$65$$.toLowerCase()
});
$goog$exportSymbol$$("twig.StringBuffer", $goog$string$StringBuffer$$);
$goog$string$StringBuffer$$.prototype.append = $goog$string$StringBuffer$$.prototype.append;
$goog$string$StringBuffer$$.prototype.toString = $goog$string$StringBuffer$$.prototype.toString;
$twig$Environment$$.prototype.createTemplate = $twig$Environment$$.prototype.$createTemplate$;
$twig$Environment$$.prototype.filter = $twig$Environment$$.prototype.filter;
$twig$Environment$$.prototype.invoke = $twig$Environment$$.prototype.$invoke$;
$twig$Environment$$.prototype.test = $twig$Environment$$.prototype.test;
$twig$Environment$$.prototype.macro = $twig$Environment$$.prototype.$macro$;
$twig$Environment$$.prototype.setFilter = $twig$Environment$$.prototype.$setFilter$;
$twig$Environment$$.prototype.setFunction = $twig$Environment$$.prototype.$setFunction$;
$twig$Environment$$.prototype.setTest = $twig$Environment$$.prototype.$setTest$;
$twig$Environment$$.prototype.render = $twig$Environment$$.prototype.$render$;
$twig$Environment$$.prototype.getGlobals = $twig$Environment$$.prototype.$getGlobals$;
$twig$Environment$$.prototype.initRuntime = $twig$Environment$$.prototype.$initRuntime$;
$twig$Environment$$.prototype.hasExtension = $twig$Environment$$.prototype.$hasExtension$;
$twig$Environment$$.prototype.getExtension = $twig$Environment$$.prototype.getExtension;
$twig$Environment$$.prototype.addExtension = $twig$Environment$$.prototype.$addExtension$;
$twig$Environment$$.prototype.removeExtension = $twig$Environment$$.prototype.$removeExtension$;
$twig$Environment$$.prototype.setExtensions = $twig$Environment$$.prototype.$setExtensions$;
$twig$Environment$$.prototype.getExtensions = $twig$Environment$$.prototype.$getExtensions$;
$goog$exportSymbol$$("twig.Template", $twig$Template$$);
$twig$Template$$.prototype.setTraits = $twig$Template$$.prototype.$setTraits$;
$twig$Template$$.prototype.setBlocks = $twig$Template$$.prototype.$setBlocks$;
$twig$Template$$.prototype.getBlocks = $twig$Template$$.prototype.$getBlocks$;
$twig$Template$$.prototype.renderParentBlock = $twig$Template$$.prototype.$renderParentBlock$;
$twig$Template$$.prototype.renderBlock = $twig$Template$$.prototype.$renderBlock$;
$goog$exportSymbol$$("twig.Markup", $twig$Markup$$);
})();
