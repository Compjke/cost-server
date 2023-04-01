import {
  Injectable,
  UnauthorizedException,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from 'src/users/user.service';

@Injectable()
export class RefreshJWTGuard implements CanActivate {
  constructor(private userService: UsersService) {}
  async canActivate(
    context: ExecutionContext,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const { refresh_token, userName } = request.body;

    if (!refresh_token) {
      throw new UnauthorizedException('refresh_token is required');
    }

    if (!userName) {
      throw new UnauthorizedException('userName is required');
    }

    const user = await this.userService.findExistUser(userName);

    if (!user) {
      throw new UnauthorizedException('User is not defined');
    }

    return true;
  }
}
