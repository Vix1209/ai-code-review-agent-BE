import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  CanActivate,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class BlockRequestsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isBlocked = process.env.BLOCK_REQUESTS === 'true';

    if (isBlocked) {
      throw new HttpException('Action disabled by Admin', HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
