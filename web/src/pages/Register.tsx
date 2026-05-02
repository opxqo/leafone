import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, User, IdCard, Building2, Phone, KeyRound, Lock, Eye, EyeOff } from 'lucide-react'

const fields = [
  { key: 'name', label: '姓名', icon: User, type: 'text' },
  { key: 'studentId', label: '学号', icon: IdCard, type: 'text' },
  { key: 'college', label: '学院', icon: Building2, type: 'select' },
  { key: 'phone', label: '手机号', icon: Phone, type: 'tel' },
  { key: 'code', label: '验证码', icon: KeyRound, type: 'text', hasAction: true },
  { key: 'password', label: '设置密码', icon: Lock, type: 'password', hasToggle: true },
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen">
      {/* Left: Brand */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-[#2c6947] via-[#3e8057] to-[#60a176]">
        <div className="absolute inset-0 bg-[url('https://image.opxqo.cn/login/top.webp')] bg-cover bg-center opacity-15" />
        <div className="relative z-10 text-center text-white">
          <div className="mb-4 text-5xl">🍃</div>
          <h1 className="mb-2 text-4xl font-extrabold leading-tight">加入城院圈</h1>
          <p className="text-sm text-white/75">与万千城院学子一起交流</p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex flex-1 items-center justify-center overflow-y-auto bg-background p-10">
        <div className="w-full max-w-[420px]">
          <Link to="/login" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary">
            <ArrowLeft className="size-4" /> 返回登录
          </Link>

          <h2 className="mb-1.5 text-2xl font-extrabold text-foreground">注册新账号</h2>
          <p className="mb-6 text-sm text-muted-foreground">填写以下信息完成注册</p>

          <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
            {fields.map((field) => (
              <div key={field.key} className="relative">
                <field.icon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                {field.type === 'select' ? (
                  <select
                    className="flex h-9 w-full rounded-lg border border-input bg-transparent pl-10 pr-3 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                    value={form[field.key] ?? ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                  >
                    <option value="" disabled>{field.label}</option>
                    <option value="cs">计算机学院</option>
                    <option value="art">传媒与设计学院</option>
                    <option value="business">商学院</option>
                  </select>
                ) : (
                  <Input
                    className="pl-10"
                    type={field.hasToggle ? (showPassword ? 'text' : 'password') : field.type}
                    placeholder={field.label}
                    value={form[field.key] ?? ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                  />
                )}
                {field.hasAction && (
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-primary/10 px-3 py-1 text-xs font-bold text-primary hover:bg-primary/20">
                    发送验证码
                  </button>
                )}
                {field.hasToggle && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                )}
              </div>
            ))}

            <Label className="flex items-start gap-2 text-sm text-muted-foreground cursor-pointer">
              <Checkbox className="mt-0.5" />
              <span>我已阅读并同意 <a className="font-semibold text-primary hover:underline" href="#">用户协议</a> 和 <a className="font-semibold text-primary hover:underline" href="#">隐私政策</a></span>
            </Label>

            <Button type="submit" className="w-full rounded-xl py-2.5 text-base">
              注册
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              已有账号？<Link to="/login" className="ml-1 font-bold text-primary hover:underline">立即登录</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
