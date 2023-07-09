import { UserInfo } from "../../type";
import { GetScriptListInfoParams, PlatformInfo, ScriptInfo, ScriptStatInfo } from "../mysql";

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
    createScript(content: ScriptInfo): Promise<void>;
    getScriptList(param: GetScriptListInfoParams & { userId: number }): Promise<ScriptInfo[]>;
    getScriptInfoByUid(userID: number, scriptUid: string): Promise<ScriptInfo | null>;
    getScriptListByUserId(param: GetScriptListInfoParams & { userId: number }): Promise<ScriptInfo[] | null>
    getUserLikeScriptList(param: GetScriptListInfoParams & { userId: number }): Promise<ScriptInfo[] | null>
    getUserFavoriteScriptList(param: GetScriptListInfoParams & { userId: number }): Promise<ScriptInfo[] | null>
}

export interface PlatformStore {
    getPlatformList(): Promise<PlatformInfo[]>;
}

export interface ScriptStatStore {
    insert(uid: string): Promise<void>;
    update(params: ScriptStatInfo): Promise<void>;
}

export interface UserScriptFavoriteStore {
    favorite(userId: number, scriptId: string): Promise<number>;
    unfavorite(userId: number, scriptId: string): Promise<number>;
}

export interface UserScriptLikeStore {
    like(userId: number, scriptId: string): Promise<number>;
    unlike(userId: number, scriptId: string): Promise<number>;
}

export interface UserScriptStore {
    createUserScript(userId: number, scriptId: string): Promise<void>;
}
