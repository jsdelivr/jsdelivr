/**
 * Fetch Inject
 * Copyright (c) 2017 Josh Habdas
 * Build: 2017-03-20T22:51:16+08:00
 * @licence MIT
 */

const script = (function(i,s,o,g,r,a,m){a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.appendChild(s.createTextNode(g));a.onload=r;m?m.parentNode.insertBefore(a,m):s.head.appendChild(a);}); // eslint-disable-line
const style = (function(i,s,o,g,r,a,m){a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.type='text/css';a.appendChild(s.createTextNode(g));m?m.parentNode.insertBefore(a,m):s.head.appendChild(a);}); // eslint-disable-line

var fetchInject = function (urls) {
  const resources = [];
  const deferreds = [];
  const thenables = [];

  urls.forEach((url) => deferreds.push(
    window.fetch(url).then(res => {
      return [res.clone().text(), res.blob()]
    }).then(kvArrays => {
      return Promise.all(kvArrays).then((kvArray) => {
        resources.push({ text: kvArray[0], type: kvArray[1].type });
      })
    })
  ));

  return Promise.all(deferreds).then(() => {
    resources.forEach((resource) => {
      thenables.push({ then: (resolve) => {
        if (resource.type === 'application/javascript') {
          script(window, document, 'script', resource.text, resolve());
        } else if (resource.type === 'text/css') {
          style(window, document, 'style', resource.text);
          resolve();
        }
      }});
    });
    return Promise.all(thenables)
  })
};

export default fetchInject;
