import { Model, QueryFilter, QueryOptions, Types  } from "mongoose";

export abstract class AbstractRepository<T> {
 protected constructor(private readonly model: Model<T>) {}


public async create(data : any){
    return this.model.create(data)
}

public async update(filter:QueryFilter<T>, newData: QueryFilter<T>, options?: QueryOptions<T>){
    return this.model.findOneAndUpdate(filter, newData, { new: true, ...options })
}


public async delete(filter:QueryFilter<T>){
    return this.model.deleteOne(filter)
}

public async deleteMany(filter: QueryFilter<T>){
    return this.model.deleteMany(filter)
}

async getOne (filter: QueryFilter<T>){
    return this.model.findOne(filter);
}

async getById (id: string){
    return this.model.findById(id);
}

async find (filter: QueryFilter<T>, options?: QueryOptions<T>){
    return this.model.find(filter, null, options);
}
}


