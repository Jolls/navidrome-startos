import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.64.2:5',
  releaseNotes: {
    en_US:
      "Import Existing Database works, and refuses a file that isn't a SQLite database without touching the current one. Requires StartOS 0.4.2 or later.",
    es_ES:
      'Importar Base de Datos Existente funciona y rechaza un archivo que no sea una base de datos SQLite sin tocar la actual. Requiere StartOS 0.4.2 o posterior.',
    de_DE:
      'Vorhandene Datenbank importieren funktioniert und weist eine Datei, die keine SQLite-Datenbank ist, zurück, ohne die aktuelle anzutasten. Erfordert StartOS 0.4.2 oder neuer.',
    pl_PL:
      'Importuj istniejącą bazę danych działa i odrzuca plik, który nie jest bazą danych SQLite, bez naruszania bieżącej. Wymaga StartOS 0.4.2 lub nowszego.',
    fr_FR:
      'Importer une base de données existante fonctionne et refuse un fichier qui n’est pas une base de données SQLite sans toucher à la base actuelle. Nécessite StartOS 0.4.2 ou une version ultérieure.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
