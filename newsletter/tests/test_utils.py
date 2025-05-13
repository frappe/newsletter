import frappe
from frappe.tests import IntegrationTestCase
from unittest.mock import patch

from newsletter.newsletter.utils import add_trackers_to_url, map_trackers, parse_and_map_trackers_from_url
class TestURLTrackers(IntegrationTestCase):
	def test_add_trackers_to_url(self):
		url = "https://example.com"
		source = "test_source"
		campaign = "test_campaign"
		medium = "test_medium"
		content = "test_content"

		with patch("frappe.db.get_value") as mock_get_value:
			mock_get_value.side_effect = lambda *args: args[1]  # Return unslugged input value
			result = add_trackers_to_url(url, source, campaign, medium, content)

		expected = "https://example.com?utm_source=test_source&utm_medium=test_medium&utm_campaign=test_campaign&utm_content=test_content"
		self.assertEqual(result, expected)

	def test_parse_and_map_trackers_from_url(self):
		url = "https://example.com?utm_source=test_source&utm_medium=test_medium&utm_campaign=test_campaign&utm_content=test_content"

		with patch("frappe.db.get_value") as mock_get_value:
			mock_get_value.return_value = None  # Simulate no existing records
			result = parse_and_map_trackers_from_url(url)

		expected = {
			"utm_source": "test_source",
			"utm_medium": "test_medium",
			"utm_campaign": "test_campaign",
			"utm_content": "test_content",
		}
		self.assertEqual(result, expected)

	def test_map_trackers(self):
		url_trackers = {
			"utm_source": "test_source",
			"utm_medium": "test_medium",
			"utm_campaign": "test_campaign",
			"utm_content": "test_content",
		}

		result = map_trackers(url_trackers, create=True)

		expected = {
			"utm_source": frappe.get_doc("UTM Source", "test_source"),
			"utm_medium": frappe.get_doc("UTM Medium", "test_medium"),
			"utm_campaign": frappe.get_doc("UTM Campaign", "test_campaign"),
			"utm_content": "test_content",
		}
		self.assertDocumentEqual(result["utm_source"], expected["utm_source"])
		self.assertDocumentEqual(result["utm_medium"], expected["utm_medium"])
		self.assertDocumentEqual(result["utm_campaign"], expected["utm_campaign"])
		self.assertEqual(result["utm_content"], expected["utm_content"])