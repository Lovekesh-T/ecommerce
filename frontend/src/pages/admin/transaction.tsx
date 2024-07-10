import { ReactElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../types/reducer-types";
import { useAllOrdersQuery } from "../../redux/api/orderAPI";
import { CustomError } from "../../types/api.types";
import toast from "react-hot-toast";
import { Skeleon } from "../../components/Loader";

interface DataType {
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "user",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
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

const Transaction = () => {
  const [rows, setRows] = useState<DataType[]>([]);

  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  const {
    data: { data } = {},
    isLoading,
    isError,
    error,
  } = useAllOrdersQuery(user?._id as string);

  useEffect(() => {
    if (data) {
      setRows(
        data.map((order) => {
          return {
            user: order.user.name,
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
  if (isError) toast.error((error as CustomError).data.message);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Transactions",
    rows.length > 6
  )();
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleon length={20} /> : Table}</main>
    </div>
  );
};

export default Transaction;
