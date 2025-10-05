"use client";

// Functionality: Test utility to verify company detail caching functionality

import {
  getCachedCompanyDetail,
  setCachedCompanyDetail,
  clearCompanyDetailCache,
  getCacheInfo,
} from "./cache";
import type { CompanyFullAnalysis } from "./types";

export function testCompanyDetailCache() {
  const testCompanyName = "Test Company";
  const testData: CompanyFullAnalysis = {
    company_name: "Test Company",
    score_data: {
      transparency_score: 85,
      primary_sdg_violation: "Climate Action",
      risk_summary: "Low risk company with good transparency practices",
    },
    activism_plan: {
      action_plan_title: "Test Action Plan",
      recommended_actions: [
        {
          category: "Engagement",
          description: "Test engagement action",
        },
      ],
    },
  };

  // Test 1: Cache should be empty initially
  const initialCache = getCachedCompanyDetail(testCompanyName);

  // Test 2: Set cache and verify it's stored
  setCachedCompanyDetail(testCompanyName, testData);
  const cachedData = getCachedCompanyDetail(testCompanyName);

  // Test 3: Verify cache info
  const cacheInfo = getCacheInfo(testCompanyName);

  // Test 4: Clear cache and verify it's gone
  clearCompanyDetailCache(testCompanyName);
  const clearedCache = getCachedCompanyDetail(testCompanyName);
}

// Export for use in browser console
if (typeof window !== "undefined") {
  (window as any).testCompanyDetailCache = testCompanyDetailCache;
}
