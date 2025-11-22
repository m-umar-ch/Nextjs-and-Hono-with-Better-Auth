import { getSiteConfig } from "@/DAL/server/site-config";

const page = async () => {
  const something = await getSiteConfig();
  return <div>page {something?.siteOwnerEmail}</div>;
};

export default page;
