"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Company } from "../../lib/types";
import { CardOverlay } from "../card-overlay";
import { CompanyDetail } from "../company-detail";

interface CompanyOverlayManagerProps {
  initialCompany?: string;
}

export default function CompanyOverlayManager({
  initialCompany,
}: CompanyOverlayManagerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [activeCompanyName, setActiveCompanyName] = useState<string>(
    initialCompany || ""
  );
  const [retryKey, setRetryKey] = useState(0);

  const toSlug = (name: string) =>
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  const fromSlug = (slug: string) => slug.replace(/-/g, " ").trim();

  const openOverlayForName = useCallback(
    (name: string) => {
      setActiveCompanyName(name);
      setOverlayOpen(true);

      const params = new URLSearchParams(searchParams?.toString() || "");
      params.set("company", toSlug(name));
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const closeOverlay = useCallback(() => {
    setOverlayOpen(false);
    setActiveCompanyName("");
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.delete("company");
    const nextUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    router.push(nextUrl, { scroll: false });
  }, [pathname, router, searchParams]);

  useEffect(() => {
    const slug = searchParams?.get("company") || "";
    if (slug) {
      setActiveCompanyName(fromSlug(slug));
      setOverlayOpen(true);
    } else {
      setOverlayOpen(false);
      setActiveCompanyName("");
    }
  }, [searchParams]);

  const handleCompanyOpen = (company: Company) => {
    openOverlayForName(company.name);
  };

  return (
    <>
      {overlayOpen && activeCompanyName && (
        <CardOverlay
          isOpen={overlayOpen}
          onClose={closeOverlay}
          title={activeCompanyName || "Company"}
          headerRight={
            <button
              type="button"
              onClick={() => setRetryKey((k) => k + 1)}
              className="btn-secondary px-3 py-1.5 text-sm"
            >
              Retry
            </button>
          }
        >
          <CompanyDetail
            key={`${activeCompanyName}:${retryKey}`}
            companyName={activeCompanyName}
          />
        </CardOverlay>
      )}
      {/* Expose the open function to children via render props if needed */}
      {/** Optional: You can pass handleCompanyOpen to CompanyDirectory */}
    </>
  );
}
