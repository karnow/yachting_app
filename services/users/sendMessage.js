import Joi from 'joi';
import nodemailer from 'nodemailer';
import get from 'services/offers/get';
// import mailgun from 'mailgun-js';
import mailGun from 'nodemailer-mailgun-transport';

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
  const auth = {
    auth: {
      api_key: process.env.API_KEY_MAILGUN,
      domain: process.env.DOMAIN_MAILGUN
    }
  };

  const mailOptions = {
    from: `${senderEmail}`,
    to: `${ownerEmail}`,
    subject: `${offerTitle}`,
    html: `Hey! <br/>Wiadomość z Yachting APP od użytkownika: ${senderEmail}
      <br/> Offer : ${offerTitle}
         <br/> Message : ${senderMessage}
    `
  };

  async function wrapedSendMail(mailOptions) {
    return new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport(mailGun(auth));

      transporter.sendMail(mailOptions, function (error, data) {
        if (error) {
          console.log('error is ' + error);
          resolve(false); // or use rejcet(false) but then you will have to handle errors
        } else {
          console.log('Email sent: ' + data);
          resolve(true);
        }
      });
    });
  }

  let result = await wrapedSendMail(mailOptions);
  console.log('wynik:', result);
  return result;

  //konfiguracja pod mailgun-js
  // const DOMAIN = '';
  // const mg = mailgun({apiKey: '', domain: DOMAIN});
  // const data = {
  // 	from: 'Excited User <me@samples.mailgun.org>',
  // 	to: 'karol-nowakowski@o2.pl',
  // 	subject: 'Hello',
  // 	text: 'Testing some Mailgun awesomness!'
  // };

  // mg.messages().send(data, function (err, info) {
  // 	if (err) {
  //           console.log(`Error z Mailguna: ${err}`);
  //         } else {
  //           console.log(`Response: ${info}`, 'email zostal wyslany');

  //         }
  // });
};

export default sendMessage;
