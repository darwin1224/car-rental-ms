import { Car } from './car.model';

describe('Car', () => {
  it('should be defined', () => {
    expect(new Car()).toBeDefined();
  });
});
