import airDB from 'services/airtableClient';
import Joi from 'joi';
import crypto from 'crypto';

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const authorize = async (payload) => {
  const { email, password } = await schema.validateAsync(payload);

  const [user] = await airDB('users')
    .select({ filterByFormula: `email="${email}"` })
    .firstPage();
    
    if (!user) {
      return null;
    }
  console.log('co zwraca airtable dla usera:',user);
    
  const passwordHash = crypto
    .pbkdf2Sync(password, user.fields.passwordSalt, 1000, 64, `sha512`)
    .toString(`hex`);

  if (passwordHash !== user.fields.passwordHash) {
    return null;
  }

  return {
    id: user.id,
    email: user.fields.email,
    fullName: user.fields.fullName,
    role: user.fields.role
  };
};

export default authorize;
