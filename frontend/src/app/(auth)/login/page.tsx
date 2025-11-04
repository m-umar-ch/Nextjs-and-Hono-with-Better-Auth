import { Suspense } from "react";
import AuthPage from "../_components/auth-page";
import AuthPageSkeleton from "../_components/page-skeleton";

const page = () => {
  return (
    <Suspense fallback={<AuthPageSkeleton />}>
      <AuthPage />
    </Suspense>
  );
};

export default page;
