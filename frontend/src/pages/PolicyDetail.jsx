import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Shield, ArrowLeft, Download, FileText, User, Car, Building, CreditCard, Calendar, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'

export default function PolicyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [policy, setPolicy] = useState(null)
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/policies/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setPolicy(res.data)
      } catch (err) {
        toast.error('Failed to fetch policy')
        navigate('/dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchPolicy()
  }, [id])

  const handleStatusChange = async (status) => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/policies/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setPolicy(res.data)
      toast.success('Status updated!')
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  const statusConfig = {
    active: { color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)', icon: CheckCircle },
    expired: { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)', icon: XCircle },
    pending: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)', icon: Clock },
    cancelled: { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)', icon: AlertCircle },
  }

  if (loading) {
    return (
      <div style={{minHeight:'100vh',background:'#0f0f13',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{width:'40px',height:'40px',borderRadius:'50%',border:'3px solid rgba(124,58,237,0.3)',borderTop:'3px solid #7c3aed',animation:'spin 1s linear infinite'}} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  if (!policy) return null

  const s = statusConfig[policy.status] || statusConfig.pending
  const StatusIcon = s.icon

  return (
    <div style={{minHeight:'100vh',background:'#0f0f13',color:'#e2e8f0',fontFamily:'Inter,sans-serif'}}>
      {/* Navbar */}
      <nav style={{background:'rgba(255,255,255,0.03)',borderBottom:'1px solid rgba(255,255,255,0.08)',position:'sticky',top:0,zIndex:10,backdropFilter:'blur(20px)'}}>
        <div style={{maxWidth:'1280px',margin:'0 auto',padding:'14px 24px',display:'flex',alignItems:'center',gap:'16px'}}>
          <div style={{width:'36px',height:'36px',borderRadius:'10px',background:'linear-gradient(135deg,#7c3aed,#4f46e5)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Shield style={{width:'18px',height:'18px',color:'white'}} />
          </div>
          <div style={{fontSize:'15px',fontWeight:'700',color:'#f1f5f9'}}>Nicsan CRM</div>
          <div style={{width:'1px',height:'20px',background:'rgba(255,255,255,0.1)'}} />
          <button onClick={() => navigate('/dashboard')}
            style={{display:'flex',alignItems:'center',gap:'6px',background:'none',border:'none',cursor:'pointer',color:'#94a3b8',fontSize:'13px',padding:0}}>
            <ArrowLeft style={{width:'15px',height:'15px'}} /> Back to Dashboard
          </button>
        </div>
      </nav>

      <div style={{maxWidth:'900px',margin:'0 auto',padding:'32px 24px'}}>
        {/* Header */}
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:'16px',marginBottom:'28px'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}>
              <span style={{fontFamily:'monospace',fontSize:'13px',color:'#818cf8',background:'rgba(129,140,248,0.1)',padding:'4px 10px',borderRadius:'6px',border:'1px solid rgba(129,140,248,0.2)'}}>
                {policy.policy_number}
              </span>
              <div style={{display:'flex',alignItems:'center',gap:'6px',padding:'4px 10px',borderRadius:'6px',background:s.bg,border:`1px solid ${s.border}`}}>
                <StatusIcon style={{width:'12px',height:'12px',color:s.color}} />
                <span style={{fontSize:'12px',fontWeight:'600',color:s.color,textTransform:'capitalize'}}>{policy.status}</span>
              </div>
            </div>
            <h1 style={{fontSize:'28px',fontWeight:'800',color:'#f1f5f9',margin:'0 0 4px',letterSpacing:'-0.5px'}}>{policy.customer_name}</h1>
            <p style={{fontSize:'13px',color:'#475569',margin:0}}>{policy.customer_email}</p>
          </div>
          <div style={{display:'flex',gap:'10px'}}>
            <select value={policy.status} onChange={e => handleStatusChange(e.target.value)}
              style={{padding:'9px 14px',borderRadius:'9px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'#e2e8f0',fontSize:'13px',cursor:'pointer',outline:'none'}}>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {policy.s3_file_url && (
              <a href={policy.s3_file_url} target="_blank" rel="noopener noreferrer"
                style={{display:'flex',alignItems:'center',gap:'6px',padding:'9px 16px',borderRadius:'9px',background:'linear-gradient(135deg,#7c3aed,#4f46e5)',color:'white',textDecoration:'none',fontSize:'13px',fontWeight:'600',boxShadow:'0 0 20px rgba(124,58,237,0.3)'}}>
                <Download style={{width:'14px',height:'14px'}} /> Download PDF
              </a>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'16px'}}>
          {/* Customer Info */}
          <div style={{background:'rgba(255,255,255,0.03)',borderRadius:'16px',border:'1px solid rgba(255,255,255,0.08)',padding:'24px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'20px'}}>
              <div style={{width:'32px',height:'32px',borderRadius:'8px',background:'rgba(129,140,248,0.1)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <User style={{width:'16px',height:'16px',color:'#818cf8'}} />
              </div>
              <span style={{fontSize:'13px',fontWeight:'600',color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.5px'}}>Customer Details</span>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
              <div>
                <div style={{fontSize:'11px',color:'#475569',marginBottom:'3px'}}>Full Name</div>
                <div style={{fontSize:'14px',fontWeight:'500',color:'#f1f5f9'}}>{policy.customer_name}</div>
              </div>
              <div>
                <div style={{fontSize:'11px',color:'#475569',marginBottom:'3px'}}>Email Address</div>
                <div style={{fontSize:'14px',color:'#818cf8'}}>{policy.customer_email}</div>
              </div>
            </div>
          </div>

          {/* Vehicle Info */}
          <div style={{background:'rgba(255,255,255,0.03)',borderRadius:'16px',border:'1px solid rgba(255,255,255,0.08)',padding:'24px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'20px'}}>
              <div style={{width:'32px',height:'32px',borderRadius:'8px',background:'rgba(52,211,153,0.1)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Car style={{width:'16px',height:'16px',color:'#34d399'}} />
              </div>
              <span style={{fontSize:'13px',fontWeight:'600',color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.5px'}}>Vehicle Details</span>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
              <div>
                <div style={{fontSize:'11px',color:'#475569',marginBottom:'3px'}}>Registration Number</div>
                <div style={{fontFamily:'monospace',fontSize:'15px',fontWeight:'700',color:'#34d399',background:'rgba(52,211,153,0.08)',padding:'6px 12px',borderRadius:'8px',display:'inline-block'}}>{policy.vehicle_number}</div>
              </div>
            </div>
          </div>

          {/* Insurance Info */}
          <div style={{background:'rgba(255,255,255,0.03)',borderRadius:'16px',border:'1px solid rgba(255,255,255,0.08)',padding:'24px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'20px'}}>
              <div style={{width:'32px',height:'32px',borderRadius:'8px',background:'rgba(251,191,36,0.1)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Building style={{width:'16px',height:'16px',color:'#fbbf24'}} />
              </div>
              <span style={{fontSize:'13px',fontWeight:'600',color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.5px'}}>Insurance Details</span>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
              <div>
                <div style={{fontSize:'11px',color:'#475569',marginBottom:'3px'}}>Insurance Provider</div>
                <div style={{fontSize:'14px',fontWeight:'500',color:'#f1f5f9'}}>{policy.insurer}</div>
              </div>
              <div>
                <div style={{fontSize:'11px',color:'#475569',marginBottom:'3px'}}>Policy Type</div>
                <div style={{fontSize:'14px',color:'#f1f5f9'}}>{policy.extracted_data?.policy_type || 'Comprehensive'}</div>
              </div>
            </div>
          </div>

          {/* Premium Info */}
          <div style={{background:'rgba(255,255,255,0.03)',borderRadius:'16px',border:'1px solid rgba(255,255,255,0.08)',padding:'24px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'20px'}}>
              <div style={{width:'32px',height:'32px',borderRadius:'8px',background:'rgba(248,113,113,0.1)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <CreditCard style={{width:'16px',height:'16px',color:'#f87171'}} />
              </div>
              <span style={{fontSize:'13px',fontWeight:'600',color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.5px'}}>Premium Details</span>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
              <div>
                <div style={{fontSize:'11px',color:'#475569',marginBottom:'3px'}}>Total Premium</div>
                <div style={{fontSize:'28px',fontWeight:'800',color:'#f1f5f9',letterSpacing:'-0.5px'}}>₹{Number(policy.premium).toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dates & Document */}
        <div style={{background:'rgba(255,255,255,0.03)',borderRadius:'16px',border:'1px solid rgba(255,255,255,0.08)',padding:'24px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'20px'}}>
            <div style={{width:'32px',height:'32px',borderRadius:'8px',background:'rgba(124,58,237,0.1)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Calendar style={{width:'16px',height:'16px',color:'#a78bfa'}} />
            </div>
            <span style={{fontSize:'13px',fontWeight:'600',color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.5px'}}>Timeline</span>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'20px'}}>
            <div>
              <div style={{fontSize:'11px',color:'#475569',marginBottom:'3px'}}>Created At</div>
              <div style={{fontSize:'14px',color:'#f1f5f9'}}>{new Date(policy.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</div>
            </div>
            <div>
              <div style={{fontSize:'11px',color:'#475569',marginBottom:'3px'}}>Last Updated</div>
              <div style={{fontSize:'14px',color:'#f1f5f9'}}>{new Date(policy.updated_at).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</div>
            </div>
            <div>
              <div style={{fontSize:'11px',color:'#475569',marginBottom:'3px'}}>Document</div>
              {policy.s3_file_url ? (
                <a href={policy.s3_file_url} target="_blank" rel="noopener noreferrer"
                  style={{display:'inline-flex',alignItems:'center',gap:'6px',color:'#818cf8',textDecoration:'none',fontSize:'13px',fontWeight:'500'}}>
                  <FileText style={{width:'14px',height:'14px'}} /> View PDF
                </a>
              ) : (
                <span style={{fontSize:'13px',color:'#475569'}}>No document</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}