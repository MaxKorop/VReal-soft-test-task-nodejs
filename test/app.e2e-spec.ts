import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

describe('AppController (e2e)', () => {
  	let app: INestApplication;

  	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
	  		imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe({
	  		transform: true,
	  		whitelist: true,
		}));
		app.enableCors({ origin: '*' });
		app.setGlobalPrefix('api');
			
		const config = new DocumentBuilder()
      	.setTitle('API example')
		.setDescription('Management API of users and their posts')
		.setVersion('0.0.1')
		.addTag('Management API')
		.addBearerAuth(
			{
			type: 'http',
			scheme: 'Bearer',
			bearerFormat: 'JWT',
			in: 'header',
			name: 'Authorization',
			description: 'Please enter token (JWT)',
			},
			'JWT-auth',
		)
		.build();
		const document = SwaggerModule.createDocument(app, config);
		SwaggerModule.setup('api/docs', app, document);
		await app.init();
	});

  	afterAll(async () => {
		await app.close();
  	});

  	it('/GET api/docs', () => {
		return request(app.getHttpServer())
			.get('/api/docs')
			.expect(200);
  	});
});
