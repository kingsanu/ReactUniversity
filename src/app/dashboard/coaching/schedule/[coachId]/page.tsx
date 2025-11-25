"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Calendar, MessageSquare, Share2, Globe, Languages } from "lucide-react";
import { BookingModal } from "@/components/coaching/BookingModal";
import { useParams } from "next/navigation";
import { Coach } from "@/types/coach";

export default function CoachProfilePage() {
  const params = useParams();
  const coachId = params.coachId as string;
  
  const [coach, setCoach] = useState<Coach | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const fetchCoachDetails = async () => {
      if (!coachId) return;
      try {
        const { getCoachDetails } = await import("@/services/coachService");
        const data = await getCoachDetails(coachId);
        setCoach(data);
      } catch (error) {
        console.error("Failed to fetch coach details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoachDetails();
  }, [coachId]);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!coach) {
    return <div className="flex justify-center items-center min-h-screen">Coach not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
          <div className="absolute top-4 right-4 flex gap-2">
            <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
              <Share2 className="h-4 w-4 mr-2" /> Share
            </Button>
          </div>
        </div>
        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-6 flex justify-between items-end">
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
              <AvatarImage src={coach.image || ""} alt={coach.name} />
              <AvatarFallback className="text-2xl">{coach.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex gap-3 mb-2">
              <Button size="lg" onClick={() => setIsBookingModalOpen(true)}>
                Book a Session
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{coach.name}</h1>
              <p className="text-lg text-gray-600 font-medium mt-1">{coach.title}</p>
              
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="font-bold text-gray-900 mr-1">{coach.rating || "New"}</span>
                  {coach.reviews && <span>({Array.isArray(coach.reviews) ? coach.reviews.length : coach.reviews} reviews)</span>}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
                  {coach.location}
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-1.5 text-gray-400" />
                  {coach.languages?.join(", ")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* About */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
            <div className="prose prose-gray max-w-none text-gray-600">
              <p>{coach.bio}</p>
            </div>
          </section>

          {/* Specialization & Skills */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Expertise</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Specialization</h3>
                <Badge className="text-base py-1 px-3 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100">
                  {coach.specialization}
                </Badge>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Skills & Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {coach.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="px-3 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
            <h3 className="font-bold text-gray-900 mb-4">Availability</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <Clock className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Next Available</p>
                  <p>Check calendar for slots</p>
                </div>
              </div>
              <Button className="w-full" onClick={() => setIsBookingModalOpen(true)}>
                Check Calendar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        coach={coach}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
}
