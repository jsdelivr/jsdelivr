YUI.add('gallery-a11ychecker-base', function(Y) {

(function () {

YUI.namespace("a11ychecker");

var errors = YUI.a11ychecker.errors,
    ns = Y.namespace("a11ychecker");

if (!errors) {
    errors = YUI.a11ychecker.errors = {};
}

ns.logError = function(test, node, message, cat) {
    
    cat = cat || "error";
    node = Y.Lang.isString(node) ? Y.one("#" + node) : node;
    
    var nodeInfo = {},
        text = node.get("text"),
        className = node.get("className"),
        name = node.get("name"),
        id = node.generateID(),
        src = node.get("src"),
        entry;
    
    if (text) {
        nodeInfo.textLabel = text;
    }

    if (name) {
        nodeInfo.name = name;
    }            
    
    if (className) {
        nodeInfo.className = className;
    }

    if (src) {
        nodeInfo.src = src;
    }

    if (!(entry = errors[id])) {
        entry = errors[id] = {};
    }
    
    entry[test] = {
        message: message,
        nodeInfo: nodeInfo,
        category: cat 
    };

};

ns.clearErrors = function (testName) {
    
    testName = Y.Lang.isString(testName) ? testName : testName.testName;
    
    if (testName) {
        Y.each(errors, function (v, k) {

            if (v[testName]) {
                delete v[testName];
            }
            
            if (Y.Object.size(v) === 0) {
                delete errors[k];
            }
            
        });
    }
    else {
        errors = YUI.a11ychecker.errors = {};
    }
    
};

ns.getErrors = function () {
    return errors;
};

}());
(function () {

var ns = Y.namespace("a11ychecker"),
    logError = ns.logError,
    testName = "dupe-link-test",
    jsLinkRE = /(^#$)|(^javascript:)/,
    yltRE = /(;_yl[a-z]|_yl[a-z])=(\w|\W)+/g,
    EMPTY_STRING = "";


function getURL(url, ignoreYLT) {
    
    var returnVal;
    
    if (url && url.search(jsLinkRE) === -1) {
        returnVal = ignoreYLT ? url.replace(yltRE, EMPTY_STRING) : url;
    }
    
    return returnVal;
    
}


var getParent = (function() {

    var called = 0;

    return function (node, level) {
        
        level = (Y.Lang.isNumber(level) && level > 0) ? (level - 1) : 2;
        
        if (node.get("nodeName").toLowerCase() === "body") {
            called = 0;
        }
        else {
            called = called < level ? (called + 1) : 0;
        }
        
        return (called === 0);
    
    };

}());


function findAllDupeLinks(config) {

    config = config || {};

    var duplicateURLs = {},
        urls = {};

    Y.all("a").each(function(v) {

        var href, entry;

        if ((href = getURL(v.getAttribute("href", 2), config.ignoreYLT)) && !(entry = urls[href])) {
            entry = urls[href] = [];
        }
        
        if (entry) {
            entry.push(v.generateID());
        }
    
    }); 

    Y.each(urls, function(v, k) {
        if (urls[k].length > 1) {                    
            duplicateURLs[k] = v;
        }
    });
    
    return duplicateURLs;

}

function findDupeSibLinks(id, url, level, ignoreYLT) {

    var node = Y.one("#" + id),
        parent = node.ancestor(Y.rbind(getParent, null, level)),
        dupes = [];

    parent.all("a").each(function (v) {
        
        var href;

        if ((href = getURL(v.getAttribute("href", 2), ignoreYLT)) && href === url) {
            dupes.push(v);
        }
        
    });

    return dupes;

//    return parent.all("a[href='" + href + "']");
//    return parent.all("a[href^='" + href + "']");

}

function findDupeLinks(config) {
    
    config = config || {};
    duplicateURLs = findAllDupeLinks(config);
    
    var siblings,
        len;

    Y.each(duplicateURLs, function(v, k) {
        Y.each(duplicateURLs[k], function (v) {
            
            if (config.all) {
                len = duplicateURLs[k].length;
                logError(testName, v, (len - 1) + " other instance(s) of this link on this page.", "warn");
            }
            else {
                
                siblings = findDupeSibLinks(v, k, config.level, config.ignoreYLT);
                len = siblings.length;
                
                if (len > 1) {
                    Y.each(siblings, function (v) {
                        logError(testName, v, (len - 1) + " other instance(s) of this link within the same parent node.", "warn");
                    });        
                }

            }
        });
    });        
}

findDupeLinks.testName = testName;

ns.findDupeLinks = findDupeLinks;

}());
(function () {

var ns = Y.namespace("a11ychecker"),
    testName = "dupe-link-labels-test";

function findDupeLinkLabels() {
    var dupes = {},
        labels = {};

    Y.all("a").each(function(v) {

        var label, entry;

        if ((label = v.get("text")) && !(entry = labels[label])) {
            entry = labels[label] = [];
        }
        
        if (entry) {
            entry.push(v.generateID());
        }
    
    }); 

    Y.each(labels, function(v, k) {
        if (labels[k].length > 1) {                    
            dupes[k] = v;
        }
    });
            
    Y.each(dupes, function(v, k) {
        Y.each(dupes[k], function (v) {
            ns.logError(testName, v, "2 or more links found with this link's label.", "warn");
        });
    });
    
    return dupes;
}

findDupeLinkLabels.testName = testName;

ns.findDupeLinkLabels = findDupeLinkLabels;

}());
(function () {

function createInputTypesSelector() {

    var selector = [];

    Y.each(INPUT_TYPES, function (v) {
        selector.push("input[type=" + v + "]");
    });

    return selector.join();

}

var INPUT_TYPES = ["file",
        "checkbox",
        "radio",
        "password",
        "text",
        "email",
        "url",
        "number",
        "range",
        "date",
        "month",
        "week",
        "time",
        "datetime",
        "datetime-local",
        "search",
        "color"],
    
    ALL_INPUTS_SELECTOR = createInputTypesSelector()+",textarea,select",
    NO_LABEL_ERROR = "Element has no label.",
    ns = Y.namespace("a11ychecker"),
    logError = ns.logError,
    testName = "label-test";


function labelIsValid(node) {
    
    var success = false,
        selector = "input,select,textarea",
        id,
        formField,
        nodeName;
    
    if (hasInnerText(node)) {
        
        id = node.get("for");
        
        if ((formField = Y.one("#" + id))) {
            
            nodeName = formField.get("nodeName").toLowerCase();

            if (selector.indexOf(nodeName) !== -1) {
                success = true;           
            }
            else {
                logError(testName, node, "The \"for\" attribute doesn't correspond to the id of an input, select or textarea.");
            }
            
        }
        else if (node.all(selector).size() !== 1) {
            logError(testName, node, "The label element has no \"for\" attribute, but doesn't contain an input, select or textarea.");
        }
        
    }
    else {
        logError(testName, node, "The label element has no inner text.");
    }            

    return success;
    
}


function hasLabelElement(node) {

    var id = node.get("id"),
        label = false;
    
    if (id) {
        label = Y.one("label[for=" + id + "]");
    }
    
    if (!label) {
        label = node.ancestor("label");
    }

    return label;        
}


function hasInnerText(node) {
    return node.get("text");
}


function hasARIALabellBy(node) {
    
    var attr = node.get("aria-labelledby"),
        success = false;
    
    if (attr) {
        success = Y.one("#" + attr);
    }

    return success;
                
}


function hasTitleorARIALabel(node) {
    return node.get("title") || node.get("aria-label");
}


function containsImgWithAlt(node) {

    var img = node.one("img"),
        success = false;
    
    if (img) {
        success = img.get("alt");
    }
    
    return success;

}

function checkLabels() {

    Y.all("label").each(function (node) {
        labelIsValid(node);
    });
    
    Y.all(ALL_INPUTS_SELECTOR).each(function (node) {
    
        if (!hasLabelElement(node) && !hasTitleorARIALabel(node) && !hasARIALabellBy(node)) {
           logError(testName, node, NO_LABEL_ERROR);
        }
    
    });
    
    Y.all("button,a").each(function (node) {
    
        if (!hasInnerText(node) && !hasTitleorARIALabel(node) && !hasARIALabellBy(node) && !containsImgWithAlt(node)) {
           logError(testName, node, NO_LABEL_ERROR);
        }
    
    });
    
    Y.all("input[type=button],input[type=submit],input[type=reset]").each(function (node) {
    
        if (!node.get("value") && !hasTitleorARIALabel(node) && !hasARIALabellBy(node)) {
           logError(testName, node, NO_LABEL_ERROR);
        }
    
    });

    Y.all("iframe").each(function (node) {
    
        if (!hasTitleorARIALabel(node) && !hasARIALabellBy(node)) {
           logError(testName, node, NO_LABEL_ERROR);
        }
    
    });
    
    Y.all("input[type=image],img").each(function (node) {
    
        if (!node.get("alt")) { // TO DO - ability to discern between no alt attribute and empty alt attribute?
            logError(testName, node, "No alt text."); 
        }
    
    });

}

checkLabels.testName = testName;

ns.checkLabels = checkLabels;

}());
(function () {

var ns = Y.namespace("a11ychecker"),
    testName = "link-button-test",
    re = /(^#$)|(^javascript:)/i;

function findLinkButtons() {

    Y.all("a").each(function (link) {

        var href = link.get('href');

        if ((!href || (href && href.search(re) === 0)) && (!link.get('role'))) {
            ns.logError(testName, link, "Link used to create a button. Consider adding ARIA role of \"button\" or switch to button element.", "warn");
        }
    
    });

}

findLinkButtons.testName = testName;

ns.findLinkButtons = findLinkButtons;

}());



}, 'gallery-2011.09.28-20-29' ,{skinnable:false, requires:['node', 'selector-css3']});
