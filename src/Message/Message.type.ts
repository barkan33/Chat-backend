import { ObjectId } from "mongodb"
import { User } from "../User/User.type"

export type Message = {
    _id: ObjectId,
    content: string,
    senderId: ObjectId,
    createdAt: number
}
export type Chat = {
    _id?: ObjectId,
    participants: ObjectId[]
    messages?: Message[]
    userDetails?: User[]
}
