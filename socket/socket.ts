import { config } from 'dotenv';
import Koa from 'koa';

config({ path: './config.env' });

const app = new Koa();
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Socket server listening on port ${port}.`);
});
