import JSEncrypt from 'jsencrypt'

const setPublicCode = (val: string) => {
  if (!val)
    return
  const publicKey = process.env.VITE_PUBLIC_KEY as string
  const encrypt = new JSEncrypt()
  // 设置公钥
  encrypt.setPublicKey(publicKey)
  // 加密消息
  const encrypted = encrypt.encrypt(val)
  return encrypted
}

export default setPublicCode
