function generate_tracking_url() {
	frappe.prompt(
		[
			{
				fieldname: "url",
				label: __("Web Page URL"),
				fieldtype: "Data",
				options: "URL",
				reqd: 1,
				default: localStorage.getItem("tracker_url:url"),
			},
			{
				fieldname: "source",
				label: __("Source"),
				fieldtype: "Link",
				reqd: 1,
				options: "UTM Source",
				description: "The referrer (e.g. google, newsletter)",
				default: localStorage.getItem("tracker_url:source"),
			},
			{
				fieldname: "campaign",
				label: __("Campaign"),
				fieldtype: "Link",
				ignore_link_validation: 1,
				options: "UTM Campaign",
				default: localStorage.getItem("tracker_url:campaign"),
			},
			{
				fieldname: "medium",
				label: __("Medium"),
				fieldtype: "Link",
				options: "UTM Medium",
				description: "Marketing medium (e.g. cpc, banner, email)",
				default: localStorage.getItem("tracker_url:medium"),
			},
			{
				fieldname: "content",
				label: __("Content"),
				fieldtype: "Data",
				description: "Use to differentiate ad variants (e.g. A/B testing)",
				default: localStorage.getItem("tracker_url:content"),
			},
		],
		async function (data) {
			let url = data.url;
			localStorage.setItem("tracker_url:url", data.url);

			const { message } = await frappe.db.get_value("UTM Source", data.source, "slug");
			url += "?utm_source=" + encodeURIComponent(message.slug || data.source);
			localStorage.setItem("tracker_url:source", data.source);
			if (data.campaign) {
				const { message } = await frappe.db.get_value(
					"UTM Campaign",
					data.campaign,
					"slug"
				);
				url += "&utm_campaign=" + encodeURIComponent(message.slug || data.campaign);
				localStorage.setItem("tracker_url:campaign", data.campaign);
			}
			if (data.medium) {
				const { message } = await frappe.db.get_value("UTM Medium", data.medium, "slug");
				url += "&utm_medium=" + encodeURIComponent(message.slug || data.medium);
				localStorage.setItem("tracker_url:medium", data.medium);
			}
			if (data.content) {
				url += "&utm_content=" + encodeURIComponent(data.content);
				localStorage.setItem("tracker_url:content", data.content);
			}

			frappe.utils.copy_to_clipboard(url);

			frappe.msgprint(
				__("Tracking URL generated and copied to clipboard") +
					": <br>" +
					`<a href="${url}">${url.bold()}</a>`,
				__("Here's your tracking URL")
			);
		},
		__("Generate Tracking URL")
	);
}

frappe.search.utils.make_function_searchable(generate_tracking_url, __("Generate Tracking URL"));
