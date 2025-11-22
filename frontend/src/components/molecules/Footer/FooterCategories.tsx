import Link from "next/link";
import { getCategories } from "@/DAL/server/category";

const FooterCategories = async () => {
  const categories = await getCategories();

  if (categories && !categories.items.length) {
    return <div className="text-red-500">No Categories</div>;
  }

  return (
    <>
      {categories &&
        categories.items.slice(1, 6).map((item, idx) => {
          return (
            <Link
              key={idx}
              href={`/shop/${item.slug}` as never}
              className="hover:text-primary transition-all duration-300"
            >
              {item.name}
            </Link>
          );
        })}
    </>
  );
};

export default FooterCategories;
