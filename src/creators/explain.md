No necesariamente. Justamente `recursive: true` evita que tengas que dividir la ruta por cada nivel.

Por ejemplo, si quieres crear:

```text
mi-proyecto/
└── src/
    └── features/
        └── users/
```

puedes hacerlo de una sola vez:

```ts
const dir = path.join(projectPath, 'src', 'features', 'users');

await fs.mkdir(dir, { recursive: true });
```

Node crea automáticamente todos los niveles que falten:

```text
src/
src/features/
src/features/users/
```

Ahora bien, **si tienes ramificaciones**, ahí sí necesitas más de un path. Por ejemplo:

```text
src/
├── features/
│   └── users/
└── configs/
```

puedes hacer:

```ts
await fs.mkdir(
  path.join(projectPath, 'src', 'features', 'users'),
  { recursive: true }
);

await fs.mkdir(
  path.join(projectPath, 'src', 'configs'),
  { recursive: true }
);
```

Observa que ambos comparten `src`, pero **no importa**:

1. La primera llamada crea `src/features/users`.
2. La segunda encuentra que `src` ya existe.
3. Como tienes `recursive: true`, continúa normalmente y crea `configs`.

Para un generador de proyectos, incluso podrías tener:

```ts
const directories = [
  'src/features/users',
  'src/configs',
  'src/shared/repositories',
  'src/shared/types',
  'tests/unit',
  'tests/integration'
];

for (const dir of directories) {
  await fs.mkdir(
    path.join(projectPath, dir),
    { recursive: true }
  );
}
```

No necesitas incluir explícitamente `src`, `src/features`, `src/shared`, etc. **Con indicar las "hojas" de cada rama alcanza**, porque `recursive: true` crea los padres que falten.

Creo que esto último es exactamente la idea que estabas planteando con "dividiéndose en la carpeta repetida": si hay una bifurcación, necesitas representar cada rama, pero no volver a crear manualmente el tronco común.
