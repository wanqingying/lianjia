import { createServer } from 'http';

const sere = createServer((req, res) => {
  res.write('hello');
  res.end();
});

sere.listen(3000, '127.0.0.1');
