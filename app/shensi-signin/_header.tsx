import Image from 'next/image'
import logo from './assets/favicon.png'

export const Header = () => {
  return (
    <div
      className="auth-title flex h-[80px] cursor-pointer items-center pl-[15px]"
    >
      <Image src={logo} alt="logo" width={32} height={32} className="mr-4" />
      <span className="text-2xl font-bold">深思AIP平台</span>
    </div>
  )
}
export default Header
