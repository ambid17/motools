'use client'

import { useState } from 'react'
import type { Motorcycle } from './GarageView'

type Props = {
  motorcycle: Motorcycle
  onDelete: (id: number) => void
}

export default function GarageCard({ motorcycle, onDelete }: Props) {
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            {motorcycle.year} {motorcycle.make} {motorcycle.model}
          </h2>
          {motorcycle.trimLevel && (
            <p className="mt-0.5 text-sm text-gray-500">{motorcycle.trimLevel}</p>
          )}
        </div>

        {confirming ? (
          <div className="flex gap-2 text-sm">
            <button
              onClick={() => onDelete(motorcycle.id)}
              className="rounded px-2 py-1 text-red-600 hover:bg-red-50"
            >
              Confirm
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="rounded px-2 py-1 text-gray-500 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="rounded p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Remove from garage"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {motorcycle.modifications && (
        <div className="mt-3 rounded-md bg-gray-50 px-3 py-2">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Modifications</p>
          <p className="mt-0.5 text-sm text-gray-600">{motorcycle.modifications}</p>
        </div>
      )}
    </div>
  )
}
