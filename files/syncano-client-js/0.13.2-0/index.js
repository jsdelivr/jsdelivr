import 'isomorphic-fetch' // eslint-disable-line import/no-unassigned-import
import { required, checkStatus, parseJSON } from './helpers'

function SyncanoClient(instanceName = required('instanceName'), options = {}) {
  const host = options.host || 'syncano.space'

  client.instanceName = instanceName
  client.baseUrl = `https://${instanceName}.${host}/`
  client.loginMethod = options.loginMethod
  client.setTokenCallback = options.setTokenCallback
  client.token = options.token

  const defaults = {
    'Content-Type': 'application/json'
  }

  client.headers = headers => Object.assign(defaults, headers)

  return client
}

function client(endpoint = required('endpoint'), body = {}, options = {}) {
  return fetch(this.url(endpoint), {
    method: 'POST',
    headers: this.headers(options.headers),
    body: this.parseBody(body),
    ...options
  })
    .then(checkStatus)
    .then(parseJSON)
}

client.post = client

client.login = function (username, password) {
  const login = this.loginMethod ? this.loginMethod : (username, password) => {
    const authUrl = `${this.baseUrl}${this.instanceName}/user/auth/`
    const body = JSON.stringify({ username, password })
    const options = {
      headers: {
        'Content-Type': 'application/json'
      },
      body
    }

    return fetch(authUrl, options)
      .then(user => {
        this.setToken(user.token)

        return user
      })
  }

  return login(username, password)
}

client.url = function (endpoint) {
  return `${this.baseUrl}${endpoint}/`
}

client.parseBody = function (body) {
  if (typeof body === 'object') {
    let data = {
      ...body
    }

    if (client.token) {
      data = {
        ...data,
        _user_key: client.token // eslint-disable-line camelcase
      }
    }

    return JSON.stringify(data)
  }

  return body
}

client.logout = function () {
  this.token = undefined
}

client.setToken = function (token) {
  this.token = token

  if (typeof client.setTokenCallback === 'function') {
    client.setTokenCallback(token)
  }
}

client.get = function (endpoint = required('endpoint'), body = {}, options = {}) {
  return this.post(endpoint, { ...body, _method: 'GET' }, options)
}

client.delete = function (endpoint = required('endpoint'), body = {}, options = {}) {
  return this.post(endpoint, { ...body, _method: 'DELETE' }, options)
}

client.put = function (endpoint = required('endpoint'), body = {}, options = {}) {
  return this.post(endpoint, { ...body, _method: 'PUT' }, options)
}

client.patch = function (endpoint = required('endpoint'), body = {}, options = {}) {
  return this.post(endpoint, { ...body, _method: 'PATCH' }, options)
}

client.subscribe = function (endpoint = required('endpoint'), callback = required('callback')) {
  let abort = false
  const url = this.url(endpoint)
  const options = {
    method: 'GET',
    headers: this.headers()
  };

  (function loop() {
    fetch(url, options)
      .then(response => {
        if (abort) {
          return
        }

        if (response.status !== 200) {
          return loop()
        }

        loop()

        response.json().then(callback)
      })
      .catch(err => {
        if (/Failed to fetch/.test(err)) {
          loop()
        }
      })
  })()

  return {
    stop: () => {
      abort = true
    }
  }
}

export default SyncanoClient
