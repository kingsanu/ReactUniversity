"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { CoachCard } from "@/components/coaching/CoachCard";
import { Coach } from "@/types/coach";
import { BookingModal } from "@/components/coaching/BookingModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock Data removed as we are fetching from API

export default function CoachingSchedulePage() {
  const [searchQuery, setSearchTerm] = useState("");
  const [selectedCategory, setSpecializationFilter] = useState("all");
  const [selectedCoach, setSelectedCoach] = useState<any | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [coaches, setCoaches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch coaches
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setIsLoading(true);
        const { getCoaches } = await import("@/services/coachService");
        const response = await getCoaches({
          search: searchQuery,
          specialization: selectedCategory === "all" ? undefined : selectedCategory
        });
        setCoaches(response.data);
      } catch (error) {
        console.error("Failed to fetch coaches:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      fetchCoaches();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  const handleBookCoach = (coach: any) => {
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
            value={searchQuery}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select
            value={selectedCategory}
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
      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading coaches...</div>
      ) : coaches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coaches.map((coach) => (
            <CoachCard key={coach.id} coach={coach} onBook={handleBookCoach} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No coaches found</h3>
          <p className="text-gray-500 mt-1">
            Try adjusting your search or filters to find what you're looking for.
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
