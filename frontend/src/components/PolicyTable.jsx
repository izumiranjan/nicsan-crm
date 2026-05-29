import { Trash2, ExternalLink } from 'lucide-react'

const statusColors = {
  active: { bg: 'rgba(52,211,153,0.1)', color: '#34d399', border: 'rgba(52,211,153,0.2)' },
  expired: { bg: 'rgba(248,113,113,0.1)', color: '#f87171', border: 'rgba(248,113,113,0.2)' },
  pending: { bg: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: 'rgba(251,191,36,0.2)' },
  cancelled: { bg: 'rgba(148,163,184,0.1)', color: '#94a3b8', border: 'rgba(148,163,184,0.2)' },
}

export default function PolicyTable({ policies, loading, onStatusChange, onDelete }) {
  if (loading) {
    return (
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'60px'}}>
        <div style={{width:'36px',height:'36px',borderRadius:'50%',border:'3px solid rgba(124,58,237,0.3)',borderTop:'3px solid #7c3aed',animation:'spin 1s linear infinite'}} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  if (policies.length === 0) {
    return (
      <div style={{textAlign:'center',padding:'60px 20px'}}>
        <div style={{width:'56px',height:'56px',borderRadius:'14px',background:'rgba(124,58,237,0.1)',border:'1px solid rgba(124,58,237,0.2)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
          <svg style={{width:'24px',height:'24px',color:'#7c3aed'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p style={{color:'#94a3b8',fontWeight:'500',margin:'0 0 4px'}}>No policies found</p>
        <p style={{color:'#475569',fontSize:'13px',margin:0}}>Upload a PDF to get started</p>
      </div>
    )
  }

  return (
    <div style={{overflowX:'auto'}}>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead>
          <tr style={{borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
            {['Policy #','Customer','Vehicle','Insurer','Premium','Status','Actions'].map(h => (
              <th key={h} style={{textAlign:'left',padding:'12px 20px',fontSize:'11px',fontWeight:'600',color:'#475569',textTransform:'uppercase',letterSpacing:'0.5px'}}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {policies.map(policy => {
            const s = statusColors[policy.status] || statusColors.pending
            return (
              <tr key={policy.id} style={{borderBottom:'1px solid rgba(255,255,255,0.04)',transition:'background 0.15s'}}
                onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <td style={{padding:'14px 20px'}}>
                  <span style={{fontFamily:'monospace',fontSize:'13px',fontWeight:'600',color:'#818cf8'}}>{policy.policy_number}</span>
                </td>
                <td style={{padding:'14px 20px'}}>
                  <p style={{margin:'0 0 2px',fontWeight:'500',color:'#e2e8f0',fontSize:'13px'}}>{policy.customer_name}</p>
                  <p style={{margin:0,fontSize:'11px',color:'#475569'}}>{policy.customer_email}</p>
                </td>
                <td style={{padding:'14px 20px'}}>
                  <span style={{fontFamily:'monospace',fontSize:'12px',color:'#94a3b8',background:'rgba(255,255,255,0.05)',padding:'3px 8px',borderRadius:'6px'}}>{policy.vehicle_number}</span>
                </td>
                <td style={{padding:'14px 20px',fontSize:'13px',color:'#94a3b8'}}>{policy.insurer}</td>
                <td style={{padding:'14px 20px'}}>
                  <span style={{fontSize:'14px',fontWeight:'700',color:'#f1f5f9'}}>₹{Number(policy.premium).toLocaleString('en-IN')}</span>
                </td>
                <td style={{padding:'14px 20px'}}>
                  <select value={policy.status} onChange={e => onStatusChange(policy.id, e.target.value)}
                    style={{padding:'4px 10px',borderRadius:'8px',fontSize:'12px',fontWeight:'600',border:`1px solid ${s.border}`,cursor:'pointer',outline:'none',background:s.bg,color:s.color}}>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="expired">Expired</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td style={{padding:'14px 20px'}}>
                  <div style={{display:'flex',gap:'6px'}}>
                    {policy.s3_file_url && (
                      <a href={policy.s3_file_url} target="_blank" rel="noopener noreferrer"
                        style={{width:'30px',height:'30px',borderRadius:'7px',background:'rgba(129,140,248,0.1)',border:'1px solid rgba(129,140,248,0.2)',display:'flex',alignItems:'center',justifyContent:'center',color:'#818cf8',textDecoration:'none'}}>
                        <ExternalLink style={{width:'13px',height:'13px'}} />
                      </a>
                    )}
                    <button onClick={() => onDelete(policy.id)}
                      style={{width:'30px',height:'30px',borderRadius:'7px',background:'rgba(248,113,113,0.1)',border:'1px solid rgba(248,113,113,0.2)',display:'flex',alignItems:'center',justifyContent:'center',color:'#f87171',cursor:'pointer'}}>
                      <Trash2 style={{width:'13px',height:'13px'}} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}