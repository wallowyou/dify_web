import { post } from './base'

type LoginByPassParams = {
  phoneNumber: string
  password: string
}
export const loginByPass = ({ body }: { body: LoginByPassParams }): Promise<any> => {
  return post<any>('/auth/login/phone-password', { body }, { isThirdPartyAPI: true })
}
