import styles from './page.module.scss';
import HeroSection from 'widgets/HeroSection/ui/HeroSection';
import ProjectsSection from 'widgets/ProjectsSection/ui/ProjectsSection';
import AchievementsSection from 'widgets/AchievementsSection/ui/AchievementsSection';
import GrantsSection from 'widgets/GrantsSection/ui/GrantsSection';
import AboutSection from 'widgets/AboutSection/ui/AboutSection';
import ContactSection from 'widgets/ContactSection/ui/ContactSection';

export default function HomePage() {
  return (
    <main className={styles.home}>
      <div className={styles.home__wrapper}>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <AchievementsSection />
        <GrantsSection />
        <ContactSection />
      </div>
    </main>
  );
}
