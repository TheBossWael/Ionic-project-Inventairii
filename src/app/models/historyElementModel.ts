export type ItemAction = 'added' | 'deleted' | 'edited' | 'decremented one';

export interface HistoryElementModel {
  description: string;
  addedBy: string;
  action: ItemAction;
  time: string;
  ModifiedItem : string;
}
