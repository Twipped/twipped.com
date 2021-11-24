
# aws_s3_bucket.frontend
resource "aws_s3_bucket" "frontend" {
  bucket = var.domain
  acl    = "public-read"

  force_destroy = true

  website {
    index_document = "index.html"
    error_document = "404.html"
  }

  tags = {
    Name = "Frontend Assets"
    Site = var.site
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

