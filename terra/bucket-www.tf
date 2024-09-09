
# aws_s3_bucket.frontend
resource "aws_s3_bucket" "frontend" {
  bucket = var.domain

  force_destroy = true

  tags = {
    Name = "Frontend Assets"
    Site = var.site
  }
}

resource "aws_s3_bucket_acl" "example_bucket_acl" {
  bucket = aws_s3_bucket.frontend.id
  acl    = "public-read"
}

resource "aws_s3_bucket_website_configuration" "example" {
  bucket = aws_s3_bucket.frontend.bucket

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "404.html"
  }
}


# -----------------------------------------------------------------------------------------------------------
# Site Assets


data "external" "frontend_hash" {
  program = [ "bash", "${path.module}/hash.sh", "${path.module}/../dist" ]
}

resource "null_resource" "synchronize_frontend_3s" {

  triggers = {
    script_hash = data.external.frontend_hash.result["hash"]
  }

  provisioner "local-exec" {
    command = "aws s3 sync --acl public-read ${path.module}/../dist s3://${aws_s3_bucket.frontend.id}"
  }
}


# -----------------------------------------------------------------------------------------------------------
# Invalidate


resource "null_resource" "invalidate_cloudfront" {

  triggers = {
    script_hash = data.external.frontend_hash.result["hash"]
  }

  provisioner "local-exec" {
    command = "aws cloudfront create-invalidation --distribution-id ${aws_cloudfront_distribution.frontend.id} --paths \"/\""
  }

  depends_on = [
    null_resource.synchronize_frontend_3s,
    aws_cloudfront_distribution.frontend,
  ]
}

