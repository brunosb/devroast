import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const severityEnum = pgEnum("severity", ["critical", "warning", "good"]);

export const verdictEnum = pgEnum("verdict", [
  "disaster",
  "needs_serious_help",
  "not_great",
  "acceptable",
  "clean_code",
]);

export const roasts = pgTable("roasts", {
  id: uuid().defaultRandom().primaryKey(),
  code: text().notNull(),
  language: varchar({ length: 50 }).notNull(),
  lineCount: integer().notNull(),
  brutalMode: boolean().notNull(),
  score: real().notNull(),
  verdict: verdictEnum().notNull(),
  roastText: text().notNull(),
  diff: text(),
  createdAt: timestamp().defaultNow().notNull(),
});

export const issues = pgTable("issues", {
  id: uuid().defaultRandom().primaryKey(),
  roastId: uuid()
    .notNull()
    .references(() => roasts.id, { onDelete: "cascade" }),
  severity: severityEnum().notNull(),
  title: varchar({ length: 200 }).notNull(),
  description: text().notNull(),
});

export const stats = pgTable("stats", {
  id: integer().primaryKey().default(1),
  totalRoasts: integer().notNull().default(0),
  avgScore: real().notNull().default(0),
  updatedAt: timestamp().defaultNow().notNull(),
});

export type Roast = typeof roasts.$inferSelect;
export type NewRoast = typeof roasts.$inferInsert;
export type Issue = typeof issues.$inferSelect;
export type NewIssue = typeof issues.$inferInsert;
export type Stats = typeof stats.$inferSelect;
