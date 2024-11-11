import PocketBase from 'pocketbase'

export interface Variables {
    pbClient: PocketBase
}

export type Env = { Variables: Variables }