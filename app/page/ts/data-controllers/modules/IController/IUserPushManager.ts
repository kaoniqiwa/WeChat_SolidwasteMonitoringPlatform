import { WeChatUser } from '../../../../../data-core/model/we-chat'

export interface IUserPushManager {
  GetUser(id: string): Promise<WeChatUser>
  SetUser(user: WeChatUser): void
}
