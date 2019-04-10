const mockAxios = jest.fn();

jest.mock("axios", () => ({
  get: mockAxios
}));

const {
  setCache,
  isValidData,
  fetchData,
  getIdentity
} = require("./identityRegistry");

const freshData = {
  data: {
    issuers: {
      "0x01": "Foo(Fresh)",
      "0x02": "Bar(Fresh)",
      "0xab": "Moo(Fresh)"
    }
  }
};

const cachedData = {
  data: {
    issuers: {
      "0x01": "Foo(Cached)",
      "0x02": "Bar(Cached)",
      "0xab": "Moo(Cached)"
    }
  }
};

const whenHasCachedData = () => {
  setCache(cachedData, Date.now() + 1000);
};

describe("identityRegistry", () => {
  beforeEach(() => {
    setCache(undefined, undefined);
    mockAxios.mockReset();
    mockAxios.mockResolvedValue(freshData);
  });

  describe("isValidData", () => {
    it("returns false if cache is not set", () => {
      expect(isValidData()).toBe(false);
    });

    it("returns false if cache is set but has expired", () => {
      setCache("stuffs", Date.now() - 1000);
      expect(isValidData()).toBe(false);
    });

    it("returns true if cache is set and has not expired", () => {
      setCache("stuffs", Date.now() + 1000);
      expect(isValidData()).toBe(true);
    });
  });

  describe("fetchData", () => {
    it("returns data from cache if data is valid", async () => {
      whenHasCachedData();

      const res = await fetchData();
      expect(res).toEqual(cachedData);
    });

    it("returns data from registry if cache is not set", async () => {
      const res = await fetchData();
      expect(res).toEqual(freshData);
    });
  });

  describe("getIdentity", () => {
    it("returns name of identity if the identifier resolves", async () => {
      const identifier = "0x01";
      const res = await getIdentity(identifier);
      expect(res).toBe("Foo(Fresh)");
    });

    it("returns name of identity if the identifier (in another case) resolves", async () => {
      const identifier = "0xAB";
      const res = await getIdentity(identifier);
      expect(res).toBe("Moo(Fresh)");
    });

    it("returns undefined if the identifier does not resolves", async () => {
      const identifier = "0x05";
      const res = await getIdentity(identifier);
      expect(res).toEqual(undefined);
    });
  });
});
