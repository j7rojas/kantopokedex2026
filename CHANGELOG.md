# Changelog

All notable changes to this project will be documented in this file.

## v0.3.1 - 2026-03-16
- **UI**: Fixed an issue where the whole Pokémon card would scroll when content was long.
- **UI**: Pin all top sections (image, stats, evolution) as fixed, while only the moves table area scrolls internally.
- **UI**: Improved layout reliability using `min-h-0` and nested flex containers for the scrollable moves section.

## v0.3.0 - 2026-03-16
- **Feature**: Added "Evolutionary Chain" section to all Pokémon cards.
- **Data**: Implemented evolution data fetching via species and evolution_chain endpoints on the backend.
- **UI**: Created `EvolutionChain` component with normalized Generation III sprites and readable trigger labels (e.g., "Lv. 16", "Trade").
- **UI**: Refactored card layout to be fixed-size with an internal scrollable moves list, ensuring a compact and stable design.
- **UI**: Rebuilt the grid geometry to naturally frame one row per viewport using standard CSS Grid and Flexbox, removing previous 'magic' values and hacky padding.
- **UI**: Removed hover scale effect to ensure layout stability.
- **Refactor**: Cleaned up the entire layout architecture for better maintainability and code quality.
- **Documentation**: Updated README to reflect the final clean architecture and data flow.

## v0.2.0 - 2026-03-16 (Deprecated Legacy Branch Work)
- Intermediate versions v0.2.x were part of a rapid iteration/debugging phase.
- Functionality has been consolidated and rebuilt cleanly in v0.3.0.

## v0.1.0 - 2026-01-01
- Initial release with basic Pokémon info, stats radar chart, and move list.
