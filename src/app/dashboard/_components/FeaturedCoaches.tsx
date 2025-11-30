"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, ArrowRight, Users, MapPin, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import { getCoaches } from "@/services/coachService";
import { Coach } from "@/types/coach";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";

export function FeaturedCoaches() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await getCoaches({ limit: 3 });
        // @ts-ignore - API response structure mismatch fix
        setCoaches(response.data.data || response.data);
      } catch (error) {
        console.error("Failed to fetch featured coaches:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-0 shadow-sm bg-white/50 animate-pulse h-[320px] rounded-2xl" />
        ))}
      </div>
    );
  }

  if (coaches.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            Featured Coaches
          </h2>
          <p className="text-gray-500 text-sm ml-11">Top-rated mentors ready to help you grow</p>
        </div>
        <Button variant="ghost" asChild className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 group">
          <Link href="/dashboard/book-coach">
            View All Coaches <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {coaches.map((coach, index) => (
          <motion.div
            key={coach.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full border-none shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white group overflow-hidden rounded-3xl flex flex-col relative">
              {/* Gradient Header */}
              <div className="h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              <CardContent className="pt-0 px-6 flex-grow relative">
                {/* Avatar */}
                <div className="absolute -top-12 left-6">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-white rounded-full opacity-20 group-hover:opacity-40 transition-opacity blur-sm" />
                    <Avatar className="h-24 w-24 border-[4px] border-white shadow-lg">
                      <AvatarImage src={coach.image} className="object-cover" />
                      <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 text-2xl font-bold">
                        {coach.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-1 right-1 bg-green-500 h-4 w-4 rounded-full border-[3px] border-white shadow-sm" title="Available"></div>
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-4 right-6 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5 border border-gray-100">
                  <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold text-xs text-gray-900">{coach.rating || "5.0"}</span>
                  <span className="text-[10px] text-gray-500">({coach.reviews || 0})</span>
                </div>

                <div className="mt-14 space-y-4">
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 leading-tight mb-1 group-hover:text-blue-600 transition-colors">{coach.name}</h3>
                    <p className="text-sm font-medium text-blue-600">{coach.title}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {coach.tags?.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-gray-50 text-gray-600 hover:bg-gray-100 font-normal border-gray-100">
                        {tag}
                      </Badge>
                    ))}
                    {(coach.tags?.length || 0) > 3 && (
                      <Badge variant="secondary" className="bg-gray-50 text-gray-400 font-normal border-gray-100">
                        +{(coach.tags?.length || 0) - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-50">
                    {coach.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-gray-400" />
                        <span className="truncate max-w-[120px]">{coach.location}</span>
                      </div>
                    )}
                    {coach.hourlyRate && (
                      <div className="flex items-center gap-1.5 font-medium text-gray-900">
                        <span className="text-gray-400 font-normal">from</span>
                        ${coach.hourlyRate}/hr
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-2 bg-gray-50/50 border-t border-gray-100">
                <Button asChild className="w-full bg-gray-900 text-white hover:bg-blue-600 shadow-lg shadow-gray-200 hover:shadow-blue-200 transition-all h-11 rounded-xl font-medium">
                  <Link href={`/dashboard/book-coach/${coach.id}`}>
                    Book Session
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
