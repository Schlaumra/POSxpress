import { Injectable } from '@nestjs/common';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Settings } from './schemas/settings.schema';
import { Model } from 'mongoose';

@Injectable()
export class SettingsService {
  constructor(@InjectModel(Settings.name) private settingsModel: Model<Settings>) {}

  get() {
    return this.settingsModel.findOne({version: 1})
  }

  update(updateSettingDto: UpdateSettingDto) {
    return this.settingsModel.findOneAndUpdate({version: 1}, updateSettingDto)
  }
}
