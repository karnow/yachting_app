const isAuthorizedNotOwner = (session) => {
  if (session) return true;

  return false;
};

export default isAuthorizedNotOwner;
