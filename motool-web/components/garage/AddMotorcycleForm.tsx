'use client'

import { useEffect, useState } from 'react'

type Make = { id: number; name: string }
type Model = { id: number; name: string }

type Props = {
  onSuccess: () => void
  onCancel: () => void
}

const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 1959 }, (_, i) => currentYear - i)

export default function AddMotorcycleForm({ onSuccess, onCancel }: Props) {
  const [year, setYear] = useState<number>(currentYear)
  const [makes, setMakes] = useState<Make[]>([])
  const [makeId, setMakeId] = useState<number | ''>('')
  const [models, setModels] = useState<Model[]>([])
  const [modelId, setModelId] = useState<number | ''>('')
  const [trimLevel, setTrimLevel] = useState('')
  const [modifications, setModifications] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/lookup/makes')
      .then(r => r.json())
      .then(setMakes)
  }, [])

  useEffect(() => {
    if (!makeId) { setModels([]); setModelId(''); return }
    fetch(`/api/lookup/models?makeId=${makeId}`)
      .then(r => r.json())
      .then(data => { setModels(data); setModelId('') })
  }, [makeId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!makeId || !modelId) { setError('Please select a make and model.'); return }
    setError('')
    setSubmitting(true)

    const res = await fetch('/api/garage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ year, makeId, modelId, trimLevel, modifications }),
    })

    setSubmitting(false)
    if (res.ok) {
      onSuccess()
    } else {
      setError('Failed to add motorcycle. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-5">Add a Motorcycle</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <div className="space-y-1">
            <label className="block text-sm font-medium" htmlFor="year">Year</label>
            <select
              id="year"
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium" htmlFor="make">Make</label>
            <select
              id="make"
              value={makeId}
              onChange={e => setMakeId(e.target.value ? Number(e.target.value) : '')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select make…</option>
              {makes.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium" htmlFor="model">Model</label>
            <select
              id="model"
              value={modelId}
              onChange={e => setModelId(e.target.value ? Number(e.target.value) : '')}
              disabled={!makeId || models.length === 0}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
              required
            >
              <option value="">
                {!makeId ? 'Select a make first' : models.length === 0 ? 'No models found' : 'Select model…'}
              </option>
              {models.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium" htmlFor="trim">Trim Level <span className="text-gray-400 font-normal">(optional)</span></label>
            <input
              id="trim"
              type="text"
              value={trimLevel}
              onChange={e => setTrimLevel(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. ABS, Special Edition"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium" htmlFor="mods">Modifications / Aftermarket Parts <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea
              id="mods"
              value={modifications}
              onChange={e => setModifications(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="e.g. Akrapovic exhaust, bar-end mirrors"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Adding…' : 'Add to Garage'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
