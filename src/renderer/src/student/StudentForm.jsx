import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

const StudentForm = () => {
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [contact, setContact] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [programs, setPrograms] = useState([])
  const [selectedProgram, setSelectedProgram] = useState('')
  const [tuitionFee, setTuitionFee] = useState(0)

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const result = await window.api.ipcRenderer.invoke('get-programs-by-name')
        if (result.success) {
          setPrograms(result.programs)
        } else {
          toast.error('Failed to fetch programs.')
        }
      } catch (error) {
        toast.error('An error occurred while fetching programs.')
      }
    }

    fetchPrograms()
  }, [])

  const handleProgramChange = (e) => {
    const programName = e.target.value
    setSelectedProgram(programName)

    const selected = programs.find((p) => p.name === programName)
    if (selected) {
      setTuitionFee(selected.tuition_fee)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    window.api.ipcRenderer
      .invoke('add-student', {
        firstname,
        lastname,
        contact,
        email,
        address,
        programName: selectedProgram,
        tuitionFee
      })
      .then((result) => {
        if (result.success) {
          toast.success('Student added successfully!')
          setFirstname('')
          setLastname('')
          setContact('')
          setEmail('')
          setAddress('')
          setSelectedProgram('')
          setTuitionFee(0)
        } else {
          toast.error('Failed to add student.')
        }
      })
  }

  return (
    <div className="p-4 text-black overflow-auto">
      <Toaster />
      <h2 className="text-2xl mb-4">Add Student</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium">First Name:</label>
          <input
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            className="mt-1 p-2 border w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Last Name:</label>
          <input
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            className="mt-1 p-2 border w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Contact:</label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="mt-1 p-2 border w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 border w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 p-2 border w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Program:</label>
          <select
            value={selectedProgram}
            onChange={handleProgramChange}
            className="mt-1 p-2 border w-full"
            required
          >
            <option value="">Select a program</option>
            {programs.map((program) => (
              <option key={program.id} value={program.name}>
                {program.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Tuition Fee:</label>
          <input
            type="text"
            value={`$${tuitionFee.toFixed(2)}`}
            readOnly
            className="mt-1 p-2 border w-full bg-gray-100"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Student
        </button>
      </form>
    </div>
  )
}

export default StudentForm
