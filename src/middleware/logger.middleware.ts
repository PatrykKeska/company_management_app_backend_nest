import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as path from 'path';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { url } = req;
    if (url.indexOf('/api') === 1) {
      next();
    } else {
      res.setHeader('Content-Type', 'text/html').sendFile('index.html', {
        root: path.join(__dirname, '..', '/public/'),
      });
    }

    next();
  }
}
