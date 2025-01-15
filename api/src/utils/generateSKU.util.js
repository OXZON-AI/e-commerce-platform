import crypto from "crypto";

export const generateSKU = (slug, attributes) => {
  const abbreviatedSlug = slug.slice(0, 3);
  const abbreviatedAttributes = attributes
    .map((attribute) => {
      const name = String(attribute.name).trim().toLowerCase();
      const value = String(attribute.value).trim().toLowerCase();
      return `${name[0]}-${value[0]}`;
    })
    .join("-");

  const sku = `${abbreviatedSlug}-${abbreviatedAttributes}-${Date.now()}`;
  const hash = crypto.createHash("sha256").update(sku).digest("hex");

  return hash.slice(0, 10);
};
