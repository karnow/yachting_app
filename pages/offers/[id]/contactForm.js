import { useRef, useState } from 'react';
import BaseLayout from 'components/BaseLayout';
import { useRouter } from 'next/router';

export default function Contact() {
  const contactForm = useRef();
  const [error, setError] = useState();
  const [confirmation, setConfirmation] = useState();
  const [formProcessing, setFormProcessing] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formProcessing) return;
    setError(null);
    setFormProcessing(true);
    const form = new FormData(contactForm.current);
    const payload = {
      email: form.get('email'),
      message: form.get('message'),
      offerId: router.query.id
    };
    const response = await fetch('/api/users/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();

    if (data.message === true) {
      setConfirmation('You message was send');
      setTimeout(reload, 2000);
    } else {
      const payload = await response.json();
      setFormProcessing(false);
      setError(payload.error);
    }
  };
  function reload() {
    const id = router.query.id;
    router.push(`/offers/${id}`);
  }
  return (
    <BaseLayout>
      <section className="text-gray-600 body-font relative">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              Contact with the author of the offer
            </h1>
          </div>
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <form className="flex flex-wrap -m-2" ref={contactForm} onSubmit={handleSubmit}>
              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="email" className="leading-7 text-sm text-gray-600">
                    Your e-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="message" className="leading-7 text-sm text-gray-600">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
                </div>
              </div>
              <div className="p-2 w-full">
                {!confirmation && (
                  <button
                    disabled={formProcessing}
                    className="disabled:opacity-50 flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                    {formProcessing ? 'Please wait...' : 'Send message'}
                  </button>
                )}
                {error && (
                  <div className="flex justify-center w-full my-5">
                    <span className="bg-red-600 w-full rounded text-white px-3 py-3 text-center">
                      Cannot send: {error}
                    </span>
                  </div>
                )}
                {confirmation && (
                  <div className="flex justify-center w-full my-5">
                    <span className="bg-green-600 w-full rounded px-3 py-3 text-white text-center">
                      {confirmation}
                    </span>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </BaseLayout>
  );
}
