import HttpError from '@wasp/core/HttpError.js'

export const scheduleRaid = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  return context.entities.Raid.create({
    data: {
      description: args.description,
      scheduledTime: args.scheduledTime,
      maxMembers: 6
    }
  });
}

export const registerForRaid = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const raid = await context.entities.Raid.findUnique({
    where: { id: args.raidId }
  })
  if (!raid) { throw new HttpError(404, 'Raid not found') }

  if (raid.maxMembers <= raid.RaidRegistration.length) { throw new HttpError(403, 'Raid is full') }

  const existingRegistration = await context.entities.RaidRegistration.findUnique({
    where: { userId_raidId: { userId: context.user.id, raidId: args.raidId } }
  })

  if (existingRegistration) {
    throw new HttpError(400, 'User is already registered for this raid')
  }

  return context.entities.RaidRegistration.create({
    data: {
      status: args.status,
      user: { connect: { id: context.user.id } },
      raid: { connect: { id: args.raidId } }
    }
  })
}

export const registerAsAlternate = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const raid = await context.entities.Raid.findUnique({
    where: { id: args.raidId }
  })

  if (!raid) { throw new HttpError(404) }

  const existingRegistration = await context.entities.RaidRegistration.findUnique({
    where: { userId: context.user.id, raidId: args.raidId }
  })

  if (existingRegistration) {
    await context.entities.RaidRegistration.update({
      where: { id: existingRegistration.id },
      data: { status: 'alternate' }
    })
    return existingRegistration
  }

  return context.entities.RaidRegistration.create({
    data: { status: 'alternate', user: { connect: { id: context.user.id } }, raid: { connect: { id: args.raidId } } }
  })
}

export const declineRaid = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  const raid = await context.entities.Raid.findUnique({
    where: { id: args.raidId }
  });

  return context.entities.RaidRegistration.create({
    data: {
      status: 'decline',
      user: { connect: { id: context.user.id } },
      raid: { connect: { id: raid.id } }
    }
  });
}