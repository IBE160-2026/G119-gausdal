import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

/**
 * AD-2 / AR-2: src/domain/ er en ren kjerne. Den skal aldri importere fra
 * src/app/, Prisma eller bruke nettverk/klokke direkte. Denne regelen er
 * håndhevingen av AD-2 — meldingene peker tilbake til AD-2.
 */
const domainBoundary = {
  files: ['src/domain/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@prisma/client',
            message: 'AD-2: src/domain/ kan ikke importere Prisma. Send data inn som argument fra src/app/.',
          },
        ],
        patterns: [
          {
            group: ['@/app/*', '@/app', '**/app/**', '@prisma/*', 'prisma', 'prisma/*'],
            message: 'AD-2: src/domain/ kan ikke importere fra src/app/ eller Prisma. Kjernen skal være ren.',
          },
        ],
      },
    ],
    'no-restricted-globals': [
      'error',
      {
        name: 'fetch',
        message: 'AD-2: src/domain/ kan ikke bruke nettverk. Send data inn som argument fra src/app/.',
      },
      {
        name: 'XMLHttpRequest',
        message: 'AD-2: src/domain/ kan ikke bruke nettverk. Send data inn som argument fra src/app/.',
      },
    ],
    'no-restricted-syntax': [
      'error',
      {
        selector: "CallExpression[callee.object.name='Date'][callee.property.name='now']",
        message: 'AD-2: src/domain/ kan ikke lese klokken. Send tidspunktet inn som argument fra src/app/.',
      },
      {
        selector: "NewExpression[callee.name='Date'][arguments.length=0]",
        message: 'AD-2: src/domain/ kan ikke lese klokken. Send tidspunktet inn som argument fra src/app/.',
      },
      {
        selector: "MemberExpression[object.name='process'][property.name='env']",
        message: 'AD-2: src/domain/ kan ikke lese miljøvariabler. Send verdien inn som argument fra src/app/.',
      },
      {
        selector: 'ImportExpression',
        message: 'AD-2: src/domain/ kan ikke importere dynamisk heller. Send data inn som argument fra src/app/.',
      },
      {
        selector: "CallExpression[callee.name='require']",
        message: 'AD-2: src/domain/ kan ikke bruke require(). Send data inn som argument fra src/app/.',
      },
      {
        selector: "VariableDeclarator[init.name='process']",
        message: 'AD-2: src/domain/ kan ikke lese miljøvariabler, heller ikke via destrukturering av process. Send verdien inn som argument fra src/app/.',
      },
    ],
  },
};

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  domainBoundary,
  {
    ignores: ['node_modules/**', '.next/**', 'prisma/migrations/**'],
  },
];

export default eslintConfig;
