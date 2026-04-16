import prisma from '../config/prisma.db.js'

export const getHostels = async (req, res) => {
  try {
    const hostels = await prisma.hostel.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return res.status(200).json({
      success: true,
      message: 'Hostels fetched successfully',
      data: hostels
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch hostels'
    })
  }
}

export const getHostelById = async (req, res) => {
  try {
    const { id } = req.params

    const hostel = await prisma.hostel.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Hostel fetched successfully',
      data: hostel
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch hostel'
    })
  }
}

export const createHostel = async (req, res) => {
  try {
    const {
      schoolId,
      itemType,
      itemId,
      hostelType,
      gender,
      available,
      capacity,
      fee,
      facilities,
      image
    } = req.body

    const legacyHostelType = req.body.type
    const legacyFee = req.body.fees

    const resolvedItemType =
      itemType !== undefined && itemType !== null && String(itemType).trim() !== ''
        ? String(itemType).trim().toLowerCase()
        : schoolId
          ? 'school'
          : undefined

    const resolvedItemId =
      itemId !== undefined && itemId !== null && String(itemId).trim() !== ''
        ? Number(itemId)
        : schoolId
          ? Number(schoolId)
          : undefined

    if (!resolvedItemType || !resolvedItemId) {
      return res.status(400).json({
        success: false,
        message: 'itemType and itemId are required'
      })
    }

    if (resolvedItemType === 'college') {
      return res.status(400).json({
        success: false,
        message: 'College has been removed; itemType cannot be college'
      })
    }

    if (resolvedItemType === 'school') {
      const school = await prisma.school.findUnique({
        where: {
          id: Number(resolvedItemId)
        }
      })

      if (!school) {
        return res.status(404).json({
          success: false,
          message: 'School not found'
        })
      }
    }

    const hostel = await prisma.hostel.create({
      data: {
        itemType: resolvedItemType,
        itemId: resolvedItemId,
        hostelType: hostelType !== undefined ? (String(hostelType).trim() || null) : (legacyHostelType !== undefined ? (String(legacyHostelType).trim() || null) : undefined),
        gender: gender !== undefined ? (String(gender).trim() || null) : undefined,
        available: available !== undefined ? Boolean(available) : undefined,
        capacity:
          capacity !== undefined
            ? (capacity === '' || capacity === null ? null : Number(capacity))
            : undefined,
        fee:
          fee !== undefined
            ? (fee === '' || fee === null ? null : Number(fee))
            : legacyFee !== undefined
              ? (legacyFee === '' || legacyFee === null ? null : Number(legacyFee))
              : undefined,
        facilities: facilities !== undefined ? (String(facilities).trim() || null) : undefined,
        image: image !== undefined ? (String(image).trim() || null) : undefined
      }
    })

    return res.status(201).json({
      success: true,
      message: 'Hostel created successfully',
      data: hostel
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: 'Unable to create hostel'
    })
  }
}

export const updateHostel = async (req, res) => {
  try {
    const { id } = req.params

    if (req.body?.itemType && String(req.body.itemType).trim().toLowerCase() === 'college') {
      return res.status(400).json({
        success: false,
        message: 'College has been removed; itemType cannot be college'
      })
    }

    const hostel = await prisma.hostel.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      })
    }

    const updatedHostel = await prisma.hostel.update({
      where: {
        id: Number(id)
      },
      data: req.body
    })

    return res.status(200).json({
      success: true,
      message: 'Hostel updated successfully',
      data: updatedHostel
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: 'Unable to update hostel'
    })
  }
}

export const deleteHostel = async (req, res) => {
  try {
    const { id } = req.params

    const hostel = await prisma.hostel.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      })
    }

    await prisma.hostel.delete({
      where: {
        id: Number(id)
      }
    })

    return res.status(200).json({
      success: true,
      message: 'Hostel deleted successfully'
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: 'Unable to delete hostel'
    })
  }
}
