export type Args = Record<string, string>
export type Params = Record<string, any>
export type Context = Record<string, any>
export enum ExecutionStatus {
  New = 'New', 
  Running = 'Running', 
  Completed = 'Completed', 
  Failed = 'Failed', 
  Skipped = 'Skipped',
  Invalid = 'Invalid'
}