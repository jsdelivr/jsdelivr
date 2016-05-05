/*
 /* Author : Andreti Enache - techlabs.ro
 /* Licence : GNU GENERAL PUBLIC LICENSE Version 3
 /* GitHub : github.com/wdub/jspine
 /* Demo : jspine.techlabs.ro
 /* Version : v1.3.3
 */
(function (z) {
    'use strict';

    jSpine.fn = Sel.prototype = {
        forEach: function (callback) {
            this.map(callback);
            return this;
        },
        map: function (callback) {
            var results = [], j;
            for (j = 0; j < this.length; j++) {
                results.push(callback.call(this, this[j], j));
            }
            return results;
        },
        mapOne: function (callback) {
            var m = this.map(callback);
            return m.length > 1 ? m : m[0];
        },
        text: function (text) {
            if (text !== undefined) {
                return this.forEach(function (el) {
                    el.textContent = text;
                });
            }
            return this.mapOne(function (el) {
                return el.textContent;
            });
        },
        html: function (html) {
            if (html !== undefined) {
                return this.forEach(function (el) {
                    el.innerHTML = html;
                });
            }
            return this.mapOne(function (el) {
                return el.innerHTML;
            });
        },
        hasClass: function (a) {
            return this.mapOne(function (el) {
                return el.className.indexOf(a) > -1;
            });
        },
        addClass: function (classes) {
            var clsToAdd = classes.split(',');

            if (clsToAdd.length > 1) {
                // add more than 1 class
                return this.forEach(function (el) {
                    var elcls = el.className,
                        cnew = '',
                        i;
                    for (i = 0; i < clsToAdd.length; i++) {
                        if (elcls.indexOf(clsToAdd[i]) === -1) {
                            cnew += ' ' + clsToAdd[i];
                        }
                    }
                    el.className += cnew;
                });
            }
            return this.forEach(function (el) {
                var elcls = el.className;
                // add the class to all els
                if (elcls.indexOf(classes) === -1) {
                    el.className += ' ' + classes;
                }
            });
        },
        removeClass: function (clazz) {
            if (clazz === undefined) {
                return this.forEach(function (el) {
                    el.removeAttribute('class');
                });
            }
            if (clazz.split(',').length > 1) {
                return this.forEach(function (el) {
                    var elclasses = el.className.split(' '),
                        cnew = '',
                        idx;
                    for (idx = 0; idx < elclasses.length; idx++) {
                        if (clazz.indexOf(elclasses[idx]) === -1) {
                            cnew += ' ' + elclasses[idx];
                        }
                    }
                    el.className = cnew;
                });
            }
            return this.forEach(function (el) {
                var cs = el.className.split(' '),
                    i;
                while ((i = cs.indexOf(clazz)) > -1) {
                    cs = cs.slice(0, i).concat(cs.slice(++i));
                }
                el.className = cs.join(' ');
            });
        },
        toggleClass: function (clazz) {
            return this.forEach(function (el) {
                var cs = el.className.split(' '),
                    i;
                if (cs.indexOf(clazz) > -1) {
                    // remove class from el
                    while ((i = cs.indexOf(clazz)) > -1) {
                        cs = cs.slice(0, i).concat(cs.slice(++i));
                    }
                    el.className = cs.join(' ');
                } else {
                    // add class to el
                    el.className += ' ' + clazz;
                }
            });
        },
        attr: function (attr, val) {
            if (val !== undefined) {
                return this.forEach(function (el) {
                    el.setAttribute(attr, val);
                });
            }
            return this.mapOne(function (el) {
                return el.getAttribute(attr);
            });
        },
        append: function (els) {
            return this.forEach(function (parEl, i) {
                els.forEach(function (childEl) {
                    parEl.appendChild((i > 0) ? childEl.cloneNode(true) : childEl);
                });
            });
        },
        prepend: function (els) {
            return this.forEach(function (parEl, i) {
                var j;
                for (j = els.length - 1; j > -1; j--) {
                    parEl.insertBefore((i > 0) ? els[j].cloneNode(true) : els[j], parEl.firstChild);
                }
            });
        },
        toggle: function () {
            return this.mapOne(function () {
                if (this.isVisible()) {
                    this.hide();
                    return;
                }
                this.show();
            });
        },
        isVisible: function () {
            return this.mapOne(function (el) {
                var y;
                if (el.currentStyle) {
                    y = el.currentStyle.display;
                } else if (window.getComputedStyle) {
                    y = document.defaultView.getComputedStyle(el, null).getPropertyValue('display');
                }
                return y !== 'none';
            });
        },
        hide: function () {
            return this.forEach(function (el) {
                el.style.display = 'none';
            });
        },
        show: function () {
            return this.forEach(function (el) {
                el.style.display = 'block';
            });
        },
        remove: function () {
            return this.forEach(function (el) {
                return el.parentNode.removeChild(el);
            });
        },
        newel: function (tagName, attrs, appendit) {
            var el = jSpine([document.createElement(tagName)]),
                key;
            if (attrs) {
                if (attrs.text) {
                    el.text(attrs.text);
                    delete attrs.text;
                }
                if (attrs.html) {
                    el.html(attrs.html);
                    delete attrs.html;
                }
                for (key in attrs) {
                    if (attrs.hasOwnProperty(key)) {
                        el.attr(key, attrs[key]);
                    }
                }
            }
            if (appendit !== undefined) {
                this.append(el);
            }
            return el;
        },
        empty: function () {
            return this.forEach(function (el) {
                while (el.firstChild) {
                    el.removeChild(el.firstChild);
                }
            });
        },
        loader: function (s) {
            return this.forEach(function () {
                if (s) {
                    this.show();
                    // show loader
                    return;
                }
                var _this = this;
                setTimeout(function () {
                    _this.hide();
                    // hide loader after 250ms
                }, 250);
            });
        },
        message: function (state, fade) {
            if (state === 'hide') {
                if (fade !== undefined && this.isVisible()) {
                    this.removeClass('show').addClass('fadeout');
                }
                return;
            }
            if (state === undefined) {
                this[0].className = 'msg';
                return;
            }
            var type = Object.keys(state);
            this.html(state[type[0]])[0].className = 'msg show ' + type[0];
        },
        data: function (dk, dv) {
            if (dv === undefined) {
                if (this[0].dataset === undefined) {
                    return this[0].getAttribute('data-' + dk);
                }
                return this[0].dataset[dk];
            }
            return this.forEach(function (el) {
                if (el.dataset === undefined) {
                    el.setAttribute('data-' + dk, dv);
                    return;
                }
                el.dataset[dk] = dv;
            });
        },
        formData: function () {
            var data = '',
                param = '',
                elem,
                nodeName,
                option,
                i, j;

            for (i = 0; i < this[0].elements.length; i++) {
                elem = this[0].elements[i];
                if (elem.name) {
                    nodeName = elem.nodeName.toLowerCase();
                    param = '';

                    if (nodeName === 'input' && (elem.type === 'checkbox' || elem.type === 'radio')) {
                        if (!elem.checked) {
                            continue;
                        }
                    }
                    if (nodeName === 'select') {
                        for (j = 0; j < elem.options.length; j++) {
                            option = elem.options[j];
                            if (option.selected) {
                                var value = option.value;
                                if (param !== '') {
                                    param += '&'
                                }
                                param += encodeURIComponent(elem.name) + '=' + encodeURIComponent(value)
                            }
                        }
                    } else {
                        param = encodeURIComponent(elem.name) + '=' + encodeURIComponent(elem.value)
                    }

                    if (data !== '') {
                        data += '&'
                    }
                    data += param
                }
            }
            return data;
        },
        on: (function () {
            if (document.addEventListener) {
                return function (evt, dgt, fn) {
                    var nme;
                    var delegate = function (ev) {
                        var tg = ev.target,
                            cs;

                        if (typeof dgt !== 'string') {
                            return dgt(ev, tg);
                        }

                        nme = dgt.substr(1);
                        if (dgt[0] === '.') {
                            cs = tg.className.split(' ');
                        } else if (dgt[0] === '#') {
                            cs = tg.id;
                        } else {
                            cs = tg.nodeName.toLowerCase();
                            nme = dgt.substr(0);
                        }

                        if (cs.indexOf(nme) === -1) {
                            ev.preventDefault();
                            ev.stopPropagation();
                            return;
                        }
                        return fn(ev, tg);
                    };

                    return this.forEach(function (el) {
                        if (el === null) {
                            return;
                        }
                        el.addEventListener(evt, delegate, false);
                    });
                };
            }
            if (document.attachEvent) {
                return function (evt, fn) {
                    return this.forEach(function (el) {
                        el.attachEvent('on' + evt, fn);
                    });
                };
            }
            return function (evt, fn) {
                return this.forEach(function (el) {
                    el['on' + evt] = fn;
                });
            };

        }()),
        off: (function () {
            if (document.removeEventListener) {
                return function (evt, fn) {
                    return this.forEach(function (el) {
                        el.removeEventListener(evt, fn, false);
                    });
                };
            }
            if (document.detachEvent) {
                return function (evt, fn) {
                    return this.forEach(function (el) {
                        el.detachEvent('on' + evt, fn);
                    });
                };
            }
            return function (evt) {
                return this.forEach(function (el) {
                    el['on' + evt] = null;
                });
            };
        }()),
        initXhr: function () {
            var Xmlxhr = window.XMLHttpRequest;
            return Xmlxhr ? new Xmlxhr() : new window.ActiveXObject('Microsoft.XMLHTTP');
        },
        xobj: function () {
            return new this.initXhr;
        },
        xhr: function (params, url, callback) {
            var xhr = new this.initXhr;
            return (function () {
                xhr.open('POST', url, true);
                xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                xhr.setRequestHeader('X_REQUESTED_WITH', 'xmlhttprequest');
                xhr.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        if (this.status === 200) {
                            callback(this.responseText);
                        }
                    }
                };
                xhr.onerror = function () {
                    //console.error('Network error');
                };
                xhr.send(params);
            }());
        }
    };

    function Sel(s) {
        var els, chr, i;
        if (s === undefined) {
            return;
        }
        if (typeof s === 'string') {
            chr = s.substr(1);
            if (s[0] === '#') {
                els = document.getElementById(chr);
                this[0] = els;
                this.length = 1;
                return this;
            }
            els = document.getElementsByClassName(chr);
        } else if (s.length) {
            els = s;
        } else {
            els = [s];
        }

        for (i = 0; i < els.length; i++) {
            this[i] = els[i];
        }
        this.length = els.length;
        return this;
    }

    function jSpine(params) {
        return new Sel(params);
    }

    z.$ = jSpine;

})(window);
