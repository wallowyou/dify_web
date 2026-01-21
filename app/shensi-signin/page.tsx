'use client'
import { clsx } from 'clsx'
import { useState } from 'react'

import { getThirdParty } from '@/service/base'
import { loginByPass } from '@/service/shensi'
import s from './page.module.css'
import setPublicCode from './utils'

type AuthType = 'password' | 'code'

type FormData = {
  phone: string
  password: string
  code: string
}

type FormErrors = {
  phone?: string
  password?: string
  code?: string
}

export default function ShensiSignin() {
  const [authType, setAuthType] = useState<AuthType>('password')
  const [formData, setFormData] = useState<FormData>({
    phone: '',
    password: '',
    code: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [countdown, setCountdown] = useState(0)

  // 验证手机号
  const validatePhone = (phone: string): string | undefined => {
    if (!phone) {
      return '请输入手机号'
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return '请输入正确的手机号'
    }
    return undefined
  }

  // 验证密码
  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return '请输入密码'
    }
    if (password.length < 6) {
      return '密码至少6位'
    }
    return undefined
  }

  // 验证验证码
  const validateCode = (code: string): string | undefined => {
    if (!code) {
      return '请输入验证码'
    }
    if (!/^\d{6}$/.test(code)) {
      return '请输入6位数字验证码'
    }
    return undefined
  }

  // 处理输入变化
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // 实时验证
    if (touched[field]) {
      let error: string | undefined
      if (field === 'phone') {
        error = validatePhone(value)
      }
      else if (field === 'password') {
        error = validatePassword(value)
      }
      else if (field === 'code') {
        error = validateCode(value)
      }
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  // 处理失焦
  const handleBlur = (field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }))

    let error: string | undefined
    if (field === 'phone') {
      error = validatePhone(formData.phone)
    }
    else if (field === 'password') {
      error = validatePassword(formData.password)
    }
    else if (field === 'code') {
      error = validateCode(formData.code)
    }
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  // 发送验证码
  const handleSendCode = async () => {
    const phoneError = validatePhone(formData.phone)
    if (phoneError) {
      setErrors(prev => ({ ...prev, phone: phoneError }))
      setTouched(prev => ({ ...prev, phone: true }))
      return
    }

    // 开始倒计时
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // TODO: 调用发送验证码接口
    const response = await getThirdParty('/system/open/captcha/generate')
    console.warn('发送验证码到:', response)
  }

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 验证所有字段
    const newErrors: FormErrors = {}
    newErrors.phone = validatePhone(formData.phone)

    if (authType === 'password') {
      newErrors.password = validatePassword(formData.password)
    }
    else {
      newErrors.code = validateCode(formData.code)
    }

    setErrors(newErrors)
    setTouched({ phone: true, password: true, code: true })

    // 检查是否有错误
    const hasErrors = Object.values(newErrors).some(error => error !== undefined)
    if (hasErrors)
      return

    setIsSubmitting(true)
    try {
      // 调用登录接口,加密密码
      const encryptedPassword = setPublicCode(formData.password) as string
      const response = await loginByPass({ body: { phoneNumber: formData.phone, password: encryptedPassword } })
      console.warn('登录成功:', response)
    }
    catch (error) {
      console.error('登录失败:', error)
    }
    finally {
      setIsSubmitting(false)
    }
  }

  // 切换登录方式时清空错误
  const handleAuthTypeChange = (type: AuthType) => {
    setAuthType(type)
    setErrors({})
    setTouched({})
  }

  return (
    <div className="h-[520px] w-[500px] min-w-[450px] overflow-hidden rounded-[16px] border border-gray-200 bg-white" style={{ boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.16)' }}>
      <div className="min-h-0 w-full flex-1 px-[56px]">
        <div className="w-full pb-[36px] pt-[49px] text-[26px] font-semibold text-[#191919]">欢迎登录！</div>
        <div className="tabs-container flex gap-6 pb-[24px]">
          <button
            type="button"
            className={clsx(s.tabButton, authType === 'password' && s.tabButtonActive)}
            onClick={() => handleAuthTypeChange('password')}
          >
            密码登录
            <span className={s.tabUnderline} style={{ width: '32px', bottom: '-5px' }} />
          </button>
          <button
            type="button"
            className={clsx(s.tabButton, authType === 'code' && s.tabButtonActive)}
            onClick={() => handleAuthTypeChange('code')}
          >
            验证码登录
            <span className={s.tabUnderline} style={{ width: '32px', bottom: '-5px' }} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className={s.formPanel}>
          {/* 手机号输入 */}
          <div className="mb-4">
            <input
              type="tel"
              placeholder="请输入手机号"
              value={formData.phone}
              onChange={e => handleChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              className={clsx(
                'w-full rounded-lg border px-4 py-3 text-base outline-none transition-all duration-200',
                'placeholder:text-gray-400',
                'focus:border-blue-500 focus:ring-2 focus:ring-blue-100',
                errors.phone && touched.phone
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 bg-white hover:border-gray-400',
              )}
            />
            {errors.phone && touched.phone && (
              <p className="mt-1.5 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* 密码登录 */}
          {authType === 'password' && (
            <div className="mb-6">
              <input
                type="password"
                placeholder="请输入密码"
                value={formData.password}
                onChange={e => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                className={clsx(
                  'w-full rounded-lg border px-4 py-3 text-base outline-none transition-all duration-200',
                  'placeholder:text-gray-400',
                  'focus:border-blue-500 focus:ring-2 focus:ring-blue-100',
                  errors.password && touched.password
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 bg-white hover:border-gray-400',
                )}
              />
              {errors.password && touched.password && (
                <p className="mt-1.5 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
          )}

          {/* 验证码登录 */}
          {authType === 'code' && (
            <div className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="请输入验证码"
                  value={formData.code}
                  onChange={e => handleChange('code', e.target.value)}
                  onBlur={() => handleBlur('code')}
                  maxLength={6}
                  className={clsx(
                    'flex-1 rounded-lg border px-4 py-3 text-base outline-none transition-all duration-200',
                    'placeholder:text-gray-400',
                    'focus:border-blue-500 focus:ring-2 focus:ring-blue-100',
                    errors.code && touched.code
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 bg-white hover:border-gray-400',
                  )}
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={countdown > 0}
                  className={clsx(
                    'whitespace-nowrap rounded-lg px-5 py-3 text-sm font-medium transition-all duration-200',
                    countdown > 0
                      ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                      : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700',
                  )}
                >
                  {countdown > 0 ? `${countdown}秒后重试` : '获取验证码'}
                </button>
              </div>
              {errors.code && touched.code && (
                <p className="mt-1.5 text-sm text-red-500">{errors.code}</p>
              )}
            </div>
          )}

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={clsx(
              'w-full rounded-lg py-3 text-base font-semibold transition-all duration-200',
              isSubmitting
                ? 'cursor-not-allowed bg-blue-400 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:bg-blue-800',
            )}
          >
            {isSubmitting ? '登录中...' : '登录'}
          </button>
        </form>
      </div>
    </div>
  )
}
