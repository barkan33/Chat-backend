import { ObjectId } from "mongodb"

export type Message = {
    _id?: ObjectId,
    content: string,
    senderId: ObjectId,
    receiverId: ObjectId,
    createdAt: number
}
export type Chat = {
    _id?: ObjectId,
    participants: ObjectId[]
    messages?: Message[]
}
export type User = {
    _id?: ObjectId,
    username: string,
    password: string,
    email: string
}