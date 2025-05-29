import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";


export const productRouter = createTRPCRouter ({
    createProduct: publicProcedure
    .input(
        z.object({
            name: z.string(),
            sku: z.string(),
            price: z.string(),
            cost: z.string(),
            quantity : z.string(),
            description : z.string(),
            image64: z.string().optional(),
        })
    )
    .mutation(async({input ,ctx})=>{
            const  {db} = ctx;
    const product = await db.product.create({
        data: {
          name: input.name,
          sku: input.sku,
          price: parseFloat(input.price),
          cost: parseFloat(input.cost),
          quantity: parseInt(input.quantity),
          description: input.description,
          image: input.image64,
        },
      });
        }),

}); 

