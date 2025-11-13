import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@asylem.com' },
    update: {},
    create: {
      email: 'admin@asylem.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0d47a1&color=fff',
      phone: '+1234567890',
      bio: 'System administrator for ASYLEN VENTURES',
    },
  })

  const agent1 = await prisma.user.upsert({
    where: { email: 'agent1@asylem.com' },
    update: {},
    create: {
      email: 'agent1@asylem.com',
      name: 'Sarah Johnson',
      password: hashedPassword,
      role: 'AGENT',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=2e7d32&color=fff',
      phone: '+1234567891',
      bio: 'Experienced real estate agent specializing in luxury properties',
    },
  })

  const agent2 = await prisma.user.upsert({
    where: { email: 'agent2@asylem.com' },
    update: {},
    create: {
      email: 'agent2@asylem.com',
      name: 'Michael Chen',
      password: hashedPassword,
      role: 'AGENT',
      avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=1565c0&color=fff',
      phone: '+1234567892',
      bio: 'Commercial real estate expert with 15+ years experience',
    },
  })

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@asylem.com' },
    update: {},
    create: {
      email: 'user@asylem.com',
      name: 'John Doe',
      password: hashedPassword,
      role: 'USER',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=616161&color=fff',
      phone: '+1234567893',
      bio: 'Property enthusiast looking for my dream home',
    },
  })

  console.log('✅ Users created')

  // Create amenities
  const amenities = [
    // Outdoor amenities
    { name: 'Swimming Pool', icon: 'pool', category: 'Outdoor', description: 'Private swimming pool' },
    { name: 'Garden', icon: 'yard', category: 'Outdoor', description: 'Beautiful garden area' },
    { name: 'Patio', icon: 'deck', category: 'Outdoor', description: 'Outdoor patio space' },
    { name: 'Garage', icon: 'garage', category: 'Outdoor', description: 'Attached garage' },
    { name: 'Driveway', icon: 'drive', category: 'Outdoor', description: 'Private driveway' },
    
    // Indoor amenities
    { name: 'Air Conditioning', icon: 'ac_unit', category: 'Indoor', description: 'Central air conditioning' },
    { name: 'Heating', icon: 'local_fire_department', category: 'Indoor', description: 'Central heating system' },
    { name: 'Fireplace', icon: 'fireplace', category: 'Indoor', description: 'Cozy fireplace' },
    { name: 'Laundry Room', icon: 'local_laundry_service', category: 'Indoor', description: 'Dedicated laundry room' },
    { name: 'Storage', icon: 'inventory_2', category: 'Indoor', description: 'Extra storage space' },
    
    // Kitchen amenities
    { name: 'Modern Kitchen', icon: 'kitchen', category: 'Kitchen', description: 'Fully equipped modern kitchen' },
    { name: 'Dishwasher', icon: 'dishwasher_gen', category: 'Kitchen', description: 'Built-in dishwasher' },
    { name: 'Microwave', icon: 'microwave', category: 'Kitchen', description: 'Built-in microwave' },
    { name: 'Refrigerator', icon: 'kitchen', category: 'Kitchen', description: 'Modern refrigerator' },
    { name: 'Oven', icon: 'oven_gen', category: 'Kitchen', description: 'Built-in oven' },
    
    // Safety amenities
    { name: 'Security System', icon: 'security', category: 'Safety', description: '24/7 security system' },
    { name: 'Smoke Detectors', icon: 'smoke_detector', category: 'Safety', description: 'Smoke and fire detectors' },
    { name: 'Carbon Monoxide Detector', icon: 'co2', category: 'Safety', description: 'CO2 safety detectors' },
    { name: 'Sprinkler System', icon: 'water_drop', category: 'Safety', description: 'Fire sprinkler system' },
    
    // Technology amenities
    { name: 'High-Speed Internet', icon: 'wifi', category: 'Technology', description: 'High-speed internet ready' },
    { name: 'Smart Home', icon: 'home', category: 'Technology', description: 'Smart home features' },
    { name: 'Cable TV Ready', icon: 'tv', category: 'Technology', description: 'Cable TV connections' },
    
    // Community amenities
    { name: 'Gym', icon: 'fitness_center', category: 'Community', description: 'Community fitness center' },
    { name: 'Clubhouse', icon: 'meeting_room', category: 'Community', description: 'Community clubhouse' },
    { name: 'Playground', icon: 'park', category: 'Community', description: 'Children\'s playground' },
    { name: 'Tennis Court', icon: 'sports_tennis', category: 'Community', description: 'Tennis court access' },
  ]

  for (const amenity of amenities) {
    await prisma.amenity.upsert({
      where: { name: amenity.name },
      update: {},
      create: amenity,
    })
  }

  console.log('✅ Amenities created')

  // Create properties
  const property1 = await prisma.property.create({
    data: {
      title: 'Modern Downtown Apartment',
      description: 'Stunning modern apartment in the heart of downtown with panoramic city views. This beautifully renovated 2-bedroom unit features an open-concept living space, high-end appliances, and floor-to-ceiling windows that flood the space with natural light.',
      price: 750000,
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      propertyType: 'APARTMENT',
      category: 'RESIDENTIAL',
      location: '123 Main Street, Downtown',
      latitude: 40.7128,
      longitude: -74.0060,
      videoUrl: 'https://example.com/video1.mp4',
      floorPlanUrl: 'https://example.com/floor1.png',
      status: 'ACTIVE',
      featured: true,
      agentId: agent1.id,
    },
  })

  const property2 = await prisma.property.create({
    data: {
      title: 'Luxury Family Home',
      description: 'Spacious 4-bedroom family home located in a quiet suburban neighborhood. Features include a gourmet kitchen, home office, swimming pool, and beautifully landscaped garden. Perfect for families looking for comfort and convenience.',
      price: 1250000,
      bedrooms: 4,
      bathrooms: 3,
      area: 3200,
      propertyType: 'HOUSE',
      category: 'RESIDENTIAL',
      location: '456 Oak Avenue, Westside',
      latitude: 40.7589,
      longitude: -73.9851,
      videoUrl: 'https://example.com/video2.mp4',
      floorPlanUrl: 'https://example.com/floor2.png',
      status: 'ACTIVE',
      featured: true,
      agentId: agent1.id,
    },
  })

  const property3 = await prisma.property.create({
    data: {
      title: 'Commercial Office Space',
      description: 'Prime commercial office space in the business district. This modern office building features state-of-the-art facilities, ample parking, and excellent accessibility. Ideal for growing businesses and established companies alike.',
      price: 2500000,
      bedrooms: 0,
      bathrooms: 4,
      area: 5000,
      propertyType: 'HOUSE',
      category: 'COMMERCIAL',
      location: '789 Business Blvd, Financial District',
      latitude: 40.7614,
      longitude: -73.9776,
      status: 'ACTIVE',
      featured: false,
      agentId: agent2.id,
    },
  })

  const property4 = await prisma.property.create({
    data: {
      title: 'Cozy Studio Apartment',
      description: 'Charming studio apartment perfect for students or young professionals. Efficient layout with modern finishes, great natural light, and located in a vibrant neighborhood with easy access to public transportation.',
      price: 350000,
      bedrooms: 0,
      bathrooms: 1,
      area: 450,
      propertyType: 'STUDIO',
      category: 'RESIDENTIAL',
      location: '321 College Street, University Area',
      latitude: 40.7489,
      longitude: -73.9680,
      status: 'ACTIVE',
      featured: false,
      agentId: agent2.id,
    },
  })

  const property5 = await prisma.property.create({
    data: {
      title: 'Waterfront Luxury Villa',
      description: 'Exquisite waterfront villa with breathtaking ocean views. This luxury property features 5 bedrooms, private beach access, infinity pool, home theater, and premium finishes throughout. The ultimate in coastal living.',
      price: 4500000,
      bedrooms: 5,
      bathrooms: 6,
      area: 6500,
      propertyType: 'VILLA',
      category: 'LUXURY',
      location: '555 Ocean Drive, Coastal Heights',
      latitude: 40.7282,
      longitude: -74.0776,
      videoUrl: 'https://example.com/video5.mp4',
      floorPlanUrl: 'https://example.com/floor5.png',
      status: 'ACTIVE',
      featured: true,
      agentId: agent1.id,
    },
  })

  console.log('✅ Properties created')

  // Add images to properties
  const sampleImages = [
    { url: 'https://picsum.photos/seed/prop1/800/600.jpg', publicId: 'prop1_img1', displayOrder: 0 },
    { url: 'https://picsum.photos/seed/prop1/800/601.jpg', publicId: 'prop1_img2', displayOrder: 1 },
    { url: 'https://picsum.photos/seed/prop1/800/602.jpg', publicId: 'prop1_img3', displayOrder: 2 },
  ]

  for (const image of sampleImages) {
    await prisma.propertyImage.create({
      data: {
        ...image,
        propertyId: property1.id,
      },
    })
  }

  // Add amenities to properties
  const allAmenities = await prisma.amenity.findMany()
  
  // Add amenities to property1
  const property1Amenities = allAmenities.slice(0, 8)
  for (const amenity of property1Amenities) {
    await prisma.propertyAmenity.create({
      data: {
        propertyId: property1.id,
        amenityId: amenity.id,
      },
    })
  }

  // Add amenities to property2
  const property2Amenities = allAmenities.slice(3, 12)
  for (const amenity of property2Amenities) {
    await prisma.propertyAmenity.create({
      data: {
        propertyId: property2.id,
        amenityId: amenity.id,
      },
    })
  }

  console.log('✅ Images and amenities added')

  // Create sample inquiries
  await prisma.inquiry.createMany({
    data: [
      {
        propertyId: property1.id,
        userId: regularUser.id,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        message: 'I am very interested in this property. Can we schedule a viewing?',
        status: 'PENDING',
      },
      {
        propertyId: property2.id,
        userId: regularUser.id,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1234567891',
        message: 'Is this property still available? What are the financing options?',
        status: 'RESPONDED',
      },
    ],
  })

  // Create sample viewing schedules
  await prisma.viewingSchedule.createMany({
    data: [
      {
        propertyId: property1.id,
        userId: regularUser.id,
        scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: 'SCHEDULED',
        notes: 'Weekend viewing preferred',
      },
    ],
  })

  console.log('✅ Sample inquiries and viewing schedules created')
  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })