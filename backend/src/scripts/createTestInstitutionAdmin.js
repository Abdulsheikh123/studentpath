import bcrypt from 'bcryptjs'
import prisma from '../config/prisma.db.js'

async function createTestAdmin() {
  try {
    console.log('--- Creating Test Institution Admin ---')

    // 1. Ensure we have at least one college to link to
    let college = await prisma.college.findFirst()
    
    if (!college) {
      console.log('No college found. Creating a dummy college...')
      college = await prisma.college.create({
        data: {
          name: 'Test University of Excellence',
          slug: 'test-university-' + Date.now(),
          subDistrictId: 1 // Assuming subDistrict 1 exists
        }
      })
    }

    // 2. Create the Institution Admin
    const email = 'inst_admin@example.com'
    const password = 'password123'
    const hashedPassword = await bcrypt.hash(password, 10)

    const admin = await prisma.institutionAdmin.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        isApproved: true,
        collegeId: college.id,
        institutionTitle: college.name,
        institutionType: 'College'
      },
      create: {
        username: 'test_inst_admin',
        email,
        password: hashedPassword,
        institutionTitle: college.name,
        institutionType: 'College',
        isApproved: true,
        isActive: true,
        collegeId: college.id
      }
    })

    console.log('✓ Test Institution Admin Created Successfully!')
    console.log(`Email: ${email}`)
    console.log(`Password: ${password}`)
    console.log(`Linked to College: ${college.name}`)
    console.log('\nNow log in at http://localhost:3000/admin to check the results.')

  } catch (error) {
    console.error('Error creating test admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestAdmin()
