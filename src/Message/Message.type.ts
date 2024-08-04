import { ObjectId } from "mongodb"

export type Message = {
    _id?: ObjectId,
    sender: ObjectId
    receiver: ObjectId,
    content: string
    createdAt?: number
}