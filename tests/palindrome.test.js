const palindrome = require('../utils/for_testing').palindrome

test('palindrome of hannah', () => {
  const result = palindrome('hannah')
  expect(result).toBe('hannah')
})

test('palindrome of react', () => {
  const result = palindrome('react')

  expect(result).toBe('tcaer')
})

test('palindrome of releveler', () => {
  const result = palindrome('releveler')

  expect(result).toBe('releveler')
})
