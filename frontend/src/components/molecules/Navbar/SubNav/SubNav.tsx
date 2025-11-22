import MaxContainer from "@/components/MaxContainer";
import SubNavLink, {
  CategorySubNavDropdown,
  PrivateSubNavLink,
  RoundWidgetCategorySubNavDropdown,
} from "./SubNavLinks";
import { ALL_ROLES, Roles } from "@/auth/permissions";

const SubNavComponent = () => {
  return (
    <div className="font-figtree hidden border-b bg-transparent py-2 md:block">
      <MaxContainer className="flex items-center justify-between">
        <div className="text-foreground flex items-center gap-10">
          <RoundWidgetCategorySubNavDropdown />

          <PrivateSubNavLink
            url="/admin"
            name="Admin Panel"
            roles={ALL_ROLES.filter((item) => item !== Roles.CUSTOMER)}
          />

          <SubNavLink url="/" name="Home" />

          <SubNavLink url="/shop/all" name="Shop" />

          <CategorySubNavDropdown />

          <PrivateSubNavLink
            url="/order-history"
            name="Order History"
            roles={ALL_ROLES}
          />

          <SubNavLink url="/contact" name="Contact Us" />
        </div>

        <div></div>
      </MaxContainer>
    </div>
  );
};

export default SubNavComponent;
