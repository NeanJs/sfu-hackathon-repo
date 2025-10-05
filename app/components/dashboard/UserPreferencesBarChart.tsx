import React, { useEffect, useState } from "react";
import BarChart from "../barchart/BarChart";

export default function UserPreferencesBarChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/userpreferences")
      .then((res) => res.json())
      .then((json) => {
        setData(json.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-8">Loading chart…</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  if (!data.length) return <div className="text-center py-8">No data found.</div>;

  // Count occurrences for each PMV value
  const economyCounts: Record<string, number> = {};
  const futureCounts: Record<string, number> = {};
  const protectionCounts: Record<string, number> = {};
  data.forEach((d) => {
    economyCounts[d.pmv_economy] = (economyCounts[d.pmv_economy] || 0) + 1;
    futureCounts[d.pmv_future] = (futureCounts[d.pmv_future] || 0) + 1;
    protectionCounts[d.pmv_protection] = (protectionCounts[d.pmv_protection] || 0) + 1;
  });

  const economyData = Object.entries(economyCounts).map(([category, value]) => ({ category, value }));
  const futureData = Object.entries(futureCounts).map(([category, value]) => ({ category, value }));
  const protectionData = Object.entries(protectionCounts).map(([category, value]) => ({ category, value }));

  return (
    <div className="space-y-8">
      <BarChart data={economyData} title="Economy Preferences" xTitle="Economy" yTitle="Users" unit="users" />
      <BarChart data={futureData} title="Future Preferences" xTitle="Future" yTitle="Users" unit="users" />
      <BarChart data={protectionData} title="Protection Preferences" xTitle="Protection" yTitle="Users" unit="users" />
    </div>
  );
}
