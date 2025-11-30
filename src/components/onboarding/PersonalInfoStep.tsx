import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CoachOnboardingData } from "./types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, User, Briefcase, MapPin, Globe, Tag, DollarSign } from "lucide-react";

const personalInfoSchema = z.object({
  name: z.string().min(2, "Name is required"),
  title: z.string().min(2, "Job title is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  specialization: z.string().min(2, "Specialization is required"),
  location: z.string().min(2, "Location is required"),
  languages: z.string().min(2, "At least one language is required"),
  tags: z.string().min(2, "At least one tag is required"),
  hourlyRate: z.coerce.number().min(1, "Hourly rate must be at least $1"),
});

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

interface PersonalInfoStepProps {
  data: CoachOnboardingData["personalInfo"];
  onNext: (data: CoachOnboardingData["personalInfo"]) => void;
}

export function PersonalInfoStep({ data, onNext }: PersonalInfoStepProps) {
  const [imagePreview, setImagePreview] = React.useState<string | null>(data.image);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      ...data,
      languages: data.languages.join(", "),
      tags: data.tags.join(", "),
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        const { uploadProfileImage } = await import("@/services/coachService");
        const { url } = await uploadProfileImage(file);
        setImagePreview(url);
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    }
  };

  const onSubmit = (values: PersonalInfoFormValues) => {
    onNext({
      ...values,
      languages: values.languages.split(",").map((s) => s.trim()),
      tags: values.tags.split(",").map((s) => s.trim()),
      image: imagePreview,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center gap-6 p-4 border border-gray-100 rounded-xl bg-gray-50/50">
        <div className="relative group cursor-pointer shrink-0">
          <Avatar className="h-20 w-20 border-2 border-white shadow-md">
            <AvatarImage src={imagePreview || ""} className="object-cover" />
            <AvatarFallback className="bg-gray-200 text-gray-400">
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200">
            <Upload className="h-5 w-5 text-white" />
          </div>
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleImageUpload}
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Profile Photo</h3>
          <p className="text-sm text-gray-500 mt-1">
            Upload a professional photo. JPG, GIF or PNG. Max size of 800K.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              id="name" 
              {...register("name")} 
              className="pl-9 bg-gray-50/30 border-gray-200 focus:bg-white transition-all h-11" 
              placeholder="e.g. Sarah Wilson" 
            />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="title" className="text-gray-700 font-medium">Job Title</Label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              id="title" 
              {...register("title")} 
              className="pl-9 bg-gray-50/30 border-gray-200 focus:bg-white transition-all h-11" 
              placeholder="e.g. Senior Career Coach" 
            />
          </div>
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-gray-700 font-medium">Bio</Label>
        <Textarea
          id="bio"
          {...register("bio")}
          placeholder="Tell us about your experience and coaching style..."
          className="min-h-[120px] bg-gray-50/30 border-gray-200 focus:bg-white transition-all resize-none p-4"
        />
        {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="specialization" className="text-gray-700 font-medium">Primary Specialization</Label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="specialization"
              {...register("specialization")}
              className="pl-9 bg-gray-50/30 border-gray-200 focus:bg-white transition-all h-11"
              placeholder="e.g. Tech Leadership"
            />
          </div>
          {errors.specialization && (
            <p className="text-red-500 text-xs mt-1">{errors.specialization.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-gray-700 font-medium">Location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              id="location" 
              {...register("location")} 
              className="pl-9 bg-gray-50/30 border-gray-200 focus:bg-white transition-all h-11" 
              placeholder="e.g. San Francisco, CA" 
            />
          </div>
          {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="hourlyRate" className="text-gray-700 font-medium">Hourly Rate (USD)</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              id="hourlyRate" 
              type="number"
              step="1"
              min="1"
              {...register("hourlyRate")} 
              className="pl-9 bg-gray-50/30 border-gray-200 focus:bg-white transition-all h-11" 
              placeholder="e.g. 50" 
            />
          </div>
          {errors.hourlyRate && <p className="text-red-500 text-xs mt-1">{errors.hourlyRate.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="languages" className="text-gray-700 font-medium">Languages</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="languages"
              {...register("languages")}
              className="pl-9 bg-gray-50/30 border-gray-200 focus:bg-white transition-all h-11"
              placeholder="e.g. English, Spanish"
            />
          </div>
          {errors.languages && <p className="text-red-500 text-xs mt-1">{errors.languages.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags" className="text-gray-700 font-medium">Skills / Tags</Label>
        <div className="relative">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="tags"
            {...register("tags")}
            className="pl-9 bg-gray-50/30 border-gray-200 focus:bg-white transition-all h-11"
            placeholder="e.g. Leadership, Management, Public Speaking"
          />
        </div>
        {errors.tags && <p className="text-red-500 text-xs mt-1">{errors.tags.message}</p>}
      </div>

      <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800 h-12 text-base font-medium rounded-lg shadow-lg shadow-black/10 transition-all hover:shadow-xl hover:-translate-y-0.5">
        Continue to Availability
      </Button>
    </form>
  );
}
