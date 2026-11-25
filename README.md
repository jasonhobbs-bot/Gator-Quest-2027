# Gator Quest 9.0 — The Road to the Championship

Gilbert Elementary · March Madness 2027. GitHub Pages + Firebase. No student accounts, names, email addresses or individual learning records. The site includes 16 contenders, 15 bracket matchups, 8 worlds, 56 grade-level missions (112 guided challenges and 56 optional trails), practice voting, an optional local-only passport, teacher overviews and Gator TV.

## 1. Preview or publish the website

- Preview: open `index.html` from the extracted folder. It works in practice mode without a server. The standalone preview file distributed alongside this ZIP also works. Cover images need internet access; a title card is the fallback. The edition of *Rock and Roll* still needs confirmation (set its ISBN in `data.js`). Verify all covers on your school network.
- Create a **new** GitHub repository called `Gator-Quest-2027`. Do not overwrite another school repository. For free public GitHub Pages, set repository visibility to Public. Upload the extracted files and directories at the repository root (not the ZIP itself), or use Git:

```sh
git init
git add .
git commit -m "Gator Quest 9.0 initial release"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/Gator-Quest-2027.git
git push -u origin main
```

In GitHub Settings > Pages choose Deploy from a branch > main > / (root). This serves the website; it does **not** deploy Firebase Cloud Functions. Never upload credentials, private PINs, service account keys or `.env` files. The server source is safe to publish when secrets remain in Secret Manager.

## 2. Connect Firebase (required for official voting)

1. Create a **new** Firebase project, register a Web App, and copy its public configuration. Do not use a service-account JSON file. Choose a Firestore location appropriate for the school. Enable Cloud Firestore in production mode. Do not deploy the restrictive rules to an unrelated existing Firestore project; they deny all direct client access.
2. In Authentication, enable the Google provider. Under Settings > Authorized domains, add `YOUR-USERNAME.github.io` (hostname only). The authorized staff Google account signs in once per browser session/device, then uses the four-digit PIN for 10-minute staff sessions. Student devices never sign in. If the school's Google Workspace blocks Firebase Google sign-in, have the administrator approve the app before official use.
3. Cloud Functions deployment requires the Firebase Blaze billing plan. Set a Google Cloud billing budget and alerts, review the limits, and understand alerts do not impose a hard cap. The function sets maxInstances=5. Use a school-approved Firebase project and account.
4. Install Node.js 22 and the Firebase CLI on your computer. In Terminal, run the following inside the extracted directory (replace the project ID):

```sh
npm install -g firebase-tools
firebase login
firebase use --add
cd functions
npm install
npm test
cd ..
firebase functions:secrets:set GQ_STAFF_PIN
firebase functions:secrets:set GQ_SESSION_KEY
firebase deploy --only firestore:rules,functions
```

At the secret prompts, enter your private four-digit PIN (preserve leading zeroes) and an independently generated long random signing secret (at least 32 random bytes, e.g. output from `openssl rand -hex 32`). **Do not put either secret in GitHub or the browser configuration.** During deployment, provide `GQ_STAFF_EMAIL` as the authorized staff account and `GQ_SITE_ORIGIN` as the exact GitHub Pages origin (for example `https://YOUR-USERNAME.github.io` with no trailing slash or repository path). The CLI may create `functions/.env.<project>`; it is ignored by Git. The API function must be invokable publicly so students can submit supervised votes; staff endpoints verify both Firebase ID tokens and server-validated PIN sessions.

5. Copy the deployed HTTPS URL for function `api` from Firebase CLI output. Update the public `config.js` with that URL and the Web App config from Step 1. Commit only `config.js` (and the package lock, if generated); never commit secret files. Confirm the website banner says the database is connected.
6. Optional retention: configure Firestore TTL on collection group `receipts`, field `expiresAt` (24-hour ballot retry receipts). Receipts contain only grade, book and matchup, indexed by a hash of the random station token and ballot request ID. No student identity is submitted. Firebase/Google Cloud may still process ordinary connection metadata; confirm school privacy and retention rules. Aggregate totals remain until the project owner removes them.

## 3. Run the tournament

- Staff page: sign in with authorized Google account, enter PIN. Five wrong PINs lock attempts for 15 minutes. Unlocking creates a ten-minute session. Use "Enable official voting", then "Open new station". The station lasts 90 minutes or 500 ballots; creating a new station closes the previous one. Copy the station link to a supervised voting iPad or use the voting page on the same device. Station token is in the URL fragment and removed after opening; avoid sharing it broadly. Close station when done, pause voting if needed, and lock the staff page on a shared device. Google login may persist on the trusted staff browser; sign out when leaving it.
- Students select grade and a matchup, tap a book, then the next student button clears the grade. No names or student IDs. The server enforces scheduled dates and 7:30 AM–2:20 PM Eastern. Staff supervision, rather than identity tracking, enforces one vote per student; this cannot prevent a determined user who has a station token from submitting multiple distinct requests. Official voting is separate from local practice voting.
- Staff can view vote totals by grade and confirm the highest-voted book after the scheduled close (ties require a choice). Later rounds require previous winners. Public bracket shows confirmed winners only. The database starts empty and paused. No old spreadsheet votes are imported.
- Before January 15, 2027, practice ballots remain available; real ballots are rejected outside the official windows. Test official voting in a separate staging project with a temporary test calendar (change catalog.json in staging only). Do not change production dates to test. Deployment is not a substitute for a supervised end-to-end test.

## Verification and limits

- Browser smoke checks in Chromium with external requests blocked: home, worlds, books, bracket, passport, teacher, practice vote (nonofficial), official vote disabled without config, staff, TV, and Pre-K mission intro. No JavaScript errors observed in this test. Full live Firebase, cover network and all individual activities need testing.
- `node --test functions/test.js` checks opening/closing, pause, future date rejection, later rounds, daylight saving time, winner timing, ties and no-vote safeguards. Syntax checked the frontend and backend. Firebase dependencies were not installed or deployed in this environment; no live transaction, auth or station workflow is represented as tested.
- This release deliberately excludes independent student assessments, individual records and Apps Script. Teacher resources are lesson overviews, not the complete former teaching playbook. Graphics use original SVG and CSS plus external book cover artwork. Local badges are optional and not uploaded.
- A missing Firebase configuration keeps official voting disabled. The website cannot be made live until the GitHub repo is created and Firebase configuration/deployment is completed.
