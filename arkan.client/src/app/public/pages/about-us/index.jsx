import aboutUsVideo from '@assets/videos/about-us-bg.mp4';
import logo from '@assets/icons/arkan-logo.png';
import whatIsArkan from '@assets/images/what-is-arkan.svg';
import whatArkanOffers from '@assets/images/arkan-offers.svg';
import smallBook from '@assets/icons/Small book.svg';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './about-us.css';
import Slider from 'react-slick';
import Lottie from 'lottie-react';
import animateLesson from '@assets/lottie/animate-lesson';
import animateChatRoom from '@assets/lottie/animate-chart-room';
import animateQuiz from '@assets/lottie/animate-quiz';
import animateSupport from '@assets/lottie/animate-support';
import animatePromocodes from '@assets/lottie/animate-promocodes';
import { useFetchFrequentlyQuestions } from '@/app/admin/hooks';
import { Accordion, AccordionTab } from 'primereact/accordion';

export default function AboutUs() {
  const frequentlyAskedQuestions = useFetchFrequentlyQuestions();

  return (
    <div className="px-4 md:px-26 xl:px-40 py-4 xl:py-8 flex-1 bg-white">
      <div className="flex flex-col gap-2">
        <div className="rounded-2xl shadow-lg overflow-hidden bg-gray-400 animate-fade-down drop-shadow-md relative w-full h-[400px]">
          <video
            autoPlay
            muted
            loop
            className="animate-fade brightness-50 animate-delay-200 z-0 absolute grayscale-[0.35] object-fill w-full h-full"
          >
            <source src={aboutUsVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white flex flex-col items-center">
            <img src={logo} alt="logo" className="h-32 w-32" />
            <h2 className="text-6xl font-semibold border-b">About Us</h2>
          </div>
        </div>
        <div className="flex flex-col gap-2 p-2 md:p-10">
          <div className="flex text-center animate-fade-right animate-delay-300 flex-wrap">
            <img src={whatIsArkan} className="max-w-[200px] md:max-w-[300px]" />
            <div className="max-w-[555px] text-left ms-2">
              <h3 className="text-4xl py-4 text-[#40464d] leading-[1.1] font-normal">What is Arkan?</h3>
              <p className="text-base text-[#737373] ms-4 leading-[2.14] text-justify">
                Arkan is the 1st and only e-learning platform in the middle east that offers online courses that have a
                high quality and affordable price. Arkan has been in operation since the beginning of 2020 and has been
                , founded in 2021. Arkan was founded with the vision of providing high quality education to students in
                the middle east.
              </p>
            </div>
          </div>

          <div className="flex text-center animate-fade-left animate-delay-300 justify-end flex-wrap">
            <div className="max-w-[555px] text-left me-4">
              <h3 className="text-4xl py-4 text-[#40464d] leading-[1.1] font-normal">What Does Arkan Offer?</h3>
              <p className="text-base text-[#737373] ms-4 leading-[2.14] text-justify">
                Arkan Offers a variety of online courses. We have courses for different fields of study.
              </p>
            </div>
            <img src={whatArkanOffers} className="max-w-[200px] md:max-w-[300px]" />
          </div>
          <div className="flex text-center justify-center flex-col items-center my-4 gap-4">
            <div>
              <h3 className="text-4xl py-2 text-[#40464d] leading-[1.1] font-normal">Our Services</h3>
              <img src={smallBook} alt="AboutUs" className="w-full" />
            </div>

            <div className="w-full">
              <OurServicesCarousel />
            </div>
          </div>

          <div className="flex animate-fade-up animate-delay-300 justify-center flex-col items-center my-4">
            <div className="text-center ">
              <h3 className="text-4xl py-2 text-[#40464d] leading-[1.1] font-normal">FAQ</h3>
              <img src={smallBook} alt="AboutUs" className="w-full" />
            </div>
            <div className="pt-4 w-full faq-container">
              <Accordion>
                {frequentlyAskedQuestions.map((item) => (
                  <AccordionTab key={item.id} header={item.title}>
                    <p>{item.answer}</p>
                  </AccordionTab>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OurServicesCarousel() {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    cssEase: 'linear'
  };
  const items = [
    {
      title: 'Live Streaming',
      icon: animateLesson
    },
    {
      title: 'Chat Rooms',
      icon: animateChatRoom
    },
    {
      title: 'Quizzes',
      icon: animateQuiz
    },
    {
      title: '24/7 Support',
      icon: animateSupport
    },
    {
      title: 'Promo codes & discounts',
      icon: animatePromocodes
    }
  ];
  return (
    <div className="rounded-2xl slider-container bg-blue-grey-500/15 mt-2">
      <Slider {...settings}>
        {items.map((item, index) => (
          <div
            key={index}
            className="!flex flex-col justify-center items-center px-6 py-4 gap-2 animate-jump-in animate-delay-500"
          >
            <Lottie className="h-20" loop animationData={item.icon} />
            <p>{item.title}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
}
