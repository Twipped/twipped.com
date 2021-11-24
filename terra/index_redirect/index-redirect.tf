variable "site" {
  type = string
  description = "The name of the site"
}

# -----------------------------------------------------------------------------------------------------------
# IAM Role for Redirect Lambda

data "aws_iam_policy_document" "index_redirect_lambda" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = [
        "edgelambda.amazonaws.com",
        "lambda.amazonaws.com"
      ]
    }
  }
}

resource "aws_iam_role" "index_redirect_lambda" {
  name = "${var.site}-lambda-redirect-role"
  assume_role_policy = data.aws_iam_policy_document.index_redirect_lambda.json

  tags = {
    Site = var.site
  }
}

# -----------------------------------------------------------------------------------------------------------
# Lambda Subdirectory index.html Redirect

data "archive_file" "index_redirect" {
  type        = "zip"
  source_file = "${path.module}/index_redirect.js"
  output_path = ".terraform/tmp/lambda/index_redirect.zip"
}

resource "aws_lambda_function" "index_redirect" {
  function_name    = "${var.site}_index_redirect"

  filename         = data.archive_file.index_redirect.output_path
  source_code_hash = data.archive_file.index_redirect.output_base64sha256
  
  description      = "index.html subdirectory redirect"
  handler          = "index_redirect.handler"
  publish          = true
  role             = aws_iam_role.index_redirect_lambda.arn
  runtime          = "nodejs12.x"

  tags = {
    Name   = "${var.site}-index-redirect"
    Site = var.site
  }
}


output "arn" {
  value = aws_lambda_function.index_redirect.qualified_arn
}
