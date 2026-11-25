# Gilbert Book March Madness 2027 — single-station edition

The website now focuses on the 16-book championship bracket, official voting calendar, student ballots, and grade-level results. No Firebase, Google Apps Script, student names, accounts, or billing required for this edition.

## Use

1. Open the published GitHub Pages website in a normal browser on **one dedicated, supervised voting device**.
2. Staff results: set a private four-digit PIN on that device, then enable official voting.
3. On each scheduled voting date, students select their grade and one contender. The device clock is interpreted in America/New_York. Official ballots are accepted only from 07:30 inclusive to 14:20 exclusive Eastern on the listed date. Practice ballots do not count.
4. After each matchup closes, staff confirm the highest vote total; ties require a staff decision. Winners advance to the next round. Later rounds require both prior winners. The championship is March 26, 2027.
5. After every voting day, export all ballots (CSV), grade totals (CSV), and a restorable JSON backup. Store the backup outside the browser. The CSV includes grade, book, matchup, and ballot timestamp, but no student name or account.
6. To transfer to a replacement device, create the local PIN there, restore the JSON backup, then enable voting when ready. Do not conduct simultaneous official voting on multiple devices.

## Limitations and safety

- Results and PIN are stored in browser localStorage, scoped to this site. They do not synchronize across browsers, devices, or public displays. Clearing site data can erase results. A local PIN is only a deterrent; it is not server-side security. Staff must supervise voting and prevent repeat ballots. Client device time can be altered. Do not use private browsing for the voting station.
- Official votes are saved before success is displayed. The station starts paused; enabling the station does not bypass the calendar. Practice is available before January. Restore validates the backup and pauses voting; it replaces existing results after confirmation.
- The original adventure and Firebase files remain in the repository as an archive but are no longer loaded by the homepage. No configuration is required to use the single-device edition.
- External book-cover images require network access. Rock and Roll is Ruby Amy Thompson’s hardcover edition, ISBN 9781664300927. Cover failures display a title card.
- Core logic checks passed for January open/close, DST, later-round dependencies, counting by grade, tied winner choices, backup validation, and late-vote rejection. Live browser storage, cover loading, and staff workflow need verification on the designated device.

## TV broadcast

Open `tv.html` for a silent, rotating full-screen weekly matchup broadcast. It follows the Eastern calendar, displays equal-time book spotlights, voting hours, and the bracket. Use the week selector to preview a future matchup. Same-browser results are read automatically from the voting station. On a separate TV computer, open the TV page on the voting device, export its TV bracket snapshot, then import that file on the TV computer after confirming winners. The snapshot contains only confirmed winners, not individual ballots. No shared database is required. TV never modifies voting data.
