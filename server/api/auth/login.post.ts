import { authAdmin } from "~/server/utils/firebase";

export default defineEventHandler(async (event) => {

  const config = useRuntimeConfig();

  const { firebaseIdToken } = await readBody(event);
  
  
  try {
    const sessionCookie = await authAdmin.createSessionCookie(firebaseIdToken, {expiresIn: config.public.authCookieExpires as number});
    
    
    setCookie(event, config.public.authCookieName as string, sessionCookie as string, {
      maxAge: config.public.authCookieExpires as number,
      sameSite: "strict",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    
    const token = await authAdmin.verifySessionCookie(sessionCookie as string, true);

    // ser custom claims
    // doc https://firebase.google.com/docs/auth/admin/custom-claims
    await authAdmin.setCustomUserClaims(token.uid, {
      admin: true,
      username: "admin",
    });

    const user = await authAdmin.getUser(token.uid);
    return { user };

  } catch (error) {
    console.log(error);

    return createError({
      statusCode: 401,
      message: "Not authenticated",
    });
  }
});