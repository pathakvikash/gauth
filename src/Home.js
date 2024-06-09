import React, { useContext } from 'react';
import Form from './components/Forms/FormPage';
import { Context } from './context/Context';

const Home = () => {
  const featuresData = [
    'Secure and user-friendly authentication method',
    'Resistance to brute-force attacks',
    'Adaptable for various devices and screen sizes',
    'Customizable patterns for individual users',
    'Multi-factor authentication',
    'The Password Problem',
    'Robust and reliable system',
    'Easiness of use',
  ];

  const howItWorksData = [
    'Users select a set of images or patterns as their password.',
    'During login, users must recreate the selected pattern to gain access.',
    'The system validates the pattern against the stored user profile.',
    'Upon successful validation, the user is granted access to the application.',
  ];

  const hero = {
    title: 'Availability of Simpler, Stronger Verification System',
    subtitle: 'Empowering secure and user-friendly authentication',
  };

  const consumerMetrics = [
    {
      metric: 81,
      description:
        'Hacking related breaches are reported by week, stolen password',
    },
    {
      metric: 1265,
      description: 'Rise in malicious fishing emails since Q4 2022',
    },
    {
      metric: 967,
      description: 'Rise in phishing emails since Q4 2022',
    },
    {
      metric: 54,
      description:
        'Consumers have noticed phishing messages become more sophisticated in last 60 days',
    },
  ];
  const philosophy = {
    title: 'Our Philosophy',
    description:
      'We believe in combining security with ease of use to provide a seamless authentication experience. Our approach ensures that security does not come at the cost of usability.',
  };

  return (
    <div className='flex flex-col flex-1'>
      <section className='min-h-screen flex flex-col justify-center items-center bg-[#101010] text-white'>
        <h1 className='text-[#F1C376] text-center text-4xl md:text-6xl'>
          {hero.title}
        </h1>
        <p className='text-[#F1C376] text-center text-xl md:text-2xl mt-4'>
          {hero.subtitle}
        </p>
      </section>
      <section className='min-h-screen  flex flex-col justify-center items-center bg-[#1c1c20] text-white'>
        <h1 className='text-[#F1C376] text-center text-4xl md:text-6xl'>
          Why Choose Us
        </h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-8 w-auto col-end-1 max-w-5xl'>
          {featuresData.map((feature, index) => (
            <div className='bg-[#101011] p-6 rounded-xl shadow-md' key={index}>
              <p className='text-white txtsmall'>{feature}</p>
            </div>
          ))}
        </div>
      </section>
      <section className='min-h-screen flex flex-col justify-center m-9 items-center bg-[#101010] text-white'>
        <h1 className='text-[#F1C376] text-center text-4xl md:text-6xl'>
          How It Works
        </h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-8 w-full max-w-5xl'>
          {howItWorksData.map((step, index) => (
            <div className='bg-[#1c1c20] p-6 rounded-xl shadow-md' key={index}>
              <p className='text-white txtsmall'>{step}</p>
            </div>
          ))}
        </div>
      </section>
      <section className='min-h-screen flex flex-col justify-center items-center bg-[#1c1c20] text-white'>
        <h1 className='text-[#F1C376] text-center text-4xl md:text-6xl'>
          {philosophy.title}
        </h1>
        <p className='mt-8 text-2xl max-w-4xl text-center'>
          {philosophy.description}
        </p>
      </section>

      <section className='min-h-screen flex flex-col justify-center items-center bg-[#101010] text-white'>
        <h1 className='text-[#F1C376] text-center text-4xl md:text-6xl'>
          Consumer Metrics
        </h1>
        {consumerMetrics ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-8 w-auto col-end-1 max-w-5xl'>
            {consumerMetrics.map((metric, index) => (
              <div
                className='border-[5px] border-[#1c1c20] p-6 rounded-xl shadow-md'
                key={index}
              >
                <div className='text-white txtsmall'>
                  <p className='text-3xl'>{metric.metric + ' %'}</p>
                  <p className='text-xl'>{metric.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='loading flex flex-col justify-center gap-5 items-center mt-9'>
            <div className='loader w-[50px] h-[50px] border border-[#F1C376] rounded-full'></div>
            <p className='text-white'>Loading...</p>
          </div>
        )}
      </section>
      <div className='bg-[#1c1c20] p-6 rounded-xl shadow-md mt-8 min-h-screen'>
        <NewsArticle />
      </div>
      <aside className='bg-[#1c1c20] p-6 rounded-xl shadow-md mt-8 fixed h-[9vh] w-[15vw] bottom-[3vh] right-[3vh] '>
        Chat
      </aside>
    </div>
  );
};

function NewsArticle() {
  const { data } = useContext(Context);
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-3 text-white'>
      {data.map((article, index) => (
        <div
          className='border-[5px] text-white border-[#323234] p-6 rounded-xl flex flex-col  gap-3 shadow-md'
          key={index}
        >
          <div className='text-3xl'>{article.title}</div>
          <div className='text-sm'>{article.date}</div>
          <div className='text-2xl'>{article.description}</div>
        </div>
      ))}
    </div>
  );
}
export default Home;
