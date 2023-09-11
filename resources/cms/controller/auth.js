import { useSignal, useComputed } from '@preact/signals'
import { useApp } from './app'

export const useAuth = () => {
  const { state } = useApp()
}
