import prisma from "../config/prisma.db.js";

export const getFaqs = async (req, res) => {
  try {
    const { itemType, itemId } = req.query;

    if (!itemType || !itemId) {
      return res.status(400).json({
        success: false,
        message: "itemType and itemId are required",
      });
    }

    const type = String(itemType).trim().toLowerCase();
    const id = Number(itemId);

    let faqs = [];

    // Route to correct model based on itemType
    switch (type) {
      case "university":
        faqs = await prisma.universityFAQ.findMany({
          where: { universityId: id },
          orderBy: { createdAt: "desc" },
        });
        break;

      case "college":
        faqs = await prisma.collegeFAQ.findMany({
          where: { collegeId: id },
          orderBy: { createdAt: "desc" },
        });
        break;

      case "school":
        faqs = await prisma.schoolFAQ.findMany({
          where: { schoolId: id },
          orderBy: { createdAt: "desc" },
        });
        break;

      case "institute":
        faqs = await prisma.instituteFAQ.findMany({
          where: { instituteId: id },
          orderBy: { createdAt: "desc" },
        });
        break;

      case "research":
        faqs = await prisma.researchFAQ.findMany({
          where: { researchId: id },
          orderBy: { createdAt: "desc" },
        });
        break;

      default:
        return res.status(400).json({
          success: false,
          message: `Invalid itemType: ${type}. Must be one of: university, college, school, institute, research`,
        });
    }

    return res.status(200).json({
      success: true,
      message: "FAQs fetched successfully",
      data: faqs,
    });
  } catch (error) {
    console.log("Get FAQs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch FAQs",
    });
  }
};

export const createFAQ = async (req, res) => {
  try {
    const faqs = Array.isArray(req.body) ? req.body : [req.body];

    const createdFaqs = [];

    for (const faq of faqs) {
      const { question, answer, itemType, itemId } = faq;

      if (!question || !answer || !itemType || !itemId) {
        return res.status(400).json({
          success: false,
          message: "Question, answer, itemType, and itemId are required",
        });
      }

      const type = String(itemType).trim().toLowerCase();

      let createdFaq;

      switch (type) {
        case "university":
          createdFaq = await prisma.universityFAQ.create({
            data: {
              question: question.trim(),
              answer: answer.trim(),
              universityId: Number(itemId),
            },
          });
          break;

        case "college":
          createdFaq = await prisma.collegeFAQ.create({
            data: {
              question: question.trim(),
              answer: answer.trim(),
              collegeId: Number(itemId),
            },
          });
          break;

        case "school":
          createdFaq = await prisma.schoolFAQ.create({
            data: {
              question: question.trim(),
              answer: answer.trim(),
              schoolId: Number(itemId),
            },
          });
          break;

        case "institute":
          createdFaq = await prisma.instituteFAQ.create({
            data: {
              question: question.trim(),
              answer: answer.trim(),
              instituteId: Number(itemId),
            },
          });
          break;

        case "research":
          createdFaq = await prisma.researchFAQ.create({
            data: {
              question: question.trim(),
              answer: answer.trim(),
              researchId: Number(itemId),
            },
          });
          break;

        default:
          return res.status(400).json({
            success: false,
            message: `Invalid itemType: ${type}. Must be one of: university, college, school, institute, research`,
          });
      }

      createdFaqs.push(createdFaq);
    }

    return res.status(201).json({
      success: true,
      message: "FAQs created successfully",
      data: createdFaqs,
    });
  } catch (error) {
    console.error("Create FAQ Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create FAQ",
    });
  }
};

