# Otis Portfolio

Portfolio tinh cua Dong Van Cuong, trien khai tu 10 node Figma bang Next.js App Router, TypeScript va Tailwind CSS. Noi dung duoc prerender; chi gallery va tab kinh nghiem can JavaScript tuong tac.

## Chay repo nay

Node.js 22 LTS duoc khai bao trong `.nvmrc`. Bo cong cu cua repo can Node.js >= 20.19.

```bash
nvm install
nvm use
npm ci
npm run dev -- --port 3001
```

Mo http://localhost:3001. De kiem tra ban production:

```bash
npm run check
npm run build
npm run start -- --port 3100
```

## Khoi tao tu dau

Day la cac lenh de tao mot repo moi tuong duong ve dependencies. Repo hien tai da duoc cau hinh san, khong can chay lai `create-next-app` trong thu muc nay.

```bash
npx create-next-app@16.3.5 otis-portfolio --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
cd otis-portfolio
npm install framer-motion lucide-react
npm install -D prettier prettier-plugin-tailwindcss eslint-config-prettier husky lint-staged sharp
npm pkg set scripts.prepare="husky"
npm pkg set scripts.lint="eslint . --max-warnings=0"
npm pkg set scripts.typecheck="tsc --noEmit"
npm pkg set scripts.format="prettier --write ."
npm pkg set scripts.format:check="prettier --check ."
npm pkg set scripts.check="npm run typecheck && npm run lint && npm run format:check"
npm run prepare
npm run dev
```

`create-next-app` cai Next.js, React, React DOM, TypeScript, type definitions, ESLint, Tailwind CSS va PostCSS. Cac file `.prettierrc.json`, `eslint.config.mjs`, `.husky/pre-commit`, `lint-staged` trong `package.json` hoan tat cau hinh chat luong code cua repo nay.

**Vite khong phai package manager.** Next.js App Router dung Turbopack cho development/build; khong ghep them Vite. Repo dung npm va `package-lock.json` de cai dat lap lai chinh xac. Neu can Vite thi kien truc phai chuyen sang React + Vite, khong con la Next.js App Router.

## Component-Driven Architecture

```text
.
|-- public/
|   |-- icons/                    # Icon xuat truc tiep tu Figma
|   `-- images/                   # Anh goc va ban WebP toi uu
|-- src/
|   |-- app/
|   |   |-- layout.tsx            # Font, metadata, global shell
|   |   |-- page.tsx              # People desktop / Products mobile
|   |   |-- globals.css           # Tailwind, design tokens, responsive styles
|   |   |-- impact/page.tsx       # Bien the desktop Impact
|   |   |-- products/page.tsx     # Bien the desktop Products
|   |   |-- cover/page.tsx        # Thumbnail Figma
|   |   `-- not-found.tsx
|   |-- components/
|   |   |-- ui/                   # AssetIcon, ProfileLink
|   |   |-- portfolio/            # Hero, About, CoreSkills, ProjectGallery,
|   |   |                        # CareerCard, CareerJourney, Contact
|   |   `-- motion/               # LazyMotion provider cho giai doan animation
|   |-- context/                 # State gallery, scope chi trong gallery
|   |-- data/portfolio.ts        # Noi dung, du an, link lien he, kinh nghiem
|   |-- lib/motion-features.ts   # Motion features tai bang dynamic import
|   `-- types/portfolio.ts       # Domain types
|-- docs/
|   `-- verification.md          # Ket qua kiem tra va gioi han
|-- .husky/pre-commit            # lint-staged + TypeScript
|-- .env.example                 # Domain that khi deploy
|-- eslint.config.mjs
|-- next.config.ts
|-- postcss.config.mjs
|-- tsconfig.json
`-- package.json
```

`app` chi ghep trang va metadata. `components/ui` gom primitive dung lai; `components/portfolio` gom tung section co y nghia. Du lieu tach khoi JSX, khong tao Redux/store toan ung dung cho trang tinh. Khi co feature moi, them component va du lieu tai dung pham vi thay vi tao nhieu tang abstractions.

