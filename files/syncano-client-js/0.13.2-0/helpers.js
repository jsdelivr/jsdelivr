export function required(param) {
  throw new Error(`${param} parameter is required by SyncanoClient`)
}

export function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  const error = new Error(response.statusText)

  error.response = response

  throw error
}

export function parseJSON(response) {
  return response.json()
}