export const updateFaq = async (req, res) => {
  try {
    const { id, itemType } = req.params;

    if (!itemType) {
      return res.status(400).json({
        success: false,
        message: "itemType is required",
      });
    }

    const type = String(itemType).trim().toLowerCase();

    let faq;
    let updatedFaq;

    switch (type) {
      case "university":
        faq = await prisma.universityFAQ.findUnique({
          where: { id: Number(id) },
        });

        if (!faq) {
          return res.status(404).json({
            success: false,
            message: "FAQ not found",
          });
        }

        updatedFaq = await prisma.universityFAQ.update({
          where: { id: Number(id) },
          data: {
            ...(req.body.question !== undefined && {
              question: String(req.body.question).trim(),
            }),
            ...(req.body.answer !== undefined && {
              answer: String(req.body.answer).trim(),
            }),
          },
        });
        break;

      case "college":
        faq = await prisma.collegeFAQ.findUnique({
          where: { id: Number(id) },
        });

        if (!faq) {
          return res.status(404).json({
            success: false,
            message: "FAQ not found",
          });
        }

        updatedFaq = await prisma.collegeFAQ.update({
          where: { id: Number(id) },
          data: {
            ...(req.body.question !== undefined && {
              question: String(req.body.question).trim(),
            }),
            ...(req.body.answer !== undefined && {
              answer: String(req.body.answer).trim(),
            }),
          },
        });
        break;

      case "school":
        faq = await prisma.schoolFAQ.findUnique({
          where: { id: Number(id) },
        });

        if (!faq) {
          return res.status(404).json({
            success: false,
            message: "FAQ not found",
          });
        }

        updatedFaq = await prisma.schoolFAQ.update({
          where: { id: Number(id) },
          data: {
            ...(req.body.question !== undefined && {
              question: String(req.body.question).trim(),
            }),
            ...(req.body.answer !== undefined && {
              answer: String(req.body.answer).trim(),
            }),
          },
        });
        break;

      case "institute":
        faq = await prisma.instituteFAQ.findUnique({
          where: { id: Number(id) },
        });

        if (!faq) {
          return res.status(404).json({
            success: false,
            message: "FAQ not found",
          });
        }

        updatedFaq = await prisma.instituteFAQ.update({
          where: { id: Number(id) },
          data: {
            ...(req.body.question !== undefined && {
              question: String(req.body.question).trim(),
            }),
            ...(req.body.answer !== undefined && {
              answer: String(req.body.answer).trim(),
            }),
          },
        });
        break;

      case "research":
        faq = await prisma.researchFAQ.findUnique({
          where: { id: Number(id) },
        });

        if (!faq) {
          return res.status(404).json({
            success: false,
            message: "FAQ not found",
          });
        }

        updatedFaq = await prisma.researchFAQ.update({
          where: { id: Number(id) },
          data: {
            ...(req.body.question !== undefined && {
              question: String(req.body.question).trim(),
            }),
            ...(req.body.answer !== undefined && {
              answer: String(req.body.answer).trim(),
            }),
          },
        });
        break;

      default:
        return res.status(400).json({
          success: false,
          message: `Invalid itemType: ${type}. Must be one of: university, college, school, institute, research`,
        });
    }

    return res.status(200).json({
      success: true,
      message: "FAQ updated successfully",
      data: updatedFaq,
    });
  } catch (error) {
    console.error("Update FAQ Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update FAQ",
    });
  }
};

