
import { pgTable, timestamp, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

const userSchema = pgTable('users', {
    id: uuid().primaryKey().default(sql`gen_random_uuid()`),
    name: varchar('name', { length: 30 }).notNull(),
    email: text('email').notNull().unique(),
    phone: varchar('phone', { length: 15 }).notNull().unique(),
    message: text('message'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});


const registerAdmin = pgTable('admin_register', {
    id: uuid().primaryKey().default(sql`gen_random_uuid()`),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export { userSchema, registerAdmin };

