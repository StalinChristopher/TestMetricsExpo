# Expo RN template

Expo SDK app aligned with the Code & Theory React Native template (navigation, theme, TanStack Query, i18n, MMKV).

## CI (GitHub Actions)

After you apply the shared **`rn.yml`** workflow from **`template-pipeline-react-native`** (see that repo’s **`docs/RN_WORKFLOW_REUSE.md`** and **`CURSOR_RN_DEVOPS_ONE_SHOT_APPLY.txt`**):

- **Workflow integration requires `expo prebuild`:** run **`npx expo prebuild --clean`** with the correct **`APP_ENV`** (or your flavor scripts in `package.json`), then **commit the generated `android/` and `ios/`** directories to git. The pipeline’s **`expo-native-dirs`** gate fails if those trees are missing, with an error pointing you to prebuild and commit again.
- **Root `Gemfile` / `Gemfile.lock`:** Shipped at the repo root for **Bundler** (CI runs `bundle install`, then `bundle exec pod install` for iOS). **`expo prebuild` does not create these files** — keep them when copying the template or applying the DevOps kit.
- **`fastlane/` (Fastfile):** **Not** part of this Expo template tree. The canonical **`fastlane/`** lives in **`template-pipeline-react-native`** and is **copied into your app repo when you apply the RN DevOps kit** (same step as `.github/` — see that repo’s **`SETUP_RN_DEVOPS_KIT.md`** / **`CURSOR_RN_DEVOPS_ONE_SHOT_APPLY.txt`**). After **`expo prebuild`** and a committed **`ios/`** tree, run **`python3 .github/scripts/bootstrap_rn_workflow_ids.py`** so `Fastfile` workspace / IPA paths match your Xcode project.
- **Detect:** `package.json` listing the **`expo`** package makes `detect` output **`expo`**. Native **`android-dev`** / **`ios-dev`** jobs then run on GitHub runners (Gradle + Fastlane + optional Firebase), same pattern as a bare app—**no cloud build step in the default `rn.yml` orchestrator.**
- **JS gates:** `npm run lint` (`expo lint`), `npm run format:check`, `npm run typecheck`, `npm run test:ci` (coverage threshold matches the pipeline).

Use `npm run format` to fix Prettier issues locally. Install dependencies with **`npm ci`** in CI (this template ships **`package-lock.json`** only).

**Development client:** This template includes **`expo-dev-client`**. After prebuild, use **`npm run ios:*` / `npm run android:*`** or open the generated native project, install the dev build on a device or simulator, then **`npx expo start`** and open the app in that client (not Expo Go). See [Development builds](https://docs.expo.dev/develop/development-builds/introduction/).

**iOS / Android signing in CI:** Configure the same **GitHub Actions secrets** as a bare app (keystore, distribution or dev signing certs/profiles, Firebase) per **`GITHUB_SECRETS_CHECKLIST.md`** from the pipeline repo. Run **`python3 .github/scripts/bootstrap_rn_workflow_ids.py`** after prebuild so `rn.yml` Gradle tasks, APK globs, bundle id, and Xcode scheme match your generated project.

**Prebuild / native-only tweaks:** If you add bare-style native config (for example resource shrinking), mirror patterns from **`CliTemplate`** where applicable. Env at runtime uses **`expo-constants`** and **`app.config.ts`** flavors, not `react-native-config`.

**CocoaPods deployment targets:** After **`expo prebuild`**, some dependencies ship with a low **`IPHONEOS_DEPLOYMENT_TARGET`** (for example **11.0**), which Xcode’s SDK flags as unsupported next to your app’s **`platform :ios`**. In **`ios/Podfile`**, inside the existing **`post_install`** hook **after** **`react_native_post_install`**, normalize pod targets to at least **`12.0`** and your app’s deployment target, for example:

```ruby
    app_ios = podfile_properties['ios.deploymentTarget'] || '15.1'
    min_supported = [12.0, app_ios.to_f].max
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |cfg|
        current = cfg.build_settings['IPHONEOS_DEPLOYMENT_TARGET']
        next if current.nil?
        cfg.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = min_supported.to_s if current.to_f < min_supported
      end
    end
```

Then run **`bundle exec pod install --project-directory=ios`** and commit **`Podfile.lock`** when it changes. Re-apply after regenerating **`ios/`** if the hook is not preserved by your prebuild workflow.

## Local development

```sh
npm install
npm start
```

See [Expo documentation](https://docs.expo.dev/) for environment setup and **`expo prebuild`**.
