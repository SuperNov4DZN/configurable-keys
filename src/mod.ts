import { DependencyContainer } from "tsyringe";

import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { VFS } from "@spt/utils/VFS";

import { jsonc } from "jsonc";
import path from "path";

class ConfigurableKeys implements IPostDBLoadMod 
{
    // Get package attributes/info
    private mod = require("../package.json");

    // Get Log Clors & Base Class
    private color = require("C:/snapshot/project/obj/models/spt/logging/LogTextColor");
    private baseClasses = require("C:/snapshot/project/obj/models/enums/BaseClasses");

    public postDBLoad(container: DependencyContainer): void 
    {
        // Parse jsonc files
        const vfs = container.resolve<VFS>("VFS");
        const parseJsonc = (filename: string) =>
            jsonc.parse(
                vfs.readFile(path.resolve(__dirname, `../config/${filename}.jsonc`))
            );

        // Get config file
        // TODO: Refactor to use multiple config files per "category"
        const config = parseJsonc("config");

        const color = this.color.LogTextColor
        const baseClasses = this.baseClasses.BaseClasses

        // Get database
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const tables: IDatabaseTables = databaseServer.getTables();
        const items = Object.values(tables.templates.items);
    
        // Get logger
        const logger = container.resolve<ILogger>("WinstonLogger");

        // TODO: Convert into function, Call for individual keys changing individual attributes
        for (const item in items) 
        {
            const itemProps = items[item]._props;

            if (config.enable_blacklist && config.blacklisted_keys.includes(items[item]._id))
                continue;

            if (items[item]._parent == baseClasses.KEY_MECHANICAL) 
            {
                itemProps.DiscardLimit = -1;

                if (config.unbreakable_keys) 
                    itemProps.MaximumNumberOfUsage = 0;

                if (config.weightless_keys) 
                    itemProps.Weight = 0.0;
            }

            if (items[item]._parent == baseClasses.KEYCARD) 
            {
                itemProps.DiscardLimit = -1;

                if (config.unbreakable_keycards) 
                    itemProps.MaximumNumberOfUsage = 0;

                if (config.weightless_keycards) 
                    itemProps.Weight = 0.0;
            }
        }
        logger.log(`[${this.mod.name}] Loaded successfully.`, color.GREEN)
    }
}

module.exports = { mod: new ConfigurableKeys() };