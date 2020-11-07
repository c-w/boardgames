provider "azurerm" {
  version         = "~> 2.35.0"
  subscription_id = var.subscription_id
  features {}
}
