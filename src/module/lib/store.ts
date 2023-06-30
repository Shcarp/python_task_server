import { UserInfo } from "../../type";

export type CreatorUser = Omit<UserInfo, "id" | "last_active" | "created_at" | "updated_at" | "profile_picture">;
export interface UserStore {
    checkUsernameExist(username: string): Promise<boolean>;
    insertUser(user: CreatorUser): Promise<void>;
    checkUserPassword(username: string, password: string): Promise<UserInfo | null>;
    updateUserLastActive(id: number): Promise<void>;
    updateUserInfo(id: number, user: CreatorUser): Promise<void>;
    getUserInfo(username: string): Promise<UserInfo | null>;
    checkEmailCorrect(username: string, email: string): Promise<boolean>;
    updateUserPassword(email: string, password: string): Promise<void>;
    updateUserProfilePicture(id: number, profile_picture: string): Promise<void>;
}

export interface ScriptStore {

}

export interface PlatformStore {}

export interface ScriptStatStore {}

export interface UserScriptFavoriteStore {}

export interface UserScriptStore {}
