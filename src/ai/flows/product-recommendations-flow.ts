'use server';
/**
 * @fileOverview This file provides an AI-powered product recommendation flow for the Thrift Clothing Plug store.
 *
 * - recommendProducts - A function that generates personalized product recommendations.
 * - ProductRecommendationsInput - The input type for the recommendProducts function.
 * - ProductRecommendationsOutput - The return type for the recommendProducts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductRecommendationsInputSchema = z.object({
  availableProducts: z
    .array(z.object({ id: z.string(), name: z.string() }))
    .describe('A list of all available products with their IDs and names.'),
  browsingHistory: z
    .array(z.string())
    .describe('A list of product names or descriptions that the user has previously viewed.'),
  popularItems: z
    .array(z.string())
    .describe('A list of currently popular or trending product names or descriptions in the store.'),
  preferences: z
    .string()
    .optional()
    .describe('Optional: A short description of the user\'s stated style preferences (e.g., "vintage denim", "boho chic").'),
});
export type ProductRecommendationsInput = z.infer<typeof ProductRecommendationsInputSchema>;

const ProductRecommendationsOutputSchema = z.object({
  productIds: z
    .array(z.string())
    .describe('A list of up to 4 product IDs for the recommended items. These IDs must be from the provided availableProducts list.'),
});
export type ProductRecommendationsOutput = z.infer<typeof ProductRecommendationsOutputSchema>;

export async function recommendProducts(
  input: ProductRecommendationsInput
): Promise<ProductRecommendationsOutput> {
  return productRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productRecommendationsPrompt',
  input: {schema: ProductRecommendationsInputSchema},
  output: {schema: ProductRecommendationsOutputSchema},
  prompt: `You are an expert fashion stylist specializing in personalized recommendations for a thrift store named "Thrift Clothing Plug".
Your goal is to suggest relevant thrift clothing items to a shopper based on their past browsing activity, general popular items, and their stated preferences.

Here is the list of all available products you can choose from:
{{#each availableProducts}}
  - ID: {{{this.id}}}, Name: {{{this.name}}}
{{/each}}

Consider the following information to generate your recommendations:

User's browsing history:
{{#if browsingHistory}}
  {{#each browsingHistory}}
    - {{{this}}}
  {{/each}}
{{else}}
  (No browsing history available)
{{/if}}

Currently popular items across the store:
{{#if popularItems}}
  {{#each popularItems}}
    - {{{this}}}
  {{/each}}
{{else}}
  (No popular items available)
{{/if}}

User preferences (if provided):
{{#if preferences}}
  {{{preferences}}}
{{else}}
  (No specific preferences provided)
{{/if}}

Based on the above, please provide a list of up to 4 product IDs for personalized thrift clothing recommendations. The IDs must be selected from the list of available products.`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
});

const productRecommendationsFlow = ai.defineFlow(
  {
    name: 'productRecommendationsFlow',
    inputSchema: ProductRecommendationsInputSchema,
    outputSchema: ProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input, { model: 'googleai/gemini-pro' });
    return output!;
  }
);
