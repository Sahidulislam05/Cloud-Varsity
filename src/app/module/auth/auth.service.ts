import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import httpStatus from "http-status";
import ejs from "ejs";
import path from "node:path";
import config from "../../config";
import { transporter } from "../../lib/nodemailer";
import { prisma } from "../../lib/prisma";
import { redisClient } from "../../lib/redis";
import { AppError } from "../../utils/appError";
import { generateToken, verifyToken } from "../../utils/jwt";
import type {
  TForgotPasswordPayload,
  TGoogleLoginPayload,
  TJwtPayload,
  TLoginPayload,
  TRegisterPayload,
  TResetPasswordPayload,
} from "./auth.interface";
import { sendTemplatedEmail } from "../../utils/sendTemplatedEmail";

const googleClient = new OAuth2Client(config.google_client_id);

const generateAuthTokens = (payload: TJwtPayload) => {
  const accessToken = generateToken(
    payload,
    config.jwt_access_secret,
    config.jwt_access_expires_in,
  );
  const refreshToken = generateToken(
    payload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in,
  );
  return { accessToken, refreshToken };
};

const registerUser = async (payload: TRegisterPayload) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (existingUser) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This email is already registered",
    );
  }

  const program = await prisma.program.findUnique({
    where: { id: payload.programId },
  });
  if (!program) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid program selected");
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds),
  );
  const studentId = `STU${Date.now()}`;

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        phone: payload.phone,
        role: "STUDENT",
      },
    });

    await tx.studentProfile.create({
      data: {
        userId: user.id,
        studentId,
        programId: payload.programId,
        batch: payload.batch,
      },
    });

    return user;
  });

  const jwtPayload: TJwtPayload = {
    userId: result.id,
    name: result.name,
    email: result.email,
    role: result.role,
  };

  const { accessToken, refreshToken } = generateAuthTokens(jwtPayload);

  await sendTemplatedEmail(
    result.email,
    "Welcome to CloudVarsity!",
    "welcome-email",
    {
      name: result.name,
      studentId,
      email: result.email,
    },
  );
  return { accessToken, refreshToken, user: jwtPayload };
};

const loginUser = async (payload: TLoginPayload) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user || !user.password) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  if (user.deletedAt) {
    throw new AppError(httpStatus.FORBIDDEN, "This account no longer exists");
  }

  if (!user.isActive) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your account has been deactivated. Contact admin.",
    );
  }

  const isPasswordCorrect = await bcrypt.compare(
    payload.password,
    user.password,
  );
  if (!isPasswordCorrect) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  const jwtPayload: TJwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const { accessToken, refreshToken } = generateAuthTokens(jwtPayload);

  return { accessToken, refreshToken, user: jwtPayload };
};

const refreshAccessToken = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token not found");
  }

  let decoded: TJwtPayload;
  try {
    decoded = verifyToken<TJwtPayload>(token, config.jwt_refresh_secret);
  } catch {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid or expired refresh token",
    );
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  if (!user || user.deletedAt || !user.isActive) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "This account is no longer active",
    );
  }

  const jwtPayload: TJwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in,
  );

  return { accessToken };
};

const googleLogin = async (payload: TGoogleLoginPayload) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: payload.idToken,
    audience: config.google_client_id,
  });

  const googlePayload = ticket.getPayload();
  if (!googlePayload?.email) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Could not verify Google account",
    );
  }

  let user = await prisma.user.findUnique({
    where: { email: googlePayload.email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: googlePayload.name ?? googlePayload.email.split("@")[0],
        email: googlePayload.email,
        avatar: googlePayload.picture,
        role: "STUDENT",
      },
    });
  }

  if (user.deletedAt || !user.isActive) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "This account is no longer active",
    );
  }

  const jwtPayload: TJwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const { accessToken, refreshToken } = generateAuthTokens(jwtPayload);

  return { accessToken, refreshToken, user: jwtPayload };
};

const forgotPassword = async (payload: TForgotPasswordPayload) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (!user) return;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expirationMinutes = 5;

  await redisClient.set(`otp:reset-password:${payload.email}`, otp, {
    EX: expirationMinutes * 60,
  });

  const html = await ejs.renderFile(
    path.join(process.cwd(), "src/app/templates/forgot-password.ejs"),
    { name: user.name, otp, expirationMinutes },
  );

  await transporter.sendMail({
    from: config.email_sender,
    to: user.email,
    subject: "Reset your CloudVarsity password",
    html,
  });
};

const resetPassword = async (payload: TResetPasswordPayload) => {
  const storedOtp = await redisClient.get(
    `otp:reset-password:${payload.email}`,
  );

  if (!storedOtp || storedOtp !== payload.otp) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid or expired OTP");
  }

  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid or expired OTP");
  }

  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  await redisClient.del(`otp:reset-password:${payload.email}`);

  const html = await ejs.renderFile(
    path.join(process.cwd(), "src/app/templates/reset-password-success.ejs"),
    { name: user.name },
  );

  await transporter.sendMail({
    from: config.email_sender,
    to: user.email,
    subject: "Your CloudVarsity password was reset",
    html,
  });
};

export const AuthService = {
  registerUser,
  loginUser,
  refreshAccessToken,
  googleLogin,
  forgotPassword,
  resetPassword,
};
