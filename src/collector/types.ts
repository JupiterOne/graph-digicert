export interface PaginationInput {
  limit: string;
  offset: string;
}

export interface PaginatedResponse {
  limit: number;
  offset: number;
  total: number;
}

export interface DigiCertAccount {
  id: number;
  make_renewal_calls: boolean;
  express_install_enabled: boolean;
  admin_email: string; // comma separated strings
  display_rep: boolean;
  rep_name: string;
  rep_phone: string;
  rep_email: string;
  balance_negative_limit: number;
  pricing_model: string;
  cert_transparency: string;
  cert_central_type: string;
  primary_organization_name: string;
  primary_organization_country: string;
}

export interface ListDomainResponse extends PaginatedResponse {
  domains: DigiCertDomain[];
}

export interface ListOrderResponse extends PaginatedResponse {
  orders: DigiCertOrder[];
}

export interface ListUserResponse extends PaginatedResponse {
  users: DigiCertUser[];
}

export interface DigiCertOrganization {
  id: number;
  name: string;
  status: string;
  display_name: string;
  is_active: string;
}

export interface DigiCertUser {
  id: number;
  username: string;
  account_id: string;
  first_name: string;
  last_name: string;
  email: string;
  job_title: string;
  telephone: string;
  status: string;
  container: DigiCertContainer;
  access_roles: DigiCertAccessRole[];
  type: string;
  has_container_assignments: boolean;
}

export interface DigiCertAccessRole {
  id: number;
  name: string;
}

export interface DigiCertContainer {
  id: number;
  name: string;
  parent_id?: number;
  is_active?: boolean;
}

export interface DigiCertDomainValidation {
  type: string;
  name: string;
  description: string;
  date_created: string;
  validated_until: string;
  status: string;
}

export interface DigiCertDomain {
  id: number;
  is_active: boolean;
  name: string;
  date_created: string;
  organization: DigiCertOrganization;
  validations: DigiCertDomainValidation[];
  dcv_method: string;
  dcv_expiration: { ov: string; ev: string };
  container: DigiCertContainer;
}

export interface DigiCertCertificate {
  id: number;
  common_name: string;
  dns_names: string[];
  signature_hash: string;
  valid_till?: string;
  days_remaining?: number;
}

export interface DigiCertProduct {
  name_id: string;
  name: string;
  type: string;
}

export interface DigiCertOrder {
  id: number;
  certificate: DigiCertCertificate;
  status: string;
  is_renewed: boolean;
  date_created: string;
  organization: DigiCertOrganization;
  validity_years: number;
  disable_renewal_notifications: boolean;
  container: DigiCertContainer;
  product: DigiCertProduct;
  has_duplicates: boolean;
  product_name_id: string;
}
