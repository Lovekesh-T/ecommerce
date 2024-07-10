import { ReactElement, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useSelector } from "react-redux";
import { RootType } from "../../redux/store";
import {
  useAllUsersQuery,
  useDeleteUserMutation,
} from "../../redux/api/userAPI";
import toast from "react-hot-toast";
import { CustomError } from "../../types/api.types";
import { Skeleon } from "../../components/Loader";
import { responseToast } from "../../utils/feature";

interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "avatar",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Customers = () => {
  const {
    userReducer: { user },
  } = useSelector((state: RootType) => state);
  const [rows, setRows] = useState<DataType[]>([]);

  const {
    data: { data } = {},
    error,
    isLoading,
    isError,
  } = useAllUsersQuery(user?._id as string);
  const [deleteUser] = useDeleteUserMutation();
  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Customers",
    rows.length > 6
  )();

  const deleteHandler = async (id: string) => {
    const res = await deleteUser({ userId: id, adminId: user?._id as string });
    responseToast(res, null, "");
  };

  useEffect(() => {
    if (data) {
      setRows(
        data.map((user) => ({
          avatar: (
            <img
              alt={user.name}
              style={{
                borderRadius: "50%",
              }}
              src={user.photo}
            />
          ),
          name: user.name,
          email: user.email,
          gender: user.gender,
          role: user.role,
          action: (
            <button onClick={() => deleteHandler(user._id)}>
              <FaTrash />
            </button>
          ),
        }))
      );
    }
  }, [data]);

  if (isError) toast.error((error as CustomError).data.message);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleon length={20} /> : Table}</main>
    </div>
  );
};

export default Customers;
