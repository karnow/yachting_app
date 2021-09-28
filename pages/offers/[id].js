import BaseLayout from 'components/BaseLayout';
import getRecentOffers from 'services/offers/getRecent';
import { useEffect, useState } from 'react';
import getOffer from 'services/offers/get';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import isAuthorized from 'services/offers/isAuthorized';
import isAuthorizedNotOwner from 'services/offers/isAuthorizedNotOwner';
import classNames from 'classnames';
import Link from 'next/link';
import Image from 'next/image';

export const getStaticPaths = async () => {
  const offers = await getRecentOffers(8);

  return {
    paths: offers.map((offer) => ({ params: { id: String(offer.id) } })),
    fallback: true
  };
};
export const getStaticProps = async ({ params }) => {
  const offer = await getOffer(params.id);

  return {
    revalidate: 30,
    props: {
      offer,
      metaTitle: offer.title,
      metaDescription: offer.description
    }
  };
};

export default function OfferPage({ offer }) {
  const [currentFavorite, setOffer] = useState(offer.favorite);
  const router = useRouter();
  const [session] = useSession();

  const visitsCounter = async (offerVisitCurrent) => {
    const counter = offerVisitCurrent + 1;
    const payload = {
      visit: counter
    };
    const response = await fetch(`/api/offers/${offer.id}/visitUpdate`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      console.log('visit is upgrade');
      const payload = await response.json();
    } else {
      const payload = await response.json();
      console.log(payload.error?.details[0]?.message);
    }
  };

  useEffect(() => {
    visitsCounter(offer.visit);
  }, []);

  const toggleFavorite = async (id) => {
    const response = await fetch(`/api/offers/${id}/toggleFavorite`, { method: 'PUT' });
    if (response.ok) {
      const { offer: updatedOffer } = await response.json();

      if (offer.id === updatedOffer.id) {
        setOffer(updatedOffer.favorite);

        return offer;
      }
    } else {
      const payload = await response.json();
      console.log(payload.error?.details[0]?.message);
    }
  };

  if (router.isFallback) {
    return (
      <BaseLayout>
        <div>Loading...</div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <section className="text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">
                {offer.category}
              </h2>
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">
                {offer.title}
              </h1>
              <div className="flex mb-4">
                <p className="flex-grow text-indigo-500 border-b-2 border-indigo-500 py-2 text-lg px-1">
                  Description
                </p>
              </div>
              <p className="leading-relaxed mb-4">{offer.description}</p>
              <div className="flex border-t border-gray-200 py-2">
                <span className="text-gray-500">Location</span>
                <span className="ml-auto text-gray-900">
                <p>
                <Link href={`/cities/${offer.location}`}>{offer.location[0].toUpperCase()+offer.location.substring(1)}</Link>
              </p></span>
              </div>
              <div className="flex border-t border-gray-200 py-2">
                <span className="text-gray-500">Price</span>
                <span className="ml-auto text-gray-900">
                  {offer.price.toLocaleString('pl-PL', {
                    style: 'currency',
                    currency: 'PLN'
                  })}
                </span>
              </div>
              <div className="flex">
                <span className="title-font font-medium text-2xl text-gray-900">
                  {offer.mobile}
                </span>
                {isAuthorizedNotOwner(session) && (
                  <button
                    onClick={() => toggleFavorite(offer.id)}
                    className={classNames(
                      'rounded-full w-10 h-10 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4"',
                      {
                        'bg-gray-200': currentFavorite === 'false',
                        'bg-gray-800': currentFavorite === 'true'
                      }
                    )}>
                    <svg
                      fill="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-5 h-5"
                      viewBox="0 0 24 24">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                    </svg>
                  </button>
                )}
              </div>
              <span>{`visit ${offer.visit}`}</span>
            </div>
            {offer.imageUrl && (
              <div
                className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
                src="https://dummyimage.com/400x400">
                <Image src={offer.imageUrl} width={800} height={800} className="rounded" />
              </div>
            )}

            {isAuthorized(offer, session) && (
              <p>
                <Link href={`/offers/${offer.id}/edit`}>Edit this offer</Link>
              </p>
            )}

            {isAuthorized(offer, session) && !offer.stripeCheckoutStatus && (
              <p>
                <Link href={`/offers/${offer.id}/highlight`}>
                  / Pay for and highlight the offer
                </Link>
              </p>
            )}
          </div>
        </div>
      </section>
    </BaseLayout>
  );
}
