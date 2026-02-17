import { motion } from 'motion/react';
import { dashboardData } from './data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Filter, MoreHorizontal, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OpportunitiesTableProps {
  className?: string;
}

export function OpportunitiesTable({ className }: OpportunitiesTableProps) {
  const { opportunities } = dashboardData;
  const { t } = useTranslation();

  const getStatusConfig = (status: string, color: string) => {
    const configs = {
      green: {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/50',
        dot: 'bg-emerald-500'
      },
      blue: {
        badge: 'bg-blue-50 text-blue-700 border-blue-200/50',
        dot: 'bg-blue-500'
      },
      red: {
        badge: 'bg-rose-50 text-rose-700 border-rose-200/50',
        dot: 'bg-rose-500'
      },
      gray: { // Fallback
        badge: 'bg-gray-50 text-gray-700 border-gray-200/50',
        dot: 'bg-gray-500'
      }
    };
    return configs[color as keyof typeof configs] || configs.gray;
  };

  const renderStars = (rating: number) => {
    return (
      <div
        className="flex items-center gap-0.5"
        role="img"
        aria-label={`${rating} out of 5 stars`}
      >
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={cn(
              "text-sm transition-colors duration-300",
              i < rating ? "text-amber-400" : "text-gray-200"
            )}
            aria-hidden="true"
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white rounded-xl border border-gray-100 shadow-sm w-full overflow-hidden flex flex-col h-full",
        className
      )}
      aria-labelledby="opportunities-heading"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-50">
        <div>
          <h2 id="opportunities-heading" className="text-xl font-bold text-gray-900 tracking-tight">
            {t("dashboard.opportunities")}
          </h2>
          <p className="text-sm text-gray-500 mt-1">Review and manage your current opportunities.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-4 text-xs font-medium border-gray-200 text-gray-700 hover:text-gray-900 hover:border-gray-300 transition-all shadow-sm"
          aria-label={t("transactions.filter")}
        >
          <Filter className="w-3.5 h-3.5 mr-2" />
          <span>{t("transactions.filter")}</span>
        </Button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b border-gray-100">
              <TableHead className="w-[80px] font-semibold text-gray-600 pl-6 h-12 text-xs uppercase tracking-wider">No.</TableHead>
              <TableHead className="font-semibold text-gray-600 h-12 text-xs uppercase tracking-wider">Cat no.</TableHead>
              <TableHead className="font-semibold text-gray-600 h-12 text-xs uppercase tracking-wider">Driver</TableHead>
              <TableHead className="font-semibold text-gray-600 h-12 text-xs uppercase tracking-wider">Status</TableHead>
              <TableHead className="font-semibold text-gray-600 h-12 text-xs uppercase tracking-wider">Rating</TableHead>
              <TableHead className="text-right sr-only">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {opportunities.map((opportunity, index) => {
              const statusStyle = getStatusConfig(opportunity.status, opportunity.statusColor);
              return (
                <TableRow
                  key={opportunity.id}
                  className="group hover:bg-gray-50/50 border-b border-gray-50 last:border-0 transition-colors duration-200"
                >
                  <TableCell className="font-medium text-gray-500 pl-6 py-4">{opportunity.id}</TableCell>
                  <TableCell className="text-gray-700 font-medium py-4">{opportunity.catNo}</TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9 border border-gray-100 ring-2 ring-white shadow-sm">
                        <AvatarFallback className="bg-gradient-to-br from-blue-50 to-indigo-50 text-indigo-600 text-xs font-bold">
                          {opportunity.driver.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col max-w-[140px]">
                        <span className="text-sm font-semibold text-gray-900 truncate">
                          {opportunity.driver.name}
                        </span>
                        <span className="text-xs text-gray-500 truncate">Driver</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                      statusStyle.badge
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", statusStyle.dot)} />
                      {opportunity.status}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    {renderStars(opportunity.rating)}
                  </TableCell>
                  <TableCell className="text-right pr-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem className="text-gray-700 cursor-pointer">
                          <ArrowUpRight className="w-4 h-4 mr-2 text-gray-400" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </motion.section>
  );
}
