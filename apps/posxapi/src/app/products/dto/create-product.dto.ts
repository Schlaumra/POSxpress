import { Ingredient } from "libs/interface"

export class CreateProductDto {
    name: string
    price: number
    tags: string[]
    inStock: boolean
    ingredients?: Ingredient[]
    info?: string
    note?: string
}
