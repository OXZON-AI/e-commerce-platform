import Exceljs from "exceljs";

export const generateOrdersExcel = (orders) => {
  const workbook = new Exceljs.Workbook();

  const ordersSheet = workbook.addWorksheet("Orders");
  const itemsSheet = workbook.addWorksheet("Order Items");
  const paymentsSheet = workbook.addWorksheet("Payments");

  ordersSheet.columns = [
    { header: "Order ID", key: "_id" },
    { header: "User ID", key: "user" },
    { header: "Email", key: "email" },
    { header: "Total Amount", key: "totalAmount" },
    { header: "Status", key: "status" },
    { header: "Created At", key: "createdAt" },
  ];

  itemsSheet.columns = [
    { header: "Order ID", key: "orderId" },
    { header: "Item Variant", key: "variant" },
    { header: "Quantity", key: "quantity" },
    { header: "Subtotal", key: "subTotal" },
  ];

  paymentsSheet.columns = [
    { header: "Order ID", key: "orderId" },
    { header: "Transaction ID", key: "transactionId" },
    { header: "Amount", key: "amount" },
    { header: "Brand", key: "brand" },
    { header: "Last 4 Digits", key: "last4" },
    { header: "Discount", key: "discount" },
    { header: "Refund ID", key: "refundId" },
  ];

  orders.forEach((order) => {
    ordersSheet.addRow({
      _id: order._id,
      user: order.user,
      email: order.email,
      totalAmount: order.payment.amount,
      status: order.status,
      createdAt: new Date(order.createdAt).toISOString(),
    });

    paymentsSheet.addRow({
      orderId: order._id,
      transactionId: order.payment.transactionId,
      amount: order.payment.amount,
      brand: order.payment.brand,
      last4: order.payment.last4,
      discount: order.payment.discount,
      refundId: order.payment.refundId || null,
    });

    order.items.forEach((item) => {
      itemsSheet.addRow({
        orderId: order._id,
        variant: item.variant,
        quantity: item.quantity,
        subTotal: item.subTotal,
      });
    });
  });

  return workbook;
};

export const generateProductsExcel = (data) => {
  const workbook = new Exceljs.Workbook();

  const productsSheet = workbook.addWorksheet("Product");
  const variantsSheet = workbook.addWorksheet("Variants");
  const imagesSheet = workbook.addWorksheet("Images");
  const attributesSheet = workbook.addWorksheet("Attributes");

  productsSheet.columns = [
    { header: "Product ID", key: "_id" },
    { header: "Name", key: "name" },
    { header: "Slug", key: "slug" },
    { header: "Short Description", key: "shortDescription" },
    { header: "Detailed Description", key: "detailedDescription" },
    { header: "Category ID", key: "category" },
    { header: "Brand", key: "brand" },
    { header: "Created At", key: "createdAt" },
    { header: "Updated At", key: "updatedAt" },
  ];

  variantsSheet.columns = [
    { header: "Product ID", key: "productId" },
    { header: "Variant ID", key: "_id" },
    { header: "Price", key: "price" },
    { header: "Compare At Price", key: "compareAtPrice" },
    { header: "Stock", key: "stock" },
    { header: "SKU", key: "sku" },
    { header: "Is Default", key: "isDefault" },
    { header: "Cost", key: "cost" },
    { header: "Product ID", key: "product" },
    { header: "Created At", key: "createdAt" },
    { header: "Updated At", key: "updatedAt" },
  ];

  imagesSheet.columns = [
    { header: "Variant ID", key: "variantId" },
    { header: "Image ID", key: "_id" },
    { header: "Image URL", key: "url" },
    { header: "Alt Text", key: "alt" },
    { header: "Is Default", key: "isDefault" },
  ];

  attributesSheet.columns = [
    { header: "Variant ID", key: "variantId" },
    { header: "Attribute ID", key: "_id" },
    { header: "Attribute Name", key: "name" },
    { header: "Attribute Value", key: "value" },
  ];

  data.forEach((item) => {
    productsSheet.addRow({
      _id: item.product._id,
      name: item.product.name,
      slug: item.product.slug,
      shortDescription: item.product.description.short,
      detailedDescription: item.product.description.detailed,
      category: item.product.category,
      brand: item.product.brand,
      ratingsAverage: item.product.ratings.average,
      ratingsCount: item.product.ratings.count,
      createdAt: new Date(item.product.createdAt).toISOString(),
      updatedAt: new Date(item.product.updatedAt).toISOString(),
    });

    item.variants.forEach((variant) => {
      variantsSheet.addRow({
        _id: variant._id,
        productId: item.product._id,
        price: variant.price,
        compareAtPrice: variant.compareAtPrice,
        cost: variant.cost,
        stock: variant.stock,
        sku: variant.sku,
        isDefault: variant.isDefault,
        createdAt: new Date(variant.createdAt).toISOString(),
        updatedAt: new Date(variant.updatedAt).toISOString(),
      });

      variant.images.forEach((image) => {
        imagesSheet.addRow({
          _id: image._id,
          variantId: variant._id,
          url: image.url,
          alt: image.alt || "",
          isDefault: image.isDefault,
        });
      });

      variant.attributes.forEach((attribute) => {
        attributesSheet.addRow({
          _id: attribute._id,
          variantId: variant._id,
          name: attribute.name,
          value: attribute.value,
        });
      });
    });
  });

  return workbook;
};
