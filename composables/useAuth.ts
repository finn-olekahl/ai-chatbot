import type { UserRecord } from "firebase-admin/auth";
import { useAuthUser } from "./useAuthUser";
import {
  getIdToken,
  signInWithEmailAndPassword,
} from "firebase/auth";

export const useAuth = () => {
  const { $fireAuth } = useNuxtApp();

  const authUser = useAuthUser();

  const setUser = (user: any) => {
    authUser.value = user;
  };

  const setCookie = (cookie: any) => {
    cookie.value = cookie;
  };

  const me = async () => {
    if (!authUser.value) {
      try {
        
        const data = await $fetch("/api/auth/me", {
          headers: useRequestHeaders(["cookie"]) as HeadersInit,
        });

        setUser(data.user);
      } catch (error) {
        setCookie(null);
      }
    }

    return authUser;
  };

  const loginWitPassword = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword($fireAuth, email, password);
      const firebaseIdToken = await getIdToken(result.user);

      // send firebaseIdToken to server
      const data: { user: UserRecord } = await $fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ firebaseIdToken }),
      });

      setUser(data.user);
    } catch (error) {
      console.log(error);
      setCookie(null);
      setUser(null);
    }

    return authUser;
  };

  const logout = async () => {
    const data = await $fetch("/api/auth/logout", {
      method: "POST",
    });

    setUser(data.user);
  };

  return {
    logout,
    loginWitPassword,
    me,
  };
};
