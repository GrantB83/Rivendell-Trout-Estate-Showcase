import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import Papa from 'papaparse';
import { File, Upload } from 'lucide-react';

interface GuestData {
  name: string;
  surname: string;
  booking_number: string;
  cottage_name: string;
  contact_number: string;
  check_in_date: string;
  check_out_date: string;
}

export const GuestImport = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const validateGuestData = (data: any): GuestData | null => {
    const required = ['name', 'surname', 'booking_number', 'cottage_name', 'contact_number', 'check_in_date', 'check_out_date'];
    
    for (const field of required) {
      if (!data[field] || data[field].toString().trim() === '') {
        return null;
      }
    }

    // Validate dates
    const checkIn = new Date(data.check_in_date);
    const checkOut = new Date(data.check_out_date);
    
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return null;
    }

    if (checkOut <= checkIn) {
      return null;
    }

    // Format phone number
    let phone = data.contact_number.toString().replace(/\s+/g, '');
    if (phone.startsWith('0')) {
      phone = '+27' + phone.substring(1);
    } else if (!phone.startsWith('+27')) {
      phone = '+27' + phone;
    }

    return {
      name: data.name.toString().trim(),
      surname: data.surname.toString().trim(),
      booking_number: data.booking_number.toString().trim(),
      cottage_name: data.cottage_name.toString().trim(),
      contact_number: phone,
      check_in_date: checkIn.toISOString().split('T')[0],
      check_out_date: checkOut.toISOString().split('T')[0]
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const extension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (extension === 'csv' || extension === 'xlsx' || extension === 'xls') {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please select a CSV or Excel file');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setMessage('');
    setError('');

    try {
      if (file.name.endsWith('.csv')) {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: async (results) => {
            await processData(results.data);
          },
          error: (error) => {
            setError('Error parsing CSV: ' + error.message);
            setLoading(false);
          }
        });
      } else {
        setError('Excel files not yet supported. Please convert to CSV format.');
        setLoading(false);
      }
    } catch (err) {
      setError('Error processing file: ' + (err as Error).message);
      setLoading(false);
    }
  };

  const processData = async (data: any[]) => {
    try {
      const validGuests: GuestData[] = [];
      const errors: string[] = [];

      data.forEach((row, index) => {
        const guestData = validateGuestData(row);
        if (guestData) {
          validGuests.push(guestData);
        } else {
          errors.push(`Row ${index + 2}: Invalid or missing data`);
        }
      });

      if (errors.length > 0) {
        setError(`Found ${errors.length} invalid rows. Please check your data.`);
        setLoading(false);
        return;
      }

      // Insert/update guests using upsert
      const { data: result, error: dbError } = await supabase
        .from('guests')
        .upsert(validGuests, { 
          onConflict: 'booking_number',
          ignoreDuplicates: false 
        });

      if (dbError) {
        setError('Database error: ' + dbError.message);
      } else {
        setMessage(`Successfully imported ${validGuests.length} guest records`);
        setFile(null);
        // Reset file input
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    } catch (err) {
      setError('Error saving data: ' + (err as Error).message);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file-input">Upload Guest Data (CSV)</Label>
        <Input
          id="file-input"
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
        />
        <p className="text-sm text-muted-foreground">
          CSV should contain columns: name, surname, booking_number, cottage_name, contact_number, check_in_date, check_out_date
        </p>
      </div>

      {file && (
        <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
          <File className="h-4 w-4" />
          <span className="text-sm">{file.name}</span>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={handleUpload}
        disabled={!file || loading}
        className="w-full"
      >
        {loading ? (
          'Processing...'
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Import Guests
          </>
        )}
      </Button>
    </div>
  );
};