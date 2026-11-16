import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.64.2:5',
  releaseNotes: {
    en_US:
      "Import Existing Database works, and refuses a file that isn't a SQLite database without touching the current one. Requires StartOS 0.4.2 or later. Now maintained by Start9 and published in the Start9 Registry.",
    es_ES:
      'Importar Base de Datos Existente funciona y rechaza un archivo que no sea una base de datos SQLite sin tocar la actual. Requiere StartOS 0.4.2 o posterior. Ahora lo mantiene Start9 y se publica en el Start9 Registry.',
    de_DE:
      'Vorhandene Datenbank importieren funktioniert und weist eine Datei, die keine SQLite-Datenbank ist, zurück, ohne die aktuelle anzutasten. Erfordert StartOS 0.4.2 oder neuer. Wird jetzt von Start9 gepflegt und in der Start9 Registry veröffentlicht.',
    pl_PL:
      'Importuj istniejącą bazę danych działa i odrzuca plik, który nie jest bazą danych SQLite, bez naruszania bieżącej. Wymaga StartOS 0.4.2 lub nowszego. Teraz utrzymywany przez Start9 i publikowany w Start9 Registry.',
    fr_FR:
      'Importer une base de données existante fonctionne et refuse un fichier qui n’est pas une base de données SQLite sans toucher à la base actuelle. Nécessite StartOS 0.4.2 ou une version ultérieure. Désormais maintenu par Start9 et publié dans le Start9 Registry.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
