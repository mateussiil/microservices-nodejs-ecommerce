// see https://www.youtube.com/watch?v=-rcRf7yswfM

import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import logger from '../../lib/log';

export type EmailAdapterErrorReturn = { error: string }
export type EmailAdapterSuccessReturn = { accepted: (string | Mail.Address)[], messageId: string }
export type EmailAdapterReturn = EmailAdapterErrorReturn | EmailAdapterSuccessReturn

type sendProps = {
  to: string,
  subject: string,
  text?: string,
  html?: string,
}

export class EmailAdapter {
  private library: 'nodemailer' | 'mailgun-js' | 'sendgrid-nodejs'

  constructor() {
    this.library = 'nodemailer'
  }

  async send({ to, subject, text, html }: sendProps) {
    if (this.library === 'nodemailer') {
      const mail: Promise<EmailAdapterReturn> = new Promise<EmailAdapterReturn>(async (resolve, reject) => {
        let transporter;
        try {
          transporter = nodemailer.createTransport({
            service: process.env.SERVICE,
            host: process.env.EMAIL_HOST,
            auth: {
              user: process.env.EMAIL_USER, // generated ethereal user
              pass: process.env.EMAIL_PASS, // generated ethereal password
            },
          });
        }catch (err){
          logger.error('error in create transporter', err);

          return reject({ err });
        }

        try{
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            html
          };

          await transporter.verify()

          transporter.sendMail(mailOptions, (err, info) => {

            if (err) return reject({ err });
            const { accepted, messageId } = info

            resolve({ accepted, messageId })
          })
        } catch (err) {
          return reject({ err });
        }
      })

      return mail
    }
  }
}