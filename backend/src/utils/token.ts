
import jwt, { JwtPayload } from "jsonwebtoken";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters");
  }

  return secret;
}

export function generateAccessToken(userId: string): string {
  return jwt.sign(
    { sub: userId },
    getJwtSecret(),
    {
      expiresIn: "15m",
      algorithm: "HS256",
    },
  );
}

export function verifyAccessToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret(), {
      algorithms: ["HS256"],
    });

    if (
      typeof decoded === "object" &&
      decoded !== null &&
      typeof (decoded as JwtPayload).sub === "string"
    ) {
      return (decoded as JwtPayload).sub as string;
    }

    return null;
  } catch {
    return null;
  }
}
