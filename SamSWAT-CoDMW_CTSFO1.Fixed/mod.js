"use strict";

let mydb;

class Mod {
    async postDBLoadAsync(container) {
        const db = container.resolve("DatabaseServer").getTables();
        const modLoader = container.resolve("PreAkiModLoader");
        const importerUtil = container.resolve("ImporterUtil");
        const locales = db.locales.global;
        const items = db.templates.items;
        const handbook = db.templates.handbook.Items;

        mydb = await importerUtil.loadRecursiveAsync(`${modLoader.getModPath("SamSWAT-CoDMW_CTSFO1.Fixed")}database/`);

        db.templates.items["55d7217a4bdc2d86028b456d"]._props.Slots[13]._props.filters[0].Filter.push("item_equipment_glasses_ctsfo1");
        db.templates.items["55d7217a4bdc2d86028b456d"]._props.Slots[5]._props.filters[0].Filter.push("item_equipment_helmet_ctsfo1");

        for (const item in mydb.templates.items) {
            items[item] = mydb.templates.items[item];
        }

        for (const item of Object.values(mydb.templates.handbook.Items)) {
            handbook.push(item)
        }

        for (const locale of Object.values(locales)) {
            locale['CTSFO1UPPERBODYSUIT Name'] = "Mil-Sim: CTSFO I Upper";
            locale["CTSFO1PANTSSUIT Name"] = "Mil-Sim: CTSFO I Pants";

            for (const [itemId, template] of Object.entries(mydb.locales.en.templates)) {
                for (const [key, value] of Object.entries(template)) {
                    locale[`${itemId} ${key}`] = value;
                }
            }
        }

        for (const item in mydb.templates.customization) {
            db.templates.customization[item] = mydb.templates.customization[item];
        }

        for (const suit of mydb.traders.ragman.suits) {
            db.traders["5ac3b934156ae10c4430e83c"].suits.push(suit);
        }
		
		for (const item of mydb.traders.assort.assorts.items) {
            db.traders[mydb.traders.assort.traderId].assort.items.push(item);
        }

        for (const bc in mydb.traders.assort.assorts.barter_scheme) {
            db.traders[mydb.traders.assort.traderId].assort.barter_scheme[bc] = mydb.traders.assort.assorts.barter_scheme[bc];
        }

        for (const level in mydb.traders.assort.assorts.loyal_level_items) {
            db.traders[mydb.traders.assort.traderId].assort.loyal_level_items[level] = mydb.traders.assort.assorts.loyal_level_items[level];
        }

        Mod.addToFilters(db);
    }

    static addToFilters(db) {
        const isModFilterExist = (slots) => slots.findIndex((slot) => slot._name === "mod_equipment_001");
        const isItemSlotsExist = (item) => item._props.Slots && item._props.Slots.length > 0;
        const filtersIncludeAttachment = (filterArray) => filterArray.includes("5a16b9fffcdbcb0176308b34");
        for (const item of Object.values(db.templates.items)) {
            if (isItemSlotsExist(item)) {
                const index = isModFilterExist(item._props.Slots);
                if (index > -1 && filtersIncludeAttachment(item._props.Slots[index]._props.filters[0].Filter)) {
                    item._props.Slots[index]._props.filters[0].Filter.push("item_equipment_headset_ctsfo1");
                }
            }
        }
    }
}

module.exports = { mod: new Mod() }