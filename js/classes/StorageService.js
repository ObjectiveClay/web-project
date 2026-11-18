class StorageService {
    constructor(key, defaultValue) {
        this.key = key;
        this.defaultValue = defaultValue;
    }

    getDefault() {
        return JSON.parse(JSON.stringify(this.defaultValue));
    }

    isValidValue(value) {
        if (Array.isArray(this.defaultValue)) {
            return Array.isArray(value);
        }
        return value !== null && typeof value === typeof this.defaultValue;
    }

    get() {
        try {
            const savedText = localStorage.getItem(this.key);
            if (savedText === null) {
                return this.getDefault();
            }

            const value = JSON.parse(savedText);
            if (!this.isValidValue(value)) {
                throw new Error("Saved value has a wrong type");
            }
            return value;
        } catch (error) {
            console.warn(`Saved data "${this.key}" was invalid and has been reset.`, error);
            this.clear();
            return this.getDefault();
        }
    }

    save(value) {
        try {
            localStorage.setItem(this.key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn(`Could not save "${this.key}".`, error);
            return false;
        }
    }

    clear() {
        try {
            localStorage.removeItem(this.key);
        } catch (error) {
            console.warn(`Could not clear "${this.key}".`, error);
        }
    }
}