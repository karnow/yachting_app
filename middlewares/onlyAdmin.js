import { getSession } from 'next-auth/client';

const onlyAdmin = (handler) => {
  return async (req, res) => {
    const session = await getSession({ req });

    if (!session || session.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Please log in as admin to get access.',
      });
    }

    return handler(req, res);
  };
};

export default onlyAdmin;
