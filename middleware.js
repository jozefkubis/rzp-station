import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request) {
    return await updateSession(request);
}

export const config = {
    matcher: [
        /*
         * Priraď všetky cesty požiadaviek okrem tých, ktoré začínajú na:
         * - _next/static (statické súbory)
         * - _next/image (súbory optimalizácie obrázkov)
         * - favicon.ico (súbor favicon)
         * Môžeš upraviť tento vzor tak, aby zahŕňal ďalšie cesty.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
