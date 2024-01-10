import { Model } from 'mongoose';

export abstract class AbstractCrudService<
  TSchema,
  TCreateEntity,
  TUpdateEntity extends Partial<TSchema>
> {
  protected abstract model: Model<TSchema>;
  
  public findAll() {
    return this.model.find();
  }

  public create(createEntity: TCreateEntity) {
    return this.model.create(createEntity);
  }

  public findOne(id: string) {
    return this.model.findById(id);
  }

  public update(id: string, updateEntity: TUpdateEntity) {
    return this.model.findByIdAndUpdate(id, updateEntity);
  }

  public delete(id: string) {
    return this.model.findByIdAndDelete(id);
  }
}
