import { Producer, Consumer } from "kafkajs";
import { MessageBroker } from "src/utils";
import { HandleSubscription } from "./order.service";
import { OrderEvent } from "src/types";
//initialized the broker
export const InitializeBroker = async () => {
    const producer = await MessageBroker.connectConsumer<Producer>();
    producer.on("producer.connect", async () => {
        console.log("Order Service Producer connected successfully");
    })

    const consumer = await MessageBroker.connectConsumer<Consumer>();
    consumer.on("consumer.connect", async () => {
        console.log("Order Service Consumer connected successfully");
    })

    //keep listening to consumers events
    //perform the action based on the event
    await MessageBroker.subscribe(HandleSubscription, "OrderEvents");
}

//publish dedicated events based on usecases
export const SendCreateOrderMessage = async (data: any) => {
    await MessageBroker.publish({
        event: OrderEvent.CREATE_ORDER,
        topic: "CatalogEvents",
        headers: {},
        message: data,
    })
}

export const SendOrderCanceledMessage = async (data: any) => {
    await MessageBroker.publish({
        event: OrderEvent.CANCEL_ORDER,
        topic: "CatalogEvents",
        headers: {},
        message: data,
    })
}