const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

async function request(path, options = {}) {
  const headers = { ...options.headers }
  if (options.body) headers['Content-Type'] = 'application/json'

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers,
    ...options,
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Request failed')
  return data
}

export function getProducts() {
  return request('/products/')
}

export function createOrder(order) {
  return request('/orders/', { method: 'POST', body: JSON.stringify(order) })
}
