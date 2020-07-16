import { CarDto } from './car.dto';

describe('CarDto', () => {
  it('should be defined', () => {
    expect(new CarDto()).toBeDefined();
  });
});
