"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { Coach, CoachCard } from "@/components/coaching/CoachCard";
import { BookingModal } from "@/components/coaching/BookingModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock Data
const MOCK_COACHES: Coach[] = [
  {
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
  },
  {
    id: "2",
    name: "Michael Chen",
    title: "Technical Interview Coach",
    specialization: "Software Engineering",
    rating: 5.0,
    reviews: 89,
    hourlyRate: 200,
    location: "New York, NY",
    availability: "Next Available: Tomorrow",
    image: "https://i.pravatar.cc/150?u=michael",
    tags: ["Algorithms", "System Design", "Coding"],
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    title: "Executive Coach",
    specialization: "Public Speaking",
    rating: 4.8,
    reviews: 210,
    hourlyRate: 180,
    location: "Remote",
    availability: "Available Today",
    image: "https://i.pravatar.cc/150?u=emily",
    tags: ["Communication", "Presentation", "Executive"],
  },
  {
    id: "4",
    name: "David Kim",
    title: "Product Management Coach",
    specialization: "Product Strategy",
    rating: 4.7,
    reviews: 156,
    hourlyRate: 160,
    location: "Seattle, WA",
    availability: "Next Available: Mon",
    image: "https://i.pravatar.cc/150?u=david",
    tags: ["Product", "Strategy", "Agile"],
  },
  {
    id: "5",
    name: "Jessica Lee",
    title: "Design Mentor",
    specialization: "UX/UI Design",
    rating: 4.9,
    reviews: 98,
    hourlyRate: 140,
    location: "Austin, TX",
    availability: "Available Today",
    image: "https://i.pravatar.cc/150?u=jessica",
    tags: ["Design", "UX", "Portfolio"],
  },
  {
    id: "6",
    name: "Robert Taylor",
    title: "Career Transition Specialist",
    specialization: "Career Change",
    rating: 4.6,
    reviews: 75,
    hourlyRate: 120,
    location: "London, UK",
    availability: "Next Available: Wed",
    image: "https://i.pravatar.cc/150?u=robert",
    tags: ["Transition", "Resume", "Networking"],
  },
];

export default function CoachingSchedulePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const filteredCoaches = MOCK_COACHES.filter((coach) => {
    const matchesSearch =
      coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesSpecialization =
      specializationFilter === "all" ||
      coach.specialization === specializationFilter;

    return matchesSearch && matchesSpecialization;
  });

  const handleBookCoach = (coach: Coach) => {
    setSelectedCoach(coach);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Find Your Perfect Coach
        </h1>
        <p className="text-gray-500 mt-2">
          Connect with industry experts to accelerate your career growth.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, title, or skill..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select
            value={specializationFilter}
            onValueChange={setSpecializationFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Specialization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specializations</SelectItem>
              <SelectItem value="Tech Leadership">Tech Leadership</SelectItem>
              <SelectItem value="Software Engineering">
                Software Engineering
              </SelectItem>
              <SelectItem value="Public Speaking">Public Speaking</SelectItem>
              <SelectItem value="Product Strategy">Product Strategy</SelectItem>
              <SelectItem value="UX/UI Design">UX/UI Design</SelectItem>
              <SelectItem value="Career Change">Career Change</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" className="w-full md:w-auto">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Coach Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCoaches.map((coach) => (
          <CoachCard key={coach.id} coach={coach} onBook={handleBookCoach} />
        ))}
      </div>

      {/* Empty State */}
      {filteredCoaches.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No coaches found matching your criteria.
          </p>
          <Button
            variant="link"
            onClick={() => {
              setSearchTerm("");
              setSpecializationFilter("all");
            }}
          >
            Clear all filters
          </Button>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        coach={selectedCoach}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
}
