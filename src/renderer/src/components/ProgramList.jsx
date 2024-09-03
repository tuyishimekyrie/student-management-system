import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

const ProgramList = () => {
  const [programs, setPrograms] = useState([])

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const result = await window.api.ipcRenderer.invoke('get-programs')
        setPrograms(result.programs)
      } catch (error) {
        toast.error('Failed to fetch programs.')
      }
    }

    fetchPrograms()
  }, [])

  return (
    <div className="p-4 text-black">
      <Toaster />
      <h2 className="text-2xl mb-4">Programs</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-orange-300 border-b border-slate-500">
            <th className="py-2 px-4 border-r">ID</th>
            <th className="py-2 px-4 border-r">Name</th>
            <th className="py-2 px-4 border-r">Tuition Fee</th>
          </tr>
        </thead>
        <tbody>
          {programs.length > 0 ? (
            programs.map((program) => (
              <tr key={program.id} className="border-b bg-gray-200 border-slate-600">
                <td className="py-2 px-4 border-r ">{program.id}</td>
                <td className="py-2 px-4 border-r">{program.name}</td>
                <td className="py-2 px-4 border-r">${program.tuition_fee.toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="py-2 px-4 text-center">
                No programs available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ProgramList
