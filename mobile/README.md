# HireMatch Mobile

Native iOS and Android app built with Expo and React Native. The original Vite web app remains at the repository root.

## Run locally

```sh
cd mobile
npm install
npm start
```

Then open it in Expo Go or an Android/iOS simulator. Use `npm run android` or `npm run ios` to start directly on an available simulator/device.

The app opens on a combined Log in / Sign up screen. Both flows collect a username and password and let the user choose Recruiter or Job Seeker; continuing routes to the matching role dashboard. The Job Seeker area includes job search and filters, matched jobs, application status filters, editable profile fields, and resume builder. The Job Recruiter area includes job posting summaries and recent applicants.

Authentication, job postings, and applicant data are demonstration UI only; no account service or backend is connected.
