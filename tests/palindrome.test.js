const { palindrome } = require('../utils/for_testing')

/* 
test('Error de prueba', () => {
  const result = palindrome('prueba')
  expect(result).toBe('')
})
*/

test.skip('palindrome de hola', () => {
  const result = palindrome('hola')
  expect(result).toBe('aloh')
})

test.skip('palindrome de string vacio', () => {
  const result = palindrome('')
  expect(result).toBe('')
})

test.skip('palindrome de undefined', () => {
  const result = palindrome()
  expect(result).toBeUndefined()
})
    