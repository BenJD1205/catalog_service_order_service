import { InferSelectModel, relations, InferInsertModel } from "drizzle-orm";
import { pgTable, serial, integer, timestamp, varchar, numeric } from "drizzle-orm/pg-core";

export const orders = pgTable("carts", {
    id: serial("id").primaryKey(),
    orderNumber: integer("order_number").notNull().unique(),
    customerId: integer("customer_id").notNull(),
    amount: numeric("amount").notNull(),
    status: varchar("status").notNull(),
    txnId: varchar("txn_id").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export type Order = InferSelectModel<typeof orders>;

export const orderLineItems = pgTable("order_line_items", {
    id: serial("id").primaryKey(),
    itemName: varchar("item_name").notNull(),
    qty: integer("qty").notNull(),
    price: numeric("amount").notNull(),
    orderId: integer("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export type OrderLineItem = InferInsertModel<typeof orderLineItems>

export const orderRelations = relations(orders, ({ many }) => ({
    lineItems: many(orderLineItems),
}))

export const orderItemsRelations = relations(orderLineItems, ({ one }) => ({
    order: one(orders, {
        fields: [orderLineItems.orderId],
        references: [orders.id],
    })
}))