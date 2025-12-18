"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  Question360,
  questions360Service,
  getRelationTypeOptions,
  getCommonCategories,
  CreateQuestion360Request,
  UpdateQuestion360Request,
} from "@/services/questions360Service";

// Import shadcn components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CreateQuestionData {
  questionEnglishText: string;
  questionSpanishText: string;
  category: string;
  relationType: "Parent" | "Teacher" | "Other" | "Self";
  questionNumber: number;
  isSubQuestion: boolean;
  parentQuestionId?: string;
}

const RELATION_TYPE_OPTIONS = getRelationTypeOptions();
const CATEGORY_OPTIONS = getCommonCategories();

export function Question360Manager() {
  const { t } = useTranslation();
  const [questions, setQuestions] = useState<Question360[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingQuestionId, setUpdatingQuestionId] = useState<string | null>(
    null
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question360 | null>(
    null
  );
  const [filters, setFilters] = useState({
    relationType: "all",
    category: "all",
    isActive: "all",
  });
  const [formData, setFormData] = useState<CreateQuestionData>({
    questionEnglishText: "",
    questionSpanishText: "",
    category: "",
    relationType: "Parent",
    questionNumber: 1,
    isSubQuestion: false,
    parentQuestionId: "",
  });

  // Fetch all questions
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await questions360Service.getAllQuestions();
      console.log("📥 Received questions data:", data);

      // Ensure data is an array
      if (Array.isArray(data)) {
        setQuestions(data);
      } else {
        console.warn("⚠️ Expected array but got:", typeof data, data);
        setQuestions([]);
        setError("Invalid data format received from server");
      }
    } catch (err) {
      console.error("❌ Error fetching questions:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch questions"
      );
      setQuestions([]); // Ensure questions is always an array even on error
    } finally {
      setLoading(false);
    }
  };

  // Create new question
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createData: CreateQuestion360Request = {
        questionEnglishText: formData.questionEnglishText,
        questionSpanishText: formData.questionSpanishText,
        category: formData.category,
        relationType: formData.relationType,
        questionNumber: formData.questionNumber,
        isSubQuestion: formData.isSubQuestion,
        parentQuestionId: formData.parentQuestionId || undefined,
      };

      await questions360Service.createQuestion(createData);
      await fetchQuestions();
      setShowCreateModal(false);
      resetForm();
      alert("Question created successfully!");
    } catch (err) {
      console.error("❌ Error creating question:", err);
      alert(err instanceof Error ? err.message : "Failed to create question");
    }
  };

  // Update question with optimistic updates
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;

    const originalQuestion = editingQuestion;
    const updateData: UpdateQuestion360Request = {
      questionEnglishText: formData.questionEnglishText,
      questionSpanishText: formData.questionSpanishText,
      category: formData.category,
      relationType: formData.relationType,
      questionNumber: formData.questionNumber,
      isSubQuestion: formData.isSubQuestion,
      parentQuestionId: formData.parentQuestionId || undefined,
      isActive: editingQuestion.isActive,
    };

    // Optimistically update the UI
    const updatedQuestion: Question360 = {
      ...originalQuestion,
      ...updateData,
    };

    setQuestions((prev) =>
      prev.map((q) => (q.id === originalQuestion.id ? updatedQuestion : q))
    );
    setUpdatingQuestionId(originalQuestion.id);
    setEditingQuestion(null);
    resetForm();
    setShowCreateModal(false);

    try {
      await questions360Service.updateQuestion(originalQuestion.id, updateData);
      setUpdatingQuestionId(null);
      // alert("Question updated successfully!");
    } catch (err) {
      console.error("❌ Error updating question:", err);
      // Revert the optimistic update on failure
      setQuestions((prev) =>
        prev.map((q) => (q.id === originalQuestion.id ? originalQuestion : q))
      );
      setUpdatingQuestionId(null);
      alert(err instanceof Error ? err.message : "Failed to update question");
    }
  };

  // Delete question
  const handleDelete = async (question: Question360) => {
    if (
      !confirm(
        `Are you sure you want to delete this question: "${question.questionEnglishText}"?`
      )
    ) {
      return;
    }

    try {
      await questions360Service.deleteQuestion(question.id);
      await fetchQuestions();
      alert("Question deleted successfully!");
    } catch (err) {
      console.error("❌ Error deleting question:", err);
      alert(err instanceof Error ? err.message : "Failed to delete question");
    }
  };

  // Toggle question active status with optimistic updates
  const handleToggleActive = async (question: Question360) => {
    const newActiveStatus = !question.isActive;
    const originalQuestion = question;

    // Optimistically update the UI
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === question.id ? { ...q, isActive: newActiveStatus } : q
      )
    );
    setUpdatingQuestionId(question.id);

    try {
      if (newActiveStatus) {
        await questions360Service.activateQuestion(question.id);
      } else {
        await questions360Service.deactivateQuestion(question.id);
      }
      setUpdatingQuestionId(null);
    } catch (err) {
      console.error("❌ Error toggling question status:", err);
      // Revert the optimistic update on failure
      setQuestions((prev) =>
        prev.map((q) => (q.id === question.id ? originalQuestion : q))
      );
      setUpdatingQuestionId(null);
      alert(
        err instanceof Error ? err.message : "Failed to update question status"
      );
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      questionEnglishText: "",
      questionSpanishText: "",
      category: "",
      relationType: "Parent",
      questionNumber: 1,
      isSubQuestion: false,
      parentQuestionId: "",
    });
  };

  // Start editing
  const startEdit = (question: Question360) => {
    setEditingQuestion(question);
    setFormData({
      questionEnglishText: question.questionEnglishText,
      questionSpanishText: question.questionSpanishText,
      category: question.category,
      relationType: question.relationType,
      questionNumber: question.questionNumber,
      isSubQuestion: question.isSubQuestion,
      parentQuestionId: question.parentQuestionId || "",
    });
    setShowCreateModal(true);
  };

  // Cancel editing - updated for Dialog component
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      cancelEdit();
    }
    setShowCreateModal(open);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingQuestion(null);
    resetForm();
    setShowCreateModal(false);
    // If Dialog uses onOpenChange, ensure it closes
    if (typeof handleDialogOpenChange === "function") {
      handleDialogOpenChange(false);
    }
  };

  // Filter questions
  const filteredQuestions = (Array.isArray(questions) ? questions : []).filter(
    (question) => {
      // Relation Type filter
      if (
        filters.relationType !== "all" &&
        question.relationType !== filters.relationType
      ) {
        return false;
      }

      // Category filter
      if (
        filters.category !== "all" &&
        question.category !== filters.category
      ) {
        return false;
      }

      // Active status filter
      if (filters.isActive !== "all") {
        const isActive = filters.isActive === "true";
        if (question.isActive !== isActive) {
          return false;
        }
      }

      return true;
    }
  );

  // Debug filter changes
  useEffect(() => {
    console.log("Filters changed:", filters);
    console.log("Total questions:", questions.length);
    console.log("Filtered questions:", filteredQuestions.length);
  }, [filters, questions.length, filteredQuestions.length]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const { t } = useTranslation();

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t("admin.questions.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {t("admin.questions.header")}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {t("admin.questions.manageSummary", {
              count: Array.isArray(questions) ? questions.length : 0,
            })}
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-red-600 hover:bg-red-700"
        >
          {t("admin.questions.add")}
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          {t("admin.questions.filters.title")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="relation-type-filter"
              className="text-xs font-medium text-gray-700"
            >
              {t("admin.questions.filters.relationType")}
            </Label>
            <Select
              value={filters.relationType}
              onValueChange={(value) =>
                setFilters({ ...filters, relationType: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={t("admin.questions.filters.allTypes")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("admin.questions.filters.allTypes")}
                </SelectItem>
                {RELATION_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="category-filter"
              className="text-xs font-medium text-gray-700"
            >
              Category
            </Label>
            <Select
              value={filters.category}
              onValueChange={(value) =>
                setFilters({ ...filters, category: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORY_OPTIONS.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="status-filter"
              className="text-xs font-medium text-gray-700"
            >
              {t("admin.questions.filters.status")}
            </Label>
            <Select
              value={filters.isActive}
              onValueChange={(value) =>
                setFilters({ ...filters, isActive: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={t("admin.questions.filters.allStatus")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("admin.questions.filters.allStatus")}
                </SelectItem>
                <SelectItem value="true">
                  {t("admin.questions.filters.active")}
                </SelectItem>
                <SelectItem value="false">
                  {t("admin.questions.filters.inactive")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {(filters.relationType !== "all" ||
          filters.category !== "all" ||
          filters.isActive !== "all") && (
          <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setFilters({
                  relationType: "all",
                  category: "all",
                  isActive: "all",
                })
              }
              className="text-red-600 hover:text-red-700 h-auto p-0"
            >
              {t("admin.questions.filters.clear")}
            </Button>
            <span className="text-xs text-gray-500">
              Showing {filteredQuestions.length} of{" "}
              {Array.isArray(questions) ? questions.length : 0} questions
            </span>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="text-red-400 mr-3">❌</div>
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchQuestions}
                className="text-red-800 hover:text-red-900 mt-2 h-auto p-0"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Questions</h3>
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 text-4xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {Array.isArray(questions) && questions.length === 0
                ? "No questions yet"
                : "No matching questions"}
            </h3>
            <p className="text-gray-600 mb-4">
              {Array.isArray(questions) && questions.length === 0
                ? "Create your first 360° evaluation question to get started."
                : "Try adjusting your filters to see more questions."}
            </p>
            {Array.isArray(questions) && questions.length === 0 && (
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                Create First Question
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredQuestions.map((question) => (
              <div
                key={question.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          question.relationType === "Parent" &&
                            "bg-blue-100 text-blue-800",
                          question.relationType === "Teacher" &&
                            "bg-green-100 text-green-800",
                          question.relationType === "Self" &&
                            "bg-purple-100 text-purple-800",
                          question.relationType === "Other" &&
                            "bg-gray-100 text-gray-800"
                        )}
                      >
                        {question.relationType}
                      </span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        {question.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        #{question.questionNumber}
                      </span>
                      {question.isSubQuestion && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                          Sub-Question
                        </span>
                      )}
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          question.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        )}
                      >
                        {question.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {question.questionEnglishText}
                    </h4>
                    {question.questionSpanishText && (
                      <p className="text-gray-600 text-sm mb-2 italic">
                        🇪🇸 {question.questionSpanishText}
                      </p>
                    )}
                    <div className="text-xs text-gray-500">
                      Created:{" "}
                      {new Date(question.createdAt).toLocaleDateString()}
                      {question.updatedAt !== question.createdAt && (
                        <span className="ml-2">
                          • Updated:{" "}
                          {new Date(question.updatedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(question)}
                      disabled={updatingQuestionId === question.id}
                      className={cn(
                        "text-xs",
                        question.isActive
                          ? "text-red-800 border-red-200 hover:bg-red-50"
                          : "text-green-800 border-green-200 hover:bg-green-50",
                        updatingQuestionId === question.id &&
                          "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {updatingQuestionId === question.id
                        ? "Updating..."
                        : question.isActive
                        ? "Deactivate"
                        : "Activate"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(question)}
                      disabled={updatingQuestionId === question.id}
                      className={cn(
                        "text-xs text-blue-800 border-blue-200 hover:bg-blue-50",
                        updatingQuestionId === question.id &&
                          "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {updatingQuestionId === question.id
                        ? "Updating..."
                        : "Edit"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(question)}
                      disabled={updatingQuestionId === question.id}
                      className={cn(
                        "text-xs text-red-800 border-red-200 hover:bg-red-50",
                        updatingQuestionId === question.id &&
                          "opacity-50 cursor-not-allowed"
                      )}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateModal} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingQuestion ? "Edit Question" : "Create New Question"}
            </DialogTitle>
            <DialogDescription>
              {editingQuestion
                ? "Update the question details below."
                : "Fill in the details to create a new 360° evaluation question."}
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={editingQuestion ? handleUpdate : handleCreate}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="relationType">Relation Type *</Label>
                <Select
                  value={formData.relationType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, relationType: value as any })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relation type" />
                  </SelectTrigger>
                  <SelectContent>
                    {RELATION_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      ...CATEGORY_OPTIONS,
                      ...(formData.category &&
                      !CATEGORY_OPTIONS.includes(formData.category)
                        ? [formData.category]
                        : []),
                    ].map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="questionEnglishText">
                English Question Text *
              </Label>
              <Textarea
                id="questionEnglishText"
                value={formData.questionEnglishText}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    questionEnglishText: e.target.value,
                  })
                }
                required
                placeholder="Enter the question in English..."
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="questionSpanishText">Spanish Question Text</Label>
              <Textarea
                id="questionSpanishText"
                value={formData.questionSpanishText}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    questionSpanishText: e.target.value,
                  })
                }
                placeholder="Enter the question in Spanish (optional)..."
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="questionNumber">Question Number *</Label>
                <Input
                  id="questionNumber"
                  type="number"
                  value={formData.questionNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      questionNumber: parseInt(e.target.value) || 1,
                    })
                  }
                  required
                  min={1}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentQuestion">
                  Parent Question (if sub-question)
                </Label>
                <Select
                  value={formData.parentQuestionId || "none"}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      parentQuestionId: value === "none" ? "" : value,
                      isSubQuestion: value !== "none" && !!value,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="None (Main Question)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Main Question)</SelectItem>
                    {(Array.isArray(questions) ? questions : [])
                      .filter(
                        (q) => !q.isSubQuestion && q.id !== editingQuestion?.id
                      )
                      .map((question) => (
                        <SelectItem key={question.id} value={question.id}>
                          {question.questionEnglishText.substring(0, 50)}...
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isSubQuestion"
                checked={formData.isSubQuestion}
                onChange={(e) =>
                  setFormData({ ...formData, isSubQuestion: e.target.checked })
                }
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <Label htmlFor="isSubQuestion" className="text-sm">
                This is a sub-question
              </Label>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={cancelEdit}>
                Cancel
              </Button>
              <Button type="submit" className="bg-red-600 hover:bg-red-700">
                {editingQuestion ? "Update Question" : "Create Question"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
