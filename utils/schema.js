import { serial, text, varchar } from "drizzle-orm/pg-core"; 
import { pgTable } from "drizzle-orm/pg-core";

export const MockInterview = pgTable('mockInterview', {
    id: serial('id').primaryKey(),
    jsonMockResp: text('jsonMockResp').notNull(),
    jobPosition: varchar('jobPosition', { length: 255 }).notNull(), 
    jobDesc: varchar('jobDesc', { length: 255 }).notNull(), 
    jobExp: varchar('jobExp', { length: 255 }).notNull(), 
    createdBy: varchar('createdBy', { length: 255 }).notNull(), 
    createdAt: varchar('createdAt', { length: 255 }).notNull(), 
    mockId: varchar('mockId', { length: 255 }).notNull(), 
});

export const UserAnswer=pgTable('UserAnswer',{
    id: serial('id').primaryKey(),
    mockId: varchar('mockId', { length: 255 }).notNull(), 
    question:varchar('question', { length: 255 }).notNull(),
    correctAns:text('correctAns'),
    userAns:text('userAns'),
    feedback:text('feedback'),
    rating:varchar('rating', { length: 255 }),
    userEmail:varchar('userEmail', { length: 255 }),
    createdAt: varchar('createdAt', { length: 255 }).notNull(), 


});