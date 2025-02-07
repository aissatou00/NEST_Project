import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseService {
  connect() {
    console.log('Database connected');
  }
}
