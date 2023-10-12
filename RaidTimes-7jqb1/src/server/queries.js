import HttpError from '@wasp/core/HttpError.js'

export const getRaids = async (args, context) => {
  const raids = await context.entities.Raid.findMany();
  return raids;
}

export const getUser = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  const user = await context.entities.User.findUnique({
    where: { id: args.id }
  });

  if (!user) { throw new HttpError(404, 'No user with id ' + args.id) };

  return user;
}

export const getRegistrations = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  return context.entities.RaidRegistration.findMany({
    where: {
      userId: args.userId
    }
  });
}