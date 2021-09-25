import updateVisit from 'services/offers/updateVisit';
import getOfferById from 'services/offers/get';


export default async (req, res) => { 
  console.log('req.query.id: ',req.query.id)
  let offer = await getOfferById(req.query.id);
    switch (req.method) {
    
    case 'PUT': {
      try {
        const payload = req.body;
        offer = await updateVisit(offer.airtableId, payload);
        res.status(200).json({ status: 'updated visit', offer });
      } catch (error) {
        res.status(422).json({ status: 'not_updated visit', error });
      }
      break;
    }

    default:
      res.status(400);
  }
};
