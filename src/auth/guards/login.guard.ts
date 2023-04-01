import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AuthService } from '../auth.service';
import { verify } from 'argon2';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private AuthService: AuthService) {}
  async canActivate(
    context: ExecutionContext,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { userName, password } = request.body;
    const user = await this.AuthService.validateUser(userName);

    if (!user) {
      throw new UnauthorizedException(`User is not defined`);
    }
    const isValid = await verify(user.password, password);

    if (!isValid) throw new UnauthorizedException('Invalid password');
    return true;
  }
}
