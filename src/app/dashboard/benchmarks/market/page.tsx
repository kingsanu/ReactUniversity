"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, TrendingUp, Users, Activity, Sun, CloudRain } from "lucide-react";
import EmployabilityChart from "../_components/EmployabilityChart";
import YouthEmploymentChart from "../_components/YouthEmploymentChart";
import MarketInsights from "../_components/MarketInsights";
import { 
  getEmployabilityTrends, 
  getYouthEmploymentTrends, 
  getMarketInsights,
  BenchmarkData,
  InsightData
} from "@/services/benchmarkService";

export default function MarketPage() {
  const searchParams = useSearchParams();
  const country = searchParams.get("country") || "USA";
  const career = searchParams.get("career") || "Software Engineer";

  const [employability, setEmployability] = useState<BenchmarkData[]>([]);
  const [youthEmployment, setYouthEmployment] = useState<BenchmarkData[]>([]);
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [emp, youth, mkt] = await Promise.all([
          getEmployabilityTrends(country, career),
          getYouthEmploymentTrends(country),
          getMarketInsights(country, career),
        ]);
        setEmployability(emp);
        setYouthEmployment(youth);
        setInsights(mkt);
      } catch (error) {
        console.error("Failed to fetch market data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [country, career]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       {/* Section Header */}
       <div className="flex flex-col md:flex-row justify-between items-end border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Market Dynamics</h2>
          <p className="text-slate-500 mt-1">
            Macro-economic trends and employment stability analysis.
          </p>
        </div>
      </div>

      <MarketInsights data={insights} isLoading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Charts - Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-500" />
                Employability Score
              </CardTitle>
              <CardDescription>
                Historical trend of role placement success over the last 5 years.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmployabilityChart data={employability} isLoading={loading} />
               <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-md text-sm text-indigo-800">
                <strong>Analysis:</strong> Consistent upward trend indicates a maturing market for {career} professionals.
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-pink-500" />
                Youth Employment Rate
              </CardTitle>
               <CardDescription>
                Employment trends for professionals under 25 in {country}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <YouthEmploymentChart data={youthEmployment} isLoading={loading} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Forecast & Sentiment */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-lg">
             <CardHeader>
               <CardTitle className="text-white flex items-center gap-2">
                 <Eye className="w-5 h-5 text-sky-400" />
                 Market Forecast
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Sun className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Positive Outlook</h4>
                    <p className="text-sm text-slate-300 mt-1">
                      Startups and enterprise sectors are projected to increase hiring by 15% in Q3.
                    </p>
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                <div>
                   <h5 className="text-sm font-medium text-slate-400 mb-3">Projected Hotspots</h5>
                   <div className="flex flex-wrap gap-2">
                     <Badge variant="outline" className="text-white border-white/20">Fintech</Badge>
                     <Badge variant="outline" className="text-white border-white/20">HealthTech</Badge>
                     <Badge variant="outline" className="text-white border-white/20">AI/ML</Badge>
                   </div>
                </div>
             </CardContent>
          </Card>

           <Card className="shadow-sm border-slate-200">
             <CardHeader>
               <CardTitle>Recruiter Sentiment</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="space-y-4">
                 <div className="flex justify-between items-center">
                   <span className="text-sm text-slate-600">Hiring Speed</span>
                   <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">Fast</Badge>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-sm text-slate-600">Interview Tech</span>
                   <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">Remote</Badge>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-sm text-slate-600">Contract Roles</span>
                   <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">Increasing</Badge>
                 </div>
               </div>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
