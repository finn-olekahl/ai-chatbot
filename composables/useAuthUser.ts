import type { User } from "~/types";

export const useAuthUser = () => {
    return useState<User | null>("user", () => null);
};