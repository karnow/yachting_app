import Joi from 'joi';
import airDB from 'services/airtableClient';

const schema = Joi.object({
  title: Joi.string().required(),
  category: Joi.string().valid('rent', 'sale').required(),
  mobile: Joi.string().required(),
  description: Joi.string().required(),
  location: Joi.string().required(),
  price: Joi.number().greater(0).required()
});

const create = async (payload, userId) => {
  console.log('oferta dotarla do backendu',payload);
  const validatedOffer = await schema.validateAsync(payload);
  console.log('oferta zwalidatowana',validatedOffer);
  console.log('id usera dotarlo na backend:',userId);

  const offer = await airDB('offers').create([
    {
      fields: {
        ...validatedOffer,
        users:[userId],
        status: 'inactive'
      }
    }
  ]);

  return offer;
};

export default create;
