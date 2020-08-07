import * as _ from 'lodash';
import { ListInstance, LeafInstance, Leaf, Types, Path, DataModelInstance, Authorized } from '@128technology/yinz';

import applyMixins from '../util/applyMixins';
import { ListField, LeafField } from '../model';
import { Pluggable, Child } from './mixins';
import { PresentationModelInstance, SectionInstance, ListPlugin } from './';
import { getInstanceReferences } from './util';
import { IEnumeration } from '../util/types';

const { LeafRefType, DerivedType } = Types;

const FAKE_KEY = 'XXX_FAKE_KEY_VALUE_XXX';

interface IGenericObj {
  [index: string]: string | null;
}

export default class ListFieldInstance implements Pluggable, Child {
  public instanceData: ListInstance;
  public model: ListField;
  public parent: SectionInstance;
  public path: Path;
  public plugins: ListPlugin[];

  public getDataInstance: () => DataModelInstance;
  public getPresentationInstance: () => PresentationModelInstance;
  public applyPlugins: (field: any) => any;

  constructor(model: ListField, parent: SectionInstance, instanceData: ListInstance, path: Path) {
    this.model = model;
    this.parent = parent;
    this.instanceData = instanceData;
    this.path = path;

    this.plugins = this.getPresentationInstance().listPlugins;
  }

  public get keys() {
    // Eww eww eww eww eww
    const modelKeys = this.model.keys;

    return modelKeys.map((modelKey: LeafField) => {
      const { model } = modelKey;
      const references: string[] = [];
      const suggestions: string[] = [];
      const fakePath = this.getFakePath(model.name);
      let enumerations: IEnumeration[] | undefined;

      if (model instanceof Leaf && model.getResolvedType() instanceof LeafRefType) {
        enumerations = [];
        Array.prototype.push.apply(references, this.getDataInstance().evaluateLeafRef(fakePath));
      }

      const type = model.type;
      if (
        model instanceof Leaf &&
        type instanceof DerivedType &&
        type.suggestionRefs &&
        type.suggestionRefs.length > 0
      ) {
        enumerations = [];
        // Suggestion-Refs can be self referential...
        Array.prototype.push.apply(
          suggestions,
          _.without(this.getDataInstance().evaluateSuggestionRef(fakePath), FAKE_KEY)
        );
      }

      const base = modelKey.serialize();

      if (base.enumerations) {
        enumerations = _.uniq(base.enumerations.concat(getInstanceReferences(references, suggestions)));
      } else if (suggestions.length > 0 || references.length > 0) {
        enumerations = getInstanceReferences(references, suggestions);
      }

      return Object.assign(
        {},
        base,
        _.pickBy({ enumerations }, v => !_.isUndefined(v))
      );
    });
  }

  public getValue(authorized: Authorized) {
    if (_.isNil(this.instanceData)) {
      return [];
    }

    return Array.from(this.instanceData.getChildren(authorized).entries()).map(([key, listItem]) => {
      const itemLeaves = this.model.leaves.reduce((acc: IGenericObj, leaf) => {
        // TODO: Better guard
        const value = listItem.getChildren(authorized).has(leaf)
          ? (listItem.getChildren(authorized).get(leaf) as LeafInstance).getValue(authorized)
          : null;
        acc[leaf] = value;
        return acc;
      }, {});

      return Object.assign(itemLeaves, {
        _key: key
      });
    });
  }

  public serialize(authorized: Authorized): any {
    return this.applyPlugins(
      Object.assign(
        {},
        this.model.serialize(),
        _.pickBy({ value: this.getValue(authorized), keys: this.keys }, v => !_.isUndefined(v))
      )
    );
  }

  private getFakePath(leafName: string) {
    return [
      ...this.path.slice(0, -1),
      { name: this.path[this.path.length - 1].name, keys: this.getFakeKeys() },
      { name: leafName }
    ];
  }

  private getFakeKeys() {
    return Array.from(this.model.model.keys.values()).map(key => ({ key, value: FAKE_KEY }));
  }
}

applyMixins(ListFieldInstance, [Pluggable, Child]);
