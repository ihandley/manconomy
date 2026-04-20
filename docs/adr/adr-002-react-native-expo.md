# ADR-002: React Native + Expo over Flutter

**Status:** Accepted
**Date:** April 11, 2026

## Context

The Manconomy requires a cross-platform mobile app targeting iOS and Android from a single
codebase. The founder has existing JavaScript/TypeScript proficiency and no prior Dart or
Flutter experience. The MVP must reach beta users within one development cycle, so framework
ramp-up time is a direct cost.

Three options were evaluated:

| Option | Language | iOS | Android | Web | Learning curve | Ecosystem |
|---|---|---|---|---|---|---|
| **React Native + Expo** | TypeScript | ✅ | ✅ | ✅ (limited) | None (JS already known) | Massive |
| Flutter | Dart | ✅ | ✅ | ✅ | High (new language + paradigm) | Growing |
| Native (Swift + Kotlin) | Swift / Kotlin | ✅ | ✅ | ❌ | Very high (two codebases) | Mature |

Key requirements driving the decision:
- **Maps:** Hyperlocal listings require react-native-maps (Google Maps / Apple Maps) or equivalent.
- **Camera:** Listing photos require `expo-camera` or `expo-image-picker`.
- **Push notifications:** Trade and offer alerts require `expo-notifications`.
- **Auth flows:** Supabase Auth SDK has first-class React Native support.
- **OTA updates:** Ability to ship hot fixes without App Store review delays.
- **Solo developer:** Two codebases (native) or a new language (Flutter) would double build time.

## Decision

Use **React Native with the Expo managed workflow** as the mobile application framework.

Expo is chosen over bare React Native because:
1. `expo-camera`, `expo-location`, `expo-image-picker`, and `expo-notifications` cover all MVP
   hardware requirements without native module linking.
2. Expo Router (file-based routing) provides a familiar Next.js-style navigation structure.
3. Expo EAS Build produces signed App Store and Play Store binaries from CI without maintaining
   a Mac build server.
4. Expo Go enables rapid device testing during development without a full native build.

## Consequences

### Positive
- **Zero language switching** — the entire stack (mobile, Edge Functions, database migrations)
  is TypeScript. One mental model, one linter config, one CI pipeline.
- **Expo SDK** abstracts all platform-specific APIs (camera, location, notifications, secure
  storage) behind consistent cross-platform interfaces.
- **Expo EAS Build + Submit** automates App Store / Play Store submission from GitHub Actions.
- **OTA updates** via Expo Updates allow shipping JS bundle fixes without triggering a full
  App Store review — critical for a credit-system bug fix that can't wait 24–48 hours.
- **Zustand** (chosen state manager) integrates idiomatically with React hooks; no new patterns
  to learn.
- Largest mobile JS ecosystem — any library needed (maps, charts, date pickers, QR codes) has
  a React Native package.

### Negative / Trade-offs
- **Expo managed workflow** limits access to custom native modules. If a future feature requires
  a native module not in the Expo SDK, ejecting to bare workflow is required. This is a
  well-trodden migration path but adds complexity.
- **Performance ceiling:** React Native's JS bridge (and even the new JSI/Fabric architecture)
  is slower than native for animation-heavy or compute-intensive UIs. The Manconomy's UI is
  list-and-form-heavy — this is not a concern for MVP.
- **Flutter** would offer better animation performance and a more consistent design system. This
  is irrelevant given the founder's existing TypeScript fluency.
- **Bundle size:** Expo apps are larger than minimal native apps. Acceptable trade-off for solo
  development velocity.

### Neutral
- Navigation: Expo Router (file-based, similar to Next.js App Router).
- State: Zustand (lightweight, no boilerplate, DevTools-compatible).
- Maps: `react-native-maps` with Google Maps API key (iOS + Android).
- Styling: NativeWind (Tailwind CSS for React Native) for consistent design tokens.
- The app targets iOS 16+ and Android 13+ (API level 33+) to keep polyfill surface small.
