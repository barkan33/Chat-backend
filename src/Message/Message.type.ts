import { ObjectId } from "mongodb"

export type Message = {
    _id: ObjectId,
    content: string,
    senderId: ObjectId,
    // receiverId: ObjectId,
    createdAt: number
}
export type Chat = {
    _id?: ObjectId,
    participants: ObjectId[]
    messages?: Message[]
}
