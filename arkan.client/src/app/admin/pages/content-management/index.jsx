import { DROP_DOWN_TYPES } from '@/constants';
import { useDropdownData } from '@/hooks';
import { TabComponent, TabsCard } from '@shared/components';
import { CompanyInfoSection } from './tabs/company-info-section';
import { CoursesSection } from './tabs/courses-section';
import { HeroSection } from './tabs/hero-section';
import { InstructorsSection } from './tabs/instructors-section';
import { UniversitiesSection } from './tabs/universities-section';
import { CategoriesSection } from './tabs/categories-section';

import './content-management.css';
import FrequentlyAskedQuestions from './tabs/FAQ';

export default function ContentManagement() {
  const { courses, instructors, universities, categories } = useDropdownData([
    DROP_DOWN_TYPES.Courses,
    DROP_DOWN_TYPES.Instructors,
    DROP_DOWN_TYPES.Universities,
    DROP_DOWN_TYPES.Categories
  ]);

  return (
    <TabsCard title="Content Management">
      <TabComponent tabTitle={'Hero Section'}>
        <HeroSection />
      </TabComponent>
      <TabComponent tabTitle={'Company Info Section'}>
        <CompanyInfoSection />
      </TabComponent>
      {!!courses?.length && (
        <TabComponent tabTitle={'Courses Section'}>
          <CoursesSection courses={courses} />
        </TabComponent>
      )}
      {!!instructors?.length && (
        <TabComponent tabTitle={'Instructors Section'}>
          <InstructorsSection instructors={instructors} />
        </TabComponent>
      )}
      {!!universities?.length && (
        <TabComponent tabTitle={'Universities Section'}>
          <UniversitiesSection universities={universities} />
        </TabComponent>
      )}
      <TabComponent tabTitle={'FAQ'}>
        <FrequentlyAskedQuestions />
      </TabComponent>

      {!!categories?.length && (
        <TabComponent tabTitle={'Categories Section'}>
          <CategoriesSection categories={categories} />
        </TabComponent>
      )}
    </TabsCard>
  );
}
