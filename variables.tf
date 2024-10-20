
variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "ec2_instance_type" {
  type    = string
  default = "t2.micro"
}

variable "postgres_password" {
  type      = string
  sensitive = true
  default   = "your_postgres_password"
}

variable "key_pair" {
  type      = string
  sensitive = true
  default   = "your_key_pair"
}
