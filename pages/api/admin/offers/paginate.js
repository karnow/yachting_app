import paginateOffers from 'services/offers/allForAdmin';
import onlyAdmin from 'middlewares/onlyAdmin';

const handler = async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const { offset } = req.query;
      const offers = await paginateOffers(offset);
      res.status(200).json({
        offers: offers.records.map((offer) => offer.fields),
        offset: offers.offset
      });

      break;
    }
    default:
      res.status(400);
  }
};
export default onlyAdmin(handler);
