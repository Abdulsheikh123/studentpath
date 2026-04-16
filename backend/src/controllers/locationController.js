import prisma from '../config/prisma.db.js'

export const getStates = async (req, res) => {
  try {
    const states = await prisma.state.findMany({
      orderBy: { name: 'asc' }
    })
    return res.status(200).json({
      success: true,
      data: states
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const getDistricts = async (req, res) => {
  try {
    const { stateId } = req.query
    const where = {}
    if (stateId) where.stateId = Number(stateId)

    const districts = await prisma.district.findMany({
      where,
      orderBy: { name: 'asc' }
    })
    return res.status(200).json({
      success: true,
      data: districts
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const getPopularCities = async (req, res) => {
  try {
    const cities = await prisma.district.findMany({
      take: 8,
      include: {
        _count: {
          select: { colleges: true }
        },
        state: true
      },
      orderBy: {
        colleges: {
          _count: 'desc'
        }
      }
    })

    return res.status(200).json({
      success: true,
      data: cities.map(city => ({
        id: city.id,
        name: city.name,
        collegeCount: city._count.colleges,
        stateName: city.state.name
      }))
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}
