"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FiCamera, FiMapPin, FiLink, FiGithub, FiTwitter, FiLinkedin, FiMail } from "react-icons/fi";

export function ProfileHeader() {
  return (
    <div className="relative mb-12">
      {/* Cover Image with Mesh Gradient */}
      <div className="h-48 md:h-80 w-full relative group overflow-hidden rounded-b-[3rem] shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900" />
        {/* Animated mesh gradient overlay effect */}
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
             <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
             <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
             <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="absolute inset-0 bg-black/20" /> {/* Subtle darkening */}

        <Button 
          variant="secondary" 
          size="sm" 
          className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border-white/20 border transition-all rounded-full px-4"
        >
          <FiCamera className="mr-2" aria-hidden="true" /> Edit Cover
        </Button>
      </div>

      {/* Profile Info Content */}
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        {/* 
            Contrast Fix:
            - Split the avatar and text layout.
            - Avatar has negative margin to overlap.
            - Text has NO negative margin, so it sits naturally below the banner on the light background.
            - Added pt-4 to text container to ensure it clears the avatar's bottom curve visually if needed.
        */}
        <div className="flex flex-col md:flex-row items-end gap-8 relative z-10 px-4">
          
          {/* Avatar Area - Overlaps Banner */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative shrink-0 -mt-16 md:-mt-24"
          >
            <div className="p-1.5 bg-white dark:bg-gray-950 rounded-full shadow-2xl">
                <Avatar className="h-32 w-32 md:h-48 md:w-48 border-4 border-white dark:border-gray-900 relative bg-gray-100">
                <AvatarImage src="https://github.com/shadcn.png" className="object-cover" alt="@user" />
                <AvatarFallback className="text-4xl bg-gradient-to-br from-indigo-100 to-white text-indigo-600">JD</AvatarFallback>
                </Avatar>
            </div>
            <button className="absolute bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all border-2 border-white dark:border-gray-900" aria-label="Change profile picture">
              <FiCamera size={18} aria-hidden="true" />
            </button>
          </motion.div>

          {/* User Details - Sits BELOW Banner (Black text on White) */}
          <div className="flex-1 w-full pb-2 md:pb-6 pt-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-end gap-6"
            >
              <div className="space-y-2">
                <div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    John Doe
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 font-medium">
                    Senior Product Designer at <span className="text-indigo-600 dark:text-indigo-400">Acme Inc.</span>
                    </p>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 font-medium pt-1">
                  <span className="flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <FiMapPin className="mr-2 text-gray-700 dark:text-gray-300" aria-hidden="true" /> San Francisco, CA
                  </span>
                  <a href="#" className="flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <FiLink className="mr-2 text-gray-700 dark:text-gray-300" aria-hidden="true" /> johndoe.design
                  </a>
                  <span className="flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <FiMail className="mr-2 text-gray-700 dark:text-gray-300" aria-hidden="true" /> john@example.com
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-4 lg:mt-0 w-full lg:w-auto">
                 <Button className="flex-1 lg:flex-none bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-xl px-6 h-11 font-semibold shadow-lg shadow-gray-200 dark:shadow-none">
                    Edit Profile
                 </Button>
                 <Button variant="outline" className="flex-1 lg:flex-none border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl h-11 w-11 p-0 flex items-center justify-center" aria-label="LinkedIn Profile">
                    <FiLinkedin size={20} className="text-blue-700" aria-hidden="true" />
                 </Button>
                 <Button variant="outline" className="flex-1 lg:flex-none border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl h-11 w-11 p-0 flex items-center justify-center" aria-label="Twitter Profile">
                    <FiTwitter size={20} className="text-blue-400" aria-hidden="true" />
                 </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
