terraform {
  required_providers {
    digitalocean = {
      source = "digitalocean/digitalocean"
      version = "~> 2.0"
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
    key                   = "boardgames-digitalocean.tfstate"
  }
}

variable "ssh_key_public" {
  type = string
}

variable "cloudflare_zone_id" {
  type = string
}

provider "digitalocean" {
}

provider "cloudflare" {
}

resource "digitalocean_ssh_key" "terraform" {
  name = "boardgames"
  public_key = file(var.ssh_key_public)
}

resource "digitalocean_droplet" "boardgames" {
  image = "ubuntu-20-04-x64"
  name = "boardgames"
  region = "nyc1"
  size = "s-1vcpu-1gb"
  ssh_keys = [
    digitalocean_ssh_key.terraform.fingerprint
  ]
}

resource "cloudflare_record" "boardgames" {
  zone_id = var.cloudflare_zone_id
  name    = "boardgames"
  value   = digitalocean_droplet.boardgames.ipv4_address
  type    = "A"
}

output "ip" {
  value = digitalocean_droplet.boardgames.ipv4_address
}

output "fqdn" {
  value = cloudflare_record.boardgames.hostname
}
