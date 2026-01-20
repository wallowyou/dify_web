'use client'

import { clsx } from 'clsx'
import { useState } from 'react'
import s from './page.module.css'

type AuthType = 'password' | 'code'

export default function ShensiSignin() {
  const [authType, setAuthType] = useState<AuthType>('password')
  return (
    <div className="h-[480px] w-[500px] min-w-[450px] overflow-hidden rounded-[16px]  border-indigo-500 bg-[#fff]" style={{ boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.16)' }}>
      <div className="min-h-0 w-full flex-1 px-[56px]">
        <div className="w-full pb-[36px] pt-[49px] text-[26px] font-semibold text-[#191919]">欢迎登录！</div>
        <div className="tabs-container flex gap-6 pb-[24px]">
          <button
            type="button"
            className={clsx(s.tabButton, authType === 'password' && s.tabButtonActive)}
            onClick={() => setAuthType('password')}
          >
            密码登录
            <span className={s.tabUnderline} style={{ width: '32px', bottom: '-5px' }} />
          </button>
          <button
            type="button"
            className={clsx(s.tabButton, authType === 'code' && s.tabButtonActive)}
            onClick={() => setAuthType('code')}
          >
            短信登录
            <span className={s.tabUnderline} style={{ width: '32px', bottom: '-5px' }} />
          </button>
        </div>
        <div className={s.formPanel}>
          {authType === 'password' && (
            <div className="text-[14px] text-[#666]">密码登录表单区域</div>
          )}
          {authType === 'code' && (
            <div className="text-[14px] text-[#666]">短信验证码登录表单区域</div>
          )}
        </div>
      </div>
    </div>
  )
}
