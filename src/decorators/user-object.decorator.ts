import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserObjectDecorator = createParamDecorator(
  (data, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().user;
  },
);
