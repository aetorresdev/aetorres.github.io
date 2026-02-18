---
layout: post
title:  "Shared Terraform State file"
date:   2018-11-20
desc: "How to manage AWS state file in a shared environment"
keywords: "Terraform, AWS, S3, shared, remote, backend "
categories: [Aws]
tags: [terraform,AWS,S3,Backend]
icon: icon-html
---

*Note (2025): Backend concept and workspaces are unchanged. For current syntax and options (e.g. S3 state locking, bucket versioning), see the [official S3 backend docs](https://developer.hashicorp.com/terraform/language/settings/backends/s3).*

Probably you are not familiarized with the infrastructure state concept: it's a snapshot of what we have configured and running in our current infrastructure **(VPCs, Subnets, Instances, RDS, Volumes, etc)**, this snapshot help us to update our infrastructure allowing us to run our scripts and applying just the changes that we have, this snapshot is what provide us idempotence in IT architecture creation.

Now, let's say that we have a git repo with our terraform scripts, those scripts creates a VPC, two subnets and two instances one inside each subnet, this git repo has collaborators that can execute the deploy when they want; but, what happen with that **state file**?; that state file cannot be stored in git because is a file that has sensitive info about our architecture and it changes quite often.

So, we have an issue here, what would happen if two collaborators apply their changes without share their **state file**?. We will have infrastructure consistency errors because some changes will be executed before other and you could delete the changes made by another collaborator.

then, What can we do?

In this scenario, Terraform provides a remote state feature called [**backends**](https://developer.hashicorp.com/terraform/language/settings/backends/s3), which keeps the state file updated with every run.

Now what would happen if you want to test your changes without change the develop or QA or even production environment? In this scenario we could use a simple Terraform tool called **workspaces**, this workspaces will allow us to create different environments that will have their own state file.

This workspace will not block the write over a state file, just will give us the chance to work with different state files and different stacks.

To work with this configuration follow the next steps:

1. Create an account with S3 access

2. Create bucket for save terraform.tfstate files

```
YOUR-BUCKET-NAME
```
3. Once we have the bucket created we need to configure it to save the terraform state files.

4. Create your `main.tf` and `variable.tf` files with your provider and bucket definition. Note: the backend block cannot use variables, so the region is hardcoded below. Enable **bucket versioning** on the S3 bucket (in the AWS console) so you can recover state if needed. Optionally set `use_lockfile = true` in the backend for state locking.

`main.tf`
```hcl
provider "aws" {
  region = var.region
}

terraform {
  backend "s3" {
    bucket         = "YOUR-BUCKET-NAME"
    key            = "terraform.tfstate"
    region         = "us-west-1"
    encrypt        = true
    use_lockfile   = true   # optional: S3-based state locking
  }
}
```

`variables.tf`
```hcl
variable "region" {
  default = "us-west-1"
}

variable "environment" {
  default = "dev"
}
```

5. Initialize your backend. Prefer **environment variables** for credentials so they are not stored under `.terraform` or in plan files:

```bash
export AWS_ACCESS_KEY_ID="<YOUR ACCESS KEY>"
export AWS_SECRET_ACCESS_KEY="<YOUR SECRET KEY>"
export AWS_REGION="us-west-1"

terraform init
```

If you need to override only non-sensitive backend settings (e.g. bucket or key) without changing the config file:

```bash
terraform init -backend-config="bucket=YOUR-BUCKET-NAME" -backend-config="key=terraform.tfstate"
```

6. Add the workspaces to use

```
terraform workspace new dev
terraform workspace new prod
terraform workspace new YOUR-WORKSPACE-NAME
```

7. Select the workspace to use

```
terraform workspace use dev
```

8. Run plan and apply with the vars file for the environment

```
terraform plan -var-file="variables_dev.tfvars"
terraform apply -var-file="variables_dev.tfvars"
```

