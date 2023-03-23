import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permissions, Roles } from '@prisma/client';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.get<string>(
      'requiredPermission',
      context.getHandler(),
    );
    if (!requiredPermission) return false;

    const request = context.switchToHttp().getRequest();

    if (request?.user) {
      if (!request.user.enabled) return false;
    }

    let flag = false;
    if (request?.user?.roles) {
      const { roles } = request.user;

      roles.forEach((role: any) => {
        role.permissions.forEach((permission: Permissions) => {
          if (permission.key === requiredPermission) {
            flag = true;
            return;
          }
        });
      });
    }
    return flag;
  }
}
