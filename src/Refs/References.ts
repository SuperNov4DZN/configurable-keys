import { DependencyContainer } from "tsyringe";

import { BotController } from "@spt/controllers/BotController";
import { BotHelper } from "@spt/helpers/BotHelper";
import { ItemHelper } from "@spt/helpers/ItemHelper";
import { ProbabilityHelper } from "@spt/helpers/ProbabilityHelper";
import { ProfileHelper } from "@spt/helpers/ProfileHelper";
import { TraderHelper } from "@spt/helpers/TraderHelper";
import { PreSptModLoader } from "@spt/loaders/PreSptModLoader";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { ImageRouter } from "@spt/routers/ImageRouter";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { SaveServer } from "@spt/servers/SaveServer";
import { DatabaseService } from "@spt/services/DatabaseService";
import { RagfairPriceService } from "@spt/services/RagfairPriceService";
import { CustomItemService } from "@spt/services/mod/CustomItemService";
import { OnUpdateModService } from "@spt/services/mod/onUpdate/OnUpdateModService";
import { StaticRouterModService } from "@spt/services/mod/staticRouter/StaticRouterModService";
import { HashUtil } from "@spt/utils/HashUtil";
import { HttpResponseUtil } from "@spt/utils/HttpResponseUtil";
import { ImporterUtil } from "@spt/utils/ImporterUtil";
import { JsonUtil } from "@spt/utils/JsonUtil";
import { RandomUtil } from "@spt/utils/RandomUtil";
import { VFS } from "@spt/utils/VFS";

export class References 
{
    public container: DependencyContainer;
    public preSptModLoader: PreSptModLoader;
    public configServer: ConfigServer;
    public saveServer: SaveServer;
    public itemHelper: ItemHelper;
    public logger: ILogger;
    public staticRouter: StaticRouterModService;
    public onUpdateModService: OnUpdateModService;

    public database: DatabaseServer;
    public databaseService: DatabaseService;
    public customItem: CustomItemService;
    public imageRouter: ImageRouter;
    public jsonUtil: JsonUtil;
    public profileHelper: ProfileHelper;
    public ragfairPriceService: RagfairPriceService;
    public importerUtil: ImporterUtil;
    public vfs: VFS;
    public tables: IDatabaseTables;
    public botHelper: BotHelper;
    public randomUtil: RandomUtil;
    public hashUtil: HashUtil;
    public probHelper: ProbabilityHelper;
    public traderHelper: TraderHelper;
    public botController: BotController;
    public httpResponse: HttpResponseUtil;

    public preSptLoad(container: DependencyContainer): void 
    {
        this.container = container;
        this.preSptModLoader = container.resolve<PreSptModLoader>("PreSptModLoader");
        this.imageRouter = container.resolve<ImageRouter>("ImageRouter");
        this.configServer = container.resolve<ConfigServer>("ConfigServer");
        this.saveServer = container.resolve<SaveServer>("SaveServer");
        this.itemHelper = container.resolve<ItemHelper>("ItemHelper");
        this.logger = container.resolve<ILogger>("WinstonLogger");
        this.staticRouter = container.resolve<StaticRouterModService>("StaticRouterModService");
        this.onUpdateModService = container.resolve<OnUpdateModService>("OnUpdateModService");
        this.randomUtil = container.resolve<RandomUtil>("RandomUtil");
        this.database = container.resolve<DatabaseServer>("DatabaseServer");
        this.databaseService = container.resolve<DatabaseService>("DatabaseService");
        this.tables = this.databaseService.getTables();
        this.customItem = container.resolve<CustomItemService>("CustomItemService");
        this.jsonUtil = container.resolve<JsonUtil>("JsonUtil");
        this.profileHelper = container.resolve<ProfileHelper>("ProfileHelper");
        this.ragfairPriceService = container.resolve<RagfairPriceService>("RagfairPriceService");
        this.importerUtil = container.resolve<ImporterUtil>("ImporterUtil");
        this.vfs = container.resolve<VFS>("VFS");
        this.botHelper = container.resolve<BotHelper>("BotHelper");
        this.hashUtil = container.resolve<HashUtil>("HashUtil");
        this.probHelper = container.resolve<ProbabilityHelper>("ProbabilityHelper");
        this.traderHelper = container.resolve<TraderHelper>("TraderHelper");
        this.botController = container.resolve<BotController>("BotController");
        this.httpResponse = container.resolve<HttpResponseUtil>("HttpResponseUtil");
    }

    public postDBLoad(container: DependencyContainer): void 
    {
        this.container = container;
        this.database = container.resolve<DatabaseServer>("DatabaseServer");
        this.imageRouter = container.resolve<ImageRouter>("ImageRouter");
        this.logger = container.resolve<ILogger>("WinstonLogger");
        this.tables = container.resolve<DatabaseServer>("DatabaseServer").getTables();
        this.customItem = container.resolve<CustomItemService>("CustomItemService");
        this.jsonUtil = container.resolve<JsonUtil>("JsonUtil");
        this.profileHelper = container.resolve<ProfileHelper>("ProfileHelper");
        this.ragfairPriceService = container.resolve<RagfairPriceService>("RagfairPriceService");
        this.importerUtil = container.resolve<ImporterUtil>("ImporterUtil");
        this.vfs = container.resolve<VFS>("VFS");
        this.botHelper = container.resolve<BotHelper>("BotHelper");
        this.randomUtil = container.resolve<RandomUtil>("RandomUtil");
        this.itemHelper = container.resolve<ItemHelper>("ItemHelper");
        this.hashUtil = container.resolve<HashUtil>("HashUtil");
        this.probHelper = container.resolve<ProbabilityHelper>("ProbabilityHelper");
        this.botController = container.resolve<BotController>("BotController");
        this.httpResponse = container.resolve<HttpResponseUtil>("HttpResponseUtil");
    }
}