import { HandbookItem } from "@spt/models/eft/common/tables/IHandbookBase";
import { Item } from "@spt/models/eft/common/tables/IItem";
import { Props } from "@spt/models/eft/common/tables/ITemplateItem";
import { IBarterScheme } from "@spt/models/eft/common/tables/ITrader";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { IRagfairConfig } from "@spt/models/spt/config/IRagfairConfig";
import { NewItemFromCloneDetails } from "@spt/models/spt/mod/NewItemDetails";
import { References } from "../Refs/References";
import { AllItemList, HandbookIDs, SlotsIDs } from "./BaseEnums";

import * as fs from "node:fs";
import * as path from "node:path";

export class ItemGenerator 
{
    protected itemsToSell: Item[] = [];
    protected barterScheme: Record<string, IBarterScheme[][]> = {};
    protected loyaltyLevel: Record<string, number> = {};
    private itemConfig: CustomItemFormat;

    constructor(private ref: References) 
    {}

    public createCustomItems(itemDirectory: string): void 
    {
        this.itemConfig = this.combineItems(itemDirectory);
        const tables = this.ref.tables;

        for (const newId in this.itemConfig) 
        {
            const itemConfig = this.itemConfig[newId];
            const tempClone = AllItemList[itemConfig["ItemToClone"]] || itemConfig["ItemToClone"];
            const itemToClone = tempClone;

            const newItem: NewItemFromCloneDetails = {
                itemTplToClone: itemToClone,
                overrideProperties: itemConfig.OverrideProperties,
                parentId: tables.templates.items[itemToClone]._parent,
                newId: newId,
                handbookParentId: this.createHandbook(itemConfig, newId).ParentId,
                handbookPriceRoubles: this.createHandbook(itemConfig, newId).Price,
                fleaPriceRoubles: this.createHandbook(itemConfig, newId).Price,
                locales: {
                    en: {
                        name: itemConfig.LocalePush.en.name,
                        shortName: itemConfig.LocalePush.en.shortName,
                        description: itemConfig.LocalePush.en.description
                    }
                }
            };
            this.ref.customItem.createItemFromClone(newItem);

            // TODO: Add keys to traders

            if (itemConfig.CloneToFilters) 
            {
                this.cloneToFilters(itemConfig, newId);
            }

            if (itemConfig.PushToFleaBlacklist) 
            {
                this.pushToBlacklist(newId);
            }

            if (itemConfig.SlotPush?.Slot !== undefined) 
            {
                this.pushToSlot(itemConfig, newId);
            }
        }
    }

    private createHandbook(itemConfig: CustomItemFormat[string], itemID: string): HandbookItem 
    {
        const tables = this.ref.tables;
        const tempClone = AllItemList[itemConfig["ItemToClone"]] || itemConfig["ItemToClone"];
        const itemToClone = tempClone;

        if (itemConfig.Handbook !== undefined) 
        {
            const tempHBParent =
                HandbookIDs[itemConfig["Handbook"]["HandbookParent"]] || itemConfig["Handbook"]["HandbookParent"];
            const hbParent = tempHBParent;

            const handbookEntry: HandbookItem = {
                Id: itemID,
                ParentId: hbParent,
                Price: itemConfig["Handbook"]["HandbookPrice"]
            };

            return handbookEntry;
        }
        else 
        {
            const hbBase = tables.templates.handbook.Items.find((i) => i.Id === itemToClone);

            const handbookEntry = {
                Id: itemID,
                ParentId: hbBase.ParentId,
                Price: hbBase.Price
            };

            return handbookEntry;
        }
    }

    private cloneToFilters(itemConfig: CustomItemFormat[string], itemID: string): void 
    {
        const tables = this.ref.tables;
        const tempClone = AllItemList[itemConfig.ItemToClone] || itemConfig.ItemToClone;
        const itemToClone = tempClone;

        for (const item in tables.templates.items) 
        {
            const itemConflictId = tables.templates.items[item]._props.ConflictingItems;

            for (const itemInConflicts in itemConflictId) 
            {
                const itemInConflictsFiltersId = itemConflictId[itemInConflicts];

                if (itemInConflictsFiltersId === itemToClone) 
                {
                    itemConflictId.push(itemID);
                }
            }
        }
    }

    private pushToSlot(itemConfig: CustomItemFormat[string], itemID: string): void 
    {
        const tables = this.ref.tables;
        const defaultInventory = tables.templates.items["55d7217a4bdc2d86028b456d"]._props.Slots;
        const tempSlot = SlotsIDs[itemConfig.SlotPush?.Slot] || itemConfig.SlotPush?.Slot;
        const slotToPush = tempSlot;

        defaultInventory[slotToPush]._props.filters[0].Filter.push(itemID);
    }

    private pushToBlacklist(itemID: string): void 
    {
        const ragfair = this.ref.configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR);
        ragfair.dynamic.blacklist.custom.push(...[itemID]);
    }

    private combineItems(itemDirectory: string) 
    {
        const modules = fs.readdirSync(path.join(__dirname, itemDirectory));

        const combinedModules: any = {};

        modules.forEach((modFile) => 
        {
            const filesPath = path.join(__dirname, itemDirectory, modFile);
            const fileContents = fs.readFileSync(filesPath, "utf-8");
            const module = JSON.parse(fileContents) as CustomItemFormat;

            Object.assign(combinedModules, module);
        });

        return combinedModules;
    }
}

export interface CustomItemFormat 
{
    [newID: string]: {
        ItemToClone: string;
        OverrideProperties: Props;
        LocalePush: {
            en: {
                name: string;
                shortName: string;
                description: string;
            };
        };
        Handbook?: {
            HandbookParent: string;
            HandbookPrice: number;
        };
        SlotPush?: {
            Slot: number;
        };
        BotPush?: {
            AddToBots: boolean;
        };
        CasePush?: {
            CaseFiltersToAdd: string[];
        };
        LootPush?: {
            LootContainersToAdd: string[];
            StaticLootProbability: number;
        };
        PresetPush?: {
            PresetToAdd: PresetFormat[];
        };
        QuestPush?: {
            QuestConditionType: string;
            QuestTargetConditionToClone: string;
        };
        PushToFleaBlacklist?: boolean;
        CloneToFilters?: boolean;
        PushMastery?: boolean;
    };
}

export interface PresetFormat 
{
    _changeWeaponName: boolean;
    _encyclopedia?: string;
    _id: string;
    _items: ItemFormat[];
    _name: string;
    _parent: string;
    _type: string;
}

export interface ItemFormat 
{
    _id: string;
    _tpl: string;
    parentId?: string;
    slotId?: string;
}