"use client";

// Functionality: Fullscreen Spotlight-like search overlay

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchOverlay } from "./SearchOverlayProvider";
import companies from "./companysearch.json";
import { CardOverlay } from "../card-overlay";
import { CompanyDetail } from "../company-detail";

export default function SearchOverlay() {
  const { isOpen, query, setQuery, close } = useSearchOverlay();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeCompanyName, setActiveCompanyName] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedQuery(query.trim()), 1000);
    return () => clearTimeout(handle);
  }, [query]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    if (!q) return [] as string[];
    return (companies as string[])
      .filter((name) => name.toLowerCase().includes(q))
      .slice(0, 50);
  }, [debouncedQuery]);

  const openDetail = (name: string) => {
    setActiveCompanyName(name);
    setDetailOpen(true);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-3 md:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={close}
      />
      <div className="relative w-full max-w-2xl mx-auto">
        <div className="glass rounded-2xl shadow-hard">
          <div className="flex items-center gap-2 p-2 md:p-3">
            <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-white/20 text-white/80 backdrop-blur-sm">
              ⌘
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search companies..."
              className="flex-1 bg-transparent outline-none text-base md:text-lg px-2 text-white placeholder-white/60"
              aria-label="Search"
            />
            <button
              onClick={close}
              className="px-3 py-1 text-sm rounded-lg border border-white/20 bg-white/10 text-white/80 hover:bg-white/20 backdrop-blur-sm"
            >
              Esc
            </button>
          </div>

          <div className="max-h-[55vh] overflow-y-auto">
            {!query && (
              <div className="p-3 text-sm text-white/60">
                Start typing to search companies…
              </div>
            )}
            {!!query && debouncedQuery === "" && (
              <div className="p-3 text-sm text-white/60">Searching…</div>
            )}
            {!!debouncedQuery && filtered.length === 0 && (
              <div className="p-3 text-sm text-white/60">
                No companies found for “{debouncedQuery}”.
              </div>
            )}
            {!!filtered.length && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2">
                {filtered.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => openDetail(name)}
                    className="text-left card-elevated p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition-colors"
                  >
                    <div className="text-sm font-medium text-white truncate">
                      {name}
                    </div>
                    <div className="mt-1 text-xs text-white/60">
                      View transparency insights
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-white/60 sm:flex sm:flex-wrap sm:items-center">
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm">
            <span className="hidden sm:inline">Open</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-white/80">
              ↩
            </kbd>
          </div>
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm">
            <span className="hidden sm:inline">Close</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-white/80">
              Esc
            </kbd>
          </div>
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm">
            <span className="hidden sm:inline">Open search</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-white/80">
              ⌘
            </kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-white/80">
              K
            </kbd>
          </div>
        </div>
      </div>
      <CardOverlay
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        title={activeCompanyName || "Company"}
      >
        {detailOpen && activeCompanyName && (
          <CompanyDetail companyName={activeCompanyName} />
        )}
      </CardOverlay>
    </div>
  );
}
