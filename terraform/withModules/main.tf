# terraform {
#   required_version = ">=0.13.1"
#   required_providers {
#     aws   = ">=5.73.0"
#     local = ">=2.5.2"
#   }
#   backend "s3" {
#     bucket = "myfcbucket"
#     key    = "terraform.tfstate"
#     region = "us-east-1"
#   }
# }

# provider "aws" {
#   region = "us-east-1"
# }

module "new_vpc" {
  source         = "./vpc"
  prefix         = var.prefix
  vpc_cidr_block = var.vpc_cidr_block
  subnet_amount  = var.subnet_amount
}

module "eks" {
  source         = "./eks"
  prefix         = var.prefix
  vpc_id         = module.new_vpc.vpc_id
  cluster_name   = var.cluster_name
  retention_days = var.retention_days
  subnet_ids     = module.new_vpc.subnet_ids
  desired_size   = var.desired_size
  max_size       = var.max_size
  min_size       = var.min_size
}
