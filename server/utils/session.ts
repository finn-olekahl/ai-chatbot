import type { H3Event } from "h3";
import { authAdmin } from "~/server/utils/firebase";

async function getUserFromCookie(cookie: string) {
    try {
        const token = await authAdmin.verifySessionCookie(cookie, true);
        const user = await authAdmin.getUser(token.uid);
        return user;
    } catch (error) {
        return null;
    }
};

export async function getUserFromSession(event: H3Event) {
    const config = useRuntimeConfig();

    // Get the cookie from the request
    const cookie = getCookie(event, config.public.authCookieName as string);

    if (!cookie) return null;

    // get user from cookie value
    const user = await getUserFromCookie(cookie);

    return user;
    
}