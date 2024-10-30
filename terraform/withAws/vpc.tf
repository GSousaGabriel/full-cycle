resource "aws_vpc" "new_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    "name" = "${var.prefix}-vpc"
  }
}

data "aws_availability_zones" "available" {}

resource "aws_subnet" "subnets" {
  count                   = 2
  vpc_id                  = aws_vpc.new_vpc.id
  cidr_block              = "10.0.${count.index}.0/24"
  map_public_ip_on_launch = true
  tags = {
    "Name" = "${var.prefix}_subnet_${count.index}"
  }
  availability_zone = data.aws_availability_zones.available.names[count.index]
}

resource "aws_internet_gateway" "new_igw" {
  vpc_id = aws_vpc.new_vpc.id
  tags = {
    "Name" = "${var.prefix}_igw"
  }
}

resource "aws_route_table" "new_rtb" {
  vpc_id = aws_vpc.new_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.new_igw.id
  }
  tags = {
    "Name" = "${var.prefix}_rtb"
  }
}

resource "aws_route_table_association" "new_rtb_association" {
  count          = 2
  route_table_id = aws_route_table.new_rtb.id
  subnet_id      = aws_subnet.subnets.*.id[count.index]
}

# resource "aws_subnet" "new_subnet_1" {
#   vpc_id = aws_vpc.new_vpc.id
#   cidr_block = "10.0.0.0/24"
#   tags = {
#     "Name" = "${var.prefix}_subnet_1"
#   }
#   availability_zone = "us-east-1a"
# }

# resource "aws_subnet" "new_subnet_2" {
#   vpc_id = aws_vpc.new_vpc.id
#   cidr_block = "10.0.1.0/24"
#   tags = {
#     "Name" = "${var.prefix}_subnet_2"
#   }
#   availability_zone = "us-east-1b"
# }
