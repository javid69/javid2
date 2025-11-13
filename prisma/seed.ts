import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...')

  // TODO: Phase 16 - Add seed data for:
  // - Default amenities
  // - Sample users (agents, admin)
  // - Sample properties
  // - Sample property images
  // - Sample property amenities
  // - Property alerts

  console.log('Database seeding completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
