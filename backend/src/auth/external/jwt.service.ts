import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtService extends PassportStrategy(Strategy) {
constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretshit',
    });
  }
    async validate(payload: any) {
    // This is what gets attached to 'req.user'
    return { userId: payload.sub, email: payload.email, role: payload.role };
    }
}