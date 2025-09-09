export type TItem = {
  id: number,
  completed: boolean,
  text: string
}

export type TListFilter = 'all' | 'active' | 'completed';
