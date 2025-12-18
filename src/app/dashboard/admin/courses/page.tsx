"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash2, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

// Mock data for courses
const MOCK_COURSES = [
  {
    id: "1",
    title: "Introduction to React",
    description: "Learn the basics of React development",
    instructor: "John Doe",
    students: 120,
    status: "Published",
    lastUpdated: "2023-11-15",
  },
  {
    id: "2",
    title: "Advanced TypeScript",
    description: "Master TypeScript features and patterns",
    instructor: "Jane Smith",
    students: 85,
    status: "Draft",
    lastUpdated: "2023-11-20",
  },
  {
    id: "3",
    title: "Node.js Backend Development",
    description: "Build scalable backends with Node.js",
    instructor: "Mike Johnson",
    students: 200,
    status: "Published",
    lastUpdated: "2023-10-30",
  },
];

export default function CoursesPage() {
  const { t } = useTranslation();
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    instructor: "",
  });

  const handleAddCourse = () => {
    const course = {
      id: Math.random().toString(36).substr(2, 9),
      ...newCourse,
      students: 0,
      status: "Draft",
      lastUpdated: new Date().toISOString().split("T")[0],
    };
    setCourses([...courses, course]);
    setIsAddDialogOpen(false);
    setNewCourse({ title: "", description: "", instructor: "" });
    toast.success(t("admin.courses.courseCreated"));
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id));
    toast.success(t("admin.courses.courseDeleted"));
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("admin.courses.title")}
          </h1>
          <p className="text-muted-foreground">{t("admin.courses.subtitle")}</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> {t("admin.courses.addCourse")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("admin.courses.createTitle")}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">{t("admin.courses.field.title")}</Label>
                <Input
                  id="title"
                  value={newCourse.title}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, title: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">
                  {t("admin.courses.field.description")}
                </Label>
                <Textarea
                  id="description"
                  value={newCourse.description}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, description: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="instructor">
                  {t("admin.courses.field.instructor")}
                </Label>
                <Input
                  id="instructor"
                  value={newCourse.instructor}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, instructor: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button onClick={handleAddCourse}>
                {t("admin.courses.create")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center mb-6">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("admin.courses.searchPlaceholder")}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("admin.courses.table.title")}</TableHead>
              <TableHead>{t("admin.courses.table.instructor")}</TableHead>
              <TableHead>{t("admin.courses.table.students")}</TableHead>
              <TableHead>{t("admin.courses.table.status")}</TableHead>
              <TableHead>{t("admin.courses.table.lastUpdated")}</TableHead>
              <TableHead className="text-right">
                {t("admin.courses.table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                    {course.title}
                  </div>
                </TableCell>
                <TableCell>{course.instructor}</TableCell>
                <TableCell>{course.students}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      course.status === "Published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {course.status}
                  </span>
                </TableCell>
                <TableCell>{course.lastUpdated}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600"
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
