
import { prisma } from "../../lib/prisma";

const getAllUniversities = async () => prisma.university.findMany();

export const UniversityService = { getAllUniversities };