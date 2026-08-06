import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.63.2:1',
  releaseNotes: {
    en_US: `New **Configure Navidrome** action adds Scanner Schedule, Log Level, and Session Timeout fields alongside the existing Multi-Scrobbler and Recently-Added-by-modification-time toggles. \`ND_MUSICFOLDER\` is now also set explicitly rather than relying on the image's implicit default.`,
    es_ES: `La nueva acción **Configurar Navidrome** añade los campos Programación del escáner, Nivel de registro y Tiempo de espera de sesión, junto a los interruptores existentes de Multi-Scrobbler y "Añadidos recientemente" por fecha de modificación. \`ND_MUSICFOLDER\` ahora también se establece explícitamente en lugar de depender del valor predeterminado implícito de la imagen.`,
    de_DE: `Die neue Aktion **Navidrome konfigurieren** fügt die Felder Scan-Zeitplan, Protokollstufe und Sitzungs-Timeout neben den bestehenden Umschaltern für Multi-Scrobbler und "Kürzlich hinzugefügt nach Änderungsdatum" hinzu. \`ND_MUSICFOLDER\` wird jetzt ebenfalls explizit gesetzt, statt sich auf den impliziten Standardwert des Images zu verlassen.`,
    pl_PL: `Nowa akcja **Skonfiguruj Navidrome** dodaje pola Harmonogram skanowania, Poziom logowania i Limit czasu sesji obok istniejących przełączników Multi-Scrobbler i sortowania „Ostatnio dodane” według czasu modyfikacji. \`ND_MUSICFOLDER\` jest teraz również ustawiane jawnie, zamiast polegać na domyślnej wartości obrazu.`,
    fr_FR: `La nouvelle action **Configurer Navidrome** ajoute les champs Planification du scanner, Niveau de journalisation et Expiration de session, aux côtés des bascules existantes pour Multi-Scrobbler et le tri "Ajoutés récemment" par date de modification. \`ND_MUSICFOLDER\` est désormais également défini explicitement plutôt que de dépendre de la valeur par défaut implicite de l'image.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
