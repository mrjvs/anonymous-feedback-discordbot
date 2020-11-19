class PromptTimeout extends Error {
	constructor() {
    super("Prompt timed out");
    this.name = "PromptTimeout";
  }
}

class PromptCancel extends Error {
	constructor() {
    super("Prompt canceled");
    this.name = "PromptCancel";
  }
}

module.exports = {
	PromptTimeout,
	PromptCancel,
}