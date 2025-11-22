"use client";

import { useState, use } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Clock, Calendar, Globe, Award, BookOpen } from "lucide-react";
import { BookingModal } from "@/components/coaching/BookingModal";
import { Coach } from "@/components/coaching/CoachCard";

// Mock Data (In a real app, fetch this based on ID)
const MOCK_COACH: Coach = {
  id: "1",
  name: "Sarah Wilson",
  title: "Senior Career Coach",
  specialization: "Tech Leadership",
  rating: 4.9,
  reviews: 124,
  hourlyRate: 150,
  location: "San Francisco, CA",
  availability: "Available Today",
  image: "https://i.pravatar.cc/150?u=sarah",
  tags: ["Leadership", "Management", "Tech"],
};

export default function CoachDetailsPage({ params }: { params: Promise<{ coachId: string }> }) {
  const { coachId } = use(params);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  // In a real app, fetch coach by ID
  const coach = MOCK_COACH; 

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-16 mb-6">
            <div className="flex items-end">
              <Avatar className="h-32 w-32 border-4 border-white shadow-md">
                <AvatarImage src={coach.image} alt={coach.name} />
                <AvatarFallback>{coach.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-6 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{coach.name}</h1>
                <p className="text-lg text-gray-600 font-medium">{coach.title}</p>
              </div>
            </div>
            <div className="flex gap-3 mb-2">
              <Button size="lg" onClick={() => setIsBookingModalOpen(true)}>
                Book a Session
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-gray-600 border-t pt-6">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-500 mr-2 fill-yellow-500" />
              <span className="font-semibold text-gray-900 mr-1">{coach.rating}</span>
              <span>({coach.reviews} reviews)</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-400 mr-2" />
              {coach.location}
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-2" />
              ${coach.hourlyRate}/hr
            </div>
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-gray-400 mr-2" />
              English, Spanish
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: About & Experience */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About Me</h2>
            <p className="text-gray-600 leading-relaxed">
              I am a seasoned career coach with over 10 years of experience in the tech industry. 
              I specialize in helping engineering leaders transition into executive roles and navigate 
              complex organizational challenges. My coaching style is practical, empathy-driven, and 
              results-oriented.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              Previously, I led engineering teams at major tech companies in Silicon Valley. 
              I understand the unique pressures and opportunities that come with technical leadership.
            </p>
          </section>

          <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Expertise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-lg mr-4">
                  <Award className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Leadership Development</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Building high-performing teams and culture.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-lg mr-4">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Career Strategy</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Long-term planning and role transitions.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Availability & Booking */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Upcoming Availability</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-500 mr-3" />
                  <span className="text-sm font-medium">Tomorrow, 10:00 AM</span>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  Book
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-500 mr-3" />
                  <span className="text-sm font-medium">Wed, 2:00 PM</span>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  Book
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-500 mr-3" />
                  <span className="text-sm font-medium">Thu, 11:00 AM</span>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  Book
                </Button>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline" onClick={() => setIsBookingModalOpen(true)}>
              View Full Schedule
            </Button>
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
