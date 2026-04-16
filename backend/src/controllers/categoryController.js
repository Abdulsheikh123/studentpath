import prisma from '../config/prisma.db.js'

export const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: {
                name: 'asc'
            }
        })

        return res.status(200).json({
            success: true,
            message: 'Categories fetched successfully',
            count: categories.length,
            data: categories
        })
    } catch (error) {
        console.error('Get Categories Error:', error)

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch categories'
        })
    }
}

export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params

        const category = await prisma.category.findUnique({
            where: {
                id: Number(id)
            }
        })

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Category fetched successfully',
            data: category
        })
    } catch (error) {
        console.error('Get Category By ID Error:', error)

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch category'
        })
    }
}

export const createCategory = async (req, res) => {
    try {
        const { name, slug } = req.body

        if (!name || !slug) {
            return res.status(400).json({
                success: false,
                message: 'Name and slug are required'
            })
        }

        const existingCategory = await prisma.category.findFirst({
            where: {
                OR: [
                    { name },
                    { slug }
                ]
            }
        })

        if (existingCategory) {
            return res.status(409).json({
                success: false,
                message: 'Category already exists with same name or slug'
            })
        }

        const category = await prisma.category.create({
            data: {
                name,
                slug
            }
        })

        return res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category
        })
    } catch (error) {
        console.error('Create Category Error:', error)

        return res.status(500).json({
            success: false,
            message: 'Failed to create category'
        })
    }
}
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params
        const { name, slug } = req.body

        const existingCategory = await prisma.category.findUnique({
            where: {
                id: Number(id)
            }
        })

        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            })
        }

        const duplicateCategory = await prisma.category.findFirst({
            where: {
                id: {
                    not: Number(id)
                },
                OR: [
                    { name }, { slug }
                ]
            }
        })

        if (duplicateCategory) {
            return res.status(409).json({
                success: false,
                message: 'Another category already exists with same name or slug'
            })
        }

        const updatedCategory = await prisma.category.update({
            where: {
                id: Number(id)
            },
            data: {
                name,
                slug
            }
        })

        return res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: updatedCategory
        })
    } catch (error) {
        console.error('Update Category Error:', error)

        return res.status(500).json({
            success: false,
            message: 'Failed to update category'
        })
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params

        const existingCategory = await prisma.category.findUnique({
            where: {
                id: Number(id)
            }
        })

        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            })
        }

        await prisma.category.delete({
            where: {
                id: Number(id)
            }
        })

        return res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        })
    } catch (error) {
        console.error('Delete Category Error:', error)

        return res.status(500).json({
            success: false,
            message: 'Failed to delete category'
        })
    }
}   