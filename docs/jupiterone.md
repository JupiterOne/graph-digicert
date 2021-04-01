# JupiterOne Managed Integration for DigiCert

## Overview

JupiterOne provides a managed integration for DigiCert. The integration connects
directly to DigiCert REST APIs to obtain certificate details.

## DigiCert + JupiterOne Integration Benefits

- Visualize DigiCert users and certificates in the JupiterOne graph.
- Map DigiCert certificates to the domains using them.
- Monitor changes DigiCert users and certificates using JupiterOne alerts.
- Monitor changes to DigiCert users and certificates using JupiterOne alerts.

## How it Works

- JupiterOne periodically fetches DigiCert certificates and users to update the graph.
- Write JupiterOne queries to review and monitor updates to the graph.
- Configure alerts to take action when the JupiterOne graph changes.

## Requirements

- JupiterOne requires an API Key configured in your DigiCert account. 
- You must have permission in JupiterOne to install new integrations.

## Integration Instance Configuration

The integration is triggered by an event containing the information for a
specific integration instance. Users configure the integration by providing API
credentials obtained through the DigiCert CertCentral account.

DigiCert documentation provides detailed [instructions to enable API access][1].

## Entities

The following entity resources are ingested when the integration runs.

| DigiCert Resources | \_type of the Entity   | \_class of the Entity |
| ------------------ | ---------------------- | --------------------- |
| Account            | `digicert_account`     | `Account`             |
| Certificate        | `digicert_certificate` | `Certificate`         |
| User               | `digicert_user`        | `User`                |

## Relationships

The following relationships are created:

| From               | Relationship | To                     |
| ------------------ | ------------ | ---------------------- |
| `digicert_account` | **HAS**      | `digicert_certificate` |
| `digicert_account` | **HAS**      | `digicert_user`        |

The following relationships are mapped:

| From     | Relationship | To            |
| -------- | ------------ | ------------- |
| `Domain` | **HAS**      | `Certificate` |

[1]: https://www.digicert.com/rest-api/
