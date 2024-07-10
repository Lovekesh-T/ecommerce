import { Document } from "mongoose";
import { Product } from "../models/product.model.js";
import { NewOrderRequestBody } from "../types/type.js";

export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
  if (lastMonth === 0) return thisMonth * 100;
  const percent = (thisMonth / lastMonth) * 100;
  return +percent.toFixed(0);
};

export const getInventories = async () => {
  const categoriesCount = await Product.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalCount = categoriesCount.reduce(
    (total, item) => item.count + total,
    0
  );

  const categoryCount = categoriesCount.map((item) => {
    return {
      [item._id]: Math.round((item.count / totalCount) * 100),
    };
  });

  return categoryCount;
};

interface MyDocument extends Document {
  createdAt: Date;
  discount?: number;
  total?: number;
}

 type FuncProps = {
  length: number;
  docArr: MyDocument[];
  today: Date;
  property?: "discount" | "total";
};

export const getChartData = ({
  length,
  docArr,
  today,
  property,
}: FuncProps): number[] => {
  const data = new Array(length).fill(0);

  docArr.forEach((doc) => {
    const creationDate = doc.createdAt;
    const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

    if (monthDiff < length) {
      data[length - monthDiff - 1] += property ? doc[property]! : 1;
    }
  });

  return data;
};
