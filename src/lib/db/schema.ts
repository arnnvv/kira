import { boolean, pgTableCreator, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

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

export const link = createTable("link", {
  id: varchar("id").primaryKey(),
  merchantId: varchar("merchant_id")
    .notNull()
    .references(() => merchant.id),
  url: varchar("url", { length: 255 }).notNull(),
  isverified: boolean("isverified").default(false),
  upi: varchar("upi", { length: 20 }).notNull(),
});

export type Link = typeof link.$inferSelect;
export type NewLink = typeof link.$inferInsert;
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
