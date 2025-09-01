import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Upload, FileText, CheckCircle, AlertCircle, Users, Calendar, MapPin, Phone, DollarSign } from 'lucide-react';
import Papa from 'papaparse';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CSVRow {
  [key: string]: string;
}

interface ProcessedGuest {
  name: string;
  surname: string;
  booking_number: string;
  cottage_name: string;
  contact_number: string;
  check_in_date: string;
  check_out_date: string;
  total_amount?: number;
  marketing_consent?: boolean;
  rowIndex: number;
  errors: string[];
  warnings: string[];
}

interface ImportStats {
  total: number;
  processed: number;
  success: number;
  errors: number;
  warnings: number;
  duplicates: number;
}

interface ColumnMapping {
  [csvColumn: string]: string;
}

interface ImportSettings {
  updateExisting: boolean;
  batchSize: number;
  defaultCottage: string;
  defaultMarketingConsent: boolean;
  skipInvalidRows: boolean;
}

const FIELD_MAPPINGS = {
  name: { label: 'First Name', required: true, icon: Users },
  surname: { label: 'Last Name', required: true, icon: Users },
  booking_number: { label: 'Booking Number', required: true, icon: FileText },
  cottage_name: { label: 'Cottage Name', required: true, icon: MapPin },
  contact_number: { label: 'Phone Number', required: true, icon: Phone },
  check_in_date: { label: 'Check-in Date', required: true, icon: Calendar },
  check_out_date: { label: 'Check-out Date', required: true, icon: Calendar },
  total_amount: { label: 'Total Amount', required: false, icon: DollarSign },
};

const COTTAGE_OPTIONS = [
  'Bag End', 'Hobbiton', 'Elvinbrook', 'Bucklebury', 'Mirkwood', 'Old Stone House'
];

