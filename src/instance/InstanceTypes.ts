import {
  LeafFieldInstance,
  ListFieldInstance,
  LeafListFieldInstance,
  ContainerFieldInstance,
  ChoiceFieldInstance,
  PresenceContainerFieldInstance
} from './';

export type FieldInstance =
  | LeafFieldInstance
  | ListFieldInstance
  | LeafListFieldInstance
  | ContainerFieldInstance
  | ChoiceFieldInstance
  | PresenceContainerFieldInstance;

export interface IParams {
  [index: string]: string;
}
