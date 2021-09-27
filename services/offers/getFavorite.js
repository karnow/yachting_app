import airDB from 'services/airtableClient';

const getFavorite = async () => {
  const offers = await airDB('offers')
    .select({
      view: 'favorite',
      
    })
    .firstPage();

  return offers.map((offer) => offer.fields);
};

export default getFavorite;
