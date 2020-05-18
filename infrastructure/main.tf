resource "azurerm_resource_group" "resource_group" {
  name     = var.name
  location = var.location
}

resource "azurerm_storage_account" "storage" {
  resource_group_name      = azurerm_resource_group.resource_group.name
  location                 = azurerm_resource_group.resource_group.location
  name                     = var.name
  account_kind             = "StorageV2"
  account_tier             = var.storage_account_tier
  account_replication_type = var.storage_account_replication
}

resource "azurerm_storage_container" "state" {
  storage_account_name = azurerm_storage_account.storage.name
  name                 = "state"
  depends_on           = [azurerm_storage_account.storage]
}

resource "azurerm_storage_container" "code" {
  storage_account_name = azurerm_storage_account.storage.name
  name                 = "code"
  depends_on           = [azurerm_storage_account.storage]
}

resource "azurerm_storage_blob" "code" {
  storage_account_name   = azurerm_storage_account.storage.name
  storage_container_name = azurerm_storage_container.code.name
  name                   = "${filesha256(var.code_zip)}.zip"
  type                   = "Block"
  source                 = var.code_zip
  depends_on             = [azurerm_storage_container.code]
}

data "azurerm_storage_account_sas" "code" {
  connection_string = azurerm_storage_account.storage.primary_connection_string

  start  = "2000-11-11"
  expiry = "2222-11-11"

  resource_types {
    service   = false
    container = false
    object    = true
  }

  services {
    blob  = true
    queue = false
    table = false
    file  = false
  }

  permissions {
    read    = true
    write   = false
    delete  = false
    list    = false
    add     = false
    create  = false
    update  = false
    process = false
  }
}

resource "azurerm_app_service_plan" "app_hosting" {
  resource_group_name = azurerm_resource_group.resource_group.name
  location            = azurerm_resource_group.resource_group.location
  name                = var.name
  kind                = "Linux"
  reserved            = true
  sku {
    tier     = var.webapp_sku_tier
    size     = var.webapp_sku_size
    capacity = var.webapp_workers
  }
}

resource "azurerm_app_service" "app" {
  resource_group_name = azurerm_resource_group.resource_group.name
  location            = azurerm_resource_group.resource_group.location
  name                = var.name
  app_service_plan_id = azurerm_app_service_plan.app_hosting.id

  identity {
    type = "SystemAssigned"
  }

  app_settings = {
    WEBSITES_ENABLE_APP_SERVICE_STORAGE = "false"
    HASH                                = filesha256(var.code_zip)
    WEBSITE_RUN_FROM_PACKAGE            = "${azurerm_storage_blob.code.url}${data.azurerm_storage_account_sas.code.sas}"

    SOCKET_PER_MESSAGE_DEFLATE          = "false"
    AZURE_STORAGE_ACCOUNT               = azurerm_storage_account.storage.name
    AZURE_STORAGE_CONTAINER             = azurerm_storage_container.state.name
  }

  site_config {
    always_on           = true
    websockets_enabled  = true
    app_command_line    = "node dist/backend/server.js"
    linux_fx_version    = "NODE|12"
  }
}

resource "azurerm_role_assignment" "app_storage_access" {
  scope                = azurerm_storage_account.storage.id
  principal_id         = azurerm_app_service.app.identity.0.principal_id
  role_definition_name = "Storage Blob Data Contributor"
}
