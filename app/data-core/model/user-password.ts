export class ChangeUserPasswordParams {
  /**	String	密码	M */
  Password!: string
}
export class CheckCodeParams {
  /**	String	手机号码	M */
  MobileNo!: string
  /**	String	效验码	M */
  CheckCode!: string
}
export class RandomUserPaswordParams {
  /**	Int32	有效日期数量[1-365]	M */
  Days!: number
}

export class VerificationCodeResult {
  /**	Boolean	成功：true，失败：false	M */
  success!: boolean
  /**	String	备注	M */
  remark!: string
}

export class PasswordCheckCodeResult {
  /**	Boolean	是否认证成功	M	R */
  Result!: boolean
  /**	String	跳转地址	O	R */
  RedirectUrl?: string
}
