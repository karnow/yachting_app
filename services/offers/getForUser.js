import airDB from 'services/airtableClient';


const getForUser = async (email) => {
    console.log('email w zapytaniu:',email)
    const offers = await airDB('offers')
      .select({
        sort: [{ field: 'id', direction: 'desc' }],
        filterByFormula: `users="${email}"`
      })
      .firstPage();
  
    const offersByEmail =offers.map((offer) => offer.fields);
    return offersByEmail.filter((offer)=> offer.status === 'active');
  };
  
  export default getForUser;
  