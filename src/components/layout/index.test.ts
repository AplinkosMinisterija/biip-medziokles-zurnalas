import {setPadding} from './index';

describe('paddings', () => {
  it('should set horizontal padding', () => {
    const insets = {
      horizontal: 20,
    };
    // top | right | bottom | left */
    const expectedResult = '0px 20px 0px 20px';
    const result = setPadding(insets);
    expect(result).toBe(expectedResult);
  });
  it('horizontal and vertical', () => {
    const insets = {
      horizontal: 20,
      vertical: 10,
    };
    // top | right | bottom | left */
    const expectedResult = '10px 20px 10px 20px';
    const result = setPadding(insets);
    expect(result).toBe(expectedResult);
  });
  it('horizontal and left', () => {
    const insets = {
      horizontal: 20,
      leftPadding: 5,
    };
    // top | right | bottom | left */
    const expectedResult = '0px 20px 0px 20px';
    const result = setPadding(insets);
    expect(result).toBe(expectedResult);
  });
  it('vertical and left', () => {
    const insets = {
      vertical: 20,
      leftPadding: 5,
    };
    // top | right | bottom | left */
    const expectedResult = '20px 0px 20px 5px';
    const result = setPadding(insets);
    expect(result).toBe(expectedResult);
  });
  it('all props', () => {
    const insets = {
      vertical: 25,
      horizontal: 20,
      rightPadding: 5,
      leftPadding: 10,
      topPadding: 15,
      bottomPadding: 30,
    };
    // top | right | bottom | left */
    const expectedResult = '25px 20px 25px 20px';
    const result = setPadding(insets);
    expect(result).toBe(expectedResult);
  });
  it('left right top bottom', () => {
    const insets = {
      rightPadding: 5,
      leftPadding: 10,
      topPadding: 15,
      bottomPadding: 30,
    };
    // top | right | bottom | left */
    const expectedResult = '15px 5px 30px 10px';
    const result = setPadding(insets);
    expect(result).toBe(expectedResult);
  });
});
