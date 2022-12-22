import { ContractConfigType } from "./config.type";

export const contractConfig: ContractConfigType = {
	"DEVNET": {
		"ExchangePackageId": "0xf6f4e0459f429e5247e7a9ba4d95d730532bb0bf",
		"VaultObjectId": "0x81e6b66cb3fa30fea648de0e547f9f1881198269",
		"PositionsObjectId": "0x71b6187f25bb3e90eab9d5bc014ae96e2bad3043",
		"ManagerCapObjectId": "0x37a8fd0627b964c167308cdb7bd85d7aa3987738",
		"TimeOraclePackageId": "0xcc3bb45c48cdde1a8c99d756db1ecab9dcfb7005",
		"PriceOraclePackageId": "0x4d5445f5e06ba3598d5f3c851ded4240684c06a8",
		"TimeOracleObjectId": "0xe3e6ec368588aecfbb4d4d5fa4440a403e2d0264",
		"PriceFeedStorageObjectId": "0x416289c352ebbe67e72629685d0b44739eb662c3",
		"Coin": {
			"BTC": {
				"PackageId": "0xbbb52e39a23992c3ae1486a0f976c4386d76691c",
				"PriceFeedObjectId": "0x32527e861c7f336c393a8e2ed31af4192def3f72",
				"PriceFeedId": "fbd7c495fcc83ec7ce6522eb44a453a70f88ef64664f1ed49e011be87ffe3525",
				"Type": "0xbbb52e39a23992c3ae1486a0f976c4386d76691c::btc::BTC",
				"PoolObjectId": "0x74fcf6456164c15b12e84d628f34d708c1d9b502",
				"PoolDataObjectId": "0xbb9dbfd35befce95b8c7ac071ba643393a0e01b3"
			},
			"ETH": {
				"PackageId": "0xbbb52e39a23992c3ae1486a0f976c4386d76691c",
				"PriceFeedObjectId": "0x49c226766eb3c983348a12becd025fc20f603391",
				"PriceFeedId": "3b3852469b9667b95ce1ef1fe4ceba4ebba4e07b42acda4e8e3246598e5cb73f",
				"Type": "0xbbb52e39a23992c3ae1486a0f976c4386d76691c::eth::ETH",
				"PoolObjectId": "0x6174dee6f0872be5222de9dd1067c8e2916cb694",
				"PoolDataObjectId": "0xe63caf914ff154682765ea31c4dda07d080c9bb0"
			},
			"USDC": {
				"PackageId": "0xbbb52e39a23992c3ae1486a0f976c4386d76691c",
				"PriceFeedObjectId": "0x7931aed4b2eeda8a6c9af769cf9182abf90372a8",
				"PriceFeedId": "348eb3a88317813f7541e4008843b907822259c008a2793e43edce2d1360e27d",
				"Type": "0xbbb52e39a23992c3ae1486a0f976c4386d76691c::usdc::USDC",
				"PoolObjectId": "0x45080fdb11ccefa3cbaeb89459e3692ebad1279e",
				"PoolDataObjectId": "0x7765f3b31ac0100ccf8a092c0897c9a0bc588cde"
			},
			"SUI": {
				"PackageId": "0x0000000000000000000000000000000000000002",
				"PriceFeedObjectId": "0x7fbb4522e74997f5d4cdf01163f049ebdc17e283",
				"PriceFeedId": "16c3533d98cb020a2304c7f26169ac2597079f9aac853dd141d0aff86f540d56",
				"Type": "0x0000000000000000000000000000000000000002::sui::SUI",
				"PoolObjectId": "0xff045d3d2e9301e3933a06224ee60a3316a4754c",
				"PoolDataObjectId": "0x05ffb2f43a670fdb238bcbf1f80507557890ad0b"
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
