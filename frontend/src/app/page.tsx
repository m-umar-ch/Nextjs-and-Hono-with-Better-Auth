import { auth } from "@/auth/auth-client";

const page = async () => {
  const { data, error } = await auth.getSession();
  if (error || !data) {
    return <div>No Session</div>;
  }

  return <div>page</div>;
};

export default page;
