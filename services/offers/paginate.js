export default async (offset, category) => {
  console.log('tu paginate service i jego offset: ', offset);
  let apiUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE}/offers?pageSize=4&view=onlyActiv`;
  if (offset) {
    apiUrl += `&offset=${offset}`;
  }
  if (category) {
    apiUrl += '&' + encodeURI(`filterByFormula=(category="${category}")`);
  }

  const response = await fetch(apiUrl, {
    headers: { Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}` }
  });

  const records = await response.json();

  if (!records.offset) {
    records.offset = null;
  }
  return records;
};
