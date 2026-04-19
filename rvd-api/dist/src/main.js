"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.setGlobalPrefix('api');
    BigInt.prototype.toJSON = function () {
        return this.toString();
    };
    const port = process.env.API_PORT ?? 3000;
    await app.listen(port);
    console.log(`Aplicação rodando em: http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map