'use client'

// Functionality: Button Bar provider

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

export type ButtonBarVariant = 'primary' | 'secondary'

export interface ButtonBarAction {
  id: string
  label: string
  onClick: (data?: unknown) => void
  data?: unknown
  disabled?: boolean
  variant?: ButtonBarVariant
}

interface ButtonBarContextValue {
  actions: ButtonBarAction[]
  setActions: (actions: ButtonBarAction[]) => void
  clearActions: () => void
}

const ButtonBarContext = createContext<ButtonBarContextValue | null>(null)

export function ButtonBarProvider({ children }: { children: React.ReactNode }) {
  const [actions, setActionsState] = useState<ButtonBarAction[]>([])

  const setActions = useCallback((next: ButtonBarAction[]) => {
    setActionsState(next)
  }, [])

  const clearActions = useCallback(() => {
    setActionsState([])
  }, [])

  const value = useMemo(() => ({ actions, setActions, clearActions }), [actions, setActions, clearActions])

  return (
    <ButtonBarContext.Provider value={value}>
      {children}
    </ButtonBarContext.Provider>
  )
}

export function useButtonBar() {
  const ctx = useContext(ButtonBarContext)
  if (!ctx) throw new Error('useButtonBar must be used within ButtonBarProvider')
  return ctx
}

export function useButtonBarActions(actions: ButtonBarAction[] | null | undefined) {
  const { setActions, clearActions } = useButtonBar()
  React.useEffect(() => {
    if (actions && actions.length > 0) {
      setActions(actions)
      return () => clearActions()
    }
    clearActions()
  }, [actions, setActions, clearActions])
}


