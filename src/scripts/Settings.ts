import Utils from "./Utils";
import settingsLists from "./settingLists"

class Settings {
    private static _instance: Settings;

    private constructor() {
    }

    public static getInstance(): Settings {
        if (!Settings._instance) Settings._instance = new Settings();
        return Settings._instance;
    }

    private async _registerSetting(key: string, data: any): Promise<void> {
        await game.settings.register(Utils.moduleName, key, data);
    }

    private _getSetting(key: string): any {
        return game.settings.get(Utils.moduleName, key);
    }

    public registerSettings(): void {
        settingsLists.SETTINGS.forEach((setting: any): void => {
            this._registerSetting(setting.key, setting.data);
        });
    }

    public getCritChances() {
        const critChances = this.getSetting("critChances");
        try {
            return JSON.parse(critChances);
        }
        catch (e) {
            ui.notifications.error(e);
            return
        }
    }

    public async setCritChances(data) {
        data = JSON.stringify(data);
        await this.setSetting("critChances", data);
    }

    /**
     * Returns a setting
     *
     * @param key
     */
    public getSetting(key: string): any {
        return this._getSetting(key);
    }

    /**
     * Sets a setting
     *
     * @param key - key of the setting
     * @param data - data to store
     */
    public async setSetting(key: string, data: any): Promise<any> {
        return await game.settings.set(Utils.moduleName, key, data);
    }

}

export default Settings.getInstance();