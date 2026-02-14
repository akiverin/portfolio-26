"use client";

import React from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import Text from "components/Text";
import Button from "components/Button";
import styles from "./Registration.module.scss";
import Input from "components/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RegisterFormStore } from "entities/user/stores/RegisterFormStore";
import Google from "@/components/icons/Google";
import { useUserStore } from "@/shared/store/StoreContext";

const Registration: React.FC = observer(() => {
  const form = useLocalObservable(() => new RegisterFormStore());
  const router = useRouter();
  const userStore = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.validateAll()) return;
    try {
      await userStore.signUp(form.email, form.password, form.displayName);
      console.log("Welcome!");
      router.replace("/");
      router.refresh();
    } catch {
      console.error(userStore.error || "Registration failed");
    }
  };

  return (
    <div className={styles["registration-page"]}>
      <div className={styles["registration-page__wrapper"]}>
        <form
          onSubmit={handleSubmit}
          className={styles["registration-page__form"]}
        >
          <div className={styles["registration-page__titles"]}>
            <Text view="p-24" tag="h1" color="primary">
              Registration account
            </Text>
            <Text view="p-14" color="secondary">
              If you have an account, please{" "}
              <Link href="/auth" className={styles["registration-page__link"]}>
                login
              </Link>
              .
            </Text>
          </div>

          <div className={styles["registration-page__form-group"]}>
            <Text color="primary" tag="label" view="p-14" htmlFor="displayName">
              Name
            </Text>
            <Input
              id="displayName"
              type="text"
              value={form.displayName}
              onChange={(v) => form.setField("displayName", v)}
              placeholder="Enter your name"
            />
            {form.errors.displayName && (
              <Text view="p-14" color="accent">
                {form.errors.displayName}
              </Text>
            )}
          </div>
          <div className={styles["registration-page__form-group"]}>
            <Text color="primary" tag="label" view="p-14" htmlFor="email">
              Email
            </Text>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(v) => form.setField("email", v)}
              placeholder="Enter your email"
            />
            {form.errors.email && (
              <Text view="p-14" color="accent">
                {form.errors.email}
              </Text>
            )}
          </div>
          <div className={styles["registration-page__form-group"]}>
            <Text color="primary" tag="label" view="p-14" htmlFor="password">
              Password
            </Text>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(v) => form.setField("password", v)}
              placeholder="Enter your password"
            />
            {form.errors.password && (
              <Text view="p-14" color="accent">
                {form.errors.password}
              </Text>
            )}
          </div>
          {userStore.meta === "error" && (
            <Text view="p-14" color="accent">
              {userStore.error}
            </Text>
          )}
          <Button type="submit" loading={userStore.meta === "loading"}>
            <Text color="primary" view="p-16">
              Register
            </Text>
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              userStore.signInWithGoogle();
            }}
            loading={userStore.meta === "loading"}
          >
            <Google width={16} height={16} />
            <Text color="primary" view="p-16">
              Sign up with Google
            </Text>
          </Button>
        </form>
      </div>
    </div>
  );
});

export default Registration;
