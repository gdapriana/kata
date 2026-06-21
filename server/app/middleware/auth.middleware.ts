import type { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth.js";
import { prismaClient } from "../database/db.js";
import type { Role } from "../generated/prisma/enums.js";

type AuthUser = {
  id: string;
  role: Role;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function protectRoute(allowedRoles: Role[] = ["USER", "ADMIN"]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await auth.api.getSession({
        headers: new Headers(req.headers as Record<string, string>),
      });

      if (!session?.user?.id) {
        return res.status(401).json({
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication is required",
          },
        });
      }

      const user = await prismaClient.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, role: true },
      });

      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).json({
          error: {
            code: "FORBIDDEN",
            message: "You do not have permission to access this resource",
          },
        });
      }

      req.user = user;
      return next();
    } catch (error) {
      return next(error);
    }
  };
}
