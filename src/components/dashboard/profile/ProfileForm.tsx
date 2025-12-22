"use client";

import { motion } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FiSave, FiGithub, FiTwitter, FiLinkedin, FiPlus, FiTrash2, FiLink } from "react-icons/fi";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

// Robust Schema
const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  headline: z.string().max(100, "Headline must be less than 100 characters"),
  bio: z.string().max(500, "Bio must be less than 500 characters"),
  location: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  socialLinks: z.object({
    website: z.string().url().optional().or(z.literal("")),
    github: z.string().url().optional().or(z.literal("")),
    twitter: z.string().url().optional().or(z.literal("")),
    linkedin: z.string().url().optional().or(z.literal("")),
  }),
  skills: z.array(z.string()),
  competencies: z.array(z.object({
     label: z.string().min(1, "Skill name required"),
     level: z.number().min(0).max(100)
  }))
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const [newSkill, setNewSkill] = useState("");

  const { register, control, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "John Doe",
      headline: "Senior Product Designer",
      bio: "Passionate about creating intuitive and beautiful user experiences.",
      location: "San Francisco, CA",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      socialLinks: {
        website: "https://johndoe.design",
        github: "https://github.com/johndoe",
        twitter: "https://twitter.com/johndoe",
        linkedin: "https://linkedin.com/in/johndoe",
      },
      skills: ["UI/UX", "Product Design", "React", "Figma", "Design Systems"],
      competencies: [
          { label: "Advanced React Patterns", level: 78 },
          { label: "System Design", level: 55 },
          { label: "UI Animation", level: 92 }
      ]
    }
  });

  const { fields: competencyFields, append: appendCompetency, remove: removeCompetency } = useFieldArray({
    control,
    name: "competencies"
  });

  const currentSkills = watch("skills");

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (newSkill.trim() && !currentSkills.includes(newSkill.trim())) {
        setValue('skills', [...currentSkills, newSkill.trim()]);
        setNewSkill("");
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setValue('skills', currentSkills.filter(skill => skill !== skillToRemove));
  };

  const onSubmit = async (data: ProfileFormValues) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Updated Profile Data:", data);
    toast.success("Profile updated successfully");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto">
        
        {/* Basic Info Section */}
        <Card className="border-none shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-xl">Personal Information</CardTitle>
                <CardDescription>Update your core identity details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" {...register("fullName")} className="bg-white/50 dark:bg-gray-900/50" aria-invalid={!!errors.fullName} />
                    {errors.fullName && <p role="alert" className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="headline">Headline</Label>
                    <Input id="headline" {...register("headline")} placeholder="e.g. Software Engineer" className="bg-white/50 dark:bg-gray-900/50" aria-invalid={!!errors.headline} />
                    {errors.headline && <p role="alert" className="text-red-500 text-xs mt-1">{errors.headline.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register("email")} className="bg-white/50 dark:bg-gray-900/50" aria-invalid={!!errors.email} />
                    {errors.email && <p role="alert" className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" {...register("location")} className="bg-white/50 dark:bg-gray-900/50" />
                </div>
                </div>

                <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                    id="bio" 
                    {...register("bio")} 
                    className="min-h-[120px] bg-white/50 dark:bg-gray-900/50 resize-none" 
                    aria-invalid={!!errors.bio}
                />
                <p className="text-xs text-gray-500 text-right" aria-live="polite">{watch("bio")?.length || 0}/500 characters</p>
                </div>
            </CardContent>
        </Card>

        {/* Social Links Section */}
        <Card className="border-none shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-xl">Social Presence</CardTitle>
                <CardDescription>Where can people find you online?</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="social-website" className="flex items-center gap-2"><FiLink aria-hidden="true" /> Website / Portfolio</Label>
                        <Input id="social-website" {...register("socialLinks.website")} placeholder="https://..." className="bg-white/50 dark:bg-gray-900/50" />
                        {errors.socialLinks?.website && <p role="alert" className="text-red-500 text-xs">{errors.socialLinks.website.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="social-github" className="flex items-center gap-2"><FiGithub aria-hidden="true" /> GitHub</Label>
                        <Input id="social-github" {...register("socialLinks.github")} placeholder="https://github.com/..." className="bg-white/50 dark:bg-gray-900/50" />
                        {errors.socialLinks?.github && <p role="alert" className="text-red-500 text-xs">{errors.socialLinks.github.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="social-twitter" className="flex items-center gap-2"><FiTwitter aria-hidden="true" /> Twitter / X</Label>
                        <Input id="social-twitter" {...register("socialLinks.twitter")} placeholder="https://twitter.com/..." className="bg-white/50 dark:bg-gray-900/50" />
                        {errors.socialLinks?.twitter && <p role="alert" className="text-red-500 text-xs">{errors.socialLinks.twitter.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="social-linkedin" className="flex items-center gap-2"><FiLinkedin aria-hidden="true" /> LinkedIn</Label>
                        <Input id="social-linkedin" {...register("socialLinks.linkedin")} placeholder="https://linkedin.com/in/..." className="bg-white/50 dark:bg-gray-900/50" />
                        {errors.socialLinks?.linkedin && <p role="alert" className="text-red-500 text-xs">{errors.socialLinks.linkedin.message}</p>}
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* Skills & Competencies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Skills Tags */}
            <Card className="border-none shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm h-full">
                <CardHeader>
                    <CardTitle className="text-xl" id="skills-title">Skills & Technologies</CardTitle>
                    <CardDescription>Press Enter to add a skill.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input 
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={handleAddSkill}
                        placeholder="Type a skill and press Enter..."
                        className="bg-white/50 dark:bg-gray-900/50"
                        aria-labelledby="skills-title"
                        aria-label="Add a new skill"
                    />
                    <div className="flex flex-wrap gap-2 min-h-[100px] content-start" role="list" aria-label="Skills list">
                        {currentSkills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="px-3 py-1 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300" role="listitem">
                                {skill}
                                <button type="button" onClick={() => removeSkill(skill)} className="ml-2 hover:text-red-500" aria-label={`Remove skill ${skill}`}>×</button>
                            </Badge>
                        ))}
                        {currentSkills.length === 0 && <span className="text-sm text-gray-400 italic">No skills added yet.</span>}
                    </div>
                </CardContent>
            </Card>

            {/* Competencies Sliders */}
            <Card className="border-none shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-xl">Core Competencies</CardTitle>
                        <CardDescription>Rate your proficiency (0-100).</CardDescription>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendCompetency({ label: "New Skill", level: 50 })}>
                        <FiPlus className="mr-2" aria-hidden="true" /> Add
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                    {competencyFields.map((field, index) => (
                        <div key={field.id} className="space-y-3 p-3 bg-white/50 dark:bg-gray-900/50 rounded-xl relative group">
                            <div className="flex gap-4 items-center">
                                <Input 
                                    {...register(`competencies.${index}.label`)} 
                                    className="h-8 border-none bg-transparent font-medium p-0 focus-visible:ring-0" 
                                    aria-label={`Competency name for item ${index + 1}`}
                                    placeholder="Skill Name"
                                />
                                <button type="button" onClick={() => removeCompetency(index)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`Remove competency ${index + 1}`}>
                                    <FiTrash2 size={16} aria-hidden="true" />
                                </button>
                            </div>
                            <div className="flex items-center gap-4">
                                <Slider 
                                    defaultValue={[field.level]} 
                                    max={100} 
                                    step={1} 
                                    className="flex-1"
                                    onValueChange={(vals) => setValue(`competencies.${index}.level`, vals[0])}
                                    aria-label={`Proficiency level for ${watch(`competencies.${index}.label`) || "competency"}`}
                                />
                                <span className="text-sm font-bold w-12 text-right" aria-hidden="true">{watch(`competencies.${index}.level`)}%</span>
                            </div>
                        </div>
                    ))}
                    {competencyFields.length === 0 && <p className="text-sm text-gray-400 italic text-center py-4">No competencies added.</p>}
                </CardContent>
            </Card>
        </div>

        {/* Save Actions */}
        <div className="flex justify-end pt-4 pb-12">
            <Button type="submit" size="lg" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 dark:shadow-none" disabled={isSubmitting}>
            {isSubmitting ? (
                "Saving Changes..."
            ) : (
                <>
                    <FiSave className="mr-2" aria-hidden="true" /> Save Profile Changes
                </>
            )}
            </Button>
        </div>
      </form>
    </motion.div>
  );
}
