import classNames from 'classnames';
import {  useCallback, useEffect, useState } from 'react';
import { useAuth } from '../provider/AuthProvider';
import { useNavigate } from 'react-router-dom';

interface Price {
  interval:any
  id:string
  unitAmount:number
}

interface PriceInterval { }

interface Product { }

interface Subscription { 
  priceId:string
}

const CheckIcon = (props:any) => {
  return (
    <div {...props}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" height="24" viewBox="0 0 24 24">
          <path fill="currentColor" d="m10 16.4l-4-4L7.4 11l2.6 2.6L16.6 7L18 8.4l-8 8Z" />
      </svg>
    </div>
  )
}

const PriceComponent = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [subscription, setSubscription] = useState<Subscription>();
  const [products, setProducts] = useState<any[]>([]);

  const [billingInterval, setBillingInterval] =
    useState<PriceInterval>('month');

    useEffect(() => {
      (async () => {
        const res = await fetch('http://localhost:3002/products');

        const data = await res.json();

        if (data.products) {
          setProducts(data.products);
        }

      })()
    }, []);

  // useEffect(() => {
  //   (async () => {
  //     if (status === 'authenticated') {
  //       const res = await fetch('/api/user/subscription');

  //       const data = await res.json();

  //       if (data.subscription) {
  //         setSubscription(data.subscription);
  //       }
  //     }
  //   })();
  // }, [status]);

  const handlePricingClick = async (priceId: string) => { 
      if (!isAuthenticated) {
        return navigate('/signin');
      }
    };

  // const handlePricingClick = useCallback(
  //   async (priceId: string) => {
  //     if (status !== 'authenticated') {
  //       return router.push('/api/auth/signin');
  //     }

  //     if (subscription) {
  //       return router.push('/account');
  //     }

  //     const res = await fetch('/api/stripe/create-checkout-session', {
  //       method: 'POST',
  //       headers: {
  //         'content-type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         price: priceId,
  //       }),
  //     });

  //     const data = await res.json();

  //     const stripe = await getStripe();

  //     stripe?.redirectToCheckout({ sessionId: data.sessionId });
  //   },
  //   [status, router, subscription]
  // );

  return (
    <>
      <section className="bg-white">
        <div className="px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center">
            <h1 className="text-6xl font-extrabold text-gray-800 sm:text-center">
              Pricing Plans
            </h1>
            <p className="mt-5 text-xl text-gray-500 sm:text-center">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
            </p>
            <div className="relative self-center mt-6 bg-gray-100 rounded-lg p-0.5 flex sm:mt-8">
              <button
                onClick={() => setBillingInterval('month')}
                type="button"
                className={classNames(
                  'relative w-1/2  py-2 text-sm font-medium text-gray-700 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:z-10 sm:w-auto sm:px-8 rounded-lg',
                  {
                    'bg-white border-gray-200 shadow-sm rounded-md text-gray-900':
                      billingInterval === 'month',
                    'bg-transparent': billingInterval !== 'month',
                  }
                )}
              >
                Monthly billing
              </button>
              <button
                onClick={() => setBillingInterval('year')}
                type="button"
                className={classNames(
                  'relative w-1/2  py-2 text-sm font-medium text-gray-700 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:z-10 sm:w-auto sm:px-8 rounded-lg',
                  {
                    'bg-white border-gray-200 shadow-sm rounded-md text-gray-900':
                      billingInterval === 'year',
                    'bg-transparent': billingInterval !== 'year',
                  }
                )}
              >
                Yearly billing
              </button>
            </div>
          </div>
          <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-4">
            {
            products.length ? products
              .sort(
                (a, b) =>
                  a?.prices?.find((one:any) => one.interval === billingInterval)
                    ?.unitAmount! -
                  b?.prices?.find((one:any) => one.interval === billingInterval)
                    ?.unitAmount!
              )
              .map((product) => {
                const price: Price = (product as any)?.prices?.find(
                  (one: Price) => one.interval === billingInterval
                );

                if (!price) {
                  return null;
                }

                return (
                  <div
                    key={product.name}
                    className={classNames(
                      'border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200',
                      {
                        'ring-indigo-500 ring-2':
                          subscription?.priceId === price.id,
                      }
                    )}
                  >
                    <div className="p-6">
                      <h2 className="text-lg font-medium leading-6 text-gray-900">
                        {product.name}
                      </h2>
                      <p className="mt-4 text-sm text-gray-500">
                        {product.description}
                      </p>
                      <p className="mt-8">
                        <span className="text-4xl font-extrabold text-gray-900">
                          ${price.unitAmount! / 100}
                        </span>{' '}
                        <span className="text-base font-medium text-gray-500">
                          {price.interval === 'month' ? '/mo' : '/yr'}
                        </span>
                      </p>
                      <button
                        onClick={() => handlePricingClick(price.id)}
                        className="block w-full py-2 mt-8 text-sm font-semibold text-center text-white bg-gray-900 border border-black rounded-md hover:bg-gray-700 hover:cursor-pointer"
                      >
                        Buy {product.name}
                      </button>
                    </div>
                    <div className="px-6 pt-6 pb-8">
                      <h3 className="text-xs font-medium tracking-wide text-gray-900 uppercase">
                        {"What's included"}
                      </h3>
                      <ul className="mt-6 space-y-4">
                        <li key={1} className="flex space-x-3">
                          <CheckIcon
                            className="flex-shrink-0 w-5 h-5 text-green-500"
                            aria-hidden="true"
                          />
                          <span className="text-sm text-gray-500">
                            Feature
                          </span>
                        </li>
                        <li key={2} className="flex space-x-3">
                          <CheckIcon
                            className="flex-shrink-0 w-5 h-5 text-green-500"
                            aria-hidden="true"
                          />
                          <span className="text-sm text-gray-500">
                            Feature
                          </span>
                        </li>
                        <li key={3} className="flex space-x-3">
                          <CheckIcon
                            className="flex-shrink-0 w-5 h-5 text-green-500"
                            aria-hidden="true"
                          />
                          <span className="text-sm text-gray-500">
                            Feature
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                );
              }) : null
            }
          </div>
        </div>
      </section>
      <section className="bg-white">
        <div className="px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center">
            <h1 className="text-6xl font-extrabold text-gray-800 sm:text-center">
              Additional services
            </h1>
            <p className="mt-5 text-xl text-gray-500 sm:text-center">
              You {`don't`} have the necessary resources or knowledge to create models yourself or connect to the API? We can help you make it happen!
            </p>
            <br />
            <div className="mt-5 sm:text-center">
              <a
                href="mailto: mateussiil@pdfdesign.tech"
                style={{ backgroundColor: '#22B7F2' }}
                className="mr-3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Send Email
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PriceComponent;
