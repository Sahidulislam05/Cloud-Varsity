import bcrypt from "bcryptjs";
import config from "../config";
import { prisma } from "../lib/prisma";
import type { Role } from "../../generated/prisma/enums";

const seedUserIfNotExists = async (params: {
  name: string;
  email: string;
  password: string;
  role: Role;
}) => {
  const existing = await prisma.user.findUnique({
    where: { email: params.email },
  });
  if (existing) return;

  const hashedPassword = await bcrypt.hash(
    params.password,
    Number(config.bcrypt_salt_rounds),
  );

  await prisma.user.create({
    data: {
      name: params.name,
      email: params.email,
      password: hashedPassword,
      role: params.role,
    },
  });

  console.log(`Seeded ${params.role} account: ${params.email}`);
};

export const seedSuperAdmin = async () => {
  await seedUserIfNotExists({
    name: config.super_admin_name,
    email: config.super_admin_email,
    password: config.super_admin_password,
    role: "SUPER_ADMIN",
  });
  await seedUserIfNotExists({
    name: config.department_admin_name,
    email: config.department_admin_email,
    password: config.department_admin_password,
    role: "DEPARTMENT_ADMIN",
  });
  await seedUserIfNotExists({
    name: config.registrar_name,
    email: config.registrar_email,
    password: config.registrar_password,
    role: "REGISTRAR",
  });
  await seedUserIfNotExists({
    name: config.finance_admin_name,
    email: config.finance_admin_email,
    password: config.finance_admin_password,
    role: "FINANCE_ADMIN",
  });
};

export const seedInstructorAdmin = async () => {
  const existing = await prisma.user.findUnique({
    where: { email: config.instructor_admin_email },
  });
  if (existing) return;

  const department = await prisma.department.findFirst();
  if (!department) {
    console.log(
      "Skipped seeding demo instructor: no department exists yet (run again after Phase 4).",
    );
    return;
  }

  const hashedPassword = await bcrypt.hash(
    config.instructor_admin_password,
    Number(config.bcrypt_salt_rounds),
  );
  const user = await prisma.user.create({
    data: {
      name: config.instructor_admin_name,
      email: config.instructor_admin_email,
      password: hashedPassword,
      role: "INSTRUCTOR",
    },
  });

  await prisma.instructorProfile.create({
    data: {
      userId: user.id,
      employeeId: `EMP${Date.now()}`,
      departmentId: department.id,
      designation: "Lecturer",
    },
  });

  console.log(`Seeded INSTRUCTOR account: ${user.email}`);
};

export const seedStudent = async () => {
  const existing = await prisma.user.findUnique({
    where: { email: config.student_email },
  });
  if (existing) return;

  const program = await prisma.program.findFirst();
  if (!program) {
    console.log(
      "Skipped seeding demo student: no program exists yet (run again after Phase 4).",
    );
    return;
  }

  const hashedPassword = await bcrypt.hash(
    config.student_password,
    Number(config.bcrypt_salt_rounds),
  );
  const user = await prisma.user.create({
    data: {
      name: config.student_name,
      email: config.student_email,
      password: hashedPassword,
      role: "STUDENT",
    },
  });

  await prisma.studentProfile.create({
    data: {
      userId: user.id,
      studentId: `STU${Date.now()}`,
      programId: program.id,
      batch: new Date().getFullYear(),
    },
  });

  console.log(`Seeded STUDENT account: ${user.email}`);
};
