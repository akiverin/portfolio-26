import styles from "./page.module.scss";
import HeroSection from "./(components)/Hero";
import ProjectsSection from "./(components)/Projects";
import AchievementsSection from "./(components)/Achievements";
import GrantsSection from "./(components)/Grants";
import AboutSection from "./(components)/About";

export default function HomePage() {
  return (
    <main className={styles.home}>
      <div className={styles.home__wrapper}>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <AchievementsSection />
        <GrantsSection />
      </div>
    </main>
  );
}
