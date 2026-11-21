import http from 'k6/http';
import { check, sleep } from 'k6';

// Comparative Benchmark: SSR vs ISR
export const options = {
  scenarios: {
    ssr_scenario: {
      executor: 'constant-vus',
      vus: 10,
      duration: '15s',
      exec: 'testSSR',
    },
    isr_scenario: {
      executor: 'constant-vus',
      vus: 10,
      duration: '15s',
      startTime: '16s',
      exec: 'testISR',
    },
  },
  thresholds: {
    'http_req_duration{page:ssr}': ['p(95)<4000'],
    'http_req_duration{page:isr}': ['p(95)<500'],
  },
};

const BASE_URL = 'http://localhost:3000';

export function setup() {
  const loginRes = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({
      student_id: '2026-90000',
      password: 'password123',
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  const data = JSON.parse(loginRes.body);
  return { token: data.token };
}

export function testSSR(data) {
  const res = http.get(`${BASE_URL}/students-ssr`, {
    headers: { Cookie: `auth_token=${data.token}` },
    tags: { page: 'ssr' },
  });

  check(res, {
    'SSR status 200': (r) => r.status === 200,
  });

  sleep(0.3);
}

export function testISR(data) {
  const res = http.get(`${BASE_URL}/students-isr`, {
    headers: { Cookie: `auth_token=${data.token}` },
    tags: { page: 'isr' },
  });

  check(res, {
    'ISR status 200': (r) => r.status === 200,
  });

  sleep(0.3);
}
