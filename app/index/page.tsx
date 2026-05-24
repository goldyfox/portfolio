import type { Metadata } from "next";
import { CatalogFilter } from "@/components/portfolio";

export const metadata: Metadata = {
  title: "Lisa Aufox | Index",
};

export default function Catalog() {
  return (
    <div className="flex flex-1 flex-col py-macro">
      <h1 className="page-title">
        Index
      </h1>
      <div className="mt-12">
        <CatalogFilter />
      </div>
    </div>
  );
}
