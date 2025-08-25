'use client';

import { useState, useEffect, FormEvent } from 'react';

type UnassignedDevice = {
  macAddress: string;
};

type Room = {
  id: string;
  name: string;
};

enum SensorType {
  SMOKE = 'SMOKE',
  HEAT = 'HEAT',
  BREAKING_GLASS = 'BREAKING_GLASS',
}

export default function AssignDeviceModal({ onClose }: { onClose: () => void }) {
  const [unassignedDevices, setUnassignedDevices] = useState<UnassignedDevice[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedMac, setSelectedMac] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedType, setSelectedType] = useState<SensorType>(SensorType.SMOKE);

  useEffect(() => {
    const fetchUnassigned = fetch('/api/unassigned-devices').then((res) => res.json());
    const fetchRooms = fetch('/api/rooms').then((res) => res.json());

    Promise.all([fetchUnassigned, fetchRooms])
      .then(([unassignedData, roomsData]) => {
        setUnassignedDevices(unassignedData);
        setRooms(roomsData);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedMac || !selectedRoom) {
      alert('Please select a device and a room.');
      return;
    }

    try {
      const response = await fetch('/api/assign-device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          macAddress: selectedMac,
          roomId: selectedRoom,
          type: selectedType,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to assign device');
      }
      
      alert('Device assigned successfully!');
      onClose();
      window.location.reload();

    } catch (error) {
      console.error(error);
      // FIXED: Tambahkan pengecekan tipe error sebelum mengakses .message
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert('An unknown error occurred');
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Assign New Sensor</h2>
        {unassignedDevices.length === 0 ? (
          <p>No new unassigned devices found. Please turn on a new sensor.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">New Device (MAC Address)</label>
              <select
                value={selectedMac}
                onChange={(e) => setSelectedMac(e.target.value)}
                className="shadow border rounded w-full py-2 px-3 text-gray-700"
                required
              >
                <option value="">-- Select a new device --</option>
                {unassignedDevices.map((d) => (
                  <option key={d.macAddress} value={d.macAddress}>{d.macAddress}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Assign to Room</label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="shadow border rounded w-full py-2 px-3 text-gray-700"
                required
              >
                <option value="">-- Select a room --</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Sensor Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as SensorType)}
                className="shadow border rounded w-full py-2 px-3 text-gray-700"
              >
                <option value={SensorType.SMOKE}>Smoke Detector</option>
                <option value={SensorType.HEAT}>Heat Detector</option>
                <option value={SensorType.BREAKING_GLASS}>Breaking Glass</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button type="button" onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                Cancel
              </button>
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Assign Device
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
