import airDB from 'services/airtableClient';

const getForCity = async (location) => {
  const offerss = await airDB('offers')
    .select({
      sort: [{ field: 'id', direction: 'desc' }],
      filterByFormula: `location="${location}"`
    })
    .firstPage();

  const offers = offerss.map((offer) => offer.fields);
  return offers.filter((oferta) => oferta.status === 'active');
};

export default getForCity;
