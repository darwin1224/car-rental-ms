import { AuthenticateGuard } from './authenticate.guard';

describe('AuthenticateGuard', () => {
  it('should be defined', () => {
    expect(new AuthenticateGuard()).toBeDefined();
  });
});
