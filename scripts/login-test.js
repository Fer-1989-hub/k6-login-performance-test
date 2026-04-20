import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

// Cargar usuarios desde CSV
const users = new SharedArray('users', function () {
  return open('../data/users.csv')
    .split('\n')
    .slice(1)
    .filter(row => row.trim() !== '')
    .map(row => {
      const [user, passwd] = row.split(',');
      return { user, passwd };
    });
});

export const options = {
  scenarios: {
    login_test: {
      executor: 'ramping-arrival-rate',
      startRate: 2,
      timeUnit: '1s',
      preAllocatedVUs: 20,
      maxVUs: 100,

      stages: [
        { target: 5, duration: '2m' },
        { target: 10, duration: '2m' },
        { target: 15, duration: '2m' },
        { target: 20, duration: '2m' },
        { target: 20, duration: '2m' },
      ],
    },
  },

  thresholds: {
    http_req_duration: ['p(95)<1500'],
    http_req_failed: ['rate<0.03'],
  },
};

export default function () {
  const user = users[Math.floor(Math.random() * users.length)];

  const payload = JSON.stringify({
    username: user.user,
    password: user.passwd,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Endpoint REAL
  const res = http.post('https://fakestoreapi.com/auth/login', payload, params);

  check(res, {
    'status es 200': (r) => r.status === 200,
    'tiempo < 1.5s': (r) => r.timings.duration < 1500,
    'token recibido': (r) => r.json('token') !== undefined,
  });

  sleep(0.5);
}
