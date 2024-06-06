import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({ origin: "*" });
	app.setGlobalPrefix('api');
	const config = new DocumentBuilder()
		.setTitle('API example')
		.setDescription('Management API of users and their posts')
		.setVersion('0.0.1')
		.addTag('management')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api/docs', app, document);

	await app.listen(3000);
}
bootstrap();
