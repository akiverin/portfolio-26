"use client";

import React, { useState } from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import Text from "components/Text";
import Button from "components/Button";
import styles from "./Auth.module.scss";
import Input from "components/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoginFormStore } from "entities/user/stores/LoginFormStore";
import Google from "components/icons/Google";
import ArrowLeft from "components/icons/ArrowLeft";
import { useUserStore } from "shared/store/StoreContext";

const Auth: React.FC = observer(() => {
  const form = useLocalObservable(() => new LoginFormStore());
  const userStore = useUserStore();

  const router = useRouter();
  const [mode, setMode] = useState<"login" | "reset">("login");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.validateAll()) {
      const firstError = Object.values(form.errors).find(Boolean);
      if (firstError) console.error(firstError);
      return;
    }

    try {
      await userStore.signIn(form.identifier, form.password);
      console.log("Welcome back!");
      router.replace("/profile");
    } catch {
      console.error(userStore.error || "Login failed");
    }
  };

  const handleGoogle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userStore.signInWithGoogle();
      console.log("Welcome back!");
      router.replace("/profile");
    } catch {
      console.error(userStore.error || "Google sign-in failed");
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userStore.resetPassword(form.identifier);
      console.log(
        "An email with a link to reset your password has been sent to your email"
      );
      setMode("login");
    } catch {
      console.error(userStore.error);
    }
  };

  return (
    <div className={styles["auth-page"]}>
      <div className={styles["auth-page__wrapper"]}>
        {mode === "reset" ? (
          <button
            type="button"
            className={styles["auth-page__back"]}
            onClick={() => setMode("login")}
            aria-label="Back to login"
          >
            <ArrowLeft color="primary" height={32} width={32} />
          </button>
        ) : null}

        <form
          onSubmit={mode === "login" ? handleLogin : handleReset}
          className={styles["auth-page__form"]}
        >
          <div className={styles["auth-page__titles"]}>
            <Text view="p-24" tag="h1" color="primary">
              {mode === "login" ? "Log in account" : "Reset password"}
            </Text>
            {mode === "login" ? (
              <Text view="p-14" color="secondary">
                If you don’t have an account, please{" "}
                <Link href="/register" className={styles["auth-page__link"]}>
                  register
                </Link>
                .
              </Text>
            ) : (
              <Text view="p-14" color="secondary">
                Enter your email to receive a reset link.
              </Text>
            )}
          </div>

          <div className={styles["auth-page__form-group"]}>
            <Text color="primary" tag="label" view="p-14" htmlFor="identifier">
              Email
            </Text>
            <Input
              id="identifier"
              type="text"
              value={form.identifier}
              onChange={(v) => form.setField("identifier", v)}
              placeholder="Enter your email"
            />
            {form.errors.identifier && (
              <Text view="p-14" color="accent">
                {form.errors.identifier}
              </Text>
            )}
          </div>

          {mode === "login" && (
            <div className={styles["auth-page__form-group"]}>
              <Text color="primary" tag="label" view="p-14" htmlFor="password">
                Password
              </Text>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(v) => form.setField("password", v)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
          )}

          {userStore.meta === "error" && userStore.error && (
            <Text view="p-14" color="accent">
              {userStore.error}
            </Text>
          )}

          <div className={styles["auth-page__actions"]}>
            {mode === "login" ? (
              <Button
                type="button"
                onClick={() => setMode("reset")}
                disabled={userStore.meta === "loading"}
              >
                <Text color="primary" view="p-16">
                  Reset password
                </Text>
              </Button>
            ) : null}

            <Button
              type="submit"
              loading={userStore.meta === "loading"}
              className={styles["auth-page__submit"]}
            >
              <Text color="primary" view="p-16">
                {mode === "login" ? "Log in" : "Send reset link"}
              </Text>
            </Button>
          </div>

          {mode === "login" && (
            <Button
              type="button"
              onClick={handleGoogle}
              className={styles["auth-page__google"]}
            >
              <Google width={16} height={16} />
              <Text color="primary" view="p-16">
                Sign in with Google
              </Text>
            </Button>
          )}
        </form>
      </div>
    </div>
  );
});

export default Auth;
