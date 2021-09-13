import airDB from 'services/airtableClient';

const getforUser = async (email) =>{
    const offers= await airDB('offers').select({sort: [{ field:'id', direction: 'desc'}],filterByFormula: `email="${email}"`
}).firstPage();

return offers.map((offer)=>offer.fields);
};

export default getforUser;
