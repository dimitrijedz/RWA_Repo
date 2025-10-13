import { Injectable, UnauthorizedException } from '@nestjs/common';
        import { UsersService } from '../users/users.service';
        import { JwtService } from '@nestjs/jwt';
        import * as bcrypt from 'bcrypt';
        import { User } from '../entities/user.entity';

        @Injectable()
        export class AuthService {
          constructor(
            private usersService: UsersService,
            private jwtService: JwtService,
          ) {}

          async validateUser(email: string, pass: string): Promise<any> {
            const user = await this.usersService.findOne(email);
            if (user && user.password && (await bcrypt.compare(pass, user.password))) {
              const { password, ...result } = user;
              return result;
            }
            return null;
          }

          async login(user: any) {
            const payload = { email: user.email, sub: user.id, username: user.username };
            return {
              access_token: this.jwtService.sign(payload),
              user: payload,
            };
          }

          async register(email: string, password_raw: string, username?: string): Promise<User> {
            const existingUser = await this.usersService.findOne(email);
            if (existingUser) {
              throw new UnauthorizedException('User with this email already exists');
            }
            return this.usersService.create(email, password_raw, username);
          }
        }