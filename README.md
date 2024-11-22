# Accred - Event E-Certificate Generator Web App 🎖️

![Accred Logo](https://i.imgur.com/gKwYMID.png)
![Commit Shield](https://img.shields.io/github/last-commit/blurridge/Accred?style=for-the-badge)
![License](https://img.shields.io/github/license/blurridge/Accred?style=for-the-badge)
## Context

I developed Accred as a side project due to the struggles I faced in managing e-certificate generation for the Google Developer Student Clubs at the University of San Carlos. Our existing process of generating and storing certificates in our drive was time-consuming and required constant work from the core team. Additionally, it was taking up a significant amount of storage space.

To overcome these challenges, I created Accred to automate the certificate generation process and eliminate the need for storing them in the cloud. My app generated certificates on-demand, ensuring that no unnecessary data was stored and saving valuable storage space.

Additionally, developing Accred served as an opportunity for me to gain hands-on experience and enhance my knowledge of Next.js and its app router. Throughout the development process, I delved into the intricacies of Next.js, leveraging its powerful features to create a seamless and efficient user experience.

By working on Accred, I not only addressed the pressing issue of e-certificate management but also utilized it as a practical learning experience. Exploring the capabilities of Next.js and its app router allowed me to expand my skill set and deepen my understanding of web development frameworks. This project served as a valuable stepping stone in my journey to becoming a proficient developer, providing me with practical insights and expertise that I can apply to future projects.

## Tech Stack

**Client:**

<p> <a href="https://nextjs.org/" target="_blank" rel="noreferrer"> <img src="https://cdn.worldvectorlogo.com/logos/next-js.svg" alt="next.js" width="40" height="40"/> </a> <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" alt="tailwind" width="40" height="40"/> </a> </p>

**Server:**

<p><a href="https://firebase.google.com/" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg" alt="firebase" width="40" height="40"/> </a> </p>

## Screenshots
![Admin Page](https://i.imgur.com/xGOdUq9.png)
![Add Event Modal](https://i.imgur.com/Nf2vfAr.png)
![Event Page](https://i.imgur.com/VOlzLUU.png)
![Certificate Verification Page](https://i.imgur.com/2agmPCl.png)

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

## Acknowledgements

I would like to acknowledge the work of [Ned Palacios](https://github.com/nedpals) and [GDSC University of Immaculate Conception](https://github.com/gdsc-uic) as the inspiration for this project's concept of certificate generation which was originally done in Vue for [LAWIG - a GDSC Philippines Info Session](https://github.com/gdsc-uic/lawig-cert-gen).

## Stay in touch

If you have any questions, suggestions, need further assistance, or would like to avail of Accred for your organization, feel free to reach out to me. I'm always happy to help!

- Email: [zachriane01@gmail.com](mailto:zachriane01@gmail.com)
- GitHub: [@blurridge](https://github.com/blurridge)
- Twitter: [@zachahalol](https://twitter.com/zachahalol)
- Instagram: [@zachahalol](https://www.instagram.com/zachahalol)
- LinkedIn: [Zach Riane Machacon](https://www.linkedin.com/in/zachriane)

## Contributors
<a href="https://github.com/blurridge/accred/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=blurridge/accred" />
</a>

```
Accred-E-Certificate-Generator
├─ .eslintrc.json
├─ .git
│  ├─ COMMIT_EDITMSG
│  ├─ config
│  ├─ description
│  ├─ FETCH_HEAD
│  ├─ HEAD
│  ├─ hooks
│  │  ├─ applypatch-msg.sample
│  │  ├─ commit-msg.sample
│  │  ├─ fsmonitor-watchman.sample
│  │  ├─ post-update.sample
│  │  ├─ pre-applypatch.sample
│  │  ├─ pre-commit.sample
│  │  ├─ pre-merge-commit.sample
│  │  ├─ pre-push.sample
│  │  ├─ pre-rebase.sample
│  │  ├─ pre-receive.sample
│  │  ├─ prepare-commit-msg.sample
│  │  ├─ push-to-checkout.sample
│  │  ├─ sendemail-validate.sample
│  │  └─ update.sample
│  ├─ index
│  ├─ info
│  │  └─ exclude
│  ├─ logs
│  │  ├─ HEAD
│  │  └─ refs
│  │     ├─ heads
│  │     │  ├─ beta
│  │     │  └─ main
│  │     └─ remotes
│  │        └─ origin
│  │           ├─ beta
│  │           ├─ HEAD
│  │           └─ main
│  ├─ objects
│  │  ├─ 01
│  │  │  └─ 97100ee12fd436c741e13efeffa9fb930cd080
│  │  ├─ 02
│  │  │  └─ cf7c424276ec8501331e65f7b57e000c189e4d
│  │  ├─ 07
│  │  │  └─ 0f64803677106e58c326dff0e0eb263918f960
│  │  ├─ 0c
│  │  │  └─ 14cb1024f819a0ae0c11da54f9fbc252cacc66
│  │  ├─ 0d
│  │  │  └─ f624465a145a02db24a5f039ff4a9cdf84d192
│  │  ├─ 10
│  │  │  └─ ccb2b1cd3bd613913b2e4d9c140fbbcb76944a
│  │  ├─ 19
│  │  │  ├─ 812f06011ef3d81b4986c59f5d14a5e3c9f44f
│  │  │  └─ cf63bdf98a49a31157d18c1cce0a376c77c816
│  │  ├─ 1e
│  │  │  └─ 8c232f7c810c09fb548c7c4277f8ca3fcece6e
│  │  ├─ 22
│  │  │  └─ 05e45cac6c4916e43e6acfb65763d2af36deb2
│  │  ├─ 25
│  │  │  └─ 33983db290a6a475b7ed5b82a494fbd3c4d266
│  │  ├─ 26
│  │  │  └─ ea2498c774fd2e68e5000c79f27e089269967f
│  │  ├─ 27
│  │  │  └─ 1571348f9df41ac8167c7072af144e75c2acb6
│  │  ├─ 28
│  │  │  └─ c5da8a7715d15eb26fa4e8d30036ec65a4376a
│  │  ├─ 29
│  │  │  └─ 876977366301103a487e7527df6af279fbdd7b
│  │  ├─ 2e
│  │  │  └─ 8e656462dbdc8609cb1b501be6c1446ec8ea91
│  │  ├─ 33
│  │  │  └─ 2287011edfb1b2b017603c6675e69de124a4eb
│  │  ├─ 35
│  │  │  └─ d6d03ccf9b0bb7c4cd7edb6267b93aa4cb573e
│  │  ├─ 3a
│  │  │  └─ 5a8d7c084b6386087ceca4ac395aceba8ae8f7
│  │  ├─ 3b
│  │  │  └─ 672aba64a046b91b0081348c3dfe7013cdfc34
│  │  ├─ 3d
│  │  │  └─ 7021bd09b85261907044e145934a0fde4a0b27
│  │  ├─ 3e
│  │  │  └─ edc9e3308a4778811275f383b68e9687e8d730
│  │  ├─ 42
│  │  │  └─ 4b022cd22859732581ff35c293b70517e19120
│  │  ├─ 43
│  │  │  ├─ 787e0537c2922cfbc1c7b3d49cd746dbd13b05
│  │  │  └─ 86e66878ca5c929257dbe05fe73430e9f0c9fc
│  │  ├─ 47
│  │  │  └─ 2d0b39a15c5bb18aeaccf6d60f2cf58e534270
│  │  ├─ 4d
│  │  │  └─ fe429977f96d76215b459033870308e36237a9
│  │  ├─ 4e
│  │  │  └─ 9013592c14160b4ce87d9a7bd1bb3fadbd2c38
│  │  ├─ 4f
│  │  │  ├─ 1d01b879f03eb54c4b0550572c292197861c29
│  │  │  └─ 7f4bdc4c42ca120fea8d3cb47016eb563546c2
│  │  ├─ 52
│  │  │  ├─ cd895e189861fbadd93701be5c07176ec3a724
│  │  │  └─ d05c19910ab2262f127f19a9636d2aa411b1b2
│  │  ├─ 53
│  │  │  └─ f64fb42c865898a1cde7e2ac800bccd7ef3d0d
│  │  ├─ 54
│  │  │  ├─ 51303a0e270e4df0b935a7f7edc86213534dee
│  │  │  └─ fefe57501be591fa6a2c2cee115c547d5f8e00
│  │  ├─ 57
│  │  │  └─ 2c8897c4b5c56a54b53fa8c1064c8b657ed873
│  │  ├─ 59
│  │  │  ├─ 08d849922b19d2d432be6c777ceebffc4cb07e
│  │  │  └─ 1e07144a81c08c8632d657bb693c6005362eb7
│  │  ├─ 5a
│  │  │  ├─ 337ea4966cdb564c5a1a34c0234358baa736d1
│  │  │  └─ 94fb6dfd9636c8e34f450a89f680f40cdbaa74
│  │  ├─ 5b
│  │  │  └─ 16ec9e5566d61ca964a42cac9dd52150311bbf
│  │  ├─ 61
│  │  │  └─ b321d14e7200e93127aa0e7f3bb9951c9d9cb8
│  │  ├─ 62
│  │  │  └─ 2e9bd29a2761282a540c1a6a9373acf115a6b8
│  │  ├─ 63
│  │  │  └─ ea71c2a55591c56d0ba45318f49203b7eeea0e
│  │  ├─ 67
│  │  │  └─ b9b01591b1aca4dce65104bb5d2c356bd6b783
│  │  ├─ 6e
│  │  │  └─ 111985dcaf9fadcc761dcedfe2e693a0dc01f4
│  │  ├─ 6f
│  │  │  └─ 8af5ce3963cf9c8cb351b308c6c5fd66e7b7d7
│  │  ├─ 70
│  │  │  └─ 9d19a4f4d269becf98414ca7bbf78c2f756141
│  │  ├─ 74
│  │  │  └─ 44ed9a256e885cfdeb5fe30f430de6d7ec287d
│  │  ├─ 75
│  │  │  ├─ 73086949677a99e6bc2be7498f860fce8216fa
│  │  │  └─ db8cbfd608ba41a6c91226ae44a7e7a46a8cb2
│  │  ├─ 76
│  │  │  └─ 2f6ce0000e308dbb592c33e1a5fa5830ebbdea
│  │  ├─ 77
│  │  │  └─ 9aa8a9e1ace5d86f8d2e0eb6c21b5415fb3a77
│  │  ├─ 7b
│  │  │  ├─ 3564d022e1869727d93cac31c88b08ff7c79dc
│  │  │  └─ 523636e16529238b507b44086bdaaeec4c1944
│  │  ├─ 7f
│  │  │  └─ 993cb71fb5f74699cf6f9948449d8690252722
│  │  ├─ 80
│  │  │  └─ 4f47a370c57812e1680a0a512e369db2c9ef59
│  │  ├─ 82
│  │  │  └─ 6e4f81de2037a83917fedd122ad7c56330bda4
│  │  ├─ 83
│  │  │  └─ 45d97fcd7494f348f7851cc5095b8802ef1358
│  │  ├─ 8a
│  │  │  └─ a0161f289748c8afb32c966351d06483c152d2
│  │  ├─ 8e
│  │  │  └─ 9078342eefce362e6445d002b233fd8d385fd6
│  │  ├─ 90
│  │  │  ├─ 345efd2e16744e24216e07f27fda8cee7b867f
│  │  │  ├─ 3757661d072c03a06c4621bb262b16f19bdf7e
│  │  │  └─ dda96b7542be824cd629fe5a39f4bfe37df306
│  │  ├─ 96
│  │  │  └─ 583d651f98c0ef4c219bb878da4abd1c13d3eb
│  │  ├─ 97
│  │  │  └─ 1ed9fedecdbc0cef18b374057ea8ce1b96f734
│  │  ├─ 98
│  │  │  └─ 6c1d7cdd001b59fcce81c99652551b6d497410
│  │  ├─ 9e
│  │  │  └─ 51bdcedb868c16ff73504693d22d52c169e6b3
│  │  ├─ a9
│  │  │  └─ 7af894ce504ae12945a95c42b738fe3a6fe2b6
│  │  ├─ aa
│  │  │  └─ 1d542a44e23d3d0d8a6d020c24fe63982400d8
│  │  ├─ af
│  │  │  └─ 9cd1e74bc2e7ad443b5ae9f8fcd9e2f424821a
│  │  ├─ b2
│  │  │  └─ aa7a50c8c39aae9e37115dfd6a1376888817d7
│  │  ├─ b3
│  │  │  └─ 21b7d22e8be6a9241fabb8705cfa3c55ad5589
│  │  ├─ b8
│  │  │  └─ 5b0f20343e714105191e4ec4e94ce12380485d
│  │  ├─ b9
│  │  │  ├─ 0bc34fd78c2ee55f8ed9d2a61be9a702bf33bb
│  │  │  └─ f48a4fd571ee5ed98c15f10d150ce3b76d6f2d
│  │  ├─ ba
│  │  │  ├─ 5f4a5ff438ef867560ded9cf524da6ef557bc9
│  │  │  └─ 7b2b00b2e569c67cbcfe68e06ba270e0ecdd66
│  │  ├─ bc
│  │  │  ├─ 33156be30d06bd0798904952c9093edbc315c4
│  │  │  └─ 5c0c67b678f4536fefdb7ca869a66905c45e06
│  │  ├─ be
│  │  │  └─ b8c3c6af52f8102110479e003bf26b61a85b20
│  │  ├─ bf
│  │  │  └─ 2e1bbade0321b59e8adbf2c74effba731040d0
│  │  ├─ c7
│  │  │  └─ bd76a4ce5d66177630ce502fd3a3ae671ff0d4
│  │  ├─ ca
│  │  │  └─ c887a4504d68234911f36518b72ef0e04ed76f
│  │  ├─ cd
│  │  │  ├─ 38317c07a47b8d2aefb729d42456ddfd1d9220
│  │  │  └─ e39ba5357f919a9a6b995a48152144c70d2212
│  │  ├─ d0
│  │  │  └─ 3fa2f4808b1ad7b8741a93b1854bf688f494c8
│  │  ├─ d2
│  │  │  └─ a8c93ff03b34e1f0d7ff29d0297b2aef92612f
│  │  ├─ d4
│  │  │  ├─ 4a876cde931b457435a119aa6514a72f2d4486
│  │  │  └─ abbbcbd678ceff801a2e0ba22b65e6fc7ef087
│  │  ├─ d8
│  │  │  └─ 956e6dcada3e59f4a07899bd798bb2414ea90b
│  │  ├─ e1
│  │  │  ├─ 07c7f1285a8247074190eec9105a8a74037e2b
│  │  │  ├─ 99d73e8f576ead9477a6bace80fcea9e0a9ddd
│  │  │  └─ cee27a7035a96265b5714e9448d59c42e415e9
│  │  ├─ e2
│  │  │  └─ 71d36b69b12c260a06dafebad24344b9ebec54
│  │  ├─ e3
│  │  │  └─ 0dbae8fab765dbfc0b7f907f83d889d5b54e4a
│  │  ├─ e4
│  │  │  └─ db9bf71a4694805cafc4b51e151bde715a61d0
│  │  ├─ e5
│  │  │  └─ ae79e4595f37e5c9220718d78ff68d32108b7d
│  │  ├─ e8
│  │  │  ├─ 2ac99f51639c9887a5cedce664ed043177927c
│  │  │  └─ d7437823b58db9d9e11c54e3765eac94c10d97
│  │  ├─ ea
│  │  │  └─ 6b7f9277f1dc24752c7d7637337cb6850ea718
│  │  ├─ ed
│  │  │  └─ 963b1894198ac850cddf90417b0ff3f7c403bc
│  │  ├─ f1
│  │  │  ├─ b2c237d21a2f04d87ad0367465452343761aeb
│  │  │  └─ b6de76a1950c1a104f655024b0df9e40172143
│  │  ├─ f3
│  │  │  ├─ 9ee2ce199a802a8f0b2e35bf590c028dba6c49
│  │  │  └─ eddf6432e04a05ce9b912656ffe244866ce90c
│  │  ├─ f4
│  │  │  └─ fd53f19fc8ef2fcd75bf0e53eca60e5888dd64
│  │  ├─ f5
│  │  │  └─ 3b5e2554876fa850c78e1a90b44ade701a97da
│  │  ├─ f6
│  │  │  └─ 51c235d281a59b90aa9673ba9daa3119fa980c
│  │  ├─ f7
│  │  │  ├─ 083be3088a571b9b3d2e92730ddcb998f3982f
│  │  │  ├─ 3344a9fb080557f511b192810979860ca8d46d
│  │  │  └─ 5c11e3be1bfdb9ca87e3b5826fa499e583e349
│  │  ├─ f9
│  │  │  └─ 257f04c183bf8df8c9e98c1ac9eff48797ecee
│  │  ├─ fd
│  │  │  └─ 7982a775763af713bfa757594a56a35ba6ab25
│  │  ├─ info
│  │  └─ pack
│  │     ├─ pack-2e8ea04fbff2d9bdf6c37d0300943c2f0a49606e.idx
│  │     ├─ pack-2e8ea04fbff2d9bdf6c37d0300943c2f0a49606e.pack
│  │     └─ pack-2e8ea04fbff2d9bdf6c37d0300943c2f0a49606e.rev
│  ├─ ORIG_HEAD
│  ├─ packed-refs
│  └─ refs
│     ├─ heads
│     │  ├─ beta
│     │  └─ main
│     ├─ remotes
│     │  └─ origin
│     │     ├─ beta
│     │     ├─ HEAD
│     │     └─ main
│     └─ tags
├─ .gitignore
├─ app
│  ├─ admin
│  │  ├─ home
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  ├─ login
│  │  │  └─ page.tsx
│  │  └─ page.tsx
│  ├─ api
│  │  └─ sign
│  │     └─ route.ts
│  ├─ club
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ contact
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ docs
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ event
│  │  └─ [id]
│  │     ├─ certificate
│  │     │  └─ [certId]
│  │     │     └─ page.tsx
│  │     ├─ layout.tsx
│  │     └─ page.tsx
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ mdx-components.tsx
│  └─ page.tsx
├─ assets
│  ├─ accred_logo.svg
│  ├─ accred_ls.svg
│  ├─ accred_sq.svg
│  ├─ gdsc_logo.png
│  └─ UiTM Logo Vector.svg
├─ components
│  ├─ AddClub.tsx
│  ├─ AddEvent.tsx
│  ├─ AdminGuide.mdx
│  ├─ AdminLoginButton.tsx
│  ├─ Certificate.tsx
│  ├─ CertificateVerifier.tsx
│  ├─ ClubDropdown.tsx
│  ├─ ClubForm.tsx
│  ├─ ContactMe.mdx
│  ├─ DataTableClub.tsx
│  ├─ DataTableEvent.tsx
│  ├─ EventCard.tsx
│  ├─ EventCardContent.tsx
│  ├─ EventDropdown.tsx
│  ├─ EventForm.tsx
│  ├─ FeatureCards.tsx
│  ├─ Footer.tsx
│  ├─ GuestLoginButton.tsx
│  ├─ LoginCard.tsx
│  ├─ Navbar.tsx
│  ├─ RingLoader.tsx
│  └─ ui
│     ├─ avatar.tsx
│     ├─ button.tsx
│     ├─ calendar.tsx
│     ├─ card.tsx
│     ├─ columns.tsx
│     ├─ dialog.tsx
│     ├─ dropdown-menu.tsx
│     ├─ form.tsx
│     ├─ input.tsx
│     ├─ label.tsx
│     ├─ navigation-menu.tsx
│     ├─ popover.tsx
│     └─ table.tsx
├─ context
│  ├─ AuthContext.tsx
│  ├─ ClubDataContext.tsx
│  ├─ EventDataContext.tsx
│  └─ ThemeContext.tsx
├─ firebase
│  └─ config.ts
├─ lib
│  └─ utils.ts
├─ LICENSE
├─ next.config.js
├─ package-lock.json
├─ package.json
├─ pnpm-lock.yaml
├─ postcss.config.js
├─ public
│  ├─ next.svg
│  └─ vercel.svg
├─ README.md
├─ scripts
│  ├─ generateKeys.js
│  └─ verifyKeys.js
├─ tailwind.config.js
├─ tsconfig.json
├─ types
│  └─ starkbank-ecdsa.d.ts
└─ utils
   ├─ compressBanner.ts
   ├─ createClub.ts
   ├─ cryptoUtils.ts
   ├─ deleteFromFirebase.ts
   ├─ fetchDominantColorFromImage.ts
   ├─ fetchImageSize.ts
   ├─ generateLinkedInShareURL.ts
   ├─ getTextColor.ts
   ├─ parseCSV.ts
   ├─ serverCryptoUtils.ts
   ├─ signatureUtils.ts
   ├─ uploadToFirestore.ts
   └─ uploadToStorage.ts

```