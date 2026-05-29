import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('admin@nicsan.com')
  const [password, setPassword] = useState('password')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{minHeight:'100vh',background:'#0f0f13',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter,sans-serif',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:'20%',left:'15%',width:'300px',height:'300px',borderRadius:'50%',background:'radial-gradient(circle,rgba(124,58,237,0.12) 0%,transparent 70%)',pointerEvents:'none'}} />
      <div style={{position:'absolute',bottom:'20%',right:'15%',width:'250px',height:'250px',borderRadius:'50%',background:'radial-gradient(circle,rgba(79,70,229,0.1) 0%,transparent 70%)',pointerEvents:'none'}} />

      <div style={{width:'100%',maxWidth:'420px',padding:'0 20px'}}>
        <div style={{textAlign:'center',marginBottom:'32px'}}>
          <div style={{width:'56px',height:'56px',borderRadius:'16px',background:'linear-gradient(135deg,#7c3aed,#4f46e5)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',boxShadow:'0 0 30px rgba(124,58,237,0.4)'}}>
            <Shield style={{width:'28px',height:'28px',color:'white'}} />
          </div>
          <h1 style={{fontSize:'28px',fontWeight:'800',color:'#f1f5f9',margin:'0 0 6px',letterSpacing:'-0.5px'}}>Nicsan CRM</h1>
          <p style={{fontSize:'14px',color:'#475569',margin:0}}>Insurance Policy Management</p>
        </div>

        <div style={{background:'rgba(255,255,255,0.03)',borderRadius:'20px',border:'1px solid rgba(255,255,255,0.08)',padding:'32px',backdropFilter:'blur(20px)'}}>
          <h2 style={{fontSize:'20px',fontWeight:'700',color:'#f1f5f9',margin:'0 0 6px'}}>Sign in</h2>
          <p style={{fontSize:'13px',color:'#475569',margin:'0 0 24px'}}>Enter your credentials to continue</p>

          <form onSubmit={handleLogin} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            <div>
              <label style={{fontSize:'12px',fontWeight:'500',color:'#94a3b8',display:'block',marginBottom:'6px'}}>Email Address</label>
              <div style={{position:'relative'}}>
                <Mail style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',width:'15px',height:'15px',color:'#475569'}} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  style={{width:'100%',paddingLeft:'38px',paddingRight:'14px',paddingTop:'11px',paddingBottom:'11px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'10px',fontSize:'13px',color:'#e2e8f0',outline:'none',boxSizing:'border-box'}}
                  placeholder="admin@nicsan.com" />
              </div>
            </div>

            <div>
              <label style={{fontSize:'12px',fontWeight:'500',color:'#94a3b8',display:'block',marginBottom:'6px'}}>Password</label>
              <div style={{position:'relative'}}>
                <Lock style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',width:'15px',height:'15px',color:'#475569'}} />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  style={{width:'100%',paddingLeft:'38px',paddingRight:'40px',paddingTop:'11px',paddingBottom:'11px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'10px',fontSize:'13px',color:'#e2e8f0',outline:'none',boxSizing:'border-box'}}
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#475569',padding:0}}>
                  {showPassword ? <EyeOff style={{width:'15px',height:'15px'}} /> : <Eye style={{width:'15px',height:'15px'}} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',padding:'12px',borderRadius:'10px',background:'linear-gradient(135deg,#7c3aed,#4f46e5)',color:'white',border:'none',cursor:'pointer',fontSize:'14px',fontWeight:'600',marginTop:'8px',boxShadow:'0 0 24px rgba(124,58,237,0.4)',opacity:loading?0.7:1}}>
              {loading ? 'Signing in...' : (<>Sign In <ArrowRight style={{width:'15px',height:'15px'}} /></>)}
            </button>
          </form>

          <div style={{marginTop:'20px',padding:'14px',borderRadius:'10px',background:'rgba(124,58,237,0.08)',border:'1px solid rgba(124,58,237,0.15)'}}>
            <p style={{fontSize:'11px',color:'#7c3aed',fontWeight:'600',margin:'0 0 4px'}}>Demo Credentials</p>
            <p style={{fontSize:'12px',color:'#94a3b8',margin:'0 0 2px'}}>admin@nicsan.com</p>
            <p style={{fontSize:'12px',color:'#94a3b8',margin:0}}>password</p>
          </div>
        </div>
      </div>
    </div>
  )
}