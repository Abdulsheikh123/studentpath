import prisma from '../../config/prisma.db.js'

export function normalizeText(value) {
    if (typeof value !== 'string') return undefined

    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : undefined
}

export function normalizeNullableText(value) {
    return normalizeText(value) ?? null
}

export function normalizeInteger(value) {
    if (value === undefined || value === null || value === '') {
        return undefined
    }

    const parsed = Number(value)
    return Number.isInteger(parsed) ? parsed : undefined
}

export async function resolveCategoryId(categoryId, category) {
    const numericCategoryId = normalizeInteger(categoryId)

    if (numericCategoryId !== undefined) {
        const existingCategory = await prisma.category.findUnique({
            where: {
                id: numericCategoryId
            }
        })

        if (!existingCategory) {
            throw new Error('Category not found')
        }

        return numericCategoryId
    }

    const categoryName = normalizeText(category)

    if (!categoryName) {
        throw new Error('Category is required')
    }

    const existingCategory = await prisma.category.findFirst({
        where: {
            OR: [
                { name: categoryName },
                { slug: categoryName.toLowerCase().replace(/\s+/g, '-') }
            ]
        }
    })

    if (!existingCategory) {
        throw new Error('Category not found')
    }

    return existingCategory.id
}
