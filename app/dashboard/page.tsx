/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { farmersApi, cropsApi } from "@/lib/api";
import { Users, Wheat, TrendingUp, BarChart3 } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { CropChart } from "@/components/dashboard/crop-chart";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>({});
  const [cropStats, setCropStats] = useState<any>({});
  const [loadingData, setLoadingData] = useState(true);

  // ✅ Memoize the function so it's not re-created on each render
  const loadDashboardData = useCallback(async () => {
    try {
      setLoadingData(true);
      const [cropStatsData] = await Promise.all([cropsApi.getStats()]);

      setCropStats(cropStatsData);

      if (user?.role === "ADMIN") {
        const farmerStats = await farmersApi.getStats();
        setStats(farmerStats);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoadingData(false);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      loadDashboardData();
    }
  }, [user, loading, router, loadDashboardData]);

  if (loading || loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) return null;

  const isAdmin = user.role === "ADMIN";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          {isAdmin
            ? "Overview of your cooperative management system"
            : `Welcome back, ${user.farmer?.firstName}! Manage your crops and profile.`}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {isAdmin ? (
          <>
            <StatsCard
              title="Total Farmers"
              value={stats.totalFarmers || 0}
              description="Active farmer accounts"
              icon={Users}
              trend={{ value: 5, isPositive: true }}
            />
            <StatsCard
              title="Total Crops"
              value={stats.totalCrops || 0}
              description="Crops across all farmers"
              icon={Wheat}
              trend={{ value: 12, isPositive: true }}
            />
            <StatsCard
              title="Avg Crops/Farmer"
              value={
                stats.totalFarmers
                  ? Math.round((stats.totalCrops / stats.totalFarmers) * 10) /
                    10
                  : 0
              }
              description="Average per farmer"
              icon={TrendingUp}
            />
            <StatsCard
              title="Crop Varieties"
              value={cropStats.cropsByType?.length || 0}
              description="Different crop types"
              icon={BarChart3}
            />
          </>
        ) : (
          <>
            <StatsCard
              title="My Crops"
              value={cropStats.totalCrops || 0}
              description="Your registered crops"
              icon={Wheat}
              trend={{ value: 8, isPositive: true }}
            />
            <StatsCard
              title="Crop Types"
              value={cropStats.cropsByType?.length || 0}
              description="Different varieties you grow"
              icon={BarChart3}
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {isAdmin && stats.cropsPerFarmer && (
          <CropChart
            data={stats.cropsPerFarmer.map((farmer: any) => ({
              name: `${farmer.firstName} ${farmer.lastName}`,
              count: farmer._count.crops,
            }))}
            title="Crops per Farmer"
            type="bar"
          />
        )}

        {cropStats.cropsByType && (
          <CropChart
            data={cropStats.cropsByType.map((item: any) => ({
              name: item.type.replace("_", " "),
              count: item.count,
            }))}
            title={
              isAdmin ? "System Crop Distribution" : "Your Crop Distribution"
            }
            type="pie"
          />
        )}
      </div>
    </div>
  );
}
