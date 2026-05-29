import { useState, useEffect } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import toast from 'react-hot-toast'
import { Shield, Upload, LogOut, FileText, CheckCircle, XCircle, Clock, Search, Bell } from 'lucide-react'
import PolicyTable from '../components/PolicyTable'
import UploadModal from '../components/UploadModal'
import PlasmaBackground from '../components/PlasmaBackground'

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
    <div style={{minHeight:'100vh',background:'#f0f4f8'}}>
      <nav style={{background:'white',boxShadow:'0 1px 3px rgba(0,0,0,0.1)',position:'sticky',top:0,zIndex:10,borderBottom:'1px solid #f3f4f6'}}>
        <div style={{maxWidth:'1280px',margin:'0 auto',padding:'12px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            <div style={{width:'40px',height:'40px',borderRadius:'12px',background:'linear-gradient(135deg,#1a56db,#1e40af)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Shield style={{width:'22px',height:'22px',color:'white'}} />
            </div>
            <div>
              <div style={{fontSize:'16px',fontWeight:'700',color:'#1f2937'}}>Nicsan CRM</div>
              <div style={{fontSize:'11px',color:'#9ca3af'}}>Insurance Policy Management</div>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'linear-gradient(135deg,#1a56db,#1e40af)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:'13px',fontWeight:'700'}}>
                {user.name?.charAt(0) || 'A'}
              </div>
              <div>
                <div style={{fontSize:'13px',fontWeight:'600',color:'#1f2937'}}>{user.name}</div>
                <div style={{fontSize:'11px',color:'#9ca3af',textTransform:'capitalize'}}>{user.role}</div>
              </div>
            </div>
            <button onClick={handleLogout} style={{display:'flex',alignItems:'center',gap:'6px',padding:'8px 12px',borderRadius:'10px',color:'#ef4444',background:'none',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:'500'}}>
              <LogOut style={{width:'15px',height:'15px'}} /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div style={{background:'linear-gradient(135deg,#1a56db 0%,#1e40af 60%,#1e3a8a 100%)',position:'relative',overflow:'hidden',minHeight:'200px'}}>
        <PlasmaBackground />
        <div style={{maxWidth:'1280px',margin:'0 auto',padding:'40px 24px',position:'relative',zIndex:1}}>
          <div style={{display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:'24px'}}>
            <div>
              <div style={{color:'#93c5fd',fontSize:'13px',fontWeight:'500',marginBottom:'4px'}}>Welcome back 👋</div>
              <div style={{color:'white',fontSize:'28px',fontWeight:'700',marginBottom:'6px'}}>{user.name}</div>
              <div style={{color:'#bfdbfe',fontSize:'14px'}}>Manage your insurance policies efficiently</div>
            </div>
            <div style={{display:'flex',gap:'16px'}}>
              <div style={{background:'rgba(0,0,0,0.25)',borderRadius:'16px',padding:'16px 20px',textAlign:'center',border:'1px solid rgba(255,255,255,0.15)'}}>
                <div style={{color:'#93c5fd',fontSize:'11px',marginBottom:'6px',fontWeight:'500'}}>TOTAL PREMIUM</div>
                <div style={{color:'white',fontSize:'20px',fontWeight:'700'}}>₹{totalPremium.toLocaleString('en-IN')}</div>
              </div>
              <div style={{background:'rgba(0,0,0,0.25)',borderRadius:'16px',padding:'16px 20px',textAlign:'center',border:'1px solid rgba(255,255,255,0.15)'}}>
                <div style={{color:'#93c5fd',fontSize:'11px',marginBottom:'6px',fontWeight:'500'}}>TOTAL POLICIES</div>
                <div style={{color:'white',fontSize:'20px',fontWeight:'700'}}>{stats.total}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{maxWidth:'1280px',margin:'0 auto',padding:'24px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px',marginBottom:'24px',marginTop:'-24px'}}>
          {[
            {label:'Total Policies',value:stats.total,icon:FileText,color:'#1a56db',bg:'#eff6ff',border:'#bfdbfe'},
            {label:'Active',value:stats.active,icon:CheckCircle,color:'#059669',bg:'#ecfdf5',border:'#a7f3d0'},
            {label:'Expired',value:stats.expired,icon:XCircle,color:'#dc2626',bg:'#fef2f2',border:'#fecaca'},
            {label:'Pending',value:stats.pending,icon:Clock,color:'#d97706',bg:'#fffbeb',border:'#fde68a'},
          ].map((stat,i) => (
            <div key={i} style={{background:'white',borderRadius:'16px',padding:'20px',boxShadow:'0 1px 3px rgba(0,0,0,0.08)',border:`1px solid ${stat.border}`}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
                <div style={{fontSize:'13px',color:'#6b7280',fontWeight:'500'}}>{stat.label}</div>
                <div style={{width:'36px',height:'36px',borderRadius:'10px',background:stat.bg,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <stat.icon style={{width:'18px',height:'18px',color:stat.color}} />
                </div>
              </div>
              <div style={{fontSize:'28px',fontWeight:'700',color:'#1f2937'}}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div style={{background:'white',borderRadius:'16px',boxShadow:'0 1px 3px rgba(0,0,0,0.08)',border:'1px solid #f3f4f6'}}>
          <div style={{padding:'20px',borderBottom:'1px solid #f3f4f6',display:'flex',flexWrap:'wrap',gap:'12px',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <div style={{fontSize:'16px',fontWeight:'700',color:'#1f2937'}}>Insurance Policies</div>
              <div style={{fontSize:'13px',color:'#9ca3af'}}>{filtered.length} policies found</div>
            </div>
            <div style={{display:'flex',gap:'12px'}}>
              <div style={{position:'relative'}}>
                <Search style={{position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)',width:'15px',height:'15px',color:'#9ca3af'}} />
                <input type='text' placeholder='Search policies...' value={search} onChange={e => setSearch(e.target.value)}
                  style={{paddingLeft:'32px',paddingRight:'16px',paddingTop:'8px',paddingBottom:'8px',border:'1px solid #e5e7eb',borderRadius:'10px',fontSize:'13px',outline:'none',width:'220px'}} />
              </div>
              <button onClick={() => setShowUpload(true)}
                style={{display:'flex',alignItems:'center',gap:'6px',padding:'8px 16px',borderRadius:'10px',background:'linear-gradient(135deg,#1a56db,#1e40af)',color:'white',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:'500'}}>
                <Upload style={{width:'15px',height:'15px'}} /> Upload PDF
              </button>
            </div>
          </div>
          <PolicyTable policies={filtered} loading={loading} onStatusChange={handleStatusChange} onDelete={handleDelete} token={token} />
        </div>
      </div>

      {showUpload && <UploadModal token={token} onClose={() => setShowUpload(false)} />}
    </div>
  )
}