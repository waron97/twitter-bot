import create from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuth = create(
    persist((set) => ({
        apiKey: null,
        setApiKey: (key) => set({ apiKey: key }),
    }))
)
