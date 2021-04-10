const suma =  (a, b) => {
  return a - b
}

const checks = [
  {a:0, b:0, result:0},
  {a:1, b:3, result:4},
  {a:-3, b:3, result:0} 
]

checks.forEach(check => {
  const {a, b, result} = check
  console.assert(
    suma(a, b) === result,
    `suma de ${a} y ${b} espera ser ${result}`
  )
})

console.log(`${checks.length} checks pasados...`)

/* 
if (suma(0,0) !== 0) {
    new Error('suma de 0 y 0 espera ser 0')
}

if (suma(1,3) !== 4) {
    new Error('suma de 1 y 3 espera ser 4')
}
 */
/* 
console.assert(
  suma(0, 0) === 4,
  'suma de 0 y 0 espera ser 0'
)
console.assert(
  suma(1, 3) === 4,
  'suma de 1 y 3 espera ser 4'
)
 */