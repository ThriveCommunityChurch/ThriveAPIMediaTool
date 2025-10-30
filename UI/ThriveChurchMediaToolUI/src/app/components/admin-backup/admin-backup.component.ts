import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { ApiService } from '../../services/api-service.service';
import { ToastService } from '../../services/toast-service.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-admin-backup',
  templateUrl: './admin-backup.component.html',
  styleUrls: ['./admin-backup.component.scss'],
  standalone: false
})
export class AdminBackupComponent implements OnInit {
  // Export state
  isExporting = false;
  exportData: any = null;
  exportDate: Date | null = null;

  // Import state
  isImporting = false;
  importFile: File | null = null;
  importFileName: string = '';
  importResult: any = null;
  
  // File input validation
  fileError: string = '';

  // Theme
  resolvedTheme$: Observable<string>;

  constructor(
    private apiService: ApiService,
    private toastService: ToastService,
    private themeService: ThemeService,
    private router: Router
  ) {
    this.resolvedTheme$ = this.themeService.resolvedTheme$;
  }

  ngOnInit(): void {
    // Component initialization
  }

  /**
   * Export all sermon data as JSON
   */
  exportData_Click(): void {
    if (this.isExporting) return;

    this.isExporting = true;
    this.exportData = null;
    this.exportDate = null;
    this.fileError = '';

    this.apiService.exportSermonData().subscribe({
      next: (response) => {
        this.isExporting = false;
        
        if (response.status === 200 && response.body) {
          this.exportData = response.body;
          this.exportDate = new Date();
          
          // Automatically download the file
          this.downloadExportFile();
          
          this.toastService.showSuccess(
            `Successfully exported ${response.body.TotalSeries} series with ${response.body.TotalMessages} messages`
          );
        } else {
          this.toastService.showError('Failed to export sermon data. Please try again.');
        }
      },
      error: (error) => {
        this.isExporting = false;
        
        let errorMessage = 'An error occurred while exporting sermon data.';
        if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        this.toastService.showError(errorMessage);
      }
    });
  }

  /**
   * Download the exported data as a JSON file
   */
  downloadExportFile(): void {
    if (!this.exportData) return;

    const dataStr = JSON.stringify(this.exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    // Create filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `thrive-sermon-backup-${timestamp}.json`;
    
    // Create download link and trigger download
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(dataBlob);
    downloadLink.download = filename;
    downloadLink.click();
    
    // Clean up
    URL.revokeObjectURL(downloadLink.href);
  }

  /**
   * Handle file selection for import
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file type
      if (!file.name.endsWith('.json')) {
        this.fileError = 'Please select a valid JSON file';
        this.importFile = null;
        this.importFileName = '';
        return;
      }
      
      // Validate file size (max 50MB)
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes
      if (file.size > maxSize) {
        this.fileError = 'File size exceeds 50MB limit';
        this.importFile = null;
        this.importFileName = '';
        return;
      }
      
      this.importFile = file;
      this.importFileName = file.name;
      this.fileError = '';
      this.importResult = null;
    }
  }

  /**
   * Clear the selected import file
   */
  clearImportFile(): void {
    this.importFile = null;
    this.importFileName = '';
    this.fileError = '';
    this.importResult = null;
    
    // Reset file input
    const fileInput = document.getElementById('importFileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  /**
   * Import sermon data from selected JSON file
   */
  importData_Click(): void {
    if (this.isImporting || !this.importFile) return;

    this.isImporting = true;
    this.importResult = null;
    this.fileError = '';

    // Read the file content
    const reader = new FileReader();
    
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const fileContent = e.target?.result as string;
        const importData = JSON.parse(fileContent);
        
        // Validate the import data structure
        if (!importData.Series || !Array.isArray(importData.Series)) {
          this.fileError = 'Invalid backup file format. Missing or invalid Series array.';
          this.isImporting = false;
          return;
        }
        
        // Send import request to API
        this.apiService.importSermonData(importData).subscribe({
          next: (response) => {
            this.isImporting = false;
            
            if (response.status === 200 && response.body) {
              this.importResult = response.body;
              
              const successMessage = `Import completed: ${response.body.TotalSeriesUpdated} series and ${response.body.TotalMessagesUpdated} messages updated`;
              
              if (response.body.TotalSeriesSkipped > 0 || response.body.TotalMessagesSkipped > 0) {
                this.toastService.showWarning(
                  `${successMessage}. ${response.body.TotalSeriesSkipped + response.body.TotalMessagesSkipped} items skipped.`
                );
              } else {
                this.toastService.showSuccess(successMessage);
              }
              
              // Clear the file input after successful import
              this.clearImportFile();
            } else {
              this.toastService.showError('Failed to import sermon data. Please try again.');
            }
          },
          error: (error) => {
            this.isImporting = false;
            
            let errorMessage = 'An error occurred while importing sermon data.';
            if (error.error && typeof error.error === 'string') {
              errorMessage = error.error;
            } else if (error.message) {
              errorMessage = error.message;
            }
            
            this.toastService.showError(errorMessage);
          }
        });
        
      } catch (error) {
        this.isImporting = false;
        this.fileError = 'Failed to parse JSON file. Please ensure the file is valid JSON.';
        this.toastService.showError('Invalid JSON file format');
      }
    };
    
    reader.onerror = () => {
      this.isImporting = false;
      this.fileError = 'Failed to read file';
      this.toastService.showError('Failed to read the selected file');
    };
    
    reader.readAsText(this.importFile);
  }
}

