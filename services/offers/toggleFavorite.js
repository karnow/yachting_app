import airDB from 'services/airtableClient';

const toggleActive = async (id) => {
  let offer = await airDB('offers')
    .select({ filterByFormula: `id="${id}"` })
    .firstPage();
  if (!offer) return null;

  const currentStatus = offer[0].fields.favorite;

  offer = await airDB('offers').update([
    {
      id: offer[0].id,
      fields: {
        favorite: currentStatus === 'true' ? 'false' : 'true'
      }                              
    }
  ]);

  return offer[0].fields;
};

export default toggleActive;
