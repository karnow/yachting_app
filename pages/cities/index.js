import BaseLayout from 'components/BaseLayout';
import Link from 'next/link';
import getAllCity from 'services/offers/getAllCity';

export const getStaticProps = async () => {
  const cities = await getAllCity();

  return {
    props: {
      cities: cities
    }
  };
};

export default function Home({ cities }) {
  

  return (
    <BaseLayout>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex justify-around w-full mb-4"></div>
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
            Offers from Cities
          </h1>
          <div className="h-1 w-20 bg-indigo-500 rounded mb-8"></div>
          <div>
            {cities.map((city) => (
              <div className="mb-2" key={city}>
                <Link href={`/cities/${city}`}>{city[0].toUpperCase() + city.substring(1)}</Link>
                <hr className="w-80 bg-gray-500 rounded mb-4"></hr>
              </div>
            ))}
          </div>
        </div>
      </section>
    </BaseLayout>
  );
}
