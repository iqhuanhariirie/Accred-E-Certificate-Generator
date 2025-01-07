

## Run Locally

Clone the project

```bash
  git clone https://github.com/blurridge/Accred
```

Go to the project's directory

```bash
  cd Accred/
```

Install dependencies

```bash
  npm install
```

Create a `.env` file containing your Firebase variables. Use `.env.example` as a template.
```
NEXT_PUBLIC_FIREBASE_API_KEY              = <<your firebase api key here>>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN          = <<your firebase auth domain here>>
NEXT_PUBLIC_FIREBASE_PROJECT_ID           = <<your firebase project id here>>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET       = <<your firebase storage bucket here>>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID  = <<your firebase messaging sender id here>>
NEXT_PUBLIC_FIREBASE_APP_ID               = <<your firebase app id here>>
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID       = <<your firebase measurement id here>>
```

Start the server

```bash
  npm run dev
```

## Structure

```
📦 
├─ .env.example
├─ .eslintrc.json
├─ .gitignore
├─ LICENSE
├─ README.md
├─ app
│  ├─ admin
│  │  ├─ home
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  ├─ login
│  │  │  └─ page.tsx
│  │  └─ page.tsx
│  ├─ contact
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ docs
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ event
│  │  └─ [id]
│  │     ├─ certificate
│  │     │  └─ [certId]
│  │     │     └─ page.tsx
│  │     ├─ layout.tsx
│  │     └─ page.tsx
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ mdx-components.tsx
│  └─ page.tsx
├─ assets
│  ├─ accred_logo.svg
│  ├─ accred_ls.svg
│  ├─ accred_sq.svg
│  └─ gdsc_logo.png
├─ components
│  ├─ AddEvent.tsx
│  ├─ AdminGuide.mdx
│  ├─ AdminLoginButton.tsx
│  ├─ Certificate.tsx
│  ├─ CertificateVerifier.tsx
│  ├─ ContactMe.mdx
│  ├─ DataTable.tsx
│  ├─ EventCard.tsx
│  ├─ EventCardContent.tsx
│  ├─ EventDropdown.tsx
│  ├─ EventForm.tsx
│  ├─ FeatureCards.tsx
│  ├─ Footer.tsx
│  ├─ GuestLoginButton.tsx
│  ├─ LoginCard.tsx
│  ├─ Navbar.tsx
│  ├─ RingLoader.tsx
│  └─ ui
│     ├─ avatar.tsx
│     ├─ button.tsx
│     ├─ calendar.tsx
│     ├─ card.tsx
│     ├─ columns.tsx
│     ├─ dialog.tsx
│     ├─ dropdown-menu.tsx
│     ├─ form.tsx
│     ├─ input.tsx
│     ├─ label.tsx
│     ├─ navigation-menu.tsx
│     ├─ popover.tsx
│     └─ table.tsx
├─ context
│  ├─ AuthContext.tsx
│  ├─ EventDataContext.tsx
│  └─ ThemeContext.tsx
├─ firebase
│  └─ config.ts
├─ lib
│  └─ utils.ts
├─ next.config.js
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ public
│  ├─ next.svg
│  └─ vercel.svg
├─ tailwind.config.js
├─ tsconfig.json
└─ utils
   ├─ compressBanner.ts
   ├─ deleteFromFirebase.ts
   ├─ fetchImageSize.ts
   ├─ generateLinkedInShareURL.ts
   ├─ parseCSV.ts
   ├─ uploadToFirestore.ts
   └─ uploadToStorage.ts
```

