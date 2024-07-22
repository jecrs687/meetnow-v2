import { Message, MessageMedia } from "@prisma/client";

export class MessageSend implements Omit
    <
        Message,
        'id' | 'replyId' | 'userId' | 'forwardFromId' | 'deletedAt'
        | 'updatedAt' | 'forwardFromId'
    > {

    id: string;
    chatId: string;
    text: string;
    medias: Omit<MessageMedia, 'id' | 'messageId' | 'message'>[]
    createdAt: Date;

    constructor(chatId: string) {
        this.chatId = chatId;
        this.text = '';
        this.createdAt = new Date();
    }

    setText(text: string) {
        this.text = text;
    }

    addMedia(media: Omit<MessageMedia, 'id' | 'messageId' | 'message'>) {
        this.medias.push(media);
    }

    toString() {
        return JSON.stringify(this);
    }

}