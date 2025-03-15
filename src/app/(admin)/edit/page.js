import { Suspense } from "react";
import Edit from '@/app/_components/Edit'
export const dynamic = "force-dynamic"; // Ensures Next.js does not try to prerender

export default function Page() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <Edit/>
        </Suspense>
    );
}
