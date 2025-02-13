import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL');
    const key = this.configService.get<string>('SUPABASE_ANON_KEY');
    this.supabase = createClient(url, key);
  }

  async getData() {
    const { data, error } = await this.supabase.from('your_table').select('*');
    if (error) throw new Error(error.message);
    return data;
  }
}
