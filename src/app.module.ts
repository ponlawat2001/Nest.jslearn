import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import PreauthMiddleware from './middleware/preauth.middleware';
import NewsService from './provider/news.service';
import NewsController from './controller/news.controller';
import AuthController from './controller/auth.controller';
import AuthService from './provider/auth.service';
import FirebaseController from './controller/firebase.controller';
import UsersController from './controller/users.controller';
import UsersService from './provider/users.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    NewsController,
    AuthController,
    UsersController,
    FirebaseController,
  ],
  providers: [AppService, NewsService, AuthService, UsersService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PreauthMiddleware).forRoutes({
      path: 'news/*',
      method: RequestMethod.ALL,
    });
    consumer.apply(PreauthMiddleware).forRoutes({
      path: 'users/*',
      method: RequestMethod.ALL,
    });
  }
}
