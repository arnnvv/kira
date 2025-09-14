import {
  type SafeParseReturnType,
  type ZodObject,
  type ZodString,
  z,
} from "zod";

export const emailSchema: ZodObject<{
  email: ZodString;
}> = z.object({
  email: z
    .string({
      invalid_type_error: "invalid email",
    })
    .email(),
});

export type Email = z.infer<typeof emailSchema>;

export const validateEmail = (data: Email): boolean => {
  const result: SafeParseReturnType<Email, Email> = emailSchema.safeParse(data);
  return result.success;
};
