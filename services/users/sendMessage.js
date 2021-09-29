import Joi from 'joi';
import nodemailer from 'nodemailer';
import get from 'services/offers/get';


const schema = Joi.object({
  email: Joi.string().email().required(),
  message: Joi.string().required(),
  offerId: Joi.string().required()
});

const sendMessage = async (payload) => {
  const { email, message, offerId } = await schema.validateAsync(payload);
  const offer = await get(offerId);

  const senderEmail = email;
  const senderMessage = message;
  const offerTitle = offer.title;
  const ownerEmail = offer?.['email (from users)'][0];

  
  if (!ownerEmail) {
    return null;
  }

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
    to: `${ownerEmail}`,
    subject: 'Change your password',
    html: `
      Hey! <br/>Wiadomość z Yachting APP od użytkownika: ${senderEmail}
      <br/> Offer : ${offerTitle}
      <br/> Message : ${senderMessage}
    `
  });

  if (process.env.NODE_ENV !== 'production') {
    console.log('E-mail sent, Preview URL: ' + nodemailer.getTestMessageUrl(response));
  }

  return offer;
};

export default sendMessage;
