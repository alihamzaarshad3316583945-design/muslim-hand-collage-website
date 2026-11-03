MUSLIM HANDS COLLEGE OF EXCELLENCE — WEBSITE DEMO
=================================================

HOW TO OPEN
1. Extract this ZIP to a folder on your Windows computer.
2. Open the extracted folder.
3. For browsing only, double-click index.html. It should open in Chrome.
4. To use the AI assistant, follow the server setup below and visit http://localhost:3000.
5. Click the menu links to navigate between the 15 content pages.

FILES
- index.html: Home page
- about.html, admissions.html, programs.html, courses.html
- faculty.html, results.html, gallery.html, news.html, contact.html
- apply.html, student-life.html, facilities.html, faq.html, downloads.html
- assets/style.css: design and responsive layout
- assets/script.js: responsive navigation, theme toggle, site search, animations, assistant interface, and demo form behavior
- login.html, signup.html: responsive student, teacher, and admin sign-in and student registration pages
- auth.css, auth.js: black-and-gold authentication page styling and API interaction
- admin.html, admin.js: role-protected college management dashboard
- student.html, student-portal.js: student profile and records portal
- teacher.html, teacher-portal.js: assigned-class attendance portal
- management.css: responsive dashboard, tables, forms, and chart styling
- server.js, management-api.js: Express authentication, role-protected college APIs, sessions, and OpenAI chat endpoint
- Private SQLite database: created automatically in the server user's home directory, outside the public website files
- package.json: Node.js dependencies and start script
- .env.example: example server configuration; copy it to .env and configure private credentials
- images/: supplied campus building, college logo, and website creator images
- 404.html: branded page-not-found screen

AI ASSISTANT SETUP (REQUIRED FOR REAL AI RESPONSES)
1. Install Node.js 20 LTS or later from https://nodejs.org/.
2. Open PowerShell (Windows) or Terminal (Mac) in this project folder.
3. Copy the example environment file:
   - Windows PowerShell: Copy-Item .env.example .env
   - Mac/Linux: cp .env.example .env
4. Open .env in a text editor. Replace the example OPENAI_API_KEY value with your own API key. Keep this file private; it is ignored by Git and must never be added to frontend code or shared publicly.
5. Local testing is preconfigured with ADMIN_USERNAME=muslimhand and ADMIN_PASSWORD=332211. Change this to a strong, unique password before deployment; production startup requires at least 12 characters. Keep .env private. Set SESSION_SECRET to a long random value before production.
6. Optionally change OPENAI_MODEL in .env to a model available to your OpenAI account. The default is gpt-4o-mini.
7. Install the project dependencies once: npm install
8. Start the website in development mode: npm run dev
   For a regular start without automatic restarts, use: npm start
9. Open http://localhost:3000 in Chrome. Keep the terminal window running while using the site.

Sign-in and registration require the running Express server; opening login.html or signup.html directly with file:// will not connect to the authentication API. If you set AUTH_DB_PATH, use a location outside the public website directory.

The assistant sends requests from this site to its same-origin POST /api/chat endpoint. The OpenAI key stays on the server. Without a valid key, network access, and an available model, the assistant shows an error rather than a simulated answer. Do not open the site with file:// when testing AI chat; use the Express URL above. Voice input depends on browser speech-recognition support and microphone permission. Voice output depends on browser speech-synthesis support. Chrome/Edge on localhost are recommended.

COLLEGE MANAGEMENT SYSTEM
- Start Express with npm start and open http://localhost:3000/login.html. The management APIs and sign-in do not work when pages are opened using file://.
- Sign in as Admin to open admin.html. Admins can add/edit/suspend accounts, create and assign classes, take attendance, review monthly attendance reports, manage fee balances and exam results, publish notices, edit the timetable, review the activity log, change college settings, and transfer administrator ownership.
- Public registration creates student accounts only. Create teacher accounts from Students & Staff and give each teacher a username. Assign a teacher to their class; the teacher can then sign in and mark attendance only for assigned classes.
- Students can sign in to student.html to see their profile, recorded attendance, exam results, fee balances, published timetable, and notices. No sample student data is preloaded; these records appear when an administrator enters them.
- Admin transfer requires an active teacher account with a username, the current administrator's password, and the exact confirmation phrase TRANSFER ADMIN OWNERSHIP. The current administrator becomes a teacher; the transfer is written to the activity log.
- Deleting a student or teacher disables their account and removes them from active class enrollment, while retaining historical school records for reporting and audit.
- Fee management records payments entered by authorized college staff; it does not process or collect online payments. Website settings currently cover the college name, academic year, term, and currency.

IMPORTANT BEFORE PUBLISHING
- Authentication uses a private local SQLite database, password hashing, rate-limited sign-in, and HTTP-only server sessions. Public signup creates student accounts only; teacher accounts must be provisioned by the college and admin credentials come from server environment variables. Do not use the requested six-digit password in production.
- For production, use HTTPS, set NODE_ENV=production, SESSION_SECRET, ADMIN_USERNAME, and a strong ADMIN_PASSWORD. If TLS terminates at a trusted reverse proxy, set TRUST_PROXY=true. Back up the private database and protect the host; local SQLite is intended for a single server instance, not shared multi-instance hosting.
- Student/teacher dashboards, account recovery, email verification, electronic payments, and bulk data import are not included. Verify account ownership and college records before using the system with real student data.
- Admission/contact forms show a demo message only. Do not collect real student data until a secure backend is connected.
- Sample programs, staff roles, news, facilities, and contact details are placeholders. Confirm and replace them with official college information.
- External college-life photos are illustrative stock images, not verified college students, staff, results, or facilities. Replace them with approved photos before publishing.
- Search and theme preferences run in the browser. The contact and admission forms remain front-end demos and do not deliver submissions.
- Configure the hosting provider to serve 404.html for missing pages; static file previews may not automatically display custom error pages.
- Use only approved college photos and branding.
- For free hosting, you can upload the extracted project to a GitHub repository and import it into Vercel, or deploy the folder using a supported static hosting workflow.
