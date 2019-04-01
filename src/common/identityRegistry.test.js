const proxquire = require("proxyquire");
const sinon = require("sinon");

const axios = sinon.stub();
const { setCache, isValidData, fetchData, getIdentity } = proxquire(
  "./identityRegistry",
  {
    axios: { get: axios }
  }
);

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
    axios.reset();
    axios.resolves(freshData);
  });

  describe("isValidData", () => {
    it("returns false if cache is not set", () => {
      expect(isValidData()).to.eql(false);
    });

    it("returns false if cache is set but has expired", () => {
      setCache("stuffs", Date.now() - 1000);
      expect(isValidData()).to.eql(false);
    });

    it("returns true if cache is set and has not expired", () => {
      setCache("stuffs", Date.now() + 1000);
      expect(isValidData()).to.eql(true);
    });
  });

  describe("fetchData", () => {
    it("returns data from cache if data is valid", async () => {
      whenHasCachedData();

      const res = await fetchData();
      expect(res).to.eql(cachedData);
    });

    it("returns data from registry if cache is not set", async () => {
      const res = await fetchData();
      expect(res).to.eql(freshData);
    });
  });

  describe("getIdentity", () => {
    it("returns name of identity if the identifier resolves", async () => {
      const identifier = "0x01";
      const res = await getIdentity(identifier);
      expect(res).to.eql("Foo(Fresh)");
    });

    it("returns name of identity if the identifier (in another case) resolves", async () => {
      const identifier = "0xAB";
      const res = await getIdentity(identifier);
      expect(res).to.eql("Moo(Fresh)");
    });

    it("returns undefined if the identifier does not resolves", async () => {
      const identifier = "0x05";
      const res = await getIdentity(identifier);
      expect(res).to.eql(undefined);
    });
  });
});
