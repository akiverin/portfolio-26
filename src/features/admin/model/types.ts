export type ColumnDef = {
  key: string;
  label: string;
  width?: string;
  minWidth?: string;
  sortable?: boolean;
  editable?: boolean;
  type?: 'text' | 'number' | 'timestamp' | 'image' | 'url' | 'email' | 'badges';
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
};

export type AdminOption = {
  value: string;
  label: string;
  color?: string;
  icon?: string;
};

export type FieldDef = {
  key: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'url' | 'email' | 'select' | 'date' | 'multiselect';
  required?: boolean;
  placeholder?: string;
  options?: AdminOption[];
  asyncOptions?: string;
};

export type SectionConfig = {
  key: string;
  label: string;
  collection: string;
  columns: ColumnDef[];
  fields: FieldDef[];
  icon: string;
};
