import http from 'k6/http';
import { check, sleep } from 'k6';

// k6 Load Test Configuration for Next.js SSR Page
export const options = {
  stages: [
    { duration: '5s', target: 10 },  // Ramp-up to 10 virtual users
    { duration: '15s', target: 20 }, // Sustained load at 20 virtual users
    { duration: '5s', target: 0 },   // Ramp-down to 0
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],     // http errors should be less than 5%
    http_req_duration: ['p(95)<3000'],  // 95% of requests should be below 3s
  },
};

const BASE_URL = 'http://localhost:3000';

// Setup phase: Authenticate once to obtain valid JWT token
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

  const loginSuccess = check(loginRes, {
    'login status 200': (r) => r.status === 200,
  });

  if (!loginSuccess) {
    throw new Error(`Login failed with status: ${loginRes.status}`);
  }

  const data = JSON.parse(loginRes.body);
  return { token: data.token };
}

// Virtual User Execution
export default function (data) {
  const params = {
    headers: {
      Cookie: `auth_token=${data.token}`,
    },
  };

  const res = http.get(`${BASE_URL}/students-ssr`, params);

  check(res, {
    'SSR status is 200': (r) => r.status === 200,
    'SSR body has student directory': (r) => r.body.includes('Student Roster') || r.body.includes('Enrolled Students'),
  });

  sleep(0.5);
}
