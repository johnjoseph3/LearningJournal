variable "lj_ami" {
  type        = string
  default     = "ami-06b21ccaeff8cd686"
  description = "Learning Journal AMI"
}

variable "lj_instance_type" {
  type        = string
  default     = "t2.micro"
  description = "Learning Journal instance type"
}
