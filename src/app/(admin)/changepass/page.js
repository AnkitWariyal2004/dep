import ChangePassword from "@/app/_components/ChangePassowrd";
import { Suspense } from "react";

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ChangePassword/>
    </Suspense>
  );
}
