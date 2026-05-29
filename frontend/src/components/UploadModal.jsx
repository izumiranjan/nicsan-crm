import { useState, useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { X, Upload, FileText, CheckCircle, Loader } from 'lucide-react'

export default function UploadModal({ token, onClose }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [done, setDone] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()

  const handleFile = (f) => {
    if (!f) return
    if (f.type !== 'application/pdf') {
      toast.error('Only PDF files allowed!')
      return
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB!')
      return
    }
    setFile(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('pdf', file)
      await axios.post('http://localhost:5000/api/policies/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      setDone(true)
      toast.success('Policy uploaded successfully!')
      setTimeout(() => onClose(), 2000)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)'}}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Upload Policy PDF</h2>
            <p className="text-sm text-gray-500">Max 5MB, PDF only</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {done ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-800">Upload Complete!</h3>
              <p className="text-gray-500 text-sm mt-1">Policy data extracted and saved</p>
            </div>
          ) : (
            <>
              {/* Drop Zone */}
              <div
                onClick={() => fileRef.current.click()}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all"
                style={{
                  borderColor: dragOver ? '#1a56db' : file ? '#059669' : '#e5e7eb',
                  background: dragOver ? '#eff6ff' : file ? '#ecfdf5' : '#f9fafb'
                }}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={e => handleFile(e.target.files[0])}
                />
                {file ? (
                  <>
                    <FileText className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="font-semibold text-gray-800">{file.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <p className="text-xs text-green-600 mt-2 font-medium">✓ Ready to upload</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="font-semibold text-gray-700">Drop PDF here or click to browse</p>
                    <p className="text-sm text-gray-400 mt-1">PDF files only, max 5MB</p>
                  </>
                )}
              </div>

              {/* AI Notice */}
              <div className="mt-4 p-3 bg-blue-50 rounded-xl flex items-start gap-2">
                <span className="text-blue-500 text-lg">🤖</span>
                <p className="text-xs text-blue-700">
                  AI will automatically extract policy details including customer name, vehicle number, insurer and premium amount.
                </p>
              </div>

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full mt-4 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                style={{background: 'linear-gradient(135deg, #1a56db, #1e40af)'}}
              >
                {uploading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Extracting & Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload Policy
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}