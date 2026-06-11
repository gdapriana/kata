import type { NextFunction, Request, RequestHandler, Response } from "express";
import { prisma } from "../db/db";
import { auth } from "../../lib/auth";

export const USER_ROLES = ["user", "author", "editor", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

type AuthSession = Awaited<ReturnType<typeof auth.api.getSession>>;

type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
  image: string | null;
  role: UserRole;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthContext = {
  session: NonNullable<AuthSession>["session"];
  user: AuthenticatedUser;
};

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

function toWebHeaders(req: Request): Headers {
  const headers = new Headers();

  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === "string") {
      headers.set(key, value);
      continue;
    }

    if (Array.isArray(value)) {
      headers.set(key, value.join(", "));
    }
  }

  return headers;
}

function sendAuthError(res: Response, status: 401 | 403, code: string, message: string) {
  return res.status(status).json({
    error: {
      code,
      message,
    },
  });
}

export function requireRole(allowedRoles: readonly UserRole[]): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await auth.api.getSession({
        headers: toWebHeaders(req),
      });

      if (!session?.user?.id) {
        return sendAuthError(res, 401, "UNAUTHORIZED", "Missing or invalid bearer token");
      }

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return sendAuthError(res, 401, "UNAUTHORIZED", "Authenticated user no longer exists");
      }

      if (!allowedRoles.includes(user.role)) {
        return sendAuthError(res, 403, "FORBIDDEN", "Insufficient permissions");
      }

      req.auth = {
        session: session.session,
        user,
      };

      return next();
    } catch (error) {
      return next(error);
    }
  };
}

export const requireUser = requireRole(["user", "author", "editor", "admin"]);
export const requireAuthor = requireRole(["author", "editor", "admin"]);
export const requireEditor = requireRole(["editor", "admin"]);
export const requireAdmin = requireRole(["admin"]);
