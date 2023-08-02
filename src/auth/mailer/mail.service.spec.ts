import { MailerService } from '@nestjs-modules/mailer';
import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';

// Mock the MailerService
const mailerServiceMock = {
  sendMail: jest.fn().mockResolvedValue(undefined), // Use jest.fn() to create a mock function
};

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        // Provide the mocked MailerService
        {
          provide: MailerService,
          useValue: mailerServiceMock,
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send an email with the specified details', async () => {
    // Arrange
    const to = 'recipient@example.com';
    const subject = 'Test Email';
    const template = 'test-template';
    const context = {
      name: 'John Doe',
    };

    // Act
    await service.sendEmail(to, subject, template, context);

    // Assert
    expect(mailerServiceMock.sendMail).toHaveBeenCalledTimes(1);
    expect(mailerServiceMock.sendMail).toHaveBeenCalledWith({
      to,
      subject,
      template,
      context,
    });
  });

  it('should send an email without context if not provided', async () => {
    // Arrange
    const to = 'recipient@example.com';
    const subject = 'Test Email';
    const template = 'test-template';

    // Act
    await service.sendEmail(to, subject, template);

    // Assert
    expect(mailerServiceMock.sendMail).toHaveBeenCalledTimes(1);
    expect(mailerServiceMock.sendMail).toHaveBeenCalledWith({
      to,
      subject,
      template,
    });
  });
});
