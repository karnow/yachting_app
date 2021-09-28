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
          <div className="flex justify-around w-full mb-4">Offers from Cities</div>
          <div>
            {cities.map((city) => (
              <div key={city}>
                <Link href={`/cities/${city}`}>{city}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </BaseLayout>
  );
}