export const deleteFaq = async (req, res) => {
  try {
    const { id, itemType } = req.params;

    if (!itemType) {
      return res.status(400).json({
        success: false,
        message: "itemType is required",
      });
    }

    const type = String(itemType).trim().toLowerCase();

    let faq;

    switch (type) {
      case "university":
        faq = await prisma.universityFAQ.findUnique({
          where: { id: Number(id) },
        });

        if (!faq) {
          return res.status(404).json({
            success: false,
            message: "FAQ not found",
          });
        }

        await prisma.universityFAQ.delete({
          where: { id: Number(id) },
        });
        break;

      case "college":
        faq = await prisma.collegeFAQ.findUnique({
          where: { id: Number(id) },
        });

        if (!faq) {
          return res.status(404).json({
            success: false,
            message: "FAQ not found",
          });
        }

        await prisma.collegeFAQ.delete({
          where: { id: Number(id) },
        });
        break;

      case "school":
        faq = await prisma.schoolFAQ.findUnique({
          where: { id: Number(id) },
        });

        if (!faq) {
          return res.status(404).json({
            success: false,
            message: "FAQ not found",
          });
        }

        await prisma.schoolFAQ.delete({
          where: { id: Number(id) },
        });
        break;

      case "institute":
        faq = await prisma.instituteFAQ.findUnique({
          where: { id: Number(id) },
        });

        if (!faq) {
          return res.status(404).json({
            success: false,
            message: "FAQ not found",
          });
        }

        await prisma.instituteFAQ.delete({
          where: { id: Number(id) },
        });
        break;

      case "research":
        faq = await prisma.researchFAQ.findUnique({
          where: { id: Number(id) },
        });

        if (!faq) {
          return res.status(404).json({
            success: false,
            message: "FAQ not found",
          });
        }

        await prisma.researchFAQ.delete({
          where: { id: Number(id) },
        });
        break;

      default:
        return res.status(400).json({
          success: false,
          message: `Invalid itemType: ${type}. Must be one of: university, college, school, institute, research`,
        });
    }

    return res.status(200).json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    console.error("Delete FAQ Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to delete FAQ",
    });
  }
};

export const getCollegeFAQs = async (req, res) => {
  try {
    const faqs = await prisma.collegeFAQ.findMany({
      where: { collegeId: Number(req.params.id) },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      message: "College FAQs fetched successfully",
      data: faqs,
    });
  } catch (error) {
    console.error("Get College FAQs Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch college FAQs",
    });
  }
};

export const getSchoolFAQs = async (req, res) => {
  try {
    const faqs = await prisma.schoolFAQ.findMany({
      where: { schoolId: Number(req.params.id) },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      message: "School FAQs fetched successfully",
      data: faqs,
    });
  } catch (error) {
    console.error("Get School FAQs Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch school FAQs",
    });
  }
};

export const getUniversityFAQs = async (req, res) => {
  try {
    const faqs = await prisma.universityFAQ.findMany({
      where: { universityId: Number(req.params.id) },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      message: "University FAQs fetched successfully",
      data: faqs,
    });
  } catch (error) {
    console.error("Get University FAQs Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch university FAQs",
    });
  }
};

export const getInstituteFAQs = async (req, res) => {
  try {
    const faqs = await prisma.instituteFAQ.findMany({
      where: { instituteId: Number(req.params.id) },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      message: "Institute FAQs fetched successfully",
      data: faqs,
    });
  } catch (error) {
    console.error("Get Institute FAQs Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch institute FAQs",
    });
  }
};

export const getResearchFAQs = async (req, res) => {
  try {
    const faqs = await prisma.researchFAQ.findMany({
      where: { researchId: Number(req.params.id) },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      message: "Research FAQs fetched successfully",
      data: faqs,
    });
  } catch (error) {
    console.error("Get Research FAQs Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch research FAQs",
    });
  }
};

/* 
  ExamFAQ and CourseFAQ models do not exist in schema.
  Only available FAQ types: UniversityFAQ, CollegeFAQ, SchoolFAQ, InstituteFAQ, ResearchFAQ
  Use getFaqs() with itemType parameter instead.
*/

// export const getExamFAQs = async (req, res) => {
//   try {
//     const faqs = await prisma.fAQ.findMany({
//       where: {
//         itemType: "exam",
//         itemId: Number(req.params.id),
//       },
//     });
//
//     return res.status(200).json({
//       success: true,
//       data: faqs,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Unable to fetch exam FAQs",
//     });
//   }
// };

// export const getCourseFAQs = async (req, res) => {
//   try {
//     const faqs = await prisma.fAQ.findMany({
//       where: {
//         itemType: "course",
//         itemId: Number(req.params.id),
//       },
//     });
//
//     return res.status(200).json({
//       success: true,
//       data: faqs,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Unable to fetch course FAQs",
//     });
//   }
// };
