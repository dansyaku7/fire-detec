"use client";

import React, { useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, PlusCircle, Trash2, Edit, Save, X, Loader2 } from "lucide-react";
import AddRoomModal from "./AddRoomModal";
import { Room, SensorData } from "@/types";

interface MonitoringTableProps {
  rooms: Room[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Normal":
      return <Badge variant="default" className="bg-green-100 text-green-800">Normal</Badge>;
    case "Wildfire":
      return <Badge variant="destructive">Wildfire</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const MonitoringTable: React.FC<MonitoringTableProps> = ({ rooms, isLoading, error, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // --- State untuk mengelola mode edit ---
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [editedData, setEditedData] = useState({ name: "", floor: "" });
  const [isSaving, setIsSaving] = useState(false);

  // --- Fungsi untuk memulai mode edit ---
  const handleEditClick = (room: Room) => {
    setEditingRoomId(room.id);
    setEditedData({ name: room.name, floor: room.floor });
  };

  // --- Fungsi untuk membatalkan edit ---
  const handleCancelClick = () => {
    setEditingRoomId(null);
  };

  // --- Fungsi untuk menyimpan perubahan ---
  const handleSaveClick = async (roomId: string) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedData),
      });
      if (!response.ok) throw new Error('Failed to save changes');
      onRefresh();
      setEditingRoomId(null);
    } catch (err) {
      console.error(err);
      alert("Error saving changes. Please check the console.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Fungsi untuk menghapus ruangan ---
  const handleDeleteClick = async (roomId: string) => {
    if (window.confirm("Are you sure you want to delete this room? All associated sensors will also be deleted.")) {
      try {
        const response = await fetch(`/api/rooms/${roomId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete room');
        onRefresh();
      } catch (err) {
        console.error(err);
        alert("Error deleting room. Please check the console.");
      }
    }
  };

  const renderTableBody = () => {
    if (isLoading && rooms.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={9} className="text-center">
            <div className="flex justify-center items-center p-4">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading Data...
            </div>
          </TableCell>
        </TableRow>
      );
    }
    // ... (kode error dan no rooms found tetap sama)

    return rooms.map((room: Room) => {
      const isEditing = editingRoomId === room.id;
      const smokeStatus = room.sensors.find((s) => s.type === "SMOKE")?.status || "N/A";
      const heatSensor = room.sensors.find((s) => s.type === "HEAT");
      const lastHeatData = heatSensor?.data?.[0]; // Ambil data pertama karena API sudah mengurutkan
      const heatDisplay = lastHeatData ? `${lastHeatData.value.toFixed(1)}°C` : heatSensor?.status || "N/A";
      const glassStatus = room.sensors.find((s) => s.type === "BREAKING_GLASS")?.status || "N/A";

      return (
        <TableRow key={room.id} className={isEditing ? "bg-blue-50" : ""}>
          <TableCell className="font-medium">{room.name.replace(/\./g, "")}</TableCell>
          <TableCell>
            {isEditing ? (
              <Input value={editedData.name} onChange={(e) => setEditedData({ ...editedData, name: e.target.value })} className="bg-white" />
            ) : ( room.name )}
          </TableCell>
          <TableCell>
            {isEditing ? (
              <Input value={editedData.floor} onChange={(e) => setEditedData({ ...editedData, floor: e.target.value })} className="bg-white" />
            ) : ( room.floor )}
          </TableCell>
          <TableCell>{smokeStatus}</TableCell>
          <TableCell>{heatDisplay}</TableCell>
          <TableCell>{glassStatus}</TableCell>
          <TableCell>{getStatusBadge(room.overallStatus)}</TableCell>
          <TableCell>{room.information}</TableCell>
          <TableCell>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button size="icon" onClick={() => handleSaveClick(room.id)} disabled={isSaving}>
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleCancelClick}>
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="icon" onClick={() => handleEditClick(room)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(room.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
    <>
      <AddRoomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRoomAdded={onRefresh} />
      <Card className="rounded-lg shadow">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <CardTitle>Table Monitoring</CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search Rooms..." className="pl-8" />
              </div>
              <Button onClick={() => setIsModalOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Room
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Rooms</TableHead>
                <TableHead>Rooms</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Smoke Detector</TableHead>
                <TableHead>Heat Detector</TableHead>
                <TableHead>Breaking Glass</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Information</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{renderTableBody()}</TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default MonitoringTable;
