
import { getSession } from 'next-auth/client';

const onlyAuth = (handler) => {
  return async (req, res) => {
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'Please log in to get access.',
      });
    }

    return handler(req, res);
  };
};

export default onlyAuth;
