"use client";

import { observer, useLocalObservable } from "mobx-react-lite";
import styles from "./Projects.module.scss";
import Text from "components/Text";
import { ProjectListStore } from "entities/project/stores/ProjectListStore";
import { useCallback, useEffect } from "react";
import { SearchParams } from "entities/searchParams/model";
import { useSearchParams } from "next/navigation";
import { useUrlParams } from "hooks/useUrlParams";
import ProjectCard from "./ProjectCard";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const ProjectsSection: React.FC = observer(() => {
  const searchParams = useSearchParams();
  const { set: updateUrl } = useUrlParams();

  const handleUpdateUrl = useCallback(
    (updates: Partial<SearchParams>) => {
      const cleaned = Object.fromEntries(
        Object.entries(updates).filter(([, value]) => value != null)
      );
      updateUrl(cleaned);
    },
    [updateUrl]
  );

  const projectsListStore = useLocalObservable(
    () => new ProjectListStore(new URLSearchParams(), handleUpdateUrl)
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString());
    projectsListStore.searchModel.initFromParams(params);
    projectsListStore.fetchAllProjects();
  }, [searchParams, projectsListStore]);

  return (
    <section className={styles.projects} id="projects">
      <div className={styles.projects__info}>
        <Text
          font="caveat"
          view="p-24"
          weight="medium"
          color="secondary"
          className={styles.projects__desc}
        >
          с 2021 по сей день
        </Text>
        <Text tag="h2" view="title" weight="black" uppercase>
          Последние <br />
          проекты
        </Text>
        <DotLottieReact
          className={styles.projects__decorate}
          src="https://lottie.host/c9b6b0f9-6f25-4988-bf22-68c0dd970e57/BEvlo1T9Ft.lottie"
          autoplay
        />
      </div>
      <div className={styles.projects__list}>
        {projectsListStore.projects.map((project) => {
          return <ProjectCard project={project} key={project.id} />;
        })}
      </div>
    </section>
  );
});

export default ProjectsSection;
