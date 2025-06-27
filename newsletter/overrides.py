import frappe


def website_context(context):
	context.is_erpnext_installed = "erpnext" in frappe.get_installed_apps()
