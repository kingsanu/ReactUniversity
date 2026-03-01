"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Award,
  Briefcase,
  Heart,
  FolderOpen,
  Trophy,
  Star,
  FileText,
  Calendar,
  Clock,
  Edit,
  Trash2,
  X,
  Upload,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  usePortfolioItems,
  usePortfolioSummary,
  useCreatePortfolioItem,
  useUpdatePortfolioItem,
  useDeletePortfolioItem,
} from "@/hooks/usePortfolioQueries";
import type { PortfolioItemPayload, PortfolioItemType, PortfolioItem } from "@/types/portfolio";

const typeConfig: Record<
  PortfolioItemType,
  { label: string; icon: typeof Award; color: string; bg: string }
> = {
  extracurricular: {
    label: "Extracurricular",
    icon: Star,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  award: {
    label: "Award",
    icon: Trophy,
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  project: {
    label: "Project",
    icon: FolderOpen,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  volunteer: {
    label: "Volunteer",
    icon: Heart,
    color: "text-rose-600",
    bg: "bg-rose-100",
  },
  work_experience: {
    label: "Work Experience",
    icon: Briefcase,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
  certification: {
    label: "Certification",
    icon: FileText,
    color: "text-indigo-600",
    bg: "bg-indigo-100",
  },
};

const emptyPayload: PortfolioItemPayload = {
  type: "extracurricular",
  title: "",
  organization: "",
  description: "",
  startDate: "",
  isCurrent: false,
  role: "",
  achievements: [],
};

export default function PortfolioPage() {
  const { t } = useTranslation();
  const [activeType, setActiveType] = useState<PortfolioItemType | "all">(
    "all"
  );
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState<PortfolioItemPayload>(emptyPayload);

  const typeFilter =
    activeType === "all" ? undefined : (activeType as PortfolioItemType);
  const { data: portfolioData, isLoading } = usePortfolioItems({
    type: typeFilter,
  });
  const { data: summary } = usePortfolioSummary();
  const createItem = useCreatePortfolioItem();
  const updateItem = useUpdatePortfolioItem();
  const deleteItem = useDeletePortfolioItem();

  const items = portfolioData?.data || [];

  const openCreateForm = () => {
    setEditingItem(null);
    setFormData(emptyPayload);
    setShowForm(true);
  };

  const openEditForm = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      type: item.type,
      title: item.title,
      organization: item.organization || "",
      description: item.description || "",
      startDate: item.startDate || "",
      endDate: item.endDate,
      isCurrent: item.isCurrent,
      role: item.role || "",
      totalHours: item.totalHours,
      achievements: item.achievements || [],
    });
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) return;

    if (editingItem) {
      updateItem.mutate(
        { id: editingItem.id, payload: formData },
        { onSuccess: () => setShowForm(false) }
      );
    } else {
      createItem.mutate(formData, { onSuccess: () => setShowForm(false) });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("portfolio.title", "My Portfolio")}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {t(
              "portfolio.subtitle",
              "Track your extracurriculars, awards, projects, and experiences"
            )}
          </p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="h-4 w-4 mr-2" />
          {t("portfolio.addItem", "Add Item")}
        </Button>
      </motion.div>

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-5 text-center">
              <p className="text-2xl font-bold">{summary.totalItems}</p>
              <p className="text-sm text-gray-500">
                {t("portfolio.totalItems", "Total Items")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 text-center">
              <p className="text-2xl font-bold">{summary.totalVolunteerHours || 0}</p>
              <p className="text-sm text-gray-500">
                {t("portfolio.totalHours", "Total Hours")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 text-center">
              <p className="text-2xl font-bold">
                {summary.byType
                  ? Object.keys(summary.byType).length
                  : 0}
              </p>
              <p className="text-sm text-gray-500">
                {t("portfolio.categories", "Categories")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 text-center">
              <p className="text-2xl font-bold">
                {summary.byType?.award || 0}
              </p>
              <p className="text-sm text-gray-500">
                {t("portfolio.awards", "Awards")}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filter Tabs */}
      <Tabs
        value={activeType}
        onValueChange={(v) => setActiveType(v as PortfolioItemType | "all")}
      >
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          {(Object.keys(typeConfig) as PortfolioItemType[]).map((type) => (
            <TabsTrigger key={type} value={type}>
              {typeConfig[type].label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Items Grid */}
      {items.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-gray-500">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>{t("portfolio.noItems", "No portfolio items yet.")}</p>
            <Button onClick={openCreateForm} variant="outline" className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              {t("portfolio.addFirst", "Add Your First Item")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {items.map((item: PortfolioItem) => {
              const cfg = typeConfig[item.type] || typeConfig.extracurricular;
              const Icon = cfg.icon;

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-lg ${cfg.bg} flex-shrink-0`}
                          >
                            <Icon className={`h-5 w-5 ${cfg.color}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {item.title}
                            </h3>
                            {item.organization && (
                              <p className="text-sm text-gray-500">
                                {item.organization}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => openEditForm(item)}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-red-500"
                            onClick={() => deleteItem.mutate(item.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      {item.role && (
                        <p className="text-sm font-medium text-gray-700">
                          {item.role}
                        </p>
                      )}

                      {item.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        {item.startDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {item.startDate}
                            {item.endDate ? ` – ${item.endDate}` : " – Present"}
                          </span>
                        )}
                        {item.totalHours && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {item.totalHours}h
                          </span>
                        )}
                      </div>

                      {item.achievements && item.achievements.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {item.achievements.slice(0, 3).map((a) => (
                            <Badge
                              key={a}
                              variant="secondary"
                              className="text-xs"
                            >
                              {a}
                            </Badge>
                          ))}
                          {item.achievements.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{item.achievements.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingItem
                ? t("portfolio.editItem", "Edit Portfolio Item")
                : t("portfolio.addItem", "Add Portfolio Item")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <Select
              value={formData.type}
              onValueChange={(v) =>
                setFormData({ ...formData, type: v as PortfolioItemType })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(typeConfig) as PortfolioItemType[]).map(
                  (type) => (
                    <SelectItem key={type} value={type}>
                      {typeConfig[type].label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

            <Input
              placeholder={t("portfolio.titlePlaceholder", "Title *")}
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />

            <Input
              placeholder={t(
                "portfolio.organizationPlaceholder",
                "Organization / School / Company"
              )}
              value={formData.organization}
              onChange={(e) =>
                setFormData({ ...formData, organization: e.target.value })
              }
            />

            <Input
              placeholder={t("portfolio.rolePlaceholder", "Role / Position")}
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            />

            <Textarea
              placeholder={t(
                "portfolio.descriptionPlaceholder",
                "Description"
              )}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  {t("portfolio.startDate", "Start Date")}
                </label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  {t("portfolio.endDate", "End Date")}
                </label>
                <Input
                  type="date"
                  value={formData.endDate || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      endDate: e.target.value || undefined,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                {t("portfolio.totalHours", "Total Hours")}
              </label>
              <Input
                type="number"
                placeholder="0"
                value={formData.totalHours || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalHours: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              {t("common.cancel", "Cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                !formData.title.trim() ||
                createItem.isPending ||
                updateItem.isPending
              }
            >
              {editingItem
                ? t("common.save", "Save")
                : t("portfolio.create", "Create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
