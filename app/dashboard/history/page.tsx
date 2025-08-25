"use client";

import React from "react";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle, ShieldCheck, Wrench } from "lucide-react";
import Header from "../components/Header"; // Sesuaikan path jika perlu

// Definisikan tipe data untuk Log
interface Log {
  id: string;
  level: 'INFO' | 'WARNING' | 'CRITICAL' | 'MANUAL';
  message: string;
  timestamp: string;
  room: {
    name: string;
  };
}

// Fungsi fetcher untuk SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Helper untuk styling badge dan ikon
const getLogLevelAppearance = (level: Log['level']) => {
  switch (level) {
    case 'WARNING':
      return {
        badgeClass: "bg-yellow-100 text-yellow-800",
        icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
      };
    case 'CRITICAL':
      return {
        badgeClass: "bg-red-100 text-red-800",
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
      };
    case 'MANUAL':
        return {
          badgeClass: "bg-blue-100 text-blue-800",
          icon: <Wrench className="h-4 w-4 text-blue-500" />,
        };
    default: // INFO
      return {
        badgeClass: "bg-green-100 text-green-800",
        icon: <ShieldCheck className="h-4 w-4 text-green-500" />,
      };
  }
};

const HistoryPage = () => {
  const { data: logs, error, isLoading } = useSWR<Log[]>('/api/logs', fetcher, {
    refreshInterval: 5000 // Refresh setiap 5 detik
  });

  const renderTableBody = () => {
    if (isLoading) {
      return <TableRow><TableCell colSpan={4} className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></TableCell></TableRow>;
    }
    if (error) {
      return <TableRow><TableCell colSpan={4} className="text-center text-red-500 p-8">Failed to load logs.</TableCell></TableRow>;
    }
    if (!logs || logs.length === 0) {
      return <TableRow><TableCell colSpan={4} className="text-center p-8">No log history found.</TableCell></TableRow>;
    }

    return logs.map((log) => {
      const { badgeClass, icon } = getLogLevelAppearance(log.level);
      return (
        <TableRow key={log.id}>
          <TableCell className="w-12">{icon}</TableCell>
          <TableCell>
            <Badge className={badgeClass}>{log.level}</Badge>
          </TableCell>
          <TableCell className="font-medium">{log.message}</TableCell>
          <TableCell className="text-right text-gray-500">
            {new Date(log.timestamp).toLocaleString()}
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Header />
      <Card>
        <CardHeader>
          <CardTitle>Log & History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="text-right">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderTableBody()}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoryPage;
