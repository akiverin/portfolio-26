"use client";

import styles from "./Header.module.scss";
import Text from "components/Text";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";

type ThemeKey = "light" | "dark" | "system";
const NAV_LINKS = [
  { to: "#projects", label: "Проекты" },
  { to: "#stack", label: "Технологии" },
  { to: "#achievements", label: "Достижения" },
  { to: "#contact", label: "Связаться" },
  { to: "/auth", label: "Войти" },
];

const Header: React.FC = () => {
  const location = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const [isOpenTheme, setIsOpenTheme] = useState(false);
  // const [theme, setTheme] = useState<ThemeKey>("system");

  // const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // const themeIconRef = useRef<HTMLDivElement>(null);
  // const menuRef = useRef<HTMLDivElement>(null);

  // --- 🌓 Определяем текущую тему ---
  // useEffect(() => {
  //   const savedTheme = localStorage.getItem("theme") as ThemeKey | null;
  //   const systemPrefersDark = window.matchMedia(
  //     "(prefers-color-scheme: dark)"
  //   ).matches;

  //   const initialTheme = savedTheme ?? "dark";
  //   setTheme(initialTheme);

  //   applyTheme(initialTheme, systemPrefersDark);

  //   const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  //   const handleSystemChange = (e: MediaQueryListEvent) => {
  //     if (localStorage.getItem("theme") === "system") {
  //       applyTheme("system", e.matches);
  //     }
  //   };

  //   mediaQuery.addEventListener("change", handleSystemChange);
  //   return () => mediaQuery.removeEventListener("change", handleSystemChange);
  // }, []);

  // --- 🪄 Применение темы ---
  // const applyTheme = (selected: ThemeKey, systemIsDark?: boolean) => {
  //   const html = document.documentElement;

  //   if (selected === "system") {
  //     html.setAttribute("data-theme", systemIsDark ? "dark" : "light");
  //   } else {
  //     html.setAttribute("data-theme", selected);
  //   }
  // };

  // --- 💾 Смена темы ---
  // const handleThemeChange = (key: ThemeKey) => {
  //   const systemPrefersDark = window.matchMedia(
  //     "(prefers-color-scheme: dark)"
  //   ).matches;
  //   setTheme(key);
  //   localStorage.setItem("theme", key);
  //   applyTheme(key, systemPrefersDark);
  //   setIsOpenTheme(false);
  // };

  // // --- 🔲 Клик вне меню ---
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       themeIconRef.current &&
  //       !themeIconRef.current.contains(event.target as Node)
  //     ) {
  //       setIsOpenTheme(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  return (
    <header className={styles.header}>
      <div className={styles.header__bg}>
        {/* 8 слоёв размытия */}
        <div className={styles.header__blurLayer} />
        <div className={styles.header__blurLayer} />
        <div className={styles.header__blurLayer} />
        <div className={styles.header__blurLayer} />
        <div className={styles.header__blurLayer} />
        <div className={styles.header__blurLayer} />
        <div className={styles.header__blurLayer} />
        <div className={styles.header__blurLayer} />
      </div>
      <div className={styles.header__wrapper}>
        <div className={styles.header__content}>
          <nav
            className={`${styles.header__navigate} ${
              isMenuOpen ? styles.active : ""
            }`}
          >
            <ul className={styles.header__navList}>
              {NAV_LINKS.map(({ to, label }) => (
                <li key={to} className={styles.header__navItem}>
                  <Link
                    className={styles.header__link}
                    href={to}
                    onClick={closeMenu}
                  >
                    <Text
                      view="p-16"
                      color={location === to ? undefined : "primary"}
                    >
                      {label}
                    </Text>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
