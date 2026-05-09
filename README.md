# tailor-discovery-app

React Native app connecting customers with verified local tailors — discovery, booking, and tailor onboarding.

Built with React Native CLI 0.85 + TypeScript. Targets iOS and Android from a single codebase.

---

## Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| Node.js | ≥ 22.11.0 | JavaScript runtime |
| npm | ≥ 10 | Package manager (ships with Node) |
| Watchman | latest | File watcher for Metro bundler |
| JDK | 17 (Zulu/Corretto/Temurin) | Required by Gradle for Android builds |
| Android Studio | Latest | Android SDK, emulator, `adb` |
| Xcode | Latest (Mac App Store) | iOS build tools + Simulator |
| CocoaPods | latest | iOS native dependency manager |

---

## One-time machine setup

Run these once per machine. Skip any tool you already have installed.

### 1. Install Homebrew (if not installed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install Node 22, Watchman, CocoaPods, JDK 17

React Native 0.85 requires **Node ≥ 22.11.0**. Older versions will fail at Metro startup with `configs.toReversed is not a function`.

**Option A — Via Homebrew:**
```bash
brew install node@22 watchman cocoapods
brew install --cask zulu@17
```

If you have an older Node already linked:
```bash
brew unlink node && brew link node@22
```

**Option B — Via mise (recommended if you work on multiple projects):**
```bash
brew install mise
brew install watchman cocoapods
brew install --cask zulu@17
```

Then activate mise in your shell (one-time setup):
```bash
echo 'eval "$(mise activate zsh)"' >> ~/.zshrc
source ~/.zshrc
```

The repo already includes a `mise.toml` pinning Node 22 to this project, so `cd`-ing into the directory automatically uses the right Node version. Install it with:
```bash
mise install
node --version   # should print v22.x
```

### 3. Install Android Studio

```bash
brew install --cask android-studio
```

Then open Android Studio once and complete the first-run setup wizard:

1. Launch **Android Studio** (Spotlight → "Android Studio")
2. Choose **Do not import settings** when prompted
3. Install Type → **Standard** → **Next**
4. Accept all license agreements → **Finish**
5. Wait for the SDK to download (~3 GB)

### 4. Create an Android Virtual Device (emulator)

In Android Studio's welcome screen:

1. **More Actions** → **Virtual Device Manager**
2. **+ Create Virtual Device**
3. Pick **Pixel 7** → **Next**
4. Pick **API 34 (Android 14)** — click "Download" next to it if needed
5. **Next → Finish**
6. Click the **▶** icon next to the new device to boot it

### 5. Install Xcode (for iOS)

Install **Xcode** from the Mac App Store (~10 GB). After install:

```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -license accept
```

### 6. Set environment variables

Add the following to `~/.zshrc`:

```bash
# Java (JDK 17 for Gradle compatibility)
export JAVA_HOME=$(/usr/libexec/java_home -v 17)

# Android SDK
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Reload the shell:

```bash
source ~/.zshrc
```

### 7. Verify setup

```bash
npx react-native doctor
```

Fix anything reported red before continuing. Most issues `doctor` can auto-fix — press `f` when prompted.

---

## Project setup

Clone the repo and install JS dependencies:

```bash
git clone https://github.com/Aakansha99/tailor-discovery-app.git
cd tailor-discovery-app
npm install
```

For iOS, install pods:

```bash
cd ios
bundle install          # one-time, installs Ruby gems including CocoaPods
bundle exec pod install
cd ..
```

---

## Running the app

The dev workflow uses **two terminals running side by side**. Metro must be running before the app launches, otherwise the app shows a red `Unable to load script` error screen.

### Terminal 1 — Start Metro bundler

```bash
cd /path/to/tailor-discovery-app
npm start
```

Leave this terminal running while you develop. Metro serves the JS bundle and watches for file changes (hot reload).

### Terminal 2 — Run on Android

Make sure an emulator is running (boot one from Android Studio's Device Manager) or a physical device is connected.

```bash
npm run android
```

First build takes 5–10 minutes (downloads NDK, CMake, build-tools, etc.). Subsequent builds are ~30 seconds.

### Terminal 2 (alt) — Run on iOS

```bash
npm run ios
```

This launches the iOS Simulator and installs the app.

### After the first run

For pure JS/TS changes, you don't need to re-run `npm run android`. Just save your file — Metro hot-reloads automatically. You only need to rebuild when:
- You change anything under `android/` or `ios/`
- You install a library with native code
- You edit `package.json` dependencies

---

## Common commands

```bash
npm start                  # Start Metro bundler
npm run android            # Build & run on Android
npm run ios                # Build & run on iOS Simulator
npm run lint               # Run ESLint
npm test                   # Run Jest tests
npx tsc --noEmit           # TypeScript type-check
npx react-native doctor    # Diagnose setup issues
```

---

## Project structure

```
tailor-discovery-app/
├── android/                # Android native project (Gradle)
├── ios/                    # iOS native project (Xcode + CocoaPods)
├── __tests__/              # Jest test files
├── App.tsx                 # Root React component
├── index.js                # App entry point
├── package.json            # JS dependencies & scripts
├── tsconfig.json           # TypeScript config
├── .eslintrc.js            # ESLint rules
├── .prettierrc.js          # Prettier formatting rules
└── metro.config.js         # Metro bundler config
```

---

## Troubleshooting

**`adb: command not found`**
`ANDROID_HOME` is not set or the SDK isn't installed. Re-check Step 6 above.

**`SDK location not found`**
Same as above — set `ANDROID_HOME` in `~/.zshrc` and `source ~/.zshrc`.

**`No emulators found`**
Boot an emulator from Android Studio → Device Manager before running `npm run android`.

**Gradle build fails with Java errors**
Confirm `java -version` returns 17. If not, set `JAVA_HOME` to JDK 17 (see Step 6).

**`configs.toReversed is not a function` when running `npm start`**
You're on Node < 22. RN 0.85 requires Node ≥ 22.11.0. Run `node --version` to confirm. If you use mise, run `mise install` in the project directory and open a fresh terminal.

**Red error screen on emulator: "Unable to load script"**
Metro bundler isn't running. Open another terminal, `cd` to the project, and run `npm start`. Then on the emulator press `R` twice (or tap RELOAD).

**iOS build fails after running pods**
Try `cd ios && pod deintegrate && bundle exec pod install` and re-run.

**Port 8081 already in use**
Kill the existing Metro: `lsof -ti:8081 | xargs kill -9`, then `npm start` again.

---

## Tech stack

- **React Native** 0.85 (CLI, bare workflow)
- **TypeScript** 5.8
- **React Navigation** v7 (native-stack)
- **ESLint** + **Prettier** (RN community defaults)
- **Jest** for unit tests
