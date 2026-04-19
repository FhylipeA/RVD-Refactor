"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegradorDmsNbsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const integrador_dms_nbs_service_1 = require("./integrador-dms-nbs.service");
let IntegradorDmsNbsModule = class IntegradorDmsNbsModule {
};
exports.IntegradorDmsNbsModule = IntegradorDmsNbsModule;
exports.IntegradorDmsNbsModule = IntegradorDmsNbsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                name: 'nbs-dms',
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'oracle',
                    host: config.get('NBS_DATABASE_HOST'),
                    port: config.get('NBS_DATABASE_PORT'),
                    username: config.get('NBS_DATABASE_USER'),
                    password: config.get('NBS_DATABASE_PASS'),
                    sid: config.get('NBS_DATABASE_SID'),
                    synchronize: false,
                    entities: [],
                    extra: {
                        queueTimeout: 120000,
                        poolMin: 2,
                        poolMax: 10,
                        poolPingInterval: 60000,
                        poolTimeout: 300000,
                    },
                }),
            }),
        ],
        providers: [integrador_dms_nbs_service_1.IntegradorDmsNbsService],
        exports: [integrador_dms_nbs_service_1.IntegradorDmsNbsService],
    })
], IntegradorDmsNbsModule);
//# sourceMappingURL=integrador-dms-nbs.module.js.map