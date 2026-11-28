import { INestApplication } from '@nestjs/common';

export const SetupSwagger = async (app: INestApplication): Promise<void> => {
    if (process.env.NODE_ENV === 'production') return;
    const { DocumentBuilder, SwaggerModule } = await import('@nestjs/swagger');

    const config = new DocumentBuilder()
        .setTitle('Inventory Management API')
        .setDescription('SaaS Based Inventory Management System')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
};