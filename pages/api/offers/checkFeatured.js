import checkFeatured from 'services/offers/checkFeatured';

export default async (req, res) => {
  switch (req.method) {
    case 'GET': {
      try {
        const offer = await checkFeatured(req.query.id);

        res.status(200).json({ status: 'featured', offer });
        console.log('oplacona oferta', offer);
      } catch (error) {
        res.status(422).json({ status: 'not_featured', error });
      }

      break;
    }
    default:
      res.status(400);
  }
};
