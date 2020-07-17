import { AuthorizeGuard } from '@app/common/guards/authorize.guard';
import { Test } from '@nestjs/testing';

describe('AuthorizeGuard', () => {
  let authorizeGuard: AuthorizeGuard;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthorizeGuard],
    }).compile();

    authorizeGuard = module.get<AuthorizeGuard>(AuthorizeGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authorizeGuard).toBeDefined();
  });
});
