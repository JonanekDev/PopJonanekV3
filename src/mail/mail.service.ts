import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class MailService {
  getTransporter() {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 465,
      secure: Boolean(process.env.SMTP_TLS) || true,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async getTemplate(template: string) {
    const templateDir = join(__dirname, 'mails');
    const path = `${templateDir}/${template}.html`;

    const html = fs.promises.readFile(path, 'utf8');

    return html;
  }
}
