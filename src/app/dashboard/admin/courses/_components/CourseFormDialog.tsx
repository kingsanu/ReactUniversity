"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Course } from "@/types/course";

interface CourseFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Course) => void;
  course: Course | null;
  isCreating: boolean;
}

export function CourseFormDialog({
  isOpen,
  onClose,
  onSave,
  course,
  isCreating,
}: CourseFormDialogProps) {
  const [formData, setFormData] = useState<Partial<Course>>({
    title: "",
    shortDescription: "",
    fullDescription: "",
    provider: "",
    instructor: "",
    category: "",
    difficulty: "Beginner",
    duration: 4,
    estimatedHours: 5,
    thumbnailUrl: "",
    videoUrl: "",
    rating: 4.5,
    reviewCount: 0,
    enrollmentCount: 0,
    isActive: true,
    certificate: true,
    language: "English",
    country: "United States",
    region: "North America",
  });

  useEffect(() => {
    if (course) {
      setFormData(course);
    } else {
      setFormData({
        title: "",
        shortDescription: "",
        fullDescription: "",
        provider: "",
        instructor: "",
        category: "",
        difficulty: "Beginner",
        duration: 4,
        estimatedHours: 5,
        thumbnailUrl: "",
        videoUrl: "",
        rating: 4.5,
        reviewCount: 0,
        enrollmentCount: 0,
        isActive: true,
        certificate: true,
        language: "English",
        country: "United States",
        region: "North America",
      });
    }
  }, [course]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Course);
  };

  const handleChange = (
    field: keyof Course,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full min-w-5xl max-w-5xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isCreating ? "Create New Course" : "Edit Course"}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Course Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                    placeholder="e.g., Python for Data Science"
                  />
                </div>

                <div>
                  <Label htmlFor="provider">Provider *</Label>
                  <Input
                    id="provider"
                    value={formData.provider}
                    onChange={(e) => handleChange("provider", e.target.value)}
                    required
                    placeholder="e.g., Coursera"
                  />
                </div>

                <div>
                  <Label htmlFor="instructor">Instructor *</Label>
                  <Input
                    id="instructor"
                    value={formData.instructor}
                    onChange={(e) => handleChange("instructor", e.target.value)}
                    required
                    placeholder="e.g., Dr. John Smith"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    required
                    placeholder="e.g., Technology"
                  />
                </div>

                <div>
                  <Label htmlFor="difficulty">Difficulty *</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => handleChange("difficulty", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration">Duration (weeks) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      handleChange("duration", parseInt(e.target.value))
                    }
                    required
                    min="1"
                  />
                </div>

                <div>
                  <Label htmlFor="estimatedHours">Hours per Week *</Label>
                  <Input
                    id="estimatedHours"
                    type="number"
                    value={formData.estimatedHours}
                    onChange={(e) =>
                      handleChange("estimatedHours", parseInt(e.target.value))
                    }
                    required
                    min="1"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="shortDescription">Short Description *</Label>
                  <Textarea
                    id="shortDescription"
                    value={formData.shortDescription}
                    onChange={(e) =>
                      handleChange("shortDescription", e.target.value)
                    }
                    required
                    rows={2}
                    placeholder="Brief description for course cards"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="fullDescription">Full Description *</Label>
                  <Textarea
                    id="fullDescription"
                    value={formData.fullDescription}
                    onChange={(e) =>
                      handleChange("fullDescription", e.target.value)
                    }
                    required
                    rows={4}
                    placeholder="Detailed course description"
                  />
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Media</h3>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="thumbnailUrl">Thumbnail URL *</Label>
                  <Input
                    id="thumbnailUrl"
                    value={formData.thumbnailUrl}
                    onChange={(e) =>
                      handleChange("thumbnailUrl", e.target.value)
                    }
                    required
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div>
                  <Label htmlFor="videoUrl">Video URL</Label>
                  <Input
                    id="videoUrl"
                    value={formData.videoUrl}
                    onChange={(e) => handleChange("videoUrl", e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
              </div>
            </div>

            {/* Location & Language */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Location & Language
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="language">Language *</Label>
                  <Input
                    id="language"
                    value={formData.language}
                    onChange={(e) => handleChange("language", e.target.value)}
                    required
                    placeholder="e.g., English"
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    required
                    placeholder="e.g., United States"
                  />
                </div>

                <div>
                  <Label htmlFor="region">Region *</Label>
                  <Input
                    id="region"
                    value={formData.region}
                    onChange={(e) => handleChange("region", e.target.value)}
                    required
                    placeholder="e.g., North America"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Form Actions - fixed at bottom of dialog */}
        <div className="flex justify-end gap-3 p-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={(e) => e.preventDefault()}>
            {isCreating ? "Create Course" : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
