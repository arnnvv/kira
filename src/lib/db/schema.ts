import { relations } from "drizzle-orm";
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

export const merchantRelations = relations(merchant, ({ many }) => ({
  link: many(link),
}));

export const link = createTable("link", {
  id: varchar("id", { length: 21 }).primaryKey(),
  merchantId: varchar("merchant_id", { length: 21 })
    .notNull()
    .references(() => merchant.id),
  url: varchar("url", { length: 255 }).notNull(),
});

export type Link = typeof link.$inferSelect;
export type NewLink = typeof link.$inferInsert;

export const linkRelations = relations(link, ({ one }) => ({
  merchant: one(merchant, {
    fields: [link.merchantId],
    references: [merchant.id],
  }),
}))
  ;

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
