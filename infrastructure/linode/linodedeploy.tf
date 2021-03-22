terraform {
  required_providers {
    linode = {
      source = "linode/linode"
      version = "1.16.0"
    }
    cloudflare = {
      source = "cloudflare/cloudflare"
      version = "~> 2.0"
    }
  }

  backend "azurerm" {
    resource_group_name   = "clemenswolff"
    storage_account_name  = "clemenswolff"
    container_name        = "tfstate"
    key                   = "boardgames.tfstate"
  }
}

variable "root_password" {
  type = string
  sensitive = true
}

variable "cloudflare_zone_id" {
  type = string
}

provider "linode" {
}

provider "cloudflare" {
}

resource "linode_instance" "boardgames" {
  image = "linode/ubuntu20.04"
  label = "boardgames"
  group = "boardgames"
  region = "us-east"
  type = "g6-nanode-1"
  root_pass = var.root_password
}

resource "cloudflare_record" "boardgames" {
  zone_id = var.cloudflare_zone_id
  name    = "boardgames"
  value   = linode_instance.boardgames.ip_address
  type    = "A"
}

output "ip" {
  value = linode_instance.boardgames.ip_address
}

output "fqdn" {
  value = cloudflare_record.boardgames.hostname
}
