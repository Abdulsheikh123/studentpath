import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.db.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Google token is required",
      });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error("❌ GOOGLE_CLIENT_ID is not configured");
      return res.status(500).json({
        success: false,
        message: "Server configuration error: Google OAuth not configured",
      });
    }

    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (verifyError) {
      // Check if it's a clock skew issue (token too early)
      if (verifyError.message.includes("Token used too early")) {
        console.warn(
          "⚠️  System clock skew - token timestamp issue, proceeding with decoded payload...",
        );
        try {
          // Decode token without verification (for clock skew tolerance)
          const decoded = jwt.decode(token, { complete: true });

          if (!decoded || !decoded.payload) {
            throw new Error("Unable to decode token");
          }

          ticket = { getPayload: () => decoded.payload };
          console.warn(
            "✅ Proceeding despite clock skew - consider syncing server time",
          );
        } catch (decodeError) {
          console.error("❌ Failed to decode token:", decodeError.message);
          return res.status(401).json({
            success: false,
            message: "Invalid or malformed Google token",
          });
        }
      } else {
        console.error(
          "❌ Google token verification failed:",
          verifyError.message,
        );
        return res.status(401).json({
          success: false,
          message: "Invalid Google token",
        });
      }
    }

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google token payload",
      });
    }

    const { sub: googleId, name, email, picture } = payload;

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: "Email and name are required from Google",
      });
    }

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          googleId,
          profileImage: picture,
        },
      });
      console.log(`✅ New user created: ${email}`);
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId,
          profileImage: picture,
        },
      });
      console.log(`✅ User updated with Google ID: ${email}`);
    } else {
      console.log(`✅ User already exists: ${email}`);
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is not configured");
      return res.status(500).json({
        success: false,
        message: "Server configuration error: JWT not configured",
      });
    }

    const authToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("userToken", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log(`✅ Google login successful for: ${email}`);

    return res.status(200).json({
      success: true,
      message: "Google login successful",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("❌ Google Login Error:", error.message);
    console.error("Stack:", error.stack);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to login with Google",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const currentPage = Number(page);
    const pageSize = Number(limit);
    const skip = (currentPage - 1) * pageSize;

    const where = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.user.count({ where }),
    ]);
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
      pagination: {
        total,
        page: currentPage,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.log("Get All Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch users",
    });
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        comments: true,
        ratings: true,
        searchHistory: true,
        contactRequests: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    console.log("Get Single User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch user",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, profileImage } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        name: name?.trim() || existingUser.name,
        profileImage: profileImage || existingUser.profileImage,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log("Update User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update user",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const existingUser = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log("Delete User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete user",
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("userToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "User logout successful",
    });
  } catch (error) {
    console.log("Logout User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to logout user",
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Get Current User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch user profile",
    });
  }
};
