import { pgTableCreator, timestamp, varchar } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator(
  (name: string): string => `kira_${name}`,
);

export const merchant = createTable("merchant", {
  id: varchar("id", { length: 21 }).primaryKey(),
  name: varchar("name"),
  email: varchar("email", { length: 255 }).unique().notNull(),
  number: varchar("number").unique(),
  password: varchar("password", { length: 255 }).notNull(),
});

export type Merchant = typeof merchant.$inferSelect;
export type NewMerchant = typeof merchant.$inferInsert;

export const sessions = createTable("sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 21 })
    .notNull()
    .references(() => merchant.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
