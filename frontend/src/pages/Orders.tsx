import { ReactElement, useEffect, useState } from "react";
import TableHOC from "../components/admin/TableHOC";
import { Column } from "react-table";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../types/reducer-types";
import { useMyOrdersQuery } from "../redux/api/orderAPI";
import toast from "react-hot-toast";
import { CustomError } from "../types/api.types";
import { Skeleon } from "../components/Loader";
type DataType = {
  _id: string;
  amount: number;
  quantity: number;
  discount: number;
  status: ReactElement;
  action: ReactElement;
};

const columns: Column<DataType>[] = [
  {
    Header: "ID",
    accessor: "_id",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];
const Orders = () => {
  const [rows, setRows] = useState<DataType[]>([]);
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  const {
    data: { data } = {},
    isLoading,
    isError,
    error,
  } = useMyOrdersQuery(user?._id as string);

  useEffect(() => {
    if (data) {
      setRows(
        data.map((order) => {
          return {
            _id: order._id,
            amount: order.total,
            discount: order.discount,
            status: (
              <span
                className={
                  order.status === "Processing"
                    ? "red"
                    : order.status === "Shipped"
                    ? "green"
                    : "purple"
                }
              >
                {order.status}
              </span>
            ),
            quantity: order.orderItems.reduce(
              (total, order) => total + order.quantity,
              0
            ),
            action: <Link to={`/admin/transaction/${order._id}`}>Manage</Link>,
          };
        })
      );
    }
  }, [data]);
  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Orders",
    rows.length > 6
  )();

  if (isError) toast.error((error as CustomError).data.message);
  return (
    <div className="container">
      <h1>{isLoading ? <Skeleon length={15} /> : Table}</h1>
    </div>
  );
};

export default Orders;
