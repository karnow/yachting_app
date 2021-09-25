import airDB from 'services/airtableClient';




const update = async (airtableId, payload) => {
  
  const offer = await airDB('offers').update([
    {
      id: airtableId,
      fields: { ...payload }
    }
  ]);

  return offer;
};

export default update;