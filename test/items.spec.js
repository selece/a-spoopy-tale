import ItemDB from "../src/spoopy/items";

describe("ItemDB", () => {
  const ITEMS_LIST = ["Skull", "Tome", "Amulet", "Bottle", "Pen"];

  let target;

  beforeEach(() => {
    target = new ItemDB();
  });

  describe("constructor", () => {
    test("data init to expected values", () => {
      expect(target.items.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("item_names()", () => {
    test("returns list of item names", () => {
      expect(target.item_names.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("random_item()", () => {
    test("returns a random item", () => {
      const res = target.random_item([]);
      expect(ITEMS_LIST).toContain(res.name);
    });

    test("returns a random item using exclusion list", () => {
      const res = target.random_item(["Skull"]);
      expect(ITEMS_LIST).toContain(res.name);
      expect(res.name).not.toEqual("Skull");
    });

    test("returns a random item with default param for exclusion", () => {
      const res = target.random_item();
      expect(["Skull", "Tome", "Amulet", "Bottle", "Pen"]).toContain(res.name);
    });
  });

  describe("exists()", () => {
    test("returns true for exisiting items", () => {
      expect(target.exists("Skull")).toEqual(true);
    });

    test("returns false for non-existent items", () => {
      expect(target.exists("Bad")).toEqual(false);
    });
  });

  describe("getDescription()", () => {
    test("returns expected description for no conditions (Skull)", () => {
      expect(target.getDescription("Skull")).toEqual(
        "The hollow eyes and broken teeth leer at you with an oddly jovial grin."
      );
    });

    test("returns expected description for conditions (Skull)", () => {
      expect(target.getDescription("Skull", { atLoc: "Foyer" })).toEqual(
        "!!! CONDITIONAL TEST !!!"
      );
    });

    test("returns default description when conditions are not met", () => {
      expect(target.getDescription("Skull", { atLoc: "Maze" })).toEqual(
        "The hollow eyes and broken teeth leer at you with an oddly jovial grin."
      );
    });

    test("throws error for non-existent item", () => {
      expect(() => target.getDescription("Bad")).toThrowError(/Item not found/);
    });
  });

  describe("item()", () => {
    test("returns a full JS object for valid item", () => {
      const res = target.item("Skull");

      expect(res.name).toEqual("Skull");

      expect(res.descriptions).toContainEqual(
        expect.objectContaining({
          text:
            "The hollow eyes and broken teeth leer at you with an oddly jovial grin.",
          conditions: {}
        })
      );

      expect(res.descriptions).toContainEqual(
        expect.objectContaining({
          text: "!!! CONDITIONAL TEST !!!",
          conditions: { atLoc: "Foyer" }
        })
      );

      expect(res.actions).toEqual({});
      expect(res.tags).toEqual({});
    });

    test("throws error if item does not exist", () => {
      expect(() => target.item("Bad")).toThrowError(/Item does not exist/);
    });
  });
});
