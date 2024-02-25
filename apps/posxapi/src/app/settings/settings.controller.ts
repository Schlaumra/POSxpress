import { Controller, Get, Body, Patch } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Roles(['waiter'])
  @Get()
  findAll() {
    return this.settingsService.get();
  }

  @Patch()
  update(@Body() updateSettingDto: UpdateSettingDto) {
    return this.settingsService.update(updateSettingDto);
  }
}
