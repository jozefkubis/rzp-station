# 🏥 RZP Station

**RZP Station** je interná webová aplikácia pre stanicu záchrannej zdravotnej služby, ktorá umožňuje správu smien, profily záchranárov, štatistiky, kalendár úloh a ďalšie funkcie pre chod stanice.

---

## 🚀 Tech stack

| Oblasť                 | Technológia                                                         |
| ---------------------- | ------------------------------------------------------------------- |
| **Frontend**           | [Next.js 14 (App Router)](https://nextjs.org/), React, Tailwind CSS |
| **Backend / Database** | [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage)     |
| **Autentifikácia**     | Supabase Auth (`@supabase/auth-helpers-nextjs`, `@supabase/ssr`)    |
| **Nasadenie**          | [Vercel](https://vercel.com/)                                       |
| **UI knižnice**        | Heroicons, Lucide                                                   |
| **Animácie**           | Framer Motion                                                       |
| **Štýl projektu**      | Slovenské UI + moderný minimalistický dizajn                        |

---

## ⚙️ Funkcie

### 👨‍🚒 Správa záchranárov

- evidencia profilov (`profiles`) s osobnými a pracovnými údajmi
- možnosť zmeny poradia (`order_index`) pre plánovanie
- správa administrátorov (používateľ s `admin = 'ÁNO'`)

### 📅 Služby (`shifts`)

- mesačný prehľad smien (denné/nočné/RD/PN atď.)
- vizuálne radenie členov cez drag-and-drop
- automatické generovanie smien (`generateShiftsAuto`)
- kontrola hodín a normy podľa úväzku
- štatistiky za obdobie (dni, hodiny, nadčasy, sviatky)

### 📦 Storage

- upload avatarov do bucketu `avatars`
- obrázky uložené v Supabase Storage (RLS chránené)

### 📆 Kalendár a úlohy

- denné úlohy (dashboard)
- pripomienky, kontrola lekárskych a psychotestov

### 🧠 Admin rozhranie

- editácia používateľov, prideľovanie statusu admina
- správa tabuľky `profiles` a `shifts`
- prehľad štatistík, exporty

---

## 🔐 Zabezpečenie

| Vrstva                     | Ochrana                                                         |
| -------------------------- | --------------------------------------------------------------- |
| **Middleware**             | kontrola prihlásenia (`updateSession`), redirect neprihlásených |
| **RLS (Supabase)**         | DELETE len pre admina, SELECT/UPDATE podľa `auth.uid()`         |
| **Storage policies**       | upload/delete len pre prihlásených používateľov                 |
| **CSP + security headers** | ochrana proti XSS, clickjacking, sniffing                       |
| **HTTPS + HSTS**           | len šifrované spojenie                                          |
| **Environment vars**       | všetky kľúče v `.env.local`, bez `service_role` na kliente      |

---

## 🧩 Middleware – updateSession

```
// /utils/supabase/middleware.js
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

middleware.js
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|login|auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

.......................................................................................

// Content Security Policy
"Content-Security-Policy":
"default-src 'self'; \
base-uri 'self'; \
form-action 'self'; \
frame-ancestors 'none'; \
style-src 'self' 'unsafe-inline'; \
img-src 'self' https: data: blob:; \
font-src 'self' data:; \
connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vitals.vercel-insights.com https://api.open-meteo.com; \
worker-src 'self' blob:; \
script-src 'self' 'unsafe-inline';"

.......................................................................................


// Lokalný vývoj

// Klonuj repozitár
https://github.com/jozefkubis/rzp-station.git
cd rzp-station

// Nainštaluj závislosti
npm install


// Pridaj .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key


// Spusti dev server
npm run dev


→ beží na http://localhost:3000

.......................................................................................


👨‍⚕️ Autor
Jožko – RZP Rajec
🚑 Záchranár a full-stack vývojár v jednom
📫 kubis.jozef@outlook.com

🧱 Licencia
Projekt je určený pre interné použitie v rámci RZP staníc.
Ak ho chceš použiť alebo forkovať, kontaktuj autora.

```
