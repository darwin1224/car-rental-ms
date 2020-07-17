import { User } from './user.model';

jest.mock('bcryptjs', () => ({
  hashSync: jest.fn(password => `$1$${password}`),
}));

describe('User', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(user).toBeDefined();
  });

  it('hashPassword()', () => {
    expect(user.hashPassword()).toBeUndefined();
  });
});
