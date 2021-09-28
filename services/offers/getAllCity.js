import airDB from 'services/airtableClient';

const getAllCity = async () => {
  const allOffers = await airDB('offers')
    .select({
      sort: [{ field: 'id', direction: 'desc' }],
      filterByFormula: 'status="active"'
      
    })
    .firstPage();

  const offers = allOffers.map((offer) => offer.fields);
  const locationArray=offers.map((offer)=> offer.location)
  const cities = [...new Set(locationArray)];
  return cities.sort();
};

export default getAllCity;