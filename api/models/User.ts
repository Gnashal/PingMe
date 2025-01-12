import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
    username: string, 
    password: string
}

const UserSchema = new Schema<IUser>({
    username: {type: String, unique : true, required: true} ,
    password: {type: String,  required: true}
}, {timestamps: true});

const UserModel = model<IUser>('user', UserSchema);

export default UserModel;

