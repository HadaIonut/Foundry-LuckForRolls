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

    private _registerSetting(key: string, data: any): void {
        game.settings.register(Utils.moduleName, key, data);
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

    public setCritChances(data) {
        data = JSON.stringify(data);
        this.setSetting("critChances", data);
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
    public setSetting(key: string, data: any): Promise<any> {
        return game.settings.set(Utils.moduleName, key, data);
    }

}

export default Settings.getInstance();