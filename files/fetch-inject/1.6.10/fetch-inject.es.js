/**
 * Fetch Inject v1.6.10
 * Copyright (c) 2017 Josh Habdas
 * @licence ISC
 */

const head = (function(i,s,o,g,r,a,m){a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.type=g.blob.type;a.appendChild(s.createTextNode(g.text));a.onload=r(g);m?m.parentNode.insertBefore(a,m):s.head.appendChild(a);}); // eslint-disable-line

/**
 * Fetch Inject module.
 * @module fetchInject
 * @param {(USVString[]|Request[])} inputs Resources you wish to fetch.
 * @param {Promise} [promise] A promise to await before attempting injection.
 * @exception {Promise<Error>} Invalid arguments and anything Fetch throws.
 * @returns {Promise<Array<Object>>} Promise that resolves to an Array of
 *     Objects containing Response Body properties used by the Module.
 */
const fetchInject = function (inputs, promise) {
  if (!(inputs && Array.isArray(inputs))) return Promise.reject(new Error('`inputs` must be an array'))
  if (promise && !(promise instanceof Promise)) return Promise.reject(new Error('`promise` must be a promise'))

  const resources = [];
  const deferreds = promise ? [].concat(promise) : [];
  const thenables = [];

  inputs.forEach(input => deferreds.push(
    window.fetch(input).then(res => {
      return [res.clone().text(), res.blob()]
    }).then(promises => {
      return Promise.all(promises).then(resolved => {
        resources.push({ text: resolved[0], blob: resolved[1] });
      })
    })
  ));

  return Promise.all(deferreds).then(() => {
    resources.forEach(resource => {
      thenables.push({ then: resolve => {
        resource.blob.type === 'text/css'
          ? head(window, document, 'style', resource, resolve)
          : head(window, document, 'script', resource, resolve);
      }});
    });
    return Promise.all(thenables)
  })
};

export default fetchInject;
