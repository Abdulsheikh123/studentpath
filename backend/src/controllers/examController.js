import prisma from '../config/prisma.db.js'
import {
    normalizeInteger,
    normalizeNullableText,
    normalizeText,
    resolveCategoryId
} from './exam/examNormalize.js'

export const getExams = async (req, res) => {
    try {
        const { stream, level, categoryId } = req.query

        const filters = {}

        if (normalizeText(stream)) {
            filters.stream = normalizeText(stream)
        }

        if (normalizeText(level)) {
            filters.level = normalizeText(level)
        }

        const parsedCategoryId = normalizeInteger(categoryId)

        if (parsedCategoryId !== undefined) {
            filters.categoryId = parsedCategoryId
        }

        const exams = await prisma.exam.findMany({
            where: filters,
            include: {
                category: true,
                eligibility: true,
                dates: true,
                fees: true,
                pattern: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return res.status(200).json({
            success: true,
            message: 'Exams fetched successfully',
            data: exams
        })
    } catch (error) {
        console.error('Get Exams Error:', error)

        return res.status(500).json({
            success: false,
            message: 'Unable to fetch exams'
        })
    }
}

export const getExamById = async (req, res) => {
    try {
        const { id } = req.params

        const exam = await prisma.exam.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                eligibility: true,
                category: true,
                dates: true,
                fees: true,
                pattern: true
            }
        })

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: 'Exam not found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Exam fetched successfully',
            data: exam
        })
    } catch (error) {
        console.error('Get Exam By ID Error:', error)

        return res.status(500).json({
            success: false,
            message: 'Unable to fetch exam'
        })
    }
}

export const createExam = async (req, res) => {
    try {
        const {
            name,
            slug,
            stream,
            shortName,
            image,
            examType,
            level,
            conductedBy,
            conductingBody,
            applyLink,
            officialWebsite,
            syllabusLink,
            description,
            categoryId,
            category
        } = req.body

        const normalizedName = normalizeText(name)
        const normalizedSlug = normalizeText(slug)

        if (!normalizedName || !normalizedSlug) {
            return res.status(400).json({
                success: false,
                message: 'Exam name and slug are required'
            })
        }

        const existingExam = await prisma.exam.findFirst({
            where: {
                OR: [
                    { name: normalizedName },
                    { slug: normalizedSlug }
                ]
            }
        })

        if (existingExam) {
            return res.status(409).json({
                success: false,
                message: 'Exam already exists with same name or slug'
            })
        }

        let resolvedCategoryId

        try {
            resolvedCategoryId = await resolveCategoryId(categoryId, category)
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Invalid category'
            })
        }

        const exam = await prisma.exam.create({
            data: {
                name: normalizedName,
                slug: normalizedSlug,
                stream: normalizeNullableText(stream),
                shortName: normalizeNullableText(shortName),
                image: normalizeNullableText(image),
                examType: normalizeNullableText(examType),
                level: normalizeNullableText(level),
                conductedBy: normalizeNullableText(conductedBy ?? conductingBody),
                applyLink: normalizeNullableText(applyLink),
                officialWebsite: normalizeNullableText(officialWebsite),
                syllabusLink: normalizeNullableText(syllabusLink),
                description: normalizeNullableText(description),
                categoryId: resolvedCategoryId
            },
            include: {
                category: true
            }
        })

        return res.status(201).json({
            success: true,
            message: 'Exam created successfully',
            data: exam
        })
    } catch (error) {
        console.error('Create Exam Error:', error)

        return res.status(500).json({
            success: false,
            message: 'Unable to create exam'
        })
    }
}

