terraform {
    required_version = ">=0.13.1"
  required_providers {
    aws = ">=5.73.0"
    local = ">=2.5.2"
  }
}

provider "aws" {
  region = "us-east-1"
}