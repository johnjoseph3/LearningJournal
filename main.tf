terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  backend "s3" {
    bucket = "learning-journal-prod"
    key    = "state"
    region = "us-east-1"
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "learning_journal" {
  ami           = var.lj_ami
  instance_type = var.lj_instance_type

  tags = {
    Name = "LearningJournal"
  }
}
