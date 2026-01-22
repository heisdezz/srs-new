import { Link } from "react-router";

const links = [
  {
    path: "/",
    label: "Home",
  },
  {
    path: "/app/products",
    label: "Store",
  },
  { path: "/app/faqs", label: "FAQs" },
];

export default function HeaderLinks() {
  return (
    <div className="mx-auto md:block hidden space-x-2">
      {links.map((link) => (
        <Link className="btn btn-ghost " key={link.path} to={link.path}>
          {link.label}
        </Link>
      ))}
    </div>
  );
}
