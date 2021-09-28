import BaseLayout from 'components/BaseLayout';
import OfferItem from 'components/OfferItem';
import getForUser from 'services/offers/getForUser';
import { getSession, session, useSession } from 'next-auth/client';

export const getServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: '/user/signin',
        permanent: false
      }
    };
  }
  const offers = await getForUser(session.user.email);

  return {
    props: {
      offers: offers,
      session: session
    }
  };
};

export default function MyOffers({ offers, session }) {
  // console.log('sesja moja: ',session.user.name)
  // const session = useSession(); 
  // console.log('co z sesja:' ,session[0].user.name)
  return (
    <BaseLayout>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
              My offers - {session.user.name}
            </h1>
            <div className="h-1 w-20 bg-indigo-500 rounded"></div>
          </div>
          <div className="flex flex-wrap -m-4">
            {offers.length === 0 && (
              <div className="w-full text-center bg-yellow-100 py-4">
                You do not have any offers.
              </div>
            )}
            {offers.map((offer) => (
              <OfferItem key={offer.id} offer={offer} />
            ))}
          </div>
        </div>
      </section>
    </BaseLayout>
  );
}
