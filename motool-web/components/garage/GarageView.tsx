'use client'

import { useEffect, useState } from 'react'
import GarageCard from './GarageCard'
import AddMotorcycleForm from './AddMotorcycleForm'

export type Motorcycle = {
  id: number
  year: number
  make: string
  makeId: number
  model: string
  modelId: number
  trimLevel: string
  modifications: string
}

export default function GarageView() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  async function fetchGarage() {
    const res = await fetch('/api/garage')
    if (res.ok) setMotorcycles(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchGarage() }, [])

  async function handleDelete(id: number) {
    await fetch(`/api/garage/${id}`, { method: 'DELETE' })
    setMotorcycles(prev => prev.filter(m => m.id !== id))
  }

  function handleAdded() {
    setShowForm(false)
    fetchGarage()
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {motorcycles.length === 0
            ? 'No motorcycles yet'
            : `${motorcycles.length} motorcycle${motorcycles.length !== 1 ? 's' : ''}`}
        </span>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          + Add Motorcycle
        </button>
      </div>

      {motorcycles.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-20 text-center">
          <p className="text-gray-400">Your garage is empty.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 text-sm font-medium text-blue-600 hover:underline"
          >
            Add your first motorcycle
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {motorcycles.map(m => (
            <GarageCard key={m.id} motorcycle={m} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showForm && (
        <AddMotorcycleForm onSuccess={handleAdded} onCancel={() => setShowForm(false)} />
      )}
    </div>
  )
}
