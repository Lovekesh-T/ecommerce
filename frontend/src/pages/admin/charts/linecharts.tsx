import { useSelector } from "react-redux";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { LineChart } from "../../../components/admin/Charts";
import { getLastMonths } from "../../../utils/getLastMonth";
import { RootType } from "../../../redux/store";
import { CustomError } from "../../../types/api.types";
import toast from "react-hot-toast";
import { Skeleon } from "../../../components/Loader";
import { useLineQuery } from "../../../redux/api/dashboardAPI";

const Linecharts = () => {
  const { user } = useSelector((state: RootType) => state.userReducer);
  const {
    data: { data: lineCharts } = {},
    error,
    isError,
    isLoading,
  } = useLineQuery(user?._id as string);

  if (isError) toast.error((error as CustomError).data.message);
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        {isLoading ? (
          <Skeleon length={20} />
        ) : (
          lineCharts !== undefined && (
            <>
              <h1>Line Charts</h1>
              <section>
                <LineChart
                  data={lineCharts?.users}
                  label="Users"
                  borderColor="rgb(53, 162, 255)"
                  labels={getLastMonths(12)}
                  backgroundColor="rgba(53, 162, 255, 0.5)"
                />
                <h2>Active Users</h2>
              </section>
              <section>
                <LineChart
                  data={lineCharts?.product}
                  backgroundColor={"hsla(269,80%,40%,0.4)"}
                  borderColor={"hsl(269,80%,40%)"}
                  labels={getLastMonths(12)}
                  label="Products"
                />
                <h2>Total Products (SKU)</h2>
              </section>
              <section>
                <LineChart
                  data={lineCharts?.revenue}
                  backgroundColor={"hsla(129,80%,40%,0.4)"}
                  borderColor={"hsl(129,80%,40%)"}
                  label="Revenue"
                  labels={getLastMonths(12)}
                />
                <h2>Total Revenue </h2>
              </section>
              <section>
                <LineChart
                  data={lineCharts?.discount}
                  backgroundColor={"hsla(29,80%,40%,0.4)"}
                  borderColor={"hsl(29,80%,40%)"}
                  label="Discount"
                  labels={getLastMonths(12)}
                />
                <h2>Discount Allotted </h2>
              </section>
            </>
          )
        )}
      </main>
    </div>
  );
};

export default Linecharts;
