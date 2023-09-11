import { createContext, h } from 'preact'
import { useContext } from 'preact/hooks'
import { useSignal } from '@preact/signals'
import { isfn } from '../lib'

const AppContext = createContext({})
const AppState = data => {
  const state = useSignal(data || {})
  const set = data => state.value = isfn(data) ? data(state.value) : {
    ...state.value,
    ...(data || {}),
  }
  const up = (key, value) => set(data => ({
    ...data,
    [key]: isfn(value) ? value(data[key]) : value,
  }))
  const store = (key, value) => up(key, old => {
    const update = isfn(value) ? value(old) : value

    localStorage.setItem(key, value)

    return update
  })
  const load = () => {
    try {
      for ()
    }
  }

  return { state, set, up, store, load }
}

export const useApp = () => useContext(AppContext)
export const AppProvider = ({ children, ...data }) => {

  return h(AppContext.Provider, { value: AppState(data) }, children)
}
