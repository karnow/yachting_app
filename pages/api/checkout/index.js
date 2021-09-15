import createCheckout from 'services/checkout/create';

export default async (req, res) => {
  switch (req.method) {
    case 'POST': {
      try {
        const orderItem = req.body;
        console.log('to ja odreritem',orderItem);
        const checkout = await createCheckout(orderItem);
        console.log('to jest checkout',checkout)
        res.status(200).json({ status: 'created', checkout });
      } catch (error) {
        res.status(422).json({ status: 'not_created', error });
      }
      break;
    }

    default:
      res.status(400);
  }
};
