import { User } from './user.model';

describe('User', () => {
  it('should be defined', () => {
    expect(new User()).toBeDefined();
  });
});
