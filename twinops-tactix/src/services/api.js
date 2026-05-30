const DEFAULT_API_URL = 'http://localhost:8000';

function trimTrailingSlash(value) {
  return value.replace(/\/+$/, '');
}

export const API_BASE_URL = trimTrailingSlash(
  process.env.REACT_APP_API_BASE_URL || DEFAULT_API_URL
);

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof body === 'object' ? body.detail || body.message : body;
    throw new Error(message || `Request failed with ${response.status}`);
  }

  return body;
}

export function submitMachineInput(payload) {
  return request('/input', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function processAgents() {
  return request('/process');
}

export function submitApproval(approved) {
  return request('/approve', {
    method: 'POST',
    body: JSON.stringify({ approved }),
  });
}
