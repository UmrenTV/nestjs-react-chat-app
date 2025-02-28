import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './message.schema';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Message.name)
        private readonly messageModel: Model<Message>,
    ) {}

    async getAllMessages() {
        return this.messageModel.find().sort({ createdAt: 1 }).exec();
    }

    async createMessage(sender: string, content: string) {
        const newMessage = new this.messageModel({ sender, content });
        return newMessage.save();
    }
}
