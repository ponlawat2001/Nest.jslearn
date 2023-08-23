import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { News } from 'src/interface/news.interface';
import NewsService from 'src/provider/news.service';

@Controller('news')
class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get('findOne/:id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.newsService.findOne(id);
  }

  @Get('findAll')
  async findAll(): Promise<any> {
    return this.newsService.findAll();
  }

  @Get('findCount')
  async findCount(): Promise<any> {
    return this.newsService.findCount();
  }

  @Post('create')
  async create(@Body() body: News): Promise<any> {
    return this.newsService.create(body);
  }
}
export default NewsController;
