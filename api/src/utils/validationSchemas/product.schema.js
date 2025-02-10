import Joi from "joi";

const validAttribtues = [
  "color",
  "size",
  "storage",
  "ram",
  "processor",
  "display",
  "battery",
  "operating system",
  "camera",
  "connectivity",
  "gpu",
  "ports",
  "weight",
];

export const createProductSchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.object({
    short: Joi.string().trim().required(),
    detailed: Joi.string().trim(),
  }),
  category: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Category must be a valid ObjectId",
    }),
  brand: Joi.string().trim().default("No brand"),
  variants: Joi.array()
    .items(
      Joi.object({
        attributes: Joi.array()
          .items(
            Joi.object({
              name: Joi.string()
                .trim()
                .lowercase()
                .valid(...validAttribtues)
                .required(),
              value: Joi.string().trim().lowercase().required(),
            })
          )
          .min(1)
          .custom((attributes, helpers) => {
            const names = attributes.map((attribute) => attribute.name);
            const duplicates = names.filter(
              (name, i) => names.indexOf(name) !== i
            );

            if (duplicates.length > 0) {
              return helpers.message(`Duplicate attributes ${duplicates}`);
            }

            return attributes;
          })
          .required(),
        price: Joi.number().min(1).less(Joi.ref("compareAtPrice")).required(),
        compareAtPrice: Joi.number().min(1).required(),
        cost: Joi.number().min(1).required(),
        images: Joi.array()
          .items(
            Joi.object({
              url: Joi.string().uri().trim().required().messages({
                "string.empty": "Image url cannot be empty",
                "string.uri": "Image url must be a valid URI",
              }),
              alt: Joi.string().trim(),
              isDefault: Joi.boolean(),
            })
          )
          .min(1)
          .custom((images, helpers) => {
            const urls = images.map((image) => image.url);
            const duplicates = urls.filter((url, i) => urls.indexOf(url) !== i);

            if (duplicates.length > 0) {
              return helpers.message(`Duplicate urls ${duplicates}`);
            }

            return images;
          })
          .required(),
        isDefault: Joi.boolean(),
      })
    )
    .min(1)
    .required(),
});

export const getProductSchema = Joi.object({
  slug: Joi.string().trim().required(),
});

export const getProductsSchema = Joi.object({
  search: Joi.string().trim(),
  category: Joi.string().trim(),
  brand: Joi.string().trim(),
  sortBy: Joi.string().trim().valid("ratings", "price"),
  sortOrder: Joi.when("sortBy", {
    is: Joi.exist(),
    then: Joi.string().trim().valid("asc", "desc"),
    otherwise: Joi.forbidden(),
  }),
  minPrice: Joi.when("maxPrice", {
    is: Joi.exist(),
    then: Joi.number().less(Joi.ref("maxPrice")),
    otherwise: Joi.number().min(1),
  }),
  maxPrice: Joi.number().min(1),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).default(10),
});

export const updateProductSchema = Joi.object({
  pid: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Product id must be a valid ObjectId",
    }),
  name: Joi.string().trim(),
  description: Joi.object({
    short: Joi.string().trim(),
    detailed: Joi.string().trim(),
  }),
  category: Joi.string()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Category must be a valid ObjectId",
    }),
  brand: Joi.string().trim(),
});

export const deleteProductSchema = Joi.object({
  pid: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Product id must be a valid ObjectId",
    }),
});

export const createVariantSchema = Joi.object({
  pid: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Product id must be a valid ObjectId",
    }),
  attributes: Joi.array()
    .items(
      Joi.object({
        name: Joi.string()
          .trim()
          .lowercase()
          .valid(...validAttribtues)
          .required(),
        value: Joi.string().trim().lowercase().required(),
      })
    )
    .min(1)
    .required(),
  price: Joi.number().min(1).less(Joi.ref("compareAtPrice")).required(),
  compareAtPrice: Joi.number().required(),
  cost: Joi.number().min(1).required(),
  images: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().uri().trim().required().messages({
          "string.empty": "Image url cannot be empty",
          "string.uri": "Image url must be a valid URI",
        }),
        alt: Joi.string().trim(),
        isDefault: Joi.boolean(),
      })
    )
    .min(1)
    .required(),
  isDefault: Joi.boolean(),
});

export const updateVariantSchema = Joi.object({
  pid: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Product id must be a valid ObjectId",
    }),
  vid: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Variant id must be a valid ObjectId",
    }),
  toAdd: Joi.object({
    attributes: Joi.array()
      .items(
        Joi.object({
          name: Joi.string()
            .trim()
            .lowercase()
            .valid(...validAttribtues)
            .required(),
          value: Joi.string().trim().lowercase().required(),
        })
      )
      .custom((attributes, helpers) => {
        const names = attributes.map((attribute) => attribute.name);
        const duplicates = names.filter((name, i) => names.indexOf(name) !== i);

        if (duplicates.length > 0) {
          return helpers.message(`Duplicate attributes ${duplicates}`);
        }

        return attributes;
      })
      .default([]),
    images: Joi.array()
      .items(
        Joi.object({
          url: Joi.string().uri().trim().required().messages({
            "string.empty": "Image url cannot be empty",
            "string.uri": "Image url must be a valid URI",
          }),
          alt: Joi.string().trim(),
          isDefault: Joi.boolean(),
        })
      )
      .custom((images, helpers) => {
        const urls = images.map((image) => image.url);
        const duplicates = urls.filter((url, i) => urls.indexOf(url) !== i);

        if (duplicates.length > 0) {
          return helpers.message(`Duplicate urls ${duplicates}`);
        }

        return images;
      })
      .default([]),
  }),
  toChange: Joi.object({
    attributes: Joi.array().items(
      Joi.object({
        name: Joi.string()
          .trim()
          .lowercase()
          .valid(...validAttribtues)
          .required(),
        value: Joi.string().trim().lowercase().required(),
        _id: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required()
          .messages({
            "string.pattern.base": "Attribute id must be a valid ObjectId",
          }),
      })
    ),
    images: Joi.array().items(
      Joi.object({
        url: Joi.string().uri().trim().required().messages({
          "string.empty": "Image url cannot be empty",
          "string.uri": "Image url must be a valid URI",
        }),
        alt: Joi.string().trim(),
        isDefault: Joi.boolean(),
        id: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required()
          .messages({
            "string.pattern.base": "Image id must be a valid ObjectId",
          }),
      })
    ),
  }),
  toRemove: Joi.object({
    attributes: Joi.array()
      .items(
        Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required()
          .messages({
            "string.pattern.base": "Attribute id must be a valid ObjectId",
          })
      )
      .default([]),
    images: Joi.array()
      .items(
        Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required()
          .messages({
            "string.pattern.base": "Image id must be a valid ObjectId",
          })
      )
      .default([]),
  }),
  price: Joi.when("compareAtPrice", {
    is: Joi.exist(),
    then: Joi.number().min(1).less(Joi.ref("compareAtPrice")),
    otherwise: Joi.number().min(1),
  }),
  compareAtPrice: Joi.number().min(1),
  cost: Joi.number().min(1),
  stock: Joi.number().integer(),
  isDefault: Joi.boolean(),
});

export const deleteVariantSchema = Joi.object({
  pid: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Product id must be a valid ObjectId",
    }),
  vid: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Variant id must be a valid ObjectId",
    }),
});

export const recommendationsSchema = Joi.object({
  limit: Joi.number().min(1).default(10),
});

export const relatedProductsSchema = Joi.object({
  cid: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Category id must be a valid ObjectId",
    }),
  limit: Joi.number().min(1).default(10),
});
