function makeToc(contentSelector, tocSelector, options) {
  if (options == null) {
    options = {};
  }
  if (contentSelector == null) {
    throw new Error('need to provide a selector where to scan for headers');
  }
  if (tocSelector == null) {
    throw new Error('need to provide a selector where inject the TOC');
  }
  var allChildren = Array.prototype.slice.call(document.querySelectorAll(contentSelector + ' > *'));
  var min = Number.MAX_SAFE_INTEGER;
  var headers = allChildren.filter(function(item) {
    var classesList = item.className.split(' ');
    if (classesList.indexOf("toc-ignore") != -1) {
      return false;
    }
    if ((options.ignore || []).indexOf(getText(item)) != -1) {
      return false;
    }
    var splitted = item.nodeName.split('');
    var headingNumber = parseInt(splitted[1]);
    if (splitted[0] === 'H' && headingNumber >= 1 && headingNumber <= (options.max || 6)) {
      min = Math.min(min, headingNumber);
      return true;
    }
  });
  var hierarchy = createHierarchy(headers, min);
  var toc = parseNodes(hierarchy.nodes);
  var container = document.querySelector(tocSelector);
  setText(container, '');
  container.appendChild(toc);
}

function createHierarchy(headers, minLevel) {
  var hierarchy = { nodes: [] };
  window.hierarchy = hierarchy;
  var previousNode = { parent: hierarchy };
  var level = minLevel;
  var init = false;
  headers.forEach(function(header) {
    var headingNumber = parseInt(header.nodeName.substr(1));
    var object = {
      title: getText(header),
      link: window.location.pathname + '#' + header.id,
      originLevel: headingNumber,
      nodes: []
    };
    if (headingNumber === level) {
      object.parent = previousNode.parent;
      // keep level
    } else if (headingNumber - level >= 1) {
      // go one step deeper, regardless how much
      // the difference between headingNumber and level is
      if (init === false) {
        var missingParent = {
          parent: previousNode.parent,
          title: '',
          link: '',
          originLevel: NaN,
          nodes: []
        };
        previousNode.parent.nodes.push(missingParent);
        previousNode = missingParent;
      }
      object.parent = previousNode;
      level++;
    } else if (level - headingNumber >= 1) {
      // go one or more step up again
      var ref = previousNode.parent;
      while (level - headingNumber >= 1) {
        ref = ref.parent;
        level--;
      }
      object.parent = ref;
    } else {
      console.error('unkown toc path');
    }
    object.parent.nodes.push(object);
    previousNode = object;
    init = true;
  });
  return hierarchy;
}

function parseNodes(nodes) {
    var ul = document.createElement("UL");
    for(var i=0; i<nodes.length; i++) {
    	ul.appendChild(parseNode(nodes[i]));
    }
    return ul;
}

function parseNode(node) {
    var li = document.createElement("LI");
    var a = document.createElement("A");
    setText(a, node.title);
    a.href = node.link;
    li.appendChild(a);
    if(node.nodes) {
      li.appendChild(parseNodes(node.nodes));
    }
    return li;
}

function getText(elem) {
    if (elem.textContent != null) {
        return elem.textContent;
    } else {
        elem.innerText;
    }
}

function setText(elem, value) {
    if (elem.textContent != null) {
        elem.textContent = value;
    } else {
        elem.innerText = value;
    }
}

module.exports = makeToc;
