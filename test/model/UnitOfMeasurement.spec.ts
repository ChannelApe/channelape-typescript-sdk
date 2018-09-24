import UnitOfMeasurement from '../../src/model/UnitOfMeasurement';
import { expect } from 'chai';

describe('UnitOfMeasurement', () => {
  it('OUNCES', () => {
    expect(UnitOfMeasurement.OUNCES).to.equal('oz');
  });
  it('POUNDS', () => {
    expect(UnitOfMeasurement.POUNDS).to.equal('lb');
  });
  it('GRAMS', () => {
    expect(UnitOfMeasurement.GRAMS).to.equal('g');
  });
  it('KILOGRAMS', () => {
    expect(UnitOfMeasurement.KILOGRAMS).to.equal('kg');
  });
  it('METRIC_TONNES', () => {
    expect(UnitOfMeasurement.METRIC_TONNES).to.equal('t');
  });
});
