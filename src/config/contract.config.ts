import { ContractConfigType } from "./config.type";

export const contractConfig: ContractConfigType = {
	"DEVNET": {
		"ExchangePackageId": "0xe6a7dc1ea2176a1eddf7e57bb1beb7dc7f4cab3a",
		"VaultObjectId": "0xa71513c8c2dce683ad1c3d5a317a78cc9a2ad91e",
		"PositionsObjectId": "0x21c5535daa7b02cd49484abe8a15a564b4bc0efc",
		"ManagerCapObjectId": "0x10e7c0004377b79bad0e700d9187494c8191bfbe",
		"TimeOraclePackageId": "0xd702f90e8c193935c1698a3d082b5dbf4c440805",
		"PriceOraclePackageId": "0xd761ae94019061d3ea91201e415dc0f66d3f5164",
		"TimeOracleObjectId": "0x1b9979aa6f60cdc758656952184054ff611453cc",
		"PriceFeedStorageObjectId": "0x7b7c6b0a27492516ad8a5ec3080fde039a113680",
		"Coin": {
			"BTC": {
				"PackageId": "0x1d48e0c74ab73ade13e1dba1a3ed9a9079ca7bdf",
				"PriceFeedObjectId": "0x5ec1625e8bc2920766b25992f74fdcd532a877cb",
				"PriceFeedId": "fbd7c495fcc83ec7ce6522eb44a453a70f88ef64664f1ed49e011be87ffe3525",
				"Type": "0x1d48e0c74ab73ade13e1dba1a3ed9a9079ca7bdf::btc::BTC",
				"PoolObjectId": "0x17eb28beef5ac6bd2b18543836db42517c302f5f",
				"PoolDataObjectId": "0x992296ba4ae5c58c1630eb0d48351c2dd0c71046"
			},
			"ETH": {
				"PackageId": "0x1d48e0c74ab73ade13e1dba1a3ed9a9079ca7bdf",
				"PriceFeedObjectId": "0xfe540ef9ad1b803bb944685af58327df1b642c27",
				"PriceFeedId": "3b3852469b9667b95ce1ef1fe4ceba4ebba4e07b42acda4e8e3246598e5cb73f",
				"Type": "0x1d48e0c74ab73ade13e1dba1a3ed9a9079ca7bdf::eth::ETH",
				"PoolObjectId": "0xa2658ff3c1518121e1d88f0f2807fa5a272bf4e7",
				"PoolDataObjectId": "0x8db0469ff84effd2544692ee07e253b0c0388352"
			},
			"USDC": {
				"PackageId": "0x1d48e0c74ab73ade13e1dba1a3ed9a9079ca7bdf",
				"PriceFeedObjectId": "0x45252dac3403b8e76e745a9e0e5278e23df369b2",
				"PriceFeedId": "348eb3a88317813f7541e4008843b907822259c008a2793e43edce2d1360e27d",
				"Type": "0x1d48e0c74ab73ade13e1dba1a3ed9a9079ca7bdf::usdc::USDC",
				"PoolObjectId": "0xa74f9d833f840b4061d324b31af65a4c885f8062",
				"PoolDataObjectId": "0xd83f054c19fc35b7ceff99c8730de58c3236acb1"
			},
			"SUI": {
				"PackageId": "0x0000000000000000000000000000000000000002",
				"PriceFeedObjectId": "0x93cd9fb3fc32712aad51afdb3b05847801acbd13",
				"PriceFeedId": "16c3533d98cb020a2304c7f26169ac2597079f9aac853dd141d0aff86f540d56",
				"Type": "0x0000000000000000000000000000000000000002::sui::SUI",
				"PoolObjectId": "0x1b9cd4beb2dae4ade135c4866bac19c239f92fb0",
				"PoolDataObjectId": "0xe9c5e17fe47dfc1d6733099f51386ba404cb5508"
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
