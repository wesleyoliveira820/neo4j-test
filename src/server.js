import express from 'express';
import { driver } from './database/index.js';
import routes from './routes.js';

function bootstrap() {
  const server = express();
  server.use(express.json())
  server.use(routes);
  server.listen(3333, () => {
    console.log('servidor rodando')
  });
}

const closeDriver = (code) => {
  console.log('exit code', code);
  driver.close();
  process.exit(0)
};

process.on('SIGINT', closeDriver);

bootstrap();
