
# aws_s3_bucket.lifespark
resource "aws_s3_bucket" "lifespark" {
  bucket = var.domain
  acl    = "public-read"

  force_destroy = true

  website {
    index_document = "index.html"
    error_document = "index.html"
  }

  tags = {
    Name = "Lifespark Assets"
    Site = var.site
  }
}


#aws_route53_record.lifespark
resource "aws_route53_record" "lifespark" {
  name    = "lifespark.${var.domain}"
  zone_id = aws_route53_zone.zone.zone_id
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.lifespark.domain_name
    zone_id                = aws_cloudfront_distribution.lifespark.hosted_zone_id
    evaluate_target_health = false
  }
}


# aws_cloudfront_distribution.frontend
resource "aws_cloudfront_distribution" "lifespark" {
  origin {
    domain_name = aws_s3_bucket.lifespark.bucket_regional_domain_name
    origin_id   = "s3"

    custom_origin_config {
      origin_protocol_policy = "http-only"
      http_port = "80"
      https_port = "443"
      origin_ssl_protocols = ["SSLv3", "TLSv1", "TLSv1.1", "TLSv1.2"]
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  aliases = [
    "lifespark.${var.domain}"
  ]

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "s3"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
  }

  custom_error_response {
    error_code    = 403
    response_code = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code    = 404
    response_code = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn       = aws_acm_certificate.cert.arn
    ssl_support_method        = "sni-only"
    minimum_protocol_version  = "TLSv1.1_2016"
  }

  tags = {
    Name  = "Lifespark"
    Site  = var.site
  }

  depends_on = [
    aws_acm_certificate.cert,
    aws_route53_record.cert_validation,
  ]
}


# -----------------------------------------------------------------------------------------------------------
# Site Assets


data "external" "lifespark_hash" {
  program = [ "bash", "${path.module}/hash.sh", "${path.module}/../ls" ]
}

resource "null_resource" "synchronize_lifespark" {

  triggers = {
    script_hash = data.external.lifespark_hash.result["hash"]
  }

  provisioner "local-exec" {
    command = "aws s3 sync --acl public-read ${path.module}/../ls s3://${aws_s3_bucket.lifespark.id}"
  }
}


# -----------------------------------------------------------------------------------------------------------
# Invalidate


resource "null_resource" "invalidate_lifespark" {

  triggers = {
    script_hash = data.external.lifespark_hash.result["hash"]
  }

  provisioner "local-exec" {
    command = "aws cloudfront create-invalidation --distribution-id ${aws_cloudfront_distribution.lifespark.id} --paths \"/\""
  }

  depends_on = [
    null_resource.synchronize_lifespark,
    aws_cloudfront_distribution.lifespark,
  ]
}
