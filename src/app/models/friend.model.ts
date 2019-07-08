import { UserInfoModel } from './userInfo.model';
export class FriendModel {
    id: string;
    userId: string;
    friends: string[];

    constructor() {
        this.friends = [];
    }
}
