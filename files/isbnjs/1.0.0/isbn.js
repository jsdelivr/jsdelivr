//
// isbn.js
//
// The MIT License
// Copyright (c) 2007 hetappi <hetappi.pm (a) gmail.com>
//
var ISBN  = {
  VERSION: '0.01',
  GROUPS: {
    '0': {
      'name': 'English speaking area',
      'ranges': [['00', '19'], ['200', '699'], ['7000', '8499'], ['85000', '89999'], ['900000', '949999'], ['9500000', '9999999']]
    },
    '1': {
      'name': 'English speaking area',
      'ranges': [['00', '09'], ['100', '399'], ['4000', '5499'], ['55000', '86979'], ['869800', '998999']]
    },
    '4': {
      'name': 'Japan',
      'ranges': [['00','19'], ['200','699'], ['7000','8499'], ['85000','89999'], ['900000','949999'], ['9500000','9999999']]
    }
  },

  _isbn: function () {
    this._initialize.apply(this, arguments);
  },

  parse: function(val, groups) {
    var me = new ISBN._isbn(val, groups ? groups : ISBN.GROUPS);
    return me.isValid() ? me : null;
  },

  hyphenate: function(val) {
    var me = ISBN.parse(val);
    return me ? me.isIsbn13() ? me.asIsbn13(true) : me.asIsbn10(true) : null;
  },

  asIsbn13: function(val, hyphen) {
    var me = ISBN.parse(val);
    return me ? me.asIsbn13(hyphen) : null;
  },

  asIsbn10: function(val, hyphen) {
    var me = ISBN.parse(val);
    return me ? me.asIsbn10(hyphen) : null;
  }
};

ISBN._isbn.prototype = {
  isValid: function() {
    return this.codes && this.codes.isValid;
  },

  isIsbn13: function() {
    return this.isValid() && this.codes.isIsbn13;
  },

  isIsbn10: function() {
    return this.isValid() && this.codes.isIsbn10;
  },

  asIsbn10: function(hyphen) {
    return this.isValid() ? hyphen ? this.codes.isbn10h : this.codes.isbn10 : null;
  },

  asIsbn13: function(hyphen) {
    return this.isValid() ? hyphen ? this.codes.isbn13h : this.codes.isbn13 : null;
  },

  _initialize: function(val, groups) {
    this.groups = groups;
    this.codes = this._parse(val);
  },

  _merge: function(lobj, robj) {
    if (!lobj || !robj)
      return null;
    for (var key in robj)
      lobj[key] = robj[key];
    return lobj;
  },

  _parse: function(val) {
    var ret =
      val.match(/^\d{9}[\dX]$/) ?
        this._fill(
          this._merge({source: val, isValid: true, isIsbn10: true, isIsbn13: false}, this._split(val))) :
      val.length == 13 && val.match(/^(\d+)-(\d+)-(\d+)-([\dX])$/) ?
        this._fill({
          source: val, isValid: true, isIsbn10: true, isIsbn13: false, group: RegExp.$1, publisher: RegExp.$2,
          article: RegExp.$3, check: RegExp.$4}) :
      val.match(/^(978|979)(\d{9}[\dX]$)/) ?
        this._fill(
          this._merge({source: val, isValid: true, isIsbn10: false, isIsbn13: true, prefix: RegExp.$1},
          this._split(RegExp.$2))) :
      val.length == 17 && val.match(/^(978|979)-(\d+)-(\d+)-(\d+)-([\dX])$/) ?
        this._fill({
          source: val, isValid: true, isIsbn10: false, isIsbn13: true, prefix: RegExp.$1, group: RegExp.$2,
          publisher: RegExp.$3, article: RegExp.$4, check: RegExp.$5}) :
        null;
    return ret || {source: val, isValid: false};
  },

  _split: function(isbn) {
    return (
      !isbn ?
        null :
      isbn.length == 13 ?
        this._merge(this._split(isbn.substr(3)), {prefix: isbn.substr(0, 3)}) :
      isbn.length == 10 ?
        this._splitToObject(isbn) :
        null);
  },

  _splitToArray: function(isbn10) {
    var rec = this._getGroupRecord(isbn10);
    if (!rec)
      return null;

    for (var key, i = 0, m = rec.record.ranges.length; i < m; ++i) {
      key = rec.rest.substr(0, rec.record.ranges[i][0].length);
      if (rec.record.ranges[i][0] <= key && rec.record.ranges[i][1] >= key) {
        var rest = rec.rest.substr(key.length);
        return [
          rec.group, key, rest.substr(0, rest.length - 1), rest.charAt(rest.length - 1)];
      }
    }
    return null;
  },

  _splitToObject: function(isbn10) {
    var a = this._splitToArray(isbn10);
    if (!a || a.length != 4)
      return null;
    return {group: a[0], publisher: a[1], article: a[2], check: a[3]};
  },

  _fill: function(codes) {
    if (!codes)
      return null;

    var rec = this.groups[codes.group];
    if (!rec)
      return null;

    var prefix = codes.prefix ? codes.prefix : '978';
    var ck10 = this._calcCheckDigit([
      codes.group, codes.publisher, codes.article].join(''));
    if (!ck10)
      return null;

    var ck13 = this._calcCheckDigit([
      prefix, codes.group, codes.publisher, codes.article].join(''));
    if (!ck13)
      return null;

    var parts13 = [prefix, codes.group, codes.publisher, codes.article, ck13];
    this._merge(codes, {
      isbn13: parts13.join(''), isbn13h: parts13.join('-'),
      check10: ck10, check13: ck13, groupname: rec.name});

    if (prefix == '978') {
      var parts10 = [codes.group, codes.publisher, codes.article, ck10];
      this._merge(codes, {isbn10: parts10.join(''), isbn10h: parts10.join('-')});
    }

    return codes;
  },

  _getGroupRecord: function(isbn10) {
    for (var key in this.groups) {
      if (isbn10.match('^' + key + '(.+)'))
        return {group: key, record: this.groups[key], rest: RegExp.$1};
    }
    return null;
  },

  _calcCheckDigit: function(isbn) {
    if (isbn.match(/^\d{9}[\dX]?$/)) {
      var c = 0;
      for (var n = 0; n < 9; ++n)
        c += (10 - n) * isbn.charAt(n);
      c = (11 - c % 11) % 11;
      return c == 10 ? 'X' : String(c);

    } else if (isbn.match(/(?:978|979)\d{9}[\dX]?/)) {
      var c = 0;
      for (var n = 0; n < 12; n += 2)
        c += Number(isbn.charAt(n)) + 3 * isbn.charAt(n + 1);
      return String((10 - c % 10) % 10);
    }

    return null;
  }
};
