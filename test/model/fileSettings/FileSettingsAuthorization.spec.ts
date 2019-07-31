import FileSettingsAuthorization from '../../../src/model/fileSettings/FileSettingsAuthorization';
import { expect } from 'chai';

const fileSettingsAuthorization: FileSettingsAuthorization = {
  passwordKey: 'password',
  usernameKey: 'username'
};

describe('FileSettingsAuthorization', () => {
  it('password', () => {
    expect(fileSettingsAuthorization.passwordKey).to.equal('password');
  });
  it('username', () => {
    expect(fileSettingsAuthorization.usernameKey).to.equal('username');
  });
});
