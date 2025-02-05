import { model, Schema, Types } from "mongoose"

export interface IMessage extends Document {
    from: Types.ObjectId ,
    to: Types.ObjectId ,
    message: string
}

const MessageSchema = new Schema<IMessage>(
    {
    from: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        require: true,
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'user' ,
        require: true
    },
    message: {type: String, required: true}
}, {timestamps: true});

const MessageModel = model<IMessage>('message', MessageSchema);

export default MessageModel;