export const EnhancedGuestImport = () => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'mapping' | 'preview' | 'import' | 'complete'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
  const [processedData, setProcessedData] = useState<ProcessedGuest[]>([]);
  const [importStats, setImportStats] = useState<ImportStats>({
    total: 0, processed: 0, success: 0, errors: 0, warnings: 0, duplicates: 0
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [importSettings, setImportSettings] = useState<ImportSettings>({
    updateExisting: true,
    batchSize: 50,
    defaultCottage: '',
    defaultMarketingConsent: false,
    skipInvalidRows: true,
  });
  const [savedMappings, setSavedMappings] = useState<any[]>([]);
  const { toast } = useToast();

  // Load saved column mappings
  React.useEffect(() => {
    loadSavedMappings();
  }, []);

  const loadSavedMappings = async () => {
    try {
      const { data, error } = await supabase
        .from('import_column_mappings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setSavedMappings(data);
      }
    } catch (error) {
      console.error('Error loading saved mappings:', error);
    }
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB limit)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size must be less than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    
    // Parse CSV
    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      transform: (value: string) => value.trim(),
      complete: (results) => {
        if (results.errors.length > 0) {
          toast({
            title: "CSV parsing error",
            description: `Error parsing CSV: ${results.errors[0].message}`,
            variant: "destructive",
          });
          return;
        }

        setCsvData(results.data as CSVRow[]);
        setCsvHeaders(results.meta.fields || []);
        
        // Auto-detect column mappings
        const autoMapping = autoDetectMapping(results.meta.fields || []);
        setColumnMapping(autoMapping);
        
        setCurrentStep('mapping');
        
        toast({
          title: "File uploaded successfully",
          description: `Loaded ${results.data.length} rows from CSV file.`,
        });
      },
      error: (error) => {
        toast({
          title: "Upload failed",
          description: `Error reading file: ${error.message}`,
          variant: "destructive",
        });
      }
    });
  }, [toast]);

  const autoDetectMapping = (headers: string[]): ColumnMapping => {
    const mapping: ColumnMapping = {};
    const lowerHeaders = headers.map(h => h.toLowerCase());
    
    // Auto-detect common patterns
    const patterns: { [key: string]: string[] } = {
      name: ['first name', 'firstname', 'given name', 'name', 'guest name'],
      surname: ['last name', 'lastname', 'surname', 'family name'],
      booking_number: ['booking', 'booking number', 'booking ref', 'reference', 'booking id'],
      cottage_name: ['cottage', 'cottage name', 'accommodation', 'room', 'unit'],
      contact_number: ['phone', 'contact', 'mobile', 'telephone', 'phone number', 'contact number'],
      check_in_date: ['check in', 'checkin', 'arrival', 'start date', 'check-in'],
      check_out_date: ['check out', 'checkout', 'departure', 'end date', 'check-out'],
      total_amount: ['amount', 'total', 'price', 'cost', 'total amount', 'value'],
    };

    Object.entries(patterns).forEach(([field, fieldPatterns]) => {
      const matchedHeader = headers.find((header, index) => 
        fieldPatterns.some(pattern => lowerHeaders[index].includes(pattern))
      );
      if (matchedHeader) {
        mapping[matchedHeader] = field;
      }
    });

    return mapping;
  };

  const validateAndProcessData = useCallback(() => {
    const processed: ProcessedGuest[] = [];
    
    csvData.forEach((row, index) => {
      const guest: ProcessedGuest = {
        name: '',
        surname: '',
        booking_number: '',
        cottage_name: '',
        contact_number: '',
        check_in_date: '',
        check_out_date: '',
        rowIndex: index + 2, // +2 for header and 1-based indexing
        errors: [],
        warnings: [],
      };

      // Map CSV columns to guest fields
      Object.entries(columnMapping).forEach(([csvColumn, guestField]) => {
        if (guestField && row[csvColumn]) {
          (guest as any)[guestField] = row[csvColumn].trim();
        }
      });

      // Validate required fields
      Object.entries(FIELD_MAPPINGS).forEach(([field, config]) => {
        if (config.required && !(guest as any)[field]) {
          guest.errors.push(`${config.label} is required`);
        }
      });

      // Validate and format phone number (South African format)
      if (guest.contact_number) {
        const formattedPhone = formatSouthAfricanPhone(guest.contact_number);
        if (formattedPhone) {
          guest.contact_number = formattedPhone;
        } else {
          guest.errors.push('Invalid phone number format');
        }
      }

      // Validate dates
      if (guest.check_in_date) {
        const checkInDate = parseDate(guest.check_in_date);
        if (checkInDate) {
          guest.check_in_date = checkInDate.toISOString().split('T')[0];
        } else {
          guest.errors.push('Invalid check-in date format');
        }
      }

      if (guest.check_out_date) {
        const checkOutDate = parseDate(guest.check_out_date);
        if (checkOutDate) {
          guest.check_out_date = checkOutDate.toISOString().split('T')[0];
        } else {
          guest.errors.push('Invalid check-out date format');
        }
      }

      // Validate date logic
      if (guest.check_in_date && guest.check_out_date) {
        if (new Date(guest.check_in_date) >= new Date(guest.check_out_date)) {
          guest.errors.push('Check-out date must be after check-in date');
        }
      }

      // Validate cottage name
      if (guest.cottage_name && !COTTAGE_OPTIONS.includes(guest.cottage_name)) {
        if (importSettings.defaultCottage) {
          guest.cottage_name = importSettings.defaultCottage;
          guest.warnings.push(`Used default cottage: ${importSettings.defaultCottage}`);
        } else {
          guest.errors.push(`Invalid cottage name: ${guest.cottage_name}`);
        }
      }

      // Parse total amount
      if (row[Object.keys(columnMapping).find(k => columnMapping[k] === 'total_amount') || '']) {
        const amountStr = row[Object.keys(columnMapping).find(k => columnMapping[k] === 'total_amount') || ''];
        const amount = parseFloat(amountStr.replace(/[^\d.-]/g, ''));
        if (!isNaN(amount)) {
          guest.total_amount = amount;
        }
      }

      // Set default marketing consent
      guest.marketing_consent = importSettings.defaultMarketingConsent;

      processed.push(guest);
    });

    setProcessedData(processed);
    setCurrentStep('preview');

    const stats: ImportStats = {
      total: processed.length,
      processed: 0,
      success: 0,
      errors: processed.filter(g => g.errors.length > 0).length,
      warnings: processed.filter(g => g.warnings.length > 0).length,
      duplicates: 0,
    };
    setImportStats(stats);

    toast({
      title: "Data processed",
      description: `${processed.length} rows processed. ${stats.errors} errors found.`,
    });
  }, [csvData, columnMapping, importSettings, toast]);

  const executeImport = async () => {
    setIsProcessing(true);
    setCurrentStep('import');
    
    const validGuests = importSettings.skipInvalidRows 
      ? processedData.filter(g => g.errors.length === 0)
      : processedData;

    const stats: ImportStats = {
      total: validGuests.length,
      processed: 0,
      success: 0,
      errors: 0,
      warnings: 0,
      duplicates: 0,
    };

    try {
      // Process in batches
      for (let i = 0; i < validGuests.length; i += importSettings.batchSize) {
        const batch = validGuests.slice(i, i + importSettings.batchSize);
        
        for (const guest of batch) {
          try {
            const guestData = {
              name: guest.name,
              surname: guest.surname,
              booking_number: guest.booking_number,
              cottage_name: guest.cottage_name,
              contact_number: guest.contact_number,
              check_in_date: guest.check_in_date,
              check_out_date: guest.check_out_date,
              total_amount: guest.total_amount,
              marketing_consent: guest.marketing_consent,
            };

            if (importSettings.updateExisting) {
              // Use upsert to handle duplicates
              const { error } = await supabase
                .from('guests')
                .upsert(guestData, { 
                  onConflict: 'contact_number,booking_number',
                  ignoreDuplicates: false 
                });

              if (error) throw error;
            } else {
              // Insert only new records
              const { error } = await supabase
                .from('guests')
                .insert(guestData);

              if (error) {
                if (error.code === '23505') { // Unique constraint violation
                  stats.duplicates++;
                } else {
                  throw error;
                }
              }
            }

            stats.success++;
          } catch (error) {
            console.error(`Error importing guest ${guest.name} ${guest.surname}:`, error);
            stats.errors++;
          }

          stats.processed++;
          setImportStats({ ...stats });
        }

        // Small delay between batches to prevent overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setCurrentStep('complete');
      
      toast({
        title: "Import completed",
        description: `Successfully imported ${stats.success} guests with ${stats.errors} errors.`,
      });

    } catch (error) {
      console.error('Import failed:', error);
      toast({
        title: "Import failed",
        description: "An error occurred during import. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatSouthAfricanPhone = (phone: string): string | null => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // South African phone number patterns
    if (cleaned.match(/^27[0-9]{9}$/)) {
      return `+${cleaned}`;
    } else if (cleaned.match(/^0[0-9]{9}$/)) {
      return `+27${cleaned.substring(1)}`;
    } else if (cleaned.match(/^[0-9]{9}$/)) {
      return `+27${cleaned}`;
    }
    
    return null;
  };

  const parseDate = (dateStr: string): Date | null => {
    // Try multiple date formats
    const formats = [
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // MM/DD/YYYY or DD/MM/YYYY
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/, // YYYY-MM-DD
      /^(\d{1,2})-(\d{1,2})-(\d{4})$/, // MM-DD-YYYY or DD-MM-YYYY
    ];

    for (const format of formats) {
      const match = dateStr.match(format);
      if (match) {
        const [, part1, part2, part3] = match;
        
        // Try different interpretations
        const dates = [
          new Date(parseInt(part3), parseInt(part1) - 1, parseInt(part2)), // MM/DD/YYYY
          new Date(parseInt(part3), parseInt(part2) - 1, parseInt(part1)), // DD/MM/YYYY
          new Date(parseInt(part1), parseInt(part2) - 1, parseInt(part3)), // YYYY-MM-DD
        ];

        for (const date of dates) {
          if (!isNaN(date.getTime()) && date.getFullYear() > 2000 && date.getFullYear() < 2030) {
            return date;
          }
        }
      }
    }

    return null;
  };

  const saveMappingTemplate = async () => {
    const mappingName = prompt('Enter a name for this mapping template:');
    if (!mappingName) return;

    try {
      const { error } = await supabase
        .from('import_column_mappings')
        .insert({
          mapping_name: mappingName,
          column_mappings: columnMapping,
        });

      if (error) throw error;

      toast({
        title: "Mapping saved",
        description: `Mapping template "${mappingName}" saved successfully.`,
      });

      loadSavedMappings();
    } catch (error) {
      toast({
        title: "Failed to save mapping",
        description: "Could not save the mapping template.",
        variant: "destructive",
      });
    }
  };

  const loadMappingTemplate = (mappingId: string) => {
    const mapping = savedMappings.find(m => m.id === mappingId);
    if (mapping) {
      setColumnMapping(mapping.column_mappings);
      toast({
        title: "Mapping loaded",
        description: `Loaded mapping template "${mapping.mapping_name}".`,
      });
    }
  };

  const resetImport = () => {
    setCurrentStep('upload');
    setFile(null);
    setCsvData([]);
    setCsvHeaders([]);
    setColumnMapping({});
    setProcessedData([]);
    setImportStats({ total: 0, processed: 0, success: 0, errors: 0, warnings: 0, duplicates: 0 });
    setIsProcessing(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'upload':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload Guest Data</h3>
              <p className="text-muted-foreground mb-4">
                Upload a CSV file containing guest booking information
              </p>
            </div>
            
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <FileText className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm font-medium">Choose CSV file</span>
                <span className="text-xs text-muted-foreground">Max 10MB</span>
              </label>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Required columns:</strong> First Name, Last Name, Booking Number, Cottage Name, Phone Number, Check-in Date, Check-out Date
                <br />
                <strong>Supported date formats:</strong> MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD
              </AlertDescription>
            </Alert>
          </div>
        );

      case 'mapping':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Column Mapping</h3>
                <p className="text-muted-foreground">Map CSV columns to guest data fields</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={saveMappingTemplate}>
                  Save Mapping
                </Button>
              </div>
            </div>

            {savedMappings.length > 0 && (
              <div className="space-y-2">
                <Label>Load Saved Mapping</Label>
                <Select onValueChange={loadMappingTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a saved mapping..." />
                  </SelectTrigger>
                  <SelectContent>
                    {savedMappings.map((mapping) => (
                      <SelectItem key={mapping.id} value={mapping.id}>
                        {mapping.mapping_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid gap-4">
        {Object.entries(FIELD_MAPPINGS).map(([field, config]) => {
                const IconComponent = config.icon;
                return (
                  <div key={field} className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 w-48">
                      <IconComponent className="h-4 w-4" />
                      <Label className="text-sm font-medium">
                        {config.label}
                        {config.required && <span className="text-destructive ml-1">*</span>}
                      </Label>
                    </div>
                    <Select
                      value={Object.keys(columnMapping).find(k => columnMapping[k] === field) || ''}
                      onValueChange={(value) => {
                        const newMapping = { ...columnMapping };
                        // Remove any existing mapping to this field
                        Object.keys(newMapping).forEach(k => {
                          if (newMapping[k] === field) delete newMapping[k];
                        });
                        // Add new mapping
                        if (value) newMapping[value] = field;
                        setColumnMapping(newMapping);
                      }}
                    >
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Select CSV column..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {csvHeaders.map((header) => (
                          <SelectItem key={header} value={header}>
                            {header}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-4">Import Settings</h4>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <Label>Update existing records</Label>
                  <Switch
                    checked={importSettings.updateExisting}
                    onCheckedChange={(checked) => 
                      setImportSettings(prev => ({ ...prev, updateExisting: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Skip invalid rows</Label>
                  <Switch
                    checked={importSettings.skipInvalidRows}
                    onCheckedChange={(checked) => 
                      setImportSettings(prev => ({ ...prev, skipInvalidRows: checked }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Default cottage (for invalid cottage names)</Label>
                  <Select
                    value={importSettings.defaultCottage}
                    onValueChange={(value) => 
                      setImportSettings(prev => ({ ...prev, defaultCottage: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select default cottage..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {COTTAGE_OPTIONS.map((cottage) => (
                        <SelectItem key={cottage} value={cottage}>
                          {cottage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Default marketing consent</Label>
                  <Switch
                    checked={importSettings.defaultMarketingConsent}
                    onCheckedChange={(checked) => 
                      setImportSettings(prev => ({ ...prev, defaultMarketingConsent: checked }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Batch size</Label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={importSettings.batchSize}
                    onChange={(e) => 
                      setImportSettings(prev => ({ ...prev, batchSize: parseInt(e.target.value) || 50 }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep('upload')}>
                Back
              </Button>
              <Button 
                onClick={validateAndProcessData}
                disabled={Object.entries(FIELD_MAPPINGS).some(([field, config]) => 
                  config.required && !Object.values(columnMapping).includes(field)
                )}
              >
                Process Data
              </Button>
            </div>
          </div>
        );

      case 'preview':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Data Preview</h3>
              <p className="text-muted-foreground">Review processed data before import</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{importStats.total}</div>
                  <div className="text-sm text-muted-foreground">Total Rows</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{importStats.total - importStats.errors}</div>
                  <div className="text-sm text-muted-foreground">Valid</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{importStats.errors}</div>
                  <div className="text-sm text-muted-foreground">Errors</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{importStats.warnings}</div>
                  <div className="text-sm text-muted-foreground">Warnings</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{importStats.duplicates}</div>
                  <div className="text-sm text-muted-foreground">Duplicates</div>
                </CardContent>
              </Card>
            </div>

            <div className="max-h-96 overflow-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-2 text-left">Row</th>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Phone</th>
                    <th className="p-2 text-left">Cottage</th>
                    <th className="p-2 text-left">Dates</th>
                    <th className="p-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {processedData.slice(0, 100).map((guest, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">{guest.rowIndex}</td>
                      <td className="p-2">{guest.name} {guest.surname}</td>
                      <td className="p-2">{guest.contact_number}</td>
                      <td className="p-2">{guest.cottage_name}</td>
                      <td className="p-2">{guest.check_in_date} - {guest.check_out_date}</td>
                      <td className="p-2">
                        {guest.errors.length > 0 && (
                          <Badge variant="destructive">Error</Badge>
                        )}
                        {guest.errors.length === 0 && guest.warnings.length > 0 && (
                          <Badge variant="secondary">Warning</Badge>
                        )}
                        {guest.errors.length === 0 && guest.warnings.length === 0 && (
                          <Badge variant="default">Valid</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {processedData.length > 100 && (
              <p className="text-sm text-muted-foreground">
                Showing first 100 rows. Total: {processedData.length} rows.
              </p>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep('mapping')}>
                Back to Mapping
              </Button>
              <Button 
                onClick={executeImport}
                disabled={importStats.errors > 0 && !importSettings.skipInvalidRows}
              >
                Start Import
              </Button>
            </div>
          </div>
        );

      case 'import':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Importing Data</h3>
              <p className="text-muted-foreground">Please wait while we import your guest data...</p>
            </div>

            <div className="space-y-4">
              <Progress value={(importStats.processed / importStats.total) * 100} />
              <div className="text-center text-sm text-muted-foreground">
                {importStats.processed} of {importStats.total} processed
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{importStats.success}</div>
                  <div className="text-sm text-muted-foreground">Successful</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{importStats.errors}</div>
                  <div className="text-sm text-muted-foreground">Errors</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{importStats.duplicates}</div>
                  <div className="text-sm text-muted-foreground">Duplicates</div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold">Import Complete</h3>
              <p className="text-muted-foreground">Your guest data has been successfully imported</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{importStats.total}</div>
                  <div className="text-sm text-muted-foreground">Total Processed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{importStats.success}</div>
                  <div className="text-sm text-muted-foreground">Successful</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{importStats.errors}</div>
                  <div className="text-sm text-muted-foreground">Errors</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{importStats.duplicates}</div>
                  <div className="text-sm text-muted-foreground">Duplicates</div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              <Button onClick={resetImport}>
                Import Another File
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Enhanced Guest Import</span>
        </CardTitle>
        
        {/* Progress Steps */}
        <div className="flex items-center mt-4">
          {['upload', 'mapping', 'preview', 'import', 'complete'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                currentStep === step 
                  ? 'bg-primary text-primary-foreground' 
                  : index < ['upload', 'mapping', 'preview', 'import', 'complete'].indexOf(currentStep)
                  ? 'bg-green-600 text-white'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {index + 1}
              </div>
              {index < 4 && <div className="w-8 h-px bg-muted ml-2" />}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {renderStepContent()}
      </CardContent>
    </Card>
  );
};