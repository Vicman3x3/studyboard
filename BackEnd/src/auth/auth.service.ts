import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Usuario } from './usuario.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepo: Repository<Usuario>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;

    // Verificar si el usuario ya existe
    const existingUser = await this.usuariosRepo.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear usuario
    const usuario = this.usuariosRepo.create({
      name,
      email,
      passwordHash,
    });

    await this.usuariosRepo.save(usuario);

    // Generar tokens
    const tokens = await this.generateTokens(usuario.id, usuario.email);

    return {
      data: {
        user: this.sanitizeUser(usuario),
        ...tokens,
      },
      message: 'Usuario registrado correctamente',
      statusCode: 201,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Buscar usuario
    const usuario = await this.usuariosRepo.findOne({
      where: { email },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, usuario.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar tokens
    const tokens = await this.generateTokens(usuario.id, usuario.email);

    return {
      data: {
        user: this.sanitizeUser(usuario),
        ...tokens,
      },
      message: 'Inicio de sesión exitoso',
      statusCode: 200,
    };
  }

  async refreshTokens(userId: string, email: string) {
    const tokens = await this.generateTokens(userId, email);

    return {
      data: tokens,
      message: 'Tokens renovados correctamente',
      statusCode: 200,
    };
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES_IN') || '1h',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private sanitizeUser(usuario: Usuario) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...result } = usuario;
    return result;
  }

  async validateUser(userId: string): Promise<Usuario | null> {
    return this.usuariosRepo.findOne({ where: { id: userId } });
  }
}
