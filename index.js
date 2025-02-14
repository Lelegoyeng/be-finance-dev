const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');
const { NestExpressApplication } = require('@nestjs/platform-express');
const { SwaggerModule, DocumentBuilder } = require('@nestjs/swagger');
const express = require('express');

const start = async () => {
    const app = await NestFactory.create(NestExpressApplication, AppModule);

    // Swagger setup
    const config = new DocumentBuilder()
        .setTitle('My Finance API')
        .setDescription('My Finance API description')
        .setVersion('1.0')
        .addTag('finance')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('', app, document);  // Swagger UI di root

    app.use(express.static('public'));

    await app.listen(3000); // Gunakan port dari Vercel
};

start();
