"use strict";
/* SISTEMA FEITO POR PAULAO */
/* SISTEMA KHAN */

// - SISTEMA DE MODULOS

(function(global) {

    global["BASE_URL"] = location.origin;
    global["Type"] = function(object) {

        var stringConstructor = "test".constructor;
        var arrayConstructor = [].constructor;
        var objectConstructor = {}.constructor;

        if (object === null) {
            return "null";
        } else if (object === undefined) {
            return "undefined";
        } else if (object.constructor === stringConstructor) {
            return "String";
        } else if (object.constructor === arrayConstructor) {
            return "Array";
        } else if (object.constructor === objectConstructor) {
            return "Object";
        } else {
            return "don't know";
        }

    };

    global["serialize"] = function(obj) {
        var str = [];
        for (var p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        return str.join("&");
    };

    global["Post"] = function(url, data, callback = function() {}) {
        var http = new XMLHttpRequest();
        http.open("POST", url, true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.onreadystatechange = function() { //Call a function when the state changes.
            if (http.readyState == 4 && http.status == 200) {
                callback(http.responseText);
            }
        }
        http.send(serialize(data));
    };

    global["GetPage"] = function(url, call = function() {}) {

        var oReq = new XMLHttpRequest();
        oReq.open("GET", url, true);
        oReq.onreadystatechange = function() { //Call a function when the state changes.
            if (oReq.readyState == 4 && oReq.status == 200) {
                call(oReq.responseText);
            }
        };
        oReq.send();

    };


})(window);

/* CURRENT CONTROLLER*/
class Controller {

    get CurrentController(){

        var url = location.origin + location.pathname;
        if(location.href == url){

            url = url.replace(url, '').split('/');

        }else{

            url = location.href.replace(url+'#/', '');
            url = url.split('/');

        }

        return url[0]+'Controller';

    }

}

/* CLASS KHAN INIT */

class Khan {

    /* CONTRUTOR E JA SETA AS FUNCOES DE VERIFICACAO */
    constructor($app) {
        var self = this;
        window["SocketsKhan"] = {};
        this.routeStatus = false;
        this.Addons();
        this.ImgLoaded();
        this.app = $app;
        this.Services = {};
        this.uriHome();
        this.ifModelBind();
        this.ifTextAnimate();
        this.Works = {};
        this.Routess = {};
    }

    // Create Component
    Components(){

        return {
            New( n, data){
                var proto = Object.create(HTMLElement.prototype);
                proto.name = n;
                proto = Object.assign({}, proto, data);
                document.registerElement(n, {
                    prototype: proto
                });
            },
            Create(n){
                return document.createElement(n);
            }
        }

    }

    // Controllers
    Controllers(name, call){

        name = name.replace('Controller', '');
 
        var scope = {
            Controller: name + "Controller",
            CreateAs: new Date(),
            View: {}
        };

        this.Router("/" + name, call(scope));

    }

    // Configura os Modulos
    ConfigModules(ob) {

        this.configurationModules = ob;

    }

    // CARREGADOR DE MODULOS
    Modules(m, f) {

        const head = document.querySelectorAll('head')[0];
        const size = {
            "change": f,
            "valueCache": m.length,
            "valueChange": 0,
            set val(v) {
                this.valueChange = v;
                if (this.valueChange == this.valueCache) {
                    this.change();
                }
            }
        };

        m.forEach((v, i) => {

            var map = this.configurationModules["map"];
            if (v in map) {
                v = map[v] + ".js";
            }else{
                v = v + ".js";
            }
            if('baseUrl' in this.configurationModules){
                var baseUrlM = this.configurationModules['baseUrl'];
                v = this.configurationModules['baseUrl'] + v;
            }else{
                var baseUrlM = '';
            }
            var node = document.createElement('script');
            node.type = 'text/javascript';
            node.charset = 'utf-8';
            node.async = true;
            node.src = v;
            node.setAttribute("khan-modules-name", v.replace(baseUrlM, '').replace('.js','').toLowerCase());
            node.onload = function() {
                size.val = i + 1;
            };
            head.appendChild(node);

        });
   }

    /* SOCKETS KHAN */
    Socket(nome) {
        var padrao = function(listener) {
            this.change = listener;
        };
        SocketsKhan[nome] = {
            createAs: new Date(),
            cache: '',
            cacheData: '',
            change: function(val) {},
            on: function(listener) {
                this.change = listener;
            },
            data: function(code) {
                if (SocketsKhan[nome].cache == '') {
                    SocketsKhan[nome].cache = code;
                    SocketsKhan[nome].cacheData = code;
                    SocketsKhan[nome].change(SocketsKhan[nome].cacheData);
                } else {
                    if (SocketsKhan[nome].cache != code) {
                        SocketsKhan[nome].cache = code;
                        SocketsKhan[nome].cacheData = code;
                        SocketsKhan[nome].change(SocketsKhan[nome].cacheData);
                    }
                }
            }
        };
        if ('on' in SocketsKhan[nome]) {

            this.SocketUpdate(nome);

        }
        return {
            emit: async function(name, data, func = function() {}) {
                func.bind({
                    msg: "Socket Enviado"
                });
                Post('JSKhan/lib/Sockets/pooling_emit.php', {
                    name: name,
                    data: JSON.stringify(data)
                }, func);
            },
            on: async function(name, callback) {
                SocketsKhan[name]["on"](callback);
                //console.log(SocketsKhan[name]);
                return "Socket Receive Stream";
            },
            rm: function(name, d, callback = function() {}) {
                Post('JSKhan/lib/Sockets/pooling_rm.php', {
                    name: name,
                    data: d
                }, callback);
            }
        };

    }

    SocketUpdate(name) {
        var stemp = SocketsKhan[name]["data"];
        setInterval(function() {
            GetPage('JSKhan/lib/Sockets/pooling_on.php?name=' + name, function(d) {
                var dt = JSON.parse(d);
                var vrf = 'msg' in dt;
                if (vrf == false) {

                    var dataas = new Array();
                    dt.map((v) => {
                        dataas.push(JSON.parse(v));
                    });
                    stemp(JSON.stringify(dataas));

                }

            });
        }, 2000);
    }

    /* ROUTE SISTEM LIB EXTERN */
    Router(n, c) {
        this.Routess[n] = c;
        var router = Router(this.Routess);
        router.init();
    }


    /* IMAGES LOADS */

    otimizeLoadImages() {
        var s = document.createElement('script').src = "//spdrjs-13d1.kxcdn.com/speeder.js",
            c = document.createElement('script').innerHTML = "speeder('ac3d92c2','ea6');";
        if (document.querySelectorAll('head')[0].appendChild(s)) {
            document.querySelectorAll('head')[0].appendChild(c);
        }
    }

    /* CARREGA AS IMAGENS ASSINCRONAMENTE */
    ImgLoaded() {
        setTimeout(() => {
            if (document.querySelectorAll('[khan-img-src]').length != 0) {
                document.querySelectorAll('[khan-img-src]').forEach((v, i) => {
                    this.Encrypt(v.getAttribute('khan-img-src')).then((va) => {
                        va = va.substr(0, va.length / 2.5);
                        v.setAttribute('hash', va);
                    });
                    v.setAttribute('khan-img-src', window.btoa(v.getAttribute('khan-img-src')));
                    v.setAttribute('class', 'khan-img-' + i);
                    if (sessionStorage.getItem('khan-img-' + i) != null) {
                        v.src = sessionStorage.getItem('khan-img-' + i);
                    } else {
                        var req = new Request(window.atob(v.getAttribute('khan-img-src')));
                        fetch(req).then(function(response) {
                            return response.blob();
                        }).then(function(myBlob) {
                            var objectURL = URL.createObjectURL(myBlob);
                            v.src = objectURL;
                            sessionStorage.setItem('khan-img-' + i, objectURL);
                        });
                    }
                });


            }
        }, 0.2);
    }

    /* MODULES LOADER */
    require(module) {
        var cache = (sessionStorage.getItem(module) == null) ? false : true;
        if (!cache) {
            this.Work({
                name: 'Modules',
                url: 'JSKhan/works/KhanWorkModules.js'
            }, function(Work) {
                Work.postMessage(module);
                Work.onmessage = function(e) {
                    sessionStorage.setItem(module, e.data);
                    if (sessionStorage.getItem("modulesCache") == null) {
                        sessionStorage.setItem("modulesCache", JSON.stringify(new Array(module)));
                    } else {
                        var g = JSON.parse(sessionStorage.getItem("modulesCache"));
                        g.push(module);
                        sessionStorage.setItem("modulesCache", JSON.stringify(g));
                    }
                    document.location.reload();
                };
            });
        } else {
            var dtt = JSON.parse(sessionStorage.getItem(module), true);
            Object.keys(dtt).map((v) => {
                if (dtt[v]["type"] == "function") {
                    dtt[v] = eval('(' + dtt[v].data + ')');
                } else {
                    dtt[v] = dtt[v].data;
                }
            });
            return dtt;
        }
    }

    /* GERADOR DE WORKS MACHINE */
    Work(ob, callback) {
        this.Works[ob.name] = new Worker(ob.url);
        callback(this.Works[ob.name]);
    }

    /* CONTAINERS */

    Containers(data) {
        var channel = data.channel;
        this.Work({
                name: 'Jskhan',
                url: 'works/KhanWork.js'
            },
            function(Work) {
                Work.postMessage({
                    name: data.channel,
                    fu: data.funcao.toString(),
                    action: 'setContainer'
                });
            });
        return {
            setContainer: function(data) {
                data["Work"].postMessage({
                    name: data.channel,
                    fu: data.funcao.toString(),
                    action: 'setContainer'
                });
            },
            getContainer: function(data) {
                data.scope.postMessage({
                    name: data.channel,
                    action: 'getContainer'
                });
            },
            getRunService: function(data) {
                data.scope.postMessage({
                    name: data.channel,
                    action: 'getRunService'
                });
            },
            GetCanal: function() {
                return channel;
            },
            setRunService: function(data) {
                if (data.data.length == 0) {
                    data.scope.postMessage({
                        name: data.channel,
                        action: 'setRunService'
                    });
                } else {
                    data.scope.postMessage({
                        name: data.channel,
                        parame: data.data,
                        action: 'setRunService'
                    });
                }
            }
        };
    }

    /* FUNCOES EXTRAS Each e Memorize de Cache */

    Addons() {
        window["$"] = (ob) => {
            if (ob != 'document') {
                return document.querySelector(ob);
            } else {
                return ob;
            }
        };
        window["CacheModules"] = function(module) {
                sessionStorage.removeItem(module);
                document.location.reload();
            },
            Object.prototype.Each = function(cb) {
                const Keys = Object.keys(this),
                    Values = Object.values(this);
                cb(Values, Keys);
            };
        Function.prototype.Memorize = function() {
            const scope = this;
            let cache = new Object(),
                key;
            return (...args) => {
                key = JSON.stringify(args);
                return cache[key] || (cache[key] = scope.call(null, ...args));
            }
        };
        Array.prototype.max = function() {
            return Math.max.apply(null, this);
            // retorna maximo array
        };
        Array.prototype.min = function() {
            return Math.min.apply(null, this);
            // retorna minimo array
        };

        Object.prototype.toggle = function(f = function() {}, ftrue = []) {
            var ob = this;
            f.bind(ob);
            if (ob.getAttribute('display') == 'block') {
                ob.style.display = '';
                ob.setAttribute('display', 'hidden');
                if (ftrue[1]) {
                    f();
                }
            } else {
                ob.style.display = 'block';
                ob.setAttribute('display', 'block');
                if (ftrue[0]) {
                    f();
                }
            }
        }
        Object.prototype.addClass = function(c) {
            var ob = this;
            var i = ob.className.split(' ').length;
            if (i > 1) {
                ob.className += ` ${c}`;
            } else {
                ob.className = c;
            }
        };
        Object.prototype.removeClass = function(c) {
            var ob = this;
            var i = ob.className.split(' ').length;
            if (i > 1) {
                ob.className = ob.className.replace(` ${c}`, '');
            } else {
                ob.className = ob.className.replace(c, '');
            }
        };
        Array.prototype.inArray = function(val) {
            let objt = this;
            var r = objt.filter((v) => {
                return v == val;
            });

            return (r.length >= 1) ? true : false;

        };
        Object.prototype.addId = function(id) {
            let ob = this;
            ob.id = id;
        };
        Object.prototype.removeId = function(id) {
            let ob = this;
            ob.removeAttribute('id');
        };
        Object.prototype.css = function(obj) {
            var ob = this;
            var keys = Object.keys(obj);
            var values = Object.values(obj);
            keys = keys.map((va) => {
                if (va.indexOf('-') != -1) {
                    var r = va.split('-');
                    var m = [];
                    r.map((v, i) => {
                        if (i != 0) {
                            m[i] = v.substr(0, 1).toUpperCase() + v.substr(1, v.length);
                        } else {
                            m[i] = v;
                        }
                    });
                    var retorno = '';
                    m.map((v) => {
                        retorno += v;
                    });
                    return retorno;
                } else {
                    return va;
                }
            });
            keys.map((v, i) => {
                ob.style[v] = values[i];
            });
        };
        Object.prototype.Click = function(fun = "function(){}") {
            var objt = this;
            fun.bind(objt);
            if (fun.toString() != "function(){}") {
                objt.addEventListener('click', fun);
            } else {
                objt.click();
            }
        };
        Object.prototype.Change = function(fun) {
            var objt = this;
            fun.bind(objt);
            objt.addEventListener('change', fun);
        };
        Object.prototype.Leave = function(fun) {
            var objt = this;
            fun.bind(objt);
            objt.addEventListener('mouseleave', fun);
        };
        Object.prototype.Center = function(fun) {
            var objt = this;
            fun.bind(objt);
            objt.addEventListener('mousecenter', fun);
        };
        Object.prototype.Html = function(code = '') {
            var ob = this;
            if (code != '') {
                ob.innerHTML = code;
            } else {
                return ob.innerHTML;
            }
        }
        Object.prototype.Load = function(fun) {
            document.addEventListener('DOMContentLoaded', fun);
        };
        Object.prototype.Hide = function(a = false) {
            var self = this;
            if (a) {
                self.addClass('animated swing');
                setTimeout(function() {
                    self.style.display = 'none';
                }, 1500);
            } else {
                self.style.display = 'none';
            }
        };
        Object.prototype.Show = function(a = false) {
            var self = this;
            if (a) {
                self.addClass('animated swing');
                setTimeout(function() {
                    self.style.display = '';
                }, 1500);
            } else {
                self.style.display = '';
            }
        };
        Object.prototype.Keypress = function(f) {
            var self = this;
            f.bind(self.srcElement);
            if (self == 'document') {
                document.addEventListener('keypress', f);
            } else {
                self.addEventListener('keypress', f);
            }
        };
        Object.prototype.Append = function(c) {
            var self = this;
            self.innerHTML += c;
        };
        Object.prototype.Val = function(c = '') {
            var self = this;
            if (c != '') {
                self.value = c;
            } else {
                return self.value;
            }
        };
        Object.prototype.Attr = function(g = '', p = '') {
            var self = this;
            if (g != '' && p == '') {
                return self.getAttribute(g);
            } else if (g != '' && p != '') {
                self.setAttribute(g, p);
            }
        };
        Object.prototype.Text = function() {
            var self = this;
            var text = self.innerText || self.textContent;
            return text;
        };
        window["strip"] = function(html) {
            html = html.replace(/(<([^>]+)>)/ig, "");
            html = html.replace(/[\\"'><]/g, '');
            var tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        };

    }

    /* CRIPTOGRAFADOR DE STRINGS */
    Encrypt(str) {

        return new Promise(function(resolve, reject) {

            var hash = CryptoJS.SHA256(str);
            const cryptado = hash.toString(CryptoJS.enc.Base64);
            resolve(cryptado);

        });

    }

    /* TEXTO ESCREVE NA TELA*/
    ifTextAnimate() {
        setTimeout(() => {

            if (document.querySelectorAll('[khan-txt-animate]').length != 0) {
                this.getTextAnimate();
            }

        }, 2000);

    }

    getTextAnimate() {

        var caixas = document.querySelectorAll('[khan-txt-animate]');

        caixas.forEach((v, i) => {
            var txt = v.innerHTML.split(''),
                t = document.createElement('p'),
                m = document.createElement('p');
            t.setAttribute('class', 'khan-txt-animate-' + i);
            m.setAttribute('class', 'khan-txt-animate-mark')
            m.innerHTML = ' |';
            v.innerHTML = '';
            v.appendChild(t);
            v.appendChild(m);
            var tAtual = document.querySelector('.khan-txt-animate-' + i);
            this.setTextAnimate(txt, tAtual);
        });

    }

    setTextAnimate(txt, tAtual) {

        txt.forEach((val, ind) => {
            setTimeout(() => {
                tAtual.innerHTML += val;
                if ((txt.length - 1) == ind) {
                    setTimeout(() => {
                        tAtual.innerHTML = '';
                        this.setTextAnimate(txt, tAtual);
                    }, 1500);
                }
            }, ind * 300);
        });

    }

    /* FUNCAO PARA PEGAR URL */
    uriHome() {

        if (location.hash.length == 0 && this.routeStatus == true) {
            location.href = '#/index';
            location.reload();
        }

    }

    /* INPUT QUE ESCREVE EM OUTRO ELEMENTO */
    ifModelBind() {

        setTimeout(() => {
            if (document.querySelectorAll('[khan-model]').length > 0) {
                this.ModelBind();
            }
        }, 10);

    }

    ModelBind() {
        document.querySelectorAll('[khan-model]').forEach((v, i) => {
            v.onkeyup = function() {
                new Khan().ViewBind(this);
            };
        });
    }

    ViewBind($bind) {
        if (document.querySelector('[khan-view="' + $bind.getAttribute('khan-model') + '"]').nodeName == 'INPUT') {
            document.querySelector('[khan-view="' + $bind.getAttribute('khan-model') + '"]').
            value = $bind.value
        } else {
            document.querySelector('[khan-view="' + $bind.getAttribute('khan-model') + '"]').
            innerHTML = $bind.value;
        }
    }

    /* PEGA VIEW DO PROJETO */
    GetView() {
        return document.querySelector('[khan-app]').getAttribute('khan-app');
    }

    /* FETCH JSON REQUEST PROMISE */
    fetchJSON(ob) {
        return new Promise(function(resolve, reject) {

            fetch(ob.url, {
                method: ob.method // opcional
            }).then(function(response) {
                response.text().then(function(result) {
                    resolve(result);
                });
            }).catch(function(err) {
                reject("Ocorreu um erro");
            });

        });
    }

    /* REQUESTS */
    Request($page, $d, $callback = function() {}) {
        var $request = new XMLHttpRequest();
        var $posts = '';
        var $dataKeys = Object.keys($d),
            $dataValues = Object.values($d),
            $dataPostArr = '';
        $request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        $dataKeys.forEach((val, index) => {
            if ((index + 1) < $dataKeys.length) {
                $dataPostArr += val + '=' + $dataValues[index] + '&';
            } else if ((index + 1) == $dataKeys.length) {
                $dataPostArr += val + '=' + $dataValues[index];
            }
        });
        $request.onreadystatechange = () => {
            if (this.readyState == 4 && this.status == 200) {
                $callback(this.textReponse);
            }
        }
        $request.open("POST", $page, true);
        $request.send($dataPostArr);
    }

    /* RENDERIZA O HTML COM JS */

    DomRender($code) {
            return (document.querySelectorAll(`[khan-app='${this.app}']`).length > 0) ? document.querySelector(`[khan-app='${this.app}']`).innerHTML += $code : this.Log('Erro ! Não Existe a View "' + this.app + '"');
        }
        /* FAZ O CACHE DO CODIGO RENDERIZADO*/
    CachePage(_page, call) {

        if (sessionStorage.getItem(_page)) {

            call(window.atob(sessionStorage.getItem(_page)));
            return false;

        } else {

            return true;

        }

    }

    PageRender($page, $callback = () => {}) {
        if(this.CachePage($page, $callback)){
        var $request = new XMLHttpRequest();
        $request.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                sessionStorage.setItem($page, window.btoa(this.responseText));
                $callback(this.responseText);
            }
        };
        $request.open("GET", $page, true);
        $request.send();
        }
    }

    /* FUNCOES DE DEBUG */

    Debug() {
        return {
            Log(str) {
                console.log(str);
            },
            Erro(str) {
                throw str;
            },
            Debug() {
                debugger;
            }
        };
    }

}
