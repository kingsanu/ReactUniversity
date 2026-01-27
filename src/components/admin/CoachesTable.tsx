"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, Mail, Loader2, Calendar, Percent, Users, GraduationCap, Briefcase } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coach } from "@/types/coach";
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';


interface CoachesTableProps {
  onEdit?: (coach: Coach) => void;
}

export function CoachesTable({ onEdit }: CoachesTableProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [contractFilter, setContractFilter] = useState("all");
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchCoaches = async () => {
      setIsLoading(true);
      try {
        const { getAllCoachesAdmin } = await import("@/services/coachService");
        const response = await getAllCoachesAdmin({ page, limit, search: searchTerm });

        // Handle strict typing from CoachesResponse
        if (response?.data && Array.isArray(response.data)) {
          setCoaches(response.data);
          if (response.meta) {
            setTotalPages(response.meta.totalPages || Math.ceil(response.meta.total / limit) || 1);
          }
        } else {
          // Fallback for any other structure
          const anyResponse = response as any;
          if (Array.isArray(anyResponse)) {
            setCoaches(anyResponse);
            setTotalPages(1); // Assuming all data returned if array
          } else if (anyResponse?.data?.data && Array.isArray(anyResponse.data.data)) {
            // Nested data structure handling
            setCoaches(anyResponse.data.data);
            // Check for meta object with total/totalPages
            const meta = anyResponse.data.meta;
            const total = meta?.total || anyResponse.data.total || anyResponse.total || anyResponse.data.data.length;
            setTotalPages(meta?.totalPages || Math.ceil(total / limit) || 1);
          } else {
            console.error("Unexpected API response format:", response);
            setCoaches([]);
          }
        }

      } catch (error) {
        console.error("Failed to fetch coaches:", error);
        toast.error(t('admin.coaches.loadingFailed'));
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchCoaches();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, page, refreshTrigger]); // Dependency on page and refreshTrigger added

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "pending":
      case "invited":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "inactive":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getContractStatus = (contractEnd?: string) => {
    if (!contractEnd) return null;

    const endDate = new Date(contractEnd);
    const today = new Date();
    const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysRemaining < 0) {
      return { label: t('admin.coaches.contractStatus.expired'), color: "bg-red-100 text-red-800 hover:bg-red-100", days: daysRemaining };
    } else {
      return { label: t('admin.coaches.contractStatus.daysLeft', { days: daysRemaining }), color: daysRemaining < 30 ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" : "bg-green-100 text-green-800 hover:bg-green-100", days: daysRemaining };
    }
  };

  const filteredCoaches = coaches.filter((coach) => {
    if (contractFilter === "all") return true;

    const status = getContractStatus(coach.contractEnd);
    if (contractFilter === "active" && status && status.days >= 30) return true;
    if (contractFilter === "expiring" && status && status.days >= 0 && status.days < 30) return true;
    if (contractFilter === "expired" && status && status.days < 0) return true;

    return false;
  });

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="sticky top-4 z-20 bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-sm rounded-2xl p-2 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select value={contractFilter} onValueChange={setContractFilter}>
            <SelectTrigger className="w-full md:w-[200px] h-11 bg-gray-50/50 border-transparent focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/10 rounded-xl transition-all">
              <SelectValue placeholder={t('admin.coaches.filterByContract')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin.coaches.filters.allContracts')}</SelectItem>
              <SelectItem value="active">{t('admin.coaches.filters.active')}</SelectItem>
              <SelectItem value="expiring">{t('admin.coaches.filters.expiring')}</SelectItem>
              <SelectItem value="expired">{t('admin.coaches.filters.expired')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <Input
            placeholder={t('admin.coaches.searchPlaceholder')}
            className="pl-10 h-11 bg-gray-50/50 border-transparent focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/10 rounded-xl transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b border-gray-100">
              <TableHead className="py-4 pl-6 font-semibold text-gray-900">{t('admin.coaches.table.coach')}</TableHead>
              <TableHead className="font-semibold text-gray-900">{t('admin.coaches.table.status')}</TableHead>
              <TableHead className="font-semibold text-gray-900">{t('admin.coaches.table.specialization')}</TableHead>
              <TableHead className="font-semibold text-gray-900">{t('admin.coaches.table.contractPeriod')}</TableHead>
              <TableHead className="font-semibold text-gray-900">{t('admin.coaches.table.contractStatus')}</TableHead>
              <TableHead className="font-semibold text-gray-900">{t('admin.coaches.table.platformFee')}</TableHead>
              <TableHead className="font-semibold text-gray-900">{t('admin.coaches.table.students')}</TableHead>
              <TableHead className="pr-6 text-right font-semibold text-gray-900">{t('admin.coaches.table.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-sm text-gray-500">{t('admin.coaches.loading')}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredCoaches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-lg font-medium text-gray-900">{t('admin.coaches.noCoaches')}</p>
                    <p className="text-sm text-gray-500">{t('admin.coaches.tryAdjustingFilters')}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredCoaches.map((coach) => {
                const contractStatus = getContractStatus(coach.contractEnd);
                return (
                  <TableRow key={coach.id} className="group hover:bg-gray-50/50 transition-colors border-gray-100">
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold border border-white shadow-sm">
                          {coach.image ? (
                            <img src={coach.image} alt={coach.name} className="h-full w-full rounded-full object-cover" />
                          ) : (
                            (coach.name || coach.fullName || "?").charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{coach.name || coach.fullName}</p>
                          <p className="text-xs text-gray-500">{coach.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${getStatusColor(coach.status)} border-0 px-2.5 py-0.5 rounded-md font-medium capitalize shadow-none`}
                        role="status"
                        aria-label={`Status: ${coach.status || t('common.unknown')}`}
                      >
                        {coach.status || t('common.unknown')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600 font-medium">{coach.specialization || "—"}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs text-gray-500">
                        <span>{coach.contractStart ? new Date(coach.contractStart).toLocaleDateString() : "—"}</span>
                        <span className="text-gray-300">{t('common.to')}</span>
                        <span>{coach.contractEnd ? new Date(coach.contractEnd).toLocaleDateString() : "—"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {contractStatus ? (
                        <Badge
                          className={`${contractStatus.color} border-0 px-2.5 py-0.5 rounded-md font-medium shadow-none`}
                          role="status"
                          aria-label={`Contract status: ${contractStatus.label}`}
                        >
                          {contractStatus.label}
                        </Badge>
                      ) : (
                        <span className="text-sm text-gray-400" aria-label="No contract status">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-gray-900">
                        {typeof coach.platformCommission === 'number' ? `${coach.platformCommission}%` : "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-gray-900">{coach.activeStudents || 0}</span>
                        <span className="text-xs text-gray-500">{t('admin.coaches.studentsActive')}</span>
                      </div>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                            aria-label={`Actions for ${coach.name || coach.fullName}`}
                          >
                            <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 shadow-xl border-gray-100">
                          <DropdownMenuLabel className="px-2 py-1.5 text-xs text-gray-500 font-normal">{t('common.actions')}</DropdownMenuLabel>
                          <DropdownMenuItem
                            className="rounded-lg cursor-pointer focus:bg-gray-50"
                            onClick={() => {
                              if (coach.email) {
                                navigator.clipboard.writeText(coach.email);
                                toast.success(t('admin.coaches.toast.emailCopied'));
                              }
                            }}
                          >
                            {t('admin.coaches.actions.copyEmail')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-gray-100 my-1" />
                          <DropdownMenuItem
                            className="rounded-lg cursor-pointer focus:bg-gray-50"
                            onClick={() => {
                              setSelectedCoach(coach);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            {t('admin.coaches.actions.viewDetails')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="rounded-lg cursor-pointer focus:bg-gray-50"
                            onClick={() => onEdit?.(coach)}
                          >
                            {t('admin.coaches.actions.editCoach')}
                          </DropdownMenuItem>
                          {coach.status === "invited" && (
                            <DropdownMenuItem
                              className="rounded-lg cursor-pointer text-blue-600 focus:text-blue-700 focus:bg-blue-50"
                              onClick={async () => {
                                if (!coach.email) return;
                                try {
                                  const { inviteCoach } = await import("@/services/coachService");
                                  await inviteCoach({ email: coach.email });
                                  toast.success(t('admin.coaches.toast.invitationResent'));
                                } catch (error) {
                                  toast.error(t('admin.coaches.toast.failedToResend'));
                                }
                              }}
                            >
                              <Mail className="mr-2 h-4 w-4" />
                              {t('admin.coaches.actions.resendInvite')}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="rounded-lg cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                            onClick={async () => {
                              if (!confirm(t('Are you sure you want to deactivate this coach?'))) return;
                              try {
                                const { deactivateCoach } = await import("@/services/coachService");
                                await deactivateCoach(coach.id);
                                toast.success("Coach deactivated");
                                setRefreshTrigger(prev => prev + 1);
                              } catch (error) {
                                toast.error("Failed to deactivate coach");
                              }
                            }}
                          >
                            {t('admin.coaches.actions.deactivate')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-100 p-4 bg-gray-50/30">
          <p className="text-sm text-gray-500">
            {t('common.showingPage', { page, totalPages: totalPages || 1, defaultValue: `Showing page ${page} of ${totalPages || 1}` })}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
              className="rounded-lg border-gray-200 hover:bg-white hover:text-gray-900 text-gray-500 h-8"
            >
              {t("common.previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isLoading}
              className="rounded-lg border-gray-200 hover:bg-white hover:text-gray-900 text-gray-500 h-8"
            >
              {t("common.next")}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0 overflow-hidden rounded-2xl">
          {selectedCoach && (
            <div className="flex flex-col">
              {/* Header with background */}
              <div className="bg-slate-50 border-b border-gray-100 p-6 flex items-start gap-4">
                <div className="h-20 w-20 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-3xl font-bold text-gray-400 overflow-hidden shrink-0">
                  {selectedCoach.image ? (
                    <img src={selectedCoach.image} alt={selectedCoach.name} className="h-full w-full object-cover" />
                  ) : (
                    (selectedCoach.name || selectedCoach.fullName || "?").charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <DialogTitle className="text-xl font-bold text-gray-900">{selectedCoach.name || selectedCoach.fullName}</DialogTitle>
                      <DialogDescription className="text-gray-500 mt-0.5 text-sm">
                        {selectedCoach.email}
                      </DialogDescription>
                    </div>
                    <Badge
                      className={`${getStatusColor(selectedCoach.status)} border-0 px-3 py-1 rounded-full font-medium capitalize shadow-none`}
                    >
                      {selectedCoach.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 mt-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-gray-200/60 shadow-sm">
                      <Briefcase className="h-3.5 w-3.5 text-gray-400" />
                      {selectedCoach.title || "Coach"}
                    </span>
                    {selectedCoach.specialization && (
                      <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-gray-200/60 shadow-sm">
                        <GraduationCap className="h-3.5 w-3.5 text-gray-400" />
                        {selectedCoach.specialization}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Contract Period */}
                  <div className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <span className="font-medium text-gray-900 text-sm">{t('admin.coaches.table.contractPeriod')}</span>
                    </div>
                    <div className="pl-[52px]">
                      <div className="text-sm font-semibold text-gray-900">
                        {selectedCoach.contractStart ? new Date(selectedCoach.contractStart).toLocaleDateString() : "—"}
                        <span className="mx-2 text-gray-400 font-normal">{t('common.to')}</span>
                        {selectedCoach.contractEnd ? new Date(selectedCoach.contractEnd).toLocaleDateString() : "—"}
                      </div>
                      {getContractStatus(selectedCoach.contractEnd)?.days !== undefined && (
                        <div className={`mt-1.5 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getContractStatus(selectedCoach.contractEnd)?.color}`}>
                          {getContractStatus(selectedCoach.contractEnd)?.label}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Platform Fee */}
                  <div className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-green-50 text-green-600">
                        <Percent className="h-4 w-4" />
                      </div>
                      <span className="font-medium text-gray-900 text-sm">{t('admin.coaches.table.platformFee')}</span>
                    </div>
                    <div className="pl-[52px]">
                      <p className="text-2xl font-bold tracking-tight text-gray-900">
                        {typeof selectedCoach.platformCommission === 'number' ? `${selectedCoach.platformCommission}%` : "—"}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">Commission rate</p>
                    </div>
                  </div>

                  {/* Active Students */}
                  <div className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                        <Users className="h-4 w-4" />
                      </div>
                      <span className="font-medium text-gray-900 text-sm">{t('admin.coaches.table.students')}</span>
                    </div>
                    <div className="pl-[52px]">
                      <p className="text-2xl font-bold tracking-tight text-gray-900">{selectedCoach.activeStudents || 0}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{t('admin.coaches.studentsActive')}</p>
                    </div>
                  </div>
                </div>

                {selectedCoach.bio && (
                  <div className="rounded-xl bg-gray-50 p-4 border border-gray-100/50">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Bio</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{selectedCoach.bio}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
