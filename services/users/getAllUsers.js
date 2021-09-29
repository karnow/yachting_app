import airDB from 'services/airtableClient';

const getAllUsers = async () => {
  const allUsers = await airDB('users')
    .select({
      filterByFormula: 'role="regular"'
    })
    .firstPage();

  const users = allUsers.map((user) => user.fields);
  const emailUsers = users.map((user) => user.email);
  return emailUsers.sort();
};

export default getAllUsers;
