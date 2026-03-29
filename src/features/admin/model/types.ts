export type ColumnDef = {
  key: string;
  label: string;
  width?: string;
  minWidth?: string;
  sortable?: boolean;
  editable?: boolean;
  type?: 'text' | 'number' | 'timestamp' | 'image' | 'url' | 'email';
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
};

export type FieldDef = {
  key: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'url' | 'email' | 'select' | 'date' | 'multiselect';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
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
