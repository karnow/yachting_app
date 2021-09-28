import BaseLayout from 'components/BaseLayout';
import getRecentOffers from 'services/offers/getRecent';
import { useRouter } from 'next/router';
import getForCity from 'services/offers/getForCity';
import OfferItem from 'components/OfferItem/index';

export const getStaticPaths = async () => {
  const offers = await getRecentOffers(8);

  return {
    paths: offers.map((offer) => ({ params: { location: offer.location } })),
    fallback: true
  };
};
export const getStaticProps = async ({ params }) => {
  const offers = await getForCity(params.location);

  return {
    revalidate: 30,
    props: {
      offers,
      location: params.location
    }
  };
};

export default function OfferPage({ offers, location }) {
  const router = useRouter();
 

  if (router.isFallback) {
    return (
      <BaseLayout>
        <div>Loading...</div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
              offers from city - {location[0].toUpperCase()+location.substring(1)}
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
