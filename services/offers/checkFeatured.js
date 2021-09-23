import airDB from 'services/airtableClient';

const checkFeatured = async (id) => {
  const [offer] = await airDB('offers')
    .select({
        filterByFormula: `id="${id}"`
    })
    .firstPage();
    console.log('oferta oplacona czy nie:',offer.fields.stripeCheckoutStatus)
  if (!offer.fields.stripeCheckoutStatus) {
    return false;
  }
  return true;
};

export default checkFeatured;
