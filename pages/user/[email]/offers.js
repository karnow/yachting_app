import BaseLayout from 'components/BaseLayout';
import OfferItem from 'components/OfferItem/index';
import { getSession } from 'next-auth/client';
import getForUser from 'services/offers/getForUser';
import { useRouter } from 'next/router';
import isAuthorizedNotOwner from 'services/offers/isAuthorizedNotOwner';

export const getServerSideProps = async ({ req, query }) => {
  const session = await getSession({ req });
  console.log('zapytanie user/offers:', query);

  if (!isAuthorizedNotOwner(session)) {
    return {
      notFound: true
    };
  }

  const offers = await getForUser(query.email);

  return {
    props: {
      offers: offers,
      session: session
    }
  };
};

export default function UserOffers({ offers, session }) {
  const router = useRouter();

  return (
    <BaseLayout>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
              User offers : {router.query.email}
            </h1>
            <div className="h-1 w-20 bg-indigo-500 rounded mb-8"></div>
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
