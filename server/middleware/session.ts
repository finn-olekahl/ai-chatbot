import { getUserFromSession } from '~/server/utils/session'; // Import the getUserFromSession function

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event);
  
  if (user) event.context.user = user;
});