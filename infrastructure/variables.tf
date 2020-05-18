variable "subscription_id" {
  type = string
}

variable "name" {
  type = string
}

variable "code_zip" {
  type = string
}

variable "location" {
  type    = string
  default = "EastUS"
}

variable "storage_account_tier" {
  type    = string
  default = "Standard"
}

variable "storage_account_replication" {
  type    = string
  default = "LRS"
}

variable "webapp_sku_size" {
  type    = string
  default = "S1"
}

variable "webapp_sku_tier" {
  type    = string
  default = "Standard"
}

variable "webapp_workers" {
  type    = number
  default = 1
}
