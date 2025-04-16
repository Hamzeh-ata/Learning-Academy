import {
  AboutUsSection,
  CoursesSection,
  HeroSection,
  OurTeamSection,
  StatisticsSection,
  UniversitiesSection,
  CategoriesSection
} from '@/app/public/features/home-page';

const HomePage = () => (
  <div className="flex gap-8 flex-col">
    <HeroSection />
    <CoursesSection />
    <StatisticsSection />
    <CategoriesSection />
    <UniversitiesSection />
    <AboutUsSection />
    <OurTeamSection />
  </div>
);
export default HomePage;
