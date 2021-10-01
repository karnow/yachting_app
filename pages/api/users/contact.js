import sendMessage from 'services/users/sendMessage';

export default async (req, res) => {
  const payload = req.body;

  switch (req.method) {
    case 'POST': {
      try {
        const result = await sendMessage(payload);

        res.status(200).json({ status: 'ok', message: result });
      } catch (error) {
        res.status(422).json({ status: 'error', error: error.message });
      }
      break;
    }

    default:
      res.status(400);
  }
};
