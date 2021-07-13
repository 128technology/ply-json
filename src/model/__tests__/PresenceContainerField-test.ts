import { expect } from 'chai';

import TestPresentationModel from './data/testPresentationModel';

describe('Presence Container Field Model', () => {
  it('serializes a basic leaf', () => {
    const field = TestPresentationModel.getFieldForID('authority.router.application-identification')!;

    expect(field.serialize()).to.deep.equal({
      deprecated: false,
      id: 'authority.router.application-identification',
      kind: 'presence-container',
      label: 'Enabled',
      name: 'application-identification',
      readOnly: false,
      visibility: 'visible'
    });
  });
});
