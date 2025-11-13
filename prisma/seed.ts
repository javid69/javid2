import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const user1 = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      role: 'USER'
    }
  })

  const agentUser = await prisma.user.create({
    data: {
      email: 'jane.agent@example.com',
      password: hashedPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+1234567891',
      role: 'AGENT'
    }
  })

  // Create agent profile
  const agent = await prisma.agent.create({
    data: {
      userId: agentUser.id,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.agent@example.com',
      phone: '+1234567891',
      bio: 'Experienced real estate agent with 10+ years in the industry',
      license: 'RE-12345',
      experience: 10,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    }
  })

  // Create amenities
  const amenities = await Promise.all([
    prisma.amenity.create({
      data: {
        name: 'Swimming Pool',
        description: 'Olympic-size swimming pool',
        icon: 'pool',
        category: 'recreation'
      }
    }),
    prisma.amenity.create({
      data: {
        name: 'Parking Garage',
        description: 'Secure underground parking',
        icon: 'parking',
        category: 'exterior'
      }
    }),
    prisma.amenity.create({
      data: {
        name: 'Gym',
        description: 'Fully equipped fitness center',
        icon: 'fitness',
        category: 'recreation'
      }
    }),
    prisma.amenity.create({
      data: {
        name: 'Air Conditioning',
        description: 'Central air conditioning system',
        icon: 'ac',
        category: 'interior'
      }
    }),
    prisma.amenity.create({
      data: {
        name: 'Security System',
        description: '24/7 security surveillance',
        icon: 'security',
        category: 'safety'
      }
    }),
    prisma.amenity.create({
      data: {
        name: 'Balcony',
        description: 'Private balcony with city view',
        icon: 'balcony',
        category: 'exterior'
      }
    })
  ])

  // Create sample properties
  const properties = await Promise.all([
    // Featured apartment
    prisma.property.create({
      data: {
        title: 'Luxury Downtown Apartment',
        description: 'Stunning 2-bedroom apartment in the heart of downtown with panoramic city views. Modern amenities and premium finishes throughout.',
        price: 450000,
        address: '123 Main Street',
        location: 'Downtown',
        coordinates: '40.7128,-74.0060',
        area: 1200,
        bedrooms: 2,
        bathrooms: 2,
        propertyType: 'APARTMENT',
        category: 'SALE',
        featured: true,
        status: 'ACTIVE',
        agentId: agent.id,
        ownerId: user1.id,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
              caption: 'Living Room',
              sortOrder: 0
            },
            {
              url: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&h=600&fit=crop',
              caption: 'Kitchen',
              sortOrder: 1
            },
            {
              url: 'https://images.unsplash.com/photo-1560664065-77e69e0c80a6?w=800&h=600&fit=crop',
              caption: 'Bedroom',
              sortOrder: 2
            }
          ]
        },
        amenities: {
          create: [
            { amenityId: amenities[0].id }, // Pool
            { amenityId: amenities[1].id }, // Parking
            { amenityId: amenities[3].id }, // AC
            { amenityId: amenities[5].id }  // Balcony
          ]
        }
      }
    }),

    // Budget apartment for rent
    prisma.property.create({
      data: {
        title: 'Cozy Studio Apartment',
        description: 'Perfect studio for students or young professionals. Close to public transportation and shopping centers.',
        price: 1200,
        address: '456 Oak Avenue',
        location: 'University District',
        coordinates: '40.7589,-73.9851',
        area: 450,
        bedrooms: 0,
        bathrooms: 1,
        propertyType: 'STUDIO',
        category: 'RENT',
        featured: false,
        status: 'ACTIVE',
        agentId: agent.id,
        ownerId: user1.id,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
              caption: 'Studio View',
              sortOrder: 0
            }
          ]
        },
        amenities: {
          create: [
            { amenityId: amenities[3].id }, // AC
            { amenityId: amenities[4].id }  // Security
          ]
        }
      }
    }),

    // Family house
    prisma.property.create({
      data: {
        title: 'Spacious Family Home',
        description: 'Beautiful 4-bedroom house with large backyard, perfect for families. Located in quiet neighborhood with good schools.',
        price: 750000,
        address: '789 Elm Street',
        location: 'Suburbs',
        coordinates: '40.7831,-73.9712',
        area: 2500,
        bedrooms: 4,
        bathrooms: 3,
        propertyType: 'HOUSE',
        category: 'SALE',
        featured: true,
        status: 'ACTIVE',
        agentId: agent.id,
        ownerId: user1.id,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
              caption: 'Front View',
              sortOrder: 0
            },
            {
              url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
              caption: 'Backyard',
              sortOrder: 1
            }
          ]
        },
        amenities: {
          create: [
            { amenityId: amenities[0].id }, // Pool
            { amenityId: amenities[1].id }, // Parking
            { amenityId: amenities[2].id }, // Gym
            { amenityId: amenities[4].id }  // Security
          ]
        }
      }
    }),

    // Commercial office space
    prisma.property.create({
      data: {
        title: 'Modern Office Space',
        description: 'Prime commercial office space in business district. Perfect for startups and established companies.',
        price: 3500,
        address: '321 Business Ave',
        location: 'Business District',
        coordinates: '40.7614,-73.9776',
        area: 1500,
        bedrooms: 0,
        bathrooms: 2,
        propertyType: 'OFFICE',
        category: 'RENT',
        featured: false,
        status: 'ACTIVE',
        agentId: agent.id,
        ownerId: user1.id,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
              caption: 'Office Interior',
              sortOrder: 0
            }
          ]
        },
        amenities: {
          create: [
            { amenityId: amenities[1].id }, // Parking
            { amenityId: amenities[3].id }, // AC
            { amenityId: amenities[4].id }  // Security
          ]
        }
      }
    }),

    // Villa for sale
    prisma.property.create({
      data: {
        title: 'Luxury Villa with Ocean View',
        description: 'Exclusive villa with stunning ocean views, private beach access, and world-class amenities.',
        price: 2500000,
        address: '555 Ocean Drive',
        location: 'Coastal Area',
        coordinates: '40.7489,-73.9680',
        area: 4500,
        bedrooms: 6,
        bathrooms: 5,
        propertyType: 'VILLA',
        category: 'SALE',
        featured: true,
        status: 'ACTIVE',
        agentId: agent.id,
        ownerId: user1.id,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&h=600&fit=crop',
              caption: 'Ocean View',
              sortOrder: 0
            }
          ]
        },
        amenities: {
          create: [
            { amenityId: amenities[0].id }, // Pool
            { amenityId: amenities[1].id }, // Parking
            { amenityId: amenities[2].id }, // Gym
            { amenityId: amenities[4].id }, // Security
            { amenityId: amenities[5].id }  // Balcony
          ]
        }
      }
    })
  ])

  // Create some saved searches for the user
  await Promise.all([
    prisma.savedSearch.create({
      data: {
        name: 'Downtown Apartments',
        filters: {
          location: 'Downtown',
          propertyTypes: ['APARTMENT'],
          category: 'SALE',
          minPrice: 300000,
          maxPrice: 500000,
          sort: 'price-asc'
        },
        notify: true,
        userId: user1.id
      }
    }),
    prisma.savedSearch.create({
      data: {
        name: 'Family Homes',
        filters: {
          propertyTypes: ['HOUSE'],
          bedrooms: [3, 4, 5],
          category: 'SALE',
          minArea: 2000,
          sort: 'newest'
        },
        notify: false,
        userId: user1.id
      }
    })
  ])

  console.log('✅ Database seeding completed!')
  console.log(`📊 Created ${properties.length} properties`)
  console.log(`🏠 Created ${amenities.length} amenities`)
  console.log(`👥 Created 2 users (1 regular, 1 agent)`)
  console.log(`💾 Created 2 saved searches`)
  
  console.log('\n🔐 Test credentials:')
  console.log('Regular user: john.doe@example.com / password123')
  console.log('Agent user: jane.agent@example.com / password123')

}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })