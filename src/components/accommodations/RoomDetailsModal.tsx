import React from 'react';
import { Info, Bed, Bath } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface RoomDetail {
  room: string;
  bed: string;
  bathroom: string;
}

interface RoomDetailsModalProps {
  cottageName: string;
  roomingDetails: RoomDetail[];
  additionalInfo?: string;
}

const RoomDetailsModal = ({ cottageName, roomingDetails, additionalInfo }: RoomDetailsModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="ml-3 p-2">
          <Info className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-montserrat text-primary">
            {cottageName} - Room Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {roomingDetails.map((room, idx) => (
            <div key={idx} className="border-b border-border pb-4 last:border-b-0">
              <h4 className="font-semibold text-primary text-sm mb-2">{room.room}</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Bed className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{room.bed}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Bath className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{room.bathroom}</span>
                </div>
              </div>
            </div>
          ))}
          {additionalInfo && (
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm text-muted-foreground">
                <strong>Additional Info:</strong> {additionalInfo}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDetailsModal;