import { MidaBroker } from "#brokers/MidaBroker";
import { MidaBrokerAccountParameters } from "#brokers/MidaBrokerAccountParameters";
import { MidaBrokerAccountType } from "#brokers/MidaBrokerAccountType";
import { MidaBrokerErrorType } from "#brokers/MidaBrokerErrorType";
import { MidaEvent } from "#events/MidaEvent";
import { MidaEventListener } from "#events/MidaEventListener";
import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
import { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";
import { MidaBrokerOrderStatusType } from "#orders/MidaBrokerOrderStatusType";
import { MidaSymbolPeriod } from "#periods/MidaSymbolPeriod";
import { MidaSymbolQuotationPriceType } from "#quotations/MidaSymbolQuotationPriceType";
import { MidaSymbol } from "#symbols/MidaSymbol";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { MidaEmitter } from "#utilities/emitters/MidaEmitter";
import { GenericObject } from "#utilities/GenericObject";

/** Represents a broker account. */
export abstract class MidaBrokerAccount {
    private readonly _id: string;
    private readonly _ownerName: string;
    private readonly _type: MidaBrokerAccountType;
    private readonly _currency: string;
    private readonly _broker: MidaBroker;
    private readonly _emitter: MidaEmitter;

    protected constructor ({ id, ownerName, type, currency, broker, }: MidaBrokerAccountParameters) {
        this._id = id;
        this._ownerName = ownerName;
        this._type = type;
        this._currency = currency;
        this._broker = broker;
        this._emitter = new MidaEmitter();
    }

    /** The account id. */
    public get id (): string {
        return this._id;
    }

    /** The account owner name. */
    public get ownerName (): string {
        return this._ownerName;
    }

    /** The account type (demo or real). */
    public get type (): MidaBrokerAccountType {
        return this._type;
    }

    /** The account currency (ISO code). */
    public get currency (): string {
        return this._currency;
    }

    /** The account broker. */
    public get broker (): MidaBroker {
        return this._broker;
    }

    /** Used to get the account balance. */
    public abstract getBalance (): Promise<number>;

    /** Used to get the account equity. */
    public abstract getEquity (): Promise<number>;

    /** Used to get the account used margin. */
    public abstract getUsedMargin (): Promise<number>;

    /** Used to get the account orders. */
    public abstract getOrders (): Promise<MidaBrokerOrder[]>;

    /**
     * Used to get an order.
     * @param ticket The order ticket.
     */
    public abstract getOrder (ticket: number): Promise<MidaBrokerOrder | undefined>;

    /**
     * Used to get the gross profit of an order (the order must be in open or closed state).
     * @param ticket The order ticket.
     */
    public abstract getOrderGrossProfit (ticket: number): Promise<number>;

    /**
     * Used to get the net profit of an order (the order must be in open or closed state).
     * @param ticket The order ticket.
     */
    public abstract getOrderNetProfit (ticket: number): Promise<number>;

    /**
     * Used to get the swaps of an order (the order must be in open or closed state).
     * @param ticket The order ticket.
     */
    public abstract getOrderSwaps (ticket: number): Promise<number>;

    /**
     * Used to get the commission of an order.
     * @param ticket The order ticket.
     */
    public abstract getOrderCommission (ticket: number): Promise<number>;

    /**
     * Used to place an order.
     * @param directives The order directives.
     */
    public abstract placeOrder (directives: MidaBrokerOrderDirectives): Promise<MidaBrokerOrder>;

    /**
     * Used to cancel an order (the order must be in pending state).
     * @param ticket The order ticket.
     */
    public abstract cancelOrder (ticket: number): Promise<void>;

    /**
     * Used to close an order (the order must be in open state).
     * @param ticket The order ticket.
     */
    public abstract closeOrder (ticket: number): Promise<void>;

    /**
     * Used to get the stop loss of an order.
     * @param ticket The order ticket.
     */
    public abstract getOrderStopLoss (ticket: number): Promise<number | undefined>;

    /**
     * Used to set the stop loss of an order.
     * @param ticket The order ticket.
     * @param stopLoss The stop loss.
     */
    public abstract setOrderStopLoss (ticket: number, stopLoss: number): Promise<void>;

    /**
     * Used to clear the stop loss of an order.
     * @param ticket The order ticket.
     */
    public abstract clearOrderStopLoss (ticket: number): Promise<void>;

    /**
     * Used to get the take profit of an order.
     * @param ticket The order ticket.
     */
    public abstract getOrderTakeProfit (ticket: number): Promise<number | undefined>;

    /**
     * Used to set the take profit of an order.
     * @param ticket The order ticket.
     * @param takeProfit The take profit.
     */
    public abstract setOrderTakeProfit (ticket: number, takeProfit: number): Promise<void>;

    /**
     * Used to clear the take profit of an order.
     * @param ticket The order ticket.
     */
    public abstract clearOrderTakeProfit (ticket: number): Promise<void>;

    /** Used to get the account symbols. */
    public abstract getSymbols (): Promise<string[]>;

    /**
     * Used to get a symbol by its string representation.
     * @param symbol The string representation of the symbol.
     */
    public abstract getSymbol (symbol: string): Promise<MidaSymbol | undefined>;

    /**
     * Used to know if a symbol market is open.
     * @param symbol The string representation of the symbol.
     */
    public abstract isSymbolMarketOpen (symbol: string): Promise<boolean>;

    /**
     * Used to get the most recent periods of a symbol.
     * @param symbol The string representation of the symbol.
     * @param timeframe The periods timeframe.
     * @param priceType The periods price type.
     */
    public abstract getSymbolPeriods (symbol: string, timeframe: number, priceType?: MidaSymbolQuotationPriceType): Promise<MidaSymbolPeriod[]>;

    /**
     * Used to get the latest symbol tick.
     * @param symbol The string representation of the symbol.
     */
    public abstract getSymbolLastTick (symbol: string): Promise<MidaSymbolTick | undefined>;

    /**
     * Used to get the latest symbol bid quote.
     * @param symbol The string representation of the symbol.
     */
    public abstract getSymbolBid (symbol: string): Promise<number>;

    /**
     * Used to get the latest symbol ask quote.
     * @param symbol The string representation of the symbol.
     */
    public abstract getSymbolAsk (symbol: string): Promise<number>;

    /**
     * Used to add a symbol to the symbols watch list.
     * @param symbol The string representation of the symbol.
     */
    public abstract watchSymbol (symbol: string): Promise<void>;

    /**
     * Used to get the symbols in the symbols watch list.
     */
    public abstract getWatchedSymbols (): Promise<string[]>;

    /**
     * Used to remove a symbol from the symbols watch list.
     * @param symbol The string representation of the symbol.
     */
    public abstract unwatchSymbol (symbol: string): Promise<void>;

    /** Used to get the account free margin. */
    public async getFreeMargin (): Promise<number> {
        const tasks: Promise<number>[] = [ this.getEquity(), this.getUsedMargin(), ];
        const [ equity, usedMargin, ]: number[] = await Promise.all(tasks);

        return equity - usedMargin;
    }

    /**
     * Used to get the account margin level.
     */
    public async getMarginLevel (): Promise<number> {
        const tasks: Promise<number>[] = [ this.getEquity(), this.getUsedMargin(), ];
        const [ equity, usedMargin, ]: number[] = await Promise.all(tasks);

        if (usedMargin === 0) {
            return NaN;
        }

        return equity / usedMargin * 100;
    }

    public async getOrdersByStatus (status: MidaBrokerOrderStatusType): Promise<MidaBrokerOrder[]> {
        const orders: MidaBrokerOrder[] = await this.getOrders();

        return orders.filter((order: MidaBrokerOrder): boolean => order.status === status);
    }

    public async getPendingOrders (): Promise<MidaBrokerOrder[]> {
        return this.getOrdersByStatus(MidaBrokerOrderStatusType.PENDING);
    }

    public async getCanceledOrders (): Promise<MidaBrokerOrder[]> {
        return this.getOrdersByStatus(MidaBrokerOrderStatusType.CANCELED);
    }

    public async getOpenOrders (): Promise<MidaBrokerOrder[]> {
        return this.getOrdersByStatus(MidaBrokerOrderStatusType.OPEN);
    }

    public async getClosedOrders (): Promise<MidaBrokerOrder[]> {
        return this.getOrdersByStatus(MidaBrokerOrderStatusType.CLOSED);
    }

    public async getPlaceOrderObstacles (directives: MidaBrokerOrderDirectives): Promise<MidaBrokerErrorType[]> {
        const obstacles: MidaBrokerErrorType[] = [];
        const symbol: MidaSymbol | undefined = await this.getSymbol(directives.symbol);

        if (!symbol) {
            obstacles.push(MidaBrokerErrorType.INVALID_SYMBOL);

            return obstacles;
        }

        const isMarketOpen: boolean = await symbol.isMarketOpen();

        if (!isMarketOpen) {
            obstacles.push(MidaBrokerErrorType.MARKET_CLOSED);
        }

        if (directives.lots < symbol.minLots || directives.lots > symbol.maxLots) {
            obstacles.push(MidaBrokerErrorType.INVALID_LOTS);
        }

        const freeMargin: number = await this.getFreeMargin();
        const requiredMargin: number = await symbol.getRequiredMargin(directives.type, directives.lots);

        if (freeMargin < requiredMargin) {
            obstacles.push(MidaBrokerErrorType.NOT_ENOUGH_MONEY);
        }

        return obstacles;
    }

    public async canPlaceOrder (directives: MidaBrokerOrderDirectives): Promise<boolean> {
        const obstacles: MidaBrokerErrorType[] = await this.getPlaceOrderObstacles(directives);

        return obstacles.length === 0;
    }

    public async tryPlaceOrder (directives: MidaBrokerOrderDirectives): Promise<MidaBrokerOrder | undefined> {
        try {
            return await this.placeOrder(directives);
        }
        catch {
            return undefined;
        }
    }

    public on (type: string, listener?: MidaEventListener): Promise<MidaEvent> | string {
        return this._emitter.on(type, listener);
    }

    public removeEventListener (uuid: string): void {
        this._emitter.removeEventListener(uuid);
    }

    protected notifyListeners (type: string, descriptor?: GenericObject): void {
        this._emitter.notifyListeners(type, descriptor);
    }
}
