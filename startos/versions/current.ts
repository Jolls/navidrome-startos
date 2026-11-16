import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.64.2:5',
  releaseNotes: {
    en_US:
      'Import Existing Database now works; previously every upload failed. The file now uploads directly to the service and is checked before it replaces the current database. Requires StartOS 0.4.2 or later.',
    es_ES:
      'Importar Base de Datos Existente ahora funciona; antes fallaba en cada carga. El archivo ahora se sube directamente al servicio y se comprueba antes de reemplazar la base de datos actual. Requiere StartOS 0.4.2 o posterior.',
    de_DE:
      'Vorhandene Datenbank importieren funktioniert jetzt; bisher schlug jeder Upload fehl. Die Datei wird jetzt direkt in den Dienst hochgeladen und geprüft, bevor sie die aktuelle Datenbank ersetzt. Erfordert StartOS 0.4.2 oder neuer.',
    pl_PL:
      'Importuj istniejącą bazę danych teraz działa; wcześniej każde przesłanie kończyło się błędem. Plik jest teraz przesyłany bezpośrednio do usługi i sprawdzany, zanim zastąpi bieżącą bazę danych. Wymaga StartOS 0.4.2 lub nowszego.',
    fr_FR:
      'Importer une base de données existante fonctionne désormais ; auparavant, chaque envoi échouait. Le fichier est désormais envoyé directement au service et vérifié avant de remplacer la base de données actuelle. Nécessite StartOS 0.4.2 ou une version ultérieure.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
