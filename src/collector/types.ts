export interface PaginationInput {
  limit: string;
  offset: string;
}

export interface PaginatedResponse {
  limit: number;
  offset: number;
  total: number;
}

export interface ListDomainResponse extends PaginatedResponse {
  domains: Domain[];
}

export interface Organization {
  id: number;
  status: string;
  name: string;
  display_name: string;
  is_active: string;
}

export interface Validation {
  type: string;
  name: string;
  description: string;
  date_created: string;
  validated_until: string;
  status: string;
}

export interface Container {
  id: number;
  parent_id: number;
  name: string;
  is_active: boolean;
}

export interface Domain {
  id: number;
  is_active: boolean;
  name: string;
  date_created: string;
  organization: Organization;
  validations: Validation[];
  dcv_method: string;
  dcv_expiration: { ov: string; ev: string };
  container: Container;
}
