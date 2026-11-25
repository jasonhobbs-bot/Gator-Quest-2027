# Gilbert Book March Madness 2027 — single-station edition

The website now focuses on the 16-book championship bracket, official voting calendar, student ballots, and grade-level results. No Firebase, Google Apps Script, student names, accounts, or billing required for this edition.

## Use

1. Open the published GitHub Pages website in a normal browser on **one dedicated, supervised voting device**.
2. Staff results: set a private four-digit PIN on that device, then enable official voting.
3. On each scheduled voting date, students select their grade and one contender. The device clock is interpreted in America/New_York. Official ballots are accepted only from 07:30 inclusive to 14:00 exclusive Eastern on the listed date. Practice ballots do not count.
4. After each matchup closes at 2:00 PM Eastern, the unique highest vote total automatically advances; tied results require a staff decision. No-vote matches remain pending. Winners advance to the next round. Later rounds require both prior winners. The championship is March 26, 2027.
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

## Weekly presentation and checkout activities

Use `presentation.html` for the grade/matchup selector, seven teacher-led slides, read-aloud discussion prompts, 10-minute checkout timer, projection mode and copyable iPad link. The 56 first-round grade-specific learning missions have two solvable guided challenges each. `activity.html` includes two book clues, guided challenges, a map exploration, and drawing/writing reflection. It supports pause/resume during checkout without submitting student records or tournament votes. Later rounds adapt to the confirmed winners; teachers can choose lesson-only contenders before results are available. Use the share link for the chosen grade and books. The activities are thematic extensions and comparison prompts, not literal plot quizzes. Ten minutes is approximate and students can finish at their own pace. No login or external backend is needed. Cover images and speech availability depend on the browser and network.

## Arcade upgrade

The iPad activity page now launches three actual games: Gator Dash (moving lane obstacle course), Catch Quest (drag-to-catch falling themed objects), and Memory Vault (matching book-themed cards). All 16 books have their own visual themes and collectibles. Seven grade settings adjust lanes, timing, targets, obstacle frequency and matching-pair counts. Students may pause for checkout, replay a round, or finish early. Typical play varies by skill; replay fills remaining time. Games use original canvas artwork and symbolic book-related objects, not story text or plot quizzes. No game scores, student identifiers or votes are persisted.

## Ten-minute arcade mode

The arcade now runs a 600-second session, including short automated level introductions and results, with checkout pauses excluded. Six game types cycle into harder bonus tiers. Session completion stops all game loops. Students may end the session manually from a level introduction. Maze walls are procedurally generated, and sorting and target rounds use both books’ themed objects. Scores are in memory only. The teacher presentation links to the same activity URL. Test on the school iPads before class.

## Weekly game variety

Every opening matchup has a distinct featured game and a six-game playlist drawn from fourteen mechanics. Consecutive opening weeks have no shared game mechanics. Featured games: Snowflake Mirror Magic, Duck's Bike Jump, Friendship Bridge Builder, Eraser & Marker Art Trail, Dinosaur Fossil Dig, Perfect Pizza Order Builder, Knight Owl Lantern Hunt, Silly Sound Rhythm Party. Later rounds have their own playlists, using the advancing books. Some mechanics return after intervening weeks. The ten-minute session, bonus levels, grade settings and checkout pause remain intact. Book-inspired puzzles use original thematic content, not literal scenes from the books.

## Automatic TV results

At 2:00 PM Eastern on each scheduled voting date, official votes close. Any match with a unique highest vote total advances automatically while the voting page or Gator TV is open on the voting browser, or when reopened. Ties require staff resolution; no-vote matches remain pending. Gator TV automatically changes to a winner celebration and animated final scoreboard with both totals, margin, percentages, total ballots, and updated bracket. On a separate computer, results do not automatically synchronize; export the aggregate TV results snapshot from the voting device and import on the display computer. The export includes confirmed counts, not individual ballots. Results remain in the rotating broadcast after close. No external service or background ChatGPT task is required.
