import { DependencyContainer } from "tsyringe";

import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { BaseClasses } from "@spt/models/enums/BaseClasses";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import { VFS } from "@spt/utils/VFS";

import { ItemGenerator } from "./CustomKeys/ItemGenerator";
import { References } from "./Refs/References";
import { InstanceManager } from "./Refs/InstanceManager";

import { jsonc } from "jsonc";
import path from "path";

class ConfigurableKeys implements IPreSptLoadMod, IPostDBLoadMod 
{
    // Get Package attributes/info
    private mod = require("../package.json");

    // Get References
    private ref: References = new References();
    private instance: InstanceManager = new InstanceManager();

    public preSptLoad(container: DependencyContainer): void 
    {
        this.instance.preSptLoad(container, "Configurable Keys");
    }

    public postDBLoad(container: DependencyContainer): void 
    {
        // Load container into references
        this.ref.postDBLoad(container);

        // Parse jsonc files
        const vfs = container.resolve<VFS>("VFS");
        const parseJsonc = (filename: string) =>
            jsonc.parse(
                vfs.readFile(path.resolve(__dirname, `../config/${filename}.jsonc`))
            );

        // Get config file
        // TODO: Refactor to use multiple config files per "category"
        const config = parseJsonc("config");

        const color = LogTextColor
        const baseClasses = BaseClasses

        // Get database
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const tables: IDatabaseTables = databaseServer.getTables();
        const items = Object.values(tables.templates.items);
    
        // Get logger
        const logger = container.resolve<ILogger>("WinstonLogger");

        // Add Custom Keys
        const keyGenerator = new ItemGenerator(this.ref);
        if (config.custom_keys) 
        {
            keyGenerator.createCustomItems("../../db/Items");
        }

        // TODO: Convert into function, Call for individual keys changing individual attributes
        // Apply Changes to keys
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