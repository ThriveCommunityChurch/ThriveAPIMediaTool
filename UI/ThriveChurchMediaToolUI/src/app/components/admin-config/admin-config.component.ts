import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ConfigService } from '../../services/config.service';
import { ToastService } from '../../services/toast-service.service';
import { ThemeService } from '../../services/theme.service';
import { AuthenticationService } from '../../services/authentication.service';
import { ConfigurationResponse } from '../../DTO/ConfigurationResponse';
import { ConfigType, getConfigTypeDisplayName, getConfigTypeIcon } from '../../DTO/ConfigType';
import { SetConfigRequest } from '../../DTO/SetConfigRequest';
import { ConfigurationMap } from '../../DTO/ConfigurationMap';

/**
 * Interface for grouping configurations by type
 */
interface ConfigGroup {
  type: ConfigType;
  displayName: string;
  icon: string;
  configs: ConfigurationResponse[];
}

/**
 * Interface for edit/add form state
 */
interface ConfigFormState {
  isEditing: boolean;
  isAdding: boolean;
  editingKey: string | null;
  formKey: string;
  formValue: string;
  formType: ConfigType;
  originalKey: string | null;
}

@Component({
  selector: 'app-admin-config',
  templateUrl: './admin-config.component.html',
  styleUrls: ['./admin-config.component.scss'],
  standalone: false
})
export class AdminConfigComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Loading state
  isLoading = false;
  
  // Configuration data
  allConfigs: ConfigurationResponse[] = [];
  configGroups: ConfigGroup[] = [];
  
  // Form state
  formState: ConfigFormState = {
    isEditing: false,
    isAdding: false,
    editingKey: null,
    formKey: '',
    formValue: '',
    formType: ConfigType.Misc,
    originalKey: null
  };
  
  // Delete confirmation state
  deleteConfirmKey: string | null = null;
  isDeleting = false;
  
  // Saving state
  isSaving = false;
  
  // Form validation errors
  formErrors: { [key: string]: string } = {};
  
  // Theme
  resolvedTheme$: Observable<string>;
  
  // Expose ConfigType enum to template
  ConfigType = ConfigType;

  constructor(
    private configService: ConfigService,
    private toastService: ToastService,
    private themeService: ThemeService,
    private authService: AuthenticationService
  ) {
    this.resolvedTheme$ = this.themeService.resolvedTheme$;
  }

  ngOnInit(): void {
    this.loadConfigs();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load all configurations from the API
   */
  loadConfigs(): void {
    if (this.isLoading) return;

    this.isLoading = true;
    this.allConfigs = [];
    this.configGroups = [];

    this.configService.getAllConfigs().subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.status === 200 && response.body) {
          this.allConfigs = response.body.Configs || [];
          this.groupConfigsByType();          
        } else {
          this.toastService.showError('Failed to load configurations. Please try again.');
        }
      },
      error: (error) => {
        this.isLoading = false;
        
        let errorMessage = 'An error occurred while loading configurations.';
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
   * Group configurations by ConfigType
   */
  /**
   * Convert string type name to ConfigType enum value
   */
  private parseConfigType(typeValue: any): ConfigType {
    if (typeof typeValue === 'number') {
      return typeValue as ConfigType;
    }

    // Convert string to enum
    const typeString = (typeValue as string).toLowerCase();
    switch (typeString) {
      case 'phone':
        return ConfigType.Phone;
      case 'email':
        return ConfigType.Email;
      case 'link':
        return ConfigType.Link;
      case 'misc':
        return ConfigType.Misc;
      case 'social':
        return ConfigType.Social;
      default:
        return ConfigType.Misc; // Default fallback
    }
  }

  /**
   * Convert ConfigType enum to string for API
   */
  private configTypeToString(type: ConfigType): string {
    switch (type) {
      case ConfigType.Phone:
        return 'Phone';
      case ConfigType.Email:
        return 'Email';
      case ConfigType.Link:
        return 'Link';
      case ConfigType.Misc:
        return 'Misc';
      case ConfigType.Social:
        return 'Social';
      default:
        return 'Misc';
    }
  }

  groupConfigsByType(): void {
    this.configGroups = [];

    // Create groups for each ConfigType
    const types = [
      ConfigType.Email,
      ConfigType.Phone,
      ConfigType.Link,
      ConfigType.Social,
      ConfigType.Misc
    ];

    types.forEach(type => {
      // Parse and filter configs by type
      const configs = this.allConfigs.filter(c => {
        const configType = this.parseConfigType(c.Type);
        return configType === type;
      });

      if (configs.length > 0) {
        this.configGroups.push({
          type: type,
          displayName: getConfigTypeDisplayName(type),
          icon: getConfigTypeIcon(type),
          configs: configs.sort((a, b) => a.Key.localeCompare(b.Key))
        });
      }
    });
  }

  /**
   * Start adding a new configuration
   */
  startAdd(type: ConfigType): void {
    this.formState = {
      isEditing: false,
      isAdding: true,
      editingKey: null,
      formKey: '',
      formValue: '',
      formType: type,
      originalKey: null
    };
    this.formErrors = {};
  }

  /**
   * Start adding a new configuration (without pre-selected type)
   */
  startAddConfig(): void {
    this.formState = {
      isEditing: false,
      isAdding: true,
      editingKey: null,
      formKey: '',
      formValue: '',
      formType: ConfigType.Misc, // Default to Misc
      originalKey: null
    };
    this.formErrors = {};
  }

  /**
   * Start editing an existing configuration
   */
  startEdit(config: ConfigurationResponse): void {
    this.formState = {
      isEditing: true,
      isAdding: false,
      editingKey: config.Key,
      formKey: config.Key,
      formValue: config.Value,
      formType: this.parseConfigType(config.Type),
      originalKey: config.Key
    };
    this.formErrors = {};
  }

  /**
   * Cancel add/edit operation
   */
  cancelForm(): void {
    this.formState = {
      isEditing: false,
      isAdding: false,
      editingKey: null,
      formKey: '',
      formValue: '',
      formType: ConfigType.Misc,
      originalKey: null
    };
    this.formErrors = {};
  }

  /**
   * Validate the form
   */
  validateForm(): boolean {
    this.formErrors = {};
    let isValid = true;

    // Validate key
    if (!this.formState.formKey || this.formState.formKey.trim() === '') {
      this.formErrors['key'] = 'Key is required';
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(this.formState.formKey)) {
      this.formErrors['key'] = 'Key can only contain letters, numbers, and underscores';
      isValid = false;
    } else if (this.formState.isAdding) {
      // Check for duplicate key when adding
      const existingConfig = this.allConfigs.find(c => c.Key === this.formState.formKey);
      if (existingConfig) {
        this.formErrors['key'] = 'A configuration with this key already exists';
        isValid = false;
      }
    }

    // Validate value
    if (!this.formState.formValue || this.formState.formValue.trim() === '') {
      this.formErrors['value'] = 'Value is required';
      isValid = false;
    }

    return isValid;
  }

  /**
   * Save the configuration (add or edit)
   */
  saveConfig(): void {
    if (this.isSaving) return;

    if (!this.validateForm()) {
      this.toastService.showError('Please fix the validation errors');
      return;
    }

    this.isSaving = true;

    const configMap: ConfigurationMap = {
      Key: this.formState.formKey.trim(),
      Value: this.formState.formValue.trim(),
      Type: this.formState.formType
    };

    const request: SetConfigRequest = {
      Configurations: [configMap]
    };

    this.configService.setConfigValues(request).subscribe({
      next: (response) => {
        this.isSaving = false;
        
        if (response.status === 200) {
          const action = this.formState.isAdding ? 'added' : 'updated';
          this.toastService.showSuccess(`Configuration ${action} successfully`);
          
          // Reload configurations
          this.cancelForm();
          this.loadConfigs();
        } else {
          this.toastService.showError('Failed to save configuration. Please try again.');
        }
      },
      error: (error) => {
        this.isSaving = false;
        
        let errorMessage = 'An error occurred while saving the configuration.';
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
   * Show delete confirmation
   */
  confirmDelete(key: string): void {
    this.deleteConfirmKey = key;
  }

  /**
   * Cancel delete operation
   */
  cancelDelete(): void {
    this.deleteConfirmKey = null;
  }

  /**
   * Delete a configuration
   */
  deleteConfig(key: string): void {
    if (this.isDeleting) return;

    this.isDeleting = true;

    this.configService.deleteConfig(key).subscribe({
      next: (response) => {
        this.isDeleting = false;
        this.deleteConfirmKey = null;
        
        if (response.status === 200) {
          this.toastService.showSuccess('Configuration deleted successfully');
          
          // Reload configurations
          this.loadConfigs();
        } else {
          this.toastService.showError('Failed to delete configuration. Please try again.');
        }
      },
      error: (error) => {
        this.isDeleting = false;
        this.deleteConfirmKey = null;
        
        let errorMessage = 'An error occurred while deleting the configuration.';
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
   * Check if a config is currently being edited
   */
  isConfigBeingEdited(key: string): boolean {
    return this.formState.isEditing && this.formState.editingKey === key;
  }

  /**
   * Check if a config group has an active add form
   */
  isGroupAddingConfig(type: ConfigType): boolean {
    return this.formState.isAdding && this.formState.formType === type;
  }

  /**
   * Get icon for config type
   */
  getConfigIcon(type: ConfigType | string): string {
    const configType = this.parseConfigType(type);
    switch (configType) {
      case ConfigType.Email:
        return 'fa-envelope';
      case ConfigType.Phone:
        return 'fa-phone';
      case ConfigType.Link:
        return 'fa-link';

      case ConfigType.Social:
        return 'fa-share-alt';
      case ConfigType.Misc:
        return 'fa-cog';
      default:
        return 'fa-cog';
    }
  }

  /**
   * Get display name for config type
   */
  getConfigTypeName(type: ConfigType | string): string {
    const configType = this.parseConfigType(type);
    switch (configType) {
      case ConfigType.Email:
        return 'Email';
      case ConfigType.Phone:
        return 'Phone';
      case ConfigType.Link:
        return 'Link';
      case ConfigType.Social:
        return 'Social';
      case ConfigType.Misc:
        return 'Misc';
      default:
        return 'Unknown';
    }
  }
}

