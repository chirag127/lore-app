const fs = require('node:fs');
const path = require('node:path');

const sa = {
  type: 'service_account',
  project_id: 'bookatlas-13392',
  private_key_id: '250c586528cf3f090e8ba69ec708390a2b2cdb15',
  private_key: [
    '-----BEGIN PRIVATE KEY-----',
    'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQD6VnbNDk+sUdsw',
    'puHfYBeJJrt0OvfdeF2UEgr5KlMIxGN1iIOV5nYM3BUUhUZGOX5e26mXkXNTMEFC',
    'Bgdl1IdhBd5/yCvn4I3r8WO1Husu0l7rPfqHtXEFRAf3p2BIPTrfHSX1xMGSkLiR',
    '7ocbluXjML1BLmkyobyBJHYjKWcJop0MMzDmfLT+RcnT4ZIxFSHvRaJgH3WR7qq9',
    'VbbgtvyDmwf44pQbW8fSPIGt/pnkwvyJXLnYrEBEbxmwgNBuUoTNA+WCQP/zAKeG',
    'LUEJ86gx+JawIa7PWvknBBzQny97rbf+NfvFtPFOdzmEVtQkzb5aLMe505GWyWNp',
    '4oepyqtrAgMBAAECggEAF3UUqsBFjPMao+NvVNwPOIXNmOWRpkoKEr7iElj58N9e',
    'JnxFQD2ZIDlbLFIUtK3cfoz8xjwV31ytML+Z39vbV6cSI00heBfdlJdI7YbZKMkD',
    'pe1n1WGWFpU6XeVsKzi5lICJtw7ZyJ8Q/HOqa1ZncjN1+G6d4uWu4TcGbuMJSaio',
    'tvlO0UsCHEBxxW/Gwg9dycMw7iFazP/+PQz62/bNCnUGkwuQFWDNOSjAV6Lo9TY3',
    'ioOTw4/CZJTdpqpsMj+RavDbC7rl3FeY8wzBDwG3Pw8xQ8i/pqZ85F3NHQN1LpMZ',
    'Ij3ITYh6pYitsMFzCAYhnDxiif4TcDmKuOtNEnQK+QKBgQD+zp8U1ndy3IQIjAF7',
    'xJI4t434thJePVG3reXJXLLuk0GC80O0uXZccMYWPmyvzP8oFf0wugPLilqTe4Uu',
    'gcKiVYDEOgDOSQLUnXC5rbyM+smAiMxvB9ZbMbfTJImWWX/Djnh0SxZ6lYGJExIt',
    'm5kCNRTCfJHejTJBW4B4d4HHVQKBgQD7gnx7VYUjJccBsTIT7fHDXEce3/DJ3HrM',
    'P3OZmh/Gr1taP4SlZfHRLpr//gEG+hOWY9GpwUHduObzXPUtQX0Dq5FjNOkLIp1Z',
    'EppB62tpuLqZd/8wYVZdDr1oBzA6YKgcJmqXTpCdvbLQW0sURzVqzFek7TEhtDdW',
    'pV9ZnjUnvwKBgH8jIYUILbmGBest0F+tCTh7fb8nOasD9Y4smocKVc1sdDeeoZ2/',
    'HCurqWrX4usk4ftiXV6+sb4RXnhQHXfDDxZoi0NdnaFQFLV5iRFcesPtLjWQDFEq',
    'G+6MtCgKBwyZw4ITyE5eWOz5RBTdCyjuhj3vtlgER9Q/p1+tBEEXgA2xAoGAEN3Y',
    'UUET85518RQcAqAjZXGLx3NHJ5JkncvnibZ/SQi7fJrj31+tztRsSpyTHw+oPp6l',
    'EdhG/YKH4mwqeQV6R8O6tUd4FWoV2UJZG/CYvHdJ9D7K20i7zPPPGenZfyC6RWEC',
    'JvF620k8c6Kbr1lzKJ1Zh1Lsx5DZYTMn6M+mSusCgYEAmyfvjh0MWYyLbcGPotW1',
    'v8Feh9160MvbAOdajyBQ8jfW/J4Arcqtt8aEkyX6el818eKtaYX/TcH5hV5rtfqb',
    'mYbRMSF1DeGZBguLcSY8/f4XyAJPy5OjyVYICgRI1Y/zzV8DRxv8ij4QLnmcVOXB',
    'yQmgqsF9UCbA/L7G+aMZHc8=',
    '-----END PRIVATE KEY-----',
  ].join('\n'),
  client_email: 'firebase-adminsdk-fbsvc@bookatlas-13392.iam.gserviceaccount.com',
  client_id: '103039015639280181568',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40bookatlas-13392.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
};

const out = path.join(__dirname, '..', '.secrets', 'sa-key.json');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(sa, null, 2));
const st = fs.statSync(out);
console.log(`wrote ${st.size} bytes to ${out}`);
const content = fs.readFileSync(out, 'utf8');
if (!content.includes('BEGIN PRIVATE KEY') || content.includes('\\n')) {
  throw new Error('private key not properly decoded');
}
console.log('private key has real newlines: OK');
