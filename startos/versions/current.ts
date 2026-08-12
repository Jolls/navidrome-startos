import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.63.2:2',
  releaseNotes: {
    en_US: `**Select Music Sources** now checks that a configured subfolder actually exists before saving, instead of letting a typo through to a daemon that then can't start. **Configure Navidrome**'s Scanner Schedule and Session Timeout fields now validate their input at save time (cron shape, and s/m/h-only duration units) — an invalid value previously crash-looped the daemon.`,
    es_ES: `**Seleccionar fuentes de música** ahora comprueba que la subcarpeta configurada exista antes de guardar, en lugar de permitir un error tipográfico que impida iniciar el demonio. Los campos Programación del escáner y Tiempo de espera de sesión de **Configurar Navidrome** ahora validan su entrada al guardar (formato cron, y unidades de duración solo s/m/h) — un valor inválido antes provocaba un bucle de fallos del demonio.`,
    de_DE: `**Musikquellen auswählen** prüft jetzt vor dem Speichern, ob der konfigurierte Unterordner tatsächlich existiert, statt einen Tippfehler durchzulassen, der den Daemon am Start hindert. Die Felder Scan-Zeitplan und Sitzungs-Timeout in **Navidrome konfigurieren** validieren jetzt ihre Eingabe beim Speichern (Cron-Format sowie nur s/m/h als Zeiteinheiten) — ein ungültiger Wert führte zuvor zu einer Absturzschleife des Daemons.`,
    pl_PL: `**Wybierz źródła muzyki** teraz sprawdza, czy skonfigurowany podfolder rzeczywiście istnieje, zanim zapisze ustawienia, zamiast pozwolić literówce przejść do demona, który potem nie może wystartować. Pola Harmonogram skanowania i Limit czasu sesji w **Skonfiguruj Navidrome** teraz walidują wartość podczas zapisu (format cron oraz jednostki czasu tylko s/m/h) — nieprawidłowa wartość wcześniej powodowała pętlę awarii demona.`,
    fr_FR: `**Sélectionner les sources musicales** vérifie désormais que le sous-dossier configuré existe réellement avant l'enregistrement, plutôt que de laisser passer une faute de frappe jusqu'à un démon qui ne peut alors pas démarrer. Les champs Planification du scanner et Expiration de session de **Configurer Navidrome** valident désormais leur saisie lors de l'enregistrement (format cron, et unités de durée limitées à s/m/h) — une valeur invalide provoquait auparavant une boucle de plantage du démon.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
