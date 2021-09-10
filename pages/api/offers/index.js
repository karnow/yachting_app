import getRecentOffers from 'services/offers/getRecent';
import createOffer from 'services/offers/create';
import { getSession } from 'next-auth/client';

export default async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const offers = await getRecentOffers(8);
      res.status(200).json(offers);

      break;
    }
    case 'POST': {
      try {
        const session = await getSession({ req });
        console.log('session wyglad:', session);
        if (!session) {
          return res.ststus(401).json({ error: 'not_authorized' });
        }
        const payload = req.body;
        const userId = session.user.id;
        console.log('czy to userid', userId)
        console.log('payload on backend', payload);
        const offer = await createOffer(payload, userId);
        res.status(200).json({ status: 'created', offer });
      } catch (err) {
        res.status(422).json({ status: 'not:created', err });
      }
      break;
    }
    default:
      res.status(400);
  }
};
