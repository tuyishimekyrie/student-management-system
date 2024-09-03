import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

const ProgramForm = () => {
  const [name, setName] = useState('')
  const [tuitionFee, setTuitionFee] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    window.api.ipcRenderer.invoke('add-program', { name, tuitionFee }).then((result) => {
      if (result.success) {
        toast.success('Program added successfully!')
        setName('')
        setTuitionFee('')
      } else {
        toast.error('Failed to add program.')
      }
    })
  }

  return (
    <div className="p-4 text-black">
      <Toaster />
      <h2 className="text-2xl mb-4">Add Program</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 border w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Tuition Fee:</label>
          <input
            type="number"
            value={tuitionFee}
            onChange={(e) => setTuitionFee(e.target.value)}
            className="mt-1 p-2 border w-full"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Program
        </button>
      </form>
    </div>
  )
}

export default ProgramForm
