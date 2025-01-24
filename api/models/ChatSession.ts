import { Schema, Document, model, Types } from "mongoose";

export interface IChatSession extends Document {
    participants: Types.ObjectId[] ,
};


const ChatSessionSchema = new Schema <IChatSession>(
    {
        participants: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            require: true,
        }]
    }, {timestamps: true}
);

const ChatSessionModel = model<IChatSession>('chatsession', ChatSessionSchema);

export default ChatSessionModel;

