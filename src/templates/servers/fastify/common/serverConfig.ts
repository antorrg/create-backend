export const serverConfig = `import type { Options as AjvOptions } from 'ajv'

export const ajvOptions: AjvOptions = { //* Esto para poder trabajar con swagger y ajv
  strict: false, // Permite palabras no estándar como "example"
  //keywords: ['example'], // Declaramos explícitamente las keywords extra que queremos permitir
  coerceTypes: 'array', // Opcional: activar coerción de tipos (por ejemplo, convertir '123' en número)
  // Opcional: remover propiedades que no estén en el schema
  removeAdditional: 'failing', // o 'all' si querés borrarlas sin fallar
  allErrors: true // Validar todas las propiedades en vez de frenar al primer error
}

export const fastiCors = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization']
}`