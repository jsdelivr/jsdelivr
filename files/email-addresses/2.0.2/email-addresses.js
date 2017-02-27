
// email-addresses.js - RFC 5322 email address parser
// v 2.0.2
//
// http://tools.ietf.org/html/rfc5322
//
// This library does not validate email addresses.
// emailAddresses attempts to parse addresses using the (fairly liberal)
// grammar specified in RFC 5322.
//
// email-addresses returns {
//     ast: <an abstract syntax tree based on rfc5322>,
//     addresses: [{
//            node: <node in ast for this address>,
//            name: <display-name>,
//            address: <addr-spec>,
//            local: <local-part>,
//            domain: <domain>
//         }, ...]
// }
//
// emailAddresses.parseOneAddress and emailAddresses.parseAddressList
// work as you might expect. Try it out.
//
// Many thanks to Dominic Sayers and his documentation on the is_email function,
// http://code.google.com/p/isemail/ , which helped greatly in writing this parser.

(function (global) {
"use strict";

function parse5322(opts) {

    // tokenizing functions

    function inStr() { return pos < len; }
    function curTok() { return parseString[pos]; }
    function getPos() { return pos; }
    function setPos(i) { pos = i; }
    function nextTok() { pos += 1; }
    function initialize() {
        pos = 0;
        len = parseString.length;
    }

    // parser helper functions

    function o(name, value) {
        return {
            name: name,
            tokens: value || "",
            semantic: value || "",
            children: []
        };
    }

    function wrap(name, ast) {
        var n;
        if (ast === null) { return null; }
        n = o(name);
        n.tokens = ast.tokens;
        n.semantic = ast.semantic;
        n.children.push(ast);
        return n;
    }

    function add(parent, child) {
        if (child !== null) {
            parent.tokens += child.tokens;
            parent.semantic += child.semantic;
        }
        parent.children.push(child);
        return parent;
    }

    function compareToken(fxnCompare) {
        var tok;
        if (!inStr()) { return null; }
        tok = curTok();
        if (fxnCompare(tok)) {
            nextTok();
            return o('token', tok);
        }
        return null;
    }

    function literal(lit) {
        return function literalFunc() {
            return wrap('literal', compareToken(function (tok) {
                return tok === lit;
            }));
        };
    }

    function and() {
        var args = arguments;
        return function andFunc() {
            var i, s, result, start;
            start = getPos();
            s = o('and');
            for (i = 0; i < args.length; i += 1) {
                result = args[i]();
                if (result === null) {
                    setPos(start);
                    return null;
                }
                add(s, result);
            }
            return s;
        };
    }

    function or() {
        var args = arguments;
        return function orFunc() {
            var i, result, start;
            start = getPos();
            for (i = 0; i < args.length; i += 1) {
                result = args[i]();
                if (result !== null) {
                    return result;
                }
                setPos(start);
            }
            return null;
        };
    }

    function opt(prod) {
        return function optFunc() {
            var result, start;
            start = getPos();
            result = prod();
            if (result !== null) {
                return result;
            }
            else {
                setPos(start);
                return o('opt');
            }
        };
    }

    function invis(prod) {
        return function invisFunc() {
            var result = prod();
            if (result !== null) {
                result.semantic = "";
            }
            return result;
        };
    }

    function colwsp(prod) {
        return function collapseSemanticWhitespace() {
            var result = prod();
            if (result !== null && result.semantic.length > 0) {
                result.semantic = " ";
            }
            return result;
        };
    }

    function star(prod, minimum) {
        return function starFunc() {
            var s, result, count, start, min;
            start = getPos();
            s = o('star');
            count = 0;
            min = minimum === undefined ? 0 : minimum;
            while ((result = prod()) !== null) {
                count = count + 1;
                add(s, result);
            }
            if (count >= min) {
                return s;
            }
            else {
                setPos(start);
                return null;
            }
        };
    }

    // One expects names to get normalized like this:
    // "  First  Last " -> "First Last"
    // "First Last" -> "First Last"
    // "First   Last" -> "First Last"
    function collapseWhitespace(s) {
        function isWhitespace(c) {
            return c === ' ' ||
                   c === '\t' ||
                   c === '\r' ||
                   c === '\n';
        }
        var i, str;
        str = "";
        for (i = 0; i < s.length; i += 1) {
            if (!isWhitespace(s[i]) || !isWhitespace(s[i + 1])) {
                str += s[i];
            }
        }

        if (isWhitespace(str[0])) {
            str = str.substring(1);
        }
        if (isWhitespace(str[str.length - 1])) {
            str = str.substring(0, str.length - 1);
        }
        return str;
    }

    // UTF-8 pseudo-production (RFC 6532)
    // RFC 6532 extends RFC 5322 productions to include UTF-8
    // using the following productions:
    // UTF8-non-ascii  =   UTF8-2 / UTF8-3 / UTF8-4
    // UTF8-2          =   <Defined in Section 4 of RFC3629>
    // UTF8-3          =   <Defined in Section 4 of RFC3629>
    // UTF8-4          =   <Defined in Section 4 of RFC3629>
    //
    // For reference, the extended RFC 5322 productions are:
    // VCHAR   =/  UTF8-non-ascii
    // ctext   =/  UTF8-non-ascii
    // atext   =/  UTF8-non-ascii
    // qtext   =/  UTF8-non-ascii
    // dtext   =/  UTF8-non-ascii
    function isUTF8NonAscii(tok) {
        // In JavaScript, we just deal directly with Unicode code points,
        // so we aren't checking individual bytes for UTF-8 encoding.
        // Just check that the character is non-ascii.
        return tok.charCodeAt(0) >= 128;
    }


    // common productions (RFC 5234)
    // http://tools.ietf.org/html/rfc5234
    // B.1. Core Rules

    // CR             =  %x0D
    //                         ; carriage return
    function cr() { return wrap('cr', literal('\r')()); }

    // CRLF           =  CR LF
    //                         ; Internet standard newline
    function crlf() { return wrap('crlf', and(cr, lf)()); }

    // DQUOTE         =  %x22
    //                         ; " (Double Quote)
    function dquote() { return wrap('dquote', literal('"')()); }

    // HTAB           =  %x09
    //                         ; horizontal tab
    function htab() { return wrap('htab', literal('\t')()); }

    // LF             =  %x0A
    //                         ; linefeed
    function lf() { return wrap('lf', literal('\n')()); }

    // SP             =  %x20
    function sp() { return wrap('sp', literal(' ')()); }

    // VCHAR          =  %x21-7E
    //                         ; visible (printing) characters
    function vchar() {
        return wrap('vchar', compareToken(function vcharFunc(tok) {
            var code = tok.charCodeAt(0);
            var accept = (0x21 <= code && code <= 0x7E);
            if (opts.rfc6532) {
                accept = accept || isUTF8NonAscii(tok);
            }
            return accept;
        }));
    }

    // WSP            =  SP / HTAB
    //                         ; white space
    function wsp() { return wrap('wsp', or(sp, htab)()); }


    // email productions (RFC 5322)
    // http://tools.ietf.org/html/rfc5322
    // 3.2.1. Quoted characters

    // quoted-pair     =   ("\" (VCHAR / WSP)) / obs-qp
    function quotedPair() {
        var qp = wrap('quoted-pair',
        or(
            and(literal('\\'), or(vchar, wsp)),
            obsQP
        )());
        if (qp === null) { return null; }
        // a quoted pair will be two characters, and the "\" character
        // should be semantically "invisible" (RFC 5322 3.2.1)
        qp.semantic = qp.semantic[1];
        return qp;
    }

    // 3.2.2. Folding White Space and Comments

    // FWS             =   ([*WSP CRLF] 1*WSP) /  obs-FWS
    function fws() {
        return wrap('fws', or(
            obsFws,
            and(
                opt(and(
                    star(wsp),
                    invis(crlf)
                   )),
                star(wsp, 1)
            )
        )());
    }

    // ctext           =   %d33-39 /          ; Printable US-ASCII
    //                     %d42-91 /          ;  characters not including
    //                     %d93-126 /         ;  "(", ")", or "\"
    //                     obs-ctext
    function ctext() {
        return wrap('ctext', or(
            function ctextFunc1() {
                return compareToken(function ctextFunc2(tok) {
                    var code = tok.charCodeAt(0);
                    var accept =
                        (33 <= code && code <= 39) ||
                        (42 <= code && code <= 91) ||
                        (93 <= code && code <= 126);
                    if (opts.rfc6532) {
                        accept = accept || isUTF8NonAscii(tok);
                    }
                    return accept;
                });
            },
            obsCtext
        )());
    }

    // ccontent        =   ctext / quoted-pair / comment
    function ccontent() {
        return wrap('ccontent', or(ctext, quotedPair, comment)());
    }

    // comment         =   "(" *([FWS] ccontent) [FWS] ")"
    function comment() {
        return wrap('comment', and(
            literal('('),
            star(and(opt(fws), ccontent)),
            opt(fws),
            literal(')')
        )());
    }

    // CFWS            =   (1*([FWS] comment) [FWS]) / FWS
    function cfws() {
        return wrap('cfws', or(
            and(
                star(
                    and(opt(fws), comment),
                    1
                ),
                opt(fws)
            ),
            fws
        )());
    }

    // 3.2.3. Atom

    //atext           =   ALPHA / DIGIT /    ; Printable US-ASCII
    //                       "!" / "#" /        ;  characters not including
    //                       "$" / "%" /        ;  specials.  Used for atoms.
    //                       "&" / "'" /
    //                       "*" / "+" /
    //                       "-" / "/" /
    //                       "=" / "?" /
    //                       "^" / "_" /
    //                       "`" / "{" /
    //                       "|" / "}" /
    //                       "~"
    function atext() {
        return wrap('atext', compareToken(function atextFunc(tok) {
            var accept =
                ('a' <= tok && tok <= 'z') ||
                ('A' <= tok && tok <= 'Z') ||
                ('0' <= tok && tok <= '9') ||
                (['!', '#', '$', '%', '&', '\'', '*', '+', '-', '/',
                  '=', '?', '^', '_', '`', '{', '|', '}', '~'].indexOf(tok) >= 0);
            if (opts.rfc6532) {
                accept = accept || isUTF8NonAscii(tok);
            }
            return accept;
        }));
    }

    // atom            =   [CFWS] 1*atext [CFWS]
    function atom() {
        return wrap('atom', and(colwsp(opt(cfws)), star(atext, 1), colwsp(opt(cfws)))());
    }

    // dot-atom-text   =   1*atext *("." 1*atext)
    function dotAtomText() {
        var s, maybeText;
        s = wrap('dot-atom-text', star(atext, 1)());
        if (s === null) { return s; }
        maybeText = star(and(literal('.'), star(atext, 1)))();
        if (maybeText !== null) {
            add(s, maybeText);
        }
        return s;
    }

    // dot-atom        =   [CFWS] dot-atom-text [CFWS]
    function dotAtom() {
        return wrap('dot-atom', and(invis(opt(cfws)), dotAtomText, invis(opt(cfws)))());
    }

    // 3.2.4. Quoted Strings

    //  qtext           =   %d33 /             ; Printable US-ASCII
    //                      %d35-91 /          ;  characters not including
    //                      %d93-126 /         ;  "\" or the quote character
    //                      obs-qtext
    function qtext() {
        return wrap('qtext', or(
            function qtextFunc1() {
                return compareToken(function qtextFunc2(tok) {
                    var code = tok.charCodeAt(0);
                    var accept =
                        (33 === code) ||
                        (35 <= code && code <= 91) ||
                        (93 <= code && code <= 126);
                    if (opts.rfc6532) {
                        accept = accept || isUTF8NonAscii(tok);
                    }
                    return accept;
                });
            },
            obsQtext
        )());
    }

    // qcontent        =   qtext / quoted-pair
    function qcontent() {
        return wrap('qcontent', or(qtext, quotedPair)());
    }

    //  quoted-string   =   [CFWS]
    //                      DQUOTE *([FWS] qcontent) [FWS] DQUOTE
    //                      [CFWS]
    function quotedString() {
        return wrap('quoted-string', and(
            invis(opt(cfws)),
            invis(dquote), star(and(opt(colwsp(fws)), qcontent)), opt(invis(fws)), invis(dquote),
            invis(opt(cfws))
        )());
    }

    // 3.2.5 Miscellaneous Tokens

    // word            =   atom / quoted-string
    function word() {
        return wrap('word', or(atom, quotedString)());
    }

    // phrase          =   1*word / obs-phrase
    function phrase() {
        return wrap('phrase', or(obsPhrase, star(word, 1))());
    }

    // 3.4. Address Specification
    //   address         =   mailbox / group
    function address() {
        return wrap('address', or(mailbox, group)());
    }

    //   mailbox         =   name-addr / addr-spec
    function mailbox() {
        return wrap('mailbox', or(nameAddr, addrSpec)());
    }

    //   name-addr       =   [display-name] angle-addr
    function nameAddr() {
        return wrap('name-addr', and(opt(displayName), angleAddr)());
    }

    //   angle-addr      =   [CFWS] "<" addr-spec ">" [CFWS] /
    //                       obs-angle-addr
    function angleAddr() {
        return wrap('angle-addr', or(
            and(
                invis(opt(cfws)),
                literal('<'),
                addrSpec,
                literal('>'),
                invis(opt(cfws))
            ),
            obsAngleAddr
        )());
    }

    //   group           =   display-name ":" [group-list] ";" [CFWS]
    function group() {
        return wrap('group', and(
            displayName,
            literal(':'),
            opt(groupList),
            literal(';'),
            invis(opt(cfws))
        )());
    }

    //   display-name    =   phrase
    function displayName() {
        return wrap('display-name', function phraseFixedSemantic() {
            var result = phrase();
            if (result !== null) {
                result.semantic = collapseWhitespace(result.semantic);
            }
            return result;
        }());
    }

    //   mailbox-list    =   (mailbox *("," mailbox)) / obs-mbox-list
    function mailboxList() {
        return wrap('mailbox-list', or(
            and(
                mailbox,
                star(and(literal(','), mailbox))
            ),
            obsMboxList
        )());
    }

    //   address-list    =   (address *("," address)) / obs-addr-list
    function addressList() {
        return wrap('address-list', or(
            and(
                address,
                star(and(literal(','), address))
            ),
            obsAddrList
        )());
    }

    //   group-list      =   mailbox-list / CFWS / obs-group-list
    function groupList() {
        return wrap('group-list', or(
            mailboxList,
            invis(cfws),
            obsGroupList
        )());
    }

    // 3.4.1 Addr-Spec Specification

    // local-part      =   dot-atom / quoted-string / obs-local-part
    function localPart() {
        // note: quoted-string, dotAtom are proper subsets of obs-local-part
        // so we really just have to look for obsLocalPart, if we don't care about the exact parse tree
        return wrap('local-part', or(obsLocalPart, dotAtom, quotedString)());
    }

    //  dtext           =   %d33-90 /          ; Printable US-ASCII
    //                      %d94-126 /         ;  characters not including
    //                      obs-dtext          ;  "[", "]", or "\"
    function dtext() {
        return wrap('dtext', or(
            function dtextFunc1() {
                return compareToken(function dtextFunc2(tok) {
                    var code = tok.charCodeAt(0);
                    var accept =
                        (33 <= code && code <= 90) ||
                        (94 <= code && code <= 126);
                    if (opts.rfc6532) {
                        accept = accept || isUTF8NonAscii(tok);
                    }
                    return accept;
                });
            },
            obsDtext
            )()
        );
    }

    // domain-literal  =   [CFWS] "[" *([FWS] dtext) [FWS] "]" [CFWS]
    function domainLiteral() {
        return wrap('domain-literal', and(
            invis(opt(cfws)),
            literal('['),
            star(and(opt(fws), dtext)),
            opt(fws),
            literal(']'),
            invis(opt(cfws))
        )());
    }

    // domain          =   dot-atom / domain-literal / obs-domain
    function domain() {
        return wrap('domain', function domainCheckTLD() {
            var result = or(obsDomain, dotAtom, domainLiteral)();
            if (opts.rejectTLD) {
                if (result.semantic.indexOf('.') < 0) {
                    return null;
                }
            }
            return result;
        }());
    }

    // addr-spec       =   local-part "@" domain
    function addrSpec() {
        return wrap('addr-spec', and(
            localPart, literal('@'), domain
        )());
    }

    // 4.1. Miscellaneous Obsolete Tokens

    //  obs-NO-WS-CTL   =   %d1-8 /            ; US-ASCII control
    //                      %d11 /             ;  characters that do not
    //                      %d12 /             ;  include the carriage
    //                      %d14-31 /          ;  return, line feed, and
    //                      %d127              ;  white space characters
    function obsNoWsCtl() {
        return opts.strict ? null : wrap('obs-NO-WS-CTL', compareToken(function (tok) {
            var code = tok.charCodeAt(0);
            return ((1 <= code && code <= 8) ||
                    (11 === code || 12 === code) ||
                    (14 <= code && code <= 31) ||
                    (127 === code));
        }));
    }

    // obs-ctext       =   obs-NO-WS-CTL
    function obsCtext() { return opts.strict ? null : wrap('obs-ctext', obsNoWsCtl()); }

    // obs-qtext       =   obs-NO-WS-CTL
    function obsQtext() { return opts.strict ? null : wrap('obs-qtext', obsNoWsCtl()); }

    // obs-qp          =   "\" (%d0 / obs-NO-WS-CTL / LF / CR)
    function obsQP() {
        return opts.strict ? null : wrap('obs-qp', and(
            literal('\\'),
            or(literal('\0'), obsNoWsCtl, lf, cr)
        )());
    }

    // obs-phrase      =   word *(word / "." / CFWS)
    function obsPhrase() {
        return opts.strict ? null : wrap('obs-phrase', and(
            word,
            star(or(word, literal('.'), colwsp(cfws)))
        )());
    }

    // 4.2. Obsolete Folding White Space

    // NOTE: read the errata http://www.rfc-editor.org/errata_search.php?rfc=5322&eid=1908
    // obs-FWS         =   1*([CRLF] WSP)
    function obsFws() {
        return opts.strict ? null : wrap('obs-FWS', star(
            and(invis(opt(crlf)), wsp),
            1
        )());
    }

    // 4.4. Obsolete Addressing

    // obs-angle-addr  =   [CFWS] "<" obs-route addr-spec ">" [CFWS]
    function obsAngleAddr() {
        return opts.strict ? null : wrap('obs-angle-addr', and(
            invis(opt(cfws)),
            literal('<'),
            obsRoute,
            addrSpec,
            literal('>'),
            invis(opt(cfws))
        )());
    }

    // obs-route       =   obs-domain-list ":"
    function obsRoute() {
        return opts.strict ? null : wrap('obs-route', and(
            obsDomainList,
            literal(':')
        )());
    }

    //   obs-domain-list =   *(CFWS / ",") "@" domain
    //                       *("," [CFWS] ["@" domain])
    function obsDomainList() {
        return opts.strict ? null : wrap('obs-domain-list', and(
            star(or(invis(cfws), literal(','))),
            literal('@'),
            domain,
            star(and(
                literal(','),
                invis(opt(cfws)),
                opt(and(literal('@'), domain))
            ))
        )());
    }

    // obs-mbox-list   =   *([CFWS] ",") mailbox *("," [mailbox / CFWS])
    function obsMboxList() {
        return opts.strict ? null : wrap('obs-mbox-list', and(
            star(and(
                invis(opt(cfws)),
                literal(',')
            )),
            mailbox,
            star(and(
                literal(','),
                opt(and(
                    mailbox,
                    invis(cfws)
                ))
            ))
        )());
    }

    // obs-addr-list   =   *([CFWS] ",") address *("," [address / CFWS])
    function obsAddrList() {
        return opts.strict ? null : wrap('obs-addr-list', and(
            star(and(
                invis(opt(cfws)),
                literal(',')
            )),
            address,
            star(and(
                literal(','),
                opt(and(
                    address,
                    invis(cfws)
                ))
            ))
        )());
    }

    // obs-group-list  =   1*([CFWS] ",") [CFWS]
    function obsGroupList() {
        return opts.strict ? null : wrap('obs-group-list', and(
            star(and(
                invis(opt(cfws)),
                literal(',')
            ), 1),
            invis(opt(cfws))
        )());
    }

    // obs-local-part = word *("." word)
    function obsLocalPart() {
        return opts.strict ? null : wrap('obs-local-part', and(word, star(and(literal('.'), word)))());
    }

    // obs-domain       = atom *("." atom)
    function obsDomain() {
        return opts.strict ? null : wrap('obs-domain', and(atom, star(and(literal('.'), atom)))());
    }

    // obs-dtext       =   obs-NO-WS-CTL / quoted-pair
    function obsDtext() {
        return opts.strict ? null : wrap('obs-dtext', or(obsNoWsCtl, quotedPair)());
    }

    /////////////////////////////////////////////////////

    // ast analysis

    function findNode(name, root) {
        var i, queue, node;
        if (root === null || root === undefined) { return null; }
        queue = [root];
        while (queue.length > 0) {
            node = queue.shift();
            if (node.name === name) {
                return node;
            }
            for (i = 0; i < node.children.length; i += 1) {
                queue.push(node.children[i]);
            }
        }
        return null;
    }

    function findAllNodes(name, root) {
        var i, queue, node, result;
        if (root === null || root === undefined) { return null; }
        queue = [root];
        result = [];
        while (queue.length > 0) {
            node = queue.shift();
            if (node.name === name) {
                result.push(node);
            }
            for (i = 0; i < node.children.length; i += 1) {
                queue.push(node.children[i]);
            }
        }
        return result;
    }

    function giveResult(ast) {
        function grabSemantic(n) {
            return n !== null ? n.semantic : null;
        }
        var i, ret, addresses, addr, name, aspec, local, domain;
        if (ast === null) {
            return null;
        }
        ret = { ast: ast };
        addresses = findAllNodes('address', ast);
        ret.addresses = [];
        for (i = 0; i < addresses.length; i += 1) {
            addr = addresses[i];
            name = findNode('display-name', addr);
            aspec = findNode('addr-spec', addr);
            local = findNode('local-part', aspec);
            domain = findNode('domain', aspec);
            ret.addresses.push({
                node: addr,
                parts: {
                    name: name,
                    address: aspec,
                    local: local,
                    domain: domain
                },
                name: grabSemantic(name),
                address: grabSemantic(aspec),
                local: grabSemantic(local),
                domain: grabSemantic(domain)
            });
        }

        if (opts.simple) {
            ret = ret.addresses;
            for (i = 0; i < ret.length; i += 1) {
                delete ret[i].node;
            }
        }
        return ret;
    }

    /////////////////////////////////////////////////////

    var parseString, pos, len, parsed;

    opts = handleOpts(opts, {});
    if (opts === null) { return null; }

    parseString = opts.input;

    if (!opts.strict) {
        initialize();
        opts.strict = true;
        parsed = addressList(parseString);
        if (opts.partial || !inStr()) {
            return giveResult(parsed);
        }
        opts.strict = false;
    }

    initialize();
    parsed = addressList(parseString);
    if (!opts.partial && inStr()) { return null; }
    return giveResult(parsed);
}

function parseOneAddressSimple(opts) {
    var result;

    opts = handleOpts(opts, {
        rfc6532: true,
        simple: true
    });
    if (opts === null) { return null; }

    result = parse5322(opts);

    if ((!result) ||
        (!opts.partial &&
            (opts.simple && result.length > 1) ||
            (!opts.simple && result.addresses.length > 1))) {
        return null;
    }

    return opts.simple ?
        result && result[0] :
        result && result.addresses && result.addresses[0];
}

function parseAddressListSimple(opts) {
    var result;

    opts = handleOpts(opts, {
        rfc6532: true,
        simple: true
    });
    if (opts === null) { return null; }

    result = parse5322(opts);

    return opts.simple ? result : result.addresses;
}

function handleOpts(opts, defs) {
    function isString(str) {
        return Object.prototype.toString.call(str) === '[object String]';
    }

    function isObject(o) {
        return o === Object(o);
    }

    function isNullUndef(o) {
        return o === null || o === undefined;
    }

    var defaults, o;

    if (isString(opts)) {
        opts = { input: opts };
    } else if (!isObject(opts)) {
        return null;
    }

    if (!isString(opts.input)) { return null; }
    if (!defs) { return null; }

    defaults = {
        rfc6532: false,
        partial: false,
        simple: false,
        strict: false,
        rejectTLD: false
    };

    for (o in defaults) {
        if (isNullUndef(opts[o])) {
            opts[o] = !isNullUndef(defs[o]) ? defs[o] : defaults[o];
        }
        opts[o] = !!opts[o];
    }
    return opts;
}

parse5322.parseOneAddress = parseOneAddressSimple;
parse5322.parseAddressList = parseAddressListSimple;

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = parse5322;
} else {
    global.emailAddresses = parse5322;
}

}(this));
