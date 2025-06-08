import { HydratedDocument } from 'mongoose';
import { AbstractSchema } from '@/database/schemas';
export type UserDocument = HydratedDocument<User>;
export declare class User extends AbstractSchema {
    name: string;
    email: string;
    password: string;
    status: string;
    socialProvider: string;
    image: string;
    verify: boolean;
    verificationCode: string;
    role: string;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, import("mongoose").Document<unknown, any, User, any> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<User>, {}> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
