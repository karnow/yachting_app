import toggleFavorite from 'services/offers/toggleFavorite';
import { getSession } from 'next-auth/client';

export default async (req, res) => {
  switch (req.method) {
    case 'PUT': {
      try {
        const session = await getSession({ req });
        if (!session) {
          return res.status(401).json({ error: 'not_authorized' });
        }
        const offer = await toggleFavorite(req.query.id);
        res.status(200).json({ status: 'updated favorite', offer });
      } catch (error) {
        res.status(422).json({ status: 'not_updated favorite', error });
      }
      break;
    }

    default:
      res.status(400);
  }
};
