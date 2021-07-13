import * as _ from 'lodash';
import { ContainerInstance, Path, Authorized } from '@128technology/yinz-json';

import applyMixins from '../util/applyMixins';
import { PresenceContainerField } from '../model';
import { Pluggable, Child } from './mixins';
import { SectionInstance, PresenceContainerPlugin } from '.';

export default class PresenceContainerFieldInstance implements Pluggable, Child {
  public static async build(
    model: PresenceContainerField,
    parent: SectionInstance,
    instanceData: ContainerInstance | undefined,
    path: Path
  ) {
    return new PresenceContainerFieldInstance(model, parent, instanceData, path);
  }

  public readonly plugins: PresenceContainerPlugin[];

  public getDataInstance: Child['getDataInstance'];
  public getPresentationInstance: Child['getPresentationInstance'];
  public applyPlugins: Pluggable['applyPlugins'];

  constructor(
    public readonly model: PresenceContainerField,
    public readonly parent: SectionInstance,
    public readonly instanceData: ContainerInstance | undefined,
    public readonly path: Path
  ) {
    this.plugins = this.getPresentationInstance().presenceContainerPlugins;
  }

  public getValue(authorized: Authorized) {
    return this.instanceData && authorized(this.instanceData) ? true : false;
  }

  public async serialize(authorized: Authorized): Promise<any> {
    const base = this.model.serialize();

    return await this.applyPlugins(
      Object.assign(
        {},
        base,
        _.pickBy({ value: this.getValue(authorized) }, v => !_.isUndefined(v))
      )
    );
  }
}

applyMixins(PresenceContainerFieldInstance, [Pluggable, Child]);
