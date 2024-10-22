import type { Prisma } from "@prisma/client";
import { z } from "zod";

const UserSchema = z.object({
	id: z.string().cuid2().optional(),
	slug: z.string().min(1).max(32),
	name: z.string().min(1).max(255),
	ip: z.string().ip(),
	isArchived: z.boolean().optional(),
}) satisfies z.ZodType<Prisma.UserCreateInput>;
