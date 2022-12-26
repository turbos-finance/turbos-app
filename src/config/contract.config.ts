import { ContractConfigType } from "./config.type";

export const contractConfig: ContractConfigType = {
	"DEVNET": {
    "ExchangePackageId": "0xb0ed4e3dde7482a513f1e5db7ed88e4dfed78c3f",
    "VaultObjectId": "0x1f2ffbe9ea457a6d0fc768e1a210e21131e7ddb6",
    "PositionsObjectId": "0xad7f16af192436f33e1bdd416d625282c6ef901a",
    "ManagerCapObjectId": "0x331fd54343787044e6181a000e50db7294cd0d0d",
    "TimeOraclePackageId": "0x268496428ee1ad90e62cfaca5d44e6ae6584eec3",
    "PriceOraclePackageId": "0x8542a56d4aaba0f79dc56a0d7417871d4cd61cc7",
    "TimeOracleObjectId": "0xf5a44a9834fddcc941668ab8b9e27c353e854911",
    "PriceFeedStorageObjectId": "0x0b4e156548a5cd1e86d19f3669f3c4dd36d7f509",
    "Coin": {
      "BTC": {
        "PackageId": "0xbe76f977de1d4cfae56b79f6f87c1436b6da4abd",
        "PriceFeedObjectId": "0x96e935a7d0c906ab35e8e3844fc5824b463b6950",
        "PriceFeedId": "fbd7c495fcc83ec7ce6522eb44a453a70f88ef64664f1ed49e011be87ffe3525",
        "Type": "0xbe76f977de1d4cfae56b79f6f87c1436b6da4abd::btc::BTC",
        "PoolObjectId": "0x4904bb76da0c6645301538e7c1f8083a4437c705",
        "PoolDataObjectId": "0x0f675e42c1ec8f1053aafca2b533a13463c9419d"
      },
      "ETH": {
        "PackageId": "0xbe76f977de1d4cfae56b79f6f87c1436b6da4abd",
        "PriceFeedObjectId": "0xecd480e2b293484942be2312c4cebe6db8d14f21",
        "PriceFeedId": "3b3852469b9667b95ce1ef1fe4ceba4ebba4e07b42acda4e8e3246598e5cb73f",
        "Type": "0xbe76f977de1d4cfae56b79f6f87c1436b6da4abd::eth::ETH",
        "PoolObjectId": "0xffda2d525a78cac5af2e2bb749b11a63b7a467b6",
        "PoolDataObjectId": "0xc7dab908c8535e3c398a04715376cc572bb47a21"
      },
      "USDC": {
        "PackageId": "0xbe76f977de1d4cfae56b79f6f87c1436b6da4abd",
        "PriceFeedObjectId": "0x4a5efec4d48d044079806c678daa3ca4707123ca",
        "PriceFeedId": "348eb3a88317813f7541e4008843b907822259c008a2793e43edce2d1360e27d",
        "Type": "0xbe76f977de1d4cfae56b79f6f87c1436b6da4abd::usdc::USDC",
        "PoolObjectId": "0xe859cf9f90794b7ed220cf9d4cc79cda67bcb9a8",
        "PoolDataObjectId": "0xb069a89b0d30d28f944077b4f9e0b6bd282831fd"
      },
      "SUI": {
        "PackageId": "0x0000000000000000000000000000000000000002",
        "PriceFeedObjectId": "0xa96ec3484a6403b61ca529438209d5063f25a115",
        "PriceFeedId": "16c3533d98cb020a2304c7f26169ac2597079f9aac853dd141d0aff86f540d56",
        "Type": "0x0000000000000000000000000000000000000002::sui::SUI",
        "PoolObjectId": "0x9cee0fa7a70bedbba6babf4461a7eb05a58debce",
        "PoolDataObjectId": "0x153bce83eac136caf81458d0c50983dc18c8f2ef"
      }
    }
  },
	"TESTNET": {
		"ExchangePackageId": "0x6f61945aa55430cb80c65e4c88e811ad48983a2e",
		"VaultObjectId": "0xfb86e4714cac48c8c86f36348255975856a92fe9",
		"PositionsObjectId": "0x822381714df6ec5fd7bd93a3c306d3955a364322",
		"ManagerCapObjectId": "0x45bfa2623532dddc1a085ce5cf6b31cb8e332e56",
		"TimeOraclePackageId": "0x57e49a481e5714ee11ed09e916728e4c53fcde3e",
		"PriceOraclePackageId": "0x71e60c1c4c8fb5e6ae419ad7b122483218471f85",
		"TimeOracleObjectId": "0x57e49a481e5714ee11ed09e916728e4c53fcde3e",
		"PriceFeedStorageObjectId": "0x1d6df39b01605dd50cb0f4bb3c27e03eefdaedee",
		"Coin": {
			"BTC": {
				"PackageId": "0x2d37b4f2e8382ed9494bac9a9f4a1ddb5b067d67",
				"PriceFeedObjectId": "0xf8043ceb62be9456f88abe519ba832f8421c5c72",
				"PriceFeedId": "fbd7c495fcc83ec7ce6522eb44a453a70f88ef64664f1ed49e011be87ffe3525",
				"Type": "0x2d37b4f2e8382ed9494bac9a9f4a1ddb5b067d67::btc::BTC",
				"PoolObjectId": "0xdccaf9e100e6cca56af266190ad89f2502e45c91",
				"PoolDataObjectId": "0xea35b6a0c53b293f96148a786e25cd6c71d6ba2f"
			},
			"ETH": {
				"PackageId": "0x2d37b4f2e8382ed9494bac9a9f4a1ddb5b067d67",
				"PriceFeedObjectId": "0x11b3b9710b904be694e5f4f98e22c275bbe11b8f",
				"PriceFeedId": "3b3852469b9667b95ce1ef1fe4ceba4ebba4e07b42acda4e8e3246598e5cb73f",
				"Type": "0x2d37b4f2e8382ed9494bac9a9f4a1ddb5b067d67::eth::ETH",
				"PoolObjectId": "0x81d3a4da010d483af43165a007722effea0788b4",
				"PoolDataObjectId": "0x75b70e9131e7df65d49e604dd67ccebe95ccf652"
			},
			"USDC": {
				"PackageId": "0x2d37b4f2e8382ed9494bac9a9f4a1ddb5b067d67",
				"PriceFeedObjectId": "0x4fe7bd77b217793729b534a02f11527bc388bb18",
				"PriceFeedId": "348eb3a88317813f7541e4008843b907822259c008a2793e43edce2d1360e27d",
				"Type": "0x2d37b4f2e8382ed9494bac9a9f4a1ddb5b067d67::usdc::USDC",
				"PoolObjectId": "0x2a3cf9014d717ba53844782fc3463ec7056382bd",
				"PoolDataObjectId": "0x46778ccfa952013142bb3dac4b063e3932b1136d"
			},
			"SUI": {
				"PackageId": "0x0000000000000000000000000000000000000002",
				"PriceFeedObjectId": "0x1f4aba162d030ef629b8146b6b5dec495cc99396",
				"PriceFeedId": "16c3533d98cb020a2304c7f26169ac2597079f9aac853dd141d0aff86f540d56",
				"Type": "0x0000000000000000000000000000000000000002::sui::SUI",
				"PoolObjectId": "0xd96821d81c0d7fecc9e20e7e896401703bf76a65",
				"PoolDataObjectId": "0xba6fe9e04df32a0ee6f0d165dec22eebd20af441"
			}
		}
	},
	"MAINNET": {
		"ExchangePackageId": "0x6f61945aa55430cb80c65e4c88e811ad48983a2e",
		"VaultObjectId": "0xfb86e4714cac48c8c86f36348255975856a92fe9",
		"PositionsObjectId": "0x822381714df6ec5fd7bd93a3c306d3955a364322",
		"ManagerCapObjectId": "0x45bfa2623532dddc1a085ce5cf6b31cb8e332e56",
		"TimeOraclePackageId": "0x57e49a481e5714ee11ed09e916728e4c53fcde3e",
		"PriceOraclePackageId": "0x71e60c1c4c8fb5e6ae419ad7b122483218471f85",
		"TimeOracleObjectId": "0x57e49a481e5714ee11ed09e916728e4c53fcde3e",
		"PriceFeedStorageObjectId": "0x1d6df39b01605dd50cb0f4bb3c27e03eefdaedee",
		"Coin": {
			"BTC": {
				"PackageId": "0x2d37b4f2e8382ed9494bac9a9f4a1ddb5b067d67",
				"PriceFeedObjectId": "0xf8043ceb62be9456f88abe519ba832f8421c5c72",
				"PriceFeedId": "fbd7c495fcc83ec7ce6522eb44a453a70f88ef64664f1ed49e011be87ffe3525",
				"Type": "0x2d37b4f2e8382ed9494bac9a9f4a1ddb5b067d67::btc::BTC",
				"PoolObjectId": "0xdccaf9e100e6cca56af266190ad89f2502e45c91",
				"PoolDataObjectId": "0xea35b6a0c53b293f96148a786e25cd6c71d6ba2f"
			},
			"ETH": {
				"PackageId": "0x2d37b4f2e8382ed9494bac9a9f4a1ddb5b067d67",
				"PriceFeedObjectId": "0x11b3b9710b904be694e5f4f98e22c275bbe11b8f",
				"PriceFeedId": "3b3852469b9667b95ce1ef1fe4ceba4ebba4e07b42acda4e8e3246598e5cb73f",
				"Type": "0x2d37b4f2e8382ed9494bac9a9f4a1ddb5b067d67::eth::ETH",
				"PoolObjectId": "0x81d3a4da010d483af43165a007722effea0788b4",
				"PoolDataObjectId": "0x75b70e9131e7df65d49e604dd67ccebe95ccf652"
			},
			"USDC": {
				"PackageId": "0x2d37b4f2e8382ed9494bac9a9f4a1ddb5b067d67",
				"PriceFeedObjectId": "0x4fe7bd77b217793729b534a02f11527bc388bb18",
				"PriceFeedId": "348eb3a88317813f7541e4008843b907822259c008a2793e43edce2d1360e27d",
				"Type": "0x2d37b4f2e8382ed9494bac9a9f4a1ddb5b067d67::usdc::USDC",
				"PoolObjectId": "0x2a3cf9014d717ba53844782fc3463ec7056382bd",
				"PoolDataObjectId": "0x46778ccfa952013142bb3dac4b063e3932b1136d"
			},
			"SUI": {
				"PackageId": "0x0000000000000000000000000000000000000002",
				"PriceFeedObjectId": "0x1f4aba162d030ef629b8146b6b5dec495cc99396",
				"PriceFeedId": "16c3533d98cb020a2304c7f26169ac2597079f9aac853dd141d0aff86f540d56",
				"Type": "0x0000000000000000000000000000000000000002::sui::SUI",
				"PoolObjectId": "0xd96821d81c0d7fecc9e20e7e896401703bf76a65",
				"PoolDataObjectId": "0xba6fe9e04df32a0ee6f0d165dec22eebd20af441"
			}
		}
	}
};
