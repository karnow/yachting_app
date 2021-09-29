import BaseLayout from 'components/BaseLayout';
import Link from 'next/link';
import getAllUsers from 'services/users/getAllUsers';
import { getSession} from 'next-auth/client';

export const getServerSideProps = async ({req}) => {
    const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: '/user/signin',
        permanent: false
      }
    };
  }
  const usersEmail = await getAllUsers();

  return {
    props: {
        usersEmail: usersEmail
    }
  };
};

export default function Home({ usersEmail }) {
  

  return (
    <BaseLayout>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex justify-around w-full mb-4"></div>
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
            Users list
          </h1>
          <div className="h-1 w-20 bg-indigo-500 rounded mb-8"></div>
          <div>
            {usersEmail.map((email) => (
              <div className="mb-2" key={email}>
                <Link href={`/user/${email}/offers`}>{email}</Link>
                <hr className="w-80 bg-gray-500 rounded mb-4"></hr>
              </div>
            ))}
          </div>
        </div>
      </section>
    </BaseLayout>
  );
}
