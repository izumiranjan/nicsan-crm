import { useState, useEffect } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import toast from 'react-hot-toast'
import { Shield, Upload, LogOut, FileText, CheckCircle, XCircle, Clock, Search, Bell, TrendingUp } from 'lucide-react'
import PolicyTable from '../components/PolicyTable'
import PlasmaBackground from '../components/PlasmaBackground'
import UploadModal from '../components/UploadModal'

const socket = io('http://localhost:5000')

export default function Dashboard() {
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const [search, setSearch] = useState('')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')

  const fetchPolicies = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/policies', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPolicies(res.data)
    } catch (err) {
      toast.error('Failed to fetch policies')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPolicies()
    socket.on('policy_added', (policy) => { setPolicies(prev => [policy, ...prev]); toast.success('New policy added!') })
    socket.on('policy_updated', (policy) => { setPolicies(prev => prev.map(p => p.id === policy.id ? policy : p)) })
    socket.on('policy_deleted', ({ id }) => { setPolicies(prev => prev.filter(p => p.id !== parseInt(id))) })
    return () => { socket.off('policy_added'); socket.off('policy_updated'); socket.off('policy_deleted') }
  }, [])

  const handleLogout = () => { localStorage.clear(); window.location.href = '/login' }

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/policies/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } })
    } catch (err) { toast.error('Failed to update status') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this policy?')) return
    try {
      await axios.delete(`http://localhost:5000/api/policies/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    } catch (err) { toast.error('Failed to delete policy') }
  }

  const filtered = policies.filter(p =>
    p.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.policy_number?.toLowerCase().includes(search.toLowerCase()) ||
    p.vehicle_number?.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: policies.length,
    active: policies.filter(p => p.status === 'active').length,
    expired: policies.filter(p => p.status === 'expired').length,
    pending: policies.filter(p => p.status === 'pending').length,
  }

  const totalPremium = policies.reduce((sum, p) => sum + Number(p.premium || 0), 0)

  return (
    <div style={{minHeight:'100vh',background:'#0f0f13',color:'#e2e8f0',fontFamily:'Inter,sans-serif'}}>
      {/* Navbar */}
      <nav style={{background:'rgba(255,255,255,0.03)',borderBottom:'1px solid rgba(255,255,255,0.08)',position:'sticky',top:0,zIndex:10,backdropFilter:'blur(20px)'}}>
        <div style={{maxWidth:'1280px',margin:'0 auto',padding:'14px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            <div style={{width:'36px',height:'36px',borderRadius:'10px',background:'linear-gradient(135deg,#7c3aed,#4f46e5)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Shield style={{width:'18px',height:'18px',color:'white'}} />
            </div>
            <div>
              <div style={{fontSize:'15px',fontWeight:'700',color:'#f1f5f9',letterSpacing:'-0.3px'}}>Nicsan CRM</div>
              <div style={{fontSize:'11px',color:'#64748b'}}>Insurance Management</div>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            <div style={{width:'32px',height:'32px',borderRadius:'8px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
              <Bell style={{width:'15px',height:'15px',color:'#94a3b8'}} />
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'8px',padding:'6px 10px',borderRadius:'8px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)'}}>
              <div style={{width:'24px',height:'24px',borderRadius:'50%',background:'linear-gradient(135deg,#7c3aed,#4f46e5)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:'11px',fontWeight:'700'}}>
                {user.name?.charAt(0) || 'A'}
              </div>
              <div>
                <div style={{fontSize:'12px',fontWeight:'600',color:'#f1f5f9'}}>{user.name}</div>
                <div style={{fontSize:'10px',color:'#64748b',textTransform:'capitalize'}}>{user.role}</div>
              </div>
            </div>
            <button onClick={handleLogout} style={{display:'flex',alignItems:'center',gap:'6px',padding:'7px 12px',borderRadius:'8px',color:'#f87171',background:'rgba(248,113,113,0.1)',border:'1px solid rgba(248,113,113,0.2)',cursor:'pointer',fontSize:'12px',fontWeight:'500'}}>
              <LogOut style={{width:'13px',height:'13px'}} /> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{position:'relative',overflow:'hidden',background:'linear-gradient(135deg,#1a0533 0%,#0f0f13 60%)',borderBottom:'1px solid rgba(255,255,255,0.06)',minHeight:'220px'}}>
        <PlasmaBackground />
        <div style={{position:'absolute',top:'-50%',left:'-10%',width:'500px',height:'500px',borderRadius:'50%',background:'radial-gradient(circle,rgba(124,58,237,0.15) 0%,transparent 70%)',pointerEvents:'none'}} />
        <div style={{position:'absolute',top:'-30%',right:'10%',width:'400px',height:'400px',borderRadius:'50%',background:'radial-gradient(circle,rgba(79,70,229,0.12) 0%,transparent 70%)',pointerEvents:'none'}} />
        <div style={{maxWidth:'1280px',margin:'0 auto',padding:'48px 24px 56px',position:'relative',zIndex:1}}>
          <div style={{display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:'32px'}}>
            <div>
              <div style={{display:'inline-flex',alignItems:'center',gap:'6px',padding:'4px 10px',borderRadius:'20px',background:'rgba(124,58,237,0.15)',border:'1px solid rgba(124,58,237,0.3)',marginBottom:'12px'}}>
                <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#a78bfa'}} />
                <span style={{fontSize:'11px',color:'#a78bfa',fontWeight:'500'}}>Welcome back, {user.name}</span>
              </div>
              <h1 style={{fontSize:'36px',fontWeight:'800',color:'#f1f5f9',margin:'0 0 8px',letterSpacing:'-1px',lineHeight:1.2}}>
                Policy Dashboard
              </h1>
              <p style={{fontSize:'14px',color:'#64748b',margin:0}}>Manage and track all insurance policies in one place</p>
            </div>
            <div style={{display:'flex',gap:'12px'}}>
              <div style={{padding:'16px 20px',borderRadius:'14px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',textAlign:'center',minWidth:'120px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'6px',justifyContent:'center',marginBottom:'6px'}}>
                  <TrendingUp style={{width:'13px',height:'13px',color:'#a78bfa'}} />
                  <span style={{fontSize:'10px',color:'#64748b',fontWeight:'500',textTransform:'uppercase',letterSpacing:'0.5px'}}>Total Premium</span>
                </div>
                <div style={{fontSize:'22px',fontWeight:'800',color:'#f1f5f9',letterSpacing:'-0.5px'}}>₹{totalPremium.toLocaleString('en-IN')}</div>
              </div>
              <div style={{padding:'16px 20px',borderRadius:'14px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',textAlign:'center',minWidth:'100px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'6px',justifyContent:'center',marginBottom:'6px'}}>
                  <FileText style={{width:'13px',height:'13px',color:'#a78bfa'}} />
                  <span style={{fontSize:'10px',color:'#64748b',fontWeight:'500',textTransform:'uppercase',letterSpacing:'0.5px'}}>Policies</span>
                </div>
                <div style={{fontSize:'22px',fontWeight:'800',color:'#f1f5f9'}}>{stats.total}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{maxWidth:'1280px',margin:'0 auto',padding:'24px'}}>
        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px',marginBottom:'20px',marginTop:'16px'}}>
          {[
            {label:'Total',value:stats.total,icon:FileText,color:'#818cf8',glow:'rgba(129,140,248,0.15)',border:'rgba(129,140,248,0.2)'},
            {label:'Active',value:stats.active,icon:CheckCircle,color:'#34d399',glow:'rgba(52,211,153,0.15)',border:'rgba(52,211,153,0.2)'},
            {label:'Expired',value:stats.expired,icon:XCircle,color:'#f87171',glow:'rgba(248,113,113,0.15)',border:'rgba(248,113,113,0.2)'},
            {label:'Pending',value:stats.pending,icon:Clock,color:'#fbbf24',glow:'rgba(251,191,36,0.15)',border:'rgba(251,191,36,0.2)'},
          ].map((stat,i) => (
            <div key={i} style={{background:'rgba(255,255,255,0.03)',borderRadius:'14px',padding:'18px',border:`1px solid ${stat.border}`,boxShadow:`0 0 20px ${stat.glow}`}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px'}}>
                <span style={{fontSize:'12px',color:'#64748b',fontWeight:'500'}}>{stat.label}</span>
                <div style={{width:'30px',height:'30px',borderRadius:'8px',background:stat.glow,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <stat.icon style={{width:'15px',height:'15px',color:stat.color}} />
                </div>
              </div>
              <div style={{fontSize:'32px',fontWeight:'800',color:'#f1f5f9',letterSpacing:'-1px'}}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{background:'rgba(255,255,255,0.02)',borderRadius:'16px',border:'1px solid rgba(255,255,255,0.08)'}}>
          <div style={{padding:'18px 20px',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',flexWrap:'wrap',gap:'12px',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <div style={{fontSize:'15px',fontWeight:'700',color:'#f1f5f9'}}>Insurance Policies</div>
              <div style={{fontSize:'12px',color:'#475569'}}>{filtered.length} records found</div>
            </div>
            <div style={{display:'flex',gap:'10px'}}>
              <div style={{position:'relative'}}>
                <Search style={{position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)',width:'14px',height:'14px',color:'#475569'}} />
                <input type='text' placeholder='Search policies...' value={search} onChange={e => setSearch(e.target.value)}
                  style={{paddingLeft:'32px',paddingRight:'14px',paddingTop:'8px',paddingBottom:'8px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'9px',fontSize:'13px',outline:'none',width:'200px',color:'#e2e8f0'}} />
              </div>
              <button onClick={() => setShowUpload(true)}
                style={{display:'flex',alignItems:'center',gap:'6px',padding:'8px 16px',borderRadius:'9px',background:'linear-gradient(135deg,#7c3aed,#4f46e5)',color:'white',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:'600',boxShadow:'0 0 20px rgba(124,58,237,0.4)'}}>
                <Upload style={{width:'14px',height:'14px'}} /> Upload PDF
              </button>
            </div>
          </div>
          <PolicyTable policies={filtered} loading={loading} onStatusChange={handleStatusChange} onDelete={handleDelete} token={token} darkMode={true} />
        </div>
      </div>

      {showUpload && <UploadModal token={token} onClose={() => setShowUpload(false)} />}
    </div>
  )
}