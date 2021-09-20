import airDB from 'services/airtableClient';
import Joi from 'joi';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const schema = Joi.object({
  email: Joi.string().email().required()
});

const sendResetToken = async (payload) => {
  const { email } = await schema.validateAsync(payload);

  let [user] = await airDB('users')
    .select({ filterByFormula: `email="${email}"` })
    .firstPage();

  if (!user) {
    return null;
  }

  const resetToken = crypto.randomBytes(22).toString('hex');

  user = await airDB('users').update([
    {
      id: user.id,
      fields: { resetToken }
    }
  ]);

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'zena.zboncak37@ethereal.email',
      pass: 'geQxxbKdhpZguSjxec'
    }
  });

  const response = await transporter.sendMail({
    from: 'sender@server.com',
    to: 'receiver@sender.com',
    subject: 'Change your password',
    html: `
      Hey! <br/>Please change your password here:
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/user/updatePassword?token=${resetToken}">
        ${process.env.NEXT_PUBLIC_BASE_URL}/user/updatePassword?token=${resetToken}
      </a>
    `
  });

  if (process.env.NODE_ENV !== 'production') {
    console.log('E-mail sent, Preview URL: ' + nodemailer.getTestMessageUrl(response));
  }

  return resetToken;
};

export default sendResetToken;
