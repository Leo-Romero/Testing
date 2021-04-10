const { average } = require('../utils/for_testing')

describe.skip('average', () => {
  test('un valor si es el mismo valor', () => {
    expect(average([1])).toBe(1)
  })

  test('de varios', () => {
    expect(average([1, 2, 3, 4, 5, 6])).toBe(3.5)
  })

  test('si es un array vacio debe dar 0', () => {
    expect(average([])).toBe(0)
  })
})