## Doi chieu Figma

File: https://www.figma.com/design/97nksX9Eyz96nt3CDBuaYP/Untitled

| Node    | Noi dung                     | Trien khai                   |
| ------- | ---------------------------- | ---------------------------- |
| `1:15`  | Desktop People               | `/`                          |
| `1:204` | Desktop Impact               | `/impact`                    |
| `1:893` | Thumbnail                    | `/cover`, anh Open Graph     |
| `1:547` | Design System default/active | CoreSkills, hover            |
| `1:298` | 4 Career Journey variants    | Tab desktop, 4 card mobile   |
| `1:110` | Desktop Products             | `/products`                  |
| `1:613` | Mobile portfolio             | Layout responsive duoi 768px |
| `1:526` | AI Tool default/active       | CoreSkills, hover            |
| `1:491` | UI UX Design default/active  | CoreSkills, hover            |
| `1:574` | Research default/active      | CoreSkills, hover            |

Cac node la cac trang thai/component cua cung mot portfolio, khong phai 10 trang rieng biet. Desktop co them nut mui ten gallery va tab so cho phep xem tat ca noi dung khi chua co animation. Mobile giu danh sach doc. Figma lap lai cung mot anh Web3 3 lan; repo giu nguyen 4 vi tri nay, khong tu tao du an gia.

## Hieu nang va animation

- Server Components va prerender cho trang tinh; Next.js tu tach bundle theo route.
- `next/dynamic` tach gallery va career thanh client chunks, van giu HTML render san.
- `next/image` co `sizes`, aspect ratio co dinh va lazy loading cho anh du an. Anh portrait duoc uu tien vi nam trong viewport mobile.
- Anh du an WebP 1920px khoang 140-220 KB thay vi 6 MB PNG. Anh hero raster hoa tu dung asset Figma de tranh SVG blur filter lon luc render.
- Chay `npm run assets:optimize` sau khi thay anh goc PNG de tao lai cac ban WebP.
- `next/font` tu host Space Grotesk, khong phu thuoc Google Fonts khi nguoi xem tai trang. Build lan dau can internet de tai font.
- Chi 4 du an, khong can virtualization. Khi danh sach lon, them pagination hoac virtualizer da duoc kiem chung; khong tai hang tram anh ngay tu dau.
- Framer Motion da cai; `MotionProvider` dung `LazyMotion` + dynamic `domAnimation`, ton trong reduced motion. Chua mount provider o layout, nen ban tinh khong tai Framer Motion vao initial bundle.
- Khi them animation, boc **client component** can animate bang `MotionProvider` va dung `m` thay vi `motion`. Giu noi dung hien thi san, khong an text LCP de doi animation.

## Noi dung can bo sung

Trong `src/data/portfolio.ts`, dat link that cho `profileLinks.cv`, `profileLinks.behance`, `profileLinks.linkedin`. Hien tai cac nut nay disabled vi Figma khong cung cap URL; email va dien thoai da hoat dong. Dat CV tai `public/cv.pdf` va gan `cv: "/cv.pdf"` khi co file that. Khong tu tao CV hay gan profile cua nguoi khac.

Anh va text da luu trong repo, khong phu thuoc URL Figma tam thoi. Khong co backend, analytics, form gui thu hay deployment duoc tao.

## Chat luong code

TypeScript `strict` + `noUncheckedIndexedAccess`, React strict mode, ESLint Next.js Core Web Vitals, Prettier + sap xep Tailwind class. Pre-commit chay ESLint/Prettier tren file staged va typecheck toan repo. Chay `npm run check` va `npm run build` truoc khi merge.

Lighthouse phai chay tren production, khong do `next dev`. Xem `docs/verification.md` cho diem do thuc te. Diem local khong bao dam diem tren hosting, mang va thiet bi khac.

Tai lieu chinh thuc: [Next.js installation](https://nextjs.org/docs/app/getting-started/installation), [Motion LazyMotion](https://motion.dev/docs/react-lazy-motion).
