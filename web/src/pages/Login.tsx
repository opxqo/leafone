import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Eye, EyeOff, Lock, User } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen">
      {/* Left: Brand */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-[#2c6947] via-[#3e8057] to-[#60a176]">
        <div className="absolute inset-0 bg-[url('https://image.opxqo.cn/login/top.webp')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 text-center text-white">
          <div className="mb-4 text-6xl">🍃</div>
          <h1 className="mb-2 text-5xl font-extrabold leading-tight">城院圈</h1>
          <p className="mb-1 text-base font-medium text-white/80">武汉城市学院校园论坛</p>
          <p className="text-sm text-white/60">连接每一位城院学子</p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex flex-1 items-center justify-center bg-background p-10">
        <div className="w-full max-w-[400px]">
          <h2 className="mb-1.5 text-3xl font-extrabold text-foreground">欢迎回来</h2>
          <p className="mb-8 text-sm text-muted-foreground">登录你的城院圈账号</p>

          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <div className="relative">
              <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="用户名 / 学号 / 手机号"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-10 pr-10"
                type={showPassword ? 'text' : 'password'}
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <Checkbox /> 记住我
              </Label>
              <a className="text-sm font-semibold text-primary hover:underline" href="#">忘记密码？</a>
            </div>

            <Button type="submit" className="w-full rounded-xl py-2.5 text-base">
              登录
            </Button>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Separator className="flex-1" />
              <span>或</span>
              <Separator className="flex-1" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" type="button" className="gap-2 rounded-xl">
                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm3.2 4.127c-3.998 0-7.24 2.776-7.24 6.198 0 3.422 3.242 6.198 7.24 6.198.85 0 1.67-.13 2.44-.363a.68.68 0 0 1 .562.077l1.5.877a.257.257 0 0 0 .131.043.233.233 0 0 0 .228-.232c0-.057-.023-.113-.038-.167l-.306-1.165a.465.465 0 0 1 .167-.523C21.822 19.593 22.8 17.91 22.8 16.316c0-3.422-3.242-6.198-7.002-6.198zm-2.515 3.34c.504 0 .913.416.913.927a.92.92 0 0 1-.913.926.92.92 0 0 1-.912-.926c0-.511.41-.927.913-.927zm4.56 0c.504 0 .912.416.912.927a.92.92 0 0 1-.913.926.92.92 0 0 1-.912-.926c0-.511.41-.927.913-.927z"/></svg>
                微信登录
              </Button>
              <Button variant="outline" type="button" className="gap-2 rounded-xl">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                校园SSO
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              还没有账号？<Link to="/register" className="ml-1 font-bold text-primary hover:underline">立即注册</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
