import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mailer/mail.service';
import { PrismaService } from 'auth/prismaService/prisma.service';
import { SecureAuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { TokenPayload } from 'auth/interfaces/auth.interface';
import { OAuthProfile } from 'auth/interfaces/user.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';


// Assuming you already have the PrismaServiceMock class defined
class PrismaServiceMock {
    user = {
      findUnique: jest.fn(),
      findFirst: jest.fn(), // No need to use mockResolvedValue here
      update: jest.fn(),
      create: jest.fn(),
    };
  }
  
  const profile: OAuthProfile = {
    id: 1, // Assuming this is the primary key of the `User` model
    // Add other necessary properties
  };
  
  
  class JwtServiceMock {
    sign = jest.fn();
  }
  
  class MailServiceMock {
    sendEmail = jest.fn();
  }

  const mailerServiceMock = {
    sendMail: jest.fn().mockResolvedValue(undefined), // Use jest.fn() to create a mock function
  };

describe('SecureAuthService', () => {
    let service: SecureAuthService;
    let prismaServiceMock: PrismaServiceMock;
    let jwtService: JwtService;
    let mailService: MailService;
    let mailerService: MailerService;
    beforeEach(async () => {
      prismaServiceMock = new PrismaServiceMock();
      jwtService = new JwtService({ secret: 'test_secret_key' }); // Using a test secret key for simplicity
      mailService = new MailService(mailerService); // Assuming MailService is already tested separately
  
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          SecureAuthService,
          { provide: PrismaService, useValue: prismaServiceMock },
          { provide: JwtService, useValue: jwtService },
          { provide: MailService, useValue: mailService },
          // Other dependencies...
        ],
      }).compile();
  
      service = module.get<SecureAuthService>(SecureAuthService);
    });

  it('should validate token payload', async () => {
    // Arrange
    const user = { id: 1, email: 'user@example.com', password: 'hashed_password' };
    prismaServiceMock.user.findFirst.mockResolvedValue(user);

    const payload: TokenPayload = { email: 'user@example.com', sub: 1 };

    // Act
    const result = await service.validateTokenPayload(payload);

    // Assert
    expect(result).toEqual(user);
    expect(prismaServiceMock.user.findFirst).toHaveBeenCalledWith({ where: { id: payload.sub } });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
//   it('should find or create user from OAuth profile', async () => {
//     // Arrange
//     const userProfile: OAuthProfile = { id: 'test_user_id', name: 'Test User' };
//     const existingUser = { id: 1, email: 'user@example.com', password: 'hashed_password' };
//     prismaServiceMock.user.findUnique.mockResolvedValue(existingUser);

//     // Act
//     const result = await service.findOrCreateUserFromOAuthProfile(userProfile);

//     // Assert
//     expect(result).toEqual(existingUser);
//     expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({ where: { id: userProfile.id } });
//   });

  it('should log in a user and return an access token', async () => {
    // Arrange
    const email = 'user@example.com';
    const password = 'test_password';
    const user = { id: 1, email: email, password: 'hashed_password' };
    prismaServiceMock.user.findFirst.mockResolvedValue(user);
    const expectedAccessToken = 'test_access_token';

    // Mock the sign method of JwtService to return a fixed access token for simplicity
    jest.spyOn(jwtService, 'sign').mockReturnValue(expectedAccessToken);

    // Act
    const result = await service.login(email, password);

    // Assert
    expect(result).toEqual({ access_token: expectedAccessToken });
    expect(prismaServiceMock.user.findFirst).toHaveBeenCalledWith({ where: { email, deletedAt: null } });
    expect(jwtService.sign).toHaveBeenCalledWith({ email, sub: user.id });
  });

  it('should sign up a new user', async () => {
    // Arrange
    const email = 'new_user@example.com';
    const password = 'test_password';
    const newUser = { id: 2, email: email, password: 'hashed_password' };
    prismaServiceMock.user.findFirst.mockResolvedValue(undefined);
    prismaServiceMock.user.create.mockResolvedValue(newUser);

    // Act
    const result = await service.signup(email, password);

    // Assert
    expect(result).toEqual(newUser);
    expect(prismaServiceMock.user.findFirst).toHaveBeenCalledWith({ where: { email, deletedAt: null } });
    expect(prismaServiceMock.user.create).toHaveBeenCalledWith({ data: { email, password: expect.any(String) } });
  });

  it('should reset the password of a user', async () => {
    // Arrange
    const email = 'user@example.com';
    const newPassword = 'new_test_password';
    const user = { id: 1, email: email, password: 'hashed_password' };
    prismaServiceMock.user.findFirst.mockResolvedValue(user);
    const updatedUser = { ...user, password: 'new_hashed_password' };
    prismaServiceMock.user.update.mockResolvedValue(updatedUser);

    // Act
    const result = await service.resetPassword(user.id, user.password, newPassword);

    // Assert
    expect(result).toEqual(updatedUser);
    expect(prismaServiceMock.user.findFirst).toHaveBeenCalledWith({ where: { email, deletedAt: null } });
    expect(prismaServiceMock.user.update).toHaveBeenCalledWith({ where: { id: user.id }, data: { password: expect.any(String) } });
  });

  it('should initiate "Forgot Password" flow for a user', async () => {
    // Arrange
    const email = 'user@example.com';
    const resetToken = 'test_reset_token';
    const resetTokenExpiration = Date.now() + 86400000; // One day from now
    jest.spyOn(service, 'generateRandomString').mockReturnValue(resetToken);
    jest.spyOn(service, 'storeResetToken');

    // Act
    await service.forgotPassword(email);

    // Assert
    expect(service.generateRandomString).toHaveBeenCalledWith(32);
    expect(service.storeResetToken).toHaveBeenCalledWith(email, resetToken, resetTokenExpiration);
    expect(mailService.sendEmail).toHaveBeenCalled(); // Assuming mailService.sendEmail is already tested
  });

  it('should send a reset password email', async () => {
    // Arrange
    const email = 'user@example.com';
    const resetUrl = 'http://example.com/reset-password?token=test_token';
    const subject = 'Password Reset';
    const body = `Click on the following link to reset your password: ${resetUrl}`;
    const template = '../templates/reset';
    const context = { url: resetUrl };
    jest.spyOn(mailService, 'sendEmail');

    // Act
    await service.sendResetPasswordEmail(email, resetUrl);

    // Assert
    expect(mailService.sendEmail).toHaveBeenCalledWith(email, subject, template, context);
  });

  it('should validate token payload and retrieve user', async () => {
    // Arrange
    const userId = 1;
    const email = 'user@example.com';
    const tokenPayload: TokenPayload = { sub: userId, email };
    const user = { id: userId, email: email, password: 'hashed_password' };
    prismaServiceMock.user.findUnique.mockResolvedValue(user);

    // Act
    const result = await service.validateTokenPayload(tokenPayload);

    // Assert
    expect(result).toEqual(user);
    expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
  });

  it('should throw UnauthorizedException if token payload is invalid', async () => {
    // Arrange
    const tokenPayload: TokenPayload = { sub: 1, email: 'user@example.com' };
    prismaServiceMock.user.findUnique.mockResolvedValue(null);

    // Act & Assert
    await expect(service.validateTokenPayload(tokenPayload)).rejects.toThrow(UnauthorizedException);
    expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({ where: { id: tokenPayload.sub } });
  });

  it('should return true if password meets required strength criteria', () => {
    // Arrange
    const strongPassword = 'StrongPassword123!';

    // Act
    const result = service.isPasswordStrong(strongPassword);

    // Assert
    expect(result).toBe(true);
  });

  it('should return false if password does not meet required strength criteria', () => {
    // Arrange
    const weakPassword = 'weak';

    // Act
    const result = service.isPasswordStrong(weakPassword);

    // Assert
    expect(result).toBe(false);
  });

  it('should throw UnauthorizedException for incorrect email/password combination during login', async () => {
    // Arrange
    const email = 'user@example.com';
    const incorrectPassword = 'incorrect_password';
    const user = { id: 1, email: email, password: 'hashed_password' };
    prismaServiceMock.user.findFirst.mockResolvedValue(user);

    // Act & Assert
    await expect(service.login(email, incorrectPassword)).rejects.toThrow(UnauthorizedException);
    expect(prismaServiceMock.user.findFirst).toHaveBeenCalledWith({ where: { email, deletedAt: null } });
    // Should not call jwtService.sign since the password is incorrect
    expect(jwtService.sign).not.toHaveBeenCalled();
  });

  
it('should find or create a user from OAuth profile', async () => {
    // Arrange
    const existingUser = { id: 1, email: 'user@example.com', /* other properties */ };
    prismaServiceMock.user.findUnique.mockResolvedValue(existingUser);
  
    // Act
    const result = await service.findOrCreateUserFromOAuthProfile(profile);
  
    // Assert
    expect(result).toEqual(existingUser);
    expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: profile.id },
    });

  it('should throw NotFoundException if user is not found from OAuth profile', async () => {
    // Arrange
    const oAuthProfile: OAuthProfile = { id: 1 };
    prismaServiceMock.user.findUnique.mockResolvedValue(null);

    // Act & Assert
    await expect(service.findOrCreateUserFromOAuthProfile(oAuthProfile)).rejects.toThrow(NotFoundException);
    expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({ where: { id: oAuthProfile.id } });
  });

  it('should register a new user on signup', async () => {
    // Arrange
    const email = 'user@example.com';
    const password = 'StrongPassword123!';
    prismaServiceMock.user.findFirst.mockResolvedValue(null);
    const newUser = { id: 1, email: email, password: 'hashed_password' };
    prismaServiceMock.user.create.mockResolvedValue(newUser);

    // Act
    const result = await service.signup(email, password);

    // Assert
    expect(result).toEqual(newUser);
    expect(prismaServiceMock.user.findFirst).toHaveBeenCalledWith({ where: { email, deletedAt: null } });
    expect(prismaServiceMock.user.create).toHaveBeenCalledWith({
      data: {
        email: email,
        password: expect.any(String), // Since bcrypt.hash returns a string, we can use expect.any(String) to validate it.
      },
    });
  });

  it('should throw UnauthorizedException if email is already associated with an existing user on signup', async () => {
    // Arrange
    const email = 'user@example.com';
    const password = 'StrongPassword123!';
    const existingUser = { id: 1, email: email, password: 'hashed_password' };
    prismaServiceMock.user.findFirst.mockResolvedValue(existingUser);

    // Act & Assert
    await expect(service.signup(email, password)).rejects.toThrow(UnauthorizedException);
    expect(prismaServiceMock.user.findFirst).toHaveBeenCalledWith({ where: { email, deletedAt: null } });
    // Should not call prismaServiceMock.user.create since the email is already associated with an existing user
    expect(prismaServiceMock.user.create).not.toHaveBeenCalled();
  });

  it('should reset password for a user', async () => {
    // Arrange
    const email = 'user@example.com';
    const newPassword = 'NewPassword123!';
    const user = { id: 1, email: email, password: 'hashed_password' };
    prismaServiceMock.user.findFirst.mockResolvedValue(user);
    const saltRounds = 10;
    const hashedPassword = 'new_hashed_password';
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve(hashedPassword));

    const updatedUser = { ...user, password: hashedPassword };
    prismaServiceMock.user.update.mockResolvedValue(updatedUser);

    // Act
    const result = await service.resetPassword(user.id,user.password, newPassword);

    // Assert
    expect(result).toEqual(updatedUser);
    expect(prismaServiceMock.user.findFirst).toHaveBeenCalledWith({ where: { email, deletedAt: null } });
    expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, saltRounds);
    expect(prismaServiceMock.user.update).toHaveBeenCalledWith({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
  });
  
  it('should throw UnauthorizedException if user is not found on password reset', async () => {
    // Arrange
    const email = 'user@example.com';

    const user = { id: 1, email: email, password: 'hashed_password' };
    const newPassword = 'NewPassword123!';
    prismaServiceMock.user.findFirst.mockResolvedValue(null);

    // Act & Assert
    await expect(service.resetPassword(user.id, user.password, newPassword)).rejects.toThrow(UnauthorizedException);
    expect(prismaServiceMock.user.findFirst).toHaveBeenCalledWith({ where: { email, deletedAt: null } });
    // Should not call prismaServiceMock.user.update since the user is not found
    expect(prismaServiceMock.user.update).not.toHaveBeenCalled();
  });
})

});

