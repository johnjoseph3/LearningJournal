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
  region = var.aws_region

  default_tags {
    tags = {
      CreatedBy = "terraform"
    }
  }
}

resource "aws_vpc" "lj" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.lj.id
}

resource "aws_subnet" "private_subnet_a" {
  vpc_id                  = aws_vpc.lj.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = false
  availability_zone       = "us-east-1a"
}

resource "aws_subnet" "private_subnet_b" {
  vpc_id                  = aws_vpc.lj.id
  cidr_block              = "10.0.2.0/24"
  map_public_ip_on_launch = false
  availability_zone       = "us-east-1b"
}

resource "aws_subnet" "public_subnet_a" {
  vpc_id                  = aws_vpc.lj.id
  cidr_block              = "10.0.0.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "us-east-1a"
}

resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.lj.id
}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.lj.id
  route {
    # Traffic from Public Subnet reaches Internet via Internet Gateway
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

# Route table Association with Private Subnet A
resource "aws_route_table_association" "private_rt_association_a" {
  subnet_id      = aws_subnet.private_subnet_a.id
  route_table_id = aws_route_table.private_rt.id
}

# Route table Association with Private Subnet B
resource "aws_route_table_association" "private_rt_association_b" {
  subnet_id      = aws_subnet.private_subnet_b.id
  route_table_id = aws_route_table.private_rt.id
}

# Route table Association with Public Subnet A
resource "aws_route_table_association" "public_rt_association_a" {
  subnet_id      = aws_subnet.public_subnet_a.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_security_group" "default" {
  name        = "default-sg"
  description = "Default security group to allow inbound/outbound from the VPC"
  vpc_id      = aws_vpc.lj.id
  depends_on  = [aws_vpc.lj]
}

# Allow inbound SSH for EC2 instances
resource "aws_security_group_rule" "allow_ssh_in" {
  description       = "Allow SSH"
  type              = "ingress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.default.id
}

resource "aws_security_group_rule" "allow_http_in_api" {
  description       = "Allow inbound HTTPS traffic"
  type              = "ingress"
  from_port         = "80"
  to_port           = "80"
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.default.id
}

resource "aws_security_group_rule" "allow_https_in_api" {
  description       = "Allow inbound HTTPS traffic"
  type              = "ingress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.default.id
}

# Allow all outbound traffic
resource "aws_security_group_rule" "allow_all_out" {
  description       = "Allow outbound traffic"
  type              = "egress"
  from_port         = "0"
  to_port           = "0"
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.default.id
}

# RDS Subnet Group
resource "aws_db_subnet_group" "private_db_subnet" {
  name        = "postgres-rds-private-subnet-group"
  description = "Private subnets for RDS instance"
  # Subnet IDs must be in two different AZ. Define them explicitly in each subnet with the availability_zone property
  subnet_ids = ["${aws_subnet.private_subnet_a.id}", "${aws_subnet.private_subnet_b.id}"]
}

# RDS Security Group
resource "aws_security_group" "rds_sg" {
  name        = "rds-sg"
  description = "Allow inbound/outbound postgres traffic"
  vpc_id      = aws_vpc.lj.id
  depends_on  = [aws_vpc.lj]
}

# Allow inbound postgres connections
resource "aws_security_group_rule" "allow_postgres_in" {
  description              = "Allow inbound Postgres connections"
  type                     = "ingress"
  from_port                = "5432"
  to_port                  = "5432"
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.default.id
  security_group_id        = aws_security_group.rds_sg.id
}

resource "tls_private_key" "lj" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "lj" {
  key_name   = "lj-key"
  public_key = tls_private_key.lj.public_key_openssh
}

resource "aws_instance" "lj" {
  ami                         = "ami-06b21ccaeff8cd686"
  instance_type               = var.ec2_instance_type
  vpc_security_group_ids      = [aws_security_group.default.id]
  subnet_id                   = aws_subnet.public_subnet_a.id
  key_name                    = aws_key_pair.lj.key_name
  associate_public_ip_address = true

  root_block_device {
    delete_on_termination = true
    # iops                  = 150 # only valid for volume_type io1
    volume_size = 50
    volume_type = "gp2"
  }

  user_data = <<-EOF
              #!/bin/bash
              sudo yum update -y
              sudo yum install -y nginx
              sudo yum install -y certbot python3-certbot-nginx
              sudo systemctl start nginx
              sudo systemctl enable nginx

              # Switch to ec2-user
              sudo -i -u ec2-user bash << 'EOF_USER'
              # Install Node.js using nvm
              curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
              export NVM_DIR="/home/ec2-user/.nvm"
              [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
              [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
              nvm install 22

              # Install PM2
              npm install -g pm2
              EOF_USER

              # Initial Nginx configuration (HTTP only)
              cat <<EOT | sudo tee /etc/nginx/conf.d/nextjs-app.conf
              server {
                listen 80;
                server_name share-learn.com;

                location / {
                  proxy_pass http://127.0.0.1:3000;
                }
              }
              EOT

              sudo nginx -t
              sudo systemctl restart nginx

              # Obtain SSL certificate from Let's Encrypt using standalone mode
              sudo systemctl stop nginx
              sudo certbot certonly --standalone -d share-learn.com --non-interactive --agree-tos --email ${var.certbot_email}
              sudo systemctl start nginx

              # Update Nginx configuration to use SSL
              cat <<EOT | sudo tee /etc/nginx/conf.d/nextjs-app.conf
              server {
                listen 80;
                server_name share-learn.com;

                location / {
                  proxy_pass http://127.0.0.1:3000;
                }
              }

              server {
                listen 443 ssl;
                server_name share-learn.com;

                ssl_certificate /etc/letsencrypt/live/share-learn.com/fullchain.pem;
                ssl_certificate_key /etc/letsencrypt/live/share-learn.com/privkey.pem;

                location / {
                  proxy_pass http://127.0.0.1:3000;
                  proxy_set_header X-Forwarded-Host \$host;
                }
              }
              EOT

              sudo nginx -t
              sudo systemctl restart nginx

              # Set up automatic certificate renewal
              echo "0 0,12 * * * root certbot renew --quiet" | sudo tee -a /etc/crontab > /dev/null

              EOF

  tags = {
    Name = "LearningJournal"
  }
}

resource "aws_eip" "lj" {
  instance = aws_instance.lj.id
}

resource "aws_db_instance" "postgres" {
  identifier             = "lj"
  allocated_storage      = 5
  engine                 = "postgres"
  engine_version         = "13"
  instance_class         = "db.t4g.micro"
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.private_db_subnet.name
  db_name                = var.postgres_dbname
  username               = var.postgres_username
  password               = var.postgres_password
  skip_final_snapshot    = true
  multi_az               = true
}

output "private_key" {
  value     = tls_private_key.lj.private_key_pem
  sensitive = true
}
