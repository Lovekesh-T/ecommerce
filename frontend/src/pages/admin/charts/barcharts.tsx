import { useSelector } from "react-redux";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { BarChart } from "../../../components/admin/Charts";
import { RootType } from "../../../redux/store";
import { CustomError } from "../../../types/api.types";
import toast from "react-hot-toast";
import { Skeleon } from "../../../components/Loader";
import { useBarQuery } from "../../../redux/api/dashboardAPI";
import { getLastMonths } from "../../../utils/getLastMonth";

const Barcharts = () => {
  const { user } = useSelector((state: RootType) => state.userReducer);
  const {
    data: { data: barCharts } = {},
    error,
    isError,
    isLoading,
  } = useBarQuery(user?._id as string);

  if (isError) toast.error((error as CustomError).data.message);
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        {isLoading ? (
          <Skeleon length={20} />
        ) : (
          barCharts !== undefined && (
            <>
              <h1>Bar Charts</h1>
              <section>
                <BarChart
                  data_2={barCharts.users}
                  data_1={barCharts.product}
                  title_1="Products"
                  title_2="Users"
                  bgColor_1={`hsl(260, 50%, 30%)`}
                  bgColor_2={`hsl(360, 90%, 90%)`}
                  labels={getLastMonths(6)}
                />
                <h2>Top Products & Top Customers</h2>
              </section>

              <section>
                <BarChart
                  horizontal={true}
                  data_1={barCharts.order}
                  data_2={[]}
                  title_1="Orders"
                  title_2=""
                  bgColor_1={`hsl(180, 40%, 50%)`}
                  bgColor_2=""
                  labels={getLastMonths(12)}
                />
                <h2>Orders throughout the year</h2>
              </section>
            </>
          )
        )}
      </main>
    </div>
  );
};

export default Barcharts;
