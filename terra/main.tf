
# Input Variables
# -----------------------------------------------------------------------------------------------------------

variable "region" {
  type = string
  description = "AWS Hosting Region"
  default = "us-east-1"
}

variable "site" {
  type = string
  description = "The name of the site"
  default = "twipped"
}

variable "domain" {
  type = string
  description = "The base domain name of the site that all these belong to."
  default = "twipped.com"
}

variable "subdomains" {
    type = list
    default = [
        "www",
        "t"
    ]
}


# Providers
# -----------------------------------------------------------------------------------------------------------

terraform {
  required_version = ">= 0.13"

  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
}

provider "aws" {
   region = var.region
}

# Site DNS Zone and extra domains
# -----------------------------------------------------------------------------------------------------------

# aws_route53_zone.zone
resource "aws_route53_zone" "zone" {
  name = var.domain

  tags = {
    Site = var.site
    Category = "DNS"
  }
}

# aws_route53_record.mail_exchange
resource "aws_route53_record" "mail_exchange" {
  zone_id = aws_route53_zone.zone.zone_id
  name    = ""
  type    = "MX"
  ttl     = 86400

  records = [
    "1 ASPMX.L.GOOGLE.COM",
    "5 ALT1.ASPMX.L.GOOGLE.COM",
    "5 ALT2.ASPMX.L.GOOGLE.COM",
    "10 ALT3.ASPMX.L.GOOGLE.COM",
    "10 ALT4.ASPMX.L.GOOGLE.COM",
  ]
}

# aws_route53_record.google_mail_secure
resource "aws_route53_record" "google_mail_secure" {
  zone_id = aws_route53_zone.zone.zone_id
  name    = ""
  type    = "SPF"
  ttl     = 86400

  records = [
    "v=spf1 include:_spf.google.com ~all"
  ]
}

# aws_route53_record.dkim
resource "aws_route53_record" "dkim" {
  zone_id = aws_route53_zone.zone.zone_id
  name    = "google._domainkey"
  type    = "TXT"
  ttl     = 300

  records = [
    "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAq7hhHAO7E0X2SdkcdGqrMd2+gkxbBnm1akIWL9Jhq7qYYQGen7dcDXaPMx1BPzAI7FG7+3ArOKU6jqsA+YNLn6FQvWF/6LWztmTCnurDYQkZXHgCDi91H7T3u4GIalPjVB1clHkCND0c6DB1O0\"\"mGQlJy9XlgILrVHrCkJTCCQ+4p8MiDxWhwpQapwGvTbaQym+Xi0AKwnCSblTQApj7Qxl/zKpuSK3mb1L7nubEtjg2nYLOlFUy+8vk+gIveH5UD5D5xub2l9F7rBDfhi/YnnTGSMlTsDDlnlmIsCxWtd7tKEJ/r8fHSQ+CJemWPzNa3mLig+xhFLmXV4QuxwB2G5QIDAQAB",
  ]
}


# -----------------------------------------------------------------------------------------------------------
# SSL Certificate

# aws_acm_certificate.cert
resource "aws_acm_certificate" "cert" {
  domain_name       = var.domain
  validation_method = "DNS"

  subject_alternative_names = [
    "www.${var.domain}",
    "t.${var.domain}",
    "lifespark.${var.domain}",
  ]

  tags = {
    Name = "Site Certificate"
    Site = var.site
    Category = "SSL"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# aws_route53_record.cert_validation
resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = aws_route53_zone.zone.id
}

resource "aws_acm_certificate_validation" "cert" {
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}



# Index Redirect Lambda
# -----------------------------------------------------------------------------------------------------------
module "index_redirect" {
  source = "./index_redirect"

  site = var.site
}
