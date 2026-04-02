import { motion } from 'framer-motion';
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
import { Funnel, DotsThree, ArrowUpRight } from '@phosphor-icons/react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PremiumCard } from './PremiumCard';

interface Opportunity {
  id: string;
  catNo?: string;
  driver: { name: string; avatar?: string };
  status: string;
  statusColor: string;
  rating: number;
}

interface OpportunitiesTableProps {
  className?: string;
  opportunities?: Opportunity[];
}

export function OpportunitiesTable({ className, opportunities = [] }: OpportunitiesTableProps) {
  const { t } = useTranslation();

  const getStatusConfig = (status: string, color: string) => {
    const configs = {
      green: {
        badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200/50 shadow-sm',
        dot: 'bg-emerald-500'
      },
      blue: {
        badge: 'bg-indigo-50 text-indigo-700 border border-indigo-200/50 shadow-sm',
        dot: 'bg-indigo-500'
      },
      red: {
        badge: 'bg-rose-50 text-rose-700 border border-rose-200/50 shadow-sm',
        dot: 'bg-rose-500'
      },
      gray: {
        badge: 'bg-slate-50 text-slate-700 border border-slate-200/50 shadow-sm',
        dot: 'bg-slate-400'
      }
    };
    return configs[color as keyof typeof configs] || configs.gray;
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-1" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={cn("text-lg transition-colors duration-300", i < rating ? "text-amber-400" : "text-slate-200")} aria-hidden="true">★</span>
      ))}
    </div>
  );

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full w-full"
      aria-labelledby="opportunities-heading"
    >
      <PremiumCard className={className} innerClassName="flex flex-col p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-slate-100/80">
          <div>
            <h2 id="opportunities-heading" className="text-xl font-serif font-semibold text-slate-900 tracking-tight">
              {t("dashboard.opportunities")}
            </h2>
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">
              {t("dashboard.opportunitiesForYou", "Review and manage your current opportunities")}
            </p>
          </div>
          <button
            className="group flex items-center justify-between px-5 py-2.5 rounded-full font-medium transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] bg-slate-50 text-slate-900 border border-slate-200/50 hover:bg-slate-100"
            aria-label={t("transactions.filter")}
          >
            <Funnel weight="bold" className="w-4 h-4 mr-2 text-slate-500 group-hover:text-slate-900 transition-colors" />
            <span className="text-sm font-semibold tracking-tight">{t("transactions.filter")}</span>
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto rounded-b-[calc(2.25rem-0.375rem)] w-full">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                <TableHead className="w-[80px] font-bold text-slate-400 pl-8 h-12 text-[10px] uppercase tracking-widest">No.</TableHead>
                <TableHead className="font-bold text-slate-400 h-12 text-[10px] uppercase tracking-widest">Cat no.</TableHead>
                <TableHead className="font-bold text-slate-400 h-12 text-[10px] uppercase tracking-widest">Driver</TableHead>
                <TableHead className="font-bold text-slate-400 h-12 text-[10px] uppercase tracking-widest">Status</TableHead>
                <TableHead className="font-bold text-slate-400 h-12 text-[10px] uppercase tracking-widest">Rating</TableHead>
                <TableHead className="text-right sr-only">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {opportunities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                        <Funnel weight="duotone" className="w-5 h-5 text-slate-300" />
                      </div>
                      <p className="text-sm font-medium text-slate-400">{t("dashboard.opportunitiesForYou", "No opportunities yet")}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : opportunities.map((opportunity) => {
                const statusStyle = getStatusConfig(opportunity.status, opportunity.statusColor);
                return (
                  <TableRow
                    key={opportunity.id}
                    className="group hover:bg-slate-50/50 border-b border-slate-50 last:border-0 transition-colors duration-400"
                  >
                    <TableCell className="font-mono text-xs font-bold text-slate-400 pl-8 py-5 tracking-tighter">{opportunity.id}</TableCell>
                    <TableCell className="text-slate-900 font-bold py-5 text-sm">{opportunity.catNo}</TableCell>
                    <TableCell className="py-5">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-10 h-10 border border-slate-100 ring-2 ring-white shadow-sm">
                          <AvatarFallback className="bg-indigo-50 text-indigo-600 text-sm font-serif font-bold">
                            {opportunity.driver.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col max-w-[140px]">
                          <span className="text-sm font-semibold text-slate-900 truncate tracking-tight">{opportunity.driver.name}</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 truncate mt-0.5">Driver</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-5">
                      <div className={cn("inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest", statusStyle.badge)}>
                        <span className={cn("w-1.5 h-1.5 rounded-full mr-2", statusStyle.dot)} />
                        {opportunity.status}
                      </div>
                    </TableCell>
                    <TableCell className="py-5">{renderStars(opportunity.rating)}</TableCell>
                    <TableCell className="text-right pr-6 py-5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="h-8 w-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 shadow-none border-none opacity-0 group-hover:opacity-100 transition-all duration-300 ml-auto mr-2">
                            <DotsThree weight="bold" className="w-5 h-5" />
                            <span className="sr-only">Actions</span>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px] rounded-2xl p-2 border-slate-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]">
                          <DropdownMenuItem className="text-slate-700 cursor-pointer rounded-xl font-medium px-3 py-2.5 hover:bg-slate-50 focus:bg-slate-50">
                            <ArrowUpRight weight="bold" className="w-4 h-4 mr-2 text-slate-400" />
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
      </PremiumCard>
    </motion.section>
  );
}
