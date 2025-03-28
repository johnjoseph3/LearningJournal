variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "ec2_instance_type" {
  type    = string
  default = "t2.micro"
}

variable "postgres_username" {
  type    = string
  default = "lj"
}

variable "postgres_password" {
  type      = string
  sensitive = true
  default   = "your_postgres_password"
}

variable "postgres_dbname" {
  type    = string
  default = "learning_journal"
}

variable "route53_zone_id" {
  type    = string
  default = "your_route53_zone_id"
}

variable "certbot_email" {
  type    = string
  default = "your_email@example.com"
}
