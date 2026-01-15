import { problemsHandlers } from './problems/problems.handler'
import { setupWorker } from 'msw/browser'

export const worker = setupWorker(...problemsHandlers)
