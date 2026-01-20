import Footer from './_footer'
import Header from './_header'
import loginBg from './assets/login-bg.webp'

export default function ShensiSigninLayout({ children }: { children: React.ReactNode }) {
  const bgSrc = typeof loginBg === 'string' ? loginBg : (loginBg as { src: string }).src
  return (
    <div className="flex h-full min-w-[600px] flex-col overflow-auto">
      <Header />
      <div
        style={{ backgroundImage: `url(${bgSrc})` }}
        className="login flex h-auto h-full min-w-[900px] flex-auto items-center justify-end overflow-auto bg-cover bg-center pr-40"
      >
        {children}
      </div>
      <Footer />
    </div>
  )
}
