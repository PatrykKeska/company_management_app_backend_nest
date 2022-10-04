'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
// eslint-disable-next-line @typescript-eslint/no-var-requires
const core_1 = require('@nestjs/core');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const app_module_1 = require('./app.module');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await core_1.NestFactory.create(app_module_1.AppModule);
  app.enableCors({
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(3001);
}

bootstrap();
//# sourceMappingURL=main.js.map