export const updateExam = async (req, res) => {
    try {
        const { id } = req.params
        const {
            name,
            slug,
            stream,
            shortName,
            image,
            examType,
            level,
            conductedBy,
            conductingBody,
            applyLink,
            officialWebsite,
            syllabusLink,
            description,
            categoryId,
            category
        } = req.body

        const existingExam = await prisma.exam.findUnique({
            where: {
                id: Number(id)
            }
        })

        if (!existingExam) {
            return res.status(404).json({
                success: false,
                message: 'Exam not found'
            })
        }

        const normalizedName = normalizeText(name)
        const normalizedSlug = normalizeText(slug)

        if (normalizedSlug && normalizedSlug !== existingExam.slug) {
            const slugExists = await prisma.exam.findFirst({
                where: {
                    slug: normalizedSlug,
                    id: { not: Number(id) }
                }
            })

            if (slugExists) {
                return res.status(409).json({
                    success: false,
                    message: 'Slug already exists'
                })
            }
        }

        if (normalizedName && normalizedName !== existingExam.name) {
            const nameExists = await prisma.exam.findFirst({
                where: {
                    name: normalizedName,
                    id: { not: Number(id) }
                }
            })

            if (nameExists) {
                return res.status(409).json({
                    success: false,
                    message: 'Exam name already exists'
                })
            }
        }

        let resolvedCategoryId
        const shouldUpdateCategory =
            categoryId !== undefined || category !== undefined

        if (shouldUpdateCategory) {
            try {
                resolvedCategoryId = await resolveCategoryId(categoryId, category)
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Invalid category'
                })
            }
        }

        const updatedExam = await prisma.exam.update({
            where: {
                id: Number(id)
            },
            data: {
                name: normalizedName ?? existingExam.name,
                slug: normalizedSlug ?? existingExam.slug,
                stream: stream !== undefined ? normalizeNullableText(stream) : undefined,
                shortName:
                    shortName !== undefined ? normalizeNullableText(shortName) : undefined,
                image: image !== undefined ? normalizeNullableText(image) : undefined,
                examType:
                    examType !== undefined ? normalizeNullableText(examType) : undefined,
                level: level !== undefined ? normalizeNullableText(level) : undefined,
                conductedBy:
                    conductedBy !== undefined || conductingBody !== undefined
                        ? normalizeNullableText(conductedBy ?? conductingBody)
                        : undefined,
                applyLink:
                    applyLink !== undefined ? normalizeNullableText(applyLink) : undefined,
                officialWebsite:
                    officialWebsite !== undefined
                        ? normalizeNullableText(officialWebsite)
                        : undefined,
                syllabusLink:
                    syllabusLink !== undefined
                        ? normalizeNullableText(syllabusLink)
                        : undefined,
                description:
                    description !== undefined
                        ? normalizeNullableText(description)
                        : undefined,
                categoryId: shouldUpdateCategory ? resolvedCategoryId : undefined
            },
            include: {
                category: true
            }
        })

        return res.status(200).json({
            success: true,
            message: 'Exam updated successfully',
            data: updatedExam
        })
    } catch (error) {
        console.error('Update Exam Error:', error)

        return res.status(500).json({
            success: false,
            message: 'Unable to update exam'
        })
    }
}

export const deleteExam = async (req, res) => {
    try {
        const { id } = req.params

        const exam = await prisma.exam.findUnique({
            where: {
                id: Number(id)
            }
        })

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: 'Exam not found'
            })
        }

        await prisma.exam.delete({
            where: {
                id: Number(id)
            }
        })

        return res.status(200).json({
            success: true,
            message: 'Exam deleted successfully'
        })
    } catch (error) {
        console.error('Delete Exam Error:', error)

        return res.status(500).json({
            success: false,
            message: 'Unable to delete exam'
        })
    }
}


//filters, pagination, search, sort

export const getAllExams = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            categoryId,
            stream,
            examType,
            level
        } = req.query

        const currentPage = Number(page)
        const pageSize = Number(limit)
        const skip = (currentPage - 1) * pageSize

        const where = {
            AND: [
                search
                    ? {
                        OR: [
                            {
                                name: {
                                    contains: search,
                                    mode: 'insensitive'
                                }
                            },
                            {
                                slug: {
                                    contains: search,
                                    mode: 'insensitive'
                                }
                            },
                            {
                                shortName: {
                                    contains: search,
                                    mode: 'insensitive'
                                }
                            }
                        ]
                    }
                    : {},

                categoryId
                    ? {
                        categoryId: Number(categoryId)
                    }
                    : {},

                stream
                    ? {
                        stream: {
                            equals: stream,
                            mode: 'insensitive'
                        }
                    }
                    : {},

                examType
                    ? {
                        examType: {
                            equals: examType,
                            mode: 'insensitive'
                        }
                    }
                    : {},

                level
                    ? {
                        level: {
                            equals: level,
                            mode: 'insensitive'
                        }
                    }
                    : {}
            ]
        }

        const [exams, total] = await Promise.all([
            prisma.exam.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    },
                    eligibility: true,
                    dates: true,
                    fees: true,
                    pattern: true
                }
            }),

            prisma.exam.count({ where })
        ])

        return res.status(200).json({
            success: true,
            message: 'Exams fetched successfully',
            data: exams,
            pagination: {
                total,
                page: currentPage,
                limit: pageSize,
                totalPages: Math.ceil(total / pageSize)
            }
        })
    } catch (error) {
        console.error('Get All Exams Error:', error)

        return res.status(500).json({
            success: false,
            message: 'Unable to fetch exams'
        })
    }
}
