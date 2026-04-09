# i18n Model

## Current State
- Locales: `en`, `tr`
- Messages live in `messages/en.json` and `messages/tr.json`
- Locale-routed pages live inside `src/app/[locale]/`

## Rules
- Add all new user-facing copy to both locale files.
- Avoid inline user-facing strings in implementation.
- Group translation keys by feature or page instead of random growth.
- Design components to tolerate text expansion and copy variation.

## Future Direction
- standardize message namespaces by domain
- maintain a glossary for repeated marketplace and seller terms
- review validation, empty states, and system feedback for completeness
