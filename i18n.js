class Localization {
	constructor() {
		this.translations = {};
		this.language = "en";
	}

	async load(language) {
		this.language = language;

		const response = await fetch(`/locales/${language}.json`);

		if (!response.ok) {
			throw new Error(`Failed to load locale: ${language}`);
		}

		this.translations = await response.json();

		this.apply();
		localStorage.setItem("language", language);
	}

	get(key) {
		return key
			.split(".")
			.reduce((obj, part) => obj?.[part], this.translations) ?? key;
	}

	apply() {
		document.querySelectorAll("[data-i18n]").forEach(element => {
			element.textContent = this.get(element.dataset.i18n);
		});

		document.querySelectorAll("[data-i18n-html]").forEach(element => {
			element.innerHTML = this.get(element.dataset.i18nHtml);
		});

		document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
			element.placeholder = this.get(element.dataset.i18nPlaceholder);
		});

		document.querySelectorAll("[data-i18n-title]").forEach(element => {
			element.title = this.get(element.dataset.i18nTitle);
		});
	}
}

const i18n = new Localization();

(async () => {
	const language =
		localStorage.getItem("language") ||
		navigator.language.split("-")[0];

	try {
		await i18n.load(language);
	}
	catch {
		await i18n.load("en");
	}
})();