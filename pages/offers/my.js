import BaseLayout from 'components/BaseLayout';
import OfferItem from 'components/OfferItem';
import getForUser from 'services/offers/getForUser';
import { getSession } from 'next-auth/client';

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
      offers: offers
    }
  };
};

export default function MyOffers({ offers }) {
  return (
    <BaseLayout>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
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
